const mysql = require('mysql');

const con = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "bcc2ec4fcecbe5",
    password: "cfb6b512",
    database: "heroku_d10e4ce632a9633",
});

// const mysql = require("mysql");    
// // const dbConfig = require("../config/db.config.js");
    
// const con = mysql.createPool({
//     connectionLimit : 10,
//     host: "us-cdbr-east-04.cleardb.com",
//     user: "bcc2ec4fcecbe5",
//     password: "cfb6b512",
//     database: "heroku_d10e4ce632a9633"
// });

// module.exports = con;
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
    con.query(`INSERT INTO EaglePlanner_tasks (user,id,task,due_date,status) VALUES (?,?,?,?,?)`,[`${name}`,`${id}`,`${task}`,`${due_date}`,`${status}`],function (error, result, fields) {
        // if (error) console.log(error)
        console.log("Entry created")
    }); //uses escaping to prevent sql injections
}



showUsers = () =>{
    con.query("SELECT * FROM EaglePlanner_users", function (err, result, fields) {
        if (err) throw err;
        console.log(result)
    }); //returns all db entries in FutureEagles_job table
}

editTask = (original_task,original_date,original_status,new_task,new_date,new_status,user,id) => {
    con.query("UPDATE EaglePlanner_tasks SET task = ? , due_date = ? , status = ? WHERE task = ? AND due_date = ? AND status = ? AND user = ? AND id = ?",[original_task,original_date,original_status,new_task,new_date,new_status,user,id], function (err, result, fields) {
        if (err) throw err;
        console.log(result)
    }); //returns all db entries in FutureEagles_job table

    // con.query("UPDATE EaglePlanner_tasks SET task = ? , due_date = ? , status = ? WHERE task = ? AND due_date = ? AND status = ? ",[original_task,original_date,"gilfoyle","undefined","undefined","active"], function (err, result, fields) {
    //     if (err) throw err;
    //     console.log(result)
    // }); //returns all db entries in FutureEagles_job table
}

deleteTask = (task,status,due_date,id) => {
    // console.log(task,status,due_date,id)
    con.query("DELETE FROM EaglePlanner_tasks  WHERE task = ? AND status = ? AND due_date = ? AND id = ?",[task,status,due_date,id], function (err, result, fields) {
        if (err) throw err;
        console.log(result)
    }); //queries db for a specific note and deletes it
}

editNote = (new_note,new_tag,user,id,original_note,original_tag) => {
    console.log(new_note)
    console.log(new_tag)
    console.log(original_note)
    con.query("UPDATE EaglePlanner_notes SET note_message = ? , note_tag = ? WHERE note_message = ? AND id = ? AND note_tag = ?",[new_note,new_tag,original_note,id,original_tag], function (err, result, fields) {
        if (err) throw err;
        console.log(result)
    }); //queries db for a specific note and updates it to a new note_message and note_tag
}

deleteNote = (user,id,note) => {
    con.query("DELETE FROM EaglePlanner_notes  WHERE note_message = ? AND user = ? AND id = ?",[note,user,id], function (err, result, fields) {
        if (err) throw err;
        console.log(result)
    }); //queries db for a specific note and deletes it
}


module.exports = { insertUser,deleteUser,createNote,createTask,editTask,deleteTask,editNote,deleteNote }; //exports functions to be able to use in other files by doing const <variableName> = require("./models")
// module.exports = con;
