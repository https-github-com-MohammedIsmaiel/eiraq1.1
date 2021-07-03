const { google } = require('googleapis');
const CLIENT_ID = '985573331622-9mddg0qss828jtavbervj05akm4ah38i.apps.googleusercontent.com';
const CLIENT_SECRET = 'k3qlwPGczaPnlK3hGvJV-Emz';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04j8Y28dmaQ2XCgYIARAAGAQSNwF-L9Ir644owAq35q-BXXbkTgGXpiGUdUfNmI_0Tij950GJBSacr0hh6c6UucKFFwjtrj-wzXI';



module.exports = function () {

    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

    });
    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
    });
    return drive;

}