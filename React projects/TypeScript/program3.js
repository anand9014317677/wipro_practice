"use strict";
var Role;
(function (Role) {
    Role[Role["Admin"] = 0] = "Admin";
    Role[Role["User"] = 1] = "User";
    Role[Role["GuestUser"] = 2] = "GuestUser";
})(Role || (Role = {}));
// ENUM
let userRole = Role.Admin;
console.log(userRole);
// ARRAY
let marks = [45, 67, 34, 78];
console.log(marks);
// TUPLE
let user = [101, "Niti"];
console.log(user);
// ANOTHER TUPLE
let bookcode = [1001, "Java"];
console.log(bookcode);
// PUSH
bookcode.push(1002, ".Net");
console.log(bookcode);
// POP
bookcode.pop();
console.log(bookcode);
