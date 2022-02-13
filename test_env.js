const mysql = require('mysql');
require('dotenv').config();


const con = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
});

// const con = mysql.createPool({
//     host: "us-cdbr-east-04.cleardb.com",
//     user: "bcc2ec4fcecbe5",
//     password: "cfb6b512",
//     database: "heroku_d10e4ce632a9633",
// });



selectUser = (email,name) => {
    con.on("error", (err) => {
        console.log(err)
    })
    con.query("SELECT * FROM EaglePlanner_users WHERE email = ? AND name = ?",[email,name], function (err, result, fields) {
        if (err) {
           //
        }
        console.log(result)
    }); //returns all db entries in FutureEagles_job table
}

selectUser("dsams@gmail.com","sams")