package com.dependencyinjection;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DelegateConstructorDI {

    private final Allocator allocator;

    @Autowired
    public DelegateConstructorDI(Allocator allocator) {

        this.allocator = allocator;
    }

    public void notifyUser()
    {
        allocator.taskAllocation("Niti");

        System.out.println("Field injection --> allocator used: "
                + allocator.getClass().getSimpleName());
    }
}