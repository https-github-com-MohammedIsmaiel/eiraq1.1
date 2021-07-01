

const fs = require('fs');
const { google } = require('googleapis');
const CLIENT_ID = '985573331622-9mddg0qss828jtavbervj05akm4ah38i.apps.googleusercontent.com';
const CLIENT_SECRET = 'k3qlwPGczaPnlK3hGvJV-Emz';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04j8Y28dmaQ2XCgYIARAAGAQSNwF-L9Ir644owAq35q-BXXbkTgGXpiGUdUfNmI_0Tij950GJBSacr0hh6c6UucKFFwjtrj-wzXI';




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
