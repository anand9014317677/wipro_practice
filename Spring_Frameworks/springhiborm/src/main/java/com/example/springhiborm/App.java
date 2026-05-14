package com.example.springhiborm;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.example.springhiborm.entity.Student;
import com.example.springhiborm.service.StudentService;




public class App {

    public static void main(String[] args) {

        ApplicationContext ctx =
                new ClassPathXmlApplicationContext("applicationContext.xml");

        StudentService service = ctx.getBean(StudentService.class);

        service.create(new Student("Niti", "niti@gmail.com", "Python"));

        service.create(new Student("Jatin", "jatin@gmail.com", "MySQL"));

        System.out.println("__________All Student Data ________");

        System.out.println(service.list());

        System.out.println("__________Student based on ID ________");

        Student s = service.get(1L);

        System.out.println("Student with id 1 : " + s);
    }
}