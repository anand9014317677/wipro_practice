package com.example;


import org.hibernate.Session;
import org.hibernate.Transaction;

import com.example.model.Course;
import com.example.model.Student;
import com.example.util.HibernateUtil;

public class App {

    public static void main(String[] args) {

        Session session =
                HibernateUtil.getSessionFactory().openSession();

        Transaction tx = session.beginTransaction();

        Course c1 = new Course("Operating System");
        Course c2 = new Course("Microprocessor");

        Student ritu = new Student("Ritu");
        Student sakshi = new Student("Sakshi");
        Student shubham = new Student("Shubham");

        ritu.addCourse(c1);
        ritu.addCourse(c2);

        sakshi.addCourse(c1);

        shubham.addCourse(c2);

        session.persist(ritu);
        session.persist(sakshi);
        session.persist(shubham);

        tx.commit();

        Course course = session.get(Course.class, 1L);

        System.out.println("Course details : "
                + course.getTitle());

        course.getStudents().forEach(st ->
                System.out.println(
                        "These Students are enrolled : "
                                + st.getName()));

        session.close();
    }
}