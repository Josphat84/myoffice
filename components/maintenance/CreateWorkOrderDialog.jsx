// app/maintenance/page.js (Visually Polished Version)
'use client';

import { useState } from 'react';
// Assuming these Shadcn/ui components are correctly imported/configured
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
// Assuming useToast is configured
import { useToast } from '@/hooks/use-toast'; 
import { Loader2, Plus, Save, Trash2, Settings, ListChecks, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react'; 
import jsPDF from 'jspdf'; 
import { format, parseISO } from 'date-fns';

// ----------------------------------------------------------------------
// 1. MOCK DATA
// ----------------------------------------------------------------------

const initialWorkOrders = [
  {
    id: 'WO-001',
    machine_name: 'CNC Mill #3 (Asset Tag: M103)',
    title: 'Spindle Bearing Replacement',
    description: 'Noise coming from the main spindle during operation. Requires full bearing kit replacement and dynamic balancing.',
    priority: 'critical',
    assigned_name: 'Bongani Khumalo',
    scheduled_date: '2025-11-10',
    due_date: '2025-11-12',
    estimated_hours: 8.0,
    status: 'In Progress',
    tasks: ['Inspect spindle assembly', 'Order bearing kit', 'Remove old bearings', 'Install new bearings', 'Test run'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'WO-002',
    machine_name: 'Laser Cutter 200W (Asset Tag: L201)',
    title: 'Lens Cleaning & Calibration',
    description: 'Routine maintenance to ensure beam focus and power are optimized. Low priority, preventative maintenance.',
    priority: 'low',
    assigned_name: 'Nomusa Mdluli',
    scheduled_date: '2025-11-15',
    due_date: '2025-11-15',
    estimated_hours: 2.5,
    status: 'Pending',
    tasks: ['Clean CO2 optics', 'Align beam path', 'Run test cuts'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'WO-003',
    machine_name: 'HVAC Unit 4A',
    title: 'Filter Change & Condenser Check',
    description: 'Quarterly preventative maintenance. Airflow seems restricted on the south side of the building.',
    priority: 'medium',
    assigned_name: 'Sipho Dlamini',
    scheduled_date: '2025-11-05',
    due_date: '2025-11-07',
    estimated_hours: 4.0,
    status: 'Completed',
    tasks: ['Change air filters', 'Clean condensate drains', 'Check refrigerant levels'],
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

// ----------------------------------------------------------------------
// 2. MAIN PAGE COMPONENT (Contains all functionality)
// ----------------------------------------------------------------------

export default function MaintenancePage() {
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    machine_name: '',
    title: '',
    description: '',
    priority: 'medium',
    assigned_name: '',
    scheduled_date: '',
    due_date: '',
    estimated_hours: '',
    tasks: ['']
  });

  // --- Utility Functions ---

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'critical': return 'text-white bg-red-600 border-red-700';
      case 'high': return 'text-orange-900 bg-orange-200 border-orange-300';
      case 'medium': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-800 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };
  
  const getStatusClasses = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-800 bg-blue-100 border-blue-200';
      case 'Completed': return 'text-green-800 bg-green-100 border-green-200';
      case 'Pending': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // --- CRUD Handlers (Frontend Mock) ---

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
        };

        setWorkOrders(prev => [newWorkOrder, ...prev]);

        toast({
          title: 'Work Order Created',
          description: `Work order ${newId} for ${formData.machine_name} is now Pending.`,
        });

        // Reset form and close dialog
        setFormData({
          machine_name: '', title: '', description: '', priority: 'medium',
          assigned_name: '', scheduled_date: '', due_date: '',
          estimated_hours: '', tasks: ['']
        });
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

  // --- Task Management Functions ---
  const addTask = () => setFormData(prev => ({ ...prev, tasks: [...prev.tasks, ''] }));
  const updateTask = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };
  const removeTask = (index) => setFormData(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));

  // --- PDF Generation Function (Same enhanced logic as before) ---
  const generateWorkOrderPDF = (data) => {
    if (!data.title || !data.machine_name) {
        return toast({
            title: 'Missing Data',
            description: 'Cannot generate PDF without Title and Machine Name.',
            variant: 'destructive',
        });
    }

    const doc = new jsPDF();
    let y = 15;
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const lineLength = pageWidth - 2 * margin;

    // --- 1. Header ---
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`Maintenance Work Order: ${data.id || 'NEW'}`, pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Created: ${format(parseISO(data.created_at || new Date().toISOString()), 'MMM dd, yyyy')}`, pageWidth / 2, y, { align: 'center' });
    y += 15;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // --- 2. Work Request Details ---
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('I. Work Request Details', margin, y);
    y += 7;

    doc.setFontSize(11);
    const details = [
      { label: 'Machine/Asset:', value: data.machine_name },
      { label: 'Priority:', value: data.priority.toUpperCase() },
      { label: 'Assigned Artisan:', value: data.assigned_name || 'Unassigned' },
      { label: 'Status:', value: data.status || 'Pending' },
      { label: 'Scheduled Date:', value: data.scheduled_date || 'N/A' },
      { label: 'Due Date:', value: data.due_date || 'N/A' },
      { label: 'Est. Hours:', value: data.estimated_hours ? `${data.estimated_hours} hrs` : 'N/A' },
    ];
    
    let detailY = y;
    
    details.forEach((item, index) => {
        const col = index % 3; 
        const xPos = margin + col * 65; 
        
        doc.setFont(undefined, 'bold');
        doc.text(item.label, xPos, detailY);
        
        doc.setFont(undefined, 'normal');
        const labelWidth = doc.getStringUnitWidth(item.label) * doc.getFontSize() * 0.35;
        doc.text(item.value, xPos + labelWidth + 2, detailY);
        
        if (col === 2) {
          detailY += 7; 
        }
    });

    y = detailY + 10;

    // Description
    doc.setFont(undefined, 'bold');
    doc.text('Description:', margin, y);
    y += 4;
    doc.setFont(undefined, 'normal');
    const descriptionLines = doc.splitTextToSize(data.description || 'No detailed description provided.', lineLength);
    doc.text(descriptionLines, margin, y);
    y += (descriptionLines.length * 5) + 5;

    // Tasks Required (Checklist style)
    if (y > 270) { doc.addPage(); y = 15; }
    doc.setFont(undefined, 'bold');
    doc.text('Tasks/Instructions:', margin, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    
    const validTasks = data.tasks.filter(t => t.trim() !== '');
    if (validTasks.length === 0) {
        doc.text("No specific tasks listed.", margin, y);
        y += 6;
    } else {
        validTasks.forEach((task, index) => {
            if (y > 270) { doc.addPage(); y = 15; }
            doc.rect(margin, y - 4, 3, 3);
            doc.text(task, margin + 5, y);
            y += 6;
        });
    }
    y += 5;
    
    // --- 3. Artisan Completion Report Section ---
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('II. Completion Report (Artisan Use Only)', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    // a) Time Tracking
    doc.setFontSize(11);
    doc.text('Time Tracking:', margin, y);
    y += 5;

    const timeLabels = ['Start Time:', 'End Time:', 'Total Duration (hrs):', 'Completion Date:'];
    let timeY = y;
    
    timeLabels.forEach((label, index) => {
        const col = index % 2; 
        const xPos = margin + col * 90; 
        
        doc.setFont(undefined, 'bold');
        doc.text(label, xPos, timeY);
        
        doc.setFont(undefined, 'normal');
        doc.line(xPos + 35, timeY + 1, xPos + 80, timeY + 1); 
        
        if (col === 1) {
          timeY += 8; 
        }
    });
    y = timeY + 5;
    
    if (y > 260) { doc.addPage(); y = 15; }

    // b) Work Actually Performed / Feedback
    doc.setFont(undefined, 'bold');
    doc.text('Work Actually Performed:', margin, y);
    y += 3;
    doc.setFont(undefined, 'normal');
    for(let i = 0; i < 4; i++) {
        doc.line(margin, y + 5 + (i * 5), pageWidth - margin, y + 5 + (i * 5));
    }
    y += 30; 

    // c) Spares/Parts Used
    if (y > 260) { doc.addPage(); y = 15; }
    doc.setFont(undefined, 'bold');
    doc.text('Spares/Parts Used (Item, Quantity, Part No.):', margin, y);
    y += 3;
    doc.setFont(undefined, 'normal');
    for(let i = 0; i < 3; i++) {
        doc.line(margin, y + 5 + (i * 5), pageWidth - margin, y + 5 + (i * 5));
    }
    y += 20;

    // d) Final Status / Signatures
    if (y > 270) { doc.addPage(); y = 15; }
    doc.setFont(undefined, 'bold');
    doc.text('Final Status (e.g., Running, Shut Down, Needs Inspection):', margin, y);
    y += 7;
    doc.line(margin + 5, y, pageWidth - margin, y); 
    y += 10;

    // Signatures
    doc.text('Artisan Signature:', margin, y);
    doc.text('Supervisor Signature:', pageWidth / 2 + 10, y);
    
    // Signature lines
    doc.line(margin + 35, y, margin + 90, y); 
    doc.line(pageWidth / 2 + 45, y, pageWidth - margin, y); 
    y += 5;

    doc.save(`WorkOrder-${data.id || 'Draft'}-${data.title.replace(/\s/g, '_').substring(0, 20)}.pdf`);

    toast({
      title: 'Download Successful',
      description: 'The elegant work order PDF has been generated.',
    });
  };

  // ----------------------------------------------------------------------
  // 3. RENDER FUNCTION (Polished UI)
  // ----------------------------------------------------------------------

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      
      {/* --- Dashboard Header --- */}
      <div className="flex justify-between items-center pb-2 border-b">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-gray-900">
            Maintenance Dashboard
        </h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-md">
          <Plus className="h-5 w-5 mr-2" /> Create Work Order
        </Button>
      </div>

      <p className="text-sm text-gray-500 italic">
        **Frontend Mock Mode:** All functionality (Create, Delete, PDF) uses local state and mock data.
      </p>

      {/* --- Dashboard Stats (Elegant Cards) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Orders</CardTitle>
            <ListChecks className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workOrders.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active and Completed</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-red-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Critical Priority</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {workOrders.filter(wo => wo.priority === 'critical').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-yellow-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {workOrders.filter(wo => wo.status === 'Pending').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting scheduling/assignment</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Completed (Mock)</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {workOrders.filter(wo => wo.status === 'Completed').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Successfully closed orders</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Work Order List (Sleek List Items) --- */}
      <h2 className="text-2xl font-semibold tracking-tight pt-4 border-t">Active Work Orders ({workOrders.length})</h2>
      <div className="space-y-3">
        {workOrders.length === 0 ? (
          <p className="text-gray-500 italic p-4 bg-white rounded-lg shadow-sm">No work orders found. Create one to get started!</p>
        ) : (
          workOrders.map((order) => (
            <Card 
              key={order.id} 
              className="p-4 flex justify-between items-center transition-all duration-200 hover:shadow-lg hover:border-blue-300 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex-1 space-y-1">
                {/* Header Row: ID, Title, Status, Priority */}
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-blue-700 min-w-[100px]">{order.id}</span>
                  <h3 className="text-lg font-semibold truncate flex-1">{order.title}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(order.status)} min-w-[100px] text-center`}>
                    {order.status}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityClasses(order.priority)} min-w-[80px] text-center`}>
                    {order.priority.toUpperCase()}
                  </span>
                </div>
                {/* Subtitle Row: Machine, Assigned, Due Date */}
                <div className="text-sm text-gray-600 pl-2">
                    <span className="font-medium">{order.machine_name}</span> 
                    <span className="mx-2 text-gray-400">|</span>
                    Assigned to: **{order.assigned_name || 'Unassigned'}** <span className="mx-2 text-gray-400">|</span>
                    Due: <span className="font-medium text-red-500">
                        {order.due_date ? format(parseISO(order.due_date), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                 <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); generateWorkOrderPDF(order); }}>
                    <Save className="h-4 w-4 mr-2" /> PDF
                 </Button>
                 <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }}>
                    <Trash2 className="h-4 w-4" />
                 </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* --- Work Order Details View (Modal or Card) --- */}
      {selectedOrder && (
        <Card className="mt-8 p-6 shadow-2xl border-t-4 border-blue-500 bg-white">
            <CardHeader className="flex flex-row items-start justify-between p-0 mb-4">
                <CardTitle className="text-3xl font-bold text-gray-800">
                    <span className="text-blue-600">{selectedOrder.id}:</span> {selectedOrder.title}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-800">
                    Close Details
                </Button>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                    <div className="text-sm"><span className="font-semibold text-gray-700 flex items-center"><Settings className="h-4 w-4 mr-2"/> Machine:</span> {selectedOrder.machine_name}</div>
                    <div className="text-sm"><span className="font-semibold text-gray-700 flex items-center"><AlertTriangle className="h-4 w-4 mr-2"/> Priority:</span> 
                        <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full border ${getPriorityClasses(selectedOrder.priority)}`}>
                            {selectedOrder.priority.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-sm"><span className="font-semibold text-gray-700 flex items-center"><Calendar className="h-4 w-4 mr-2"/> Due Date:</span> {selectedOrder.due_date || 'N/A'}</div>
                    <div className="text-sm"><span className="font-semibold text-gray-700 flex items-center"><Clock className="h-4 w-4 mr-2"/> Est. Hours:</span> {selectedOrder.estimated_hours || 'N/A'}</div>
                    <div className="text-sm"><span className="font-semibold text-gray-700 flex items-center"><ListChecks className="h-4 w-4 mr-2"/> Status:</span> 
                        <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(selectedOrder.status)}`}>
                            {selectedOrder.status}
                        </span>
                    </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-700">Description:</h4>
                <p className="text-gray-800 border-l-4 border-gray-200 pl-4 italic">{selectedOrder.description}</p>
                
                <h4 className="text-lg font-bold text-gray-700 border-t pt-4">Required Tasks:</h4>
                <ul className="space-y-2">
                    {selectedOrder.tasks.map((task, index) => (
                        <li key={index} className="text-gray-700 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            {task}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="flex justify-end p-0 pt-6 border-t mt-6">
                <Button onClick={() => generateWorkOrderPDF(selectedOrder)} variant="secondary">
                    Download Work Order PDF
                </Button>
            </CardFooter>
        </Card>
      )}
      
      {/* --- CREATE WORK ORDER DIALOG (Improved Spacing and Inputs) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Work Order</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule maintenance work. Fields marked * are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MACHINE INPUT FIELD */}
              <div className="space-y-2">
                <Label htmlFor="machine_name">Machine *</Label>
                <Input
                  id="machine_name"
                  placeholder="e.g., HVAC Unit 4A or CNC Mill #3"
                  value={formData.machine_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, machine_name: e.target.value }))}
                  required
                />
              </div>

              {/* PRIORITY SELECT */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
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
              <Input
                id="title"
                placeholder="Brief summary of the work (e.g., Pump Seal Replacement)"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed context for the technician..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ASSIGNED TO INPUT FIELD */}
              <div className="space-y-2">
                <Label htmlFor="assigned_name">Assign To (Artisan)</Label>
                <Input
                  id="assigned_name"
                  placeholder="e.g., Nomusa Mdluli"
                  value={formData.assigned_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigned_name: e.target.value }))}
                />
              </div>

              {/* ESTIMATED HOURS */}
              <div className="space-y-2">
                <Label htmlFor="estimated_hours">Est. Hours</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="8.0"
                  value={formData.estimated_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                />
              </div>

              {/* DUE DATE */}
              <div className="space-y-2">
                <Label htmlFor="due_date">Target Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            </div>

            {/* TASK LISTING */}
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-base">Required Steps/Tasks</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addTask} className="text-blue-600 hover:text-blue-800">
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              </div>
              {formData.tasks.map((task, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Task ${index + 1}: Check filter status...`}
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                  />
                  {(formData.tasks.length > 1 || index > 0) && ( 
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(index)}
                      className="text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              {/* DOWNLOAD PDF BUTTON */}
              <Button
                type="button"
                variant="secondary"
                onClick={() => generateWorkOrderPDF({ ...formData, id: 'NEW-DRAFT', created_at: new Date().toISOString(), status: 'Draft' })}
                disabled={loading || !formData.title || !formData.machine_name}
              >
                <Save className="h-4 w-4 mr-2" />
                Download Draft PDF
              </Button>
              {/* SUBMIT BUTTON */}
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {loading ? 'Creating...' : 'Submit Work Order'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}