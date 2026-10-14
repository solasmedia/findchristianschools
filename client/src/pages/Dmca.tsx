import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShieldAlert } from "lucide-react";

export default function Dmca() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-8 h-8 text-[#0055A4]" />
          <h1 className="text-3xl font-bold text-gray-900">
            DMCA Copyright Policy
          </h1>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <p>
            FindChristianSchools.com respects the intellectual property rights
            of others and complies with the Digital Millennium Copyright Act
            (DMCA). If you believe that content on this site infringes your
            copyright, you may request its removal by following the procedure
            below.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Filing a Takedown Notice
            </h2>
            <p>
              To file a valid DMCA takedown notice, please provide our
              designated copyright agent with the following information:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>
                Identification of the copyrighted work you claim has been
                infringed.
              </li>
              <li>
                Identification of the material on our site that you claim is
                infringing, including the URL or a description sufficient to
                locate it.
              </li>
              <li>
                Your name, address, telephone number, and email address.
              </li>
              <li>
                A statement that you have a good-faith belief that the disputed
                use is not authorized by the copyright owner, its agent, or
                the law.
              </li>
              <li>
                A statement, made under penalty of perjury, that the
                information in your notice is accurate and that you are the
                copyright owner or authorized to act on the owner's behalf.
              </li>
              <li>Your physical or electronic signature.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Designated Copyright Agent
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm">
                <strong>Note:</strong> Our designated agent registration with
                the U.S. Copyright Office is pending. Until the registration
                is complete, please direct all copyright notices to:
              </p>
              <p className="text-sm mt-2">
                Submit your notice through{" "}
                <a href="/contact" className="text-[#0055A4] hover:underline">
                  our contact form
                </a>{" "}
                and title your message "DMCA Takedown Notice".
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Our Response
            </h2>
            <p>
              Upon receiving a valid takedown notice, we will expeditiously
              remove or disable access to the allegedly infringing material,
              typically within 24 to 72 hours. We will also notify the party
              who submitted the material, when applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Counter-Notification
            </h2>
            <p>
              If you believe your content was removed in error, you may file a
              counter-notification containing:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Identification of the removed material and its prior URL.</li>
              <li>Your name, address, telephone number, and email address.</li>
              <li>
                A statement, made under penalty of perjury, that you have a
                good-faith belief the material was removed as a result of
                mistake or misidentification.
              </li>
              <li>
                Your consent to the jurisdiction of the federal district court
                for your district (or any district where we may be found, if
                you are outside the United States).
              </li>
              <li>Your physical or electronic signature.</li>
            </ol>
            <p className="mt-2">
              If we receive a valid counter-notification, we will restore the
              material within 10 to 14 business days unless the original
              complainant files a court action against you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Repeat Infringers
            </h2>
            <p>
              We will terminate the accounts or listings of repeat infringers
              when appropriate, in accordance with our Terms of Service.
            </p>
          </section>

          <p className="text-xs text-gray-500 pt-4 border-t">
            This page is for informational purposes and does not constitute
            legal advice. Last updated: October 2026.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
