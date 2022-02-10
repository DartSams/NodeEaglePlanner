const express = require("express");
const mysql = require('mysql');
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;
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
const con = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "bcc2ec4fcecbe5",
    password: "cfb6b512",
    database: "heroku_d10e4ce632a9633"
});

con.connect(function(err) {
    // if (err) throw err;
    // con.query("SELECT * FROM FutureEagles_job", function (err, result, fields) {
    //     if (err) throw err;
    //     // console.log(result[2].id);
    //     let entry = 2
    //     let ID = result[entry].id
    //     let user = result[entry].user
    //     let task = result[entry].task
    //     let due_date = result[entry].due_date
    //     let status = result[entry].status
    //     let user_id = result[entry].user_id
    // }); //returns all db entries in FutureEagles_job table
    // var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
   let tasks = con.query("CREATE TABLE EaglePlanner_tasks (user VARCHAR(255), id VARCHAR(255), task VARCHAR(255), due_date VARCHAR(255), status VARCHAR(20))", function (err, result) {
        if (err) console.log(err);
        console.log("Table created");
    });

    let users = con.query("CREATE TABLE EaglePlanner_users (name VARCHAR(255), password_id VARCHAR(255), image_link VARCHAR(255), email VARCHAR(20))", function (err, result) {
        if (err) console.log(err);
        console.log("Table created");
    });

    let note = con.query("CREATE TABLE EaglePlanner_notes (user VARCHAR(255), id VARCHAR(255), note_message VARCHAR(999), note_tag VARCHAR(50))", function (err, result) {
        if (err) console.log(err);
        console.log("Table created");
    });
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
    console.log(req.body)
    let username = req.body.username
    let password = req.body.password
    let user = req.body.user
    // let Id = req.body.id
    // console.log(req.body.id)
    // users[user] = [
    //     users["name"] = user || username,
    //     users["profile_id"] = req.body.id || 3434,
    //     users["profile_img"] = req.body.profile_image,
    //     users["email"] = req.body.email
    // ]

    if (user) {
        console.log("running user function")
        users[user] = [
            users["name"] = user || username,
            users["profile_id"] = req.body.id || 3434, //for now hardcoded to 3434 but setup later get from db the profile_id
            users["profile_img"] = req.body.profile_image,
            users["email"] = req.body.email
        ]
        res.redirect(`/profile/${user}/user`)
    } else if (username) {
        console.log("running username function")
        users[username] = [
            users["name"] = username,
            users["profile_id"] = 3434,
            // users["profile_img"] = req.body.profile_image,
            // users["email"] = req.body.email
        ]
        res.redirect(`/profile/${username}/tasks`)
    }
})

app.get("/profile/:name/:tab", (req,res) => {
    data = {
        route:"profile",
        name:req.params.name,
        tab:req.params.tab,
        token:users["id"]
    }
    users[req.params.name] =[
        users["tab"] = req.params.tab
    ]
    res.render("profile",users)
})

//App running
app.listen(port, ()=> {
    console.log(`App running at http://localhost:${port}`)
})