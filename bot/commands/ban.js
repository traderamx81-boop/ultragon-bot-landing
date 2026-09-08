const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(opt => opt.setName('target').setDescription('User to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for ban')),
  async execute(interaction) {
    if (!interaction.memberPermissions.has('BanMembers')) {
      return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
    }
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.ban({ reason });
      await interaction.reply({ content: `Banned ${user.tag} — ${reason}` });
    } catch (err) {
      console.error('Ban failed', err);
      await interaction.reply({ content: 'Failed to ban that member.', ephemeral: true });
    }
  }
};
