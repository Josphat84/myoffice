//Pachedu
//frontend/app/pachedu/page.tsx

'use client';

import React, { useState, useEffect, useMemo } from "react";
import { 
  HeartHandshake, Search, FilterX, Save, 
  AlertTriangle, CheckSquare, Users, 
  ClipboardList, Activity, Info, ShieldCheck,
  Eye, Pencil, Trash2, Loader2, ChevronDown, ChevronUp,
  Calendar, User, MapPin, FileText, Target, CheckCircle,
  XCircle, LayoutGrid, Table as TableIcon, Maximize2, Minimize2,
  ChevronsDown, ChevronsUp, MoreVertical, RefreshCw,
  Send, HardHat, Wrench, Zap, Building2, X, Plus,
  Award, Flag, BookOpen, BarChart3, PieChart, TrendingUp,
  Clock, Clock3, AlertCircle, FileCheck, ClipboardCheck,
  Heart, Hand, Shield, Users2, Briefcase, Home
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
type BehaviourType = 'Intentional' | 'Unintentional';
type PacheduStatus = 'draft' | 'submitted' | 'reviewed' | 'closed';

interface Impact {
  id: string;
  name: string;
  selected: boolean;
}

interface ChecklistItem {
  id: string;
  category: string;
  name: string;
  selected: boolean;
}

interface PacheduReport {
  id: string;
  location: string;
  date: string;
  activityObserved: string;
  whatDidYouSee: string;
  reasons: string;
  behaviourType: BehaviourType;
  impacts: string[];
  whatDidYouDo: string;
  observerName: string;
  dept: string;
  sdwt: string;
  sectionChoice: SectionType;
  checklist: string[];
  status: PacheduStatus;
  created_at: string;
  updated_at?: string;
  submitted_at?: string;
}

interface PacheduStats {
  total: number;
  bySection: Record<SectionType, number>;
  byDept: Record<string, number>;
  byBehaviour: Record<BehaviourType, number>;
  totalImpacts: number;
  totalChecklist: number;
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

const BEHAVIOUR_TYPES: BehaviourType[] = ['Intentional', 'Unintentional'];

const BEHAVIOUR_VARIANTS: Record<BehaviourType, { color: string; bg: string; icon: any }> = {
  'Intentional': { color: 'text-orange-700', bg: 'bg-orange-50', icon: Flag },
  'Unintentional': { color: 'text-blue-700', bg: 'bg-blue-50', icon: AlertCircle }
};

const STATUS_VARIANTS: Record<PacheduStatus, { color: string; bg: string; label: string }> = {
  'draft': { color: 'text-gray-700', bg: 'bg-gray-100', label: 'Draft' },
  'submitted': { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Submitted' },
  'reviewed': { color: 'text-purple-700', bg: 'bg-purple-100', label: 'Reviewed' },
  'closed': { color: 'text-green-700', bg: 'bg-green-100', label: 'Closed' }
};

const IMPACT_OPTIONS = [
  "Minor injury",
  "Serious injury",
  "Fatality",
  "Damage To Property/RTA",
  "Increased Cost",
  "Loss of Production",
  "Environmental Impact",
  "Health threat"
];

const CHECKLIST_CATEGORIES = [
  {
    name: "PERSONAL BEHAVIOUR",
    items: [
      "Competence",
      "Operating speed",
      "Operating authority",
      "Explosives handling",
      "Personal positioning",
      "Checklist completion",
      "Condoning unsafe behaviour",
      "Communication/Horseplay",
      "Working on unsafe equipment"
    ]
  },
  {
    name: "TOOLS & EQUIPMENT",
    items: [
      "Machine condition",
      "Water blast/blowpipe",
      "Lockout system",
      "Service pipes",
      "Pinch bar/gaskets",
      "Gas testers",
      "Ladders/Platforms",
      "Safety chains",
      "Warning signs"
    ]
  },
  {
    name: "WORKING CONDITIONS",
    items: [
      "General housekeeping",
      "Illumination",
      "Ventilation/Dust",
      "Ground support",
      "Pools of water",
      "Air/Water leaks",
      "Oil leaks",
      "Noxious atmosphere",
      "Confined space",
      "Fire hazards",
      "Noise"
    ]
  },
  {
    name: "HUMAN NATURE & TASK",
    items: [
      "Stress",
      "Shortcuts",
      "Attitude/Mindset",
      "Complacency",
      "Unclear responsibilities",
      "High workload",
      "Time pressure",
      "Multi-tasking",
      "Illness/Fatigue",
      "Inexperienced"
    ]
  }
];

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

async function getPacheduReports(params?: {
  search?: string;
  section?: string;
  dept?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}): Promise<PacheduReport[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.section) queryParams.append('section', params.section);
  if (params?.dept) queryParams.append('dept', params.dept);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);

  try {
    const data = await fetchAPI<PacheduReport[]>(`/api/pachedu/?${queryParams.toString()}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching Pachedu reports:', error);
    return [];
  }
}

async function getPacheduReport(id: string): Promise<PacheduReport | null> {
  try {
    return await fetchAPI<PacheduReport>(`/api/pachedu/${id}`);
  } catch (error) {
    console.error('Error fetching Pachedu report:', error);
    return null;
  }
}

async function createPacheduReport(report: Partial<PacheduReport>): Promise<PacheduReport | null> {
  try {
    return await fetchAPI<PacheduReport>('/api/pachedu/', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error creating Pachedu report:', error);
    return null;
  }
}

async function updatePacheduReport(id: string, report: Partial<PacheduReport>): Promise<PacheduReport | null> {
  try {
    return await fetchAPI<PacheduReport>(`/api/pachedu/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Error updating Pachedu report:', error);
    return null;
  }
}

async function deletePacheduReport(id: string): Promise<boolean> {
  try {
    await fetchAPI(`/api/pachedu/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting Pachedu report:', error);
    return false;
  }
}

async function getPacheduStats(): Promise<PacheduStats> {
  try {
    const data = await fetchAPI<any>('/api/pachedu/stats/overview');
    return {
      total: data?.total || 0,
      bySection: data?.bySection || { Mechanical: 0, Electrical: 0 },
      byDept: data?.byDept || {},
      byBehaviour: data?.byBehaviour || { 'Intentional': 0, 'Unintentional': 0 },
      totalImpacts: data?.totalImpacts || 0,
      totalChecklist: data?.totalChecklist || 0,
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
      byDept: {},
      byBehaviour: { 'Intentional': 0, 'Unintentional': 0 },
      totalImpacts: 0,
      totalChecklist: 0,
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

const calculateStats = (reports: PacheduReport[]): PacheduStats => {
  const stats: PacheduStats = {
    total: reports.length,
    bySection: { Mechanical: 0, Electrical: 0 },
    byDept: {},
    byBehaviour: { 'Intentional': 0, 'Unintentional': 0 },
    totalImpacts: 0,
    totalChecklist: 0,
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

    // Count by department
    if (report.dept) {
      stats.byDept[report.dept] = (stats.byDept[report.dept] || 0) + 1;
    }

    // Count by behaviour type
    if (report.behaviourType) {
      stats.byBehaviour[report.behaviourType]++;
    }

    // Count by status
    if (report.status) {
      if (report.status === 'draft') stats.draftCount++;
      else if (report.status === 'submitted') stats.submittedCount++;
      else if (report.status === 'reviewed') stats.reviewedCount++;
      else if (report.status === 'closed') stats.closedCount++;
    }

    // Count impacts
    if (report.impacts?.length) {
      stats.totalImpacts += report.impacts.length;
    }

    // Count checklist items
    if (report.checklist?.length) {
      stats.totalChecklist += report.checklist.length;
    }
  });

  return stats;
};

// =============== PACHEDU CARD COMPONENT ===============
interface PacheduCardProps {
  report: PacheduReport;
  index: number;
  onView: (report: PacheduReport) => void;
  onEdit: (report: PacheduReport) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: PacheduStatus) => void;
}

const PacheduCard: React.FC<PacheduCardProps> = ({
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
  const behaviourVariant = BEHAVIOUR_VARIANTS[report.behaviourType];
  const BehaviourIcon = behaviourVariant.icon;
  
  const hasRisks = report.impacts?.includes("Serious injury") || 
                   report.impacts?.includes("Fatality") ||
                   report.impacts?.includes("Environmental Impact");

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 overflow-hidden"
      style={{ borderLeftColor: hasRisks ? '#ef4444' : '#f97316' }}
      onClick={() => onView(report)}
    >
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-orange-50 to-transparent p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-100">
                <HeartHandshake className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={`${sectionVariant.bg} ${sectionVariant.text} border-0 text-xs`}>
                    <SectionIcon className="h-3 w-3 mr-1" />
                    {report.sectionChoice}
                  </Badge>
                  <Badge className={`${behaviourVariant.bg} ${behaviourVariant.color} border-0 text-xs`}>
                    <BehaviourIcon className="h-3 w-3 mr-1" />
                    {report.behaviourType}
                  </Badge>
                  {hasRisks && (
                    <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      High Risk
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-muted-foreground">Care #{index + 1}</p>
                <h3 className="font-semibold text-base line-clamp-1 mt-1">{report.observerName || 'Anonymous'}</h3>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-t border-b bg-muted/20">
          <div className="text-center">
            <div className="text-lg font-semibold">{report.impacts?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Impacts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{report.checklist?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Checklist</div>
          </div>
          <div className="text-center">
            <Badge className={`${statusVariant.bg} ${statusVariant.color} border-0`}>
              {statusVariant.label}
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{report.location || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(report.date)}</span>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Activity Observed</p>
            <p className="text-sm line-clamp-2">{report.activityObserved || 'N/A'}</p>
          </div>

          {report.dept && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Users className="h-3 w-3 mr-1" />
              {report.dept}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// =============== PACHEDU DETAIL MODAL ===============
interface PacheduDetailModalProps {
  report: PacheduReport | null;
  open: boolean;
  onClose: () => void;
  onEdit: (report: PacheduReport) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: PacheduStatus) => void;
}

const PacheduDetailModal: React.FC<PacheduDetailModalProps> = ({
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
  const behaviourVariant = BEHAVIOUR_VARIANTS[report.behaviourType];
  const BehaviourIcon = behaviourVariant.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-orange-600" />
            Pachedu: Be Your Brother's Keeper
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
                  {report.behaviourType}
                </Badge>
                <Badge className={`${statusVariant.bg} ${statusVariant.color} border-0`}>
                  {statusVariant.label}
                </Badge>
                <Badge variant="outline" className="bg-muted">
                  ID: {report.id.slice(0, 8)}
                </Badge>
              </div>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{report.location || 'N/A'}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(report.date)}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Observer</p>
                <p className="font-medium">{report.observerName || 'Anonymous'}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium">{report.dept || 'N/A'}</p>
              </div>
            </div>

            {/* Activity Observed */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Activity Observed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm p-3 bg-muted/30 rounded-lg">{report.activityObserved || 'N/A'}</p>
              </CardContent>
            </Card>

            {/* What Did You See & Reasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">What did you see?</CardTitle>
                  <p className="text-xs text-muted-foreground">Waonei? / Uboneni?</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm p-3 bg-muted/30 rounded-lg whitespace-pre-wrap">
                    {report.whatDidYouSee || 'N/A'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Reasons</CardTitle>
                  <p className="text-xs text-muted-foreground">Zvikonzero / Isizatho</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm p-3 bg-muted/30 rounded-lg whitespace-pre-wrap">
                    {report.reasons || 'N/A'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* What Did You Do */}
            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">What did you do to ensure you Care?</CardTitle>
                <p className="text-xs text-muted-foreground">Waitei chinoratidza kuti unehanya neumwe wako? / Wenzeni ukuvikelela omunye wakho.</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm p-3 bg-muted/30 rounded-lg whitespace-pre-wrap">
                  {report.whatDidYouDo || 'N/A'}
                </p>
              </CardContent>
            </Card>

            {/* Impacts */}
            {report.impacts && report.impacts.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Potential Impacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {report.impacts.map((impact, idx) => (
                      <Badge key={idx} className={
                        impact.includes("Serious") || impact.includes("Fatality") 
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }>
                        {impact}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Checklist */}
            {report.checklist && report.checklist.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Referral Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {report.checklist.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="justify-start bg-blue-50 text-blue-700">
                        <CheckCircle className="h-3 w-3 mr-2" />
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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

// =============== MAIN PAGE ===============
export default function PacheduFormPage() {
  const [reports, setReports] = useState<PacheduReport[]>([]);
  const [stats, setStats] = useState<PacheduStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [selectedReport, setSelectedReport] = useState<PacheduReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<PacheduReport | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  // Form State
  const [formData, setFormData] = useState<Partial<PacheduReport>>({
    location: "",
    date: new Date().toISOString().split('T')[0],
    activityObserved: "",
    whatDidYouSee: "",
    reasons: "",
    behaviourType: "Unintentional",
    impacts: [],
    whatDidYouDo: "",
    observerName: "",
    dept: "",
    sdwt: "",
    sectionChoice: "Mechanical",
    checklist: [],
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
        getPacheduReports(),
        getPacheduStats()
      ]);
      
      setReports(reportsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load Pachedu reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImpactToggle = (impact: string) => {
    setFormData(prev => ({
      ...prev,
      impacts: prev.impacts?.includes(impact)
        ? prev.impacts.filter(i => i !== impact)
        : [...(prev.impacts || []), impact]
    }));
  };

  const handleChecklistToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist?.includes(item)
        ? prev.checklist.filter(i => i !== item)
        : [...(prev.checklist || []), item]
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.location?.trim()) {
      toast.error('Location is required');
      return false;
    }
    if (!formData.activityObserved?.trim()) {
      toast.error('Activity observed is required');
      return false;
    }
    if (!formData.whatDidYouSee?.trim()) {
      toast.error('Please describe what you saw');
      return false;
    }
    if (!formData.whatDidYouDo?.trim()) {
      toast.error('Please describe what you did');
      return false;
    }
    if (!formData.date) {
      toast.error('Date is required');
      return false;
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
      let savedReport: PacheduReport | null = null;

      if (editingReport) {
        savedReport = await updatePacheduReport(editingReport.id, {
          ...formData,
          updated_at: new Date().toISOString()
        });
        if (savedReport) {
          setReports(prev => prev.map(r => r.id === savedReport?.id ? savedReport : r));
          toast.success('Pachedu observation updated successfully');
        }
      } else {
        savedReport = await createPacheduReport({
          ...formData,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        });
        if (savedReport) {
          setReports(prev => [savedReport!, ...prev]);
          toast.success('Pachedu observation saved. Thank you for making PPM a safe place to work!');
        }
      }

      if (savedReport) {
        const newStats = await getPacheduStats();
        setStats(newStats);
      }

      // Reset form
      setFormData({
        location: "",
        date: new Date().toISOString().split('T')[0],
        activityObserved: "",
        whatDidYouSee: "",
        reasons: "",
        behaviourType: "Unintentional",
        impacts: [],
        whatDidYouDo: "",
        observerName: "",
        dept: "",
        sdwt: "",
        sectionChoice: "Mechanical",
        checklist: [],
        status: "draft"
      });
      setIsFormModalOpen(false);
      setEditingReport(null);
    } catch (error) {
      console.error('Failed to save Pachedu report:', error);
      toast.error('Failed to save observation');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: PacheduStatus) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    const updatedReport = { ...report, status: newStatus };
    
    // Optimistic update
    setReports(prev => prev.map(r => r.id === id ? updatedReport : r));

    try {
      const saved = await updatePacheduReport(id, { status: newStatus });
      if (!saved) {
        setReports(prev => prev.map(r => r.id === id ? report : r));
        toast.error('Failed to update status');
      } else {
        toast.success(`Status updated to ${newStatus}`);
        const newStats = await getPacheduStats();
        setStats(newStats);
      }
    } catch (error) {
      setReports(prev => prev.map(r => r.id === id ? report : r));
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (report: PacheduReport) => {
    setEditingReport(report);
    setFormData({
      location: report.location,
      date: report.date,
      activityObserved: report.activityObserved,
      whatDidYouSee: report.whatDidYouSee,
      reasons: report.reasons,
      behaviourType: report.behaviourType,
      impacts: report.impacts,
      whatDidYouDo: report.whatDidYouDo,
      observerName: report.observerName,
      dept: report.dept,
      sdwt: report.sdwt,
      sectionChoice: report.sectionChoice,
      checklist: report.checklist,
      status: report.status
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deletePacheduReport(id);
      if (success) {
        setReports(prev => prev.filter(r => r.id !== id));
        const newStats = await getPacheduStats();
        setStats(newStats);
        toast.success('Pachedu observation deleted successfully');
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete Pachedu report:', error);
      toast.error('Failed to delete observation');
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
          report.location?.toLowerCase().includes(searchLower) ||
          report.activityObserved?.toLowerCase().includes(searchLower) ||
          report.whatDidYouSee?.toLowerCase().includes(searchLower) ||
          report.dept?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Section filter
      if (selectedSection !== 'all' && report.sectionChoice !== selectedSection) {
        return false;
      }
      
      // Department filter
      if (selectedDept !== 'all' && report.dept !== selectedDept) {
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
  }, [reports, searchTerm, selectedSection, selectedDept, selectedStatus, dateRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSection('all');
    setSelectedDept('all');
    setSelectedStatus('all');
    setDateRange({ from: null, to: null });
  };

  // Get unique departments
  const uniqueDepts = useMemo(() => {
    if (!stats) return [];
    return Object.keys(stats.byDept);
  }, [stats]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto py-10 px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HeartHandshake className="h-10 w-10 text-orange-600" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Pachedu
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Be Your Brother's Keeper - Care Observations
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-500">
                <span>PICKSTONE PEERLESS MINE | BMS-PPM-7.4-STP-07: FRM-010</span>
                <Badge className="bg-orange-600">Revision: 0</Badge>
              </div>
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
                  location: "",
                  date: new Date().toISOString().split('T')[0],
                  activityObserved: "",
                  whatDidYouSee: "",
                  reasons: "",
                  behaviourType: "Unintentional",
                  impacts: [],
                  whatDidYouDo: "",
                  observerName: "",
                  dept: "",
                  sdwt: "",
                  sectionChoice: "Mechanical",
                  checklist: [],
                  status: "draft"
                });
                setIsFormModalOpen(true);
              }} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> New Care Observation
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <HeartHandshake className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Care</p>
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
                  <AlertTriangle className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{stats.byBehaviour['Intentional']}</p>
                  <p className="text-xs text-muted-foreground">Intentional</p>
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
                    placeholder="Search by observer, location, activity..."
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

                {/* Department Filter */}
                <Select value={selectedDept} onValueChange={setSelectedDept}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepts.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
                {(searchTerm || selectedSection !== 'all' || selectedDept !== 'all' || 
                  selectedStatus !== 'all' || dateRange.from || dateRange.to) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    <FilterX className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredReports.length} of {reports.length} observations
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
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
                <HeartHandshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No care observations found</h3>
                <p className="text-muted-foreground mb-6">
                  {reports.length === 0 
                    ? "Be the first to record a Pachedu observation."
                    : "Try adjusting your filters to see more results."}
                </p>
                {reports.length === 0 ? (
                  <Button onClick={() => setIsFormModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Create First Observation
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
                  <PacheduCard
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
                        <TableHead>Date</TableHead>
                        <TableHead>Observer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Behaviour</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => {
                        const statusVariant = STATUS_VARIANTS[report.status];
                        const behaviourVariant = BEHAVIOUR_VARIANTS[report.behaviourType];
                        
                        return (
                          <TableRow key={report.id}>
                            <TableCell>{formatDate(report.date)}</TableCell>
                            <TableCell className="font-medium">{report.observerName || 'Anonymous'}</TableCell>
                            <TableCell>{report.location}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{report.activityObserved}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={SECTION_VARIANTS[report.sectionChoice].bg}>
                                {React.createElement(SECTION_ICONS[report.sectionChoice], { className: "h-3 w-3 mr-1" })}
                                {report.sectionChoice}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${behaviourVariant.bg} ${behaviourVariant.color} border-0`}>
                                {report.behaviourType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusVariant.bg} ${statusVariant.color} border-0`}>
                                {statusVariant.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
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
                  <HeartHandshake className="h-6 w-6 text-orange-600" />
                  {editingReport ? 'Edit Care Observation' : 'New Care Observation'}
                </DialogTitle>
                <DialogDescription>
                  Record a Pachedu "Be Your Brother's Keeper" observation. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  {/* Basic Info */}
                  <Card>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                      <div className="space-y-2">
                        <Label>Location *</Label>
                        <Input 
                          value={formData.location} 
                          onChange={e => setFormData({...formData, location: e.target.value})}
                          placeholder="Where did this occur?"
                          required
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
                        <Label>Section *</Label>
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
                      <div className="md:col-span-3 space-y-2">
                        <Label>Activity Observed *</Label>
                        <Input 
                          value={formData.activityObserved} 
                          onChange={e => setFormData({...formData, activityObserved: e.target.value})}
                          placeholder="What activity was being performed?"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Observation Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-l-4 border-l-orange-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase">What did you see? *</CardTitle>
                        <p className="text-xs text-muted-foreground">Waonei? / Uboneni?</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea 
                          className="min-h-[120px]" 
                          value={formData.whatDidYouSee} 
                          onChange={e => setFormData({...formData, whatDidYouSee: e.target.value})}
                          placeholder="Describe what you observed..."
                          required
                        />
                        <div className="space-y-1">
                          <Label className="text-xs font-bold">Reasons</Label>
                          <p className="text-xs text-muted-foreground mb-1">Zvikonzero / Isizatho</p>
                          <Textarea 
                            value={formData.reasons} 
                            onChange={e => setFormData({...formData, reasons: e.target.value})}
                            placeholder="Why do you think this happened?"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase">What did you do to ensure you Care? *</CardTitle>
                        <p className="text-xs text-muted-foreground">Waitei chinoratidza kuti unehanya neumwe wako? / Wenzeni ukuvikelela omunye wakho.</p>
                      </CardHeader>
                      <CardContent>
                        <Textarea 
                          className="min-h-[200px]" 
                          value={formData.whatDidYouDo} 
                          onChange={e => setFormData({...formData, whatDidYouDo: e.target.value})}
                          placeholder="Describe the actions you took..."
                          required
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Impacts & Behaviour */}
                  <Card>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                      <div className="space-y-4">
                        <Label className="font-bold text-orange-700 uppercase text-xs">Could this result in? [cite: 15]</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {IMPACT_OPTIONS.map(impact => (
                            <div key={impact} className="flex items-center space-x-2">
                              <Checkbox 
                                id={impact} 
                                checked={formData.impacts?.includes(impact)} 
                                onCheckedChange={() => handleImpactToggle(impact)} 
                              />
                              <Label htmlFor={impact} className="text-xs leading-tight cursor-pointer">{impact}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                        <Label className="font-bold uppercase text-xs">Behaviour Classification [cite: 14]</Label>
                        <div className="flex gap-4">
                          {BEHAVIOUR_TYPES.map(type => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox 
                                id={type} 
                                checked={formData.behaviourType === type}
                                onCheckedChange={() => setFormData({...formData, behaviourType: type})}
                              />
                              <Label htmlFor={type} className="text-sm cursor-pointer">{type}</Label>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="space-y-1">
                            <Label className="text-xs">Observer Name</Label>
                            <Input 
                              className="h-8" 
                              value={formData.observerName} 
                              onChange={e => setFormData({...formData, observerName: e.target.value})}
                              placeholder="Your name"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Department</Label>
                            <Input 
                              className="h-8" 
                              value={formData.dept} 
                              onChange={e => setFormData({...formData, dept: e.target.value})}
                              placeholder="Your department"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">SDWT</Label>
                            <Input 
                              className="h-8" 
                              value={formData.sdwt} 
                              onChange={e => setFormData({...formData, sdwt: e.target.value})}
                              placeholder="SDWT number"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Checklist */}
                  <Card>
                    <CardHeader className="bg-slate-900 text-white py-3">
                      <CardTitle className="text-xs uppercase tracking-wider">Referral Checklist [cite: 18]</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
                      {CHECKLIST_CATEGORIES.map(category => (
                        <div key={category.name} className="space-y-2">
                          <p className="font-bold text-xs border-b border-orange-500 pb-1 text-orange-600 uppercase tracking-wider">
                            {category.name}
                          </p>
                          {category.items.map(item => (
                            <div key={item} className="flex items-start gap-2">
                              <Checkbox 
                                id={item} 
                                className="mt-0.5 h-3 w-3"
                                checked={formData.checklist?.includes(item)}
                                onCheckedChange={() => handleChecklistToggle(item)}
                              />
                              <Label htmlFor={item} className="text-xs leading-tight cursor-pointer">{item}</Label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Footer */}
                  <div className="flex flex-col items-center gap-4 py-4 border-t">
                    <p className="text-sm font-black italic text-center text-orange-700">
                      "Tinokutendai nekuita kuti PPM ive inoshandika zvisina njodzi."
                    </p>
                    <div className="flex justify-end gap-2 w-full">
                      <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[200px]">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        {editingReport ? 'Update' : 'Submit'} Care Observation
                      </Button>
                    </div>
                  </div>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Detail Modal */}
          <PacheduDetailModal
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
                  Are you sure you want to delete this care observation? This action cannot be undone.
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