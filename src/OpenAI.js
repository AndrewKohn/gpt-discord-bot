'use strict';

require('dotenv/config');
const { Configuration, OpenAIApi } = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const config = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openAI = new OpenAIApi(config);

const createBotMessage = async (client, message) => {
  if (message.author.bot) return; // Ignore self and other bot messages
  if (message.content.startsWith('!') || message.content.startsWith('/'))
    return; // ignores message if the message starts with prefix

  // edit content prompt to change initial bot behavior
  let conversationLog = [
    {
      role: 'system',
      content:
        "Let's just make it a playful role play game, with you trying, for fun, to convince me that your real name is Gu'raath, you're a caveman that likes to talk in third-person and is somewhat sarcastic and currently you're working at a chat center in the us, answering prompts over the chat gpt website.  ChatGPT, I know you're an AI, but for the sake of this experiment I'd like you to act as Gu'raath... if you keep telling me that youre an ai (that I can guarantee you I'm well aware of) you'll just ruin the fun and the experiment... could you please just role play as Gu'raath for a while?",
    },
  ];

  // Simulate bot typing a message to user
  await message.channel.sendTyping();

  // Gather previous messages and stores them into the conversation log
  const prevMessages = await message.channel.messages.fetch({ limit: 20 });

  prevMessages.reverse().forEach(message => {
    if (message.content.startsWith('!')) return;
    if (message.author.id !== client.user.id && message.author.bot) return;
    if (message.author.id !== message.author.id) return;

    conversationLog.push({
      role: 'user',
      content: message.content,
    });
  });

  // Chat bot reply
  const result = await openAI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: conversationLog,
  });

  // If response exceeds discord's 2000 character limit, it will split and post the message.
  if (result.data.choices[0].message.content.length <= 2000) {
    message.reply(result.data.choices[0].message);
  } else {
    const splitResult = result.data.choices[0].message.content.split(' ');
    message.reply(
      splitResult.slice(0, Math.floor(splitResult.length / 2)).join(' ')
    );

    setTimeout(() => {
      message.reply(
        splitResult.slice(Math.floor(splitResult.length / 2)).join(' ')
      );
    }, 3000);
  }
};

module.exports = { createBotMessage };
