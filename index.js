require("dotenv").config();
const TelegramAPI = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = process.env.SECRET_KEY;
const bot = new TelegramAPI(token, { polling: true });

bot.setMyCommands([
    { command: "/start", description: "Greeting" },
    { command: "/info", description: "Get info about user" },
    { command: "/game", description: "Game about guessing numbers" },
]);

const chats = [];

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Now, I will think about a number from 0 to 9, and you have to guess what number it is!")
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Let's go!", gameOptions);
}

const start = () => {
    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const username = msg.chat.first_name

        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/4.webp")
            return bot.sendMessage(chatId, "Welcome back to me!")
        }

        if (text === "/info") {
            return bot.sendMessage(chatId, "Your name is: " + username)
        }

        if (text === "/game") {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, "I can't understand...")
    });

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (+data === +chats[chatId]) {
            return await bot.sendMessage(chatId, `Congratulations, you are right! Your choise: ${data} ; Bot choise: ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Wrong, you are not right! Your choise: ${data} ; Bot choise: ${chats[chatId]}`, againOptions);
        }
    })
}

start();