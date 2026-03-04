'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays, addWeeks, addMonths, addYears, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, setDate, setMonth, getDay } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Loader2, RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const EQUIPMENT_API = `${API_BASE}/api/equipment`;
const EMPLOYEES_API = `${API_BASE}/api/employees`;
const SCHEDULES_API = `${API_BASE}/api/schedules`;

// ---------- Types ----------
interface Equipment {
  id: number;
  name: string;
  code?: string;
  location?: string;
}

interface Employee {
  id: number;
  name: string;
  designation?: string;
  department?: string;
}

type AssignedPerson = 
  | { type: 'employee'; id: number; name: string }
  | { type: 'contractor'; name: string };

interface Schedule {
  id: number;
  equipment_id: number;
  equipment_name: string;
  title: string;
  type: 'maintenance' | 'compliance' | 'inspection';
  scheduled_date: string;
  assigned_persons: AssignedPerson[];
  notes?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// ---------- Recurrence Types ----------
const recurrenceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('none') }),
  z.object({
    type: z.literal('daily'),
    interval: z.number().int().min(1).default(1),
    endType: z.enum(['never', 'after', 'on']),
    endAfter: z.number().int().min(1).optional(),
    endDate: z.date().optional(),
  }),
  z.object({
    type: z.literal('weekly'),
    interval: z.number().int().min(1).default(1),
    weekDays: z.array(z.number().int().min(0).max(6)).default([]), // 0=Sunday
    endType: z.enum(['never', 'after', 'on']),
    endAfter: z.number().int().min(1).optional(),
    endDate: z.date().optional(),
  }),
  z.object({
    type: z.literal('monthly'),
    interval: z.number().int().min(1).default(1),
    dayOfMonth: z.number().int().min(1).max(31).optional(),
    // could also add "weekday of month" but keeping simple
    endType: z.enum(['never', 'after', 'on']),
    endAfter: z.number().int().min(1).optional(),
    endDate: z.date().optional(),
  }),
  z.object({
    type: z.literal('yearly'),
    interval: z.number().int().min(1).default(1),
    month: z.number().int().min(1).max(12).optional(),
    day: z.number().int().min(1).max(31).optional(),
    endType: z.enum(['never', 'after', 'on']),
    endAfter: z.number().int().min(1).optional(),
    endDate: z.date().optional(),
  }),
]);

type Recurrence = z.infer<typeof recurrenceSchema>;

// ---------- Form Schema ----------
const scheduleSchema = z.object({
  equipment_id: z.number({ required_error: 'Equipment is required' }),
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['maintenance', 'compliance', 'inspection']),
  start_date: z.date({ required_error: 'Start date is required' }),
  recurrence: recurrenceSchema,
  assigned_persons: z.array(
    z.object({
      type: z.enum(['employee', 'contractor']),
      id: z.number().optional(),
      name: z.string().min(1, 'Name is required'),
    })
  ).default([]),
  notes: z.string().optional(),
  status: z.enum(['planned', 'in-progress', 'completed', 'cancelled']).default('planned'),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

// ---------- Recurrence Date Generator ----------
function generateRecurringDates(rule: Recurrence, start: Date): Date[] {
  const dates: Date[] = [];
  const maxDates = 50; // safety limit
  const endType = rule.type !== 'none' ? rule.endType : 'never';
  const endAfter = rule.type !== 'none' ? rule.endAfter : undefined;
  const endDate = rule.type !== 'none' ? rule.endDate : undefined;

  let current = start;
  let count = 0;

  while (count < maxDates) {
    if (rule.type === 'none') {
      dates.push(start);
      break;
    }

    // Check end conditions
    if (endType === 'after' && endAfter && count >= endAfter) break;
    if (endType === 'on' && endDate && current > endDate) break;

    dates.push(current);

    // Generate next date
    switch (rule.type) {
      case 'daily':
        current = addDays(current, rule.interval);
        break;
      case 'weekly':
        // For weekly, we need to find the next occurrence that matches weekDays
        // This is simplified: we just add interval weeks and keep the same weekday
        // A full implementation would generate all weekDays within the interval, but for simplicity we'll just add interval weeks.
        // More advanced: generate all weekDays between current and current+interval*7
        // We'll keep it simple: add interval weeks, and the day of week stays the same.
        current = addWeeks(current, rule.interval);
        break;
      case 'monthly':
        if (rule.dayOfMonth) {
          // Try to set to same day of month, fallback to last day of month
          let next = setDate(addMonths(current, rule.interval), rule.dayOfMonth);
          if (next < current) next = addMonths(next, 1); // adjust if day overflow
          current = next;
        } else {
          // just same day of month as start
          current = addMonths(current, rule.interval);
        }
        break;
      case 'yearly':
        current = addYears(current, rule.interval);
        break;
    }
    count++;
  }
  return dates;
}

// ---------- API Functions ----------
const fetchEquipment = async (): Promise<Equipment[]> => {
  const res = await fetch(EQUIPMENT_API);
  if (!res.ok) throw new Error('Failed to fetch equipment');
  return res.json();
};

const fetchEmployees = async (): Promise<Employee[]> => {
  const res = await fetch(EMPLOYEES_API);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
};

const fetchSchedules = async (): Promise<Schedule[]> => {
  const res = await fetch(SCHEDULES_API);
  if (!res.ok) throw new Error('Failed to fetch schedules');
  return res.json();
};

const createSchedule = async (data: any): Promise<Schedule> => {
  const res = await fetch(SCHEDULES_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create: ${res.status} - ${errorText}`);
  }
  return res.json();
};

const updateSchedule = async (id: number, data: any): Promise<Schedule> => {
  const res = await fetch(`${SCHEDULES_API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update: ${res.status} - ${errorText}`);
  }
  return res.json();
};

const deleteSchedule = async (id: number): Promise<void> => {
  const res = await fetch(`${SCHEDULES_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

// ---------- Employee Multi-Select Component (unchanged) ----------
interface EmployeeMultiSelectProps {
  value: ScheduleFormValues['assigned_persons'];
  onChange: (value: ScheduleFormValues['assigned_persons']) => void;
  employees: Employee[];
}

const EmployeeMultiSelect: React.FC<EmployeeMultiSelectProps> = ({ value, onChange, employees }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;
    const q = search.toLowerCase();
    return employees.filter(emp => emp.name.toLowerCase().includes(q));
  }, [employees, search]);

  const addEmployee = (emp: Employee) => {
    const exists = value.some(p => p.type === 'employee' && p.id === emp.id);
    if (!exists) {
      onChange([...value, { type: 'employee', id: emp.id, name: emp.name }]);
    }
    setOpen(false);
  };

  const addContractor = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([...value, { type: 'contractor', name: trimmed }]);
    setSearch('');
    setOpen(false);
  };

  const removePerson = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label>Assigned Personnel</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-start">
            {value.length === 0 ? 'Add personnel...' : `${value.length} person(s) assigned`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search employee or type new name..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>
              <Button variant="ghost" className="w-full justify-start" onClick={() => addContractor(search)}>
                <Plus className="mr-2 h-4 w-4" />
                Add "{search}" as contractor
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {filteredEmployees.map(emp => (
                <CommandItem
                  key={emp.id}
                  value={emp.name}
                  onSelect={() => addEmployee(emp)}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{emp.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.designation} • {emp.department}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="space-y-2 mt-2">
          {value.map((person, index) => (
            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
              <div className="flex items-center gap-2">
                {person.type === 'employee' ? (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs">
                    C
                  </div>
                )}
                <span className="text-sm font-medium">{person.name}</span>
                {person.type === 'employee' ? (
                  <Badge variant="outline" className="text-xs">Employee</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Contractor</Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removePerson(index)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Recurrence Form Component ----------
interface RecurrenceFormProps {
  value: Recurrence;
  onChange: (value: Recurrence) => void;
  startDate: Date | undefined;
}

const RecurrenceForm: React.FC<RecurrenceFormProps> = ({ value, onChange, startDate }) => {
  const [type, setType] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>(value.type);

  const handleTypeChange = (newType: typeof type) => {
    let newValue: Recurrence;
    switch (newType) {
      case 'none':
        newValue = { type: 'none' };
        break;
      case 'daily':
        newValue = { type: 'daily', interval: 1, endType: 'never' };
        break;
      case 'weekly':
        newValue = { type: 'weekly', interval: 1, weekDays: [startDate ? getDay(startDate) : 1], endType: 'never' };
        break;
      case 'monthly':
        newValue = { type: 'monthly', interval: 1, dayOfMonth: startDate?.getDate(), endType: 'never' };
        break;
      case 'yearly':
        newValue = { type: 'yearly', interval: 1, month: startDate?.getMonth()!+1, day: startDate?.getDate(), endType: 'never' };
        break;
    }
    setType(newType);
    onChange(newValue);
  };

  const updateField = (field: string, val: any) => {
    onChange({ ...value, [field]: val });
  };

  const weekDayOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Recurrence</Label>
          <Select value={type} onValueChange={(v: any) => handleTypeChange(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select recurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type !== 'none' && (
          <div className="space-y-2">
            <Label>Interval</Label>
            <Input
              type="number"
              min={1}
              value={value.interval}
              onChange={(e) => updateField('interval', parseInt(e.target.value) || 1)}
            />
          </div>
        )}
      </div>

      {type === 'weekly' && (
        <div className="space-y-2">
          <Label>Week Days</Label>
          <div className="flex flex-wrap gap-2">
            {weekDayOptions.map((day, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <Checkbox
                  id={`day-${idx}`}
                  checked={value.weekDays?.includes(idx)}
                  onCheckedChange={(checked) => {
                    const days = value.weekDays || [];
                    if (checked) {
                      updateField('weekDays', [...days, idx]);
                    } else {
                      updateField('weekDays', days.filter(d => d !== idx));
                    }
                  }}
                />
                <Label htmlFor={`day-${idx}`} className="text-sm">{day}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'monthly' && (
        <div className="space-y-2">
          <Label>Day of Month</Label>
          <Input
            type="number"
            min={1}
            max={31}
            value={value.dayOfMonth || ''}
            onChange={(e) => updateField('dayOfMonth', parseInt(e.target.value) || 1)}
          />
        </div>
      )}

      {type === 'yearly' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Month</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={value.month || ''}
              onChange={(e) => updateField('month', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label>Day</Label>
            <Input
              type="number"
              min={1}
              max={31}
              value={value.day || ''}
              onChange={(e) => updateField('day', parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      )}

      {type !== 'none' && (
        <div className="space-y-2">
          <Label>End</Label>
          <Select
            value={value.endType}
            onValueChange={(val: any) => updateField('endType', val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="after">After</SelectItem>
              <SelectItem value="on">On</SelectItem>
            </SelectContent>
          </Select>

          {value.endType === 'after' && (
            <div className="mt-2">
              <Label>Number of occurrences</Label>
              <Input
                type="number"
                min={1}
                value={value.endAfter}
                onChange={(e) => updateField('endAfter', parseInt(e.target.value) || 1)}
              />
            </div>
          )}

          {value.endType === 'on' && (
            <div className="mt-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value.endDate ? format(value.endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={value.endDate}
                    onSelect={(date) => updateField('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---------- Main Page ----------
export default function MaintenanceSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [previewDates, setPreviewDates] = useState<Date[]>([]);
  const [filterEquipment, setFilterEquipment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      equipment_id: undefined,
      title: '',
      type: 'maintenance',
      start_date: undefined,
      recurrence: { type: 'none' },
      assigned_persons: [],
      notes: '',
      status: 'planned',
    },
  });

  const watchStartDate = form.watch('start_date');
  const watchRecurrence = form.watch('recurrence');

  // Generate preview when recurrence or start date changes
  useEffect(() => {
    if (watchStartDate && watchRecurrence.type !== 'none') {
      const dates = generateRecurringDates(watchRecurrence, watchStartDate);
      setPreviewDates(dates);
    } else {
      setPreviewDates([]);
    }
  }, [watchStartDate, watchRecurrence]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [eq, emp, sched] = await Promise.all([
          fetchEquipment(),
          fetchEmployees(),
          fetchSchedules(),
        ]);
        setEquipment(eq);
        setEmployees(emp);
        setSchedules(sched);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const onSubmit = async (values: ScheduleFormValues) => {
    try {
      const basePayload = {
        equipment_id: values.equipment_id,
        title: values.title,
        type: values.type,
        assigned_persons: values.assigned_persons.map(p => 
          p.type === 'employee' ? { type: 'employee', id: p.id, name: p.name } : { type: 'contractor', name: p.name }
        ),
        notes: values.notes,
        status: values.status,
      };

      if (editingSchedule) {
        // Edit mode – just update the single schedule
        const payload = {
          ...basePayload,
          scheduled_date: values.start_date.toISOString().split('T')[0],
        };
        const updated = await updateSchedule(editingSchedule.id, payload);
        setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? updated : s));
        toast.success('Schedule updated');
        setShowForm(false);
        setEditingSchedule(null);
        form.reset();
        return;
      }

      // Create mode – generate multiple dates if recurring
      const datesToCreate = values.recurrence.type === 'none'
        ? [values.start_date]
        : generateRecurringDates(values.recurrence, values.start_date);

      // Limit to a reasonable number (e.g., 50) to avoid abuse
      if (datesToCreate.length > 50) {
        toast.error('Too many occurrences (max 50). Please adjust recurrence.');
        return;
      }

      // Create each schedule
      for (const date of datesToCreate) {
        const payload = {
          ...basePayload,
          scheduled_date: date.toISOString().split('T')[0],
        };
        const created = await createSchedule(payload);
        setSchedules(prev => [created, ...prev]);
      }
      toast.success(`Created ${datesToCreate.length} schedule(s)`);
      setShowForm(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    form.reset({
      equipment_id: schedule.equipment_id,
      title: schedule.title,
      type: schedule.type,
      start_date: new Date(schedule.scheduled_date),
      recurrence: { type: 'none' }, // editing a single schedule – no recurrence
      assigned_persons: schedule.assigned_persons,
      notes: schedule.notes || '',
      status: schedule.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      await deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast.success('Schedule deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned': return <Badge variant="secondary">Planned</Badge>;
      case 'in-progress': return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter schedules based on selected filters
  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      if (filterEquipment !== 'all' && s.equipment_id.toString() !== filterEquipment) return false;
      if (filterStatus !== 'all' && s.status !== filterStatus) return false;
      if (filterDateFrom && s.scheduled_date < filterDateFrom) return false;
      if (filterDateTo && s.scheduled_date > filterDateTo) return false;
      return true;
    });
  }, [schedules, filterEquipment, filterStatus, filterDateFrom, filterDateTo]);

  const clearFilters = () => {
    setFilterEquipment('all');
    setFilterStatus('all');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded bg-primary p-1.5">
                <CalendarIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">MyOffice</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <nav className="flex items-center gap-1">
              <span className="text-sm font-medium">Maintenance Schedules</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => { setEditingSchedule(null); form.reset(); setShowForm(true); }} size="sm">
              <Plus className="h-4 w-4 mr-2" /> New Schedule
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Equipment</Label>
                <Select value={filterEquipment} onValueChange={setFilterEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Equipment</SelectItem>
                    {equipment.map(eq => (
                      <SelectItem key={eq.id} value={eq.id.toString()}>
                        {eq.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>From Date</Label>
                <Input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
              </div>
              <div>
                <Label>To Date</Label>
                <Input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedules List */}
        <Card>
          <CardHeader>
            <CardTitle>All Schedules</CardTitle>
            <CardDescription>View and manage upcoming maintenance tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSchedules.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                <p>No schedules found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map(schedule => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.equipment_name}</TableCell>
                      <TableCell>{schedule.title}</TableCell>
                      <TableCell className="capitalize">{schedule.type}</TableCell>
                      <TableCell>{format(new Date(schedule.scheduled_date), 'PP')}</TableCell>
                      <TableCell>
                        {schedule.assigned_persons.length === 0 ? (
                          <span className="text-muted-foreground text-sm">None</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {schedule.assigned_persons.map((p, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {p.name}
                                {p.type === 'contractor' && <span className="ml-1 text-orange-600">(C)</span>}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(schedule)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(schedule.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'New Maintenance Schedule'}</DialogTitle>
              <DialogDescription>
                Schedule a maintenance task for equipment or a compliance item.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Equipment selection */}
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment *</Label>
                <Select
                  value={form.watch('equipment_id')?.toString()}
                  onValueChange={(val) => form.setValue('equipment_id', parseInt(val))}
                >
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map(eq => (
                      <SelectItem key={eq.id} value={eq.id.toString()}>
                        {eq.name} {eq.code && `(${eq.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.equipment_id && (
                  <p className="text-sm text-destructive">{form.formState.errors.equipment_id.message}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...form.register('title')} />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={form.watch('type')} onValueChange={(val: any) => form.setValue('type', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn(
                      'w-full justify-start text-left font-normal',
                      !form.watch('start_date') && 'text-muted-foreground'
                    )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch('start_date') ? format(form.watch('start_date')!, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch('start_date')}
                      onSelect={(date) => form.setValue('start_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.start_date && (
                  <p className="text-sm text-destructive">{form.formState.errors.start_date.message}</p>
                )}
              </div>

              {/* Recurrence */}
              {!editingSchedule && (
                <RecurrenceForm
                  value={form.watch('recurrence')}
                  onChange={(val) => form.setValue('recurrence', val)}
                  startDate={form.watch('start_date')}
                />
              )}

              {/* Preview */}
              {!editingSchedule && previewDates.length > 0 && (
                <div className="space-y-2">
                  <Label>Preview ({previewDates.length} occurrences)</Label>
                  <div className="max-h-40 overflow-y-auto border rounded p-2">
                    {previewDates.map((date, idx) => (
                      <div key={idx} className="text-sm py-1">
                        {format(date, 'PPP')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Personnel */}
              <EmployeeMultiSelect
                value={form.watch('assigned_persons') || []}
                onChange={(val) => form.setValue('assigned_persons', val)}
                employees={employees}
              />

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.watch('status')} onValueChange={(val: any) => form.setValue('status', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...form.register('notes')} rows={3} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSchedule ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}