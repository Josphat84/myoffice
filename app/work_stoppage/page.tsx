'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Octagon, Send, Search, FilterX, BarChart3,
  Calendar, Clock, AlertCircle, Building2, User,
  ClipboardList, ShieldAlert, Plus, Trash2, CheckCircle2,
  Eye, Pencil, ChevronDown, ChevronUp, Loader2,
  Users, FileText, MapPin, RefreshCw, X, CheckCircle,
  Clock3, AlertTriangle, Info, Award, Target, TrendingUp,
  LayoutGrid, Table as TableIcon, Maximize2, Minimize2,
  Download, HardHat, Wrench, Zap, Droplets, Flame, Shield,
  Settings, Star, Gauge, Activity, Flag, AlertOctagon,
  CircleDot, Circle, CircleCheck, CircleEllipsis, CircleOff,
  CalendarRange, UserCircle, Filter, PieChart, ChevronsDown, ChevronsUp,
  MoreHorizontal, MoreVertical, RotateCcw, CheckCircle as CheckCircleSolid,
  XCircle, PlayCircle, PauseCircle, ChevronRight
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { CollapsibleSection } from '@/components/CollapsibleSection';

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============== TYPES ===============
type SectionType = 'Mechanical' | 'Electrical' | 'General';
type StatusType = 'Pending' | 'In Progress' | 'Completed';

// Type guard for StatusType
const isValidStatus = (status: string): status is StatusType => {
  return ['Pending', 'In Progress', 'Completed'].includes(status);
};

interface CorrectiveAction {
  id: string;
  finding: string;
  action: string;
  byWho: string;
  byWhen: string;
  status: StatusType;
  completedDate?: string;
  remarks?: string;
}

interface WorkStoppageReport {
  id: string;
  date: string;
  department: string;
  section: SectionType;
  description: string;
  investigationFindings: string;
  stoppageBy: string;
  stoppagePosition: string;
  acceptedBy: string;
  sheqCheckedBy: string;
  correctiveActions: CorrectiveAction[];
  submittedAt: string;
}

interface WorkStoppageStats {
  total: number;
  bySection: Record<SectionType, number>;
  byInspector: Record<string, number>;
  pendingActions: number;
  inProgressActions: number;
  completedActions: number;
  criticalFindings: number;
  avgCompletionTime?: number;
  complianceRate?: number;
}

// =============== CONSTANTS ===============
const SECTIONS: SectionType[] = ['Mechanical', 'Electrical', 'General'];

const SECTION_COLORS: Record<SectionType, string> = {
  Mechanical: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  Electrical: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  General: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
};

const SECTION_ICONS: Record<SectionType, React.ElementType> = {
  Mechanical: Wrench,
  Electrical: Zap,
  General: Building2
};

const STATUS_COLORS: Record<StatusType, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  'Completed': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
};

const STATUS_ICONS: Record<StatusType, React.ElementType> = {
  'Pending': AlertCircle,
  'In Progress': Clock3,
  'Completed': CheckCircle
};

const STATUS_ACTIONS: Record<StatusType, { next: StatusType; icon: React.ElementType; label: string }> = {
  'Pending': { next: 'In Progress', icon: PlayCircle, label: 'Start Progress' },
  'In Progress': { next: 'Completed', icon: CheckCircleSolid, label: 'Complete' },
  'Completed': { next: 'Pending', icon: RotateCcw, label: 'Reopen' }
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

async function getDepartmentSuggestions(search: string = ''): Promise<string[]> {
  try {
    const data = await fetchAPI<string[]>(`/api/work-stoppage/suggestions/departments?search=${encodeURIComponent(search)}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching department suggestions:', error);
    return [];
  }
}

async function getInspectorSuggestions(search: string = ''): Promise<string[]> {
  try {
    const data = await fetchAPI<string[]>(`/api/work-stoppage/suggestions/inspectors?search=${encodeURIComponent(search)}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching inspector suggestions:', error);
    return [];
  }
}

async function getReports(params?: {
  search?: string;
  section?: string;
  inspector?: string;
  from_date?: string;
  to_date?: string;
}): Promise<WorkStoppageReport[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.section) queryParams.append('section', params.section);
  if (params?.inspector) queryParams.append('inspector', params.inspector);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);

  try {
    const data = await fetchAPI<WorkStoppageReport[]>(`/api/work-stoppage/?${queryParams.toString()}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}

async function getReport(id: string): Promise<WorkStoppageReport | null> {
  try {
    return await fetchAPI<WorkStoppageReport>(`/api/work-stoppage/${id}`);
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}

async function createReport(report: Partial<WorkStoppageReport>): Promise<WorkStoppageReport | null> {
  try {
    return await fetchAPI<WorkStoppageReport>('/api/work-stoppage/', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return null;
  }
}

async function updateReport(id: string, report: Partial<WorkStoppageReport>): Promise<WorkStoppageReport | null> {
  try {
    return await fetchAPI<WorkStoppageReport>(`/api/work-stoppage/${id}`, {
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
    await fetchAPI(`/api/work-stoppage/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
}

async function getStats(): Promise<WorkStoppageStats> {
  try {
    const data = await fetchAPI<any>('/api/work-stoppage/stats/overview');
    return {
      total: data?.total || 0,
      bySection: data?.bySection || { Mechanical: 0, Electrical: 0, General: 0 },
      byInspector: data?.byInspector || {},
      pendingActions: data?.pendingActions || 0,
      inProgressActions: data?.inProgressActions || 0,
      completedActions: data?.completedActions || 0,
      criticalFindings: data?.criticalFindings || 0,
      avgCompletionTime: data?.avgCompletionTime || 0,
      complianceRate: data?.complianceRate || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      bySection: { Mechanical: 0, Electrical: 0, General: 0 },
      byInspector: {},
      pendingActions: 0,
      inProgressActions: 0,
      completedActions: 0,
      criticalFindings: 0
    };
  }
}

// =============== HELPER FUNCTIONS ===============
const formatDate = (dateStr: string): string => {
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

const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const calculateStats = (reports: WorkStoppageReport[]): WorkStoppageStats => {
  const stats: WorkStoppageStats = {
    total: reports.length,
    bySection: { Mechanical: 0, Electrical: 0, General: 0 },
    byInspector: {},
    pendingActions: 0,
    inProgressActions: 0,
    completedActions: 0,
    criticalFindings: 0
  };

  reports.forEach(report => {
    // Count by section
    if (report.section) {
      stats.bySection[report.section]++;
    }

    // Count by inspector
    if (report.stoppageBy) {
      const inspector = report.stoppageBy.trim();
      if (inspector) {
        stats.byInspector[inspector] = (stats.byInspector[inspector] || 0) + 1;
      }
    }

    // Count actions by status
    if (report.correctiveActions?.length) {
      report.correctiveActions.forEach(action => {
        if (action.status === 'Pending') stats.pendingActions++;
        else if (action.status === 'In Progress') stats.inProgressActions++;
        else if (action.status === 'Completed') stats.completedActions++;
      });
    }
  });

  return stats;
};

// =============== AUTO-COMPLETE INPUT COMPONENT ===============
interface AutoCompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  fetchSuggestions: (search: string) => Promise<string[]>;
  className?: string;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  label,
  required,
  icon,
  fetchSuggestions,
  className
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (value.length < 1) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const results = await fetchSuggestions(value);
        setSuggestions(results);
      } catch (error) {
        console.error('Error loading suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {label && (
        <Label className="text-xs mb-1 block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`${icon ? 'pl-9' : ''} ${className || ''}`}
          required={required}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
              onClick={() => {
                onSelect(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============== ACTION FORM COMPONENT ===============
interface ActionFormProps {
  action: CorrectiveAction;
  index: number;
  onChange: (id: string, field: keyof CorrectiveAction, value: CorrectiveAction[keyof CorrectiveAction]) => void;
  onRemove: (id: string) => void;
  onStatusChange?: (id: string, newStatus: StatusType) => void;
}

const ActionForm: React.FC<ActionFormProps> = ({
  action,
  index,
  onChange,
  onRemove,
  onStatusChange
}) => {
  const StatusIcon = STATUS_ICONS[action.status];
  const statusAction = STATUS_ACTIONS[action.status];
  const NextIcon = statusAction.icon;

  const handleStatusChange = (newStatus: StatusType) => {
    const updatedAction = { ...action, status: newStatus };
    if (newStatus === 'Completed' && !action.completedDate) {
      updatedAction.completedDate = new Date().toISOString().split('T')[0];
    }
    onChange(action.id, 'status', newStatus);
    if (newStatus === 'Completed' && !action.completedDate) {
      onChange(action.id, 'completedDate', new Date().toISOString().split('T')[0]);
    }
    onStatusChange?.(action.id, newStatus);
  };

  return (
    <Card className="mb-4 border border-gray-200 overflow-hidden">
      <div className={`h-1 w-full ${
        action.status === 'Completed' ? 'bg-green-500' :
        action.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
      }`} />
      <CardHeader className="p-4 pb-2 bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
              {index + 1}
            </span>
            Corrective Action
          </CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1">
                  <StatusIcon className="h-3.5 w-3.5" />
                  <span>{action.status}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(STATUS_ACTIONS) as StatusType[]).map((status) => {
                  const Icon = STATUS_ICONS[status];
                  return (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={action.status === status ? 'bg-accent' : ''}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {status}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(action.id)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Finding Description *</Label>
            <Textarea
              placeholder="Describe the finding or issue that needs correction..."
              value={action.finding}
              onChange={(e) => onChange(action.id, 'finding', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Corrective Action *</Label>
            <Textarea
              placeholder="What action needs to be taken to address this finding?"
              value={action.action}
              onChange={(e) => onChange(action.id, 'action', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Assigned To *</Label>
            <Input
              placeholder="Person responsible"
              value={action.byWho}
              onChange={(e) => onChange(action.id, 'byWho', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Input
              type="date"
              value={action.byWhen}
              onChange={(e) => onChange(action.id, 'byWhen', e.target.value)}
            />
          </div>
          {action.status === 'Completed' && (
            <div className="space-y-2">
              <Label>Completed Date</Label>
              <Input
                type="date"
                value={action.completedDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => onChange(action.id, 'completedDate', e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2 md:col-span-2">
            <Label>Remarks</Label>
            <Textarea
              placeholder="Additional notes or remarks..."
              value={action.remarks || ''}
              onChange={(e) => onChange(action.id, 'remarks', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============== REPORT FORM MODAL ===============
interface ReportFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (report: Partial<WorkStoppageReport>) => Promise<void>;
  report?: WorkStoppageReport | null;
}

const ReportFormModal: React.FC<ReportFormModalProps> = ({
  open,
  onClose,
  onSave,
  report
}) => {
  const [formData, setFormData] = useState<Partial<WorkStoppageReport>>({
    date: new Date().toISOString().split('T')[0],
    department: "",
    section: "General",
    description: "",
    investigationFindings: "",
    stoppageBy: "",
    stoppagePosition: "",
    acceptedBy: "",
    sheqCheckedBy: "",
    correctiveActions: []
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (report) {
      setFormData({
        date: report.date,
        department: report.department,
        section: report.section,
        description: report.description,
        investigationFindings: report.investigationFindings || "",
        stoppageBy: report.stoppageBy,
        stoppagePosition: report.stoppagePosition || "",
        acceptedBy: report.acceptedBy || "",
        sheqCheckedBy: report.sheqCheckedBy || "",
        correctiveActions: report.correctiveActions || []
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        department: "",
        section: "General",
        description: "",
        investigationFindings: "",
        stoppageBy: "",
        stoppagePosition: "",
        acceptedBy: "",
        sheqCheckedBy: "",
        correctiveActions: []
      });
    }
    setActiveTab('details');
  }, [report, open]);

  const addAction = () => {
    const newAction: CorrectiveAction = {
      id: Math.random().toString(36).substr(2, 9),
      finding: '',
      action: '',
      byWho: '',
      byWhen: '',
      status: 'Pending'
    };
    setFormData(prev => ({
      ...prev,
      correctiveActions: [...(prev.correctiveActions || []), newAction]
    }));
  };

  const updateAction = (id: string, field: keyof CorrectiveAction, value: CorrectiveAction[keyof CorrectiveAction]) => {
    setFormData(prev => ({
      ...prev,
      correctiveActions: prev.correctiveActions?.map(a =>
        a.id === id ? { ...a, [field]: value } : a
      ) || []
    }));
  };

  const removeAction = (id: string) => {
    setFormData(prev => ({
      ...prev,
      correctiveActions: prev.correctiveActions?.filter(a => a.id !== id) || []
    }));
  };

  const handleStatusChange = (id: string, newStatus: StatusType) => {
    updateAction(id, 'status', newStatus);
    if (newStatus === 'Completed') {
      updateAction(id, 'completedDate', new Date().toISOString().split('T')[0]);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.department?.trim()) {
      toast.error('Department is required');
      setActiveTab('details');
      return false;
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required');
      setActiveTab('details');
      return false;
    }
    if (!formData.stoppageBy?.trim()) {
      toast.error('Stoppage by name is required');
      setActiveTab('details');
      return false;
    }
    if (!formData.date) {
      toast.error('Date is required');
      setActiveTab('details');
      return false;
    }

    // Validate corrective actions if any exist
    if (formData.correctiveActions?.length) {
      for (let i = 0; i < formData.correctiveActions.length; i++) {
        const action = formData.correctiveActions[i];
        if (!action.finding?.trim()) {
          toast.error(`Action #${i + 1}: Finding is required`);
          setActiveTab('actions');
          return false;
        }
        if (!action.action?.trim()) {
          toast.error(`Action #${i + 1}: Corrective action is required`);
          setActiveTab('actions');
          return false;
        }
        if (!action.byWho?.trim()) {
          toast.error(`Action #${i + 1}: Assigned person is required`);
          setActiveTab('actions');
          return false;
        }
        if (!action.byWhen) {
          toast.error(`Action #${i + 1}: Due date is required`);
          setActiveTab('actions');
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

  const pendingCount = formData.correctiveActions?.filter(a => a.status === 'Pending').length || 0;
  const inProgressCount = formData.correctiveActions?.filter(a => a.status === 'In Progress').length || 0;
  const completedCount = formData.correctiveActions?.filter(a => a.status === 'Completed').length || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Octagon className="h-6 w-6 text-destructive" />
            {report ? 'Edit Work Stoppage' : 'New Work Stoppage'}
          </DialogTitle>
          <DialogDescription>
            {report ? 'Update the work stoppage details below.' : 'Document unsafe SHEQ acts, practices, or behaviors.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Incident Details</TabsTrigger>
              <TabsTrigger value="actions">
                Action Plan ({formData.correctiveActions?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertOctagon className="h-5 w-5 text-destructive" />
                    Incident Information
                  </CardTitle>
                  <CardDescription>
                    Enter the details of the unsafe act or practice.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        required
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Section *</Label>
                    <Select
                      value={formData.section}
                      onValueChange={(val: SectionType) => setFormData({...formData, section: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTIONS.map(section => {
                          const Icon = SECTION_ICONS[section];
                          return (
                            <SelectItem key={section} value={section}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {section}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <AutoCompleteInput
                      label="Department *"
                      value={formData.department || ''}
                      onChange={(val) => setFormData({...formData, department: val})}
                      onSelect={(val) => setFormData({...formData, department: val})}
                      placeholder="e.g., Production, Maintenance, Operations"
                      required
                      icon={<Building2 className="h-4 w-4" />}
                      fetchSuggestions={getDepartmentSuggestions}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Description of Unsafe Act/Practice & Potential Impact *</Label>
                    <Textarea
                      className="min-h-[120px]"
                      placeholder="Describe the unsafe condition, what happened, and what could have happened..."
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Investigation Findings</Label>
                    <Textarea
                      placeholder="Initial findings from the investigation..."
                      value={formData.investigationFindings}
                      onChange={e => setFormData({...formData, investigationFindings: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Personnel
                  </CardTitle>
                  <CardDescription>
                    Who issued the stoppage and who acknowledged it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <AutoCompleteInput
                      label="Stoppage Issued By *"
                      value={formData.stoppageBy || ''}
                      onChange={(val) => setFormData({...formData, stoppageBy: val})}
                      onSelect={(val) => setFormData({...formData, stoppageBy: val})}
                      placeholder="Name of person issuing stoppage"
                      required
                      icon={<User className="h-4 w-4" />}
                      fetchSuggestions={getInspectorSuggestions}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      placeholder="e.g., Safety Officer, Supervisor"
                      value={formData.stoppagePosition}
                      onChange={e => setFormData({...formData, stoppagePosition: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Accepted By</Label>
                    <Input
                      placeholder="Name & position of person accepting"
                      value={formData.acceptedBy}
                      onChange={e => setFormData({...formData, acceptedBy: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SHEQ Checked By</Label>
                    <Input
                      placeholder="Name & position of SHEQ representative"
                      value={formData.sheqCheckedBy}
                      onChange={e => setFormData({...formData, sheqCheckedBy: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Corrective Action Plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Define the actions needed to address the findings.
                  </p>
                </div>
                <Button type="button" onClick={addAction}>
                  <Plus className="h-4 w-4 mr-2" /> Add Action
                </Button>
              </div>

              <div className="space-y-4">
                {formData.correctiveActions && formData.correctiveActions.length > 0 ? (
                  formData.correctiveActions.map((action, index) => (
                    <ActionForm
                      key={action.id}
                      action={action}
                      index={index}
                      onChange={updateAction}
                      onRemove={removeAction}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No corrective actions added yet</p>
                      <Button type="button" variant="outline" onClick={addAction}>
                        <Plus className="h-4 w-4 mr-2" /> Add Your First Action
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {formData.correctiveActions && formData.correctiveActions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">About Corrective Actions</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Each action should be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.
                        Assign clear responsibilities and realistic due dates.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Action Plan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">
                        {formData.correctiveActions?.length ? 
                          Math.round((completedCount / formData.correctiveActions.length) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={formData.correctiveActions?.length ? 
                        (completedCount / formData.correctiveActions.length) * 100 : 0} 
                      className="h-2"
                    />
                  </div>

                  {formData.correctiveActions && formData.correctiveActions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Action Items</h4>
                      <ScrollArea className="h-48">
                        {formData.correctiveActions.map((action, idx) => {
                          const StatusIcon = STATUS_ICONS[action.status];
                          return (
                            <div key={action.id} className="flex items-center gap-3 p-2 border-b last:border-0">
                              <StatusIcon className={`h-4 w-4 ${
                                action.status === 'Completed' ? 'text-green-500' :
                                action.status === 'In Progress' ? 'text-blue-500' : 'text-yellow-500'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-1">{action.finding}</p>
                                <p className="text-xs text-muted-foreground">Due: {formatDate(action.byWhen)}</p>
                              </div>
                              <Badge variant="secondary" className={STATUS_COLORS[action.status]}>
                                {action.status}
                              </Badge>
                            </div>
                          );
                        })}
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {report ? 'Update Stoppage' : 'Issue Work Stoppage'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// =============== REPORT DETAIL MODAL ===============
interface ReportDetailModalProps {
  report: WorkStoppageReport | null;
  open: boolean;
  onClose: () => void;
  onEdit: (report: WorkStoppageReport) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (actionId: string, newStatus: StatusType) => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  open,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  if (!report) return null;

  const SectionIcon = SECTION_ICONS[report.section];
  const pendingActions = report.correctiveActions?.filter(a => a.status !== 'Completed').length || 0;
  const completedActions = report.correctiveActions?.filter(a => a.status === 'Completed').length || 0;
  const progress = report.correctiveActions?.length ? 
    Math.round((completedActions / report.correctiveActions.length) * 100) : 0;

  const handleStatusChange = (actionId: string, newStatus: StatusType) => {
    onStatusChange?.(actionId, newStatus);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Octagon className="h-6 w-6 text-destructive" />
            Work Stoppage Report
          </DialogTitle>
          <DialogDescription>
            Issued on {formatDateTime(report.submittedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline" className="border-destructive/20 bg-destructive/5 text-destructive">
                <Octagon className="h-3 w-3 mr-1" /> Stoppage
              </Badge>
              <Badge variant="outline" className={SECTION_COLORS[report.section]}>
                <SectionIcon className="h-3 w-3 mr-1" />
                {report.section}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              ID: {report.id.slice(0, 8)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Corrective Action Progress</span>
              <span className="text-muted-foreground">{completedActions}/{report.correctiveActions?.length || 0} completed ({progress}%)</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="font-medium truncate" title={report.department}>{report.department}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(report.date)}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Issued By</p>
              <p className="font-medium">{report.stoppageBy}</p>
              {report.stoppagePosition && (
                <p className="text-xs text-muted-foreground truncate">{report.stoppagePosition}</p>
              )}
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Actions</p>
              <div className="flex gap-1 mt-1">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {pendingActions}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {completedActions}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Unsafe Act/Practice & Potential Impact
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{report.description}</p>
            </div>
          </div>

          {/* Investigation Findings */}
          {report.investigationFindings && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Investigation Findings
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{report.investigationFindings}</p>
                </div>
              </div>
            </>
          )}

          {/* Corrective Actions */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Corrective Action Plan ({report.correctiveActions?.length || 0})
            </h3>
            <div className="space-y-3">
              {report.correctiveActions?.map((action, idx) => {
                const StatusIcon = STATUS_ICONS[action.status];
                const statusAction = STATUS_ACTIONS[action.status];
                const NextIcon = statusAction.icon;

                return (
                  <Card key={action.id} className="overflow-hidden">
                    <div className={`h-1 w-full ${
                      action.status === 'Completed' ? 'bg-green-500' :
                      action.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">Action #{idx + 1}</h4>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 gap-1">
                                <StatusIcon className="h-3.5 w-3.5" />
                                <span>{action.status}</span>
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {(Object.keys(STATUS_ACTIONS) as StatusType[]).map((status) => {
                                const Icon = STATUS_ICONS[status];
                                return (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() => handleStatusChange(action.id, status)}
                                    className={action.status === status ? 'bg-accent' : ''}
                                  >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {status}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="text-muted-foreground">Finding:</span> {action.finding}</p>
                        <p className="text-sm"><span className="text-muted-foreground">Action:</span> {action.action}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p><span className="text-muted-foreground">By:</span> {action.byWho}</p>
                          <p><span className="text-muted-foreground">Due:</span> {formatDate(action.byWhen)}</p>
                          {action.completedDate && (
                            <p className="col-span-2"><span className="text-muted-foreground">Completed:</span> {formatDate(action.completedDate)}</p>
                          )}
                        </div>
                        {action.remarks && (
                          <p className="text-sm"><span className="text-muted-foreground">Remarks:</span> {action.remarks}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Signatories */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Stoppage By</p>
              <p className="font-medium">{report.stoppageBy}</p>
              {report.stoppagePosition && (
                <p className="text-xs text-muted-foreground">{report.stoppagePosition}</p>
              )}
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Accepted By</p>
              <p className="font-medium">{report.acceptedBy || 'Not specified'}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">SHEQ Checked By</p>
              <p className="font-medium">{report.sheqCheckedBy || 'Not specified'}</p>
            </div>
          </div>
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

// =============== REPORT CARD COMPONENT ===============
interface ReportCardProps {
  report: WorkStoppageReport;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onView: (report: WorkStoppageReport) => void;
  onEdit: (report: WorkStoppageReport) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (reportId: string, actionId: string, newStatus: StatusType) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  index,
  isExpanded,
  onToggleExpand,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const SectionIcon = SECTION_ICONS[report.section];
  const pendingActions = report.correctiveActions?.filter(a => a.status !== 'Completed').length || 0;
  const completedActions = report.correctiveActions?.filter(a => a.status === 'Completed').length || 0;
  const totalActions = report.correctiveActions?.length || 0;
  const progress = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onView(report);
  };

  const handleActionStatusChange = (actionId: string, newStatus: StatusType) => {
    onStatusChange?.(report.id, actionId, newStatus);
  };

  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer group border-muted"
      onClick={handleCardClick}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <SectionIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stoppage #{index + 1}</p>
              <p className="font-semibold text-base line-clamp-1">{report.department}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <SectionIcon className="h-3 w-3 mr-1" />
                  {report.section}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(report.id);
                    }}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Details</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isExpanded ? 'Collapse details' : 'Expand to see full details'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center bg-muted/30 p-2 rounded-md">
            <div className="text-lg font-semibold">{totalActions}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center bg-yellow-50 p-2 rounded-md">
            <div className="text-lg font-semibold text-yellow-600">{pendingActions}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center bg-green-50 p-2 rounded-md">
            <div className="text-lg font-semibold text-green-600">{completedActions}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/20 p-2 rounded-md">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate font-medium">{report.stoppageBy}</span>
            {report.stoppagePosition && (
              <span className="text-xs text-muted-foreground ml-auto">({report.stoppagePosition})</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/20 p-2 rounded-md">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{formatDate(report.date)}</span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
            {/* Full Description */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Description
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{report.description}</p>
            </div>

            {/* Investigation Findings */}
            {report.investigationFindings && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Investigation Findings
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{report.investigationFindings}</p>
              </div>
            )}

            {/* All Corrective Actions */}
            {report.correctiveActions && report.correctiveActions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  Corrective Actions ({report.correctiveActions.length})
                </h4>
                <div className="space-y-2">
                  {report.correctiveActions.map((action, idx) => {
                    const StatusIcon = STATUS_ICONS[action.status];
                    return (
                      <div key={action.id} className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">Action #{idx + 1}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                                <StatusIcon className="h-3 w-3" />
                                <span>{action.status}</span>
                                <ChevronDown className="h-2 w-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {(Object.keys(STATUS_ACTIONS) as StatusType[]).map((status) => {
                                const Icon = STATUS_ICONS[status];
                                return (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() => handleActionStatusChange(action.id, status)}
                                    className={action.status === status ? 'bg-accent' : ''}
                                  >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {status}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm mb-1"><span className="font-medium">Finding:</span> {action.finding}</p>
                        <p className="text-sm mb-2"><span className="font-medium">Action:</span> {action.action}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>By: {action.byWho}</div>
                          <div>Due: {formatDate(action.byWhen)}</div>
                          {action.completedDate && (
                            <div className="col-span-2">Completed: {formatDate(action.completedDate)}</div>
                          )}
                        </div>
                        {action.remarks && (
                          <p className="text-xs mt-2 italic text-muted-foreground">"{action.remarks}"</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Signatories */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted/30 p-2 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Accepted By</p>
                <p className="font-medium">{report.acceptedBy || 'Not specified'}</p>
              </div>
              <div className="bg-muted/30 p-2 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">SHEQ Checked</p>
                <p className="font-medium">{report.sheqCheckedBy || 'Not specified'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="default" className="flex-1" onClick={() => onView(report)}>
                <Eye className="h-3.5 w-3.5 mr-1.5" /> View Full
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(report)}>
                <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={() => onDelete(report.id)}>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =============== MAIN PAGE ===============
export default function WorkStoppagePage() {
  // State
  const [reports, setReports] = useState<WorkStoppageReport[]>([]);
  const [stats, setStats] = useState<WorkStoppageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedReport, setSelectedReport] = useState<WorkStoppageReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<WorkStoppageReport | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedInspector, setSelectedInspector] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load data with filters
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [reportsData, statsData] = await Promise.all([
        getReports(),
        getStats()
      ]);
      
      setReports(reportsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load work stoppage reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load suggestions
  const [uniqueInspectors, setUniqueInspectors] = useState<string[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const [departments, inspectors] = await Promise.all([
        getDepartmentSuggestions(),
        getInspectorSuggestions()
      ]);
      setUniqueDepartments(departments);
      setUniqueInspectors(inspectors);
    };
    
    loadSuggestions();
  }, []);

  // Handlers
  const handleSaveReport = async (reportData: Partial<WorkStoppageReport>) => {
    try {
      let savedReport: WorkStoppageReport | null = null;
      
      if (editingReport) {
        savedReport = await updateReport(editingReport.id, reportData);
        if (savedReport) {
          setReports(prev => prev.map(r => r.id === savedReport!.id ? savedReport! : r));
          toast.success('Work stoppage updated successfully');
        }
      } else {
        savedReport = await createReport(reportData);
        if (savedReport) {
          setReports(prev => [savedReport!, ...prev]);
          toast.success('Work stoppage issued successfully');
        }
      }
      
      if (savedReport) {
        const newStats = await getStats();
        setStats(newStats);
      }
      
      setIsFormModalOpen(false);
      setEditingReport(null);
    } catch (error) {
      console.error('Failed to save report:', error);
      toast.error('Failed to save work stoppage. Please try again.');
      throw error;
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      const success = await deleteReport(id);
      if (success) {
        setReports(prev => prev.filter(r => r.id !== id));
        const newStats = await getStats();
        setStats(newStats);
        toast.success('Report deleted successfully');
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast.error('Failed to delete report. Please try again.');
    }
  };

  const handleActionStatusChange = async (reportId: string, actionId: string, newStatus: StatusType) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const updatedActions = report.correctiveActions?.map(action => {
      if (action.id === actionId) {
        const updatedAction = { ...action, status: newStatus };
        if (newStatus === 'Completed' && !action.completedDate) {
          updatedAction.completedDate = new Date().toISOString().split('T')[0];
        }
        return updatedAction;
      }
      return action;
    });

    const updatedReport = { ...report, correctiveActions: updatedActions };
    
    // Optimistic update
    setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));

    try {
      const saved = await updateReport(reportId, { correctiveActions: updatedActions });
      if (!saved) {
        // Revert on failure
        setReports(prev => prev.map(r => r.id === reportId ? report : r));
        toast.error('Failed to update action status');
      } else {
        toast.success(`Action status updated to ${newStatus}`);
        // Refresh stats
        const newStats = await getStats();
        setStats(newStats);
      }
    } catch (error) {
      // Revert on error
      setReports(prev => prev.map(r => r.id === reportId ? report : r));
      console.error('Failed to update action status:', error);
      toast.error('Failed to update action status');
    }
  };

  const toggleCardExpand = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCards(new Set(reports.map(r => r.id)));
  };

  const collapseAll = () => {
    setExpandedCards(new Set());
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSection('all');
    setSelectedInspector('all');
    setDateRange({ from: null, to: null });
    setStatusFilter('all');
  };

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          report.department?.toLowerCase().includes(searchLower) ||
          report.description?.toLowerCase().includes(searchLower) ||
          report.stoppageBy?.toLowerCase().includes(searchLower) ||
          report.correctiveActions?.some(a => 
            a.finding?.toLowerCase().includes(searchLower) ||
            a.action?.toLowerCase().includes(searchLower)
          );
        
        if (!matchesSearch) return false;
      }
      
      // Section filter
      if (selectedSection !== 'all' && report.section !== selectedSection) {
        return false;
      }
      
      // Inspector filter
      if (selectedInspector !== 'all' && report.stoppageBy !== selectedInspector) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'pending' && !report.correctiveActions?.some(a => a.status === 'Pending')) return false;
        if (statusFilter === 'in-progress' && !report.correctiveActions?.some(a => a.status === 'In Progress')) return false;
        if (statusFilter === 'completed' && !report.correctiveActions?.every(a => a.status === 'Completed')) return false;
        if (statusFilter === 'overdue') {
          const today = new Date().toISOString().split('T')[0];
          const hasOverdue = report.correctiveActions?.some(a => 
            a.status !== 'Completed' && a.byWhen < today
          );
          if (!hasOverdue) return false;
        }
      }
      
      // Date range filter
      if (dateRange.from && dateRange.to) {
        const reportDate = new Date(report.date);
        if (reportDate < dateRange.from || reportDate > dateRange.to) {
          return false;
        }
      }
      
      return true;
    });
  }, [reports, searchTerm, selectedSection, selectedInspector, dateRange, statusFilter]);

  // Calculate stats from filtered data
  const filteredStats = useMemo(() => calculateStats(filteredReports), [filteredReports]);

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Stoppages',
      value: stats?.total || 0,
      icon: Octagon,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: 'All time'
    },
    {
      title: 'Pending Actions',
      value: stats?.pendingActions || 0,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Need attention'
    },
    {
      title: 'In Progress',
      value: stats?.inProgressActions || 0,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Being addressed'
    },
    {
      title: 'Completed',
      value: stats?.completedActions || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Actions done'
    }
  ];

  return (
    <PageShell>
      <TooltipProvider>
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-[#6B7B8E] mb-2">
                <span>Home</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#2A4D69] font-medium">Work Stoppage</span>
              </nav>
              <h1 className="text-3xl font-bold text-[#2A4D69] font-heading tracking-tight">Work Stoppage</h1>
              <p className="text-[#6B7B8E] mt-1">Document and track unsafe acts, practices, and corrective actions.</p>
            </div>
            <div className="flex items-center gap-2 self-start">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-accent text-accent-foreground' : ''}>
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Grid View</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'bg-accent text-accent-foreground' : ''}>
                    <TableIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Table View</p></TooltipContent>
              </Tooltip>
              <Button onClick={() => { setEditingReport(null); setIsFormModalOpen(true); }} className="bg-[#2A4D69] hover:bg-[#1e3a52] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" /> New Stoppage
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Section Distribution */}
          {stats && (
            <Card className="mb-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Distribution by Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {SECTIONS.map(section => {
                    const Icon = SECTION_ICONS[section];
                    const count = stats.bySection[section] || 0;
                    const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;
                    
                    return (
                      <div key={section} className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 text-muted-foreground`} />
                            <span className="text-sm font-medium">{section}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search — always visible */}
          <div className="relative bg-white rounded-lg border shadow-sm p-3 mb-3">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7B8E]" />
            <Input
              placeholder="Search by department, description, inspector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 bg-white border-0 shadow-none focus-visible:ring-0"
            />
            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#6B7B8E] hover:text-[#2A4D69]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Expand/Collapse All — outside filters */}
          <div className="flex gap-2 mb-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={expandAll}>
                  <ChevronsDown className="h-4 w-4 mr-2" />
                  Expand All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Expand all cards to show full details</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  <ChevronsUp className="h-4 w-4 mr-2" />
                  Collapse All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Collapse all cards</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Advanced Filters */}
          <CollapsibleSection
            title="Filters"
            description="Filter reports by section, inspector, status, and date range"
            badge={
              (() => {
                const count = [
                  selectedSection !== 'all',
                  selectedInspector !== 'all',
                  statusFilter !== 'all',
                  !!dateRange.from,
                  !!dateRange.to,
                ].filter(Boolean).length;
                return count > 0
                  ? <Badge className="ml-2 bg-[#2A4D69] text-white text-xs px-2 py-0.5">{count}</Badge>
                  : null;
              })()
            }
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {/* Section Filter */}
              <div className="space-y-2">
                <Label className="text-[#2A4D69] font-medium">Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="bg-[#F0F5F9]">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {SECTIONS.map(section => (
                      <SelectItem key={section} value={section}>{section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Inspector Filter */}
              <div className="space-y-2">
                <Label className="text-[#2A4D69] font-medium">Inspector</Label>
                <Select value={selectedInspector} onValueChange={setSelectedInspector}>
                  <SelectTrigger className="bg-[#F0F5F9]">
                    <SelectValue placeholder="All Inspectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Inspectors</SelectItem>
                    {uniqueInspectors.map(inspector => (
                      <SelectItem key={inspector} value={inspector}>{inspector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-[#2A4D69] font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[#F0F5F9]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Has Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">All Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label className="text-[#2A4D69] font-medium">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full bg-[#F0F5F9] justify-start">
                      <Calendar className="h-4 w-4 mr-2 text-[#6B7B8E]" />
                      <span className="text-[#6B7B8E]">{dateRange.from ? format(dateRange.from, 'LLL dd, y') : 'Start'}</span>
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
              </div>

              <div className="space-y-2">
                <Label className="text-[#2A4D69] font-medium">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full bg-[#F0F5F9] justify-start">
                      <Calendar className="h-4 w-4 mr-2 text-[#6B7B8E]" />
                      <span className="text-[#6B7B8E]">{dateRange.to ? format(dateRange.to, 'LLL dd, y') : 'End'}</span>
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
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-[#6B7B8E]">
                Showing {filteredReports.length} of {reports.length} reports
              </span>
              {(selectedSection !== 'all' || selectedInspector !== 'all' ||
                statusFilter !== 'all' || dateRange.from || dateRange.to) && (
                <Button variant="ghost" onClick={clearFilters} className="text-[#6B7B8E] hover:text-[#2A4D69]">
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CollapsibleSection>

          {/* Results Count — always visible */}
          <div className="mt-2 mb-6 text-sm text-[#6B7B8E]">
            Showing {filteredReports.length} of {reports.length} reports
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="bg-destructive/10 border-destructive/20 mb-6">
              <CardContent className="p-6 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Error Loading Data</p>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadData} className="ml-auto">
                  <RefreshCw className="h-4 w-4 mr-2" /> Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && filteredReports.length === 0 && (
            <Card className="py-20">
              <CardContent className="text-center">
                <Octagon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No work stoppages found</h3>
                <p className="text-muted-foreground mb-6">
                  {reports.length === 0 
                    ? "Get started by issuing your first work stoppage."
                    : "Try adjusting your filters to see more results."}
                </p>
                {reports.length === 0 ? (
                  <Button onClick={() => setIsFormModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Issue First Stoppage
                  </Button>
                ) : (
                  <Button variant="outline" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reports Grid */}
          {!loading && !error && filteredReports.length > 0 && (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredReports.map((report, index) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    index={index}
                    isExpanded={expandedCards.has(report.id)}
                    onToggleExpand={toggleCardExpand}
                    onView={(report) => {
                      setSelectedReport(report);
                      setIsDetailModalOpen(true);
                    }}
                    onEdit={(report) => {
                      setEditingReport(report);
                      setIsFormModalOpen(true);
                    }}
                    onDelete={(id) => setDeleteConfirm(id)}
                    onStatusChange={handleActionStatusChange}
                  />
                ))}
              </div>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Issued By</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => {
                        const totalActions = report.correctiveActions?.length || 0;
                        const completedActions = report.correctiveActions?.filter(a => a.status === 'Completed').length || 0;
                        const progress = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;
                        
                        return (
                          <React.Fragment key={report.id}>
                            <TableRow
                              className="hover:bg-muted/50 cursor-pointer"
                              onClick={() => {
                                setSelectedReport(report);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 gap-1 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardExpand(report.id);
                                      }}
                                    >
                                      {expandedCards.has(report.id) ? (
                                        <>
                                          <ChevronUp className="h-3 w-3" />
                                          <span className="hidden sm:inline">Less</span>
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="h-3 w-3" />
                                          <span className="hidden sm:inline">Details</span>
                                        </>
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{expandedCards.has(report.id) ? 'Collapse details' : 'Expand to see full details'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell>{formatDate(report.date)}</TableCell>
                              <TableCell className="font-medium">{report.department}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {React.createElement(SECTION_ICONS[report.section], { className: "h-3 w-3 mr-1" })}
                                  {report.section}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {getInitials(report.stoppageBy)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{report.stoppageBy}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    {report.correctiveActions?.filter(a => a.status === 'Pending').length || 0}
                                  </Badge>
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    {report.correctiveActions?.filter(a => a.status === 'In Progress').length || 0}
                                  </Badge>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {report.correctiveActions?.filter(a => a.status === 'Completed').length || 0}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={progress} className="w-16 h-2" />
                                  <span className="text-xs text-muted-foreground">{progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => {
                                      setSelectedReport(report);
                                      setIsDetailModalOpen(true);
                                    }}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View full details</p>
                                  </TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => {
                                      setEditingReport(report);
                                      setIsFormModalOpen(true);
                                    }}>
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit report</p>
                                  </TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(report.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete report</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                            {expandedCards.has(report.id) && (
                              <TableRow className="bg-muted/30">
                                <TableCell colSpan={8} className="p-4">
                                  <div className="space-y-4">
                                    {/* Full Description */}
                                    <div>
                                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                                        Description
                                      </h4>
                                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.description}</p>
                                    </div>

                                    {/* Investigation Findings */}
                                    {report.investigationFindings && (
                                      <div>
                                        <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                          <ClipboardList className="h-3 w-3" />
                                          Investigation Findings
                                        </h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.investigationFindings}</p>
                                      </div>
                                    )}

                                    {/* All Corrective Actions */}
                                    {report.correctiveActions && report.correctiveActions.length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                          <Target className="h-3 w-3" />
                                          Corrective Actions ({report.correctiveActions.length})
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          {report.correctiveActions.map((action, idx) => {
                                            const StatusIcon = STATUS_ICONS[action.status];
                                            return (
                                              <div key={action.id} className="bg-background p-3 rounded-lg border">
                                                <div className="flex items-start justify-between mb-2">
                                                  <span className="text-xs font-medium text-muted-foreground">Action #{idx + 1}</span>
                                                  <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                      <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                                                        <StatusIcon className="h-3 w-3" />
                                                        <span>{action.status}</span>
                                                        <ChevronDown className="h-2 w-2" />
                                                      </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                      <DropdownMenuSeparator />
                                                      {(Object.keys(STATUS_ACTIONS) as StatusType[]).map((status) => {
                                                        const Icon = STATUS_ICONS[status];
                                                        return (
                                                          <DropdownMenuItem
                                                            key={status}
                                                            onClick={() => handleActionStatusChange(report.id, action.id, status)}
                                                            className={action.status === status ? 'bg-accent' : ''}
                                                          >
                                                            <Icon className="h-4 w-4 mr-2" />
                                                            {status}
                                                          </DropdownMenuItem>
                                                        );
                                                      })}
                                                    </DropdownMenuContent>
                                                  </DropdownMenu>
                                                </div>
                                                <p className="text-sm mb-1"><span className="font-medium">Finding:</span> {action.finding}</p>
                                                <p className="text-sm mb-2"><span className="font-medium">Action:</span> {action.action}</p>
                                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                  <div>By: {action.byWho}</div>
                                                  <div>Due: {formatDate(action.byWhen)}</div>
                                                  {action.completedDate && (
                                                    <div className="col-span-2">Completed: {formatDate(action.completedDate)}</div>
                                                  )}
                                                </div>
                                                {action.remarks && (
                                                  <p className="text-xs mt-2 italic text-muted-foreground">"{action.remarks}"</p>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    {/* Signatories */}
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="bg-background p-2 rounded border">
                                        <p className="text-xs text-muted-foreground mb-1">Accepted By</p>
                                        <p className="font-medium">{report.acceptedBy || 'Not specified'}</p>
                                      </div>
                                      <div className="bg-background p-2 rounded border">
                                        <p className="text-xs text-muted-foreground mb-1">SHEQ Checked</p>
                                        <p className="font-medium">{report.sheqCheckedBy || 'Not specified'}</p>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )
          )}

          {/* Detail Modal */}
          <ReportDetailModal
            report={selectedReport}
            open={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedReport(null);
            }}
            onEdit={(report) => {
              setIsDetailModalOpen(false);
              setEditingReport(report);
              setIsFormModalOpen(true);
            }}
            onDelete={(id) => {
              setIsDetailModalOpen(false);
              setDeleteConfirm(id);
            }}
            onStatusChange={(actionId, newStatus) => 
              selectedReport && handleActionStatusChange(selectedReport.id, actionId, newStatus)
            }
          />

          {/* Form Modal */}
          <ReportFormModal
            open={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingReport(null);
            }}
            onSave={handleSaveReport}
            report={editingReport}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this work stoppage report? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteConfirm && handleDeleteReport(deleteConfirm)}
                >
                  Delete Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </TooltipProvider>
    </PageShell>
  );
}