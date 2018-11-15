const Discord = require('discord.js');
const token = require('./token');

const client = new Discord.Client();

client.on('ready', () => {
    const channelIds = [];
    client.guilds.forEach(guild => {
        // console.log({ guild });
        guild.channels.forEach(channel => {
            if (channel.type === 'text') {
                channelIds.push(channel.id);
            }
        });
    });


    // for (let i = 0; i < channelIds.length; i++) {
    //     const generalChannel = client.channels.get(channelIds[ i ]);
    //     generalChannel.send('Meeeeee');
    // }
});

client.on('message', ( receivedMessage ) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author === client.user) {
        return;
    }
    console.log('msg', receivedMessage.member.guild);

    receivedMessage.channel.send('Message received: ' + receivedMessage.content);
});


client.login(token.TOKEN);
