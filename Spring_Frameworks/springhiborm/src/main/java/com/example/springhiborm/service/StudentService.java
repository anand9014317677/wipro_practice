package com.example.springhiborm.service;



import java.util.List;

import org.springframework.stereotype.Service;

import com.example.springhiborm.dao.StudentDao;
import com.example.springhiborm.entity.Student;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class StudentService {

    private final StudentDao dao;

    public StudentService(StudentDao dao) {
        this.dao = dao;
    }

    public void create(Student s) {

        dao.save(s);
    }

    public Student get(Long id) {

        return dao.findById(id);
    }

    public List<Student> list() {

        return dao.findAll();
    }
}