import { useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { GraduationCap, DollarSign, Users, FileText, CheckCircle, AlertCircle, ExternalLink, Calendar } from "lucide-react";

export default function FederalTaxCredit() {
  useEffect(() => {
    document.title = "Federal Scholarship Tax Credit (FSTC) — What Christian Families Need to Know | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "The Education Freedom Tax Credit launches January 1, 2027. Learn how the $1,700 federal scholarship tax credit works, who qualifies, and how to find participating scholarship organizations in your state.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-16">
        <div className="container max-w-3xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#6EBE44]/20 border border-[#6EBE44]/40 rounded-full px-4 py-1.5 mb-5">
            <Calendar className="w-4 h-4 text-[#6EBE44]" />
            <span className="text-[#6EBE44] text-sm font-semibold">Takes effect January 1, 2027</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Federal Scholarship Tax Credit
          </h1>
          <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed">
            The first federal tax credit for K–12 education scholarships in American history.
            Here's what Christian families need to know.
          </p>
        </div>
      </section>

      <div className="container max-w-3xl px-4 py-10 flex-1">

        {/* What is it */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#002855] mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#6EBE44]" /> What Is It?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The <strong>Education Freedom Tax Credit (EFTC)</strong>, also called the <strong>Federal Scholarship Tax Credit (FSTC)</strong>,
            was signed into law on July 4, 2025 as part of the One Big Beautiful Bill Act. It creates a permanent,
            uncapped federal program that lets taxpayers redirect their tax dollars to fund K–12 scholarships.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The U.S. Treasury released proposed regulations on <strong>October 1, 2026</strong>, and the program
            officially launches <strong>January 1, 2027</strong>. As of fall 2026, roughly 31 states have indicated
            they will participate.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-10 bg-[#f8fafc] rounded-2xl p-6 sm:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#002855] mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#6EBE44]" /> How It Works
          </h2>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-gray-900">Donors give to a Scholarship Granting Organization (SGO)</p>
                <p className="text-gray-600 text-sm mt-1">Any individual taxpayer can donate up to <strong>$1,700 per year</strong> to a qualified SGO. Married couples filing jointly can donate up to <strong>$3,400</strong>.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-gray-900">Donors get a dollar-for-dollar tax credit</p>
                <p className="text-gray-600 text-sm mt-1">This is a <strong>credit, not a deduction</strong>. A $1,700 donation reduces your federal tax bill by exactly $1,700. It costs the donor nothing out of pocket.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <p className="font-semibold text-gray-900">SGOs distribute scholarships to families</p>
                <p className="text-gray-600 text-sm mt-1">SGOs use the donations to fund scholarships for eligible students. Donors can designate their gift to a specific school (but not a specific student).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-sm">4</div>
              <div>
                <p className="font-semibold text-gray-900">Families use scholarships for education expenses</p>
                <p className="text-gray-600 text-sm mt-1">Tuition, fees, tutoring, books, curriculum materials, special needs services, technology, transportation, and more. Scholarship awards are tax-free for recipients.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who qualifies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#002855] mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#6EBE44]" /> Who Qualifies?
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#6EBE44] flex-shrink-0 mt-0.5" />
              <p className="text-gray-700"><strong>Students</strong> from households earning up to <strong>300% of the area median gross income</strong> — in most parts of the country, this covers the vast majority of private school families.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#6EBE44] flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Students must be <strong>eligible to enroll in K–12</strong> school.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#6EBE44] flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Students must <strong>live in a state that has opted in</strong> to the program. Donors can give from any state, but only students in participating states can receive scholarships.</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FFC72C] flex-shrink-0 mt-0.5" />
              <p className="text-gray-700"><strong>Important:</strong> If your state hasn't opted in, your child cannot receive a scholarship — even if you donate. Check your state's status below.</p>
            </div>
          </div>
        </section>

        {/* Finding SGOs */}
        <section className="mb-10 bg-gradient-to-br from-[#002855] to-[#003d7a] rounded-2xl p-6 sm:p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#6EBE44]" /> Finding Participating SGOs
          </h2>
          <p className="text-blue-100/90 leading-relaxed mb-5">
            Each state's governor must certify participating Scholarship Granting Organizations.
            States are required to submit their SGO lists by <strong className="text-white">February 15, 2027</strong>.
            To find verified SGOs in your state:
          </p>
          <ul className="space-y-3 text-blue-100/90">
            <li className="flex items-start gap-2">
              <span className="text-[#6EBE44] font-bold">→</span>
              <span>Check your <strong className="text-white">state's Department of Education website</strong> for the certified SGO registry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6EBE44] font-bold">→</span>
              <span>The <strong className="text-white">U.S. Treasury and IRS</strong> maintain a registry of approved SGOs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6EBE44] font-bold">→</span>
              <span>SGOs must register through an <strong className="text-white">IRS portal</strong> and undergo annual audits</span>
            </li>
          </ul>
          <p className="text-blue-200/70 text-sm mt-5 italic">
            We'll update this page with direct links to state SGO registries as they become available.
          </p>
        </section>

        {/* Key dates */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#002855] mb-4">Key Dates</h2>
          <div className="space-y-3">
            {[
              { date: "July 4, 2025", event: "Signed into law as part of the One Big Beautiful Bill Act" },
              { date: "October 1, 2026", event: "U.S. Treasury released proposed regulations" },
              { date: "January 1, 2027", event: "Program takes effect — eligible donations can begin" },
              { date: "January 31, 2027", event: "SGOs must send donor acknowledgments" },
              { date: "February 15, 2027", event: "States must submit qualifying SGO lists" },
              { date: "February 28, 2027", event: "SGOs report contributions to IRS" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start border-b border-gray-100 pb-3">
                <span className="font-bold text-[#002855] whitespace-nowrap text-sm sm:text-base min-w-[140px]">{item.date}</span>
                <span className="text-gray-600 text-sm sm:text-base">{item.event}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section className="mb-6 text-sm text-gray-500 border-t border-gray-200 pt-6">
          <p className="font-semibold text-gray-600 mb-2">Sources & Further Reading</p>
          <ul className="space-y-1">
            <li><a href="https://ballotpedia.org/State_participation_in_the_Education_Freedom_Tax_Credit" target="_blank" rel="noopener noreferrer" className="text-[#002855] hover:underline inline-flex items-center gap-1">Ballotpedia: State participation tracker <ExternalLink className="w-3 h-3" /></a></li>
            <li><a href="https://www.illinoispolicy.org/reports/federal-scholarship-tax-credit-illinois-faq/" target="_blank" rel="noopener noreferrer" className="text-[#002855] hover:underline inline-flex items-center gap-1">Illinois Policy: Federal Scholarship Tax Credit FAQ <ExternalLink className="w-3 h-3" /></a></li>
            <li><a href="https://www.understood.org/en/articles/education-freedom-tax-credit" target="_blank" rel="noopener noreferrer" className="text-[#002855] hover:underline inline-flex items-center gap-1">Understood.org: What families need to know <ExternalLink className="w-3 h-3" /></a></li>
          </ul>
          <p className="mt-4 italic">This page is for informational purposes. Tax laws are complex — consult a tax professional for advice specific to your situation. Program details may change as final Treasury regulations are issued.</p>
        </section>

      </div>
      <Footer />
    </div>
  );
}
