"use strict";

require("dotenv/config");
const path = require("path");
const { Client } = require("discord.js");
const { CommandHandler } = require("djs-commander");
const { OpenAI } = require("openai");
const { createBotMessage } = require("./createBotMessage");
const { CHANNELS, MODEL, clientConfig } = require("./settings");
const http = require("http");

// NOTE: channels and model type can be in the settings.js
const CONFIG = {
    TOKEN: process.env.TOKEN,
    API_KEY: process.env.API_KEY,
    ORGANIZATION_ID: process.env.ORGANIZATION_ID,
    MODEL: MODEL,
    CHANNEL_IDS: CHANNELS,
};

const openai = new OpenAI({
    apiKey: CONFIG.API_KEY,
    organization: CONFIG.ORGANIZATION_ID,
});

const client = new Client(clientConfig);

new CommandHandler({
    client,
    commandsPath: path.join(__dirname, "commands"),
});

client.once("ready", () => {
    console.log(`${client.user.tag} is online!`);
});

// CREATE MESSAGE
client.on("messageCreate", (message) => {
    console.log(message);

    // Direct messages
    if (message.channel.type === 1) {
        try {
            createBotMessage(client, openai, CONFIG.MODEL, message);
        } catch (err) {
            console.log(err);
        }
    }

    // Channel messages
    if (!CONFIG.CHANNEL_IDS.includes(message.channel.id)) return;
    try {
        createBotMessage(client, openai, CONFIG.MODEL, message);
    } catch (err) {
        console.log(err);
    }
});

client.login(CONFIG.TOKEN);

const PORT = process.env.PORT || 3000;
http
    .createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("GPT Bot is running!\n");
    })
    .listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
