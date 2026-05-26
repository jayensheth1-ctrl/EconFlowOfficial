import { useState, useEffect, useRef } from "react";
import { X, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import MultipleChoice from "./MultipleChoice";
import TrueFalse from "./TrueFalse";
import WordBank from "./WordBank";
import FeedbackDrawer from "./FeedbackDrawer";
import CompletionScreen from "./CompletionScreen";
import StudyBriefIntro from "./StudyBriefIntro";
import StudyBriefDrawer from "./StudyBriefDrawer";
import BatteryDisplay from "./BatteryDisplay";
import BatteryDeadPopup from "./BatteryDeadPopup";

export default function LessonOverlay({ lesson, hearts, progress, onComplete, onClose, onProgressUpdate, sectionBonus = 0 }) {
  const [showBriefIntro, setShowBriefIntro] = useState(!!lesson.studyBrief);
  const [showBriefDrawer, setShowBriefDrawer] = useState(false);
  const [briefReadOnce, setBriefReadOnce] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [showBatteryDead, setShowBatteryDead] = useState(false);
  const [hintsUsedThisQ, setHintsUsedThisQ] = useState(false);
  const [hintEliminatedIndex, setHintEliminatedIndex] = useState(null);
  const [chargeFloaters, setChargeFloaters] = useState([]);
  const [isRestarting, setIsRestarting] = useState(false);
  const [questionResetKey, setQuestionResetKey] = useState(0);
  const enterAdvancesRef = useRef(false);

  // Review round state
  const wrongQuestionsRef = useRef([]); // questions answered wrong during main lesson
  const [reviewQueue, setReviewQueue] = useState(null); // null = not in review; array = review queue
  const [reviewIdx, setReviewIdx] = useState(0);

  // Badge tracking refs
  const lessonStartTimeRef = useRef(null);
  const consecutiveCorrectRef = useRef(0);
  const wrongAnsweredRef = useRef(false);
  const hadBatteryDeathRef = useRef(false);

  const inventoryCounts = progress?.inventory_counts || {};
  const powerCells = inventoryCounts["power-cell"] || 0;
  const fullRecharges = inventoryCounts["full-recharge"] || 0;
  const hintTokens = inventoryCounts["hint-token"] || 0;
  const batteryInsulatorActive = progress?.battery_insulator_active || false;

  // Battery: 3 base, or 5 with insulator
  const maxCharges = batteryInsulatorActive ? 5 : 3;
  const [charges, setCharges] = useState(maxCharges);

  // Enter key: second press advances past feedback
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter") return;
      if (e.repeat) return;
      if (showBriefIntro || showCompletion || showBatteryDead || showBriefDrawer) return;
      if (enterAdvancesRef.current && feedback) {
        e.preventDefault();
        enterAdvancesRef.current = false;
        handleContinue();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedback, showBriefIntro, showCompletion, showBatteryDead, showBriefDrawer]);

  // R key opens brief drawer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") return;
      if (showBriefIntro || !lesson.studyBrief) return;
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setShowBriefDrawer(d => !d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showBriefIntro, lesson.studyBrief]);

  const questions = lesson.questions;
  const inReview = reviewQueue !== null;
  const progressPercent = inReview
    ? (reviewIdx / reviewQueue.length) * 100
    : (currentQ / questions.length) * 100;

  // Start timer for lessons with no study brief (no intro screen)
  if (!lesson.studyBrief && !lessonStartTimeRef.current) {
    lessonStartTimeRef.current = Date.now();
  }

  function spawnChargeFloater() {
    const id = Date.now() + Math.random();
    setChargeFloaters(f => [...f, { id }]);
    setTimeout(() => setChargeFloaters(f => f.filter(x => x.id !== id)), 1200);
  }

  async function spendConsumable(id, amount = 1) {
    if (!onProgressUpdate) return;
    const newCounts = { ...(progress?.inventory_counts || {}), [id]: Math.max(0, (progress?.inventory_counts?.[id] || 0) - amount) };
    await onProgressUpdate({ inventory_counts: newCounts });
  }

  async function handleUsePowerCell() {
    if (powerCells <= 0 || charges >= maxCharges) return;
    await spendConsumable("power-cell");
    setCharges(c => Math.min(maxCharges, c + 1));
    setShowBatteryDead(false);
    setQuestionResetKey(k => k + 1);
    toast.success("⚡ +1 Charge restored!");
  }

  async function handleUseFullRecharge() {
    if (fullRecharges <= 0 || charges >= maxCharges) return;
    await spendConsumable("full-recharge");
    setCharges(maxCharges);
    setShowBatteryDead(false);
    setQuestionResetKey(k => k + 1);
    toast.success("⚡ Battery fully recharged!");
  }

  async function handleUseHint(eliminateIndex) {
    if (hintTokens <= 0 || hintsUsedThisQ) return;
    await spendConsumable("hint-token");
    setHintEliminatedIndex(eliminateIndex);
    setHintsUsedThisQ(true);
    toast.success("🔍 One wrong answer eliminated!");
  }

  function handleAnswer(isCorrect, explanation) {
    const inReview = reviewQueue !== null;

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      consecutiveCorrectRef.current += 1;
      setFeedback({ isCorrect, explanation });
      enterAdvancesRef.current = true;
      setHintsUsedThisQ(false);
      setHintEliminatedIndex(null);
    } else {
      // Track wrong question for review (main lesson only)
      if (!inReview) {
        const q = questions[currentQ];
        wrongQuestionsRef.current = [...wrongQuestionsRef.current.filter(x => x !== q), q];
      }

      wrongAnsweredRef.current = true;
      consecutiveCorrectRef.current = 0;

      // No battery drain during review
      if (!inReview) {
        const newCharges = charges - 1;
        setCharges(newCharges);
        spawnChargeFloater();
        setShake(true);
        setTimeout(() => setShake(false), 600);
        if (newCharges <= 0) {
          hadBatteryDeathRef.current = true;
          setTimeout(() => setShowBatteryDead(true), 700);
          return;
        }
      } else {
        // In review: push this question back to end of queue
        setReviewQueue(q => {
          const remaining = [...q];
          const current = remaining[reviewIdx];
          remaining.push(current);
          return remaining;
        });
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }

      setFeedback({ isCorrect, explanation, showBriefHint: !!lesson.studyBrief && !inReview });
      enterAdvancesRef.current = true;
    }
  }

  function handleContinue() {
    enterAdvancesRef.current = false;
    setFeedback(null);
    setHintsUsedThisQ(false);
    setHintEliminatedIndex(null);

    const inReview = reviewQueue !== null;

    if (inReview) {
      // Advance through review queue
      const nextIdx = reviewIdx + 1;
      if (nextIdx >= reviewQueue.length) {
        // All review questions answered correctly — done!
        setShowCompletion(true);
      } else {
        setReviewIdx(nextIdx);
      }
    } else if (currentQ + 1 >= questions.length) {
      // Main lesson done — check if there are wrong questions to review
      if (wrongQuestionsRef.current.length > 0) {
        // Shuffle wrong questions for review
        const shuffled = [...wrongQuestionsRef.current];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setReviewQueue(shuffled);
        setReviewIdx(0);
      } else {
        setShowCompletion(true);
      }
    } else {
      setCurrentQ(q => q + 1);
    }
  }

  function handleRestart() {
    setIsRestarting(true);
    setTimeout(() => {
      setCurrentQ(0);
      setCharges(maxCharges);
      setFeedback(null);
      setCorrectCount(0);
      setShowBatteryDead(false);
      setShake(false);
      setHintsUsedThisQ(false);
      setHintEliminatedIndex(null);
      enterAdvancesRef.current = false;
      wrongQuestionsRef.current = [];
      setReviewQueue(null);
      setReviewIdx(0);
      setIsRestarting(false);
    }, 600);
  }

  async function handleCompletionClose() {
    const elapsed = lessonStartTimeRef.current ? (Date.now() - lessonStartTimeRef.current) / 1000 : 999;
    const hour = new Date().getHours();
    await onComplete({
      completed: true,
      xpEarned: 10 + sectionBonus,
      badgeStats: {
        maxConsecCorrect: consecutiveCorrectRef.current,
        totalCorrect: correctCount,
        speedRunSeconds: elapsed,
        noWrong: !wrongAnsweredRef.current,
        nightOwl: hour >= 22,
        retriedAfterDeath: hadBatteryDeathRef.current,
      },
    });
  }

  if (showBriefIntro) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="px-4 pt-4 pb-3 flex items-center">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <StudyBriefIntro lesson={lesson} onStart={() => {
            setShowBriefIntro(false);
            setBriefReadOnce(true);
            lessonStartTimeRef.current = Date.now();
          }} />
        </div>
      </div>
    );
  }

  if (showCompletion) {
    return (
      <CompletionScreen xpEarned={10} bonusXp={sectionBonus} streak={1} prevXp={0} onClose={handleCompletionClose} />
    );
  }

  const q = inReview ? reviewQueue[reviewIdx] : questions[currentQ];

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Restarting flash */}
      <AnimatePresence>
        {isRestarting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-70 bg-background flex items-center justify-center"
          >
            <p className="text-lg font-black text-primary">Restarting...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Study Brief Drawer */}
      {lesson.studyBrief && (
        <StudyBriefDrawer brief={lesson.studyBrief} isOpen={showBriefDrawer} onClose={() => setShowBriefDrawer(false)} isRevisit={briefReadOnce} />
      )}

      {/* Review round banner */}
      {inReview && (
        <div className="px-4 pt-3 pb-0">
          <div className="rounded-xl px-3 py-2 flex items-center justify-between"
            style={{ background: "rgba(234,179,8,0.12)", border: "1.5px solid rgba(234,179,8,0.4)" }}>
            <p className="text-xs font-bold" style={{ color: "#eab308" }}>
              🔁 Almost there! Let's try those tricky ones again.
            </p>
            <span className="text-xs font-black" style={{ color: "#eab308" }}>
              {reviewQueue.length - reviewIdx} left
            </span>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 relative">
        {/* Charge lost floaters */}
        {chargeFloaters.map(f => (
          <motion.div key={f.id}
            className="absolute top-2 right-4 pointer-events-none font-extrabold text-sm z-50"
            style={{ color: "#ef4444" }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -40, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}>
            -1 ⚡
          </motion.div>
        ))}

        <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <Progress value={progressPercent} className="h-3 bg-muted" />
        </div>
        {lesson.studyBrief && (
          <button
            onClick={() => { setShowBriefDrawer(true); setBriefReadOnce(true); }}
            aria-label="Review Study Brief (R)"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(147,51,234,0.12)", border: "1.5px solid rgba(147,51,234,0.35)", color: "#C084FC" }}
          >
            <BookOpen className="w-4 h-4" />
          </button>
        )}

        {/* In-lesson consumables */}
        <div className="flex items-center gap-1">
          {(powerCells > 0 || fullRecharges > 0) && (
            <button
              onClick={charges >= maxCharges ? undefined : (fullRecharges > 0 ? handleUseFullRecharge : handleUsePowerCell)}
              disabled={charges >= maxCharges}
              className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg text-[10px] font-bold disabled:opacity-40"
              style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}
              title={charges >= maxCharges ? "Battery full" : "Use charge item"}
            >
              ⚡ {fullRecharges > 0 ? fullRecharges : powerCells}
            </button>
          )}
          {hintTokens > 0 && (
            <button
              onClick={() => {
                const q = questions[currentQ];
                if (!q?.options) return;
                const wrongIdxs = q.options.map((_, i) => i).filter(i => i !== q.correct && i !== hintEliminatedIndex);
                if (wrongIdxs.length === 0) return;
                const pick = wrongIdxs[Math.floor(Math.random() * wrongIdxs.length)];
                handleUseHint(pick);
              }}
              disabled={hintsUsedThisQ || !questions[currentQ]?.options}
              className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg text-[10px] font-bold disabled:opacity-40"
              style={{ background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.3)", color: "#eab308" }}
              title="Use Hint Token"
            >
              🔍 {hintTokens}
            </button>
          )}
        </div>

        {/* Battery display */}
        <BatteryDisplay charges={charges} maxCharges={maxCharges} />
      </div>

      {/* Question area */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {q.type === "multiple_choice" && (
          <MultipleChoice key={`${inReview ? `review-${reviewIdx}` : currentQ}-${questionResetKey}`} question={q} questionNumber={inReview ? null : currentQ + 1} onAnswer={handleAnswer} eliminatedIndex={inReview ? null : hintEliminatedIndex} />
        )}
        {q.type === "true_false" && (
          <TrueFalse key={`${inReview ? `review-${reviewIdx}` : currentQ}-${questionResetKey}`} question={q} onAnswer={handleAnswer} />
        )}
        {q.type === "word_bank" && (
          <WordBank key={`${inReview ? `review-${reviewIdx}` : currentQ}-${questionResetKey}`} question={q} onAnswer={handleAnswer} />
        )}
      </div>

      {/* Feedback drawer */}
      {feedback && (
        <>
          {feedback.showBriefHint && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mb-1 px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
              style={{ background: "rgba(147,51,234,0.12)", border: "1px solid rgba(147,51,234,0.3)" }}
              onClick={() => { setShowBriefDrawer(true); setBriefReadOnce(true); }}
            >
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#C084FC" }} />
              <p className="text-xs font-semibold" style={{ color: "#C084FC" }}>
                Hint: Check the Study Brief! <span className="underline">Tap to review →</span>
              </p>
            </motion.div>
          )}
          <FeedbackDrawer isCorrect={feedback.isCorrect} explanation={feedback.explanation} onContinue={handleContinue} />
        </>
      )}

      {/* Battery Dead Popup */}
      <AnimatePresence>
        {showBatteryDead && (
          <BatteryDeadPopup
            powerCells={powerCells}
            fullRecharges={fullRecharges}
            onUsePowerCell={handleUsePowerCell}
            onUseFullRecharge={handleUseFullRecharge}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}