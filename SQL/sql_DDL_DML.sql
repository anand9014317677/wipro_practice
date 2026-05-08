create database Food_Delivery;
use Food_Delivery;
create table Customers (customer_id int primary key,
name varchar(30),
email varchar(30),
city varchar(20));

describe customers;

create table Restaurants (restaurant_id int primary key,
name varchar(30),
cuisine_type varchar(20),
city varchar(20));

describe restaurants;


create table orders (order_id int primary key,
customer_id int ,
restaurant_id int,
order_amount int,
order_date date,
foreign key (customer_id) references customers (customer_id) on delete cascade ,
foreign key (restaurant_id) references Restaurants (restaurant_id) on delete cascade);

describe orders;
drop table orders;
drop table restaurants;
drop table Customers;
use anand;
delete from employees where emp_id =?;
select* from employees;
insert into employees values(4,"ravi","@34","IT",30400),
(5,"hemanth","@455","CSE",45344),
(6,"naveen","@746","ECE",50000);
select* from employees;
update employees set emp_name= "123455" where emp_id = 3;
select* from employees order by emp_id desc;
set sql_safe_updates = 0;
insert into employees values(7,"ram","@3455","finance",30400);

use Food_Delivery;
describe customers;
insert into customers values(1,"anand","@123","hyd"),
(2,"ram","@456","bang"),(3,"ravi","@890","chennai");
describe restaurants;
insert into restaurants values("001","x","a","hyd"),
("002","y","b","bang"),
("003","z","c","chennai");
describe orders;
insert into orders values(30,3,003,8000,'2025-03-20'),
(20,2,002,6000,'2025-01-11');


describe customers;
select name from customers;     -- 1


use anand;
select emp_name from employees where emp_dept="finance";   -- 2  


select * from employees where salary > 40000;   -- 3



use Food_Delivery;
describe orders;
select * from orders where order_date ='2025-01-11';     -- 4

use anand;
select emp_name , salary from employees order by salary desc;     -- 5


select emp_name , salary from employees order by salary desc limit 2;    -- 6

use Food_Delivery;
describe customers;
select*from customers;                                     -- this 7
update  customers set city = "pune" where name = "ravi";


select * from restaurants;
update restaurants set cuisine_type = "fast food" where cuisine_type = "a";    -- 8


select*from orders;
update orders set order_amount = 5000 where order_id = 10;    -- 9


select * from customers;
delete from  customers where customer_id = 1;    -- 10


select * from  orders;
delete from orders where order_id = 20;    -- 11


select* from restaurants ;                   -- 12
delete from restaurants where city = "bang";



create table practice (a varchar(10), b varchar(10), c varchar(10));
drop table practice ;                                                  -- droping table permanent

-- Truncate
create table practice (a varchar(10), b varchar(10), c varchar(10));
insert into practice values("hi","bi","tu"),("ju","hw","jw");
truncate table practice ;
select* from practice;

-- Alter
-- alter add new column and modify column
insert into practice values("hi","bi","tu"),("ju","hw","jw");
alter table practice add id int;
insert into practice values("hd","hd","js",1);
alter table practice modify column c varchar(49);

-- rename column
alter table practice rename column a to x;

-- drop column 
alter table practice drop column c;

-- rename table
alter table practice rename to prac;


