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
    intro: "Before you can think clearly about anything — a headline, a project, a decision with real consequences — you have to know how to ask about it, because the quality of an answer can never rise above the quality of the question that produced it. This first module is about the skill every other module stands on: learning to ask questions that open a subject up instead of shutting it down.",
    sections: [
      {
        heading: "The teacher who asked questions",
        paragraphs: [
          "Here is something easy to overlook when you read the Gospels: Jesus asked questions constantly — hundreds of them, recorded across the four accounts — and he asked far more questions than he ever answered directly, even though no answer was hidden from him.",
          "He turned to his followers and asked, “Who do you say I am?” — a question designed to make them think rather than repeat what others had said. And in Mark 10, when a blind man named Bartimaeus cried out for healing, his need could hardly have been more obvious, yet Jesus still stopped and asked him a question before doing anything else.",
          "If Jesus asked questions when he already knew every answer, then asking is not a confession of weakness or a waste of time. It is how careful thinkers begin. A good question is not a delay placed in front of the real work; it is the doorway the real work walks through.",
        ],
        verse: {
          text: "And Jesus said to him, “What do you want me to do for you?”",
          reference: "Mark 10:51 (ESV)",
        },
      },
      {
        heading: "A brake and a steering wheel",
        paragraphs: [
          "A well-aimed question does two jobs at once. It works as a brake, slowing you down before you react, repeat, or rush in on impulse. And it works as a steering wheel, pointing your attention toward the part of the situation that actually matters instead of the part that merely shouts the loudest.",
          "Most wrong turns in thinking have surprisingly little to do with intelligence. They happen because people pour their energy into solving the first problem they notice instead of the real problem underneath it. Thirty seconds of honest asking will beat thirty minutes of confidently repairing the wrong thing, every single time.",
          "So before you answer, argue, share, or decide, brake first and interrogate the situation. What is really going on here? What do I actually know, and how do I know it? What am I assuming without noticing? The answers to those three questions will quietly reorganize everything you do next.",
        ],
        verse: {
          text: "Know this, my beloved brothers: let every person be quick to hear, slow to speak, slow to anger.",
          reference: "James 1:19 (ESV)",
        },
      },
      {
        heading: "Closed questions get yes or no. Open questions get truth.",
        paragraphs: [
          "A closed question can be answered with yes, no, or a single word, and once it is answered, the conversation is over. An open question begins with what, how, or why; it cannot be answered without genuine thought, and it invites the truth out into the open where you can examine it.",
          "Neither kind is a mistake. Closed questions serve perfectly well for facts, times, and quick confirmations. But when something genuinely matters — a project that is failing, a purchase that will cost you, a claim somebody is pressing you to believe — open questions are the ones that carry you somewhere true. Compare the difference:",
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
          "Here is a tool worth keeping for the rest of your life. When a question surfaces that you cannot answer on the spot, you have three options, and two of them are bad: you can drop it entirely, or you can let it derail whatever you were supposed to be doing. The third option is to park it.",
          "Parking a question means writing it down — in a notebook, in a notes app, on a sticky note stuck where you will see it — and deliberately returning to it later, when you have the time and information it deserves. A parked question is not a dropped question. It is a question waiting for its turn instead of being lost.",
          "This single habit pays off everywhere. In class, when a lesson raises something you do not yet understand and the teacher has already moved on. On a group project, when an interesting side topic threatens to pull the whole team away from the main job. And in your faith, when a hard question about God deserves time, honesty, and a real conversation instead of a rushed answer invented under pressure.",
        ],
        callout: {
          title: "Try it this week",
          text: "Start a parking lot page in a notebook or your notes app this week. Every time a genuine question surfaces — about school, the news, a project, or your faith — write it down in full instead of letting it drift away unanswered. Then choose one parked question and carry it to a parent, teacher, or pastor, and notice how much better the conversation goes when the question arrives written and thought through.",
        },
      },
    ],
    drill: {
      title: "Turn statements into questions",
      intro: "A statement can feel like a dead end; a question opens a way forward. Each statement below arrives with a complication, so one question is not enough. Practice two moves: ask the open question that starts the digging, then the follow-up question that settles what actually gets done. Compare with the model pair — yours does not have to match, but both of your questions have to be open.",
      items: [
        {
          statement: "“My science project is due on Friday, and I have not chosen a topic yet.”",
          model: "First question: “What topic interests me enough that I could test something real about it in three days?” Follow-up, once a topic is chosen: “What is the smallest version of this project I can finish well by Friday, and what is my first step tonight?” The first question opens the subject; the second turns the answer into a plan.",
        },
        {
          statement: "“I am saving for a new bike, but my brother's birthday comes first this month.”",
          model: "First question: “What does the bike cost in total, and how much can I realistically set aside each week?” Follow-up: “How do I cover the birthday gift without quietly abandoning the bike goal — a smaller gift, an earned extra, or a one-month pause with a restart date?” Good follow-ups protect the plan from real life instead of pretending real life will not happen.",
        },
        {
          statement: "“We won the game by a single point, and coach says we were lucky.”",
          model: "First question: “Which plays actually decided the game, and which of them can we repeat on purpose?” Follow-up: “What nearly cost us the game in the final minutes, and what will we drill this week so it does not?” Winning hides weaknesses; the follow-up question goes looking for them while there is still time to fix them.",
        },
      ],
    },
    quiz: [
      {
        question: "Nia's group poster is due tomorrow, half is blank, and nobody will say why. Best first question?",
        answers: ["Whose fault is the blank half of the poster?", "Did everyone forget the deadline was tomorrow?", "What is still missing, and what blocked it?", "Should we ask the teacher for more time?"],
        correct: 3,
        explanation: "“What is still missing, and what blocked it?” is open: it names the gap and hunts the cause in a single move. Blame and yes-or-no questions end conversations instead of starting them.",
        timeLimit: 20,
      },
      {
        question: "A headline claims a new study 'proves' something surprising. Which question digs deepest?",
        answers: ["How many people have shared this headline?", "What did the study actually measure, and how?", "Do the scientists sound confident about it?", "Is this the first study I have seen today?"],
        correct: 2,
        explanation: "Asking what was measured, and by what method, goes straight to the evidence. Shares, confidence, and timing describe the crowd and the headline — not whether the claim is true.",
        timeLimit: 20,
      },
      {
        question: "During a team meeting, a side question keeps pulling everyone off the main problem. Best move?",
        answers: ["Drop the side question and never raise it", "Stop the meeting and debate it right now", "Answer it quickly, even if the answer is a guess", "Park it in writing and return to it after"],
        correct: 4,
        explanation: "Parking protects both jobs: the main problem keeps the meeting, and the side question survives in writing instead of derailing the team or quietly disappearing.",
        timeLimit: 20,
      },
      {
        question: "Leo asks, “Did the training help your time?” That question is weak mainly because it…",
        answers: ["can be fully answered with one word: yes", "is too difficult for a coach to answer", "mentions training instead of the race", "should always begin with the word why"],
        correct: 1,
        explanation: "A yes-or-no question closes the door it opens. “How did the training change your time, and where did it help most?” would force real information into the open.",
        timeLimit: 20,
      },
      {
        question: "Before buying a used bike, which question set does the most work for the buyer?",
        answers: ["Is it a color you like, and is it fast on hills?", "Can I pay today, and is the price final?", "Why are you selling it, and what has been repaired?", "Did you enjoy riding it, and for how long?"],
        correct: 3,
        explanation: "The seller's reason for selling and the bike's repair history are where hidden problems live. Color, speed, and nostalgia cannot tell you whether the bike is sound.",
        timeLimit: 30,
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
    intro: "Every day, statements fly at you from every direction — videos, friends, packaging, headlines, and your own feed. Some of them can be proven. Some are simply what somebody prefers. And some sound perfectly solid while resting on nothing that has ever been checked. This module teaches you to sort statements into those three kinds before they settle into your head and start behaving like truth.",
    sections: [
      {
        heading: "The Bereans checked it out",
        paragraphs: [
          "In Acts 17, the apostle Paul taught in the city of Berea, and the Bereans listened eagerly — and then they did something the Bible pointedly calls noble: they examined the Scriptures daily to see whether what Paul said was actually true.",
          "Notice what they refused to do. They did not accept the teaching merely because an apostle delivered it, and they did not reject it merely because it sounded unfamiliar. They compared it against what they could already trust. Checking was not a failure of faith; it was faith taking its responsibility seriously.",
          "That is the habit this entire course is built to produce, and it begins with one simple sort. Almost everything you hear belongs to one of three kinds: a fact, an opinion, or a claim that has not yet earned either label and still needs checking.",
        ],
        verse: {
          text: "Now these Jews were more noble than those in Thessalonica; they received the word with all eagerness, examining the Scriptures daily to see if these things were so.",
          reference: "Acts 17:11 (ESV)",
        },
      },
      {
        heading: "Three kinds of statements",
        paragraphs: [
          "A fact is a statement that can be checked and shown to be true: it can be measured, counted, timed, or looked up in a reliable record. 'The game ended 24 to 17.' 'This rope is three meters long.' Facts hold their position regardless of how anyone feels about them, which is exactly what makes them facts.",
          "An opinion is what somebody judges or prefers: 'That was the best game of the year,' or 'Blue is the best color for a bike.' Opinions are not worthless — they reveal what a person values, and they can be argued well or badly — but they can never be proven the way a score can, and they should never be passed off as measurements.",
          "Then there is everything between: statements that sound like facts but arrive carrying no proof at all. 'Most people agree…' 'Scientists say…' 'This glue holds up to 100 pounds.' Some of these are true and some are not, and from the outside they look identical. Until they are checked, they belong in the third box: needs checking.",
        ],
        verse: {
          text: "The simple believes everything, but the prudent gives thought to his steps.",
          reference: "Proverbs 14:15 (ESV)",
        },
      },
      {
        heading: "Clue words",
        paragraphs: [
          "Statements often carry their own labels, if you know what to listen for. Measuring words — weighs, scored, counted, timed, at 3:00 exactly — usually signal a fact, because they point at something you could go and verify for yourself.",
          "Judging words — best, worst, amazing, boring, should, ought to — usually signal an opinion, because they are grading something rather than measuring it. And foggy words — everyone, most people, studies show, they say — usually signal the third box. Who exactly is 'everyone'? Which studies, and did they say that? Fog is not an answer; it is a signal to slow down and check.",
          "A single statement can smuggle all three kinds past you at once: 'Our team won 3–1' (a fact), 'so we are clearly the best team in the league' (an opinion), 'and everyone knows it' (fog). A clear thinker takes a sentence apart piece by piece and sorts each piece on its own merits, instead of letting the strongest piece carry the weakest.",
        ],
      },
      {
        heading: "The ten-second sort",
        paragraphs: [
          "So here is the habit: when a statement lands, give it ten seconds before you believe it, repeat it, or act on it. Silently tag it — fact, opinion, or needs checking. That tiny pause is the whole skill, and it works identically everywhere: in class, in a store, in a group chat, under a headline.",
          "You will be surprised how much of what parades as knowledge turns out to be opinion wearing a fact costume, or fog wearing a confident voice. Sorting does not train you to doubt everything. It trains you to be sure about the right things, for reasons you can name.",
        ],
        callout: {
          title: "Try it this week",
          text: "Pick one video, article, or conversation each day this week and sort three of its statements: fact, opinion, or needs checking. Write the tags in a notebook with one line on why each statement landed where it did. By the end of the week, notice which box fills fastest — it tells you what kind of talk surrounds you, and how much of it has actually been proven.",
        },
      },
    ],
    drill: {
      title: "Sort the statement",
      intro: "Each statement below mixes kinds on purpose. Do two jobs: sort it, and name the exact check — or the exact missing piece — that decides it. Then open the model answer and compare the reasoning, because the reasoning is the skill, not the label.",
      items: [
        {
          statement: "“Our school collected 412 cans last month, so our drive was the best in the county.”",
          model: "Two pieces, two boxes. '412 cans' is a fact: countable, and the collection record settles it. 'Best in the county' still needs checking: best by what measure, and what did the other schools collect? A claim standing beside a true number does not become a measurement itself.",
        },
        {
          statement: "“This trail mix has 30% more protein!”",
          model: "Needs checking, and the missing piece is the comparison. Thirty percent more than what — the old recipe, a rival brand, a handful of peanuts? And protein per what amount — per serving, or per bag? Until the comparison and the amount are both named, the number is decoration, not information.",
        },
        {
          statement: "“Practice starts at 4:30, and honestly, evening practices are way better than morning ones.”",
          model: "Sort the halves separately. 'Practice starts at 4:30' is a fact the schedule can confirm in seconds. 'Evening practices are way better' is an opinion — 'way better' grades the experience instead of measuring it. A true fact standing next to an opinion does not promote the opinion into a fact.",
        },
      ],
    },
    quiz: [
      {
        question: "An ad announces: “Now with 30% more!” — and nothing else. How should a careful thinker file it?",
        answers: ["Needs checking: more than what is never said", "A fact: the box itself is a reliable record", "An opinion: percentages are personal views", "A fact: printed numbers can always be trusted"],
        correct: 1,
        explanation: "A percentage without a comparison partner is fog in a number costume. More than the old version? A rival? Until the comparison is named, the claim belongs in needs checking.",
        timeLimit: 20,
      },
      {
        question: "Which statement can be SETTLED by checking a record, with no judgment involved?",
        answers: ["Friday's quiz was the hardest of the term", "The library closes earlier in the summer", "Summer is the best season for reading", "Our class should read more chapters"],
        correct: 2,
        explanation: "Closing hours live in a published schedule — look it up and the question is closed. Hardest, best, and should are gradings and preferences, which no record can settle.",
        timeLimit: 20,
      },
      {
        question: "“Everyone at school is getting the new game.” Which response handles the fog best?",
        answers: ["Repeat it — when everyone says a thing, it is true", "Reject it — statements like that are false", "Ask who 'everyone' is and whether anyone counted", "Ignore it — fog words never matter at all"],
        correct: 3,
        explanation: "The honest move is neither swallowing nor dismissing: it is demanding the count behind the fog. 'Everyone' usually shrinks dramatically the moment somebody actually counts.",
        timeLimit: 20,
      },
      {
        question: "A report says the bridge is 40 meters long and 'a beautiful design.' Sorting it correctly means…",
        answers: ["both halves are facts because one is true", "the whole sentence is an opinion overall", "both halves are opinions about the bridge", "40 meters is a fact; 'beautiful' is opinion"],
        correct: 4,
        explanation: "Mixed sentences get sorted piece by piece. The length can be measured; the beauty can only be judged — and the measured half never promotes the judged half.",
        timeLimit: 20,
      },
      {
        question: "Why does the ten-second sort matter most for statements you WANT to be true?",
        answers: ["Wanting a claim true makes you skip checking", "Wanted statements are usually proven false", "Feelings about a claim change what it is", "The sort only works on claims you dislike"],
        correct: 1,
        explanation: "Claims that flatter what you already believe slide past your guard without inspection. The sort matters most exactly there — the Bereans checked even a message they were eager to receive.",
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
    intro: "Before a claim reaches you, it passes through somebody's hands — a person, a channel, a company, a friend of a friend who heard it from somewhere. This module is about examining the hands, not just the message: who is telling you this, what do they stand to gain, and can the same claim be found standing anywhere else?",
    sections: [
      {
        heading: "Every message has a messenger",
        paragraphs: [
          "Imagine two people tell you the bridge on your road is closed. One is the road crew chief, standing at the bridge in a safety vest. The other is somebody repeating a screenshot of a post about a bridge in another state. The words are identical; the weight they deserve is not remotely the same.",
          "Information is only ever as strong as the source carrying it, and a claim you encounter online has usually traveled a considerable distance before reaching you: somebody witnessed an event, posted an account of it, a channel clipped the account, a friend shared the clip, and the fragment that remained is what finally arrived in front of you. At every hop along that journey, pieces quietly fall away — the date, the place, the qualifying second half of the sentence — until what survives may resemble the original event only loosely.",
          "Clear thinkers therefore ask a different first question. Not 'Is this interesting?' but 'Where did this actually come from?' Three questions, asked in order, will carry you a very long way.",
        ],
      },
      {
        heading: "Three questions for any source",
        paragraphs: [
          "First: who is telling me this? A named person or organization that was actually present, or that studied the subject carefully, carries more weight than an unnamed account repeating something at third hand. Second: what do they want? Every source wants something — to inform you, to sell you something, to persuade you, to entertain you. Wanting something does not make a source dishonest, but you are entitled to know what the want is before you decide how much trust it has earned.",
          "Third: can I find it somewhere else? When two separate, trustworthy places report the same event independently of each other, confidence grows, because the same error is unlikely to occur twice in the same way. When a claim exists in exactly one screenshot and nowhere else on earth, that absence is information too.",
          "God cares about honest measure; a scale that reads true is his delight. Hold sources to the same standard: a good source measures straight, states its interest plainly, and lets you check its work.",
        ],
        verse: {
          text: "A false balance is an abomination to the LORD, but a just weight is his delight.",
          reference: "Proverbs 11:1 (ESV)",
        },
      },
      {
        heading: "The screenshot problem",
        paragraphs: [
          "The weakest form a claim can possibly travel in is a screenshot of a headline, because a screenshot strips away everything that would allow you to examine it: it carries no link to follow, no date you can trust, and no access to whatever was written immediately before or after the cropped lines. Anyone can screenshot a headline from five years ago — or from a page that publishes jokes formatted as news — and circulate it this morning as though it were a current, verified fact.",
          "Compare three versions of a single story, and notice how the trustworthiness changes while the words barely move. Version one is a screenshot announcing that Saturday's game is cancelled. Version two is a teammate's post reporting that he heard the game might be moved. Version three is the league's own schedule page, updated that morning by the officials who run the league. The three versions are cousins in wording and strangers in reliability — and only the third has earned the right to rearrange your Saturday.",
          "The rule of thumb deserves memorizing: the closer a claim sits to the person, place, or decision it describes, the more weight it can legitimately carry, because fewer hands have had the opportunity to alter, abbreviate, or misunderstand it. A screenshot sits at the maximum possible distance from the event itself. Whenever the claim matters, travel closer.",
        ],
      },
      {
        heading: "Before you tap share",
        paragraphs: [
          "Sharing is a form of publishing, and it deserves to be treated with a publisher's seriousness. The moment you forward something, your name and credibility ride on it, and if it turns out to be false, you participated in spreading it — regardless of the fact that you did not write it. The Bible's rule on the subject is blunt: do not spread a false report. The modern application requires only ten seconds: pause, run the three questions, and confirm the claim in one independent place before your thumb moves.",
          "None of this requires becoming suspicious of everything. Most days, the three questions take only moments to run: a named source, an honest want that you can identify, and a second place that agrees. That is enough to share with a clear conscience — and enough to quietly let the rest pass by unshared.",
        ],
        verse: {
          text: "You shall not spread a false report.",
          reference: "Exodus 23:1 (ESV)",
        },
        callout: {
          title: "Try it this week",
          text: "Before you forward anything this week, track it back to its original source — the first place it appeared, not the loudest copy of it. Read what the original actually says, including the parts the copies dropped. Notice how the original is usually quieter, more careful, and less certain than the versions that traveled.",
        },
      },
    ],
    drill: {
      title: "Which version do you trust?",
      intro: "The same news arrives in three forms. Rank them in your head — most trustworthy to least — and then do the harder second job: for the weakest version, name the single check that would raise it. Then open the model answers to compare both your ranking and your repair.",
      items: [
        {
          statement: "Version A: A screenshot of a headline — 'Saturday's Game Cancelled!' — with no date and no source name visible.",
          model: "Weakest of the three. A screenshot can be old, cropped, or lifted from a joke page, and it offers no link to follow. The repair: find the league's own fixture list or the original article. One visit to a named, dated source either confirms the cancellation or exposes the screenshot as a leftover from another season.",
        },
        {
          statement: "Version B: A teammate posts, 'Heard the game Saturday might be moved to the afternoon — coach mentioned it, I think.'",
          model: "Middle. A real person you know, passing on something he half-heard — but 'heard,' 'might,' and 'I think' are three layers of fog stacked on one claim. The repair: ask the coach directly, or check the team chat where the coach posts. One question addressed to the actual decision-maker settles what three forwards cannot.",
        },
        {
          statement: "Version C: The league's own website schedule page, updated this morning, lists the game at 2:00 PM.",
          model: "Strongest. This is the source itself, as close to the decision as a claim can sit, carrying a date you can verify. Notice that it also disagrees with Version A — which is exactly why the ranking has to happen before you rearrange your Saturday around a screenshot.",
        },
      ],
    },
    quiz: [
      {
        question: "A screenshot in the group chat says the school play is postponed. Nothing else is attached. Best action?",
        answers: ["Forward it quickly so everyone can adjust", "Trust it — screenshots cannot be altered", "Ask the sender who originally posted it", "Check the school's own announcements page"],
        correct: 4,
        explanation: "Go closer to the source: the school's own page is where a postponement is decided and posted. A screenshot has no date, no link, no context.",
        timeLimit: 20,
      },
      {
        question: "A shoe channel reviews a shoe it sells, calling it 'unbeatable.' The wisest reading is…",
        answers: ["the review is certainly a complete pack of lies", "the channel's want is sales — verify elsewhere", "selling a shoe makes the review expert", "reviews by sellers are banned everywhere"],
        correct: 2,
        explanation: "Wanting to sell does not prove dishonesty, but it changes how much trust the review has earned. The claim gets checked against sources that gain nothing from your purchase.",
        timeLimit: 20,
      },
      {
        question: "Two unrelated local papers, reporting separately, describe the same road closure. Why does that matter?",
        answers: ["Repetition alone makes any claim certain", "Papers are never allowed to make errors", "Independent agreement raises confidence", "Two stories means twice as much advertising"],
        correct: 3,
        explanation: "Independent agreement is the third source question at work: the same mistake is unlikely to be invented twice, in the same words, by people who did not copy each other.",
        timeLimit: 20,
      },
      {
        question: "A video about a 'miracle' study aid has 2 million views and no named researcher anywhere. The views count as…",
        answers: ["strong evidence the aid actually works", "proof the researcher prefers privacy", "evidence the topic interests many people", "a substitute for checking the study"],
        correct: 3,
        explanation: "Popularity measures attention, not truth. With no named researcher, the first source question — who is telling me this? — has no answer, and the claim keeps only the weight it has earned.",
        timeLimit: 20,
      },
      {
        question: "Which of these sits CLOSEST to the event it describes, and so carries the most weight?",
        answers: ["A podcast retelling last month's storm damage", "The county's road report, posted this morning", "A meme about the storm shared 500 times over", "A friend's summary of a stranger's video clip"],
        correct: 2,
        explanation: "The county reports on its own roads, firsthand and dated — closest to the event. Everything else is a copy of a copy, losing date, place, and detail at every hop.",
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
    intro: "The world runs on claims: packages promise, videos declare, posts announce. A claim is a statement dressed up as truth — and some claims have earned the costume, while others are merely wearing it. This module teaches you to spot the claim inside the costume, ask calmly for its evidence, and stay clear-headed when two things happen at the same time and beg to be confused.",
    sections: [
      {
        heading: "Test everything",
        paragraphs: [
          "Paul compressed the whole method into a few short words: test everything, and hold fast to what is good. Testing is not the opposite of faith; it is what faith does with everything it hears. Whatever passes the test, you hold fast to. Whatever fails it, you let go — without anger, and without apology.",
          "A claim, defined precisely, is any statement presented as true that still requires its proof before it deserves belief. 'This toothpaste helps prevent cavities.' 'This is the fastest route across town.' 'Our club raised the most money this year.' None of these statements is a fact yet, whatever confidence their speakers project. Each one is a claim, standing in line, waiting for evidence substantial enough to carry its weight.",
          "Once you have learned to recognize claims, you cannot stop seeing them, because they are printed on every package, spoken in every advertisement, and embedded in half the videos in your feed. That is good news rather than bad, because a claim — unlike a mood or a rumor — can be tested, and you now know the questions that perform the testing.",
        ],
        verse: {
          text: "Test everything; hold fast what is good.",
          reference: "1 Thessalonians 5:21 (ESV)",
        },
      },
      {
        heading: "Spot the claim",
        paragraphs: [
          "Claims wear costumes, and the costumes follow patterns. The number costume: '9 out of 10 dentists recommend…' — numbers feel thoroughly proven even when nobody tells you who did the counting, how many were asked, or what the question actually was. The crowd costume: 'Everyone is switching…' — everyone being, conveniently, a word that almost never gets counted at all.",
          "Then there is the speed costume: 'Works instantly!' And the comparison costume: 'Now 50% stronger!' Stronger than what, exactly — last year's version, a serious rival, or a wet noodle? Every costume performs the same trick: it makes a claim feel finished and proven while its actual proof is still missing.",
          "Your first job, therefore, is simply to spot the claim underneath: what, precisely, is being said to be true here? Drag it into plain language and state it in your own words. Half the power of a dressed-up claim evaporates the moment it is standing in plain clothes, where its missing pieces become visible.",
        ],
      },
      {
        heading: "Ask for the evidence",
        paragraphs: [
          "Evidence comes in strengths, and the strengths can be ranked with confidence. At the top stands a test you can watch, repeat, or perform yourself — timing two paper planes under identical conditions, five throws each, and reading the recorded numbers. Immediately below that stands a genuine study or test whose details are displayed openly: how many subjects were tested, what they were compared against, and precisely how the measuring was conducted.",
          "Weaker still is a famous person's endorsement, which proves only that the person was paid, or pleased, or both — never that the claim is true. And at the bottom stands the slogan: a claim wearing a costume, carrying no proof whatsoever, asking to be believed because it rhymes.",
          "Therefore put three questions to any claim that actually matters to you, and listen carefully to whether it answers or evades. How many were tested? Compared to what? And who performed the measuring? A claim that survives those three questions has honestly earned a measure of your trust. A claim that dodges all three has also communicated something important — something its maker was hoping you would never notice.",
        ],
      },
      {
        heading: "Together is not because",
        paragraphs: [
          "Here is the most deceptive claim pattern of all, and it succeeds precisely because it sounds like simple observation. In July, ice cream sales rise sharply. In July, swimming pool visits rise sharply as well. Did the ice cream cause the swimming, or the swimming the ice cream? Neither — summer caused both, simultaneously, and the two rising lines merely share a common driver. Two developments occurring together do not, by themselves, constitute proof that one of them caused the other.",
          "This pattern powers a remarkable amount of confident public talk. 'Ever since our team received new uniforms, we win more frequently.' Perhaps the uniforms deserve the credit. Or perhaps the team also practiced more during that month, and the schedule coincidentally grew easier at the same time. Before you assign credit to one cause, train yourself to ask what else changed alongside it — because the operative cause is very often standing quietly somewhere in that list, uncredited.",
        ],
        verse: {
          text: "Do not judge by appearances, but judge with right judgment.",
          reference: "John 7:24 (ESV)",
        },
        callout: {
          title: "Try it this week",
          text: "Catch one claim every day this week — from a box, an advertisement, or a video — and write down the proof you would demand before believing it: how many, compared to what, and who measured? By Friday you will own a page of questions that most adults go their whole lives without asking.",
        },
      },
    ],
    drill: {
      title: "What proof would you ask for?",
      intro: "Each statement below is a claim wearing a costume — and each arrives with evidence already attached, because claims usually do. Your job has two steps: name the proof that would actually settle it, and explain why the evidence already offered falls short. Then compare both halves with the model answer.",
      items: [
        {
          statement: "“9 out of 10 dentists recommend this toothpaste,” says the ad — under a photo of a smiling dentist holding the tube.",
          model: "Ask: how many dentists were actually asked — ten, or ten thousand? What exactly were they asked, and were other brands on the list? And who paid for the asking — the toothpaste company, or somebody with nothing to sell? The photograph proves only that a dentist was photographed. A picture of evidence is a costume, not a count.",
        },
        {
          statement: "“Everyone is switching to this backpack,” says the poster — above a photo of a long line outside the store.",
          model: "Ask: who is 'everyone,' and has anybody counted the switchers out of all the buyers? The line in the photograph proves people queued on one day — possibly for a sale, possibly for one morning. It says nothing about how many switched, from what, or whether they stayed switched. A crowd is an illustration, not a measurement.",
        },
        {
          statement: "“This battery lasts twice as long!” says the package — beside a chart showing one tall bar and one short bar.",
          model: "Ask: twice as long as what — the old model, a rival brand, a candle? And under what test — playing video at full brightness, or sitting in a drawer? The chart looks like evidence until you notice its bars carry no labels and its scale no numbers. It is a costume drawn to resemble proof.",
        },
      ],
    },
    quiz: [
      {
        question: "A drink ad says “9 out of 10 athletes choose it.” Which question set tests the claim itself?",
        answers: ["Is the drink expensive, and does it taste good?", "How many were asked, who asked, compared to what?", "Which famous athletes appear in the advert?", "How long has the company sold this drink?"],
        correct: 2,
        explanation: "A percentage claim lives or dies by its counting: sample size, independence, comparison. Price, fame, and history test everything except the claim.",
        timeLimit: 20,
      },
      {
        question: "A team started winning the same month it got new uniforms. Claiming the uniforms caused it ignores…",
        answers: ["that practice time and schedules changed too", "the particular colors chosen for the uniforms", "how much the new uniforms cost the school", "whether the fans liked the new uniforms"],
        correct: 1,
        explanation: "Together is not because. When several things change at once, any one of them — or the easier schedule — may be doing the work, and crediting the uniforms is a guess dressed as a conclusion.",
        timeLimit: 20,
      },
      {
        question: "Which evidence would carry the MOST weight for the claim “this tent survives storms”?",
        answers: ["A slogan on the box: 'Storm-tested tough!'", "A celebrity camper says she loves the tent", "Three friends report one calm night in it", "A filmed test: tent in wind and rain, timed"],
        correct: 4,
        explanation: "A repeatable test in actual storm conditions outranks the slogan (the claim itself), the endorsement (payment or pleasure), and one calm night (no storm at all).",
        timeLimit: 30,
      },
      {
        question: "A package announces “Now 50% stronger!” The claim is weakest exactly where it hides…",
        answers: ["the comparison's partner: stronger than what", "the name of the factory that made the item", "the date the package was printed and shipped out", "whether the printer used bold type or not"],
        correct: 1,
        explanation: "A comparison with no visible partner can be made true against almost anything — including last year's model or a wet noodle. Naming the partner is where the claim becomes testable.",
        timeLimit: 20,
      },
      {
        question: "“Ever since I switched notebooks, my grades rose.” What else must be checked before crediting the notebook?",
        answers: ["Whether the notebook has enough pages left", "Whether habits or easier units changed too", "Whether classmates admire the new notebook", "Whether the notebook was bought on a weekday"],
        correct: 2,
        explanation: "Together is not because. New habits, tutoring, or easier units could each explain the rise — the notebook must beat those rivals, not ignore them.",
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
    intro: "Some problems keep coming back — the same flat tire, the same dying battery, the same wilting plant — because every repair so far has treated only the top layer of the trouble. This module teaches you to keep asking why, level after level, until you reach the root: the one cause down at the bottom that, fixed a single time, ends the pattern for good.",
    sections: [
      {
        heading: "The problem that keeps coming back",
        paragraphs: [
          "Patch a bicycle tire on Monday, and it holds. Patch the same tire again on Friday, and it holds as well. By the third patch inside a single month, however, a clear thinker stops blaming the tube and begins asking a considerably better question: why does this keep happening to this particular tire, in this particular pattern?",
          "Most recurring problems possess layers, and confusing the layers is what keeps them alive. What you notice first — the flat — is merely the topmost layer: the symptom. Underneath it sits an entire chain of causes, each link explaining the layer directly above it. Repair only the symptom, and the chain remains fully intact below the surface, patiently manufacturing the next failure on approximately the same schedule as the last.",
          "The tool for digging through those layers is almost embarrassingly simple: ask 'why?' roughly five times, each time asking it about the answer you just received. Five is not a magic number. It is simply far enough, on most days and for most problems, to reach the bottom.",
        ],
      },
      {
        heading: "Deep water, drawn out",
        paragraphs: [
          "The book of Proverbs pictures exactly this: purposes run deep, like water far down a well, and a person of understanding draws them out. Causes behave the same way. They are rarely lying on the surface waiting to be noticed; they are drawn out, one honest answer at a time, by somebody patient enough to keep pulling the rope.",
        ],
        verse: {
          text: "The purpose in a man's heart is like deep water, but a man of understanding will draw it out.",
          reference: "Proverbs 20:5 (ESV)",
        },
      },
      {
        heading: "Two rules for the digging",
        paragraphs: [
          "Rule one: answer every why with a fact you can check — something you can look at, measure, or test — never with a guess about somebody's motives. 'The tire is visibly cracked' can be checked by anyone. A chain is only as strong as its weakest answer, and guesses cannot carry weight.",
          "Rule two: follow one chain at a time, and stop when you arrive at a cause you can actually fix. That fixable cause is the root. Everything above it in the chain was the root announcing itself, layer by layer, in the only language symptoms speak.",
          "Ask the questions out loud, or better, write them down one beneath the other where the whole chain stays visible. A chain you can see is a chain you can test — and a chain you can test is a chain you can trust.",
        ],
      },
      {
        heading: "Worked example: the third flat tire",
        paragraphs: [
          "Consider a concrete case. Problem: a bicycle has suffered its third flat inside a month. Why number one — why did the tire go flat on this occasion? Because a sharp thorn punctured the tube. Why number two — why was the thorn able to penetrate the tire at all? Because it slipped through a crack that had opened in the tire's sidewall.",
          "Why number three — why is the sidewall cracked? Because the rubber is old and thoroughly dried out; the tire has been mounted on the bicycle for years. Why number four — why has an aged tire remained in service so long? Because every flat received a patch, so replacement never felt genuinely urgent. Why number five — why patch it on every occasion? Because patching felt quicker, each individual time, than stopping to investigate why the flats kept recurring.",
          "There is the root: an old, cracked tire that a series of quick patches kept alive past its time. Notice that the honest fix is not a fourth patch — it is a new tire. And the same digging has solved problems a thousand times larger: a famous monument in Washington was slowly wearing away while crews kept cleaning and repairing the stone, until somebody asked why, repeatedly, and the real cause turned out to be buried far below the surface problem. The size of the problem changes nothing about the digging.",
        ],
        callout: {
          title: "Try it this week",
          text: "Choose one problem that has now happened to you twice. Before you repair it a second time, write the full chain of whys on paper, insisting that every answer be something you could actually check. Fix the root you find at the bottom — then notice whether the problem dares to come back a third time.",
        },
      },
    ],
    drill: {
      title: "Finish the chain",
      intro: "Each chain below is started for you — the problem and the first two whys. Keep asking why until you reach a root you can fix once. Then open the model chain and compare.",
      modelLabel: "The rest of the chain",
      items: [
        {
          statement: "Problem: The tomato plants keep wilting. Why #1: The roots are dry. Why #2: Water runs off the soil instead of soaking in.",
          model: "Why #3: The soil is packed hard and bare, so water sheets off the top. Why #4: No mulch was ever spread to cover it. Why #5: Planting day was rushed, and soil cover never made the list. Root fix: loosen the soil and add mulch once — then watering actually reaches the roots.",
        },
        {
          statement: "Problem: A phone battery keeps dying by noon. Why #1: The battery drains fast all morning. Why #2: Two apps run in the background the whole time.",
          model: "Why #3: The apps restart themselves after being closed. Why #4: Their settings allow background activity all day. Why #5: The settings were never changed from the day the phone was set up. Root fix: change the settings once — no more carrying a charger like a daily patch.",
        },
        {
          statement: "Problem: Finished homework keeps vanishing before class. Why #1: It is not in the folder where it belongs. Why #2: Loose papers get stuffed into the backpack wherever they fit.",
          model: "Why #3: At the end of class there is no fixed moment to file papers away. Why #4: The routine is 'grab everything and go.' Root fix: one home for homework — a single folder — and ten seconds to file before leaving class. Four whys was enough here; the root is what matters, not the count.",
        },
      ],
    },
    quiz: [
      {
        question: "The library printer jams every Monday. Paper is cleared each time, yet it jams again. Best next move?",
        answers: ["Clear the paper faster so Monday starts sooner", "Ban printing on Mondays until it behaves", "Replace the printer without checking anything", "Ask why the jams cluster on Mondays specifically"],
        correct: 4,
        explanation: "The pattern is the clue: Monday-only jams point to something Mondays do differently — a weekend shutdown, a Monday surge, idle paper. Ask why about the pattern first.",
        timeLimit: 30,
      },
      {
        question: "A chain of whys is only trustworthy when each answer in it is…",
        answers: ["something checkable, not a motive guess", "the answer the questioner was hoping to hear", "long enough to sound properly technical", "agreed by everyone standing in the room"],
        correct: 1,
        explanation: "'The tray was loaded wet' can be checked; 'the staff are careless' is a motive guess. A chain built on guesses collapses at that link.",
        timeLimit: 20,
      },
      {
        question: "One why-answer says seedlings bend toward the window because the shelf light is weak. What makes it a GOOD link?",
        answers: ["It ends the chain at a satisfying number", "It can be tested: move one pot and compare", "It shifts attention away from the watering", "It sounds more scientific than the others"],
        correct: 2,
        explanation: "A good link makes a prediction you can test: if weak light is the cause, the moved pot should straighten while the others keep bending. Testability is what separates a cause from a story.",
        timeLimit: 20,
      },
      {
        question: "A hose bursts at the same joint monthly. Whys reach: washer old → never replaced → patches felt quicker. Root?",
        answers: ["The water pressure inside the city mains", "The habit of patching instead of replacing", "The exact brand of hose bought last year", "The joint's position at the end of the hose"],
        correct: 2,
        explanation: "The root is the deepest fixable cause: the patching habit that kept a worn washer in service. Pressure might explain one burst, never every burst.",
        timeLimit: 20,
      },
      {
        question: "When should a why-chain STOP, even if more whys are technically possible?",
        answers: ["When the answers start to feel repetitive", "When it reaches exactly five questions", "When it reaches a cause you can actually fix", "When somebody in the room gets tired of it"],
        correct: 3,
        explanation: "Five is a guide, not a law. The chain ends at the root: the deepest cause that is both checkable and fixable. Digging past it into territory nobody can change is philosophy, not repair.",
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
    intro: "Nobody gets better at something by accident, and nobody gets it right on the first attempt either. What actually works — for builders, bakers, ball players, and lemonade stands alike — is a small, honest loop: plan one change, try it, check what really happened, and fix whatever the check reveals. Then run the loop again, a little smarter than before.",
    sections: [
      {
        heading: "First, count the cost",
        paragraphs: [
          "Jesus once asked a question that belongs in every workshop and kitchen: which of you, wanting to build a tower, does not first sit down and count the cost of finishing it? Planning is not stalling, and it is not fear. It is sitting down before you stand up — deciding what you intend to build, what it will require, and how you will know whether it worked.",
          "The builders who actually finish towers are not the ones who never meet problems. They are the ones who planned, watched what happened with open eyes, and adjusted without drama. Four short steps, run in a loop, will improve almost anything you are willing to aim them at.",
        ],
        verse: {
          text: "For which of you, desiring to build a tower, does not first sit down and count the cost, whether he has enough to complete it?",
          reference: "Luke 14:28 (ESV)",
        },
      },
      {
        heading: "The four steps",
        paragraphs: [
          "Plan it: select one change to make, and decide in advance how you will measure its effect. 'Sell more lemonade' is a wish; 'offer a second flavor and tally every single sale' is a plan. Try it: run the plan for real, at a size small enough to finish — one Saturday, one week, one practice. Change one or two things at a time, because if you change six, you will never know which one did the work.",
          "Check it: examine the honest results — the count, the time, the tally sheet — and not the results you were hoping for. Fix it: keep what demonstrably worked, adjust what did not, and carry the lesson forward into the next plan. Then the loop turns again, better informed than the last revolution.",
          "Notice what the loop refuses to do: it never declares victory or defeat on the strength of a single attempt. One try is data, not a verdict. The verdict emerges from the loop itself — and the loop is always permitted to turn once more.",
        ],
      },
      {
        heading: "Worked example: the lemonade stand loop",
        paragraphs: [
          "Plan: two friends want their Saturday lemonade stand to beat last week's total of 18 cups. They ask a few neighbors what they would actually buy, decide to add a berry flavor, place a sign at the corner, and tally every sale on a sheet. Try: Saturday arrives; they sell both flavors and mark the tally sheet, cup by cup, all day.",
          "Check: the count says 26 cups — and berry outsold plain by two to one. Three customers, unprompted, also asked whether a smaller size existed for little kids. Fix: next week they stock more berry supplies, introduce the small size, and keep the corner sign that clearly earned its place.",
          "Nobody doubled anything with a motivational speech. They ran one small loop, read a tally sheet honestly, and allowed the check to write the next plan. That is how a stand — or a study routine, or a free throw — genuinely improves: loop by loop, each one standing on evidence from the last.",
        ],
      },
      {
        heading: "Loops beat launches",
        paragraphs: [
          "Big launches feel impressive: the heroic study weekend, the total room reorganization, the brand-new everything begun on Monday. But a giant effort with no check built into it is merely a guess wearing confetti. Small loops win because each revolution teaches you something the next one gets to use.",
          "Keep the loop written down: four lines in a notebook — Plan, Try, Check, Fix — each with a date. A written loop cannot quietly rewrite itself inside your memory afterward, and a month of those pages is the most convincing proof available that you are actually improving at something.",
        ],
        callout: {
          title: "Try it this week",
          text: "Choose something small this week — a free-throw routine, a homework habit, a recipe you keep meaning to master. Run one complete loop on it: one planned change, one honest check, one fix carried forward. Write the four lines down with the date, and let the page, not your feelings, report how it went.",
        },
      },
    ],
    drill: {
      title: "Run the loop on a paper airplane",
      intro: "A paper airplane keeps folding in the air after about two meters. Walk it through one full loop: for each step, decide what you would do — then compare with the model.",
      modelLabel: "The loop step",
      items: [
        {
          statement: "Step 1 — Plan it: What one change will you test, and how will you measure it?",
          model: "Change one thing: clip a paperclip to the nose for weight. Measure it the same way every time — five throws from the same line, paced off in meters. One change, one ruler: that is a plan.",
        },
        {
          statement: "Steps 2 and 3 — Try it and check it: The five throws go 2, 3, 2, 4, and 3 meters, and the plane still banks left. What does the check honestly say?",
          model: "The clip helped a little — most throws beat the old two meters — but it did not fix the left bank. A check reports both halves: what improved and what did not. No pretending, no despair.",
        },
        {
          statement: "Step 4 — Fix it: What do you carry into the next loop?",
          model: "Keep the paperclip — the check says it earned its place. Fix the next thing: bend the left wing tip slightly up to fight the bank, then run the loop again and let the new throws vote.",
        },
      ],
    },
    quiz: [
      {
        question: "A baker changes flour, oven heat, AND proofing time, and the bread improves. What has she lost?",
        answers: ["Knowing which change actually did the work", "The chance to sell the improved bread", "Any reason to run the loop a second time", "The right to call the result an improvement"],
        correct: 1,
        explanation: "Three changes at once produce one result with three suspects. The loop's discipline — one or two changes per turn — exists precisely to keep cause and effect readable.",
        timeLimit: 20,
      },
      {
        question: "A jump-rope team tests a new routine once; it flops. The loop's honest verdict is…",
        answers: ["the routine is proven useless forever", "one trial is data, not a verdict yet", "the team should hide the trial result", "the plan must have been written wrong"],
        correct: 2,
        explanation: "A single attempt can fail because of weather, nerves, or one bad day. The loop treats it as information, adjusts something, and turns again before any verdict is allowed.",
        timeLimit: 20,
      },
      {
        question: "What makes “offer a second flavor and tally every sale” a PLAN while “sell more” is only a wish?",
        answers: ["It mentions two flavors instead of one", "It is written neatly in a notebook with a date", "It names the change and its measurement", "It promises the result before the trial"],
        correct: 3,
        explanation: "A plan specifies the change and the measurement before the trial begins, so the check afterward can be honest. A wish names only the outcome it happens to hope for.",
        timeLimit: 20,
      },
      {
        question: "The check shows sales rose — but rain also kept the rival stand closed that day. The careful reader says…",
        answers: ["the plan worked; no further questions needed", "the check is worthless and should be burned", "credit everything to the new corner sign", "the rise is real, but its cause is not proven"],
        correct: 4,
        explanation: "Honest checking reports both halves: what improved, and what else might explain the improvement. Naming the rival's absence keeps the next fix aimed at the truth instead of at a lucky guess.",
        timeLimit: 30,
      },
      {
        question: "A study-habit loop checks after one week: no gain. Which response follows the loop best?",
        answers: ["Declare studying a lost cause for the term", "Change one element and run the loop again", "Change every element at once next week", "Repeat the identical plan, only louder"],
        correct: 2,
        explanation: "A flat check is information, not a funeral. Adjust one element — the time of day, the place, the phone's location — and let the next loop report what that single change actually does.",
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
    intro: "Not every problem deserves the same Saturday. Some matter enormously and take ten minutes to repair; others would consume an entire weekend and change almost nothing that matters. This module hands you a simple four-box sort for deciding what receives your energy first — and what can honestly wait, or be deliberately skipped without guilt.",
    sections: [
      {
        heading: "Jethro's advice to Moses",
        paragraphs: [
          "In Exodus 18, Moses was judging every dispute in Israel personally, from morning until evening, while the line of waiting people stretched out of sight. His father-in-law Jethro observed the system for a single day and delivered a verdict that still stands: what you are doing is not good. You will certainly wear yourselves out, because the work is too heavy for one person carrying it in one long, unsorted line.",
          "Notice that Jethro's remedy was not 'work harder.' It was order: capable helpers appointed over the smaller matters, only the hardest cases carried up to Moses, and everything resting in its proper place. The same total work, once sorted, suddenly became doable. Most overwhelmed weeks do not need more hours. They need a sort.",
        ],
        verse: {
          text: "What you are doing is not good. You and the people with you will certainly wear yourselves out, for the thing is too heavy for you. You are not able to do it alone.",
          reference: "Exodus 18:17–18 (ESV)",
        },
      },
      {
        heading: "Two honest questions",
        paragraphs: [
          "Every problem on your list must answer two questions before it earns a place in your week. First: how much does it actually matter? If this problem gets fixed, what genuinely changes as a consequence — for your goal, your family, your team, your schedule? Some repairs alter everything downstream of them for months. Others alter nothing whatsoever beyond the internal appearance of a drawer.",
          "Second: how difficult is it, calculated honestly in time, effort, and cost? Ten minutes, or two complete weekends? A ladder and a tube of sealant, or a single telephone call? Observe what neither question concerns: neither asks how LOUD the problem is, nor how long it has been nagging at you. Loud is not a synonym for important, and old is not a synonym for urgent, and confusing those pairs is precisely how entire weeks disappear.",
          "Two honest answers per problem: that is the entire machine. The four boxes that follow are simply where the pairs of answers land.",
        ],
      },
      {
        heading: "The four boxes",
        paragraphs: [
          "Matters a great deal, and is not difficult: DO FIRST. These are the quick repairs that unlock everything else in the week — resolving them now transforms your schedule in exchange for minutes of effort, which is the most favorable exchange rate your time will ever be offered. Matters a great deal, and is difficult: PLAN WELL. These deserve genuine time, a realistic schedule, and steps broken down in advance and executed in sequence — not a panicked Saturday, but a proper plan, carried out piece by piece.",
          "Matters a little, and not hard: DO IF TIME. Filler tasks, legitimate in the gaps of a day and never permitted to eat the day itself. Matters a little, and hard: MAYBE SKIP. Deliberately letting these go is not laziness; it is honesty about a finite week. Your energy is a budget, and skipping on purpose is how the budget survives to fund what matters.",
        ],
        callout: {
          title: "The four boxes",
          text: "Do First — matters a lot, not hard: quick repairs that unlock the week. Plan Well — matters a lot, hard: real projects that deserve a schedule. Do If Time — matters a little, easy: honest filler for gaps. Maybe Skip — matters a little, hard: the deliberate art of letting go. Two questions, four boxes, one honest Saturday.",
        },
      },
      {
        heading: "Boxes move",
        paragraphs: [
          "The sort is not carved in stone, because the facts underneath it keep moving. A slow tire leak sits quietly in Plan Well until the big ride lands on Saturday — then it jumps, correctly, to Do First. A science fair three weeks away is Plan Well; the same fair three days away turns its remaining pieces into Do First, one at a time. Re-sort your list about once a week, and immediately whenever a deadline moves.",
          "And remember the second half of Jethro's remedy: some items on your list can legitimately be carried by somebody else. A problem does not become yours merely because you were the person who noticed it first. Prepare your work in the right order, assign what can be assigned, and the work gets done.",
        ],
        verse: {
          text: "Prepare your work outside; get everything ready for yourself in the field, and after that build your house.",
          reference: "Proverbs 24:27 (ESV)",
        },
      },
    ],
    drill: {
      title: "Sort the six",
      intro: "Six practical problems, one list. For each one, ask the two questions — how much does it matter, and how hard is it — and name its box. Then read the second half of each model answer: every sort includes the change that would MOVE the problem into a different box, because boxes move.",
      items: [
        {
          statement: "Your bike tire has a slow leak, and the big group ride is this Saturday.",
          model: "Do First. It matters enormously — no tire, no ride — and patching or swapping a tube is quick work. What would move it: if the ride were cancelled, the same repair drops to Do If Time, because nothing would then depend on the day it gets done.",
        },
        {
          statement: "The science fair is in three weeks. Your project needs a board, supplies, and two experiments run and recorded.",
          model: "Plan Well. It matters a great deal and it is genuinely large, so it earns broken-down pieces — supplies this week, experiments next, board last — each with a real slot on the calendar. What would move it: discovering in fair week that one experiment was never recorded turns that single piece into Do First overnight.",
        },
        {
          statement: "The team signup sheet is a paper list that keeps getting lost before games.",
          model: "Plan Well. Players and rides depend on it, so it matters — and the real repair, one shared list with a named keeper, takes a focused hour to build properly rather than two minutes. What would move it: if the season ended next week, building the system becomes Maybe Skip, and simply photographing the existing sheet becomes Do First.",
        },
        {
          statement: "Your desk drawer is a tangle of pens, batteries, and cables.",
          model: "Do If Time. Untangling it is easy and mildly useful, but nothing in your week depends on it — a fine gap-filler, never a Saturday. What would move it: very little honestly moves the drawer itself. Even the day it hides the one charger your project needs, the problem that jumps boxes is the charger, not the drawer.",
        },
        {
          statement: "Repainting the garden fence a new color would take two full days. The fence is sturdy and looks fine as it is.",
          model: "Maybe Skip. Two days of hard work that changes almost nothing is the most expensive kind of task there is; skip it on purpose and spend the weekend where it counts. What would move it: peeling paint and bare, weathering wood would — protection matters in a way that color never did, and the job becomes Plan Well.",
        },
        {
          statement: "The hall closet where the sports gear lives has no hooks, so gear piles on the floor. Four hooks and fifteen minutes would fix it.",
          model: "Do First. Small effort, daily payoff: every practice day starts smoother because of it. It matters more than it looks and costs less than it looks. What would move it: honestly, very little — which is precisely the profile of a Do First. When nothing realistic moves a problem out of quick-and-important, stop deliberating and do it.",
        },
      ],
    },
    quiz: [
      {
        question: "Saturday: the carpool form (10 min, ride depends on it) and repainting a scuffed wall (all day, looks fine). Sort them.",
        answers: ["Both are Do First: Saturday is for all jobs", "Form: Do First; wall repaint: Maybe Skip", "Form: Plan Well; wall repaint: Do First", "Form: Do If Time; wall repaint: Plan Well"],
        correct: 2,
        explanation: "The form carries the ride and costs ten minutes: maximum importance, minimum effort. The repaint eats a day and changes nothing that matters.",
        timeLimit: 30,
      },
      {
        question: "A science fair moves from three weeks away to THIS Friday. What honestly happens to its unfinished pieces?",
        answers: ["They stay Plan Well until Friday morning", "They jump to Do First, one piece at a time", "They become Maybe Skip under the pressure", "They move to Do If Time to reduce stress"],
        correct: 2,
        explanation: "Boxes move when the facts move. An arriving deadline turns planned work into immediate work — piece by piece, in the order the pieces are needed.",
        timeLimit: 20,
      },
      {
        question: "Which problem is Plan Well rather than Do First?",
        answers: ["A loose bike chain, ten minutes, ride today", "A torn poster edge needing one strip of tape", "Rebuilding the club's whole signup system", "Four hooks for the gear closet, fifteen minutes"],
        correct: 3,
        explanation: "A large, important job earns a schedule and broken-down steps. The other three are quick repairs with outsized payoff: Do First by definition.",
        timeLimit: 20,
      },
      {
        question: "A teammate insists the LOUDEST problem — a squeaky gym door — must top the list. The two honest questions ask instead…",
        answers: ["how many people the squeak has annoyed today", "how long the squeak has been going unrepaired", "how much fixing it changes, and what it costs", "how embarrassing the squeak is during games"],
        correct: 3,
        explanation: "Volume is not a sorting question. The machine asks what changes if the problem gets fixed, and what the fixing honestly costs in time and effort — annoyance and age answer neither question.",
        timeLimit: 20,
      },
      {
        question: "Your sorted list includes a task a younger sibling could do just as well in ten minutes. Jethro's half of the fix says…",
        answers: ["add it to your list twice to remember it", "do it yourself anyway; help is a distraction", "move it to Maybe Skip until they volunteer", "assign it: noticing a problem isn't owning it"],
        correct: 4,
        explanation: "Jethro's remedy was distribution, not endurance: helpers carried the smaller matters. Noticing a problem first does not make it yours.",
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
    intro: "Ask a roomful of students where yesterday went and you will mostly collect shrugs. Days feel long while you are living them and vanish when you look back at them. This module is about seeing your time with unusual clarity — where it actually goes, in real, countable hours — and then spending tomorrow on purpose instead of by accident.",
    sections: [
      {
        heading: "A prayer about counting",
        paragraphs: [
          "Psalm 90 is Moses' prayer, and in the middle of it sits a surprising request: teach us to number our days. Not to make the days longer. Not to squeeze more activity into them. To number them — to count them the way you count something precious and finite, the way you count money that cannot be replaced once it is spent.",
          "Moses says the fruit of that counting is a heart of wisdom, and the mechanism is easy to watch working. A student who knows the day holds exactly twenty-four hours — no more are coming, no refunds are issued — starts asking what those hours are actually FOR. Time stops being weather that happens to you and becomes a budget you are responsible for spending. And budgets, unlike weather, can be planned.",
        ],
        verse: {
          text: "So teach us to number our days that we may get a heart of wisdom.",
          reference: "Psalm 90:12 (ESV)",
        },
      },
      {
        heading: "Where a day actually goes",
        paragraphs: [
          "Here is the honest arithmetic of a school day: roughly eight hours sleeping, seven at school, two more eaten by meals, getting ready, and traveling — which leaves approximately seven hours that are actually yours to aim. Most students guess the contents of those seven hours completely wrong, usually by forgetting the phone-shaped one: games, scrolling, and videos commonly consume three of the seven without ever announcing themselves.",
          "The remedy is not guilt; the remedy is a log. For one ordinary day, write down what actually filled the hours, in rough blocks rather than spy-level detail: school, sleep, meals, practice, homework, family, screens, rest. Add the blocks and check that they total twenty-four. A log reports a truth that guesses never reach, and you cannot plan a day you have never actually seen.",
          "Notice what a log always protects: sleep appears as a real block with a size of its own, not as whatever happens to be left over after everything else has eaten. A numbered day defends the blocks that make all the other blocks function.",
        ],
      },
      {
        heading: "Plan tomorrow tonight",
        paragraphs: [
          "Planning a day takes about five minutes, done the night before, and the method is embarrassingly simple: give the big things a home first. Sleep, school, practice, family dinner — the fixed boulders take their places on the schedule before anything else is allowed to move. Then homework and projects fit into the remaining blocks, attached to actual clock times, and the smaller things fill whatever is left.",
          "A block written down — '4:30 to 5:00, science project' — behaves completely differently from a hope like 'sometime tomorrow.' The block has a door you can walk through; the hope has a shrug. When the block's hour arrives, beginning is easier, because the decision was already made the night before by a calmer, less tempted version of you.",
          "That is the entire secret of people who are said to 'find time': they never find it at all. They assign it — making the best use of the time, on paper, before the day is given the chance to spend itself.",
        ],
        verse: {
          text: "Making the best use of the time, because the days are evil.",
          reference: "Ephesians 5:16 (ESV)",
        },
      },
      {
        heading: "The kind swap",
        paragraphs: [
          "Once a log has shown you the truth, change arrives as a swap rather than a sacrifice. Find one block that gives you very little in return — the third scrolling session of a day rarely delivers anything the first two had not already provided — and trade part of it for something that returns more: thirty minutes of practice, of project work, or of plain, undefended sleep.",
          "Keep swaps small and honest. Nobody is being asked for a monastic schedule; the plan that survives contact with real life is the one that still contains a life inside it. One good swap a week, actually kept, will quietly buy back a hundred hours across a year — and every hour bought back is an hour aimed on purpose.",
        ],
        callout: {
          title: "Try it this week",
          text: "Log tomorrow honestly — just the blocks, nothing fancier. Add them up and demand a total of twenty-four. Then circle one swap: thirty minutes out of a low-value block, given to something you genuinely want to grow. Execute the swap once, at a written time, and observe how the day feels when one piece of it was spent on purpose.",
        },
      },
    ],
    drill: {
      title: "Log a day, spot a swap",
      intro: "Meet Sam's Tuesday, already logged. Read the log carefully, answer each question in your head, then compare with the model read. Same numbers — the skill is in what you notice.",
      modelLabel: "The read",
      items: [
        {
          statement: "The log: school 7 hours, sleep 8, homework 1, soccer practice 1.5, meals and family 2, games and scrolling 3, getting ready and travel 1.5. Where did the day go?",
          model: "The blocks add to 24 — the day is fully spent, like every day. The surprise hiding in plain sight is the 3 hours of games and scrolling: more than homework and practice combined. Nothing to feel bad about — but now it is visible, and what is visible can be planned.",
        },
        {
          statement: "Find one swap that buys 30 minutes a day for the science project — without touching sleep, school, or practice.",
          model: "Take 30 minutes from the 3-hour games-and-scrolling block. Everything protected stays protected, the project gains a daily half hour — three and a half hours a week — and there are still 2.5 hours of games. A swap, not a sacrifice.",
        },
        {
          statement: "Now give tomorrow's science project a real home on the schedule. What exactly do you write down tonight?",
          model: "Write it as a block with a clock time: '4:30–5:00 — science project, before games.' A block on the schedule is a plan; 'sometime tomorrow' is a hope. Numbered days get planned in ink, not wishes.",
        },
      ],
    },
    quiz: [
      {
        question: "Sam's log: games and scrolling 3 hours, homework 40 minutes, project untouched for a week. Best first response?",
        answers: ["Cut all games until the project is finished", "Add an hour of homework every single night", "Swap 30 minutes of scrolling for project time", "Sleep less on school nights to free an hour"],
        correct: 3,
        explanation: "Aim one small, keepable swap at the largest low-value block. Punishment schedules collapse by Thursday, and sleep is a protected block, not a funding source.",
        timeLimit: 20,
      },
      {
        question: "Two plans: “homework sometime” vs “5:00–5:30, math, at the desk.” Why does the second actually happen?",
        answers: ["It names a time, task, and place to start", "It uses numbers, and numbers feel stricter", "It is longer, so it looks more serious overall", "It promises the homework will be enjoyable"],
        correct: 1,
        explanation: "A written block turns a decision into an appointment: at 5:00, starting needs no new willpower. “Sometime” leaves it to your most tempted self.",
        timeLimit: 20,
      },
      {
        question: "A student's logged blocks total 26 hours for one day. What has the log just revealed?",
        answers: ["The student is unusually productive and fast", "Some blocks were double-counted or guessed", "The day contained more time than most days", "Logging is useless for this particular student"],
        correct: 2,
        explanation: "A day holds twenty-four hours, so a 26-hour total proves guesses or overlaps in the log. Correcting the count is the log doing its job.",
        timeLimit: 20,
      },
      {
        question: "Which block should a numbered day defend FIRST when the schedule gets squeezed?",
        answers: ["The games block, since rest prevents burnout", "The homework block, moved into late evening", "The extra scrolling block, kept out of habit", "The sleep block, since everything runs on it"],
        correct: 4,
        explanation: "Sleep powers every other block; borrowing from it taxes school, practice, and patience at once. Boulders are placed first and moved last.",
        timeLimit: 20,
      },
      {
        question: "People who “find time” are really doing what, according to this module?",
        answers: ["Assigning hours on paper before the day starts", "Working faster than everyone around them", "Cutting out everything enjoyable in the day", "Waking earlier than the rest of the household"],
        correct: 1,
        explanation: "Time is assigned in advance, in writing — never found lying around. The assignment, not speed or alarm clocks, is what makes the hours appear.",
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
    intro: "A messy space is not a character flaw; it is usually a missing system, because things without homes wander. This module treats organization as what it actually is — a thinking tool — since a mind busy rummaging for its own equipment has measurably less of itself left for the work the equipment was for.",
    sections: [
      {
        heading: "Joseph's warehouses",
        paragraphs: [
          "In Genesis 41, Pharaoh dreams of seven fat cows and seven thin ones, and Joseph explains the meaning: seven years of plenty are coming, followed by seven years of famine. Joseph's celebrated plan is, at its heart, an organization plan: during the good years, gather the grain, store it city by city, counted and kept under guard — so that when the famine years arrive, Egypt is ready instead of desperate.",
          "Notice that nothing in the plan is magical. It is bins, counts, and assigned places, maintained faithfully for seven years. History remembers it as the reason an entire nation ate. Order, installed quietly and early, is one of the strongest tools a thinker owns — and Scripture's own instruction about how things should be conducted points the same direction: decently, and in order.",
        ],
        verse: {
          text: "But all things should be done decently and in order.",
          reference: "1 Corinthians 14:40 (ESV)",
        },
      },
      {
        heading: "Why order helps you think",
        paragraphs: [
          "Every search charges you something real: minutes, certainly — but also attention, calm, and momentum. The student who burns ten minutes hunting for a charger, a folder, and a permission slip begins homework already drained, and the thinking suffers before the first problem has even been read.",
          "'A place for everything' does not mean a showroom. It means that every object you use regularly has exactly ONE home, which you can name without thinking — the way you can name where your shoes sleep. When a thing has no home, you become its home instead: your memory carries it, your eyes keep tripping over it, and your brain pays rent on it all day long.",
          "A system you can trust pays that rent back to you. The minutes saved here and there matter less than the quiet: everything resting in its place means your attention is free for questions, claims, roots, and loops — the genuine work of this course.",
        ],
      },
      {
        heading: "Build a system in four moves",
        paragraphs: [
          "Move one: dump and sort. Take ONE pile — a backpack, a desk, a gear bin — empty it completely, and group what comes out by the job it performs: school, sports, tools, tech, papers. You cannot design a home for a pile you have never honestly sorted, which is why the dump is not optional.",
          "Move two is the sorting itself: group by job, ruthlessly, including the awkward items. Move three: give each group exactly one home, positioned as close as possible to where the group is actually used — hooks where the bag lands, the charger where the phone sleeps. Move four: label it like you mean it. A label sounds childish until a tired Tuesday arrives; labels are precisely how a system survives tired Tuesdays.",
          "Four moves, one pile at a time. A whole room is a weekend project; a backpack is twenty minutes — and twenty honest minutes of system-building outweigh a grand reorganization that is always scheduled for someday and never begun.",
        ],
      },
      {
        heading: "Keep it alive",
        paragraphs: [
          "Systems rarely die in a collapse; they erode at the edges. Two small habits keep one alive. First, the drop zone: one basket or tray near the door where new chaos is explicitly ALLOWED to land — emptied and sorted twice a week, so the edges of the system have a border instead of a breach. Second, the two-minute reset: before dinner or bed, return five things to their homes. Two minutes of maintenance, daily, outperforms a heroic purge staged twice a year.",
          "And when a system fails anyway, treat the failure the way Module 6 taught you: check honestly, identify the step that broke, fix that step, and loop. The system exists to serve you. You do not exist to serve the system.",
        ],
        callout: {
          title: "Try it this week",
          text: "Build one small system this week — the backpack, the desk, or the sports bag. Dump it, sort it by job, assign one home per group, and label the homes. Take a before photograph and an after photograph for yourself. The after photograph is the evidence your future self will need on the day the system looks impossible to maintain.",
        },
      },
    ],
    drill: {
      title: "Design the system: the backpack",
      intro: "One backpack, currently carrying: textbooks, gym shoes, a lunchbox, loose papers, a charger, a water bottle, and three pens of unknown status. Walk the four moves with it — decide each step, then compare with the model design.",
      modelLabel: "The design",
      items: [
        {
          statement: "Move one: what do you do first, before choosing pockets or buying anything?",
          model: "Dump and sort. Empty the whole bag and group by job: school books, gym gear, food, papers, tech. Three pens get tested on the spot — dead ones leave. You cannot design a home for a pile you have not sorted.",
        },
        {
          statement: "Now give each group exactly one home inside the same bag.",
          model: "Books in the large pocket, flat against your back. Papers in one folder in the middle pocket — the same folder that ended the vanishing-homework chain in Module 5. Gym shoes in the front pocket. Charger, coiled, in the small pocket. Water bottle in the side sleeve. Every group, one address.",
        },
        {
          statement: "A week later, the front pocket holds receipts, a broken pencil, and a mystery key. Is the system broken?",
          model: "No — it needs its maintenance: a two-minute reset. Front pocket goes back to gym gear only, the pencil leaves, and the key gets a real home or a question mark in the drop zone. Systems are kept, not just built.",
        },
      ],
    },
    quiz: [
      {
        question: "Marta's desk system worked for a month, then papers crept back. The response this module prescribes is…",
        answers: ["a two-minute reset — systems are maintained", "a full weekend purge, bigger than the first", "new containers, since the old ones failed", "accepting that systems don't suit her style"],
        correct: 1,
        explanation: "Systems fade by erosion at the edges, and maintenance is the cure. A purge treats an upkeep problem as a construction problem, at weekend prices.",
        timeLimit: 20,
      },
      {
        question: "The backpack holds books, gym gear, papers, and tech in one mixed pile. Move one of the system is…",
        answers: ["buy a larger backpack with more pockets", "label the single pocket with four tidy labels", "empty it fully; group items by their job", "throw away anything not used this month"],
        correct: 3,
        explanation: "Dump and sort precedes pockets and labels: every later move depends on seeing the pile grouped by job. Designing first means designing blind.",
        timeLimit: 20,
      },
      {
        question: "Why does a thing without a home end up 'renting space' in your head all day?",
        answers: ["Because untidy rooms are always distracting", "Because labels are missing from the drawer", "Because your eyes prefer organized things", "Your memory must track what no system holds"],
        correct: 4,
        explanation: "What no system holds, memory and attention carry instead — noticed repeatedly, searched for repeatedly. The rent is paid in thinking power.",
        timeLimit: 20,
      },
      {
        question: "A drop zone by the door fills faster than it gets emptied. The loop-minded fix is to…",
        answers: ["ban the drop zone and forbid all landing there", "buy a second, larger drop zone this week", "find why it overflows; adjust the routine", "empty it once a year in a full cleanout"],
        correct: 3,
        explanation: "Check the failing step instead of enlarging it: the emptying rhythm may be too rare for the traffic, or the zone sits at the wrong doorway.",
        timeLimit: 20,
      },
      {
        question: "Joseph's grain plan is this module's model mainly because it shows order as…",
        answers: ["a way to impress Pharaoh with neat stores", "work that only kings and officials can do", "proof that hoarding supplies is always wise", "preparation installed before the crisis came"],
        correct: 4,
        explanation: "The plan's genius was timing: counted stores built in the plenty for a famine nobody could yet see. Order installed early is what readiness means.",
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
    intro: "Feelings are real, and they are genuinely useful — like the warning lights on a dashboard. But a dashboard light has never driven a car anywhere worth going. This module is about the pause that lives between feeling something strongly and doing something quickly, because headlines, applications, and advertisements are all professionally built to close that gap before your judgment wakes up.",
    sections: [
      {
        heading: "Hold it back",
        paragraphs: [
          "Proverbs draws the contrast inside a single line: the fool gives full vent to his spirit — everything he feels comes straight out, at full volume and full speed — but the wise man quietly holds it back. Read the line carefully: the wise man HAS a spirit, has feelings, has reactions in full. He simply holds them long enough for thought to arrive before they are allowed to drive.",
          "That is the entire module compressed into one sentence. Feelings are not the enemy of clear thinking. Speed is. A reaction that waits ten seconds for a clear head is the same feeling — with a driver in the seat.",
        ],
        verse: {
          text: "A fool gives full vent to his spirit, but a wise man quietly holds it back.",
          reference: "Proverbs 29:11 (ESV)",
        },
      },
      {
        heading: "Information, not instructions",
        paragraphs: [
          "Treat a strong feeling the way you would treat a dashboard light: it reports something; it does not steer. A surge of excitement during a product video is information — this presentation was DESIGNED to excite me — not an instruction reading 'buy it now.' A jolt of alarm beneath a headline is information — look closer at this — not proof that the event happened exactly as the headline screamed it.",
          "Even the spike of outrage at a referee's call is information: the stakes feel high to you, and your particular angle from the bench may be concealing part of the play. The feeling completed its reporting job in half a second. Everything that happens next belongs to the rest of you: questions, sources, evidence — the tools you already own.",
          "Feelings report. Reason decides. Actions follow the decision — never the spike.",
        ],
      },
      {
        heading: "Built to make you react",
        paragraphs: [
          "It helps considerably to know that the pressure you feel is manufactured. Applications and headlines earn their keep from speed: your tap before you think, your share before you check, your purchase before the pause has a chance to form. That is why the vocabulary of urgency never sleeps — act now, last chance, everyone is buying, you will not believe number four.",
          "Urgency is a design choice, and noticing the design is half the defense against it. When a post makes your thumb move faster than your brain, that is not your personality failing a test. That is a machine operating exactly as it was built — and a machine can be declined.",
          "Sports supply the cleanest picture available: a call that looks outrageous in the final minute looks measurably different on the replay an hour later. Both views were views of the same play. The only thing that changed was time. The pause is where your replay lives.",
        ],
      },
      {
        heading: "The pause routine",
        paragraphs: [
          "When the spike hits, run four steps. STOP: hands off the screen, the button, the send key. BREATHE: one slow breath out — ten seconds is plenty, and it is remarkable what ten honest seconds can do. CHECK: run the tools you already know — who is the source (Module 3), and what exactly is the claim, with what proof (Module 4)? CHOOSE: now act — share it, buy it, answer it, or skip it — deliberately, on purpose.",
          "Practice the routine on small things, while nothing is at stake: an exciting video, a surprising post, a debatable call in a game you are merely watching. A routine practiced at low stakes is the routine that will be available at high stakes. Nobody rises to the occasion; everybody falls back on their practice.",
        ],
        callout: {
          title: "Try it this week",
          text: "Once a day this week, catch one spike — an exciting video, a shocking headline, a tempting offer — and run the full routine out loud: stop, breathe, check, choose. Four steps, ten seconds. Pay attention to how frequently the choice at the end differs from the impulse at the beginning; that difference is the routine paying you.",
        },
      },
    ],
    drill: {
      title: "Run the pause",
      intro: "Three everyday spikes. For each one, walk the routine — stop, breathe, check, choose — and decide what the checked version of you would do. Then compare with the model.",
      modelLabel: "The pause, run",
      items: [
        {
          statement: "A post screams: 'BREAKING — your favorite game is being banned next week!' Your thumb is already moving toward share.",
          model: "Stop. Breathe. Check: who posted this — the game's own site, or an unnamed page? Search the claim in one other place. Ninety seconds later you will know whether you are sharing news or sharing a hook.",
        },
        {
          statement: "A video shows a gadget and repeats, 'Only a few left — link below!' Your savings jar suddenly seems very interesting.",
          model: "Stop. Breathe. Check: is 'a few left' a fact, or a claim in a costume (Module 4)? Choose with the jar in mind: let it sit 24 hours. A good buy tomorrow is still a good buy. A pressured buy usually is not.",
        },
        {
          statement: "The referee calls a foul on your teammate in the last minute, and half the bench is on its feet.",
          model: "Stop. Breathe. Check: what did you actually see, and what might your angle have hidden? Choose: play the next minute as well as you can. The call will not change. Your next play can. Feelings reported the stakes — they do not get the whistle.",
        },
      ],
    },
    quiz: [
      {
        question: "A post claims your favorite game is 'being banned Friday' and begs for shares. Your thumb is moving. Run the routine:",
        answers: ["Share first — you can always delete it later", "Comment angrily at the account that posted it", "Ask three friends whether they have heard it", "Stop, then check the game's official channels"],
        correct: 4,
        explanation: "Stop interrupts the thumb; check sends the claim to the game's own channels, where a ban would be announced. Sharing first still publishes it to everyone who saw it.",
        timeLimit: 20,
      },
      {
        question: "A training-shoe video leaves you certain you need the shoes tonight. That certainty is best treated as…",
        answers: ["proof the shoes will improve your running", "information: the video was built to excite", "a sign the shoes are priced fairly today", "instructions your budget must obey at once"],
        correct: 2,
        explanation: "The feeling reported accurately: the video worked on you as designed. Information gets examined; instructions get obeyed. Keeping those separate is the module.",
        timeLimit: 20,
      },
      {
        question: "Why does urgency language ('last chance!') deserve suspicion all by itself?",
        answers: ["Urgent offers are always more expensive", "Honest sellers are never in any hurry", "Honest products never need quick decisions", "It is designed to outrun your checking step"],
        correct: 4,
        explanation: "Urgency's function is mechanical: shrink the gap between feeling and action until no check can fit inside it. Noticing the design restores the pause that the design was built to remove.",
        timeLimit: 20,
      },
      {
        question: "At a game, a call enrages the bench. The CHECK step, applied to the call itself, asks…",
        answers: ["how loudly the crowd can protest the call", "whether the referee should be replaced this season", "what you truly saw, and what your angle hid", "who on the bench feels angriest about it"],
        correct: 3,
        explanation: "Checking a call audits your own evidence: sightline, distance, the angle a replay would show. Protest volume is the spike talking, not the check.",
        timeLimit: 20,
      },
      {
        question: "The pause routine works at high stakes mainly because it was…",
        answers: ["memorized as four words in the right order", "practiced repeatedly when stakes were small", "invented for referees and game officials", "designed to suppress every strong feeling"],
        correct: 2,
        explanation: "Under pressure, people do not rise to the occasion; they fall back on their practice. Small-stakes repetitions install the routine so that it is available on the day it actually matters.",
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
    intro: "Some arguments attempt to win honestly, on evidence. Others attempt to win quickly, on technique. This module names three of the most common tricks — the straw man, the cherry-picked number, and the either/or squeeze — so that you can spot them operating inside advertisements, posts, and debates before they carry you somewhere you never agreed to go.",
    sections: [
      {
        heading: "Seems right — until examined",
        paragraphs: [
          "Proverbs saw it coming thousands of years before the internet existed: the first person to state a case sounds entirely right — until somebody else arrives and examines him. Every trick in this module depends for its survival on the same hope: that you will never be the one who examines.",
          "Tricks are not always deployed by villains. They are the standard equipment of advertisements, arguments, and posts, because they work quickly and examining takes a minute. Your defense is therefore not suspicion of everybody. It is a short list of names. A trick you can name is a trick that has already lost most of its power over you.",
        ],
        verse: {
          text: "The one who states his case first seems right, until the other comes and examines him.",
          reference: "Proverbs 18:17 (ESV)",
        },
      },
      {
        heading: "Trick one: the straw man",
        paragraphs: [
          "A straw man argument attacks something nobody actually said. Somebody proposes changing a single rule about hats in the cafeteria, and the reply arrives instantly: 'So you think school should have NO rules at all?' Nobody said that — but the invented version is soft, extreme, and wonderfully easy to knock flat, like a man constructed out of straw for the purpose of falling over.",
          "Watch for the tell: the reply is dramatically more extreme than the claim it purports to answer. The defense is calm and short: 'That is not the claim. The claim is one rule, changed.' Name the genuine claim, return the argument to it, and allow the straw man to fall over on its own, unassisted.",
        ],
      },
      {
        heading: "Trick two: cherry-picked numbers",
        paragraphs: [
          "Cherries are sweet — and a number selected the way you select cherries, choosing only the prettiest specimens, can be perfectly true and perfectly misleading at the same time. 'Sales doubled this year!' From one box to two boxes: entirely true, and not remotely the story. 'Winners of four of the last five!' — announced by a team whose full season, examined whole, quietly tells a different one.",
          "The boldest version of the trick lives inside charts. Draw a chart whose scale begins at 85, and a score of 92 towers over a score of 90 like a skyscraper over a cottage. The numbers are perfectly real. The picture is bent. The defense is a single question: may I see the whole orchard — the complete chart, the full season, the honest starting point?",
        ],
      },
      {
        heading: "Trick three: the either/or squeeze",
        paragraphs: [
          "'You are either with us or against us.' 'Buy the premium version, or settle for junk.' Two doors get painted onto the wall, and every other door in the building quietly disappears from view. That is the either/or squeeze: a menu of two, served with confidence as though it were the entire restaurant.",
          "Reality generally holds more doors: with you on this AND undecided about that; the standard version; an entirely different brand; waiting a month and deciding with better information. The defense is one question, asked pleasantly: 'What are the other options?' You will be astonished how often the third door was standing there the whole time — and how quickly the squeeze collapses the moment somebody asks.",
        ],
        callout: {
          title: "Try it this week",
          text: "Spot one trick operating in the wild this week — inside an advertisement, a post, a chart, or a debate — and name it out loud: straw man, cherry-picked, or either/or. Naming it is the skill itself; everything after the naming is cleanup. Keep a tally as the week goes on. The orchard is considerably larger than you think.",
        },
      },
    ],
    drill: {
      title: "Name the trick",
      intro: "Three short claims, three tricks. For each one, do two jobs: name the trick, and write the question that exposes the whole picture it was hiding. A trick named is weakened; a trick questioned is disarmed. Compare both halves with the model answers.",
      items: [
        {
          statement: "An ad announces: 'Our juice has 50% less sugar than the leading cola!' The juice is being compared with a cola — not with other juices.",
          model: "Cherry-picked comparison. The number may be perfectly true, but the partner was selected to flatter it — cola was never this juice's real competition. The exposing question: 'How does this juice compare with other juices, sugar for sugar?' Demand the fair comparison, and the impressive number shrinks to its honest size.",
        },
        {
          statement: "A chart shows Team A's bar towering over Team B's — but the chart's scale starts at 85 points, and the real scores are 92 and 90.",
          model: "The cut-off axis. A two-point gap has been dressed as a landslide by hiding the bottom of the chart, where the bars honestly begin. The exposing question: 'May I see the full chart, starting at zero?' Watch the mountain shrink into a step the moment the whole picture is restored.",
        },
        {
          statement: "In a debate, one student says: 'My opponent wants our school to have no rules at all!' The opponent had proposed changing one rule about hats.",
          model: "Straw man. A small, specific proposal — one rule, changed — has been rebuilt into an extreme one that collapses easily. The exposing move is a restatement: 'What did the opponent actually propose?' Drag the argument back to the real claim, and the straw man falls without being touched.",
        },
      ],
    },
    quiz: [
      {
        question: "“Our cereal has half the sugar of the leading candy bar!” The first move of a clear thinker is to…",
        answers: ["congratulate the cereal on a healthy recipe", "check whether the claim's numbers are exact", "ask why candy is the comparison partner", "assume the claim must be entirely invented"],
        correct: 3,
        explanation: "The comparison partner is where the trick lives: candy flatters almost anything. The fair test — cereal against cereals — is what the ad declined to show.",
        timeLimit: 20,
      },
      {
        question: "In a debate, Ana proposes one later lunch period. Ben replies, “Ana wants no schedule at all!” Name it, and the reply.",
        answers: ["Either/or squeeze; ask for the third option", "Straw man; restate the actual proposal made", "Cherry-pick; demand the full season record", "Cut-off axis; ask to see the chart from zero"],
        correct: 2,
        explanation: "Ben replaced a modest proposal with an extreme invention built to fall — a straw man. The disarming reply restates what Ana actually proposed and returns the debate to the real claim.",
        timeLimit: 20,
      },
      {
        question: "A chart shows recycling 'soaring' — 41% last year, 44% now, on a scale running 40 to 45. The honest chart…",
        answers: ["starts at zero, where the change looks small", "uses taller bars to show the change better", "omits last year to keep the picture simple", "starts at 40 so the rise is easy to notice"],
        correct: 1,
        explanation: "The cropped scale manufactures a landslide out of a three-point step. Drawn from zero, the same true numbers tell their true size — an improvement that is honestly small and honestly real.",
        timeLimit: 20,
      },
      {
        question: "“Either buy the pro controller, or play at a disadvantage forever.” The hidden move in this squeeze is…",
        answers: ["the price of the controller is being hidden", "the word 'forever' is doing all the work here", "the controller's quality is being exaggerated", "every other option is quietly being removed"],
        correct: 4,
        explanation: "The squeeze serves two options as though they were everything. Standard gear, other brands, borrowing, and waiting vanish until somebody asks for them back.",
        timeLimit: 20,
      },
      {
        question: "“Winners of 4 of our last 5 matches!” says the poster for a team that finished the season 6–14. The number is…",
        answers: ["false: a 6–14 team cannot have won four", "true but cherry-picked from a rough season", "proof the team peaked at exactly the right time", "an either/or squeeze aimed at new recruits"],
        correct: 2,
        explanation: "Every word can be accurate while the selection misleads: five chosen matches standing in for twenty played. The defense is the whole orchard — the full record.",
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
    intro: "Twelve modules, one aim: to think the way Jesus thought — carefully, fairly, and humbly, holding truth in one hand and kindness in the other. This final module pulls the whole toolbox together onto one real job, in the combinations you will actually use them, because in real life the tools never arrive one at a time.",
    sections: [
      {
        heading: "Check yourself first",
        paragraphs: [
          "Jesus warned about the comedy of a man with a log protruding from his own eye offering to extract a speck from his brother's. The point is not 'never judge' — in John 7 he explicitly commands right judgment. The point is order: first remove the log from your own eye, and THEN you will see clearly enough to help with the speck.",
          "For a thinker, that order is everything. Before grading somebody else's claim, run your own convictions through the identical tests you have been practicing all course: Would I accept this quality of evidence if it came from the other side? Did I check MY source with the same suspicion? Is there a log — a wish, a habit, a headline swallowed whole — currently sitting in my own eye? Humility is not weakness in thinking. It is accuracy about the thinker.",
        ],
        verse: {
          text: "First take the log out of your own eye, and then you will see clearly to take the speck out of your brother's eye.",
          reference: "Matthew 7:5 (ESV)",
        },
      },
      {
        heading: "The whole toolbox, together",
        paragraphs: [
          "Look at what you are carrying now. Ask better questions, and park the ones you cannot yet answer (Module 1). Sort every statement you meet: fact, opinion, or needs checking (Module 2). Check the source before you share anything — who is speaking, what do they want, where else does it stand (Module 3). Spot the claim and demand its evidence, remembering that together is not because (Module 4).",
          "When a problem keeps returning, ask why five times until the root shows itself (Module 5). Improve anything at all with the loop: plan it, try it, check it, fix it (Module 6). Sort your work by what it matters and what it takes (Module 7). Number your days and plan tomorrow tonight, on purpose (Module 8).",
          "Give everything you use a home you can trust without thinking (Module 9). When the emotional spike arrives, stop, breathe, check, and only then choose (Module 10). And name the trick whenever an argument bends the truth for advantage — straw man, cherry-picked, either/or (Module 11). Eleven tools in total. They were never eleven separate subjects competing for your memory. They are a single way of paying attention to the world, divided into lessons only so that it could be learned.",
        ],
      },
      {
        heading: "The case: fix the fun-run",
        paragraphs: [
          "Now put the entire toolbox to work on one realistic job. Your school's annual fun-run requires rescuing: last year the paper signup list was lost twice, thirty runners never received the shirts they had ordered, and an incorrect rumor about the date chased families for an entire week. The organizing team — students, precisely like you — begins exactly where this course begins: with questions, asked before any solutions are proposed. What exactly went wrong last year? Who physically kept the list, and where was it kept? What did the runners actually need that nobody arranged to provide?",
          "Then the team digs. Why was the list lost? Because it was paper, carried in a bag. Why did a single loss matter so much? Because no copy existed anywhere. Why not? Because one person held it, alone, with no backup and no home base. The root is not 'be more careful' — it is a missing system. The fix follows from the root: one shared signup list with a named keeper, a photographed backup, and a fixed home at the club table (Modules 5 and 9).",
          "Inevitably, a claim arrives demanding to be tested: 'Nobody signed up last year because the run was boring.' The team sorts it before touching anything else (Module 2): the official count records eighty-four registered runners — which is not nobody, however it felt at the time — and 'boring' is an opinion, which deserves to be heard properly through three short questions printed on the signup form, rather than repeated as a verdict (Modules 3 and 4). The date rumor, meanwhile, is checked at its authoritative source, the school office, before anybody repeats it to another family (Modules 3 and 10).",
        ],
      },
      {
        heading: "Running the job, and the point of it all",
        paragraphs: [
          "The task list receives the four boxes (Module 7): the route permit and the shirt order are Plan Well; water stations become Do First the moment the route is settled; poster polish is Do If Time; a drone video is a cheerful Maybe Skip. Jobs are dealt into dated time blocks across four weeks (Module 8), and the new signup system gets a trial run first — one lunch period, one table, checked honestly, fixed, and only then launched to the whole school (Module 6). Eighty-four runners become a hundred and ten, every one of them wearing a shirt that fits.",
          "That is what thinking clearly is FOR. Not winning arguments — a fun-run is not an argument. It is for loving people well with a prepared mind: runners receive a day that works because somebody asked, checked, dug, sorted, planned, and paused at the right moments. Jesus asked questions that stopped crowds mid-sentence, saw cleanly through traps constructed for him, and always knew which thing mattered first. Think like that, and you will be useful absolutely everywhere you go.",
        ],
        callout: {
          title: "You are ready for the final test",
          text: "Complete all twelve modules and the final test unlocks: one question from every module, each one asking you to use the tool rather than name it, and a printable certificate carrying your name. The certificate is only paper. The toolbox — carried in your head, available on your worst day — is the real graduation.",
        },
      },
    ],
    drill: {
      title: "Run the whole toolbox: the fun-run fix",
      intro: "The case from the lesson, step by step. For each step, name the tools the team is using before you open the model answer. Most steps use more than one.",
      modelLabel: "The toolbox at work",
      items: [
        {
          statement: "Step 1: Last year's signup list was lost twice and 30 runners missed their shirts. The team refuses to just 'try harder.' Where do they start?",
          model: "With questions and digging (Modules 1 and 5). Why was the list lost: paper. Why did it matter: no copy. Why not: one keeper, no system. The root fix is a system (Module 9) — one shared list, a photo backup, one named keeper — not a sterner warning about carefulness.",
        },
        {
          statement: "Step 2: A parent says, 'Nobody came last year because the run was boring.' How does the team handle the claim?",
          model: "Sort it (Module 2): 'nobody came' is a checkable claim — the count was 84, so not nobody. 'Boring' is an opinion: worth hearing, not printing as fact. The team asks for evidence and better information (Modules 3 and 4) — three short questions on this year's signup form.",
        },
        {
          statement: "Step 3: The job list is long — route permit, shirts, water stations, posters, rain plan, music, medals — and the run is in four weeks. How does the team run it?",
          model: "First things first (Module 7): permit and shirts are Plan Well; water stations, Do First once the route is set; poster polish, Do If Time. Jobs get dated blocks (Module 8), and the signup is trialled at one lunch table, checked, and fixed before launch (Module 6) — one calm month instead of one chaotic week.",
        },
      ],
    },
    quiz: [
      {
        question: "Fun-run entries doubled, but shirt orders used last year's list, so 20 runners lack shirts. First tool to reach for?",
        answers: ["The four boxes: sort the shirt problem first", "Ask why: why did ordering use a stale list?", "The pause routine: calm the shirt queue down", "Spot the trick: someone's numbers misled you"],
        correct: 2,
        explanation: "A failure repeated across years is a recurring problem, and those get dug, not sorted. Why the stale list was used leads down to the missing system: the root.",
        timeLimit: 30,
      },
      {
        question: "Before the debate, you discover your favorite argument rests on a chart you never examined. The log-first move is to…",
        answers: ["use it anyway; the other side does the same", "attack the opposing chart twice as hard", "examine your own chart before using it", "memorize more verses to win the exchange"],
        correct: 3,
        explanation: "Matthew 7 sets the order: your own evidence passes your own tests first. A chart you would shred from the other side earns no respect on yours.",
        timeLimit: 20,
      },
      {
        question: "A rumor says the fun-run date moved. The team checks the school office before replying. Which pair of tools is that?",
        answers: ["Check the source, with the pause routine", "Ask why five times, with the four boxes", "Sort the statement, with a place for everything", "Number your days, with the improvement loop"],
        correct: 1,
        explanation: "The office is the closest source to the decision (Module 3), and checking before repeating is the pause doing its work (Module 10). The rumor gets examined instead of forwarded.",
        timeLimit: 20,
      },
      {
        question: "Which single habit from the course would have prevented the MOST of last year's fun-run failures?",
        answers: ["Sorting every statement made at meetings", "Asking why five times after the event ended", "Running the signup as a checked system", "Numbering the days of the planning month"],
        correct: 3,
        explanation: "The lost list, missing copies, and shirt chaos were one failure in three costumes: no system owned the signup. A keeper and a backup prevent all three at the root.",
        timeLimit: 20,
      },
      {
        question: "Thinking like Jesus, applied to a heated disagreement about a school policy, looks most like…",
        answers: ["test your own side first, then listen fairly", "winning the exchange with the sharpest reply", "avoiding any judgment about the policy entirely", "quoting the most verses until the room agrees"],
        correct: 1,
        explanation: "Log first, then right judgment: your own claims pass your own tests, the other side gets examined rather than caricatured, and the truth is pursued with humility instead of volume.",
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
