import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Eye, ClipboardList, HelpCircle, Layers, CheckSquare, AlertTriangle, Save, FolderOpen,
  Download, Trash2, Plus, RotateCcw, MapPin, Calendar, User, ChevronRight, ChevronLeft,
  Shield, BookOpen, Users, Wrench, MessageSquare, Sparkles, X, Lock,
} from "lucide-react";

// ---------- Data model ----------

type Category = "Safety" | "Instruction" | "Culture" | "Facilities" | "Communication" | "Staff";

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { key: "Safety", label: "Safety", icon: <Shield className="w-3.5 h-3.5" />, color: "#b91c1c", bg: "bg-red-50 border-red-200 text-red-700" },
  { key: "Instruction", label: "Instruction", icon: <BookOpen className="w-3.5 h-3.5" />, color: "#0055A4", bg: "bg-blue-50 border-blue-200 text-blue-700" },
  { key: "Culture", label: "Culture", icon: <Users className="w-3.5 h-3.5" />, color: "#6d28d9", bg: "bg-purple-50 border-purple-200 text-purple-700" },
  { key: "Facilities", label: "Facilities", icon: <Wrench className="w-3.5 h-3.5" />, color: "#0f766e", bg: "bg-teal-50 border-teal-200 text-teal-700" },
  { key: "Staff", label: "Staff", icon: <Sparkles className="w-3.5 h-3.5" />, color: "#15803d", bg: "bg-green-50 border-green-200 text-green-700" },
  { key: "Communication", label: "Comm.", icon: <MessageSquare className="w-3.5 h-3.5" />, color: "#c2410c", bg: "bg-orange-50 border-orange-200 text-orange-700" },
];

interface Observation {
  id: string;
  categories: Category[];
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

interface Walkthrough {
  id: string;
  title: string;
  area: string;
  date: string;
  observer: string;
  observations: Observation[];
  patterns: PatternRow[];
  causeChecks: Record<string, boolean>;
  causeNotes: string;
  riskFlags: Record<string, boolean>;
  parkingLot: string;
  actionItems: ActionItem[];
  communicateBack: string;
  checkNextTime: string;
  nextCheckDate: string;
  savedAt?: string;
}

const STORAGE_KEY = "fcs-campus-walkthrough-v1";
const HISTORY_KEY = "fcs-campus-walkthrough-history-v1";

const COMMON_CAUSES = [
  "Unclear expectations", "Training gap", "Weak handoff between staff",
  "Too many competing priorities", "Approval or paperwork delay", "Class size or staffing",
  "Facility or layout issue", "Scheduling conflict", "Communication gap", "No clear owner",
];

const RISK_FLAGS = ["Student safety", "Compliance / licensing", "Academic quality", "Family experience", "Staff wellbeing", "Reputation"];

const generateId = () => Math.random().toString(36).slice(2, 10);

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function blankWalkthrough(): Walkthrough {
  return {
    id: generateId(),
    title: "Campus Walkthrough",
    area: "",
    date: todayISO(),
    observer: "",
    observations: [],
    patterns: [],
    causeChecks: {},
    causeNotes: "",
    riskFlags: {},
    parkingLot: "",
    actionItems: [],
    communicateBack: "",
    checkNextTime: "",
    nextCheckDate: "",
  };
}

function loadCurrent(): Walkthrough {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...blankWalkthrough(), ...JSON.parse(raw) };
  } catch {
    // ignore corrupt storage
  }
  return blankWalkthrough();
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
] as const;

type TabKey = typeof TABS[number]["key"];

export default function CampusWalkthrough() {
  const [walk, setWalk] = useState<Walkthrough>(loadCurrent);
  const [history, setHistory] = useState<Walkthrough[]>(loadHistory);
  const [tab, setTab] = useState<TabKey>("guide");
  const [showHistory, setShowHistory] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Autosave the active walkthrough to this device only.
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
  const toggleObsCategory = (id: string, cat: Category) => {
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
    if (walk.observations.length === 0 || window.confirm("Start a new walkthrough? Unsaved changes to the current one will be replaced (save a snapshot first if you want to keep it).")) {
      setWalk(blankWalkthrough());
      setTab("guide");
    }
  };
  const clearAllData = () => {
    if (window.confirm("This clears the current walkthrough and every saved snapshot from this device. This cannot be undone. Continue?")) {
      setWalk(blankWalkthrough());
      setHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(HISTORY_KEY);
      } catch {
        // ignore
      }
    }
  };

  // ---- Export / print ----
  const exportReport = () => {
    const catLabel = (cats: Category[]) => cats.map((c) => CATEGORIES.find((x) => x.key === c)?.label).join(", ") || "—";
    const esc = (s: string) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

    const checkedCauses = COMMON_CAUSES.filter((c) => walk.causeChecks[c]);
    const flaggedRisks = RISK_FLAGS.filter((r) => walk.riskFlags[r]);

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
  <span><strong>Area:</strong> ${esc(walk.area) || "—"}</span>
  <span><strong>Date:</strong> ${esc(walk.date) || "—"}</span>
  <span><strong>Observer:</strong> ${esc(walk.observer) || "—"}</span>
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

<div class="footer">Find Christian Schools&trade; Campus Walkthrough Tool &mdash; findchristianschools.org &mdash; Data for this tool stays on your device</div>
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
      a.download = `campus-walkthrough-${walk.date}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const inputCls = "w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]";
  const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

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
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-blue-100/80">
            <Lock className="w-3.5 h-3.5" />
            <span>Free tool &middot; Everything you type is saved only in this browser, on this device</span>
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
                  <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wide mb-2">What a walkthrough is</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Stepping into classrooms and common areas, watching how the day actually runs, and listening to the
                    teachers and staff doing the work — before deciding what needs to change.
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-3">Reports tell you what happened. Walking the campus helps you learn why.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wide mb-2">What it isn't</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /> A surprise evaluation of any one teacher</li>
                    <li className="flex items-start gap-2"><X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /> A hunt for someone to blame</li>
                    <li className="flex items-start gap-2"><X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /> A walk built only on last month's reports</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wide mb-3">What to observe</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { c: CATEGORIES[0], detail: "Unsafe conditions, playground hazards, blocked exits, unaddressed near misses." },
                    { c: CATEGORIES[1], detail: "Engagement, pacing, unclear directions, students lost or unchallenged." },
                    { c: CATEGORIES[2], detail: "Tone in the halls, discipline patterns, how students treat one another." },
                    { c: CATEGORIES[3], detail: "Facility upkeep, noise, cleanliness, classroom setup and supplies." },
                    { c: CATEGORIES[4], detail: "Teacher workload, morale, training gaps, workarounds staff rely on." },
                    { c: CATEGORIES[5], detail: "Missing information, unclear expectations, slow approvals or replies." },
                  ].map(({ c, detail }) => (
                    <div key={c.key} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border mb-2 ${c.bg}`}>
                        {c.icon} {c.label}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { n: 1, title: "Before", items: ["Set a clear purpose for the walk.", "Choose the area, time, and people to learn from.", "Skim known issues, but don't let reports drive the whole visit."] },
                  { n: 2, title: "During", items: ["Watch the work first, then ask open questions.", "Capture exact facts, not opinions dressed up as facts.", "Notice delays, safety risk, confusion, and workarounds."] },
                  { n: 3, title: "After", items: ["Cluster what you saw into patterns.", "Separate urgent issues from items that can wait.", "Assign follow-up and check again on the next walk."] },
                ].map((step) => (
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
              <div className="bg-white rounded-xl border border-gray-200 p-4 grid sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}><MapPin className="w-3 h-3 inline mr-1" />Area / campus</label>
                  <input type="text" value={walk.area} onChange={(e) => update({ area: e.target.value })} placeholder="e.g., Lower school, Gym" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}><Calendar className="w-3 h-3 inline mr-1" />Date</label>
                  <input type="date" value={walk.date} onChange={(e) => update({ date: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}><User className="w-3 h-3 inline mr-1" />Observer</label>
                  <input type="text" value={walk.observer} onChange={(e) => update({ observer: e.target.value })} placeholder="Your name" className={inputCls} />
                </div>
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
                    {CATEGORIES.map((c) => {
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
                      <input type="text" value={o.location} onChange={(e) => updateObservation(o.id, { location: e.target.value })} placeholder="Room, hallway, station" className={inputCls} />
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
                  {[
                    "Walk me through what happens from the moment this starts.",
                    "What makes this easier, and what makes it harder?",
                    "Where do you usually get stuck?",
                    "What rework or redo shows up most often?",
                    "If this breaks, what's the first sign?",
                    "What do you wish leadership understood about this?",
                    "Where does work wait on information, approval, or someone else?",
                    "What's one small change that would remove friction right away?",
                  ].map((q, i) => (
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
                    <div><span className="font-semibold text-gray-800">Repeated workarounds</span><p className="text-xs text-gray-500">"We usually just..." or "the only way around it is..."</p></div>
                    <div><span className="font-semibold text-gray-800">Hidden waiting</span><p className="text-xs text-gray-500">Time lost to approvals, steps, or a slow response.</p></div>
                    <div><span className="font-semibold text-gray-800">Unclear ownership</span><p className="text-xs text-gray-500">"Nobody knows," "they handle that," or "I'm just waiting."</p></div>
                    <div><span className="font-semibold text-gray-800">Inconsistent practice</span><p className="text-xs text-gray-500">"Everyone does it a little differently."</p></div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Escalate now if you see</h3>
                  <ul className="space-y-1.5 text-xs text-red-700">
                    <li>&bull; An active safety risk or near miss</li>
                    <li>&bull; A possible child safety or welfare concern</li>
                    <li>&bull; Compliance, licensing, or legal exposure</li>
                    <li>&bull; Repeated or severe harm to a student's learning or wellbeing</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Traps to avoid</h3>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    <li>&bull; Leading the witness with your own answer</li>
                    <li>&bull; Turning the walk into a performance review</li>
                    <li>&bull; Recording opinions as if they were verified facts</li>
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
                    {COMMON_CAUSES.map((c) => (
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
                      {RISK_FLAGS.map((r) => (
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
              Find Christian Schools&trade; Campus Walkthrough Tool &mdash; nothing you enter is sent anywhere; it lives only in this browser's local storage.
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
              {history.length === 0 && <p className="text-sm text-gray-400 italic text-center py-6">No saved snapshots yet. Use "Save snapshot" to keep a copy of a completed walkthrough.</p>}
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#002855] truncate">{h.title}</p>
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
