
-- ********************************************************************************************
-- login
-- ********************************************************************************************
DROP DATABASE IF EXISTS facultydashboard;
CREATE DATABASE facultydashboard;
USE facultydashboard;

CREATE TABLE department(id VARCHAR(5) PRIMARY KEY, name VARCHAR(50), degree VARCHAR(30), HoD_ID VARCHAR(10));

INSERT INTO department VALUES ('CSE', 'Computer Science and Engineering', 'B.Tech', '10001'),
								('EEE', 'Electrical and Electronic Engineering', 'B.Tech', '20001'),
                                ('MEC', 'Mechanical Engineering', 'B.Tech', '30001'),
                                ('ECE', 'Electronics and Communication Engineering', 'B.Tech', '40001');

SELECT * FROM department;

CREATE TABLE faculty(id VARCHAR(10), name VARCHAR(50), emailID VARCHAR(50) UNIQUE, DOB VARCHAR(10), gender VARCHAR(1),
address VARCHAR(100), phone VARCHAR(15), deptID VARCHAR(5), qualification VARCHAR(30), designation VARCHAR(30), isAdvisor BOOLEAN, isBC BOOLEAN, isHOD BOOLEAN,
PRIMARY KEY (id),
FOREIGN KEY (deptID) REFERENCES department(id));

INSERT INTO faculty VALUES('12301', 'Akhil', 'akhil@gmail.com', '1975-03-01', 'M', 'XYZ street, XYZ.', '9234567890', 'CSE', 'PhD', 'Assistant professor',TRUE,FALSE,FALSE),
('12465', 'Senthil', 'senthil@gmail.com', '1973-04-02', 'M', 'ABC street, ABC.', '9234561234', 'EEE', 'PhD', 'Assistant professor',FALSE,TRUE,FALSE),
('13301', 'Venkat', 'venkat@gmail.com', '1978-11-20', 'M', 'PQR street, PQR.', '9212345890', 'CSE', 'PhD', 'Assistant professor',TRUE,FALSE,FALSE);
INSERT INTO faculty VALUES('14312', 'Gowtham', 'Gowtham@gmail.com', '1970-04-16', 'M', 'ZTQ street, UIZ.', '9344678456', 'CSE', 'PhD', 'Assistant professor',TRUE,FALSE,FALSE);
INSERT INTO faculty VALUES('18501', 'Harish', 'harishcse18501@gmail.com', '2000-09-22', 'M', 'NSN street, CBE.', '9677340574', 'CSE', 'PhD', 'Assistant professor',TRUE,FALSE,FALSE);


SELECT * FROM faculty;

CREATE TABLE login(email VARCHAR(50) PRIMARY KEY, passwd VARCHAR(30) NOT NULL, 
					FOREIGN KEY (email) REFERENCES faculty(emailID));

INSERT INTO login VALUES('venkat@gmail.com','venkat123');
INSERT INTO login VALUES('akhil@gmail.com','akhil123');
INSERT INTO login VALUES('senthil@gmail.com','senthil123');
INSERT INTO login VALUES('Gowtham@gmail.com','gowtham123');
INSERT INTO login VALUES('harishcse18501@gmail.com', 'harry123');

SELECT * FROM login;
-- drop table login;
-- drop table faculty;
-- drop table department;

-- ********************************************************************************************
-- course-info
-- ********************************************************************************************
CREATE TABLE course_list(course_code VARCHAR(15) PRIMARY KEY,
						 course_name VARCHAR(20), 
                         course_syllabus VARCHAR(1000),
                         course_details VARCHAR(1000),
                         course_outcome VARCHAR(1000),
                         course_eval VARCHAR(1000));
INSERT INTO course_list VALUES('15CSE301','COA',
							   'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing');
INSERT INTO course_list VALUES('15CSE313','SE',
							   'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing');

SELECT * FROM course_list;

CREATE TABLE course_faculty(course_id VARCHAR(50) REFERENCES course_list(course_code),
						    batch INT, 
                            dept VARCHAR(5) REFERENCES department(id),
                            section CHAR,
                            faculty_id VARCHAR(10) REFERENCES faculty(id),
                            CONSTRAINT UNIQUE(course_id,batch,dept,section));
INSERT INTO course_faculty VALUES('15CSE301',2017,'CSE','A','12301');
INSERT INTO course_faculty VALUES('15CSE301',2017,'CSE','B','12465');
INSERT INTO course_faculty VALUES('15CSE313',2018,'CSE','A','12301');
INSERT INTO course_faculty VALUES('15CSE313',2018,'CSE','B','13301');
INSERT INTO course_faculty VALUES('15CSE312',2018,'CSE','B','14312');

ALTER TABLE course_faculty ADD ismentor BOOLEAN DEFAULT FALSE;
UPDATE course_faculty SET ismentor=TRUE WHERE faculty_id='12301';
SELECT course_id,batch,dept,section,ismentor FROM course_faculty WHERE faculty_id='12301';

-- *************************************************************************************************
-- student-info
-- *************************************************************************************************

CREATE TABLE student(roll_number VARCHAR(20) PRIMARY KEY,name VARCHAR(20),gender CHAR,college_mail_id VARCHAR(50) UNIQUE, personal_mail_id VARCHAR(50) UNIQUE,phone_number BIGINT UNIQUE);
INSERT INTO student VALUES('CB.EN.U4CSE18001', 'Aaryan S','M','cb.en.u4cse18001@cb.students.amrita.edu','student1@gmail.com',9888811111);
INSERT INTO student VALUES('CB.EN.U4CSE18002', 'Abhay B','M','cb.en.u4cse18002@cb.students.amrita.edu','student2@gmail.com',9876811111);
INSERT INTO student VALUES('CB.EN.U4CSE18003', 'Abhinaya S','F','cb.en.u4cse18003@cb.students.amrita.edu','student3@gmail.com',983584411);
INSERT INTO student VALUES('CB.EN.U4CSE18004', 'Aisha G','F','cb.en.u4cse18004@cb.students.amrita.edu','student4@gmail.com',9888898979);
INSERT INTO student VALUES('CB.EN.U4CSE18005', 'Ajay G','M','cb.en.u4cse18005@cb.students.amrita.edu','student5@gmail.com',9999911111);
INSERT INTO student VALUES('CB.EN.U4CSE18006', 'Aadhi R','M','cb.en.u4cse18006@cb.students.amrita.edu','student6@gmail.com',9886782013);
INSERT INTO student VALUES('CB.EN.U4CSE18007', 'Bharat S','M','cb.en.u4cse18007@cb.students.amrita.edu','student7@gmail.com',900055555);
INSERT INTO student VALUES('CB.EN.U4CSE18008', 'Bharati M','F','cb.en.u4cse18008@cb.students.amrita.edu','student8@gmail.com',9797933311);
INSERT INTO student VALUES('CB.EN.U4CSE18009', 'Dhanush S','M','cb.en.u4cse18009@cb.students.amrita.edu','student9@gmail.com',9000000011);
INSERT INTO student VALUES('CB.EN.U4CSE18010', 'Divya T','F','cb.en.u4cse18010@cb.students.amrita.edu','student10@gmail.com',9888811455);

INSERT INTO student VALUES('CB.EN.U4CSE18101', 'Aaryan S','M','cb.en.u4cse18101@cb.students.amrita.edu','student11@gmail.com',9888811112);
INSERT INTO student VALUES('CB.EN.U4CSE18102', 'Abhay B','M','cb.en.u4cse18102@cb.students.amrita.edu','student12@gmail.com',9876811112);
INSERT INTO student VALUES('CB.EN.U4CSE18103', 'Abhinaya S','F','cb.en.u4cse18103@cb.students.amrita.edu','student13@gmail.com',983584412);
INSERT INTO student VALUES('CB.EN.U4CSE18104', 'Aisha G','F','cb.en.u4cse18104@cb.students.amrita.edu','student14@gmail.com',9888898970);
INSERT INTO student VALUES('CB.EN.U4CSE18105', 'Ajay G','M','cb.en.u4cse18105@cb.students.amrita.edu','student15@gmail.com',9999911112);
INSERT INTO student VALUES('CB.EN.U4CSE18106', 'Aadhi R','M','cb.en.u4cse18106@cb.students.amrita.edu','student16@gmail.com',9886782012);
INSERT INTO student VALUES('CB.EN.U4CSE18107', 'Bharat S','M','cb.en.u4cse18107@cb.students.amrita.edu','student17@gmail.com',900055552);
INSERT INTO student VALUES('CB.EN.U4CSE18108', 'Bharati M','F','cb.en.u4cse18108@cb.students.amrita.edu','student18@gmail.com',9797933312);
INSERT INTO student VALUES('CB.EN.U4CSE18109', 'Dhanush S','M','cb.en.u4cse18109@cb.students.amrita.edu','student19@gmail.com',9000000012);
INSERT INTO student VALUES('CB.EN.U4CSE18110', 'Divya T','F','cb.en.u4cse18110@cb.students.amrita.edu','student110@gmail.com',9888811452);
-- select * from student_2018;


INSERT INTO student VALUES('CB.EN.U4CSE17001', 'Adith','M','cb.en.u4cse17001@cb.students.amrita.edu','student71@gmail.com',9888811113);
INSERT INTO student VALUES('CB.EN.U4CSE17002', 'Adithi','F','cb.en.u4cse17002@cb.students.amrita.edu','student72@gmail.com',9876811113);
INSERT INTO student VALUES('CB.EN.U4CSE17003', 'Adithya','M','cb.en.u4cse17003@cb.students.amrita.edu','student73@gmail.com',983584413);
INSERT INTO student VALUES('CB.EN.U4CSE17004', 'Aisha H','F','cb.en.u4cse17004@cb.students.amrita.edu','student74@gmail.com',9888898973);
INSERT INTO student VALUES('CB.EN.U4CSE17005', 'Aman G','M','cb.en.u4cse17005@cb.students.amrita.edu','student75@gmail.com',9999911113);
INSERT INTO student VALUES('CB.EN.U4CSE17006', 'Aadhi Venkat','M','cb.en.u4cse17006@cb.students.amrita.edu','student76@gmail.com',9886782010);
INSERT INTO student VALUES('CB.EN.U4CSE17007', 'Buvan S','M','cb.en.u4cse17007@cb.students.amrita.edu','student77@gmail.com',900055553);
INSERT INTO student VALUES('CB.EN.U4CSE17008', 'Cynthia','F','cb.en.u4cse17008@cb.students.amrita.edu','student78@gmail.com',9797933313);
INSERT INTO student VALUES('CB.EN.U4CSE17009', 'Dhanush S','M','cb.en.u4cse17009@cb.students.amrita.edu','student79@gmail.com',9000000013);
INSERT INTO student VALUES('CB.EN.U4CSE17010', 'Divya T','F','cb.en.u4cse17010@cb.students.amrita.edu','student710@gmail.com',9888811453);

INSERT INTO student VALUES('CB.EN.U4CSE17101', 'Adith','M','cb.en.u4cse17101@cb.students.amrita.edu','student721@gmail.com',9888811114);
INSERT INTO student VALUES('CB.EN.U4CSE17102', 'Adithi','F','cb.en.u4cse17102@cb.students.amrita.edu','student722@gmail.com',9876811114);
INSERT INTO student VALUES('CB.EN.U4CSE17103', 'Adithya','M','cb.en.u4cse17103@cb.students.amrita.edu','student723@gmail.com',983584414);
INSERT INTO student VALUES('CB.EN.U4CSE17104', 'Aisha H','F','cb.en.u4cse17104@cb.students.amrita.edu','student724@gmail.com',9888898974);
INSERT INTO student VALUES('CB.EN.U4CSE17105', 'Aman G','M','cb.en.u4cse17105@cb.students.amrita.edu','student725@gmail.com',9999911114);
INSERT INTO student VALUES('CB.EN.U4CSE17106', 'Aadhi Venkat','M','cb.en.u4cse17106@cb.students.amrita.edu','student726@gmail.com',9886782014);
INSERT INTO student VALUES('CB.EN.U4CSE17107', 'Buvan S','M','cb.en.u4cse17107@cb.students.amrita.edu','student727@gmail.com',900055554);
INSERT INTO student VALUES('CB.EN.U4CSE17108', 'Cynthia','F','cb.en.u4cse17108@cb.students.amrita.edu','student728@gmail.com',9797933314);
INSERT INTO student VALUES('CB.EN.U4CSE17109', 'Dhanush S','M','cb.en.u4cse17109@cb.students.amrita.edu','student729@gmail.com',9000000014);
INSERT INTO student VALUES('CB.EN.U4CSE17110', 'Divya T','F','cb.en.u4cse17110@cb.students.amrita.edu','student7210@gmail.com',9888811454);

SELECT * FROM student WHERE roll_number LIKE '%U4CSE180%';

-- *************************************************************************************************
-- assessments
-- *************************************************************************************************

CREATE TABLE assessment_list(course_code_full VARCHAR(50),ass_name VARCHAR(2),totalmarks INT,CONSTRAINT PK PRIMARY KEY(course_code_full,ass_name)); 
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','A1',10);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','A2',10);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','A3',10);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','Q1',15);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','Q2',15);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','Q3',15);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','Q4',15);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','P1',50);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','P2',50);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','T1',20);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','T2',20);
INSERT INTO assessment_list VALUES('15CSE313_2018_CSE_A','CA',0);
ALTER TABLE assessment_list ADD COLUMN weightage INT DEFAULT 0;

CREATE TABLE course_15CSE313_2018_CSE_A_student_academic_info(roll_number VARCHAR(20) PRIMARY KEY REFERENCES student(roll_number),
								   A1 FLOAT DEFAULT 0,A2 FLOAT DEFAULT 0,A3 FLOAT DEFAULT 0,
                                   Q1 FLOAT DEFAULT 0,Q2 FLOAT DEFAULT 0,Q3 FLOAT DEFAULT 0,Q4 FLOAT DEFAULT 0,
                                   P1 FLOAT DEFAULT 0,P2 FLOAT DEFAULT 0,
                                   T1 FLOAT DEFAULT 0,T2 FLOAT DEFAULT 0); 

INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18001',8,9,7,13,12.5,11.25,14,48,47,18,17);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18002',9,7,10,13,12.5,11.25,15,48,45,18,17);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18003',8,9,7,10,12.5,9.25,14,44,47,18,17);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18004',10,9,7,13,12.5,10.25,14,48,47,18,20);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18005',10,10,7,13,13.5,11.25,15,48,47,18,17);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18006',9,9,10,13,14.5,13.25,14,48,49,20,17);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18007',8,9,9,13,12.75,14.25,14,48,47,20,17);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18008',10,9,10,13,12.5,11.25,13,48,47,18,17);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18009',8,9,7,13,14.5,11.25,14,50,47,18,20);
INSERT INTO course_15CSE313_2018_CSE_A_student_academic_info VALUES('CB.EN.U4CSE18010',10,9,9,13,12.5,15,14,48,50,20,19);
ALTER TABLE course_15CSE313_2018_CSE_A_student_academic_info ADD COLUMN CA INT DEFAULT 0;

ALTER TABLE course_15CSE313_2018_CSE_A_student_academic_info ADD COLUMN endsem INT DEFAULT 0;
ALTER TABLE course_15CSE313_2018_CSE_A_student_academic_info ADD COLUMN total INT DEFAULT 0;
ALTER TABLE course_15CSE313_2018_CSE_A_student_academic_info ADD COLUMN grade VARCHAR(2) DEFAULT NULL REFERENCES course_15CSE313_2018_grade_cutoff(grade);

SELECT * FROM course_15CSE313_2018_CSE_A_student_academic_info;

DELIMITER $$
CREATE TRIGGER update_total BEFORE UPDATE ON course_15CSE313_2018_CSE_A_student_academic_info 
FOR EACH ROW 
BEGIN
   IF NEW.endsem <> OLD.endsem THEN
      SET NEW.total=NEW.endsem+OLD.CA;
   ELSEIF NEW.ca <> OLD.ca THEN
      SET NEW.total=OLD.endsem+NEW.CA;
   END IF;
END$$
DELIMITER ;
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=35 WHERE roll_number='CB.EN.U4CSE18001';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=50 WHERE roll_number='CB.EN.U4CSE18002';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=40 WHERE roll_number='CB.EN.U4CSE18003';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=43 WHERE roll_number='CB.EN.U4CSE18004';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=46 WHERE roll_number='CB.EN.U4CSE18005';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=48 WHERE roll_number='CB.EN.U4CSE18006';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=41 WHERE roll_number='CB.EN.U4CSE18007';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=42 WHERE roll_number='CB.EN.U4CSE18008';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=49 WHERE roll_number='CB.EN.U4CSE18009';
UPDATE course_15CSE313_2018_CSE_A_student_academic_info SET endsem=47 WHERE roll_number='CB.EN.U4CSE18010';

CREATE TABLE course_15CSE313_2018_grade_cutoff(grade VARCHAR(2) PRIMARY KEY,marks INT DEFAULT NULL);
INSERT INTO course_15CSE313_2018_grade_cutoff VALUES('O',90);
INSERT INTO course_15CSE313_2018_grade_cutoff VALUES('A+',80);
INSERT INTO course_15CSE313_2018_grade_cutoff VALUES('A',70);
INSERT INTO course_15CSE313_2018_grade_cutoff VALUES('B+',60);
INSERT INTO course_15CSE313_2018_grade_cutoff VALUES('B',50);
INSERT INTO course_15CSE313_2018_grade_cutoff VALUES('C',40);
INSERT INTO course_15CSE313_2018_grade_cutoff VALUES('P',30);


SELECT * FROM course_15CSE313_2018_grade_cutoff ORDER BY marks DESC;

-- *************************************************************************************************
-- attendance
-- *************************************************************************************************

CREATE TABLE course_15CSE313_2018_CSE_A_attendance(roll_number VARCHAR(50), att_date DATE,s_period INT,e_period INT,classes INT);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18001',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18002',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18003',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18004',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18005',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18006',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18007',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18008',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18009',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18010',STR_TO_DATE('04-01-2021', '%m-%d-%Y'),1,1,0);

INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18001',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,0);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18002',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18003',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18004',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18005',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18006',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18007',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18008',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18009',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18010',STR_TO_DATE('04-02-2021', '%m-%d-%Y'),1,1,0);

INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18001',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18002',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18003',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18004',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18005',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18006',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18007',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,0);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18008',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18009',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,1);
INSERT INTO course_15CSE313_2018_CSE_A_attendance VALUES('CB.EN.U4CSE18010',STR_TO_DATE('04-03-2021', '%m-%d-%Y'),1,2,2);

SELECT roll_number,(SUM(classes)/SUM(e_period-s_period+1))*100 AS percentage FROM course_15CSE313_2018_CSE_A_attendance GROUP BY roll_number HAVING roll_number='CB.EN.U4CSE18001';
-- drop table attendance;

-- *************************************************************************************************
-- student_advisor_info
-- *************************************************************************************************

CREATE TABLE student_det(roll_number VARCHAR(20) PRIMARY KEY,  name VARCHAR(20), gender CHAR, college_mail_id VARCHAR(50) UNIQUE, personal_mail_id VARCHAR(50) UNIQUE, phone_number BIGINT UNIQUE, hostel VARCHAR(20), room_number VARCHAR(5), nationality VARCHAR(20),  mother_tongue VARCHAR(20), communication_address VARCHAR(100), permanent_address VARCHAR(100), dob VARCHAR(20), blood_group VARCHAR(5), advisor_id VARCHAR(10) REFERENCES faculty(id), enrolment_number INT UNSIGNED NOT NULL AUTO_INCREMENT, UNIQUE KEY (enrolment_number));
ALTER TABLE student_det AUTO_INCREMENT = 10000000;

INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18001', 'Aaryan S','M','cb.en.u4cse18001@cb.students.amrita.edu','student1@gmail.com',9888811111, 'Dayscholar', '-', 'Indian', 'Tamil', 'XYZ street, ABC', 'SPS street, FYU', '04-01-2001', 'O+', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18002', 'Abhay B','M','cb.en.u4cse18002@cb.students.amrita.edu','student2@gmail.com',9876811111, 'YKB', 'F101', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18003', 'Abhinaya S','F','cb.en.u4cse18003@cb.students.amrita.edu','student3@gmail.com',983584411, 'Dayscholar', '-', 'Indian', 'Tamil', 'XYZ street, ABC', 'XYZ street, ABC', '14-12-2000', 'A+', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18004', 'Aisha G','F','cb.en.u4cse18004@cb.students.amrita.edu','student4@gmail.com',9888898979, 'BHV', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18005', 'Ajay G','M','cb.en.u4cse18005@cb.students.amrita.edu','student5@gmail.com',9999911111, 'YKB', 'F101', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '15-12-2000', 'B-', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18006', 'Aadhi R','M','cb.en.u4cse18006@cb.students.amrita.edu','student6@gmail.com',9886782013, 'YKB', 'F103', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18007', 'Bharat S','M','cb.en.u4cse18007@cb.students.amrita.edu','student7@gmail.com',900055555, 'YKB', 'F100', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-08-2000', 'O-', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18008', 'Bharati M','F','cb.en.u4cse18008@cb.students.amrita.edu','student8@gmail.com',9797933311, 'BHV', 'G102', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18009', 'Dhanush S','M','cb.en.u4cse18009@cb.students.amrita.edu','student9@gmail.com',9000000011, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '09-11-2000', 'O-', 12301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18010', 'Divya T','F','cb.en.u4cse18010@cb.students.amrita.edu','student10@gmail.com',9888811455, 'BHV', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 12301);

INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18101', 'Aaryan S','M','cb.en.u4cse18101@cb.students.amrita.edu','student11@gmail.com',9888811112, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18102', 'Abhay B','M','cb.en.u4cse18102@cb.students.amrita.edu','student12@gmail.com',9876811112, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18103', 'Abhinaya S','F','cb.en.u4cse18103@cb.students.amrita.edu','student13@gmail.com',983584412, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18104', 'Aisha G','F','cb.en.u4cse18104@cb.students.amrita.edu','student14@gmail.com',9888898970, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18105', 'Ajay G','M','cb.en.u4cse18105@cb.students.amrita.edu','student15@gmail.com',9999911112, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18106', 'Aadhi R','M','cb.en.u4cse18106@cb.students.amrita.edu','student16@gmail.com',9886782012, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18107', 'Bharat S','M','cb.en.u4cse18107@cb.students.amrita.edu','student17@gmail.com',900055552, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18108', 'Bharati M','F','cb.en.u4cse18108@cb.students.amrita.edu','student18@gmail.com',9797933312, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18109', 'Dhanush S','M','cb.en.u4cse18109@cb.students.amrita.edu','student19@gmail.com',9000000012, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE18110', 'Divya T','F','cb.en.u4cse18110@cb.students.amrita.edu','student110@gmail.com',9888811452, 'YKB', 'F104', 'Indian', 'Telugu', 'ZXY street, ABC', 'ZXY Street, ABC', '05-11-2000', 'O-', 14312);
-- select * from student_det_2018;


INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17001', 'Adith','M','cb.en.u4cse17001@cb.students.amrita.edu','student71@gmail.com',9888811113, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17002', 'Adithi','F','cb.en.u4cse17002@cb.students.amrita.edu','student72@gmail.com',9876811113, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17003', 'Adithya','M','cb.en.u4cse17003@cb.students.amrita.edu','student73@gmail.com',983584413, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17004', 'Aisha H','F','cb.en.u4cse17004@cb.students.amrita.edu','student74@gmail.com',9888898973, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17005', 'Aman G','M','cb.en.u4cse17005@cb.students.amrita.edu','student75@gmail.com',9999911113, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17006', 'Aadhi Venkat','M','cb.en.u4cse17006@cb.students.amrita.edu','student76@gmail.com',9886782010, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17007', 'Buvan S','M','cb.en.u4cse17007@cb.students.amrita.edu','student77@gmail.com',900055553, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17008', 'Cynthia','F','cb.en.u4cse17008@cb.students.amrita.edu','student78@gmail.com',9797933313, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17009', 'Dhanush S','M','cb.en.u4cse17009@cb.students.amrita.edu','student79@gmail.com',9000000013, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);
INSERT INTO student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) VALUES('CB.EN.U4CSE17010', 'Divya T','F','cb.en.u4cse17010@cb.students.amrita.edu','student710@gmail.com',9888811453, 'VLB', 'G101', 'Indian', 'Telugu', 'HIJ street, CFH', 'HIJ street, CFH', '07-07-2000', 'A-', 13301);

-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17101', 'Adith','M','cb.en.u4cse17101@cb.students.amrita.edu','student_det721@gmail.com',9888811114);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17102', 'Adithi','F','cb.en.u4cse17102@cb.students.amrita.edu','student_det722@gmail.com',9876811114);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17103', 'Adithya','M','cb.en.u4cse17103@cb.students.amrita.edu','student_det723@gmail.com',983584414);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17104', 'Aisha H','F','cb.en.u4cse17104@cb.students.amrita.edu','student_det724@gmail.com',9888898974);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17105', 'Aman G','M','cb.en.u4cse17105@cb.students.amrita.edu','student_det725@gmail.com',9999911114);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CS(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id)E17106', 'Aadhi Venkat','M','cb.en.u4cse17106@cb.students.amrita.edu','student_det726@gmail.com',9886782014);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17107', 'Buvan S','M','cb.en.u4cse17107@cb.students.amrita.edu','student_det727@gmail.com',900055554);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17108', 'Cynthia','F','cb.en.u4cse17108@cb.students.amrita.edu','student_det728@gmail.com',9797933314);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17109', 'Dhanush S','M','cb.en.u4cse17109@cb.students.amrita.edu','student_det729@gmail.com',9000000014);
-- insert into student_det(roll_number, name, gender, college_mail_id, personal_mail_id, phone_number, hostel, room_number, nationality, mother_tongue, communication_address, permanent_address, dob, blood_group, advisor_id) values('CB.EN.U4CSE17110', 'Divya T','F','cb.en.u4cse17110@cb.students.amrita.edu','student_det7210@gmail.com',9888811454);

CREATE TABLE parent_det(roll_number VARCHAR(20) PRIMARY KEY, p_relation VARCHAR(20), p_name VARCHAR(20), p_email_id VARCHAR(50) UNIQUE, p_phone_number BIGINT UNIQUE);
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18001', 'Father', 'Sathyanarayanan M', 'sathyam@gmail.com', 8774722641 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18002', 'Mother', 'Nalina D', 'nalinad@gmail.com', 8774722541 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18003', 'Mother', 'Sahithi M', 'sahithi@gmail.com', 8974722641 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18004', 'Father', 'Aran K', 'aranl@gmail.com', 8474722641 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18005', 'Guardian', 'Krishna K', 'krishna@gmail.com', 8980722641 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18006', 'Father', 'Ramesh K', 'rameshk@gmail.com', 7774722641 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18007', 'Father', 'Santhosh N', 'santosh@gmail.com', 6874722641 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18008', 'Father', 'Mani Kandan', 'manik@gmail.com', 9614722641 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18009', 'Mother', 'Rebecca K', 'rebeccak@gmail.com', 9074722641 );
INSERT INTO parent_det VALUES( 'CB.EN.U4CSE18010', 'Father', 'Kadhiravan J', 'kadirj@gmail.com', 8774754241 );



SELECT * FROM student_det S INNER JOIN parent_det P ON S.roll_number = P.roll_number WHERE S.roll_number LIKE '%U4CSE180%';

SELECT * FROM student_det S INNER JOIN parent_det P ON S.roll_number = P.roll_number WHERE S.advisor_id = '12301';

CREATE TABLE advisor_class (advisor_id VARCHAR(10) REFERENCES faculty(id), classid VARCHAR(50), PRIMARY KEY(advisor_id));
INSERT INTO advisor_class VALUES(12301, 'B.TECH. 2018 CSE A'), (13301, 'B.TECH. 2017 CSE A' ), (14312, 'B.TECH. 2018 CSE B');

-- drop table student_det;
-- drop table parent_det;
-- drop table advisor_class;
-- drop table tests;


-- *************************************************************************************************
-- tests
-- *************************************************************************************************

CREATE TABLE tests(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100), 
date VARCHAR(10), time VARCHAR(5), instructions VARCHAR(1000), course VARCHAR(50), f_id VARCHAR(10) REFERENCES faculty(id));

INSERT INTO tests(name, date,time, instructions, course, f_id) 
	VALUES	('Test 1', '2021-01-30','11:00','No negative marking. Duration: 15 minutes','15CSE301', '12301'),
			('Tutorial 1', '2021-02-14','15:00','Negative marking. Duration: 1 hour','15CSE301', '14312');

SELECT * FROM tests;

-- drop table tests;

-- *************************************************************************************************
-- assignments
-- *************************************************************************************************

CREATE TABLE assignments(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100), date VARCHAR(10), 
time VARCHAR(5), instructions VARCHAR(1000), course VARCHAR(50), f_id VARCHAR(10) REFERENCES faculty(id));
SELECT * FROM assignments;

-- drop table assignments;

-- *************************************************************************************************
-- Resources
-- *************************************************************************************************

CREATE TABLE resources(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100), modified_date VARCHAR(10), instructions VARCHAR(1000), course VARCHAR(50));
SELECT * FROM resources;

-- *************************************************************************************************
-- Feedbacks
-- *************************************************************************************************

CREATE TABLE course_15CSE313_2018_CSE_A_feedback(question VARCHAR(200) PRIMARY KEY,
												 opt_a_val VARCHAR(50) DEFAULT NULL,opt_per_a FLOAT DEFAULT 0.0,
                                                 opt_b_val VARCHAR(50) DEFAULT NULL,opt_per_b FLOAT DEFAULT 0.0,
                                                 opt_c_val VARCHAR(50) DEFAULT NULL,opt_per_c FLOAT DEFAULT 0.0,
                                                 opt_d_val VARCHAR(50) DEFAULT NULL,opt_per_d FLOAT DEFAULT 0.0);

INSERT INTO course_15CSE313_2018_CSE_A_feedback VALUES("How much syllabus was completed?","80-100%",78,"60-80%",10,"40-60%",12,"less than 40%",0);
INSERT INTO course_15CSE313_2018_CSE_A_feedback VALUES("Were the classes interactive?","Very interactive",60,"Interactive",20,"Somewhat",10,"Not at all",10);
INSERT INTO course_15CSE313_2018_CSE_A_feedback VALUES("Were your doubts clarified?","80-100%",90,"60-80%",6,"40-60%",3,"less than 40%",1);
SELECT * FROM course_15CSE313_2018_CSE_A_feedback;

-- *************************************************************************************************
-- Announcements
-- *************************************************************************************************
CREATE TABLE notifications(id INTEGER, title VARCHAR(100), content VARCHAR(5000), link VARCHAR(1000), date VARCHAR(10));

INSERT INTO notifications VALUES
(1001, 'UDAAN - NEWSLETTER', 'Amrita Udaan is a monthly newsletter of Dept. of Social Work. It is completely managed by the students under the guidance of the Faculty. Mainly it covers the departmental activities, articles on various social issues, book review, movie review, drawings, posters, alumni interviews, guidance and solved previous year question papers of CBSE-NET. The contents are contributed mainly by the students, alumni and faculty members. It is sucessully publishing every month from October 2019.', 'NA', '2021-06-09'),
(1002, 'AY 2021-22 Odd Semester', 'Circular: Academic Year 2021-22 Odd Semester Class commencement dates for all UG & PG programs are out.', 'https://intranet.cb.amrita.edu/sites/default/files/01_06_2021_circular_commencement_of_odd_semester_classes_AY_2021-22.pdf', '2021-06-04');

SELECT * FROM notifications;

CREATE TABLE faculty_notifications(n_id INTEGER REFERENCES notifications(id), f_id VARCHAR(10) REFERENCES faculty(id), isRead BOOLEAN);
INSERT INTO faculty_notifications VALUES
(1001, 12301, FALSE),
(1001, 13301, FALSE),
(1001, 12465, FALSE),
(1001, 14312, FALSE),
(1001, 18501, FALSE),
(1002, 12301, FALSE),
(1002, 13301, FALSE),
(1002, 12465, FALSE),
(1002, 14312, FALSE),
(1002, 18501, FALSE);

SELECT * FROM faculty_notifications;

SELECT * FROM notifications WHERE id IN (SELECT n_id FROM faculty_notifications WHERE f_id=12301 AND isRead=FALSE);
UPDATE faculty_notifications SET isRead=FALSE WHERE f_id=12301;

SELECT * FROM notifications WHERE id IN (SELECT n_id FROM faculty_notifications WHERE f_id=12301);
-- drop table notifications;
-- drop table faculty_notifications;

-- *************************************************************************************************
-- Leave Management
-- *************************************************************************************************

CREATE TABLE leave_records(id INT PRIMARY KEY AUTO_INCREMENT, f_id VARCHAR(10) REFERENCES faculty(id), type VARCHAR(30), start_date VARCHAR(10), end_date VARCHAR(10), reason VARCHAR(5000), status VARCHAR(10));
ALTER TABLE leave_records AUTO_INCREMENT=157681;

INSERT INTO leave_records(f_id, type, start_date, end_date, reason, status) VALUES(12301, 'Casual leave', '2021-04-22', '2021-04-24', 'Family function', 'Approved');
INSERT INTO leave_records(f_id, type, start_date, end_date, reason, status) VALUES(18501, 'Casual leave', '2021-05-20', '2021-05-22', 'Family function', 'Approved');
INSERT INTO leave_records(f_id, type, start_date, end_date, reason, status) VALUES(12301, 'Special Casual leave', '2021-06-15', '2021-06-18', 'Attending International Conference on Internet of Things, Big Data Analytics and Information Technology (ICITBDIT) in Chennai', 'Applied');
INSERT INTO leave_records(f_id, type, start_date, end_date, reason, status) VALUES(18501, 'Special Casual leave', '2021-06-15', '2021-06-18', 'Attending International Conference on Internet of Things, Big Data Analytics and Information Technology (ICITBDIT) in Chennai', 'Applied');

SELECT * FROM leave_records WHERE f_id=12301 ORDER BY id DESC;

CREATE TABLE faculty_leaves(f_id VARCHAR(10) PRIMARY KEY REFERENCES faculty(id), casual INT, sp_casual INT, vacation INT, medical INT);
INSERT INTO faculty_leaves VALUES(12301, 9, 11, 37, 0), (18501, 9, 11, 39, 0), (13301, 12, 15, 45, 0), (12465, 12, 15, 45, 0), (14312, 12, 15, 45, 0);

SELECT * FROM faculty_leaves;
-- drop table leave_records;
-- drop table faculty_leaves;


