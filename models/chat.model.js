const connection = require("../models/init_database").connection;



exports.getAllAccounts=()=>{
    return new Promise((res, rej) => {
       var query = 'select * from accounts';
       connection.query(query, function(err,result){
                       if (err) console.log(err);
                       if (result.rows.length >= 0) {
                        res(result.rows)
                        }else{
                            reject('no accounts found')
                        } 
                        
                       } 
                   
               );
       
       })
   }
