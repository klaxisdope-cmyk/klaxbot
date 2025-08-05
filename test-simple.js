require('dotenv').config();

console.log('🧪 Testing environment variables...');

console.log('DISCORD_BOT_TOKEN:', process.env.DISCORD_BOT_TOKEN ? '✅ Set' : '❌ Missing');
console.log('DISCORD_CHANNEL_ID:', process.env.DISCORD_CHANNEL_ID ? '✅ Set' : '❌ Missing');

if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('❌ DISCORD_BOT_TOKEN is missing!');
    process.exit(1);
}

if (!process.env.DISCORD_CHANNEL_ID) {
    console.error('❌ DISCORD_CHANNEL_ID is missing!');
    process.exit(1);
}

console.log('✅ All environment variables are set!');
console.log('Ready to deploy the main bot.'); 