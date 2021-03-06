const express = require("express");
const mysql = require('mysql');
const query = require("./models") //imports db functions from models.js file
const app = express(); //initializes express app
const path = require("path");
const http = require('http');
const server = http.createServer(app); //connects the express app to http
const { Server } = require("socket.io");
require('dotenv').config();
const io = new Server(server); //connects the http server to a websocket connection
const port = process.env.PORT || 8000; //set port to a port provided in env variables or set to default 8000
const users = {}
//STATIC
app.use(express.static('public'));
app.use('/css',express.static("public/css"));
app.use('/js',express.static(path.join(__dirname,"public/js")));
app.use('/img',express.static(path.join(__dirname,"public/img")));


//ALLOWS TEMPLATES use ejs instead of .html
app.set('views','./views')
app.set('view engine','ejs')

//middleware allows parsing and recieving frontend data converts to json 
app.use(express.json());
app.use(express.urlencoded());

// mysql connection to google db
const con = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
});

//Socket functions
io.on('connection', (socket) => {
    console.log('Connnection made to profle page javascript file');
    socket.on("testing emit", (data) => {
        let jsonData = JSON.stringify(data)
        console.log(`Recieved socket data from frontend saying: ${jsonData}`)
    })

    socket.on("add new task", (data) => {
        let jsonData = JSON.stringify(data)
        console.log(`Recieved socket data from frontend saying: ${jsonData}`)
        query.createTask(data.user,data.user_id,data.task,data.due_date,"active")
    });

    socket.on("add new note", (data) => {
        let jsonData = JSON.stringify(data)
        console.log(`Recieved socket data from frontend saying: ${jsonData}`)
        query.createNote(data.user,data.user_id,data.note,data.note_tag)
    });

    socket.on("finished editing task",data => {
        let jsonData = JSON.stringify(data)
        console.log(`Recieved socket data from frontend saying EDITING TASK: ${jsonData}`)
        query.editTask(data.original_task,data.original_date,data.original_status,data.new_task,data.new_date,data.new_status,data.user,data.id)
    });

    socket.on("delete task",data => {
        let jsonData = JSON.stringify(data)
        console.log(`Recieved socket data from frontend saying: ${jsonData}`)
        console.log(data)
        query.deleteTask(data.task,data.status,data.due_date,data.id)
    });

    socket.on("finished editing note",data => {
        let jsonData = JSON.stringify(data)
        console.log(`Recieved socket data from frontend saying EDITING NOTE: ${jsonData}`)
        console.log(data)
        query.editNote(data.new_note,data.new_tag,data.user,data.id,data.original_note,data.original_tag)
    });

    socket.on("delete note",data => {
        let jsonData = JSON.stringify(data)
        console.log(`Recieved socket data from frontend saying: ${jsonData}`)
        console.log(data.new_note)
        new_note = data.note.replaceAll("<br>","\n") //needed because the frontend js sends html included so this replace all html break tags with line breaks
        query.deleteNote(data.user,data.id,new_note)
    });
});

io.on('disconnect', (socket) => {
    console.log('Connection ended');
});

io.on('connect_error', (socket) => {
    console.log(socket);
}); 

io.on('connect_failed', (socket) => {
    console.logs(socket);
}); 

//VIEWS
app.get("/", (requst,response) => {
    // response.send("hello world")
    data = {
        route:"login"
    }
    response.render("login",data)
});


app.post("/",(req,res) => {
    // console.log(req.body)
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    let user = req.body.user
    let id;
    // console.log(req.body)

    if (user) {
        // console.log("running user function")
        users[user] = [
            users["name"] = user || username,
            users["profile_id"] = req.body.id, //for now hardcoded to 3434 but setup later get from db the profile_id
            users["profile_img"] = req.body.profile_image,
            users["email"] = req.body.email
        ]
        query.insertUser(req.body.user,req.body.id,req.body.profile_image,req.body.email)
        res.redirect(`/profile/${user}/tasks`)
    } else if (email) {
        users[username] = [
            users["name"] = user || username,
            users["profile_id"] = req.body.id || 3434, //for now hardcoded to 3434 but setup later get from db the profile_id
            users["profile_img"] = req.body.profile_image,
            users["email"] = req.body.email
        ]
        res.redirect(`/profile/${username}/test-task`)
    }
});

app.get("/profile/:name/:tab", (req,res) => {
    users[req.params.name] =[
        users["tab"] = req.params.tab
    ]

    if (req.params.tab == "tasks" ) {
        con.query("SELECT * FROM EaglePlanner_tasks WHERE id = ?",[users["profile_id"]], function (err, result, fields) {
            if (err) {
            //
            }
            // console.log(result)
            res.render("profile",{user:users,data:result})
        }); 
    } else if (req.params.tab == "notes") {
        con.query("SELECT * FROM EaglePlanner_notes WHERE id = ?",[users["profile_id"]], function (err, result, fields) {
            if (err) {
            //
            }
            // console.log(result)
            res.render("profile",{user:users,data:result})
        }); 
    } else if (req.params.tab == "calendar") {
        con.query("SELECT * FROM EaglePlanner_tasks WHERE id = ?",[users["profile_id"]], function (err, result, fields) {
            if (err) {
            //
            }
            // console.log(result)
            res.render("profile",{user:users,data:result})
        }); 
    } // do not use || keyword in one of the if statements because it breaks and stops checking the other statements
});

//App running
server.listen(port, ()=> {
    console.log(`App running at http://localhost:${port}`)
});

//Useful docs
//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction
//https://socket.io/get-started/chat
//https://www.npmjs.com/package/mysql || https://stackoverflow.com/questions/9822313/remote-connect-to-cleardb-heroku-database#:~:text=In%20heroku%20website%2C%20go%20to,you%20see%20your%20username%2Fpassword.
