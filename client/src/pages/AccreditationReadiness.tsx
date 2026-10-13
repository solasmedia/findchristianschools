import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import {
  Award,
  Landmark,
  BookOpen,
  GraduationCap,
  Users,
  DollarSign,
  Building2,
  FileText,
  TrendingUp,
  FolderLock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content — drawn from accreditor-published standards (ACSI,        */
/*  Cognia, AACS, FACCS, CSI, ACS WASC, MSA-CESS, NEASC).              */
/* ------------------------------------------------------------------ */

const domains = [
  {
    icon: Landmark,
    title: "1. Governance & Board Structure",
    intro:
      "Every accreditor expects a board that governs — policy, mission, finance, and oversight of the head of school — rather than one that manages day-to-day operations. And it expects the paperwork to prove it.",
    bullets: [
      "Constitution or bylaws, articles of incorporation, and tax-exempt status (or documented church-ministry status) filed and available on site.",
      "A written board policy manual that is implemented and systematically reviewed on a schedule, not written once and shelved.",
      "Annual signed conflict-of-interest disclosures from every board member — the detail schools most often lack.",
      "Documented board orientation for new members, periodic board self-evaluation, and a clear written split between board authority and the head of school's day-to-day leadership.",
      "An annual, written evaluation of the head of school, conducted by the board with the head's participation.",
    ],
  },
  {
    icon: BookOpen,
    title: "2. Mission, Philosophy & Statement of Faith",
    intro:
      "All accreditors test mission fidelity: a board-adopted mission that actually drives admissions, hiring, curriculum, and budget decisions. Christian accreditors define that fidelity confessionally; regional accreditors impose no doctrinal test but judge the school against its own stated mission.",
    bullets: [
      "A written mission and philosophy, adopted by the board, communicated to families before enrollment, and periodically reviewed and assessed — not just recited.",
      "Christian accreditors (ACSI, AACS, FACCS, CSI) require a published statement of faith that personnel affirm and support.",
      "Christian accreditors require a distinct written philosophy of Christian education, separate from the mission sentence.",
      "Bible is a required core subject, taught at all grade levels with emphasis comparable to other core subjects.",
      "Biblical integration is documented — in curriculum maps, lesson plans, and student work that visiting teams sample — and spiritual formation is regularly assessed, with results used for improvement.",
    ],
  },
  {
    icon: GraduationCap,
    title: "3. Academics: Curriculum & Assessment",
    intro:
      "This is the largest evidence burden in every system. A missing scope and sequence, or publisher charts with no school-level maps, is a classic first-visit finding.",
    bullets: [
      "Written curriculum documentation for every grade and subject: scope and sequence plus curriculum maps with objectives aligned to assessments.",
      "Curriculum is current, actually used by teachers, and revised on a documented, scheduled review cycle.",
      "Varied, research-based instruction, adjusted for individual learners — visiting teams observe real classrooms to verify the self-study.",
      "A systematic assessment programme: annual standardised testing plus varied classroom assessments, with results communicated to stakeholders.",
      "Assessment data is analysed — including cohort and disaggregated trends — teachers are trained to use it, and the instructional decisions that follow are documented.",
    ],
  },
  {
    icon: Users,
    title: "4. Faculty & Staff",
    intro:
      "Accreditors look for qualified, screened, evaluated, and continually trained staff — with files that show it, year by year.",
    bullets: [
      "A bachelor's degree as the baseline for teachers, in-field assignment, and certification — or an approved alternative pathway — on file for every teacher.",
      "Christian accreditors require staff to evidence Christian testimony and agreement with the school's statement of faith and code of conduct.",
      "Background and reference screening for all employees, and for regular volunteers and contractors with student contact, filed and renewed on a cycle — often also required by state law.",
      "A written professional development plan (Christian accreditors expect Bible, biblical integration, and Christian philosophy of education included), not just certificates in a drawer.",
      "Annual written evaluations with goals and growth plans, informed by formal and informal classroom observations, plus complete personnel files — contract, job description, credentials, transcripts, evaluations, background-check summary, signed handbook receipt — secured with limited access.",
    ],
  },
  {
    icon: DollarSign,
    title: "5. Finance & Internal Controls",
    intro:
      "First question in every system: are resources adequate and finances stable enough to deliver the programme you promise? Then: can you prove where the money went?",
    bullets: [
      "A board-approved annual budget, built with staff input, plus a written 3–5-year financial projection — and the last three years of budgets and financial statements retrievable for the visiting team.",
      "An independent CPA audit or review. The exact requirement varies by accreditor: ACSI calls for an independent CPA review; AACS requires an audit or review at least once per accreditation cycle and states a compilation alone is not sufficient; NEASC requires an opinion audit by default, with reviewed statements only by exception. There is no single 'annual audit for everyone' rule.",
      "Written financial procedures, approved by the board, with segregation of duties: receiving funds, preparing deposits, recording transactions, authorising payments, and signing cheques are separated wherever possible, with added oversight where a small staff cannot fully separate them.",
      "A complete financial paper trail: tuition receipts issued and filed, expense receipts, deposit records, and payment documentation reconciled against monthly bank statements and kept with the year-end files — not loose paperwork in a drawer.",
      "A published tuition and fee schedule with a stated refund policy, and adequate property, liability, vehicle, and workers' compensation insurance.",
    ],
  },
  {
    icon: Building2,
    title: "6. Facilities, Health & Safety",
    intro:
      "Code compliance is the floor, not the aspiration. Visiting teams walk the building — deferred maintenance visible on a walk-through contradicts a polished self-study.",
    bullets: [
      "Facilities meet building, life-safety, fire, and health codes, with current fire, health, and building inspection reports on file.",
      "Maintenance handled as a system: written procedures, assigned responsibilities, and service records kept.",
      "A written crisis and security plan — reviewed regularly, trained to staff, students, and volunteers — with evacuation routes posted in every classroom.",
      "Logged drills: fire, disaster, and security drills held on schedule, with dates, times, and deficiencies recorded. Drill logs cannot be reconstructed honestly after the fact.",
      "Current student immunisation and health records, controlled medication storage and administration, and written child-protection and mandatory-reporting policies with staff training.",
    ],
  },
  {
    icon: FileText,
    title: "7. Handbooks, Policies & Standard Operating Procedures",
    intro:
      "The universal rule: if it is practised, it must be written — and if it is written, the team will check that practice matches it. A mismatch between the handbook and reality is a finding, not a technicality.",
    bullets: [
      "A current, dated parent/student handbook covering admissions, discipline, attendance, dress, and withdrawal procedures.",
      "A current employee handbook and policy manuals covering HR practices, ethical expectations, confidentiality, and mandatory reporting.",
      "Financial responsibilities of families stated in writing before enrollment, and technology acceptable-use policies for students and staff.",
      "Handbooks and manuals on a single annual review cycle: every edition dated, superseded editions archived so 'regularly reviewed' can be evidenced.",
      "Legal compliance handled as a written system — applicable state and local codes, licensure where required, zoning, and personnel-file law.",
    ],
  },
  {
    icon: TrendingUp,
    title: "8. School Improvement & Self-Study",
    intro:
      "The self-study is the heart of every accreditation system, and honesty is assessed: a self-study claiming no weaknesses damages credibility with every peer-review model.",
    bullets: [
      "A genuine, ongoing self-study involving stakeholders — board, staff, faculty, parents, and students — not a document written by one administrator the month before the visit.",
      "Stakeholder evidence gathered on a cycle: surveys, interviews, assessment data, and demographic trends, analysed and applied.",
      "An improvement plan with measurable goals, named owners, timelines, and a realistic check on facility, staffing, and resource capacity before initiatives are adopted.",
      "Evidence, not narrative alone: data supporting the rating claimed for each standard, ready for the visiting team to triangulate against classroom observation and interviews.",
      "Annual reporting and plan updates after the visit — failure to file required reports can terminate accredited status.",
    ],
  },
  {
    icon: FolderLock,
    title: "9. Student Services & Records",
    intro:
      "Records are where good intentions meet audit reality: complete, current, confidential, and kept permanently.",
    bullets: [
      "Complete student records — academic, attendance, medical, and disciplinary — maintained under documented procedures, with transcript controls and confidentiality standards observed.",
      "Permanent retention of student records, protected against fire and theft, with a duplicate of essential records held off site and a written plan for transferring records if the school ever closes.",
      "Guidance and counselling as a named service — in high school, an assigned advisor for course selection and college and career planning.",
      "A written process to identify, support within the school's mission and capacity, and where needed refer students with learning or special needs. 'We don't do that,' with no written process, is a finding.",
      "Assessment data used for student placement and personalised guidance, and transitions between grade levels actively supported.",
    ],
  },
];

const nonNegotiables = [
  "Legal operation in order: incorporation and tax status (or documented church-ministry status), bylaws, zoning, licensure where required, and insurance — documents filed and on site.",
  "A real governing board: policy manual, regular minuted meetings, annual signed conflict-of-interest disclosures, board orientation and self-evaluation, and a clear board/head role split.",
  "An annual, written evaluation of the head of school, conducted by the board.",
  "Written mission — and for Christian bodies, a statement of faith and philosophy of Christian education — board-adopted, published, periodically reviewed, and demonstrably driving admissions, hiring, curriculum, and budget.",
  "Bible as a core subject and documented biblical integration in every discipline, with spiritual formation assessed (Christian bodies).",
  "Written curriculum for every grade and subject: scope and sequence plus curriculum maps and objectives aligned to assessments, on a documented review cycle, actually used by teachers.",
  "An assessment system: annual standardised testing plus varied classroom assessment, analysed including cohort trends, with teachers trained in data use and documented instructional decisions resulting.",
  "Qualified staff: degrees and credentials on file, certification or an approved alternative plan, faith affirmation (Christian bodies), and staffing sufficient for the programme promised.",
  "Background and reference screening for all staff and regular volunteers and contractors, child-protection and mandatory-reporting policies, and training — filed, current, renewable.",
  "A written professional development plan, individual evaluations with goals and growth plans, and classroom observations — all documented annually.",
  "Complete personnel files (contract, job description, credentials, transcripts, evaluations, background-check summary, handbook receipt), secured and access-limited.",
  "A board-approved annual budget built with staff input, three years of financial statements and budgets retrievable, and a long-range (3–5-year) financial projection. Tuition and expense receipts, deposit records, and payment documentation filed and reconciled with monthly statements and year-end files, so every dollar can be traced.",
  "An independent CPA audit or review on your accreditor's cycle, with findings acted on. (The form differs by body — a compilation alone is not sufficient where specified.)",
  "Written financial procedures with segregation of duties — receiving, depositing, recording, authorising, and signing — approved by governance and followed, with compensating oversight in a small office.",
  "Code-compliant facilities: current fire, health, and building inspections on file, a maintenance system with service records, and posted evacuation routes.",
  "A written crisis and security plan, shared with local responders where required, trained to staff and students, with fire, disaster, and security drills logged.",
  "Current, dated parent/student and employee handbooks and policy manuals that match actual practice — admissions, discipline, attendance, tuition and refund, technology use, records.",
  "A student records system: academic, attendance, medical, and disciplinary records under transcript controls and confidentiality, permanently retained with fire/theft protection, an off-site duplicate, and a closure-transfer plan.",
  "A student support process: guidance and counselling (an assigned advisor in high school) and a written identify–support–refer process for special and learning needs.",
  "A living improvement system: stakeholder data collected on a cycle, an improvement plan with measurable goals, and annual reporting — in place before an accreditor imposes one.",
];

const roadmapSteps = [
  {
    step: "Membership or affiliation",
    text: "For most Christian accreditors, membership comes first — and membership alone is not accreditation and must never be marketed as such. Joining early is also the cheapest readiness step: member schools get the manuals, templates, and coordinator advice.",
  },
  {
    step: "Inquiry & eligibility check",
    text: "The accreditor reviews basic eligibility — a readiness visit, an initial visit, or a candidacy review against a subset of the full standards.",
  },
  {
    step: "Candidacy",
    text: "Formal candidate status is granted and a chair or coordinator is assigned as a mentor-resource. A candidate is not accredited (see the status rules below).",
  },
  {
    step: "Self-study",
    text: "The longest phase: a steering committee and domain teams gather stakeholder data and evidence, rate the school against each standard honestly, and draft the report — submitted weeks before the visit.",
  },
  {
    step: "Site visit",
    text: "A peer team of educators from other schools spends several days verifying the self-study: classroom observation, document checks, and interviews with board, staff, parents, and students. The team recommends; it does not decide.",
  },
  {
    step: "Commission decision",
    text: "The accreditor's commission grants accreditation, grants it with conditions, defers, or denies. Annual reporting and an improvement plan addressing team recommendations follow.",
  },
];

const timelines = [
  { body: "CSI", detail: "Self-study typically runs 1–3 years, followed by a 2–3 day visit; the commission decides in January or July. Accreditation runs on a 5-year cycle." },
  { body: "FACCS", detail: "Candidate schools have up to 4 years to prepare, and the accreditation visit takes place once the school is in its 4th year of continuous operation. Reaffirmation at least every 5 years." },
  { body: "ACSI", detail: "Structured self-study work runs about 18–24 months before the visit, with a chair assigned 12–18 months out. ACSI also offers Foundational Accreditation (up to 3 years) as an on-ramp." },
  { body: "MSA-CESS", detail: "Candidacy is capped at 5 years: self-study, visit, and grant must all be completed within that window, or the school waits at least a year to restart." },
  { body: "Cognia", detail: "Once accredited, the term is 6 years, with an engagement review at least once in that term." },
];

const accreditors = [
  {
    name: "ACSI",
    full: "Association of Christian Schools International",
    desc: "The largest Christian school accreditor. Its Inspire protocol tests biblical integration and spiritual formation alongside general standards, and pairs frequently with Cognia or WASC for dual accreditation.",
    url: "https://www.acsi.org/accreditation-certification/accreditation-for-schools/accreditation-documents",
    linkLabel: "ACSI accreditation documents",
  },
  {
    name: "Cognia",
    full: "Cognia",
    desc: "National accreditor formed from the former regional commissions (NCA CASI, SACS CASI, NWAC) — which is why schools still say 'SACS/Cognia.' Evaluates Leadership, Learning, and Resource capacities; no faith test, but mission fidelity is judged.",
    url: "https://www.cognia.org/wp-content/uploads/2020/05/APS-Schools-Overview.pdf",
    linkLabel: "Cognia Performance Standards overview",
  },
  {
    name: "AACS",
    full: "American Association of Christian Schools",
    desc: "Theologically conservative Christian accreditor working substantially through state associations. Twelve published standards, among the most prescriptive on curriculum, finance, and facilities.",
    url: "https://www.aacs.org/services/accreditation/",
    linkLabel: "AACS accreditation",
  },
  {
    name: "FACCS",
    full: "Florida Association of Christian Colleges and Schools",
    desc: "Florida's state-level Christian accreditor, named in Florida law and nationally recognised through NCPSA. Seven standards; offers co-accreditation with a partner body through a single coordinated evaluation and one combined report.",
    url: "https://faccs.org/accreditation/standards",
    linkLabel: "FACCS standards of accreditation",
  },
  {
    name: "CSI",
    full: "Christian Schools International",
    desc: "Christian accreditor built around its Measuring the Mission framework — four strands covering purpose, teaching, leadership, and community. Works with WASC and MSA for dual accreditation.",
    url: "http://csionline.org/accreditation/about-accreditation",
    linkLabel: "CSI about accreditation",
  },
  {
    name: "ACS WASC",
    full: "Accrediting Commission for Schools, Western Association of Schools and Colleges",
    desc: "Regional accreditor for California, Hawaii, the Pacific, and international schools, including church-related schools. Focus on Learning self-study model on a six-year cycle.",
    url: "https://acswasc.org/about/acs-wasc-overview/",
    linkLabel: "ACS WASC overview",
  },
  {
    name: "MSA-CESS",
    full: "Middle States Association — Commissions on Elementary and Secondary Schools",
    desc: "Regional accreditor for the Mid-Atlantic and international schools, public, private, and parochial. Twelve standards, and the clearest published cooperative-agreement model for dual accreditation.",
    url: "https://msa-cess.org/middle-states-announces-201-schools-and-school-systems-earn-accreditation-reaccreditation/",
    linkLabel: "MSA-CESS standards announcement",
  },
  {
    name: "NEASC",
    full: "New England Association of Schools and Colleges — Commission on Independent Schools",
    desc: "Regional accreditor for independent schools in the six New England states, including faith-based schools. Foundation, Program, and Strategic Planning standards, with a full visit at least once in a ten-year cycle.",
    url: "https://www.neasc.org/accreditation/standards/independent",
    linkLabel: "NEASC standards for independent schools",
  },
];

/* ------------------------------------------------------------------ */

function PacketInterestForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setDone(true),
    onError: (e) => setError(e.message || "Something went wrong. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    subscribe.mutate({ email, userType: "school" });
  };

  if (done) {
    return (
      <div className="flex items-start gap-3 bg-[#6EBE44]/10 border border-[#6EBE44]/30 rounded-xl p-5">
        <CheckCircle2 className="w-5 h-5 text-[#5da83a] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#002855] text-sm">You're on the list.</p>
          <p className="text-sm text-gray-600">
            We'll email you when the Accreditation Readiness Packet is ready, and packet list members
            get early access before public release.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your school email address"
          className="flex-1 px-5 py-3 rounded-full border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
          disabled={subscribe.isPending}
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="bg-[#0055A4] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#003d7a] transition disabled:opacity-60 text-sm whitespace-nowrap"
        >
          {subscribe.isPending ? "Joining…" : "Notify Me"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </form>
  );
}

export default function AccreditationReadiness() {
  useEffect(() => {
    document.title = "School Accreditation Readiness: A Guide for Christian School Leaders | FindChristianSchools.com";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "How Christian school accreditation actually works: the nine standards areas every accreditor examines, the 20 non-negotiables to have in place before you apply, candidacy timelines, honest costs, and how to start getting ready years early."
      );
    window.scrollTo(0, 0);

    // JSON-LD structured data
    let ld = document.querySelector('script[data-ld="accreditation-readiness"]');
    if (!ld) {
      ld = document.createElement("script");
      ld.setAttribute("type", "application/ld+json");
      ld.setAttribute("data-ld", "accreditation-readiness");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "School Accreditation Readiness: A Guide for Christian School Leaders",
      description:
        "The nine standards areas every accreditor examines, the non-negotiables to have in place before applying, candidacy timelines, and honest budgeting for Christian school accreditation.",
      author: { "@type": "Organization", name: "FindChristianSchools.com" },
      publisher: { "@type": "Organization", name: "FindChristianSchools.com" },
      mainEntityOfPage: "https://www.findchristianschools.com/accreditation-readiness",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#00509e] py-12 sm:py-16">
        <div className="container max-w-4xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Award className="w-3.5 h-3.5 text-[#6EBE44]" /> A resource for school leaders &amp; boards
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">School Accreditation Readiness</h1>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whatever accrediting body your Christian school chooses, the visiting team will examine
            roughly the same nine areas of school life. This page lays out what they look for, the
            non-negotiables to have in place before you apply, and how to start getting ready years
            before candidacy — while there is still time to build the evidence honestly.
          </p>
        </div>
      </section>

      <div className="container max-w-4xl px-4 py-12">
        {/* Intro: what accreditation is + status ladder */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#002855] mb-4">What accreditation is — and what the words mean</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Accreditation is peer review with consequences. A school studies itself against a
            published set of standards, a team of educators from other schools verifies that
            self-study on site, and a commission — not the visiting team — grants, conditions,
            defers, or denies accredited status for a term of years. It is not a one-time award:
            accredited schools file annual reports, maintain the standards, and repeat the cycle.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Three statuses are constantly confused, including in school marketing. They are not
            interchangeable:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#002855]/5 rounded-xl p-5 border border-[#002855]/10">
              <h3 className="font-bold text-[#002855] mb-2">Member</h3>
              <p className="text-sm text-gray-600">
                The school belongs to an association and receives its services. Membership alone
                confers <strong>no</strong> accreditation, and most member schools of the large
                Christian associations are not accredited.
              </p>
            </div>
            <div className="bg-[#FFC72C]/10 rounded-xl p-5 border border-[#FFC72C]/30">
              <h3 className="font-bold text-[#002855] mb-2">Candidate</h3>
              <p className="text-sm text-gray-600">
                The school has been screened and accepted and is formally working through its
                self-study toward a visit, inside a deadline. A candidate is <strong>not</strong>{" "}
                accredited.
              </p>
            </div>
            <div className="bg-[#6EBE44]/10 rounded-xl p-5 border border-[#6EBE44]/20">
              <h3 className="font-bold text-[#002855] mb-2">Accredited</h3>
              <p className="text-sm text-gray-600">
                The commission has granted status for a term, subject to annual reporting,
                maintenance requirements, and reaffirmation. Status can be made probationary or
                withdrawn if deficiencies go uncorrected.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5 mt-6">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#002855]">The marketing rule:</strong> candidate schools may
              state that they are a "Candidate for Accreditation," but they may not call themselves
              accredited, use the accreditor's accreditation logo, or place its stamp on
              transcripts until the commission has granted full accreditation. ACS WASC states
              this explicitly, and the other bodies enforce the same line. If accreditation is
              later revoked, the school must stop advertising it and return the certificate.
            </p>
          </div>
        </section>

        {/* Nine domains */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#002855] mb-3">The nine areas every accreditor examines</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            ACSI, Cognia, AACS, FACCS, CSI, ACS WASC, MSA-CESS, and NEASC use different names and
            numbering, but the evidence set underneath barely changes. Christian accreditors add a
            faith layer — statement of faith, Bible as a core subject, biblical integration,
            spiritual formation — that regional accreditors do not require. Where a requirement
            differs between bodies, the cards below say so.
          </p>
          <div className="space-y-5">
            {domains.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-[#0055A4]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#0055A4]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#002855] text-lg leading-tight">{d.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-1">{d.intro}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 pl-2 sm:pl-[60px]">
                    {d.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#6EBE44]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Non-negotiables */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#002855] mb-3">The Non-Negotiables: a pre-application checklist</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Twenty items appear in substance in every accreditation system we reviewed. If your
            school cannot evidence one of these today, it — not the application form — is your
            starting point. Most cannot be back-created credibly, which is why readiness work
            starts years, not months, before candidacy.
          </p>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sm:p-8">
            <ol className="space-y-3">
              {nonNegotiables.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-[#0055A4]/40 bg-white flex items-center justify-center text-[11px] font-bold text-[#0055A4]">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#002855] mb-3">The candidacy roadmap</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            The sequence is remarkably uniform across bodies. Two to four years from formal
            candidacy to a grant is normal — and a school starting with no documentation should
            expect to spend its pre-candidacy years building the files above, or candidacy itself
            becomes the remediation period.
          </p>
          <div className="space-y-4 mb-10">
            {roadmapSteps.map((s, i) => (
              <div key={s.step} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#002855] text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h3 className="font-bold text-[#002855]">{s.step}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <h3 className="font-bold text-[#002855] text-lg mb-4">Published timelines, by body</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#002855] text-white text-left">
                  <th className="px-4 py-3 font-semibold w-32">Accreditor</th>
                  <th className="px-4 py-3 font-semibold">What it publishes</th>
                </tr>
              </thead>
              <tbody>
                {timelines.map((t, i) => (
                  <tr key={t.body} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-semibold text-[#002855] align-top">{t.body}</td>
                    <td className="px-4 py-3 text-gray-700 leading-relaxed">{t.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Costs */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#002855] mb-3">What it costs: budget honestly</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Most accreditors do not publish a general fee schedule on their public websites, and
            anyone quoting you a single all-in price for "accreditation" without naming the body
            is guessing. What is consistent is the <em>structure</em>. Budget for:
          </p>
          <ul className="space-y-2 mb-6">
            {[
              "Association membership dues (usually annual, and usually required before candidacy).",
              "An application or candidacy fee.",
              "An annual accreditation or maintenance fee during and after candidacy.",
              "Visiting-team expenses in the visit year — travel, lodging, meals, and any visit fee or honoraria. In peer-review models these are typically borne by the school.",
              "Chair or coordinator pre-visit expenses.",
              "Staff time. The largest real cost is internal labour: the self-study takes hundreds of hours of leadership and faculty time.",
            ].map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#6EBE44]" />
                {b}
              </li>
            ))}
          </ul>
          <div className="bg-[#0055A4]/5 rounded-xl border border-[#0055A4]/15 p-6">
            <h3 className="font-bold text-[#002855] mb-2">One body that publishes its fees: FACCS (Florida)</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              FACCS posts its schedule publicly. As published on its fees page (checked October
              2026): annual membership dues are <strong>$250 per school</strong>; for a traditional
              school, accreditation is <strong>$100/year</strong>, NCPSA certification is{" "}
              <strong>$100</strong>, and religious exemption is <strong>$100</strong>. FACCS notes
              that fees are subject to change, and its fees page does not state visiting-team
              expense costs — confirm those with FACCS before budgeting a total.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              For comparison of structure only: ACS WASC charges annual membership fees plus a
              nonrefundable application fee and an initial visit fee for new schools, with visit
              fees when a visit is scheduled (amounts are in its published fee schedules). ACSI,
              Cognia, CSI, MSA-CESS, and NEASC did not publish a general K-12 fee schedule on the
              public pages we reviewed — ask the body directly for its current schedule before
              you budget.
            </p>
          </div>
        </section>

        {/* Accreditor directory */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#002855] mb-3">The accrediting bodies</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The major bodies Christian schools work with, with links to their official
            accreditation pages. Before choosing, check whether your state association — and any
            state scholarship or voucher programme you participate in — recognises the accreditor
            you are considering.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {accreditors.map((a) => (
              <div key={a.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-[#002855]">
                  {a.name} <span className="block text-xs font-medium text-gray-500 mt-0.5">{a.full}</span>
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-2 mb-3">{a.desc}</p>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#0055A4] hover:text-[#003d7a]"
                >
                  {a.linkLabel} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-[#002855] mb-2">Dual accreditation</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Many Christian schools hold two accreditations — commonly ACSI + Cognia, ACSI + ACS
              WASC, CSI + ACS WASC, or CSI + MSA — and FACCS offers co-accreditation with a
              partner body through a single coordinated evaluation producing one combined report.
              The Christian body tests faith and mission; the regional or national body provides
              the widely recognised general stamp. Be clear-eyed about what dual means in
              practice: usually one coordinated visit and a shared evidence set, but two
              standards crosswalks, two commission decisions, and two sets of dues. Pursue it for
              a functional reason — state recognition, scholarship eligibility, credit transfer,
              parent trust — not as a logo exercise.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-[#0055A4]/5 to-[#6EBE44]/5 rounded-xl border border-[#0055A4]/15 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0055A4]/10 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-[#0055A4]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#002855] mb-2">The Accreditation Readiness Packet is being prepared</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  This page teaches the framework. The hands-on working tools — the printable
                  non-negotiables checklist, a domain-by-domain readiness self-assessment, and a
                  candidacy timeline planner — are being assembled into a free Accreditation
                  Readiness Packet for Christian school leaders. It isn't finished yet. Join the
                  list and we'll email you when it's ready — and packet list members get early
                  access before the public release.
                </p>
                <PacketInterestForm />
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> One email when the packet is ready. No spam, no
                  list sharing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-links + disclaimer */}
        <section>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/federal-tax-credit">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0055A4] hover:text-[#003d7a] cursor-pointer">
                Scholarship Tax Credit guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/membership">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0055A4] hover:text-[#003d7a] cursor-pointer">
                List or claim your school <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/resources">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0055A4] hover:text-[#003d7a] cursor-pointer">
                Resource Hub <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            This page is a general readiness framework drawn from accreditor-published standards
            and process documents (reviewed October 2026). It is not legal advice, it does not
            guarantee any accreditation outcome, and FindChristianSchools.com is not affiliated
            with any accrediting body listed. Standards, protocols, and fees change — confirm
            current requirements, timelines, and fee schedules with the accrediting body you
            choose before applying.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
