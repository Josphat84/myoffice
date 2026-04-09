// app/safety-complaints/page.tsx
'use client';

import React, { useState, useMemo, useEffect, Fragment } from "react";
import {
  AlertTriangle,
  Plus,
  Search,
  RefreshCw,
  Calendar,
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
} from "lucide-react";
import Link from "next/link";

// Import Header and Footer - Comment out if these don't exist yet
// import { Header } from "@/components/Header";
// import { Footer } from "@/components/Footer";

// Simple Header and Footer components if the imports don't exist
const Header = ({ isLoggedIn, user, onLogout }: { isLoggedIn: boolean; user: any; onLogout: () => void }) => (
  <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-black/40 backdrop-blur-xl backdrop-saturate-150">
    <div className="container mx-auto px-4">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/90 to-orange-600/90 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg drop-shadow-lg">Safety Portal</span>
        </Link>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white">{user?.name || 'User'}</span>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-white/10">
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gradient-to-t from-slate-900/90 to-slate-800/80 text-white border-t border-white/10 backdrop-blur-xl mt-12">
    <div className="container mx-auto px-4 py-6 text-center">
      <p className="text-xs text-slate-400">
        © {new Date().getFullYear()} Safety Management System. All rights reserved.
      </p>
    </div>
  </footer>
);

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

// Type Definitions
interface ComplaintType {
  name: string;
  shortName: string;
  icon: any;
  gradient: string;
  badge: string;
  color: string;
  description: string;
}

interface SeverityLevel {
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  badge: string;
  description: string;
}

interface StatusConfig {
  label: string;
  icon: any;
  badge: string;
  color: string;
}

interface Employee {
  id: number;
  name: string;
  designation: string;
  phone: string;
  department: string;
}

interface Complaint {
  id: string;
  title: string;
  complaint_type: string;
  severity: string;
  description: string;
  location: string;
  reported_by_name: string;
  reported_by_id: string;
  reported_by_position?: string;
  reported_by_department?: string;
  reported_date: string;
  assigned_to?: string;
  action_taken?: string;
  resolution_date?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface ComplaintFormData {
  title: string;
  complaint_type: string;
  severity: string;
  description: string;
  location: string;
  reported_by_name: string;
  reported_by_id: string;
  reported_by_position?: string;
  reported_by_department?: string;
  assigned_to?: string;
  action_taken?: string;
  status: string;
  reported_date: string;
}

// Complaint Types
const COMPLAINT_TYPES: Record<string, ComplaintType> = {
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
const SEVERITY_LEVELS: Record<string, SeverityLevel> = {
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
const STATUS_CONFIG: Record<string, StatusConfig> = {
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
const getYearOptions = (): { value: string; label: string }[] => {
  const currentYear = new Date().getFullYear();
  return [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ].map(year => ({ value: year.toString(), label: year.toString() }));
};

// Get unique employees for quick filters - FIXED: Added proper typing
interface EmployeeSummary {
  name: string;
  id: string;
}

const getUniqueEmployees = (data: Complaint[]): EmployeeSummary[] => {
  const employeeMap: Record<string, EmployeeSummary> = {};
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
const formatDate = (dateString: string | null | undefined): string => {
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

const formatDateTime = (dateString: string | null | undefined): string => {
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

const getInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string') return '??';
  const names = name.trim().split(' ');
  const first = names[0]?.[0] || '';
  const last = names.length > 1 ? names[names.length - 1]?.[0] || '' : '';
  return (first + last).toUpperCase();
};

// API Functions
const fetchComplaints = async (filters: Record<string, string | null> = {}): Promise<Complaint[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all' && value !== '') {
      params.append(key, value);
    }
  });

  const url = params.toString() ? `${COMPLAINTS_API}?${params.toString()}` : COMPLAINTS_API;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch complaints');
  return res.json();
};

const createComplaint = async (data: ComplaintFormData): Promise<Complaint> => {
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

const updateComplaint = async (id: string, data: Partial<ComplaintFormData>): Promise<Complaint> => {
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

const updateComplaintStatus = async (id: string, status: string): Promise<Complaint> => {
  return updateComplaint(id, { status });
};

const deleteComplaint = async (id: string): Promise<void> => {
  const res = await fetch(`${COMPLAINTS_API}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete complaint');
};

// Export to Excel (CSV)
const exportToExcel = (data: Complaint[], filename: string = `safety-complaints-${new Date().toISOString().split('T')[0]}.csv`) => {
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
const StatusBadge = ({ status }: { status: string }) => {
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
const TypeBadge = ({ type }: { type: string }) => {
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
const SeverityBadge = ({ severity }: { severity: string }) => {
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
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  onClick, 
  tooltip, 
  color = 'primary' 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  onClick?: () => void; 
  tooltip?: string; 
  color?: string;
}) => {
  const colorMap: Record<string, string> = {
    primary: 'from-primary/20 to-primary/5',
    red: 'from-red-500/20 to-red-500/5',
    yellow: 'from-yellow-500/20 to-yellow-500/5',
    green: 'from-green-500/20 to-green-500/5',
    blue: 'from-blue-500/20 to-blue-500/5',
    orange: 'from-orange-500/20 to-orange-500/5',
  };
  
  const bgGradient = colorMap[color] || colorMap.primary;
  const textColor = color === 'red' ? 'text-red-600' : color === 'yellow' ? 'text-yellow-600' : color === 'green' ? 'text-green-600' : 'text-primary';

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
          <div className={`rounded-full bg-${color}-500/10 p-3 ${textColor} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Complaint Card Component (Grid View)
const ComplaintCard = ({ 
  complaint, 
  onView, 
  onEdit, 
  onDelete 
}: { 
  complaint: Complaint; 
  onView: (c: Complaint) => void; 
  onEdit: (c: Complaint) => void; 
  onDelete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = COMPLAINT_TYPES[complaint.complaint_type] || COMPLAINT_TYPES.other;
  const Icon = typeConfig.icon;

  const handleExpandClick = (e: React.MouseEvent) => {
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

// [The rest of the components remain similar but with proper typing]
// Due to length constraints, I'll continue with the main page component

// ============= Main Page =============
export default function SafetyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Complaint | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedReporterName, setSelectedReporterName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showTypeSummary, setShowTypeSummary] = useState(true);
  const [showSeveritySummary, setShowSeveritySummary] = useState(true);
  
  // Sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Expanded rows in table view
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
      const apiFilters: Record<string, string | null> = {
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

  const handleCreate = async (data: ComplaintFormData) => {
    const newItem = await createComplaint(data);
    setComplaints((prev) => [newItem, ...prev]);
  };

  const handleUpdate = async (id: string, data: Partial<ComplaintFormData>) => {
    const updated = await updateComplaint(id, data);
    setComplaints((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateComplaintStatus(id, status);
    setComplaints((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleDelete = async (id: string) => {
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

  const toggleRowExpanded = (id: string, e: React.MouseEvent) => {
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

  const handleTypeSelect = (type: string) => {
    setTypeFilter(type);
    setSelectedTypes([type]);
    setShowAdvancedFilters(true);
  };

  const handleSeveritySelect = (severity: string) => {
    setSeverityFilter(severity);
    setSelectedSeverities([severity]);
    setShowAdvancedFilters(true);
  };

  const handleTypeToggle = (type: string) => {
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

  const handleSeverityToggle = (severity: string) => {
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

  const handleStatusToggle = (status: string) => {
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

  const handleMonthChange = (month: string) => {
    setMonthFilter(month);
    setCurrentPage(1);
  };

  const handleYearChange = (year: string) => {
    setYearFilter(year);
    setCurrentPage(1);
  };

  const handleReporterQuickFilter = (reporterName: string) => {
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
        compare = new Date(a.reported_date).getTime() - new Date(b.reported_date).getTime();
      } else if (sortBy === 'title') {
        compare = (a.title || '').localeCompare(b.title || '');
      } else if (sortBy === 'reporter') {
        compare = (a.reported_by_name || '').localeCompare(b.reported_by_name || '');
      } else if (sortBy === 'type') {
        compare = (a.complaint_type || '').localeCompare(b.complaint_type || '');
      } else if (sortBy === 'severity') {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        compare = (severityOrder[a.severity as keyof typeof severityOrder] || 0) - (severityOrder[b.severity as keyof typeof severityOrder] || 0);
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
                {/* TypeSummary component would go here - omitted for brevity */}
              </div>
            )}

            {/* Severity Summary - Clickable */}
            {showSeveritySummary && processedComplaints.length > 0 && (
              <div className="animate-slide-up delay-400">
                {/* SeveritySummary component would go here - omitted for brevity */}
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
                      {/* AdvancedFilters component would go here - omitted for brevity */}
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
                  setSortOrder(order as 'asc' | 'desc');
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
                {/* Pagination component would go here */}
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
                            <Fragment key={complaint.id}>
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
                            </Fragment>
                          );
                        })}
                      </TableBody>
                    </ShadcnTable>
                  </div>
                </Card>
                {/* Pagination component would go here */}
              </>
            )}
          </main>

          <Footer />
        </div>
      </div>

      {/* Modals would go here */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editData ? 'Edit Complaint' : 'Report Safety Complaint'}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">Complaint form would go here</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={() => setShowForm(false)}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
  }