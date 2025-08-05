require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

// Configuration
const config = {
    telegram: {
        channelId: '@Rainbet_Bonus',
        // We'll try to scrape from t.me
        baseUrl: 'https://t.me'
    },
    discord: {
        token: process.env.DISCORD_BOT_TOKEN,
        channelId: process.env.DISCORD_CHANNEL_ID
    }
};

// Initialize Discord client
const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Store last message to avoid duplicates
let lastMessageHash = '';

// Function to send message to Discord
async function sendToDiscord(message, username = 'Telegram Channel') {
    try {
        const channel = discordClient.channels.cache.get(config.discord.channelId);
        if (!channel) {
            console.error('❌ Discord channel not found');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`📢 Message from ${username}`)
            .setDescription(message)
            .setColor(0x00ff00)
            .setTimestamp()
            .setFooter({ text: 'via Telegram Bridge' });

        await channel.send({ embeds: [embed] });
        console.log(`✅ Message sent to Discord: ${message.substring(0, 50)}...`);
    } catch (error) {
        console.error('❌ Error sending to Discord:', error.message);
    }
}

// Function to scrape messages from public Telegram channel
async function scrapeTelegramMessages() {
    try {
        console.log('📡 Checking for new messages from Telegram...');
        
        // Try to scrape from t.me
        const channelUrl = `${config.telegram.baseUrl}/${config.telegram.channelId.replace('@', '')}`;
        
        const response = await axios.get(channelUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        // Look for message elements (this is a simplified approach)
        const messages = $('.tgme_widget_message_text');
        
        if (messages.length > 0) {
            const latestMessage = messages.last().text().trim();
            const messageHash = Buffer.from(latestMessage).toString('base64').substring(0, 10);
            
            if (messageHash !== lastMessageHash && latestMessage.length > 0) {
                lastMessageHash = messageHash;
                await sendToDiscord(latestMessage, config.telegram.channelId);
            }
        }
        
    } catch (error) {
        console.error('❌ Error scraping Telegram messages:', error.message);
        
        // Fallback: send a status message
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        await sendToDiscord(`🔄 Bridge is running - Last check: ${timeString}\n⚠️ Could not fetch new messages`, 'System');
    }
}

// Main function
async function startBridge() {
    console.log('🚀 Starting Telegram-Discord Bridge...');
    console.log('📢 Monitoring public channel: @Rainbet_Bonus');

    try {
        // Start Discord client
        discordClient.on('ready', () => {
            console.log(`✅ Discord bot logged in as ${discordClient.user.tag}`);
            
            // Send a startup message
            sendToDiscord('🤖 Telegram-Discord Bridge is now online!\n📢 Monitoring: @Rainbet_Bonus', 'System');
            
            // Start checking for messages every 2 minutes
            setInterval(scrapeTelegramMessages, 120000);
        });

        await discordClient.login(config.discord.token);

        console.log('🎉 Bridge is running! Monitoring for new messages...');
        console.log('⚠️  Using web scraping to monitor public channel');

        // Keep the process running
        process.on('SIGINT', async () => {
            console.log('🛑 Shutting down...');
            await discordClient.destroy();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error starting bridge:', error.message);
        process.exit(1);
    }
}

// Check if all required environment variables are set
const requiredEnvVars = [
    'DISCORD_BOT_TOKEN',
    'DISCORD_CHANNEL_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '));
    console.error('Please check your .env file');
    process.exit(1);
}

// Start the bridge
startBridge(); 