use facultydashboard;
SHOW TABLES;
create table assessment_list(course_code_full varchar(50),ass_name varchar(2) unique,totalmarks int,constraint PK primary key(course_code_full,ass_name)); 
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','A1',10);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','A2',10);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','A3',10);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','Q1',15);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','Q2',15);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','Q3',15);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','Q4',15);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','P1',50);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','P2',50);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','T1',20);
insert into assessment_list values('15CSE387_2018_B.Tech_CSE_A','T2',20);
select * from assessment_list;

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

drop table assessment_list;
drop table student_academic_info;

alter table student_academic_info add t1 float;
