/// noyaas#6586 \\\

const Discord = require('discord.js');
const client = new Discord.Client({
    owner: "config.id"
});
const config = require("./config.json");
const prefix = config.prefix;
const moment = require('moment');
const request = require('request');
const fetch = require('node-fetch');
const mysql = require('mysql');
const sequelize = require('sequelize');
const cron = require("cron");
const db = mysql.createConnection({
    host: '144.76.234.52',
    user: 'u2_dCj1Y6zNMK',
    password: 'RG89TzZ^3l7r1!MofA^1o1HD',
    database: 's2_noyaas',
})

client.on('ready', () => {
    console.log(`BOT ZOSTAL URUCHOMIONY!`)
    console.log(`Zalogowany jako: ${client.user.tag}!`)
    client.user.setActivity("Infinity Services")
});

function nuke() {
    let kanal = "721728821899952212";
    client.channels.get(kanal).bulkDelete(100).then(() => {
        client.channels.get(kanal).bulkDelete(100).then(() => {
            client.channels.get(kanal).bulkDelete(100).then(() => {
                client.channels.get(kanal).bulkDelete(100).then(() => {
                    client.channels.get(kanal).bulkDelete(100).then(() => {
                        client.channels.get(kanal).bulkDelete(100).then(() => {
                            client.channels.get(kanal).bulkDelete(100).then(() => {
                                client.channels.get(kanal).bulkDelete(100).then(() => {
                                    client.channels.get(kanal).bulkDelete(100).then(() => {
                                        client.channels.send(`**Chat has been purged.**\nhttps://tenor.com/view/explosion-mushroom-cloud-atomic-bomb-bomb-boom-gif-4464831`)
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

let job1 = new cron.CronJob('00 00 00,12 * * *', nuke);
job1.start();

client.on('message', async message => {
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);
    let sayMessage = args.join(" ");

    if(message.content === `${prefix}generate`){
        db.query(`SELECT * FROM admin WHERE client = "${message.member.id}"`, (err, rows) => {
            if (err) throw err;
            if (rows.length == 1) {
                let code = "infinity_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                message.author.send(`**Your code is here!**\n*${code}*`)
                db.query("INSERT INTO `s2_noyaas`.`keys` (`key`) VALUES (?)", [code])
            } else {
                message.reply(`**You don't have permissions!**`)
            }
        })
    } else if(command === `${prefix}admin`) {
            db.query(`SELECT * FROM admin WHERE client = "${message.member.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length == 1) {
                    if(args[0]) {
                        db.query(`SELECT * FROM admin WHERE client = "${args[0]}"`, (err, rows) => {
                            if (err) throw err;
                            if (rows.length == 1) {
                                message.reply(`**This user is already on admin list!**`)
                            } else {
                                message.reply(`**Successfully added to admin list!**`)
                                db.query("INSERT INTO admin (client) VALUES (?)", [args[0]]);
                            }
                        })
                    } else {
                        let embed = new Discord.RichEmbed()
                        .setColor("#d63031")
                        .setTitle("**Give me client id to add!**")
                        message.channel.send(embed)
                    }
                } else {
                    message.reply(`**You don't have permissions!**`)
            }
        })
    } else if(command === `${prefix}unadmin`) {
        db.query(`SELECT * FROM admin WHERE client = "${message.member.id}"`, (err, rows) => {
            if (err) throw err;
            if (rows.length == 1) {
                if(args[0]) {
                    db.query(`SELECT * FROM admin WHERE client = "${args[0]}"`, (err, rows) => {
                        if (err) throw err;
                        if (rows.length != 1) {
                            message.reply(`**This user isn't an admin!**`)
                        } else {
                            message.reply(`**Successfully deleted from admin list!**`)
                            db.query("DELETE FROM `s2_noyaas`.`admin` WHERE `client`=? LIMIT 1;", [args[0]]);
                        }
                    })
                    } else {
                        message.reply(`**Give me client id to add!**`)
                    }
                } else {
                    message.reply(`**You don't have permissions!**`)
            }
        })
    } else if(command === `${prefix}redeem`) {
        if(args[0]) {
            db.query("SELECT * FROM `s2_noyaas`.`keys` WHERE `key`=? AND `client`=? AND `used`=?", [args[0], "NULL", "0"], (err, rows) => {
                if (err) throw err;
                if (rows.length == 1) {
                    db.query("SELECT * FROM `s2_noyaas`.`keys` WHERE `client`=? AND `used`=?", [message.member.id, "1"], (err, rows) => {
                        if (err) throw err;
                        if (rows.length == 1) {
                            message.reply(`**You have already our product!**`)
                        } else {
                            message.reply(`**Key successfully redeemed!**`)
                            db.query("UPDATE `s2_noyaas`.`keys` SET `client`=?, `used`='1' WHERE  `key`=? AND `client`='NULL' AND `used`='0'", [message.member.id, args[0]])
                        }
                    })
                } else {
                    message.reply(`**This key is already in use or does not exists!**`)
                }
            })
        } else {
            message.reply(`**Give me a code to redeem!**`)
        }
    } else if(message.content === `${prefix}download`) {
            db.query("SELECT * FROM `s2_noyaas`.`keys` WHERE `client`=? ", [message.member.id], (err, rows) => {
                if (err) throw err;
                if (rows.length == 1) {
                    db.query(`SELECT * FROM download WHERE link IS NOT NULL AND id="1"`, (err, rows, fields) => {
                        if (err) throw err;
                        if (rows.length == 1) {
                            let rezult = rows[0].link;
                            message.reply(`**Check dm's!**`)
                            message.author.send(`**Download link:** ` + rezult)
                        } else {
                            message.reply(`**I can't find download link! Report this to admin.**`)
                        }
                    })
                } else {
                    message.reply(`**Buy our product first!**`)
            }
        })
    } else if(command === `${prefix}downloadlink`) {
        db.query(`SELECT * FROM admin WHERE client = "${message.member.id}"`, (err, rows) => {
            if (err) throw err;
            if (rows.length == 1) {
                if(args[0]) {
                    message.reply(`**Download link successfully set!**`)
                    db.query("UPDATE `s2_noyaas`.`download` SET `link`=? WHERE `id`='1'", [args[0]])
                } else {
                    message.reply(`**Give me download link!**`)
                }
            } else {
                message.reply(`**You don't have permissions!**`)
            }
        })
    } else if(message.content === `${prefix}nuke`) {
        db.query(`SELECT * FROM admin WHERE client = "${message.member.id}"`, (err, rows) => {
            if (err) throw err;
            if (rows.length == 1) {
        let kanal = "721728821899952212";
        message.channel.bulkDelete(100).then(() => {
            message.channel.bulkDelete(100).then(() => {
                message.channel.bulkDelete(100).then(() => {
                    message.channel.bulkDelete(100).then(() => {
                        message.channel.bulkDelete(100).then(() => {
                            message.channel.bulkDelete(100).then(() => {
                                message.channel.bulkDelete(100).then(() => {
                                    message.channel.bulkDelete(100).then(() => {
                                        message.channel.bulkDelete(100).then(() => {
                                            message.channel.send(`**Chat has been purged.**\nhttps://tenor.com/view/explosion-mushroom-cloud-atomic-bomb-bomb-boom-gif-4464831`)
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })
    } else if (message.content === `${prefix}help`) {
        db.query(`SELECT * FROM admin WHERE client = "${message.member.id}"`, (err, rows) => {
            if (err) throw err;
            if (rows.length == 1) {
            message.channel.send(`**Check dm's!**`)
            message.author.send(`**Me commands**\n!generate - Command to generate new code\n!redeem - Command to redeem key\n!delete - Command to delete a key\n!admin - Command to make someone admin (use client id as argument)\n!unadmin - Command to delete someone from admin list (use client id as argument)\n!download - Command to get download link\n!downloadlink - Command to set new download link\n!nuke - Command to manually nuke channel`)
            } else {
                message.channel.send(`This command is only for **ADMINS**`)
            }
        })
    } else if(command === `${prefix}delete`) {
        db.query(`SELECT * FROM admin WHERE client = "${message.member.id}"`, (err, rows) => {
            if (err) throw err;
            if (rows.length == 1) {
                if(args[0]) {
                db.query("SELECT * FROM `s2_noyaas`.`keys` WHERE `key`=?", [args[0]], (err, rows) => {
                    if (err) throw err;
                    if (rows.length == 1) {
                        db.query("DELETE FROM `s2_noyaas`.`keys` WHERE `key`=? LIMIT 1;", [args[0]]);
                        message.reply(`**The key has ben successfully deleted!**`)
                    } else {
                        message.reply(`**This key does not exists!**`)
                    }
                })
                } else {
                    message.reply(`**Give me key to delete!**`)
                }
            } else {
                message.reply(`**You don't have permissions!**`)
            }
        })
    } else if(message.content.startsWith(`${prefix}`)) {
        message.reply(`**This command does not exists!**`)
    }
})

client.login(process.env.BOT_TOKEN);
