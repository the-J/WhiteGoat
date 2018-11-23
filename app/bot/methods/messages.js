/**
 * Created by juliusz.jakubowski@gmail.com on 22.11.18.
 */

const bot = require('../bot.js');
const db = require('../../db/methods.js');
const MTwitch = require('./messagesTwitch.js');
const BOT = require('../../credentials/botCredentials.js');
const prefix = BOT.PREFIX;


const handleMessageAndSendResponse = async function ( message ) {
    if (!message) return console.log('empty message was passed: ', message);

    if (message.system) {
        return sendMessage(message);
        // const embed = new Discord.RichEmbed()
        //     .setTitle("This is your title, it can hold 256 characters")
        //     .setAuthor("Author Name", "https://i.imgur.com/lm8s41J.png")
        //     /*
        //      * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
        //      */
        //     .setColor(0x00AE86)
        //     .setDescription("This is the main body of text, it can hold 2048 characters.")
        //     .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
        //     .setImage("http://i.imgur.com/yVpymuV.png")
        //     .setThumbnail("http://i.imgur.com/p2qNFag.png")
        //     /*
        //      * Takes a Date object, defaults to current date.
        //      */
        //     .setTimestamp()
        //     .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
        //     .addField("This is a field title, it can hold 256 characters",
        //         "This is a field value, it can hold 1024 characters.")
        //     /*
        //      * Inline fields may not display as inline if the thumbnail and/or image is too big.
        //      */
        //     .addField("Inline Field", "They can also be inline.", true)
        //     /*
        //      * Blank field, useful to create some space.
        //      */
        //     .addBlankField(true)
        //     .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);

    }


    if (message.content.startsWith(prefix) && message.content.length > 1 &&
        (!message.author.bot || message.author.bot === false)) {

        const response = {
            chanelId: message.channel.id,
            author: message.author,
            embed: false
        };

        // const params = message.content.split(' ');
        const key = message.content.split(' ')[ 0 ].charAt(1);

        switch (key) {
            case 't':
                return await MTwitch.handleTwitchMessage(message, response);
            default:
                response.content = 'I dont get it, could you repeat ' + message.author + ', pls?';
                response.author = '';
                return sendMessage(response);
        }
    }
};


const sendMessage = function ( message ) {
    bot.bot.channels
        .get(message.chanelId)
        .send(
            message.embed
                ? { embed: message.embed }
                : message.content + ' ' + message.author
        );
};

module.exports.handleMessageAndSendResponse = handleMessageAndSendResponse;
module.exports.sendMessage = sendMessage;
