const express = require("express");
const mysql = require("mysql");
const https = require("https");
const bodyParser = require("body-parser");
const session = require("express-session");
const { request } = require("http");
const e = require("express");
const { type } = require("os");

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
    password: "password",
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

// GET methods ===================================================================
app.get("/", function (req, res) {
    // console.log("hi");
    if (req.session.loggedin) {
        let date = new Date();
        let hours = date.getHours();
        let msg = "";
        if (hours >= 3 && hours < 11) msg = "Good morning";
        else if (hours >= 11 && hours < 16) msg = "Good afternoon";
        else if (hours >= 16 && hours < 21) msg = "Good evening";
        else msg = "Good night";
        res.render("home", {
            welcomeMessage: msg + ", " + req.session.faculty.name + "!",
        });
    } else {
        // res.sendFile(__dirname + "/signup.html");
        res.render("login", {
            message: "",
        });
    }
});

app.get("/profile", function (req, res) {
    res.render("profile", {
        faculty: req.session.faculty,
    });
});

app.get("/logout", function (req, res) {
    req.session.loggedin = false;
    req.session.email = null;
    req.session.faculty = null;
    res.redirect("/");
});

app.get("/courseinfo", function (req, res) {
    
    connection.query(
        "select * from course_list where course_code='15CSE301';",
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length ==1) {
                success = true;
                studlist = results;
                console.log(results.length);
                res.render("courseinfo", {
                    status:true,
                    syllabus: results[0]['course_syllabus'],
                    details:results[0]['course_details'],
                    eval:results[0]['course_eval'],
                    co:results[0]['course_outcome']
                });
            } else {
                success = false;
                console.log(results.length);
                res.render("courseinfo", {
                    status: false,
                    syllabus: "#",
                    details: "#",
                    eval: "#",
                    co: "#"
                });
            }
        }
    );
});

app.get("/reg_students", function (req, res) {
    var success = false;
    var studlist = [];
    connection.query(
        "select roll_number from student_18 where roll_number like '%U4CSE180%' order by roll_number;",
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length > 0) {
                success = true;
                studlist = results;
                console.log(results.length);
                res.render("reg_students", {
                    status: success,
                    liststud: studlist,
                });
            } else {
                success = false;
                console.log(results.length);
                res.render("reg_students", {
                    status: success,
                    liststud: [],
                });
            }
        }
    );
});
app.get("/mark_grade", function (req, res) {
    
    ttype=req.query.testtype;
    tnum=req.query.testnum;
    console.log(ttype);
    add_msg=req.query.addmsg;
    connection.query(
        "select ass_name from assessment_list where course_code_full= '15CSE387_2018_B.Tech_CSE_A';",
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length >= 1) {
                console.log(results);
                ass_list=[];
                for(i in results){
                    ass_list.push(results[i]['ass_name']);
                }
                ass_name=req.query.assname;
                if(ass_name==null)
                    ass_name=ass_list[0];
                console.log(ass_name);
                q="select roll_number,"+ass_name+" from student_academic_info;"
                
                connection.query(
                    q,
                    function (error, results, fields) {
                        if (error) console.log(error);
                        else if (results.length >= 1) {
                            smark=[]
                            for(i=0;i<results.length;i++)
                            {
                                smark.push([ results[i]['roll_number'] , results[i][ass_name]]);
                            }
                            console.log(smark);
                            res.render("mark_grade",{
                                addmsg:add_msg,
                                asslist:ass_list,
                                stud_marks: smark,
                                currass: "Current Assessment: "+ass_name
                            });
                        } 
                        else {
                            console.log(results);
                            res.render("mark_grade",{
                                addmsg:add_msg,
                                asslist:ass_list,
                                stud_marks: [],
                                currass: "Current Assessment: "+ass_name
                            });
                        }
                    }
                );

            } else {
                console.log(results);
                res.render("mark_grade",{
                    addmsg:add_msg,
                    asslist:[],
                    stud_marks:[],
                    currass: ""
                });
            }
        }
    );
    
});


app.get("/det_student_info", function (req, res) {
    console.log(req);
    rno = req.query.rollno;
    console.log(rno);
    var stud_info={}
    connection.query(
        "select * from student_18 where roll_number= ?;",
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                res.send({resp:true,rec:results[0]});
            } else {
                console.log(results);
                res.send({resp:false,rec:{}});
            }
        }
    );
    console.log(stud_info);
    
});

app.get("/get_quiz_marks", function (req, res) {
    console.log(req);
    rno = req.query.rollno;
    console.log(rno);
    var stud_info={}
    connection.query(
        "select * from student_academic_info where roll_number=?; ",
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                marks={}
                for(k in results[0]){
                    if(k.startsWith("Q")){
                        k1=k.slice(1,k.length)
                        marks[k1]=results[0][k];
                    }
                }
                res.send({resp:true,rec:marks});
            } else {
                console.log(results);
                res.send({resp:false,rec:{}});
            }
        }
    );
    console.log(stud_info);
});

app.get("/get_assignment_marks", function (req, res) {
    console.log(req);
    rno = req.query.rollno;
    console.log(rno);
    var stud_info={}
    connection.query(
        "select * from student_academic_info where roll_number=?; ",
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                marks={}
                for(k in results[0]){
                    if(k.startsWith("A")){
                        k1=k.slice(1,k.length);
                        marks[k1]=results[0][k];
                    }
                }
                res.send({resp:true,rec:marks});
            } else {
                console.log(results);
                res.send({resp:false,rec:{}});
            }
        }
    );
    console.log(stud_info);
});

app.get("/get_periodical_marks", function (req, res) {
    console.log(req);
    rno = req.query.rollno;
    console.log(rno);
    var stud_info={}
    connection.query(
        "select * from student_academic_info where roll_number=?; ",
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                marks={}
                for(k in results[0]){
                    if(k.startsWith("P")){
                        k1=k.slice(1,k.length);
                        marks[k1]=results[0][k];
                    }
                }
                res.send({resp:true,rec:marks});
            } else {
                console.log(results);
                res.send({resp:false,rec:{}});
            }
        }
    );
    console.log(stud_info);
});

app.get("/get_attendance", function (req, res) {
    console.log(req);
    rno = req.query.rollno;
    console.log(rno);
    var stud_info={}
    connection.query(
        "select roll_number,(sum(classes)/sum(e_period-s_period+1))*100 as percentage from attendance group by roll_number having roll_number=?;",
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                res.send({resp:true,rec:results[0]['percentage']});
            } else {
                console.log(results);
                res.send({resp:false,rec:{}});
            }
        }
    );
    console.log(stud_info);
});





// POST methods ----------------------------------------------------------
app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    connection.query(
        "select * from login where email = ? and passwd = ? ",
        [email, password],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length > 0) {
                message = "";
                req.session.loggedin = true;
                req.session.email = email;
                connection.query(
                    "select * from faculty where emailID = ?",
                    [email],
                    function (err, rows, fields) {
                        req.session.faculty = rows[0];
                        // console.log(req.session.faculty);
                        res.redirect("/");
                    }
                );
            } else {
                res.render("login", {
                    message: "Incorrect email Id or password.",
                });
            }
        }
    );
});

app.post("/add_assessment", function (req, res) {
    console.log("assessment");
    ttype=req.body.testtype;
    tnum= req.body.testnum;
    tmarks=req.body.testmark;
    colname=ttype[0]+tnum;
    connection.query(
        "insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A',?,?);",
        [colname,tmarks],
        function (error, results, fields) {
            if (error){
                console.log(error);
                var msg = encodeURIComponent("Sorry assessment is already available");
                res.redirect("/mark_grade?addmsg="+msg);
            }
             else {
                 q="alter table student_academic_info add "+colname+" float;"
                console.log("ok");
                connection.query(
                    q,
                    function (error, results, fields) {
                        if (error){
                            console.log(error);
                            var msg = encodeURIComponent("Sorry assessment is already available");
                            res.redirect("/mark_grade?addmsg="+msg);
                        }
                         else {
                            console.log("ok");
                            var msg = encodeURIComponent("Added successfully");
                            res.redirect("/mark_grade?addmsg="+msg);
                        }
                    }
                );
                
            }
        }
    );  
});

app.post("/get_ass_marks", function (req, res) {
    var msg = encodeURIComponent(req.body.inputTest);
    res.redirect("/mark_grade?assname="+msg);   
});

app.post("/update_marks", function (req, res) {
    console.log("Inside update marks");
    console.log(req); 
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
