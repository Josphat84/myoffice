'use client';

import React, { useState, useEffect, useMemo } from "react";
import { 
  ClipboardCheck, Plus, Trash2, Calendar, 
  Clock, MapPin, Building2, UserCircle, 
  Send, Save, FileText, CheckCircle, XCircle,
  Filter, Download, Eye, Pencil, Search, X,
  LayoutGrid, Table as TableIcon, ChevronDown, ChevronUp,
  Maximize2, Minimize2, BarChart3, PieChart, TrendingUp,
  Users, AlertTriangle, CheckCircle2, Clock3, CalendarRange,
  HardHat, Wrench, Zap, Droplets, Flame, Shield,
  Settings, RefreshCw, Loader2, Award, Star, Target, ChevronRight
} from "lucide-react";
import { PageShell } from '@/components/PageShell';
import { CollapsibleSection } from '@/components/CollapsibleSection';

// Shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============== TYPES ===============
type SectionType = 'mechanical' | 'electrical';
type PriorityType = 'low' | 'medium' | 'high' | 'critical';
type StatusType = 'open' | 'in-progress' | 'closed' | 'overdue';

interface InspectionFinding {
  id: string;
  finding: string;
  requiredAction: string;
  byWho: string;
  byWhen: string;
  status: StatusType;
  priority: PriorityType;
  section: SectionType;
  completedDate?: string;
  remarks?: string;
}

interface SHEQFormData {
  id: string;
  inspectors: string;
  title: string;
  place: string;
  date: string;
  time: string;
  department: string;
  section: SectionType;
  findings: InspectionFinding[];
  hodName: string;
  sheqOfficialName: string;
  hodSignature?: string;
  sheqSignature?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface InspectionStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  overdue: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  bySection: Record<SectionType, number>;
  byInspector: Record<string, number>;
}

// =============== CONSTANTS ===============
const SECTIONS: SectionType[] = ['mechanical', 'electrical'];

const SECTION_LABELS: Record<SectionType, string> = {
  mechanical: 'Mechanical',
  electrical: 'Electrical'
};

const SECTION_ICONS: Record<SectionType, any> = {
  mechanical: Wrench,
  electrical: Zap
};

const PRIORITIES: PriorityType[] = ['low', 'medium', 'high', 'critical'];
const PRIORITY_COLORS: Record<PriorityType, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-green-100 text-green-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const STATUSES: StatusType[] = ['open', 'in-progress', 'closed', 'overdue'];
const STATUS_COLORS: Record<StatusType, string> = {
  'open': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'closed': 'bg-green-100 text-green-800',
  'overdue': 'bg-red-100 text-red-800'
};

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

    // Handle 204 No Content responses (DELETE operations)
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

async function getInspections(params?: {
  search?: string;
  section?: string;
  status?: string;
  inspector?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}): Promise<SHEQFormData[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.section) queryParams.append('section', params.section);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.inspector) queryParams.append('inspector', params.inspector);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  return fetchAPI<SHEQFormData[]>(`/sheq/?${queryParams.toString()}`);
}

async function getInspection(id: string): Promise<SHEQFormData> {
  return fetchAPI<SHEQFormData>(`/sheq/${id}`);
}

async function createInspection(inspection: Partial<SHEQFormData>): Promise<SHEQFormData> {
  return fetchAPI<SHEQFormData>('/sheq/', {
    method: 'POST',
    body: JSON.stringify(inspection),
  });
}

async function updateInspection(id: string, inspection: Partial<SHEQFormData>): Promise<SHEQFormData> {
  return fetchAPI<SHEQFormData>(`/sheq/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(inspection),
  });
}

async function deleteInspection(id: string): Promise<void> {
  await fetchAPI(`/sheq/${id}`, {
    method: 'DELETE',
  });
}

async function getInspectionStats(): Promise<InspectionStats> {
  return fetchAPI<InspectionStats>('/sheq/stats/overview');
}

// =============== HELPER FUNCTIONS ===============
const calculateStats = (inspections: SHEQFormData[]): InspectionStats => {
  const stats: InspectionStats = {
    total: inspections.length,
    open: 0,
    inProgress: 0,
    closed: 0,
    overdue: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    bySection: {
      mechanical: 0,
      electrical: 0
    },
    byInspector: {}
  };

  inspections.forEach(inspection => {
    // Count by section
    if (inspection.section) {
      stats.bySection[inspection.section]++;
    }

    // Count by inspector
    if (inspection.inspectors) {
      inspection.inspectors.split(',').forEach(inspector => {
        const name = inspector.trim();
        if (name) {
          stats.byInspector[name] = (stats.byInspector[name] || 0) + 1;
        }
      });
    }

    // Count findings by status and priority
    if (inspection.findings && Array.isArray(inspection.findings)) {
      inspection.findings.forEach(finding => {
        if (finding.status === 'in-progress') {
          stats.inProgress++;
        } else if (finding.status === 'open') {
          stats.open++;
        } else if (finding.status === 'closed') {
          stats.closed++;
        } else if (finding.status === 'overdue') {
          stats.overdue++;
        }
        
        if (finding.priority === 'critical') {
          stats.critical++;
        } else if (finding.priority === 'high') {
          stats.high++;
        } else if (finding.priority === 'medium') {
          stats.medium++;
        } else if (finding.priority === 'low') {
          stats.low++;
        }
      });
    }
  });

  return stats;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

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

// =============== FINDING FORM COMPONENT ===============
const FindingForm = ({ 
  finding, 
  index, 
  onChange, 
  onRemove 
}: { 
  finding: InspectionFinding; 
  index: number; 
  onChange: (id: string, field: keyof InspectionFinding, value: InspectionFinding[keyof InspectionFinding]) => void;
  onRemove: (id: string) => void;
}) => {
  return (
    <Card className="mb-4 border border-gray-200">
      <CardHeader className="p-4 pb-2 bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
              {index + 1}
            </span>
            Finding Details
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(finding.id)}>
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Finding Description *</Label>
            <Textarea
              placeholder="Describe the issue or finding..."
              value={finding.finding}
              onChange={(e) => onChange(finding.id, 'finding', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Required Action *</Label>
            <Textarea
              placeholder="What corrective action is required?"
              value={finding.requiredAction}
              onChange={(e) => onChange(finding.id, 'requiredAction', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Assigned To *</Label>
            <Input
              placeholder="Person responsible"
              value={finding.byWho}
              onChange={(e) => onChange(finding.id, 'byWho', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Input
              type="date"
              value={finding.byWhen}
              onChange={(e) => onChange(finding.id, 'byWhen', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Priority *</Label>
            <Select
              value={finding.priority}
              onValueChange={(v) => onChange(finding.id, 'priority', v as PriorityType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map(p => (
                  <SelectItem key={p} value={p}>
                    <span className="capitalize">{p}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Section *</Label>
            <Select
              value={finding.section}
              onValueChange={(v) => onChange(finding.id, 'section', v as SectionType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTIONS.map(s => (
                  <SelectItem key={s} value={s}>
                    {SECTION_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={finding.status}
              onValueChange={(v) => onChange(finding.id, 'status', v as StatusType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => (
                  <SelectItem key={s} value={s}>
                    <span className="capitalize">{s}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Completed Date</Label>
            <Input
              type="date"
              value={finding.completedDate || ''}
              onChange={(e) => onChange(finding.id, 'completedDate', e.target.value)}
              disabled={finding.status !== 'closed'}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Remarks</Label>
            <Textarea
              placeholder="Additional remarks or notes..."
              value={finding.remarks || ''}
              onChange={(e) => onChange(finding.id, 'remarks', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============== INSPECTION FORM MODAL ===============
const InspectionFormModal = ({ 
  open, 
  onClose, 
  onSave, 
  inspection 
}: { 
  open: boolean; 
  onClose: () => void; 
  onSave: (inspection: Partial<SHEQFormData>) => Promise<void>;
  inspection?: SHEQFormData | null;
}) => {
  const [formData, setFormData] = useState<Partial<SHEQFormData>>({
    inspectors: '',
    title: '',
    place: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    department: '',
    section: 'mechanical',
    findings: [],
    hodName: '',
    sheqOfficialName: '',
    status: 'draft',
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (inspection) {
      setFormData({
        ...inspection,
        findings: inspection.findings || []
      });
    } else {
      setFormData({
        inspectors: '',
        title: '',
        place: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        department: '',
        section: 'mechanical',
        findings: [],
        hodName: '',
        sheqOfficialName: '',
        status: 'draft',
      });
    }
    setActiveTab('basic');
  }, [inspection, open]);

  const addFinding = () => {
    const newFinding: InspectionFinding = {
      id: Math.random().toString(36).substr(2, 9),
      finding: '',
      requiredAction: '',
      byWho: '',
      byWhen: '',
      status: 'open',
      priority: 'medium',
      section: formData.section || 'mechanical',
    };
    setFormData(prev => ({
      ...prev,
      findings: [...(prev.findings || []), newFinding]
    }));
  };

  const updateFinding = (id: string, field: keyof InspectionFinding, value: InspectionFinding[keyof InspectionFinding]) => {
    setFormData(prev => ({
      ...prev,
      findings: prev.findings?.map(f => 
        f.id === id ? { ...f, [field]: value } : f
      ) || []
    }));
  };

  const removeFinding = (id: string) => {
    setFormData(prev => ({
      ...prev,
      findings: prev.findings?.filter(f => f.id !== id) || []
    }));
  };

  const validateForm = () => {
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return false;
    }

    if (!formData.inspectors?.trim()) {
      toast.error('Inspector name(s) are required');
      return false;
    }

    if (!formData.place?.trim()) {
      toast.error('Location is required');
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

    // Validate findings if any exist
    if (formData.findings && formData.findings.length > 0) {
      for (let i = 0; i < formData.findings.length; i++) {
        const f = formData.findings[i];
        if (!f.finding?.trim()) {
          toast.error(`Finding #${i + 1}: Description is required`);
          setActiveTab('findings');
          return false;
        }
        if (!f.requiredAction?.trim()) {
          toast.error(`Finding #${i + 1}: Required action is required`);
          setActiveTab('findings');
          return false;
        }
        if (!f.byWho?.trim()) {
          toast.error(`Finding #${i + 1}: Assigned person is required`);
          setActiveTab('findings');
          return false;
        }
        if (!f.byWhen) {
          toast.error(`Finding #${i + 1}: Due date is required`);
          setActiveTab('findings');
          return false;
        }
      }
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            {inspection ? 'Edit Inspection' : 'New Inspection'}
          </DialogTitle>
          <DialogDescription>
            {inspection ? 'Update the inspection details below.' : 'Fill in the inspection details below. Fields marked with * are required.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="findings">Findings ({formData.findings?.length || 0})</TabsTrigger>
              <TabsTrigger value="signoff">Sign-off</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Inspection Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Monthly Safety Audit"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="inspectors">Inspector(s) *</Label>
                  <Input
                    id="inspectors"
                    value={formData.inspectors}
                    onChange={(e) => setFormData({ ...formData, inspectors: e.target.value })}
                    placeholder="John Doe, Jane Smith"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Separate multiple names with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="place"
                      className="pl-9"
                      value={formData.place}
                      onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                      placeholder="e.g., Main Warehouse, Workshop Area"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Operations, Maintenance"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section *</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(v) => setFormData({ ...formData, section: v as SectionType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map(s => (
                        <SelectItem key={s} value={s}>
                          <div className="flex items-center gap-2">
                            {React.createElement(SECTION_ICONS[s], { className: "h-4 w-4" })}
                            {SECTION_LABELS[s]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as SHEQFormData['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* Findings Tab */}
            <TabsContent value="findings" className="space-y-4">
              <div className="space-y-4">
                {formData.findings && formData.findings.length > 0 ? (
                  formData.findings.map((finding, index) => (
                    <FindingForm
                      key={finding.id}
                      finding={finding}
                      index={index}
                      onChange={updateFinding}
                      onRemove={removeFinding}
                    />
                  ))
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No findings added yet</p>
                      <Button type="button" variant="outline" onClick={addFinding}>
                        <Plus className="h-4 w-4 mr-2" /> Add Your First Finding
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                {formData.findings && formData.findings.length > 0 && (
                  <Button type="button" variant="outline" onClick={addFinding} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Another Finding
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* Sign-off Tab */}
            <TabsContent value="signoff" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hodName">Head of Department Name</Label>
                  <Input
                    id="hodName"
                    value={formData.hodName}
                    onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
                    placeholder="e.g., Peter Moyo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sheqOfficialName">SHEQ Official Name</Label>
                  <Input
                    id="sheqOfficialName"
                    value={formData.sheqOfficialName}
                    onChange={(e) => setFormData({ ...formData, sheqOfficialName: e.target.value })}
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Signatures will be captured after submission/approval.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {inspection ? 'Update Inspection' : 'Create Inspection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// =============== INSPECTION CARD COMPONENT ===============
const InspectionCard = ({ 
  inspection, 
  index,
  isExpanded,
  onToggleExpand,
  onView,
  onEdit,
  onDelete
}: { 
  inspection: SHEQFormData;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onView: (inspection: SHEQFormData) => void;
  onEdit: (inspection: SHEQFormData) => void;
  onDelete: (id: string) => void;
}) => {
  const SectionIcon = SECTION_ICONS[inspection.section];
  const openFindings = inspection.findings?.filter(f => f.status !== 'closed').length || 0;
  const closedFindings = inspection.findings?.filter(f => f.status === 'closed').length || 0;
  const criticalFindings = inspection.findings?.filter(f => f.priority === 'critical').length || 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onView(inspection);
  };

  return (
    <Card 
      className="bg-white border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              inspection.section === 'electrical' ? 'bg-yellow-100' : 'bg-blue-100'
            }`}>
              <SectionIcon className={`h-5 w-5 ${
                inspection.section === 'electrical' ? 'text-yellow-700' : 'text-blue-700'
              }`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Inspection #{index + 1}</p>
              <p className="font-medium line-clamp-1">{inspection.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Badge variant={
              inspection.status === 'approved' ? 'default' :
              inspection.status === 'rejected' ? 'destructive' :
              'secondary'
            }>
              {inspection.status}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(inspection.id);
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold">{inspection.findings?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{openFindings}</div>
            <div className="text-xs text-muted-foreground">Open</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{closedFindings}</div>
            <div className="text-xs text-muted-foreground">Closed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{criticalFindings}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-2 text-sm mb-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCircle className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{inspection.inspectors}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{inspection.place}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{formatDate(inspection.date)} at {inspection.time}</span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
            {/* Findings Summary */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Findings ({inspection.findings?.length || 0})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {inspection.findings && inspection.findings.length > 0 ? (
                  inspection.findings.map((finding, idx) => (
                    <div key={finding.id} className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{idx + 1}. {finding.finding}</p>
                          <p className="text-xs text-muted-foreground mt-1">{finding.requiredAction}</p>
                        </div>
                        <Badge className={PRIORITY_COLORS[finding.priority]}>
                          {finding.priority}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="truncate">
                          <span className="text-muted-foreground">By:</span> {finding.byWho}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Due:</span> {formatDate(finding.byWhen)}
                        </div>
                        <div>
                          <Badge className={STATUS_COLORS[finding.status]}>
                            {finding.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No findings recorded</p>
                )}
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">HOD</p>
                <p className="font-medium">{inspection.hodName || 'Pending'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SHEQ Official</p>
                <p className="font-medium">{inspection.sheqOfficialName || 'Pending'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onView(inspection)}>
                <Eye className="h-3 w-3 mr-1" /> View
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(inspection)}>
                <Pencil className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-destructive" onClick={() => onDelete(inspection.id)}>
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =============== INSPECTION DETAIL MODAL ===============
const InspectionDetailModal = ({ 
  inspection, 
  open, 
  onClose,
  onEdit
}: { 
  inspection: SHEQFormData | null; 
  open: boolean; 
  onClose: () => void;
  onEdit: (inspection: SHEQFormData) => void;
}) => {
  if (!inspection) return null;

  const SectionIcon = SECTION_ICONS[inspection.section];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            Inspection Report
          </DialogTitle>
          <DialogDescription>
            {inspection.title} - {formatDate(inspection.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Inspectors</p>
              <p className="font-medium">{inspection.inspectors}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{inspection.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{inspection.place}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{formatDate(inspection.date)} at {inspection.time}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Section</p>
              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                <SectionIcon className="h-3 w-3" />
                {SECTION_LABELS[inspection.section]}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={
                inspection.status === 'approved' ? 'default' :
                inspection.status === 'rejected' ? 'destructive' :
                'secondary'
              }>
                {inspection.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Findings */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Findings & Actions ({inspection.findings?.length || 0})
            </h3>
            {inspection.findings && inspection.findings.length > 0 ? (
              <div className="space-y-3">
                {inspection.findings.map((finding, idx) => (
                  <Card key={finding.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">Finding #{idx + 1}</h4>
                        <div className="flex gap-2">
                          <Badge className={PRIORITY_COLORS[finding.priority]}>
                            {finding.priority}
                          </Badge>
                          <Badge className={STATUS_COLORS[finding.status]}>
                            {finding.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="text-muted-foreground">Issue:</span> {finding.finding}</p>
                        <p className="text-sm"><span className="text-muted-foreground">Action:</span> {finding.requiredAction}</p>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <p><span className="text-muted-foreground">By:</span> {finding.byWho}</p>
                          <p><span className="text-muted-foreground">Due:</span> {formatDate(finding.byWhen)}</p>
                          {finding.completedDate && (
                            <p><span className="text-muted-foreground">Completed:</span> {formatDate(finding.completedDate)}</p>
                          )}
                        </div>
                        {finding.remarks && (
                          <p className="text-sm"><span className="text-muted-foreground">Remarks:</span> {finding.remarks}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No findings recorded for this inspection.</p>
            )}
          </div>

          <Separator />

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Head of Department</p>
              <div className="border-2 rounded-lg p-4 text-center">
                {inspection.hodSignature ? (
                  <img src={inspection.hodSignature} alt="HOD Signature" className="max-h-16 mx-auto" />
                ) : (
                  <p className="text-muted-foreground italic">{inspection.hodName || 'Not signed'}</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">SHEQ Official</p>
              <div className="border-2 rounded-lg p-4 text-center">
                {inspection.sheqSignature ? (
                  <img src={inspection.sheqSignature} alt="SHEQ Signature" className="max-h-16 mx-auto" />
                ) : (
                  <p className="text-muted-foreground italic">{inspection.sheqOfficialName || 'Not signed'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => {
            onClose();
            onEdit(inspection);
          }}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =============== MAIN PAGE ===============
export default function SHEQInspectionPage() {
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState<SHEQFormData[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedInspection, setSelectedInspection] = useState<SHEQFormData | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<SHEQFormData | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInspector, setSelectedInspector] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  
  // Stats
  const stats = useMemo(() => calculateStats(inspections), [inspections]);

  // Load inspections
  const loadInspections = async () => {
    setLoading(true);
    try {
      const data = await getInspections();
      setInspections(data);
    } catch (error) {
      console.error('Failed to load inspections:', error);
      toast.error('Failed to load inspections');
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadInspections();
  }, []);

  // Filter inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter(inspection => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        inspection.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.inspectors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.place?.toLowerCase().includes(searchTerm.toLowerCase());

      // Inspector filter
      const matchesInspector = selectedInspector === 'all' ||
        inspection.inspectors?.includes(selectedInspector);

      // Section filter
      const matchesSection = selectedSection === 'all' ||
        inspection.section === selectedSection;

      // Status filter
      const matchesStatus = selectedStatus === 'all' ||
        inspection.status === selectedStatus;

      // Date range filter
      let matchesDate = true;
      if (dateRange.from && dateRange.to && inspection.date) {
        const inspectionDate = new Date(inspection.date);
        matchesDate = inspectionDate >= dateRange.from && inspectionDate <= dateRange.to;
      }

      return matchesSearch && matchesInspector && matchesSection && matchesStatus && matchesDate;
    });
  }, [inspections, searchTerm, selectedInspector, selectedSection, selectedStatus, dateRange]);

  // Get unique inspectors for filter
  const uniqueInspectors = useMemo(() => {
    const inspectors = new Set<string>();
    inspections.forEach(inspection => {
      if (inspection.inspectors) {
        inspection.inspectors.split(',').forEach(i => {
          const trimmed = i.trim();
          if (trimmed) inspectors.add(trimmed);
        });
      }
    });
    return Array.from(inspectors);
  }, [inspections]);

  // Toggle expanded
  const toggleExpanded = (id: string) => {
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

  // Expand all
  const expandAll = () => {
    setExpandedItems(new Set(inspections.map(i => i.id)));
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedInspector('all');
    setSelectedSection('all');
    setSelectedStatus('all');
    setDateRange({ from: null, to: null });
  };

  // Handle save (create/update)
  const handleSave = async (formData: Partial<SHEQFormData>) => {
    try {
      if (editingInspection) {
        // Update existing
        const updated = await updateInspection(editingInspection.id, formData);
        setInspections(prev => prev.map(i => i.id === updated.id ? updated : i));
        toast.success('Inspection updated successfully');
      } else {
        // Create new
        const created = await createInspection(formData);
        setInspections(prev => [created, ...prev]);
        toast.success('Inspection created successfully');
      }
      setFormModalOpen(false);
      setEditingInspection(null);
    } catch (error) {
      console.error('Failed to save inspection:', error);
      toast.error('Failed to save inspection');
      throw error;
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this inspection?')) {
      try {
        await deleteInspection(id);
        setInspections(prev => prev.filter(i => i.id !== id));
        toast.success('Inspection deleted successfully');
      } catch (error) {
        console.error('Failed to delete inspection:', error);
        toast.error('Failed to delete inspection');
      }
    }
  };

  // Handle view
  const handleView = (inspection: SHEQFormData) => {
    setSelectedInspection(inspection);
    setDetailModalOpen(true);
  };

  // Handle edit
  const handleEdit = (inspection: SHEQFormData) => {
    setEditingInspection(inspection);
    setFormModalOpen(true);
  };

  // Handle new
  const handleNew = () => {
    setEditingInspection(null);
    setFormModalOpen(true);
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
              <span className="text-[#2A4D69] font-medium">SHEQ Inspections</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#2A4D69] font-heading tracking-tight">SHEQ Inspections</h1>
            <p className="text-[#6B7B8E] mt-1">Safety, Health, Environment, and Quality compliance tracking.</p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-[#2A4D69] text-white' : ''}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-[#2A4D69] text-white' : ''}>
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button onClick={handleNew} className="bg-[#2A4D69] hover:bg-[#1e3a52] text-white shadow-md">
              <Plus className="h-4 w-4 mr-2" /> New Inspection
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 text-center">
              <ClipboardCheck className="h-5 w-5 text-purple-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-yellow-200">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-5 w-5 text-yellow-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
              <p className="text-xs text-gray-500">Open</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-blue-200">
            <CardContent className="p-4 text-center">
              <Clock3 className="h-5 w-5 text-blue-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-5 w-5 text-green-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.closed}</p>
              <p className="text-xs text-gray-500">Closed</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-red-200">
            <CardContent className="p-4 text-center">
              <XCircle className="h-5 w-5 text-red-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              <p className="text-xs text-gray-500">Overdue</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-red-300">
            <CardContent className="p-4 text-center">
              <Target className="h-5 w-5 text-red-800 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
              <p className="text-xs text-gray-500">Critical</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-blue-200">
            <CardContent className="p-4 text-center">
              <Wrench className="h-5 w-5 text-blue-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.bySection.mechanical || 0}</p>
              <p className="text-xs text-gray-500">Mechanical</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-yellow-200">
            <CardContent className="p-4 text-center">
              <Zap className="h-5 w-5 text-yellow-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.bySection.electrical || 0}</p>
              <p className="text-xs text-gray-500">Electrical</p>
            </CardContent>
          </Card>
        </div>

        {/* Search bar — always visible */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7B8E]" />
            <Input
              placeholder="Search inspections by title, inspector, location…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7B8E] hover:text-[#2A4D69]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={expandAll} title="Expand all inspection rows">
              <Maximize2 className="h-4 w-4 mr-1.5" />Expand all
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll} title="Collapse all inspection rows">
              <Minimize2 className="h-4 w-4 mr-1.5" />Collapse all
            </Button>
          </div>
        </div>

        {/* Filters — collapsed by default */}
        <CollapsibleSection
          title="Filters"
          description="Narrow inspections by inspector, section, status, or date range"
          badge={
            (selectedInspector !== 'all' || selectedSection !== 'all' || selectedStatus !== 'all' || dateRange.from) ? (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2A4D69] text-[10px] font-bold text-white">
                {[selectedInspector !== 'all', selectedSection !== 'all', selectedStatus !== 'all', !!dateRange.from].filter(Boolean).length}
              </span>
            ) : null
          }
        >
          <div className="flex flex-wrap gap-3">
            {/* Inspector Filter */}
            <Select value={selectedInspector} onValueChange={setSelectedInspector}>
              <SelectTrigger className="w-[180px] bg-[#F0F5F9]">
                <SelectValue placeholder="All Inspectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Inspectors</SelectItem>
                {uniqueInspectors.map(inspector => (
                  <SelectItem key={inspector} value={inspector}>{inspector}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Section Filter */}
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-[160px] bg-[#F0F5F9]">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {SECTIONS.map(section => (
                  <SelectItem key={section} value={section}>{SECTION_LABELS[section]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px] bg-[#F0F5F9]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[130px] bg-[#F0F5F9]" title="Filter by start date">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dateRange.from ? format(dateRange.from, 'LLL dd, y') : 'From date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateRange.from || undefined}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, from: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[130px] bg-[#F0F5F9]" title="Filter by end date">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dateRange.to ? format(dateRange.to, 'LLL dd, y') : 'To date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateRange.to || undefined}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, to: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            {(selectedInspector !== 'all' || selectedSection !== 'all' || selectedStatus !== 'all' || dateRange.from) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[#6B7B8E] hover:text-[#2A4D69]">
                <X className="h-4 w-4 mr-1.5" />Clear filters
              </Button>
            )}
          </div>
        </CollapsibleSection>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Inspections Grid/List */}
        {!loading && filteredInspections.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">No inspections found</p>
              <Button onClick={handleNew} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Create Your First Inspection
              </Button>
            </CardContent>
          </Card>
        ) : !loading && viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInspections.map((inspection, index) => (
              <InspectionCard
                key={inspection.id}
                inspection={inspection}
                index={index}
                isExpanded={expandedItems.has(inspection.id)}
                onToggleExpand={toggleExpanded}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : !loading && viewMode === 'list' ? (
          /* List View */
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100 dark:bg-slate-800">
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Inspectors</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Findings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInspections.map((inspection) => (
                    <React.Fragment key={inspection.id}>
                      <TableRow 
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                        onClick={() => handleView(inspection)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(inspection.id);
                            }}
                          >
                            {expandedItems.has(inspection.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{inspection.title}</TableCell>
                        <TableCell>{inspection.inspectors}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {React.createElement(SECTION_ICONS[inspection.section], { className: "h-3 w-3" })}
                            {SECTION_LABELS[inspection.section]}
                          </Badge>
                        </TableCell>
                        <TableCell>{inspection.place}</TableCell>
                        <TableCell>{formatDate(inspection.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{inspection.findings?.length || 0}</span>
                            <span className="text-xs text-muted-foreground">
                              ({inspection.findings?.filter(f => f.status === 'closed').length || 0} closed)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            inspection.status === 'approved' ? 'default' :
                            inspection.status === 'rejected' ? 'destructive' :
                            'secondary'
                          }>
                            {inspection.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" onClick={() => handleView(inspection)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(inspection)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(inspection.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedItems.has(inspection.id) && (
                        <TableRow className="bg-slate-50 dark:bg-slate-800/30">
                          <TableCell colSpan={9} className="p-4">
                            <div className="space-y-3">
                              <h4 className="font-medium">Findings:</h4>
                              {inspection.findings && inspection.findings.length > 0 ? (
                                inspection.findings.map((finding, idx) => (
                                  <div key={finding.id} className="border-l-4 border-primary pl-3">
                                    <p className="font-medium">#{idx + 1}: {finding.finding}</p>
                                    <p className="text-sm text-muted-foreground">Action: {finding.requiredAction}</p>
                                    <div className="flex gap-4 text-xs mt-1">
                                      <span>By: {finding.byWho}</span>
                                      <span>Due: {formatDate(finding.byWhen)}</span>
                                      <Badge className={PRIORITY_COLORS[finding.priority]}>
                                        {finding.priority}
                                      </Badge>
                                      <Badge className={STATUS_COLORS[finding.status]}>
                                        {finding.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No findings recorded</p>
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
          </Card>
        ) : null}

      {/* Form Modal */}
      <InspectionFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingInspection(null);
        }}
        onSave={handleSave}
        inspection={editingInspection}
      />

      {/* Detail Modal */}
      <InspectionDetailModal
        inspection={selectedInspection}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onEdit={handleEdit}
      />
      </main>
    </PageShell>
  );
}