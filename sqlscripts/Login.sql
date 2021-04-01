create database facultydashboard;

use facultydashboard;


create table faculty(email varchar(50) primary key, username varchar(50) not null, passwd varchar(30) not null);

insert into faculty values('venkat@gmail.com','Venkataraman','venkat123');
insert into faculty values('akhil@gmail.com','Akhil','akhil123');
insert into faculty values('senthil@gmail.com','Senthil','senthil123');



select * from faculty;