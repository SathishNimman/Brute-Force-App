#  Brute-Force Login Application

A full-stack login system with brute-force protection using user and IP-based lockout logic.

##  Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)


---

##  Features

- User registration & login
- Suspends user after 5 failed logins in 5 mins (15 min lock)
- Blocks IP after 100 failed attempts in 5 mins
- Real-time feedback for blocked/suspended logins

---

##  Setup Instructions

### Backend (server)

```bash
cd server
npm install
# Add your MongoDB URI to .env
npm run dev
