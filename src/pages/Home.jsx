import { supabase } from '../lib/supabaseClient';
import { useState, useEffect, useRef, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift } from "lucide-react";
import BadgeToast from "../components/profile/BadgeToast";
import StreakMilestoneTracker, { MILESTONES, MILESTONE_GEMS, getNextMilestone } from "../components/StreakMilestoneTracker";
import { units, getLessonById, getAllLessons } from "../lib/lessonData";
import { part2Units, getPart2LessonById, getAllPart2Lessons } from "../lib/part2LessonData";
import Part2UnlockCinematic from "../components/Part2UnlockCinematic";
import LessonNode from "../components/LessonNode";
import LessonOverlay from "../components/lesson/LessonOverlay";
import FloatingStickers from "../components/FloatingStickers";
import Mascot from "../components/Mascot";
import LiveFeed from "../components/LiveFeed";
import DailyInsightFeed from "../components/DailyInsightFeed";
import DailyReward from "../components/DailyReward";
import BattleBanner from "../components/battle/BattleBanner";
import BotBattleController from "../components/battle/BotBattleController";

import { announce } from "../lib/a11y";
import { playWrong } from "../lib/sounds";
import { toast } from "sonner";
import { isGuestMode as checkGuestMode, saveGuestProgress, getGuestProgress } from "../lib/guestProgress";
import { applyXpBoosts, applyGemMultiplier } from "../lib/shopItems";
import { checkNewBadges, buildBadgeUpdate } from "../lib/badges";
import { updateProgress } from "../lib/progressUtils";

const UNIT_ICONS = ["🪙", "📊", "💳", "📈"];
const UNIT_GRADIENTS = [
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-pink-500",
  "from-amber-400 to-orange-500",
];
const UNIT_GRADIENTS_P2 = [
  "from-violet-500 to-purple-700",
  "from-cyan-500 to-blue-700",
  "from-amber-500 to-red-600",
  "from-emerald-500 to-teal-700",
  "from-rose-500 to-pink-700",
];
const UNIT_ICONS_P2 = ["🌍", "₿", "🏛️", "🏙️", "🏰"];

function StarBurst({ x, y }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: x - 20, top: y - 20, width: 40, height: 40 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {["⭐", "✨", "💫", "⭐", "✨"].map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-base"
          style={{ left: 12, top: 12 }}
          initial={{ x: 0, y: 0, scale: 0 }}
          animate={{
            x: Math.cos((i / 5) * Math.PI * 2) * 35,
            y: Math.sin((i / 5) * Math.PI * 2) * 35,
            scale: [0, 1.4, 0],
          }}
          transition={{ duration: 0.6, delay: i * 0.04 }}
        >
          {s}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Home() {
  const { progress, setProgress, spawnFloatingGem } = useOutletContext();
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeSectionBonus, setActiveSectionBonus] = useState(0);
  const [bursts, setBursts] = useState([]);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  const [jumpMsg, setJumpMsg] = useState("");
  const jumpTimer = useRef(null);

  // ── Battle state ───────────────────────────────────────────────────────
  const [battleActive, setBattleActive] = useState(false);
  const [myName, setMyName] = useState("");

  // ── Badge toast — shows all new badges at once, user must claim ──────────
  const [pendingBadges, setPendingBadges] = useState([]);

  useEffect(() => {
  import('../lib/supabaseClient').then(({ supabase }) => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setMyName(user.user_metadata?.full_name || user.email?.split("@")[0] || "You");
      else setMyName(progress?.guestName || "Guest");
    });
  });
}, []);

  const part2Unlocked = (progress.owned_items || []).includes('part2-unlocked');
  const part2Available = (progress.owned_items || []).includes('part2-portal') || part2Unlocked;
  const allPart1Lessons = getAllLessons();
  const completedLessons = progress.completed_lessons || [];
  const allPart1Done = allPart1Lessons.every(l => completedLessons.includes(l.id));
  const shouldShowCinematic = allPart1Done && !part2Unlocked;

  // Announce page on mount
  useEffect(() => {
    announce("Home Page active. Type a lesson number and press Enter to jump to it.");
  }, []);

  // Number-key lesson jump listener
  useEffect(() => {
    const allLessons = [...getAllLessons(), ...(part2Unlocked ? getAllPart2Lessons() : [])];

    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (activeLesson) return;
      if (e.key >= "0" && e.key <= "9") {
        setJumpInput(prev => {
          const next = (prev + e.key).slice(-3);
          clearTimeout(jumpTimer.current);
          jumpTimer.current = setTimeout(() => setJumpInput(""), 3000);
          setJumpMsg(`Jump to Lesson: ${next}`);
          return next;
        });
      } else if (e.key === "Enter" && jumpInput) {
        const num = parseInt(jumpInput, 10) - 1;
        const lesson = allLessons[num];
        if (!lesson) {
          setJumpMsg("Lesson not found!");
          playWrong();
          announce("Lesson not found.");
          setTimeout(() => { setJumpMsg(""); setJumpInput(""); }, 1500);
          return;
        }
        const completedLessons = progress.completed_lessons || [];
        const idx = allLessons.findIndex(l => l.id === lesson.id);
        const isUnlocked = idx === 0 || completedLessons.includes(allLessons[idx - 1]?.id);
        if (!isUnlocked) {
          setJumpMsg("Lesson still locked! 🔒");
          playWrong();
          announce("Lesson still locked. Complete previous lessons to unlock.");
          setTimeout(() => { setJumpMsg(""); setJumpInput(""); }, 1800);
          return;
        }
        setJumpMsg(`Opening Lesson ${num + 1}…`);
        announce(`Opening lesson ${num + 1}: ${lesson.title}`);
        const found = getPart2LessonById(lesson.id) || getLessonById(lesson.id);
        setTimeout(() => {
          setJumpInput("");
          setJumpMsg("");
          setActiveLesson(found);
        }, 350);
      } else if (e.key === "Backspace") {
        setJumpInput(prev => prev.slice(0, -1));
      } else if (e.key === "Escape") {
        setJumpInput(""); setJumpMsg("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(jumpTimer.current); };
  }, [jumpInput, activeLesson, progress]);
  const allLessons = [...getAllLessons(), ...(part2Available ? getAllPart2Lessons() : [])];

  const lastClaimed = progress.last_reward_claimed;
  const isDailyReady = !lastClaimed ||
    Date.now() - new Date(lastClaimed).getTime() >= 24 * 60 * 60 * 1000;

  function getLessonStatus(lessonId) {
    if (completedLessons.includes(lessonId)) return "completed";
    const idx = allLessons.findIndex((l) => l.id === lessonId);
    if (idx === 0) return "active";
    const prev = allLessons[idx - 1];
    if (prev && completedLessons.includes(prev.id)) return "active";
    return "locked";
  }

  function getSectionBonus(lessonId) {
    const lessonUnit = units.find(u => u.lessons.some(l => l.id === lessonId));
    if (!lessonUnit) return 0;
    const last = lessonUnit.lessons[lessonUnit.lessons.length - 1];
    if (last.id !== lessonId) return 0;
    return lessonUnit.lessons.slice(0, -1).every(l => completedLessons.includes(l.id)) ? 30 : 0;
  }

  function handleLessonClick(lesson, e) {
    const bonus = getSectionBonus(lesson.id);
    setActiveSectionBonus(bonus);
    const rect = e?.currentTarget?.getBoundingClientRect?.();
    if (rect) {
      const id = Date.now();
      setBursts(b => [...b, { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
      setTimeout(() => setBursts(b => b.filter(s => s.id !== id)), 800);
    }
    // Try part2 lesson first, then part1
    const found = getPart2LessonById(lesson.id) || getLessonById(lesson.id);
    setActiveLesson(found);
  }

  async function handleLessonComplete(result) {
    const today = new Date().toISOString().split("T")[0];
    const newCompleted = result.completed
      ? [...new Set([...completedLessons, activeLesson.id])]
      : completedLessons;

    // Badge stat updates from lesson
    const bs = result.badgeStats || {};
    const badgeUpdates = {};
    if (bs.totalCorrect) badgeUpdates.badge_total_correct = (progress.badge_total_correct || 0) + bs.totalCorrect;
    if (bs.maxConsecCorrect > (progress.badge_max_streak || 0)) badgeUpdates.badge_max_streak = bs.maxConsecCorrect;
    if (bs.speedRunSeconds < 120 && result.completed) badgeUpdates.badge_speed_run_done = true;
    if (bs.noWrong && result.completed) badgeUpdates.badge_perfect_lesson_done = true;
    if (bs.nightOwl && result.completed) badgeUpdates.badge_night_owl_done = true;
    if (bs.retriedAfterDeath && result.completed) badgeUpdates.badge_retry_complete_done = true;
    // Peak gems
    const gemAfterLesson = (progress.gems || 0) + 10;
    if (gemAfterLesson > (progress.badge_peak_gems || 0)) badgeUpdates.badge_peak_gems = gemAfterLesson;

    // ── Guest mode: save to localStorage only, no DB call ─────────────────
    if (checkGuestMode()) {
      const guestData = getGuestProgress() || {};
      const isNewDay = guestData.last_active_date !== today;
      const newStreak = isNewDay ? (guestData.streak || 0) + 1 : (guestData.streak || 0);
      const updated = {
        ...guestData,
        xp: (guestData.xp || 0) + (result.xpEarned || 10),
        gems: (guestData.gems || 0) + (result.completed ? 10 : 0),
        completed_lessons: newCompleted,
        streak: newStreak,
        last_active_date: today,
      };
      saveGuestProgress(updated);
      setProgress({ ...progress, ...updated });
      setActiveLesson(null);
      return;
    }

    // Check if all part1 lessons now done → trigger cinematic
    const nowAllPart1Done = allPart1Lessons.every(l => newCompleted.includes(l.id));
    const willShowCinematic = nowAllPart1Done && !part2Unlocked;

    // Gem rewards per lesson completion
    const gemPopups = [];
    if (result.completed) {
      gemPopups.push({ amount: 10, label: "Lesson Complete! 💎" });
    }
    // Unit completion bonus: +15 XP and +15 gems for last lesson in a unit
    const lessonUnit = units.find(u => u.lessons.some(l => l.id === activeLesson.id));
    let unitCompletionXpBonus = 0;
    if (lessonUnit && result.completed) {
      const unitDone = lessonUnit.lessons.every(l => newCompleted.includes(l.id));
      if (unitDone && !lessonUnit.lessons.every(l => completedLessons.includes(l.id))) {
        gemPopups.push({ amount: 15, label: "Unit Complete! 🏆" });
        unitCompletionXpBonus = 15;
      }
    }

    const isNewDay = progress.last_active_date !== today;
    // Streak freeze: if missed more than 1 day, consume freeze instead of resetting
    const daysDiff = progress.last_active_date
      ? Math.floor((new Date(today) - new Date(progress.last_active_date)) / 86400000)
      : 0;
    let newStreak = progress.streak;
    let newStreakFreeze = progress.streak_freeze;
    if (isNewDay) {
      if (daysDiff > 1 && progress.streak_freeze) {
        newStreakFreeze = false; // consume freeze, keep streak
      } else if (daysDiff > 1) {
        newStreak = 0;
      } else {
        newStreak = progress.streak + 1;
      }
    }
    // Streak milestone bonus gems
    const prevNextMilestone = getNextMilestone(progress.streak || 0);
    const newNextMilestone = getNextMilestone(newStreak);
    const hitMilestone = prevNextMilestone && newNextMilestone !== prevNextMilestone;
    if (hitMilestone) {
      const milestoneGems = MILESTONE_GEMS[prevNextMilestone] || 0;
      gemPopups.push({ amount: milestoneGems, label: `🔥 ${prevNextMilestone}-Day Streak! 💎` });
    }

    // XP boost + magnet
    let xpGained = applyXpBoosts(result.xpEarned, progress) + applyXpBoosts(unitCompletionXpBonus, progress);

    // Investment portfolio: 10% chance to double XP
    if (result.completed && progress.investment_portfolio_active) {
      if (Math.random() < 0.10) {
        xpGained = xpGained * 2;
        toast("📈 Portfolio Pays Out! XP Doubled!", { duration: 3000 });
        gemPopups.push({ amount: 0, label: "📈 Portfolio Bonus!" });
      }
    }

    // Fortune flip: if user has fortune-flips and wants to use one — check via result
    // (We'll handle fortune flip from a button on completion screen — skip here for now)

    // Gem multiplier
    const gemBonus = applyGemMultiplier(gemPopups.reduce((s, p) => s + p.amount, 0), progress);

    const updateData = {
      hearts: 3,
      xp: progress.xp + xpGained,
      gems: progress.gems + gemBonus,
      completed_lessons: newCompleted,
      streak: newStreak,
      last_active_date: today,
      ...badgeUpdates,
    };

    // Check for new badges
    const progressForCheck = { ...progress, ...updateData };
    const newBadges = checkNewBadges(progressForCheck);
    let finalUpdate = updateData;
    if (newBadges.length) {
      const badgeUpdate = buildBadgeUpdate(progressForCheck, newBadges);
      finalUpdate = { ...updateData, ...badgeUpdate };
      // Show all new badges at once
      setPendingBadges(newBadges);
    }

    const { error: updateError } = await supabase.from("user_progress").update(finalUpdate).eq("id", progress.id);
console.log("Update result:", updateError, "progress.id:", progress.id, "finalUpdate:", finalUpdate);
    setProgress({ ...progress, ...finalUpdate }, gemPopups.filter(p => p.amount > 0).length > 0 ? gemPopups.filter(p => p.amount > 0) : null);
    setActiveLesson(null);
    if (willShowCinematic) {
      setTimeout(() => setShowCinematic(true), 500);
    }
  }

  let lessonIndex = 0;

  // Also show cinematic if already completed all p1 and not yet unlocked
  function handlePortalTap() {
    if (shouldShowCinematic) setShowCinematic(true);
  }

  // ── Battle overlay ──────────────────────────────────────────────────────
  if (battleActive) {
    return (
      <BotBattleController
        myName={myName || "You"}
        avatarConfig={progress.avatar_config || {}}
        progress={progress}
        setProgress={setProgress}
        onExit={() => setBattleActive(false)}
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      <BadgeToast badges={pendingBadges} onClaim={() => setPendingBadges([])} />
      {/* Jump-to-lesson HUD */}
      <AnimatePresence>
        {jumpMsg && (
          <motion.div
            key="jump"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-28 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-bold shadow-xl"
            style={{
              background: jumpMsg.includes("locked") || jumpMsg.includes("found") ? "rgba(220,38,38,0.92)" : "rgba(10,14,23,0.92)",
              border: jumpMsg.includes("locked") || jumpMsg.includes("found") ? "1.5px solid #ef4444" : "1.5px solid rgba(0,242,255,0.4)",
              color: jumpMsg.includes("locked") || jumpMsg.includes("found") ? "#fff" : "#00F2FF",
              backdropFilter: "blur(10px)",
            }}
            role="status"
            aria-live="polite"
          >
            {jumpMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Part 2 Cinematic */}
      <AnimatePresence>
        {showCinematic && (
          <Part2UnlockCinematic
            progress={progress}
            setProgress={setProgress}
            onComplete={() => setShowCinematic(false)}
          />
        )}
      </AnimatePresence>

      {/* Background — uses bg-background so it respects the active theme */}
      <div className="fixed inset-0 -z-20 bg-background" />
      <FloatingStickers part2Unlocked={part2Available} goldActive={!!(progress.gold_theme_until && new Date(progress.gold_theme_until) > new Date())} />

      {bursts.map(b => <StarBurst key={b.id} x={b.x} y={b.y} />)}

      {/* Daily reward button */}
      <div className="flex justify-end px-4 pt-2 max-w-lg mx-auto">
        <motion.button
          animate={isDailyReady ? {
            rotate: [-5, 5, -5, 5, 0],
            scale: [1, 1.12, 1],
          } : {}}
          transition={isDailyReady ? { repeat: Infinity, repeatDelay: 4, duration: 0.4 } : {}}
          onClick={() => setShowDailyReward(true)}
          className="relative flex items-center gap-2 bg-card/80 backdrop-blur-sm border-2 border-border px-3 py-2 rounded-full shadow-md"
        >
          <Gift className={`w-5 h-5 ${isDailyReady ? "text-amber-500" : "text-muted-foreground"}`} />
          <span className={`text-xs font-bold ${isDailyReady ? "text-amber-600" : "text-muted-foreground"}`}>
            {isDailyReady ? "Claim!" : "Daily Gift"}
          </span>
          {isDailyReady && (
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            />
          )}
        </motion.button>
      </div>

      <StreakMilestoneTracker streak={progress.streak || 0} />

      {progress.hearts <= 0 && (
        <div className="mx-4 mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
          <p className="text-sm font-semibold text-destructive">No hearts left! Visit the Shop to refill. 💔</p>
        </div>
      )}

      {/* Part 1 portal prompt when all done and not yet unlocked */}
      {shouldShowCinematic && !showCinematic && (
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={handlePortalTap}
          className="mx-4 mt-2 mb-4 p-4 rounded-2xl cursor-pointer text-center"
          style={{
            background: "linear-gradient(135deg, rgba(147,51,234,0.2), rgba(79,0,180,0.3))",
            border: "2px solid rgba(147,51,234,0.5)",
            boxShadow: "0 0 30px rgba(147,51,234,0.3)",
          }}
        >
          <span className="text-3xl">🌀</span>
          <p className="text-base font-black text-white mt-1">Part 2 Portal Ready!</p>
          <p className="text-xs" style={{ color: "#C084FC" }}>Tap to begin the ceremony</p>
        </motion.div>
      )}

      <div className="max-w-lg mx-auto px-4 pt-3">
        {/* Battle Banner */}
        <BattleBanner onStartBattle={() => setBattleActive(true)} />

        {units.map((unit, unitIdx) => {
          return (
            <div key={unit.id} className="mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
                className={`bg-gradient-to-r ${UNIT_GRADIENTS[unitIdx % UNIT_GRADIENTS.length]} rounded-2xl p-5 mb-7 shadow-xl`}
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 2px 0 rgba(255,255,255,0.2) inset" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl drop-shadow-md">{UNIT_ICONS[unitIdx % UNIT_ICONS.length]}</span>
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Unit {unitIdx + 1}</p>
                    <h2 className="text-xl font-extrabold text-white drop-shadow-sm leading-tight">{unit.title}</h2>
                    <p className="text-white/80 text-xs mt-0.5">{unit.description}</p>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col items-center gap-7">
                {unit.lessons.map((lesson) => {
                  const idx = lessonIndex++;
                  const status = getLessonStatus(lesson.id);
                  return (
                    <LessonNode
                      key={lesson.id}
                      lesson={lesson}
                      index={idx}
                      status={status}
                      onClick={(l, e) => handleLessonClick(l, e)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Part 2 Units */}
        {part2Available && (
          <>
            {/* Part 2 divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(147,51,234,0.6))" }} />
              <div className="px-4 py-2 rounded-full text-sm font-black" style={{ background: "rgba(147,51,234,0.15)", border: "1.5px solid rgba(147,51,234,0.5)", color: "#C084FC" }}>
                🌀 PART 2: GLOBAL TYCOON
              </div>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(147,51,234,0.6), transparent)" }} />
            </div>

            {part2Units.map((unit, unitIdx) => (
              <div key={unit.id} className="mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                  className={`bg-gradient-to-r ${UNIT_GRADIENTS_P2[unitIdx % UNIT_GRADIENTS_P2.length]} rounded-2xl p-5 mb-7 shadow-xl`}
                  style={{ boxShadow: "0 8px 32px rgba(147,51,234,0.2), 0 2px 0 rgba(255,255,255,0.15) inset" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl drop-shadow-md">{UNIT_ICONS_P2[unitIdx % UNIT_ICONS_P2.length]}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Unit {4 + unitIdx + 1}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-extrabold" style={{ background: "rgba(255,215,0,0.2)", color: "#FFD700" }}>PART 2</span>
                      </div>
                      <h2 className="text-xl font-extrabold text-white drop-shadow-sm leading-tight">{unit.title}</h2>
                      <p className="text-white/80 text-xs mt-0.5">{unit.description}</p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-col items-center gap-7">
                  {unit.lessons.map((lesson) => {
                    const idx = lessonIndex++;
                    const status = getLessonStatus(lesson.id);
                    return (
                      <LessonNode
                        key={lesson.id}
                        lesson={lesson}
                        index={idx}
                        status={status}
                        onClick={(l, e) => handleLessonClick(l, e)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        <div className="h-4" />
      </div>

      <DailyInsightFeed progress={progress} />
      <LiveFeed />
      <Mascot streak={progress.streak} avatarConfig={progress.avatar_config || {}} />

      <AnimatePresence>
        {showDailyReward && (
          <DailyReward
            progress={progress}
            setProgress={setProgress}
            onClose={() => setShowDailyReward(false)}
          />
        )}
      </AnimatePresence>

      {activeLesson && (
        <LessonOverlay
          lesson={activeLesson}
          hearts={progress.hearts}
          progress={progress}
          sectionBonus={activeSectionBonus}
          onComplete={handleLessonComplete}
          onClose={() => setActiveLesson(null)}
          onProgressUpdate={async (update) => {
            const updated = await updateProgress(progress, update);
            setProgress(updated);
          }}
        />
      )}
    </div>
  );
}