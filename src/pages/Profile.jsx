const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { User, Flame, Zap, BookOpen, Trophy, LogOut, Pencil, Check, X } from "lucide-react";
import EconBuddy from "../components/EconBuddy";
import { Link } from "react-router-dom";

import { getAllLessons } from "../lib/lessonData";
import { getUsername, setUsername } from "../lib/usernameStore";
import Filter from "bad-words";
import BadgeGrid from "../components/profile/BadgeGrid";
import BadgeToast from "../components/profile/BadgeToast";
import { checkNewBadges, buildBadgeUpdate } from "../lib/badges";
import { updateProgress } from "../lib/progressUtils";

const filter = new Filter();

export default function Profile() {
  const { progress, setProgress } = useOutletContext();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [displayName, setDisplayName] = useState(() => getUsername());
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [currentToast, setCurrentToast] = useState(null);

 useEffect(() => {
  import('../lib/supabaseClient').then(({ supabase }) => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user)).catch(() => {});
  });
}, []);

  // Check badges on mount
  useEffect(() => {
    if (!progress) return;
    const newBadges = checkNewBadges(progress);
    if (!newBadges.length) return;
    const update = buildBadgeUpdate(progress, newBadges);
    updateProgress(progress, update).then(() => {
      setProgress({ ...progress, ...update });
    });
    setBadgeQueue(newBadges);
  }, []);

  // Drain toast queue one by one
  useEffect(() => {
    if (!currentToast && badgeQueue.length > 0) {
      setCurrentToast(badgeQueue[0]);
      setBadgeQueue(q => q.slice(1));
    }
  }, [currentToast, badgeQueue]);

  // Keep in sync if another tab changes it
  useEffect(() => {
    const handler = (e) => setDisplayName(e.detail);
    window.addEventListener("username-changed", handler);
    return () => window.removeEventListener("username-changed", handler);
  }, []);

  const resolvedName = displayName || user?.full_name || "Learner";

  function startEditing() {
    setDraft(resolvedName);
    setNameError("");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setNameError("");
  }

  function confirmEdit() {
    const trimmed = draft.trim();
    if (trimmed.length < 3) {
      setNameError("Username must be at least 3 characters.");
      return;
    }
    if (trimmed.length > 20) {
      setNameError("Username must be 20 characters or fewer.");
      return;
    }
    if (filter.isProfane(trimmed)) {
      setNameError("That username is not allowed. Try another.");
      return;
    }
    setUsername(trimmed);
    setDisplayName(trimmed);
    setEditing(false);
    setNameError("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") confirmEdit();
    if (e.key === "Escape") cancelEditing();
  }

  const allLessons = getAllLessons();
  const completedCount = (progress.completed_lessons || []).length;
  const totalLessons = allLessons.length;
  const completionPercent = Math.round((completedCount / totalLessons) * 100);

  const stats = [
    { icon: Zap, label: "Total XP", value: progress.xp, color: "text-accent", bg: "bg-accent/10" },
    { icon: Flame, label: "Day Streak", value: progress.streak, color: "text-orange-500", bg: "bg-orange-50" },
    { icon: BookOpen, label: "Lessons Done", value: completedCount, color: "text-primary", bg: "bg-primary/10" },
    { icon: Trophy, label: "Level", value: progress.level, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <BadgeToast badge={currentToast} onDone={() => setCurrentToast(null)} />
      {/* Profile header */}
      <div className="flex flex-col items-center mb-8">
        <Link to="/mascot" className="mb-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 12px rgba(0,242,255,0.4))" }}
          >
            <EconBuddy config={progress.avatar_config || {}} size={90} />
          </motion.div>
        </Link>

        {/* Editable username */}
        {editing ? (
          <div className="flex flex-col items-center gap-1 w-full max-w-xs">
            <div className="flex items-center gap-2 w-full">
              <input
                autoFocus
                value={draft}
                onChange={e => {
                  if (e.target.value.length <= 20) setDraft(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                maxLength={20}
                className="flex-1 text-center text-lg font-extrabold bg-card border-2 border-primary rounded-xl px-3 py-1.5 text-foreground outline-none"
                placeholder="Your username"
              />
              <button onClick={confirmEdit} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </button>
              <button onClick={cancelEditing} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={3} />
              </button>
            </div>
            <div className="flex items-center justify-between w-full px-1">
              {nameError
                ? <p className="text-xs text-destructive">{nameError}</p>
                : <span />
              }
              <p className="text-xs text-muted-foreground ml-auto">{draft.length}/20</p>
            </div>
          </div>
        ) : (
          <button onClick={startEditing} className="flex items-center gap-1.5 group">
            <h1 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
              {resolvedName}
            </h1>
            <Pencil className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        )}

        <p className="text-sm text-muted-foreground mt-0.5">{user?.email || ""}</p>
        {/* Hyperdrive Badge */}
        {progress?.hyperdrive_equipped && (
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-black"
            style={{ background: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.3)", color: "#2ECC71" }}
          >
            🚀 Hyperdrive Badge
          </motion.div>
        )}

        {/* Interest Account indicator */}
        {progress?.interest_account_active && (
          <div className="flex items-center gap-1 mt-1 text-xs font-bold"
            style={{ color: "#3B82F6" }}>
            🏦 Interest Account Active — +5💎/day
          </div>
        )}

        <Link to="/mascot" className="mt-1 text-xs font-bold" style={{ color: "#00F2FF" }}>✏️ Customize EconBuddy</Link>
      </div>

      {/* Progress ring */}
      <div className="bg-card rounded-xl border-2 border-border p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-foreground">Course Progress</span>
          <span className="text-sm font-bold text-primary">{completionPercent}%</span>
        </div>
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {completedCount} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-card rounded-xl border-2 border-border p-4 flex flex-col items-center gap-2">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <span className="text-2xl font-extrabold text-foreground">{value}</span>
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <BadgeGrid progress={progress} />

      {/* Login / Logout */}
      {user ? (
        <button
          onClick={async () => { const { supabase } = await import('../lib/supabaseClient'); await supabase.auth.signOut(); window.location.href = window.location.origin; }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-border
            text-muted-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      ) : (
        // Guest mode — show exit guest option
        <button
          onClick={() => { sessionStorage.removeItem("econbuddy_guest_active"); window.location.href = window.location.origin; }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-border
            text-muted-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Exit Guest Mode
        </button>
      )}
    </div>
  );
}