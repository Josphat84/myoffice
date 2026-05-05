// frontend/app/maintenance/page.tsx
'use client';
import { useState, useEffect, useMemo, ElementType } from "react";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Wrench, Plus, RefreshCw, CheckCircle2, Clock, PlayCircle, PauseCircle,
  Search, ChevronDown, ChevronUp, ChevronRight, X, XCircle, AlertCircle,
  CalendarOff, ClipboardCheck, FileText, Trash2, Save, Signature,
  HardHat, ShieldCheck, Timer
} from "lucide-react";

// ==================== TYPES ====================
type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled' | 'postponed' | 'not-done';
type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

interface WorkOrder {
  id: string;
  work_order_number: string;
  equipment_info: string;
  to_department: string;
  to_section: string;
  from_department: string;
  from_section: string;
  date_raised: string;
  time_raised: string;
  account_number: string;
  user_lab_today: string;
  job_type: { operational: boolean; maintenance: boolean; mining: boolean } | string;
  job_request_details: string;
  requested_by: string;
  authorising_foreman: string;
  authorising_engineer: string;
  allocated_to: string;
  estimated_hours: string;
  responsible_foreman: string;
  job_instructions: string;
  manpower: unknown;
  work_done_details: string;
  cause_of_failure: string;
  delay_details: string;
  artisan_name: string;
  artisan_sign: string;
  artisan_date: string;
  foreman_name: string;
  foreman_sign: string;
  foreman_date: string;
  time_work_started: string;
  time_work_finished: string;
  total_time_worked: string;
  overtime_start_time: string;
  overtime_end_time: string;
  overtime_hours: string;
  delay_from_time: string;
  delay_to_time: string;
  total_delay_hours: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  progress: number;
  notes?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// ==================== API ====================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getWorkOrders(): Promise<WorkOrder[]> {
  const local: WorkOrder[] = JSON.parse(localStorage.getItem('maint_work_orders') || '[]');
  try {
    const res = await fetch(`${API_BASE}/api/maintenance/work-orders`);
    if (!res.ok) throw new Error(`${res.status}`);
    const apiData: WorkOrder[] = await res.json();
    if (!Array.isArray(apiData)) return local;
    // Keep any localStorage-only items that the API doesn't know about yet
    const apiIds = new Set(apiData.map(w => String(w.id)));
    const localOnly = local.filter(w => !apiIds.has(String(w.id)));
    return [...apiData, ...localOnly];
  } catch {
    return local;
  }
}

async function createWorkOrder(data: Record<string, unknown>): Promise<{ success: boolean; data?: WorkOrder }> {
  try {
    const res = await fetch(`${API_BASE}/api/maintenance/work-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const result = await res.json();
    return { success: true, data: result };
  } catch {
    const wo = { ...data, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as WorkOrder;
    const prev = JSON.parse(localStorage.getItem('maint_work_orders') || '[]');
    localStorage.setItem('maint_work_orders', JSON.stringify([wo, ...prev]));
    return { success: true, data: wo };
  }
}

async function updateWorkOrder(id: string, updates: Record<string, unknown>): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/maintenance/work-orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return { success: true };
  } catch {
    const prev: WorkOrder[] = JSON.parse(localStorage.getItem('maint_work_orders') || '[]');
    localStorage.setItem('maint_work_orders', JSON.stringify(
      prev.map(w => w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w)
    ));
    return { success: true };
  }
}

async function deleteWorkOrder(id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/maintenance/work-orders/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`${res.status}`);
    return { success: true };
  } catch {
    const prev: WorkOrder[] = JSON.parse(localStorage.getItem('maint_work_orders') || '[]');
    localStorage.setItem('maint_work_orders', JSON.stringify(prev.filter(w => w.id !== id)));
    return { success: true };
  }
}

// ==================== HELPERS ====================
function statusCfg(s: WorkOrderStatus) {
  const m = {
    'pending':     { Icon: Clock,        dot: 'bg-yellow-400', pill: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/30',  label: 'Pending' },
    'in-progress': { Icon: PlayCircle,   dot: 'bg-blue-400',   pill: 'bg-blue-400/15   text-blue-300   border-blue-400/30',    label: 'In Progress' },
    'completed':   { Icon: CheckCircle2, dot: 'bg-green-400',  pill: 'bg-green-400/15  text-green-300  border-green-400/30',   label: 'Completed' },
    'on-hold':     { Icon: PauseCircle,  dot: 'bg-orange-400', pill: 'bg-orange-400/15 text-orange-300 border-orange-400/30',  label: 'On Hold' },
    'cancelled':   { Icon: XCircle,      dot: 'bg-red-400',    pill: 'bg-red-400/15    text-red-300    border-red-400/30',     label: 'Cancelled' },
    'postponed':   { Icon: CalendarOff,  dot: 'bg-purple-400', pill: 'bg-purple-400/15 text-purple-300 border-purple-400/30',  label: 'Postponed' },
    'not-done':    { Icon: AlertCircle,  dot: 'bg-gray-400',   pill: 'bg-gray-400/15   text-gray-300   border-gray-400/30',    label: 'Not Done' },
  } as const;
  return m[s] ?? m['pending'];
}

function priorityCfg(p: WorkOrderPriority) {
  const m = {
    'urgent': { dot: 'bg-red-500',    badge: 'bg-red-500/15    text-red-300    border-red-500/30',    label: 'Urgent' },
    'high':   { dot: 'bg-orange-500', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', label: 'High' },
    'medium': { dot: 'bg-yellow-500', badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', label: 'Medium' },
    'low':    { dot: 'bg-green-500',  badge: 'bg-green-500/15  text-green-300  border-green-500/30',  label: 'Low' },
  } as const;
  return m[p] ?? m['medium'];
}

function calcStats(orders: WorkOrder[]) {
  const by = (s: WorkOrderStatus) => orders.filter(o => o.status === s).length;
  const total = orders.length;
  const completed = by('completed');
  return {
    total,
    pending:    by('pending'),
    inProgress: by('in-progress'),
    completed,
    onHold:     by('on-hold'),
    overdue:    orders.filter(o => o.due_date && o.status !== 'completed' && new Date(o.due_date) < new Date()).length,
    efficiency: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// ==================== CREATE WORK ORDER MODAL ====================
interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newOrder: WorkOrder) => void;
}

function CreateWorkOrderModal({ isOpen, onClose, onCreated }: CreateModalProps) {
  const blank = {
    equipment_info: '', to_department: '', allocated_to: '',
    priority: 'medium' as WorkOrderPriority, estimated_hours: '2',
    job_request_details: '', requested_by: '', authorising_foreman: '',
    job_instructions: '', date_raised: new Date().toISOString().split('T')[0],
  };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.equipment_info.trim() || !form.job_request_details.trim() || !form.allocated_to.trim()) {
      toast.error('Machine, artisan name and job request are required');
      return;
    }
    setSaving(true);
    const result = await createWorkOrder({
      work_order_number: `WO-${Date.now().toString().slice(-6)}`,
      ...form,
      to_section: '', from_department: '', from_section: '',
      account_number: '', user_lab_today: '',
      time_raised: new Date().toTimeString().slice(0, 5),
      job_type: { operational: false, maintenance: true, mining: false },
      authorising_engineer: '',
      responsible_foreman: form.authorising_foreman,
      manpower: [],
      work_done_details: '', cause_of_failure: '', delay_details: '',
      artisan_name: form.allocated_to,
      artisan_sign: '', artisan_date: '',
      foreman_name: '', foreman_sign: '', foreman_date: '',
      time_work_started: '', time_work_finished: '', total_time_worked: '',
      overtime_start_time: '', overtime_end_time: '', overtime_hours: '',
      delay_from_time: '', delay_to_time: '', total_delay_hours: '',
      status: 'pending', priority: form.priority, progress: 0,
    });
    setSaving(false);
    if (result.success && result.data) {
      toast.success('Work order created');
      setForm(blank);
      onCreated(result.data);
      onClose();
    } else {
      toast.error('Failed to create work order');
    }
  };

  const inputCls = "bg-white/[0.07] border-white/[0.12] text-white placeholder:text-white/30 focus:border-[#86BBD8]/50 focus:bg-white/[0.10]";
  const labelCls = "text-white/55 text-xs";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[rgba(5,15,28,0.96)] backdrop-blur-2xl border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-white">
            <div className="bg-[#86BBD8]/20 p-2 rounded-lg border border-[#86BBD8]/25">
              <Wrench className="h-4 w-4 text-[#86BBD8]" />
            </div>
            New Work Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Machine + Department */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={labelCls}>Machine / Equipment *</Label>
              <Input value={form.equipment_info} onChange={e => set('equipment_info', e.target.value)}
                placeholder="e.g. Compressor #3, Crusher Belt…" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <Label className={labelCls}>Department</Label>
              <Input value={form.to_department} onChange={e => set('to_department', e.target.value)}
                placeholder="e.g. Engineering, Mining…" className={inputCls} />
            </div>
          </div>

          {/* Artisan + Priority + Hours */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className={labelCls}>Allocated To (Artisan) *</Label>
              <Input value={form.allocated_to} onChange={e => set('allocated_to', e.target.value)}
                placeholder="Artisan full name" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <Label className={labelCls}>Priority</Label>
              <Select value={form.priority} onValueChange={v => set('priority', v)}>
                <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0d1f35] border-white/10 text-white">
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className={labelCls}>Est. Hours</Label>
              <Input type="number" min="0.5" step="0.5" value={form.estimated_hours}
                onChange={e => set('estimated_hours', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Date + Requested By + Authorising Foreman */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className={labelCls}>Date Raised</Label>
              <Input type="date" value={form.date_raised} onChange={e => set('date_raised', e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <Label className={labelCls}>Requested By</Label>
              <Input value={form.requested_by} onChange={e => set('requested_by', e.target.value)}
                placeholder="Your name" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <Label className={labelCls}>Authorising Foreman</Label>
              <Input value={form.authorising_foreman} onChange={e => set('authorising_foreman', e.target.value)}
                placeholder="Foreman name" className={inputCls} />
            </div>
          </div>

          {/* Job Request */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Job Request — What to Do *</Label>
            <Textarea value={form.job_request_details} onChange={e => set('job_request_details', e.target.value)}
              placeholder="Describe exactly what the artisan needs to do…"
              rows={4} className={`${inputCls} resize-none`} />
          </div>

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Special Instructions (optional)</Label>
            <Textarea value={form.job_instructions} onChange={e => set('job_instructions', e.target.value)}
              placeholder="Safety notes, special tools, access requirements…"
              rows={2} className={`${inputCls} resize-none`} />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}
            className="bg-white/[0.08] hover:bg-white/[0.16] text-white/80 border border-white/15">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}
            className="bg-[#86BBD8]/25 hover:bg-[#86BBD8]/40 text-white border border-[#86BBD8]/35">
            {saving ? 'Creating…' : 'Create Work Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== MODULE-LEVEL FIELD HELPERS ====================
// Defined here (not inside a component) so React sees stable component identity
// and never remounts them — fixing the focus-loss-after-each-keystroke bug.

function calcTotal(start: string, end: string): string {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins < 0) mins += 1440;
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
}

const GIN = "bg-white/[0.06] border-white/[0.10] text-white placeholder:text-white/25 h-8 text-sm focus:border-[#86BBD8]/40";
const GLB = "text-white/50 text-xs";

function GlassInput({ id, label, value, onChange, placeholder, type = 'text', readOnly, autoComplete }: {
  id: string; label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; type?: string; readOnly?: boolean; autoComplete?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={GLB}>{label}</label>
      <Input id={id} type={type} value={value} readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${GIN}${readOnly ? ' opacity-60 cursor-default' : ''}`} />
    </div>
  );
}

function GlassTextarea({ id, label, value, onChange, placeholder, rows = 3, autoComplete }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; autoComplete?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={GLB}>{label}</label>
      <Textarea id={id} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows} autoComplete={autoComplete}
        className={`${GIN} h-auto resize-none`} />
    </div>
  );
}

function NAToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className="flex items-center gap-1.5 ml-auto">
      <span className={`text-xs transition-colors ${checked ? 'text-orange-400' : 'text-white/30'}`}>{label}</span>
      <div className={`w-8 h-4 rounded-full transition-colors relative ${checked ? 'bg-orange-500/50' : 'bg-white/20'}`}>
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
    </button>
  );
}

// ==================== PREDICTION ====================
const MAINT_VOCAB: string[] = [
  // Single words — complete the word being typed
  'adjusted', 'bearing', 'bearings', 'belt', 'belts', 'broken', 'calibrated',
  'checked', 'cleaned', 'compressor', 'conveyor', 'corrective', 'coupling',
  'cracked', 'damaged', 'drained', 'electrical', 'filter', 'flushed',
  'gasket', 'gaskets', 'gearbox', 'greased', 'hydraulic', 'inspected',
  'installed', 'lubricated', 'maintenance', 'mechanical', 'motor',
  'overhauled', 'pneumatic', 'preventive', 'pump', 'realigned', 'rectified',
  'refitted', 'removed', 'repaired', 'replaced', 'seal', 'seals', 'serviced',
  'shaft', 'tightened', 'tested', 'valve', 'vibration', 'welded',
  // Phrases — suggest after a space (next-word completion)
  'preventive maintenance completed', 'corrective maintenance done',
  'no further action required', 'machine running normally',
  'awaiting spare parts', 'spare parts ordered',
  'bearing worn out', 'belt worn out', 'belt slipping',
  'oil level low', 'oil leak detected', 'oil changed',
  'found and rectified', 'found fault in',
  'maintenance complete', 'works normally after repair',
  'safety hazard identified', 'lockout tagout applied',
];

function getPrediction(text: string): string {
  if (!text) return '';
  // After a space: suggest next word/phrase
  if (text.endsWith(' ') || text.endsWith('\n')) {
    const trimmed = text.trimEnd().toLowerCase();
    const phrase = MAINT_VOCAB
      .filter(v => v.includes(' '))
      .find(v => v.toLowerCase().startsWith(trimmed + ' '));
    return phrase ? phrase.slice(trimmed.length + 1) : '';
  }
  // Mid-word: complete the current word
  const last = text.split(/[\s\n]+/).pop() || '';
  if (last.length < 2) return '';
  const lower = last.toLowerCase();
  const match = MAINT_VOCAB.find(v => v.toLowerCase().startsWith(lower) && v.toLowerCase() !== lower);
  return match ? match.slice(last.length) : '';
}

function PredictiveArea({ id, label, value, onChange, placeholder, rows = 3, autoComplete }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; autoComplete?: string;
}) {
  const [ghost, setGhost] = useState('');

  const accept = () => {
    if (!ghost) return;
    onChange(value + ghost + ' ');
    setGhost('');
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className={GLB}>{label}</label>
      <Textarea
        id={id} value={value} rows={rows} autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${GIN} h-auto resize-none`}
        onChange={e => { onChange(e.target.value); setGhost(getPrediction(e.target.value)); }}
        onKeyDown={e => {
          if (e.key === 'Tab' && ghost) { e.preventDefault(); accept(); }
          else if (e.key === 'Escape') setGhost('');
        }}
        onBlur={() => setGhost('')}
      />
      {ghost && (
        <div className="flex items-center gap-2 px-0.5">
          <kbd className="text-[9px] text-white/25 bg-white/[0.05] border border-white/10 rounded px-1 py-px font-mono leading-none">Tab</kbd>
          <button type="button" onClick={accept}
            className="text-[11px] text-[#86BBD8]/60 hover:text-[#86BBD8] bg-[#86BBD8]/[0.07] hover:bg-[#86BBD8]/[0.14] px-2 py-0.5 rounded border border-[#86BBD8]/15 transition-colors max-w-[240px] truncate">
            {ghost.trim()}
          </button>
          <span className="text-white/20 text-[10px] hidden sm:inline">or click to accept</span>
        </div>
      )}
    </div>
  );
}

// ==================== WORK ORDER DETAIL MODAL ====================
interface DetailModalProps {
  workOrder: WorkOrder;
  onClose: () => void;
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

function WorkOrderDetailModal({ workOrder, onClose, onRefresh, onDelete }: DetailModalProps) {
  const [s1Open, setS1Open] = useState(false); // sneak peek by default
  const [s2Open, setS2Open] = useState(true);
  const [s3Open, setS3Open] = useState(true);
  const [savingA, setSavingA] = useState(false);
  const [savingF, setSavingF] = useState(false);

  // OT / delay are shown by default; user clicks "Mark as N/A" to hide
  const [otNA, setOtNA] = useState(false);
  const [delayNA, setDelayNA] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const [artisan, setArtisan] = useState(() => {
    const savedName = typeof window !== 'undefined' ? localStorage.getItem('maint_artisan_name') || '' : '';
    return {
      work_done_details:   workOrder.work_done_details   || '',
      cause_of_failure:    workOrder.cause_of_failure    || '',
      delay_details:       workOrder.delay_details        || '',
      time_work_started:   workOrder.time_work_started   || '',
      time_work_finished:  workOrder.time_work_finished  || '',
      total_time_worked:   workOrder.total_time_worked   || '',
      overtime_start_time: workOrder.overtime_start_time || '',
      overtime_end_time:   workOrder.overtime_end_time   || '',
      overtime_hours:      workOrder.overtime_hours      || '',
      delay_from_time:     workOrder.delay_from_time     || '',
      delay_to_time:       workOrder.delay_to_time       || '',
      total_delay_hours:   workOrder.total_delay_hours   || '',
      artisan_name: workOrder.artisan_name || workOrder.allocated_to || savedName,
      artisan_sign: workOrder.artisan_sign || '',
      artisan_date: workOrder.artisan_date || today,
      status:   workOrder.status,
      progress: workOrder.progress,
    };
  });

  const [foreman, setForeman] = useState(() => {
    const savedName = typeof window !== 'undefined' ? localStorage.getItem('maint_foreman_name') || '' : '';
    return {
      foreman_name: workOrder.foreman_name || savedName,
      foreman_sign: workOrder.foreman_sign || '',
      foreman_date: workOrder.foreman_date || today,
      notes:        workOrder.notes        || '',
      status:   workOrder.status,
      progress: workOrder.progress,
    };
  });

  const setA = (k: string, v: string | number) => setArtisan(f => ({ ...f, [k]: v }));
  const setF = (k: string, v: string | number) => setForeman(f => ({ ...f, [k]: v }));

  // Auto-calculate totals
  useEffect(() => {
    const t = calcTotal(artisan.time_work_started, artisan.time_work_finished);
    setArtisan(f => ({ ...f, total_time_worked: t }));
  }, [artisan.time_work_started, artisan.time_work_finished]);

  useEffect(() => {
    const t = calcTotal(artisan.overtime_start_time, artisan.overtime_end_time);
    setArtisan(f => ({ ...f, overtime_hours: t }));
  }, [artisan.overtime_start_time, artisan.overtime_end_time]);

  useEffect(() => {
    const t = calcTotal(artisan.delay_from_time, artisan.delay_to_time);
    setArtisan(f => ({ ...f, total_delay_hours: t }));
  }, [artisan.delay_from_time, artisan.delay_to_time]);

  // Clear fields when toggled N/A
  useEffect(() => {
    if (otNA) setArtisan(f => ({ ...f, overtime_start_time: '', overtime_end_time: '', overtime_hours: '' }));
  }, [otNA]);

  useEffect(() => {
    if (delayNA) setArtisan(f => ({ ...f, delay_from_time: '', delay_to_time: '', total_delay_hours: '' }));
  }, [delayNA]);

  const saveArtisan = async () => {
    setSavingA(true);
    if (artisan.artisan_name) localStorage.setItem('maint_artisan_name', artisan.artisan_name);
    const result = await updateWorkOrder(workOrder.id, artisan);
    setSavingA(false);
    if (result.success) { toast.success('Artisan report saved'); await onRefresh(); }
  };

  const saveForeman = async () => {
    setSavingF(true);
    if (foreman.foreman_name) localStorage.setItem('maint_foreman_name', foreman.foreman_name);
    const result = await updateWorkOrder(workOrder.id, foreman);
    setSavingF(false);
    if (result.success) { toast.success('Foreman sign-off saved'); await onRefresh(); }
  };

  const scfg = statusCfg(workOrder.status);
  const pcfg = priorityCfg(workOrder.priority);

  const Info = ({ label, value }: { label: string; value?: string | null }) => (
    <div>
      <div className="text-white/40 text-[10px] uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-white/85 text-sm">{value || '—'}</div>
    </div>
  );

  const selectCls = "bg-white/[0.06] border-white/[0.10] text-white h-8 text-sm focus:border-[#86BBD8]/40";

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="oz-glass-dark rounded-2xl w-full max-w-3xl overflow-hidden">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-[#86BBD8]/20 p-2 rounded-lg border border-[#86BBD8]/20">
              <Wrench className="h-5 w-5 text-[#86BBD8]" />
            </div>
            <div>
              <div className="text-white font-bold text-lg font-mono tracking-wide">
                #{workOrder.work_order_number}
              </div>
              <div className="text-white/55 text-sm">{workOrder.equipment_info}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${scfg.pill}`}>
              <scfg.Icon className="h-3 w-3" />{scfg.label}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${pcfg.badge}`}>
              {pcfg.label}
            </span>
            <button type="button" onClick={onClose} title="Close"
              className="bg-white/[0.08] hover:bg-white/[0.16] text-white/70 border border-white/15 rounded-lg p-1.5 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* ── SECTION 1: Work Request — sneak peek always visible ── */}
          <div className="bg-white/[0.04] rounded-xl border border-[#86BBD8]/20 overflow-hidden">
            {/* Section bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <FileText className="h-4 w-4 text-[#86BBD8]" />
              <span className="text-white/90 font-semibold text-sm">Work Request</span>
              <span className="ml-auto text-white/30 text-xs">supervisor-issued · read-only</span>
            </div>

            {/* Sneak peek — always visible */}
            <div className="px-4 pt-3 pb-2 grid grid-cols-3 gap-x-6 gap-y-2">
              <div>
                <div className="text-white/35 text-[10px] uppercase tracking-wide mb-0.5">Machine</div>
                <div className="text-white/80 text-sm truncate">{workOrder.equipment_info || '—'}</div>
              </div>
              <div>
                <div className="text-white/35 text-[10px] uppercase tracking-wide mb-0.5">Allocated To</div>
                <div className="text-white/80 text-sm truncate">{workOrder.allocated_to || workOrder.artisan_name || '—'}</div>
              </div>
              <div>
                <div className="text-white/35 text-[10px] uppercase tracking-wide mb-0.5">Date Raised</div>
                <div className="text-white/80 text-sm truncate">{workOrder.date_raised || '—'}</div>
              </div>
              {workOrder.job_request_details && (
                <div className="col-span-3 mt-1">
                  <div className="text-white/35 text-[10px] uppercase tracking-wide mb-0.5">Job</div>
                  <div className={`text-white/60 text-xs leading-relaxed ${s1Open ? '' : 'line-clamp-2'}`}>
                    {workOrder.job_request_details}
                  </div>
                </div>
              )}
            </div>

            {/* Full details — collapsible */}
            {s1Open && (
              <div className="px-4 pb-3 pt-2 border-t border-white/[0.05] grid grid-cols-2 gap-x-8 gap-y-3 mt-1">
                <Info label="Department"          value={workOrder.to_department} />
                <Info label="Estimated Hours"     value={workOrder.estimated_hours ? `${workOrder.estimated_hours} h` : ''} />
                <Info label="Requested By"        value={workOrder.requested_by} />
                <Info label="Authorising Foreman" value={workOrder.authorising_foreman} />
                {workOrder.job_instructions && (
                  <div className="col-span-2">
                    <Info label="Special Instructions" value={workOrder.job_instructions} />
                  </div>
                )}
              </div>
            )}

            {/* Toggle button */}
            <button type="button" onClick={() => setS1Open(o => !o)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 border-t border-white/[0.05] hover:bg-[#86BBD8]/[0.05] transition-colors text-[#86BBD8]/55 hover:text-[#86BBD8] text-xs">
              {s1Open
                ? <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
                : <><ChevronDown className="h-3.5 w-3.5" /> View full details</>}
            </button>
          </div>

          {/* ── SECTION 2: Artisan Report ── */}
          <div className="bg-white/[0.04] rounded-xl border border-cyan-500/20 overflow-hidden">
            <button type="button"
              className="w-full flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors"
              onClick={() => setS2Open(o => !o)}
            >
              <HardHat className="h-4 w-4 text-cyan-400" />
              <span className="text-white/90 font-semibold text-sm">Artisan Report</span>
              <span className="ml-auto text-white/35 text-xs mr-2">Fill in after completing work</span>
              {s2Open ? <ChevronUp className="h-4 w-4 text-white/35" /> : <ChevronDown className="h-4 w-4 text-white/35" />}
            </button>

            {s2Open && (
              <div className="px-4 py-4 space-y-4">

                {/* Status + Progress */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={GLB}>Status</label>
                    <Select value={artisan.status} onValueChange={v => setA('status', v)}>
                      <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#0d1f35] border-white/10 text-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="not-done">Not Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="a-progress" className={GLB}>Progress: {artisan.progress}%</label>
                    <input id="a-progress" type="range" min="0" max="100" value={artisan.progress}
                      title={`Artisan progress: ${artisan.progress}%`}
                      onChange={e => setA('progress', parseInt(e.target.value))}
                      className="w-full mt-2 accent-cyan-400" />
                  </div>
                </div>

                {/* Work Done — with phrase prediction */}
                <PredictiveArea id="a-work-done" label="Work Done — what was carried out *"
                  value={artisan.work_done_details} onChange={v => setA('work_done_details', v)}
                  placeholder="Describe exactly what was done…" rows={4} autoComplete="on" />

                {/* Cause + Delay narrative — with phrase prediction */}
                <div className="grid grid-cols-2 gap-3">
                  <PredictiveArea id="a-cause" label="Cause of Failure"
                    value={artisan.cause_of_failure} onChange={v => setA('cause_of_failure', v)}
                    placeholder="What caused the issue…" rows={3} autoComplete="on" />
                  <PredictiveArea id="a-delay-desc" label="Delay Details"
                    value={artisan.delay_details} onChange={v => setA('delay_details', v)}
                    placeholder="Any delays encountered…" rows={3} autoComplete="on" />
                </div>

                {/* Time Tracking */}
                <div className="border border-white/[0.07] rounded-lg p-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-white/45 text-xs">
                    <Timer className="h-3.5 w-3.5" /> Time Tracking
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <GlassInput id="a-t-start"  label="Time Started"      type="time"
                      value={artisan.time_work_started}  onChange={v => setA('time_work_started', v)} />
                    <GlassInput id="a-t-finish" label="Time Finished"     type="time"
                      value={artisan.time_work_finished} onChange={v => setA('time_work_finished', v)} />
                    <GlassInput id="a-t-total"  label="Total Time (auto)"
                      value={artisan.total_time_worked}  onChange={v => setA('total_time_worked', v)}
                      placeholder="auto"
                      readOnly={!!(artisan.time_work_started && artisan.time_work_finished)} />
                  </div>

                  {/* Overtime — shown by default, button to mark N/A */}
                  <div className="border-t border-white/[0.05] pt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-xs font-medium">Overtime</span>
                      <button type="button" onClick={() => setOtNA(v => !v)}
                        className={`ml-auto text-[10px] px-2 py-0.5 rounded border transition-colors ${
                          otNA
                            ? 'text-orange-400 bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
                            : 'text-white/35 bg-white/[0.05] border-white/10 hover:bg-white/[0.10] hover:text-white/60'
                        }`}>
                        {otNA ? '↩ Undo N/A' : 'Mark as N/A'}
                      </button>
                    </div>
                    {otNA ? (
                      <p className="text-orange-400/50 text-xs italic px-0.5">No overtime for this job.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        <GlassInput id="a-ot-start" label="OT Start"        type="time"
                          value={artisan.overtime_start_time} onChange={v => setA('overtime_start_time', v)} />
                        <GlassInput id="a-ot-end"   label="OT End"          type="time"
                          value={artisan.overtime_end_time}   onChange={v => setA('overtime_end_time', v)} />
                        <GlassInput id="a-ot-hrs"   label="OT Hours (auto)"
                          value={artisan.overtime_hours}      onChange={v => setA('overtime_hours', v)}
                          placeholder="auto"
                          readOnly={!!(artisan.overtime_start_time && artisan.overtime_end_time)} />
                      </div>
                    )}
                  </div>

                  {/* Delays — shown by default, button to mark N/A */}
                  <div className="border-t border-white/[0.05] pt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-xs font-medium">Delays</span>
                      <button type="button" onClick={() => setDelayNA(v => !v)}
                        className={`ml-auto text-[10px] px-2 py-0.5 rounded border transition-colors ${
                          delayNA
                            ? 'text-orange-400 bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
                            : 'text-white/35 bg-white/[0.05] border-white/10 hover:bg-white/[0.10] hover:text-white/60'
                        }`}>
                        {delayNA ? '↩ Undo N/A' : 'Mark as N/A'}
                      </button>
                    </div>
                    {delayNA ? (
                      <p className="text-orange-400/50 text-xs italic px-0.5">No delays for this job.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        <GlassInput id="a-d-from"  label="Delay From"         type="time"
                          value={artisan.delay_from_time}   onChange={v => setA('delay_from_time', v)} />
                        <GlassInput id="a-d-to"    label="Delay To"           type="time"
                          value={artisan.delay_to_time}     onChange={v => setA('delay_to_time', v)} />
                        <GlassInput id="a-d-total" label="Delay Hours (auto)"
                          value={artisan.total_delay_hours} onChange={v => setA('total_delay_hours', v)}
                          placeholder="auto"
                          readOnly={!!(artisan.delay_from_time && artisan.delay_to_time)} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Artisan Sign-off */}
                <div className="border border-white/[0.07] rounded-lg p-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-white/45 text-xs">
                    <Signature className="h-3.5 w-3.5" /> Artisan Sign-off
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <GlassInput id="a-name" label="Artisan Name"
                      value={artisan.artisan_name} onChange={v => setA('artisan_name', v)}
                      placeholder="Full name" autoComplete="name" />
                    <GlassInput id="a-sign" label="Signature (type name)"
                      value={artisan.artisan_sign} onChange={v => setA('artisan_sign', v)}
                      placeholder="Type name" autoComplete="name" />
                    <GlassInput id="a-date" label="Date" type="date"
                      value={artisan.artisan_date} onChange={v => setA('artisan_date', v)} />
                  </div>
                </div>

                <Button onClick={saveArtisan} disabled={savingA}
                  className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30">
                  <Save className="h-3.5 w-3.5 mr-2" />
                  {savingA ? 'Saving…' : 'Save Artisan Report'}
                </Button>
              </div>
            )}
          </div>

          {/* ── SECTION 3: Foreman Sign-off ── */}
          <div className="bg-white/[0.04] rounded-xl border border-violet-500/20 overflow-hidden">
            <button type="button"
              className="w-full flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors"
              onClick={() => setS3Open(o => !o)}
            >
              <ShieldCheck className="h-4 w-4 text-violet-400" />
              <span className="text-white/90 font-semibold text-sm">Foreman Sign-off</span>
              <span className="ml-auto text-white/35 text-xs mr-2">Foreman review &amp; approval</span>
              {s3Open ? <ChevronUp className="h-4 w-4 text-white/35" /> : <ChevronDown className="h-4 w-4 text-white/35" />}
            </button>

            {s3Open && (
              <div className="px-4 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={GLB}>Final Status</label>
                    <Select value={foreman.status} onValueChange={v => setF('status', v)}>
                      <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#0d1f35] border-white/10 text-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed ✓</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="not-done">Not Done</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="f-progress" className={GLB}>Confirmed Progress: {foreman.progress}%</label>
                    <input id="f-progress" type="range" min="0" max="100" value={foreman.progress}
                      title={`Foreman confirmed progress: ${foreman.progress}%`}
                      onChange={e => setF('progress', parseInt(e.target.value))}
                      className="w-full mt-2 accent-violet-400" />
                  </div>
                </div>

                <PredictiveArea id="f-notes" label="Foreman Comments"
                  value={foreman.notes} onChange={v => setF('notes', v)}
                  placeholder="Comments on work done, observations, follow-up required…"
                  rows={3} autoComplete="on" />

                <div className="border border-white/[0.07] rounded-lg p-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-white/45 text-xs">
                    <Signature className="h-3.5 w-3.5" /> Foreman Sign-off
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <GlassInput id="f-name" label="Foreman Name"
                      value={foreman.foreman_name} onChange={v => setF('foreman_name', v)}
                      placeholder="Full name" autoComplete="name" />
                    <GlassInput id="f-sign" label="Signature (type name)"
                      value={foreman.foreman_sign} onChange={v => setF('foreman_sign', v)}
                      placeholder="Type name" autoComplete="name" />
                    <GlassInput id="f-date" label="Date" type="date"
                      value={foreman.foreman_date} onChange={v => setF('foreman_date', v)} />
                  </div>
                </div>

                <Button onClick={saveForeman} disabled={savingF}
                  className="w-full bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30">
                  <Save className="h-3.5 w-3.5 mr-2" />
                  {savingF ? 'Saving…' : 'Save Foreman Sign-off'}
                </Button>
              </div>
            )}
          </div>

          {/* Delete */}
          <div className="flex justify-end pt-1">
            <button type="button"
              onClick={() => {
                if (confirm('Delete this work order? This cannot be undone.')) {
                  onDelete(workOrder.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-red-400/60 hover:text-red-400 text-xs transition-colors">
              <Trash2 className="h-3 w-3" /> Delete work order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== WORK ORDER ROW ====================
function WorkOrderRow({ workOrder, onClick }: { workOrder: WorkOrder; onClick: () => void }) {
  const scfg = statusCfg(workOrder.status);
  const pcfg = priorityCfg(workOrder.priority);
  const artisanDisplay = workOrder.allocated_to || workOrder.artisan_name || '—';

  return (
    <button type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.05] hover:bg-white/[0.04] transition-colors text-left group"
    >
      {/* Status dot */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${scfg.dot}`} />

      {/* WO # */}
      <div className="text-white/45 font-mono text-xs w-[5.5rem] flex-shrink-0 truncate">
        #{workOrder.work_order_number}
      </div>

      {/* Machine + Artisan */}
      <div className="flex-1 min-w-0">
        <div className="text-white/90 font-medium text-sm truncate">{workOrder.equipment_info}</div>
        <div className="text-white/40 text-xs truncate mt-0.5">
          {artisanDisplay}{workOrder.to_department ? ` · ${workOrder.to_department}` : ''}
        </div>
      </div>

      {/* Job snippet */}
      <div className="hidden md:block flex-1 min-w-0">
        <div className="text-white/35 text-xs truncate">{workOrder.job_request_details}</div>
      </div>

      {/* Progress */}
      <div className="w-16 flex-shrink-0 hidden sm:block">
        <div className="flex items-center gap-1.5">
          <div className="flex-1 bg-white/10 rounded-full h-1">
            <div className="bg-[#86BBD8] h-1 rounded-full transition-all"
              style={{ width: `${workOrder.progress}%` }} />
          </div>
          <span className="text-white/35 text-[10px] w-5 text-right">{workOrder.progress}%</span>
        </div>
      </div>

      {/* Status pill */}
      <div className="flex-shrink-0">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${scfg.pill}`}>
          {scfg.label}
        </span>
      </div>

      {/* Priority dot */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pcfg.dot}`} title={pcfg.label} />

      {/* Date */}
      <div className="text-white/30 text-xs flex-shrink-0 hidden lg:block w-[5.5rem]">
        {workOrder.date_raised}
      </div>

      {/* Arrow */}
      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
    </button>
  );
}

// ==================== STATUS TABS CONFIG ====================
const STATUS_TABS = [
  { key: 'all',         label: 'All' },
  { key: 'pending',     label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed',   label: 'Completed' },
  { key: 'on-hold',     label: 'On Hold' },
] as const;

// ==================== MAIN PAGE ====================
export default function MaintenancePage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHeroStats, setShowHeroStats] = useState(true);
  const [panelMinimized, setPanelMinimized] = useState(false);
  const [statusTab, setStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  // Derive selectedOrder reactively so reopening always shows the latest saved data
  const selectedOrder = useMemo(
    () => selectedOrderId ? workOrders.find(w => String(w.id) === String(selectedOrderId)) ?? null : null,
    [workOrders, selectedOrderId]
  );

  const load = async () => {
    setLoading(true);
    const data = await getWorkOrders();
    setWorkOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => calcStats(workOrders), [workOrders]);

  const filtered = useMemo(() => {
    let list = workOrders;
    if (statusTab !== 'all') list = list.filter(w => w.status === statusTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(w =>
        w.work_order_number?.toLowerCase().includes(q) ||
        w.equipment_info?.toLowerCase().includes(q) ||
        w.allocated_to?.toLowerCase().includes(q) ||
        w.artisan_name?.toLowerCase().includes(q) ||
        w.to_department?.toLowerCase().includes(q) ||
        w.job_request_details?.toLowerCase().includes(q) ||
        w.requested_by?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [workOrders, statusTab, searchQuery]);

  const tabCount = (key: string) =>
    key === 'all' ? workOrders.length : workOrders.filter(w => w.status === key).length;

  const handleCreated = (newOrder: WorkOrder) => {
    // Show immediately — don't wait for the network round-trip
    setWorkOrders(prev => [newOrder, ...prev]);
    // Refresh in the background so server-assigned IDs/fields sync in
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteWorkOrder(id);
    setSelectedOrderId(null);
    await load();
    toast.success('Work order deleted');
  };

  return (
    <PageShell>
      {/* ── HERO ── */}
      <section className="relative text-white">
        <div className="container mx-auto px-4 pt-6 pb-3">
          <div className="oz-glass-dark rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#86BBD8]/20 p-2.5 rounded-xl border border-[#86BBD8]/20">
                  <Wrench className="h-6 w-6 text-[#86BBD8]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white font-heading">Work Orders</h1>
                  <p className="text-white/50 text-sm">Maintenance management &amp; tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={load}
                  className="bg-white/[0.08] hover:bg-white/[0.16] text-white/60 border border-white/15 rounded-lg p-2 transition-colors"
                  title="Refresh">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <Button onClick={() => setShowCreateModal(true)}
                  className="bg-[#86BBD8]/25 hover:bg-[#86BBD8]/40 text-white border border-[#86BBD8]/35 gap-1.5">
                  <Plus className="h-4 w-4" /> New Work Order
                </Button>
                <button type="button" onClick={() => setShowHeroStats(s => !s)}
                  title={showHeroStats ? 'Hide stats' : 'Show stats'}
                  className="bg-white/[0.08] hover:bg-white/[0.16] text-white/50 border border-white/10 rounded-lg p-2 transition-colors">
                  {showHeroStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {showHeroStats && (
              <div className="border-t border-white/10 px-6 py-4 grid grid-cols-3 sm:grid-cols-6 gap-4">
                {[
                  { label: 'Total',       value: stats.total,      color: 'text-white' },
                  { label: 'Pending',     value: stats.pending,    color: 'text-yellow-300' },
                  { label: 'In Progress', value: stats.inProgress, color: 'text-blue-300' },
                  { label: 'Completed',   value: stats.completed,  color: 'text-green-300' },
                  { label: 'On Hold',     value: stats.onHold,     color: 'text-orange-300' },
                  { label: 'Overdue',     value: stats.overdue,    color: 'text-red-300' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── RECORDS PANEL ── */}
      <section className="relative text-white">
        <div className="container mx-auto px-4 pb-6">
          <div className="oz-glass-panel rounded-2xl overflow-hidden">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3 border-b border-white/[0.08]">
              {/* Status tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {STATUS_TABS.map(tab => {
                  const active = statusTab === tab.key;
                  return (
                    <button type="button"
                      key={tab.key}
                      onClick={() => setStatusTab(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-[#86BBD8]/30 border-[#86BBD8]/45 text-white font-semibold'
                          : 'bg-white/[0.05] border-white/[0.12] text-white/55 hover:bg-white/[0.10] hover:text-white/80'
                      }`}
                    >
                      {tab.label}
                      <span className={`ml-1.5 text-[10px] ${active ? 'text-white/75' : 'text-white/30'}`}>
                        {tabCount(tab.key)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 sm:ml-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by machine, artisan, WO#…"
                    className="bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 rounded-lg pl-8 pr-8 py-1.5 text-sm w-60 outline-none focus:border-[#86BBD8]/40 focus:bg-white/[0.10] transition-colors"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Minimize */}
                <button type="button"
                  onClick={() => setPanelMinimized(m => !m)}
                  title={panelMinimized ? 'Expand panel' : 'Minimize panel'}
                  className="bg-white/[0.08] hover:bg-white/[0.16] text-white/50 border border-white/10 rounded-lg p-1.5 transition-colors">
                  {panelMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Records list */}
            {!panelMinimized && (
              <div>
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <RefreshCw className="h-6 w-6 text-white/30 animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-white/[0.05] p-4 rounded-2xl mb-3">
                      <Wrench className="h-8 w-8 text-white/25" />
                    </div>
                    <div className="text-white/55 font-medium mb-1">
                      {searchQuery || statusTab !== 'all' ? 'No matching work orders' : 'No work orders yet'}
                    </div>
                    <div className="text-white/30 text-sm mb-4">
                      {searchQuery || statusTab !== 'all'
                        ? 'Try clearing the search or filter'
                        : 'Create the first one with "New Work Order"'}
                    </div>
                    {!searchQuery && statusTab === 'all' && (
                      <Button onClick={() => setShowCreateModal(true)} size="sm"
                        className="bg-[#86BBD8]/25 hover:bg-[#86BBD8]/40 text-white border border-[#86BBD8]/35 gap-1">
                        <Plus className="h-3.5 w-3.5" /> New Work Order
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    {filtered.map(wo => (
                      <WorkOrderRow key={wo.id} workOrder={wo} onClick={() => setSelectedOrderId(wo.id)} />
                    ))}
                    <div className="px-5 py-2.5 border-t border-white/[0.04]">
                      <span className="text-white/25 text-xs">
                        {filtered.length} of {workOrders.length} work orders
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MODALS ── */}
      <CreateWorkOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
      />

      {selectedOrder && (
        <WorkOrderDetailModal
          workOrder={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onRefresh={load}
          onDelete={handleDelete}
        />
      )}
    </PageShell>
  );
}
