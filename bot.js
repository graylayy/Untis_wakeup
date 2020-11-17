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

    const id = msg.from.id;
    var selection = msg.text;
    console.log(selection);
    if(selection==="ja"){
        console.log("jawoll");
        bot.sendMessage(id, "sehrgut",{replyMarkup: 'hide'});
    }else{
        return bot.sendMessage(id, "Schade, dann ist dieser Bot wohl noch nicht für dich geeignet!",{replyMarkup: 'hide'});
    }

});

bot.start();