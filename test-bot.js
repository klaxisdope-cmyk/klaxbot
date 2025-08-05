require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

console.log('🧪 Testing Discord bot connection...');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log('✅ Bot connected successfully!');
    console.log(`Bot name: ${client.user.tag}`);
    console.log(`Bot ID: ${client.user.id}`);
    
    // Test channel access
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) {
        console.log(`✅ Channel found: ${channel.name}`);
        console.log(`Channel ID: ${channel.id}`);
    } else {
        console.log('❌ Channel not found!');
        console.log('Available channels:');
        client.channels.cache.forEach(ch => {
            console.log(`- ${ch.name} (${ch.id})`);
        });
    }
    
    client.destroy();
});

client.on('error', (error) => {
    console.error('❌ Bot error:', error.message);
    client.destroy();
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
    console.error('❌ Login failed:', error.message);
    console.log('Please check your bot token and permissions.');
}); 