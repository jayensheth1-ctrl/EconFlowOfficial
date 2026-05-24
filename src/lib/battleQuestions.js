/**
 * Flat list of all multiple-choice questions (4 options) pulled from the lesson bank.
 * These are pre-loaded and cached for battle mode — no network fetch mid-game.
 */
export const BATTLE_QUESTIONS = [
  {
    question: "What is simple interest?",
    options: ["Interest earned only on the original principal","Interest earned on interest","A type of bank fee","Money you owe the government"],
    correct: 0,
  },
  {
    question: "If you invest $100 at 10% simple interest, how much do you have after 1 year?",
    options: ["$110","$100","$120","$90"],
    correct: 0,
  },
  {
    question: "The Rule of 72 helps you estimate how long it takes to:",
    options: ["Double your money","Triple your money","Lose your money","Pay off debt"],
    correct: 0,
  },
  {
    question: "At 8% annual return, approximately how many years to double your money?",
    options: ["9 years","12 years","6 years","15 years"],
    correct: 0,
  },
  {
    question: "Why is the Rule of 72 useful for investors?",
    options: ["It provides a quick mental estimate","It's required by law","Banks use it to set rates","It guarantees returns"],
    correct: 0,
  },
  {
    question: "What does 'time value of money' mean?",
    options: ["A dollar today is worth more than a dollar tomorrow","Time is money","Money loses value over centuries","Banks charge for your time"],
    correct: 0,
  },
  {
    question: "Which factor does NOT affect the time value of money?",
    options: ["The color of your wallet","Interest rates","Inflation","Time period"],
    correct: 0,
  },
  {
    question: "Supply refers to:",
    options: ["The amount of a product sellers are willing to offer at various prices","The amount consumers want to buy","The total money in an economy","Government-produced goods"],
    correct: 0,
  },
  {
    question: "What is the law of supply?",
    options: ["Higher prices lead to higher quantity supplied","Higher prices lead to lower quantity supplied","Prices don't affect supply","Supply is always constant"],
    correct: 0,
  },
  {
    question: "Demand represents:",
    options: ["How much consumers are willing to buy at various prices","How much is produced","The government's needs","Total imports"],
    correct: 0,
  },
  {
    question: "Which would increase demand for umbrellas?",
    options: ["A rainy season forecast","A drought","A sale on sunglasses","Lower umbrella production"],
    correct: 0,
  },
  {
    question: "Market equilibrium occurs when:",
    options: ["Quantity supplied equals quantity demanded","Prices are at their highest","The government sets the price","There is no competition"],
    correct: 0,
  },
  {
    question: "If a product's price is below equilibrium, what happens?",
    options: ["A shortage occurs","A surplus occurs","Nothing changes","Supply increases"],
    correct: 0,
  },
  {
    question: "What is net income?",
    options: ["Income after taxes and deductions","Total income before anything is taken out","Money from side jobs only","Investment returns"],
    correct: 0,
  },
  {
    question: "Which is a variable expense?",
    options: ["Groceries","Rent","Car payment","Insurance premium"],
    correct: 0,
  },
  {
    question: "How many months of expenses should an emergency fund cover?",
    options: ["3-6 months","1 month","12 months","1 week"],
    correct: 0,
  },
  {
    question: "Which is NOT a good reason to use your emergency fund?",
    options: ["Buying the latest smartphone","Unexpected medical bills","Car repairs","Job loss"],
    correct: 0,
  },
  {
    question: "What does buying a stock represent?",
    options: ["Owning a small piece of a company","Lending money to a company","Buying a company's products","Getting a guaranteed return"],
    correct: 0,
  },
  {
    question: "What is a dividend?",
    options: ["A share of company profits paid to stockholders","A type of tax","A bank fee","Interest on a bond"],
    correct: 0,
  },
  {
    question: "What does 'risk tolerance' mean?",
    options: ["How much financial risk you're comfortable with","The maximum money you can lose","A type of insurance","Government risk regulations"],
    correct: 0,
  },
  {
    question: "Which investment typically has the lowest risk?",
    options: ["Government bonds","Cryptocurrency","Individual stocks","Startup investments"],
    correct: 0,
  },
  {
    question: "Diversification means spreading investments to:",
    options: ["Reduce risk","Guarantee returns","Avoid taxes","Maximize a single stock"],
    correct: 0,
  },
  {
    question: "Which budgeting rule suggests 50% needs, 30% wants, 20% savings?",
    options: ["The 50/30/20 rule","The Rule of 72","The 80/20 rule","The 60/40 rule"],
    correct: 0,
  },
  {
    question: "A surplus in a market means:",
    options: ["Supply exceeds demand","Demand exceeds supply","Supply equals demand","Prices are at equilibrium"],
    correct: 0,
  },
  {
    question: "What is gross income?",
    options: ["Total pay before any deductions","Pay after taxes","Money saved each month","Investment income"],
    correct: 0,
  },
  {
    question: "What happens to quantity demanded when price rises?",
    options: ["It decreases","It increases","It stays the same","It doubles"],
    correct: 0,
  },
  {
    question: "Compound interest is calculated on:",
    options: ["Principal plus previously earned interest","Only the original principal","Only the interest","The tax amount"],
    correct: 0,
  },
  {
    question: "At 12% interest, the Rule of 72 says money doubles in approximately:",
    options: ["6 years","9 years","12 years","4 years"],
    correct: 0,
  },
  {
    question: "Bonds represent:",
    options: ["Lending money to a company or government","Owning part of a company","A savings account","A government grant"],
    correct: 0,
  },
  {
    question: "Which account is best for storing an emergency fund?",
    options: ["High-yield savings account","Stock portfolio","Retirement account","Cryptocurrency wallet"],
    correct: 0,
  },
];

/** Fisher-Yates shuffle of question indices */
export function shuffleQuestions(seed, length) {
  const arr = Array.from({ length }, (_, i) => i);
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Shuffle the options of a single question, remapping the correct index */
export function shuffleOptions(question) {
  const indices = question.options.map((_, i) => i);
  // Fisher-Yates with Math.random (client-side, per question render)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffledOptions = indices.map(i => question.options[i]);
  const newCorrect = indices.indexOf(question.correct);
  return { ...question, options: shuffledOptions, correct: newCorrect };
}