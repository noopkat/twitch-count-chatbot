const chalk = require('chalk');
const IRC = require('irc-framework');
const skateboard = require('skateboard');
const inquirer = require('inquirer'); 

const bot = new IRC.Client();
let count = 0;
let username = '';
let token = '';
let channelName = '';
let socket = null;

const questions = [
  {
    message: 'What is our twitch username?',
    name: 'username',
    type: 'input',
  },
  {
    message: 'Please enter your twitch IRC chat token:',
    name: 'token',
    type: 'input',
  },
  {
    message: 'Please enter the twitch channel(# followed by channel name):',
    name: 'channel',
    type: 'input',
  }

];

function botConnect() {
  return new Promise((resolve) => {
    resolve(bot.connect({
          host: 'irc.chat.twitch.tv',
          port: 6667,
          nick: username,
          password: token
        }));
  });
};

function botRegister() {
  return new Promise((resolve) => {
    bot.on('registered', () => {
      const channel = bot.channel(channelName);
      channel.join();
      resolve('\n'+ 'registration happened!' +'\n');
    });
  })
};

inquirer.prompt(questions).then((answers) => {
  
  username = answers.username;
  token = answers.token;
  channelName = answers.channel;

  botConnect().then(() => {
    botRegister().then((status) => {
      console.log(chalk.green(status));
      console.log(chalk.green('joined channel!'));
      skateboard({port: 3000}, (stream) => {
        socket = stream;
      });
    
      bot.matchMessage(/^\d\d?$/, (event) => {
        const n = parseInt(event.message);
        count = (n - count === 1) ? n : 0;
        socket.write(count.toString()); 
      });
    })
  });

});
