// app/employees/page.tsx
'use client';

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Users, Plus, Search, RefreshCw, ChevronDown, ChevronUp,
  Loader2, Clock, AlertCircle, Trash2, List, LayoutGrid, X, Edit,
  Mail, Briefcase, Building, Calendar, GraduationCap, Award, UserCheck,
  FilterX, Sparkles, UserRound, BriefcaseBusiness,
  Phone, ChevronLeft, ChevronRight, ArrowUpDown, Filter,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { toast } from "sonner";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  id_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_engagement?: string;
  designation?: string;
  employee_class?: string;
  supervisor?: string;
  section?: string;
  department?: string;
  grade?: string;
  qualifications?: string[];
  drivers_license_class?: string;
  ppe_issue_date?: string;
  offences?: string[];
  awards_recognition?: string[];
  other_positions?: string[];
  previous_employer?: string;
}

interface EmployeeFormData {
  employee_id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  email: string;
  phone: string;
  address: string;
  date_of_engagement: string;
  designation: string;
  employee_class: string;
  supervisor: string;
  section: string;
  department: string;
  grade: string;
  qualifications: string[];
  drivers_license_class: string;
  ppe_issue_date: string;
  offences: string[];
  awards_recognition: string[];
  other_positions: string[];
  previous_employer: string;
}

type SortField = 'first_name' | 'employee_id' | 'designation' | 'department';
type SortOrderType = 'asc' | 'desc';

// ─── Utilities ────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const EMPLOYEES_API = `${API_BASE}/api/employees`;

function formatDate(d?: string): string {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return d; }
}

function calculateTenure(engagementDate?: string): string {
  if (!engagementDate) return '—';
  try {
    const start = new Date(engagementDate);
    if (isNaN(start.getTime())) return '—';
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0 && months === 0) return '<1 month';
    const parts: string[] = [];
    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    return parts.join(' ');
  } catch { return '—'; }
}

function getInitials(first: string, last: string): string {
  return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
}

function classBadgeColor(cls?: string): string {
  const map: Record<string, string> = {
    Permanent: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Contract: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Internship: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Part-Time': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };
  return map[cls || ''] ?? 'bg-white/10 text-white/60 border-white/20';
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(EMPLOYEES_API);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch: ${res.status}`);
  }
  return res.json();
}

async function createEmployee(data: EmployeeFormData): Promise<Employee> {
  const res = await fetch(EMPLOYEES_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err.detail;
    throw new Error(
      Array.isArray(detail) ? detail.map((e: { msg?: string }) => e.msg || String(e)).join('; ')
        : typeof detail === 'string' ? detail : `Failed to create: ${res.status}`
    );
  }
  return res.json();
}

async function updateEmployee(employeeId: number, data: EmployeeFormData): Promise<Employee> {
  // Include employee_id so users can correct it
  const payload: Record<string, unknown> = { ...data };

  payload.qualifications = data.qualifications || [];
  payload.offences = data.offences || [];
  payload.awards_recognition = data.awards_recognition || [];
  payload.other_positions = data.other_positions || [];

  const optionalStrings: (keyof EmployeeFormData)[] = [
    'employee_class', 'supervisor', 'section', 'department',
    'grade', 'previous_employer', 'drivers_license_class',
  ];
  for (const field of optionalStrings) {
    if (payload[field] === '') delete payload[field];
  }

  const res = await fetch(`${EMPLOYEES_API}/${employeeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg: string;
    try {
      const err = await res.json();
      const detail = err.detail;
      msg = Array.isArray(detail) ? detail.map((e: { msg?: string }) => e.msg || String(e)).join('; ')
        : typeof detail === 'string' ? detail : err.message || `Failed to update: ${res.status}`;
    } catch { msg = `Failed to update: ${res.status}`; }
    throw new Error(msg);
  }
  return res.json();
}

async function deleteEmployee(employeeId: number): Promise<void> {
  const res = await fetch(`${EMPLOYEES_API}/${employeeId}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to delete: ${res.status}`);
  }
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="oz-glass-panel rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-white/40 mb-1 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="h-11 w-11 rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-[#86BBD8]" />
        </div>
      </div>
    </div>
  );
}

// ─── EmployeeForm ─────────────────────────────────────────────────────────────

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

function EmployeeForm({ initialData, onSubmit, onCancel, isSubmitting }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormData>({
    employee_id: initialData?.employee_id || '',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    id_number: initialData?.id_number || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    date_of_engagement: initialData?.date_of_engagement || '',
    designation: initialData?.designation || '',
    employee_class: initialData?.employee_class || '',
    supervisor: initialData?.supervisor || '',
    section: initialData?.section || '',
    department: initialData?.department || '',
    grade: initialData?.grade || '',
    qualifications: initialData?.qualifications || [],
    drivers_license_class: initialData?.drivers_license_class || '',
    ppe_issue_date: initialData?.ppe_issue_date || '',
    offences: initialData?.offences || [],
    awards_recognition: initialData?.awards_recognition || [],
    other_positions: initialData?.other_positions || [],
    previous_employer: initialData?.previous_employer || '',
  });

  const [tempQual, setTempQual] = useState('');
  const [tempOffence, setTempOffence] = useState('');
  const [tempAward, setTempAward] = useState('');
  const [tempPos, setTempPos] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [section, setSection] = useState<'basic' | 'employment' | 'qualifications' | 'additional'>('basic');

  const set = (field: keyof EmployeeFormData, value: string | string[]) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const addItem = (field: keyof EmployeeFormData, val: string, clear: (v: string) => void) => {
    if (val.trim()) { set(field, [...(form[field] as string[]), val.trim()]); clear(''); }
  };

  const removeItem = (field: keyof EmployeeFormData, idx: number) => {
    set(field, (form[field] as string[]).filter((_, i) => i !== idx));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.employee_id.trim()) e.employee_id = 'Employee ID is required';
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.id_number.trim()) e.id_number = 'ID number is required';
    if (!form.date_of_engagement) e.date_of_engagement = 'Engagement date is required';
    if (!form.designation.trim()) e.designation = 'Designation is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const tabs = [
    { id: 'basic' as const, label: 'Personal', icon: UserRound },
    { id: 'employment' as const, label: 'Employment', icon: BriefcaseBusiness },
    { id: 'qualifications' as const, label: 'Qualifications', icon: GraduationCap },
    { id: 'additional' as const, label: 'Additional', icon: Sparkles },
  ];

  const inp = (field: string) =>
    `bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#2A4D69] ${errors[field] ? 'border-red-400' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tab nav */}
      <div className="flex gap-1.5 border-b pb-3 flex-wrap">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <Button key={t.id} type="button" variant={section === t.id ? 'default' : 'ghost'} size="sm"
              onClick={() => setSection(t.id)} className="gap-2">
              <Icon className="h-4 w-4" />{t.label}
            </Button>
          );
        })}
      </div>

      <ScrollArea className="max-h-[60vh] pr-4">

        {section === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Employee ID *</Label>
              <Input value={form.employee_id} onChange={e => set('employee_id', e.target.value.toUpperCase())}
                placeholder="e.g., C1165" className={inp('employee_id')} />
              {errors.employee_id && <p className="text-xs text-red-500">{errors.employee_id}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>First Name *</Label>
              <Input value={form.first_name} onChange={e => set('first_name', e.target.value)} className={inp('first_name')} />
              {errors.first_name && <p className="text-xs text-red-500">{errors.first_name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Last Name *</Label>
              <Input value={form.last_name} onChange={e => set('last_name', e.target.value)} className={inp('last_name')} />
              {errors.last_name && <p className="text-xs text-red-500">{errors.last_name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>ID Number *</Label>
              <Input value={form.id_number} onChange={e => set('id_number', e.target.value)} className={inp('id_number')} />
              {errors.id_number && <p className="text-xs text-red-500">{errors.id_number}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="Optional" className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="Optional" className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label>Address</Label>
              <Textarea value={form.address} onChange={e => set('address', e.target.value)}
                rows={2} placeholder="Optional" className="resize-none bg-white border-gray-200 text-gray-900" />
            </div>
          </div>
        )}

        {section === 'employment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Engagement Date *</Label>
              <Input type="date" value={form.date_of_engagement}
                onChange={e => set('date_of_engagement', e.target.value)} className={inp('date_of_engagement')} />
              {errors.date_of_engagement && <p className="text-xs text-red-500">{errors.date_of_engagement}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Designation *</Label>
              <Input value={form.designation} onChange={e => set('designation', e.target.value)} className={inp('designation')} />
              {errors.designation && <p className="text-xs text-red-500">{errors.designation}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Employee Class</Label>
              <Select value={form.employee_class || 'none'} onValueChange={v => set('employee_class', v === 'none' ? '' : v)}>
                <SelectTrigger className="bg-white border-gray-200 text-gray-900"><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Input value={form.department} onChange={e => set('department', e.target.value)}
                placeholder="Optional" className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <Label>Section</Label>
              <Input value={form.section} onChange={e => set('section', e.target.value)}
                placeholder="Optional" className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Input value={form.grade} onChange={e => set('grade', e.target.value)}
                placeholder="Optional" className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <Label>Supervisor</Label>
              <Input value={form.supervisor} onChange={e => set('supervisor', e.target.value)}
                placeholder="Optional" className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <Label>Previous Employer</Label>
              <Input value={form.previous_employer} onChange={e => set('previous_employer', e.target.value)}
                placeholder="Optional" className="bg-white border-gray-200 text-gray-900" />
            </div>
          </div>
        )}

        {section === 'qualifications' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Qualifications</Label>
              <div className="flex gap-2">
                <Input placeholder="Add qualification" value={tempQual} onChange={e => setTempQual(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('qualifications', tempQual, setTempQual))}
                  className="bg-white border-gray-200 text-gray-900" />
                <Button type="button" variant="outline" onClick={() => addItem('qualifications', tempQual, setTempQual)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.qualifications.map((q, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {q}
                    <button type="button" onClick={() => removeItem('qualifications', i)} className="ml-1 hover:text-red-500"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'additional' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Driver&apos;s License Class</Label>
                <Input value={form.drivers_license_class} onChange={e => set('drivers_license_class', e.target.value)}
                  placeholder="Optional" className="bg-white border-gray-200 text-gray-900" />
              </div>
              <div className="space-y-1.5">
                <Label>PPE Issue Date</Label>
                <Input type="date" value={form.ppe_issue_date} onChange={e => set('ppe_issue_date', e.target.value)}
                  className="bg-white border-gray-200 text-gray-900" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Other Positions</Label>
              <div className="flex gap-2">
                <Input placeholder="Add other position" value={tempPos} onChange={e => setTempPos(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('other_positions', tempPos, setTempPos))}
                  className="bg-white border-gray-200 text-gray-900" />
                <Button type="button" variant="outline" onClick={() => addItem('other_positions', tempPos, setTempPos)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.other_positions.map((p, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    {p}<button type="button" onClick={() => removeItem('other_positions', i)} className="ml-1 hover:text-red-500"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Awards &amp; Recognition</Label>
              <div className="flex gap-2">
                <Input placeholder="Add award" value={tempAward} onChange={e => setTempAward(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('awards_recognition', tempAward, setTempAward))}
                  className="bg-white border-gray-200 text-gray-900" />
                <Button type="button" variant="outline" onClick={() => addItem('awards_recognition', tempAward, setTempAward)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.awards_recognition.map((a, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    <Award className="h-3 w-3" />{a}
                    <button type="button" onClick={() => removeItem('awards_recognition', i)} className="ml-1 hover:text-red-500"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Offences</Label>
              <div className="flex gap-2">
                <Input placeholder="Add offence record" value={tempOffence} onChange={e => setTempOffence(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('offences', tempOffence, setTempOffence))}
                  className="bg-white border-gray-200 text-gray-900" />
                <Button type="button" variant="outline" onClick={() => addItem('offences', tempOffence, setTempOffence)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.offences.map((o, i) => (
                  <Badge key={i} variant="outline" className="gap-1 border-red-200 text-red-700">
                    <AlertCircle className="h-3 w-3" />{o}
                    <button type="button" onClick={() => removeItem('offences', i)} className="ml-1 hover:text-red-700"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

      </ScrollArea>

      <DialogFooter className="gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-[#2A4D69] hover:bg-[#1e3a52] text-white">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Add Employee'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── EmployeeCard ─────────────────────────────────────────────────────────────

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (e: Employee) => void;
  onDelete: (e: Employee) => void;
}

function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const name = `${employee.first_name} ${employee.last_name}`;
  const tenure = calculateTenure(employee.date_of_engagement);
  const qualCount = employee.qualifications?.length ?? 0;
  const awardCount = employee.awards_recognition?.length ?? 0;

  return (
    <div className="oz-glass-panel rounded-xl overflow-hidden hover:bg-white/[0.07] transition-colors">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-[#2A4D69]/60 border border-[#86BBD8]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-white">{getInitials(employee.first_name, employee.last_name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-semibold text-white leading-tight">{name}</span>
              <span className="text-sm font-mono text-[#86BBD8] font-medium">{employee.employee_id}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${classBadgeColor(employee.employee_class)}`}>
                {employee.employee_class || 'Unclassified'}
              </span>
              {employee.designation && (
                <span className="text-xs text-white/60 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />{employee.designation}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button type="button" onClick={() => setExpanded(o => !o)}
              className="p-1.5 rounded text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => onEdit(employee)}
              className="p-1.5 rounded text-white/30 hover:text-[#86BBD8] hover:bg-white/[0.06] transition-colors">
              <Edit className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onDelete(employee)}
              className="p-1.5 rounded text-white/30 hover:text-red-400 hover:bg-white/[0.06] transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div>
            <p className="text-[10px] text-white/40 mb-0.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> Engaged</p>
            <p className="text-white/80">{formatDate(employee.date_of_engagement)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 mb-0.5 flex items-center gap-1"><Clock className="h-3 w-3" /> Tenure</p>
            <p className="text-white/80">{tenure}</p>
          </div>
        </div>

        {/* Tag row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {employee.department && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 flex items-center gap-1">
              <Building className="h-3 w-3" />{employee.department}
            </span>
          )}
          {qualCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />{qualCount} qual{qualCount !== 1 ? 's' : ''}
            </span>
          )}
          {awardCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 flex items-center gap-1">
              <Award className="h-3 w-3" />{awardCount} award{awardCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
            {employee.address && (
              <div>
                <p className="text-[10px] text-white/40 mb-1">Address</p>
                <p className="text-sm text-white/60 bg-white/[0.04] rounded-lg px-3 py-2">{employee.address}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {employee.id_number && (
                <div><p className="text-[10px] text-white/40">ID No.</p><p className="text-white/70">{employee.id_number}</p></div>
              )}
              {employee.section && (
                <div><p className="text-[10px] text-white/40">Section</p><p className="text-white/70">{employee.section}</p></div>
              )}
              {employee.grade && (
                <div><p className="text-[10px] text-white/40">Grade</p><p className="text-white/70">{employee.grade}</p></div>
              )}
              {employee.supervisor && (
                <div><p className="text-[10px] text-white/40">Supervisor</p><p className="text-white/70">{employee.supervisor}</p></div>
              )}
              {employee.email && (
                <div><p className="text-[10px] text-white/40">Email</p><p className="text-white/70 text-xs truncate">{employee.email}</p></div>
              )}
              {employee.phone && (
                <div><p className="text-[10px] text-white/40">Phone</p><p className="text-white/70">{employee.phone}</p></div>
              )}
            </div>
            {qualCount > 0 && (
              <div>
                <p className="text-[10px] text-white/40 mb-1.5">Qualifications</p>
                <div className="flex flex-wrap gap-1">
                  {employee.qualifications!.map((q, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A4D69]/40 border border-[#86BBD8]/20 text-[#86BBD8]">{q}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-2.5 border-t border-white/[0.05] bg-white/[0.02]">
        <button type="button" onClick={() => onEdit(employee)}
          className="w-full text-xs text-white/30 hover:text-white/60 flex items-center justify-center gap-1.5 transition-colors">
          <Edit className="h-3 w-3" /> Edit employee details
        </button>
      </div>
    </div>
  );
}

// ─── EmployeeListItem ─────────────────────────────────────────────────────────

interface EmployeeListItemProps {
  employee: Employee;
  onEdit: (e: Employee) => void;
  onDelete: (e: Employee) => void;
}

function EmployeeListItem({ employee, onEdit, onDelete }: EmployeeListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const name = `${employee.first_name} ${employee.last_name}`;
  const tenure = calculateTenure(employee.date_of_engagement);
  const qualCount = employee.qualifications?.length ?? 0;

  return (
    <div className="border-b border-white/[0.05]">
      <div className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors group">
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-[#2A4D69]/60 border border-[#86BBD8]/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-white">{getInitials(employee.first_name, employee.last_name)}</span>
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-medium text-white text-sm">{name}</span>
            <span className="text-xs font-mono text-[#86BBD8]">{employee.employee_id}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${classBadgeColor(employee.employee_class)}`}>
              {employee.employee_class || 'Unclassified'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-white/45 mt-0.5 flex-wrap">
            {employee.designation && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{employee.designation}</span>}
            {employee.department && <span className="flex items-center gap-1"><Building className="h-3 w-3" />{employee.department}</span>}
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tenure}</span>
            {qualCount > 0 && <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{qualCount} qual</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button type="button" onClick={() => setExpanded(o => !o)}
            className="p-1 rounded text-white/20 hover:text-white/60 hover:bg-white/[0.06] transition-colors">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {employee.email && (
            <button type="button" onClick={() => window.open(`mailto:${employee.email}`, '_blank')}
              className="p-1 rounded text-white/20 hover:text-[#86BBD8] hover:bg-white/[0.06] transition-colors">
              <Mail className="h-4 w-4" />
            </button>
          )}
          <button type="button" onClick={() => onEdit(employee)}
            className="p-1 rounded text-white/20 hover:text-[#86BBD8] hover:bg-white/[0.06] transition-colors">
            <Edit className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onDelete(employee)}
            className="p-1 rounded text-white/20 hover:text-red-400 hover:bg-white/[0.06] transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded quick-view */}
      {expanded && (
        <div className="px-14 pb-4 pt-2 bg-white/[0.02] border-t border-white/[0.04]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-medium text-white/40 mb-1.5 uppercase tracking-wide">Personal</p>
              <div className="space-y-1 text-xs text-white/60">
                {employee.id_number && <div><span className="text-white/35">ID No.:</span> {employee.id_number}</div>}
                {employee.address && <div><span className="text-white/35">Address:</span> {employee.address}</div>}
                {employee.email && <div><span className="text-white/35">Email:</span> {employee.email}</div>}
                {employee.phone && <div><span className="text-white/35">Phone:</span> {employee.phone}</div>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-white/40 mb-1.5 uppercase tracking-wide">Employment</p>
              <div className="space-y-1 text-xs text-white/60">
                <div><span className="text-white/35">Engaged:</span> {formatDate(employee.date_of_engagement)}</div>
                <div><span className="text-white/35">Tenure:</span> {tenure}</div>
                {employee.section && <div><span className="text-white/35">Section:</span> {employee.section}</div>}
                {employee.grade && <div><span className="text-white/35">Grade:</span> {employee.grade}</div>}
                {employee.supervisor && <div><span className="text-white/35">Supervisor:</span> {employee.supervisor}</div>}
              </div>
            </div>
          </div>
          {qualCount > 0 && (
            <div className="mt-3">
              <p className="text-[10px] text-white/40 mb-1.5">Qualifications</p>
              <div className="flex flex-wrap gap-1">
                {employee.qualifications!.map((q, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A4D69]/40 border border-[#86BBD8]/20 text-[#86BBD8]">{q}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [sortBy, setSortBy] = useState<SortField>('first_name');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 25;

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load employees';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  const uniqueDesignations = useMemo(() =>
    Array.from(new Set(employees.map(e => e.designation).filter(Boolean) as string[])).sort(),
    [employees]);

  const uniqueClasses = useMemo(() =>
    Array.from(new Set(employees.map(e => e.employee_class || 'Unclassified'))).sort(),
    [employees]);

  const uniqueDepartments = useMemo(() =>
    Array.from(new Set(employees.map(e => e.department).filter(Boolean) as string[])).sort(),
    [employees]);

  const processedEmployees = useMemo(() => {
    let list = [...employees];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(e =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(term) ||
        e.employee_id?.toLowerCase().includes(term) ||
        (e.designation?.toLowerCase() ?? '').includes(term) ||
        (e.department?.toLowerCase() ?? '').includes(term) ||
        (e.id_number?.toLowerCase() ?? '').includes(term)
      );
    }

    if (filterDesignation !== 'all') list = list.filter(e => e.designation === filterDesignation);
    if (filterClass !== 'all') list = list.filter(e => (e.employee_class || 'Unclassified') === filterClass);
    if (filterDepartment !== 'all') list = list.filter(e => e.department === filterDepartment);

    list.sort((a, b) => {
      let aVal: string;
      let bVal: string;
      if (sortBy === 'first_name') {
        aVal = `${a.first_name} ${a.last_name}`;
        bVal = `${b.first_name} ${b.last_name}`;
      } else {
        aVal = a[sortBy] || '';
        bVal = b[sortBy] || '';
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return list;
  }, [employees, searchTerm, filterDesignation, filterClass, filterDepartment, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = processedEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); },
    [searchTerm, filterDesignation, filterClass, filterDepartment, sortBy, sortOrder]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (searchTerm) n++;
    if (filterDesignation !== 'all') n++;
    if (filterClass !== 'all') n++;
    if (filterDepartment !== 'all') n++;
    return n;
  }, [searchTerm, filterDesignation, filterClass, filterDepartment]);

  const stats = useMemo(() => ({
    total: employees.length,
    roles: new Set(employees.map(e => e.designation).filter(Boolean)).size,
    qualifications: employees.reduce((s, e) => s + (e.qualifications?.length || 0), 0),
    permanent: employees.filter(e => e.employee_class === 'Permanent').length,
  }), [employees]);

  const handleAdd = () => { setSelectedEmployee(null); setIsDialogOpen(true); };
  const handleEdit = (emp: Employee) => { setSelectedEmployee(emp); setIsDialogOpen(true); };

  const handleDelete = async (emp: Employee) => {
    if (!confirm(`Delete ${emp.first_name} ${emp.last_name}? This cannot be undone.`)) return;
    try {
      await deleteEmployee(emp.id);
      await loadEmployees();
      toast.success(`${emp.first_name} ${emp.last_name} deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleSubmitForm = async (formData: EmployeeFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, formData);
        toast.success('Employee updated');
      } else {
        await createEmployee(formData);
        toast.success('Employee added');
      }
      await loadEmployees();
      setIsDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm(''); setFilterDesignation('all'); setFilterClass('all');
    setFilterDepartment('all'); setSortBy('first_name'); setSortOrder('asc'); setCurrentPage(1);
  };

  return (
    <PageShell>
      <main className="container mx-auto px-4 py-8 space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-white/35 mb-2">
              <span>Home</span>
              <ChevronRightIcon className="h-3 w-3" />
              <span className="text-white/70 font-medium">Personnel</span>
            </nav>
            <h1 className="text-3xl font-bold text-white font-heading tracking-tight">Personnel Registry</h1>
            <p className="text-white/45 mt-1 text-sm max-w-xl">
              Manage your workforce — view profiles, track qualifications, and keep records up to date.
            </p>
          </div>
          <button type="button" onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2A4D69] hover:bg-[#1e3a52] text-white text-sm font-medium transition-colors shadow-lg self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Add Employee
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Employees" value={stats.total} icon={Users} />
          <StatCard title="Unique Roles" value={stats.roles} icon={Briefcase} />
          <StatCard title="Qualifications" value={stats.qualifications} icon={GraduationCap} />
          <StatCard title="Permanent Staff" value={stats.permanent} icon={UserCheck} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="oz-glass-panel rounded-xl p-4 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-300 flex-1">{error}</p>
            <button type="button" onClick={() => setError(null)} className="text-white/40 hover:text-white/70">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main panel */}
        <div className="oz-glass-dark rounded-xl overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] flex-wrap">
            {/* Search */}
            <div className="relative min-w-[180px] flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search name, ID, role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 h-8 bg-white/[0.06] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#86BBD8]/40"
              />
            </div>

            {/* Sort select */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortField)}
              className="h-8 pl-2.5 pr-7 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-white/70 focus:outline-none cursor-pointer"
            >
              <option value="first_name">Name A–Z</option>
              <option value="employee_id">Employee ID</option>
              <option value="designation">Role</option>
              <option value="department">Department</option>
            </select>

            {/* Sort direction */}
            <button type="button" onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white/80 transition-colors">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>

            {/* Filters toggle */}
            <button type="button" onClick={() => setShowFilters(o => !o)}
              className={`h-8 px-3 flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-colors ${
                activeFilterCount > 0
                  ? 'bg-[#2A4D69] border-[#86BBD8]/30 text-white'
                  : 'bg-white/[0.06] border-white/[0.08] text-white/50 hover:text-white/80'
              }`}>
              <Filter className="h-3.5 w-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#86BBD8] text-[#2A4D69] rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters}
                className="h-8 px-2.5 flex items-center gap-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 hover:text-white/70 transition-colors">
                <FilterX className="h-3.5 w-3.5" /> Clear
              </button>
            )}

            {/* View toggle — right side */}
            <div className="ml-auto flex items-center gap-0.5">
              <button type="button" onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                <List className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'cards' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button type="button" onClick={loadEmployees}
                className="p-1.5 rounded text-white/20 hover:text-white/50 transition-colors ml-1">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Collapsible filter dropdowns */}
          {showFilters && (
            <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-wide">Role / Designation</p>
                  <select value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)}
                    className="w-full h-8 px-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-white/70 focus:outline-none">
                    <option value="all">All Roles</option>
                    {uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-wide">Employment Class</p>
                  <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                    className="w-full h-8 px-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-white/70 focus:outline-none">
                    <option value="all">All Classes</option>
                    {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-wide">Department</p>
                  <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)}
                    className="w-full h-8 px-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-white/70 focus:outline-none">
                    <option value="all">All Departments</option>
                    {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Record count */}
          <div className="px-5 py-2 border-b border-white/[0.04]">
            <span className="text-xs text-white/35">
              {processedEmployees.length} record{processedEmployees.length !== 1 ? 's' : ''}
              {employees.length !== processedEmployees.length && ` (filtered from ${employees.length})`}
            </span>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="p-5 space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-14 bg-white/[0.04] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : paginatedEmployees.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-14 w-14 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-white/20" />
              </div>
              <p className="text-white/40 text-sm mb-1">
                {employees.length === 0 ? 'No employees yet' : 'No results match your filters'}
              </p>
              <p className="text-white/25 text-xs">
                {employees.length === 0 ? 'Add your first employee to get started.' : 'Try broadening your search or clearing filters.'}
              </p>
              {employees.length === 0 ? (
                <button type="button" onClick={handleAdd}
                  className="mt-5 px-4 py-2 rounded-lg bg-[#2A4D69] text-white text-sm hover:bg-[#1e3a52] transition-colors">
                  Add First Employee
                </button>
              ) : (
                <button type="button" onClick={clearFilters}
                  className="mt-5 px-4 py-2 rounded-lg bg-white/[0.06] text-white/60 text-sm hover:bg-white/[0.08] transition-colors">
                  Clear Filters
                </button>
              )}
            </div>
          ) : viewMode === 'list' ? (
            <div>
              {paginatedEmployees.map(emp => (
                <EmployeeListItem key={emp.id} employee={emp} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedEmployees.map(emp => (
                <EmployeeCard key={emp.id} employee={emp} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-white/[0.06]">
              <button type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs text-white/60 hover:text-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <span className="text-xs text-white/35 px-2">Page {currentPage} of {totalPages}</span>
              <button type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs text-white/60 hover:text-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-[#F0F5F9] rounded-t-xl">
            <DialogTitle className="text-xl font-semibold text-[#2A4D69]">
              {selectedEmployee
                ? `Edit — ${selectedEmployee.first_name} ${selectedEmployee.last_name} (${selectedEmployee.employee_id})`
                : 'Add New Employee'}
            </DialogTitle>
            <DialogDescription>
              {selectedEmployee
                ? 'All fields are editable, including Employee ID.'
                : 'Fill in the details below. Fields marked with * are required.'}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-6">
            <EmployeeForm
              initialData={selectedEmployee}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>

    </PageShell>
  );
}
