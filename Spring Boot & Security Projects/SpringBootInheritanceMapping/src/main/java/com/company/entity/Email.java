package com.company.entity;



import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "email")
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonBackReference(value = "student-email")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonBackReference(value = "teacher-email")
    private Teacher teacher;

    public Email() {
    }

    public Email(String email, Student student) {
        this.email = email;
        this.student = student;
    }

    public Email(String email, Teacher teacher) {
        this.email = email;
        this.teacher = teacher;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }
}