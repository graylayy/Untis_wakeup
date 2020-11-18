const TeleBot =require("telebot");
const config=require("./config");

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
            
    
    
    }else if (selection==="ios"){
        bot.sendMessage(id, "Dann musst du selbst herausfinden, wie ich dir einen Wecker stelllen kann!");
    }else if(selection==="was anderes"){
        bot.sendMessage(id, "Dann musst du selbst herausfinden, wie ich dir einen Wecker stelllen kann!");
    }else{
        bot.sendMessage(id, "😕 Bitte benutze du unteren Schaltflächen um zu antworten!",{ask: 'firmware'});
    }
});

async function main(msg){
    const get = await bot.getMe()
    console.log(msg);
}

bot.start();