"use strict";
let employeeMap = new Map();
employeeMap.set(201, "Anand");
employeeMap.set(202, "Hemanth");
employeeMap.set(203, "Shyam");
console.log(employeeMap.get(201));
// ARRAY + LOOP
let products = ["Mobile", "Laptop", "Tablet"];
for (let product of products) {
    console.log("Product Name: " + product);
}
// OBJECT USING INTERFACE
let employeeData = {
    empId: 501,
    empName: "Anand",
    empSalary: 75000,
    calculateBonus() {
        return this.empSalary + this.empSalary * 0.05;
    }
};
// DISPLAY
console.log("Employee ID:", employeeData.empId);
console.log("Employee Name:", employeeData.empName);
console.log("Employee Salary:", employeeData.empSalary);
console.log("Salary After Bonus:", employeeData.calculateBonus());
// CLASS IMPLEMENTS INTERFACE
class Manager {
    salary;
    constructor(salary) {
        this.salary = salary;
    }
    showSalary() {
        console.log("Manager Salary:", this.salary);
    }
}
// OBJECT CREATION
let manager1 = new Manager(85000);
manager1.showSalary();
