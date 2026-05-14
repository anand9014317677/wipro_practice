package com.lms.config;

import com.lms.entity.Course;
import com.lms.entity.Student;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {

    private static final SessionFactory sessionFactory =
            buildSessionFactory();

    private static SessionFactory buildSessionFactory() {

        try {

            return new Configuration()
                    .configure("hibernate.cfg.xml")

                    .addAnnotatedClass(Student.class)

                    .addAnnotatedClass(Course.class)

                    .buildSessionFactory();

        } catch (Exception e) {

            throw new RuntimeException(
                    "SessionFactory creation failed " + e
            );
        }
    }

    public static SessionFactory getSessionFactory() {

        return sessionFactory;
    }
}