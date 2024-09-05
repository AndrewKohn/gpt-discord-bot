"use strict";

const { PROMPT } = require("./settings");

const sendMessageInChunks = (
    message,
    content,
    MAX_LENGTH = 2000,
    DELAY = 2000,
) => {
    const chunks = [];

    for (let i = 0; i < content.length; i += MAX_LENGTH) {
        chunks.push(content.slice(i, i + MAX_LENGTH));
    }

    chunks.forEach((chunk, index) => {
        setTimeout(() => {
            message.reply(chunk);
        }, index * DELAY);
    });
};

const createBotMessage = async (client, openai, MODEL, message) => {
    if (message.author.bot) return; // Ignore self and other bot messages
    if (message.content.startsWith("!") || message.content.startsWith("/"))
        return; // ignores message if the message starts with prefix

    let conversationLog = [
        {
            role: "system",
            content: PROMPT,
        },
    ];

    // Simulate bot typing a message to user
    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(
        () => message.channel.sendTyping(),
        5000,
    );

    // Gather previous messages and stores them into the conversation log
    const prevMessages = await message.channel.messages.fetch({ limit: 20 });

    prevMessages.reverse().forEach((message) => {
        if (message.content.startsWith("!")) return;
        if (message.author.id !== client.user.id && message.author.bot) return;
        if (message.author.id !== message.author.id) return;

        conversationLog.push({
            role: "user",
            content: message.content,
        });
    });

    // Chat bot reply
    const result = await openai.chat.completions
        .create({
            model: MODEL,
            messages: conversationLog,
        })
        .catch((err) => console.log("OPENAI ERROR:\n", err));

    clearInterval(sendTypingInterval);

    if (!result) {
        message.reply("REPLY ERROR!");
        return;
    }

    // If response exceeds discord's 2000 character limit, it will split and post the message.
    if (result.choices[0].message.content.length <= 2000) {
        message.reply(result.choices[0].message);
    } else {
        sendMessageInChunks(message, result.choices[0].message.content);
    }
};

module.exports = { createBotMessage };
