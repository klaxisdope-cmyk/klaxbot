# Telegram to Discord Bridge

A simple bot that monitors the `@Rainbet_Bonus` Telegram channel and forwards messages to your Discord channel.

## 🚀 Quick Setup

### Step 1: Get Your Discord Bot Token
Since you already have a Discord bot set up, you just need:
- Your Discord bot token
- Your Discord channel ID

### Step 2: Get Discord Channel ID
1. Enable Developer Mode in Discord (Settings > Advanced)
2. Right-click your target channel
3. Click "Copy ID"

### Step 3: Create .env file
Create a file called `.env` with:
```env
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
```

### Step 4: Deploy on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Set these settings:
   - **Name**: `telegram-discord-bridge`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: `Free`
6. Add your environment variables in the "Environment" tab
7. Click "Create Web Service"

### Step 5: Test
- The bot will start automatically
- Check your Discord channel for the startup message
- The bot will monitor the Telegram channel every 2 minutes

## 📁 Files
- `index.js` - Main bot file
- `package.json` - Dependencies
- `.env` - Your secrets (create this)

## 🔧 How it works
- Scrapes https://t.me/Rainbet_Bonus every 2 minutes
- Checks for new messages
- Forwards them to Discord with beautiful embeds
- Avoids duplicate messages

## ⚠️ Notes
- Only works for public Telegram channels
- Respects rate limits (2-minute intervals)
- Web scraping may break if t.me changes their website

## 🎉 That's it!
Your bot will now automatically forward messages from the Telegram channel to Discord! 