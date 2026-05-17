import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Briefcase, MapPin, Clock, DollarSign, Search, Plus, X, Building2, GraduationCap } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

const POSITION_TYPES = [
  { value: "teacher", label: "Teacher" },
  { value: "administrator", label: "Administrator" },
  { value: "support_staff", label: "Support Staff" },
  { value: "coach", label: "Coach" },
  { value: "counselor", label: "Counselor" },
  { value: "other", label: "Other" },
];

const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
];

export default function Jobs() {
  const [showForm, setShowForm] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const searchInput = useMemo(() => ({
    state: searchState || undefined,
    zip: searchZip || undefined,
    positionType: searchType || undefined,
    query: searchQuery || undefined,
  }), [searchState, searchZip, searchType, searchQuery]);

  const { data: jobData, isLoading } = trpc.jobs.search.useQuery(searchInput);
  const submitMutation = trpc.jobs.submit.useMutation({
    onSuccess: () => {
      toast.success("Job posted! It will appear after admin approval.");
      setShowForm(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    schoolName: "", schoolWebsite: "", submitterName: "", submitterEmail: "",
    title: "", description: "", positionType: "teacher", employmentType: "full_time",
    location: "", state: "", stateCode: "", zip: "",
    payMin: "", payMax: "", payType: "annual",
    degreeRequired: "bachelors", yearsExperience: "",
    faithRequirement: "", subjectArea: "", gradeLevel: "",
    applicationEmail: "", applicationUrl: "",
    applicationDeadline: "", startDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.schoolName || !form.submitterName || !form.submitterEmail || !form.title) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const stateObj = US_STATES.find(s => s.code === form.stateCode);
    submitMutation.mutate({
      ...form,
      state: stateObj?.name || form.state,
      payMin: form.payMin ? Number(form.payMin) : undefined,
      payMax: form.payMax ? Number(form.payMax) : undefined,
      yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
      applicationDeadline: form.applicationDeadline || undefined,
      startDate: form.startDate || undefined,
    });
  };

  const formatPay = (job: any) => {
    if (!job.payMin && !job.payMax) return null;
    const type = job.payType === "hourly" ? "/hr" : job.payType === "monthly" ? "/mo" : "/yr";
    if (job.payMin && job.payMax) return `$${job.payMin.toLocaleString()} - $${job.payMax.toLocaleString()}${type}`;
    if (job.payMin) return `From $${job.payMin.toLocaleString()}${type}`;
    return `Up to $${job.payMax.toLocaleString()}${type}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGgydjRoNHYyaC00djRoLTJ2LTR6bS0yMi0yaC0ydi00aDJ2LTRoMnY0aDR2MmgtNHY0aC0ydi00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        </div>
        <div className="container relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Briefcase className="w-7 h-7" />
                Christian School Job Board
              </h1>
              <p className="text-blue-200 text-sm max-w-xl">
                Find teaching and staff positions at Christian schools. Jobs stay listed for up to 9 months or until filled.
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-1" /> Post a Job
            </Button>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="container">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or school..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
              />
            </div>
            <select
              value={searchState}
              onChange={e => setSearchState(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
            >
              <option value="">All States</option>
              {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
            <input
              type="text"
              placeholder="ZIP code"
              value={searchZip}
              onChange={e => setSearchZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
            />
            <select
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
            >
              <option value="">All Positions</option>
              {POSITION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            {(searchState || searchZip || searchType || searchQuery) && (
              <button
                onClick={() => { setSearchState(""); setSearchZip(""); setSearchType(""); setSearchQuery(""); }}
                className="text-xs text-gray-500 hover:text-[#0055A4] underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="flex-1 py-8">
        <div className="container">
          <p className="text-sm text-gray-500 mb-4">
            {isLoading ? "Searching..." : `${jobData?.total || 0} position${(jobData?.total || 0) !== 1 ? "s" : ""} found`}
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-100">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : jobData?.jobs && jobData.jobs.length > 0 ? (
            <div className="space-y-4">
              {jobData.jobs.map((job: any) => (
                <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-4 lg:p-6 hover:shadow-md hover:border-[#0055A4]/20 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-2 lg:space-y-3">
                      <h3 className="font-semibold text-[#002855] text-base lg:text-lg">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-1 lg:mt-2 text-xs lg:text-sm text-gray-600">
                        {job.schoolName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> {job.schoolName}
                          </span>
                        )}
                        {(job.location || job.state) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}{job.location && job.state ? ", " : ""}{job.state}
                            {job.zip && ` ${job.zip}`}
                          </span>
                        )}
                        {job.employmentType && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {job.employmentType.replace("_", "-")}
                          </span>
                        )}
                        {formatPay(job) && (
                          <span className="flex items-center gap-1 text-[#6EBE44] font-medium">
                            <DollarSign className="w-3.5 h-3.5" /> {formatPay(job)}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-sm text-gray-600 mt-2">{job.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.positionType && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[#0055A4]/10 text-[#0055A4] capitalize">{job.positionType.replace("_", " ")}</span>
                        )}
                        {job.employmentType && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">{job.employmentType.replace("_", "-")}</span>
                        )}
                        {job.degreeRequired && job.degreeRequired !== "none" && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> {job.degreeRequired.replace("_", "'s")}
                          </span>
                        )}
                        {job.yearsExperience > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{job.yearsExperience}+ yrs exp</span>
                        )}
                        {job.subjectArea && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[#6EBE44]/10 text-[#5aa838]">{job.subjectArea}</span>
                        )}
                        {job.gradeLevel && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700">Grades: {job.gradeLevel}</span>
                        )}
                        {job.certificationRequired && (
                          <span className="text-xs px-2 py-0.5 rounded bg-yellow-50 text-yellow-700">Certification Required</span>
                        )}
                      </div>
                      {job.faithRequirement && (
                        <p className="text-xs text-gray-500 mt-2 italic">✝ Faith: {job.faithRequirement}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1 text-xs lg:text-sm">
                      <ShareButton title={job.title} url={`/jobs?id=${job.id}`} className="mb-1" />
                      {job.schoolWebsite && (
                        <a href={job.schoolWebsite.startsWith('http') ? job.schoolWebsite : `https://${job.schoolWebsite}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline break-all">{job.schoolWebsite}</a>
                      )}
                      <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                      {job.applicationDeadline && (
                        <p className="text-xs text-orange-600 font-medium">
                          Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                        </p>
                      )}
                      {job.startDate && (
                        <p className="text-xs text-gray-500">
                          Starts: {new Date(job.startDate).toLocaleDateString()}
                        </p>
                      )}
                      {(job.applicationUrl || job.applicationEmail) && (
                        <a
                          href={job.applicationUrl || `mailto:${job.applicationEmail}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-1"
                        >
                          <Button size="sm" className="bg-[#0055A4] hover:bg-[#002855] text-white text-xs px-4">
                            Apply Now
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No positions found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or post a new job opening.</p>
              <Button onClick={() => setShowForm(true)} className="mt-4 bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0">
                <Plus className="w-4 h-4 mr-1" /> Post a Job
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Post a Job Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-[#002855]">Post a Job</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                Jobs stay listed for up to <strong>9 months</strong> or until you notify us the position is filled. All submissions require admin approval.
              </p>

              {/* School Info */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#002855] mb-1">School Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input required placeholder="School Name *" value={form.schoolName} onChange={e => setForm(f => ({...f, schoolName: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  <input placeholder="School Website" value={form.schoolWebsite} onChange={e => setForm(f => ({...f, schoolWebsite: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                </div>
              </fieldset>

              {/* Contact Info */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#002855] mb-1">Your Contact Info</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input required placeholder="Your Name *" value={form.submitterName} onChange={e => setForm(f => ({...f, submitterName: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  <input required type="email" placeholder="Your Email *" value={form.submitterEmail} onChange={e => setForm(f => ({...f, submitterEmail: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                </div>
              </fieldset>

              {/* Position Details */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#002855] mb-1">Position Details</legend>
                <input required placeholder="Job Title *" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                <textarea placeholder="Job Description (responsibilities, expectations, etc.)" rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30 resize-none" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <select value={form.positionType} onChange={e => setForm(f => ({...f, positionType: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30">
                    {POSITION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <select value={form.employmentType} onChange={e => setForm(f => ({...f, employmentType: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30">
                    {EMPLOYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input placeholder="Subject Area" value={form.subjectArea} onChange={e => setForm(f => ({...f, subjectArea: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                </div>
              </fieldset>

              {/* Location */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#002855] mb-1">Location</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <input placeholder="City" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  <select value={form.stateCode} onChange={e => setForm(f => ({...f, stateCode: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30">
                    <option value="">State</option>
                    {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                  <input placeholder="ZIP" value={form.zip} onChange={e => setForm(f => ({...f, zip: e.target.value.replace(/\D/g, "").slice(0, 5)}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                </div>
              </fieldset>

              {/* Compensation (optional) */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#002855] mb-1">Compensation <span className="text-gray-400 font-normal">(optional)</span></legend>
                <div className="grid grid-cols-3 gap-3">
                  <input type="number" placeholder="Min Pay" value={form.payMin} onChange={e => setForm(f => ({...f, payMin: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  <input type="number" placeholder="Max Pay" value={form.payMax} onChange={e => setForm(f => ({...f, payMax: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  <select value={form.payType} onChange={e => setForm(f => ({...f, payType: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30">
                    <option value="annual">Annual</option>
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </fieldset>

              {/* Qualifications (optional) */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#002855] mb-1">Qualifications <span className="text-gray-400 font-normal">(optional)</span></legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <select value={form.degreeRequired} onChange={e => setForm(f => ({...f, degreeRequired: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30">
                    <option value="none">No Degree Required</option>
                    <option value="associates">Associate's</option>
                    <option value="bachelors">Bachelor's</option>
                    <option value="masters">Master's</option>
                    <option value="doctorate">Doctorate</option>
                  </select>
                  <input type="number" placeholder="Years Experience" value={form.yearsExperience} onChange={e => setForm(f => ({...f, yearsExperience: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  <input placeholder="Grade Level (e.g. K-5)" value={form.gradeLevel} onChange={e => setForm(f => ({...f, gradeLevel: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                </div>
                <input placeholder="Faith requirement (e.g. Active member of a Christian church)" value={form.faithRequirement} onChange={e => setForm(f => ({...f, faithRequirement: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
              </fieldset>

              {/* Application */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#002855] mb-1">How to Apply</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="email" placeholder="Application Email" value={form.applicationEmail} onChange={e => setForm(f => ({...f, applicationEmail: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  <input placeholder="Application URL" value={form.applicationUrl} onChange={e => setForm(f => ({...f, applicationUrl: e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Application Deadline</label>
                    <input type="date" value={form.applicationDeadline} onChange={e => setForm(f => ({...f, applicationDeadline: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({...f, startDate: e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30" />
                  </div>
                </div>
              </fieldset>

              <Button type="submit" disabled={submitMutation.isPending} className="w-full bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 py-3">
                {submitMutation.isPending ? "Submitting..." : "Submit Job Posting"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
