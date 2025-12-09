# 🎓 Student Management System

A powerful, lightweight web-based **Student Management System (SMS)** featuring a responsive dashboard, role-based access control, smart analytics, and complete local data storage.
Built using **HTML, CSS, and vanilla JavaScript**, it runs entirely in the browser without requiring any backend—making it a perfect serverless solution for student record management.

---

## 🔗 Live Demo

🚀 **Try the Application:**
https://student-management-system-peach-kappa.vercel.app/

---

## 📦 GitHub Repository

🔗 **View Source Code:**
https://github.com/YARLAGADDA-ARUN-KUMAR/student-management-system.git

---

# ⚡ Features Overview

## 🔐 Role-Based Access Control (RBAC)

The system includes **three roles**, each with specific permissions:

### 👑 Admin

-   Full access to all features
-   Add/Edit/Delete student records
-   Create/manage Staff & User accounts
-   View complete activity logs
-   Backup all student data as JSON

### 🧑‍🏫 Staff

-   View all student records
-   Update student marks
-   Cannot delete students
-   Cannot manage users

### 👤 User

-   Read-only access
-   View students, marks, and statistics
-   Cannot edit or modify anything

---

## 📊 Dashboard & Analytics

The system provides real-time insights:

### 📈 Statistics Hub

-   Total number of students
-   Class average
-   Highest score
-   Lowest score

### 📉 Grade Distribution

-   Auto-generated bar chart of grades
-   Categorized as: A+, A, B, C, D, F

### 🗂️ Activity Logs (Admin Only)

Tracks:

-   User logins
-   Data modifications (add/update/delete)
-   Timestamp for each activity

---

## 📝 Student Management

### Full CRUD Features

-   Add new student
-   Edit student details
-   Delete student records
-   View detailed list of all students

### Smart Search

Search instantly by:

-   Student Name
-   Roll Number

### Sorting

Sort students by:

-   Roll No
-   Name
-   Marks (Ascending/Descending)

### Range Filter

Filter students by marks:

-   Example: **Show students scoring between 80–100**

### Auto-Grading System

Grades are automatically assigned:

-   A+, A, B, C, D, F

---

## ⚙️ Utilities & System Tools

### 💾 Local Data Persistence

-   Uses `localStorage` to save all student and user data
-   Data stays even after page refresh
-   `sessionStorage` used for session-based login

### 👥 User Management (Admin)

-   Create Staff or User accounts
-   Reset or modify existing users

### 📤 Data Backup

-   Export all records as a **JSON** backup file

---

# 🛠️ Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | HTML5                               |
| Styling  | CSS3 (Flexbox, Grid, Responsive UI) |
| Logic    | JavaScript (ES6+)                   |
| Storage  | localStorage, sessionStorage        |
| Icons    | Font Awesome 6.4.0                  |

---

# 📂 Project Structure

```text
student-management-system/
├── index.html        # Login Page
├── portal.html       # Main Dashboard
├── style.css         # All Styling & Responsive Layouts
├── script.js         # Core Logic, CRUD, Auth, RBAC, DOM Manipulation
└── README.md         # Documentation
```
