
const fs = require("fs");

const data = fs.readFileSync("employees.json", "utf8");
const employees = JSON.parse(data);

console.log("All employees:");
console.log(employees);

employees.push({
    id: 7,
    name: "Saim",
    department: "DAA"
});

fs.writeFileSync(
    "employees.json",
    JSON.stringify(employees, null, 2),
    "utf8"
);

console.log("Employee added successfully.");