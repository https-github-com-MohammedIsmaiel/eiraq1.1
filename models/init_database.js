const { Pool } = require('pg');

const connection = new Pool({
host:
'ec2-52-5-1-20.compute-1.amazonaws.com',
database:
'd8sl7kt21iteul',
user:
'zeqnipwrlwjyzp',
port:
'5432',
password:
'0e6ad977a470ce79e32692f91bd1dc40e7c59be247e7e3a329502a5629a2d5d6',
	ssl: {
	  rejectUnauthorized: false,
	},
});




module.exports.connection = connection