import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Heart, Globe, GraduationCap, Users, BookOpen, TrendingUp, School, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const supportedMissions = [
  { name: "Coming Soon", location: "Coming Soon", focus: "Coming Soon", status: "Coming Soon", image: "/manus-storage/IMG_0820_f3685dd9.png" },
  { name: "Coming Soon", location: "Coming Soon", focus: "Coming Soon", status: "Coming Soon", image: "/manus-storage/IMG_0839_493f50d9.jpeg" },
  { name: "Coming Soon", location: "Coming Soon", focus: "Coming Soon", status: "Coming Soon", image: "/manus-storage/IMG_0834_82c1db07.jpeg" },
  { name: "Coming Soon", location: "Coming Soon", focus: "Coming Soon", status: "Coming Soon", image: "/manus-storage/IMG_0844_92d26254.jpeg" },
  { name: "Coming Soon", location: "Coming Soon", focus: "Coming Soon", status: "Coming Soon", image: "/manus-storage/IMG_0842_a153dbd4.jpeg" },
  { name: "Coming Soon", location: "Coming Soon", focus: "Coming Soon", status: "Coming Soon", image: "/manus-storage/IMG_0843_28131255.jpeg" },
];

function DonateSection({ donationStats }: { donationStats: any }) {
  const donateMutation = trpc.stripe.createDonation.useMutation({
    onSuccess: (data: any) => {
      if (data.url) {
        toast.info("Redirecting to secure checkout...");
        window.open(data.url, '_blank');
      } else {
        toast.error("Failed to create checkout session");
      }
    },
    onError: () => toast.error("Could not start checkout. Please try again."),
  });

  const handleDonate = (amount: number) => {
    // amount in cents, minimum $1.00
    donateMutation.mutate({ amount: amount * 100, recurring: false });
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#6EBE44] to-[#4a9e2a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="/manus-storage/IMG_0839_493f50d9.jpeg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container text-center relative">
        <Heart className="w-10 h-10 text-white mx-auto mb-4" />
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Support the Mission</h2>
        <p className="text-green-100 max-w-xl mx-auto mb-6">
          Your donation directly funds scholarships, teacher training, and classroom construction 
          for Christian schools in developing nations.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[25, 50, 100, 250].map(amount => (
            <Button
              key={amount}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#002855] font-semibold"
              onClick={() => handleDonate(amount)}
              disabled={donateMutation.isPending}
            >
              ${amount}
            </Button>
          ))}
        </div>
        <p className="text-green-100 text-xs mt-4 opacity-80">Secure checkout powered by Stripe</p>
        {donationStats && (
          <p className="text-green-100 text-sm mt-4">
            {donationStats.donorCount} donors have contributed ${donationStats.totalDonations.toLocaleString()} to date
          </p>
        )}
      </div>
    </section>
  );
}

export default function Mission() {
  const { data: metrics } = trpc.impact.metrics.useQuery();
  const { data: donationStats } = trpc.impact.donationStats.useQuery();

  const topStats = [
    { label: "Students Helped", value: "Coming Soon", icon: GraduationCap },
    { label: "Schools Supported", value: "Coming Soon", icon: School },
    { label: "Countries Served", value: "Coming Soon", icon: Globe },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Top Stats Banner */}
      <section className="bg-[#002855] py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {topStats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 text-[#FFC72C] mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{typeof stat.value === 'number' ? stat.value : stat.value}</p>
                <p className="text-sm text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero with Judges 2:10 */}
      <section className="bg-gradient-to-br from-[#003d7a] to-[#0055A4] py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/manus-storage/IMG_0820_f3685dd9.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative text-center">
          <Heart className="w-12 h-12 text-[#FFC72C] mx-auto mb-6" />
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Our Mission & Global Impact</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Every listing on FindChristianSchools.org directly supports Christian education missions 
            in developing nations around the world.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto border border-white/20">
            <p className="text-white italic text-sm lg:text-base leading-relaxed">
              &ldquo;After that whole generation had been gathered to their ancestors, another generation grew up 
              who knew neither the Lord nor what he had done for Israel.&rdquo;
            </p>
            <p className="text-[#FFC72C] font-semibold mt-3 text-sm">— Judges 2:10 (NIV)</p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-[#002855] text-center mb-8">About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                FindChristianSchools.org was founded with a singular purpose: to ensure that no generation 
                grows up without knowing Christ. We are a team of educators, missionaries, and technology 
                professionals united by the belief that Christian education is the foundation of a faithful future.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our platform connects families across America with faith-based schools, homeschool resources, 
                and online programs — while simultaneously funding Christian education in nations where children 
                have never heard the Gospel.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe that when families choose Christian education, they are not only investing in their 
                own children's spiritual formation — they are investing in a child halfway around the world 
                who deserves the same opportunity.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden relative">
              <img src="/manus-storage/girl-pointing-up_f923b165.png" alt="Child pointing up toward heaven" className="w-full h-64 object-cover rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/80 to-transparent rounded-xl flex items-end p-6">
                <div className="text-white">
                  <Target className="w-6 h-6 text-[#FFC72C] mb-2" />
                  <h3 className="font-bold mb-1">Our Vision</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    A world where every child has access to Christ-centered education — from Main Street, USA 
                    to the most remote villages on earth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[#002855] mb-4">Why This Matters</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Judges 2:10 warns us of the devastating consequences when a generation grows up without knowing God. 
            This is not ancient history — it is a present reality in communities around the world where children 
            have no access to Christian education.
          </p>
          <p className="text-gray-700 leading-relaxed">
            FindChristianSchools.org exists to change that narrative. By connecting families with faith-based 
            education at home and funding Christian schools abroad, we are building a generation that knows the 
            Lord and can pass that knowledge to their children.
          </p>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#002855] text-center mb-10">Our Impact So Far</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Scholarships Funded', 'Classrooms Built', 'Teachers Supported', 'Countries Reached', 'Students Impacted'].map((name, i) => {
              const metricIcons: Record<string, any> = {
                'Scholarships Funded': GraduationCap,
                'Classrooms Built': BookOpen,
                'Teachers Supported': Users,
                'Countries Reached': Globe,
                'Students Impacted': TrendingUp,
              };
              const Icon = metricIcons[name] || Heart;
              return (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-6 text-center">
                  <Icon className="w-8 h-8 text-[#6EBE44] mx-auto mb-3" />
                  <p className="text-2xl lg:text-3xl font-bold text-[#002855]">0</p>
                  <p className="text-xs text-gray-500 mt-1">{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Missions */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#002855] text-center mb-3">Missions We Support</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            A portion of every premium membership and donation goes directly to these mission partners 
            providing Christian education around the world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedMissions.map((mission, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {mission.image && (
                  <img src={mission.image} alt={mission.name} className="w-full h-40 object-cover" />
                )}
                <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#0055A4]" />
                  </div>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {mission.location}
                  </span>
                </div>
                <h3 className="font-semibold text-[#002855] mb-2">{mission.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{mission.focus}</p>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-center">
                    {mission.status}
                  </p>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#002855] text-center mb-10">How Every Listing Gives Back</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Schools List", desc: "Christian schools join our directory with a free or premium listing." },
              { step: "2", title: "We Fund Missions", desc: "A portion of every premium membership goes directly to mission partners." },
              { step: "3", title: "Children Learn", desc: "Students in underserved nations receive Christian education and hope." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#6EBE44] text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[#002855] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#002855] text-center mb-3">From the Field</h2>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-8">Real photos from our mission partners around the world.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              "/manus-storage/IMG_0820_f3685dd9.png",
              "/manus-storage/IMG_0843_28131255.jpeg",
              "/manus-storage/IMG_0842_a153dbd4.jpeg",
              "/manus-storage/IMG_0844_92d26254.jpeg",
              "/manus-storage/IMG_0839_493f50d9.jpeg",
              "/manus-storage/IMG_0840_367de7f8.jpeg",
              "/manus-storage/IMG_0835_094a6364.jpeg",
              "/manus-storage/IMG_0841_8d181ea6.jpeg",
            ].map((src, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <img src={src} alt="Mission field photo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#002855] text-center mb-10">Impact Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { quote: "Coming Soon", author: "Coming Soon", role: "Coming Soon", image: "/manus-storage/IMG_0844_92d26254.jpeg" },
              { quote: "Coming Soon", author: "Coming Soon", role: "Coming Soon", image: "/manus-storage/IMG_0820_f3685dd9.png" },
              { quote: "Coming Soon", author: "Coming Soon", role: "Coming Soon", image: "/manus-storage/IMG_0839_493f50d9.jpeg" },
              { quote: "Coming Soon", author: "Coming Soon", role: "Coming Soon", image: "/manus-storage/IMG_0843_28131255.jpeg" },
            ].map((story, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 flex gap-4">
                <img src={story.image} alt={story.author} className="w-16 h-16 rounded-full object-cover shrink-0" />
                <div>
                  <p className="text-sm text-gray-700 italic leading-relaxed mb-3">&ldquo;{story.quote}&rdquo;</p>
                  <p className="text-sm font-semibold text-[#002855]">{story.author}</p>
                  <p className="text-xs text-gray-500">{story.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <DonateSection donationStats={donationStats} />

      <Footer />
    </div>
  );
}
