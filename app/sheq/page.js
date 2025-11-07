// app/sheq/page.js (SHEQ Reporting Dashboard - Premium & Robust)
'use client';

import { useState, useMemo } from 'react';
// Shadcn Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator'; 
import { useToast } from '@/hooks/use-toast'; 
// Icons (Lucide)
import { 
    Plus, Save, Trash2, Search, Filter, AlertTriangle, CheckCircle, 
    User, Calendar, ListChecks, X, Zap, BarChart2, TrendingUp, XOctagon 
} from 'lucide-react'; 
import { format, parseISO } from 'date-fns';

// ----------------------------------------------------------------------
// 1. CONFIGURATION & MOCK DATA
// ----------------------------------------------------------------------

const REPORT_TYPES = [
    { value: 'all', label: 'All Reports' },
    { value: 'inspection', label: 'Inspection Report', icon: ListChecks, color: 'text-indigo-600' },
    { value: 'near_miss', label: 'Near Miss Report', icon: AlertTriangle, color: 'text-yellow-600' },
    { value: 'work_stop', label: 'Work Stoppage Report', icon: XOctagon, color: 'text-red-600' }
];

const MOCK_PERSONNEL = [
  'All Personnel', 
  'Bongani Khumalo', 
  'Nomusa Mdluli', 
  'Sipho Dlamini',
];

const initialReports = [
  {
    id: 'SHEQ-001',
    type: 'inspection',
    title: 'Daily Crane Inspection - Site A',
    description: 'All safety features checked. Found minor fraying on lift cable 3.',
    person_name: 'Bongani Khumalo',
    date: '2025-11-06',
    status: 'High Risk - Open',
    severity: 'high',
    details: 'Cable requires replacement within 7 days. Crane usage limited to 50% load until resolved.',
  },
  {
    id: 'SHEQ-002',
    type: 'near_miss',
    title: 'Forklift near miss with pedestrian',
    description: 'Pedestrian walked into active area (Zone 3) while forklift was reversing. No injury.',
    person_name: 'Nomusa Mdluli',
    date: '2025-11-05',
    status: 'Closed',
    severity: 'medium',
    details: 'Refresher training issued to pedestrian and driver. Yellow barrier tape installed.',
  },
  {
    id: 'SHEQ-003',
    type: 'work_stop',
    title: 'Unsecured Scaffold Section',
    description: 'Scaffold section (Bay 5) found unsecured at height. Immediately initiated work stoppage.',
    person_name: 'Sipho Dlamini',
    date: '2025-11-07', // Most recent
    status: 'Critical - Investigation',
    severity: 'critical',
    details: 'Foreman notified. All workers cleared from the area. Safety tag placed on scaffold.',
  },
];

// ----------------------------------------------------------------------
// 2. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function SHEQPage() {
  const [reports, setReports] = useState(initialReports);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null); 
  const [loading, setLoading] = useState(false);

  // Filters and Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPerson, setFilterPerson] = useState('All Personnel'); 
  const [sortBy, setSortBy] = useState({ key: 'date', direction: 'desc' }); // Default: most recent
  
  // Form state for creating a new report
  const [newReportType, setNewReportType] = useState(null); // Used for the initial selection
  const [formData, setFormData] = useState({
      type: '', title: '', description: '', person_name: '', 
      date: format(new Date(), 'yyyy-MM-dd'), status: 'Open', severity: 'medium', details: '',
  });

  const { toast } = useToast();

  // --- Utility Functions ---

  const getReportTypeConfig = (type) => REPORT_TYPES.find(r => r.value === type) || REPORT_TYPES[0];

  const getSeverityClasses = (severity) => {
    switch (severity) {
      case 'critical': return 'text-white bg-red-600 border-red-700';
      case 'high': return 'text-yellow-900 bg-yellow-300 border-yellow-400';
      case 'medium': return 'text-indigo-800 bg-indigo-100 border-indigo-200';
      case 'low': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const clearSelection = () => {
    setSelectedReport(null);
    setIsSheetOpen(false);
  };
  
  // --- Filtering and Sorting Logic ---
  const filteredAndSortedReports = useMemo(() => {
    let currentReports = [...reports];
    
    // 1. Filtering by Report Type
    if (filterType !== 'all') {
      currentReports = currentReports.filter(report => report.type === filterType);
    }
    
    // 2. Filtering by Person
    if (filterPerson !== 'All Personnel') {
      currentReports = currentReports.filter(report => report.person_name === filterPerson);
    }
    
    // 3. Searching
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      currentReports = currentReports.filter(report =>
        report.id.toLowerCase().includes(lowerSearch) ||
        report.title.toLowerCase().includes(lowerSearch) ||
        report.description.toLowerCase().includes(lowerSearch) ||
        report.person_name.toLowerCase().includes(lowerSearch)
      );
    }
    
    // 4. Sorting
    currentReports.sort((a, b) => {
      const aValue = a[sortBy.key];
      const bValue = b[sortBy.key];
      let comparison = 0;
      
      if (sortBy.key === 'date') {
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }
      
      return sortBy.direction === 'asc' ? comparison : comparison * -1;
    });

    return currentReports;
  }, [reports, filterType, filterPerson, searchTerm, sortBy]);
  
  // --- Quick Stats Calculation ---
  const stats = useMemo(() => {
      const total = reports.length;
      const open = reports.filter(r => r.status.includes('Open') || r.status.includes('Investigation')).length;
      const critical = reports.filter(r => r.severity === 'critical').length;
      
      const last7Days = reports.filter(r => {
          const reportDate = new Date(r.date);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return reportDate >= sevenDaysAgo;
      }).length;
      
      return { total, open, critical, last7Days };
  }, [reports]);

  // --- CRUD/Form Handlers ---

  const handleStartNewReport = (type) => {
      setNewReportType(type);
      setFormData(prev => ({ 
          ...prev, 
          type, 
          title: '', description: '', details: '', 
          status: 'Open', 
          severity: 'medium',
          date: format(new Date(), 'yyyy-MM-dd') 
      }));
      setIsDialogOpen(true);
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
        const currentMaxId = reports.length > 0 
            ? Math.max(...reports.map(r => parseInt(r.id.split('-')[1].replace(/\D/g,''))))
            : 0;
        const newId = `SHEQ-${String(currentMaxId + 1).padStart(3, '0')}`;

        const newReport = {
            id: newId,
            ...formData,
        };

        setReports(prev => [newReport, ...prev]);
        toast({
            title: 'Report Filed',
            description: `${getReportTypeConfig(formData.type).label} ${newId} recorded successfully.`,
        });
        setIsDialogOpen(false);
        setLoading(false);
        setNewReportType(null);
    }, 500);
  };
  
  const handleEditReport = (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    
    // Logic to save the updated details from the sheet form (omitted for brevity)
    // For this example, we'll only update the status/severity in the sheet:
    
    // *** You would typically have another state/form for editing existing details here ***
    // For now, let's just close the sheet and acknowledge.
    
    toast({
      title: 'Report Updated',
      description: `Report ${selectedReport.id} details saved and status reviewed.`,
    });
    clearSelection();
  };

  // ----------------------------------------------------------------------
  // 3. RENDER COMPONENTS
  // ----------------------------------------------------------------------

  // --- 3.1 Quick Stats Bar ---
  const QuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="shadow-lg border-l-4 border-indigo-600 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Reports Filed</CardTitle>
          <BarChart2 className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-yellow-600 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Open Risk Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.open}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-red-600 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Critical Incidents</CardTitle>
          <XOctagon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.critical}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-green-600 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">New (Last 7 Days)</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.last7Days}</div>
        </CardContent>
      </Card>
    </div>
  );
  
  // --- 3.2 Report List Item ---
  const ReportListItem = ({ report }) => {
    const config = getReportTypeConfig(report.type);
    const SeverityTag = getSeverityClasses(report.severity);
    
    return (
        <Card 
            className={`p-4 flex flex-col sm:flex-row items-start sm:items-center transition-all duration-300 hover:shadow-lg cursor-pointer bg-white border-l-4 ${getReportTypeConfig(report.type).color.replace('text', 'border')}`}
            onClick={() => setSelectedReport(report)}
        >
            <div className="grid grid-cols-12 w-full items-center gap-3">
                
                {/* ID & Title (Col 1-5) */}
                <div className="col-span-12 sm:col-span-5 flex items-start sm:items-center space-x-3 truncate">
                    <config.icon className={`h-5 w-5 ${config.color} flex-shrink-0 mt-1 sm:mt-0`} />
                    <div className="truncate">
                        <span className="block text-sm font-extrabold text-gray-800 tracking-wide">{report.id}</span>
                        <h3 className="text-base font-semibold text-gray-900 truncate leading-tight">{report.title}</h3>
                    </div>
                </div>

                {/* Person & Date (Col 6-8) */}
                <div className="col-span-6 sm:col-span-3 text-sm text-gray-600 space-y-1 sm:border-l sm:pl-4">
                    <div className="flex items-center space-x-1 truncate">
                        <User className="h-4 w-4 text-gray-400 flex-shrink-0"/> 
                        <span className="font-semibold truncate text-gray-700">{report.person_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1 truncate">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0"/> 
                        <span className="font-medium truncate text-gray-600">{format(parseISO(report.date), 'MMM dd, yyyy')}</span>
                    </div>
                </div>
                
                {/* Status & Severity (Col 9-12) */}
                <div className="col-span-6 sm:col-span-4 flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full border shadow-sm ${SeverityTag} min-w-[80px] inline-block text-center`}>
                        {report.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${report.status.includes('Open') || report.status.includes('Investigation') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'} inline-block min-w-[100px] text-center`}>
                        {report.status}
                    </span>
                    {/* Placeholder for action buttons if needed */}
                </div>
            </div>
        </Card>
    );
  };
  
  // --- 3.3 Report Detail/Editing Sidebar ---
  const ReportDetailSidebar = ({ report, isOpen, onClose }) => {
    if (!report) return null;
    const config = getReportTypeConfig(report.type);
    
    // In a real app, you would load the full, editable details here
    const [status, setStatus] = useState(report.status);
    const [severity, setSeverity] = useState(report.severity);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="sm:max-w-md md:max-w-lg w-full bg-gray-50 p-0 flex flex-col border-l-4 border-indigo-600">
                <SheetHeader className="p-6 bg-white border-b border-gray-100 shadow-sm">
                    <SheetTitle className="text-2xl font-extrabold text-gray-900 flex items-center">
                        <config.icon className={`h-6 w-6 mr-2 ${config.color}`} />
                        {report.id}: <span className="ml-2 text-indigo-600">{config.label}</span>
                    </SheetTitle>
                    <SheetDescription className="text-gray-600">
                        Review and update the status of this SHEQ incident.
                    </SheetDescription>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 rounded-full hover:bg-indigo-50">
                            <X className="h-5 w-5 text-gray-500" />
                        </Button>
                    </SheetClose>
                </SheetHeader>

                <ScrollArea className="flex-1 px-6 pb-6">
                    <div className="space-y-6 pt-4">
                        
                        {/* Initial Report Details - Read Only */}
                        <div className="p-4 border rounded-xl bg-white shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Initial Report</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <p><span className="font-semibold text-gray-600">Reported By:</span> <span className="font-medium text-gray-800 block">{report.person_name}</span></p>
                                <p><span className="font-semibold text-gray-600">Date Filed:</span> <span className="font-medium text-gray-800 block">{format(parseISO(report.date), 'MMM dd, yyyy')}</span></p>
                                <p className="col-span-2"><span className="font-semibold text-gray-600">Title:</span> <span className="font-medium text-gray-800 block">{report.title}</span></p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="font-semibold text-gray-600">Description:</h4>
                                <p className="text-gray-700 italic border-l-2 border-indigo-300 pl-3">{report.description}</p>
                                <h4 className="font-semibold text-gray-600 mt-3">Initial Details:</h4>
                                <p className="text-gray-700 font-medium bg-gray-50 p-2 rounded-md">{report.details}</p>
                            </div>
                        </div>
                        
                        {/* Investigation/Resolution Form (Editable) */}
                        <form onSubmit={handleEditReport} className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Action & Resolution</h3>

                            <div className="space-y-4 p-4 border rounded-xl bg-indigo-50/50">
                                <div className="space-y-2">
                                    <Label htmlFor="severity" className="font-semibold text-indigo-700">Severity Rating</Label>
                                    <Select value={severity} onValueChange={setSeverity}>
                                        <SelectTrigger className="bg-white border-indigo-300"><SelectValue placeholder="Severity" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="critical">Critical</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="font-semibold text-indigo-700">Current Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className="bg-white border-indigo-300"><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="Investigation">Investigation</SelectItem>
                                            <SelectItem value="Awaiting Closure">Awaiting Closure</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="resolution" className="font-semibold text-gray-700">Resolution/Follow-up Notes</Label>
                                    <Textarea id="resolution" placeholder="Record investigation findings, corrective actions, and closure details." rows={5} className="bg-white border-gray-300 focus-visible:ring-indigo-500"/>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-gray-50">
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Save Investigation
                                </Button>
                            </div>
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
      
      {/* --- Dashboard Header & New Report Action --- */}
      <Card className="bg-white p-4 md:p-6 shadow-xl border-t-4 border-indigo-600 rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              <Zap className="h-6 w-6 inline mr-2 text-indigo-600"/> SHEQ Reporting Dashboard
          </h1>
          
          {/* New Report Dropdown */}
          <Select onValueChange={handleStartNewReport} value={null}>
            <SelectTrigger className="w-full sm:w-[250px] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg">
                <Plus className="h-5 w-5 mr-2" /> 
                <SelectValue placeholder="File New Report..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {REPORT_TYPES.filter(r => r.value !== 'all').map(r => (
                    <SelectItem key={r.value} value={r.value} className="flex items-center">
                        <r.icon className={`h-4 w-4 mr-2 ${r.color}`} /> {r.label}
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* --- Quick Stats --- */}
      <QuickStats />

      {/* --- Filter, Search & Sort Controls --- */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by ID or Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filters and Sorts */}
        <div className="flex gap-3 flex-wrap">
            {/* Report Type Filter */}
            <div className="w-[120px] sm:w-[150px]">
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                        {REPORT_TYPES.map(r => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
            {/* Person Filter */}
            <div className="w-[150px] sm:w-[180px]">
                <Select value={filterPerson} onValueChange={setFilterPerson}>
                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Personnel" /></SelectTrigger>
                    <SelectContent>
                        {MOCK_PERSONNEL.map(person => (<SelectItem key={person} value={person}>{person}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
            {/* Sort By (Date/Person/Severity) */}
            <div className="w-[120px] sm:w-[150px]">
                <Select value={sortBy.key} onValueChange={(key) => setSortBy(prev => ({ key, direction: prev.direction }))}>
                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Sort By" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date">Most Recent</SelectItem>
                        <SelectItem value="person_name">Person (A-Z)</SelectItem>
                        <SelectItem value="severity">Severity</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold tracking-tight pt-2 text-gray-900 border-t border-gray-200">
        Reports Filed ({filteredAndSortedReports.length})
      </h2>
      
      {/* --- RENDER REPORTS --- */}
      <div className="space-y-3">
        {/* List View Header */}
        <div className="hidden sm:grid grid-cols-12 w-full text-xs font-semibold text-gray-500 px-4 py-2 border-b border-gray-300 bg-gray-100 rounded-t-lg">
          <span className="col-span-5">REPORT ID & TITLE</span>
          <span className="col-span-3">PERSONNEL & DATE</span>
          <span className="col-span-4">RISK LEVEL & STATUS</span>
        </div>
        {filteredAndSortedReports.map((report) => (
          <ReportListItem key={report.id} report={report} />
        ))}
      </div>

      {/* --- Detail/Editing Sidebar --- */}
      <ReportDetailSidebar 
        report={selectedReport} 
        isOpen={isSheetOpen} 
        onClose={clearSelection} 
      />
      
      {/* --- New Report Creation Dialog --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xs sm:max-w-lg md:max-w-xl max-h-[95vh] overflow-y-auto p-6 bg-white border-gray-300 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-600">{newReportType ? getReportTypeConfig(newReportType).label : 'File New Report'}</DialogTitle>
            <Separator className="my-2" />
          </DialogHeader>

          <form onSubmit={handleCreateReport} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="person_name">Reported By *</Label>
                <Select value={formData.person_name} onValueChange={(value) => setFormData(prev => ({ ...prev, person_name: value }))} required>
                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Select Personnel" /></SelectTrigger>
                    <SelectContent>
                        {MOCK_PERSONNEL.filter(p => p !== 'All Personnel').map(person => (
                            <SelectItem key={person} value={person}>{person}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date of Incident/Inspection *</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} required className="bg-gray-50 border-gray-300" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Summary Title *</Label>
              <Input id="title" placeholder="e.g., Daily Crane Inspection #3" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required className="bg-gray-50 border-gray-300" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description *</Label>
              <Textarea id="description" placeholder="What happened, or what was checked? (2-3 sentences)" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} required className="bg-gray-50 border-gray-300" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Detailed Findings/Actions Required</Label>
              <Textarea id="details" placeholder="Detailed account, root cause, or initial mitigation steps." value={formData.details} onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))} rows={4} className="bg-gray-50 border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Initial Severity Rating</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Severity" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Input value="Open" readOnly className="bg-gray-200 border-gray-300 font-bold" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                {loading ? 'Submitting...' : 'File Report'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}