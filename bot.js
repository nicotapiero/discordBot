const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);



var Discord = require('discord.io');
var logger = require('winston');
//var auth = require('./auth.json');

//🤐



const mongoose = require('mongoose');
//import mongoose from 'mongoose';
//mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



const MongoClient = require('mongodb').MongoClient;
const uri = process.env.URI;
mongoose.connect(uri, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

client.on('error', console.error.bind(console, 'connection error:'));
client.once('open', function() {
  // we're connected!
  console.log('good')
});

//client.connection.on('connected', function(){console.log('teets')});












const reactionSchema = new Schema({
  emoji: String,
  count: Number
});
//module.exports = Reaction;
var Reaction = mongoose.model('Reaction', reactionSchema);


//bot.login(process.env.TOKEN);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
  token: process.env.TOKEN,
  autorun: true
});


//require('http').createServer().listen(process.env.PORT);

//Reaction.findOneAndDelete({emoji: '🤐'}).then((doc) => {})








bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var cmd = message.substring(1);

    if (cmd == 'reactStats') {
      var string = "Reactions:\n"
      Reaction.find({ }, function (err, reactions) {
        if (err) {
          console.log(err)
        }

        if (reactions == null) {
          console.log('no reactions!')
        } else {
          console.log(reactions);
          console.log('stats')

          reactions.sort(function(a, b) {
            return parseFloat(b.count) - parseFloat(a.count);
          });

          console.log(reactions)

          reactions.forEach(function(element) {
            //var letters = /^[0-9a-zA-Z]+$/;
            //if(element.emoji.match(letters)){
            //if (element.emoji.startsWith()) {
            string = string + element.emoji + ": " + element.count + "\n";
            //  } else {

            //string = string + element.emoji + ": " + element.count + "\n";
            //}
          })
          console.log(string);



          bot.sendMessage({
            to: channelID,
            message: string
          });
        }});









      } else if (cmd == 'bestSmashBoy'){
        bot.sendMessage({
          to: channelID,
          message: "Alp"
        });
      }
    }

    console.log(message.reaction);

  });


  bot.on("messageReactionAdd", function(messageReaction, user) {
    console.log(messageReaction);

    var emoji;
    //<:lul:593130632717140032>;
    //var letters = /^[0-9a-zA-Z]+$/;
    if(messageReaction.d.emoji.id != null){
      emoji = "<:" + messageReaction.d.emoji.name + ":" + messageReaction.d.emoji.id + '>'
    } else {
      emoji = messageReaction.d.emoji.name;
    }



    var reaction = new Reaction({
      emoji: emoji,
      count: 1
    });

    reaction.markModified('anything');
    console.log(reaction)


    Reaction.findOne({ emoji: emoji }, function (err, reactions) {
      if (err) {
        console.log(err)
      }

      if (reactions == null) {
        console.log('no reactions!')

        reaction.save(function(err, updatedReaction) {
          if(err){
            console.log(err);
            return;
          }
          console.log(emoji+ ' successfully saved.');
        });




      } else {

        var count = reactions.count + 1;
        Reaction.findOneAndUpdate(
          {"emoji": emoji},
          {$set: {"count":count}},{returnNewDocument : true},
          function(err, doc){
            if(err){
              console.log("Something wrong when updating record!");
            }
            console.log(doc);
          })};

          //console.log(reactions.count);
          //console.log('now ' +count)






        });







        //Auth.findOne({nick: 'noname'}, function(err,obj) { console.log(obj); });


      });


      bot.on("messageReactionRemove", function(messageReaction, user){
        console.log(`a reaction is removed from a message`);
        console.log(messageReaction);

        var emoji;
        //<:lul:593130632717140032>;
        //var letters = /^[0-9a-zA-Z]+$/;
        if(messageReaction.d.emoji.id != null){
          emoji = "<:" + messageReaction.d.emoji.name + ":" + messageReaction.d.emoji.id + '>'
        } else {
          emoji = messageReaction.d.emoji.name;
        }

        Reaction.findOne({ emoji: emoji }, function (err, reactions) {
          if (err) {
            console.log(err)
          }



          var count = reactions.count - 1;
          if (count === 0) {
            //console.log(count + "achh")
            Reaction.findOneAndDelete({emoji: emoji}).then((doc) => {})
          } else {
            Reaction.findOneAndUpdate(
              {"emoji": emoji},
              {$set: {"count":count}},{returnNewDocument : true},
              function(err, doc){
                if(err){
                  console.log("Something wrong when updating record!");
                }
                console.log(doc);
              })
            }
          });

          //console.log(reactions.count);
          //console.log('now ' +count)











        });
