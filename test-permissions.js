require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

console.log('🧪 Testing bot permissions...');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', async () => {
    console.log(`✅ Bot connected: ${client.user.tag}`);
    
    // Get the target channel
    const targetChannel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    
    if (!targetChannel) {
        console.log('❌ Target channel not found');
        return;
    }
    
    console.log(`📝 Testing permissions for: ${targetChannel.name}`);
    
    // Check bot permissions
    const botMember = targetChannel.guild.members.cache.get(client.user.id);
    const permissions = targetChannel.permissionsFor(botMember);
    
    console.log('🔍 Bot permissions in this channel:');
    console.log('- View Channel:', permissions.has('ViewChannel'));
    console.log('- Send Messages:', permissions.has('SendMessages'));
    console.log('- Read Message History:', permissions.has('ReadMessageHistory'));
    
    // Try to send a test message
    try {
        const embed = new EmbedBuilder()
            .setTitle('🧪 Permission Test')
            .setDescription('This is a test message to check bot permissions.')
            .setColor(0x00ff00)
            .setTimestamp();
        
        await targetChannel.send({ embeds: [embed] });
        console.log('✅ Successfully sent test message!');
        
    } catch (error) {
        console.error('❌ Failed to send message:', error.message);
        
        // Try to send a simple text message
        try {
            await targetChannel.send('🧪 Simple test message');
            console.log('✅ Successfully sent simple message!');
        } catch (simpleError) {
            console.error('❌ Failed to send simple message:', simpleError.message);
        }
    }
    
    // List all channels the bot can see
    console.log('\n📋 All channels bot can access:');
    client.channels.cache.forEach(channel => {
        if (channel.type === 0) { // Text channels only
            const perms = channel.permissionsFor(botMember);
            console.log(`- ${channel.name} (${channel.id}): Send=${perms.has('SendMessages')}`);
        }
    });
    
    client.destroy();
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
    console.error('❌ Login failed:', error.message);
}); 