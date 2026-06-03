"use strict";
class Employee {
    id;
    name;
    salary;
    constructor(id, name, salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }
    display() {
        console.log(`
Employee ID: ${this.id}
Employee Name: ${this.name}
Employee Salary: ${this.salary}
---------------------------
`);
    }
}
let employees = [];
// ADD EMPLOYEES
employees.push(new Employee(1, "Anand", 50000));
employees.push(new Employee(2, "Hemanth", 45000));
employees.push(new Employee(3, "Shyam", 40000));
console.log("Employees After Adding");
console.log("========================");
for (let emp of employees) {
    emp.display();
}
// REMOVE EMPLOYEE
employees.splice(1, 1);
console.log("Employees After Removing");
console.log("========================");
for (let emp of employees) {
    emp.display();
}
// UPDATE EMPLOYEE
employees[1].name = "Admin";
employees[1].salary = 60000;
console.log("Employees After Updating");
console.log("========================");
for (let emp of employees) {
    emp.display();
}
