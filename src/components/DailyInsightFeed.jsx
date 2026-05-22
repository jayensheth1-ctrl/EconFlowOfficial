import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TICKERS = {
  STABL: { risk: "Low",     type: "bonds"  },
  GLOW:  { risk: "Med",     type: "stocks" },
  CRPT:  { risk: "High",    type: "stocks" },
  GOLD:  { risk: "Med",     type: "gold"   },
  OIL:   { risk: "High",    type: "stocks" },
  EURO:  { risk: "Low",     type: "bonds"  },
  BTC:   { risk: "Extreme", type: "stocks" },
};

function analyzePortfolio(positions) {
  if (!positions || Object.keys(positions).length === 0) return null;

  let totalValue = 0;
  let bondsValue = 0;
  let stocksValue = 0;
  let goldValue = 0;

  Object.entries(positions).forEach(([ticker, pos]) => {
    const { shares = 0, cash = 1000, entryPrice = 0 } = pos;
    const approxValue = shares > 0 ? shares * entryPrice : cash;
    const meta = TICKERS[ticker];
    if (!meta) return;
    totalValue += approxValue;
    if (meta.type === "bonds")  bondsValue  += approxValue;
    if (meta.type === "stocks") stocksValue += approxValue;
    if (meta.type === "gold")   goldValue   += approxValue;
  });

  if (totalValue === 0) return null;

  const bondsPct  = Math.round((bondsValue  / totalValue) * 100);
  const stocksPct = Math.round((stocksValue / totalValue) * 100);
  const goldPct   = Math.round((goldValue   / totalValue) * 100);

  return { bondsPct, stocksPct, goldPct, totalValue };
}

function generateInsights(analysis) {
  if (!analysis) return [{
  id: "get-started",
  emoji: "🚀",
  color: "#00F2FF",
  title: "Start building your portfolio",
  body: "Head to The Lab → Stocks to buy your first assets. Come back here for personalized portfolio analysis.",
  action: "Learn about diversification →",
  topic: "diversification",
  urgency: "medium",
}];
  const { bondsPct, stocksPct, goldPct } = analysis;
  const cards = [];

  if (goldPct < 10) {
    cards.push({
      id: "no-gold",
      emoji: "🥇",
      color: "#F1C40F",
      title: "You have no inflation shield",
      body: `Only ${goldPct}% of your portfolio is in gold. A market crash or inflation spike could hit hard. Add GOLD to protect yourself.`,
      action: "Learn how gold hedges inflation →",
      topic: "inflation",
      urgency: "high",
    });
  }

  if (stocksPct > 75) {
    cards.push({
      id: "too-risky",
      emoji: "⚠️",
      color: "#FF2244",
      title: "Portfolio is dangerously risky",
      body: `${stocksPct}% in stocks means a market crash could wipe out most of your gains. Add BONDS to stabilize.`,
      action: "Learn how to survive a crash →",
      topic: "crash",
      urgency: "high",
    });
  } else if (stocksPct < 20) {
    cards.push({
      id: "too-safe",
      emoji: "📉",
      color: "#FF6600",
      title: "Portfolio is too conservative",
      body: `Only ${stocksPct}% in stocks. You're missing out on long-term growth. Add some stocks to compound returns.`,
      action: "Learn about compound growth →",
      topic: "compound_interest",
      urgency: "medium",
    });
  }

  if (bondsPct < 15 && stocksPct > 50) {
    cards.push({
      id: "no-bonds",
      emoji: "💙",
      color: "#3B82F6",
      title: "No rate-hike protection",
      body: `${bondsPct}% in bonds. When interest rates rise, pure stock portfolios get hammered. Add short-term bonds.`,
      action: "Learn about rate hikes →",
      topic: "rate_hike",
      urgency: "medium",
    });
  }

  if (bondsPct >= 30 && stocksPct >= 30 && goldPct >= 10) {
    cards.push({
      id: "balanced",
      emoji: "✅",
      color: "#2ECC71",
      title: "Well-diversified portfolio!",
      body: `Bonds ${bondsPct}% · Stocks ${stocksPct}% · Gold ${goldPct}%. You're following the golden rule of diversification.`,
      action: "Review diversification principles →",
      topic: "diversification",
      urgency: "low",
    });
  }

  if (cards.length === 0) {
    cards.push({
      id: "get-started",
      emoji: "🚀",
      color: "#00F2FF",
      title: "Start building your portfolio",
      body: "Head to The Lab → Stocks to buy your first assets. Come back here for personalized portfolio analysis.",
      action: "Learn about diversification →",
      topic: "diversification",
      urgency: "medium",
    });
  }

  return cards;
}

export default function DailyInsightFeed({ progress }) {
  const analysis = useMemo(() => analyzePortfolio(progress?.stock_positions), [progress?.stock_positions]);
  const insights = useMemo(() => generateInsights(analysis), [analysis]);

  return (
    <div className="mx-4 mb-5">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-extrabold uppercase tracking-widest text-foreground/60">
          📊 Daily Portfolio Insight
        </p>
        <Link to="/knowledge" className="text-[10px] font-bold text-primary">
          View Wiki →
        </Link>
      </div>

      <div className="flex flex-col gap-2.5">
        {insights.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-4"
            style={{
              background: `${card.color}12`,
              border: `1.5px solid ${card.color}44`,
              boxShadow: card.urgency === "high" ? `0 0 16px ${card.color}28` : "none",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5">{card.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-foreground leading-tight mb-1">{card.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{card.body}</p>
                <Link
                  to={`/knowledge?topic=${card.topic}`}
                  className="text-[11px] font-bold"
                  style={{ color: card.color }}
                >
                  {card.action}
                </Link>
              </div>
              {card.urgency === "high" && (
                <span className="flex-shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: `${card.color}22`, color: card.color }}>
                  !
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}