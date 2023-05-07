'use strict';

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows response time.'),

  run: ({ client, interaction }) => {
    if (client.ws.ping !== -1)
      interaction.reply(`Response time: ${client.ws.ping}ms`);
    else {
      interaction.reply(
        `Unable to retrieve the response time at this moment.  Please try again later...`
      );
    }
  },
};
