/**
 * Created by juliusz.jakubowski@gmail.com on 18.11.18.
 */
const commando = require('discord.js-commando');

const DEV = require('./token.js');
const userCreate = require('./db/methods.js');

const prefix = DEV.PREFIX;

const bot = new commando.Client({
    commandPrefix: prefix,
    owner: [ DEV.OWNER ]
});

//Register Commands
bot.registry.registerGroup('count', 'count');
bot.registry.registerGroup('math', 'math');
// bot.registry.registerDefaults();
// bot.registry.registerCommandsIn(__dirname + '/commands');
bot.login(DEV.TOKEN);

bot.on('ready', () => {
    console.log('The bot is ready to go');

    bot.guilds.forEach(guild => {
        guild.channels.forEach(channel => {
            if (channel.type === 'text' && channel.name === 'whitegoatbot') {
                const wgChanell = bot.channels.get(channel.id);
                wgChanell.send('meeeeee');
            }
        });
    });

    userCreate('john');
});

bot.on('message', ( message ) => {
    console.log('message');
    if (message.author.bot === false && message.content.startsWith(prefix)) {
        console.log('message passed');
        userCreate('maria');
    }
});
