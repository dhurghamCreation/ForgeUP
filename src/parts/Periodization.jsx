import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Activity, Target, Calendar, Dumbbell, Check, Zap, Flame } from "lucide-react";
import { useLang } from "../i18n";

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

// Periodization block definitions
const BLOCK_TYPES = {
  hypertrophy: {
    name: "Hypertrophy",
    color: C.accent,
    icon: Dumbbell,
    desc: "Build muscle size with moderate weight and higher volume",
    weeks: 4,
    weeklyProgression: [
      { week: 1, reps: "10-12", intensity: "65-70%", volume: "High", sets: 4, desc: "Accumulation — build volume base" },
      { week: 2, reps: "8-10", intensity: "70-75%", volume: "High", sets: 4, desc: "Intensification — increase load" },
      { week: 3, reps: "8-10", intensity: "72-78%", volume: "Very High", sets: 5, desc: "Peak volume — maximum stimulus" },
      { week: 4, reps: "6-8", intensity: "75-80%", volume: "Deload", sets: 3, desc: "Deload — active recovery" },
    ],
  },
  strength: {
    name: "Strength Peak",
    color: C.warm,
    icon: TrendingUp,
    desc: "Maximize neural adaptations and 1RM potential",
    weeks: 4,
    weeklyProgression: [
      { week: 1, reps: "5-6", intensity: "80-85%", volume: "Medium", sets: 5, desc: "Base strength — heavy compounds" },
      { week: 2, reps: "4-5", intensity: "85-88%", volume: "Medium", sets: 5, desc: "Build — increase intensity" },
      { week: 3, reps: "3-4", intensity: "88-92%", volume: "Low", sets: 4, desc: "Peak — near-maximal loads" },
      { week: 4, reps: "1-3", intensity: "92-97%", volume: "Deload", sets: 3, desc: "Test week — attempt new PRs" },
    ],
  },
  power: {
    name: "Power & Explosiveness",
    color: C.gold,
    icon: Zap,
    desc: "Develop rate of force development and athletic power",
    weeks: 3,
    weeklyProgression: [
      { week: 1, reps: "3-5", intensity: "70-75%", volume: "Medium", sets: 5, desc: "Speed work — explosive concentric" },
      { week: 2, reps: "2-4", intensity: "75-80%", volume: "Medium", sets: 5, desc: "Power — increase bar speed" },
      { week: 3, reps: "1-3", intensity: "80-85%", volume: "Low", sets: 4, desc: "Peak power — max effort" },
    ],
  },
  endurance: {
    name: "Muscular Endurance",
    color: C.cool,
    icon: Flame,
    desc: "Improve work capacity and lactate tolerance",
    weeks: 3,
    weeklyProgression: [
      { week: 1, reps: "15-20", intensity: "50-55%", volume: "High", sets: 3, desc: "Volume accumulation" },
      { week: 2, reps: "12-15", intensity: "55-60%", volume: "Very High", sets: 4, desc: "Increased density" },
      { week: 3, reps: "10-12", intensity: "60-65%", volume: "High", sets: 4, desc: "Peak endurance" },
    ],
  },
};

const SPLITS = [
  { id: "pushpull", name: "Push / Pull / Legs", days: 3, desc: "Classic 3-day split" },
  { id: "upperlower", name: "Upper / Lower", days: 4, desc: "4-day frequency split" },
  { id: "fullbody", name: "Full Body", days: 3, desc: "3x per week full body" },
  { id: "bro", name: "Bro Split", days: 5, desc: "5-day muscle group split" },
];

const EXERCISE_POOL = {
  push: ["bench", "incline-db", "ohp", "lateral-raise", "tricep-pushdown", "cable-fly", "pushup"],
  pull: ["pullup", "barbell-row", "lat-pulldown", "curl", "deadlift"],
  legs: ["squat", "leg-press", "lunge", "hip-thrust", "cable-kickback"],
  upper: ["bench", "pullup", "ohp", "barbell-row", "curl", "tricep-pushdown"],
  lower: ["squat", "deadlift", "leg-press", "lunge", "hip-thrust", "cable-kickback"],
  full: ["squat", "bench", "barbell-row", "ohp", "deadlift", "curl", "tricep-pushdown", "lunge"],
  chest: ["bench", "incline-db", "cable-fly", "pushup"],
  back: ["pullup", "barbell-row", "lat-pulldown", "deadlift"],
  shoulders: ["ohp", "lateral-raise"],
  arms: ["curl", "tricep-pushdown"],
  legs2: ["squat", "leg-press", "lunge", "hip-thrust"],
};

const EXERCISE_NAMES = {
  bench: "Barbell Bench Press",
  "incline-db": "Incline Dumbbell Press",
  ohp: "Overhead Press",
  "lateral-raise": "Lateral Raise",
  "tricep-pushdown": "Tricep Pushdown",
  "cable-fly": "Cable Fly",
  pushup: "Push-Up",
  pullup: "Pull-Up",
  "barbell-row": "Barbell Row",
  "lat-pulldown": "Lat Pulldown",
  curl: "Barbell Curl",
  deadlift: "Deadlift",
  squat: "Barbell Back Squat",
  "leg-press": "Leg Press",
  lunge: "Walking Lunge",
  "hip-thrust": "Barbell Hip Thrust",
  "cable-kickback": "Cable Glute Kickback",
};

export default function Periodization({ onBack, onStartWorkout, existingPlan }) {
  const { t } = useLang();
  const [blockType, setBlockType] = useState(existingPlan?.blockType || "hypertrophy");
  const [split, setSplit] = useState(existingPlan?.split || "pushpull");
  const [currentWeek, setCurrentWeek] = useState(existingPlan?.currentWeek || 1);
  const [startDate, setStartDate] = useState(existingPlan?.startDate || new Date().toISOString().slice(0, 10));

  const block = BLOCK_TYPES[blockType];
  const splitInfo = SPLITS.find((s) => s.id === split);

  // Generate the full periodization plan
  const plan = useMemo(() => {
    const weeks = [];
    for (let w = 1; w <= block.weeks; w++) {
      const weekData = block.weeklyProgression[w - 1];
      const days = [];
      const dayCount = splitInfo.days;

      for (let d = 1; d <= dayCount; d++) {
        let pool = [];
        if (split === "pushpull") {
          pool = d === 1 ? EXERCISE_POOL.push : d === 2 ? EXERCISE_POOL.pull : EXERCISE_POOL.legs;
        } else if (split === "upperlower") {
          pool = d % 2 === 1 ? EXERCISE_POOL.upper : EXERCISE_POOL.lower;
        } else if (split === "fullbody") {
          pool = EXERCISE_POOL.full;
        } else if (split === "bro") {
          const broDays = [EXERCISE_POOL.chest, EXERCISE_POOL.back, EXERCISE_POOL.legs2, EXERCISE_POOL.shoulders, EXERCISE_POOL.arms];
          pool = broDays[(d - 1) % 5];
        }

        // Select exercises based on week intensity
        const exerciseCount = weekData.volume === "Deload" ? 3 : weekData.volume === "Low" ? 4 : 5;
        const selected = pool.slice(0, exerciseCount);

        days.push({
          name: split === "pushpull" ? (d === 1 ? "Push Day" : d === 2 ? "Pull Day" : "Legs Day") :
                split === "upperlower" ? (d % 2 === 1 ? "Upper Body" : "Lower Body") :
                split === "fullbody" ? "Full Body" :
                ["Chest Day", "Back Day", "Legs Day", "Shoulders Day", "Arms Day"][(d - 1) % 5],
          exercises: selected.map((exId) => ({
            exerciseId: exId,
            name: EXERCISE_NAMES[exId] || exId,
            targetSets: weekData.sets,
            targetReps: weekData.reps,
            intensity: weekData.intensity,
          })),
        });
      }

      weeks.push({
        week: w,
        ...weekData,
        days,
      });
    }
    return weeks;
  }, [block, split, splitInfo]);

  const currentWeekData = plan[currentWeek - 1] || plan[0];

  const handleStartWorkout = (day) => {
    if (onStartWorkout) {
      onStartWorkout({
        name: `${day.name} — Week ${currentWeek} · ${block.name}`,
        exercises: day.exercises,
      });
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} style={{ background: C.raised, border: `1px solid ${C.line}` }} className="rounded-full p-2 hover-pop">
            <ChevronLeft size={18} color={C.hi} />
          </button>
          <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 20, fontWeight: 700 }}>{t("periodization")}</h1>
        </div>
      </div>

      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {/* Block type selector */}
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">{t("trainingBlock")}</div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(BLOCK_TYPES).map(([id, b]) => (
            <button
              key={id}
              onClick={() => { setBlockType(id); setCurrentWeek(1); }}
              style={{
                background: blockType === id ? C.raised : C.surface,
                border: `1px solid ${blockType === id ? b.color : C.line}`,
                borderRadius: 14,
              }}
              className="p-3 text-left hover-lift"
            >
              <div style={{ background: `${b.color}22`, borderRadius: 8, width: 30, height: 30 }} className="flex items-center justify-center mb-2">
                <b.icon size={15} color={b.color} />
              </div>
              <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12.5, fontWeight: 600 }}>{b.name}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }} className="mt-0.5">{b.weeks} {t("weeks")}</div>
            </button>
          ))}
        </div>

        {/* Split selector */}
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">{t("split")}</div>
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
          {SPLITS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSplit(s.id)}
              style={{
                fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                padding: "7px 14px", borderRadius: 999,
                background: split === s.id ? C.accent : C.raised,
                color: split === s.id ? C.bg : C.mid,
                border: split === s.id ? "none" : `1px solid ${C.line}`,
              }}
              className="hover-pop"
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Block description */}
        <div style={{ background: `linear-gradient(155deg, ${block.color}15, transparent)`, border: `1px solid ${block.color}40`, borderRadius: 16 }} className="p-4 mb-4">
          <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>{block.name} {t("blockDesc")}</div>
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="mt-1">{block.desc}</div>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            disabled={currentWeek <= 1}
            style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 10, opacity: currentWeek <= 1 ? 0.4 : 1 }}
            className="p-2 hover-pop"
          >
            <ChevronLeft size={16} color={C.hi} />
          </button>
          <div className="text-center">
            <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 16, fontWeight: 700 }}>{t("weekOf")} {currentWeek} {t("of")} {block.weeks}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }}>{currentWeekData?.desc}</div>
          </div>
          <button
            onClick={() => setCurrentWeek(Math.min(block.weeks, currentWeek + 1))}
            disabled={currentWeek >= block.weeks}
            style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 10, opacity: currentWeek >= block.weeks ? 0.4 : 1 }}
            className="p-2 hover-pop"
          >
            <ChevronRight size={16} color={C.hi} />
          </button>
        </div>

        {/* Week progression timeline */}
        <div className="flex gap-1.5 mb-4">
          {plan.map((w) => (
            <button
              key={w.week}
              onClick={() => setCurrentWeek(w.week)}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 8,
                background: currentWeek === w.week ? block.color : w.week < currentWeek ? `${block.color}30` : C.raised,
                border: `1px solid ${currentWeek === w.week ? block.color : C.line}`,
                fontFamily: FONT_MONO,
                fontSize: 10,
                fontWeight: 700,
                color: currentWeek === w.week ? C.bg : C.mid,
              }}
              className="hover-pop"
            >
              W{w.week}
            </button>
          ))}
        </div>

        {/* Week stats */}
        <div className="flex gap-2 mb-4">
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex-1 p-3 text-center">
            <div style={{ fontFamily: FONT_MONO, color: block.color, fontSize: 16, fontWeight: 700 }}>{currentWeekData.reps}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("repsLabel")}</div>
          </div>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex-1 p-3 text-center">
            <div style={{ fontFamily: FONT_MONO, color: block.color, fontSize: 16, fontWeight: 700 }}>{currentWeekData.intensity}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("intensity")}</div>
          </div>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex-1 p-3 text-center">
            <div style={{ fontFamily: FONT_MONO, color: block.color, fontSize: 16, fontWeight: 700 }}>{currentWeekData.sets}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("setsLabel")}</div>
          </div>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex-1 p-3 text-center">
            <div style={{ fontFamily: FONT_MONO, color: block.color, fontSize: 16, fontWeight: 700 }}>{currentWeekData.volume}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{t("volume")}</div>
          </div>
        </div>

        {/* Days for current week */}
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">{t("thisWeeksWorkouts")}</div>
        {currentWeekData.days.map((day, i) => (
          <div key={i} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-3 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div style={{ background: `${block.color}22`, borderRadius: 8 }} className="p-1.5">
                  <Calendar size={14} color={block.color} />
                </div>
                <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>{day.name}</span>
              </div>
              <span style={{ fontFamily: FONT_MONO, color: block.color, fontSize: 11, fontWeight: 700 }}>{day.exercises.length} exercises</span>
            </div>
            <div className="space-y-1.5">
              {day.exercises.map((ex, j) => (
                <div key={j} className="flex items-center justify-between px-3 py-2" style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8 }}>
                  <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12 }}>{ex.name}</span>
                  <span style={{ fontFamily: FONT_MONO, color: C.mid, fontSize: 10 }}>{ex.targetSets}×{ex.targetReps} @ {ex.intensity}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleStartWorkout(day)}
              style={{ background: block.color, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
              className="w-full rounded-xl py-2.5 mt-3 text-xs hover-glow"
            >
              {t("startDay")} {day.name}
            </button>
          </div>
        ))}

        {/* Full block overview */}
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2 mt-6">{t("fullBlockOverview")}</div>
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4">
          {plan.map((w) => (
            <div key={w.week} className="flex items-center gap-3 py-2" style={{ borderBottom: w.week < plan.length ? `1px solid ${C.line}` : "none" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: w.week === currentWeek ? block.color : w.week < currentWeek ? `${block.color}30` : C.surface,
                border: `1px solid ${w.week === currentWeek ? block.color : C.line}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {w.week < currentWeek ? <Check size={12} color={block.color} /> : <span style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, color: w.week === currentWeek ? C.bg : C.mid }}>{w.week}</span>}
              </div>
              <div className="flex-1">
                <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12, fontWeight: 600 }}>{w.desc}</div>
                <div style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 10 }}>{w.reps} reps · {w.intensity} · {w.volume}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}