package com.lms.service;

import com.lms.dao.StudentDao;
import com.lms.entity.Student;

import java.util.List;

public class StudentService {

    private final StudentDao studentDao =
            new StudentDao();

    public void saveStudent(Student student) {

        studentDao.saveStudent(student);
    }

    public List<Student> getAllStudents() {

        return studentDao.getAllStudents();
    }

    public Student getStudentById(Long id) {

        return studentDao.getStudentById(id);
    }

    public void enrollStudent(
            Long studentId,
            List<Long> courseIds
    ) {

        studentDao.enrollStudent(
                studentId,
                courseIds
        );
    }
}