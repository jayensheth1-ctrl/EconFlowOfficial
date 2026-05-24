import { useState, useEffect, useCallback } from "react";
import { announce } from "../../lib/a11y";

export default function WordBank({ question, onAnswer }) {
  const [filledBlanks, setFilledBlanks] = useState(
    Array(question.blanks.length).fill(null)
  );
  const [availableWords, setAvailableWords] = useState(() => {
  const words = [...question.options];
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words;
});
  const [submitted, setSubmitted] = useState(false);
  const [kbWordIdx, setKbWordIdx] = useState(0); // keyboard-selected word index

  // Announce instructions on mount
  useEffect(() => {
    announce(
      `Fill in the blanks. Use arrow keys to choose a word, then press a number key (1, 2, 3…) to place it in that answer box. ${question.question.replace(/___/g, "blank")}`
    );
  }, []);

  // Announce current word selection as user arrows through
  useEffect(() => {
    if (availableWords.length === 0) return;
    const w = availableWords[kbWordIdx];
    if (w) announce(`Word: ${w}`, { speak: false }); // silent, just live-region update
  }, [kbWordIdx]);

  // Keyboard handler
  const handleKeyDown = useCallback((e) => {
    if (submitted) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setKbWordIdx(i => Math.min(i + 1, availableWords.length - 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setKbWordIdx(i => Math.max(i - 1, 0));
    } else if (/^[1-9]$/.test(e.key)) {
      const boxIndex = parseInt(e.key, 10) - 1;
      if (boxIndex >= question.blanks.length) return;
      const word = availableWords[kbWordIdx];
      if (!word) return;

      // If box already filled, swap back
      const newBlanks = [...filledBlanks];
      const oldWord = newBlanks[boxIndex];
      newBlanks[boxIndex] = word;
      const newAvail = availableWords.filter((_, i) => i !== kbWordIdx);
      if (oldWord) newAvail.push(oldWord);
      setFilledBlanks(newBlanks);
      setAvailableWords(newAvail);
      setKbWordIdx(0);
      announce(`"${word}" placed in box ${boxIndex + 1}.`);
    }
  }, [submitted, availableWords, kbWordIdx, filledBlanks, question.blanks.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleWordClick(word, wordIdx) {
    if (submitted) return;
    const nextBlankIndex = filledBlanks.findIndex((b) => b === null);
    if (nextBlankIndex === -1) return;

    const newBlanks = [...filledBlanks];
    newBlanks[nextBlankIndex] = word;
    setFilledBlanks(newBlanks);
    setAvailableWords(availableWords.filter((_, i) => i !== wordIdx));
  }

  function handleBlankClick(index) {
    if (submitted) return;
    const word = filledBlanks[index];
    if (!word) return;

    const newBlanks = [...filledBlanks];
    newBlanks[index] = null;
    setFilledBlanks(newBlanks);
    setAvailableWords([...availableWords, word]);
    announce(`Removed "${word}" from box ${index + 1}.`);
  }

  function handleSubmit() {
    if (filledBlanks.some((b) => b === null)) return;
    setSubmitted(true);
    const isCorrect = filledBlanks.every((b, i) => b === question.blanks[i]);
    announce(isCorrect ? "Correct!" : "Incorrect. Try again.");
    setTimeout(() => onAnswer(isCorrect, question.explanation), 500);
  }

  const parts = question.question.split("___");

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-base font-bold text-foreground leading-snug">
        Fill in the blanks:
      </h2>
      <p className="text-[10px] text-muted-foreground -mt-3">
        ⌨️ Arrow keys to select a word · Number keys (1, 2…) to place into a box
      </p>

      {/* Sentence with blanks */}
      <div className="bg-card rounded-xl border-2 border-border p-4 text-base font-medium leading-relaxed flex flex-wrap items-center gap-1">
        {parts.map((part, i) => (
          <span key={i} className="inline-flex items-center gap-1 flex-wrap">
            {part}
            {i < parts.length - 1 && (
              <button
                onClick={() => handleBlankClick(i)}
                aria-label={filledBlanks[i]
                  ? `Answer box ${i + 1}: ${filledBlanks[i]}. Click to remove.`
                  : `Answer box ${i + 1}: empty`}
                className={`
                  inline-flex items-center justify-center min-w-[80px] px-3 py-1.5 mx-1
                  rounded-lg border-2 border-dashed text-sm font-bold transition-all
                  ${filledBlanks[i]
                    ? submitted
                      ? filledBlanks[i] === question.blanks[i]
                        ? "border-primary bg-primary/10 text-primary border-solid"
                        : "border-destructive bg-destructive/10 text-destructive border-solid"
                      : "border-primary bg-primary/10 text-primary border-solid"
                    : "border-muted-foreground/30 text-muted-foreground"
                  }
                `}
              >
                {filledBlanks[i] ? `${filledBlanks[i]} (${i + 1})` : `___ (${i + 1})`}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Word options */}
      <div className="flex flex-wrap gap-2 justify-center" role="listbox" aria-label="Available words">
        {availableWords.map((word, idx) => (
          <button
            key={word}
            onClick={() => handleWordClick(word, idx)}
            aria-label={`Word option: ${word}`}
            aria-selected={idx === kbWordIdx}
            className="px-4 py-2.5 rounded-xl bg-card border-2 font-semibold text-sm
              text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all
              active:scale-95"
            style={{
              boxShadow: "0 3px 0 hsl(var(--border))",
              borderColor: idx === kbWordIdx ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: idx === kbWordIdx ? "hsl(var(--primary)/0.1)" : undefined,
              outline: idx === kbWordIdx ? "2px solid hsl(var(--primary))" : undefined,
            }}
          >
            {word}
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={filledBlanks.some((b) => b === null)}
          aria-label="Check your answers"
          className={`
            mt-2 w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200
            ${!filledBlanks.some((b) => b === null)
              ? "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
          style={!filledBlanks.some((b) => b === null) ? { boxShadow: "0 4px 0 hsl(145 63% 38%)" } : {}}
        >
          Check
        </button>
      )}
    </div>
  );
}