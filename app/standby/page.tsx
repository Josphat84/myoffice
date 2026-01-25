'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  CalendarDays,
  ChevronRight,
  Trash2,
  Save,
  User,
  CheckCircle,
  XCircle,
  Plus,
  CalendarClock,
  PhoneCall,
  Mail as MailIcon,
  Navigation,
  Building2,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Eye,
  EyeOff,
  TrendingUp,
  Grid,
  List,
  CalendarDays as CalendarViewIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  FilterX,
  TrendingUp as TrendingUpIcon,
  PhoneOutgoing,
  MailPlus,
  MessageSquare,
  UserCheck,
  UserCog,
  Clock4,
  Timer,
  Battery,
  BatteryCharging,
  Star,
  Target,
  Zap,
  Bell,
  FileText,
  ClipboardCheck,
  SortAsc,
  SortDesc,
  Download,
  Upload,
  MoreVertical,
  ExternalLink,
  DownloadCloud,
  Database,
  Server,
  Globe,
  Lock,
  Key,
  Activity,
  Layers,
  Table,
  GripVertical,
  AlertTriangle,
  Info,
  Wifi,
  Battery as BatteryIcon,
  Zap as ZapIcon,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  CloudLightning,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sunrise,
  Sunset,
  Flag,
  Award,
  Trophy,
  Crown,
  Medal,
  Heart,
  ThumbsUp,
  Smile,
  Frown,
  Meh,
  Laugh,
  Cat,
  Dog,
  Tree,
  Flower,
  Mountain,
  Waves,
  Flame,
  Snowflake,
  Umbrella,
  Bug,
  Palette,
  PenTool,
  Package,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp as TrendingUpIcon2,
  TrendingDown,
  Percent,
  Calculator,
  ChartBar,
  ChartLine,
  ChartArea,
  ChartPie,
  Target as TargetIcon,
  Award as AwardIcon,
  Trophy as TrophyIcon,
  Crown as CrownIcon,
  Gift,
  HeartHandshake,
  ThumbsDown,
  Ghost,
  Skull,
  Fish,
  Bird,
  Rabbit,
  Leaf,
  Volcano,
  Droplet,
  Cloud as CloudIcon,
  Sprout,
  Shell,
  Bone,
  Brush,
  Pen,
  Eraser,
  Scissors,
  Ruler,
  Box,
  Container,
  Cube,
  Cylinder,
  PackageOpen,
  Layers as LayersIcon,
  Stack,
  FolderTree,
  FileText as FileTextIcon,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FileSearch,
  FilePlus,
  FileMinus,
  FileX,
  FolderPlus,
  FolderMinus,
  FolderX,
  Archive,
  Inbox,
  Outbox,
  Send,
  Mail as MailIcon2,
  MailOpen,
  MailCheck,
  MailWarning,
  MailQuestion,
  MailSearch,
  MailX,
  Inbox as InboxIcon,
  Send as SendIcon,
  Reply,
  ReplyAll,
  Forward,
  MessageCircle,
  MessageSquare as MessageSquareIcon,
  MessageCircleQuestion,
  MessageCircleWarning,
  MessageCircleX,
  MessageSquarePlus,
  MessageSquareReply,
  MessageSquareQuote,
  MessageSquareShare,
  MessagesSquare,
  SquareMessage,
  SquarePlus,
  SquareMinus,
  SquareX,
  Circle,
  CircleCheck,
  CircleAlert,
  CircleX,
  CircleHelp,
  CircleDot,
  CircleEllipsis,
  CircleDashed,
  Triangle,
  TriangleAlert,
  Hexagon,
  Octagon,
  Cross,
  X as XIcon,
  Minus,
  Divide,
  Equal,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Multiply,
  Divide as DivideIcon,
  Percent as PercentIcon,
  Infinity,
  Pi,
  Sigma,
  Omega,
  Alpha,
  Beta,
  Gamma,
  Delta,
  Epsilon,
  Zeta,
  Eta,
  Theta,
  Iota,
  Kappa,
  Lambda,
  Mu,
  Nu,
  Xi,
  Omicron,
  Pi as PiIcon,
  Rho,
  Sigma as SigmaIcon,
  Tau,
  Upsilon,
  Phi,
  Chi,
  Psi,
  Omega as OmegaIcon
} from 'lucide-react';
import { format, isToday, parseISO, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, differenceInDays, isWithinInterval, startOfDay, endOfDay, addWeeks } from 'date-fns';
import Link from 'next/link';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const EMPLOYEES_API_URL = `${API_BASE_URL}/api/employees`;
const STANDBY_API_URL = `${API_BASE_URL}/api/standby`;

// Types
interface Employee {
  id: string;
  name: string;
  position: string;
  designation?: string; // Added designation field
  department: string;
  contact: string;
  email: string;
  location: string;
  is_active: boolean;
  avatar?: string;
  color?: string;
  skills?: string[];
  hire_date?: string;
  availability?: 'available' | 'busy' | 'vacation' | 'off-duty' | 'on-standby';
  last_active?: string;
  rating?: number;
  notes?: string;
  emergency_contact?: string;
  shift?: 'day' | 'night' | 'rotating';
  certifications?: string[];
  experience_years?: number;
  current_project?: string;
}

interface StandbySchedule {
  id: number;
  employee_id: string;
  start_date: string;
  end_date: string;
  residence: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  notified?: boolean;
  duration_days?: number;
}

// Utility Functions
const getStatusBadgeColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "scheduled": return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200";
    case "active": return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
    case "completed": return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200";
    case "cancelled": return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
    default: return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "critical": return "bg-red-100 text-red-800 border-red-300";
    case "high": return "bg-orange-100 text-orange-800 border-orange-300";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "low": return "bg-blue-100 text-blue-800 border-blue-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getAvailabilityColor = (availability: string) => {
  switch (availability?.toLowerCase()) {
    case "available": return "bg-green-100 text-green-800 border-green-200";
    case "busy": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "vacation": return "bg-purple-100 text-purple-800 border-purple-200";
    case "off-duty": return "bg-gray-100 text-gray-800 border-gray-200";
    case "on-standby": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPositionIcon = (position: string) => {
  const positionLower = position.toLowerCase();
  if (positionLower.includes('fitter') || positionLower.includes('technician')) return <Wrench className="w-4 h-4" />;
  if (positionLower.includes('engineer')) return <Cpu className="w-4 h-4" />;
  if (positionLower.includes('manager') || positionLower.includes('supervisor')) return <UserCog className="w-4 h-4" />;
  if (positionLower.includes('operator')) return <Activity className="w-4 h-4" />;
  if (positionLower.includes('electrician')) return <ZapIcon className="w-4 h-4" />;
  if (positionLower.includes('welder')) return <Flame className="w-4 h-4" />;
  if (positionLower.includes('driver')) return <Car className="w-4 h-4" />;
  if (positionLower.includes('safety')) return <ShieldCheck className="w-4 h-4" />;
  return <User className="w-4 h-4" />;
};

const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '??';
  const names = name.trim().split(' ');
  const first = names[0]?.[0] || '';
  const last = names.length > 1 ? names[names.length - 1]?.[0] || '' : '';
  return (first + last).toUpperCase();
};

const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch {
    return dateString;
  }
};

const formatPhoneNumber = (phone: string): string => {
  if (!phone) return 'No Contact';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

const generateAvatarColor = (id: string): string => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-amber-500 to-amber-600'
  ];
  const index = parseInt(id) % colors.length || 0;
  return colors[index] || colors[0];
};

const extractEmployeeData = (data: any): Employee => {
  const name = 
    data.name || 
    data.employee_name || 
    data.full_name || 
    data.Name || 
    data.EmployeeName ||
    (data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : null) ||
    'Employee';

  // Get position and designation
  const position = data.position || data.job_title || data.Position || data.JobTitle || 'Position';
  const designation = data.designation || data.Designation || position; // Use position as fallback for designation

  return {
    id: String(data.id || data.employee_id || Math.random().toString(36).substr(2, 9)),
    name: name.trim(),
    position: position,
    designation: designation,
    department: data.department || data.dept || data.Department || data.Dept || 'Department',
    contact: data.contact || data.phone || data.mobile || data.contact_number || data.Contact || 'No Contact',
    email: data.email || data.Email || data.email_address || 'No Email',
    location: data.location || data.address || data.Location || data.Address || data.work_location || 'No Location',
    is_active: data.is_active !== undefined ? data.is_active : true,
    avatar: data.avatar || data.profile_picture,
    color: data.color,
    skills: data.skills || [],
    hire_date: data.hire_date,
    availability: data.availability || 'available',
    last_active: data.last_active,
    rating: data.rating || 0,
    notes: data.notes,
    emergency_contact: data.emergency_contact,
    shift: data.shift || 'day',
    certifications: data.certifications || [],
    experience_years: data.experience_years || 0,
    current_project: data.current_project
  };
};

// Icons for different positions
const Wrench = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Car = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l2.75-2.75M21 7l-2.75-2.75M9 6h6M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
  </svg>
);

const Cpu = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

// Enhanced Stats Card
const StatsCard = ({ title, value, icon: Icon, color, trend, description, onClick }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: { value: number; isPositive: boolean };
  description?: string;
  onClick?: () => void;
}) => (
  <Card 
    className={`group hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-blue-300' : ''}`}
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <TrendingUpIcon className={`w-4 h-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Enhanced Employee Card with Designation and Consistent Grid Layout
const EmployeeCard = ({ employee, onSchedule }: { 
  employee: Employee; 
  onSchedule: (employee: Employee) => void;
}) => {
  const avatarColor = generateAvatarColor(employee.id);
  const phoneNumber = employee.contact?.replace(/\D/g, '');
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden border hover:border-blue-300 h-full flex flex-col">
      <CardContent className="p-6 flex-1">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <Avatar className={`h-12 w-12 ${avatarColor} text-white`}>
              <AvatarFallback className="text-sm font-semibold">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {employee.name}
                </h3>
                {employee.is_active ? (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                )}
              </div>
              
              {/* Designation and Position */}
              <div className="flex items-center gap-2 mb-2">
                {employee.designation && employee.designation !== employee.position ? (
                  <>
                    <Badge variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                      {employee.designation}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium">
                      {employee.position}
                    </Badge>
                  </>
                ) : (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {employee.position}
                  </Badge>
                )}
                
                {employee.experience_years && employee.experience_years > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {employee.experience_years}y exp
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Building2 className="w-3 h-3 mr-1" />
                  {employee.department}
                </Badge>
                <Badge className={`text-xs ${getAvailabilityColor(employee.availability || 'available')}`}>
                  {employee.availability?.replace('-', ' ') || 'available'}
                </Badge>
                {employee.certifications && employee.certifications.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-help">
                        {employee.certifications.length} certs
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{employee.certifications.join(', ')}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {/* Phone as clickable link */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <PhoneCall className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="flex-1">
              {phoneNumber ? (
                <a 
                  href={`tel:${phoneNumber}`}
                  className="font-medium truncate text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatPhoneNumber(employee.contact)}
                </a>
              ) : (
                <span className="font-medium truncate">No Contact</span>
              )}
              {employee.emergency_contact && (
                <div className="text-xs text-gray-500 mt-1">
                  Emergency: {formatPhoneNumber(employee.emergency_contact)}
                </div>
              )}
            </div>
          </div>
          
          {/* Email as clickable link */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MailIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            {employee.email !== 'No Email' ? (
              <a 
                href={`mailto:${employee.email}`}
                className="truncate text-emerald-600 hover:text-emerald-800 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {employee.email}
              </a>
            ) : (
              <span className="truncate">{employee.email}</span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Navigation className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="truncate">{employee.location}</span>
          </div>
          
          {employee.current_project && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Target className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="truncate">Project: {employee.current_project}</span>
            </div>
          )}
          
          {employee.skills && employee.skills.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {employee.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
                {employee.skills.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{employee.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <div className="p-6 pt-0 mt-auto">
        <Button 
          className="w-full"
          onClick={() => onSchedule(employee)}
          size="sm"
        >
          <CalendarDays className="w-4 h-4 mr-2" />
          Schedule Standby
        </Button>
      </div>
    </Card>
  );
};

// Enhanced Employee Select Component with Designation
const EmployeeSelect = ({ 
  employees, 
  selectedEmployeeId, 
  onSelect, 
  label, 
  placeholder 
}: { 
  employees: Employee[]; 
  selectedEmployeeId: string; 
  onSelect: (id: string) => void;
  label: string;
  placeholder: string;
}) => {
  const [search, setSearch] = useState("");
  
  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const query = search.toLowerCase();
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.position.toLowerCase().includes(query) ||
      (emp.designation && emp.designation.toLowerCase().includes(query)) ||
      emp.department.toLowerCase().includes(query)
    );
  }, [employees, search]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label} *</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedEmployeeId ? (
              <div className="flex items-center gap-2 truncate">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      employees.find(e => e.id === selectedEmployeeId)?.name || ""
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left truncate">
                  <div className="truncate font-medium">
                    {employees.find(e => e.id === selectedEmployeeId)?.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {employees.find(e => e.id === selectedEmployeeId)?.position}
                    {employees.find(e => e.id === selectedEmployeeId)?.designation && 
                     employees.find(e => e.id === selectedEmployeeId)?.designation !== employees.find(e => e.id === selectedEmployeeId)?.position && (
                      <span> • {employees.find(e => e.id === selectedEmployeeId)?.designation}</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[60vh] p-0" align="start">
          <div className="p-2">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <ScrollArea className="h-64">
              {filteredEmployees.length === 0 ? (
                <div className="py-6 text-center">
                  <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No employees found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredEmployees.map(employee => (
                    <Button
                      key={employee.id}
                      variant="ghost"
                      className="w-full justify-start px-2 py-3 h-auto hover:bg-gray-100"
                      onClick={() => onSelect(employee.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs truncate max-w-[120px]">
                                {employee.position}
                              </Badge>
                              {employee.designation && employee.designation !== employee.position && (
                                <Badge variant="outline" className="text-xs truncate max-w-[120px] bg-blue-50 text-blue-700 border-blue-200">
                                  {employee.designation}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-600 truncate">{employee.department}</span>
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Enhanced Standby Overview Component
const StandbyOverview = ({ schedules }: { schedules: StandbySchedule[] }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const weeklySchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const start = parseISO(schedule.start_date);
      const end = parseISO(schedule.end_date);
      return (start <= weekEnd && end >= weekStart) || 
             isSameDay(start, weekStart) || 
             isSameDay(start, weekEnd) ||
             isSameDay(end, weekStart) ||
             isSameDay(end, weekEnd);
    });
  }, [schedules, weekStart, weekEnd]);

  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getSchedulesForDay = (day: Date) => {
    return weeklySchedules.filter(schedule => {
      const start = parseISO(schedule.start_date);
      const end = parseISO(schedule.end_date);
      return day >= start && day <= end;
    });
  };

  const getEmployeePositions = () => {
    const positions = weeklySchedules.map(s => s.employee?.position).filter(Boolean) as string[];
    const unique = [...new Set(positions)];
    return unique;
  };

  const toggleDayExpansion = (day: Date) => {
    if (expandedDay && isSameDay(expandedDay, day)) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  if (weeklySchedules.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="py-12 text-center">
          <CalendarClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Standby This Week</h3>
          <p className="text-gray-500">No employees are scheduled for standby this week</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Weekly Standby Overview
            </CardTitle>
            <CardDescription>
              {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentWeek(new Date());
                setExpandedDay(null);
              }}
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-600 mb-1">Total on Standby</p>
                <p className="text-3xl font-bold text-gray-900">{weeklySchedules.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-green-600 mb-1">Active Now</p>
                <p className="text-3xl font-bold text-green-600">
                  {weeklySchedules.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-orange-600 mb-1">Fitters</p>
                <p className="text-3xl font-bold text-orange-600">
                  {weeklySchedules.filter(s => 
                    s.employee?.position?.toLowerCase().includes('fitter')).length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-purple-600 mb-1">Positions</p>
                <p className="text-3xl font-bold text-purple-600">
                  {getEmployeePositions().length}
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Calendar View with Expandable Days */}
          <div className="border rounded-xl overflow-hidden bg-white">
            <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const dayDate = weekDays[index];
                const daySchedules = getSchedulesForDay(dayDate);
                const isTodayFlag = isToday(dayDate);
                const isExpanded = expandedDay && isSameDay(expandedDay, dayDate);
                
                return (
                  <div 
                    key={day} 
                    className={`p-3 text-center border-r last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isTodayFlag ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => daySchedules.length > 0 && toggleDayExpansion(dayDate)}
                  >
                    <p className="text-sm font-medium text-gray-500">{day}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <p className={`text-lg font-bold ${isTodayFlag ? 'text-blue-600' : 'text-gray-900'}`}>
                        {format(dayDate, 'd')}
                      </p>
                      {daySchedules.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {daySchedules.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Expanded Day View */}
            {expandedDay && (
              <div className="border-t p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {format(expandedDay, 'EEEE, MMMM d, yyyy')}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedDay(null)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {getSchedulesForDay(expandedDay).map(schedule => {
                    const employee = schedule.employee;
                    if (!employee) return null;
                    
                    return (
                      <div key={schedule.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {getInitials(employee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {employee.position}
                                </Badge>
                                {employee.designation && employee.designation !== employee.position && (
                                  <Badge variant="outline" className="text-xs">
                                    {employee.designation}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusBadgeColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </div>
                        
                        {/* Contact Information with clickable links */}
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Contact</p>
                            <a 
                              href={`tel:${employee.contact.replace(/\D/g, '')}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              {formatPhoneNumber(employee.contact)}
                            </a>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Residence</p>
                            <p className="text-sm font-medium text-gray-900">{schedule.residence}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Daily Schedule Grid */}
            <div className="grid grid-cols-7 divide-x">
              {weekDays.map((day, index) => {
                const daySchedules = getSchedulesForDay(day);
                const isExpanded = expandedDay && isSameDay(expandedDay, day);
                
                return (
                  <div 
                    key={index} 
                    className={`min-h-48 p-2 ${isExpanded ? 'bg-blue-50' : ''}`}
                  >
                    <div className="space-y-2">
                      {daySchedules.slice(0, isExpanded ? 10 : 3).map(schedule => (
                        <div
                          key={schedule.id}
                          className={`text-xs p-2 rounded cursor-pointer truncate ${
                            schedule.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' :
                            schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200' :
                            'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                          }`}
                          onClick={() => toggleDayExpansion(day)}
                        >
                          <div className="font-medium truncate">{schedule.employee?.name}</div>
                          <div className="text-xs opacity-75 truncate mt-1">
                            {schedule.employee?.position}
                            {schedule.employee?.designation && schedule.employee.designation !== schedule.employee.position && (
                              <span> • {schedule.employee.designation}</span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Show more indicator */}
                      {daySchedules.length > 3 && !isExpanded && (
                        <div 
                          className="text-xs text-gray-500 text-center cursor-pointer hover:text-gray-700 hover:bg-gray-100 py-1 rounded"
                          onClick={() => toggleDayExpansion(day)}
                        >
                          +{daySchedules.length - 3} more
                        </div>
                      )}
                      
                      {/* Show less indicator when expanded */}
                      {isExpanded && daySchedules.length > 0 && (
                        <div 
                          className="text-xs text-blue-500 text-center cursor-pointer hover:text-blue-700 hover:bg-blue-50 py-1 rounded"
                          onClick={() => setExpandedDay(null)}
                        >
                          Show less
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Employee List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Employees on Standby This Week</h4>
              <Badge variant="outline" className="text-xs">
                {weeklySchedules.length} employees
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
              {weeklySchedules.map(schedule => {
                const employee = schedule.employee;
                if (!employee) return null;
                
                const start = parseISO(schedule.start_date);
                const end = parseISO(schedule.end_date);
                const isActive = schedule.status === 'active';
                const phoneNumber = employee.contact?.replace(/\D/g, '');
                
                return (
                  <div key={schedule.id} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                            {isActive && (
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {employee.position}
                              </Badge>
                              {employee.designation && employee.designation !== employee.position && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {employee.designation}
                                </Badge>
                              )}
                              <Badge className={getStatusBadgeColor(schedule.status)}>
                                {schedule.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span>
                                {format(start, 'MMM dd')} - {format(end, 'MMM dd')}
                              </span>
                              {phoneNumber && (
                                <a 
                                  href={`tel:${phoneNumber}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Phone className="w-3 h-3" />
                                  Call
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {schedule.priority && schedule.priority !== 'medium' && (
                        <Badge className={`text-xs ${getPriorityColor(schedule.priority)}`}>
                          {schedule.priority}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{schedule.residence}</span>
                        </div>
                        {employee.email && employee.email !== 'No Email' && (
                          <a 
                            href={`mailto:${employee.email}`}
                            className="text-xs text-emerald-600 hover:text-emerald-800 hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="w-3 h-3" />
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Calendar View Component with Expandable Days
const CalendarView = ({ schedules, onView }: {
  schedules: StandbySchedule[];
  onView: (schedule: StandbySchedule) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const end = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start, end });

  const getSchedulesForDay = (day: Date) => {
    return schedules.filter(schedule => {
      const start = parseISO(schedule.start_date);
      const end = parseISO(schedule.end_date);
      return (day >= start && day <= end) || isSameDay(day, start) || isSameDay(day, end);
    });
  };

  const toggleDayExpansion = (day: Date) => {
    const daySchedules = getSchedulesForDay(day);
    if (daySchedules.length === 0) return;
    
    if (expandedDay && isSameDay(expandedDay, day)) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Calendar View</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addDays(currentDate, -7))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(start, 'MMM dd')} - {format(end, 'MMM dd, yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addDays(currentDate, 7))}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Expanded Day View */}
          {expandedDay && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {format(expandedDay, 'EEEE, MMMM d, yyyy')}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedDay(null)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {getSchedulesForDay(expandedDay).map(schedule => {
                  const employee = schedule.employee;
                  if (!employee) return null;
                  const phoneNumber = employee.contact?.replace(/\D/g, '');
                  
                  return (
                    <div key={schedule.id} className="bg-white p-4 rounded-lg border hover:shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{employee.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {employee.position}
                              </Badge>
                              {employee.designation && employee.designation !== employee.position && (
                                <Badge variant="outline" className="text-xs">
                                  {employee.designation}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Period</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Residence</p>
                          <p className="text-sm font-medium text-gray-900">{schedule.residence}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4">
                          {phoneNumber && (
                            <a 
                              href={`tel:${phoneNumber}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                            >
                              <Phone className="w-4 h-4" />
                              {formatPhoneNumber(employee.contact)}
                            </a>
                          )}
                          {employee.email && employee.email !== 'No Email' && (
                            <a 
                              href={`mailto:${employee.email}`}
                              className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline flex items-center gap-2"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </a>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(schedule)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-white p-3 text-center">
                <p className="text-sm font-medium text-gray-500">{day}</p>
              </div>
            ))}
            
            {weekDays.map(day => {
              const daySchedules = getSchedulesForDay(day);
              const isExpanded = expandedDay && isSameDay(expandedDay, day);
              const isTodayFlag = isToday(day);
              
              return (
                <div
                  key={day.toString()}
                  className={`min-h-40 bg-white p-2 ${isTodayFlag ? 'bg-blue-50' : ''} ${isExpanded ? 'bg-blue-100' : ''}`}
                >
                  <div 
                    className="flex items-center justify-between mb-2 cursor-pointer"
                    onClick={() => toggleDayExpansion(day)}
                  >
                    <span className={`text-sm font-medium ${isTodayFlag ? 'text-blue-600' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </span>
                    {daySchedules.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {daySchedules.length}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {daySchedules.slice(0, isExpanded ? 10 : 3).map(schedule => {
                      const employee = schedule.employee;
                      if (!employee) return null;
                      const phoneNumber = employee.contact?.replace(/\D/g, '');
                      
                      return (
                        <div
                          key={schedule.id}
                          className={`text-xs p-2 rounded cursor-pointer truncate ${
                            schedule.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                            schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                            'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => onView(schedule)}
                        >
                          <div className="font-medium truncate">{employee.name}</div>
                          <div className="text-xs opacity-75 truncate mt-1">
                            {employee.position}
                            {employee.designation && employee.designation !== employee.position && (
                              <span> • {employee.designation}</span>
                            )}
                          </div>
                          {phoneNumber && (
                            <div className="mt-1">
                              <a 
                                href={`tel:${phoneNumber}`}
                                className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone className="w-3 h-3" />
                                Call
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Show more/less indicator */}
                    {daySchedules.length > 3 && (
                      <div 
                        className="text-xs text-gray-500 text-center cursor-pointer hover:text-gray-700 hover:bg-gray-50 py-1 rounded"
                        onClick={() => toggleDayExpansion(day)}
                      >
                        {isExpanded ? 'Show less' : `+${daySchedules.length - 3} more`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const EmployeeStandbyScheduler = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [standbySchedules, setStandbySchedules] = useState<StandbySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<StandbySchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'schedules' | 'calendar'>('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [scheduleViewMode, setScheduleViewMode] = useState<'grid' | 'list'>('grid');
  const [backendAvailable, setBackendAvailable] = useState(true);
  
  // Schedule form
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [residence, setResidence] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<'scheduled' | 'active' | 'completed' | 'cancelled'>('scheduled');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [submitting, setSubmitting] = useState(false);

  // Enhanced fetch with designation
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test backend connectivity first
      try {
        const testResponse = await fetch(API_BASE_URL, {
          headers: { 'Accept': 'application/json' }
        });
        setBackendAvailable(testResponse.ok || testResponse.status === 404);
      } catch (testError) {
        console.log('⚠️ Backend test failed:', testError);
        setBackendAvailable(false);
      }

      // Fetch employees
      const employeesRes = await fetch(EMPLOYEES_API_URL, {
        headers: { 'Accept': 'application/json' }
      });

      if (!employeesRes.ok) {
        throw new Error(`HTTP ${employeesRes.status}: Failed to fetch employees`);
      }
      
      const employeesData = await employeesRes.json();
      
      if (!Array.isArray(employeesData)) {
        throw new Error('Invalid employees data format');
      }
      
      const transformedEmployees = employeesData.map(extractEmployeeData);
      setEmployees(transformedEmployees);

      // Try to fetch standby schedules if backend is available
      if (backendAvailable) {
        try {
          const standbyRes = await fetch(STANDBY_API_URL, {
            headers: { 'Accept': 'application/json' }
          });
          
          if (standbyRes.ok) {
            const standbyData = await standbyRes.json();
            const schedules = Array.isArray(standbyData) ? standbyData : [];
            
            // Enrich schedules with employee data
            const enrichedSchedules = schedules.map((schedule: any) => {
              const employeeId = String(schedule.employee_id);
              const employee = transformedEmployees.find(e => e.id === employeeId);
              
              return {
                ...schedule,
                employee_id: employeeId,
                employee: employee
              };
            });
            
            setStandbySchedules(enrichedSchedules);
          } else if (standbyRes.status !== 404) {
            console.log('⚠️ Standby schedules endpoint returned:', standbyRes.status);
          }
        } catch (standbyError) {
          console.log('⚠️ Could not fetch standby schedules:', standbyError);
        }
      } else {
        // If backend is not available, use mock data for demonstration
        console.log('⚠️ Using mock data for demonstration');
        const mockSchedules: StandbySchedule[] = [
          {
            id: 1,
            employee_id: transformedEmployees[0]?.id || '1',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            residence: 'Mine Site Residence A',
            status: 'active',
            priority: 'high',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            employee: transformedEmployees[0],
            duration_days: 7
          }
        ];
        setStandbySchedules(mockSchedules);
      }

      toast.success(`Loaded ${transformedEmployees.length} employees`);
      
    } catch (err: any) {
      console.error('❌ Error loading data:', err);
      setError(err.message);
      toast.error(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeSchedules = standbySchedules.filter(s => s.status === 'active').length;
    const upcomingSchedules = standbySchedules.filter(s => s.status === 'scheduled').length;
    const activeEmployeesOnStandby = new Set(
      standbySchedules
        .filter(s => s.status === 'active')
        .map(s => s.employee_id)
    ).size;
    const totalSchedules = standbySchedules.length;
    const fittersOnStandby = standbySchedules
      .filter(s => s.status === 'active' && s.employee?.position?.toLowerCase().includes('fitter'))
      .length;

    return {
      totalEmployees,
      activeSchedules,
      upcomingSchedules,
      activeEmployeesOnStandby,
      totalSchedules,
      fittersOnStandby
    };
  }, [employees, standbySchedules]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    let result = [...employees];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        (emp.designation && emp.designation.toLowerCase().includes(query)) ||
        emp.department.toLowerCase().includes(query) ||
        emp.contact.includes(query)
      );
    }
    
    if (selectedDepartment !== "all") {
      result = result.filter(emp => 
        emp.department.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }
    
    if (selectedPosition !== "all") {
      result = result.filter(emp => 
        emp.position.toLowerCase().includes(selectedPosition.toLowerCase()) ||
        (emp.designation && emp.designation.toLowerCase().includes(selectedPosition.toLowerCase()))
      );
    }
    
    return result;
  }, [employees, searchQuery, selectedDepartment, selectedPosition]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    let result = [...standbySchedules];
    
    if (selectedStatus !== "all") {
      result = result.filter(s => s.status === selectedStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(schedule => {
        const employee = schedule.employee;
        return employee?.name.toLowerCase().includes(query) ||
               employee?.position.toLowerCase().includes(query) ||
               (employee?.designation && employee.designation.toLowerCase().includes(query)) ||
               schedule.residence.toLowerCase().includes(query);
      });
    }
    
    return result;
  }, [standbySchedules, selectedStatus, searchQuery]);

  // Get departments
  const departments = useMemo(() => {
    const depts = employees.map(e => e.department).filter(Boolean);
    const unique = [...new Set(depts)];
    return ['All Departments', ...unique.sort()];
  }, [employees]);

  // Get positions with designations
  const positions = useMemo(() => {
    const allPositions = employees.map(e => e.position).filter(Boolean);
    const allDesignations = employees.map(e => e.designation).filter(Boolean);
    const combined = [...allPositions, ...allDesignations];
    const unique = [...new Set(combined)];
    return ['All Positions', ...unique.sort()];
  }, [employees]);

  // Get statuses
  const statuses = useMemo(() => {
    const stats = standbySchedules.map(s => s.status).filter(Boolean);
    const unique = [...new Set(stats)];
    return ['All Status', ...unique.sort()];
  }, [standbySchedules]);

  // Create schedule - FIXED: Handle API endpoint not available
  const handleCreateSchedule = async () => {
    if (!selectedEmployeeId || !startDate || !endDate || !residence.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (startDate > endDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setSubmitting(true);
      
      const scheduleData = {
        employee_id: selectedEmployeeId,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        residence: residence.trim(),
        status,
        priority,
        notes: notes.trim() || undefined
      };

      if (!backendAvailable) {
        // Mock response when backend is not available
        const mockSchedule: StandbySchedule = {
          id: Date.now(),
          ...scheduleData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          employee: employees.find(e => e.id === selectedEmployeeId),
          duration_days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        };
        
        toast.success('Standby schedule created successfully! (Demo Mode)');
        
        // Reset form
        setIsScheduleDialogOpen(false);
        setSelectedEmployeeId("");
        setStartDate(undefined);
        setEndDate(undefined);
        setResidence('');
        setNotes('');
        setStatus('scheduled');
        setPriority('medium');
        
        // Update schedules locally
        setStandbySchedules(prev => [mockSchedule, ...prev]);
        return;
      }

      // Try the POST endpoint
      let response;
      try {
        response = await fetch(STANDBY_API_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(scheduleData)
        });
      } catch (apiError) {
        console.log('⚠️ POST to /api/standby failed, trying alternative endpoint:', apiError);
        // Try alternative endpoint
        response = await fetch(`${STANDBY_API_URL}/create`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(scheduleData)
        });
      }

      if (!response.ok) {
        if (response.status === 404 || response.status === 405) {
          // If endpoint doesn't exist or doesn't accept POST, create locally
          console.log('⚠️ Standby API endpoint not available, creating schedule locally');
          const mockSchedule: StandbySchedule = {
            id: Date.now(),
            ...scheduleData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            employee: employees.find(e => e.id === selectedEmployeeId),
            duration_days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
          };
          
          toast.success('Standby schedule created locally (API endpoint not available)');
          
          // Reset form
          setIsScheduleDialogOpen(false);
          setSelectedEmployeeId("");
          setStartDate(undefined);
          setEndDate(undefined);
          setResidence('');
          setNotes('');
          setStatus('scheduled');
          setPriority('medium');
          
          // Update schedules locally
          setStandbySchedules(prev => [mockSchedule, ...prev]);
          return;
        }
        
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const employee = employees.find(e => e.id === selectedEmployeeId);
      
      const newSchedule = {
        ...result,
        employee,
        priority
      };
      
      toast.success('Standby schedule created successfully!');
      
      // Reset form
      setIsScheduleDialogOpen(false);
      setSelectedEmployeeId("");
      setStartDate(undefined);
      setEndDate(undefined);
      setResidence('');
      setNotes('');
      setStatus('scheduled');
      setPriority('medium');
      
      // Update schedules locally
      setStandbySchedules(prev => [newSchedule, ...prev]);
      
    } catch (err: any) {
      console.error('❌ Create error:', err);
      toast.error(err.message || 'Failed to create schedule');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete schedule - FIXED: Handle API endpoint not available
  const handleDeleteSchedule = async (id: number) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      if (backendAvailable) {
        try {
          const response = await fetch(`${STANDBY_API_URL}/${id}`, {
            method: 'DELETE'
          });

          if (!response.ok && response.status !== 404) {
            const errorText = await response.text();
            throw new Error(`Delete failed: ${response.status} - ${errorText}`);
          }
        } catch (deleteError) {
          console.log('⚠️ Delete API call failed, deleting locally:', deleteError);
        }
      }
      
      toast.success('Schedule deleted successfully');
      setStandbySchedules(prev => prev.filter(s => s.id !== id));
      
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete schedule');
    }
  };

  // View schedule details
  const handleViewSchedule = (schedule: StandbySchedule) => {
    setSelectedSchedule(schedule);
    setIsViewDialogOpen(true);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setSelectedPosition('all');
  };

  // Open schedule dialog
  const openScheduleDialog = () => {
    if (employees.length === 0) {
      toast.error('No employees available');
      return;
    }
    setIsScheduleDialogOpen(true);
  };

  // Export schedules
  const exportSchedules = () => {
    const data = filteredSchedules.map(schedule => ({
      Employee: schedule.employee?.name || 'Unknown',
      Position: schedule.employee?.position || 'Unknown',
      Designation: schedule.employee?.designation || 'N/A',
      'Start Date': formatDate(schedule.start_date),
      'End Date': formatDate(schedule.end_date),
      Residence: schedule.residence,
      Status: schedule.status,
      Priority: schedule.priority,
      Notes: schedule.notes || ''
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `standby-schedules-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Schedules exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TooltipProvider>
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-white shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Standby Management System</h1>
                  <p className="text-sm text-gray-600">Manage employee standby assignments and rotations</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!backendAvailable && (
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Demo Mode
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  className="hidden sm:flex"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={openScheduleDialog} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6 animate-in fade-in duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Demo Mode Alert */}
          {!backendAvailable && (
            <Alert variant="warning" className="mb-6 animate-in fade-in duration-300">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Demo Mode Active</AlertTitle>
              <AlertDescription>
                Standby schedules are being managed locally. To enable full API integration, ensure the backend server is running at {API_BASE_URL}
              </AlertDescription>
            </Alert>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="flex-wrap bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Dash</span>
                </TabsTrigger>
                <TabsTrigger value="employees" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Employees</span>
                  <span className="sm:hidden">Emps</span>
                  <Badge variant="secondary" className="ml-2 hidden sm:flex">{employees.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="schedules" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden sm:inline">Schedules</span>
                  <span className="sm:hidden">Sched</span>
                  <Badge variant="secondary" className="ml-2 hidden sm:flex">{standbySchedules.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <CalendarViewIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendar</span>
                  <span className="sm:hidden">Cal</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={
                      activeTab === 'dashboard' ? 'Search...' :
                      activeTab === 'employees' ? 'Search employees...' :
                      'Search schedules...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white shadow-sm"
                  />
                </div>
                
                {activeTab === 'employees' ? (
                  <>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-white shadow-sm">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept === 'All Departments' ? 'all' : dept.toLowerCase()}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-white shadow-sm">
                        <User className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(pos => (
                          <SelectItem key={pos} value={pos === 'All Positions' ? 'all' : pos.toLowerCase()}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : activeTab === 'schedules' ? (
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[140px] bg-white shadow-sm">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(st => (
                        <SelectItem key={st} value={st === 'All Status' ? 'all' : st.toLowerCase()}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}
                
                {(searchQuery || selectedDepartment !== 'all' || selectedStatus !== 'all' || selectedPosition !== 'all') && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="sm:flex border shadow-sm">
                    <FilterX className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Clear</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="mt-0 space-y-6 animate-in fade-in duration-300">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Employees"
                  value={dashboardStats.totalEmployees}
                  icon={Users}
                  color="bg-blue-600"
                  onClick={() => setActiveTab('employees')}
                  description={`${employees.filter(e => e.is_active).length} active`}
                />
                <StatsCard
                  title="Active Standby"
                  value={dashboardStats.activeSchedules}
                  icon={ShieldCheck}
                  color="bg-green-600"
                  onClick={() => {
                    setActiveTab('schedules');
                    setSelectedStatus('active');
                  }}
                  description={`${dashboardStats.fittersOnStandby} fitters active`}
                />
                <StatsCard
                  title="Fitters on Standby"
                  value={dashboardStats.fittersOnStandby}
                  icon={Wrench}
                  color="bg-orange-600"
                  description="Class 1 Fitters currently on standby"
                />
                <StatsCard
                  title="Total Schedules"
                  value={dashboardStats.totalSchedules}
                  icon={CalendarDays}
                  color="bg-purple-600"
                  onClick={() => setActiveTab('schedules')}
                  description={`${dashboardStats.upcomingSchedules} upcoming`}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Standby Overview */}
                <div className="lg:col-span-2">
                  <StandbyOverview schedules={standbySchedules} />
                </div>

                {/* Quick Actions */}
                <Card className="h-fit border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        onClick={openScheduleDialog}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Schedule
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('employees')}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View All Employees
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={exportSchedules}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Schedules
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('calendar')}
                      >
                        <CalendarViewIcon className="w-4 h-4 mr-2" />
                        View Calendar
                      </Button>
                      <Separator />
                      <div className="pt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Need Help?</p>
                        <p className="text-xs text-gray-600">
                          {backendAvailable 
                            ? 'Contact IT Support if you encounter issues with the system'
                            : 'Running in demo mode. To enable API features, ensure backend is running.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Employees Tab */}
            <TabsContent value="employees" className="mt-0 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Employee Directory</h2>
                  <p className="text-sm text-gray-600">
                    {filteredEmployees.length} of {employees.length} employees
                    {selectedPosition !== 'all' && ` • Filtered by: ${selectedPosition}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {filteredEmployees.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredEmployees.map(employee => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onSchedule={(emp) => {
                          setSelectedEmployeeId(emp.id);
                          setResidence(emp.location || '');
                          const today = new Date();
                          const nextMonday = addDays(today, (1 - today.getDay() + 7) % 7 || 7);
                          const nextFriday = addDays(nextMonday, 4);
                          setStartDate(nextMonday);
                          setEndDate(nextFriday);
                          setIsScheduleDialogOpen(true);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEmployees.map(employee => {
                      const phoneNumber = employee.contact?.replace(/\D/g, '');
                      
                      return (
                        <Card key={employee.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="text-sm">
                                    {getInitials(employee.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-medium text-gray-900">{employee.name}</p>
                                    {employee.is_active ? (
                                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    ) : (
                                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="text-xs">
                                      {employee.position}
                                    </Badge>
                                    {employee.designation && employee.designation !== employee.position && (
                                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        {employee.designation}
                                      </Badge>
                                    )}
                                    <Badge className={`text-xs ${getAvailabilityColor(employee.availability || 'available')}`}>
                                      {employee.availability?.replace('-', ' ') || 'available'}
                                    </Badge>
                                    <span className="text-xs text-gray-600">{employee.department}</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    {phoneNumber && (
                                      <a 
                                        href={`tel:${phoneNumber}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <Phone className="w-3 h-3" />
                                        {formatPhoneNumber(employee.contact)}
                                      </a>
                                    )}
                                    {employee.email && employee.email !== 'No Email' && (
                                      <a 
                                        href={`mailto:${employee.email}`}
                                        className="text-emerald-600 hover:text-emerald-800 hover:underline flex items-center gap-1"
                                      >
                                        <Mail className="w-3 h-3" />
                                        {employee.email}
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedEmployeeId(employee.id);
                                  setResidence(employee.location || '');
                                  const today = new Date();
                                  const nextMonday = addDays(today, (1 - today.getDay() + 7) % 7 || 7);
                                  const nextFriday = addDays(nextMonday, 4);
                                  setStartDate(nextMonday);
                                  setEndDate(nextFriday);
                                  setIsScheduleDialogOpen(true);
                                }}
                              >
                                Schedule Standby
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )
              ) : (
                <Card className="border shadow-sm">
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Employees Found</h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search or filters
                    </p>
                    <Button onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Schedules Tab */}
            <TabsContent value="schedules" className="mt-0 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Standby Schedules</h2>
                  <p className="text-sm text-gray-600">
                    {filteredSchedules.length} of {standbySchedules.length} schedules
                    {selectedStatus !== 'all' && ` • Filtered by: ${selectedStatus}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={scheduleViewMode === 'grid' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setScheduleViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={scheduleViewMode === 'list' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setScheduleViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportSchedules} className="hidden sm:flex">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={openScheduleDialog} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Schedule
                  </Button>
                </div>
              </div>

              {filteredSchedules.length > 0 ? (
                scheduleViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSchedules.map(schedule => {
                      const employee = schedule.employee;
                      if (!employee) return null;
                      
                      return (
                        <Card key={schedule.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                          <div className={`h-2 ${schedule.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}></div>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="text-sm font-semibold">
                                    {getInitials(employee.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {employee.position}
                                    </Badge>
                                    {employee.designation && employee.designation !== employee.position && (
                                      <Badge variant="outline" className="text-xs">
                                        {employee.designation}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Badge className={getStatusBadgeColor(schedule.status)}>
                                {schedule.status}
                              </Badge>
                            </div>

                            <div className="space-y-4">
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Start Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{formatDate(schedule.start_date)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">End Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{formatDate(schedule.end_date)}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Residence Location
                                </p>
                                <p className="text-sm text-gray-600">{schedule.residence}</p>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewSchedule(schedule)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Badge className={getPriorityColor(schedule.priority || 'medium')}>
                                  {schedule.priority}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSchedules.map(schedule => {
                      const employee = schedule.employee;
                      if (!employee) return null;
                      const phoneNumber = employee.contact?.replace(/\D/g, '');
                      
                      return (
                        <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="text-sm font-semibold">
                                    {getInitials(employee.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                                    <Badge className={getStatusBadgeColor(schedule.status)}>
                                      {schedule.status}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="text-xs">
                                      {employee.position}
                                    </Badge>
                                    {employee.designation && employee.designation !== employee.position && (
                                      <Badge variant="outline" className="text-xs">
                                        {employee.designation}
                                      </Badge>
                                    )}
                                    <span className="text-sm text-gray-600">{employee.department}</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Period</p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Residence</p>
                                      <p className="text-sm font-medium text-gray-900">{schedule.residence}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Contact</p>
                                      {phoneNumber ? (
                                        <a 
                                          href={`tel:${phoneNumber}`}
                                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                          {formatPhoneNumber(employee.contact)}
                                        </a>
                                      ) : (
                                        <p className="text-sm font-medium text-gray-900">No Contact</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:items-end gap-2">
                                <Badge className={getPriorityColor(schedule.priority || 'medium')}>
                                  Priority: {schedule.priority}
                                </Badge>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewSchedule(schedule)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )
              ) : (
                <Card className="border shadow-sm">
                  <CardContent className="py-12 text-center">
                    <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Schedules Found</h3>
                    <p className="text-gray-500 mb-6">
                      {standbySchedules.length === 0 
                        ? 'Create your first standby schedule' 
                        : 'Try adjusting your search or filters'}
                    </p>
                    <Button onClick={openScheduleDialog} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Schedule
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="mt-0 animate-in fade-in duration-300">
              <CalendarView
                schedules={standbySchedules}
                onView={handleViewSchedule}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Create Schedule Dialog */}
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">Create Standby Schedule</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsScheduleDialogOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription>
                Assign a standby duty to an employee
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Employee Selection */}
              <EmployeeSelect
                employees={employees}
                selectedEmployeeId={selectedEmployeeId}
                onSelect={setSelectedEmployeeId}
                label="Employee"
                placeholder="Select an employee..."
              />

              {selectedEmployeeId && (
                <>
                  <Separator />
                  
                  {/* Employee Details Preview */}
                  {(() => {
                    const employee = employees.find(e => e.id === selectedEmployeeId);
                    if (!employee) return null;
                    const phoneNumber = employee.contact?.replace(/\D/g, '');
                    
                    return (
                      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(employee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  {employee.position}
                                </Badge>
                                {employee.designation && employee.designation !== employee.position && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {employee.designation}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {employee.department}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Contact</p>
                              {phoneNumber ? (
                                <a 
                                  href={`tel:${phoneNumber}`}
                                  className="font-medium truncate text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {formatPhoneNumber(employee.contact)}
                                </a>
                              ) : (
                                <p className="font-medium truncate">No Contact</p>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-600">Email</p>
                              {employee.email !== 'No Email' ? (
                                <a 
                                  href={`mailto:${employee.email}`}
                                  className="font-medium truncate text-emerald-600 hover:text-emerald-800 hover:underline"
                                >
                                  {employee.email}
                                </a>
                              ) : (
                                <p className="font-medium truncate">{employee.email}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}

                  {/* Schedule Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled={!startDate}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            disabled={startDate ? (date) => date < startDate : undefined}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Residence */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Residence Location *</Label>
                    <Input
                      placeholder="Where will the employee stay during standby?"
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                    />
                  </div>

                  {/* Status and Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Priority</Label>
                      <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Notes (Optional)</Label>
                    <Textarea
                      placeholder="Additional notes or instructions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
              <div className="flex w-full justify-between sm:justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsScheduleDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSchedule}
                  disabled={submitting || !selectedEmployeeId || !startDate || !endDate || !residence.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Schedule
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Schedule Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            {selectedSchedule && selectedSchedule.employee && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg font-semibold">Schedule Details</DialogTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsViewDialogOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogDescription>
                    Standby assignment for {selectedSchedule.employee.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getInitials(selectedSchedule.employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedSchedule.employee.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          {getPositionIcon(selectedSchedule.employee.position)}
                          {selectedSchedule.employee.position}
                          {selectedSchedule.employee.designation && selectedSchedule.employee.designation !== selectedSchedule.employee.position && (
                            <span className="ml-1 text-blue-600">• {selectedSchedule.employee.designation}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusBadgeColor(selectedSchedule.status)}>
                      {selectedSchedule.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Start Date</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(selectedSchedule.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">End Date</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(selectedSchedule.end_date)}</p>
                        </div>
                      </div>
                      {selectedSchedule.duration_days && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {selectedSchedule.duration_days} days total
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Residence Location</p>
                      <p className="text-sm text-gray-600">{selectedSchedule.residence}</p>
                    </div>

                    {selectedSchedule.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                        <p className="text-sm text-gray-600">{selectedSchedule.notes}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Employee Contact</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <a 
                            href={`tel:${selectedSchedule.employee.contact.replace(/\D/g, '')}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {formatPhoneNumber(selectedSchedule.employee.contact)}
                          </a>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-emerald-500" />
                          {selectedSchedule.employee.email !== 'No Email' ? (
                            <a 
                              href={`mailto:${selectedSchedule.employee.email}`}
                              className="text-emerald-600 hover:text-emerald-800 hover:underline"
                            >
                              {selectedSchedule.employee.email}
                            </a>
                          ) : (
                            <span>{selectedSchedule.employee.email}</span>
                          )}
                        </div>
                        {selectedSchedule.employee.emergency_contact && (
                          <div className="flex items-center gap-3 text-sm">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span>Emergency: {formatPhoneNumber(selectedSchedule.employee.emergency_contact)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2">
                      <Badge className={getPriorityColor(selectedSchedule.priority || 'medium')}>
                        Priority: {selectedSchedule.priority}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        Created: {formatDateTime(selectedSchedule.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
                  <div className="flex w-full justify-between sm:justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsViewDialogOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        handleDeleteSchedule(selectedSchedule.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className="mt-12 border-t bg-white shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Standby Management System v2.0</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span>{employees.length} employees</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{standbySchedules.length} schedules</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{dashboardStats.activeSchedules} active</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={fetchData}
                  className="hidden sm:flex"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={openScheduleDialog}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </TooltipProvider>
    </div>
  );
};

export default EmployeeStandbyScheduler;