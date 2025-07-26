# Mini CRM - Next.js & MongoDB

A full-stack Mini CRM (Customer Relationship Management) platform built with Next.js, TypeScript, and MongoDB. The platform supports Admin and Salesperson roles for effective lead management.

## Features

-   **Authentication:** Secure login/registration for Admins and Salespersons.
-   **Role-Based Access:** Protected routes and APIs based on user roles.
-   **Lead Management:** Salespersons can CRUD their own leads.
-   **Admin Dashboard:** Admins can view analytics and manage all leads.
-   **Private Notes:** Admins can leave private notes for salespersons on specific leads.

## Tech Stack

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **Database:** MongoDB with Mongoose
-   **Authentication:** NextAuth.js
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui
-   **Form Management:** React Hook Form with Zod
-   **Data Fetching:** TanStack Query (React Query)

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   MongoDB instance (local or cloud like MongoDB Atlas)

### Setup & Installation

1.  **Clone the repository:**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file by copying the `.env.example` file.
    ```bash
    cp .env.example .env.local
    ```
    Update the `MONGODB_URI` and `NEXTAUTH_SECRET` in your `.env.local` file.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## Dummy Credentials

You can register new users or use the following pre-configured credentials to log in:

-   **Admin:**
    -   **Email:** `admin@example.com`
    -   **Password:** `password123`
-   **Salesperson:**
    -   **Email:** `sales@example.com`
    -   **Password:** `password123`

*(Note: You will need to create these users in your database first. A seeding script can be created for this purpose.)*