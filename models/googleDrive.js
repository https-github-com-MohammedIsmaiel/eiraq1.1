

const fs = require('fs');

const { google } = require('googleapis');
const CLIENT_ID = '1084641653805-a0rs75vjsoi3a0rnru20n7dedcqeaqd3.apps.googleusercontent.com';
const CLIENT_SECRET = 'APmWb_R_7FG8ngIxl7aAvS8C';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04Ls2TxaYQs6zCgYIARAAGAQSNwF-L9IrCs-x7_BVNC1kmEm_NXZdzDcbnmSZbhdlEIYNTmH9U0D-4eKTnicW1i0r0Ip4qG8UQFQ';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});


/* 
filepath which needs to be uploaded
Note: Assumes example.jpg file is in root directory, 
though this can be any filePath
*/

class GoogleDriveClass  {
	
async  uploadFile(filename,mimetype,path) {
    try {
      const response = await drive.files.create({
        requestBody: {
          name:filename, //This can be name of your choice
          mimeType:mimetype,
        },
        media: {
          mimeType: mimetype,
          body: path,
        },
        fields: "id",
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  
async generatePublicUrl(Id) {
    try {
      await drive.permissions.create({
        fileId: Id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

    const result = await drive.files.get({
        fileId: Id,
        fields: 'webViewLink, webContentLink',
      });
      return result.data;
    } catch (error) {
      console.log(error.message);
    }
  }
    
async Deletefile(fileId) {
  try { 
 const result = await  drive.files
  .delete({
    fileId: fileId,
  });
    return result;
  } catch (error) {
    console.log(error.message);
  }
}
 
}
module.exports = GoogleDriveClass;
