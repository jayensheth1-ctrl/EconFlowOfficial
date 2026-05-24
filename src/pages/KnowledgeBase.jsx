import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Search } from "lucide-react";

export const KNOWLEDGE_CARDS = [
  {
    id: "inflation",
    emoji: "📛",
    title: "Hedging Against Inflation",
    tag: "Inflation",
    tagColor: "#FF2244",
    summary: "Inflation erodes the value of cash. Smart investors diversify into assets that rise WITH inflation.",
    tips: [
      { icon: "🥇", label: "Gold", desc: "Historically holds its value when inflation spikes. Collect Gold orbs to activate your shield." },
      { icon: "💙", label: "Bonds (TIPS)", desc: "Treasury Inflation-Protected Securities adjust their value with the inflation rate — stable and reliable." },
      { icon: "📈", label: "Stocks", desc: "Companies can raise prices, so revenues (and stock prices) tend to keep up with inflation long-term." },
    ],
    lesson: "A portfolio that's 40% bonds, 40% stocks, and 20% gold historically weathers inflation the best.",
    gameLink: "In Portfolio Pilot: collect BLUE BONDS + GOLD to stay protected during inflation storms.",
  },
  {
    id: "rate_hike",
    emoji: "⬆️",
    title: "Surviving Rate Hikes",
    tag: "Interest Rates",
    tagColor: "#FF6600",
    summary: "When central banks raise interest rates, borrowing becomes expensive and growth stocks often fall.",
    tips: [
      { icon: "💙", label: "Short-Duration Bonds", desc: "Short-term bonds are less sensitive to rate changes than long-term ones." },
      { icon: "🏦", label: "Financials & Banks", desc: "Banks earn more on loans when rates are high — a rare winner in rate-hike cycles." },
      { icon: "🥇", label: "Gold", desc: "Gold can act as a safe haven when rate hikes cause market uncertainty." },
    ],
    lesson: "Rate hikes slow everything down — rebalance toward defensive assets and avoid heavy debt positions.",
    gameLink: "In Portfolio Pilot: rate hike storms slow your ship. Stay in the center lane and collect GOLD shields.",
  },
  {
    id: "crash",
    emoji: "💥",
    title: "Surviving a Market Crash",
    tag: "Market Crash",
    tagColor: "#7C3AED",
    summary: "Crashes are inevitable. The investors who survive best are those who diversified BEFORE the crash.",
    tips: [
      { icon: "🥇", label: "Gold Shield", desc: "Gold is a classic safe haven — it often rises when stocks fall sharply." },
      { icon: "💙", label: "Government Bonds", desc: "Investors flee to safe bonds during crashes, pushing bond prices up." },
      { icon: "🗓️", label: "Dollar Cost Averaging", desc: "Keep buying small amounts during a crash — you're buying more shares at a discount." },
    ],
    lesson: "The worst time to sell is during a crash. History shows markets recover — diversified portfolios recover fastest.",
    gameLink: "In Portfolio Pilot: collect GOLD orbs to activate your crash shield before MARKET CRASH storms hit.",
  },
  {
    id: "diversification",
    emoji: "⚖️",
    title: "The Power of Diversification",
    tag: "Portfolio Balance",
    tagColor: "#00F2FF",
    summary: "Don't put all your eggs in one basket. Spreading risk across asset types is the #1 rule of investing.",
    tips: [
      { icon: "📊", label: "Asset Allocation", desc: "Mix stocks, bonds, and alternatives so a loss in one is offset by a gain in another." },
      { icon: "🌍", label: "Geographic Spread", desc: "Invest globally — when one country's economy dips, another may be booming." },
      { icon: "🔄", label: "Rebalancing", desc: "Periodically sell winners and buy losers to maintain your target allocation." },
    ],
    lesson: "A 60/40 stock-bond split has been the classic balanced portfolio for decades. Adjust based on your risk tolerance.",
    gameLink: "In Portfolio Pilot: keep your Portfolio Balance meter in the GREEN ZONE (30-70% stocks) to unlock the Bull Market!",
  },
  {
    id: "compound_interest",
    emoji: "📈",
    title: "Compound Interest: The 8th Wonder",
    tag: "Growth",
    tagColor: "#2ECC71",
    summary: "Albert Einstein allegedly called compound interest the eighth wonder of the world. Start early — time is your biggest asset.",
    tips: [
      { icon: "⏰", label: "Start Early", desc: "$100/month from age 20 grows to ~$350k by 65 at 7% return. Starting at 30? Only ~$170k." },
      { icon: "🔁", label: "Reinvest Returns", desc: "Always reinvest dividends and interest — this is what creates exponential growth." },
      { icon: "📆", label: "Be Consistent", desc: "Regular contributions beat trying to time the market every single time." },
    ],
    lesson: "The Rule of 72: divide 72 by your interest rate to find how many years it takes to double your money. At 8%, that's 9 years.",
    gameLink: "In EconFlow: maintain your daily streak to earn compound XP bonuses that grow your level faster!",
  },
];

export const GLOSSARY_TERMS = [
  { term: "Asset", emoji: "💎", definition: "Something valuable that you own, like money in the bank, a house, or stocks." },
  { term: "Bank", emoji: "🏦", definition: "A safe place to keep money. They pay you interest to keep it there and lend it to others." },
  { term: "Bond", emoji: "📄", definition: "A loan you give to a company or the government. They promise to pay you back with interest." },
  { term: "Budget", emoji: "📋", definition: "A plan for your money showing how much you earn and how much you plan to spend." },
  { term: "Compound Interest", emoji: "📈", definition: "Interest earned on both your original money and the interest you already earned. It makes money grow faster." },
  { term: "Credit", emoji: "💳", definition: "Borrowing money to buy something now and promising to pay it back later." },
  { term: "Cryptocurrency", emoji: "₿", definition: "Digital money that isn't controlled by banks or governments, secured by cryptography." },
  { term: "Debt", emoji: "⚖️", definition: "Money that you owe to someone else, usually a bank." },
  { term: "Demand", emoji: "🛒", definition: "How much people want to buy a certain product or service." },
  { term: "Diversification", emoji: "🌐", definition: "Spreading your money across different types of investments so you don't lose it all if one does poorly." },
  { term: "Emergency Fund", emoji: "🆘", definition: "Money saved up just in case something bad or unexpected happens, like a broken car." },
  { term: "Entrepreneur", emoji: "🚀", definition: "Someone who starts their own business and takes on financial risks." },
  { term: "Expense", emoji: "💸", definition: "Money that you spend on things you need or want." },
  { term: "Hedge Fund", emoji: "🦊", definition: "An investment fund that uses advanced strategies to try to make money regardless of market conditions. Usually only for wealthy investors." },
  { term: "Income", emoji: "💰", definition: "Money that you earn from working, allowance, or investments." },
  { term: "Inflation", emoji: "📛", definition: "When prices of things go up over time, meaning your money buys less than it used to." },
  { term: "Insurance", emoji: "🛡️", definition: "Paying a little money now to protect yourself from losing a lot of money if something bad happens." },
  { term: "Interest", emoji: "🏧", definition: "Extra money a bank pays you for keeping money with them, or extra money you pay to borrow money." },
  { term: "Investing", emoji: "📊", definition: "Using your money to buy things that you hope will make you more money in the future." },
  { term: "Money", emoji: "💵", definition: "A medium of exchange accepted by people to pay for goods and services." },
  { term: "Recession", emoji: "📉", definition: "A period when the economy is shrinking, businesses make less money, and people lose jobs." },
  { term: "Risk", emoji: "🎲", definition: "The chance that you might lose money on an investment." },
  { term: "Stock", emoji: "🏢", definition: "A tiny piece of ownership in a company." },
  { term: "Supply", emoji: "📦", definition: "How much of a certain product or service is available to buy." },
  { term: "Taxes", emoji: "🏛️", definition: "Money paid to the government to fund public things like roads, schools, and parks." },
];

export default function KnowledgeBase() {
  const navigate = useNavigate();
const { progress, setProgress } = useOutletContext();
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("glossary");
  const [search, setSearch] = useState("");

  // Track Lab day for Market Watcher badge
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem("badge_lab_days") || "[]");
    if (!stored.includes(today)) {
      const updated = [...stored, today];
      localStorage.setItem("badge_lab_days", JSON.stringify(updated));
    }
  }, []);

  async function handleSelectCard(card) {
  setSelected(card);
  const read = progress?.badge_articles_read || [];
  if (!read.includes(card.id)) {
    const updated = [...read, card.id];
    const { updateProgress } = await import('../lib/progressUtils');
    const newProgress = await updateProgress(progress, { badge_articles_read: updated });
    setProgress(newProgress);
  }
}

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");
    if (topic) {
      setTab("insights");
      const card = KNOWLEDGE_CARDS.find(c => c.id === topic);
      if (card) setSelected(card);
    }
  }, []);

  const filteredGlossary = GLOSSARY_TERMS.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.definition.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCards = KNOWLEDGE_CARDS.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.summary.toLowerCase().includes(search.toLowerCase()) ||
    c.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => selected ? setSelected(null) : navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-muted border border-border">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-black flex items-center gap-2 text-primary">
              <BookOpen className="w-5 h-5" /> Knowledge Base
            </h1>
            <p className="text-xs text-muted-foreground">Finance glossary & insights</p>
          </div>
        </div>

        {/* Search bar */}
        {!selected && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search terms, topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none bg-muted border border-border"
            />
          </div>
        )}

        {/* Tabs — only show when not in expanded view and no active search */}
        {!selected && !search && (
          <div className="flex gap-2 mb-4">
            {["glossary", "insights"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all"
                style={tab === t
                  ? { background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.4)", color: "hsl(var(--primary))" }
                  : { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }
                }>
                {t === "glossary" ? "📖 Glossary" : "💡 Deep Dives"}
              </button>
            ))}
          </div>
        )}

        {/* Search results — show both sections when searching */}
        {!selected && search && (
          <div className="flex flex-col gap-3">
            {filteredGlossary.length > 0 && (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Glossary</p>
                {filteredGlossary.map((item, i) => (
                  <GlossaryCard key={item.term} item={item} i={i} />
                ))}
              </>
            )}
            {filteredCards.length > 0 && (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Deep Dives</p>
                {filteredCards.map((card, i) => (
                  <InsightCard key={card.id} card={card} i={i} onClick={() => handleSelectCard(card)} />
                    ))}
                  </>
                  )}
                  {filteredGlossary.length === 0 && filteredCards.length === 0 && (
              <p className="text-center text-muted-foreground text-sm mt-8">No results found for "{search}"</p>
            )}
          </div>
        )}

        {/* Glossary tab */}
        {!selected && !search && tab === "glossary" && (
          <div className="flex flex-col gap-2.5">
            {GLOSSARY_TERMS.map((item, i) => (
              <GlossaryCard key={item.term} item={item} i={i} />
            ))}
          </div>
        )}

        {/* Insights tab */}
        {!selected && !search && tab === "insights" && (
          <div className="flex flex-col gap-3">
            {KNOWLEDGE_CARDS.map((card, i) => (
              <InsightCard key={card.id} card={card} i={i} onClick={() => handleSelectCard(card)} />
              ))}
              </div>
              )}

              {/* Expanded insight card */}
        {selected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl p-5 mb-4"
              style={{ background: `${selected.tagColor}14`, border: `1.5px solid ${selected.tagColor}55`, boxShadow: `0 0 30px ${selected.tagColor}22` }}>
              <span className="text-4xl block mb-2">{selected.emoji}</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block"
                style={{ background: `${selected.tagColor}22`, color: selected.tagColor, border: `1px solid ${selected.tagColor}44` }}>
                {selected.tag}
              </span>
              <h2 className="text-xl font-black text-foreground mt-1 mb-2">{selected.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{selected.summary}</p>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Action Steps</p>
            <div className="flex flex-col gap-2.5 mb-4">
              {selected.tips.map((tip, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-3 rounded-xl p-3.5 bg-card border border-border">
                  <span className="text-xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tip.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tip.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-xl p-4 mb-4"
              style={{ background: "rgba(241,196,15,0.08)", border: "1px solid rgba(241,196,15,0.3)" }}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-accent mb-1">💡 Key Lesson</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.lesson}</p>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}

function GlossaryCard({ item, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      className="flex items-start gap-3 rounded-xl p-3.5 bg-card border border-border"
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{item.emoji}</span>
      <div>
        <p className="text-sm font-black text-foreground">{item.term}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.definition}</p>
      </div>
    </motion.div>
  );
}

function InsightCard({ card, i, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      onClick={onClick}
      className="w-full text-left rounded-2xl p-4 flex items-center gap-4 bg-card"
      style={{
        border: `1px solid ${card.tagColor}44`,
        boxShadow: `0 0 16px ${card.tagColor}18`,
      }}>
      <span className="text-3xl flex-shrink-0">{card.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${card.tagColor}22`, color: card.tagColor, border: `1px solid ${card.tagColor}44` }}>
            {card.tag}
          </span>
        </div>
        <p className="font-bold text-foreground text-sm leading-tight">{card.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{card.summary}</p>
      </div>
      <span className="text-muted-foreground text-lg flex-shrink-0">›</span>
    </motion.button>
  );
}