import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function LegalContact() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <Link href="/" className="text-[#0055A4] hover:underline mb-8 inline-block">← Back to Home</Link>
          
          <h1 className="text-4xl font-bold text-[#002855] mb-2">Legal & Contact Information</h1>
          <p className="text-gray-600 mb-12">How to reach us for legal matters, privacy concerns, and support</p>

          <div className="space-y-8">
            {/* Privacy Contact */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#002855] mb-4">Privacy & Data Requests</h2>
              <p className="text-gray-700 mb-4">
                For privacy concerns, data access requests, deletion requests, or GDPR/CCPA inquiries:
              </p>
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Mail className="w-6 h-6 text-[#0055A4]" />
                <div>
                  <p className="font-semibold text-[#002855]">privacy@findchristianschools.org</p>
                  <p className="text-sm text-gray-600">Response time: 30 days</p>
                </div>
              </div>
            </section>

            {/* DMCA Contact */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#002855] mb-4">DMCA Takedown Notices</h2>
              <p className="text-gray-700 mb-4">
                If you believe content on FindChristianSchools.org infringes your copyright or intellectual property rights, submit a DMCA takedown notice to:
              </p>
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <Mail className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-semibold text-[#002855]">dmca@findchristianschools.org</p>
                  <p className="text-sm text-gray-600">Include: your contact info, description of copyrighted work, URL of infringing content, and statement under penalty of perjury</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <strong>DMCA Agent Registration:</strong> Our DMCA agent is registered with the U.S. Copyright Office.
              </p>
            </section>

            {/* Billing Contact */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#002855] mb-4">Billing & Payment Issues</h2>
              <p className="text-gray-700 mb-4">
                For questions about premium listings, donations, refunds, or payment disputes:
              </p>
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <Mail className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-[#002855]">billing@findchristianschools.org</p>
                  <p className="text-sm text-gray-600">Response time: 2-3 business days</p>
                </div>
              </div>
            </section>

            {/* General Support */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#002855] mb-4">General Support</h2>
              <p className="text-gray-700 mb-4">
                For technical issues, account problems, or general inquiries:
              </p>
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <Mail className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-[#002855]">support@findchristianschools.org</p>
                  <p className="text-sm text-gray-600">Response time: 1-2 business days</p>
                </div>
              </div>
            </section>

            {/* Legal */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#002855] mb-4">Legal Matters</h2>
              <p className="text-gray-700 mb-4">
                For legal inquiries, disputes, or formal notices:
              </p>
              <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <Mail className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-[#002855]">legal@findchristianschools.org</p>
                  <p className="text-sm text-gray-600">Response time: 5-7 business days</p>
                </div>
              </div>
            </section>

            {/* Company Info */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#002855] mb-4">About Our Company</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Operator:</strong> <a href="https://solasmedia.com" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">Solas Media LLC</a>
                </p>
                <p>
                  <strong>Part of:</strong> <a href="https://findchristian.org" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">FindChristian.org</a> Network
                </p>
                <p>
                  <strong>Jurisdiction:</strong> State of Florida
                </p>
                <p>
                  <strong>Data Source:</strong> School listings include data from the U.S. Department of Education's National Center for Education Statistics (NCES) Private School Universe Survey
                </p>
              </div>
            </section>

            {/* Response Times */}
            <section className="bg-blue-50 border border-blue-200 rounded-xl p-8">
              <h2 className="text-xl font-bold text-[#002855] mb-4">Response Time Commitment</h2>
              <p className="text-gray-700">
                We are committed to responding to all inquiries within the timeframes listed above. If you do not receive a response within the stated timeframe, please follow up with a reminder email. For urgent matters, please mark your email as "URGENT" in the subject line.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
