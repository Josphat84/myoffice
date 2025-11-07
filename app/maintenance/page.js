// app/maintenance/page.js (Premium Minimalist, Mobile-Optimized, Sidebar Editing)
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast'; 
// Icons (Lucide)
import { 
    Plus, Save, Trash2, Settings, ListChecks, Calendar, Clock, 
    AlertTriangle, CheckCircle, User, Search, Filter, List, 
    LayoutGrid, HardHat, FileText, BarChart2, Zap, Timer, X 
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
    const [isDialogOpen, setIsDialogOpen] = useState(false); // For creation dialog
    const [isSheetOpen, setIsSheetOpen] = useState(false); // For editing sidebar
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

    // Effect to load editing data when an order is selected
    useState(() => {
        if (selectedOrder) {
            setEditData({
                actual_work_done: selectedOrder.actual_work_done || '',
                start_time: selectedOrder.start_time || '',
                end_time: selectedOrder.end_time || '',
                status: selectedOrder.status,
            });
            setIsSheetOpen(true); // Open the sheet when an order is selected
        } else {
            setIsSheetOpen(false); // Close the sheet when deselected
        }
    }, [selectedOrder]);

    // ** FIX: DEFINE FILTERED AND SORTED ORDERS ARRAY HERE **
    const filteredAndSortedOrders = useMemo(() => {
        let currentOrders = [...workOrders];
        
        // 1. Filtering by Status
        if (filterStatus !== 'all') {
          currentOrders = currentOrders.filter(order => order.status === filterStatus);
        }
        
        // 2. Filtering by Artisan
        if (filterArtisan !== 'All Artisans') {
          currentOrders = currentOrders.filter(order => order.assigned_name === filterArtisan);
        }
        
        // 3. Searching
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          currentOrders = currentOrders.filter(order =>
            order.id.toLowerCase().includes(lowerSearch) ||
            order.machine_name.toLowerCase().includes(lowerSearch) ||
            order.title.toLowerCase().includes(lowerSearch)
          );
        }
        
        // 4. Sorting (Assumes simple key sorting, handles dates)
        currentOrders.sort((a, b) => {
          const aValue = a[sortBy.key];
          const bValue = b[sortBy.key];
          let comparison = 0;
          
          if (sortBy.key === 'created_at' || sortBy.key === 'scheduled_date' || sortBy.key === 'due_date') {
            comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
          } else if (typeof aValue === 'string') {
            comparison = aValue.localeCompare(bValue);
          } else if (typeof aValue === 'number') {
            comparison = aValue - bValue;
          }
          
          return sortBy.direction === 'asc' ? comparison : comparison * -1;
        });

        return currentOrders;
    }, [workOrders, filterStatus, filterArtisan, searchTerm, sortBy]); 
    // ** END FIX **


    // --- Utility Functions (Styling and Data) ---

    const getPriorityClasses = (priority) => {
        switch (priority) {
            // Use indigo for primary brand color, keeping critical red
            case 'critical': return { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700', text_light: 'text-red-700', tag_bg: 'bg-red-50' }; 
            case 'high': return { bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-700', text_light: 'text-indigo-700', tag_bg: 'bg-indigo-50' };
            case 'medium': return { bg: 'bg-yellow-400', text: 'text-gray-800', border: 'border-yellow-500', text_light: 'text-yellow-700', tag_bg: 'bg-yellow-50' };
            case 'low': return { bg: 'bg-gray-400', text: 'text-gray-800', border: 'border-gray-500', text_light: 'text-gray-700', tag_bg: 'bg-gray-50' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', text_light: 'text-gray-600', tag_bg: 'bg-gray-100' };
        }
    };
    
    const getStatusClasses = (status) => {
        switch (status) {
            case 'In Progress': return 'text-indigo-800 bg-indigo-100 border-indigo-200'; // Using Indigo for "In Progress"
            case 'Completed': return 'text-green-800 bg-green-100 border-green-200';
            case 'Pending': return 'text-amber-800 bg-amber-100 border-amber-200';
            default: return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };
    
    const calculateDuration = (start, end) => {
        if (!start || !end) return 'N/A';
        try {
            const startTime = new Date(start).getTime();
            const endTime = new Date(end).getTime();
            if (endTime < startTime) return 'Invalid Time';
            const hours = (endTime - startTime) / (1000 * 60 * 60);
            return hours.toFixed(1);
        } catch (e) {
            return 'Error';
        }
    };

    const clearSelection = () => {
        setSelectedOrder(null);
        setIsSheetOpen(false);
    };

    // --- Handlers ---
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            // Creation logic...
            const currentMaxId = workOrders.length > 0 ? Math.max(...workOrders.map(wo => parseInt(wo.id.split('-')[1].replace(/\D/g,'')))) : 0;
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
            toast({ title: 'Work Order Created', description: `Work order ${newId} for ${formData.machine_name} is now Pending.` });
            setFormData({ machine_name: '', title: '', description: '', priority: 'medium', assigned_name: '', scheduled_date: '', due_date: '', estimated_hours: '', tasks: [''] });
            setIsDialogOpen(false);
            setLoading(false);
        }, 500); 
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        if (!selectedOrder) return;
        
        setWorkOrders(prev => prev.map(order => 
            order.id === selectedOrder.id ? {
                ...order,
                actual_work_done: editData.actual_work_done,
                start_time: editData.start_time,
                end_time: editData.end_time,
                status: editData.status,
            } : order
        ));

        setSelectedOrder(prev => ({ 
            ...prev,
            actual_work_done: editData.actual_work_done,
            start_time: editData.start_time,
            end_time: editData.end_time,
            status: editData.status,
        }));

        toast({
            title: 'Digital Job Card Saved',
            description: `Completion report for ${selectedOrder.id} saved successfully.`,
        });
    };
    
    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete Work Order ${id}?`)) {
            setWorkOrders(prev => prev.filter(order => order.id !== id));
            toast({ title: 'Order Deleted', description: `Work order ${id} has been permanently removed.`, variant: 'destructive' });
            clearSelection();
        }
    };
    
    const addTask = () => setFormData(prev => ({ ...prev, tasks: [...prev.tasks, ''] }));
    const updateTask = (index, value) => {
        setFormData(prev => ({ ...prev, tasks: prev.tasks.map((task, i) => i === index ? value : task) }));
    };
    const removeTask = (index) => setFormData(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));
    
    const generateWorkOrderPDF = (data) => {
        // Placeholder for PDF generation logic (e.g., using jsPDF)
        toast({ title: 'Download Successful', description: 'The work order PDF has been generated.' });
    };


    // ----------------------------------------------------------------------
    // 3. RENDER COMPONENTS
    // ----------------------------------------------------------------------

    // --- Mobile Optimized Filter/Search Bar ---
    const FilterAndSearchBar = () => (
        <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            
            {/* Search Bar (Full width on mobile) */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Search by ID, Machine, or Title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
            </div>

            {/* Filters and View Toggle (Wrapped for mobile) */}
            <div className="flex gap-3 flex-wrap">
                {/* Status Filter */}
                <div className="w-[120px] sm:w-[150px]">
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
                {/* Artisan Filter */}
                <div className="flex-1 min-w-[150px] max-w-[200px]">
                    <Select value={filterArtisan} onValueChange={setFilterArtisan}>
                        <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-800"><SelectValue placeholder="Artisan" /></SelectTrigger>
                        <SelectContent className="bg-white">
                            {MOCK_ARTISANS.map(artisan => (<SelectItem key={artisan} value={artisan}>{artisan}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            
                {/* View Toggle */}
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} className="flex-shrink-0 ml-auto md:ml-0">
                    <ToggleGroupItem value="list" aria-label="Toggle list view" className="data-[state=on]:bg-indigo-600 data-[state=on]:text-white">
                        <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="grid" aria-label="Toggle grid view" className="data-[state=on]:bg-indigo-600 data-[state=on]:text-white">
                        <LayoutGrid className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );


    // --- Job Card Detail Popover (Minimal change, kept existing functionality) ---
    const JobCardDetailPopover = ({ order, children }) => {
        const [open, setOpen] = useState(false);
        const { start_time, end_time, actual_work_done } = order;
        const isWorkDone = actual_work_done && actual_work_done.trim() !== '';

        const detailItem = (Icon, label, value, valueClass = 'text-gray-800 font-semibold') => (
            <div className="flex items-start text-sm space-x-2">
                <Icon className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-1"/>
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
                    className="w-[450px] p-5 space-y-4 border-t-4 border-indigo-600 rounded-xl shadow-2xl z-50 bg-white"
                    onMouseEnter={() => setOpen(true)} 
                    onMouseLeave={() => setOpen(false)}
                >
                    <div className="flex justify-between items-start">
                        <h4 className="text-xl font-extrabold text-gray-900 tracking-tight">{order.id}</h4>
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
                        {detailItem(Timer, "Total Duration", `${calculateDuration(start_time, end_time)} hrs`, 'font-extrabold text-indigo-700')}
                    </div>

                    <div className='pt-2'>
                        <span className="font-bold text-gray-700 block mb-1">Description:</span>
                        <p className="text-sm italic text-gray-600 border-l-2 border-indigo-300 pl-3">
                            {order.description}
                        </p>
                    </div>
                    
                    {(order.status === 'Completed' || isWorkDone) && (
                        <div className="pt-3 border-t border-gray-200">
                            <span className="font-extrabold text-lg text-indigo-700 block mb-2 flex items-center"><CheckCircle className='h-5 w-5 mr-2 text-green-600'/> Completion Feedback:</span>
                            
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


    // --- UPDATED: List View Item (Mobile Responsive & Minimalist) ---
    const ListViewItem = ({ order, onSelect, onDelete, onDownload }) => (
        <JobCardDetailPopover order={order}>
            <Card 
                className={`p-4 flex flex-col sm:flex-row items-start sm:items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.005] cursor-pointer bg-white border-l-4 ${getPriorityClasses(order.priority).border}`}
                onClick={() => onSelect(order)}
            >
                <div className="grid grid-cols-12 w-full items-center gap-3">
                    
                    {/* ID & Title (Col 1-5 on desktop, Stacked on mobile) */}
                    <div className="col-span-12 sm:col-span-5 flex items-start sm:items-center space-x-3 truncate">
                        <FileText className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-1 sm:mt-0" />
                        <div className="truncate">
                            <span className="block text-sm font-extrabold text-gray-800 tracking-wide">{order.id}</span>
                            <h3 className="text-base font-semibold text-gray-900 truncate leading-tight">{order.title}</h3>
                        </div>
                    </div>

                    {/* Status & Priority (Col 6-8 on desktop, Visible compact tags on mobile) */}
                    <div className="col-span-6 sm:col-span-3 flex flex-col space-y-1 sm:block">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full border mb-1 ${getStatusClasses(order.status)} min-w-[80px] inline-block text-center`}>
                            {order.status}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityClasses(order.priority).text_light} ${getPriorityClasses(order.priority).tag_bg} inline-block`}>
                            {order.priority.toUpperCase()}
                        </span>
                    </div>
                    
                    {/* Due Date & Artisan (Col 9-11 on desktop, Stacked on mobile) */}
                    <div className="col-span-6 sm:col-span-3 text-sm text-gray-600 space-y-1 border-l sm:border-l-0 pl-3 sm:pl-0">
                        <div className="flex items-center space-x-1 truncate">
                            <User className="h-4 w-4 text-gray-400 flex-shrink-0"/> 
                            <span className="font-semibold truncate text-gray-700">{order.assigned_name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1 truncate">
                            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0"/> 
                            <span className="font-medium truncate text-gray-600">{order.due_date ? format(parseISO(order.due_date), 'MMM dd') : 'N/A'}</span>
                        </div>
                    </div>

                    {/* Actions (Col 12) */}
                    <div className="col-span-12 sm:col-span-1 flex space-x-2 sm:space-x-0 justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0 w-full sm:w-auto">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDownload(order); }} className="text-gray-500 hover:bg-gray-100">
                            <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }} className="text-red-500 hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </JobCardDetailPopover>
    );

    // --- Grid View Item (Minimalist) ---
    const GridViewItem = ({ order, onSelect }) => (
        <JobCardDetailPopover order={order}>
            <Card 
                className={`flex flex-col p-4 transition-all duration-300 hover:shadow-2xl border-t-4 ${getPriorityClasses(order.priority).border} cursor-pointer bg-white h-full rounded-xl`}
                onClick={() => onSelect(order)}
            >
                <CardHeader className="p-0 pb-3 border-b border-gray-100 mb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold text-indigo-700">{order.id}</CardTitle>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityClasses(order.priority).text_light} ${getPriorityClasses(order.priority).tag_bg}`}>
                            <Zap className="h-3 w-3 inline mr-1" />{order.priority.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 font-semibold truncate leading-tight mt-1">{order.title}</p>
                </CardHeader>
                <CardContent className="p-0 flex-1 space-y-1 text-sm text-gray-500 pt-3">
                    <p className="flex items-center"><Settings className="h-4 w-4 mr-2 text-indigo-400"/> <span className="font-medium text-gray-700 truncate">{order.machine_name}</span></p>
                    <p className="flex items-center"><HardHat className="h-4 w-4 mr-2 text-indigo-400"/> Artisan: {order.assigned_name || 'N/A'}</p>
                    <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-indigo-400"/> Due: <span className="font-medium text-gray-700">{order.due_date ? format(parseISO(order.due_date), 'MMM dd') : 'N/A'}</span></p>
                </CardContent>
                <CardFooter className="p-0 pt-3 mt-auto">
                    <span className={`w-full px-3 py-1 text-xs font-bold rounded-full border ${getStatusClasses(order.status)} text-center`}>
                        {order.status}
                    </span>
                </CardFooter>
            </Card>
        </JobCardDetailPopover>
    );

    // --- Sidebar Component for Editing/Viewing Details ---
    const JobCardSidebar = ({ order, isOpen, onClose }) => {
        if (!order) return null;
        
        return (
            <Sheet open={isOpen} onOpenChange={onClose}>
                {/* SheetContent is configured to be wider on desktop and full width on mobile */}
                <SheetContent side="right" className="sm:max-w-md md:max-w-xl w-full bg-gray-50 p-0 flex flex-col border-l-4 border-indigo-600">
                    <SheetHeader className="p-6 bg-white border-b border-gray-100 shadow-sm">
                        <SheetTitle className="text-2xl font-extrabold text-gray-900">
                            <span className="text-indigo-600">{order.id}:</span> {order.title}
                        </SheetTitle>
                        <SheetDescription className="text-gray-600">
                            Update the completion status and technician notes for this job card.
                        </SheetDescription>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 rounded-full hover:bg-indigo-50">
                                <X className="h-5 w-5 text-gray-500" />
                            </Button>
                        </SheetClose>
                    </SheetHeader>

                    <ScrollArea className="flex-1 px-6 pb-6">
                        <div className="space-y-6 pt-4">
                            
                            {/* I. Request Details - Read Only */}
                            <div className="p-4 border rounded-xl bg-white shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center"><FileText className='h-5 w-5 mr-2 text-indigo-600'/> Job Overview</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <p><span className="font-semibold text-gray-600">Machine:</span> <span className="font-medium text-gray-800 block">{order.machine_name}</span></p>
                                    <p><span className="font-semibold text-gray-600">Assigned:</span> <span className="font-medium text-gray-800 block">{order.assigned_name || 'N/A'}</span></p>
                                    <p><span className="font-semibold text-gray-600">Due Date:</span> <span className="font-medium text-gray-800 block">{order.due_date}</span></p>
                                    <p><span className="font-semibold text-gray-600">Est. Hrs:</span> <span className="font-medium text-gray-800 block">{order.estimated_hours}</span></p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-600">Tasks:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                                        {order.tasks.map((task, index) => <li key={index} className='truncate'>{task}</li>)}
                                    </ul>
                                </div>
                            </div>

                            {/* II. Artisan Completion Report - Editable Form */}
                            <form onSubmit={handleEditSave} className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center"><HardHat className='h-5 w-5 mr-2 text-indigo-600'/> Completion Report</h3>

                                {/* Time Tracking */}
                                <div className="grid grid-cols-2 gap-4 p-4 border rounded-xl bg-indigo-50/50">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time" className="font-semibold text-indigo-700">Start Time</Label>
                                        <Input id="start_time" type="datetime-local" value={editData.start_time || ''} onChange={(e) => setEditData(prev => ({ ...prev, start_time: e.target.value }))} className="bg-white border-indigo-300"/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_time" className="font-semibold text-indigo-700">End Time</Label>
                                        <Input id="end_time" type="datetime-local" value={editData.end_time || ''} onChange={(e) => setEditData(prev => ({ ...prev, end_time: e.target.value }))} className="bg-white border-indigo-300"/>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="font-semibold text-indigo-700">Total Duration (Hrs)</Label>
                                        <Input value={calculateDuration(editData.start_time, editData.end_time)} readOnly className="bg-white font-extrabold border-indigo-300 text-lg text-indigo-700" />
                                    </div>
                                </div>
                                
                                {/* Notes and Status */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="actual_work_done" className="font-semibold text-gray-700">Technician Notes</Label>
                                        <Textarea id="actual_work_done" placeholder="Detailed work performed, parts used, and results..." value={editData.actual_work_done} onChange={(e) => setEditData(prev => ({ ...prev, actual_work_done: e.target.value }))} rows={5} className="bg-white border-gray-300 focus-visible:ring-indigo-500"/>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="font-semibold text-gray-700">Final Status</Label>
                                        <Select value={editData.status} onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}>
                                            <SelectTrigger className="bg-white border-gray-300 focus:ring-indigo-500"><SelectValue placeholder="Select Final Status" /></SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <CardFooter className="flex flex-col md:flex-row justify-between gap-3 p-0 pt-6 border-t mt-6 bg-gray-50 sticky bottom-0">
                                    <Button type="button" onClick={() => generateWorkOrderPDF(selectedOrder)} variant="secondary" className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800">
                                        <Save className="h-4 w-4 mr-2" /> Download Job Card
                                    </Button>
                                    <Button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Save & Update
                                    </Button>
                                </CardFooter>
                            </form>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        );
    };


    // ----------------------------------------------------------------------
    // 4. MAIN RENDER
    // ----------------------------------------------------------------------

    return (
        <div className="p-4 md:p-8 space-y-6 min-h-screen bg-gray-50 text-gray-800">
            
            {/* --- Dashboard Header --- */}
            <Card className="bg-white p-4 md:p-6 shadow-xl border-t-4 border-indigo-600 rounded-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                        <Settings className="h-6 w-6 inline mr-2 text-indigo-600"/> Maintenance Work Orders
                    </h1>
                    
                    <Button 
                        onClick={() => setIsDialogOpen(true)} 
                        className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg font-bold"
                    >
                        <Plus className="h-5 w-5 mr-2" /> 
                        Create New Job Card
                    </Button>
                </div>
            </Card>

            {/* --- Filter, Search & View Controls --- */}
            <FilterAndSearchBar />

            <h2 className="text-xl md:text-2xl font-bold tracking-tight pt-2 text-gray-900 border-t border-gray-200">
                Work Orders ({filteredAndSortedOrders.length})
            </h2>
            
            {/* --- RENDER ORDERS --- */}
            {filteredAndSortedOrders.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
                    <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-gray-700">No Work Orders Found</p>
                    <p className="text-gray-500">Try adjusting your search term or filters.</p>
                </div>
            ) : viewMode === 'list' ? (
                <div className="space-y-3">
                    {/* List View Header */}
                    <div className="hidden sm:grid grid-cols-12 w-full text-xs font-semibold text-gray-500 px-4 py-2 border-b border-gray-300 bg-gray-100 rounded-t-lg">
                        <span className="col-span-5">JOB CARD ID & TITLE</span>
                        <span className="col-span-3">STATUS & PRIORITY</span>
                        <span className="col-span-3">ARTISAN & DUE DATE</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAndSortedOrders.map((order) => (
                        <GridViewItem key={order.id} order={order} onSelect={setSelectedOrder} />
                    ))}
                </div>
            )}

            {/* --- Sidebar for Editing/Viewing Details --- */}
            <JobCardSidebar 
                order={selectedOrder} 
                isOpen={isSheetOpen} 
                onClose={clearSelection} 
            />
            
            {/* --- New Job Card Creation Dialog --- */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xs sm:max-w-lg md:max-w-xl max-h-[95vh] overflow-y-auto p-6 bg-white border-gray-300 rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-indigo-600">Create New Job Card</DialogTitle>
                        <DialogDescription>Fill in the details for the new maintenance work order.</DialogDescription>
                        <Separator className="my-2" />
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Input Fields */}
                        <div className="space-y-2">
                            <Label htmlFor="machine_name">Machine/Asset Name *</Label>
                            <Input id="machine_name" placeholder="e.g., CNC Mill #3 (M103)" value={formData.machine_name} onChange={(e) => setFormData(prev => ({ ...prev, machine_name: e.target.value }))} required className="bg-gray-50 border-gray-300" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Summary Title *</Label>
                            <Input id="title" placeholder="e.g., Spindle Bearing Replacement" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required className="bg-gray-50 border-gray-300" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Detailed Fault/Request *</Label>
                            <Textarea id="description" placeholder="Noise coming from the main spindle during operation..." value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} required className="bg-gray-50 border-gray-300" />
                        </div>
                        
                        {/* Scheduling and Priority */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assigned_name">Assign Artisan</Label>
                                <Select value={formData.assigned_name} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_name: value }))}>
                                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Select Artisan" /></SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {MOCK_ARTISANS.filter(p => p !== 'All Artisans').map(artisan => (
                                            <SelectItem key={artisan} value={artisan}>{artisan}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="estimated_hours">Est. Hours</Label>
                                <Input id="estimated_hours" type="number" step="0.5" placeholder="8.0" value={formData.estimated_hours} onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))} className="bg-gray-50 border-gray-300" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2 col-span-1">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Priority" /></SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="due_date">Target Completion Date</Label>
                                <Input id="due_date" type="date" value={formData.due_date} onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))} className="bg-gray-50 border-gray-300" />
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                            <Label className="font-bold text-gray-700 flex justify-between items-center">
                                Required Tasks (Checklist)
                                <Button type="button" onClick={addTask} size="sm" variant="outline" className="text-indigo-600 hover:bg-indigo-50">
                                    <Plus className="h-4 w-4 mr-1" /> Add Task
                                </Button>
                            </Label>
                            {formData.tasks.map((task, index) => (
                                <div key={index} className="flex space-x-2">
                                    <Input
                                        value={task}
                                        onChange={(e) => updateTask(index, e.target.value)}
                                        placeholder={`Task ${index + 1}`}
                                        className="bg-gray-50 border-gray-300"
                                    />
                                    {formData.tasks.length > 1 && (
                                        <Button type="button" onClick={() => removeTask(index)} variant="ghost" size="icon" className="text-red-500 hover:bg-red-100">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                                {loading ? 'Submitting...' : 'Create Job Card'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            
        </div>
    );
}