import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  School,
  Star,
  HelpCircle,
  AlertCircle,
  Users,
  BookOpen,
  CheckCircle,
} from "lucide-react";

const contactReasons = [
  { value: "claim_school", label: "Claim or Update a School Listing", icon: School, description: "I want to claim my school's listing or update its information" },
  { value: "premium_upgrade", label: "Upgrade to Premium Listing", icon: Star, description: "I'm interested in upgrading my school to a Premium listing" },
  { value: "add_school", label: "Add a School Not in the Directory", icon: BookOpen, description: "I know of a Christian school that isn't listed yet" },
  { value: "report_error", label: "Report Incorrect School Information", icon: AlertCircle, description: "The information shown for a school is wrong or outdated" },
  { value: "general_question", label: "General Question", icon: HelpCircle, description: "I have a question about FindChristianSchools.org" },
  { value: "partnership", label: "Partnership or Advertising", icon: Users, description: "I'm interested in partnering with or advertising on the site" },
  { value: "technical_issue", label: "Technical Issue or Bug", icon: AlertCircle, description: "Something on the site isn't working correctly" },
  { value: "other", label: "Other", icon: MessageSquare, description: "Something else not listed above" },
];

export default function Contact() {
  const [, params] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const preselectedReason = searchParams.get("reason") || "";
  const preselectedSchool = searchParams.get("school") || "";

  const [reason, setReason] = useState(preselectedReason);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolName, setSchoolName] = useState(preselectedSchool);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.system.submitContactMessage.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Message submitted! We'll get back to you soon.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send message. Please try again or email us directly.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate({
      reason,
      senderName: name,
      senderEmail: email,
      senderPhone: phone || undefined,
      schoolName: schoolName || undefined,
      message,
      category: "general",
    });
  };

  const selectedReason = contactReasons.find(r => r.value === reason);

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-[#6EBE44]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#6EBE44]" />
            </div>
            <h1 className="text-3xl font-bold text-[#002855] mb-3">Message Sent!</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Thank you for reaching out. We typically respond within 1–2 business days. 
              We'll reply to <strong>{email}</strong>.
            </p>
            <div className="flex gap-3 justify-center">
              <a href="/">
                <Button className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0">Back to Home</Button>
              </a>
              <a href="/search">
                <Button variant="outline">Find Schools</Button>
              </a>
            </div>
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
      <section className="bg-gradient-to-br from-[#002855] to-[#0055A4] text-white py-14">
        <div className="container text-center">
          <MessageSquare className="w-12 h-12 text-[#6EBE44] mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Have a question, want to claim your school, or need help? We're here for you.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-[#002855] mb-4 text-lg">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#0055A4] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#002855]">Email</p>
                      <a href="mailto:info@findchristianschools.org" className="text-sm text-[#0055A4] hover:underline">
                        info@findchristianschools.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#0055A4] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#002855]">Based In</p>
                      <p className="text-sm text-gray-600">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-[#002855] mb-3 text-lg">Quick Links</h2>
                <div className="space-y-2">
                  {[
                    { href: "/submit", label: "List Your School" },
                    { href: "/membership", label: "Premium Listing Info" },
                    { href: "/privacy", label: "Privacy Policy" },
                    { href: "/disclaimer", label: "Disclaimer" },
                  ].map(link => (
                    <a key={link.href} href={link.href} className="block text-sm text-[#0055A4] hover:underline py-1">
                      {link.label} →
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-[#6EBE44]/10 rounded-xl border border-[#6EBE44]/20 p-6">
                <h2 className="font-semibold text-[#002855] mb-2">Response Time</h2>
                <p className="text-sm text-gray-600">We typically respond within <strong>1–2 business days</strong>. For urgent school listing issues, please mention it in your message.</p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-[#002855] mb-6">Send Us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Reason selector */}
                  <div>
                    <label className="block text-sm font-semibold text-[#002855] mb-2">
                      What can we help you with? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {contactReasons.map(r => {
                        const Icon = r.icon;
                        return (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setReason(r.value)}
                            className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                              reason === r.value
                                ? "border-[#0055A4] bg-blue-50 text-[#002855]"
                                : "border-gray-200 hover:border-[#0055A4]/40 hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${reason === r.value ? "text-[#0055A4]" : "text-gray-400"}`} />
                            <span className="text-xs font-medium leading-snug">{r.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedReason && (
                      <p className="text-xs text-[#0055A4] mt-2 pl-1">{selectedReason.description}</p>
                    )}
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4]"
                      />
                    </div>
                  </div>

                  {/* Phone (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4]"
                    />
                  </div>

                  {/* School name (shown for school-related reasons) */}
                  {["claim_school", "premium_upgrade", "add_school", "report_error"].includes(reason) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={e => setSchoolName(e.target.value)}
                        placeholder="e.g. Grace Christian Academy, Phoenix AZ"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4]"
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={5}
                      placeholder={
                        reason === "claim_school" ? "Please describe your role at the school and how we can verify your affiliation..."
                        : reason === "report_error" ? "Please describe what information is incorrect and what the correct information should be..."
                        : reason === "add_school" ? "Please provide the school name, city, state, and any other details you know..."
                        : reason === "premium_upgrade" ? "Tell us about your school and what you're looking for in a Premium listing..."
                        : "How can we help you today?"
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitMutation.isPending || !reason}
                    className="w-full bg-[#0055A4] hover:bg-[#003d7a] text-white border-0 py-3 text-base font-semibold"
                  >
                    {submitMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    By submitting this form you agree to our{" "}
                    <a href="/privacy" className="text-[#0055A4] hover:underline">Privacy Policy</a>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
