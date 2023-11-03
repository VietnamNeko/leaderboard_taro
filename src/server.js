const Discord = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const User = require('./models/user');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const client = new Discord.Client();

const prefix = '-';

app.use(cors({origin:"*",credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

client.once('ready', function(){
    console.log('bot working');
});

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(function(){
    console.log('connected to database');
}).catch(function(err){
    console.log(err);
});

client.on('message', async function(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === 'leaderboard') {
        var highscores = await User.find().sort({score:-1}).limit(10);
        var scores = '';
        if (highscores) {
            for (let i = 1; i < 11; i++) {
                if (highscores.length < i) {
                    break;
                }
                scores = scores + String(i) + '. ' + highscores[i - 1].username + ' - ' + String(highscores[i - 1].score) + '\n ';
            }
        }
        
        

        var embed = new Discord.MessageEmbed()
	        .setColor('#0099ff')
	        .setTitle('Toadz Leaderboard')
            .setDescription(scores)
	        .setThumbnail('https://cdn.discordapp.com/attachments/576848866108899351/899102080101404692/toadz_cover.png')
	        .setTimestamp();
        message.channel.send(embed);
    }
});

app.get('scoreboard', async function(req,res,next){
    var highscores = await User.find().sort({score:-1}).limit(10);
    res.send(JSON.stringify(highscores));
})

app.post('/score', async function(req,res,next) {
    if (req.body.code != 'code') { //small security measure so not anybody can send a request to the server
        res.send('{"response":"false"}');
    }

    if (!req.body.username || !req.body.score || !req.body.playerID) {
        res.send('{"response":"false"}');
    }

    var user = await User.findOne({playerID:Number(req.body.playerID)});
    if (user) {
        if (user.score < Number(req.body.score)) {
            user.score = Number(req.body.score);
            await user.save();
        }
    } else {
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.score = Number(req.body.score);
        newUser.playerID = Number(req.body.playerID);
        await newUser.save();
    }
    res.send('{"response":"saved"}');
});

client.login(process.env.DISCORD_TOKEN);

app.listen(2000, function(){
    console.log('server listening to port 2000');
});