package com.company.repo;

import com.company.entity.Student;
import com.company.entity.base.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PersonRepo
        extends JpaRepository<Person, Long> {

    @Query("select s from Student s")
    List<Student> findAllStudents();
}