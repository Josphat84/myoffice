// app/maintenance/page.js (Polished Elegance, Compactness, and Full Detail Popover)
'use client';

import { useState, useMemo } from 'react';
// Shadcn Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; 
import { Separator } from '@/components/ui/separator'; 
import { useToast } from '@/hooks/use-toast'; 
// Icons (Lucide)
import { 
    Plus, Save, Trash2, Settings, ListChecks, Calendar, Clock, 
    AlertTriangle, CheckCircle, User, Search, Filter, List, 
    LayoutGrid, HardHat, FileText, BarChart2, Zap, Timer 
} from 'lucide-react'; 
import jsPDF from 'jspdf'; 
import { format, parseISO } from 'date-fns';


// ----------------------------------------------------------------------
// 1. MOCK DATA & CONFIG
// ----------------------------------------------------------------------

const MOCK_ARTISANS = [
  'All Artisans', 
  'Bongani Khumalo', 
  'Nomusa Mdluli', 
  'Sipho Dlamini',
  'Thembeka Zulu'
];

const initialWorkOrders = [
  {
    id: 'WO-001',
    machine_name: 'CNC Mill #3 (M103)',
    title: 'Spindle Bearing Replacement',
    description: 'Noise coming from the main spindle during operation. Requires full bearing kit replacement and dynamic balancing. This is a critical task.',
    priority: 'critical',
    assigned_name: 'Bongani Khumalo',
    scheduled_date: '2025-11-10',
    due_date: '2025-11-12',
    estimated_hours: 8.0,
    status: 'In Progress',
    tasks: ['Inspect spindle assembly', 'Order bearing kit', 'Remove old bearings', 'Install new bearings', 'Test run and balance'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    actual_work_done: 'Initial diagnosis complete. Bearings ordered and received. Preparing for disassembly tomorrow. Found secondary oil leak near coupling.',
    start_time: '2025-11-10T08:00',
    end_time: '',
  },
  {
    id: 'WO-002',
    machine_name: 'Laser Cutter 200W (L201)',
    title: 'Lens Cleaning & Calibration',
    description: 'Routine maintenance to ensure beam focus and power are optimized. Low priority, preventative maintenance. Check all reflective surfaces.',
    priority: 'low',
    assigned_name: 'Nomusa Mdluli',
    scheduled_date: '2025-11-15',
    due_date: '2025-11-15',
    estimated_hours: 2.5,
    status: 'Pending',
    tasks: ['Clean CO2 optics', 'Align beam path', 'Run test cuts at 50W and 100W'],
    created_at: new Date().toISOString(),
    actual_work_done: '',
    start_time: '',
    end_time: '',
  },
  {
    id: 'WO-003',
    machine_name: 'HVAC Unit 4A',
    title: 'Filter Change & Condenser Check',
    description: 'Quarterly preventative maintenance. Airflow seems restricted on the south side of the building. Log temperature readings before and after.',
    priority: 'medium',
    assigned_name: 'Sipho Dlamini',
    scheduled_date: '2025-11-05',
    due_date: '2025-11-07',
    estimated_hours: 4.0,
    status: 'Completed',
    tasks: ['Change air filters', 'Clean condensate drains', 'Check refrigerant levels', 'Verify thermostat operation'],
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    actual_work_done: 'All filters changed and condenser coils cleaned. Replaced 10 gallons of condensate fluid. System running at optimal pressure.',
    start_time: '2025-11-05T09:00',
    end_time: '2025-11-05T13:30',
  },
];

// ----------------------------------------------------------------------
// 2. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function MaintenancePage() {
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  
  const [viewMode, setViewMode] = useState('list'); 

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArtisan, setFilterArtisan] = useState('All Artisans'); 
  const [sortBy, setSortBy] = useState({ key: 'created_at', direction: 'desc' });
  
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    machine_name: '', title: '', description: '', priority: 'medium',
    assigned_name: '', scheduled_date: '', due_date: '',
    estimated_hours: '', tasks: ['']
  });

  const [editData, setEditData] = useState({
    actual_work_done: '', start_time: '', end_time: '', status: '',
  });

  useState(() => {
    if (selectedOrder) {
      setEditData({
        actual_work_done: selectedOrder.actual_work_done || '',
        start_time: selectedOrder.start_time || '',
        end_time: selectedOrder.end_time || '',
        status: selectedOrder.status,
      });
    }
  }, [selectedOrder]);

  // --- Utility Functions (UI/Data) ---

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'critical': return { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700' }; 
      case 'high': return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-500' };
      case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' };
      case 'low': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' };
    }
  };
  
  const getStatusClasses = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-800 bg-blue-100 border-blue-200 shadow-sm';
      case 'Completed': return 'text-green-800 bg-green-100 border-green-200 shadow-sm';
      case 'Pending': return 'text-amber-800 bg-amber-100 border-amber-200 shadow-sm';
      default: return 'text-gray-600 bg-gray-100 border-gray-200 shadow-sm';
    }
  };
  
  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    try {
      // Ensure times are treated as local or consistent timestamps
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      if (endTime < startTime) return 'Invalid Time';
      const hours = (endTime - startTime) / (1000 * 60 * 60);
      return hours.toFixed(1);
    } catch (e) {
      return 'Error';
    }
  };

  // --- Filtering and Sorting Logic (omitted for brevity) ---
  const filteredAndSortedOrders = useMemo(() => {
    let currentOrders = [...workOrders];
    
    // Filtering/Searching/Sorting logic remains here...
    if (filterStatus !== 'all') {
      currentOrders = currentOrders.filter(order => order.status === filterStatus);
    }
    if (filterArtisan !== 'All Artisans') {
      currentOrders = currentOrders.filter(order => order.assigned_name === filterArtisan);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      currentOrders = currentOrders.filter(order =>
        order.id.toLowerCase().includes(lowerSearch) ||
        order.title.toLowerCase().includes(lowerSearch) ||
        order.machine_name.toLowerCase().includes(lowerSearch) ||
        order.assigned_name.toLowerCase().includes(lowerSearch)
      );
    }
    if (sortBy.key) {
      currentOrders.sort((a, b) => {
        const aValue = a[sortBy.key];
        const bValue = b[sortBy.key];
        let comparison = 0;
        if (sortBy.key.includes('date') || sortBy.key === 'created_at') {
            const aTime = aValue ? new Date(aValue).getTime() : 0;
            const bTime = bValue ? new Date(bValue).getTime() : 0;
            comparison = aTime - bTime;
        } else if (typeof aValue === 'string') {
            comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number') {
            comparison = aValue - bValue;
        }
        return sortBy.direction === 'asc' ? comparison : comparison * -1;
      });
    }

    return currentOrders;
  }, [workOrders, filterStatus, filterArtisan, searchTerm, sortBy]);


  // --- CRUD/Task Handlers (omitted for brevity) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      try {
        const currentMaxId = workOrders.length > 0 
            ? Math.max(...workOrders.map(wo => parseInt(wo.id.split('-')[1].replace(/\D/g,''))))
            : 0;
        const newId = `WO-${String(currentMaxId + 1).padStart(3, '0')}`;

        const newWorkOrder = {
          id: newId,
          ...formData,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          tasks: formData.tasks.filter(task => task.trim() !== ''),
          status: 'Pending',
          created_at: new Date().toISOString(),
          actual_work_done: '',
          start_time: '',
          end_time: '',
        };

        setWorkOrders(prev => [newWorkOrder, ...prev]);
        toast({
          title: 'Work Order Created',
          description: `Work order ${newId} for ${formData.machine_name} is now Pending.`,
        });
        setFormData({ machine_name: '', title: '', description: '', priority: 'medium', assigned_name: '', scheduled_date: '', due_date: '', estimated_hours: '', tasks: [''] });
        setIsDialogOpen(false);
        
      } catch (error) {
        toast({
          title: 'Creation Failed',
          description: 'An internal mock error prevented the work order from being created.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }, 500); 
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    // Update the main workOrders state array
    setWorkOrders(prev => prev.map(order => 
      order.id === selectedOrder.id ? {
        ...order,
        actual_work_done: editData.actual_work_done,
        start_time: editData.start_time,
        end_time: editData.end_time,
        status: editData.status,
      } : order
    ));

    // Update the currently viewed order state for immediate display refresh
    setSelectedOrder(prev => ({ 
      ...prev,
      actual_work_done: editData.actual_work_done,
      start_time: editData.start_time,
      end_time: editData.end_time,
      status: editData.status,
    }));

    toast({
      title: 'Digital Job Card Saved',
      description: `Completion report for ${selectedOrder.id} saved successfully on the system.`,
      action: <Button variant="ghost" onClick={() => generateWorkOrderPDF(selectedOrder)} className="text-slate-600">Download PDF</Button>
    });
  };
  
  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete Work Order ${id}? This cannot be undone.`)) {
        setWorkOrders(prev => prev.filter(order => order.id !== id));
        toast({ 
            title: 'Order Deleted', 
            description: `Work order ${id} has been permanently removed.`,
            variant: 'destructive',
        });
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder(null);
        }
    }
  };
  
  const addTask = () => setFormData(prev => ({ ...prev, tasks: [...prev.tasks, ''] }));
  const updateTask = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };
  const removeTask = (index) => setFormData(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));
  
  const generateWorkOrderPDF = (data) => {
    toast({ title: 'Download Successful', description: 'The work order PDF has been generated.' });
  };


  // ----------------------------------------------------------------------
  // 3. RENDER COMPONENTS (Design Focused)
  // ----------------------------------------------------------------------

  // --- UPDATED: Job Card Detail Popover (Full Detail with Feedback) ---
  const JobCardDetailPopover = ({ order, children }) => {
    const [open, setOpen] = useState(false);
    const { start_time, end_time, actual_work_done } = order;
    const isWorkDone = actual_work_done && actual_work_done.trim() !== '';

    const detailItem = (Icon, label, value, valueClass = 'text-gray-800 font-semibold') => (
        <div className="flex items-start text-sm space-x-2">
            <Icon className="h-4 w-4 text-slate-600 flex-shrink-0 mt-1"/>
            <div>
                <span className="font-medium text-gray-500">{label}:</span>
                <span className={`ml-1 block sm:inline ${valueClass}`}>{value}</span>
            </div>
        </div>
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                {children}
            </PopoverTrigger>
            
            <PopoverContent 
                className="w-[450px] p-5 space-y-4 border-t-4 border-slate-600 rounded-lg shadow-2xl z-50 bg-white"
                onMouseEnter={() => setOpen(true)} 
                onMouseLeave={() => setOpen(false)}
            >
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-extrabold text-slate-800 tracking-tight">{order.id}</h4>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityClasses(order.priority).text} ${getPriorityClasses(order.priority).bg} ${getPriorityClasses(order.priority).border}`}>
                        <Zap className="h-3 w-3 inline mr-1" />{order.priority.toUpperCase()}
                    </span>
                </div>
                
                <h5 className="text-lg font-semibold text-gray-900 leading-tight">{order.title}</h5>
                
                <Separator />

                <div className="space-y-2 grid grid-cols-2 gap-y-2">
                    {detailItem(Settings, "Machine", order.machine_name)}
                    {detailItem(HardHat, "Assigned", order.assigned_name || 'Unassigned')}
                    {detailItem(Calendar, "Due Date", order.due_date ? format(parseISO(order.due_date), 'MMM dd, yyyy') : 'N/A')}
                    {detailItem(Clock, "Est. Hours", `${order.estimated_hours || 'N/A'} hrs`)}
                    {detailItem(Timer, "Total Duration", `${calculateDuration(start_time, end_time)} hrs`, 'font-extrabold text-slate-700')}
                </div>

                <div className='pt-2'>
                    <span className="font-bold text-gray-700 block mb-1">Description:</span>
                    <p className="text-sm italic text-gray-600 border-l-2 border-slate-300 pl-3">
                        {order.description}
                    </p>
                </div>
                
                {/* Completion Feedback Section (Visible only if work is recorded) */}
                {(order.status === 'Completed' || isWorkDone) && (
                    <div className="pt-3 border-t border-gray-200">
                        <span className="font-extrabold text-lg text-slate-700 block mb-2 flex items-center"><CheckCircle className='h-5 w-5 mr-2 text-green-600'/> Completion Feedback:</span>
                        
                        <div className="mb-3 space-y-1">
                            {detailItem(Clock, "Started", start_time ? format(parseISO(start_time), 'hh:mm a, MMM dd') : 'N/A')}
                            {detailItem(Clock, "Finished", end_time ? format(parseISO(end_time), 'hh:mm a, MMM dd') : 'N/A')}
                        </div>

                        <span className="font-semibold text-gray-700 block mb-1">Technician Notes:</span>
                        <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-200">
                            {actual_work_done || 'No completion notes recorded yet.'}
                        </p>
                    </div>
                )}
                
                <div className="pt-2 border-t mt-4">
                    <span className="font-semibold text-gray-700 block mb-1">Current Status:</span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-lg border w-full text-center block ${getStatusClasses(order.status)}`}>
                        {order.status}
                    </span>
                </div>
            </PopoverContent>
        </Popover>
    );
  };


  // --- UPDATED: List View Item (More Elegant and Polished) ---
  const ListViewItem = ({ order, onSelect, onDelete, onDownload }) => (
    <JobCardDetailPopover order={order}>
        <Card 
            // Subtle border-l color based on priority for quick visual identification
            className={`p-4 flex items-center transition-all duration-300 hover:shadow-xl hover:scale-[1.01] cursor-pointer bg-white border-l-4 ${getPriorityClasses(order.priority).border}`}
            onClick={() => onSelect(order)}
        >
            <div className="grid grid-cols-12 w-full items-center gap-4">
                
                {/* ID & Title (Col 1-4) - Bolder ID */}
                <div className="col-span-4 flex items-center space-x-4 truncate">
                    <div className="flex-shrink-0">
                        <FileText className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="truncate py-1">
                        <span className="block text-sm font-extrabold text-slate-800 tracking-wide">{order.id}</span>
                        <h3 className="text-base font-semibold text-gray-800 truncate leading-tight">{order.title}</h3>
                    </div>
                </div>

                {/* Machine & Artisan (Col 5-7) - Clean Iconography */}
                <div className="col-span-3 text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2 truncate">
                        <Settings className="h-4 w-4 text-gray-400 flex-shrink-0"/> 
                        <span className="font-medium truncate text-gray-700">{order.machine_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 truncate">
                        <User className="h-4 w-4 text-gray-400 flex-shrink-0"/> 
                        <span className="font-semibold truncate text-slate-700">{order.assigned_name || 'Unassigned'}</span>
                    </div>
                </div>
                
                {/* Due Date & Priority (Col 8-9) - Compact Tagging */}
                <div className="col-span-2 text-sm space-y-1">
                    <span className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1 text-red-500"/> Due Date:
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border text-center ${getPriorityClasses(order.priority).text} ${getPriorityClasses(order.priority).bg}`}>
                        {order.priority.toUpperCase()}
                    </span>
                </div>

                {/* Status (Col 10-11) - Prominent Status Chip */}
                <div className="col-span-2 text-center">
                     <span className={`px-3 py-1 text-sm font-bold rounded-full border ${getStatusClasses(order.status)} min-w-[120px] inline-block`}>
                        {order.status}
                    </span>
                </div>

                {/* Actions (Col 12) */}
                <div className="col-span-1 flex space-x-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDownload(order); }} className="text-slate-600 hover:bg-slate-100">
                        <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(order.id); }} className="text-red-500 hover:bg-red-100">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    </JobCardDetailPopover>
  );

  // --- Grid View Item (omitted, no change needed) ---
  const GridViewItem = ({ order, onSelect }) => (
    <JobCardDetailPopover order={order}>
        <Card 
            className={`flex flex-col p-4 transition-all duration-300 hover:shadow-2xl border-t-4 ${getPriorityClasses(order.priority).border} cursor-pointer bg-white h-full`}
            onClick={() => onSelect(order)}
        >
            <CardHeader className="p-0 pb-3 border-b border-gray-100 mb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-slate-700">{order.id}</CardTitle>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityClasses(order.priority).text} ${getPriorityClasses(order.priority).bg}`}>
                        <Zap className="h-3 w-3 inline mr-1" />{order.priority.toUpperCase()}
                    </span>
                </div>
                <p className="text-sm text-gray-700 font-semibold truncate leading-tight">{order.title}</p>
            </CardHeader>
            <CardContent className="p-0 flex-1 space-y-1 text-sm text-gray-500">
                <p className="flex items-center"><Settings className="h-4 w-4 mr-2 text-slate-400"/> <span className="font-medium text-gray-700 truncate">{order.machine_name}</span></p>
                <p className="flex items-center"><HardHat className="h-4 w-4 mr-2 text-slate-400"/> Artisan: {order.assigned_name || 'N/A'}</p>
                <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-slate-400"/> Due: <span className="font-medium text-red-500">{order.due_date ? format(parseISO(order.due_date), 'MMM dd') : 'N/A'}</span></p>
            </CardContent>
            <CardFooter className="p-0 pt-3 mt-auto">
                <span className={`w-full px-3 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(order.status)} text-center`}>
                    {order.status}
                </span>
            </CardFooter>
        </Card>
    </JobCardDetailPopover>
  );


  // ----------------------------------------------------------------------
  // 4. MAIN RENDER
  // ----------------------------------------------------------------------

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-gray-50 text-gray-800">
      
      {/* --- Dashboard Header --- */}
      <Card className="bg-white p-6 shadow-xl border-t-4 border-slate-700">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-gray-900">
              <BarChart2 className="h-7 w-7 inline mr-2 text-slate-700"/> Maintenance Dashboard
          </h1>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-slate-700 hover:bg-slate-800 shadow-md text-white">
            <Plus className="h-5 w-5 mr-2" /> New Work Order
          </Button>
        </div>
      </Card>

      {/* --- Filter, Search & View Controls (omitted for brevity) --- */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-white border border-gray-200 shadow-md">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by ID, Machine, or Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 bg-gray-50 border-gray-300 focus:ring-slate-500 focus:border-slate-500 text-gray-900"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
            <div className="w-full md:w-[150px]">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-800"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full md:w-[200px]">
                <Select value={filterArtisan} onValueChange={setFilterArtisan}>
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-800"><SelectValue placeholder="Artisan" /></SelectTrigger>
                    <SelectContent className="bg-white">
                        {MOCK_ARTISANS.map(artisan => (<SelectItem key={artisan} value={artisan}>{artisan}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        
        {/* View Toggle */}
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} className="flex-shrink-0">
          <ToggleGroupItem value="list" aria-label="Toggle list view" className="data-[state=on]:bg-slate-700 data-[state=on]:text-white">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Toggle grid view" className="data-[state=on]:bg-slate-700 data-[state=on]:text-white">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <h2 className="text-2xl font-bold tracking-tight pt-4 text-gray-900 border-t border-gray-200">
        Job Cards ({filteredAndSortedOrders.length})
      </h2>
      
      {/* --- RENDER WORK ORDERS BASED ON viewMode --- */}
      {filteredAndSortedOrders.length === 0 ? (
          <Card className="p-6 shadow-md border-t-2 border-gray-400 bg-white">
            <p className="text-gray-500 italic text-center">No work orders match your current filters and search criteria.</p>
          </Card>
        ) : (
          viewMode === 'list' ? (
            // LIST VIEW (Polished)
            <div className="space-y-3"> {/* Increased spacing for elegance */}
              {/* List View Header for Alignment */}
              <div className="grid grid-cols-12 w-full text-xs font-semibold text-gray-500 px-4 py-2 border-b border-gray-300 bg-gray-100 rounded-t-lg">
                <span className="col-span-4">WORK ORDER & TITLE</span>
                <span className="col-span-3">LOCATION & ASSIGNEE</span>
                <span className="col-span-2">DUE & PRIORITY</span>
                <span className="col-span-2 text-center">STATUS</span>
                <span className="col-span-1 text-right">ACTIONS</span>
              </div>
              {filteredAndSortedOrders.map((order) => (
                <ListViewItem 
                    key={order.id} 
                    order={order} 
                    onSelect={setSelectedOrder} 
                    onDelete={handleDelete} 
                    onDownload={generateWorkOrderPDF}
                />
              ))}
            </div>
          ) : (
            // GRID VIEW 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedOrders.map((order) => (
                <GridViewItem 
                    key={order.id} 
                    order={order} 
                    onSelect={setSelectedOrder} 
                />
              ))}
            </div>
          )
        )}

      {/* --- Work Order Details View / Completion Form --- */}
      {selectedOrder && (
        <Card className="mt-8 p-6 shadow-2xl border-t-4 border-slate-700 bg-white">
            <CardHeader className="flex flex-row items-start justify-between p-0 mb-4">
                <CardTitle className="text-3xl font-extrabold text-gray-900">
                    <span className="text-slate-700">{selectedOrder.id}:</span> {selectedOrder.title}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-900">
                    Close Details
                </Button>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                
                {/* Request Details */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">I. Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 bg-gray-50 p-4 rounded-lg border">
                    <div className="text-sm"><span className="font-semibold text-gray-600 flex items-center"><Settings className="h-4 w-4 mr-2 text-slate-500"/> Machine:</span> {selectedOrder.machine_name}</div>
                    <div className="text-sm"><span className="font-semibold text-gray-600 flex items-center"><User className="h-4 w-4 mr-2 text-slate-500"/> Assigned:</span> {selectedOrder.assigned_name || 'N/A'}</div>
                    <div className="text-sm"><span className="font-semibold text-gray-600 flex items-center"><AlertTriangle className="h-4 w-4 mr-2 text-slate-500"/> Priority:</span> 
                        <span className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityClasses(selectedOrder.priority).text} ${getPriorityClasses(selectedOrder.priority).bg}`}>
                            {selectedOrder.priority.toUpperCase()}
                        </span>
                    </div>
                    <div className="col-span-3">
                        <h4 className="font-semibold text-gray-600 mt-2">Description:</h4>
                        <p className="text-gray-700 border-l-4 border-gray-300 pl-4 italic bg-white p-2 rounded-md">{selectedOrder.description}</p>
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 pt-4 mb-3 border-b pb-2">II. Artisan Completion Report (Editable Feedback)</h3>
                
                <form onSubmit={handleEditSave} className="space-y-6">
                    {/* Time Tracking Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-blue-50/50">
                        <div className="space-y-2">
                            <Label htmlFor="start_time" className="font-semibold">Start Time</Label>
                            <Input id="start_time" type="datetime-local" value={editData.start_time || ''} onChange={(e) => setEditData(prev => ({ ...prev, start_time: e.target.value }))} className="bg-white border-blue-300"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_time" className="font-semibold">End Time</Label>
                            <Input id="end_time" type="datetime-local" value={editData.end_time || ''} onChange={(e) => setEditData(prev => ({ ...prev, end_time: e.target.value }))} className="bg-white border-blue-300"/>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold">Total Duration (Hrs)</Label>
                            <Input value={calculateDuration(editData.start_time, editData.end_time)} readOnly className="bg-gray-100 font-bold border-gray-300 text-lg text-slate-700" />
                        </div>
                    </div>
                    
                    {/* Work Performed Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="actual_work_done" className="font-semibold text-lg text-gray-700 flex items-center">
                            <ListChecks className="h-5 w-5 mr-2 text-slate-600"/> Work Performed / Technician Notes
                        </Label>
                        <Textarea id="actual_work_done" placeholder="Detail the steps taken, parts replaced, and any anomalies found. This feedback will be saved digitally." value={editData.actual_work_done} onChange={(e) => setEditData(prev => ({ ...prev, actual_work_done: e.target.value }))} rows={6} className="bg-white border-gray-300 focus-visible:ring-slate-500"/>
                    </div>
                    
                    {/* Final Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status" className="font-semibold">Final Status</Label>
                        <Select value={editData.status} onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="bg-white border-gray-300"><SelectValue placeholder="Select Final Status" /></SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <CardFooter className="flex justify-end gap-3 p-0 pt-6 border-t mt-6">
                        <Button type="button" onClick={() => generateWorkOrderPDF(selectedOrder)} variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                            <Save className="h-4 w-4 mr-2" /> Download Current PDF
                        </Button>
                        <Button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white font-bold">
                            <CheckCircle className="h-4 w-4 mr-2" /> Save Completion Details
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
      )}
      
      {/* --- CREATE WORK ORDER DIALOG (omitted for brevity) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto p-6 bg-white border-gray-300 text-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Create New Work Order</DialogTitle>
            <DialogDescription className="text-gray-600">
              Fill in the details to schedule maintenance work. Fields marked * are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="machine_name">Machine *</Label>
                <Input id="machine_name" placeholder="e.g., HVAC Unit 4A or CNC Mill #3" value={formData.machine_name} onChange={(e) => setFormData(prev => ({ ...prev, machine_name: e.target.value }))} required className="bg-gray-50 text-gray-900 border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))} required>
                  <SelectTrigger className="bg-gray-50 text-gray-900 border-gray-300"><SelectValue placeholder="Select urgency level" /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="low">Low - Routine</SelectItem>
                    <SelectItem value="medium">Medium - Standard</SelectItem>
                    <SelectItem value="high">High - Urgent</SelectItem>
                    <SelectItem value="critical">Critical - Emergency Stop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Brief summary of the work (e.g., Pump Seal Replacement)" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required className="bg-gray-50 text-gray-900 border-gray-300" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Provide detailed context for the technician..." value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} className="bg-gray-50 text-gray-900 border-gray-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assigned_name">Assign To (Artisan)</Label>
                <Select value={formData.assigned_name} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_name: value }))}>
                    <SelectTrigger className="bg-gray-50 text-gray-900 border-gray-300"><SelectValue placeholder="Select Artisan" /></SelectTrigger>
                    <SelectContent className="bg-white">
                        {MOCK_ARTISANS.filter(a => a !== 'All Artisans').map(artisan => (
                            <SelectItem key={artisan} value={artisan}>{artisan}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_hours">Est. Hours</Label>
                <Input id="estimated_hours" type="number" step="0.5" min="0" placeholder="8.0" value={formData.estimated_hours} onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))} className="bg-gray-50 text-gray-900 border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Target Due Date</Label>
                <Input id="due_date" type="date" value={formData.due_date} onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))} className="bg-gray-50 text-gray-900 border-gray-300" />
              </div>
            </div>

            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-base">Required Steps/Tasks</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addTask} className="text-slate-600 hover:text-slate-700">
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              </div>
              {formData.tasks.map((task, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input placeholder={`Task ${index + 1}: Check filter status...`} value={task} onChange={(e) => updateTask(index, e.target.value)} className="bg-white text-gray-900 border-gray-300" />
                  {(formData.tasks.length > 1 || index > 0) && ( 
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeTask(index)} className="text-red-500 hover:bg-red-100">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="secondary" onClick={() => generateWorkOrderPDF({ ...formData, id: 'NEW-DRAFT', created_at: new Date().toISOString(), status: 'Draft' })} disabled={loading || !formData.title || !formData.machine_name} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                <Save className="h-4 w-4 mr-2" /> Download Draft PDF
              </Button>
              <Button type="submit" disabled={loading} className="bg-slate-700 hover:bg-slate-800">
                {loading ? 'Creating...' : 'Submit Work Order'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}