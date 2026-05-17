import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake, Heart, Globe, Award, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Sponsor() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: "", contactName: "", contactEmail: "", contactPhone: "",
    website: "", sponsorType: "general", message: "", budget: "",
  });

  const submit = trpc.sponsors.submit.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success("Thank you! We'll be in touch."); },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactName || !form.contactEmail) {
      toast.error("Please fill in required fields.");
      return;
    }
    submit.mutate(form as any);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002855] to-[#0055A4] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
            <Handshake className="w-4 h-4" />
            <span>Partner With Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a Sponsor</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Support Christian education worldwide. Your sponsorship directly funds mission trips, events, scholarships, and recognition programs for schools and families.
          </p>
        </div>
      </section>

      {/* Sponsorship Types */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002855] text-center mb-12">Ways to Sponsor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 bg-[#6EBE44]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-[#6EBE44]" />
              </div>
              <h3 className="font-semibold text-[#002855] mb-2">Mission Trips</h3>
              <p className="text-sm text-gray-600">Fund trips that bring Christian education to underserved communities worldwide.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 bg-[#0055A4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-[#0055A4]" />
              </div>
              <h3 className="font-semibold text-[#002855] mb-2">Events</h3>
              <p className="text-sm text-gray-600">Sponsor conferences, workshops, and open houses that connect families with schools.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 bg-[#FFC72C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-[#FFC72C]" />
              </div>
              <h3 className="font-semibold text-[#002855] mb-2">Recognition</h3>
              <p className="text-sm text-gray-600">Support teacher and school recognition programs that celebrate excellence in Christian education.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-[#002855] mb-2">General</h3>
              <p className="text-sm text-gray-600">Provide general support for our mission of connecting families with Christ-centered education.</p>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="max-w-lg mx-auto text-center py-16">
              <CheckCircle className="w-20 h-20 text-[#6EBE44] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#002855] mb-3">Thank You!</h3>
              <p className="text-gray-600">Your sponsorship inquiry has been received. Our team will review your submission and reach out within 2 business days.</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#002855] mb-6 text-center">Sponsorship Inquiry</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name *</label>
                      <Input value={form.companyName} onChange={e => setForm(f => ({...f, companyName: e.target.value}))} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Name *</label>
                      <Input value={form.contactName} onChange={e => setForm(f => ({...f, contactName: e.target.value}))} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                      <Input type="email" value={form.contactEmail} onChange={e => setForm(f => ({...f, contactEmail: e.target.value}))} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                      <Input value={form.contactPhone} onChange={e => setForm(f => ({...f, contactPhone: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Website</label>
                      <Input value={form.website} onChange={e => setForm(f => ({...f, website: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Sponsorship Type</label>
                      <Select value={form.sponsorType} onValueChange={v => setForm(f => ({...f, sponsorType: v}))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Event Sponsorship</SelectItem>
                          <SelectItem value="trip">Mission Trip</SelectItem>
                          <SelectItem value="recognition">Recognition Program</SelectItem>
                          <SelectItem value="general">General Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Budget Range</label>
                    <Select value={form.budget} onValueChange={v => setForm(f => ({...f, budget: v}))}>
                      <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_1000">Under $1,000</SelectItem>
                        <SelectItem value="1000_5000">$1,000 - $5,000</SelectItem>
                        <SelectItem value="5000_25000">$5,000 - $25,000</SelectItem>
                        <SelectItem value="25000_plus">$25,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                    <textarea
                      className="w-full rounded-md border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 min-h-[100px]"
                      value={form.message}
                      onChange={e => setForm(f => ({...f, message: e.target.value}))}
                      placeholder="Tell us about your vision for supporting Christian education..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#6EBE44] hover:bg-[#5da838] text-white font-semibold py-3" disabled={submit.isPending}>
                    {submit.isPending ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
