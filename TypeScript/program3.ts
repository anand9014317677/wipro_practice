enum Role
{
    Admin,
    User,
    GuestUser
}

// ENUM

let userRole: Role = Role.Admin;

console.log(userRole);

// ARRAY

let marks : number[] = [45,67,34,78];

console.log(marks);

// TUPLE

let user : [number, string] = [101,"Niti"];

console.log(user);

// ANOTHER TUPLE

let bookcode : [number,string] = [1001 , "Java"];

console.log(bookcode);

// PUSH

bookcode.push(1002,".Net");

console.log(bookcode);

// POP

bookcode.pop();

console.log(bookcode);