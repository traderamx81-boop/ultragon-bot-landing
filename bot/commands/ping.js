const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency and status'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! WS: ${Math.round(interaction.client.ws.ping)}ms • RTT: ${latency}ms`);
  }
};
