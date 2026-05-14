# Learning Management System (LMS)

# Spring MVC + Hibernate + JSP

---

# Project Overview

This project is a Learning Management System (LMS) developed using:

* Spring MVC
* Hibernate ORM
* JSP
* MySQL
* Maven

The project demonstrates:

* MVC Architecture
* Hibernate ORM Mapping
* Many-To-Many Relationship
* JSP Form Handling
* ModelAttribute Binding
* DispatcherServlet
* DAO Layer
* Service Layer
* Controller Layer

---

# Functional Requirements

1. Student Module

* Add/Register Students
* View Students

2. Course Module

* Add Courses
* View Courses

3. Enrollment Module

* Enroll students into multiple courses
* One student can enroll in many courses
* One course can have many students

4. Admin Panel

* Add Students
* Add Courses
* Enroll Students
* View Enrollments

---

# Technologies Used

1. Spring MVC

Spring MVC is used for handling web requests and responses.

Main Components:

* DispatcherServlet
* Controllers
* View Resolver
* JSP Views

---

2. Hibernate ORM

Hibernate is an ORM (Object Relational Mapping) framework.

It converts Java Objects into Database Tables.

Features:

* Automatic Table Creation
* CRUD Operations
* Relationship Mapping
* HQL Support
* Session Management

---

3. JSP

JSP is used for frontend UI.

Features:

* Form Handling
* Dynamic Data Rendering
* JSTL Support
* Bootstrap UI

---

4. MySQL

Database used for storing:

* Students
* Courses
* Enrollments

---

# MVC Architecture

MVC stands for:

* Model
* View
* Controller

---

1. Model

Contains:

* Entity Classes
* DAO Classes
* Service Classes

Example:

* Student.java
* Course.java
* StudentDao.java

---

2. View

Contains JSP pages.

Example:

* student-form.jsp
* course-form.jsp
* enroll-form.jsp
* view.jsp

---

3. Controller

Handles client requests.

Example:

* StudentController.java
* CourseController.java

---

# Project Structure

```text
lms-mvc/
│── src/main/java/com/lms/
│   ├── controller/
│   ├── service/
│   ├── dao/
│   ├── entity/
│   └── config/
│
│── src/main/resources/
│   └── hibernate.cfg.xml
│
│── src/main/webapp/
│   └── WEB-INF/
│       ├── web.xml
│       ├── dispatcher-servlet.xml
│       └── views/
```

---

# Entity Classes

---

# Student Entity

Student entity stores:

* id
* name
* email

Relationship:

@OneToMany or @ManyToMany

In this project:

@ManyToMany(cascade = CascadeType.ALL)

---

# Course Entity

Course entity stores:

* id
* title

Relationship:

@ManyToMany(mappedBy = "courses")

---

# Many-To-Many Mapping

One Student can enroll in many Courses.

One Course can have many Students.

Hibernate automatically creates junction table:

student_course

---

# Many-To-Many Syntax

```java
@ManyToMany(cascade = CascadeType.ALL)

@JoinTable(
        name = "student_course",

        joinColumns =
        @JoinColumn(name = "student_id"),

        inverseJoinColumns =
        @JoinColumn(name = "course_id")
)
```

---

# Explanation

@JoinTable
creates junction table.

joinColumns
stores current entity foreign key.

inverseJoinColumns
stores associated entity foreign key.

---

# Database Tables

Hibernate automatically creates:

1. students
2. courses
3. student_course

---

# student_course Table

| student_id | course_id |
| ---------- | --------- |
| 1          | 1         |
| 1          | 2         |
| 2          | 2         |

This table manages relationships.

---

# Hibernate Configuration

hibernate.cfg.xml contains:

* JDBC Driver
* Database URL
* Username
* Password
* Hibernate Dialect
* Entity Mapping

---

# Important Properties

```xml
<property name="hibernate.hbm2ddl.auto">
    update
</property>
```

Automatically updates database tables.

---

```xml
<property name="hibernate.show_sql">
    true
</property>
```

Shows generated SQL queries.

---

# DispatcherServlet

DispatcherServlet is the front controller of Spring MVC.

Responsibilities:

* Receives requests
* Sends requests to controllers
* Returns views

Configured inside:

web.xml

---

# web.xml

Used for:

* Servlet configuration
* DispatcherServlet mapping
* Application startup

---

# dispatcher-servlet.xml

Used for:

* Component scanning
* View Resolver
* MVC configuration

---

# View Resolver

```xml
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
```

Converts logical view names into JSP pages.

Example:

return "student-form";

becomes:

/WEB-INF/views/student-form.jsp

---

# DAO Layer

DAO stands for Data Access Object.

Responsibilities:

* Save data
* Fetch data
* Update data
* Delete data

Example:

StudentDao.java
CourseDao.java

---

# Service Layer

Service layer contains business logic.

Responsibilities:

* Calls DAO methods
* Handles application logic

---

# Controller Layer

Controller handles client requests.

Annotations Used:

@Controller
@RequestMapping
@GetMapping
@PostMapping

---

# ModelAttribute Binding

Used to bind form data directly into Java Objects.

Example:

```java
@PostMapping("/save")
public String saveStudent(
        @ModelAttribute Student student
)
```

Spring automatically binds form values.

---

# JSP Forms

Used for user input.

Example:

```jsp
<form:form modelAttribute="student">
```

---

# Bootstrap

Bootstrap is used for beautification.

Features:

* Responsive UI
* Cards
* Buttons
* Tables
* Forms

---

# Enrollment Process

1. Student selected from dropdown.
2. Courses selected using checkboxes.
3. Student enrolled into selected courses.
4. Entries saved in student_course table.

---

# SQL Queries

---

# Show Students

```sql
select * from students;
```

---

# Show Courses

```sql
select * from courses;
```

---

# Show Junction Table

```sql
select * from student_course;
```

---

# Show Students with Courses

```sql
select
    s.id,
    s.name,
    s.email,
    c.title
from students s
join student_course sc
on s.id = sc.student_id
join courses c
on sc.course_id = c.id;
```

---

# Show Courses of Specific Student

```sql
select
    s.name,
    c.title
from students s
join student_course sc
on s.id = sc.student_id
join courses c
on sc.course_id = c.id
where s.id = 1;
```

---

# Advantages of Hibernate

* Reduces JDBC code
* Automatic SQL generation
* Relationship mapping support
* Database portability
* Caching support

---

# Advantages of Spring MVC

* Separation of concerns
* Easy request handling
* MVC architecture
* Better maintainability
* Easy integration with Hibernate

---

# Advantages of JSP

* Dynamic content generation
* Easy form handling
* JSTL support
* Works well with Spring MVC

---

# Conclusion

This LMS project demonstrates:

* Spring MVC Architecture
* Hibernate ORM Mapping
* Many-To-Many Relationship
* JSP Form Binding
* MVC Flow
* Database Integration
* CRUD Operations
* Student Enrollment System

The project is gives me the understanding of enterprise Java web application development using Spring MVC and Hibernate.
