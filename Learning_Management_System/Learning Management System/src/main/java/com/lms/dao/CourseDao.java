package com.lms.dao;

import com.lms.config.HibernateUtil;
import com.lms.entity.Course;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class CourseDao {

    public void saveCourse(Course course) {

        Transaction tx = null;

        try (
                Session session =
                        HibernateUtil
                                .getSessionFactory()
                                .openSession()
        ) {

            tx = session.beginTransaction();

            session.persist(course);

            tx.commit();

        } catch (Exception e) {

            if (tx != null) {

                tx.rollback();
            }

            e.printStackTrace();
        }
    }

    public List<Course> getAllCourses() {

        try (
                Session session =
                        HibernateUtil
                                .getSessionFactory()
                                .openSession()
        ) {

            return session
                    .createQuery(
                            "from Course",
                            Course.class
                    )
                    .list();
        }
    }

    public Course getCourseById(Long id) {

        try (
                Session session =
                        HibernateUtil
                                .getSessionFactory()
                                .openSession()
        ) {

            return session.get(Course.class, id);
        }
    }
}