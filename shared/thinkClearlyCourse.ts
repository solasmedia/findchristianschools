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
      "Before you can think clearly about anything — a headline, a hard subject, a fight with a friend — you have to know how to ask about it. This first module is about the skill every other module stands on: asking better questions.",
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
          "Most wrong turns in thinking do not happen because people are unintelligent. They happen because people solve the first problem they see instead of the real one. Thirty seconds of asking beats thirty minutes of fixing the wrong problem.",
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
          "Neither kind is bad. Closed questions are fine for facts and times. But when something matters — a friendship, a decision, a claim somebody wants you to believe — open questions are the ones that get you somewhere true. Compare these:",
        ],
        examples: [
          {
            label: "Homework",
            closed: "Did you finish the assignment?",
            open: "What is your plan for finishing the assignment, and what part is hardest?",
          },
          {
            label: "A friendship",
            closed: "Are you mad at me?",
            open: "What happened this week that has been bothering you?",
          },
          {
            label: "A headline",
            closed: "Is this story true?",
            open: "What would I need to check before I believe this story?",
          },
        ],
      },
      {
        heading: "The Parking Lot",
        paragraphs: [
          "Here is a tool worth stealing for the rest of your life. When a question pops up that you cannot answer right now, do not drop it and do not let it derail you. Park it.",
          "Parking a question means writing it down — in a notebook, in your phone, on a sticky note — and deliberately coming back to it later. A parked question is not a dropped question. It is a question waiting for its turn.",
          "This one habit will help you everywhere: in class, when a lesson raises something you do not understand yet; in an argument, when a side issue tries to hijack the real one; and in your faith, when a hard question about God needs time and honesty instead of a rushed answer.",
        ],
        callout: {
          title: "Try it this week",
          text: "Start a parking lot page in a notebook or your notes app. Every time a real question shows up — about school, the news, your friends, your faith — write it down instead of letting it float away. Bring one parked question to a parent, teacher, or pastor this week.",
        },
      },
    ],
    drill: {
      title: "Turn statements into questions",
      intro:
        "A statement can feel like a dead end. A question opens a way forward. Practice by turning each statement below into an open question — then check the model answer and compare. Yours does not have to match; it has to be open.",
      items: [
        {
          statement: "“That teacher just doesn't like me.”",
          model:
            "What have I actually seen happen — and what else could explain it besides the teacher not liking me?",
        },
        {
          statement: "“I'm just bad at math.”",
          model:
            "Which part of math trips me up first, and who could help me with that exact part?",
        },
        {
          statement: "“That video proved everybody was lying.”",
          model:
            "What did the video actually show, what did it leave out, and who made it?",
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
          "Do you agree with her?",
        ],
        correct: 3,
        explanation:
          "Open questions cannot be answered yes or no — they invite real thought and honest answers.",
        timeLimit: 20,
      },
      {
        question: "A friend says, “The test was unfair.” What is the best follow-up question?",
        answers: [
          "Why do you always complain?",
          "What made it feel unfair to you?",
          "Did everyone fail it?",
          "Who wrote the test?",
        ],
        correct: 2,
        explanation:
          "“What made it feel unfair?” opens the real story instead of judging or settling for yes or no.",
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
    status: "coming-soon",
  },
  {
    number: 3,
    slug: "check-the-source",
    title: "Check the Source Before You Share It",
    tagline: "Who is telling you this — and why?",
    minutes: 10,
    status: "coming-soon",
  },
  {
    number: 4,
    slug: "claim-it-prove-it",
    title: "Claim It? Prove It",
    tagline: "Every claim needs evidence. Learn to ask for it.",
    minutes: 10,
    status: "coming-soon",
  },
  {
    number: 5,
    slug: "ask-why-five-times",
    title: "Ask Why Five Times",
    tagline: "Keep asking why until you reach the root of a problem.",
    minutes: 10,
    status: "coming-soon",
  },
  {
    number: 6,
    slug: "plan-try-check-fix",
    title: "Plan It, Try It, Check It, Fix It",
    tagline: "A simple loop for getting better at anything.",
    minutes: 10,
    status: "coming-soon",
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
