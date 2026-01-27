// frontend/app/maintenance/page.tsx

'use client';
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { WorkOrderForm } from "@/components/work-orders/work-orders-form";
import { 
  FileText, 
  Plus, 
  Filter, 
  RefreshCw, 
  CheckCircle2,
  Clock,
  PlayCircle,
  PauseCircle,
  Users,
  Wrench,
  Search,
  Grid,
  List,
  Eye,
  Calendar,
  User,
  Building,
  ArrowUpDown,
  X,
  ToolCase,
  Edit,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  BarChart,
  ClipboardList,
  Tag,
  ClipboardCheck,
  Signature,
  Timer,
  Copy,
  CalendarDays,
  Repeat,
  Trash2,
  Printer,
  Layers,
  Circle,
  AlertCircle,
  Percent,
  XCircle,
  CalendarOff} from "lucide-react";

// ==================== TYPES ====================
interface JobType {
  operational: boolean;
  maintenance: boolean;
  mining: boolean;
}

interface ManpowerRow {
  id: string;
  grade: string;
  requiredNumber: string;
  requiredUnitTime: string;
  totalManHours: string;
}

interface WorkOrderFormData {
  toDepartment: string;
  toSection: string;
  dateRaised: string;
  workOrderNumber: string;
  fromDepartment: string;
  fromSection: string;
  timeRaised: string;
  accountNumber: string;
  equipmentInfo: string;
  userLabToday: string;
  jobType: JobType;
  jobRequestDetails: string;
  requestedBy: string;
  authorisingForeman: string;
  authorisingEngineer: string;
  allocatedTo: string;
  estimatedHours: string;
  responsibleForeman: string;
  jobInstructions: string;
  manpower: ManpowerRow[];
  workDoneDetails: string;
  causeOfFailure: string;
  delayDetails: string;
  artisanName: string;
  artisanSign: string;
  artisanDate: string;
  foremanName: string;
  foremanSign: string;
  foremanDate: string;
  timeWorkStarted: string;
  timeWorkFinished: string;
  totalTimeWorked: string;
  overtimeStartTime: string;
  overtimeEndTime: string;
  overtimeHours: string;
  delayFromTime: string;
  delayToTime: string;
  totalDelayHours: string;
}

type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled' | 'postponed' | 'not-done';
type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

interface WorkOrder extends WorkOrderFormData {
  id: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  progress: number; // 0-100 percentage
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  location?: string;
  actualHours?: number;
  actualCost?: number;
  costEstimate?: number;
  safetyLevel?: 'low' | 'medium' | 'high';
  completedAt?: string;
  completedBy?: string;
  cancellationReason?: string;
  postponeDate?: string;
  notes?: string;
  attachments?: string[];
  tags?: string[];
  history?: {
    date: string;
    action: string;
    user: string;
    details: string;
  }[];
}

// Preset Work Order Templates
interface WorkOrderPreset {
  id: string;
  name: string;
  description: string;
  template: Partial<WorkOrderFormData>;
  category: string;
  estimatedTime: number;
  requiredSkills: string[];
  recurrence?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    startDate: string;
    endDate?: string;
    time?: string;
  };
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  useCount: number;
}

interface WorkOrderStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
  postponed: number;
  notDone: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  efficiency: number;
  avgCompletionTime: number;
  overdueCount: number;
  totalCost: number;
  costSavings: number;
  safetyScore: number;
  completionRate: number;
}

interface DashboardData {
  totalWorkOrders: number;
  completed: number;
  inProgress: number;
  pending: number;
  onHold: number;
  cancelled: number;
  postponed: number;
  notDone: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  efficiency: number;
  trending: 'improving' | 'declining' | 'stable';
  recommendations: string[];
  avgCompletionTime: number;
  overdueCount: number;
  totalCost: number;
  costSavings: number;
  safetyScore: number;
  teamPerformance: number;
  completionRate: number;
}

type ViewMode = 'grid' | 'list' | 'minimalist';
type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt' | 'allocatedTo' | 'toDepartment' | 'estimatedHours' | 'artisanName' | 'equipmentInfo' | 'dateRaised' | 'progress' | 'completedAt';
type SortOrder = 'asc' | 'desc';

// ==================== API FUNCTIONS ====================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getWorkOrders = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/maintenance/work-orders`);
    if (!response.ok) throw new Error(`Failed to fetch work orders: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching work orders:', error);
    const localWorkOrders = localStorage.getItem('workOrders');
    if (localWorkOrders) return JSON.parse(localWorkOrders);
    return [];
  }
};

const createWorkOrder = async (workOrderData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/api/maintenance/work-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workOrderData),
    });

    if (!response.ok) throw new Error(`Failed to create work order: ${response.status}`);
    const result = await response.json();
    
    const existingWorkOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const newWorkOrder = {
      ...workOrderData,
      id: result.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('workOrders', JSON.stringify([...existingWorkOrders, newWorkOrder]));
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating work order:', error);
    const existingWorkOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const newWorkOrder = {
      ...workOrderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('workOrders', JSON.stringify([...existingWorkOrders, newWorkOrder]));
    return { success: true, data: newWorkOrder, error: 'Work order saved locally' };
  }
};

const updateWorkOrder = async (id: string, updates: any): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/api/maintenance/work-orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error(`Failed to update work order: ${response.status}`);
    const result = await response.json();
    
    const existingWorkOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const updatedWorkOrders = existingWorkOrders.map((wo: any) => 
      wo.id === id ? { ...wo, ...updates, updatedAt: new Date().toISOString() } : wo
    );
    localStorage.setItem('workOrders', JSON.stringify(updatedWorkOrders));
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating work order:', error);
    const existingWorkOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const updatedWorkOrders = existingWorkOrders.map((wo: any) => 
      wo.id === id ? { ...wo, ...updates, updatedAt: new Date().toISOString() } : wo
    );
    localStorage.setItem('workOrders', JSON.stringify(updatedWorkOrders));
    return { success: true, error: 'Updated locally' };
  }
};

const deleteWorkOrder = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/api/maintenance/work-orders/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error(`Failed to delete work order: ${response.status}`);
    
    const existingWorkOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const updatedWorkOrders = existingWorkOrders.filter((wo: any) => wo.id !== id);
    localStorage.setItem('workOrders', JSON.stringify(updatedWorkOrders));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting work order:', error);
    const existingWorkOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const updatedWorkOrders = existingWorkOrders.filter((wo: any) => wo.id !== id);
    localStorage.setItem('workOrders', JSON.stringify(updatedWorkOrders));
    return { success: true, error: 'Deleted locally' };
  }
};

// ==================== COMPACT WORK ORDER DETAILS MODAL WITH QUICK VIEW ====================
interface WorkOrderDetailsModalProps {
  workOrder: WorkOrder;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (workOrder: WorkOrder) => void;
  onUpdateStatus: (id: string, status: WorkOrderStatus, progress?: number, notes?: string) => void;
  onDelete: (id: string) => void;
}

function WorkOrderDetailsModal({ workOrder, isOpen, onClose, onEdit, onUpdateStatus, onDelete }: WorkOrderDetailsModalProps) {
  const [notes, setNotes] = useState(workOrder.notes || '');
  const [progress, setProgress] = useState(workOrder.progress);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus>(workOrder.status);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    jobDetails: false,
    workDone: false,
    timeTracking: false,
    personnel: false,
    signatures: false,
    notes: false
  });

  const formatJobType = (jobType: JobType) => {
    const types = [];
    if (jobType.operational) types.push('Operational');
    if (jobType.maintenance) types.push('Maintenance');
    if (jobType.mining) types.push('Mining');
    return types.join(', ') || 'Not specified';
  };

  const getStatusConfig = (status: WorkOrderStatus) => {
    const configs = {
      'pending': { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
      'in-progress': { icon: PlayCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
      'completed': { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
      'on-hold': { icon: PauseCircle, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
      'cancelled': { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
      'postponed': { icon: CalendarOff, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
      'not-done': { icon: AlertCircle, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority: WorkOrderPriority) => {
    const configs = {
      'urgent': { color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white', label: 'Urgent' },
      'high': { color: 'bg-gradient-to-r from-orange-500 to-red-400 text-white', label: 'High' },
      'medium': { color: 'bg-gradient-to-r from-yellow-500 to-amber-400 text-white', label: 'Medium' },
      'low': { color: 'bg-gradient-to-r from-green-500 to-emerald-400 text-white', label: 'Low' },
    };
    return configs[priority] || configs.medium;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const StatusIcon = getStatusConfig(workOrder.status).icon;
  const statusConfig = getStatusConfig(workOrder.status);
  const priorityConfig = getPriorityConfig(workOrder.priority);

  const handleStatusUpdate = () => {
    onUpdateStatus(workOrder.id, selectedStatus, progress, notes);
    setShowStatusDialog(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this work order?')) {
      onDelete(workOrder.id);
      onClose();
    }
  };

  const statusOptions: { value: WorkOrderStatus; label: string; icon: any; description: string }[] = [
    { value: 'pending', label: 'Pending', icon: Clock, description: 'Work has not started yet' },
    { value: 'in-progress', label: 'In Progress', icon: PlayCircle, description: 'Work is currently being done' },
    { value: 'completed', label: 'Completed', icon: CheckCircle2, description: 'Work has been completed' },
    { value: 'on-hold', label: 'On Hold', icon: PauseCircle, description: 'Work is temporarily paused' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, description: 'Work has been cancelled' },
    { value: 'postponed', label: 'Postponed', icon: CalendarOff, description: 'Work has been postponed' },
    { value: 'not-done', label: 'Not Done', icon: AlertCircle, description: 'Work was not completed' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Work Order #{workOrder.workOrderNumber}</h2>
                <p className="text-blue-100 text-xs">{workOrder.equipmentInfo}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* View Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
                className="text-white hover:bg-white/20 h-8 px-2"
              >
                {viewMode === 'compact' ? (
                  <>
                    <Layers className="h-4 w-4 mr-1" />
                    <span className="text-xs">Details</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-xs">Quick View</span>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.print()}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Compact Status Bar */}
        <div className="bg-gray-50 border-b px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.color} ${statusConfig.bgColor} border ${statusConfig.borderColor} text-sm font-medium`}>
                <StatusIcon className="h-4 w-4" />
                <span className="capitalize">{workOrder.status.replace('-', ' ')}</span>
              </div>
              <div className={`px-3 py-1 rounded-full ${priorityConfig.color} text-sm font-medium`}>
                {priorityConfig.label} Priority
              </div>
              <div className="text-sm text-gray-600 ml-2">
                <Building className="h-3.5 w-3.5 inline mr-1" />
                {workOrder.toDepartment}
              </div>
              <div className="text-sm text-gray-600 ml-2">
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                {workOrder.dateRaised}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Progress: </span>
              <span className="text-sm font-bold">{progress}%</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'compact' ? (
            // COMPACT QUICK VIEW - Only key information
            <div className="p-4 space-y-4">
              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Machine & Basic Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ToolCase className="h-4 w-4" />
                      Machine & Basic Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-500">Machine</Label>
                        <div className="text-sm font-semibold p-2 bg-blue-50 rounded border">
                          {workOrder.equipmentInfo}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Date</Label>
                        <div className="text-sm font-semibold p-2 bg-gray-50 rounded border">
                          {workOrder.dateRaised}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-500">Work Request / Breakdown</Label>
                      <div className="text-sm p-2 bg-yellow-50 rounded border mt-1">
                        {workOrder.jobRequestDetails.length > 100 
                          ? `${workOrder.jobRequestDetails.substring(0, 100)}...` 
                          : workOrder.jobRequestDetails}
                      </div>
                      {workOrder.jobRequestDetails.length > 100 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection('jobDetails')}
                          className="w-full mt-1 text-xs text-blue-600"
                        >
                          {expandedSections.jobDetails ? 'Show Less' : 'Read More'}
                        </Button>
                      )}
                    </div>
                    
                    {expandedSections.jobDetails && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                        <div className="text-sm whitespace-pre-wrap">
                          {workOrder.jobRequestDetails}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Column 2: Work Done & Time */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4" />
                      Work Done & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {workOrder.workDoneDetails ? (
                      <div>
                        <Label className="text-xs text-gray-500">Work Done</Label>
                        <div className="text-sm p-2 bg-green-50 rounded border mt-1">
                          {workOrder.workDoneDetails.length > 100 
                            ? `${workOrder.workDoneDetails.substring(0, 100)}...` 
                            : workOrder.workDoneDetails}
                        </div>
                        {workOrder.workDoneDetails.length > 100 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection('workDone')}
                            className="w-full mt-1 text-xs text-green-600"
                          >
                            {expandedSections.workDone ? 'Show Less' : 'Read More'}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded border">
                        No work done details recorded
                      </div>
                    )}
                    
                    {expandedSections.workDone && workOrder.workDoneDetails && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg border">
                        <div className="text-sm whitespace-pre-wrap">
                          {workOrder.workDoneDetails}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-500">Time Taken</Label>
                        <div className="text-sm font-semibold p-2 bg-blue-50 rounded border">
                          {workOrder.totalTimeWorked || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Estimated</Label>
                        <div className="text-sm font-semibold p-2 bg-gray-50 rounded border">
                          {workOrder.estimatedHours}h
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSection('timeTracking')}
                      className="w-full text-xs"
                    >
                      <Timer className="h-3 w-3 mr-1" />
                      {expandedSections.timeTracking ? 'Hide' : 'Show'} Time Details
                    </Button>

                    {expandedSections.timeTracking && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border">
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-gray-600">Started:</span>
                              <div className="font-medium">{workOrder.timeWorkStarted || 'Not started'}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Finished:</span>
                              <div className="font-medium">{workOrder.timeWorkFinished || 'Not finished'}</div>
                            </div>
                          </div>
                          {workOrder.delayDetails && (
                            <div>
                              <span className="text-gray-600">Delay:</span>
                              <div className="font-medium">{workOrder.delayDetails}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Key Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Personnel Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Personnel
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection('personnel')}
                        className="ml-auto h-6 w-6 p-0"
                      >
                        {expandedSections.personnel ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Artisan</Label>
                        <div className="text-sm font-semibold">{workOrder.artisanName || 'Unassigned'}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Requested By</Label>
                        <div className="text-sm font-semibold">{workOrder.requestedBy}</div>
                      </div>
                    </div>

                    {expandedSections.personnel && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div>
                          <Label className="text-xs text-gray-500">Allocated To</Label>
                          <div className="text-sm">{workOrder.allocatedTo || 'N/A'}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Responsible Foreman</Label>
                          <div className="text-sm">{workOrder.responsibleForeman || 'N/A'}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Job Type & Department */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Type & Department
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500">Job Type</Label>
                        <div className="text-sm font-semibold p-2 bg-purple-50 rounded border">
                          {formatJobType(workOrder.jobType)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Department</Label>
                        <div className="text-sm font-semibold p-2 bg-gray-50 rounded border">
                          {workOrder.toDepartment}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Signatures */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Signature className="h-4 w-4" />
                      Signatures
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection('signatures')}
                        className="ml-auto h-6 w-6 p-0"
                      >
                        {expandedSections.signatures ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Artisan:</span>
                        <span className="text-sm font-semibold">{workOrder.artisanName || 'Not signed'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Foreman:</span>
                        <span className="text-sm font-semibold">{workOrder.foremanName || 'Not signed'}</span>
                      </div>
                    </div>

                    {expandedSections.signatures && (
                      <div className="mt-3 pt-3 border-t space-y-2 text-xs">
                        {workOrder.artisanDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Artisan Date:</span>
                            <span>{workOrder.artisanDate}</span>
                          </div>
                        )}
                        {workOrder.foremanDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Foreman Date:</span>
                            <span>{workOrder.foremanDate}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Details Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('detailed')}
                  className="w-full max-w-md"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            </div>
          ) : (
            // DETAILED VIEW (Existing Tabbed View)
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <div className="sticky top-0 bg-white border-b z-10">
                <TabsList className="grid grid-cols-5 h-10">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                  <TabsTrigger value="time" className="text-xs">Time Tracking</TabsTrigger>
                  <TabsTrigger value="personnel" className="text-xs">Personnel</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Equipment</Label>
                      <div className="text-sm font-medium">{workOrder.equipmentInfo}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Department</Label>
                      <div className="text-sm font-medium">{workOrder.toDepartment}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Date Raised</Label>
                      <div className="text-sm font-medium">{workOrder.dateRaised} {workOrder.timeRaised}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Artisan</Label>
                      <div className="text-sm font-medium">{workOrder.artisanName || 'Unassigned'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Estimated Hours</Label>
                      <div className="text-sm font-medium">{workOrder.estimatedHours} hours</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Job Type</Label>
                      <div className="text-sm font-medium">{formatJobType(workOrder.jobType)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-2">Request Details</Label>
                  <div className="bg-gray-50 p-3 rounded-lg border text-sm">
                    {workOrder.jobRequestDetails}
                  </div>
                </div>

                {workOrder.jobInstructions && (
                  <div>
                    <Label className="text-xs text-gray-500 mb-2">Instructions</Label>
                    <div className="bg-blue-50 p-3 rounded-lg border text-sm">
                      {workOrder.jobInstructions}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Work Order #</Label>
                      <div className="text-sm font-medium">{workOrder.workOrderNumber}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Account Number</Label>
                      <div className="text-sm font-medium">{workOrder.accountNumber || 'N/A'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">From Department</Label>
                      <div className="text-sm font-medium">{workOrder.fromDepartment || 'N/A'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">User Lab Today</Label>
                      <div className="text-sm font-medium">{workOrder.userLabToday || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Allocated To</Label>
                      <div className="text-sm font-medium">{workOrder.allocatedTo || 'Unassigned'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Responsible Foreman</Label>
                      <div className="text-sm font-medium">{workOrder.responsibleForeman || 'N/A'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Authorising Foreman</Label>
                      <div className="text-sm font-medium">{workOrder.authorisingForeman || 'N/A'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Requested By</Label>
                      <div className="text-sm font-medium">{workOrder.requestedBy}</div>
                    </div>
                  </div>
                </div>

                {workOrder.workDoneDetails && (
                  <div>
                    <Label className="text-xs text-gray-500 mb-2">Work Done</Label>
                    <div className="bg-green-50 p-3 rounded-lg border text-sm">
                      {workOrder.workDoneDetails}
                    </div>
                  </div>
                )}

                {workOrder.causeOfFailure && (
                  <div>
                    <Label className="text-xs text-gray-500 mb-2">Cause of Failure</Label>
                    <div className="bg-red-50 p-3 rounded-lg border text-sm">
                      {workOrder.causeOfFailure}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Time Tracking Tab */}
              <TabsContent value="time" className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Work Started</Label>
                      <div className="text-sm font-medium">{workOrder.timeWorkStarted || 'Not started'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Work Finished</Label>
                      <div className="text-sm font-medium">{workOrder.timeWorkFinished || 'Not finished'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1">Total Time Worked</Label>
                      <div className="text-sm font-medium">{workOrder.totalTimeWorked || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {workOrder.overtimeHours && (
                      <div>
                        <Label className="text-xs text-gray-500 mb-1">Overtime Hours</Label>
                        <div className="text-sm font-medium">{workOrder.overtimeHours}</div>
                      </div>
                    )}
                    {workOrder.delayDetails && (
                      <div>
                        <Label className="text-xs text-gray-500 mb-1">Delay Details</Label>
                        <div className="text-sm font-medium">{workOrder.delayDetails}</div>
                      </div>
                    )}
                    {workOrder.totalDelayHours && (
                      <div>
                        <Label className="text-xs text-gray-500 mb-1">Total Delay Hours</Label>
                        <div className="text-sm font-medium">{workOrder.totalDelayHours}</div>
                      </div>
                    )}
                  </div>
                </div>

                {workOrder.actualHours && (
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Estimated Hours: </span>
                        <span className="font-medium">{workOrder.estimatedHours}h</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Actual Hours: </span>
                        <span className="font-medium">{workOrder.actualHours}h</span>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Personnel Tab */}
              <TabsContent value="personnel" className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500 mb-2">Artisan</Label>
                      <div className="bg-purple-50 p-3 rounded-lg border">
                        <div className="font-medium text-sm">{workOrder.artisanName || 'Not assigned'}</div>
                        {workOrder.artisanDate && (
                          <div className="text-xs text-gray-500 mt-1">Signed: {workOrder.artisanDate}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-2">Foreman</Label>
                      <div className="bg-orange-50 p-3 rounded-lg border">
                        <div className="font-medium text-sm">{workOrder.foremanName || 'Not signed'}</div>
                        {workOrder.foremanDate && (
                          <div className="text-xs text-gray-500 mt-1">Signed: {workOrder.foremanDate}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500 mb-2">Manpower</Label>
                      {workOrder.manpower && workOrder.manpower.length > 0 ? (
                        <div className="space-y-2">
                          {workOrder.manpower.map((row, index) => (
                            <div key={row.id || `manpower-${index}`} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                              <span>{row.grade}</span>
                              <span>{row.requiredNumber} × {row.requiredUnitTime}h</span>
                              <span className="font-medium">{row.totalManHours}h</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border">No manpower specified</div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="p-4 space-y-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-2">Work Order Notes</Label>
                  <Textarea
                    placeholder="Add notes about this work order..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="mb-3"
                  />
                  <Button size="sm" onClick={() => toast.success('Notes saved')}>
                    Save Notes
                  </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {new Date(workOrder.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3" />
                    <span>Updated: {new Date(workOrder.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {workOrder.completedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Completed: {new Date(workOrder.completedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-3">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-600">
              {viewMode === 'compact' ? (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Quick View - Key Info Only
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Full Details View
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusDialog(true)}
                className="h-8 text-xs"
              >
                Update Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="h-8 text-xs text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
              <Button
                size="sm"
                onClick={() => onEdit(workOrder)}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Status Update Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Update Work Order Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-sm">Select Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedStatus === option.value ? "default" : "outline"}
                      className="justify-start h-auto py-2 text-xs"
                      onClick={() => setSelectedStatus(option.value)}
                    >
                      <option.icon className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{option.label}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Progress</Label>
                  <span className="text-sm font-bold">{progress}%</span>
                </div>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowStatusDialog(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleStatusUpdate}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// ==================== ELEGANT WORK ORDER PRESETS ====================
interface WorkOrderPresetsProps {
  presets: WorkOrderPreset[];
  onCreateFromPreset: (preset: WorkOrderPreset) => void;
  onEditPreset: (preset: WorkOrderPreset) => void;
  onDeletePreset: (id: string) => void;
}

function WorkOrderPresets({ presets, onCreateFromPreset, onEditPreset, onDeletePreset }: WorkOrderPresetsProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPreset, setNewPreset] = useState<Partial<WorkOrderPreset>>({
    name: '',
    description: '',
    category: 'Routine Maintenance',
    estimatedTime: 1,
    requiredSkills: [],
    recurrence: {
      enabled: false,
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [1],
      startDate: new Date().toISOString().split('T')[0],
      time: '09:00',
    },
    isActive: true,
    useCount: 0,
  });

  const categories = [
    'Routine Maintenance',
    'Preventive Maintenance',
    'Emergency Repair',
    'Safety Inspection',
    'Equipment Calibration',
    'System Upgrade',
    'Cleaning',
    'Installation',
  ];

  const handleCreatePreset = () => {
    if (!newPreset.name?.trim()) {
      toast.error('Preset name is required');
      return;
    }

    const preset: WorkOrderPreset = {
      id: `preset-${Date.now()}`,
      name: newPreset.name,
      description: newPreset.description || '',
      template: newPreset.template || {},
      category: newPreset.category || 'Routine Maintenance',
      estimatedTime: newPreset.estimatedTime || 1,
      requiredSkills: newPreset.requiredSkills || [],
      recurrence: newPreset.recurrence, 
      isActive: newPreset.isActive || true,
      createdAt: new Date().toISOString(),
      useCount: 0,
    };

    const existingPresets = JSON.parse(localStorage.getItem('workOrderPresets') || '[]');
    localStorage.setItem('workOrderPresets', JSON.stringify([...existingPresets, preset]));
    setShowCreateDialog(false);
    setNewPreset({
      name: '',
      description: '',
      category: 'Routine Maintenance',
      estimatedTime: 1,
      requiredSkills: [],
      recurrence: {
        enabled: false,
        frequency: 'weekly',
        interval: 1,
        startDate: new Date().toISOString().split('T')[0],
        time: '09:00',
      },
      isActive: true,
      useCount: 0,
    });
    toast.success('Preset created successfully');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Routine Maintenance': 'bg-blue-100 text-blue-800',
      'Preventive Maintenance': 'bg-green-100 text-green-800',
      'Emergency Repair': 'bg-red-100 text-red-800',
      'Safety Inspection': 'bg-orange-100 text-orange-800',
      'Equipment Calibration': 'bg-purple-100 text-purple-800',
      'System Upgrade': 'bg-indigo-100 text-indigo-800',
      'Cleaning': 'bg-cyan-100 text-cyan-800',
      'Installation': 'bg-amber-100 text-amber-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Work Order Templates</h3>
          <p className="text-sm text-gray-600">Create reusable templates for common work orders</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {presets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-4">
            <Copy className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Create your first work order template to save time on repetitive tasks
          </p>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <Card 
              key={preset.id} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-200/70 bg-white/90 backdrop-blur-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryColor(preset.category)} border-0 text-xs font-medium`}
                      >
                        {preset.category}
                      </Badge>
                      {preset.recurrence?.enabled && (
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                          <Repeat className="h-3 w-3 mr-1" />
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-sm font-semibold text-gray-900 mb-2">
                      {preset.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-600 line-clamp-2">
                      {preset.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mt-2 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onCreateFromPreset(preset)} className="cursor-pointer">
                        <Copy className="h-4 w-4 mr-2 text-blue-600" />
                        Use Template
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditPreset(preset)} className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2 text-green-600" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeletePreset(preset.id)} 
                        className="cursor-pointer text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50/50 p-2 rounded-lg">
                      <div className="text-xs text-gray-500">Estimated Time</div>
                      <div className="text-sm font-semibold">{preset.estimatedTime}h</div>
                    </div>
                    <div className="bg-gray-50/50 p-2 rounded-lg">
                      <div className="text-xs text-gray-500">Used</div>
                      <div className="text-sm font-semibold">{preset.useCount} times</div>
                    </div>
                  </div>
                  
                  {preset.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {preset.requiredSkills.slice(0, 3).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {preset.requiredSkills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{preset.requiredSkills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {preset.recurrence?.enabled && (
                    <div className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 p-3 rounded-lg border border-blue-200/50">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                        <div className="text-xs">
                          <div className="font-medium">Recurrence Schedule</div>
                          <div className="text-gray-600">
                            Every {preset.recurrence.interval} {preset.recurrence.frequency}(s) at {preset.recurrence.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="px-4 pb-4">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  onClick={() => onCreateFromPreset(preset)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Preset Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Work Order Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for work orders that you perform regularly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  placeholder="e.g., Weekly Machine Maintenance"
                  value={newPreset.name}
                  onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newPreset.category}
                  onValueChange={(value) => setNewPreset({ ...newPreset, category: value })}
                >
                  <SelectTrigger className="bg-white/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this template..."
                value={newPreset.description}
                onChange={(e) => setNewPreset({ ...newPreset, description: e.target.value })}
                rows={2}
                className="bg-white/50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Time (hours)</Label>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newPreset.estimatedTime}
                  onChange={(e) => setNewPreset({ ...newPreset, estimatedTime: parseFloat(e.target.value) || 1 })}
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Required Skills (comma separated)</Label>
                <Input
                  placeholder="e.g., Electrical, Mechanical, Welding"
                  value={newPreset.requiredSkills?.join(', ')}
                  onChange={(e) => setNewPreset({ 
                    ...newPreset, 
                    requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="bg-white/50"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Recurrence Settings</Label>
                <Switch
                  checked={newPreset.recurrence?.enabled}
                  onCheckedChange={(checked) =>
                    setNewPreset({
                      ...newPreset,
                      recurrence: { 
                        ...newPreset.recurrence!, 
                        enabled: checked,
                        frequency: 'weekly',
                        interval: 1,
                        startDate: new Date().toISOString().split('T')[0],
                        time: '09:00'
                      },
                    })
                  }
                />
              </div>
              {newPreset.recurrence?.enabled && (
                <div className="border rounded-lg p-4 space-y-4 bg-blue-50/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={newPreset.recurrence.frequency}
                        onValueChange={(value: any) =>
                          setNewPreset({
                            ...newPreset,
                            recurrence: { ...newPreset.recurrence!, frequency: value },
                          })
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Interval</Label>
                      <Select
                        value={newPreset.recurrence.interval.toString()}
                        onValueChange={(value) =>
                          setNewPreset({
                            ...newPreset,
                            recurrence: { ...newPreset.recurrence!, interval: parseInt(value) },
                          })
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 6, 8, 12].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              Every {num} {num === 1 ? newPreset.recurrence?.frequency?.slice(0, -2) : newPreset.recurrence?.frequency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newPreset.recurrence.startDate}
                        onChange={(e) =>
                          setNewPreset({
                            ...newPreset,
                            recurrence: { ...newPreset.recurrence!, startDate: e.target.value },
                          })
                        }
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time of Day</Label>
                      <Input
                        type="time"
                        value={newPreset.recurrence.time}
                        onChange={(e) =>
                          setNewPreset({
                            ...newPreset,
                            recurrence: { ...newPreset.recurrence!, time: e.target.value },
                          })
                        }
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePreset}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== COMPACT WORK ORDER CARD ====================
interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onEdit: (workOrder: WorkOrder) => void;
  onUpdate: (id: string, updates: Partial<WorkOrder>) => void;
  onDelete: (id: string) => void;
  viewMode: ViewMode;
  onViewDetails: (workOrder: WorkOrder) => void;
}

function WorkOrderCard({ workOrder, onEdit, onUpdate, onDelete, viewMode, onViewDetails }: WorkOrderCardProps) {
  const getStatusConfig = (status: WorkOrderStatus) => {
    const configs = {
      'pending': { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50/80', borderColor: 'border-yellow-200' },
      'in-progress': { icon: PlayCircle, color: 'text-blue-600', bgColor: 'bg-blue-50/80', borderColor: 'border-blue-200' },
      'completed': { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50/80', borderColor: 'border-green-200' },
      'on-hold': { icon: PauseCircle, color: 'text-orange-600', bgColor: 'bg-orange-50/80', borderColor: 'border-orange-200' },
      'cancelled': { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50/80', borderColor: 'border-red-200' },
      'postponed': { icon: CalendarOff, color: 'text-purple-600', bgColor: 'bg-purple-50/80', borderColor: 'border-purple-200' },
      'not-done': { icon: AlertCircle, color: 'text-gray-600', bgColor: 'bg-gray-50/80', borderColor: 'border-gray-200' },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority: WorkOrderPriority) => {
    const configs = {
      'urgent': { color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white', label: 'Urgent' },
      'high': { color: 'bg-gradient-to-r from-orange-500 to-red-400 text-white', label: 'High' },
      'medium': { color: 'bg-gradient-to-r from-yellow-500 to-amber-400 text-white', label: 'Medium' },
      'low': { color: 'bg-gradient-to-r from-green-500 to-emerald-400 text-white', label: 'Low' },
    };
    return configs[priority] || configs.medium;
  };

  const StatusIcon = getStatusConfig(workOrder.status).icon;
  const statusConfig = getStatusConfig(workOrder.status);
  const priorityConfig = getPriorityConfig(workOrder.priority);

  const handleQuickStatusUpdate = (status: WorkOrderStatus) => {
    const updates: Partial<WorkOrder> = { status };
    if (status === 'completed') {
      updates.progress = 100;
      updates.completedAt = new Date().toISOString();
    }
    onUpdate(workOrder.id, updates);
    toast.success(`Status updated to ${status}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this work order?')) {
      onDelete(workOrder.id);
    }
  };

  if (viewMode === 'grid') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm border border-gray-200/70">
        <CardContent className="p-3">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${priorityConfig.color} text-xs font-medium`}>
                  {priorityConfig.label}
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.color} text-xs font-medium border ${statusConfig.borderColor}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span className="capitalize">{workOrder.status.replace('-', ' ')}</span>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 text-sm truncate">
                #{workOrder.workOrderNumber}
              </h3>
              <p className="text-gray-600 text-xs truncate mb-1">{workOrder.title}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 -mr-1">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onViewDetails(workOrder)} className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(workOrder)} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Work Order
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">Quick Status</div>
                <DropdownMenuItem onClick={() => handleQuickStatusUpdate('in-progress')} className="cursor-pointer">
                  <PlayCircle className="h-4 w-4 mr-2 text-blue-500" />
                  Start Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickStatusUpdate('completed')} className="cursor-pointer">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Mark Complete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Compact Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-blue-500" />
              <span className="truncate font-medium">{workOrder.artisanName || 'Unassigned'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ToolCase className="h-3 w-3 text-orange-500" />
              <span className="truncate font-medium">{workOrder.equipmentInfo}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-green-500" />
              <span className="font-medium">{workOrder.dateRaised}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-purple-500" />
              <span className="font-medium">{workOrder.estimatedHours}h</span>
            </div>
          </div>

          {/* Progress & View Button */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${workOrder.progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold min-w-[2.5rem]">{workOrder.progress}%</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(workOrder)}
              className="ml-2 h-7 px-3 text-xs bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm"
            >
              <FileText className="h-3 w-3 mr-1.5" />
              Details
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex items-center p-3 border-b hover:bg-blue-50/30 transition-all group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.color}`}>
              <StatusIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  #{workOrder.workOrderNumber}
                </h3>
                <div className={`px-2 py-0.5 rounded-full ${priorityConfig.color} text-xs font-medium`}>
                  {priorityConfig.label}
                </div>
                <span className="text-xs text-gray-500 capitalize">
                  {workOrder.status.replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  <span>{workOrder.artisanName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ToolCase className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{workOrder.equipmentInfo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{workOrder.dateRaised}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Percent className="h-3 w-3" />
                  <span className="font-medium">{workOrder.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(workOrder)}
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(workOrder)}
            className="h-7 px-2 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <FileText className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
        </div>
      </div>
    );
  }

  // Minimalist View
  return (
    <div className="flex items-center p-2.5 border-b hover:bg-blue-50/20 transition-all group">
      <div className={`p-1.5 rounded-md ${statusConfig.bgColor} ${statusConfig.color} mr-2`}>
        <StatusIcon className="h-3 w-3" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm text-gray-900 truncate">
            #{workOrder.workOrderNumber}
          </span>
          <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityConfig.color}`}>
            {workOrder.priority.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="text-xs text-gray-500 truncate flex items-center gap-2">
          <span>{workOrder.artisanName}</span>
          <span>•</span>
          <span>{workOrder.equipmentInfo}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-100 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full"
            style={{ width: `${workOrder.progress}%` }}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(workOrder)}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ==================== ENHANCED FILTER COMPONENT ====================
interface EnhancedFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  workOrders: WorkOrder[];
}

function EnhancedFilter({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onClearFilters,
  workOrders 
}: EnhancedFilterProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Extract unique values for filters
  const uniqueValues = useMemo(() => {
    const artisans = Array.from(new Set(workOrders.map(wo => wo.artisanName).filter(Boolean)));
    const machines = Array.from(new Set(workOrders.map(wo => wo.equipmentInfo).filter(Boolean)));
    const depts = Array.from(new Set(workOrders.map(wo => wo.toDepartment).filter(Boolean)));
    const statuses: WorkOrderStatus[] = ['pending', 'in-progress', 'completed', 'on-hold', 'cancelled', 'postponed', 'not-done'];
    
    return { artisans, machines, depts, statuses };
  }, [workOrders]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters };
    if (value === "all" || !value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFilterChange(newFilters);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Status</Label>
              <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {uniqueValues.statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Artisan</Label>
              <Select value={filters.artisanName || "all"} onValueChange={(value) => handleFilterChange('artisanName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Artisans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Artisans</SelectItem>
                  {uniqueValues.artisans.map(artisan => (
                    <SelectItem key={artisan} value={artisan}>{artisan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Machine</Label>
              <Select value={filters.equipmentInfo || "all"} onValueChange={(value) => handleFilterChange('equipmentInfo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Machines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Machines</SelectItem>
                  {uniqueValues.machines.map(machine => (
                    <SelectItem key={machine} value={machine}>{machine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Department</Label>
              <Select value={filters.department || "all"} onValueChange={(value) => handleFilterChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueValues.depts.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="h-8"
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
              </Button>
              
              {(filters.status || filters.artisanName || filters.equipmentInfo || filters.department || filters.dateFrom || filters.dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="h-8 text-red-600"
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Priority</Label>
                  <Select value={filters.priority || "all"} onValueChange={(value) => handleFilterChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Progress Range</Label>
                  <Select value={filters.progress || "all"} onValueChange={(value) => handleFilterChange('progress', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Progress" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Progress</SelectItem>
                      <SelectItem value="0-25">0-25%</SelectItem>
                      <SelectItem value="25-50">25-50%</SelectItem>
                      <SelectItem value="50-75">50-75%</SelectItem>
                      <SelectItem value="75-100">75-100%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Date From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom || ""}
                    onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Date To</Label>
                  <Input
                    type="date"
                    value={filters.dateTo || ""}
                    onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== MAIN COMPONENT ====================
export default function MaintenancePage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [presets, setPresets] = useState<WorkOrderPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('dateRaised');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [activeTab, setActiveTab] = useState('work-orders');

  useEffect(() => {
    loadWorkOrders();
    loadPresets();
  }, []);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      const backendWorkOrders = await getWorkOrders();
      const convertedWorkOrders = backendWorkOrders.map(backendToWorkOrder);
      setWorkOrders(convertedWorkOrders);
    } catch (error) {
      console.error('Error loading work orders:', error);
      toast.error('Failed to load work orders');
    } finally {
      setLoading(false);
    }
  };

  const loadPresets = () => {
    const storedPresets = localStorage.getItem('workOrderPresets');
    if (storedPresets) {
      setPresets(JSON.parse(storedPresets));
    } else {
      // Default presets
      const defaultPresets: WorkOrderPreset[] = [
        {
          id: 'preset-1',
          name: 'Weekly Machine Maintenance',
          description: 'Routine weekly maintenance for production machines',
          category: 'Routine Maintenance',
          estimatedTime: 4,
          requiredSkills: ['Mechanical', 'Electrical'],
          recurrence: {
            enabled: true,
            frequency: 'weekly',
            interval: 1,
            daysOfWeek: [1], // Monday
            startDate: new Date().toISOString().split('T')[0],
            time: '09:00',
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          useCount: 5,
          template: {
            jobType: { operational: false, maintenance: true, mining: false },
            equipmentInfo: 'Production Machine #1',
            estimatedHours: '4',
            jobRequestDetails: 'Perform routine maintenance including lubrication, belt tension check, and safety inspection.',
            jobInstructions: 'Follow maintenance checklist. Report any issues found.',
          },
        },
        {
          id: 'preset-2',
          name: 'Monthly Safety Inspection',
          description: 'Monthly safety equipment inspection and testing',
          category: 'Safety Inspection',
          estimatedTime: 2,
          requiredSkills: ['Safety', 'Inspection'],
          recurrence: {
            enabled: true,
            frequency: 'monthly',
            interval: 1,
            dayOfMonth: 1,
            startDate: new Date().toISOString().split('T')[0],
            time: '08:00',
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          useCount: 3,
          template: {
            jobType: { operational: false, maintenance: true, mining: false },
            equipmentInfo: 'Safety Equipment',
            estimatedHours: '2',
            jobRequestDetails: 'Inspect all safety equipment including fire extinguishers, emergency stops, and safety guards.',
            jobInstructions: 'Test all safety devices. Document any issues.',
          },
        },
        {
          id: 'preset-3',
          name: 'Emergency Machine Repair',
          description: 'Template for emergency machine breakdown repairs',
          category: 'Emergency Repair',
          estimatedTime: 8,
          requiredSkills: ['Mechanical', 'Electrical', 'Troubleshooting'],
          recurrence: { enabled: false, frequency: 'weekly', interval: 1, startDate: new Date().toISOString().split('T')[0], time: '09:00' },
          isActive: true,
          createdAt: new Date().toISOString(),
          useCount: 12,
          template: {
            jobType: { operational: false, maintenance: true, mining: false },
            equipmentInfo: 'Machine Repair',
            estimatedHours: '8',
            jobRequestDetails: 'Emergency machine breakdown. Immediate repair required.',
            jobInstructions: 'Diagnose and repair immediately. Report cause of failure.',
          },
        },
      ];
      setPresets(defaultPresets);
      localStorage.setItem('workOrderPresets', JSON.stringify(defaultPresets));
    }
  };

  const handleWorkOrderSubmit = async (formData: WorkOrderFormData) => {
    try {
      const workOrderNumber = `WO-${Date.now().toString().slice(-6)}`;
      const backendData = {
        ...formData,
        work_order_number: workOrderNumber,
        status: 'pending',
        priority: 'medium',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await createWorkOrder(backendData);
      await loadWorkOrders();
      setShowWorkOrderForm(false);
      setEditingWorkOrder(null);
      toast.success('Work order created successfully!');
    } catch (error) {
      console.error('Error creating work order:', error);
      toast.error('Failed to create work order');
    }
  };

  const handleUpdateWorkOrder = async (id: string, updates: Partial<WorkOrder>) => {
    try {
      await updateWorkOrder(id, updates);
      await loadWorkOrders();
      toast.success('Work order updated successfully');
    } catch (error) {
      console.error('Failed to update work order:', error);
      toast.error('Failed to update work order');
    }
  };

  const handleUpdateStatus = async (id: string, status: WorkOrderStatus, progress?: number, notes?: string) => {
    const updates: Partial<WorkOrder> = { 
      status, 
      updatedAt: new Date().toISOString() 
    };
    
    if (progress !== undefined) {
      updates.progress = progress;
    }
    
    if (status === 'completed') {
      updates.completedAt = new Date().toISOString();
      updates.progress = 100;
    }
    
    if (notes) {
      updates.notes = notes;
    }
    
    await handleUpdateWorkOrder(id, updates);
  };

  const handleDeleteWorkOrder = async (id: string) => {
    try {
      await deleteWorkOrder(id);
      await loadWorkOrders();
      toast.success('Work order deleted successfully');
    } catch (error) {
      console.error('Failed to delete work order:', error);
      toast.error('Failed to delete work order');
    }
  };

  const handleCreateNewWorkOrder = () => {
    const workOrderNumber = `WO-${Date.now().toString().slice(-6)}`;
    const newWorkOrder: Partial<WorkOrder> = {
      id: `new-${Date.now()}`,
      workOrderNumber,
      title: 'New Work Order',
      description: '',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      toDepartment: '',
      toSection: '',
      dateRaised: new Date().toISOString().split('T')[0],
      fromDepartment: '',
      fromSection: '',
      timeRaised: new Date().toTimeString().slice(0, 5),
      accountNumber: '',
      equipmentInfo: '',
      userLabToday: '',
      jobType: { operational: false, maintenance: true, mining: false },
      jobRequestDetails: '',
      requestedBy: '',
      authorisingForeman: '',
      authorisingEngineer: '',
      allocatedTo: '',
      estimatedHours: '1',
      responsibleForeman: '',
      jobInstructions: '',
      manpower: [],
      workDoneDetails: '',
      causeOfFailure: '',
      delayDetails: '',
      artisanName: '',
      artisanSign: '',
      artisanDate: '',
      foremanName: '',
      foremanSign: '',
      foremanDate: '',
      timeWorkStarted: '',
      timeWorkFinished: '',
      totalTimeWorked: '',
      overtimeStartTime: '',
      overtimeEndTime: '',
      overtimeHours: '',
      delayFromTime: '',
      delayToTime: '',
      totalDelayHours: '',
    };
    
    setEditingWorkOrder(newWorkOrder as WorkOrder);
    setShowWorkOrderForm(true);
  };

  const handleCreateFromPreset = (preset: WorkOrderPreset) => {
    const workOrderNumber = `WO-${Date.now().toString().slice(-6)}`;
    
    // Update preset use count
    const updatedPresets = presets.map(p => 
      p.id === preset.id ? { ...p, useCount: p.useCount + 1, lastUsed: new Date().toISOString() } : p
    );
    setPresets(updatedPresets);
    localStorage.setItem('workOrderPresets', JSON.stringify(updatedPresets));
    
    // Create form data from preset template
    const formData: WorkOrderFormData = {
      toDepartment: '',
      toSection: '',
      dateRaised: new Date().toISOString().split('T')[0],
      workOrderNumber,
      fromDepartment: '',
      fromSection: '',
      timeRaised: new Date().toTimeString().slice(0, 5),
      accountNumber: '',
      equipmentInfo: preset.template.equipmentInfo || '',
      userLabToday: '',
      jobType: preset.template.jobType || { operational: false, maintenance: true, mining: false },
      jobRequestDetails: preset.template.jobRequestDetails || preset.description,
      requestedBy: '',
      authorisingForeman: '',
      authorisingEngineer: '',
      allocatedTo: '',
      estimatedHours: preset.template.estimatedHours?.toString() || preset.estimatedTime.toString(),
      responsibleForeman: '',
      jobInstructions: preset.template.jobInstructions || '',
      manpower: [],
      workDoneDetails: '',
      causeOfFailure: '',
      delayDetails: '',
      artisanName: '',
      artisanSign: '',
      artisanDate: '',
      foremanName: '',
      foremanSign: '',
      foremanDate: '',
      timeWorkStarted: '',
      timeWorkFinished: '',
      totalTimeWorked: '',
      overtimeStartTime: '',
      overtimeEndTime: '',
      overtimeHours: '',
      delayFromTime: '',
      delayToTime: '',
      totalDelayHours: '',
    };
    
    // Create a new work order object
    const newWorkOrder: WorkOrder = {
      id: '',
      title: preset.name,
      description: preset.description,
      status: 'pending',
      priority: 'medium',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...formData,
    };
    
    setEditingWorkOrder(newWorkOrder);
    setShowWorkOrderForm(true);
    setShowPresets(false);
    toast.success(`Creating work order from template: ${preset.name}`);
  };

  const filteredAndSortedWorkOrders = useMemo(() => {
    let filtered = workOrders.filter(wo => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          wo.workOrderNumber?.toLowerCase().includes(query) ||
          wo.title?.toLowerCase().includes(query) ||
          wo.description?.toLowerCase().includes(query) ||
          wo.artisanName?.toLowerCase().includes(query) ||
          wo.equipmentInfo?.toLowerCase().includes(query) ||
          wo.toDepartment?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status !== "all" && wo.status !== filters.status) return false;
      // Artisan filter
      if (filters.artisanName && filters.artisanName !== "all" && wo.artisanName !== filters.artisanName) return false;
      // Equipment filter
      if (filters.equipmentInfo && filters.equipmentInfo !== "all" && wo.equipmentInfo !== filters.equipmentInfo) return false;
      // Department filter
      if (filters.department && filters.department !== "all" && wo.toDepartment !== filters.department) return false;
      // Priority filter
      if (filters.priority && filters.priority !== "all" && wo.priority !== filters.priority) return false;
      // Progress filter
      if (filters.progress && filters.progress !== "all") {
        const [min, max] = filters.progress.split('-').map(Number);
        if (wo.progress < min || wo.progress > max) return false;
      }
      // Date range filter
      if (filters.dateFrom && wo.dateRaised < filters.dateFrom) return false;
      if (filters.dateTo && wo.dateRaised > filters.dateTo) return false;

      return true;
    });

    // Sort work orders
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'dateRaised' || sortField === 'createdAt' || sortField === 'dueDate' || sortField === 'completedAt') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (sortField === 'estimatedHours' || sortField === 'progress') {
        aValue = parseFloat(aValue as string) || 0;
        bValue = parseFloat(bValue as string) || 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [workOrders, searchQuery, filters, sortField, sortOrder]);

  const dashboardData = useMemo(() => {
    const stats = calculateWorkOrderStats(workOrders);
    return {
      ...stats,
      totalWorkOrders: stats.total,
      trending: stats.efficiency > 80 ? 'improving' : stats.efficiency < 60 ? 'declining' : 'stable',
      recommendations: [
        stats.overdueCount > 0 ? `🚨 ${stats.overdueCount} overdue work orders require attention` : '',
        stats.pending > 5 ? `📋 ${stats.pending} pending orders need assignment` : '',
        stats.efficiency < 70 ? '📈 Focus on improving completion rates' : '✅ Maintenance operations are efficient'
      ].filter(Boolean),
      teamPerformance: Math.round((stats.completed / Math.max(stats.total, 1)) * 100),
    };
  }, [workOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading work orders...</p>
        </div>
      </div>
    );
  }

  // Show Work Order Details Modal
  if (selectedWorkOrder) {
    return (
      <WorkOrderDetailsModal
        workOrder={selectedWorkOrder}
        isOpen={true}
        onClose={() => setSelectedWorkOrder(null)}
        onEdit={(wo) => {
          setSelectedWorkOrder(null);
          setEditingWorkOrder(wo);
          setShowWorkOrderForm(true);
        }}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteWorkOrder}
      />
    );
  }

  // Show Work Order Form when creating/editing
  if (showWorkOrderForm) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <WorkOrderForm 
          onBack={() => {
            setShowWorkOrderForm(false);
            setEditingWorkOrder(null);
          }}
          onSave={handleWorkOrderSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Maintenance Dashboard</h1>
                <p className="text-blue-100 text-sm">
                  Manage and track maintenance work orders
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={loadWorkOrders}
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={() => setShowPresets(true)}
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <Copy className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button 
                onClick={handleCreateNewWorkOrder}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Work Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <Card className="bg-white border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-xl font-bold">{dashboardData.totalWorkOrders}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <PlayCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">In Progress</div>
                  <div className="text-xl font-bold text-blue-600">{dashboardData.inProgress}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Completed</div>
                  <div className="text-xl font-bold text-green-600">{dashboardData.completed}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <PauseCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">On Hold</div>
                  <div className="text-xl font-bold text-orange-600">{dashboardData.onHold}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Overdue</div>
                  <div className="text-xl font-bold text-red-600">{dashboardData.overdueCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="work-orders" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Work Orders
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Work Orders Tab */}
          <TabsContent value="work-orders" className="mt-6">
            <EnhancedFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={() => {
                setFilters({});
                setSearchQuery('');
              }}
              workOrders={workOrders}
            />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Work Orders ({filteredAndSortedWorkOrders.length})
                </h2>
                <p className="text-sm text-gray-600">
                  Showing {filteredAndSortedWorkOrders.length} of {workOrders.length} work orders
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dateRaised">Date Raised</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="artisanName">Artisan</SelectItem>
                      <SelectItem value="equipmentInfo">Machine</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'minimalist' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('minimalist')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {Object.keys(filters).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(filters).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="gap-1">
                    {key}: {value}
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key];
                        setFilters(newFilters);
                      }}
                      className="ml-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Work Orders Display */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedWorkOrders.map((workOrder) => (
                  <WorkOrderCard
                    key={workOrder.id}
                    workOrder={workOrder}
                    onEdit={(wo) => {
                      setEditingWorkOrder(wo);
                      setShowWorkOrderForm(true);
                    }}
                    onUpdate={handleUpdateWorkOrder}
                    onDelete={handleDeleteWorkOrder}
                    onViewDetails={setSelectedWorkOrder}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <Card>
                <div className="divide-y">
                  {filteredAndSortedWorkOrders.map((workOrder) => (
                    <WorkOrderCard
                      key={workOrder.id}
                      workOrder={workOrder}
                      onEdit={(wo) => {
                        setEditingWorkOrder(wo);
                        setShowWorkOrderForm(true);
                      }}
                      onUpdate={handleUpdateWorkOrder}
                      onDelete={handleDeleteWorkOrder}
                      onViewDetails={setSelectedWorkOrder}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </Card>
            )}

            {viewMode === 'minimalist' && (
              <Card>
                <div className="divide-y">
                  {filteredAndSortedWorkOrders.map((workOrder) => (
                    <WorkOrderCard
                      key={workOrder.id}
                      workOrder={workOrder}
                      onEdit={(wo) => {
                        setEditingWorkOrder(wo);
                        setShowWorkOrderForm(true);
                      }}
                      onUpdate={handleUpdateWorkOrder}
                      onDelete={handleDeleteWorkOrder}
                      onViewDetails={setSelectedWorkOrder}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Empty State */}
            {filteredAndSortedWorkOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No work orders found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchQuery || Object.keys(filters).length > 0 
                    ? 'Try adjusting your search terms or filters to see more results.' 
                    : 'Get started by creating your first work order.'}
                </p>
                <Button 
                  onClick={handleCreateNewWorkOrder}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Work Order
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="presets" className="mt-6">
            <WorkOrderPresets
              presets={presets}
              onCreateFromPreset={handleCreateFromPreset}
              onEditPreset={(preset) => {
                toast.info('Edit template feature coming soon');
              }}
              onDeletePreset={(id) => {
                const updatedPresets = presets.filter(p => p.id !== id);
                setPresets(updatedPresets);
                localStorage.setItem('workOrderPresets', JSON.stringify(updatedPresets));
                toast.success('Template deleted');
              }}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completion Rate</CardTitle>
                  <CardDescription>Overall work order completion statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-blue-600">
                        {dashboardData.completionRate}%
                      </div>
                      <div className={`flex items-center gap-1 ${dashboardData.trending === 'improving' ? 'text-green-600' : dashboardData.trending === 'declining' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {dashboardData.trending === 'improving' ? <TrendingUp className="h-5 w-5" /> : dashboardData.trending === 'declining' ? <TrendingDown className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                        <span className="text-sm capitalize">{dashboardData.trending}</span>
                      </div>
                    </div>
                    <Progress value={dashboardData.completionRate} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Average Completion Time</div>
                        <div className="font-bold">{dashboardData.avgCompletionTime} days</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Efficiency Score</div>
                        <div className="font-bold">{dashboardData.efficiency}/100</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Distribution</CardTitle>
                  <CardDescription>Breakdown of work orders by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { status: 'Completed', count: dashboardData.completed, color: 'bg-green-500' },
                      { status: 'In Progress', count: dashboardData.inProgress, color: 'bg-blue-500' },
                      { status: 'Pending', count: dashboardData.pending, color: 'bg-yellow-500' },
                      { status: 'On Hold', count: dashboardData.onHold, color: 'bg-orange-500' },
                      { status: 'Cancelled', count: dashboardData.cancelled, color: 'bg-red-500' },
                      { status: 'Postponed', count: dashboardData.postponed, color: 'bg-purple-500' },
                      { status: 'Not Done', count: dashboardData.notDone, color: 'bg-gray-500' },
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm">{item.status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.count}</span>
                          <span className="text-gray-500 text-xs">
                            ({Math.round((item.count / Math.max(dashboardData.totalWorkOrders, 1)) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Templates Modal */}
      <Dialog open={showPresets} onOpenChange={setShowPresets}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Work Order Templates</DialogTitle>
            <DialogDescription>
              Create and manage reusable work order templates with recurrence schedules.
            </DialogDescription>
          </DialogHeader>
          <WorkOrderPresets
            presets={presets}
            onCreateFromPreset={handleCreateFromPreset}
            onEditPreset={(preset) => {
              toast.info('Edit template feature coming soon');
            }}
            onDeletePreset={(id) => {
              const updatedPresets = presets.filter(p => p.id !== id);
              setPresets(updatedPresets);
              localStorage.setItem('workOrderPresets', JSON.stringify(updatedPresets));
              toast.success('Template deleted');
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== UTILITY FUNCTIONS ====================
function calculateWorkOrderStats(workOrders: WorkOrder[]): WorkOrderStats {
  if (!workOrders || !Array.isArray(workOrders)) {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0,
      cancelled: 0,
      postponed: 0,
      notDone: 0,
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
      efficiency: 0,
      avgCompletionTime: 0,
      overdueCount: 0,
      totalCost: 0,
      costSavings: 0,
      safetyScore: 0,
      completionRate: 0,
    };
  }

  const today = new Date();
  const overdueCount = workOrders.filter(wo => 
    wo.dueDate && new Date(wo.dueDate) < today && wo.status !== 'completed'
  ).length;

  const completedOrders = workOrders.filter(wo => wo.status === 'completed');
  const avgCompletionTime = completedOrders.length > 0 
    ? completedOrders.reduce((sum, wo) => {
        const created = new Date(wo.createdAt);
        const completed = wo.completedAt ? new Date(wo.completedAt) : new Date(wo.updatedAt);
        return sum + (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / completedOrders.length
    : 0;

  const totalCost = workOrders.reduce((sum, wo) => sum + (wo.actualCost || wo.costEstimate || 0), 0);
  const costSavings = workOrders.reduce((sum, wo) => {
    if (wo.actualCost && wo.costEstimate) {
      return sum + Math.max(0, wo.costEstimate - wo.actualCost);
    }
    return sum;
  }, 0);

  const completionRate = workOrders.length > 0 
    ? Math.round((completedOrders.length / workOrders.length) * 100)
    : 0;

  return {
    total: workOrders.length,
    pending: workOrders.filter(wo => wo.status === 'pending').length,
    inProgress: workOrders.filter(wo => wo.status === 'in-progress').length,
    completed: completedOrders.length,
    onHold: workOrders.filter(wo => wo.status === 'on-hold').length,
    cancelled: workOrders.filter(wo => wo.status === 'cancelled').length,
    postponed: workOrders.filter(wo => wo.status === 'postponed').length,
    notDone: workOrders.filter(wo => wo.status === 'not-done').length,
    urgent: workOrders.filter(wo => wo.priority === 'urgent').length,
    high: workOrders.filter(wo => wo.priority === 'high').length,
    medium: workOrders.filter(wo => wo.priority === 'medium').length,
    low: workOrders.filter(wo => wo.priority === 'low').length,
    efficiency: Math.min(100, Math.round((completedOrders.length / Math.max(workOrders.length, 1)) * 100)),
    avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
    overdueCount,
    totalCost,
    costSavings,
    safetyScore: 95,
    completionRate,
  };
}

function backendToWorkOrder(backendOrder: any): WorkOrder {
  let jobType: JobType = { operational: false, maintenance: false, mining: false };
  if (backendOrder.job_type) {
    if (typeof backendOrder.job_type === 'string') {
      jobType = {
        operational: backendOrder.job_type.includes('operational'),
        maintenance: backendOrder.job_type.includes('maintenance'),
        mining: backendOrder.job_type.includes('mining'),
      };
    } else if (typeof backendOrder.job_type === 'object') {
      jobType = backendOrder.job_type;
    }
  }

  let manpower: ManpowerRow[] = [];
  if (backendOrder.manpower) {
    if (Array.isArray(backendOrder.manpower)) {
      manpower = backendOrder.manpower;
    } else if (typeof backendOrder.manpower === 'string') {
      try {
        manpower = JSON.parse(backendOrder.manpower);
      } catch {
        manpower = [];
      }
    }
  }

  return {
    id: backendOrder.id?.toString() || backendOrder.work_order_number || `WO-${Date.now()}`,
    workOrderNumber: backendOrder.work_order_number || backendOrder.workOrderNumber || `WO-${Date.now()}`,
    title: backendOrder.title || backendOrder.job_request_details?.substring(0, 50) || `Work Order: ${backendOrder.work_order_number}`,
    description: backendOrder.description || backendOrder.job_request_details || 'No description provided',
    status: (backendOrder.status as WorkOrderStatus) || 'pending',
    priority: (backendOrder.priority as WorkOrderPriority) || 'medium',
    allocatedTo: backendOrder.allocated_to || backendOrder.allocatedTo || 'Unassigned',
    toDepartment: backendOrder.to_department || backendOrder.toDepartment || 'Unknown Department',
    equipmentInfo: backendOrder.equipment_info || backendOrder.equipmentInfo || 'No equipment specified',
    requestedBy: backendOrder.requested_by || backendOrder.requestedBy || 'Unknown',
    dateRaised: backendOrder.date_raised || backendOrder.dateRaised || new Date().toISOString().split('T')[0],
    timeRaised: backendOrder.time_raised || backendOrder.timeRaised || new Date().toTimeString().slice(0, 5),
    estimatedHours: backendOrder.estimated_hours || backendOrder.estimatedHours || '0',
    workDoneDetails: backendOrder.work_done_details || backendOrder.workDoneDetails || '',
    progress: backendOrder.progress || 0,
    createdAt: backendOrder.created_at || backendOrder.createdAt || new Date().toISOString(),
    updatedAt: backendOrder.updated_at || backendOrder.updatedAt || new Date().toISOString(),
    dueDate: backendOrder.due_date || backendOrder.dueDate,
    location: backendOrder.location,
    actualHours: backendOrder.actual_hours || backendOrder.actualHours,
    actualCost: backendOrder.actual_cost || backendOrder.actualCost,
    costEstimate: backendOrder.cost_estimate || backendOrder.costEstimate,
    safetyLevel: backendOrder.safety_level || backendOrder.safetyLevel,
    completedAt: backendOrder.completed_at || backendOrder.completedAt,
    completedBy: backendOrder.completed_by || backendOrder.completedBy,
    cancellationReason: backendOrder.cancellation_reason || backendOrder.cancellationReason,
    postponeDate: backendOrder.postpone_date || backendOrder.postponeDate,
    notes: backendOrder.notes,
    attachments: backendOrder.attachments ? (Array.isArray(backendOrder.attachments) ? backendOrder.attachments : JSON.parse(backendOrder.attachments)) : [],
    tags: backendOrder.tags ? (Array.isArray(backendOrder.tags) ? backendOrder.tags : JSON.parse(backendOrder.tags)) : [],
    
    // Form fields
    toSection: backendOrder.to_section || backendOrder.toSection || '',
    fromDepartment: backendOrder.from_department || backendOrder.fromDepartment || '',
    fromSection: backendOrder.from_section || backendOrder.fromSection || '',
    accountNumber: backendOrder.account_number || backendOrder.accountNumber || '',
    userLabToday: backendOrder.user_lab_today || backendOrder.userLabToday || '',
    jobType,
    jobRequestDetails: backendOrder.job_request_details || backendOrder.jobRequestDetails || '',
    authorisingForeman: backendOrder.authorising_foreman || backendOrder.authorisingForeman || '',
    authorisingEngineer: backendOrder.authorising_engineer || backendOrder.authorisingEngineer || '',
    responsibleForeman: backendOrder.responsible_foreman || backendOrder.responsibleForeman || '',
    jobInstructions: backendOrder.job_instructions || backendOrder.jobInstructions || '',
    manpower,
    causeOfFailure: backendOrder.cause_of_failure || backendOrder.causeOfFailure || '',
    delayDetails: backendOrder.delay_details || backendOrder.delayDetails || '',
    artisanName: backendOrder.artisan_name || backendOrder.artisanName || '',
    artisanSign: backendOrder.artisan_sign || backendOrder.artisanSign || '',
    artisanDate: backendOrder.artisan_date || backendOrder.artisanDate || '',
    foremanName: backendOrder.foreman_name || backendOrder.foremanName || '',
    foremanSign: backendOrder.foreman_sign || backendOrder.foremanSign || '',
    foremanDate: backendOrder.foreman_date || backendOrder.foremanDate || '',
    timeWorkStarted: backendOrder.time_work_started || backendOrder.timeWorkStarted || '',
    timeWorkFinished: backendOrder.time_work_finished || backendOrder.timeWorkFinished || '',
    totalTimeWorked: backendOrder.total_time_worked || backendOrder.totalTimeWorked || '',
    overtimeStartTime: backendOrder.overtime_start_time || backendOrder.overtimeStartTime || '',
    overtimeEndTime: backendOrder.overtime_end_time || backendOrder.overtimeEndTime || '',
    overtimeHours: backendOrder.overtime_hours || backendOrder.overtimeHours || '',
    delayFromTime: backendOrder.delay_from_time || backendOrder.delayFromTime || '',
    delayToTime: backendOrder.delay_to_time || backendOrder.delayToTime || '',
    totalDelayHours: backendOrder.total_delay_hours || backendOrder.totalDelayHours || ''
  };
}