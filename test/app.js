module.exports = function(app)
{
    app.get("/api/test", findAllMessages);

    function findAllMessages(req, res) {
        console.log(req.body);
        loginJson = {
            "recipient":{
                "phone_number":"+1(562)583-6629"
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Welcome to M-bot",
                            "image_url": "http://www.mobileaware.com/wp-content/uploads/2013/04/twitter_avatar.png",
                            "buttons": [{
                                "type": "account_link",
                                "url": "https://www.example.com/authorize"
                            }]
                        }]
                    }
                }
            }
        };
        res.json(loginJson);
    }
};