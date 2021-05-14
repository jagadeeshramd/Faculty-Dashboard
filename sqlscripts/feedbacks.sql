use facultydashboard;
show tables;
create table course_15CSE313_2018_CSE_A_feedback(question varchar(200) primary key,
												 opt_a_val varchar(50) default null,opt_per_a float default 0.0,
                                                 opt_b_val varchar(50) default null,opt_per_b float default 0.0,
                                                 opt_c_val varchar(50) default null,opt_per_c float default 0.0,
                                                 opt_d_val varchar(50) default null,opt_per_d float default 0.0);

insert into course_15CSE313_2018_CSE_A_feedback values("How much syllabus was completed?","80-100%",78,"60-80%",10,"40-60%",12,"less than 40%",0);
insert into course_15CSE313_2018_CSE_A_feedback values("Were the classes interactive?","Very interactive",60,"Interactive",20,"Somewhat",10,"Not at all",10);
insert into course_15CSE313_2018_CSE_A_feedback values("Were your doubts clarified?","80-100%",90,"60-80%",6,"40-60%",3,"less than 40%",1);

select * from course_15CSE313_2018_CSE_A_feedback;

-- drop table course_15CSE313_2018_CSE_A_feedback;