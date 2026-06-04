"use strict";
class User {
    username;
    password;
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    input() {
        console.log("Input received successfully");
    }
    output() {
        console.log(`Username: ${this.username}`);
        console.log(`Password: ${this.password}`);
    }
}
let obj = new User("Anand", "12345");
obj.input();
obj.output();
