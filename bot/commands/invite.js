const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get the invite link to add Ultragon to your server'),
  async execute(interaction) {
    const clientId = process.env.CLIENT_ID || 'YOUR_CLIENT_ID';
    const perms = process.env.INVITE_PERMISSIONS || '8';
    const scopes = encodeURIComponent('bot applications.commands');
    const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=${scopes}&permissions=${perms}`;
    await interaction.reply({ content: `Invite Ultragon: ${url}`, ephemeral: true });
  }
};
