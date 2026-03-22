# Cinefy - Cinema Management and Booking System

## Overview
Cinefy is a comprehensive full-stack web application designed for cinema operations. It provides a robust backend for administrators to manage movie catalogs, theater halls, and showtimes, alongside a seamless, interactive frontend for customers to browse movies, select seats, and finalize bookings.

## Tech Stack
-   **Frontend:** Next.js (React), CSS modules/Inline Styling
-   **Backend:** Node.js, Express.js
-   **Database:** PostgreSQL (via Supabase) with Prisma ORM
-   **Authentication:** JSON Web Tokens (JWT), Role-Based Access Control (RBAC)

## Core Features
### Customer Portal
-   **Authentication:** Secure registration and login flows.
-   **Movie Catalog:** Browse trending and available movies with metadata (duration, genre, poster).
-   **Dynamic Showtimes:** View scheduled shows grouped by theater location and filtered by date.
-   **Interactive Seat Selection:** Real-time visual seat mapper indicating availability, with dynamic pricing.
-   **Booking Management:** Dedicated dashboard to view historical and active reservations.

### Administration Command Center
-   **Role-Based Security:** Protected API routes restricted specifically to accounts with `ADMIN` privileges.
-   **Global Dashboard:** Live statistical overview of total movies, tickets purchased, and gross revenue, backed by a master transaction log.
-   **Data Management (CRUD):** 
    -   **Movies:** Add, update, and remove movie entries.
    -   **Theaters:** Register venues and available hall counts.
    -   **Shows:** Schedule movie viewings matching movies to theaters, defining start times, and establishing ticket prices.

## Project Structure
The repository is split into two primary environments:
-   `/client`: The Next.js frontend application.
-   `/server`: The Node.js/Express RESTful API.

## Environment Variables
Create a `.env` file in the `/server` directory and define the following variables:
```env
PORT=5000
DATABASE_URL="your_postgresql_database_connection_string"
JWT_SECRET="your_secure_random_string_here"
```

Create a `.env.local` file in the `/client` directory if required, and ensure the API URL maps to the local server (or deployed environment):
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## Local Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Cinefy
   ```

2. **Initialize the Backend**
   Navigate to the server directory, install dependencies, and synchronize the database schema:
   ```bash
   cd server
   npm install
   npx prisma db push
   node server.js
   ```

3. **Initialize the Frontend**
   In a separate terminal, navigate to the client directory, install dependencies, and start the development server:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend Client: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api/health`

## Admin Promotion (CLI Utility)
To grant an existing user administrative privileges, execute the promotion script from the server directory:
```bash
node promote_admin.js "user@example.com"
```
*Note: Ensure the target user has already registered an account via the frontend before running the promotion script.*
