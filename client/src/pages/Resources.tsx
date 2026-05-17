import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, ExternalLink, GraduationCap, Heart, DollarSign, Compass, ChevronRight, MessageSquare } from "lucide-react";

const guideCards = [
  {
    icon: Compass,
    color: "#0055A4",
    bg: "bg-[#0055A4]/10",
    title: "Choosing the Right Christian School",
    description: "A step-by-step guide to evaluating faith alignment, academic quality, community culture, and practical factors like tuition and location.",
    tips: [
      "Assess the school's statement of faith and doctrinal alignment with your family",
      "Visit in person — observe classroom culture and student interactions",
      "Ask about accreditation (ACSI, Cognia) and college placement rates",
      "Review extracurricular offerings and how they support whole-child development",
      "Talk to current parents about community, communication, and support",
    ],
  },
  {
    icon: GraduationCap,
    color: "#6EBE44",
    bg: "bg-[#6EBE44]/10",
    title: "Faith-Based Admission Guide",
    description: "Understand what Christian schools look for in applicants — from faith statements to academic records — and how to present your family's best story.",
    tips: [
      "Prepare a family faith statement that authentically reflects your beliefs",
      "Gather transcripts, standardized test scores, and teacher recommendations early",
      "Be ready to discuss your child's spiritual journey and church involvement",
      "Ask about scholarship and financial aid deadlines — many are in January/February",
      "Follow up after interviews with a thank-you note to the admissions director",
    ],
  },
  {
    icon: DollarSign,
    color: "#c9a227",
    bg: "bg-[#FFC72C]/20",
    title: "Financial Aid for Christian Families",
    description: "Explore tuition assistance options — from school-based scholarships to state ESA programs — that make Christian education accessible for every family.",
    tips: [
      "Check your state's Education Savings Account (ESA) or voucher program eligibility",
      "Ask each school about need-based aid, sibling discounts, and payment plans",
      "Look into ACSI scholarships and denominational education foundations",
      "Research 529 plan rules — many states allow K-12 tuition withdrawals",
      "Consider co-op arrangements or part-time enrollment to reduce costs",
    ],
  },
  {
    icon: Heart,
    color: "#e05252",
    bg: "bg-red-50",
    title: "Christian Parent Tips",
    description: "Practical wisdom for supporting your child's faith-integrated education at home — from devotional routines to navigating tough cultural conversations.",
    tips: [
      "Reinforce school Bible lessons with family devotionals using the same passages",
      "Create a homework environment that prioritizes prayer before study",
      "Stay connected with teachers — they are partners in your child's discipleship",
      "Discuss current events through a biblical worldview lens at the dinner table",
      "Celebrate spiritual milestones (baptism, scripture memorization) as a family",
    ],
  },
];

function GuideCard({ card }: { card: typeof guideCards[0] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = card.icon;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6" style={{ color: card.color }} />
        </div>
        <div>
          <h3 className="font-semibold text-[#002855] text-base leading-tight mb-1">{card.title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
        </div>
      </div>
      {expanded && (
        <ul className="space-y-2 mb-4 pl-2">
          {card.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#6EBE44]" />
              {tip}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-medium text-[#0055A4] hover:text-[#003d7a] transition-colors flex items-center gap-1"
      >
        {expanded ? 'Show less' : 'Read tips'}
        <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
    </div>
  );
}

const categories = [
  { value: "", label: "All Resources" },
  { value: "curriculum", label: "Curriculum" },
  { value: "coop", label: "Co-ops" },
  { value: "tutor", label: "Tutors" },
  { value: "online_course", label: "Online Courses" },
  { value: "college_prep", label: "College Prep" },
  { value: "testing", label: "Testing" },
  { value: "special_needs", label: "Special Needs" },
  { value: "other", label: "Other" },
];

export default function Resources() {
  const [category, setCategory] = useState("");
  const { data, isLoading } = trpc.resources.list.useQuery({ category: category || undefined, limit: 50 });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-12">
        <div className="container">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Christian Education Resource Hub</h1>
          <p className="text-blue-200">Guides, curriculum providers, co-ops, tutors, and tools for Christian families.</p>
        </div>
      </section>

      {/* Parent Guides Section */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="container">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#002855] mb-1">Parent Guides</h2>
            <p className="text-sm text-gray-500">Practical guides to help you navigate Christian education with confidence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guideCards.map((card, i) => (
              <GuideCard key={i} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section className="flex-1 bg-gray-50 py-8">
        <div className="container">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#002855] mb-1">Resource Directory</h2>
            <p className="text-sm text-gray-500">Curriculum providers, co-ops, tutors, and online courses for Christian families.</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-[#0055A4] text-white border-[#0055A4]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#0055A4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.resources.map(resource => (
                <div key={resource.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#6EBE44]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#6EBE44]" />
                    </div>
                    {resource.featured && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFC72C]/20 text-[#002855]">Featured</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#002855] mb-1 text-sm">{resource.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                      {resource.category?.replace('_', ' ')}
                    </span>
                    {resource.website && (
                      <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0055A4] hover:underline flex items-center gap-1">
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.resources.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No resources found</h3>
              <p className="text-sm text-gray-500">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-white border-t border-gray-100 py-10">
        <div className="container">
          <div className="bg-gradient-to-r from-[#0055A4]/5 to-[#6EBE44]/5 rounded-xl border border-[#0055A4]/10 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0055A4]/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-[#0055A4]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#002855] mb-2">Help Us Improve</h3>
                <p className="text-sm text-gray-600 mb-4">Have feedback about Find Christian Schools? We'd love to hear your ideas for new features, bug reports, or general suggestions.</p>
                <a href="/feedback" className="inline-flex items-center gap-2 text-sm font-medium text-[#0055A4] hover:text-[#003d7a] transition-colors">
                  Share Your Feedback <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
