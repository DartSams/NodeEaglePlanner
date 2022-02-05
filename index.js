const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 5000;


//STATIC
app.use(express.static('public'));
app.use('/css',express.static(path.join(__dirname,"public/css")));
app.use('/js',express.static(path.join(__dirname,"public/js")));
app.use('/img',express.static(path.join(__dirname,"public/img")));


//ALLOWS TEMPLATES use ejs instead of .html
app.set('views','./views')
app.set('view engine','ejs')


//VIEWS
app.get('/', (requst,response) => {
    // response.send("hello world")
    data = {
        route:"home"
    }
    response.render("test2",data)
});

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