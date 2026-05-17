import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Smartphone, Monitor, Apple, Chrome } from "lucide-react";

export default function SaveToHomeScreen() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#0055A4]/10 rounded-full flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-[#0055A4]" />
            </div>
            <h1 className="text-3xl font-bold text-[#002855]">Save to Home Screen</h1>
            <p className="text-gray-600 mt-2 max-w-lg mx-auto">
              Access FindChristianSchools.org instantly from your phone or tablet — just like an app, no download required.
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            {/* iPhone / iPad */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Apple className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-[#002855]">iPhone & iPad (Safari)</h2>
              </div>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#0055A4] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Open <strong>FindChristianSchools.org</strong> in Safari</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#0055A4] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Tap the <strong>Share button</strong> (square with arrow pointing up) at the bottom of the screen</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#0055A4] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#0055A4] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Tap <strong>"Add"</strong> in the top right corner</span>
                </li>
              </ol>
              <p className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                The app icon will appear on your home screen with our logo. Tap it anytime to open FindChristianSchools.org instantly!
              </p>
            </div>

            {/* Android */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center">
                  <Chrome className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-[#002855]">Android (Chrome)</h2>
              </div>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#6EBE44] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Open <strong>FindChristianSchools.org</strong> in Chrome</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#6EBE44] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Tap the <strong>three dots menu</strong> (top right corner)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#6EBE44] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#6EBE44] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Tap <strong>"Add"</strong> to confirm</span>
                </li>
              </ol>
              <p className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                Some Android phones may show a banner at the bottom offering to install the app — just tap "Install"!
              </p>
            </div>

            {/* Desktop */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0055A4] rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-[#002855]">Desktop (Chrome / Edge)</h2>
              </div>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#002855] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Visit <strong>FindChristianSchools.org</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#002855] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Look for the <strong>install icon</strong> in the address bar (or click the three dots menu)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#002855] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Click <strong>"Install"</strong> or <strong>"Create shortcut"</strong></span>
                </li>
              </ol>
              <p className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                You can also bookmark the site for quick access from your browser's bookmarks bar.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center bg-gradient-to-r from-[#002855] to-[#0055A4] rounded-xl p-8 text-white">
            <h3 className="text-xl font-bold mb-2">Find Schools Faster</h3>
            <p className="text-sm text-blue-100 mb-4">
              With the icon on your home screen, you're one tap away from finding the perfect Christian school.
            </p>
            <p className="text-xs text-blue-200">
              FAITH · EDUCATION · FUTURE
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
