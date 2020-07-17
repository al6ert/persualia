const functions = require('firebase-functions');
const fs = require('fs');

/**
 * Google Sheet API functions
 * @type {[type]}
 */

const { google } = require('googleapis');
const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.JWT(
  functions.config().env["persualia"].googlesheet.email,
  null,
  functions.config().env["persualia"].googlesheet.privatekey,
  SCOPES
);



exports.sendToGoogleSheet = functions.https.onCall(async (data, _context) => {  

  return new Promise((resolve, reject) => {
    
    auth.authorize((error, token) => {
      if (error) throw new Error(error);
      else {
        const date = new Date();
        data.values.unshift(date.toLocaleTimeString("es-ES", { timeZone: "Europe/Madrid", hour12: false }));
        data.values.unshift(date.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid", hour12: false }));

        sheets.spreadsheets.values.append({
          auth: auth,
          spreadsheetId: data.spreadsheetId,
          range: data.range,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [
              data.values
            ]
          }
        }, (err, response) => {
          if (err) {
            throw new Error(err);
          } else {
            resolve(response.data);
          }
        });
      }
    });
  });
});

