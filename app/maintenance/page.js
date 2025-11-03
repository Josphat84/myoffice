// app/maintenance/page.js
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building,
  Truck,
  Monitor,
  Eye,
  RefreshCw,
  Home,
  ArrowLeft,
  FileText,
  BarChart3,
  Users,
  CalendarDays,
  MapPin,
  TrendingUp,
  CheckSquare,
  Clock4,
  Zap,
  Download,
  Grid,
  List,
  Shield,
  Cog,
  Sparkles,
  X,
  SlidersHorizontal,
  Activity,
  Target,
  ClipboardList,
  Workflow,
  ToolCase,
  AlertCircle,
  Gauge,
  LineChart,
  PieChart,
  Package,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock Data - Realistic enterprise data
const MOCK_EQUIPMENT = [
  { id: 'eq-001', name: 'CNC Machine #1', category: 'equipment', location: 'Production Floor A', status: 'operational', lastMaintenance: '2024-01-15', nextMaintenance: '2024-02-15', uptime: 98.2, criticality: 'high' },
  { id: 'eq-002', name: 'Forklift #3', category: 'vehicle', location: 'Warehouse', status: 'operational', lastMaintenance: '2024-01-20', nextMaintenance: '2024-02-20', uptime: 95.8, criticality: 'medium' },
  { id: 'eq-003', name: 'Server Rack A', category: 'it', location: 'Server Room', status: 'operational', lastMaintenance: '2024-01-10', nextMaintenance: '2024-04-10', uptime: 99.9, criticality: 'critical' },
  { id: 'eq-004', name: 'HVAC Unit North', category: 'facility', location: 'Roof', status: 'operational', lastMaintenance: '2024-01-05', nextMaintenance: '2024-04-05', uptime: 97.5, criticality: 'high' },
  { id: 'eq-005', name: 'Safety Shower Station', category: 'safety', location: 'Lab Area', status: 'operational', lastMaintenance: '2024-01-25', nextMaintenance: '2024-02-25', uptime: 100, criticality: 'critical' },
  { id: 'eq-006', name: 'Assembly Line B', category: 'equipment', location: 'Production Floor B', status: 'maintenance', lastMaintenance: '2024-01-18', nextMaintenance: '2024-02-18', uptime: 96.3, criticality: 'high' },
  { id: 'eq-007', name: 'Compressor Unit #2', category: 'equipment', location: 'Utility Room', status: 'operational', lastMaintenance: '2024-01-12', nextMaintenance: '2024-03-12', uptime: 94.7, criticality: 'medium' }
];

const MOCK_EMPLOYEES = [
  { id: 'emp-1', name: 'Mike Johnson', department: 'operations', role: 'Operations Manager', email: 'mike.johnson@company.com', phone: '+1-555-0101', status: 'active' },
  { id: 'emp-2', name: 'Sarah Chen', department: 'maintenance', role: 'Senior Technician', skills: ['Electrical', 'Mechanical', 'PLC'], email: 'sarah.chen@company.com', phone: '+1-555-0102', status: 'active', certification: 'Certified Maintenance Professional' },
  { id: 'emp-3', name: 'David Rodriguez', department: 'maintenance', role: 'HVAC Specialist', skills: ['HVAC', 'Plumbing', 'Refrigeration'], email: 'david.rodriguez@company.com', phone: '+1-555-0103', status: 'active', certification: 'EPA Certified' },
  { id: 'emp-4', name: 'Emily Watson', department: 'warehouse', role: 'Inventory Manager', email: 'emily.watson@company.com', phone: '+1-555-0104', status: 'active' },
  { id: 'emp-5', name: 'Alex Kim', department: 'it', role: 'Systems Admin', email: 'alex.kim@company.com', phone: '+1-555-0105', status: 'active' },
  { id: 'emp-6', name: 'Mike Wilson', department: 'maintenance', role: 'Mechanical Technician', skills: ['Mechanical', 'Welding', 'Fabrication'], email: 'mike.wilson@company.com', phone: '+1-555-0106', status: 'active' },
  { id: 'emp-7', name: 'Lisa Wang', department: 'maintenance', role: 'Electrical Engineer', skills: ['Electrical', 'Instrumentation', 'Controls'], email: 'lisa.wang@company.com', phone: '+1-555-0107', status: 'active', certification: 'PE Licensed' }
];

const generateMockRequests = () => {
  const now = new Date();
  return [
    {
      id: 'maint-001',
      title: 'CNC Machine Precision Calibration',
      description: 'Quarterly precision calibration and preventive maintenance for CNC machine #1. Includes ball screw inspection, lubrication system check, and spindle alignment verification.',
      category: 'equipment',
      priority: 'high',
      status: 'completed',
      assignedTo: 'emp-2',
      assignedToName: 'Sarah Chen',
      equipmentId: 'eq-001',
      equipmentName: 'CNC Machine #1',
      location: 'Production Floor A',
      reportedBy: 'emp-1',
      reportedByName: 'Mike Johnson',
      reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toISOString(),
      scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
      completedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
      estimatedHours: 6,
      actualHours: 5.5,
      cost: 1250,
      notes: 'Calibration completed successfully. All tolerances within specification. Replaced worn ball screw covers.',
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toISOString(),
      updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
      downtime: 5.5,
      partsUsed: ['Ball screw covers', 'Lubricant', 'Calibration tools']
    },
    {
      id: 'maint-002',
      title: 'Forklift Hydraulic System Repair',
      description: 'Emergency repair of hydraulic fluid leak in forklift #3. System pressure dropping rapidly, requires immediate attention to prevent equipment damage.',
      category: 'vehicle',
      priority: 'critical',
      status: 'in-progress',
      assignedTo: 'emp-6',
      assignedToName: 'Mike Wilson',
      equipmentId: 'eq-002',
      equipmentName: 'Forklift #3',
      location: 'Warehouse',
      reportedBy: 'emp-4',
      reportedByName: 'Emily Watson',
      reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
      scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      completedDate: null,
      estimatedHours: 8,
      actualHours: 3.2,
      cost: null,
      notes: 'Main seal replacement required. Parts ordered - ETA 2 days. Temporary seal applied to contain leak.',
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
      updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      downtime: 3.2,
      partsUsed: ['Temporary seal kit']
    },
    {
      id: 'maint-003',
      title: 'Data Center Cooling Emergency',
      description: 'CRAC unit failure in server room causing temperature rise. Critical situation requiring immediate intervention to prevent server shutdown.',
      category: 'it',
      priority: 'critical',
      status: 'open',
      assignedTo: null,
      assignedToName: null,
      equipmentId: 'eq-003',
      equipmentName: 'Server Rack A',
      location: 'Server Room',
      reportedBy: 'emp-5',
      reportedByName: 'Alex Kim',
      reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      scheduledDate: null,
      completedDate: null,
      estimatedHours: 4,
      actualHours: null,
      cost: null,
      notes: 'Temperature at 85°F and rising. Backup cooling activated but insufficient. Emergency HVAC team notified.',
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      downtime: 0,
      partsUsed: []
    },
    {
      id: 'maint-004',
      title: 'Quarterly HVAC Maintenance',
      description: 'Scheduled quarterly preventive maintenance for HVAC system including filter replacement, belt inspection, and system diagnostics.',
      category: 'preventive',
      priority: 'medium',
      status: 'scheduled',
      assignedTo: 'emp-3',
      assignedToName: 'David Rodriguez',
      equipmentId: 'eq-004',
      equipmentName: 'HVAC Unit North',
      location: 'Roof',
      reportedBy: 'system',
      reportedByName: 'Automated System',
      reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toISOString(),
      scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString(),
      completedDate: null,
      estimatedHours: 6,
      actualHours: null,
      cost: null,
      notes: 'Routine preventive maintenance scheduled',
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toISOString(),
      updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toISOString(),
      downtime: 0,
      partsUsed: []
    },
    {
      id: 'maint-005',
      title: 'Safety Equipment Inspection',
      description: 'Monthly safety shower and eye wash station inspection for compliance and operational readiness.',
      category: 'safety',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'emp-7',
      assignedToName: 'Lisa Wang',
      equipmentId: 'eq-005',
      equipmentName: 'Safety Shower Station',
      location: 'Lab Area',
      reportedBy: 'system',
      reportedByName: 'Automated System',
      reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
      scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
      completedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
      estimatedHours: 2,
      actualHours: 1.5,
      cost: 0,
      notes: 'All safety equipment operational and compliant. No issues found.',
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
      updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
      downtime: 1.5,
      partsUsed: []
    }
  ];
};

// Utility Components
function TrendingDown({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  );
}

function Minus({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );
}

// Enterprise Stat Card Component
function EnterpriseStatCard({ title, value, icon: Icon, color, trend, description }) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    red: 'from-red-500 to-rose-500',
    amber: 'from-amber-500 to-yellow-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-violet-500',
    orange: 'from-orange-500 to-amber-500',
    slate: 'from-slate-500 to-slate-600',
    emerald: 'from-emerald-500 to-teal-500'
  };

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus
  };

  const TrendIcon = trendIcons[trend];

  return (
    <div className="bg-white/60 border border-slate-200/60 rounded-lg p-3 shadow-xs hover:shadow-sm transition-all duration-300 group dark:bg-slate-800/60 dark:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-xs`}>
              <Icon className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {title}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {description}
              </div>
            </div>
            <div className={`p-1 rounded ${
              trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
              trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
              'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
            }`}>
              <TrendIcon className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI Metric Component
function KPIMetric({ label, value, target, format = "percent" }) {
  const percentage = (value / target) * 100;
  const isHealthy = percentage >= 90;
  const isWarning = percentage >= 75 && percentage < 90;
  const isCritical = percentage < 75;

  const formattedValue = format === "percent" ? `${value}%` : 
                        format === "hours" ? `${value.toFixed(1)}h` : value;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className={`text-sm font-semibold ${
          isHealthy ? 'text-green-600' : 
          isWarning ? 'text-amber-600' : 'text-red-600'
        }`}>
          {formattedValue}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 rounded-full h-2 dark:bg-slate-700">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isHealthy ? 'bg-green-500' : 
              isWarning ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Target: {target}%</span>
      </div>
    </div>
  );
}

// Technician Performance Component
function TechnicianPerformance({ tech, requests }) {
  const completedThisMonth = requests.filter(req => 
    req.assignedTo === tech.id && 
    req.status === 'completed' &&
    new Date(req.completedDate).getMonth() === new Date().getMonth()
  ).length;

  const avgCompletionTime = completedThisMonth > 0 ? 
    requests.filter(req => req.assignedTo === tech.id && req.actualHours)
      .reduce((sum, req) => sum + (req.actualHours || 0), 0) / completedThisMonth : 0;

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xs">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
            {tech.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{tech.activeWork} active</span>
            <span>•</span>
            <span>{completedThisMonth} completed</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {avgCompletionTime.toFixed(1)}h
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">avg time</div>
      </div>
    </div>
  );
}

// Equipment Health Component
function EquipmentHealth({ equipment }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'maintenance': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400';
      case 'down': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const getCriticalityIcon = (criticality) => {
    switch (criticality) {
      case 'critical': return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'high': return <AlertCircle className="h-3 w-3 text-amber-500" />;
      case 'medium': return <Gauge className="h-3 w-3 text-blue-500" />;
      default: return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
      <div className="flex items-center gap-3">
        {getCriticalityIcon(equipment.criticality)}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
            {equipment.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {equipment.location}
          </div>
        </div>
      </div>
      <div className="text-right">
        <Badge variant="outline" className={getStatusColor(equipment.status)}>
          {equipment.status}
        </Badge>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {equipment.uptime}% uptime
        </div>
      </div>
    </div>
  );
}

// Priority Distribution Component
function PriorityDistribution({ requests }) {
  const priorityLevels = ['low', 'medium', 'high', 'critical'];
  
  return (
    <Card className="border border-slate-200/60 shadow-xs dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-base">Priority Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priorityLevels.map(priority => {
            const count = requests.filter(r => r.priority === priority).length;
            const percentage = requests.length > 0 ? (count / requests.length) * 100 : 0;
            const colorClass = 
              priority === 'critical' ? 'bg-red-500' :
              priority === 'high' ? 'bg-orange-500' :
              priority === 'medium' ? 'bg-amber-500' : 'bg-green-500';
            return (
              <div key={priority} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{priority}</span>
                  <span className="text-slate-500 dark:text-slate-400">{count} requests</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700">
                  <div 
                    className={`h-2 rounded-full ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Category Distribution Component
function CategoryDistribution({ requests }) {
  const categories = [
    { id: 'equipment', name: 'Equipment', color: 'blue' },
    { id: 'facility', name: 'Facility', color: 'purple' },
    { id: 'vehicle', name: 'Vehicle', color: 'cyan' },
    { id: 'safety', name: 'Safety', color: 'emerald' },
    { id: 'it', name: 'IT', color: 'indigo' },
    { id: 'preventive', name: 'Preventive', color: 'teal' }
  ];

  return (
    <Card className="border border-slate-200/60 shadow-xs dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-base">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map(category => {
            const count = requests.filter(r => r.category === category.id).length;
            const percentage = requests.length > 0 ? (count / requests.length) * 100 : 0;
            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-${category.color}-500`} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{count}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{percentage.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity Component
function RecentActivity({ requests }) {
  return (
    <Card className="border border-slate-200/60 shadow-xs dark:border-slate-700">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest maintenance requests and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.slice(0, 5).map(request => (
            <div key={request.id} className="flex items-center justify-between p-3 border border-slate-200/60 rounded-lg dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  request.priority === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                  request.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{request.title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {request.equipmentName} • {request.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize text-xs">
                  {request.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Enterprise Work Order Card Component
function EnterpriseWorkOrderCard({ request, onAssign, onComplete }) {
  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      'on-hold': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
      'completed': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      'scheduled': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      'medium': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
      'high': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      'critical': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'equipment': Cog,
      'facility': Building,
      'vehicle': Truck,
      'safety': Shield,
      'it': Server,
      'preventive': CheckSquare
    };
    return icons[category] || Wrench;
  };

  const CategoryIcon = getCategoryIcon(request.category);
  const scheduledDate = request.scheduledDate ? new Date(request.scheduledDate) : null;
  const isOverdue = scheduledDate && new Date(scheduledDate) < new Date() && !request.completedDate;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 shadow-sm border border-slate-200/60 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              request.priority === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
              request.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
              'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            }`}>
              <CategoryIcon className="h-4 w-4" />
            </div>
            <Badge className={getPriorityColor(request.priority)}>
              {request.priority}
            </Badge>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className={getStatusColor(request.status)}>
              {request.status.replace('-', ' ')}
            </Badge>
            {isOverdue && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 text-xs">
                Overdue
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {request.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {request.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Building className="h-4 w-4" />
              <span className="font-medium">{request.equipmentName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{request.location}</span>
            </div>
          </div>
          
          {request.assignedToName && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <User className="h-4 w-4" />
              <span>{request.assignedToName}</span>
            </div>
          )}
          
          {scheduledDate && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{scheduledDate.toLocaleDateString()}</span>
              {request.estimatedHours && (
                <span className="text-slate-500">• {request.estimatedHours}h est.</span>
              )}
            </div>
          )}

          {request.downtime > 0 && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span>{request.downtime}h downtime</span>
              {request.cost && (
                <span className="text-slate-500">• ${request.cost}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-700">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1 gap-2">
                <Eye className="h-4 w-4" />
                Details
              </Button>
            </TooltipTrigger>
            <TooltipContent>View full work order details</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {request.status === 'open' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onAssign(request)}
                >
                  <User className="h-4 w-4" />
                  Assign
                </Button>
              </TooltipTrigger>
              <TooltipContent>Assign to technician</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {request.status === 'in-progress' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => onComplete(request)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark as completed</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}

// Enhanced Work Orders Section
function EnterpriseWorkOrdersSection({ 
  requests, 
  allRequests,
  searchTerm, 
  onSearchChange, 
  onAssign, 
  onComplete, 
  viewMode, 
  onViewModeChange,
  filters,
  onFiltersChange,
  showFilters,
  onShowFiltersChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
  employees
}) {
  const statusOptions = ['open', 'in-progress', 'completed', 'scheduled', 'on-hold'];
  const priorityOptions = ['low', 'medium', 'high', 'critical'];
  const categoryOptions = ['equipment', 'facility', 'vehicle', 'safety', 'it', 'preventive'];

  const toggleFilter = (type, value) => {
    const currentFilters = filters[type];
    if (currentFilters.includes(value)) {
      onFiltersChange({
        ...filters,
        [type]: currentFilters.filter(item => item !== value)
      });
    } else {
      onFiltersChange({
        ...filters,
        [type]: [...currentFilters, value]
      });
    }
  };

  return (
    <>
      {/* Enhanced Search and Filter Bar */}
      <Card className="border border-slate-200/60 shadow-xs dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search work orders, equipment, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 w-full border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Date Range Filter */}
              <Select value={dateRange} onValueChange={onDateRangeChange}>
                <SelectTrigger className="w-[140px] border-slate-300 dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden dark:border-slate-600">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none border-0 h-9 w-9 p-0"
                  onClick={() => onViewModeChange("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none border-0 h-9 w-9 p-0"
                  onClick={() => onViewModeChange("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Advanced Filters Toggle */}
              <Button 
                variant={showFilters ? "default" : "outline"} 
                size="sm" 
                className="gap-2 border-slate-300 dark:border-slate-600"
                onClick={() => onShowFiltersChange(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {filters.status.length + filters.priority.length + filters.category.length + filters.assignedTo.length + (searchTerm ? 1 : 0) + (dateRange !== 'all' ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              {/* Export Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 border-slate-300 dark:border-slate-600">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export to Excel/PDF</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Advanced Filters</h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-7 text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">Status</label>
                  <div className="space-y-2">
                    {statusOptions.map(status => (
                      <div key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onChange={() => toggleFilter('status', status)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                        />
                        <label htmlFor={`status-${status}`} className="ml-2 text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {status.replace('-', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">Priority</label>
                  <div className="space-y-2">
                    {priorityOptions.map(priority => (
                      <div key={priority} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`priority-${priority}`}
                          checked={filters.priority.includes(priority)}
                          onChange={() => toggleFilter('priority', priority)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                        />
                        <label htmlFor={`priority-${priority}`} className="ml-2 text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {priority}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">Category</label>
                  <div className="space-y-2">
                    {categoryOptions.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={filters.category.includes(category)}
                          onChange={() => toggleFilter('category', category)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned To Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">Assigned To</label>
                  <div className="space-y-2">
                    {employees.filter(emp => emp.department === 'maintenance').map(tech => (
                      <div key={tech.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`tech-${tech.id}`}
                          checked={filters.assignedTo.includes(tech.id)}
                          onChange={() => toggleFilter('assignedTo', tech.id)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                        />
                        <label htmlFor={`tech-${tech.id}`} className="ml-2 text-sm text-slate-700 dark:text-slate-300 truncate">
                          {tech.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{requests.length}</span> of <span className="font-semibold">{allRequests.length}</span> work orders
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs h-7">
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <RefreshCw className="h-3 w-3" />
          Auto-refresh: 5m
        </div>
      </div>

      {/* Work Orders Display */}
      {requests.length === 0 ? (
        <Card className="border border-dashed border-slate-300 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {allRequests.length === 0 ? 'No work orders yet' : 'No work orders found'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {allRequests.length === 0 
                ? 'Get started by creating your first work order.' 
                : 'No work orders match your current filters.'
              }
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {requests.map(request => (
            <EnterpriseWorkOrderCard 
              key={request.id} 
              request={request} 
              onAssign={onAssign}
              onComplete={onComplete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(request => (
            <div key={request.id} className="p-4 border border-slate-200/60 rounded-lg dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    request.priority === 'critical' ? 'bg-red-100 text-red-600' :
                    request.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{request.title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{request.equipmentName} • {request.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{request.status}</Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Main Component
export default function MaintenancePage() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    category: [],
    assignedTo: []
  });

  // Initialize with mock data
  useEffect(() => {
    setRequests(generateMockRequests());
  }, []);

  // Filter requests based on search and filters
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = searchTerm === '' || 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status.length === 0 || filters.status.includes(request.status);
      const matchesPriority = filters.priority.length === 0 || filters.priority.includes(request.priority);
      const matchesCategory = filters.category.length === 0 || filters.category.includes(request.category);
      const matchesAssigned = filters.assignedTo.length === 0 || filters.assignedTo.includes(request.assignedTo);

      // Date range filtering
      let matchesDateRange = true;
      if (dateRange !== 'all') {
        const requestDate = new Date(request.reportedDate);
        const now = new Date();
        const startDate = new Date();

        switch (dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
        }

        matchesDateRange = requestDate >= startDate;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssigned && matchesDateRange;
    });
  }, [requests, searchTerm, filters, dateRange]);

  // Enhanced statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const open = requests.filter(r => r.status === 'open').length;
    const inProgress = requests.filter(r => r.status === 'in-progress').length;
    const completed = requests.filter(r => r.status === 'completed').length;
    const critical = requests.filter(r => r.priority === 'critical').length;
    const overdue = requests.filter(r => {
      if (r.status === 'completed' || !r.scheduledDate) return false;
      const scheduledDate = new Date(r.scheduledDate);
      const now = new Date();
      return scheduledDate < now;
    }).length;
    const totalDowntime = requests.filter(r => r.downtime).reduce((sum, r) => sum + (r.downtime || 0), 0);
    const totalCost = requests.filter(r => r.cost).reduce((sum, r) => sum + (r.cost || 0), 0);
    const avgCompletionTime = completed > 0 ? 
      requests.filter(r => r.status === 'completed' && r.actualHours)
        .reduce((sum, r) => sum + (r.actualHours || 0), 0) / completed : 0;

    return {
      total, open, inProgress, completed, critical, overdue,
      totalDowntime, totalCost, avgCompletionTime
    };
  }, [requests]);

  const completionRate = requests.length > 0 ? (stats.completed / requests.length) * 100 : 0;

  const technicianWorkload = MOCK_EMPLOYEES
    .filter(emp => emp.department === 'maintenance')
    .map(tech => ({
      ...tech,
      activeWork: requests.filter(req => 
        req.assignedTo === tech.id && 
        ['open', 'in-progress'].includes(req.status)
      ).length,
      completedWork: requests.filter(req => 
        req.assignedTo === tech.id && 
        req.status === 'completed'
      ).length,
      totalHours: requests.filter(req => req.assignedTo === tech.id && req.actualHours)
        .reduce((sum, req) => sum + (req.actualHours || 0), 0)
    }));

  const clearFilters = () => {
    setFilters({ status: [], priority: [], category: [], assignedTo: [] });
    setSearchTerm("");
    setDateRange("all");
  };

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0 || 
                          filters.category.length > 0 || filters.assignedTo.length > 0 || 
                          searchTerm !== "" || dateRange !== "all";

  const quickActions = [
    { label: "Create Work Order", icon: Plus, action: () => alert("Create Work Order clicked"), variant: "primary" },
    { label: "Schedule PM", icon: CalendarDays, action: () => alert("Schedule PM clicked"), variant: "secondary" },
    { label: "Quick Assign", icon: Users, action: () => alert("Quick Assign clicked"), variant: "secondary" },
    { label: "Generate Report", icon: Download, action: () => alert("Generate Report clicked"), variant: "secondary" },
    { label: "Inventory Check", icon: Package, action: () => alert("Inventory check initiated"), variant: "secondary" },
    { label: "Safety Audit", icon: Shield, action: () => alert("Safety audit started"), variant: "secondary" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/5 to-orange-50/5 dark:from-slate-950 dark:via-blue-950/5 dark:to-orange-950/5">
      {/* Enterprise Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-200">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Enterprise Dashboard</span>
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25">
                  <ToolCase className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
                    Maintenance Pro
                  </span>
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider hidden sm:inline-block">
                    Enterprise Asset Management
                  </span>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-200">
                      <BarChart3 className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Analytics Dashboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Link href="/maintenance" className="text-sm font-semibold text-blue-600 transition-colors">
                Maintenance
              </Link>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/inventory" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-200">
                      <Package className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Inventory</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-200">
                      <FileText className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Reports</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>

            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">Sync</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sync with ERP System</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                New Work Order
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* Enterprise Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-8 gap-3 mb-8">
          <EnterpriseStatCard 
            title="Total WO" 
            value={stats.total} 
            icon={ClipboardList} 
            color="blue"
            trend="neutral"
            description="Work Orders"
          />
          <EnterpriseStatCard 
            title="Open" 
            value={stats.open} 
            icon={Target} 
            color="red"
            trend={stats.open > 0 ? "up" : "down"}
            description="Pending"
          />
          <EnterpriseStatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={Activity} 
            color="amber"
            trend="neutral"
            description="Active"
          />
          <EnterpriseStatCard 
            title="Completed" 
            value={stats.completed} 
            icon={CheckCircle} 
            color="green"
            trend="up"
            description="This Month"
          />
          <EnterpriseStatCard 
            title="Critical" 
            value={stats.critical} 
            icon={AlertTriangle} 
            color="purple"
            trend={stats.critical > 0 ? "up" : "down"}
            description="High Priority"
          />
          <EnterpriseStatCard 
            title="Overdue" 
            value={stats.overdue} 
            icon={Clock4} 
            color="orange"
            trend={stats.overdue > 0 ? "up" : "down"}
            description="Past Due"
          />
          <EnterpriseStatCard 
            title="Downtime" 
            value={`${stats.totalDowntime}h`} 
            icon={Clock} 
            color="slate"
            trend="neutral"
            description="Total Hours"
          />
          <EnterpriseStatCard 
            title="Cost" 
            value={`$${stats.totalCost.toLocaleString()}`} 
            icon={TrendingUp} 
            color="emerald"
            trend="up"
            description="Total Spend"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Enterprise Features */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions Grid */}
            <Card className="bg-white/50 border border-slate-200/60 shadow-xs dark:bg-slate-800/50 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <TooltipProvider key={action.label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={action.variant === "primary" ? "default" : "outline"}
                            className={`h-16 flex-col gap-1 ${
                              action.variant === "primary" 
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" 
                                : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                            }`}
                            onClick={action.action}
                          >
                            <action.icon className="h-4 w-4" />
                            <span className="text-xs font-medium">{action.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{action.label}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* KPI Dashboard */}
            <Card className="bg-white/50 border border-slate-200/60 shadow-xs dark:bg-slate-800/50 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <LineChart className="h-4 w-4 text-green-500" />
                  Performance KPIs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <KPIMetric 
                  label="Completion Rate" 
                  value={completionRate} 
                  target={85}
                  format="percent"
                />
                <KPIMetric 
                  label="Avg. Completion Time" 
                  value={stats.avgCompletionTime} 
                  target={8}
                  format="hours"
                />
                <KPIMetric 
                  label="On-Time Completion" 
                  value={78} 
                  target={90}
                  format="percent"
                />
                <KPIMetric 
                  label="First-Time Fix Rate" 
                  value={92} 
                  target={95}
                  format="percent"
                />
              </CardContent>
            </Card>

            {/* Technician Performance */}
            <Card className="bg-white/50 border border-slate-200/60 shadow-xs dark:bg-slate-800/50 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Users className="h-4 w-4 text-blue-500" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {technicianWorkload.map((tech) => (
                  <TechnicianPerformance 
                    key={tech.id} 
                    tech={tech} 
                    requests={requests}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Equipment Health */}
            <Card className="bg-white/50 border border-slate-200/60 shadow-xs dark:bg-slate-800/50 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Equipment Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_EQUIPMENT.slice(0, 4).map((item) => (
                  <EquipmentHealth key={item.id} equipment={item} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Enhanced Main Tabs */}
            <Card className="border border-slate-200/60 shadow-xs dark:border-slate-700">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList className="grid w-full sm:w-auto grid-cols-4 bg-slate-100/50 dark:bg-slate-800/50 p-1">
                      <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-700 text-sm">
                        <BarChart3 className="h-4 w-4" />
                        Dashboard
                      </TabsTrigger>
                      <TabsTrigger value="work-orders" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-700 text-sm">
                        <ClipboardList className="h-4 w-4" />
                        Work Orders
                      </TabsTrigger>
                      <TabsTrigger value="schedule" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-700 text-sm">
                        <CalendarDays className="h-4 w-4" />
                        Schedule
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-slate-700 text-sm">
                        <PieChart className="h-4 w-4" />
                        Analytics
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <FileText className="h-4 w-4" />
                      <span>Last sync: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {/* Enhanced Dashboard Tab */}
                  <TabsContent value="dashboard" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <PriorityDistribution requests={requests} />
                      <CategoryDistribution requests={requests} />
                    </div>
                    <RecentActivity requests={requests} />
                  </TabsContent>

                  {/* Enhanced Work Orders Tab */}
                  <TabsContent value="work-orders" className="space-y-6">
                    <EnterpriseWorkOrdersSection 
                      requests={filteredRequests}
                      allRequests={requests}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      onAssign={(request) => alert(`Assign ${request.title}`)}
                      onComplete={(request) => alert(`Complete ${request.title}`)}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      filters={filters}
                      onFiltersChange={setFilters}
                      showFilters={showFilters}
                      onShowFiltersChange={setShowFilters}
                      dateRange={dateRange}
                      onDateRangeChange={setDateRange}
                      onClearFilters={clearFilters}
                      hasActiveFilters={hasActiveFilters}
                      employees={MOCK_EMPLOYEES}
                    />
                  </TabsContent>

                  {/* Schedule Tab */}
                  <TabsContent value="schedule">
                    <Card className="border border-slate-200/60 shadow-xs dark:border-slate-700">
                      <CardHeader>
                        <CardTitle>Maintenance Schedule</CardTitle>
                        <CardDescription>Upcoming scheduled maintenance activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <CalendarDays className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Schedule View</h3>
                          <p className="text-slate-500 dark:text-slate-400">
                            Calendar and timeline views for scheduled maintenance will be available soon.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics">
                    <Card className="border border-slate-200/60 shadow-xs dark:border-slate-700">
                      <CardHeader>
                        <CardTitle>Maintenance Analytics</CardTitle>
                        <CardDescription>Advanced analytics and performance insights</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <PieChart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Analytics Dashboard</h3>
                          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            Advanced analytics with charts, trends, and performance insights will be available in the next update.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}