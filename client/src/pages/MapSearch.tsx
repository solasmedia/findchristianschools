import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, School, Phone, ExternalLink } from "lucide-react";

const US_STATES = [
  {code:"AL",name:"Alabama"},{code:"AK",name:"Alaska"},{code:"AZ",name:"Arizona"},{code:"AR",name:"Arkansas"},
  {code:"CA",name:"California"},{code:"CO",name:"Colorado"},{code:"CT",name:"Connecticut"},{code:"DE",name:"Delaware"},
  {code:"FL",name:"Florida"},{code:"GA",name:"Georgia"},{code:"HI",name:"Hawaii"},{code:"ID",name:"Idaho"},
  {code:"IL",name:"Illinois"},{code:"IN",name:"Indiana"},{code:"IA",name:"Iowa"},{code:"KS",name:"Kansas"},
  {code:"KY",name:"Kentucky"},{code:"LA",name:"Louisiana"},{code:"ME",name:"Maine"},{code:"MD",name:"Maryland"},
  {code:"MA",name:"Massachusetts"},{code:"MI",name:"Michigan"},{code:"MN",name:"Minnesota"},{code:"MS",name:"Mississippi"},
  {code:"MO",name:"Missouri"},{code:"MT",name:"Montana"},{code:"NE",name:"Nebraska"},{code:"NV",name:"Nevada"},
  {code:"NH",name:"New Hampshire"},{code:"NJ",name:"New Jersey"},{code:"NM",name:"New Mexico"},{code:"NY",name:"New York"},
  {code:"NC",name:"North Carolina"},{code:"ND",name:"North Dakota"},{code:"OH",name:"Ohio"},{code:"OK",name:"Oklahoma"},
  {code:"OR",name:"Oregon"},{code:"PA",name:"Pennsylvania"},{code:"RI",name:"Rhode Island"},{code:"SC",name:"South Carolina"},
  {code:"SD",name:"South Dakota"},{code:"TN",name:"Tennessee"},{code:"TX",name:"Texas"},{code:"UT",name:"Utah"},
  {code:"VT",name:"Vermont"},{code:"VA",name:"Virginia"},{code:"WA",name:"Washington"},{code:"WV",name:"West Virginia"},
  {code:"WI",name:"Wisconsin"},{code:"WY",name:"Wyoming"}
];

export default function MapSearch() {
  const [stateCode, setStateCode] = useState("TX");
  const [query, setQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const searchParams = useMemo(() => ({
    state: stateCode || undefined,
    query: query || undefined,
    limit: 50,
  }), [stateCode, query]);

  const { data, isLoading } = trpc.schools.search.useQuery(searchParams);

  const onMapReady = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    map.setCenter({ lat: 31.9686, lng: -99.9018 }); // Texas center
    map.setZoom(6);
  }, []);

  // Update markers when data changes
  useMemo(() => {
    if (!mapInstance || !data?.schools) return;
    // Clear old markers
    markers.forEach(m => m.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    data.schools.forEach((school: any) => {
      if (school.latitude && school.longitude) {
        const marker = new google.maps.Marker({
          position: { lat: parseFloat(school.latitude), lng: parseFloat(school.longitude) },
          map: mapInstance,
          title: school.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: school.isPremium ? '#6EBE44' : '#0055A4',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
        marker.addListener('click', () => setSelectedSchool(school));
        newMarkers.push(marker);
      }
    });
    setMarkers(newMarkers);
  }, [mapInstance, data]);

  // Update map center based on state
  useMemo(() => {
    if (!mapInstance || !stateCode) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: US_STATES.find(s => s.code === stateCode)?.name + ', USA' }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        mapInstance.setCenter(results[0].geometry.location);
        mapInstance.setZoom(7);
      }
    });
  }, [mapInstance, stateCode]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      {/* Search Bar */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input placeholder="Search schools..." className="pl-10" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <Select value={stateCode} onValueChange={setStateCode}>
            <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Select State" /></SelectTrigger>
            <SelectContent>
              {US_STATES.map(s => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Link href="/search">
            <Button variant="outline" className="border-[#0055A4] text-[#0055A4]">List View</Button>
          </Link>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white border-r overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="p-4 border-b">
            <p className="text-sm text-gray-600">
              {isLoading ? "Searching..." : `${data?.schools?.length || 0} schools found`}
            </p>
          </div>
          <div className="divide-y">
            {data?.schools?.map((school: any) => (
              <div
                key={school.id}
                className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedSchool?.id === school.id ? 'bg-blue-50 border-l-4 border-[#0055A4]' : ''}`}
                onClick={() => setSelectedSchool(school)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${school.isPremium ? 'bg-[#6EBE44]/10' : 'bg-[#0055A4]/10'}`}>
                    <School className={`w-5 h-5 ${school.isPremium ? 'text-[#6EBE44]' : 'text-[#0055A4]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#002855] text-sm truncate">{school.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {school.city}, {school.stateCode}
                    </p>
                    {school.gradeStart && <p className="text-xs text-gray-400 mt-0.5">Grades {school.gradeStart}-{school.gradeEnd}</p>}
                  </div>
                  {school.isPremium && <span className="text-xs bg-[#6EBE44]/10 text-[#6EBE44] px-2 py-0.5 rounded font-medium">Premium</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative min-h-[400px] md:min-h-0">
          <MapView onMapReady={onMapReady} className="w-full h-full absolute inset-0" />

          {/* Selected School Info Card */}
          {selectedSchool && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-lg p-5 border border-gray-100 z-10">
              <button onClick={() => setSelectedSchool(null)} className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-lg">&times;</button>
              <h3 className="font-semibold text-[#002855] pr-6">{selectedSchool.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedSchool.city}, {selectedSchool.state}</p>
              {selectedSchool.phone && <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedSchool.phone}</p>}
              <div className="flex gap-2 mt-4">
                <Link href={`/schools/${selectedSchool.slug}`}>
                  <Button size="sm" className="bg-[#0055A4] text-white text-xs">View Profile</Button>
                </Link>
                {selectedSchool.website && (
                  <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs"><ExternalLink className="w-3 h-3 mr-1" /> Website</Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
