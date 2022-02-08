const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;


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
    console.log(req.body)
    let username = req.body.username
    let password = req.body.password
    res.redirect(`/profile/${username}`)
})

app.get("/profile/:name", (req,res) => {
    data = {
        route:"profile",
        name:req.params.name
    }
    res.render("test2",data)
})

//App running
app.listen(port, ()=> {
    console.log(`App running at http://localhost:${port}`)
})