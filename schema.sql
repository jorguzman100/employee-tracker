DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NULL,
  PRIMARY KEY (department_id)
);

CREATE TABLE role (
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(9, 2) NULL,
  department_id INT,
  PRIMARY KEY (role_id),
  FOREIGN KEY (department_id) REFERENCES department (department_id)
);

CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (employee_id),
  FOREIGN KEY (role_id) REFERENCES role (role_id),
  FOREIGN KEY (manager_id) REFERENCES employee (employee_id)
);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;

SELECT first_name, last_name, title, salary
FROM employee
LEFT JOIN role ON employee.role_id = role.role_id;

SELECT title, department_name
FROM role
LEFT JOIN department ON role.department_id = department.department_id;