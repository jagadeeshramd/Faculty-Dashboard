use facultydashboard;
show tables;
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

drop table course_list;