package com.lms.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String title;

    @ManyToMany(
            mappedBy = "courses",
            fetch = FetchType.EAGER
    )

    private List<Student> students =
            new ArrayList<>();

    public Course() {

    }

    public Course(String title) {

        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(
            List<Student> students
    ) {

        this.students = students;
    }
}