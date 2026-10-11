import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Users, BookOpen, Globe, Zap, CheckCircle, Mail, GraduationCap, Calendar } from 'lucide-react';
import { Link } from 'wouter';
import { LOGO_DATA_URI } from "@/logo";
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Welcome() {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'school' | 'parent' | 'other'>('school');
  const [otherDescription, setOtherDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newsletterMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success('Thank you for subscribing! Check your email to confirm.');
      setEmail('');
      setOtherDescription('');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to subscribe. Please try again.');
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    if (userType === 'other' && !otherDescription) {
      toast.error('Please tell us what you\'re interested in');
      return;
    }
    setIsSubmitting(true);
    newsletterMutation.mutate({
      email,
      userType,
      otherDescription: userType === 'other' ? otherDescription : undefined,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#0055A4] text-white py-12 md:py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <img
            src={LOGO_DATA_URI}
            alt="Find Christian Schools™ Logo"
            className="h-16 md:h-24 mx-auto mb-4 md:mb-8 drop-shadow-lg"
          />
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Welcome to Find Christian Schools<span className="trademark">™</span>
          </h1>
          <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            A movement to connect, support, and empower Christian education globally
          </p>
          <div className="h-1 w-24 bg-[#6EBE44] mx-auto"></div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-8 md:py-16 px-4 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
            {/* Founder Photo */}
            <div className="flex col-span-full md:col-span-1 flex-col items-center">
              <div className="w-32 h-32 md:w-full md:max-w-xs rounded-full md:rounded-lg shadow-lg mb-4 md:mb-6 md:h-80 overflow-hidden">
                <img src="data:image/jpeg;base64,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" alt="David O'Riordan" className="w-full h-full object-cover" />
              </div>
              <div className="text-center mb-4 md:mb-8">
                <h3 className="text-sm md:text-lg font-bold text-[#002855]">David O'Riordan</h3>
                <p className="text-xs md:text-sm text-[#6EBE44] font-semibold">Founder & Executive Director</p>
                <p className="text-xs text-gray-600 mt-1">FindChristianSchools.com</p>
              </div>
              {/* Timeline - hidden on mobile */}
              <div className="hidden md:block w-full pt-4 md:pt-8 border-t border-gray-200">
                <h4 className="text-xs md:text-sm font-bold text-[#002855] mb-4 md:mb-6 uppercase tracking-wide">Our Journey</h4>
                <div className="space-y-4 md:space-y-6">
                  {/* Timeline Item 1 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#6EBE44] mt-1"></div>
                      <div className="w-0.5 h-12 md:h-16 bg-gradient-to-b from-[#6EBE44] to-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#6EBE44] uppercase">May 2026</p>
                      <p className="text-xs md:text-sm font-semibold text-[#002855]">Website Launched</p>
                      <p className="text-xs text-gray-600 mt-0.5">Platform goes live</p>
                    </div>
                  </div>
                  {/* Timeline Item 2 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0055A4] mt-1"></div>
                      <div className="w-0.5 h-12 md:h-16 bg-gradient-to-b from-[#0055A4] to-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0055A4] uppercase">May 2026</p>
                      <p className="text-xs md:text-sm font-semibold text-[#002855]">Initial Partners Secured</p>
                      <p className="text-xs text-gray-600 mt-0.5">Strategic partnerships announced</p>
                    </div>
                  </div>
                  {/* Timeline Item 3 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#6EBE44] mt-1"></div>
                      <div className="w-0.5 h-0 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#6EBE44] uppercase">June 1, 2026</p>
                      <p className="text-xs md:text-sm font-semibold text-[#002855]">Official Launch</p>
                      <p className="text-xs text-gray-600 mt-0.5">Full platform release</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Story Text */}
            <div className="col-span-full md:col-span-2 bg-white rounded-lg shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-[#002855] mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                My name is <span className="font-semibold">David O'Riordan</span>, and I'm the founder of Find Christian Schools<span className="trademark">™</span>. My journey has been shaped by a deep conviction about the power of Christian education and its critical role in shaping the next generation.
              </p>
              <p>
                Over the years, I've had the privilege of serving in multiple capacities: founding and leading chambers of commerce, working extensively in the nonprofit sector, and serving as an educator and administrator in Christian schools. My wife is a dedicated teacher in a Christian school, and together we've both homeschooled our children and served in ministry and education. These experiences have given us a front-row seat to the transformative power of faith-centered learning.
              </p>
              <p className="italic border-l-4 border-[#6EBE44] pl-4">
                "By the time a child reaches age 13, their foundational beliefs are largely formed. The values, faith, and worldview they develop in their early years will shape the rest of their lives. This is why Christian education matters so profoundly."
              </p>
              <p>
                Originally from Ireland—a country with a small but vibrant Christian community—I didn't fully grasp the power of the Christian education movement until I came to the United States. Witnessing the scale and impact of Christian schools here was transformative. Yet as our world changes rapidly, this movement faces unprecedented challenges. Christian education is more critical than ever as a "city on a hill" in an increasingly secular landscape.
              </p>
              <p>
                I also recognize that not all countries have the educational opportunities we enjoy in America. Many regions lack access to quality Christian education entirely. This is why Find Christian Schools<span className="trademark">™</span> exists: to connect families with faith-based education, support educators and institutions, and give back globally by supporting Christian education in places where it would otherwise be impossible.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002855] mb-12 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg">
              <BookOpen className="w-12 h-12 text-[#6EBE44] mb-4" />
              <h3 className="text-xl font-bold text-[#002855] mb-3">Biblical Foundation</h3>
              <p className="text-gray-700 mb-4">
                "Train up a child in the way they should go; even when old, they will not depart from it." — Proverbs 22:6
              </p>
              <p className="text-sm text-gray-600">
                Christian education plants seeds of faith that bear fruit throughout a lifetime. We believe in the power of Scripture-centered learning to transform lives and communities.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <Globe className="w-12 h-12 text-[#6EBE44] mb-4" />
              <h3 className="text-xl font-bold text-[#002855] mb-3">Global Impact</h3>
              <p className="text-gray-700 mb-4">
                "Go therefore and make disciples of all nations..." — Matthew 28:19
              </p>
              <p className="text-sm text-gray-600">
                We're committed to supporting Christian education not just in America, but globally—ensuring that children everywhere have access to faith-centered learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002855] mb-8 text-center">The Challenge We Face</h2>
          <div className="bg-white rounded-lg p-8 shadow-md">
            <p className="text-gray-700 leading-relaxed mb-6">
              In the book of Judges, we see a sobering pattern: "After that whole generation had been gathered to their ancestors, another generation grew up who knew neither the Lord nor what he had done for Israel." (Judges 2:10)
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We face a similar risk today. As our culture becomes increasingly secular, it's easier than ever for children to grow up without understanding the foundational truths of the Christian faith. The institutions and values that shaped previous generations are under pressure.
            </p>
            <p className="text-lg font-semibold text-[#002855]">
              This is why Christian education is not optional—it's essential.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002855] mb-12 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <GraduationCap className="w-12 h-12 text-[#6EBE44] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#002855] mb-3">Find Schools</h3>
              <p className="text-gray-600">
                Search and discover Christian schools, online programs, and homeschool resources tailored to your family's needs.
              </p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-[#6EBE44] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#002855] mb-3">Connect Community</h3>
              <p className="text-gray-600">
                Join a vibrant community of parents, educators, and students united in the mission of Christian education.
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-[#6EBE44] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#002855] mb-3">Support Globally</h3>
              <p className="text-gray-600">
                Premium memberships support Christian education initiatives in regions where access is limited or impossible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002855] mb-12 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Comprehensive school directory with detailed profiles',
              'Advanced search and filtering by location, program type, and grade level',
              'Interactive maps and school location data',
              'Curated resources for homeschooling families',
              'Job listings for educators and administrators',
              'Event calendar for Christian education conferences',
              'Premium school listings with photos and testimonials',
              'Newsletter for parents, schools, and educators',
              'Analytics dashboard for schools',
              'Global mission support through premium memberships',
              'Free and premium membership options',
              'Community engagement and networking',
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#6EBE44] shrink-0 mt-1" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#002855] mb-12">Our Partners</h2>
          <div className="bg-gray-100 rounded-lg p-12">
            <p className="text-gray-600 text-lg font-semibold">Coming Soon</p>
            <p className="text-gray-500 mt-2">We're partnering with leading Christian education organizations to expand our impact.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#002855] to-[#0055A4] text-white">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Stay Connected</h2>
          <form onSubmit={handleNewsletterSubmit} className="bg-white/10 backdrop-blur rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">I am a...</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'school', label: 'School' },
                    { value: 'parent', label: 'Parent' },
                    { value: 'other', label: 'Other' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setUserType(option.value as any)}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                        userType === option.value
                          ? 'bg-[#6EBE44] text-[#002855]'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {userType === 'other' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">What are you interested in?</label>
                  <input
                    type="text"
                    value={otherDescription}
                    onChange={(e) => setOtherDescription(e.target.value)}
                    placeholder="Tell us more..."
                    className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EBE44]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EBE44]"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#6EBE44] hover:bg-[#5aa838] text-white font-semibold py-3 border-0"
              >
                <Mail className="w-4 h-4 mr-2" />
                Subscribe to Newsletter
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002855] mb-12 text-center">Get Started Today</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Listing */}
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-gray-200">
              <h3 className="text-xl font-bold text-[#002855] mb-4">List Your School Free</h3>
              <p className="text-gray-600 mb-6">
                Get your school in front of thousands of families searching for Christian education.
              </p>
              <Link href="/membership">
                <Button className="w-full bg-[#002855] hover:bg-[#001a3d] text-white border-0 font-semibold">
                  List Your School
                </Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-[#6EBE44] to-[#5aa838] rounded-lg p-8 text-center border-2 border-[#6EBE44] transform md:scale-105 shadow-lg">
              <div className="bg-white/20 inline-block px-3 py-1 rounded-full text-sm font-bold text-white mb-4">
                FOUNDERS SPECIAL
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium Listing</h3>
              <p className="text-white/90 mb-4">
                <span className="line-through text-sm">$99/year</span>
                <br />
                <span className="text-3xl font-bold">$49.50/year</span>
              </p>
              <p className="text-white/80 text-sm mb-6">
                Use code: <span className="font-bold text-lg">FOUNDER50</span>
              </p>
              <p className="text-white/90 mb-6 text-sm">
                Full profile, photos, analytics, and support global Christian education.
              </p>
              <Link href="/membership">
                <Button className="w-full bg-white text-[#6EBE44] hover:bg-gray-100 border-0 font-bold">
                  Upgrade to Premium
                </Button>
              </Link>
            </div>

            {/* Donate */}
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-gray-200">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#002855] mb-4">Support Our Mission</h3>
              <p className="text-gray-600 mb-6">
                Your donation directly supports Christian education globally.
              </p>
              <Link href="/mission">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white border-0 font-semibold">
                  Make a Donation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#002855] to-[#0055A4] text-white">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl text-blue-100 mb-8">
            Christian education is more critical than ever. Whether you're a school, parent, educator, or supporter, there's a place for you in this movement.
          </p>
          <p className="text-lg text-blue-100 mb-8">
            Share this site with your friends. Help us make an impact for Christian education. Together, we can ensure that the next generation knows the Lord and understands what He has done.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/search">
              <Button className="bg-[#6EBE44] hover:bg-[#5aa838] text-white font-bold px-8 py-3 border-0">
                Find a School
              </Button>
            </Link>
            <Link href="/membership">
              <Button className="bg-white text-[#002855] hover:bg-gray-100 font-bold px-8 py-3 border-0">
                List Your School
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
