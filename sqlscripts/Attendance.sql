use facultydashboard;
show tables;
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
drop table attendance;