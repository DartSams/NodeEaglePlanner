const mysql = require('mysql');

const con = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "bcc2ec4fcecbe5",
    password: "cfb6b512",
    database: "heroku_d10e4ce632a9633"
});

// con.connect(function(err) {
//     // if (err) throw err;
//     // con.query("SELECT * FROM FutureEagles_job", function (err, result, fields) {
//     //     if (err) throw err;
//     //     // console.log(result[2].id);
//     //     let entry = 2
//     //     let ID = result[entry].id
//     //     let user = result[entry].user
//     //     let task = result[entry].task
//     //     let due_date = result[entry].due_date
//     //     let status = result[entry].status
//     //     let user_id = result[entry].user_id
//     // }); //returns all db entries in FutureEagles_job table
//     // var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";

//    let tasks = con.query("CREATE TABLE EaglePlanner_tasks (user VARCHAR(255), id VARCHAR(255), task VARCHAR(255), due_date VARCHAR(255), status VARCHAR(20))", function (err, result) {
//         if (err) console.log(err);
//         console.log("Table created");
//     });

//     let users = con.query("CREATE TABLE EaglePlanner_users (name VARCHAR(255), password_id VARCHAR(255), image_link VARCHAR(255), email VARCHAR(20))", function (err, result) {
//         if (err) console.log(err);
//         console.log("Table created");
//     });

//     let note = con.query("CREATE TABLE EaglePlanner_notes (user VARCHAR(255), id VARCHAR(255), note_message VARCHAR(999), note_tag VARCHAR(50))", function (err, result) {
//         if (err) console.log(err);
//         console.log("Table created");
//     });
// });