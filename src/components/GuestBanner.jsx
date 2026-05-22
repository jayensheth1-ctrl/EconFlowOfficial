import { useState } from "react";
import { Cloud, X, LogIn, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearGuest } from "../lib/guestProgress";

export default function GuestBanner({ guestName }) {
  const [showReset, setShowReset] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

 function handleLogin() {
  window.location.href = window.location.origin + '?showLogin=true';
}

  function handleReset() {
    clearGuest();
    window.location.reload();
  }

  return (
    <>
      <div className="w-full px-3 py-1.5 flex items-center gap-2 text-xs"
        style={{ background: "rgba(0,180,255,0.12)", borderBottom: "1px solid rgba(0,242,255,0.2)" }}>
        <Cloud className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#00F2FF" }} />
        <span className="flex-1" style={{ color: "rgba(0,242,255,0.85)" }}>
          Playing as <strong>{guestName}</strong> · Progress saved on this device only.
        </span>
        <button
          onClick={handleLogin}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] flex-shrink-0"
          style={{ background: "rgba(0,242,255,0.15)", color: "#00F2FF", border: "1px solid rgba(0,242,255,0.3)" }}
          aria-label="Log in to sync progress to the cloud"
        >
          <LogIn className="w-2.5 h-2.5" /> Log in
        </button>
        <button
          onClick={() => setShowReset(true)}
          className="p-1 rounded-full flex-shrink-0"
          style={{ color: "rgba(255,100,100,0.6)" }}
          aria-label="Reset guest data"
          title="Reset data (for shared computers)"
        >
          <Trash2 className="w-3 h-3" />
        </button>
        <button onClick={() => setDismissed(true)} className="p-0.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} aria-label="Dismiss banner">
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Reset confirm modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              className="rounded-2xl p-6 w-full max-w-xs text-center"
              style={{ background: "#0d1b2a", border: "1px solid rgba(255,100,100,0.3)" }}>
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-base font-extrabold text-white mb-1">Reset Guest Data?</h3>
              <p className="text-xs text-gray-400 mb-5">
                This will wipe all your Gems, XP, and Mascot items saved in this browser. Use this on shared computers before the next person sits down.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowReset(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-white/10 text-gray-400">
                  Cancel
                </button>
                <button onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg,#E74C3C,#c0392b)" }}>
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}