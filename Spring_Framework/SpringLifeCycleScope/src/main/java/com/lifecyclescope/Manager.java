package com.lifecyclescope;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;


@Service
@Scope("singleton")  // which is by default 
class Manager implements Allocator
{
	// Before executing your business logic or putting into a service
	@PostConstruct
	public void init()
	{
		
		// use case : Let's say you want to add some dummy values in a database at the time initializing the bean
		System.out.println("Welcome to this Bean Class and Task Allocation Details");
	}

public void taskAllocation(String user)
{
System.out.println("Task is allocated by : Manager to " + user);
}

@PreDestroy
public void destroy()
{
	//use case : Delete all the open resources
	System.out.println("Task Allocated : All The Best!");
}

}