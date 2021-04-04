-- ********************************************************************************************
-- login
-- ********************************************************************************************

use facultydashboard;

create table department(id varchar(5) primary key, name varchar(50), degree varchar(30), HoD_ID varchar(10));

insert into department values ('CSE', 'Computer Science and Engineering', 'B.Tech', '10001'),
								('EEE', 'Electrical and Electronic Engineering', 'B.Tech', '20001'),
                                ('MEC', 'Mechanical Engineering', 'B.Tech', '30001'),
                                ('ECE', 'Electronics and Communication Engineering', 'B.Tech', '40001');

select * from department;

create table faculty(id varchar(10), name varchar(50), emailID varchar(50) UNIQUE, DOB varchar(10), gender varchar(1), 
						address varchar(100), phone varchar(15), deptID varchar(5), qualification varchar(30), designation varchar(30),
                        primary key (id), 
                        foreign key (deptID) references department(id));
                        
insert into faculty values('12301', 'Akhil', 'akhil@gmail.com', '1975-03-01', 'M', 'XYZ street, XYZ.', '9234567890', 'CSE', 'PhD', 'Assistant professor'),
							('12465', 'Senthil', 'senthil@gmail.com', '1973-04-02', 'M', 'ABC street, ABC.', '9234561234', 'EEE', 'PhD', 'Assistant professor'),
                            ('13301', 'Venkat', 'venkat@gmail.com', '1978-11-20', 'M', 'PQR street, PQR.', '9212345890', 'CSE', 'PhD', 'Assistant professor');

select * from faculty;

create table login(email varchar(50) primary key, passwd varchar(30) not null, 
					foreign key (email) references faculty(emailID));

insert into login values('venkat@gmail.com','venkat123');
insert into login values('akhil@gmail.com','akhil123');
insert into login values('senthil@gmail.com','senthil123');

select * from login;
-- drop table login;
-- drop table faculty;
-- drop table department;

-- ********************************************************************************************
-- course-info
-- ********************************************************************************************
create table course_list(course_code varchar(15) primary key,
						 course_name varchar(20), 
                         course_syllabus varchar(100),
                         course_details varchar(100),
                         course_outcome varchar(100),
                         course_eval varchar(100));
insert into course_list values('15CSE301','COA',
							   'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing');

-- drop table course_list; 

create table course_faculty(course_id varchar(50) references course_list(course_code),
						    batch int, 
                            dept varchar(5) references department(id),
                            section char,
                            faculty_id varchar(10) references faculty(id),
                            constraint unique(course_id,batch,dept,section));
insert into course_faculty values('15CSE301',2017,'CSE','A','12301');
insert into course_faculty values('15CSE301',2017,'CSE','B','12465');
insert into course_faculty values('15CSE313',2018,'CSE','A','12301');
insert into course_faculty values('15CSE313',2018,'CSE','B','13301');
-- drop table course_faculty;

select course_id,batch,dept,section from course_faculty where faculty_id='12301';

-- *************************************************************************************************
-- student-info
-- *************************************************************************************************

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

-- *************************************************************************************************
-- assessments
-- *************************************************************************************************

create table assessment_list(course_code_full varchar(50),ass_name varchar(2),totalmarks int,constraint PK primary key(course_code_full,ass_name)); 
insert into assessment_list values('15CSE313_2018_CSE_A','A1',10);
insert into assessment_list values('15CSE313_2018_CSE_A','A2',10);
insert into assessment_list values('15CSE313_2018_CSE_A','A3',10);
insert into assessment_list values('15CSE313_2018_CSE_A','Q1',15);
insert into assessment_list values('15CSE313_2018_CSE_A','Q2',15);
insert into assessment_list values('15CSE313_2018_CSE_A','Q3',15);
insert into assessment_list values('15CSE313_2018_CSE_A','Q4',15);
insert into assessment_list values('15CSE313_2018_CSE_A','P1',50);
insert into assessment_list values('15CSE313_2018_CSE_A','P2',50);
insert into assessment_list values('15CSE313_2018_CSE_A','T1',20);
insert into assessment_list values('15CSE313_2018_CSE_A','T2',20);
-- select * from assessment_list;

create table course_15CSE313_2018_CSE_A_student_academic_info(roll_number varchar(20) primary key references student_18(roll_number),
								   A1 float default 0,A2 float default 0,A3 float default 0,
                                   Q1 float default 0,Q2 float default 0,Q3 float default 0,Q4 float default 0,
                                   P1 float default 0,P2 float default 0,
                                   T1 float default 0,T2 float default 0); 

insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18001',8,9,7,13,12.5,11.25,14,48,47,18,17);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18002',9,7,10,13,12.5,11.25,15,48,45,18,17);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18003',8,9,7,10,12.5,9.25,14,44,47,18,17);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18004',10,9,7,13,12.5,10.25,14,48,47,18,20);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18005',10,10,7,13,13.5,11.25,15,48,47,18,17);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18006',9,9,10,13,14.5,13.25,14,48,49,20,17);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18007',8,9,9,13,12.75,14.25,14,48,47,20,17);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18008',10,9,10,13,12.5,11.25,40,48,47,18,17);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18009',8,9,7,13,14.5,11.25,14,50,47,18,20);
insert into course_15CSE313_2018_CSE_A_student_academic_info values('CB.EN.U4CSE18010',10,9,9,13,12.5,15,14,48,50,20,19);
select * from course_15CSE313_2018_CSE_A_student_academic_info;

select * from course_15CSE313_2018_CSE_A_student_academic_info where roll_number='CB.EN.U4CSE18001';

-- drop table assessment_list;
-- drop table student_academic_info;

-- alter table student_academic_info add t1 float;

-- *************************************************************************************************
-- attendance
-- *************************************************************************************************

create table course_15CSE313_2018_CSE_A_attendance(roll_number varchar(50), att_date date,s_period int,e_period int,classes int);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18001',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18002',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18003',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18004',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18005',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18006',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18007',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18008',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18009',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18010',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);

insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18001',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,0);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18002',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18003',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18004',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18005',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18006',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18007',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18008',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18009',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18010',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,0);

insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18001',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18002',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18003',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18004',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18005',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18006',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18007',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,0);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18008',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18009',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,1);
insert into course_15CSE313_2018_CSE_A_attendance values('CB.EN.U4CSE18010',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);

select roll_number,(sum(classes)/sum(e_period-s_period+1))*100 as percentage from course_15CSE313_2018_CSE_A_attendance group by roll_number having roll_number='CB.EN.U4CSE18001';
-- drop table attendance;

