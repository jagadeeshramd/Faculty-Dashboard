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
        
        it("quizmark",() =>{
            b=data.body;
            b=JSON.parse(b);
            expect(b["resp"]).toBe(false);
        });
        
    });
}
);
