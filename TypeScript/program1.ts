class Student {

    name: string;
    age: number;

    constructor(name: string, age: number) {

        this.name = name;
        this.age = age;

    }

    display(): void {

        console.log(`Student Name: ${this.name}, Age: ${this.age}`);

    }
}

let s1 = new Student("Anand", 21);
let s2 = new Student("Hemanth", 22);
let s3 = new Student("Shyam", 20);

s1.display();
s2.display();
s3.display();