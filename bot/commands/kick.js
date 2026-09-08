const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(opt => opt.setName('target').setDescription('User to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for kick')),
  async execute(interaction) {
    if (!interaction.memberPermissions.has('KickMembers')) {
      return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
    }
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(reason);
      await interaction.reply({ content: `Kicked ${user.tag} — ${reason}` });
    } catch (err) {
      console.error('Kick failed', err);
      await interaction.reply({ content: 'Failed to kick that member.', ephemeral: true });
    }
  }
};
