package com.example;

import com.example.model.ReportCard;
import com.example.model.Student;
import com.example.util.HibernateUtil;

import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.Scanner;

public class App {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        Session session =
                HibernateUtil.getSessionFactory().openSession();

        Transaction tx = session.beginTransaction();

        System.out.println("Enter Student Name");

        String name = sc.nextLine();

        System.out.println("Enter student marks");

        double marks = sc.nextDouble();

        Student student = new Student(name);

        ReportCard reportCard = new ReportCard(marks);

        student.setReportcard(reportCard);

        session.persist(student);

        tx.commit();

        System.out.println("Transaction Committed");

        System.out.println("Student details are below : "
                + student);

        session.close();
    }
}