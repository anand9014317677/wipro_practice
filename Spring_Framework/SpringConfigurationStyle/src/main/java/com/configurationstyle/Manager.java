package com.configurationstyle;




import org.springframework.stereotype.Service;

@Service
public class Manager implements Allocator {

	Manager() // Manager m = new Manager();
	{
		System.out.println("Manager Bean Created");
	}

	public void taskAllocation(String user) {
		System.out.println("Task is allocated by : Manager to " + user);
	}
}