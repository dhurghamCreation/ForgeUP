// ============================================================================
// ForgeUp — Auth & Data Layer
// ============================================================================
// This file provides a FULLY FUNCTIONAL local auth + data engine that works
// 100% free with NO API keys required. Users can sign up / log in with email
// & password, and their data persists in the browser (SHA-256 hashed).
//
// If you later add your Firebase project config below, the app automatically
// upgrades to cloud sync — accounts, workouts, feed, comments, and the
// leaderboard are then shared across all devices and users.
// ============================================================================

import { initializeApp } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore, doc, setDoc, getDoc, collection, query, orderBy, limit,
  onSnapshot, arrayUnion, arrayRemove, updateDoc, serverTimestamp, getDocs,
} from "firebase/firestore";

// ---------------------------------------------------------------------------
// FIREBASE CONFIG — OPTIONAL. Leave as placeholders to use local mode.
// To enable cloud sync, paste your real config from console.firebase.google.com
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured =
  firebaseConfig.apiKey !== "AIzaSyCJM38Fv4c7mpkO0aRLOfg4KC4v4wwNpOE" &&
  firebaseConfig.projectId !== "forgeup-fe66c";

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (e) {
    console.warn("Firebase initialization failed:", e.message);
    app = null; auth = null; db = null; googleProvider = null;
  }
}

// ============================================================================
// LOCAL AUTH & DATA ENGINE — works with zero configuration, zero cost
// ============================================================================

const LS_ACCOUNTS = "forgeup-accounts";
const LS_SESSION = "forgeup-session";
const LS_DATA_PREFIX = "forgeup-data-";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

// SHA-256 password hashing using the browser's built-in Web Crypto API
async function hashPassword(password) {
  try {
    const salt = "forgeup::salt::" + password.length + "::v1";
    const data = new TextEncoder().encode(password + salt);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (e) {
    // Fallback for older browsers
    let h = 5381;
    for (let i = 0; i < password.length; i++) {
      h = ((h << 5) + h) ^ password.charCodeAt(i);
    }
    return "f" + (h >>> 0).toString(36);
  }
}

function emailKey(email) {
  return email.toLowerCase().trim();
}

function makeLocalUser(email) {
  const em = emailKey(email);
  return {
    uid: "local_" + em.replace(/[^a-z0-9]/g, "_"),
    email: em,
    displayName: em.split("@")[0],
    isLocal: true,
    createdAt: Date.now(),
  };
}

function saveLocalSession(user) {
  writeJSON(LS_SESSION, user);
}

function getLocalSession() {
  return readJSON(LS_SESSION, null);
}

function clearLocalSession() {
  try {
    localStorage.removeItem(LS_SESSION);
  } catch (e) {}
}

// ---------------------------------------------------------------------------
// AUTH HELPERS — fully functional with local accounts (no API key needed)
// ---------------------------------------------------------------------------

export const signInWithEmail = async (email, password) => {
  // Firebase path (if configured)
  if (auth) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  // LOCAL path — works instantly, free, no API key
  const em = emailKey(email);
  const accounts = readJSON(LS_ACCOUNTS, {});
  const record = accounts[em];
  if (!record) {
    return { user: null, error: "No account found with this email. Please create an account first." };
  }
  const hash = await hashPassword(password);
  if (record.passwordHash !== hash) {
    return { user: null, error: "Incorrect password. Please try again." };
  }
  const user = makeLocalUser(em);
  saveLocalSession(user);
  return { user, error: null };
};

export const signUpWithEmail = async (email, password) => {
  // Firebase path
  if (auth) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  // LOCAL path
  const em = emailKey(email);
  const accounts = readJSON(LS_ACCOUNTS, {});
  if (accounts[em]) {
    return { user: null, error: "An account with this email already exists. Try signing in instead." };
  }
  const passwordHash = await hashPassword(password);
  accounts[em] = { email: em, passwordHash, createdAt: Date.now() };
  writeJSON(LS_ACCOUNTS, accounts);
  const user = makeLocalUser(em);
  saveLocalSession(user);
  return { user, error: null };
};

export const signInWithGoogle = async () => {
  if (auth) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }
  // Google popup requires Firebase — explain clearly, user can still use email/password
  return {
    user: null,
    error: "Google Sign-In requires Firebase configuration. You can still create an account with email & password — it works instantly with no setup.",
  };
};

export const resetPassword = async (email) => {
  if (auth) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Local mode: check if account exists, provide a simple demo response
  const em = emailKey(email);
  const accounts = readJSON(LS_ACCOUNTS, {});
  if (!accounts[em]) {
    return { success: false, error: "No account found with this email address." };
  }
  return { success: true, error: null };
};

export const signOutUser = async () => {
  if (auth) {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  clearLocalSession();
  return { success: true, error: null };
};

export const onAuthChange = (callback) => {
  if (auth) {
    return onAuthStateChanged(auth, callback);
  }
  // LOCAL path — restore the persisted session and listen for cross-tab sync
  const restore = () => {
    callback(getLocalSession());
  };
  restore();
  window.addEventListener("storage", restore);
  return () => window.removeEventListener("storage", restore);
};

// ---------------------------------------------------------------------------
// USER DATA HELPERS — local storage when Firebase is not configured
// ---------------------------------------------------------------------------

export const saveUserData = async (userId, data) => {
  if (db) {
    try {
      await setDoc(doc(db, "users", userId), {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  writeJSON(LS_DATA_PREFIX + userId, data);
  return { success: true, error: null };
};

export const getUserData = async (userId) => {
  if (db) {
    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) {
        return { data: docSnap.data(), error: null };
      }
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
  const data = readJSON(LS_DATA_PREFIX + userId, null);
  return data ? { data, error: null } : { data: null, error: null };
};

export const saveWorkout = async (userId, workout) => {
  if (db) {
    try {
      const workoutRef = doc(db, "users", userId, "workouts", workout.id);
      await setDoc(workoutRef, { ...workout, timestamp: serverTimestamp() });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const key = LS_DATA_PREFIX + userId + "_workouts";
  const workouts = readJSON(key, []);
  workouts.unshift({ ...workout, timestamp: Date.now() });
  writeJSON(key, workouts.slice(0, 100));
  return { success: true, error: null };
};

export const getWorkouts = async (userId) => {
  if (db) {
    try {
      const q = query(collection(db, "users", userId, "workouts"), orderBy("timestamp", "desc"), limit(100));
      const querySnapshot = await getDocs(q);
      const workouts = [];
      querySnapshot.forEach((doc) => workouts.push({ id: doc.id, ...doc.data() }));
      return { workouts, error: null };
    } catch (error) {
      return { workouts: [], error: error.message };
    }
  }
  return { workouts: readJSON(LS_DATA_PREFIX + userId + "_workouts", []), error: null };
};

export const saveBodyLog = async (userId, log) => {
  if (db) {
    try {
      const logRef = doc(db, "users", userId, "bodyLogs", log.id);
      await setDoc(logRef, { ...log, timestamp: serverTimestamp() });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const key = LS_DATA_PREFIX + userId + "_bodyLogs";
  const logs = readJSON(key, []);
  logs.unshift({ ...log, timestamp: Date.now() });
  writeJSON(key, logs.slice(0, 100));
  return { success: true, error: null };
};

export const getBodyLogs = async (userId) => {
  if (db) {
    try {
      const q = query(collection(db, "users", userId, "bodyLogs"), orderBy("timestamp", "desc"), limit(100));
      const querySnapshot = await getDocs(q);
      const logs = [];
      querySnapshot.forEach((doc) => logs.push({ id: doc.id, ...doc.data() }));
      return { logs, error: null };
    } catch (error) {
      return { logs: [], error: error.message };
    }
  }
  return { logs: readJSON(LS_DATA_PREFIX + userId + "_bodyLogs", []), error: null };
};

export const savePR = async (userId, exerciseId, pr) => {
  if (db) {
    try {
      const prRef = doc(db, "users", userId, "prs", exerciseId);
      await setDoc(prRef, { ...pr, timestamp: serverTimestamp() }, { merge: true });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const key = LS_DATA_PREFIX + userId + "_prs";
  const prs = readJSON(key, {});
  prs[exerciseId] = { ...pr, timestamp: Date.now() };
  writeJSON(key, prs);
  return { success: true, error: null };
};

export const getPRs = async (userId) => {
  if (db) {
    try {
      const q = query(collection(db, "users", userId, "prs"));
      const querySnapshot = await getDocs(q);
      const prs = {};
      querySnapshot.forEach((doc) => { prs[doc.id] = doc.data(); });
      return { prs, error: null };
    } catch (error) {
      return { prs: {}, error: error.message };
    }
  }
  return { prs: readJSON(LS_DATA_PREFIX + userId + "_prs", {}), error: null };
};

// ---------------------------------------------------------------------------
// SOCIAL FEATURES — fully functional locally, shared via Firebase when set up
// ---------------------------------------------------------------------------

export const postToFeed = async (userId, username, post) => {
  if (db) {
    try {
      const postRef = doc(collection(db, "feed"));
      await setDoc(postRef, {
        ...post, userId, username, timestamp: serverTimestamp(),
        kudos: [], kudosCount: 0,
      });
      return { success: true, error: null, id: postRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const posts = readJSON(LS_DATA_PREFIX + "feed", []);
  const id = "local-post-" + Date.now();
  posts.unshift({
    id, userId, username, ...post,
    time: "Just now",
    kudos: [], kudosCount: 0, commentCount: 0,
    createdAt: Date.now(),
  });
  writeJSON(LS_DATA_PREFIX + "feed", posts.slice(0, 50));
  return { success: true, error: null, id };
};

export const getFeed = (callback) => {
  if (db) {
    const q = query(collection(db, "feed"), orderBy("timestamp", "desc"), limit(50));
    return onSnapshot(q, (snapshot) => {
      const posts = [];
      snapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
      callback(posts);
    });
  }
  // Local mode
  const posts = readJSON(LS_DATA_PREFIX + "feed", []);
  callback(posts);
  return () => {};
};

export const addKudos = async (postId, userId) => {
  if (db) {
    try {
      const postRef = doc(db, "feed", postId);
      const snap = await getDoc(postRef);
      const currentCount = snap.data()?.kudosCount || 0;
      await updateDoc(postRef, { kudos: arrayUnion(userId), kudosCount: currentCount + 1 });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const posts = readJSON(LS_DATA_PREFIX + "feed", []);
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx !== -1) {
    if (!(posts[idx].kudos || []).includes(userId)) {
      posts[idx].kudos = [...(posts[idx].kudos || []), userId];
      posts[idx].kudosCount = (posts[idx].kudosCount || 0) + 1;
      writeJSON(LS_DATA_PREFIX + "feed", posts);
    }
  }
  return { success: true, error: null };
};

export const removeKudos = async (postId, userId) => {
  if (db) {
    try {
      const postRef = doc(db, "feed", postId);
      const snap = await getDoc(postRef);
      const currentCount = snap.data()?.kudosCount || 0;
      await updateDoc(postRef, { kudos: arrayRemove(userId), kudosCount: Math.max(0, currentCount - 1) });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const posts = readJSON(LS_DATA_PREFIX + "feed", []);
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx !== -1) {
    posts[idx].kudos = (posts[idx].kudos || []).filter((u) => u !== userId);
    posts[idx].kudosCount = Math.max(0, (posts[idx].kudosCount || 0) - 1);
    writeJSON(LS_DATA_PREFIX + "feed", posts);
  }
  return { success: true, error: null };
};

/* ---------- Comments ---------- */

export const addComment = async (postId, userId, username, text) => {
  if (db) {
    try {
      const commentRef = doc(collection(db, "feed", postId, "comments"));
      await setDoc(commentRef, { userId, username, text, timestamp: serverTimestamp() });
      const postRef = doc(db, "feed", postId);
      const snap = await getDoc(postRef);
      const currentCount = snap.data()?.commentCount || 0;
      await updateDoc(postRef, { commentCount: currentCount + 1 });
      return { success: true, error: null, id: commentRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const comments = readJSON(LS_DATA_PREFIX + "comments_" + postId, []);
  const id = "local-comment-" + Date.now();
  comments.push({ id, userId, username, text, createdAt: Date.now() });
  writeJSON(LS_DATA_PREFIX + "comments_" + postId, comments);

  // Bump comment count on the post
  const posts = readJSON(LS_DATA_PREFIX + "feed", []);
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx !== -1) {
    posts[idx].commentCount = (posts[idx].commentCount || 0) + 1;
    writeJSON(LS_DATA_PREFIX + "feed", posts);
  }
  return { success: true, error: null, id };
};

export const getComments = (postId, callback) => {
  if (db) {
    const q = query(collection(db, "feed", postId, "comments"), orderBy("timestamp", "asc"), limit(100));
    return onSnapshot(q, (snapshot) => {
      const comments = [];
      snapshot.forEach((doc) => comments.push({ id: doc.id, ...doc.data() }));
      callback(comments);
    });
  }
  const comments = readJSON(LS_DATA_PREFIX + "comments_" + postId, []);
  callback(comments);
  return () => {};
};

/* ---------- Challenges ---------- */

export const createChallenge = async (challenge) => {
  if (db) {
    try {
      const challengeRef = doc(collection(db, "challenges"));
      await setDoc(challengeRef, {
        ...challenge, timestamp: serverTimestamp(),
        participants: [], participantCount: 0,
      });
      return { success: true, error: null, id: challengeRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const challenges = readJSON(LS_DATA_PREFIX + "challenges", []);
  const id = "local-challenge-" + Date.now();
  challenges.unshift({
    ...challenge, id,
    participants: [], participantCount: 0, createdAt: Date.now(),
  });
  writeJSON(LS_DATA_PREFIX + "challenges", challenges);
  return { success: true, error: null, id };
};

export const getChallenges = (callback) => {
  if (db) {
    const q = query(collection(db, "challenges"), orderBy("timestamp", "desc"), limit(20));
    return onSnapshot(q, (snapshot) => {
      const challenges = [];
      snapshot.forEach((doc) => challenges.push({ id: doc.id, ...doc.data() }));
      callback(challenges);
    });
  }
  callback(readJSON(LS_DATA_PREFIX + "challenges", []));
  return () => {};
};

export const joinChallenge = async (challengeId, userId, username) => {
  if (db) {
    try {
      const challengeRef = doc(db, "challenges", challengeId);
      const snap = await getDoc(challengeRef);
      const currentCount = snap.data()?.participantCount || 0;
      await updateDoc(challengeRef, {
        participants: arrayUnion({ userId, username }),
        participantCount: currentCount + 1,
      });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const challenges = readJSON(LS_DATA_PREFIX + "challenges", []);
  const idx = challenges.findIndex((c) => c.id === challengeId);
  if (idx !== -1) {
    if (!(challenges[idx].participants || []).some((p) => p.userId === userId)) {
      challenges[idx].participants = [...(challenges[idx].participants || []), { userId, username }];
      challenges[idx].participantCount = (challenges[idx].participantCount || 0) + 1;
      writeJSON(LS_DATA_PREFIX + "challenges", challenges);
    }
  }
  return { success: true, error: null };
};

/* ---------- Leaderboard (real users only) ---------- */

export const getLeaderboard = (callback) => {
  if (db) {
    const q = query(collection(db, "users"), orderBy("weeklyVolume", "desc"), limit(20));
    return onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.profile?.leaderboardOptIn || data.leaderboardOptIn) {
          users.push({ id: doc.id, ...data });
        }
      });
      callback(users);
    });
  }
  // Local leaderboard = all local users who opted in
  const accounts = readJSON(LS_ACCOUNTS, {});
  const entries = [];
  for (const em of Object.keys(accounts)) {
    const data = readJSON(LS_DATA_PREFIX + "local_" + em.replace(/[^a-z0-9]/g, "_"), null);
    if (data && (data.profile?.leaderboardOptIn || data.leaderboardOptIn)) {
      entries.push({
        username: data.profile?.username || em.split("@")[0],
        weeklyVolume: data.weeklyVolume || 0,
        streak: data.profile?.streak || 0,
      });
    }
  }
  entries.sort((a, b) => b.weeklyVolume - a.weeklyVolume);
  callback(entries.slice(0, 20));
  return () => {};
};

export { auth, db, googleProvider };