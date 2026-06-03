package com.company.entity;

import com.company.entity.base.Address;
import com.company.entity.base.Person;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Teacher extends Person {

    private String subject;

    @OneToMany(mappedBy = "teacher",
            cascade = CascadeType.ALL,
            orphanRemoval = true)

    @JsonManagedReference(value = "teacher-email")
    private List<Email> emails = new ArrayList<>();

    public Teacher() {
    }

    public Teacher(String name,
                   Address address,
                   String subject) {

        super(name, address);
        this.subject = subject;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public List<Email> getEmails() {
        return emails;
    }

    public void setEmails(List<Email> emails) {

        this.emails = emails;

        for (Email e : emails) {
            e.setTeacher(this);
        }
    }
}