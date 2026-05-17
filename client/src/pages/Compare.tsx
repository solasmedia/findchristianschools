import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { X, Plus, ArrowLeft, Check, Minus } from "lucide-react";

export default function Compare() {
  const [schoolSlugs, setSchoolSlugs] = useState<string[]>(() => {
    const stored = localStorage.getItem("fcs_compare");
    return stored ? JSON.parse(stored) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = trpc.schools.search.useQuery(
    { query: searchQuery, limit: 5 },
    { enabled: searchQuery.length >= 2 }
  );

  // Fetch each school individually
  const school1 = trpc.schools.getBySlug.useQuery({ slug: schoolSlugs[0] || "" }, { enabled: !!schoolSlugs[0] });
  const school2 = trpc.schools.getBySlug.useQuery({ slug: schoolSlugs[1] || "" }, { enabled: !!schoolSlugs[1] });
  const school3 = trpc.schools.getBySlug.useQuery({ slug: schoolSlugs[2] || "" }, { enabled: !!schoolSlugs[2] });

  const schools = useMemo(() => [school1.data, school2.data, school3.data].filter(Boolean), [school1.data, school2.data, school3.data]);

  const addSchool = (slug: string) => {
    if (schoolSlugs.length >= 3 || schoolSlugs.includes(slug)) return;
    const updated = [...schoolSlugs, slug];
    setSchoolSlugs(updated);
    localStorage.setItem("fcs_compare", JSON.stringify(updated));
    setSearchQuery("");
  };

  const removeSchool = (slug: string) => {
    const updated = schoolSlugs.filter((s) => s !== slug);
    setSchoolSlugs(updated);
    localStorage.setItem("fcs_compare", JSON.stringify(updated));
  };

  const BooleanCell = ({ value }: { value: boolean | null | undefined }) => (
    value ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <Minus className="w-4 h-4 text-gray-300 mx-auto" />
  );

  const comparisonRows = [
    { label: "Location", render: (s: any) => `${s.city}, ${s.state}` },
    { label: "Grades", render: (s: any) => s.gradeStart && s.gradeEnd ? `${s.gradeStart} - ${s.gradeEnd}` : "N/A" },
    { label: "Program Type", render: (s: any) => s.programType?.replace(/_/g, " ") || "N/A" },
    { label: "Tuition", render: (s: any) => s.tuitionMin && s.tuitionMax ? `$${s.tuitionMin.toLocaleString()} - $${s.tuitionMax.toLocaleString()}` : s.tuitionType === "free" ? "Free" : "Contact school" },
    { label: "Enrollment", render: (s: any) => s.enrollment ? s.enrollment.toLocaleString() : "N/A" },
    { label: "Student:Teacher", render: (s: any) => s.studentTeacherRatio || "N/A" },
    { label: "Denomination", render: (s: any) => s.denomination || "Non-denominational" },
    { label: "Year Founded", render: (s: any) => s.yearFounded || "N/A" },
    { label: "Accreditation", render: (s: any) => s.accreditation || "N/A" },
  ];

  const booleanRows = [
    { label: "Transportation", key: "hasTransportation" },
    { label: "Lunch Program", key: "hasLunchProgram" },
    { label: "After School", key: "hasAfterSchool" },
    { label: "Special Needs", key: "hasSpecialNeeds" },
    { label: "Sports", key: "hasSports" },
    { label: "Arts", key: "hasArts" },
    { label: "STEM", key: "hasSTEM" },
    { label: "Uniforms", key: "uniformRequired" },
    { label: "Accepts Vouchers", key: "acceptsVouchers" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/search" className="inline-flex items-center gap-1 text-sm text-[#0055A4] hover:underline mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Search
            </Link>
            <h1 className="text-3xl font-bold text-[#002855]">Compare Schools</h1>
            <p className="text-gray-600 mt-1">Compare up to 3 schools side by side</p>
          </div>

          {/* Add school search */}
          {schoolSlugs.length < 3 && (
            <div className="mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a school to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
                />
                {searchQuery.length >= 2 && searchResults.data?.schools && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchResults.data.schools.length === 0 && (
                      <p className="p-3 text-sm text-gray-500">No schools found</p>
                    )}
                    {searchResults.data.schools.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => addSchool(s.slug)}
                        disabled={schoolSlugs.includes(s.slug)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0 disabled:opacity-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.city}, {s.state}</p>
                        </div>
                        <Plus className="w-4 h-4 text-[#0055A4]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {schools.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#0055A4]/10 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-[#0055A4]" />
              </div>
              <h3 className="text-lg font-semibold text-[#002855] mb-2">No Schools Selected</h3>
              <p className="text-gray-500 text-sm">Search above to add schools for comparison</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full">
                {/* School headers */}
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-4 text-left w-40"></th>
                    {schools.map((s: any) => (
                      <th key={s.id} className="p-4 text-center min-w-[200px]">
                        <div className="relative">
                          <button
                            onClick={() => removeSchool(s.slug)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                          <Link href={`/school/${s.slug}`} className="text-sm font-semibold text-[#002855] hover:text-[#0055A4]">
                            {s.name}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">{s.city}, {s.stateCode}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Text rows */}
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                      {schools.map((s: any) => (
                        <td key={s.id} className="p-3 text-center text-sm text-gray-700">{row.render(s)}</td>
                      ))}
                    </tr>
                  ))}
                  {/* Boolean rows */}
                  <tr className="bg-gray-50">
                    <td colSpan={schools.length + 1} className="p-3 text-xs font-bold text-[#002855] uppercase tracking-wide">Programs & Services</td>
                  </tr>
                  {booleanRows.map((row) => (
                    <tr key={row.key} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-3 text-xs font-medium text-gray-500">{row.label}</td>
                      {schools.map((s: any) => (
                        <td key={s.id} className="p-3 text-center"><BooleanCell value={s[row.key]} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
