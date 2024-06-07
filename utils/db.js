import mysql from 'mysql2';

const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'mathu',
    database: "airline"
});

con.connect(function (err) {
    if (err) {
        console.error("Connection error:", err);
    } else {
        console.log("Connected to database");
    }
});

export default con;

