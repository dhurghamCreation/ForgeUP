import { createContext, useContext } from "react";

/* ---------------- LANGUAGES ---------------- */
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
];

/* ---------------- TRANSLATIONS ---------------- */
export const T = {
  en: {
    // Navigation
    dashboard: "Dashboard", exercises: "Exercises", train: "Train", analytics: "Analytics", profile: "Profile",
    settings: "Settings", goals: "Weekly goals", challenges: "Challenges", equipment: "Equipment",
    meals: "Meal options", weight: "Weight & BMI", feedback: "Feedback", rate: "Rate us", language: "Language",
    music: "Music", sound: "Sound", ready: "Ready to move?", start: "Start workout", resume: "Resume workout",
    finish: "Finish workout", search: "Search exercises", noResults: "No exercises match", nutrition: "Nutrition & macros",
    leaderboard: "Community leaderboard", privacy: "Privacy & data", wearable: "Wearable sync",
    measurements: "Body measurements", plan: "Training plan", back: "Back", skip: "Skip for now", done: "Done",
    next: "Next", timer: "Timer", instructions: "Instructions", demo: "Demo", weightLabel: "Weight", bmi: "BMI",
    height: "Height", save: "Save", on: "On", off: "Off", more: "More", week: "Week", month: "Month",
    allTime: "All time", thisWeek: "this week", streak: "Streak", keepGoing: "Keep it going",
    personalRecord: "Personal record", lastSession: "Last session", progress: "Progress",
    platesNeeded: "Plates needed (each side)", targetWeight: "Target weight", perSide: "Per side",
    barWeight: "Bar weight", inProgress: "In progress", complete: "Complete", setLabel: "SET", kg: "KG",
    reps: "REPS", restDone: "Rest over!", restDesc: "Your 90s rest is complete — get ready for your next set.",
    pushNotif: "Push notifications", pushNotifDesc: "Get a browser notification when your rest timer finishes.",
    enableNotif: "Enable notifications", testNotif: "Send test notification",
    notifDenied: "Notifications blocked. Allow them in your browser settings.",
    activeCalories: "Active calories", sleep: "Sleep", heartRate: "Heart rate", stepsLabel: "Steps",
    todayBurned: "kcal today", hbpm: "bpm", syncHealth: "Sync health data",
    syncDesc: "Enter your daily health data. In a native build this would connect automatically to Apple Health / Health Connect.",
    logWorkout: "Log workout", logEntry: "Enter your health metrics for today", stepsGoal: "Steps goal",
    target: "Target", current: "Current", history: "History", quickAdd: "Quick add", todaysLog: "Today's log",
    nothingLogged: "Nothing logged yet — add something above.", muscleActivation: "Muscle activation",
    liftedWeight: "Lifted weight & reps", totalVolume: "Total volume", sessionsCount: "Sessions",
    noActive: "No active session", startFromDash: "Start today's workout from the Dashboard to begin logging sets.",
    adjust: "adjust progress", markDone: "Mark done", completed: "Completed", protein: "Protein", carbs: "Carbs",
    fat: "Fat", kcal: "kcal", waist: "Waist", chest: "Chest", arms: "Arms", record: "Record",
    measurementsPage: "Body measurements",
    measurementsDesc: "Track your weight, waist, chest and arms over time. In a real build this syncs with your backend record.",
    addMeasurement: "Add measurement", weightTrend: "Weight trend", cm: "cm", january: "January",
    calendar: "Calendar", dayProgress: "Day progress", openedApp: "Days you opened the app",
    howDid: "Completed % per day", dailyStreak: "Daily streak", workoutsLogged: "Workouts logged",
    totalKcalBurned: "Total kcal burned", exercisesDone: "Exercises done", sessionCompleted: "Session completed",
    finishedWorkout: "Finish workout", add15: "+15s", sub15: "−15s", restTime: "Rest",
    goodJob: "Great job! Session complete.", totalVolumeLabel: "Volume lifted",

    // Dashboard
    wednesday: "Wednesday", aug12: "Aug 12", suggestedProgression: "Suggested progression",
    exercisesCount: "exercises", min: "min", weeklyLoad: "Weekly load", sessionLeft: "session left",
    setHeight: "Set height", underweight: "Underweight", healthy: "Healthy", overweight: "Overweight", obese: "Obese",

    // Onboarding
    tellUsAboutYou: "Tell us about you",
    tellUsSub: "This personalises your plan. You can change it anytime in Settings.",
    mainGoal: "What's your main goal?",
    mainGoalSub: "We'll shape your training around this focus.",
    pickBodyType: "Pick your body type",
    pickBodyTypeSub: "Choose the closest match — it helps set realistic targets.",
    male: "Male", female: "Female", preferNot: "Prefer not to say",
    slim: "Slim / Lean", slimDesc: "Light frame, fast metabolism",
    athletic: "Athletic / Toned", athleticDesc: "Balanced, active build",
    muscular: "Muscular / Bulky", muscularDesc: "Solid, strong frame",
    curvy: "Curvy / Full", curvyDesc: "Soft, fuller shape",
    fullBody: "Full Body", fullBodyDesc: "Balanced strength everywhere",
    muscleGain: "Muscle Gain", muscleGainDesc: "Build size & strength",
    fatLoss: "Fat Loss", fatLossDesc: "Burn fat, reveal shape",
    strength: "Strength", strengthDesc: "Lift heavier over time",
    endurance: "Endurance", enduranceDesc: "Last longer, recover faster",
    corePosture: "Core & Posture", corePostureDesc: "Stability & balance",

    // Exercise library
    all: "All", chest: "Chest", back: "Back", legs: "Legs", glutes: "Glutes", shoulders: "Shoulders", arms: "Arms", core: "Core",
    plate: "Plate", plateCalculator: "Plate Calculator", targetMustBeHeavier: "Target must be heavier than the bar.",
    cantReachExactly: "Can't reach exactly — closest is",
    smartSuggestion: "Smart suggestion",
    lastTimeYouDid: "Last time you did",
    tryToBreak: "Try",
    toBreakPR: "to break your PR.",
    setCompleteToast: "Set complete! Rest 90s",
    sets: "sets", exercisesLower: "exercises", plates: "Plates",
    finishWorkoutCount: "Finish workout",
    restComplete: "Rest complete!",
    readyNextSet: "Ready for your next set. Go crush it!",
    noActiveSession: "No active session",
    startFromDashFull: "Start today's workout from the Dashboard to begin logging sets.",

    // Analytics
    muscleActivationRange: "Muscle activation",
    recordLabel: "record", totalVolumeLabel2: "Total volume",

    // Nutrition
    nutritionMacros: "Nutrition & macros", ofDailyGoal: "of", dailyGoal: "daily goal",
    searchFoods: "Search 28 foods (try 'chicken', 'rice', 'nuts')…",
    noFoodsMatch: "No foods match",
    added: "added",

    // Leaderboard
    shareMyStreak: "Share my streak",
    visibleToEveryone: "Visible to everyone else using this app, under",
    loadingLeaderboard: "Loading leaderboard…",
    noOneOnBoard: "No one's on the board yet — be the first to opt in.",
    you: "you",

    // Sound settings
    soundNotifications: "Sound & notifications", soundEffects: "Sound effects",
    soundEffectsDesc: "Set-complete chime, rest-timer alert, workout fanfare.",
    testSetChime: "Test set chime", testRestAlert: "Test rest alert", testFanfare: "Test fanfare",
    soundNote: "Background push notifications (a rest-timer alert while your phone is locked) need a native mobile build — a browser tab can't do this, so it isn't included here.",

    // Music settings
    backgroundMusic: "Background music", backgroundMusicDesc: "Your MP3 tracks + synthesized options.",
    yourTracks: "Your tracks",

    // Language settings
    chooseLanguage: "Choose your preferred language. The app interface will update immediately.",

    // Weight & BMI
    yourBMI: "Your BMI", weightKg: "Weight (kg)", heightCm: "Height (cm)",

    // Meal options
    sampleDay: "Sample day", breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner", evening: "Evening",

    // Weekly goals
    goalsHit: "goals hit", perfectWeek: "Perfect week — all goals smashed!",
    almostThere: "Almost there — keep pushing!", goodProgress: "Good progress — keep going.",
    gettingStarted: "Getting started — every rep counts.", doneLabel: "Done",

    // Challenges
    reward: "Reward:",

    // Equipment
    equipmentDesc: "The equipment you have shapes which exercises we recommend. All exercises in the library are tagged with the gear they need.",

    // Feedback
    thankYou: "Thank you!", feedbackThanks: "Your feedback helps us improve ForgeUp.",
    howsExperience: "How's your experience so far? Your honest feedback helps us build a better app.",
    rateExperience: "Rate your experience", tellUsMore: "Tell us more (optional)",
    whatDoYouLove: "What do you love? What could be better?", submitFeedback: "Submit feedback",

    // Rate us
    thanksForRating: "Thanks for rating!", ratingMeansWorld: "Your rating means the world to us.",
    enjoyingForgeUp: "Enjoying ForgeUp?", tapStarToRate: "Tap a star to rate the app.",
    submitRating: "Submit rating",

    // Calendar
    dailyStreakLabel: "Daily streak", workoutsLoggedLabel: "Workouts logged", totalKcalBurnedLabel: "Total kcal burned",

    // Profile
    communityChallenges: "Community & Challenges", periodizationBlocks: "Periodization Blocks",
    recoveryHrv: "Recovery & HRV", voiceCoach: "Voice Coach", achievementBadges: "Achievement badges",
    edit: "edit", account: "Account", signedInAs: "Signed in as", logOut: "Log out",
    designedBy: "Designed by Dhurgham Alsaadi", hypertrophyBeginner: "Hypertrophy · Beginner",
    intermediate: "Intermediate", firstSteps: "First Steps", firstStepsDesc: "Complete your first workout",
    centurion: "Centurion", centurionDesc: "Log 100 workouts", heavyLifter: "Heavy Lifter",
    heavyLifterDesc: "Hit 100kg on any lift", weekWarrior: "Week Warrior", weekWarriorDesc: "7-day streak",
    fortnightForge: "Fortnight Forge", fortnightForgeDesc: "14-day streak",

    // Info screens
    planInfo: "Right now everyone sees the same fixed Push/Pull/Legs plan. A real training-plan builder — pick a split, set weekly frequency, auto-generate the block — is the natural next feature, and it would reuse the same rule-based progression logic already suggesting your +2.5kg bench jump.",
    privacyInfo: "What's stored and where: your profile, streak, workout history and nutrition log are saved privately, tied to your account, and never shown to anyone else. If you opt into the community leaderboard, only your chosen display name and current streak become visible to other users — nothing else.",

    // Splash
    connecting: "Connecting…", connectingAccount: "Connecting to your account…",
    loadingHistory: "Loading training history…", loadingNutrition: "Loading nutrition log…",
    checkingLeaderboard: "Checking leaderboard…",

    // Training Plan Builder
    trainingPlanBuilder: "Training Plan Builder", designYourProgram: "Design your perfect program",
    split: "Split", frequency: "Frequency", progression: "Progression", review: "Review",
    chooseYourSplit: "Choose your split", chooseSplitDesc: "Pick the training split that fits your goals and schedule.",
    howManyDays: "How many days per week?", autoGenerate: "We'll auto-generate a",
    programForYou: "program for you.", daysPerWeek: "days / week", yourWeek: "Your week",
    trainingStyle: "Training style", trainingStyleDesc: "Choose how you want to train. We'll set the sets, reps and rest accordingly.",
    sessions: "SESSIONS", exercisesUpper: "EXERCISES", start: "Start", generatePlan: "Generate Plan",
    continue: "Continue", planSaved: "Plan Saved!", saveTrainingPlan: "Save Training Plan",
    pushPullLegs: "Push / Pull / Legs", pushPullLegsDesc: "The classic bodybuilding split. Train each muscle group twice a week with optimal recovery.",
    upperLower: "Upper / Lower", upperLowerDesc: "Efficient 4-day split. Hit every muscle group twice weekly with compound-focused sessions.",
    fullBodySplit: "Full Body", fullBodySplitDesc: "Train everything every session. Perfect for busy schedules and beginners.",
    bodybuilding: "Bodybuilding", bodybuildingDesc: "Classic body-part split. Maximum isolation for each muscle group.",
    arnoldSplit: "Arnold Split", arnoldSplitDesc: "The legendary 6-day split. Chest/Back, Shoulders/Arms, Legs — repeated twice.",
    hypertrophy: "Hypertrophy", hypertrophyDesc: "8-12 reps · 3-4 sets · 60-90s rest",
    strengthProg: "Strength", strengthProgDesc: "3-5 reps · 5 sets · 3min rest",
    power: "Power", powerDesc: "1-3 reps · 5 sets · 3-5min rest",
    enduranceProg: "Endurance", enduranceProgDesc: "15-20 reps · 3 sets · 45s rest",
    pushDay: "Push Day", pullDay: "Pull Day", legDay: "Leg Day",
    upperBody: "Upper Body", lowerBody: "Lower Body",
    chestTriceps: "Chest & Triceps", backBiceps: "Back & Biceps", legsCore: "Legs & Core",
    shouldersArms: "Shoulders & Arms", chestBack: "Chest & Back", legsGlutes: "Legs & Glutes",

    // Periodization
    periodization: "Periodization", trainingBlock: "Training Block", weeks: "weeks",
    blockDesc: "Block", weekOf: "Week", of: "of", repsLabel: "Reps", intensity: "Intensity",
    setsLabel: "Sets", volume: "Volume", thisWeeksWorkouts: "This Week's Workouts",
    fullBlockOverview: "Full Block Overview", startDay: "Start",
    hypertrophyBlock: "Hypertrophy", hypertrophyBlockDesc: "Build muscle size with moderate weight and higher volume",
    strengthPeak: "Strength Peak", strengthPeakDesc: "Maximize neural adaptations and 1RM potential",
    powerExplosive: "Power & Explosiveness", powerExplosiveDesc: "Develop rate of force development and athletic power",
    muscularEndurance: "Muscular Endurance", muscularEnduranceDesc: "Improve work capacity and lactate tolerance",
    pushPullLegsSplit: "Push / Pull / Legs", pushPullLegsSplitDesc: "Classic 3-day split",
    upperLowerSplit: "Upper / Lower", upperLowerSplitDesc: "4-day frequency split",
    fullBodySplit2: "Full Body", fullBodySplit2Desc: "3x per week full body",
    broSplit: "Bro Split", broSplitDesc: "5-day muscle group split",

    // Recovery Analytics
    recoveryHrvTitle: "Recovery & HRV", readinessScore: "Readiness Score", level: "Level",
    suggestion: "Suggestion:", yourBioMetrics: "Your Bio-Metrics",
    hrvLabel: "Heart Rate Variability (HRV)", restingHrLabel: "Resting HR (bpm)",
    sleepLabel: "Sleep (hours)", dailyActivityLabel: "Daily Activity (tonnes)",
    autoRecoveryMode: "Auto Recovery Mode", autoRecoveryDesc: "Automatically adjust workouts when readiness is low.",
    hrvTrend: "HRV Trend", hrv: "HRV", restHr: "Rest HR", sleepShort: "Sleep",
    suggestedSession: "Suggested Session", startSuggestedWorkout: "Start suggested workout",
    takeRestDay: "Take a Rest Day", takeRestDayDesc: "Readiness is critically low. Light mobility or complete rest is strongly recommended.",
    recoverySession: "Recovery Session", recoverySessionDesc: "Readiness is diminished. Choose lower-body, sub-maximal work with lighter loads.",
    normalTraining: "Normal Training", normalTrainingDesc: "Readiness is adequate. Follow the planned session, but keep RPE in check.",
    goHard: "Go Hard!", goHardDesc: "Readiness is high. Perfect conditions for a PR attempt or high-intensity session.",
    red: "Red", yellow: "Yellow", green: "Green", peak: "Peak",

    // Voice Coach
    aiVoiceCoach: "AI Voice Coach", liveAi: "LIVE · AI", aiCoachActive: "AI coach active",
    voiceCoachMuted: "Voice coach muted", intentRecognition: "Intent recognition · speak naturally",
    turnOnHandsFree: "Turn on for hands-free training", listeningSayCommand: "Listening... say your command",
    tapToTryAgain: "Tap to try again", tapAndTalk: "Tap and talk to the coach",
    lastCommand: "Last command", quickCommands: "Quick Commands", testVoiceGuidance: "Test voice guidance",
    coachConversation: "Coach Conversation", aiCoach: "AI Coach",
    welcomeVoiceCoach: "Hello! I'm your ForgeUp AI Voice Coach. Tap the mic and I'll listen to your commands.",
    voiceCoachHelp: "You can log weights, time rests, ask for form tips, get motivated, or control your workout.",
    welcomeSpeak: "Welcome to ForgeUp voice coach. Say a command when you're ready.",
    listening: "Listening...", sorryCouldntHear: "Sorry, I couldn't hear that. Please try again.",
    speechUnavailable: "Speech recognition unavailable. Try Chrome or Edge.",
    testVoiceHello: "Hello! I'm your Forge AI voice coach. Let's crush this workout together! Say a command anytime.",

    // Auth
    welcomeBack: "Welcome back", createAccount: "Create your account", resetPassword: "Reset password",
    signInToSync: "Sign in to sync your workouts, PRs, and progress securely.",
    dataEncrypted: "Your data is encrypted and stored safely in the cloud.",
    enterEmailReset: "Enter your email and we'll send you a reset link.",
    continueWithGoogle: "Continue with Google", or: "or", emailAddress: "Email address",
    password: "Password", confirmPassword: "Confirm password", passwordRequirements: "Password requirements",
    chars8: "8+ characters", uppercaseLetter: "Uppercase letter", lowercaseLetter: "Lowercase letter",
    number: "Number", specialCharacter: "Special character", forgotPassword: "Forgot password?",
    signIn: "Sign In", createAccountBtn: "Create Account", sendResetLink: "Send Reset Link",
    dontHaveAccount: "Don't have an account?", alreadyHaveAccount: "Already have an account?",
    rememberedPassword: "Remembered your password?", signUp: "Sign Up", backToSignIn: "Back to Sign In",
    dataProtected: "Your data is protected with industry-standard encryption. Workout history, body weight logs, and personal records sync securely to the cloud.",
    skipForNow: "Skip for now",
    validEmail: "Please enter a valid email address.",
    passwordRequirementsError: "Password must meet all security requirements.",
    passwordsDontMatch: "Passwords do not match.",
    resetEmailSent: "Password reset email sent! Check your inbox.",
    googleNotConfigured: "Google Sign-In is not configured yet. Please add your Firebase config in src/firebase.js",
    authNotConfigured: "Authentication is not configured yet. Please add your Firebase config in src/firebase.js",
    resetNotConfigured: "Password reset is not configured yet. Please add your Firebase config in src/firebase.js",

    // Social Feed
    community: "Community", signInToStart: "Sign in to get started", feed: "Feed",
    shareYourWorkout: "Share your workout", noPostsYet: "No posts yet",
    noPostsDesc: "When real users share workouts, they'll appear here. Configure Firebase in src/firebase.js and complete a workout to be the first!",
    justNow: "Just now", kudos: "kudos", comment: "Comment", noCommentsYet: "No comments yet — be the first!",
    writeComment: "Write a comment...", signInToComment: "Sign in to comment",
    joinChallenges: "Join group challenges and stay accountable with your fitness community.",
    noActiveChallenges: "No active challenges",
    noActiveChallengesDesc: "Challenges created by real users will appear here after Firebase is configured.",
    participants: "participants", dayOf: "Day", of: "of", joined: "Joined", joinChallenge: "Join Challenge",
    weeklyVolumeLeaderboard: "Weekly lifting volume leaderboard. Only real users who opt in appear here — no fake entries.",
    leaderboardEmpty: "Leaderboard empty",
    leaderboardEmptyDesc: "Real users who opt in to the leaderboard from their Profile will show up here.",
    connectivityLoading: "Connectivity is still loading. Try again in a moment.",
    firebaseNeeded: "Community features need Firebase. Configure it in src/firebase.js to see real posts from real users.",
    socialUnavailable: "Social features are unavailable until Firebase is configured with real credentials in src/firebase.js.",
    completedWorkout: "Completed",
    aWorkout: "a workout",
    workoutSummaryCopied: "Workout summary copied to clipboard! Paste it anywhere to share.",
    forgeUpWorkout: "ForgeUp Workout",
    recoveryMobilityFlow: "Recovery Mobility Flow",
    workout: "Workout",
  },

  es: {
    // Navigation
    dashboard: "Inicio", exercises: "Ejercicios", train: "Entrenar", analytics: "Análisis", profile: "Perfil",
    settings: "Ajustes", goals: "Metas semanales", challenges: "Retos", equipment: "Equipo",
    meals: "Opciones de comida", weight: "Peso e IMC", feedback: "Comentarios", rate: "Valóranos", language: "Idioma",
    music: "Música", sound: "Sonido", ready: "¿Listo para moverte?", start: "Iniciar entrenamiento", resume: "Reanudar",
    finish: "Terminar", search: "Buscar ejercicios", noResults: "Sin resultados para", nutrition: "Nutrición y macros",
    leaderboard: "Clasificación", privacy: "Privacidad y datos", wearable: "Sincronización",
    measurements: "Medidas corporales", plan: "Plan de entrenamiento", back: "Atrás", skip: "Omitir por ahora",
    done: "Listo", next: "Siguiente", timer: "Temporizador", instructions: "Instrucciones", demo: "Demo",
    weightLabel: "Peso", bmi: "IMC", height: "Altura", save: "Guardar", on: "Sí", off: "No", more: "Más",
    week: "Semana", month: "Mes", allTime: "Todo", thisWeek: "esta semana", streak: "Racha", keepGoing: "Sigue así",
    personalRecord: "Récord personal", lastSession: "Última sesión", progress: "Progreso",
    platesNeeded: "Discos necesarios", targetWeight: "Peso objetivo", perSide: "Por lado", barWeight: "Peso de barra",
    inProgress: "En progreso", complete: "Completar", setLabel: "SERIE", kg: "KG", reps: "REPS",
    restDone: "¡Descanso terminado!", restDesc: "Tu descanso de 90s terminó — prepárate para la siguiente serie.",
    pushNotif: "Notificaciones", pushNotifDesc: "Recibe una notificación del navegador cuando termine tu descanso.",
    enableNotif: "Activar notificaciones", testNotif: "Enviar notificación de prueba",
    notifDenied: "Notificaciones bloqueadas. Permítelas en la configuración del navegador.",
    activeCalories: "Calorías activas", sleep: "Sueño", heartRate: "Ritmo cardíaco", stepsLabel: "Pasos",
    todayBurned: "kcal hoy", hbpm: "lpm", syncHealth: "Sincronizar salud",
    syncDesc: "Introduce tus datos diarios de salud. En una app nativa esto se conectaría automáticamente a Apple Health / Health Connect.",
    logWorkout: "Registrar", logEntry: "Introduce tus métricas de hoy", stepsGoal: "Objetivo pasos",
    target: "Meta", current: "Actual", history: "Historial", quickAdd: "Añadir rápido", todaysLog: "Registro de hoy",
    nothingLogged: "Nada registrado todavía — añade algo.", muscleActivation: "Activación muscular",
    liftedWeight: "Peso levantado", totalVolume: "Volumen total", sessionsCount: "Sesiones",
    noActive: "Sin sesión activa", startFromDash: "Inicia el entrenamiento desde el Inicio.",
    adjust: "ajustar progreso", markDone: "Marcar hecho", completed: "Completado", protein: "Proteína",
    carbs: "Carbohidratos", fat: "Grasa", kcal: "kcal", waist: "Cintura", chest: "Pecho", arms: "Brazos",
    record: "Registro", measurementsPage: "Medidas corporales",
    measurementsDesc: "Registra peso, cintura, pecho y brazos. En una app real esto se sincroniza con tu cuenta.",
    addMeasurement: "Añadir medida", weightTrend: "Tendencia de peso", cm: "cm", january: "Enero",
    calendar: "Calendario", dayProgress: "Progreso diario", openedApp: "Días que abriste la app",
    howDid: "Completado % por día", dailyStreak: "Racha diaria", workoutsLogged: "Entrenos registrados",
    totalKcalBurned: "Total kcal quemadas", exercisesDone: "Ejercicios hechos", sessionCompleted: "Sesión completada",
    finishedWorkout: "Terminar entrenamiento", add15: "+15s", sub15: "−15s", restTime: "Descanso",
    goodJob: "¡Gran trabajo! Sesión completada.", totalVolumeLabel: "Volumen levantado",

    // Dashboard
    wednesday: "Miércoles", aug12: "12 Ago", suggestedProgression: "Progresión sugerida",
    exercisesCount: "ejercicios", min: "min", weeklyLoad: "Carga semanal", sessionLeft: "sesión restante",
    setHeight: "Establecer altura", underweight: "Bajo peso", healthy: "Saludable", overweight: "Sobrepeso", obese: "Obeso",

    // Onboarding
    tellUsAboutYou: "Cuéntanos sobre ti",
    tellUsSub: "Esto personaliza tu plan. Puedes cambiarlo en Ajustes.",
    mainGoal: "¿Cuál es tu objetivo principal?",
    mainGoalSub: "Adaptaremos tu entrenamiento a este enfoque.",
    pickBodyType: "Elige tu tipo de cuerpo",
    pickBodyTypeSub: "Elige la opción más cercana — ayuda a establecer objetivos realistas.",
    male: "Hombre", female: "Mujer", preferNot: "Prefiero no decirlo",
    slim: "Delgado / Magro", slimDesc: "Complexión ligera, metabolismo rápido",
    athletic: "Atlético / Tonificado", athleticDesc: "Complexión equilibrada y activa",
    muscular: "Musculoso / Robusto", muscularDesc: "Complexión sólida y fuerte",
    curvy: "Curvilíneo / Lleno", curvyDesc: "Forma suave y completa",
    fullBody: "Cuerpo completo", fullBodyDesc: "Fuerza equilibrada en todo",
    muscleGain: "Ganar músculo", muscleGainDesc: "Construye tamaño y fuerza",
    fatLoss: "Pérdida de grasa", fatLossDesc: "Quema grasa, revela forma",
    strength: "Fuerza", strengthDesc: "Levanta más con el tiempo",
    endurance: "Resistencia", enduranceDesc: "Dura más, recupérate más rápido",
    corePosture: "Core y postura", corePostureDesc: "Estabilidad y equilibrio",

    // Exercise library
    all: "Todos", chest: "Pecho", back: "Espalda", legs: "Piernas", glutes: "Glúteos", shoulders: "Hombros", arms: "Brazos", core: "Core",
    plate: "Disco", plateCalculator: "Calculadora de discos", targetMustBeHeavier: "El objetivo debe ser más pesado que la barra.",
    cantReachExactly: "No se puede alcanzar exactamente — lo más cercano es",
    smartSuggestion: "Sugerencia inteligente",
    lastTimeYouDid: "La última vez hiciste",
    tryToBreak: "Prueba",
    toBreakPR: "para batir tu récord.",
    setCompleteToast: "¡Serie completada! Descansa 90s",
    sets: "series", exercisesLower: "ejercicios", plates: "Discos",
    finishWorkoutCount: "Terminar entrenamiento",
    restComplete: "¡Descanso completado!",
    readyNextSet: "Listo para tu próxima serie. ¡A por ello!",
    noActiveSession: "Sin sesión activa",
    startFromDashFull: "Inicia el entrenamiento de hoy desde el Inicio para registrar series.",

    // Analytics
    muscleActivationRange: "Activación muscular",
    recordLabel: "récord", totalVolumeLabel2: "Volumen total",

    // Nutrition
    nutritionMacros: "Nutrición y macros", ofDailyGoal: "de", dailyGoal: "objetivo diario",
    searchFoods: "Buscar 28 alimentos (prueba 'pollo', 'arroz', 'frutos secos')…",
    noFoodsMatch: "Sin alimentos para",
    added: "añadido",

    // Leaderboard
    shareMyStreak: "Compartir mi racha",
    visibleToEveryone: "Visible para todos los que usan esta app, como",
    loadingLeaderboard: "Cargando clasificación…",
    noOneOnBoard: "Nadie en la tabla todavía — sé el primero en participar.",
    you: "tú",

    // Sound settings
    soundNotifications: "Sonido y notificaciones", soundEffects: "Efectos de sonido",
    soundEffectsDesc: "Sonido de serie completada, alerta de descanso, fanfarria de entrenamiento.",
    testSetChime: "Probar sonido", testRestAlert: "Probar alerta", testFanfare: "Probar fanfarria",
    soundNote: "Las notificaciones push en segundo plano necesitan una app nativa — una pestaña del navegador no puede hacer esto, así que no está incluido aquí.",

    // Music settings
    backgroundMusic: "Música de fondo", backgroundMusicDesc: "Tus pistas MP3 + opciones sintetizadas.",
    yourTracks: "Tus pistas",

    // Language settings
    chooseLanguage: "Elige tu idioma preferido. La interfaz se actualizará inmediatamente.",

    // Weight & BMI
    yourBMI: "Tu IMC", weightKg: "Peso (kg)", heightCm: "Altura (cm)",

    // Meal options
    sampleDay: "Día de ejemplo", breakfast: "Desayuno", lunch: "Almuerzo", snack: "Merienda", dinner: "Cena", evening: "Noche",

    // Weekly goals
    goalsHit: "metas logradas", perfectWeek: "¡Semana perfecta — todas las metas cumplidas!",
    almostThere: "¡Casi allí — sigue empujando!", goodProgress: "Buen progreso — sigue así.",
    gettingStarted: "Empezando — cada repetición cuenta.", doneLabel: "Hecho",

    // Challenges
    reward: "Recompensa:",

    // Equipment
    equipmentDesc: "El equipo que tienes determina qué ejercicios recomendamos. Todos los ejercicios de la biblioteca están etiquetados con el equipo que necesitan.",

    // Feedback
    thankYou: "¡Gracias!", feedbackThanks: "Tus comentarios nos ayudan a mejorar ForgeUp.",
    howsExperience: "¿Cómo es tu experiencia hasta ahora? Tus comentarios honestos nos ayudan a construir una mejor app.",
    rateExperience: "Valora tu experiencia", tellUsMore: "Cuéntanos más (opcional)",
    whatDoYouLove: "¿Qué te encanta? ¿Qué podría mejorar?", submitFeedback: "Enviar comentarios",

    // Rate us
    thanksForRating: "¡Gracias por valorar!", ratingMeansWorld: "Tu valoración significa mucho para nosotros.",
    enjoyingForgeUp: "¿Disfrutando ForgeUp?", tapStarToRate: "Toca una estrella para valorar la app.",
    submitRating: "Enviar valoración",

    // Calendar
    dailyStreakLabel: "Racha diaria", workoutsLoggedLabel: "Entrenos registrados", totalKcalBurnedLabel: "Total kcal quemadas",

    // Profile
    communityChallenges: "Comunidad y retos", periodizationBlocks: "Bloques de periodización",
    recoveryHrv: "Recuperación y HRV", voiceCoach: "Entrenador de voz", achievementBadges: "Insignias de logros",
    edit: "editar", account: "Cuenta", signedInAs: "Conectado como", logOut: "Cerrar sesión",
    designedBy: "Diseñado por Dhurgham Alsaadi", hypertrophyBeginner: "Hipertrofia · Principiante",
    intermediate: "Intermedio", firstSteps: "Primeros pasos", firstStepsDesc: "Completa tu primer entrenamiento",
    centurion: "Centurión", centurionDesc: "Registra 100 entrenamientos", heavyLifter: "Levantador pesado",
    heavyLifterDesc: "Alcanza 100kg en cualquier levantamiento", weekWarrior: "Guerrero semanal", weekWarriorDesc: "Racha de 7 días",
    fortnightForge: "Forja quincenal", fortnightForgeDesc: "Racha de 14 días",

    // Info screens
    planInfo: "Ahora mismo todos ven el mismo plan fijo de Empuje/Tirón/Piernas. Un constructor de planes real — elige una división, establece frecuencia semanal, genera el bloque automáticamente — es la siguiente función natural, y reutilizaría la misma lógica de progresión que ya sugiere tu salto de +2.5kg en banca.",
    privacyInfo: "Qué se almacena y dónde: tu perfil, racha, historial de entrenamientos y registro de nutrición se guardan de forma privada, vinculados a tu cuenta, y nunca se muestran a nadie más. Si participas en la clasificación comunitaria, solo tu nombre de usuario y racha actual se vuelven visibles para otros usuarios — nada más.",

    // Splash
    connecting: "Conectando…", connectingAccount: "Conectando a tu cuenta…",
    loadingHistory: "Cargando historial de entrenamiento…", loadingNutrition: "Cargando registro de nutrición…",
    checkingLeaderboard: "Comprobando clasificación…",

    // Training Plan Builder
    trainingPlanBuilder: "Constructor de plan de entrenamiento", designYourProgram: "Diseña tu programa perfecto",
    split: "División", frequency: "Frecuencia", progression: "Progresión", review: "Revisión",
    chooseYourSplit: "Elige tu división", chooseSplitDesc: "Elige la división que se adapte a tus objetivos y horario.",
    howManyDays: "¿Cuántos días por semana?", autoGenerate: "Generaremos automáticamente un programa",
    programForYou: "para ti.", daysPerWeek: "días / semana", yourWeek: "Tu semana",
    trainingStyle: "Estilo de entrenamiento", trainingStyleDesc: "Elige cómo quieres entrenar. Estableceremos series, repeticiones y descanso.",
    sessions: "SESIONES", exercisesUpper: "EJERCICIOS", start: "Iniciar", generatePlan: "Generar plan",
    continue: "Continuar", planSaved: "¡Plan guardado!", saveTrainingPlan: "Guardar plan de entrenamiento",
    pushPullLegs: "Empuje / Tirón / Piernas", pushPullLegsDesc: "La división clásica de culturismo. Entrena cada grupo muscular dos veces por semana con recuperación óptima.",
    upperLower: "Superior / Inferior", upperLowerDesc: "División eficiente de 4 días. Trabaja cada grupo muscular dos veces por semana con sesiones de compuestos.",
    fullBodySplit: "Cuerpo completo", fullBodySplitDesc: "Entrena todo en cada sesión. Perfecto para horarios ocupados y principiantes.",
    bodybuilding: "Culturismo", bodybuildingDesc: "División clásica por grupos musculares. Máximo aislamiento para cada grupo.",
    arnoldSplit: "División Arnold", arnoldSplitDesc: "La legendaria división de 6 días. Pecho/Espalda, Hombros/Brazos, Piernas — repetida dos veces.",
    hypertrophy: "Hipertrofia", hypertrophyDesc: "8-12 repeticiones · 3-4 series · 60-90s descanso",
    strengthProg: "Fuerza", strengthProgDesc: "3-5 repeticiones · 5 series · 3min descanso",
    power: "Potencia", powerDesc: "1-3 repeticiones · 5 series · 3-5min descanso",
    enduranceProg: "Resistencia", enduranceProgDesc: "15-20 repeticiones · 3 series · 45s descanso",
    pushDay: "Día de empuje", pullDay: "Día de tirón", legDay: "Día de piernas",
    upperBody: "Cuerpo superior", lowerBody: "Cuerpo inferior",
    chestTriceps: "Pecho y tríceps", backBiceps: "Espalda y bíceps", legsCore: "Piernas y core",
    shouldersArms: "Hombros y brazos", chestBack: "Pecho y espalda", legsGlutes: "Piernas y glúteos",

    // Periodization
    periodization: "Periodización", trainingBlock: "Bloque de entrenamiento", weeks: "semanas",
    blockDesc: "Bloque", weekOf: "Semana", of: "de", repsLabel: "Reps", intensity: "Intensidad",
    setsLabel: "Series", volume: "Volumen", thisWeeksWorkouts: "Entrenamientos de esta semana",
    fullBlockOverview: "Resumen del bloque completo", startDay: "Iniciar",
    hypertrophyBlock: "Hipertrofia", hypertrophyBlockDesc: "Construye tamaño muscular con peso moderado y mayor volumen",
    strengthPeak: "Pico de fuerza", strengthPeakDesc: "Maximiza adaptaciones neurales y potencial de 1RM",
    powerExplosive: "Potencia y explosividad", powerExplosiveDesc: "Desarrolla velocidad de producción de fuerza y potencia atlética",
    muscularEndurance: "Resistencia muscular", muscularEnduranceDesc: "Mejora capacidad de trabajo y tolerancia al lactato",
    pushPullLegsSplit: "Empuje / Tirón / Piernas", pushPullLegsSplitDesc: "División clásica de 3 días",
    upperLowerSplit: "Superior / Inferior", upperLowerSplitDesc: "División de frecuencia de 4 días",
    fullBodySplit2: "Cuerpo completo", fullBodySplit2Desc: "3x por semana cuerpo completo",
    broSplit: "División Bro", broSplitDesc: "División de 5 días por grupos musculares",

    // Recovery Analytics
    recoveryHrvTitle: "Recuperación y HRV", readinessScore: "Puntuación de preparación", level: "Nivel",
    suggestion: "Sugerencia:", yourBioMetrics: "Tus biométricas",
    hrvLabel: "Variabilidad de frecuencia cardíaca (HRV)", restingHrLabel: "FC en reposo (lpm)",
    sleepLabel: "Sueño (horas)", dailyActivityLabel: "Actividad diaria (toneladas)",
    autoRecoveryMode: "Modo de recuperación automática", autoRecoveryDesc: "Ajusta automáticamente los entrenamientos cuando la preparación es baja.",
    hrvTrend: "Tendencia HRV", hrv: "HRV", restHr: "FC reposo", sleepShort: "Sueño",
    suggestedSession: "Sesión sugerida", startSuggestedWorkout: "Iniciar entrenamiento sugerido",
    takeRestDay: "Tómate un día de descanso", takeRestDayDesc: "La preparación es críticamente baja. Se recomienda movilidad ligera o descanso completo.",
    recoverySession: "Sesión de recuperación", recoverySessionDesc: "La preparación está disminuida. Elige trabajo sub-máximo de cuerpo inferior con cargas ligeras.",
    normalTraining: "Entrenamiento normal", normalTrainingDesc: "La preparación es adecuada. Sigue la sesión planificada, pero mantén el RPE bajo control.",
    goHard: "¡A por todas!", goHardDesc: "La preparación es alta. Condiciones perfectas para intentar un récord o sesión de alta intensidad.",
    red: "Rojo", yellow: "Amarillo", green: "Verde", peak: "Pico",

    // Voice Coach
    aiVoiceCoach: "Entrenador de voz IA", liveAi: "EN VIVO · IA", aiCoachActive: "Entrenador IA activo",
    voiceCoachMuted: "Entrenador de voz silenciado", intentRecognition: "Reconocimiento de intención · habla naturalmente",
    turnOnHandsFree: "Activa para entrenamiento sin manos", listeningSayCommand: "Escuchando... di tu comando",
    tapToTryAgain: "Toca para intentar de nuevo", tapAndTalk: "Toca y habla con el entrenador",
    lastCommand: "Último comando", quickCommands: "Comandos rápidos", testVoiceGuidance: "Probar guía de voz",
    coachConversation: "Conversación del entrenador", aiCoach: "Entrenador IA",
    welcomeVoiceCoach: "¡Hola! Soy tu entrenador de voz IA de ForgeUp. Toca el micrófono y escucharé tus comandos.",
    voiceCoachHelp: "Puedes registrar pesos, temporizar descansos, pedir consejos de forma, motivarte o controlar tu entrenamiento.",
    welcomeSpeak: "Bienvenido al entrenador de voz de ForgeUp. Di un comando cuando estés listo.",
    listening: "Escuchando...", sorryCouldntHear: "Lo siento, no pude oír eso. Inténtalo de nuevo.",
    speechUnavailable: "Reconocimiento de voz no disponible. Prueba Chrome o Edge.",
    testVoiceHello: "¡Hola! Soy tu entrenador de voz de Forge. ¡Vamos a aplastar este entrenamiento juntos! Di un comando cuando quieras.",

    // Auth
    welcomeBack: "Bienvenido de nuevo", createAccount: "Crea tu cuenta", resetPassword: "Restablecer contraseña",
    signInToSync: "Inicia sesión para sincronizar tus entrenamientos, récords y progreso de forma segura.",
    dataEncrypted: "Tus datos están cifrados y almacenados de forma segura en la nube.",
    enterEmailReset: "Introduce tu correo y te enviaremos un enlace de restablecimiento.",
    continueWithGoogle: "Continuar con Google", or: "o", emailAddress: "Dirección de correo",
    password: "Contraseña", confirmPassword: "Confirmar contraseña", passwordRequirements: "Requisitos de contraseña",
    chars8: "8+ caracteres", uppercaseLetter: "Letra mayúscula", lowercaseLetter: "Letra minúscula",
    number: "Número", specialCharacter: "Carácter especial", forgotPassword: "¿Olvidaste tu contraseña?",
    signIn: "Iniciar sesión", createAccountBtn: "Crear cuenta", sendResetLink: "Enviar enlace de restablecimiento",
    dontHaveAccount: "¿No tienes una cuenta?", alreadyHaveAccount: "¿Ya tienes una cuenta?",
    rememberedPassword: "¿Recordaste tu contraseña?", signUp: "Regístrate", backToSignIn: "Volver a iniciar sesión",
    dataProtected: "Tus datos están protegidos con cifrado de nivel industrial. El historial de entrenamientos, registros de peso y récords personales se sincronizan de forma segura en la nube.",
    skipForNow: "Omitir por ahora",
    validEmail: "Por favor, introduce una dirección de correo válida.",
    passwordRequirementsError: "La contraseña debe cumplir todos los requisitos de seguridad.",
    passwordsDontMatch: "Las contraseñas no coinciden.",
    resetEmailSent: "¡Correo de restablecimiento enviado! Revisa tu bandeja de entrada.",
    googleNotConfigured: "Google Sign-In no está configurado todavía. Añade tu configuración de Firebase en src/firebase.js",
    authNotConfigured: "La autenticación no está configurada todavía. Añade tu configuración de Firebase en src/firebase.js",
    resetNotConfigured: "El restablecimiento de contraseña no está configurado todavía. Añade tu configuración de Firebase en src/firebase.js",

    // Social Feed
    community: "Comunidad", signInToStart: "Inicia sesión para empezar", feed: "Feed",
    shareYourWorkout: "Comparte tu entrenamiento", noPostsYet: "Sin publicaciones todavía",
    noPostsDesc: "Cuando usuarios reales compartan entrenamientos, aparecerán aquí. Configura Firebase en src/firebase.js y completa un entrenamiento para ser el primero!",
    justNow: "Ahora mismo", kudos: "felicitaciones", comment: "Comentario", noCommentsYet: "Sin comentarios todavía — ¡sé el primero!",
    writeComment: "Escribe un comentario...", signInToComment: "Inicia sesión para comentar",
    joinChallenges: "Únete a retos grupales y mantente responsable con tu comunidad fitness.",
    noActiveChallenges: "Sin retos activos",
    noActiveChallengesDesc: "Los retos creados por usuarios reales aparecerán aquí después de configurar Firebase.",
    participants: "participantes", dayOf: "Día", of: "de", joined: "Unido", joinChallenge: "Unirse al reto",
    weeklyVolumeLeaderboard: "Clasificación semanal de volumen levantado. Solo aparecen usuarios reales que participan — sin entradas falsas.",
    leaderboardEmpty: "Clasificación vacía",
    leaderboardEmptyDesc: "Los usuarios reales que participan en la clasificación desde su Perfil aparecerán aquí.",
    connectivityLoading: "La conectividad todavía está cargando. Inténtalo de nuevo en un momento.",
    firebaseNeeded: "Las funciones comunitarias necesitan Firebase. Configúralo en src/firebase.js para ver publicaciones reales de usuarios reales.",
    socialUnavailable: "Las funciones sociales no están disponibles hasta que Firebase se configure con credenciales reales en src/firebase.js.",
    completedWorkout: "Completado",
    aWorkout: "un entrenamiento",
    workoutSummaryCopied: "¡Resumen del entrenamiento copiado al portapapeles! Pégalo en cualquier lugar para compartir.",
    forgeUpWorkout: "Entrenamiento ForgeUp",
    recoveryMobilityFlow: "Flujo de movilidad de recuperación",
    workout: "Entrenamiento",
  },

  fr: {
    // Navigation
    dashboard: "Accueil", exercises: "Exercices", train: "Entraîner", analytics: "Analyse", profile: "Profil",
    settings: "Réglages", goals: "Objectifs hebdo", challenges: "Défis", equipment: "Équipement",
    meals: "Options repas", weight: "Poids & IMC", feedback: "Retour", rate: "Notez-nous", language: "Langue",
    music: "Musique", sound: "Son", ready: "Prêt à bouger ?", start: "Commencer", resume: "Reprendre",
    finish: "Terminer", search: "Rechercher", noResults: "Aucun résultat pour", nutrition: "Nutrition & macros",
    leaderboard: "Classement", privacy: "Confidentialité", wearable: "Synchronisation",
    measurements: "Mesures corporelles", plan: "Plan d'entraînement", back: "Retour", skip: "Passer",
    done: "Terminé", next: "Suivant", timer: "Minuteur", instructions: "Instructions", demo: "Démo",
    weightLabel: "Poids", bmi: "IMC", height: "Taille", save: "Enregistrer", on: "Oui", off: "Non", more: "Plus",
    week: "Semaine", month: "Mois", allTime: "Tout", thisWeek: "cette semaine", streak: "Série", keepGoing: "Continuez",
    personalRecord: "Record perso", lastSession: "Dernière séance", progress: "Progrès",
    platesNeeded: "Disques nécessaires", targetWeight: "Poids cible", perSide: "De chaque côté", barWeight: "Poids barre",
    inProgress: "En cours", complete: "Terminer", setLabel: "SÉRIE", kg: "KG", reps: "RÉP",
    restDone: "Repos terminé !", restDesc: "Votre repos de 90s est terminé — préparez la prochaine série.",
    pushNotif: "Notifications", pushNotifDesc: "Recevez une notification du navigateur quand votre repos se termine.",
    enableNotif: "Activer les notifications", testNotif: "Envoyer une notification test",
    notifDenied: "Notifications bloquées. Autorisez-les dans les réglages du navigateur.",
    activeCalories: "Calories actives", sleep: "Sommeil", heartRate: "Fréquence cardiaque", stepsLabel: "Pas",
    todayBurned: "kcal aujourd'hui", hbpm: "bpm", syncHealth: "Synchroniser la santé",
    syncDesc: "Saisissez vos données de santé quotidiennes. Dans une version native, cela se connecterait automatiquement à Apple Health / Health Connect.",
    logWorkout: "Journaliser", logEntry: "Saisissez vos métriques du jour", stepsGoal: "Objectif pas",
    target: "Objectif", current: "Actuel", history: "Historique", quickAdd: "Ajout rapide", todaysLog: "Journal du jour",
    nothingLogged: "Rien de journalisé — ajoutez quelque chose.", muscleActivation: "Activation musculaire",
    liftedWeight: "Poids soulevé", totalVolume: "Volume total", sessionsCount: "Séances",
    noActive: "Aucune séance active", startFromDash: "Démarrez l'entraînement du jour depuis l'Accueil.",
    adjust: "ajuster le progrès", markDone: "Marquer fait", completed: "Terminé", protein: "Protéines",
    carbs: "Glucides", fat: "Lipides", kcal: "kcal", waist: "Tour de taille", chest: "Poitrine", arms: "Bras",
    record: "Mesure", measurementsPage: "Mesures corporelles",
    measurementsDesc: "Suivez poids, taille, poitrine et bras. En version réelle, cela se synchronise avec votre compte.",
    addMeasurement: "Ajouter une mesure", weightTrend: "Tendance du poids", cm: "cm", january: "Janvier",
    calendar: "Calendrier", dayProgress: "Progrès quotidien", openedApp: "Jours d'ouverture",
    howDid: "% complété par jour", dailyStreak: "Série quotidienne", workoutsLogged: "Séances journalisées",
    totalKcalBurned: "Total kcal brûlées", exercisesDone: "Exercices faits", sessionCompleted: "Séance terminée",
    finishedWorkout: "Terminer la séance", add15: "+15s", sub15: "−15s", restTime: "Repos",
    goodJob: "Beau travail ! Séance terminée.", totalVolumeLabel: "Volume soulevé",

    // Dashboard
    wednesday: "Mercredi", aug12: "12 Août", suggestedProgression: "Progression suggérée",
    exercisesCount: "exercices", min: "min", weeklyLoad: "Charge hebdo", sessionLeft: "séance restante",
    setHeight: "Définir taille", underweight: "Insuffisance", healthy: "Sain", overweight: "Surpoids", obese: "Obèse",

    // Onboarding
    tellUsAboutYou: "Parlez-nous de vous",
    tellUsSub: "Cela personnalise votre plan. Vous pouvez le modifier dans Réglages.",
    mainGoal: "Quel est votre objectif principal ?",
    mainGoalSub: "Nous adapterons votre entraînement à cet objectif.",
    pickBodyType: "Choisissez votre morphologie",
    pickBodyTypeSub: "Choisissez la correspondance la plus proche — cela aide à fixer des objectifs réalistes.",
    male: "Homme", female: "Femme", preferNot: "Préfère ne pas dire",
    slim: "Mince / Sec", slimDesc: "Cadre léger, métabolisme rapide",
    athletic: "Athlétique / Tonique", athleticDesc: "Carrure équilibrée et active",
    muscular: "Musclé / Massif", muscularDesc: "Carrure solide et forte",
    curvy: "Courbes / Plein", curvyDesc: "Forme douce et pleine",
    fullBody: "Corps complet", fullBodyDesc: "Force équilibrée partout",
    muscleGain: "Prise de muscle", muscleGainDesc: "Construire du volume et de la force",
    fatLoss: "Perte de graisse", fatLossDesc: "Brûler la graisse, révéler la forme",
    strength: "Force", strengthDesc: "Soulever plus lourd avec le temps",
    endurance: "Endurance", enduranceDesc: "Durer plus longtemps, récupérer plus vite",
    corePosture: "Gainage & posture", corePostureDesc: "Stabilité et équilibre",

    // Exercise library
    all: "Tous", chest: "Pectoraux", back: "Dos", legs: "Jambes", glutes: "Fessiers", shoulders: "Épaules", arms: "Bras", core: "Gainage",
    plate: "Disque", plateCalculator: "Calculateur de disques", targetMustBeHeavier: "L'objectif doit être plus lourd que la barre.",
    cantReachExactly: "Impossible d'atteindre exactement — le plus proche est",
    smartSuggestion: "Suggestion intelligente",
    lastTimeYouDid: "La dernière fois vous avez fait",
    tryToBreak: "Essayez",
    toBreakPR: "pour battre votre record.",
    setCompleteToast: "Série terminée ! Repos 90s",
    sets: "séries", exercisesLower: "exercices", plates: "Disques",
    finishWorkoutCount: "Terminer la séance",
    restComplete: "Repos terminé !",
    readyNextSet: "Prêt pour votre prochaine série. Allez-y !",
    noActiveSession: "Aucune séance active",
    startFromDashFull: "Démarrez l'entraînement du jour depuis l'Accueil pour journaliser les séries.",

    // Analytics
    muscleActivationRange: "Activation musculaire",
    recordLabel: "record", totalVolumeLabel2: "Volume total",

    // Nutrition
    nutritionMacros: "Nutrition & macros", ofDailyGoal: "de", dailyGoal: "objectif quotidien",
    searchFoods: "Rechercher 28 aliments (essayez 'poulet', 'riz', 'noix')…",
    noFoodsMatch: "Aucun aliment pour",
    added: "ajouté",

    // Leaderboard
    shareMyStreak: "Partager ma série",
    visibleToEveryone: "Visible pour tous les utilisateurs de cette app, sous",
    loadingLeaderboard: "Chargement du classement…",
    noOneOnBoard: "Personne sur le tableau — soyez le premier à participer.",
    you: "vous",

    // Sound settings
    soundNotifications: "Son & notifications", soundEffects: "Effets sonores",
    soundEffectsDesc: "Carillon de série terminée, alerte de repos, fanfare d'entraînement.",
    testSetChime: "Tester carillon", testRestAlert: "Tester alerte", testFanfare: "Tester fanfare",
    soundNote: "Les notifications push en arrière-plan nécessitent une application native — un onglet de navigateur ne peut pas le faire, donc ce n'est pas inclus ici.",

    // Music settings
    backgroundMusic: "Musique de fond", backgroundMusicDesc: "Vos pistes MP3 + options synthétisées.",
    yourTracks: "Vos pistes",

    // Language settings
    chooseLanguage: "Choisissez votre langue préférée. L'interface se mettra à jour immédiatement.",

    // Weight & BMI
    yourBMI: "Votre IMC", weightKg: "Poids (kg)", heightCm: "Taille (cm)",

    // Meal options
    sampleDay: "Journée type", breakfast: "Petit-déjeuner", lunch: "Déjeuner", snack: "Collation", dinner: "Dîner", evening: "Soir",

    // Weekly goals
    goalsHit: "objectifs atteints", perfectWeek: "Semaine parfaite — tous les objectifs atteints !",
    almostThere: "Presque là — continuez !", goodProgress: "Bon progrès — continuez.",
    gettingStarted: "Démarrage — chaque répétition compte.", doneLabel: "Fait",

    // Challenges
    reward: "Récompense :",

    // Equipment
    equipmentDesc: "L'équipement que vous avez détermine les exercices recommandés. Tous les exercices de la bibliothèque sont étiquetés avec le matériel nécessaire.",

    // Feedback
    thankYou: "Merci !", feedbackThanks: "Vos retours nous aident à améliorer ForgeUp.",
    howsExperience: "Comment se passe votre expérience ? Vos retours honnêtes nous aident à construire une meilleure app.",
    rateExperience: "Notez votre expérience", tellUsMore: "Dites-nous en plus (optionnel)",
    whatDoYouLove: "Qu'aimez-vous ? Qu'est-ce qui pourrait être mieux ?", submitFeedback: "Envoyer le retour",

    // Rate us
    thanksForRating: "Merci pour votre note !", ratingMeansWorld: "Votre note compte énormément pour nous.",
    enjoyingForgeUp: "Vous appréciez ForgeUp ?", tapStarToRate: "Touchez une étoile pour noter l'app.",
    submitRating: "Envoyer la note",

    // Calendar
    dailyStreakLabel: "Série quotidienne", workoutsLoggedLabel: "Séances journalisées", totalKcalBurnedLabel: "Total kcal brûlées",

    // Profile
    communityChallenges: "Communauté & défis", periodizationBlocks: "Blocs de périodisation",
    recoveryHrv: "Récupération & HRV", voiceCoach: "Coach vocal", achievementBadges: "Badges de réussite",
    edit: "modifier", account: "Compte", signedInAs: "Connecté en tant que", logOut: "Se déconnecter",
    designedBy: "Conçu par Dhurgham Alsaadi", hypertrophyBeginner: "Hypertrophie · Débutant",
    intermediate: "Intermédiaire", firstSteps: "Premiers pas", firstStepsDesc: "Terminez votre premier entraînement",
    centurion: "Centurion", centurionDesc: "Journalisez 100 séances", heavyLifter: "Gros souleveur",
    heavyLifterDesc: "Atteignez 100kg sur n'importe quel mouvement", weekWarrior: "Guerrier de la semaine", weekWarriorDesc: "Série de 7 jours",
    fortnightForge: "Forge de quinzaine", fortnightForgeDesc: "Série de 14 jours",

    // Info screens
    planInfo: "Actuellement tout le monde voit le même plan fixe Poussée/Tirage/Jambes. Un vrai constructeur de plan — choisir un split, définir la fréquence hebdomadaire, générer automatiquement le bloc — est la prochaine fonctionnalité naturelle, et il réutiliserait la même logique de progression qui suggère déjà votre saut de +2,5kg au développé couché.",
    privacyInfo: "Ce qui est stocké et où : votre profil, série, historique d'entraînement et journal nutritionnel sont enregistrés en privé, liés à votre compte, et jamais montrés à personne d'autre. Si vous optez pour le classement communautaire, seuls votre nom d'affichage et votre série actuelle deviennent visibles pour les autres utilisateurs — rien d'autre.",

    // Splash
    connecting: "Connexion…", connectingAccount: "Connexion à votre compte…",
    loadingHistory: "Chargement de l'historique…", loadingNutrition: "Chargement du journal nutritionnel…",
    checkingLeaderboard: "Vérification du classement…",

    // Training Plan Builder
    trainingPlanBuilder: "Constructeur de plan d'entraînement", designYourProgram: "Concevez votre programme parfait",
    split: "Split", frequency: "Fréquence", progression: "Progression", review: "Révision",
    chooseYourSplit: "Choisissez votre split", chooseSplitDesc: "Choisissez le split qui correspond à vos objectifs et à votre emploi du temps.",
    howManyDays: "Combien de jours par semaine ?", autoGenerate: "Nous générerons automatiquement un programme",
    programForYou: "pour vous.", daysPerWeek: "jours / semaine", yourWeek: "Votre semaine",
    trainingStyle: "Style d'entraînement", trainingStyleDesc: "Choisissez comment vous voulez vous entraîner. Nous définirons les séries, répétitions et repos.",
    sessions: "SÉANCES", exercisesUpper: "EXERCICES", start: "Commencer", generatePlan: "Générer le plan",
    continue: "Continuer", planSaved: "Plan enregistré !", saveTrainingPlan: "Enregistrer le plan d'entraînement",
    pushPullLegs: "Poussée / Tirage / Jambes", pushPullLegsDesc: "Le split classique de bodybuilding. Entraînez chaque groupe musculaire deux fois par semaine avec une récupération optimale.",
    upperLower: "Haut / Bas", upperLowerDesc: "Split efficace de 4 jours. Touchez chaque groupe musculaire deux fois par semaine avec des séances axées sur les mouvements composés.",
    fullBodySplit: "Corps complet", fullBodySplitDesc: "Entraînez tout à chaque séance. Parfait pour les emplois du temps chargés et les débutants.",
    bodybuilding: "Bodybuilding", bodybuildingDesc: "Split classique par groupes musculaires. Isolation maximale pour chaque groupe.",
    arnoldSplit: "Split Arnold", arnoldSplitDesc: "Le légendaire split de 6 jours. Pectoraux/Dos, Épaules/Bras, Jambes — répété deux fois.",
    hypertrophy: "Hypertrophie", hypertrophyDesc: "8-12 répétitions · 3-4 séries · 60-90s repos",
    strengthProg: "Force", strengthProgDesc: "3-5 répétitions · 5 séries · 3min repos",
    power: "Puissance", powerDesc: "1-3 répétitions · 5 séries · 3-5min repos",
    enduranceProg: "Endurance", enduranceProgDesc: "15-20 répétitions · 3 séries · 45s repos",
    pushDay: "Jour poussée", pullDay: "Jour tirage", legDay: "Jour jambes",
    upperBody: "Haut du corps", lowerBody: "Bas du corps",
    chestTriceps: "Pectoraux & triceps", backBiceps: "Dos & biceps", legsCore: "Jambes & gainage",
    shouldersArms: "Épaules & bras", chestBack: "Pectoraux & dos", legsGlutes: "Jambes & fessiers",

    // Periodization
    periodization: "Périodisation", trainingBlock: "Bloc d'entraînement", weeks: "semaines",
    blockDesc: "Bloc", weekOf: "Semaine", of: "sur", repsLabel: "Rép", intensity: "Intensité",
    setsLabel: "Séries", volume: "Volume", thisWeeksWorkouts: "Séances de cette semaine",
    fullBlockOverview: "Aperçu du bloc complet", startDay: "Commencer",
    hypertrophyBlock: "Hypertrophie", hypertrophyBlockDesc: "Construire du volume musculaire avec un poids modéré et un volume plus élevé",
    strengthPeak: "Pic de force", strengthPeakDesc: "Maximiser les adaptations neurales et le potentiel 1RM",
    powerExplosive: "Puissance & explosivité", powerExplosiveDesc: "Développer la vitesse de production de force et la puissance athlétique",
    muscularEndurance: "Endurance musculaire", muscularEnduranceDesc: "Améliorer la capacité de travail et la tolérance au lactate",
    pushPullLegsSplit: "Poussée / Tirage / Jambes", pushPullLegsSplitDesc: "Split classique de 3 jours",
    upperLowerSplit: "Haut / Bas", upperLowerSplitDesc: "Split de fréquence de 4 jours",
    fullBodySplit2: "Corps complet", fullBodySplit2Desc: "3x par semaine corps complet",
    broSplit: "Split Bro", broSplitDesc: "Split de 5 jours par groupes musculaires",

    // Recovery Analytics
    recoveryHrvTitle: "Récupération & HRV", readinessScore: "Score de préparation", level: "Niveau",
    suggestion: "Suggestion :", yourBioMetrics: "Vos biométriques",
    hrvLabel: "Variabilité de la fréquence cardiaque (HRV)", restingHrLabel: "FC au repos (bpm)",
    sleepLabel: "Sommeil (heures)", dailyActivityLabel: "Activité quotidienne (tonnes)",
    autoRecoveryMode: "Mode récupération auto", autoRecoveryDesc: "Ajuste automatiquement les séances quand la préparation est faible.",
    hrvTrend: "Tendance HRV", hrv: "HRV", restHr: "FC repos", sleepShort: "Sommeil",
    suggestedSession: "Séance suggérée", startSuggestedWorkout: "Commencer la séance suggérée",
    takeRestDay: "Prenez un jour de repos", takeRestDayDesc: "La préparation est critique. Mobilité légère ou repos complet fortement recommandé.",
    recoverySession: "Séance de récupération", recoverySessionDesc: "La préparation est diminuée. Choisissez un travail sub-maximal du bas du corps avec des charges légères.",
    normalTraining: "Entraînement normal", normalTrainingDesc: "La préparation est adéquate. Suivez la séance prévue, mais gardez le RPE sous contrôle.",
    goHard: "À fond !", goHardDesc: "La préparation est élevée. Conditions parfaites pour tenter un record ou une séance de haute intensité.",
    red: "Rouge", yellow: "Jaune", green: "Vert", peak: "Pic",

    // Voice Coach
    aiVoiceCoach: "Coach vocal IA", liveAi: "EN DIRECT · IA", aiCoachActive: "Coach IA actif",
    voiceCoachMuted: "Coach vocal muet", intentRecognition: "Reconnaissance d'intention · parlez naturellement",
    turnOnHandsFree: "Activez pour l'entraînement mains libres", listeningSayCommand: "Écoute... dites votre commande",
    tapToTryAgain: "Touchez pour réessayer", tapAndTalk: "Touchez et parlez au coach",
    lastCommand: "Dernière commande", quickCommands: "Commandes rapides", testVoiceGuidance: "Tester le guidage vocal",
    coachConversation: "Conversation du coach", aiCoach: "Coach IA",
    welcomeVoiceCoach: "Bonjour ! Je suis votre coach vocal IA ForgeUp. Touchez le micro et j'écouterai vos commandes.",
    voiceCoachHelp: "Vous pouvez journaliser des poids, chronométrer les repos, demander des conseils de forme, vous motiver ou contrôler votre séance.",
    welcomeSpeak: "Bienvenue au coach vocal ForgeUp. Dites une commande quand vous êtes prêt.",
    listening: "Écoute...", sorryCouldntHear: "Désolé, je n'ai pas pu entendre. Veuillez réessayer.",
    speechUnavailable: "Reconnaissance vocale indisponible. Essayez Chrome ou Edge.",
    testVoiceHello: "Bonjour ! Je suis votre coach vocal Forge. Écrasons cette séance ensemble ! Dites une commande à tout moment.",

    // Auth
    welcomeBack: "Bon retour", createAccount: "Créez votre compte", resetPassword: "Réinitialiser le mot de passe",
    signInToSync: "Connectez-vous pour synchroniser vos séances, records et progrès en toute sécurité.",
    dataEncrypted: "Vos données sont chiffrées et stockées en toute sécurité dans le cloud.",
    enterEmailReset: "Entrez votre email et nous vous enverrons un lien de réinitialisation.",
    continueWithGoogle: "Continuer avec Google", or: "ou", emailAddress: "Adresse email",
    password: "Mot de passe", confirmPassword: "Confirmer le mot de passe", passwordRequirements: "Exigences du mot de passe",
    chars8: "8+ caractères", uppercaseLetter: "Lettre majuscule", lowercaseLetter: "Lettre minuscule",
    number: "Chiffre", specialCharacter: "Caractère spécial", forgotPassword: "Mot de passe oublié ?",
    signIn: "Se connecter", createAccountBtn: "Créer un compte", sendResetLink: "Envoyer le lien de réinitialisation",
    dontHaveAccount: "Pas de compte ?", alreadyHaveAccount: "Déjà un compte ?",
    rememberedPassword: "Vous avez retrouvé votre mot de passe ?", signUp: "S'inscrire", backToSignIn: "Retour à la connexion",
    dataProtected: "Vos données sont protégées par un chiffrement de niveau industriel. L'historique d'entraînement, les journaux de poids et les records personnels se synchronisent en toute sécurité dans le cloud.",
    skipForNow: "Passer pour l'instant",
    validEmail: "Veuillez saisir une adresse email valide.",
    passwordRequirementsError: "Le mot de passe doit répondre à toutes les exigences de sécurité.",
    passwordsDontMatch: "Les mots de passe ne correspondent pas.",
    resetEmailSent: "Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.",
    googleNotConfigured: "Google Sign-In n'est pas configuré. Ajoutez votre configuration Firebase dans src/firebase.js",
    authNotConfigured: "L'authentification n'est pas configurée. Ajoutez votre configuration Firebase dans src/firebase.js",
    resetNotConfigured: "La réinitialisation du mot de passe n'est pas configurée. Ajoutez votre configuration Firebase dans src/firebase.js",

    // Social Feed
    community: "Communauté", signInToStart: "Connectez-vous pour commencer", feed: "Fil",
    shareYourWorkout: "Partagez votre séance", noPostsYet: "Aucune publication",
    noPostsDesc: "Quand de vrais utilisateurs partageront des séances, elles apparaîtront ici. Configurez Firebase dans src/firebase.js et terminez une séance pour être le premier !",
    justNow: "À l'instant", kudos: "félicitations", comment: "Commentaire", noCommentsYet: "Aucun commentaire — soyez le premier !",
    writeComment: "Écrire un commentaire...", signInToComment: "Connectez-vous pour commenter",
    joinChallenges: "Rejoignez des défis de groupe et restez responsable avec votre communauté fitness.",
    noActiveChallenges: "Aucun défi actif",
    noActiveChallengesDesc: "Les défis créés par de vrais utilisateurs apparaîtront ici après la configuration de Firebase.",
    participants: "participants", dayOf: "Jour", of: "sur", joined: "Rejoint", joinChallenge: "Rejoindre le défi",
    weeklyVolumeLeaderboard: "Classement hebdomadaire du volume soulevé. Seuls les vrais utilisateurs qui participent apparaissent — aucune entrée fictive.",
    leaderboardEmpty: "Classement vide",
    leaderboardEmptyDesc: "Les vrais utilisateurs qui participent au classement depuis leur Profil apparaîtront ici.",
    connectivityLoading: "La connectivité charge encore. Réessayez dans un instant.",
    firebaseNeeded: "Les fonctionnalités communautaires nécessitent Firebase. Configurez-le dans src/firebase.js pour voir de vraies publications de vrais utilisateurs.",
    socialUnavailable: "Les fonctionnalités sociales sont indisponibles jusqu'à ce que Firebase soit configuré avec de vraies identifiants dans src/firebase.js.",
    completedWorkout: "Terminé",
    aWorkout: "une séance",
    workoutSummaryCopied: "Résumé de la séance copié dans le presse-papiers ! Collez-le n'importe où pour partager.",
    forgeUpWorkout: "Séance ForgeUp",
    recoveryMobilityFlow: "Flux de mobilité de récupération",
    workout: "Séance",
  },

  de: {
    // Navigation
    dashboard: "Start", exercises: "Übungen", train: "Trainieren", analytics: "Analyse", profile: "Profil",
    settings: "Einstellungen", goals: "Wochenziele", challenges: "Herausforderungen", equipment: "Ausrüstung",
    meals: "Mahlzeiten", weight: "Gewicht & BMI", feedback: "Feedback", rate: "Bewerten", language: "Sprache",
    music: "Musik", sound: "Ton", ready: "Bereit zu trainieren?", start: "Training starten", resume: "Fortsetzen",
    finish: "Beenden", search: "Übungen suchen", noResults: "Keine Treffer für", nutrition: "Ernährung & Makros",
    leaderboard: "Rangliste", privacy: "Datenschutz", wearable: "Synchronisation",
    measurements: "Körpermaße", plan: "Trainingsplan", back: "Zurück", skip: "Überspringen",
    done: "Fertig", next: "Weiter", timer: "Timer", instructions: "Anleitung", demo: "Demo",
    weightLabel: "Gewicht", bmi: "BMI", height: "Größe", save: "Speichern", on: "An", off: "Aus", more: "Mehr",
    week: "Woche", month: "Monat", allTime: "Gesamt", thisWeek: "diese Woche", streak: "Serie", keepGoing: "Weiter so",
    personalRecord: "Persönlicher Rekord", lastSession: "Letzte Sitzung", progress: "Fortschritt",
    platesNeeded: "Benötigte Scheiben", targetWeight: "Zielgewicht", perSide: "Pro Seite", barWeight: "Stangengewicht",
    inProgress: "In Arbeit", complete: "Abschließen", setLabel: "SATZ", kg: "KG", reps: "WDH",
    restDone: "Pause vorbei!", restDesc: "Deine 90s-Pause ist vorbei — bereit für den nächsten Satz.",
    pushNotif: "Push-Benachrichtigungen", pushNotifDesc: "Erhalte eine Browser-Benachrichtigung, wenn deine Pause endet.",
    enableNotif: "Benachrichtigungen aktivieren", testNotif: "Test-Benachrichtigung senden",
    notifDenied: "Benachrichtigungen blockiert. Erlaube sie in den Browser-Einstellungen.",
    activeCalories: "Aktive Kalorien", sleep: "Schlaf", heartRate: "Herzfrequenz", stepsLabel: "Schritte",
    todayBurned: "kcal heute", hbpm: "bpm", syncHealth: "Gesundheit synchronisieren",
    syncDesc: "Gib deine täglichen Gesundheitsdaten ein. In einer nativen App würde dies automatisch mit Apple Health / Health Connect verbunden.",
    logWorkout: "Protokoll", logEntry: "Gib deine heutigen Werte ein", stepsGoal: "Schrittziel",
    target: "Ziel", current: "Aktuell", history: "Verlauf", quickAdd: "Schnell hinzufügen", todaysLog: "Heutiges Protokoll",
    nothingLogged: "Noch nichts erfasst — füge etwas hinzu.", muscleActivation: "Muskelaktivierung",
    liftedWeight: "Gehobenes Gewicht", totalVolume: "Gesamtvolumen", sessionsCount: "Sitzungen",
    noActive: "Keine aktive Sitzung", startFromDash: "Starte das heutige Training vom Start-Bildschirm.",
    adjust: "Fortschritt anpassen", markDone: "Als erledigt markieren", completed: "Erledigt", protein: "Protein",
    carbs: "Kohlenhydrate", fat: "Fett", kcal: "kcal", waist: "Taille", chest: "Brust", arms: "Arme",
    record: "Messung", measurementsPage: "Körpermaße",
    measurementsDesc: "Verfolge Gewicht, Taille, Brust und Arme. In einer echten App wird dies mit deinem Konto synchronisiert.",
    addMeasurement: "Messung hinzufügen", weightTrend: "Gewichtstrend", cm: "cm", january: "Januar",
    calendar: "Kalender", dayProgress: "Täglicher Fortschritt", openedApp: "Tage mit App-Nutzung",
    howDid: "Abschluss % pro Tag", dailyStreak: "Tägliche Serie", workoutsLogged: "Trainings protokolliert",
    totalKcalBurned: "Gesamt kcal verbrannt", exercisesDone: "Übungen erledigt", sessionCompleted: "Sitzung abgeschlossen",
    finishedWorkout: "Training beenden", add15: "+15s", sub15: "−15s", restTime: "Pause",
    goodJob: "Gut gemacht! Sitzung abgeschlossen.", totalVolumeLabel: "Gehobenes Volumen",

    // Dashboard
    wednesday: "Mittwoch", aug12: "12. Aug", suggestedProgression: "Vorgeschlagene Progression",
    exercisesCount: "Übungen", min: "min", weeklyLoad: "Wochenbelastung", sessionLeft: "Sitzung übrig",
    setHeight: "Größe festlegen", underweight: "Untergewicht", healthy: "Gesund", overweight: "Übergewicht", obese: "Fettleibig",

    // Onboarding
    tellUsAboutYou: "Erzähl uns von dir",
    tellUsSub: "Das personalisiert deinen Plan. Du kannst es jederzeit in den Einstellungen ändern.",
    mainGoal: "Was ist dein Hauptziel?",
    mainGoalSub: "Wir gestalten dein Training um diesen Fokus.",
    pickBodyType: "Wähle deinen Körpertyp",
    pickBodyTypeSub: "Wähle die nächste Übereinstimmung — das hilft, realistische Ziele zu setzen.",
    male: "Männlich", female: "Weiblich", preferNot: "Keine Angabe",
    slim: "Schlank / Mager", slimDesc: "Leichter Rahmen, schneller Stoffwechsel",
    athletic: "Athletisch / Straff", athleticDesc: "Ausgewogener, aktiver Körperbau",
    muscular: "Muskulös / Kräftig", muscularDesc: "Solider, starker Rahmen",
    curvy: "Kurvig / Voll", curvyDesc: "Weiche, vollere Form",
    fullBody: "Ganzkörper", fullBodyDesc: "Ausgewogene Kraft überall",
    muscleGain: "Muskelaufbau", muscleGainDesc: "Größe & Kraft aufbauen",
    fatLoss: "Fettabbau", fatLossDesc: "Fett verbrennen, Form zeigen",
    strength: "Kraft", strengthDesc: "Mit der Zeit schwerer heben",
    endurance: "Ausdauer", enduranceDesc: "Länger durchhalten, schneller erholen",
    corePosture: "Core & Haltung", corePostureDesc: "Stabilität & Gleichgewicht",

    // Exercise library
    all: "Alle", chest: "Brust", back: "Rücken", legs: "Beine", glutes: "Gesäß", shoulders: "Schultern", arms: "Arme", core: "Core",
    plate: "Scheibe", plateCalculator: "Scheibenrechner", targetMustBeHeavier: "Das Ziel muss schwerer als die Stange sein.",
    cantReachExactly: "Kann nicht genau erreicht werden — am nächsten ist",
    smartSuggestion: "Intelligenter Vorschlag",
    lastTimeYouDid: "Letztes Mal hast du",
    tryToBreak: "Versuche",
    toBreakPR: "um deinen Rekord zu brechen.",
    setCompleteToast: "Satz abgeschlossen! Pause 90s",
    sets: "Sätze", exercisesLower: "Übungen", plates: "Scheiben",
    finishWorkoutCount: "Training beenden",
    restComplete: "Pause vorbei!",
    readyNextSet: "Bereit für deinen nächsten Satz. Los geht's!",
    noActiveSession: "Keine aktive Sitzung",
    startFromDashFull: "Starte das heutige Training vom Start-Bildschirm, um Sätze zu protokollieren.",

    // Analytics
    muscleActivationRange: "Muskelaktivierung",
    recordLabel: "Rekord", totalVolumeLabel2: "Gesamtvolumen",

    // Nutrition
    nutritionMacros: "Ernährung & Makros", ofDailyGoal: "von", dailyGoal: "Tagesziel",
    searchFoods: "28 Lebensmittel suchen (versuche 'Hähnchen', 'Reis', 'Nüsse')…",
    noFoodsMatch: "Keine Lebensmittel für",
    added: "hinzugefügt",

    // Leaderboard
    shareMyStreak: "Meine Serie teilen",
    visibleToEveryone: "Sichtbar für alle Benutzer dieser App, unter",
    loadingLeaderboard: "Rangliste wird geladen…",
    noOneOnBoard: "Niemand auf der Tafel — sei der Erste, der teilnimmt.",
    you: "du",

    // Sound settings
    soundNotifications: "Ton & Benachrichtigungen", soundEffects: "Soundeffekte",
    soundEffectsDesc: "Satz-abgeschlossen-Klang, Pausen-Timer-Alarm, Trainingsfanfare.",
    testSetChime: "Klang testen", testRestAlert: "Alarm testen", testFanfare: "Fanfare testen",
    soundNote: "Hintergrund-Push-Benachrichtigungen benötigen einen nativen Build — ein Browser-Tab kann das nicht, daher ist es hier nicht enthalten.",

    // Music settings
    backgroundMusic: "Hintergrundmusik", backgroundMusicDesc: "Deine MP3-Tracks + synthetisierte Optionen.",
    yourTracks: "Deine Tracks",

    // Language settings
    chooseLanguage: "Wähle deine bevorzugte Sprache. Die Oberfläche wird sofort aktualisiert.",

    // Weight & BMI
    yourBMI: "Dein BMI", weightKg: "Gewicht (kg)", heightCm: "Größe (cm)",

    // Meal options
    sampleDay: "Beispieltag", breakfast: "Frühstück", lunch: "Mittagessen", snack: "Snack", dinner: "Abendessen", evening: "Abend",

    // Weekly goals
    goalsHit: "Ziele erreicht", perfectWeek: "Perfekte Woche — alle Ziele erreicht!",
    almostThere: "Fast geschafft — weiter so!", goodProgress: "Guter Fortschritt — weiter so.",
    gettingStarted: "Erste Schritte — jede Wiederholung zählt.", doneLabel: "Erledigt",

    // Challenges
    reward: "Belohnung:",

    // Equipment
    equipmentDesc: "Die Ausrüstung, die du hast, bestimmt, welche Übungen wir empfehlen. Alle Übungen in der Bibliothek sind mit der benötigten Ausrüstung gekennzeichnet.",

    // Feedback
    thankYou: "Danke!", feedbackThanks: "Dein Feedback hilft uns, ForgeUp zu verbessern.",
    howsExperience: "Wie ist deine Erfahrung bisher? Dein ehrliches Feedback hilft uns, eine bessere App zu bauen.",
    rateExperience: "Bewerte deine Erfahrung", tellUsMore: "Erzähl uns mehr (optional)",
    whatDoYouLove: "Was liebst du? Was könnte besser sein?", submitFeedback: "Feedback senden",

    // Rate us
    thanksForRating: "Danke für deine Bewertung!", ratingMeansWorld: "Deine Bewertung bedeutet uns sehr viel.",
    enjoyingForgeUp: "Gefällt dir ForgeUp?", tapStarToRate: "Tippe auf einen Stern, um die App zu bewerten.",
    submitRating: "Bewertung senden",

    // Calendar
    dailyStreakLabel: "Tägliche Serie", workoutsLoggedLabel: "Trainings protokolliert", totalKcalBurnedLabel: "Gesamt kcal verbrannt",

    // Profile
    communityChallenges: "Community & Herausforderungen", periodizationBlocks: "Periodisierungsblöcke",
    recoveryHrv: "Erholung & HRV", voiceCoach: "Sprachcoach", achievementBadges: "Erfolgsabzeichen",
    edit: "bearbeiten", account: "Konto", signedInAs: "Angemeldet als", logOut: "Abmelden",
    designedBy: "Entworfen von Dhurgham Alsaadi", hypertrophyBeginner: "Hypertrophie · Anfänger",
    intermediate: "Fortgeschritten", firstSteps: "Erste Schritte", firstStepsDesc: "Schließe dein erstes Training ab",
    centurion: "Zenturio", centurionDesc: "Protokolliere 100 Trainings", heavyLifter: "Schwerheber",
    heavyLifterDesc: "Erreiche 100kg bei einer Übung", weekWarrior: "Wochenkrieger", weekWarriorDesc: "7-Tage-Serie",
    fortnightForge: "Zwei-Wochen-Schmiede", fortnightForgeDesc: "14-Tage-Serie",

    // Info screens
    planInfo: "Momentan sieht jeder denselben festen Push/Pull/Legs-Plan. Ein echter Trainingsplan-Builder — Split wählen, wöchentliche Frequenz festlegen, Block automatisch generieren — ist die natürliche nächste Funktion und würde dieselbe regelbasierte Progressionslogik wiederverwenden, die bereits deinen +2,5kg-Bankdrück-Sprung vorschlägt.",
    privacyInfo: "Was gespeichert wird und wo: dein Profil, Serie, Trainingsverlauf und Ernährungsprotokoll werden privat gespeichert, mit deinem Konto verknüpft und nie jemand anderem gezeigt. Wenn du dich für die Community-Rangliste entscheidest, werden nur dein gewählter Anzeigename und deine aktuelle Serie für andere Benutzer sichtbar — sonst nichts.",

    // Splash
    connecting: "Verbinden…", connectingAccount: "Verbinde mit deinem Konto…",
    loadingHistory: "Lade Trainingsverlauf…", loadingNutrition: "Lade Ernährungsprotokoll…",
    checkingLeaderboard: "Prüfe Rangliste…",

    // Training Plan Builder
    trainingPlanBuilder: "Trainingsplan-Builder", designYourProgram: "Gestalte dein perfektes Programm",
    split: "Split", frequency: "Frequenz", progression: "Progression", review: "Überprüfung",
    chooseYourSplit: "Wähle deinen Split", chooseSplitDesc: "Wähle den Split, der zu deinen Zielen und deinem Zeitplan passt.",
    howManyDays: "Wie viele Tage pro Woche?", autoGenerate: "Wir generieren automatisch ein Programm",
    programForYou: "für dich.", daysPerWeek: "Tage / Woche", yourWeek: "Deine Woche",
    trainingStyle: "Trainingsstil", trainingStyleDesc: "Wähle, wie du trainieren möchtest. Wir setzen Sätze, Wiederholungen und Pausen entsprechend.",
    sessions: "SITZUNGEN", exercisesUpper: "ÜBUNGEN", start: "Starten", generatePlan: "Plan generieren",
    continue: "Weiter", planSaved: "Plan gespeichert!", saveTrainingPlan: "Trainingsplan speichern",
    pushPullLegs: "Push / Pull / Legs", pushPullLegsDesc: "Der klassische Bodybuilding-Split. Trainiere jede Muskelgruppe zweimal pro Woche mit optimaler Erholung.",
    upperLower: "Oberkörper / Unterkörper", upperLowerDesc: "Effizienter 4-Tage-Split. Triff jede Muskelgruppe zweimal wöchentlich mit zusammengesetzten Sessions.",
    fullBodySplit: "Ganzkörper", fullBodySplitDesc: "Trainiere alles in jeder Sitzung. Perfekt für volle Zeitpläne und Anfänger.",
    bodybuilding: "Bodybuilding", bodybuildingDesc: "Klassischer Split nach Körperteilen. Maximale Isolation für jede Muskelgruppe.",
    arnoldSplit: "Arnold-Split", arnoldSplitDesc: "Der legendäre 6-Tage-Split. Brust/Rücken, Schultern/Arme, Beine — zweimal wiederholt.",
    hypertrophy: "Hypertrophie", hypertrophyDesc: "8-12 Wdh · 3-4 Sätze · 60-90s Pause",
    strengthProg: "Kraft", strengthProgDesc: "3-5 Wdh · 5 Sätze · 3min Pause",
    power: "Power", powerDesc: "1-3 Wdh · 5 Sätze · 3-5min Pause",
    enduranceProg: "Ausdauer", enduranceProgDesc: "15-20 Wdh · 3 Sätze · 45s Pause",
    pushDay: "Push-Tag", pullDay: "Pull-Tag", legDay: "Beintag",
    upperBody: "Oberkörper", lowerBody: "Unterkörper",
    chestTriceps: "Brust & Trizeps", backBiceps: "Rücken & Bizeps", legsCore: "Beine & Core",
    shouldersArms: "Schultern & Arme", chestBack: "Brust & Rücken", legsGlutes: "Beine & Gesäß",

    // Periodization
    periodization: "Periodisierung", trainingBlock: "Trainingsblock", weeks: "Wochen",
    blockDesc: "Block", weekOf: "Woche", of: "von", repsLabel: "Wdh", intensity: "Intensität",
    setsLabel: "Sätze", volume: "Volumen", thisWeeksWorkouts: "Trainings dieser Woche",
    fullBlockOverview: "Gesamtblock-Übersicht", startDay: "Starten",
    hypertrophyBlock: "Hypertrophie", hypertrophyBlockDesc: "Muskelgröße mit moderatem Gewicht und höherem Volumen aufbauen",
    strengthPeak: "Kraftspitze", strengthPeakDesc: "Neurale Anpassungen und 1RM-Potenzial maximieren",
    powerExplosive: "Power & Explosivität", powerExplosiveDesc: "Geschwindigkeit der Kraftentwicklung und athletische Power entwickeln",
    muscularEndurance: "Muskuläre Ausdauer", muscularEnduranceDesc: "Arbeitskapazität und Laktattoleranz verbessern",
    pushPullLegsSplit: "Push / Pull / Legs", pushPullLegsSplitDesc: "Klassischer 3-Tage-Split",
    upperLowerSplit: "Oberkörper / Unterkörper", upperLowerSplitDesc: "4-Tage-Frequenz-Split",
    fullBodySplit2: "Ganzkörper", fullBodySplit2Desc: "3x pro Woche Ganzkörper",
    broSplit: "Bro-Split", broSplitDesc: "5-Tage-Split nach Muskelgruppen",

    // Recovery Analytics
    recoveryHrvTitle: "Erholung & HRV", readinessScore: "Bereitschaftswert", level: "Level",
    suggestion: "Vorschlag:", yourBioMetrics: "Deine Biometrie",
    hrvLabel: "Herzfrequenzvariabilität (HRV)", restingHrLabel: "Ruhe-HF (bpm)",
    sleepLabel: "Schlaf (Stunden)", dailyActivityLabel: "Tägliche Aktivität (Tonnen)",
    autoRecoveryMode: "Auto-Erholungsmodus", autoRecoveryDesc: "Passe Workouts automatisch an, wenn die Bereitschaft niedrig ist.",
    hrvTrend: "HRV-Trend", hrv: "HRV", restHr: "Ruhe-HF", sleepShort: "Schlaf",
    suggestedSession: "Vorgeschlagene Sitzung", startSuggestedWorkout: "Vorgeschlagenes Training starten",
    takeRestDay: "Mach einen Ruhetag", takeRestDayDesc: "Die Bereitschaft ist kritisch niedrig. Leichte Mobilität oder vollständige Ruhe wird dringend empfohlen.",
    recoverySession: "Erholungssitzung", recoverySessionDesc: "Die Bereitschaft ist vermindert. Wähle submaximale Arbeit für den Unterkörper mit leichteren Lasten.",
    normalTraining: "Normales Training", normalTrainingDesc: "Die Bereitschaft ist ausreichend. Folge der geplanten Sitzung, aber halte das RPE im Zaum.",
    goHard: "Vollgas!", goHardDesc: "Die Bereitschaft ist hoch. Perfekte Bedingungen für einen PR-Versuch oder eine hochintensive Sitzung.",
    red: "Rot", yellow: "Gelb", green: "Grün", peak: "Spitze",

    // Voice Coach
    aiVoiceCoach: "KI-Sprachcoach", liveAi: "LIVE · KI", aiCoachActive: "KI-Coach aktiv",
    voiceCoachMuted: "Sprachcoach stumm", intentRecognition: "Absichtserkennung · sprich natürlich",
    turnOnHandsFree: "Aktivieren für freihändiges Training", listeningSayCommand: "Höre zu... sag deinen Befehl",
    tapToTryAgain: "Tippen zum erneuten Versuch", tapAndTalk: "Tippen und mit dem Coach sprechen",
    lastCommand: "Letzter Befehl", quickCommands: "Schnellbefehle", testVoiceGuidance: "Sprachführung testen",
    coachConversation: "Coach-Konversation", aiCoach: "KI-Coach",
    welcomeVoiceCoach: "Hallo! Ich bin dein ForgeUp-KI-Sprachcoach. Tippe auf das Mikrofon und ich höre auf deine Befehle.",
    voiceCoachHelp: "Du kannst Gewichte protokollieren, Pausen timen, Formtipps erfragen, dich motivieren oder dein Training steuern.",
    welcomeSpeak: "Willkommen beim ForgeUp-Sprachcoach. Sag einen Befehl, wenn du bereit bist.",
    listening: "Höre zu...", sorryCouldntHear: "Entschuldigung, ich konnte das nicht hören. Bitte versuche es erneut.",
    speechUnavailable: "Spracherkennung nicht verfügbar. Versuche Chrome oder Edge.",
    testVoiceHello: "Hallo! Ich bin dein Forge-Sprachcoach. Lass uns dieses Training zusammen rocken! Sag jederzeit einen Befehl.",

    // Auth
    welcomeBack: "Willkommen zurück", createAccount: "Konto erstellen", resetPassword: "Passwort zurücksetzen",
    signInToSync: "Melde dich an, um deine Workouts, Rekorde und Fortschritte sicher zu synchronisieren.",
    dataEncrypted: "Deine Daten sind verschlüsselt und sicher in der Cloud gespeichert.",
    enterEmailReset: "Gib deine E-Mail ein und wir senden dir einen Zurücksetzungs-Link.",
    continueWithGoogle: "Mit Google fortfahren", or: "oder", emailAddress: "E-Mail-Adresse",
    password: "Passwort", confirmPassword: "Passwort bestätigen", passwordRequirements: "Passwortanforderungen",
    chars8: "8+ Zeichen", uppercaseLetter: "Großbuchstabe", lowercaseLetter: "Kleinbuchstabe",
    number: "Zahl", specialCharacter: "Sonderzeichen", forgotPassword: "Passwort vergessen?",
    signIn: "Anmelden", createAccountBtn: "Konto erstellen", sendResetLink: "Zurücksetzungs-Link senden",
    dontHaveAccount: "Noch kein Konto?", alreadyHaveAccount: "Schon ein Konto?",
    rememberedPassword: "Passwort erinnert?", signUp: "Registrieren", backToSignIn: "Zurück zur Anmeldung",
    dataProtected: "Deine Daten sind mit branchenüblicher Verschlüsselung geschützt. Trainingsverlauf, Gewichtsprotokolle und persönliche Rekorde werden sicher in der Cloud synchronisiert.",
    skipForNow: "Vorerst überspringen",
    validEmail: "Bitte gib eine gültige E-Mail-Adresse ein.",
    passwordRequirementsError: "Das Passwort muss alle Sicherheitsanforderungen erfüllen.",
    passwordsDontMatch: "Die Passwörter stimmen nicht überein.",
    resetEmailSent: "Zurücksetzungs-E-Mail gesendet! Prüfe deinen Posteingang.",
    googleNotConfigured: "Google Sign-In ist noch nicht konfiguriert. Füge deine Firebase-Konfiguration in src/firebase.js hinzu",
    authNotConfigured: "Die Authentifizierung ist noch nicht konfiguriert. Füge deine Firebase-Konfiguration in src/firebase.js hinzu",
    resetNotConfigured: "Die Passwort-Zurücksetzung ist noch nicht konfiguriert. Füge deine Firebase-Konfiguration in src/firebase.js hinzu",

    // Social Feed
    community: "Community", signInToStart: "Anmelden zum Starten", feed: "Feed",
    shareYourWorkout: "Teile dein Training", noPostsYet: "Noch keine Beiträge",
    noPostsDesc: "Wenn echte Benutzer Workouts teilen, erscheinen sie hier. Konfiguriere Firebase in src/firebase.js und schließe ein Training ab, um der Erste zu sein!",
    justNow: "Gerade eben", kudos: "Lob", comment: "Kommentar", noCommentsYet: "Noch keine Kommentare — sei der Erste!",
    writeComment: "Kommentar schreiben...", signInToComment: "Anmelden zum Kommentieren",
    joinChallenges: "Tritt Gruppen-Herausforderungen bei und bleib mit deiner Fitness-Community verantwortlich.",
    noActiveChallenges: "Keine aktiven Herausforderungen",
    noActiveChallengesDesc: "Herausforderungen von echten Benutzern erscheinen hier nach der Firebase-Konfiguration.",
    participants: "Teilnehmer", dayOf: "Tag", of: "von", joined: "Beigetreten", joinChallenge: "Herausforderung beitreten",
    weeklyVolumeLeaderboard: "Wöchentliche Volumen-Rangliste. Nur echte Benutzer, die teilnehmen, erscheinen — keine Fake-Einträge.",
    leaderboardEmpty: "Rangliste leer",
    leaderboardEmptyDesc: "Echte Benutzer, die sich von ihrem Profil aus für die Rangliste entscheiden, erscheinen hier.",
    connectivityLoading: "Die Konnektivität wird noch geladen. Versuche es gleich noch einmal.",
    firebaseNeeded: "Community-Funktionen benötigen Firebase. Konfiguriere es in src/firebase.js, um echte Beiträge von echten Benutzern zu sehen.",
    socialUnavailable: "Soziale Funktionen sind nicht verfügbar, bis Firebase mit echten Anmeldedaten in src/firebase.js konfiguriert ist.",
    completedWorkout: "Abgeschlossen",
    aWorkout: "ein Training",
    workoutSummaryCopied: "Trainingszusammenfassung in die Zwischenablage kopiert! Füge sie überall ein, um zu teilen.",
    forgeUpWorkout: "ForgeUp-Training",
    recoveryMobilityFlow: "Erholungs-Mobilitäts-Flow",
    workout: "Training",
  },

  it: {
    // Navigation
    dashboard: "Home", exercises: "Esercizi", train: "Allenati", analytics: "Analisi", profile: "Profilo",
    settings: "Impostazioni", goals: "Obiettivi sett.", challenges: "Sfide", equipment: "Attrezzatura",
    meals: "Opzioni pasti", weight: "Peso & BMI", feedback: "Feedback", rate: "Valutaci", language: "Lingua",
    music: "Musica", sound: "Suono", ready: "Pronto a muoverti?", start: "Inizia allenamento", resume: "Riprendi",
    finish: "Termina", search: "Cerca esercizi", noResults: "Nessun risultato per", nutrition: "Nutrizione & macro",
    leaderboard: "Classifica", privacy: "Privacy & dati", wearable: "Sincronizzazione",
    measurements: "Misure corporee", plan: "Piano di allenamento", back: "Indietro", skip: "Salta",
    done: "Fatto", next: "Avanti", timer: "Timer", instructions: "Istruzioni", demo: "Demo",
    weightLabel: "Peso", bmi: "BMI", height: "Altezza", save: "Salva", on: "Sì", off: "No", more: "Altro",
    week: "Settimana", month: "Mese", allTime: "Tutto", thisWeek: "questa settimana", streak: "Serie", keepGoing: "Continua così",
    personalRecord: "Record personale", lastSession: "Ultima sessione", progress: "Progressi",
    platesNeeded: "Dischi necessari", targetWeight: "Peso obiettivo", perSide: "Per lato", barWeight: "Peso bilanciere",
    inProgress: "In corso", complete: "Completa", setLabel: "SERIE", kg: "KG", reps: "REP",
    restDone: "Pausa finita!", restDesc: "La tua pausa di 90s è finita — pronto per la prossima serie.",
    pushNotif: "Notifiche", pushNotifDesc: "Ricevi una notifica del browser quando la pausa finisce.",
    enableNotif: "Attiva notifiche", testNotif: "Invia notifica di prova",
    notifDenied: "Notifiche bloccate. Consentile nelle impostazioni del browser.",
    activeCalories: "Calorie attive", sleep: "Sonno", heartRate: "Frequenza cardiaca", stepsLabel: "Passi",
    todayBurned: "kcal oggi", hbpm: "bpm", syncHealth: "Sincronizza salute",
    syncDesc: "Inserisci i tuoi dati di salute giornalieri. In una build nativa si collegherebbe automaticamente a Apple Health / Health Connect.",
    logWorkout: "Registra", logEntry: "Inserisci le tue metriche di oggi", stepsGoal: "Obiettivo passi",
    target: "Obiettivo", current: "Attuale", history: "Cronologia", quickAdd: "Aggiunta rapida", todaysLog: "Registro di oggi",
    nothingLogged: "Niente registrato — aggiungi qualcosa.", muscleActivation: "Attivazione muscolare",
    liftedWeight: "Peso sollevato", totalVolume: "Volume totale", sessionsCount: "Sessioni",
    noActive: "Nessuna sessione attiva", startFromDash: "Avvia l'allenamento di oggi dalla Home.",
    adjust: "regola progressi", markDone: "Segna fatto", completed: "Completato", protein: "Proteine",
    carbs: "Carboidrati", fat: "Grassi", kcal: "kcal", waist: "Vita", chest: "Petto", arms: "Braccia",
    record: "Misura", measurementsPage: "Misure corporee",
    measurementsDesc: "Traccia peso, vita, petto e braccia. In una vera app si sincronizza con il tuo account.",
    addMeasurement: "Aggiungi misura", weightTrend: "Andamento peso", cm: "cm", january: "Gennaio",
    calendar: "Calendario", dayProgress: "Progressi giornalieri", openedApp: "Giorni di utilizzo",
    howDid: "% completato al giorno", dailyStreak: "Serie giornaliera", workoutsLogged: "Allenamenti registrati",
    totalKcalBurned: "Totale kcal bruciate", exercisesDone: "Esercizi fatti", sessionCompleted: "Sessione completata",
    finishedWorkout: "Termina allenamento", add15: "+15s", sub15: "−15s", restTime: "Pausa",
    goodJob: "Ottimo lavoro! Sessione completata.", totalVolumeLabel: "Volume sollevato",

    // Dashboard
    wednesday: "Mercoledì", aug12: "12 Ago", suggestedProgression: "Progressione suggerita",
    exercisesCount: "esercizi", min: "min", weeklyLoad: "Carico settimanale", sessionLeft: "sessione rimasta",
    setHeight: "Imposta altezza", underweight: "Sottopeso", healthy: "Sano", overweight: "Sovrappeso", obese: "Obeso",

    // Onboarding
    tellUsAboutYou: "Parlaci di te",
    tellUsSub: "Questo personalizza il tuo piano. Puoi cambiarlo in Impostazioni.",
    mainGoal: "Qual è il tuo obiettivo principale?",
    mainGoalSub: "Adatteremo il tuo allenamento a questo focus.",
    pickBodyType: "Scegli il tuo tipo di corpo",
    pickBodyTypeSub: "Scegli la corrispondenza più vicina — aiuta a fissare obiettivi realistici.",
    male: "Uomo", female: "Donna", preferNot: "Preferisco non dire",
    slim: "Snello / Magro", slimDesc: "Struttura leggera, metabolismo veloce",
    athletic: "Atletico / Tonico", athleticDesc: "Struttura equilibrata e attiva",
    muscular: "Muscoloso / Robusto", muscularDesc: "Struttura solida e forte",
    curvy: "Curvy / Pieno", curvyDesc: "Forma morbida e piena",
    fullBody: "Corpo intero", fullBodyDesc: "Forza equilibrata ovunque",
    muscleGain: "Aumento muscolare", muscleGainDesc: "Costruisci volume e forza",
    fatLoss: "Perdita di grasso", fatLossDesc: "Brucia grasso, rivela forma",
    strength: "Forza", strengthDesc: "Solleva più pesante nel tempo",
    endurance: "Resistenza", enduranceDesc: "Dura più a lungo, recupera più veloce",
    corePosture: "Core & postura", corePostureDesc: "Stabilità ed equilibrio",

    // Exercise library
    all: "Tutti", chest: "Petto", back: "Schiena", legs: "Gambe", glutes: "Glutei", shoulders: "Spalle", arms: "Braccia", core: "Core",
    plate: "Disco", plateCalculator: "Calcolatore dischi", targetMustBeHeavier: "L'obiettivo deve essere più pesante del bilanciere.",
    cantReachExactly: "Impossibile raggiungere esattamente — il più vicino è",
    smartSuggestion: "Suggerimento intelligente",
    lastTimeYouDid: "L'ultima volta hai fatto",
    tryToBreak: "Prova",
    toBreakPR: "per battere il tuo record.",
    setCompleteToast: "Serie completata! Pausa 90s",
    sets: "serie", exercisesLower: "esercizi", plates: "Dischi",
    finishWorkoutCount: "Termina allenamento",
    restComplete: "Pausa completata!",
    readyNextSet: "Pronto per la prossima serie. Vai!",
    noActiveSession: "Nessuna sessione attiva",
    startFromDashFull: "Avvia l'allenamento di oggi dalla Home per registrare le serie.",

    // Analytics
    muscleActivationRange: "Attivazione muscolare",
    recordLabel: "record", totalVolumeLabel2: "Volume totale",

    // Nutrition
    nutritionMacros: "Nutrizione & macro", ofDailyGoal: "di", dailyGoal: "obiettivo giornaliero",
    searchFoods: "Cerca 28 alimenti (prova 'pollo', 'riso', 'noci')…",
    noFoodsMatch: "Nessun alimento per",
    added: "aggiunto",

    // Leaderboard
    shareMyStreak: "Condividi la mia serie",
    visibleToEveryone: "Visibile a tutti gli utenti di questa app, come",
    loadingLeaderboard: "Caricamento classifica…",
    noOneOnBoard: "Nessuno in classifica — sii il primo a partecipare.",
    you: "tu",

    // Sound settings
    soundNotifications: "Suono & notifiche", soundEffects: "Effetti sonori",
    soundEffectsDesc: "Carillon serie completata, allarme pausa, fanfara allenamento.",
    testSetChime: "Prova carillon", testRestAlert: "Prova allarme", testFanfare: "Prova fanfara",
    soundNote: "Le notifiche push in background richiedono una build nativa — una scheda del browser non può farlo, quindi non è incluso qui.",

    // Music settings
    backgroundMusic: "Musica di sottofondo", backgroundMusicDesc: "Le tue tracce MP3 + opzioni sintetizzate.",
    yourTracks: "Le tue tracce",

    // Language settings
    chooseLanguage: "Scegli la tua lingua preferita. L'interfaccia si aggiornerà immediatamente.",

    // Weight & BMI
    yourBMI: "Il tuo BMI", weightKg: "Peso (kg)", heightCm: "Altezza (cm)",

    // Meal options
    sampleDay: "Giornata tipo", breakfast: "Colazione", lunch: "Pranzo", snack: "Spuntino", dinner: "Cena", evening: "Sera",

    // Weekly goals
    goalsHit: "obiettivi raggiunti", perfectWeek: "Settimana perfetta — tutti gli obiettivi raggiunti!",
    almostThere: "Quasi lì — continua così!", goodProgress: "Buoni progressi — continua.",
    gettingStarted: "Iniziando — ogni ripetizione conta.", doneLabel: "Fatto",

    // Challenges
    reward: "Ricompensa:",

    // Equipment
    equipmentDesc: "L'attrezzatura che hai determina quali esercizi consigliamo. Tutti gli esercizi nella libreria sono etichettati con l'attrezzatura necessaria.",

    // Feedback
    thankYou: "Grazie!", feedbackThanks: "Il tuo feedback ci aiuta a migliorare ForgeUp.",
    howsExperience: "Com'è la tua esperienza finora? Il tuo feedback onesto ci aiuta a costruire un'app migliore.",
    rateExperience: "Valuta la tua esperienza", tellUsMore: "Dicci di più (opzionale)",
    whatDoYouLove: "Cosa ami? Cosa potrebbe essere migliore?", submitFeedback: "Invia feedback",

    // Rate us
    thanksForRating: "Grazie per la valutazione!", ratingMeansWorld: "La tua valutazione significa molto per noi.",
    enjoyingForgeUp: "Ti piace ForgeUp?", tapStarToRate: "Tocca una stella per valutare l'app.",
    submitRating: "Invia valutazione",

    // Calendar
    dailyStreakLabel: "Serie giornaliera", workoutsLoggedLabel: "Allenamenti registrati", totalKcalBurnedLabel: "Totale kcal bruciate",

    // Profile
    communityChallenges: "Community & sfide", periodizationBlocks: "Blocchi di periodizzazione",
    recoveryHrv: "Recupero & HRV", voiceCoach: "Coach vocale", achievementBadges: "Distintivi di successo",
    edit: "modifica", account: "Account", signedInAs: "Accesso come", logOut: "Esci",
    designedBy: "Progettato da Dhurgham Alsaadi", hypertrophyBeginner: "Ipertrofia · Principiante",
    intermediate: "Intermedio", firstSteps: "Primi passi", firstStepsDesc: "Completa il tuo primo allenamento",
    centurion: "Centurione", centurionDesc: "Registra 100 allenamenti", heavyLifter: "Sollevatore pesante",
    heavyLifterDesc: "Raggiungi 100kg su qualsiasi sollevamento", weekWarrior: "Guerriero della settimana", weekWarriorDesc: "Serie di 7 giorni",
    fortnightForge: "Forgia quindicinale", fortnightForgeDesc: "Serie di 14 giorni",

    // Info screens
    planInfo: "Al momento tutti vedono lo stesso piano fisso Spinta/Tirata/Gambe. Un vero costruttore di piani — scegli uno split, imposta la frequenza settimanale, genera automaticamente il blocco — è la prossima funzione naturale, e riutilizzerebbe la stessa logica di progressione che già suggerisce il tuo salto di +2,5kg sulla panca.",
    privacyInfo: "Cosa viene salvato e dove: il tuo profilo, serie, cronologia allenamenti e registro nutrizionale sono salvati privatamente, legati al tuo account, e mai mostrati a nessun altro. Se partecipi alla classifica della community, solo il tuo nome visualizzato e la serie attuale diventano visibili agli altri utenti — nient'altro.",

    // Splash
    connecting: "Connessione…", connectingAccount: "Connessione al tuo account…",
    loadingHistory: "Caricamento cronologia allenamenti…", loadingNutrition: "Caricamento registro nutrizionale…",
    checkingLeaderboard: "Controllo classifica…",

    // Training Plan Builder
    trainingPlanBuilder: "Costruttore di piani di allenamento", designYourProgram: "Progetta il tuo programma perfetto",
    split: "Split", frequency: "Frequenza", progression: "Progressione", review: "Revisione",
    chooseYourSplit: "Scegli il tuo split", chooseSplitDesc: "Scegli lo split che si adatta ai tuoi obiettivi e al tuo programma.",
    howManyDays: "Quanti giorni a settimana?", autoGenerate: "Genereremo automaticamente un programma",
    programForYou: "per te.", daysPerWeek: "giorni / settimana", yourWeek: "La tua settimana",
    trainingStyle: "Stile di allenamento", trainingStyleDesc: "Scegli come vuoi allenarti. Imposteremo serie, ripetizioni e riposo di conseguenza.",
    sessions: "SESSIONI", exercisesUpper: "ESERCIZI", start: "Inizia", generatePlan: "Genera piano",
    continue: "Continua", planSaved: "Piano salvato!", saveTrainingPlan: "Salva piano di allenamento",
    pushPullLegs: "Spinta / Tirata / Gambe", pushPullLegsDesc: "Lo split classico del bodybuilding. Allena ogni gruppo muscolare due volte a settimana con recupero ottimale.",
    upperLower: "Superiore / Inferiore", upperLowerDesc: "Split efficiente di 4 giorni. Colpisci ogni gruppo muscolare due volte a settimana con sessioni composte.",
    fullBodySplit: "Corpo intero", fullBodySplitDesc: "Allena tutto in ogni sessione. Perfetto per orari impegnati e principianti.",
    bodybuilding: "Bodybuilding", bodybuildingDesc: "Split classico per gruppi muscolari. Isolamento massimo per ogni gruppo.",
    arnoldSplit: "Split Arnold", arnoldSplitDesc: "Il leggendario split di 6 giorni. Petto/Schiena, Spalle/Braccia, Gambe — ripetuto due volte.",
    hypertrophy: "Ipertrofia", hypertrophyDesc: "8-12 ripetizioni · 3-4 serie · 60-90s riposo",
    strengthProg: "Forza", strengthProgDesc: "3-5 ripetizioni · 5 serie · 3min riposo",
    power: "Potenza", powerDesc: "1-3 ripetizioni · 5 serie · 3-5min riposo",
    enduranceProg: "Resistenza", enduranceProgDesc: "15-20 ripetizioni · 3 serie · 45s riposo",
    pushDay: "Giorno spinta", pullDay: "Giorno tirata", legDay: "Giorno gambe",
    upperBody: "Parte superiore", lowerBody: "Parte inferiore",
    chestTriceps: "Petto & tricipiti", backBiceps: "Schiena & bicipiti", legsCore: "Gambe & core",
    shouldersArms: "Spalle & braccia", chestBack: "Petto & schiena", legsGlutes: "Gambe & glutei",

    // Periodization
    periodization: "Periodizzazione", trainingBlock: "Blocco di allenamento", weeks: "settimane",
    blockDesc: "Blocco", weekOf: "Settimana", of: "di", repsLabel: "Rep", intensity: "Intensità",
    setsLabel: "Serie", volume: "Volume", thisWeeksWorkouts: "Allenamenti di questa settimana",
    fullBlockOverview: "Panoramica blocco completo", startDay: "Inizia",
    hypertrophyBlock: "Ipertrofia", hypertrophyBlockDesc: "Costruisci volume muscolare con peso moderato e volume più alto",
    strengthPeak: "Picco di forza", strengthPeakDesc: "Massimizza gli adattamenti neurali e il potenziale 1RM",
    powerExplosive: "Potenza & esplosività", powerExplosiveDesc: "Sviluppa velocità di produzione di forza e potenza atletica",
    muscularEndurance: "Resistenza muscolare", muscularEnduranceDesc: "Migliora capacità di lavoro e tolleranza al lattato",
    pushPullLegsSplit: "Spinta / Tirata / Gambe", pushPullLegsSplitDesc: "Split classico di 3 giorni",
    upperLowerSplit: "Superiore / Inferiore", upperLowerSplitDesc: "Split di frequenza di 4 giorni",
    fullBodySplit2: "Corpo intero", fullBodySplit2Desc: "3x a settimana corpo intero",
    broSplit: "Split Bro", broSplitDesc: "Split di 5 giorni per gruppi muscolari",

    // Recovery Analytics
    recoveryHrvTitle: "Recupero & HRV", readinessScore: "Punteggio di prontezza", level: "Livello",
    suggestion: "Suggerimento:", yourBioMetrics: "Le tue biometriche",
    hrvLabel: "Variabilità della frequenza cardiaca (HRV)", restingHrLabel: "FC a riposo (bpm)",
    sleepLabel: "Sonno (ore)", dailyActivityLabel: "Attività giornaliera (tonnellate)",
    autoRecoveryMode: "Modalità recupero automatico", autoRecoveryDesc: "Regola automaticamente gli allenamenti quando la prontezza è bassa.",
    hrvTrend: "Tendenza HRV", hrv: "HRV", restHr: "FC riposo", sleepShort: "Sonno",
    suggestedSession: "Sessione suggerita", startSuggestedWorkout: "Inizia allenamento suggerito",
    takeRestDay: "Prendi un giorno di riposo", takeRestDayDesc: "La prontezza è criticamente bassa. Mobilità leggera o riposo completo fortemente raccomandati.",
    recoverySession: "Sessione di recupero", recoverySessionDesc: "La prontezza è diminuita. Scegli lavoro sub-massimale per la parte inferiore con carichi più leggeri.",
    normalTraining: "Allenamento normale", normalTrainingDesc: "La prontezza è adeguata. Segui la sessione pianificata, ma tieni sotto controllo l'RPE.",
    goHard: "Vai forte!", goHardDesc: "La prontezza è alta. Condizioni perfette per tentare un record o una sessione ad alta intensità.",
    red: "Rosso", yellow: "Giallo", green: "Verde", peak: "Picco",

    // Voice Coach
    aiVoiceCoach: "Coach vocale IA", liveAi: "LIVE · IA", aiCoachActive: "Coach IA attivo",
    voiceCoachMuted: "Coach vocale silenziato", intentRecognition: "Riconoscimento intenzioni · parla naturalmente",
    turnOnHandsFree: "Attiva per allenamento a mani libere", listeningSayCommand: "In ascolto... di' il tuo comando",
    tapToTryAgain: "Tocca per riprovare", tapAndTalk: "Tocca e parla con il coach",
    lastCommand: "Ultimo comando", quickCommands: "Comandi rapidi", testVoiceGuidance: "Prova guida vocale",
    coachConversation: "Conversazione del coach", aiCoach: "Coach IA",
    welcomeVoiceCoach: "Ciao! Sono il tuo coach vocale IA di ForgeUp. Tocca il microfono e ascolterò i tuoi comandi.",
    voiceCoachHelp: "Puoi registrare pesi, temporizzare le pause, chiedere consigli sulla forma, motivarti o controllare il tuo allenamento.",
    welcomeSpeak: "Benvenuto al coach vocale ForgeUp. Di' un comando quando sei pronto.",
    listening: "In ascolto...", sorryCouldntHear: "Scusa, non ho sentito. Per favore riprova.",
    speechUnavailable: "Riconoscimento vocale non disponibile. Prova Chrome o Edge.",
    testVoiceHello: "Ciao! Sono il tuo coach vocale Forge. Distruggiamo questo allenamento insieme! Di' un comando in qualsiasi momento.",

    // Auth
    welcomeBack: "Bentornato", createAccount: "Crea il tuo account", resetPassword: "Reimposta password",
    signInToSync: "Accedi per sincronizzare allenamenti, record e progressi in modo sicuro.",
    dataEncrypted: "I tuoi dati sono crittografati e salvati in modo sicuro nel cloud.",
    enterEmailReset: "Inserisci la tua email e ti invieremo un link di reimpostazione.",
    continueWithGoogle: "Continua con Google", or: "o", emailAddress: "Indirizzo email",
    password: "Password", confirmPassword: "Conferma password", passwordRequirements: "Requisiti password",
    chars8: "8+ caratteri", uppercaseLetter: "Lettera maiuscola", lowercaseLetter: "Lettera minuscola",
    number: "Numero", specialCharacter: "Carattere speciale", forgotPassword: "Password dimenticata?",
    signIn: "Accedi", createAccountBtn: "Crea account", sendResetLink: "Invia link di reimpostazione",
    dontHaveAccount: "Non hai un account?", alreadyHaveAccount: "Hai già un account?",
    rememberedPassword: "Hai ricordato la password?", signUp: "Registrati", backToSignIn: "Torna all'accesso",
    dataProtected: "I tuoi dati sono protetti con crittografia di livello industriale. Cronologia allenamenti, registri di peso e record personali si sincronizzano in modo sicuro nel cloud.",
    skipForNow: "Salta per ora",
    validEmail: "Inserisci un indirizzo email valido.",
    passwordRequirementsError: "La password deve soddisfare tutti i requisiti di sicurezza.",
    passwordsDontMatch: "Le password non corrispondono.",
    resetEmailSent: "Email di reimpostazione inviata! Controlla la tua casella di posta.",
    googleNotConfigured: "Google Sign-In non è configurato. Aggiungi la tua configurazione Firebase in src/firebase.js",
    authNotConfigured: "L'autenticazione non è configurata. Aggiungi la tua configurazione Firebase in src/firebase.js",
    resetNotConfigured: "La reimpostazione della password non è configurata. Aggiungi la tua configurazione Firebase in src/firebase.js",

    // Social Feed
    community: "Community", signInToStart: "Accedi per iniziare", feed: "Feed",
    shareYourWorkout: "Condividi il tuo allenamento", noPostsYet: "Nessun post ancora",
    noPostsDesc: "Quando utenti reali condividono allenamenti, appariranno qui. Configura Firebase in src/firebase.js e completa un allenamento per essere il primo!",
    justNow: "Adesso", kudos: "complimenti", comment: "Commento", noCommentsYet: "Nessun commento — sii il primo!",
    writeComment: "Scrivi un commento...", signInToComment: "Accedi per commentare",
    joinChallenges: "Unisciti a sfide di gruppo e resta responsabile con la tua community fitness.",
    noActiveChallenges: "Nessuna sfida attiva",
    noActiveChallengesDesc: "Le sfide create da utenti reali appariranno qui dopo la configurazione di Firebase.",
    participants: "partecipanti", dayOf: "Giorno", of: "di", joined: "Iscritto", joinChallenge: "Unisciti alla sfida",
    weeklyVolumeLeaderboard: "Classifica settimanale del volume sollevato. Solo utenti reali che partecipano appaiono — nessuna voce falsa.",
    leaderboardEmpty: "Classifica vuota",
    leaderboardEmptyDesc: "Gli utenti reali che partecipano alla classifica dal loro Profilo appariranno qui.",
    connectivityLoading: "La connettività sta ancora caricando. Riprova tra un momento.",
    firebaseNeeded: "Le funzioni della community richiedono Firebase. Configuralo in src/firebase.js per vedere post reali di utenti reali.",
    socialUnavailable: "Le funzioni social non sono disponibili finché Firebase non è configurato con credenziali reali in src/firebase.js.",
    completedWorkout: "Completato",
    aWorkout: "un allenamento",
    workoutSummaryCopied: "Riepilogo allenamento copiato negli appunti! Incollalo ovunque per condividere.",
    forgeUpWorkout: "Allenamento ForgeUp",
    recoveryMobilityFlow: "Flusso di mobilità di recupero",
    workout: "Allenamento",
  },

  pt: {
    // Navigation
    dashboard: "Início", exercises: "Exercícios", train: "Treinar", analytics: "Análise", profile: "Perfil",
    settings: "Configurações", goals: "Metas semanais", challenges: "Desafios", equipment: "Equipamento",
    meals: "Opções de refeição", weight: "Peso & IMC", feedback: "Feedback", rate: "Avalie-nos", language: "Idioma",
    music: "Música", sound: "Som", ready: "Pronto para se mover?", start: "Iniciar treino", resume: "Retomar",
    finish: "Terminar", search: "Pesquisar exercícios", noResults: "Sem resultados para", nutrition: "Nutrição & macros",
    leaderboard: "Classificação", privacy: "Privacidade & dados", wearable: "Sincronização",
    measurements: "Medidas corporais", plan: "Plano de treino", back: "Voltar", skip: "Pular",
    done: "Concluído", next: "Próximo", timer: "Temporizador", instructions: "Instruções", demo: "Demo",
    weightLabel: "Peso", bmi: "IMC", height: "Altura", save: "Salvar", on: "Sim", off: "Não", more: "Mais",
    week: "Semana", month: "Mês", allTime: "Tudo", thisWeek: "esta semana", streak: "Sequência", keepGoing: "Continue assim",
    personalRecord: "Recorde pessoal", lastSession: "Última sessão", progress: "Progresso",
    platesNeeded: "Anilhas necessárias", targetWeight: "Peso alvo", perSide: "Por lado", barWeight: "Peso da barra",
    inProgress: "Em progresso", complete: "Concluir", setLabel: "SÉRIE", kg: "KG", reps: "REP",
    restDone: "Descanso terminou!", restDesc: "Seu descanso de 90s terminou — prepare-se para a próxima série.",
    pushNotif: "Notificações", pushNotifDesc: "Receba uma notificação do navegador quando o descanso terminar.",
    enableNotif: "Ativar notificações", testNotif: "Enviar notificação de teste",
    notifDenied: "Notificações bloqueadas. Permita nas configurações do navegador.",
    activeCalories: "Calorias ativas", sleep: "Sono", heartRate: "Frequência cardíaca", stepsLabel: "Passos",
    todayBurned: "kcal hoje", hbpm: "bpm", syncHealth: "Sincronizar saúde",
    syncDesc: "Insira seus dados diários de saúde. Em uma versão nativa, isso se conectaría automaticamente ao Apple Health / Health Connect.",
    logWorkout: "Registrar", logEntry: "Insira suas métricas de hoje", stepsGoal: "Meta de passos",
    target: "Meta", current: "Atual", history: "Histórico", quickAdd: "Adição rápida", todaysLog: "Registro de hoje",
    nothingLogged: "Nada registrado ainda — adicione algo.", muscleActivation: "Ativação muscular",
    liftedWeight: "Peso levantado", totalVolume: "Volume total", sessionsCount: "Sessões",
    noActive: "Sem sessão ativa", startFromDash: "Inicie o treino de hoje pelo Início.",
    adjust: "ajustar progresso", markDone: "Marcar feito", completed: "Concluído", protein: "Proteína",
    carbs: "Carboidratos", fat: "Gordura", kcal: "kcal", waist: "Cintura", chest: "Peito", arms: "Braços",
    record: "Medida", measurementsPage: "Medidas corporais",
    measurementsDesc: "Acompanhe peso, cintura, peito e braços. Em um app real, isso sincroniza com sua conta.",
    addMeasurement: "Adicionar medida", weightTrend: "Tendência de peso", cm: "cm", january: "Janeiro",
    calendar: "Calendário", dayProgress: "Progresso diário", openedApp: "Dias que abriu o app",
    howDid: "% concluído por dia", dailyStreak: "Sequência diária", workoutsLogged: "Treinos registrados",
    totalKcalBurned: "Total kcal queimadas", exercisesDone: "Exercícios feitos", sessionCompleted: "Sessão concluída",
    finishedWorkout: "Terminar treino", add15: "+15s", sub15: "−15s", restTime: "Descanso",
    goodJob: "Bom trabalho! Sessão concluída.", totalVolumeLabel: "Volume levantado",

    // Dashboard
    wednesday: "Quarta-feira", aug12: "12 Ago", suggestedProgression: "Progressão sugerida",
    exercisesCount: "exercícios", min: "min", weeklyLoad: "Carga semanal", sessionLeft: "sessão restante",
    setHeight: "Definir altura", underweight: "Abaixo do peso", healthy: "Saudável", overweight: "Sobrepeso", obese: "Obeso",

    // Onboarding
    tellUsAboutYou: "Conte-nos sobre você",
    tellUsSub: "Isso personaliza seu plano. Você pode alterá-lo nas Configurações.",
    mainGoal: "Qual é seu objetivo principal?",
    mainGoalSub: "Vamos moldar seu treino em torno desse foco.",
    pickBodyType: "Escolha seu tipo de corpo",
    pickBodyTypeSub: "Escolha a correspondência mais próxima — ajuda a definir metas realistas.",
    male: "Masculino", female: "Feminino", preferNot: "Prefiro não dizer",
    slim: "Magro / Enxuto", slimDesc: "Estrutura leve, metabolismo rápido",
    athletic: "Atlético / Tonificado", athleticDesc: "Estrutura equilibrada e ativa",
    muscular: "Musculoso / Robusto", muscularDesc: "Estrutura sólida e forte",
    curvy: "Curvilíneo / Cheio", curvyDesc: "Forma suave e cheia",
    fullBody: "Corpo inteiro", fullBodyDesc: "Força equilibrada em tudo",
    muscleGain: "Ganho muscular", muscleGainDesc: "Construa tamanho e força",
    fatLoss: "Perda de gordura", fatLossDesc: "Queime gordura, revele forma",
    strength: "Força", strengthDesc: "Levante mais pesado com o tempo",
    endurance: "Resistência", enduranceDesc: "Dure mais, recupere mais rápido",
    corePosture: "Core & postura", corePostureDesc: "Estabilidade e equilíbrio",

    // Exercise library
    all: "Todos", chest: "Peito", back: "Costas", legs: "Pernas", glutes: "Glúteos", shoulders: "Ombros", arms: "Braços", core: "Core",
    plate: "Anilha", plateCalculator: "Calculadora de anilhas", targetMustBeHeavier: "O alvo deve ser mais pesado que a barra.",
    cantReachExactly: "Não é possível alcançar exatamente — o mais próximo é",
    smartSuggestion: "Sugestão inteligente",
    lastTimeYouDid: "Da última vez você fez",
    tryToBreak: "Tente",
    toBreakPR: "para bater seu recorde.",
    setCompleteToast: "Série concluída! Descanse 90s",
    sets: "séries", exercisesLower: "exercícios", plates: "Anilhas",
    finishWorkoutCount: "Terminar treino",
    restComplete: "Descanso concluído!",
    readyNextSet: "Pronto para sua próxima série. Vai!",
    noActiveSession: "Sem sessão ativa",
    startFromDashFull: "Inicie o treino de hoje pelo Início para registrar séries.",

    // Analytics
    muscleActivationRange: "Ativação muscular",
    recordLabel: "recorde", totalVolumeLabel2: "Volume total",

    // Nutrition
    nutritionMacros: "Nutrição & macros", ofDailyGoal: "de", dailyGoal: "meta diária",
    searchFoods: "Pesquisar 28 alimentos (tente 'frango', 'arroz', 'nozes')…",
    noFoodsMatch: "Sem alimentos para",
    added: "adicionado",

    // Leaderboard
    shareMyStreak: "Compartilhar minha sequência",
    visibleToEveryone: "Visível para todos os usuários deste app, como",
    loadingLeaderboard: "Carregando classificação…",
    noOneOnBoard: "Ninguém na tabela ainda — seja o primeiro a participar.",
    you: "você",

    // Sound settings
    soundNotifications: "Som & notificações", soundEffects: "Efeitos sonoros",
    soundEffectsDesc: "Sinal de série concluída, alerta de descanso, fanfarra de treino.",
    testSetChime: "Testar sinal", testRestAlert: "Testar alerta", testFanfare: "Testar fanfarra",
    soundNote: "Notificações push em segundo plano precisam de um build nativo — uma aba do navegador não pode fazer isso, então não está incluído aqui.",

    // Music settings
    backgroundMusic: "Música de fundo", backgroundMusicDesc: "Suas faixas MP3 + opções sintetizadas.",
    yourTracks: "Suas faixas",

    // Language settings
    chooseLanguage: "Escolha seu idioma preferido. A interface será atualizada imediatamente.",

    // Weight & BMI
    yourBMI: "Seu IMC", weightKg: "Peso (kg)", heightCm: "Altura (cm)",

    // Meal options
    sampleDay: "Dia de exemplo", breakfast: "Café da manhã", lunch: "Almoço", snack: "Lanche", dinner: "Jantar", evening: "Noite",

    // Weekly goals
    goalsHit: "metas alcançadas", perfectWeek: "Semana perfeita — todas as metas alcançadas!",
    almostThere: "Quase lá — continue!", goodProgress: "Bom progresso — continue.",
    gettingStarted: "Começando — cada repetição conta.", doneLabel: "Feito",

    // Challenges
    reward: "Recompensa:",

    // Equipment
    equipmentDesc: "O equipamento que você tem determina quais exercícios recomendamos. Todos os exercícios na biblioteca são etiquetados com o equipamento necessário.",

    // Feedback
    thankYou: "Obrigado!", feedbackThanks: "Seu feedback nos ajuda a melhorar o ForgeUp.",
    howsExperience: "Como está sua experiência até agora? Seu feedback honesto nos ajuda a construir um app melhor.",
    rateExperience: "Avalie sua experiência", tellUsMore: "Conte-nos mais (opcional)",
    whatDoYouLove: "O que você ama? O que poderia ser melhor?", submitFeedback: "Enviar feedback",

    // Rate us
    thanksForRating: "Obrigado pela avaliação!", ratingMeansWorld: "Sua avaliação significa muito para nós.",
    enjoyingForgeUp: "Gostando do ForgeUp?", tapStarToRate: "Toque em uma estrela para avaliar o app.",
    submitRating: "Enviar avaliação",

    // Calendar
    dailyStreakLabel: "Sequência diária", workoutsLoggedLabel: "Treinos registrados", totalKcalBurnedLabel: "Total kcal queimadas",

    // Profile
    communityChallenges: "Comunidade & desafios", periodizationBlocks: "Blocos de periodização",
    recoveryHrv: "Recuperação & HRV", voiceCoach: "Treinador de voz", achievementBadges: "Distintivos de conquista",
    edit: "editar", account: "Conta", signedInAs: "Conectado como", logOut: "Sair",
    designedBy: "Projetado por Dhurgham Alsaadi", hypertrophyBeginner: "Hipertrofia · Iniciante",
    intermediate: "Intermediário", firstSteps: "Primeiros passos", firstStepsDesc: "Complete seu primeiro treino",
    centurion: "Centurião", centurionDesc: "Registre 100 treinos", heavyLifter: "Levantador pesado",
    heavyLifterDesc: "Alcance 100kg em qualquer levantamento", weekWarrior: "Guerreiro da semana", weekWarriorDesc: "Sequência de 7 dias",
    fortnightForge: "Forja quinzenal", fortnightForgeDesc: "Sequência de 14 dias",

    // Info screens
    planInfo: "No momento todos veem o mesmo plano fixo de Empurrar/Puxar/Pernas. Um verdadeiro construtor de planos — escolha uma divisão, defina frequência semanal, gere o bloco automaticamente — é a próxima função natural, e reutilizaria a mesma lógica de progressão que já sugere seu salto de +2,5kg no supino.",
    privacyInfo: "O que é armazenado e onde: seu perfil, sequência, histórico de treinos e registro nutricional são salvos de forma privada, vinculados à sua conta, e nunca mostrados a ninguém. Se você participar da classificação da comunidade, apenas seu nome de exibição e sequência atual se tornam visíveis para outros usuários — nada mais.",

    // Splash
    connecting: "Conectando…", connectingAccount: "Conectando à sua conta…",
    loadingHistory: "Carregando histórico de treinos…", loadingNutrition: "Carregando registro nutricional…",
    checkingLeaderboard: "Verificando classificação…",

    // Training Plan Builder
    trainingPlanBuilder: "Construtor de plano de treino", designYourProgram: "Projete seu programa perfeito",
    split: "Divisão", frequency: "Frequência", progression: "Progressão", review: "Revisão",
    chooseYourSplit: "Escolha sua divisão", chooseSplitDesc: "Escolha a divisão que se adapta aos seus objetivos e horário.",
    howManyDays: "Quantos dias por semana?", autoGenerate: "Vamos gerar automaticamente um programa",
    programForYou: "para você.", daysPerWeek: "dias / semana", yourWeek: "Sua semana",
    trainingStyle: "Estilo de treino", trainingStyleDesc: "Escolha como quer treinar. Vamos definir séries, repetições e descanso de acordo.",
    sessions: "SESSÕES", exercisesUpper: "EXERCÍCIOS", start: "Iniciar", generatePlan: "Gerar plano",
    continue: "Continuar", planSaved: "Plano salvo!", saveTrainingPlan: "Salvar plano de treino",
    pushPullLegs: "Empurrar / Puxar / Pernas", pushPullLegsDesc: "A divisão clássica do fisiculturismo. Treine cada grupo muscular duas vezes por semana com recuperação ideal.",
    upperLower: "Superior / Inferior", upperLowerDesc: "Divisão eficiente de 4 dias. Atinge cada grupo muscular duas vezes por semana com sessões compostas.",
    fullBodySplit: "Corpo inteiro", fullBodySplitDesc: "Treine tudo em cada sessão. Perfeito para agendas ocupadas e iniciantes.",
    bodybuilding: "Fisiculturismo", bodybuildingDesc: "Divisão clássica por grupos musculares. Isolamento máximo para cada grupo.",
    arnoldSplit: "Divisão Arnold", arnoldSplitDesc: "A lendária divisão de 6 dias. Peito/Costas, Ombros/Braços, Pernas — repetida duas vezes.",
    hypertrophy: "Hipertrofia", hypertrophyDesc: "8-12 repetições · 3-4 séries · 60-90s descanso",
    strengthProg: "Força", strengthProgDesc: "3-5 repetições · 5 séries · 3min descanso",
    power: "Potência", powerDesc: "1-3 repetições · 5 séries · 3-5min descanso",
    enduranceProg: "Resistência", enduranceProgDesc: "15-20 repetições · 3 séries · 45s descanso",
    pushDay: "Dia de empurrar", pullDay: "Dia de puxar", legDay: "Dia de pernas",
    upperBody: "Parte superior", lowerBody: "Parte inferior",
    chestTriceps: "Peito & tríceps", backBiceps: "Costas & bíceps", legsCore: "Pernas & core",
    shouldersArms: "Ombros & braços", chestBack: "Peito & costas", legsGlutes: "Pernas & glúteos",

    // Periodization
    periodization: "Periodização", trainingBlock: "Bloco de treino", weeks: "semanas",
    blockDesc: "Bloco", weekOf: "Semana", of: "de", repsLabel: "Rep", intensity: "Intensidade",
    setsLabel: "Séries", volume: "Volume", thisWeeksWorkouts: "Treinos desta semana",
    fullBlockOverview: "Visão geral do bloco completo", startDay: "Iniciar",
    hypertrophyBlock: "Hipertrofia", hypertrophyBlockDesc: "Construa tamanho muscular com peso moderado e volume maior",
    strengthPeak: "Pico de força", strengthPeakDesc: "Maximize adaptações neurais e potencial de 1RM",
    powerExplosive: "Potência & explosividade", powerExplosiveDesc: "Desenvolva velocidade de produção de força e potência atlética",
    muscularEndurance: "Resistência muscular", muscularEnduranceDesc: "Melhore capacidade de trabalho e tolerância ao lactato",
    pushPullLegsSplit: "Empurrar / Puxar / Pernas", pushPullLegsSplitDesc: "Divisão clássica de 3 dias",
    upperLowerSplit: "Superior / Inferior", upperLowerSplitDesc: "Divisão de frequência de 4 dias",
    fullBodySplit2: "Corpo inteiro", fullBodySplit2Desc: "3x por semana corpo inteiro",
    broSplit: "Divisão Bro", broSplitDesc: "Divisão de 5 dias por grupos musculares",

    // Recovery Analytics
    recoveryHrvTitle: "Recuperação & HRV", readinessScore: "Pontuação de prontidão", level: "Nível",
    suggestion: "Sugestão:", yourBioMetrics: "Suas biométricas",
    hrvLabel: "Variabilidade da frequência cardíaca (HRV)", restingHrLabel: "FC em repouso (bpm)",
    sleepLabel: "Sono (horas)", dailyActivityLabel: "Atividade diária (toneladas)",
    autoRecoveryMode: "Modo de recuperação automática", autoRecoveryDesc: "Ajusta automaticamente os treinos quando a prontidão está baixa.",
    hrvTrend: "Tendência HRV", hrv: "HRV", restHr: "FC repouso", sleepShort: "Sono",
    suggestedSession: "Sessão sugerida", startSuggestedWorkout: "Iniciar treino sugerido",
    takeRestDay: "Descanse um dia", takeRestDayDesc: "A prontidão está criticamente baixa. Mobilidade leve ou descanso completo fortemente recomendado.",
    recoverySession: "Sessão de recuperação", recoverySessionDesc: "A prontidão está diminuída. Escolha trabalho sub-máximo da parte inferior com cargas mais leves.",
    normalTraining: "Treino normal", normalTrainingDesc: "A prontidão está adequada. Siga a sessão planejada, mas mantenha o RPE sob controle.",
    goHard: "Vá com tudo!", goHardDesc: "A prontidão está alta. Condições perfeitas para tentar um recorde ou sessão de alta intensidade.",
    red: "Vermelho", yellow: "Amarelo", green: "Verde", peak: "Pico",

    // Voice Coach
    aiVoiceCoach: "Treinador de voz IA", liveAi: "AO VIVO · IA", aiCoachActive: "Treinador IA ativo",
    voiceCoachMuted: "Treinador de voz mudo", intentRecognition: "Reconhecimento de intenção · fale naturalmente",
    turnOnHandsFree: "Ative para treino mãos livres", listeningSayCommand: "Ouvindo... diga seu comando",
    tapToTryAgain: "Toque para tentar novamente", tapAndTalk: "Toque e fale com o treinador",
    lastCommand: "Último comando", quickCommands: "Comandos rápidos", testVoiceGuidance: "Testar guia de voz",
    coachConversation: "Conversa do treinador", aiCoach: "Treinador IA",
    welcomeVoiceCoach: "Olá! Sou seu treinador de voz IA do ForgeUp. Toque no microfone e ouvirei seus comandos.",
    voiceCoachHelp: "Você pode registrar pesos, cronometrar descansos, pedir dicas de forma, se motivar ou controlar seu treino.",
    welcomeSpeak: "Bem-vindo ao treinador de voz do ForgeUp. Diga um comando quando estiver pronto.",
    listening: "Ouvindo...", sorryCouldntHear: "Desculpe, não consegui ouvir. Tente novamente.",
    speechUnavailable: "Reconhecimento de fala indisponível. Tente Chrome ou Edge.",
    testVoiceHello: "Olá! Sou seu treinador de voz do Forge. Vamos arrasar neste treino juntos! Diga um comando a qualquer momento.",

    // Auth
    welcomeBack: "Bem-vindo de volta", createAccount: "Crie sua conta", resetPassword: "Redefinir senha",
    signInToSync: "Entre para sincronizar seus treinos, recordes e progresso com segurança.",
    dataEncrypted: "Seus dados são criptografados e armazenados com segurança na nuvem.",
    enterEmailReset: "Digite seu email e enviaremos um link de redefinição.",
    continueWithGoogle: "Continuar com Google", or: "ou", emailAddress: "Endereço de email",
    password: "Senha", confirmPassword: "Confirmar senha", passwordRequirements: "Requisitos de senha",
    chars8: "8+ caracteres", uppercaseLetter: "Letra maiúscula", lowercaseLetter: "Letra minúscula",
    number: "Número", specialCharacter: "Caractere especial", forgotPassword: "Esqueceu a senha?",
    signIn: "Entrar", createAccountBtn: "Criar conta", sendResetLink: "Enviar link de redefinição",
    dontHaveAccount: "Não tem uma conta?", alreadyHaveAccount: "Já tem uma conta?",
    rememberedPassword: "Lembrou sua senha?", signUp: "Cadastre-se", backToSignIn: "Voltar para entrar",
    dataProtected: "Seus dados são protegidos com criptografia de nível industrial. Histórico de treinos, registros de peso e recordes pessoais sincronizam com segurança na nuvem.",
    skipForNow: "Pular por agora",
    validEmail: "Por favor, insira um endereço de email válido.",
    passwordRequirementsError: "A senha deve atender a todos os requisitos de segurança.",
    passwordsDontMatch: "As senhas não coincidem.",
    resetEmailSent: "Email de redefinição enviado! Verifique sua caixa de entrada.",
    googleNotConfigured: "Google Sign-In não está configurado. Adicione sua configuração Firebase em src/firebase.js",
    authNotConfigured: "A autenticação não está configurada. Adicione sua configuração Firebase em src/firebase.js",
    resetNotConfigured: "A redefinição de senha não está configurada. Adicione sua configuração Firebase em src/firebase.js",

    // Social Feed
    community: "Comunidade", signInToStart: "Entre para começar", feed: "Feed",
    shareYourWorkout: "Compartilhe seu treino", noPostsYet: "Nenhuma publicação ainda",
    noPostsDesc: "Quando usuários reais compartilharem treinos, eles aparecerão aqui. Configure Firebase em src/firebase.js e complete um treino para ser o primeiro!",
    justNow: "Agora mesmo", kudos: "elogios", comment: "Comentário", noCommentsYet: "Nenhum comentário — seja o primeiro!",
    writeComment: "Escreva um comentário...", signInToComment: "Entre para comentar",
    joinChallenges: "Participe de desafios em grupo e mantenha-se responsável com sua comunidade fitness.",
    noActiveChallenges: "Nenhum desafio ativo",
    noActiveChallengesDesc: "Desafios criados por usuários reais aparecerão aqui após a configuração do Firebase.",
    participants: "participantes", dayOf: "Dia", of: "de", joined: "Participando", joinChallenge: "Participar do desafio",
    weeklyVolumeLeaderboard: "Classificação semanal de volume levantado. Apenas usuários reais que participam aparecem — sem entradas falsas.",
    leaderboardEmpty: "Classificação vazia",
    leaderboardEmptyDesc: "Usuários reais que participam da classificação pelo Perfil aparecerão aqui.",
    connectivityLoading: "A conectividade ainda está carregando. Tente novamente em um momento.",
    firebaseNeeded: "Os recursos da comunidade precisam do Firebase. Configure-o em src/firebase.js para ver publicações reais de usuários reais.",
    socialUnavailable: "Os recursos sociais não estão disponíveis até que o Firebase seja configurado com credenciais reais em src/firebase.js.",
    completedWorkout: "Concluído",
    aWorkout: "um treino",
    workoutSummaryCopied: "Resumo do treino copiado para a área de transferência! Cole em qualquer lugar para compartilhar.",
    forgeUpWorkout: "Treino ForgeUp",
    recoveryMobilityFlow: "Fluxo de mobilidade de recuperação",
    workout: "Treino",
  },
};

/* ---------------- CONTEXT ---------------- */
export const LangContext = createContext({ lang: "en", t: (k) => T.en[k] || k });
export const useLang = () => useContext(LangContext);