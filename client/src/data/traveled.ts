// TravelED destination data — "Travel + Education" guides for Christian families.
// Generated from traveled-drafts/destinations.json — do not edit by hand.

export interface TravelEdSite {
  name: string;
  description: string;
}

export interface StudyGuideSection {
  heading: string;
  content: string;
}

export interface TravelEdDestination {
  slug: string;
  name: string;
  state: string;
  stateName: string;
  tagline: string;
  heroImageUrl: string;
  heroImageCredit: string;
  whyItMatters: string;
  whatToSee: TravelEdSite[];
  bestAges: string;
  bestTimeToVisit: string;
  tripLength: string;
  beforeYouGo: string[];
  studyGuide: {
    title: string;
    sections: StudyGuideSection[];
  };
  faithConnection: string | null;
  seoTitle: string;
  seoDescription: string;
  targetKeywords: string[];
}

export const DESTINATIONS: TravelEdDestination[] = [
  {
    "slug": "washington-dc",
    "name": "Washington, D.C.",
    "state": "DC",
    "stateName": "District of Columbia",
    "tagline": "Stand where the country's story is told in marble.",
    "heroImageUrl": "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "There is no substitute for standing where it happened. Washington packs the whole American story into a few walkable miles, and kids who have only seen the Capitol on a screen tend to go quiet when they see it in person.\n\nStart with the paper trail. The actual Declaration of Independence, the Constitution, and the Bill of Rights sit under glass at the National Archives. Not replicas. The real documents, fading and all. Watching a ten-year-old lean in to find John Hancock's oversized signature does more for civics than a semester of worksheets.\n\nThen walk the memorials, because they do the teaching for you. Lincoln's Second Inaugural is carved into the wall of his memorial, all 703 words. The Vietnam Veterans Memorial lists more than 58,000 names, and children always ask why. The World War II Memorial's wall of gold stars stops teenagers mid-sentence.\n\nFaith is part of the furniture here, not an add-on. 'In God We Trust' hangs above the Speaker's chair in the House chamber. Chaplains have opened Congress in prayer since 1789. Lincoln's speeches are saturated with Scripture, and the Second Inaugural reads like a sermon. You don't have to force a devotional moment in D.C. Walk the Mall with your kids, and the questions will come on their own.",
    "whatToSee": [
      {
        "name": "The National Mall",
        "description": "Two miles of monuments and museums between the Capitol and the Lincoln Memorial. Go early, wear walking shoes, and pack snacks, because food options on the Mall itself are thin."
      },
      {
        "name": "National Archives Museum",
        "description": "See the Declaration, Constitution, and Bill of Rights in the Rotunda. Book a timed entry online to skip the line that wraps around the block."
      },
      {
        "name": "U.S. Capitol",
        "description": "Free tours run through the Capitol Visitor Center, but reserve through your House representative's website weeks ahead for the best time slots."
      },
      {
        "name": "Library of Congress",
        "description": "The Thomas Jefferson Building is the most beautiful interior in the city. Free timed tickets are worth it for the Main Reading Room overlook alone."
      },
      {
        "name": "Smithsonian National Museum of Natural History",
        "description": "Dinosaurs, the Hope Diamond, and the ocean hall. The single best bad-weather or tired-legs stop on the Mall, and it's free."
      },
      {
        "name": "National Air and Space Museum",
        "description": "The Wright Flyer, Lindbergh's Spirit of St. Louis, and Apollo 11's command module. Recently renovated and still the kids' favorite."
      },
      {
        "name": "Lincoln Memorial",
        "description": "Go at dusk when the crowds thin and the Reflecting Pool mirrors the monument. Read the Second Inaugural on the north wall together."
      }
    ],
    "bestAges": "Ages 8 and up get the most from the documents and memorials; younger kids will still love the museums, the carousel on the Mall, and the paddle boats at the Tidal Basin.",
    "bestTimeToVisit": "Late March to April for the cherry blossoms, or September to October for smaller crowds and easy walking weather. Summer is brutally hot, humid, and packed.",
    "tripLength": "Plan 3 to 4 days minimum. There is honestly a week of material here, so don't try to cram it into a weekend.",
    "beforeYouGo": [
      "Request a Capitol tour through your House representative's website. It's free, but the good slots go weeks out.",
      "Apply for White House tour tickets through your representative 2 to 3 months ahead. Not guaranteed, but worth asking.",
      "Watch National Treasure (2004) together, then spot the real locations as you walk the city.",
      "Read a 'Who Was?' biography of Lincoln or Washington so the memorials land harder."
    ],
    "studyGuide": {
      "title": "Washington D.C. Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Map the Mission",
          "content": "<p>Print a map of the National Mall. Mark the Capitol, the Washington Monument, and the Lincoln Memorial. Now measure: the Mall is about 2 miles end to end. How many steps do you think that is? (A kid's stride is roughly 2 feet.) Each family member picks one site to 'own.' Research it and come ready to teach the family three facts no one else knows.</p><ul><li>Site I'm teaching: ______________________</li><li>Fact 1: ______________________</li><li>Fact 2: ______________________</li><li>Fact 3: ______________________</li></ul>"
        },
        {
          "heading": "Founding Documents Detective (at the National Archives)",
          "content": "<p>In the Rotunda, find the original Constitution and look at the very first three words. They're written larger than everything else. Why do you think the framers made those words so big?</p><ul><li>The Constitution begins with the words: _____ _____ _____ _____.</li><li>Find John Hancock's signature on the Declaration. Why is it so much bigger than the others?</li><li>Count: how many amendments make up the Bill of Rights? _____</li><li>Bonus: the ink is fading after 250 years. What does that tell you about why we preserve documents?</li></ul>"
        },
        {
          "heading": "Words Carved in Stone (at the Lincoln Memorial)",
          "content": "<p>On the north wall you'll find Lincoln's entire Second Inaugural Address carved in stone. Read it slowly together. Then copy out one sentence that sticks with you.</p><ul><li>The sentence I chose: ______________________</li><li>Lincoln said 'with malice toward none, with charity for all.' The war wasn't over yet. What does it take to say that about your enemies?</li><li>Discussion: Lincoln mentions God and prayer several times in a 703-word speech. Why would a president talk about God while leading a country at war with itself?</li></ul>"
        },
        {
          "heading": "Smithsonian Sketch Stop",
          "content": "<p>Pick ONE artifact in any Smithsonian museum. Sit with it for five full minutes. Sketch it, then write down three things you noticed that a quick walk-by would miss.</p><ul><li>Museum and artifact: ______________________</li><li>Observation 1 / 2 / 3</li><li>Scavenger challenge: find something in the museum that is older than the United States itself. What was it? ______________________</li></ul>"
        },
        {
          "heading": "After You Get Home: Write Your Representative",
          "content": "<p>Civics isn't a spectator sport. Each kid writes a real letter or email to your House representative about something you saw on the trip: a question about how Congress works, an opinion about a monument, or thanks for the Capitol tour. Keep it to five sentences. Mail it. Then talk about this: in a republic, who works for whom?</p>"
        }
      ]
    },
    "faithConnection": "Faith is woven into the city's stone: 'In God We Trust' in the House chamber, congressional chaplains praying since 1789, and Lincoln's Second Inaugural, which reads like a sermon. The monuments start the conversation. You just have to walk.",
    "seoTitle": "Educational Family Trip to Washington D.C. | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Washington D.C. with our homeschool field trip guide: what to see, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips washington dc",
      "homeschool field trips dc",
      "washington dc homeschool field trip"
    ]
  },
  {
    "slug": "philadelphia",
    "name": "Philadelphia",
    "state": "PA",
    "stateName": "Pennsylvania",
    "tagline": "Where America declared itself, then figured out how to govern.",
    "heroImageUrl": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "Two of the most important documents in human history were signed in the same brick building, eleven years apart. The Declaration of Independence in 1776. The Constitution in 1787. Philadelphia is the only place on earth where you can stand in the room where both happened.\n\nIndependence Hall looks almost plain from the outside, and that's the point. The founding wasn't staged in a palace. It happened in a working colonial assembly room with hard wooden chairs, where men argued through a brutal summer with the windows shut because they didn't want anyone overhearing. When your kids sit in that room, the Revolution stops being a chapter and starts being a decision real people made.\n\nBut Philadelphia's story starts before 1776. William Penn founded Pennsylvania as what he called a 'Holy Experiment': a colony where Quakers, and eventually Catholics, Jews, and everyone else, could worship without the government breathing down their necks. That was radical in the 1680s. Religious liberty didn't begin as an American idea in a vacuum. It began as a Pennsylvania practice, and the founders carried it into the First Amendment.\n\nCome for the bell and the big documents. Stay for the realization that freedom of conscience was the seed everything else grew from.",
    "whatToSee": [
      {
        "name": "Independence Hall",
        "description": "Stand in the Assembly Room where both the Declaration and Constitution were signed. Tours are ranger-led and free, but tickets are required in peak season, so book ahead."
      },
      {
        "name": "Liberty Bell Center",
        "description": "The bell is smaller than kids expect and more moving than parents expect. Read the inscription from Leviticus together before you go in."
      },
      {
        "name": "National Constitution Center",
        "description": "The best interactive civics museum in the country. Sign the giant steel Constitution, take the presidential oath, and vote in the mock election."
      },
      {
        "name": "Museum of the American Revolution",
        "description": "Washington's actual headquarters tent, a wall of one-pence coins, and exhibits that treat the Revolution as the messy, divided conflict it was."
      },
      {
        "name": "Betsy Ross House",
        "description": "A quick, kid-friendly stop. Whether she sewed the first flag or not, the house shows how ordinary Philadelphians lived through extraordinary times."
      },
      {
        "name": "Elfreth's Alley",
        "description": "The oldest continuously inhabited residential street in America. Three hundred years of front doors in one block, and a perfect photo stop."
      },
      {
        "name": "Reading Terminal Market",
        "description": "Lunch here. It's been feeding Philadelphians since 1893, and the Amish stands alone are worth the trip."
      }
    ],
    "bestAges": "Ages 8 and up for the full weight of the history; the Constitution Center's hands-on exhibits work well for younger kids too.",
    "bestTimeToVisit": "April to June or September to October. Summer crowds at Independence Hall are heavy, so book the first tour slot of the day.",
    "tripLength": "2 to 3 days. Add a fourth for a half-day trip to Valley Forge, where Washington's army survived the winter of 1777-78.",
    "beforeYouGo": [
      "Reserve Independence Hall tour tickets on recreation.gov. They're inexpensive but required in peak season.",
      "Watch a few 'Liberty's Kids' episodes on the Declaration for younger kids.",
      "Read 'Johnny Tremain' with older kids for the feel of revolutionary Boston and Philadelphia.",
      "Download the National Park Service app for the self-guided Independence park walking tour."
    ],
    "studyGuide": {
      "title": "Philadelphia Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Penn's Holy Experiment",
          "content": "<p>William Penn was a Quaker, and Quakers had been jailed in England for their beliefs. When King Charles II gave Penn land in America to settle a debt, Penn decided to build a colony on a radical idea: no one would be persecuted for their religion. Research and answer:</p><ul><li>What is a Quaker? What did they believe that got them in trouble in England?</li><li>Penn called Pennsylvania a 'Holy Experiment.' In your own words, what was the experiment?</li><li>Name two other religious groups that found refuge in early Pennsylvania.</li></ul>"
        },
        {
          "heading": "In the Assembly Room",
          "content": "<p>George Washington sat in a tall chair at the front of the room while the Constitution was debated. On the back of the chair, a sun was carved. As the convention ended, Benjamin Franklin said he had wondered whether it was a rising or a setting sun, and now he knew it was rising. Find the chair. Sketch the sun.</p><ul><li>Why do you think Franklin's 'rising sun' story mattered to the men in that room?</li><li>The windows were kept shut during the debates, in a Philadelphia summer, with no air conditioning. What does that tell you about how secret this work was?</li></ul>"
        },
        {
          "heading": "Read the Bell",
          "content": "<p>The Liberty Bell carries an inscription from the Bible: 'Proclaim LIBERTY Throughout all the Land unto all the Inhabitants Thereof' (Leviticus 25:10). Fill in the blank, then discuss:</p><ul><li>The verse comes from the law of _______________, the year when debts were forgiven and slaves freed in ancient Israel.</li><li>Why would abolitionists, decades later, adopt this bell as their symbol? What did the verse mean to them?</li><li>Discussion: the men who ordered the bell in 1751 couldn't have imagined how it would be used. Can a symbol outgrow its makers?</li></ul>"
        },
        {
          "heading": "Sign Your Name (at the Constitution Center)",
          "content": "<p>In Signers' Hall you can add your signature alongside the 39 men who signed the Constitution. Do it. Then find the answers:</p><ul><li>Who was the oldest signer? _____ Who was the youngest? _____</li><li>How many total amendments does the Constitution have today? _____</li><li>Which amendment protects freedom of religion? _____ (Hint: it's the first one.)</li><li>Write the religion clauses of the First Amendment in your own words: ______________________</li></ul>"
        },
        {
          "heading": "After You Get Home: Write a Compact",
          "content": "<p>The founders wrote compacts, declarations, and constitutions because they believed free people should put their agreements in writing. As a family, write a one-paragraph 'Family Compact': what do you agree to stand for, and how will you treat each other when you disagree? Everyone signs. Post it somewhere you'll see it.</p>"
        }
      ]
    },
    "faithConnection": "William Penn's 'Holy Experiment' made Philadelphia the birthplace of religious liberty as a lived practice, and the Liberty Bell itself is engraved with Leviticus 25:10. The faith connection here isn't forced. It's cast in bronze.",
    "seoTitle": "Educational Family Trip to Philadelphia | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Philadelphia with our homeschool field trip guide: Independence Hall, the Liberty Bell, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips philadelphia",
      "homeschool field trips philadelphia",
      "philadelphia homeschool field trip"
    ]
  },
  {
    "slug": "boston",
    "name": "Boston",
    "state": "MA",
    "stateName": "Massachusetts",
    "tagline": "Two and a half miles of revolution, all of it walkable.",
    "heroImageUrl": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "The American Revolution didn't start with a declaration. It started in Boston, with a massacre, a tea party, and a midnight ride. The Freedom Trail stitches sixteen historic sites into a single red-brick line through the modern city, and walking it is the closest thing America has to time travel on foot.\n\nWhat makes Boston different from other history trips is density. You stand where the Boston Massacre happened, then walk four minutes to the Old State House balcony where the Declaration was first read to Bostonians. You climb the 294 steps of Bunker Hill, then take a ferry to the USS Constitution, the oldest commissioned warship still afloat. Kids don't get bored here because the next site is always one block away.\n\nBoston was founded by Puritans who crossed an ocean so they could worship according to their conscience, and that DNA runs through everything on the Trail. The most famous signal of the Revolution, 'one if by land, two if by sea,' was hung in the steeple of a church by its sexton. Faith and freedom didn't just coexist in Boston. They grew up together.\n\nCome prepared to walk. The Trail is only 2.5 miles, but with sixteen stops, it takes a full day, and you'll remember every step.",
    "whatToSee": [
      {
        "name": "The Freedom Trail",
        "description": "The 2.5-mile red-brick line connecting 16 sites. Start at Boston Common and follow it; the visitor center there has maps and ranger-led walks."
      },
      {
        "name": "Boston Common and Public Garden",
        "description": "America's oldest public park. Ride the Swan Boats (a tradition since 1877), then cross into the Garden for the duckling statues from 'Make Way for Ducklings.'"
      },
      {
        "name": "Paul Revere House",
        "description": "The oldest building in downtown Boston (1680). Small and quick, but standing where Revere left on his midnight ride gives kids chills."
      },
      {
        "name": "Old North Church",
        "description": "Where the sexton hung the two lanterns on April 18, 1775. Still an active church; the tour includes the bell-ringing chamber."
      },
      {
        "name": "USS Constitution",
        "description": "'Old Ironsides,' the world's oldest commissioned warship afloat. Free tours by active-duty sailors; book a timed slot online."
      },
      {
        "name": "Bunker Hill Monument",
        "description": "Climb all 294 steps of the obelisk for the view. The museum across the street explains what actually happened on June 17, 1775."
      },
      {
        "name": "Faneuil Hall and Quincy Market",
        "description": "The 'Cradle of Liberty' where colonists debated independence. Today it's part historic hall, part food hall, and a good lunch stop."
      }
    ],
    "bestAges": "Ages 8 and up will follow the history; strong walkers of any age do fine since the Trail breaks into short segments.",
    "bestTimeToVisit": "September to October for crisp air and foliage, or May to June. Winter is raw, and summer brings the biggest crowds.",
    "tripLength": "2 to 3 days. Add a half day for Lexington and Concord, where the first shots were fired, about 20 miles northwest.",
    "beforeYouGo": [
      "Grab a Freedom Trail map at the Boston Common Visitor Center, or download the NPS Freedom Trail app.",
      "Read 'Johnny Tremain' or watch the classic film for the midnight-ride context.",
      "Book the USS Constitution tour slot online. It's free but timed, and walk-ups often wait.",
      "Pack layers. The harbor wind surprises people even in June."
    ],
    "studyGuide": {
      "title": "Boston Freedom Trail Guide",
      "sections": [
        {
          "heading": "Before You Go: Build the Timeline",
          "content": "<p>The Revolution didn't happen all at once. Put these events in order before your trip, then check your answers against the exhibits: the Boston Massacre, the Boston Tea Party, Paul Revere's ride, the Battle of Bunker Hill, the Declaration of Independence.</p><ul><li>My order: 1) _____ 2) _____ 3) _____ 4) _____ 5) _____</li><li>Which event do you think made war unavoidable? Why?</li></ul>"
        },
        {
          "heading": "The Lantern Signal (at Old North Church)",
          "content": "<p>On the night of April 18, 1775, the church sexton hung two lanterns in the steeple: 'two if by sea.' It was a backup plan in case the rider never made it. Try this as a family:</p><ul><li>Stand where the signal would have been seen across the river. How far is it? Could you see a lantern at that distance?</li><li>Design your own signal system: how would you warn a town with no phones, using only what existed in 1775? Draw it.</li><li>Discussion: the plan depended on ordinary people, a sexton, a rider, watching the river. What does that tell you about how the Revolution actually worked?</li></ul>"
        },
        {
          "heading": "Poetry vs. History: Paul Revere's Ride",
          "content": "<p>Read Longfellow's poem 'Paul Revere's Ride' before visiting the Paul Revere House. Then, at the site, compare the poem to the exhibits.</p><ul><li>Name two things the poem gets right: ______________________</li><li>Name two things it exaggerates or leaves out (hint: Revere wasn't alone, and he didn't finish the ride): ______________________</li><li>Why do you think Longfellow wrote it that way, nearly a century later? What is poetry for, if not perfect accuracy?</li></ul>"
        },
        {
          "heading": "Up the Hill (at Bunker Hill)",
          "content": "<p>The famous order was 'Don't fire until you see the whites of their eyes.' The colonists were short on gunpowder and couldn't afford to waste a shot.</p><ul><li>Climb the monument. Count the steps as you go: _____ (It's 294.)</li><li>The battle was technically a British victory, but it cost them terribly. Explain in two sentences why both sides claimed it proved their point.</li><li>Discussion: when is a loss actually a win?</li></ul>"
        },
        {
          "heading": "After You Get Home: Print a Broadside",
          "content": "<p>Colonial printers spread revolutionary ideas with single-sheet broadsides posted in taverns. Make your own: pick one event from the trip and design a broadside announcing it to Boston, 1775 style. Big headline, dramatic language, a woodcut-style illustration. Bonus points for ye olde spelling.</p>"
        }
      ]
    },
    "faithConnection": "Boston was founded by Puritans who crossed an ocean for freedom of conscience, and its oldest churches still anchor the Trail. The Revolution's most famous signal hung in a church steeple. Faith and freedom grew up together here.",
    "seoTitle": "Educational Family Trip to Boston | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Boston with our homeschool field trip guide: the Freedom Trail, what to see, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips boston",
      "homeschool field trips boston",
      "boston freedom trail homeschool"
    ]
  },
  {
    "slug": "colonial-williamsburg",
    "name": "Colonial Williamsburg",
    "state": "VA",
    "stateName": "Virginia",
    "tagline": "The 1700s, live and unscripted.",
    "heroImageUrl": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "Colonial Williamsburg is the largest living-history museum in America, and it's the rare history trip where kids don't ask when it's over. The blacksmith is actually shoeing a horse. The printer is actually setting type. The wigmaker will explain, at length, why you need a wig. When costumed interpreters stay in character through your kids' hardest questions, history stops being a subject and starts being a place.\n\nWilliamsburg was the capital of colonial Virginia, the biggest and most influential of the thirteen colonies. Patrick Henry thundered against the Stamp Act in its Capitol. Thomas Jefferson studied law in its streets. George Washington danced at its balls and later plotted a revolution against the governor who lived in its palace. This is where the ideas of the Revolution were rehearsed.\n\nAnd Williamsburg sits at the center of the Historic Triangle, which tells the whole arc: Jamestown (1607), the first permanent English settlement; Williamsburg, the colonial capital; Yorktown (1781), where independence was won. Three sites, 174 years, one story.\n\nThe faith thread runs deep here too. Bruton Parish Church has held services since 1715, and its pews held Washington, Jefferson, and Patrick Henry. Just up the road, Jefferson's Virginia Statute for Religious Freedom disestablished the state church and became the model for the First Amendment. Your kids can sit in the church, then learn why faith stopped being a government department.",
    "whatToSee": [
      {
        "name": "The Historic Area trade shops",
        "description": "Start with the blacksmith, the printer, and the gunsmith. Go in the morning when the tradespeople are working and happy to talk."
      },
      {
        "name": "The Capitol",
        "description": "Where Patrick Henry argued against the Stamp Act. The guided tour puts you in the courtroom and the House of Burgesses chamber."
      },
      {
        "name": "The Governor's Palace",
        "description": "The most elegant building in colonial Virginia, with its famous wall of swords and pistols. The gardens behind it are worth a slow walk."
      },
      {
        "name": "Bruton Parish Church",
        "description": "An active parish since 1715. Sit in Washington's pew, and check the schedule for the free organ recitals."
      },
      {
        "name": "Jamestown Settlement",
        "description": "The living-history museum with full-size replicas of the Susan Constant, Godspeed, and Discovery. Kids can climb aboard and try hauling a line."
      },
      {
        "name": "Historic Jamestowne",
        "description": "The actual archaeological site, run by the Park Service. Watch archaeologists dig where the 1607 fort stood; the Archaearium museum holds what they've found."
      },
      {
        "name": "Yorktown Battlefield and the American Revolution Museum at Yorktown",
        "description": "Walk the siege lines where Cornwallis surrendered, then visit the museum's excellent Revolution exhibits and Continental Army encampment."
      }
    ],
    "bestAges": "Ages 7 and up. Younger kids enjoy the animals, crafts, and fife-and-drum parades even when the history sails past them.",
    "bestTimeToVisit": "April to May or September to October. Summer is hot and humid, and the interpreters will tell you so, in character.",
    "tripLength": "3 full days: one for Williamsburg, one for Jamestown, one for Yorktown. The sites are 15 to 25 minutes apart by car.",
    "beforeYouGo": [
      "Buy the multi-day Historic Triangle ticket. It covers all three areas and pays for itself fast.",
      "Read 'Blood on the River' by Elisa Carbone (Jamestown, ages 9+) before you go.",
      "Check the Colonial Williamsburg calendar for evening programs like ghost walks and concerts.",
      "Download the free Colonial Williamsburg app for the daily schedule of trade demonstrations."
    ],
    "studyGuide": {
      "title": "Colonial Williamsburg Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Apprentice Yourself",
          "content": "<p>In colonial Williamsburg, kids your age were apprentices, learning a trade by doing it for seven years. Pick a trade to 'apprentice' in on this trip: blacksmith, printer, wigmaker, gunsmith, or brickmaker. Research it before you go.</p><ul><li>My trade: ______________________</li><li>What tools does it use? ______________________</li><li>What was the hardest part of the job? ______________________</li><li>At the site, ask the interpreter one question your research didn't answer. Write their answer here.</li></ul>"
        },
        {
          "heading": "In the Capitol: Make the Argument",
          "content": "<p>In 1765, Patrick Henry stood in this Capitol and argued that only Virginia's own assembly could tax Virginians. His opponents called it treason. He answered: 'If this be treason, make the most of it.'</p><ul><li>In your own words, what was Henry's argument? ______________________</li><li>The men who agreed with him risked being hanged. What would you have risked it for?</li><li>Discussion: is there anything worth that kind of risk today?</li></ul>"
        },
        {
          "heading": "Jamestown: The First Winter Math",
          "content": "<p>About 104 settlers landed at Jamestown in 1607. By the end of the first year, fewer than 40 were still alive. At Historic Jamestowne, find the memorial church and the archaeological dig.</p><ul><li>What killed most of the settlers? (Ask a ranger; the answer is more complicated than you think.) ______________________</li><li>The settlers came looking for gold. What did they find instead? ______________________</li><li>Fill in: Jamestown survived because of ______________, a crop the colony learned to grow and sell.</li></ul>"
        },
        {
          "heading": "Yorktown: Walk the Siege Line",
          "content": "<p>In October 1781, Washington's army dug trenches closer and closer to the British lines until Cornwallis had no choice but surrender. Walk part of the battlefield tour road.</p><ul><li>How many days did the siege last? _____</li><li>Find the spot where the surrender happened. What did Cornwallis do instead of showing up himself? ______________________</li><li>Discussion: Washington lost more battles than he won. Why did Yorktown end the war?</li></ul>"
        },
        {
          "heading": "After You Get Home: The Statute in Your Words",
          "content": "<p>Jefferson's Virginia Statute for Religious Freedom (1786) said no one should be forced to support a church or punished for their beliefs. Read a short excerpt together, then rewrite it as if you were explaining it to a 7-year-old. Three sentences max. This is harder than it sounds, and that's the point.</p>"
        }
      ]
    },
    "faithConnection": "Bruton Parish Church has held services since 1715, and Virginia's Statute for Religious Freedom, drafted nearby, became the model for the First Amendment. In Williamsburg, kids can see where faith stopped being a government department.",
    "seoTitle": "Educational Family Trip to Colonial Williamsburg | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Colonial Williamsburg with our homeschool field trip guide: the Historic Triangle, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips williamsburg",
      "homeschool field trips williamsburg",
      "colonial williamsburg homeschool"
    ]
  },
  {
    "slug": "gettysburg",
    "name": "Gettysburg",
    "state": "PA",
    "stateName": "Pennsylvania",
    "tagline": "Three days that decided the nation's future.",
    "heroImageUrl": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "In three days in July 1863, more Americans fell at Gettysburg than in any other battle before or since. Around 51,000 casualties. The battlefield is enormous, quiet, and strangely beautiful now, all rolling Pennsylvania farmland, and that contrast is exactly what makes it hit so hard. Kids expect a monument. They don't expect to feel something.\n\nGettysburg was the turning point of the Civil War. Lee's invasion of the North was stopped here, and though the war dragged on for two more years, the Confederacy never again had the strength to go on the offensive. Four months later, Lincoln stood in the new national cemetery and gave a two-minute speech that redefined what the war was about: not just preserving the Union, but finishing the work of making all men free.\n\nThis is also the best place to teach the Civil War honestly. The exhibits don't flinch from slavery as the cause, and the battlefield makes the cost concrete: stand at the stone wall on Cemetery Ridge and look across the open field Pickett's men crossed. It's a mile of open ground. Then imagine walking it into cannon fire.\n\nThe faith thread is real here, not decorative. Chaplains served on both sides. Soldiers on both sides prayed, wrote home about Providence, and carried pocket Testaments into the fight. And Lincoln's Address ends with a nation 'under God' having 'a new birth of freedom.' The war's meaning, as Lincoln framed it, was theological before it was political.",
    "whatToSee": [
      {
        "name": "The Visitor Center museum and Cyclorama",
        "description": "Start here. The museum is excellent and honest, and the 360-degree Cyclorama painting of Pickett's Charge puts you inside the battle."
      },
      {
        "name": "The auto tour",
        "description": "The 24-stop driving tour covers the whole battlefield. Get the audio guide or, better, hire a Licensed Battlefield Guide to ride along for two hours. Worth every penny."
      },
      {
        "name": "Little Round Top",
        "description": "Where the 20th Maine held the Union's flank on day two. Climb it and read the monuments; kids love the downhill bayonet charge story."
      },
      {
        "name": "Cemetery Ridge and the Angle",
        "description": "Stand at the stone wall and look across the field of Pickett's Charge. A mile of open ground. Let that sink in."
      },
      {
        "name": "Devil's Den and the Wheatfield",
        "description": "The rockiest, most dramatic ground on the battlefield. Great for climbing kids and for understanding how terrain decided the fighting."
      },
      {
        "name": "Soldiers' National Cemetery",
        "description": "Where Lincoln gave the Gettysburg Address. Walk the rows, then stand at the rostrum spot and read the Address aloud together."
      },
      {
        "name": "Eisenhower National Historic Site",
        "description": "Ike's farm and retirement home, right next to the battlefield. A lighter, fascinating add-on about a general turned president."
      }
    ],
    "bestAges": "Ages 10 and up for the full weight of it; younger kids do fine with the museum's hands-on exhibits and the open space to roam.",
    "bestTimeToVisit": "April to June or September to October. Avoid early July unless you want the anniversary crowds and the heat the soldiers actually fought in.",
    "tripLength": "1 to 2 full days. One intense day covers the highlights; two lets you walk the ground slowly.",
    "beforeYouGo": [
      "Read the Gettysburg Address together. It's 272 words. Memorize it if you're ambitious.",
      "Watch the 'Gettysburg' episode of Ken Burns' 'The Civil War' for the battle narrative.",
      "Book a Licensed Battlefield Guide in advance at the visitor center. Two hours, in your car, unforgettable.",
      "Download the NPS Gettysburg app for maps and the auto tour narration."
    ],
    "studyGuide": {
      "title": "Gettysburg Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Know the Stakes",
          "content": "<p>By the summer of 1863, the Civil War had been raging for two years. General Lee took his army north into Pennsylvania. Answer these before you visit:</p><ul><li>Why did Lee invade the North? What was he hoping to win? ______________________</li><li>The battle started partly because both armies were looking for __________ (hint: it goes on feet).</li><li>How many days did the battle last? _____ How many total casualties? _____</li></ul>"
        },
        {
          "heading": "The High-Water Mark (at Cemetery Ridge)",
          "content": "<p>On July 3, about 12,500 Confederate soldiers marched nearly a mile across open fields toward this stone wall. Fewer than half made it back.</p><ul><li>Stand at the Angle. Time how long it takes to walk 100 yards at a normal pace. Now multiply: the charge covered about 1,700 yards, under artillery fire the whole way. How long were those men exposed? _____</li><li>Find the monument to the 72nd Pennsylvania. What does it mark? ______________________</li><li>Discussion: Pickett's men knew the odds. Why did they walk anyway?</li></ul>"
        },
        {
          "heading": "272 Words (at the National Cemetery)",
          "content": "<p>Lincoln spoke for about two minutes. Edward Everett, the famous orator who spoke before him, talked for two hours. Read the Address aloud at the cemetery.</p><ul><li>Copy the sentence you think is the most important: ______________________</li><li>Lincoln says the nation was 'dedicated to the proposition that all men are created equal.' Where had Americans heard those words before? ______________________</li><li>The Address ends with government 'of the people, by the people, for the people.' In your own words, what is Lincoln asking the living to do?</li></ul>"
        },
        {
          "heading": "Chaplains and Testaments",
          "content": "<p>Both armies had chaplains, and revivals swept through the camps during the war. Soldiers carried pocket New Testaments; many wrote home about trusting Providence before a battle.</p><ul><li>At the museum, find one soldier's letter or diary mentioning faith or prayer. What did it say? ______________________</li><li>Discussion: men on both sides prayed to the same God and then shot at each other. How did Lincoln make sense of that in his Second Inaugural? (Hint: 'the Almighty has His own purposes.')</li></ul>"
        },
        {
          "heading": "After You Get Home: The Cost, Counted",
          "content": "<p>51,000 casualties is a number too big to feel. Make it concrete: your church, your co-op, or your street. How many people is that? How many of those groups would it take to reach 51,000? Write it out. Then write a one-paragraph reflection: what is worth remembering about Gettysburg, and why do we keep going back?</p>"
        }
      ]
    },
    "faithConnection": "Chaplains served both armies, soldiers carried pocket Testaments into the fight, and Lincoln framed the war's meaning theologically: a nation 'under God' deserving 'a new birth of freedom.' At Gettysburg, faith isn't decoration. It's part of the story.",
    "seoTitle": "Educational Family Trip to Gettysburg | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Gettysburg with our homeschool field trip guide: the battlefield, what to see, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips gettysburg",
      "homeschool field trips gettysburg",
      "gettysburg homeschool field trip"
    ]
  },
  {
    "slug": "mount-vernon",
    "name": "Mount Vernon",
    "state": "VA",
    "stateName": "Virginia",
    "tagline": "Meet the man behind the monument.",
    "heroImageUrl": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "Every kid knows Washington's face from the dollar bill. Almost none of them know the man. Mount Vernon fixes that in a single day. This was his home for more than forty years, the plantation he kept trying to get back to between wars and presidencies, and walking its rooms and grounds turns a marble statue back into a person.\n\nThe mansion tour is the centerpiece, but the grounds are where the real education happens. Washington was a farmer first, and a restless experimenter: he tried new crops, designed a sixteen-sided barn, and ran a working distillery that made him one of the largest whiskey producers in America. Kids who couldn't care less about the presidency light up at the blacksmith shop, the gardens, and the farm animals.\n\nThen there's the tomb. Washington's simple brick tomb sits on a quiet hillside above the Potomac, and families tend to go silent there without being told. It's a good place to talk about what made him remarkable. Not that he was perfect; he wasn't, and the exhibits don't pretend he was. But that he walked away from power twice: resigning his commission when he could have been king, and leaving the presidency after two terms when he could have stayed. In the history of the world, that almost never happens.\n\nOn faith: Washington kept his deepest beliefs private, and honest historians still debate them. What we know is that he attended church regularly, served as a vestryman at Pohick Church, ordered chaplains for his army, and spoke constantly of Providence. You can present that record straight and let your kids draw their own conclusions. That's a better lesson than a slogan.",
    "whatToSee": [
      {
        "name": "The Mansion tour",
        "description": "Timed-entry and the heart of the visit. The New Room, with its green walls and Washington's sword, is the showstopper. Book the first slot of the day."
      },
      {
        "name": "Washington's tomb",
        "description": "A short, shaded walk from the mansion. Simple, quiet, and the right place for a family conversation about character and legacy."
      },
      {
        "name": "The gardens and farm",
        "description": "Working gardens, a paddock, and costumed interpreters. Washington the farmer comes alive here in a way the mansion can't do alone."
      },
      {
        "name": "The museum and education center",
        "description": "Excellent exhibits including Washington's dentures (not wood), his war tent, and an honest look at the enslaved people who built and ran the estate."
      },
      {
        "name": "The distillery and gristmill",
        "description": "A short drive or shuttle from the main estate. The reconstructed distillery shows Washington's surprising second career as a whiskey maker."
      },
      {
        "name": "Pohick Church",
        "description": "A few miles away, the church where Washington served as vestryman. Still an active parish; the box pews are original to his era."
      }
    ],
    "bestAges": "Ages 8 and up get the most from the mansion and museum; younger kids enjoy the farm, gardens, and open space.",
    "bestTimeToVisit": "April to May or September to October, when the gardens are at their best and the Potomac breeze actually helps.",
    "tripLength": "One full day. Pair it with Old Town Alexandria or a second D.C. day if you're in the area.",
    "beforeYouGo": [
      "Book mansion tour tickets online. Timed entry sells out, especially on weekends and holidays.",
      "Read a 'Who Was George Washington?' biography so kids arrive knowing the basics.",
      "Watch for the 'Mount Vernon' episode of any American history series for the distillery surprise.",
      "Plan lunch at the Mount Vernon Inn or pack a picnic for the grounds."
    ],
    "studyGuide": {
      "title": "Mount Vernon Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: The Resume",
          "content": "<p>Before the presidency, Washington had already lived three careers. Fill in his resume:</p><ul><li>Age 22: military officer in the ______________ War.</li><li>Planter and farmer at ______________ for 40+ years.</li><li>Commander of the ______________ Army, 1775-1783.</li><li>President of the ______________ Convention, 1787.</li><li>First President, ______________.</li><li>Discussion: which job do you think he liked best? What makes you say that?</li></ul>"
        },
        {
          "heading": "In the Mansion: Details That Talk",
          "content": "<p>The mansion is full of clues about the man. Find these and write what each one tells you:</p><ul><li>The key to the Bastille, hanging in the central passage. Why would Washington have it? ______________________</li><li>The 'New Room' with its green walls. What was this room for? ______________________</li><li>Washington's study. What does a man's study tell you about him? Look, then answer.</li></ul>"
        },
        {
          "heading": "The Farmer (on the grounds)",
          "content": "<p>Washington called himself a farmer first. He experimented constantly: crop rotation, a 16-sided treading barn, new plows.</p><ul><li>Name two crops Washington grew: ______________ and ______________.</li><li>What surprising product made him one of America's largest producers? ______________</li><li>Discussion: why would the most famous man in America care so much about farming methods?</li></ul>"
        },
        {
          "heading": "Walking Away From Power (at the tomb)",
          "content": "<p>After winning the Revolution, Washington resigned his commission and went home. After two terms as president, he left office voluntarily. King George III reportedly said that if Washington did that, he would be 'the greatest man in the world.'</p><ul><li>Why is giving up power so rare in history? Name one leader who didn't.</li><li>Discussion: what does it say about a person when they walk away from something everyone else is grabbing for?</li></ul>"
        },
        {
          "heading": "After You Get Home: The Honest Portrait",
          "content": "<p>The museum doesn't hide that Mount Vernon ran on enslaved labor, or that Washington freed the people he enslaved in his will. Write two paragraphs: one about what you admire in Washington, and one about what troubles you. Great people and hard truths can share the same page. That's what history is for.</p>"
        }
      ]
    },
    "faithConnection": "Washington attended church regularly, served as a vestryman, ordered chaplains for his army, and spoke constantly of Providence. He kept his deepest beliefs private, which makes Mount Vernon a good place to teach kids to weigh evidence honestly.",
    "seoTitle": "Educational Family Trip to Mount Vernon | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Mount Vernon with our homeschool field trip guide: Washington's home, what to see, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips mount vernon",
      "homeschool field trips mount vernon",
      "mount vernon homeschool field trip"
    ]
  },
  {
    "slug": "plymouth",
    "name": "Plymouth",
    "state": "MA",
    "stateName": "Massachusetts",
    "tagline": "Where faith crossed an ocean.",
    "heroImageUrl": "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "Every American kid learns about the Pilgrims in November. Almost none of them learn why the Pilgrims came. They didn't cross the Atlantic for gold or glory. They came, in their own words, 'for the glory of God and advancement of the Christian faith.' Plymouth is where you teach your children the difference.\n\nThe story is harsher than the paper turkeys suggest. The Mayflower landed in November 1620, at the start of a New England winter, in a place none of them had planned to settle. By spring, half of the 102 passengers were dead. They buried them at night so the Native Americans wouldn't know how few were left. And still they stayed. Still they planted. Still they gave thanks.\n\nBefore anyone even stepped ashore, the Pilgrims signed the Mayflower Compact, the first written framework of self-government in America. Forty-one men agreed to form a 'civil body politic' and obey laws made for the general good. Your kids have heard of the Constitution. This is its great-grandfather, signed on a rocking ship.\n\nPlymouth rewards families who slow down. The National Monument to the Forefathers, an 81-foot granite tribute most Americans have never heard of, puts Faith herself at the top, holding a Bible open. Plimoth Patuxet's interpreters will talk your ear off about 17th-century farming if you let them. Let them. This is the trip where your kids learn that faith, courage, and gratitude aren't abstractions. They're what got a starving colony through the winter.",
    "whatToSee": [
      {
        "name": "Mayflower II",
        "description": "The full-scale replica of the ship, docked at State Pier. Go below deck and imagine 102 people living there for 66 days. Kids do the math on space fast."
      },
      {
        "name": "Plimoth Patuxet Museums",
        "description": "The 17th-century English village with role-playing interpreters, plus the Wampanoag homesite with Native interpreters. Plan at least three hours."
      },
      {
        "name": "National Monument to the Forefathers",
        "description": "The largest solid granite monument in America, and almost nobody knows it. Faith stands 81 feet up holding an open Bible. Go read the inscriptions."
      },
      {
        "name": "Plymouth Rock and the waterfront",
        "description": "The rock is smaller than the legend, and that's a good lesson in itself. The waterfront walk around it is lovely."
      },
      {
        "name": "Pilgrim Hall Museum",
        "description": "The oldest continuously operating museum in America (1824). Holds William Bradford's Bible, Myles Standish's sword, and the cradle of a Mayflower baby."
      },
      {
        "name": "Burial Hill",
        "description": "Where the Pilgrims buried their dead that first winter. Climb it at sunset for the view over the harbor they sailed into."
      }
    ],
    "bestAges": "Ages 7 and up. The village interpreters are wonderful with younger kids, and the Compact discussion lands best around age 9 or 10.",
    "bestTimeToVisit": "Late spring through fall, when Plimoth Patuxet is fully open. Thanksgiving week is special but crowded; book everything early.",
    "tripLength": "1 to 2 days. One full day covers the village, the ship, and the monuments without rushing.",
    "beforeYouGo": [
      "Read the Mayflower Compact together. It's one paragraph. Look up any hard words first.",
      "Read 'Squanto's Journey' or a Pilgrim picture-book biography so kids know the names.",
      "Check Plimoth Patuxet's hours. The village is seasonal and some programs need reservations.",
      "For parents: read a few pages of Bradford's 'Of Plymouth Plantation' for the real voice of the colony."
    ],
    "studyGuide": {
      "title": "Plymouth Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Read the Compact",
          "content": "<p>The Mayflower Compact is one paragraph long, signed November 11, 1620, before anyone left the ship. Read it together (a modern-spelling version is fine). Then answer:</p><ul><li>The signers say they undertook the voyage 'for the ________ of God, and advancement of the ________ faith.' (Fill in the blanks.)</li><li>What is a 'civil body politic'? Put it in your own words: ______________________</li><li>Forty-one men signed. The women and servants didn't. Discussion: was that fair? Was it still a step toward self-government?</li></ul>"
        },
        {
          "heading": "Below Deck (on Mayflower II)",
          "content": "<p>The Mayflower was about 100 feet long. 102 passengers plus 30 crew lived aboard for 66 days, mostly below deck in a space about the size of a school bus.</p><ul><li>Measure your living room. How many Mayflower passengers could sleep in it, elbow to elbow? _____</li><li>What did they eat? (Ask a guide.) ______________________</li><li>One passenger, John Howland, was swept overboard in a storm and caught a rope. He lived. Discussion: what does his story tell you about Providence, luck, or both?</li></ul>"
        },
        {
          "heading": "The First Winter (at Burial Hill)",
          "content": "<p>Half the colonists died between November 1620 and March 1621. They buried the dead at night on this hill so no one would know how weak the colony was.</p><ul><li>102 passengers arrived. About how many survived the winter? _____</li><li>Bradford wrote that the living were barely able to bury the dead. What kept the survivors from sailing home in the spring?</li><li>Discussion: the Pilgrims thanked God in the middle of catastrophe. What does gratitude mean when everything is going wrong?</li></ul>"
        },
        {
          "heading": "Faith in Stone (at the Forefathers Monument)",
          "content": "<p>The monument's central figure is Faith, holding an open Bible in one hand and pointing to heaven with the other. Around the base are Morality, Law, Education, and Liberty.</p><ul><li>Copy the inscription under Faith's feet: ______________________</li><li>Why do you think the builders put Faith at the top, above Liberty? Do you agree with their order?</li><li>Discussion: the monument says these five virtues built America. Which one do you think matters most right now?</li></ul>"
        },
        {
          "heading": "After You Get Home: Bradford's Journal",
          "content": "<p>William Bradford kept a journal of the whole adventure. Imagine you are a 12-year-old on the Mayflower. Write three journal entries: one week at sea, the first sight of land, and the first Thanksgiving. Include at least one thing you saw, one thing you feared, and one thing you thanked God for. Read them aloud at dinner.</p>"
        }
      ]
    },
    "faithConnection": "The Pilgrims said it themselves: they crossed the ocean 'for the glory of God and advancement of the Christian faith.' They prayed on the ship, signed a covenant before landing, and thanked God after burying half their number. Plymouth is the rare destination where the faith angle isn't an angle at all. It's the whole story.",
    "seoTitle": "Educational Family Trip to Plymouth | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Plymouth with our homeschool field trip guide: the Pilgrims, the Mayflower, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips plymouth",
      "homeschool field trips plymouth",
      "plymouth pilgrims homeschool"
    ]
  },
  {
    "slug": "st-augustine",
    "name": "St. Augustine",
    "state": "FL",
    "stateName": "Florida",
    "tagline": "The oldest city in America, and it shows.",
    "heroImageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "St. Augustine was founded in 1565. That's 42 years before Jamestown and 55 before Plymouth. When the Pilgrims were still in Holland, this city already had streets, a church, and a fort under construction. If your kids think American history starts in New England, St. Augustine will rearrange their timeline.\n\nThis is Spanish colonial America, and it feels nothing like Williamsburg. The Castillo de San Marcos is the oldest masonry fort in the country, built from coquina, a stone made of compressed seashells that literally absorbed cannonballs instead of shattering. The narrow streets of the old town, St. George Street especially, still follow the Spanish layout. You can eat lunch in a building older than the United States.\n\nThe faith history here is the oldest in the nation too. The Spanish came with priests as well as soldiers, and the Mission Nombre de Dios marks where the first Catholic Mass in what is now the United States was celebrated in 1565. The Great Cross on the mission grounds stands 208 feet tall over Matanzas Bay. Whatever your tradition, it's worth standing where Christian worship in America began and thinking about what 460 years of prayer leaves behind.\n\nAnd then there's the beach. Few history trips let you tour a 17th-century fort in the morning and swim in the Atlantic in the afternoon. Kids remember St. Augustine because it never feels like school.",
    "whatToSee": [
      {
        "name": "Castillo de San Marcos",
        "description": "The 17th-century coquina fort, still standing guard over the bay. Ranger talks and cannon firings run daily; the views from the gun deck are the best in town."
      },
      {
        "name": "St. George Street",
        "description": "The pedestrian heart of the old town. Colonial buildings, shops, and the old city gates at the north end. Go early before the crowds."
      },
      {
        "name": "Mission Nombre de Dios",
        "description": "The site of the first Mass in the continental U.S. (1565). The Great Cross, the Prince of Peace church, and the peaceful grounds are worth an unhurried hour."
      },
      {
        "name": "Fountain of Youth Archaeological Park",
        "description": "Part history, part kitsch, all fun. It's also the site of the original 1565 settlement, with real archaeology alongside the legend."
      },
      {
        "name": "St. Augustine Lighthouse and Maritime Museum",
        "description": "Climb 219 steps for the view, then explore the shipwreck exhibits. Kids who like heights and shipwrecks will be happy for hours."
      },
      {
        "name": "The Colonial Quarter",
        "description": "A living-history block with blacksmithing, musket drills, and colonial crafts. Smaller than Williamsburg, livelier per square foot."
      },
      {
        "name": "St. Augustine Beach",
        "description": "Ten minutes from the old town. End the history day in the Atlantic. You've earned it."
      }
    ],
    "bestAges": "Ages 7 and up. The fort, the lighthouse climb, and the beach keep younger kids happy while older ones absorb the history.",
    "bestTimeToVisit": "March to May or October to November. Summer is hot and hurricane season runs June through November, so watch the forecast.",
    "tripLength": "2 full days. One for the fort and old town, one for the missions, lighthouse, and beach.",
    "beforeYouGo": [
      "Read up on Pedro Menendez and the founding of 1565 so kids know this predates Jamestown.",
      "Book the Castillo's ranger programs and the lighthouse climb for early morning.",
      "Bring swimsuits even on a history trip. The beach is ten minutes away and you will go.",
      "Park in the visitor center garage. Old town parking is scarce and the streets are narrow."
    ],
    "studyGuide": {
      "title": "St. Augustine Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Fix the Timeline",
          "content": "<p>Most kids learn American history starting in 1607 or 1620. St. Augustine breaks that. Put these in order: founding of St. Augustine, founding of Jamestown, landing at Plymouth, American Revolution.</p><ul><li>My order: 1) _____ 2) _____ 3) _____ 4) _____</li><li>How many years older is St. Augustine than Jamestown? _____</li><li>Discussion: why do you think textbooks usually start with the English colonies instead of the Spanish ones?</li></ul>"
        },
        {
          "heading": "The Fort That Ate Cannonballs (at the Castillo)",
          "content": "<p>The Castillo is built of coquina, a stone made of tiny compressed seashells. When cannonballs hit it, the walls absorbed the impact instead of cracking.</p><ul><li>Find a piece of coquina in the wall. Can you see the shells? _____</li><li>The fort was started in the year _____. (Hint: look for the date over the entrance.)</li><li>From the gun deck, find the bay the fort was built to defend. Why would Spain spend 23 years building one fort here? ______________________</li></ul>"
        },
        {
          "heading": "Where Worship Began (at Mission Nombre de Dios)",
          "content": "<p>In September 1565, Spanish settlers celebrated the first Catholic Mass in what is now the United States, right here.</p><ul><li>How many years ago was that? _____</li><li>The Great Cross is 208 feet tall. Why build something that visible? What was it saying?</li><li>Discussion: the Spanish brought both soldiers and priests. What happens when a colony's faith and its flag arrive on the same ship?</li></ul>"
        },
        {
          "heading": "Legend vs. Site (at the Fountain of Youth Park)",
          "content": "<p>Ponce de Leon probably never looked for a fountain of youth. But this park sits on the real site of the 1565 settlement, and archaeologists have dug here for decades.</p><ul><li>Name one real artifact found at this site: ______________________</li><li>Why do legends like the Fountain of Youth stick around even when historians doubt them?</li><li>Discussion: what's the difference between a legend and a lie?</li></ul>"
        },
        {
          "heading": "After You Get Home: Two Colonies, Compared",
          "content": "<p>Make a two-column chart: Spanish St. Augustine vs. English Jamestown. Compare founding date, reason for settling, relationship with Native peoples, and what each colony is remembered for. Then write one paragraph: how would American history be different if the Spanish colonies had become the dominant story instead of the English ones?</p>"
        }
      ]
    },
    "faithConnection": "Mission Nombre de Dios marks the first Christian Mass celebrated in what is now the United States, in 1565. Four and a half centuries of worship started on that ground, and the Great Cross still says so to anyone driving by.",
    "seoTitle": "Educational Family Trip to St. Augustine | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to St. Augustine with our homeschool field trip guide: the oldest city, the Castillo, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips st augustine",
      "homeschool field trips st augustine",
      "st augustine homeschool field trip"
    ]
  },
  {
    "slug": "san-antonio",
    "name": "San Antonio",
    "state": "TX",
    "stateName": "Texas",
    "tagline": "Remember the Alamo, and everything around it.",
    "heroImageUrl": "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "Every Texan schoolkid can tell you what happened at the Alamo in March 1836: 189 defenders held a former mission against several thousand Mexican soldiers for thirteen days, and all of them died. 'Remember the Alamo' became the battle cry that won Texas independence six weeks later at San Jacinto. The story is as straightforward as American legends get, and standing in that small chapel courtyard makes it real in a way no textbook can.\n\nBut the Alamo is only the beginning of San Antonio's story, and the rest of it surprises people. The Alamo was originally Mission San Antonio de Valero, founded in 1718, and it's one of five Spanish colonial missions along the San Antonio River. Together they form a UNESCO World Heritage Site, the only one in Texas. Mission San Jose, the 'Queen of the Missions,' is arguably more beautiful than the Alamo itself, with its famous Rose Window carved in 1775.\n\nThat's the deeper lesson here: Texas didn't start with cowboys. It started with Spanish missionaries, soldiers, and Native converts building a frontier community a century before the Revolution. The missions were churches, farms, workshops, and fortresses all at once, and four of them are still active parishes. Your kids can walk into a Sunday Mass in a building that was old when George Washington was born.\n\nCome for the legend. Stay for the missions. Eat on the River Walk in between.",
    "whatToSee": [
      {
        "name": "The Alamo",
        "description": "Start at the chapel and the Long Barrack museum. Go early; it's free, it's small, and the midday crowds are intense. Photography is limited inside the shrine."
      },
      {
        "name": "San Antonio Missions National Historical Park",
        "description": "Four missions south of downtown: Concepcion, San Jose, San Juan, and Espada. Rent bikes and ride the Mission Trail between them."
      },
      {
        "name": "Mission San Jose",
        "description": "The 'Queen of the Missions' and the largest. The Sunday mariachi Mass is unforgettable if your timing works out."
      },
      {
        "name": "San Fernando Cathedral",
        "description": "Founded in 1731, one of the oldest cathedrals in the U.S. The evening light show on the facade tells San Antonio's history in 24 minutes."
      },
      {
        "name": "The River Walk",
        "description": "Fifteen miles of walkways along the river, but the downtown loop is the classic. Take the narrated barge cruise first to get your bearings, then walk."
      },
      {
        "name": "Market Square (El Mercado)",
        "description": "The largest Mexican market in the U.S. Lunch, live music, and the best people-watching in the city."
      },
      {
        "name": "Tower of the Americas",
        "description": "The 750-foot tower from the 1968 World's Fair. The observation deck gives kids the best sense of the city's layout."
      }
    ],
    "bestAges": "Ages 8 and up. The Alamo story lands best when kids are old enough to understand what a last stand means.",
    "bestTimeToVisit": "March to May or October to November. Summer in San Antonio is genuinely brutal; plan indoor stops for midday.",
    "tripLength": "2 full days. One for the Alamo, River Walk, and cathedral; one for the four missions.",
    "beforeYouGo": [
      "Read 'What Was the Alamo?' (Who HQ) with younger kids, or watch the 2004 film 'The Alamo' with older ones.",
      "Book the Alamo's guided tour if you want the full story; the free self-guided visit is fine too.",
      "Reserve River Walk barge cruise tickets online to skip the line.",
      "Bring water and hats. The mission trail has long sunny stretches between shade."
    ],
    "studyGuide": {
      "title": "San Antonio Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Thirteen Days",
          "content": "<p>The siege of the Alamo lasted from February 23 to March 6, 1836. Research the basics before you visit:</p><ul><li>About how many defenders held the Alamo? _____ About how many Mexican soldiers surrounded them? _____</li><li>Name two famous defenders: ______________ and ______________.</li><li>What happened six weeks later at San Jacinto? ______________________</li><li>Discussion: the defenders knew no help was coming. Why stay?</li></ul>"
        },
        {
          "heading": "In the Chapel (at the Alamo)",
          "content": "<p>The famous curved facade is the chapel of Mission San Antonio de Valero, built in the 1700s as a church, not a fortress.</p><ul><li>Find the date stone on the chapel. When was it built? _____</li><li>The Alamo was a ____________ for over 70 years before it was a battlefield. (Hint: it starts with 'm.')</li><li>Discussion: does knowing it was a church change how you feel about the battle? Why or why not?</li></ul>"
        },
        {
          "heading": "The Queen of the Missions (at Mission San Jose)",
          "content": "<p>Mission San Jose was founded in 1720 and at its height housed 350 Native converts, with workshops, granaries, and a church.</p><ul><li>Find the Rose Window. What year was it carved? _____ What story does the guide tell about it?</li><li>A mission was four things at once: a church, a __________, a __________, and a __________.</li><li>Four of the five San Antonio missions are still active parishes. What does it mean that people still worship where converts worshipped 300 years ago?</li></ul>"
        },
        {
          "heading": "River Walk Observation",
          "content": "<p>Take the barge cruise and listen to the narration. Then answer:</p><ul><li>The River Walk was built after a terrible __________ in 1921.</li><li>Name three cultures that shaped San Antonio: __________, __________, __________.</li><li>Sketch one thing you saw from the barge: a bridge, a building, a cypress tree. Label it.</li></ul>"
        },
        {
          "heading": "After You Get Home: The Letter",
          "content": "<p>Colonel William Travis wrote his famous 'Victory or Death' letter from the Alamo on February 24, 1836, asking for reinforcements that never came. Read it together (it's short). Then each kid writes their own version: a letter from inside a besieged place, asking for help, knowing it might not come. What would you say if these were your last written words?</p>"
        }
      ]
    },
    "faithConnection": "The Alamo was a Spanish mission for 70 years before it was a battlefield, and four of San Antonio's five missions are still active parishes. The city's story starts with missionaries, not soldiers, and the churches are still open.",
    "seoTitle": "Educational Family Trip to San Antonio | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to San Antonio with our homeschool field trip guide: the Alamo, the missions, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips san antonio",
      "homeschool field trips san antonio",
      "alamo homeschool field trip"
    ]
  },
  {
    "slug": "charleston",
    "name": "Charleston",
    "state": "SC",
    "stateName": "South Carolina",
    "tagline": "The Holy City, where American history refuses to be simple.",
    "heroImageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "Charleston is the most beautiful history lesson in America, and the most complicated. Founded in 1670, it was one of the richest cities in colonial America, a jewel of churches, gardens, and harbor trade. It's also where the Civil War began, with the first shots fired at Fort Sumter in April 1861, and where the wealth on display was built by enslaved labor. Charleston doesn't let you look away from either truth. That's what makes it essential.\n\nStart with the nickname: the 'Holy City.' Charleston earned it from the forest of church steeples on its skyline, and from a genuine history of religious tolerance unusual for its time. Huguenots fleeing France, Jews, Catholics, and dissenting Protestants all found room here when other colonies shut their doors. St. Michael's Church has rung its bells since 1764. The faith history is real, and it's part of why the city feels the way it does.\n\nThen take the ferry to Fort Sumter, where the war started, and walk the historic district with a guide who doesn't sugarcoat. The Old Slave Mart Museum, on the site where enslaved people were actually sold, is small, quiet, and devastating. Pair it with a plantation visit, Magnolia or Middleton Place, and talk honestly with your kids about who built the beauty around them.\n\nCharleston teaches something few destinations can: that history has layers, that a place can be gorgeous and guilty at once, and that telling the truth about the past is a kind of respect for the people who lived it. Older kids especially come home from Charleston thinking harder.",
    "whatToSee": [
      {
        "name": "Fort Sumter",
        "description": "The ferry ride from downtown takes 30 minutes each way, and the ranger talk on the island is excellent. Book the first boat of the day."
      },
      {
        "name": "The Historic District walking tour",
        "description": "Go with a licensed guide, not alone. The good ones tell the full story: the wealth, the churches, and the enslaved people who built it all."
      },
      {
        "name": "The Battery and White Point Garden",
        "description": "The classic promenade with harbor views, antebellum mansions, and massive live oaks. Best at golden hour."
      },
      {
        "name": "Old Slave Mart Museum",
        "description": "Small, sobering, and essential. On the actual site of a slave market. Go quietly and give it the time it deserves."
      },
      {
        "name": "Magnolia Plantation and Gardens",
        "description": "America's oldest public gardens (1870s), plus honest exhibits about the enslaved community. The nature tram is great for younger kids."
      },
      {
        "name": "Middleton Place",
        "description": "The oldest landscaped gardens in America, with craftspeople demonstrating colonial trades. The 'Beyond the Fields' tour covers enslaved life directly."
      },
      {
        "name": "Patriots Point and the USS Yorktown",
        "description": "The WWII aircraft carrier is a kid magnet: climb through the ship, sit in the cockpit displays, and tour the Medal of Honor museum."
      }
    ],
    "bestAges": "Ages 9 and up for the full weight of the history; younger kids enjoy the gardens, the carrier, and the ferry rides.",
    "bestTimeToVisit": "March to May, when the gardens explode, or October to November. Summer is hot, humid, and hurricane-adjacent.",
    "tripLength": "2 to 3 days. One for Fort Sumter and the historic district, one for a plantation and Patriots Point.",
    "beforeYouGo": [
      "Book the Fort Sumter ferry in advance. The first sailing of the day has the smallest crowds.",
      "Choose a walking tour company known for honest history, not just ghost stories.",
      "Read a kids' Civil War overview so Fort Sumter lands in context.",
      "Plan for heat and walking. The historic district is best explored on foot, slowly."
    ],
    "studyGuide": {
      "title": "Charleston Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Why Here?",
          "content": "<p>Charleston was one of the richest cities in colonial America. Research why:</p><ul><li>What two crops made Carolina planters wealthy? __________ and __________.</li><li>Who grew, harvested, and processed those crops? ______________________</li><li>The first shots of the Civil War were fired at Fort Sumter on April __, 1861.</li><li>Discussion: can a city's beauty and its injustice be true at the same time?</li></ul>"
        },
        {
          "heading": "Where the War Began (at Fort Sumter)",
          "content": "<p>The Confederates fired on the federal fort at 4:30 in the morning. No one died in the bombardment itself, but the war it started killed around 750,000 people.</p><ul><li>How long did Major Anderson's men hold out? _____ hours.</li><li>Stand where the guns fired. Look back at the Charleston skyline. How far away is it? _____</li><li>Discussion: the war started over whether new states would allow slavery. Why does it matter to say that plainly?</li></ul>"
        },
        {
          "heading": "The Holy City (walking the district)",
          "content": "<p>Charleston's nickname comes from its church steeples and its early religious tolerance. Count steeples as you walk.</p><ul><li>How many church steeples can you spot from the Battery? _____</li><li>St. Michael's bells have rung since 1764. What was happening in America in 1764? ______________________</li><li>Which groups found religious refuge in early Charleston? Name two: __________ and __________.</li></ul>"
        },
        {
          "heading": "Telling the Whole Story (plantations and the Slave Mart)",
          "content": "<p>At the plantation or the Slave Mart, listen for the names and stories of enslaved people, not just the owners.</p><ul><li>Write down one enslaved person's name and one fact about their life: ______________________</li><li>What work did enslaved people do at this site? ______________________</li><li>Discussion: why do some historic sites talk about this openly and others don't? Which is more respectful?</li></ul>"
        },
        {
          "heading": "After You Get Home: Layers",
          "content": "<p>Draw Charleston as a layer cake with at least four layers: colonial port, Holy City, Civil War flashpoint, modern tourist city. Label what each layer added and what each layer cost. Then write one paragraph: what does it mean to love a place and tell the truth about it at the same time?</p>"
        }
      ]
    },
    "faithConnection": "Charleston's 'Holy City' nickname comes from real history: Huguenots, Jews, Catholics, and dissenters found religious refuge here when other colonies shut them out. The steeples on the skyline aren't decoration. They're the reason for the name.",
    "seoTitle": "Educational Family Trip to Charleston | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Charleston with our homeschool field trip guide: Fort Sumter, the historic district, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips charleston",
      "homeschool field trips charleston",
      "charleston homeschool field trip"
    ]
  },
  {
    "slug": "new-orleans",
    "name": "New Orleans",
    "state": "LA",
    "stateName": "Louisiana",
    "tagline": "Three flags, one river, and a culture like nowhere else in America.",
    "heroImageUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "New Orleans doesn't feel like the rest of America because for most of its history, it wasn't. Founded by the French in 1718, ruled by the Spanish for forty years, sold to the United States in the Louisiana Purchase, it grew up at the mouth of the Mississippi as a port where French, Spanish, African, and Caribbean cultures collided and made something entirely new. Jazz was born here. Creole cuisine was born here. The whole city is a lesson in what happens when cultures mix instead of sorting themselves out.\n\nFor families, the surprise is how much serious history sits alongside the fun. The National WWII Museum is one of the best museums in the country, full stop, and kids who thought they didn't care about World War II come out changed. The French Quarter's architecture is genuinely Spanish, not French, a quirk of history worth knowing. And St. Louis Cathedral, facing Jackson Square since 1794, is the oldest cathedral in the United States, still holding Mass in the middle of the city's most famous neighborhood.\n\nA note for parents: Bourbon Street exists, and it's exactly what you've heard. You don't need it. The French Quarter's daytime streets, the Garden District, Frenchmen Street's live music, and the riverfront give you the real city without the parts you'd rather your kids didn't see. Go in daylight, stick to the family zones, and New Orleans is one of the great American family trips.\n\nCome for the beignets. Stay because your kids just learned what a port city is, what jazz is, and why the Mississippi made America.",
    "whatToSee": [
      {
        "name": "The French Quarter and Jackson Square",
        "description": "Go in the morning when it's quiet. Street performers, artists, and the Quarter's famous iron-lace balconies, which are Spanish, not French."
      },
      {
        "name": "St. Louis Cathedral",
        "description": "The oldest cathedral in the U.S., anchoring Jackson Square. Step inside between services; the interior is stunning and peaceful."
      },
      {
        "name": "The National WWII Museum",
        "description": "Plan a full day. The 'Road to Berlin' and 'Road to Tokyo' exhibits are world-class, and the 4D 'Beyond All Boundaries' film is unforgettable."
      },
      {
        "name": "The Garden District and the St. Charles streetcar",
        "description": "Ride the world's oldest continuously operating streetcar line past the great mansions. Get off and walk Magazine Street."
      },
      {
        "name": "Frenchmen Street",
        "description": "The locals' music street, three blocks of live clubs. Many venues are all-ages before 8 p.m.; check ahead and go early."
      },
      {
        "name": "Cafe du Monde",
        "description": "Beignets and cafe au lait, open 24 hours in the French Market. Go at 8 a.m. to beat the line. Powdered sugar will be everywhere. Accept it."
      },
      {
        "name": "Mardi Gras World",
        "description": "Tour the warehouse where the parade floats are built. Kids get to try on costumes and see the floats up close, minus the actual Mardi Gras."
      }
    ],
    "bestAges": "Ages 10 and up for the WWII Museum and the full cultural picture; younger kids love the streetcar, the beignets, and the aquarium.",
    "bestTimeToVisit": "March to May or October to November. Avoid Mardi Gras unless that's the point, and avoid August, which is brutally hot.",
    "tripLength": "2 to 3 days. One full day for the WWII Museum alone, plus a day for the Quarter and Garden District.",
    "beforeYouGo": [
      "Book WWII Museum tickets online and plan a full day there. It's bigger than you think.",
      "Read 'Trombone Shorty' (picture book) for the music story with younger kids.",
      "Learn the family plan: French Quarter by day, Frenchmen Street music early evening, skip Bourbon Street.",
      "Check the cathedral's Mass schedule if you want to attend; tourists are welcome."
    ],
    "studyGuide": {
      "title": "New Orleans Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Three Flags",
          "content": "<p>New Orleans has lived under three flags. Put them in order and date them:</p><ul><li>1) __________ (1718-1762) 2) __________ (1762-1800) 3) __________ (1803-today)</li><li>What was the Louisiana Purchase, and how much did the U.S. pay? $__________ million.</li><li>Why did America want New Orleans so badly? (Hint: look at a map of the Mississippi River.) ______________________</li></ul>"
        },
        {
          "heading": "The Quarter Up Close (in the French Quarter)",
          "content": "<p>The famous balconies and courtyards are Spanish colonial, built after fires in 1788 and 1794 destroyed the original French city.</p><ul><li>Find a building with a Spanish-style courtyard. Sketch the ironwork on one balcony.</li><li>Jackson Square was originally the Place d'Armes, a military parade ground. What stands in the center now? ______________________</li><li>Discussion: the Quarter looks European but the food, music, and language are pure Louisiana. What made it different from the cities it resembles?</li></ul>"
        },
        {
          "heading": "The Cathedral (at St. Louis Cathedral)",
          "content": "<p>The cathedral has stood on this spot since 1794, making it the oldest cathedral in the United States.</p><ul><li>How many years has it been here? _____</li><li>Inside, find the murals. What story do they tell? ______________________</li><li>Discussion: the cathedral sits at the center of the city's most famous square. What does its placement say about the role of faith in old New Orleans?</li></ul>"
        },
        {
          "heading": "The War (at the WWII Museum)",
          "content": "<p>The museum was founded by historian Stephen Ambrose and built around the story of the Higgins boats, designed and built right here in New Orleans.</p><ul><li>What was a Higgins boat, and why did Eisenhower say the designer 'won the war for us'? ______________________</li><li>Pick one personal story from the exhibits. Whose was it, and what happened? ______________________</li><li>Discussion: New Orleans built the boats that carried D-Day. How does a city's ordinary work become history?</li></ul>"
        },
        {
          "heading": "After You Get Home: The Mix",
          "content": "<p>Jazz, Creole food, and Mardi Gras all came from cultures colliding in one port city. As a family, cook one Creole or Cajun dish together (red beans and rice is the classic Monday meal). While it cooks, each person names one thing from the trip that could only have happened in New Orleans, and explains why.</p>"
        }
      ]
    },
    "faithConnection": "St. Louis Cathedral has anchored Jackson Square since 1794, the oldest cathedral in the country, still holding Mass in the middle of the city's most famous neighborhood. Faith wasn't off to the side in old New Orleans. It was the center of the square.",
    "seoTitle": "Educational Family Trip to New Orleans | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to New Orleans with our homeschool field trip guide: the French Quarter, the WWII Museum, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips new orleans",
      "homeschool field trips new orleans",
      "new orleans homeschool field trip"
    ]
  },
  {
    "slug": "santa-fe",
    "name": "Santa Fe",
    "state": "NM",
    "stateName": "New Mexico",
    "tagline": "The oldest capital in America, 7,000 feet up and 400 years deep.",
    "heroImageUrl": "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "Santa Fe was founded in 1610, making it the oldest state capital in the United States. When the Pilgrims landed at Plymouth, Santa Fe already had a plaza, a governor's palace, and a church. The Palace of the Governors on the plaza has housed Spanish, Mexican, and American governments in the same adobe building. There is nowhere else in America where you can touch that kind of continuity.\n\nThis is also the trip that teaches the West honestly. In 1680, the Pueblo peoples rose up and drove the Spanish out for twelve years, the most successful Native revolt in North American history. The museums here tell that story straight, alongside the Spanish return, the Santa Fe Trail era, and the railroad. Kids come home understanding that the West wasn't empty and wasn't simple.\n\nThe faith landmarks are some of the oldest in the nation. San Miguel Chapel, dating to around 1610, is the oldest church in the United States. The Cathedral Basilica of St. Francis anchors the old town. And the Loretto Chapel holds its famous 'miraculous staircase,' a spiral with no visible support that legend says a mysterious carpenter built in the 1870s. Whether you buy the legend or the engineering explanation, your kids will argue about it for days.\n\nAnd Santa Fe is simply gorgeous: adobe architecture, mountain light, art everywhere, and green chile on everything. History trips don't usually look this good.",
    "whatToSee": [
      {
        "name": "The Plaza and the Palace of the Governors",
        "description": "The heart of old Santa Fe. The Palace museum covers 400 years under three flags, and Native artisans sell jewelry under the portal as they have for decades."
      },
      {
        "name": "Loretto Chapel",
        "description": "Come for the famous spiral staircase with no visible supports. Read the legend, study the engineering, and let the family debate it."
      },
      {
        "name": "San Miguel Chapel",
        "description": "The oldest church in the U.S. (circa 1610). Small, quiet, and humbling. The 400-year-old bell in the tower still rings."
      },
      {
        "name": "Cathedral Basilica of St. Francis of Assisi",
        "description": "The landmark cathedral at the end of the old town. Step inside for the quiet, and notice the Pueblo and Spanish details woven together."
      },
      {
        "name": "Canyon Road",
        "description": "Half a mile of galleries in old adobe houses. Even kids who 'don't like art' get drawn in by the sculpture gardens."
      },
      {
        "name": "Georgia O'Keeffe Museum",
        "description": "Small, focused, and perfect for kids: her New Mexico landscapes make immediate sense once you've seen the desert yourself."
      },
      {
        "name": "Meow Wolf's House of Eternal Return",
        "description": "The immersive art installation kids beg to visit. A Victorian house that opens into alien worlds. Budget two to three hours."
      }
    ],
    "bestAges": "Ages 8 and up. The history and art land best with kids old enough to notice details, and Meow Wolf delights all ages.",
    "bestTimeToVisit": "April to June or September to October. Summer brings crowds and afternoon storms; winter is quiet and beautiful but cold.",
    "tripLength": "2 to 3 days. Add a day trip to Bandelier National Monument or Taos Pueblo if you have a fourth.",
    "beforeYouGo": [
      "Read about the Pueblo Revolt of 1680 so the museums land in context.",
      "Read 'My Name Is Georgia' by Jeanette Winter for the O'Keeffe backstory.",
      "Book Loretto Chapel and Meow Wolf tickets online. Both sell out on weekends.",
      "Drink water constantly for the first day. At 7,000 feet, altitude headaches are real."
    ],
    "studyGuide": {
      "title": "Santa Fe Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Three Flags, One Palace",
          "content": "<p>The Palace of the Governors has served under the flags of Spain, Mexico, and the United States. Research the timeline:</p><ul><li>Santa Fe founded: _____. (Older than Plymouth by _____ years.)</li><li>The Pueblo Revolt drove the Spanish out in _____. They returned in _____.</li><li>New Mexico became a U.S. territory in _____, a state in _____.</li><li>Discussion: what does it do to a city to change countries three times without moving?</li></ul>"
        },
        {
          "heading": "The Revolt (at the museums)",
          "content": "<p>In 1680, led by Po'pay, the Pueblo peoples revolted against Spanish rule and held their land for 12 years.</p><ul><li>What were the Pueblo people resisting? ______________________</li><li>Why is this revolt called the most successful Native uprising in North American history? ______________________</li><li>Discussion: history is usually told by the winners. What changes when the Pueblo people tell this story?</li></ul>"
        },
        {
          "heading": "The Staircase (at Loretto Chapel)",
          "content": "<p>The chapel's spiral staircase makes two full 360-degree turns with no visible means of support. Legend says a mysterious carpenter built it in the 1870s and vanished.</p><ul><li>How many steps does the staircase have? _____ (Ask the guide.)</li><li>What are the two explanations for how it stands up? Legend: ______________________ Engineering: ______________________</li><li>Family vote: miracle, master carpenter, or both? Defend your answer.</li></ul>"
        },
        {
          "heading": "The Oldest Church (at San Miguel Chapel)",
          "content": "<p>Built around 1610, San Miguel is the oldest church in the United States, constructed by Tlaxcalan laborers under Spanish direction.</p><ul><li>How old is it? About _____ years.</li><li>Find the 400-year-old bell. What do you think it has 'heard' in four centuries?</li><li>Discussion: people have prayed in this room since before the King James Bible was printed. What does that kind of continuity do to a place?</li></ul>"
        },
        {
          "heading": "After You Get Home: Paint the Desert",
          "content": "<p>Georgia O'Keeffe said the desert gave her subjects she couldn't find anywhere else. Get watercolors or pastels and paint the Santa Fe landscape from memory or from your photos: adobe walls, big sky, one dramatic cloud. No wrong answers. Title your painting and hang it where you'll see it.</p>"
        }
      ]
    },
    "faithConnection": "San Miguel Chapel, circa 1610, is the oldest church in the United States, and the Loretto Chapel's staircase has drawn pilgrims of curiosity for 150 years. In Santa Fe, faith isn't a chapter of the history. It's the oldest building in town.",
    "seoTitle": "Educational Family Trip to Santa Fe | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Santa Fe with our homeschool field trip guide: the oldest capital, the missions, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips santa fe",
      "homeschool field trips santa fe",
      "santa fe homeschool field trip"
    ]
  },
  {
    "slug": "yellowstone",
    "name": "Yellowstone",
    "state": "WY",
    "stateName": "Wyoming",
    "tagline": "Creation on the grandest scale in America.",
    "heroImageUrl": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "Yellowstone was the world's first national park, set aside in 1872, and it still feels like the planet showing off. Half the world's geysers are here. A canyon deeper than a skyscraper is tall. Bison, elk, bears, and wolves roam valleys that look the way they did ten thousand years ago. For a Christian family, it's hard to walk the boardwalks past Grand Prismatic Spring, all impossible color and steam, and not think of the verse about the heavens declaring glory. The declaration is just very loud here.\n\nWhat makes Yellowstone an education, not just a vacation, is that it's alive under your feet. The whole park sits on a supervolcano's caldera. Old Faithful erupts on a schedule you can set your watch by, give or take ten minutes. The mud pots burp, the hot springs build terraces of travertine, and rangers will happily explain the geology to any kid who asks. This is earth science you can stand inside.\n\nThe wildlife story is a redemption story. Wolves were wiped out here by the 1920s and reintroduced in 1995, and watching the ecosystem rebalance has taught scientists, and the rest of us, how intricately creation is put together. The Lamar Valley at dawn, with wolf watchers' scopes lined up and elk bugling in the fall, is one of the great wildlife experiences on earth.\n\nPractical truth: Yellowstone is huge, the crowds are real, and the weather does whatever it wants. Go in with a plan, get up early, and you'll have the park's wonders nearly to yourself before the tour buses wake up.",
    "whatToSee": [
      {
        "name": "Old Faithful and the Upper Geyser Basin",
        "description": "The famous geyser erupts roughly every 90 minutes. Walk the boardwalks of the Upper Basin while you wait; it holds the world's densest cluster of geysers."
      },
      {
        "name": "Grand Prismatic Spring",
        "description": "The rainbow-colored hot spring. See it twice: from the boardwalk at its edge, and from the Fairy Falls overlook trail above for the full postcard view."
      },
      {
        "name": "Grand Canyon of the Yellowstone",
        "description": "A 20-mile canyon with two thundering waterfalls. Artist Point at sunrise is the classic view, and usually empty that early."
      },
      {
        "name": "Lamar Valley",
        "description": "The 'Serengeti of North America.' Go at dawn or dusk with binoculars for bison, elk, bears, and possibly wolves. Bring the spotting scope if you have one."
      },
      {
        "name": "Mammoth Hot Springs",
        "description": "Terraces of travertine that look like a frozen waterfall. The boardwalk loop is easy walking, and the elk that lounge on the parade ground are a bonus."
      },
      {
        "name": "Norris Geyser Basin",
        "description": "The hottest, most volatile basin in the park. Steamboat Geyser, the world's tallest active geyser, lives here. Otherworldly and uncrowded."
      },
      {
        "name": "The Junior Ranger program",
        "description": "Pick up the free booklet at any visitor center. Kids complete activities across the park and get sworn in by a ranger. Do not skip this."
      }
    ],
    "bestAges": "Ages 7 and up. Younger kids love the geysers and animals; older kids get the geology and the wolf story.",
    "bestTimeToVisit": "June or September. July and August bring the biggest crowds; the park's high elevation means snow can linger into June and return in September.",
    "tripLength": "3 to 4 days minimum. The park is bigger than Rhode Island and Delaware combined; don't try to day-trip it.",
    "beforeYouGo": [
      "Book lodging 6 to 12 months out. In-park lodges and gateway towns fill up fast.",
      "Get the Junior Ranger booklet plan and a park map before you arrive.",
      "Pack layers, rain gear, and bear spray. Yellowstone weather ignores the forecast.",
      "Watch a documentary on the 1995 wolf reintroduction so Lamar Valley means something."
    ],
    "studyGuide": {
      "title": "Yellowstone Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: The Supervolcano",
          "content": "<p>Yellowstone sits on one of the largest volcanic systems on earth. Research the basics:</p><ul><li>About how many years ago was the last major eruption? _____</li><li>How many geysers does Yellowstone hold, roughly? _____ (Hint: about half the world's total.)</li><li>What makes a geyser different from a hot spring? ______________________</li><li>Discussion: 'The heavens declare the glory of God' (Psalm 19:1). What do you think the psalmist would have made of Grand Prismatic Spring?</li></ul>"
        },
        {
          "heading": "Geyser Watch (at Old Faithful)",
          "content": "<p>Old Faithful isn't actually the biggest or most regular geyser in the park, but it's the most predictable. Rangers post predicted eruption times with a 10-minute window.</p><ul><li>Predicted time: _____ Actual time: _____. How close was the prediction?</li><li>How high did the water go? _____ feet. How long did it last? _____ minutes.</li><li>While you wait, walk part of the Upper Geyser Basin boardwalk. Name two other geysers you saw: __________ and __________.</li></ul>"
        },
        {
          "heading": "Creation Observation Journal (anywhere in the park)",
          "content": "<p>Find a quiet spot, sit for ten minutes, and write down everything you notice with each sense. Then answer:</p><ul><li>Something I saw that I can't explain: ______________________</li><li>Something I heard: ______________________</li><li>Something I smelled (the park has a distinct one): ______________________</li><li>Discussion: Job 12 says to ask the animals and they will teach you. What did the park teach you today?</li></ul>"
        },
        {
          "heading": "The Wolf Story (in Lamar Valley)",
          "content": "<p>Wolves were gone from Yellowstone by the 1920s. In 1995, 14 wolves were reintroduced. Today the park holds around 100.</p><ul><li>What happened to the elk population when the wolves were gone? ______________________</li><li>How did the wolves' return change the rivers? (Ask a ranger; the answer is famous.) ______________________</li><li>Discussion: what does the wolf story tell you about how carefully creation is put together?</li></ul>"
        },
        {
          "heading": "After You Get Home: Leave No Trace Teaching",
          "content": "<p>Yellowstone's rules exist because millions of visitors could destroy what they came to see. Each family member prepares a two-minute lesson on one Leave No Trace principle and teaches it to the family using an example from the trip. Then plan one way your family will care for creation closer to home: a trail cleanup, a bird feeder, a garden. Stewardship starts where you live.</p>"
        }
      ]
    },
    "faithConnection": "Yellowstone is creation on a scale that makes Psalm 19 feel like understatement. The park's own story, from the wolf reintroduction to the geysers' clockwork, keeps pointing to a world designed with staggering care. Wonder is the lesson here, and it's a theological one.",
    "seoTitle": "Educational Family Trip to Yellowstone | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to Yellowstone with our homeschool field trip guide: geysers, wildlife, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips yellowstone",
      "homeschool field trips yellowstone",
      "yellowstone homeschool field trip"
    ]
  },
  {
    "slug": "ark-encounter",
    "name": "Ark Encounter",
    "state": "KY",
    "stateName": "Kentucky",
    "tagline": "Walk through the biggest boat in the Bible.",
    "heroImageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "The Ark Encounter is exactly what it sounds like: Noah's ark, built full-size, 510 feet long, standing in a field in Grant County, Kentucky. You see it from the parking lot and your brain has to recalibrate. Pictures don't prepare you. It's the largest timber-frame structure in the world, and walking up to it is the moment Genesis 6 stops being a flannelgraph story.\n\nInside, the ark holds three decks of exhibits: how the animals could have been housed and cared for, what Noah's family might have eaten, how eight people could have managed the daily work. Whether you arrive convinced or curious, the exhibits force the question the story has always asked: could this really have happened? The craftsmanship of the building itself, all that bent wood and joinery, makes the question feel serious in a way arguments rarely do.\n\nFor Christian families, this is the rare attraction built entirely around taking the Bible at face value, and kids feel the difference. The staff, the exhibits, the zoo outside, all of it assumes Genesis means what it says. You don't have to agree with every exhibit to have the conversation, and honestly, the disagreements make for the best dinner-table talk of the trip.\n\nPair it with the Creation Museum, about 45 minutes away in Petersburg. One day for the ark, one day for the museum, and you've got the fullest biblical-history weekend in America. Book the combo ticket and go on a weekday if you can.",
    "whatToSee": [
      {
        "name": "The Ark itself",
        "description": "Three decks of exhibits inside the full-size timber ark. Give it three to four hours; the animal-kind exhibits and the 'could eight people do this?' sections are the highlights."
      },
      {
        "name": "The Answers Center",
        "description": "Daily presentations on Genesis, the Flood, and creation science. Check the schedule when you arrive and plan around the talks that interest your family."
      },
      {
        "name": "Ararat Ridge Zoo",
        "description": "The zoo behind the ark, with kangaroos, camels, and a petting area. A good midday break for younger kids."
      },
      {
        "name": "Truth Traveler virtual reality",
        "description": "A VR ride through biblical scenes. Extra ticket, and worth it for teens who think they've seen everything."
      },
      {
        "name": "The Creation Museum (day trip)",
        "description": "45 minutes away in Petersburg. The walk through biblical history, the planetarium, and the gardens make it a full second day."
      },
      {
        "name": "Zip lines and the carousel",
        "description": "The Screaming Raptor zip lines and the 36-foot carousel give kids a physical break from the exhibits. The carousel animals are all 'kinds' from the ark."
      }
    ],
    "bestAges": "Ages 6 and up. Younger kids love the animals and the sheer size; older kids engage with the exhibits' arguments.",
    "bestTimeToVisit": "April to June or September to October. Summer is crowded and the Kentucky humidity is real; winter hours are shorter.",
    "tripLength": "1 full day for the Ark; 2 days if you add the Creation Museum, which you should.",
    "beforeYouGo": [
      "Read Genesis 6-9 together as a family. The whole flood account takes about 20 minutes.",
      "Buy the combo ticket with the Creation Museum online. It's cheaper than separate admission.",
      "Check the Answers Center schedule for speaker presentations on your visit day.",
      "Go on a weekday if possible. Saturdays and holidays are packed."
    ],
    "studyGuide": {
      "title": "Ark Encounter Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: Read the Specs",
          "content": "<p>Genesis 6:15 gives the ark's dimensions: 300 cubits long, 50 cubits wide, 30 cubits high. A cubit is about 18 inches. Do the math before you visit:</p><ul><li>Length in feet: _____ (Answer: 450. The Encounter built theirs 510 feet to match a longer cubit.)</li><li>Width in feet: _____ Height in feet: _____</li><li>How many decks did God specify? _____</li><li>Discussion: why would God give Noah exact dimensions? What does that tell you about the story?</li></ul>"
        },
        {
          "heading": "Could Eight People Do It? (inside the Ark)",
          "content": "<p>One of the best exhibits asks how eight people could feed, water, and muck out thousands of animals every day.</p><ul><li>What solution does the exhibit propose for feeding? ______________________</li><li>What about waste removal? ______________________</li><li>Find the 'kinds' exhibit. How is a 'kind' different from a modern species? ______________________</li><li>Discussion: what's the strongest argument you saw? What's the weakest?</li></ul>"
        },
        {
          "heading": "The Flood, Worldwide (at the exhibits)",
          "content": "<p>The Encounter presents the Flood as a global event that shaped the earth's geology.</p><ul><li>Name two geological features the exhibits attribute to the Flood: __________ and __________.</li><li>What does the exhibit say about the ice age? ______________________</li><li>Discussion: why does it matter whether the Flood was global or local? What changes either way?</li></ul>"
        },
        {
          "heading": "Noah's World (Answers Center talk)",
          "content": "<p>Attend one presentation at the Answers Center. Take notes like a reporter.</p><ul><li>Speaker and topic: ______________________</li><li>One thing I learned: ______________________</li><li>One question I still have: ______________________</li><li>Discussion: the Bible says Noah was 600 when the Flood came and that he 'walked with God.' What do you think a lifetime of walking with God looked like before the rain started?</li></ul>"
        },
        {
          "heading": "After You Get Home: Build It",
          "content": "<p>Using the dimensions from Genesis, build a scale model of the ark: 1 inch = 10 cubits works well (30 inches long). Use cardboard, wood, or LEGO. Include the three decks, the door in the side, and the window. Then write one paragraph: after seeing the full-size ark, what surprised you most about the real dimensions?</p>"
        }
      ]
    },
    "faithConnection": "The Ark Encounter exists because its builders believe Genesis 6-9 describes real history, and the whole attraction is an invitation to take the text seriously. For Christian families, it's the rare destination where the faith connection isn't a side note. It IS the destination.",
    "seoTitle": "Educational Family Trip to Ark Encounter | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to the Ark Encounter with our homeschool field trip guide: the full-size ark, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips ark encounter",
      "homeschool field trips ark encounter",
      "ark encounter homeschool"
    ]
  },
  {
    "slug": "museum-of-the-bible",
    "name": "Museum of the Bible",
    "state": "DC",
    "stateName": "District of Columbia",
    "tagline": "The bestselling book of all time, up close.",
    "heroImageUrl": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80",
    "heroImageCredit": "via Unsplash",
    "whyItMatters": "The Museum of the Bible sits two blocks from the National Mall, and it's the perfect companion to a D.C. trip: after a day of founding documents, spend a day with the book that shaped the founders. Eight floors, 430,000 square feet, and exhibits that treat the Bible as the most influential book in human history, which, by any honest measure, it is.\n\nWhat surprises families is how immersive it is. You walk through a recreated Nazareth village in the time of Jesus. You stand in a theater as the story of the Bible's survival unfolds around you. Kids handle replica artifacts, try writing on a scroll, and see fragments of actual ancient manuscripts. This isn't a museum of dusty cases. It's built for people who learn by doing.\n\nThe history floor traces how we got the Bible: the Dead Sea Scrolls, the first English translations, the printing press, the translators who risked their lives so ordinary people could read it. That story, of Tyndale and Wycliffe and the KJV translators, is church history your kids probably haven't heard, and it's genuinely thrilling.\n\nAnd the impact floor shows what the book did once it got loose: the abolition of slavery, the founding of hospitals and universities, the civil rights movement quoting Amos. Whatever your kids believe about the Bible, they'll leave understanding why it matters. For Christian families, it's the rare museum that treats your faith's book with the seriousness it deserves.",
    "whatToSee": [
      {
        "name": "The History of the Bible floor",
        "description": "Manuscript fragments, early printed Bibles, and the story of translation. The Tyndale and King James exhibits are the heart of it."
      },
      {
        "name": "The World of Jesus of Nazareth",
        "description": "A full recreated first-century village. Walk the streets, step into the synagogue, and see the world Jesus grew up in."
      },
      {
        "name": "The Narrative of the Bible floor",
        "description": "The Hebrew Bible experience walks you through the Old Testament story with sound, light, and desert landscapes. Genuinely moving."
      },
      {
        "name": "The Impact of the Bible floor",
        "description": "How the book shaped art, science, government, and justice. The civil rights and abolition sections give parents and teens a lot to talk about."
      },
      {
        "name": "Washington Revelations",
        "description": "The 'flying' theater ride over D.C., showing the Bible's influence carved into the capital's buildings. A perfect tie-in after your Mall days."
      },
      {
        "name": "The rooftop garden",
        "description": "Biblical plants, great views of the Capitol, and a quiet place to sit. Go at sunset if the museum's open late."
      },
      {
        "name": "Manna restaurant",
        "description": "The museum's restaurant serves Mediterranean-inspired food. Convenient, good, and themed without being cheesy."
      }
    ],
    "bestAges": "Ages 8 and up for the full experience; younger kids enjoy the Nazareth village, the ride, and the hands-on stations.",
    "bestTimeToVisit": "Pair it with a D.C. trip in spring or fall. The museum itself is indoors and works any time of year; weekdays are quietest.",
    "tripLength": "One full day. It's a natural add-on to 2 to 3 days on the National Mall.",
    "beforeYouGo": [
      "Buy timed-entry tickets online. Weekday mornings are the quietest.",
      "Read one Tyndale or Wycliffe story with your kids so the translation exhibits land.",
      "Plan the Washington Revelations ride early in your visit; it frames everything else.",
      "Download the museum app for the audio tours and kids' activity guides."
    ],
    "studyGuide": {
      "title": "Museum of the Bible Discovery Guide",
      "sections": [
        {
          "heading": "Before You Go: The Book's Journey",
          "content": "<p>The Bible wasn't always a book you could buy. Research its journey before you visit:</p><ul><li>What are the Dead Sea Scrolls, and why do they matter? ______________________</li><li>Who was William Tyndale, and what happened to him? ______________________</li><li>In what year was the King James Version published? _____</li><li>Discussion: why would anyone risk their life to translate a book?</li></ul>"
        },
        {
          "heading": "In the Village (World of Jesus of Nazareth)",
          "content": "<p>Walk the recreated first-century village slowly. Notice the details: the stone, the tools, the synagogue.</p><ul><li>What did a typical house look like? Sketch one room: ______________________</li><li>What surprised you about daily life in Jesus' time? ______________________</li><li>Discussion: Jesus grew up in a village like this, working with His hands. How does that change the way you picture Him?</li></ul>"
        },
        {
          "heading": "The Translators (History floor)",
          "content": "<p>Find the exhibits on Wycliffe, Tyndale, and the King James translators.</p><ul><li>Tyndale's famous quote: 'I will cause a boy that driveth the plough shall know more of the Scripture than thou dost.' What did he mean? ______________________</li><li>Name one cost a translator paid for this work: ______________________</li><li>Discussion: you can read the Bible freely today because people died for it. What do you owe them?</li></ul>"
        },
        {
          "heading": "The Book in Action (Impact floor)",
          "content": "<p>The impact floor traces the Bible's influence on abolition, civil rights, hospitals, and universities.</p><ul><li>Which verse did Martin Luther King Jr. quote most famously? (Hint: 'justice roll down like waters.') ______________________</li><li>Name one hospital or university founded because of Christian conviction: ______________________</li><li>Discussion: the same book has been used to justify both slavery and abolition. How do you tell the difference between using the Bible and misusing it?</li></ul>"
        },
        {
          "heading": "After You Get Home: Your Family's Bible Story",
          "content": "<p>Every Christian family has a Bible story: the grandmother's worn KJV, the verse on the wall, the baptism. Interview the oldest believer in your family. Ask: when did the Bible become real to you? Record the answer, write it down, and keep it. Then pick one verse as a family to memorize together this month. Start with something short and load-bearing, like Micah 6:8 or John 10:10.</p>"
        }
      ]
    },
    "faithConnection": "This is a museum built around the conviction that the Bible is the most influential book in human history. The translation martyrs, the Nazareth village, the impact exhibits: for Christian families, the faith connection isn't an angle. It's the building.",
    "seoTitle": "Educational Family Trip to Museum of the Bible | Homeschool Field Trip Guide",
    "seoDescription": "Plan an educational family trip to the Museum of the Bible with our homeschool field trip guide: exhibits, study guides, and printable activities.",
    "targetKeywords": [
      "educational family trips museum of the bible",
      "homeschool field trips museum of the bible",
      "museum of the bible homeschool"
    ]
  }
];

export function getDestinationBySlug(slug: string): TravelEdDestination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
