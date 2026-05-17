import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Users, School, Mail, Handshake, Globe, Clock, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, ShieldCheck, Trash2, Upload, Pencil, Eye, AlertTriangle, Tag, Plus, Save, Calendar, Briefcase, FileDown } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

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
            <TabsTrigger value="messages" className="text-xs md:text-sm py-2"><Mail className="w-4 h-4 mr-1" /> Messages</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs md:text-sm py-2"><TrendingUp className="w-4 h-4 mr-1" /> Insights</TabsTrigger>
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
          <TabsContent value="messages"><ContactMessages /></TabsContent>
          <TabsContent value="insights"><SiteInsights /></TabsContent>
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


function CoursesManager() {
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
function EventsManager() {
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


function JobsManager() {
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
function SubmissionsQueue() {
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
function ContactMessages() {
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

function SiteInsights() {
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
