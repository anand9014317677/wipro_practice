class User {

    username: string;
    password: string;

    constructor(username: string, password: string) {

        this.username = username;
        this.password = password;

    }

    input(): void {

        console.log("Input received successfully");

    }

    output(): void {

        console.log(`Username: ${this.username}`);
        console.log(`Password: ${this.password}`);

    }
}

let obj = new User("Anand", "12345");

obj.input();

obj.output();