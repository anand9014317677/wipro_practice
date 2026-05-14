package com.company.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.bean.Employee;
import com.company.repo.EmployeeRepo;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    EmployeeRepo employeeRepo;

    @Override
    public Employee createEmployee(Employee employee) {

        return employeeRepo.save(employee);
    }

    @Override
    public Employee updateEmployee(Integer id, Employee employee) {

        Employee employee1 = null;

        Optional<Employee> empopt1 = employeeRepo.findById(id);

        if (empopt1.isPresent()) {

            employee1 = employeeRepo.save(employee);
        }

        return employee1;
    }

    @Override
    public void deleteEmployee(Integer id) {

        employeeRepo.deleteById(id);
    }

    @Override
    public Optional<Employee> getEmployeeById(Integer id) {

        return employeeRepo.findById(id);
    }

    @Override
    public List<Employee> getAllEmployees() {

        return employeeRepo.findAll();
    }
}