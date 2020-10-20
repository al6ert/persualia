const functions = require('firebase-functions');
//const slack = require('./slack');
/**
 * Landbot API functions
 * @type {[type]}
 */


/*
 * Salta a cualquier nodo del bot
 */
exports.sendToNode = async function (data) {
	//const data = req.body;	
	console.log(JSON.stringify(data));
	var request = require('request-promise');	
	var options = {
	  'method': 'PUT',
	  'url': `https://api.landbot.io/v1/customers/${data.userId}/assign_bot/${data.botId}/`,
	  'headers': {
	    'Authorization': functions.config().env[(data.client).toLowerCase()].landbot.token,
	    'Content-Type': ['application/json', 'application/json']
	  },
	  body: JSON.stringify({"launch":true,"node":data.node})
	};	
	try {
		const body = await request(options);
		return body;
	}
	catch (error) {
		throw new Error(error);
	}	
}	

exports.sendMessage = async function(data) {
	const axios = require("axios");
	try {
		// Make an HTTP POST request using axios    
		const response = await axios({
			method: "POST",
			url: `https://api.landbot.io/v1/customers/${data.userId}/send_text/`,
			headers: {
			"Content-Type": "application/json",
			'Authorization': functions.config().env[(data.client).toLowerCase()].landbot.token,
			},
			data: JSON.stringify({"message":data.text})
		});   
		return response.data
	} catch(err) {		
		throw(err);
	}
}

exports.changeVariable = async function(data) {
	const axios = require("axios");
	try {
		// Make an HTTP PUT request using axios    
		const response = await axios({
			method: "PUT",
			url: `https://api.landbot.io/v1/customers/${data.userId}/fields/${data.variable}`,
			headers: {
			"Content-Type": "application/json",
			'Authorization': functions.config().env[(data.client).toLowerCase()].landbot.token,
			},
			data: JSON.stringify({
				"type": data.type,
				"extra": {},
				"value": data.value
			})
		});   
		return response.data
	} catch(err) {		
		throw(err);
	}
}

/*exports.landbotListener = functions.https.onRequest(async (req, res) => {	
	console.log(JSON.stringify(req.body));		
	const client = JSON.parse((req.body.messages[0].customer.slackchannelinfo).replace(/'/g, '"')).client;		
	if (client === null) return res.status(202).send(Error("Customer whith no client setup"));		
	const senderType = req.body.messages[0].sender.type;	
	if (senderType !== `customer`) return res.status(202).send(Error("Message is not from a customer"));
	
	console.log(`Client ${client} senderType ${senderType}`);
	const text = req.body.messages[0].data.body;
	const landbotUserId = req.body.messages[0].sender.id;
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
		console.log(error);
		return res.send(error);
	}
});*/



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

