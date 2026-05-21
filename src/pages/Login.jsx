import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock } from "lucide-react";
import EconBuddy from "../components/EconBuddy";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login({ onBack }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleEmailAuth() {
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    setError("");
    setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: "https://econflowofficial.netlify.app" }
      });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    }
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://econflowofficial.netlify.app" }
    });
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(160deg, #0A0E17 0%, #0d1b2a 60%, #0a1628 100%)" }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-5 z-10">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 24px rgba(0,242,255,0.5))" }}
        >
          <EconBuddy config={{ helmet: "basic", eyes: "cyan", outfit: "midnight", accessory: "none" }} size={80} />
        </motion.div>

        <h1 className="text-2xl font-black" style={{ color: "#00F2FF" }}>
          {mode === "login" ? "Welcome Back!" : "Create Account"}
        </h1>

        <div className="w-full flex flex-col gap-3">
          {/* Google */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogle}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: "#fff", color: "#3c4043" }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full py-3.5 pl-9 pr-4 rounded-2xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.18)", color: "#fff" }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
              className="w-full py-3.5 pl-9 pr-4 rounded-2xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.18)", color: "#fff" }}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          {message && <p className="text-green-400 text-xs text-center">{message}</p>}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleEmailAuth}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, hsl(145 70% 48%), hsl(145 70% 35%))",
              color: "#fff",
              opacity: loading ? 0.7 : 1
            }}
          >
            {mode === "login" ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
          </motion.button>

          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
            className="text-xs text-center"
            style={{ color: "rgba(0,242,255,0.6)" }}
          >
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>

          <button
            onClick={onBack}
            className="text-xs text-center"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}