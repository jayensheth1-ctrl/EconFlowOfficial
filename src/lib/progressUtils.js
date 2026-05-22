import { isGuestMode, getGuestProgress, saveGuestProgress } from "./guestProgress";
import { supabase } from "./supabaseClient";

export async function updateProgress(current, update) {
  const merged = { ...current, ...update };
  if (isGuestMode()) {
    saveGuestProgress(merged);
    return merged;
  }
  const { error } = await supabase
    .from("user_progress")
    .update(update)
    .eq("id", current.id);
  if (error) console.error("Failed to update progress:", error);
  return merged;
}