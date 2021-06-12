const express = require("express");
var nodemailer = require('nodemailer');
const mysql = require("mysql");
const https = require("https");
const bodyParser = require("body-parser");
const session = require("express-session");
const { request } = require("http");
const e = require("express");
const { type } = require("os");
const pass = require("./config.js");
const _ = require("lodash");
const fnreq=require("./functionreq.js");
const { connect } = require("http2");
const app = express();

Date.prototype.addDays = function(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}

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

var connection = mysql.createConnection({
    host: "35.193.55.202",
    user: pass.SQLUser,
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

function getGreetingMessage() {
    let date = new Date();
    let hours = date.getHours();
    let msg = "";
    if (hours >= 3 && hours < 11) msg = "Good morning";
    else if (hours >= 11 && hours < 16) msg = "Good afternoon";
    else if (hours >= 16 && hours < 21) msg = "Good evening";
    else msg = "Good night";
    return msg;
}

// GET methods ===================================================================
app.get("/", function (req, res) {
    if (req.session.loggedin) {
        let wel = getGreetingMessage() + ", " + req.session.faculty.name + "!";
        let tl = "https://raw.githubusercontent.com/HarishK501/my-sample/master/faculty-timetables/";
        let tl_file = _.lowerCase(req.session.faculty.name) + ".jpg";

        connection.query(
            "SELECT * FROM notifications WHERE id IN (SELECT n_id FROM faculty_notifications WHERE f_id=? AND isRead=FALSE);",
            [req.session.faculty.id],
            function (err, notifications, fields) {
                if (err) console.log("Error occured while fetching notifications.\n" + err);
                else {
                    connection.query(
                        "select course_id,batch,dept,section,ismentor from course_faculty where faculty_id=? order by batch desc;",
                        [req.session.faculty.id],
                        function (error, result, fields1) {
                            if (error)
                                console.log("Error occured while fetching departments");
                            else {
                                if (result.length >= 1) {
                                    if(req.session.course!=null)
                                        var course_sel =req.session.course.course_id +" " +req.session.course.batch +" " +req.session.course.dept +" " +req.session.course.section;
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
                                        timetable_link: tl + tl_file,
                                        notifications: notifications
                                    });
                                } else {
                                    res.render("home", {
                                        courselen: result.length,
                                        welcomeMessage: wel,
                                        courses: [],
                                        coursesel: "",
                                        faculty: req.session.faculty,
                                        timetable_link: tl + tl_file,
                                        notifications: notifications
                                    });
                                }
                            }
                        }
                    );
                }
            }
        );
    } else {
        res.render("login", {
            message: "",
        });
    }
});

app.get("/announcements-and-circulars", function(req, res) {
    connection.query(
        "SELECT * FROM notifications WHERE id IN (SELECT n_id FROM faculty_notifications WHERE f_id=?);",
        [req.session.faculty.id],
        function(err, results, fields) {
            if (err) console.log(err);
            else {
                res.render("allPosts", {posts: results})
            }
        }
    );
});

app.get("/notifications/:id", function(req, res) {
    var id = req.params.id;
    connection.query(
        "UPDATE faculty_notifications SET isRead=true WHERE f_id=? and n_id=?",
        [req.session.faculty.id, id],
        function(err, results, fields) {
            if (err) console.log(err);
            else {
                connection.query(
                    "SELECT * FROM notifications WHERE id=?",
                    [id],
                    function(err1, results1, fields1) {
                        if (err1) console.log(err1);
                        else {
                            res.render("post", {data: results1[0]})
                        }
                    }
                );
            }
        }
    );
});

app.get("/markAsRead/:id", function(req, res) {
    var id = req.params.id;

    //stub
    var params = null;
    if (id[0] === 'T') {
        var str = id.split("&");
        params = [false, str[1], str[2]];
    } else params = [true, req.session.faculty.id, id];
        
    connection.query(
        "UPDATE faculty_notifications SET isRead=? WHERE f_id=? and n_id=?",
        params, 
        function(err, results, fields) {
            if (err) {
                console.log(err); 
                res.sendStatus(500);
            } 
            else {
                if (results.affectedRows === 0) 
                    res.sendStatus(404);
                else
                    res.sendStatus(200);
            } 
        }
    );
});

app.get("/updatecoursetab", function (req, res) {
   
    
    let s = req.query.course.trim().split("\n");
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
        for(let i=0;i<s.length;i++)
            s[i]=s[i].trim();

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

    // stub
    var params = null;
    if (req.query.test) params = [req.query.course, req.query.faculty];
    else params = [req.session.course.course_id, req.session.faculty.id];

    connection.query(
        "SELECT * FROM tests WHERE course=? and f_id=?",
        params,
        function (err, result1, fields) { 
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            else {
                connection.query(
                    "SELECT * FROM assignments WHERE course=? and f_id=?",
                    params,
                    function (err2, result2, fields2) { 
                        if (err2) {
                            console.error(err2);
                            res.sendStatus(500);
                        }
                        else {
                            if (req.query.test) res.sendStatus(200);
                            else {
                                let msg = req.session.notifyMSG;
                                let color = req.session.msgStatusColor;
                                req.session.notifyMSG = null;
                                req.session.msgStatusColor = null;
                                var active_section = "tests"
                                if (req.session.assignment_last_active) 
                                    active_section = "assignments"
                                res.render("testAssignment", {
                                    tests: result1,
                                    assignments: result2,
                                    notification: msg,
                                    bgcolor: color,
                                    active_section: active_section
                                });
                            }
                        }
                     }
                );
            }
        });
});

app.get("/tests/:id", function(req, res){
    let test_id = req.params.id;

    // stub
    var params = null;
    if (test_id[0] === 'T') {
        var str = test_id.split("&");
        params = [str[2], str[3], parseInt(str[1])/25625];
    } else {
        test_id = parseInt(req.params.id) / 25625;   
        params = [req.session.course.course_id, req.session.faculty.id, test_id];
    }


    connection.query(
        "SELECT * FROM tests WHERE course=? and f_id=? and id=?",
        params,
        function(err, results, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                if (results.length === 0) res.sendStatus(404);
                else {
                    if (req.params.id[0] === "T") {
                        res.status(200).send({"message": results[0].name});
                    } else {
                        res.render("tests", {
                            test: results[0]
                        });
                    }
                }
            }
        }
    );
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
                    let datetime = new Date();
                    let mdate = datetime.toISOString().slice(0, 10);
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
        profile: true
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
    var l = null;
    if (req.query.facultyid != null) {
        l = req.query.facultyid;
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
    let l=req.session.faculty.id;
    let classID = req.session.classID;

    connection.query(
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
    var rno = req.query.rollno;
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
    var ccode=req.session.course.course_id;
    connection.query(
        "select * from course_list where course_code='"+ccode+"';",
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
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
    var l="%U4";
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
    let add_msg=req.query.addmsg;
    
    var dcname=req.session.course.course_id+" ";
    dcname+=req.session.course.batch+" ";
    dcname+=req.session.course.dept+" ";
    dcname+=req.session.course.section;


    let cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    let u="";
    if(req.query.updatemsg!=null)
        u=req.query.updatemsg;
    connection.query(
        "select ass_name from assessment_list where course_code_full= ?;",
        [cname],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length >= 1) {
                let ass_list=[];
                let ass_name=req.query.assname;
                if(ass_name!=null){
                    ass_name=fnreq.ass_to_short(ass_name);
                }
                for(var i in results){
                    let assessment=results[i]['ass_name'];
                    if(ass_name==null)
                        ass_name=assessment;
                    
                    var ans=fnreq.ass_to_full(assessment);
                    ass_list.push(ans);


                }
                
                var current_ass=ass_name;
                current_ass=fnreq.ass_to_full(current_ass);
                    

                var tablename="course_"+cname;
                var q="select roll_number,"+ass_name+" from "+tablename+"_student_academic_info;"
                
                connection.query(
                    q,
                    function (error1, results1, fields1) {
                        if (error1) console.log(error1);
                        else if (results1.length >= 1) {
                            var smark=[];
                            for(i=0;i<results1.length;i++)
                            {
                                smark.push([ results1[i]['roll_number'] , results1[i][ass_name]]);
                            }
                            res.render("mark_grade",{
                                addmsg:add_msg,
                                asslist:ass_list,
                                stud_marks: smark,
                                currass: current_ass,
                                update: u,
                                courseid: dcname,
                                ismentor: req.session.course.ismentor
                            
                            });
                        } 
                        else {
                            res.render("mark_grade",{
                                addmsg:add_msg,
                                asslist:ass_list,
                                stud_marks: [],
                                currass: current_ass,
                                update: u,
                                courseid: dcname,
                                ismentor: req.session.course.ismentor
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
                    courseid: dcname,
                    ismentor: req.session.course.ismentor
                });
            }
        }
    );
});

app.get("/calculate_CA",function(req,res){
    var u=false;
    var uval="";
    if(req.query.update !=null)
        uval=req.query.update;
    if(uval.localeCompare("true")==0)
        u=true;
    console.log(u);
    var dcname=req.session.course.course_id+" ";
    dcname+=req.session.course.batch+" ";
    dcname+=req.session.course.dept+" ";
    dcname+=req.session.course.section;

    var cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;

    var tbname="course_"+cname;
    connection.query(
        "select ass_name,totalmarks,weightage from assessment_list where course_code_full=?;",
        [cname],
        function (error, results, fields) {
            if (error) console.log(error);
            else{

                let ass_wt=[];
                let ca_total=0;
                for(var i of results){
                    if(i['ass_name'].localeCompare("CA")==0)
                    {
                        ca_total=i['totalmarks'];
                        continue;
                    }
                    var r=fnreq.ass_to_full(i['ass_name']);
                    ass_wt.push([r,i['totalmarks'],i['weightage']]);
                }
                connection.query(
                    "select roll_number,CA from "+tbname+"_student_academic_info;",
                    function (error1, result_mark, fields1) {
                        if (error1) console.log(error1);
                        else {
                            
                            res.render("calculate_CA",{
                                courseid:dcname,
                                asswt:ass_wt,
                                camark:result_mark,
                                catotal:ca_total,
                                ismentor: req.session.course.ismentor,
                                update:u
                            });
                        } 
                    }
                );
            } 
        }
    );
   
});

app.get("/calculate_grade",function(req,res){
    var mentor=req.session.course.ismentor;
    var dcname=req.session.course.course_id+" ";
    dcname+=req.session.course.batch+" ";
    dcname+=req.session.course.dept+" ";
    dcname+=req.session.course.section;


    var cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    

    var tbname="course_"+cname+"grade_cutoff";
    connection.query(
        "select * from "+tbname+" order by marks desc;",
        function (error, cutoff, fields) {
            if (error) console.log(error);
            else{
                cname+=req.session.course.dept+"_";
                cname+=req.session.course.section+"_";
                tbname="course_"+cname+"student_academic_info";
                connection.query(
                    "select roll_number,total,grade from "+tbname+" order by roll_number;",
                    function (error1, stud_grades, fields1) {
                        if (error1) console.log(error1);
                        else{
                            res.render("calculate_grade",{
                                grade_cutoff:cutoff,
                                grades:stud_grades,
                                ismentor: mentor,
                                courseid: dcname
                            });
                            
                        } 
                    }
                );
                
            } 
        }
    );

});

app.get("/view_edit_cutoff",function(req,res){
    var mentor=req.session.course.ismentor;
    var dcname=req.session.course.course_id+" ";
    dcname+=req.session.course.batch+" ";
    dcname+=req.session.course.dept+" ";
    dcname+=req.session.course.section;


    var cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    var tbname="course_"+cname+"grade_cutoff";
    connection.query(
        "select * from "+tbname+" order by marks desc;",
        function (error, cutoff, fields) {
            if (error) console.log(error);
            else{
                cname+=req.session.course.dept+"_";
                cname+=req.session.course.section;
                tbname="course_"+cname+"_student_academic_info";
                var q="select total from "+tbname+";"
                connection.query(
                    q,
                    function (error1, totalm, fields1) {
                        if (error1) console.log(error1);
                        else{
                            console.log(totalm);
                            let f=fnreq.mma(totalm);
                            console.log(f);
                            res.render("view_edit_cutoff",{
                                grade_cutoff:cutoff,
                                totalmark:totalm,
                                minmark:f[0],
                                maxmark:f[1],
                                avgmark:f[2],
                                totalstud:totalm.length,
                                ismentor: mentor,
                                courseid: dcname
                            });            
                        } 
                    }
                );
            } 
        }
    );
});

app.get("/filter_data",function(req,res){
    var filtype=req.query.option;
    if(req.query.lb!=null)
        var x=req.query.lb;

    if(req.query.ub!=null)
        var y=req.query.ub;

    var cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    var tbname="course_"+cname+"_student_academic_info";
    var q = null;
    if(filtype==0){
        q="select total from "+tbname+" where total>="+x+";";
    }
    else if(filtype==1){
        q="select total from "+tbname+" where total>"+x+";";
    }
    else if(filtype==2){
        q="select total from "+tbname+" where total<="+y+";";
    }
    else if(filtype==3){
        q="select total from "+tbname+" where total<"+y+";";
    }
    else if(filtype==4){
        q="select total from "+tbname+" where total>="+x+" and total<="+y+";";
    }
    else if(filtype==5){
        q="select total from "+tbname+" where total>="+x+" and total<"+y+";";
    }
    else if(filtype==6){
        q="select total from "+tbname+" where total>"+x+" and total<="+y+";";
    }
    else if(filtype==7){
        q="select total from "+tbname+" where total>"+x+" and total<"+y+";";
    }
    else if(filtype==8){
        q="select total from "+tbname+";";
    }
    console.log(q);
    connection.query(q,function(error,result,fields){
        console.log(result);
        if(result!=null){
        
        var f=fnreq.mma(result);
        res.send({
            comp:true,
            marks:result,
            minmark:f[0],
            maxmark:f[1],
            avgmark:f[2],
            totalstud:result.length
        });
      }
    });
});


app.get("/feedback",function(req,res){
    
    dcname=req.session.course.course_id+" ";
    dcname+=req.session.course.batch+" ";
    dcname+=req.session.course.dept+" ";
    dcname+=req.session.course.section;

    
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;

    var tbname="course_"+cname+"_feedback";
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
    var rno = req.query.rollno;

    connection.query(
        "select * from student where roll_number= ?;",
        [rno],
        function (error, students, fields) {
            if (error) console.log(error);
            else if (students.length == 1) {
                res.send({ resp: true, rec: students[0] });
            } else {
                res.send({resp:false,rec:{}});
            }
        }
    );
});

app.get("/get_quiz_marks", function (req, res) {
    var rno = req.query.rollno;

    if(req.query.course!=null)
        cname=req.query.course;
    else{
        cname=req.session.course.course_id+"_";
        cname+=req.session.course.batch+"_";
        cname+=req.session.course.dept+"_";
        cname+=req.session.course.section;  
    }
    var tablename="course_"+cname;
    var q="select * from "+tablename+"_student_academic_info where roll_number=?;";
    connection.query(
        q,
        [rno],
        function (error, results, fields) {
            
            if (error) console.log(error);
            else if (results.length == 1) {
                let marks={};
                for(let k in results[0]){
                    if(k.startsWith("Q")){
                        let k1=k.slice(1,k.length)
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
    var rno = req.query.rollno;

    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    var tablename="course_"+cname;
    var q="select * from "+tablename+"_student_academic_info where roll_number=?;";
    connection.query(
        q,
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                var marks={};
                for(var k in results[0]){
                    if(k.startsWith("A")){
                        var k1=k.slice(1,k.length);
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
    var rno = req.query.rollno;
    
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    var tablename="course_"+cname;
    
    q="select * from "+tablename+"_student_academic_info where roll_number=?;";
    connection.query(
        q,
        [rno],
        function (error, results, fields) {
            if (error) console.log(error);
            else if (results.length == 1) {
                var marks={};
                for(var k in results[0]){
                    if(k.startsWith("P")){
                        var k1=k.slice(1,k.length);
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
    var tablename="course_"+cname;
    let d=req.query.attdate;
    let s=req.query.speriod;
    let ep=req.query.eperiod;
    let u="";
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
                var success = true;
                for(var i of results)
                {
                    i['att_date']=d;
                }
                res.render("attendance", {
                    status: success,
                    attlist: results,
                    isstatic:true,
                    addmsg:"",
                    update:u
                });
            } 
            else 
            {
                success = false;
                q= "select distinct roll_number from "+tablename+"_attendance;"
                connection.query(
                    q,
                    function (error1, results1, fields1) {
                        if (error1) console.log(error1);
                        else if (results1.length > 0) {
                            success = true;
                            let att=[];
                            for(i=0;i<results1.length;i++)
                            {
                                var o={};
                                o['roll_number']=results1[i]['roll_number'];
                                o['att_date']=d;
                                o['s_period']=s;
                                o['e_period']=ep;
                                o['classes']=0;
                                att.push(o);
                                q="insert into "+tablename+"_attendance values(?,?,?,?,?);";
                                connection.query(q,
                                        [o['roll_number'],d,s,ep,0],
                                        function (error2, resultinsert, fields2) {
                                                        if (error2){
                                                            console.log(error2);
                                                            success = false;
                                                            res.render("attendance", {
                                                                status: true,
                                                                attlist: [],
                                                                isstatic:true,
                                                                addmsg:"",
                                                                update:u
                                                            });
                                                        }
                                                        else {
                                                            console.log(i);
                                                            console.log("ok");
                                                            
                                                        }
                                                    }
                                                );
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
    
    var rno = req.query.rollno;

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

app.get("/setTestsActive", function(req, res){
    req.session.assignment_last_active = false;
    res.send("200");
});

app.get("/leave-management", (req, res) => {
    connection.query(
        "select * from leave_records where f_id=? order by id desc;",
        [req.session.faculty.id],
        (error, records, fields) => {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                connection.query(
                    "select * from faculty_leaves where f_id=?;",
                    [req.session.faculty.id],
                    (err, leaves, fields1) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            res.render("leave_management", {
                                records: records,
                                leaves: leaves[0]
                            });
                        }
                    }
                );
            }
        }
    );
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
                    
                    req.session.loggedin = true;
                    req.session.email = email;
                    connection.query(
                        "select * from faculty where emailID = ?",
                        [email],
                        function (err, rows, fields1) {
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
                    function (err, rows, fields1) {
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
                    function (err1, result1, fields1) {
                        if (err1) console.log(err1);
                    }
                );
            }
            res.redirect("/admin");
        }
    );
});

app.post("/addNewTest", function(req, res){

    req.session.assignment_last_active = false;
    connection.query(
        "INSERT INTO tests(name, date,time, instructions, course, f_id) VALUES(?,?,?,?,?,?)",
        [req.body.name, req.body.date, req.body.time, req.body.instructions, req.session.course.course_id, req.session.faculty.id],
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

app.post("/tests/editTest/:id", function(req, res) {
    let test_id = parseInt(req.params.id);
    connection.query(
        "UPDATE tests SET name=?, date=?, time=?, instructions=? WHERE course=? and f_id=? and id=?",
        [req.body.name, req.body.date, req.body.time, req.body.instructions, req.session.course.course_id, req.session.faculty.id, test_id],
        function (err, results, fields) { 
            if (err) {
                req.session.notifyMSG = "Error occured.";
                req.session.msgStatusColor = "bg-danger";
            } else {
                req.session.notifyMSG = "Editted test successfully!";
                req.session.msgStatusColor = "bg-success";
            }
            res.redirect("/tests-and-assignments");
        }
    );
});

app.post("/tests/cancelTest/:id", function(req, res){
    let test_id = parseInt(req.params.id);
    connection.query(
        "DELETE FROM tests WHERE course=? and f_id=? and id=?",
        [req.session.course.course_id, req.session.faculty.id, test_id],
        function (err, results, fields) { 
            if (err) {
                req.session.notifyMSG = "Error occured.";
                req.session.msgStatusColor = "bg-danger";
            } else {
                req.session.notifyMSG = "Cancelled test successfully!";
                req.session.msgStatusColor = "bg-success";
            }
            res.redirect("/tests-and-assignments");
        }
    );
});


app.post("/addNewAssignment", function(req, res){

    req.session.assignment_last_active = true;
    connection.query(
        "INSERT INTO assignments(name, date,time, instructions, course, f_id) VALUES(?,?,?,?,?,?)",
        [req.body.name, req.body.date, req.body.time, req.body.instructions, req.session.course.course_id, req.session.faculty.id],
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

    let datetime = new Date();
    let mdate = datetime.toISOString().slice(0, 10);

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

    var ttype = req.body.testtype;
    var tnum = req.body.testnum;
    var tmarks = req.body.testmark;
    var colname = ttype[0] + tnum;
    var cname = req.session.course.course_id + "_";
    cname += req.session.course.batch + "_";
    cname += req.session.course.dept + "_";
    cname += req.session.course.section;

    var assessment=colname;
    assessment=fnreq.ass_to_full(assessment);
                    
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
                connection.query(q, function (error1, results1, fields1) {
                    if (error1) {
                        console.log(error1);
                        msg = encodeURIComponent(
                            "Sorry assessment is already available"
                        );
                        res.redirect("/mark_grade?addmsg=" + msg+"&assname="+assessment);
                    } else {
                        console.log("ok");
                        var msg1 = encodeURIComponent("Added successfully");
                        res.redirect("/mark_grade?addmsg=" + msg1+"&assname="+assessment);
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
    var roll_number=req.body.roll_number;
    console.log("update marks");
    var ass_name=req.body.assignment;
    var a=req.body.assignment;
    ass_name=fnreq.ass_to_short(ass_name);
    var m=req.body.marks;
    var cname=req.session.course.course_id+"_";
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
                res.redirect("/mark_grade?updatemsg=Updated successfully&assname="+a);
            }
        }
    );
});

app.post("/update_CA_weightage", function (req, res) {
    
    var ass_name=req.body.assname;
    ass_name=fnreq.ass_to_short(ass_name);
    var w=req.body.weight;
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    cname+=req.session.course.dept+"_";
    cname+=req.session.course.section;
    
    q="update assessment_list set weightage=? where course_code_full=? and ass_name=?;";

    
                    
    connection.query(
        q,
        [w,cname,ass_name],
        function (error, results, fields) {
            if (error){
                console.log(error);
                res.redirect("/calculate_CA?update=true");
            }
             else {
                console.log("ok");
                res.redirect("/calculate_CA?update=true");
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

                var ass_wt={};
                var ca_total=0;
                for(var i of results){
                    
                    let r=i['ass_name'];
                    let t=i['totalmarks'];
                    let w=i['weightage'];
                    if(w==0)
                        continue;

                    ass_wt[r]=w/t;
                    ca_total+=w;
                }
                connection.query(
                    "select * from "+tbname+";",
                    function (error1, result_mark, fields1) {
                        if (error1) console.log(error1);
                        else {

                            var m=fnreq.rc_CA(result_mark,ass_wt);
                            
                            var q="update assessment_list set totalmarks=? where course_code_full=? and ass_name='CA'";

                            connection.query(
                                q,
                                [ca_total,cname],
                                function (errorx, resultsx, fieldsx) {
                                    if (errorx){
                                        console.log(errorx);
                                        
                                    }
                                     else {
                                        console.log("ok");
                                        
                                    }
                                }
                            );
                            console.log(m);
                            q="update "+tbname+" set CA=? where roll_number=?";
                            let ct=0;
                            for(var r in m)
                            {
                                ct+=1;
                                connection.query(
                                    q,
                                    [m[r],r],
                                    function (error2, results2, fields2) {
                                        if (error2){
                                            console.log(error2);
                                            
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
    var ftype=req.body.filenum;
    var url=req.body.url;
    var ccode=req.session.course.course_id;
    var colname="";
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
    console.log("update att");
    let r=req.body.roll_number;
    let d=req.body.attdate;
    let s=req.body.speriod;
    let ep=req.body.eperiod;
    let c=req.body.classes;
    var cname=req.session.course.course_id+"_";
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
                    function (error1, results1, fields1) {
                        if (error1){
                            console.log(error1);
                            res.redirect("/get_attendance_list?updatemsg=error&attdate="+d+"&speriod="+s+"&eperiod="+ep);
                        }
                         else {
                            console.log("ok");
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
                    function (error2, results2, fields2) {
                        if (error2){
                            console.log(error2);
                            res.redirect("/get_attendance_list?updatemsg=error&attdate="+d+"&speriod="+s+"&eperiod="+ep);
                        }
                         else {
                            console.log("ok");
                            res.redirect("/get_attendance_list?updatemsg=Updated successfully&attdate="+d+"&speriod="+s+"&eperiod="+ep);
                        }
                    }
                );
            }
        }
    );
});

app.post("/changecutoff",function(req,res){
    var mark=req.body.mark;
    var grades=['O','A+','A','B+','B','C','P'];
    
    

    if(mark.length==grades.length){

        for(i=0;i<mark.length;i++){

           
            cname=req.session.course.course_id+"_";
            cname+=req.session.course.batch+"_";
            tbname="course_"+cname+"grade_cutoff";
            q="update "+tbname+" set marks="+mark[i]+" where grade='"+grades[i]+"';";
            connection.query(
                q,
                function (error, results, fields) {
                    if (error){
                        console.log(error);
                    }
                }
            );

        }
        res.send({res:true});
    }
});

app.post("/re_calc_grade",function(req,res){
    cname=req.session.course.course_id+"_";
    cname+=req.session.course.batch+"_";
    tbname="course_"+cname+"grade_cutoff";
    q="select * from "+tbname+" order by marks;";
    connection.query(
        q,
        function (error, results, fields) {
            if (error){
                console.log(error);
            }
            else {
                let g=[];
                let marklist=[];
                for(i=0;i<results.length;i++)
                {
                    g.push(results[i]['grade']);
                    marklist.push(results[i]['marks']);
                }
                cname=req.session.course.course_id+"_";
                cname+=req.session.course.batch+"_";
                cname+=req.session.course.dept+"_";
                cname+=req.session.course.section+"_";
                tbname="course_"+cname+"student_academic_info";
                q="select roll_number,total,grade from "+tbname+";";
                connection.query(
                    q,
                    function (error1, rollno, fields1) {
                        if (error1){
                            console.log(error1);
                        }
                        else {
                            
                            for(i=0;i<rollno.length;i++)
                            {
                                console.log(marklist);
                                let j=fnreq.cgrade(rollno[i]['total'],marklist,g);
                                if(j!=rollno[i]['grade'])
                                {
                                    q="update "+tbname+" set grade='"+j+"' where roll_number='"+rollno[i]['roll_number']+"';";
                                    connection.query(
                                        q,
                                        function (error2, rollno2, fields2) {
                                            if (error2){
                                                console.log(error2);
                                            }
                                        }
                                    );
                                }
                            }
                            
                        }
                    }
                );
            }
        }
    );

      res.send({res:true});  
      
});

app.post("/applyLeave", (req, res) => {
    var days = parseInt(req.body.days) - 1;
    var startDate = new Date(req.body.startDate);
    var endDate = startDate.addDays(startDate, days);
    var dd = endDate.getDate();
    var mm = endDate.getMonth()+1; 
    var yyyy = endDate.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    } 
    if(mm<10){
        mm = '0' + mm
    } 

    endDate = yyyy+'-'+mm+'-'+dd;

    connection.query(
        "insert into leave_records(f_id, type, start_date, end_date, reason, status) values(?, ?, ?, ?, ?, 'Applied');",
        [req.session.faculty.id, req.body.type, req.body.startDate, endDate, req.body.reason],
        (err, results, fields) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.redirect("/leave-management");
            }
        }
    );
});

var server = app.listen(process.env.PORT || 3000, function () {
    console.log("Server started running");
});

module.exports=server;
process.on("SIGINT", function () {
    console.log("\nBreaking connection with DB...");
    connection.end();
    console.log("Closed\n");
    process.exit();
});
