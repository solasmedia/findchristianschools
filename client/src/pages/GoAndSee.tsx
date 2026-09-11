import { useState, useEffect, useCallback, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Eye, ClipboardList, HelpCircle, Layers, CheckSquare, AlertTriangle, Save, FolderOpen,
  Download, Trash2, Plus, RotateCcw, MapPin, Calendar, User, ChevronRight, ChevronLeft,
  Shield, CheckCircle2, Workflow, Users, Leaf, MessageSquare, Sparkles, X, Lock, Scale,
  GraduationCap, Home as HomeIcon, Briefcase, Heart, LayoutGrid, DollarSign, BookOpen, Wrench,
  ThumbsUp, ThumbsDown,
} from "lucide-react";

// ---------- Presets ----------

type PresetKey = "base" | "school" | "realestate" | "business" | "ministry";

interface CategoryDef {
  key: string;
  label: string;
  icon: React.ReactNode;
  bg: string;
  detail: string;
}

interface ListenItem {
  title: string;
  desc: string;
}

interface PresetConfig {
  key: PresetKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  whatIs: string;
  whatIsNot: string[];
  categories: CategoryDef[];
  askQuestions: string[];
  listenFor: ListenItem[];
  escalate: string[];
  commonCauses: string[];
  riskFlags: string[];
  areaLabel: string;
  areaPlaceholder: string;
  locationPlaceholder: string;
  hasPrice: boolean;
  priceLabel: string;
  verdictLabels: [string, string, string];
  defaultTitle: string;
}

const BG = [
  "bg-red-50 border-red-200 text-red-700",
  "bg-blue-50 border-blue-200 text-blue-700",
  "bg-purple-50 border-purple-200 text-purple-700",
  "bg-green-50 border-green-200 text-green-700",
  "bg-teal-50 border-teal-200 text-teal-700",
  "bg-orange-50 border-orange-200 text-orange-700",
];

const icn = (className = "w-3.5 h-3.5") => ({ className });

const PRESETS: Record<PresetKey, PresetConfig> = {
  base: {
    key: "base",
    label: "General",
    icon: Eye,
    tagline: "The original go-and-see practice — works for any team, space, or process.",
    whatIs: "Stepping into the place where the work actually happens, watching how it really runs, and listening to the people doing it — before deciding what needs to change.",
    whatIsNot: ["A surprise audit of any one person", "A hunt for someone to blame", "A walk built only on assumptions or last month's reports"],
    categories: [
      { key: "Safety", label: "Safety", icon: <Shield {...icn()} />, bg: BG[0], detail: "Unsafe conditions, strain, near misses, exposure." },
      { key: "Quality", label: "Quality", icon: <CheckCircle2 {...icn()} />, bg: BG[1], detail: "Defects, rework, missing checks, avoidable errors." },
      { key: "Process", label: "Process", icon: <Workflow {...icn()} />, bg: BG[2], detail: "Delays, handoffs, unclear steps, extra motion." },
      { key: "People", label: "People", icon: <Users {...icn()} />, bg: BG[3], detail: "Training gaps, overload, workarounds, fatigue." },
      { key: "Environment", label: "Environment", icon: <Leaf {...icn()} />, bg: BG[4], detail: "Layout, noise, clutter, cleanliness, conditions." },
      { key: "Communication", label: "Comm.", icon: <MessageSquare {...icn()} />, bg: BG[5], detail: "Missing information, unclear expectations, slow approvals." },
    ],
    askQuestions: [
      "Walk me through what happens from the moment this starts.",
      "What makes this easier, and what makes it harder?",
      "Where do you usually get stuck?",
      "What rework or redo shows up most often?",
      "If this breaks, what's the first sign?",
      "What do you wish leadership understood about this?",
      "Where does work wait on information, approval, or someone else?",
      "What's one small change that would remove friction right away?",
    ],
    listenFor: [
      { title: "Repeated workarounds", desc: '"We usually just..." or "the only way around it is..."' },
      { title: "Hidden waiting", desc: "Time lost to approvals, steps, or a slow response." },
      { title: "Unclear ownership", desc: '"Nobody knows," "they handle that," or "I\'m just waiting."' },
      { title: "Inconsistent practice", desc: '"Everyone does it a little differently."' },
    ],
    escalate: [
      "An active safety risk or near miss",
      "A possible harm or welfare concern to someone in the space",
      "Compliance, licensing, or legal exposure",
      "Repeated or severe harm to quality, service, or reputation",
    ],
    commonCauses: [
      "Unclear expectations", "Training gap", "Weak handoff between people",
      "Too many competing priorities", "Approval or paperwork delay", "Staffing or capacity",
      "Facility or layout issue", "Scheduling conflict", "Communication gap", "No clear owner",
    ],
    riskFlags: ["Safety", "Compliance / legal", "Quality / service", "Customer experience", "People wellbeing", "Reputation"],
    areaLabel: "Area / location",
    areaPlaceholder: "e.g., Front office, Warehouse floor",
    locationPlaceholder: "Room, station, point in the process",
    hasPrice: false,
    priceLabel: "",
    verdictLabels: ["Good shape", "Mixed", "Concerning"],
    defaultTitle: "Go and See Walk",
  },

  school: {
    key: "school",
    label: "School",
    icon: GraduationCap,
    tagline: "For principals and school leaders walking classrooms and campus.",
    whatIs: "Stepping into classrooms and common areas, watching how the day actually runs, and listening to the teachers and staff doing the work — before deciding what needs to change.",
    whatIsNot: ["A surprise evaluation of any one teacher", "A hunt for someone to blame", "A walk built only on last month's reports"],
    categories: [
      { key: "Safety", label: "Safety", icon: <Shield {...icn()} />, bg: BG[0], detail: "Unsafe conditions, playground hazards, blocked exits, unaddressed near misses." },
      { key: "Instruction", label: "Instruction", icon: <BookOpen {...icn()} />, bg: BG[1], detail: "Engagement, pacing, unclear directions, students lost or unchallenged." },
      { key: "Culture", label: "Culture", icon: <Users {...icn()} />, bg: BG[2], detail: "Tone in the halls, discipline patterns, how students treat one another." },
      { key: "Facilities", label: "Facilities", icon: <Wrench {...icn()} />, bg: BG[3], detail: "Facility upkeep, noise, cleanliness, classroom setup and supplies." },
      { key: "Staff", label: "Staff", icon: <Sparkles {...icn()} />, bg: BG[4], detail: "Teacher workload, morale, training gaps, workarounds staff rely on." },
      { key: "Communication", label: "Comm.", icon: <MessageSquare {...icn()} />, bg: BG[5], detail: "Missing information, unclear expectations, slow approvals or replies." },
    ],
    askQuestions: [
      "Walk me through a typical class period from start to finish.",
      "What makes a lesson land well, and what gets in the way?",
      "Where do students get stuck most often?",
      "What's the first sign a lesson is losing the room?",
      "What do you wish leadership understood about your classroom?",
      "Where does work wait on approval, supplies, or support staff?",
      "What's one small change that would make tomorrow easier?",
      "How do new students or new hires get up to speed here?",
    ],
    listenFor: [
      { title: "Repeated workarounds", desc: '"We usually just..." or "the only way around it is..."' },
      { title: "Hidden waiting", desc: "Time lost to approvals, supplies, or a slow response from support staff." },
      { title: "Unclear ownership", desc: '"Nobody knows," "they handle that," or "I\'m just waiting."' },
      { title: "Inconsistent practice", desc: '"Every teacher does it a little differently."' },
    ],
    escalate: [
      "An active safety risk or near miss",
      "A possible child safety or welfare concern",
      "Compliance, licensing, or legal exposure",
      "Repeated or severe harm to a student's learning or wellbeing",
    ],
    commonCauses: [
      "Unclear expectations", "Training gap", "Weak handoff between staff",
      "Too many competing priorities", "Approval or paperwork delay", "Class size or staffing",
      "Facility or layout issue", "Scheduling conflict", "Communication gap", "No clear owner",
    ],
    riskFlags: ["Student safety", "Compliance / licensing", "Academic quality", "Family experience", "Staff wellbeing", "Reputation"],
    areaLabel: "Area / campus",
    areaPlaceholder: "e.g., Lower school, Gym",
    locationPlaceholder: "Room, hallway, station",
    hasPrice: false,
    priceLabel: "",
    verdictLabels: ["Strong", "Mixed", "Needs attention"],
    defaultTitle: "Campus Walkthrough",
  },

  realestate: {
    key: "realestate",
    label: "Real Estate",
    icon: HomeIcon,
    tagline: "For touring homes or rental properties, room by room.",
    whatIs: "Standing in the space and seeing how it actually feels — the noise, the light, the little things listing photos hide — before you fall in love with the kitchen.",
    whatIsNot: ["A substitute for a licensed inspection", "A hunt for a 'perfect' property", "A walk built only on listing photos"],
    categories: [
      { key: "Safety", label: "Safety", icon: <Shield {...icn()} />, bg: BG[0], detail: "Locks, smoke/CO detectors, stairs and railings, exits, pool or hazards." },
      { key: "Location", label: "Location", icon: <MapPin {...icn()} />, bg: BG[1], detail: "Commute, schools, noise, walkability, how the street feels after dark." },
      { key: "Condition", label: "Condition", icon: <HomeIcon {...icn()} />, bg: BG[2], detail: "Roof, foundation, walls, water stains, cracks, smell of moisture or mold." },
      { key: "Layout", label: "Layout", icon: <LayoutGrid {...icn()} />, bg: BG[3], detail: "Flow between rooms, storage, natural light, whether furniture will fit." },
      { key: "Systems", label: "Systems", icon: <Wrench {...icn()} />, bg: BG[4], detail: "Age of HVAC, water heater, electrical panel, water pressure, cell signal." },
      { key: "Cost", label: "Cost", icon: <DollarSign {...icn()} />, bg: BG[5], detail: "Price versus comparable listings, HOA dues, taxes, utility cost estimates." },
    ],
    askQuestions: [
      "Walk me through why the owner is selling or renting this out.",
      "What's been replaced recently, and what hasn't been touched in years?",
      "Where do you usually get stuck showing this property?",
      "What's the first sign of a problem with this house?",
      "What do you wish buyers or renters understood before touring?",
      "Where does the process wait on inspection, financing, or paperwork?",
      "What's one thing you'd fix before listing it again?",
      "How does this compare to similar homes nearby?",
    ],
    listenFor: [
      { title: "Repeated caveats", desc: '"It just needs a little..." said more than once.' },
      { title: "Hidden waits", desc: "Time lost to financing, inspection, or closing delays." },
      { title: "Unclear ownership", desc: '"The HOA handles that," or "not sure who\'s responsible."' },
      { title: "Inconsistent upkeep", desc: '"Some rooms were redone, others weren\'t."' },
    ],
    escalate: [
      "An active safety hazard (exposed wiring, gas smell, structural)",
      "A likely major system failure (roof, foundation, HVAC)",
      "Disclosure, title, or legal red flags",
      "A deal-breaking cost surprise (assessments, liens, back taxes)",
    ],
    commonCauses: [
      "Deferred maintenance", "Outdated systems", "Water intrusion history",
      "Poor original construction", "Unpermitted work", "Neighborhood changes",
      "Pricing above comparables", "HOA restrictions", "Financing contingency risk", "Seller or landlord unresponsiveness",
    ],
    riskFlags: ["Structural / safety", "Legal / title", "Financing", "Resale value", "Neighborhood", "Cost of ownership"],
    areaLabel: "Property address",
    areaPlaceholder: "e.g., 123 Maple St, Unit 4B",
    locationPlaceholder: "e.g., Primary bath, basement, roof",
    hasPrice: true,
    priceLabel: "Price / Rent",
    verdictLabels: ["Love it", "Maybe", "Pass"],
    defaultTitle: "Property Tour",
  },

  business: {
    key: "business",
    label: "Business",
    icon: Briefcase,
    tagline: "For managers walking the floor, the store, or the shift.",
    whatIs: "Standing where the work actually happens — the floor, the counter, the line — and watching the real process instead of the one described in the org chart.",
    whatIsNot: ["A surprise performance review", "A hunt for who to blame for a bad number", "A walk built only on last month's dashboard"],
    categories: [
      { key: "Safety", label: "Safety", icon: <Shield {...icn()} />, bg: BG[0], detail: "Unsafe conditions, near misses, PPE gaps, ergonomic strain." },
      { key: "Quality", label: "Quality", icon: <CheckCircle2 {...icn()} />, bg: BG[1], detail: "Defects, rework, missed checks, customer complaints." },
      { key: "Process", label: "Process", icon: <Workflow {...icn()} />, bg: BG[2], detail: "Bottlenecks, handoffs between shifts, unclear steps, wasted motion." },
      { key: "Team", label: "Team", icon: <Users {...icn()} />, bg: BG[3], detail: "Morale, workload, training gaps, workarounds people rely on." },
      { key: "Workspace", label: "Workspace", icon: <Leaf {...icn()} />, bg: BG[4], detail: "Layout, noise, clutter, equipment condition, basic organization." },
      { key: "Communication", label: "Comm.", icon: <MessageSquare {...icn()} />, bg: BG[5], detail: "Missing information, unclear targets, slow decisions." },
    ],
    askQuestions: [
      "Walk me through this process from order to done.",
      "What makes a shift go smoothly, and what throws it off?",
      "Where do things usually back up or wait?",
      "What's the first sign something's about to go wrong?",
      "What do you wish leadership understood about this job?",
      "Where does work wait on approval, supplies, or another team?",
      "What's one small change that would help right away?",
      "How do new hires learn this — and does everyone do it the same way?",
    ],
    listenFor: [
      { title: "Repeated workarounds", desc: '"We usually just..." or "the only way around it is..."' },
      { title: "Hidden waiting", desc: "Time lost to handoffs, approvals, or system lag." },
      { title: "Unclear ownership", desc: '"Nobody knows," "they handle that," or "I\'m just waiting."' },
      { title: "Inconsistent practice", desc: "Different shifts or locations doing it differently." },
    ],
    escalate: [
      "An active safety risk or near miss",
      "Compliance, regulatory, or legal exposure",
      "A customer harm event or a spike in complaints",
      "A data, security, or cash-handling exposure",
    ],
    commonCauses: [
      "Unclear standard work", "Training gap", "Poor shift handoff",
      "Too many competing priorities", "System or equipment issue", "Layout or workspace issue",
      "Staffing or capacity", "Scheduling conflict", "Weak communication", "No clear owner",
    ],
    riskFlags: ["Safety", "Compliance / legal", "Quality / service", "Customer experience", "Team wellbeing", "Reputation"],
    areaLabel: "Area / department",
    areaPlaceholder: "e.g., Front counter, Line 2, Night shift",
    locationPlaceholder: "Station, register, workstation",
    hasPrice: false,
    priceLabel: "",
    verdictLabels: ["On track", "Watch", "At risk"],
    defaultTitle: "Site Visit",
  },

  ministry: {
    key: "ministry",
    label: "Ministry",
    icon: Heart,
    tagline: "For pastors and directors walking a service, program, or outreach.",
    whatIs: "Being present where ministry actually happens — a service, a classroom, an outreach event — and listening to the volunteers and staff carrying it, before deciding what needs to change.",
    whatIsNot: ["A surprise evaluation of any one volunteer", "A hunt for someone to blame", "A visit built only on attendance numbers"],
    categories: [
      { key: "Safety", label: "Safety & Care", icon: <Shield {...icn()} />, bg: BG[0], detail: "Child safety and safeguarding gaps, unsafe conditions, unaddressed near misses." },
      { key: "Programs", label: "Programs", icon: <Sparkles {...icn()} />, bg: BG[1], detail: "Engagement, flow, unclear roles, moments that fall flat." },
      { key: "Volunteers", label: "Volunteers", icon: <Users {...icn()} />, bg: BG[2], detail: "Burnout, training gaps, unclear expectations, workarounds." },
      { key: "Facilities", label: "Facilities", icon: <Wrench {...icn()} />, bg: BG[3], detail: "Setup and teardown, cleanliness, signage, accessibility." },
      { key: "Communication", label: "Comm.", icon: <MessageSquare {...icn()} />, bg: BG[4], detail: "Missing information, unclear expectations, slow follow-up." },
      { key: "Outreach", label: "Outreach", icon: <Heart {...icn()} />, bg: BG[5], detail: "How guests are welcomed, followed up with, and included." },
    ],
    askQuestions: [
      "Walk me through this from setup to teardown.",
      "What makes today go smoothly, and what makes it harder?",
      "Where do volunteers usually get stuck?",
      "What's the first sign something's not working?",
      "What do you wish leadership understood about serving here?",
      "Where does something wait on approval, supplies, or another team?",
      "What's one small change that would help right away?",
      "How does a first-time guest or new volunteer experience this?",
    ],
    listenFor: [
      { title: "Repeated workarounds", desc: '"We usually just..." or "the only way around it is..."' },
      { title: "Hidden waiting", desc: "Time lost to approvals, supplies, or scheduling." },
      { title: "Unclear ownership", desc: '"Nobody knows," "they handle that," or "I\'m just waiting."' },
      { title: "Inconsistent practice", desc: "Different week to week, or team to team." },
    ],
    escalate: [
      "An active safety risk or near miss",
      "A possible child safety or safeguarding concern",
      "Compliance, insurance, or background-check exposure",
      "A care crisis or conflict needing pastoral attention",
    ],
    commonCauses: [
      "Unclear expectations", "Volunteer training gap", "Weak handoff between teams",
      "Too many competing priorities", "Approval or supply delay", "Volunteer capacity",
      "Facility or layout issue", "Scheduling conflict", "Communication gap", "No clear owner",
    ],
    riskFlags: ["Child safety / safeguarding", "Compliance / insurance", "Volunteer wellbeing", "Guest experience", "Facility", "Reputation"],
    areaLabel: "Area / ministry",
    areaPlaceholder: "e.g., Children's ministry, Sunday service",
    locationPlaceholder: "Room, station, check-in table",
    hasPrice: false,
    priceLabel: "",
    verdictLabels: ["Thriving", "Mixed", "Needs support"],
    defaultTitle: "Ministry Walk",
  },
};

const PRESET_ORDER: PresetKey[] = ["base", "school", "realestate", "business", "ministry"];
const getPreset = (key: PresetKey) => PRESETS[key] || PRESETS.base;

const STEPS = [
  { n: 1, title: "Before", items: ["Set a clear purpose for the walk.", "Choose the area, time, and people to learn from.", "Skim known issues, but don't let reports drive the whole visit."] },
  { n: 2, title: "During", items: ["Watch the work first, then ask open questions.", "Capture exact facts, not opinions dressed up as facts.", "Notice delays, safety risk, confusion, and workarounds."] },
  { n: 3, title: "After", items: ["Cluster what you saw into patterns.", "Separate urgent issues from items that can wait.", "Assign follow-up and check again on the next walk."] },
];

const TRAPS = [
  "Leading the witness with your own answer",
  "Turning the walk into a performance review",
  "Recording opinions as if they were verified facts",
];

// ---------- Data model ----------

interface Observation {
  id: string;
  categories: string[];
  description: string;
  location: string;
  actionNeeded: string;
  owner: string;
  dueDate: string;
  evidence: string;
  escalate: boolean;
  recurring: boolean;
}

interface PatternRow {
  id: string;
  issue: string;
  evidence: string;
  frequency: string;
}

interface ActionItem {
  id: string;
  action: string;
  owner: string;
  due: string;
  status: "Not started" | "In progress" | "Done";
  verify: string;
}

type Verdict = "" | "positive" | "neutral" | "negative";

interface Walkthrough {
  id: string;
  preset: PresetKey;
  title: string;
  area: string;
  date: string;
  observer: string;
  price: string;
  observations: Observation[];
  patterns: PatternRow[];
  causeChecks: Record<string, boolean>;
  causeNotes: string;
  riskFlags: Record<string, boolean>;
  parkingLot: string;
  actionItems: ActionItem[];
  verdict: Verdict;
  communicateBack: string;
  checkNextTime: string;
  nextCheckDate: string;
  savedAt?: string;
}

const STORAGE_KEY = "fcs-go-and-see-v2";
const HISTORY_KEY = "fcs-go-and-see-history-v2";

const generateId = () => Math.random().toString(36).slice(2, 10);

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function blankWalkthrough(preset: PresetKey = "base"): Walkthrough {
  return {
    id: generateId(),
    preset,
    title: getPreset(preset).defaultTitle,
    area: "",
    date: todayISO(),
    observer: "",
    price: "",
    observations: [],
    patterns: [],
    causeChecks: {},
    causeNotes: "",
    riskFlags: {},
    parkingLot: "",
    actionItems: [],
    verdict: "",
    communicateBack: "",
    checkNextTime: "",
    nextCheckDate: "",
  };
}

function loadCurrent(): Walkthrough {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const preset: PresetKey = PRESET_ORDER.includes(parsed.preset) ? parsed.preset : "base";
      return { ...blankWalkthrough(preset), ...parsed, preset };
    }
  } catch {
    // ignore corrupt storage
  }
  return blankWalkthrough("base");
}

function loadHistory(): Walkthrough[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt storage
  }
  return [];
}

const TABS = [
  { key: "guide", label: "Field Guide", icon: Eye },
  { key: "observe", label: "Observations", icon: ClipboardList },
  { key: "ask", label: "Ask & Listen", icon: HelpCircle },
  { key: "patterns", label: "Patterns", icon: Layers },
  { key: "plan", label: "Action Plan", icon: CheckSquare },
  { key: "compare", label: "Compare", icon: Scale },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function GoAndSee() {
  const [walk, setWalk] = useState<Walkthrough>(loadCurrent);
  const [history, setHistory] = useState<Walkthrough[]>(loadHistory);
  const [tab, setTab] = useState<TabKey>("guide");
  const [showHistory, setShowHistory] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const preset = getPreset(walk.preset);

  // Autosave the active walk to this device only.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(walk));
    } catch {
      // storage may be unavailable (private browsing, quota) — fail silently
    }
  }, [walk]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const update = useCallback((patch: Partial<Walkthrough>) => {
    setWalk((w) => ({ ...w, ...patch }));
  }, []);

  // ---- Preset switching ----
  const switchPreset = (key: PresetKey) => {
    if (key === walk.preset) return;
    const oldPreset = getPreset(walk.preset);
    const newPreset = getPreset(key);
    const titleWasDefault = walk.title === oldPreset.defaultTitle;
    update({ preset: key, title: titleWasDefault ? newPreset.defaultTitle : walk.title });
  };

  // ---- Observations ----
  const addObservation = () => {
    const obs: Observation = {
      id: generateId(), categories: [], description: "", location: "", actionNeeded: "",
      owner: "", dueDate: "", evidence: "", escalate: false, recurring: false,
    };
    update({ observations: [...walk.observations, obs] });
  };
  const updateObservation = (id: string, patch: Partial<Observation>) => {
    update({ observations: walk.observations.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
  };
  const toggleObsCategory = (id: string, cat: string) => {
    const obs = walk.observations.find((o) => o.id === id);
    if (!obs) return;
    const has = obs.categories.includes(cat);
    updateObservation(id, { categories: has ? obs.categories.filter((c) => c !== cat) : [...obs.categories, cat] });
  };
  const deleteObservation = (id: string) => update({ observations: walk.observations.filter((o) => o.id !== id) });

  // ---- Patterns ----
  const addPattern = () => update({ patterns: [...walk.patterns, { id: generateId(), issue: "", evidence: "", frequency: "" }] });
  const updatePattern = (id: string, patch: Partial<PatternRow>) =>
    update({ patterns: walk.patterns.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const deletePattern = (id: string) => update({ patterns: walk.patterns.filter((p) => p.id !== id) });

  // ---- Action items ----
  const addAction = () =>
    update({ actionItems: [...walk.actionItems, { id: generateId(), action: "", owner: "", due: "", status: "Not started", verify: "" }] });
  const updateAction = (id: string, patch: Partial<ActionItem>) =>
    update({ actionItems: walk.actionItems.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
  const deleteAction = (id: string) => update({ actionItems: walk.actionItems.filter((a) => a.id !== id) });

  // ---- Save / load / new ----
  const saveSnapshot = () => {
    const snapshot: Walkthrough = { ...walk, savedAt: new Date().toISOString() };
    setHistory((h) => [snapshot, ...h.filter((x) => x.id !== walk.id)].slice(0, 50));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };
  const loadSnapshot = (w: Walkthrough) => {
    setWalk(w);
    setShowHistory(false);
    setTab("guide");
  };
  const deleteSnapshot = (id: string) => setHistory((h) => h.filter((x) => x.id !== id));
  const startNew = () => {
    if (walk.observations.length === 0 || window.confirm("Start a new walk? Unsaved changes to the current one will be replaced (save a snapshot first if you want to keep it).")) {
      setWalk(blankWalkthrough(walk.preset));
      setTab("guide");
    }
  };
  const clearAllData = () => {
    if (window.confirm("This clears the current walk and every saved snapshot from this device. This cannot be undone. Continue?")) {
      setWalk(blankWalkthrough(walk.preset));
      setHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(HISTORY_KEY);
      } catch {
        // ignore
      }
    }
  };

  // ---- Compare (across saved walks of the same preset) ----
  const compareEntries = useMemo(() => {
    const savedForPreset = history.filter((h) => h.preset === walk.preset);
    const currentIncluded = savedForPreset.some((h) => h.id === walk.id);
    return currentIncluded ? savedForPreset : [walk, ...savedForPreset];
  }, [history, walk]);

  const majorCount = (w: Walkthrough) => w.observations.filter((o) => o.escalate).length;
  const openCompareRow = (w: Walkthrough) => {
    if (w.id === walk.id) { setTab("observe"); return; }
    setWalk(w);
    setTab("observe");
  };

  // ---- Export / print ----
  const exportReport = () => {
    const catLabel = (cats: string[]) => cats.map((c) => preset.categories.find((x) => x.key === c)?.label || c).join(", ") || "—";
    const esc = (s: string) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const verdictText = walk.verdict === "positive" ? preset.verdictLabels[0] : walk.verdict === "neutral" ? preset.verdictLabels[1] : walk.verdict === "negative" ? preset.verdictLabels[2] : "—";

    const obsRows = walk.observations.map((o, i) => `
      <tr>
        <td class="idx">${i + 1}</td>
        <td>${esc(catLabel(o.categories))}${o.escalate ? ' <span class="tag tag-red">Escalate</span>' : ""}${o.recurring ? ' <span class="tag tag-amber">Trend</span>' : ""}</td>
        <td>${esc(o.description) || "—"}</td>
        <td>${esc(o.location) || "—"}</td>
        <td>${esc(o.actionNeeded) || "—"}</td>
        <td>${esc(o.owner) || "—"}</td>
        <td>${esc(o.dueDate) || "—"}</td>
      </tr>`).join("");

    const patternRows = walk.patterns.map((p) => `
      <tr><td>${esc(p.issue) || "—"}</td><td>${esc(p.evidence) || "—"}</td><td>${esc(p.frequency) || "—"}</td></tr>`).join("");

    const actionRows = walk.actionItems.map((a) => `
      <tr><td>${esc(a.action) || "—"}</td><td>${esc(a.owner) || "—"}</td><td>${esc(a.due) || "—"}</td><td>${esc(a.status)}</td><td>${esc(a.verify) || "—"}</td></tr>`).join("");

    const checkedCauses = preset.commonCauses.filter((c) => walk.causeChecks[c]);
    const flaggedRisks = preset.riskFlags.filter((r) => walk.riskFlags[r]);

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${esc(walk.title)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; max-width: 900px; margin: 0 auto; padding: 28px 22px; color: #1a1a2e; background: #fff; font-size: 12.5px; }
  h1 { font-size: 22px; color: #002855; }
  h2 { font-size: 15px; color: #002855; margin: 22px 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .meta { color: #64748b; font-size: 12px; margin-top: 4px; }
  .meta span { margin-right: 14px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th { text-align: left; padding: 6px 8px; background: #f1f5f9; color: #475569; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .4px; border-bottom: 1px solid #e2e8f0; }
  td { padding: 7px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  td.idx { color: #94a3b8; width: 24px; }
  .empty { color: #94a3b8; font-style: italic; padding: 8px 0; }
  .tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-left: 4px; }
  .tag-red { background: #fee2e2; color: #b91c1c; }
  .tag-amber { background: #fef3c7; color: #92400e; }
  .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-top: 6px; }
  .chips span { display: inline-block; background: #eef2ff; color: #3730a3; font-size: 11px; padding: 3px 9px; border-radius: 999px; margin: 2px 4px 2px 0; }
  .footer { margin-top: 26px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 12px 10px; } h2 { break-after: avoid; } tr { break-inside: avoid; } }
</style></head><body>
<h1>${esc(walk.title)}</h1>
<div class="meta">
  <span><strong>${esc(preset.areaLabel)}:</strong> ${esc(walk.area) || "—"}</span>
  <span><strong>Date:</strong> ${esc(walk.date) || "—"}</span>
  <span><strong>Observer:</strong> ${esc(walk.observer) || "—"}</span>
  ${preset.hasPrice ? `<span><strong>${esc(preset.priceLabel)}:</strong> ${esc(walk.price) || "—"}</span>` : ""}
  <span><strong>Verdict:</strong> ${verdictText}</span>
</div>

<h2>Observations</h2>
${walk.observations.length ? `<table><thead><tr><th></th><th>Category</th><th>What was observed</th><th>Location</th><th>Immediate action</th><th>Owner</th><th>Due</th></tr></thead><tbody>${obsRows}</tbody></table>` : `<p class="empty">No observations recorded.</p>`}

<h2>Pattern Review</h2>
${walk.patterns.length ? `<table><thead><tr><th>Pattern / issue</th><th>Evidence</th><th>Seen how often?</th></tr></thead><tbody>${patternRows}</tbody></table>` : `<p class="empty">No patterns logged.</p>`}
<div class="box">
  <strong>Likely causes:</strong> ${checkedCauses.length ? `<div class="chips">${checkedCauses.map((c) => `<span>${esc(c)}</span>`).join("")}</div>` : `<span class="empty">None checked</span>`}
  ${walk.causeNotes ? `<p style="margin-top:8px">${esc(walk.causeNotes)}</p>` : ""}
</div>
<div class="box">
  <strong>Risk flags:</strong> ${flaggedRisks.length ? `<div class="chips">${flaggedRisks.map((r) => `<span>${esc(r)}</span>`).join("")}</div>` : `<span class="empty">None flagged</span>`}
</div>
${walk.parkingLot ? `<div class="box"><strong>Parking lot:</strong><p style="margin-top:6px">${esc(walk.parkingLot)}</p></div>` : ""}

<h2>Action Plan</h2>
${walk.actionItems.length ? `<table><thead><tr><th>Action</th><th>Owner</th><th>Due</th><th>Status</th><th>How will we verify?</th></tr></thead><tbody>${actionRows}</tbody></table>` : `<p class="empty">No action items recorded.</p>`}
<div class="box">
  <strong>What will I communicate back?</strong>
  <p style="margin-top:4px">${esc(walk.communicateBack) || "—"}</p>
  <strong>What must be checked next time?</strong>
  <p style="margin-top:4px">${esc(walk.checkNextTime) || "—"}</p>
  <strong>Next check date:</strong> ${esc(walk.nextCheckDate) || "—"}
</div>

<div class="footer">Find Christian Schools&trade; Go and See Tool &mdash; findchristianschools.org &mdash; Data for this tool stays on your device</div>
</body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 400);
    } else {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `go-and-see-${walk.date}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const inputCls = "w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]";
  const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wider";
  const verdictBtnCls = (active: boolean, tone: "positive" | "neutral" | "negative") => {
    const toneCls = tone === "positive" ? "bg-green-100 border-green-300 text-green-800" : tone === "neutral" ? "bg-amber-100 border-amber-300 text-amber-800" : "bg-red-100 border-red-300 text-red-800";
    return `flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border font-semibold transition-colors ${active ? toneCls : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero */}
      <section className="bg-[#002855] py-8 sm:py-10">
        <div className="container max-w-4xl text-center">
          <input
            type="text"
            value={walk.title}
            onChange={(e) => update({ title: e.target.value })}
            className="text-2xl sm:text-3xl font-bold text-white bg-transparent border-b-2 border-white/30 outline-none text-center w-full max-w-lg mx-auto"
          />
          <p className="text-blue-100/70 text-xs mt-2 max-w-md mx-auto">{preset.tagline}</p>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-blue-100/80">
            <Lock className="w-3.5 h-3.5" />
            <span>Free tool &middot; Everything you type is saved only in this browser, on this device</span>
          </div>
        </div>
      </section>

      {/* Preset selector */}
      <section className="border-b border-gray-200 bg-white">
        <div className="w-full max-w-4xl mx-auto px-4 py-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">What are you walking?</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PRESET_ORDER.map((key) => {
              const p = PRESETS[key];
              const Icon = p.icon;
              const isActive = walk.preset === key;
              return (
                <button
                  key={key}
                  onClick={() => switchPreset(key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive ? "bg-[#002855] border-[#002855] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-[#002855]/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="border-b border-gray-200 bg-white">
        <div className="w-full max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button onClick={() => setShowHistory(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-[#002855]/40 hover:text-[#002855] transition-colors">
              <FolderOpen className="w-3.5 h-3.5" /> Saved ({history.length})
            </button>
            <button onClick={saveSnapshot} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-[#002855]/40 hover:text-[#002855] transition-colors">
              <Save className="w-3.5 h-3.5" /> {savedFlash ? "Saved!" : "Save snapshot"}
            </button>
            <button onClick={startNew} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-[#002855]/40 hover:text-[#002855] transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> New
            </button>
          </div>
          <button onClick={exportReport} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#002855] text-white text-xs font-semibold hover:bg-[#003d7a] transition-colors">
            <Download className="w-3.5 h-3.5" /> Export / print report
          </button>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-gray-200 bg-[#f8f9fb] sticky top-0 z-20">
        <div className="w-full max-w-4xl mx-auto px-2 overflow-x-auto">
          <div className="flex">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    active ? "border-[#002855] text-[#002855]" : "border-transparent text-gray-500 hover:text-[#002855]"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                  {t.key === "observe" && walk.observations.length > 0 && (
                    <span className="ml-1 text-[10px] bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5">{walk.observations.length}</span>
                  )}
                  {t.key === "compare" && compareEntries.length > 1 && (
                    <span className="ml-1 text-[10px] bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5">{compareEntries.length}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex-1 bg-[#f8f9fb]">
        <div className="w-full max-w-4xl mx-auto px-4 py-6">

          {/* ---------------- Field Guide ---------------- */}
          {tab === "guide" && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wide mb-2">What "go and see" means</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{preset.whatIs}</p>
                  <p className="text-sm font-medium text-gray-700 mt-3">Reports tell you what happened. Going and seeing helps you learn why.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wide mb-2">What it isn't</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {preset.whatIsNot.map((item, i) => (
                      <li key={i} className="flex items-start gap-2"><X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /> {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wide mb-3">What to observe</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {preset.categories.map((c) => (
                    <div key={c.key} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border mb-2 ${c.bg}`}>
                        {c.icon} {c.label}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {STEPS.map((step) => (
                  <div key={step.n} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-[#002855] text-white text-xs font-bold flex items-center justify-center">{step.n}</span>
                      <h4 className="text-sm font-bold text-[#002855]">{step.title}</h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {step.items.map((it, i) => <li key={i}>&bull; {it}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <button onClick={() => setTab("observe")} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#002855] text-white rounded-xl font-semibold hover:bg-[#003d7a] transition-colors">
                Start recording observations <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ---------------- Observations ---------------- */}
          {tab === "observe" && (
            <div className="space-y-4">
              <div className={`bg-white rounded-xl border border-gray-200 p-4 grid sm:grid-cols-2 ${preset.hasPrice ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-3`}>
                <div>
                  <label className={labelCls}><MapPin className="w-3 h-3 inline mr-1" />{preset.areaLabel}</label>
                  <input type="text" value={walk.area} onChange={(e) => update({ area: e.target.value })} placeholder={preset.areaPlaceholder} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}><Calendar className="w-3 h-3 inline mr-1" />Date</label>
                  <input type="date" value={walk.date} onChange={(e) => update({ date: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}><User className="w-3 h-3 inline mr-1" />Observer</label>
                  <input type="text" value={walk.observer} onChange={(e) => update({ observer: e.target.value })} placeholder="Your name" className={inputCls} />
                </div>
                {preset.hasPrice && (
                  <div>
                    <label className={labelCls}><DollarSign className="w-3 h-3 inline mr-1" />{preset.priceLabel}</label>
                    <input type="text" value={walk.price} onChange={(e) => update({ price: e.target.value })} placeholder="$" className={inputCls} />
                  </div>
                )}
              </div>

              {walk.observations.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-4">No observations yet. Write down facts, not assumptions.</p>
                  <button onClick={addObservation} className="px-5 py-2.5 bg-[#002855] text-white rounded-lg font-semibold hover:bg-[#003d7a] transition-colors text-sm">
                    Add first observation
                  </button>
                </div>
              )}

              {walk.observations.map((o, idx) => (
                <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#002855]">Observation {idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={o.escalate} onChange={(e) => updateObservation(o.id, { escalate: e.target.checked })} className="rounded" /> Escalate
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={o.recurring} onChange={(e) => updateObservation(o.id, { recurring: e.target.checked })} className="rounded" /> Trend
                      </label>
                      <button onClick={() => deleteObservation(o.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {preset.categories.map((c) => {
                      const active = o.categories.includes(c.key);
                      return (
                        <button
                          key={c.key}
                          onClick={() => toggleObsCategory(o.id, c.key)}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border font-medium transition-colors ${active ? c.bg : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
                        >
                          {c.icon} {c.label}
                        </button>
                      );
                    })}
                  </div>

                  <label className={labelCls}>What did you observe?</label>
                  <textarea
                    value={o.description}
                    onChange={(e) => updateObservation(o.id, { description: e.target.value })}
                    placeholder="Describe what you saw, using facts rather than assumptions."
                    rows={2}
                    className={inputCls + " resize-none"}
                  />

                  <div className="grid sm:grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className={labelCls}>Location</label>
                      <input type="text" value={o.location} onChange={(e) => updateObservation(o.id, { location: e.target.value })} placeholder={preset.locationPlaceholder} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Immediate action needed</label>
                      <input type="text" value={o.actionNeeded} onChange={(e) => updateObservation(o.id, { actionNeeded: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Owner / follow-up</label>
                      <input type="text" value={o.owner} onChange={(e) => updateObservation(o.id, { owner: e.target.value })} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className={labelCls}>Evidence / example</label>
                      <input type="text" value={o.evidence} onChange={(e) => updateObservation(o.id, { evidence: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Due date</label>
                      <input type="date" value={o.dueDate} onChange={(e) => updateObservation(o.id, { dueDate: e.target.value })} className={inputCls} />
                    </div>
                  </div>
                </div>
              ))}

              {walk.observations.length > 0 && (
                <button onClick={addObservation} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:text-[#002855] hover:border-[#002855]/40 hover:bg-white transition-all flex items-center justify-center gap-2 font-medium">
                  <Plus className="w-4 h-4" /> Add observation
                </button>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Write what you saw, not what you think caused it. Cause comes later — facts come first.
              </div>
            </div>
          )}

          {/* ---------------- Ask & Listen ---------------- */}
          {tab === "ask" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wide mb-3">Good questions to ask</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  {preset.askQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6EBE44] mt-1.5 flex-shrink-0" /> {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wide mb-3">What to listen for</h3>
                  <div className="space-y-3 text-sm">
                    {preset.listenFor.map((l, i) => (
                      <div key={i}><span className="font-semibold text-gray-800">{l.title}</span><p className="text-xs text-gray-500">{l.desc}</p></div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Escalate now if you see</h3>
                  <ul className="space-y-1.5 text-xs text-red-700">
                    {preset.escalate.map((e, i) => <li key={i}>&bull; {e}</li>)}
                  </ul>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Traps to avoid</h3>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    {TRAPS.map((t, i) => <li key={i}>&bull; {t}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Patterns ---------------- */}
          {tab === "patterns" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#002855]">Cluster what you saw</h3>
                  <button onClick={addPattern} className="flex items-center gap-1 text-xs text-[#0055A4] font-medium hover:underline"><Plus className="w-3.5 h-3.5" /> Add row</button>
                </div>
                {walk.patterns.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4 text-center">No patterns yet. Group similar observations into a single recurring issue.</p>
                ) : (
                  <div className="space-y-2">
                    {walk.patterns.map((p) => (
                      <div key={p.id} className="grid sm:grid-cols-[2fr_2fr_1fr_auto] gap-2 items-start">
                        <input value={p.issue} onChange={(e) => updatePattern(p.id, { issue: e.target.value })} placeholder="Pattern or issue" className={inputCls + " mt-0"} />
                        <input value={p.evidence} onChange={(e) => updatePattern(p.id, { evidence: e.target.value })} placeholder="Evidence from the floor" className={inputCls + " mt-0"} />
                        <input value={p.frequency} onChange={(e) => updatePattern(p.id, { frequency: e.target.value })} placeholder="Seen how often?" className={inputCls + " mt-0"} />
                        <button onClick={() => deletePattern(p.id)} className="text-gray-400 hover:text-red-500 mt-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-[#002855] mb-3">Common causes</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {preset.commonCauses.map((c) => (
                      <label key={c} className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={!!walk.causeChecks[c]} onChange={(e) => update({ causeChecks: { ...walk.causeChecks, [c]: e.target.checked } })} className="mt-0.5 rounded" />
                        {c}
                      </label>
                    ))}
                  </div>
                  <label className={labelCls}>Likely cause notes</label>
                  <textarea value={walk.causeNotes} onChange={(e) => update({ causeNotes: e.target.value })} rows={2} className={inputCls + " resize-none"} />
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-red-700 mb-3">Risk flags</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {preset.riskFlags.map((r) => (
                        <label key={r} className="flex items-start gap-2 text-xs text-red-700 cursor-pointer">
                          <input type="checkbox" checked={!!walk.riskFlags[r]} onChange={(e) => update({ riskFlags: { ...walk.riskFlags, [r]: e.target.checked } })} className="mt-0.5 rounded" />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-amber-800 mb-2">Parking lot</h3>
                    <p className="text-[11px] text-amber-700 mb-2">Items that matter, but sit outside the scope of this walk.</p>
                    <textarea value={walk.parkingLot} onChange={(e) => update({ parkingLot: e.target.value })} rows={3} className={inputCls + " resize-none bg-white"} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Action Plan ---------------- */}
          {tab === "plan" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
                A good walk ends with action. Keep the list short, assign real owners, and verify again on the next walk.
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-[#002855] mb-3">Overall verdict</h3>
                <div className="flex gap-2">
                  <button onClick={() => update({ verdict: "positive" })} className={verdictBtnCls(walk.verdict === "positive", "positive")}>
                    <ThumbsUp className="w-3.5 h-3.5" /> {preset.verdictLabels[0]}
                  </button>
                  <button onClick={() => update({ verdict: "neutral" })} className={verdictBtnCls(walk.verdict === "neutral", "neutral")}>
                    <HelpCircle className="w-3.5 h-3.5" /> {preset.verdictLabels[1]}
                  </button>
                  <button onClick={() => update({ verdict: "negative" })} className={verdictBtnCls(walk.verdict === "negative", "negative")}>
                    <ThumbsDown className="w-3.5 h-3.5" /> {preset.verdictLabels[2]}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#002855]">Action plan</h3>
                  <button onClick={addAction} className="flex items-center gap-1 text-xs text-[#0055A4] font-medium hover:underline"><Plus className="w-3.5 h-3.5" /> Add action</button>
                </div>
                {walk.actionItems.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4 text-center">No action items yet.</p>
                ) : (
                  <div className="space-y-2">
                    {walk.actionItems.map((a) => (
                      <div key={a.id} className="grid sm:grid-cols-[2fr_1fr_1fr_1.4fr_2fr_auto] gap-2 items-start">
                        <input value={a.action} onChange={(e) => updateAction(a.id, { action: e.target.value })} placeholder="Action" className={inputCls + " mt-0"} />
                        <input value={a.owner} onChange={(e) => updateAction(a.id, { owner: e.target.value })} placeholder="Owner" className={inputCls + " mt-0"} />
                        <input type="date" value={a.due} onChange={(e) => updateAction(a.id, { due: e.target.value })} className={inputCls + " mt-0"} />
                        <select value={a.status} onChange={(e) => updateAction(a.id, { status: e.target.value as ActionItem["status"] })} className={inputCls + " mt-0"}>
                          <option>Not started</option>
                          <option>In progress</option>
                          <option>Done</option>
                        </select>
                        <input value={a.verify} onChange={(e) => updateAction(a.id, { verify: e.target.value })} placeholder="How will we verify?" className={inputCls + " mt-0"} />
                        <button onClick={() => deleteAction(a.id)} className="text-gray-400 hover:text-red-500 mt-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-[#002855] mb-3">Leadership follow-up</h3>
                  <label className={labelCls}>What will I communicate back?</label>
                  <textarea value={walk.communicateBack} onChange={(e) => update({ communicateBack: e.target.value })} rows={2} className={inputCls + " resize-none"} />
                  <label className={labelCls + " mt-3 block"}>What must be checked next time?</label>
                  <textarea value={walk.checkNextTime} onChange={(e) => update({ checkNextTime: e.target.value })} rows={2} className={inputCls + " resize-none"} />
                  <label className={labelCls + " mt-3 block"}>Next check date</label>
                  <input type="date" value={walk.nextCheckDate} onChange={(e) => update({ nextCheckDate: e.target.value })} className={inputCls} />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex flex-col justify-center">
                  <p className="text-sm text-green-900 italic leading-relaxed">
                    "The way of a fool is right in his own eyes, but a wise man listens to advice." — Proverbs 12:15
                  </p>
                  <p className="text-xs text-green-700 mt-3">Strong leaders spend time where the work happens, listening more than talking.</p>
                </div>
              </div>

              <button onClick={exportReport} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#002855] text-white rounded-xl font-semibold hover:bg-[#003d7a] transition-colors">
                <Download className="w-4 h-4" /> Export full report
              </button>
            </div>
          )}

          {/* ---------------- Compare ---------------- */}
          {tab === "compare" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
                Save a snapshot of each walk to line them up here — {preset.label.toLowerCase() === "general" ? "any go and see walk" : `${preset.label.toLowerCase()} walks`} only, side by side.
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500">
                      <th className="px-3 py-2.5">Walk</th>
                      <th className="px-3 py-2.5">{preset.areaLabel}</th>
                      <th className="px-3 py-2.5">Date</th>
                      {preset.hasPrice && <th className="px-3 py-2.5">{preset.priceLabel}</th>}
                      <th className="px-3 py-2.5">Escalated</th>
                      <th className="px-3 py-2.5">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareEntries.map((w) => {
                      const isCurrent = w.id === walk.id;
                      const major = majorCount(w);
                      return (
                        <tr key={w.id} className={`border-t border-gray-100 cursor-pointer hover:bg-gray-50 ${isCurrent ? "bg-blue-50/50" : ""}`} onClick={() => openCompareRow(w)}>
                          <td className="px-3 py-2.5 font-medium text-[#002855]">
                            {w.title} {isCurrent && !w.savedAt && <span className="text-[10px] text-gray-400 font-normal">(unsaved)</span>}
                          </td>
                          <td className="px-3 py-2.5 text-gray-600">{w.area || "—"}</td>
                          <td className="px-3 py-2.5 text-gray-600">{w.date || "—"}</td>
                          {preset.hasPrice && <td className="px-3 py-2.5 text-gray-600">{w.price || "—"}</td>}
                          <td className="px-3 py-2.5">
                            {major > 0 ? <span className="inline-flex items-center gap-1 text-red-700 font-semibold"><AlertTriangle className="w-3.5 h-3.5" /> {major}</span> : <span className="text-gray-400">0</span>}
                          </td>
                          <td className="px-3 py-2.5">
                            {w.verdict === "positive" && <span className="text-green-700 font-semibold">{preset.verdictLabels[0]}</span>}
                            {w.verdict === "neutral" && <span className="text-amber-700 font-semibold">{preset.verdictLabels[1]}</span>}
                            {w.verdict === "negative" && <span className="text-red-700 font-semibold">{preset.verdictLabels[2]}</span>}
                            {!w.verdict && <span className="text-gray-400">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {compareEntries.length <= 1 && (
                <p className="text-xs text-gray-400 italic text-center py-2">Finish another walk and save it as a snapshot to start comparing.</p>
              )}

              <button onClick={saveSnapshot} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-[#002855] rounded-xl font-semibold hover:border-[#002855]/40 transition-colors">
                <Save className="w-4 h-4" /> {savedFlash ? "Saved!" : "Save current walk as a snapshot"}
              </button>
            </div>
          )}

          {/* Tab nav footer */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setTab(TABS[Math.max(0, TABS.findIndex((t) => t.key === tab) - 1)].key)}
              disabled={tab === TABS[0].key}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#002855] disabled:opacity-0 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {tab !== TABS[TABS.length - 1].key && (
              <button
                onClick={() => setTab(TABS[Math.min(TABS.length - 1, TABS.findIndex((t) => t.key === tab) + 1)].key)}
                className="flex items-center gap-1 text-sm font-medium text-[#0055A4] hover:underline"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              Find Christian Schools&trade; Go and See Tool &mdash; nothing you enter is sent anywhere; it lives only in this browser's local storage.
            </p>
            <button onClick={clearAllData} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear all data on this device
            </button>
          </div>
        </div>
      </section>

      {/* Saved snapshots drawer */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start sm:items-center justify-center p-4" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-bold text-[#002855]">Saved on this device</h3>
              <button onClick={() => setShowHistory(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-4 space-y-2">
              {history.length === 0 && <p className="text-sm text-gray-400 italic text-center py-6">No saved snapshots yet. Use "Save snapshot" to keep a copy of a completed walk.</p>}
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-[#002855] truncate">{h.title}</p>
                      <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{getPreset(h.preset).label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{h.area || "No area"} &middot; {h.date} &middot; {h.observations.length} observations</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => loadSnapshot(h)} className="text-xs px-3 py-1.5 rounded-lg bg-[#002855] text-white font-medium hover:bg-[#003d7a]">Load</button>
                    <button onClick={() => deleteSnapshot(h.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
