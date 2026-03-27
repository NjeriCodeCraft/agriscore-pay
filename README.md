# 🌾 AgriScore-Pay
### Buy Now, Pay at Harvest — Agricultural Credit Powered by ML & Interswitch

> Built for the Interswitch × Enyata Hackathon 2026

---

## 🚀 The Problem

Smallholder farmers across Nigeria need seeds, fertilizer, and equipment **before** planting season — but they don't get paid until **after** harvest. Banks won't lend to them because they have no credit history.

**Result:** Farmers buy less, plant less, earn less. Every season.

---

## 💡 Our Solution

AgriScore-Pay gives farmers access to crop inputs **today** and lets them repay **after harvest** — using an ML credit scoring engine to assess risk, and Interswitch to power secure payments.

**No bank account required. No collateral. Just your farm data.**

---

## ✨ How It Works

| Step | What Happens |
|------|-------------|
| 1️⃣ Register | Farmer creates an account with basic details |
| 2️⃣ Apply | Fills in farm size, crop type, yield history |
| 3️⃣ ML Score | Our model calculates an AgriScore instantly |
| 4️⃣ Shop | Approved farmers buy inputs from the marketplace on credit |
| 5️⃣ Repay | After harvest, repay securely via Interswitch |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Next.js API Routes |
| ML Model | Python, FastAPI, scikit-learn |
| Payments | Interswitch Bills Payment API |
| Identity | Interswitch Passport Verification API |
| Deployment | Vercel |

---

## 🔌 Interswitch Integration

We integrate two Interswitch APIs:

- **Bills Payment API** — processes farmer repayments to vendors securely at harvest time
- **International Passport Verification API** — verifies farmer identity during registration to reduce fraud

---

## 🧠 ML Credit Scoring Model

Our AgriScore engine analyses:
- Farm size (hectares)
- Primary crop type
- Years of farming experience
- Last season yield (kg)
- Soil type & irrigation availability
- Existing loan history

Returns a score from 0–850 with an approved credit limit and risk level.

> Model built with Python + scikit-learn, served via FastAPI endpoint.

---

## 📱 Pages & Features

- **Landing Page** — product overview and onboarding
- **Auth** — register / login
- **Dashboard** — credit score, limit, active loans overview
- **Apply for Credit** — farm details form + instant ML scoring
- **Marketplace** — browse farm inputs available on credit
- **Repayment Tracker** — track loans and repay via Interswitch

---

## 🏃 Running Locally

```bash
# Clone the repo
git clone https://github.com/NjeriCodeCraft/agriscore-pay
cd agriscore-pay

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Interswitch sandbox keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

```env
INTERSWITCH_CLIENT_ID=your_client_id
INTERSWITCH_SECRET_KEY=your_secret_key
INTERSWITCH_BASE_URL=https://sandbox.interswitchng.com
```

---

## 👥 Team

| Name | Role | Contribution |
|------|------|-------------|
| Faith Njeri | Full-Stack Developer | Frontend, backend API routes, Interswitch integration, deployment |
| [Friend's Name] | Data Scientist | ML credit scoring model, Python API, risk assessment algorithm |

---

## 🏆 Hackathon

**Event:** Interswitch × Enyata Hackathon 2026
**Category:** Agriculture (A) + AI/Emerging Technology
**Theme:** Buy Now, Pay at Harvest
**Submitted:** March 2026

---

*Powered by Interswitch · Built with ❤️ for African farmers*