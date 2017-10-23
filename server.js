require('dotenv').config();
const IRC = require('irc-framework');
const skateboard = require('skateboard');

const bot = new IRC.Client();
let count = 0;
let socket = null;

function botConnect(callback) {
  bot.connect({
    host: 'irc.chat.twitch.tv',
    port: 6667,
    nick: process.env.TWITCH_NICK,
    password: process.env.TWITCH_TOKEN
  });

  bot.on('registered', () => {
    console.log('reg happened!');

    const channel = bot.channel('#twitchcongiveplz');
    channel.join();
    return callback();
  });
};
botConnect(() => {
  console.log('joined channel!');

  skateboard({port: 3000}, (stream) => {
    socket = stream;
  });

  bot.matchMessage(/^\d\d?$/, (event) => {
    const n = parseInt(event.message);
    count = (n - count === 1) ? n : 0;
    socket.write(count.toString()); 
  });
});


