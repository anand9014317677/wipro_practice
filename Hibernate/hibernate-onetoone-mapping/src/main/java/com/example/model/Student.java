package com.example.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reportcard_id")
    private ReportCard reportcard;

    public Student() {
    }

    public Student(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ReportCard getReportcard() {
        return reportcard;
    }

    public void setReportcard(ReportCard reportcard) {
        this.reportcard = reportcard;
    }

    @Override
    public String toString() {
        return "Student [id=" + id + ", name=" + name +
                ", reportcard=" + reportcard + "]";
    }
}