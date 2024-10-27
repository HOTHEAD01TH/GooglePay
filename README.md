Simple Banking App

A simple banking app built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to create accounts, deposit, withdraw, and view their transaction history.

## Features

- **User Authentication:** Users can register, login, and securely access their accounts.
- **Account Management:** Users can view their balance, deposit funds, and withdraw funds.
- **Transaction History:** Users can view a list of all transactions associated with their account.
- **Responsive Design:** The app is optimized for both desktop and mobile screens.

## Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens) for secure login and token-based sessions

## Installation

### Prerequisites

- Node.js
- MongoDB (local or cloud instance)

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/simple-banking-app.git
   cd simple-banking-app
   ```

2. **Install dependencies:**

   - Install backend dependencies:
     ```bash
     cd server
     npm install
     ```

   - Install frontend dependencies:
     ```bash
     cd ../client
     npm install
     ```

3. **Environment Setup:**

   - Create a `.env` file in the `server` directory with the following:
     ```
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. **Run the application:**

   - Start the backend server:
     ```bash
     cd server
     npm start
     ```

   - Start the frontend app:
     ```bash
     cd ../client
     npm start
     ```

5. **Access the app:**
   Open your browser and go to [http://localhost:3000](http://localhost:3000).

