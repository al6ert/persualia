const functions = require('firebase-functions');

/**
 * Landbot API functions
 * @type {[type]}
 */


//var sendMessageToSlackChannel = async function (data) {
exports.sendMessageToSlackChannel = functions.https.onRequest(async (req, res) => {	

    console.log(req.body);

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
	} catch (err) {
		res.send(err);
	}
});