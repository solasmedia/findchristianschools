import { Link } from 'wouter';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link href="/" className="text-[#0055A4] hover:underline mb-8 inline-block">← Back to Home</Link>
        
        <h1 className="text-4xl font-bold text-[#002855] mb-2">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: May 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing and using FindChristianSchools.org (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to abide by these terms, please do not use this service. These terms apply to all users, including schools that claim listings, submit jobs/events/courses, make donations, or otherwise interact with the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on FindChristianSchools.org for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Scrape, crawl, or automatically extract data from the Service</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">3. School Listings & User-Submitted Content</h2>
            <p className="text-gray-700 mb-4">
              <strong>Data Sources:</strong> FindChristianSchools.org includes school listings sourced from the U.S. Department of Education's National Center for Education Statistics (NCES) Private School Universe Survey, which is public-domain government data. These listings are marked as "Unverified" until claimed and verified by the school.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>School Submissions & Claims:</strong> When a school claims a listing or submits information (including logos, photos, descriptions, contact information, or other content), the school represents and warrants that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>It has the legal right to submit and authorize the display of all content</li>
              <li>The content is accurate, complete, and not misleading</li>
              <li>The content does not infringe any third-party intellectual property rights, including copyrights, trademarks, or privacy rights</li>
              <li>The content complies with all applicable laws and regulations</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>License to FindChristianSchools.org:</strong> By submitting content, the school grants FindChristianSchools.org a non-exclusive, royalty-free, perpetual license to display, reproduce, and distribute the content on the Service and in connection with FindChristian.org and related services.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Removal & Refusal:</strong> FindChristianSchools.org reserves the right to remove, refuse, or modify any listing or content at its sole discretion, including for violations of these Terms, inaccuracy, or legal concerns. Removal does not entitle the school to a refund of any premium listing fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">4. Statement of Faith Affirmation</h2>
            <p className="text-gray-700 mb-4">
              Schools that submit listings affirm that their educational mission aligns with Christian principles. This affirmation is a contractual representation by the school. Misrepresentation of faith alignment or deliberate submission of false information is grounds for immediate listing removal without refund and potential legal action. FindChristianSchools.org reserves the right to update Statement of Faith requirements at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">5. Premium Listings & Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              <strong>Term:</strong> Premium Listings are sold for a one-year term beginning on the date of purchase. Listings do NOT automatically renew.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Renewal:</strong> Approximately 60 days before your subscription expires, we will send renewal reminders to the email address on your account. To continue your Premium Listing, you must complete a new purchase before the expiration date. If you do not renew, your listing will revert to a Free Listing on the expiration date and Premium features will be disabled.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Refunds:</strong> Premium Listing fees are non-refundable except as required by law or in cases of billing error or service failure on our part.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Pricing Changes:</strong> We reserve the right to change Premium Listing pricing and features at any time. Pricing in effect at the time of your purchase applies for the entire term of that purchase; renewal purchases will be at the then-current price.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Premium Feature Removal:</strong> If a Premium Listing is removed for violation of these Terms or other legal concerns, all premium features and fees are forfeited without refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">6. Jobs, Events, Courses & Submissions</h2>
            <p className="text-gray-700 mb-4">
              All job postings, events, courses, and other submissions are subject to approval before publication. By submitting content, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>You have authority to submit the content on behalf of the organization</li>
              <li>The content is accurate and complies with all applicable employment, education, and consumer protection laws</li>
              <li>Job postings do not discriminate based on protected characteristics</li>
              <li>Event and course information is truthful and not misleading</li>
            </ul>
            <p className="text-gray-700">
              FindChristianSchools.org is not responsible for employment disputes, misrepresentation of job terms, or accuracy of event/course information. Submitters are solely responsible for compliance with all applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">7. Donations</h2>
            <p className="text-gray-700 mb-4">
              <strong>Non-Refundable:</strong> All donations are non-refundable. Donations support FindChristianSchools.org's mission to connect families with faith-based education.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Tax Implications:</strong> Donors are responsible for understanding the tax implications of their donations. Consult a tax professional regarding deductibility. FindChristianSchools.org will provide donation receipts upon request.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>No Auto-Renewal:</strong> Donations are one-time payments. There is no automatic renewal or recurring charge unless you explicitly choose a recurring donation option at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              The materials on FindChristianSchools.org are provided on an "as is" basis. FindChristianSchools.org makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="text-gray-700">
              FindChristianSchools.org does not warrant that school listings are complete, accurate, or current. School information may change without notice. Parents and students should verify all information directly with schools before making educational decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700">
              In no event shall FindChristianSchools.org or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FindChristianSchools.org, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage. This limitation applies to all claims, whether based on warranty, contract, tort, or any other legal theory.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">10. Accuracy of Materials</h2>
            <p className="text-gray-700">
              The materials appearing on FindChristianSchools.org could include technical, typographical, or photographic errors. FindChristianSchools.org does not warrant that any of the materials on its website are accurate, complete, or current. FindChristianSchools.org may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">11. Links</h2>
            <p className="text-gray-700">
              FindChristianSchools.org has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by FindChristianSchools.org of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">12. DMCA Takedown Procedure</h2>
            <p className="text-gray-700 mb-4">
              <strong>Copyright Claims:</strong> If you believe that content on FindChristianSchools.org infringes your copyright or other intellectual property rights, you may submit a DMCA takedown notice to our designated agent:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
              <p className="text-gray-700"><strong>DMCA Agent:</strong></p>
              <p className="text-gray-700">Email: dmca@findchristianschools.org</p>
              <p className="text-gray-700 text-sm mt-2">Please include: (1) your contact information, (2) description of the copyrighted work, (3) URL of the infringing content, (4) statement under penalty of perjury that you own the copyright, and (5) your signature.</p>
            </div>
            <p className="text-gray-700">
              FindChristianSchools.org will investigate and remove infringing content upon receipt of a valid DMCA notice. Repeat infringers will have their accounts terminated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">13. Modifications</h2>
            <p className="text-gray-700">
              FindChristianSchools.org may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">14. Governing Law</h2>
            <p className="text-gray-700">
              These terms and conditions are governed by and construed in accordance with the laws of the State of Florida, without regard to conflict of laws principles. You irrevocably submit to the exclusive jurisdiction of the state and federal courts located in Miami-Dade County, Florida.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">15. About This Service</h2>
            <p className="text-gray-700">
              FindChristianSchools.org is operated by <a href="https://solasmedia.com" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">Solas Media LLC</a> and is part of the <a href="https://findchristian.org" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">FindChristian.org</a> network, dedicated to connecting families with faith-based education worldwide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">16. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Legal:</strong> legal@findchristianschools.org</li>
              <li><strong>Support:</strong> support@findchristianschools.org</li>
              <li><strong>DMCA:</strong> dmca@findchristianschools.org</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
