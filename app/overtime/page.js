// app/overtime/page.js
'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Plus,
  Search,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  User,
  FileText,
  Eye,
  Loader2,
  Clock,
  AlertCircle,
  Trash2,
  MoreVertical,
  Edit,
  X,
  ArrowUpRight,
  TrendingUp,
  Users,
  Briefcase,
  Download,
  Grid,
  Home,
  Activity,
  Phone,
  MessageSquare,
  Heart,
  Info,
  Target,
  Flag,
  Database,
  FilterX,
  Table as TableIcon,
  ArrowUpDown,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Award,
  Star,
  Shield,
  Lock,
  Unlock,
  Gift,
  Package,
  Truck,
  Warehouse,
  ShoppingBag,
  Coffee,
  Music,
  Film,
  Camera,
  Mic,
  Headphones,
  Gamepad,
  Tv,
  Wifi,
  Bluetooth,
  Battery,
  Cpu,
  HardDrive,
  Monitor,
  Printer,
  Scan,
  QrCode,
  Barcode,
  Ticket,
  CreditCard,
  Wallet,
  Banknote,
  Coins,
  Receipt,
  Invoice,
  Building,
  Factory,
  Store,
  Globe,
  MapPin,
  Compass,
  Medal,
  Crown,
  Shield as ShieldIcon,
  AlertTriangle,
  Check,
  DollarSign,
  Eye as EyeIcon,
  EyeOff,
  Mail,
  Share2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Sliders,
  Upload,
  Copy,
  Delete,
  ExternalLink,
  HelpCircle,
  Key,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  Link as LinkIcon,
  List,
  LogIn,
  LogOut,
  Map,
  Maximize,
  Menu,
  MessageCircle,
  Minimize,
  Minus,
  MoreHorizontal,
  Move,
  Navigation,
  Network,
  Newspaper,
  Notebook,
  NotepadText,
  Octagon,
  Option,
  Paintbrush,
  Palette,
  Paperclip,
  Pause,
  Pencil,
  Percent,
  PieChart,
  Play,
  Pocket,
  Power,
  Quote,
  Radio,
  Repeat,
  Reply,
  Rewind,
  Rocket,
  RotateCcw,
  RotateCw,
  Rss,
  Save,
  Scissors,
  Send,
  Server,
  Share,
  ShoppingCart,
  Shuffle,
  SkipBack,
  SkipForward,
  Smartphone,
  Smile,
  Snowflake,
  Speaker,
  Split,
  Square,
  SwitchCamera,
  Tablet,
  Tag,
  Terminal,
  Timer,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  Triangle,
  Trophy,
  Twitter,
  Type,
  Umbrella,
  Underline,
  Undo,
  Unlink,
  Upload as UploadIcon,
  User as UserIcon,
  UserCheck,
  UserCog,
  UserMinus,
  UserPlus,
  UserX,
  Users as UsersIcon,
  Video as VideoIcon,
  Voicemail,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Wand,
  Watch,
  Wind,
  Youtube,
  ZoomIn,
  ZoomOut,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import Link from "next/link";

// Import Header and Footer
import { PageShell } from '@/components/PageShell';

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Animation styles defined in globals.css



// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const OVERTIME_API = `${API_BASE}/api/overtime`;
const EMPLOYEES_API = `${API_BASE}/api/employees`;

// Overtime Types with enhanced styling
const OVERTIME_TYPES = {
  regular: {
    name: 'Regular Overtime',
    shortName: 'Regular',
    icon: Clock,
    variant: 'default',
    gradient: 'from-blue-500 to-blue-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    color: 'blue',
    description: 'Standard overtime after regular work hours'
  },
  weekend: {
    name: 'Weekend Overtime',
    shortName: 'Weekend',
    icon: Calendar,
    variant: 'secondary',
    gradient: 'from-purple-500 to-purple-600',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    color: 'purple',
    description: 'Overtime work on Saturdays or Sundays'
  },
  emergency: {
    name: 'Emergency Overtime',
    shortName: 'Emergency',
    icon: AlertCircle,
    variant: 'destructive',
    gradient: 'from-red-500 to-red-600',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    color: 'red',
    description: 'Urgent overtime for critical situations'
  },
  project: {
    name: 'Project Overtime',
    shortName: 'Project',
    icon: Briefcase,
    variant: 'outline',
    gradient: 'from-green-500 to-green-600',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    color: 'green',
    description: 'Overtime for specific project deadlines'
  },
  holiday: {
    name: 'Holiday Overtime',
    shortName: 'Holiday',
    icon: Sun,
    variant: 'outline',
    gradient: 'from-amber-500 to-amber-600',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    color: 'amber',
    description: 'Work on public holidays'
  },
  night: {
    name: 'Night Shift Overtime',
    shortName: 'Night',
    icon: Moon,
    variant: 'outline',
    gradient: 'from-indigo-500 to-indigo-600',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    color: 'indigo',
    description: 'Overtime during night hours'
  }
};

// Status configurations
const STATUS_CONFIG = {
  pending: { 
    label: 'Pending', 
    variant: 'secondary', 
    icon: Clock, 
    gradient: 'from-yellow-500 to-yellow-600',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    color: 'yellow'
  },
  approved: { 
    label: 'Approved', 
    variant: 'success', 
    icon: CheckCircle2, 
    gradient: 'from-green-500 to-green-600',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    color: 'green'
  },
  rejected: { 
    label: 'Rejected', 
    variant: 'destructive', 
    icon: XCircle, 
    gradient: 'from-red-500 to-red-600',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    color: 'red'
  },
  paid: { 
    label: 'Paid', 
    variant: 'default', 
    icon: TrendingUp, 
    gradient: 'from-emerald-500 to-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    color: 'emerald'
  },
  cancelled: { 
    label: 'Cancelled', 
    variant: 'outline', 
    icon: X, 
    gradient: 'from-gray-500 to-gray-600',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800',
    color: 'gray'
  }
};

// Month names for dropdown
const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

// Year options
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ].map(year => ({ value: year.toString(), label: year.toString() }));
};

// Get unique employees for quick filters
const getUniqueEmployees = (data) => {
  const employeeMap = {};
  data.forEach((item) => {
    if (item && item.employee_name && !employeeMap[item.employee_name]) {
      employeeMap[item.employee_name] = {
        name: item.employee_name,
        id: item.employee_id
      };
    }
  });
  return Object.values(employeeMap).sort((a, b) => a.name.localeCompare(b.name));
};

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  try {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeString;
  }
};

const calculateHours = (startTime, endTime, date) => {
  if (!startTime || !endTime || !date) return 0;
  try {
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (end < start) end.setDate(end.getDate() + 1);
    const diffMs = end.getTime() - start.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  } catch {
    return 0;
  }
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '??';
  const names = name.trim().split(' ');
  const first = names[0]?.[0] || '';
  const last = names.length > 1 ? names[names.length - 1]?.[0] || '' : '';
  return (first + last).toUpperCase();
};

const preparePayload = (data) => {
  const payload = { ...data };
  if (payload.contact_number === '') payload.contact_number = ' ';
  if (payload.emergency_contact === '') payload.emergency_contact = ' ';
  return payload;
};

// API Functions
const fetchOvertime = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.overtime_type && filters.overtime_type !== 'all') params.append('overtime_type', filters.overtime_type);
  if (filters.employee_id && filters.employee_id !== 'all') params.append('employee_id', filters.employee_id);
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  if (filters.month) params.append('month', filters.month);
  if (filters.year) params.append('year', filters.year);
  
  const url = params.toString() ? `${OVERTIME_API}?${params.toString()}` : OVERTIME_API;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch overtime');
  return res.json();
};

const createOvertime = async (data) => {
  const payload = preparePayload(data);
  const res = await fetch(OVERTIME_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create overtime: ${res.status} - ${errorText}`);
  }
  return res.json();
};

const updateOvertime = async (id, data) => {
  const payload = preparePayload(data);
  const res = await fetch(`${OVERTIME_API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update overtime: ${res.status} - ${errorText}`);
  }
  return res.json();
};

const updateOvertimeStatus = async (id, status) => {
  return updateOvertime(id, { status });
};

const deleteOvertime = async (id) => {
  const res = await fetch(`${OVERTIME_API}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete overtime');
  return res.json();
};

// Export to Excel (CSV)
const exportToExcel = (data, filename = `overtime-${new Date().toISOString().split('T')[0]}.csv`) => {
  if (!data || data.length === 0) {
    toast.warning('No data to export');
    return;
  }

  const headers = [
    'ID', 'Employee Name', 'Employee ID', 'Position', 'Overtime Type',
    'Date', 'Start Time', 'End Time', 'Hours', 'Reason',
    'Contact Number', 'Emergency Contact', 'Status', 'Applied Date',
    'Notes', 'Created At',
  ];

  const rows = data.map((item) => {
    const hours = calculateHours(item.start_time, item.end_time, item.date);
    return [
      item.id,
      item.employee_name,
      item.employee_id,
      item.position,
      item.overtime_type,
      item.date,
      item.start_time,
      item.end_time,
      hours.toFixed(2),
      item.reason,
      item.contact_number?.trim() ? item.contact_number : '',
      item.emergency_contact?.trim() ? item.emergency_contact : '',
      item.status,
      item.applied_date || '',
      item.notes || '',
      item.created_at || '',
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  toast.success(`Exported ${data.length} records`);
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.badge} border gap-1 px-2 py-1 whitespace-nowrap font-medium cursor-help`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Current status: {config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Type Badge Component
const TypeBadge = ({ type }) => {
  const config = OVERTIME_TYPES[type] || OVERTIME_TYPES.regular;
  const Icon = config.icon;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.badge} border gap-1 px-2 py-1 whitespace-nowrap font-medium cursor-help`}>
            <Icon className="h-3 w-3" />
            {config.shortName}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, onClick, tooltip, gradient = 'from-primary/10 to-primary/5' }) => {
  const CardWrapper = onClick ? (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden relative group ${onClick ? 'hover:border-primary' : ''} bg-white`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              {title}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/50" />
                    </TooltipTrigger>
                    <TooltipContent>{tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="overflow-hidden relative group bg-white">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              {title}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/50" />
                    </TooltipTrigger>
                    <TooltipContent>{tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return CardWrapper;
};

// Overtime Card Component (Grid View)
const OvertimeCard = ({ overtime, onView, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = OVERTIME_TYPES[overtime.overtime_type] || OVERTIME_TYPES.regular;
  const Icon = typeConfig.icon;
  const hours = calculateHours(overtime.start_time, overtime.end_time, overtime.date);

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Card className="group relative hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 bg-white" style={{ borderTopColor: `var(--${typeConfig.color}-500)` }}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {getInitials(overtime.employee_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate flex items-center gap-1">
                {overtime.employee_name}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Employee ID: {overtime.employee_id}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription className="text-xs truncate flex items-center gap-1">
                <Briefcase className="h-3 w-3 inline" />
                {overtime.position || 'No position'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={handleExpandClick}
                  >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{expanded ? 'Hide details' : 'Click to expand and view more details'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Actions menu</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(overtime); }}>
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(overtime); }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(overtime.id); }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-1 cursor-help">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date
                  </p>
                  <p className="font-medium">{formatDate(overtime.date)}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Date of overtime work</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-1 cursor-help">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Time
                  </p>
                  <p className="font-medium text-xs">
                    {formatTime(overtime.start_time)} – {formatTime(overtime.end_time)}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Start and end time of overtime</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-1 cursor-help">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Hours
                  </p>
                  <p className="font-bold">{hours} h</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Total overtime hours calculated</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Flag className="h-3 w-3" /> Type
            </p>
            <TypeBadge type={overtime.overtime_type} />
          </div>
          
          <div className="space-y-1 col-span-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" /> Status
            </p>
            <StatusBadge status={overtime.status} />
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Reason
                    </p>
                    <p className="text-sm bg-muted/30 p-3 rounded-lg break-words whitespace-pre-wrap">{overtime.reason || 'No reason provided'}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Reason for overtime request</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Contact
                      </p>
                      <p className="font-medium break-words">
                        {overtime.contact_number && overtime.contact_number.trim() ? overtime.contact_number : 'Not provided'}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Employee contact number</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {overtime.emergency_contact && overtime.emergency_contact.trim() && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Heart className="h-3 w-3" /> Emergency
                        </p>
                        <p className="font-medium break-words">{overtime.emergency_contact}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Emergency contact number</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t bg-muted/10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full gap-2 group-hover:bg-primary/10" onClick={() => onView(overtime)}>
                <Eye className="h-4 w-4 group-hover:animate-pulse" /> 
                <span className="group-hover:underline">Click to view full details</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Click here to see complete overtime information</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

// Overtime Application Form
const OvertimeApplicationForm = ({ onClose, onSuccess, editData, onUpdate }) => {
  const [formData, setFormData] = useState(
    editData || {
      employee_name: '',
      employee_id: '',
      position: '',
      overtime_type: 'regular',
      date: new Date().toISOString().split('T')[0],
      start_time: '18:00',
      end_time: '20:00',
      reason: '',
      contact_number: '',
      emergency_contact: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeSelectOpen, setEmployeeSelectOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await fetch(EMPLOYEES_API);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Employee API error:', errorText);
          toast.error(`Failed to load employees: ${response.status}`);
          return;
        }
        const data = await response.json();
        const employeeList = Array.isArray(data) ? data : [];
        const normalized = employeeList.map((emp) => {
          const id = emp.id || emp.employee_id || 0;
          let fullName = '';
          if (emp.first_name && emp.last_name) {
            fullName = `${emp.first_name} ${emp.last_name}`;
          } else {
            fullName = emp.name || emp.employee_name || emp.full_name || emp.Name || '';
          }
          const designation = emp.designation || emp.position || emp.job_title || '';
          const phone = emp.phone || emp.contact_number || emp.mobile || '';
          const supervisor = emp.supervisor || emp.manager_name || emp.manager || '';
          const department = emp.department || emp.dept || '';
          return {
            id: id,
            name: fullName,
            designation: designation,
            phone: phone,
            supervisor: supervisor,
            department: department,
          };
        });
        setEmployees(normalized);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Could not load employee list');
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleEmployeeSelect = (employee) => {
    const numericId = employee.id.toString();
    setFormData({
      ...formData,
      employee_id: numericId,
      employee_name: employee.name || `Employee ${employee.id}`,
      position: employee.designation || '',
      contact_number: employee.phone || '',
      emergency_contact: employee.supervisor || '',
    });
    setEmployeeSelectOpen(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_name?.trim()) errors.employee_name = 'Full name is required';
    if (!formData.position?.trim()) errors.position = 'Position is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.reason?.trim()) errors.reason = 'Reason is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (editData) {
        await onUpdate(editData.id, formData);
        toast.success('Overtime application updated');
      } else {
        await createOvertime(formData);
        toast.success('Overtime application submitted');
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const hours = calculateHours(formData.start_time, formData.end_time, formData.date);

  const filteredEmployees = useMemo(() => {
    if (!employeeSearch.trim()) return employees;
    const term = employeeSearch.toLowerCase();
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(term) ||
      emp.id.toString().includes(term) ||
      (emp.designation && emp.designation.toLowerCase().includes(term)) ||
      (emp.department && emp.department.toLowerCase().includes(term))
    );
  }, [employees, employeeSearch]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-white/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            {editData ? 'Edit' : 'New'} Overtime Request
          </DialogTitle>
          <DialogDescription>
            Fill in the details below. All fields marked * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Employee selection dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              Employee *
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>Select an employee from the list</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Popover open={employeeSelectOpen} onOpenChange={setEmployeeSelectOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-auto py-3 bg-white"
                  disabled={!!editData}
                >
                  {formData.employee_name ? (
                    <div className="flex items-center gap-3 truncate">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(formData.employee_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left truncate">
                        <div className="truncate font-medium">{formData.employee_name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {formData.position} • {formData.employee_id}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select employee...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white/95 backdrop-blur-sm" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search employees..." 
                    value={employeeSearch}
                    onValueChange={setEmployeeSearch}
                  />
                  <CommandEmpty>No employee found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {loadingEmployees ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <CommandItem
                          key={emp.id}
                          value={`${emp.name} ${emp.id}`}
                          onSelect={() => handleEmployeeSelect(emp)}
                          className="flex items-center gap-3 py-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(emp.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {emp.designation} • {emp.department}
                            </p>
                          </div>
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Auto-filled employee fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id" className="text-sm font-medium">Employee ID *</Label>
              <Input
                id="employee_id"
                required
                value={formData.employee_id}
                onChange={(e) => handleChange('employee_id', e.target.value)}
                placeholder="e.g., C1165"
                disabled={!!editData}
                className="h-10 bg-white"
              />
              {validationErrors.employee_id && (
                <p className="text-sm text-destructive">{validationErrors.employee_id}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium">Position</Label>
              <Input
                id="position"
                value={formData.position}
                readOnly
                disabled
                className="bg-muted/50 h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number" className="text-sm font-medium">Contact Number</Label>
              <Input
                id="contact_number"
                value={formData.contact_number}
                readOnly
                disabled
                className="bg-muted/50 h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact" className="text-sm font-medium">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                value={formData.emergency_contact}
                readOnly
                disabled
                className="bg-muted/50 h-10"
              />
            </div>
          </div>

          {/* Other fields (editable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                Overtime Type *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>Select the type of overtime work</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select
                value={formData.overtime_type}
                onValueChange={(val) => handleChange('overtime_type', val)}
              >
                <SelectTrigger className="h-10 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OVERTIME_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {React.createElement(type.icon, { className: "h-4 w-4" })}
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date *</Label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="h-10 bg-white"
              />
              {validationErrors.date && (
                <p className="text-sm text-destructive">{validationErrors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Time *</Label>
              <Input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                className="h-10 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Time *</Label>
              <Input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
                className="h-10 bg-white"
              />
            </div>
          </div>

          {hours > 0 && (
            <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4 text-center border">
              <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-primary">{hours} h</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Reason for Overtime *</Label>
            <Textarea
              required
              rows={4}
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="Please provide details about why overtime is required..."
              className="resize-none bg-white"
            />
            {validationErrors.reason && (
              <p className="text-sm text-destructive">{validationErrors.reason}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[100px]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editData ? 'Update' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Overtime Details Modal
const OvertimeDetailsModal = ({ overtime, onClose, onStatusUpdate, onDelete, onEdit }) => {
  const [updating, setUpdating] = useState(false);
  const typeConfig = OVERTIME_TYPES[overtime.overtime_type] || OVERTIME_TYPES.regular;
  const hours = calculateHours(overtime.start_time, overtime.end_time, overtime.date);
  
  const displayId = overtime.id ? (typeof overtime.id === 'string' ? overtime.id.slice(0, 8) : String(overtime.id).slice(0, 8)) : 'N/A';

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(overtime.id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this overtime request?')) return;
    setUpdating(true);
    try {
      await onDelete(overtime.id);
      toast.success('Request deleted');
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-white/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              {React.createElement(typeConfig.icon, { className: "h-5 w-5 text-primary" })}
            </div>
            Overtime Request #{displayId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Card */}
            <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-transparent bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Employee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(overtime.employee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{overtime.employee_name}</p>
                    <p className="text-xs text-muted-foreground">{overtime.position}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="text-xs text-muted-foreground">ID</p>
                          <p className="font-mono text-xs">{overtime.employee_id}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Employee identification number</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="text-xs text-muted-foreground">Contact</p>
                          <p className="text-xs">{overtime.contact_number || 'Not provided'}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Primary contact number</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-transparent bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type</span>
                  <TypeBadge type={overtime.overtime_type} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={overtime.status} />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium">{formatDate(overtime.date)}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Date of overtime work</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="text-xs text-muted-foreground">Hours</p>
                          <p className="font-medium">{hours} h</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Total hours worked</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="text-xs text-muted-foreground">Start</p>
                          <p className="font-medium">{formatTime(overtime.start_time)}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Start time of overtime</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="text-xs text-muted-foreground">End</p>
                          <p className="font-medium">{formatTime(overtime.end_time)}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>End time of overtime</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reason Card */}
          <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-transparent bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Reason
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg p-4 border">
                <p className="whitespace-pre-wrap text-sm">{overtime.reason}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => { onEdit(overtime); onClose(); }} className="gap-2">
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit this overtime request</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        Update Status <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Change the status of this request</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleStatusChange('approved')}>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
                  <XCircle className="h-4 w-4 mr-2 text-destructive" /> Reject
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" /> Mark Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('paid')}>
                  <TrendingUp className="h-4 w-4 mr-2 text-emerald-600" /> Mark Paid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('cancelled')}>
                  <X className="h-4 w-4 mr-2 text-gray-600" /> Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" onClick={handleDelete} disabled={updating} className="gap-2">
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete this overtime request (cannot be undone)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Employee Summary Component
const EmployeeSummary = ({ data, show, onToggle, onEmployeeSelect }) => {
  const summary = useMemo(() => {
    const employeeMap = {};
    
    data.forEach((item) => {
      const id = item.employee_id;
      if (!employeeMap[id]) {
        employeeMap[id] = {
          employee_name: item.employee_name,
          employee_id: id,
          count: 0,
          totalHours: 0,
        };
      }
      const entry = employeeMap[id];
      entry.count += 1;
      const hours = calculateHours(item.start_time, item.end_time, item.date);
      entry.totalHours += hours;
    });

    return Object.values(employeeMap).sort((a, b) => b.totalHours - a.totalHours);
  }, [data]);

  if (summary.length === 0) return null;

  const totalHours = summary.reduce((sum, emp) => sum + emp.totalHours, 0);

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Employee Summary
            <Badge variant="outline" className="ml-2 bg-background">
              {summary.length} employees
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="hide-summary" className="text-sm text-muted-foreground">Hide</Label>
            <Switch
              id="hide-summary"
              checked={!show}
              onCheckedChange={(checked) => onToggle(!checked)}
            />
          </div>
        </div>
        <CardDescription>
          Total hours per employee based on current filters
        </CardDescription>
      </CardHeader>
      {show && (
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 p-4">
              {summary.map((emp) => {
                const percentage = totalHours > 0 ? (emp.totalHours / totalHours) * 100 : 0;
                return (
                  <div
                    key={emp.employee_id}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all"
                    onClick={() => onEmployeeSelect(emp.employee_id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(emp.employee_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{emp.employee_name}</p>
                        <p className="text-xs text-muted-foreground">{emp.employee_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold">{Math.round(emp.totalHours * 100) / 100} h</p>
                        <p className="text-xs text-muted-foreground">{emp.count} requests</p>
                      </div>
                      <div className="w-16">
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
};

// Type Summary Component
const TypeSummary = ({ data, onTypeSelect }) => {
  const summary = useMemo(() => {
    const result = {};
    data.forEach((item) => {
      const type = item.overtime_type;
      if (!result[type]) {
        result[type] = {
          count: 0,
          hours: 0,
        };
      }
      const hours = calculateHours(item.start_time, item.end_time, item.date);
      result[type].count += 1;
      result[type].hours += hours;
    });
    return result;
  }, [data]);

  if (Object.keys(summary).length === 0) return null;

  const totalHours = Object.values(summary).reduce((sum, t) => sum + t.hours, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Object.entries(OVERTIME_TYPES).map(([key, config]) => {
        const stats = summary[key] || { count: 0, hours: 0 };
        const percentage = totalHours > 0 ? (stats.hours / totalHours) * 100 : 0;
        const Icon = config.icon;
        
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card 
                  className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 bg-white"
                  onClick={() => onTypeSelect(key)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold">{config.shortName}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Requests</span>
                        <span className="font-bold">{stats.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hours</span>
                        <span className="font-bold">{Math.round(stats.hours * 100) / 100}h</span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                      <p className="text-xs text-muted-foreground text-right">
                        {Math.round(percentage)}% of total
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to filter by {config.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

// Advanced Filter Component
const AdvancedFilters = ({
  searchTerm,
  onSearchChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  minHours,
  onMinHoursChange,
  maxHours,
  onMaxHoursChange,
  selectedTypes,
  onTypeToggle,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  activeFilterCount,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  selectedEmployee,
  onEmployeeChange,
  availableEmployees
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-muted-foreground">Quick Filters:</span>
        <Badge 
          variant={selectedMonth === '' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onMonthChange('')}
        >
          All Months
        </Badge>
        {MONTHS.map(month => (
          <Badge
            key={month.value}
            variant={selectedMonth === month.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onMonthChange(month.value)}
          >
            {month.label.slice(0, 3)}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-muted-foreground">Employee Quick Filters:</span>
        <Badge 
          variant={selectedEmployee === '' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onEmployeeChange('')}
        >
          All Employees
        </Badge>
        {availableEmployees.slice(0, 8).map(emp => (
          <Badge
            key={emp.name}
            variant={selectedEmployee === emp.name ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onEmployeeChange(emp.name)}
          >
            {emp.name.split(' ')[0]}
          </Badge>
        ))}
        {availableEmployees.length > 8 && (
          <Popover>
            <PopoverTrigger asChild>
              <Badge variant="outline" className="cursor-pointer">
                +{availableEmployees.length - 8} more
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {availableEmployees.slice(8).map(emp => (
                  <div
                    key={emp.name}
                    className="p-2 text-sm hover:bg-muted cursor-pointer rounded"
                    onClick={() => onEmployeeChange(emp.name)}
                  >
                    {emp.name}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, position, or reason..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            Date From
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Filter overtime from this date onwards</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="h-10 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            Date To
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Filter overtime up to this date</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="h-10 bg-white"
          />
        </div>

        {/* Hours Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            Min Hours
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Minimum overtime hours</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            type="number"
            step="0.5"
            value={minHours}
            onChange={(e) => onMinHoursChange(e.target.value)}
            placeholder="e.g., 2"
            className="h-10 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            Max Hours
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Maximum overtime hours</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            type="number"
            step="0.5"
            value={maxHours}
            onChange={(e) => onMaxHoursChange(e.target.value)}
            placeholder="e.g., 8"
            className="h-10 bg-white"
          />
        </div>
      </div>

      {/* Type Filters */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          Overtime Types
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>Select one or more overtime types to filter</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(OVERTIME_TYPES).map(([key, type]) => {
            const Icon = type.icon;
            const isSelected = selectedTypes.includes(key);
            return (
              <Badge
                key={key}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer gap-1 px-3 py-1.5 transition-all hover:scale-105 ${
                  isSelected ? type.badge : ''
                }`}
                onClick={() => onTypeToggle(key)}
              >
                <Icon className="h-3 w-3" />
                {type.shortName}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Status Filters */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          Status
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>Select one or more statuses to filter</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_CONFIG).map(([key, status]) => {
            const Icon = status.icon;
            const isSelected = selectedStatuses.includes(key);
            return (
              <Badge
                key={key}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer gap-1 px-3 py-1.5 transition-all hover:scale-105 ${
                  isSelected ? status.badge : ''
                }`}
                onClick={() => onStatusToggle(key)}
              >
                <Icon className="h-3 w-3" />
                {status.label}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 gap-1">
            <FilterX className="h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </Button>
      
      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={idx} className="px-3 py-2 text-sm text-muted-foreground">...</span>
          ) : (
            <Button
              key={idx}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className="min-w-[2.5rem]"
            >
              {page}
            </Button>
          )
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1"
      >
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// ============= Main Page =============
export default function OvertimeManagementPage() {
  const [overtime, setOvertime] = useState([]);
  const [selectedOvertime, setSelectedOvertime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  // Basic Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  
  // Advanced Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [minHours, setMinHours] = useState('');
  const [maxHours, setMaxHours] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showTypeSummary, setShowTypeSummary] = useState(false);
  
  // Sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Expanded rows in table view
  const [expandedRows, setExpandedRows] = useState(new Set());


  const fetchAllData = async () => {
    setLoading(true);
    try {
      const apiFilters = {
        status: statusFilter === 'all' ? null : statusFilter,
        overtime_type: typeFilter === 'all' ? null : typeFilter,
        employee_id: employeeFilter === 'all' ? null : employeeFilter,
        date_from: dateFrom || null,
        date_to: dateTo || null,
        month: monthFilter || null,
        year: yearFilter || null,
      };
      const data = await fetchOvertime(apiFilters);
      setOvertime(data);
      toast.success(`Loaded ${data.length} overtime requests`);
    } catch (error) {
      toast.error('Failed to load overtime data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [statusFilter, typeFilter, employeeFilter, dateFrom, dateTo, monthFilter, yearFilter]);

  const handleCreate = async (data) => {
    const newItem = await createOvertime(data);
    setOvertime((prev) => [newItem, ...prev]);
  };

  const handleUpdate = async (id, data) => {
    const updated = await updateOvertime(id, data);
    setOvertime((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleStatusUpdate = async (id, status) => {
    await updateOvertimeStatus(id, status);
    setOvertime((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleDelete = async (id) => {
    await deleteOvertime(id);
    setOvertime((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleRowExpanded = (id, e) => {
    e.stopPropagation();
    setExpandedRows(prev => {
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
    setStatusFilter('all');
    setTypeFilter('all');
    setEmployeeFilter('all');
    setDateFrom('');
    setDateTo('');
    setMonthFilter('');
    setYearFilter('');
    setMinHours('');
    setMaxHours('');
    setSearchTerm('');
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedEmployeeName('');
    setCurrentPage(1);
    toast.success('All filters cleared');
  };

  const handleTypeSelect = (type) => {
    setTypeFilter(type);
    setSelectedTypes([type]);
    setShowAdvancedFilters(true);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => {
      const newTypes = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      if (newTypes.length === 1) {
        setTypeFilter(newTypes[0]);
      } else if (newTypes.length === 0) {
        setTypeFilter('all');
      } else {
        setTypeFilter('all');
      }
      
      return newTypes;
    });
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses(prev => {
      const newStatuses = prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status];
      
      if (newStatuses.length === 1) {
        setStatusFilter(newStatuses[0]);
      } else if (newStatuses.length === 0) {
        setStatusFilter('all');
      } else {
        setStatusFilter('all');
      }
      
      return newStatuses;
    });
  };

  const handleMonthChange = (month) => {
    setMonthFilter(month);
    setCurrentPage(1);
  };

  const handleYearChange = (year) => {
    setYearFilter(year);
    setCurrentPage(1);
  };

  const handleEmployeeQuickFilter = (employeeName) => {
    setSelectedEmployeeName(employeeName);
    setCurrentPage(1);
  };

  // Apply all filters to the data
  const processedOvertime = useMemo(() => {
    let filtered = overtime;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ot) =>
          ot.employee_name?.toLowerCase().includes(term) ||
          ot.employee_id?.toLowerCase().includes(term) ||
          ot.position?.toLowerCase().includes(term) ||
          ot.reason?.toLowerCase().includes(term)
      );
    }

    // Apply employee name filter (quick filter)
    if (selectedEmployeeName) {
      filtered = filtered.filter(ot => ot.employee_name === selectedEmployeeName);
    }

    // Apply date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((ot) => {
        const otDate = new Date(ot.date);
        otDate.setHours(0, 0, 0, 0);
        return otDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((ot) => {
        const otDate = new Date(ot.date);
        otDate.setHours(0, 0, 0, 0);
        return otDate <= toDate;
      });
    }

    // Apply month filter
    if (monthFilter) {
      filtered = filtered.filter((ot) => {
        const otDate = new Date(ot.date);
        const otMonth = (otDate.getMonth() + 1).toString().padStart(2, '0');
        return otMonth === monthFilter;
      });
    }

    // Apply year filter
    if (yearFilter) {
      filtered = filtered.filter((ot) => {
        const otDate = new Date(ot.date);
        return otDate.getFullYear().toString() === yearFilter;
      });
    }

    // Apply hours range filter
    if (minHours || maxHours) {
      filtered = filtered.filter((ot) => {
        const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
        if (minHours && hours < parseFloat(minHours)) return false;
        if (maxHours && hours > parseFloat(maxHours)) return false;
        return true;
      });
    }

    // Apply multiple type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(ot => selectedTypes.includes(ot.overtime_type));
    }

    // Apply multiple status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(ot => selectedStatuses.includes(ot.status));
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let compare = 0;
      if (sortBy === 'date') {
        compare = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'name') {
        compare = (a.employee_name || '').localeCompare(b.employee_name || '');
      } else if (sortBy === 'hours') {
        const hoursA = calculateHours(a.start_time, a.end_time, a.date);
        const hoursB = calculateHours(b.start_time, b.end_time, b.date);
        compare = hoursA - hoursB;
      } else if (sortBy === 'type') {
        compare = (a.overtime_type || '').localeCompare(b.overtime_type || '');
      } else if (sortBy === 'status') {
        compare = (a.status || '').localeCompare(b.status || '');
      }
      return sortOrder === 'asc' ? compare : -compare;
    });

    return sorted;
  }, [overtime, searchTerm, dateFrom, dateTo, sortBy, sortOrder, minHours, maxHours, selectedTypes, selectedStatuses, monthFilter, yearFilter, selectedEmployeeName]);

  // Get unique employees for quick filters
  const availableEmployees = useMemo(() => {
    return getUniqueEmployees(overtime);
  }, [overtime]);

  // Paginate the data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedOvertime.slice(startIndex, endIndex);
  }, [processedOvertime, currentPage]);

  const totalPages = Math.ceil(processedOvertime.length / itemsPerPage);

  const stats = useMemo(() => {
    const total = processedOvertime.length;
    const pending = processedOvertime.filter((ot) => ot.status === 'pending').length;
    const approved = processedOvertime.filter((ot) => ot.status === 'approved').length;
    const rejected = processedOvertime.filter((ot) => ot.status === 'rejected').length;
    
    let totalHours = 0;
    
    processedOvertime.forEach((ot) => {
      const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
      totalHours += hours;
    });
    
    return { 
      total, 
      pending, 
      approved, 
      rejected,
      totalHours: Math.round(totalHours * 100) / 100,
      averageHours: total > 0 ? Math.round((totalHours / total) * 100) / 100 : 0,
    };
  }, [processedOvertime]);

  const handleEmployeeSelect = (employeeId) => {
    setEmployeeFilter(employeeId);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    if (monthFilter) count++;
    if (yearFilter) count++;
    if (minHours) count++;
    if (maxHours) count++;
    if (selectedTypes.length > 0) count++;
    if (selectedStatuses.length > 0) count++;
    if (statusFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (employeeFilter !== 'all') count++;
    if (selectedEmployeeName) count++;
    return count;
  }, [searchTerm, dateFrom, dateTo, monthFilter, yearFilter, minHours, maxHours, selectedTypes, selectedStatuses, statusFilter, typeFilter, employeeFilter, selectedEmployeeName]);

  return (
    <PageShell>

      {/* ── Glassmorphism Hero ── */}
      <section className="relative text-white">
        <div className="container mx-auto px-4 pt-6 pb-3">
          <div className="oz-glass-dark rounded-2xl px-6 py-5">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <nav className="flex items-center gap-1.5 text-xs text-white/45 mb-1.5">
                  <span>Home</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-white/75 font-medium">Overtime</span>
                </nav>
                <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">Overtime Management</h1>
                <p className="text-white/55 mt-1 text-sm max-w-lg">Track, review, and manage all overtime requests. Use the filters to analyse specific periods or employees.</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-[#86BBD8]/25 hover:bg-[#86BBD8]/40 text-white font-medium border border-[#86BBD8]/30 transition-all duration-150 self-start shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> New OT Request
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#86BBD8]" />
                <span className="text-base font-bold text-white">{stats.total}</span>
                <span className="text-xs text-white/45">Requests</span>
              </div>
              <span className="text-white/20 hidden sm:block">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-base font-bold text-white">{stats.totalHours}h</span>
                <span className="text-xs text-white/45">Total hrs</span>
              </div>
              <span className="text-white/20 hidden sm:block">·</span>
              <button onClick={() => { setStatusFilter('pending'); handleStatusToggle('pending'); }} className="flex items-center gap-1.5 group">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-base font-bold text-amber-300">{stats.pending}</span>
                <span className="text-xs text-white/45 group-hover:text-white/65 transition-colors">Pending</span>
              </button>
              <span className="text-white/20 hidden sm:block">·</span>
              <button onClick={() => { setStatusFilter('approved'); handleStatusToggle('approved'); }} className="flex items-center gap-1.5 group">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-base font-bold text-emerald-300">{stats.approved}</span>
                <span className="text-xs text-white/45 group-hover:text-white/65 transition-colors">Approved</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-8 space-y-3 mt-3">
            {/* Type Summary - Clickable */}
            {showTypeSummary && processedOvertime.length > 0 && (
              <div className="animate-slide-up delay-300">
                <TypeSummary data={processedOvertime} onTypeSelect={handleTypeSelect} />
              </div>
            )}

            {/* Filter Section — glass panel with existing Collapsible */}
            <div className="oz-glass-dark rounded-2xl overflow-hidden">
              <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[#86BBD8]" />
                    <span className="text-sm font-semibold text-white">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#86BBD8]/25 text-[#86BBD8] border border-[#86BBD8]/30">{activeFilterCount} active</span>
                    )}
                    <span className="text-xs text-white/35">{processedOvertime.length} of {overtime.length} records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={clearFilters} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] text-white/60 border border-white/12 transition-all">
                      <FilterX className="h-3 w-3" /> Clear
                    </button>
                    <CollapsibleTrigger asChild>
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white/60 border border-white/15 transition-all">
                        {showAdvancedFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="px-5 pb-5 border-t border-white/10 pt-4">
                    <AdvancedFilters
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      dateFrom={dateFrom}
                      onDateFromChange={setDateFrom}
                      dateTo={dateTo}
                      onDateToChange={setDateTo}
                      minHours={minHours}
                      onMinHoursChange={setMinHours}
                      maxHours={maxHours}
                      onMaxHoursChange={setMaxHours}
                      selectedTypes={selectedTypes}
                      onTypeToggle={handleTypeToggle}
                      selectedStatuses={selectedStatuses}
                      onStatusToggle={handleStatusToggle}
                      onClearFilters={clearFilters}
                      activeFilterCount={activeFilterCount}
                      selectedMonth={monthFilter}
                      onMonthChange={handleMonthChange}
                      selectedYear={yearFilter}
                      onYearChange={handleYearChange}
                      selectedEmployee={selectedEmployeeName}
                      onEmployeeChange={handleEmployeeQuickFilter}
                      availableEmployees={availableEmployees}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* View Toggle and Sort Controls */}
            <div className="oz-glass-dark rounded-2xl px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex rounded-lg bg-white/[0.08] border border-white/15 p-0.5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setViewMode('table')}
                          className={`px-3 py-1.5 rounded-md transition-all duration-150 ${viewMode === 'table' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/75'}`}
                        >
                          <TableIcon className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Table view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`px-3 py-1.5 rounded-md transition-all duration-150 ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/75'}`}
                        >
                          <Grid className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Card view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                  <input
                    placeholder="Search employee or type…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white/[0.08] border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus:border-white/30 focus:bg-white/[0.12] transition-all w-48"
                  />
                </div>
                <span className="text-xs text-white/40">
                  {paginatedData.length} of {processedOvertime.length} requests
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                  const [by, order] = val.split('-');
                  setSortBy(by);
                  setSortOrder(order);
                }}>
                  <SelectTrigger className="w-[180px] h-8 text-xs bg-white/[0.08] border-white/15 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest first)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="hours-desc">Hours (High to low)</SelectItem>
                    <SelectItem value="hours-asc">Hours (Low to high)</SelectItem>
                    <SelectItem value="type-asc">Type (A-Z)</SelectItem>
                    <SelectItem value="type-desc">Type (Z-A)</SelectItem>
                    <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                    <SelectItem value="status-desc">Status (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Employee Summary (Collapsible) */}
            {processedOvertime.length > 0 && showSummary && (
              <div className="animate-slide-up delay-500">
                <EmployeeSummary
                  data={processedOvertime}
                  show={showSummary}
                  onToggle={setShowSummary}
                  onEmployeeSelect={handleEmployeeSelect}
                />
              </div>
            )}

            {/* Records */}
            {loading ? (
              <div className="oz-glass-dark rounded-2xl p-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white/40" />
              </div>
            ) : paginatedData.length === 0 ? (
              <div className="oz-glass-dark rounded-2xl py-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-white/25 mb-4" />
                <h3 className="text-base font-medium text-white/70 mb-2">No overtime requests found</h3>
                <p className="text-sm text-white/40 mb-6">
                  {overtime.length === 0 ? 'Get started by creating your first request.' : 'No records match your current filters.'}
                </p>
                {overtime.length === 0 ? (
                  <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 mx-auto text-xs px-4 py-2 rounded-lg bg-[#86BBD8]/25 hover:bg-[#86BBD8]/40 text-white border border-[#86BBD8]/30 transition-all">
                    <Plus className="h-3.5 w-3.5" /> New Request
                  </button>
                ) : (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 mx-auto text-xs px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white/70 border border-white/15 transition-all">
                    <FilterX className="h-3.5 w-3.5" /> Clear Filters
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedData.map((ot) => (
                    <OvertimeCard
                      key={ot.id}
                      overtime={ot}
                      onView={setSelectedOvertime}
                      onEdit={(ot) => { setEditData(ot); setShowForm(true); }}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <>
                <div className="oz-glass-dark rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <ShadcnTable>
                      <TableHeader className="bg-white/5">
                        <TableRow className="border-white/10">
                          <TableHead className="w-10 text-white/50"></TableHead>
                          <TableHead className="text-white/50">Employee</TableHead>
                          <TableHead className="text-white/50">Type</TableHead>
                          <TableHead className="text-white/50">Date</TableHead>
                          <TableHead className="text-white/50">Time</TableHead>
                          <TableHead className="text-right text-white/50">Hours</TableHead>
                          <TableHead className="text-white/50">Status</TableHead>
                          <TableHead className="text-right text-white/50">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((ot) => {
                          const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
                          const isExpanded = expandedRows.has(ot.id);
                          return (
                            <React.Fragment key={ot.id}>
                              <TableRow
                                className="cursor-pointer hover:bg-white/5 transition-colors border-white/10"
                                onClick={() => setSelectedOvertime(ot)}
                              >
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 w-7 p-0"
                                          onClick={(e) => toggleRowExpanded(ot.id, e)}
                                        >
                                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {isExpanded ? 'Hide details' : 'Click to expand and view reason'}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-[#2A4D69]/60 text-white text-xs">
                                        {getInitials(ot.employee_name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-white">{ot.employee_name}</div>
                                      <div className="text-xs text-white/45">{ot.employee_id}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TypeBadge type={ot.overtime_type} />
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-white/75">{formatDate(ot.date)}</TableCell>
                                <TableCell className="whitespace-nowrap text-xs text-white/75">
                                  {formatTime(ot.start_time)} – {formatTime(ot.end_time)}
                                </TableCell>
                                <TableCell className="text-right font-bold text-white">{hours} h</TableCell>
                                <TableCell>
                                  <StatusBadge status={ot.status} />
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => setSelectedOvertime(ot)}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>View details</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => { setEditData(ot); setShowForm(true); }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                              </TableRow>
                              {isExpanded && (
                                <TableRow className="bg-white/[0.04] border-white/10">
                                  <TableCell colSpan={8} className="p-4">
                                    <div className="space-y-3 max-w-3xl">
                                      <div>
                                        <p className="text-xs font-medium text-white/45 mb-1 flex items-center gap-1">
                                          <MessageSquare className="h-3 w-3" /> Reason
                                        </p>
                                        <p className="text-sm bg-white/[0.06] text-white/75 p-3 rounded-lg border border-white/10">
                                          {ot.reason || 'No reason provided'}
                                        </p>
                                      </div>
                                      <div className="flex gap-4 text-xs text-white/40">
                                        <span>Contact: {ot.contact_number || 'Not provided'}</span>
                                        {ot.emergency_contact && (
                                          <span>Emergency: {ot.emergency_contact}</span>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </ShadcnTable>
                  </div>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
      </main>

      {/* Modals */}
      {showForm && (
        <OvertimeApplicationForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSuccess={() => {
            fetchAllData();
            setShowForm(false);
            setEditData(null);
          }}
          editData={editData}
          onUpdate={handleUpdate}
        />
      )}

      {selectedOvertime && (
        <OvertimeDetailsModal
          overtime={selectedOvertime}
          onClose={() => setSelectedOvertime(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          onEdit={(ot) => { setEditData(ot); setShowForm(true); }}
        />
      )}
    </PageShell>
  );
}