const connection = require("../models/init_database").connection;

exports.SaveFolderInfo=(foldername,user_id)=>{
    return new Promise((resolve, reject) => {        
       connection.query(
           "INSERT INTO folders (foldername,user_id) VALUES ($1,$2)", [foldername,user_id],
           function(err, result) {
               if (err) reject(err)
               resolve()
           }   
       )
    });  

}

exports.getAllFolders=()=>{
    return new Promise((resolve, reject) => {        
        connection.query(
            "select * FROM folders",
            function(err, results) {
                if (err) reject(err)
                if (results.rows.length >= 0) {

                    resolve(results.rows)
                }else{
                     reject()
                } 
            }   
        )
     });  
}



exports.getAllFiles=(folderid)=>{
    return new Promise((resolve, reject) => {        
        connection.query(
            "select * FROM files WHERE folder_id = $1",[folderid],
            function(err, results) {
                if (err) reject(err)
                if (results.rows.length >= 0) {
                    resolve(results.rows)
                }else{
                     reject('no file created')
                } 
            }   
        )
     });  
}
exports.getAllGeneralFiles=()=>{
    return new Promise((resolve, reject) => {        
        connection.query(
            "select * FROM files WHERE folder_id IS NULL",
            function(err, results) {
                if (err) reject(err)
                if (results.rows.length >= 0) {
                    resolve(results.rows)
                }else{
                     reject('no file created')
                } 
            }   
        )
     });  
}
exports.SaveFileInfo=(filename,fileid,webViewLink,filetype,user_id,folder_id)=>{
    return new Promise((resolve, reject) => {        
       connection.query(
           "INSERT INTO files (filename,fileid,webViewLink,filetype,user_id,folder_id) VALUES ($1,$2,$3,$4,$5,$6)", [filename,fileid,webViewLink,filetype,user_id,folder_id],
           function(err, result) {
               if (err) reject(err)
               resolve()
           }   
       )
    });  

}
exports.SaveGeneralFileInfo=(filename,fileid,webViewLink,filetype,user_id)=>{
    return new Promise((resolve, reject) => {        
       connection.query(
           "INSERT INTO files (filename,fileid,webViewLink,filetype,user_id) VALUES ($1,$2,$3,$4,$5)", [filename,fileid,webViewLink,filetype,user_id],
           function(err, result) {
               if (err) reject(err)
               resolve()
           }   
       )
    });  

}
exports.deleteFolderWithFiles=(folderid)=>{
    return new Promise((resolve, reject) => {        
        connection.query(
            "DELETE FROM folders WHERE id = $1",[folderid],
            function(err, results) {
                if (err) reject(err)
                    resolve()
            }   
        )
     });  
}
exports.deleteFile=(fileid)=>{
    return new Promise((resolve, reject) => {        
        connection.query(
            "DELETE FROM files WHERE id = $1",[fileid],
            function(err, results) {
                if (err) reject(err)
                    resolve()
            }   
        )
     });  
}
