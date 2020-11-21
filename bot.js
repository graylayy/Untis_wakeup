const TeleBot =require("telebot");
const config=require("./config");
const axios = require('axios');

const bot = new TeleBot({
    token: config.telebot_apikey,
    usePlugins: ['askUser']
});


bot.on(['/start','/hello'], msg => {
    const id=msg.from.id
    bot.sendMessage(id,"Wilkommen, "+msg.from.first_name+" zu dem besten Bot von ganz Telegram!",{replyMarkup: 'hide'});
    setTimeout((id) => {
        let replyMarkup = bot.keyboard([
            [bot.button('JA', 'ja'), bot.button('NEIN', 'nein')]
        ], {resize: true});

        bot.sendMessage(id, "Zuerst eine Frage: Bist du Schüler*in auf dem\nMallincrodt-Gymnasium Dortmund?",{replyMarkup,ask: 'isMAllincrodt'});
    },600,id)
});

bot.on('ask.isMAllincrodt', (msg) => {

    const id = msg.chat.id;
    var selection = msg.text;
    if(selection==="ja"){
        bot.sendMessage(id, "Dann bin ich genau für dich geeignet 🥳",{replyMarkup: 'hide'});

        setTimeout((id) => {
            let replyMarkup = bot.keyboard([
                [bot.button('Android', 'android'), bot.button('iOS', 'ios')],
                [bot.button('was anderes', 'was anderes')]
            ], {resize: true});

            bot.sendMessage(id, "Welsches Betriebssystem nutzt du denn?",{replyMarkup,ask: 'firmware'});
        },700,id)

    }else if(selection==="nein"){
        bot.sendMessage(id, "😥 Schade, dann ist dieser Bot wohl NOCH nicht für dich geeignet!",{replyMarkup: 'hide'});

        setTimeout((id) => {
            bot.sendMessage(id, "Du kannst diesem Bot nun stoppen.");
            main(msg)
        },1000,id)
    } else{
        bot.sendMessage(id, "😕 Bitte benutze du unteren Schaltflächen um zu antworten!",{ask: 'isMAllincrodt'});
    }

});

bot.on('ask.firmware', (msg) => {
    const id = msg.chat.id;
    var selection = msg.text;
    
    //-----Android----
    if(selection=="android"){
       
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton('MacroDroid', {url: 'https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid'})]
        ])
        
        bot.sendMessage(id, "Die App \"MacroDroid\" kann das ereichen, was wir wollen! Bitte öffne nach dem Installieren der App die Datei, welche ich dir gesensedet habe (Alarm_wakeup.macro)",{replyMarkup: 'hide'})
        .then(()=>{
            bot.sendDocument(id, "./Alarm_wakeup.macro",{replyMarkup})
        })
        .then(()=>{
            setTimeout((id) => {
                bot.sendMessage(id, "Schicke mir einfach den Webhook (die URL aus dem roten Berreich), wenn du fertig bist!",{ask: 'webhook'});
            },700,id)
        })
    //----IOS----
    }else if (selection==="ios"){
        bot.sendMessage(id, "Es ist leider aktuell für mich nicht möglch automatisiert einen Wecker für dich zu stellen!",{replyMarkup: 'hide'});
        setTimeout((id) => {
            bot.sendMessage(id, "Du kannst mir aber trotzdem jetzt eine Nachicht mit einem Webhook senden, damit ich ihn zu deiner Weckzeit auslösen kann!",{ask: 'webhook'});
        },1000,id)
    //----weiteres----
    }else if(selection==="was anderes"){
        bot.sendMessage(id, "Dann musst du selbst herausfinden, wie ich dir einen Wecker stelllen kann!",{replyMarkup: 'hide'});
        setTimeout((id) => {
            bot.sendMessage(id, "Schick mir einfach den Webhook, welchen ich zu deiner Weckzeit aktivieren soll, falls du einen Weg herausgefunden hast!",{ask: 'webhook'});
        },1000,id)
    }else{
        bot.sendMessage(id, "😕 Bitte benutze du unteren Schaltflächen um zu antworten!",{ask: 'firmware'});
    }
});

bot.on('ask.webhook', (msg) => {
    const id = msg.chat.id;
    bot.sendMessage(id, "Ich werden Webhook jetzt testen!");
    setTimeout((id) => {
        bot.sendMessage(id, "Bitte schau, ob der Webhook die gewünschte Aktion ausgeführt hat!");
        
        try{
        axios.get(msg.text)
        }catch(e){console.log(e);}
        
        //
        //text in SQL database einfügen!
        //
        
        let replyMarkup = bot.keyboard([
            [bot.button('ja', 'ja'), bot.button('nein', 'nein')]
        ], {resize: true});

        setTimeout((id) => {
            bot.sendMessage(id, "Ist die Aktion ausgeführt worden?",{replyMarkup,ask: 'webhookcorrect'});
        },2500,id)

    },1000,id)
});

bot.on('ask.webhookcorrect', (msg) => {
    const id = msg.chat.id;
    var selection = msg.text;

    if(selection==="ja"){
        bot.sendMessage(id, "Dann sind wir schon fast fertig! 🥳",{replyMarkup: 'hide'});

    }else if(selection==="nein"){
        bot.sendMessage(id, "😥 Dann ist wohl etwas schiefgelaufen! schua nochmal nach, ob der Webhook richtg war un sende ihn mir danach nochmals zu!",{ask: 'webhook',replyMarkup: 'hide'});
    } else{
        bot.sendMessage(id, "😕 Bitte benutze du unteren Schaltflächen um zu antworten!",{ask: 'webhookcorrect'});
    }

});

//Fächerauswahl

//Aktivieren/deaktivieren


/*
async function main(msg){
    const get = await bot.getMe()
    console.log(msg);
}
*/
bot.start();