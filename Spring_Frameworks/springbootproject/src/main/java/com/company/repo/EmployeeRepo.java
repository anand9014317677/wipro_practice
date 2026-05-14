package com.company.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.bean.Employee;

public interface EmployeeRepo extends JpaRepository<Employee, Integer> {

}