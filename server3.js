/**
 * Created by abhinavmaurya on 11/3/16.
 */
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var fs = require('fs');
var users={};
var bills =[{
    "title":"Bill",
    "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/Adobe-PD.jpg",
    "item_url" :"https://dl.dropboxusercontent.com/u/8913093/mbot/images/bills.pdf",
    "subtitle":"February"
},
    {
        "title":"Bill",
        "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/Adobe-PD.jpg",
        "item_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/bills.pdf",
        "subtitle":"January"
    },
    {
        "title":"Bill",
        "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/Adobe-PD.jpg",
        "item_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/bills.pdf",
        "subtitle": "December"
    }];

app.set('port', (process.env.PORT || 5000))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
app.use(bodyParser.json())
// Index route
app.post('/', function (req, res) {
    console.log(JSON.stringify(req.body));

    var intentName = req.body.result.metadata.intentName;

    //if(users.hasOwnProperty(req.body.sessionId)){

        switch (intentName){
            case 'usage':
                handleUsage(req);
                break;

            case 'bill':
                handleBill(req);
                break;

            case 'balance':
                handleBalance(req);
                break;

            case 'store':
                handleStore(req);
                break;
            case 'billdue':
                handleBillDue(req);
                break;
            case 'balance':
                handleBalance(req);
                break;
            case 'addon':
                handleAddons(req);
                break;

            case 'search':
                console.log("identified");
                handleMatch(req);
                break;

            default:
                res.send('Go Home and Sleep!');
                break;

        }

    //}
    /*else if(intentName == 'phone'){
        handlePhone(req)
    }else{
        var response = {
            "speech" : "Hi there! I am your AwareX personal assistant. Do you mind sharing your msisdn?",
            "displayText" : "Hi there! I am your AwareX personal assistant. Do you mind sharing your msisdn?",
            "source" : "Login"
        }
        res.json(response);
    }*/




    function handlePhone(req){
        console.log("phone intent");
        users[req.body.sessionId]=req.body.result.parameters.number;
        var response = {
            "data": {
                "facebook": {
                    "text":"How may I help you today?",
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

    function handleAddons(req){
        var response = {
            "data": {
                "facebook": {
                    "text":"Awesome ! Which of the below addons do you want?",
                    "quick_replies":[
                        {
                            "content_type":"text",
                            "title":"Combo Addon",
                            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                        },
                        {
                            "content_type":"text",
                            "title":"Data Addon",
                            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                        },
                        {
                            "content_type":"text",
                            "title":"SMS Addon",
                            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                        },
                        {
                            "content_type":"text",
                            "title":"Voice Addon",
                            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                        }
                    ]
                }
            }
        }
        res.json(response);
    }

    function handleUsage(req){
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
                                    "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/ic_data.png",
                                    "subtitle":"100 MB"
                                },
                                {
                                    "title":"Voice Usage",
                                    "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/ic_call.png",
                                    "subtitle":"200 minutes"
                                },
                                {
                                    "title":"SMS Usage",
                                    "image_url":"https://dl.dropboxusercontent.com/u/8913093/mbot/images/ic_sms.png",
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

    function handleStore(req){
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

    function handleBill(req){
        var bill=[];
        console.log("request:");
        console.log(req.body);
        if(req.body.result.parameters.month){
            console.log("month");
            console.log(req.body.result.parameters.month);
            bills.forEach(function(entry){
               if (entry['subtitle'] == req.body.result.parameters.month){
                   console.log("found month entry");
                   bill.push(entry);
               }
            });
        }
        else{
            console.log("fetching previous 3 months bill");
            var num=req.body.result.parameters.number;
            console.log(num);
            var counter = 0;
            bills.forEach(function (entry) {
                if(counter<num){
                   bill.push(entry);
                }
                counter++;
            });
        }

        var response = {
            "data": {
                "facebook": {
                    "attachment":{
                        "type":"template",
                        "payload":{
                            "template_type":"generic",
                            "elements": bill
                        }
                    }
                }
            }
        }

        res.json(response);
    }
    function handleBillDue(req){
        var response = {
            "speech" : "Your Due date : 12-Nov-2016",
            "displayText" : "Your Due date : 12-Nov-2016",
            "source" : "Bill Due"
        }
        res.json(response);
    }

    function handleBalance(req){
        var response = {
            "speech" : "Your current balance : 200$",
            "displayText" : "Your current balance is : 200$",
            "source" : "Balance"
        }
        res.json(response);
    }

    function handleMatch(req){
        console.log(req.body.result.resolvedQuery)
        var spawn = require('child_process').spawn;
        var py = spawn('python', ['test.py', req.body.result.resolvedQuery]);
            //data = req.body.result.resolvedQuery,
            //dataString = '';
        var dataString='';
        py.stdout.on('data', function(data){
            dataString = data;
            dataString = uint8arrayToString(dataString);
            console.log("ssup",dataString);
            var response ={};
            response = {
                "speech" : dataString,
                "displayText" : dataString,
                "source" : dataString
            }
            console.log(JSON.stringify(response));
            res.json(response);
        });
        console.log("ssup1",dataString);

    }

    var uint8arrayToString = function(data){
        return String.fromCharCode.apply(null, data);
    }
})


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

