const express = require("express");
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
    users[user] = [
        users["name"] = user || username,
        users["profile_id"] = req.body.id,
        users["profile_img"] = req.body.profile_image,
        users["email"] = req.body.email
    ]
    res.redirect(`/profile/${username}` || `/profile/${user}`)
    // if (username) {
    //     res.redirect(`/profile/${username}`)
    // } else if (user) {
    //     `/profile/${user}`
    // }
})

app.get("/profile/:name", (req,res) => {
    data = {
        route:"profile",
        name:req.params.name,
        token:users["id"]
    }
    res.render("profile",users)
})

//App running
app.listen(port, ()=> {
    console.log(`App running at http://localhost:${port}`)
})