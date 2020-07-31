const functions = require('firebase-functions');

/**
 * Landbot API functions
 * @type {[type]}
 */


/*
 * Salta a cualquier nodo del bot
 */

exports.sendToNode = functions.https.onCall(async (data, _context) => {
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
});

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

exports.createSlackConversation = functions.https.onCall(async (data, _context) => {

	if (!data.token) {
		var request = require('request-promise');
		console.log(data);
		var options = {
			'method': 'GET',
			'url':'https://slack.com/oauth/authorize'
			
		}

	}
	
	/*
	var request = require('request-promise');
	console.log(data);
	console.log(`https://api.landbot.io/v1/channels/${data.channelId}/message_hooks/`);
	var options = {
		'method': 'POST',
		'url': `https://api.landbot.io/v1/channels/${data.cannelId}/message_hooks/`,
		'headers': {
		  'Authorization': functions.config().env[data.account].landbot.token,//data.token,
		  'Content-Type': ['application/json', 'application/json']
		},
		body: JSON.stringify({
			"url": "https://5efa5169abdfa1af788455afc5b00fd8.m.pipedream.net",
			"name": "from_landbot_to_slack_hook",
			"token": ""
		})
	  };	
	  try {
		  const body = await request(options);		
		  return JSON.parse(body);
	  }
	  catch (error) {
		  throw new Error(error);
	  }*/

});