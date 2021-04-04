use facultydashboard;
show tables;
create table student(roll_number varchar(20) primary key,name varchar(20),gender char,college_mail_id varchar(50) unique, personal_mail_id varchar(50) unique,phone_number bigint unique);
insert into student values('CB.EN.U4CSE18001', 'Aaryan S','M','cb.en.u4cse18001@cb.students.amrita.edu','student1@gmail.com',9888811111);
insert into student values('CB.EN.U4CSE18002', 'Abhay B','M','cb.en.u4cse18002@cb.students.amrita.edu','student2@gmail.com',9876811111);
insert into student values('CB.EN.U4CSE18003', 'Abhinaya S','F','cb.en.u4cse18003@cb.students.amrita.edu','student3@gmail.com',983584411);
insert into student values('CB.EN.U4CSE18004', 'Aisha G','F','cb.en.u4cse18004@cb.students.amrita.edu','student4@gmail.com',9888898979);
insert into student values('CB.EN.U4CSE18005', 'Ajay G','M','cb.en.u4cse18005@cb.students.amrita.edu','student5@gmail.com',9999911111);
insert into student values('CB.EN.U4CSE18006', 'Aadhi R','M','cb.en.u4cse18006@cb.students.amrita.edu','student6@gmail.com',9886782013);
insert into student values('CB.EN.U4CSE18007', 'Bharat S','M','cb.en.u4cse18007@cb.students.amrita.edu','student7@gmail.com',900055555);
insert into student values('CB.EN.U4CSE18008', 'Bharati M','F','cb.en.u4cse18008@cb.students.amrita.edu','student8@gmail.com',9797933311);
insert into student values('CB.EN.U4CSE18009', 'Dhanush S','M','cb.en.u4cse18009@cb.students.amrita.edu','student9@gmail.com',9000000011);
insert into student values('CB.EN.U4CSE18010', 'Divya T','F','cb.en.u4cse18010@cb.students.amrita.edu','student10@gmail.com',9888811455);

insert into student values('CB.EN.U4CSE18101', 'Aaryan S','M','cb.en.u4cse18101@cb.students.amrita.edu','student11@gmail.com',9888811112);
insert into student values('CB.EN.U4CSE18102', 'Abhay B','M','cb.en.u4cse18102@cb.students.amrita.edu','student12@gmail.com',9876811112);
insert into student values('CB.EN.U4CSE18103', 'Abhinaya S','F','cb.en.u4cse18103@cb.students.amrita.edu','student13@gmail.com',983584412);
insert into student values('CB.EN.U4CSE18104', 'Aisha G','F','cb.en.u4cse18104@cb.students.amrita.edu','student14@gmail.com',9888898970);
insert into student values('CB.EN.U4CSE18105', 'Ajay G','M','cb.en.u4cse18105@cb.students.amrita.edu','student15@gmail.com',9999911112);
insert into student values('CB.EN.U4CSE18106', 'Aadhi R','M','cb.en.u4cse18106@cb.students.amrita.edu','student16@gmail.com',9886782012);
insert into student values('CB.EN.U4CSE18107', 'Bharat S','M','cb.en.u4cse18107@cb.students.amrita.edu','student17@gmail.com',900055552);
insert into student values('CB.EN.U4CSE18108', 'Bharati M','F','cb.en.u4cse18108@cb.students.amrita.edu','student18@gmail.com',9797933312);
insert into student values('CB.EN.U4CSE18109', 'Dhanush S','M','cb.en.u4cse18109@cb.students.amrita.edu','student19@gmail.com',9000000012);
insert into student values('CB.EN.U4CSE18110', 'Divya T','F','cb.en.u4cse18110@cb.students.amrita.edu','student110@gmail.com',9888811452);
-- select * from student_2018;


insert into student values('CB.EN.U4CSE17001', 'Adith','M','cb.en.u4cse17001@cb.students.amrita.edu','student71@gmail.com',9888811113);
insert into student values('CB.EN.U4CSE17002', 'Adithi','F','cb.en.u4cse17002@cb.students.amrita.edu','student72@gmail.com',9876811113);
insert into student values('CB.EN.U4CSE17003', 'Adithya','M','cb.en.u4cse17003@cb.students.amrita.edu','student73@gmail.com',983584413);
insert into student values('CB.EN.U4CSE17004', 'Aisha H','F','cb.en.u4cse17004@cb.students.amrita.edu','student74@gmail.com',9888898973);
insert into student values('CB.EN.U4CSE17005', 'Aman G','M','cb.en.u4cse17005@cb.students.amrita.edu','student75@gmail.com',9999911113);
insert into student values('CB.EN.U4CSE17006', 'Aadhi Venkat','M','cb.en.u4cse17006@cb.students.amrita.edu','student76@gmail.com',9886782010);
insert into student values('CB.EN.U4CSE17007', 'Buvan S','M','cb.en.u4cse17007@cb.students.amrita.edu','student77@gmail.com',900055553);
insert into student values('CB.EN.U4CSE17008', 'Cynthia','F','cb.en.u4cse17008@cb.students.amrita.edu','student78@gmail.com',9797933313);
insert into student values('CB.EN.U4CSE17009', 'Dhanush S','M','cb.en.u4cse17009@cb.students.amrita.edu','student79@gmail.com',9000000013);
insert into student values('CB.EN.U4CSE17010', 'Divya T','F','cb.en.u4cse17010@cb.students.amrita.edu','student710@gmail.com',9888811453);

insert into student values('CB.EN.U4CSE17101', 'Adith','M','cb.en.u4cse17101@cb.students.amrita.edu','student721@gmail.com',9888811114);
insert into student values('CB.EN.U4CSE17102', 'Adithi','F','cb.en.u4cse17102@cb.students.amrita.edu','student722@gmail.com',9876811114);
insert into student values('CB.EN.U4CSE17103', 'Adithya','M','cb.en.u4cse17103@cb.students.amrita.edu','student723@gmail.com',983584414);
insert into student values('CB.EN.U4CSE17104', 'Aisha H','F','cb.en.u4cse17104@cb.students.amrita.edu','student724@gmail.com',9888898974);
insert into student values('CB.EN.U4CSE17105', 'Aman G','M','cb.en.u4cse17105@cb.students.amrita.edu','student725@gmail.com',9999911114);
insert into student values('CB.EN.U4CSE17106', 'Aadhi Venkat','M','cb.en.u4cse17106@cb.students.amrita.edu','student726@gmail.com',9886782014);
insert into student values('CB.EN.U4CSE17107', 'Buvan S','M','cb.en.u4cse17107@cb.students.amrita.edu','student727@gmail.com',900055554);
insert into student values('CB.EN.U4CSE17108', 'Cynthia','F','cb.en.u4cse17108@cb.students.amrita.edu','student728@gmail.com',9797933314);
insert into student values('CB.EN.U4CSE17109', 'Dhanush S','M','cb.en.u4cse17109@cb.students.amrita.edu','student729@gmail.com',9000000014);
insert into student values('CB.EN.U4CSE17110', 'Divya T','F','cb.en.u4cse17110@cb.students.amrita.edu','student7210@gmail.com',9888811454);

select * from student where roll_number like '%U4CSE180%';