# dc-frontend

A frontend project built primarily with JavaScript, React, and CSS, designed to provide a user-friendly interface for decision-making workflows.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Issues & Solutions](#issues--solutions)
  - [Frontend Issues](#frontend-issues)
  - [Backend Issues](#backend-issues)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**dc-frontend** is the client-side application for a decision support system. It allows users to register, log in, and interactively enter and evaluate alternatives and criteria to support structured decision processes.

---

## Tech Stack

This project uses the following technologies and libraries:

- **JavaScript** — Main programming language.
- **React** (^19.1.0) — For building dynamic user interfaces.
- **React DOM** (^19.1.0) — DOM bindings for React.
- **React Router DOM** (^7.6.1) — Client-side routing for React apps.
- **React Icons** (^5.5.0) — Icon library for React.
- **Axios** (^1.9.0) — Promise-based HTTP client for API requests.
- **CSS** — For styling (with likely Tailwind support via PostCSS).
- **Vite** (^6.3.5) — Fast development and build tool.
- **ESLint** (^9.25.0) — JavaScript/React code linting.
- **@vitejs/plugin-react-swc** (^3.9.0) — React plugin for Vite using SWC.
- **Tailwind/PostCSS** — Utility-first CSS with PostCSS integration.
- **TypeScript types** (for React) — Even if the codebase is JS, types are included for editor support.

---

## Getting Started

### Prerequisites

- Node.js (recommend v18+)
- npm or yarn

### Installation

```bash
git clone https://github.com/hyper-27/dc-frontend.git
cd dc-frontend
npm install
# or
yarn install
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

### Building for Production

```bash
npm run build
# or
yarn build
```

---

## Issues & Solutions

Below are common issues encountered in both the frontend and backend, along with their diagnosis and solutions.

### Frontend Issues

- **AxiosError: Request failed with status code 400 during Login/Registration**  
  Diagnosis/Solution: Frontend AuthContext or login/register components not sending Content-Type: application/json header.

- **Frontend console showed AxiosError: 400 but Network tab showed 200 OK for calculate-scores**  
  Diagnosis/Solution: Console error was stale; the actual problem was scores displaying as 0 on frontend due to missing backend data.

- **Scores not displaying or updating correctly on frontend after calculate-scores returned non-zero values**  
  Diagnosis/Solution: Frontend's `DecisionEditPage.jsx` needed to correctly update options and `decision.overallScore` states with the received data.

- **Lack of user input mechanism for individual alternative-criterion ratings**  
  Diagnosis/Solution: Implemented the "Ratings" input table UI, `handleRatingChange`, and `handleSaveRatings` logic in `src/pages/DecisionEditPage.jsx`.

---

### Backend Issues

- **Initial Login/Registration Backend Errors (e.g., 400 Bad Request, 500 Internal Server Error):**  
  Diagnosis/Solution: `authController.js` needed correct data validation, user creation, and proper error handling/responses.

- **Backend calculate-scores endpoint returning 400 Bad Request:**  
  Diagnosis/Solution: `decisionController.js` required robust validation for alternatives and criteria arrays before attempting calculations.

- **Calculated scores were always 0 on the backend, even with 200 OK status:**  
  Diagnosis/Solution: `decisionController.js`'s `calculateScores` relied on Rating documents, but no mechanism existed to save these ratings in the database.

- **ReferenceError: addAlternative is not defined in backend/routes/decisionRoutes.js:**  
  Diagnosis/Solution: `addAlternative` (and other CRUD functions for subdocuments) were missing from/not exported by `decisionController.js` when the file was replaced.

- **Lack of user input mechanism for individual alternative-criterion ratings (Backend Part):**  
  Diagnosis/Solution: Created Rating Mongoose model and implemented `addRatings/getRatings` in `decisionController.js` with corresponding API routes in `decisionRoutes.js`.

---

## Contributing

1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

---

## License

Specify your license here (MIT, Apache 2.0, etc).

---
