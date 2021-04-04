const express = require("express");
const mysql = require("mysql");
const https = require("https");
const bodyParser = require("body-parser");
const session = require("express-session");
const { request } = require("http");
const e = require("express");
const { type } = require("os");

const app = express();

cid="";
cbatch="";
cdept="";
csect="";
process.stdin.resume();

app.set("view engine", "ejs");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// app.use(express.urlencoded()); //Parse URL-encoded bodies, instead of bodyParser

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

        wel=msg + ", " + req.session.faculty.name + "!";
        console.log(wel);
        connection.query(
            "select course_id,batch,dept,section from course_faculty where faculty_id=?;",
            [req.session.faculty.id],
            function (error, result, fields) {
                if (error) console.log("Error occured while fetching departments");
                else if(result.length>=1){
                    console.log(result);
                    course_sel=result[0]['course_id']+" "+result[0]['batch']+" "+result[0]['dept']+" "+result[0]['section'];
                    req.session.course=result[0];
                    res.render("home",{
                        courselen:result.length,
                        welcomeMessage:wel,
                        courses:result,
                        coursesel:course_sel
                    });
                }
                else{
                    res.render("home",{
                        courselen:result.length,
                        welcomeMessage:wel,
                        courses:[],
                        coursesel:""
                    });
                }
            }
        );
        
    } else {
        res.render("login", {
            message: "",
        });
    }
});

app.get("/updatecoursetab", function (req, res) {
    console.log(req.session.course);
    s=req.query.course.trim().split(" ");
    console.log(s);
    req.session.course.course_id=s[0];
    req.session.course.batch=parseInt(s[1]);
    req.session.course.dept=s[2];
    req.session.course.section=s[3];
    res.send({"status":true});
});

app.get("/profile", function (req, res) {
    res.render("profile", {
        faculty: req.session.faculty,
        notification: "",
        bgcolor: "",
    });
});

app.get("/logout", function (req, res) {
    req.session.loggedin = false;
    req.session.email = null;
    req.session.faculty = null;
    res.redirect("/");
});

app.get("/admin", function (req, res) {
    connection.query(
        "SELECT id FROM department",
        [],
        function (error, result, fields) {
            if (error) console.log("Error occured while fetching departments");
            else {
                for (let index = 0; index < result.length; index++) {
                    result[index] = result[index].id;
                }
                let msg = req.session.notifyMSG;
                let color = req.session.msgStatusColor;
                req.session.notifyMSG = null;
                req.session.msgStatusColor = null;
                res.render("admin", {
                    welcomeMessage: "Welcome, Harry!",
                    dept: result,
                    notification: msg,
                    bgcolor: color,
                });
            }
        }
    );
});

app.get("/myclass", function (req, res) {
    res.render("myclass");
});

app.get("/temp", function (req, res) {
    res.render("temp");
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
    l="%U4";
    console.log("Inside reg students");
    console.log(req.session);
    l+=req.session.course.dept;
    l+=req.session.course.batch%2000;
    l+=req.session.course.section.charCodeAt(0) - 'A'.charCodeAt(0);
    l+="%";
    console.log(l);
    connection.query(
        "select roll_number from student where roll_number like ? order by roll_number;",
        [l],
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
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    connection.query(
        "select ass_name from assessment_list where course_code_full= ?;",
        [cname],
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
                tablename="course_"+cname;
                q="select roll_number,"+ass_name+" from "+tablename+"_student_academic_info;"
                
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
    var stud_info={};
    connection.query(
        "select * from student where roll_number= ?;",
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
    var stud_info={};
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
    console.log("quiz "+tablename);
    q="select * from "+tablename+"_student_academic_info where roll_number=?;";
    connection.query(
        q,
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
    var stud_info={};
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
    console.log("assignment "+tablename);
    q="select * from "+tablename+"_student_academic_info where roll_number=?;";
    connection.query(
        q,
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
    var stud_info={};
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
    console.log("per "+tablename);
    q="select * from "+tablename+"_student_academic_info where roll_number=?;";
    connection.query(
        q,
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
    var stud_info={};
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
    
    connection.query(
        "select roll_number,(sum(classes)/sum(e_period-s_period+1))*100 as percentage from "+tablename+"_attendance group by roll_number having roll_number=?;",
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

    if (email == "harishcse18501@gmail.com") {
        if (password == "qwertyui") {
            res.redirect("/admin");
        } else {
            res.render("login", {
                message: "Incorrect email Id or password.",
            });
        }
    } else {
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
    }
});

app.post("/updateProfile", function (req, res) {
    let email = req.session.email;
    let name = req.body.name;
    let dob = req.body.dob;
    let address = req.body.address;
    let mobile = req.body.mobile;
    let qual = req.body.qualification;

    connection.query(
        "UPDATE faculty SET name=?,DOB=?,address=?,phone=?,qualification=? WHERE emailID=?",
        [name, dob, address, mobile, qual, email],
        function (error, results, fields) {
            if (error) {
                res.render("profile", {
                    faculty: req.session.faculty,
                    notification:
                        "Error occured while updating profile. Try again.",
                    bgcolor: "bg-danger",
                });
            } else {
                connection.query(
                    "select * from faculty where emailID = ?",
                    [email],
                    function (err, rows, fields) {
                        req.session.faculty = rows[0];
                        // res.redirect("/profile");
                        res.render("profile", {
                            faculty: req.session.faculty,
                            notification: "Profile updated successfully",
                            bgcolor: "bg-success",
                        });
                    }
                );
            }
        }
    );
});

app.post("/addNewFaculty", function (req, res) {
    let f = req.body;
    connection.query(
        "INSERT INTO faculty VALUES(?,?,?,?,?,?,?,?,?,?)",
        [
            f.id,
            f.name,
            f.email,
            f.dob,
            f.gender,
            f.address,
            f.mobile,
            f.dept,
            f.qualification,
            f.designation,
        ],
        function (err, result, fields) {
            if (err) {
                req.session.notifyMSG = "Error occured. Faculty not added.";
                req.session.msgStatusColor = "bg-danger";
            } else {
                req.session.notifyMSG = "Added new faculty to database";
                req.session.msgStatusColor = "bg-success";
            }
            res.redirect("/admin");
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
                cname=req.session.course.course_id+"_";
                cname+=req.session.course.batch+"_";
                cname+=req.session.course.dept+"_";
                cname+=req.session.course.section;
                tablename="course_"+cname;
                q="alter table "+tablename+"_student_academic_info add "+colname+" float;"
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
