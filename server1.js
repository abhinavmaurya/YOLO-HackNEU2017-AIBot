/**
 * Created by abhinavmaurya on 11/3/16.
 */
var express = require('express')
//var http=require('http');
//var client = http.createClient(80,'https://api.api.ai/v1');
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
//var require = require('request');
var apiai = require('apiai');
var app_ai = apiai("6d88c37356c947429cfe97a91dec8bf7");
var options = {
    sessionId: '123454675'
}
app.set('port', (process.env.PORT || 5000))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
app.use(bodyParser.json())
// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})
// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'mBot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        console.log("Event :");
        console.log(event);
        sender = event.sender.id
        console.log("sender before api ai");
        console.log(sender);
        if (event.message && event.message.text) {
            text = event.message.text;

            var request = app_ai.textRequest(text,options);
            request.on('response', function(response) {
                console.log("APIAI Success");
                console.log(response);
            });

            request.on('error', function(error) {
                console.log("APIAI Error");
                console.log(error);
            });

            request.end();

            //sendTextMessage(sender, "Text received, echo: " + JSON.stringify(req.body))
            sendTextMessage(sender, "Text received, echo: ");
        }
    }
    res.sendStatus(200)
})
var token = "EAAZAWk0r8CTEBADPTpGGCn0VwHZBPx0oDDxj7oJTTVTbzlh9i96HQasJCou6Fgul139ZBbxpM496gr4YNjck7iO8zup4mCaKT3cBveC3ASrCvakjH7CQHkL6GfuxNXzedZCTasQezb2Tm8IJZCeZCM0qKFOzpZBFpGpAnQXaYZB13wZDZD"

function sendTextMessage(sender, text) {
    console.log("send text message ");
    console.log(sender);
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})