const { Pool } = require('pg');

const connection = new Pool({
    host:'ec2-52-5-1-20.compute-1.amazonaws.com',
database:'da59qub8t2f56t',
user:'xsmzlhbfflhzji',
port:'5432',
password:'975179a5aca6f1d4346d53d68d2b155d8a15dbff5046f90879d62e8bbcc96fec',
	ssl: {
	  rejectUnauthorized: false,
	},
});




module.exports.connection = connection