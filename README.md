# TaskLink

> **UniHack 2025 Hackathon Project**
>
> * **Track:** Private Services
> * **Result:** 🏆 **2nd Place Winner** 🏆
> * **Timeframe:** Built in 48 hours by a team of 3.

Our app tackles inefficiencies in the local job market by connecting talent with employers quickly. With ~68% of EU SMEs reporting skills shortages, and many job seekers struggling to find contract work, our platform makes hiring and job searching faster, simpler, and more effective.

---

## 🎯 The Problem

Many job seekers struggle to find relevant **contract or local positions**, feeling disconnected from opportunities in their immediate area. Simultaneously, small and medium enterprises (SMEs) face a significant **skills shortage**, hindering their growth and efficiency.

## 💡 Our Solution

We built a platform that directly bridges this gap.
* **For Job Seekers:** We provide tools to find nearby opportunities rapidly and build compelling, AI-enhanced CVs.
* **For Employers:** We offer a streamlined system to post jobs, manage applicants, organize teams, and assign tasks with ease.

This creates a more efficient, responsive, and effective local job ecosystem, benefiting both individuals and the community economy.

---

## ✨ Key Features

### For Job Seekers (Users)

* **User Home Page:** A clean dashboard showing available jobs (matched by our algorithm) and all assigned tasks with their status.
* **AI-Enhanced CV Builder:** Leverages AI (Google Gemini) to help users craft custom resumes, analyzing uploaded documents and job-specific details to highlight their experience perfectly.
* **AI Assistant (Premium):** A pre-trained AI assistant that proactively recommends the most relevant job opportunities based on location, skills, company relevance, and job description.
* **Interactive Job Map (Premium):** A clear, intuitive map (Google Maps API) that allows users to visually discover companies in their area that are actively hiring.
* **Chat & Teams:** Built-in instant messaging (via WebSockets) to communicate directly with employers and any assigned team members.
* **Task Management:** View current tasks with user-friendly, color-coded status and importance levels.

### For Employers (Businesses)

* **Business Home Page:** An intelligible overview of all ongoing job listings, allowing employers to instantly assess their recruitment landscape.
* **Job & Applicant Management:** Easily post new job vacancies and manage the entire applicant pipeline (e.g., send application, accept application).
* **Team Creation & Chat:** Create structured teams composed of employees and maintain consistent communication through integrated group and individual chats.
* **Task Assignment:** Assign tasks to specific employees and effortlessly track their progress and completion status.

---

## 🛠️ Tech Stack

* **Frontend:** React
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Real-time Chat:** WebSockets (Socket.io)
* **AI Features:** Google Gemini
* **Maps & Geocoding:** Google Cloud Maps API
* **Deployment:** Railway

---

## ⚙️ Getting Started (How to Run)

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18.x or later)
* npm
* MongoDB Atlas account (or local MongoDB instance)
* Google API keys (Gemini & Geocode)

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/](https://github.com/)[your-username]/[your-repo-name].git
    ```
2.  **Install NPM packages**
    * This project is set up to install all dependencies from the root directory.
    ```sh
    npm install
    ```
3.  **Set up Environment Variables**

    You will need to create two `.env` files: one in the `server` (or root, depending on your setup) directory and one in the `client` directory.

    * Create `.env` in the **server/backend** directory:
        ```.env
        GEMINI_API_KEY=your_google_gemini_api_key
        JWT_SECRET_KEY=your_strong_jwt_secret
        MONGO_URI=your_mongodb_connection_string
        NODE_ENV=development
        VITE_GEMINI_API_KEY=your_google_gemini_api_key_for_client
        VITE_GEOCODE_API_KEY=your_google_maps_geocoding_api_key
        ```

### Running the App

1.  **Build the application**
    * This command should build the React frontend and place it in the server's public folder (or similar, based on your build script).
    ```sh
    npm run build
    ```
2.  **Start the server**
    * This command starts the backend server, which will also serve the static frontend files.
    ```sh
    npm run start
    ```

Your application should now be running on `http://localhost:[YOUR_PORT]`.

---

## 👥 The Team

This project was brought to life in 48 hours by:

* **Rădulescu Alexandu Marius** - Backend+Frontend
* **Moldonvan Dennis** - Backend+Frontend
* **Moldovan Alexis** - 
