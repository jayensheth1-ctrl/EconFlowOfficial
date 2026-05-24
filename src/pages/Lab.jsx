import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StockSimulator from "../components/lab/StockSimulator";
import FortuneWheel from "../components/lab/FortuneWheel";
import WeeklyChallenges from "../components/lab/WeeklyChallenges";
import MoneyMayhem from "../components/lab/MoneyMayhem";
import InflationInvaders from "../components/lab/inflation/InflationInvaders";

const TABS = [
  { id: "stock",    label: "📈 Stocks" },
  { id: "mayhem",   label: "💰 Mayhem" },
  { id: "invaders", label: "🛡️ Invaders" },
  { id: "wheel",    label: "🎡 Fortune" },
  { id: "challenges", label: "⚔️ Missions" },
];

export default function Lab() {
  const { progress, setProgress, stocks } = useOutletContext();
  const [tab, setTab] = useState("stock");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const labDays = progress?.badge_lab_days || [];
    if (!labDays.includes(today)) {
      const updated = [...labDays, today];
      import('../lib/progressUtils').then(({ updateProgress }) => {
        updateProgress(progress, { badge_lab_days: updated }).then(newProgress => {
          setProgress(newProgress);
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-black text-primary">
            ⚗️ The Lab
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Finance mini-games & challenges</p>
        </div>

        {/* Tab bar */}
        <div className="flex bg-muted rounded-xl p-1 gap-1 border border-border mb-5">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={tab === t.id ? {
                background: "hsl(var(--primary) / 0.15)",
                color: "hsl(var(--primary))",
                border: "1px solid hsl(var(--primary) / 0.35)",
              } : { color: "hsl(var(--muted-foreground))" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl p-4 bg-card border border-border"
          >
            {tab === "stock" && <StockSimulator progress={progress} setProgress={setProgress} />}
            {tab === "mayhem" && <MoneyMayhem progress={progress} setProgress={setProgress} />}
            {tab === "invaders" && <InflationInvaders progress={progress} setProgress={setProgress} />}
            {tab === "wheel" && <FortuneWheel progress={progress} setProgress={setProgress} />}
            {tab === "challenges" && <WeeklyChallenges progress={progress} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}