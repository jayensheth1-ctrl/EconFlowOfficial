// Central shop item registry
// behavior types:
//   "consumable_stack" - stackable, stored in inventory_counts
//   "timed"            - sets an expiry timestamp on purchase
//   "toggle"           - toggle on/off passive
//   "passive"          - permanent one-time perk
//   "avatar"           - avatar cosmetic (moved to MascotStudio)
//   "theme"            - changes app color theme

export const AVATAR_ITEMS = [
  { id: "monopoly-hat",   cat: "avatar", rarity: "standard",  emoji: "🧢", price: 30,  prestige: 10,
    title: "Founder Cap",         desc: "CEO cap on your avatar.", avatarKey: "helmet", avatarVal: "ceo" },
  { id: "exec-watch",     cat: "avatar", rarity: "executive", emoji: "⌚", price: 75,  prestige: 20,
    title: "Precision Chronograph", desc: "Smartwatch augment.", avatarKey: "accessory", avatarVal: "watch" },
  { id: "exec-briefcase", cat: "avatar", rarity: "executive", emoji: "💼", price: 90,  prestige: 25,
    title: "Titanium Briefcase",  desc: "Permanent prestige mascot item.", avatarKey: "accessory", avatarVal: "briefcase" },
  { id: "exec-visor",     cat: "avatar", rarity: "elite",     emoji: "🕶️", price: 120, prestige: 35,
    title: "AR Market Visor",     desc: "Neon visor on your avatar.", avatarKey: "helmet", avatarVal: "visor" },
  { id: "holo-gauntlet",  cat: "avatar", rarity: "elite",     emoji: "🤖", price: 130, prestige: 38,
    title: "Holo Gauntlet",       desc: "Holo gauntlet augment.", avatarKey: "accessory", avatarVal: "gauntlet" },
  { id: "cyber-drone",    cat: "avatar", rarity: "elite",     emoji: "🚁", price: 150, prestige: 42,
    title: "AI Recon Drone",      desc: "Hover drone companion.", avatarKey: "accessory", avatarVal: "drone" },
  { id: "mech-arm-shop",  cat: "avatar", rarity: "elite",     emoji: "🦾", price: 175, prestige: 48,
    title: "Bionic Trading Arm",  desc: "Bionic arm augment.", avatarKey: "accessory", avatarVal: "mech-arm" },
];

export const SHOP_ITEMS = [
  // ── OPS ──────────────────────────────────────────────────────────────────
  { id: "power-cell",       cat: "ops",      rarity: "standard",  emoji: "🔋", price: 10,  behavior: "consumable_stack", prestige: 0,
    title: "Power Cell",               desc: "Restores 1 battery charge during a lesson. Stackable." },
  { id: "full-recharge",    cat: "ops",      rarity: "standard",  emoji: "⚡", price: 20,  behavior: "consumable_stack", prestige: 0,
    title: "Full Recharge",            desc: "Restores all battery charges at once. Stackable." },
  { id: "shield",           cat: "ops",      rarity: "executive", emoji: "🛡️", price: 40,  behavior: "timed", duration: 24 * 60 * 60 * 1000, prestige: 5, timedKey: "streak_freeze_expiry",
    title: "Streak Freeze Vault",      desc: "Protects your streak for 24h if you miss a day." },
  { id: "xp-multiplier",   cat: "ops",      rarity: "executive", emoji: "⚡", price: 50,  behavior: "timed", duration: 15 * 60 * 1000, prestige: 8, timedKey: "xp_boost_until",
    title: "XP Surge (15 min)",        desc: "Doubles all XP earned for 15 minutes." },

  // ── VENTURE ──────────────────────────────────────────────────────────────
  { id: "rocket-cursor",    cat: "venture",  rarity: "standard",  emoji: "🚀", price: 60,  behavior: "toggle", prestige: 12, toggleKey: "hyperdrive_equipped",
    title: "Hyperdrive Badge",         desc: "Permanent 🚀 badge on your profile card. EQUIP/UNEQUIP anytime." },
  { id: "gold-theme",       cat: "venture",  rarity: "legendary", emoji: "👑", price: 100, behavior: "timed", duration: 60 * 60 * 1000, prestige: 40, timedKey: "gold_theme_until",
    title: "Gold Tier UI",             desc: "Full gold UI tint for 1 hour." },

  // ── FINANCE ──────────────────────────────────────────────────────────────
  { id: "interest-account", cat: "finance",  rarity: "executive", emoji: "🏦", price: 200, behavior: "toggle", prestige: 30, toggleKey: "interest_account_active",
    title: "Interest Account",         desc: "+5 Gems every new login day automatically." },
  { id: "investment-portfolio", cat: "finance", rarity: "elite", emoji: "📈", price: 150, behavior: "toggle", prestige: 35, toggleKey: "investment_portfolio_active",
    title: "Investment Portfolio",     desc: "10% chance to double XP at lesson end." },

  // ── PERKS ────────────────────────────────────────────────────────────────
  { id: "hint-token",       cat: "perks",    rarity: "standard",  emoji: "🔍", price: 20,  behavior: "consumable_stack", prestige: 0,
    title: "Hint Token",               desc: "Eliminates one wrong answer (50/50 style) during a question." },
  { id: "xp-magnet",        cat: "perks",    rarity: "executive", emoji: "🧲", price: 80,  behavior: "timed", duration: 24 * 60 * 60 * 1000, prestige: 15, timedKey: "xp_magnet_until",
    title: "XP Magnet",                desc: "+25% bonus XP for 24 hours. Stacks with XP Surge." },
  { id: "battery-insulator", cat: "perks",   rarity: "elite",     emoji: "🛡️", price: 110, behavior: "toggle", prestige: 20, toggleKey: "battery_insulator_active",
    title: "Battery Insulator",        desc: "Adds 2 extra battery charges (5 total) while equipped." },
  { id: "gem-multiplier",   cat: "perks",    rarity: "elite",     emoji: "💰", price: 140, behavior: "timed", duration: 48 * 60 * 60 * 1000, prestige: 25, timedKey: "gem_multiplier_until",
    title: "Gem Multiplier",           desc: "All gem rewards ×1.5 for 48 hours." },

  // ── THEMES ───────────────────────────────────────────────────────────────
  { id: "theme-dark-galaxy",  cat: "themes", rarity: "standard",  emoji: "🌌", price: 0,   behavior: "theme", themeKey: "dark-galaxy",  prestige: 0,
    title: "Dark Galaxy",              desc: "Default neon void look. Always free. (Dark mode only)", swatch: "#0a1628" },
  { id: "theme-neon-sunrise", cat: "themes", rarity: "standard",  emoji: "🌅", price: 50,  behavior: "theme", themeKey: "neon-sunrise", prestige: 5,
    title: "Neon Sunrise",             desc: "Hot orange and pink palette. (Dark mode only)", swatch: "#FF6B35" },
  { id: "theme-ocean-deep",   cat: "themes", rarity: "standard",  emoji: "🌊", price: 50,  behavior: "theme", themeKey: "ocean-deep",   prestige: 5,
    title: "Ocean Deep",               desc: "Deep teal and navy. (Dark mode only)", swatch: "#0A2A3A" },
  { id: "theme-forest-sage",  cat: "themes", rarity: "standard",  emoji: "🌿", price: 50,  behavior: "theme", themeKey: "forest-sage",  prestige: 5,
    title: "Forest Sage",              desc: "Electric greens and dark forest. (Dark mode only)", swatch: "#0A1F0A" },
  { id: "theme-cyber-blood",  cat: "themes", rarity: "executive", emoji: "🩸", price: 75,  behavior: "theme", themeKey: "cyber-blood",  prestige: 10,
    title: "Cyber Blood",              desc: "Deep crimson and black. Aggressive. (Dark mode only)", swatch: "#1A0000" },
  { id: "theme-arctic-void",  cat: "themes", rarity: "executive", emoji: "❄️", price: 75,  behavior: "theme", themeKey: "arctic-void",  prestige: 10,
    title: "Arctic Void",              desc: "Ice white and pale blue. Minimalist. (Dark mode only)", swatch: "#0A1525" },
  { id: "theme-golden-hour",  cat: "themes", rarity: "legendary", emoji: "✨", price: 100, behavior: "theme", themeKey: "golden-hour",  prestige: 20,
    title: "Golden Hour",              desc: "Full metallic gold on near-black. (Dark mode only)", swatch: "#1A1000" },
];

export const ALL_ITEMS = [...SHOP_ITEMS, ...AVATAR_ITEMS];

export const RARITY_META = {
  standard:  { label: "STANDARD",  color: "#2ECC71", glow: "rgba(46,204,113,0.35)"  },
  executive: { label: "EXECUTIVE", color: "#3B82F6", glow: "rgba(59,130,246,0.35)"  },
  elite:     { label: "ELITE",     color: "#C084FC", glow: "rgba(192,132,252,0.35)" },
  legendary: { label: "LEGENDARY", color: "#F1C40F", glow: "rgba(241,196,15,0.4)"   },
};

export const CATEGORY_TABS = [
  { key: "all",     label: "All Assets", icon: "🏪" },
  { key: "perks",   label: "Perks",      icon: "🎯" },
  { key: "themes",  label: "Themes",     icon: "🎨" },
  { key: "ops",     label: "Ops",        icon: "⚡" },
  { key: "venture", label: "Venture",    icon: "🧢" },
];
// Helper: compute XP with active boosts
export function applyXpBoosts(baseXp, progress) {
  let xp = baseXp;
  const now = Date.now();
 if (progress?.xp_boost_until && new Date(progress.xp_boost_until).getTime() > now) {
  xp = progress?.flash_surge_active ? xp * 3 : xp * 2;
}
  if (progress?.xp_magnet_until && new Date(progress.xp_magnet_until).getTime() > now) {
    xp = Math.ceil(xp * 1.25);
  }
  return xp;
}

// Helper: compute gem award with multiplier
export function applyGemMultiplier(baseGems, progress) {
  const now = Date.now();
  if (progress?.gem_multiplier_until && new Date(progress.gem_multiplier_until).getTime() > now) {
    return Math.ceil(baseGems * 1.5);
  }
  return baseGems;
}