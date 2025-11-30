// frontend/app/maintenance/page.tsx

'use client';
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { WorkOrderForm } from "@/components/work-orders/work-orders-form";
import { 
  FileText, 
  Plus, 
  Download, 
  Filter, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlayCircle,
  PauseCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Wrench,
  BarChart3,
  Printer,
  Search,
  Grid,
  List,
  Eye,
  Calendar,
  User,
  Building,
  Settings,
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  X,
  Sparkles,
  Zap,
  Target,
  PieChart,
  Activity,
  Clock4,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  DownloadCloud,
  UploadCloud,
  Bell,
  Shield,
  ToolCase,
  Factory,
  MapPin,
  Star,
  Award,
  ChevronRight,
  Save,
  Trash2,
  Copy,
  RotateCcw,
  CheckCircle,
  Circle
} from "lucide-react";
import { jsPDF } from "jspdf";

// ==================== UPDATED TYPES TO MATCH WORK-ORDERS-FORM ====================
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

// Simplified WorkOrder interface for display in the dashboard
interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  allocatedTo: string;
  toDepartment: string;
  equipmentInfo: string;
  requestedBy: string;
  dateRaised: string;
  timeRaised: string;
  estimatedHours: string;
  workDoneDetails: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  location?: string;
  actualHours?: number;
  actualCost?: number;
  costEstimate?: number;
  safetyLevel?: 'low' | 'medium' | 'high';
}

interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  startDate: string;
  endDate?: string;
}

interface MaintenancePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedHours: number;
  requiredSkills: string[];
  checklist: ChecklistItem[];
  recurrence?: RecurrenceRule;
  assignedTeam?: string;
  department: string;
  safetyRequirements: string[];
  requiredTools: string[];
  costEstimate: number;
  createdAt: string;
  updatedAt: string;
}

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface TimeEntry {
  id: string;
  artisanId: string;
  artisanName: string;
  startTime: string;
  endTime: string;
  duration: number;
  activity: string;
}

interface WorkOrderStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  onHold: number;
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
}

interface DashboardData {
  totalWorkOrders: number;
  completed: number;
  inProgress: number;
  pending: number;
  onHold: number;
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
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  currentJobs: number;
  completedThisWeek: number;
  efficiency: number;
  specialization: string[];
}

interface FilterButton {
  key: string;
  label: string;
  count: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
}

type ViewMode = 'grid' | 'list' | 'minimalist' | 'kanban';
type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt' | 'allocatedTo' | 'toDepartment' | 'estimatedHours';
type SortOrder = 'asc' | 'desc';

// ==================== UPDATED API FUNCTIONS ====================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// UPDATED: Get work orders from the correct endpoint
const getWorkOrders = async (): Promise<any[]> => {
  try {
    console.log('🔄 Fetching work orders from:', `${API_BASE}/api/maintenance/work-orders`);
    const response = await fetch(`${API_BASE}/api/maintenance/work-orders`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch work orders: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Work orders from API:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Error fetching work orders:', error);
    
    // Fallback to localStorage if API is unavailable
    const localWorkOrders = localStorage.getItem('workOrders');
    if (localWorkOrders) {
      console.log('📂 Using work orders from localStorage');
      return JSON.parse(localWorkOrders);
    }
    
    return [];
  }
};

// UPDATED: Create work order using the correct endpoint and data structure
const createWorkOrder = async (workOrderData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    console.log('📤 Creating work order:', workOrderData);
    
    const response = await fetch(`${API_BASE}/api/maintenance/work-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workOrderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create work order: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Work order created successfully:', result);
    
    // Update localStorage as backup
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
    console.error('💥 Error creating work order:', error);
    
    // Fallback to localStorage
    const existingWorkOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const newWorkOrder = {
      ...workOrderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedWorkOrders = [...existingWorkOrders, newWorkOrder];
    localStorage.setItem('workOrders', JSON.stringify(updatedWorkOrders));
    
    return { 
      success: true, 
      data: newWorkOrder,
      error: 'Work order saved locally (backend unavailable)'
    };
  }
};

// ==================== MOCK DATA ====================
const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Senior Technician',
    department: 'Mechanical',
    currentJobs: 3,
    completedThisWeek: 8,
    efficiency: 92,
    specialization: ['Hydraulics', 'Pneumatics']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Electrical Engineer',
    department: 'Electrical',
    currentJobs: 2,
    completedThisWeek: 6,
    efficiency: 88,
    specialization: ['Control Systems', 'PLC Programming']
  },
  {
    id: '3',
    name: 'Mike Chen',
    role: 'Maintenance Technician',
    department: 'Mechanical',
    currentJobs: 4,
    completedThisWeek: 5,
    efficiency: 85,
    specialization: ['Welding', 'Fabrication']
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'Lead Technician',
    department: 'Automation',
    currentJobs: 1,
    completedThisWeek: 10,
    efficiency: 95,
    specialization: ['Robotics', 'Automation']
  }
];

const MAINTENANCE_PRESETS: MaintenancePreset[] = [
  {
    id: 'preset-1',
    name: 'Weekly Equipment Inspection',
    description: 'Routine weekly inspection of production equipment',
    category: 'Preventive Maintenance',
    estimatedHours: 2,
    requiredSkills: ['Mechanical', 'Electrical'],
    checklist: [
      { id: '1', description: 'Check for unusual noises', completed: false },
      { id: '2', description: 'Inspect belts and pulleys', completed: false },
      { id: '3', description: 'Verify safety guards', completed: false },
      { id: '4', description: 'Lubricate moving parts', completed: false }
    ],
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [1],
      startDate: new Date().toISOString().split('T')[0]
    },
    department: 'Production',
    safetyRequirements: ['Safety glasses', 'Gloves'],
    requiredTools: ['Multimeter', 'Screwdrivers', 'Lubricant'],
    costEstimate: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ==================== UPDATED UTILITY FUNCTIONS ====================

// UPDATED: WorkOrderPDF to use new data structure
class WorkOrderPDF {
  static generate(workOrder: WorkOrder): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MAINTENANCE WORK ORDER', pageWidth / 2, 25, { align: 'center' });

    yPosition = 60;

    // Work Order Details - UPDATED FIELDS
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('WORK ORDER DETAILS', margin, yPosition);
    yPosition += 15;

    doc.setFont('helvetica', 'normal');
    const details = [
      [`Work Order ID:`, workOrder.workOrderNumber],
      [`Title:`, workOrder.title],
      [`Description:`, workOrder.description],
      [`Status:`, workOrder.status.toUpperCase()],
      [`Priority:`, workOrder.priority.toUpperCase()],
      [`Assigned To:`, workOrder.allocatedTo || 'Unassigned'],
      [`Department:`, workOrder.toDepartment || 'Not specified'],
      [`Equipment:`, workOrder.equipmentInfo || 'Not specified'],
      [`Requested By:`, workOrder.requestedBy || 'Unknown'],
      [`Date Raised:`, workOrder.dateRaised || 'Not set'],
      [`Due Date:`, workOrder.dueDate ? new Date(workOrder.dueDate).toLocaleDateString() : 'Not set'],
    ];

    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value.toString(), margin + 60, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Progress and Time
    doc.setFont('helvetica', 'bold');
    doc.text('PROGRESS & TIME TRACKING', margin, yPosition);
    yPosition += 15;

    const progressDetails = [
      [`Progress:`, `${workOrder.progress}%`],
      [`Estimated Hours:`, `${workOrder.estimatedHours || 0}h`],
      [`Actual Hours:`, `${workOrder.actualHours || 0}h`],
    ];

    progressDetails.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 60, yPosition);
      yPosition += 8;
    });

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY, { align: 'center' });

    doc.save(`work-order-${workOrder.workOrderNumber}.pdf`);
  }
}

function calculateWorkOrderStats(workOrders: WorkOrder[]): WorkOrderStats {
  if (!workOrders || !Array.isArray(workOrders)) {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0,
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
      efficiency: 0,
      avgCompletionTime: 0,
      overdueCount: 0,
      totalCost: 0,
      costSavings: 0,
      safetyScore: 0
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
        const updated = new Date(wo.updatedAt);
        return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / completedOrders.length
    : 0;

  const totalCost = workOrders.reduce((sum, wo) => sum + (wo.actualCost || wo.costEstimate || 0), 0);
  const costSavings = workOrders.reduce((sum, wo) => {
    if (wo.actualCost && wo.costEstimate) {
      return sum + Math.max(0, wo.costEstimate - wo.actualCost);
    }
    return sum;
  }, 0);

  const safetyScore = workOrders.length > 0 
    ? workOrders.reduce((sum, wo) => {
        let score = 100;
        if (wo.safetyLevel === 'high') score = 90;
        if (wo.safetyLevel === 'medium') score = 75;
        if (wo.safetyLevel === 'low') score = 60;
        return sum + score;
      }, 0) / workOrders.length
    : 100;

  return {
    total: workOrders.length,
    pending: workOrders.filter(wo => wo.status === 'pending').length,
    inProgress: workOrders.filter(wo => wo.status === 'in-progress').length,
    completed: workOrders.filter(wo => wo.status === 'completed').length,
    onHold: workOrders.filter(wo => wo.status === 'on-hold').length,
    urgent: workOrders.filter(wo => wo.priority === 'urgent').length,
    high: workOrders.filter(wo => wo.priority === 'high').length,
    medium: workOrders.filter(wo => wo.priority === 'medium').length,
    low: workOrders.filter(wo => wo.priority === 'low').length,
    efficiency: 86,
    avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
    overdueCount,
    totalCost,
    costSavings,
    safetyScore: Math.round(safetyScore)
  };
}

function generateAIRecommendations(workOrders: WorkOrder[], stats: WorkOrderStats): string[] {
  if (!workOrders || workOrders.length === 0) {
    return ["No work orders available for analysis. Start by creating your first work order."];
  }

  const recommendations: string[] = [];

  if (stats.overdueCount > 0) {
    recommendations.push(`🚨 ${stats.overdueCount} overdue work orders require immediate attention.`);
  }

  const highPriorityPending = workOrders.filter(wo => 
    (wo.priority === 'high' || wo.priority === 'urgent') && wo.status === 'pending'
  );
  
  if (highPriorityPending.length > 0) {
    recommendations.push(`⚡ Prioritize ${highPriorityPending.length} high-priority pending work orders.`);
  }

  const inProgressCount = workOrders.filter(wo => wo.status === 'in-progress').length;
  const availableTechnicians = MOCK_TEAM.length;
  if (inProgressCount > availableTechnicians * 2) {
    recommendations.push("👥 Consider redistributing workload - too many concurrent jobs.");
  }

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  if (completionRate < 50) {
    recommendations.push("📈 Work order completion rate is low. Review processes and resource allocation.");
  }

  if (stats.costSavings > 0) {
    recommendations.push(`💰 Great job! You've saved $${stats.costSavings.toLocaleString()} this period.`);
  }

  if (stats.safetyScore < 80) {
    recommendations.push("🛡️ Safety score is below target. Review safety protocols and training.");
  }

  if (recommendations.length === 0) {
    recommendations.push("🎉 Your maintenance operations are running smoothly. Keep up the excellent work!");
  }

  return recommendations.slice(0, 4);
}

// UPDATED: Convert backend work order to frontend format - MATCHING NEW DATA STRUCTURE
function backendToWorkOrder(backendOrder: any): WorkOrder {
  console.log('🔄 Converting backend order:', backendOrder);
  
  return {
    id: backendOrder.id?.toString() || backendOrder.work_order_number || `WO-${Date.now()}`,
    workOrderNumber: backendOrder.work_order_number || backendOrder.workOrderNumber || `WO-${Date.now()}`,
    title: backendOrder.title || backendOrder.job_request_details?.substring(0, 50) || `Work Order: ${backendOrder.work_order_number}`,
    description: backendOrder.description || backendOrder.job_request_details || 'No description provided',
    status: mapBackendStatus(backendOrder.status) || 'pending',
    priority: backendOrder.priority || 'medium',
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
    costEstimate: backendOrder.cost_estimate || backendOrder.costEstimate
  };
}

// Helper function to map backend status to frontend status
function mapBackendStatus(status: string): WorkOrder['status'] {
  const statusMap: { [key: string]: WorkOrder['status'] } = {
    'pending': 'pending',
    'in-progress': 'in-progress',
    'in_progress': 'in-progress',
    'completed': 'completed',
    'on-hold': 'on-hold',
    'on_hold': 'on-hold'
  };
  return statusMap[status] || 'pending';
}

// ==================== COMPONENTS ====================

// Enhanced View Toggle Component
interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  const Columns = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );

  const views = [
    { mode: 'grid' as ViewMode, icon: Grid, label: 'Grid', description: 'Card view' },
    { mode: 'list' as ViewMode, icon: List, label: 'List', description: 'Detailed list' },
    { mode: 'minimalist' as ViewMode, icon: Eye, label: 'Minimal', description: 'Compact view' },
    { mode: 'kanban' as ViewMode, icon: Columns, label: 'Kanban', description: 'Board view' }
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {views.map(({ mode, icon: Icon, label, description }) => (
        <Button
          key={mode}
          variant={viewMode === mode ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange(mode)}
          className={`flex items-center gap-2 transition-all ${
            viewMode === mode 
              ? 'bg-white shadow-sm border border-gray-200' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
          title={description}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}

// Enhanced Sort Dropdown Component
interface SortDropdownProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

function SortDropdown({ sortField, sortOrder, onSortChange }: SortDropdownProps) {
  const sortOptions = [
    { value: 'title', label: 'Title', icon: FileText },
    { value: 'status', label: 'Status', icon: Activity },
    { value: 'priority', label: 'Priority', icon: AlertTriangle },
    { value: 'dueDate', label: 'Due Date', icon: Calendar },
    { value: 'createdAt', label: 'Created Date', icon: Clock },
    { value: 'allocatedTo', label: 'Assigned To', icon: User },
    { value: 'toDepartment', label: 'Department', icon: Building },
    { value: 'estimatedHours', label: 'Estimated Hours', icon: Clock4 }
  ];

  return (
    <div className="flex items-center gap-2">
      <Select
        value={sortField}
        onValueChange={(value: SortField) => onSortChange(value, sortOrder)}
      >
        <SelectTrigger className="w-48 bg-white border-gray-200">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
              <option.icon className="h-4 w-4" />
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortChange(sortField, sortOrder === 'asc' ? 'desc' : 'asc')}
        className="flex items-center gap-2 bg-white border-gray-200"
      >
        <ArrowUpDown className="h-4 w-4" />
        {sortOrder === 'asc' ? 'Asc' : 'Desc'}
      </Button>
    </div>
  );
}

// Enhanced Advanced Filter Component
interface AdvancedFilterProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

function AdvancedFilter({ filters, onFilterChange, onClearFilters, isOpen, onClose }: AdvancedFilterProps) {
  if (!isOpen) return null;

  return (
    <Card className="absolute top-full right-0 mt-2 w-96 z-50 shadow-xl border border-gray-200">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Status
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'pending', label: 'Pending', color: 'bg-orange-100 border-orange-200' },
              { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 border-blue-200' },
              { value: 'completed', label: 'Completed', color: 'bg-green-100 border-green-200' },
              { value: 'on-hold', label: 'On Hold', color: 'bg-purple-100 border-purple-200' }
            ].map(({ value, label, color }) => (
              <div key={value} className="flex items-center space-x-2">
                <Switch
                  checked={filters.status?.includes(value)}
                  onCheckedChange={(checked) => {
                    const newStatus = checked
                      ? [...(filters.status || []), value]
                      : (filters.status || []).filter((s: string) => s !== value);
                    onFilterChange({ ...filters, status: newStatus });
                  }}
                />
                <Label className="text-sm flex-1 cursor-pointer capitalize">{label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Priority
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
              { value: 'high', label: 'High', color: 'bg-orange-500' },
              { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
              { value: 'low', label: 'Low', color: 'bg-green-500' }
            ].map(({ value, label, color }) => (
              <div key={value} className="flex items-center space-x-2">
                <Switch
                  checked={filters.priority?.includes(value)}
                  onCheckedChange={(checked) => {
                    const newPriority = checked
                      ? [...(filters.priority || []), value]
                      : (filters.priority || []).filter((p: string) => p !== value);
                    onFilterChange({ ...filters, priority: newPriority });
                  }}
                />
                <Label className="text-sm flex-1 cursor-pointer capitalize flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`}></div>
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold flex items-center gap-2">
            <Building className="h-4 w-4" />
            Department
          </Label>
          <Input
            placeholder="Filter by department..."
            value={filters.department || ''}
            onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
            className="bg-gray-50 border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Due Date Range
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">From</Label>
              <Input
                type="date"
                value={filters.dueDateFrom || ''}
                onChange={(e) => onFilterChange({ ...filters, dueDateFrom: e.target.value })}
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">To</Label>
              <Input
                type="date"
                value={filters.dueDateTo || ''}
                onChange={(e) => onFilterChange({ ...filters, dueDateTo: e.target.value })}
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            onClick={onClearFilters} 
            className="flex-1 border-gray-200"
            disabled={Object.keys(filters).length === 0}
          >
            Clear All
          </Button>
          <Button 
            onClick={onClose} 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced StatCard Component
interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
  onClick?: () => void;
}

function StatCard({ title, value, subtitle, icon, trend, trendValue, className, onClick }: StatCardProps) {
  const getTrendIcon = (trendType?: 'up' | 'down' | 'stable') => {
    switch (trendType) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };
  
  const getTrendColor = (trendType?: 'up' | 'down' | 'stable') => {
    switch (trendType) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };
  
  const TrendIcon = getTrendIcon(trend);
  const trendColor = getTrendColor(trend);

  return (
    <Card 
      className={`bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {value}
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <TrendIcon className={`h-3 w-3 mr-1 ${trendColor}`} />
          {trendValue && <span className={`mr-1 ${trendColor}`}>{trendValue}</span>}
          {subtitle}
        </div>
      </CardContent>
    </Card>
  );
}

// Team Member Card Component
function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
            <p className="text-sm text-gray-600 truncate">{member.role}</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {member.efficiency}%
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current Jobs</span>
            <span className="font-semibold">{member.currentJobs}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed This Week</span>
            <span className="font-semibold text-green-600">{member.completedThisWeek}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {member.specialization.slice(0, 2).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                {spec}
              </Badge>
            ))}
            {member.specialization.length > 2 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{member.specialization.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// UPDATED: WorkOrderCard component to use new data structure
interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onEdit: (workOrder: WorkOrder) => void;
  onUpdate: (id: string, updates: Partial<WorkOrder>) => void;
  viewMode: ViewMode;
}

function WorkOrderCard({ workOrder, onEdit, onUpdate, viewMode }: WorkOrderCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white border-red-600';
      case 'high': return 'bg-orange-500 text-white border-orange-600';
      case 'medium': return 'bg-yellow-500 text-gray-900 border-yellow-600';
      case 'low': return 'bg-green-500 text-white border-green-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'on-hold': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in-progress': return PlayCircle;
      case 'pending': return Clock;
      case 'on-hold': return PauseCircle;
      default: return FileText;
    }
  };

  const StatusIcon = getStatusIcon(workOrder.status);

  const handleDownloadPDF = () => {
    WorkOrderPDF.generate(workOrder);
    toast.success(`PDF downloaded for ${workOrder.title}`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'start':
        onUpdate(workOrder.id, { status: 'in-progress', progress: 10 });
        toast.success('Work order started');
        break;
      case 'complete':
        onUpdate(workOrder.id, { 
          status: 'completed', 
          progress: 100,
          updatedAt: new Date().toISOString()
        });
        toast.success('Work order completed');
        break;
      case 'hold':
        onUpdate(workOrder.id, { status: 'on-hold' });
        toast.info('Work order put on hold');
        break;
    }
  };

  // Grid View (Enhanced with PDF Download)
  if (viewMode === 'grid') {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs ${getPriorityColor(workOrder.priority)} border`}>
                  {workOrder.priority}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor(workOrder.status)} flex items-center gap-1`}>
                  <StatusIcon className="h-3 w-3" />
                  {workOrder.status.replace('-', ' ')}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                {workOrder.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">{workOrder.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{workOrder.progress || 0}%</span>
            </div>
            <Progress value={workOrder.progress || 0} className="h-2" />
          </div>

          {/* Metadata - UPDATED FIELDS */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
            {workOrder.allocatedTo && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="truncate">{workOrder.allocatedTo}</span>
              </div>
            )}
            {workOrder.dueDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>{new Date(workOrder.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {workOrder.toDepartment && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-600" />
                <span className="truncate">{workOrder.toDepartment}</span>
              </div>
            )}
            {workOrder.equipmentInfo && (
              <div className="flex items-center gap-2">
                <ToolCase className="h-4 w-4 text-orange-600" />
                <span className="truncate">{workOrder.equipmentInfo}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{workOrder.estimatedHours || 'N/A'}h</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(workOrder)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadPDF}
                className="text-green-600 hover:text-green-800 hover:bg-green-50"
              >
                <Download className="h-4 w-4" />
              </Button>
              {workOrder.status === 'pending' && (
                <Button 
                  size="sm"
                  onClick={() => handleQuickAction('start')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start
                </Button>
              )}
              {workOrder.status === 'in-progress' && (
                <Button 
                  size="sm"
                  onClick={() => handleQuickAction('complete')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List View (Enhanced)
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getPriorityColor(workOrder.priority)} border`}>
                {workOrder.priority}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getStatusColor(workOrder.status)} flex items-center gap-1`}>
                <StatusIcon className="h-3 w-3" />
                {workOrder.status.replace('-', ' ')}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
              {workOrder.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{workOrder.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {workOrder.allocatedTo && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{workOrder.allocatedTo}</span>
              </div>
            )}
            {workOrder.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(workOrder.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {workOrder.toDepartment && (
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                <span>{workOrder.toDepartment}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{workOrder.estimatedHours || 'N/A'}h estimated</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="w-24">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{workOrder.progress || 0}%</span>
            </div>
            <Progress value={workOrder.progress || 0} className="h-2" />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(workOrder)}
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4" />
            </Button>
            {workOrder.status === 'pending' && (
              <Button 
                size="sm"
                onClick={() => handleQuickAction('start')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start
              </Button>
            )}
            {workOrder.status === 'in-progress' && (
              <Button 
                size="sm"
                onClick={() => handleQuickAction('complete')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Minimalist View (Enhanced)
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-blue-50 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-3 h-3 rounded-full ${getPriorityColor(workOrder.priority).split(' ')[0]}`}></div>
        <StatusIcon className="h-4 w-4 text-gray-400" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
            {workOrder.title}
          </h3>
          <p className="text-xs text-gray-500 truncate">{workOrder.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-16">
          <Progress value={workOrder.progress || 0} className="h-1" />
        </div>
        <span className="text-xs text-gray-500 w-12 text-right">
          {workOrder.estimatedHours || 'N/A'}h
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onEdit(workOrder)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Quick Actions Component
function QuickActions({ onShowWorkOrderForm, onExport, onImport, onRefresh }: { 
  onShowWorkOrderForm: () => void;
  onExport: () => void;
  onImport: () => void;
  onRefresh: () => void;
}) {
  const actions = [
    {
      label: 'Create Work Order',
      description: 'Start new maintenance work',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: onShowWorkOrderForm
    },
    {
      label: 'Refresh Data',
      description: 'Reload from database',
      icon: RefreshCw,
      color: 'bg-green-500 hover:bg-green-600',
      action: onRefresh
    },
    {
      label: 'Export Data',
      description: 'Download work orders',
      icon: DownloadCloud,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: onExport
    },
    {
      label: 'Print Reports',
      description: 'Generate PDF reports',
      icon: Printer,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => window.print()
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {actions.map((action, index) => (
        <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <button
              onClick={action.action}
              className={`w-full text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg`}
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {action.label}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// UPDATED: Enhanced Maintenance Content Component
interface MaintenanceContentProps {
  workOrders: WorkOrder[];
  dashboardData: DashboardData;
  onWorkOrderSubmit: (formData: WorkOrderFormData) => Promise<void>;
  onUpdateWorkOrder: (id: string, updates: Partial<WorkOrder>) => Promise<void>;
  onDeleteWorkOrder: (id: string) => Promise<void>;
  onRefresh: () => void;
}

function MaintenanceContent({
  workOrders = [],
  dashboardData,
  onWorkOrderSubmit,
  onUpdateWorkOrder,
  onDeleteWorkOrder,
  onRefresh
}: MaintenanceContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);

  const filterButtons: FilterButton[] = [
    { 
      key: 'all', 
      label: 'All Work Orders', 
      count: dashboardData.totalWorkOrders || 0, 
      icon: FileText,
      color: 'bg-gray-500'
    },
    { 
      key: 'pending', 
      label: 'Pending', 
      count: dashboardData.pending || 0, 
      icon: Clock,
      color: 'bg-orange-500'
    },
    { 
      key: 'inProgress', 
      label: 'In Progress', 
      count: dashboardData.inProgress || 0, 
      icon: PlayCircle,
      color: 'bg-blue-500'
    },
    { 
      key: 'completed', 
      label: 'Completed', 
      count: dashboardData.completed || 0, 
      icon: CheckCircle2,
      color: 'bg-green-500'
    },
    { 
      key: 'high', 
      label: 'High Priority', 
      count: dashboardData.high + dashboardData.urgent || 0, 
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  // Enhanced filtering and sorting
  const filteredAndSortedWorkOrders = useMemo(() => workOrders
    .filter(wo => {
      // Quick filter
      const matchesQuickFilter = activeFilter === 'all' || 
        (activeFilter === 'pending' && wo.status === 'pending') ||
        (activeFilter === 'inProgress' && wo.status === 'in-progress') ||
        (activeFilter === 'completed' && wo.status === 'completed') ||
        (activeFilter === 'high' && (wo.priority === 'high' || wo.priority === 'urgent'));
      
      // Search query
      const matchesSearch = searchQuery === '' ||
        wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.allocatedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.toDepartment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.equipmentInfo?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Advanced filters
      const matchesAdvancedFilters = (
        (!advancedFilters.status || advancedFilters.status.length === 0 || advancedFilters.status.includes(wo.status)) &&
        (!advancedFilters.priority || advancedFilters.priority.length === 0 || advancedFilters.priority.includes(wo.priority)) &&
        (!advancedFilters.department || wo.toDepartment?.toLowerCase().includes(advancedFilters.department.toLowerCase())) &&
        (!advancedFilters.dueDateFrom || !wo.dueDate || new Date(wo.dueDate) >= new Date(advancedFilters.dueDateFrom)) &&
        (!advancedFilters.dueDateTo || !wo.dueDate || new Date(wo.dueDate) <= new Date(advancedFilters.dueDateTo))
      );
      
      return matchesQuickFilter && matchesSearch && matchesAdvancedFilters;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'dueDate' || sortField === 'createdAt') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    }), [workOrders, activeFilter, searchQuery, advancedFilters, sortField, sortOrder]);

  const handleEdit = (workOrder: WorkOrder) => {
    setEditingWorkOrder(workOrder);
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleAdvancedFilterChange = (newFilters: any) => {
    setAdvancedFilters(newFilters);
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({});
  };

  const handleExport = () => {
    toast.success('Exporting work orders data...');
  };

  const handleImport = () => {
    toast.info('Import functionality would open file upload dialog');
  };

  const handleStatCardClick = (stat: string) => {
    switch (stat) {
      case 'Total Work Orders':
        setActiveFilter('all');
        break;
      case 'Pending':
        setActiveFilter('pending');
        break;
      case 'In Progress':
        setActiveFilter('inProgress');
        break;
      case 'Completed':
        setActiveFilter('completed');
        break;
      case 'Overdue':
        setSearchQuery('overdue');
        break;
    }
  };

  // UPDATED: Handle Work Order Form submission
  const handleWorkOrderFormSubmit = async (formData: WorkOrderFormData) => {
    try {
      await onWorkOrderSubmit(formData);
      setShowWorkOrderForm(false);
    } catch (error) {
      console.error('Error in work order form submission:', error);
      // Error handling is done in the parent function
    }
  };

  // Show Work Order Form when creating new work order
  if (showWorkOrderForm) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <WorkOrderForm 
          onBack={() => setShowWorkOrderForm(false)}
          onSave={handleWorkOrderFormSubmit}
        />
      </div>
    );
  }

  // Show editing form if editing
  if (editingWorkOrder) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Work Order</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setEditingWorkOrder(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              onUpdateWorkOrder(editingWorkOrder.id, { ...editingWorkOrder });
              setEditingWorkOrder(null);
              toast.success('Work order updated successfully');
            }} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editingWorkOrder.title}
                onChange={(e) => setEditingWorkOrder({...editingWorkOrder, title: e.target.value})}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editingWorkOrder.description}
                onChange={(e) => setEditingWorkOrder({...editingWorkOrder, description: e.target.value})}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editingWorkOrder.status}
                onValueChange={(value) => setEditingWorkOrder({...editingWorkOrder, status: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Maintenance Dashboard
                </h1>
                <p className="text-blue-100 flex items-center gap-2 mt-1">
                  <Sparkles className="h-4 w-4" />
                  Comprehensive work order management and analytics
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={onRefresh}
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={handleExport}
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
            <StatCard
              title="Total Work Orders"
              value={dashboardData.totalWorkOrders || 0}
              subtitle="Active work orders"
              icon={<FileText className="h-4 w-4" />}
              trend={dashboardData.trending === 'improving' ? 'up' : dashboardData.trending === 'declining' ? 'down' : 'stable'}
              trendValue="+12%"
              onClick={() => handleStatCardClick('Total Work Orders')}
            />
            
            <StatCard
              title="Efficiency"
              value={`${dashboardData.efficiency || 0}%`}
              subtitle="Operational performance"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={dashboardData.trending === 'improving' ? 'up' : dashboardData.trending === 'declining' ? 'down' : 'stable'}
              onClick={() => handleStatCardClick('Efficiency')}
            />
              value={dashboardData.totalWorkOrders || 0}
              subtitle="Active work orders"
              icon={<FileText className="h-4 w-4" />}
              trend={dashboardData.trending}
              trendValue="+12%"
              onClick={() => handleStatCardClick('Total Work Orders')}
            />
            
            <StatCard
              title="Efficiency"
              value={`${dashboardData.efficiency || 0}%`}
              subtitle="Operational performance"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={dashboardData.trending}
              onClick={() => handleStatCardClick('Efficiency')}
            />
            
            <StatCard
              title="Completed"
              value={dashboardData.completed || 0}
              subtitle="Successfully resolved"
              icon={<CheckCircle2 className="h-4 w-4" />}
              trend={dashboardData.completed > 0 ? 'up' : 'stable'}
              trendValue="+8%"
              onClick={() => handleStatCardClick('Completed')}
            />
            
            <StatCard
              title="Overdue"
              value={dashboardData.overdueCount || 0}
              subtitle="Requiring attention"
              icon={<AlertTriangle className="h-4 w-4" />}
              trend={dashboardData.overdueCount > 0 ? 'down' : 'stable'}
              trendValue="-3%"
              onClick={() => handleStatCardClick('Overdue')}
            />
            
            <StatCard
              title="Safety Score"
              value={`${dashboardData.safetyScore || 0}%`}
              subtitle="Safety compliance"
              icon={<Shield className="h-4 w-4" />}
              trend={dashboardData.safetyScore > 90 ? 'up' : 'stable'}
              onClick={() => handleStatCardClick('Safety Score')}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Actions */}
        <QuickActions 
          onShowWorkOrderForm={() => setShowWorkOrderForm(true)}
          onExport={handleExport}
          onImport={handleImport}
          onRefresh={onRefresh}
        />

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-xl"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="workorders" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-xl"
            >
              <FileText className="h-4 w-4" />
              Work Orders
            </TabsTrigger>
            <TabsTrigger 
              value="presets" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-xl"
            >
              <Settings className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-xl"
            >
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* AI Recommendations */}
            {dashboardData.recommendations && dashboardData.recommendations.length > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg text-gray-900">AI Insights & Recommendations</CardTitle>
                      <CardDescription>Smart suggestions to optimize your maintenance operations</CardDescription>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {dashboardData.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-white">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Team Performance</span>
                    <span className="font-semibold">{dashboardData.teamPerformance || 88}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Completion Time</span>
                    <span className="font-semibold">{dashboardData.avgCompletionTime || 2.5}d</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cost Savings</span>
                    <span className="font-semibold text-green-600">${dashboardData.costSavings?.toLocaleString() || '0'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-600" />
                    This Week's Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Complete High Priority</span>
                        <span>4/6</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Reduce Overdue</span>
                        <span>2/5</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Improve Efficiency</span>
                        <span>86%</span>
                      </div>
                      <Progress value={86} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4 text-purple-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workOrders.slice(0, 3).map((wo, index) => (
                    <div key={`${wo.id}-${index}`} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        wo.status === 'completed' ? 'bg-green-500' :
                        wo.status === 'in-progress' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="text-gray-600 truncate flex-1">{wo.title}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(wo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Work Orders Tab */}
          <TabsContent value="workorders" className="space-y-6">
            {/* Enhanced Toolbar */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                  {/* Search and Quick Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search work orders, equipment, departments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                      />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {filterButtons.map((filter) => (
                        <button
                          key={filter.key}
                          onClick={() => setActiveFilter(filter.key)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-all duration-200 border ${
                            activeFilter === filter.key 
                              ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${filter.color}`}></div>
                          <span className="font-medium">{filter.label}</span>
                          <span className="bg-white text-gray-700 rounded-full px-2 py-1 text-xs font-semibold">
                            {filter.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="flex items-center gap-2 bg-white border-gray-200"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                        {Object.keys(advancedFilters).length > 0 && (
                          <Badge variant="secondary" className="ml-1 bg-blue-500 text-white">
                            {Object.keys(advancedFilters).length}
                          </Badge>
                        )}
                      </Button>
                      <AdvancedFilter
                        filters={advancedFilters}
                        onFilterChange={handleAdvancedFilterChange}
                        onClearFilters={handleClearAdvancedFilters}
                        isOpen={showAdvancedFilters}
                        onClose={() => setShowAdvancedFilters(false)}
                      />
                    </div>
                    
                    <SortDropdown
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSortChange={handleSortChange}
                    />
                    
                    <ViewToggle
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Orders Display */}
            <div>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Work Orders ({filteredAndSortedWorkOrders.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {searchQuery ? `Search results for "${searchQuery}"` : `Showing ${filteredAndSortedWorkOrders.length} of ${workOrders.length} work orders`}
                    {Object.keys(advancedFilters).length > 0 && ' with applied filters'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Sorted by: {sortField.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </div>

              {/* Work Orders Content */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedWorkOrders.map((workOrder, index) => (
                    <WorkOrderCard
                      key={`${workOrder.id}-${index}-${workOrder.updatedAt || workOrder.createdAt}`}
                      workOrder={workOrder}
                      onEdit={handleEdit}
                      onUpdate={onUpdateWorkOrder}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <div className="divide-y divide-gray-200">
                    {filteredAndSortedWorkOrders.map((workOrder, index) => (
                      <WorkOrderCard
                        key={`${workOrder.id}-${index}-${workOrder.updatedAt || workOrder.createdAt}`}
                        workOrder={workOrder}
                        onEdit={handleEdit}
                        onUpdate={onUpdateWorkOrder}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </Card>
              )}

              {viewMode === 'minimalist' && (
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <div className="divide-y divide-gray-100">
                    {filteredAndSortedWorkOrders.map((workOrder, index) => (
                      <WorkOrderCard
                        key={`${workOrder.id}-${index}-${workOrder.updatedAt || workOrder.createdAt}`}
                        workOrder={workOrder}
                        onEdit={handleEdit}
                        onUpdate={onUpdateWorkOrder}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </Card>
              )}

              {/* Empty State */}
              {filteredAndSortedWorkOrders.length === 0 && (
                <Card className="bg-white border border-gray-200 text-center py-12">
                  <CardContent>
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No work orders found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchQuery || Object.keys(advancedFilters).length > 0 
                        ? 'Try adjusting your search terms or filters to see more results.' 
                        : 'Get started by creating your first work order to track maintenance tasks.'
                      }
                    </p>
                    <div className="flex gap-3 justify-center">
                      {(searchQuery || Object.keys(advancedFilters).length > 0) && (
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSearchQuery('');
                            setAdvancedFilters({});
                            setActiveFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                      <Button 
                        onClick={() => setShowWorkOrderForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Work Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Maintenance Presets</h2>
                <p className="text-gray-600">Pre-configured templates for recurring maintenance tasks</p>
              </div>
              <Button onClick={() => toast.info('Preset creation would open here')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Preset
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MAINTENANCE_PRESETS.map((preset) => (
                <Card key={preset.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">{preset.name}</CardTitle>
                    <CardDescription>{preset.description}</CardDescription>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {preset.category}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {preset.recurrence?.frequency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-semibold">{preset.estimatedHours}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost Estimate:</span>
                      <span className="font-semibold">${preset.costEstimate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Checklist Items:</span>
                      <span className="font-semibold">{preset.checklist.length}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setShowWorkOrderForm(true);
                          toast.success(`Creating work order from "${preset.name}" preset`);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Use Template
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.info('Edit preset functionality')}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Work Order Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'Completed', count: dashboardData.completed, color: 'bg-green-500', percentage: (dashboardData.completed / dashboardData.totalWorkOrders) * 100 },
                      { status: 'In Progress', count: dashboardData.inProgress, color: 'bg-blue-500', percentage: (dashboardData.inProgress / dashboardData.totalWorkOrders) * 100 },
                      { status: 'Pending', count: dashboardData.pending, color: 'bg-yellow-500', percentage: (dashboardData.pending / dashboardData.totalWorkOrders) * 100 },
                      { status: 'On Hold', count: dashboardData.onHold, color: 'bg-purple-500', percentage: (dashboardData.onHold / dashboardData.totalWorkOrders) * 100 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.status}</span>
                          <span className="text-gray-600">{item.count} ({item.percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock4 className="h-5 w-5 text-purple-600" />
                    Priority Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { priority: 'Urgent', count: dashboardData.urgent, color: 'bg-red-500' },
                      { priority: 'High', count: dashboardData.high, color: 'bg-orange-500' },
                      { priority: 'Medium', count: dashboardData.medium, color: 'bg-yellow-500' },
                      { priority: 'Low', count: dashboardData.low, color: 'bg-green-500' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.priority}</span>
                        </div>
                        <Badge variant="secondary">{item.count} work orders</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  Upcoming Schedule
                </CardTitle>
                <CardDescription>
                  Work orders scheduled for the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workOrders
                    .filter(wo => wo.dueDate && new Date(wo.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                    .slice(0, 5)
                    .map(wo => (
                      <div key={wo.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{wo.title}</p>
                            <p className="text-xs text-gray-500">{wo.toDepartment} • {wo.equipmentInfo}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            wo.priority === 'urgent' ? 'destructive' :
                            wo.priority === 'high' ? 'default' : 'secondary'
                          }>
                            {wo.priority}
                          </Badge>
                          <span className="text-sm font-medium">
                            Due: {new Date(wo.dueDate!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ==================== UPDATED MAIN COMPONENT ====================
export default function MaintenancePage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    loadWorkOrders();
  }, []);

  // UPDATED: Load work orders from database using correct API
  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading work orders from backend...');
      
      const backendWorkOrders = await getWorkOrders();
      console.log('📦 Raw work orders from API:', backendWorkOrders);
      
      // Convert backend work orders to frontend format
      const convertedWorkOrders = backendWorkOrders.map(backendToWorkOrder);
      console.log('🔄 Converted work orders:', convertedWorkOrders);
      
      setWorkOrders(convertedWorkOrders);
      
      console.log('✅ Successfully loaded work orders:', convertedWorkOrders.length);
    } catch (error) {
      console.error('❌ Error loading work orders:', error);
      toast.error('Failed to load work orders');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Handle work order creation - uses WorkOrderFormData
  const handleWorkOrderSubmit = async (formData: WorkOrderFormData): Promise<void> => {
    try {
      console.log('📝 Work order form submitted in maintenance page:', formData);
      
      // Transform data to backend format
      const backendData = {
        work_order_number: formData.workOrderNumber,
        title: formData.jobRequestDetails?.substring(0, 50) || 'Work Order',
        description: formData.jobRequestDetails,
        status: 'pending',
        priority: 'medium',
        to_department: formData.toDepartment,
        to_section: formData.toSection,
        from_department: formData.fromDepartment,
        from_section: formData.fromSection,
        date_raised: formData.dateRaised,
        time_raised: formData.timeRaised,
        account_number: formData.accountNumber,
        equipment_info: formData.equipmentInfo,
        user_lab_today: formData.userLabToday,
        job_type: formData.jobType,
        job_request_details: formData.jobRequestDetails,
        requested_by: formData.requestedBy,
        authorising_foreman: formData.authorisingForeman,
        authorising_engineer: formData.authorisingEngineer,
        allocated_to: formData.allocatedTo,
        estimated_hours: formData.estimatedHours,
        responsible_foreman: formData.responsibleForeman,
        job_instructions: formData.jobInstructions,
        manpower: formData.manpower,
        work_done_details: formData.workDoneDetails,
        cause_of_failure: formData.causeOfFailure,
        delay_details: formData.delayDetails,
        artisan_name: formData.artisanName,
        artisan_sign: formData.artisanSign,
        artisan_date: formData.artisanDate,
        foreman_name: formData.foremanName,
        foreman_sign: formData.foremanSign,
        foreman_date: formData.foremanDate,
        time_work_started: formData.timeWorkStarted,
        time_work_finished: formData.timeWorkFinished,
        total_time_worked: formData.totalTimeWorked,
        overtime_start_time: formData.overtimeStartTime,
        overtime_end_time: formData.overtimeEndTime,
        overtime_hours: formData.overtimeHours,
        delay_from_time: formData.delayFromTime,
        delay_to_time: formData.delayToTime,
        total_delay_hours: formData.totalDelayHours,
      };
      
      // Save to database using API
      const result = await createWorkOrder(backendData);
      
      if (result && result.success) {
        // Refresh from database to get the actual saved work order
        await loadWorkOrders();
        toast.success('Work order created successfully!');
      } else {
        throw new Error(result?.error || 'Failed to create work order');
      }
    } catch (error) {
      console.error('Error creating work order:', error);
      toast.error('Failed to create work order. Please try again.');
    }
  };

  // Handle work order update
  const handleUpdateWorkOrder = async (id: string, updates: Partial<WorkOrder>): Promise<void> => {
    try {
      setWorkOrders(prev =>
        prev.map(wo =>
          wo.id === id
            ? { ...wo, ...updates, updatedAt: new Date().toISOString() }
            : wo
        )
      );
      
      toast.success('Work order updated successfully');
    } catch (err) {
      console.error('Failed to update work order:', err);
      toast.error('Failed to update work order');
    }
  };

  // Handle work order deletion
  const handleDeleteWorkOrder = async (id: string): Promise<void> => {
    try {
      setWorkOrders(prev => prev.filter(wo => wo.id !== id));
      
      toast.success('Work order deleted successfully');
    } catch (err) {
      console.error('Failed to delete work order:', err);
      toast.error('Failed to delete work order');
    }
  };

  // UPDATED: Refresh work orders from database
  const handleRefresh = () => {
    loadWorkOrders();
    toast.success('Refreshing work orders from database...');
  };

  // Calculate statistics safely
  const workOrderStats = calculateWorkOrderStats(workOrders);
  
  // Enhanced efficiency calculation
  const calculateEfficiency = (): number => {
    if (!workOrders || workOrders.length === 0) return 86;
    
    const totalCompletionRate = workOrders.reduce((sum, wo) => {
      let rate = 0;
      switch (wo.status) {
        case 'completed': rate = 100; break;
        case 'in-progress': rate = 50; break;
        case 'on-hold': rate = 25; break;
        case 'pending': rate = 0; break;
        default: rate = 0;
      }
      return sum + rate;
    }, 0);
    
    return Math.round(totalCompletionRate / workOrders.length);
  };

  // Enhanced trending analysis
  const getTrendingStatus = (): 'improving' | 'declining' | 'stable' => {
    const completionRate = workOrderStats.completed / Math.max(workOrderStats.total, 1);
    const progressRate = workOrderStats.inProgress / Math.max(workOrderStats.total, 1);
    
    if (completionRate > 0.7 && progressRate > 0.2) return 'improving';
    if (completionRate < 0.3 || workOrderStats.overdueCount > workOrderStats.total * 0.2) return 'declining';
    return 'stable';
  };

  // Prepare dashboard data
  const dashboardData: DashboardData = {
    ...workOrderStats,
    efficiency: calculateEfficiency(),
    trending: getTrendingStatus(),
    recommendations: generateAIRecommendations(workOrders, workOrderStats),
    avgCompletionTime: workOrderStats.avgCompletionTime,
    overdueCount: workOrderStats.overdueCount,
    totalCost: workOrderStats.totalCost,
    costSavings: workOrderStats.costSavings,
    safetyScore: workOrderStats.safetyScore,
    teamPerformance: 88
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Loading maintenance dashboard...</div>
        </div>
      </div>
    );
  }

  // Wait for client-side mounting
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Initializing maintenance dashboard...</div>
      </div>
    );
  }

  return (
    <MaintenanceContent
      workOrders={workOrders}
      dashboardData={dashboardData}
      onWorkOrderSubmit={handleWorkOrderSubmit}
      onUpdateWorkOrder={handleUpdateWorkOrder}
      onDeleteWorkOrder={handleDeleteWorkOrder}
      onRefresh={handleRefresh}
    />
  );
}