# FinTrack: Your Personal Finance Command Center

## 🎥 Watch the Demo :
drive link: <https://drive.google.com/file/d/1Izu5JJQJ-Qho3g8iIisqj4oicoL56lad/view?usp=drive_link/>

(Or simply click on the image below to be redirected to the video)

[<img width="1817" height="829" alt="image" src="https://github.com/user-attachments/assets/6f44650f-52ba-4a47-a5b6-f2e2634aa6f7" />](<https://drive.google.com/file/d/1Izu5JJQJ-Qho3g8iIisqj4oicoL56lad/view?usp=drive_link/>)


<p align="center">
  <em>Clarity, control, and confidence in your financial life.</em>
</p>
<br>

FinTrack is a full-stack web application born from the need to simplify personal finance. It transforms the often-chaotic task of tracking expenses and managing accounts into a seamless, intelligent, and insightful experience. This isn't just another budgeting app; it's a tool designed to empower you to make smarter financial decisions.

---

## Features
What you can do with it:\
-Add your day-to-day transactions\
-Keep track of where you money is going through the analytics charts\
-Upload receipts and pdfs to import transaction data directly\
-Maintain multiple accounts such as current, savings , etc\

FinTrack is packed with features designed to provide a complete picture of your financial world.

#### - Intelligent Automation
**(Bonus Requirement )**: **AI-Powered PDF Import**: Drag and drop your PDF bank statements and transaction receipts and get the details added to the database automatically.
* **Smart Categorization:** Transactions imported via PDF are automatically categorized based on their description, saving hours of manual entry.
* Choose to edit/delete transactions.
* Take a look at interactive graphs and charts of your income and expenses, by categories, time, and other factors.

#### - Insightful Analytics & Visualization
* **Interactive Dashboard:** A central hub to visualize your cash flow, spending habits, and account balances at a glance with dynamic charts.
* **Advanced Data Interaction:** A powerful transaction table with multi-column sorting, instant search, and robust filtering to find exactly what you need.
* **Data Export:** Export your filtered views to `.xlsx` for your own records or for use in other applications.

#### - Effortless Management
* **Secure Authentication:** User accounts are protected with industry-standard authentication provided by Clerk.
* **Multi-Account Handling:** Seamlessly manage multiple checking, savings, or credit accounts in one place.
* **Bulk Operations:** Select and delete multiple transactions at once, with account balances recalculated automatically and accurately.

---

## Tech Stack

This project was built with a modern, scalable, and type-safe technology stack, prioritizing developer experience and application performance.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk"/>
  
</p>

* **Framework:** **Next.js** was chosen for its powerful full-stack capabilities, including Server Components and Server Actions, which streamline data fetching and mutations.
* **Database & ORM:** **Supabase** and **Prisma** provide a robust, type-safe foundation for all database operations, ensuring data integrity.
* **AI Integration:** **Google's Gemini API** is leveraged for its state-of-the-art multimodal understanding, allowing for flexible and intelligent parsing of financial documents.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18.0 or higher)
* A running PostgreSQL instance

### Local Setup

1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/sabved12/Finance.git]
    cd Finance
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    * Duplicate the example environment file:
        ```bash
        cp .env.example .env.local
        ```
    * Fill in the required keys in `.env.local` (see below).

4.  **Sync the Database:**
    * Push the Prisma schema to your database. This will create all the necessary tables.
        ```bash
        npx prisma db push
        ```

5.  **Run the App:**
    ```bash
    npm run dev
    ```
    Navigate to `http://localhost:3000`. You should be up and running!

---

## Environment Variables

This project requires the following environment variables to be set in your `.env.local` file:

```env
# Database Connection String
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME"
DIRECT_URL=""

# Clerk Authentication Keys (Get these from your Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Google Gemini API Key (Get this from Google AI Studio or Cloud Console)
GEMINI_API_KEY=AIza...
```

---

## Glimpses of the App

| Dashboard Overview                                      | Interactive Transaction Table                              |
| ------------------------------------------------------- | -------------------------------------------------------- |
<https://drive.google.com/file/d/1Izu5JJQJ-Qho3g8iIisqj4oicoL56lad/view?usp=drive_link/>
 | <img width="1883" height="820" alt="image" src="https://github.com/user-attachments/assets/57712f2f-8f05-49a5-9ac1-23f81d179700" />|
 <img width="1856" height="815" alt="image" src="https://github.com/user-attachments/assets/c1bfacdc-f40c-433c-8416-a94e36febdcc" />|
 <img width="1801" height="861" alt="image" src="https://github.com/user-attachments/assets/ef5a9fc6-d089-497a-8fb3-37db6a67c6e5" />|


|
