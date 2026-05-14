package com.company.service;

import java.util.List;
import java.util.Optional;

import com.company.bean.Employee;

public interface EmployeeService {

    public Employee createEmployee(Employee employee);

    public Employee updateEmployee(Integer id, Employee employee);

    public void deleteEmployee(Integer id);

    public Optional<Employee> getEmployeeById(Integer id);

    public List<Employee> getAllEmployees();
}