const { discordAppClientId, discordAppClientSecret, discordAppToken, discordAppGuildId, port} = require('../config.json');

//74.81%

const { randomInt } = require('crypto');
const fs = require("fs");
const isDev = process.argv.length > 0 ? true : false;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:Fr33R011@cluster0.pg7e8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//SITE
var cookieSession = require('cookie-session')
const fetch = require('node-fetch');
const path = require('path');
const mustacheExpress = require('mustache-express');
const express = require('express');
const app = express();
// Register '.mustache' extension with The Mustache Express
app.engine('html', mustacheExpress());
app.set('views', path.join(__dirname,"..","pages"));
app.use('/public', express.static('public'));

//DISCO BOT
/*** 
    const { Client, Intents, ApplicationCommand, Collection } = require('discord.js');
    const discordClient = new Client({intents: [Intents.FLAGS.GUILDS]});
    // discordClient.login(discordAppToken);
    discordClient.login("ODc4OTkyNzQ1NTE0MDA4NTc2.YSJPyQ.DKA5h0r0Dz_oJa59f3gtBW493yU");
    // const dcClient2=new Client({intents: [Intents.FLAGS.GUILDS]});
    const dcClients = [discordClient];


    discordClient.commands = new Collection();
    // dcClient2.commands = new Collection();

    const fns = fs.readdirSync("node_modules/app/bot-functions").filter(file => file.endsWith(".js"));
    const evFiles = fs.readdirSync("node_modules/app/bot-events").filter(file => file.endsWith(".js"));
    const commFolders = fs.readdirSync("node_modules/app/bot-item-commands");

    (async()=>{
        for (file of fns){
            require(`app/bot-functions/${file}`)(dcClients);
        }
        dcClients.handleEvents(evFiles, "app/bot-events");
        dcClients.handleItemCommands(commFolders, "app/bot-item-commands");
        // dcClient2.login("ODgwNDIxODEwMTU0Mzg5NTY1.YSeCtA.6Gv59V0PC0hU_ogfx_YHtuxh2Ik");
    })();
***/


// to do
// when log in from other browser, get code, get me, check if in db, reuse

/*
 * MIDDLEWARE START
 */
// Cookies
app.use(cookieSession({
    name: 'discord-session',
    keys: ["ThePontiacBandit"],
    // Cookie Options
    maxAge: 96 * 60 * 60 * 1000 // 96 hours. 168hrs is access token lifetime from discord
}));

// Auth
app.use(async function (req, res, next) {
    // if cookie
    if(req.path.split("/")[1]=="public"){
        next();
    }else if(req.session.userid){
        client.connect(async (err)=>{
            // if found user id in db
            user = await client.db("test").collection("users").find({id:req.session.userid}).toArray();
            if(user.length>0){
                next();
            }else{
                req.session.userid=undefined;
                return res.sendFile('pages/authorize.html', { root: '.' });
            }
            // client.close();
            // next();
        });
    }else if(req.query.code){
        // {
        //     access_token: 'SHVJ8D8BvZyNkptjBQ56ZHYVJ2gdEz',
        //     expires_in: 604800,
        //     refresh_token: 'EntAYuPr1BxLpVy8RW3S5yX9Y7PTOc',
        //     scope: 'identify',
        //     token_type: 'Bearer'
        // }
        const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: discordAppClientId,
                client_secret: discordAppClientSecret,
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: `http://localhost:${port}/`,
                scope: 'identify',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const oauthData = await oauthResult.json();

        if(oauthData.error){
            return res.sendFile('pages/authorize.html', { root: '.' });
        }else{
            const {access_token, token_type} = oauthData;
            await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${token_type} ${access_token}`,
                },
            })
            .then(result => result.json())
            .then(response => {
                response.access_token = oauthData.access_token;
                response.expires_in = oauthData.expires_in;
                response.refresh_token = oauthData.refresh_token;
                response.scope = oauthData.scope;
                response.token_type = oauthData.token_type;
                
                req.session.userid = response.id;
                
                client.connect(async (err)=>{
                    await client.db("test").collection("users").insertOne(response);
                    client.close(); 
                    next();
                });
                    // {
                    //     id: '669964790264889360',
                    //     username: 'WomboCombo',
                    //     avatar: 'adcb171800df95c9b66a69f2411d21b0',
                    //     discriminator: '4163',
                    //     public_flags: 0,
                    //     flags: 0,
                    //     banner: null,
                    //     banner_color: null,
                    //     accent_color: null,
                    //     locale: 'en-US',
                    //     mfa_enabled: false
                    // }
            });
        }
    }else{
        return res.sendFile('pages/authorize.html', { root: '.' });
    }
});
/*
 * MIDDLEWARE END
 */

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

app.get("/", async(request, response)=>{
    return response.render('index.html', { root: '.', username: "ImaxedOutDefence"});
});









//SET COOKIE / GET COOKIE
// app.get("/cookieExample", async(request, response)=>{
//     request.session.code = request.session.code || "this is a test" + randomInt(100).toString(); 

//     //encoded/hashed value in cookie. Can put seure info in it
//     return response.send("success?");
// });

//GET USER
// app.get("/getUserExample", async({q}, response)=>{
//     var usr = "";
//     client.connect(async (err)=>{
//         usr = client.db("test").collection("users").find({id:"669964790264889360"}).toArray(function(err, result) {
//             if (err) throw err;
//             client.close();
//             return response.send(result);
//         });
//     });
// });

//INSERT USER
// app.get("/insertUserExample", async({q}, response)=>{
//     var usr = "";
    
//     client.connect(async (err)=>{
//         usr = {
//               id: '669964790264889360',
//               username: 'WomboCombo',
//               avatar: 'adcb171800df95c9b66a69f2411d21b0',
//               discriminator: '4163',
//               public_flags: 0,
//               flags: 0,
//               banner: null,
//               banner_color: null,
//               accent_color: null,
//               locale: 'en-US',
//               mfa_enabled: false
//             };
//         const collection = client.db("test").collection("users");
//         await collection.insertOne(usr);
//         // perform actions on the collection object
//         client.close();
//         return response.send(usr);
//     });

// });


// const refreshResult = await fetch('https://discord.com/api/oauth2/token', {
//                                 method: 'POST',
//                                 body: new URLSearchParams({
//                                     client_id: discordAppClientId,
//                                     client_secret: discordAppClientSecret,
//                                     grant_type: 'refresh_token',
//                                     refresh_token: result.refresh_token,
//                                 }),
//                                 headers: {
//                                     'Content-Type': 'application/x-www-form-urlencoded',
//                                 },
//                             });