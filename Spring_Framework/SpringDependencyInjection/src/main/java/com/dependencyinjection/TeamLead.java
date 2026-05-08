package com.dependencyinjection;




import org.springframework.stereotype.Service;


import org.springframework.context.annotation.Primary;

@Service
@Primary
class TeamLead implements Allocator
{

    TeamLead()
    {
        System.out.println("TeamLead Bean Created");
    }

    public void taskAllocation(String user)
    {
        System.out.println("Task is allocated by : TeamLead to " + user);
    }

}