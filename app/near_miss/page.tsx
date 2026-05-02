'use client';

import React, { useState, useEffect, useMemo } from "react";
import { 
  AlertTriangle, Send, Search, FilterX, BarChart3, 
  Calendar, Clock, MapPin, Building2, User, 
  FileWarning, ClipboardList, Info, Loader2,
  Eye, Pencil, Trash2, ChevronDown, ChevronUp,
  Users, Download, RefreshCw, ChevronRight
} from "lucide-react";
import { PageShell } from '@/components/PageShell';

// Shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CollapsibleSection } from '@/components/CollapsibleSection';

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============== TYPES ===============
interface NearMissReport {
  id: string;
  department: string;
  section: "Mechanical" | "Electrical" | "General";
  date: string;
  time: string;
  location: string;
  description: string;
  witnessDetails: string;
  reporterName: string;
  submittedAt: string;
}

interface NearMissStats {
  total: number;
  bySection: Record<string, number>;
  byReporter: Record<string, number>;
}

// =============== API FUNCTIONS ===============
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Fetching:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || `API error: ${response.status}`);
      } catch {
        throw new Error(errorText || `API error: ${response.status}`);
      }
    }

    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }
    return {} as T;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

async function getReports(params?: {
  search?: string;
  section?: string;
  reporter?: string;
  from_date?: string;
  to_date?: string;
}): Promise<NearMissReport[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.section) queryParams.append('section', params.section);
  if (params?.reporter) queryParams.append('reporter', params.reporter);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);

  try {
    const data = await fetchAPI<any>(`/api/nearmiss/?${queryParams.toString()}`);
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return []; // Return empty array on error
  }
}

async function getReport(id: string): Promise<NearMissReport | null> {
  try {
    return await fetchAPI<NearMissReport>(`/api/nearmiss/${id}`);
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}

async function createReport(report: Partial<NearMissReport>): Promise<NearMissReport | null> {
  try {
    return await fetchAPI<NearMissReport>('/api/nearmiss/', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return null;
  }
}

async function updateReport(id: string, report: Partial<NearMissReport>): Promise<NearMissReport | null> {
  try {
    return await fetchAPI<NearMissReport>(`/api/nearmiss/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return null;
  }
}

async function deleteReport(id: string): Promise<boolean> {
  try {
    await fetchAPI(`/api/nearmiss/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
}

// =============== HELPER FUNCTIONS ===============
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  try {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timeStr;
  }
};

// =============== REPORT DETAIL MODAL ===============
const ReportDetailModal = ({ 
  report, 
  open, 
  onClose,
  onEdit,
  onDelete
}: { 
  report: NearMissReport | null; 
  open: boolean; 
  onClose: () => void;
  onEdit: (report: NearMissReport) => void;
  onDelete: (id: string) => void;
}) => {
  if (!report) return null;

  const getSectionColor = (section: string) => {
    switch(section) {
      case 'Mechanical': return 'bg-blue-100 text-blue-800';
      case 'Electrical': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Near Miss Report Details
          </DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(report.submittedAt)} at {formatTime(report.time)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{report.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Section</p>
              <Badge className={getSectionColor(report.section)}>
                {report.section}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(report.date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{formatTime(report.time)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{report.location}</p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description of Incident</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{report.description}</p>
            </div>
          </div>

          {/* Witness Details */}
          {report.witnessDetails && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Witness Details</h3>
                <p>{report.witnessDetails}</p>
              </div>
            </>
          )}

          {/* Reporter */}
          {report.reporterName && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Reported By</h3>
                <p>{report.reporterName}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={() => {
            onClose();
            onEdit(report);
          }}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => {
            onClose();
            onDelete(report.id);
          }}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =============== REPORT FORM MODAL ===============
const ReportFormModal = ({ 
  open, 
  onClose, 
  onSave, 
  report 
}: { 
  open: boolean; 
  onClose: () => void; 
  onSave: (report: Partial<NearMissReport>) => Promise<void>;
  report?: NearMissReport | null;
}) => {
  const [formData, setFormData] = useState<Partial<NearMissReport>>({
    department: "",
    section: "General",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    location: "",
    description: "",
    witnessDetails: "",
    reporterName: ""
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        department: report.department,
        section: report.section,
        date: report.date,
        time: report.time,
        location: report.location,
        description: report.description,
        witnessDetails: report.witnessDetails || "",
        reporterName: report.reporterName || ""
      });
    } else {
      setFormData({
        department: "",
        section: "General",
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        location: "",
        description: "",
        witnessDetails: "",
        reporterName: ""
      });
    }
  }, [report, open]);

  const validateForm = () => {
    if (!formData.department?.trim()) {
      toast.error('Department is required');
      return false;
    }
    if (!formData.location?.trim()) {
      toast.error('Location is required');
      return false;
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.date) {
      toast.error('Date is required');
      return false;
    }
    if (!formData.time) {
      toast.error('Time is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            {report ? 'Edit Near Miss Report' : 'New Near Miss Report'}
          </DialogTitle>
          <DialogDescription>
            {report ? 'Update the report details below.' : 'Enter details of the near miss incident below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Department *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  placeholder="Department where incident took place" 
                  required 
                  value={formData.department} 
                  onChange={e => setFormData({...formData, department: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Section *</Label>
              <Select 
                value={formData.section} 
                onValueChange={(val: any) => setFormData({...formData, section: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="General">General/Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date & Time *</Label>
              <div className="flex gap-2">
                <Input 
                  type="date" 
                  required 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                />
                <Input 
                  type="time" 
                  required 
                  value={formData.time} 
                  onChange={e => setFormData({...formData, time: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  placeholder="Specific location details" 
                  required 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description of Incident *</Label>
            <Textarea 
              placeholder="Describe what happened, as it occurred..." 
              className="min-h-[120px]" 
              required 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Witness Details (Optional)</Label>
              <Input 
                placeholder="Names and contact info" 
                value={formData.witnessDetails} 
                onChange={e => setFormData({...formData, witnessDetails: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Reporter Name (Optional)</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  placeholder="Your name" 
                  value={formData.reporterName} 
                  onChange={e => setFormData({...formData, reporterName: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {report ? 'Update Report' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// =============== MAIN PAGE ===============
export default function NearMissPage() {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<NearMissReport[]>([]);
  const [stats, setStats] = useState<NearMissStats>({
    total: 0,
    bySection: { Mechanical: 0, Electrical: 0, General: 0 },
    byReporter: {}
  });
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Form State
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<NearMissReport | null>(null);
  const [selectedReport, setSelectedReport] = useState<NearMissReport | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Filter State
  const [nameFilter, setNameFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  // Helper function to calculate stats from reports
  const calculateStatsFromReports = (reportsData: NearMissReport[]): NearMissStats => {
    const newStats: NearMissStats = {
      total: reportsData.length,
      bySection: { Mechanical: 0, Electrical: 0, General: 0 },
      byReporter: {}
    };

    reportsData.forEach(report => {
      // Count by section
      if (report.section === 'Mechanical') newStats.bySection.Mechanical++;
      else if (report.section === 'Electrical') newStats.bySection.Electrical++;
      else if (report.section === 'General') newStats.bySection.General++;

      // Count by reporter
      if (report.reporterName && report.reporterName.trim() !== '') {
        const reporter = report.reporterName.trim();
        newStats.byReporter[reporter] = (newStats.byReporter[reporter] || 0) + 1;
      }
    });

    return newStats;
  };

  // Load data
  const loadReports = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await getReports();
      console.log('Reports loaded:', data);
      const reportsArray = Array.isArray(data) ? data : [];
      setReports(reportsArray);
      
      // Calculate stats from the reports instead of fetching them
      const calculatedStats = calculateStatsFromReports(reportsArray);
      setStats(calculatedStats);
      
    } catch (error: any) {
      console.error('Failed to load reports:', error);
      setApiError(error.message || 'Failed to load reports');
      toast.error('Failed to load reports');
      setReports([]);
      setStats({ total: 0, bySection: { Mechanical: 0, Electrical: 0, General: 0 }, byReporter: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Filter reports - with safety check
  const filteredReports = useMemo(() => {
    // Ensure reports is an array before filtering
    if (!Array.isArray(reports)) {
      console.error('reports is not an array:', reports);
      return [];
    }
    
    return reports.filter(r => {
      const matchesName = (r.reporterName?.toLowerCase() || '').includes(nameFilter.toLowerCase()) ||
                         (r.department?.toLowerCase() || '').includes(nameFilter.toLowerCase());
      const matchesSection = sectionFilter === "all" || r.section === sectionFilter;
      
      let matchesDate = true;
      if (dateStart && dateEnd && r.date) {
        const rDate = new Date(r.date);
        const startDate = new Date(dateStart);
        const endDate = new Date(dateEnd);
        matchesDate = rDate >= startDate && rDate <= endDate;
      }
      
      return matchesName && matchesSection && matchesDate;
    });
  }, [reports, nameFilter, sectionFilter, dateStart, dateEnd]);

  // Handlers
  const handleSave = async (formData: Partial<NearMissReport>) => {
    try {
      let newReports: NearMissReport[];
      
      if (editingReport) {
        const updated = await updateReport(editingReport.id, formData);
        if (updated) {
          newReports = reports.map(r => r.id === updated.id ? updated : r);
          setReports(newReports);
          toast.success('Report updated successfully');
        } else {
          toast.error('Failed to update report');
          return;
        }
      } else {
        const created = await createReport(formData);
        if (created) {
          newReports = [created, ...reports];
          setReports(newReports);
          toast.success('Near Miss Report Submitted Successfully');
        } else {
          toast.error('Failed to create report');
          return;
        }
      }
      
      // Recalculate stats from the updated reports
      const calculatedStats = calculateStatsFromReports(newReports);
      setStats(calculatedStats);
      
      setFormModalOpen(false);
      setEditingReport(null);
    } catch (error) {
      console.error('Failed to save report:', error);
      toast.error('Failed to save report');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        const success = await deleteReport(id);
        if (success) {
          const newReports = reports.filter(r => r.id !== id);
          setReports(newReports);
          
          // Recalculate stats from the updated reports
          const calculatedStats = calculateStatsFromReports(newReports);
          setStats(calculatedStats);
          
          toast.success('Report deleted successfully');
        } else {
          toast.error('Failed to delete report');
        }
      } catch (error) {
        console.error('Failed to delete report:', error);
        toast.error('Failed to delete report');
      }
    }
  };

  const handleView = (report: NearMissReport) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
  };

  const handleEdit = (report: NearMissReport) => {
    setEditingReport(report);
    setFormModalOpen(true);
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setNameFilter("");
    setSectionFilter("all");
    setDateStart("");
    setDateEnd("");
  };

  const getSectionColor = (section: string) => {
    switch(section) {
      case 'Mechanical': return 'bg-blue-100 text-blue-800';
      case 'Electrical': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageShell>
      <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-[#6B7B8E] mb-2">
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#2A4D69] font-medium">Near Miss</span>
          </nav>
          <h1 className="text-3xl font-bold text-[#2A4D69] font-heading tracking-tight">Near Miss Reporting</h1>
          <p className="text-[#6B7B8E] mt-1 max-w-2xl">Report dangerous occurrences where no injury or damage occurred — every report helps prevent future incidents.</p>
        </div>
        <Button onClick={() => { setEditingReport(null); setFormModalOpen(true); }} className="bg-[#2A4D69] hover:bg-[#1e3a52] text-white shadow-md self-start">
          <AlertTriangle className="h-4 w-4 mr-2" /> New Report
        </Button>
      </div>

      {/* Error Display */}
      {apiError && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">API Error: {apiError}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadReports} 
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-600" /> Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">By Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Mechanical</span>
                <span className="font-bold">{stats.bySection.Mechanical || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Electrical</span>
                <span className="font-bold">{stats.bySection.Electrical || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>General</span>
                <span className="font-bold">{stats.bySection.General || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Reports by Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byReporter).map(([name, count]) => (
                <Badge key={name} variant="secondary" className="px-3 py-1">
                  {name}: <span className="ml-1 font-bold">{count}</span>
                </Badge>
              ))}
              {Object.keys(stats.byReporter).length === 0 && (
                <span className="text-sm text-muted-foreground italic">No reports yet</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search — always visible */}
      <div className="relative bg-white rounded-lg border shadow-sm p-3">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7B8E]" />
        <Input
          placeholder="Search by department or reporter..."
          className="pl-10 pr-10 bg-white border-0 shadow-none focus-visible:ring-0"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
        />
        {nameFilter && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setNameFilter('')}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#6B7B8E] hover:text-[#2A4D69]"
          >
            <FilterX className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <CollapsibleSection
        title="Filters"
        description="Filter reports by section and date range"
        badge={
          (sectionFilter !== 'all' || dateStart || dateEnd)
            ? <Badge className="ml-2 bg-[#2A4D69] text-white text-xs px-2 py-0.5">
                {[sectionFilter !== 'all', !!dateStart, !!dateEnd].filter(Boolean).length}
              </Badge>
            : null
        }
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
          <div className="space-y-2">
            <Label className="text-[#2A4D69] font-medium">Section</Label>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="bg-[#F0F5F9]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[#2A4D69] font-medium">From</Label>
            <Input type="date" className="bg-[#F0F5F9]" value={dateStart} onChange={e => setDateStart(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#2A4D69] font-medium">To</Label>
            <Input type="date" className="bg-[#F0F5F9]" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={clearFilters} className="text-[#6B7B8E] hover:text-[#2A4D69]">
            <FilterX className="h-4 w-4 mr-2" /> Clear Filters
          </Button>
        </div>
      </CollapsibleSection>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      )}

      {/* Reports Table */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle>Near Miss Reports</CardTitle>
            <CardDescription>
              {filteredReports.length} report(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No reports found</p>
                <Button 
                  onClick={() => {
                    setEditingReport(null);
                    setFormModalOpen(true);
                  }} 
                  className="mt-4 bg-amber-600 hover:bg-amber-700"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" /> Create First Report
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <React.Fragment key={report.id}>
                        <TableRow 
                          className="hover:bg-slate-50 cursor-pointer"
                          onClick={() => handleView(report)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(report.id);
                              }}
                            >
                              {expandedItems.has(report.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDate(report.date)}</span>
                              <span className="text-xs text-muted-foreground">{formatTime(report.time)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{report.department}</TableCell>
                          <TableCell>
                            <Badge className={getSectionColor(report.section)}>
                              {report.section}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.location}</TableCell>
                          <TableCell>{report.reporterName || 'Anonymous'}</TableCell>
                          <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" onClick={() => handleView(report)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(report)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(report.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedItems.has(report.id) && (
                          <TableRow className="bg-slate-50">
                            <TableCell colSpan={7} className="p-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">Description:</h4>
                                <p className="text-sm whitespace-pre-wrap">{report.description}</p>
                                {report.witnessDetails && (
                                  <>
                                    <h4 className="font-medium mt-2">Witness Details:</h4>
                                    <p className="text-sm">{report.witnessDetails}</p>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Form Modal */}
      <ReportFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingReport(null);
        }}
        onSave={handleSave}
        report={editingReport}
      />

      {/* Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      </main>
    </PageShell>
  );
}