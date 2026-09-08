require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // optional: for dev registration
const INVITE_PERMISSIONS = process.env.INVITE_PERMISSIONS || '8';

if (!TOKEN || !CLIENT_ID) {
  console.error('Missing DISCORD_TOKEN or CLIENT_ID in environment. See bot/.env.example');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
const commands = [];
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Register slash commands (guild if GUILD_ID present, otherwise global)
(async () => {
  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    if (GUILD_ID) {
      console.log('Registering guild commands for', GUILD_ID);
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    } else {
      console.log('Registering global commands (can take up to 1 hour to propagate)');
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    }
    console.log('Slash commands registered');
  } catch (err) {
    console.error('Failed to register commands', err);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} — Ultragon is online`);
  client.user.setActivity('doing anything', { type: 'PLAYING' });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error('Command execution error', err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
    }
  }
});

client.login(TOKEN);
