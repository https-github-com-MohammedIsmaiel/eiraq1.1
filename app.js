/*
 * Required External Modules
 */
const RTCMultiConnectionServer = require('rtcmulticonnection-server')
const session = require('express-session');
const express = require('express');
var cors = require('cors');

const bodyParser = require('body-parser');
const path = require('path');
// var mysql = require('mysql');
// const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require("uuid");
dotenv.config({ path: './.env' });
const welcomeRoutes = require('./routes/welcome.route')
const meetingRoutes = require('./routes/meeting.route')
const loginRoutes = require('./routes/login.route')
const profileRoutes = require('./routes/profile.route')
const roomRoutes = require('./routes/room.route')
const googleRoutes = require("./routes/google.route");
const facebookRoutes = require("./routes/facebook.router");
const twitterRoutes = require("./routes/twitter.router");
const fs = require('fs');
const logger = require('morgan');
const flash = require("connect-flash");
// const sessionPool = require('pg').Pool;
// const pgSession = require('connect-pg-simple')(session);
var busboy = require('connect-busboy');
//...

//...

/**
 * App Variables
 */
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || "3000";
const io = require('socket.io')(server);

const passport = require("passport");


/**
 *  App Configuration
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + "public/css"));
app.use('/js', express.static(__dirname + "public/js"));
app.use('/img', express.static(__dirname + "public/img"));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/views'));
app.use('/upload_images', express.static(__dirname + "public/upload_images"));

app.use('/uploads', express.static('uploads'));
app.use(busboy());


const KnexSessionStore = require('connect-session-knex')(session);

const Knex = require('knex');

const knex = Knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '123',
        port: '5432',
        database: 'E-app',
          
      
    },

});

const store = new KnexSessionStore({
    knex,
    tablename: 'sessions', // optional. Defaults to 'sessions'
});

app.use(
    session({
        secret: 'keyboard cat',
        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            expires: false,// ten seconds, for testing
            resave: false,
            saveUninitialized: true,
        },
        store,
    }),
);


app.use(flash());



app.use('/', welcomeRoutes)
app.use('/', meetingRoutes)
app.use('/', loginRoutes)
app.use('/', profileRoutes)
app.use('/', roomRoutes)


const connection = require('./models/init_database').connection;


// connect to database
connection.connect(async function (err) {
    if (err) throw err;
    console.log('Connected!');
    await connection.query(
        "CREATE TABLE IF NOT EXISTS accounts (id SERIAL PRIMARY KEY,username VARCHAR(255), Email VARCHAR(255), password VARCHAR(255),img_url VARCHAR(350) DEFAULT 'default.png', type VARCHAR(20) DEFAULT 'normal')"
    );
    await connection.query(
        'CREATE TABLE IF NOT EXISTS meetinginfo (id SERIAL  PRIMARY KEY, meeting_id  VARCHAR(255),hostname  VARCHAR(255),meetingpassword VARCHAR(255),URL VARCHAR(255),validity BOOLEAN,user_id INT ,  CONSTRAINT meeting_fk FOREIGN KEY(user_id) REFERENCES accounts(id))'
    );
    await connection.query(
        'CREATE TABLE IF NOT EXISTS events (id  BIGSERIAL unique not null PRIMARY KEY,start_date TIMESTAMP,end_date TIMESTAMP, text VARCHAR(255),event_pid VARCHAR(255),event_length VARCHAR(255), rec_type VARCHAR(255),owner_id INT REFERENCES accounts ON DELETE CASCADE, CONSTRAINT event_fk FOREIGN KEY(owner_id) REFERENCES accounts(id))'
    );
    await connection.query(
        'CREATE TABLE IF NOT EXISTS folders (id  BIGSERIAL unique not null PRIMARY KEY,foldername VARCHAR(255), user_id INT  REFERENCES accounts ON DELETE CASCADE,  CONSTRAINT folder_fk FOREIGN KEY(user_id) REFERENCES accounts(id))'
    );
    await connection.query(
        'CREATE TABLE IF NOT EXISTS files (id  BIGSERIAL unique not null PRIMARY KEY,filename  VARCHAR(255),fileid VARCHAR(255), webViewLink VARCHAR(255), filetype VARCHAR(255),user_id INT ,folder_id INT   DEFAULT NULL REFERENCES folders ON DELETE CASCADE, CONSTRAINT files_fk1 FOREIGN KEY(folder_id) REFERENCES folders(id),CONSTRAINT file_fk2 FOREIGN KEY(user_id) REFERENCES accounts(id))'
    );
    await connection.query(
        'CREATE TABLE IF NOT EXISTS messages (id  BIGSERIAL unique not null PRIMARY KEY,sender_id INT,receiver_id INT,messages TEXT,CONSTRAINT messages_fk1 FOREIGN KEY(sender_id) REFERENCES accounts(id),CONSTRAINT messages_fk2 FOREIGN KEY(receiver_id) REFERENCES accounts(id))'
        );
      

    console.log('tables created')
});

const router = require('./routes/router');
// add listeners to basic CRUD requests
const Storage = require('./models/storage.js');
const storage = new Storage(connection);
router.setRoutes(app, '/events', storage);

/* Google authentication routes and configuration  */
require("./passport-setup");

app.use(passport.initialize());
app.use(passport.session());
app.use("/", googleRoutes);
app.use("/", facebookRoutes);
app.use("/", twitterRoutes);

/* End of Google authentication */

/* Schedule route */
app.get("/schedule", (req, res) => res.render("schedule"));

app.use(cors());

io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.join(socket.id)
    ////here my modifications
    console.log('saw user connected');
    //Alerts us when someone disconnects
    socket.on('disconnect', () => {
        console.log('User Disconnected')
    });
    socket.on('message', (mes) => {
        console.log("user : " + mes.sender_id);
        console.log("Message : "+ mes.message);
        io.emit("server message", {sender_id:mes.sender_id, message:mes.message});
        var query = "INSERT INTO messages (sender_id, receiver_id, messages) VALUES ('" +mes.sender_id+ "', '" +mes.receiver_id + "', '" + mes.message + "')";
        connection.query(query,  function(err, result) {
         if (err)  console.log(err)
         console.log('inserted')
     }              
 );
    });
    RTCMultiConnectionServer.addSocket(socket)
    socket.on("join-room", (roomid) => {
        socket.join(roomid);
        socket.on('endForAll', d => io.to(roomid).emit('endForAll'))
        socket.on("join-meet", (data) => {
            io.to(roomid).emit('participants', data)
        })
        io.to(roomid).emit('update')
        socket.on("message", (message, messagewriter) => {
            io.to(roomid).emit("createMessage", message, messagewriter);
        });

        //FileUploading
        socket.on('file', (f, messagewriter) => {
            console.log(`File by: ${messagewriter}`);
            io.to(roomid).emit('file', f);
        });
        // io.to(roomid).emit('file', f);
        socket.on('renderMuteAll', (data) => socket.broadcast.to(roomid).emit('renderMuteAll', (data)))
        socket.on('drawing', function (data) {
            socket.broadcast.emit('drawing', data);
        });

        socket.on('rectangle', function (data) {
            socket.broadcast.emit('rectangle', data);
        });

        socket.on('linedraw', function (data) {
            socket.broadcast.emit('linedraw', data);
        });

        socket.on('circledraw', function (data) {
            socket.broadcast.emit('circledraw', data);
        });

        socket.on('ellipsedraw', function (data) {
            socket.broadcast.emit('ellipsedraw', data);
        });

        socket.on('textdraw', function (data) {
            socket.broadcast.emit('textdraw', data);
        });

        socket.on('copyCanvas', function (data) {
            socket.broadcast.emit('copyCanvas', data);
        });

        socket.on('Clearboard', function (data) {
            socket.broadcast.emit('Clearboard', data);
        });
        //sub rooms sockets
        socket.on('joinSection', (data) => {
            io.to(roomid).emit("joinSection", data);
        })
        socket.on('joinLab', (data) => {
            io.to(roomid).emit("joinLab", data);
        })


        socket.on('leaveSection', (data) => {
            io.to(roomid).emit("leaveSection", data);
        })

        socket.on('leaveLab', (data) => {
            io.to(roomid).emit("leaveLab", data);
        })

        socket.on('disallowShare', () => {
            socket.broadcast.to(roomid).emit('disallowShare')
        })
        socket.on('disallowChat', () => {
            socket.broadcast.to(roomid).emit('disallowChat')
        })


        //dissconnect
        socket.on("disconnect", () => {
        });
    });




});

// reminder
var reminder = require('./models/reminder.model');
reminder();


/**
 * Server running
 */
server.listen(port, () => {
    console.log(`running on port : ${port}`);
});

module.exports.db = connection