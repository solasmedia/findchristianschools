import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { BookOpen, Calendar, Clock, Users, DollarSign, CheckCircle } from "lucide-react";

const listingTypes = [
  { value: "course", label: "Course", desc: "Multi-session structured learning (weeks/months)" },
  { value: "class", label: "Class", desc: "Single or short-term class sessions" },
  { value: "workshop", label: "Workshop / Tutoring", desc: "One-time or ongoing tutoring/workshops" },
];

const deliveryOptions = [
  { value: "in_person", label: "In Person" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

export default function ListCourse() {
  const [submitted, setSubmitted] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [customDonation, setCustomDonation] = useState("");
  const [form, setForm] = useState({
    type: "course" as "course" | "class" | "workshop" | "program",
    name: "",
    description: "",
    subject: "",
    gradeLevel: "",
    ageRange: "",
    deliveryType: "in_person" as "in_person" | "online" | "hybrid",
    instructor: "",
    startDate: "",
    endDate: "",
    schedule: "",
    tuition: "",
    maxStudents: "",
    contactName: "",
    contactEmail: "",
    website: "",
  });

  const submitMutation = trpc.courses.submitListing.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Listing submitted! It will appear after admin review.");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contactName || !form.contactEmail) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate({
      ...form,
      tuition: form.tuition ? parseInt(form.tuition) : undefined,
      maxStudents: form.maxStudents ? parseInt(form.maxStudents) : undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      schedule: form.schedule || undefined,
      description: form.description || undefined,
      subject: form.subject || undefined,
      gradeLevel: form.gradeLevel || undefined,
      ageRange: form.ageRange || undefined,
      instructor: form.instructor || undefined,
      website: form.website || undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#002855] mb-2">Listing Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your listing has been submitted for review. Once approved, it will appear in our directory for families to discover.
            </p>
            <Button onClick={() => { setSubmitted(false); setForm({ type: "course", name: "", description: "", subject: "", gradeLevel: "", ageRange: "", deliveryType: "in_person", instructor: "", startDate: "", endDate: "", schedule: "", tuition: "", maxStudents: "", contactName: "", contactEmail: "", website: "" }); }} className="bg-[#0055A4] hover:bg-[#002855]">
              Submit Another
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="w-10 h-10 text-white/80 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white mb-2">List a Course, Class, or Tutoring</h1>
          <p className="text-blue-100">Advertise your Christian education offering to thousands of families searching for faith-based learning.</p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-10 w-full">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
          
          {/* Listing Type */}
          <div>
            <label className="block text-sm font-semibold text-[#002855] mb-3">What are you listing? *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {listingTypes.map(lt => (
                <button
                  key={lt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: lt.value as any }))}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    form.type === lt.value ? 'border-[#0055A4] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm text-[#002855]">{lt.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{lt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title / Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Introduction to Biblical Greek" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe what students will learn..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Area</label>
              <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Language, Math, Music" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
              <input type="text" value={form.gradeLevel} onChange={e => setForm(f => ({ ...f, gradeLevel: e.target.value }))} placeholder="e.g. K-5, 9-12, All ages" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
              <input type="text" value={form.ageRange} onChange={e => setForm(f => ({ ...f, ageRange: e.target.value }))} placeholder="e.g. 6-12, 14-18" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery</label>
              <select value={form.deliveryType} onChange={e => setForm(f => ({ ...f, deliveryType: e.target.value as any }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent">
                {deliveryOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          {/* Dates & Schedule */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-[#002855] mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Dates & Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input type="text" value={form.schedule} onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))} placeholder="e.g. MWF 9-10am" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Capacity & Cost */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-[#002855] mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Capacity & Cost</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
                <input type="text" value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} placeholder="Teacher/instructor name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                <input type="number" value={form.maxStudents} onChange={e => setForm(f => ({ ...f, maxStudents: e.target.value }))} placeholder="e.g. 20" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tuition / Fee ($)</label>
                <input type="number" value={form.tuition} onChange={e => setForm(f => ({ ...f, tuition: e.target.value }))} placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-[#002855] mb-3">Your Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input type="text" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} placeholder="Full name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} placeholder="you@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Optional Mission Donation */}
          <div className="border-t pt-6">
            <div className="bg-gradient-to-r from-[#002855]/5 to-[#6EBE44]/10 border border-[#6EBE44]/30 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#6EBE44] flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#002855] text-base">Support the Mission <span className="text-xs font-normal text-gray-500 ml-1">(Optional)</span></h3>
                  <p className="text-sm text-gray-600 mt-0.5">Your listing is always free. A small donation helps bring Christian education to children in underserved communities around the world.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {[5, 10, 25].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setDonationAmount(donationAmount === amt ? null : amt); setCustomDonation(""); }}
                    className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                      donationAmount === amt
                        ? 'bg-[#6EBE44] border-[#6EBE44] text-white shadow-md'
                        : 'border-gray-300 text-gray-600 hover:border-[#6EBE44] hover:text-[#6EBE44]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Other"
                    value={customDonation}
                    onChange={e => { setCustomDonation(e.target.value); setDonationAmount(null); }}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-[#6EBE44] focus:border-transparent text-center"
                  />
                </div>
              </div>
              {(donationAmount || customDonation) && (
                <p className="text-xs text-[#6EBE44] font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Thank you! ${donationAmount || customDonation} will be added to support our global mission.
                </p>
              )}
              {!donationAmount && !customDonation && (
                <p className="text-xs text-gray-400">No donation required — listing is completely free.</p>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <Button type="submit" disabled={submitMutation.isPending} className="w-full bg-[#0055A4] hover:bg-[#002855] py-3 text-lg">
              {submitMutation.isPending ? "Submitting..." : (donationAmount || customDonation) ? `Submit Listing + $${donationAmount || customDonation} Donation` : "Submit Listing for Review"}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-3">Listings are reviewed and approved within 1-2 business days.</p>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
