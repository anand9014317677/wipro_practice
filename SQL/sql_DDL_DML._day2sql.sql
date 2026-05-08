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

-- employeesrename table
alter table practice rename to prac;


-- Day 2  

use lms;
create table cart_items(item_id int )

select * from information_schema.check_constraints where constraint_schema = "ems" ;


-- constraints
create table cart (item_id int auto_increment primary key 
, name varchar(25) not null,
 qty int not null,
 sales_tax decimal(5,2) not null default 0.1,
 check(qty > 0), check(sales_tax > 0.1));
 
 show create table cart;
 
 
 -- primary and foregin
create table department (dept_id int primary key, dep_name varchar(10)); 

create table emp2(emp_id int primary key, emp_name varchar(20) not null, dept_id int,
foreign key (dept_id) references department(dept_id));

insert into department values (1,"IT"),(2,"cse"),(3,"ece"),(4,"finance");
insert into emp2 values(101,"ravi",4),(102,"ram",2),(103,"madhu",3),(104,"hemanth",1);

-- inner join
select emp2.emp_name,department.dept_id from emp2 inner join department on emp2.dept_id = department.dept_id;

-- left join
select emp2.emp_name,department.dept_id from department left join emp2 on emp2.dept_id = department.dept_id;
insert into emp2 values(105,"anand",6);
insert into department values (5,"mech");

-- right join
select emp2.emp_name,department.dept_id from emp2 right join department on emp2.dept_id = department.dept_id;

-- full outer join --
select  e.emp_name , d.dep_name  
from  emp2 e left join department  d 
on  e.dept_id = d.dept_id 
union 
select  e.emp_name , d.dep_name  
from  emp2 e right join department  d 
on  e.dept_id = d.dept_id ;


-- self join ---
create table empmanager(empid int , name varchar(30) , manager_id int);
insert into empmanager(empid , name) values (1 , "Niti");
insert into empmanager values (2 , "Jiya" , 1) , (3,"Shubham" ,2) , (4,"Richa" ,1); 

select * from empmanager;
 select  e1.name as employeename , e2.name as managername 
 from empmanager e1 left join empmanager e2  
 on e1.manager_id = e2.empid;
 
 use Food_Delivery;
 
 -- 1
 select c.name, o.order_amount,r.name  from customers c inner join  orders o on c.customer_id = o.customer_id  inner join restaurants r on o.restaurant_id=r.restaurant_id;
 
 
 
 
 
 
 
 
 CREATE DATABASE productdb;
USE productdb;

CREATE TABLE product (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(70),
  price DOUBLE
);