/**
 * Created by abhinavmaurya on 11/3/16.
 */
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var fs = require('fs');
var users={};

app.set('port', (process.env.PORT || 5000))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
app.use(bodyParser.json())
// Index route
app.post('/', function (req, res) {

    //if(users.hasOwnProperty(req.body.sessionId)){

    if(req.body.result.metadata.intentName == "phone"){
        console.log("phone intent");
        users[req.body.sessionId]=req.body.result.parameters.number;

        var response = {
            "data": {
                "facebook": {
                        "text":"How may I help you today ?:",
                        "quick_replies":[
                            {
                                "content_type":"text",
                                "title":"My Bill",
                                "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                            },
                            {
                                "content_type":"text",
                                "title":"Nearest Store",
                                "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                            },
                            {
                                "content_type":"text",
                                "title":"My Usage",
                                "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                            }
                        ]
                }
            }
        }
        res.json(response);
    } 
    else if(users.hasOwnProperty(req.body.sessionId)){
        console.log("check if session id mapped");

        if(req.body.result.metadata.intentName == "bill"){
            var response = {
                "data": {
                    "facebook": {
                        "attachment":{
                            "type":"template",
                            "payload":{
                                "template_type":"generic",
                                "elements":[
                                    {
                                        "title":"Bill",
                                        "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/Adobe-PD.jpg",
                                        "item_url" :"https://dl.dropboxusercontent.com/u/8913093/mbot/images/bill.pdf",
                                        "subtitle":"November"
                                    },
                                    {
                                        "title":"Bill",
                                        "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/Adobe-PD.jpg",
                                        "item_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/bill.pdf",
                                        "subtitle":"October"
                                    },
                                    {
                                        "title":"Bill",
                                        "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/Adobe-PD.jpg",
                                        "item_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/bill.pdf",
                                        "subtitle": "September"
                                    }
                                ]
                            }
                        }
                    }
                }
            }

            res.json(response);
        }
        else if(req.body.result.metadata.intentName == "store") {
            var lat=42.3538170;
            var long=-71.0586390;
            var response = {
                "data": {
                    "facebook": {
                        "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": {
                                "element": {
                                    "title": "Your current location",
                                    "image_url": "https:\/\/maps.googleapis.com\/maps\/api\/staticmap?size=764x400&center=" + lat + "," + long + "&zoom=25&markers=" + lat + "," + long,
                                    "item_url": "http:\/\/maps.google.com\/maps?q=" + lat + "," + long + "&z=16"
                                }
                            }
                        }
                    }
                    }
                }
            }
            res.json(response);
        }
        else if(req.body.result.metadata.intentName == "usage"){
            /*var response = {
                "data" :{"facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type":"receipt",
                            "recipient_name":"Stephane Crozatier",
                            "order_number":"12345678902",
                            "currency":"USD",
                            "payment_method":"Visa 2345",
                            "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
                            "timestamp":"1428444852",
                            "elements":[
                                {
                                    "title":"Voice Usage",
                                    "subtitle":"100% Soft and Luxurious Cotton",
                                    "quantity":2,
                                    "price":50,
                                    "currency":"USD",
                                    "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
                                },
                                {
                                    "title":"Data Usage",
                                    "subtitle":"100% Soft and Luxurious Cotton",
                                    "quantity":1,
                                    "price":25,
                                    "currency":"USD",
                                    "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
                                },
                                {
                                    "title":"SMS Usage",
                                    "subtitle":"100% Soft and Luxurious Cotton",
                                    "quantity":1,
                                    "price":25,
                                    "currency":"USD",
                                    "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
                                }
                            ],
                            "summary":{
                                "total_cost":56.14
                            }
                        }
                    }
                }}
            }*/
            var response = {
                "data": {
                    "facebook": {
                        "attachment":{
                            "type":"template",
                            "payload":{
                                "template_type":"generic",
                                "elements":[
                                    {
                                        "title":"Data Usage",
                                        "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/ic_usage_data.png",
                                        "subtitle":"100 MB"
                                    },
                                    {
                                        "title":"Voice Usage",
                                        "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/ic_usage_minutes.png",
                                        "subtitle":"200 minutes"
                                    },
                                    {
                                        "title":"SMS Usage",
                                        "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/ic_usage_sms.png",
                                        "subtitle": "100"
                                    }
                                ]
                            }
                        }
                    }
                }
            }

                res.json(response);
        }
        else if(req.body.result.metadata.intentName == "billdue"){
            var response = {
                "speech" : "Your Due date : 12-Nov-2016",
                "displayText" : "Your Due date : 12-Nov-2016",
                "source" : "Bill Due"
            }
            res.json(response);
        }
        else if(req.body.result.metadata.intentName == "balance"){
            var response = {
                "speech" : "Your current balance : 200$",
                "displayText" : "Your current balance : 200$",
                "source" : "Balance"
            }
            res.json(response);
        }

    }
    else{
        console.log("else condition");
        var response = {
            "speech" : "Please provide msisdn",
            "displayText" : "Please provide msisdn",
            "source" : "Login"
        }
        res.json(response);
    }
    console.log("Request:");
    console.log(req.body);
     //if(users.hasOwnProperty())
 


    console.log("Going to send response");
    /*var response = {
        "data" :{"facebook": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Welcome to MBot",
                        "image_url": "http://www.example.com/images/m-bank.png",
                        "buttons": [{
                            "type": "account_link",
                            "url": "https://www.example.com/authorize"
                        }]
                    }]
                }
            }
        }}
    }
    res.json(response);*/
})
// for Facebook verification

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

