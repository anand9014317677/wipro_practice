package com.company.Hibernateorm;

import com.company.Hibernateorm.model.Student;
import com.company.Hibernateorm.Util.HibernateUtil;

import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.Scanner;

public class App {

    public static void main(String[] args) {

        Session session =
                HibernateUtil.getSessionFactory().openSession();

        Transaction tx =
                session.beginTransaction();

        Scanner sc = new Scanner(System.in);

        System.out.println("Enter Student Name:");
        String name = sc.nextLine();

        System.out.println("Enter Student Email:");
        String email = sc.nextLine();

        System.out.println("Enter Student Course:");
        String course = sc.nextLine();

        Student s1 =
                new Student(name, email, course);

        session.persist(s1);

        Student data =
                session.get(Student.class, s1.getId());

        System.out.println(data);

        tx.commit();

        session.close();

        HibernateUtil.close();
    }
}