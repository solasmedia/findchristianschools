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
    tagline: "Sort your problems by what matters and what it takes.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/12797275/pexels-photo-12797275.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "A wall covered with sticky notes waiting to be sorted",
    },
    intro:
      "Not every problem deserves the same Saturday. Some matter a lot and take ten minutes to fix. Some would eat a whole weekend and change almost nothing. This module gives you a simple four-box sort for deciding what gets your energy first — and what can honestly wait, or be skipped on purpose.",
    sections: [
      {
        heading: "Jethro's advice to Moses",
        paragraphs: [
          "In Exodus 18, Moses was judging every dispute in Israel by himself, from morning until evening, while the line of people stretched out of sight. His father-in-law Jethro watched for one day and delivered a verdict that still stands: what you are doing is not good. You will wear yourself out — the work is too heavy for one person, in one long unsorted line.",
          "Jethro's fix was not 'work harder.' It was order: capable helpers for the smaller matters, the hardest cases brought to Moses, and everything in its proper place. The same work, sorted, suddenly became doable. Most overwhelmed weeks do not need more hours. They need a sort.",
        ],
        verse: {
          text: "What you are doing is not good. You and the people with you will certainly wear yourselves out, for the thing is too heavy for you. You are not able to do it alone.",
          reference: "Exodus 18:17–18 (ESV)",
        },
      },
      {
        heading: "Two honest questions",
        paragraphs: [
          "Every problem on your list gets two questions. First: how much does it matter? If it gets fixed, what changes — for your goal, your family, your team, your week? Some fixes change everything downstream. Some change nothing but the look of a drawer.",
          "Second: how hard is it? Count honestly in time, effort, and cost. Ten minutes or two weekends? A ladder or a phone call? Neither question is about how LOUD the problem is, or how long it has been nagging. Loud is not the same as important, and old is not the same as urgent.",
          "Two honest answers per problem. That is the whole machine. The four boxes below are just where the answers land.",
        ],
      },
      {
        heading: "The four boxes",
        paragraphs: [
          "Matters a lot, and not hard: DO FIRST. These are the quick wins that unlock everything else — fixing them now changes your whole week for minutes of work. Matters a lot, and hard: PLAN WELL. These deserve real time, a schedule, and broken-down steps — not a panicked Saturday, but a proper plan.",
          "Matters a little, and not hard: DO IF TIME. Filler tasks — fine in the gaps of a day, never allowed to eat the day. Matters a little, and hard: MAYBE SKIP. Deliberately letting these go is not laziness; it is honesty about a finite week. Your energy is a budget. Skipping on purpose is how the budget survives.",
        ],
        callout: {
          title: "The four boxes",
          text: "Do First — matters a lot, not hard. Plan Well — matters a lot, hard. Do If Time — matters a little, easy. Maybe Skip — matters a little, hard. Two questions, four boxes, one honest Saturday.",
        },
      },
      {
        heading: "Boxes move",
        paragraphs: [
          "The sort is not carved in stone. A slow tire leak sits quietly in Plan Well until the big ride is Saturday — then it jumps to Do First. A science fair three weeks out is Plan Well; three days out, its pieces become Do First, one at a time. Re-sort your list about once a week, or whenever a deadline moves.",
          "And remember Jethro's other half of the fix: some items on your list can be carried by someone else. A problem does not become yours just because you were the one who noticed it. Prepare your work in the right order, and the work gets done.",
        ],
        verse: {
          text: "Prepare your work outside; get everything ready for yourself in the field, and after that build your house.",
          reference: "Proverbs 24:27 (ESV)",
        },
      },
    ],
    drill: {
      title: "Sort the six",
      intro:
        "Six practical problems, one list. For each one, ask the two questions — how much does it matter, how hard is it — and name its box. Then compare with the model sort.",
      modelLabel: "The box",
      items: [
        {
          statement:
            "Your bike tire has a slow leak, and the big group ride is this Saturday.",
          model:
            "Do First. It matters a lot — no tire, no ride — and patching or swapping a tube is quick. This is a small fix guarding a big day.",
        },
        {
          statement:
            "The science fair is in three weeks. Your project needs a board, supplies, and two experiments run and recorded.",
          model:
            "Plan Well. It matters a lot and it is genuinely big. Break it into pieces — supplies this week, experiments next, board last — and give the pieces real slots on the calendar.",
        },
        {
          statement:
            "The team signup sheet is a paper list that keeps getting lost before games.",
          model:
            "Plan Well. It matters a lot — players and rides depend on it — and the real fix, one shared list with a keeper, takes a focused hour to set up, not two minutes. Plan it, build it once.",
        },
        {
          statement:
            "Your desk drawer is a tangle of pens, batteries, and cables.",
          model:
            "Do If Time. Sorting it is easy and mildly useful, but nothing about your week depends on it. A fine gap-filler — never a Saturday.",
        },
        {
          statement:
            "Repainting the garden fence a new color would take two full days. The fence is sturdy and looks fine as it is.",
          model:
            "Maybe Skip. Two days of hard work that changes almost nothing is the most expensive kind of task there is. Skip it on purpose and spend the weekend on a box that matters.",
        },
        {
          statement:
            "The hall closet where the sports gear lives has no hooks, so gear piles on the floor. Four hooks and fifteen minutes would fix it.",
          model:
            "Do First. Small effort, daily payoff — every practice day starts smoother. Matters more than it looks, costs less than it looks.",
        },
      ],
    },
    quiz: [
      {
        question: "What are the two questions that sort a problem into the four boxes?",
        answers: [
          "Who caused it, and who fixes it?",
          "How much does it matter, and how hard is it?",
          "Is it new, and is it fun?",
          "How loud is it, and who is watching?",
        ],
        correct: 2,
        explanation:
          "Mattering and difficulty — answered honestly — place every problem in its box.",
        timeLimit: 20,
      },
      {
        question: "A problem matters a lot and is not hard to fix. Which box?",
        answers: ["Plan Well", "Do First", "Maybe Skip", "Do If Time"],
        correct: 2,
        explanation:
          "Do First: high value, low cost. These quick wins unlock the rest of the week.",
        timeLimit: 20,
      },
      {
        question: "What did Jethro tell Moses about judging every dispute alone?",
        answers: [
          "He was doing it perfectly",
          "The people should be more patient",
          "The work was too heavy — he would wear out",
          "He should judge faster",
        ],
        correct: 3,
        explanation:
          "Exodus 18: the thing was too heavy for one man. Jethro's fix was order, not effort.",
        timeLimit: 20,
      },
      {
        question: "A problem matters little and would take all weekend. Best box?",
        answers: ["Do First", "Plan Well", "Do If Time", "Maybe Skip"],
        correct: 4,
        explanation:
          "Maybe Skip: heavy cost, tiny change. Skipping on purpose protects the week.",
        timeLimit: 20,
      },
      {
        question: "Why re-sort your problem list each week?",
        answers: [
          "The boxes change color over time",
          "Problems move boxes as deadlines and facts change",
          "Sorting is a chore you must repeat daily",
          "Each list must have exactly four items",
        ],
        correct: 2,
        explanation:
          "A leak is quiet until the ride is Saturday. Fresh facts and near deadlines move boxes.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 8,
    slug: "number-your-days",
    title: "Number Your Days",
    tagline: "See where your time goes — then spend tomorrow on purpose.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/12911169/pexels-photo-12911169.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "An open weekly planner on a desk with pens and sticky notes",
    },
    intro:
      "Ask a room of students where yesterday went and you will mostly get shrugs. Days feel long while you live them and vanish when you look back. This module is about seeing your time clearly — where it actually goes, in real hours — and then spending tomorrow on purpose instead of by accident.",
    sections: [
      {
        heading: "A prayer about counting",
        paragraphs: [
          "Psalm 90 is Moses' prayer, and in the middle of it sits a surprising request: teach us to number our days. Not to make them longer. Not to squeeze more into them. To number them — to count them like something precious and finite, the way you count money you cannot replace.",
          "Moses says the fruit of that counting is a heart of wisdom. It works like this: a student who knows the day holds exactly 24 hours — no more coming — starts asking what those hours are FOR. Time stops being weather that happens to you and becomes a budget you spend. And budgets can be planned.",
        ],
        verse: {
          text: "So teach us to number our days that we may get a heart of wisdom.",
          reference: "Psalm 90:12 (ESV)",
        },
      },
      {
        heading: "Where a day actually goes",
        paragraphs: [
          "Here is the honest math of a school day: about 8 hours sleeping, 7 at school, 2 eating and getting ready and traveling, which leaves roughly 7 hours that are actually yours to aim. Most students guess those 7 hours completely wrong — usually by forgetting the phone-shaped one. Games, scrolling, and videos commonly take 3 of the 7 without ever announcing themselves.",
          "The fix is not guilt. The fix is a log: for one ordinary day, write down what actually filled the hours, in rough blocks. Not spy-level detail — blocks. School, sleep, meals, practice, homework, family, screens, rest. Add them up and check they make 24. A log tells the truth that guesses never do, and you cannot plan what you have never seen.",
          "Notice what a log always protects: sleep is a real block, not whatever is left over. A numbered day defends the blocks that make the other blocks work.",
        ],
      },
      {
        heading: "Plan tomorrow tonight",
        paragraphs: [
          "Planning a day takes about five minutes the night before, and it is embarrassingly simple: give the big things a home first. Sleep, school, practice, family dinner — the fixed boulders go on the schedule before anything else moves. Then fit homework and projects into the free blocks with actual clock times, and let the smaller things fill what remains.",
          "A block written down — '4:30 to 5:00, science project' — behaves completely differently from a hope like 'sometime tomorrow.' The block has a door; the hope has a shrug. When the block's time arrives, starting is easier, because the decision was already made last night by a calmer version of you.",
          "That is the whole secret of people who 'find time': they do not find it. They assign it — making the best use of the time, on paper, before the day can spend itself.",
        ],
        verse: {
          text: "Making the best use of the time, because the days are evil.",
          reference: "Ephesians 5:16 (ESV)",
        },
      },
      {
        heading: "The kind swap",
        paragraphs: [
          "Once a log shows you the truth, change comes as a swap, not a sacrifice. Find one block that gives you very little — the third scroll session of the day rarely gives anything the first two didn't — and trade part of it for something that gives more: thirty minutes of practice, project work, or plain sleep.",
          "Swaps stay small and honest. Nobody is asking for a monastic schedule; the plan that survives is the one that still contains a life. One good swap a week, kept, will quietly buy back a hundred hours a year — and every hour bought back is an hour aimed on purpose.",
        ],
        callout: {
          title: "Try it this week",
          text: "Log tomorrow honestly — just the blocks. Add them up to 24. Then circle one swap: thirty minutes from a low-value block, given to something you actually want to grow. Make the swap once and see how it feels.",
        },
      },
    ],
    drill: {
      title: "Log a day, spot a swap",
      intro:
        "Meet Sam's Tuesday, already logged. Read the log carefully, answer each question in your head, then compare with the model read. Same numbers — the skill is in what you notice.",
      modelLabel: "The read",
      items: [
        {
          statement:
            "The log: school 7 hours, sleep 8, homework 1, soccer practice 1.5, meals and family 2, games and scrolling 3, getting ready and travel 1.5. Where did the day go?",
          model:
            "The blocks add to 24 — the day is fully spent, like every day. The surprise hiding in plain sight is the 3 hours of games and scrolling: more than homework and practice combined. Nothing to feel bad about — but now it is visible, and what is visible can be planned.",
        },
        {
          statement:
            "Find one swap that buys 30 minutes a day for the science project — without touching sleep, school, or practice.",
          model:
            "Take 30 minutes from the 3-hour games-and-scrolling block. Everything protected stays protected, the project gains a daily half hour — three and a half hours a week — and there are still 2.5 hours of games. A swap, not a sacrifice.",
        },
        {
          statement:
            "Now give tomorrow's science project a real home on the schedule. What exactly do you write down tonight?",
          model:
            "Write it as a block with a clock time: '4:30–5:00 — science project, before games.' A block on the schedule is a plan; 'sometime tomorrow' is a hope. Numbered days get planned in ink, not wishes.",
        },
      ],
    },
    quiz: [
      {
        question: "What does Psalm 90:12 ask God to teach us?",
        answers: [
          "To make the days feel longer",
          "To number our days, for a heart of wisdom",
          "To forget yesterday quickly",
          "To fill every minute with work",
        ],
        correct: 2,
        explanation:
          "Numbering our days — counting them as precious and finite — produces wisdom about time.",
        timeLimit: 20,
      },
      {
        question: "Why keep a one-day time log?",
        answers: [
          "To catch yourself being lazy",
          "To impress your teacher",
          "To see where hours actually go, not where you guess",
          "To fill the day completely",
        ],
        correct: 3,
        explanation:
          "Guesses about time are reliably wrong. A log shows the real blocks — and real blocks can be planned.",
        timeLimit: 20,
      },
      {
        question: "When planning tomorrow, what gets a place on the schedule first?",
        answers: [
          "Whatever is loudest",
          "The big things: sleep, school, practice, family",
          "Games and videos",
          "Nothing — plans should stay loose",
        ],
        correct: 2,
        explanation:
          "Boulders first: the fixed, important blocks get homes before the small things fill the gaps.",
        timeLimit: 20,
      },
      {
        question: "In this module, a 'swap' means…",
        answers: [
          "Doing two things at the same time",
          "Trading homework with a friend",
          "Skipping sleep for one night",
          "Trading a low-value block for something that gives more",
        ],
        correct: 4,
        explanation:
          "A swap trades part of a block that gives little for time that builds something — kindly and honestly.",
        timeLimit: 20,
      },
      {
        question: "Which plan is most likely to actually happen?",
        answers: [
          "'I will work on it sometime tomorrow'",
          "'4:30–5:00, science project' written down tonight",
          "'I will do it when I feel like it'",
          "'Someone will remind me, probably'",
        ],
        correct: 2,
        explanation:
          "A written block with a clock time is a decision already made. A hope is not a plan.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 9,
    slug: "a-place-for-everything",
    title: "A Place for Everything",
    tagline: "Organization is a thinking tool, not a personality trait.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/10567234/pexels-photo-10567234.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "A tidy desk with an open drawer, a folder, and a basket",
    },
    intro:
      "A messy space is not a character flaw. It is usually a missing system: things without homes wander. This module is about organization as a thinking tool — because a mind busy rummaging for its own gear has less left for the work itself.",
    sections: [
      {
        heading: "Joseph's warehouses",
        paragraphs: [
          "In Genesis 41, Pharaoh dreams of seven fat cows and seven thin ones, and Joseph explains: seven years of plenty are coming, then seven years of famine. Joseph's plan is, at heart, an organization plan: during the good years, gather the grain, store it city by city, counted and kept — so that when the famine years arrive, Egypt is ready instead of desperate.",
          "Notice that nothing about the plan is magical. It is bins, counts, and places, maintained for seven years. History remembers it as the reason a nation ate. Order, done quietly and early, is one of the strongest tools a thinker owns — and Scripture's instruction about how things should be done points the same way: decently, and in order.",
        ],
        verse: {
          text: "But all things should be done decently and in order.",
          reference: "1 Corinthians 14:40 (ESV)",
        },
      },
      {
        heading: "Why order helps you think",
        paragraphs: [
          "Every search costs something real: minutes, yes — but also attention, calm, and momentum. The student who burns ten minutes hunting for a charger, a folder, and a permission slip starts homework already drained, and the thinking suffers before the first problem is read.",
          "'A place for everything' does not mean a showroom. It means every thing you use regularly has ONE home that you can name without thinking — the way you can name where your shoes sleep. When a thing has no home, you become its home: your memory carries it, your eyes keep tripping over it, and your brain pays rent on it all day.",
          "A system you can trust pays that rent back. The two minutes saved here and there matter less than the quiet: everything in its place means your attention is free for questions, claims, roots, and loops — the real work of this course.",
        ],
      },
      {
        heading: "Build a system in four moves",
        paragraphs: [
          "Move one: dump and sort. Take ONE pile — a backpack, a desk, a gear bin — empty it completely, and group what comes out by the job it does: school, sports, tools, tech, papers. You cannot design a home for a pile you have not sorted.",
          "Move two: group by job, as you sort. Move three: give each group exactly one home, as close as possible to where it is used — hooks where the bag lands, the charger where the phone sleeps. Move four: label it like you mean it. A label sounds childish until a tired Tuesday arrives; labels are how a system survives tired Tuesdays.",
          "Four moves, one pile at a time. A whole room is a weekend project; a backpack is twenty minutes — and twenty honest minutes beats a grand plan that never starts.",
        ],
      },
      {
        heading: "Keep it alive",
        paragraphs: [
          "Systems do not usually die in a collapse; they erode at the edges. Two small habits keep one alive. First, the drop zone: one basket or tray near the door where new chaos is ALLOWED to land — emptied and sorted twice a week, so the edges have a border. Second, the two-minute reset: before dinner or bed, return five things to their homes. Two minutes of maintenance, daily, beats a heroic purge twice a year.",
          "And when a system fails, treat it like Module 6 taught you: check honestly, fix the step that broke, and loop. The system serves you. You do not serve the system.",
        ],
        callout: {
          title: "Try it this week",
          text: "Build one small system this week — the backpack, the desk, or the sports bag. Dump, sort, one home per group, label it. Take a before and after photo for yourself. The after photo is the proof your future self needs.",
        },
      },
    ],
    drill: {
      title: "Design the system: the backpack",
      intro:
        "One backpack, currently carrying: textbooks, gym shoes, a lunchbox, loose papers, a charger, a water bottle, and three pens of unknown status. Walk the four moves with it — decide each step, then compare with the model design.",
      modelLabel: "The design",
      items: [
        {
          statement:
            "Move one: what do you do first, before choosing pockets or buying anything?",
          model:
            "Dump and sort. Empty the whole bag and group by job: school books, gym gear, food, papers, tech. Three pens get tested on the spot — dead ones leave. You cannot design a home for a pile you have not sorted.",
        },
        {
          statement:
            "Now give each group exactly one home inside the same bag.",
          model:
            "Books in the large pocket, flat against your back. Papers in one folder in the middle pocket — the same folder that ended the vanishing-homework chain in Module 5. Gym shoes in the front pocket. Charger, coiled, in the small pocket. Water bottle in the side sleeve. Every group, one address.",
        },
        {
          statement:
            "A week later, the front pocket holds receipts, a broken pencil, and a mystery key. Is the system broken?",
          model:
            "No — it needs its maintenance: a two-minute reset. Front pocket goes back to gym gear only, the pencil leaves, and the key gets a real home or a question mark in the drop zone. Systems are kept, not just built.",
        },
      ],
    },
    quiz: [
      {
        question: "In Genesis 41, what did Joseph organize during the seven good years?",
        answers: [
          "A new calendar for Egypt",
          "Grain, stored city by city for the famine years",
          "Pharaoh's chariot fleet",
          "A building project in the capital",
        ],
        correct: 2,
        explanation:
          "Gathering and storing the grain during the plenty is what carried Egypt through the famine.",
        timeLimit: 20,
      },
      {
        question: "What does 'a place for everything' actually mean?",
        answers: [
          "A room that always looks perfect",
          "Owning less than ten things",
          "Every thing you use has one home you can name",
          "Labeling your bedroom door",
        ],
        correct: 3,
        explanation:
          "One home per thing, namable without thinking. The point is a trustworthy system, not a showroom.",
        timeLimit: 20,
      },
      {
        question: "What is the FIRST move when building a system for a pile?",
        answers: [
          "Buy matching containers",
          "Throw most of it away",
          "Ask a friend to sort it",
          "Dump it out and sort it into groups",
        ],
        correct: 4,
        explanation:
          "Dump and sort first. Homes get designed for groups you can actually see.",
        timeLimit: 20,
      },
      {
        question: "Why do labels matter in a simple system?",
        answers: [
          "They help the system survive a tired day",
          "They make the system look official",
          "They are required by parents",
          "They stop things from getting lost forever",
        ],
        correct: 1,
        explanation:
          "On a tired Tuesday, a label carries the decision so your memory doesn't have to.",
        timeLimit: 20,
      },
      {
        question: "Your system gets messy again after two weeks. Best response?",
        answers: [
          "Give up — systems don't work for you",
          "A two-minute reset — systems are kept, not just built",
          "Buy a bigger backpack",
          "Wait for the yearly cleanup",
        ],
        correct: 2,
        explanation:
          "Erosion at the edges is normal. Small maintenance is the fix — check, adjust, keep going.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 10,
    slug: "dont-let-feelings-drive",
    title: "Don't Let Feelings Drive",
    tagline: "Feelings are information, not instructions.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/13369418/pexels-photo-13369418.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "A student sitting with her phone, taking a moment",
    },
    intro:
      "Feelings are real, and they are useful — like the warning lights on a dashboard. But a dashboard light has never driven a car anywhere worth going. This module is about the pause between feeling something strongly and doing something quickly — because headlines, apps, and ads are all built to close that gap.",
    sections: [
      {
        heading: "Hold it back",
        paragraphs: [
          "Proverbs draws the contrast in one line: the fool gives full vent to his spirit — everything he feels comes straight out, at full volume, at full speed — but the wise man quietly holds it back. Read it carefully: the wise man HAS a spirit, has feelings, has reactions. He just holds them long enough for thought to arrive before they drive.",
          "That is the whole module in one sentence. Feelings are not the enemy. Speed is. A reaction that waits ten seconds for a clear head is the same feeling, with a driver.",
        ],
        verse: {
          text: "A fool gives full vent to his spirit, but a wise man quietly holds it back.",
          reference: "Proverbs 29:11 (ESV)",
        },
      },
      {
        heading: "Information, not instructions",
        paragraphs: [
          "Treat a strong feeling the way you would treat a dashboard light: it reports something; it does not steer. A surge of excitement during a product video is information — this was DESIGNED to excite me — not an instruction that says buy it now. A jolt of alarm at a headline is information — look closer — not proof the story happened exactly as the headline screamed.",
          "Even the spike of outrage at a referee's call is information: the stakes feel high, and your view from the bench may be missing an angle. The feeling did its reporting job in half a second. What happens next belongs to the rest of you: questions, sources, evidence — the tools you already own.",
          "Feelings report. Reason decides. Actions follow the decision, not the spike.",
        ],
      },
      {
        heading: "Built to make you react",
        paragraphs: [
          "It helps to know that the pressure you feel is manufactured. Apps and headlines earn their keep from speed: your tap before you think, your share before you check, your purchase before the pause. That is why the words of urgency never sleep — act now, last chance, everyone is buying, you will not believe number four.",
          "Urgency is a design choice, and noticing the design is half the defense. When a post makes your thumb move faster than your brain, that is not your personality failing. That is a machine working as built — and a machine can be declined.",
          "Sports give the cleanest picture of all: a call that looks outrageous in the last minute looks different on the replay an hour later. Both views were of the same play. The difference was time. The pause is where your replay lives.",
        ],
      },
      {
        heading: "The pause routine",
        paragraphs: [
          "When the spike hits, run four steps. STOP: hands off the screen, the button, the send key. BREATHE: one slow breath out — ten seconds is plenty, and it is remarkable what ten seconds does. CHECK: run the tools you know — who is the source (Module 3), what exactly is the claim and its proof (Module 4)? CHOOSE: now act — share it, buy it, answer it, or skip it — on purpose.",
          "Practice the routine on small things, when nothing is at stake: an exciting video, a surprising post, a call in a game you are watching. A routine practiced at low stakes is the one that shows up at high stakes. Nobody rises to the occasion; they fall back on their practice.",
        ],
        callout: {
          title: "Try it this week",
          text: "Once a day, catch one spike — an exciting video, a shocking headline, a tempting offer — and run the full routine out loud: stop, breathe, check, choose. Four steps, ten seconds. Notice how often the choice changes after the check.",
        },
      },
    ],
    drill: {
      title: "Run the pause",
      intro:
        "Three everyday spikes. For each one, walk the routine — stop, breathe, check, choose — and decide what the checked version of you would do. Then compare with the model.",
      modelLabel: "The pause, run",
      items: [
        {
          statement:
            "A post screams: 'BREAKING — your favorite game is being banned next week!' Your thumb is already moving toward share.",
          model:
            "Stop. Breathe. Check: who posted this — the game's own site, or an unnamed page? Search the claim in one other place. Ninety seconds later you will know whether you are sharing news or sharing a hook.",
        },
        {
          statement:
            "A video shows a gadget and repeats, 'Only a few left — link below!' Your savings jar suddenly seems very interesting.",
          model:
            "Stop. Breathe. Check: is 'a few left' a fact, or a claim in a costume (Module 4)? Choose with the jar in mind: let it sit 24 hours. A good buy tomorrow is still a good buy. A pressured buy usually is not.",
        },
        {
          statement:
            "The referee calls a foul on your teammate in the last minute, and half the bench is on its feet.",
          model:
            "Stop. Breathe. Check: what did you actually see, and what might your angle have hidden? Choose: play the next minute as well as you can. The call will not change. Your next play can. Feelings reported the stakes — they do not get the whistle.",
        },
      ],
    },
    quiz: [
      {
        question: "How does Proverbs 29:11 contrast the fool and the wise man?",
        answers: [
          "The wise man never feels anything",
          "The wise man quietly holds it back",
          "The fool thinks before speaking",
          "The wise man vents the loudest",
        ],
        correct: 2,
        explanation:
          "The wise man has feelings — he holds them long enough for thought to arrive before acting.",
        timeLimit: 20,
      },
      {
        question: "In this module, strong feelings are best treated as…",
        answers: [
          "Orders that must be obeyed at once",
          "Signs that something is wrong with you",
          "Information to notice, not instructions to obey",
          "Things to hide from everyone",
        ],
        correct: 3,
        explanation:
          "Feelings report, like dashboard lights. Reason decides what the report means.",
        timeLimit: 20,
      },
      {
        question: "Why are headlines and apps built to make you react fast?",
        answers: [
          "Speed makes the news more accurate",
          "Fast reactions earn their makers taps, shares, and sales",
          "Slow readers complained",
          "Urgency is required by law",
        ],
        correct: 2,
        explanation:
          "Urgency is a design. Noticing the design is half the defense against it.",
        timeLimit: 20,
      },
      {
        question: "What are the four steps of the pause routine?",
        answers: [
          "React, post, argue, apologize",
          "Stop, breathe, check, then choose",
          "Count, shout, run, hide",
          "See it, want it, buy it, post it",
        ],
        correct: 2,
        explanation:
          "Stop, breathe, check, choose — ten seconds between the spike and the action.",
        timeLimit: 20,
      },
      {
        question: "A post says 'Act now — almost gone!' about a jacket. Wisest move?",
        answers: [
          "Buy it before someone else does",
          "Share it so friends can buy too",
          "Pause, check the claim, decide with a cool head",
          "Argue with the seller in the comments",
        ],
        correct: 3,
        explanation:
          "Run the pause. A good buy tomorrow is still a good buy; pressure is not evidence.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 11,
    slug: "spot-the-trick",
    title: "Spot the Trick",
    tagline: "Crooked arguments and bent numbers, named and disarmed.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/590014/pexels-photo-590014.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "A printed bar chart on paper, examined closely with a pen",
    },
    intro:
      "Some arguments try to win honestly, with evidence. Others try to win quickly, with tricks. This module names three of the most common — the straw man, the cherry-picked number, and the either/or squeeze — so you can spot them in ads, posts, and debates before they carry you off.",
    sections: [
      {
        heading: "Seems right — until examined",
        paragraphs: [
          "Proverbs saw it coming thousands of years before the internet: the first person to state a case sounds completely right — until somebody else arrives and examines him. Every trick in this module depends on the same hope: that you will never be the one who examines.",
          "Tricks are not always told by villains. They are the standard equipment of ads, arguments, and posts, because they work fast and examining takes a minute. Your defense is not suspicion. It is a short list of names. A trick you can name is a trick that has lost most of its power.",
        ],
        verse: {
          text: "The one who states his case first seems right, until the other comes and examines him.",
          reference: "Proverbs 18:17 (ESV)",
        },
      },
      {
        heading: "Trick one: the straw man",
        paragraphs: [
          "A straw man argument attacks something nobody actually said. Somebody proposes changing one rule about hats in the cafeteria, and the reply comes back: 'So you think school should have NO rules at all?' Nobody said that. But the invented version is soft, silly, and easy to knock flat — like a man made of straw, built to fall.",
          "Watch for the tell: the reply is much more extreme than the claim it answers. The defense is calm and short: 'That is not the claim. The claim is one rule, changed.' Name the real claim, return to it, and let the straw man fall on its own.",
        ],
      },
      {
        heading: "Trick two: cherry-picked numbers",
        paragraphs: [
          "Cherries are sweet — and a number picked the way you pick cherries, choosing only the prettiest, can be perfectly true and perfectly misleading at once. 'Sales doubled this year!' From one box to two: true, and not the story. 'Winners of 4 of the last 5!' — spoken by a team whose full season quietly says something else.",
          "The boldest version lives in charts. Draw a chart whose scale starts at 85, and a score of 92 towers over a score of 90 like a skyscraper over a house. The numbers are real. The picture is bent. The defense is one question: may I see the whole orchard — the full chart, the full season, the real starting point?",
        ],
      },
      {
        heading: "Trick three: the either/or squeeze",
        paragraphs: [
          "'You are either with us or against us.' 'Buy the premium version, or settle for junk.' Two doors get painted on the wall, and every other door in the building quietly disappears. That is the either/or squeeze: a menu of two, served as if it were the whole restaurant.",
          "Reality usually holds more doors: with you on this AND unsure about that; the standard version; a different brand entirely; waiting a month. The defense is one question, asked pleasantly: 'What are the other options?' You will be amazed how often the third door was standing there the whole time — and how often the squeeze collapses the moment you ask.",
        ],
        callout: {
          title: "Try it this week",
          text: "Spot one trick in the wild this week — in an ad, a post, a chart, or a debate — and name it out loud: straw man, cherry-picked, or either/or. Naming it is the skill. Keep a tally; the orchard is bigger than you think.",
        },
      },
    ],
    drill: {
      title: "Name the trick",
      intro:
        "Three short claims, three tricks. Read each one, name the trick, and say why it bends the truth. Then compare with the model answers.",
      modelLabel: "The trick",
      items: [
        {
          statement:
            "An ad announces: 'Our juice has 50% less sugar than the leading cola!' The juice is being compared with a cola — not with other juices.",
          model:
            "Cherry-picked comparison. The number may be true, but the partner was chosen to flatter it. Ask for the fair comparison: how does this juice stack up against other juices?",
        },
        {
          statement:
            "A chart shows Team A's bar towering over Team B's — but the chart's scale starts at 85 points, and the real scores are 92 and 90.",
          model:
            "The cut-off axis trick. A two-point gap became a 'landslide' by hiding the bottom of the chart. Ask for the full scale, starting at zero, and watch the mountain shrink to a step.",
        },
        {
          statement:
            "In a debate, one student says: 'My opponent wants our school to have no rules at all!' The opponent had proposed changing one rule about hats.",
          model:
            "Straw man. A small, specific proposal got rebuilt into an extreme one that is easy to attack. Name the real claim — one rule, changed — and argue about that instead.",
        },
      ],
    },
    quiz: [
      {
        question: "What is a straw man argument?",
        answers: [
          "An argument made of facts",
          "Attacking a fake, weaker version of someone's claim",
          "A debate held outdoors",
          "Agreeing with the other side",
        ],
        correct: 2,
        explanation:
          "The straw man replaces the real claim with an extreme invention — then knocks the invention down.",
        timeLimit: 20,
      },
      {
        question: "A chart starts its scale at 85, making 92 vs 90 look huge. What is the trick?",
        answers: [
          "A cut-off axis — the chart's bottom is hidden",
          "The numbers must be invented",
          "Charts are always honest",
          "The colors are doing it",
        ],
        correct: 1,
        explanation:
          "Real numbers, bent picture. Ask for the full scale starting at zero.",
        timeLimit: 20,
      },
      {
        question: "Proverbs 18:17 says the first case seems right until what happens?",
        answers: [
          "It gets the most likes",
          "The week ends",
          "The other side comes and examines it",
          "Someone famous repeats it",
        ],
        correct: 3,
        explanation:
          "Examining is the moment tricks fear. Be the one who examines.",
        timeLimit: 20,
      },
      {
        question: "'You are either on our side or against us.' Which trick is this?",
        answers: [
          "The straw man",
          "A cherry-picked number",
          "The either/or squeeze — hiding the other options",
          "No trick at all",
        ],
        correct: 3,
        explanation:
          "Two doors painted on the wall. The defense is asking what the other options are.",
        timeLimit: 20,
      },
      {
        question: "What is the best defense when a number feels cherry-picked?",
        answers: [
          "Believe it if it is repeated often",
          "Ask for the whole picture: full chart, full record",
          "Pick a bigger number back",
          "Ignore all numbers forever",
        ],
        correct: 2,
        explanation:
          "The whole orchard beats the picked cherries: full charts, full seasons, real starting points.",
        timeLimit: 20,
      },
    ],
  },

  {
    number: 12,
    slug: "think-like-jesus",
    title: "Think Like Jesus",
    tagline: "Truth with humility: the whole toolbox, used the way he used it.",
    minutes: 10,
    status: "live",
    image: {
      src: "https://images.pexels.com/photos/19895774/pexels-photo-19895774.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Students working together around a project table",
    },
    intro:
      "Twelve modules, one aim: to think the way Jesus thought — carefully, fairly, and humbly, with truth in one hand and kindness in the other. This last module pulls the whole toolbox together on one real job, the way you will actually use it.",
    sections: [
      {
        heading: "Check yourself first",
        paragraphs: [
          "Jesus warned about the comedy of a man with a log in his own eye offering to remove a speck from his brother's. The point is not 'never judge' — in John 7 he commands right judgment. The point is order: first take the log out of your own eye, and THEN you will see clearly to help with the speck.",
          "For a thinker, that order is everything. Before you grade someone else's claim, run your own beliefs through the same tests you have been practicing: Would I accept this evidence from the other side? Did I check MY source? Is there a log — a wish, a habit, a headline I swallowed whole — sitting in my own eye? Humility is not weakness in thinking. It is accuracy about the thinker.",
        ],
        verse: {
          text: "First take the log out of your own eye, and then you will see clearly to take the speck out of your brother's eye.",
          reference: "Matthew 7:5 (ESV)",
        },
      },
      {
        heading: "The whole toolbox, together",
        paragraphs: [
          "Look at what you are carrying now. Ask better questions, and park the rest for later (Module 1). Sort every statement: fact, opinion, or needs checking (Module 2). Check the source before you share — who, what do they want, where else (Module 3). Spot the claim and ask for its evidence; together is not because (Module 4).",
          "When a problem keeps coming back, ask why five times until the root shows (Module 5). Improve anything with the loop: plan it, try it, check it, fix it (Module 6). Sort work by what matters and what it takes (Module 7). Number your days and plan tomorrow on purpose (Module 8).",
          "Give everything a home you can trust (Module 9). When the spike hits, stop, breathe, check, choose (Module 10). And name the trick when an argument bends — straw man, cherry-picked, either/or (Module 11). Eleven tools. They were never eleven separate subjects; they are one way of paying attention.",
        ],
      },
      {
        heading: "The case: fix the fun-run",
        paragraphs: [
          "Put it all to work. Your school's fun-run needs fixing: last year the paper signup list was lost twice, 30 runners never got shirts, and a rumor about the date chased families for a week. The organizing team — students, like you — starts the way this course starts: with questions. What exactly went wrong last year? Who kept the list? What did runners actually need?",
          "Then they dig. Why was the list lost? Paper. Why did one loss matter so much? No copy existed anywhere. Why not? One person held it, alone, in a bag. The root is not 'be more careful' — it is a missing system. The fix: one shared signup list with a keeper, a photo backup, and a home base at the club table (Modules 5 and 9).",
          "A claim arrives to be tested: 'Nobody signed up last year because the run was boring.' The team sorts it (Module 2): the count says 84 runners signed up — not nobody — and 'boring' is an opinion worth hearing properly, through three short questions on the signup form, instead of a verdict worth printing (Modules 3 and 4). The date rumor gets checked at the source — the school office — before anyone repeats it (Modules 3 and 10).",
        ],
      },
      {
        heading: "Running the job, and the point of it all",
        paragraphs: [
          "The task list gets the four boxes (Module 7): the route permit and shirt order are Plan Well; water stations become Do First once the route is set; poster polish is Do If Time; a drone video is Maybe Skip. Jobs get time blocks across four weeks (Module 8), and the signup gets a trial run: one lunch period at one table, checked honestly, fixed, then launched to the whole school (Module 6). Eighty-four runners become a hundred and ten, every one of them with a shirt that fits.",
          "That is what thinking clearly is FOR. Not winning arguments — a fun-run is not an argument. It is for loving people well with a prepared mind: runners get a day that works because somebody asked, checked, dug, sorted, planned, and paused. Jesus asked questions that stopped crowds, saw through traps set for him, and always knew which thing mattered first. Think like that, and you will be useful everywhere you go.",
        ],
        callout: {
          title: "You are ready for the final test",
          text: "Complete all 12 modules and the final test unlocks: one question from every module, and a printable certificate with your name on it. The certificate is paper. The toolbox is the real graduation.",
        },
      },
    ],
    drill: {
      title: "Run the whole toolbox: the fun-run fix",
      intro:
        "The case from the lesson, step by step. For each step, name the tools the team is using before you open the model answer. Most steps use more than one.",
      modelLabel: "The toolbox at work",
      items: [
        {
          statement:
            "Step 1: Last year's signup list was lost twice and 30 runners missed their shirts. The team refuses to just 'try harder.' Where do they start?",
          model:
            "With questions and digging (Modules 1 and 5). Why was the list lost: paper. Why did it matter: no copy. Why not: one keeper, no system. The root fix is a system (Module 9) — one shared list, a photo backup, one named keeper — not a sterner warning about carefulness.",
        },
        {
          statement:
            "Step 2: A parent says, 'Nobody came last year because the run was boring.' How does the team handle the claim?",
          model:
            "Sort it (Module 2): 'nobody came' is a checkable claim — the count was 84, so not nobody. 'Boring' is an opinion: worth hearing, not printing as fact. The team asks for evidence and better information (Modules 3 and 4) — three short questions on this year's signup form.",
        },
        {
          statement:
            "Step 3: The job list is long — route permit, shirts, water stations, posters, rain plan, music, medals — and the run is in four weeks. How does the team run it?",
          model:
            "First things first (Module 7): permit and shirts are Plan Well; water stations, Do First once the route is set; poster polish, Do If Time. Jobs get dated blocks (Module 8), and the signup is trialled at one lunch table, checked, and fixed before launch (Module 6) — one calm month instead of one chaotic week.",
        },
      ],
    },
    quiz: [
      {
        question: "In Matthew 7, what does Jesus say to remove from your own eye first?",
        answers: [
          "The speck",
          "The log in your own eye",
          "Your glasses",
          "Nothing at all",
        ],
        correct: 2,
        explanation:
          "Log first, speck second: check yourself with the same tests before checking others.",
        timeLimit: 20,
      },
      {
        question: "A claim about your project sounds off. What is the toolbox's first move?",
        answers: [
          "Ask questions and sort fact from opinion",
          "Repeat the claim more loudly",
          "Wait for someone else to fix it",
          "Decide by how it feels",
        ],
        correct: 1,
        explanation:
          "Questions first (Module 1), sorting second (Module 2) — the toolbox opens in order.",
        timeLimit: 20,
      },
      {
        question: "Which module's tool fixes a problem that keeps coming back?",
        answers: [
          "Number Your Days",
          "Spot the Trick",
          "Ask Why Five Times — dig to the root",
          "A Place for Everything",
        ],
        correct: 3,
        explanation:
          "Recurring problems have roots. Ask why until you reach the cause you can fix once.",
        timeLimit: 20,
      },
      {
        question: "The fun-run team trials signups at one lunch table first. Which tool is that?",
        answers: [
          "The pause routine",
          "The loop: plan, try small, check, fix",
          "The cherry-pick check",
          "The four boxes",
        ],
        correct: 2,
        explanation:
          "Plan it, try it small, check honestly, fix it — then launch. The loop, doing its work.",
        timeLimit: 20,
      },
      {
        question: "Thinking like Jesus, in this course, means…",
        answers: [
          "Winning every argument",
          "Never questioning anything",
          "Truth with humility — fair, careful, and kind",
          "Memorizing the most verses",
        ],
        correct: 3,
        explanation:
          "Right judgment with a checked heart: accurate about claims, humble about yourself, kind to people.",
        timeLimit: 20,
      },
    ],
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
