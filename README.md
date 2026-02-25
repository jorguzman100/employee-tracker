# 🧑‍💼 Employee Tracker

### A clean terminal-based employee manager for quickly handling departments, roles, and people in a MySQL database.

Employee Tracker is a Node.js CLI app built for the classic “company org data” workflow, but with a smoother setup and a more practical project structure. It lets you manage employees, roles, and departments from the terminal without touching SQL every time.

---

## ✨ Features

| | Feature | What It Does |
|---|---|---|
| 👥 | Employee CRUD | Create, view, update, and delete employee records from prompts. |
| 🧩 | Role Management | Manage job titles, salaries, and department assignments. |
| 🏢 | Department Management | Add, edit, and remove departments directly from the CLI. |
| 👔 | Employees by Manager | Filter employees by `manager_id` to inspect reporting lines. |
| 💰 | Department Budget View | Shows total salary budget by department using SQL aggregation. |
| 🖥️ | Terminal-First UX | Inquirer menus + table output + ASCII banner make it easy to use. |

---

<p align="center">
  <img
    src="./Assets/employee-tracker.gif"
    alt="Employee Tracker CLI demo"
    width="680"
    style="border-radius: 12px; box-shadow: 0 10px 28px rgba(16, 24, 40, 0.18); object-position: top;"
  />
</p>

---

## 🛠️ Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=flat-square&logo=javascript&logoColor=F7DF1E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Inquirer](https://img.shields.io/badge/Inquirer.js-4B32C3?style=flat-square&logo=npm&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![mysql2](https://img.shields.io/badge/mysql2-Promise%20API-0A7EA4?style=flat-square)

---

## 🧩 Project Snapshot

- `employee.js`: CLI flow, prompts, menus, and table display logic.
- `lib/query.js`: builds CRUD SQL queries and runs them with `mysql2/promise`.
- `lib/loadEnv.js`: lightweight `.env` loader so local secrets stay out of source code.
- `schema.sql`: creates `Departments`, `Roles`, and `Employees` tables.
- `seeds.sql`: inserts sample data for quick testing and demos.
- `Assets/`: screenshots/GIF used in documentation.

---

## 🚀 Live Demo

![Deployment](https://img.shields.io/badge/Deployment-Not%20deployed%20yet-lightgrey?style=for-the-badge)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/jorguzman100/employee-tracker)

No public deployment yet. This project is ready to run locally now and is set up with env-based DB config for later deployment.

---

## 💻 Run it locally

Requirements:

- Node.js
- MySQL server running locally (or reachable host)

```bash
git clone https://github.com/jorguzman100/employee-tracker.git
cd employee-tracker
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
```

Create the database and seed it:

```bash
mysql -u root -p < schema.sql
mysql -u root -p < seeds.sql
```

Start the app:

```bash
npm start
```

CLI entry point:

- `employee.js` (runs through `npm start`)

<details>
<summary>🔑 Required environment variables</summary>

```env
# .env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employeesDB
```
</details>

---

## 📸 More Screens

<p align="center">
  <img src="./Assets/screenshot1.png" alt="Employee Tracker main view screenshot" width="700" />
</p>
<p align="center">
  <img src="./Assets/schema.png" alt="Database schema screenshot" width="700" />
</p>

---

## 🤝 Contributors

- **Jorge Guzman** · [@jorguzman100](https://github.com/jorguzman100)
