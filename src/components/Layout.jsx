import { Outlet } from "react-router-dom";
import { useRef } from "react";
import { isGuestMode, getGuestProgress, saveGuestProgress, initGuest, clearGuest } from "../lib/guestProgress";
import { setActiveTheme } from "../lib/themeManager";
import { supabase } from "../lib/supabaseClient";
import GuestBanner from "./GuestBanner";
import HeaderBar from "./HeaderBar";
import BottomNav from "./BottomNav";
import LevelUpOverlay from "./LevelUpOverlay";
import XpChestOverlay from "./XpChestOverlay";
import FloatingGemPopup from "./FloatingGemPopup";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PENDING_FORFEIT_KEY } from "../lib/botBattle";
import { toast } from "sonner";

export default function Layout({ isGuest = false }) {
  const guestMode = isGuest || isGuestMode();
  const [progress, setProgress] = useState(null);
  const [levelUpShow, setLevelUpShow] = useState(false);
  const [levelUpNum, setLevelUpNum] = useState(1);
  const [xpChestShow, setXpChestShow] = useState(false);
  const [floatingGems, setFloatingGems] = useState([]);
  const lastXpMilestoneRef = useRef(0);
  const [stocks, setStocks] = useState(() => ({
    STABL: Array.from({ length: 30 }, (_, i) => ({ t: i, price: 100 + (Math.random()-0.5)*4 })),
    GLOW:  Array.from({ length: 30 }, (_, i) => ({ t: i, price: 100 + (Math.random()-0.5)*10 })),
    CRPT:  Array.from({ length: 30 }, (_, i) => ({ t: i, price: 100 + (Math.random()-0.5)*22 })),
  }));
  const stockTickRef = useRef(30);

  useEffect(() => {
    const VOLS = { STABL: 1.2, GLOW: 3.5, CRPT: 8 };
    const id = setInterval(() => {
      const t = stockTickRef.current++;
      setStocks(prev => {
        const next = {};
        for (const key of Object.keys(prev)) {
          const h = prev[key];
          const last = h[h.length - 1].price;
          const change = (Math.random() - 0.48) * VOLS[key];
          next[key] = [...h.slice(-59), { t, price: Math.max(5, +(last + change).toFixed(2)) }];
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  function spawnFloatingGem(amount, label) {
    const id = Date.now() + Math.random();
    setFloatingGems(g => [...g, { id, amount, label }]);
    setTimeout(() => setFloatingGems(g => g.filter(x => x.id !== id)), 2000);
  }

  function setProgressWithLevelCheck(newProgress, gemPopups) {
    if (guestMode) {
      saveGuestProgress(newProgress);
      setProgress(newProgress);
      if (gemPopups) gemPopups.forEach(p => spawnFloatingGem(p.amount, p.label));
      return;
    }
    if (progress) {
      const oldLevel = Math.floor((progress.xp || 0) / 100) + 1;
      const newLevel = Math.floor((newProgress.xp || 0) / 100) + 1;
      if (newLevel > oldLevel) {
        setLevelUpNum(newLevel);
        setLevelUpShow(true);
      }
      const oldMilestone = Math.floor((progress.xp || 0) / 100);
      const newMilestone = Math.floor((newProgress.xp || 0) / 100);
      if (newMilestone > oldMilestone && newMilestone > lastXpMilestoneRef.current) {
        lastXpMilestoneRef.current = newMilestone;
        const withChest = { ...newProgress, gems: (newProgress.gems || 0) + 50 };
        supabase.from("user_progress").update({ gems: withChest.gems }).eq("id", newProgress.id);
        setProgress(withChest);
        setXpChestShow(true);
        if (gemPopups) gemPopups.forEach(p => spawnFloatingGem(p.amount, p.label));
        return;
      }
    }
    setProgress(newProgress);
    if (gemPopups) gemPopups.forEach(p => spawnFloatingGem(p.amount, p.label));
  }

  useEffect(() => {
    if (!progress?.gold_theme_until) return;
    const check = () => {
      if (new Date(progress.gold_theme_until) <= new Date()) {
        setProgress({ ...progress, gold_theme_until: null });
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, [progress?.gold_theme_until]);

  useEffect(() => {
    if (!progress) return;
    const owned = progress.owned_items || [];
    const goldActive = progress.gold_theme_until && new Date(progress.gold_theme_until) > new Date();
    const root = document.documentElement;
    const ALL_VARS = ['--primary','--primary-foreground','--background','--foreground','--card','--card-foreground',
      '--secondary','--secondary-foreground','--muted','--muted-foreground',
      '--accent','--accent-foreground','--border','--input','--ring'];
    if (owned.includes('part2-unlocked') || owned.includes('part2-portal')) {
      root.style.setProperty('--primary', '271 76% 63%');
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--ring', '271 76% 70%');
      ['--background','--foreground','--card','--card-foreground','--secondary','--secondary-foreground',
       '--muted','--muted-foreground','--accent','--accent-foreground','--border','--input'].forEach(v => root.style.removeProperty(v));
    } else if (goldActive) {
      root.style.setProperty('--primary', '45 95% 55%');
      root.style.setProperty('--primary-foreground', '0 0% 5%');
      root.style.setProperty('--ring', '45 95% 65%');
      ['--background','--foreground','--card','--card-foreground','--secondary','--secondary-foreground',
       '--muted','--muted-foreground','--accent','--accent-foreground','--border','--input'].forEach(v => root.style.removeProperty(v));
    } else {
      ALL_VARS.forEach(v => root.style.removeProperty(v));
    }
  }, [progress?.owned_items, progress?.gold_theme_until]);

  useEffect(() => {
    loadProgress();
  }, [guestMode]);

  function getLocalToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function computeStreak(currentStreak, lastActiveDate, streakFreezeExpiry) {
    const today = getLocalToday();
    if (!lastActiveDate) return { streak: 1, last_active_date: today, changed: true, clearFreeze: false };
    if (lastActiveDate === today) return { streak: Math.max(1, currentStreak), last_active_date: today, changed: false, clearFreeze: false };
    const last = new Date(lastActiveDate + "T00:00:00");
    const todayDate = new Date(today + "T00:00:00");
    const diffDays = Math.round((todayDate - last) / 86400000);
    if (diffDays === 1) {
      return { streak: Math.min((currentStreak || 0) + 1, 999), last_active_date: today, changed: true, clearFreeze: false };
    }
    if (streakFreezeExpiry && Date.now() < new Date(streakFreezeExpiry).getTime()) {
      return { streak: Math.max(1, currentStreak), last_active_date: today, changed: true, clearFreeze: true };
    }
    return { streak: 1, last_active_date: today, changed: true, clearFreeze: false };
  }

  async function loadProgress() {
    if (guestMode) {
      const raw = getGuestProgress() || initGuest();
      const { streak, last_active_date, changed, clearFreeze } = computeStreak(raw.streak || 0, raw.last_active_date, raw.streak_freeze_expiry);
      let data = changed ? { ...raw, streak, last_active_date } : raw;
      if (clearFreeze) data = { ...data, streak_freeze_expiry: null };
      if (changed) saveGuestProgress(data);
      setProgress(data);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProgress({ xp: 0, hearts: 3, gems: 50, streak: 1, completed_lessons: [], owned_items: [], level: 1 });
        return;
      }

      const today = getLocalToday();
      const { data: records, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("email", user.email);

      if (error) throw error;

      if (records && records.length > 0) {
        let existing = records[0];

        const { streak, last_active_date, changed, clearFreeze } = computeStreak(existing.streak || 0, existing.last_active_date, existing.streak_freeze_expiry);
        if (changed) {
          const streakUpdate = { streak, last_active_date };
          if (existing.interest_account_active) streakUpdate.gems = (existing.gems || 0) + 5;
          if (clearFreeze) streakUpdate.streak_freeze_expiry = null;
          await supabase.from("user_progress").update(streakUpdate).eq("id", existing.id);
          existing = { ...existing, ...streakUpdate };
        }

        if (localStorage.getItem(PENDING_FORFEIT_KEY)) {
          localStorage.removeItem(PENDING_FORFEIT_KEY);
          const deduct = 10;
          existing = { ...existing, gems: (existing.gems || 0) - deduct };
          await supabase.from("user_progress").update({ gems: existing.gems }).eq("id", existing.id);
          setTimeout(() => toast.error(`You left a battle. -${deduct} 💎`), 1500);
        }

        if (existing.active_theme) setActiveTheme(existing.active_theme);
        setProgress(existing);
      } else {
        // Create new progress record
        const base = {
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
          avatar_url: user.user_metadata?.avatar_url || null,
          xp: 0, hearts: 3, gems: 50, streak: 1,
          last_active_date: today,
          completed_lessons: [], current_unit: 1, level: 1,
          daily_reward_day: 1, owned_items: [],
        };
        const { data: newProgress, error: createError } = await supabase
  .from("user_progress")
  .upsert(base, { onConflict: 'email' })
  .select()
  .single();
        if (createError) throw createError;
        setProgress(newProgress);
      }
    } catch (err) {
      console.error("Failed to load progress:", err);
      setProgress({ xp: 0, hearts: 3, gems: 50, streak: 1, completed_lessons: [], owned_items: [], level: 1 });
    }
  }

  if (!progress) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {guestMode && progress?.guestName && <GuestBanner guestName={progress.guestName} />}
      <HeaderBar
        streak={progress.streak}
        hearts={progress.hearts}
        gems={progress.gems}
        xp={progress.xp}
        avatarConfig={progress.avatar_config || {}}
        goldThemeUntil={progress.gold_theme_until}
      />
      <main className="pb-24 pt-2">
        <Outlet context={{ progress, setProgress: setProgressWithLevelCheck, reloadProgress: loadProgress, stocks, spawnFloatingGem }} />
      </main>
      <BottomNav />
      <FloatingGemPopup items={floatingGems} />
      <AnimatePresence>
        {levelUpShow && (
          <LevelUpOverlay level={levelUpNum} onClose={() => setLevelUpShow(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {xpChestShow && (
          <XpChestOverlay onClose={() => setXpChestShow(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}