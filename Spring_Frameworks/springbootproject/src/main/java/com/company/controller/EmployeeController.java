package com.company.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.bean.Employee;
import com.company.service.EmployeeService;


@RestController
@RequestMapping("/empapi")


public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // ADD EMPLOYEE
    @PostMapping("/add")
    public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee) {

        Employee emp = employeeService.createEmployee(employee);

        return new ResponseEntity<>(emp, HttpStatus.OK);
    }

    // VIEW ALL EMPLOYEES
    @GetMapping("/viewall")
    public ResponseEntity<List<Employee>> viewAllEmployees() {

        List<Employee> empList = employeeService.getAllEmployees();

        return new ResponseEntity<>(empList, HttpStatus.OK);
    }

    // VIEW EMPLOYEE BY ID
    @GetMapping("/view/{id}")
    public ResponseEntity<Employee> viewEmployee(@PathVariable Integer id) {

        ResponseEntity<Employee> empResponseEntity = null;

        Optional<Employee> emp = employeeService.getEmployeeById(id);

        if (emp.isPresent()) {

            empResponseEntity =
                    new ResponseEntity<>(emp.get(), HttpStatus.OK);

        } else {

            empResponseEntity =
                    new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return empResponseEntity;
    }

    // DELETE EMPLOYEE
    @DeleteMapping("/delete{id}")
    public ResponseEntity deleteEmployee(@PathVariable Integer id) {

        employeeService.deleteEmployee(id);

        return new ResponseEntity<>(
                "The id is deleted successfully",
                HttpStatus.OK);
    }

    // UPDATE EMPLOYEE
    @PutMapping("/update/{id}")
    public ResponseEntity updateEmployee(
            @PathVariable Integer id,
            @RequestBody Employee employee) {

        employeeService.updateEmployee(id, employee);

        return new ResponseEntity<>(
                "The data is updated successfully",
                HttpStatus.OK);
    }
}