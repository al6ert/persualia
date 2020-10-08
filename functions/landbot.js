const functions = require('firebase-functions');
const slack = require('./slack');
/**
 * Landbot API functions
 * @type {[type]}
 */


/*
 * Salta a cualquier nodo del bot
 */
exports.sendToNode = functions.https.onRequest(async (req, res) => {
	const data = req.body;	
	var request = require('request-promise');	
	var options = {
	  'method': 'PUT',
	  'url': 'https://api.landbot.io/v1/customers/'+data.userId+'/assign_bot/'+data.botId+'/',
	  'headers': {
	    'Authorization': functions.config().env[data.account].landbot.token,//data.token,
	    'Content-Type': ['application/json', 'application/json']
	  },
	  body: JSON.stringify({"launch":true,"node":data.node})
	};	
	try {
		const body = await request(options);
		res.send(JSON.parse(body));
	}
	catch (error) {
		throw new Error(error);
	}	
});


exports.landbotListener = functions.https.onRequest(async (req, res) => {	
	console.log(req.body);
	const client = req.body.messages[0].customer.slackChannelInfo.client;	
	if (client === null) req.status(202).send("Customer whith no customer");//$end();
	const senderType = req.body.messages[0].sender.type;
	if (senderType !== `customer`) req.status(202).send("Message is not from a customer");//$end();
	const text = req.body.messages[0].data.body;
	const landbotUserId = req.body.messages[0].sender.id;
 	const landbotUserName = req.body.messages[0].sender.name;
	const slackChannelName = `user-${client}-${landbotUserId}`;
	
	const slackBotToken = functions.config().env[client].slack.xoxb_token;// auths.slack_bot.bot_token;
// get data from custom "slackchannelinfo" variable in Landbot 

	const options = {
		'slackBotToken':slackBotToken,
		'slackChannelName':slackChannelName,
		'landbotUserName':landbotUserName,
		'landbotUserId':landbotUserId,
		'text': text
	}
	try {
		const result = await slack.sendMessageToSlackChannel(options);
		res.send(result);
	} catch(error) {
		res.send(error);
	}			
});



/*exports.sendToNode = functions.https.onCall(async (data, _context) => {
	var request = require('request-promise');	
	var options = {
	  'method': 'PUT',
	  'url': 'https://api.landbot.io/v1/customers/'+data.userId+'/assign_bot/'+data.botId+'/',
	  'headers': {
	    'Authorization': functions.config().env[data.account].landbot.token,//data.token,
	    'Content-Type': ['application/json', 'application/json']
	  },
	  body: JSON.stringify({"launch":true,"node":data.node})
	};	
	try {
		const body = await request(options);
		return JSON.parse(body);
	}
	catch (error) {
		throw new Error(error);
	}	
});*/

exports.sendLocation = functions.https.onCall(async (data, _context) => {
	var request = require('request-promise');	
	var options = {
	  'method': 'POST',
	  'url': 'https://api.landbot.io/v1/customers/'+data.userId+'/send_location/',
	  'headers': {
	    'Authorization': functions.config().env[data.account].landbot.token,//data.token,
	    'Content-Type': ['application/json', 'application/json']
	  },
	  body: JSON.stringify({"latitude":41.408044,"longitude":2.165454})
	};	
	try {
		const body = await request(options);		
		return JSON.parse(body);
	}
	catch (error) {
		throw new Error(error);
	}
});

