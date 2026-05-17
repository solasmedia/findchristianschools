import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Users, BookOpen, Globe, Zap, CheckCircle, Mail, GraduationCap, Calendar } from 'lucide-react';
import { Link } from 'wouter';
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
            src="/manus-storage/fcs-logo-org_b0a30a09.png"
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
              <img
                src="/manus-storage/david-oriordan-founder_e804f4f4.jpeg"
                alt="David O'Riordan, Founder and Executive Director"
                className="w-32 h-32 md:w-full md:max-w-xs rounded-full md:rounded-lg shadow-lg mb-4 md:mb-6 object-cover md:h-80"
              />
              <div className="text-center mb-4 md:mb-8">
                <h3 className="text-sm md:text-lg font-bold text-[#002855]">David O'Riordan</h3>
                <p className="text-xs md:text-sm text-[#6EBE44] font-semibold">Founder & Executive Director</p>
                <p className="text-xs text-gray-600 mt-1">Find Christian Schools<span className="trademark">™</span>.org</p>
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
