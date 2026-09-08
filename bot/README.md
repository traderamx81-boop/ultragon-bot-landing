# Ultragon Bot — Local setup and deployment

This folder contains a minimal but extensible Node.js Discord bot using discord.js v14. It implements slash commands and a simple command loader.

Quick start
1. Copy the example env and fill it in:
   ```bash
   cp bot/.env.example bot/.env
   # Edit bot/.env and add DISCORD_TOKEN and CLIENT_ID (and optional GUILD_ID for testing)
   ```
2. Install dependencies:
   ```bash
   cd bot
   npm install
   ```
3. Start the bot:
   ```bash
   npm start
   ```
4. If you set GUILD_ID in .env the slash commands will register to that guild immediately for fast testing. Otherwise they will register globally (can take up to an hour).

Environment variables (.env)
- DISCORD_TOKEN — your bot token (keep secret)
- CLIENT_ID — your application (bot) client ID
- GUILD_ID — optional: development guild id to register commands quickly
- INVITE_PERMISSIONS — OAuth2 permissions integer (default: 8 = administrator)

Docker
Build and run with Docker:

```bash
cd bot
docker build -t ultragon-bot:latest .
docker run --env-file .env -d ultragon-bot:latest
```

Notes & next steps
- Add a database (Postgres/Redis) for persistent configuration across guilds (prefixes, automations, etc.)
- Add more commands in `bot/commands/` — follow the pattern: export { data: SlashCommandBuilder, execute(interaction) }
- Consider hosting on Render/Fly/Heroku/your VPS and using a process manager (PM2) or container platform.

Security
Never commit your DISCORD_TOKEN or .env. Use GitHub Secrets when deploying via Actions or set environment variables in your hosting provider.
