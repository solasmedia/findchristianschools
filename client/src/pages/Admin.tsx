import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Users, School, Mail, Handshake, Globe, Clock, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, ShieldCheck, Trash2, Upload, Pencil, Eye, AlertTriangle, Tag, Plus, Save, Calendar, Briefcase, FileDown, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import EnrichmentAdmin from "./admin/EnrichmentAdmin";
import { CoursesManager, EventsManager, JobsManager, SubmissionsQueue, ContactMessages, SiteInsights, BlogManager } from "./admin/AdminManagers";

export default function Admin() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Clock className="w-8 h-8 animate-spin text-[#0055A4]" /></div>;
  if (!user || user.role !== 'admin') return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You must be an admin to access this page.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#002855]">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage schools, users, sponsors, and newsletter subscribers.</p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="flex flex-wrap gap-1 mb-8 h-auto p-2 bg-white shadow-sm rounded-xl">
            <TabsTrigger value="analytics" className="text-xs md:text-sm py-2"><BarChart3 className="w-4 h-4 mr-1" /> Analytics</TabsTrigger>
            <TabsTrigger value="submissions" className="text-xs md:text-sm py-2"><AlertTriangle className="w-4 h-4 mr-1" /> Submissions</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs md:text-sm py-2"><School className="w-4 h-4 mr-1" /> Pending</TabsTrigger>
            <TabsTrigger value="schools" className="text-xs md:text-sm py-2"><School className="w-4 h-4 mr-1" /> All Schools</TabsTrigger>
            <TabsTrigger value="international" className="text-xs md:text-sm py-2"><Globe className="w-4 h-4 mr-1" /> Int'l</TabsTrigger>
            <TabsTrigger value="users" className="text-xs md:text-sm py-2"><Users className="w-4 h-4 mr-1" /> Users</TabsTrigger>
            <TabsTrigger value="newsletter" className="text-xs md:text-sm py-2"><Mail className="w-4 h-4 mr-1" /> Newsletter</TabsTrigger>
            <TabsTrigger value="sponsors" className="text-xs md:text-sm py-2"><Handshake className="w-4 h-4 mr-1" /> Sponsors</TabsTrigger>
            <TabsTrigger value="claims" className="text-xs md:text-sm py-2"><ShieldCheck className="w-4 h-4 mr-1" /> Claims</TabsTrigger>
            <TabsTrigger value="removals" className="text-xs md:text-sm py-2"><Trash2 className="w-4 h-4 mr-1" /> Removals</TabsTrigger>
            <TabsTrigger value="import" className="text-xs md:text-sm py-2"><Upload className="w-4 h-4 mr-1" /> Import</TabsTrigger>
            <TabsTrigger value="courses" className="text-xs md:text-sm py-2"><School className="w-4 h-4 mr-1" /> Courses</TabsTrigger>
            <TabsTrigger value="events" className="text-xs md:text-sm py-2"><Calendar className="w-4 h-4 mr-1" /> Events</TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs md:text-sm py-2"><Briefcase className="w-4 h-4 mr-1" /> Jobs</TabsTrigger>
            <TabsTrigger value="blog" className="text-xs md:text-sm py-2"><BookOpen className="w-4 h-4 mr-1" /> Blog</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs md:text-sm py-2"><Mail className="w-4 h-4 mr-1" /> Messages</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs md:text-sm py-2"><TrendingUp className="w-4 h-4 mr-1" /> Insights</TabsTrigger>
            <TabsTrigger value="enrichment" className="text-xs md:text-sm py-2"><ShieldCheck className="w-4 h-4 mr-1" /> Enrichment</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="submissions"><SubmissionsQueue /></TabsContent>
          <TabsContent value="pending"><PendingSchools /></TabsContent>
          <TabsContent value="schools"><AllSchools /></TabsContent>
          <TabsContent value="international"><PendingInternational /></TabsContent>
          <TabsContent value="users"><AllUsers /></TabsContent>
          <TabsContent value="newsletter"><Newsletter /></TabsContent>
          <TabsContent value="sponsors"><Sponsors /></TabsContent>
          <TabsContent value="claims"><ClaimRequests /></TabsContent>
          <TabsContent value="removals"><RemovalRequests /></TabsContent>
          <TabsContent value="import"><DataImport /></TabsContent>
          <TabsContent value="courses"><CoursesManager /></TabsContent>
          <TabsContent value="events"><EventsManager /></TabsContent>
          <TabsContent value="jobs"><JobsManager /></TabsContent>
          <TabsContent value="blog"><BlogManager /></TabsContent>
          <TabsContent value="messages"><ContactMessages /></TabsContent>
          <TabsContent value="insights"><SiteInsights /></TabsContent>
          <TabsContent value="enrichment"><EnrichmentAdmin /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AnalyticsDashboard() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = trpc.admin.analytics.useQuery();
  const { data: stats, isLoading: statsLoading, error: statsError } = trpc.admin.submissionStats.useQuery();
  const { data: pendingSchools, isLoading: pendingLoading } = trpc.admin.pendingSchools.useQuery();
  const approve = trpc.admin.approveSchool.useMutation({
    onSuccess: () => { toast.success("School approved!"); },
  });

  if (metricsLoading || statsLoading) return <LoadingSkeleton />;
  
  if (metricsError || statsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="font-semibold text-red-900 mb-1">Analytics Error</h3>
        <p className="text-sm text-red-700">Unable to load analytics. Check database connection.</p>
      </div>
    );
  }

  const growthPercent = stats && stats.lastMonth > 0
    ? Math.round(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100)
    : stats?.thisMonth ? 100 : 0;

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers || 0}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Newsletter Subs"
          value={metrics?.totalSubscribers || 0}
          icon={<Mail className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Total Schools"
          value={metrics?.totalSchools || 0}
          icon={<School className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Approved"
          value={metrics?.approvedSchools || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Pending"
          value={metrics?.pendingSchools || 0}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
          highlight={true}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#002855]">School Submissions</h3>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#002855]">{stats?.thisMonth || 0}</span>
              <span className="text-xs text-gray-500">this month</span>
              {growthPercent !== 0 && (
                <span className={`flex items-center text-xs font-medium ${growthPercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthPercent > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(growthPercent)}%
                </span>
              )}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.dailyData || []}>
                <defs>
                  <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0055A4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0055A4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 600, color: '#002855' }}
                />
                <Area type="monotone" dataKey="submissions" stroke="#0055A4" strokeWidth={2} fill="url(#colorSubmissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#002855]">Growth Overview</h3>
              <p className="text-sm text-gray-500">Month-over-month comparison</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#6EBE44]" />
          </div>
          <div className="space-y-6">
            <GrowthBar label="This Month" value={stats?.thisMonth || 0} max={Math.max(stats?.thisMonth || 1, stats?.lastMonth || 1)} color="#6EBE44" />
            <GrowthBar label="Last Month" value={stats?.lastMonth || 0} max={Math.max(stats?.thisMonth || 1, stats?.lastMonth || 1)} color="#0055A4" />
            <GrowthBar label="All Time" value={stats?.total || 0} max={stats?.total || 1} color="#002855" />
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#002855]">{stats?.thisMonth || 0}</p>
                <p className="text-xs text-gray-500">This Month</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0055A4]">{stats?.lastMonth || 0}</p>
                <p className="text-xs text-gray-500">Last Month</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#6EBE44]">{stats?.total || 0}</p>
                <p className="text-xs text-gray-500">All Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Pending Schools */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#002855]">Quick Actions — Pending Approvals</h3>
          <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
            {pendingSchools?.length || 0} pending
          </span>
        </div>
        {pendingLoading ? (
          <LoadingSkeleton />
        ) : !pendingSchools || pendingSchools.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">All caught up! No pending schools.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {pendingSchools.slice(0, 10).map((school: any) => (
              <div key={school.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <h4 className="font-medium text-[#002855]">{school.name}</h4>
                  <p className="text-xs text-gray-500">{school.city}, {school.state} — {school.programType || 'traditional'}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => approve.mutate({ id: school.id })}
                  className="bg-[#6EBE44] hover:bg-[#5da838] text-white"
                  disabled={approve.isPending}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, highlight }: { title: string; value: number; icon: React.ReactNode; color: string; highlight?: boolean }) {
  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`rounded-xl p-5 shadow-sm border ${highlight ? 'border-amber-200 ring-2 ring-amber-100' : 'border-gray-100'} bg-white`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${c.bg}`}>
          <span className={c.icon}>{icon}</span>
        </span>
      </div>
      <p className="text-3xl font-bold text-[#002855]">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}

function GrowthBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-[#002855]">{value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
}

function PendingSchools() {
  const { data, isLoading, refetch } = trpc.admin.pendingSchools.useQuery();
  const approve = trpc.admin.approveSchool.useMutation({ onSuccess: () => { toast.success("School approved!"); refetch(); } });

  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) return <EmptyState icon={<CheckCircle className="w-12 h-12 text-green-400" />} title="All caught up!" subtitle="No pending school applications." />;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#002855]">{data.length} Pending Applications</h3>
      {data.map((school: any) => (
        <div key={school.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-[#002855]">{school.name}</h4>
              <p className="text-sm text-gray-500">{school.city}, {school.state} {school.zip}</p>
              <p className="text-sm text-gray-500 mt-1">{school.email || school.phone || 'No contact'}</p>
              {school.programType && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded mt-2 inline-block">{school.programType}</span>}
            </div>
            <Button onClick={() => approve.mutate({ id: school.id })} className="bg-[#6EBE44] hover:bg-[#5da838] text-white" disabled={approve.isPending}>
              <CheckCircle className="w-4 h-4 mr-1" /> Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingInternational() {
  const { data, isLoading, refetch } = trpc.admin.pendingInternational.useQuery();
  const approve = trpc.admin.approveInternational.useMutation({ onSuccess: () => { toast.success("School approved!"); refetch(); } });

  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) return <EmptyState icon={<CheckCircle className="w-12 h-12 text-green-400" />} title="All caught up!" subtitle="No pending international applications." />;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#002855]">{data.length} Pending International Applications</h3>
      {data.map((school: any) => (
        <div key={school.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-[#002855]">{school.name}</h4>
              <p className="text-sm text-gray-500">{school.city}, {school.country}</p>
              <p className="text-sm text-gray-500">{school.primaryLanguage} | {school.curriculumType}</p>
            </div>
            <Button onClick={() => approve.mutate({ id: school.id })} className="bg-[#6EBE44] hover:bg-[#5da838] text-white" disabled={approve.isPending}>
              <CheckCircle className="w-4 h-4 mr-1" /> Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AllSchools() {
  const utils = trpc.useUtils();
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const { data, isLoading } = trpc.admin.allSchools.useQuery({ limit: pageSize, offset: (page - 1) * pageSize });
  const deleteSchool = trpc.schools.delete.useMutation({
    onSuccess: () => { toast.success('School deleted'); utils.admin.allSchools.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateSchool = trpc.schools.update.useMutation({
    onSuccess: () => { toast.success('School updated'); utils.admin.allSchools.invalidate(); setEditingSchool(null); },
    onError: (e) => toast.error(e.message),
  });
  const approveSchoolMut = trpc.admin.approveSchool.useMutation({
    onSuccess: () => { toast.success('School approved & verified!'); utils.admin.allSchools.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((s: any) => {
      if (searchFilter && !s.name.toLowerCase().includes(searchFilter.toLowerCase()) && !s.city?.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      if (statusFilter && s.listingStatus !== statusFilter) return false;
      return true;
    });
  }, [data, searchFilter, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = ['id','name','slug','address','city','state','stateCode','zip','phone','email','website','denomination','denominationTag','gradeStart','gradeEnd','schoolType','enrollment','enrollmentTier','programType','tuitionType','tuitionMin','tuitionMax','listingStatus','isVerified','schoolClaimed','isPremium','featured','accreditation','pointOfContact','internalNotes','county'];
    const csvRows = [headers.join(',')];
    data.forEach((s: any) => {
      const row = headers.map(h => {
        const val = s[h] ?? '';
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
      });
      csvRows.push(row.join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `schools_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(`Exported ${data.length} schools`);
  };

  if (isLoading) return <LoadingSkeleton />;
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-[#002855]">{filteredData.length} Schools (Page {page})</h3>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Search name or city..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm w-48" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm">
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="unverified">Unverified</option>
            <option value="claimed">Claimed</option>
            <option value="removed">Removed</option>
          </select>
          <Button size="sm" variant="outline" onClick={handleExportCSV} className="text-xs">
            <Save className="w-3 h-3 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium text-gray-600">Name</th>
                <th className="text-left p-3 font-medium text-gray-600">Location</th>
                <th className="text-left p-3 font-medium text-gray-600">Denomination</th>
                <th className="text-left p-3 font-medium text-gray-600">Status</th>
                <th className="text-left p-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.slice(0, 100).map((school: any) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-[#002855] max-w-[200px] truncate">{school.name}</td>
                  <td className="p-3 text-gray-600 text-xs">{school.city}, {school.stateCode} {school.zip}</td>
                  <td className="p-3 text-xs text-gray-600">{school.denomination || '-'}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      school.listingStatus === 'verified' ? 'bg-green-50 text-green-700' :
                      school.listingStatus === 'pending' ? 'bg-amber-50 text-amber-700' :
                      school.listingStatus === 'claimed' ? 'bg-blue-50 text-blue-700' :
                      school.listingStatus === 'removed' ? 'bg-red-50 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{school.listingStatus || 'unverified'}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-blue-600 border-blue-200 hover:bg-blue-50" title="Edit"
                        onClick={() => setEditingSchool(school)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      {(school.listingStatus === 'pending' || school.listingStatus === 'claimed') && (
                        <Button size="sm" variant="outline" className="h-7 px-2 text-green-600 border-green-200 hover:bg-green-50" title="Approve & Verify"
                          onClick={() => approveSchoolMut.mutate({ id: school.id })}>
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                      <a href={`/school/${school.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-gray-500 border-gray-200 hover:bg-gray-50" title="View">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </a>
                      {confirmDelete === school.id ? (
                        <>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-red-600 border-red-300 bg-red-50"
                            onClick={() => { deleteSchool.mutate({ id: school.id }); setConfirmDelete(null); }}>
                            Yes
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => setConfirmDelete(null)}>No</Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7 px-2 text-red-500 border-red-200 hover:bg-red-50" title="Delete"
                          onClick={() => setConfirmDelete(school.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, 8787)} of ~8,787 schools</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          <Button size="sm" variant="outline" onClick={() => handlePageChange(page + 1)}>
            Next
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSchool && (
        <SchoolEditModal school={editingSchool} onClose={() => setEditingSchool(null)} onSave={(id, data) => updateSchool.mutate({ id, data })} isPending={updateSchool.isPending} />
      )}
    </div>
  );
}

function SchoolEditModal({ school, onClose, onSave, isPending }: { school: any; onClose: () => void; onSave: (id: number, data: any) => void; isPending: boolean }) {
  const [form, setForm] = useState({
    name: school.name || '', address: school.address || '', city: school.city || '',
    state: school.state || '', stateCode: school.stateCode || '', zip: school.zip || '',
    phone: school.phone || '', email: school.email || '', website: school.website || '',
    gradeStart: school.gradeStart || '', gradeEnd: school.gradeEnd || '',
    denomination: school.denomination || '', denominationTag: school.denominationTag || '',
    schoolType: school.schoolType || '', enrollment: school.enrollment || 0,
    enrollmentTier: school.enrollmentTier || '', programType: school.programType || 'traditional',
    tuitionType: school.tuitionType || 'free', tuitionMin: school.tuitionMin || 0, tuitionMax: school.tuitionMax || 0,
    accreditation: school.accreditation || '', description: school.description || '',
    listingStatus: school.listingStatus || 'unverified', isVerified: !!school.isVerified,
    schoolClaimed: !!school.schoolClaimed, isPremium: !!school.isPremium, featured: !!school.featured,
    pointOfContact: school.pointOfContact || '', internalNotes: school.internalNotes || '', county: school.county || '',
  });
  const set = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    const data: any = {};
    // Only send changed fields
    Object.entries(form).forEach(([key, val]) => {
      const orig = school[key];
      if (key === 'enrollment' || key === 'tuitionMin' || key === 'tuitionMax') {
        if (Number(val) !== Number(orig || 0)) data[key] = Number(val);
      } else if (key === 'isVerified' || key === 'schoolClaimed' || key === 'isPremium' || key === 'featured') {
        if (Boolean(val) !== Boolean(orig)) data[key] = Boolean(val);
      } else {
        if (String(val || '') !== String(orig || '')) data[key] = val || undefined;
      }
    });
    if (Object.keys(data).length === 0) { onClose(); return; }
    onSave(school.id, data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-[#002855]">Edit: {school.name}</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={isPending} className="bg-[#0055A4] text-white">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <fieldset className="border rounded-lg p-4">
            <legend className="text-sm font-semibold text-[#002855] px-2">Basic Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600">Name</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Phone</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Email</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Website</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.website} onChange={(e) => set('website', e.target.value)} /></div>
            </div>
          </fieldset>
          {/* Location */}
          <fieldset className="border rounded-lg p-4">
            <legend className="text-sm font-semibold text-[#002855] px-2">Location</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3"><label className="text-xs font-medium text-gray-600">Address</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.address} onChange={(e) => set('address', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">City</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.city} onChange={(e) => set('city', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">State</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.state} onChange={(e) => set('state', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Zip</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.zip} onChange={(e) => set('zip', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">State Code</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.stateCode} onChange={(e) => set('stateCode', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">County</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.county} onChange={(e) => set('county', e.target.value)} /></div>
            </div>
          </fieldset>
          {/* Academics */}
          <fieldset className="border rounded-lg p-4">
            <legend className="text-sm font-semibold text-[#002855] px-2">Academics</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-600">Grade Start</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.gradeStart} onChange={(e) => set('gradeStart', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Grade End</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.gradeEnd} onChange={(e) => set('gradeEnd', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">School Type</label>
                <select className="w-full border rounded px-2 py-1.5 text-sm" value={form.schoolType} onChange={(e) => set('schoolType', e.target.value)}>
                  <option value="">Not Set</option><option value="elementary">Elementary</option><option value="secondary">Secondary</option><option value="combined">Combined</option><option value="early-childhood">Early Childhood</option>
                </select>
              </div>
              <div><label className="text-xs font-medium text-gray-600">Program Type</label>
                <select className="w-full border rounded px-2 py-1.5 text-sm" value={form.programType} onChange={(e) => set('programType', e.target.value)}>
                  <option value="traditional">Traditional</option><option value="online">Online</option><option value="hybrid">Hybrid</option><option value="homeschool_coop">Homeschool Co-op</option><option value="boarding">Boarding</option>
                </select>
              </div>
              <div><label className="text-xs font-medium text-gray-600">Enrollment</label><input type="number" className="w-full border rounded px-2 py-1.5 text-sm" value={form.enrollment} onChange={(e) => set('enrollment', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Enrollment Tier</label>
                <select className="w-full border rounded px-2 py-1.5 text-sm" value={form.enrollmentTier} onChange={(e) => set('enrollmentTier', e.target.value)}>
                  <option value="">Not Set</option><option value="small">Small (1-50)</option><option value="medium">Medium (51-200)</option><option value="large">Large (200+)</option>
                </select>
              </div>
            </div>
          </fieldset>
          {/* Details */}
          <fieldset className="border rounded-lg p-4">
            <legend className="text-sm font-semibold text-[#002855] px-2">Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600">Tuition Type</label>
                <select className="w-full border rounded px-2 py-1.5 text-sm" value={form.tuitionType} onChange={(e) => set('tuitionType', e.target.value)}>
                  <option value="free">Free</option><option value="tuition_assisted">Tuition Assisted</option><option value="tuition_based">Tuition Based</option>
                </select>
              </div>
              <div><label className="text-xs font-medium text-gray-600">Tuition Min ($)</label><input type="number" className="w-full border rounded px-2 py-1.5 text-sm" value={form.tuitionMin} onChange={(e) => set('tuitionMin', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Tuition Max ($)</label><input type="number" className="w-full border rounded px-2 py-1.5 text-sm" value={form.tuitionMax} onChange={(e) => set('tuitionMax', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Accreditation</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.accreditation} onChange={(e) => set('accreditation', e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs font-medium text-gray-600">Description</label><textarea className="w-full border rounded px-2 py-1.5 text-sm" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
            </div>
          </fieldset>
          {/* Faith */}
          <fieldset className="border rounded-lg p-4">
            <legend className="text-sm font-semibold text-[#002855] px-2">Faith & Denomination</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600">Denomination</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.denomination} onChange={(e) => set('denomination', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Denomination Tag</label>
                <select className="w-full border rounded px-2 py-1.5 text-sm" value={form.denominationTag} onChange={(e) => set('denominationTag', e.target.value)}>
                  <option value="">Not Set</option><option value="non-denominational">Non-Denominational</option><option value="baptist">Baptist</option><option value="lutheran">Lutheran</option><option value="anabaptist">Anabaptist</option><option value="adventist">Adventist</option><option value="pentecostal">Pentecostal</option><option value="episcopal">Episcopal</option><option value="methodist">Methodist</option><option value="presbyterian">Presbyterian</option><option value="reformed">Reformed</option><option value="quaker">Quaker</option><option value="wesleyan-holiness">Wesleyan-Holiness</option><option value="evangelical-other">Other Evangelical</option>
                </select>
              </div>
            </div>
          </fieldset>
          {/* Listing */}
          <fieldset className="border rounded-lg p-4">
            <legend className="text-sm font-semibold text-[#002855] px-2">Listing & Admin</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-600">Listing Status</label>
                <select className="w-full border rounded px-2 py-1.5 text-sm" value={form.listingStatus} onChange={(e) => set('listingStatus', e.target.value)}>
                  <option value="unverified">Unverified</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="claimed">Claimed</option><option value="removed">Removed</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5"><input type="checkbox" checked={form.isVerified} onChange={(e) => set('isVerified', e.target.checked)} /><label className="text-xs text-gray-600">Is Verified</label></div>
              <div className="flex items-center gap-2 pt-5"><input type="checkbox" checked={form.schoolClaimed} onChange={(e) => set('schoolClaimed', e.target.checked)} /><label className="text-xs text-gray-600">School Claimed</label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.isPremium} onChange={(e) => set('isPremium', e.target.checked)} /><label className="text-xs text-gray-600">Premium</label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /><label className="text-xs text-gray-600">Featured</label></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div><label className="text-xs font-medium text-gray-600">Point of Contact</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.pointOfContact} onChange={(e) => set('pointOfContact', e.target.value)} /></div>
              <div><label className="text-xs font-medium text-gray-600">Internal Notes</label><input className="w-full border rounded px-2 py-1.5 text-sm" value={form.internalNotes} onChange={(e) => set('internalNotes', e.target.value)} /></div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

function AllUsers() {
  const { data, isLoading } = trpc.admin.allUsers.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#002855] mb-4">{data?.length || 0} Registered Users</h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Name</th>
              <th className="text-left p-3 font-medium text-gray-600">Email</th>
              <th className="text-left p-3 font-medium text-gray-600">Role</th>
              <th className="text-left p-3 font-medium text-gray-600">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium text-[#002855]">{u.name || 'Unnamed'}</td>
                <td className="p-3 text-gray-600">{u.email || '-'}</td>
                <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Newsletter() {
  const { data, isLoading } = trpc.admin.subscribers.useQuery();
  
  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      toast.error("No subscribers to export");
      return;
    }
    
    const headers = ['Email', 'First Name', 'Last Name', 'State', 'Source', 'Date Subscribed'];
    const rows = data.map((sub: any) => [
      sub.email,
      sub.firstName || '',
      sub.lastName || '',
      sub.state || '',
      sub.source || 'direct',
      new Date(sub.createdAt).toLocaleDateString(),
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`Exported ${data.length} subscribers`);
  };
  
  if (isLoading) return <LoadingSkeleton />;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#002855]">{data?.length || 0} Active Subscribers</h3>
        <Button onClick={handleExportCSV} className="bg-[#6EBE44] hover:bg-[#5aa838] text-white text-sm"><FileDown className="w-4 h-4 mr-2" /> Export CSV</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Email</th>
              <th className="text-left p-3 font-medium text-gray-600">Name</th>
              <th className="text-left p-3 font-medium text-gray-600">State</th>
              <th className="text-left p-3 font-medium text-gray-600">Source</th>
              <th className="text-left p-3 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.map((sub: any) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-800">{sub.email}</td>
                <td className="p-3 text-gray-600">{sub.firstName} {sub.lastName}</td>
                <td className="p-3 text-gray-600">{sub.state || '-'}</td>
                <td className="p-3"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{sub.source || 'direct'}</span></td>
                <td className="p-3 text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Sponsors() {
  const { data, isLoading, refetch } = trpc.admin.sponsors.useQuery();
  const update = trpc.admin.updateSponsor.useMutation({ onSuccess: () => { toast.success("Sponsor updated!"); refetch(); } });
  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) return <EmptyState icon={<Handshake className="w-12 h-12 text-gray-300" />} title="No sponsors yet" subtitle="Sponsor inquiries will appear here." />;
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#002855]">{data.length} Sponsor Inquiries</h3>
      {data.map((s: any) => (
        <div key={s.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-[#002855]">{s.companyName}</h4>
              <p className="text-sm text-gray-500">{s.contactName} — {s.contactEmail}</p>
              <p className="text-sm text-gray-500 mt-1">Type: {s.sponsorType || 'general'} | Budget: {s.budget || 'Not specified'}</p>
              {s.message && <p className="text-sm text-gray-600 mt-2 italic">"{s.message}"</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => update.mutate({ id: s.id, status: 'approved' })} disabled={s.status === 'approved'}>Approve</Button>
              <Button size="sm" className="bg-[#6EBE44] text-white" onClick={() => update.mutate({ id: s.id, status: 'active' })} disabled={s.status === 'active'}>Activate</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-6 animate-pulse"><div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>)}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}

function ClaimRequests() {
  const { data: claims, isLoading } = trpc.admin.claimRequests.useQuery({ status: undefined });
  const updateClaim = trpc.admin.updateClaimRequest.useMutation({
    onSuccess: () => { toast.success("Claim request updated"); utils.admin.claimRequests.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const utils = trpc.useUtils();

  if (isLoading) return <LoadingSkeleton />;
  if (!claims || claims.length === 0) return <EmptyState icon={<ShieldCheck className="w-12 h-12 text-gray-300" />} title="No Claim Requests" subtitle="No schools have been claimed yet." />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#002855]">School Claim Requests</h2>
      <div className="space-y-3">
        {claims.map((claim: any) => (
          <div key={claim.id} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">School ID: {claim.schoolId}</h3>
                <p className="text-sm text-gray-600 mt-1"><strong>Claimant:</strong> {claim.claimantName} ({claim.claimantEmail})</p>
                {claim.claimantPhone && <p className="text-sm text-gray-500">Phone: {claim.claimantPhone}</p>}
                <p className="text-sm text-gray-500">Role: {claim.claimantRole}</p>
                {claim.relationship && <p className="text-sm text-gray-500">Relationship: {claim.relationship}</p>}
                {claim.verificationNotes && <p className="text-sm text-gray-500">Verification: {claim.verificationNotes}</p>}
                <p className="text-xs text-gray-400 mt-2">Submitted: {new Date(claim.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : claim.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {claim.status}
                </span>
                {claim.status === 'pending' && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50" onClick={() => updateClaim.mutate({ id: claim.id, status: 'approved' })}>
                      <CheckCircle className="w-3 h-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => updateClaim.mutate({ id: claim.id, status: 'denied' })}>
                      <XCircle className="w-3 h-3 mr-1" /> Deny
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RemovalRequests() {
  const { data: removals, isLoading } = trpc.admin.removalRequests.useQuery({ status: undefined });
  const updateRemoval = trpc.admin.updateRemovalRequest.useMutation({
    onSuccess: () => { toast.success("Removal request updated"); utils.admin.removalRequests.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const utils = trpc.useUtils();

  if (isLoading) return <LoadingSkeleton />;
  if (!removals || removals.length === 0) return <EmptyState icon={<Trash2 className="w-12 h-12 text-gray-300" />} title="No Removal Requests" subtitle="No removal requests have been submitted." />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#002855]">School Removal Requests</h2>
      <div className="space-y-3">
        {removals.map((removal: any) => (
          <div key={removal.id} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">School ID: {removal.schoolId}</h3>
                <p className="text-sm text-gray-600 mt-1"><strong>Requester:</strong> {removal.requesterName} ({removal.requesterEmail})</p>
                {removal.requesterPhone && <p className="text-sm text-gray-500">Phone: {removal.requesterPhone}</p>}
                <p className="text-sm text-gray-500">Role: {removal.requesterRole}</p>
                <p className="text-sm text-gray-500">Reason: {removal.reason}</p>
                <p className="text-xs text-gray-400 mt-2">Submitted: {new Date(removal.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${removal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : removal.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {removal.status}
                </span>
                {removal.status === 'pending' && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50" onClick={() => updateRemoval.mutate({ id: removal.id, status: 'approved' })}>
                      <CheckCircle className="w-3 h-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => updateRemoval.mutate({ id: removal.id, status: 'denied' })}>
                      <XCircle className="w-3 h-3 mr-1" /> Deny
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceName, setSourceName] = useState("NCES PSS 2023-24");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);

  const handleImport = async () => {
    if (!file) { toast.error("Please select a file"); return; }
    setImporting(true);
    setResult(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/admin/import-schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData: text, sourceName }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
      toast.success(`Imported ${data.imported} schools`);
    } catch (e: any) {
      toast.error(e.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#002855]">Data Import</h2>
      <p className="text-gray-600">Upload a CSV file to import school data from external sources (e.g., NCES Private School Survey). Imported schools will be marked as "Unverified" with a data source badge and will show "Claim This School" and "Remove This School" buttons.</p>

      <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Source Name *</label>
          <input
            type="text"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g., NCES PSS 2023-24 private school search export"
          />
          <p className="text-xs text-gray-500 mt-1">This label will appear on each imported school listing to indicate the data source.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (CSV) *</label>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">CSV should have headers: school_name, city, state, zip_code, street_address, phone, website, denomination, grade_start, grade_end, enrollment, student_teacher_ratio, county</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Expected CSV Format</h4>
          <p className="text-xs text-blue-700 font-mono">school_name,city,state,zip_code,street_address,phone,website,denomination,grade_start,grade_end,enrollment,student_teacher_ratio,county</p>
          <p className="text-xs text-blue-600 mt-2">State should be the full name (e.g., "Arizona"). The system will automatically convert to state codes.</p>
        </div>

        <Button onClick={handleImport} disabled={importing || !file} className="bg-[#0055A4] hover:bg-[#003d7a]">
          {importing ? <><Clock className="w-4 h-4 mr-2 animate-spin" /> Importing...</> : <><Upload className="w-4 h-4 mr-2" /> Import Schools</>}
        </Button>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-800">Import Complete</h4>
            <p className="text-sm text-green-700">Imported: {result.imported} | Skipped (duplicates): {result.skipped}</p>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-red-600 font-medium">Errors ({result.errors.length}):</p>
                <ul className="text-xs text-red-500 list-disc list-inside max-h-32 overflow-y-auto">
                  {result.errors.slice(0, 10).map((err, i) => <li key={i}>{err}</li>)}
                  {result.errors.length > 10 && <li>...and {result.errors.length - 10} more</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

