import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, X, ShieldCheck, Zap, TrendingUp, Clock, Check } from "lucide-react";
import { updateProgress } from "../lib/progressUtils";
import { toast } from "sonner";
import { playChaChig } from "../lib/sounds";
import FlashSale from "../components/shop/FlashSale";
import { SHOP_ITEMS, RARITY_META, CATEGORY_TABS } from "../lib/shopItems";
import { setActiveTheme, getActiveTheme } from "../lib/themeManager";
import BadgeToast from "../components/profile/BadgeToast";

function FloatingMinus({ item }) {
  return (
    <motion.div className="fixed pointer-events-none z-50 font-extrabold text-cyan-400 text-lg"
      style={{ left: item.x, top: item.y }}
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: -80, opacity: 0 }}
      transition={{ duration: 1.3, ease: "easeOut" }}>
      -{item.amount} 💎
    </motion.div>
  );
}

function fmtMs(ms) {
  if (ms <= 0) return "00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${String(m).padStart(2,"0")}m`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function TimerBadge({ label, ms, color = "#F1C40F" }) {
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: `${color}18`, border: `1px solid ${color}44`, color }}>
      <Clock className="w-3 h-3" /> {label} · {fmtMs(ms)}
    </div>
  );
}

function ThemeCard({ item, isOwned, isEquipped, canAfford, onBuy, onEquip }) {
  const meta = RARITY_META[item.rarity];
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl p-3 flex items-center gap-3 relative overflow-hidden"
      style={{ background: `${meta.color}08`, border: `1.5px solid ${isEquipped ? meta.color : meta.color + "33"}` }}
    >
      <div className="w-8 h-8 rounded-full flex-shrink-0 border-2"
        style={{ background: item.swatch, borderColor: meta.color + "66" }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-black text-foreground">{item.emoji} {item.title}</span>
          {isEquipped && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
            style={{ background: `${meta.color}22`, color: meta.color }}>EQUIPPED</span>}
        </div>
        <p className="text-xs text-muted-foreground">{item.desc}</p>
      </div>
      <div className="flex-shrink-0">
        {item.price === 0 ? (
          isEquipped ? (
            <span className="text-xs font-bold text-muted-foreground">Default</span>
          ) : (
            <button onClick={onEquip}
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}44` }}>
              Equip
            </button>
          )
        ) : !isOwned ? (
          <button onClick={canAfford ? onBuy : undefined}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{
              background: canAfford ? `${meta.color}18` : "hsl(var(--muted))",
              color: canAfford ? meta.color : "hsl(var(--muted-foreground))",
              border: `1px solid ${canAfford ? meta.color + "44" : "hsl(var(--border))"}`,
            }}>
            <Gem className="w-3 h-3" /> {item.price}
          </button>
        ) : isEquipped ? (
          <button onClick={onEquip}
            className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}>
            Unequip
          </button>
        ) : (
          <button onClick={onEquip}
            className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}44` }}>
            Equip
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ShopCard({ item, progress, now, onBuy, onToggle, onUse }) {
  const meta = RARITY_META[item.rarity];
  const ownedItems = progress.owned_items || [];
  const inventoryCounts = progress.inventory_counts || {};
  const isOwned = ownedItems.includes(item.id);
  const count = inventoryCounts[item.id] || 0;
  const canAfford = progress.gems >= item.price;

  // Compute timers
  let timerMs = 0;
  if (item.timedKey && progress[item.timedKey]) {
    timerMs = Math.max(0, new Date(progress[item.timedKey]).getTime() - now);
  }
  const timerActive = timerMs > 0;

  // Toggle state
  let toggleActive = false;
  if (item.toggleKey) toggleActive = !!progress[item.toggleKey];

  // Streak freeze special: check expiry
  let streakFreezeMs = 0;
  if (item.id === "shield" && progress.streak_freeze_expiry) {
    streakFreezeMs = Math.max(0, new Date(progress.streak_freeze_expiry).getTime() - now);
  }
  const streakFreezeActive = streakFreezeMs > 0;

  function renderAction() {
    if (item.behavior === "consumable_stack") {
      return (
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] font-bold text-muted-foreground">
            {count > 0 ? `Owned: ${count}` : "Not owned"}
          </span>
          <button onClick={onBuy} disabled={!canAfford}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black disabled:opacity-40"
            style={{ background: canAfford ? `${meta.color}18` : "hsl(var(--muted))", color: canAfford ? meta.color : "hsl(var(--muted-foreground))", border: `1px solid ${canAfford ? meta.color + "44" : "hsl(var(--border))"}` }}>
            <Gem className="w-3 h-3" /> {item.price}
          </button>
        </div>
      );
    }

    if (item.behavior === "timed") {
      if (item.id === "shield") {
        // Streak freeze
        if (streakFreezeActive) {
          return (
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] font-bold" style={{ color: "#00F2FF" }}>🛡 Active · {fmtMs(streakFreezeMs)}</span>
              <button onClick={onToggle} className="px-2 py-1 rounded-lg text-[10px] font-bold text-muted-foreground bg-muted border border-border">Cancel</button>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">24h protection</span>
            <button onClick={onBuy} disabled={!canAfford}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black disabled:opacity-40"
              style={{ background: canAfford ? `${meta.color}18` : "hsl(var(--muted))", color: canAfford ? meta.color : "hsl(var(--muted-foreground))", border: `1px solid ${canAfford ? meta.color + "44" : "hsl(var(--border))"}` }}>
              <Gem className="w-3 h-3" /> {item.price}
            </button>
          </div>
        );
      }

      // Generic timed item
      if (timerActive) {
        return (
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-bold" style={{ color: meta.color }}>Active · {fmtMs(timerMs)}</span>
            <div className="flex gap-1">
              <button onClick={onBuy} disabled={!canAfford}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold disabled:opacity-40"
                style={{ background: canAfford ? `${meta.color}18` : "hsl(var(--muted))", color: canAfford ? meta.color : "hsl(var(--muted-foreground))", border: `1px solid ${canAfford ? meta.color + "44" : "hsl(var(--border))"}` }}>
                +{item.id === "xp-multiplier" ? "15m" : item.id === "xp-magnet" ? "24h" : item.id === "gold-theme" ? "1h" : item.id === "gem-multiplier" ? "48h" : ""}
              </button>
              <button onClick={onToggle} className="px-2 py-1 rounded-lg text-[10px] font-bold text-muted-foreground bg-muted border border-border">✕</button>
            </div>
          </div>
        );
      }
      return (
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">Activates instantly</span>
          <button onClick={onBuy} disabled={!canAfford}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black disabled:opacity-40"
            style={{ background: canAfford ? `${meta.color}18` : "hsl(var(--muted))", color: canAfford ? meta.color : "hsl(var(--muted-foreground))", border: `1px solid ${canAfford ? meta.color + "44" : "hsl(var(--border))"}` }}>
            <Gem className="w-3 h-3" /> {item.price}
          </button>
        </div>
      );
    }

    if (item.behavior === "toggle") {
      if (item.id === "rocket-cursor") {
        // Hyperdrive: buy once, equip/unequip
        if (!isOwned) {
          return (
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">Permanent badge</span>
              <button onClick={onBuy} disabled={!canAfford}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black disabled:opacity-40"
                style={{ background: canAfford ? `${meta.color}18` : "hsl(var(--muted))", color: canAfford ? meta.color : "hsl(var(--muted-foreground))", border: `1px solid ${canAfford ? meta.color + "44" : "hsl(var(--border))"}` }}>
                <Gem className="w-3 h-3" /> {item.price}
              </button>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-bold" style={{ color: toggleActive ? meta.color : "hsl(var(--muted-foreground))" }}>
              {toggleActive ? "🚀 EQUIPPED" : "Unequipped"}
            </span>
            <button onClick={onToggle}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
              style={{ background: toggleActive ? "hsl(var(--muted))" : `${meta.color}18`, color: toggleActive ? "hsl(var(--muted-foreground))" : meta.color, border: `1px solid ${toggleActive ? "hsl(var(--border))" : meta.color + "44"}` }}>
              {toggleActive ? "Unequip" : "Equip"}
            </button>
          </div>
        );
      }

      // Generic toggle (interest-account, investment-portfolio, heart-armor)
      if (!isOwned) {
        return (
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">One-time purchase</span>
            <button onClick={onBuy} disabled={!canAfford}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black disabled:opacity-40"
              style={{ background: canAfford ? `${meta.color}18` : "hsl(var(--muted))", color: canAfford ? meta.color : "hsl(var(--muted-foreground))", border: `1px solid ${canAfford ? meta.color + "44" : "hsl(var(--border))"}` }}>
              <Gem className="w-3 h-3" /> {item.price}
            </button>
          </div>
        );
      }
      return (
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] font-bold" style={{ color: toggleActive ? meta.color : "hsl(var(--muted-foreground))" }}>
            {toggleActive ? "● Active" : "○ Inactive"}
          </span>
          <button onClick={onToggle}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
            style={{ background: toggleActive ? "hsl(var(--muted))" : `${meta.color}18`, color: toggleActive ? "hsl(var(--muted-foreground))" : meta.color, border: `1px solid ${toggleActive ? "hsl(var(--border))" : meta.color + "44"}` }}>
            {toggleActive ? "Unequip" : "Equip"}
          </button>
        </div>
      );
    }

    return null;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl p-3 flex flex-col relative overflow-hidden"
      style={{ background: `${meta.color}06`, border: `1.5px solid ${meta.color}33` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.color}55, transparent)` }} />
      <div className="flex items-start gap-2 mb-1">
        <span className="text-2xl flex-shrink-0">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black text-foreground leading-tight">{item.title}</span>
            <span className="text-[8px] font-black px-1 py-0.5 rounded"
              style={{ background: `${meta.color}18`, color: meta.color }}>{meta.label}</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
        </div>
      </div>
      {!canAfford && item.price > 0 && (
        <p className="text-[9px] text-red-400 font-bold mb-1">Need {item.price - progress.gems} more 💎</p>
      )}
      {renderAction()}
    </motion.div>
  );
}

export default function Shop() {
  const { progress, setProgress } = useOutletContext();
  const [floats, setFloats] = useState([]);
  const [shakeGems, setShakeGems] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [now, setNow] = useState(Date.now());
  const [activeTheme, setActiveThemeState] = useState(() => getActiveTheme());
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [currentBadgeToast, setCurrentBadgeToast] = useState(null);

  useEffect(() => {
    if (!currentBadgeToast && badgeQueue.length > 0) {
      setCurrentBadgeToast(badgeQueue[0]);
      setBadgeQueue(q => q.slice(1));
    }
  }, [currentBadgeToast, badgeQueue]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const ownedItems = progress.owned_items || [];
  const inventoryCounts = progress.inventory_counts || {};

  function spawnFloat(amount) {
    const id = Date.now();
    setFloats(f => [...f, { id, x: window.innerWidth / 2 - 40, y: 100, amount }]);
    setTimeout(() => setFloats(f => f.filter(t => t.id !== id)), 1400);
  }

  async function handleBuy(item) {
  if (progress.gems < item.price) {
    setShakeGems(true);
    setTimeout(() => setShakeGems(false), 600);
    toast.error(`Need ${item.price - progress.gems} more 💎`);
    return;
  }
  playChaChig();
  spawnFloat(item.price);

  const update = { gems: progress.gems - item.price };

 // Handle flash sale items
if (item.type === "consumable") {
  if (item.id === "flash-surge") {
    const existing = progress.xp_boost_until && new Date(progress.xp_boost_until).getTime() > Date.now()
      ? new Date(progress.xp_boost_until).getTime() : Date.now();
    update.xp_boost_until = new Date(existing + 10 * 60 * 1000).toISOString();
    update.flash_surge_active = true;
  }
  if (item.id === "flash-shield") {
    const existing = progress.streak_freeze_expiry && new Date(progress.streak_freeze_expiry).getTime() > Date.now()
      ? new Date(progress.streak_freeze_expiry).getTime() : Date.now();
    update.streak_freeze_expiry = new Date(existing + 48 * 60 * 60 * 1000).toISOString();
  }
}
if (item.type === "owned") {
  update.owned_items = [...new Set([...ownedItems, item.id])];
  if (item.avatarKey) {
    update.avatar_config = { ...(progress.avatar_config || {}), [item.avatarKey]: item.avatarVal };
  }
}

  if (item.behavior === "consumable_stack") {
      update.inventory_counts = { ...inventoryCounts, [item.id]: (inventoryCounts[item.id] || 0) + 1 };
    }

    if (item.behavior === "timed") {
      const key = item.timedKey;
      const existing = progress[key] && new Date(progress[key]).getTime() > Date.now()
        ? new Date(progress[key]).getTime() : Date.now();
      update[key] = new Date(existing + item.duration).toISOString();
      update.owned_items = [...new Set([...ownedItems, item.id])];
      // Streak freeze special
      if (item.id === "shield") {
        update.streak_freeze_expiry = update[key];
        delete update[key];
      }
    }

    if (item.behavior === "toggle") {
      update.owned_items = [...new Set([...ownedItems, item.id])];
      if (item.toggleKey) update[item.toggleKey] = true;
    }

    if (item.behavior === "theme") {
      update.owned_items = [...new Set([...ownedItems, item.id])];
      // Auto-equip on purchase
      setActiveTheme(item.themeKey);
      setActiveThemeState(item.themeKey);
      update.active_theme = item.themeKey;
    }

    // Badge tracking
    update.badge_gems_spent = (progress.badge_gems_spent || 0) + item.price;
    update.badge_shop_purchases = (progress.badge_shop_purchases || 0) + 1;
    if ((update.gems || (progress.gems - item.price)) > (progress.badge_peak_gems || 0)) {
      update.badge_peak_gems = progress.gems - item.price;
    }

    const newProgress = await updateProgress(progress, update);

    // Badge check
    const { checkNewBadges, buildBadgeUpdate } = await import("../lib/badges");
    const newBadges = checkNewBadges(newProgress);
    if (newBadges.length) {
      const badgeUpd = buildBadgeUpdate(newProgress, newBadges);
      const withBadges = await updateProgress(newProgress, badgeUpd);
      setProgress(withBadges);
      setBadgeQueue(q => [...q, ...newBadges]);
    } else {
      setProgress(newProgress);
    }
    toast.success("Acquired! 📦");
  }

  async function handleToggle(item) {
    const update = {};

    if (item.behavior === "timed") {
      // Cancel early
      if (item.timedKey) update[item.timedKey] = null;
      if (item.id === "shield") update.streak_freeze_expiry = null;
    }

    if (item.behavior === "toggle" && item.toggleKey) {
      update[item.toggleKey] = !progress[item.toggleKey];
    }

    setProgress(await updateProgress(progress, update));
    toast.success("Updated ✓");
  }

  async function handleThemeEquip(item) {
    const owned = ownedItems.includes(item.id) || item.price === 0;
    if (!owned) return;

    if (activeTheme === item.themeKey) {
      // Unequip → revert to dark-galaxy
      setActiveTheme("dark-galaxy");
      setActiveThemeState("dark-galaxy");
      await updateProgress(progress, { active_theme: "dark-galaxy" });
    } else {
      setActiveTheme(item.themeKey);
      setActiveThemeState(item.themeKey);
      await updateProgress(progress, { active_theme: item.themeKey });
    }
  }

  async function handleThemeBuy(item) {
    if (progress.gems < item.price) {
      toast.error(`Need ${item.price - progress.gems} more 💎`);
      return;
    }
    playChaChig();
    spawnFloat(item.price);
    const newOwned = [...new Set([...ownedItems, item.id])];
    setActiveTheme(item.themeKey);
    setActiveThemeState(item.themeKey);
    setProgress(await updateProgress(progress, { gems: progress.gems - item.price, owned_items: newOwned, active_theme: item.themeKey }));
    toast.success("Theme unlocked! 🎨");
  }

  // Active boosts
  const xpBoostMs = progress.xp_boost_until ? Math.max(0, new Date(progress.xp_boost_until).getTime() - now) : 0;
  const goldThemeMs = progress.gold_theme_until ? Math.max(0, new Date(progress.gold_theme_until).getTime() - now) : 0;
  const xpMagnetMs = progress.xp_magnet_until ? Math.max(0, new Date(progress.xp_magnet_until).getTime() - now) : 0;
  const gemMultMs = progress.gem_multiplier_until ? Math.max(0, new Date(progress.gem_multiplier_until).getTime() - now) : 0;
  const streakFreezeMs = progress.streak_freeze_expiry ? Math.max(0, new Date(progress.streak_freeze_expiry).getTime() - now) : 0;

  const prestigeScore = ownedItems.reduce((sum, id) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    return sum + (item?.prestige || 0);
  }, 0);

  const themeItems = SHOP_ITEMS.filter(i => i.behavior === "theme");
  const nonThemeItems = SHOP_ITEMS.filter(i => i.behavior !== "theme");
  const visibleItems = activeTab === "all"
    ? nonThemeItems
    : activeTab === "themes"
    ? themeItems
    : nonThemeItems.filter(i => i.cat === activeTab);

const allTabItems = activeTab === "all" ? nonThemeItems : null;
const allTabThemes = activeTab === "all" ? themeItems : null;

  return (
    <div className="min-h-screen pb-24 relative bg-background">
      <BadgeToast badge={currentBadgeToast} onDone={() => setCurrentBadgeToast(null)} />
      {floats.map(f => <FloatingMinus key={f.id} item={f} />)}

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="shopgrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#00F2FF" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shopgrid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-black tracking-tight"
              style={{ color: "hsl(var(--primary))", textShadow: "0 0 16px hsl(var(--primary) / 0.4)", letterSpacing: "-0.02em" }}>
              ASSET EXCHANGE
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Premium Trading Interface</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <motion.div animate={shakeGems ? { x: [-5, 5, -3, 3, 0] } : {}} transition={{ duration: 0.4 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.2)" }}>
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-sm font-black text-cyan-400">{progress.gems}</span>
            </motion.div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ background: "rgba(241,196,15,0.08)", border: "1px solid rgba(241,196,15,0.2)" }}>
              <TrendingUp className="w-3 h-3 text-yellow-400" />
              <span className="text-[10px] font-black text-yellow-400">PRESTIGE {prestigeScore}</span>
            </div>
          </div>
        </div>

        {/* Active boosts strip */}
        {(xpBoostMs > 0 || goldThemeMs > 0 || streakFreezeMs > 0 || xpMagnetMs > 0 || gemMultMs > 0) && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {xpBoostMs > 0 && <TimerBadge label={progress.flash_surge_active ? "3× XP" : "2× XP"} ms={xpBoostMs} color="#F1C40F" />}
            {xpMagnetMs > 0 && <TimerBadge label="+25% XP" ms={xpMagnetMs} color="#C084FC" />}
            {gemMultMs > 0 && <TimerBadge label="💰 1.5× Gems" ms={gemMultMs} color="#2ECC71" />}
            {goldThemeMs > 0 && <TimerBadge label="Gold UI" ms={goldThemeMs} color="#F1C40F" />}
            {streakFreezeMs > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.25)", color: "#00F2FF" }}>
                <ShieldCheck className="w-3 h-3" /> Streak Frozen · {fmtMs(streakFreezeMs)}
              </div>
            )}
          </div>
        )}

        {/* Flash sale */}
        <FlashSale onBuy={item => handleBuy(item)} ownedItems={ownedItems} gems={progress.gems} />

        {/* Rarity legend */}
        <div className="flex gap-2 flex-wrap mb-3">
          {Object.entries(RARITY_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: meta.color, boxShadow: `0 0 4px ${meta.color}` }} />
              <span className="text-[9px] font-bold" style={{ color: meta.color }}>{meta.label}</span>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          {CATEGORY_TABS.map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all"
              style={{
                background: activeTab === tab.key ? "rgba(0,242,255,0.12)" : "hsl(var(--muted))",
                border: `1px solid ${activeTab === tab.key ? "rgba(0,242,255,0.4)" : "hsl(var(--border))"}`,
                color: activeTab === tab.key ? "#00F2FF" : "hsl(var(--muted-foreground))",
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Theme items */}
        {activeTab === "themes" && (
          <div className="flex flex-col gap-2.5">
            {themeItems.map(item => {
              const isOwned = ownedItems.includes(item.id) || item.price === 0;
              const isEquipped = activeTheme === item.themeKey;
              const canAfford = progress.gems >= item.price;
              return (
                <ThemeCard key={item.id} item={item} isOwned={isOwned} isEquipped={isEquipped}
                  canAfford={canAfford}
                  onBuy={() => handleThemeBuy(item)}
                  onEquip={() => handleThemeEquip(item)} />
              );
            })}
          </div>
        )}

      {/* Regular item grid */}
      {activeTab !== "themes" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {visibleItems.map(item => (
              <ShopCard
                key={item.id}
                item={item}
                progress={progress}
                now={now}
                onBuy={() => handleBuy(item)}
                onToggle={() => handleToggle(item)}
                onUse={() => {}}
              />
            ))}
          </div>

          {activeTab === "all" && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-2">
                🎨 Themes <span className="normal-case font-normal">(Dark mode only)</span>
              </p>
              <div className="flex flex-col gap-2.5">
                {themeItems.map(item => {
                  const isOwned = ownedItems.includes(item.id) || item.price === 0;
                  const isEquipped = activeTheme === item.themeKey;
                  const canAfford = progress.gems >= item.price;
                  return (
                    <ThemeCard key={item.id} item={item} isOwned={isOwned} isEquipped={isEquipped}
                      canAfford={canAfford}
                      onBuy={() => handleThemeBuy(item)}
                      onEquip={() => handleThemeEquip(item)} />
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
      </div>
    </div>
  );
}