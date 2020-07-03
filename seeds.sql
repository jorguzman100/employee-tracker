USE employeesDB;

INSERT INTO Departments (department_name) 
VALUES ('HR'), ('IT'), ('R&D'), ('Purchasing'), ('Sales'), ('Admin');

INSERT INTO Roles (title, salary, department_id) 
VALUES ('Recruiter', 15000, 1), ('Trainer', 15000, 1), ('Payroll', 12000, 1), ('HR Manager', 35000, 1),
('Web Developer', 25000, 2), ('UI Engineer', 20000, 2), ('Database Engineer', 12000, 2), ('IT Manager', 40000, 2),
('Engine Engineer', 20000, 3), ('Power Train Engineer', 20000, 3), ('Chasis Engineer', 20000, 3), ('R&D Manager', 37000, 3),
('Accessories Purchaser', 22000, 4), ('Main Parts Purchaser', 22000, 4), ('Interior Parts Purchaser', 22000, 4), ('Purchasing Manager', 37000, 4),
('North Sales', 30000, 5), ('South Sales', 30000, 5), ('East Sales', 30000, 5), ('Sales Manager', 50000, 5),
('Control', 18000, 6), ('Accountant', 20000, 6), ('Finance', 22000, 6), ('Admin Manager', 35000, 6);

INSERT INTO Employees (first_name, last_name, role_id, manager_id) 
VALUES ('Juan', 'García', 1, 4), ('Karla', 'Anda', 2, 4), ('Alma', 'Rivera', 3, 4), ('Pamela', 'Santos', 4, NULL),
('Susana', 'Morales', 5, 8), ('Andrea', 'Carrasco', 6, 8), ('Laura', 'Cabrera', 7, 8), ('Humberto', 'Rodríguez', 8, NULL),
('Peter', 'Arroyo', 9, 12), ('Arturo', 'Cortes', 10, 12), ('Viridiana', 'Gutiérrez', 11, 12), ('Miriam', 'González', 12, NULL),
('Edith', 'Marquez', 13, 16), ('Paulina', 'Rubio', 14, 16), ('Eduardo', 'Capetillo', 15, 16), ('Horacio', 'Obregón', 16, NULL),
('Thalía', 'Mendez', 17, 20), ('Emmanueal', 'Carbajal', 18, 20), ('Francisco', 'Mijares', 19, 20), ('Luis', 'Miguel', 20, NULL),
('Super', 'Man', 21, 24), ('Bat', 'Man', 22, 24), ('Iron', 'Man', 23, 24), ('Super', 'Woman', 24, NULL);

SELECT * FROM Departments;
SELECT * FROM Roles;
SELECT * FROM Employees;

-- SELECT *
-- FROM Employees
-- LEFT JOIN Roles ON Employees.role_id = Roles.role_id;

-- SELECT CONCAT(Employees.first_name, ' ', Employees.last_name) AS 'Name'
-- FROM Employees
-- LEFT JOIN Employees AS Managers ON Employees.manager_id = Managers.id;

-- SELECT *
-- FROM Roles
-- LEFT JOIN Departments ON Roles.department_id = Departments.department_id;

SELECT *
FROM Employees, Roles, Departments
WHERE Employees.role_id = Roles.role_id AND Roles.department_id = Departments.department_id;

-- id, name, title, department, salary, manager
-- SELECT id, first_name, last_name, role_id, title as 'role', department_id, salary, manager_id
-- FROM Employees, Roles, Departments
-- WHERE Employees.role_id = Roles.role_id AND Roles.department_id = Departments.department_id;

-- SELECT id, first_name, last_name, role_id, title, department_id, department_name, salary, manager_id
-- FROM Employees, Roles, Departments, Employees AS Managers
-- WHERE Employees.role_id = Roles.role_id AND Roles.departmnet_id = Departments.department_id AND Employees.manager_id = Managers.id;

-- Workbench
-- SELECT Employees.id, Employees.first_name, Employees.last_name, Employees.role_id, title, Roles.department_id, department_name, salary, 
-- Employees.manager_id, Managers.first_name, Managers.last_name
-- FROM Employees
-- LEFT JOIN Roles ON Employees.role_id = Roles.role_id
-- LEFT JOIN Departments ON Roles.department_id = Departments.department_id
-- LEFT JOIN Employees AS Managers ON Employees.manager_id = Managers.id;

-- Node
SELECT Employees.id, CONCAT(Employees.first_name, ' ', Employees.last_name) AS 'employee', 
Employees.role_id, title AS 'role', Roles.department_id, department_name AS 'department', 
salary as 'salary', Employees.manager_id, CONCAT(Managers.first_name, ' ', 
Managers.last_name) AS 'manager'
FROM Employees
LEFT JOIN Roles ON Employees.role_id = Roles.role_id
LEFT JOIN Departments ON Roles.department_id = Departments.department_id
LEFT JOIN Employees AS Managers ON Employees.manager_id = Managers.id;


SELECT * FROM Employees
WHERE manager_id = 8;

-- Running ok
SELECT Departments.department_id AS 'id', department_name AS 'department', 
CONCAT(Employees.first_name, ' ', Employees.last_name) AS 'employee', salary
FROM Departments
LEFT JOIN Roles ON Departments.department_id = Roles.department_id
LEFT JOIN Employees ON Employees.role_id = Roles.role_id;

-- Running ok
SELECT Departments.department_id AS 'id', department_name AS 'department', SUM(salary)
FROM Departments
LEFT JOIN Roles ON Departments.department_id = Roles.department_id
LEFT JOIN Employees ON Employees.role_id = Roles.role_id
GROUP BY Departments.department_id, department_name

-- SELECT Departments.department_id AS 'id', department_name AS 'department', 
-- CONCAT(Employees.first_name, ' ', Employees.last_name) AS 'employee', 
-- SUM(salary) as 'Total Budget'
-- FROM Departments
-- LEFT JOIN Roles ON Departments.department_id = Roles.department_id
-- LEFT JOIN Employees ON Employees.role_id = Roles.role_id
-- GROUP BY Departments.department_name




