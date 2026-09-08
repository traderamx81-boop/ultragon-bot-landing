const { SlashCommandBuilder } = require('@discordjs/builders');

const responses = [
  "Absolutely.",
  "No way.",
  "It is certain.",
  "Ask again later.",
  "Very doubtful.",
  "Signs point to yes.",
  "I have my doubts.",
  "Without a doubt.",
  "Maybe?",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask Ultragon anything')
    .addStringOption(opt => opt.setName('question').setDescription('Your question').setRequired(true)),
  async execute(interaction) {
    const q = interaction.options.getString('question');
    const pick = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply({ content: `🎱 **Question:** ${q}\n**Answer:** ${pick}` });
  }
};
