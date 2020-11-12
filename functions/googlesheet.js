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
  functions.config().env["persualia"].google.googlesheet.email,
  null,
  functions.config().env["persualia"].google.googlesheet.privatekey,
  SCOPES
);

exports.sendToGoogleSheet = async function (data) {
  console.log(JSON.stringify(data));
  return new Promise((resolve, reject) => {
    
    auth.authorize((error, token) => {
      if (error) {
        console.log(error);
        throw new Error(error);
      } else {
        const date = new Date();
        data.values.unshift(date.toLocaleTimeString("es-ES", { timeZone: "Europe/Madrid", hour12: false }));
        data.values.unshift(date.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid", hour12: false }));

        sheets.spreadsheets.values.append({
          auth: auth,
          spreadsheetId: data.spreadsheetId,
          range: data.sheet,
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
            console.log(JSON.stringify(response));
            resolve(response);
          }
        });
      }
    });
  });
}

