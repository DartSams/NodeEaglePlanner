const mysql = require('mysql');

const con = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "bcc2ec4fcecbe5",
    password: "cfb6b512",
    database: "heroku_d10e4ce632a9633"
});

// con.connect(function(err) {

//    let tasks = con.query("CREATE TABLE EaglePlanner_tasks (user VARCHAR(255), id VARCHAR(255), task VARCHAR(255), due_date VARCHAR(255), status VARCHAR(20),task_key int PRIMARY KEY AUTO_INCREMENT)", function (err, result) {
//         if (err) console.log(err);
//         console.log("Table created");
//     });

//     let users = con.query("CREATE TABLE EaglePlanner_users (name VARCHAR(255), password_id VARCHAR(255), image_link VARCHAR(255), email VARCHAR(20),user_key int PRIMARY KEY AUTO_INCREMENT)", function (err, result) {
//         if (err) console.log(err);
//         console.log("Table created");
//     });

//     let note = con.query("CREATE TABLE EaglePlanner_notes (user VARCHAR(255), id VARCHAR(255), note_message VARCHAR(999), note_tag VARCHAR(50),note_key int PRIMARY KEY AUTO_INCREMENT)", function (err, result) {
//         if (err) console.log(err);
//         console.log("Table created");
//     });
// }); //creates tables

// let name = "dart"

deleteUser = (name) => {
    con.connect(function(err) {
        if (err) throw err;
        con.query(`DELETE FROM EaglePlanner_users WHERE name = '${name}'`, function (err, result, fields) {
            if (err) throw err;
        }); //returns all db entries in FutureEagles_job table
    });
}


insertUser = (name,id,image,email) => {
    con.connect(function(err) {
        if (err) console.log(err);
        con.query(`SELECT * FROM EaglePlanner_users WHERE name = '${name}'`,function (err, result, fields) {
            if (err) console.log(err)
            // console.log(result)
            if (result.length == 0) {
                con.query(`INSERT INTO EaglePlanner_users (name,password_id,image_link,email) VALUES ('${name}','${id}','${image}','${email}')`,function (err, result, fields) {
                    if (err) console.log(err)
                    console.log("Entry created")
                });
            } else if (result) {
                console.log("Entry already exist") 
                return
            }
        });
    });
} //this checks the db for users with a certain name and if found does nothing but if user not found creates new user
// insertUser("sams") //testing calling arrow function

// let note = con.query("CREATE TABLE EaglePlanner_notes (user VARCHAR(255), id VARCHAR(255), note_message VARCHAR(999), note_tag VARCHAR(50),note_key int PRIMARY KEY AUTO_INCREMENT)", function (err, result) {
// let tasks = con.query("CREATE TABLE EaglePlanner_tasks (user VARCHAR(255), id VARCHAR(255), task VARCHAR(255), due_date VARCHAR(255), status VARCHAR(20),task_key int PRIMARY KEY AUTO_INCREMENT)", function (err, result) {


createNote = (name,id,note_message,note_tag) => {
    con.connect(function(err) {
        if (err) console.log(err);
        con.query(`INSERT INTO EaglePlanner_notes (user,id,note_message,note_tag) VALUES ('${name}','${id}','${note_message}','${note_tag}')`,function (err, result, fields) {
            if (err) console.log(err)
            console.log("Entry created")
        });
    });
}


createTask = (name,id,task,due_date,status) => {
    con.connect(function(err) {
        if (err) console.log(err);
        con.query(`INSERT INTO EaglePlanner_tasks (user,id,task,due_date,status) VALUES ('${name}','${id}','${task}','${due_date}','${status}')`,function (err, result, fields) {
            if (err) console.log(err)
            console.log("Entry created")
        });
    });
}
















module.exports = { insertUser,deleteUser,createNote,createTask }; //exports functions to be able to use in other files by doing const <variableName> = require("./models")