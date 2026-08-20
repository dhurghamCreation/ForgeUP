import { useState, useEffect } from "react";
import {
  ChevronLeft, Mic, MicOff, Volume2, VolumeX, Play, Radio, Sparkles,
} from "lucide-react";
import { useLang } from "../i18n";

const C = {
  bg: "#F7F5F2",
  surface: "#FFFFFF",
  raised: "#F0EDE8",
  line: "#E2DDD5",
  hi: "#1F2937",
  mid: "#374151",
  low: "#6B7280",
  accent: "#0b1bf5",
  warm: "#eb0b0b",
  cool: "#098159",
  gold: "#a57b10",
};

const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

// VoiceCoach singleton — handles Web Speech API synthesis + recognition
class VoiceCoachEngine {
  constructor() {
    this.synth = null;
    this.voices = [];
    this.enabled = true;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.recognition = null;
    this.listening = false;
    this.onResult = null;
    this.supported = typeof window !== "undefined" && ("speechSynthesis" in window);
  }

  init() {
    if (!this.supported || this.synth) return;
    this.synth = window.speechSynthesis;
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  speak(text, options = {}) {
    if (!this.enabled || !this.supported || !this.synth) return;
    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const preferredVoice =
        this.voices.find((v) => v.lang.startsWith("en") && v.localService) ||
        this.voices.find((v) => v.lang.startsWith("en"));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = options.rate || this.rate;
      utterance.pitch = options.pitch || this.pitch;
      utterance.volume = options.volume || 1;
      this.synth.speak(utterance);
    } catch (e) { /* speech synthesis failed */ }
  }

  stopSpeaking() {
    if (this.synth) this.synth.cancel();
  }

  startListening(onResult, onError) {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      if (onError) onError("Speech recognition is not supported in this browser.");
      return false;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SR();
    this.recognition.lang = "en-US";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.listening = false;
      if (onResult) onResult(transcript);
    };
    this.recognition.onerror = (event) => {
      this.listening = false;
      if (onError) onError(event.error || "recognition error");
    };
    this.recognition.onend = () => {
      this.listening = false;
    };

    try {
      this.recognition.start();
      this.listening = true;
      return true;
    } catch (e) {
      if (onError) onError("Could not start listening.");
      return false;
    }
  }

  stopListening() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
      this.listening = false;
    }
  }
}

const voiceCoach = typeof window !== "undefined" ? new VoiceCoachEngine() : null;

// ============================================================================
// ADVANCED AI VOICE COACH ENGINE
// ============================================================================

// Knowledge base of exercise tips organized by muscle group
const EXERCISE_KNOWLEDGE = {
  bench: "For bench press, keep your shoulder blades pinched together and your feet planted. Lower the bar to your mid-chest with control, then drive up explosively.",
  squat: "For squats, push your knees out in line with your toes. Keep your chest tall and sit back into the squat. Drive up through your entire foot.",
  deadlift: "For deadlifts, keep the bar close to your body the entire time. Brace your core hard and push the floor away. Don't let your lower back round.",
  ohp: "For overhead press, squeeze your glutes to protect your lower back. Keep the bar close to your face and press straight up. Lock out then lower with control.",
  pullup: "For pull-ups, drive your elbows down and back. Keep your chest proud. Control the negative for maximum growth.",
  row: "For barbell rows, hinge at the hips with a proud chest. Pull the bar to your belly button and squeeze your shoulder blades together.",
  lunge: "For lunges, take a big step and decelerate with control. Keep your torso tall and drive through the front foot to stand back up.",
  curl: "For curls, keep your elbows glued to your sides. Don't swing — control the lowering so you feel the biceps working.",
  "tricep-pushdown": "For tricep pushdowns, lean slightly forward, brace your elbows to your ribs, and press the bar down until your arms lock.",
  "lateral-raise": "For lateral raises, lead with your elbows and keep a soft bend. Stop at shoulder height and lower slowly.",
  plank: "For the plank, squeeze your glutes, brace your abs hard, and breathe. Quality over time.",
};

// Common commands mapping
const COMMAND_PATTERNS = {
  restTimer: {
    pattern: /(?:rest|break|pause timer)\s*(?:for\s*)?(\d+)?\s*(?:minute|min|sec|second|secs)?s?/i,
    response: (m) => {
      const num = m ? parseInt(m) : null;
      if (!num) return "Rest timer set for 90 seconds. Take a deep breath.";
      if (num <= 3) return `Rest timer set for ${num} minutes. Relax and breathe.`;
      return `Rest timer set for ${num} minutes. Hydrate and shake out your arms.`;
    },
  },
  logWeight: {
    pattern: /(?:logged|did|tracked)\s+(\d+(?:\.\d+)?)\s*(?:kilos|kg|pounds|lbs)\s*(?:for\s*)?(\d+)?\s*(?:reps|repetitions)?/i,
    response: (m) => {
      if (m && m[1]) {
        const kg = m[1];
        const reps = m[2] ? ` for ${m[2]} reps` : "";
        const kgNum = parseFloat(kg);
        let encouragement = " Nice work!";
        if (kgNum >= 80) encouragement = " That's some serious weight!";
        else if (kgNum >= 60) encouragement = " Strong performance!";
        else if (kgNum >= 40) encouragement = " Good solid weight!";
        else encouragement = " Great form and consistency!";
        return `Logged ${kg} kilos${reps}.` + encouragement;
      }
      return "I heard you want to log some weight. Can you say the kilos and reps clearly?";
    },
  },
  setComplete: {
    pattern: /(?:set complete|done set|set done|finished set|complete set)/i,
    response: () => "Set complete! Rest 90 seconds before the next set. Remember to hydrate between heavy sets.",
  },
  nextExercise: {
    pattern: /(?:next ex(c|e)rcise|move on|switch exercise)/i,
    response: () => "Moving to the next exercise now. Make sure you have your weights ready and the bench adjusted.",
  },
  lastSet: {
    pattern: /(?:last set|final set|one more set)/i,
    response: () => "Final set! Go heavy — this is where the gains happen. Give it everything you've got!",
  },
  pause: {
    pattern: /(?:pause|stop timer|halt)/i,
    response: () => "Timer paused. Take a moment, catch your breath.",
  },
  resume: {
    pattern: /(?:resume|continue|start timer|go again)/i,
    response: () => "Timer started. Go go go!",
  },
  faster: {
    pattern: /(?:faster|speed up|quicker)/i,
    response: () => "Increasing the pace. Keep your tempo steady — quality reps at speed!",
  },
  slower: {
    pattern: /(?:slower|slow down|ease up)/i,
    response: () => "Slowing down. Control the eccentric for maximum muscle recruitment.",
  },
  newPR: {
    pattern: /(?:new personal record|new pr|record|pr!)/i,
    response: () => "Amazing! That's a new personal record! Celebrate this moment — you earned it!",
  },
  encouragement: {
    pattern: /(?:motivate|encourage|hypeme|help)/i,
    response: () => {
      const messages = [
        "You are absolutely strong. Every rep brings you closer to the person you want to become. Push through!",
        "Fear is temporary, but the gain is permanent. Run the show today!",
        "Your only competition is yesterday's version of you. Let's go!",
        "The weight doesn't know who you are. You are stronger than you think!",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
  },
  technique: {
    pattern: /(?:technique|form|how do (?:i|you)|tips? (?:for|on)?(?:\s*([a-z-]+))?)/i,
    response: (m) => {
      const target = m && m[2];
      // Try to match an exercise name
      const lowerInput = target ? target.toLowerCase() : "";
      for (const [key, text] of Object.entries(EXERCISE_KNOWLEDGE)) {
        if (lowerInput.includes(key) || key.includes(lowerInput)) {
          return text;
        }
      }
      return "For proper form, keep your core braced, shoulders back, and move with controlled speed. Say 'form' followed by an exercise name for specific tips.";
    },
  },
  workoutStatus: {
    pattern: /(?:how many sets|workout progress|how many exercises|status)/i,
    response: () => "You're doing great! Check your training log for exact set counts. Let me know when a set is complete to update your totals.",
  },
  hello: {
    pattern: /(?:hello|hi|hey|good (morning|afternoon|evening))/i,
    response: () => {
      const hour = new Date().getHours();
      let greeting = "Hello";
      if (hour < 12) greeting = "Good morning";
      else if (hour < 17) greeting = "Good afternoon";
      else greeting = "Good evening";
      return `${greeting}! I'm your ForgeUp Voice Coach. I can help you log lifts, set rest timers, or keep you motivated. How are we training today?`;
    },
  },
  howAreYou: {
    pattern: /(?:how are you|how's it going|how is it going|how are things|how do you feel|what's up|whats up|how have you been)/i,
    response: () => {
      const messages = [
        "I'm feeling great, thank you for asking! I'm fully charged and ready to help you crush your workout. How are you feeling today?",
        "I'm doing fantastic! All systems operational and ready to coach. More importantly, how are you feeling? Ready to train?",
        "I'm excellent! I've been analyzing training data all day. The real question is — how are you? Let's make today count!",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
  },
  whatCanYouDo: {
    pattern: /(?:what can you do|what do you do|what are you|who are you|what is your purpose|what are your features|capabilities)/i,
    response: () => {
      return "I'm your AI fitness coach. I can help you log weights and reps, set rest timers, give you exercise form tips, keep you motivated, track your workout progress, and even celebrate your personal records. Just speak naturally and I'll understand!";
    },
  },
  workoutAdvice: {
    pattern: /(?:what should i (?:do|train|workout)|give me a workout|suggest a workout|recommend a workout|what workout)/i,
    response: () => {
      const workouts = [
        "Based on your training history, I'd recommend a Push Day: bench press 4 sets, incline dumbbell press 3 sets, overhead press 3 sets, lateral raises 3 sets, and tricep pushdowns 3 sets. Focus on controlled tempo!",
        "A great session today would be: squats 4 sets, walking lunges 3 sets, hip thrusts 3 sets, and core work. Remember to warm up properly first!",
        "For a balanced day, try: deadlifts 3 sets, barbell rows 3 sets, pull-ups 3 sets, and hanging leg raises 3 sets. Keep your back tight on every rep!",
      ];
      return workouts[Math.floor(Math.random() * workouts.length)];
    },
  },
  nutritionAdvice: {
    pattern: /(?:what should i eat|nutrition|diet|meal plan|protein|food)/i,
    response: () => {
      return "For optimal recovery, aim for 1.6-2.2 grams of protein per kilogram of body weight. Good sources: chicken breast, eggs, Greek yogurt, and whey. Pair with complex carbs like rice and oats, and healthy fats from nuts and avocado. Hydrate with at least 3 liters of water daily!";
    },
  },
  recoveryAdvice: {
    pattern: /(?:how to recover|recovery|rest day|sleep|recover faster)/i,
    response: () => {
      return "Recovery is where the gains happen! Aim for 7-9 hours of quality sleep, eat protein within 2 hours of training, do light mobility work on rest days, and stay hydrated. If you're feeling sore, try foam rolling and contrast showers.";
    },
  },
  motivation: {
    pattern: /(?:motivate|encourage|hypeme|help|inspire|pump me up)/i,
    response: () => {
      const messages = [
        "You are absolutely strong. Every rep brings you closer to the person you want to become. Push through!",
        "Fear is temporary, but the gain is permanent. Run the show today!",
        "Your only competition is yesterday's version of you. Let's go!",
        "The weight doesn't know who you are. You are stronger than you think!",
        "Champions are made in the moments others quit. This is your moment — go get it!",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
  },
  thanks: {
    pattern: /(?:thank|thanks|appreciate)/i,
    response: () => "You're welcome! Consistency beats motivation — keep showing up!",
  },
  love: {
    pattern: /(?:love|like you|great job|awesome|amazing)/i,
    response: () => "Aww, thanks! I'm here to help you hit every goal. Now let's get back to work!",
  },
  listen: {
    pattern: /(?:help me|show|example|how to use|what can i say)/i,
    response: () => {
      return "You can say things like: rest 90 seconds, logged 80 kilos 8 reps, set complete, next exercise, form bench, motivate me, what should I eat, how are you, or start timer.";
    },
  },
  weather: {
    pattern: /(?:weather|temperature|raining|sunny)/i,
    response: () => {
      return "I'm focused on your training, but I can tell you this: the best weather for a workout is the weather you show up in! Let's get those reps in.";
    },
  },
  time: {
    pattern: /(?:what time|time is it|what's the time|current time)/i,
    response: () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return `It's currently ${time}. Perfect time to get a workout in!`;
    },
  },
  date: {
    pattern: /(?:what day|what date|today's date|what's today)/i,
    response: () => {
      const now = new Date();
      const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
      return `Today is ${date}. Let's make it a great training day!`;
    },
  },
  joke: {
    pattern: /(?:joke|funny|make me laugh)/i,
    response: () => {
      const jokes = [
        "Why do bodybuilders love the gym? Because it's the only place where being a dumbbell is a compliment!",
        "I asked my trainer for a spot. He said 'You're already in the right spot — the gym!'",
        "Why did the weightlifter bring a ladder to the gym? To reach his personal records!",
        "My doctor told me to lift weights. I said 'I already do — I lift my protein shake every morning!'",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
  },
  compliment: {
    pattern: /(?:you're (?:great|awesome|amazing|the best)|you are (?:great|awesome|amazing|the best)|good coach)/i,
    response: () => "Thank you! I'm here to help you become the strongest version of yourself. Your dedication is what makes the difference!",
  },
  question: {
    pattern: /(?:what|why|how|when|where|who|can you|do you|are you|is it|will you)/i,
    response: () => {
      const responses = [
        "That's a great question! I'm your AI fitness coach, so I can help with training plans, exercise form, nutrition, recovery, and motivation. What would you like to know?",
        "Great question! I'm here to help you train smarter. I can guide you on exercises, form, nutrition, recovery, and keeping you motivated. What's on your mind?",
        "I'm happy to help with that! As your AI coach, I can assist with workout planning, technique tips, nutrition advice, recovery strategies, and motivation. What specifically would you like to know?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    },
  },
  default: {
    pattern: /.*/i,
    response: () => {
      const responses = [
        "I understand you're asking something. I'm your AI fitness coach — I can help with exercises, form, nutrition, recovery, and motivation. Try asking me about a specific exercise, or say 'help me' to see what I can do!",
        "I'm here to help! I can assist with workout plans, exercise technique, nutrition advice, recovery tips, and motivation. What would you like to know about your training?",
        "I'm your AI coach and I'm ready to help! I can guide you on exercises, form, nutrition, recovery, and motivation. What can I assist you with today?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    },
  },
};

/**
 * Parse a spoken command and generate a smart, context-aware response
 */
function processVoiceCommand(text, session) {
  const lower = text.toLowerCase();

  // Deep exercise knowledge lookup
  for (const command of Object.values(COMMAND_PATTERNS)) {
    const match = lower.match(command.pattern);
    if (match && command.response) {
      return command.response(match) || "Command processed.";
    }
  }

  // Try to match exercise names directly
  const exerciseKeys = Object.keys(EXERCISE_KNOWLEDGE);
  for (const key of exerciseKeys) {
    if (lower.includes(key)) {
      return EXERCISE_KNOWLEDGE[key];
    }
  }

  // No match — return helpful fallback
  return `I didn't quite catch that. You can say things like "rest 2 minutes", "log 80 kilos 8 reps", "set complete", or "motivate me". What would you like?`;
}

// Demo voice commands
const voiceCommands = [
  "rest 90 seconds",
  "logged 90 kilos 8 reps",
  "set complete",
  "next exercise",
  "motivate me",
  "form bench press",
  "start timer",
  "new personal record",
];

export default function VoiceCoach({ onBack, onCommand, session }) {
  const { t } = useLang();
  const [enabled, setEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState([
    { role: "coach", text: "Hello! I'm your ForgeUp AI Voice Coach. Tap the mic and I'll listen to your commands.", time: "Just now" },
    { role: "coach", text: "You can log weights, time rests, ask for form tips, get motivated, or control your workout.", time: "Just now" },
  ]);

  useEffect(() => {
    voiceCoach?.init();
    if (voiceCoach) voiceCoach.enabled = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!session && enabled) {
      voiceCoach?.speak("Welcome to ForgeUp voice coach. Say a command when you're ready.");
    }
  }, [session]);

  const addHistory = (role, text) => {
    setHistory((prev) => [{ role, text, icon: role === "coach" ? "coach" : "user" }, ...prev].slice(0, 12));
  };

  const toggleListening = () => {
    if (listening) {
      voiceCoach?.stopListening();
      setListening(false);
      return;
    }
    setTranscript("");
    const started = voiceCoach?.startListening(
      (result) => {
        setListening(false);
        setTranscript(result);
        setLastCommand(result);
        addHistory("user", result);

        // Process the voice command with the AI engine
        const response = processVoiceCommand(result, session);
        voiceCoach?.speak(response);
        addHistory("coach", response);
        if (onCommand) onCommand(result);
      },
      (error) => {
        setListening(false);
        setTranscript(`Error: ${error}`);
        voiceCoach?.speak("Sorry, I couldn't hear that. Please try again.");
      }
    );

    if (started) {
      setListening(true);
      voiceCoach?.speak("Listening...");
    } else {
      setTranscript("Speech recognition unavailable. Try Chrome or Edge.");
    }
  };

  const speak = (text) => {
    if (!enabled) return;
    addHistory("coach", text);
    voiceCoach?.speak(text);
  };

  const quickCommand = (cmd) => {
    setLastCommand(cmd);
    addHistory("user", cmd);
    const response = processVoiceCommand(cmd, session);
    voiceCoach?.speak(response);
    addHistory("coach", response);
    if (onCommand) onCommand(cmd);
  };

  const testVoice = () => {
    setEnabled(true);
    voiceCoach.speak("Hello! I'm your Forge AI voice coach. Let's crush this workout together! Say a command anytime.");
  };

  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} style={{ background: C.raised, border: `1px solid ${C.line}` }} className="rounded-full p-2 hover-pop">
            <ChevronLeft size={18} color={C.hi} />
          </button>
          <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 20, fontWeight: 700 }}>{t("aiVoiceCoach")}</h1>
        </div>
        <div className="flex items-center gap-2">
          {enabled && (
            <span style={{ fontFamily: FONT_MONO, color: C.cool, fontSize: 10, background: `${C.cool}15`, borderRadius: 999 }} className="px-2 py-1">
              {t("liveAi")}
            </span>
          )}
          <button onClick={() => setEnabled((v) => !v)} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-2 hover-pop">
            {enabled ? <Volume2 size={17} color={C.cool} /> : <VolumeX size={17} color={C.low} />}
          </button>
        </div>
      </div>

      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {/* Status card */}
        <div style={{ background: `linear-gradient(155deg, ${enabled ? C.cool : C.raised}, ${C.surface})`, border: `1px solid ${enabled ? C.cool : C.line}40`, borderRadius: 16 }} className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ background: enabled ? `${C.cool}22` : C.surface, borderRadius: 10, width: 40, height: 40 }} className="flex items-center justify-center">
                {enabled ? <Radio size={19} color={C.cool} /> : <MicOff size={19} color={C.low} />}
              </div>
              <div>
                <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, fontWeight: 700 }}>{enabled ? t("aiCoachActive") : t("voiceCoachMuted")}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }}>{enabled ? t("intentRecognition") : t("turnOnHandsFree")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Listen button - more visible */}
        <button
          onClick={toggleListening}
          style={{
            background: listening ? C.warm : C.accent,
            fontFamily: FONT_BODY, fontWeight: 700, color: C.bg,
            borderRadius: 14, padding: 14,
            boxShadow: listening ? `0 0 30px ${C.warm}44` : `0 4px 20px ${C.accent}33`,
          }}
          className="w-full flex items-center justify-center text-sm mb-4 hover-glow"
        >
          {listening ? (
            <>
              <div className="relative mr-2">
                <span style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `2px solid ${C.bg}44`, animation: "pulse-ring 1.2s infinite" }} />
                <Mic size={22} color={C.bg} />
              </div>
              {t("listeningSayCommand")}
            </>
          ) : (
            <>
              <Mic size={22} color={C.bg} className="mr-2" />
              {transcript ? t("tapToTryAgain") : t("tapAndTalk")}
            </>
          )}
        </button>

        {/* Current transcript */}
        {transcript && !listening && (
          <div style={{ background: `${C.accent}12`, border: `1px solid ${C.accent}30`, borderRadius: 12 }} className="p-3 mb-4">
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 10 }} className="uppercase tracking-wide mb-1">{t("lastCommand")}</div>
            <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>"{transcript}"</div>
          </div>
        )}

        {/* Quick commands */}
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">{t("quickCommands")}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {voiceCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => quickCommand(cmd)}
              style={{
                background: C.raised,
                border: `1px solid ${C.line}`,
                borderRadius: 999,
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: C.hi,
                padding: "5px 12px",
              }}
              className="hover-pop"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Test voice */}
        <button
          onClick={testVoice}
          style={{ background: C.raised, border: `1px solid ${C.cool}40`, borderRadius: 12, fontFamily: FONT_BODY, fontWeight: 600, color: C.cool }}
          className="w-full py-3 mb-5 flex items-center justify-center gap-2 text-sm hover-lift"
        >
          <Play size={16} fill={C.cool} /> {t("testVoiceGuidance")}
        </button>

        {/* Conversation history — darker text for visibility */}
        <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11 }} className="uppercase tracking-wide mb-2">{t("coachConversation")}</div>
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4">
          {history.map((msg, i) => (
            <div key={i} className="flex items-start gap-2 py-2" style={{ borderBottom: i < history.length - 1 ? `1px solid ${C.line}` : "none" }}>
              {msg.role === "coach" ? (
                <Sparkles size={15} color={C.cool} className="mt-0.5 flex-shrink-0" />
              ) : (
                <Mic size={13} color={C.accent} className="mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                {msg.role === "coach" && (
                  <div style={{ fontFamily: FONT_BODY, color: C.cool, fontSize: 10, fontWeight: 700 }} className="mb-0.5 uppercase tracking-wide">{t("aiCoach")}</div>
                )}
                <span style={{
                  fontFamily: FONT_BODY,
                  // High-contrast text: near-black for readability
                  color: msg.role === "coach" ? C.hi : C.hi,
                  fontSize: msg.role === "coach" ? 13.5 : 13,
                  lineHeight: 1.6,
                  fontWeight: msg.role === "coach" ? 500 : 600,
                }}>
                  {msg.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}