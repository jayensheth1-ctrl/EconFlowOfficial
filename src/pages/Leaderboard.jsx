import { useState, useEffect } from "react";
import { Trophy, Medal, Flame, UserX, WifiOff } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { isGuestMode, getGuestProgress } from "../lib/guestProgress";
import { getUsername } from "../lib/usernameStore";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myEmail, setMyEmail] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const guestMode = isGuestMode();
  const guestProgress = guestMode ? getGuestProgress() : null;

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setMyEmail(user?.email ?? null);

      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .order("xp", { ascending: false })
        .limit(20);

      if (error) throw error;
      setUsers(data || []);
      setNetworkError(false);
    } catch {
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  }

  if (!loading && networkError) {
    const g = guestProgress;
    return (
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <WifiOff className="w-5 h-5" />
          <p className="text-sm font-semibold">Can't reach the server right now</p>
        </div>
        {g ? (
          <div className="w-full rounded-2xl p-6 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(79,0,180,0.12))",
              border: "2px solid rgba(147,51,234,0.45)",
              boxShadow: "0 0 40px rgba(147,51,234,0.2)",
            }}>
            <div className="text-5xl mb-3">🏆</div>
            <p className="text-2xl font-extrabold text-foreground mb-4">{g.guestName ?? "You (Guest)"}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "XP", value: g.xp ?? 0, emoji: "⭐" },
                { label: "Gems", value: g.gems ?? 0, emoji: "💎" },
                { label: "Streak", value: g.streak ?? 0, emoji: "🔥" },
              ].map(s => (
                <div key={s.label} className="rounded-xl py-3"
                  style={{ background: "rgba(147,51,234,0.12)", border: "1px solid rgba(147,51,234,0.25)" }}>
                  <p className="text-xl font-black text-foreground">{s.emoji} {s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No local data available. Try again later.</p>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const guestXp = guestProgress?.xp ?? 0;
  const guestLocalRank = guestMode && guestProgress
    ? users.filter(u => (u.xp ?? 0) > guestXp).length + 1
    : null;

  const guestRow = guestMode && guestProgress ? {
    id: "guest-local",
    email: guestProgress.guestName ?? "You (Guest)",
    xp: guestXp,
    streak: guestProgress.streak ?? 0,
    isGuest: true,
    localRank: guestLocalRank,
  } : null;

  const displayList = guestRow ? [...users, guestRow] : users;

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-9 h-9 text-accent" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Top learners this week</p>
      </div>

      {guestMode && (
        <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.25)" }}>
          <UserX className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#C084FC" }} />
          <p className="text-xs leading-relaxed" style={{ color: "rgba(192,132,252,0.85)" }}>
            You are viewing global leaders in Guest Mode. <strong>Sign in to post your score!</strong>
          </p>
        </div>
      )}

      <ol className="flex flex-col gap-2.5">
        {displayList.map((user, i) => {
          const rank = i + 1;
          const isGuest = !!user.isGuest;
          const isMe = !isGuest && myEmail && user.email === myEmail;
          const savedUsername = getUsername();
          const name = isGuest
            ? (user.email ?? "You (Guest)")
            : (isMe && savedUsername)
              ? savedUsername
              : (user.full_name || user.email?.split("@")[0] || `Learner ${rank}`);

          const rowStyle = isGuest
            ? { borderColor: "rgba(147,51,234,0.5)", background: "rgba(147,51,234,0.08)", borderStyle: "dashed" }
            : i === 0
            ? { borderColor: "hsl(var(--accent))", background: "hsl(var(--accent) / 0.08)" }
            : i === 1
            ? { borderColor: "rgba(160,160,180,0.5)", background: "hsl(var(--card))" }
            : i === 2
            ? { borderColor: "rgba(180,100,20,0.45)", background: "hsl(var(--card))" }
            : { borderColor: "hsl(var(--border))", background: "hsl(var(--card))" };

          const rankBubbleStyle = isGuest
            ? { background: "rgba(147,51,234,0.2)", color: "#C084FC" }
            : i === 0
            ? { background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }
            : i === 1
            ? { background: "rgba(160,160,180,0.3)", color: "hsl(var(--foreground))" }
            : i === 2
            ? { background: "rgba(160,80,10,0.7)", color: "#fff" }
            : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" };

          return (
            <li key={user.id}
              className="flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all"
              style={{ ...rowStyle, ...(isMe ? { outline: "2px solid hsl(var(--primary))", outlineOffset: "1px" } : {}) }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0"
                style={rankBubbleStyle}>
                {isGuest ? "👤" : rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm flex items-center gap-1.5 flex-wrap" style={{ color: "hsl(var(--foreground))" }}>
                  {name}
                  {isMe && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>YOU</span>}
                  {isGuest && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: "rgba(147,51,234,0.2)", color: "#C084FC" }}>GUEST</span>}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{user.xp} XP</span>
                  <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: "#f97316" }}>
                    <Flame className="w-3 h-3" />{user.streak}
                  </span>
                  {isGuest && user.localRank && (
                    <span className="text-[10px] font-bold" style={{ color: "#C084FC" }}>~#{user.localRank} globally</span>
                  )}
                </div>
              </div>
              {!isGuest && i < 3 && (
                <Medal className="w-6 h-6 flex-shrink-0"
                  style={{ color: i === 0 ? "hsl(var(--accent))" : i === 1 ? "#9ca3af" : "#b45309" }} />
              )}
            </li>
          );
        })}
        {displayList.length === 0 && (
          <li className="text-center py-12 text-muted-foreground">
            <p className="font-medium">No learners yet. Be the first!</p>
          </li>
        )}
      </ol>
    </div>
  );
}