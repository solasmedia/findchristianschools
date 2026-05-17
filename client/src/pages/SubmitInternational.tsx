import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, CheckCircle, MapPin, BookOpen, Users, Shield } from "lucide-react";
import { toast } from "sonner";

const STEPS = ["School Info", "Academics", "Programs & Faith", "Contact & Submit"];

const COUNTRIES = [
  "Afghanistan","Albania","Argentina","Australia","Austria","Bangladesh","Belgium","Bolivia","Brazil","Cambodia",
  "Cameroon","Canada","Chile","China","Colombia","Costa Rica","Czech Republic","Denmark","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Ethiopia","Finland","France","Germany","Ghana","Greece","Guatemala","Haiti",
  "Honduras","Hong Kong","Hungary","India","Indonesia","Ireland","Israel","Italy","Jamaica","Japan","Jordan",
  "Kenya","South Korea","Lebanon","Liberia","Malaysia","Mexico","Morocco","Mozambique","Myanmar","Nepal",
  "Netherlands","New Zealand","Nicaragua","Nigeria","Norway","Pakistan","Panama","Papua New Guinea","Paraguay",
  "Peru","Philippines","Poland","Portugal","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Singapore",
  "South Africa","Spain","Sri Lanka","Sweden","Switzerland","Taiwan","Tanzania","Thailand","Turkey","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","Uruguay","Venezuela","Vietnam","Zambia","Zimbabwe"
];

export default function SubmitInternational() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<any>({
    name: "", country: "", countryCode: "", city: "", region: "", address: "",
    phone: "", website: "", email: "", description: "", missionStatement: "",
    primaryLanguage: "English", secondaryLanguage: "", curriculumType: "american",
    gradeStart: "K", gradeEnd: "12", programType: "day_school",
    missionAffiliation: "", denomination: "", accreditation: "", statementOfFaith: "",
    tuitionRange: "", enrollment: undefined, studentTeacherRatio: "", yearFounded: undefined,
    acceptsExpats: true, visaSupport: false, hasBoarding: false, hasSports: false,
    hasArts: false, hasESL: false, contactName: "", contactTitle: "", contactEmail: "",
  });

  const submit = trpc.international.submit.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success("School submitted for review!"); },
    onError: (e) => toast.error(e.message || "Submission failed"),
  });

  const updateForm = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  if (loading) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <CheckCircle className="w-20 h-20 text-[#6EBE44] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#002855] mb-3">Submitted Successfully!</h2>
            <p className="text-gray-600">Your school is under review. We'll notify you once it's approved and live on our directory.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = () => {
    if (!form.name || !form.country || !form.city || !form.primaryLanguage || !form.statementOfFaith) {
      toast.error("Please fill in all required fields including Statement of Faith.");
      return;
    }
    const countryCode = form.countryCode || form.country.substring(0, 2).toUpperCase();
    submit.mutate({ ...form, countryCode, enrollment: form.enrollment ? Number(form.enrollment) : undefined, yearFounded: form.yearFounded ? Number(form.yearFounded) : undefined });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-[#002855] mb-2">Submit International School</h1>
        <p className="text-gray-600 mb-8">Help families worldwide find your school. Basic listings are free.</p>

        {/* Progress Steps */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i <= step ? 'bg-[#6EBE44] text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
              <span className={`ml-2 text-xs hidden md:inline ${i <= step ? 'text-[#002855] font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-[#6EBE44]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#002855] flex items-center gap-2"><MapPin className="w-5 h-5" /> School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 block mb-1">School Name *</label><Input value={form.name} onChange={e => updateForm('name', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Country *</label>
                  <Select value={form.country} onValueChange={v => updateForm('country', v)}><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                </div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">City *</label><Input value={form.city} onChange={e => updateForm('city', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Region/Province</label><Input value={form.region} onChange={e => updateForm('region', e.target.value)} /></div>
                <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700 block mb-1">Address</label><Input value={form.address} onChange={e => updateForm('address', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Phone</label><Input value={form.phone} onChange={e => updateForm('phone', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Website</label><Input value={form.website} onChange={e => updateForm('website', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Email</label><Input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Year Founded</label><Input type="number" value={form.yearFounded || ''} onChange={e => updateForm('yearFounded', e.target.value)} /></div>
              </div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Description</label><textarea className="w-full rounded-md border border-gray-200 p-3 text-sm min-h-[80px]" value={form.description} onChange={e => updateForm('description', e.target.value)} /></div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#002855] flex items-center gap-2"><BookOpen className="w-5 h-5" /> Academics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Primary Language *</label><Input value={form.primaryLanguage} onChange={e => updateForm('primaryLanguage', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Secondary Language</label><Input value={form.secondaryLanguage} onChange={e => updateForm('secondaryLanguage', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Curriculum Type</label>
                  <Select value={form.curriculumType} onValueChange={v => updateForm('curriculumType', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                    <SelectItem value="american">American</SelectItem><SelectItem value="british">British</SelectItem><SelectItem value="ib">International Baccalaureate</SelectItem><SelectItem value="national">National</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem><SelectItem value="other">Other</SelectItem>
                  </SelectContent></Select>
                </div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Program Type</label>
                  <Select value={form.programType} onValueChange={v => updateForm('programType', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                    <SelectItem value="day_school">Day School</SelectItem><SelectItem value="boarding">Boarding</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem><SelectItem value="online">Online</SelectItem>
                  </SelectContent></Select>
                </div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Grade Start</label><Input value={form.gradeStart} onChange={e => updateForm('gradeStart', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Grade End</label><Input value={form.gradeEnd} onChange={e => updateForm('gradeEnd', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Enrollment</label><Input type="number" value={form.enrollment || ''} onChange={e => updateForm('enrollment', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Student:Teacher Ratio</label><Input value={form.studentTeacherRatio} onChange={e => updateForm('studentTeacherRatio', e.target.value)} placeholder="e.g. 12:1" /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Tuition Range</label><Input value={form.tuitionRange} onChange={e => updateForm('tuitionRange', e.target.value)} placeholder="e.g. $5,000 - $15,000" /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Accreditation</label><Input value={form.accreditation} onChange={e => updateForm('accreditation', e.target.value)} /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#002855] flex items-center gap-2"><Shield className="w-5 h-5" /> Programs & Statement of Faith</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[['acceptsExpats','Accepts Expats'],['visaSupport','Visa Support'],['hasBoarding','Boarding'],['hasSports','Sports'],['hasArts','Arts'],['hasESL','ESL Program']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={form[key]} onChange={e => updateForm(key, e.target.checked)} className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Mission Affiliation</label><Input value={form.missionAffiliation} onChange={e => updateForm('missionAffiliation', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Denomination</label><Input value={form.denomination} onChange={e => updateForm('denomination', e.target.value)} /></div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Statement of Faith * <span className="text-xs text-gray-500">(Required for listing)</span></label>
                <textarea className="w-full rounded-md border border-gray-200 p-3 text-sm min-h-[120px]" value={form.statementOfFaith} onChange={e => updateForm('statementOfFaith', e.target.value)} placeholder="Please provide your school's statement of faith..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Mission Statement</label>
                <textarea className="w-full rounded-md border border-gray-200 p-3 text-sm min-h-[80px]" value={form.missionStatement} onChange={e => updateForm('missionStatement', e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#002855] flex items-center gap-2"><Users className="w-5 h-5" /> Contact & Review</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Contact Name</label><Input value={form.contactName} onChange={e => updateForm('contactName', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Contact Title</label><Input value={form.contactTitle} onChange={e => updateForm('contactTitle', e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Contact Email</label><Input type="email" value={form.contactEmail} onChange={e => updateForm('contactEmail', e.target.value)} /></div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-[#002855] mb-2">Review Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-500">School:</span> {form.name}</p>
                  <p><span className="text-gray-500">Country:</span> {form.country}</p>
                  <p><span className="text-gray-500">City:</span> {form.city}</p>
                  <p><span className="text-gray-500">Language:</span> {form.primaryLanguage}</p>
                  <p><span className="text-gray-500">Curriculum:</span> {form.curriculumType}</p>
                  <p><span className="text-gray-500">Grades:</span> {form.gradeStart} - {form.gradeEnd}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} className="bg-[#0055A4] hover:bg-[#002855] text-white">Next</Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-[#6EBE44] hover:bg-[#5da838] text-white" disabled={submit.isPending}>
                {submit.isPending ? "Submitting..." : "Submit School"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
