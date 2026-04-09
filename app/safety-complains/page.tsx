//Safety complains page
//frontend/app/safety-complains/page.tsx

// app/safety-complaints/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertTriangle,
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
  AlertTriangle as AlertTriangleIcon,
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
  //Camera,
  //Mic,
  //Headphones,
} from "lucide-react";
import Link from "next/link";

// Import Header and Footer
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

// ============= STUNNING NATURE WALLPAPER COLLECTION =============
const natureWallpapers = [
  {
    url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Iceland Ice Cave",
    location: "Iceland - Crystal Ice Cave"
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Enchanted Forest",
    location: "Pacific Northwest"
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Misty Morning",
    location: "Great Smoky Mountains"
  },
  {
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Sunbeams Through Forest",
    location: "Olympic National Park"
  },
  {
    url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Alpine Lake",
    location: "Canadian Rockies"
  },
  {
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Waterfall Valley",
    location: "Yosemite National Park"
  },
  {
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Desert Dunes",
    location: "Namibia"
  },
  {
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Mountain Lake Reflection",
    location: "Lake Moraine, Canada"
  },
  {
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Majestic Waterfall",
    location: "Iguazu Falls"
  },
  {
    url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Desert Rock Formation",
    location: "Monument Valley"
  },
  {
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Rolling Hills",
    location: "Tuscany, Italy"
  },
  {
    url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Mountain Wildflowers",
    location: "Colorado Rockies"
  }
];

// ============= ANIMATION STYLES =============
const animationStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce-light {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-up {
    animation: slide-up 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-bounce-light {
    animation: bounce-light 2s ease-in-out infinite;
  }

  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
`;

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const COMPLAINTS_API = `${API_BASE}/api/safety-complaints`;
const EMPLOYEES_API = `${API_BASE}/api/employees`;

// Complaint Types
const COMPLAINT_TYPES = {
  hazard: {
    name: 'Hazard',
    shortName: 'Hazard',
    icon: AlertTriangle,
    gradient: 'from-orange-500 to-orange-600',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
    color: 'orange',
    description: 'Unsafe condition or potential hazard'
  },
  unsafe_act: {
    name: 'Unsafe Act',
    shortName: 'Unsafe Act',
    icon: AlertCircle,
    gradient: 'from-red-500 to-red-600',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    color: 'red',
    description: 'Unsafe behavior or action'
  },
  near_miss: {
    name: 'Near Miss',
    shortName: 'Near Miss',
    icon: Zap,
    gradient: 'from-yellow-500 to-yellow-600',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
    color: 'yellow',
    description: 'Incident that could have caused harm'
  },
  equipment: {
    name: 'Equipment Issue',
    shortName: 'Equipment',
    icon: Settings,
    gradient: 'from-blue-500 to-blue-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
    color: 'blue',
    description: 'Faulty or unsafe equipment'
  },
  environmental: {
    name: 'Environmental',
    shortName: 'Environmental',
    icon: Sun,
    gradient: 'from-green-500 to-green-600',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
    color: 'green',
    description: 'Environmental safety concern'
  },
  other: {
    name: 'Other',
    shortName: 'Other',
    icon: HelpCircle,
    gradient: 'from-gray-500 to-gray-600',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200',
    color: 'gray',
    description: 'Other safety concerns'
  }
};

// Severity Levels
const SEVERITY_LEVELS = {
  low: {
    name: 'Low',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Minor concern, low risk'
  },
  medium: {
    name: 'Medium',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Moderate risk, requires attention'
  },
  high: {
    name: 'High',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    description: 'High risk, immediate action needed'
  },
  critical: {
    name: 'Critical',
    icon: AlertTriangleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    badge: 'bg-red-100 text-red-800 border-red-200',
    description: 'Critical risk, stop work immediately'
  }
};

// Status configurations
const STATUS_CONFIG = {
  pending: { 
    label: 'Pending', 
    icon: Clock, 
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    color: 'yellow'
  },
  investigating: { 
    label: 'Investigating', 
    icon: Search, 
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    color: 'blue'
  },
  resolved: { 
    label: 'Resolved', 
    icon: CheckCircle2, 
    badge: 'bg-green-100 text-green-800 border-green-200',
    color: 'green'
  },
  closed: { 
    label: 'Closed', 
    icon: Check, 
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
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
    if (item && item.reported_by_name && !employeeMap[item.reported_by_name]) {
      employeeMap[item.reported_by_name] = {
        name: item.reported_by_name,
        id: item.reported_by_id
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

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '??';
  const names = name.trim().split(' ');
  const first = names[0]?.[0] || '';
  const last = names.length > 1 ? names[names.length - 1]?.[0] || '' : '';
  return (first + last).toUpperCase();
};

// API Functions
const fetchComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.complaint_type && filters.complaint_type !== 'all') params.append('complaint_type', filters.complaint_type);
  if (filters.severity && filters.severity !== 'all') params.append('severity', filters.severity);
  if (filters.reported_by_id && filters.reported_by_id !== 'all') params.append('reported_by_id', filters.reported_by_id);
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  if (filters.month) params.append('month', filters.month);
  if (filters.year) params.append('year', filters.year);
  
  const url = params.toString() ? `${COMPLAINTS_API}?${params.toString()}` : COMPLAINTS_API;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch complaints');
  return res.json();
};

const createComplaint = async (data) => {
  const res = await fetch(COMPLAINTS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create complaint: ${res.status} - ${errorText}`);
  }
  return res.json();
};

const updateComplaint = async (id, data) => {
  const res = await fetch(`${COMPLAINTS_API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update complaint: ${res.status} - ${errorText}`);
  }
  return res.json();
};

const updateComplaintStatus = async (id, status) => {
  return updateComplaint(id, { status });
};

const deleteComplaint = async (id) => {
  const res = await fetch(`${COMPLAINTS_API}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete complaint');
  return res.json();
};

// Export to Excel (CSV)
const exportToExcel = (data, filename = `safety-complaints-${new Date().toISOString().split('T')[0]}.csv`) => {
  if (!data || data.length === 0) {
    toast.warning('No data to export');
    return;
  }

  const headers = [
    'ID', 'Complaint Type', 'Severity', 'Title', 'Description',
    'Location', 'Reported By', 'Reported Date', 'Status',
    'Assigned To', 'Action Taken', 'Resolution Date'
  ];

  const rows = data.map((item) => [
    item.id,
    COMPLAINT_TYPES[item.complaint_type]?.name || item.complaint_type,
    SEVERITY_LEVELS[item.severity]?.name || item.severity,
    item.title,
    item.description,
    item.location,
    item.reported_by_name,
    formatDate(item.reported_date),
    STATUS_CONFIG[item.status]?.label || item.status,
    item.assigned_to || '',
    item.action_taken || '',
    item.resolution_date ? formatDate(item.resolution_date) : '',
  ]);

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
    <Badge className={`${config.badge} border gap-1 px-2 py-1 whitespace-nowrap font-medium`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Type Badge Component
const TypeBadge = ({ type }) => {
  const config = COMPLAINT_TYPES[type] || COMPLAINT_TYPES.other;
  const Icon = config.icon;
  return (
    <Badge className={`${config.badge} border gap-1 px-2 py-1 whitespace-nowrap font-medium`}>
      <Icon className="h-3 w-3" />
      {config.shortName}
    </Badge>
  );
};

// Severity Badge Component
const SeverityBadge = ({ severity }) => {
  const config = SEVERITY_LEVELS[severity] || SEVERITY_LEVELS.low;
  const Icon = config.icon;
  return (
    <Badge className={`${config.badge} border gap-1 px-2 py-1 whitespace-nowrap font-medium`}>
      <Icon className="h-3 w-3" />
      {config.name}
    </Badge>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, onClick, tooltip, gradient = 'from-primary/10 to-primary/5', color = 'primary' }) => {
  const colorMap = {
    primary: 'from-primary/20 to-primary/5',
    red: 'from-red-500/20 to-red-500/5',
    yellow: 'from-yellow-500/20 to-yellow-500/5',
    green: 'from-green-500/20 to-green-500/5',
    blue: 'from-blue-500/20 to-blue-500/5',
  };
  
  const bgGradient = colorMap[color] || colorMap.primary;

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden relative group ${onClick ? 'hover:border-primary' : ''} bg-white/90 backdrop-blur-sm`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
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
          <div className={`rounded-full bg-${color}-500/10 p-3 text-${color}-500 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Complaint Card Component (Grid View)
const ComplaintCard = ({ complaint, onView, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = COMPLAINT_TYPES[complaint.complaint_type] || COMPLAINT_TYPES.other;
  const severityConfig = SEVERITY_LEVELS[complaint.severity] || SEVERITY_LEVELS.low;
  const Icon = typeConfig.icon;

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Card className="group relative hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 bg-white/90 backdrop-blur-sm" style={{ borderLeftColor: `var(--${typeConfig.color}-500)` }}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {getInitials(complaint.reported_by_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate flex items-center gap-1">
                {complaint.title}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reported by: {complaint.reported_by_name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription className="text-xs truncate flex items-center gap-1">
                <MapPin className="h-3 w-3 inline" />
                {complaint.location || 'No location specified'}
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
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(complaint); }}>
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(complaint); }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(complaint.id); }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          <TypeBadge type={complaint.complaint_type} />
          <SeverityBadge severity={complaint.severity} />
          <StatusBadge status={complaint.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-1 cursor-help">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Reported
                  </p>
                  <p className="font-medium text-xs">{formatDate(complaint.reported_date)}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Date when complaint was reported</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-1 cursor-help">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> Reported By
                  </p>
                  <p className="font-medium text-xs truncate">{complaint.reported_by_name}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Person who reported the complaint</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Description
                    </p>
                    <p className="text-sm bg-muted/30 p-3 rounded-lg break-words whitespace-pre-wrap">
                      {complaint.description || 'No description provided'}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Detailed description of the complaint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {complaint.action_taken && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Action Taken
                      </p>
                      <p className="text-sm bg-muted/30 p-3 rounded-lg break-words whitespace-pre-wrap">
                        {complaint.action_taken}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Actions taken to address the complaint</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t bg-muted/10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full gap-2 group-hover:bg-primary/10" onClick={() => onView(complaint)}>
                <Eye className="h-4 w-4 group-hover:animate-pulse" /> 
                <span className="group-hover:underline">Click to view full details</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Click here to see complete complaint information</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

// Complaint Form Component
const ComplaintForm = ({ onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState(
    editData || {
      title: '',
      complaint_type: 'hazard',
      severity: 'medium',
      description: '',
      location: '',
      reported_by_name: '',
      reported_by_id: '',
      reported_by_department: '',
      reported_by_position: '',
      assigned_to: '',
      action_taken: '',
      status: 'pending',
      reported_date: new Date().toISOString().split('T')[0],
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
          const department = emp.department || emp.dept || '';
          return {
            id: id,
            name: fullName,
            designation: designation,
            phone: phone,
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
      reported_by_id: numericId,
      reported_by_name: employee.name || `Employee ${employee.id}`,
      reported_by_position: employee.designation || '',
      reported_by_department: employee.department || '',
    });
    setEmployeeSelectOpen(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.reported_by_name?.trim()) errors.reported_by_name = 'Reporter name is required';
    if (!formData.location?.trim()) errors.location = 'Location is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    try {
      let result;
      if (editData) {
        result = await updateComplaint(editData.id, formData);
        toast.success('Complaint updated successfully');
      } else {
        result = await createComplaint(formData);
        toast.success('Complaint reported successfully');
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-white/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            {editData ? 'Edit Safety Complaint' : 'Report Safety Complaint'}
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Complaint Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Brief summary of the safety concern"
              className="bg-white/80 backdrop-blur-sm"
            />
            {validationErrors.title && (
              <p className="text-sm text-destructive">{validationErrors.title}</p>
            )}
          </div>

          {/* Complaint Type and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Complaint Type *</Label>
              <Select
                value={formData.complaint_type}
                onValueChange={(val) => handleChange('complaint_type', val)}
              >
                <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COMPLAINT_TYPES).map(([key, type]) => (
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
              <Label>Severity Level *</Label>
              <Select
                value={formData.severity}
                onValueChange={(val) => handleChange('severity', val)}
              >
                <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SEVERITY_LEVELS).map(([key, level]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {React.createElement(level.icon, { className: "h-4 w-4" })}
                        {level.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Where did this occur? (e.g., Production Line A, Warehouse, Workshop)"
              className="bg-white/80 backdrop-blur-sm"
            />
            {validationErrors.location && (
              <p className="text-sm text-destructive">{validationErrors.location}</p>
            )}
          </div>

          {/* Reporter Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              Reporter *
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>Select the person reporting this complaint</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Popover open={employeeSelectOpen} onOpenChange={setEmployeeSelectOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-auto py-3 bg-white/80 backdrop-blur-sm"
                >
                  {formData.reported_by_name ? (
                    <div className="flex items-center gap-3 truncate">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(formData.reported_by_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left truncate">
                        <div className="truncate font-medium">{formData.reported_by_name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {formData.reported_by_position} • {formData.reported_by_department}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select reporter...</span>
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Provide detailed information about the safety concern..."
              className="resize-none bg-white/80 backdrop-blur-sm"
            />
            {validationErrors.description && (
              <p className="text-sm text-destructive">{validationErrors.description}</p>
            )}
          </div>

          {/* Assigned To (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="assigned_to">Assigned To (Optional)</Label>
            <Input
              id="assigned_to"
              value={formData.assigned_to || ''}
              onChange={(e) => handleChange('assigned_to', e.target.value)}
              placeholder="Person responsible for investigating/resolving"
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Action Taken (Only for edit) */}
          {editData && (
            <div className="space-y-2">
              <Label htmlFor="action_taken">Action Taken</Label>
              <Textarea
                id="action_taken"
                rows={3}
                value={formData.action_taken || ''}
                onChange={(e) => handleChange('action_taken', e.target.value)}
                placeholder="Describe the actions taken to address this complaint..."
                className="resize-none bg-white/80 backdrop-blur-sm"
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[100px]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editData ? 'Update' : 'Submit Complaint'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Complaint Details Modal
const ComplaintDetailsModal = ({ complaint, onClose, onStatusUpdate, onDelete, onEdit }) => {
  const [updating, setUpdating] = useState(false);
  const typeConfig = COMPLAINT_TYPES[complaint.complaint_type] || COMPLAINT_TYPES.other;
  const severityConfig = SEVERITY_LEVELS[complaint.severity] || SEVERITY_LEVELS.low;
  
  const displayId = complaint.id ? (typeof complaint.id === 'string' ? complaint.id.slice(0, 8) : String(complaint.id).slice(0, 8)) : 'N/A';

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(complaint.id, newStatus);
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this complaint? This action cannot be undone.')) return;
    setUpdating(true);
    try {
      await onDelete(complaint.id);
      toast.success('Complaint deleted');
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
            <div className={`p-2 rounded-lg ${typeConfig.badge} border`}>
              {React.createElement(typeConfig.icon, { className: `h-5 w-5 ${typeConfig.color === 'orange' ? 'text-orange-600' : ''}` })}
            </div>
            {complaint.title}
          </DialogTitle>
          <DialogDescription>
            Complaint #{displayId} • Reported on {formatDate(complaint.reported_date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reporter Card */}
            <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-transparent bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Reporter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(complaint.reported_by_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{complaint.reported_by_name}</p>
                    <p className="text-xs text-muted-foreground">{complaint.reported_by_position}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-xs font-medium">{complaint.reported_by_department || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-transparent bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" /> Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type</span>
                  <TypeBadge type={complaint.complaint_type} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Severity</span>
                  <SeverityBadge severity={complaint.severity} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={complaint.status} />
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-sm">{complaint.location}</p>
                </div>
                {complaint.assigned_to && (
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                    <p className="font-medium text-sm">{complaint.assigned_to}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description Card */}
          <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-transparent bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg p-4 border">
                <p className="whitespace-pre-wrap text-sm">{complaint.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Taken Card */}
          {complaint.action_taken && (
            <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-transparent bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Action Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background rounded-lg p-4 border">
                  <p className="whitespace-pre-wrap text-sm">{complaint.action_taken}</p>
                </div>
                {complaint.resolution_date && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Resolved on: {formatDate(complaint.resolution_date)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => { onEdit(complaint); onClose(); }} className="gap-2">
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit this complaint</TooltipContent>
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
                  <TooltipContent>Change the status of this complaint</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                  <Clock className="h-4 w-4 mr-2 text-yellow-600" /> Mark Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('investigating')}>
                  <Search className="h-4 w-4 mr-2 text-blue-600" /> Start Investigation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('resolved')}>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Mark Resolved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('closed')}>
                  <Check className="h-4 w-4 mr-2 text-gray-600" /> Close
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
                <TooltipContent>Delete this complaint (cannot be undone)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Employee Summary Component (for showing complaints by employee)
const EmployeeSummary = ({ data, show, onToggle, onEmployeeSelect }) => {
  const summary = useMemo(() => {
    const employeeMap = {};
    
    data.forEach((item) => {
      const name = item.reported_by_name;
      if (!employeeMap[name]) {
        employeeMap[name] = {
          name: name,
          id: item.reported_by_id,
          count: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        };
      }
      const entry = employeeMap[name];
      entry.count += 1;
      if (item.severity === 'critical') entry.critical++;
      else if (item.severity === 'high') entry.high++;
      else if (item.severity === 'medium') entry.medium++;
      else entry.low++;
    });

    return Object.values(employeeMap).sort((a, b) => b.count - a.count);
  }, [data]);

  if (summary.length === 0) return null;

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Complaints by Employee
            <Badge variant="outline" className="ml-2 bg-background">
              {summary.length} reporters
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
          Number of complaints reported by each employee
        </CardDescription>
      </CardHeader>
      {show && (
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 p-4">
              {summary.map((emp) => {
                const total = emp.count;
                const criticalPercent = total > 0 ? (emp.critical / total) * 100 : 0;
                const highPercent = total > 0 ? (emp.high / total) * 100 : 0;
                const mediumPercent = total > 0 ? (emp.medium / total) * 100 : 0;
                const lowPercent = total > 0 ? (emp.low / total) * 100 : 0;
                
                return (
                  <div
                    key={emp.name}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all"
                    onClick={() => onEmployeeSelect(emp.name)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.id || 'ID not available'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold">{total} complaints</p>
                        <div className="flex gap-1 mt-1">
                          {emp.critical > 0 && <span className="text-xs text-red-600">C:{emp.critical}</span>}
                          {emp.high > 0 && <span className="text-xs text-orange-600">H:{emp.high}</span>}
                          {emp.medium > 0 && <span className="text-xs text-yellow-600">M:{emp.medium}</span>}
                          {emp.low > 0 && <span className="text-xs text-blue-600">L:{emp.low}</span>}
                        </div>
                      </div>
                      <div className="w-24">
                        <div className="flex h-2 rounded-full overflow-hidden">
                          {criticalPercent > 0 && (
                            <div className="bg-red-500 h-full" style={{ width: `${criticalPercent}%` }} />
                          )}
                          {highPercent > 0 && (
                            <div className="bg-orange-500 h-full" style={{ width: `${highPercent}%` }} />
                          )}
                          {mediumPercent > 0 && (
                            <div className="bg-yellow-500 h-full" style={{ width: `${mediumPercent}%` }} />
                          )}
                          {lowPercent > 0 && (
                            <div className="bg-blue-500 h-full" style={{ width: `${lowPercent}%` }} />
                          )}
                        </div>
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
      const type = item.complaint_type;
      if (!result[type]) {
        result[type] = {
          count: 0,
        };
      }
      result[type].count += 1;
    });
    return result;
  }, [data]);

  if (Object.keys(summary).length === 0) return null;

  const total = data.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Object.entries(COMPLAINT_TYPES).map(([key, config]) => {
        const stats = summary[key] || { count: 0 };
        const percentage = total > 0 ? (stats.count / total) * 100 : 0;
        const Icon = config.icon;
        
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card 
                  className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 bg-white/90 backdrop-blur-sm"
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
                        <span className="text-muted-foreground">Reports</span>
                        <span className="font-bold">{stats.count}</span>
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

// Severity Summary Component
const SeveritySummary = ({ data, onSeveritySelect }) => {
  const summary = useMemo(() => {
    const result = {};
    data.forEach((item) => {
      const severity = item.severity;
      if (!result[severity]) {
        result[severity] = {
          count: 0,
        };
      }
      result[severity].count += 1;
    });
    return result;
  }, [data]);

  if (Object.keys(summary).length === 0) return null;

  const total = data.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(SEVERITY_LEVELS).map(([key, config]) => {
        const stats = summary[key] || { count: 0 };
        const percentage = total > 0 ? (stats.count / total) * 100 : 0;
        const Icon = config.icon;
        
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card 
                  className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 bg-white/90 backdrop-blur-sm"
                  onClick={() => onSeveritySelect(key)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${key === 'critical' ? 'from-red-500/20 to-red-500/5' : key === 'high' ? 'from-orange-500/20 to-orange-500/5' : key === 'medium' ? 'from-yellow-500/20 to-yellow-500/5' : 'from-blue-500/20 to-blue-500/5'} opacity-50`} />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${config.bgColor} text-${config.color}-600`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold">{config.name}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reports</span>
                        <span className="font-bold">{stats.count}</span>
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
                <p>Click to filter by {config.name} severity</p>
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
  selectedTypes,
  onTypeToggle,
  selectedSeverities,
  onSeverityToggle,
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
        <span className="text-xs font-medium text-muted-foreground">Month:</span>
        <Badge 
          variant={selectedMonth === '' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onMonthChange('')}
        >
          All
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
        <span className="text-xs font-medium text-muted-foreground">Reporter:</span>
        <Badge 
          variant={selectedEmployee === '' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onEmployeeChange('')}
        >
          All
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
          placeholder="Search by title, description, location..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 bg-white/80 backdrop-blur-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            Date From
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Filter complaints from this date onwards</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="h-10 bg-white/80 backdrop-blur-sm"
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
                <TooltipContent>Filter complaints up to this date</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="h-10 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Type Filters */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          Complaint Types
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>Select one or more complaint types to filter</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(COMPLAINT_TYPES).map(([key, type]) => {
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

      {/* Severity Filters */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          Severity Levels
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>Select one or more severity levels to filter</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SEVERITY_LEVELS).map(([key, severity]) => {
            const Icon = severity.icon;
            const isSelected = selectedSeverities.includes(key);
            return (
              <Badge
                key={key}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer gap-1 px-3 py-1.5 transition-all hover:scale-105 ${
                  isSelected ? severity.badge : ''
                }`}
                onClick={() => onSeverityToggle(key)}
              >
                <Icon className="h-3 w-3" />
                {severity.name}
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
export default function SafetyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [reporterFilter, setReporterFilter] = useState('all');
  
  // Advanced Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedReporterName, setSelectedReporterName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showTypeSummary, setShowTypeSummary] = useState(true);
  const [showSeveritySummary, setShowSeveritySummary] = useState(true);
  
  // Sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Expanded rows in table view
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Rotating nature wallpaper every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWallpaperIndex((prev) => (prev + 1) % natureWallpapers.length);
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const apiFilters = {
        status: statusFilter === 'all' ? null : statusFilter,
        complaint_type: typeFilter === 'all' ? null : typeFilter,
        severity: severityFilter === 'all' ? null : severityFilter,
        reported_by_id: reporterFilter === 'all' ? null : reporterFilter,
        date_from: dateFrom || null,
        date_to: dateTo || null,
        month: monthFilter || null,
        year: yearFilter || null,
      };
      const data = await fetchComplaints(apiFilters);
      setComplaints(data);
      toast.success(`Loaded ${data.length} safety complaints`);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [statusFilter, typeFilter, severityFilter, reporterFilter, dateFrom, dateTo, monthFilter, yearFilter]);

  const handleCreate = async (data) => {
    const newItem = await createComplaint(data);
    setComplaints((prev) => [newItem, ...prev]);
  };

  const handleUpdate = async (id, data) => {
    const updated = await updateComplaint(id, data);
    setComplaints((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleStatusUpdate = async (id, status) => {
    await updateComplaintStatus(id, status);
    setComplaints((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleDelete = async (id) => {
    await deleteComplaint(id);
    setComplaints((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
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
    setSeverityFilter('all');
    setReporterFilter('all');
    setDateFrom('');
    setDateTo('');
    setMonthFilter('');
    setYearFilter('');
    setSearchTerm('');
    setSelectedTypes([]);
    setSelectedSeverities([]);
    setSelectedStatuses([]);
    setSelectedReporterName('');
    setCurrentPage(1);
    toast.success('All filters cleared');
  };

  const handleTypeSelect = (type) => {
    setTypeFilter(type);
    setSelectedTypes([type]);
    setShowAdvancedFilters(true);
  };

  const handleSeveritySelect = (severity) => {
    setSeverityFilter(severity);
    setSelectedSeverities([severity]);
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

  const handleSeverityToggle = (severity) => {
    setSelectedSeverities(prev => {
      const newSeverities = prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity];
      
      if (newSeverities.length === 1) {
        setSeverityFilter(newSeverities[0]);
      } else if (newSeverities.length === 0) {
        setSeverityFilter('all');
      } else {
        setSeverityFilter('all');
      }
      
      return newSeverities;
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

  const handleReporterQuickFilter = (reporterName) => {
    setSelectedReporterName(reporterName);
    setCurrentPage(1);
  };

  // Apply all filters to the data
  const processedComplaints = useMemo(() => {
    let filtered = complaints;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term) ||
          c.location?.toLowerCase().includes(term) ||
          c.reported_by_name?.toLowerCase().includes(term)
      );
    }

    // Apply reporter name filter
    if (selectedReporterName) {
      filtered = filtered.filter(c => c.reported_by_name === selectedReporterName);
    }

    // Apply date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((c) => {
        const cDate = new Date(c.reported_date);
        cDate.setHours(0, 0, 0, 0);
        return cDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((c) => {
        const cDate = new Date(c.reported_date);
        cDate.setHours(0, 0, 0, 0);
        return cDate <= toDate;
      });
    }

    // Apply month filter
    if (monthFilter) {
      filtered = filtered.filter((c) => {
        const cDate = new Date(c.reported_date);
        const cMonth = (cDate.getMonth() + 1).toString().padStart(2, '0');
        return cMonth === monthFilter;
      });
    }

    // Apply year filter
    if (yearFilter) {
      filtered = filtered.filter((c) => {
        const cDate = new Date(c.reported_date);
        return cDate.getFullYear().toString() === yearFilter;
      });
    }

    // Apply multiple type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(c => selectedTypes.includes(c.complaint_type));
    }

    // Apply multiple severity filter
    if (selectedSeverities.length > 0) {
      filtered = filtered.filter(c => selectedSeverities.includes(c.severity));
    }

    // Apply multiple status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(c => selectedStatuses.includes(c.status));
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let compare = 0;
      if (sortBy === 'date') {
        compare = new Date(a.reported_date) - new Date(b.reported_date);
      } else if (sortBy === 'title') {
        compare = (a.title || '').localeCompare(b.title || '');
      } else if (sortBy === 'reporter') {
        compare = (a.reported_by_name || '').localeCompare(b.reported_by_name || '');
      } else if (sortBy === 'type') {
        compare = (a.complaint_type || '').localeCompare(b.complaint_type || '');
      } else if (sortBy === 'severity') {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        compare = (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0);
      } else if (sortBy === 'status') {
        compare = (a.status || '').localeCompare(b.status || '');
      }
      return sortOrder === 'asc' ? compare : -compare;
    });

    return sorted;
  }, [complaints, searchTerm, dateFrom, dateTo, sortBy, sortOrder, selectedTypes, selectedSeverities, selectedStatuses, monthFilter, yearFilter, selectedReporterName]);

  // Get unique reporters for quick filters
  const availableReporters = useMemo(() => {
    return getUniqueEmployees(complaints);
  }, [complaints]);

  // Paginate the data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedComplaints.slice(startIndex, endIndex);
  }, [processedComplaints, currentPage]);

  const totalPages = Math.ceil(processedComplaints.length / itemsPerPage);

  const stats = useMemo(() => {
    const total = processedComplaints.length;
    const pending = processedComplaints.filter((c) => c.status === 'pending').length;
    const investigating = processedComplaints.filter((c) => c.status === 'investigating').length;
    const resolved = processedComplaints.filter((c) => c.status === 'resolved').length;
    const critical = processedComplaints.filter((c) => c.severity === 'critical').length;
    const high = processedComplaints.filter((c) => c.severity === 'high').length;
    
    return { 
      total, 
      pending, 
      investigating,
      resolved,
      critical,
      high,
    };
  }, [processedComplaints]);

  const handleReporterSelect = (reporterId) => {
    setReporterFilter(reporterId);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    if (monthFilter) count++;
    if (yearFilter) count++;
    if (selectedTypes.length > 0) count++;
    if (selectedSeverities.length > 0) count++;
    if (selectedStatuses.length > 0) count++;
    if (statusFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (severityFilter !== 'all') count++;
    if (reporterFilter !== 'all') count++;
    if (selectedReporterName) count++;
    return count;
  }, [searchTerm, dateFrom, dateTo, monthFilter, yearFilter, selectedTypes, selectedSeverities, selectedStatuses, statusFilter, typeFilter, severityFilter, reporterFilter, selectedReporterName]);

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <div className="min-h-screen">
        {/* Rotating Nature Wallpaper Background */}
        <div className="fixed inset-0 z-0">
          {natureWallpapers.map((wallpaper, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-2000 ease-in-out"
              style={{
                backgroundImage: `url('${wallpaper.url}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentWallpaperIndex ? 1 : 0,
                filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
                transition: 'opacity 2000ms ease-in-out',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-4 right-4 text-white/30 text-xs font-light">
            {natureWallpapers[currentWallpaperIndex].location}
          </div>
        </div>

        <div className="relative z-10">
          <Header 
            isLoggedIn={isLoggedIn} 
            user={user} 
            onLogout={handleLogout} 
          />

          <main className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/10 animate-bounce-light">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
                Safety Complaints Management
              </h1>
              <p className="text-white/90 max-w-2xl mx-auto drop-shadow-md">
                Report, track, and resolve safety concerns. Every report helps create a safer workplace.
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-slide-up delay-100">
              <StatCard 
                title="Total Reports" 
                value={stats.total} 
                icon={FileText} 
                color="blue"
                tooltip="Total number of safety complaints"
              />
              <StatCard 
                title="Pending" 
                value={stats.pending} 
                icon={Clock} 
                color="yellow"
                onClick={() => {
                  setStatusFilter('pending');
                  handleStatusToggle('pending');
                }}
                tooltip="Click to filter pending complaints"
              />
              <StatCard 
                title="Investigating" 
                value={stats.investigating} 
                icon={Search} 
                color="blue"
                onClick={() => {
                  setStatusFilter('investigating');
                  handleStatusToggle('investigating');
                }}
                tooltip="Click to filter complaints under investigation"
              />
              <StatCard 
                title="Resolved" 
                value={stats.resolved} 
                icon={CheckCircle2} 
                color="green"
                onClick={() => {
                  setStatusFilter('resolved');
                  handleStatusToggle('resolved');
                }}
                tooltip="Click to filter resolved complaints"
              />
              <StatCard 
                title="Critical" 
                value={stats.critical} 
                icon={AlertTriangle} 
                color="red"
                onClick={() => {
                  setSeverityFilter('critical');
                  handleSeverityToggle('critical');
                }}
                tooltip="Click to filter critical severity complaints"
              />
              <StatCard 
                title="High Risk" 
                value={stats.high} 
                icon={AlertCircle} 
                color="orange"
                onClick={() => {
                  setSeverityFilter('high');
                  handleSeverityToggle('high');
                }}
                tooltip="Click to filter high severity complaints"
              />
            </div>

            {/* New Complaint Button */}
            <div className="flex justify-end animate-slide-up delay-200">
              <Button 
                onClick={() => setShowForm(true)} 
                className="gap-2 bg-red-600 hover:bg-red-700 shadow-lg"
                size="lg"
              >
                <Plus className="h-5 w-5" /> Report Safety Complaint
              </Button>
            </div>

            {/* Type Summary - Clickable */}
            {showTypeSummary && processedComplaints.length > 0 && (
              <div className="animate-slide-up delay-300">
                <TypeSummary data={processedComplaints} onTypeSelect={handleTypeSelect} />
              </div>
            )}

            {/* Severity Summary - Clickable */}
            {showSeveritySummary && processedComplaints.length > 0 && (
              <div className="animate-slide-up delay-400">
                <SeveritySummary data={processedComplaints} onSeveritySelect={handleSeveritySelect} />
              </div>
            )}

            {/* Filter Section */}
            <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm animate-slide-up delay-500">
              <CardHeader className="pb-3 bg-gradient-to-r from-red-500/10 to-transparent">
                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-red-500" />
                      <h2 className="text-lg font-semibold">Filters</h2>
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFilterCount} active
                        </Badge>
                      )}
                      <Badge variant="outline" className="ml-2 bg-background">
                        {processedComplaints.length} of {complaints.length} records
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                        <FilterX className="h-4 w-4" />
                        Clear
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="mt-4">
                      <AdvancedFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        dateFrom={dateFrom}
                        onDateFromChange={setDateFrom}
                        dateTo={dateTo}
                        onDateToChange={setDateTo}
                        selectedTypes={selectedTypes}
                        onTypeToggle={handleTypeToggle}
                        selectedSeverities={selectedSeverities}
                        onSeverityToggle={handleSeverityToggle}
                        selectedStatuses={selectedStatuses}
                        onStatusToggle={handleStatusToggle}
                        onClearFilters={clearFilters}
                        activeFilterCount={activeFilterCount}
                        selectedMonth={monthFilter}
                        onMonthChange={handleMonthChange}
                        selectedYear={yearFilter}
                        onYearChange={handleYearChange}
                        selectedEmployee={selectedReporterName}
                        onEmployeeChange={handleReporterQuickFilter}
                        availableEmployees={availableReporters}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>

            {/* View Toggle and Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex rounded-lg border bg-background p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-md px-3"
                        onClick={() => setViewMode('table')}
                      >
                        <TableIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Switch to table view</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-md px-3"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Switch to card view</TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-sm text-white/80">
                  Showing {paginatedData.length} of {processedComplaints.length} complaints
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                  const [by, order] = val.split('-');
                  setSortBy(by);
                  setSortOrder(order);
                }}>
                  <SelectTrigger className="w-[200px] bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest first)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    <SelectItem value="reporter-asc">Reporter (A-Z)</SelectItem>
                    <SelectItem value="reporter-desc">Reporter (Z-A)</SelectItem>
                    <SelectItem value="severity-desc">Severity (High to low)</SelectItem>
                    <SelectItem value="severity-asc">Severity (Low to high)</SelectItem>
                    <SelectItem value="type-asc">Type (A-Z)</SelectItem>
                    <SelectItem value="type-desc">Type (Z-A)</SelectItem>
                    <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                    <SelectItem value="status-desc">Status (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Employee Summary (Collapsible) */}
            {processedComplaints.length > 0 && showSummary && (
              <div className="animate-slide-up delay-600">
                <EmployeeSummary
                  data={processedComplaints}
                  show={showSummary}
                  onToggle={setShowSummary}
                  onEmployeeSelect={handleReporterQuickFilter}
                />
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : paginatedData.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="py-12">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No safety complaints found</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {complaints.length === 0
                        ? 'Get started by reporting your first safety concern.'
                        : 'No records match your current filters. Try adjusting them.'}
                    </p>
                    {complaints.length === 0 ? (
                      <Button onClick={() => setShowForm(true)} className="gap-2 bg-red-600 hover:bg-red-700">
                        <Plus className="h-4 w-4" /> Report Complaint
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={clearFilters} className="gap-2">
                        <FilterX className="h-4 w-4" /> Clear Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : viewMode === 'grid' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedData.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      onView={setSelectedComplaint}
                      onEdit={(c) => { setEditData(c); setShowForm(true); }}
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
                <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
                  <div className="overflow-x-auto">
                    <ShadcnTable>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Reporter</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((complaint) => {
                          const isExpanded = expandedRows.has(complaint.id);
                          return (
                            <React.Fragment key={complaint.id}>
                              <TableRow
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 w-7 p-0"
                                          onClick={(e) => toggleRowExpanded(complaint.id, e)}
                                        >
                                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {isExpanded ? 'Hide details' : 'Click to expand and view description'}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium max-w-[200px] truncate">{complaint.title}</div>
                                </TableCell>
                                <TableCell>
                                  <TypeBadge type={complaint.complaint_type} />
                                </TableCell>
                                <TableCell>
                                  <SeverityBadge severity={complaint.severity} />
                                </TableCell>
                                <TableCell className="text-sm max-w-[150px] truncate">{complaint.location}</TableCell>
                                <TableCell className="text-sm">{complaint.reported_by_name}</TableCell>
                                <TableCell className="whitespace-nowrap text-sm">{formatDate(complaint.reported_date)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={complaint.status} />
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => setSelectedComplaint(complaint)}
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
                                          onClick={() => { setEditData(complaint); setShowForm(true); }}
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
                                <TableRow className="bg-muted/20">
                                  <TableCell colSpan={9} className="p-4">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                          <MessageSquare className="h-3 w-3" /> Description
                                        </p>
                                        <p className="text-sm bg-background p-3 rounded-lg border">
                                          {complaint.description || 'No description provided'}
                                        </p>
                                      </div>
                                      {complaint.action_taken && (
                                        <div>
                                          <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                            <Check className="h-3 w-3" /> Action Taken
                                          </p>
                                          <p className="text-sm bg-background p-3 rounded-lg border">
                                            {complaint.action_taken}
                                          </p>
                                        </div>
                                      )}
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
                </Card>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </main>

          <Footer />
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <ComplaintForm
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
        />
      )}

      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          onEdit={(c) => { setEditData(c); setShowForm(true); setSelectedComplaint(null); }}
        />
      )}
    </>
  );
}
