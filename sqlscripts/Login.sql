create database facultydashboard;
use facultydashboard;
show tables;
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
