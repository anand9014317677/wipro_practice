package com.company.repo;

import com.company.entity.Student;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepo extends JpaRepository<Student, Long> {

    @EntityGraph(attributePaths = {"emails"})
    List<Student> findAll();
}