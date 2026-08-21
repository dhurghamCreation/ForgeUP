#  ForgeUp — Your All-in-One Fitness Companion

> **Forge your strongest self.** ForgeUp is a beautifully crafted, feature-rich fitness application that brings your entire training journey into one place — from intelligent workout logging and AI voice coaching to recovery analytics, nutrition tracking, and a thriving community.

**Designed & built by [Dhurgham Alsaadi](https://forgeup-lwon9lqvu-dhurgham-s-projects.vercel.app/)** · Powered by React, Vite, Tailwind CSS & Firebase

---

##  What is ForgeUp?

ForgeUp isn't just another workout tracker. It's a **complete training ecosystem** that treats fitness as a lifestyle — not a chore. Whether you're a beginner taking your first steps or an advanced lifter chasing new personal records, ForgeUp adapts to you with a warm, human, and earthy design language that makes every rep count.

Built as a **mobile-first experience**, ForgeUp combines **science-backed training science, smart progression suggestions, and a real-time community** — all wrapped in a clean, modern interface.

---

##  Key Features

###  Smart Training
- **Interactive Workout Logger** — Log sets, reps, and weight with a built-in **rest timer**, haptic feedback, and sound effects (set-complete chime, rest alert, workout fanfare).
- **Animated Exercise Demos** — Every exercise comes with a custom SVG animation showing the movement, with equipment that moves *with* the body.
- **Smart Progression Suggestions** — ForgeUp analyzes your history and suggests the next weight to attempt (e.g. *"+2.5kg on bench vs last session"*).
- **Plate Calculator** — Instantly see exactly which plates to load on each side of the bar.
- **Muscle Activation Map** — A detailed body map showing which muscles you're working and how hard.

###  AI Voice Coach
- **Hands-free training** with the Web Speech API — speak naturally and the coach understands.
- Log weights, set rest timers, get **exercise form tips**, request motivation, and control your workout — all by voice.
- A rich **intent-recognition engine** with dozens of commands, plus quick-command chips and a full conversation history.

###  Analytics & Recovery
- **Recovery & HRV Analytics** — Track heart rate variability, resting HR, and sleep to compute a **Readiness Score** that tells you whether to go hard, train normal, or take a rest day.
- **Auto Recovery Mode** — Automatically adjusts your suggested session based on your readiness.
- **Periodization Blocks** — Follow structured training blocks (Hypertrophy, Strength Peak, Power, Endurance) with week-by-week progression, intensity, and volume guidance.
- **Training Plan Builder** — Design your perfect program: pick a split (Push/Pull/Legs, Upper/Lower, Full Body, Bodybuilding, Arnold), set weekly frequency, choose a progression style, and auto-generate your plan.
- **Weekly load charts** and **muscle activation ranges** to visualize your progress.

###  Nutrition & Body Tracking
- **Nutrition & Macros** — Log meals from a database of 28+ foods, track calories, protein, carbs, and fat against your daily goals.
- **Meal Plans** — Choose from Lean Builder, Hard Bulk, Shred & Cut, or Maintain, each with a full sample day.
- **Weight & BMI** — Track your weight, height, and BMI with color-coded health categories.
- **Body Measurements** — Log waist, chest, and arms over time with weight trend charts.

###  Community
- **Social Feed** — Share your workouts, give kudos, and comment on other lifters' achievements.
- **Challenges** — Join group challenges (30-Day Push-Up, Plank Master, Hydration Streak, 100 Squats) and stay accountable.
- **Leaderboard** — Compete on weekly lifting volume and streaks. Only real users who opt in appear — no fake entries.

###  Personalization
- **6 Languages** — English, Español, Français, Deutsch, Italiano, Português — switch instantly.
- **Onboarding** — Tell us your gender, main goal, and body type to personalize your experience.
- **Achievement Badges** — Earn badges like First Steps, Centurion, Heavy Lifter, Week Warrior, and Fortnight Forge.
- **Background Music** — Real MP3 workout tracks plus synthesized lo-fi/energy/calm options.
- **Wearable-style health sync** — Log daily steps, sleep, heart rate, and active calories.

###  Secure & Private
- **Full authentication** — Email/password with strong password validation, Google Sign-In, and password reset.
- **Works out of the box with zero configuration** — a built-in local auth + data engine (SHA-256 hashed) means you can sign up and use the app instantly, with no API keys.
- **Optional Firebase cloud sync** — add your config and everything syncs across devices and users.

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [React 19](https://react.dev) |
| **Build Tool** | [Vite 8](https://vitejs.dev) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) + custom design tokens |
| **Charts** | [Recharts 3](https://recharts.org) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Backend / Auth** | [Firebase](https://firebase.google.com) (Auth, Firestore) + local fallback engine |
| **Fonts** | Space Grotesk, Inter, JetBrains Mono |
| **Linting** | [Oxlint](https://oxc.rs) |

---

##  Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) 18+ and npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dhurghamCreation/ForgeUP.git
cd ForgeUP

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser. **That's it** — ForgeUp works fully out of the box with local accounts and local data persistence. No API keys required.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint on the codebase |

---

##  Enabling Cloud Sync (Optional)

ForgeUp runs 100% free with zero setup using its built-in local engine. To enable **cloud sync** and **real community features** (shared feed, comments, leaderboard, cross-device data):

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password + Google) and **Cloud Firestore**
3. Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Restart the dev server. The app automatically detects the config and upgrades to full cloud mode.

---

##  Project Structure

```
fitnessApp/
├── public/
│   ├── music/              # MP3 workout tracks
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── parts/
│   │   ├── AuthScreen.jsx          # Login / Signup / Password reset
│   │   ├── TrainingPlanBuilder.jsx # Split + frequency + progression builder
│   │   ├── Periodization.jsx       # Structured training blocks
│   │   ├── RecoveryAnalytics.jsx   # HRV / readiness score
│   │   ├── VoiceCoach.jsx          # AI voice coach engine
│   │   └── SocialFeed.jsx          # Feed, challenges, leaderboard
│   ├── App.jsx                     # Main app — all screens & logic
│   ├── firebase.js                 # Auth + data layer (local & cloud)
│   ├── i18n.js                     # 6-language translations
│   ├── index.css                   # Tailwind + custom animations
│   └── main.jsx                    # Entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

##  Design Philosophy

ForgeUp uses a **natural, human, earthy palette** — warm off-whites, deep charcoal text, and accents of blue, green, gold, and red that each carry meaning:

-  **Blue** — primary actions & focus
-  **Green** — success, recovery, healthy states
-  **Gold** — achievements, goals, rewards
-  **Red** — intensity, warnings, effort

Every interaction is tactile: buttons **lift** on hover, **pop** when tapped, and **pulse** when active. Sound and haptic feedback make the app feel alive, turning every set into a small victory.

---

##  Achievements & Badges

| Badge | Requirement |
|-------|-------------|
|  First Steps | Complete your first workout |
|  Centurion | Log 100 workouts |
|  Heavy Lifter | Hit 100kg on any lift |
|  Week Warrior | 7-day streak |
|  Fortnight Forge | 14-day streak |

---

##  Roadmap Ideas

- Native mobile build (React Native / Capacitor) for true push notifications & wearable sync
- More exercise demos and video content
- Advanced periodization with deload auto-scheduling
- Social challenges with real-time progress tracking
- Expanded food database with barcode scanning

---

##  Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/dhurghamCreation/ForgeUP/issues) or open a pull request.

---

##  License

This project is for personal and educational use. All rights reserved © Dhurgham Alsaadi.

---

##  Acknowledgements

- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- Music tracks from the public domain / royalty-free sources

---

**ForgeUp — because your only competition is yesterday's version of you.** 