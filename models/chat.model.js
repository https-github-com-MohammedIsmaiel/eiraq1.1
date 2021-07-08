const connection = require("../models/init_database").connection;


exports.getAllMessages=(sender_id,receiver_id)=>{
    console.log("hello")
    return new Promise((res, rej) => {
       var query = "SELECT * FROM messages WHERE (sender_id = '" +sender_id+ "' AND receiver_id = '" + receiver_id + "') OR (sender_id = '" + receiver_id + "' AND receiver_id = '" + sender_id + "')";
      
       connection.query(query, function(err,result){
        if (err) console.log(err);
        if (result.rows.length >= 0) {
         res(result.rows)
         }else{
             reject('no messages')
         } 
         
        }   
);
  
})
}


  