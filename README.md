# KlaxyBot - Telegram to Discord Bridge

A Node.js bot that monitors Telegram channels and forwards messages to Discord.

## Features

- 🤖 Monitors multiple Telegram channels
- 📢 Forwards messages to Discord with embeds
- 🔄 Prevents duplicate messages
- 🌐 Web server for hosting compatibility
- ⚡ Runs continuously on Render

## Setup

### 1. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Enable these permissions:
   - Send Messages
   - Read Message History
   - View Channels
   - Message Content Intent
5. Copy the bot token
6. Invite the bot to your server with proper permissions

### 2. Environment Variables

Create a `.env` file with:
```
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here
```

### 3. Deploy on Render

1. **Connect your GitHub repository**
2. **Create a new Web Service**
3. **Configure the service:**
   - **Name**: `klaxybot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables:**
   - `DISCORD_BOT_TOKEN` = your bot token
   - `DISCORD_CHANNEL_ID` = your channel ID

5. **Deploy!**

## Monitoring Channels

Currently monitoring:
- `@Rainbet_Bonus` (Rainbet Bonus)
- `@Rainbet_Vip` (Rainbet VIP)

## Troubleshooting

### Module Not Found Error
If you see `Error: Cannot find module 'express'`:
1. Make sure `package.json` is in the root directory
2. Check that all dependencies are listed in `package.json`
3. Redeploy on Render - it should auto-install dependencies

### Discord Permission Issues
1. Make sure bot has proper permissions in your server
2. Check that the channel ID is correct
3. Ensure the bot is in the server

### Port Binding Issues
The bot includes a web server that binds to port 3000 (or `process.env.PORT`). This satisfies Render's web service requirements.

## Files

- `index.js` - Main bot file
- `package.json` - Dependencies and scripts
- `.gitignore` - Git ignore rules
- `README.md` - This file

## How it Works

1. Bot connects to Discord
2. Sends startup message once
3. Every 2 minutes, checks Telegram channels for new messages
4. Forwards new messages to Discord with embeds
5. Prevents duplicate messages using message hashing

## Support

If you encounter issues:
1. Check the Render logs for error messages
2. Verify your environment variables are set correctly
3. Ensure your Discord bot has proper permissions 