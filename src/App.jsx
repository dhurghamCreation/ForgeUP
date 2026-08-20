import { useState, useMemo, useEffect, useRef, useCallback, createContext, useContext } from "react";
import {
  Dumbbell, Flame, TrendingUp, Search, ChevronLeft, Play, Check, Plus, Minus,
  Timer, User, LayoutGrid, BarChart3, Calendar, X, ChevronRight, Trophy, Activity,
  Utensils, Users, Bell, Watch, Shield, Ruler, Volume2, VolumeX, Music, Globe,
  Star, MessageSquare, Target, Flag, Wrench, Scale, HeartPulse, SkipForward,
  RotateCcw, Pause, PlayCircle, Settings, Award, Zap, Footprints, Apple, Moon,
  Mic, Brain, Share2, LogOut, Radio,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import TrainingPlanBuilder from "./parts/TrainingPlanBuilder";
import AuthScreen from "./parts/AuthScreen";
import Periodization from "./parts/Periodization";
import SocialFeed from "./parts/SocialFeed";
import RecoveryAnalytics from "./parts/RecoveryAnalytics";
import VoiceCoach from "./parts/VoiceCoach";
import { onAuthChange, saveUserData, getUserData, signOutUser, saveWorkout, saveBodyLog, savePR, postToFeed } from "./firebase";
import { LANGUAGES, T, LangContext, useLang } from "./i18n";

/* ---------------------------------------------------------------
   TOKENS — natural, human, earthy palette
   bg #16130F · surface #1F1B16 · raised #28231D · line #3A332B
   hi #F5EFE6 · mid #A89F92 · low #6E665B
   accent #E8A87C · warm #E07A5F · cool #81B29A · gold #F2CC8F
---------------------------------------------------------------*/
const C = {
  bg: "#F7F5F2",
  surface: "#FFFFFF",
  raised: "#F0EDE8",
  line: "#E2DDD5",
  hi: "#1F2937",
  mid: "#6B7280",
  low: "#9CA3AF",
  accent: "#0b1bf5",
  warm: "#eb0b0b",
  cool: "#098159",
  gold: "#a57b10",
};

const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const MUSCLE_COLOR = { low: "#D6CFC5", mid: C.cool, high: C.accent };

/* ---------------- LANGUAGES & TRANSLATIONS (imported from ./i18n) ---------------- */
const LANG_FLAGS = {
  en: <i className="fa-solid fa-flag" style={{ color: C.accent }} />,
  es: <i className="fa-solid fa-flag" style={{ color: C.warm }} />,
  fr: <i className="fa-solid fa-flag" style={{ color: "#0b1bf5" }} />,
  de: <i className="fa-solid fa-flag" style={{ color: C.gold }} />,
  it: <i className="fa-solid fa-flag" style={{ color: C.cool }} />,
  pt: <i className="fa-solid fa-flag" style={{ color: "#E8A87C" }} />,
};

/* ---------------- TOAST NOTIFICATIONS ---------------- */
const ToastContext = createContext(() => {});
const useToast = () => useContext(ToastContext);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success", icon) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div style={{ position: "absolute", top: 56, right: 12, zIndex: 100, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, pointerEvents: "none", maxWidth: "calc(100% - 24px)" }}>
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-in" style={{
            background: C.raised,
            border: `1px solid ${toast.type === "success" ? C.cool : toast.type === "error" ? C.warm : C.accent}66`,
            borderRadius: 12,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
            maxWidth: "100%",
          }}>
            {toast.icon}
            <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------------- EXERCISES (with demo type + instructions) ---------------- */
const EXERCISES = [
  { id: "bench", name: "Barbell Bench Press", cat: "Chest", equip: "Barbell", pr: 92.5, unit: "kg", demo: "bench", time: 45,
    instructions: ["Lie on the bench with feet planted and eyes under the bar.", "Grip the bar slightly wider than shoulder-width.", "Unrack, lower the bar to mid-chest with control.", "Press up until arms are fully extended."] },
  { id: "incline-db", name: "Incline Dumbbell Press", cat: "Chest", equip: "Dumbbell", pr: 34, unit: "kg", demo: "incline", time: 45,
    instructions: ["Set the bench to a 30–45° incline.", "Press the dumbbells up from shoulder height.", "Lower slowly until you feel a chest stretch.", "Keep wrists stacked over elbows."] },
  { id: "cable-fly", name: "Cable Fly", cat: "Chest", equip: "Cable", pr: 18, unit: "kg", demo: "fly", time: 40,
    instructions: ["Stand between cables with a slight forward lean.", "Bring hands together in a wide arc.", "Squeeze the chest at the midpoint.", "Return slowly to the start."] },
  { id: "pushup", name: "Push-Up", cat: "Chest", equip: "Bodyweight", pr: 45, unit: "reps", demo: "pushup", time: 40,
    instructions: ["Start in a high plank, hands under shoulders.", "Lower your chest toward the floor.", "Keep your body in a straight line.", "Press back up to full extension."] },
  { id: "pullup", name: "Pull-Up", cat: "Back", equip: "Bodyweight", pr: 18, unit: "reps", demo: "pullup", time: 50,
    instructions: ["Hang from the bar with an overhand grip.", "Pull your chest toward the bar.", "Drive elbows down and back.", "Lower with control to full hang."] },
  { id: "barbell-row", name: "Barbell Row", cat: "Back", equip: "Barbell", pr: 85, unit: "kg", demo: "row", time: 45,
    instructions: ["Hinge at the hips with a flat back.", "Pull the bar to your lower ribs.", "Squeeze the shoulder blades together.", "Lower the bar under control."] },
  { id: "lat-pulldown", name: "Lat Pulldown", cat: "Back", equip: "Cable", pr: 70, unit: "kg", demo: "pulldown", time: 45,
    instructions: ["Grip the bar wider than shoulders.", "Pull the bar to your upper chest.", "Keep your torso upright.", "Let the arms extend fully on the way up."] },
  { id: "deadlift", name: "Deadlift", cat: "Back", equip: "Barbell", pr: 140, unit: "kg", demo: "deadlift", time: 60,
    instructions: ["Stand with the bar over mid-foot.", "Hinge and grip the bar, back flat.", "Drive through the floor to stand tall.", "Lower the bar with a straight back."] },
  { id: "squat", name: "Barbell Back Squat", cat: "Legs", equip: "Barbell", pr: 120, unit: "kg", demo: "squat", time: 60,
    instructions: ["Set the bar on your upper back.", "Sit down and back, knees tracking over toes.", "Descend until thighs are parallel.", "Drive up through the whole foot."] },
  { id: "leg-press", name: "Leg Press", cat: "Legs", equip: "Machine", pr: 220, unit: "kg", demo: "legpress", time: 50,
    instructions: ["Sit with feet shoulder-width on the platform.", "Lower until knees reach ~90°.", "Keep lower back pressed into the pad.", "Press the platform away without locking knees."] },
  { id: "lunge", name: "Walking Lunge", cat: "Legs", equip: "Dumbbell", pr: 24, unit: "kg", demo: "lunge", time: 45,
    instructions: ["Step forward into a deep lunge.", "Lower the back knee toward the floor.", "Push off the front foot to step through.", "Keep your torso tall throughout."] },
  { id: "hip-thrust", name: "Barbell Hip Thrust", cat: "Glutes", equip: "Barbell", pr: 100, unit: "kg", demo: "hipthrust", time: 50,
    instructions: ["Rest your upper back on a bench.", "Drive through the heels to lift the hips.", "Squeeze the glutes at the top.", "Lower with control."] },
  { id: "cable-kickback", name: "Cable Glute Kickback", cat: "Glutes", equip: "Cable", pr: 22, unit: "kg", demo: "kickback", time: 40,
    instructions: ["Attach an ankle cuff and face the cable.", "Kick the leg back and up.", "Squeeze the glute at the top.", "Return without swinging."] },
  { id: "ohp", name: "Overhead Press", cat: "Shoulders", equip: "Barbell", pr: 55, unit: "kg", demo: "ohp", time: 45,
    instructions: ["Hold the bar at shoulder height.", "Press overhead, bracing your core.", "Keep the bar path close to your face.", "Lock out at the top, then lower."] },
  { id: "lateral-raise", name: "Lateral Raise", cat: "Shoulders", equip: "Dumbbell", pr: 14, unit: "kg", demo: "lateral", time: 40,
    instructions: ["Stand with dumbbells at your sides.", "Raise arms out to shoulder height.", "Lead with the elbows, slight bend.", "Lower slowly."] },
  { id: "curl", name: "Barbell Curl", cat: "Arms", equip: "Barbell", pr: 40, unit: "kg", demo: "curl", time: 40,
    instructions: ["Hold the bar with an underhand grip.", "Curl the bar toward your shoulders.", "Keep elbows pinned to your sides.", "Lower under control."] },
  { id: "tricep-pushdown", name: "Tricep Pushdown", cat: "Arms", equip: "Cable", pr: 32, unit: "kg", demo: "pushdown", time: 40,
    instructions: ["Grip the bar with elbows at your sides.", "Push the bar down to full extension.", "Keep the upper arms still.", "Return slowly to chest height."] },
  { id: "plank", name: "Plank", cat: "Core", equip: "Bodyweight", pr: 120, unit: "sec", demo: "plank", time: 30,
    instructions: ["Set up on forearms and toes.", "Keep hips level and core braced.", "Look at the floor, neck neutral.", "Hold without letting hips sag."] },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", cat: "Core", equip: "Bodyweight", pr: 15, unit: "reps", demo: "legraise", time: 45,
    instructions: ["Hang from a bar with a firm grip.", "Raise your legs to hip height or higher.", "Avoid swinging your body.", "Lower slowly with control."] },
];

const CATEGORIES = ["All", "Chest", "Back", "Legs", "Glutes", "Shoulders", "Arms", "Core"];

const TODAY_PLAN = {
  name: "Push Day — Chest, Shoulders, Triceps",
  week: "Week 6 · Hypertrophy Block",
  items: [
    { exerciseId: "bench", targetSets: 4, targetReps: "6-8" },
    { exerciseId: "incline-db", targetSets: 3, targetReps: "8-10" },
    { exerciseId: "ohp", targetSets: 3, targetRep: "8-10" },
    { exerciseId: "lateral-raise", targetSets: 3, targetReps: "12-15" },
    { exerciseId: "tricep-pushdown", targetSets: 3, targetReps: "10-12" },
  ],
};

const VOLUME_TREND = [
  { d: "Mon", vol: 4200 }, { d: "Tue", vol: 0 }, { d: "Wed", vol: 5100 },
  { d: "Thu", vol: 0 }, { d: "Fri", vol: 5800 }, { d: "Sat", vol: 3200 }, { d: "Sun", vol: 0 },
];

/* Accurate muscle coordinates mapped to the BodyMap silhouette (viewBox 0 0 400 460) */
const MUSCLE_LOAD = [
  { name: "Traps", pct: 18, cx: 200, cy: 100, lx: 60, ly: 78 },
  { name: "Deltoids", pct: 22, cx: 140, cy: 125, lx: 30, ly: 105 },
  { name: "Deltoids R", pct: 22, cx: 260, cy: 125, lx: 370, ly: 105 },
  { name: "Pectoralis", pct: 27, cx: 200, cy: 148, lx: 60, ly: 150 },
  { name: "Biceps", pct: 14, cx: 125, cy: 172, lx: 15, ly: 172 },
  { name: "Triceps", pct: 12, cx: 275, cy: 172, lx: 385, ly: 172 },
  { name: "Forearms", pct: 10, cx: 115, cy: 212, lx: 15, ly: 215 },
  { name: "Forearms R", pct: 10, cx: 285, cy: 212, lx: 385, ly: 215 },
  { name: "Lats", pct: 20, cx: 165, cy: 188, lx: 60, ly: 205 },
  { name: "Lats R", pct: 20, cx: 235, cy: 188, lx: 340, ly: 205 },
  { name: "Abdominals", pct: 21, cx: 200, cy: 198, lx: 300, ly: 240 },
  { name: "Obliques", pct: 16, cx: 175, cy: 208, lx: 60, ly: 245 },
  { name: "Obliques R", pct: 16, cx: 225, cy: 208, lx: 340, ly: 245 },
  { name: "Glutes", pct: 24, cx: 200, cy: 275, lx: 300, ly: 285 },
  { name: "Quadriceps", pct: 31, cx: 185, cy: 330, lx: 60, ly: 330 },
  { name: "Quadriceps R", pct: 31, cx: 215, cy: 330, lx: 340, ly: 330 },
  { name: "Hamstrings", pct: 26, cx: 180, cy: 368, lx: 60, ly: 375 },
  { name: "Hamstrings R", pct: 26, cx: 220, cy: 368, lx: 340, ly: 375 },
  { name: "Calves", pct: 15, cx: 185, cy: 415, lx: 60, ly: 425 },
  { name: "Calves R", pct: 15, cx: 215, cy: 415, lx: 340, ly: 425 },
];

const HISTORY_DAYS = (() => {
  const days = {};
  const pattern = [86, null, 100, null, 71, null, null, 68, 86, 100, null, 100, 71, null, 71, null, 100, null, 86, null, null];
  for (let i = 0; i < pattern.length; i++) days[i + 1] = pattern[i];
  return days;
})();

const QUICK_FOODS = [
  { label: "Chicken breast (150g)", cal: 248, protein: 46, carbs: 0, fat: 5 },
  { label: "Rice (1 cup cooked)", cal: 206, protein: 4, carbs: 45, fat: 0.4 },
  { label: "Whey shake", cal: 120, protein: 24, carbs: 3, fat: 1 },
  { label: "Banana", cal: 105, protein: 1, carbs: 27, fat: 0.3 },
  { label: "Eggs (2 large)", cal: 156, protein: 13, carbs: 1, fat: 11 },
  { label: "Oats (1/2 cup dry)", cal: 150, protein: 5, carbs: 27, fat: 3 },
  { label: "Greek yoghurt (200g)", cal: 146, protein: 20, carbs: 8, fat: 4 },
  { label: "Peanut butter (1 tbsp)", cal: 94, protein: 4, carbs: 3, fat: 8 },
];

const FOOD_DATABASE = [
  ...QUICK_FOODS,
  { label: "Salmon fillet (150g)", cal: 280, protein: 31, carbs: 0, fat: 17 },
  { label: "Beef steak (200g)", cal: 460, protein: 50, carbs: 0, fat: 28 },
  { label: "Turkey breast (150g)", cal: 220, protein: 42, carbs: 0, fat: 4 },
  { label: "Sweet potato (200g)", cal: 180, protein: 4, carbs: 42, fat: 0.3 },
  { label: "Quinoa (1 cup cooked)", cal: 222, protein: 8, carbs: 39, fat: 3.5 },
  { label: "Almonds (30g)", cal: 170, protein: 6, carbs: 6, fat: 15 },
  { label: "Avocado (1/2)", cal: 160, protein: 2, carbs: 9, fat: 15 },
  { label: "Broccoli (100g)", cal: 35, protein: 2.5, carbs: 7, fat: 0.4 },
  { label: "Tofu (100g)", cal: 76, protein: 8, carbs: 2, fat: 4.8 },
  { label: "Cottage cheese (200g)", cal: 196, protein: 24, carbs: 7, fat: 8 },
  { label: "Tuna (1 can)", cal: 120, protein: 26, carbs: 0, fat: 1 },
  { label: "Pasta (100g dry)", cal: 370, protein: 13, carbs: 72, fat: 1.5 },
  { label: "Whole milk (250ml)", cal: 150, protein: 8, carbs: 12, fat: 8 },
  { label: "Mixed nuts (30g)", cal: 190, protein: 5, carbs: 7, fat: 16 },
  { label: "Apple", cal: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { label: "Orange", cal: 62, protein: 1, carbs: 15, fat: 0.2 },
  { label: "Blueberries (100g)", cal: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  { label: "Spinach (100g)", cal: 23, protein: 3, carbs: 3.6, fat: 0.4 },
  { label: "Shrimp (100g)", cal: 84, protein: 18, carbs: 0.2, fat: 0.9 },
  { label: "Cashews (30g)", cal: 157, protein: 5, carbs: 9, fat: 12 },
];

const MACRO_GOALS = { cal: 2600, protein: 180, carbs: 280, fat: 80 };

/* ---------------- MEAL OPTIONS ---------------- */
const MEAL_PLANS = [
  { id: "lean", name: "Lean Builder", cal: 2400, protein: 180, carbs: 260, fat: 70, color: C.accent, desc: "Steady muscle gain with minimal fat." },
  { id: "bulk", name: "Hard Bulk", cal: 3000, protein: 200, carbs: 380, fat: 90, color: C.warm, desc: "Aggressive surplus for maximum growth." },
  { id: "cut", name: "Shred & Cut", cal: 1900, protein: 170, carbs: 170, fat: 60, color: C.cool, desc: "Calorie deficit to reveal definition." },
  { id: "maintain", name: "Maintain", cal: 2600, protein: 160, carbs: 300, fat: 80, color: C.gold, desc: "Hold your current physique." },
];

const MEAL_ITEMS = {
  lean: [
    { meal: "Breakfast", items: "Oats + whey + berries", cal: 480 },
    { meal: "Lunch", items: "Chicken, rice, greens", cal: 620 },
    { meal: "Snack", items: "Greek yoghurt + almonds", cal: 300 },
    { meal: "Dinner", items: "Salmon, sweet potato, veg", cal: 700 },
    { meal: "Evening", items: "Casein shake", cal: 300 },
  ],
  bulk: [
    { meal: "Breakfast", items: "4 eggs, oats, banana", cal: 700 },
    { meal: "Lunch", items: "Beef, pasta, olive oil", cal: 850 },
    { meal: "Snack", items: "Peanut butter sandwich", cal: 500 },
    { meal: "Dinner", items: "Chicken, rice, avocado", cal: 750 },
    { meal: "Evening", items: "Whey + milk", cal: 400 },
  ],
  cut: [
    { meal: "Breakfast", items: "Egg whites, oats", cal: 350 },
    { meal: "Lunch", items: "Turkey, quinoa, veg", cal: 450 },
    { meal: "Snack", items: "Protein shake", cal: 200 },
    { meal: "Dinner", items: "White fish, greens", cal: 500 },
    { meal: "Evening", items: "Cottage cheese", cal: 200 },
  ],
  maintain: [
    { meal: "Breakfast", items: "Oats + eggs", cal: 550 },
    { meal: "Lunch", items: "Chicken, rice, veg", cal: 650 },
    { meal: "Snack", items: "Fruit + nuts", cal: 350 },
    { meal: "Dinner", items: "Lean protein, carbs, veg", cal: 700 },
    { meal: "Evening", items: "Yoghurt", cal: 350 },
  ],
};

/* ---------------- WEEKLY GOALS (color-coded) ---------------- */
const WEEKLY_GOALS = [
  { id: "sessions", label: "Train 4 sessions", icon: Calendar, color: C.accent, target: 4, done: 3 },
  { id: "volume", label: "Lift 18 tonnes", icon: Activity, color: C.cool, target: 18, done: 12.4 },
  { id: "protein", label: "Hit protein goal 5 days", icon: Utensils, color: C.gold, target: 5, done: 3 },
  { id: "steps", label: "Walk 60k steps", icon: Footprints, color: C.warm, target: 60, done: 41 },
];

/* ---------------- CHALLENGES ---------------- */
const CHALLENGES = [
  { id: "pushup30", name: "30-Day Push-Up", desc: "Build to 50 push-ups in a row.", icon: Zap, color: C.warm, progress: 12, total: 30, reward: "Strength badge" },
  { id: "plank5", name: "Plank Master", desc: "Hold a 5-minute plank by week 4.", icon: Timer, color: C.accent, progress: 2, total: 4, reward: "Core badge" },
  { id: "hydration", name: "Hydration Streak", desc: "Drink 3L daily for 14 days.", icon: HeartPulse, color: C.cool, progress: 9, total: 14, reward: "Health badge" },
  { id: "squat100", name: "100 Squats", desc: "Complete 100 squats in one day.", icon: Activity, color: C.gold, progress: 0, total: 100, reward: "Legs badge" },
];

/* ---------------- EQUIPMENT ---------------- */
const EQUIPMENT = [
  { id: "barbell", name: "Barbell", icon: Dumbbell, color: C.accent, desc: "Free-weight compound lifts." },
  { id: "dumbbell", name: "Dumbbells", icon: Dumbbell, color: C.cool, desc: "Versatile isolation & accessory work." },
  { id: "cable", name: "Cable machine", icon: Wrench, color: C.gold, desc: "Constant tension through the range." },
  { id: "machine", name: "Machines", icon: Wrench, color: C.warm, desc: "Guided, beginner-friendly paths." },
  { id: "bodyweight", name: "Bodyweight", icon: Activity, color: C.accent, desc: "No equipment needed, anywhere." },
];

/* ---------------- HAPTICS (vibration feedback) ---------------- */
function haptic(pattern = 10) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) { /* unsupported */ }
}

/* ---------------- SOUND ENGINE ---------------- */
class SoundEngine {
  constructor() { this.ctx = null; this.enabled = true; }
  _ctx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  _tone(freq, dur, type = "sine", peak = 0.15, delay = 0) {
    if (!this.enabled) return;
    try {
      const ctx = this._ctx();
      if (!ctx) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(peak, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    } catch (e) { /* audio unsupported */ }
  }
  tap() { this._tone(920, 0.045, "sine", 0.06); haptic(8); }
  setComplete() { this._tone(660, 0.09, "triangle", 0.14); this._tone(990, 0.12, "triangle", 0.11, 0.06); haptic([10, 30, 10]); }
  restDone() { this._tone(440, 0.14, "square", 0.09); this._tone(440, 0.14, "square", 0.09, 0.18); this._tone(440, 0.14, "square", 0.09, 0.36); haptic([15, 30, 15, 30, 15]); }
  finish() { [523, 659, 784, 1046].forEach((f, i) => this._tone(f, 0.24, "triangle", 0.13, i * 0.09)); haptic([20, 40, 20, 40, 20, 40, 20]); }
}
const sound = new SoundEngine();

/* ---------------- MUSIC ENGINE (real MP3 files + synthesized fallback) ---------------- */
const MUSIC_TRACKS = [
  { id: "workout1", name: "Workout Energy", file: "/music/atlasaudio-workout-workout-music-518096.mp3", color: C.warm, desc: "High-energy gym track" },
  { id: "workout2", name: "Gym Pump", file: "/music/mondamusic-gym-workout-560137.mp3", color: C.accent, desc: "Driving workout beat" },
  { id: "workout3", name: "Quick Burn", file: "/music/prettyjohn1-workout-workout-music_53sec-540856.mp3", color: C.cool, desc: "Short intense session" },
  { id: "focus", name: "Deep Focus (synth)", tempo: 70, notes: [220, 261.6, 329.6, 392], color: C.cool, desc: "Synthesized lo-fi" },
  { id: "energy", name: "Pump Energy (synth)", tempo: 110, notes: [196, 246.9, 293.7, 392], color: C.warm, desc: "Synthesized beat" },
  { id: "calm", name: "Calm Flow (synth)", tempo: 60, notes: [174.6, 220, 261.6, 329.6], color: C.gold, desc: "Synthesized calm" },
];

class MusicEngine {
  constructor() { this.ctx = null; this.playing = false; this.track = "focus"; this.timer = null; this.step = 0; this.gain = null; this.audio = null; }
  _ctx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.0;
      this.gain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  _note(freq, dur, delay, vol = 0.06) {
    try {
      const ctx = this._ctx();
      if (!ctx) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(vol * 2.5, t0 + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(this.gain);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch (e) { /* ignore */ }
  }
  _stopAudio() {
    if (this.audio) {
      try { this.audio.pause(); this.audio.currentTime = 0; } catch (e) {}
      this.audio = null;
    }
  }
  start(trackId) {
    const tr = MUSIC_TRACKS.find((t) => t.id === trackId) || MUSIC_TRACKS[0];
    this.track = trackId;
    this.playing = true;
    this.step = 0;
    this._stopAudio();
    if (this.timer) clearInterval(this.timer);
    this.timer = null;

    // Real MP3 file
    if (tr.file) {
      try {
        const audio = new Audio(tr.file);
        audio.loop = true;
        audio.volume = 0.6;
        audio.play().catch(() => { /* autoplay blocked — user gesture required */ });
        this.audio = audio;
        return;
      } catch (e) { /* fall through to synth */ }
    }

    // Synthesized fallback
    const ctx = this._ctx();
    if (!ctx) return;
    this.gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 1.5);
    const beat = 60 / (tr.tempo || 70);
    this.timer = setInterval(() => {
      const i = this.step % tr.notes.length;
      this._note(tr.notes[i], beat * 1.6, 0, 0.12);
      if (this.step % 2 === 0) this._note(tr.notes[i] * 2, beat * 0.8, 0, 0.05);
      if (this.step % 4 === 0) this._note(tr.notes[(i + 2) % tr.notes.length] / 2, beat * 2.4, 0, 0.08);
      this.step++;
    }, beat * 1000);
  }
  stop() {
    this.playing = false;
    this._stopAudio();
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (this.ctx && this.gain) this.gain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.5);
  }
  toggle(trackId) {
    if (this.playing && this.track === trackId) { this.stop(); return false; }
    this.stop();
    this.start(trackId);
    return true;
  }
}
const music = new MusicEngine();

/* ---------------- BACKEND ---------------- */
const STATE_KEY = "forgeup-state";
const todayKey = () => new Date().toISOString().slice(0, 10);
const randHandle = () => `Lifter${Math.floor(1000 + Math.random() * 9000)}`;

function defaultState() {
  return {
    profile: { username: randHandle(), soundEnabled: true, leaderboardOptIn: false, streak: 0, bestStreak: 0 },
    onboarding: { completed: false, skipped: false, gender: null, focus: null, bodyType: null },
    settings: { language: "en", musicEnabled: false, musicTrack: "focus" },
    body: { weight: 78, height: 178, history: [] },
    days: {},
    nutrition: {},
    feedback: [],
    goals: WEEKLY_GOALS.map((g) => ({ id: g.id, done: g.done })),
    badges: [],
    prs: {},
    workoutCount: 0,
    health: null,
  };
}

/* localStorage fallback — keeps data even if window.storage is unavailable */
const LS_KEY = "forgeup-local-state";

function lsLoad() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function lsSave(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); return true; }
  catch (e) { return false; }
}

async function loadState() {
  // Try window.storage first (backend), fall back to localStorage
  try {
    if (window.storage && window.storage.get) {
      const res = await window.storage.get(STATE_KEY, false);
      if (res && res.value) {
        const parsed = JSON.parse(res.value);
        return { ...defaultState(), ...parsed, profile: { ...defaultState().profile, ...parsed.profile }, settings: { ...defaultState().settings, ...parsed.settings }, onboarding: { ...defaultState().onboarding, ...parsed.onboarding }, body: { ...defaultState().body, ...parsed.body } };
      }
    }
  } catch (e) { /* fall through to localStorage */ }
  const local = lsLoad();
  if (local) {
    return { ...defaultState(), ...local, profile: { ...defaultState().profile, ...local.profile }, settings: { ...defaultState().settings, ...local.settings }, onboarding: { ...defaultState().onboarding, ...local.onboarding }, body: { ...defaultState().body, ...local.body } };
  }
  return defaultState();
}

async function saveState(state) {
  // Save to both backends for maximum persistence
  let ok = false;
  try {
    if (window.storage && window.storage.set) {
      ok = await window.storage.set(STATE_KEY, JSON.stringify(state), false);
    }
  } catch (e) { /* ignore */ }
  lsSave(state);
  return ok || true;
}

async function pushLeaderboard(username, streak, weeklyVolume) {
  if (!username) return;
  try {
    await window.storage.set(`leaderboard:${username}`, JSON.stringify({ username, streak, weeklyVolume, updatedAt: Date.now() }), true);
  } catch (e) { /* best-effort */ }
}

async function removeFromLeaderboard(username) {
  try { await window.storage.delete(`leaderboard:${username}`, true); } catch (e) {}
}

async function fetchLeaderboard() {
  try {
    const listRes = await window.storage.list("leaderboard:", true);
    if (!listRes || !listRes.keys) return [];
    const keys = listRes.keys.slice(0, 30);
    const entries = [];
    for (const k of keys) {
      try {
        const r = await window.storage.get(k, true);
        if (r && r.value) entries.push(JSON.parse(r.value));
      } catch (e) { /* skip */ }
    }
    return entries.sort((a, b) => b.streak - a.streak);
  } catch (e) { return []; }
}

/* ---------------- LOGO ---------------- */
function Logo({ size = 40 }) {
  const heights = [16, 25, 34, 44];
  const barW = 11, gap = 5;
  const totalW = heights.length * barW + (heights.length - 1) * gap;
  const startX = 50 - totalW / 2;
  const baseY = 68;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="2" y="2" width="96" height="96" rx="24" fill={C.surface} stroke={C.line} />
      {heights.map((h, i) => {
        const x = startX + i * (barW + gap);
        const isLast = i === heights.length - 1;
        return (
          <rect key={i} x={x} y={baseY - h} width={barW} height={h} rx={3}
            fill={isLast ? C.accent : C.cool} opacity={0.55 + i * 0.14} />
        );
      })}
      <path d="M67 22c3 4 -1.5 7 -3.5 9.5c-2.5 3.2 0.3 6.8 3 6.8c3.6 0 6.8-3.4 5.8-7.4c-0.9-3.7-2.9-6.4-5.3-8.9z" fill={C.warm} />
    </svg>
  );
}

/* ---------------- SPLASH ---------------- */
function SplashScreen({ progress, label }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-10" style={{ background: C.bg }}>
      <Logo size={72} />
      <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 21, fontWeight: 700 }} className="mt-5">ForgeUp</div>
      <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }} className="mt-1 mb-8 text-center">{label}</div>
      <div style={{ width: "100%", height: 6, background: C.raised, borderRadius: 999, overflow: "hidden", border: `1px solid ${C.line}` }}>
        <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg,${C.cool},${C.accent})`, transition: "width 0.25s ease" }} />
      </div>
      <div style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 11 }} className="mt-3">{progress}%</div>
      <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10, letterSpacing: 0.5 }} className="mt-6 uppercase tracking-widest">Designed by Dhurgham Alsaadi</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{ width: 44, height: 26, borderRadius: 999, background: checked ? C.accent : C.line, position: "relative", flexShrink: 0, transition: "background 0.2s" }}
      className="hover-pop">
      <div style={{ position: "absolute", top: 3, left: checked ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: checked ? C.bg : C.mid, transition: "left 0.2s" }} />
    </button>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 flex-1 min-w-0 hover-lift">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} color={accent} strokeWidth={2.5} />
        <span style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11, letterSpacing: 0.4 }} className="uppercase truncate">{label}</span>
      </div>
      <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 22, fontWeight: 600 }}>{value}</div>
      {sub && <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{sub}</div>}
    </div>
  );
}

function Ring({ pct, size = 64, stroke = 6, color = C.accent }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(pct, 100) / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.line} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-5 pt-14 pb-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={() => { sound.tap(); onBack(); }} style={{ background: C.raised, border: `1px solid ${C.line}` }} className="rounded-full p-2 hover-pop">
            <ChevronLeft size={18} color={C.hi} />
          </button>
        )}
        <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 20, fontWeight: 700 }}>{title}</h1>
      </div>
      {right}
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const { t } = useLang();
  const items = [
    { id: "dashboard", icon: LayoutGrid, label: t("dashboard") },
    { id: "exercises", icon: Dumbbell, label: t("exercises") },
    { id: "log", icon: Play, label: t("train") },
    { id: "analytics", icon: BarChart3, label: t("analytics") },
    { id: "profile", icon: User, label: t("profile") },
  ];
  return (
    <div style={{ background: "rgba(255,255,255,0.92)", borderTop: `1px solid ${C.line}`, backdropFilter: "blur(12px)" }}
      className="absolute bottom-0 left-0 right-0 flex items-stretch px-2 pt-2 pb-6 bottom-nav">
      {items.map((it) => {
        const active = tab === it.id;
        const isTrain = it.id === "log";
        return (
          <button key={it.id} onClick={() => { sound.tap(); setTab(it.id); }} className="flex-1 flex flex-col items-center gap-1 py-1 nav-item">
            {isTrain ? (
              <div style={{ background: active ? C.accent : C.line, borderRadius: 12 }} className="p-2 -mt-4 shadow-lg hover-pulse">
                <it.icon size={18} color={active ? C.bg : C.mid} strokeWidth={2.5} />
              </div>
            ) : (
              <it.icon size={19} color={active ? C.accent : C.low} strokeWidth={2.2} />
            )}
            <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: active ? C.hi : C.low, fontWeight: active ? 600 : 400 }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- ONBOARDING ---------------- */
function BodySilhouette({ type, gender }) {
  const colors = { male: C.cool, female: C.accent };
  const main = colors[gender] || C.cool;
  const shapes = {
    slim: { torso: "M170 95 Q200 82 230 95 L242 120 L232 270 Q200 285 168 270 L158 120 Z" },
    athletic: { torso: "M168 92 Q200 78 232 92 L244 118 L234 268 Q200 284 166 268 L156 118 Z" },
    muscular: { torso: "M165 90 Q200 74 235 90 L248 118 L238 266 Q200 282 162 266 L152 118 Z" },
    curvy: { torso: "M172 96 Q200 84 228 96 L240 122 L232 272 Q200 288 168 272 L160 122 Z" },
  };
  const s = shapes[type] || shapes.athletic;
  return (
    <svg viewBox="0 0 400 300" width="100%" height="150">
      <defs>
        <linearGradient id={`skin-${type}-${gender}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={main} stopOpacity="0.9" />
          <stop offset="100%" stopColor={main} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <g fill={`url(#skin-${type}-${gender})`} stroke={C.line} strokeWidth="1.5">
        <ellipse cx="200" cy="52" rx="24" ry="28" />
        <path d={s.torso} />
        <path d="M156 118 L112 132 L98 235 L122 240 L142 152 Z" />
        <path d="M244 118 L288 132 L302 235 L278 240 L258 152 Z" />
        <path d="M168 268 L158 285 L185 290 L196 272 Z" />
        <path d="M232 268 L242 285 L215 290 L204 272 Z" />
      </g>
    </svg>
  );
}

const BODY_TYPES = [
  { id: "slim", label: "Slim / Lean", desc: "Light frame, fast metabolism" },
  { id: "athletic", label: "Athletic / Toned", desc: "Balanced, active build" },
  { id: "muscular", label: "Muscular / Bulky", desc: "Solid, strong frame" },
  { id: "curvy", label: "Curvy / Full", desc: "Soft, fuller shape" },
];

const FOCUS_AREAS = [
  { id: "fullbody", label: "Full Body", icon: Activity, color: C.accent, desc: "Balanced strength everywhere" },
  { id: "muscle", label: "Muscle Gain", icon: Dumbbell, color: C.warm, desc: "Build size & strength" },
  { id: "fatloss", label: "Fat Loss", icon: Flame, color: C.gold, desc: "Burn fat, reveal shape" },
  { id: "strength", label: "Strength", icon: Trophy, color: C.cool, desc: "Lift heavier over time" },
  { id: "endurance", label: "Endurance", icon: HeartPulse, color: C.warm, desc: "Last longer, recover faster" },
  { id: "core", label: "Core & Posture", icon: Target, color: C.accent, desc: "Stability & balance" },
];

function Onboarding({ state, onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState(state.onboarding.gender || null);
  const [focus, setFocus] = useState(state.onboarding.focus || null);
  const [bodyType, setBodyType] = useState(state.onboarding.bodyType || null);
  const { t } = useLang();

  const steps = [
    { title: t("tellUsAboutYou"), sub: t("tellUsSub") },
    { title: t("mainGoal"), sub: t("mainGoalSub") },
    { title: t("pickBodyType"), sub: t("pickBodyTypeSub") },
  ];

  const finish = () => { sound.finish(); onComplete({ gender, focus, bodyType }); };
  const canNext = step === 0 ? !!gender : step === 1 ? !!focus : !!bodyType;

  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <Logo size={36} />
        <button onClick={() => { sound.tap(); onSkip(); }} style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12.5 }} className="flex items-center gap-1 hover-pop">
          <SkipForward size={14} /> {t("skip")}
        </button>
      </div>

      <div className="px-5">
        <div style={{ background: C.line, borderRadius: 999, height: 4 }} className="overflow-hidden">
          <div style={{ background: C.accent, width: `${((step + 1) / steps.length) * 100}%`, height: "100%", transition: "width 0.3s ease" }} />
        </div>
      </div>

      <div className="px-5 mt-6 flex-1 overflow-y-auto pb-28">
        <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 24, fontWeight: 700 }}>{steps[step].title}</h1>
        <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13 }} className="mt-1.5">{steps[step].sub}</p>

        {step === 0 && (
          <div className="mt-6">
            {[{ id: "male", label: t("male"), icon: User }, { id: "female", label: t("female"), icon: User }, { id: "other", label: t("preferNot"), icon: User }].map((g) => (
              <button key={g.id} onClick={() => { sound.tap(); setGender(g.id); }}
                style={{ background: gender === g.id ? C.raised : C.surface, border: `1px solid ${gender === g.id ? C.accent : C.line}`, borderRadius: 14 }}
                className="w-full flex items-center gap-3 px-4 py-4 mb-2.5 text-left hover-lift">
                <div style={{ background: gender === g.id ? C.accent : C.line, borderRadius: 10 }} className="p-2.5">
                  <g.icon size={18} color={gender === g.id ? C.bg : C.mid} />
                </div>
                <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, fontWeight: 600 }}>{g.label}</span>
                {gender === g.id && <Check size={18} color={C.accent} className="ml-auto" />}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {FOCUS_AREAS.map((f) => (
              <button key={f.id} onClick={() => { sound.tap(); setFocus(f.id); }}
                style={{ background: focus === f.id ? C.raised : C.surface, border: `1px solid ${focus === f.id ? f.color : C.line}`, borderRadius: 14 }}
                className="p-4 text-left hover-lift">
                <div style={{ background: focus === f.id ? f.color : C.line, borderRadius: 10, width: 34, height: 34 }} className="flex items-center justify-center mb-2">
                  <f.icon size={17} color={focus === f.id ? C.bg : C.mid} />
                </div>
                <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>{f.label}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            {BODY_TYPES.map((b) => (
              <button key={b.id} onClick={() => { sound.tap(); setBodyType(b.id); }}
                style={{ background: bodyType === b.id ? C.raised : C.surface, border: `1px solid ${bodyType === b.id ? C.accent : C.line}`, borderRadius: 14 }}
                className="w-full flex items-center gap-3 px-4 py-2 mb-2.5 text-left hover-lift">
                <div style={{ width: 70, flexShrink: 0 }}>
                  <BodySilhouette type={b.id} gender={gender || "male"} />
                </div>
                <div className="flex-1">
                  <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, fontWeight: 600 }}>{b.label}</div>
                  <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{b.desc}</div>
                </div>
                {bodyType === b.id && <Check size={18} color={C.accent} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-8 pt-2">
        <button onClick={() => { sound.tap(); step < 2 ? setStep(step + 1) : finish(); }}
          disabled={!canNext}
          style={{ background: canNext ? C.accent : C.line, fontFamily: FONT_BODY, fontWeight: 700, color: canNext ? C.bg : C.low }}
          className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm hover-glow">
          {step < 2 ? t("next") : t("done")} <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard({ setTab, startWorkout, completedToday, streak, weeklyVolume, state, onOpenProfile }) {
  const openProfilePage = (key) => {
    sound.tap();
    onOpenProfile(key);
    setTab("profile");
  };
  const { t } = useLang();
  const progressPct = Math.round((completedToday / TODAY_PLAN.items.length) * 100);
  const suggestion = "+2.5kg on bench vs last session";
  const bmi = state.body.height ? (state.body.weight / Math.pow(state.body.height / 100, 2)).toFixed(1) : "—";
  const bmiColor = bmi === "—" ? C.mid : bmi < 18.5 ? C.cool : bmi < 25 ? C.accent : bmi < 30 ? C.gold : C.warm;
  const bmiLabel = bmi === "—" ? "Set height" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";

  return (
    <div className="px-5 pb-28 overflow-y-auto h-full">
      <div className="pt-14 pb-1 flex items-center justify-between">
        <div>
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13 }}>Wednesday, Aug 12</div>
          <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 26, fontWeight: 700 }}>{t("ready")}</h1>
        </div>
        <Logo size={40} />
      </div>

      <div className="flex gap-3 mt-5">
        <StatCard icon={Flame} label="Streak" value={`${streak}d`} sub="Keep it going" accent={C.warm} />
        <StatCard icon={Trophy} label="This week" value="4/5" sub="1 session left" accent={C.accent} />
        <StatCard icon={Activity} label="Volume" value={`${weeklyVolume.toFixed(1)}t`} sub="this week" accent={C.cool} />
      </div>

      {/* Weight / BMI card */}
      <div style={{ background: `linear-gradient(155deg,${C.raised} 0%,${C.surface} 100%)`, border: `1px solid ${C.line}`, borderRadius: 16 }} className="mt-3 p-4 flex items-center justify-between hover-lift">
        <div className="flex items-center gap-3">
          <div style={{ background: `${bmiColor}22`, borderRadius: 12 }} className="p-2.5">
            <Scale size={18} color={bmiColor} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide">{t("weight")}</div>
            <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 18, fontWeight: 700 }}>{state.body.weight} kg</div>
          </div>
        </div>
        <button onClick={() => openProfilePage("weight")} className="flex items-center gap-2 hover-pop" style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12 }}>
          <div className="px-3 py-2 text-left">
            <div style={{ fontFamily: FONT_MONO, color: bmiColor, fontSize: 16, fontWeight: 700 }}>{bmi}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("bmi")} · {bmiLabel}</div>
          </div>
          <ChevronRight size={14} color={C.low} className="mr-2" />
        </button>
      </div>

      {/* Next workout card */}
      <div style={{ background: `linear-gradient(155deg,${C.raised} 0%,${C.surface} 100%)`, border: `1px solid ${C.line}`, borderRadius: 20 }}
        className="mt-4 p-5 relative overflow-hidden hover-lift">
        <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: C.accent, opacity: 0.07 }} />
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11, letterSpacing: 0.6 }} className="uppercase mb-1">{TODAY_PLAN.week}</div>
        <div className="flex items-center justify-between">
          <div style={{ maxWidth: 190 }}>
            <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 19, fontWeight: 700, lineHeight: 1.2 }}>{TODAY_PLAN.name}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="mt-1">{TODAY_PLAN.items.length} exercises · ~52 min</div>
          </div>
          <div className="relative flex items-center justify-center">
            <Ring pct={progressPct} />
            <span style={{ position: "absolute", fontFamily: FONT_MONO, color: C.hi, fontSize: 13, fontWeight: 700 }}>{progressPct}%</span>
          </div>
        </div>
        <div style={{ fontFamily: FONT_BODY, color: C.cool, fontSize: 11 }} className="mt-3"><i className="fa-solid fa-arrow-up" style={{ fontSize: 10 }} /> Suggested progression: {suggestion}</div>
        <button onClick={() => { sound.tap(); setTab("log"); startWorkout(); }}
          style={{ background: C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
          className="w-full rounded-xl py-3.5 mt-4 flex items-center justify-center gap-2 text-sm active:scale-[0.98] transition-transform hover-glow">
          <Play size={15} fill={C.bg} /> {completedToday > 0 ? t("resume") : t("start")}
        </button>
      </div>

      {/* Weekly goals with colors */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>{t("goals")}</span>
          <button onClick={() => openProfilePage("goals")} style={{ fontFamily: FONT_BODY, color: C.cool, fontSize: 12 }} className="flex items-center gap-0.5 hover-pop">
            {t("profile")} <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {WEEKLY_GOALS.map((g) => {
            const pct = Math.min(100, (g.done / g.target) * 100);
            return (
              <div key={g.id} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 14 }} className="p-3 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <div style={{ background: `${g.color}22`, borderRadius: 8 }} className="p-1.5">
                    <g.icon size={14} color={g.color} />
                  </div>
                  <span style={{ fontFamily: FONT_MONO, color: C.mid, fontSize: 11 }}>{g.done}/{g.target}</span>
                </div>
                <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12, fontWeight: 600, minHeight: 32, lineHeight: 1.3, display: "flex", alignItems: "center" }}>{g.label}</div>
                <div style={{ background: C.line, borderRadius: 999, height: 5 }} className="mt-2 overflow-hidden">
                  <div style={{ background: g.color, width: `${pct}%`, height: "100%", borderRadius: 999, transition: "width 0.4s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly calendar strip - opens a full Calendar view */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>{t("january")} 2026</span>
          <button onClick={() => openProfilePage("calendar")} style={{ fontFamily: FONT_BODY, color: C.cool, fontSize: 12 }} className="flex items-center gap-0.5 hover-pop">
            {t("more")} <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Object.entries(HISTORY_DAYS).slice(0, 14).map(([date, pct]) => (
            <div key={date} className="flex flex-col items-center gap-1">
              <span style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 10 }}>{date}</span>
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: pct === null ? C.raised : pct >= 90 ? C.accent : pct >= 70 ? C.cool : C.low,
                border: pct === null ? `1px dashed ${C.line}` : "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }} className="flex items-center justify-center hover-lift">
                {pct !== null && <span style={{ fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, color: C.bg }}>{pct}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>Weekly load</span>
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="mt-3 p-4 h-32 hover-lift">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={VOLUME_TREND} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="d" tick={{ fill: C.low, fontSize: 10, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 11 }} labelStyle={{ color: C.mid }} />
              <Line type="monotone" dataKey="vol" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3, fill: C.accent }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ---------------- EXERCISE DEMO (equipment moves WITH body, leg exercises animate legs) ---------------- */
const DEMO_POSES = {
  bench: { label: "Bench Press", body: "lying", equip: "barbell", animGroup: "arms", anim: "pressUpDown" },
  incline: { label: "Incline Press", body: "lying", equip: "dumbbell", animGroup: "arms", anim: "pressUpDown" },
  fly: { label: "Cable Fly", body: "standing", equip: "cable", animGroup: "arms", anim: "spreadArms" },
  pushup: { label: "Push-Up", body: "floor", equip: "none", animGroup: "body", anim: "floorUpDown" },
  pullup: { label: "Pull-Up", body: "hanging", equip: "bar", animGroup: "body", anim: "bodyUp" },
  row: { label: "Barbell Row", body: "hinged", equip: "barbell", animGroup: "arms", anim: "pullArms" },
  pulldown: { label: "Lat Pulldown", body: "seated", equip: "cable", animGroup: "arms", anim: "pullDownArms" },
  deadlift: { label: "Deadlift", body: "hinged", equip: "barbell", animGroup: "legs", anim: "hipHinge" },
  squat: { label: "Back Squat", body: "standing", equip: "barbell", animGroup: "body", anim: "squatLegs" },
  legpress: { label: "Leg Press", body: "seated", equip: "machine", animGroup: "legs", anim: "legExtend" },
  lunge: { label: "Walking Lunge", body: "standing", equip: "dumbbell", animGroup: "legs", anim: "lungeStep" },
  hipthrust: { label: "Hip Thrust", body: "lying", equip: "barbell", animGroup: "legs", anim: "hipLift" },
  kickback: { label: "Glute Kickback", body: "standing", equip: "cable", animGroup: "legs", anim: "legKick" },
  ohp: { label: "Overhead Press", body: "standing", equip: "barbell", animGroup: "arms", anim: "pressUpDown" },
  lateral: { label: "Lateral Raise", body: "standing", equip: "dumbbell", animGroup: "arms", anim: "spreadArms" },
  curl: { label: "Barbell Curl", body: "standing", equip: "barbell", animGroup: "arms", anim: "curlUp" },
  pushdown: { label: "Tricep Pushdown", body: "standing", equip: "cable", animGroup: "arms", anim: "pushDown" },
  plank: { label: "Plank", body: "plank", equip: "none", animGroup: "none", anim: "plankBreath" },
  legraise: { label: "Leg Raise", body: "hanging", equip: "bar", animGroup: "legs", anim: "legRaiseUp" },
};

/* Small equipment primitives (drawn inside animated groups so they move WITH the body part) */
const EqBarbell = ({ x1, y1, x2, y2, c }) => (
  <g stroke={c} strokeWidth="4" strokeLinecap="round">
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
    <rect x={x1 - 2} y={y1 - 8} width="10" height="16" rx="2" fill={c} stroke="none" />
    <rect x={x2 - 8} y={y2 - 8} width="10" height="16" rx="2" fill={c} stroke="none" />
  </g>
);
const EqDumbbell = ({ x, y, c }) => (
  <g stroke={c} strokeWidth="3" strokeLinecap="round">
    <line x1={x} y1={y} x2={x} y2={y + 22} />
    <rect x={x - 8} y={y - 4} width="16" height="6" rx="2" fill={c} stroke="none" />
    <rect x={x - 8} y={y + 20} width="16" height="6" rx="2" fill={c} stroke="none" />
  </g>
);
const EqCable = ({ x1, y1, x2, y2, c }) => (
  <g stroke={c} strokeWidth="2" strokeDasharray="4,3">
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
  </g>
);

function ExerciseDemo({ type }) {
  const pose = DEMO_POSES[type] || DEMO_POSES.bench;
  const color = C.accent;
  const equipColor = C.cool;
  const anim = pose.anim;
  const animGroup = pose.animGroup;

  // Which body-part group gets the animation class
  const armAnim = animGroup === "arms" ? "anim-arms" : "";
  const legAnim = animGroup === "legs" ? "anim-legs" : "";
  const bodyAnim = animGroup === "body" ? "anim-body" : "";

  return (
    <div style={{ background: `radial-gradient(circle at 50% 40%, ${C.raised}, ${C.surface})`, border: `1px solid ${C.line}`, borderRadius: 16, aspectRatio: "16/10" }}
      className="flex items-center justify-center overflow-hidden relative hover-lift">
      <div style={{ position: "absolute", top: 12, left: 12, fontFamily: FONT_BODY, color: C.low, fontSize: 10 }} className="uppercase tracking-wide flex items-center gap-1">
        <PlayCircle size={12} color={C.cool} /> {pose.label}
      </div>
      <svg viewBox="0 0 200 200" width="160" height="160">
        <defs>
          <style>{`
            /* ARM animations */
            @keyframes pressUpDown { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-52deg); } }
            @keyframes spreadArms { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-78deg); } }
            @keyframes curlUp { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-95deg); } }
            @keyframes pushDown { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(65deg); } }
            @keyframes pullArms { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(55deg); } }
            @keyframes pullDownArms { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(60deg); } }
            /* LEG animations - ONLY legs move */
            @keyframes squatLegs { 0%,100% { transform: translateY(0); } 50% { transform: translateY(16px); } }
            @keyframes hipHinge { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-35deg); } }
            @keyframes legExtend { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-45deg); } }
            @keyframes lungeStep { 0%,100% { transform: translateX(0); } 50% { transform: translateX(14px); } }
            @keyframes hipLift { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
            @keyframes legKick { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-55deg); } }
            @keyframes legRaiseUp { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-65deg); } }
            /* BODY animations */
            @keyframes bodyUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
            @keyframes floorUpDown { 0%,100% { transform: translateY(0); } 50% { transform: translateY(9px); } }
            @keyframes plankBreath { 0%,100% { transform: translateY(0); } 50% { transform: translateY(2px); } }
            /* Applied classes */
            .anim-arms { animation: ${anim} 1.6s ease-in-out infinite; }
            .anim-legs { animation: ${anim} 1.6s ease-in-out infinite; }
            .anim-body { animation: ${anim} 1.6s ease-in-out infinite; }
            .floor-line { stroke: ${C.line}; stroke-width: 2; stroke-dasharray: 4,4; }
          `}</style>
        </defs>

        {/* Floor reference lines */}
        {(pose.body === "floor" || pose.body === "plank" || pose.body === "hanging") && (
          <line x1="20" y1="180" x2="180" y2="180" className="floor-line" />
        )}
        {pose.body === "standing" && (
          <line x1="20" y1="190" x2="180" y2="190" className="floor-line" />
        )}

        {/* ============ STANDING ============ */}
        {pose.body === "standing" && (
          <g className={bodyAnim} style={bodyAnim ? { transformOrigin: "100px 190px" } : {}}>
            {/* Head + torso */}
            <circle cx="100" cy="42" r="14" fill={color} stroke="none" opacity="0.9" />
            <line x1="100" y1="60" x2="100" y2="130" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Arms (animate for arm exercises; equipment rides along) */}
            <g className={armAnim} style={armAnim ? { transformOrigin: "100px 78px" } : {}}>
              <line x1="100" y1="78" x2="62" y2="100" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="62" y1="100" x2="52" y2="128" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {pose.equip === "dumbbell" && <EqDumbbell x={52} y={128} c={equipColor} />}
              {pose.equip === "cable" && <EqCable x1={30} y1={30} x2={52} y2={128} c={equipColor} />}
              {pose.equip === "barbell" && pose.id === "curl" && <EqBarbell x1={40} y1={128} x2={160} y2={128} c={equipColor} />}
            </g>
            <g className={armAnim} style={armAnim ? { transformOrigin: "100px 78px", transform: "scaleX(-1)" } : {}}>
              <line x1="100" y1="78" x2="138" y2="100" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="138" y1="100" x2="148" y2="128" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {pose.equip === "dumbbell" && <EqDumbbell x={148} y={128} c={equipColor} />}
              {pose.equip === "cable" && <EqCable x1={170} y1={30} x2={148} y2={128} c={equipColor} />}
            </g>
            {/* Legs (animate for leg exercises only) */}
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 130px" } : {}}>
              <line x1="100" y1="130" x2="80" y2="165" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="80" y1="165" x2="80" y2="188" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {pose.equip === "cable" && pose.id === "kickback" && <EqCable x1={170} y1={30} x2={80} y2={188} c={equipColor} />}
            </g>
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 130px", transform: "scaleX(-1)" } : {}}>
              <line x1="100" y1="130" x2="120" y2="165" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="120" y1="165" x2="120" y2="188" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
            {/* Barbell on back for squat - moves with whole body */}
            {pose.equip === "barbell" && pose.id === "squat" && <EqBarbell x1={30} y1={55} x2={170} y2={55} c={equipColor} />}
            {/* Barbell for OHP - held overhead, moves with arms */}
            {pose.equip === "barbell" && pose.id === "ohp" && (
              <g className={armAnim} style={armAnim ? { transformOrigin: "100px 78px" } : {}}>
                <EqBarbell x1={30} y1={95} x2={170} y2={95} c={equipColor} />
              </g>
            )}
            {/* Dumbbells at sides for lunge - move with body */}
            {pose.equip === "dumbbell" && pose.id === "lunge" && (
              <>
                <EqDumbbell x={52} y={128} c={equipColor} />
                <EqDumbbell x={148} y={128} c={equipColor} />
              </>
            )}
          </g>
        )}

        {/* ============ LYING (bench / incline / hip thrust) ============ */}
        {pose.body === "lying" && (
          <g className={bodyAnim} style={bodyAnim ? { transformOrigin: "100px 90px" } : {}}>
            {/* Bench surface */}
            <line x1="25" y1="90" x2="175" y2="90" className="floor-line" />
            <circle cx="100" cy="55" r="14" fill={color} stroke="none" opacity="0.9" />
            <line x1="100" y1="72" x2="100" y2="125" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Legs (animate for hip thrust) */}
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 125px" } : {}}>
              <line x1="100" y1="125" x2="85" y2="155" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="85" y1="155" x2="85" y2="170" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 125px", transform: "scaleX(-1)" } : {}}>
              <line x1="100" y1="125" x2="115" y2="155" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="115" y1="155" x2="115" y2="170" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
            {/* Arms pressed up (bench / incline) - equipment rides along */}
            <g className={armAnim} style={armAnim ? { transformOrigin: "100px 80px" } : {}}>
              <line x1="100" y1="80" x2="62" y2="70" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="62" y1="70" x2="52" y2="92" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {pose.equip === "barbell" && <EqBarbell x1={30} y1={75} x2={170} y2={75} c={equipColor} />}
              {pose.equip === "dumbbell" && <EqDumbbell x={52} y={92} c={equipColor} />}
            </g>
            <g className={armAnim} style={armAnim ? { transformOrigin: "100px 80px", transform: "scaleX(-1)" } : {}}>
              <line x1="100" y1="80" x2="138" y2="70" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="138" y1="70" x2="148" y2="92" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {pose.equip === "dumbbell" && <EqDumbbell x={148} y={92} c={equipColor} />}
            </g>
            {/* Barbell across hips for hip thrust - moves with legs */}
            {pose.equip === "barbell" && pose.id === "hipthrust" && (
              <g className={legAnim} style={legAnim ? { transformOrigin: "100px 125px" } : {}}>
                <EqBarbell x1={55} y1={150} x2={145} y2={150} c={equipColor} />
              </g>
            )}
          </g>
        )}

        {/* ============ FLOOR (push-up) - horizontal on ground ============ */}
        {pose.body === "floor" && (
          <g className={bodyAnim} style={bodyAnim ? { transformOrigin: "100px 180px" } : {}}>
            {/* Head */}
            <circle cx="48" cy="158" r="13" fill={color} stroke="none" opacity="0.9" />
            {/* Torso horizontal */}
            <line x1="62" y1="158" x2="145" y2="158" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Arms to floor (supporting) */}
            <line x1="62" y1="158" x2="55" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="172" x2="48" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="62" y1="158" x2="68" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="68" y1="172" x2="75" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Legs horizontal */}
            <line x1="145" y1="158" x2="172" y2="158" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="172" y1="158" x2="182" y2="158" stroke={color} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {/* ============ PLANK - horizontal on ground, forearms down ============ */}
        {pose.body === "plank" && (
          <g className="anim-body" style={{ transformOrigin: "100px 180px" }}>
            {/* Head */}
            <circle cx="48" cy="158" r="13" fill={color} stroke="none" opacity="0.9" />
            {/* Torso horizontal */}
            <line x1="62" y1="158" x2="145" y2="158" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Forearms on the ground */}
            <line x1="62" y1="158" x2="55" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="172" x2="48" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="62" y1="158" x2="68" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="68" y1="172" x2="75" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Legs horizontal, toes on ground */}
            <line x1="145" y1="158" x2="172" y2="158" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="172" y1="158" x2="182" y2="158" stroke={color} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {/* ============ HANGING (pull-up / leg raise) ============ */}
        {pose.body === "hanging" && (
          <g className={bodyAnim} style={bodyAnim ? { transformOrigin: "100px 30px" } : {}}>
            {/* Bar */}
            {pose.equip === "bar" && (
              <g stroke={equipColor} strokeWidth="4" strokeLinecap="round">
                <line x1="40" y1="30" x2="160" y2="30" />
              </g>
            )}
            <circle cx="100" cy="55" r="14" fill={color} stroke="none" opacity="0.9" />
            <line x1="100" y1="72" x2="100" y2="140" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Arms to bar */}
            <line x1="100" y1="78" x2="70" y2="42" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="78" x2="130" y2="42" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Legs (animate for leg raise) */}
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 140px" } : {}}>
              <line x1="100" y1="140" x2="88" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="88" y1="172" x2="88" y2="185" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 140px", transform: "scaleX(-1)" } : {}}>
              <line x1="100" y1="140" x2="112" y2="172" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="112" y1="172" x2="112" y2="185" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* ============ HINGED (deadlift / barbell row) ============ */}
        {pose.body === "hinged" && (
          <g className={bodyAnim} style={bodyAnim ? { transformOrigin: "100px 60px" } : {}}>
            <circle cx="100" cy="40" r="14" fill={color} stroke="none" opacity="0.9" />
            {/* Torso hinged forward */}
            <line x1="100" y1="58" x2="100" y2="95" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Legs (animate for deadlift) */}
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 60px" } : {}}>
              <line x1="100" y1="95" x2="85" y2="130" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="85" y1="130" x2="70" y2="160" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="100" y1="95" x2="115" y2="130" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="115" y1="130" x2="130" y2="160" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
            {/* Arms down to bar (animate for row) */}
            <g className={armAnim} style={armAnim ? { transformOrigin: "100px 70px" } : {}}>
              <line x1="100" y1="70" x2="78" y2="120" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="100" y1="70" x2="122" y2="120" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {pose.equip === "barbell" && <EqBarbell x1={55} y1={160} x2={145} y2={160} c={equipColor} />}
            </g>
          </g>
        )}

        {/* ============ SEATED (lat pulldown / leg press) ============ */}
        {pose.body === "seated" && (
          <g className={bodyAnim} style={bodyAnim ? { transformOrigin: "100px 160px" } : {}}>
            {/* Seat */}
            <line x1="30" y1="160" x2="170" y2="160" className="floor-line" />
            <circle cx="100" cy="45" r="14" fill={color} stroke="none" opacity="0.9" />
            <line x1="100" y1="62" x2="100" y2="110" stroke={color} strokeWidth="5" strokeLinecap="round" />
            {/* Arms (animate for lat pulldown) */}
            <g className={armAnim} style={armAnim ? { transformOrigin: "100px 75px" } : {}}>
              <line x1="100" y1="75" x2="60" y2="95" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="60" y1="95" x2="50" y2="120" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {pose.equip === "cable" && <EqCable x1={100} y1={30} x2={50} y2={120} c={equipColor} />}
            </g>
            <g className={armAnim} style={armAnim ? { transformOrigin: "100px 75px", transform: "scaleX(-1)" } : {}}>
              <line x1="100" y1="75" x2="140" y2="95" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="140" y1="95" x2="150" y2="120" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {pose.equip === "cable" && <EqCable x1={100} y1={30} x2={150} y2={120} c={equipColor} />}
            </g>
            {/* Legs (animate for leg press) */}
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 110px" } : {}}>
              <line x1="100" y1="110" x2="88" y2="145" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="88" y1="145" x2="88" y2="160" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
            <g className={legAnim} style={legAnim ? { transformOrigin: "100px 110px", transform: "scaleX(-1)" } : {}}>
              <line x1="100" y1="110" x2="112" y2="145" stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1="112" y1="145" x2="112" y2="160" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
            {/* Leg press platform */}
            {pose.equip === "machine" && (
              <g className={legAnim} style={legAnim ? { transformOrigin: "100px 110px" } : {}}>
                <g stroke={equipColor} strokeWidth="3" strokeLinecap="round" opacity="0.6">
                  <rect x="30" y="150" width="140" height="8" rx="4" fill="none" />
                  <line x1="40" y1="158" x2="40" y2="180" />
                  <line x1="160" y1="158" x2="160" y2="180" />
                </g>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

/* ---------------- EXERCISE LIBRARY ---------------- */
function ExerciseLibrary({ onSelect }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const { t } = useLang();
  const filtered = useMemo(() => EXERCISES.filter(e =>
    (cat === "All" || e.cat === cat) && e.name.toLowerCase().includes(query.toLowerCase())
  ), [query, cat]);

  return (
    <div className="h-full flex flex-col">
      <TopBar title={t("exercises")} />
      <div className="px-5">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center gap-2 px-3 py-2.5 hover-lift">
          <Search size={16} color={C.low} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")}
            style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, background: "transparent", outline: "none", width: "100%" }} />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => { sound.tap(); setCat(c); }}
              style={{
                fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
                padding: "7px 14px", borderRadius: 999,
                background: cat === c ? C.accent : C.raised,
                color: cat === c ? C.bg : C.mid,
                border: cat === c ? "none" : `1px solid ${C.line}`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              className="hover-pop">
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 mt-4 pb-28 overflow-y-auto flex-1">
        {filtered.map((ex) => (
          <button key={ex.id} onClick={() => { sound.tap(); onSelect(ex); }} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 14 }}
            className="w-full flex items-center justify-between p-4 mb-2.5 text-left active:scale-[0.99] transition-transform hover-lift">
            <div>
              <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14.5, fontWeight: 600 }}>{ex.name}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }} className="mt-1">{ex.cat} · {ex.equip}</div>
            </div>
            <div className="text-right">
              <div style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 13, fontWeight: 700 }}>{ex.pr}{ex.unit === "kg" ? "kg" : ""}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }} className="uppercase">{ex.unit === "kg" ? "PR" : ex.unit}</div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 13 }} className="text-center mt-10">{t("noResults")} "{query}"</div>
        )}
      </div>
    </div>
  );
}

function ExerciseDetail({ exercise, onBack }) {
  const { t } = useLang();
  const [timer, setTimer] = useState(exercise.time || 45);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const trend = [58, 62, 60, 66, 70, 72, exercise.pr].map((v, i) => ({ i, v }));

  useEffect(() => {
    if (running && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => (t <= 1 ? 0 : t - 1)), 1000);
      return () => clearInterval(timerRef.current);
    }
    if (timer === 0 && running) { sound.restDone(); setRunning(false); }
  }, [running, timer]);

  const toggleTimer = () => {
    if (timer === 0) setTimer(exercise.time || 45);
    setRunning((r) => !r);
    sound.tap();
  };

  return (
    <div className="h-full flex flex-col">
      <TopBar title={exercise.name} onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <ExerciseDemo type={exercise.demo} />

        {/* Timer */}
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mt-4 flex items-center justify-between hover-lift">
          <div className="flex items-center gap-3">
            <div style={{ background: `${C.warm}22`, borderRadius: 10 }} className="p-2">
              <Timer size={18} color={C.warm} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide">{t("timer")}</div>
              <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 22, fontWeight: 700 }}>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setTimer(exercise.time || 45); setRunning(false); sound.tap(); }} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop">
              <RotateCcw size={16} color={C.mid} />
            </button>
            <button onClick={toggleTimer} style={{ background: running ? C.warm : C.accent, borderRadius: 10 }} className="p-2.5 hover-pop">
              {running ? <Pause size={16} color={C.bg} /> : <Play size={16} color={C.bg} fill={C.bg} />}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mid, background: C.raised, border: `1px solid ${C.line}`, borderRadius: 999 }} className="px-3 py-1">{exercise.cat}</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mid, background: C.raised, border: `1px solid ${C.line}`, borderRadius: 999 }} className="px-3 py-1">{exercise.equip}</span>
        </div>

        <div className="flex gap-3 mt-4">
          <StatCard icon={Trophy} label="Personal record" value={`${exercise.pr}${exercise.unit === "kg" ? "kg" : ""}`} accent={C.accent} />
          <StatCard icon={TrendingUp} label="Last session" value={`${Math.round(exercise.pr * 0.93)}${exercise.unit === "kg" ? "kg" : ""}`} accent={C.cool} />
        </div>

        <div className="mt-5">
          <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>Progress</span>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="mt-3 p-4 h-28 hover-lift">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <Line type="monotone" dataKey="v" stroke={C.accent} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-5">
          <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>{t("instructions")}</span>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="mt-3 p-4 hover-lift">
            {exercise.instructions.map((ins, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <div style={{ background: `${C.accent}22`, borderRadius: 8, width: 22, height: 22, flexShrink: 0 }} className="flex items-center justify-center">
                  <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                </div>
                <span style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13, lineHeight: 1.6 }}>{ins}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PLATE CALCULATOR ---------------- */
const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

function PlateCalculator({ onBack }) {
  const [target, setTarget] = useState(100);
  const [barWeight, setBarWeight] = useState(20);
  const result = useMemo(() => {
    const perSide = (target - barWeight) / 2;
    if (perSide <= 0) return [];
    let remaining = perSide;
    const plates = [];
    for (const p of PLATES) {
      while (remaining >= p - 0.001) {
        plates.push(p);
        remaining -= p;
      }
    }
    return { plates, remaining: Math.round(remaining * 100) / 100 };
  }, [target, barWeight]);

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Plate Calculator" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">Target weight (kg)</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTarget((t) => Math.max(20, t - 2.5))} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop"><Minus size={16} color={C.mid} /></button>
            <input value={target} onChange={(e) => setTarget(Number(e.target.value) || 0)} type="number"
              style={{ fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 10, color: C.hi, fontSize: 20, fontWeight: 700, padding: "8px 12px", width: "100%", textAlign: "center" }} />
            <button onClick={() => setTarget((t) => t + 2.5)} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop"><Plus size={16} color={C.mid} /></button>
          </div>
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">Bar weight (kg)</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setBarWeight((b) => Math.max(0, b - 5))} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop"><Minus size={16} color={C.mid} /></button>
            <input value={barWeight} onChange={(e) => setBarWeight(Number(e.target.value) || 0)} type="number"
              style={{ fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 10, color: C.hi, fontSize: 20, fontWeight: 700, padding: "8px 12px", width: "100%", textAlign: "center" }} />
            <button onClick={() => setBarWeight((b) => b + 5)} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop"><Plus size={16} color={C.mid} /></button>
          </div>
        </div>

        <div style={{ background: `linear-gradient(155deg,${C.raised} 0%,${C.surface} 100%)`, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-5 mb-4 text-center hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide">Per side</div>
          <div style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 28, fontWeight: 700 }} className="mt-1">{(target - barWeight) / 2} kg</div>
          {result.remaining > 0.01 && (
            <div style={{ fontFamily: FONT_BODY, color: C.warm, fontSize: 12 }} className="mt-1">Can't reach exactly — closest is {target - result.remaining * 2} kg</div>
          )}
        </div>

        <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>Plates needed (each side)</span>
        <div className="mt-3">
          {result.plates.length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }}>Target must be heavier than the bar.</div>}
          {result.plates.map((p, i) => (
            <div key={i} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center justify-between px-4 py-3 mb-2 hover-lift">
              <div className="flex items-center gap-3">
                <div style={{ background: `${C.accent}22`, borderRadius: 8, width: 34, height: 34 }} className="flex items-center justify-center">
                  <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 12, fontWeight: 700 }}>{p}kg</span>
                </div>
                <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13 }}>Plate</span>
              </div>
              <span style={{ fontFamily: FONT_MONO, color: C.mid, fontSize: 12 }}>× 1</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- LIVE WORKOUT ---------------- */
const REST_DEFAULT = 90;
const REST_ADJUST = 15;
/* Natural human-friendly green for completed sets (not harsh neon) */
const SET_DONE = "#34D399";
const SET_DONE_SOFT = "rgba(52,211,153,0.15)";
const SET_DONE_BORDER = "rgba(52,211,153,0.25)";

/* Confetti burst for PR celebrations */
function ConfettiBurst({ show }) {
  if (!show) return null;
  const colors = [SET_DONE, C.accent, C.cool, C.gold, C.warm, "#60A5FA"];
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 0.8 + Math.random() * 0.9,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 90, overflow: "hidden" }}>
      {particles.map((p) => (
        <div key={p.id} className="confetti-particle" style={{
          position: "absolute",
          top: "-10px",
          left: `${p.left}%`,
          width: p.size,
          height: p.size * 0.6,
          background: p.color,
          borderRadius: 2,
          opacity: 0,
          transform: `rotate(${p.rotate}deg)`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }} />
      ))}
    </div>
  );
}

/* Rest timer bar — persistent bottom bar with circular countdown */
function RestTimerBar({ restTime, setRestTime, done }) {
  if (restTime <= 0 && !done) return null;
  if (done) {
    return (
      <div style={{ background: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", border: `1px solid ${SET_DONE_BORDER}`, borderRadius: 16 }}
        className="m-4 p-4 shadow-lg">
        <div style={{ fontFamily: FONT_DISPLAY, color: SET_DONE, fontSize: 15, fontWeight: 700 }}><i className="fa-solid fa-circle-check" style={{ fontSize: 14 }} /> Rest complete!</div>
        <div style={{ fontFamily: FONT_BODY, color: "#047857", fontSize: 12 }} className="mt-1">Ready for your next set. Go crush it!</div>
        <div style={{ background: SET_DONE_SOFT, width: "100px", height: 3, borderRadius: 999, margin: "8px auto 0" }} />
      </div>
    );
  }
  const pct = (restTime / REST_DEFAULT) * 100;
  return (
    <div style={{ background: "rgba(255,255,255,0.97)", border: `1px solid ${SET_DONE_BORDER}`, borderRadius: 16, boxShadow: "0 -4px 24px rgba(52,211,153,0.12)", backdropFilter: "blur(12px)" }}
      className="m-4 px-4 py-3 flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <Ring pct={pct} size={44} stroke={5} color={SET_DONE} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Timer size={16} color={SET_DONE} />
        </div>
      </div>
      <div className="flex-1">
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 10 }} className="uppercase tracking-wide">Rest</div>
        <div style={{ fontFamily: FONT_MONO, color: SET_DONE, fontSize: 24, fontWeight: 700, textShadow: "0 0 20px rgba(52,211,153,0.3)" }}>
          {Math.floor(restTime / 60)}:{String(restTime % 60).padStart(2, "0")}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <button onClick={() => setRestTime((t) => Math.max(0, t - REST_ADJUST))} style={{ background: "#F3F4F6", border: `1px solid ${C.line}`, borderRadius: 8, fontFamily: FONT_MONO, color: C.hi, fontSize: 11, fontWeight: 700 }} className="px-3 py-1 hover-pop">−15s</button>
        <button onClick={() => setRestTime((t) => t + REST_ADJUST)} style={{ background: SET_DONE_SOFT, border: `1px solid ${SET_DONE}66`, borderRadius: 8, fontFamily: FONT_MONO, color: SET_DONE, fontSize: 11, fontWeight: 700 }} className="px-3 py-1 hover-pop">+15s</button>
      </div>
    </div>
  );
}

/* Progressive Overload suggestion card */
function OverloadSuggestion({ exercise }) {
  const lastWeight = Math.round((exercise.pr || 80) * 0.93);
  const lastReps = exercise.pr ? (exercise.pr > 100 ? 6 : 8) : 7;
  const suggested = lastWeight >= 2.5 ? Math.round((Math.ceil(lastWeight / 2.5) * 2.5 + 2.5) * 10) / 10 : lastWeight + 2.5;
  const targetReps = "6–8";
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.accent}18, transparent)`, border: `1px solid ${C.accent}40`, borderRadius: 12 }}
      className="p-3 mb-3">
      <div className="flex items-start gap-2.5">
        <div style={{ background: `${C.accent}22`, borderRadius: 8, flexShrink: 0 }} className="p-1.5">
          <TrendingUp size={14} color={C.accent} />
        </div>
        <div>
          <div style={{ fontFamily: FONT_BODY, color: C.accent, fontSize: 12, fontWeight: 700 }}>Smart suggestion</div>
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11.5, lineHeight: 1.5 }} className="mt-0.5">
            Last time you did <span style={{ color: C.hi, fontWeight: 700 }}>{lastWeight}kg for {lastReps} reps</span>. Try{" "}
            <span style={{ color: C.accent, fontWeight: 700 }}>{suggested}kg for {targetReps} reps</span> to break your PR.
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveWorkout({ session, setSession, onFinish, onShowPlates, prCelebrated, setPrCelebrated }) {
  const [showPlates, setShowPlates] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [restDoneFlash, setRestDoneFlash] = useState(false);
  const timerRef = useRef(null);
  const prevRest = useRef(0);
  const showToast = useContext(ToastContext);

  useEffect(() => {
    if (restTime > 0) {
      timerRef.current = setInterval(() => setRestTime((t) => (t <= 1 ? 0 : t - 1)), 1000);
      return () => clearInterval(timerRef.current);
    }
    return undefined;
  }, [restTime > 0]);

  // Trigger PR celebration when a set beats the exercise PR
  useEffect(() => {
    if (!session) return;
    const hasPR = session.items.some((item) => {
      const ex = EXERCISES.find((e) => e.id === item.exerciseId);
      if (!ex) return false;
      return item.sets.some((set) => set.done && Number(set.weight) > ex.pr);
    });
    if (hasPR && !prCelebrated) {
      setPrCelebrated(true);
      setTimeout(() => setPrCelebrated(false), 2500);
    }
  }, [session]);

  useEffect(() => {
    if (prevRest.current > 0 && restTime === 0) {
      sound.restDone();
      setRestDoneFlash(true);
      setTimeout(() => setRestDoneFlash(false), 4000);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification("ForgeUp", { body: "Rest complete! Ready for your next set." });
        } catch (e) { /* ignore */ }
      }
    }
    prevRest.current = restTime;
  }, [restTime]);

  if (showPlates) {
    return <PlateCalculator onBack={() => setShowPlates(false)} />;
  }

  if (!session) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-6 mb-5 hover-lift">
          <Dumbbell size={36} color={C.accent} strokeWidth={1.5} />
        </div>
        <h2 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 19, fontWeight: 700 }}>No active session</h2>
        <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13 }} className="mt-2">Start today's workout from the Dashboard to begin logging sets.</p>
        <button onClick={() => setShowPlates(true)} style={{ background: C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
          className="w-full rounded-xl py-3.5 mt-4 text-sm hover-glow">
          Plate Calculator
        </button>
      </div>
    );
  }

  const toggleSet = (exIdx, setIdx) => {
    const isCompleting = !session.items[exIdx].sets[setIdx].done;
    setSession((s) => {
      const items = [...s.items];
      const sets = [...items[exIdx].sets];
      sets[setIdx] = { ...sets[setIdx], done: !sets[setIdx].done };
      items[exIdx] = { ...items[exIdx], sets };
      return { ...s, items };
    });
    if (isCompleting) {
      setRestTime(REST_DEFAULT);
      setRestDoneFlash(false);
      sound.setComplete();
      showToast(`Set ${setIdx + 1} complete! Rest 90s`, "success", <Check size={14} color={C.cool} />);
    } else {
      sound.tap();
    }
  };

  const updateSet = (exIdx, setIdx, field, value) => {
    setSession((s) => {
      const items = [...s.items];
      const sets = [...items[exIdx].sets];
      sets[setIdx] = { ...sets[setIdx], [field]: value };
      items[exIdx] = { ...items[exIdx], sets };
      return { ...s, items };
    });
  };

  const totalSets = session.items.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = session.items.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);
  const hasPRSet = session.items.some((item) => item.sets.some((set) => set.done && Number(set.weight) > 0 && set.weight > (EXERCISES.find((e) => e.id === item.exerciseId)?.pr || 0) * 0.93));

  return (
    <div className="h-full flex flex-col">
      <ConfettiBurst show={prCelebrated} />
      <div className="px-5 pt-14 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide">In progress</div>
            <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 19, fontWeight: 700 }} className="truncate pr-2">{session.name}</h1>
          </div>
          <button onClick={() => { sound.tap(); setShowPlates(true); }} style={{ background: C.surface, border: `1px solid ${C.accent}55`, borderRadius: 10, fontFamily: FONT_BODY, color: C.accent, fontSize: 11, fontWeight: 600 }} className="px-2.5 py-2 flex items-center gap-1 flex-shrink-0 hover-pop">
            <Dumbbell size={13} /> Plates
          </button>
        </div>
        <div style={{ background: C.line, borderRadius: 999, height: 5 }} className="mt-3 overflow-hidden">
          <div style={{ background: `linear-gradient(90deg, ${C.accent}, ${SET_DONE})`, width: `${(doneSets / totalSets) * 100}%`, height: "100%", transition: "width 0.4s ease", boxShadow: doneSets === totalSets ? `0 0 12px ${SET_DONE_SOFT}` : "none" }} className="rounded-full" />
        </div>
        <div className="flex justify-between mt-1">
          <span style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 10 }}>{doneSets}/{totalSets} sets</span>
          <span style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 10 }}>{session.items.length} exercises</span>
        </div>
      </div>

      <div className="px-5 pb-40 overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>
        {session.items.map((item, exIdx) => {
          const isComplete = item.sets.every((s) => s.done);
          return (
            <div key={item.exerciseId} style={{
              background: isComplete ? `linear-gradient(155deg, ${C.raised}, #ECFDF5)` : C.raised,
              border: `1px solid ${isComplete ? SET_DONE_BORDER : C.line}`,
              borderRadius: 16,
              boxShadow: isComplete ? `0 0 16px ${SET_DONE_SOFT}` : "none",
              transition: "all 0.3s ease",
            }} className="mb-3 p-4">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14.5, fontWeight: 600 }}>{item.name}</span>
                <span style={{ fontFamily: FONT_MONO, color: isComplete ? SET_DONE : C.low, fontSize: 11, fontWeight: 700 }}>{item.sets.filter(s => s.done).length}/{item.sets.length}</span>
              </div>

              {/* Progressive overload suggestion */}
              <OverloadSuggestion exercise={EXERCISES.find((e) => e.id === item.exerciseId) || { id: item.exerciseId, name: item.name, pr: 80 }} />

              <div className="grid grid-cols-[26px_1fr_1fr_34px] gap-2 items-center mb-1.5">
                <span style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }} className="uppercase">Set</span>
                <span style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }} className="uppercase">Weight</span>
                <span style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }} className="uppercase">Reps</span>
                <span style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }} className="uppercase text-right"><i className="fa-solid fa-check" style={{ fontSize: 10 }} /></span>
              </div>
              {item.sets.map((set, setIdx) => (
                <div key={setIdx} className="grid grid-cols-[26px_1fr_1fr_34px] gap-2 items-center mb-1.5">
                  <span style={{ fontFamily: FONT_MONO, color: set.done ? SET_DONE : C.mid, fontSize: 12, fontWeight: set.done ? 700 : 400 }}>{setIdx + 1}</span>
                  <div className="relative">
                    <input value={set.weight} onChange={(e) => updateSet(exIdx, setIdx, "weight", e.target.value)} type="number" min="0"
                      style={{
                        fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${set.done ? SET_DONE_BORDER : C.line}`,
                        borderRadius: 8, color: set.done ? SET_DONE : C.hi, fontSize: 13, padding: "7px 8px", width: "100%",
                        opacity: set.done ? 0.85 : 1, transition: "all 0.2s",
                      }} />
                  </div>
                  <div className="relative">
                    <input value={set.reps} onChange={(e) => updateSet(exIdx, setIdx, "reps", e.target.value)} type="number" min="0"
                      style={{
                        fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${set.done ? SET_DONE_BORDER : C.line}`,
                        borderRadius: 8, color: set.done ? SET_DONE : C.hi, fontSize: 13, padding: "7px 8px", width: "100%",
                        opacity: set.done ? 0.85 : 1, transition: "all 0.2s",
                      }} />
                  </div>
                  <button onClick={() => toggleSet(exIdx, setIdx)}
                    style={{
                      background: set.done ? SET_DONE : C.line,
                      borderRadius: 9,
                      width: 32,
                      height: 32,
                      boxShadow: set.done ? `0 0 12px ${SET_DONE_SOFT}, inset 0 0 4px rgba(255,255,255,0.3)` : "none",
                      transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: set.done ? "scale(1)" : "scale(0.9)",
                    }}
                    className="flex items-center justify-center ml-auto hover-pop">
                    <Check size={15} color={set.done ? "#064E3B" : C.low} strokeWidth={3.5} />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
        <button onClick={onFinish}
          style={{
            background: doneSets === totalSets ? `linear-gradient(135deg, ${C.accent}, #F2CC8F)` : C.line,
            fontFamily: FONT_BODY, fontWeight: 700, color: doneSets === totalSets ? C.bg : C.mid,
            boxShadow: doneSets === totalSets ? "0 4px 20px rgba(232,168,124,0.3)" : "none",
          }}
          className="w-full rounded-xl py-4 mt-2 text-sm hover-glow">
          {doneSets === totalSets ? <>Finish workout <i className="fa-solid fa-champagne-glasses" /></> : `Finish workout (${doneSets}/${totalSets})`}
        </button>
      </div>

      {/* Rest timer — persistent bar */}
      <div className="absolute bottom-16 left-0 right-0 z-20">
        {restDoneFlash ? <RestTimerBar restTime={0} done /> : <RestTimerBar restTime={restTime} setRestTime={setRestTime} />}
      </div>
    </div>
  );
}

/* ---------------- ANALYTICS ---------------- */
function BodyMap() {
  return (
    <svg viewBox="0 0 400 460" width="100%" height="380">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill={C.line} stroke={C.low} strokeWidth="1">
        <ellipse cx="200" cy="60" rx="26" ry="30" />
        <path d="M170 95 Q200 85 230 95 L245 115 L235 260 Q200 275 165 260 L155 115 Z" />
        <path d="M155 115 L110 130 L95 235 L120 240 L140 150 Z" fill={C.raised} />
        <path d="M245 115 L290 130 L305 235 L280 240 L260 150 Z" fill={C.raised} />
        <path d="M170 258 L160 400 L185 405 L195 275 Z" fill={C.raised} />
        <path d="M230 258 L240 400 L215 405 L205 275 Z" fill={C.raised} />
        <path d="M158 400 L188 405 L184 445 L152 442 Z" fill={C.raised} />
        <path d="M242 400 L212 405 L216 445 L248 442 Z" fill={C.raised} />
      </g>
      {MUSCLE_LOAD.map((m) => {
        const intensity = m.pct >= 25 ? MUSCLE_COLOR.high : m.pct >= 17 ? MUSCLE_COLOR.mid : MUSCLE_COLOR.low;
        const radius = 20 + m.pct * 0.7;
        return (
          <g key={m.name}>
            <circle cx={m.cx} cy={m.cy} r={radius} fill="url(#glow)" opacity={m.pct / 35} />
            <circle cx={m.cx} cy={m.cy} r={10} fill={intensity} opacity="0.85" />
            <line x1={m.cx} y1={m.cy} x2={m.lx} y2={m.ly} stroke={C.low} strokeWidth="1" strokeDasharray="2,2" />
            <text x={m.lx} y={m.ly - 4} textAnchor={m.lx < 200 ? "start" : "end"} fill={C.hi} fontSize="11" fontFamily={FONT_MONO} fontWeight="700">{m.pct}%</text>
            <text x={m.lx} y={m.ly + 9} textAnchor={m.lx < 200 ? "start" : "end"} fill={C.mid} fontSize="9" fontFamily={FONT_BODY}>{m.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Analytics() {
  const [range, setRange] = useState("Week");
  const { t } = useLang();
  return (
    <div className="h-full flex flex-col">
      <TopBar title={t("analytics")} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div className="flex gap-2 mb-4">
          {["Week", "Month", "All time"].map((r) => (
            <button key={r} onClick={() => { sound.tap(); setRange(r); }}
              style={{
                fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, padding: "7px 14px", borderRadius: 999,
                background: range === r ? C.accent : C.raised, color: range === r ? C.bg : C.mid,
                border: range === r ? "none" : `1px solid ${C.line}`,
              }}
              className="hover-pop">
              {r}
            </button>
          ))}
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 20 }} className="pt-2 pb-1 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="px-4 pt-2 uppercase tracking-wide">Muscle activation · {range}</div>
          <BodyMap />
        </div>

        <div className="mt-5">
          <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>Lifted weight & reps</span>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="mt-3 p-4 hover-lift">
            <div className="flex items-baseline gap-2 mb-2">
              <span style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 20, fontWeight: 700 }}>100kg</span>
              <span style={{ fontFamily: FONT_BODY, color: C.cool, fontSize: 12, fontWeight: 600 }}>+12.5kg record</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={[{ d: "17.04", v: 82 }, { d: "18.04", v: 85 }, { d: "19.04", v: 88 }, { d: "20.04", v: 90 }, { d: "21.04", v: 95 }, { d: "22.04", v: 100 }]}>
                <CartesianGrid stroke={C.line} vertical={false} />
                <XAxis dataKey="d" tick={{ fill: C.low, fontSize: 9, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="v" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3, fill: C.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <StatCard icon={Activity} label="Total volume" value="18.3t" sub="this week" accent={C.accent} />
          <StatCard icon={Calendar} label="Sessions" value="4" sub="this week" accent={C.cool} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- NUTRITION ---------------- */
function Nutrition({ dayData, onAdd, onRemove, onBack }) {
  const [foodQuery, setFoodQuery] = useState("");
  const showToast = useContext(ToastContext);
  const entries = dayData?.entries || [];
  const totals = entries.reduce((a, e) => ({ cal: a.cal + e.cal, protein: a.protein + e.protein, carbs: a.carbs + e.carbs, fat: a.fat + e.fat }), { cal: 0, protein: 0, carbs: 0, fat: 0 });
  const calPct = Math.min(100, Math.round((totals.cal / MACRO_GOALS.cal) * 100));
  const searchResults = useMemo(() => {
    const q = foodQuery.trim().toLowerCase();
    if (!q) return [];
    return FOOD_DATABASE.filter((f) => f.label.toLowerCase().includes(q)).slice(0, 8);
  }, [foodQuery]);

  const MacroBar = ({ label, val, goal, color }) => (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }}>{label}</span>
        <span style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 11 }}>{Math.round(val)}/{goal}g</span>
      </div>
      <div style={{ background: C.line, borderRadius: 999, height: 6 }}>
        <div style={{ width: `${Math.min(100, (val / goal) * 100)}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Nutrition & macros" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {/* Visual macro progress ring */}
        <div style={{ background: `linear-gradient(155deg,${C.raised} 0%,${C.surface} 100%)`, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-5 mb-4 flex items-center gap-4 hover-lift">
          <div className="relative flex items-center justify-center">
            <Ring pct={calPct} size={84} stroke={8} color={C.accent} />
            <div className="text-center" style={{ position: "absolute" }}>
              <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 16, fontWeight: 700 }}>{calPct}%</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 9 }}>kcal</div>
            </div>
          </div>
          <div className="flex-1">
            <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 17, fontWeight: 700 }}>{Math.round(totals.cal)} kcal</div>
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="mt-0.5">of {MACRO_GOALS.cal} daily goal</div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <div style={{ background: `${C.accent}22`, borderRadius: 6, padding: "3px 8px" }}>
                <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 10, fontWeight: 700 }}>P {Math.round(totals.protein)}g</span>
              </div>
              <div style={{ background: `${C.cool}22`, borderRadius: 6, padding: "3px 8px" }}>
                <span style={{ fontFamily: FONT_MONO, color: C.cool, fontSize: 10, fontWeight: 700 }}>C {Math.round(totals.carbs)}g</span>
              </div>
              <div style={{ background: `${C.warm}22`, borderRadius: 6, padding: "3px 8px" }}>
                <span style={{ fontFamily: FONT_MONO, color: C.warm, fontSize: 10, fontWeight: 700 }}>F {Math.round(totals.fat)}g</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <MacroBar label="Protein" val={totals.protein} goal={MACRO_GOALS.protein} color={C.accent} />
          <MacroBar label="Carbs" val={totals.carbs} goal={MACRO_GOALS.carbs} color={C.cool} />
          <MacroBar label="Fat" val={totals.fat} goal={MACRO_GOALS.fat} color={C.warm} />
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center gap-2 px-3 py-2.5 mb-4 hover-lift">
          <Search size={16} color={C.low} />
          <input value={foodQuery} onChange={(e) => setFoodQuery(e.target.value)} placeholder="Search 28 foods (try 'chicken', 'rice', 'nuts')…"
            style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, background: "transparent", outline: "none", width: "100%" }} />
          {foodQuery && <button onClick={() => setFoodQuery("")} className="hover-pop"><X size={14} color={C.low} /></button>}
        </div>

        {foodQuery && (
          <div className="mb-5">
            {searchResults.length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }}>No foods match "{foodQuery}" — try "chicken", "rice" or "nuts".</div>}
            {searchResults.map((f, i) => (
              <button key={i} onClick={() => { sound.tap(); onAdd(f); setFoodQuery(""); }} style={{ background: C.raised, border: `1px solid ${C.cool}44`, borderRadius: 12 }}
                className="w-full flex items-center justify-between px-4 py-3 mb-2 text-left active:scale-[0.99] transition-transform hover-lift">
                <div>
                  <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13 }}>{f.label}</div>
                  <div style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 10 }} className="mt-0.5">P{f.protein} · C{f.carbs} · F{f.fat}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: FONT_MONO, color: C.cool, fontSize: 11 }}>{f.cal} kcal</span>
                  <Plus size={16} color={C.cool} />
                </div>
              </button>
            ))}
          </div>
        )}

        <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>Quick add</span>
        <div className="mt-3 mb-5">
          {QUICK_FOODS.map((f, i) => (
            <button key={i} onClick={() => { sound.tap(); onAdd(f); showToast(`${f.label} added (+${f.cal} kcal)`, "success", <Plus size={14} color={C.cool} />); }} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }}
              className="w-full flex items-center justify-between px-4 py-3 mb-2 active:scale-[0.99] transition-transform hover-lift">
              <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, textAlign: "left", flex: 1 }}>{f.label}</span>
              <span style={{ fontFamily: FONT_MONO, color: C.mid, fontSize: 11, flexShrink: 0 }}>{f.cal} kcal</span>
            </button>
          ))}
        </div>

        <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>Today's log</span>
        <div className="mt-3">
          {entries.length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }} className="mt-2">Nothing logged yet — add something above.</div>}
          {entries.map((e) => (
            <div key={e.id} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center justify-between px-4 py-3 mb-2 hover-lift">
              <div>
                <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13 }}>{e.label}</div>
                <div style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 10 }} className="mt-0.5">{e.cal} kcal · P{e.protein} C{e.carbs} F{e.fat}</div>
              </div>
              <button onClick={() => { sound.tap(); onRemove(e.id); }} className="hover-pop"><X size={14} color={C.low} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- LEADERBOARD ---------------- */
function Leaderboard({ entries, loading, optedIn, onToggleOptIn, username, onBack }) {
  return (
    <div className="h-full flex flex-col">
      <TopBar title="Community leaderboard" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 flex items-center justify-between gap-3 hover-lift">
          <div>
            <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>Share my streak</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-1">Visible to everyone else using this app, under "{username}".</div>
          </div>
          <Toggle checked={optedIn} onChange={onToggleOptIn} />
        </div>
        {loading && <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }}>Loading leaderboard…</div>}
        {!loading && entries.length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }}>No one's on the board yet — be the first to opt in.</div>}
        {entries.map((e, i) => (
          <div key={e.username} style={{ background: e.username === username ? "#FFF7E6" : C.raised, border: `1px solid ${e.username === username ? C.accent : C.line}`, borderRadius: 12 }}
            className="flex items-center justify-between px-4 py-3 mb-2 hover-lift">
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 12, width: 18 }}>{i + 1}</span>
              <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>{e.username}{e.username === username ? " (you)" : ""}</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={12} color={C.warm} />
              <span style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 12 }}>{e.streak}d</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- SOUND SETTINGS ---------------- */
function SoundSettings({ enabled, onToggle, onBack }) {
  return (
    <div className="h-full flex flex-col">
      <TopBar title="Sound & notifications" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-3 flex items-center justify-between gap-3 hover-lift">
          <div className="flex items-center gap-3">
            {enabled ? <Volume2 size={18} color={C.accent} /> : <VolumeX size={18} color={C.low} />}
            <div>
              <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>Sound effects</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-1">Set-complete chime, rest-timer alert, workout fanfare.</div>
            </div>
          </div>
          <Toggle checked={enabled} onChange={onToggle} />
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => sound.setComplete()} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 10, fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="flex-1 py-2.5 hover-pop">Test set chime</button>
          <button onClick={() => sound.restDone()} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 10, fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="flex-1 py-2.5 hover-pop">Test rest alert</button>
          <button onClick={() => sound.finish()} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 10, fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="flex-1 py-2.5 hover-pop">Test fanfare</button>
        </div>
        <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11, lineHeight: 1.7 }} className="mt-4">
          Background push notifications (a rest-timer alert while your phone is locked) need a native mobile build — a browser tab can't do this, so it isn't included here.
        </div>
      </div>
    </div>
  );
}

/* ---------------- MUSIC SETTINGS ---------------- */
function MusicSettings({ enabled, track, onToggle, onSelect, onBack }) {
  return (
    <div className="h-full flex flex-col">
      <TopBar title="Music" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 flex items-center justify-between gap-3 hover-lift">
          <div className="flex items-center gap-3">
            <Music size={18} color={enabled ? C.accent : C.low} />
            <div>
              <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>Background music</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-1">Your MP3 tracks + synthesized options.</div>
            </div>
          </div>
          <Toggle checked={enabled} onChange={onToggle} />
        </div>
        <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>Your tracks</span>
        <div className="mt-3">
          {MUSIC_TRACKS.map((tr) => {
            const active = enabled && track === tr.id;
            const isFile = !!tr.file;
            return (
              <button key={tr.id} onClick={() => { sound.tap(); onSelect(tr.id); }}
                style={{ background: active ? C.raised : C.surface, border: `1px solid ${active ? tr.color : C.line}`, borderRadius: 14 }}
                className="w-full flex items-center justify-between px-4 py-3.5 mb-2.5 text-left hover-lift">
                <div className="flex items-center gap-3">
                  <div style={{ background: `${tr.color}22`, borderRadius: 10 }} className="p-2">
                    <Music size={16} color={tr.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>{tr.name}</div>
                    <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{tr.desc}</div>
                    {isFile && <div style={{ fontFamily: FONT_MONO, color: C.cool, fontSize: 9 }} className="mt-0.5">MP3</div>}
                  </div>
                </div>
                {active ? <Pause size={16} color={tr.color} /> : <Play size={16} color={C.low} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- LANGUAGE SETTINGS ---------------- */
function LanguageSettings({ lang, onSelect, onBack }) {
  const { t } = useLang();
  return (
    <div className="h-full flex flex-col">
      <TopBar title={t("language")} onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.7 }} className="mb-4">
          {t("chooseLanguage")}
        </div>
        {LANGUAGES.map((l) => (
          <button key={l.code} onClick={() => { sound.tap(); onSelect(l.code); }}
            style={{ background: lang === l.code ? C.raised : C.surface, border: `1px solid ${lang === l.code ? C.accent : C.line}`, borderRadius: 14 }}
            className="w-full flex items-center justify-between px-4 py-3.5 mb-2.5 text-left hover-lift">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 20 }}>{LANG_FLAGS[l.code]}</span>
              <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>{l.label}</span>
            </div>
            {lang === l.code && <Check size={16} color={C.accent} />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- WEIGHT & BMI ---------------- */
function WeightBmi({ body, onSave, onBack }) {
  const [weight, setWeight] = useState(body.weight);
  const [height, setHeight] = useState(body.height);
  const bmi = height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : "—";
  const bmiColor = bmi === "—" ? C.mid : bmi < 18.5 ? C.cool : bmi < 25 ? C.accent : bmi < 30 ? C.gold : C.warm;
  const bmiLabel = bmi === "—" ? "Set height" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Weight & BMI" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ background: `linear-gradient(155deg,${C.raised} 0%,${C.surface} 100%)`, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-5 text-center mb-4 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide">Your BMI</div>
          <div style={{ fontFamily: FONT_MONO, color: bmiColor, fontSize: 44, fontWeight: 700 }} className="mt-1">{bmi}</div>
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13 }}>{bmiLabel}</div>
          <div style={{ background: C.line, borderRadius: 999, height: 8 }} className="mt-4 overflow-hidden relative">
            <div style={{ position: "absolute", top: -3, left: `${Math.min(100, Math.max(0, (bmi === "—" ? 20 : bmi) / 40 * 100))}%`, width: 14, height: 14, borderRadius: "50%", background: bmiColor, transform: "translateX(-50%)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "18.5%", height: "100%", background: C.cool, opacity: 0.3 }} />
            <div style={{ position: "absolute", top: 0, left: "18.5%", width: "6.5%", height: "100%", background: C.accent, opacity: 0.3 }} />
            <div style={{ position: "absolute", top: 0, left: "25%", width: "5%", height: "100%", background: C.gold, opacity: 0.3 }} />
            <div style={{ position: "absolute", top: 0, left: "30%", width: "10%", height: "100%", background: C.warm, opacity: 0.3 }} />
          </div>
          <div className="flex justify-between mt-1">
            <span style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 9 }}>15</span>
            <span style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 9 }}>40</span>
          </div>
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">Weight (kg)</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setWeight((w) => Math.max(30, w - 0.5))} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop"><Minus size={16} color={C.mid} /></button>
            <input value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} type="number"
              style={{ fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 10, color: C.hi, fontSize: 20, fontWeight: 700, padding: "8px 12px", width: "100%", textAlign: "center" }} />
            <button onClick={() => setWeight((w) => w + 0.5)} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop"><Plus size={16} color={C.mid} /></button>
          </div>
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">Height (cm)</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setHeight((h) => Math.max(120, h - 1))} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop"><Minus size={16} color={C.mid} /></button>
            <input value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} type="number"
              style={{ fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 10, color: C.hi, fontSize: 20, fontWeight: 700, padding: "8px 12px", width: "100%", textAlign: "center" }} />
            <button onClick={() => setHeight((h) => h + 1)} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2.5 hover-pop"><Plus size={16} color={C.mid} /></button>
          </div>
        </div>

        <button onClick={() => { sound.setComplete(); onSave(weight, height); }}
          style={{ background: C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
          className="w-full rounded-xl py-3.5 text-sm hover-glow">
          Save
        </button>
      </div>
    </div>
  );
}

/* ---------------- MEAL OPTIONS ---------------- */
function MealOptions({ onBack }) {
  const [selected, setSelected] = useState("lean");
  const plan = MEAL_PLANS.find((p) => p.id === selected);
  const items = MEAL_ITEMS[selected] || [];

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Meal options" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {MEAL_PLANS.map((p) => (
            <button key={p.id} onClick={() => { sound.tap(); setSelected(p.id); }}
              style={{
                fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
                padding: "7px 14px", borderRadius: 999,
                background: selected === p.id ? p.color : C.raised,
                color: selected === p.id ? C.bg : C.mid,
                border: selected === p.id ? "none" : `1px solid ${C.line}`,
              }}
              className="hover-pop">
              {p.name}
            </button>
          ))}
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mt-4 mb-4 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }}>{plan.desc}</div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div className="text-center">
              <div style={{ fontFamily: FONT_MONO, color: plan.color, fontSize: 16, fontWeight: 700 }}>{plan.cal}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>kcal</div>
            </div>
            <div className="text-center">
              <div style={{ fontFamily: FONT_MONO, color: plan.color, fontSize: 16, fontWeight: 700 }}>{plan.protein}g</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>protein</div>
            </div>
            <div className="text-center">
              <div style={{ fontFamily: FONT_MONO, color: plan.color, fontSize: 16, fontWeight: 700 }}>{plan.carbs}g</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>carbs</div>
            </div>
            <div className="text-center">
              <div style={{ fontFamily: FONT_MONO, color: plan.color, fontSize: 16, fontWeight: 700 }}>{plan.fat}g</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>fat</div>
            </div>
          </div>
        </div>

        <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>Sample day</span>
        <div className="mt-3">
          {items.map((m, i) => (
            <div key={i} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center justify-between px-4 py-3 mb-2 hover-lift">
              <div>
                <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>{m.meal}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{m.items}</div>
              </div>
              <span style={{ fontFamily: FONT_MONO, color: plan.color, fontSize: 12 }}>{m.cal} kcal</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- WEEKLY GOALS (interactive) ---------------- */
function WeeklyGoals({ goals, onUpdate, onBack }) {
  const list = goals || WEEKLY_GOALS;
  const overall = Math.round(list.reduce((a, g) => a + Math.min(100, (g.done / g.target) * 100), 0) / list.length);
  const completed = list.filter((g) => g.done >= g.target).length;

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Weekly goals" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {/* Overall summary */}
        <div style={{ background: `linear-gradient(155deg,${C.raised} 0%,${C.surface} 100%)`, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-5 mb-4 flex items-center gap-4 hover-lift">
          <div className="relative flex items-center justify-center">
            <Ring pct={overall} size={72} stroke={7} color={C.accent} />
            <span style={{ position: "absolute", fontFamily: FONT_MONO, color: C.hi, fontSize: 15, fontWeight: 700 }}>{overall}%</span>
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 17, fontWeight: 700 }}>{completed}/{list.length} goals hit</div>
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="mt-1">
              {overall >= 100 ? <>Perfect week — all goals smashed! <i className="fa-solid fa-champagne-glasses" /></> : overall >= 75 ? "Almost there — keep pushing!" : overall >= 50 ? "Good progress — keep going." : "Getting started — every rep counts."}
            </div>
          </div>
        </div>

        {list.map((g) => {
          const pct = Math.min(100, (g.done / g.target) * 100);
          const isDone = g.done >= g.target;
          return (
            <div key={g.id} style={{ background: C.raised, border: `1px solid ${isDone ? g.color : C.line}`, borderRadius: 16 }} className="p-4 mb-3 hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div style={{ background: `${g.color}22`, borderRadius: 10 }} className="p-2">
                    <g.icon size={18} color={g.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>{g.label}</div>
                    <div style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 11 }}>{g.done} / {g.target}</div>
                  </div>
                </div>
                <span style={{ fontFamily: FONT_MONO, color: isDone ? C.cool : g.color, fontSize: 14, fontWeight: 700 }}>
                  {isDone ? <><i className="fa-solid fa-check" style={{ fontSize: 12 }} /> Done</> : `${Math.round(pct)}%`}
                </span>
              </div>
              <div style={{ background: C.line, borderRadius: 999, height: 8 }} className="overflow-hidden">
                <div style={{ background: g.color, width: `${pct}%`, height: "100%", borderRadius: 999, transition: "width 0.4s ease" }} />
              </div>
              {/* Interactive controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdate && onUpdate(g.id, Math.max(0, g.done - 1))}
                    style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-1.5 hover-pop">
                    <Minus size={13} color={C.mid} />
                  </button>
                  <button onClick={() => onUpdate && onUpdate(g.id, Math.min(g.target, g.done + 1))}
                    style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-1.5 hover-pop">
                    <Plus size={13} color={C.mid} />
                  </button>
                  <span style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }}>adjust progress</span>
                </div>
                <button onClick={() => { sound.setComplete(); onUpdate && onUpdate(g.id, g.target); }}
                  style={{ background: isDone ? C.cool : C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg, borderRadius: 8 }}
                  className="px-3 py-1.5 text-xs hover-pop">
                  {isDone ? "Completed" : "Mark done"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- CHALLENGES ---------------- */
function Challenges({ onBack }) {
  return (
    <div className="h-full flex flex-col">
      <TopBar title="Challenges" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {CHALLENGES.map((ch) => {
          const pct = Math.min(100, (ch.progress / ch.total) * 100);
          return (
            <div key={ch.id} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-3 hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div style={{ background: `${ch.color}22`, borderRadius: 10 }} className="p-2">
                    <ch.icon size={18} color={ch.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>{ch.name}</div>
                    <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{ch.desc}</div>
                  </div>
                </div>
                <span style={{ fontFamily: FONT_MONO, color: ch.color, fontSize: 13, fontWeight: 700 }}>{ch.progress}/{ch.total}</span>
              </div>
              <div style={{ background: C.line, borderRadius: 999, height: 8 }} className="overflow-hidden">
                <div style={{ background: ch.color, width: `${pct}%`, height: "100%", borderRadius: 999, transition: "width 0.4s ease" }} />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <Award size={12} color={C.gold} />
                <span style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }}>Reward: {ch.reward}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- EQUIPMENT ---------------- */
function Equipment({ onBack }) {
  return (
    <div className="h-full flex flex-col">
      <TopBar title="Equipment" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.7 }} className="mb-4">
          The equipment you have shapes which exercises we recommend. All exercises in the library are tagged with the gear they need.
        </div>
        {EQUIPMENT.map((eq) => (
          <div key={eq.id} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-3 flex items-center gap-3 hover-lift">
            <div style={{ background: `${eq.color}22`, borderRadius: 10 }} className="p-2.5">
              <eq.icon size={20} color={eq.color} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>{eq.name}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{eq.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FEEDBACK ---------------- */
function Feedback({ onBack, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (rating === 0) return;
    sound.setComplete();
    onSubmit({ rating, text, date: new Date().toISOString() });
    setSubmitted(true);
  };

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Feedback" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {submitted ? (
          <div className="text-center mt-16">
            <div style={{ background: `${C.accent}22`, borderRadius: 20 }} className="w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <Check size={28} color={C.accent} strokeWidth={3} />
            </div>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 19, fontWeight: 700 }}>Thank you!</h2>
            <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13 }} className="mt-2">Your feedback helps us improve ForgeUp.</p>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.7 }} className="mb-4">
              How's your experience so far? Your honest feedback helps us build a better app.
            </div>
            <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
              <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-3">Rate your experience</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => { sound.tap(); setRating(n); }}
                    style={{ background: rating >= n ? `${C.gold}33` : C.surface, border: `1px solid ${rating >= n ? C.gold : C.line}`, borderRadius: 10 }}
                    className="flex-1 py-2.5 flex items-center justify-center hover-pop">
                    <Star size={18} color={rating >= n ? C.gold : C.low} fill={rating >= n ? C.gold : "none"} />
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
              <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">Tell us more (optional)</div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="What do you love? What could be better?"
                style={{ fontFamily: FONT_BODY, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 10, color: C.hi, fontSize: 13, padding: "10px 12px", width: "100%", resize: "none", outline: "none" }} />
            </div>
            <button onClick={submit} disabled={rating === 0}
              style={{ background: rating > 0 ? C.accent : C.line, fontFamily: FONT_BODY, fontWeight: 700, color: rating > 0 ? C.bg : C.low }}
              className="w-full rounded-xl py-3.5 text-sm hover-glow">
              Submit feedback
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- RATE US ---------------- */
function RateUs({ onBack }) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Rate us" onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {submitted ? (
          <div className="text-center mt-16">
            <div style={{ background: `${C.gold}22`, borderRadius: 20 }} className="w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <Star size={28} color={C.gold} fill={C.gold} />
            </div>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 19, fontWeight: 700 }}>Thanks for rating!</h2>
            <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13 }} className="mt-2">Your rating means the world to us.</p>
          </div>
        ) : (
          <>
            <div className="text-center mt-10 mb-6">
              <div style={{ background: `${C.gold}22`, borderRadius: 20 }} className="w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Star size={28} color={C.gold} fill={C.gold} />
              </div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 20, fontWeight: 700 }}>Enjoying ForgeUp?</h2>
              <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13 }} className="mt-2">Tap a star to rate the app.</p>
            </div>
            <div className="flex gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => { sound.tap(); setRating(n); }}
                  style={{ background: "transparent", border: "none" }} className="p-1 hover-pop">
                  <Star size={34} color={rating >= n ? C.gold : C.line} fill={rating >= n ? C.gold : "none"} strokeWidth={1.5} />
                </button>
              ))}
            </div>
            <button onClick={() => { sound.setComplete(); setSubmitted(true); }} disabled={rating === 0}
              style={{ background: rating > 0 ? C.accent : C.line, fontFamily: FONT_BODY, fontWeight: 700, color: rating > 0 ? C.bg : C.low }}
              className="w-full rounded-xl py-3.5 text-sm hover-glow">
              Submit rating
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_NAMES_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTH_NAMES_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MONTH_NAMES_DE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const MONTH_NAMES_IT = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const MONTH_NAMES_PT = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

/* ---------------- CALENDAR VIEW (real current month + navigation) ---------------- */
function CalendarView({ days, onBack }) {
  const { t, lang } = useLang();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const entries = Object.entries(days || {});
  const activeDays = entries.filter(([, d]) => d && d.completed > 0).length;
  const totalVolume = entries.reduce((a, [, d]) => a + (d.volume || 0), 0);
  const totalKcal = Math.round(totalVolume * 0.05);
  const streak = activeDays;

  const monthNames = lang === "es" ? MONTH_NAMES_ES : lang === "fr" ? MONTH_NAMES_FR : lang === "de" ? MONTH_NAMES_DE : lang === "it" ? MONTH_NAMES_IT : lang === "pt" ? MONTH_NAMES_PT : MONTH_NAMES;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  // Build the calendar grid with correct starting weekday
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const changeMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const today = new Date();
  const isToday = (d) => today.getDate() === d && today.getMonth() === viewMonth && today.getFullYear() === viewYear;

  return (
    <div className="h-full flex flex-col">
      <TopBar title={t("calendar")} onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div className="flex gap-3 mb-4">
          <StatCard icon={Flame} label={t("dailyStreak")} value={`${streak}d`} accent={C.warm} />
          <StatCard icon={Activity} label={t("workoutsLogged")} value={`${activeDays}`} accent={C.accent} />
          <StatCard icon={HeartPulse} label={t("totalKcalBurned")} value={`${totalKcal}`} accent={C.cool} />
        </div>

        {/* Real month calendar with navigation */}
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-4 mb-4 hover-lift">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => changeMonth(-1)} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2 hover:opacity-70 transition-opacity hover-pop">
              <ChevronLeft size={16} color={C.mid} />
            </button>
            <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>
              {monthNames[viewMonth]} {viewYear}
            </div>
            <button onClick={() => changeMonth(1)} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2 hover:opacity-70 transition-opacity hover-pop">
              <ChevronRight size={16} color={C.mid} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 9, textAlign: "center" }}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((d, i) => d === null ? (
              <div key={i} style={{ width: 30, height: 30 }} />
            ) : (
              <div key={i} className="flex flex-col items-center">
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: isToday(d) ? C.accent : C.surface,
                  border: isToday(d) ? "none" : `1px dashed ${C.line}`,
                  color: isToday(d) ? C.bg : C.mid,
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }} className="flex items-center justify-center hover:opacity-80 transition-opacity hover-pop">
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700 }}>{d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>{t("dayProgress")}</span>
        <div className="mt-3">
          {entries.length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }}>{t("openedApp")}</div>}
          {entries.slice(-10).reverse().map(([date, d]) => (
            <div key={date} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center justify-between px-4 py-3 mb-2 hover-lift">
              <div>
                <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 12, fontWeight: 700 }}>{date}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }} className="mt-0.5">{t("howDid")}</div>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ background: C.line, borderRadius: 999, height: 5, width: 60 }} className="overflow-hidden">
                  <div style={{ background: C.accent, width: `${Math.min(100, (d.completed / 5) * 100)}%`, height: "100%" }} />
                </div>
                <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 12, fontWeight: 700 }}>{Math.round((d.completed / 5) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- BODY MEASUREMENTS (form + trend chart) ---------------- */
function BodyMeasurements({ body, onSave, onBack }) {
  const { t } = useLang();
  const [weight, setWeight] = useState(body.weight);
  const [waist, setWaist] = useState(80);
  const [chest, setChest] = useState(100);
  const [arms, setArms] = useState(35);
  const history = body.history || [];

  const trendData = history.length > 1
    ? history.map((h, i) => ({ i, v: h.weight }))
    : [
        { i: 0, v: Math.round(body.weight + 1.2) },
        { i: 1, v: Math.round(body.weight + 0.8) },
        { i: 2, v: body.weight },
      ];

  return (
    <div className="h-full flex flex-col">
      <TopBar title={t("measurementsPage")} onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.7 }} className="mb-4">
          {t("measurementsDesc")}
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 14, fontWeight: 700 }} className="mb-2">{t("weightTrend")}</div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={trendData}>
              <Line type="monotone" dataKey="v" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3, fill: C.accent }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-3">{t("addMeasurement")}</div>
          {[
            { label: t("weightLabel") + " (kg)", val: weight, set: setWeight, step: 0.5 },
            { label: t("waist") + " (cm)", val: waist, set: setWaist, step: 1 },
            { label: t("chest") + " (cm)", val: chest, set: setChest, step: 1 },
            { label: t("arms") + " (cm)", val: arms, set: setArms, step: 1 },
          ].map((f) => (
            <div key={f.label} className="mb-3">
              <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="mb-1">{f.label}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => f.set(Math.max(0, f.val - f.step))} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-1.5 hover-pop"><Minus size={13} color={C.mid} /></button>
                <input value={f.val} onChange={(e) => f.set(Number(e.target.value) || 0)} type="number"
                  style={{ fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, color: C.hi, fontSize: 14, fontWeight: 700, padding: "6px 10px", width: "100%", textAlign: "center" }} />
                <button onClick={() => f.set(f.val + f.step)} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-1.5 hover-pop"><Plus size={13} color={C.mid} /></button>
              </div>
            </div>
          ))}
          <button onClick={() => { sound.setComplete(); onSave(weight, body.height); }}
            style={{ background: C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
            className="w-full rounded-xl py-3 text-sm hover-glow">
            {t("save")}
          </button>
        </div>

        <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>{t("history")}</span>
        <div className="mt-3">
          {history.length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12 }}>{t("nothingLogged")}</div>}
          {history.slice(-5).reverse().map((h, i) => (
            <div key={i} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center justify-between px-4 py-3 mb-2 hover-lift">
              <span style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 12 }}>{h.date}</span>
              <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 12, fontWeight: 700 }}>{h.weight} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- WEARABLE SYNC (manual health data entry) ---------------- */
function WearableSync({ health, onSave, onBack }) {
  const { t } = useLang();
  const [steps, setSteps] = useState(health?.steps || 8000);
  const [calories, setCalories] = useState(health?.calories || 450);
  const [sleep, setSleep] = useState(health?.sleep || 7.5);
  const [heartRate, setHeartRate] = useState(health?.heartRate || 72);

  return (
    <div className="h-full flex flex-col">
      <TopBar title={t("syncHealth")} onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.7 }} className="mb-4">
          {t("syncDesc")}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 hover-lift">
            <Footprints size={18} color={C.cool} />
            <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 20, fontWeight: 700 }} className="mt-2">{steps.toLocaleString()}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("stepsLabel")}</div>
          </div>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 hover-lift">
            <Flame size={18} color={C.warm} />
            <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 20, fontWeight: 700 }} className="mt-2">{calories}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("activeCalories")}</div>
          </div>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 hover-lift">
            <Moon size={18} color={C.gold} />
            <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 20, fontWeight: 700 }} className="mt-2">{sleep}h</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("sleep")}</div>
          </div>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 hover-lift">
            <HeartPulse size={18} color={C.warm} />
            <div style={{ fontFamily: FONT_MONO, color: C.hi, fontSize: 20, fontWeight: 700 }} className="mt-2">{heartRate}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("heartRate")} {t("hbpm")}</div>
          </div>
        </div>

        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-3">{t("logEntry")}</div>
          {[
            { label: t("stepsLabel"), val: steps, set: setSteps, step: 500 },
            { label: t("activeCalories") + " (kcal)", val: calories, set: setCalories, step: 50 },
            { label: t("sleep") + " (h)", val: sleep, set: setSleep, step: 0.5 },
            { label: t("heartRate") + " (bpm)", val: heartRate, set: setHeartRate, step: 1 },
          ].map((f) => (
            <div key={f.label} className="mb-3">
              <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="mb-1">{f.label}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => f.set(Math.max(0, f.val - f.step))} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-1.5 hover-pop"><Minus size={13} color={C.mid} /></button>
                <input value={f.val} onChange={(e) => f.set(Number(e.target.value) || 0)} type="number"
                  style={{ fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, color: C.hi, fontSize: 14, fontWeight: 700, padding: "6px 10px", width: "100%", textAlign: "center" }} />
                <button onClick={() => f.set(f.val + f.step)} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-1.5 hover-pop"><Plus size={13} color={C.mid} /></button>
              </div>
            </div>
          ))}
          <button onClick={() => { sound.setComplete(); onSave({ steps, calories, sleep, heartRate }); }}
            style={{ background: C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
            className="w-full rounded-xl py-3 text-sm hover-glow">
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PUSH NOTIFICATIONS ---------------- */
function PushNotifications({ onBack }) {
  const { t } = useLang();
  const showToast = useContext(ToastContext);
  const [permission, setPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "denied");

  const requestPermission = async () => {
    try {
      const p = await Notification.requestPermission();
      setPermission(p);
      if (p === "granted") {
        new Notification("ForgeUp", { body: t("restDone") });
      }
    } catch (e) { /* unsupported */ }
  };

  const sendTest = () => {
    showToast(<><i className="fa-solid fa-circle-check" style={{ fontSize: 12 }} /> Test notification sent!</>, "success", <Bell size={14} color={C.cool} />);
    sound.setComplete();
    if (permission === "granted") {
      try { new Notification("ForgeUp", { body: t("restDone") }); } catch (e) {}
    }
  };

  return (
    <div className="h-full flex flex-col">
      <TopBar title={t("pushNotif")} onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ background: `${C.cool}22`, borderRadius: 10 }} className="p-2.5">
              <Bell size={20} color={C.cool} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>{t("pushNotif")}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{t("pushNotifDesc")}</div>
            </div>
          </div>
          <div style={{ fontFamily: FONT_MONO, color: permission === "granted" ? C.cool : C.warm, fontSize: 12, fontWeight: 700 }} className="mb-3">
            {permission === "granted" ? <><i className="fa-solid fa-circle-check" style={{ fontSize: 12 }} /> Granted</> : permission === "denied" ? <><i className="fa-solid fa-circle-xmark" style={{ fontSize: 12 }} /> Blocked</> : <><i className="fa-solid fa-circle" style={{ fontSize: 8 }} /> Prompt</>}
          </div>
          {permission !== "granted" && (
            <button onClick={requestPermission} style={{ background: C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
              className="w-full rounded-xl py-3 text-sm hover-glow">
              {t("enableNotif")}
            </button>
          )}
          {permission === "granted" && (
            <button onClick={sendTest} style={{ background: C.cool, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
              className="w-full rounded-xl py-3 text-sm hover-glow">
              {t("testNotif")}
            </button>
          )}
          {permission === "denied" && (
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11, lineHeight: 1.7 }} className="mt-3">
              {t("notifDenied")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- HONEST INFO SCREENS ---------------- */
function InfoScreen({ title, body, onBack }) {
  return (
    <div className="h-full flex flex-col">
      <TopBar title={title} onBack={onBack} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 hover-lift">
          <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13, lineHeight: 1.8 }}>{body}</p>
        </div>
      </div>
    </div>
  );
}

const INFO_CONTENT = {
  plan: "Right now everyone sees the same fixed Push/Pull/Legs plan. A real training-plan builder — pick a split, set weekly frequency, auto-generate the block — is the natural next feature, and it would reuse the same rule-based progression logic already suggesting your +2.5kg bench jump.",
  privacy: "What's stored and where: your profile, streak, workout history and nutrition log are saved privately, tied to your account, and never shown to anyone else. If you opt into the community leaderboard, only your chosen display name and current streak become visible to other users — nothing else.",
};

/* ---------------- PROFILE ---------------- */
const BADGE_DEFS = [
  { id: "first", name: "First Steps", icon: <i className="fa-solid fa-bullseye" />, desc: "Complete your first workout" },
  { id: "centurion", name: "Centurion", icon: <i className="fa-solid fa-trophy" />, desc: "Log 100 workouts" },
  { id: "heavy", name: "Heavy Lifter", icon: <i className="fa-solid fa-dumbbell" />, desc: "Hit 100kg on any lift" },
  { id: "streak7", name: "Week Warrior", icon: <i className="fa-solid fa-fire" />, desc: "7-day streak" },
  { id: "streak14", name: "Fortnight Forge", icon: <i className="fa-solid fa-bolt" />, desc: "14-day streak" },
];

function Profile({ profile, state, onUsernameChange, onOpenScreen, currentUser, onSignOut }) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.username);
  const { t } = useLang();
  const unlockedBadges = (state.badges || []).map((id) => BADGE_DEFS.find((b) => b.id === id)).filter(Boolean);
  const lockedBadges = BADGE_DEFS.filter((b) => !(state.badges || []).includes(b.id));

  const menu = [
    { key: "social", label: t("communityChallenges"), icon: Users },
    { key: "periodization", label: t("periodizationBlocks"), icon: Calendar },
    { key: "recovery", label: t("recoveryHrv"), icon: HeartPulse },
    { key: "voice", label: t("voiceCoach"), icon: Mic },
    { key: "goals", label: t("goals"), icon: Target },
    { key: "calendar", label: t("calendar"), icon: Calendar },
    { key: "challenges", label: t("challenges"), icon: Flag },
    { key: "equipment", label: t("equipment"), icon: Wrench },
    { key: "meals", label: t("meals"), icon: Apple },
    { key: "weight", label: t("weight"), icon: Scale },
    { key: "nutrition", label: t("nutrition"), icon: Utensils },
    { key: "leaderboard", label: t("leaderboard"), icon: Users },
    { key: "language", label: t("language"), icon: Globe },
    { key: "music", label: t("music"), icon: Music },
    { key: "sound", label: t("sound"), icon: Bell },
    { key: "notifications", label: t("pushNotif"), icon: Bell },
    { key: "feedback", label: t("feedback"), icon: MessageSquare },
    { key: "rate", label: t("rate"), icon: Star },
    { key: "measurements", label: t("measurements"), icon: Ruler },
    { key: "plan", label: t("plan"), icon: Calendar },
    { key: "wearable", label: t("wearable"), icon: Watch },
    { key: "privacy", label: t("privacy"), icon: Shield },
  ];

  const focusLabel = state.onboarding.focus ? t(FOCUS_AREAS.find((f) => f.id === state.onboarding.focus)?.label) : null;
  const bodyLabel = state.onboarding.bodyType ? t(BODY_TYPES.find((b) => b.id === state.onboarding.bodyType)?.label) : null;

  return (
    <div className="h-full flex flex-col">
      <TopBar title={t("profile")} />
      <div className="px-5 pb-28 overflow-y-auto flex-1">
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 flex items-center gap-3 mb-5 hover-lift">
          <Logo size={52} />
          <div className="flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} autoFocus
                  style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "4px 8px", width: "100%" }} />
                <button onClick={() => { onUsernameChange(nameDraft.trim() || profile.username); setEditingName(false); sound.tap(); }}
                  style={{ background: C.accent, borderRadius: 8 }} className="p-1.5 hover-pop"><Check size={14} color={C.bg} strokeWidth={3} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 16, fontWeight: 700 }}>{profile.username}</div>
                <button onClick={() => { setNameDraft(profile.username); setEditingName(true); }} style={{ fontFamily: FONT_BODY, color: C.cool, fontSize: 11 }} className="hover-pop">{t("edit")}</button>
              </div>
            )}
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="mt-0.5">
              {[focusLabel, bodyLabel].filter(Boolean).join(" · ") || <>{t("hypertrophyBeginner")} <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} /> {t("intermediate")}</>}
            </div>
          </div>
        </div>

        {/* Badges showcase */}
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-5 hover-lift">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 14, fontWeight: 700 }}>{t("achievementBadges")}</span>
            <span style={{ fontFamily: FONT_MONO, color: C.gold, fontSize: 12, fontWeight: 700 }}>{unlockedBadges.length}/{BADGE_DEFS.length}</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {BADGE_DEFS.map((b) => {
              const unlocked = (state.badges || []).includes(b.id);
              return (
                <div key={b.id} className="flex flex-col items-center gap-1 hover-pop" title={b.desc}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: unlocked ? `${C.gold}22` : C.surface,
                    border: `1px solid ${unlocked ? C.gold : C.line}`,
                    opacity: unlocked ? 1 : 0.4,
                    filter: unlocked ? "none" : "grayscale(1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>
                    {b.icon}
                  </div>
                  <span style={{ fontFamily: FONT_BODY, color: unlocked ? C.hi : C.low, fontSize: 8, textAlign: "center", lineHeight: 1.2 }}>{b.name}</span>
                </div>
              );
            })}
          </div>
        </div>
        {menu.map((item) => (
          <button key={item.key} onClick={() => { sound.tap(); onOpenScreen(item.key); }} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }}
            className="w-full flex items-center justify-between px-4 py-3.5 mb-2 text-left hover-lift">
            <div className="flex items-center gap-3">
              <item.icon size={16} color={C.mid} />
              <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5 }}>{item.label}</span>
            </div>
            <ChevronRight size={16} color={C.low} />
          </button>
        ))}

        {/* Account section */}
        {currentUser && (
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4">
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">{t("account")}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12.5 }} className="mb-3">
              {t("signedInAs")} <strong>{currentUser.email}</strong>
            </div>
            <button
              onClick={onSignOut}
              style={{ background: `${C.warm}15`, border: `1px solid ${C.warm}40`, borderRadius: 12, fontFamily: FONT_BODY, fontWeight: 600, color: C.warm }}
              className="w-full py-3 flex items-center justify-center gap-2 text-sm hover-lift"
            >
              <LogOut size={15} /> {t("logOut")}
            </button>
          </div>
        )}

        {/* Designer credit */}
        <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10, letterSpacing: 0.5 }} className="mt-6 mb-2 text-center uppercase tracking-widest">
          {t("designedBy")}
        </div>
      </div>
    </div>
  );
}

/* ---------------- APP SHELL ---------------- */
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [session, setSession] = useState(null);
  const [profileScreen, setProfileScreen] = useState(null);
  const [prCelebrated, setPrCelebrated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadLabel, setLoadLabel] = useState("Connecting…");

  const [state, setState] = useState(defaultState());
  const [board, setBoard] = useState([]);
  const [boardLoading, setBoardLoading] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [cloudSynced, setCloudSynced] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showPeriodization, setShowPeriodization] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showVoiceCoach, setShowVoiceCoach] = useState(false);
  const [showRecoveryWorkout, setShowRecoveryWorkout] = useState(false);

  const lang = state.settings.language;
  const t = (k) => T[lang]?.[k] || T.en[k] || k;
  const langValue = useMemo(() => ({ lang, t }), [lang]);

  // ---- Boot sequence ----
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      setLoadLabel("Connecting to your account…"); setLoadProgress(15);
      await new Promise((r) => setTimeout(r, 150));
      setLoadLabel("Loading training history…"); setLoadProgress(45);
      const loaded = await loadState();
      setLoadLabel("Loading nutrition log…"); setLoadProgress(70);
      await new Promise((r) => setTimeout(r, 120));
      setLoadLabel("Checking leaderboard…"); setLoadProgress(90);
      if (!cancelled) {
        setState(loaded);
        sound.enabled = loaded.profile.soundEnabled;
        if (loaded.settings.musicEnabled) music.start(loaded.settings.musicTrack);
      }
      setLoadProgress(100);
      await new Promise((r) => setTimeout(r, 250));
      if (!cancelled) setLoading(false);
    }
    boot();
    return () => { cancelled = true; };
  }, []);

  // ---- Auth state listener ----
  useEffect(() => {
    let unsub = null;
    try {
      unsub = onAuthChange((user) => {
        setCurrentUser(user);
        if (user) {
          setShowAuth(false);
          // Load user data from Firestore
          getUserData(user.uid).then(({ data }) => {
            if (data) {
              setState((prev) => ({
                ...prev,
                ...data.state,
                profile: { ...prev.profile, ...data.profile, username: data.profile?.username || user.displayName || prev.profile.username },
              }));
              setCloudSynced(true);
            }
          });
        }
      });
    } catch (e) {
      // Firebase not configured — skip auth
    }
    return () => { if (unsub) unsub(); };
  }, []);

  const today = todayKey();
  const todayDay = state.days[today] || { completed: 0, volume: 0 };
  const weeklyVolume = Object.values(state.days).reduce((a, d) => a + (d.volume || 0), 0) / 1000;

  // ---- Cloud sync on state change ----
  useEffect(() => {
    if (currentUser && !loading) {
      saveUserData(currentUser.uid, {
        state,
        profile: state.profile,
        email: currentUser.email,
        username: state.profile.username,
        weeklyVolume,
        streak: state.profile.streak,
      });
    }
  }, [state, currentUser, loading]);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuth(false);
    setCloudSynced(true);
    // Save initial user data
    saveUserData(user.uid, {
      state,
      profile: state.profile,
      email: user.email,
      username: user.displayName || state.profile.username,
      weeklyVolume,
      streak: state.profile.streak,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setCloudSynced(false);
    } catch (e) { /* Firebase not configured */ }
  };

  const handlePostWorkout = async () => {
    if (!currentUser) {
      setShowAuth(true);
      return;
    }
    try {
      await postToFeed(currentUser.uid, state.profile.username, {
        type: "workout",
        title: `Completed ${session?.name || "a workout"}`,
        detail: `${session?.items?.length || 0} exercises · ${Math.round(weeklyVolume * 1000)} kg volume`,
        time: "Just now",
      });
    } catch (e) { /* Firebase not configured */ }

    // Share to WhatsApp / other apps using the Web Share API
    const shareText = `💪 I just completed "${session?.name || "a workout"}" on ForgeUp! ${session?.items?.length || 0} exercises · ${Math.round(weeklyVolume * 1000)} kg volume. Join me at https://forgeup-fe66c.web.app`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ForgeUp Workout",
          text: shareText,
          url: "https://forgeup-fe66c.web.app",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareText);
        alert("Workout summary copied to clipboard! Paste it anywhere to share.");
      }
    } catch (e) {
      // User cancelled share - that's fine
    }
  };

  const startRecoveryWorkout = () => {
    setShowRecoveryWorkout(true);
    setShowRecovery(false);
    setSession({
      name: "Recovery Mobility Flow",
      items: [
        { exerciseId: "plank", name: "Plank", sets: Array.from({ length: 3 }, () => ({ weight: 0, reps: 30, done: false })) },
        { exerciseId: "pushup", name: "Push-Up", sets: Array.from({ length: 3 }, () => ({ weight: 0, reps: 10, done: false })) },
        { exerciseId: "lunge", name: "Walking Lunge", sets: Array.from({ length: 3 }, () => ({ weight: 0, reps: 12, done: false })) },
      ],
    });
    setTab("log");
  };

  const persist = (next) => { setState(next); saveState(next); };

  const startWorkout = () => {
    if (session) return;
    setSession({
      name: TODAY_PLAN.name,
      items: TODAY_PLAN.items.map((it) => {
        const ex = EXERCISES.find((e) => e.id === it.exerciseId);
        const targetReps = it.targetReps || it.targetRep || "8-10";
        return {
          exerciseId: it.exerciseId,
          name: ex.name,
          sets: Array.from({ length: it.targetSets }, () => ({ weight: Math.round(ex.pr * 0.85), reps: targetReps.split("-")[0], done: false })),
        };
      }),
    });
  };

  const finishWorkout = () => {
    sound.finish();
    const volume = session.items.reduce((a, it) => a + it.sets.reduce((b, s) => b + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0), 0);
    const nextStreak = state.profile.streak + 1;
    const workoutCount = state.workoutCount + 1;

    // Progressive overload: check if any set beat the previous PR
    let newPRs = { ...state.prs };
    let newBadges = [...state.badges];
    session.items.forEach((it) => {
      const prevPR = newPRs[it.exerciseId] || 0;
      const bestThisSession = Math.max(...it.sets.map((s) => Number(s.weight) || 0));
      if (bestThisSession > prevPR) {
        newPRs[it.exerciseId] = bestThisSession;
      }
    });

    // Badge rewards
    const badgeDefs = [
      { id: "first", name: "First Steps", icon: <i className="fa-solid fa-bullseye" />, threshold: 1, desc: "Complete your first workout" },
      { id: "centurion", name: "Centurion", icon: <i className="fa-solid fa-trophy" />, threshold: 100, desc: "Log 100 workouts" },
      { id: "heavy", name: "Heavy Lifter", icon: <i className="fa-solid fa-dumbbell" />, threshold: 100, desc: "Hit 100kg on any lift" },
      { id: "streak7", name: "Week Warrior", icon: <i className="fa-solid fa-fire" />, threshold: 7, desc: "7-day streak" },
      { id: "streak14", name: "Fortnight Forge", icon: <i className="fa-solid fa-bolt" />, threshold: 14, desc: "14-day streak" },
    ];
    badgeDefs.forEach((b) => {
      const unlocked =
        b.id === "centurion" ? workoutCount >= b.threshold :
        b.id === "heavy" ? Object.values(newPRs).some((v) => v >= b.threshold) :
        b.id === "streak7" ? nextStreak >= b.threshold :
        b.id === "streak14" ? nextStreak >= b.threshold :
        workoutCount >= b.threshold;
      if (unlocked && !newBadges.includes(b.id)) newBadges.push(b.id);
    });

    const next = {
      ...state,
      profile: { ...state.profile, streak: nextStreak, bestStreak: Math.max(state.profile.bestStreak, nextStreak) },
      days: { ...state.days, [today]: { completed: 1, volume: (state.days[today]?.volume || 0) + volume } },
      workoutCount,
      prs: newPRs,
      badges: newBadges,
    };
    persist(next);
    if (next.profile.leaderboardOptIn) {
      pushLeaderboard(next.profile.username, next.profile.streak, weeklyVolume);
    }
    setSession(null);
    setTab("dashboard");
  };

  // ---- Nutrition wiring ----
  const addFood = (food) => {
    const day = state.nutrition[today] || { entries: [] };
    const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...food };
    persist({ ...state, nutrition: { ...state.nutrition, [today]: { entries: [...day.entries, entry] } } });
  };
  const removeFood = (id) => {
    const day = state.nutrition[today] || { entries: [] };
    persist({ ...state, nutrition: { ...state.nutrition, [today]: { entries: day.entries.filter((e) => e.id !== id) } } });
  };

  // ---- Profile / settings wiring ----
  const setUsername = (name) => {
    const prev = state.profile.username;
    const next = { ...state, profile: { ...state.profile, username: name } };
    persist(next);
    if (state.profile.leaderboardOptIn) {
      removeFromLeaderboard(prev);
      pushLeaderboard(name, state.profile.streak, weeklyVolume);
    }
  };
  const setSoundEnabled = (v) => { sound.enabled = v; persist({ ...state, profile: { ...state.profile, soundEnabled: v } }); };
  const setLeaderboardOptIn = (v) => {
    persist({ ...state, profile: { ...state.profile, leaderboardOptIn: v } });
    if (v) pushLeaderboard(state.profile.username, state.profile.streak, weeklyVolume);
    else removeFromLeaderboard(state.profile.username);
  };
  const setLanguage = (code) => persist({ ...state, settings: { ...state.settings, language: code } });
  const setMusicEnabled = (v) => {
    if (v) music.start(state.settings.musicTrack);
    else music.stop();
    persist({ ...state, settings: { ...state.settings, musicEnabled: v } });
  };
  const setMusicTrack = (trackId) => {
    const playing = music.toggle(trackId);
    persist({ ...state, settings: { ...state.settings, musicTrack: trackId, musicEnabled: playing } });
  };
  const saveBody = (weight, height) => {
    const history = [...state.body.history, { date: today, weight }];
    persist({ ...state, body: { ...state.body, weight, height, history } });
  };
  const completeOnboarding = (data) => {
    persist({ ...state, onboarding: { ...state.onboarding, ...data, completed: true, skipped: false } });
  };
  const skipOnboarding = () => {
    persist({ ...state, onboarding: { ...state.onboarding, skipped: true, completed: true } });
  };
  const submitFeedback = (fb) => {
    persist({ ...state, feedback: [...state.feedback, fb] });
  };

  const openProfileScreen = async (key) => {
    if (key === "social") {
      setShowSocial(true);
      setProfileScreen(null);
      return;
    }
    if (key === "periodization") {
      setShowPeriodization(true);
      setProfileScreen(null);
      return;
    }
    if (key === "recovery") {
      setShowRecovery(true);
      setProfileScreen(null);
      return;
    }
    if (key === "voice") {
      setShowVoiceCoach(true);
      setProfileScreen(null);
      return;
    }
    setProfileScreen(key);
    if (key === "leaderboard") {
      setBoardLoading(true);
      const entries = await fetchLeaderboard();
      setBoard(entries);
      setBoardLoading(false);
    }
  };

  let profileContent = null;
  if (profileScreen === "nutrition") {
    profileContent = <Nutrition dayData={state.nutrition[today]} onAdd={addFood} onRemove={removeFood} onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "leaderboard") {
    profileContent = (
      <Leaderboard entries={board} loading={boardLoading} optedIn={state.profile.leaderboardOptIn}
        onToggleOptIn={setLeaderboardOptIn} username={state.profile.username} onBack={() => setProfileScreen(null)} />
    );
  } else if (profileScreen === "sound") {
    profileContent = <SoundSettings enabled={state.profile.soundEnabled} onToggle={setSoundEnabled} onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "music") {
    profileContent = <MusicSettings enabled={state.settings.musicEnabled} track={state.settings.musicTrack} onToggle={setMusicEnabled} onSelect={setMusicTrack} onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "language") {
    profileContent = <LanguageSettings lang={state.settings.language} onSelect={setLanguage} onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "weight") {
    profileContent = <WeightBmi body={state.body} onSave={saveBody} onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "meals") {
    profileContent = <MealOptions onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "goals") {
    const goalsWithState = WEEKLY_GOALS.map((g) => ({
      ...g,
      done: state.goals?.find((sg) => sg.id === g.id)?.done ?? g.done,
    }));
    profileContent = (
      <WeeklyGoals
        goals={goalsWithState}
        onUpdate={(goalId, newDone) => {
          const goals = WEEKLY_GOALS.map((g) => ({
            id: g.id,
            done: g.id === goalId ? newDone : (state.goals?.find((sg) => sg.id === g.id)?.done ?? g.done),
          }));
          persist({ ...state, goals });
        }}
        onBack={() => setProfileScreen(null)}
      />
    );
  } else if (profileScreen === "challenges") {
    profileContent = <Challenges onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "equipment") {
    profileContent = <Equipment onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "feedback") {
    profileContent = <Feedback onBack={() => setProfileScreen(null)} onSubmit={submitFeedback} />;
  } else if (profileScreen === "rate") {
    profileContent = <RateUs onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "calendar") {
    profileContent = <CalendarView days={state.days} onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "measurements") {
    profileContent = <BodyMeasurements body={state.body} onSave={saveBody} onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "wearable") {
    profileContent = <WearableSync health={state.health} onSave={(health) => persist({ ...state, health })} onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "notifications") {
    profileContent = <PushNotifications onBack={() => setProfileScreen(null)} />;
  } else if (profileScreen === "plan") {
    profileContent = (
      <TrainingPlanBuilder
        onBack={() => setProfileScreen(null)}
        onSave={(plan) => {
          persist({ ...state, trainingPlan: plan });
          sound.setComplete();
        }}
        existingPlan={state.trainingPlan}
        onStartWorkout={(day) => {
          if (day && day.exercises && day.exercises.length > 0) {
            const items = day.exercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              name: ex.name,
              sets: Array.from({ length: ex.sets || 3 }, () => ({ weight: Math.round((ex.pr || 20) * 0.85), reps: (ex.reps || "8-12").split("-")[0], done: false })),
            }));
            setSession({ name: day.name || "Workout", items });
            setProfileScreen(null);
            setTab("log");
          }
        }}
      />
    );
  } else if (profileScreen && INFO_CONTENT[profileScreen]) {
    const titles = { privacy: "Privacy & data" };
    profileContent = <InfoScreen title={titles[profileScreen]} body={INFO_CONTENT[profileScreen]} onBack={() => setProfileScreen(null)} />;
  } else {
    profileContent = <Profile profile={state.profile} state={state} onUsernameChange={setUsername} onOpenScreen={openProfileScreen} currentUser={currentUser} onSignOut={handleSignOut} />;
  }

  const showOnboarding = !loading && !state.onboarding.completed;

  return (
    <ToastProvider>
    <LangContext.Provider value={langValue}>
      <div style={{ background: C.bg, fontFamily: FONT_BODY, minHeight: "100vh" }} className="w-full flex items-center justify-center py-6">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
          ::-webkit-scrollbar { display: none; }
          input:focus { outline: 1px solid ${C.accent}; }

          /* Global press animation on all buttons */
          button { transition: transform 0.12s ease, opacity 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease !important; }
          button:active { transform: scale(0.94) !important; filter: brightness(1.15) !important; }
          button:hover { filter: brightness(1.1); }

          @keyframes shakeIn {
            0% { transform: scale(0.9) translateY(10px); opacity: 0; }
            60% { transform: scale(1.02) translateY(0); opacity: 1; }
            100% { transform: scale(1) translateY(0); }
          }
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes confettiFall {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .toast-in { animation: shakeIn 0.35s cubic-bezier(0.25, 0.8, 0.25, 1); }
          .fade-in { animation: fadeSlideIn 0.3s ease; }
          .confetti-particle { animation: confettiFall 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        `}</style>
        <div style={{
          width: 390, height: 780, background: C.bg, borderRadius: 44, border: `10px solid ${C.surface}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px " + C.line, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 110, height: 24, background: C.bg, borderRadius: 20, zIndex: 30 }} />

          <div className="h-full relative">
            {loading ? (
              <SplashScreen progress={loadProgress} label={loadLabel} />
            ) : showOnboarding ? (
              <Onboarding state={state} onComplete={completeOnboarding} onSkip={skipOnboarding} />
            ) : showAuth ? (
              <AuthScreen onAuthSuccess={handleAuthSuccess} onSkip={() => setShowAuth(false)} />
            ) : showSocial ? (
              <SocialFeed 
                onBack={() => setShowSocial(false)} 
                currentUser={currentUser} 
                onPostWorkout={handlePostWorkout}
                onRequireAuth={() => {
                  setShowSocial(false);
                  setShowAuth(true);
                }}
              />
            ) : showPeriodization ? (
              <Periodization
                onBack={() => setShowPeriodization(false)}
                existingPlan={state.trainingPlan}
                onStartWorkout={(day) => {
                  if (day && day.exercises && day.exercises.length > 0) {
                    const items = day.exercises.map((ex) => ({
                      exerciseId: ex.exerciseId,
                      name: ex.name,
                      sets: Array.from({ length: ex.targetSets || 3 }, () => ({ weight: Math.round((EXERCISES.find((e) => e.id === ex.exerciseId)?.pr || 20) * 0.85), reps: (ex.targetReps || "8-12").split("-")[0], done: false })),
                    }));
                    setSession({ name: day.name || "Workout", items });
                    setShowPeriodization(false);
                    setTab("log");
                  }
                }}
              />
            ) : showRecovery ? (
              <RecoveryAnalytics
                onBack={() => setShowRecovery(false)}
                healthData={state.health}
                onStartRecoveryWorkout={startRecoveryWorkout}
              />
            ) : showVoiceCoach ? (
              <VoiceCoach onBack={() => setShowVoiceCoach(false)} session={session} />
            ) : (
              <>
                {tab === "dashboard" && (
                  <Dashboard setTab={setTab} startWorkout={startWorkout} completedToday={todayDay.completed} streak={state.profile.streak} weeklyVolume={weeklyVolume} state={state} onOpenProfile={openProfileScreen} />
                )}
                {tab === "exercises" && !selectedExercise && <ExerciseLibrary onSelect={setSelectedExercise} />}
                {tab === "exercises" && selectedExercise && <ExerciseDetail exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />}
                {tab === "log" && (
                  <LiveWorkout
                    session={session}
                    setSession={setSession}
                    onFinish={finishWorkout}
                    prCelebrated={prCelebrated}
                    setPrCelebrated={setPrCelebrated}
                  />
                )}
                {tab === "analytics" && <Analytics />}
                {tab === "profile" && profileContent}

                <BottomNav tab={tab} setTab={setTab} />
              </>
            )}
          </div>
        </div>
      </div>
    </LangContext.Provider>
    </ToastProvider>
  );
}