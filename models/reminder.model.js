
const cron = require('node-cron');
const mailer = require('nodemailer');
const connection = require('./init_database').connection;

var transporter = mailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'eiraqapp@gmail.com',
    pass: 'eiraqapp10yass'
  }
});
module.exports = function () {
  // Cron Job to run around 1 hour Server Time 
  cron.schedule('0 * * * *', () => {
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tomorrow.getFullYear();
    var current_hour = today.getHours();
    today = yyyy + '-' + mm + '-' + dd;
    
    let query =
      'SELECT events.*, accounts.email,accounts.username FROM events INNER JOIN  accounts ON owner_id= accounts.id WHERE CAST(start_date AS DATE) =$1 AND EXTRACT(HOUR FROM start_date) =$2';
    connection.query(query, [today, current_hour], function (err, result) {
      if (err) console.log(err);
      if (result.rows.length > 0) {
             result.rows.forEach((element) => { 
          const mailOptions = {
            from: 'eiraqapp@gmail.com',
            to: element.email,
            subject: `Hello ${element.username} `,
            html: `<div style : "font-size : 20px ;"><strong style = "color:#080; font-size:24px; ">
                             Happy day 😉😂 </strong>,thank you for using <strong style : "color: #a00; font-size:26px;"> Eiraq App </strong> you have an  event tomorrow 
                             \n at 
                             <table border = "1px" width = "100%">
                             <tr>
                             <td style = "color: "black" ; font-size:"25px"; font-style:"bold";>Description</td>
                             <td style = "color: "blue" ; font-size:"24px"; font-style:"italic";>${element.text}</td>
                            </tr>
                             <tr>
                                <td style = "color: "black" ; font-size:"25px"; font-style:"bold";>Day</td>
                                <td style = "color: "blue" ; font-size:"24px"; font-style:"italic";>${today}</td>
                             </tr>
                             <tr>
                                <td style = "color: "black" ; font-size:"25px">Time</td>
                                <td style = "color: "blue" ; font-size:"24px";>${element.start_date.getHours()} : ${element.start_date.getMinutes()}</td>
                             </tr>
                             </table>
                             </div>`,
          };
          return transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
              console.log(error);
            }
          });
        });
      } else {
        return 'nothing';
      }
    });
  });



}