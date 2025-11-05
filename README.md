A full-stack **Expense Tracker** application built with **React**, **Node.js**, **Express**, and **MongoDB**, designed to help users manage their expenses efficiently.

Local frontend Port :- 5173
Local Backend Port   :- 3000

expense-tracker/
│
├── apps/
│ ├── web/ # Frontend - React (Dashboard, Expenses, Profile pages)
│ └── api/ # Backend - Node.js, Express, MongoDB (Mongoose)
├── .env.example
└── README.md


Mongodb Models

1. users
2. expenses
3. sessions
4. category

Backend routes 
1. users auth routes
2. dashboard summary route
3. expenses routes (CRUD)
4. profile update route

Frontend pages
1. Signup page
2. Login page
3. Dashbord page
4. Expenses page
5. Profile page

start locally
backend start :- npm run dev
seed data :- npm run seed

fronend start :- npm run dev


Dashboard
- Overview of total income, expenses, and remaining balance.  
- Category-wise and date-wise summary of spending.  
- Visual representation with charts (e.g., pie or bar chart).

### 💸 Expenses Page
- Add, edit, or delete expenses.  
- Filter and search by date, category, or amount.  
- Pagination and sorting support.  
- Tagging and receipt upload support.

### 👤 Profile Page
- User details (name, email, etc.).  
- Option to update profile and password.  
- Personal preferences such as


github public repo :- https://github.com/Durgesh1037/expense-tracker/tree/main

apps/web :- Live url with vercel :- https://expense-tracker-zeta-teal.vercel.app/ 
