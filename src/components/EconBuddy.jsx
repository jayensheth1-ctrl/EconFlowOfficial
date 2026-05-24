/**
 * EconBuddy — SVG robot mascot with fully working config-driven customization.
 * helmet: basic | visor | ceo | astronaut | crown-gold
 * eyes: cyan | teal | gold | red
 * outfit: midnight | stealth | chrome | camo | obsidian
 * accessory: none | watch | gauntlet | diamond-hand
 * aura: aura-purple (applied as outer glow)
 */

const EYE_COLOR = {
  cyan:   "#00F2FF",
  teal:   "#00CBA9",
  gold:   "#F1C40F",
  red:    "#FF2244",
  purple: "#C084FC",
  white:  "#F0F0FF",
};

const OUTFIT_COLOR = {
  midnight:  { body: "#1a2744", trim: "#00F2FF" },
  stealth:   { body: "#2c2c2c", trim: "#666" },
  chrome:    { body: "#9EA7B0", trim: "#E8EDF0" },
  camo:      { body: "#4a5c3a", trim: "#7a9c5a" },
  obsidian:  { body: "#0a0a0a", trim: "#333" },
  "gold-leaf": { body: "#7a5c00", trim: "#F1C40F" },
};

const AURA_GLOW = {
  "aura-purple": "0 0 24px 8px rgba(147,51,234,0.65)",
};

export default function EconBuddy({ config = {}, size = 80 }) {
  const eyeColor    = EYE_COLOR[config.eyes]    ?? EYE_COLOR.cyan;
  const outfit      = OUTFIT_COLOR[config.outfit] ?? OUTFIT_COLOR.midnight;
  const aura        = config.aura ? (AURA_GLOW[config.aura] ?? null) : null;
  const helmet      = config.helmet  ?? "basic";
  const accessory   = config.accessory ?? "none";

  return (
    <div style={{
      width: size,
      height: size,
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      boxShadow: aura ?? undefined,
    }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* ── Body / Torso ────────────────────────────────────── */}
        <rect x="28" y="60" width="44" height="36" rx="8"
          fill={outfit.body} stroke={outfit.trim} strokeWidth="1.5" />
        {/* Chest panel detail */}
        <rect x="36" y="68" width="28" height="18" rx="4"
          fill="rgba(0,242,255,0.08)" stroke={outfit.trim} strokeWidth="1" />
        {/* Chest light */}
        <circle cx="50" cy="77" r="4"
          fill={eyeColor} opacity="0.85"
          style={{ filter: `drop-shadow(0 0 4px ${eyeColor})` }} />

        {/* ── Legs ────────────────────────────────────────────── */}
        <rect x="33" y="94" width="13" height="18" rx="5"
          fill={outfit.body} stroke={outfit.trim} strokeWidth="1.5" />
        <rect x="54" y="94" width="13" height="18" rx="5"
          fill={outfit.body} stroke={outfit.trim} strokeWidth="1.5" />
        {/* Feet */}
        <rect x="30" y="108" width="18" height="8" rx="4"
          fill={outfit.trim} opacity="0.6" />
        <rect x="52" y="108" width="18" height="8" rx="4"
          fill={outfit.trim} opacity="0.6" />

        {/* ── Arms ────────────────────────────────────────────── */}
        <rect x="10" y="62" width="20" height="11" rx="5"
          fill={outfit.body} stroke={outfit.trim} strokeWidth="1.5" />
        <rect x="70" y="62" width="20" height="11" rx="5"
          fill={outfit.body} stroke={outfit.trim} strokeWidth="1.5" />
        {/* Hands */}
        <circle cx="14" cy="80" r="6"
          fill={outfit.body} stroke={outfit.trim} strokeWidth="1.5" />
        <circle cx="86" cy="80" r="6"
          fill={outfit.body} stroke={outfit.trim} strokeWidth="1.5" />

        {/* ── Neck ────────────────────────────────────────────── */}
        <rect x="43" y="52" width="14" height="10" rx="3"
          fill={outfit.body} stroke={outfit.trim} strokeWidth="1" />

        {/* ── Head ────────────────────────────────────────────── */}
        <rect x="22" y="18" width="56" height="38" rx="14"
          fill="#1a2744" stroke={outfit.trim} strokeWidth="1.5" />
        {/* Head sheen */}
        <rect x="28" y="21" width="28" height="8" rx="4"
          fill="rgba(255,255,255,0.08)" />

        {/* ── Eyes ────────────────────────────────────────────── */}
        <rect x="30" y="30" width="16" height="12" rx="4"
          fill="#0a0e17" />
        <rect x="54" y="30" width="16" height="12" rx="4"
          fill="#0a0e17" />
        {/* Eye glow */}
        <rect x="33" y="32" width="10" height="8" rx="2.5"
          fill={eyeColor} opacity="0.95"
          style={{ filter: `drop-shadow(0 0 5px ${eyeColor})` }} />
        <rect x="57" y="32" width="10" height="8" rx="2.5"
          fill={eyeColor} opacity="0.95"
          style={{ filter: `drop-shadow(0 0 5px ${eyeColor})` }} />
        {/* Eye shine */}
        <circle cx="36" cy="33.5" r="1.5" fill="white" opacity="0.6" />
        <circle cx="60" cy="33.5" r="1.5" fill="white" opacity="0.6" />

        {/* ── Mouth / antenna ────────────────────────────────── */}
        <rect x="38" y="46" width="24" height="5" rx="2.5"
          fill="#0a0e17" />
        <rect x="42" y="47" width="16" height="3" rx="1.5"
          fill={eyeColor} opacity="0.7" />
        {/* Antenna */}
        <line x1="50" y1="18" x2="50" y2="8" stroke={outfit.trim} strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="6" r="3" fill={eyeColor}
          style={{ filter: `drop-shadow(0 0 4px ${eyeColor})` }} />

        {/* ── Helmet overlays ─────────────────────────────────── */}
        {helmet === "visor" && (
          <rect x="22" y="28" width="56" height="18" rx="6"
            fill={eyeColor} opacity="0.18"
            stroke={eyeColor} strokeWidth="1.5" />
        )}
        {helmet === "ceo" && (
          <>
            <rect x="20" y="14" width="60" height="10" rx="3"
              fill="#1a1a1a" stroke="#555" strokeWidth="1" />
            <rect x="16" y="12" width="68" height="5" rx="2"
              fill="#333" stroke="#555" strokeWidth="1" />
          </>
        )}
        {helmet === "astronaut" && (
          <>
            <rect x="16" y="12" width="68" height="46" rx="18"
              fill="rgba(180,220,255,0.12)" stroke="rgba(180,220,255,0.5)" strokeWidth="2" />
            <rect x="24" y="18" width="52" height="30" rx="10"
              fill="rgba(0,200,255,0.1)" stroke="rgba(0,200,255,0.3)" strokeWidth="1" />
          </>
        )}
        {(helmet === "crown-gold" || config.helmet === "crown-gold") && (
          <g>
            <polygon points="50,2 44,14 38,8 36,18 64,18 62,8 56,14"
              fill="#F1C40F" stroke="#D4AF37" strokeWidth="1"
              style={{ filter: "drop-shadow(0 0 6px #F1C40F)" }} />
          </g>
        )}
        {helmet === "mech-helm" && (
          <g>
            {/* Full mech skull plate */}
            <rect x="18" y="12" width="64" height="48" rx="6"
              fill="#111" stroke="#444" strokeWidth="1.5" />
            {/* Mech visor slit */}
            <rect x="22" y="28" width="56" height="14" rx="3"
              fill="#0a0a0a" stroke="#E74C3C" strokeWidth="1"
              style={{ filter: "drop-shadow(0 0 4px #E74C3C)" }} />
            {/* Red eye strips */}
            <rect x="26" y="31" width="20" height="8" rx="2"
              fill="#E74C3C" opacity="0.9"
              style={{ filter: "drop-shadow(0 0 5px #E74C3C)" }} />
            <rect x="54" y="31" width="20" height="8" rx="2"
              fill="#E74C3C" opacity="0.9"
              style={{ filter: "drop-shadow(0 0 5px #E74C3C)" }} />
            {/* Chin bolts */}
            <circle cx="36" cy="54" r="2" fill="#333" stroke="#555" strokeWidth="1" />
            <circle cx="50" cy="54" r="2" fill="#333" stroke="#555" strokeWidth="1" />
            <circle cx="64" cy="54" r="2" fill="#333" stroke="#555" strokeWidth="1" />
          </g>
        )}

        {/* ── Accessory overlays ──────────────────────────────── */}
        {accessory === "watch" && (
          <rect x="10" y="74" width="10" height="7" rx="2"
            fill="#1a1a1a" stroke={eyeColor} strokeWidth="1.2" />
        )}
        {accessory === "gauntlet" && (
          <>
            <rect x="6" y="72" width="16" height="14" rx="4"
              fill={outfit.body} stroke={eyeColor} strokeWidth="1.5"
              style={{ filter: `drop-shadow(0 0 6px ${eyeColor})` }} />
            <line x1="9" y1="76" x2="19" y2="76" stroke={eyeColor} strokeWidth="1" opacity="0.7" />
            <line x1="9" y1="80" x2="19" y2="80" stroke={eyeColor} strokeWidth="1" opacity="0.7" />
          </>
        )}
        {accessory === "diamond-hand" && (
          <>
            <polygon points="14,86 8,78 11,72 17,72 20,78"
              fill="#00F2FF" opacity="0.85"
              style={{ filter: "drop-shadow(0 0 6px #00F2FF)" }} />
          </>
        )}
	{accessory === "briefcase" && (
  <g>
    {/* Titanium briefcase held in right hand */}
    <rect x="74" y="72" width="18" height="14" rx="3"
      fill="#9EA7B0" stroke="#E8EDF0" strokeWidth="1.5"
      style={{ filter: "drop-shadow(0 0 4px rgba(200,210,220,0.6))" }} />
    {/* Handle */}
    <path d="M79 72 Q83 67 87 72" stroke="#E8EDF0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Latch */}
    <rect x="81" y="77" width="4" height="3" rx="1"
      fill="#C0C8D0" stroke="#E8EDF0" strokeWidth="0.8" />
    {/* Horizontal line detail */}
    <line x1="74" y1="79" x2="92" y2="79" stroke="#E8EDF0" strokeWidth="0.8" opacity="0.5" />
  </g>
)}
        {accessory === "mech-arm" && (
          <g>
            {/* Bionic arm overlay on left */}
            <rect x="6" y="60" width="22" height="13" rx="4"
              fill="#222" stroke="#C084FC" strokeWidth="1.5"
              style={{ filter: "drop-shadow(0 0 5px #C084FC66)" }} />
            <line x1="8" y1="65" x2="26" y2="65" stroke="#C084FC" strokeWidth="1" opacity="0.7" />
            <line x1="8" y1="69" x2="26" y2="69" stroke="#C084FC" strokeWidth="1" opacity="0.5" />
            {/* Claw fingers */}
            <line x1="8"  y1="74" x2="6"  y2="82" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
            <line x1="13" y1="74" x2="12" y2="83" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="74" x2="18" y2="83" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
            <circle cx="6"  cy="82" r="2" fill="#C084FC" style={{ filter: "drop-shadow(0 0 3px #C084FC)" }} />
            <circle cx="12" cy="83" r="2" fill="#C084FC" style={{ filter: "drop-shadow(0 0 3px #C084FC)" }} />
            <circle cx="18" cy="83" r="2" fill="#C084FC" style={{ filter: "drop-shadow(0 0 3px #C084FC)" }} />
          </g>
        )}
      </svg>
    </div>
  );
}