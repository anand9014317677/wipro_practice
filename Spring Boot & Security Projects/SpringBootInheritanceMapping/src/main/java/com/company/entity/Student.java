package com.company.entity;



import com.company.entity.base.Address;
import com.company.entity.base.Person;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Student extends Person {

    @OneToMany(mappedBy = "student",
            cascade = CascadeType.ALL,
            orphanRemoval = true)

    @JsonManagedReference(value = "student-email")
    private List<Email> emails = new ArrayList<>();

    public Student() {
    }

    public Student(String name, Address address) {
        super(name, address);
    }

    public List<Email> getEmails() {
        return emails;
    }

    public void setEmails(List<Email> emails) {

        this.emails = emails;

        for (Email e : emails) {
            e.setStudent(this);
        }
    }
}