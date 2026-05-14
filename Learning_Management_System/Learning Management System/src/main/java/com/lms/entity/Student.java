package com.lms.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String name;

    private String email;

    @ManyToMany(
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )

    @JoinTable(
            name = "student_course",

            joinColumns =
            @JoinColumn(name = "student_id"),

            inverseJoinColumns =
            @JoinColumn(name = "course_id")
    )

    private List<Course> courses =
            new ArrayList<>();

    public Student() {

    }

    public Student(
            String name,
            String email
    ) {

        this.name = name;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Course> getCourses() {
        return courses;
    }

    public void setCourses(
            List<Course> courses
    ) {

        this.courses = courses;
    }
}