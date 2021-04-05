const { response } = require("express");

req  = require("request");

describe("server",()=>{
    var server;
    beforeAll(() =>{
        server=require("../server.js");
    });
    afterAll(()=>{
        server.close();
    });
    
    //positive case for updatecourse
    describe("GET /",()=>{
        var data={};
        beforeAll((done)=>{
            req.get("http://localhost:3000/updatecoursetab?course=15CSE313_2018_CSE_A",(error,response,body)=>{
                data.status=response.statusCode;
                data.body=body;
                done();
            });
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
            req.get("http://localhost:3000/updatecoursetab?course=15CSE3132018_CSE_A",(error,response,body)=>{
                data.status=response.statusCode;
                data.body=body;
                done();
            });
        });
        
        it("updatecoursetab",() =>{
            b=data.body;
            b=JSON.parse(b);
            expect(b["status"]).toBe(false);
        });
        
    });

    //positive testcase for get_quiz_marks
    describe("GET /",()=>{
        var data={};
        beforeAll((done)=>{
            req.get("http://localhost:3000/get_quiz_marks?course=15CSE313_2018_CSE_A&rollno=CB.EN.U4CSE18001",(error,response,body)=>{
                data.status=response.statusCode;
                data.body=body;
                done();
            });
        });
        it("Status 200",() =>{
            expect(data.status).toBe(200);
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
            req.get("http://localhost:3000/get_quiz_marks?course=15CSE313_2018_CSE_A&rollno=CB.EN.U4CSE18011",(error,response,body)=>{
                data.status=response.statusCode;
                data.body=body;
                done();
            });
        });
        it("Status 200",() =>{
            expect(data.status).toBe(200);
        });
        it("quizmark",() =>{
            b=data.body;
            b=JSON.parse(b);
            expect(b["resp"]).toBe(false);
        });
        
    });

    //positive case for myclass tab
    describe("GET /", () => {
        var data = {};
        beforeAll((done) => {
            req.get("http://localhost:3000/myclass?facultyid=12301", (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });

        it("myclass", () => {
            b = data.body;
            b = JSON.parse(b);
            console.log(b);
            expect(b["classid"]).not.toEqual('No Class');
        });

    });

    //negative case for myclass
    describe("GET /", () => {
        var data = {};
        beforeAll((done) => {
            req.get("http://localhost:3000/myclass?facultyid=12333", (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });

        it("myclass", () => {
            b = data.body;
            b = JSON.parse(b);
            console.log(b);
            expect(b["classid"]).toEqual('No Class');
        });

    });

}
);
