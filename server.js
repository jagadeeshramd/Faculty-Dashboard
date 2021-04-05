const express = require("express");
const mysql = require("mysql");
const https = require("https");
const bodyParser = require("body-parser");
const session = require("express-session");
const { request } = require("http");
const e = require("express");
const { type } = require("os");
//const nodemailer = require("nodemailer");
const pass = require("./config.js");

const app = express();

cid = "";
cbatch = "";
cdept = "";
csect = "";
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
    password: pass.SQLPass,
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

        wel = msg + ", " + req.session.faculty.name + "!";
        // console.log(wel);
        connection.query(
            "select course_id,batch,dept,section from course_faculty where faculty_id=?;",
            [req.session.faculty.id],
            function (error, result, fields) {
                if (error)
                    console.log("Error occured while fetching departments");
                else if (result.length >= 1) {
                    // console.log(result);
                    course_sel =result[0]["course_id"] +" " +result[0]["batch"] +" " +result[0]["dept"] +" " +result[0]["section"];
                    req.session.course = result[0]; // first course in the list is made default
                    res.render("home", {
                        courselen: result.length,
                        welcomeMessage: wel,
                        courses: result,
                        coursesel: course_sel,
                    });
                } else {
                    res.render("home", {
                        courselen: result.length,
                        welcomeMessage: wel,
                        courses: [],
                        coursesel: "",
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
    
    s = req.query.course.trim().split("\n");
    for(i=0;i<s.length;i++)
    s[i]=s[i].trim();
    console.log(s);
    req.session.course.course_id = s[0];
    req.session.course.batch = parseInt(s[1]);
    req.session.course.dept = s[2];
    req.session.course.section = s[3];
    res.send({ status: true });
});

app.get("/tests-and-assignments", function (req, res) {
    connection.query(
        "SELECT * FROM tests WHERE course=?",
        [req.session.course.course_id],
        function (err, result1, fields) { 
            if (err) console.log(err);
            else {
                connection.query(
                    "SELECT * FROM assignments WHERE course=?",
                    [req.session.course.course_id],
                    function (err, result2, fields) { 
                        if (err) console.error(err);
                        let msg = req.session.notifyMSG;
                        let color = req.session.msgStatusColor;
                        req.session.notifyMSG = null;
                        req.session.msgStatusColor = null;
                        res.render("testAssignment", {
                            tests: result1,
                            assignments: result2,
                            notification: msg,
                            bgcolor: color,
                        });
                     }
                );
                
            }
        });
});

app.get("/resources", function (req, res) {
    connection.query(
        "SELECT * FROM resources WHERE course=?",
        [req.session.course.course_id],
        function (err, result1, fields) {
            if (err) console.log(err);
            else {
                    let msg = req.session.notifyMSG;
                    let color = req.session.msgStatusColor;
                    req.session.notifyMSG = null;
                    req.session.msgStatusColor = null;
                    datetime = new Date();
                    mdate = datetime.toISOString().slice(0, 10);
                    res.render("resources", {
                        resources: result1,
                        m_date: mdate,
                        notification: msg,
                        bgcolor: color,
                    });
                    }
        });
});

app.get("/profile", function (req, res) {
    let msg = req.session.notifyMSG;
    let color = req.session.msgStatusColor;
    req.session.notifyMSG = null;
    req.session.msgStatusColor = null;

    res.render("profile", {
        faculty: req.session.faculty,
        notification: msg,
        bgcolor: color,
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
    req.session.classID = null;
    l = req.session.faculty.id;
    connection.query("SELECT classid FROM advisor_class WHERE advisor_id = ?;", [l], function (error, results, fields) {
        if (error) console.log(error);
        else if (results[0].classid) {
            req.session.classID = results[0].classid;
            res.render("myclass", { classid: req.session.classID });
        }
        else {
            req.session.classID = "No Class";
            res.render("myclass", { classid: req.session.classID });
        }
    });
    
});

app.get("/myclass_students", function (req, res) {
    var success = false;
    var studlist = [];
    l=req.session.faculty.id;
    classID = req.session.classID;

    // connection.query("SELECT classid FROM advisor_class WHERE advisor_id = ?;", [l], function(error,results,fields){
    //     if(error) console.log(error);
    //     else if(results[0].classid){
    //         classID = results[0].classid;
    //     }
    //     else{
    //         classID = "No Class";
    //     }
    // });

    connection.query(
        // SELECT * FROM student_det S INNER JOIN parent_det P ON S.roll_number = P.roll_number where S.advisor_id = ?;

        "select roll_number from student_det where advisor_id = ? order by roll_number;",
        [l],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length > 0) {
                success = true;
                studlist = results;
                res.render("myclass_students", {
                    status: success,
                    liststud: studlist,
                    classid: classID,
                });
            } else {
                success = false;
                res.render("myclass_students", {
                    status: success,
                    liststud: [],
                    classid: classID,
                });
            }
        }
    );
});

app.get("/det_student_detail_info", function (req, res) {
    rno = req.query.rollno;
    var stud_info = {};
    connection.query(
        "SELECT * FROM student_det S INNER JOIN parent_det P ON S.roll_number = P.roll_number where S.roll_number = ?;",
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                res.send({ resp: true, rec: results[0] });
            } else {
                res.send({ resp: false, rec: {} });
            }
        }
    );
});

app.get("/temp", function (req, res) {
    res.render("temp");
});

app.get("/courseinfo", function (req, res) {
    connection.query(
        "select * from course_list where course_code='15CSE301';",
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                success = true;
                studlist = results;
                res.render("courseinfo", {
                    status: true,
                    syllabus: results[0]["course_syllabus"],
                    details: results[0]["course_details"],
                    eval: results[0]["course_eval"],
                    co: results[0]["course_outcome"],
                });
            } else {
                success = false;
                res.render("courseinfo", {
                    status: false,
                    syllabus: "#",
                    details: "#",
                    eval: "#",
                    co: "#",
                });
            }
        }
    );
});

app.get("/reg_students", function (req, res) {
    var success = false;
    var studlist = [];
    l="%U4";
    l+=req.session.course.dept;
    l+=req.session.course.batch%2000;
    l+=req.session.course.section.charCodeAt(0) - 'A'.charCodeAt(0);
    l+="%";
    connection.query(
        "select roll_number from student where roll_number like ? order by roll_number;",
        [l],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length > 0) {
                success = true;
                studlist = results;
                res.render("reg_students", {
                    status: success,
                    liststud: studlist,
                });
            } else {
                success = false;
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
    add_msg=req.query.addmsg;
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    u="";
    if(req.query.updatemsg!=null)
    u=req.query.updatemsg;
    connection.query(
        "select ass_name from assessment_list where course_code_full= ?;",
        [cname],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length >= 1) {
                ass_list=[];
                for(i in results){
                    ass_list.push(results[i]['ass_name']);
                }
                ass_name=req.query.assname;
                if(ass_name==null)
                    ass_name=ass_list[0];
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
                            res.render("mark_grade",{
                                addmsg:add_msg,
                                asslist:ass_list,
                                stud_marks: smark,
                                currass: ass_name,
                                update: u
                            });
                        } 
                        else {
                            res.render("mark_grade",{
                                addmsg:add_msg,
                                asslist:ass_list,
                                stud_marks: [],
                                currass: ass_name,
                                update: u
                            });
                        }
                    } );
            } else {
                res.render("mark_grade",{
                    addmsg:add_msg,
                    asslist:[],
                    stud_marks:[],
                    currass: "",
                    update:u
                });
            }
        }
    );
});

app.get("/det_student_info", function (req, res) {
    rno = req.query.rollno;
    var stud_info={};
    connection.query(
        "select * from student where roll_number= ?;",
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                res.send({ resp: true, rec: results[0] });
            } else {
                res.send({resp:false,rec:{}});
            }
        }
    );
});

app.get("/get_quiz_marks", function (req, res) {
    rno = req.query.rollno;
    var stud_info={};
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
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
                res.send({resp:false,rec:{}});
            }
            
        } 
    );
    
});

app.get("/get_assignment_marks", function (req, res) {
    rno = req.query.rollno;
    var stud_info={};
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
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
                res.send({resp:false,rec:{}});
            }
            
        } );
    console.log(stud_info);
});

app.get("/get_periodical_marks", function (req, res) {
    rno = req.query.rollno;
    
    var stud_info={};
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
    
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
                
                res.send({resp:false,rec:{}});
            }
            
        } 
    );
    
});


app.get("/attendance", function (req, res) {
    res.render("attendance",{isstatic:false,addmsg:""});
});

app.get("/get_attendance_list", function (req, res) {
    
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
    d=req.query.attdate;
    s=req.query.speriod;
    ep=req.query.eperiod;
    u="";
    if(req.query.updatemsg!=null)
    u=req.query.updatemsg;
    
    console.log(d+" "+s+" "+ep);
    
    q="select * from "+tablename+"_attendance where att_date=? and s_period=? and e_period=?;";
    connection.query(
        q,
        [d,s,ep],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length > 0) {
                success = true;
                //console.log(results);
                for(i=0;i<results.length;i++)
                {
                    results[i]['att_date']=d;
                }
                res.render("attendance", {
                    status: success,
                    attlist: results,
                    isstatic:true,
                    addmsg:"",
                    update:u
                });
            } else {
                success = false;
                q= "select distinct roll_number from "+tablename+"_attendance;"
                connection.query(
                    q,
                    function (error, results, fields) {
                        if (error) console.log(error);
                        else if (results.length > 0) {
                            success = true;
                            studlist = results;
                            att=[]
                            for(i=0;i<results.length;i++)
                            {
                                o={}
                                o['roll_number']=results[i]['roll_number'];
                                o['att_date']=d;
                                o['s_period']=s;
                                o['e_period']=ep;
                                o['classes']=0;
                                att.push(o);
                            }
                            res.render("attendance", {
                                status: true,
                                attlist: att,
                                isstatic:true,
                                addmsg:"",
                                update:u
                            });
                        } else {
                            success = false;
                            res.render("attendance", {
                                status: true,
                                attlist: att,
                                isstatic:true,
                                addmsg:"",
                                update:u
                            });
                        }
                    }
                );
            }
        }
    );
});



app.get("/get_attendance", function (req, res) {
    
    rno = req.query.rollno;
    var stud_info={};
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname;
    
    connection.query(
        "select roll_number,(sum(classes)/sum(e_period-s_period+1))*100 as percentage from " +
            tablename +
            "_attendance group by roll_number having roll_number=?;",
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                res.send({ resp: true, rec: results[0]["percentage"] });
            } else {
                res.send({resp:false,rec:{}});
            }
        }
    );
    
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
                req.session.notifyMSG = "Error occured while updating profile. Try again.";
                req.session.msgStatusColor = "bg-danger";
                res.redirect("/profile");

            } else {
                connection.query(
                    "select * from faculty where emailID = ?",
                    [email],
                    function (err, rows, fields) {
                        req.session.faculty = rows[0];
                        req.session.notifyMSG = "Profile updated successfully";
                        req.session.msgStatusColor = "bg-success";
                        res.redirect("/profile");
                    }
                );
            }
        }
    );
});

app.post("/updatePassword", function(req, res) {
    connection.query(
        "SELECT * FROM login WHERE email=? AND passwd=?",
        [req.session.email, req.body.oldpasswd],
        function(err, result, fields) {
            if (err) {
                req.session.notifyMSG = "Error occured. Password not changed.";
                req.session.msgStatusColor = "bg-danger";
            } else {
                if (result.length == 0) {
                    req.session.notifyMSG = "Wrong password. Password not changed";
                    req.session.msgStatusColor = "bg-warning";
                }
                else {
                    connection.query(
                        "UPDATE login SET passwd=? WHERE email=?",
                        [req.body.newpasswd, req.session.email],
                    )
                    req.session.notifyMSG = "Password changed successfully!";
                    req.session.msgStatusColor = "bg-success";
                }
            }
            res.redirect("/profile");
        }
    )
})

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
                let code = Math.random().toString(36).slice(4);

                connection.query(
                    "INSERT INTO login VALUES(?,?)",
                    [f.email, code],
                    function (err, result, fields) {
                        if (err) console.log(error);
                        // else {
                        //     var transporter = nodemailer.createTransport({
                        //         service: "gmail",
                        //         auth: {
                        //             user: "harishcse18501@gmail.com",
                        //             pass: pass.GPassword,
                        //         },
                        //     });

                        //     var mailOptions = {
                        //         from: "harishcse18501@gmail.com",
                        //         to: f.email,
                        //         subject:
                        //             "Faculty Dashboard - User account created.",
                        //         text:
                        //             "Greetings!\n\tAdmin Harry has created an account for you in the Faculty Dashboard application.\n\nEmail id: " +
                        //             f.email +
                        //             "\nPassword: " +
                        //             code +
                        //             "\nThis password is randomly generated. You can change your password after logging in. \nHave a great day!\nRegards, Admin.",
                        //     };

                        //     transporter.sendMail(
                        //         mailOptions,
                        //         function (error, info) {
                        //             if (error) {
                        //                 console.log(error);
                        //             } else {
                        //                 console.log(
                        //                     "Email sent: " + info.response
                        //                 );
                        //             }
                        //         }
                        //     );
                        // }
                    }
                );
            }
            res.redirect("/admin");
        }
    );
});

app.post("/addNewTest", function(req, res){
    // console.log(req.body);
    connection.query(
        "INSERT INTO tests(name, date,time, instructions, course) VALUES(?,?,?,?,?)",
        [req.body.name, req.body.date, req.body.time, req.body.instructions, req.session.course.course_id],
        function (err, results, fields) { 
            if (err) {
                req.session.notifyMSG = "Error occured. Test not scheduled.";
                req.session.msgStatusColor = "bg-danger";
            } else {
                req.session.notifyMSG = "Scheduled test successfully!";
                req.session.msgStatusColor = "bg-success";
            }
            res.redirect("/tests-and-assignments");
        }
    )
    
});

app.post("/addNewAssignment", function(req, res){
    // console.log(req.body);
    connection.query(
        "INSERT INTO assignments(name, date,time, instructions, course) VALUES(?,?,?,?,?)",
        [req.body.name, req.body.date, req.body.time, req.body.instructions, req.session.course.course_id],
        function (err, results, fields) { 
            if (err) {
                req.session.notifyMSG = "Error occured. Assignment not created.";
                req.session.msgStatusColor = "bg-danger";
            } else {
                req.session.notifyMSG = "Assignment created successfully!";
                req.session.msgStatusColor = "bg-success";
            }
            res.redirect("/tests-and-assignments");
        }
    )
    
});

app.post("/addNewResource", function (req, res) {
    console.log(req.body);
    datetime = new Date();
    mdate = datetime.toISOString().slice(0, 10);
    console.log(mdate);
    connection.query(
        "INSERT INTO resources(name, modified_date, instructions, course) VALUES(?,?,?,?);",
        [req.body.name, mdate, req.body.instructions, req.session.course.course_id],
        function (err, results, fields) {
            if (err) {
                console.log(err);
                req.session.notifyMSG = "Error occured. Resource not added.";
                req.session.msgStatusColor = "bg-danger";
            } else {
                req.session.notifyMSG = "Resource added successfully!";
                req.session.msgStatusColor = "bg-success";
            }
            res.redirect("/resources");
        }
    )

});

app.post("/add_assessment", function (req, res) {
    console.log("assessment");
    ttype = req.body.testtype;
    tnum = req.body.testnum;
    tmarks = req.body.testmark;
    colname = ttype[0] + tnum;
    cname = req.session.course.course_id + "_";
    cname += req.session.course.batch + "_";
    cname += req.session.course.dept + "_";
    cname += req.session.course.section;
    connection.query(
        "insert into assessment_list values(?,?,?);",
        [cname, colname, tmarks],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                var msg = encodeURIComponent(
                    "Sorry assessment is already available"
                );
                res.redirect("/mark_grade?addmsg=" + msg);
            } else {
                tablename = "course_" + cname;
                q =
                    "alter table " +
                    tablename +
                    "_student_academic_info add " +
                    colname +
                    " float;";
                console.log("ok");
                connection.query(q, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        var msg = encodeURIComponent(
                            "Sorry assessment is already available"
                        );
                        res.redirect("/mark_grade?addmsg=" + msg);
                    } else {
                        console.log("ok");
                        var msg = encodeURIComponent("Added successfully");
                        res.redirect("/mark_grade?addmsg=" + msg);
                    }
                });
            }
        }
    );
});

app.post("/get_ass_marks", function (req, res) {
    var msg = encodeURIComponent(req.body.inputTest);
    res.redirect("/mark_grade?assname=" + msg);
});

app.post("/update_marks", function (req, res) {
    roll_number=req.body.roll_number;
    console.log("update marks");
    a=req.body.assignment;
    m=req.body.marks;
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname+"_student_academic_info";
    q="update "+tablename+" set "+a+"=? where roll_number=?";
    console.log(q);
    connection.query(
        q,
        [m,roll_number],
        function (error, results, fields) {
            if (error){
                console.log(error);
                res.redirect("/mark_grade?updatemsg=''");
            }
             else {
                console.log("ok");
                var msg = encodeURIComponent("Added successfully");
                res.redirect("/mark_grade?updatemsg=Updated successfully");
            }
        }
    );
});

app.post("/update_attendance", function (req, res) {
    roll_number=req.body.roll_number;
    console.log("update att");
    r=req.body.roll_number;
    d=req.body.attdate;
    s=req.body.speriod;
    ep=req.body.eperiod;
    c=req.body.classes;
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname+"_attendance";
    q="select * from "+tablename+" where att_date='"+d+"' and s_period="+s+" and e_period="+ep+" and roll_number='"+r+"';";
    console.log(q);
    connection.query(
        q,
        function (error, results, fields) {
            if (error){
                console.log(error);
                res.redirect("/attendance?updatemsg=error&attdate="+d+"&speriod="+s+"&eperiod="+ep);
            }
             else if(results.length==1) {
                q="update "+tablename+" set classes="+c+" where att_date='"+d+"' and s_period="+s+" and e_period="+ep+" and roll_number='"+r+"';";
                console.log(q);
                connection.query(
                    q,
                    [c,d,s,ep],
                    function (error, results, fields) {
                        if (error){
                            console.log(error);
                            res.redirect("/get_attendance_list?updatemsg=error&attdate="+d+"&speriod="+s+"&eperiod="+ep);
                        }
                         else {
                            console.log("ok");
                            var msg = encodeURIComponent("Added successfully");
                            res.redirect("/get_attendance_list?updatemsg=Updated successfully&attdate="+d+"&speriod="+s+"&eperiod="+ep);
                        }
                    }
                );
            }
            else{
                q="insert into "+tablename+" values(?,?,?,?,?);";
                connection.query(
                    q,
                    [r,d,s,ep,c],
                    function (error, results, fields) {
                        if (error){
                            console.log(error);
                            res.redirect("/get_attendance_list?updatemsg=error&attdate="+d+"&speriod="+s+"&eperiod="+ep);
                        }
                         else {
                            console.log("ok");
                            var msg = encodeURIComponent("Added successfully");
                            res.redirect("/get_attendance_list?updatemsg=Updated successfully&attdate="+d+"&speriod="+s+"&eperiod="+ep);
                        }
                    }
                );
            }
        }
    );
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
