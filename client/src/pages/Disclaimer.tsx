import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AlertTriangle, Info, Scale, Globe, Mail } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      {/* Hero */}
      <section className="bg-[#002855] text-white py-12">
        <div className="container text-center">
          <div className="flex justify-center mb-4">
            <Scale className="w-12 h-12 text-[#6EBE44]" />
          </div>
          <p className="text-[#6EBE44] text-sm font-semibold uppercase tracking-wider mb-2">Important Information</p>
          <h1 className="text-3xl md:text-4xl font-bold">Disclaimer</h1>
          <p className="mt-3 text-blue-200 max-w-2xl mx-auto">Important information about our services and content</p>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
            <p className="text-sm text-gray-500"><strong>Last Updated:</strong> May 4, 2026</p>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">General Information</h2>
              <p className="text-gray-700 leading-relaxed">
                FindChristianSchools.org is an informational directory service designed to help families find Christian and faith-based educational institutions across America. The information provided on this website is for general informational purposes only.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Accuracy of Information</h2>
              <p className="text-gray-700 leading-relaxed">While we strive to provide accurate and up-to-date information about Christian schools, we make no representations or warranties of any kind, express or implied, about:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>The completeness, accuracy, reliability, or availability of school information</li>
                <li>Tuition rates, admission requirements, or academic programs</li>
                <li>School policies, procedures, or educational outcomes</li>
                <li>The quality of education or services provided by listed schools</li>
                <li>Religious affiliation, doctrinal positions, or denominational accuracy</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                School information is subject to change without notice. We recommend contacting schools directly to verify current information before making enrollment decisions.
              </p>
            </section>

            {/* Public Data Source Disclaimer */}
            <section className="space-y-4 bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-[#002855]">Public Data Sources</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Some school listings on this website are sourced from the <strong>National Center for Education Statistics (NCES) Private School Universe Survey (PSS)</strong>, a publicly available federal database. These listings are clearly identified with an "Unverified" badge and a data source indicator.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Schools listed from public data sources have not been contacted by or verified through FindChristianSchools.org. The information reflects what was reported to the federal government at the time of the survey and may not reflect current conditions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                School representatives may <strong>claim their listing</strong> to verify and update information, or <strong>request removal</strong> if they prefer not to be listed in our directory. We respect every school's right to control their public presence.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">No Educational Advice</h2>
              <p className="text-gray-700 leading-relaxed">
                This website does not provide educational consulting or advice. We do not recommend specific schools or educational approaches. All educational decisions should be based on your family's individual needs, circumstances, and thorough research, guided by prayer and discernment.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">No Endorsement</h2>
              <p className="text-gray-700 leading-relaxed">
                Inclusion in our directory does not constitute an endorsement or recommendation of any school. We do not evaluate schools or verify their credentials, accreditation, or educational quality. Listing a school does not imply that FindChristianSchools.org endorses their doctrinal positions, teaching methods, or institutional practices.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Third-Party Content</h2>
              <p className="text-gray-700 leading-relaxed">Our website may contain links to third-party websites or reference third-party content. We are not responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>The content, accuracy, or practices of external websites</li>
                <li>Information provided directly by schools or their representatives</li>
                <li>User-generated content or reviews</li>
                <li>Third-party advertising or promotional materials</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">To the fullest extent permitted by law, FindChristianSchools.org shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Use of or inability to use this website</li>
                <li>Reliance on information provided on this website</li>
                <li>Educational decisions made based on our content</li>
                <li>Any interactions with schools listed in our directory</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Changes to Services</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without notice. We may also update this disclaimer as needed.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Geographic Scope</h2>
              <p className="text-gray-700 leading-relaxed">
                This website provides information about Christian schools across the United States and select international locations. Regional coverage may vary by area and is expanding over time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Statement of Faith Compliance</h2>
              <p className="text-gray-700 leading-relaxed">
                All schools listed on FindChristianSchools.org are required to affirm and uphold our Statement of Faith, which reflects core, mainstream Christian beliefs including the authority of Scripture, the Trinity, the deity and resurrection of Jesus Christ, salvation by grace through faith, the sanctity of life, and biblical marriage as defined between one biological man and one biological woman.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any school that is found to violate or no longer uphold the Statement of Faith may be withdrawn from the FindChristianSchools.org directory at any time, without prior notice. By listing a school on this platform, the submitter acknowledges and accepts this policy. FindChristianSchools.org reserves sole discretion in determining compliance with the Statement of Faith.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002855]">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">If you have questions about this disclaimer or need to report inaccurate information, please contact us:</p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#0055A4]" />
                <div>
                  <p className="font-semibold text-[#002855]">FindChristianSchools.org</p>
                  <p className="text-sm text-gray-600">Email: support@findchristianschools.org</p>
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
