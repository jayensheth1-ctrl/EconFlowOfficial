export const part2Units = [
  {
    id: "unit-5",
    title: "Global Trade Empire",
    description: "Master international economics",
    color: "from-violet-500 to-purple-700",
    part2: true,
    lessons: [
      {
        id: "5-1",
        title: "How Countries Trade",
        studyBrief: "Countries trade because no single nation can produce everything efficiently. The key concept is comparative advantage — a country should specialize in what it produces most efficiently relative to others, then trade for the rest. This creates mutual gains even if one country is better at producing everything. Trade creates a surplus of cheaper imported goods for consumers, but can hurt domestic industries. A trade surplus means you export more than you import; a trade deficit means the opposite.",
        questions: [
          {
            type: "multiple_choice",
            question: "What is 'comparative advantage' in trade?",
            options: [
              "A country produces what it's relatively best at making",
              "When one country beats all others in every product",
              "Having the biggest army to enforce trade deals",
              "Charging the highest prices for exports"
            ],
            correct: 0,
            explanation: "Comparative advantage means countries specialize in goods they produce most efficiently relative to others, then trade — creating gains for everyone."
          },
          {
            type: "true_false",
            question: "Free trade between countries generally lowers prices for consumers.",
            correct: true,
            explanation: "More competition from global suppliers pushes prices down — great news for shoppers!"
          },
          {
            type: "multiple_choice",
            question: "What is a trade deficit?",
            options: [
              "When a country imports more than it exports",
              "When exports exceed imports",
              "A type of currency devaluation",
              "A government penalty on foreign goods"
            ],
            correct: 0,
            explanation: "A trade deficit means a country is buying more from the world than it's selling — money flows out."
          },
          {
            type: "word_bank",
            question: "Countries ___ goods they produce cheaply and ___ goods others make better.",
            blanks: ["export", "import"],
            options: ["export", "import", "hoard", "destroy", "tax"],
            explanation: "Export = sell abroad. Import = buy from abroad. Trade benefits everyone by letting each country focus on its strengths!"
          },
          {
            type: "multiple_choice",
            question: "Which of these is an example of comparative advantage?",
            options: [
              "Brazil specializes in coffee because it grows best there",
              "A country banning all foreign products",
              "Two countries producing identical goods",
              "A government printing more money to buy imports"
            ],
            correct: 0,
            explanation: "Brazil's climate makes it relatively more efficient at coffee production — a classic comparative advantage example."
          },
          {
            type: "true_false",
            question: "A trade surplus always means a country's economy is stronger than one with a deficit.",
            correct: false,
            explanation: "Not necessarily! The US has run trade deficits for decades while maintaining the world's largest economy. It reflects consumption patterns, not just economic health."
          }
        ]
      },
      {
        id: "5-2",
        title: "Currency & Exchange Rates",
        studyBrief: "Every country (or region) has its own currency, and exchange rates determine how much of one currency you get for another. A stronger currency makes your imports cheaper but exports more expensive for foreign buyers. Exchange rates fluctuate constantly based on interest rates, inflation, trade flows, and investor confidence. The Foreign Exchange (Forex) market is the world's largest financial market, trading over $7.5 trillion per day. Central banks sometimes intervene to stabilize their currency.",
        questions: [
          {
            type: "multiple_choice",
            question: "What is a currency exchange rate?",
            options: [
              "The price of one currency in terms of another",
              "A bank fee for currency deposits",
              "The interest rate on international loans",
              "The speed at which governments print money"
            ],
            correct: 0,
            explanation: "Exchange rates tell you how much of one currency you get for another, e.g. 1 USD = 0.92 EUR."
          },
          {
            type: "true_false",
            question: "A stronger home currency makes your country's exports cheaper for foreigners.",
            correct: false,
            explanation: "A stronger currency actually makes exports MORE expensive abroad — foreigners need more of their own currency to buy your goods, potentially hurting export sales."
          },
          {
            type: "multiple_choice",
            question: "If USD strengthens against EUR, what happens to American tourists in Europe?",
            options: [
              "Their dollars buy more euros — travel becomes cheaper!",
              "Travel to Europe becomes more expensive",
              "Nothing changes — exchange rates don't affect tourists",
              "Americans can no longer use dollars abroad"
            ],
            correct: 0,
            explanation: "A stronger dollar buys more euros, making European goods, hotels, and food cheaper for American travelers."
          },
          {
            type: "word_bank",
            question: "Forex is short for ___ exchange — the world's ___ financial market.",
            blanks: ["foreign", "largest"],
            options: ["foreign", "local", "largest", "smallest", "digital"],
            explanation: "The Foreign Exchange (Forex) market trades $7.5 trillion per day — far larger than stock markets!"
          },
          {
            type: "multiple_choice",
            question: "Which factor most directly causes a currency to appreciate (gain value)?",
            options: [
              "Rising interest rates attracting foreign investment",
              "High government debt levels",
              "Rapid money printing by the central bank",
              "A large trade deficit"
            ],
            correct: 0,
            explanation: "Higher interest rates offer better returns for investors holding that currency, increasing demand and pushing its value up."
          },
          {
            type: "true_false",
            question: "The Forex market operates 24 hours a day, 5 days a week.",
            correct: true,
            explanation: "Currency markets never sleep on weekdays — they trade around the clock across Tokyo, London, and New York time zones."
          }
        ]
      },
      {
        id: "5-3",
        title: "Tariffs & Globalization",
        studyBrief: "Tariffs are taxes placed on imported goods, making them more expensive to protect domestic industries. While tariffs can shield local jobs short-term, they often raise prices for consumers and can trigger retaliatory tariffs from other countries — a trade war. Globalization has deeply interconnected supply chains: a single iPhone uses components from 40+ countries. The World Trade Organization (WTO) sets international trade rules to ensure fair competition. Trade agreements like NAFTA/USMCA reduce barriers between member nations.",
        questions: [
          {
            type: "multiple_choice",
            question: "What is a tariff?",
            options: [
              "A tax on imported goods",
              "A type of high-yield savings account",
              "An international trade agreement",
              "A currency exchange processing fee"
            ],
            correct: 0,
            explanation: "Tariffs make imported goods more expensive, protecting domestic industries but often raising consumer prices."
          },
          {
            type: "true_false",
            question: "Globalization has made supply chains completely independent of other countries.",
            correct: false,
            explanation: "Globalization has made supply chains MORE interconnected, not independent — countries rely heavily on each other for components, raw materials, and finished goods."
          },
          {
            type: "multiple_choice",
            question: "Which organization oversees international trade rules?",
            options: [
              "World Trade Organization (WTO)",
              "The United Nations (UN)",
              "NATO",
              "World Health Organization (WHO)"
            ],
            correct: 0,
            explanation: "The WTO sets and enforces global trade rules to ensure fair competition between countries and resolve disputes."
          },
          {
            type: "multiple_choice",
            question: "What is a likely consequence of a trade war (both countries raising tariffs on each other)?",
            options: [
              "Higher prices for consumers in both countries",
              "Lower prices as competition increases",
              "Faster economic growth globally",
              "Stronger currencies for both sides"
            ],
            correct: 0,
            explanation: "Trade wars typically hurt consumers in both countries through higher prices, and can slow global economic growth."
          },
          {
            type: "true_false",
            question: "Free trade agreements always benefit every single worker in participating countries.",
            correct: false,
            explanation: "Free trade creates overall gains but also losers — workers in industries that face more foreign competition may lose jobs, even as consumers benefit from lower prices."
          },
          {
            type: "word_bank",
            question: "A trade ___ between countries reduces or eliminates ___ on goods traded between them.",
            blanks: ["agreement", "tariffs"],
            options: ["agreement", "dispute", "tariffs", "profits", "currencies"],
            explanation: "Trade agreements like USMCA lower or eliminate tariffs between member nations, boosting cross-border commerce."
          }
        ]
      }
    ]
  },
  {
    id: "unit-6",
    title: "Crypto & Digital Finance",
    description: "Navigate the digital money revolution",
    color: "from-cyan-500 to-blue-700",
    part2: true,
    lessons: [
      {
        id: "6-1",
        title: "What is Blockchain?",
        studyBrief: "Blockchain is a digital ledger — a record of transactions distributed across thousands of computers worldwide. Unlike a bank's private database, no single entity controls it. Each 'block' contains a batch of transactions; once verified and added, it can't be altered without changing every subsequent block (making fraud extremely difficult). Bitcoin, created in 2009, was the first major blockchain application. Miners use powerful computers to verify transactions and earn newly created coins as a reward — this is called 'Proof of Work.'",
        questions: [
          {
            type: "multiple_choice",
            question: "What is a blockchain?",
            options: [
              "A digital ledger recording transactions that can't be easily altered",
              "A type of credit card with blockchain security",
              "An online bank regulated by governments",
              "A government-controlled financial system"
            ],
            correct: 0,
            explanation: "A blockchain is a secure, decentralized record of transactions maintained by thousands of computers — no single point of control or failure."
          },
          {
            type: "true_false",
            question: "Bitcoin was the first major cryptocurrency.",
            correct: true,
            explanation: "Bitcoin, created in 2009 by the pseudonymous 'Satoshi Nakamoto', launched the cryptocurrency revolution."
          },
          {
            type: "word_bank",
            question: "Blockchain is ___ meaning no single person or bank ___ it.",
            blanks: ["decentralized", "controls"],
            options: ["decentralized", "centralized", "controls", "ignores", "invests"],
            explanation: "Decentralization spreads power across thousands of nodes — there's no CEO of Bitcoin, no headquarters to shut down."
          },
          {
            type: "multiple_choice",
            question: "What is 'mining' in cryptocurrency?",
            options: [
              "Solving complex math problems to verify transactions and earn crypto",
              "Physically digging for precious metals",
              "Selling cryptocurrency at a profit",
              "Storing crypto in a hardware wallet"
            ],
            correct: 0,
            explanation: "Miners use powerful computers to validate transactions and are rewarded with new coins — securing the network while earning income."
          },
          {
            type: "true_false",
            question: "Once data is recorded on a blockchain, it can be easily deleted or modified.",
            correct: false,
            explanation: "Blockchain data is immutable — altering any block requires re-computing all subsequent blocks across thousands of computers simultaneously, making fraud practically impossible."
          },
          {
            type: "multiple_choice",
            question: "What makes blockchain different from a traditional bank database?",
            options: [
              "It's distributed across thousands of computers with no central authority",
              "It charges higher fees than traditional banks",
              "It's controlled by a single government",
              "Transactions take several days to settle"
            ],
            correct: 0,
            explanation: "Traditional bank databases are centralized and privately controlled. Blockchain is distributed — anyone can verify the ledger."
          }
        ]
      },
      {
        id: "6-2",
        title: "NFTs & Digital Ownership",
        studyBrief: "NFT stands for Non-Fungible Token. 'Fungible' means interchangeable — one dollar equals any other dollar. 'Non-fungible' means unique and irreplaceable. NFTs use blockchain to prove digital ownership of a specific item: artwork, music, game items, or even tweets. The NFT is a digital certificate of authenticity stored on the blockchain. While anyone can view or copy a digital image, only one person holds the verified NFT ownership record. NFT markets are highly speculative — values can skyrocket or collapse rapidly.",
        questions: [
          {
            type: "multiple_choice",
            question: "What does NFT stand for?",
            options: [
              "Non-Fungible Token",
              "New Financial Transfer",
              "Net Fiscal Trade",
              "National Fund Token"
            ],
            correct: 0,
            explanation: "NFT = Non-Fungible Token. Non-fungible means unique and irreplaceable, unlike currency where every unit is identical."
          },
          {
            type: "true_false",
            question: "'Non-fungible' means something is unique and cannot be directly replaced by another identical item.",
            correct: true,
            explanation: "A dollar bill is fungible (any dollar = any other dollar). The Mona Lisa is non-fungible — it's totally unique and irreplaceable!"
          },
          {
            type: "multiple_choice",
            question: "What can be sold as an NFT?",
            options: [
              "Digital art, music, video clips, virtual game items",
              "Only physical paintings that have been scanned",
              "Only government-approved financial assets",
              "Only registered domain names"
            ],
            correct: 0,
            explanation: "Anything digital can become an NFT — artwork, music, game items, tweets, and more. The NFT certifies authentic ownership."
          },
          {
            type: "multiple_choice",
            question: "If someone 'right-clicks and saves' an NFT image, what do they actually have?",
            options: [
              "A copy of the image, but NOT the verified ownership record",
              "Full legal ownership of the NFT",
              "An equally valid version of the NFT",
              "Nothing — the image disappears from their device"
            ],
            correct: 0,
            explanation: "Anyone can save a copy of an NFT image, but only the verified blockchain record proves who truly 'owns' it — like a photocopy vs. the original deed."
          },
          {
            type: "true_false",
            question: "NFT prices are stable and predictable, making them a safe investment.",
            correct: false,
            explanation: "NFT markets are highly speculative — values can rise 10,000% or collapse to near zero within months. They are considered extremely high-risk assets."
          },
          {
            type: "word_bank",
            question: "An NFT uses ___ technology to provide a verifiable proof of ___ for a digital item.",
            blanks: ["blockchain", "ownership"],
            options: ["blockchain", "banking", "ownership", "creation", "payment"],
            explanation: "The blockchain acts as a permanent, public ownership certificate — solving the problem of proving who 'really' owns a digital file."
          }
        ]
      },
      {
        id: "6-3",
        title: "Crypto Risk & Regulation",
        studyBrief: "Cryptocurrency is exciting but carries extreme risk. Prices can swing 50%+ in days — Bitcoin dropped 80% in 2018 and again in 2022. Unlike bank accounts, crypto has no government deposit insurance. If you lose your private key (essentially your password), your funds are gone forever. Governments worldwide are increasingly regulating crypto for consumer protection, tax compliance, and preventing money laundering. While blockchain transactions are publicly visible, investigators can trace them — 'crypto is not anonymous.'",
        questions: [
          {
            type: "multiple_choice",
            question: "Why is cryptocurrency considered high-risk?",
            options: [
              "Extreme price volatility and limited regulatory protection",
              "It's only legally available in certain countries",
              "All banks control and manipulate crypto prices",
              "Crypto always loses value over time"
            ],
            correct: 0,
            explanation: "Crypto prices can swing 50%+ in days. High risk = high potential reward but also the possibility of massive losses — with no safety net."
          },
          {
            type: "true_false",
            question: "Crypto transactions are completely anonymous and untraceable by governments.",
            correct: false,
            explanation: "Blockchain transactions are pseudonymous and publicly visible — governments increasingly use blockchain analytics to trace transactions and identify users."
          },
          {
            type: "word_bank",
            question: "A crypto ___ stores your digital coins using a private ___ you must never lose.",
            blanks: ["wallet", "key"],
            options: ["wallet", "bank", "key", "password", "card"],
            explanation: "Lose your private key = lose your crypto forever. Unlike a forgotten bank password, there's no customer service to recover it!"
          },
          {
            type: "multiple_choice",
            question: "What is a 'crypto wallet' used for?",
            options: [
              "Storing private keys that give access to your cryptocurrency",
              "A physical pouch for keeping USB drives",
              "A government-issued crypto bank account",
              "A tool for mining new cryptocurrency"
            ],
            correct: 0,
            explanation: "A crypto wallet stores your private keys — it doesn't hold coins directly, but controls access to them on the blockchain."
          },
          {
            type: "true_false",
            question: "If a crypto exchange gets hacked and your coins are stolen, government insurance will reimburse you.",
            correct: false,
            explanation: "Unlike bank deposits (insured up to $250K in the US by FDIC), cryptocurrency held on exchanges has no government protection if hacked."
          },
          {
            type: "multiple_choice",
            question: "Why are governments increasing regulation of cryptocurrency?",
            options: [
              "Tax compliance, consumer protection, and preventing money laundering",
              "To gain control of blockchain networks",
              "To help crypto prices increase",
              "Because crypto is inherently illegal"
            ],
            correct: 0,
            explanation: "Regulation aims to protect consumers, ensure taxes are paid, and prevent crypto from being used for illegal activities — not to ban it outright."
          }
        ]
      }
    ]
  },
  {
    id: "unit-7",
    title: "Taxes & Government Power",
    description: "How governments fund the world",
    color: "from-amber-500 to-red-600",
    part2: true,
    lessons: [
      {
        id: "7-1",
        title: "How Taxes Work",
        studyBrief: "Taxes are mandatory payments to governments that fund public services — roads, schools, military, healthcare. The main types: Income tax (on earnings), Sales tax (on purchases), Property tax (on real estate), and Corporate tax (on business profits). Progressive tax systems charge higher rates as income rises — the US uses tax 'brackets' where only income above each threshold is taxed at the higher rate. A flat tax charges the same percentage to everyone. Sales taxes are regressive — they take a bigger share of income from poorer people who spend proportionally more.",
        questions: [
          {
            type: "multiple_choice",
            question: "What is a progressive tax system?",
            options: [
              "Higher earners pay a higher percentage of their income in taxes",
              "Everyone pays the exact same flat dollar amount",
              "Only corporations and businesses pay taxes",
              "Tax rates decrease as personal income rises"
            ],
            correct: 0,
            explanation: "Progressive taxes charge higher rates on higher incomes — the more you earn, the higher your marginal tax bracket rate."
          },
          {
            type: "true_false",
            question: "Sales tax is an example of a regressive tax because it takes a higher percentage of income from lower earners.",
            correct: true,
            explanation: "A $10 sales tax represents 10% of $100 income but only 1% of $1,000 income — the same dollar amount hurts lower-income people proportionally more."
          },
          {
            type: "multiple_choice",
            question: "What is the main purpose of taxes?",
            options: [
              "Fund public services like roads, schools, and national defense",
              "Make wealthy people poorer through redistribution",
              "Directly control inflation by removing money from circulation",
              "Primarily reward government workers with high salaries"
            ],
            correct: 0,
            explanation: "Taxes fund shared services everyone uses — from traffic lights and bridges to national defense and public schools."
          },
          {
            type: "word_bank",
            question: "A ___ tax takes the same percentage from everyone regardless of their ___.",
            blanks: ["flat", "income"],
            options: ["flat", "steep", "income", "age", "country"],
            explanation: "Flat tax = one rate for all. E.g., 15% on everyone's income, whether you earn $20K or $2M."
          },
          {
            type: "multiple_choice",
            question: "In the US, if you're in the 24% tax bracket, does that mean you pay 24% on ALL your income?",
            options: [
              "No — only income above the bracket threshold is taxed at 24%",
              "Yes — the entire income is taxed at 24%",
              "No — you pay 24% on your last dollar only",
              "It depends on whether you file as single or married"
            ],
            correct: 0,
            explanation: "US brackets are marginal — only the portion of income above each threshold gets taxed at that rate. Lower portions are taxed at lower rates."
          },
          {
            type: "true_false",
            question: "Capital gains tax applies to profits made from selling investments like stocks or property.",
            correct: true,
            explanation: "When you sell an asset for more than you paid, the profit (capital gain) is taxable. Long-term gains (held over a year) typically receive lower tax rates than regular income."
          }
        ]
      },
      {
        id: "7-2",
        title: "Government Spending",
        studyBrief: "Governments spend money on two main categories: mandatory spending (entitlements like Social Security, Medicare — automatic by law) and discretionary spending (military, education, infrastructure — decided annually). When a government spends more than it collects in taxes, it runs a deficit and must borrow money by issuing bonds, adding to the national debt. Fiscal policy is using taxes and spending to influence the economy: during recessions, governments stimulate by spending more and cutting taxes; during overheating, they do the opposite (austerity).",
        questions: [
          {
            type: "multiple_choice",
            question: "What is 'national debt'?",
            options: [
              "The total accumulated amount a government owes from past borrowing",
              "The total private debt owed by all citizens combined",
              "Trade deficits accumulated over many years",
              "Unpaid taxes from businesses and individuals"
            ],
            correct: 0,
            explanation: "National debt is the total of all past government budget deficits — money borrowed but not yet repaid, often in the form of government bonds."
          },
          {
            type: "true_false",
            question: "Fiscal policy refers to how governments use taxes and spending to influence the economy.",
            correct: true,
            explanation: "Fiscal policy is the government's economic toolkit — adjusting spending and taxes to stimulate growth or cool down an overheating economy."
          },
          {
            type: "multiple_choice",
            question: "During a recession, what fiscal policy might a government use?",
            options: [
              "Increase spending and cut taxes to stimulate the economy",
              "Raise taxes to reduce the budget deficit immediately",
              "Stop all government spending to save money",
              "Print money without any spending changes"
            ],
            correct: 0,
            explanation: "Governments stimulate recessions with more spending (infrastructure, unemployment benefits) and tax cuts to boost consumer demand."
          },
          {
            type: "multiple_choice",
            question: "What is a 'budget deficit'?",
            options: [
              "When government spending exceeds tax revenue in a given year",
              "When the national debt reaches $1 trillion",
              "When tax revenue exceeds government spending",
              "When a country has a trade imbalance"
            ],
            correct: 0,
            explanation: "A deficit = spending more than you earn in one year. The accumulated total of deficits (and surpluses) equals the national debt."
          },
          {
            type: "true_false",
            question: "Government bonds are how governments borrow money from investors.",
            correct: true,
            explanation: "When governments need to fund deficits, they issue bonds — investors lend money and receive it back with interest after a set period."
          },
          {
            type: "word_bank",
            question: "Governments fund deficits by issuing ___ — promises to repay investors with ___.",
            blanks: ["bonds", "interest"],
            options: ["bonds", "stocks", "interest", "dividends", "taxes"],
            explanation: "Treasury bonds are government IOUs — investors earn guaranteed interest for lending the government money."
          }
        ]
      },
      {
        id: "7-3",
        title: "Central Banks & Inflation",
        studyBrief: "Central banks (like the US Federal Reserve, European Central Bank) are independent institutions that manage a country's money supply and interest rates. Their main goals: control inflation (target ~2%) and maximize employment. Their main tool is the federal funds rate — raising rates makes borrowing more expensive, slowing spending and inflation; cutting rates stimulates borrowing and growth. Unlike fiscal policy (government taxes/spending), monetary policy is set by unelected central bank officials, shielded from short-term political pressure.",
        questions: [
          {
            type: "multiple_choice",
            question: "What does the Federal Reserve (central bank) primarily control?",
            options: [
              "Interest rates and the money supply",
              "Government tax rates and budgets",
              "Individual stock prices on exchanges",
              "International trade deals and tariffs"
            ],
            correct: 0,
            explanation: "Central banks like the Fed set benchmark interest rates and control money supply — their decisions ripple through the entire economy."
          },
          {
            type: "true_false",
            question: "High inflation is generally good for people who hold large amounts of cash savings.",
            correct: false,
            explanation: "Inflation erodes purchasing power — your cash buys less over time. Bad for savers, but potentially beneficial for borrowers who repay loans with 'cheaper' future dollars."
          },
          {
            type: "word_bank",
            question: "When inflation is too high, the central bank ___ interest rates to ___ borrowing.",
            blanks: ["raises", "reduce"],
            options: ["raises", "lowers", "reduce", "increase", "freeze"],
            explanation: "Higher interest rates make loans more expensive, slowing spending and investment — cooling down inflationary pressure."
          },
          {
            type: "multiple_choice",
            question: "What is 'quantitative easing' (QE)?",
            options: [
              "A central bank buying assets to inject money into the economy",
              "Raising taxes to reduce inflation",
              "Cutting government spending to balance the budget",
              "Printing money to directly pay citizens"
            ],
            correct: 0,
            explanation: "QE = central bank buys bonds from banks, giving them cash to lend. It lowers long-term rates and stimulates the economy when normal rate cuts aren't enough."
          },
          {
            type: "true_false",
            question: "Central banks in most democracies operate independently from direct government political control.",
            correct: true,
            explanation: "Independence protects monetary policy from short-term political pressure — politicians might want low rates before elections regardless of inflation consequences."
          },
          {
            type: "multiple_choice",
            question: "The Fed's 'dual mandate' means it aims to control both:",
            options: [
              "Inflation AND unemployment",
              "Taxes AND government spending",
              "Stock prices AND bond yields",
              "Trade deficits AND currency strength"
            ],
            correct: 0,
            explanation: "The Fed's two goals are price stability (controlling inflation, targeting ~2%) and maximum employment — sometimes these goals conflict!"
          }
        ]
      }
    ]
  },
  {
    id: "unit-8",
    title: "Build Your Empire",
    description: "Entrepreneurship & business strategy",
    color: "from-emerald-500 to-teal-700",
    part2: true,
    lessons: [
      {
        id: "8-1",
        title: "Starting a Business",
        studyBrief: "Starting a business begins with an idea that solves a real problem. A business plan is your roadmap — covering your product, target market, revenue model, and financial projections. Business structure matters: sole proprietorships are simplest but expose personal assets; LLCs and corporations create legal separation (limited liability) protecting your personal wealth if the business fails. Funding options range from bootstrapping (self-funding) to angel investors, venture capital, or bank loans. Your unique value proposition (UVP) is the compelling reason customers choose you over competitors.",
        questions: [
          {
            type: "multiple_choice",
            question: "What is a business plan?",
            options: [
              "A document outlining your business goals, strategy, and financial projections",
              "A legal list of all employees and their salaries",
              "A government license required to operate",
              "A type of special business bank account"
            ],
            correct: 0,
            explanation: "A business plan is your roadmap — covering what you'll sell, to whom, how you'll market it, and how you'll make money."
          },
          {
            type: "true_false",
            question: "An LLC (Limited Liability Company) protects your personal assets if the business fails.",
            correct: true,
            explanation: "An LLC creates legal separation between you and the business — creditors generally can't go after your personal savings, home, or car."
          },
          {
            type: "multiple_choice",
            question: "What is 'bootstrapping' a startup?",
            options: [
              "Self-funding your business without outside investors",
              "Copying a competitor's proven business model exactly",
              "Receiving a government grant to start operations",
              "Hiring 100 employees before launching the product"
            ],
            correct: 0,
            explanation: "Bootstrapping = building with your own money, staying lean, and growing organically — keeping full ownership and control."
          },
          {
            type: "word_bank",
            question: "A unique value ___ explains why customers should choose your business over the ___.",
            blanks: ["proposition", "competition"],
            options: ["proposition", "tax", "competition", "government", "bank"],
            explanation: "Your unique value proposition is your 'why us?' — the compelling reason customers pick you over every alternative."
          },
          {
            type: "multiple_choice",
            question: "What is an 'angel investor'?",
            options: [
              "A wealthy individual who invests in early-stage startups for equity",
              "A government program providing startup grants",
              "A bank offering low-interest small business loans",
              "A nonprofit organization that funds charities"
            ],
            correct: 0,
            explanation: "Angel investors are high-net-worth individuals who invest their own money in early startups, often before venture capital is available."
          },
          {
            type: "true_false",
            question: "Most new businesses become profitable within their first year of operation.",
            correct: false,
            explanation: "The majority of startups take several years to reach profitability — if they get there at all. Most businesses require time to build customers and scale efficiently."
          }
        ]
      },
      {
        id: "8-2",
        title: "Revenue & Profit",
        studyBrief: "Revenue is all the money your business brings in from sales. Profit is what remains after subtracting all costs — split into gross profit (revenue minus cost of goods sold) and net profit (after ALL expenses including rent, salaries, and taxes). A business can have high revenue but still be unprofitable if costs are too high. Cash flow is equally critical — you can be technically profitable on paper but run out of cash if customers pay late. 'Burn rate' measures how fast a startup spends its cash reserves; 'runway' is how many months until that cash runs out.",
        questions: [
          {
            type: "multiple_choice",
            question: "What's the difference between revenue and profit?",
            options: [
              "Revenue is total sales; profit is what's left after all costs",
              "They mean exactly the same thing in accounting",
              "Profit is total sales; revenue is what's left after taxes",
              "Revenue only counts digital or online sales"
            ],
            correct: 0,
            explanation: "Revenue = all money coming in. Profit = Revenue minus ALL expenses. A business can have huge revenue but zero (or negative) profit!"
          },
          {
            type: "true_false",
            question: "A company can show accounting profit while simultaneously having negative cash flow.",
            correct: true,
            explanation: "If customers owe you money (accounts receivable), you show paper profit but have no cash to pay your own bills — many profitable businesses go bankrupt from cash flow problems."
          },
          {
            type: "multiple_choice",
            question: "What is 'burn rate' for a startup?",
            options: [
              "How fast it's spending its cash reserves each month",
              "How quickly its products fly off shelves",
              "The rate at which it's gaining new customers",
              "Monthly tax obligations to the government"
            ],
            correct: 0,
            explanation: "Burn rate = monthly net cash spending. A startup with $1M in the bank burning $100K/month has 10 months of 'runway' before insolvency."
          },
          {
            type: "multiple_choice",
            question: "What is 'gross margin'?",
            options: [
              "Revenue minus the direct cost of producing goods, as a percentage",
              "Total profit after all expenses including taxes",
              "The percentage of revenue paid to employees",
              "Revenue minus marketing costs only"
            ],
            correct: 0,
            explanation: "Gross margin = (Revenue - Cost of Goods Sold) / Revenue. A high gross margin means you keep a large chunk of each sale before overhead costs."
          },
          {
            type: "true_false",
            question: "A startup with positive net profit can never go bankrupt.",
            correct: false,
            explanation: "Even profitable companies can go bankrupt due to cash flow problems — if you can't pay your bills when they're due (even if you'll eventually profit), you're insolvent."
          },
          {
            type: "word_bank",
            question: "Startup ___ is how many months of spending a company can sustain before running out of ___.",
            blanks: ["runway", "cash"],
            options: ["runway", "profit", "cash", "debt", "investors"],
            explanation: "Runway = cash divided by monthly burn rate. VCs monitor this closely — running out of runway without profitability means the startup fails."
          }
        ]
      },
      {
        id: "8-3",
        title: "Scaling & Valuation",
        studyBrief: "Scaling means growing revenue faster than costs — a software company can serve millions of users with minimal added cost (high scalability) unlike a restaurant that must hire more staff for every 10 extra customers. Company valuation is the estimated total worth, often calculated as a multiple of revenue or earnings. Venture capitalists (VCs) invest in high-growth startups expecting massive returns from a few big winners. A 'unicorn' is a startup valued at $1B+. When a company goes public through an IPO (Initial Public Offering), it sells shares on the stock exchange.",
        questions: [
          {
            type: "multiple_choice",
            question: "What does a company's 'valuation' represent?",
            options: [
              "The estimated total worth of the company based on growth and earnings",
              "Its exact annual revenue for last year",
              "The total number of full-time employees",
              "The total outstanding debt the company owes"
            ],
            correct: 0,
            explanation: "Valuation = what investors believe a company is worth — based on current earnings, growth rate, market potential, and comparable companies."
          },
          {
            type: "true_false",
            question: "A 'unicorn' is a startup valued at over $1 billion.",
            correct: true,
            explanation: "Unicorns (like Uber, Airbnb, SpaceX before going public) are rare billion-dollar startups — hence the mythical name!"
          },
          {
            type: "word_bank",
            question: "Venture ___ invest in early-stage startups hoping for massive ___ on their investment.",
            blanks: ["capitalists", "returns"],
            options: ["capitalists", "bankers", "returns", "losses", "taxes"],
            explanation: "Venture capitalists (VCs) fund risky early-stage companies, knowing most will fail but expecting a few to become unicorns — more than offsetting the losses."
          },
          {
            type: "multiple_choice",
            question: "What is an IPO (Initial Public Offering)?",
            options: [
              "When a private company first sells its shares to the public on a stock exchange",
              "When a company issues new products internationally",
              "When a startup receives its first round of venture funding",
              "When a business merges with a public company"
            ],
            correct: 0,
            explanation: "An IPO is when a private company 'goes public' — selling shares on a stock exchange for the first time, raising capital while allowing early investors to cash out."
          },
          {
            type: "true_false",
            question: "A company with high scalability can grow revenue dramatically without proportionally increasing costs.",
            correct: true,
            explanation: "That's the power of scalable businesses — software, platforms, and digital products can serve millions more users with almost no additional cost per user."
          },
          {
            type: "multiple_choice",
            question: "A startup valued at 10x revenue means investors are paying $10 for every $1 of annual sales. This implies:",
            options: [
              "Investors expect strong future growth to justify the premium",
              "The company is highly unprofitable and struggling",
              "The startup is worth exactly its annual revenue",
              "The company has been profitable for over 10 years"
            ],
            correct: 0,
            explanation: "High revenue multiples reflect growth expectations — investors pay a premium today betting on much larger future revenues."
          }
        ]
      }
    ]
  },
  {
    id: "unit-9",
    title: "Real Estate Mogul",
    description: "Build wealth through property",
    color: "from-rose-500 to-pink-700",
    part2: true,
    lessons: [
      {
        id: "9-1",
        title: "How Real Estate Works",
        studyBrief: "Real estate is land and the buildings on it — one of humanity's oldest investments. Properties generate wealth in two ways: appreciation (value rising over time) and rental income (tenants paying monthly). Historically, real estate appreciates ~3-5% per year, though local markets vary wildly. A REIT (Real Estate Investment Trust) lets you invest in a portfolio of properties like a stock — without being a landlord. 'Equity' is the portion you truly own: property value minus any outstanding mortgage. As you pay down your loan and values rise, equity grows.",
        questions: [
          {
            type: "multiple_choice",
            question: "What does 'appreciation' mean in real estate?",
            options: [
              "When property value increases over time",
              "When you thank your landlord for good service",
              "The ongoing cost to maintain and repair a property",
              "A type of adjustable-rate mortgage product"
            ],
            correct: 0,
            explanation: "Appreciation = your property's value going up. Historically, real estate appreciates ~3-5% per year nationally, though local markets vary enormously."
          },
          {
            type: "true_false",
            question: "A REIT (Real Estate Investment Trust) lets you invest in property without buying real estate directly.",
            correct: true,
            explanation: "REITs trade like stocks — you own a share of a portfolio of office buildings, apartments, or malls without being a landlord!"
          },
          {
            type: "multiple_choice",
            question: "What is 'equity' in real estate?",
            options: [
              "The portion of the property you own outright (market value minus remaining debt)",
              "The monthly rental income the property generates",
              "The annual property taxes you pay to the government",
              "The interest rate on your mortgage loan"
            ],
            correct: 0,
            explanation: "Equity = current market value minus your remaining mortgage. As you pay down the loan and the property appreciates, your equity grows."
          },
          {
            type: "multiple_choice",
            question: "Which of the following is NOT a way real estate generates wealth?",
            options: [
              "Guaranteed value — real estate never loses value",
              "Appreciation — property values rising over time",
              "Rental income — tenants paying monthly rent",
              "Tax advantages — mortgage interest deductions"
            ],
            correct: 0,
            explanation: "Real estate absolutely CAN lose value — as the 2008 financial crisis demonstrated dramatically. No investment is guaranteed to rise."
          },
          {
            type: "true_false",
            question: "Location is the most important factor in determining real estate value.",
            correct: true,
            explanation: "'Location, location, location' — the same house in different cities or neighborhoods can differ by 10x in value. Proximity to jobs, schools, and amenities drives prices."
          },
          {
            type: "word_bank",
            question: "Real estate investors aim for ___ income from tenants and long-term ___ as property values rise.",
            blanks: ["rental", "appreciation"],
            options: ["rental", "dividend", "appreciation", "depreciation", "interest"],
            explanation: "The two pillars of real estate investing: rental income provides monthly cash flow while appreciation builds long-term wealth."
          }
        ]
      },
      {
        id: "9-2",
        title: "Mortgages & Leverage",
        studyBrief: "A mortgage is a loan using the property itself as collateral. Most buyers put down 10-20% and borrow the rest. This is leverage — using borrowed money to control a larger asset. Leverage amplifies both gains AND losses: if you put 20% down on a $500K home and it rises 10% to $550K, your return on your $100K investment is actually 50%. But if it drops 10%, your $100K is wiped out. Amortization is the process of gradually paying off the loan — early payments are mostly interest, later payments chip away at the principal (actual loan amount).",
        questions: [
          {
            type: "multiple_choice",
            question: "What is a mortgage?",
            options: [
              "A loan secured by property used to finance its purchase",
              "A fixed monthly rent payment to a landlord",
              "A property insurance policy covering damage",
              "A special type of tax-advantaged investment account"
            ],
            correct: 0,
            explanation: "A mortgage is a loan where the property is the collateral — if you stop paying, the bank can foreclose (take) the property."
          },
          {
            type: "true_false",
            question: "Using leverage (borrowed money) in real estate can amplify both gains and losses.",
            correct: true,
            explanation: "Leverage magnifies returns in both directions. A 10% property gain on a 20% down payment equals a 50% return on your invested capital — but a 10% drop wipes out your down payment entirely."
          },
          {
            type: "multiple_choice",
            question: "What does 'amortization' mean for a mortgage?",
            options: [
              "Gradually paying off the loan balance through regular scheduled payments",
              "Selling the property quickly to avoid foreclosure",
              "Adding penalty fees for late mortgage payments",
              "Refinancing the loan at a lower interest rate"
            ],
            correct: 0,
            explanation: "Amortization spreads payments over the loan term — early payments are mostly interest (bank profits first), later ones predominantly reduce principal."
          },
         {
  type: "word_bank",
  question: "A lower ___ rate means lower monthly ___ and less total cost over the loan term.",
  blanks: ["interest", "payments"],
  options: ["interest", "payments", "tax", "equity", "rent"],
  explanation: "Even a 1% lower rate on a $300K mortgage saves tens of thousands of dollars over 30 years. Rate shopping matters enormously!"
},
          {
            type: "multiple_choice",
            question: "If you buy a $400K home with 20% down ($80K) and it appreciates to $500K, what is your return on investment?",
            options: [
              "125% return — you made $100K on an $80K investment",
              "25% return — the home increased by 25% in value",
              "20% return — equal to your down payment percentage",
              "10% return — based on market average appreciation"
            ],
            correct: 0,
            explanation: "This is the power of leverage! $100K gain on $80K invested = 125% ROI, even though the property only rose 25% in value."
          },
          {
            type: "true_false",
            question: "A fixed-rate mortgage means your monthly payment stays the same for the entire loan term.",
            correct: true,
            explanation: "Fixed-rate mortgages lock in your interest rate and payment — great for budgeting and protection against rising rates. Adjustable-rate mortgages (ARMs) can change after an initial period."
          }
        ]
      },
      {
        id: "9-3",
        title: "Rental Income Strategy",
        studyBrief: "Rental real estate can generate passive income — money flowing in while you sleep. Cash flow is what remains after collecting rent and paying ALL expenses: mortgage, property taxes, insurance, maintenance, vacancy costs, and management fees. The 1% Rule is a quick screening tool: monthly rent should be at least 1% of purchase price for likely positive cash flow. Cap rate (capitalization rate) measures annual return independent of financing. The BRRRR strategy (Buy, Rehab, Rent, Refinance, Repeat) lets investors recycle capital to acquire multiple properties.",
        questions: [
          {
            type: "multiple_choice",
            question: "What is 'cash flow' in rental real estate?",
            options: [
              "Rental income minus ALL expenses (mortgage, taxes, repairs, management)",
              "The total gross rental income before any deductions",
              "The current market value of the rental property",
              "Your monthly mortgage payment amount"
            ],
            correct: 0,
            explanation: "Positive cash flow = rent collected exceeds ALL costs. That's true passive income! Negative cash flow means the property costs you money each month."
          },
          {
            type: "true_false",
            question: "The '1% rule' suggests monthly rent should be at least 1% of the property's purchase price.",
            correct: true,
            explanation: "A $200K property should ideally rent for $2,000+/month for likely positive cash flow. It's a quick screening tool — not a guarantee."
          },
          {
            type: "multiple_choice",
            question: "What is cap rate in real estate investing?",
            options: [
              "Annual net operating income divided by property value, as a percentage",
              "The maximum monthly rent legally allowed under local law",
              "The annual property tax rate charged by local government",
              "The ratio of loan amount to property value (LTV ratio)"
            ],
            correct: 0,
            explanation: "Cap rate = Net Operating Income / Property Value. It measures yield independent of financing. Higher cap rate = higher return but often higher risk area."
          },
          {
            type: "multiple_choice",
            question: "Which of the following is a cost real estate investors often underestimate?",
            options: [
              "Vacancy periods when the property sits empty between tenants",
              "The mortgage payment — always the largest expense",
              "Property appreciation — it's too unpredictable to estimate",
              "Tenant screening fees — charged by the government"
            ],
            correct: 0,
            explanation: "Vacancy is a major hidden cost — even 1 month empty per year on a $2,000/month property is $2,000 lost, a 8.3% impact on annual income."
          },
          {
            type: "true_false",
            question: "A property manager typically charges 8-12% of monthly rent to manage a rental property.",
            correct: true,
            explanation: "Professional property management costs 8-12% of rent (plus fees for leasing). It eliminates landlord headaches but significantly impacts cash flow."
          },
          {
            type: "word_bank",
            question: "Real estate investors aim for ___ cash flow where rent ___ all monthly expenses.",
            blanks: ["positive", "exceeds"],
            options: ["positive", "negative", "exceeds", "matches", "avoids"],
            explanation: "Positive cash flow is the goal — rent exceeding all costs means the property pays for itself and generates income each month."
          }
        ]
      }
    ]
  }
];

export function getAllPart2Lessons() {
  const lessons = [];
  part2Units.forEach(unit => {
    unit.lessons.forEach(lesson => {
      lessons.push({ ...lesson, unitId: unit.id, unitTitle: unit.title, unitColor: unit.color });
    });
  });
  return lessons;
}

export function getPart2LessonById(id) {
  for (const unit of part2Units) {
    const lesson = unit.lessons.find(l => l.id === id);
    if (lesson) return { ...lesson, unitId: unit.id, unitTitle: unit.title, unitColor: unit.color };
  }
  return null;
}