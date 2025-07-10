# SakhiSaathi Frontend

Welcome to the **SakhiSaathi** frontend! This is the React-based web application for the PeriodPal project, designed to empower users with tools for period tracking, hormonal health insights, community support, and more.

---

## Why Use SakhiSaathi?

SakhiSaathi is designed to support and empower individuals in managing their menstrual and hormonal health with confidence and ease. Here’s why this product is valuable:

- **Personalized Health Tracking:** Track periods, symptoms, moods, and cycles to gain insights into your unique patterns and well-being.
- **Science-Backed Insights:** Visualize hormone and mood cycles, helping you understand your body better and make informed decisions.
- **Community Support:** Connect with others, share experiences, and seek advice in a safe, supportive forum.
- **AI Health Companion:** Get instant, reliable answers to menstrual health questions with an integrated AI chatbot.
- **Emergency Preparedness:** Manage emergency contacts for quick alerts and peace of mind.
- **Inclusive & User-Friendly:** Designed for all users, with a focus on privacy, accessibility, and a seamless experience across devices.
- **Partner Collaboration:** Share cycle information with partners to foster understanding and support.
- **Proactive Health Tools:** Includes a PCOS risk checker and educational resources to promote proactive health management.

```bash
SakhiSaathi is more than just a tracker—it's your companion for holistic menstrual health, community, and empowerment.
```

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Key Pages & Components](#key-pages--components)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Period Tracker:** Log daily symptoms, moods, and period details.
- **Cycle Insights:** Visualize mood and hormone cycles.
- **Community Forum:** Create posts, comment, react, and engage with others.
- **AI Health Companion:** Chat with an AI for health-related queries.
- **Emergency Settings:** Manage emergency contacts.
- **User Profiles:** Edit profile, view activity, and manage posts.
- **PCOS Risk Checker:** Assess risk with a simple questionnaire.
- **Partner Sync:** Share cycle info with a partner.
- **Responsive Design:** Works on desktop and mobile.

---

## Project Structure

```bash
src/
├── App.jsx
├── main.jsx
├── App.css
├── index.css
│
├── assets/
│
├── components/
│ ├── Layout.jsx
│ ├── HormoneTwin.jsx
│ ├── MoodCycleGraph.jsx
│ └── community/
│ ├── PostCard.jsx
│ ├── Comment.jsx
│ └── CreatePostModal.jsx
│
├── contexts/
│ └── CommunityContext.jsx
│
├── hooks/
│ └── useCommunity.jsx
│
├── pages/
│ ├── Dashboard.jsx
│ ├── Education.jsx
│ ├── EmergencySetting.jsx
│ ├── GPTCompanion.jsx
│ ├── Homepage.jsx
│ ├── InsightsPage.jsx
│ ├── LoginPage.jsx
│ ├── NextPeriodPredictor.jsx
│ ├── PartnerSync.jsx
│ ├── PcosRiskChecker.jsx
│ ├── PeriodTracker.jsx
│ ├── RegisterPage.jsx
│ ├── TrackerForm.jsx
│ ├── UserProfile.jsx
│ └── UserSelfPosts.jsx
│
├── pages/community/
│ ├── CommunityHome.jsx
│ ├── PostDetail.jsx
│ └── UserProfile.jsx
│
└── services/
└── ... (API and utility services)

```

---


---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/periodpal-frontend.git
   cd periodpal-frontend

   ```
2.  **Install dependencies:**

```bash
npm install
# or
yarn install

```

3. **Set up environment variables:**

```bash
Copy .env.example to .env and fill in the required values (see Environment Variables).

```

4. **Start the development server:**

```bash
npm run dev
# or
yarn dev

```

5. **Open in your browser:**
```bash
Visit http://localhost:5173 (or the port shown in your terminal).

```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory of your project with the following key:


- `VITE_API_URL`: The base URL used by the frontend to interact with the backend API.

> ⚠️ All environment variables must be prefixed with `VITE_` when using Vite.

---

## 📌 Key Pages & Components

### 🏠 Homepage
- **Path**: `pages/Homepage.jsx`
- Description: The landing page showcasing features, testimonials, and FAQs.

### 🔐 Register & Login
- **Paths**: `pages/RegisterPage.jsx`, `pages/LoginPage.jsx`
- Description: User authentication with secure token handling.

### 📊 Dashboard
- **Path**: `pages/Dashboard.jsx`
- Description: User overview including quick access to health insights, mood trends, and reminders.

### 🩸 Period Tracker
- **Path**: `pages/TrackerForm.jsx`
- Description: Daily period, symptom, and mood tracking form.

### 🧠 AI Health Companion
- **Path**: `pages/GPTCompanion.jsx`
- Description: Chat-based assistant offering personalized menstrual health advice.

### 🫂 Community Forum
- **Paths**:
  - Forum Home: `pages/community/CommunityHome.jsx`
  - Components: `components/community/`
- Description: Engage with other users via posts, comments, and reactions.

### 👤 User Profile
- **Path**: `pages/UserProfile.jsx`
- Description: Manage personal details, view self-posts and activity.

### 🚨 Emergency Settings
- **Path**: `pages/EmergencySetting.jsx`
- Description: Add and manage emergency contacts for alert triggers.


---

## 🤝 Contributing

We welcome contributions to **SakhiSaathi**! Follow these steps to get started:

### 🛠 How to Contribute

```bash
# 1. Fork the repository
git clone https://github.com/your-username/sakhisaathi-backend.git
cd sakhisaathi-backend

# 2. Create a new branch for your feature or fix
git checkout -b feature/your-feature-name

# 3. Make your changes, then stage and commit
git add .
git commit -m "feat: Add a clear, concise commit message"

# 4. Push your branch to your fork
git push origin feature/your-feature-name
```


---

### 📬 Submit a Pull Request
1. Go to your fork on GitHub.

2. Click "Compare & pull request".

3. Add a clear description of what you’ve done.

4. Wait for review, and collaborate if changes are requested.

---

### 📄 License
- This project is licensed under the MIT License.

---


#### 🤝 Contributing
* Pull requests are welcome!
* For major changes, please open an issue first to discuss what you’d like to modify.

##### Made with ❤️ for women's health and empowerment.


