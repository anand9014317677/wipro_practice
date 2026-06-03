package com.company.repo;

import com.company.entity.Teacher;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherRepo extends JpaRepository<Teacher, Long> {

    @EntityGraph(attributePaths = {"emails"})
    List<Teacher> findAll();
}