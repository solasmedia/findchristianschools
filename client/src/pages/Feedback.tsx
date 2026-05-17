import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, CheckCircle } from "lucide-react";

export default function Feedback() {
  const [formData, setFormData] = useState({
    message: "",
    name: "",
    email: "",
    feedbackType: "general_feedback" as "bug_report" | "feature_request" | "general_feedback" | "other",
  });
  const [submitted, setSubmitted] = useState(false);
  const submitFeedback = trpc.feedback.submit.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        message: formData.message,
        name: formData.name || undefined,
        email: formData.email || undefined,
        feedbackType: formData.feedbackType,
      });

      setSubmitted(true);
      toast.success("Thank you for your feedback!");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          message: "",
          name: "",
          email: "",
          feedbackType: "general_feedback",
        });
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <div className="container py-12 lg:py-16 max-w-2xl flex-1">
        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-[#6EBE44] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#002855] mb-2">Thank You!</h2>
              <p className="text-gray-600">Your feedback has been received and will help us improve Find Christian Schools.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-8 h-8 text-[#0055A4]" />
                <h1 className="text-3xl font-bold text-[#002855]">Send Us Your Feedback</h1>
              </div>
              <p className="text-gray-600 mb-8">
                We'd love to hear from you! Whether you have a bug report, feature request, or general feedback, please let us know how we can improve Find Christian Schools.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
                  <select
                    name="feedbackType"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none"
                  >
                    <option value="general_feedback">General Feedback</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you think..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none min-h-[150px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">This field is required</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name (Optional)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll use this to follow up if needed</p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitFeedback.isPending}
                  className="w-full bg-[#0055A4] hover:bg-[#003d7a] text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  {submitFeedback.isPending ? "Sending..." : "Send Feedback"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
