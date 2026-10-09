import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapPin, ChevronRight } from "lucide-react";

const stateNames: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"
};

export default function CityHub() {
  const params = useParams();
  const stateCode = (params.code || "").toUpperCase();
  const citySlug = params.city || "";
  // Convert slug back to city name (e.g., "palm-bay" -> "Palm Bay")
  const cityName = citySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const stateName = stateNames[stateCode] || stateCode;

  const { data, isLoading } = trpc.schools.search.useQuery({
    city: cityName,
    state: stateCode,
    limit: 50,
  });

  useEffect(() => {
    document.title = `Christian Schools in ${cityName}, ${stateName} | FindChristianSchools.org`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `Find Christian schools in ${cityName}, ${stateName}. Browse ${data?.total || ""} faith-based schools with grades, tuition, and program details.`);
    return () => { document.title = 'FindChristianSchools.org | Faith · Education · Future'; };
  }, [cityName, stateName, data?.total]);

  const schools = data?.schools || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="bg-gradient-to-br from-[#002855] to-[#0055A4] text-white py-12">
        <div className="container">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <Link href="/states" className="hover:text-white">States</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/state/${stateCode}`} className="hover:text-white">{stateName}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{cityName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Christian Schools in {cityName}, {stateName}
          </h1>
          <p className="text-white/80">
            {isLoading ? "Loading..." : `Found ${data?.total || 0} Christian ${(data?.total || 0) === 1 ? "school" : "schools"} in ${cityName}`}
          </p>
        </div>
      </div>

      <div className="container py-8 flex-1">
        {isLoading ? (
          <p className="text-gray-500">Loading schools...</p>
        ) : schools.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No schools found in {cityName}. Try a nearby city or broaden your search.</p>
            <Link href="/search" className="text-blue-600 hover:underline mt-2 inline-block">Search all schools</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school: any) => (
              <Link key={school.id} href={`/school/${school.slug}`}>
                <div className="border rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-[#002855]">{school.name}</h3>
                    {school.listingStatus === 'verified' && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500 text-white ml-2 shrink-0">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {school.city}, {school.stateCode} {school.zip}
                  </p>
                  {school.gradeStart && (
                    <p className="text-xs text-gray-400 mt-1">Grades {school.gradeStart}–{school.gradeEnd}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#002855] mb-2">About Christian Schools in {cityName}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Finding the right Christian school in {cityName}, {stateName} means looking at faith integration,
            academics, and community fit. The schools listed above represent faith-based educational options
            in the {cityName} area. Verified schools have affirmed our Statement of Faith.
            If you represent a school in {cityName}, claim your listing to update details and get verified.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
