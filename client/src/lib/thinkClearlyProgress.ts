/**
 * Think Clearly — progress lives only in this browser (localStorage).
 * Nothing about a student is ever sent to or stored on a server: no
 * accounts, no names, no scores leave the device. The certificate name
 * is typed at print time and kept in the same local record only.
 */

const KEY = "think-clearly-progress-v1";

export interface ModuleProgress {
  bestScore: number;
  totalQuestions: number;
  completedAt: string;
}

export interface FinalTestProgress {
  score: number;
  totalQuestions: number;
  passed: boolean;
  completedAt: string;
  name?: string;
}

export interface ThinkClearlyProgress {
  modules: Record<string, ModuleProgress>;
  finalTest?: FinalTestProgress;
}

export function loadProgress(): ThinkClearlyProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { modules: {} };
    const parsed = JSON.parse(raw) as ThinkClearlyProgress;
    if (!parsed || typeof parsed !== "object" || !parsed.modules) return { modules: {} };
    return parsed;
  } catch {
    return { modules: {} };
  }
}

function save(progress: ThinkClearlyProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode etc.) — progress simply won't persist.
  }
}

export function recordModuleQuiz(slug: string, score: number, totalQuestions: number) {
  const progress = loadProgress();
  const existing = progress.modules[slug];
  if (!existing || score > existing.bestScore) {
    progress.modules[slug] = {
      bestScore: score,
      totalQuestions,
      completedAt: new Date().toISOString(),
    };
  }
  save(progress);
  return progress;
}

export function recordFinalTest(result: Omit<FinalTestProgress, "completedAt">) {
  const progress = loadProgress();
  progress.finalTest = { ...result, completedAt: new Date().toISOString() };
  save(progress);
  return progress;
}

export function completedModuleCount(progress: ThinkClearlyProgress): number {
  return Object.keys(progress.modules).length;
}
