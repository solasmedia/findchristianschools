import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { Check, School, MapPin, Info, Users, BookOpen, Heart, ChevronRight, ChevronLeft, X, Star, Shield } from "lucide-react";

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

export default function Submit() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  
  const [applicationType, setApplicationType] = useState<"school" | "course" | "class" | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [listingType, setListingType] = useState<'free' | 'donate' | 'premium'>('free');
  const [donationAmount, setDonationAmount] = useState<5 | 10 | 15>(5);
  const [agreedToFaith, setAgreedToFaith] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToAccuracy, setAgreedToAccuracy] = useState(false);
  const [showFaithModal, setShowFaithModal] = useState(false);
  
  const submitSchool = trpc.submission.submitSchool.useMutation();
  const submitCourse = trpc.courses.submitListing.useMutation();

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
    subject: "", gradeLevel: "", ageRange: "", deliveryType: "in_person", type: "course",
  });

  const updateField = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const getSteps = () => {
    if (applicationType === "school") {
      return [
        { id: 1, title: "Basic Info", icon: School, desc: "School name & contact" },
        { id: 2, title: "Location", icon: MapPin, desc: "Address & area" },
        { id: 3, title: "Academics", icon: BookOpen, desc: "Grades & programs" },
        { id: 4, title: "Details", icon: Info, desc: "Size & amenities" },
        { id: 5, title: "Faith", icon: Heart, desc: "Statement of faith" },
        { id: 6, title: "Verify", icon: Shield, desc: "Trust & accuracy" },
      ];
    }
    return [
      { id: 1, title: "Basic Info", icon: BookOpen, desc: "Name & details" },
      { id: 2, title: "Details", icon: Users, desc: "Contact info" },
      { id: 3, title: "Verify", icon: Shield, desc: "Trust & accuracy" },
    ];
  };

  const steps = getSteps();
  const maxSteps = steps.length;

  const handleSubmit = async () => {
    if (!agreedToFaith) {
      toast.error("You must agree to the Statement of Faith");
      return;
    }
    if (!agreedToTerms) {
      toast.error("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    if (!agreedToAccuracy) {
      toast.error("You must certify that the information is accurate");
      return;
    }

    try {
      if (applicationType === "school") {
        const stateObj = US_STATES.find(s => s.name === form.state);
        const result = await submitSchool.mutateAsync({
          name: form.name,
          address: form.address,
          city: form.city,
          state: form.state,
          stateCode: stateObj?.code || form.stateCode,
          zip: form.zip,
          phone: form.phone,
          email: form.email,
          website: form.website,
          description: form.description,
          missionStatement: form.missionStatement,
          gradeStart: form.gradeStart,
          gradeEnd: form.gradeEnd,
          programType: form.programType as any,
          tuitionType: form.tuitionType as any,
          tuitionMin: form.tuitionMin || undefined,
          tuitionMax: form.tuitionMax || undefined,
          enrollment: form.enrollment || undefined,
          studentTeacherRatio: form.studentTeacherRatio,
          yearFounded: form.yearFounded || undefined,
          denomination: form.denomination,
          accreditation: form.accreditation,
          hasTransportation: form.hasTransportation,
          hasLunchProgram: form.hasLunchProgram,
          hasAfterSchool: form.hasAfterSchool,
          hasSpecialNeeds: form.hasSpecialNeeds,
          hasSports: form.hasSports,
          hasArts: form.hasArts,
          hasSTEM: form.hasSTEM,
          uniformRequired: form.uniformRequired,
          acceptsVouchers: form.acceptsVouchers,
          sportsOffered: form.sportsOffered,
          extracurriculars: form.extracurriculars,
          contactName: form.contactName,
          contactTitle: form.contactTitle,
          contactPhone: form.contactPhone,
          contactEmail: form.contactEmail,
          statementOfFaith: form.statementOfFaith,
          googleBusinessProfileUrl: form.googleBusinessProfileUrl || undefined,
          einOrStateRegNumber: form.einOrStateRegNumber || undefined,
          claimSlug,
        });
        if (result.matched) {
          toast.success("School claimed successfully! Your updates are pending admin review.");
        } else {
          toast.success("School submitted successfully! It will be reviewed and published shortly.");
        }
        navigate(result.slug ? `/school/${result.slug}` : "/");
      } else if (applicationType === "course" || applicationType === "class") {
        await submitCourse.mutateAsync({
          name: form.name,
          description: form.description,
          type: applicationType === "class" ? "class" : "course",
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          subject: form.subject,
          gradeLevel: form.gradeLevel,
          deliveryType: form.deliveryType as any,
          website: form.website,
        });
        toast.success("Thank you! Your submission has been received.");
        setApplicationType(null);
        setCurrentStep(1);
      }
    } catch (error: any) {
      toast.error(error.message || "Submission failed. Please try again.");
    }
  };

  if (!applicationType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navigation />
        <div className="container py-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Submit Your Organization</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
              Choose what you'd like to list on Find Christian Schools
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setApplicationType("school")}>
                <School className="w-12 h-12 text-[#0055A4] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">List Your School</h3>
                <p className="text-gray-600 text-sm">Submit your Christian school to our directory</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setApplicationType("course")}>
                <BookOpen className="w-12 h-12 text-[#6EBE44] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">List Your Course</h3>
                <p className="text-gray-600 text-sm">Share your online or in-person course</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setApplicationType("class")}>
                <Users className="w-12 h-12 text-[#FF6B35] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">List Your Class</h3>
                <p className="text-gray-600 text-sm">Submit a single class or learning experience</p>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <div className="container py-8 lg:py-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setApplicationType(null)} className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#002855]">
            {applicationType === "school" ? "Submit Your School" : applicationType === "course" ? "List Your Course" : "List Your Class"}
          </h1>
        </div>

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
          {applicationType === "school" && (
            <>
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
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#002855] mb-4">Statement of Faith</h2>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-amber-800">
                        <strong>Required:</strong> All schools listed on FindChristianSchools.org must affirm our Statement of Faith.
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
                        <button
                          type="button"
                          onClick={() => setShowFaithModal(true)}
                          className="shrink-0 px-3 py-1.5 text-sm font-medium text-[#0055A4] border border-[#0055A4] rounded-lg hover:bg-blue-50 transition-colors mt-2"
                        >
                          Read Statement of Faith
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement (optional)</label>
                    <textarea value={form.missionStatement} onChange={e => updateField('missionStatement', e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none resize-none" placeholder="Our mission is to..." />
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4">Verify & Listing Type</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Business Profile URL (optional)</label>
                    <input type="url" value={form.googleBusinessProfileUrl} onChange={e => updateField('googleBusinessProfileUrl', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="https://www.google.com/maps/place/..." />
                    <p className="text-xs text-gray-500 mt-1">Helps verify your school's authenticity</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EIN or State Registration Number (optional)</label>
                    <input type="text" value={form.einOrStateRegNumber} onChange={e => updateField('einOrStateRegNumber', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="e.g., 12-3456789" />
                    <p className="text-xs text-gray-500 mt-1">Employer Identification Number or state registration</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-[#002855] mb-2">Listing Type</h3>
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
                        <div className="text-sm text-gray-600 mt-1">Priority placement, photos, map pin, and enhanced profile</div>
                        {listingType === 'premium' && (
                          <div className="mt-3 bg-white border border-amber-200 rounded-lg p-3">
                            <p className="text-xs text-gray-700 font-medium mb-2">Premium includes:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Priority placement in search results</li>
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Upload photos & virtual tour links</li>
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Interactive map pin for your school</li>
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#6EBE44]" /> Enhanced profile with full details</li>
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

                    {listingType === 'premium' && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (Premium Feature)</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                          placeholder="Select photos to upload"
                        />
                        <p className="text-xs text-gray-600 mt-2">Upload up to 10 photos. Recommended: 1200x800px or larger.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                        <input
                          type="checkbox"
                          id="agree-terms"
                          checked={agreedToTerms}
                          onChange={e => setAgreedToTerms(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4] cursor-pointer"
                        />
                        <label htmlFor="agree-terms" className="text-sm text-gray-700 cursor-pointer">
                          I agree to the Terms of Service and Privacy Policy *
                        </label>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                        <input
                          type="checkbox"
                          id="agree-accuracy"
                          checked={agreedToAccuracy}
                          onChange={e => setAgreedToAccuracy(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4] cursor-pointer"
                        />
                        <label htmlFor="agree-accuracy" className="text-sm text-gray-700 cursor-pointer">
                          I certify that the information provided is accurate and I am authorized to submit this listing *
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {(applicationType === "course" || applicationType === "class") && (
            <>
              {currentStep === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4">Basic Information</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{applicationType === "course" ? "Course" : "Class"} Name *</label>
                    <input type="text" value={form.name} onChange={e => updateField('name', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder={applicationType === "course" ? "e.g., Biblical Leadership" : "e.g., Grade 3 Science"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none resize-none" placeholder="Describe your course or class..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input type="text" value={form.subject} onChange={e => updateField('subject', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="e.g., Bible, Math, Science" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                      <input type="text" value={form.gradeLevel} onChange={e => updateField('gradeLevel', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="e.g., 3-5, 6-8, 9-12" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
                      <select value={form.deliveryType} onChange={e => updateField('deliveryType', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none bg-white">
                        <option value="in_person">In-Person</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
                      <input type="url" value={form.website} onChange={e => updateField('website', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="https://..." />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                      <input type="text" value={form.contactName} onChange={e => updateField('contactName', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="John Smith" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                      <input type="email" value={form.contactEmail} onChange={e => updateField('contactEmail', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none" placeholder="john@example.com" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-[#002855] mb-4">Verify & Support Mission</h2>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-[#002855] mb-2">Support Our Mission</h3>
                    <p className="text-sm text-gray-600 mb-4">Help us connect families with quality Christian education:</p>
                    
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
                        <div className="text-sm text-gray-600">List your {applicationType} at no cost</div>
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
                    </div>

                    {listingType === 'donate' && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          Your ${donationAmount} donation will support our mission to connect families with quality Christian education worldwide.
                        </p>
                      </div>
                    )}

                    {listingType === 'premium' && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (Premium Feature)</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                          placeholder="Select photos to upload"
                        />
                        <p className="text-xs text-gray-600 mt-2">Upload up to 10 photos. Recommended: 1200x800px or larger.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                        <input
                          type="checkbox"
                          id="agree-faith-course"
                          checked={agreedToFaith}
                          onChange={e => setAgreedToFaith(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4] cursor-pointer"
                        />
                        <label htmlFor="agree-faith-course" className="text-sm text-gray-700 cursor-pointer">
                          This listing aligns with Christian values and education standards *
                        </label>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                        <input
                          type="checkbox"
                          id="agree-terms-course"
                          checked={agreedToTerms}
                          onChange={e => setAgreedToTerms(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4] cursor-pointer"
                        />
                        <label htmlFor="agree-terms-course" className="text-sm text-gray-700 cursor-pointer">
                          I agree to the Terms of Service and Privacy Policy *
                        </label>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                        <input
                          type="checkbox"
                          id="agree-accuracy-course"
                          checked={agreedToAccuracy}
                          onChange={e => setAgreedToAccuracy(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4] cursor-pointer"
                        />
                        <label htmlFor="agree-accuracy-course" className="text-sm text-gray-700 cursor-pointer">
                          I certify that the information provided is accurate and I am authorized to submit this listing *
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setApplicationType(null)}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? "Back" : "Previous"}
            </Button>

            {currentStep < maxSteps ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="gap-2 bg-[#0055A4] hover:bg-[#003d7a] text-white"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitSchool.isPending || submitCourse.isPending}
                className="gap-2 bg-[#6EBE44] hover:bg-[#5aa835] text-white"
              >
                {submitSchool.isPending || submitCourse.isPending ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
