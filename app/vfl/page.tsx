//visible felt leadership
//frontend/app/vfl/page.tsx     

'use client';

import React, { useState, useEffect, useMemo } from "react";
import { 
  Eye, Search, FilterX, Save, UserPlus, 
  MessageSquare, Briefcase, Clock, Calendar, 
  LayoutDashboard, CheckCircle2, Plus, Trash2,
  Loader2, ChevronDown, ChevronUp, User, FileText,
  AlertTriangle, Info, Target, CheckCircle, XCircle,
  LayoutGrid, Table as TableIcon, Maximize2, Minimize2,
  ChevronsDown, ChevronsUp, MoreVertical, RefreshCw,
  Send, HardHat, Shield, Activity, Award, Flag,
  PenTool, BookOpen, Users, BarChart3, PieChart,
  TrendingUp, Clock3, AlertCircle, FileCheck, ClipboardList,
  Zap
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
type BehaviourCategory = 'Safe Behaviour' | 'Unsafe Behaviour';
type ObservationType = 'Safe Behaviour' | 'Safe Condition' | 'At Risk Behaviour' | 'At Risk Condition';
type CoachingTechnique = 'SBR' | 'CC';
type VFLStatus = 'draft' | 'submitted' | 'reviewed' | 'closed';

interface ActionItem {
  id: string;
  action: string;
  responsible: string;
  targetDate: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
  completedDate?: string;
  remarks?: string;
}

interface VFLReport {
  id: string;
  observerName: string;
  designation: string;
  sectionChoice: SectionType;
  departmentSection: string;
  date: string;
  time: string;
  behaviourCategory: BehaviourCategory;
  observationType: ObservationType;
  description: string;
  coachingTechnique: CoachingTechnique;
  actions: ActionItem[];
  status: VFLStatus;
  created_at: string;
  updated_at?: string;
  submitted_at?: string;
}

interface VFLStats {
  total: number;
  bySection: Record<SectionType, number>;
  byObserver: Record<string, number>;
  byBehaviour: Record<BehaviourCategory, number>;
  byObservationType: Record<ObservationType, number>;
  byCoaching: Record<CoachingTechnique, number>;
  totalActions: number;
  completedActions: number;
  pendingActions: number;
  inProgressActions: number;
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
  Mechanical: HardHat,
  Electrical: Zap
};

const BEHAVIOUR_CATEGORIES: BehaviourCategory[] = ['Safe Behaviour', 'Unsafe Behaviour'];

const BEHAVIOUR_VARIANTS: Record<BehaviourCategory, { color: string; bg: string; icon: any }> = {
  'Safe Behaviour': { color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
  'Unsafe Behaviour': { color: 'text-red-700', bg: 'bg-red-50', icon: AlertTriangle }
};

const OBSERVATION_TYPES: ObservationType[] = [
  'Safe Behaviour',
  'Safe Condition',
  'At Risk Behaviour',
  'At Risk Condition'
];

const OBSERVATION_VARIANTS: Record<ObservationType, { color: string; bg: string }> = {
  'Safe Behaviour': { color: 'text-green-700', bg: 'bg-green-50' },
  'Safe Condition': { color: 'text-emerald-700', bg: 'bg-emerald-50' },
  'At Risk Behaviour': { color: 'text-orange-700', bg: 'bg-orange-50' },
  'At Risk Condition': { color: 'text-red-700', bg: 'bg-red-50' }
};

const COACHING_TECHNIQUES: CoachingTechnique[] = ['SBR', 'CC'];

const COACHING_VARIANTS: Record<CoachingTechnique, { color: string; bg: string; description: string }> = {
  'SBR': { 
    color: 'text-purple-700', 
    bg: 'bg-purple-50',
    description: 'Situation, Behaviour, Result'
  },
  'CC': { 
    color: 'text-indigo-700', 
    bg: 'bg-indigo-50',
    description: 'Coaching Conversation'
  }
};

const STATUS_VARIANTS: Record<VFLStatus, { color: string; bg: string; label: string }> = {
  'draft': { color: 'text-gray-700', bg: 'bg-gray-100', label: 'Draft' },
  'submitted': { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Submitted' },
  'reviewed': { color: 'text-purple-700', bg: 'bg-purple-100', label: 'Reviewed' },
  'closed': { color: 'text-green-700', bg: 'bg-green-100', label: 'Closed' }
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

async function getVFLReports(params?: {
  search?: string;
  section?: string;
  observer?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}): Promise<VFLReport[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.section) queryParams.append('section', params.section);
  if (params?.observer) queryParams.append('observer', params.observer);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);

  try {
    const data = await fetchAPI<VFLReport[]>(`/api/vfl/?${queryParams.toString()}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching VFL reports:', error);
    return [];
  }
}

async function getVFLReport(id: string): Promise<VFLReport | null> {
  try {
    return await fetchAPI<VFLReport>(`/api/vfl/${id}`);
  } catch (error) {
    console.error('Error fetching VFL report:', error);
    return null;
  }
}

async function createVFLReport(report: Partial<VFLReport>): Promise<VFLReport | null> {
  try {
    return await fetchAPI<VFLReport>('/api/vfl/', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error creating VFL report:', error);
    return null;
  }
}

async function updateVFLReport(id: string, report: Partial<VFLReport>): Promise<VFLReport | null> {
  try {
    return await fetchAPI<VFLReport>(`/api/vfl/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error updating VFL report:', error);
    return null;
  }
}

async function deleteVFLReport(id: string): Promise<boolean> {
  try {
    await fetchAPI(`/api/vfl/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting VFL report:', error);
    return false;
  }
}

async function getVFLStats(): Promise<VFLStats> {
  try {
    const data = await fetchAPI<any>('/api/vfl/stats/overview');
    return {
      total: data?.total || 0,
      bySection: data?.bySection || { Mechanical: 0, Electrical: 0 },
      byObserver: data?.byObserver || {},
      byBehaviour: data?.byBehaviour || { 'Safe Behaviour': 0, 'Unsafe Behaviour': 0 },
      byObservationType: data?.byObservationType || {},
      byCoaching: data?.byCoaching || { 'SBR': 0, 'CC': 0 },
      totalActions: data?.totalActions || 0,
      completedActions: data?.completedActions || 0,
      pendingActions: data?.pendingActions || 0,
      inProgressActions: data?.inProgressActions || 0,
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
      byBehaviour: { 'Safe Behaviour': 0, 'Unsafe Behaviour': 0 },
      byObservationType: {},
      byCoaching: { 'SBR': 0, 'CC': 0 },
      totalActions: 0,
      completedActions: 0,
      pendingActions: 0,
      inProgressActions: 0,
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

const formatTime = (timeStr: string): string => {
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

const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const calculateStats = (reports: VFLReport[]): VFLStats => {
  const stats: VFLStats = {
    total: reports.length,
    bySection: { Mechanical: 0, Electrical: 0 },
    byObserver: {},
    byBehaviour: { 'Safe Behaviour': 0, 'Unsafe Behaviour': 0 },
    byObservationType: {
      'Safe Behaviour': 0,
      'Safe Condition': 0,
      'At Risk Behaviour': 0,
      'At Risk Condition': 0
    },
    byCoaching: { 'SBR': 0, 'CC': 0 },
    totalActions: 0,
    completedActions: 0,
    pendingActions: 0,
    inProgressActions: 0,
    draftCount: 0,
    submittedCount: 0,
    reviewedCount: 0,
    closedCount: 0
  };

  reports.forEach(report => {
    // Count by section
    if (report.sectionChoice) {
      stats.bySection[report.sectionChoice]++;
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

    // Count by behaviour category
    if (report.behaviourCategory) {
      stats.byBehaviour[report.behaviourCategory]++;
    }

    // Count by observation type
    if (report.observationType) {
      stats.byObservationType[report.observationType]++;
    }

    // Count by coaching technique
    if (report.coachingTechnique) {
      stats.byCoaching[report.coachingTechnique]++;
    }

    // Count actions
    if (report.actions?.length) {
      stats.totalActions += report.actions.length;
      report.actions.forEach(action => {
        if (action.status === 'Completed') {
          stats.completedActions++;
        } else if (action.status === 'In Progress') {
          stats.inProgressActions++;
        } else {
          stats.pendingActions++;
        }
      });
    }
  });

  return stats;
};

// =============== ACTION ITEM COMPONENT ===============
interface ActionItemProps {
  item: ActionItem;
  index: number;
  onChange: (id: string, field: keyof ActionItem, value: any) => void;
  onRemove?: (id: string) => void;
}

const ActionItemComponent: React.FC<ActionItemProps> = ({ item, index, onChange, onRemove }) => {
  return (
    <div className="group relative bg-white rounded-lg border p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700">
          {index + 1}
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Action Description *</Label>
            <Input 
              value={item.action} 
              onChange={e => onChange(item.id, 'action', e.target.value)}
              placeholder="Describe the action..."
              className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-emerald-600"
            />
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Responsible Person *</Label>
            <Input 
              value={item.responsible} 
              onChange={e => onChange(item.id, 'responsible', e.target.value)}
              placeholder="Name"
              className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-emerald-600"
            />
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Target Date *</Label>
            <Input 
              type="date" 
              value={item.targetDate} 
              onChange={e => onChange(item.id, 'targetDate', e.target.value)}
              className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-emerald-600"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
            <Select
              value={item.status || 'Pending'}
              onValueChange={(v) => onChange(item.id, 'status', v)}
            >
              <SelectTrigger className="border-0 bg-muted/30">
                <SelectValue />
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
                className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-emerald-600"
              />
            </div>
          )}

          <div className="md:col-span-3">
            <Label className="text-xs text-muted-foreground mb-1 block">Remarks (Optional)</Label>
            <Textarea 
              value={item.remarks || ''}
              onChange={e => onChange(item.id, 'remarks', e.target.value)}
              placeholder="Add any additional notes..."
              className="border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-emerald-600 resize-none"
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

// =============== VFL CARD COMPONENT ===============
interface VFLCardProps {
  report: VFLReport;
  index: number;
  onView: (report: VFLReport) => void;
  onEdit: (report: VFLReport) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: VFLStatus) => void;
}

const VFLCard: React.FC<VFLCardProps> = ({
  report,
  index,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const SectionIcon = SECTION_ICONS[report.sectionChoice];
  const sectionVariant = SECTION_VARIANTS[report.sectionChoice];
  const statusVariant = STATUS_VARIANTS[report.status];
  const behaviourVariant = BEHAVIOUR_VARIANTS[report.behaviourCategory];
  const BehaviourIcon = behaviourVariant.icon;
  
  const totalActions = report.actions?.length || 0;
  const completedActions = report.actions?.filter(a => a.status === 'Completed').length || 0;
  const inProgressActions = report.actions?.filter(a => a.status === 'In Progress').length || 0;
  const progress = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 overflow-hidden"
      style={{ borderLeftColor: report.behaviourCategory === 'Unsafe Behaviour' ? '#ef4444' : '#10b981' }}
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
                    {report.sectionChoice}
                  </Badge>
                  <Badge className={`${behaviourVariant.bg} ${behaviourVariant.color} border-0 text-xs`}>
                    <BehaviourIcon className="h-3 w-3 mr-1" />
                    {report.behaviourCategory}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">VFL #{index + 1}</p>
                <h3 className="font-semibold text-base line-clamp-1 mt-1">{report.observerName}</h3>
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
                  <PenTool className="h-4 w-4 mr-2" /> Edit
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
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Close
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
              <span className="font-medium truncate">{report.designation || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(report.time)}</span>
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

          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Observation</p>
            <p className="text-sm line-clamp-2">{report.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={COACHING_VARIANTS[report.coachingTechnique].bg}>
              {report.coachingTechnique}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============== VFL DETAIL MODAL ===============
interface VFLDetailModalProps {
  report: VFLReport | null;
  open: boolean;
  onClose: () => void;
  onEdit: (report: VFLReport) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: VFLStatus) => void;
}

const VFLDetailModal: React.FC<VFLDetailModalProps> = ({
  report,
  open,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  if (!report) return null;

  const SectionIcon = SECTION_ICONS[report.sectionChoice];
  const sectionVariant = SECTION_VARIANTS[report.sectionChoice];
  const statusVariant = STATUS_VARIANTS[report.status];
  const behaviourVariant = BEHAVIOUR_VARIANTS[report.behaviourCategory];
  const BehaviourIcon = behaviourVariant.icon;
  const coachingVariant = COACHING_VARIANTS[report.coachingTechnique];
  
  const totalActions = report.actions?.length || 0;
  const completedActions = report.actions?.filter(a => a.status === 'Completed').length || 0;
  const inProgressActions = report.actions?.filter(a => a.status === 'In Progress').length || 0;
  const progress = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Eye className="h-6 w-6 text-emerald-600" />
            Visible Felt Leadership Observation
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
                  <p className="text-sm font-medium">{report.sectionChoice}</p>
                  <p className="text-xs text-muted-foreground">Section</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={`${behaviourVariant.bg} ${behaviourVariant.color} border-0`}>
                  <BehaviourIcon className="h-3 w-3 mr-1" />
                  {report.behaviourCategory}
                </Badge>
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
                <p className="text-xs text-muted-foreground">Designation</p>
                <p className="font-medium">{report.designation || 'N/A'}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(report.date)}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium">{formatTime(report.time)}</p>
              </div>
            </div>

            {/* Department Info */}
            {report.departmentSection && (
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Department/Section</p>
                <p className="font-medium">{report.departmentSection}</p>
              </div>
            )}

            {/* Observation Details Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Observation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Observation Type</p>
                  <Badge className={OBSERVATION_VARIANTS[report.observationType].bg}>
                    {report.observationType}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm p-3 bg-muted/30 rounded-lg whitespace-pre-wrap">
                    {report.description}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Coaching Technique</p>
                  <Badge className={`${coachingVariant.bg} ${coachingVariant.color}`}>
                    {report.coachingTechnique} - {coachingVariant.description}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Action Plan */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Action Plan ({report.actions?.length || 0})
              </h3>
              <div className="space-y-3">
                {report.actions && report.actions.length > 0 ? (
                  report.actions.map((action, idx) => (
                    <Card key={action.id} className="overflow-hidden">
                      <div className={`h-1 w-full ${
                        action.status === 'Completed' ? 'bg-green-500' :
                        action.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Action #{idx + 1}</span>
                            <Badge className={
                              action.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              action.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }>
                              {action.status || 'Pending'}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm"><span className="font-medium">Action:</span> {action.action}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded">
                            <div><span className="text-muted-foreground">By:</span> {action.responsible}</div>
                            <div><span className="text-muted-foreground">Target:</span> {formatDate(action.targetDate)}</div>
                            {action.completedDate && (
                              <div><span className="text-muted-foreground">Completed:</span> {formatDate(action.completedDate)}</div>
                            )}
                          </div>
                          {action.remarks && (
                            <p className="text-sm italic border-l-2 border-emerald-500 pl-3">{action.remarks}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
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
                <CheckCircle2 className="h-4 w-4 mr-2" /> Close
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => {
            onClose();
            onEdit(report);
          }}>
            <PenTool className="h-4 w-4 mr-2" /> Edit
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

// =============== MAIN PAGE ===============
export default function VFLObservationPage() {
  const [reports, setReports] = useState<VFLReport[]>([]);
  const [stats, setStats] = useState<VFLStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [selectedReport, setSelectedReport] = useState<VFLReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<VFLReport | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedObserver, setSelectedObserver] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBehaviour, setSelectedBehaviour] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  // Form State
  const [formData, setFormData] = useState<Partial<VFLReport>>({
    observerName: "",
    designation: "",
    sectionChoice: "Mechanical",
    departmentSection: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    behaviourCategory: "Safe Behaviour",
    observationType: "Safe Behaviour",
    description: "",
    coachingTechnique: "SBR",
    actions: [],
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
        getVFLReports(),
        getVFLStats()
      ]);
      
      setReports(reportsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load VFL reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addActionItem = () => {
    const newItem: ActionItem = {
      id: Math.random().toString(36).substr(2, 9),
      action: "",
      responsible: "",
      targetDate: "",
      status: "Pending"
    };
    setFormData(prev => ({
      ...prev,
      actions: [...(prev.actions || []), newItem]
    }));
  };

  const updateActionItem = (id: string, field: keyof ActionItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions?.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ) || []
    }));
  };

  const removeActionItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions?.filter(item => item.id !== id) || []
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.observerName?.trim()) {
      toast.error('Observer name is required');
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

    // Validate action items
    if (formData.actions?.length) {
      for (let i = 0; i < formData.actions.length; i++) {
        const item = formData.actions[i];
        if (!item.action?.trim()) {
          toast.error(`Action #${i + 1}: Description is required`);
          return false;
        }
        if (!item.responsible?.trim()) {
          toast.error(`Action #${i + 1}: Responsible person is required`);
          return false;
        }
        if (!item.targetDate) {
          toast.error(`Action #${i + 1}: Target date is required`);
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
      let savedReport: VFLReport | null = null;

      if (editingReport) {
        savedReport = await updateVFLReport(editingReport.id, {
          ...formData,
          updated_at: new Date().toISOString()
        });
        if (savedReport) {
          setReports(prev => prev.map(r => r.id === savedReport?.id ? savedReport : r));
          toast.success('VFL report updated successfully');
        }
      } else {
        savedReport = await createVFLReport({
          ...formData,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        });
        if (savedReport) {
          setReports(prev => [savedReport!, ...prev]);
          toast.success('VFL observation recorded successfully');
        }
      }

      if (savedReport) {
        const newStats = await getVFLStats();
        setStats(newStats);
      }

      // Reset form
      setFormData({
        observerName: "",
        designation: "",
        sectionChoice: "Mechanical",
        departmentSection: "",
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        behaviourCategory: "Safe Behaviour",
        observationType: "Safe Behaviour",
        description: "",
        coachingTechnique: "SBR",
        actions: [],
        status: "draft"
      });
      setIsFormModalOpen(false);
      setEditingReport(null);
    } catch (error) {
      console.error('Failed to save VFL report:', error);
      toast.error('Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: VFLStatus) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    const updatedReport = { ...report, status: newStatus };
    
    // Optimistic update
    setReports(prev => prev.map(r => r.id === id ? updatedReport : r));

    try {
      const saved = await updateVFLReport(id, { status: newStatus });
      if (!saved) {
        setReports(prev => prev.map(r => r.id === id ? report : r));
        toast.error('Failed to update status');
      } else {
        toast.success(`Status updated to ${newStatus}`);
        const newStats = await getVFLStats();
        setStats(newStats);
      }
    } catch (error) {
      setReports(prev => prev.map(r => r.id === id ? report : r));
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (report: VFLReport) => {
    setEditingReport(report);
    setFormData({
      observerName: report.observerName,
      designation: report.designation,
      sectionChoice: report.sectionChoice,
      departmentSection: report.departmentSection,
      date: report.date,
      time: report.time,
      behaviourCategory: report.behaviourCategory,
      observationType: report.observationType,
      description: report.description,
      coachingTechnique: report.coachingTechnique,
      actions: report.actions || [],
      status: report.status
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteVFLReport(id);
      if (success) {
        setReports(prev => prev.filter(r => r.id !== id));
        const newStats = await getVFLStats();
        setStats(newStats);
        toast.success('VFL report deleted successfully');
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete VFL report:', error);
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
          report.designation?.toLowerCase().includes(searchLower) ||
          report.description?.toLowerCase().includes(searchLower) ||
          report.departmentSection?.toLowerCase().includes(searchLower) ||
          report.actions?.some(a => a.action?.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }
      
      // Section filter
      if (selectedSection !== 'all' && report.sectionChoice !== selectedSection) {
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

      // Behaviour filter
      if (selectedBehaviour !== 'all' && report.behaviourCategory !== selectedBehaviour) {
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
  }, [reports, searchTerm, selectedSection, selectedObserver, selectedStatus, selectedBehaviour, dateRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSection('all');
    setSelectedObserver('all');
    setSelectedStatus('all');
    setSelectedBehaviour('all');
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
                <Eye className="h-10 w-10 text-emerald-600" />
                Visible Felt Leadership
              </h1>
              <p className="text-lg text-muted-foreground">
                Safety observations and coaching tracking
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
                  observerName: "",
                  designation: "",
                  sectionChoice: "Mechanical",
                  departmentSection: "",
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                  behaviourCategory: "Safe Behaviour",
                  observationType: "Safe Behaviour",
                  description: "",
                  coachingTechnique: "SBR",
                  actions: [],
                  status: "draft"
                });
                setIsFormModalOpen(true);
              }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> New VFL
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
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
                  <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.closedCount}</p>
                  <p className="text-xs text-muted-foreground">Closed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.byBehaviour['Unsafe Behaviour']}</p>
                  <p className="text-xs text-muted-foreground">Unsafe</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.byBehaviour['Safe Behaviour']}</p>
                  <p className="text-xs text-muted-foreground">Safe</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.totalActions}</p>
                  <p className="text-xs text-muted-foreground">Actions</p>
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
                    placeholder="Search by observer, description, actions..."
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

                {/* Behaviour Filter */}
                <Select value={selectedBehaviour} onValueChange={setSelectedBehaviour}>
                  <SelectTrigger className="w-full lg:w-[150px]">
                    <SelectValue placeholder="All Behaviour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Behaviour</SelectItem>
                    {BEHAVIOUR_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
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
                  selectedStatus !== 'all' || selectedBehaviour !== 'all' || dateRange.from || dateRange.to) && (
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
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
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
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No VFL reports found</h3>
                <p className="text-muted-foreground mb-6">
                  {reports.length === 0 
                    ? "Get started by creating your first Visible Felt Leadership observation."
                    : "Try adjusting your filters to see more results."}
                </p>
                {reports.length === 0 ? (
                  <Button onClick={() => setIsFormModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Create First VFL
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
                  <VFLCard
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
                        <TableHead>Designation</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Behaviour</TableHead>
                        <TableHead>Coaching</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => {
                        const statusVariant = STATUS_VARIANTS[report.status];
                        const behaviourVariant = BEHAVIOUR_VARIANTS[report.behaviourCategory];
                        const coachingVariant = COACHING_VARIANTS[report.coachingTechnique];
                        
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
                              <TableCell>{report.designation || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={SECTION_VARIANTS[report.sectionChoice].bg}>
                                  {React.createElement(SECTION_ICONS[report.sectionChoice], { className: "h-3 w-3 mr-1" })}
                                  {report.sectionChoice}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${behaviourVariant.bg} ${behaviourVariant.color} border-0`}>
                                  {report.behaviourCategory}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={coachingVariant.bg}>
                                  {report.coachingTechnique}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${statusVariant.bg} ${statusVariant.color} border-0`}>
                                  {statusVariant.label}
                                </Badge>
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
                                      <PenTool className="h-4 w-4 mr-2" /> Edit
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
                                      <CheckCircle2 className="h-4 w-4 mr-2" /> Close
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
                                <TableCell colSpan={9} className="p-4">
                                  <div className="space-y-3">
                                    <h4 className="font-medium">Observation Description:</h4>
                                    <p className="text-sm bg-background p-3 rounded-lg border">
                                      {report.description}
                                    </p>
                                    {report.actions && report.actions.length > 0 && (
                                      <>
                                        <h4 className="font-medium mt-4">Action Plan:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          {report.actions.map((action, idx) => (
                                            <div key={action.id} className="bg-background p-3 rounded-lg border">
                                              <div className="flex items-start justify-between mb-2">
                                                <span className="text-xs font-medium text-muted-foreground">Action #{idx + 1}</span>
                                                <Badge className={
                                                  action.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                  action.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                  'bg-yellow-100 text-yellow-700'
                                                }>
                                                  {action.status || 'Pending'}
                                                </Badge>
                                              </div>
                                              <p className="text-sm mb-2">{action.action}</p>
                                              <div className="flex gap-4 text-xs text-muted-foreground">
                                                <span>By: {action.responsible}</span>
                                                <span>Due: {formatDate(action.targetDate)}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </>
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Eye className="h-6 w-6 text-emerald-600" />
                  {editingReport ? 'Edit VFL Observation' : 'New VFL Observation'}
                </DialogTitle>
                <DialogDescription>
                  Record a Visible Felt Leadership observation. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  {/* Personnel Information */}
                  <Card className="border-t-4 border-t-emerald-600">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Personnel Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Observer’s Name *</Label>
                        <Input 
                          required 
                          value={formData.observerName} 
                          onChange={e => setFormData({...formData, observerName: e.target.value})}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Designation</Label>
                        <Input 
                          value={formData.designation} 
                          onChange={e => setFormData({...formData, designation: e.target.value})}
                          placeholder="Job title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Section Choice *</Label>
                        <Select 
                          value={formData.sectionChoice} 
                          onValueChange={(v: SectionType) => setFormData({...formData, sectionChoice: v})}
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
                        <Label>Department/Section</Label>
                        <Input 
                          value={formData.departmentSection} 
                          onChange={e => setFormData({...formData, departmentSection: e.target.value})}
                          placeholder="e.g., Production, Maintenance"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="date" 
                            value={formData.date} 
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            className="pl-9"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Time *</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="time" 
                            value={formData.time} 
                            onChange={e => setFormData({...formData, time: e.target.value})}
                            className="pl-9"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Observation & Coaching */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Observation & Coaching</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-emerald-700 font-bold uppercase text-xs">Behaviour Category *</Label>
                          <RadioGroup 
                            value={formData.behaviourCategory} 
                            onValueChange={(v: BehaviourCategory) => setFormData({...formData, behaviourCategory: v})}
                          >
                            <div className="flex gap-4">
                              {BEHAVIOUR_CATEGORIES.map(cat => (
                                <div key={cat} className="flex items-center space-x-2">
                                  <RadioGroupItem value={cat} id={`cat-${cat}`} />
                                  <Label htmlFor={`cat-${cat}`}>{cat}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-emerald-700 font-bold uppercase text-xs">Observation Type *</Label>
                          <RadioGroup 
                            value={formData.observationType} 
                            onValueChange={(v: ObservationType) => setFormData({...formData, observationType: v})}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {OBSERVATION_TYPES.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                  <RadioGroupItem value={type} id={type} />
                                  <Label htmlFor={type} className="text-xs">{type}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea 
                          placeholder="Relate details of observation..."
                          className="min-h-[120px]" 
                          value={formData.description} 
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          required
                        />
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <Label className="font-bold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" /> 
                          Coaching Technique Used: *
                        </Label>
                        <RadioGroup 
                          value={formData.coachingTechnique} 
                          className="flex gap-8"
                          onValueChange={(v: CoachingTechnique) => setFormData({...formData, coachingTechnique: v})}
                        >
                          {COACHING_TECHNIQUES.map(tech => (
                            <div key={tech} className="flex items-center space-x-2">
                              <RadioGroupItem value={tech} id={tech} />
                              <Label htmlFor={tech} className="font-bold">{tech}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Plan */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Actions to Rectify / Reinforce
                        </CardTitle>
                        <CardDescription>
                          Define actions to address unsafe behaviours or reinforce safe ones.
                        </CardDescription>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addActionItem}>
                        <Plus className="h-4 w-4 mr-2" /> Add Action
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.actions && formData.actions.length > 0 ? (
                        formData.actions.map((item, index) => (
                          <ActionItemComponent
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
                          <p className="text-sm text-muted-foreground">No actions added yet.</p>
                          <Button type="button" variant="outline" size="sm" onClick={addActionItem} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" /> Add Your First Action
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <div className="p-4 border-t bg-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic text-right">
                        Observer Signature Required on Printout
                      </p>
                    </div>
                  </Card>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      {editingReport ? 'Update' : 'Save'} VFL Report
                    </Button>
                  </div>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Detail Modal */}
          <VFLDetailModal
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
                  Are you sure you want to delete this VFL report? This action cannot be undone.
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