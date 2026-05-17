import { useState, useRef, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Plus, GripVertical, Trash2, Edit3, Check, Clock, Download, RotateCcw, BookOpen, ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, Copy, Cross, BookMarked, Calculator, PenTool, Beaker, Scroll, Palette, Music, Dumbbell, Globe, MoreHorizontal } from "lucide-react";

interface LessonBlock {
  id: string;
  subject: string;
  topic: string;
  startTime: string;
  duration: number;
  notes: string;
  color: string;
  // Detailed lesson fields
  lessonNumber: string;
  objective: string;
  resources: string;
  classActivity: string;
  testQuiz: string;
  homework: string;
}

type DayKey = 0 | 1 | 2 | 3 | 4;

const subjectColors: Record<string, string> = {
  "Bible": "from-amber-400 to-amber-500",
  "Math": "from-blue-400 to-blue-500",
  "Reading": "from-emerald-400 to-emerald-500",
  "Writing": "from-purple-400 to-purple-500",
  "Science": "from-cyan-400 to-cyan-500",
  "History": "from-orange-400 to-orange-500",
  "Art": "from-pink-400 to-pink-500",
  "Music": "from-violet-400 to-violet-500",
  "PE": "from-red-400 to-red-500",
  "Foreign Language": "from-teal-400 to-teal-500",
  "Other": "from-gray-400 to-gray-500",
};

function getSubjectIcon(subject: string): React.ReactNode {
  const iconProps = { className: "w-4 h-4" };
  const icons: Record<string, React.ReactNode> = {
    "Bible": <Cross {...iconProps} />,
    "Math": <Calculator {...iconProps} />,
    "Reading": <BookMarked {...iconProps} />,
    "Writing": <PenTool {...iconProps} />,
    "Science": <Beaker {...iconProps} />,
    "History": <Scroll {...iconProps} />,
    "Art": <Palette {...iconProps} />,
    "Music": <Music {...iconProps} />,
    "PE": <Dumbbell {...iconProps} />,
    "Foreign Language": <Globe {...iconProps} />,
    "Other": <MoreHorizontal {...iconProps} />,
  };
  return icons[subject] || icons["Other"];
}

const defaultSubjects = ["Bible", "Math", "Reading", "Writing", "Science", "History", "Art", "Music", "PE", "Foreign Language", "Other"];

const emptyFields = { lessonNumber: "", objective: "", resources: "", classActivity: "", testQuiz: "", homework: "" };

const samplePlan: LessonBlock[] = [
  { id: "1", subject: "Bible", topic: "Morning Devotional & Prayer", startTime: "08:00", duration: 20, notes: "Read chapter together, discuss key verse", color: "from-amber-400 to-amber-500", lessonNumber: "1", objective: "Begin the day with Scripture and prayer", resources: "Bible, devotional book", classActivity: "Read aloud, discuss key verse", testQuiz: "", homework: "" },
  { id: "2", subject: "Math", topic: "Lesson & Practice", startTime: "08:25", duration: 45, notes: "New concept + worksheet", color: "from-blue-400 to-blue-500", lessonNumber: "47", objective: "Master multiplication of two-digit numbers", resources: "Textbook pp. 94-97, worksheet", classActivity: "Lesson + practice problems", testQuiz: "", homework: "Finish worksheet" },
  { id: "3", subject: "Reading", topic: "Independent Reading", startTime: "09:15", duration: 30, notes: "Chapter book or assigned reading", color: "from-emerald-400 to-emerald-500", ...emptyFields },
  { id: "4", subject: "Writing", topic: "Copywork / Creative Writing", startTime: "09:50", duration: 25, notes: "Handwriting practice or journal entry", color: "from-purple-400 to-purple-500", ...emptyFields },
  { id: "5", subject: "Science", topic: "Lesson & Activity", startTime: "10:20", duration: 35, notes: "Textbook + hands-on experiment", color: "from-cyan-400 to-cyan-500", ...emptyFields },
  { id: "6", subject: "History", topic: "Read-Aloud & Discussion", startTime: "11:00", duration: 30, notes: "Living book or documentary clip", color: "from-orange-400 to-orange-500", ...emptyFields },
];

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function getMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split("T")[0];
}

export default function LessonPlanner() {
  const [planTitle, setPlanTitle] = useState("My Weekly Lesson Plan");
  const [weekStart, setWeekStart] = useState(getMonday());
  const [activeDay, setActiveDay] = useState<DayKey>(new Date().getDay() >= 1 && new Date().getDay() <= 5 ? (new Date().getDay() - 1) as DayKey : 0);
  const [dayBlocks, setDayBlocks] = useState<Record<DayKey, LessonBlock[]>>({
    0: samplePlan.map(b => ({ ...b, id: Math.random().toString(36).substr(2, 9) })),
    1: [],
    2: [],
    3: [],
    4: [],
  });
  const [dayNames, setDayNames] = useState<Record<DayKey, string>>({
    0: "Monday", 1: "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday",
  });
  const [dayDates, setDayDates] = useState<Record<DayKey, string>>(() => {
    const start = getMonday();
    const result: Record<number, string> = {};
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      result[i] = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return result as Record<DayKey, string>;
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDayIdx, setEditingDayIdx] = useState<DayKey | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const blocks = dayBlocks[activeDay];
  const setBlocks = (newBlocks: LessonBlock[]) => {
    setDayBlocks({ ...dayBlocks, [activeDay]: newBlocks });
  };

  // Pointer-based drag (works on touch + mouse)
  const dragState = useRef<{ id: string; startY: number; currentY: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const getItemIndexAtY = useCallback((y: number): number => {
    if (!listRef.current) return -1;
    const items = Array.from(listRef.current.querySelectorAll('[data-block-id]')) as HTMLElement[];
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      if (y < rect.bottom) return i;
    }
    return items.length - 1;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-grip]')) return;
    e.preventDefault();
    dragState.current = { id, startY: e.clientY, currentY: e.clientY };
    setDraggedId(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent, id: string) => {
    if (!dragState.current || dragState.current.id !== id) return;
    dragState.current.currentY = e.clientY;
    const overIndex = getItemIndexAtY(e.clientY);
    const overBlock = blocks[overIndex];
    if (overBlock && overBlock.id !== dragState.current.id) {
      setDragOverId(overBlock.id);
    }
  }, [blocks, getItemIndexAtY]);

  const handlePointerUp = useCallback((e: React.PointerEvent, id: string) => {
    if (!dragState.current || dragState.current.id !== id) return;
    const overIndex = getItemIndexAtY(e.clientY);
    const fromIndex = blocks.findIndex(b => b.id === id);
    if (fromIndex !== -1 && overIndex !== -1 && fromIndex !== overIndex) {
      const newBlocks = [...blocks];
      const [moved] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(overIndex, 0, moved);
      setBlocks(newBlocks);
    }
    dragState.current = null;
    setDraggedId(null);
    setDragOverId(null);
  }, [blocks, getItemIndexAtY]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getDayDate = (dayIndex: number): string => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + dayIndex);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleWeekChange = (newDate: string) => {
    setWeekStart(newDate);
    const result: Record<number, string> = {};
    for (let i = 0; i < 5; i++) {
      const d = new Date(newDate);
      d.setDate(d.getDate() + i);
      result[i] = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    setDayDates(result as Record<DayKey, string>);
  };

  const addBlock = () => {
    const lastBlock = blocks[blocks.length - 1];
    const newStart = lastBlock ? addMinutes(lastBlock.startTime, lastBlock.duration + 5) : "08:00";
    const newBlock: LessonBlock = {
      id: generateId(),
      subject: "Other",
      topic: "",
      startTime: newStart,
      duration: 30,
      notes: "",
      color: subjectColors["Other"],
      lessonNumber: "",
      objective: "",
      resources: "",
      classActivity: "",
      testQuiz: "",
      homework: "",
    };
    setBlocks([...blocks, newBlock]);
    setEditingId(newBlock.id);
    setShowOnboarding(false);
  };

  const updateBlock = (id: string, updates: Partial<LessonBlock>) => {
    if (updates.subject) {
      updates.color = subjectColors[updates.subject] || subjectColors["Other"];
    }
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const resetAll = () => {
    if (window.confirm("Clear all subjects for " + dayNames[activeDay] + "?")) {
      setBlocks([]);
    }
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex(b => b.id === id);
    if (idx === -1) return;
    const newBlocks = [...blocks];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    setBlocks(newBlocks);
  };

  const loadSample = () => {
    setBlocks(samplePlan.map(b => ({ ...b, id: generateId() })));
    setShowOnboarding(false);
  };

  const copyToDay = (targetDay: DayKey) => {
    setDayBlocks({
      ...dayBlocks,
      [targetDay]: blocks.map(b => ({ ...b, id: generateId() })),
    });
  };



  const exportPlan = (allDays = false) => {
    const daysToExport = allDays ? [0, 1, 2, 3, 4] as DayKey[] : [activeDay];
    const dayLabels = Object.values(dayNames);

    const colorMap: Record<string, string> = {
      "Bible": "#f59e0b",
      "Math": "#3b82f6",
      "Reading": "#10b981",
      "Writing": "#8b5cf6",
      "Science": "#06b6d4",
      "History": "#f97316",
      "Art": "#ec4899",
      "Music": "#7c3aed",
      "PE": "#ef4444",
      "Foreign Language": "#14b8a6",
      "Other": "#6b7280",
    };
    
    const dayHtmlSections = daysToExport.map(dayIdx => {
      const dayB = dayBlocks[dayIdx];
      if (dayB.length === 0 && allDays) return "";
      const totalMin = dayB.reduce((sum, b) => sum + b.duration, 0);
      return `
        <div class="day-section">
          <div class="day-header">
            <h2>${dayLabels[dayIdx]}</h2>
            <span class="day-date">${dayDates[dayIdx as DayKey]} &middot; ${dayB.length} subjects &middot; ${formatDuration(totalMin)}</span>
          </div>          ${dayB.length > 0 ? `<table class="schedule-table">
            <thead><tr><th style="width:70px">Time</th><th style="width:100px">Subject</th><th>Details</th><th style="width:45px">Dur.</th></tr></thead>
            <tbody>
            ${dayB.map(b => {
              const color = colorMap[b.subject] || colorMap["Other"];
              const details = [
                b.topic ? `<em>${b.topic}</em>` : '',
                b.objective ? `<strong>Objective:</strong> ${b.objective}` : '',
                b.resources ? `<strong>Resources:</strong> ${b.resources}` : '',
                b.classActivity ? `<strong>Class Activity:</strong> ${b.classActivity}` : '',
                b.testQuiz ? `<strong>Test/Quiz:</strong> ${b.testQuiz}` : '',
                b.homework ? `<strong>HW:</strong> ${b.homework}` : '',
                b.notes ? `<span class="note">${b.notes}</span>` : '',
              ].filter(Boolean).join('<br>');
              return `<tr>
                <td class="time-cell">${formatTime12(b.startTime)}</td>
                <td><span class="subject-badge" style="background:${color}20;color:${color};border:1px solid ${color}40">${b.subject}</span></td>
                <td class="topic-cell">${details || '\u2014'}</td>
                <td class="dur-cell">${formatDuration(b.duration)}</td>
              </tr>`;
            }).join("")}
            </tbody>
          </table>` : '<p class="empty">No lessons planned.</p>'}
        </div>`;
    }).filter(Boolean).join("");

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${planTitle}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; max-width: 800px; margin: 0 auto; padding: 24px 20px; color: #1a1a2e; background: #fff; font-size: 12px; }
  .header { text-align: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #002855; }
  .header h1 { font-size: 22px; color: #002855; font-weight: 700; }
  .header .subtitle { color: #64748b; font-size: 12px; margin-top: 4px; }
  .day-section { margin-bottom: 20px; }
  .day-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
  .day-header h2 { font-size: 16px; color: #002855; font-weight: 700; }
  .day-date { font-size: 11px; color: #64748b; }
  .schedule-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .schedule-table th { text-align: left; padding: 6px 8px; background: #f1f5f9; color: #475569; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; }
  .schedule-table td { padding: 8px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  .time-cell { white-space: nowrap; font-weight: 500; color: #334155; font-size: 11px; }
  .dur-cell { white-space: nowrap; color: #64748b; font-size: 11px; text-align: center; }
  .topic-cell { color: #1e293b; font-size: 12px; }
  .topic-cell .note { font-size: 10px; color: #64748b; font-style: italic; }
  .subject-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .empty { color: #94a3b8; font-size: 12px; font-style: italic; padding: 12px; text-align: center; }
  .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
  @media print {
    body { padding: 12px 10px; }
    .day-section { break-inside: avoid; }
    .schedule-table { page-break-inside: auto; }
    .schedule-table tr { break-inside: avoid; }
  }
</style></head><body>
<div class="header">
  <h1>${planTitle}</h1>
  <p class="subtitle">Week of ${new Date(weekStart).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
</div>
${dayHtmlSections}
<div class="footer">
  &copy; Find Christian Schools&trade; Lesson Plan Builder | findchristianschools.org
</div>
</body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 400);
    } else {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lesson-plan-${weekStart}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const totalMinutes = blocks.reduce((sum, b) => sum + b.duration, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Clean Minimal Hero */}
      <section className="bg-[#002855] py-8 sm:py-10">
        <div className="container max-w-3xl text-center">
          {editingTitle ? (
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              autoFocus
              className="text-2xl sm:text-3xl font-bold text-white bg-transparent border-b-2 border-white/30 outline-none text-center w-full max-w-md mx-auto"
            />
          ) : (
            <h1
              onClick={() => setEditingTitle(true)}
              className="text-2xl sm:text-3xl font-bold text-white cursor-pointer hover:opacity-80 transition-opacity"
            >
              {planTitle}
            </h1>
          )}
          <div className="flex items-center justify-center gap-2 mt-3">
            <CalendarIcon className="w-4 h-4 text-blue-200/70" />
            <input
              type="date"
              value={weekStart}
              onChange={(e) => handleWeekChange(e.target.value)}
              className="text-sm bg-transparent text-blue-100 border-none outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
          <p className="text-blue-200/60 text-xs mt-2">Tap title to rename &middot; Free tool &middot; Nothing saved</p>
        </div>
      </section>

      {/* Day Tabs */}
      <section className="border-b border-gray-200 bg-white overflow-hidden">
        <div className="w-full max-w-3xl mx-auto px-2 py-3">
          <div className="flex items-center w-full">
            <button
              onClick={() => setActiveDay(Math.max(0, activeDay - 1) as DayKey)}
              disabled={activeDay === 0}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-[#002855] disabled:opacity-0 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex flex-1 justify-around min-w-0">
              {([0, 1, 2, 3, 4] as DayKey[]).map((idx) => {
                const dayBlockCount = dayBlocks[idx].length;

                const hasContent = dayBlockCount > 0;
                const isActive = activeDay === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveDay(idx)}
                    onDoubleClick={() => setEditingDayIdx(idx)}
                    className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all min-w-0 flex-1 max-w-[64px] ${
                      isActive
                        ? "bg-[#002855] text-white shadow-sm"
                        : "text-gray-600 hover:text-[#002855] hover:bg-gray-100"
                    }`}
                  >
                    {editingDayIdx === idx ? (
                      <input
                        type="text"
                        value={dayNames[idx]}
                        onChange={(e) => setDayNames({ ...dayNames, [idx]: e.target.value })}
                        onBlur={() => setEditingDayIdx(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingDayIdx(null)}
                        autoFocus
                        className="w-10 text-center text-xs bg-transparent border-b border-current outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <div className="text-xs font-bold leading-tight">{dayNames[idx].slice(0, 3)}</div>
                        <div className={`text-[10px] leading-tight mt-0.5 ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                          {dayDates[idx]}
                        </div>
                        {hasContent && (
                          <div className={`w-1 h-1 rounded-full mt-1 ${isActive ? "bg-white/70" : "bg-[#0055A4]"}`} />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setActiveDay(Math.min(4, activeDay + 1) as DayKey)}
              disabled={activeDay === 4}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-[#002855] disabled:opacity-0 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 bg-[#f8f9fb] overflow-hidden">
        <div className="w-full max-w-3xl mx-auto px-4 py-5">
          
          {/* Toolbar */}
          {blocks.length > 0 && (
            <div className="mb-4">
              {/* Stats row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-bold text-[#002855] text-base">{blocks.length}</span>
                  <span>subjects</span>
                  <span className="text-gray-300">·</span>
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium">{formatDuration(totalMinutes)}</span>
                </div>
                <button onClick={resetAll} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-red-50 transition-colors" title="Clear all">
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
              {/* Action row */}
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => { if (e.target.value) { copyToDay(parseInt(e.target.value) as DayKey); e.target.value = ""; } }}
                  className="flex-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg outline-none cursor-pointer px-2.5 py-2 min-w-0"
                  defaultValue=""
                >
                  <option value="" disabled>Copy to day...</option>
                  {([0,1,2,3,4] as DayKey[]).filter(i => i !== activeDay).map(i => <option key={i} value={i}>{dayNames[i]}</option>)}
                </select>
                <button onClick={() => exportPlan(false)} className="flex-shrink-0 text-sm text-gray-600 border border-gray-200 bg-white hover:border-[#002855] hover:text-[#002855] px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Day
                </button>
                <button onClick={() => exportPlan(true)} className="flex-shrink-0 text-sm text-white bg-[#002855] hover:bg-[#003d7a] px-3 py-2 rounded-lg transition-colors font-semibold flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Week
                </button>
              </div>
            </div>
          )}



          {/* Onboarding */}
          {showOnboarding && blocks.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#002855]/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-[#002855]" />
              </div>
              <h3 className="text-xl font-bold text-[#002855] mb-2">Plan Your Day</h3>
              <p className="text-base text-gray-600 max-w-sm mx-auto mb-8 leading-relaxed">
                Add subjects, set times, drag to reorder, and export when done.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={loadSample} className="px-6 py-3 bg-[#002855] text-white text-base rounded-xl hover:bg-[#003d7a] transition-colors font-semibold">
                  Load Sample
                </button>
                <button onClick={() => { addBlock(); setShowOnboarding(false); }} className="px-6 py-3 bg-white text-[#002855] text-base border-2 border-gray-200 rounded-xl hover:border-[#002855]/30 transition-colors font-semibold">
                  Start Fresh
                </button>
              </div>
            </div>
          )}

          {/* Empty State (after dismissing onboarding) */}
          {blocks.length === 0 && !showOnboarding && (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-base text-gray-600 mb-1">No lessons for {dayNames[activeDay]}</p>
              <button onClick={loadSample} className="text-sm text-[#0055A4] hover:underline mt-2 font-medium">
                Load a sample plan
              </button>
            </div>
          )}

          {/* Lesson Blocks */}
          {blocks.length > 0 && (
            <div className="space-y-3" ref={listRef}>
              {blocks.map((block) => (
                <div
                  key={block.id}
                  data-block-id={block.id}
                  onPointerDown={(e) => handlePointerDown(e, block.id)}
                  onPointerMove={(e) => handlePointerMove(e, block.id)}
                  onPointerUp={(e) => handlePointerUp(e, block.id)}
                  className={`group bg-white rounded-xl border transition-all duration-200 shadow-sm select-none ${
                    dragOverId === block.id ? "border-[#0055A4] shadow-md ring-2 ring-[#0055A4]/20" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  } ${draggedId === block.id ? "opacity-30 scale-95" : ""}`}
                >
                  {editingId === block.id ? (
                    /* Edit Mode */
                    <div className="p-4 sm:p-5">
                      {/* Row 1: Subject + Topic */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</label>
                          <select
                            value={block.subject}
                            onChange={(e) => updateBlock(block.id, { subject: e.target.value })}
                            className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] text-[#002855] font-medium"
                          >
                            {defaultSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Topic</label>
                          <input type="text" value={block.topic} onChange={(e) => updateBlock(block.id, { topic: e.target.value })} placeholder="e.g., Chapter 5" className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                        </div>
                      </div>
                      {/* Row 2: Start + Minutes + Lesson # */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start</label>
                          <input type="time" value={block.startTime} onChange={(e) => updateBlock(block.id, { startTime: e.target.value })} className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Minutes</label>
                          <input type="number" min={5} max={180} value={block.duration} onChange={(e) => updateBlock(block.id, { duration: parseInt(e.target.value) || 30 })} className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson #</label>
                          <input type="text" value={block.lessonNumber} onChange={(e) => updateBlock(block.id, { lessonNumber: e.target.value })} placeholder="e.g., 47" className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                        </div>
                      </div>
                      {/* Objective */}
                      <div className="mb-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Objective</label>
                        <input type="text" value={block.objective} onChange={(e) => updateBlock(block.id, { objective: e.target.value })} placeholder="What will the student learn or accomplish?" className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                      </div>
                      {/* Resources */}
                      <div className="mb-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources / Pages</label>
                        <input type="text" value={block.resources} onChange={(e) => updateBlock(block.id, { resources: e.target.value })} placeholder="e.g., Textbook pp. 94-97, worksheet, scissors" className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                      </div>
                      {/* Class Activity */}
                      <div className="mb-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Class Activity</label>
                        <input type="text" value={block.classActivity} onChange={(e) => updateBlock(block.id, { classActivity: e.target.value })} placeholder="e.g., Activity book pp. 161-162" className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                      </div>
                      {/* Test/Quiz + Homework */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Test / Quiz</label>
                          <input type="text" value={block.testQuiz} onChange={(e) => updateBlock(block.id, { testQuiz: e.target.value })} placeholder="e.g., Quiz 5" className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Homework</label>
                          <input type="text" value={block.homework} onChange={(e) => updateBlock(block.id, { homework: e.target.value })} placeholder="e.g., Finish worksheet" className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                        </div>
                      </div>
                      {/* Notes */}
                      <div className="mb-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</label>
                        <input type="text" value={block.notes} onChange={(e) => updateBlock(block.id, { notes: e.target.value })} placeholder="Any additional notes..." className="w-full mt-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]" />
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <button onClick={() => deleteBlock(block.id)} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5 font-medium">
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-sm px-5 py-2.5 bg-[#002855] text-white rounded-lg hover:bg-[#003d7a] font-semibold">
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="px-3 py-3 sm:px-4 sm:py-3">
                      <div className="flex items-start gap-2 sm:gap-3">
                        {/* Drag handle */}
                        <div data-grip="true" className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 active:text-[#002855] transition-colors flex-shrink-0 touch-none p-1 mt-0.5" title="Drag to reorder">
                          <GripVertical className="w-5 h-5 pointer-events-none" />
                        </div>
                        {/* Color dot */}
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${block.color} flex-shrink-0 mt-1.5`} />
                        {/* Info */}
                        <div className="flex-1 min-w-0" onClick={() => setEditingId(block.id)}>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-base font-semibold text-[#002855]">{block.subject}</span>
                            {block.lessonNumber && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">#{block.lessonNumber}</span>}
                            {block.topic && <span className="text-sm text-gray-600 truncate">{block.topic}</span>}
                          </div>
                          {block.objective && <p className="text-xs text-gray-600 mt-0.5 line-clamp-1"><span className="font-medium">Obj:</span> {block.objective}</p>}
                          {block.resources && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1"><span className="font-medium">Resources:</span> {block.resources}</p>}
                          {(block.testQuiz || block.homework) && (
                            <div className="flex gap-3 mt-0.5">
                              {block.testQuiz && <p className="text-xs text-amber-700 font-medium">Test/Quiz: {block.testQuiz}</p>}
                              {block.homework && <p className="text-xs text-blue-700 font-medium">HW: {block.homework}</p>}
                            </div>
                          )}
                        </div>
                        {/* Time + Edit */}
                        <div className="flex items-start gap-1 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-sm font-medium text-[#002855]">{formatTime12(block.startTime)}</div>
                            <div className="text-xs text-gray-500">{formatDuration(block.duration)}</div>
                          </div>
                          <button onClick={() => setEditingId(block.id)} className="p-1.5 text-gray-400 hover:text-[#002855] rounded-lg hover:bg-gray-100 transition-colors ml-1">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Block */}
          <button
            onClick={addBlock}
            className="w-full mt-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-base text-gray-500 hover:text-[#002855] hover:border-[#002855]/40 hover:bg-white transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" /> Add Subject
          </button>

          {/* Footer note */}
          <p className="text-xs text-gray-500 text-center mt-10">
            Find Christian Schools™ Lesson Plan Builder &mdash; Export before leaving
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
