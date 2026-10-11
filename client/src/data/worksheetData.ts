// Grade-level spelling word lists (Dolch-based, public domain) + original reading passages

export const SPELLING_WORDS: Record<string, string[]> = {
  K: ["a", "and", "away", "big", "blue", "can", "come", "down", "find", "for", "funny", "go", "help", "here", "I", "in", "is", "it", "jump", "little", "look", "make", "me", "my", "not", "one", "play", "red", "run", "said", "see", "the", "three", "to", "two", "up", "we", "where", "yellow", "you"],
  "1": ["all", "am", "are", "at", "ate", "be", "black", "brown", "but", "came", "did", "do", "eat", "four", "get", "good", "have", "he", "into", "like", "must", "new", "no", "now", "on", "our", "out", "please", "pretty", "ran", "ride", "saw", "say", "she", "so", "soon", "that", "there", "they", "this", "too", "under", "want", "was", "well", "went", "what", "white", "who", "will", "with", "yes"],
  "2": ["after", "again", "an", "any", "as", "ask", "by", "could", "every", "fly", "from", "give", "going", "had", "has", "her", "him", "his", "how", "just", "know", "let", "live", "may", "of", "old", "once", "open", "over", "put", "round", "some", "stop", "take", "thank", "them", "then", "think", "walk", "were", "when"],
  "3": ["always", "around", "because", "been", "before", "best", "both", "buy", "call", "cold", "does", "fast", "first", "five", "found", "gave", "goes", "green", "its", "made", "many", "off", "or", "pull", "read", "right", "sing", "sit", "sleep", "tell", "their", "these", "those", "upon", "us", "use", "very", "wash", "which", "why", "wish", "work", "would", "write", "your"],
  "4": ["about", "better", "bring", "carry", "clean", "cut", "done", "draw", "drink", "eight", "fall", "far", "full", "got", "grow", "hold", "hot", "hurt", "if", "keep", "kind", "laugh", "light", "long", "much", "myself", "never", "only", "own", "pick", "seven", "shall", "show", "six", "small", "start", "ten", "today", "together", "try", "warm"],
  "5": ["apple", "balloon", "bridge", "candle", "cloud", "dance", "eagle", "field", "garden", "happy", "island", "jungle", "kite", "laugh", "magic", "mountain", "music", "ocean", "paint", "quiet", "river", "song", "table", "tiger", "uncle", "valley", "water", "window", "young", "zebra", "bread", "chair", "dream", "earth", "feast", "grain", "harbor", "ivory", "journey", "kneel"],
  "6": ["analyze", "ancient", "beauty", "cause", "compare", "courage", "decide", "describe", "divide", "energy", "explain", "faith", "glory", "honest", "idea", "journey", "kindness", "lesson", "mercy", "nation", "obey", "peace", "praise", "question", "reason", "search", "serve", "spirit", "study", "thankful", "truth", "understand", "value", "wisdom", "wonder", "yield", "zeal", "brave", "cheer", "duty"],
  "7": ["achieve", "adventure", "believe", "blessing", "character", "compassion", "creation", "defend", "devotion", "endure", "eternal", "forgive", "freedom", "gentle", "grace", "harvest", "honor", "humble", "integrity", "justice", "knowledge", "loyal", "miracle", "noble", "obey", "patient", "promise", "pure", "redeem", "respect", "sacrifice", "steadfast", "testimony", "trust", "unity", "virtue", "witness", "worthy", "yearn", "zealous"],
  "8": ["abundant", "adversity", "ambition", "blessed", "covenant", "diligent", "discern", "eloquent", "endurance", "faithful", "flourish", "genuine", "hallowed", "humble", "illuminate", "jubilant", "kindred", "liberty", "majesty", "meek", "nurture", "obedient", "persevere", "proclaim", "radiant", "rejoice", "reverent", "sanctuary", "sovereign", "steadfast", "sustain", "temperate", "thrive", "triumph", "upright", "valiant", "wholesome", "wisdom", "zeal", "abide"],
};

export interface ReadingPassage {
  id: string;
  title: string;
  gradeBand: string;
  text: string[];
  questions: { q: string; a: string }[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "sam-cat",
    title: "Sam and the Lost Cat",
    gradeBand: "K-1",
    text: [
      "Sam has a cat. The cat is big and gray.",
      "One day the cat ran away. Sam was sad.",
      "Sam looked in the yard. He looked in the barn.",
      "Then Sam heard a soft meow. The cat was in the tree!",
      "Sam got the cat down. He hugged it tight. Sam was glad.",
    ],
    questions: [
      { q: "What color is Sam's cat?", a: "Gray" },
      { q: "How did Sam feel when the cat ran away?", a: "Sad" },
      { q: "Where did Sam find the cat?", a: "In the tree" },
      { q: "What did Sam do when he got the cat down?", a: "He hugged it tight" },
    ],
  },
  {
    id: "garden-seeds",
    title: "The Garden Seeds",
    gradeBand: "K-1",
    text: [
      "Mia got some seeds. She put them in the dirt.",
      "She gave them water every day. She waited and waited.",
      "One morning she saw green sprouts! The seeds were growing.",
      "Soon there were red tomatoes. Mia shared them with her family.",
    ],
    questions: [
      { q: "What did Mia plant?", a: "Seeds" },
      { q: "What did she give the seeds every day?", a: "Water" },
      { q: "What grew in the garden?", a: "Red tomatoes (tomatoes)" },
      { q: "Who did Mia share the tomatoes with?", a: "Her family" },
    ],
  },
  {
    id: "brave-little-boat",
    title: "The Brave Little Boat",
    gradeBand: "2-3",
    text: [
      "Down by the river sat a little wooden boat. It had never sailed farther than the bend in the creek, and it dreamed of seeing the wide lake beyond the hills.",
      "One spring morning, the rains came and the creek rose high. The little boat bobbed and swayed, and before it knew it, the current carried it around the bend. Tall trees rushed past on both banks.",
      "The boat was frightened at first. The water splashed over its bow, and it creaked and groaned. But then it remembered what the old fisherman always said: \"A boat is safest in the harbor, but that is not what boats are for.\"",
      "So the little boat straightened its mast and rode the waves with courage. By sunset, it floated into the great lake, calm and golden. It had finally arrived — braver than it had ever been.",
    ],
    questions: [
      { q: "What did the little boat dream of seeing?", a: "The wide lake beyond the hills" },
      { q: "What carried the boat around the bend?", a: "The current (rising creek water)" },
      { q: "What did the old fisherman always say?", a: "\"A boat is safest in the harbor, but that is not what boats are for.\"" },
      { q: "How did the boat feel at first, and how did it feel at the end?", a: "Frightened at first, then brave/courageous" },
      { q: "What lesson does this story teach about courage?", a: "Accept any reasonable answer about facing fear / trying new things" },
    ],
  },
  {
    id: "honey-harvest",
    title: "The Honey Harvest",
    gradeBand: "2-3",
    text: [
      "Every summer, Mr. Abel opens his beehives to collect honey. He wears a white suit and a round hat with a veil, and he moves slowly so the bees stay calm.",
      "Inside each hive are frames full of golden honeycomb. The bees make the honey from flower nectar, flapping their wings to dry it out. A single hive can hold fifty pounds of honey!",
      "Mr. Abel spins the frames in a machine called an extractor. The honey flies out and drips down into buckets. Then he pours it into jars and gives one to every neighbor on his street.",
      "The bees do not mind sharing. They always make more than they need, and Mr. Abel always leaves plenty for the hive. \"Take care of the bees,\" he says, \"and the bees will take care of you.\"",
    ],
    questions: [
      { q: "Why does Mr. Abel wear a white suit and veil?", a: "To protect himself from the bees / so the bees stay calm" },
      { q: "How do bees make honey?", a: "From flower nectar, flapping their wings to dry it" },
      { q: "What is an extractor?", a: "A machine that spins the frames to get the honey out" },
      { q: "What does Mr. Abel do with the honey?", a: "Pours it into jars and gives one to every neighbor" },
      { q: "What rule does Mr. Abel follow about the bees?", a: "Take care of the bees, leave plenty of honey for the hive" },
    ],
  },
  {
    id: "lighthouse-keeper",
    title: "The Lighthouse Keeper's Storm",
    gradeBand: "4-5",
    text: [
      "In 1872, a lighthouse keeper named Thomas steadied his lamp as the worst storm in twenty years rolled toward the rocky coast. The wind howled through the tower, and waves crashed against the cliffs below.",
      "Thomas knew the ships at sea were counting on his light. If the lamp went out, sailors would have no warning of the hidden rocks. He climbed the winding stairs every two hours through the night, trimming the wick and polishing the great glass lens so the beam shone as bright as possible.",
      "Near midnight, a tremendous wave struck the lighthouse door and water poured into the lower room. Thomas did not leave his post. He stuffed cloth into the gap and kept climbing, kept trimming, kept shining.",
      "When dawn broke, the storm had passed. Out on the water, three ships rode safely at anchor — their captains had seen the light and steered clear of the rocks. Thomas was soaked and exhausted, but he smiled. The light had done its job.",
    ],
    questions: [
      { q: "Why was the lighthouse lamp so important during the storm?", a: "Ships needed the light to avoid the hidden rocks" },
      { q: "What did Thomas do every two hours?", a: "Climbed the stairs, trimmed the wick, polished the lens" },
      { q: "What happened near midnight?", a: "A wave struck the door and water poured in" },
      { q: "How did Thomas respond to the flooding?", a: "He stuffed cloth in the gap and stayed at his post" },
      { q: "What was the result of Thomas's faithfulness?", a: "Three ships were saved / guided safely" },
      { q: "What character quality did Thomas show? Give an example from the story.", a: "Faithfulness / courage / perseverance — accept reasonable answers with evidence" },
    ],
  },
  {
    id: "bridges",
    title: "How Bridges Stand Up",
    gradeBand: "6-8",
    text: [
      "A bridge looks simple — a road stretched across a gap — but every bridge is a careful balance of forces. The two most important forces are compression, which squeezes, and tension, which pulls.",
      "In an arch bridge, the curved shape pushes the weight of the bridge outward and down into the supports at each end. The stones or steel in the arch are squeezed together, and that squeezing — compression — actually makes the arch stronger. The ancient Romans built arch bridges that still stand today.",
      "A suspension bridge works the opposite way. Thick steel cables drape between tall towers, and the roadway hangs from the cables by vertical suspenders. The cables are pulled tight by the weight — that pulling force is tension. The towers press down into the ground, and massive concrete anchors at each end keep the cables from slipping.",
      "Engineers must also plan for movement. Bridges expand in summer heat and contract in winter cold, so they include expansion joints — small gaps that open and close. Wind is another challenge: after the Tacoma Narrows Bridge twisted apart in a 1940 windstorm, engineers began testing bridge designs in wind tunnels.",
      "The next time you cross a bridge, look for the pattern of forces. Every beam, cable, and arch is doing a job, holding its share of the load so the whole structure stands firm.",
    ],
    questions: [
      { q: "What are the two most important forces in a bridge?", a: "Compression (squeezing) and tension (pulling)" },
      { q: "How does an arch bridge carry weight?", a: "The curve pushes weight outward and down into the supports; compression makes it stronger" },
      { q: "In a suspension bridge, what creates tension?", a: "The weight of the roadway pulling the cables tight" },
      { q: "Why do bridges need expansion joints?", a: "Bridges expand in heat and contract in cold; the joints allow movement" },
      { q: "What happened to the Tacoma Narrows Bridge, and what changed afterward?", a: "It twisted apart in a 1940 windstorm; engineers began wind-tunnel testing" },
      { q: "Why might the author compare a bridge's parts to people 'doing a job'?", a: "Accept reasonable inference answers about teamwork / each part carrying its share" },
    ],
  },
];

export const GRADE_LABELS: Record<string, string> = {
  K: "Kindergarten",
  "1": "1st Grade",
  "2": "2nd Grade",
  "3": "3rd Grade",
  "4": "4th Grade",
  "5": "5th Grade",
  "6": "6th Grade",
  "7": "7th Grade",
  "8": "8th Grade",
};
