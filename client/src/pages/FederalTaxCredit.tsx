import { useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { GraduationCap, DollarSign, Users, FileText, CheckCircle, AlertCircle, ExternalLink, Calendar } from "lucide-react";

export default function FederalTaxCredit() {
  useEffect(() => {
    document.title = "Federal Scholarship Tax Credit 2027: $1,700 for Christian School Families | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "A major change is coming that could open new doors for families considering Christian education. The new Federal Education Tax Credit could help make private Christian education more accessible and affordable for families across America.");

    // Keywords meta
    let kw = document.querySelector('meta[name="keywords"]');
    if (!kw) {
      kw = document.createElement("meta");
      kw.setAttribute("name", "keywords");
      document.head.appendChild(kw);
    }
    kw.setAttribute("content", "federal scholarship tax credit, education freedom tax credit, FSTC, EFTC, Christian school scholarships, school choice tax credit, SGO, scholarship granting organization, $1700 tax credit");

    // Open Graph
    const ogTags: [string, string][] = [
      ["og:title", "Federal Scholarship Tax Credit: $1,700 for Christian School Families"],
      ["og:description", "Starting January 1, 2027, donate up to $1,700 to fund K-12 scholarships and get every dollar back on your taxes. Here's how Christian families benefit."],
      ["og:type", "article"],
      ["og:url", "https://www.findchristianschools.com/federal-tax-credit"],
    ];
    ogTags.forEach(([prop, content]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // JSON-LD structured data
    let ld = document.querySelector('script[data-ld="fstc"]');
    if (!ld) {
      ld = document.createElement("script");
      ld.setAttribute("type", "application/ld+json");
      ld.setAttribute("data-ld", "fstc");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Federal Scholarship Tax Credit: What Christian Families Need to Know",
      "description": "The Education Freedom Tax Credit launches January 1, 2027. Learn how the $1,700 federal scholarship tax credit works, who qualifies, and how to find participating scholarship organizations.",
      "author": { "@type": "Organization", "name": "FindChristianSchools.com" },
      "publisher": { "@type": "Organization", "name": "FindChristianSchools.com" },
      "datePublished": "2026-10-11",
      "dateModified": "2026-10-11",
      "mainEntityOfPage": "https://www.findchristianschools.com/federal-tax-credit",
      "about": [
        { "@type": "Thing", "name": "Education Freedom Tax Credit" },
        { "@type": "Thing", "name": "Federal Scholarship Tax Credit" },
        { "@type": "Thing", "name": "School Choice" },
      ],
    });

    // FAQ structured data
    let faqLd = document.querySelector('script[data-ld="fstc-faq"]');
    if (!faqLd) {
      faqLd = document.createElement("script");
      faqLd.setAttribute("type", "application/ld+json");
      faqLd.setAttribute("data-ld", "fstc-faq");
      document.head.appendChild(faqLd);
    }
    faqLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Federal Scholarship Tax Credit?",
          "acceptedAnswer": { "@type": "Answer", "text": "The Education Freedom Tax Credit (also called the Federal Scholarship Tax Credit) is a federal program signed into law July 4, 2025, that lets taxpayers donate up to $1,700 per year ($3,400 for married couples) to Scholarship Granting Organizations and receive a dollar-for-dollar federal tax credit. The program takes effect January 1, 2027." }
        },
        {
          "@type": "Question",
          "name": "How does the $1,700 scholarship tax credit work?",
          "acceptedAnswer": { "@type": "Answer", "text": "A taxpayer donates up to $1,700 to a qualified Scholarship Granting Organization (SGO). They then claim a dollar-for-dollar federal income tax credit for that amount — reducing their tax bill by exactly what they donated. The SGO uses the funds to provide scholarships to eligible K-12 students." }
        },
        {
          "@type": "Question",
          "name": "Who qualifies for the Education Freedom Tax Credit scholarships?",
          "acceptedAnswer": { "@type": "Answer", "text": "Students from households earning up to 300% of the area median gross income who are eligible for K-12 enrollment and live in a state that has opted into the program. Scholarship funds can be used for tuition, fees, tutoring, books, curriculum, special needs services, technology, and transportation." }
        },
        {
          "@type": "Question",
          "name": "When does the Federal Scholarship Tax Credit start?",
          "acceptedAnswer": { "@type": "Answer", "text": "The program takes effect January 1, 2027. States must submit their qualifying SGO lists by February 15, 2027. The U.S. Treasury released proposed regulations on October 1, 2026." }
        },
      ],
    });

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
            officially launches <strong>January 1, 2027</strong>. As of September 2026, 30 states have officially opted in, according to the IRS
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
                <p className="text-gray-600 text-sm mt-1">Any individual taxpayer can donate up to <strong>$1,700 per year</strong> to a qualified SGO. Married couples filing jointly can donate up to <strong>$3,400</strong> <em>(per October 2026 proposed regulations — not yet final)</em>.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-gray-900">Donors get a dollar-for-dollar tax credit</p>
                <p className="text-gray-600 text-sm mt-1">This is a <strong>nonrefundable credit, not a deduction</strong>. A $1,700 donation reduces your federal tax bill by up to $1,700 (limited by your actual tax liability). Unused credits can generally be carried forward for up to five years. <em>Note: $1,700 is the donor's tax credit limit — not the scholarship amount a student receives.</em></p>
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

        {/* Explain Like I'm 11 */}
        <section className="mb-10 bg-gradient-to-br from-[#f0fdf4] to-[#eff6ff] rounded-2xl p-6 sm:p-8 border-2 border-[#6EBE44]/30">
          <h2 className="text-2xl font-bold text-[#002855] mb-2">The Simple Version</h2>
          <p className="text-gray-500 text-sm mb-6 italic">No jargon. Just the plain-English explanation.</p>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-lg text-gray-800 leading-relaxed mb-4">
              Imagine your neighbor wants to help you go to a Christian school, but they don't have extra money to give.
            </p>
            <p className="text-lg text-gray-800 leading-relaxed mb-4">
              Now imagine the government says: <em>"If you give $1,700 to help kids pay for school, we'll lower your taxes by $1,700."</em> So it doesn't actually cost your neighbor anything — the money just goes to help kids instead of going to the government.
            </p>
            <p className="text-lg text-gray-800 leading-relaxed mb-4">
              That money goes into a big piggy bank called a <strong>Scholarship Granting Organization</strong>. Then that piggy bank gives scholarships to families who need help paying for things like tuition, books, and tutoring.
            </p>
            <div className="bg-[#002855] rounded-xl p-5 mt-6">
              <p className="text-white text-lg font-semibold mb-2">The simple version:</p>
              <ul className="text-blue-100 space-y-2 text-base">
                <li>Someone donates money to help kids go to school</li>
                <li>The government gives them that money back on their taxes</li>
                <li>Kids get scholarships to help pay for Christian education</li>
                <li>Everybody wins</li>
              </ul>
            </div>
            <p className="text-gray-600 mt-6 text-base">
              Starting January 1, 2027, this is real. If your family needs help paying for school, this program might be for you. Ask your parents to check if your state is participating!
            </p>
          </div>
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

        {/* State Directory */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#002855] mb-2">Is Your State Participating?</h2>
          <p className="text-gray-600 mb-6">
            Thirty states have officially opted in as of October 2026. Each participating state will publish its certified SGO registry — click your state to go directly to its Department of Education where the list will appear. States must submit SGO lists by <strong>February 15, 2027</strong>.
          </p>

          <h3 className="text-lg font-bold text-[#6EBE44] mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#6EBE44] inline-block"></span>
            Participating States (30)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
            {[
              { name: "Alabama", url: "https://www.alabamaachieves.org" },
              { name: "Alaska", url: "https://education.alaska.gov" },
              { name: "Arkansas", url: "https://dese.ade.arkansas.gov" },
              { name: "Colorado", url: "https://www.cde.state.co.us" },
              { name: "Florida", url: "https://www.fldoe.org" },
              { name: "Georgia", url: "https://www.gadoe.org" },
              { name: "Idaho", url: "https://www.sde.idaho.gov" },
              { name: "Indiana", url: "https://www.in.gov/doe" },
              { name: "Iowa", url: "https://educate.iowa.gov" },
              { name: "Kansas", url: "https://www.ksde.org" },
              { name: "Kentucky", url: "https://education.ky.gov" },
              { name: "Louisiana", url: "https://www.louisianabelieves.com" },
              { name: "Mississippi", url: "https://www.mdek12.org" },
              { name: "Missouri", url: "https://dese.mo.gov" },
              { name: "Montana", url: "https://opi.mt.gov" },
              { name: "Nebraska", url: "https://www.education.ne.gov" },
              { name: "Nevada", url: "https://doe.nv.gov" },
              { name: "New Hampshire", url: "https://www.education.nh.gov" },
              { name: "North Carolina", url: "https://www.dpi.nc.gov" },
              { name: "North Dakota", url: "https://www.nd.gov/dpi" },
              { name: "Ohio", url: "https://education.ohio.gov" },
              { name: "Oklahoma", url: "https://sde.ok.gov" },
              { name: "South Carolina", url: "https://ed.sc.gov" },
              { name: "South Dakota", url: "https://doe.sd.gov" },
              { name: "Tennessee", url: "https://www.tn.gov/education" },
              { name: "Texas", url: "https://tea.texas.gov" },
              { name: "Utah", url: "https://www.schools.utah.gov" },
              { name: "Virginia", url: "https://www.doe.virginia.gov" },
              { name: "West Virginia", url: "https://wvde.us" },
              { name: "Wyoming", url: "https://edu.wyoming.gov" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#6EBE44] hover:shadow-sm transition group"
              >
                <span className="font-medium text-[#002855] text-sm sm:text-base">{s.name}</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#6EBE44] transition" />
              </a>
            ))}
          </div>

          <h3 className="text-lg font-bold text-amber-600 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            Not Participating (6)
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            These states have said they will not participate. Donors in these states can still claim the credit by donating to SGOs in participating states — but students here cannot receive scholarships.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {["Arizona", "Hawaii", "Minnesota", "New Mexico", "Oregon", "Wisconsin"].map((s) => (
              <span key={s} className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm font-medium">{s}</span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-gray-500 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
            Status Pending (14)
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            These states haven't announced a decision yet. Check back — we'll update this list as states opt in.
          </p>
          <div className="flex flex-wrap gap-2">
            {["California", "Connecticut", "Delaware", "Illinois", "Maine", "Maryland", "Massachusetts", "Michigan", "New Jersey", "New York", "Pennsylvania", "Rhode Island", "Vermont", "Washington"].map((s) => (
              <span key={s} className="bg-gray-50 border border-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm">{s}</span>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-6 italic">State participation data as of October 2026, per IRS announcements (IR-2026-76 and the Oct 2026 Treasury update). We'll update this directory as SGO registries are published.</p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#002855] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is the Federal Scholarship Tax Credit?</h3>
              <p className="text-gray-700 leading-relaxed">The Education Freedom Tax Credit (also called the Federal Scholarship Tax Credit) is a federal program signed into law on July 4, 2025. It lets taxpayers donate to Scholarship Granting Organizations (SGOs) that fund K-12 scholarships, and receive a dollar-for-dollar federal tax credit for their donation. The program takes effect January 1, 2027.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Which states participate in the Federal Scholarship Tax Credit?</h3>
              <p className="text-gray-700 leading-relaxed">As of October 2026, 30 states have opted in, according to the IRS: Alabama, Alaska, Arkansas, Colorado, Florida, Georgia, Idaho, Indiana, Iowa, Kansas, Kentucky, Louisiana, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, North Carolina, North Dakota, Ohio, Oklahoma, South Carolina, South Dakota, Tennessee, Texas, Utah, Virginia, West Virginia, and Wyoming. Arizona is not participating. Students must live in a participating state to receive a scholarship, though donors can give from any state.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How much is the Federal Scholarship Tax Credit?</h3>
              <p className="text-gray-700 leading-relaxed">Individual taxpayers can donate up to $1,700 per year to a qualified Scholarship Granting Organization and claim a dollar-for-dollar, nonrefundable federal tax credit. Under the U.S. Treasury's October 2026 proposed regulations (not yet final), married couples filing jointly can donate up to $3,400. The $1,700 figure is the donor's tax credit limit — it is not the scholarship amount a student receives.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">When does the Federal Scholarship Tax Credit start?</h3>
              <p className="text-gray-700 leading-relaxed">The program takes effect January 1, 2027. The U.S. Treasury released proposed regulations on October 1, 2026, and states must submit their lists of qualifying Scholarship Granting Organizations by February 15, 2027.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Who qualifies for Federal Scholarship Tax Credit scholarships?</h3>
              <p className="text-gray-700 leading-relaxed">Students from households earning up to 300% of the area median gross income who are eligible to enroll in K-12 school and live in a state that has opted into the program. Scholarship funds can be used for tuition, fees, tutoring, books, curriculum materials, special needs services, technology, and transportation.</p>
            </div>
          </div>
        </section>

        {/* Share */}
        <section className="mb-10 bg-gradient-to-br from-[#6EBE44]/10 to-[#002855]/5 rounded-2xl p-6 sm:p-8 text-center border border-[#6EBE44]/20">
          <h2 className="text-xl font-bold text-[#002855] mb-3">Know Someone Who Needs to See This?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Whether you're a parent exploring Christian schooling, a school administrator, or someone passionate about educational choice — share this with a friend who should understand what's coming.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                const url = "https://www.findchristianschools.com/federal-tax-credit";
                const text = "A major change is coming for Christian education — the new Federal Education Tax Credit could make private Christian school more affordable. Worth a read:";
                if (navigator.share) {
                  navigator.share({ title: document.title, text, url }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(`${text} ${url}`);
                  alert("Link copied! Paste it anywhere to share.");
                }
              }}
              className="inline-flex items-center gap-2 bg-[#002855] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#003d7a] transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share This Page
            </button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://www.findchristianschools.com/federal-tax-credit")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition"
            >
              Share on Facebook
            </a>
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
