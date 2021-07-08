const { Pool } = require('pg');

const connection = new Pool({
    host: 'ec2-34-204-128-77.compute-1.amazonaws.com',
        user: 'brbrkkujocwtub',
        password: 'f5108efcd44932c1cabd2fd4d32b42364d16e2240bc5a62ccf2ce9c95a1b1ad3',
        port: '5432',
        database: 'd47mk01sdco7le',
        ssl: {
            rejectUnauthorized: false,
          },
});




module.exports.connection = connection