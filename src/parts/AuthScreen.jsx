import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Shield, Check, X, Loader } from "lucide-react";
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

export default function AuthScreen({ onAuthSuccess, onSkip }) {
  const { t } = useLang();
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const validatePassword = (pwd) => {
    const checks = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
    return checks;
  };

  const passwordChecks = validatePassword(password);
  const allChecksPass = Object.values(passwordChecks).every(Boolean);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { signInWithGoogle } = await import("../firebase");
      const { user, error: err } = await signInWithGoogle();
      if (err) {
        setError(err);
      } else if (user) {
        onAuthSuccess(user);
      }
    } catch (e) {
      setError(t("googleNotConfigured"));
    }
    setLoading(false);
  };

  const handleEmailAuth = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !email.includes("@")) {
      setError(t("validEmail"));
      return;
    }

    if (mode === "signup") {
      if (!allChecksPass) {
        setError(t("passwordRequirementsError"));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("passwordsDontMatch"));
        return;
      }
    }

    if (mode === "forgot") {
      setLoading(true);
      try {
        const { resetPassword } = await import("../firebase");
        const { success: ok, error: err } = await resetPassword(email);
        if (ok) {
          setSuccess(t("resetEmailSent"));
          setTimeout(() => setMode("login"), 3000);
        } else {
          setError(err);
        }
      } catch (e) {
        setError(t("resetNotConfigured"));
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { signInWithEmail, signUpWithEmail } = await import("../firebase");
      const fn = mode === "login" ? signInWithEmail : signUpWithEmail;
      const { user, error: err } = await fn(email, password);
      if (err) {
        setError(err);
      } else if (user) {
        onAuthSuccess(user);
      }
    } catch (e) {
      setError(t("authNotConfigured"));
    }
    setLoading(false);
  };

  const PasswordCheck = ({ label, passed }) => (
    <div className="flex items-center gap-1.5" style={{ fontFamily: FONT_BODY, fontSize: 11, color: passed ? C.cool : C.low }}>
      {passed ? <Check size={12} color={C.cool} /> : <X size={12} color={C.low} />}
      {label}
    </div>
  );


  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <Logo size={36} />
        <button onClick={onSkip} style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12.5 }} className="flex items-center gap-1 hover-pop">
          {t("skipForNow")}
        </button>
      </div>

      <div className="px-5 flex-1 overflow-y-auto pb-28">
        <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 24, fontWeight: 700 }}>
          {mode === "login" ? t("welcomeBack") : mode === "signup" ? t("createAccount") : t("resetPassword")}
        </h1>
        <p style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 13 }} className="mt-1.5">
          {mode === "login"
            ? t("signInToSync")
            : mode === "signup"
            ? t("dataEncrypted")
            : t("enterEmailReset")}
        </p>

        {/* Google Sign-In - always visible and clickable */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            background: C.surface,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            color: C.hi,
            opacity: loading ? 0.6 : 1,
          }}
          className="w-full flex items-center justify-center gap-3 py-3.5 mt-6 hover-lift"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {t("continueWithGoogle")}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div style={{ flex: 1, height: 1, background: C.line }} />
          <span style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }}>{t("or")}</span>
          <div style={{ flex: 1, height: 1, background: C.line }} />
        </div>

        {/* Email input */}
        <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center gap-2 px-3 py-3 mb-3 hover-lift">
          <Mail size={16} color={C.low} />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailAddress")}
            type="email"
            style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, background: "transparent", outline: "none", width: "100%" }}
          />
        </div>

        {/* Password input (not for forgot mode) */}
        {mode !== "forgot" && (
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center gap-2 px-3 py-3 mb-3 hover-lift">
            <Lock size={16} color={C.low} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
              type={showPassword ? "text" : "password"}
              style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, background: "transparent", outline: "none", width: "100%" }}
            />
            <button onClick={() => setShowPassword(!showPassword)} className="hover-pop">
              {showPassword ? <EyeOff size={16} color={C.low} /> : <Eye size={16} color={C.low} />}
            </button>
          </div>
        )}

        {/* Confirm password for signup */}
        {mode === "signup" && (
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center gap-2 px-3 py-3 mb-3 hover-lift">
            <Lock size={16} color={C.low} />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("confirmPassword")}
              type={showPassword ? "text" : "password"}
              style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 14, background: "transparent", outline: "none", width: "100%" }}
            />
          </div>
        )}

        {/* Password strength requirements for signup */}
        {mode === "signup" && (
          <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 12 }} className="p-3 mb-3">
            <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11, fontWeight: 600 }} className="mb-2 uppercase tracking-wide">{t("passwordRequirements")}</div>
            <div className="grid grid-cols-2 gap-1.5">
              <PasswordCheck label={t("chars8")} passed={passwordChecks.length} />
              <PasswordCheck label={t("uppercaseLetter")} passed={passwordChecks.upper} />
              <PasswordCheck label={t("lowercaseLetter")} passed={passwordChecks.lower} />
              <PasswordCheck label={t("number")} passed={passwordChecks.number} />
              <PasswordCheck label={t("specialCharacter")} passed={passwordChecks.special} />
            </div>
          </div>
        )}

        {/* Error / Success messages */}
        {error && (
          <div style={{ background: `${C.warm}15`, border: `1px solid ${C.warm}40`, borderRadius: 10 }} className="p-3 mb-3">
            <span style={{ fontFamily: FONT_BODY, color: C.warm, fontSize: 12 }}>{error}</span>
          </div>
        )}
        {success && (
          <div style={{ background: `${C.cool}15`, border: `1px solid ${C.cool}40`, borderRadius: 10 }} className="p-3 mb-3">
            <span style={{ fontFamily: FONT_BODY, color: C.cool, fontSize: 12 }}>{success}</span>
          </div>
        )}

        {/* Forgot password link */}
        {mode === "login" && (
          <button
            onClick={() => { setMode("forgot"); setError(null); }}
            style={{ fontFamily: FONT_BODY, color: C.accent, fontSize: 12.5 }}
            className="mb-4 hover-pop"
          >
            {t("forgotPassword")}
          </button>
        )}

        {/* Submit button */}
        <button
          onClick={handleEmailAuth}
          disabled={loading}
          style={{
            background: loading ? C.line : C.accent,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            color: loading ? C.low : C.bg,
          }}
          className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm hover-glow"
        >
          {loading ? <Loader size={16} className="animate-spin" /> : null}
          {mode === "login" ? t("signIn") : mode === "signup" ? t("createAccountBtn") : t("sendResetLink")}
        </button>

        {/* Switch mode */}
        <div className="text-center mt-4">
          <span style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12.5 }}>
            {mode === "login" ? t("dontHaveAccount") : mode === "signup" ? t("alreadyHaveAccount") : t("rememberedPassword")}
          </span>
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setSuccess(null); }}
            style={{ fontFamily: FONT_BODY, color: C.accent, fontSize: 12.5, fontWeight: 600 }}
            className="hover-pop"
          >
            {mode === "login" ? t("signUp") : mode === "signup" ? t("signIn") : t("backToSignIn")}
          </button>
        </div>

        {/* Security note */}
        <div style={{ background: `${C.cool}10`, border: `1px solid ${C.cool}30`, borderRadius: 12 }} className="p-3 mt-6 flex items-start gap-2">
          <Shield size={14} color={C.cool} className="mt-0.5 flex-shrink-0" />
          <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 11, lineHeight: 1.6 }}>
            {t("dataProtected")}
          </div>
        </div>
      </div>
    </div>
  );
}