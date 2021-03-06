//import module
var restify = require("restify");
var builder = require("botbuilder");
var request = require("request");

//Setup Web Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || "3978", function(){
    console.log('%s listening to %s', server.name, server.url);
});

//create chat connector for communicating with the bot framework service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
});

//Listen for messages from users
server.post('/api/messages', connector.listen());

//create your bot with a function to receive messages from user

var bot = new builder.UniversalBot(connector, function(session){
    var id = session.message.text;
    var options = {
        method:"GET",
        url: "https://min-api.cryptocompare.com/data/price", 
        //寫在api url ?後面的參數，要放在qs(key)的Json set內
        qs:{
        fsym: id,
        tsyms:"USD,TWD",
        }, 
        //指定json格式的輸出
        json:true
    }
    request(options, function (error, response, body){
        var stock = body;
        if(stock){
            session.endDialog(`${id}今日價格如下:\nUSD：$${stock.USD} \n新台幣：$${stock.TWD}`);          
        }else{
            session.endDialog(`沒有找到這個加密貨幣!`);
        }
    });
});