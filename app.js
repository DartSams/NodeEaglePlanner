const express = require("express");
const mysql = require('mysql');
const query = require("./models") //imports db functions from models.js file
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