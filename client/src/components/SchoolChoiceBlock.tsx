import { Award, ExternalLink, Landmark, Users } from "lucide-react";
import {
  getSchoolChoiceForState,
  SCHOOL_CHOICE_ATTRIBUTION,
  type SchoolChoiceProgramInfo,
  type SchoolChoiceProgramStatus,
} from "@shared/schoolChoice";

const STATUS_STYLES: Record<SchoolChoiceProgramStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-[#6EBE44] text-white" },
  proposed: { label: "Proposed", className: "bg-amber-500 text-white" },
  pending: { label: "Decision pending", className: "bg-gray-400 text-white" },
  "not-participating": { label: "Not participating", className: "bg-gray-200 text-gray-600" },
};

function formatVerified(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function ProgramCard({ program }: { program: SchoolChoiceProgramInfo }) {
  const status = STATUS_STYLES[program.status];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[#002855] leading-snug">{program.name}</h3>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${status.className}`}>
          {status.label}
        </span>
      </div>
      <div className="mb-3">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#0055A4]/10 text-[#0055A4]">
          {program.type}
        </span>
      </div>
      {program.eligibility && (
        <p className="text-xs text-gray-600 leading-relaxed flex items-start gap-1.5 mb-2">
          <Users className="w-3.5 h-3.5 text-[#0055A4] shrink-0 mt-px" />
          <span>
            <span className="font-semibold text-[#002855]">Who qualifies: </span>
            {program.eligibility}
          </span>
        </p>
      )}
      {program.award && (
        <p className="text-xs text-gray-600 leading-relaxed flex items-start gap-1.5 mb-2">
          <Award className="w-3.5 h-3.5 text-[#6EBE44] shrink-0 mt-px" />
          <span>
            <span className="font-semibold text-[#002855]">Award: </span>
            {program.award}
          </span>
        </p>
      )}
      {program.note && <p className="text-xs text-gray-500 leading-relaxed mb-2">{program.note}</p>}
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
        <a
          href={program.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0055A4] hover:underline"
        >
          Official source <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-[10px] text-gray-400">Checked {formatVerified(program.lastVerified)}</span>
      </div>
    </div>
  );
}

export default function SchoolChoiceBlock({ stateName }: { stateName: string }) {
  const data = getSchoolChoiceForState(stateName);
  if (!data) return null;

  return (
    <section className="mb-8" aria-label={`School choice in ${stateName}`}>
      <h2 className="text-xl font-bold text-[#002855] mb-1 flex items-center gap-2">
        <Landmark className="w-5 h-5 text-[#0055A4]" />
        School Choice in {stateName}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Programs that help {stateName} families pay for private and Christian school — with the official
        source linked on every card.
      </p>

      {data.statePrograms.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-[#002855]">{stateName} does not currently run a statewide
            private school choice program</span>{" "}
            such as an education savings account, voucher, or tax-credit scholarship. Families here may
            still qualify under the federal program below, and many Christian schools offer their own
            financial aid — ask the schools you are considering directly.
          </p>
          {data.note && <p className="text-xs text-gray-500 leading-relaxed mt-2">{data.note}</p>}
        </div>
      )}
      {data.statePrograms.length > 0 && data.note && (
        <p className="text-xs text-gray-500 leading-relaxed mb-4">{data.note}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.programs.map((program) => (
          <ProgramCard key={`${program.name}-${program.type}`} program={program} />
        ))}
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed mt-4">{SCHOOL_CHOICE_ATTRIBUTION}</p>
    </section>
  );
}
