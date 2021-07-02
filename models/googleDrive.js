

const fs = require('fs');
var connection_drive = require('./init_google_connection');
var drive=connection_drive();


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
