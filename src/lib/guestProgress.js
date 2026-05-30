const KEY = "econbuddy_guest";
const ACTIVE_KEY = "econbuddy_guest_active";

// ACTIVE_KEY uses sessionStorage so guest mode resets on every new browser session.
// Progress data stays in localStorage so it's not lost between sessions.
export function isGuestMode() {
  return sessionStorage.getItem(ACTIVE_KEY) === "true";
}

export function getGuestProgress() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveGuestProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  
  // Sync to Supabase
  import('./supabaseClient').then(({ supabase }) => {
    supabase.from('guest_progress').upsert({
      id: data.guestName,
      guest_name: data.guestName,
      xp: data.xp || 0,
      streak: data.streak || 0,
      last_active_date: data.last_active_date,
    }).then(() => {});
  });
}
export function initGuest() {
  const existing = getGuestProgress();
  sessionStorage.setItem(ACTIVE_KEY, "true");
  if (existing) {
    // Update existing guest in Supabase
    import('./supabaseClient').then(({ supabase }) => {
      supabase.from('guest_progress').upsert({
        id: existing.id === 'guest' ? existing.guestName : existing.id,
        guest_name: existing.guestName,
        xp: existing.xp || 0,
        streak: existing.streak || 0,
        last_active_date: existing.last_active_date,
      }).then(() => {});
    });
    return existing;
  }
  const id = Math.floor(Math.random() * 9000) + 1000;
  const guestName = `Guest_${id}`;
  const fresh = {
    id: "guest",
    created_by: guestName,
    xp: 0,
    hearts: 3,
    gems: 50,
    streak: 0,
    last_active_date: new Date().toISOString().split("T")[0],
    completed_lessons: [],
    current_unit: 1,
    level: 1,
    daily_reward_day: 1,
    owned_items: [],
    avatar_config: { helmet: "basic", eyes: "cyan", outfit: "midnight", accessory: "none" },
    stock_positions: {},
    guestName,
  };
  localStorage.setItem(KEY, JSON.stringify(fresh));

  // Save to Supabase anonymously
  import('./supabaseClient').then(({ supabase }) => {
    supabase.from('guest_progress').upsert({
      id: guestName,
      guest_name: guestName,
      xp: 0,
      streak: 0,
      last_active_date: fresh.last_active_date,
    }).then(() => {});
  });

  return fresh;
}
export function clearGuest() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(ACTIVE_KEY);
  // Also clear any legacy cookie-style keys
  try {
    document.cookie.split(";").forEach(c => {
      const key = c.trim().split("=")[0];
      if (key.startsWith("econbuddy")) {
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      }
    });
  } catch {}
}