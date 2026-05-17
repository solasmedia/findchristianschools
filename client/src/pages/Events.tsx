import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth } from "date-fns";
import { Calendar, Clock, MapPin, ExternalLink, ChevronLeft, ChevronRight, Plus, CheckCircle } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

const EVENT_CATEGORIES = [
  { value: "open_house", label: "Open Houses" },
  { value: "conference", label: "Conferences" },
  { value: "fundraiser", label: "Fundraisers" },
  { value: "workshop", label: "Workshops" },
  { value: "missions", label: "Missions" },
  { value: "other", label: "Other" },
];

interface PostEventForm {
  title: string; description: string; category: string; location: string;
  state: string; stateCode: string; startDate: string; endDate: string;
  website: string; submitterName: string; contactEmail: string;
}

const emptyForm: PostEventForm = {
  title: "", description: "", category: "other", location: "",
  state: "", stateCode: "", startDate: "", endDate: "",
  website: "", submitterName: "", contactEmail: "",
};

export default function Events() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(now));
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<PostEventForm>(emptyForm);

  const month = currentMonth.getMonth() + 1;
  const year = currentMonth.getFullYear();

  const { data, isLoading } = trpc.events.list.useQuery({ category: category || undefined, month, year, limit: 50 });

  const submitMutation = trpc.events.submit.useMutation({
    onSuccess: () => { setSubmitted(true); setForm(emptyForm); },
    onError: (err) => { toast.error(err.message || "Submission failed. Please try again."); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.startDate) {
      toast.error("Please fill in the event title and start date.");
      return;
    }
    submitMutation.mutate({
      title: form.title,
      description: form.description || undefined,
      category: form.category as any,
      location: form.location || undefined,
      state: form.state || undefined,
      stateCode: form.stateCode || undefined,
      startDate: new Date(form.startDate),
      endDate: form.endDate ? new Date(form.endDate) : undefined,
      website: form.website || undefined,
      submitterName: form.submitterName || undefined,
      contactEmail: form.contactEmail || undefined,
    });
  };

  const handleStateChange = (code: string) => {
    const found = US_STATES.find(s => s.code === code);
    setForm(f => ({ ...f, stateCode: code, state: found?.name || "" }));
  };

  const prevMonth = () => setCurrentMonth(m => subMonths(m, 1));
  const nextMonth = () => setCurrentMonth(m => addMonths(m, 1));
  const goToday = () => setCurrentMonth(startOfMonth(now));
  const isCurrentMonth = currentMonth.getFullYear() === now.getFullYear() && currentMonth.getMonth() === now.getMonth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-12">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Events & Conferences</h1>
              <p className="text-blue-200">Open houses, conferences, workshops, and missions events for families and schools.</p>
            </div>
            <Button
              onClick={() => { setShowForm(true); setSubmitted(false); }}
              className="bg-[#6EBE44] hover:bg-[#5aa836] text-white font-semibold px-5 py-2.5 rounded-full shrink-0 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post an Event
            </Button>
          </div>
        </div>
      </section>

      {/* Month Navigation */}
      <section className="bg-white border-b border-gray-100 py-4 sticky top-0 z-30">
        <div className="container">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Previous month">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-center min-w-[140px]">
                <span className="font-semibold text-[#002855] text-lg">{format(currentMonth, "MMMM yyyy")}</span>
              </div>
              <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Next month">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              {!isCurrentMonth && (
                <button onClick={goToday} className="text-xs px-3 py-1.5 rounded-full border border-[#0055A4] text-[#0055A4] hover:bg-[#0055A4] hover:text-white transition-colors ml-1">
                  Today
                </button>
              )}
            </div>
            <div className="hidden sm:flex flex-wrap gap-1.5">
              <button onClick={() => setCategory("")} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${!category ? "bg-[#0055A4] text-white border-[#0055A4]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0055A4]"}`}>All</button>
              {EVENT_CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setCategory(cat.value === category ? "" : cat.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${category === cat.value ? "bg-[#0055A4] text-white border-[#0055A4]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0055A4]"}`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:hidden flex flex-wrap gap-1.5 mt-3">
            <button onClick={() => setCategory("")} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${!category ? "bg-[#0055A4] text-white border-[#0055A4]" : "bg-white text-gray-600 border-gray-200"}`}>All</button>
            {EVENT_CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => setCategory(cat.value === category ? "" : cat.value)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${category === cat.value ? "bg-[#0055A4] text-white border-[#0055A4]" : "bg-white text-gray-600 border-gray-200"}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events list */}
      <section className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.events.map(event => (
                <div key={event.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-[#6EBE44]/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-semibold text-[#6EBE44] uppercase">
                        {event.startDate ? format(new Date(event.startDate), "MMM") : ""}
                      </span>
                      <span className="text-lg font-bold text-[#002855]">
                        {event.startDate ? format(new Date(event.startDate), "d") : ""}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[#002855] mb-1">{event.title}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0055A4]/10 text-[#0055A4] capitalize shrink-0">
                          {event.category?.replace("_", " ")}
                        </span>
                      </div>
                      {event.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>}
                        {event.startDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(event.startDate), "MMM d, yyyy")}
                            {event.endDate && ` – ${format(new Date(event.endDate), "MMM d, yyyy")}`}
                          </span>
                        )}
                        {event.website && (
                          <a href={event.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#0055A4] hover:underline">
                            Details <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <ShareButton title={event.title} url={`/events?id=${event.id}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {data?.events.length === 0 && (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600">No events in {format(currentMonth, "MMMM yyyy")}</h3>
                  <p className="text-sm text-gray-500 mb-4">{isCurrentMonth ? "Check back soon, or browse other months." : "Try a different month or category."}</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" size="sm" onClick={prevMonth} className="flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Previous month</Button>
                    <Button variant="outline" size="sm" onClick={nextMonth} className="flex items-center gap-1">Next month <ChevronRight className="w-4 h-4" /></Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Post an Event Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#002855]">Post an Event</DialogTitle>
          </DialogHeader>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-14 h-14 text-[#6EBE44] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#002855] mb-2">Event Submitted!</h3>
              <p className="text-sm text-gray-600 mb-6">Thank you! Your event has been submitted for review. Once approved by our team, it will appear on the Events page.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => { setSubmitted(false); setForm(emptyForm); }}>Submit Another</Button>
                <Button className="bg-[#0055A4] hover:bg-[#003f7f] text-white" onClick={() => setShowForm(false)}>Done</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="ev-title">Event Title <span className="text-red-500">*</span></Label>
                <Input id="ev-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Annual Christian Education Conference" className="mt-1" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ev-start">Start Date <span className="text-red-500">*</span></Label>
                  <Input id="ev-start" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="ev-end">End Date</Label>
                  <Input id="ev-end" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="ev-category">Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger id="ev-category" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ev-location">Location / Venue</Label>
                <Input id="ev-location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. First Baptist Church, Dallas, TX" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ev-state">State</Label>
                <Select value={form.stateCode} onValueChange={handleStateChange}>
                  <SelectTrigger id="ev-state" className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(s => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ev-website">Event Website / Link</Label>
                <Input id="ev-website" type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ev-description">Description</Label>
                <Textarea id="ev-description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the event, who it's for, and what to expect..." className="mt-1 resize-none" rows={3} />
              </div>
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Your Contact Info (optional)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="ev-name">Your Name</Label>
                    <Input id="ev-name" value={form.submitterName} onChange={e => setForm(f => ({ ...f, submitterName: e.target.value }))} placeholder="Jane Smith" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="ev-email">Email</Label>
                    <Input id="ev-email" type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} placeholder="jane@example.com" className="mt-1" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400">Events are reviewed before publishing, usually within 1–2 business days.</p>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-[#6EBE44] hover:bg-[#5aa836] text-white" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? "Submitting..." : "Submit Event"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
