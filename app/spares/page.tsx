// app/spares/page.tsx
'use client';

import { PageShell } from '@/components/PageShell';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Package, Search, Plus, Edit, Trash2, Copy, RefreshCw, AlertTriangle,
  ChevronDown, ChevronUp, ChevronRight, ShoppingCart, AlertOctagon,
  Loader2, DollarSign, List, X, Star, Eye, BarChart3, Filter,
  Shield, CheckCircle2, FileText, Printer, Truck, Cpu, MapPin,
  SortAsc, ChevronsUp, ChevronsDown, Grid3x3, MoreVertical, Check,
  Database, Tag, ClipboardList, Layers, Hash, Settings2, Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea as SA } from '@/components/ui/scroll-area';

// ─── INTERFACES ──────────────────────────────────────────────────────────────

interface Spare {
  id: number;
  stock_code: string;
  description: string;
  category?: string;
  machine_type?: string;
  current_quantity: number;
  min_quantity: number;
  max_quantity: number;
  unit_price: number;
  unit_of_measure?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  storage_location?: string;
  supplier?: string;
  safety_stock: boolean;
  notes?: string;
  lead_time_days?: number;
  last_ordered_date?: string;
  updated_at?: string;
}

interface ReqLine {
  id: string;
  spare: Spare | null;
  searchValue: string;
  qty: number;
  dropdownOpen: boolean;
}

interface SpareFormData {
  stock_code: string;
  description: string;
  category: string;
  machine_type: string;
  current_quantity: number;
  min_quantity: number;
  max_quantity: number;
  unit_price: number;
  unit_of_measure: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  storage_location: string;
  supplier: string;
  safety_stock: boolean;
  notes: string;
  lead_time_days: number;
  last_ordered_date: string;
}

interface SortConfig { field: keyof Spare | 'status'; direction: 'asc' | 'desc'; }

// ─── CONSTANTS & UTILS ───────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0);

const formatDate = (s?: string | null) => {
  if (!s) return '—';
  try { return new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return '—'; }
};

interface StockStatus { label: string; color: string; borderLeft: string; }
const getStockStatus = (current: number, min: number): StockStatus => {
  if (current <= 0) return { label: 'Out of Stock', color: '#f43f5e', borderLeft: '3px solid rgba(244,63,94,0.6)' };
  if (current <= min) return { label: 'Low Stock', color: '#f59e0b', borderLeft: '3px solid rgba(245,158,11,0.6)' };
  if (current <= min * 1.5) return { label: 'Adequate', color: '#86BBD8', borderLeft: '3px solid rgba(134,187,216,0.5)' };
  return { label: 'In Stock', color: '#34d399', borderLeft: '3px solid rgba(52,211,153,0.5)' };
};

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#f43f5e', high: '#f59e0b', medium: '#86BBD8', low: 'rgba(255,255,255,0.3)',
};
const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const glassInput = 'w-full px-3 py-2 text-sm rounded-lg bg-white/[0.07] border border-white/12 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.11] transition-all';
const glassLabel = 'text-xs font-medium text-white/55 mb-1 block';

const uid = () => Math.random().toString(36).slice(2);

// ─── API ─────────────────────────────────────────────────────────────────────

async function apiFetchAll(): Promise<Spare[]> {
  const r = await fetch(`${API_URL}/api/spares?limit=5000`);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
  const d = await r.json();
  return Array.isArray(d) ? d : d?.items ?? d?.data ?? [];
}

async function apiCreate(data: Partial<SpareFormData>): Promise<Spare> {
  const r = await fetch(`${API_URL}/api/spares`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.detail || 'Create failed'); }
  return r.json();
}

async function apiUpdate(id: number, data: Partial<SpareFormData>): Promise<Spare> {
  const r = await fetch(`${API_URL}/api/spares/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.detail || 'Update failed'); }
  return r.json();
}

async function apiDelete(id: number): Promise<void> {
  const r = await fetch(`${API_URL}/api/spares/${id}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('Delete failed');
}

// ─── SPARE CARD ──────────────────────────────────────────────────────────────

const SpareCard = React.memo(({
  spare, isFavorite, isExpanded,
  onEdit, onDelete, onFavorite, onAddToReq, onToggleExpand,
}: {
  spare: Spare; isFavorite: boolean; isExpanded: boolean;
  onEdit: (s: Spare) => void; onDelete: (id: number) => void;
  onFavorite: (id: number) => void; onAddToReq: (s: Spare) => void;
  onToggleExpand: () => void;
}) => {
  const status = getStockStatus(spare.current_quantity, spare.min_quantity);
  const pct = spare.max_quantity > 0 ? Math.min(100, (spare.current_quantity / spare.max_quantity) * 100) : 0;
  const invValue = spare.current_quantity * spare.unit_price;
  const pc = PRIORITY_COLOR[spare.priority] || '#86BBD8';

  return (
    <div
      className="group relative overflow-hidden rounded-xl transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
      style={{ background: 'rgba(5,15,28,0.75)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.10)', borderLeft: status.borderLeft }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="font-mono font-bold text-sm text-white">{spare.stock_code}</span>
              {spare.safety_stock && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#86BBD8]/20 border border-[#86BBD8]/30 text-[#86BBD8]">Safety</span>}
              {isFavorite && <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />}
            </div>
            <div className="text-xs text-white/60 line-clamp-2 leading-snug">{spare.description}</div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button onClick={() => onFavorite(spare.id)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/[0.10] text-white/30 hover:text-amber-400 transition-all">
              <Star className={`h-3 w-3 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button onClick={onToggleExpand} className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/[0.10] text-white/30 transition-all">
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/[0.10] text-white/30 transition-all">
                  <MoreVertical className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" style={{ background: 'rgba(5,15,28,0.97)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <DropdownMenuItem className="text-white/75 hover:bg-white/[0.10] focus:bg-white/[0.10] focus:text-white" onClick={() => onEdit(spare)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white/75 hover:bg-white/[0.10] focus:bg-white/[0.10] focus:text-white" onClick={() => { navigator.clipboard.writeText(spare.stock_code); toast.success('Copied'); }}>
                  <Copy className="h-4 w-4 mr-2" /> Copy Code
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-rose-400 hover:bg-rose-500/20 focus:bg-rose-500/20 focus:text-rose-300" onClick={() => onDelete(spare.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {spare.category && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white/55">{spare.category}</span>}
          <span className="text-[10px] px-1.5 py-0.5 rounded border font-medium" style={{ background: `${status.color}1a`, borderColor: `${status.color}40`, color: status.color }}>{status.label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border font-medium capitalize" style={{ background: `${pc}1a`, borderColor: `${pc}40`, color: pc }}>{spare.priority}</span>
        </div>

        {/* Stock bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[11px] text-white/40 mb-1">
            <span>Stock: <span className="text-white/65">{spare.current_quantity}</span>/{spare.max_quantity} {spare.unit_of_measure || 'UN'}</span>
            <span>Min: {spare.min_quantity}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden relative">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: status.color, opacity: 0.65 }} />
            {spare.max_quantity > 0 && spare.min_quantity > 0 && (
              <div className="absolute top-0 h-full w-px bg-white/40" style={{ left: `${Math.min(100, (spare.min_quantity / spare.max_quantity) * 100)}%` }} />
            )}
          </div>
        </div>

        {/* Price & action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">{formatCurrency(spare.unit_price)}<span className="text-[10px] text-white/35 ml-1">/{spare.unit_of_measure || 'UN'}</span></div>
            <div className="text-[10px] text-white/40">Inv: {formatCurrency(invValue)}</div>
          </div>
          <button onClick={() => onAddToReq(spare)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95" style={{ background: 'rgba(42,77,105,0.55)', border: '1px solid rgba(134,187,216,0.3)' }}>
            <ShoppingCart className="h-3 w-3" /> Add to Req
          </button>
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/[0.07] pt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {spare.supplier && <div><div className="text-white/35 mb-0.5">Supplier</div><div className="text-white/70">{spare.supplier}</div></div>}
          {spare.machine_type && <div><div className="text-white/35 mb-0.5">Machine</div><div className="text-white/70">{spare.machine_type}</div></div>}
          {spare.storage_location && <div><div className="text-white/35 mb-0.5">Location</div><div className="text-white/70">{spare.storage_location}</div></div>}
          {spare.lead_time_days ? <div><div className="text-white/35 mb-0.5">Lead Time</div><div className="text-white/70">{spare.lead_time_days} days</div></div> : null}
          {spare.last_ordered_date && <div><div className="text-white/35 mb-0.5">Last Ordered</div><div className="text-white/70">{formatDate(spare.last_ordered_date)}</div></div>}
          {spare.notes && <div className="col-span-2 mt-1 p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50">{spare.notes}</div>}
        </div>
      )}
    </div>
  );
});
SpareCard.displayName = 'SpareCard';

// ─── REQUISITION LINE ROW ─────────────────────────────────────────────────────

const RequisitionLineRow = ({
  line, allSpares, onUpdate, onRemove,
}: {
  line: ReqLine; allSpares: Spare[];
  onUpdate: (id: string, patch: Partial<ReqLine>) => void;
  onRemove: (id: string) => void;
}) => {
  const suggestions = useMemo(() => {
    const v = line.searchValue.trim();
    if (v.length < 2) return [];
    const t = v.toLowerCase();
    return allSpares.filter(s =>
      s.stock_code.toLowerCase().includes(t) || s.description.toLowerCase().includes(t)
    ).slice(0, 12);
  }, [line.searchValue, allSpares]);

  const lineTotal = (line.spare?.unit_price ?? 0) * line.qty;

  const pick = (spare: Spare) => onUpdate(line.id, { spare, searchValue: spare.stock_code, dropdownOpen: false });

  return (
    <div className="grid gap-1.5 items-center p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]"
      style={{ gridTemplateColumns: '180px 1fr 48px 96px 80px 90px 28px' }}>
      {/* Stock code combobox */}
      <div className="relative">
        <input
          type="text"
          value={line.searchValue}
          placeholder="Stock code…"
          onChange={e => onUpdate(line.id, { searchValue: e.target.value, spare: null, dropdownOpen: true })}
          onFocus={() => onUpdate(line.id, { dropdownOpen: true })}
          onBlur={() => setTimeout(() => onUpdate(line.id, { dropdownOpen: false }), 160)}
          className="w-full px-2 py-1.5 text-xs rounded-lg bg-white/[0.07] border border-white/12 text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-white/30 transition-all"
        />
        {line.dropdownOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-0.5 rounded-xl overflow-hidden shadow-2xl max-h-[220px] overflow-y-auto"
            style={{ background: 'rgba(4,12,24,0.98)', border: '1px solid rgba(255,255,255,0.15)' }}>
            {suggestions.map(s => (
              <button key={s.id} onMouseDown={() => pick(s)} className="w-full text-left px-3 py-2 hover:bg-white/[0.08] transition-all border-b border-white/[0.05] last:border-0">
                <div className="font-mono text-xs font-semibold text-white">{s.stock_code}
                  <span className="ml-2 text-[10px] text-white/40 font-normal non-mono">{s.unit_of_measure || 'UN'}</span>
                </div>
                <div className="text-[11px] text-white/50 truncate">{s.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="text-[11px] text-white/55 truncate px-1">{line.spare?.description ?? <span className="text-white/25 italic">—</span>}</div>

      {/* UoM */}
      <div className="text-[11px] text-white/40 text-center">{line.spare?.unit_of_measure ?? '—'}</div>

      {/* Qty */}
      <div className="flex items-center gap-0.5">
        <button onClick={() => onUpdate(line.id, { qty: Math.max(1, line.qty - 1) })} className="h-6 w-5 flex items-center justify-center rounded bg-white/[0.07] hover:bg-white/[0.15] text-white/50 text-sm leading-none transition-all">−</button>
        <input type="number" min={1} value={line.qty} onChange={e => onUpdate(line.id, { qty: Math.max(1, Number(e.target.value) || 1) })}
          className="w-10 text-center text-xs rounded-md bg-white/[0.07] border border-white/10 text-white focus:outline-none focus:border-white/30 py-1 transition-all" />
        <button onClick={() => onUpdate(line.id, { qty: line.qty + 1 })} className="h-6 w-5 flex items-center justify-center rounded bg-white/[0.07] hover:bg-white/[0.15] text-white/50 text-sm leading-none transition-all">+</button>
      </div>

      {/* Unit price */}
      <div className="text-xs text-white/55 text-right pr-1">{line.spare ? formatCurrency(line.spare.unit_price) : '—'}</div>

      {/* Line total */}
      <div className="text-xs font-bold text-white text-right pr-1">{line.spare ? formatCurrency(lineTotal) : '—'}</div>

      {/* Remove */}
      <button onClick={() => onRemove(line.id)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-rose-500/20 text-white/30 hover:text-rose-400 transition-all">
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

// ─── SPARE FORM DIALOG ────────────────────────────────────────────────────────

const defaultForm: SpareFormData = {
  stock_code: '', description: '', category: '', machine_type: '',
  current_quantity: 0, min_quantity: 1, max_quantity: 10,
  unit_price: 0, unit_of_measure: 'UN', priority: 'medium',
  storage_location: '', supplier: '', safety_stock: false,
  notes: '', lead_time_days: 0, last_ordered_date: '',
};

const SpareFormDialog = ({ open, onClose, onSave, editData, categories }: {
  open: boolean; onClose: () => void;
  onSave: (d: SpareFormData) => Promise<void>;
  editData?: Spare | null; categories: string[];
}) => {
  const [form, setForm] = useState<SpareFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editData ? {
      stock_code: editData.stock_code, description: editData.description,
      category: editData.category || '', machine_type: editData.machine_type || '',
      current_quantity: editData.current_quantity, min_quantity: editData.min_quantity,
      max_quantity: editData.max_quantity, unit_price: editData.unit_price,
      unit_of_measure: editData.unit_of_measure || 'UN', priority: editData.priority,
      storage_location: editData.storage_location || '', supplier: editData.supplier || '',
      safety_stock: editData.safety_stock, notes: editData.notes || '',
      lead_time_days: editData.lead_time_days || 0, last_ordered_date: editData.last_ordered_date || '',
    } : defaultForm);
  }, [editData, open]);

  const set = <K extends keyof SpareFormData>(k: K, v: SpareFormData[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.stock_code.trim()) { toast.error('Stock code is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch (e: any) { toast.error(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const section = (title: string, children: React.ReactNode) => (
    <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-3 space-y-3">
      <div className="text-[11px] font-semibold text-[#86BBD8] uppercase tracking-wider">{title}</div>
      {children}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ background: 'rgba(4,12,24,0.98)', border: '1px solid rgba(255,255,255,0.12)', maxWidth: '600px' }} className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white font-heading text-base">{editData ? 'Edit Spare Part' : 'Add New Spare Part'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          {/* Required */}
          {section('Required', <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={glassLabel}>Stock Code *</label>
                <input className={glassInput} value={form.stock_code} onChange={e => set('stock_code', e.target.value)} placeholder="e.g. 106335" disabled={!!editData} /></div>
              <div><label className={glassLabel}>Unit Price (USD) *</label>
                <input type="number" step="0.01" min="0" className={glassInput} value={form.unit_price} onChange={e => set('unit_price', parseFloat(e.target.value) || 0)} /></div>
            </div>
            <div><label className={glassLabel}>Description *</label>
              <input className={glassInput} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Part description" /></div>
          </>)}

          {/* Stock levels */}
          {section('Stock Levels', <>
            <div className="grid grid-cols-4 gap-2">
              {([['Current Qty', 'current_quantity'], ['Min Qty', 'min_quantity'], ['Max Qty', 'max_quantity']] as const).map(([lbl, key]) => (
                <div key={key}><label className={glassLabel}>{lbl}</label>
                  <input type="number" min="0" className={glassInput} value={form[key] as number} onChange={e => set(key, parseInt(e.target.value) || 0)} /></div>
              ))}
              <div><label className={glassLabel}>UoM</label>
                <input className={glassInput} value={form.unit_of_measure} onChange={e => set('unit_of_measure', e.target.value)} placeholder="UN" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div><label className={glassLabel}>Priority</label>
                <select value={form.priority} onChange={e => set('priority', e.target.value as SpareFormData['priority'])}
                  className={glassInput + ' appearance-none cursor-pointer'} style={{ colorScheme: 'dark' }}>
                  {['critical', 'high', 'medium', 'low'].map(p => <option key={p} value={p} className="bg-[#050f1c] capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Switch id="sf-ss" checked={form.safety_stock} onCheckedChange={v => set('safety_stock', v)} />
                <Label htmlFor="sf-ss" className="text-xs text-white/55 cursor-pointer">Safety Stock</Label>
              </div>
            </div>
          </>)}

          {/* Classification */}
          {section('Classification (Optional)', <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={glassLabel}>Category</label>
                <input className={glassInput} value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. CONS, PMA03" list="spare-cats" />
                <datalist id="spare-cats">{categories.slice(0, 100).map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <div><label className={glassLabel}>Machine / Equipment</label>
                <input className={glassInput} value={form.machine_type} onChange={e => set('machine_type', e.target.value)} placeholder="e.g. Crusher, Winder" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={glassLabel}>Supplier</label>
                <input className={glassInput} value={form.supplier} onChange={e => set('supplier', e.target.value)} placeholder="Supplier name" /></div>
              <div><label className={glassLabel}>Storage Location</label>
                <input className={glassInput} value={form.storage_location} onChange={e => set('storage_location', e.target.value)} placeholder="e.g. A1-S3" /></div>
            </div>
          </>)}

          {/* Additional */}
          {section('Additional Info (Optional)', <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={glassLabel}>Lead Time (days)</label>
                <input type="number" min="0" className={glassInput} value={form.lead_time_days} onChange={e => set('lead_time_days', parseInt(e.target.value) || 0)} /></div>
              <div><label className={glassLabel}>Last Ordered Date</label>
                <input type="date" className={glassInput} value={form.last_ordered_date} onChange={e => set('last_ordered_date', e.target.value)} style={{ colorScheme: 'dark' }} /></div>
            </div>
            <div><label className={glassLabel}>Notes</label>
              <textarea rows={2} className={glassInput + ' resize-none'} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes…" /></div>
          </>)}
        </div>
        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/[0.08] transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #2A4D69, #1e3a52)', border: '1px solid rgba(134,187,216,0.25)' }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {editData ? 'Update' : 'Add Spare'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SparesPage() {
  // Data
  const [spares, setSpares] = useState<Spare[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Panels visibility
  const [showHeroStats, setShowHeroStats] = useState(true);
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(true);
  const [showRequisition, setShowRequisition] = useState(false);
  const [filterPanelMinimized, setFilterPanelMinimized] = useState(false);
  const [recordsPanelMinimized, setRecordsPanelMinimized] = useState(false);
  const [expandAllCards, setExpandAllCards] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'stock_code', direction: 'asc' });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFavOnly, setShowFavOnly] = useState(false);

  // UI state
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editingSpare, setEditingSpare] = useState<Spare | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Requisition builder
  const [reqLines, setReqLines] = useState<ReqLine[]>([]);

  // Load data
  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    setRefreshing(true);
    try {
      const data = await apiFetchAll();
      setSpares(data.map(s => ({
        ...s,
        current_quantity: Number(s.current_quantity ?? 0),
        min_quantity: Number(s.min_quantity ?? 1),
        max_quantity: Number(s.max_quantity ?? 5),
        unit_price: Number(s.unit_price ?? 0),
        safety_stock: Boolean(s.safety_stock),
      })));
    } catch (e: any) {
      toast.error(`Failed to load: ${e.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Derived lists
  const categories = useMemo(() =>
    [...new Set(spares.map(s => s.category).filter(Boolean) as string[])].sort(),
    [spares]);

  // Stats
  const stats = useMemo(() => {
    const outOfStock = spares.filter(s => s.current_quantity <= 0).length;
    const lowStock = spares.filter(s => s.current_quantity > 0 && s.current_quantity <= s.min_quantity).length;
    const totalValue = spares.reduce((sum, s) => sum + s.current_quantity * s.unit_price, 0);
    const safetyCount = spares.filter(s => s.safety_stock).length;
    return { total: spares.length, outOfStock, lowStock, totalValue, categories: categories.length, safetyCount };
  }, [spares, categories]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { count: number; value: number }> = {};
    spares.forEach(s => {
      const cat = s.category || 'Uncategorised';
      if (!map[cat]) map[cat] = { count: 0, value: 0 };
      map[cat].count++;
      map[cat].value += s.current_quantity * s.unit_price;
    });
    return Object.entries(map)
      .map(([cat, d]) => ({ cat, ...d, pct: spares.length > 0 ? Math.round((d.count / spares.length) * 100) : 0 }))
      .sort((a, b) => b.count - a.count);
  }, [spares]);

  // Filtered & sorted spares
  const filteredSpares = useMemo(() => {
    let list = spares.filter(s => {
      if (showFavOnly && !favorites.has(s.id)) return false;
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && s.priority !== priorityFilter) return false;
      const status = getStockStatus(s.current_quantity, s.min_quantity).label;
      if (stockFilter === 'out' && status !== 'Out of Stock') return false;
      if (stockFilter === 'low' && status !== 'Low Stock') return false;
      if (stockFilter === 'adequate' && status !== 'Adequate') return false;
      if (stockFilter === 'in' && status !== 'In Stock') return false;
      if (search) {
        const t = search.toLowerCase();
        if (!s.stock_code.toLowerCase().includes(t) &&
            !s.description.toLowerCase().includes(t) &&
            !(s.category || '').toLowerCase().includes(t) &&
            !(s.supplier || '').toLowerCase().includes(t)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      let av: any, bv: any;
      const f = sortConfig.field;
      if (f === 'status') {
        av = getStockStatus(a.current_quantity, a.min_quantity).label;
        bv = getStockStatus(b.current_quantity, b.min_quantity).label;
      } else if (f === 'priority') {
        av = PRIORITY_ORDER[a.priority] ?? 2;
        bv = PRIORITY_ORDER[b.priority] ?? 2;
      } else {
        av = (a as any)[f] ?? '';
        bv = (b as any)[f] ?? '';
      }
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Favorites bubble to top
    if (favorites.size > 0) {
      list.sort((a, b) => {
        const af = favorites.has(a.id), bf = favorites.has(b.id);
        return af === bf ? 0 : af ? -1 : 1;
      });
    }

    return list;
  }, [spares, search, categoryFilter, priorityFilter, stockFilter, favorites, showFavOnly, sortConfig]);

  const activeFilterCount = [
    search, stockFilter !== 'all', categoryFilter !== 'all', priorityFilter !== 'all', showFavOnly,
  ].filter(Boolean).length;

  const clearFilters = () => { setSearch(''); setStockFilter('all'); setCategoryFilter('all'); setPriorityFilter('all'); setShowFavOnly(false); };

  // Handlers
  const handleSave = async (data: SpareFormData) => {
    if (editingSpare) {
      await apiUpdate(editingSpare.id, data);
      toast.success('Spare updated');
    } else {
      await apiCreate(data);
      toast.success('Spare added');
    }
    setEditingSpare(null);
    await loadData(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this spare part? This cannot be undone.')) return;
    try { await apiDelete(id); toast.success('Deleted'); await loadData(true); }
    catch (e: any) { toast.error(e.message); }
  };

  const toggleFavorite = (id: number) =>
    setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleExpand = (id: number) => {
    if (expandAllCards) { setExpandAllCards(false); setExpandedItems(new Set([id])); return; }
    setExpandedItems(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const isExpanded = (id: number) => expandAllCards || expandedItems.has(id);

  const handleToggleExpandAll = () => {
    if (expandAllCards) { setExpandAllCards(false); setExpandedItems(new Set()); }
    else { setExpandAllCards(true); setExpandedItems(new Set()); }
  };

  const handleSort = (field: SortConfig['field']) =>
    setSortConfig(prev => ({ field, direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc' }));

  // Requisition
  const addReqLine = (spare?: Spare) =>
    setReqLines(p => [...p, { id: uid(), spare: spare ?? null, searchValue: spare?.stock_code ?? '', qty: 1, dropdownOpen: false }]);

  const updateReqLine = (id: string, patch: Partial<ReqLine>) =>
    setReqLines(p => p.map(l => l.id === id ? { ...l, ...patch } : l));

  const removeReqLine = (id: string) =>
    setReqLines(p => p.filter(l => l.id !== id));

  const reqGrandTotal = reqLines.reduce((sum, l) => sum + (l.spare?.unit_price ?? 0) * l.qty, 0);

  const addToReq = (spare: Spare) => {
    setShowRequisition(true);
    addReqLine(spare);
    toast.success(`${spare.stock_code} added to requisition`);
  };

  const printRequisition = () => {
    const rows = reqLines
      .filter(l => l.spare)
      .map(l => `${l.spare!.stock_code}\t${l.spare!.description}\t${l.spare!.unit_of_measure || 'UN'}\t${l.qty}\t${formatCurrency(l.spare!.unit_price)}\t${formatCurrency((l.spare!.unit_price) * l.qty)}`)
      .join('\n');
    const text = `SPARE PARTS REQUISITION\n${'─'.repeat(80)}\nStock Code\tDescription\tUoM\tQty\tUnit Price\tTotal\n${rows}\n${'─'.repeat(80)}\nGRAND TOTAL: ${formatCurrency(reqGrandTotal)}`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(`<pre style="font-family:monospace;padding:20px">${text}</pre>`); w.print(); }
  };

  const copyRequisition = () => {
    const rows = reqLines
      .filter(l => l.spare)
      .map(l => `${l.spare!.stock_code}\t${l.spare!.description}\t${l.spare!.unit_of_measure || 'UN'}\t${l.qty}\t${formatCurrency(l.spare!.unit_price)}\t${formatCurrency((l.spare!.unit_price) * l.qty)}`)
      .join('\n');
    navigator.clipboard.writeText(`Stock Code\tDescription\tUoM\tQty\tUnit Price\tTotal\n${rows}\n\nGRAND TOTAL: ${formatCurrency(reqGrandTotal)}`);
    toast.success('Requisition copied to clipboard');
  };

  const SortBtn = ({ field, label }: { field: SortConfig['field']; label: string }) => {
    const active = sortConfig.field === field;
    const Icon = active ? (sortConfig.direction === 'asc' ? ChevronsUp : ChevronsDown) : SortAsc;
    return (
      <button onClick={() => handleSort(field)} className={`inline-flex items-center gap-1 text-[11px] transition-all ${active ? 'text-[#86BBD8]' : 'text-white/40 hover:text-white/70'}`}>
        {label} <Icon className="h-3 w-3" />
      </button>
    );
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <PageShell>
      <main className="container mx-auto px-4 py-8 space-y-4">

        {/* ─ PANEL 1: HERO ─────────────────────────────────────────────── */}
        <div className="oz-glass-dark rounded-2xl overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-[#2A4D69]/50 border border-[#86BBD8]/20 flex-shrink-0">
                <Package className="h-5 w-5 text-[#86BBD8]" />
              </div>
              <div className="min-w-0">
                <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-0.5">
                  <span>Home</span><ChevronRight className="h-3 w-3" /><span className="text-white/70 font-medium">Spares</span>
                </nav>
                <h1 className="text-xl font-bold text-white font-heading tracking-tight">Spare Parts Inventory</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => loadData(true)} disabled={refreshing} title="Refresh"
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.07] hover:bg-white/[0.15] border border-white/12 text-white/50 transition-all disabled:opacity-40">
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setShowRequisition(v => !v)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-0.5 ${showRequisition ? 'bg-[#86BBD8]/30 border-[#86BBD8]/45' : 'bg-white/[0.07] border-white/12'} border`}>
                <ShoppingCart className="h-3.5 w-3.5" /> Requisition {reqLines.length > 0 && <span className="px-1 rounded-full bg-[#86BBD8]/40 text-[10px]">{reqLines.length}</span>}
              </button>
              <button onClick={() => { setEditingSpare(null); setFormOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #2A4D69, #1e3a52)', border: '1px solid rgba(134,187,216,0.25)' }}>
                <Plus className="h-4 w-4" /> Add Spare
              </button>
              <button onClick={() => setShowHeroStats(v => !v)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.07] hover:bg-white/[0.15] border border-white/12 text-white/50 transition-all">
                {showHeroStats ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          {showHeroStats && (
            <div className="px-6 pb-4 pt-3 border-t border-white/[0.07] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Items', value: stats.total, color: '#86BBD8', onClick: clearFilters },
                { label: 'Total Value', value: formatCurrency(stats.totalValue), color: '#a78bfa', onClick: undefined },
                { label: 'Out of Stock', value: stats.outOfStock, color: '#f43f5e', onClick: () => setStockFilter('out') },
                { label: 'Low Stock', value: stats.lowStock, color: '#f59e0b', onClick: () => setStockFilter('low') },
                { label: 'Categories', value: stats.categories, color: '#34d399', onClick: undefined },
                { label: 'Safety Stock', value: stats.safetyCount, color: '#60a5fa', onClick: undefined },
              ].map(s => (
                <button key={s.label} onClick={s.onClick}
                  className={`rounded-xl p-3 text-left border border-white/[0.08] bg-white/[0.05] transition-all ${s.onClick ? 'hover:bg-white/[0.10] cursor-pointer' : 'cursor-default'}`}>
                  <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[11px] text-white/45 mt-0.5">{s.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─ PANEL 2: CATEGORY BREAKDOWN ───────────────────────────────── */}
        {categoryBreakdown.length > 0 && (
          <div className="oz-glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-[#86BBD8]" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Category Breakdown</span>
                <span className="text-[11px] text-white/35">{categoryBreakdown.length} categories — click to filter</span>
                {categoryFilter !== 'all' && (
                  <button onClick={() => setCategoryFilter('all')} className="text-[11px] px-1.5 py-0.5 rounded bg-[#86BBD8]/20 border border-[#86BBD8]/30 text-[#86BBD8]">{categoryFilter} ×</button>
                )}
              </div>
              <button onClick={() => setShowCategoryBreakdown(v => !v)} className="h-6 w-6 flex items-center justify-center rounded-md bg-white/[0.07] hover:bg-white/[0.15] text-white/50 border border-white/12 transition-all">
                {showCategoryBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>
            {showCategoryBreakdown && (
              <ScrollArea className="h-[180px]">
                <div className="p-4 flex flex-wrap gap-2">
                  {categoryBreakdown.map(({ cat, count, value, pct }) => {
                    const isActive = categoryFilter === cat;
                    return (
                      <button key={cat} onClick={() => setCategoryFilter(isActive ? 'all' : cat)}
                        className={`flex-shrink-0 rounded-xl p-2.5 text-left border transition-all duration-200 hover:-translate-y-0.5 ${isActive ? 'border-[#86BBD8]/50 bg-[#86BBD8]/15' : 'border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.09]'}`}
                        style={{ minWidth: '80px' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[11px] font-bold text-white/80">{cat}</span>
                          <span className="text-[10px] text-white/50 ml-2">{count}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-[#86BBD8]/50" style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* ─ PANEL 3: REQUISITION BUILDER ──────────────────────────────── */}
        {showRequisition && (
          <div className="oz-glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-3.5 w-3.5 text-[#86BBD8]" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Requisition / Price Builder</span>
                {reqLines.length > 0 && <span className="text-[11px] text-white/35">{reqLines.length} line{reqLines.length !== 1 ? 's' : ''} · {formatCurrency(reqGrandTotal)}</span>}
              </div>
              <div className="flex items-center gap-1.5">
                {reqLines.length > 0 && (<>
                  <button onClick={copyRequisition} className="inline-flex items-center gap-1 h-6 px-2 text-[11px] rounded-lg bg-white/[0.07] hover:bg-white/[0.15] border border-white/12 text-white/60 transition-all">
                    <Download className="h-2.5 w-2.5" /> Copy
                  </button>
                  <button onClick={printRequisition} className="inline-flex items-center gap-1 h-6 px-2 text-[11px] rounded-lg bg-white/[0.07] hover:bg-white/[0.15] border border-white/12 text-white/60 transition-all">
                    <Printer className="h-2.5 w-2.5" /> Print
                  </button>
                  <button onClick={() => setReqLines([])} className="h-6 px-2 text-[11px] rounded-lg bg-white/[0.07] hover:bg-rose-500/20 border border-white/12 hover:border-rose-500/30 text-white/40 hover:text-rose-400 transition-all">
                    Clear
                  </button>
                </>)}
                <button onClick={() => addReqLine()}
                  className="inline-flex items-center gap-1 h-6 px-2 text-[11px] rounded-lg border text-white font-medium transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(42,77,105,0.5)', borderColor: 'rgba(134,187,216,0.3)' }}>
                  <Plus className="h-2.5 w-2.5" /> Add Line
                </button>
                <button onClick={() => setShowRequisition(false)} className="h-6 w-6 flex items-center justify-center rounded-md bg-white/[0.07] hover:bg-white/[0.15] text-white/50 border border-white/12 transition-all">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-1.5">
              {reqLines.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">
                  Click <strong className="text-white/50">+ Add Line</strong> or <strong className="text-white/50">Add to Req</strong> on any spare card to build a price list.
                </div>
              ) : (<>
                {/* Column headers */}
                <div className="grid text-[10px] font-semibold text-white/35 uppercase tracking-wider px-2 pb-1"
                  style={{ gridTemplateColumns: '180px 1fr 48px 96px 80px 90px 28px' }}>
                  <div>Stock Code</div><div>Description</div><div className="text-center">UoM</div>
                  <div className="text-center">Qty</div><div className="text-right">Unit Price</div>
                  <div className="text-right">Total</div><div />
                </div>
                {reqLines.map(line => (
                  <RequisitionLineRow key={line.id} line={line} allSpares={spares} onUpdate={updateReqLine} onRemove={removeReqLine} />
                ))}
                {/* Grand total */}
                <div className="grid items-center pt-2 border-t border-white/[0.08] mt-2" style={{ gridTemplateColumns: '180px 1fr 48px 96px 80px 90px 28px' }}>
                  <div className="col-span-5 text-right pr-1 text-xs font-semibold text-white/55 uppercase tracking-wider">Grand Total</div>
                  <div className="text-right pr-1 text-base font-bold text-white">{formatCurrency(reqGrandTotal)}</div>
                  <div />
                </div>
              </>)}
            </div>
          </div>
        )}

        {/* ─ PANEL 4: FILTERS ──────────────────────────────────────────── */}
        <div className="oz-glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-[#86BBD8]" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Filters</span>
              {activeFilterCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#86BBD8]/20 border border-[#86BBD8]/30 text-[#86BBD8]">{activeFilterCount} active</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="h-6 px-2 flex items-center gap-1 rounded-md bg-white/[0.07] hover:bg-white/[0.15] text-white/50 text-[11px] border border-white/12 transition-all">
                  <X className="h-2.5 w-2.5" /> Clear
                </button>
              )}
              <button onClick={() => setFilterPanelMinimized(v => !v)} className="h-6 w-6 flex items-center justify-center rounded-md bg-white/[0.07] hover:bg-white/[0.15] text-white/50 border border-white/12 transition-all">
                {filterPanelMinimized ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </button>
            </div>
          </div>
          {!filterPanelMinimized && (
            <div className="px-5 pb-4 pt-3 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                <input type="text" placeholder="Search stock code, description, category, supplier…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 w-full text-sm rounded-lg bg-white/[0.07] border border-white/12 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.11] transition-all" />
              </div>

              {/* Stock status */}
              <div>
                <div className="text-[11px] text-white/45 mb-1.5">Stock Status</div>
                <div className="flex flex-wrap gap-1.5">
                  {[['all', 'All'], ['out', 'Out of Stock'], ['low', 'Low Stock'], ['adequate', 'Adequate'], ['in', 'In Stock']].map(([v, l]) => (
                    <button key={v} onClick={() => setStockFilter(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${stockFilter === v ? 'bg-[#86BBD8]/30 border-[#86BBD8]/45 text-white font-semibold' : 'bg-white/[0.05] border-white/12 text-white/60 hover:bg-white/[0.12] hover:text-white/90'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <div className="text-[11px] text-white/45 mb-1.5">Priority</div>
                <div className="flex flex-wrap gap-1.5">
                  {[['all', 'All'], ['critical', 'Critical'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']].map(([v, l]) => (
                    <button key={v} onClick={() => setPriorityFilter(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${priorityFilter === v ? 'bg-[#86BBD8]/30 border-[#86BBD8]/45 text-white font-semibold' : 'bg-white/[0.05] border-white/12 text-white/60 hover:bg-white/[0.12] hover:text-white/90'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom row: sort + favorites */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-2 text-[11px] text-white/45">
                  <span className="font-semibold uppercase tracking-wider">Sort:</span>
                  <SortBtn field="stock_code" label="Code" />
                  <SortBtn field="description" label="Description" />
                  <SortBtn field="unit_price" label="Price" />
                  <SortBtn field="current_quantity" label="Stock" />
                  <SortBtn field="priority" label="Priority" />
                  <SortBtn field="category" label="Category" />
                </div>
                <button onClick={() => setShowFavOnly(v => !v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${showFavOnly ? 'bg-amber-400/20 border-amber-400/35 text-amber-300' : 'bg-white/[0.05] border-white/12 text-white/50 hover:bg-white/[0.12]'}`}>
                  <Star className={`h-3 w-3 ${showFavOnly ? 'fill-amber-400 text-amber-400' : ''}`} /> Favorites{favorites.size > 0 && ` (${favorites.size})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─ PANEL 5: RECORDS ──────────────────────────────────────────── */}
        <div className="oz-glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-[#86BBD8]" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Records</span>
              <span className="text-[11px] text-white/35">{filteredSpares.length} of {spares.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {viewMode === 'grid' && (
                <button onClick={handleToggleExpandAll} title={expandAllCards ? 'Collapse all' : 'Expand all'}
                  className="h-7 px-2 inline-flex items-center gap-1 text-[11px] rounded-lg bg-white/[0.07] hover:bg-white/[0.15] border border-white/12 text-white/50 transition-all">
                  {expandAllCards ? <ChevronsUp className="h-3 w-3" /> : <ChevronsDown className="h-3 w-3" />}
                  {expandAllCards ? 'Collapse' : 'Expand'}
                </button>
              )}
              <div className="flex rounded-lg border border-white/12 overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`h-7 w-7 flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-[#86BBD8]/30 text-white' : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.12]'}`}>
                  <Grid3x3 className="h-3 w-3" />
                </button>
                <button onClick={() => setViewMode('table')} className={`h-7 w-7 flex items-center justify-center border-l border-white/12 transition-all ${viewMode === 'table' ? 'bg-[#86BBD8]/30 text-white' : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.12]'}`}>
                  <List className="h-3 w-3" />
                </button>
              </div>
              <button onClick={() => setRecordsPanelMinimized(v => !v)} className="h-6 w-6 flex items-center justify-center rounded-md bg-white/[0.07] hover:bg-white/[0.15] text-white/50 border border-white/12 transition-all">
                {recordsPanelMinimized ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {!recordsPanelMinimized && (
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-white/30" /></div>
              ) : filteredSpares.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-12 w-12 mx-auto text-white/15 mb-4" />
                  <div className="text-white/50 text-base font-medium mb-2">No spare parts found</div>
                  <div className="text-white/30 text-sm mb-6">
                    {spares.length === 0 ? 'Add your first spare part or run the seed script to import the stock list.' : 'Try adjusting your filters.'}
                  </div>
                  {activeFilterCount > 0 ? (
                    <button onClick={clearFilters} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/70 hover:text-white bg-white/[0.07] border border-white/12 transition-all">
                      <X className="h-4 w-4" /> Clear Filters
                    </button>
                  ) : (
                    <button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'rgba(42,77,105,0.6)', border: '1px solid rgba(134,187,216,0.25)' }}>
                      <Plus className="h-4 w-4" /> Add Spare Part
                    </button>
                  )}
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredSpares.map(spare => (
                    <SpareCard key={spare.id} spare={spare}
                      isFavorite={favorites.has(spare.id)} isExpanded={isExpanded(spare.id)}
                      onEdit={s => { setEditingSpare(s); setFormOpen(true); }}
                      onDelete={handleDelete} onFavorite={toggleFavorite}
                      onAddToReq={addToReq} onToggleExpand={() => toggleExpand(spare.id)} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.07] hover:bg-transparent">
                        {[['Stock Code', 'stock_code'], ['Description', 'description'], ['Category', 'category'], ['Machine', 'machine_type'], ['Stock', 'current_quantity'], ['Unit Price', 'unit_price'], ['Value', null], ['Status', 'status'], ['Priority', 'priority']].map(([label, field]) => (
                          <TableHead key={label as string}
                            className={`text-white/55 bg-white/[0.05] ${field ? 'cursor-pointer hover:text-white/80' : ''}`}
                            onClick={() => field && handleSort(field as SortConfig['field'])}>
                            <div className="flex items-center gap-1">
                              {label as string}
                              {field && sortConfig.field === field && (sortConfig.direction === 'asc' ? <ChevronsUp className="h-3 w-3 text-[#86BBD8]" /> : <ChevronsDown className="h-3 w-3 text-[#86BBD8]" />)}
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="text-white/55 bg-white/[0.05] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSpares.map(spare => {
                        const st = getStockStatus(spare.current_quantity, spare.min_quantity);
                        const pc2 = PRIORITY_COLOR[spare.priority] || '#86BBD8';
                        return (
                          <TableRow key={spare.id} className="border-white/[0.06] hover:bg-white/[0.05] cursor-pointer">
                            <TableCell className="font-mono font-semibold text-white text-xs">{spare.stock_code}</TableCell>
                            <TableCell className="text-white/75 text-xs max-w-[220px]"><div className="truncate">{spare.description}</div></TableCell>
                            <TableCell><span className="text-[11px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white/55">{spare.category || '—'}</span></TableCell>
                            <TableCell className="text-white/55 text-xs">{spare.machine_type || '—'}</TableCell>
                            <TableCell>
                              <div className="text-xs text-white/75">{spare.current_quantity}/{spare.max_quantity}</div>
                              <div className="h-1 w-16 rounded-full bg-white/10 mt-1 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${Math.min(100, (spare.current_quantity / (spare.max_quantity || 1)) * 100)}%`, backgroundColor: st.color, opacity: 0.65 }} />
                              </div>
                            </TableCell>
                            <TableCell className="text-white/75 text-xs">{formatCurrency(spare.unit_price)}</TableCell>
                            <TableCell className="text-white/55 text-xs">{formatCurrency(spare.current_quantity * spare.unit_price)}</TableCell>
                            <TableCell><span className="text-[11px] px-1.5 py-0.5 rounded border font-medium" style={{ background: `${st.color}1a`, borderColor: `${st.color}40`, color: st.color }}>{st.label}</span></TableCell>
                            <TableCell><span className="text-[11px] px-1.5 py-0.5 rounded border font-medium capitalize" style={{ background: `${pc2}1a`, borderColor: `${pc2}40`, color: pc2 }}>{spare.priority}</span></TableCell>
                            <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                <button className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-[#86BBD8]/20 text-white/40 hover:text-[#86BBD8] transition-all" onClick={() => addToReq(spare)} title="Add to requisition">
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                </button>
                                <button className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.15] text-white/40 transition-all" onClick={() => { setEditingSpare(spare); setFormOpen(true); }}>
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-all" onClick={() => handleDelete(spare.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>

      </main>

      {/* Form Dialog */}
      <SpareFormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditingSpare(null); }}
        onSave={handleSave} editData={editingSpare} categories={categories} />

    </PageShell>
  );
}
