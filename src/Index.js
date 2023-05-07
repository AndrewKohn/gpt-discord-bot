'use strict';

require('dotenv/config');
const { Client, IntentsBitField, Partials } = require('discord.js');
const { createBotMessage } = require('./OpenAI');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageTyping,
    IntentsBitField.Flags.DirectMessageReactions,
  ],
  partials: [Partials.Channel, Partials.Message],
});

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
});

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

// client.on('messageCreate', message => {
//   // Direct messages
//   if (message.channel.type === 1) {
//     try {
//       createBotMessage(client, message);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // Channel messages
//   if (message.channel.id !== CHANNEL_ID) return; // Assigned to specific server channel, comment this line to have it respond to all channels in server
//   try {
//     createBotMessage(client, message);
//   } catch (err) {
//     console.log(err);
//   }
// });

// toggle comment with other messageCreate to switch consuming openAI tokens
let messageCount = 1;
client.on('messageCreate', message => {
  if (message.author.bot) return; // Ignore self and other bot messages
  if (message.content.startsWith('!') || message.content.startsWith('/'))
    return; // ignores commands if the message starts with prefix
  if (message.channel.id !== CHANNEL_ID) return; // Assigned to specific server channel, comment this line to have it respond to all channels in server
  message.reply(`${messageCount++}    |  "${message}"`);
});

client.login(TOKEN);
