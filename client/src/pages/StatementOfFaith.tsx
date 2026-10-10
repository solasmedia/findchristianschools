import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const TENETS = [
  {
    title: "1. The Holy Scriptures",
    text: "We believe the Bible is the inspired, infallible, and authoritative Word of God, without error in all that it affirms, and the final authority for faith and life (2 Timothy 3:16-17; 2 Peter 1:20-21).",
  },
  {
    title: "2. The Trinity",
    text: "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit — co-equal in power, glory, and nature (Matthew 28:19; 2 Corinthians 13:14).",
  },
  {
    title: "3. Jesus Christ",
    text: "We believe in the deity of Jesus Christ, His virgin birth, His sinless life, His miracles, His atoning death on the cross, His bodily resurrection, His ascension to the right hand of the Father, and His personal return in power and glory (John 1:1-14; 1 Corinthians 15:3-4).",
  },
  {
    title: "4. Salvation",
    text: "We believe salvation is a gift of God received through faith in Jesus Christ alone, not by works, and that all who repent and believe are justified, regenerated, and sealed by the Holy Spirit (Ephesians 2:8-9; John 3:16; Romans 10:9-10).",
  },
  {
    title: "5. The Holy Spirit",
    text: "We believe the Holy Spirit indwells every believer, empowering them to live a godly life, and that He convicts the world of sin, righteousness, and judgment (John 14:16-17; Romans 8:9-11).",
  },
  {
    title: "6. Marriage & Sexuality",
    text: "We believe God created marriage as a sacred covenant between one biological man and one biological woman (Genesis 2:24; Matthew 19:4-6). We believe sexual intimacy is designed by God to be expressed solely within this marital relationship. We believe God created mankind as male and female, and that each person's biological sex is an intentional gift reflecting God's design (Genesis 1:27).",
  },
  {
    title: "7. Sanctity of Life",
    text: "We believe all human life is sacred and created in the image of God from conception to natural death (Psalm 139:13-16; Jeremiah 1:5).",
  },
  {
    title: "8. The Church",
    text: "We believe in the universal Church as the body of Christ, composed of all believers, and in the importance of the local church for worship, fellowship, discipleship, and mission (Hebrews 10:24-25; Acts 2:42-47).",
  },
  {
    title: "9. The Great Commission",
    text: "We believe it is the responsibility of every Christian to share the Gospel and make disciples of all nations, and that Christian education is a vital expression of this calling (Matthew 28:18-20).",
  },
];

export default function StatementOfFaith() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-[#0055A4]" />
            <h1 className="text-3xl font-bold text-[#002855]">Statement of Faith</h1>
          </div>
          <p className="text-gray-500 italic mb-8">
            FindChristianSchools.org affirms the following core Christian beliefs. All listed organizations must be in agreement with these tenets.
          </p>

          <div className="space-y-6">
            {TENETS.map((t) => (
              <div key={t.title}>
                <h2 className="font-semibold text-[#002855] text-lg mb-1">{t.title}</h2>
                <p className="text-gray-700 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-red-50 border border-red-200 rounded-lg p-5">
            <p className="text-sm text-red-800 font-medium">Compliance & Withdrawal Notice</p>
            <p className="text-sm text-red-700 mt-1">
              Any organization found to violate or no longer uphold this Statement of Faith may be withdrawn from the FindChristianSchools.org directory at any time, without prior notice. By submitting a listing, you acknowledge and accept this policy.
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-8 pt-4 border-t">
            Last updated: October 2026.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
