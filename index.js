const commando = require('discord.js-commando');

const DEV = require('./token.js');
var db = require('./db.js');

prefix = '!';

//Connect to discord server
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

    const channelIds = [];
    bot.guilds.forEach(guild => {
        guild.channels.forEach(channel => {
            if (channel.type === 'text') {
                channelIds.push(channel.id);
            }
        });
    });


    for (let i = 0; i < channelIds.length; i++) {
        const generalChannel = bot.channels.get(channelIds[ i ]);
        generalChannel.send('Meeeeee');
    }
});
