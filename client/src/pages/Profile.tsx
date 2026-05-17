import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Bookmark, Mail, Trash2, Search, CheckCircle, Heart, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts",
  "Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

export default function Profile() {
  const { user, loading } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => { setProfileSaved(true); toast.success("Profile updated!"); setTimeout(() => setProfileSaved(false), 3000); },
    onError: () => toast.error("Failed to update profile"),
  });

  const { data: savedSearches, refetch: refetchSearches } = trpc.savedSearches.list.useQuery(undefined, { enabled: !!user });
  const deleteSearch = trpc.savedSearches.delete.useMutation({ onSuccess: () => { toast.success("Search removed"); refetchSearches(); } });

  const { data: savedSchools, refetch: refetchSaved } = trpc.savedSchools.list.useQuery(undefined, { enabled: !!user });
  const unsaveSchool = trpc.savedSchools.unsave.useMutation({ onSuccess: () => { toast.success("School removed from favorites"); refetchSaved(); } });

  if (loading) return null;
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <User className="w-16 h-16 text-[#0055A4] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#002855] mb-3">Join the Mission</h2>
            <p className="text-gray-600 mb-6">Sign up free to save schools, manage your profile, and more.</p>
            <Link href="/signup">
              <Button className="bg-[#6EBE44] hover:bg-[#5da838] text-white">Join Free</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-[#002855] mb-2">My Profile</h1>
        <p className="text-gray-600 mb-8">Manage your account settings and saved searches.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#002855] mb-6 flex items-center gap-2"><User className="w-5 h-5" /> Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <Input value={user.email || ''} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">State</label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger><SelectValue placeholder="Select your state" /></SelectTrigger>
                  <SelectContent>{US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} className="rounded border-gray-300" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Subscribe to Newsletter</span>
                  <p className="text-xs text-gray-500">Receive updates about Christian education, events, and resources.</p>
                </div>
              </label>
              <Button
                onClick={() => updateProfile.mutate({ firstName, lastName, state, newsletterOptIn: newsletter })}
                className="w-full bg-[#6EBE44] hover:bg-[#5da838] text-white"
                disabled={updateProfile.isPending}
              >
                {profileSaved ? <><CheckCircle className="w-4 h-4 mr-2" /> Saved!</> : updateProfile.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>

          {/* Saved Searches */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#002855] mb-6 flex items-center gap-2"><Bookmark className="w-5 h-5" /> Saved Searches</h3>
            {savedSearches && savedSearches.length > 0 ? (
              <div className="space-y-3">
                {savedSearches.map((search: any) => (
                  <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-[#0055A4]" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{search.name}</p>
                        <p className="text-xs text-gray-500">
                          {[search.query, search.state, search.programType].filter(Boolean).join(' · ') || 'All schools'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/search?q=${search.query || ''}&state=${search.state || ''}`}>
                        <Button size="sm" variant="ghost" className="text-[#0055A4]"><Search className="w-3 h-3" /></Button>
                      </Link>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => deleteSearch.mutate({ id: search.id })}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">No saved searches yet.</p>
                <Link href="/search">
                  <Button variant="outline" size="sm" className="text-[#0055A4] border-[#0055A4]">Start Searching</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Saved Schools */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#002855] mb-6 flex items-center gap-2"><Heart className="w-5 h-5 text-red-400" /> Saved Schools</h3>
          {savedSchools && savedSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedSchools.map((saved: any) => (
                <div key={saved.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Link href={saved.schoolType === 'domestic' ? `/school/${saved.schoolSlug || saved.schoolId}` : `/international/${saved.schoolSlug || saved.schoolId}`} className="flex items-center gap-3 min-w-0 flex-1">
                    <GraduationCap className="w-4 h-4 text-[#0055A4] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{saved.schoolName}</p>
                      <p className="text-xs text-gray-500">{saved.schoolCity}{saved.schoolState ? `, ${saved.schoolState}` : ''}</p>
                    </div>
                  </Link>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600 shrink-0" onClick={() => unsaveSchool.mutate({ schoolId: saved.schoolId, schoolType: saved.schoolType })}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">No saved schools yet. Tap the heart icon on any school to save it.</p>
              <Link href="/search">
                <Button variant="outline" size="sm" className="text-[#0055A4] border-[#0055A4]">Find Schools</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 bg-gradient-to-r from-[#002855] to-[#0055A4] rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Stay Connected</h3>
          </div>
          <p className="text-blue-100 text-sm">
            As a member, you'll receive updates about new schools in your area, upcoming events, job opportunities, and ways to support Christian education missions worldwide.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
