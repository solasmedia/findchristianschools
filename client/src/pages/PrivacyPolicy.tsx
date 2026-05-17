import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Database, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      {/* Hero */}
      <section className="bg-[#002855] text-white py-12">
        <div className="container text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-[#6EBE44]" />
          </div>
          <p className="text-[#6EBE44] text-sm font-semibold uppercase tracking-wider mb-2">Your Privacy Matters</p>
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-3 text-blue-200 max-w-2xl mx-auto">How FindChristianSchools.org protects and uses your information</p>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
            <p className="text-sm text-gray-500"><strong>Effective Date:</strong> May 2026</p>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed">We collect information you provide directly to us, such as when you:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Contact us through our website forms</li>
                <li>Subscribe to our newsletter</li>
                <li>Create an account or claim a school listing</li>
                <li>Use our school directory and search features</li>
                <li>Submit a school listing, job, event, or course</li>
                <li>Make a donation</li>
                <li>Request removal of a listing</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We also collect information automatically through cookies, analytics, and server logs, including IP address, browser type, pages visited, and referral source.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Respond to your inquiries and requests</li>
                <li>Send you updates about Christian schools and educational resources (with your consent)</li>
                <li>Process donations and manage payment transactions</li>
                <li>Maintain and secure our website</li>
                <li>Comply with legal obligations</li>
                <li>Process school listing claims and removal requests</li>
                <li>Analyze usage patterns and improve user experience</li>
                <li>Prevent fraud and enforce our Terms of Service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>With schools when you explicitly request information from them</li>
                <li>With service providers who assist in operating our website (including payment processors, analytics providers, and hosting providers)</li>
                <li>When required by law, court order, or government request</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a business transfer, merger, or acquisition</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed">We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Stripe:</strong> Payment processing for donations and premium listings. Stripe collects and processes payment information according to their <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">Privacy Policy</a>.</li>
                <li><strong>Google Analytics:</strong> Website traffic analysis and user behavior tracking. Google Analytics uses cookies to collect anonymized data.</li>
                <li><strong>Manus Platform:</strong> Hosting, authentication, and infrastructure services. Manus collects technical data necessary to operate the platform.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                These third parties may have their own privacy policies governing their use of your information. We encourage you to review their policies.
              </p>
            </section>

            {/* NCES Public Data Source Section */}
            <section className="space-y-4 bg-blue-50 border border-blue-100 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-6 h-6 text-[#0055A4]" />
                <h2 className="text-xl font-bold text-[#002855]">Public Data Sources</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Some school listings on FindChristianSchools.org are sourced from publicly available federal databases, specifically the <strong>National Center for Education Statistics (NCES) Private School Universe Survey (PSS)</strong>. This is a biennial survey conducted by the U.S. Department of Education that collects data on all private schools in the United States.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Information obtained from the NCES PSS includes basic school details such as name, address, phone number, grade levels, enrollment figures, and religious affiliation. This data is public record and freely available through the federal government.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Listings sourced from public databases are clearly marked as <strong>"Unverified"</strong> with a data source badge indicating the origin (e.g., "NCES PSS 2023-24"). These listings have not been claimed or verified by the school itself.
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-[#6EBE44] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#002855] text-sm">School Representatives</p>
                    <p className="text-sm text-gray-600 mt-1">
                      If your school appears in our directory from a public data source, you may <strong>claim your listing</strong> to verify and manage your school's information, or <strong>request removal</strong> if you prefer not to be listed. Both options are available on your school's profile page.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Account Information:</strong> Retained while your account is active and for 2 years after account closure</li>
                <li><strong>Donation Records:</strong> Retained for 7 years for tax and accounting purposes</li>
                <li><strong>School Listing Data:</strong> Retained indefinitely to maintain directory history and prevent duplicate submissions</li>
                <li><strong>Analytics Data:</strong> Retained for 26 months</li>
                <li><strong>Newsletter Subscribers:</strong> Retained until you unsubscribe</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You may request deletion of your personal information at any time by contacting privacy@findchristianschools.org, subject to legal retention requirements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Cookies & Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze website traffic, and improve our services. Cookies are small files stored on your device that help us remember your preferences and track your activity.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You can control cookie settings through your browser. Disabling cookies may limit some functionality of the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Children's Privacy (COPPA)</h2>
              <p className="text-gray-700 leading-relaxed">
                FindChristianSchools.org is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will delete such information immediately. Parents who believe their child has provided information to us should contact privacy@findchristianschools.org.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information (subject to legal retention requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Request information about how we use your data</li>
                <li>Claim or remove a school listing sourced from public data</li>
                <li>Data portability (receive your data in a portable format)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, contact privacy@findchristianschools.org. We will respond to your request within 30 days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">GDPR & CCPA Compliance</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>GDPR (European Users):</strong> If you are located in the European Union, you have additional rights under the General Data Protection Regulation, including the right to withdraw consent and the right to lodge a complaint with your local data protection authority.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>CCPA (California Users):</strong> If you are a California resident, you have the right to know what personal information is collected, the right to delete personal information, and the right to opt-out of the sale of personal information. We do not sell your personal information. To exercise these rights, contact privacy@findchristianschools.org.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>California "Do Not Track":</strong> We do not respond to Do Not Track signals, but you can control tracking through browser settings and opt-out mechanisms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Updates to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the effective date. Your continued use of the Service after such changes constitutes your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">About This Service</h2>
              <p className="text-gray-700 leading-relaxed">
                FindChristianSchools.org is operated by <a href="https://solasmedia.com" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">Solas Media LLC</a> and is part of the <a href="https://findchristian.org" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">FindChristian.org</a> network, dedicated to connecting families with faith-based education worldwide.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#0055A4]" />
                  <div>
                    <p className="font-semibold text-[#002855]">Privacy</p>
                    <p className="text-sm text-gray-600">privacy@findchristianschools.org</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#0055A4]" />
                  <div>
                    <p className="font-semibold text-[#002855]">Support</p>
                    <p className="text-sm text-gray-600">support@findchristianschools.org</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
