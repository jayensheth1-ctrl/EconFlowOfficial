import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Gem } from "lucide-react";
import { updateProgress } from "../../lib/progressUtils";
import { playChaChig } from "../../lib/sounds";
import { pickCatalyst } from "../../lib/catalystEvents";
import CatalystToast from "./CatalystToast";

const TICKERS_P1 = {
  STABL: { label: "STABL", name: "Blue Chip Index",  color: "#2ECC71", risk: "Low",    vol: 1.2, startCash: 1000 },
  GLOW:  { label: "GLOW",  name: "Tech Startup",     color: "#00F2FF", risk: "Med",    vol: 3.5, startCash: 1000 },
  CRPT:  { label: "CRPT",  name: "Digital Asset",    color: "#E74C3C", risk: "High",   vol: 8,   startCash: 1000 },
};
const TICKERS_P2 = {
  GOLD:  { label: "GOLD",  name: "Gold Futures",     color: "#FFD700", risk: "Med",    vol: 2.5, startCash: 1000 },
  OIL:   { label: "OIL",   name: "Crude Oil",        color: "#F97316", risk: "High",   vol: 5,   startCash: 1000 },
  EURO:  { label: "EURO",  name: "EUR/USD Forex",    color: "#60A5FA", risk: "Low",    vol: 1.0, startCash: 1000 },
  BTC:   { label: "BTC",   name: "Bitcoin",          color: "#FB923C", risk: "Extreme",vol: 14,  startCash: 1000 },
};

const GEM_MODE_MAX_BUYS = 5;
const GEM_MODE_MAX_SELLS = 5;

function generateHistory(vol, len = 30) {
  const arr = [];
  let price = 100;
  for (let i = 0; i < len; i++) {
    price = Math.max(5, +(price + (Math.random() - 0.48) * vol).toFixed(2));
    arr.push({ t: i, price });
  }
  return arr;
}

function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const prices = data.slice(-12).map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 48, h = 20;
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  const up = prices[prices.length - 1] >= prices[0];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={up ? "#2ECC71" : "#E74C3C"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function StockSimulator({ progress, setProgress }) {
  const part2Unlocked = (progress?.owned_items || []).includes('part2-unlocked');
  const goldThemeActive = progress?.gold_theme_until && new Date(progress.gold_theme_until) > new Date();
  const TICKERS = part2Unlocked ? { ...TICKERS_P1, ...TICKERS_P2 } : TICKERS_P1;

  const [stocks, setStocks] = useState(() => {
    const init = {};
    Object.keys({ ...TICKERS_P1, ...TICKERS_P2 }).forEach(key => {
      const vol = ({ ...TICKERS_P1, ...TICKERS_P2 })[key]?.vol || 3;
      init[key] = generateHistory(vol, 30);
    });
    return init;
  });
  const tickRef = useRef(30);

  useEffect(() => {
    const ALL = { ...TICKERS_P1, ...TICKERS_P2 };
    const RISK_CONFIG = {
      'Low':     { interval: 3200, volMult: 0.7 },
      'Med':     { interval: 2000, volMult: 1.1 },
      'High':    { interval: 1100, volMult: 1.8 },
      'Extreme': { interval: 600,  volMult: 2.8 },
    };
    const timers = Object.keys(ALL).map(key => {
      const cfg = RISK_CONFIG[ALL[key].risk] || { interval: 2000, volMult: 1 };
      const vol = ALL[key].vol * cfg.volMult;
      const id = setInterval(() => {
        const t = tickRef.current++;
        setStocks(prev => {
          const h = prev[key] || [];
          const last = h[h.length - 1]?.price ?? 100;
          const price = Math.max(5, +(last + (Math.random() - 0.48) * vol).toFixed(2));
          return { ...prev, [key]: [...h.slice(-59), { t, price }] };
        });
      }, cfg.interval);
      return id;
    });
    return () => timers.forEach(clearInterval);
  }, []);

  const [activeTicker, setActiveTicker] = useState("STABL");
  const [won, setWon] = useState({});
  const [livePulse, setLivePulse] = useState(true);
  const [buyQty, setBuyQty] = useState(1);
  const [sellQty, setSellQty] = useState(1);
  const [catalystEvent, setCatalystEvent] = useState(null);
  const [pulseTickers, setPulseTickers] = useState({});
  const sliderOpenRef = useRef(false);
  const lastAbsurdRef = useRef(false);
  const catalystRef = useRef(null); // active catalyst boosts: { [ticker]: { pctPerTick, ticksLeft } }
  catalystRef.current = catalystRef.current || {};

  useEffect(() => {
    const id = setInterval(() => setLivePulse(p => !p), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Catalyst event system ────────────────────────────────────────────────
  const catalystBoostsRef = useRef({}); // { [ticker]: { boost, ticksLeft } }
  const baselineHistoryRef = useRef({}); // saved history before catalyst boost

  useEffect(() => {
    const availableTickers = Object.keys(TICKERS);

    // Apply gradual boosts every tick (2s)
    const boostInterval = setInterval(() => {
      const boosts = catalystBoostsRef.current;
      const active = Object.keys(boosts).filter(t => boosts[t].ticksLeft > 0);
      if (active.length === 0) return;
      setStocks(prev => {
        const next = { ...prev };
        active.forEach(t => {
          const h = prev[t] || [];
          const last = h[h.length - 1]?.price ?? 100;
          const tick = boosts[t];
          const nudge = last * tick.boost;
          const newPrice = Math.max(5, +(last + nudge).toFixed(2));
          next[t] = [...h.slice(-59), { t: Date.now(), price: newPrice }];
          catalystBoostsRef.current[t] = { ...tick, ticksLeft: tick.ticksLeft - 1 };
        });
        return next;
      });
    }, 2000);

    // Fire catalyst events every 45-90 seconds
    function scheduleNext() {
      const delay = 45000 + Math.random() * 45000;
      return setTimeout(() => {
        if (sliderOpenRef.current) {
          // Slider open — delay by 5s and retry
          setTimeout(scheduleNext, 5000);
          return;
        }
        const event = pickCatalyst(availableTickers, lastAbsurdRef.current);
        lastAbsurdRef.current = event.isAbsurd;

        // Set toast
        setCatalystEvent(event);

        // Set pulse on affected tickers
        const pulseMap = {};
        Object.keys(event.affects).forEach(t => { pulseMap[t] = true; });
        setPulseTickers(pulseMap);
        setTimeout(() => setPulseTickers({}), 3000);

        // Save baseline histories before applying boosts
        setStocks(prev => {
          Object.keys(event.affects).forEach(t => {
            if (availableTickers.includes(t)) {
              baselineHistoryRef.current[t] = prev[t] ? [...prev[t]] : [];
            }
          });
          return prev;
        });

        // Apply boost gradually over ~10 seconds (5 ticks × 2s)
        const TOTAL_TICKS = 5;
        Object.entries(event.affects).forEach(([t, totalPct]) => {
          if (!availableTickers.includes(t)) return;
          const boostPerTick = totalPct / TOTAL_TICKS;
          catalystBoostsRef.current[t] = { boost: boostPerTick, ticksLeft: TOTAL_TICKS };
        });

        // Hide toast after 6s
        setTimeout(() => setCatalystEvent(null), 6000);

        // Revert graph to baseline after 10s
        setTimeout(() => {
          setStocks(prev => {
            const next = { ...prev };
            Object.keys(event.affects).forEach(t => {
              if (baselineHistoryRef.current[t]) {
                next[t] = baselineHistoryRef.current[t];
                delete baselineHistoryRef.current[t];
              }
            });
            // Also cancel any remaining boosts for these tickers
            Object.keys(event.affects).forEach(t => {
              if (catalystBoostsRef.current[t]) {
                catalystBoostsRef.current[t] = { boost: 0, ticksLeft: 0 };
              }
            });
            return next;
          });
        }, 10000);

        scheduleNext();
      }, delay);
    }

    const firstTimeout = scheduleNext();
    return () => {
      clearInterval(boostInterval);
      clearTimeout(firstTimeout);
    };
  }, []);

  // ── Gem Mode state (persisted in progress) ───────────────────────────────
  // Check if gem mode should reset (new day)
const today = new Date().toISOString().split("T")[0];
const gemModeLastReset = progress?.gem_mode_last_reset;
const shouldResetGemMode = gemModeLastReset !== today;

const gemModeEnabled  = shouldResetGemMode ? false : (progress?.gem_mode_enabled ?? false);
const gemModeLocked   = shouldResetGemMode ? false : (progress?.gem_mode_locked ?? false);
const gemBuysLeft     = shouldResetGemMode ? GEM_MODE_MAX_BUYS : (progress?.gem_buys_left ?? GEM_MODE_MAX_BUYS);
const gemSellsLeft    = shouldResetGemMode ? GEM_MODE_MAX_SELLS : (progress?.gem_sells_left ?? GEM_MODE_MAX_SELLS);

// Auto-reset gem mode if it's a new day
if (shouldResetGemMode && progress?.id) {
  updateProgress(progress, {
    gem_mode_enabled: false,
    gem_mode_locked: false,
    gem_buys_left: GEM_MODE_MAX_BUYS,
    gem_sells_left: GEM_MODE_MAX_SELLS,
    gem_mode_last_reset: today,
  }).then(updated => setProgress(updated));
}
  // gem positions stored separately: gem_positions[ticker] = { shares, entryPrice }
  const gemPositions    = progress?.gem_positions   ?? {};

  async function toggleGemMode() {
    if (gemModeLocked) return;
    const turning_on = !gemModeEnabled;
    await updateProgress(progress, { gem_mode_enabled: turning_on });
    setProgress({ ...progress, gem_mode_enabled: turning_on });
    setBuyQty(1); setSellQty(1);
  }

  // ── Normal cash mode state ───────────────────────────────────────────────
  const ticker      = TICKERS[activeTicker] || TICKERS_P1.STABL;
  const history     = stocks[activeTicker] || [];
  const currentPrice= history[history.length - 1]?.price ?? 100;
  const prevPrice   = history[history.length - 2]?.price ?? 100;
  const trending    = currentPrice >= prevPrice;
  const profitColor = goldThemeActive ? "#F1C40F" : "#2ECC71";

  const positions   = progress?.stock_positions || {};
  const pos         = positions[activeTicker];
  const cash        = pos?.cash ?? ticker.startCash;
  const shares      = pos?.shares ?? 0;
  const entryPrice  = pos?.entryPrice ?? null;
  const portfolio   = cash + shares * currentPrice;
  const pnl         = entryPrice ? ((currentPrice - entryPrice) / entryPrice * 100).toFixed(1) : null;

  // Cash mode buy qty — max affordable shares
  const maxCashBuy  = shares === 0 ? Math.max(1, Math.floor(cash / currentPrice)) : 0;

  // ── Gem Mode position for active ticker ─────────────────────────────────
  const gemPos       = gemPositions[activeTicker] || { shares: 0, entryPrice: null };
  const gemShares    = gemPos.shares || 0;
  const gemEntry     = gemPos.entryPrice || null;

  const userGems     = progress?.gems ?? 0;
  const maxBuyQty    = gemModeEnabled ? Math.min(userGems, GEM_MODE_MAX_BUYS * 10) : 1; // arbitrary cap for slider
  const maxSellQty   = gemShares;

  // Sell return estimate for Gem Mode
  function calcGemSellReturn(qty) {
    if (!gemEntry) return qty;
    const diff = currentPrice - gemEntry;
    if (Math.abs(diff) < 0.5) return qty; // flat
    if (diff > 0) {
      // Stock went up: return qty + bonus 1..10
      return { min: qty + 1, max: qty + 10 };
    } else {
      // Stock went down: penalize 1 gem per share dropped
      const penalty = Math.min(qty, Math.floor(Math.abs(diff) / gemEntry * qty * 10));
      return Math.max(0, qty - penalty);
    }
  }

  const gemSellEstimate = gemModeEnabled && gemShares > 0 ? calcGemSellReturn(sellQty) : null;

  // ── Buy ──────────────────────────────────────────────────────────────────
  async function handleBuy() {
    if (gemModeEnabled) {
      if (gemBuysLeft <= 0 || buyQty > userGems) return;
      const newGemPos = {
        ...gemPositions,
        [activeTicker]: {
          shares: gemShares + buyQty,
          entryPrice: gemShares > 0 ? gemEntry : currentPrice, // keep original entry if adding
        },
      };
      const newBuysLeft = gemBuysLeft - 1;
      const newLocked = newBuysLeft <= 0 && gemSellsLeft <= 0;
      const update = {
        gems: userGems - buyQty,
        gem_positions: newGemPos,
        gem_buys_left: newBuysLeft,
        ...(newLocked ? { gem_mode_locked: true, gem_mode_enabled: false } : {}),
      };
      setProgress(await updateProgress(progress, update));
      setBuyQty(1);
      if (newLocked) alert("Gem trades used up. Reverting to cash mode.");
    } else {
      // Normal cash mode
      if (shares > 0 || cash < currentPrice || buyQty < 1) return;
      const qty = Math.min(buyQty, Math.floor(cash / currentPrice));
      if (qty < 1) return;
      const newPos = { ...positions, [activeTicker]: { shares: qty, entryPrice: currentPrice, cash: cash - qty * currentPrice } };
setProgress(await updateProgress(progress, { 
  stock_positions: newPos,
  badge_first_trade_done: true 
}));
      setBuyQty(1);
    }
  }

  // ── Sell ─────────────────────────────────────────────────────────────────
  async function handleSell() {
    if (gemModeEnabled) {
      if (gemSellsLeft <= 0 || gemShares === 0 || sellQty > gemShares) return;
      // Calculate payout
      let payout;
      const raw = calcGemSellReturn(sellQty);
      if (typeof raw === "object") {
        // stock up — random bonus between 1 and 10
        const bonus = Math.floor(Math.random() * 10) + 1;
        payout = sellQty + bonus;
      } else {
        payout = raw;
      }
      const remainingShares = gemShares - sellQty;
      const newGemPos = {
        ...gemPositions,
        [activeTicker]: {
          shares: remainingShares,
          entryPrice: remainingShares > 0 ? gemEntry : null,
        },
      };
      const newSellsLeft = gemSellsLeft - 1;
      const newLocked = gemBuysLeft <= 0 && newSellsLeft <= 0;
      const update = {
        gems: userGems + payout,
        gem_positions: newGemPos,
        gem_sells_left: newSellsLeft,
        ...(newLocked ? { gem_mode_locked: true, gem_mode_enabled: false } : {}),
      };
      if (payout > sellQty) playChaChig();
      setProgress(await updateProgress(progress, update));
      setSellQty(1);
      if (newLocked) alert("Gem trades used up. Reverting to cash mode.");
    } else {
      // Normal cash mode
      if (shares === 0) return;
      const qty = Math.min(sellQty, shares);
      const proceeds = qty * currentPrice;
      const remainingShares = shares - qty;
      const newCash = cash + proceeds;
      const newPos = {
        ...positions,
        [activeTicker]: {
          shares: remainingShares,
          entryPrice: remainingShares > 0 ? entryPrice : null,
          cash: newCash,
        },
      };
      const totalValue = newCash + remainingShares * currentPrice;
      if (totalValue >= ticker.startCash * 2 && !won[activeTicker]) {
        setWon(w => ({ ...w, [activeTicker]: true }));
        playChaChig();
        const gemUpdate = { gems: (progress.gems || 0) + 20, xp: (progress.xp || 0) + 20, stock_positions: newPos };
        setProgress(await updateProgress(progress, gemUpdate));
        setSellQty(1);
        return;
      }
      const isProfitable = currentPrice > entryPrice;
setProgress(await updateProgress(progress, { 
  stock_positions: newPos,
  badge_first_trade_done: true,
  ...(isProfitable ? { badge_profitable_trade_done: true } : {})
}));
setSellQty(1);
    }
  }

  // ── Gem Mode buy button state ────────────────────────────────────────────
  const gemBuyDisabled = gemBuysLeft <= 0 || buyQty > userGems || buyQty < 1;
  const gemSellDisabled = gemSellsLeft <= 0 || gemShares === 0 || sellQty > gemShares || sellQty < 1;

  return (
    <div className="flex flex-col gap-4">
      <CatalystToast event={catalystEvent} />
      {part2Unlocked && (
        <div className="text-center text-[10px] font-bold rounded-lg py-1"
          style={{ background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.4)", color: "#C084FC" }}>
          🌍 GLOBAL MARKETS UNLOCKED — 7 Assets Available
        </div>
      )}

      {/* ── Gem Mode Toggle ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl"
        style={{ background: gemModeLocked ? "rgba(255,255,255,0.03)" : "rgba(0,242,255,0.06)", border: `1px solid ${gemModeLocked ? "rgba(255,255,255,0.08)" : "rgba(0,242,255,0.2)"}` }}>
        <div className="flex items-center gap-2">
          <Gem className="w-4 h-4" style={{ color: gemModeLocked ? "#444" : "#00F2FF" }} />
          <div>
            <p className="text-xs font-black" style={{ color: gemModeLocked ? "#555" : "#00F2FF" }}>
              GEM MODE {gemModeLocked ? "— LOCKED" : ""}
            </p>
            {gemModeLocked ? (
              <p className="text-[9px] text-gray-600">All gem trades used. Cash mode only.</p>
            ) : gemModeEnabled ? (
              <p className="text-[9px]" style={{ color: "rgba(0,242,255,0.6)" }}>
                {gemBuysLeft} buys / {gemSellsLeft} sells remaining
              </p>
            ) : (
              <p className="text-[9px] text-gray-600">Use 💎 instead of $</p>
            )}
          </div>
        </div>
        <button
          onClick={toggleGemMode}
          disabled={gemModeLocked}
          className="relative w-11 h-6 rounded-full transition-all disabled:opacity-40"
          style={{ background: gemModeEnabled ? "#00F2FF" : "rgba(255,255,255,0.1)" }}>
          <motion.div
            animate={{ x: gemModeEnabled ? 20 : 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
          />
        </button>
      </div>

      {/* Ticker tabs */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(TICKERS).map(([key, t]) => {
          const h = stocks[key] || [];
          const price = h[h.length - 1]?.price ?? 100;
          const prev = h[h.length - 2]?.price ?? 100;
          const up = price >= prev;
          const isPulsing = !!pulseTickers[key];
          return (
            <button key={key} onClick={() => { setActiveTicker(key); setBuyQty(1); setSellQty(1); }}
              className="flex-1 rounded-xl p-2 text-center transition-all"
              style={{
                background: activeTicker === key ? `${t.color}22` : "rgba(255,255,255,0.04)",
                border: `1px solid ${isPulsing ? "#F1C40F" : activeTicker === key ? t.color : "rgba(255,255,255,0.08)"}`,
                boxShadow: isPulsing ? "0 0 18px rgba(241,196,15,0.6)" : activeTicker === key ? `0 0 12px ${t.color}40` : "none",
                minWidth: 56,
                transition: "box-shadow 0.3s, border-color 0.3s",
              }}>
              <p className="text-[11px] font-black" style={{ color: activeTicker === key ? t.color : "#999" }}>{key}</p>
              <div className="flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: up ? "#2ECC71" : "#E74C3C", boxShadow: livePulse ? `0 0 6px ${up ? "#2ECC71" : "#E74C3C"}` : "none", transition: "box-shadow 0.5s" }} />
                <p className={`text-[10px] font-bold ${up ? "text-green-400" : "text-red-400"}`}>
                {gemModeEnabled ? <><Gem className="inline w-2.5 h-2.5 mr-0.5" />{price.toFixed(2)}</> : `$${price.toFixed(2)}`}
              </p>
              </div>
              <div className="flex justify-center mt-0.5">
                <Sparkline data={h} color={t.color} />
              </div>
            </button>
          );
        })}
      </div>

      {won[activeTicker] && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="rounded-xl p-3 text-center border-2"
          style={{ background: "rgba(0,242,255,0.08)", borderColor: "#00F2FF" }}>
          <p className="text-lg font-black" style={{ color: "#00F2FF" }}>🐺 Market Legend! +20 Gems</p>
        </motion.div>
      )}

      {/* Price header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400">{ticker.name} · <span className="text-[10px]">{ticker.risk} Risk</span></p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
            {gemModeEnabled
              ? <><Gem className="w-6 h-6" style={{ color: trending ? profitColor : "#E74C3C" }} /><p className="text-3xl font-black" style={{ color: trending ? profitColor : "#E74C3C" }}>{currentPrice.toFixed(2)}</p></>
              : <p className="text-3xl font-black" style={{ color: trending ? profitColor : "#E74C3C" }}>${currentPrice.toFixed(2)}</p>
            }
          </div>
            <div className="flex items-center gap-1">
              <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[9px] font-bold text-green-400">LIVE</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          {gemModeEnabled ? (
            <>
              <p className="text-xs text-gray-400">Gem Balance</p>
              <div className="flex items-center gap-1 justify-end">
                <Gem className="w-4 h-4 text-cyan-400" />
                <p className="text-xl font-bold text-cyan-400">{userGems}</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400">Portfolio</p>
              <p className="text-xl font-bold" style={{ color: portfolio >= ticker.startCash ? profitColor : "#E74C3C" }}>${portfolio.toFixed(0)}</p>
            </>
          )}
        </div>
      </div>

      {/* Main chart */}
      <div className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ticker.color}22` }}>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={history} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="t" hide />
            <YAxis domain={["auto", "auto"]} tick={{ fill: "#555", fontSize: 9 }}
              tickFormatter={v => gemModeEnabled ? `💎${v}` : `$${v}`} />
            {!gemModeEnabled && entryPrice && <ReferenceLine y={entryPrice} stroke="#F1C40F" strokeDasharray="4 2" />}
            {gemModeEnabled && gemEntry && <ReferenceLine y={gemEntry} stroke="#00F2FF" strokeDasharray="4 2" />}
            <Line type="monotone" dataKey="price"
              stroke={trending ? profitColor : "#E74C3C"}
              strokeWidth={2.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats row */}
      {gemModeEnabled ? (
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Gem Shares", value: gemShares, color: "#00F2FF" },
            { label: "Buys Left", value: gemBuysLeft, color: gemBuysLeft > 0 ? "#2ECC71" : "#E74C3C" },
            { label: "Sells Left", value: gemSellsLeft, color: gemSellsLeft > 0 ? "#2ECC71" : "#E74C3C" },
          ].map((s, i) => (
            <div key={i} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-bold text-white">${cash.toFixed(0)}</p>
            <p className="text-[10px] text-gray-500">Cash</p>
          </div>
          <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-bold text-white">{shares}</p>
            <p className="text-[10px] text-gray-500">Shares</p>
          </div>
          <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-bold" style={{ color: pnl > 0 ? profitColor : pnl < 0 ? "#E74C3C" : "#666" }}>
              {pnl ? `${pnl > 0 ? "+" : ""}${pnl}%` : "—"}
            </p>
            <p className="text-[10px] text-gray-500">P&L</p>
          </div>
        </div>
      )}

      {/* ── Sliders ─────────────────────────────────────────────── */}
      {gemModeEnabled ? (
        <div className="flex flex-col gap-3 p-3 rounded-xl"
          style={{ background: "rgba(0,242,255,0.04)", border: "1px solid rgba(0,242,255,0.15)" }}>

          {/* Gem buy slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-cyan-400">Buy {buyQty} share{buyQty !== 1 ? "s" : ""} for {buyQty} gems</span>
              <span className="text-[10px] text-gray-500">≈ <Gem className="inline w-2.5 h-2.5" />{buyQty}</span>
            </div>
            <input type="range" min={1} max={Math.max(1, userGems)} value={Math.min(buyQty, userGems)}
              onChange={e => setBuyQty(Number(e.target.value))}
              disabled={gemBuysLeft <= 0}
              className="w-full accent-cyan-400" />
            {buyQty > userGems && (
              <p className="text-[10px] text-red-400 mt-1">Not enough gems — you have {userGems} 💎</p>
            )}
          </div>

          {/* Gem sell slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold" style={{ color: "#E74C3C" }}>Sell {sellQty} shares</span>
              <span className="text-[10px] text-gray-500">
                {gemSellEstimate === null ? "no shares held" :
                  typeof gemSellEstimate === "object"
                    ? `+${gemSellEstimate.min} to +${gemSellEstimate.max} 💎`
                    : gemSellEstimate < sellQty
                      ? `-${sellQty - gemSellEstimate} 💎 est.`
                      : `${gemSellEstimate} 💎 est.`}
              </span>
            </div>
            <input type="range" min={1} max={Math.max(1, maxSellQty)} value={Math.min(sellQty, Math.max(1, maxSellQty))}
              onChange={e => setSellQty(Number(e.target.value))}
              disabled={gemSellsLeft <= 0 || gemShares === 0}
              className="w-full accent-red-400" />
          </div>
        </div>
      ) : (
        /* Cash mode sliders */
        <div className="flex flex-col gap-2"
          onMouseEnter={() => { sliderOpenRef.current = true; }}
          onMouseLeave={() => { sliderOpenRef.current = false; }}
          onTouchStart={() => { sliderOpenRef.current = true; }}
          onTouchEnd={() => { sliderOpenRef.current = false; }}>
          {/* Buy slider — only when no shares held */}
          {shares === 0 && maxCashBuy > 0 && (
            <div className="p-3 rounded-xl" style={{ background: "rgba(46,204,113,0.04)", border: "1px solid rgba(46,204,113,0.15)" }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-green-400">Buy {buyQty} share{buyQty !== 1 ? "s" : ""}</span>
                <span className="text-[10px] text-gray-500">≈ ${(buyQty * currentPrice).toFixed(0)} of ${cash.toFixed(0)}</span>
              </div>
              <input type="range" min={1} max={maxCashBuy} value={Math.min(buyQty, maxCashBuy)}
                onChange={e => setBuyQty(Number(e.target.value))}
                className="w-full accent-green-400" />
            </div>
          )}
          {/* Sell slider — only when holding shares */}
          {shares > 0 && (
            <div className="p-3 rounded-xl" style={{ background: "rgba(231,76,60,0.04)", border: "1px solid rgba(231,76,60,0.15)" }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold" style={{ color: "#E74C3C" }}>Sell {sellQty} of {shares} share{shares !== 1 ? "s" : ""}</span>
                <span className="text-[10px] text-gray-500">≈ ${(sellQty * currentPrice).toFixed(0)}</span>
              </div>
              <input type="range" min={1} max={shares} value={sellQty}
                onChange={e => setSellQty(Number(e.target.value))}
                className="w-full accent-red-400" />
            </div>
          )}
        </div>
      )}

      {/* Buy/Sell buttons */}
      <div className="flex gap-3">
        <motion.button whileTap={{ scale: 0.93 }}
          onClick={handleBuy}
          disabled={gemModeEnabled ? gemBuyDisabled : (shares > 0 || cash < currentPrice)}
          className="flex-1 py-3.5 rounded-xl font-extrabold text-sm text-white disabled:opacity-40"
          style={{ background: `linear-gradient(135deg,${profitColor},#27ae60)`, boxShadow: `0 0 14px ${profitColor}55` }}>
          {gemModeEnabled ? (
            <span className="flex items-center justify-center gap-1">
              📈 BUY <Gem className="w-3.5 h-3.5" />
            </span>
          ) : "📈 BUY"}
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }}
          onClick={handleSell}
          disabled={gemModeEnabled ? gemSellDisabled : shares === 0}
          className="flex-1 py-3.5 rounded-xl font-extrabold text-sm text-white disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#E74C3C,#c0392b)", boxShadow: "0 0 14px rgba(231,76,60,0.35)" }}>
          {gemModeEnabled ? (
            <span className="flex items-center justify-center gap-1">
              📉 SELL <Gem className="w-3.5 h-3.5" />
            </span>
          ) : "📉 SELL"}
        </motion.button>
      </div>
    </div>
  );
}