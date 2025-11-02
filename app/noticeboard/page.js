// components/NoticeboardManagement.js - LARGER, VIBRANT LUCIDE ICONS (ATTEMPT 11)
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { 
    Bell, Pin, Plus, Search, Trash2, Edit, ChevronDown, Filter, Calendar, Users, ListFilter, X, Eye, 
    Clock, Tag, Paperclip, Download, FileText, LayoutList, LayoutGrid, FileArchive, CornerDownLeft, Upload, 
    AlertTriangle, FileCheck2, MinusCircle, CheckCircle, Clock3, Loader, ArrowDown, AlertOctagon,
    AlertCircle 
} from 'lucide-react';

// --- Placeholder Components (Unchanged) ---
const Button = ({ children, variant = 'default', className = '', onClick, disabled = false, type = 'button' }) => {
    let baseStyle = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm flex items-center justify-center gap-2';
    switch (variant) {
        case 'primary': 
            baseStyle += ' bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/30';
            break;
        case 'secondary':
            baseStyle += ' bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30';
            break;
        case 'outline':
            baseStyle += ' bg-white text-slate-700 border border-slate-300 hover:bg-slate-50';
            break;
        case 'ghost':
            baseStyle += ' bg-transparent text-slate-600 hover:bg-slate-100 shadow-none';
            break;
        case 'destructive':
            baseStyle += ' bg-red-600 text-white hover:bg-red-700 shadow-red-600/30';
            break;
        default:
            baseStyle += ' bg-slate-200 text-slate-800 hover:bg-slate-300';
    }
    return <button type={type} className={`${baseStyle} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Input = ({ placeholder, value, onChange, className = '', type = 'text', id, accept, required, min }) => 
    <input 
        type={type} 
        id={id} 
        className={`w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`} 
        placeholder={placeholder} 
        value={type !== 'file' ? value : undefined} 
        onChange={onChange} 
        accept={accept} 
        required={required}
        min={min}
    />;

const Checkbox = ({ checked, onCheckedChange }) => 
    <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />;

const Dialog = ({ children }) => <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100] p-4">{children}</div>;
const DialogContent = ({ children, className = '' }) => <div className={`bg-white w-full max-w-3xl rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] ${className}`}>{children}</div>;
const DialogHeader = ({ children }) => <div className="border-b border-slate-100 p-6 flex justify-between items-center">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="text-2xl font-bold text-slate-800">{children}</h2>;
const DialogFooter = ({ children }) => <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">{children}</div>;
const Label = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700 mb-1 block">{children}</label>;

const Select = ({ children, onValueChange, value, placeholder, className = '' }) => (
    <div className={`relative ${className}`}>
        <select onChange={(e) => onValueChange(e.target.value)} value={value} className="w-full p-2.5 border border-slate-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-700">
            <option value="" disabled className="text-slate-400">{placeholder}</option>
            {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
    </div>
);
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
// --- End of Placeholder Components ---

// --- Data & Helpers ---
const CATEGORIES = ["HR", "Safety", "IT", "General", "Operations", "Finance"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const STATUSES = ["Draft", "Active", "Archived"];

const initialNotices = [
    { id: 1, title: "Q4 Performance Review Schedule", content: "All team leads must submit final reports by November 15th to the HR portal. Personalized review slots will be distributed next week. Ensure all direct reports have submitted their self-assessments.", date: "2025-11-01", category: "HR", priority: "High", status: "Active", isPinned: true, attachment: { name: "ReviewGuidelines.pdf", url: "/files/review-2025.pdf", size: '1.2 MB' } },
    { id: 2, title: "Mandatory Fire Drill Tomorrow", content: "We will be conducting a building-wide fire drill tomorrow at 10 AM. Please evacuate immediately to Muster Point C upon hearing the alarm. This is a mandatory exercise.", date: "2025-11-01", category: "Safety", priority: "Critical", status: "Active", isPinned: true, attachment: { name: "SafetyMap.png", url: "/files/fire-drill-map.png", size: '320 KB' } },
    { id: 3, title: "Server Maintenance Tonight", content: "The main server will undergo critical maintenance tonight from 11 PM to 3 AM. Please save all work and log out before 11 PM. Network services will be intermittent during this window.", date: "2025-10-31", category: "IT", priority: "Medium", status: "Active", isPinned: false, attachment: null },
    { id: 4, title: "Draft: Q1 Budget Proposal", content: "Initial draft of the Q1 budget is available for team lead review. Please submit feedback by Friday.", date: "2025-11-02", category: "Finance", priority: "Low", status: "Draft", isPinned: false, attachment: null },
    { id: 5, title: "New Coffee Machine in Break Room!", content: "Enjoy the new espresso machine in the 3rd-floor break room. Remember to keep the area clean!", date: "2025-10-30", category: "General", priority: "Low", status: "Archived", isPinned: false, attachment: null },
];

/**
 * ⬆️ LARGER, VIBRANT LUCIDE ICON STYLING (Attempt 11)
 * Increased icon sizes for more prominence while retaining distinct icons and elegant colors.
 */
const getPriorityStyle = (priority) => {
    switch (priority) {
        case 'Critical': 
            return { 
                classes: 'bg-red-50 text-red-800 border-red-200 font-bold', 
                // Increased to h-5 w-5 (20px)
                icon: <AlertOctagon className="h-5 w-5 stroke-[2.5]" color="#D00000" fill="#FEE2E2" /> 
            };
        case 'High': 
            return { 
                classes: 'bg-orange-50 text-orange-800 border-orange-200 font-semibold', 
                // Increased to h-[1.125rem] w-[1.125rem] (18px)
                icon: <AlertTriangle className="h-[1.125rem] w-[1.125rem] stroke-[2]" color="#FF8800" fill="#FFEDD5" />
            };
        case 'Medium': 
            return { 
                classes: 'bg-teal-50 text-teal-800 border-teal-200 font-medium', 
                // Increased to h-4 w-4 (16px)
                icon: <AlertCircle className="h-4 w-4 stroke-[1.8]" color="#43AA8B" fill="#F0FDFA" /> 
            };
        case 'Low': 
            return { 
                classes: 'bg-slate-50 text-slate-700 border-slate-200 font-normal', 
                // Increased to h-[0.875rem] w-[0.875rem] (14px)
                icon: <MinusCircle className="h-[0.875rem] w-[0.875rem] stroke-[1.5]" color="#778DA9" fill="#F8FAFC" /> 
            };
        default: 
            return { 
                classes: 'bg-slate-100 text-slate-600 border-slate-300 font-normal', 
                icon: <MinusCircle className="h-4 w-4" /> 
            };
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-700 border border-green-300 font-semibold';
        case 'Draft': return 'bg-slate-100 text-slate-500 border border-slate-300 font-normal';
        case 'Archived': return 'bg-gray-100 text-gray-500 border border-gray-300 font-normal';
        default: return 'bg-slate-100 text-slate-600 border-slate-300';
    }
};

const MetricCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
        <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">{title}</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);


// --- CRUD Modal Component (Unchanged) ---
const NoticeModal = ({ isOpen, onClose, notice, onSave }) => {
    const [formData, setFormData] = useState(notice || { 
        title: '', content: '', date: new Date().toISOString().substring(0, 10), 
        category: CATEGORIES[0], priority: PRIORITIES[2], status: STATUSES[0], isPinned: false,
        attachment: null
    });
    
    const [tempFile, setTempFile] = useState(null); 

    const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newAttachment = {
                name: file.name,
                url: `/temp-upload/${Date.now()}-${file.name}`,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB' 
            };
            setFormData(prev => ({ ...prev, attachment: newAttachment }));
            setTempFile(file);
        } else {
            setFormData(prev => ({ ...prev, attachment: null }));
            setTempFile(null);
        }
    };

    const handleRemoveAttachment = () => {
        setFormData(prev => ({ ...prev, attachment: null }));
        setTempFile(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = null;
    };

    const handleSave = (e) => {
        e.preventDefault(); 
        if (!formData.title || !formData.content) {
            alert("Title and content are required.");
            return;
        }
        
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <Dialog>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{notice ? 'Edit Notice: ' + notice.title : 'Create New Notice'}</DialogTitle>
                    <Button onClick={onClose} variant="ghost" className="p-1.5"><X className="h-5 w-5 text-slate-500" /></Button>
                </DialogHeader>
                <form onSubmit={handleSave}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
                        {/* Main Content (Spans 2/3) */}
                        <div className="space-y-5 col-span-2">
                            <div className="space-y-1">
                                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                                <Input id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="E.g., System Update Schedule" required />
                            </div>
                            
                            <div className="space-y-1">
                                <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
                                <textarea id="content" value={formData.content} onChange={(e) => handleChange('content', e.target.value)} className="w-full h-40 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Type the full announcement content here..." required />
                            </div>
                            
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <Checkbox checked={formData.isPinned} onCheckedChange={(val) => handleChange('isPinned', val)} id="isPinned" />
                                <Label htmlFor="isPinned" className="!mb-0 font-medium text-slate-700 cursor-pointer">Pin this notice (**Top Priority Visibility**)</Label>
                            </div>
                        </div>
                        
                        {/* Settings Panel (Spans 1/3) */}
                        <div className="space-y-5 col-span-1 border-l pl-6 border-slate-100">
                            
                            <div className="space-y-1">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(val) => handleChange('category', val)} placeholder="Select Category">
                                    {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </Select>
                            </div>
                            
                            <div className="space-y-1">
                                <Label htmlFor="priority">Priority Level</Label>
                                <Select value={formData.priority} onValueChange={(val) => handleChange('priority', val)} placeholder="Select Priority">
                                    {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(val) => handleChange('status', val)} placeholder="Select Status">
                                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="date">Publish Date</Label>
                                <Input id="date" type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} min={new Date().toISOString().substring(0, 10)} />
                            </div>
                            
                            <div className="space-y-1 pt-2">
                                <Label htmlFor="file-upload" className="flex items-center gap-2 mb-1">
                                    <Paperclip className="h-4 w-4 text-blue-600" /> Attachment
                                </Label>
                                
                                {formData.attachment ? (
                                    <div className="flex justify-between items-center bg-blue-50 p-2 rounded-lg text-sm border border-blue-200">
                                        <span className="truncate flex-1 font-medium text-blue-800">{formData.attachment.name}</span>
                                        <Button onClick={handleRemoveAttachment} variant="ghost" className="ml-3 p-1 text-red-600 hover:bg-red-100">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors bg-slate-50">
                                        <Input 
                                            id="file-upload" 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer text-sm font-semibold text-blue-600 flex flex-col items-center justify-center gap-1">
                                            <Upload className="h-5 w-5" />
                                            <span>Click to Upload File</span> 
                                            <span className="text-xs font-normal text-slate-500">(Max 5MB PDF, DOC, Image)</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">
                            {notice ? 'Update Notice' : 'Publish Notice'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


// --- Side Panel Preview Component ---
const NoticePreview = ({ notice, onClose, onEdit }) => {
    if (!notice) return (
        <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg border border-slate-100">
            <CornerDownLeft className="h-12 w-12 mb-4 text-slate-300" />
            <p className="font-semibold text-lg">Select a notice to view details</p>
            <p className="text-sm text-slate-500">The full content, attachments, and metadata will display here.</p>
        </div>
    );

    const publishDate = new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const priorityStyle = getPriorityStyle(notice.priority); 

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 h-full flex flex-col">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="h-6 w-6 text-blue-600" /> Notice Detail
                </h3>
                <Button onClick={onClose} variant="ghost" className="p-1 hover:bg-slate-100">
                    <X className="h-5 w-5 text-slate-500" />
                </Button>
            </div>

            <div className="space-y-5 flex-1 overflow-y-auto pr-2">
                <div className="flex flex-wrap gap-2">
                    {/* VIBRANT LUCIDE PRIORITY BADGE */}
                    <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${priorityStyle.classes}`}>
                        {priorityStyle.icon} {notice.priority}
                    </span>
                    {/* REFINED STATUS BADGE */}
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(notice.status)}`}>
                        {notice.status}
                    </span>
                    {/* Pinned Badge (using filled icon for strong visibility) */}
                    {notice.isPinned && <span className="px-3 py-1 text-xs font-bold rounded-full border bg-orange-600 text-white flex items-center gap-1"><Pin className="h-3 w-3 fill-white" /> PINNED</span>}
                </div>

                <h2 className="text-3xl font-extrabold text-slate-800 leading-tight">{notice.title}</h2>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 border-y py-3 border-slate-100">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /> **Published:** {publishDate}</div>
                    <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-slate-400" /> **Category:** {notice.category}</div>
                </div>

                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    <p className="font-bold mb-2 text-slate-800">Content:</p>
                    <p>{notice.content}</p>
                </div>
                
                {notice.attachment && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                        <p className="text-sm font-bold text-blue-800 flex items-center gap-2">
                            <Paperclip className="h-4 w-4" /> Attached Document
                        </p>
                        <div className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-slate-100">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                <FileText className="h-5 w-5 text-blue-500" /> 
                                {notice.attachment.name} 
                                <span className="text-xs text-slate-400 ml-2">({notice.attachment.size})</span>
                            </span>
                            <a 
                                href={notice.attachment.url} 
                                download={notice.attachment.name} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
                            >
                                <Download className="h-4 w-4" /> Download
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-slate-100">
                 <Button onClick={() => onEdit(notice)} variant="secondary" className="w-full">
                    {/* ENHANCED STROKE FOR EDIT BUTTON */}
                    <Edit className="h-4 w-4 stroke-[2.5]" /> Edit Notice
                 </Button>
            </div>
        </div>
    );
};

// --- Grid Card Component ---
const NoticeCard = ({ notice, selected, onPinToggle, onEdit, onPreview }) => {
    const priorityStyle = getPriorityStyle(notice.priority); 

    return (
        <div 
            className={`bg-white rounded-xl shadow-lg border p-5 space-y-3 transition-all cursor-pointer 
                ${selected ? 'border-4 border-blue-400 ring-4 ring-blue-50' : 'border-slate-100 hover:shadow-xl hover:border-blue-200'}
            `}
            onClick={() => onPreview(notice)}
        >
            <div className="flex justify-between items-start border-b pb-3 mb-2">
                <div className="flex flex-wrap gap-2">
                    {/* VIBRANT LUCIDE PRIORITY BADGE */}
                    <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${priorityStyle.classes}`}>
                        {priorityStyle.icon} {notice.priority}
                    </span>
                    {/* REFINED STATUS BADGE */}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(notice.status)}`}>
                        {notice.status}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {notice.attachment && <Paperclip className="h-4 w-4 text-blue-600" title="Has Attachment" />}
                    <Button onClick={(e) => { e.stopPropagation(); onPinToggle(notice.id, notice.isPinned); }} variant="ghost" className={`p-1.5 rounded-full ${notice.isPinned ? 'text-orange-600 bg-orange-100 hover:bg-orange-200' : 'text-slate-500 hover:bg-slate-100'}`}>
                        {/* ENHANCED STROKE FOR PIN BUTTON */}
                        <Pin className="h-4 w-4 stroke-[2.5]" />
                    </Button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{notice.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3 h-14">{notice.content}</p>
            
            <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-500 space-y-1">
                    <p className='flex items-center gap-1'>
                        <Tag className='h-3 w-3' /> **{notice.category}**
                    </p>
                    <p className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3' /> {new Date(notice.date).toLocaleDateString()}
                    </p>
                </div>
                <Button onClick={(e) => { e.stopPropagation(); onEdit(notice); }} variant="secondary" className="p-2">
                    {/* ENHANCED STROKE FOR EDIT BUTTON */}
                    <Edit className="h-4 w-4 stroke-[2.5]" />
                </Button>
            </div>
        </div>
    );
};


// --- MAIN NOTICEBOARD COMPONENT ---
export default function NoticeboardManagement() {
    const [data, setData] = useState(initialNotices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters, setFilters] = useState({ category: '', priority: '', status: '' });
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [sorting, setSorting] = useState([{ id: 'date', desc: true }]); 
    const [viewMode, setViewMode] = useState('list'); 

    const metrics = useMemo(() => ({
        total: data.length,
        active: data.filter(n => n.status === 'Active').length,
        pinned: data.filter(n => n.isPinned).length,
        drafts: data.filter(n => n.status === 'Draft').length,
    }), [data]);

    const handleEditNotice = (notice) => {
        setEditingNotice(notice);
        setIsModalOpen(true);
    };

    const handleSaveNotice = (newNotice) => {
        if (newNotice.id) {
            setData(data.map(n => n.id === newNotice.id ? newNotice : n));
        } else {
            const newId = Math.max(...data.map(n => n.id), 0) + 1;
            setData([{ ...newNotice, id: newId }, ...data]); 
        }
        setIsModalOpen(false);
        setEditingNotice(null);
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedRows.length} notice(s)?`)) {
            setData(data.filter(n => !selectedRows.includes(n.id)));
            setSelectedRows([]);
            setSelectedPreview(null);
        }
    };

    const handleBulkArchive = () => {
        setData(data.map(n => selectedRows.includes(n.id) ? { ...n, status: 'Archived', isPinned: false } : n));
        setSelectedRows([]);
        setSelectedPreview(null);
    };

    const handlePinToggle = (id, currentPinStatus) => {
        setData(data.map(n => n.id === id ? { ...n, isPinned: !currentPinStatus } : n));
    };
    
    const filteredAndSortedData = useMemo(() => {
        let items = [...data];
        
        if (globalFilter) {
            items = items.filter(n => 
                n.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
                n.content.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }

        if (filters.category) { items = items.filter(n => n.category === filters.category); }
        if (filters.priority) { items = items.filter(n => n.priority === filters.priority); }
        if (filters.status) { items = items.filter(n => n.status === filters.status); }

        const [sortColumn] = sorting;
        if (sortColumn) {
            items.sort((a, b) => {
                if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
                
                const aValue = a[sortColumn.id];
                const bValue = b[sortColumn.id];
                
                if (aValue < bValue) return sortColumn.desc ? 1 : -1;
                if (aValue > bValue) return sortColumn.desc ? -1 : 1;
                return 0;
            });
        }
        
        return items;
    }, [data, globalFilter, filters, sorting]);

    const handleRowSelect = (id) => {
        setSelectedRows(prev => {
            const newSelected = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            return newSelected;
        });
    };

    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? filteredAndSortedData.map(n => n.id) : []);
    };
    
    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            
            <header className="mb-8 flex justify-between items-center pb-4 border-b border-slate-200">
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
                    {/* ENHANCED STROKE FOR BELL ICON */}
                    <Bell className="h-8 w-8 text-orange-600 stroke-[2.5]" />
                    Digital Noticeboard Management
                </h1>
                <Button 
                    onClick={() => { setEditingNotice(null); setIsModalOpen(true); }}
                    variant="primary"
                    className="px-6 py-3"
                >
                    {/* ENHANCED STROKE FOR PLUS ICON */}
                    <Plus className="h-5 w-5 stroke-[2.5]" />
                    Create New Notice
                </Button>
            </header>

            {/* --- Dashboard Metrics (Unchanged) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    title="Total Notices" 
                    value={metrics.total} 
                    icon={<FileText className="h-6 w-6 text-orange-600" />} 
                    color="bg-orange-100" 
                />
                <MetricCard 
                    title="Active Notices" 
                    value={metrics.active} 
                    icon={<FileCheck2 className="h-6 w-6 text-green-600" />} 
                    color="bg-green-100" 
                />
                <MetricCard 
                    title="Pinned Notices" 
                    value={metrics.pinned} 
                    // ENHANCED STROKE FOR PIN ICON in Metric Card
                    icon={<Pin className="h-6 w-6 text-red-600 stroke-[2.5]" />} 
                    color="bg-red-100" 
                />
                <MetricCard 
                    title="Drafts" 
                    icon={<Edit className="h-6 w-6 text-blue-600" />} 
                    color="bg-blue-100" 
                    value={metrics.drafts} 
                />
            </div>
            
            {/* --- Controls and Filtering --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-8 space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 min-w-[250px] max-w-lg">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search titles, content, categories..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-10 pr-4"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <ListFilter className="h-5 w-5 text-slate-500 min-w-[1.25rem]" />
                        
                        <Select value={filters.category} onValueChange={(val) => setFilters(prev => ({ ...prev, category: val }))} placeholder="Category" className="min-w-[120px]">
                            <SelectItem value="">All Categories</SelectItem>
                            {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </Select>

                        <Select value={filters.priority} onValueChange={(val) => setFilters(prev => ({ ...prev, priority: val }))} placeholder="Priority" className="min-w-[120px]">
                            <SelectItem value="">All Priorities</SelectItem>
                            {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </Select>

                        <div className="border border-slate-200 rounded-lg p-1 flex">
                            <Button 
                                onClick={() => setViewMode('list')} 
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                                className={`p-2 h-9 w-9 ${viewMode === 'list' ? 'shadow-lg' : ''}`}
                                title="List View"
                            >
                                <LayoutList className="h-5 w-5" />
                            </Button>
                            <Button 
                                onClick={() => setViewMode('grid')} 
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                                className={`p-2 h-9 w-9 ${viewMode === 'grid' ? 'shadow-lg' : ''}`}
                                title="Grid View"
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {selectedRows.length > 0 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between mt-4 shadow-sm">
                        <p className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            {selectedRows.length} notices selected
                        </p>
                        <div className="flex gap-3">
                            <Button onClick={handleBulkArchive} variant="secondary" className="px-4 py-2">
                                <FileArchive className="h-4 w-4" /> Bulk Archive
                            </Button>
                            <Button onClick={handleBulkDelete} variant="destructive" className="px-4 py-2">
                                {/* ENHANCED STROKE FOR TRASH ICON */}
                                <Trash2 className="h-4 w-4 stroke-[2.5]" /> Delete
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Content Layout: List/Grid and Preview --- */}
            <div className="grid grid-cols-12 gap-6">
                
                {/* Content Area (List/Grid) */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden min-h-[60vh]">
                    <div className="p-6">
                        
                        {/* List View (Table) */}
                        {viewMode === 'list' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-3 py-3 w-10 text-left">
                                                <Checkbox 
                                                    checked={selectedRows.length === filteredAndSortedData.length && filteredAndSortedData.length > 0} 
                                                    onCheckedChange={handleSelectAll} 
                                                />
                                            </th>
                                            {['title', 'priority', 'category', 'date'].map(colId => (
                                                <th key={colId} className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                    <Button 
                                                        variant="ghost" 
                                                        onClick={() => setSorting([{ id: colId, desc: sorting.some(s => s.id === colId && s.desc === false) }])}
                                                        className="p-1 hover:bg-transparent"
                                                    >
                                                        {colId.charAt(0).toUpperCase() + colId.slice(1)} <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${sorting.some(s => s.id === colId && s.desc) ? 'rotate-180' : 'rotate-0'}`} />
                                                    </Button>
                                                </th>
                                            ))}
                                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider w-32">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredAndSortedData.map(notice => {
                                            const priorityStyle = getPriorityStyle(notice.priority); 
                                            return (
                                                <tr 
                                                    key={notice.id} 
                                                    className={`transition-all cursor-pointer ${selectedPreview?.id === notice.id ? 'bg-blue-50/50 border-l-4 border-blue-600' : 'hover:bg-slate-50'}`}
                                                    onClick={() => setSelectedPreview(notice)}
                                                >
                                                    <td className="px-3 py-3 w-10">
                                                        <Checkbox 
                                                            checked={selectedRows.includes(notice.id)} 
                                                            onCheckedChange={() => handleRowSelect(notice.id)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                                                        {/* ENHANCED STROKE FOR PIN ICON */}
                                                        {notice.isPinned && <Pin className="h-4 w-4 text-orange-600 fill-orange-100 stroke-[2.5]" />}
                                                        {notice.attachment && <Paperclip className="h-4 w-4 text-blue-600" title={notice.attachment.name} />}
                                                        {notice.title}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {/* VIBRANT LUCIDE PRIORITY BADGE IN TABLE */}
                                                        <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${priorityStyle.classes}`}>
                                                            {priorityStyle.icon}
                                                            {notice.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{notice.category}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(notice.date).toLocaleDateString()}</td>
                                                    
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button onClick={(e) => { e.stopPropagation(); handlePinToggle(notice.id, notice.isPinned); }} variant="ghost" className={`p-1.5 rounded-full ${notice.isPinned ? 'text-orange-600 hover:bg-orange-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                                                                {/* ENHANCED STROKE FOR PIN ICON */}
                                                                <Pin className="h-4 w-4 stroke-[2.5]" />
                                                            </Button>
                                                            <Button onClick={(e) => { e.stopPropagation(); handleEditNotice(notice); }} variant="secondary" className="p-1.5">
                                                                {/* ENHANCED STROKE FOR EDIT ICON */}
                                                                <Edit className="h-4 w-4 stroke-[2.5]" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Grid View (Cards) */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredAndSortedData.map(notice => (
                                    <NoticeCard
                                        key={notice.id}
                                        notice={notice}
                                        selected={selectedPreview?.id === notice.id}
                                        onPinToggle={handlePinToggle}
                                        onEdit={handleEditNotice}
                                        onPreview={setSelectedPreview}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {filteredAndSortedData.length === 0 && (
                            <div className="text-center py-10 text-slate-500">
                                No notices found matching your search and filters.
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Preview Panel */}
                <div className="col-span-12 lg:col-span-4 h-[80vh] sticky top-8">
                    <NoticePreview 
                        notice={selectedPreview} 
                        onClose={() => setSelectedPreview(null)} 
                        onEdit={handleEditNotice} 
                    />
                </div>
            </div>

            {/* CRUD Modal */}
            <NoticeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                notice={editingNotice}
                onSave={(data) => {
                    const noticeToSave = { 
                        ...data, 
                        attachment: data.attachment ? { 
                            ...data.attachment, 
                            url: data.attachment.url.replace('/temp-upload/', '/files/') 
                        } : null
                    };
                    handleSaveNotice(noticeToSave);
                }}
            />
        </div>
    );
}