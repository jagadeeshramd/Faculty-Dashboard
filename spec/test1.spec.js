// const { response } = require("express");

Request  = require("request");
fnreq = require("../functionreq.js");
chkvalid = require("../public/js/checkvalid.js");
describe("server",()=>{
    var server;
    beforeAll(() =>{
        server=require("../server.js");
    });
    afterAll(()=>{
        server.close();
    });

    //calculating min max avg
    describe("minmaxavg", function() {

        it("should return min,max,avg", function() {
            let d=[{'total':30},{'total':40},{'total':50},{'total':60},{'total':60}];
            var result = fnreq.mma(d);
            expect(result).toEqual([30,60,48]);
        });

        it("min,max should return the same element", function() {
            let d=[{'total':70}];
            var result = fnreq.mma(d);
            expect(result).toEqual([70,70,70]);
        });

    });

    //checking if the assessment column name to full name conversion is successfull
    describe("convert assessment short form to full form", function() {
        it("Assignments-short form", function() {
            var result = fnreq.ass_to_full("A5");
            expect(result).toEqual("Assignment 5");
        });
        it("Quiz-short form", function() {
            var result = fnreq.ass_to_full("Q30");
            expect(result).toEqual("Quiz 30");
        });
        it("Periodical-short form", function() {
            var result = fnreq.ass_to_full("P3");
            expect(result).toEqual("Periodical 3");
        });
        it("Periodical-short form", function() {
            var result = fnreq.ass_to_full("T14");
            expect(result).toEqual("Tutorial 14");
        });
    });

    //checking if the assessment full name to column name conversion is successfull
    describe("convert assessment short form to full form", function() {
        it("Assignments-full form", function() {
            var result = fnreq.ass_to_short("Assignment 10");
            expect(result).toEqual("A10");
        });
        it("Quiz-short form", function() {
            var result = fnreq.ass_to_short("Quiz 20");
            expect(result).toEqual("Q20");
        });
        it("Periodical-short form", function() {
            var result = fnreq.ass_to_short("Periodical 1");
            expect(result).toEqual("P1");
        });
        it("Periodical-short form", function() {
            var result = fnreq.ass_to_short("Tutorial 8");
            expect(result).toEqual("T8");
        });
    });

    //CA calculation
    describe("CA calculation", function() {
        it("len(marks) == len(assessment weightage)", function() {
            m=[{'roll_number':'18001','A1':10,'A2':20,'A3':15}];
            a={'A1':0.25,'A2':0.1,'A3':0.5};
            var result = fnreq.rc_CA(m,a);
            expect(result).toEqual({18001:'12.00'});
        });

        it("len(marks) > len(assessment weightage)", function() {
            m=[{'roll_number':'18001','A1':10,'A2':20,'A3':15,'A4':6}];
            a={'A1':0.25,'A2':0.1,'A4':0.5};
            var result = fnreq.rc_CA(m,a);
            expect(result).toEqual({18001:'7.50'});
        });

        it("len(marks) < len(assessment weightage)", function() {
            m=[{'roll_number':'18001','A1':10,'A2':20}];
            a={'A1':0.25,'A2':0.1,'A4':0.5};
            var result = fnreq.rc_CA(m,a);
            expect(result).toEqual({18001:'4.50'});
        });
        
    });

    //grade calculation
    describe("grade calc", function() {
        it("grade O", function() {
            m=90;
            c=[10,20,30,40,50,60,70];
            g=['P','C','B','B+','A','A+','O'];
            var result = fnreq.cgrade(m,c,g);
            expect(result).toEqual('O');
        });

        it("grade A+", function() {
            m=60;
            c=[10,20,30,40,50,60,70];
            g=['P','C','B','B+','A','A+','O'];
            var result = fnreq.cgrade(m,c,g);
            expect(result).toEqual('A+');
        });

        it("grade A", function() {
            m=57;
            c=[10,20,30,40,50,60,70];
            g=['P','C','B','B+','A','A+','O'];
            var result = fnreq.cgrade(m,c,g);
            expect(result).toEqual('A');
        });

        it("grade B+", function() {
            m=43;
            c=[10,20,30,40,50,60,70];
            g=['P','C','B','B+','A','A+','O'];
            var result = fnreq.cgrade(m,c,g);
            expect(result).toEqual('B+');
        });

        it("grade B", function() {
            m=38;
            c=[10,20,30,40,50,60,70];
            g=['P','C','B','B+','A','A+','O'];
            var result = fnreq.cgrade(m,c,g);
            expect(result).toEqual('B');
        });

        it("grade C", function() {
            m=21;
            c=[10,20,30,40,50,60,70];
            g=['P','C','B','B+','A','A+','O'];
            var result = fnreq.cgrade(m,c,g);
            expect(result).toEqual('C');
        });

        it("grade P", function() {
            m=19;
            c=[10,20,30,40,50,60,70];
            g=['P','C','B','B+','A','A+','O'];
            var result = fnreq.cgrade(m,c,g);
            expect(result).toEqual('P');
        });

        it("grade F", function() {
            m=8;
            c=[10,20,30,40,50,60,70];
            g=['P','C','B','B+','A','A+','O'];
            var result = fnreq.cgrade(m,c,g);
            expect(result).toEqual('F');
        });
        
    });

    //check cutoff validity
    describe("cutoff validity", function() {
        it("valid1", function() {
            m=[80,70,60,50,40,20,10];
            var result = chkvalid.vcutoff(m);
            expect(result).toEqual(0);
        });

        it("valid2", function() {
            m=[80,70,60,50,40,20,0];
            var result = chkvalid.vcutoff(m);
            expect(result).toEqual(0);
        });

        it("valid3", function() {
            m=[80,70,60,50,0,0,0];
            var result = chkvalid.vcutoff(m);
            expect(result).toEqual(0);
        });

        it("invalid1", function() {
            m=[80,70,60,50,0,10,20];
            var result = chkvalid.vcutoff(m);
            expect(result).toEqual(1);
        });

        it("invalid2", function() {
            m=[80,70,60,50,0,10,-20];
            var result = chkvalid.vcutoff(m);
            expect(result).toEqual(1);
        });

    });
   
    
    //positive case for updatecourse
    describe("GET /",()=>{
        var data={};
        beforeAll((done)=>{
            Request.get("http://localhost:3000/updatecoursetab?course=15CSE313_2018_CSE_A",(error,response,body)=>{
                data.status=response.statusCode;
                data.body=body;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("updatecoursetab",() =>{
            b=data.body;
            b=JSON.parse(b);
            expect(b["status"]).toBe(true);
        });
        
    });

    //negative case for updatecourse
    describe("GET /",()=>{
        var data={};
        beforeAll((done)=>{
            Request.get("http://localhost:3000/updatecoursetab?course=15CSE3132018_CSE_A",(error,response,body)=>{
                data.status=response.statusCode;
                data.body=body;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("updatecoursetab",() =>{
            b=data.body;
            b=JSON.parse(b);
            expect(b["status"]).toBe(false);
        });
        
    });

    //positive testcase for reg_students
    describe("GET /", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/det_student_info?rollno=CB.EN.U4CSE18001", (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("studentdet", () => {
            b = data.body;
            b = JSON.parse(b);
            expect(b["resp"]).toBe(true);
        });

    });

    //negative testcase for reg_students
    describe("GET /", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/det_student_info?rollno=CB.EN.U4CSE18011", (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("studentdet", () => {
            b = data.body;
            b = JSON.parse(b);
            expect(b["resp"]).toBe(false);
        });

    });

    //positive testcase for get_quiz_marks
    describe("GET /",()=>{
        var data={};
        beforeAll((done)=>{
            Request.get("http://localhost:3000/get_quiz_marks?course=15CSE313_2018_CSE_A&rollno=CB.EN.U4CSE18001",(error,response,body)=>{
                data.status=response.statusCode;
                data.body=body;
                done();
            });
        });
        it("quizmark",() =>{
            b=data.body;
            b=JSON.parse(b);
            expect(b["resp"]).toBe(true);
        });
        
    });

    //negative testcase for get_quiz_marks
    describe("GET /",()=>{
        var data={};
        beforeAll((done)=>{
            Request.get("http://localhost:3000/get_quiz_marks?course=15CSE313_2018_CSE_A&rollno=CB.EN.U4CSE18011",(error,response,body)=>{
                data.status=response.statusCode;
                data.body=body;
                done();
            });
        });
        
        it("quizmark",() =>{
            b=data.body;
            b=JSON.parse(b);
            expect(b["resp"]).toBe(false);
        });
        
    });

    //positive testcase for myclass_students
    describe("GET /", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/det_student_detail_info?rollno=CB.EN.U4CSE18001", (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("studentdet", () => {
            b = data.body;
            b = JSON.parse(b);
            expect(b["resp"]).toBe(true);
        });

    });

    //negative testcase for myclass_students
    describe("GET /", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/det_student_detail_info?rollno=CB.EN.U4CSE18011", (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("studentdet", () => {
            b = data.body;
            b = JSON.parse(b);
            expect(b["resp"]).toBe(false);
        });

    });

    // ------------------------
    // Marking notifications
    // Case 1: no error
    describe("Mark notification as read", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/markAsRead/T&12301&1001", (error, response, body) => {
                data.status = response.statusCode;
                done();
            });
        });
        
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        
    });

    // Case 2 : wrong notification id
    describe("Cannot mark notification as read. Wrong notification id.", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/markAsRead/T&12301&2001", (error, response, body) => {
                data.status = response.statusCode;
                done();
            });
        });
        
        it("Status 404", () => {
            expect(data.status).toBe(404);
        });
        
    });

    // Case 3: wrong faculty id
    describe("Cannot mark notification as read. Wrong faculty id.", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/markAsRead/T&11111&1001", (error, response, body) => {
                data.status = response.statusCode;
                done();
            });
        });
        
        it("Status 404", () => {
            expect(data.status).toBe(404);
        });
        
    });

    // testing GET request for the route /tests-and-assignments
    describe("GET /tests-and-assignments", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/tests-and-assignments?test=true&course=15CSE313&faculty=12301", (error, response, body) => {
                data.status = response.statusCode;
                done();
            });
        });
        
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
    });

    // testing GET request for the route /tests/:id
    // Case 1: no error
    describe("GET /tests/102500", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/tests/T&102500&15CSE313&12301", (error, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });
        
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });

        it("Test title", () => {
            expect(data.body.message).toBe('Tutorial 1');
        });
    });

    // Case 2: Invalid test id
    describe("GET /tests/76875", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:3000/tests/T&76875&15CSE313&12301", (error, response, body) => {
                data.status = response.statusCode;
                done();
            });
        });
        
        it("Status 404", () => {
            expect(data.status).toBe(404);
        });
    });

});
