package com.company.service;

import com.company.entity.Student;
import com.company.repo.StudentRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepo students;

    public StudentService(StudentRepo students) {

        this.students = students;
    }

    public Student save(Student s) {

        return students.save(s);
    }

    public List<Student> findAllWithEmails() {

        return students.findAll();
    }
}