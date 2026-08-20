import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Dumbbell, Calendar, Zap, Trophy, Check, Play, Clock, Flame, TrendingUp, RotateCcw, Sparkles, Layers, Target, Activity } from "lucide-react";
import { useLang } from "../i18n";

/* ---------------- COLOR TOKENS (match App.jsx exactly) ---------------- */
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

/* ---------------- EXERCISE DATABASE ---------------- */
const EXERCISE_DB = {
  // CHEST
  "bench": { name: "Barbell Bench Press", cat: "Chest", equip: "Barbell", pr: 92.5, demo: "bench" },
  "incline-db": { name: "Incline Dumbbell Press", cat: "Chest", equip: "Dumbbell", pr: 34, demo: "incline" },
  "cable-fly": { name: "Cable Fly", cat: "Chest", equip: "Cable", pr: 18, demo: "fly" },
  "pushup": { name: "Push-Up", cat: "Chest", equip: "Bodyweight", pr: 45, demo: "pushup" },
  "dip": { name: "Chest Dip", cat: "Chest", equip: "Bodyweight", pr: 20, demo: "pushup" },
  "db-press": { name: "Dumbbell Bench Press", cat: "Chest", equip: "Dumbbell", pr: 40, demo: "bench" },
  "pec-deck": { name: "Pec Deck Fly", cat: "Chest", equip: "Machine", pr: 50, demo: "fly" },
  // BACK
  "pullup": { name: "Pull-Up", cat: "Back", equip: "Bodyweight", pr: 18, demo: "pullup" },
  "barbell-row": { name: "Barbell Row", cat: "Back", equip: "Barbell", pr: 85, demo: "row" },
  "lat-pulldown": { name: "Lat Pulldown", cat: "Back", equip: "Cable", pr: 70, demo: "pulldown" },
  "deadlift": { name: "Deadlift", cat: "Back", equip: "Barbell", pr: 140, demo: "deadlift" },
  "seated-row": { name: "Seated Cable Row", cat: "Back", equip: "Cable", pr: 75, demo: "row" },
  "face-pull": { name: "Face Pull", cat: "Back", equip: "Cable", pr: 25, demo: "pullup" },
  "db-row": { name: "One-Arm Dumbbell Row", cat: "Back", equip: "Dumbbell", pr: 40, demo: "row" },
  // LEGS
  "squat": { name: "Barbell Back Squat", cat: "Legs", equip: "Barbell", pr: 120, demo: "squat" },
  "leg-press": { name: "Leg Press", cat: "Legs", equip: "Machine", pr: 220, demo: "legpress" },
  "lunge": { name: "Walking Lunge", cat: "Legs", equip: "Dumbbell", pr: 24, demo: "lunge" },
  "rom-deadlift": { name: "Romanian Deadlift", cat: "Legs", equip: "Barbell", pr: 100, demo: "deadlift" },
  "leg-ext": { name: "Leg Extension", cat: "Legs", equip: "Machine", pr: 80, demo: "legpress" },
  "leg-curl": { name: "Lying Leg Curl", cat: "Legs", equip: "Machine", pr: 55, demo: "legpress" },
  "calf-raise": { name: "Standing Calf Raise", cat: "Legs", equip: "Machine", pr: 90, demo: "legpress" },
  "goblet-squat": { name: "Goblet Squat", cat: "Legs", equip: "Dumbbell", pr: 32, demo: "squat" },
  // SHOULDERS
  "ohp": { name: "Overhead Press", cat: "Shoulders", equip: "Barbell", pr: 55, demo: "ohp" },
  "lateral-raise": { name: "Lateral Raise", cat: "Shoulders", equip: "Dumbbell", pr: 14, demo: "lateral" },
  "rear-delt": { name: "Rear Delt Fly", cat: "Shoulders", equip: "Dumbbell", pr: 12, demo: "lateral" },
  "db-shoulder-press": { name: "Dumbbell Shoulder Press", cat: "Shoulders", equip: "Dumbbell", pr: 26, demo: "ohp" },
  "upright-row": { name: "Upright Row", cat: "Shoulders", equip: "Barbell", pr: 35, demo: "row" },
  // ARMS
  "curl": { name: "Barbell Curl", cat: "Arms", equip: "Barbell", pr: 40, demo: "curl" },
  "tricep-pushdown": { name: "Tricep Pushdown", cat: "Arms", equip: "Cable", pr: 32, demo: "pushdown" },
  "hammer-curl": { name: "Hammer Curl", cat: "Arms", equip: "Dumbbell", pr: 18, demo: "curl" },
  "skull-crusher": { name: "Skull Crusher", cat: "Arms", equip: "Barbell", pr: 30, demo: "pushdown" },
  "preacher-curl": { name: "Preacher Curl", cat: "Arms", equip: "Barbell", pr: 25, demo: "curl" },
  "overhead-ext": { name: "Overhead Tricep Extension", cat: "Arms", equip: "Dumbbell", pr: 22, demo: "pushdown" },
  // CORE
  "plank": { name: "Plank", cat: "Core", equip: "Bodyweight", pr: 120, demo: "plank" },
  "hanging-leg-raise": { name: "Hanging Leg Raise", cat: "Core", equip: "Bodyweight", pr: 15, demo: "legraise" },
  "russian-twist": { name: "Russian Twist", cat: "Core", equip: "Bodyweight", pr: 30, demo: "plank" },
  "cable-crunch": { name: "Cable Crunch", cat: "Core", equip: "Cable", pr: 40, demo: "plank" },
  "leg-raise": { name: "Lying Leg Raise", cat: "Core", equip: "Bodyweight", pr: 20, demo: "legraise" },
  // GLUTES
  "hip-thrust": { name: "Barbell Hip Thrust", cat: "Glutes", equip: "Barbell", pr: 100, demo: "hipthrust" },
  "cable-kickback": { name: "Cable Glute Kickback", cat: "Glutes", equip: "Cable", pr: 22, demo: "kickback" },
  "glute-bridge": { name: "Glute Bridge", cat: "Glutes", equip: "Bodyweight", pr: 30, demo: "hipthrust" },
};

/* ---------------- SPLIT TEMPLATES ---------------- */
const SPLITS = [
  {
    id: "ppl",
    name: "Push / Pull / Legs",
    icon: <i className="fa-solid fa-dumbbell" />,
    desc: "The classic bodybuilding split. Train each muscle group twice a week with optimal recovery.",
    color: C.accent,
    days: 3,
    weekly: [2, 3, 4, 5, 6],
    templates: {
      3: [
        { name: "Push Day", focus: "Chest · Shoulders · Triceps", exercises: ["bench", "ohp", "incline-db", "lateral-raise", "tricep-pushdown"] },
        { name: "Pull Day", focus: "Back · Biceps", exercises: ["deadlift", "pullup", "barbell-row", "curl", "face-pull"] },
        { name: "Leg Day", focus: "Quads · Hamstrings · Glutes", exercises: ["squat", "rom-deadlift", "leg-press", "lunge", "calf-raise"] },
      ],
      4: [
        { name: "Push Day A", focus: "Chest · Shoulders · Triceps", exercises: ["bench", "ohp", "incline-db", "lateral-raise", "tricep-pushdown"] },
        { name: "Pull Day A", focus: "Back · Biceps", exercises: ["deadlift", "pullup", "barbell-row", "curl", "face-pull"] },
        { name: "Leg Day A", focus: "Quads · Hamstrings · Glutes", exercises: ["squat", "rom-deadlift", "leg-press", "lunge", "calf-raise"] },
        { name: "Push Day B", focus: "Chest · Shoulders · Triceps", exercises: ["db-press", "db-shoulder-press", "cable-fly", "upright-row", "overhead-ext"] },
      ],
      5: [
        { name: "Push Day A", focus: "Chest · Shoulders · Triceps", exercises: ["bench", "ohp", "incline-db", "lateral-raise", "tricep-pushdown"] },
        { name: "Pull Day A", focus: "Back · Biceps", exercises: ["deadlift", "pullup", "barbell-row", "curl", "face-pull"] },
        { name: "Leg Day A", focus: "Quads · Hamstrings · Glutes", exercises: ["squat", "rom-deadlift", "leg-press", "lunge", "calf-raise"] },
        { name: "Push Day B", focus: "Chest · Shoulders · Triceps", exercises: ["db-press", "db-shoulder-press", "cable-fly", "upright-row", "overhead-ext"] },
        { name: "Pull Day B", focus: "Back · Biceps", exercises: ["barbell-row", "lat-pulldown", "seated-row", "hammer-curl", "rear-delt"] },
      ],
      6: [
        { name: "Push Day A", focus: "Chest · Shoulders · Triceps", exercises: ["bench", "ohp", "incline-db", "lateral-raise", "tricep-pushdown"] },
        { name: "Pull Day A", focus: "Back · Biceps", exercises: ["deadlift", "pullup", "barbell-row", "curl", "face-pull"] },
        { name: "Leg Day A", focus: "Quads · Hamstrings · Glutes", exercises: ["squat", "rom-deadlift", "leg-press", "lunge", "calf-raise"] },
        { name: "Push Day B", focus: "Chest · Shoulders · Triceps", exercises: ["db-press", "db-shoulder-press", "cable-fly", "upright-row", "overhead-ext"] },
        { name: "Pull Day B", focus: "Back · Biceps", exercises: ["barbell-row", "lat-pulldown", "seated-row", "hammer-curl", "rear-delt"] },
        { name: "Leg Day B", focus: "Quads · Hamstrings · Glutes", exercises: ["goblet-squat", "hip-thrust", "leg-ext", "leg-curl", "cable-kickback"] },
      ],
    },
  },
  {
    id: "upperlower",
    name: "Upper / Lower",
    icon: <i className="fa-solid fa-person-lifting" />,
    desc: "Efficient 4-day split. Hit every muscle group twice weekly with compound-focused sessions.",
    color: C.cool,
    days: 2,
    weekly: [2, 3, 4],
    templates: {
      2: [
        { name: "Upper Body", focus: "Chest · Back · Shoulders · Arms", exercises: ["bench", "barbell-row", "ohp", "pullup", "curl", "tricep-pushdown"] },
        { name: "Lower Body", focus: "Quads · Hamstrings · Glutes · Core", exercises: ["squat", "rom-deadlift", "leg-press", "calf-raise", "plank"] },
      ],
      3: [
        { name: "Upper Body A", focus: "Chest · Back · Shoulders · Arms", exercises: ["bench", "barbell-row", "ohp", "pullup", "curl", "tricep-pushdown"] },
        { name: "Lower Body A", focus: "Quads · Hamstrings · Glutes · Core", exercises: ["squat", "rom-deadlift", "leg-press", "calf-raise", "plank"] },
        { name: "Upper Body B", focus: "Chest · Back · Shoulders · Arms", exercises: ["db-press", "lat-pulldown", "db-shoulder-press", "seated-row", "hammer-curl", "overhead-ext"] },
      ],
      4: [
        { name: "Upper Body A", focus: "Chest · Back · Shoulders · Arms", exercises: ["bench", "barbell-row", "ohp", "pullup", "curl", "tricep-pushdown"] },
        { name: "Lower Body A", focus: "Quads · Hamstrings · Glutes · Core", exercises: ["squat", "rom-deadlift", "leg-press", "calf-raise", "plank"] },
        { name: "Upper Body B", focus: "Chest · Back · Shoulders · Arms", exercises: ["db-press", "lat-pulldown", "db-shoulder-press", "seated-row", "hammer-curl", "overhead-ext"] },
        { name: "Lower Body B", focus: "Quads · Hamstrings · Glutes · Core", exercises: ["deadlift", "goblet-squat", "hip-thrust", "leg-ext", "leg-curl", "cable-crunch"] },
      ],
    },
  },
  {
    id: "fullbody",
    name: "Full Body",
    icon: <i className="fa-solid fa-fire" />,
    desc: "Train everything every session. Perfect for busy schedules and beginners.",
    color: C.warm,
    days: 1,
    weekly: [2, 3],
    templates: {
      2: [
        { name: "Full Body A", focus: "Full Body", exercises: ["squat", "bench", "barbell-row", "ohp", "plank"] },
        { name: "Full Body B", focus: "Full Body", exercises: ["deadlift", "db-press", "pullup", "lunge", "cable-crunch"] },
      ],
      3: [
        { name: "Full Body A", focus: "Full Body", exercises: ["squat", "bench", "barbell-row", "ohp", "plank"] },
        { name: "Full Body B", focus: "Full Body", exercises: ["deadlift", "db-press", "pullup", "lunge", "cable-crunch"] },
        { name: "Full Body C", focus: "Full Body", exercises: ["leg-press", "incline-db", "lat-pulldown", "lateral-raise", "hanging-leg-raise"] },
      ],
    },
  },
  {
    id: "bro",
    name: "Bodybuilding",
    icon: <i className="fa-solid fa-trophy" />,
    desc: "Classic body-part split. Maximum isolation for each muscle group.",
    color: C.gold,
    days: 5,
    weekly: [4, 5, 6],
    templates: {
      4: [
        { name: "Chest & Triceps", focus: "Chest · Triceps", exercises: ["bench", "incline-db", "cable-fly", "dip", "tricep-pushdown", "overhead-ext"] },
        { name: "Back & Biceps", focus: "Back · Biceps", exercises: ["deadlift", "pullup", "barbell-row", "seated-row", "curl", "hammer-curl"] },
        { name: "Legs & Core", focus: "Quads · Hamstrings · Glutes · Core", exercises: ["squat", "rom-deadlift", "leg-press", "lunge", "calf-raise", "plank"] },
        { name: "Shoulders & Arms", focus: "Shoulders · Arms", exercises: ["ohp", "db-shoulder-press", "lateral-raise", "rear-delt", "curl", "tricep-pushdown"] },
      ],
      5: [
        { name: "Chest & Triceps", focus: "Chest · Triceps", exercises: ["bench", "incline-db", "cable-fly", "dip", "tricep-pushdown", "overhead-ext"] },
        { name: "Back & Biceps", focus: "Back · Biceps", exercises: ["deadlift", "pullup", "barbell-row", "seated-row", "curl", "hammer-curl"] },
        { name: "Legs & Core", focus: "Quads · Hamstrings · Glutes · Core", exercises: ["squat", "rom-deadlift", "leg-press", "lunge", "calf-raise", "plank"] },
        { name: "Shoulders & Arms", focus: "Shoulders · Arms", exercises: ["ohp", "db-shoulder-press", "lateral-raise", "rear-delt", "curl", "tricep-pushdown"] },
        { name: "Chest & Back", focus: "Chest · Back", exercises: ["db-press", "lat-pulldown", "incline-db", "barbell-row", "cable-fly", "face-pull"] },
      ],
      6: [
        { name: "Chest & Triceps", focus: "Chest · Triceps", exercises: ["bench", "incline-db", "cable-fly", "dip", "tricep-pushdown", "overhead-ext"] },
        { name: "Back & Biceps", focus: "Back · Biceps", exercises: ["deadlift", "pullup", "barbell-row", "seated-row", "curl", "hammer-curl"] },
        { name: "Legs & Core", focus: "Quads · Hamstrings · Glutes · Core", exercises: ["squat", "rom-deadlift", "leg-press", "lunge", "calf-raise", "plank"] },
        { name: "Shoulders & Arms", focus: "Shoulders · Arms", exercises: ["ohp", "db-shoulder-press", "lateral-raise", "rear-delt", "curl", "tricep-pushdown"] },
        { name: "Chest & Back", focus: "Chest · Back", exercises: ["db-press", "lat-pulldown", "incline-db", "barbell-row", "cable-fly", "face-pull"] },
        { name: "Legs & Glutes", focus: "Quads · Hamstrings · Glutes", exercises: ["goblet-squat", "hip-thrust", "leg-ext", "leg-curl", "cable-kickback", "calf-raise"] },
      ],
    },
  },
  {
    id: "arnold",
    name: "Arnold Split",
    icon: <i className="fa-solid fa-bullseye" />,
    desc: "The legendary 6-day split. Chest/Back, Shoulders/Arms, Legs — repeated twice.",
    color: C.warm,
    days: 3,
    weekly: [6],
    templates: {
      6: [
        { name: "Chest & Back", focus: "Chest · Back", exercises: ["bench", "pullup", "incline-db", "barbell-row", "cable-fly", "seated-row"] },
        { name: "Shoulders & Arms", focus: "Shoulders · Arms", exercises: ["ohp", "lateral-raise", "curl", "tricep-pushdown", "rear-delt", "hammer-curl"] },
        { name: "Legs", focus: "Quads · Hamstrings · Glutes", exercises: ["squat", "rom-deadlift", "leg-press", "lunge", "calf-raise", "plank"] },
        { name: "Chest & Back", focus: "Chest · Back", exercises: ["db-press", "lat-pulldown", "dip", "db-row", "pushup", "face-pull"] },
        { name: "Shoulders & Arms", focus: "Shoulders · Arms", exercises: ["db-shoulder-press", "upright-row", "preacher-curl", "overhead-ext", "lateral-raise", "skull-crusher"] },
        { name: "Legs & Glutes", focus: "Quads · Hamstrings · Glutes", exercises: ["deadlift", "goblet-squat", "hip-thrust", "leg-ext", "leg-curl", "cable-kickback"] },
      ],
    },
  },
];

/* ---------------- PROGRESSION SCHEMES ---------------- */
const PROGRESSIONS = [
  { id: "hypertrophy", name: "Hypertrophy", desc: "8-12 reps · 3-4 sets · 60-90s rest", sets: [4, 3, 3, 3], reps: "8-12", rest: "90s", color: C.accent, volume: "High volume for muscle growth" },
  { id: "strength", name: "Strength", desc: "3-5 reps · 5 sets · 3min rest", sets: [5, 4, 3, 3, 3], reps: "3-5", rest: "3min", color: C.cool, volume: "Heavy compound lifts" },
  { id: "power", name: "Power", desc: "1-3 reps · 5 sets · 3-5min rest", sets: [5, 4, 3, 2, 1], reps: "1-3", rest: "4min", color: C.warm, volume: "Explosive max effort" },
  { id: "endurance", name: "Endurance", desc: "15-20 reps · 3 sets · 45s rest", sets: [3, 3, 3], reps: "15-20", rest: "45s", color: C.gold, volume: "High reps for muscular endurance" },
];

/* ---------------- WEEKLY SCHEDULE ---------------- */
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ---------------- MAIN COMPONENT ---------------- */
export default function TrainingPlanBuilder({ onBack, onSave, existingPlan, onStartWorkout }) {
  const { t } = useLang();
  const [step, setStep] = useState(1); // 1=split, 2=frequency, 3=progression, 4=review
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [frequency, setFrequency] = useState(4);
  const [progression, setProgression] = useState("hypertrophy");
  const [schedule, setSchedule] = useState({});
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);

  const split = SPLITS.find((s) => s.id === selectedSplit);
  const prog = PROGRESSIONS.find((p) => p.id === progression);

  const availableFrequencies = split ? (split.weekly || []) : [];
  const templates = split && availableFrequencies.includes(frequency) ? (split.templates[frequency] || []) : [];

  const generatePlan = () => {
    if (!split || !templates.length) return null;
    const plan = templates.map((tpl, i) => ({
      id: `${split.id}-${i}`,
      day: i + 1,
      name: tpl.name,
      focus: tpl.focus,
      exercises: tpl.exercises.map((exId, j) => {
        const ex = EXERCISE_DB[exId];
        return {
          exerciseId: exId,
          name: ex?.name || exId,
          cat: ex?.cat || "Other",
          equip: ex?.equip || "Bodyweight",
          pr: ex?.pr || 20,
          demo: ex?.demo || "bench",
          sets: prog.sets[j] || 3,
          reps: prog.reps,
          rest: prog.rest,
        };
      }),
    }));
    return {
      id: `${split.id}-${Date.now()}`,
      splitId: split.id,
      splitName: split.name,
      splitIcon: split.icon,
      frequency,
      progression: prog.id,
      progressionName: prog.name,
      createdAt: new Date().toISOString(),
      days: plan,
    };
  };

  const handleGenerate = () => {
    const plan = generatePlan();
    if (plan) {
      setGenerated(true);
      setStep(4);
    }
  };

  const handleSave = () => {
    const plan = generatePlan();
    if (plan) {
      onSave(plan);
      setSaved(true);
    }
  };

  const handleStartWorkout = (day) => {
    if (onStartWorkout) {
      onStartWorkout(day);
    }
  };

  const totalWeeklyVolume = templates.reduce((a, t) => a + t.exercises.length, 0);

  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <button onClick={() => { setStep(step - 1); setGenerated(false); }} style={{ background: C.raised, border: `1px solid ${C.line}` }} className="rounded-full p-2 hover-pop">
              <ChevronLeft size={18} color={C.hi} />
            </button>
          ) : (
            <button onClick={onBack} style={{ background: C.raised, border: `1px solid ${C.line}` }} className="rounded-full p-2 hover-pop">
              <ChevronLeft size={18} color={C.hi} />
            </button>
          )}
          <div>
            <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 20, fontWeight: 700 }}>{t("trainingPlanBuilder")}</h1>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }}>{t("designYourProgram")}</div>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 999, background: step >= s ? C.accent : C.line, transition: "background 0.3s" }} />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {[t("split"), t("frequency"), t("progression"), t("review")].map((label, i) => (
            <span key={label} style={{ fontFamily: FONT_MONO, fontSize: 9, color: step >= i + 1 ? C.accent : C.low, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {/* STEP 1: SPLIT SELECTION */}
        {step === 1 && (
          <div className="fade-in">
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 18, fontWeight: 700 }}>{t("chooseYourSplit")}</h2>
            <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12.5 }} className="mt-1 mb-4">{t("chooseSplitDesc")}</p>
            {SPLITS.map((s) => (
              <button key={s.id} onClick={() => { setSelectedSplit(s.id); setFrequency(s.weekly[0] || 3); }}
                style={{ background: selectedSplit === s.id ? C.raised : C.surface, border: `1px solid ${selectedSplit === s.id ? s.color : C.line}`, borderRadius: 16 }}
                className="w-full p-4 mb-3 text-left active:scale-[0.99] transition-transform hover-lift">
                <div className="flex items-center gap-3">
                  <div style={{ background: `${s.color}22`, borderRadius: 12, width: 44, height: 44, flexShrink: 0 }} className="flex items-center justify-center text-xl">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14.5, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11.5 }} className="mt-0.5">{s.desc}</div>
                    <div className="flex gap-1.5 mt-2">
                      {s.weekly.map((d) => (
                        <span key={d} style={{ fontFamily: FONT_MONO, fontSize: 9, color: s.color, background: `${s.color}15`, borderRadius: 6, padding: "2px 6px" }}>{d}×/wk</span>
                      ))}
                    </div>
                  </div>
                  {selectedSplit === s.id && <Check size={18} color={s.color} />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: FREQUENCY */}
        {step === 2 && split && (
          <div className="fade-in">
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 18, fontWeight: 700 }}>{t("howManyDays")}</h2>
            <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12.5 }} className="mt-1 mb-4">{t("autoGenerate")} {split.name} {t("programForYou")}</p>
            <div className="grid grid-cols-2 gap-3">
              {availableFrequencies.map((f) => (
                <button key={f} onClick={() => setFrequency(f)}
                  style={{ background: frequency === f ? C.raised : C.surface, border: `1px solid ${frequency === f ? split.color : C.line}`, borderRadius: 16 }}
                  className="p-5 text-center active:scale-[0.98] transition-transform hover-lift">
                  <div style={{ fontFamily: FONT_DISPLAY, color: frequency === f ? split.color : C.hi, fontSize: 32, fontWeight: 700 }}>{f}</div>
                  <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-1">{t("daysPerWeek")}</div>
                </button>
              ))}
            </div>
            {templates.length > 0 && (
              <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mt-4 hover-lift">
                <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">{t("yourWeek")}</div>
                {templates.map((tpl, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <div style={{ background: `${split.color}22`, borderRadius: 6, width: 22, height: 22, flexShrink: 0 }} className="flex items-center justify-center">
                      <span style={{ fontFamily: FONT_MONO, color: split.color, fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12.5 }}>{tpl.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: PROGRESSION */}
        {step === 3 && (
          <div className="fade-in">
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 18, fontWeight: 700 }}>{t("trainingStyle")}</h2>
            <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12.5 }} className="mt-1 mb-4">{t("trainingStyleDesc")}</p>
            {PROGRESSIONS.map((p) => (
              <button key={p.id} onClick={() => setProgression(p.id)}
                style={{ background: progression === p.id ? C.raised : C.surface, border: `1px solid ${progression === p.id ? p.color : C.line}`, borderRadius: 16 }}
                className="w-full p-4 mb-3 text-left active:scale-[0.99] transition-transform hover-lift">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div style={{ background: `${p.color}22`, borderRadius: 10, width: 40, height: 40, flexShrink: 0 }} className="flex items-center justify-center">
                      {p.id === "hypertrophy" ? <Zap size={18} color={p.color} /> : p.id === "strength" ? <Trophy size={18} color={p.color} /> : p.id === "power" ? <Flame size={18} color={p.color} /> : <Activity size={18} color={p.color} />}
                    </div>
                    <div>
                      <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontFamily: FONT_MONO, color: p.color, fontSize: 11 }} className="mt-0.5">{p.desc}</div>
                    </div>
                  </div>
                  {progression === p.id && <Check size={18} color={p.color} />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && split && prog && (
          <div className="fade-in">
            <div style={{ background: `linear-gradient(155deg,${C.raised} 0%,${C.surface} 100%)`, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-5 mb-4 hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ background: `${split.color}22`, borderRadius: 12, width: 44, height: 44, flexShrink: 0 }} className="flex items-center justify-center text-xl">{split.icon}</div>
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 17, fontWeight: 700 }}>{split.name} · {frequency} days</div>
                  <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11.5 }}>{prog.name} · {prog.desc}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div style={{ background: `${C.cool}15`, borderRadius: 8, padding: "4px 10px" }}>
                  <span style={{ fontFamily: FONT_MONO, color: C.cool, fontSize: 10, fontWeight: 700 }}>{templates.length} {t("sessions")}</span>
                </div>
                <div style={{ background: `${C.accent}15`, borderRadius: 8, padding: "4px 10px" }}>
                  <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 10, fontWeight: 700 }}>{totalWeeklyVolume} {t("exercisesUpper")}</span>
                </div>
                <div style={{ background: `${C.warm}15`, borderRadius: 8, padding: "4px 10px" }}>
                  <span style={{ fontFamily: FONT_MONO, color: C.warm, fontSize: 10, fontWeight: 700 }}>{prog.reps} REPS</span>
                </div>
              </div>
            </div>

            {templates.map((tpl, i) => (
              <div key={i} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-3 hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, fontWeight: 700 }}>{tpl.name}</div>
                    <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{tpl.focus}</div>
                  </div>
                  <button onClick={() => handleStartWorkout(tpl)} style={{ background: C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg, borderRadius: 8, fontSize: 11, whiteSpace: "nowrap" }} className="px-3 py-2 flex items-center gap-1 hover-pop">
                    <Play size={11} fill={C.bg} /> {t("start")}
                  </button>
                </div>
                {tpl.exercises.map((exId, j) => {
                  const ex = EXERCISE_DB[exId];
                  if (!ex) return null;
                  return (
                    <div key={j} className="flex items-center justify-between py-1.5 border-t" style={{ borderColor: `${C.line}44` }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 10, width: 16, flexShrink: 0 }}>{j + 1}</span>
                        <div className="min-w-0">
                          <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ex.name}</div>
                          <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{ex.cat} · {ex.equip}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 11, fontWeight: 700 }}>{prog.sets[j] || 3}×{prog.reps}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-8 pt-2" style={{ background: `linear-gradient(transparent, ${C.bg} 30%)` }}>
        {step < 4 ? (
          <button onClick={() => setStep(step + 1)}
            style={{ background: C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
            className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm hover-glow">
            {step === 3 ? t("generatePlan") : t("continue")} <ChevronRight size={15} />
          </button>
        ) : (
          <button onClick={handleSave}
            style={{ background: saved ? C.cool : C.accent, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
            className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm hover-glow">
            {saved ? <><Check size={15} /> {t("planSaved")}</> : <><Sparkles size={15} /> {t("saveTrainingPlan")}</>}
          </button>
        )}
      </div>
    </div>
  );
}