const botsettings = require("./botsettings.json");
const Discord = require("discord.js");
const prefix = botsettings.prefix;
const steem = require("steem")
const steemAccount = botsettings.steem.account;
const steemAccountKey = botsettings.steem.key;
const bot = new Discord.Client({ disableEveryone: true })

bot.on("ready", async () => {
    console.log(`Bot is ready ${bot.user.username}`);
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch (e) {
        console.log(e.stack);
    }
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (command === `${prefix}upvote`) {
        var weightPercentage = parseFloat(args[0]) * 100;
        var postAuthor = args[1].split("@")[1].split("/")[0];
        var postLink = args[1].split("@")[1].split("/")[1];
        upvote(postAuthor, postLink, message.channel, weightPercentage);
    } else {
        let embed = new Discord.RichEmbed()
            .setAuthor(`@${message.author.username}`)
            .setDescription("I am not programmed to execute this command.")
            .setColor("RED")
            .addField("Usage:", "$upvote 100 https://steemit.com/@author/post-link")
        message.channel.sendEmbed(embed);
    }
});

function upvote(author, permalink, channel, weightPercentage) {
        steem.broadcast.voteAsync(steemAccountKey, steemAccount, author, permalink, weightPercentage, (err, result) => {
            if (err) {
                let embed = new Discord.RichEmbed()
                    .setColor("RED")
                    .setDescription("Not able to vote")
                    .addField("Error", err)
                channel.send(embed);
            }
            if (result) {
                let embed = new Discord.RichEmbed()
                    .setColor("GREEN")
                    .setDescription(`Done! @${author}/${permalink} has received a ${weightPercentage / 100}% upvote from @${steemAccount}!`);
                channel.send(embed);
            }
        }).catch(err => {
            console.log(err.stack);
        });
}

bot.login(botsettings.token);