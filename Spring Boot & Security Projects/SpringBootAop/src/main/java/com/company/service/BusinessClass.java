package com.company.service;


import org.springframework.stereotype.Service;
import com.company.myannotation.MyAnno;

@Service
public class BusinessClass {

    @MyAnno
    public void add() {

        System.out.println("Add Business Method Executed");
        System.out.println(10 / 2);
    }

    @MyAnno
    public void delete() {

        System.out.println("Delete Business Method Executed");
        System.out.println(10 / 5);
    }
}