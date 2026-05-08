package com.configurationstyle;



@FunctionalInterface
public interface Allocator {

	// This method will be implemented by manager class
	// while implementing the interface
	void taskAllocation(String user);
}