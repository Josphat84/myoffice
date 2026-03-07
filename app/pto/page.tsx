'use client';

import React, { useState, useEffect, useMemo } from "react";
import { 
  ClipboardList, Search, FilterX, UserCheck, 
  Plus, Save, Clock, AlertTriangle, CheckSquare,
  FileText, Users, History, Info, Eye, Pencil, Trash2,
  Loader2, ChevronDown, ChevronUp, Calendar, User, 
  HardHat, Target, CheckCircle, XCircle, ShieldAlert,
  Zap, Wrench, Building2, X, Radio, Activity, BookOpen,
  FileCheck, ClipboardCheck, AlertOctagon, Bell, Settings,
  LayoutGrid, Table as TableIcon, Maximize2, Minimize2,
  ChevronsDown, ChevronsUp, Grip, MoreVertical, RefreshCw, Send
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============== TYPES ===============
type SectionType = 'Mechanical' | 'Electrical';
type ObservationType = 'Initial' | 'Follow up';
type YesNoType = 'Yes' | 'No';
type ReportStatus = 'draft' | 'submitted' | 'reviewed' | 'closed';
type ActionStatus = 'Pending' | 'In Progress' | 'Completed';

interface TimeOnJob {
  months: string;
  years: string;
}

interface Notification {
  toldInAdvance: YesNoType;
}

interface Reasons {
  monthly: boolean;
  newEmployee: boolean;
  safetyAwareness: boolean;
  incidentFollowUp: boolean;
  trainingFollowUp: boolean;
  infrequentTask: boolean;
}

interface Procedures {
  hasProcedure: YesNoType;
  familiarWithProcedure: YesNoType;
}

interface RiskAssessment {
  made: YesNoType;
  identified: YesNoType;
  effective: YesNoType;
}

interface SuggestedRemedies {
  newProcedure: YesNoType;
  reviseExisting: YesNoType;
  differentEquipment: YesNoType;
  engineeringControls: YesNoType;
  retraining: YesNoType;
  improvedPPE: YesNoType;
  placementOfWorker: YesNoType;
}

interface ActionPlanItem {
  id: string;
  no: number;
  action: string;
  byWhom: string;
  byWhen: string;
  status: ActionStatus;
  completedDate?: string;
  remarks?: string;
  created_at?: string;
}

interface PTOReport {
  id: string;
  date: string;
  observerName: string;
  section: SectionType;
  deptSectionContractor: string;
  workerName: string;
  occupation: string;
  jobTaskObserved: string;
  sheqRefNo: string;
  observationType: ObservationType;
  timeOnJob: TimeOnJob;
  notification: Notification;
  reasons: Reasons;
  procedures: Procedures;
  riskAssessment: RiskAssessment;
  suggestedRemedies: SuggestedRemedies;
  observationScope: 'All' | 'Partial';
  followUpNeeded: YesNoType;
  actionPlan: ActionPlanItem[];
  status: ReportStatus;
  created_at: string;
  updated_at?: string;
  submitted_at?: string;
}

interface PTOStats {
  total: number;
  bySection: Record<SectionType, number>;
  byObserver: Record<string, number>;
  totalActions: number;
  completedActions: number;
  pendingActions: number;
  inProgressActions: number;
  highRiskCount: number;
  initialObservations: number;
  followUpObservations: number;
  draftCount: number;
  submittedCount: number;
  reviewedCount: number;
  closedCount: number;
}

// =============== CONSTANTS ===============
const SECTIONS: SectionType[] = ['Mechanical', 'Electrical'];

const SECTION_VARIANTS: Record<SectionType, { color: string; bg: string; border: string; text: string; icon: string }> = {
  Mechanical: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600'
  },
  Electrical: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: 'text-amber-600'
  }
};

const SECTION_ICONS: Record<SectionType, any> = {
  Mechanical: Wrench,
  Electrical: Zap
};

const OBSERVATION_TYPES: ObservationType[] = ['Initial', 'Follow up'];

const OBSERVATION_VARIANTS: Record<ObservationType, { color: string; bg: string }> = {
  'Initial': { color: 'text-purple-700', bg: 'bg-purple-50' },
  'Follow up': { color: 'text-orange-700', bg: 'bg-orange-50' }
};

const STATUS_VARIANTS: Record<ReportStatus | ActionStatus, { color: string; bg: string; label: string }> = {
  'draft': { color: 'text-gray-700', bg: 'bg-gray-100', label: 'Draft' },
  'submitted': { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Submitted' },
  'reviewed': { color: 'text-purple-700', bg: 'bg-purple-100', label: 'Reviewed' },
  'closed': { color: 'text-green-700', bg: 'bg-green-100', label: 'Closed' },
  'Pending': { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Pending' },
  'In Progress': { color: 'text-blue-700', bg: 'bg-blue-100', label: 'In Progress' },
  'Completed': { color: 'text-green-700', bg: 'bg-green-100', label: 'Completed' }
};

const YES_NO_OPTIONS: YesNoType[] = ['Yes', 'No'];

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

async function getPTOReports(params?: {
  search?: string;
  section?: string;
  observer?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}): Promise<PTOReport[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.section) queryParams.append('section', params.section);
  if (params?.observer) queryParams.append('observer', params.observer);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);

  try {
    const data = await fetchAPI<PTOReport[]>(`/api/pto/?${queryParams.toString()}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching PTO reports:', error);
    return [];
  }
}

async function getPTOReport(id: string): Promise<PTOReport | null> {
  try {
    return await fetchAPI<PTOReport>(`/api/pto/${id}`);
  } catch (error) {
    console.error('Error fetching PTO report:', error);
    return null;
  }
}

async function createPTOReport(report: Partial<PTOReport>): Promise<PTOReport | null> {
  try {
    return await fetchAPI<PTOReport>('/api/pto/', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error creating PTO report:', error);
    return null;
  }
}

async function updatePTOReport(id: string, report: Partial<PTOReport>): Promise<PTOReport | null> {
  try {
    return await fetchAPI<PTOReport>(`/api/pto/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error updating PTO report:', error);
    return null;
  }
}

async function deletePTOReport(id: string): Promise<boolean> {
  try {
    await fetchAPI(`/api/pto/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting PTO report:', error);
    return false;
  }
}

async function getPTOStats(): Promise<PTOStats> {
  try {
    const data = await fetchAPI<any>('/api/pto/stats/overview');
    return {
      total: data?.total || 0,
      bySection: data?.bySection || { Mechanical: 0, Electrical: 0 },
      byObserver: data?.byInspector || {},
      totalActions: data?.totalActions || 0,
      completedActions: data?.completedActions || 0,
      pendingActions: data?.pendingActions || 0,
      inProgressActions: data?.inProgressActions || 0,
      highRiskCount: data?.highRiskCount || 0,
      initialObservations: data?.initialObservations || 0,
      followUpObservations: data?.followUpObservations || 0,
      draftCount: data?.draftCount || 0,
      submittedCount: data?.submittedCount || 0,
      reviewedCount: data?.reviewedCount || 0,
      closedCount: data?.closedCount || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      bySection: { Mechanical: 0, Electrical: 0 },
      byObserver: {},
      totalActions: 0,
      completedActions: 0,
      pendingActions: 0,
      inProgressActions: 0,
      highRiskCount: 0,
      initialObservations: 0,
      followUpObservations: 0,
      draftCount: 0,
      submittedCount: 0,
      reviewedCount: 0,
      closedCount: 0
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

const calculateStats = (reports: PTOReport[]): PTOStats => {
  const stats: PTOStats = {
    total: reports.length,
    bySection: { Mechanical: 0, Electrical: 0 },
    byObserver: {},
    totalActions: 0,
    completedActions: 0,
    pendingActions: 0,
    inProgressActions: 0,
    highRiskCount: 0,
    initialObservations: 0,
    followUpObservations: 0,
    draftCount: 0,
    submittedCount: 0,
    reviewedCount: 0,
    closedCount: 0
  };

  reports.forEach(report => {
    // Count by section
    if (report.section) {
      stats.bySection[report.section]++;
    }

    // Count by status
    if (report.status) {
      if (report.status === 'draft') stats.draftCount++;
      else if (report.status === 'submitted') stats.submittedCount++;
      else if (report.status === 'reviewed') stats.reviewedCount++;
      else if (report.status === 'closed') stats.closedCount++;
    }

    // Count by observer
    if (report.observerName) {
      const observer = report.observerName.trim();
      if (observer) {
        stats.byObserver[observer] = (stats.byObserver[observer] || 0) + 1;
      }
    }

    // Count by observation type
    if (report.observationType === 'Initial') {
      stats.initialObservations++;
    } else {
      stats.followUpObservations++;
    }

    // Count actions
    if (report.actionPlan?.length) {
      stats.totalActions += report.actionPlan.length;
      report.actionPlan.forEach(action => {
        if (action.status === 'Completed') {
          stats.completedActions++;
        } else if (action.status === 'In Progress') {
          stats.inProgressActions++;
        } else {
          stats.pendingActions++;
        }
      });
    }

    // Count high risk assessments
    if (report.riskAssessment) {
      if (report.riskAssessment.made === 'No' || 
          report.riskAssessment.identified === 'No' || 
          report.riskAssessment.effective === 'No') {
        stats.highRiskCount++;
      }
    }
  });

  return stats;
};

// =============== ACTION PLAN ITEM COMPONENT ===============
interface ActionPlanItemProps {
  item: ActionPlanItem;
  index: number;
  onChange: (id: string, field: keyof ActionPlanItem, value: any) => void;
  onRemove?: (id: string) => void;
}

const ActionPlanItemComponent: React.FC<ActionPlanItemProps> = ({ item, index, onChange, onRemove }) => {
  const statusVariant = STATUS_VARIANTS[item.status];

  return (
    <div className="group relative bg-white rounded-lg border p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
          {index + 1}
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs text-muted-foreground mb-1 block">Required Action *</Label>
            <Input 
              value={item.action} 
              onChange={e => onChange(item.id, 'action', e.target.value)}
              placeholder="Describe the required action..."
              className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">By Whom *</Label>
            <Input 
              value={item.byWhom} 
              onChange={e => onChange(item.id, 'byWhom', e.target.value)}
              placeholder="Responsible person"
              className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">By When *</Label>
            <Input 
              type="date" 
              value={item.byWhen} 
              onChange={e => onChange(item.id, 'byWhen', e.target.value)}
              className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
            <Select
              value={item.status}
              onValueChange={(v: ActionStatus) => onChange(item.id, 'status', v)}
            >
              <SelectTrigger className="border-0 bg-muted/30">
                <SelectValue>
                  <Badge className={`${statusVariant.bg} ${statusVariant.color} border-0`}>
                    {item.status}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {item.status === 'Completed' && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Completed Date</Label>
              <Input 
                type="date" 
                value={item.completedDate || new Date().toISOString().split('T')[0]}
                onChange={e => onChange(item.id, 'completedDate', e.target.value)}
                className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          )}

          <div className="md:col-span-4">
            <Label className="text-xs text-muted-foreground mb-1 block">Remarks (Optional)</Label>
            <Textarea 
              value={item.remarks || ''}
              onChange={e => onChange(item.id, 'remarks', e.target.value)}
              placeholder="Add any additional notes or remarks..."
              className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary resize-none"
              rows={2}
            />
          </div>
        </div>

        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
};

// =============== PTO CARD COMPONENT ===============
interface PTOCardProps {
  report: PTOReport;
  index: number;
  onView: (report: PTOReport) => void;
  onEdit: (report: PTOReport) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: ReportStatus) => void;
}

const PTOCard: React.FC<PTOCardProps> = ({
  report,
  index,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const SectionIcon = SECTION_ICONS[report.section];
  const sectionVariant = SECTION_VARIANTS[report.section];
  const statusVariant = STATUS_VARIANTS[report.status];
  const observationVariant = OBSERVATION_VARIANTS[report.observationType];
  
  const totalActions = report.actionPlan?.length || 0;
  const completedActions = report.actionPlan?.filter(a => a.status === 'Completed').length || 0;
  const inProgressActions = report.actionPlan?.filter(a => a.status === 'In Progress').length || 0;
  const progress = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;
  const hasRisks = report.riskAssessment.made === 'No' || 
                   report.riskAssessment.identified === 'No' || 
                   report.riskAssessment.effective === 'No';

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 overflow-hidden"
      style={{ borderLeftColor: hasRisks ? '#ef4444' : '#0f172a' }}
      onClick={() => onView(report)}
    >
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-slate-50 to-transparent p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${sectionVariant.bg}`}>
                <SectionIcon className={`h-5 w-5 ${sectionVariant.icon}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={`${sectionVariant.bg} ${sectionVariant.text} border-0 text-xs`}>
                    <SectionIcon className="h-3 w-3 mr-1" />
                    {report.section}
                  </Badge>
                  <Badge className={`${observationVariant.bg} ${observationVariant.color} border-0 text-xs`}>
                    {report.observationType}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">PTO-{index + 1}</p>
                <h3 className="font-semibold text-base line-clamp-1 mt-1">{report.jobTaskObserved}</h3>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onView(report)}>
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(report)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onStatusChange?.(report.id, 'draft')}>
                  <FileText className="h-4 w-4 mr-2" /> Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.(report.id, 'submitted')}>
                  <Send className="h-4 w-4 mr-2" /> Submit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.(report.id, 'reviewed')}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.(report.id, 'closed')}>
                  <CheckSquare className="h-4 w-4 mr-2" /> Close
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(report.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Section */}
        <div className="px-5 py-3 border-t border-b bg-muted/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Action Progress</span>
            <span className="text-xs font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {totalActions - completedActions - inProgressActions} Pending
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {inProgressActions} In Progress
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {completedActions} Done
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium truncate">{report.observerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
              <HardHat className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{report.workerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(report.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
              <Badge className={`${statusVariant.bg} ${statusVariant.color} border-0`}>
                {statusVariant.label}
              </Badge>
            </div>
          </div>

          {hasRisks && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">Risk Identified - Review Required</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// =============== PTO DETAIL MODAL ===============
interface PTODetailModalProps {
  report: PTOReport | null;
  open: boolean;
  onClose: () => void;
  onEdit: (report: PTOReport) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: ReportStatus) => void;
}

const PTODetailModal: React.FC<PTODetailModalProps> = ({
  report,
  open,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  if (!report) return null;

  const SectionIcon = SECTION_ICONS[report.section];
  const sectionVariant = SECTION_VARIANTS[report.section];
  const statusVariant = STATUS_VARIANTS[report.status];
  
  const totalActions = report.actionPlan?.length || 0;
  const completedActions = report.actionPlan?.filter(a => a.status === 'Completed').length || 0;
  const inProgressActions = report.actionPlan?.filter(a => a.status === 'In Progress').length || 0;
  const progress = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;

  const riskItems = [
    { label: 'Risk Assessment Made', value: report.riskAssessment.made },
    { label: 'Hazards/Risks/Controls Identified', value: report.riskAssessment.identified },
    { label: 'Controls Effective', value: report.riskAssessment.effective },
  ];

  const procedureItems = [
    { label: 'SHEQ Work Procedure Available', value: report.procedures.hasProcedure },
    { label: 'Employee Familiar with Procedure', value: report.procedures.familiarWithProcedure },
  ];

  const reasonsList = Object.entries(report.reasons)
    .filter(([_, value]) => value)
    .map(([key]) => {
      const labels: Record<string, string> = {
        monthly: 'Monthly Observation',
        newEmployee: 'New Employee',
        safetyAwareness: 'Safety Awareness',
        incidentFollowUp: 'Incident Follow up',
        trainingFollowUp: 'Training Follow up',
        infrequentTask: 'Infrequently Performed'
      };
      return labels[key] || key;
    });

  const remediesList = Object.entries(report.suggestedRemedies)
    .filter(([_, value]) => value === 'Yes')
    .map(([key]) => {
      const labels: Record<string, string> = {
        newProcedure: 'New Procedure',
        reviseExisting: 'Revise Existing',
        differentEquipment: 'Different Equipment',
        engineeringControls: 'Engineering Controls',
        retraining: 'Retraining',
        improvedPPE: 'Improved PPE',
        placementOfWorker: 'Placement of Worker'
      };
      return labels[key] || key;
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Planned Task Observation Report
          </DialogTitle>
          <DialogDescription>
            Created on {formatDateTime(report.created_at)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] px-6">
          <div className="space-y-6 py-4">
            {/* Status Bar */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${sectionVariant.bg}`}>
                  <SectionIcon className={`h-5 w-5 ${sectionVariant.icon}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{report.section}</p>
                  <p className="text-xs text-muted-foreground">Section</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={`${statusVariant.bg} ${statusVariant.color} border-0`}>
                  {statusVariant.label}
                </Badge>
                <Badge variant="outline" className="bg-muted">
                  ID: {report.id.slice(0, 8)}
                </Badge>
              </div>
            </div>

            {/* Progress Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Action Plan Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedActions}/{totalActions} completed
                  </span>
                </div>
                <Progress value={progress} className="h-2 mb-3" />
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Pending: {totalActions - completedActions - inProgressActions}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    In Progress: {inProgressActions}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Completed: {completedActions}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Observer</p>
                <p className="font-medium">{report.observerName}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(report.date)}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Worker</p>
                <p className="font-medium">{report.workerName}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Occupation</p>
                <p className="font-medium">{report.occupation || 'N/A'}</p>
              </div>
            </div>

            {/* Task Details Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Task Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Job/Task Observed</p>
                  <p className="font-medium p-2 bg-muted/30 rounded">{report.jobTaskObserved}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">SHEQ Reference</p>
                  <p className="font-medium p-2 bg-muted/30 rounded">{report.sheqRefNo || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dept/Contractor</p>
                  <p className="font-medium p-2 bg-muted/30 rounded">{report.deptSectionContractor || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Time on Job</p>
                  <p className="font-medium p-2 bg-muted/30 rounded">
                    {report.timeOnJob.months || '0'}m, {report.timeOnJob.years || '0'}y
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Told in Advance</p>
                  <Badge className={report.notification.toldInAdvance === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {report.notification.toldInAdvance}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Reasons */}
            {reasonsList.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Reasons for Observation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {reasonsList.map((reason, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-purple-50 text-purple-700">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Procedures & Risk Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Procedure Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {procedureItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm">{item.label}</span>
                      <Badge className={item.value === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {riskItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm">{item.label}</span>
                      <Badge className={item.value === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Suggested Remedies */}
            {remediesList.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Suggested Remedies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {remediesList.map((remedy, idx) => (
                      <Badge key={idx} className="bg-blue-50 text-blue-700">
                        {remedy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scope & Follow-up */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Observation Scope</p>
                <Badge className={report.observationScope === 'All' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {report.observationScope}
                </Badge>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Follow-up Needed</p>
                <Badge className={report.followUpNeeded === 'Yes' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                  {report.followUpNeeded}
                </Badge>
              </div>
            </div>

            {/* Action Plan */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Action Plan ({report.actionPlan?.length || 0})
              </h3>
              <div className="space-y-3">
                {report.actionPlan && report.actionPlan.length > 0 ? (
                  report.actionPlan.map((action, idx) => {
                    const actionStatus = STATUS_VARIANTS[action.status];
                    return (
                      <Card key={action.id} className="overflow-hidden">
                        <div className={`h-1 w-full ${
                          action.status === 'Completed' ? 'bg-green-500' :
                          action.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} />
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground">Action #{idx + 1}</span>
                              <Badge className={`${actionStatus.bg} ${actionStatus.color} border-0`}>
                                {action.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-sm"><span className="font-medium">Action:</span> {action.action}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded">
                              <div><span className="text-muted-foreground">By:</span> {action.byWhom}</div>
                              <div><span className="text-muted-foreground">Due:</span> {formatDate(action.byWhen)}</div>
                              {action.completedDate && (
                                <div><span className="text-muted-foreground">Completed:</span> {formatDate(action.completedDate)}</div>
                              )}
                            </div>
                            {action.remarks && (
                              <p className="text-sm italic border-l-2 border-primary pl-3">{action.remarks}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No action items recorded.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-0 gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange?.(report.id, 'draft')}>
                <FileText className="h-4 w-4 mr-2" /> Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange?.(report.id, 'submitted')}>
                <Send className="h-4 w-4 mr-2" /> Submit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange?.(report.id, 'reviewed')}>
                <CheckCircle className="h-4 w-4 mr-2" /> Review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange?.(report.id, 'closed')}>
                <CheckSquare className="h-4 w-4 mr-2" /> Close
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

// =============== RISK ASSESSMENT ROW COMPONENT ===============
interface RiskRowProps {
  label: string;
  value: YesNoType;
  onChange: (value: YesNoType) => void;
}

const RiskRow: React.FC<RiskRowProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup value={value} onValueChange={(v: YesNoType) => onChange(v)} className="flex gap-4">
        {YES_NO_OPTIONS.map(option => (
          <div key={option} className="flex items-center space-x-1">
            <RadioGroupItem value={option} id={`${label}-${option}`} />
            <Label htmlFor={`${label}-${option}`} className="text-xs cursor-pointer">{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

// =============== MAIN PAGE ===============
export default function CompletePTOFormPage() {
  const [reports, setReports] = useState<PTOReport[]>([]);
  const [stats, setStats] = useState<PTOStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [selectedReport, setSelectedReport] = useState<PTOReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<PTOReport | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedObserver, setSelectedObserver] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  // Form State
  const [formData, setFormData] = useState<Partial<PTOReport>>({
    date: new Date().toISOString().split('T')[0],
    observerName: "",
    section: "Mechanical",
    deptSectionContractor: "",
    workerName: "",
    occupation: "",
    jobTaskObserved: "",
    sheqRefNo: "",
    observationType: "Initial",
    timeOnJob: { months: "", years: "" },
    notification: { toldInAdvance: "No" },
    reasons: {
      monthly: false,
      newEmployee: false,
      safetyAwareness: false,
      incidentFollowUp: false,
      trainingFollowUp: false,
      infrequentTask: false
    },
    procedures: {
      hasProcedure: "No",
      familiarWithProcedure: "No"
    },
    riskAssessment: {
      made: "No",
      identified: "No",
      effective: "No"
    },
    suggestedRemedies: {
      newProcedure: "No",
      reviseExisting: "No",
      differentEquipment: "No",
      engineeringControls: "No",
      retraining: "No",
      improvedPPE: "No",
      placementOfWorker: "No"
    },
    observationScope: "All",
    followUpNeeded: "No",
    actionPlan: [],
    status: "draft"
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [reportsData, statsData] = await Promise.all([
        getPTOReports(),
        getPTOStats()
      ]);
      
      setReports(reportsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load PTO reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addActionItem = () => {
    const newItem: ActionPlanItem = {
      id: Math.random().toString(36).substr(2, 9),
      no: (formData.actionPlan?.length || 0) + 1,
      action: "",
      byWhom: "",
      byWhen: "",
      status: "Pending"
    };
    setFormData(prev => ({
      ...prev,
      actionPlan: [...(prev.actionPlan || []), newItem]
    }));
  };

  const updateActionItem = (id: string, field: keyof ActionPlanItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      actionPlan: prev.actionPlan?.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ) || []
    }));
  };

  const removeActionItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      actionPlan: prev.actionPlan?.filter(item => item.id !== id) || []
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.observerName?.trim()) {
      toast.error('Observer name is required');
      return false;
    }
    if (!formData.workerName?.trim()) {
      toast.error('Worker name is required');
      return false;
    }
    if (!formData.jobTaskObserved?.trim()) {
      toast.error('Job/Task observed is required');
      return false;
    }
    if (!formData.date) {
      toast.error('Date is required');
      return false;
    }

    // Validate action plan items
    if (formData.actionPlan?.length) {
      for (let i = 0; i < formData.actionPlan.length; i++) {
        const item = formData.actionPlan[i];
        if (!item.action?.trim()) {
          toast.error(`Action #${i + 1}: Description is required`);
          return false;
        }
        if (!item.byWhom?.trim()) {
          toast.error(`Action #${i + 1}: Responsible person is required`);
          return false;
        }
        if (!item.byWhen) {
          toast.error(`Action #${i + 1}: Due date is required`);
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

    setLoading(true);
    try {
      let savedReport: PTOReport | null = null;

      if (editingReport) {
        savedReport = await updatePTOReport(editingReport.id, {
          ...formData,
          updated_at: new Date().toISOString()
        });
        if (savedReport) {
          setReports(prev => prev.map(r => r.id === savedReport?.id ? savedReport : r));
          toast.success('PTO report updated successfully');
        }
      } else {
        savedReport = await createPTOReport({
          ...formData,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        });
        if (savedReport) {
          setReports(prev => [savedReport!, ...prev]);
          toast.success('PTO report submitted successfully');
        }
      }

      if (savedReport) {
        const newStats = await getPTOStats();
        setStats(newStats);
      }

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        observerName: "",
        section: "Mechanical",
        deptSectionContractor: "",
        workerName: "",
        occupation: "",
        jobTaskObserved: "",
        sheqRefNo: "",
        observationType: "Initial",
        timeOnJob: { months: "", years: "" },
        notification: { toldInAdvance: "No" },
        reasons: {
          monthly: false,
          newEmployee: false,
          safetyAwareness: false,
          incidentFollowUp: false,
          trainingFollowUp: false,
          infrequentTask: false
        },
        procedures: {
          hasProcedure: "No",
          familiarWithProcedure: "No"
        },
        riskAssessment: {
          made: "No",
          identified: "No",
          effective: "No"
        },
        suggestedRemedies: {
          newProcedure: "No",
          reviseExisting: "No",
          differentEquipment: "No",
          engineeringControls: "No",
          retraining: "No",
          improvedPPE: "No",
          placementOfWorker: "No"
        },
        observationScope: "All",
        followUpNeeded: "No",
        actionPlan: [],
        status: "draft"
      });
      setIsFormModalOpen(false);
      setEditingReport(null);
    } catch (error) {
      console.error('Failed to save PTO report:', error);
      toast.error('Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ReportStatus) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    const updatedReport = { ...report, status: newStatus };
    
    // Optimistic update
    setReports(prev => prev.map(r => r.id === id ? updatedReport : r));

    try {
      const saved = await updatePTOReport(id, { status: newStatus });
      if (!saved) {
        setReports(prev => prev.map(r => r.id === id ? report : r));
        toast.error('Failed to update status');
      } else {
        toast.success(`Status updated to ${newStatus}`);
        const newStats = await getPTOStats();
        setStats(newStats);
      }
    } catch (error) {
      setReports(prev => prev.map(r => r.id === id ? report : r));
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (report: PTOReport) => {
    setEditingReport(report);
    setFormData({
      date: report.date,
      observerName: report.observerName,
      section: report.section,
      deptSectionContractor: report.deptSectionContractor,
      workerName: report.workerName,
      occupation: report.occupation,
      jobTaskObserved: report.jobTaskObserved,
      sheqRefNo: report.sheqRefNo,
      observationType: report.observationType,
      timeOnJob: report.timeOnJob,
      notification: report.notification,
      reasons: report.reasons,
      procedures: report.procedures,
      riskAssessment: report.riskAssessment,
      suggestedRemedies: report.suggestedRemedies,
      observationScope: report.observationScope,
      followUpNeeded: report.followUpNeeded,
      actionPlan: report.actionPlan || [],
      status: report.status
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deletePTOReport(id);
      if (success) {
        setReports(prev => prev.filter(r => r.id !== id));
        const newStats = await getPTOStats();
        setStats(newStats);
        toast.success('PTO report deleted successfully');
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete PTO report:', error);
      toast.error('Failed to delete report');
    }
  };

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          report.observerName?.toLowerCase().includes(searchLower) ||
          report.workerName?.toLowerCase().includes(searchLower) ||
          report.jobTaskObserved?.toLowerCase().includes(searchLower) ||
          report.occupation?.toLowerCase().includes(searchLower) ||
          report.actionPlan?.some(a => a.action?.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }
      
      // Section filter
      if (selectedSection !== 'all' && report.section !== selectedSection) {
        return false;
      }
      
      // Observer filter
      if (selectedObserver !== 'all' && report.observerName !== selectedObserver) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && report.status !== selectedStatus) {
        return false;
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
  }, [reports, searchTerm, selectedSection, selectedObserver, selectedStatus, dateRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSection('all');
    setSelectedObserver('all');
    setSelectedStatus('all');
    setDateRange({ from: null, to: null });
  };

  // Get unique observers
  const uniqueObservers = useMemo(() => {
    if (!stats) return [];
    return Object.keys(stats.byObserver);
  }, [stats]);

  // Expand/Collapse All (for table view)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => {
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
    setExpandedRows(new Set(reports.map(r => r.id)));
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto py-10 px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
                <ClipboardList className="h-10 w-10 text-primary" />
                Planned Task Observation
              </h1>
              <p className="text-lg text-muted-foreground">
                Complete PTO form with risk assessment and action tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-accent' : ''}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid View</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode('table')}
                    className={viewMode === 'table' ? 'bg-accent' : ''}
                  >
                    <TableIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Table View</TooltipContent>
              </Tooltip>
              <Button onClick={() => {
                setEditingReport(null);
                setFormData({
                  date: new Date().toISOString().split('T')[0],
                  observerName: "",
                  section: "Mechanical",
                  deptSectionContractor: "",
                  workerName: "",
                  occupation: "",
                  jobTaskObserved: "",
                  sheqRefNo: "",
                  observationType: "Initial",
                  timeOnJob: { months: "", years: "" },
                  notification: { toldInAdvance: "No" },
                  reasons: {
                    monthly: false,
                    newEmployee: false,
                    safetyAwareness: false,
                    incidentFollowUp: false,
                    trainingFollowUp: false,
                    infrequentTask: false
                  },
                  procedures: {
                    hasProcedure: "No",
                    familiarWithProcedure: "No"
                  },
                  riskAssessment: {
                    made: "No",
                    identified: "No",
                    effective: "No"
                  },
                  suggestedRemedies: {
                    newProcedure: "No",
                    reviseExisting: "No",
                    differentEquipment: "No",
                    engineeringControls: "No",
                    retraining: "No",
                    improvedPPE: "No",
                    placementOfWorker: "No"
                  },
                  observationScope: "All",
                  followUpNeeded: "No",
                  actionPlan: [],
                  status: "draft"
                });
                setIsFormModalOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" /> New PTO
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <ClipboardList className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.draftCount}</p>
                  <p className="text-xs text-muted-foreground">Draft</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Send className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.submittedCount}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.reviewedCount}</p>
                  <p className="text-xs text-muted-foreground">Reviewed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckSquare className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.closedCount}</p>
                  <p className="text-xs text-muted-foreground">Closed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.totalActions}</p>
                  <p className="text-xs text-muted-foreground">Actions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.completedActions}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.highRiskCount}</p>
                  <p className="text-xs text-muted-foreground">High Risk</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Section Distribution */}
          {stats && stats.total > 0 && (
            <Card className="mb-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Distribution by Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {SECTIONS.map(section => {
                    const Icon = SECTION_ICONS[section];
                    const variant = SECTION_VARIANTS[section];
                    const count = stats.bySection[section] || 0;
                    const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;
                    
                    return (
                      <div key={section} className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${variant.icon}`} />
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

          {/* Filter Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by observer, worker, task..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Expand/Collapse All (for table view) */}
                {viewMode === 'table' && (
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={expandAll}>
                          <ChevronsDown className="h-4 w-4 mr-2" />
                          Expand All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Expand all rows</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={collapseAll}>
                          <ChevronsUp className="h-4 w-4 mr-2" />
                          Collapse All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Collapse all rows</TooltipContent>
                    </Tooltip>
                  </div>
                )}

                {/* Section Filter */}
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="w-full lg:w-[150px]">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {SECTIONS.map(section => (
                      <SelectItem key={section} value={section}>{section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Observer Filter */}
                <Select value={selectedObserver} onValueChange={setSelectedObserver}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="All Observers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Observers</SelectItem>
                    {uniqueObservers.map(observer => (
                      <SelectItem key={observer} value={observer}>{observer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full lg:w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Range Filter */}
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[130px]">
                        <Calendar className="h-4 w-4 mr-2" />
                        {dateRange.from ? format(dateRange.from, 'LLL dd, y') : 'Start'}
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
                      <Button variant="outline" className="w-[130px]">
                        <Calendar className="h-4 w-4 mr-2" />
                        {dateRange.to ? format(dateRange.to, 'LLL dd, y') : 'End'}
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

                {/* Clear Filters */}
                {(searchTerm || selectedSection !== 'all' || selectedObserver !== 'all' || 
                  selectedStatus !== 'all' || dateRange.from || dateRange.to) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredReports.length} of {reports.length} reports
              </div>
            </CardContent>
          </Card>

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
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No PTO reports found</h3>
                <p className="text-muted-foreground mb-6">
                  {reports.length === 0 
                    ? "Get started by creating your first Planned Task Observation."
                    : "Try adjusting your filters to see more results."}
                </p>
                {reports.length === 0 ? (
                  <Button onClick={() => setIsFormModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Create First PTO
                  </Button>
                ) : (
                  <Button variant="outline" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-2" /> Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reports Grid/Table */}
          {!loading && !error && filteredReports.length > 0 && (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredReports.map((report, index) => (
                  <PTOCard
                    key={report.id}
                    report={report}
                    index={index}
                    onView={(r) => {
                      setSelectedReport(r);
                      setIsDetailModalOpen(true);
                    }}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteConfirm(id)}
                    onStatusChange={handleStatusChange}
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
                        <TableHead>Observer</TableHead>
                        <TableHead>Worker</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => {
                        const totalActions = report.actionPlan?.length || 0;
                        const completedActions = report.actionPlan?.filter(a => a.status === 'Completed').length || 0;
                        const hasRisks = report.riskAssessment.made === 'No' || 
                                       report.riskAssessment.identified === 'No' || 
                                       report.riskAssessment.effective === 'No';
                        const statusVariant = STATUS_VARIANTS[report.status];
                        
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
                                        toggleRowExpand(report.id);
                                      }}
                                    >
                                      {expandedRows.has(report.id) ? (
                                        <ChevronUp className="h-3 w-3" />
                                      ) : (
                                        <ChevronDown className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {expandedRows.has(report.id) ? 'Collapse' : 'Expand'}
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell>{formatDate(report.date)}</TableCell>
                              <TableCell className="font-medium">{report.observerName}</TableCell>
                              <TableCell>{report.workerName}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{report.jobTaskObserved}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={SECTION_VARIANTS[report.section].bg}>
                                  {React.createElement(SECTION_ICONS[report.section], { className: "h-3 w-3 mr-1" })}
                                  {report.section}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={OBSERVATION_VARIANTS[report.observationType].bg}>
                                  {report.observationType}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${statusVariant.bg} ${statusVariant.color} border-0`}>
                                  {statusVariant.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Badge className="bg-yellow-100 text-yellow-700">
                                    {totalActions - completedActions}
                                  </Badge>
                                  <Badge className="bg-green-100 text-green-700">
                                    {completedActions}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                {hasRisks ? (
                                  <Badge className="bg-red-100 text-red-700">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Risk
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-700">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    OK
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedReport(report);
                                      setIsDetailModalOpen(true);
                                    }}>
                                      <Eye className="h-4 w-4 mr-2" /> View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEdit(report)}>
                                      <Pencil className="h-4 w-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'draft')}>
                                      <FileText className="h-4 w-4 mr-2" /> Draft
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'submitted')}>
                                      <Send className="h-4 w-4 mr-2" /> Submit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'reviewed')}>
                                      <CheckCircle className="h-4 w-4 mr-2" /> Review
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'closed')}>
                                      <CheckSquare className="h-4 w-4 mr-2" /> Close
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setDeleteConfirm(report.id)} className="text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                            {expandedRows.has(report.id) && (
                              <TableRow className="bg-muted/30">
                                <TableCell colSpan={11} className="p-4">
                                  <div className="space-y-3">
                                    <h4 className="font-medium">Action Plan:</h4>
                                    {report.actionPlan && report.actionPlan.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {report.actionPlan.map((action, idx) => {
                                          const actionStatus = STATUS_VARIANTS[action.status];
                                          return (
                                            <div key={action.id} className="bg-background p-3 rounded-lg border">
                                              <div className="flex items-start justify-between mb-2">
                                                <span className="text-xs font-medium text-muted-foreground">Action #{idx + 1}</span>
                                                <Badge className={`${actionStatus.bg} ${actionStatus.color} border-0`}>
                                                  {action.status}
                                                </Badge>
                                              </div>
                                              <p className="text-sm mb-2">{action.action}</p>
                                              <div className="flex gap-4 text-xs text-muted-foreground">
                                                <span>By: {action.byWhom}</span>
                                                <span>Due: {formatDate(action.byWhen)}</span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No action items</p>
                                    )}
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

          {/* Form Modal */}
          <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-primary" />
                  {editingReport ? 'Edit PTO Report' : 'New Planned Task Observation'}
                </DialogTitle>
                <DialogDescription>
                  Complete the full PTO form below. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  {/* Section 1: Task Information */}
                  <Card>
                    <CardHeader className="bg-muted/30 border-b">
                      <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Section 1: Task Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                      <div className="space-y-2">
                        <Label>Date *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="date" 
                            value={formData.date} 
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Observer Name *</Label>
                        <Input 
                          required 
                          value={formData.observerName} 
                          onChange={e => setFormData({...formData, observerName: e.target.value})}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Section *</Label>
                        <Select 
                          value={formData.section} 
                          onValueChange={(v: SectionType) => setFormData({...formData, section: v})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SECTIONS.map(section => (
                              <SelectItem key={section} value={section}>{section}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Dept/Section/Contractor</Label>
                        <Input 
                          value={formData.deptSectionContractor} 
                          onChange={e => setFormData({...formData, deptSectionContractor: e.target.value})}
                          placeholder="Department or contractor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Worker Observed *</Label>
                        <Input 
                          required 
                          value={formData.workerName} 
                          onChange={e => setFormData({...formData, workerName: e.target.value})}
                          placeholder="Worker name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Occupation</Label>
                        <Input 
                          value={formData.occupation} 
                          onChange={e => setFormData({...formData, occupation: e.target.value})}
                          placeholder="Job title"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Job/Task Observed *</Label>
                        <Input 
                          required 
                          value={formData.jobTaskObserved} 
                          onChange={e => setFormData({...formData, jobTaskObserved: e.target.value})}
                          placeholder="Describe the task"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SHEQ Procedure Ref No.</Label>
                        <Input 
                          value={formData.sheqRefNo} 
                          onChange={e => setFormData({...formData, sheqRefNo: e.target.value})}
                          placeholder="SOP-XXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time on Job (Months)</Label>
                        <Input 
                          type="number"
                          value={formData.timeOnJob?.months} 
                          onChange={e => setFormData({
                            ...formData, 
                            timeOnJob: { ...formData.timeOnJob!, months: e.target.value }
                          })}
                          placeholder="Months"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time on Job (Years)</Label>
                        <Input 
                          type="number"
                          value={formData.timeOnJob?.years} 
                          onChange={e => setFormData({
                            ...formData, 
                            timeOnJob: { ...formData.timeOnJob!, years: e.target.value }
                          })}
                          placeholder="Years"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 2: Observation Context */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Notification & Type
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Type of Observation</Label>
                          <RadioGroup 
                            value={formData.observationType} 
                            onValueChange={(v: ObservationType) => setFormData({...formData, observationType: v})}
                            className="flex gap-4"
                          >
                            {OBSERVATION_TYPES.map(type => (
                              <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={`type-${type}`} />
                                <Label htmlFor={`type-${type}`}>{type}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label>Told in Advance?</Label>
                          <RadioGroup 
                            value={formData.notification?.toldInAdvance} 
                            onValueChange={(v: YesNoType) => setFormData({
                              ...formData, 
                              notification: { toldInAdvance: v }
                            })}
                            className="flex gap-4"
                          >
                            {YES_NO_OPTIONS.map(option => (
                              <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`advance-${option}`} />
                                <Label htmlFor={`advance-${option}`}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <History className="h-4 w-4" />
                          Reasons for Observation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { key: 'monthly', label: 'Monthly Observation' },
                          { key: 'newEmployee', label: 'New Employee' },
                          { key: 'safetyAwareness', label: 'Safety Awareness' },
                          { key: 'incidentFollowUp', label: 'Incident Follow up' },
                          { key: 'trainingFollowUp', label: 'Training Follow up' },
                          { key: 'infrequentTask', label: 'Infrequently Performed' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox 
                              id={key}
                              checked={formData.reasons?.[key as keyof Reasons]}
                              onCheckedChange={(checked) => 
                                setFormData({
                                  ...formData,
                                  reasons: { 
                                    ...formData.reasons!, 
                                    [key]: checked === true 
                                  }
                                })
                              }
                            />
                            <Label htmlFor={key} className="text-sm cursor-pointer">{label}</Label>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 3: Risk Assessment */}
                  <Card className="border-t-4 border-t-primary">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" />
                        Risk Assessment & Procedure Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <RiskRow 
                        label="Is there a SHEQ Work Procedure for this job?"
                        value={formData.procedures?.hasProcedure || 'No'}
                        onChange={(v) => setFormData({
                          ...formData,
                          procedures: { ...formData.procedures!, hasProcedure: v }
                        })}
                      />
                      <RiskRow 
                        label="Is the employee familiar with the procedure?"
                        value={formData.procedures?.familiarWithProcedure || 'No'}
                        onChange={(v) => setFormData({
                          ...formData,
                          procedures: { ...formData.procedures!, familiarWithProcedure: v }
                        })}
                      />
                      <RiskRow 
                        label="HAS THE RISK ASSESSMENT BEEN MADE?"
                        value={formData.riskAssessment?.made || 'No'}
                        onChange={(v) => setFormData({
                          ...formData,
                          riskAssessment: { ...formData.riskAssessment!, made: v }
                        })}
                      />
                      <RiskRow 
                        label="HAS THE EMPLOYEE IDENTIFIED HAZARDS/RISKS/CONTROLS?"
                        value={formData.riskAssessment?.identified || 'No'}
                        onChange={(v) => setFormData({
                          ...formData,
                          riskAssessment: { ...formData.riskAssessment!, identified: v }
                        })}
                      />
                      <RiskRow 
                        label="ARE THE RECOMMENDED CONTROLS EFFECTIVE?"
                        value={formData.riskAssessment?.effective || 'No'}
                        onChange={(v) => setFormData({
                          ...formData,
                          riskAssessment: { ...formData.riskAssessment!, effective: v }
                        })}
                      />
                    </CardContent>
                  </Card>

                  {/* Section 4: Suggested Remedies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Suggested Remedies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'newProcedure', label: 'New Procedure' },
                          { key: 'reviseExisting', label: 'Revise Existing' },
                          { key: 'differentEquipment', label: 'Different Equipment' },
                          { key: 'engineeringControls', label: 'Engineering Controls' },
                          { key: 'retraining', label: 'Retraining' },
                          { key: 'improvedPPE', label: 'Improved PPE' },
                          { key: 'placementOfWorker', label: 'Placement of Worker' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <Label className="text-sm">{label}</Label>
                            <RadioGroup 
                              value={formData.suggestedRemedies?.[key as keyof SuggestedRemedies] || 'No'}
                              onValueChange={(v: YesNoType) => 
                                setFormData({
                                  ...formData,
                                  suggestedRemedies: { 
                                    ...formData.suggestedRemedies!, 
                                    [key]: v 
                                  }
                                })
                              }
                              className="flex gap-3"
                            >
                              {YES_NO_OPTIONS.map(option => (
                                <div key={option} className="flex items-center space-x-1">
                                  <RadioGroupItem value={option} id={`${key}-${option}`} />
                                  <Label htmlFor={`${key}-${option}`} className="text-xs">{option}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 5: Scope & Follow-up */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Observation Scope</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup 
                          value={formData.observationScope} 
                          onValueChange={(v: 'All' | 'Partial') => setFormData({...formData, observationScope: v})}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="All" id="scope-all" />
                            <Label htmlFor="scope-all">All</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Partial" id="scope-partial" />
                            <Label htmlFor="scope-partial">Partial</Label>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Follow-up Needed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup 
                          value={formData.followUpNeeded} 
                          onValueChange={(v: YesNoType) => setFormData({...formData, followUpNeeded: v})}
                          className="flex gap-4"
                        >
                          {YES_NO_OPTIONS.map(option => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`followup-${option}`} />
                              <Label htmlFor={`followup-${option}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 6: Action Plan */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Action Plan
                        </CardTitle>
                        <CardDescription>
                          Describe follow-up actions, procedures, or equipment improvements.
                        </CardDescription>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addActionItem}>
                        <Plus className="h-4 w-4 mr-2" /> Add Action
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.actionPlan && formData.actionPlan.length > 0 ? (
                        formData.actionPlan.map((item, index) => (
                          <ActionPlanItemComponent
                            key={item.id}
                            item={item}
                            index={index}
                            onChange={updateActionItem}
                            onRemove={removeActionItem}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-lg">
                          <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No action items added.</p>
                          <Button type="button" variant="outline" size="sm" onClick={addActionItem} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" /> Add Your First Action
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      {editingReport ? 'Update' : 'Submit'} Report
                    </Button>
                  </div>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Detail Modal */}
          <PTODetailModal
            report={selectedReport}
            open={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedReport(null);
            }}
            onEdit={(r) => {
              setIsDetailModalOpen(false);
              handleEdit(r);
            }}
            onDelete={(id) => {
              setIsDetailModalOpen(false);
              setDeleteConfirm(id);
            }}
            onStatusChange={handleStatusChange}
          />

          {/* Delete Confirmation */}
          <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this PTO report? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
}