import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Users, School, Mail, Handshake, Globe, Clock, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, ShieldCheck, Trash2, Upload, Pencil, Eye, AlertTriangle, Tag, Plus, Save, Calendar, Briefcase, FileDown, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// Manager sections extracted from Admin.tsx (courses, events, jobs,
// submissions, messages, insights, blog) so each file stays within
// single-file push limits. Behavior is unchanged.

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-6 animate-pulse"><div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>)}
    </div>
  );
}

export function CoursesManager() {
  const [activeTab, setActiveTab] = useState<'categories' | 'courses' | 'school'>('categories');

  // --- Categories state ---
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', icon: '', sortOrder: 0 });

  // --- Standalone courses state ---
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [courseForm, setCourseForm] = useState({ categoryId: 0, name: '', description: '', type: 'class' as 'class' | 'course' | 'workshop' | 'program', ageRange: '', gradeLevel: '', deliveryType: 'in_person' as 'in_person' | 'online' | 'hybrid', isFeatured: false });

  // --- School-linked courses/classes state ---
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [showAddSchoolCourse, setShowAddSchoolCourse] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [schoolCourseForm, setSchoolCourseForm] = useState({ name: '', description: '', subject: '', gradeLevel: '', deliveryType: 'in_person' as 'in_person' | 'online' | 'hybrid', instructor: '', schedule: '', credits: 0, tuition: 0, maxStudents: 0 });
  const [classForm, setClassForm] = useState({ name: '', description: '', gradeLevel: '', deliveryType: 'in_person' as 'in_person' | 'online' | 'hybrid', teacherName: '', schedule: '', tuition: 0, maxStudents: 0 });

  // Queries
  const { data: categories, refetch: refetchCategories } = trpc.courses.getCategories.useQuery();
  const { data: standaloneCoursesData, refetch: refetchStandalone } = trpc.courses.getByCategory.useQuery({ categorySlug: undefined });
  const { data: allSchools } = trpc.admin.allSchools.useQuery();
  const { data: schoolCourses, refetch: refetchSchoolCourses } = trpc.courses.getSchoolCourses.useQuery({ schoolId: schoolId || 0 }, { enabled: !!schoolId });
  const { data: schoolClasses, refetch: refetchSchoolClasses } = trpc.courses.getSchoolClasses.useQuery({ schoolId: schoolId || 0 }, { enabled: !!schoolId });

  // Category mutations
  const createCategory = trpc.courses.createCategory.useMutation({ onSuccess: () => { toast.success('Category created'); refetchCategories(); setShowAddCategory(false); setCatForm({ name: '', slug: '', description: '', icon: '', sortOrder: 0 }); } });
  const updateCategory = trpc.courses.updateCategory.useMutation({ onSuccess: () => { toast.success('Category updated'); refetchCategories(); setEditingCategory(null); } });
  const deleteCategory = trpc.courses.deleteCategory.useMutation({ onSuccess: () => { toast.success('Category deleted'); refetchCategories(); } });

  // Standalone course mutations
  const createStandalone = trpc.courses.createStandaloneCourse.useMutation({ onSuccess: () => { toast.success('Course/class added'); refetchStandalone(); setShowAddCourse(false); setCourseForm({ categoryId: 0, name: '', description: '', type: 'class', ageRange: '', gradeLevel: '', deliveryType: 'in_person', isFeatured: false }); } });
  const updateStandalone = trpc.courses.updateStandaloneCourse.useMutation({ onSuccess: () => { toast.success('Course updated'); refetchStandalone(); setEditingCourse(null); } });
  const deleteStandalone = trpc.courses.deleteStandaloneCourse.useMutation({ onSuccess: () => { toast.success('Course deleted'); refetchStandalone(); } });

  // School-linked mutations
  const createSchoolCourse = trpc.admin.createCourse.useMutation({ onSuccess: () => { toast.success('Course added'); refetchSchoolCourses(); setShowAddSchoolCourse(false); setSchoolCourseForm({ name: '', description: '', subject: '', gradeLevel: '', deliveryType: 'in_person', instructor: '', schedule: '', credits: 0, tuition: 0, maxStudents: 0 }); } });
  const deleteSchoolCourse = trpc.admin.deleteCourse.useMutation({ onSuccess: () => { toast.success('Course deleted'); refetchSchoolCourses(); } });
  const createClass = trpc.admin.createClass.useMutation({ onSuccess: () => { toast.success('Class added'); refetchSchoolClasses(); setShowAddClass(false); setClassForm({ name: '', description: '', gradeLevel: '', deliveryType: 'in_person', teacherName: '', schedule: '', tuition: 0, maxStudents: 0 }); } });
  const deleteClass = trpc.admin.deleteClass.useMutation({ onSuccess: () => { toast.success('Class deleted'); refetchSchoolClasses(); } });

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#002855]">Courses & Classes Management</h2>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {(['categories', 'courses', 'school'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[#0055A4] text-[#0055A4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'categories' ? 'Categories' : tab === 'courses' ? 'Courses & Classes' : 'School-Linked'}
          </button>
        ))}
      </div>

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{categories?.length || 0} categories</p>
            <Button size="sm" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0" onClick={() => { setShowAddCategory(!showAddCategory); setEditingCategory(null); }}>
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </Button>
          </div>

          {showAddCategory && !editingCategory && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <h4 className="font-medium text-sm text-[#002855]">New Category</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Name *" value={catForm.name} onChange={e => setCatForm(p => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Slug (auto-filled)" value={catForm.slug} onChange={e => setCatForm(p => ({ ...p, slug: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Icon (Lucide name, e.g. Palette)" value={catForm.icon} onChange={e => setCatForm(p => ({ ...p, icon: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Sort Order" type="number" value={catForm.sortOrder} onChange={e => setCatForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <input placeholder="Description" value={catForm.description} onChange={e => setCatForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0" onClick={() => { if (!catForm.name || !catForm.slug) { toast.error('Name and slug required'); return; } createCategory.mutate(catForm); }} disabled={createCategory.isPending}>
                  <Save className="w-3 h-3 mr-1" /> Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {editingCategory && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
              <h4 className="font-medium text-sm text-[#002855]">Edit: {editingCategory.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Name" value={catForm.name} onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Icon (Lucide name)" value={catForm.icon} onChange={e => setCatForm(p => ({ ...p, icon: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Sort Order" type="number" value={catForm.sortOrder} onChange={e => setCatForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <input placeholder="Description" value={catForm.description} onChange={e => setCatForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0" onClick={() => updateCategory.mutate({ id: editingCategory.id, name: catForm.name, description: catForm.description, icon: catForm.icon, sortOrder: catForm.sortOrder })} disabled={updateCategory.isPending}>
                  <Save className="w-3 h-3 mr-1" /> Update
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {categories?.map((cat: any) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0055A4]/10 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-[#0055A4]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#002855]">{cat.name}</p>
                    <p className="text-xs text-gray-500">{cat.slug}{cat.icon ? ` · icon: ${cat.icon}` : ''} · order: {cat.sortOrder}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-[#0055A4] border-[#0055A4]/30 hover:bg-[#0055A4]/5" onClick={() => { setEditingCategory(cat); setCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || '', sortOrder: cat.sortOrder }); setShowAddCategory(false); }}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => { if (window.confirm(`Delete "${cat.name}"?`)) deleteCategory.mutate({ id: cat.id }); }}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STANDALONE COURSES & CLASSES TAB */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{standaloneCoursesData?.length || 0} courses/classes</p>
            <Button size="sm" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0" onClick={() => { setShowAddCourse(!showAddCourse); setEditingCourse(null); }}>
              <Plus className="w-4 h-4 mr-1" /> Add Course/Class
            </Button>
          </div>

          {showAddCourse && !editingCourse && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <h4 className="font-medium text-sm text-[#002855]">New Course / Class</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={courseForm.categoryId} onChange={e => setCourseForm(p => ({ ...p, categoryId: parseInt(e.target.value) }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value={0}>-- Select Category *</option>
                  {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input placeholder="Name *" value={courseForm.name} onChange={e => setCourseForm(p => ({ ...p, name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <select value={courseForm.type} onChange={e => setCourseForm(p => ({ ...p, type: e.target.value as any }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="class">Class</option>
                  <option value="course">Course</option>
                  <option value="workshop">Workshop</option>
                  <option value="program">Program</option>
                </select>
                <select value={courseForm.deliveryType} onChange={e => setCourseForm(p => ({ ...p, deliveryType: e.target.value as any }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="in_person">In Person</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <input placeholder="Age Range (e.g. 8-18)" value={courseForm.ageRange} onChange={e => setCourseForm(p => ({ ...p, ageRange: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Grade Level (e.g. K-12)" value={courseForm.gradeLevel} onChange={e => setCourseForm(p => ({ ...p, gradeLevel: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <textarea placeholder="Description" value={courseForm.description} onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={courseForm.isFeatured} onChange={e => setCourseForm(p => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4" />
                Featured
              </label>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0" onClick={() => { if (!courseForm.name || !courseForm.categoryId) { toast.error('Name and category required'); return; } createStandalone.mutate(courseForm); }} disabled={createStandalone.isPending}>
                  <Save className="w-3 h-3 mr-1" /> Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddCourse(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {editingCourse && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
              <h4 className="font-medium text-sm text-[#002855]">Edit: {editingCourse.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={courseForm.categoryId} onChange={e => setCourseForm(p => ({ ...p, categoryId: parseInt(e.target.value) }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input placeholder="Name" value={courseForm.name} onChange={e => setCourseForm(p => ({ ...p, name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <select value={courseForm.type} onChange={e => setCourseForm(p => ({ ...p, type: e.target.value as any }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="class">Class</option>
                  <option value="course">Course</option>
                  <option value="workshop">Workshop</option>
                  <option value="program">Program</option>
                </select>
                <select value={courseForm.deliveryType} onChange={e => setCourseForm(p => ({ ...p, deliveryType: e.target.value as any }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="in_person">In Person</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <input placeholder="Age Range" value={courseForm.ageRange} onChange={e => setCourseForm(p => ({ ...p, ageRange: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Grade Level" value={courseForm.gradeLevel} onChange={e => setCourseForm(p => ({ ...p, gradeLevel: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <textarea placeholder="Description" value={courseForm.description} onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={courseForm.isFeatured} onChange={e => setCourseForm(p => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4" />
                Featured
              </label>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0" onClick={() => updateStandalone.mutate({ id: editingCourse.id, ...courseForm })} disabled={updateStandalone.isPending}>
                  <Save className="w-3 h-3 mr-1" /> Update
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingCourse(null)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {standaloneCoursesData?.map((course: any) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-[#002855]">{course.name}</p>
                  <p className="text-xs text-gray-500">{course.categoryName} · {course.type} · {course.deliveryType?.replace('_', ' ')}{course.ageRange ? ` · Ages ${course.ageRange}` : ''}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-[#0055A4] border-[#0055A4]/30 hover:bg-[#0055A4]/5" onClick={() => { setEditingCourse(course); setCourseForm({ categoryId: course.categoryId || 0, name: course.name, description: course.description || '', type: course.type || 'class', ageRange: course.ageRange || '', gradeLevel: course.gradeLevel || '', deliveryType: course.deliveryType || 'in_person', isFeatured: course.isFeatured || false }); setShowAddCourse(false); }}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => { if (window.confirm(`Delete "${course.name}"?`)) deleteStandalone.mutate({ id: course.id }); }}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            {(!standaloneCoursesData || standaloneCoursesData.length === 0) && (
              <p className="text-sm text-gray-500 italic text-center py-8">No courses/classes yet. Add one above.</p>
            )}
          </div>
        </div>
      )}

      {/* SCHOOL-LINKED TAB */}
      {activeTab === 'school' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select School</label>
            <select
              value={schoolId || ''}
              onChange={e => setSchoolId(e.target.value ? Number(e.target.value) : null)}
              className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0055A4] outline-none bg-white"
            >
              <option value="">-- Select a school --</option>
              {allSchools?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.city}, {s.stateCode})</option>
              ))}
            </select>
          </div>
          {schoolId && (
            <>
              <div className="bg-white rounded-lg border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#002855]">Courses ({schoolCourses?.length || 0})</h3>
                  <Button size="sm" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0" onClick={() => setShowAddSchoolCourse(!showAddSchoolCourse)}>
                    {showAddSchoolCourse ? 'Cancel' : '+ Add Course'}
                  </Button>
                </div>
                {showAddSchoolCourse && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input placeholder="Course Name *" value={schoolCourseForm.name} onChange={e => setSchoolCourseForm(p => ({ ...p, name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Subject (e.g., Math, Science)" value={schoolCourseForm.subject} onChange={e => setSchoolCourseForm(p => ({ ...p, subject: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Grade Level (e.g., 9-12)" value={schoolCourseForm.gradeLevel} onChange={e => setSchoolCourseForm(p => ({ ...p, gradeLevel: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <select value={schoolCourseForm.deliveryType} onChange={e => setSchoolCourseForm(p => ({ ...p, deliveryType: e.target.value as any }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                        <option value="in_person">In Person</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                      <input placeholder="Instructor" value={schoolCourseForm.instructor} onChange={e => setSchoolCourseForm(p => ({ ...p, instructor: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Schedule (e.g., MWF 9am-10am)" value={schoolCourseForm.schedule} onChange={e => setSchoolCourseForm(p => ({ ...p, schedule: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <textarea placeholder="Description" value={schoolCourseForm.description} onChange={e => setSchoolCourseForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} />
                    <Button size="sm" className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0" onClick={() => { if (!schoolCourseForm.name) { toast.error('Name is required'); return; } createSchoolCourse.mutate({ schoolId: schoolId!, ...schoolCourseForm, credits: schoolCourseForm.credits || undefined, tuition: schoolCourseForm.tuition || undefined, maxStudents: schoolCourseForm.maxStudents || undefined }); }} disabled={createSchoolCourse.isPending}>
                      {createSchoolCourse.isPending ? 'Adding...' : 'Add Course'}
                    </Button>
                  </div>
                )}
                {schoolCourses && schoolCourses.length > 0 ? (
                  <div className="space-y-2">
                    {schoolCourses.map((course: any) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-[#002855]">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.subject} | {course.gradeLevel} | {course.deliveryType?.replace('_', ' ')}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => deleteSchoolCourse.mutate({ id: course.id })}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No courses yet.</p>
                )}
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#002855]">Classes ({schoolClasses?.length || 0})</h3>
                  <Button size="sm" className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0" onClick={() => setShowAddClass(!showAddClass)}>
                    {showAddClass ? 'Cancel' : '+ Add Class'}
                  </Button>
                </div>
                {showAddClass && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input placeholder="Class Name *" value={classForm.name} onChange={e => setClassForm(p => ({ ...p, name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Grade Level * (e.g., K, 5, 9)" value={classForm.gradeLevel} onChange={e => setClassForm(p => ({ ...p, gradeLevel: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <select value={classForm.deliveryType} onChange={e => setClassForm(p => ({ ...p, deliveryType: e.target.value as any }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                        <option value="in_person">In Person</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                      <input placeholder="Teacher Name" value={classForm.teacherName} onChange={e => setClassForm(p => ({ ...p, teacherName: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Schedule" value={classForm.schedule} onChange={e => setClassForm(p => ({ ...p, schedule: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Max Students" type="number" value={classForm.maxStudents || ''} onChange={e => setClassForm(p => ({ ...p, maxStudents: parseInt(e.target.value) || 0 }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <textarea placeholder="Description" value={classForm.description} onChange={e => setClassForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} />
                    <Button size="sm" className="bg-[#0055A4] hover:bg-[#003d7a] text-white border-0" onClick={() => { if (!classForm.name || !classForm.gradeLevel) { toast.error('Name and Grade Level are required'); return; } createClass.mutate({ schoolId: schoolId!, ...classForm, tuition: classForm.tuition || undefined, maxStudents: classForm.maxStudents || undefined }); }} disabled={createClass.isPending}>
                      {createClass.isPending ? 'Adding...' : 'Add Class'}
                    </Button>
                  </div>
                )}
                {schoolClasses && schoolClasses.length > 0 ? (
                  <div className="space-y-2">
                    {schoolClasses.map((cls: any) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-[#002855]">{cls.name}</p>
                          <p className="text-xs text-gray-500">Grade {cls.gradeLevel} | {cls.deliveryType?.replace('_', ' ')} | {cls.teacherName || 'No teacher assigned'}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => deleteClass.mutate({ id: cls.id })}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No classes yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export function EventsManager() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const { data: pending, refetch: refetchPending } = trpc.events.listPending.useQuery();
  const { data: allEvents, refetch: refetchAll } = trpc.events.listAll.useQuery({ limit: 100 });

  const approve = trpc.events.update.useMutation({
    onSuccess: () => { toast.success("Event approved!"); refetchPending(); refetchAll(); },
    onError: (err) => toast.error(err.message),
  });
  const remove = trpc.events.delete.useMutation({
    onSuccess: () => { toast.success("Event deleted."); refetchPending(); refetchAll(); },
    onError: (err) => toast.error(err.message),
  });
  const setAudience = trpc.events.update.useMutation({
    onSuccess: () => { toast.success("Event audience updated."); refetchPending(); refetchAll(); },
    onError: (err) => toast.error(err.message),
  });

  const formatDate = (d: any) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const renderEvent = (event: any, showApprove: boolean) => (
    <div key={event.id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-[#002855] text-sm">{event.title}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0055A4]/10 text-[#0055A4] capitalize shrink-0">
            {event.category?.replace("_", " ")}
          </span>
          {event.isApproved ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">Approved</span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">Pending</span>
          )}
        </div>
        {event.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{event.description}</p>}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span>{formatDate(event.startDate)}{event.endDate ? ` – ${formatDate(event.endDate)}` : ""}</span>
          {event.location && <span>{event.location}</span>}
          {event.state && <span>{event.state}</span>}
          {event.submitterName && <span>By: {event.submitterName}</span>}
          {event.contactEmail && <span>{event.contactEmail}</span>}
          {event.website && <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-[#0055A4] hover:underline">{event.website}</a>}
        </div>
        <div className="flex items-center gap-2 mt-2.5">
          <label className="text-[11px] font-medium text-gray-500">Audience:</label>
          <select
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0055A4]"
            value={event.audience ?? "all"}
            onChange={(e) => setAudience.mutate({ id: event.id, data: { audience: e.target.value as any } })}
            disabled={setAudience.isPending}
          >
            <option value="all">All</option>
            <option value="families">Families</option>
            <option value="teachers">Teachers</option>
            <option value="students">Students</option>
            <option value="pastors">Pastors</option>
          </select>
          {event.audience === "teachers" && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Shows in Teacher Toolkit</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        {showApprove && (
          <Button
            size="sm"
            className="bg-[#6EBE44] hover:bg-[#5aa836] text-white"
            onClick={() => approve.mutate({ id: event.id, data: { isApproved: true } })}
            disabled={approve.isPending}
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="text-red-500 border-red-200 hover:bg-red-50"
          onClick={() => { if (confirm("Delete this event?")) remove.mutate({ id: event.id }); }}
          disabled={remove.isPending}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#002855]">Events Manager</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`text-sm px-4 py-2 rounded-full border font-medium transition-colors ${activeTab === "pending" ? "bg-[#0055A4] text-white border-[#0055A4]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0055A4]"}`}
          >
            Pending {pending && pending.length > 0 && <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`text-sm px-4 py-2 rounded-full border font-medium transition-colors ${activeTab === "all" ? "bg-[#0055A4] text-white border-[#0055A4]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0055A4]"}`}
          >
            All Events
          </button>
        </div>
      </div>

      {activeTab === "pending" && (
        <div className="space-y-3">
          {!pending || pending.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No pending events</p>
              <p className="text-sm text-gray-400">All submitted events have been reviewed.</p>
            </div>
          ) : (
            pending.map(event => renderEvent(event, true))
          )}
        </div>
      )}

      {activeTab === "all" && (
        <div className="space-y-3">
          {!allEvents || allEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No events yet</p>
            </div>
          ) : (
            allEvents.map(event => renderEvent(event, !event.isApproved))
          )}
        </div>
      )}
    </div>
  );
}


export function JobsManager() {
  const { data: allJobs, isLoading: allLoading, refetch } = trpc.admin.jobs.useQuery({ status: undefined });
  const approve = trpc.admin.approveJob.useMutation({
    onSuccess: () => { toast.success("Job approved!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const reject = trpc.admin.rejectJob.useMutation({
    onSuccess: () => { toast.success("Job rejected."); refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [tab, setTab] = useState<"pending"|"all">("pending");
  const update = trpc.admin.updateJob.useMutation({
    onSuccess: () => { toast.success("Job updated!"); setEditingJob(null); refetch(); },
    onError: (err: any) => toast.error(err.message),
  });

  const pending = allJobs?.filter((j: any) => !j.isPublished) || [];
  const approved = allJobs?.filter((j: any) => j.isPublished) || [];

  const renderJobCard = (job: any, showApprove: boolean) => (
    <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-[#002855] cursor-pointer hover:text-[#0055A4]" onClick={() => setSelectedJob(job)}>{job.title}</h4>
          <p className="text-sm text-gray-600">{job.schoolName || 'Unknown School'} — {job.location || 'N/A'}, {job.state || 'N/A'}</p>
          {job.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{job.description}</p>}
          <p className="text-xs text-gray-400 mt-2">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          <Button size="sm" variant="outline" onClick={() => setSelectedJob(job)} className="text-[#0055A4] border-[#0055A4] text-xs"><Eye className="w-3 h-3 mr-1" /> Details</Button>
          {showApprove && (
            <>
              <Button size="sm" onClick={() => approve.mutate({ id: job.id })} className="bg-[#6EBE44] hover:bg-[#5aa838] text-white text-xs">Approve</Button>
              <Button size="sm" variant="outline" onClick={() => reject.mutate({ id: job.id })} className="text-red-600 border-red-200 text-xs">Reject</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setTab("pending")} className={`text-sm px-4 py-2 rounded-lg font-medium ${tab === "pending" ? "bg-[#0055A4] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
          Pending ({pending.length})
        </button>
        <button onClick={() => setTab("all")} className={`text-sm px-4 py-2 rounded-lg font-medium ${tab === "all" ? "bg-[#0055A4] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
          All Jobs ({allJobs?.length || 0})
        </button>
      </div>

      {tab === "pending" && (
        <div className="space-y-3">
          {allLoading ? <p className="text-sm text-gray-500">Loading...</p> : pending.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No pending job submissions.</p>
          ) : pending.map((job: any) => renderJobCard(job, true))}
        </div>
      )}

      {tab === "all" && (
        <div className="space-y-3">
          {allLoading ? <p className="text-sm text-gray-500">Loading...</p> : !allJobs || allJobs.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No jobs yet.</p>
          ) : allJobs.map((job: any) => renderJobCard(job, false))}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#002855]">{editingJob ? 'Edit Job' : selectedJob.title}</h2>
              <button onClick={() => { setSelectedJob(null); setEditingJob(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {editingJob ? (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Title</label>
                    <input type="text" value={editingJob.title || ''} onChange={(e) => setEditingJob({...editingJob, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <textarea value={editingJob.description || ''} onChange={(e) => setEditingJob({...editingJob, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Location</label>
                      <input type="text" value={editingJob.location || ''} onChange={(e) => setEditingJob({...editingJob, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">State</label>
                      <input type="text" value={editingJob.state || ''} onChange={(e) => setEditingJob({...editingJob, state: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Website</label>
                    <input type="text" value={editingJob.website || ''} onChange={(e) => setEditingJob({...editingJob, website: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="https://example.com" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => { update.mutate({ id: selectedJob.id, data: editingJob }); }} className="bg-[#6EBE44] hover:bg-[#5aa838] text-white"><Save className="w-3 h-3 mr-1" /> Save</Button>
                    <Button onClick={() => setEditingJob(null)} variant="outline">Cancel</Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">School</label>
                    <p className="text-sm text-gray-600">{selectedJob.schoolName || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Location</label>
                      <p className="text-sm text-gray-600">{selectedJob.location || 'N/A'}, {selectedJob.state || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Posted</label>
                      <p className="text-sm text-gray-600">{new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedJob.description || 'No description provided'}</p>
                  </div>
                  {selectedJob.website && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Website</label>
                      <a href={selectedJob.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0055A4] hover:underline">{selectedJob.website}</a>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <p className={`text-sm font-medium ${selectedJob.isPublished ? 'text-green-600' : 'text-amber-600'}`}>{selectedJob.isPublished ? 'Published' : 'Pending'}</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => setEditingJob({...selectedJob})} className="bg-[#0055A4] hover:bg-[#003d7a] text-white"><Pencil className="w-3 h-3 mr-1" /> Edit</Button>
                    {!selectedJob.isPublished && (
                      <>
                        <Button onClick={() => { approve.mutate({ id: selectedJob.id }); setSelectedJob(null); }} className="bg-[#6EBE44] hover:bg-[#5aa838] text-white">Approve</Button>
                        <Button onClick={() => { reject.mutate({ id: selectedJob.id }); setSelectedJob(null); }} variant="outline" className="text-red-600 border-red-200">Reject</Button>
                      </>
                    )}
                    <Button onClick={() => setSelectedJob(null)} variant="outline">Close</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Submissions Queue - unified view for all pending submissions (jobs, events, courses, classes)
export function SubmissionsQueue() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  
  const { data: pendingJobs } = trpc.admin.jobs.useQuery({ status: 'pending' });
  const { data: pendingEvents } = trpc.admin.events.useQuery({ status: 'pending' });
  const { data: pendingCourses } = trpc.admin.courses.useQuery({ status: 'pending' });
  
  const approveJob = trpc.admin.approveJob.useMutation({
    onSuccess: () => toast.success("Job approved!"),
  });
  
  const rejectJob = trpc.admin.rejectJob.useMutation({
    onSuccess: () => toast.success("Job rejected!"),
  });
  
  const approveEvent = trpc.admin.approveEvent.useMutation({
    onSuccess: () => toast.success("Event approved!"),
  });
  
  const rejectEvent = trpc.admin.rejectEvent.useMutation({
    onSuccess: () => toast.success("Event rejected!"),
  });
  
  const approveCourse = trpc.admin.approveCourse.useMutation({
    onSuccess: () => toast.success("Course approved!"),
  });
  
  const rejectCourse = trpc.admin.rejectCourse.useMutation({
    onSuccess: () => toast.success("Course rejected!"),
  });

  const allSubmissions = useMemo(() => {
    const items: any[] = [];
    
    pendingJobs?.forEach((job: any) => {
      items.push({
        id: `job-${job.id}`,
        type: 'job',
        title: job.title,
        subtitle: `${job.schoolName} • ${job.location}, ${job.state}`,
        status: job.isApproved ? 'approved' : 'pending',
        createdAt: job.createdAt,
        data: job,
      });
    });
    
    pendingEvents?.forEach((event: any) => {
      items.push({
        id: `event-${event.id}`,
        type: 'event',
        title: event.title,
        subtitle: `${event.location}, ${event.state}`,
        status: event.isApproved ? 'approved' : 'pending',
        createdAt: event.createdAt,
        data: event,
      });
    });
    
    pendingCourses?.forEach((course: any) => {
      items.push({
        id: `course-${course.id}`,
        type: 'course',
        title: course.name,
        subtitle: `${course.gradeLevel} • ${course.subject}`,
        status: course.isApproved ? 'approved' : 'pending',
        createdAt: course.createdAt,
        data: course,
      });
    });
    
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [pendingJobs, pendingEvents, pendingCourses]);

  const filtered: any[] = allSubmissions.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const pendingCount = allSubmissions.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002855]">Submissions Queue</h2>
          <p className="text-sm text-gray-600 mt-1">{pendingCount} pending submissions awaiting approval</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
            {pendingCount} Pending
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({allSubmissions.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({allSubmissions.filter(i => i.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('approved')}
        >
          Approved ({allSubmissions.filter(i => i.status === 'approved').length})
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">All caught up!</p>
            <p className="text-sm text-gray-500">No {filter === 'all' ? 'submissions' : filter + ' submissions'} to review.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 uppercase">
                      {item.type}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'approved' ? 'Approved' : 'Pending Review'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#002855] text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Submitted {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                {item.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="bg-[#6EBE44] hover:bg-[#5aa838] text-white"
                      onClick={() => {
                        if (item.type === 'job') approveJob.mutate({ id: item.data.id });
                        else if (item.type === 'event') approveEvent.mutate({ id: item.data.id });
                        else if (item.type === 'course') approveCourse.mutate({ id: item.data.id });
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        if (item.type === 'job') rejectJob.mutate({ id: item.data.id });
                        else if (item.type === 'event') rejectEvent.mutate({ id: item.data.id });
                        else if (item.type === 'course') rejectCourse.mutate({ id: item.data.id });
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// Contact Messages Manager
export function ContactMessages() {
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'responded'>('new');
  const { data: messages, isLoading } = trpc.system.getContactMessages.useQuery({ status: filter === 'all' ? undefined : filter });
  const utils = trpc.useUtils();
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  
  const updateMessage = trpc.system.updateContactMessage.useMutation({
    onSuccess: () => {
      toast.success("Message updated!");
      utils.system.getContactMessages.invalidate();
    },
  });

  const deleteMessage = trpc.system.deleteContactMessage.useMutation({
    onSuccess: () => {
      toast.success("Message deleted!");
      utils.system.getContactMessages.invalidate();
    },
  });
  
  const handleBatchDelete = () => {
    selectedMessages.forEach(id => deleteMessage.mutate({ id }));
    setSelectedMessages(new Set());
    toast.success(`Deleted ${selectedMessages.size} messages`);
  };
  
  const handleBatchMarkRead = () => {
    selectedMessages.forEach(id => updateMessage.mutate({ id, status: 'read' }));
    setSelectedMessages(new Set());
    toast.success(`Marked ${selectedMessages.size} messages as read`);
  };
  
  const toggleMessageSelection = (id: number) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMessages(newSelected);
  };
  
  const toggleSelectAll = () => {
    if (selectedMessages.size === messages?.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages?.map((m: any) => m.id) || []));
    }
  };

  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const handleMarkAsRead = (id: number) => {
    updateMessage.mutate({ id, status: 'read' });
  };

  const handleMarkAsResponded = (id: number) => {
    updateMessage.mutate({ id, status: 'responded', adminNotes });
    setSelectedMessage(null);
    setAdminNotes("");
  };

  const reasonLabels: Record<string, string> = {
    claim_school: "Claim/Update School",
    premium_upgrade: "Premium Upgrade",
    add_school: "Add School",
    report_error: "Report Error",
    general_question: "General Question",
    partnership: "Partnership",
    technical_issue: "Technical Issue",
    other: "Other",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#002855]">Contact Messages</h2>
          <p className="text-sm text-gray-600 mt-1">All contact form submissions</p>
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        {['all', 'new', 'read', 'responded'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status as any)}
            className="capitalize"
          >
            {status} ({messages?.filter((m: any) => status === 'all' || m.status === status).length || 0})
          </Button>
        ))}
        {selectedMessages.size > 0 && (
          <div className="ml-auto flex gap-2">
            <span className="text-sm text-gray-600 font-medium">{selectedMessages.size} selected</span>
            <Button size="sm" variant="outline" onClick={handleBatchMarkRead} className="text-xs">Mark Read</Button>
            <Button size="sm" variant="outline" onClick={handleBatchDelete} className="text-xs text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
          </div>
        )}
      </div>

      {selectedMessages.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={selectedMessages.size === messages?.length} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4]/20" />
            <span className="text-sm font-medium text-blue-900">{selectedMessages.size} of {messages?.length} selected</span>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-8">Loading messages...</p>
        ) : messages?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No messages</p>
            <p className="text-sm text-gray-500">No {filter === 'all' ? 'messages' : filter + ' messages'} to display.</p>
          </div>
        ) : (
          messages?.map((msg: any) => (
            <div key={msg.id} className={`bg-white rounded-xl border p-5 hover:shadow-md transition ${
              msg.status === 'new' ? 'border-blue-200 bg-blue-50' : 'border-gray-100'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <input type="checkbox" checked={selectedMessages.has(msg.id)} onChange={() => toggleMessageSelection(msg.id)} className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0055A4] focus:ring-[#0055A4]/20 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 uppercase">
                      {reasonLabels[msg.reason] || msg.reason}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      msg.status === 'new' ? 'bg-red-100 text-red-700' :
                      msg.status === 'read' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#002855]">{msg.senderName}</h3>
                  <p className="text-sm text-gray-600">{msg.senderEmail}</p>
                  {msg.senderPhone && <p className="text-sm text-gray-600">{msg.senderPhone}</p>}
                  {msg.schoolName && <p className="text-sm text-gray-600">School: {msg.schoolName}</p>}
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  {msg.status === 'new' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(msg.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-[#0055A4] hover:bg-[#003d7a] text-white"
                    onClick={() => setSelectedMessage(msg)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => deleteMessage.mutate({ id: msg.id })}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#002855]">Message Details</h2>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">From</p>
                  <p className="font-semibold text-[#002855]">{selectedMessage.senderName}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.senderEmail}</p>
                  {selectedMessage.senderPhone && <p className="text-sm text-gray-600">{selectedMessage.senderPhone}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Reason</p>
                  <p className="font-semibold text-[#002855]">{reasonLabels[selectedMessage.reason] || selectedMessage.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleDateString()} at {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {selectedMessage.schoolName && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">School</p>
                  <p className="text-[#002855]">{selectedMessage.schoolName}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.status !== 'responded' && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Admin Notes</p>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about your response..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20"
                  />
                </div>
              )}

              {selectedMessage.adminNotes && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Response Notes</p>
                  <div className="bg-green-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap border border-green-200">
                    {selectedMessage.adminNotes}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Close
                </Button>
                {selectedMessage.status !== 'responded' && (
                  <Button
                    className="bg-[#6EBE44] hover:bg-[#5aa838] text-white"
                    onClick={() => handleMarkAsResponded(selectedMessage.id)}
                  >
                    Mark as Responded
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteInsights() {
  const [days, setDays] = useState(30);
  const { data: pageStats, isLoading: pageLoading } = trpc.admin.pageViewStats.useQuery({ days });
  const { data: funnelData, isLoading: funnelLoading } = trpc.admin.funnelStats.useQuery({ days });
  const { data: topPages, isLoading: pagesLoading } = trpc.admin.topPages.useQuery({ days, limit: 20 });
  const { data: sessionData, isLoading: sessionLoading } = trpc.admin.sessionInsights.useQuery({ days });

  if (pageLoading || funnelLoading || pagesLoading || sessionLoading) return <LoadingSkeleton />;

  const funnelStepLabels: Record<string, string> = {
    visit: 'Site Visit',
    search: 'Search',
    view_school: 'View School',
    contact: 'Contact',
    list_school: 'List School',
    premium_checkout: 'Premium Checkout',
    donation: 'Donation',
    newsletter_signup: 'Newsletter Signup',
  };

  const funnelStepColors: Record<string, string> = {
    visit: '#002855',
    search: '#0055A4',
    view_school: '#3B82F6',
    contact: '#6EBE44',
    list_school: '#F59E0B',
    premium_checkout: '#8B5CF6',
    donation: '#EC4899',
    newsletter_signup: '#14B8A6',
  };

  const maxFunnelSessions = Math.max(...(funnelData?.steps?.map((s: any) => s.sessions) || [1]));

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Time Range:</span>
        {[7, 14, 30, 90].map(d => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${days === d ? 'bg-[#002855] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {d} days
          </button>
        ))}
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Page Views</p>
          <p className="text-3xl font-bold text-[#002855]">{(pageStats?.totalViews || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Unique Sessions</p>
          <p className="text-3xl font-bold text-[#0055A4]">{(pageStats?.uniqueSessions || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Avg. Time on Page</p>
          <p className="text-3xl font-bold text-[#6EBE44]">{pageStats?.avgDuration || 0}s</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Bounce Rate</p>
          <p className="text-3xl font-bold text-amber-600">{pageStats?.bounceRate || 0}%</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pages / Session</p>
          <p className="text-3xl font-bold text-purple-600">{sessionData?.avgPagesPerSession || 0}</p>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-[#002855] mb-1">Traffic Overview</h3>
        <p className="text-sm text-gray-500 mb-6">Daily page views and unique sessions</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pageStats?.dailyViews || []}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0055A4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0055A4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6EBE44" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6EBE44" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="views" name="Page Views" stroke="#0055A4" strokeWidth={2} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#6EBE44" strokeWidth={2} fill="url(#colorSessions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Journey Funnel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-[#002855] mb-1">Customer Journey Funnel</h3>
        <p className="text-sm text-gray-500 mb-6">How visitors progress through key actions</p>
        <div className="space-y-3">
          {funnelData?.steps?.filter((s: any) => s.sessions > 0).map((step: any, index: number) => {
            const percent = maxFunnelSessions > 0 ? Math.round((step.sessions / maxFunnelSessions) * 100) : 0;
            const prevStep = funnelData.steps[index - 1];
            const dropOff = prevStep && prevStep.sessions > 0
              ? Math.round(((prevStep.sessions - step.sessions) / prevStep.sessions) * 100)
              : 0;
            return (
              <div key={step.step} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{funnelStepLabels[step.step] || step.step}</span>
                    {dropOff > 0 && index > 0 && (
                      <span className="text-xs text-red-500 font-medium">-{dropOff}% drop-off</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[#002855]">{step.sessions.toLocaleString()} sessions</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className="h-8 rounded-full transition-all duration-700 flex items-center px-3"
                    style={{ width: `${Math.max(percent, 3)}%`, backgroundColor: funnelStepColors[step.step] || '#6B7280' }}
                  >
                    <span className="text-xs text-white font-medium">{percent}%</span>
                  </div>
                </div>
              </div>
            );
          })}
          {(!funnelData?.steps || funnelData.steps.every((s: any) => s.sessions === 0)) && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="font-medium">No funnel data yet</p>
              <p className="text-sm">Funnel events will appear as visitors interact with the site.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#002855] mb-1">Top Pages</h3>
          <p className="text-sm text-gray-500 mb-4">Most visited pages by views</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {topPages && topPages.length > 0 ? topPages.map((page: any, i: number) => (
              <div key={page.path} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-gray-400 w-6">{i + 1}</span>
                  <span className="text-sm text-gray-700 truncate" title={page.path}>{page.path === '/' ? 'Homepage' : page.path}</span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-gray-500">{page.uniqueVisitors} visitors</span>
                  <span className="text-sm font-semibold text-[#002855]">{page.views}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <p className="font-medium">No page data yet</p>
                <p className="text-sm">Page views will appear as visitors browse the site.</p>
              </div>
            )}
          </div>
        </div>

        {/* Entry & Exit Pages */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#002855] mb-1">Entry & Exit Points</h3>
          <p className="text-sm text-gray-500 mb-4">Where visitors arrive and leave</p>
          
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Top Entry Pages</h4>
            {sessionData?.topEntryPages && sessionData.topEntryPages.length > 0 ? (
              <div className="space-y-1">
                {sessionData.topEntryPages.slice(0, 5).map((p: any) => (
                  <div key={p.path} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-green-50">
                    <span className="text-sm text-gray-700 truncate">{p.path === '/' ? 'Homepage' : p.path}</span>
                    <span className="text-xs font-medium text-green-600">{p.count} entries</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400">No data yet</p>}
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Top Exit Pages (Drop-off Points)</h4>
            {sessionData?.topExitPages && sessionData.topExitPages.length > 0 ? (
              <div className="space-y-1">
                {sessionData.topExitPages.slice(0, 5).map((p: any) => (
                  <div key={p.path} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-red-50">
                    <span className="text-sm text-gray-700 truncate">{p.path === '/' ? 'Homepage' : p.path}</span>
                    <span className="text-xs font-medium text-red-500">{p.count} exits</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400">No data yet</p>}
          </div>
        </div>
      </div>

      {/* Conversion Rates */}
      {funnelData?.conversionRates && Object.keys(funnelData.conversionRates).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#002855] mb-1">Conversion Rates</h3>
          <p className="text-sm text-gray-500 mb-4">Step-to-step conversion percentages</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(funnelData.conversionRates).map(([key, rate]) => {
              const [from, to] = key.split('_to_');
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">{funnelStepLabels[from] || from} → {funnelStepLabels[to] || to}</p>
                  <p className={`text-2xl font-bold ${Number(rate) > 50 ? 'text-green-600' : Number(rate) > 20 ? 'text-amber-600' : 'text-red-500'}`}>
                    {rate}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function BlogManager() {
  const { data, refetch } = trpc.blog.listAll.useQuery({ limit: 100 });
  const { data: stats } = trpc.blog.stats.useQuery();
  const update = trpc.blog.update.useMutation({
    onSuccess: () => { toast.success("Post updated."); refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const remove = trpc.blog.delete.useMutation({
    onSuccess: () => { toast.success("Post deleted."); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const formatDate = (d: any) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const setStatus = (id: number, status: "draft" | "scheduled" | "published", scheduledFor?: Date | null) => {
    update.mutate({ id, data: { status, scheduledFor: scheduledFor ?? null } });
  };

  const posts = data?.posts ?? [];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-[#002855]">{stats?.published ?? 0}</div>
          <div className="text-xs text-gray-500">Published</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-amber-600">{stats?.scheduled ?? 0}</div>
          <div className="text-xs text-gray-500">Scheduled (auto-publish)</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-[#002855]">{stats?.total ?? 0}</div>
          <div className="text-xs text-gray-500">Total posts</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-[#0055A4]">{stats?.downloads ?? 0}</div>
          <div className="text-xs text-gray-500">Downloads</div>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Scheduled posts publish automatically when their date arrives — no action needed.
        Use Publish Now to push a scheduled post live immediately, or Unpublish to pull it back to draft.
      </p>

      {/* Post list */}
      <div className="space-y-3">
        {posts.map((post: any) => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-[#002855] text-sm">{post.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                    post.status === "published" ? "bg-green-100 text-green-700" :
                    post.status === "scheduled" ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {post.status}
                  </span>
                  {post.isPremiumResource && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                      ${((post.resourcePriceCents ?? 0) / 100).toFixed(0)} premium
                    </span>
                  )}
                  {post.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">Featured</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="capitalize">{post.category?.replace("_", " ")}</span>
                  {post.ageGroup && <span>Ages {post.ageGroup}</span>}
                  {post.scheduledFor && <span>Scheduled: {formatDate(post.scheduledFor)}</span>}
                  {post.publishedAt && <span>Published: {formatDate(post.publishedAt)}</span>}
                  <span>{post.viewCount ?? 0} views</span>
                  <span>{post.downloadCount ?? 0} downloads</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Preview
                </a>
                {post.status === "scheduled" && (
                  <Button
                    size="sm"
                    className="bg-[#6EBE44] hover:bg-[#5aa836] text-white text-xs"
                    onClick={() => setStatus(post.id, "published")}
                    disabled={update.isPending}
                  >
                    Publish Now
                  </Button>
                )}
                {post.status === "published" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => setStatus(post.id, "draft")}
                    disabled={update.isPending}
                  >
                    Unpublish
                  </Button>
                )}
                {post.status === "draft" && (
                  <Button
                    size="sm"
                    className="bg-[#0055A4] hover:bg-[#004483] text-white text-xs"
                    onClick={() => setStatus(post.id, "published")}
                    disabled={update.isPending}
                  >
                    Publish
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => { if (confirm(`Delete "${post.title}"?`)) remove.mutate({ id: post.id }); }}
                  disabled={remove.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 text-sm">
            No blog posts yet. Posts will appear here once imported.
          </div>
        )}
      </div>
    </div>
  );
}


export function ForumWaitlistManager() {
  const [statusFilter, setStatusFilter] = useState<"pending" | "validated" | "rejected" | "all">("pending");
  const { data: entries, isLoading, refetch } = trpc.toolkitAdmin.forumWaitlist.useQuery(
    statusFilter === "all" ? {} : { status: statusFilter }
  );
  const setStatus = trpc.toolkitAdmin.setForumWaitlistStatus.useMutation({
    onSuccess: () => { toast.success("Waitlist entry updated."); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const statusBadge = (s: string) =>
    s === "validated" ? "bg-green-100 text-green-700" : s === "rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#002855]">Teacher Forum — Founding Waitlist</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Teachers who signed up on /teacher-toolkit. Validate the school before forum access opens — no one gets in unvalidated.
          </p>
        </div>
        <div className="flex gap-2">
          {(["pending", "validated", "rejected", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-sm px-4 py-2 rounded-full border font-medium capitalize transition-colors ${statusFilter === s ? "bg-[#0055A4] text-white border-[#0055A4]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0055A4]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !entries || entries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No {statusFilter === "all" ? "" : statusFilter} signups</p>
          <p className="text-sm text-gray-400">Founding-teacher signups from the Teacher Toolkit will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry: any) => (
            <div key={entry.id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-[#002855] text-sm">{entry.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${statusBadge(entry.status)}`}>{entry.status}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0055A4]/10 text-[#0055A4] capitalize">{entry.role}</span>
                  {entry.teachesAtChristianSchool ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600">Attests Christian school</span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>{entry.email}</span>
                  <span>{entry.schoolName}{entry.schoolCity ? ` — ${entry.schoolCity}` : ""}{entry.schoolState ? `, ${entry.schoolState}` : ""}</span>
                  <span>{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                </div>
                {entry.adminNotes && <p className="text-xs text-gray-400 mt-1.5 italic">{entry.adminNotes}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {entry.status !== "validated" && (
                  <Button size="sm" className="bg-[#6EBE44] hover:bg-[#5aa836] text-white"
                    onClick={() => setStatus.mutate({ id: entry.id, status: "validated" })} disabled={setStatus.isPending}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Validate
                  </Button>
                )}
                {entry.status !== "rejected" && (
                  <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => setStatus.mutate({ id: entry.id, status: "rejected" })} disabled={setStatus.isPending}>
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                )}
                {entry.status !== "pending" && (
                  <Button size="sm" variant="outline"
                    onClick={() => setStatus.mutate({ id: entry.id, status: "pending" })} disabled={setStatus.isPending}>
                    Reset
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
