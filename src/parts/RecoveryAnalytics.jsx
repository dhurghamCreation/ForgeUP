import { useState, useMemo } from "react";
import {
  ChevronLeft, HeartPulse, Moon, Activity, Flame, Brain, Battery, Zap, Check, Wind, Minus, Plus,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
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

// Readiness score calculation weights
const READINESS_WEIGHTS = {
  sleep: 0.4,      // Sleep duration h (7-9h optimal)
  hrv: 0.35,       // HRV baseline comparison
  restingHR: 0.15, // Resting heart rate (lower is better)
  activity: 0.10,  // Previous day's activity load
};

const RECOVERY_SUGGESTIONS = [
  {
    score: 30,
    level: "Red",
    title: "Take a Rest Day",
    desc: "Readiness is critically low. Light mobility or complete rest is strongly recommended.",
    color: C.warm,
    exercise: "Easy mobility flow — 20min",
  },
  {
    score: 50,
    level: "Yellow",
    title: "Recovery Session",
    desc: "Readiness is diminished. Choose lower-body, sub-maximal work with lighter loads.",
    color: C.gold,
    exercise: "Deload — 60% 1RM, RPE 6-7",
  },
  {
    score: 70,
    level: "Green",
    title: "Normal Training",
    desc: "Readiness is adequate. Follow the planned session, but keep RPE in check.",
    color: C.cool,
    exercise: "Normal planned session — push day",
  },
  {
    score: 85,
    level: "Peak",
    title: "Go Hard!",
    desc: "Readiness is high. Perfect conditions for a PR attempt or high-intensity session.",
    color: C.accent,
    exercise: "Heavy compounds — hit a new PR",
  },
];

const SAMPLE_HRV = [
  { d: "Mon", hrv: 68, hr: 58, sleep: 7.5, score: 82 },
  { d: "Tue", hrv: 72, hr: 55, sleep: 6.8, score: 74 },
  { d: "Wed", hrv: 65, hr: 60, sleep: 8.2, score: 88 },
  { d: "Thu", hrv: 58, hr: 63, sleep: 6.2, score: 56 },
  { d: "Fri", hrv: 71, hr: 54, sleep: 7.8, score: 79 },
  { d: "Sat", hrv: 66, hr: 57, sleep: 9.1, score: 91 },
  { d: "Sun", hrv: 62, hr: 59, sleep: 8.4, score: 85 },
];

export default function RecoveryAnalytics({ onBack, healthData, onStartRecoveryWorkout }) {
  const { t } = useLang();
  const [hrv, setHrv] = useState(healthData?.hrv || 65);
  const [restingHR, setRestingHR] = useState(healthData?.restingHR || 58);
  const [sleepHours, setSleepHours] = useState(healthData?.sleep || 7.2);
  const [activityLoad, setActivityLoad] = useState(4200);
  const [dataRange, setDataRange] = useState("week");
  const [autoSuggest, setAutoSuggest] = useState(false);

  const hrvScore = useMemo(() => {
    // Map HRV value to a 0-100 score (baseline 65ms → ~70)
    return Math.max(0, Math.min(100, Math.round(((hrv - 40) / 50) * 100)));
  }, [hrv]);

  const restingHRScore = useMemo(() => {
    // 40bpm → 100, 80bpm → 0
    return Math.max(0, Math.min(100, Math.round(((80 - restingHR) / 40) * 100)));
  }, [restingHR]);

  const sleepScore = useMemo(() => {
    // 9h → 100, <3h → 0
    return Math.max(0, Math.min(100, Math.round(((sleepHours - 3) / 6) * 100)));
  }, [sleepHours]);

  const readinessScore = useMemo(() => {
    const weightedScore =
      READINESS_WEIGHTS.sleep * sleepScore +
      READINESS_WEIGHTS.hrv * hrvScore +
      READINESS_WEIGHTS.restingHR * restingHRScore +
      READINESS_WEIGHTS.activity * Math.min(100, activityLoad / 50);
    return Math.max(0, Math.round(weightedScore));
  }, [sleepScore, hrvScore, restingHRScore, activityLoad]);

  // IMPORTANT FIX: Iterate from HIGHEST threshold down so a high readiness
  // correctly shows Green/Peak instead of always falling into Red.
  // e.g. readiness 85 → Peak, 70-84 → Green, 50-69 → Yellow, <50 → Red
  const suggestion = [...RECOVERY_SUGGESTIONS]
    .reverse()
    .find((s) => readinessScore >= s.score) || RECOVERY_SUGGESTIONS[0];

  // Time-range filtered HRV data
  const chartData = useMemo(() => {
    if (dataRange === "month") {
      const out = [];
      for (let i = 0; i < 30; i++) {
        out.push({
          d: `D${i + 1}`,
          hrv: Math.round(SAMPLE_HRV[i % SAMPLE_HRV.length].hrv + (i % 3 === 0 ? 6 : -3)),
        });
      }
      return out;
    }
    return SAMPLE_HRV;
  }, [dataRange]);

  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} style={{ background: C.raised, border: `1px solid ${C.line}` }} className="rounded-full p-2 hover-pop">
            <ChevronLeft size={18} color={C.hi} />
          </button>
          <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 20, fontWeight: 700 }}>{t("recoveryHrvTitle")}</h1>
        </div>
      </div>

      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {/* Readiness Score Card */}
        <div style={{ background: `linear-gradient(155deg, ${suggestion.color}18, transparent)`, border: `1px solid ${suggestion.color}40`, borderRadius: 16 }} className="p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div style={{ background: `${suggestion.color}22`, borderRadius: 12, width: 40, height: 40 }} className="flex items-center justify-center">
                <Brain size={20} color={suggestion.color} />
              </div>
              <div>
                <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }}>{t("readinessScore")}</div>
                <div style={{ fontFamily: FONT_MONO, color: suggestion.color, fontSize: 32, fontWeight: 700 }} className="leading-none">{readinessScore}</div>
              </div>
            </div>
            <div className="text-right">
              <div style={{ fontFamily: FONT_MONO, color: C.mid, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{t("level")}</div>
              <div style={{ fontFamily: FONT_DISPLAY, color: suggestion.color, fontSize: 17, fontWeight: 700 }}>{suggestion.level}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{suggestion.desc}</div>
            </div>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.6, color: C.mid }}>
            {t("suggestion")} <strong style={{ color: C.hi }}>{suggestion.title}</strong> — {suggestion.exercise}
          </div>
        </div>

        {/* Inputs card */}
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4">
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-3">{t("yourBioMetrics")}</div>

          {[
            { label: t("hrvLabel"), value: hrv, set: setHrv, step: 5, icon: Activity, color: C.accent, min: 20, max: 120 },
            { label: t("restingHrLabel"), value: restingHR, set: setRestingHR, step: 2, icon: HeartPulse, color: C.warm, min: 35, max: 90 },
            { label: t("sleepLabel"), value: sleepHours, set: setSleepHours, step: 0.5, icon: Moon, color: C.cool, min: 0, max: 12 },
            { label: t("dailyActivityLabel"), value: activityLoad, set: setActivityLoad, step: 100, icon: Flame, color: C.gold, min: 0, max: 10000 },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2 mb-2.5" style={{ background: C.surface, border: `1px solid ${f.color}40`, borderRadius: 12 }}>
              <div className="px-3 py-2.5 flex items-center gap-2 w-full">
                <f.icon size={16} color={f.color} className="flex-shrink-0" />
                <div className="flex-1">
                  <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 10 }}>{f.label}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button onClick={() => f.set(Math.max(f.min, f.value - f.step))} style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-1 hover-pop">
                      <Minus size={12} color={C.mid} />
                    </button>
                    <input value={f.value} onChange={(e) => f.set(Number(e.target.value) || 0)} type="number"
                      style={{ fontFamily: FONT_MONO, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, color: C.hi, fontSize: 14, fontWeight: 700, padding: "5px 8px", width: "100%", textAlign: "center" }} />
                    <button onClick={() => f.set(Math.min(f.max, f.value + f.step))} style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-1 hover-pop">
                      <Plus size={12} color={C.mid} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Auto-suggest toggle */}
          <button onClick={() => setAutoSuggest((v) => !v)} className="flex items-center justify-between gap-3 mt-3" style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 14, width: "100%", padding: "12px 14px" }}>
            <span className="flex items-center gap-2">
              <Wind size={16} color={autoSuggest ? C.accent : C.low} />
              <span>
                <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12.5, fontWeight: 600 }}>{t("autoRecoveryMode")}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 10, display: "block", color: C.low }}>{t("autoRecoveryDesc")}</span>
              </span>
            </span>
            <span style={{ background: autoSuggest ? C.accent : C.surface, border: `1px solid ${autoSuggest ? C.accent : C.line}`, borderRadius: 6 }} className="p-1">
              <Check size={13} color={autoSuggest ? C.bg : C.mid} />
            </span>
          </button>
        </div>

        {/* HRV Trend Chart */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 15, fontWeight: 700 }}>{t("hrvTrend")}</span>
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 8 }} className="p-0.5 flex">
            {["week", "month"].map((r) => (
              <button key={r} onClick={() => setDataRange(r)}
                style={{
                  fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600,
                  color: dataRange === r ? C.bg : C.mid,
                  background: dataRange === r ? C.accent : "transparent",
                  borderRadius: 6, padding: "3px 10px",
                }}
                className="hover-pop">
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="d" tick={{ fill: C.low, fontSize: 9, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="hrv" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3, fill: C.accent }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* HRV status */}
        <div className="flex gap-4 mb-4">
          {[
            { label: t("hrv"), value: hrv, color: C.accent },
            { label: t("restHr"), value: restingHR, color: C.warm },
            { label: t("sleepShort"), value: sleepHours, color: C.cool },
          ].map((s) => (
            <div key={s.label} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex-1 p-3 text-center">
              <div style={{ fontFamily: FONT_MONO, color: s.color, fontSize: 18, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Suggested recovery workout */}
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2 mt-5">{t("suggestedSession")}</div>
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4 hover-lift">
          <div className="flex items-start gap-3">
            <div style={{ background: `${suggestion.color}22`, borderRadius: 10 }} className="p-2">
              {suggestion.color === C.warm ? <Battery size={18} color={suggestion.color} /> : suggestion.color === C.accent ? <Zap size={18} color={suggestion.color} /> : <Activity size={18} color={suggestion.color} />}
            </div>
            <div className="flex-1">
              <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>{suggestion.title}</div>
              <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11, lineHeight: 1.5 }} className="mt-1">{suggestion.desc}</div>
              <button
                onClick={onStartRecoveryWorkout}
                style={{ background: suggestion.color, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg, borderRadius: 8, marginTop: 8 }}
                className="px-4 py-2 text-xs hover-glow"
              >
                {t("startSuggestedWorkout")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}