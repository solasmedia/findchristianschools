/**
 * Think Clearly — a free critical thinking course for grades 8–12.
 *
 * Single source of truth for the course: the hub page, the module pages,
 * the on-screen quiz, and the teacher Kahoot spreadsheet export all read
 * from this file. Adding a module is a data-only change: fill in a module
 * entry, flip its status to "live", and it appears everywhere.
 *
 * Student-facing copy rule: no business jargon. The ideas come from
 * critical thinking and everyday problem-solving practice, but they are
 * always named in plain words a student would use.
 *
 * Kahoot import limits are respected in the quiz data: questions are at
 * most 120 characters and answers at most 75 characters, so the same
 * questions can be exported to Kahoot's spreadsheet importer unchanged.
 */

export interface QuizQuestion {
  question: string;
  /** Exactly 4 answer options. */
  answers: [string, string, string, string];
  /** 1-based index of the correct answer, matching Kahoot's format. */
  correct: 1 | 2 | 3 | 4;
  /** One line shown on screen right after the student answers. */
  explanation: string;
  /** Seconds, exported to the Kahoot file. */
  timeLimit: number;
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
  verse?: { text: string; reference: string };
  callout?: { title: string; text: string };
  examples?: { closed: string; open: string; label: string }[];
}

export interface ModuleDrill {
  title: string;
  intro: string;
  /** Label shown before each model answer. Defaults to "One good question". */
  modelLabel?: string;
  items: { statement: string; model: string }[];
}

export interface CourseModule {
  number: number;
  slug: string;
  title: string;
  tagline: string;
  minutes: number;
  status: "live" | "coming-soon";
  image?: { src: string; alt: string };
  intro?: string;
  sections?: LessonSection[];
  drill?: ModuleDrill;
  quiz?: QuizQuestion[];
}

export const COURSE_TITLE = "Think Clearly";
export const COURSE_SUBTITLE =
  "A free critical thinking course for students in grades 8–12";

export const MODULES: CourseModule[] = [
  {
    number: 1,
    slug: "ask-better-questions",
    title: "Ask Better Questions",
    tagline: "Thinking starts with a question, not an answer.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
      alt: "A student writing questions in a notebook",
    },
    intro:
      "Before you can think clearly about anything — a headline, a project, a big decision — you have to know how to ask about it. This first module is about the skill every other module stands on: asking better questions.",
    sections: [
      {
        heading: "The teacher who asked questions",
        paragraphs: [
          "Here is something easy to miss when you read the Gospels: Jesus asked questions. A lot of them. The Gospels record him asking hundreds of questions — far more than he answered directly.",
          "He asked his followers, “Who do you say I am?” — a question that made them think, not just repeat. And in Mark 10, a blind man named Bartimaeus cried out for healing. His need could not have been more obvious. Jesus still stopped and asked him a question.",
          "If Jesus asked questions when he already knew every answer, then asking is not a sign of weakness. It is how careful thinkers start. A good question is not a delay. It is the doorway.",
        ],
        verse: {
          text: "And Jesus said to him, “What do you want me to do for you?”",
          reference: "Mark 10:51 (ESV)",
        },
      },
      {
        heading: "A brake and a steering wheel",
        paragraphs: [
          "A question does two jobs at once. It is a brake: it slows you down before you react, repeat, or rush in. And it is a steering wheel: it points your thinking at the part that actually matters.",
          "Most wrong turns in thinking are not about intelligence at all. They happen because people solve the first problem they see instead of the real one. Thirty seconds of asking beats thirty minutes of fixing the wrong problem.",
          "So before you answer, argue, share, or decide, brake first. Ask: What is really going on here? What do I actually know? What am I assuming?",
        ],
        verse: {
          text: "Know this, my beloved brothers: let every person be quick to hear, slow to speak, slow to anger.",
          reference: "James 1:19 (ESV)",
        },
      },
      {
        heading: "Closed questions get yes or no. Open questions get truth.",
        paragraphs: [
          "A closed question can be answered with yes, no, or one word. It ends the conversation. An open question starts with what, how, or why — and it cannot be answered without real thought. It invites the truth out.",
          "Neither kind is bad. Closed questions are fine for facts and times. But when something matters — a project, a purchase, a claim somebody wants you to believe — open questions are the ones that get you somewhere true. Compare these:",
        ],
        examples: [
          {
            label: "Homework",
            closed: "Did you finish the assignment?",
            open: "What is your plan for finishing the assignment, and what part is hardest?",
          },
          {
            label: "A group project",
            closed: "Is the poster almost finished?",
            open: "What parts are still missing, and what is our plan to finish them by Friday?",
          },
          {
            label: "A headline",
            closed: "Did scientists really discover that?",
            open: "What did the scientists actually find, and how did they test it?",
          },
        ],
      },
      {
        heading: "The Parking Lot",
        paragraphs: [
          "Here is a tool worth stealing for the rest of your life. When a question pops up that you cannot answer right now, do not drop it and do not let it derail you. Park it.",
          "Parking a question means writing it down — in a notebook, in your phone, on a sticky note — and deliberately coming back to it later. A parked question is not a dropped question. It is a question waiting for its turn.",
          "This one habit will help you everywhere: in class, when a lesson raises something you do not understand yet; on a group project, when a side topic pulls the team away from the main job; and in your faith, when a hard question about God needs time and honesty instead of a rushed answer.",
        ],
        callout: {
          title: "Try it this week",
          text: "Start a parking lot page in a notebook or your notes app. Every time a real question shows up — about school, the news, a project, your faith — write it down instead of letting it float away. Bring one parked question to a parent, teacher, or pastor this week.",
        },
      },
    ],
    drill: {
      title: "Turn statements into questions",
      intro:
        "A statement can feel like a dead end. A question opens a way forward. Practice by turning each statement below into an open question — then check the model answer and compare. Yours does not have to match; it has to be open.",
      items: [
        {
          statement: "“My science project is due on Friday.”",
          model:
            "What do I want my project to show, and what is my very first step today?",
        },
        {
          statement: "“I am saving up for a new bike.”",
          model:
            "How much do I need in total, what can I set aside each week, and what could I do to earn the rest?",
        },
        {
          statement: "“We won the game by a single point.”",
          model:
            "Which play made the biggest difference, and what could we practice before the next game?",
        },
      ],
    },
    quiz: [
      {
        question: "In Mark 10, what did Jesus ask the blind man who clearly needed healing?",
        answers: [
          "Do you believe I can do this?",
          "What do you want me to do for you?",
          "Why did you not ask sooner?",
          "Who told you where I was?",
        ],
        correct: 2,
        explanation:
          "“What do you want me to do for you?” (Mark 10:51). Jesus asked, even when the need seemed obvious.",
        timeLimit: 20,
      },
      {
        question: "Which of these is an OPEN question?",
        answers: [
          "Did you finish your homework?",
          "Is the test on Friday?",
          "What part of this assignment is hardest?",
          "Do we have practice today?",
        ],
        correct: 3,
        explanation:
          "Open questions cannot be answered yes or no — they invite real thought and honest answers.",
        timeLimit: 20,
      },
      {
        question:
          "Your teammate says after the game, “That was close!” What is the best follow-up question?",
        answers: [
          "Who scored the most points?",
          "What moment turned the game in our favor?",
          "Did we nearly lose it?",
          "Was the other team any good?",
        ],
        correct: 2,
        explanation:
          "“What moment turned the game in our favor?” digs into what actually happened instead of settling for yes or no.",
        timeLimit: 20,
      },
      {
        question: "What does it mean to park a question in the Parking Lot?",
        answers: [
          "Drop it and forget it",
          "Write it down and come back to it later",
          "Only ask it during class",
          "Save it for the final test",
        ],
        correct: 2,
        explanation:
          "Parking a question means writing it down and returning to it on purpose. Parked is not dropped.",
        timeLimit: 20,
      },
      {
        question: "Why ask questions BEFORE jumping into a problem?",
        answers: [
          "It makes you look smart",
          "It delays the hard work",
          "You might be solving the wrong problem",
          "Questions are always answered fast",
        ],
        correct: 3,
        explanation:
          "Thirty seconds of asking beats thirty minutes of fixing the wrong problem.",
        timeLimit: 20,
      },
    ],
  },
  {
    number: 2,
    slug: "facts-opinions-and-everything-between",
    title: "Facts, Opinions, and Everything Between",
    tagline: "Sort what can be proven from what is merely believed.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/5964491/pexels-photo-5964491.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Weighing an ingredient on a kitchen scale",
    },
    intro:
      "Every day, statements fly at you — from videos, friends, packaging, headlines, and your own feed. Some can be proven. Some are just what somebody thinks. And some sound solid but have never been checked. This module teaches you to sort them before they settle in your head as truth.",
    sections: [
      {
        heading: "The Bereans checked it out",
        paragraphs: [
          "In Acts 17, the apostle Paul taught in the city of Berea. The Bereans listened eagerly — and then they did something the Bible calls noble: they examined the Scriptures daily to see if what Paul said was true.",
          "Notice what they did not do. They did not accept it just because an apostle said it. And they did not reject it because it sounded new. They checked it against what they could trust. Checking was not a lack of faith. It was faith taking its job seriously.",
          "That is the habit this whole course builds, and it starts with a simple sort. Almost everything you hear is one of three things: a fact, an opinion, or a claim that still needs checking.",
        ],
        verse: {
          text: "Now these Jews were more noble than those in Thessalonica; they received the word with all eagerness, examining the Scriptures daily to see if these things were so.",
          reference: "Acts 17:11 (ESV)",
        },
      },
      {
        heading: "Three kinds of statements",
        paragraphs: [
          "A fact is a statement that can be checked and shown to be true: it can be measured, counted, timed, or looked up in a reliable record. 'The game ended 24 to 17.' 'This rope is three meters long.' Facts do not care how anyone feels about them.",
          "An opinion is what someone judges or prefers. 'That was the best game of the year.' 'Blue is the best color for a bike.' Opinions are not worthless — they tell you what a person values — but they cannot be proven the way a score can, and they should never be passed off as facts.",
          "Then there is everything between: statements that sound like facts but arrive without proof. 'Most people agree…' 'Scientists say…' 'This glue holds up to 100 pounds.' Some of them are true. Some are not. Until they are checked, they live in the third box: needs checking.",
        ],
        verse: {
          text: "The simple believes everything, but the prudent gives thought to his steps.",
          reference: "Proverbs 14:15 (ESV)",
        },
      },
      {
        heading: "Clue words",
        paragraphs: [
          "Statements often carry their own labels, if you know what to listen for. Measuring words — weighs, measures, scored, counted, at 3:00 — usually signal a fact, because they point at something you could check yourself.",
          "Judging words — best, worst, amazing, boring, should, ought to — usually signal an opinion. They are grading something, not measuring it. And foggy words — everyone, most people, studies show, they say — usually signal the third box. Who is 'everyone'? Which studies? Fog is a sign to slow down and check.",
          "One statement can mix all three: 'Our team won 3–1 (fact), so we are clearly the best team in the league (opinion), and everyone knows it (fog).' A clear thinker can take a sentence apart, piece by piece, and sort each piece on its own.",
        ],
      },
      {
        heading: "The ten-second sort",
        paragraphs: [
          "Here is the habit: when a statement lands, give it ten seconds before you believe it, repeat it, or act on it. Silently tag it — fact, opinion, or check. That tiny pause is the whole skill, and it works everywhere: in class, in a store, in a group chat, in a headline.",
          "You will be surprised how much of what sounds like knowledge turns out to be opinion wearing a fact costume, or fog wearing a confident voice. Sorting does not make you doubt everything. It makes you sure about the right things.",
        ],
        callout: {
          title: "Try it this week",
          text: "Pick one video, article, or conversation each day and sort three of its statements: fact, opinion, or needs checking. Write the tags in a notebook. Notice which box fills up fastest — that tells you what kind of talk surrounds you.",
        },
      },
    ],
    drill: {
      title: "Sort the statement",
      intro:
        "Read each statement and decide which box it belongs in: fact, opinion, or needs checking. Then open the model answer and compare your reasoning. The tag matters less than the reason behind it.",
      modelLabel: "The sort",
      items: [
        {
          statement: "“The final score was 24 to 17.”",
          model:
            "Fact. A score can be checked against the scorebook or the official record — it does not depend on anyone's preference.",
        },
        {
          statement: "“This is the best backpack ever made.”",
          model:
            "Opinion. 'Best ever' is a judgment. The speaker may love the backpack, but no measurement can prove a 'best ever.'",
        },
        {
          statement: "“This cereal now has 20% more!”",
          model:
            "Needs checking. More than what — last year's box, another brand, the old size? The claim sounds like a fact, but the missing comparison is exactly what you would have to check.",
        },
      ],
    },
    quiz: [
      {
        question: "In Acts 17, how did the Bereans respond to Paul's teaching?",
        answers: [
          "They believed it all without checking",
          "They examined the Scriptures daily to check it",
          "They waited for someone famous to agree",
          "They rejected it because it was new",
        ],
        correct: 2,
        explanation:
          "The Bereans received the word eagerly AND examined it daily. Eagerness and checking went together.",
        timeLimit: 20,
      },
      {
        question: "Which of these statements is a FACT?",
        answers: [
          "This is the best rope ever made",
          "Rope should always cost less",
          "This rope is three meters long",
          "Everyone prefers this rope",
        ],
        correct: 3,
        explanation:
          "Length can be measured. 'Best,' 'should,' and 'everyone prefers' are judgment or fog.",
        timeLimit: 20,
      },
      {
        question: "Which statement belongs in the 'needs checking' box?",
        answers: [
          "The recipe calls for two cups of flour",
          "Our team scored 18 points in the game",
          "Blue is a great color for a bike",
          "A video says this glue holds 100 pounds",
        ],
        correct: 4,
        explanation:
          "The glue claim sounds like a fact but arrives with no test you can see. Check before you trust.",
        timeLimit: 20,
      },
      {
        question: "Which word is a clue that a statement is probably an opinion?",
        answers: ["measured", "counted", "best", "Tuesday"],
        correct: 3,
        explanation:
          "Judging words like best, worst, and amazing grade something. Measuring words point at checkable facts.",
        timeLimit: 20,
      },
      {
        question: "Why sort statements into fact, opinion, and needs checking?",
        answers: [
          "So you can win more arguments",
          "So opinions stop existing",
          "So you never have to check anything",
          "So each statement gets only the trust it earned",
        ],
        correct: 4,
        explanation:
          "Sorting gives every statement the right amount of trust — full trust for proven facts, a pause for the rest.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 3,
    slug: "check-the-source",
    title: "Check the Source Before You Share It",
    tagline: "Who is telling you this — and why?",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/5491019/pexels-photo-5491019.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "A magnifying glass held over newspaper print",
    },
    intro:
      "Before a claim reaches you, it passes through somebody's hands — a person, a channel, a company, a friend of a friend. This module is about looking at the hands, not just the message: who is telling you this, what do they want, and can you find it anywhere else?",
    sections: [
      {
        heading: "Every message has a messenger",
        paragraphs: [
          "Imagine two people tell you the bridge on your road is closed. One is the road crew chief standing at the bridge. The other is someone who saw a screenshot of a post about a bridge in another state. Same words, very different weight.",
          "That is because information is only as strong as its source. A claim you see online has usually traveled: somebody saw something, posted about it, a channel clipped it, a friend shared the clip, and then it reached you. At every hop, pieces can fall off — the date, the place, the second half of the sentence.",
          "Clear thinkers do not just ask, 'Is this interesting?' They ask, 'Where did this actually come from?' Three questions will carry you a long way.",
        ],
      },
      {
        heading: "Three questions for any source",
        paragraphs: [
          "First: who is telling me this? A named person or organization that was actually there, or that studied the thing carefully, carries more weight than an unnamed account repeating it. Second: what do they want? Every source wants something — to inform you, to sell you something, to persuade you, to entertain you. Wanting something does not make a source dishonest, but you deserve to know what the want is.",
          "Third: can I find it somewhere else? When two separate, trustworthy places report the same thing independently, confidence grows. When a claim exists in exactly one screenshot and nowhere else on earth, that is information too.",
          "God cares about honest measure — a scale that reads true is his delight. Treat sources the same way: a good source measures straight and lets you check its work.",
        ],
        verse: {
          text: "A false balance is an abomination to the LORD, but a just weight is his delight.",
          reference: "Proverbs 11:1 (ESV)",
        },
      },
      {
        heading: "The screenshot problem",
        paragraphs: [
          "The weakest form a claim can travel in is a screenshot of a headline. It has no link to follow, no date you can trust, and no way to see what came before or after the cropped lines. Anyone can screenshot a headline from five years ago, or from a joke page, and send it around as today's news.",
          "Compare three versions of one story. Version one: a screenshot saying a Saturday game is cancelled. Version two: a teammate's post saying he heard the game might move. Version three: the league's own schedule page, updated that morning. The words are similar. The sources are not — and the third one is the one worth acting on.",
          "Rule of thumb: the closer a claim sits to the person or place it is about, the more weight it carries. A screenshot sits far away. Go closer.",
        ],
      },
      {
        heading: "Before you tap share",
        paragraphs: [
          "Sharing is publishing. The moment you forward something, your name rides on it — and if it turns out to be false, you helped spread it. The Bible's rule is blunt: do not spread a false report. The modern version takes ten seconds: pause, run the three questions, and check one other source before your thumb moves.",
          "You do not need to become suspicious of everything. Most days, the three questions take moments: a named source, an honest want, a second place that agrees. That is enough to share with a clear conscience — and to quietly skip the rest.",
        ],
        verse: {
          text: "You shall not spread a false report.",
          reference: "Exodus 23:1 (ESV)",
        },
        callout: {
          title: "Try it this week",
          text: "Before you forward one thing this week, track down its original source — the first place it appeared, not the loudest copy. Notice how the original usually says something quieter and more careful than the copies do.",
        },
      },
    ],
    drill: {
      title: "Which version do you trust?",
      intro:
        "The same news arrives in three forms. Rank them in your head — most trustworthy to least — then open the model answers to compare. The lesson is in the reasons.",
      modelLabel: "The verdict",
      items: [
        {
          statement:
            "Version A: A screenshot of a headline — 'Saturday's Game Cancelled!' — with no date and no source name visible.",
          model:
            "Weakest of the three. A screenshot can be old, cropped, or from a joke page, and there is no link to follow. Do not act on this one alone.",
        },
        {
          statement:
            "Version B: A teammate posts, 'Heard the game Saturday might be moved to the afternoon.'",
          model:
            "Middle. A real person you know, but it is secondhand — 'heard' and 'might' are fog words. Fine as a heads-up, not as a final answer.",
        },
        {
          statement:
            "Version C: The league's own website schedule page, updated this morning, lists the game at 2:00 PM.",
          model:
            "Strongest. This is the source itself, close to the decision, with a date you can check. This is the version worth planning your Saturday around.",
        },
      ],
    },
    quiz: [
      {
        question: "What is the first question to ask about any claim you see?",
        answers: [
          "How many likes does it have?",
          "Who is telling me this?",
          "Is it surprising?",
          "Did my friends share it?",
        ],
        correct: 2,
        explanation:
          "Start with the source. A claim is only as strong as the hands it passed through.",
        timeLimit: 20,
      },
      {
        question: "Why is a lone screenshot weak evidence for a claim?",
        answers: [
          "Screenshots are always fake",
          "It is too short to read",
          "It can crop away the date and the context",
          "Real news never uses pictures",
        ],
        correct: 3,
        explanation:
          "A screenshot strips the date, the place, and the link. You cannot check what you cannot follow.",
        timeLimit: 20,
      },
      {
        question: "Two unrelated, trustworthy places report the same event. What grows?",
        answers: [
          "Your confidence it is true",
          "The number of ads you see",
          "Nothing at all",
          "The need to share it fast",
        ],
        correct: 1,
        explanation:
          "Independent agreement is how confidence is built — one voice repeated is not the same thing.",
        timeLimit: 20,
      },
      {
        question: "In Proverbs 11:1, what does the LORD delight in?",
        answers: [
          "A loud voice",
          "A just weight — an honest measure",
          "The fastest answer",
          "A popular opinion",
        ],
        correct: 2,
        explanation:
          "A just weight is a scale that reads true. Good sources measure straight, like honest scales.",
        timeLimit: 20,
      },
      {
        question: "A channel reviews a product it is also selling. What should you remember?",
        answers: [
          "The review must be a lie",
          "Reviews are useless",
          "It cannot be checked anywhere",
          "The maker wants something — so check elsewhere",
        ],
        correct: 4,
        explanation:
          "Wanting to sell does not prove dishonesty. It does mean you verify the claims somewhere independent.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 4,
    slug: "claim-it-prove-it",
    title: "Claim It? Prove It",
    tagline: "Every claim needs evidence. Learn to ask for it.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/10822135/pexels-photo-10822135.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Packaged foods with labels spread on a table",
    },
    intro:
      "The world runs on claims: packages promise, videos declare, posts announce. A claim is a statement dressed up as truth — and some claims have earned it, and some have not. This module teaches you to spot the claim, ask for its evidence, and stay calm when two things happen at the same time.",
    sections: [
      {
        heading: "Test everything",
        paragraphs: [
          "Paul wrote a few short words that could run this whole course: test everything, and hold fast to what is good. Testing is not the opposite of faith — it is what faith does with everything it hears. Hold fast to what passes. Let the rest go.",
          "A claim is any statement presented as true that still needs its proof. 'This toothpaste helps prevent cavities.' 'This is the fastest route.' 'Our club raised the most money.' None of those is a fact yet. Each one is a claim, waiting for evidence to carry it.",
          "Once you start seeing claims, you cannot unsee them. They are printed on every box, spoken in every ad, and baked into half the videos in your feed. That is good news: claims can be tested, and now you know how to ask.",
        ],
        verse: {
          text: "Test everything; hold fast what is good.",
          reference: "1 Thessalonians 5:21 (ESV)",
        },
      },
      {
        heading: "Spot the claim",
        paragraphs: [
          "Claims wear costumes. The number costume: '9 out of 10 dentists recommend…' — numbers feel proven even when nobody tells you who did the counting. The crowd costume: 'Everyone is switching…' — everyone is a word that almost never gets counted at all.",
          "The speed costume: 'Works instantly!' The comparison costume: 'Now 50% stronger!' Stronger than what — last year's version, a rival, or a wet noodle? Each costume is a claim hiding its missing proof.",
          "Your first job is simply to spot it: what exactly is being said to be true here? Say it plainly, in your own words. Half the power of a claim evaporates the moment it stands in plain clothes.",
        ],
      },
      {
        heading: "Ask for the evidence",
        paragraphs: [
          "Evidence comes in strengths. At the top: a test you can watch, repeat, or check yourself — like timing two paper planes the same way, five throws each. Below that: a real study or test with the details shown — how many, compared to what, measured how.",
          "Weaker still: a famous person's endorsement, which proves they were paid, or pleased, but not that the claim is true. And at the bottom: a slogan, which is a claim wearing a costume and carrying no proof at all.",
          "So ask three things of any claim that matters: How many were tested? Compared to what? And who did the measuring? A claim that survives those questions has earned your trust. A claim that dodges them has told you something too.",
        ],
      },
      {
        heading: "Together is not because",
        paragraphs: [
          "Here is the sneakiest claim of all. In July, ice cream sales rise. In July, swimming pool visits rise too. Did ice cream cause the swimming? Did swimming cause the ice cream? Neither — summer caused both. Two things happening together is not proof that one caused the other.",
          "This trick powers a lot of confident talk: 'Ever since our team got new uniforms, we win more.' Maybe. Or the team also practiced more, and the schedule got easier. Before you credit one cause, ask what else changed at the same time.",
        ],
        verse: {
          text: "Do not judge by appearances, but judge with right judgment.",
          reference: "John 7:24 (ESV)",
        },
        callout: {
          title: "Try it this week",
          text: "Catch one claim a day — from a box, an ad, or a video — and write down the proof you would ask for: how many, compared to what, who measured? By Friday you will have a page of questions most adults never ask.",
        },
      },
    ],
    drill: {
      title: "What proof would you ask for?",
      intro:
        "Each statement below is a claim wearing a costume. For each one, name the proof you would ask for before believing it — then compare with the model answer.",
      modelLabel: "The proof to ask for",
      items: [
        {
          statement: "“9 out of 10 dentists recommend this toothpaste.”",
          model:
            "Ask: How many dentists were asked — ten, or ten thousand? What exactly were they asked? And who paid for the asking — the toothpaste company, or someone independent?",
        },
        {
          statement: "“Everyone is switching to this backpack.”",
          model:
            "Ask: Who is 'everyone' — has anyone counted? How many people switched, out of how many asked? 'Everyone' usually shrinks a lot when somebody counts.",
        },
        {
          statement: "“This battery lasts twice as long!”",
          model:
            "Ask: Twice as long as what — the old model, a rival brand, a candle? And in what test — playing video, or sitting in a drawer? A comparison without a partner is just a costume.",
        },
      ],
    },
    quiz: [
      {
        question: "What is a claim?",
        answers: [
          "A fact that has been proven twice",
          "A statement presented as true that needs proof",
          "Any sentence with a number in it",
          "A promise made by a friend",
        ],
        correct: 2,
        explanation:
          "A claim asks for your trust before showing its evidence. Testing is how it earns trust.",
        timeLimit: 20,
      },
      {
        question: "An ad says, '9 out of 10 players prefer this shoe.' Best question to ask?",
        answers: [
          "Which famous players?",
          "How much does the shoe cost?",
          "What colors does it come in?",
          "How many were asked, and who ran the test?",
        ],
        correct: 4,
        explanation:
          "How many, and who measured — those two questions strip the costume off most number claims.",
        timeLimit: 20,
      },
      {
        question: "Ice cream sales and swimming both rise in July. What does that prove?",
        answers: [
          "Ice cream makes people swim",
          "Swimming makes people buy ice cream",
          "Nothing about cause — summer drives both",
          "Ice cream sales cause hot weather",
        ],
        correct: 3,
        explanation:
          "Together is not because. A third thing — summer — explains both rising at once.",
        timeLimit: 20,
      },
      {
        question: "What does 1 Thessalonians 5:21 tell us to do with what we hear?",
        answers: [
          "Believe the first report",
          "Share it before checking",
          "Test everything and hold fast what is good",
          "Doubt everything forever",
        ],
        correct: 3,
        explanation:
          "Testing is not doubting — it is how truth gets held onto once it has been checked.",
        timeLimit: 20,
      },
      {
        question: "Which is the strongest evidence that a glue really holds 20 pounds?",
        answers: [
          "The slogan on the package",
          "A famous person's endorsement",
          "A test you can watch and repeat yourself",
          "A review with no details",
        ],
        correct: 3,
        explanation:
          "A repeatable test beats an endorsement, and an endorsement beats a slogan. Evidence has strengths.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 5,
    slug: "ask-why-five-times",
    title: "Ask Why Five Times",
    tagline: "Keep asking why until you reach the root of a problem.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/19895873/pexels-photo-19895873.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "A teenager repairing a bicycle in a workshop",
    },
    intro:
      "Some problems keep coming back — the same flat tire, the same dead battery, the same wilting plant — because every fix so far has treated only the top layer. This module teaches you to keep asking why until you reach the root: the one cause that, fixed once, ends the pattern.",
    sections: [
      {
        heading: "The problem that keeps coming back",
        paragraphs: [
          "Patch a bike tire on Monday, and it holds. Patch it again on Friday, and it holds. By the third patch in a month, a clear thinker stops blaming the tube and starts asking a better question: why does this keep happening?",
          "Most problems have layers. What you see — the flat — is the top layer, the symptom. Underneath it sits a chain of causes, each one explaining the layer above it. Fix only the symptom, and the chain is still down there, patiently producing the next flat.",
          "The tool for digging is almost embarrassingly simple: ask 'why?' about five times, each time asking it about the answer you just got. Five is not magic. It is just far enough, most days, to reach the bottom.",
        ],
      },
      {
        heading: "Deep water, drawn out",
        paragraphs: [
          "The book of Proverbs pictures it this way: purposes run deep, like water down a well, and a person of understanding draws them out. Causes are the same. They are rarely lying on the surface. They get drawn out, one honest answer at a time.",
        ],
        verse: {
          text: "The purpose in a man's heart is like deep water, but a man of understanding will draw it out.",
          reference: "Proverbs 20:5 (ESV)",
        },
      },
      {
        heading: "Two rules for the digging",
        paragraphs: [
          "Rule one: answer each why with a fact you can check — something you can look at, measure, or test — not a guess about someone's motives. 'The tire is cracked' can be checked. Guesses cannot carry a chain.",
          "Rule two: follow one chain at a time, and stop when you reach a cause you can actually fix. That cause is the root. Everything above it was the root showing itself, layer by layer.",
          "Ask the questions out loud or write them down, one under the other. A chain you can see is a chain you can test.",
        ],
      },
      {
        heading: "Worked example: the third flat tire",
        paragraphs: [
          "Problem: a bike gets its third flat in a month. Why #1 — why did the tire go flat? A sharp thorn punctured the tube. Why #2 — why did the thorn get through the tire? It slipped through a crack in the tire's sidewall.",
          "Why #3 — why is the sidewall cracked? The rubber is old and dried out; the tire has been on the bike for years. Why #4 — why has an old tire stayed on so long? Every flat got patched, so replacing the tire never seemed urgent. Why #5 — why patch every time? It felt quicker each time than stopping to ask why the flats kept coming.",
          "There is the root: an old, cracked tire that patches kept alive. The fix is not a fourth patch — it is a new tire. This same digging has solved problems a thousand times bigger: a famous monument in Washington was slowly wearing away, crews kept cleaning and repairing the stone, and the real cause turned out to be buried far below the surface — even the size of the problem changes nothing about the digging.",
        ],
        callout: {
          title: "Try it this week",
          text: "Choose one problem that has happened twice. Before you fix it again, write your chain of whys on paper. Fix the root you find — and notice whether the problem comes back a third time.",
        },
      },
    ],
    drill: {
      title: "Finish the chain",
      intro:
        "Each chain below is started for you — the problem and the first two whys. Keep asking why until you reach a root you can fix once. Then open the model chain and compare.",
      modelLabel: "The rest of the chain",
      items: [
        {
          statement:
            "Problem: The tomato plants keep wilting. Why #1: The roots are dry. Why #2: Water runs off the soil instead of soaking in.",
          model:
            "Why #3: The soil is packed hard and bare, so water sheets off the top. Why #4: No mulch was ever spread to cover it. Why #5: Planting day was rushed, and soil cover never made the list. Root fix: loosen the soil and add mulch once — then watering actually reaches the roots.",
        },
        {
          statement:
            "Problem: A phone battery keeps dying by noon. Why #1: The battery drains fast all morning. Why #2: Two apps run in the background the whole time.",
          model:
            "Why #3: The apps restart themselves after being closed. Why #4: Their settings allow background activity all day. Why #5: The settings were never changed from the day the phone was set up. Root fix: change the settings once — no more carrying a charger like a daily patch.",
        },
        {
          statement:
            "Problem: Finished homework keeps vanishing before class. Why #1: It is not in the folder where it belongs. Why #2: Loose papers get stuffed into the backpack wherever they fit.",
          model:
            "Why #3: At the end of class there is no fixed moment to file papers away. Why #4: The routine is 'grab everything and go.' Root fix: one home for homework — a single folder — and ten seconds to file before leaving class. Four whys was enough here; the root is what matters, not the count.",
        },
      ],
    },
    quiz: [
      {
        question: "Why ask 'why' more than once about a problem?",
        answers: [
          "The first answer is usually the symptom",
          "Repeating yourself is persuasive",
          "Five is a lucky number",
          "Adults like long answers",
        ],
        correct: 1,
        explanation:
          "The first answer names what you can see. The root sits a few answers deeper.",
        timeLimit: 20,
      },
      {
        question: "In the flat tire example, what was the root cause of the repeated flats?",
        answers: [
          "Sharp thorns on the road",
          "A fourth patch was needed",
          "An old, cracked tire that never got replaced",
          "The tube was poor quality",
        ],
        correct: 3,
        explanation:
          "The patches treated the symptom. The old tire was the cause producing flat after flat.",
        timeLimit: 20,
      },
      {
        question: "What makes an answer to a 'why' question a good one?",
        answers: [
          "It blames the right person",
          "It is a fact you can check",
          "It sounds confident",
          "It ends the conversation",
        ],
        correct: 2,
        explanation:
          "Checkable facts keep the chain honest. Guesses break the dig.",
        timeLimit: 20,
      },
      {
        question: "Proverbs 20:5 compares the purpose in a person's heart to what?",
        answers: ["A straight road", "A locked door", "A loud drum", "Deep water"],
        correct: 4,
        explanation:
          "Deep water — drawn out by a person of understanding, one honest answer at a time.",
        timeLimit: 20,
      },
      {
        question: "Your plant keeps wilting even though you water it daily. Best next step?",
        answers: [
          "Water it twice a day forever",
          "Ask why the water is not reaching the roots",
          "Buy a new plant every week",
          "Move it to a different window",
        ],
        correct: 2,
        explanation:
          "More of the same fix is another patch. Ask why until you find what to fix once.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 6,
    slug: "plan-try-check-fix",
    title: "Plan It, Try It, Check It, Fix It",
    tagline: "A simple loop for getting better at anything.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/31958038/pexels-photo-31958038.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "A student holding a red paper airplane in a classroom",
    },
    intro:
      "Nobody gets better at something by accident, and nobody gets it right the first time, either. What works — for builders, bakers, ball players, and lemonade stands — is a small loop: plan a change, try it, check what honestly happened, and fix what the check revealed. Then loop again.",
    sections: [
      {
        heading: "First, count the cost",
        paragraphs: [
          "Jesus once asked a question that belongs in every workshop and kitchen: which of you, wanting to build a tower, does not first sit down and count the cost? Planning is not stalling. It is sitting down before you stand up — deciding what you will build, what it will take, and how you will know it worked.",
          "The builders who finish towers are not the ones who never hit problems. They are the ones who planned, watched what actually happened, and adjusted. Four short steps, run in a loop, will improve almost anything you aim them at.",
        ],
        verse: {
          text: "For which of you, desiring to build a tower, does not first sit down and count the cost, whether he has enough to complete it?",
          reference: "Luke 14:28 (ESV)",
        },
      },
      {
        heading: "The four steps",
        paragraphs: [
          "Plan it: pick one change to make, and decide ahead of time how you will measure it. 'Sell more lemonade' is a wish; 'offer a second flavor and tally every sale' is a plan. Try it: run the plan for real, small enough to finish — one Saturday, one week, one practice. Change one or two things at a time, or you will never know which change did the work.",
          "Check it: look at the honest results — the count, the time, the tally — not the results you hoped for. Fix it: keep what worked, adjust what did not, and carry the lesson into the next plan. Then the loop turns again, a little smarter than last time.",
          "Notice what the loop refuses to do: it never declares victory or defeat from one try. A single attempt is data, not a verdict. The verdict comes from the loop — and the loop is always allowed to turn once more.",
        ],
      },
      {
        heading: "Worked example: the lemonade stand loop",
        paragraphs: [
          "Plan: two friends want their Saturday lemonade stand to beat last week's 18 cups. They ask a few neighbors what they would buy, decide to add a berry flavor, put a sign at the corner, and tally every sale on a sheet. Try: Saturday comes; they sell both flavors and mark the tally sheet cup by cup.",
          "Check: the count says 26 cups — and berry outsold plain two to one. Three customers also asked for a smaller size for little kids. Fix: next week they stock more berry supplies, add a small size, and keep the corner sign that clearly worked.",
          "Nobody doubled anything with a speech. They ran one small loop, read the tally honestly, and let the check write the next plan. That is how a stand — or a study routine, or a free throw — actually improves: loop by loop.",
        ],
      },
      {
        heading: "Loops beat launches",
        paragraphs: [
          "Big launches feel impressive: the giant study weekend, the total room reorganization, the brand-new everything. But a giant effort with no check is just a guess with confetti. Small loops win because each one teaches you something the next one uses.",
          "Keep the loop written down: four lines in a notebook — Plan, Try, Check, Fix — with a date. A written loop cannot quietly rewrite itself in your memory, and a month of pages is the best proof there is that you are actually getting better at something.",
        ],
        callout: {
          title: "Try it this week",
          text: "Pick something small — a free-throw routine, a homework habit, a recipe. Run one full loop on it this week: one planned change, one honest check, one fix. Write the four lines down.",
        },
      },
    ],
    drill: {
      title: "Run the loop on a paper airplane",
      intro:
        "A paper airplane keeps folding in the air after about two meters. Walk it through one full loop: for each step, decide what you would do — then compare with the model.",
      modelLabel: "The loop step",
      items: [
        {
          statement:
            "Step 1 — Plan it: What one change will you test, and how will you measure it?",
          model:
            "Change one thing: clip a paperclip to the nose for weight. Measure it the same way every time — five throws from the same line, paced off in meters. One change, one ruler: that is a plan.",
        },
        {
          statement:
            "Steps 2 and 3 — Try it and check it: The five throws go 2, 3, 2, 4, and 3 meters, and the plane still banks left. What does the check honestly say?",
          model:
            "The clip helped a little — most throws beat the old two meters — but it did not fix the left bank. A check reports both halves: what improved and what did not. No pretending, no despair.",
        },
        {
          statement: "Step 4 — Fix it: What do you carry into the next loop?",
          model:
            "Keep the paperclip — the check says it earned its place. Fix the next thing: bend the left wing tip slightly up to fight the bank, then run the loop again and let the new throws vote.",
        },
      ],
    },
    quiz: [
      {
        question: "What are the four steps of the loop, in order?",
        answers: [
          "Try it, plan it, fix it, check it",
          "Plan it, try it, check it, fix it",
          "Check it, fix it, plan it, try it",
          "Plan it, check it, try it, fix it",
        ],
        correct: 2,
        explanation: "Plan, try, check, fix — and then the loop turns again, smarter.",
        timeLimit: 20,
      },
      {
        question: "In Luke 14, what does Jesus say a tower builder should do first?",
        answers: [
          "Start building before doubts come",
          "Borrow more than he needs",
          "Sit down and count the cost",
          "Hire the largest crew available",
        ],
        correct: 3,
        explanation:
          "Count the cost first. Planning before building is the Bible's own advice.",
        timeLimit: 20,
      },
      {
        question: "What did the tally sheet do for the lemonade stand?",
        answers: [
          "It decorated the stand",
          "It counted real sales, so the check was honest",
          "It advertised the berry flavor",
          "It replaced the need to plan",
        ],
        correct: 2,
        explanation:
          "The check is only as honest as the count. Tally marks beat memories.",
        timeLimit: 20,
      },
      {
        question: "When you try a change, how much should you change at once?",
        answers: [
          "Everything, to save time",
          "Nothing, to be safe",
          "Only the easiest thing",
          "One or two things, so you know what worked",
        ],
        correct: 4,
        explanation:
          "Change everything at once, and the check cannot tell you which change did the work.",
        timeLimit: 20,
      },
      {
        question: "Your check shows the change did not help. What does the loop say?",
        answers: [
          "The project is a failure",
          "Never try that again",
          "Fix it: adjust, and run the loop again",
          "Hide the results and move on",
        ],
        correct: 3,
        explanation:
          "A disappointing try is data, not a verdict. Fix what the check revealed and loop again.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 7,
    slug: "first-things-first",
    title: "First Things First",
    tagline: "Not every problem matters equally. Put the biggest first.",
    minutes: 10,
    status: "coming-soon",
  },
  {
    number: 8,
    slug: "number-your-days",
    title: "Number Your Days",
    tagline: "Time is a gift. Learn to spend it on purpose.",
    minutes: 10,
    status: "coming-soon",
  },
  {
    number: 9,
    slug: "a-place-for-everything",
    title: "A Place for Everything",
    tagline: "Order on the outside helps clear thinking on the inside.",
    minutes: 10,
    status: "coming-soon",
  },
  {
    number: 10,
    slug: "dont-let-feelings-drive",
    title: "Don't Let Feelings Drive",
    tagline: "Feelings are real, but they make poor drivers.",
    minutes: 10,
    status: "coming-soon",
  },
  {
    number: 11,
    slug: "spot-the-trick",
    title: "Spot the Trick",
    tagline: "Loaded words, bent numbers, and arguments that cheat.",
    minutes: 10,
    status: "coming-soon",
  },
  {
    number: 12,
    slug: "think-like-jesus",
    title: "Think Like Jesus",
    tagline: "Truth with humility: putting the whole course together.",
    minutes: 10,
    status: "coming-soon",
  },
];

export function getModuleBySlug(slug: string): CourseModule | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getModuleByNumber(n: number): CourseModule | undefined {
  return MODULES.find((m) => m.number === n);
}

export const LIVE_MODULES = MODULES.filter((m) => m.status === "live");

/**
 * The final test draws its questions from across the course: the first
 * quiz question of each live module, in module order. When all twelve
 * modules are live, this yields the 12-question final test.
 */
export function finalTestQuestions(): { moduleTitle: string; question: QuizQuestion }[] {
  return LIVE_MODULES.filter((m) => m.quiz && m.quiz.length > 0).map((m) => ({
    moduleTitle: m.title,
    question: m.quiz![0],
  }));
}
