import { useState, useEffect, useRef } from "react";
import { shuffleQuestions, shuffleOptions } from "../../lib/battleQuestions";
import { getAllLessons } from "../../lib/lessonData";
import { getAllPart2Lessons } from "../../lib/part2LessonData";
import { generateBot, getBotParams, getBotDelay, getLossStreak, setLossStreak, PENDING_FORFEIT_KEY } from "../../lib/botBattle";
import { saveBattleLog } from "../../lib/battleLogs";
import { updateProgress } from "../../lib/progressUtils";
import { checkNewBadges, buildBadgeUpdate } from "../../lib/badges";
import { playChaChig } from "../../lib/sounds";
import BotPreGame from "./BotPreGame";
import BotQuestion from "./BotQuestion";
import BotEndScreen from "./BotEndScreen";

const WIN_SCORE = 10;
const WIN_GEMS = 15;
const LOSS_GEMS = 10;

function getQuestions(part2Unlocked = false) {
  const part1Questions = getAllLessons()
    .flatMap(l => l.questions || [])
    .filter(q => q.type === "multiple_choice")
    .map(q => ({ question: q.question, options: q.options, correct: q.correct }));

  const part2Questions = part2Unlocked
    ? getAllPart2Lessons()
        .flatMap(l => l.questions || [])
        .filter(q => q.type === "multiple_choice")
        .map(q => ({ question: q.question, options: q.options, correct: q.correct }))
    : [];

  const allQuestions = [...part1Questions, ...part2Questions];
  const seed = Date.now() % 1000000;
  const order = shuffleQuestions(seed, allQuestions.length);
  return order.slice(0, 20).map(i => shuffleOptions(allQuestions[i]));
}
export default function BotBattleController({
  myName, avatarConfig, progress, setProgress, onExit,
}) {
  const [phase, setPhase] = useState("pregame");
  const [myScore, setMyScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [won, setWon] = useState(false);
  const [forfeitMessage, setForfeitMessage] = useState(null);

  // Bot and questions stored in refs so they can be swapped on Play Again
  // without triggering re-renders or stale closure issues
  const botRef = useRef(generateBot());
  const part2Unlocked = (progress?.owned_items || []).includes('part2-unlocked');
const questionsRef = useRef(getQuestions(part2Unlocked));

  // Mirrors of score state for use inside callbacks (avoid stale closures)
  const myScoreRef = useRef(0);
  const botScoreRef = useRef(0);
  const phaseRef = useRef("pregame");
  const gemsAwardedRef = useRef(false);
const progressRef = useRef(progress);
useEffect(() => { progressRef.current = progress; }, [progress]);
  const botIntervalRef = useRef(null);
  const paramsRef = useRef(null);

  // Expose current bot as a state so BotPreGame / BotEndScreen re-render when it changes
  const [botSnapshot, setBotSnapshot] = useState(() => ({ ...botRef.current }));

  function clearBotTimer() {
    if (botIntervalRef.current) {
      clearInterval(botIntervalRef.current);
      botIntervalRef.current = null;
    }
  }

  function startBotInterval() {
    if (!paramsRef.current) return;
    // Pick a fixed tick interval close to the midpoint of the speed range
    const [min, max] = paramsRef.current.speedRange;
    const interval = (min + max) / 2;

    botIntervalRef.current = setInterval(() => {
      if (phaseRef.current !== "playing") {
        clearBotTimer();
        return;
      }
      const correct = Math.random() < paramsRef.current.accuracy;
      if (correct) {
        const newBotScore = botScoreRef.current + 1;
        botScoreRef.current = newBotScore;
        setBotScore(newBotScore);
        if (newBotScore >= WIN_SCORE) {
          finishGame(false);
        }
      }
    }, interval);
  }

  function startPlaying() {
    paramsRef.current = getBotParams(botRef.current);
    phaseRef.current = "playing";
    setPhase("playing");
    localStorage.setItem(PENDING_FORFEIT_KEY, "1");
    startBotInterval();
  }

  function handleUserAnswer(correct) {
    if (phaseRef.current !== "playing") return;
    if (correct) {
      const newMyScore = myScoreRef.current + 1;
      myScoreRef.current = newMyScore;
      setMyScore(newMyScore);
      playChaChig();
      if (newMyScore >= WIN_SCORE) {
        finishGame(true);
        return;
      }
    }
    setQuestionIdx(prev => prev + 1);
  }

  function finishGame(userWon, forfeit = false) {
    clearBotTimer();
    phaseRef.current = "finished";
    localStorage.removeItem(PENDING_FORFEIT_KEY);

    const result = userWon ? "win" : forfeit ? "forfeit" : "loss";
    saveBattleLog({
      botName: botRef.current.name,
      botEmoji: botRef.current.emoji,
      botStrength: botRef.current.strength,
      result,
      myScore: myScoreRef.current,
      botScore: botScoreRef.current,
      gemChange: userWon ? WIN_GEMS : -LOSS_GEMS,
    });

    // Badge battle tracking
  const battlePlayed = (progressRef.current.badge_battles_played || 0) + 1;
const battleWins = userWon ? (progressRef.current.badge_battle_wins || 0) + 1 : (progressRef.current.badge_battle_wins || 0);
    updateProgress(progressRef.current, { badge_battles_played: battlePlayed, badge_battle_wins: battleWins }).then(async (updated) => {
  const { checkNewBadges, buildBadgeUpdate } = await import("../../lib/badges");
  const newBadges = checkNewBadges(updated);
  if (newBadges.length) {
    const badgeUpd = buildBadgeUpdate(updated, newBadges);
    await updateProgress(updated, badgeUpd);
  }
});

    if (userWon) {
      setLossStreak(0);
      awardWinGems();
    } else {
      setLossStreak(getLossStreak() + 1);
      deductLossGems(forfeit);
    }

    setWon(userWon);
    setPhase("finished");
  }

  async function awardWinGems() {
  if (gemsAwardedRef.current) return;
  gemsAwardedRef.current = true;
  const newGems = (progressRef.current.gems || 0) + WIN_GEMS;
  const updated = { ...progressRef.current, gems: newGems };
  await updateProgress(progressRef.current, { gems: newGems });
  const { checkNewBadges, buildBadgeUpdate } = await import("../../lib/badges");
  const newBadges = checkNewBadges({ ...updated, badge_battle_wins: (progressRef.current.badge_battle_wins || 0) + 1 });
  if (newBadges.length) {
    const badgeUpd = buildBadgeUpdate(updated, newBadges);
    const withBadges = await updateProgress(updated, badgeUpd);
    setProgress(withBadges);
  } else {
    setProgress(updated);
  }
}

  async function deductLossGems(forfeit = false) {
  const newGems = Math.max(0, (progressRef.current.gems || 0) - LOSS_GEMS);
  const updated = { ...progressRef.current, gems: newGems };
  await updateProgress(progressRef.current, { gems: newGems });
  setProgress(updated);
  if (forfeit) setForfeitMessage(`You forfeited the battle. -${LOSS_GEMS} gems.`);
}

  function handleForfeit() {
    finishGame(false, true);
  }

  useEffect(() => {
    return () => { clearBotTimer(); };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (phaseRef.current === "playing") {
        localStorage.setItem(PENDING_FORFEIT_KEY, "1");
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  function handlePlayAgain() {
    clearBotTimer();

    // Generate a brand new bot, guaranteed different name & strength
    const newBot = generateBot(botRef.current.name, botRef.current.strength);
    botRef.current = newBot;
    setBotSnapshot({ ...newBot });

    // Fresh questions
const part2Unlocked = (progress?.owned_items || []).includes('part2-unlocked');
questionsRef.current = getQuestions(part2Unlocked);
    // Reset all state
    myScoreRef.current = 0;
    botScoreRef.current = 0;
    gemsAwardedRef.current = false;
    paramsRef.current = null;
    setMyScore(0);
    setBotScore(0);
    setQuestionIdx(0);
    setWon(false);
    setForfeitMessage(null);
    phaseRef.current = "pregame";
    setPhase("pregame");
  }

  const currentQuestion = questionsRef.current[questionIdx % questionsRef.current.length];

  if (phase === "pregame") {
    return <BotPreGame bot={botSnapshot} onReady={startPlaying} />;
  }

  if (phase === "finished") {
    return (
      <BotEndScreen
        won={won}
        myScore={myScore}
        botScore={botScore}
        myName={myName || "You"}
        bot={botSnapshot}
        winGems={WIN_GEMS}
        lossGems={LOSS_GEMS}
        forfeitMessage={forfeitMessage}
        onPlayAgain={handlePlayAgain}
        onBack={onExit}
      />
    );
  }

  return (
    <BotQuestion
      question={currentQuestion}
      questionNum={questionIdx + 1}
      myScore={myScore}
      botScore={botScore}
      myName={myName || "You"}
      botName={botSnapshot.name}
      onAnswer={handleUserAnswer}
      onForfeit={handleForfeit}
    />
  );
}