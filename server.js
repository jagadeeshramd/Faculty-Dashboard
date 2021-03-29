const express = require("express");
const mysql = require("mysql");
const https = require("https");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

process.stdin.resume();

app.set("view engine", "ejs");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.static("public"));

app.set("views", __dirname + "/views");

app.use(
    session({
        secret: "qazwsx123edc45rfv27",
        resave: false,
        saveUninitialized: true,
    })
);

// database connection

connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "#Harry1329",
    port: "3306",
    database: "facultydashboard",
});

connection.connect(function (err) {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to Database.");
});

// GET methods
app.get("/", function (req, res) {
    if (req.session.loggedin) {
        let date = new Date();
        let hours = date.getHours();
        let msg = "";
        if (hours >= 3 && hours < 11) msg = "Good morning";
        else if (hours >= 11 && hours < 16) msg = "Good afternoon";
        else if (hours >= 16 && hours < 21) msg = "Good evening";
        else msg = "Good night";
        res.render("home", {
            welcomeMessage: msg + ", " + req.session.username + "!",
        });
    } else {
        // res.sendFile(__dirname + "/signup.html");
        res.render("login", {
            message: "",
        });
    }
});

app.get("/logout", function (req, res) {
    req.session.loggedin = false;
    req.session.email = null;
    req.session.username = null;
    res.redirect("/");
});

// POST methods
app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    connection.query(
        "select * from faculty where email = ? and passwd = ? ",
        [email, password],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length > 0) {
                message = "";
                req.session.loggedin = true;
                req.session.email = email;
                req.session.username = results[0].username;
                res.redirect("/");
            } else {
                res.render("login", {
                    message: "Incorrect email Id or password.",
                });
            }
        }
    );
});

app.get("/reg_students", function (req, res) {
    res.render("reg_students");
});

app.get("/courseinfo", function (req, res) {
    res.render("courseinfo");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started running");
});

process.on("SIGINT", function () {
    console.log("\nBreaking connection with DB...");
    connection.end();
    console.log("Closed\n");
    process.exit();
});
