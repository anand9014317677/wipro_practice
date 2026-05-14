package com.lms.dao;

import com.lms.config.HibernateUtil;
import com.lms.entity.Course;
import com.lms.entity.Student;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class StudentDao {

    public void saveStudent(Student student) {

        Transaction tx = null;

        try (
                Session session =
                        HibernateUtil
                                .getSessionFactory()
                                .openSession()
        ) {

            tx = session.beginTransaction();

            session.persist(student);

            tx.commit();

        } catch (Exception e) {

            if (tx != null) {

                tx.rollback();
            }

            e.printStackTrace();
        }
    }

    public List<Student> getAllStudents() {

        try (
                Session session =
                        HibernateUtil
                                .getSessionFactory()
                                .openSession()
        ) {

            return session
                    .createQuery(
                            "from Student",
                            Student.class
                    )
                    .list();
        }
    }

    public Student getStudentById(Long id) {

        try (
                Session session =
                        HibernateUtil
                                .getSessionFactory()
                                .openSession()
        ) {

            return session.get(Student.class, id);
        }
    }

    public void enrollStudent(
            Long studentId,
            List<Long> courseIds
    ) {

        Transaction tx = null;

        try (
                Session session =
                        HibernateUtil
                                .getSessionFactory()
                                .openSession()
        ) {

            tx = session.beginTransaction();

            Student student =
                    session.get(Student.class, studentId);

            for (Long courseId : courseIds) {

                Course course =
                        session.get(Course.class, courseId);

                student.getCourses().add(course);
            }

            session.merge(student);

            tx.commit();

        } catch (Exception e) {

            if (tx != null) {

                tx.rollback();
            }

            e.printStackTrace();
        }
    }
}