require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const config = {
    telegram: {
        channels: [
            { id: '@Rainbet_Bonus', name: 'Rainbet Bonus' },
            { id: '@Rainbet_Vip', name: 'Rainbet VIP' }
        ],
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

// Store last messages to avoid duplicates
let lastMessages = {
    '@Rainbet_Bonus': '',
    '@Rainbet_Vip': ''
};

// Track if startup message was sent
let startupMessageSent = false;

// Function to send message to Discord
async function sendToDiscord(message, channelName = 'Telegram Channel') {
    try {
        const channel = discordClient.channels.cache.get(config.discord.channelId);
        if (!channel) {
            console.error('❌ Discord channel not found');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`📢 Message from ${channelName}`)
            .setDescription(message)
            .setColor(0x00ff00)
            .setTimestamp()
            .setFooter({ text: 'via KlaxyBot' });

        await channel.send({ embeds: [embed] });
        console.log(`✅ Message sent to Discord from ${channelName}: ${message.substring(0, 50)}...`);
    } catch (error) {
        console.error('❌ Error sending to Discord:', error.message);
    }
}

// Function to send startup message (only once)
async function sendStartupMessage() {
    if (startupMessageSent) return;
    
    try {
        const channel = discordClient.channels.cache.get(config.discord.channelId);
        if (!channel) return;

        const channelList = config.telegram.channels.map(ch => ch.name).join(', ');
        const embed = new EmbedBuilder()
            .setTitle('🤖 KlaxyBot')
            .setDescription(`Bot is now online!\n📢 Monitoring: ${channelList}`)
            .setColor(0x00ff00)
            .setTimestamp()
            .setFooter({ text: 'via KlaxyBot' });

        await channel.send({ embeds: [embed] });
        startupMessageSent = true;
        console.log('✅ Startup message sent');
    } catch (error) {
        console.error('❌ Error sending startup message:', error.message);
    }
}

// Function to scrape messages from a single Telegram channel
async function scrapeTelegramChannel(channelConfig) {
    try {
        console.log(`📡 Checking ${channelConfig.name}...`);
        
        // Scrape from t.me
        const channelUrl = `${config.telegram.baseUrl}/${channelConfig.id.replace('@', '')}`;
        
        const response = await axios.get(channelUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        // Look for message elements
        const messages = $('.tgme_widget_message_text');
        
        if (messages.length > 0) {
            const latestMessage = messages.last().text().trim();
            const messageHash = Buffer.from(latestMessage).toString('base64').substring(0, 10);
            
            if (messageHash !== lastMessages[channelConfig.id] && latestMessage.length > 0) {
                lastMessages[channelConfig.id] = messageHash;
                await sendToDiscord(latestMessage, channelConfig.name);
            }
        }
        
    } catch (error) {
        console.error(`❌ Error scraping ${channelConfig.name}:`, error.message);
    }
}

// Function to scrape messages from all Telegram channels
async function scrapeAllTelegramChannels() {
    try {
        console.log('📡 Checking for new messages from Telegram channels...');
        
        // Check each channel
        for (const channel of config.telegram.channels) {
            await scrapeTelegramChannel(channel);
            // Small delay between requests to be respectful
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
    } catch (error) {
        console.error('❌ Error scraping Telegram messages:', error.message);
        // Don't send any fallback messages - just log the error
    }
}

// Main function
async function startBridge() {
    console.log('🚀 Starting Telegram-Discord Bridge...');
    console.log('📢 Monitoring channels:');
    config.telegram.channels.forEach(channel => {
        console.log(`   - ${channel.name} (${channel.id})`);
    });

    try {
        // Start Discord client
        discordClient.on('ready', () => {
            console.log(`✅ Discord bot logged in as ${discordClient.user.tag}`);
            
            // Send startup message only once
            sendStartupMessage();
            
            // Start checking for messages every 2 minutes
            setInterval(scrapeAllTelegramChannels, 120000);
        });

        await discordClient.login(config.discord.token);

        console.log('🎉 Bridge is running! Monitoring for new messages...');

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

// Web server routes
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'KlaxyBot is running',
        monitoring: config.telegram.channels.map(ch => ch.name)
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Start web server
app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

// Check if required environment variables are set
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