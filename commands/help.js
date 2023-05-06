'use strict';

const { EmbedBuilder } = require('@discordjs/builders');
const icon = '../assets/discord-bot-avatar.jpg';

module.exports = {
  name: 'help',
  description: 'Displays bot commands',
  execute: async interaction => {
    const moduleEmbed = new EmbedBuilder()
      .setColor(0xffb703)
      .setAuthor({
        name: "Gu'raath Chatbot",
        iconURL: { icon },
      })
      .setTitle('/help')
      .setDescription("A discord chatbot utilizing ChatGPT's API.")
      .addFields({
        name: 'Available Commands:',
        value: `...`,
        inline: true,
      });

    await interaction.reply({
      embeds: [moduleEmbed],
      ephemeral: true,
    });
  },
};
