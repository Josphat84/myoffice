'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, isToday, parseISO, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks } from 'date-fns';
import { useTheme } from 'next-themes';

// shadcn/ui components
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Icons
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
  Trash2,
  Save,
  User,
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
  Grid,
  List,
  CalendarDays as CalendarViewIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  FilterX,
  TrendingUp as TrendingUpIcon,
  UserCog,
  Target,
  Zap,
  Download,
  Activity,
  AlertTriangle,
  Zap as ZapIcon,
  Flame,
  X as XIcon,
  MoreVertical,
  Sun,
  Moon,
} from 'lucide-react';

// ---------- API Configuration ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const EMPLOYEES_API_URL = `${API_BASE_URL}/api/employees`;
const STANDBY_API_URL = `${API_BASE_URL}/api/standby`;

// ---------- Types ----------
interface Employee {
  id: string;
  name: string;
  position: string;
  designation?: string;
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

// ---------- Utility Functions ----------
const getStatusBadgeColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "scheduled": return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "active": return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "completed": return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    case "cancelled": return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default: return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "critical": return "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    case "high": return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
    case "low": return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    default: return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  }
};

const getAvailabilityColor = (availability: string) => {
  switch (availability?.toLowerCase()) {
    case "available": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "busy": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
    case "vacation": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
    case "off-duty": return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    case "on-standby": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
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

  const position = data.position || data.job_title || data.Position || data.JobTitle || 'Position';
  const designation = data.designation || data.Designation || position;

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

// ---------- Custom Icons ----------
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

// ---------- Form Schema ----------
const scheduleFormSchema = z.object({
  employeeId: z.string().min(1, 'Please select an employee'),
  startDate: z.date().refine(val => val !== undefined, { message: 'Start date is required' }),
  endDate: z.date().refine(val => val !== undefined, { message: 'End date is required' }),
  residence: z.string().min(1, 'Residence is required'),
  status: z.enum(['scheduled', 'active', 'completed', 'cancelled']).default('scheduled'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  notes: z.string().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

// Form input type (raw values, with optional fields for those with defaults)
type ScheduleFormInput = z.input<typeof scheduleFormSchema>;
// Validated output type (all fields required after validation)
type ScheduleFormOutput = z.infer<typeof scheduleFormSchema>;

// ---------- Theme Toggle ----------
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

// ---------- Stats Card ----------
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
    className={`group hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-primary' : ''}`}
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-foreground">{value}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
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

// ---------- Employee Card ----------
const EmployeeCard = ({ employee, onSchedule }: { employee: Employee; onSchedule: (emp: Employee) => void }) => {
  const avatarColor = generateAvatarColor(employee.id);
  const phoneNumber = employee.contact?.replace(/\D/g, '');

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden border hover:border-primary/50 h-full flex flex-col">
      <CardContent className="p-6 flex-1">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <Avatar className={`h-12 w-12 ring-2 ring-primary/10 ${avatarColor}`}>
              <AvatarFallback className="text-sm font-semibold">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <h3 className="font-semibold text-foreground cursor-help">{employee.name}</h3>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.position}{employee.designation && ` • ${employee.designation}`}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {phoneNumber ? (
                          <a href={`tel:${phoneNumber}`} className="hover:underline text-primary">{formatPhoneNumber(employee.contact)}</a>
                        ) : <span>No contact</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {employee.email !== 'No Email' ? (
                          <a href={`mailto:${employee.email}`} className="hover:underline text-primary">{employee.email}</a>
                        ) : <span>No email</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.location}</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{employee.position}</Badge>
                {employee.designation && employee.designation !== employee.position && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{employee.designation}</Badge>
                )}
                {employee.is_active ? (
                  <div className="w-2 h-2 rounded-full bg-green-500" title="Active" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-400" title="Inactive" />
                )}
              </div>

              <div className="flex gap-2 mt-2">
                {employee.availability && (
                  <Badge className={`text-xs ${getAvailabilityColor(employee.availability)}`}>
                    {employee.availability.replace('-', ' ')}
                  </Badge>
                )}
                {employee.experience_years && employee.experience_years > 0 && (
                  <Badge variant="outline" className="text-xs">{employee.experience_years}y exp</Badge>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSchedule(employee)}>
                <CalendarDays className="h-4 w-4 mr-2" /> Schedule Standby
              </DropdownMenuItem>
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Send Notification</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3 mb-5">
          {phoneNumber && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <PhoneCall className="w-4 h-4 text-primary flex-shrink-0" />
              <a href={`tel:${phoneNumber}`} className="hover:underline text-primary font-medium">{formatPhoneNumber(employee.contact)}</a>
            </div>
          )}
          {employee.email !== 'No Email' && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MailIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <a href={`mailto:${employee.email}`} className="hover:underline text-emerald-600 dark:text-emerald-400 font-medium">{employee.email}</a>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Navigation className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="truncate">{employee.location}</span>
          </div>
        </div>
      </CardContent>

      <div className="p-6 pt-0 mt-auto">
        <Button className="w-full" onClick={() => onSchedule(employee)} size="sm">
          <CalendarDays className="w-4 h-4 mr-2" />
          Schedule Standby
        </Button>
      </div>
    </Card>
  );
};

// ---------- Employee Select (Command) ----------
const EmployeeSelect = ({ employees, selectedEmployeeId, onSelect, label, placeholder }: {
  employees: Employee[];
  selectedEmployeeId: string;
  onSelect: (id: string) => void;
  label: string;
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;
    const q = search.toLowerCase();
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      (emp.designation && emp.designation.toLowerCase().includes(q))
    );
  }, [employees, search]);

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  return (
    <div className="space-y-2">
      <Label>{label} *</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {selectedEmployee ? (
              <div className="flex items-center gap-2 truncate">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{getInitials(selectedEmployee.name)}</AvatarFallback>
                </Avatar>
                <div className="text-left truncate">
                  <div className="truncate font-medium">{selectedEmployee.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {selectedEmployee.position}
                    {selectedEmployee.designation && selectedEmployee.designation !== selectedEmployee.position && (
                      <> • {selectedEmployee.designation}</>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search employee..." value={search} onValueChange={setSearch} />
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {filteredEmployees.map(emp => (
                <CommandItem
                  key={emp.id}
                  value={emp.name}
                  onSelect={() => {
                    onSelect(emp.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{getInitials(emp.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.position}</p>
                  </div>
                  {emp.id === selectedEmployeeId && <Checkbox checked />}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// ---------- Schedule Card ----------
const ScheduleCard = ({ schedule, onView, onDelete }: {
  schedule: StandbySchedule;
  onView: (s: StandbySchedule) => void;
  onDelete: (id: number) => void;
}) => {
  const employee = schedule.employee;
  if (!employee) return null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className={`h-2 ${schedule.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm font-semibold">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{employee.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{employee.position}</Badge>
                {employee.designation && employee.designation !== employee.position && (
                  <Badge variant="outline" className="text-xs">{employee.designation}</Badge>
                )}
              </div>
            </div>
          </div>
          <Badge className={getStatusBadgeColor(schedule.status)}>{schedule.status}</Badge>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Start</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(schedule.start_date)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">End</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(schedule.end_date)}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Residence
            </p>
            <p className="text-sm text-foreground">{schedule.residence}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(schedule)}>
                <Eye className="w-4 h-4 mr-2" /> View
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(schedule.id)}>
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
};

// ---------- Main Component ----------
const EmployeeStandbyScheduler = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [standbySchedules, setStandbySchedules] = useState<StandbySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<StandbySchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'schedules' | 'calendar'>('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [scheduleViewMode, setScheduleViewMode] = useState<'grid' | 'list'>('grid');
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // ---------- Form ----------
  const form = useForm<ScheduleFormInput>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      employeeId: '',
      startDate: undefined,
      endDate: undefined,
      residence: '',
      status: 'scheduled',
      priority: 'medium',
      notes: '',
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isScheduleDialogOpen) {
      form.reset({
        employeeId: '',
        startDate: undefined,
        endDate: undefined,
        residence: '',
        status: 'scheduled',
        priority: 'medium',
        notes: '',
      });
    }
  }, [isScheduleDialogOpen, form]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test backend connectivity
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

      // Try to fetch standby schedules
      if (backendAvailable) {
        try {
          const standbyRes = await fetch(STANDBY_API_URL, {
            headers: { 'Accept': 'application/json' }
          });
          
          if (standbyRes.ok) {
            const standbyData = await standbyRes.json();
            const schedules = Array.isArray(standbyData) ? standbyData : [];
            
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
        // Mock data for demo
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

  // Dashboard stats
  const dashboardStats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeSchedules = standbySchedules.filter(s => s.status === 'active').length;
    const upcomingSchedules = standbySchedules.filter(s => s.status === 'scheduled').length;
    const fittersOnStandby = standbySchedules
      .filter(s => s.status === 'active' && s.employee?.position?.toLowerCase().includes('fitter'))
      .length;
    return { totalEmployees, activeSchedules, upcomingSchedules, fittersOnStandby, totalSchedules: standbySchedules.length };
  }, [employees, standbySchedules]);

  // Filtered employees
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

  // Filtered schedules
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

    if (dateRange.from) {
      result = result.filter(s => new Date(s.start_date) >= dateRange.from!);
    }
    if (dateRange.to) {
      result = result.filter(s => new Date(s.end_date) <= dateRange.to!);
    }
    
    return result;
  }, [standbySchedules, selectedStatus, searchQuery, dateRange]);

  // Departments list
  const departments = useMemo(() => {
    const depts = employees.map(e => e.department).filter(Boolean);
    const unique = [...new Set(depts)];
    return ['All Departments', ...unique.sort()];
  }, [employees]);

  // Positions list
  const positions = useMemo(() => {
    const allPositions = employees.map(e => e.position).filter(Boolean);
    const allDesignations = employees.map(e => e.designation).filter(Boolean);
    const combined = [...allPositions, ...allDesignations];
    const unique = [...new Set(combined)];
    return ['All Positions', ...unique.sort()];
  }, [employees]);

  // Statuses list
  const statuses = useMemo(() => {
    const stats = standbySchedules.map(s => s.status).filter(Boolean);
    const unique = [...new Set(stats)];
    return ['All Status', ...unique.sort()];
  }, [standbySchedules]);

  // Create schedule handler
  const handleCreateSchedule = async (values: ScheduleFormOutput) => {
    if (!values.employeeId || !values.startDate || !values.endDate || !values.residence.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const scheduleData = {
        employee_id: parseInt(values.employeeId, 10),
        start_date: format(values.startDate, 'yyyy-MM-dd'),
        end_date: format(values.endDate, 'yyyy-MM-dd'),
        residence: values.residence.trim(),
        status: values.status,
        priority: values.priority,
        notes: values.notes?.trim() || undefined,
      };

      if (!backendAvailable) {
        // Mock response
        const mockSchedule: StandbySchedule = {
          id: Date.now(),
          ...scheduleData,
          employee_id: values.employeeId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          employee: employees.find(e => e.id === values.employeeId),
          duration_days: Math.ceil((values.endDate.getTime() - values.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        };
        toast.success('Standby schedule created successfully! (Demo Mode)');
        setIsScheduleDialogOpen(false);
        setStandbySchedules(prev => [mockSchedule, ...prev]);
        return;
      }

      // Real API call
      let response;
      try {
        response = await fetch(STANDBY_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(scheduleData),
        });
      } catch (apiError) {
        // Try alternative endpoint
        response = await fetch(`${STANDBY_API_URL}/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(scheduleData),
        });
      }

      if (!response.ok) {
        if (response.status === 404 || response.status === 405) {
          // Create locally
          const mockSchedule: StandbySchedule = {
            id: Date.now(),
            ...scheduleData,
            employee_id: values.employeeId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            employee: employees.find(e => e.id === values.employeeId),
            duration_days: Math.ceil((values.endDate.getTime() - values.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
          };
          toast.success('Standby schedule created locally');
          setIsScheduleDialogOpen(false);
          setStandbySchedules(prev => [mockSchedule, ...prev]);
          return;
        }
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const employee = employees.find(e => e.id === values.employeeId);
      const newSchedule = { ...result, employee };

      toast.success('Standby schedule created successfully!');
      setIsScheduleDialogOpen(false);
      setStandbySchedules(prev => [newSchedule, ...prev]);
    } catch (err: any) {
      console.error('❌ Create error:', err);
      toast.error(err.message || 'Failed to create schedule');
    }
  };

  // Delete schedule
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
      setSelectedScheduleIds(prev => prev.filter(sid => sid !== id));
      
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete schedule');
    }
  };

  // View schedule
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
    setDateRange({ from: undefined, to: undefined });
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

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedScheduleIds.length === 0) return;
    if (!confirm(`Delete ${selectedScheduleIds.length} schedule(s)?`)) return;
    try {
      // In a real app, you'd send a batch delete request
      // For demo, we delete locally
      setStandbySchedules(prev => prev.filter(s => !selectedScheduleIds.includes(s.id)));
      setSelectedScheduleIds([]);
      setSelectAll(false);
      toast.success(`Deleted ${selectedScheduleIds.length} schedule(s)`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Bulk select toggle
  useEffect(() => {
    if (selectAll) {
      setSelectedScheduleIds(filteredSchedules.map(s => s.id));
    } else {
      setSelectedScheduleIds([]);
    }
  }, [selectAll, filteredSchedules]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-primary/60 rounded-lg shadow">
                  <ShieldCheck className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Standby Management System</h1>
                  <p className="text-sm text-muted-foreground">Manage employee standby assignments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {!backendAvailable && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Demo Mode
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={fetchData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={() => setIsScheduleDialogOpen(true)} size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="flex-wrap bg-muted p-1 rounded-lg">
                <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-background">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="employees" className="gap-2 data-[state=active]:bg-background">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Employees</span>
                  <Badge variant="secondary" className="ml-2 hidden sm:flex">{employees.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="schedules" className="gap-2 data-[state=active]:bg-background">
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden sm:inline">Schedules</span>
                  <Badge variant="secondary" className="ml-2 hidden sm:flex">{standbySchedules.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-background">
                  <CalendarViewIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
              </TabsList>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={
                      activeTab === 'dashboard' ? 'Search...' :
                      activeTab === 'employees' ? 'Search employees...' : 'Search schedules...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>

                {activeTab === 'employees' ? (
                  <>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-background">
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
                      <SelectTrigger className="w-full sm:w-[180px] bg-background">
                        <User className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(pos => (
                          <SelectItem key={pos} value={pos === 'All Positions' ? 'all' : (pos || '').toLowerCase()}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : activeTab === 'schedules' ? (
                  <>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full sm:w-[140px] bg-background">
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
                    {/* Date range picker – fixed onSelect */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, 'LLL dd')} - {format(dateRange.to, 'LLL dd')}
                              </>
                            ) : (
                              format(dateRange.from, 'LLL dd')
                            )
                          ) : (
                            'Date range'
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => {
                            setDateRange(range 
                              ? { from: range.from, to: range.to } 
                              : { from: undefined, to: undefined }
                            );
                          }}
                          initialFocus
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </>
                ) : null}

                {(searchQuery || selectedDepartment !== 'all' || selectedStatus !== 'all' || selectedPosition !== 'all' || dateRange.from) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <FilterX className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Clear</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="mt-0 space-y-6 animate-in fade-in duration-300">
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
                  onClick={() => { setActiveTab('schedules'); setSelectedStatus('active'); }}
                  description={`${dashboardStats.fittersOnStandby} fitters`}
                />
                <StatsCard
                  title="Upcoming"
                  value={dashboardStats.upcomingSchedules}
                  icon={CalendarClock}
                  color="bg-orange-600"
                  description="Scheduled standby"
                />
                <StatsCard
                  title="Total Schedules"
                  value={dashboardStats.totalSchedules}
                  icon={CalendarDays}
                  color="bg-purple-600"
                  onClick={() => setActiveTab('schedules')}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Standby Overview (placeholder) */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Standby Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full justify-start" onClick={() => setIsScheduleDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Schedule
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('employees')}>
                        <Users className="w-4 h-4 mr-2" />
                        View All Employees
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={exportSchedules}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Schedules
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('calendar')}>
                        <CalendarViewIcon className="w-4 h-4 mr-2" />
                        View Calendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Employees Tab */}
            <TabsContent value="employees" className="mt-0 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Employee Directory</h2>
                  <p className="text-sm text-muted-foreground">{filteredEmployees.length} of {employees.length} employees</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={viewMode === 'grid' ? 'secondary' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'secondary' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {filteredEmployees.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredEmployees.map(emp => (
                      <EmployeeCard key={emp.id} employee={emp} onSchedule={(emp) => {
                        form.setValue('employeeId', emp.id);
                        form.setValue('residence', emp.location || '');
                        const today = new Date();
                        const nextMonday = addDays(today, (1 - today.getDay() + 7) % 7 || 7);
                        const nextFriday = addDays(nextMonday, 4);
                        form.setValue('startDate', nextMonday);
                        form.setValue('endDate', nextFriday);
                        setIsScheduleDialogOpen(true);
                      }} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEmployees.map(employee => (
                      <Card key={employee.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium">{employee.name}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="secondary">{employee.position}</Badge>
                                  {employee.designation && <Badge variant="outline">{employee.designation}</Badge>}
                                </div>
                              </div>
                            </div>
                            <Button size="sm" onClick={() => {
                              form.setValue('employeeId', employee.id);
                              form.setValue('residence', employee.location || '');
                              const today = new Date();
                              const nextMonday = addDays(today, (1 - today.getDay() + 7) % 7 || 7);
                              const nextFriday = addDays(nextMonday, 4);
                              form.setValue('startDate', nextMonday);
                              form.setValue('endDate', nextFriday);
                              setIsScheduleDialogOpen(true);
                            }}>
                              Schedule
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Employees Found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Schedules Tab */}
            <TabsContent value="schedules" className="mt-0 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Standby Schedules</h2>
                  <p className="text-sm text-muted-foreground">{filteredSchedules.length} schedules</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedScheduleIds.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete ({selectedScheduleIds.length})
                    </Button>
                  )}
                  <Button variant={scheduleViewMode === 'grid' ? 'secondary' : 'outline'} size="sm" onClick={() => setScheduleViewMode('grid')}>
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant={scheduleViewMode === 'list' ? 'secondary' : 'outline'} size="sm" onClick={() => setScheduleViewMode('list')}>
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportSchedules}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={() => setIsScheduleDialogOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
              </div>

              {filteredSchedules.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <Checkbox
                      id="selectAll"
                      checked={selectAll}
                      onCheckedChange={(checked) => setSelectAll(!!checked)}
                    />
                    <Label htmlFor="selectAll" className="text-sm cursor-pointer">Select all</Label>
                  </div>

                  {scheduleViewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSchedules.map(schedule => (
                        <div key={schedule.id} className="relative">
                          <Checkbox
                            className="absolute top-2 left-2 z-10"
                            checked={selectedScheduleIds.includes(schedule.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedScheduleIds(prev => [...prev, schedule.id]);
                              } else {
                                setSelectedScheduleIds(prev => prev.filter(id => id !== schedule.id));
                              }
                            }}
                          />
                          <ScheduleCard schedule={schedule} onView={handleViewSchedule} onDelete={handleDeleteSchedule} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredSchedules.map(schedule => (
                        <Card key={schedule.id} className="relative">
                          <Checkbox
                            className="absolute top-4 left-4 z-10"
                            checked={selectedScheduleIds.includes(schedule.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedScheduleIds(prev => [...prev, schedule.id]);
                              } else {
                                setSelectedScheduleIds(prev => prev.filter(id => id !== schedule.id));
                              }
                            }}
                          />
                          <CardContent className="p-6 pl-12">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{schedule.employee?.name}</h3>
                                <p className="text-sm text-muted-foreground">{schedule.employee?.position}</p>
                                <p className="text-sm mt-2">{formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}</p>
                                <p className="text-sm">{schedule.residence}</p>
                              </div>
                              <Badge className={getStatusBadgeColor(schedule.status)}>{schedule.status}</Badge>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" size="sm" onClick={() => handleViewSchedule(schedule)}>View</Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteSchedule(schedule.id)}>Delete</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Schedules Found</h3>
                    <p className="text-muted-foreground mb-6">Create your first standby schedule</p>
                    <Button onClick={() => setIsScheduleDialogOpen(true)}>Create Schedule</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardContent className="py-12 text-center">
                  <CalendarViewIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">Calendar View</h3>
                  <p className="text-muted-foreground">Coming soon with month/week/day views</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Create Schedule Dialog – fixed onSubmit with type assertion */}
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Standby Schedule</DialogTitle>
              <DialogDescription>Assign standby duty to an employee</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit((values) => handleCreateSchedule(values as ScheduleFormOutput))} 
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee *</FormLabel>
                      <FormControl>
                        <EmployeeSelect
                          employees={employees}
                          selectedEmployeeId={field.value}
                          onSelect={field.onChange}
                          label=""
                          placeholder="Select employee..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('employeeId') && (
                  <>
                    <Separator />
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium">Selected Employee</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {employees.find(e => e.id === form.watch('employeeId'))?.name}
                      </p>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, 'PPP') : 'Select date'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, 'PPP') : 'Select date'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date < (form.getValues('startDate') || new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="residence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residence *</FormLabel>
                      <FormControl>
                        <Input placeholder="Where will the employee stay?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Schedule</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Schedule Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedSchedule && selectedSchedule.employee && (
              <>
                <DialogHeader>
                  <DialogTitle>Schedule Details</DialogTitle>
                  <DialogDescription>
                    Standby assignment for {selectedSchedule.employee.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(selectedSchedule.employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedSchedule.employee.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedSchedule.employee.position}
                          {selectedSchedule.employee.designation && ` • ${selectedSchedule.employee.designation}`}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusBadgeColor(selectedSchedule.status)}>
                      {selectedSchedule.status}
                    </Badge>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Start</p>
                        <p className="text-sm font-semibold">{formatDate(selectedSchedule.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">End</p>
                        <p className="text-sm font-semibold">{formatDate(selectedSchedule.end_date)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Residence</p>
                    <p className="text-sm text-muted-foreground">{selectedSchedule.residence}</p>
                  </div>

                  {selectedSchedule.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedSchedule.notes}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Contact</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${selectedSchedule.employee.contact.replace(/\D/g, '')}`} className="hover:underline">
                          {formatPhoneNumber(selectedSchedule.employee.contact)}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${selectedSchedule.employee.email}`} className="hover:underline">
                          {selectedSchedule.employee.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Badge className={getPriorityColor(selectedSchedule.priority || 'medium')}>
                      Priority: {selectedSchedule.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Created: {formatDateTime(selectedSchedule.created_at)}
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    setIsViewDialogOpen(false);
                    handleDeleteSchedule(selectedSchedule.id);
                  }}>
                    Delete
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className="mt-12 border-t bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="font-medium">Standby Management System v2.0</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{employees.length} employees</span>
                <span>•</span>
                <span>{standbySchedules.length} schedules</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default EmployeeStandbyScheduler;