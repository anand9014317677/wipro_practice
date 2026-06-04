let employeeMap = new Map<number, string>();

employeeMap.set(201, "Anand");
employeeMap.set(202, "Hemanth");
employeeMap.set(203, "Shyam");

console.log(employeeMap.get(201));

// ARRAY + LOOP

let products = ["Mobile", "Laptop", "Tablet"];

for(let product of products)
{
    console.log("Product Name: " + product);
}

// INTERFACE

interface employeeDetails
{
    empId:number;
    empName:string;
    empSalary:number;

    calculateBonus():number;
}

// OBJECT USING INTERFACE

let employeeData : employeeDetails = {

    empId:501,
    empName:"Anand",
    empSalary:75000,

    calculateBonus() : number
    {
        return this.empSalary + this.empSalary * 0.05;
    }
}

// DISPLAY

console.log("Employee ID:", employeeData.empId);
console.log("Employee Name:", employeeData.empName);
console.log("Employee Salary:", employeeData.empSalary);
console.log("Salary After Bonus:", employeeData.calculateBonus());

// INTERFACE

interface companySalary
{
    salary:number;

    showSalary():void;
}

// CLASS IMPLEMENTS INTERFACE

class Manager implements companySalary
{
    constructor(public salary:number){}

    showSalary()
    {
        console.log("Manager Salary:", this.salary);
    }
}

// OBJECT CREATION

let manager1 = new Manager(85000);

manager1.showSalary();