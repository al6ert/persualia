const functions = require('firebase-functions');

/**
 * Landbot API functions
 * @type {[type]}
 */
/*
exports.landbot = require('./landbot');
exports.slack = require('./slack');
exports.googlesheet = require('./googlesheet');*/


//exports.stripe = require('./stripe');

exports.sendMessageFromLandbotCustomerToSlack = functions.https.onRequest(async (req, res) => {	
    const slack = require('./slack');    
    if (!req.body.messages[0].customer.slackchannelinfo) return res.status(202).send(Error("Customer with no slackchannelinfo"));
	const client = JSON.parse((req.body.messages[0].customer.slackchannelinfo).replace(/'/g, '"')).client;		
	if (client === null) return res.status(202).send(Error("Customer whith no client setup"));		
    
    const senderType = req.body.messages[0].sender.type;	    
    const msgtoslack = (req.body.messages[0].customer.msgtoslack === "1");
    const typeofmsgtoslack = typeof (req.body.messages[0].customer.msgtoslack);
    
    if (senderType !== `customer` && !msgtoslack) return res.status(202).send(Error("Message is not from a customer"));		
    var text = req.body.messages[0].data.body;
    if (senderType !== `customer` && msgtoslack) text = `CHATBOT: ${text}`;    
	const landbotUserId = req.body.messages[0].customer.id;
 	const landbotUserName = req.body.messages[0].sender.name;
	const slackChannelName = `user-${client}-${landbotUserId}`;
	
	const options = {	
		'client':client,			
		'slackChannelName':slackChannelName,
		'landbotUserName':landbotUserName,
		'landbotUserId':landbotUserId,
		'text': text
	}	
	
	try {		
		const result = await slack.sendMessage(options);
		return res.send(result);
	} catch(error) {		
		return res.send(error);
	}
});

exports.createSlackChannelFromLandbot = functions.https.onRequest(async (req, res) => {        
    const slack = require('./slack');
    const data = JSON.parse((req.body.slackchannelinfo).replace(/'/g, '"'));         
    const client = data.client.toLowerCase();
    if (client === null) return res.status(202).send(Error("Customer whith no client setup"));
    const slackUsers = data.slack_users || functions.config().env[client].slack.slack_users;
        
    const landbotUserId = data.landbot_user;
    const slackChannelName = `user-${client}-${landbotUserId}`;
    const landbotName = data.landbot_name;
    const leadMagnet = data.leadmagnet;
    const userName = data.user_name;
    const hola = data.hola;

    let options = {
        'client':client,
        'channelName':slackChannelName,
        'slackUsers':slackUsers        
    };
    try {
        const result = await slack.createConversation(options);                
        options.slackChannelId = result.channel.id;
        options.teamId = result.channel.shared_team_ids[0];
        var topic = {
            'client':client,
            'landbotName':landbotName                       
        }        
        if (leadMagnet !== null) topic.leadMagnet = leadMagnet;
        if (hola !== null) topic.hola = hola;        
        if (!userName.match(/^Visitor/i)) topic.userName = userName;
        options.topic = JSON.stringify(topic, null, '\t');
        
        const result2 = await slack.setChannelTopic(options);        
        const result3 = await slack.inviteUsersToChannel(options);        
        return res.send('true');

    } catch(error) {        
        return res.send(error);
    }
    
});

exports.slackHelloToLandbotNode =  functions.https.onRequest(async (req, res) => {    
    const slack = require('./slack');
    const data = req.body;    
    try {                
        var client = Object.keys(functions.config().env).find(key => functions.config().env[key].slack.team_domain === data.team_domain);         
        const info = await slack.getChannelInfo({
            "client": client,
            "channelId": data.channel_id
        });        
        const topic = JSON.parse(info.channel.topic.value);                
        client = info.channel.name.split('-')[1];
        const result = await slack.sendMessage({	
            'client':client,			
            'slackChannelName':info.channel.name,
            'landbotUserName':"Landbot",
            'landbotUserId':info.channel.name.split('-')[2],
            'text': `AGENT ${(data.user_name).toUpperCase()}`
        });                
        const landbot = require('./landbot');        
        const result2 = await landbot.sendToNode({
            'client':client,
            'userId':info.channel.name.split('-')[2],
            'botId':topic.hola.split(':')[0],
            'node':topic.hola.split(':')[1]
        });        
        return res.send(result2);
    } catch(error) {
        return res.send(error);
    }

});

exports.sendMessageFromSlackToCustomer = functions.https.onRequest(async (req, res) => {    
    const slack = require ('./slack');    
    const data = req.body;    
    if (data.type === "url_verification")   { return res.send({"challenge":data.challenge}); }    
    try {    
        const text = data.event.text;
        if (text.match("set the channel's topic|has joined")) return res.status(202).send(Error("Agent Joined"));
                        
        const slackChannelId = data.event.channel;
        const slackSenderId = data.event.user;        
        var client = Object.keys(functions.config().env).find(key => functions.config().env[key].slack.team_id === data.team_id);                  
        if (slackSenderId === functions.config().env[client].slack.slack_bot) return res.status(202).send(Error("Bot Message"));                        
        
        const info = await slack.getChannelInfo({
            "client": client,
            "channelId": slackChannelId
        });
        
        const slackChannelName = info.channel.name;        
        client = slackChannelName.split('-')[1];                
        const landbotUserId = slackChannelName.split('-')[2];
        const landbot = require('./landbot');        
        const result = await landbot.sendMessage({
            "client":client,
            "userId":landbotUserId,
            "text":text
        });
        return res.send(result);
    } catch(error) {
        return res.send(error);
    }
    
});