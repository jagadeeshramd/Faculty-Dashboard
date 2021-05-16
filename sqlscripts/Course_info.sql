use facultydashboard;
show tables;
create table course_list(course_code varchar(15) primary key,
						 course_name varchar(20), 
                         course_syllabus varchar(1000),
                         course_details varchar(1000),
                         course_outcome varchar(1000),
                         course_eval varchar(1000));
insert into course_list values('15CSE301','COA',
							   'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing');
insert into course_list values('15CSE313','SE',
							   'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing',
                               'https://drive.google.com/file/d/1OUFXHFi65onyEmYfk7tvurHgaZ4bij5T/view?usp=sharing');

drop table course_list;

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
insert into course_faculty values('15CSE312',2018,'CSE','B','14312');

alter table course_faculty add ismentor boolean default false;
-- drop table course_faculty;
-- drop table course_list;
update course_faculty set ismentor=true where faculty_id='12301';
select course_id,batch,dept,section,ismentor from course_faculty where faculty_id='12301';