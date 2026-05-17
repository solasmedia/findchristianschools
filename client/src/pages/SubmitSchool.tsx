import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { Check, School, MapPin, Info, Users, BookOpen, Heart, ChevronRight, X, Star, Shield, Upload } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";

const steps = [
  { id: 1, title: "Basic Info", icon: School, desc: "School name & contact" },
  { id: 2, title: "Location", icon: MapPin, desc: "Address & area" },
  { id: 3, title: "Academics", icon: BookOpen, desc: "Grades & programs" },
  { id: 4, title: "Details", icon: Info, desc: "Size & amenities" },
  { id: 5, title: "Faith", icon: Heart, desc: "Statement of faith" },
  { id: 6, title: "Verify", icon: Shield, desc: "Trust & accuracy" },
];

const US_STATES = [
  { name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" }, { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" }, { name: "California", code: "CA" }, { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" }, { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" }, { name: "Hawaii", code: "HI" }, { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" }, { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" }, { name: "Kentucky", code: "KY" }, { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" }, { name: "Maryland", code: "MD" }, { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" }, { name: "Minnesota", code: "MN" }, { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" }, { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" }, { name: "New Hampshire", code: "NH" }, { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" }, { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" }, { name: "Ohio", code: "OH" }, { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" }, { name: "Pennsylvania", code: "PA" }, { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" }, { name: "South Dakota", code: "SD" }, { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" }, { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" }, { name: "Washington", code: "WA" }, { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" },
];

export default function SubmitSchool() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const [currentStep, setCurrentStep] = useState(1);
  const [listingType, setListingType] = useState<'free' | 'donate' | 'premium'>('free');
  const [donationAmount, setDonationAmount] = useState<5 | 10 | 15>(5);
  const [agreedToFaith, setAgreedToFaith] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToAccuracy, setAgreedToAccuracy] = useState(false);
  const [showFaithModal, setShowFaithModal] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const submitMutation = trpc.submission.submitSchool.useMutation();
  const uploadLogoMutation = trpc.images.uploadLogo.useMutation();
  const uploadGalleryMutation = trpc.images.uploadGallery.useMutation();

  // Prefill state from query param if provided
  const stateCode = params.get("state");
  const claimSlug = params.get("claim") || undefined;
  const prefillState = stateCode ? US_STATES.find(s => s.code === stateCode.toUpperCase())?.name || "" : "";

  const [form, setForm] = useState({
    name: "", address: "", city: "", state: prefillState, stateCode: stateCode?.toUpperCase() || "", zip: "",
    phone: "", website: "", email: "", description: "", missionStatement: "",
    gradeStart: "", gradeEnd: "", programType: "traditional" as any,
    tuitionType: "tuition_based" as any, tuitionMin: 0, tuitionMax: 0,
    enrollment: 0, studentTeacherRatio: "", yearFounded: 0,
    denomination: "", accreditation: "", statementOfFaith: "",
    hasTransportation: false, hasLunchProgram: false, hasAfterSchool: false,
    hasSpecialNeeds: false, hasSports: false, hasArts: false, hasSTEM: false,
    uniformRequired: false, acceptsVouchers: false,
    sportsOffered: "", extracurriculars: "",
    contactName: "", contactTitle: "", contactPhone: "", contactEmail: "",
    googleBusinessProfileUrl: "", einOrStateRegNumber: "",
  });

  const updateField = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!agreedToFaith) {
      toast.error("You must agree to the Statement of Faith to list your school");
      return;
    }
    if (!agreedToTerms) {
      toast.error("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    if (!agreedToAccuracy) {
      toast.error("You must certify that the information is accurate and you are authorized to submit");
      return;
    }
    try {
      const stateObj = US_STATES.find(s => s.name === form.state);
      
      // For free listings, submit directly
      if (listingType === 'free') {
        const result = await submitMutation.mutateAsync({
          ...form,
          stateCode: stateObj?.code || form.stateCode,
          tuitionMin: form.tuitionMin || undefined,
          tuitionMax: form.tuitionMax || undefined,
          enrollment: form.enrollment || undefined,
          yearFounded: form.yearFounded || undefined,
          claimSlug,
          googleBusinessProfileUrl: form.googleBusinessProfileUrl || undefined,
          einOrStateRegNumber: form.einOrStateRegNumber || undefined,
          certifiedAccurate: agreedToAccuracy,
          listingType: 'free',
        });
        // Note: Logo and gallery uploads will be handled after school creation
        // The school ID is not returned from the mutation, so uploads would need to be
        // done via a separate step after the school is created and user is redirected
        
        if (result.matched) {
          toast.success("School claimed successfully! Your updates are pending admin review.");
        } else {
          toast.success("School submitted successfully! It will be reviewed and published shortly.");
        }
        navigate(result.slug ? `/school/${result.slug}` : "/");
      } else {
        // For paid listings, redirect to Stripe checkout
        const amount = listingType === 'premium' ? 9900 : (donationAmount * 100); // Convert to cents
        
        // First submit the school data
        const result = await submitMutation.mutateAsync({
          ...form,
          stateCode: stateObj?.code || form.stateCode,
          tuitionMin: form.tuitionMin || undefined,
          tuitionMax: form.tuitionMax || undefined,
          enrollment: form.enrollment || undefined,
          yearFounded: form.yearFounded || undefined,
          claimSlug,
          googleBusinessProfileUrl: form.googleBusinessProfileUrl || undefined,
          einOrStateRegNumber: form.einOrStateRegNumber || undefined,
          certifiedAccurate: agreedToAccuracy,
          listingType,
          donationAmount: listingType === 'donate' ? donationAmount : undefined,
        });
        
        // Then redirect to Stripe checkout
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            listingType,
            donationAmount: listingType === 'donate' ? donationAmount : undefined,
            schoolName: form.name,
            contactEmail: form.contactEmail || form.email,
          }),
        });
        
        const { sessionId } = await response.json();
        if (sessionId && (window as any).Stripe) {
          const stripe = (window as any).Stripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);
          await stripe.redirectToCheckout({ sessionId });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit school");
    }
  };

  // Allow all visitors to submit — no auth required

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <div className="container py-8 lg:py-12 max-w-4xl">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#002855] mb-2">Submit Your School</h1>
        <p className="text-gray-600 mb-8">Complete the form below to list your school. All schools require a Statement of Faith.</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex flex-col items-center min-w-[80px] ${currentStep === step.id ? 'opacity-100' : currentStep > step.id ? 'opacity-100' : 'opacity-50'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-colors ${
                  currentStep > step.id ? 'bg-[#6EBE44] text-white' :
                  currentStep === step.id ? 'bg-[#0055A4] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className="text-xs font-medium text-[#002855]">{step.title}</span>
                <span className="text-[10px] text-gray-500 hidden sm:block">{step.desc}</span>
              </button>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-300 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[#002855] mb-4">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                <input type="text" value={form.name} onChange={e => updateField('name', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="e.g., Grace Christian Academy" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="info@school.org" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={form.website} onChange={e => updateField('website', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="https://www.yourschool.org" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
                  <input type="text" value={form.contactName} onChange={e => updateField('contactName', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Title</label>
                  <input type="text" value={form.contactTitle} onChange={e => updateField('contactTitle', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="Admissions Director" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Description</label>
                <textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none resize-none" placeholder="Tell parents about your school..." />
              </div>
              <div className="border-t pt-5 mt-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3">School Logo (Optional)</h3>
                <p className="text-xs text-gray-500 mb-3">Upload your school's logo. This will be displayed on your school profile.</p>
                <ImageUploader
                  onImagesSelected={(files) => setLogoFile(files[0] || null)}
                  maxFiles={1}
                  maxSizeMB={5}
                  label="Upload Logo"
                  description="Drag and drop or click to select"
                  multiple={false}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[#002855] mb-4">Location</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input type="text" value={form.address} onChange={e => updateField('address', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="123 Faith Avenue" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input type="text" value={form.city} onChange={e => updateField('city', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="Springfield" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select value={form.state} onChange={e => { updateField('state', e.target.value); const s = US_STATES.find(st => st.name === e.target.value); if (s) updateField('stateCode', s.code); }} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none bg-white">
                    <option value="">Select State</option>
                    {US_STATES.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input type="text" value={form.zip} onChange={e => updateField('zip', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="12345" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[#002855] mb-4">Academics & Programs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Start</label>
                  <select value={form.gradeStart} onChange={e => updateField('gradeStart', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none bg-white">
                    <option value="">Select</option>
                    {["PK", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(g => <option key={g} value={g}>{g === "PK" ? "Pre-K" : g === "K" ? "Kindergarten" : `Grade ${g}`}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade End</label>
                  <select value={form.gradeEnd} onChange={e => updateField('gradeEnd', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none bg-white">
                    <option value="">Select</option>
                    {["PK", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(g => <option key={g} value={g}>{g === "PK" ? "Pre-K" : g === "K" ? "Kindergarten" : `Grade ${g}`}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
                  <select value={form.programType} onChange={e => updateField('programType', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none bg-white">
                    <option value="traditional">Traditional (In-Person)</option>
                    <option value="online">Online</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="homeschool_coop">Homeschool Co-op</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Type</label>
                  <select value={form.tuitionType} onChange={e => updateField('tuitionType', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none bg-white">
                    <option value="free">Free / No Tuition</option>
                    <option value="tuition_assisted">Tuition-Assisted</option>
                    <option value="tuition_based">Tuition-Based</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Min ($/year)</label>
                  <input type="number" value={form.tuitionMin || ''} onChange={e => updateField('tuitionMin', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Max ($/year)</label>
                  <input type="number" value={form.tuitionMax || ''} onChange={e => updateField('tuitionMax', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="15000" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Denomination</label>
                  <input type="text" value={form.denomination} onChange={e => updateField('denomination', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="e.g., Non-Denominational, Baptist" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
                  <input type="text" value={form.accreditation} onChange={e => updateField('accreditation', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="e.g., ACSI, AdvancED" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[#002855] mb-4">School Details & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Enrollment</label>
                  <input type="number" value={form.enrollment || ''} onChange={e => updateField('enrollment', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="250" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student:Teacher Ratio</label>
                  <input type="text" value={form.studentTeacherRatio} onChange={e => updateField('studentTeacherRatio', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="12:1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Founded</label>
                  <input type="number" value={form.yearFounded || ''} onChange={e => updateField('yearFounded', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="1995" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Amenities & Programs</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'hasTransportation', label: 'Transportation' },
                    { key: 'hasLunchProgram', label: 'Lunch Program' },
                    { key: 'hasAfterSchool', label: 'After School Care' },
                    { key: 'hasSpecialNeeds', label: 'Special Needs Support' },
                    { key: 'hasSports', label: 'Sports Programs' },
                    { key: 'hasArts', label: 'Arts Programs' },
                    { key: 'hasSTEM', label: 'STEM Programs' },
                    { key: 'uniformRequired', label: 'Uniform Required' },
                    { key: 'acceptsVouchers', label: 'Accepts Vouchers' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={(form as any)[item.key]} onChange={e => updateField(item.key, e.target.checked)} className="w-4 h-4 text-[#6EBE44] rounded border-gray-300 focus:ring-[#6EBE44]" />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sports Offered</label>
                <input type="text" value={form.sportsOffered} onChange={e => updateField('sportsOffered', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="Basketball, Soccer, Track, Volleyball..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extracurriculars</label>
                <input type="text" value={form.extracurriculars} onChange={e => updateField('extracurriculars', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="Drama, Choir, Robotics, Student Government..." />
              </div>
              <div className="border-t pt-5 mt-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3">School Photos & Gallery (Optional)</h3>
                <p className="text-xs text-gray-500 mb-3">Upload photos of your school, classrooms, and facilities. Premium members can upload up to 20 images.</p>
                <ImageUploader
                  onImagesSelected={(files) => setGalleryFiles(files)}
                  maxFiles={20}
                  maxSizeMB={10}
                  label="Upload Photos"
                  description="Drag and drop or click to select multiple photos"
                  multiple={true}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              {/* Statement of Faith Section */}
              <div>
                <h2 className="text-lg font-semibold text-[#002855] mb-4">Statement of Faith</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-amber-800">
                    <strong>Required:</strong> All schools listed on FindChristianSchools.org must affirm our Statement of Faith. 
                    This ensures families can trust that every school in our directory is committed to Christ-centered education.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                  <input
                    type="checkbox"
                    id="agree-faith"
                    checked={agreedToFaith}
                    onChange={e => setAgreedToFaith(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4] cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="agree-faith" className="text-sm font-medium text-[#002855] cursor-pointer">
                      I agree with the FindChristianSchools.org Statement of Faith *
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Your school must uphold these core Christian beliefs to be listed in our directory.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFaithModal(true)}
                    className="shrink-0 px-3 py-1.5 text-sm font-medium text-[#0055A4] border border-[#0055A4] rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Read Statement of Faith
                  </button>
                </div>
              </div>

              {/* Mission Statement (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement (optional)</label>
                <textarea value={form.missionStatement} onChange={e => updateField('missionStatement', e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none resize-none" placeholder="Our mission is to..." />
              </div>

              {/* Listing Type Section */}
              <div className="pt-4 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-[#002855] mb-2">Listing Type</h2>
                <p className="text-sm text-gray-600 mb-4">Choose how you'd like to list your school:</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setListingType('free')}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                      listingType === 'free'
                        ? 'border-[#6EBE44] bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-[#002855]">Free Listing</div>
                    <div className="text-sm text-gray-600">Basic directory listing, reviewed within 24-48 hours</div>
                  </button>

                  <button
                    onClick={() => setListingType('donate')}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                      listingType === 'donate'
                        ? 'border-[#0055A4] bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-[#002855]">Free Listing + Donation to Mission</div>
                    <div className="text-sm text-gray-600">Support Christian education missions globally</div>
                    
                    {listingType === 'donate' && (
                      <div className="mt-3 flex gap-2">
                        {[5, 10, 15].map(amount => (
                          <button
                            key={amount}
                            onClick={(e) => { e.stopPropagation(); setDonationAmount(amount as 5 | 10 | 15); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              donationAmount === amount
                                ? 'bg-[#0055A4] text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0055A4]'
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setListingType('premium')}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left relative overflow-hidden ${
                      listingType === 'premium'
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">RECOMMENDED</div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      <div className="font-semibold text-[#002855]">Premium Listing — $99/year</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Priority placement, photos, map pin, enhanced profile, and analytics</div>
                    {listingType === 'premium' && (
                      <div className="mt-3 bg-white border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-gray-700 font-medium mb-2">Premium includes:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Priority placement in search results</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Upload photos & virtual tour links</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Interactive map pin for your school</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Enhanced profile with full details</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Monthly analytics & inquiry tracking</li>
                          <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Supports our mission to serve families</li>
                        </ul>
                      </div>
                    )}
                  </button>
                </div>

                {listingType === 'donate' && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      Your ${donationAmount} donation will support our mission to connect families with quality Christian education worldwide.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statement of Faith Modal */}
          {showFaithModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowFaithModal(false)}>
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#0055A4]" />
                    <h3 className="text-lg font-bold text-[#002855]">Statement of Faith</h3>
                  </div>
                  <button onClick={() => setShowFaithModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <div className="px-6 py-5 space-y-4 text-sm text-gray-700 leading-relaxed">
                  <p className="text-gray-500 italic">FindChristianSchools.org affirms the following core Christian beliefs. All listed schools must be in agreement with these tenets.</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#002855]">1. The Holy Scriptures</h4>
                      <p>We believe the Bible is the inspired, infallible, and authoritative Word of God, without error in all that it affirms, and the final authority for faith and life (2 Timothy 3:16-17; 2 Peter 1:20-21).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#002855]">2. The Trinity</h4>
                      <p>We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit — co-equal in power, glory, and nature (Matthew 28:19; 2 Corinthians 13:14).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#002855]">3. Jesus Christ</h4>
                      <p>We believe in the deity of Jesus Christ, His virgin birth, His sinless life, His miracles, His atoning death on the cross, His bodily resurrection, His ascension to the right hand of the Father, and His personal return in power and glory (John 1:1-14; 1 Corinthians 15:3-4).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#002855]">4. Salvation</h4>
                      <p>We believe salvation is a gift of God received through faith in Jesus Christ alone, not by works, and that all who repent and believe are justified, regenerated, and sealed by the Holy Spirit (Ephesians 2:8-9; John 3:16; Romans 10:9-10).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#002855]">5. The Holy Spirit</h4>
                      <p>We believe the Holy Spirit indwells every believer, empowering them to live a godly life, and that He convicts the world of sin, righteousness, and judgment (John 14:16-17; Romans 8:9-11).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#002855]">6. Marriage & Sexuality</h4>
                      <p>We believe God created marriage as a sacred covenant between one biological man and one biological woman (Genesis 2:24; Matthew 19:4-6). We believe sexual intimacy is designed by God to be expressed solely within this marital relationship. We believe God created mankind as male and female, and that each person's biological sex is an intentional gift reflecting God's design (Genesis 1:27).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#002855]">7. Sanctity of Life</h4>
                      <p>We believe all human life is sacred and created in the image of God from conception to natural death (Psalm 139:13-16; Jeremiah 1:5).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#002855]">8. The Church</h4>
                      <p>We believe in the universal Church as the body of Christ, composed of all believers, and in the importance of the local church for worship, fellowship, discipleship, and mission (Hebrews 10:24-25; Acts 2:42-47).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#002855]">9. The Great Commission</h4>
                      <p>We believe it is the responsibility of every Christian to share the Gospel and make disciples of all nations, and that Christian education is a vital expression of this calling (Matthew 28:18-20).</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium">Compliance & Withdrawal Notice</p>
                    <p className="text-sm text-red-700 mt-1">
                      Any school that is found to violate or no longer uphold this Statement of Faith may be withdrawn from the FindChristianSchools.org directory at any time, without prior notice. By listing your school, you acknowledge and accept this policy.
                    </p>
                  </div>
                </div>
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowFaithModal(false)}>Close</Button>
                  <Button
                    className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0"
                    onClick={() => { setAgreedToFaith(true); setShowFaithModal(false); }}
                  >
                    I Agree
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Verification */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[#002855] mb-1">Verification & Trust</h2>
                <p className="text-sm text-gray-500 mb-5">Help us verify your school faster. These fields are optional but speed up approval and earn a Verified badge.</p>
              </div>

              {/* Google Business Profile */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#0055A4] flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#002855] text-sm">Google Business Profile URL</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Paste the link to your school's Google Business listing. This is the fastest way to verify your school's existence and location.</p>
                  </div>
                </div>
                <input
                  type="url"
                  value={form.googleBusinessProfileUrl}
                  onChange={e => updateField('googleBusinessProfileUrl', e.target.value)}
                  className="w-full border border-blue-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none bg-white"
                  placeholder="https://maps.google.com/maps?cid=..."
                />
                <p className="text-xs text-gray-400 mt-2">Find it by searching your school on Google Maps → Share → Copy link</p>
              </div>

              {/* EIN / State Reg */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#002855] text-sm">EIN or State Registration Number <span className="text-gray-400 font-normal">(optional)</span></h3>
                    <p className="text-xs text-gray-500 mt-0.5">Your school's federal Employer Identification Number or state nonprofit registration number. Never shared publicly — used for internal verification only.</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={form.einOrStateRegNumber}
                  onChange={e => updateField('einOrStateRegNumber', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none bg-white"
                  placeholder="e.g., 12-3456789 or ST-2024-001234"
                />
              </div>

              {/* What happens next */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#002855] mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6EBE44]" /> What happens after you submit?
                </h3>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Our team reviews your submission (usually within 24–48 hours)</li>
                  <li>Schools with a Google Business Profile or EIN are typically verified faster</li>
                  <li>Once approved, your listing goes live — community-submitted listings show a badge</li>
                  <li>Verified schools receive a blue checkmark badge visible to all families</li>
                </ol>
              </div>

              {/* Acknowledgment Checkboxes */}
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-4">
                <h3 className="font-semibold text-[#002855] mb-2">Before you submit:</h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreedToFaith} onChange={e => setAgreedToFaith(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300" required />
                  <span className="text-sm text-gray-700">
                    I confirm that my school agrees with the <a href="#" onClick={e => { e.preventDefault(); setShowFaithModal(true); }} className="text-[#0055A4] hover:underline font-medium">Statement of Faith</a> and affirms the Christian values outlined. I understand that listings violating the Statement of Faith may be withdrawn without prior notice.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300" required />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline font-medium">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline font-medium">Privacy Policy</a>.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreedToAccuracy} onChange={e => setAgreedToAccuracy(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300" required />
                  <span className="text-sm text-gray-700">
                    I certify that all information provided is accurate, current, and that I am authorized to submit this listing on behalf of the school.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Acknowledgment Checkboxes (Step 5 only — kept for backward compat) */}
          {currentStep === 5 && (
            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg space-y-4">
              <h3 className="font-semibold text-[#002855] mb-4">Before you submit:</h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToFaith}
                  onChange={e => setAgreedToFaith(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300"
                  required
                />
                <span className="text-sm text-gray-700">
                  I confirm that my school agrees with the <a href="#" onClick={e => { e.preventDefault(); setShowFaithModal(true); }} className="text-[#0055A4] hover:underline font-medium">Statement of Faith</a> and affirms the Christian values outlined above.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline font-medium">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline font-medium">Privacy Policy</a>.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToAccuracy}
                  onChange={e => setAgreedToAccuracy(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300"
                  required
                />
                <span className="text-sm text-gray-700">
                  I warrant that all information provided is accurate and that my school is authorized to submit this listing.
                </span>
              </label>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="text-[#002855]"
            >
              Previous
            </Button>
            {currentStep < 6 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit School"}
              </Button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#002855] mb-2">What happens next?</h3>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Your school is reviewed by our team (usually within 24-48 hours)</li>
            <li>Once approved, your free listing goes live with basic information</li>
            <li>Upgrade to Premium ($99/year) for full photos, map, priority placement, and more</li>
          </ol>
        </div>
      </div>

      <Footer />
    </div>
  );
}
