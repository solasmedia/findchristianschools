import { Link } from "wouter";

{/*
  ATTORNEY REVIEW PENDING: This Lister Terms page is draft-quality legal
  copy prepared for FindChristianSchools.com / Solas Media LLC. It has NOT
  been reviewed by an attorney. Dave: have counsel review and revise before
  relying on it — especially the indemnification, limitation-of-liability,
  and verification sections.
*/}

export default function ListerTerms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link href="/" className="text-[#0055A4] hover:underline mb-8 inline-block">← Back to Home</Link>

        <h1 className="text-4xl font-bold text-[#002855] mb-2">Lister Terms</h1>
        <p className="text-gray-600 mb-8">Last updated: October 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">1. Who these terms cover</h2>
            <p className="text-gray-700">
              These Lister Terms apply to any individual, business, or organization (a "Lister") that
              submits, claims, or maintains a listing on FindChristianSchools.com (the "Site"),
              operated by Solas Media LLC, including listings in the Enrichment &amp; Activities
              directory (tutors, classes and tutoring centers, sports and leagues, camps, youth
              groups, music and arts programs, and homeschool co-ops and resources). By submitting a
              listing, the Lister agrees to these terms and to the Site's{" "}
              <Link href="/terms-of-service" className="text-[#0055A4] hover:underline">Terms of Service</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">2. Accuracy warranty</h2>
            <p className="text-gray-700">
              The Lister warrants that all information submitted — including name, location, contact
              details, descriptions, credentials, and verification documents or attestations — is
              true, accurate, current, and complete, and that the Lister is authorized to submit it.
              The Lister will promptly update the listing if any information changes, and will
              notify the Site if the program closes, moves, or stops serving families.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">3. Statement of Faith</h2>
            <p className="text-gray-700">
              Every Lister must affirm the Site's{" "}
              <Link href="/statement-of-faith" className="text-[#0055A4] hover:underline">Statement of Faith</Link>{" "}
              at submission. A listing may be declined or removed if, in the Site's judgment, the
              Lister's beliefs or practices no longer align with that statement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">4. Verification — what it means and what it does not</h2>
            <p className="text-gray-700 mb-4">
              Verification is an administrative review of the materials described below. It is not an
              endorsement, recommendation, accreditation, safety certification, or guarantee of any
              kind.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Businesses and organizations — "Documents Verified":</strong> the Lister
                provided an Employer Identification Number (EIN) and legal business name, and the
                Site reviewed that the documents match the listing.
              </li>
              <li>
                <strong>Individuals — "ID &amp; Background Check Verified":</strong> the Lister
                attested to holding a government-issued photo ID and a current background check,
                provided the date of that background check, and provided two church or school
                references, which the Site reviewed.
              </li>
              <li>
                Badges display only while verification is approved and current. Individual
                verification is renewed annually with a current background check date.
              </li>
              <li>
                The Site does not independently investigate the quality, safety, or character of any
                Lister beyond the document review described above.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">5. Not an endorsement</h2>
            <p className="text-gray-700">
              Listing is not an endorsement or recommendation. FindChristianSchools verifies documents
              only as described in these terms. Parents should do their own due diligence. Paid
              listings are labeled "Featured"; payment affects placement only and does not affect
              verification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">6. Review, suspension, and removal</h2>
            <p className="text-gray-700">
              All listings are reviewed before publication. Solas Media LLC may decline, suspend, or
              remove any listing at its sole discretion, at any time, with or without notice and with
              or without cause — including in response to a credible report from a parent or other
              user. Reports are handled removal-first: where a report raises a safety concern, the
              listing may be suspended pending review. Removal does not entitle the Lister to a
              refund of any listing fees, except where the Site decides otherwise in writing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">7. Fees</h2>
            <p className="text-gray-700">
              Basic listings are free. Premium ("Featured") listings are billed annually:
              individual tutors $49/year, enrichment providers $149/year, and organizations and camps
              $249/year. Premium subscriptions renew annually through the Site's payment processor
              until cancelled. Fees are stated in US dollars.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">8. Indemnification</h2>
            <p className="text-gray-700">
              The Lister agrees to indemnify, defend, and hold harmless Solas Media LLC, its owners,
              officers, employees, and agents from and against any claims, damages, liabilities,
              costs, and expenses (including reasonable attorneys' fees) arising out of or related
              to: (a) the Lister's listing and any information in it; (b) the Lister's services,
              programs, staff, and operations; (c) any breach of these terms or of the Lister's
              warranties; and (d) any dispute between the Lister and a parent, student, or other
              third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">9. Limitation of liability</h2>
            <p className="text-gray-700">
              To the fullest extent permitted by law, Solas Media LLC is not liable for any indirect,
              incidental, or consequential damages arising from a listing, its removal, or reliance
              on listing information. The Site's total liability to a Lister in connection with a
              listing will not exceed the listing fees the Lister paid in the twelve months before
              the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">10. Working with minors</h2>
            <p className="text-gray-700">
              Listers whose programs serve minors are solely responsible for complying with all
              applicable laws and standards, including background checks, supervision ratios,
              licensing, insurance, and mandatory reporting obligations in their jurisdiction.
              Nothing in a listing or verification badge shifts that responsibility to the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002855] mb-4">11. Changes</h2>
            <p className="text-gray-700">
              The Site may update these terms; the version posted at submission and renewal governs.
              Questions about these terms can be sent through the{" "}
              <Link href="/legal-contact" className="text-[#0055A4] hover:underline">legal contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
