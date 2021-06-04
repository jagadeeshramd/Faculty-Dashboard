const express = require("express");
var nodemailer = require('nodemailer');
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

//functions required =============================================================

function ass_to_fullname(assessment)
{
    if(assessment.startsWith('A'))
        assessment="Assignment "+assessment.slice(1,assessment.length);
    else if(assessment.startsWith('Q'))
        assessment="Quiz "+assessment.slice(1,assessment.length);
    else if(assessment.startsWith('P'))
        assessment="Periodical "+assessment.slice(1,assessment.length);
    else if(assessment.startsWith('T'))
        assessment="Tutorial "+assessment.slice(1,assessment.length);
    return assessment;
}

function ass_to_short(ass_name)
{
    if(ass_name.startsWith('Assignment'))
        ass_name="A"+ass_name.slice(11,ass_name.length);
    else if(ass_name.startsWith('Quiz'))
        ass_name="Q"+ass_name.slice(5,ass_name.length);
    else if(ass_name.startsWith('Periodical'))
        ass_name="P"+ass_name.slice(11,ass_name.length);
    else if(ass_name.startsWith('Tutorial'))
        ass_name="T"+ass_name.slice(9,ass_name.length);
    return ass_name;
}



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
            "select course_id,batch,dept,section,ismentor from course_faculty where faculty_id=?;",
            [req.session.faculty.id],
            function (error, result, fields) {
                if (error)
                    console.log("Error occured while fetching departments");
                else if (result.length >= 1) {
                    // console.log(result);
                    if(req.session.course!=null)
                    {
                        course_sel =req.session.course.course_id +" " +req.session.course.batch +" " +req.session.course.dept +" " +req.session.course.section;
                    
                    }
                    else{
                        course_sel =result[0]["course_id"] +" " +result[0]["batch"] +" " +result[0]["dept"] +" " +result[0]["section"];
                        req.session.course = result[0]; // first course in the list is made default
                    }
                    res.render("home", {
                        courselen: result.length,
                        welcomeMessage: wel,
                        courses: result,
                        coursesel: course_sel,
                        faculty: req.session.faculty,
                    });
                } else {
                    res.render("home", {
                        courselen: result.length,
                        welcomeMessage: wel,
                        courses: [],
                        coursesel: "",
                        faculty: req.session.faculty,
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
    if(s.length==1){
        s=s[0].split("_");

        if(s.length==4){
            res.send({ status: true });
        }
        else
        {
        res.send({ status: false });
        }

    }
    else{
        for(i=0;i<s.length;i++)
            s[i]=s[i].trim();
        console.log(s);
        if(s.length==4){
            req.session.course.course_id = s[0];
            req.session.course.batch = parseInt(s[1]);
            req.session.course.dept = s[2];
            req.session.course.section = s[3];
            res.send({ status: true });
        }
        else
        {
        res.send({ status: false });
        }
    }
    
    

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
    if (req.query.facultyid != null) {
        l = req.query.facultyid;
        console.log(l);
    }
    else {
        l = req.session.faculty.id;
    }

    connection.query("SELECT classid FROM advisor_class WHERE advisor_id = ?;", [l], function (error, results, fields) {
        if (error) console.log(error);
        else if (results[0].classid) {
            req.session.classID = results[0].classid;
            res.render("myclass", { classid: results[0].classID });
        }
        else {
            req.session.classID = "No Class";
            res.render("myclass", { classid: 'No Class' });
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
    console.log(req.session.course.ismentor);
    ccode=req.session.course.course_id;
    connection.query(
        "select * from course_list where course_code='"+ccode+"';",
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
                    coursecode:ccode,
                    ismentor: req.session.course.ismentor
                });
            } else {
                success = false;
                res.render("courseinfo", {
                    status: false,
                    syllabus: "#",
                    details: "#",
                    eval: "#",
                    co: "#",
                    coursecode:ccode,
                    ismentor: 0
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
    dcname=req.session.course.course_id+" ";
    dcname=req.session.course.course_id+" ";
    dcname+=req.session.course.batch+" ";
    dcname+=req.session.course.dept+" ";
    dcname+=req.session.course.section;


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
                ass_name=req.query.assname;
                if(ass_name!=null){
                    ass_name=ass_to_short(ass_name);
                }
                for(i in results){
                    assessment=results[i]['ass_name'];
                    if(ass_name==null)
                        ass_name=assessment;
                    
                    ans=ass_to_fullname(assessment);
                    ass_list.push(ans);


                }
                
                current_ass=ass_name;
                current_ass=ass_to_fullname(current_ass);
                    

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
                                currass: current_ass,
                                update: u,
                                courseid: dcname
                            });
                        } 
                        else {
                            res.render("mark_grade",{
                                addmsg:add_msg,
                                asslist:ass_list,
                                stud_marks: [],
                                currass: current_ass,
                                update: u,
                                courseid: dcname
                            });
                        }
                    } );
            } else {
                res.render("mark_grade",{
                    addmsg:add_msg,
                    asslist:[],
                    stud_marks:[],
                    currass: "",
                    update:u,
                    courseid: dcname
                });
            }
        }
    );
});

app.get("/calculate_CA",function(req,res){
    
    dcname=req.session.course.course_id+" ";
    dcname=req.session.course.course_id+" ";
    dcname+=req.session.course.batch+" ";
    dcname+=req.session.course.dept+" ";
    dcname+=req.session.course.section;

    cname=req.session.course.course_id+"_";
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;

    tbname="course_"+cname;
    connection.query(
        "select ass_name,totalmarks,weightage from assessment_list where course_code_full=?;",
        [cname],
        function (error, results, fields) {
            if (error) console.log(error);
            else{

                ass_wt=[];
                ca_total=0;
                for(i=0;i<results.length;i++){
                    if(results[i]['ass_name'].localeCompare("CA")==0)
                    {
                        ca_total=results[i]['totalmarks'];
                        continue;
                    }
                    r=ass_to_fullname(results[i]['ass_name']);
                    ass_wt.push([r,results[i]['totalmarks'],results[i]['weightage']]);
                }
                connection.query(
                    "select roll_number,CA from "+tbname+"_student_academic_info;",
                    function (error, result_mark, fields) {
                        if (error) console.log(error);
                        else {
                            console.log(ca_total);
                            res.render("calculate_CA",{
                                courseid:dcname,
                                asswt:ass_wt,
                                camark:result_mark,
                                catotal:ca_total
                            });
                        } 
                    }
                );
            } 
        }
    );
   
});


app.get("/feedback",function(req,res){
    
    dcname=req.session.course.course_id+" ";
    dcname=req.session.course.course_id+" ";
    dcname+=req.session.course.batch+" ";
    dcname+=req.session.course.dept+" ";
    dcname+=req.session.course.section;

    cname=req.session.course.course_id+"_";
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;

    tbname="course_"+cname+"_feedback";
    connection.query(
        "select * from "+tbname+";",
        [cname],
        function (error, results, fields) {
            if (error) console.log(error);
            else{
                
                res.render("feedback",{
                    courseid:dcname,
                    result:results
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
    if(req.query.course!=null)
    {   cname=req.query.course;
        
    }
    else{
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;  
    }
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

app.get("/resetPassword", function (req, res) {
    let email = req.query.email;
    if (email) {
        let decryptedEmail = "";
        for(let i = 0; i < email.length; i++)
            decryptedEmail += String.fromCharCode(email.charCodeAt(i)-3)
    
        connection.query(
            "select * from login where email = ?",
            [decryptedEmail],
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                    res.redirect("/");
                } else if (results.length > 0) {
                    req.session.email = decryptedEmail;
                    res.render("resetPassword");
                } else {
                    res.redirect("/");
                }
            }

        );
        
    } else {
        res.redirect("/");
    }
    
});

// POST methods ----------------------------------------------------------
app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (email == pass.adminEmail) {
        if (password == pass.adminPass) {
            res.redirect("/admin");
        } else {
            res.render("login", {
                message: "Incorrect email ID or password.",
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
                        message: "Incorrect email ID or password.",
                    });
                }
            }
        );
    }
});

app.post("/forgotPassword", function (req, res) {
    let email = req.body.email;
    // console.log(email);
    connection.query(
        "select * from login where email = ?",
        [email],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(`Some error occured. Try again by refreshing the page. <br>
                <a href="/">Refresh</a>`);
            } else {
                if (results.length > 0) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: pass.GAccount,
                            pass: pass.GPassword
                        }
                    });
                    
                    let encryptedEmail = "";
                    for(let i = 0; i < email.length; i++)
                        encryptedEmail += String.fromCharCode(email.charCodeAt(i)+3)

                    let link = "http://localhost:3000/resetPassword?email=" + encryptedEmail; 

                    var mailOptions = {
                        from: pass.GAccount,
                        to: email,
                        subject: 'Faculty Dashboard - Reset your Password',
                        html: `Hi user!<br><br>Click <a href="` + link +`">here</a> to reset your password.<br>If you did not request a new password, please ignore this email.`
                    }

                    transporter.sendMail(mailOptions, function(err, info){
                        if (err) {
                            console.log("Error occured. Mail not sent");
                            res.send(`Some error occured. Try again by refreshing the page. <br>
                            <a href="/">Refresh</a>`);
                        }
                        else{
                            console.log("Email sent: "+ info.response);
                            res.send("A link to reset your password has been sent to your email address.<br>")
                        }
                    });


                } else {
                    res.send(`Invalid email ID. Please enter correct email ID. <br>
                    <a href="/">Refresh</a>`);
                }
            }
        }
    )
    // res.send("Hi there!");
})

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
});

app.post("/resetPassword", function (req, res) {
    connection.query(
        "UPDATE login SET passwd=? WHERE email=?",
        [req.body.newpasswd, req.session.email],
        function (error, results, fields) {
            if (error) 
                console.log(error);

            res.redirect("/");
        }
    )
});

app.post("/addNewFaculty", function (req, res) {
    let f = req.body;
    connection.query(
        "INSERT INTO faculty(id, name, emailID, DOB, gender, address, phone, deptID, qualification, designation) VALUES(?,?,?,?,?,?,?,?,?,?)",
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
    // console.log(req.body);
    datetime = new Date();
    mdate = datetime.toISOString().slice(0, 10);
    // console.log(mdate);
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

    assessment=colname;
    assessment=ass_to_fullname(assessment);
                    
    connection.query(
        "insert into assessment_list(course_code_full,ass_name,totalmarks) values(?,?,?);",
        [cname, colname, tmarks],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                var msg = encodeURIComponent(
                    "Sorry assessment is already available"
                );
                res.redirect("/mark_grade?addmsg=" + msg+"&assname="+assessment);
            } else {
                tablename = "course_" + cname;
                q =
                    "alter table " +
                    tablename +
                    "_student_academic_info add " +
                    colname +
                    " float default 0.0;";
                console.log("ok");
                connection.query(q, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        var msg = encodeURIComponent(
                            "Sorry assessment is already available"
                        );
                        res.redirect("/mark_grade?addmsg=" + msg+"&assname="+assessment);
                    } else {
                        console.log("ok");
                        var msg = encodeURIComponent("Added successfully");
                        res.redirect("/mark_grade?addmsg=" + msg+"&assname="+assessment);
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
    ass_name=req.body.assignment;
    a=req.body.assignment;;
    ass_name=ass_to_short(ass_name);
    m=req.body.marks;
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tablename="course_"+cname+"_student_academic_info";
    q="update "+tablename+" set "+ass_name+"=? where roll_number=?";
    console.log(q);
                    
    connection.query(
        q,
        [m,roll_number],
        function (error, results, fields) {
            if (error){
                console.log(error);
                res.redirect("/mark_grade?updatemsg=''&assname="+a);
            }
             else {
                console.log("ok");
                var msg = encodeURIComponent("Added successfully");
                res.redirect("/mark_grade?updatemsg=Updated successfully&assname="+a);
            }
        }
    );
});

app.post("/update_CA_weightage", function (req, res) {
    
    console.log("update CA weightage");
    ass_name=req.body.assname;
    ass_name=ass_to_short(ass_name);
    w=req.body.weight;
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    
    q="update assessment_list set weightage=? where course_code_full=? and ass_name=?;";

    console.log(q);
                    
    connection.query(
        q,
        [w,cname,ass_name],
        function (error, results, fields) {
            if (error){
                console.log(error);
                res.redirect("/calculate_CA");
            }
             else {
                console.log("ok");
                var msg = encodeURIComponent("Added successfully");
                res.redirect("/calculate_CA");
            }
        }
    );
});

app.post("/re_calc_CA", function (req, res) {
    
    console.log("re-calculating CA");
    
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    tbname="course_"+cname+"_student_academic_info";
    connection.query(
        "select ass_name,totalmarks,weightage from assessment_list where course_code_full=? and ass_name!='CA';",
        [cname],
        function (error, results, fields) {
            if (error) console.log(error);
            else{

                ass_wt={};
                ca_total=0;
                for(i=0;i<results.length;i++){
                    
                    r=results[i]['ass_name'];
                    t=results[i]['totalmarks'];
                    w=results[i]['weightage'];
                    if(w==0)
                    continue;

                    ass_wt[r]=w/t;
                    ca_total+=w;
                }
                connection.query(
                    "select * from "+tbname+";",
                    function (error, result_mark, fields) {
                        if (error) console.log(error);
                        else {
                            m={};
                            l=result_mark.length;
                            for(i=0;i<result_mark.length;i++){
                    
                                r=result_mark[i]['roll_number'];
                                ca=0;
                                for(var k in ass_wt)
                                {
                                    console.log(k,result_mark[i][k]*ass_wt[k])
                                    ca+=result_mark[i][k]*ass_wt[k];
                                }
                                m[r]=ca.toFixed(2);
                                console.log(r,m[r]);
                            }
                            q="update assessment_list set totalmarks=? where course_code_full=? and ass_name='CA'";

                            connection.query(
                                q,
                                [ca_total,cname],
                                function (error, results, fields) {
                                    if (error){
                                        console.log(error);
                                        
                                    }
                                     else {
                                        console.log("ok");
                                        
                                    }
                                }
                            );
                            console.log(m);
                            q="update "+tbname+" set CA=? where roll_number=?";
                            ct=0;
                            for(var r in m)
                            {
                                ct+=1;
                                connection.query(
                                    q,
                                    [m[r],r],
                                    function (error, results, fields) {
                                        if (error){
                                            console.log(error);
                                            
                                        }
                                         else {
                                            console.log("updateca-ok");
                                            
                                        }
                                    }
                                );
                            }
                            res.redirect("/calculate_CA");
                        } 
                    }
                );
            } 
        }
    );
});

app.post("/changeurl", function (req, res) {
    ftype=req.body.filenum;
    url=req.body.url;
    ccode=req.session.course.course_id;
    colname="";
    if(ftype==1)
        colname="course_details";
    else if(ftype==2)
        colname="course_outcome";
    else if(ftype==3)
        colname="course_eval";
    else if(ftype==4)
        colname="course_syllabus";

    
    q="update course_list set "+colname+"='"+url+"' where course_code='"+ccode+"';"
    console.log(q);
    connection.query(
        q,
        function (error, results, fields) {
            if (error){
                console.log(error);
                res.redirect("/courseinfo");
            }
             else {
                console.log("ok");
                res.redirect("/courseinfo");
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

var server=app.listen(process.env.PORT || 3000, function () {
    console.log("Server started running");
});

module.exports=server;
process.on("SIGINT", function () {
    console.log("\nBreaking connection with DB...");
    connection.end();
    console.log("Closed\n");
    process.exit();
});
