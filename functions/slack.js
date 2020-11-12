const functions = require('firebase-functions');

/**
 * Landbot API functions
 * @type {[type]}
 */

exports.sendMessage = async function (data) {
	console.log(JSON.stringify(data));
	const slackBotToken = functions.config().env[(data.client).toLowerCase()].slack.xoxb_token;
	const request = require("axios");
	try {
		// Make an HTTP GET request using axios
		const response = await request({
			method: "POST",
			url: `https://slack.com/api/chat.postMessage`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				'Authorization': `Bearer ${slackBotToken}`,
			},
			params: {
				//attachments: params.attachments,
				//unfurl_links: params.unfurl_links,
				text: data.text,
				//unfurl_media: params.unfurl_media,
				//parse: params.parse || 'full',
				//mrkdwn: params.mrkdwn || true,
				channel: data.slackChannelName,
				username: data.landbotUserName,
				//blocks: params.blocks,
				//icon_emoji: params.icon_emoji,
				//link_names: params.link_names,
				//reply_broadcast: params.reply_broadcast || false,
				//thread_ts: params.thread_ts,
				//icon_url: params.icon_url,
				as_user: true
			}
		});
		return response.data;
	} catch (err) {
		throw (err);
	}	
}

exports.createConversation = async function (data) {
	console.log(JSON.stringify(data));
	const slackBotToken = functions.config().env[(data.client).toLowerCase()].slack.xoxb_token;
	const request = require("axios");
	try {
		// Make an HTTP GET request using axios
		const response = await request({
			method: "POST",
			url: `https://slack.com/api/conversations.create`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",				
			},
			params: {						
				token: `${slackBotToken}`,
        		name: data.channelName,
        		is_private: true
			}
		});
		console.log(JSON.stringify(response.data));
		return response.data;
	} catch (err) {
		throw (err);
	}	
}

exports.setChannelTopic = async function (data) {
	const slackBotToken = functions.config().env[(data.client).toLowerCase()].slack.xoxb_token;
	const request = require("axios");
	try {
		// Make an HTTP POST request using axios
		const response = await request({
			method: "POST",
			url: `https://slack.com/api/conversations.setTopic`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"				
			},
			params: {	
				token: `${slackBotToken}`,
        		channel: data.slackChannelId,
        		topic: data.topic
			}
		});
		console.log(JSON.stringify(response.data));
		return response.data;
	} catch (err) {
		throw (err);
	}	
}

exports.inviteUsersToChannel = async function (data) {
	const slackBotToken = functions.config().env[(data.client).toLowerCase()].slack.xoxb_token;	
	const request = require("axios");
	try {
		// Make an HTTP POST request using axios
		const response = await request({
			method: "POST",
			url: `https://slack.com/api/conversations.invite`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",				
			},
			params: {				
				token:`${slackBotToken}`,
        		channel: data.slackChannelId,
        		users: data.slackUsers
			}
		});
		return response.data;
	} catch (err) {
		throw (err);
	}
}


exports.getChannelInfo = async function (data) {
	const slackBotToken = functions.config().env[(data.client).toLowerCase()].slack.xoxb_token;	
	const request = require("axios");
	try {
		// Make an HTTP POST request using axios
		const response = await request({
			method: "POST",
			url: `https://slack.com/api/conversations.info`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",				
			},
			params: {				
				token: slackBotToken,
        		channel: data.channelId        		
			}
		});
		return response.data;
	} catch (err) {
		throw (err);
	}
}

/*
exports.sendMessageToSlackChannel = functions.https.onRequest(async (req, res) => {
	console.log('SLACK');

	console.log(JSON.stringify(req.body));

	const { WebClient } = require('@slack/web-api');

	const web = new WebClient(req.body.slackBotToken);
	var options = {
		//attachments: params.attachments,
		//unfurl_links: params.unfurl_links,
		text: req.body.text,
		//unfurl_media: params.unfurl_media,
		//parse: params.parse || 'full',
		//mrkdwn: params.mrkdwn || true,
		channel: req.body.slackChannelName,
		username: req.body.landbotUserName,
		//blocks: params.blocks,
		//icon_emoji: params.icon_emoji,
		//link_names: params.link_names,
		//reply_broadcast: params.reply_broadcast || false,
		//thread_ts: params.thread_ts,
		//icon_url: params.icon_url,
		as_user: true
	};
	try {
		var body = await web.chat.postMessage(options);
		res.send(body);
		//return body;
	} catch (err) {
		res.send(err);
		//return error;
	}
});
*/