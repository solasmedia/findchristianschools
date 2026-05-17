import { Link } from "wouter";
import { Heart, Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#002855] text-white">
      {/* Return to Home */}
      <div className="bg-gray-100 py-6">
        <div className="container flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0055A4] hover:bg-[#002855] text-white font-medium text-sm transition-colors shadow-sm no-underline">
            <Home className="w-4 h-4" />
            Return to Home Page
          </Link>
        </div>
      </div>
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-xl font-bold">
                <span className="text-[#6EBE44]">Find</span>
                <span className="text-white">ChristianSchools</span>
                <span className="text-white opacity-70">.org<span className="trademark">™</span></span>
              </span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed mb-4">
              Connecting families with faith-based education and supporting Christian missions worldwide.
            </p>
            <p className="text-xs font-semibold tracking-widest text-[#FFC72C] uppercase">
              Faith &middot; Education &middot; Future<span className="trademark">™</span>
            </p>
          </div>

          {/* Directory */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#6EBE44] mb-4">Directory</h4>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-sm text-blue-200 hover:text-white transition-colors">Find a School</Link></li>
              <li><Link href="/international" className="text-sm text-blue-200 hover:text-white transition-colors">International Schools</Link></li>
              <li><Link href="/states" className="text-sm text-blue-200 hover:text-white transition-colors">Browse by State</Link></li>
              <li><Link href="/compare" className="text-sm text-blue-200 hover:text-white transition-colors">Compare Schools</Link></li>
              <li><Link href="/submit" className="text-sm text-blue-200 hover:text-white transition-colors">List Your School</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#6EBE44] mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/resources" className="text-sm text-blue-200 hover:text-white transition-colors">Homeschool Resources</Link></li>
              <li><Link href="/jobs" className="text-sm text-blue-200 hover:text-white transition-colors">Job Board</Link></li>
              <li><Link href="/events" className="text-sm text-blue-200 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/mission" className="text-sm text-blue-200 hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="/sponsor" className="text-sm text-blue-200 hover:text-white transition-colors">Become a Sponsor</Link></li>
              <li><Link href="/welcome" className="text-sm text-blue-200 hover:text-white transition-colors">Welcome</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#6EBE44] mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/donate" className="text-sm text-blue-200 hover:text-white transition-colors">Donate</Link></li>
              <li><Link href="/save-to-home-screen" className="text-sm text-blue-200 hover:text-white transition-colors">Save to Home Screen</Link></li>
              <li><Link href="/admin-login" className="text-sm text-blue-200 hover:text-white transition-colors">Admin Login</Link></li>
              <li><Link href="/contact" className="text-sm text-blue-200 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-blue-200 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-blue-200 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal-contact" className="text-sm text-blue-200 hover:text-white transition-colors">Legal Contact</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-blue-200 hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-blue-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <p className="text-xs text-blue-300">
              &copy; 2026 FindChristianSchools.org<span className="trademark">™</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-blue-300">
              <span>Every listing supports</span>
              <Heart className="w-3 h-3 text-[#FFC72C] fill-[#FFC72C]" />
              <span>Christian education missions globally</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-300 border-t border-blue-800 pt-4">
            <p>
              Part of the <a href="https://findchristian.org" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">FindChristian.org</a> network
            </p>
            <p>
              Operated by <a href="https://solasmedia.com" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Solas Media LLC</a>
            </p>
            <p className="text-blue-400 opacity-75">
              Unauthorized copying prohibited.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
