// frontend/app/leave-management/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { 
  Calendar,
  Plus,
  Trash2,
  Edit3,
  History,
  Users,
  Download,
  Upload,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building,
  CalendarDays,
  FileText,
  BarChart3,
  TrendingUp,
  Award,
  Shield,
  Zap,
  Eye,
  Send,
  Printer,
  Copy,
  FileDown,
  Grid3X3,
  List,
  FileUp,
  MoreHorizontal,
  EyeIcon
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// Sample data
const LEAVE_TYPES = [
  { id: 'annual', name: 'Annual Leave', color: 'bg-green-500', maxDays: 25, icon: '🏖️' },
  { id: 'sick', name: 'Sick Leave', color: 'bg-blue-500', maxDays: 15, icon: '🤒' },
  { id: 'personal', name: 'Personal Leave', color: 'bg-purple-500', maxDays: 10, icon: '👨‍👩‍👧' },
  { id: 'maternity', name: 'Maternity Leave', color: 'bg-pink-500', maxDays: 90, icon: '👶' },
  { id: 'paternity', name: 'Paternity Leave', color: 'bg-teal-500', maxDays: 14, icon: '👨‍🍼' },
  { id: 'emergency', name: 'Emergency Leave', color: 'bg-orange-500', maxDays: 5, icon: '🚨' }
];

const TEAM_MEMBERS = [
  { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Senior Developer', department: 'Engineering', avatar: 'JS' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'UI/UX Designer', department: 'Design', avatar: 'SJ' },
  { id: 3, name: 'Mike Chen', email: 'mike@company.com', role: 'Project Manager', department: 'Management', avatar: 'MC' },
  { id: 4, name: 'Emily Davis', email: 'emily@company.com', role: 'Marketing Lead', department: 'Marketing', avatar: 'ED' },
  { id: 5, name: 'David Wilson', email: 'david@company.com', role: 'Frontend Developer', department: 'Engineering', avatar: 'DW' }
];

const LeaveManagementSystem = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('new-request');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [teamLeaveStats, setTeamLeaveStats] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    department: 'all'
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');

  const [newRequest, setNewRequest] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    totalDays: 0,
    reason: '',
    emergencyContact: '',
    handoverNotes: '',
    status: 'pending'
  });

  // Initialize component
  useEffect(() => {
    setIsClient(true);
    
    // Sample leave requests data
    const sampleRequests = [
      {
        id: 1,
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        department: 'Engineering',
        leaveType: 'annual',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        totalDays: 5,
        reason: 'Family vacation to Hawaii for quality time with family and relaxation',
        emergencyContact: '+1 (555) 123-4567',
        handoverNotes: 'Project documentation updated. Code reviews completed. All pending tasks assigned to team members.',
        status: 'approved',
        submittedDate: '2024-01-15',
        approvedBy: 'Mike Chen',
        approvedDate: '2024-01-18',
        priority: 'medium'
      },
      {
        id: 2,
        employeeName: 'Sarah Johnson',
        employeeId: 'EMP002',
        department: 'Design',
        leaveType: 'sick',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        totalDays: 3,
        reason: 'Medical appointment and recovery from minor surgery',
        emergencyContact: '+1 (555) 987-6543',
        handoverNotes: 'Design files shared with team. Client feedback incorporated. Final mockups ready for review.',
        status: 'approved',
        submittedDate: '2024-01-18',
        approvedBy: 'Mike Chen',
        approvedDate: '2024-01-19',
        priority: 'high'
      },
      {
        id: 3,
        employeeName: 'David Wilson',
        employeeId: 'EMP005',
        department: 'Engineering',
        leaveType: 'personal',
        startDate: '2024-02-10',
        endDate: '2024-02-12',
        totalDays: 3,
        reason: 'Moving to new apartment and personal commitments',
        emergencyContact: '+1 (555) 456-7890',
        handoverNotes: 'Code deployment completed. Monitoring setup in place. Documentation updated for handover.',
        status: 'pending',
        submittedDate: '2024-01-20',
        priority: 'low'
      },
      {
        id: 4,
        employeeName: 'Emily Davis',
        employeeId: 'EMP004',
        department: 'Marketing',
        leaveType: 'emergency',
        startDate: '2024-01-25',
        endDate: '2024-01-26',
        totalDays: 2,
        reason: 'Family emergency requiring immediate attention',
        emergencyContact: '+1 (555) 321-0987',
        handoverNotes: 'Campaign schedule updated. Social media posts scheduled. Team briefed on ongoing campaigns.',
        status: 'rejected',
        submittedDate: '2024-01-22',
        approvedBy: 'Mike Chen',
        approvedDate: '2024-01-23',
        rejectionReason: 'Critical campaign launch during requested dates requires full team presence',
        priority: 'high'
      },
      {
        id: 5,
        employeeName: 'Mike Chen',
        employeeId: 'EMP003',
        department: 'Management',
        leaveType: 'paternity',
        startDate: '2024-03-01',
        endDate: '2024-03-14',
        totalDays: 14,
        reason: 'Paternity leave for newborn child',
        emergencyContact: '+1 (555) 654-3210',
        handoverNotes: 'Project timelines reviewed. Team leadership delegated. Client meetings rescheduled.',
        status: 'approved',
        submittedDate: '2024-01-10',
        approvedBy: 'HR Department',
        approvedDate: '2024-01-12',
        priority: 'medium'
      }
    ];

    setLeaveRequests(sampleRequests);

    // Sample team leave statistics
    const sampleStats = [
      { employeeId: 'EMP001', name: 'John Smith', annualUsed: 10, annualRemaining: 15, sickUsed: 2, personalUsed: 0 },
      { employeeId: 'EMP002', name: 'Sarah Johnson', annualUsed: 5, annualRemaining: 20, sickUsed: 5, personalUsed: 2 },
      { employeeId: 'EMP003', name: 'Mike Chen', annualUsed: 15, annualRemaining: 10, sickUsed: 1, personalUsed: 1 },
      { employeeId: 'EMP004', name: 'Emily Davis', annualUsed: 8, annualRemaining: 17, sickUsed: 3, personalUsed: 0 },
      { employeeId: 'EMP005', name: 'David Wilson', annualUsed: 12, annualRemaining: 13, sickUsed: 0, personalUsed: 1 }
    ];

    setTeamLeaveStats(sampleStats);
  }, []);

  // Calculate total days between dates
  const calculateTotalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Handle form changes
  const handleInputChange = (field, value) => {
    setNewRequest(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate total days when dates change
      if (field === 'startDate' || field === 'endDate') {
        updated.totalDays = calculateTotalDays(
          field === 'startDate' ? value : prev.startDate,
          field === 'endDate' ? value : prev.endDate
        );
      }
      
      return updated;
    });
  };

  // Submit new leave request
  const submitLeaveRequest = () => {
    if (!newRequest.employeeName || !newRequest.leaveType || !newRequest.startDate || !newRequest.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRequestWithId = {
      ...newRequest,
      id: Date.now(),
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      priority: 'medium'
    };

    setLeaveRequests(prev => [newRequestWithId, ...prev]);
    
    // Reset form
    setNewRequest({
      employeeName: '',
      employeeId: '',
      department: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      totalDays: 0,
      reason: '',
      emergencyContact: '',
      handoverNotes: '',
      status: 'pending'
    });

    toast.success("Leave request submitted successfully! 📅", {
      description: "Your request has been sent for approval."
    });
  };

  // Approve leave request
  const approveLeaveRequest = (id) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { 
              ...request, 
              status: 'approved',
              approvedBy: 'Manager',
              approvedDate: new Date().toISOString().split('T')[0]
            }
          : request
      )
    );
    toast.success("Leave request approved! ✅");
  };

  // Reject leave request
  const rejectLeaveRequest = (id) => {
    const rejectionReason = prompt("Please provide a reason for rejection:");
    if (rejectionReason) {
      setLeaveRequests(prev => 
        prev.map(request => 
          request.id === id 
            ? { 
                ...request, 
                status: 'rejected',
                approvedBy: 'Manager',
                approvedDate: new Date().toISOString().split('T')[0],
                rejectionReason
              }
            : request
        )
      );
      toast.success("Leave request rejected! ❌");
    }
  };

  // Delete leave request
  const deleteLeaveRequest = (id) => {
    setLeaveRequests(prev => prev.filter(request => request.id !== id));
    toast.success("Leave request deleted! 🗑️");
  };

  // Filter leave requests
  const filteredRequests = leaveRequests.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.type !== 'all' && request.leaveType !== filters.type) return false;
    if (filters.department !== 'all' && request.department !== filters.department) return false;
    if (searchTerm && !request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !request.department.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Pending</Badge>;
    }
  };

  // Get leave type info
  const getLeaveTypeInfo = (typeId) => {
    return LEAVE_TYPES.find(lt => lt.id === typeId) || LEAVE_TYPES[0];
  };

  // Calculate statistics
  const stats = {
    totalRequests: leaveRequests.length,
    pendingRequests: leaveRequests.filter(r => r.status === 'pending').length,
    approvedRequests: leaveRequests.filter(r => r.status === 'approved').length,
    rejectedRequests: leaveRequests.filter(r => r.status === 'rejected').length
  };

  // Generate PDF for leave request
  const generateLeavePDF = (request) => {
    const doc = new jsPDF();
    const themeColor = [30, 64, 175]; // Blue color

    // Set document properties
    doc.setProperties({
      title: `Leave Request - ${request.employeeName}`,
      subject: 'Leave Request Document',
      author: 'Leave Management System',
      keywords: 'leave, request, approval'
    });

    // Header with gradient effect
    doc.setFillColor(...themeColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Company Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ACME CORPORATION', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Leave Request Form', 20, 30);

    // Document Title
    doc.setTextColor(...themeColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LEAVE REQUEST', 180, 25, { align: 'right' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reference: LR-${request.id}`, 180, 32, { align: 'right' });

    // Employee Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPLOYEE INFORMATION', 20, 60);
    
    doc.setFont('helvetica', 'normal');
    let yPos = 70;
    doc.text(`Name: ${request.employeeName}`, 20, yPos);
    doc.text(`Employee ID: ${request.employeeId}`, 20, yPos + 8);
    doc.text(`Department: ${request.department}`, 20, yPos + 16);
    doc.text(`Submission Date: ${request.submittedDate}`, 20, yPos + 24);

    // Leave Details
    yPos += 40;
    doc.setFont('helvetica', 'bold');
    doc.text('LEAVE DETAILS', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    doc.text(`Leave Type: ${getLeaveTypeInfo(request.leaveType).name}`, 20, yPos);
    doc.text(`Start Date: ${request.startDate}`, 20, yPos + 8);
    doc.text(`End Date: ${request.endDate}`, 20, yPos + 16);
    doc.text(`Total Days: ${request.totalDays} days`, 20, yPos + 24);

    // Reason and Notes
    yPos += 40;
    doc.setFont('helvetica', 'bold');
    doc.text('REASON FOR LEAVE', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    const splitReason = doc.splitTextToSize(request.reason, 170);
    doc.text(splitReason, 20, yPos + 10);

    if (request.handoverNotes) {
      yPos += splitReason.length * 5 + 20;
      doc.setFont('helvetica', 'bold');
      doc.text('HANDOVER NOTES', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const splitHandover = doc.splitTextToSize(request.handoverNotes, 170);
      doc.text(splitHandover, 20, yPos + 10);
    }

    // Status Section
    yPos = 180;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 30, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('REQUEST STATUS', 25, yPos + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${request.status.toUpperCase()}`, 25, yPos + 20);
    
    if (request.approvedBy) {
      doc.text(`Approved By: ${request.approvedBy}`, 120, yPos + 10);
      doc.text(`Approval Date: ${request.approvedDate}`, 120, yPos + 20);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by Leave Management System', 105, pageHeight - 10, { align: 'center' });
    doc.text(`Document generated on ${new Date().toLocaleDateString()}`, 105, pageHeight - 5, { align: 'center' });

    // Save the PDF
    doc.save(`leave-request-${request.employeeName}-${request.id}.pdf`);
    toast.success("PDF generated successfully! 📄");
  };

  // Generate team report PDF
  const generateTeamReportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TEAM LEAVE REPORT', 105, 25, { align: 'center' });
    
    // Content
    doc.setTextColor(0, 0, 0);
    let yPos = 60;
    
    teamLeaveStats.forEach((employee, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(employee.name, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`Annual Leave: ${employee.annualUsed}/${employee.annualUsed + employee.annualRemaining} days`, 20, yPos + 8);
      doc.text(`Sick Leave Used: ${employee.sickUsed} days`, 20, yPos + 16);
      doc.text(`Personal Leave Used: ${employee.personalUsed} days`, 20, yPos + 24);
      
      yPos += 35;
    });

    // Summary
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY STATISTICS', 20, yPos + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Team Members: ${TEAM_MEMBERS.length}`, 20, yPos + 20);
    doc.text(`Total Leave Requests: ${stats.totalRequests}`, 20, yPos + 28);
    doc.text(`Approval Rate: ${Math.round((stats.approvedRequests / stats.totalRequests) * 100)}%`, 20, yPos + 36);

    doc.save(`team-leave-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Team report generated! 📊");
  };

  // Quick actions
  const quickActions = [
    { 
      icon: Download, 
      label: "Export Report", 
      action: generateTeamReportPDF 
    },
    { 
      icon: Upload, 
      label: "Import Data", 
      action: () => toast.success("Data imported! 📥") 
    },
    { 
      icon: Printer, 
      label: "Print Summary", 
      action: () => toast.success("Printing summary... 🖨️") 
    },
    { 
      icon: Send, 
      label: "Send Reminder", 
      action: () => toast.success("Reminder sent! 📧") 
    }
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading Leave Management System...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
                Leave Management System
              </h1>
              <p className="text-xl text-slate-600 mt-2">
                Manage employee leave requests and track time off
              </p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-slate-900">{stats.totalRequests}</div>
                <div className="text-xs text-slate-600">Total Requests</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
                <div className="text-xs text-slate-600">Pending</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approvedRequests}</div>
                <div className="text-xs text-slate-600">Approved</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejectedRequests}</div>
                <div className="text-xs text-slate-600">Rejected</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-slate-100/80 backdrop-blur-sm p-1 rounded-2xl border border-slate-200/50">
            <TabsTrigger value="new-request" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </TabsTrigger>
            <TabsTrigger value="requests" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4 mr-2" />
              All Requests
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              Team Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* New Request Tab */}
          <TabsContent value="new-request" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Sidebar - Quick Actions & Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Actions */}
                <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-14 flex-col gap-1 border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50 transition-all"
                                onClick={action.action}
                              >
                                <action.icon className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-medium">{action.label}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{action.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Leave Types Info */}
                <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Award className="w-5 h-5 text-purple-600" />
                      Leave Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {LEAVE_TYPES.map(type => (
                        <div key={type.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{type.icon}</span>
                            <div>
                              <div className="text-sm font-medium">{type.name}</div>
                              <div className="text-xs text-slate-500">Max {type.maxDays} days</div>
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Calendar */}
                <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CalendarDays className="w-5 h-5 text-green-600" />
                      Upcoming Time Off
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaveRequests
                        .filter(req => req.status === 'approved')
                        .slice(0, 3)
                        .map(request => (
                          <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                            <div>
                              <div className="text-sm font-medium">{request.employeeName}</div>
                              <div className="text-xs text-slate-500">
                                {request.startDate} to {request.endDate}
                              </div>
                            </div>
                            <Badge className={`${
                              getLeaveTypeInfo(request.leaveType).color.replace('bg-', 'bg-')
                            } text-white text-xs`}>
                              {getLeaveTypeInfo(request.leaveType).name.split(' ')[0]}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-6 h-6 text-blue-600" />
                      New Leave Request
                    </CardTitle>
                    <CardDescription>
                      Submit a new leave request for approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Employee Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="employeeName" className="text-sm font-medium">
                          Employee Name *
                        </Label>
                        <Select 
                          value={newRequest.employeeName} 
                          onValueChange={(value) => {
                            const employee = TEAM_MEMBERS.find(emp => emp.name === value);
                            handleInputChange('employeeName', value);
                            if (employee) {
                              handleInputChange('employeeId', `EMP00${employee.id}`);
                              handleInputChange('department', employee.department);
                            }
                          }}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {TEAM_MEMBERS.map(employee => (
                              <SelectItem key={employee.id} value={employee.name}>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                    {employee.avatar}
                                  </div>
                                  <div>
                                    <div>{employee.name}</div>
                                    <div className="text-xs text-slate-500">{employee.department}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="employeeId" className="text-sm font-medium">
                          Employee ID
                        </Label>
                        <Input
                          id="employeeId"
                          value={newRequest.employeeId}
                          onChange={(e) => handleInputChange('employeeId', e.target.value)}
                          className="focus:ring-2 focus:ring-blue-500 bg-slate-50"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="department" className="text-sm font-medium">
                          Department
                        </Label>
                        <Input
                          id="department"
                          value={newRequest.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="focus:ring-2 focus:ring-blue-500 bg-slate-50"
                          readOnly
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="leaveType" className="text-sm font-medium">
                          Leave Type *
                        </Label>
                        <Select 
                          value={newRequest.leaveType} 
                          onValueChange={(value) => handleInputChange('leaveType', value)}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            {LEAVE_TYPES.map(type => (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{type.icon}</span>
                                  <div>
                                    <div>{type.name}</div>
                                    <div className="text-xs text-slate-500">Max {type.maxDays} days</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Leave Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="startDate" className="text-sm font-medium">
                          Start Date *
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newRequest.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="endDate" className="text-sm font-medium">
                          End Date *
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newRequest.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="totalDays" className="text-sm font-medium">
                          Total Days
                        </Label>
                        <Input
                          id="totalDays"
                          value={newRequest.totalDays}
                          className="focus:ring-2 focus:ring-blue-500 bg-slate-50 font-semibold"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-3">
                      <Label htmlFor="reason" className="text-sm font-medium">
                        Reason for Leave *
                      </Label>
                      <Textarea
                        id="reason"
                        value={newRequest.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        placeholder="Please provide details about your leave request..."
                        rows={3}
                        className="focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="emergencyContact" className="text-sm font-medium">
                          Emergency Contact
                        </Label>
                        <Input
                          id="emergencyContact"
                          value={newRequest.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          placeholder="Phone number for emergencies"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="handoverNotes" className="text-sm font-medium">
                          Handover Notes
                        </Label>
                        <Input
                          id="handoverNotes"
                          value={newRequest.handoverNotes}
                          onChange={(e) => handleInputChange('handoverNotes', e.target.value)}
                          placeholder="Work to be covered during leave"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={submitLeaveRequest}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white px-8 py-2.5"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Leave Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* All Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    All Leave Requests
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-48 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 w-8 p-0"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="h-8 w-8 p-0"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Filters */}
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
                      <SelectTrigger className="w-32 focus:ring-2 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({...prev, type: value}))}>
                      <SelectTrigger className="w-40 focus:ring-2 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {LEAVE_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'list' ? (
                  // List View
                  <div className="space-y-4">
                    {filteredRequests.map(request => (
                      <Card key={request.id} className="border-slate-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {request.employeeName.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900">{request.employeeName}</div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                      <Badge variant="outline" className="text-xs">{request.department}</Badge>
                                      <span>•</span>
                                      <span>{request.employeeId}</span>
                                    </div>
                                  </div>
                                </div>
                                {getStatusBadge(request.status)}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                                <div>
                                  <div className="text-slate-500">Leave Type</div>
                                  <div className="font-medium flex items-center gap-2">
                                    <span className="text-lg">{getLeaveTypeInfo(request.leaveType).icon}</span>
                                    {getLeaveTypeInfo(request.leaveType).name}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-500">Dates</div>
                                  <div className="font-medium">
                                    {request.startDate} to {request.endDate}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-500">Total Days</div>
                                  <div className="font-medium">{request.totalDays} days</div>
                                </div>
                                <div>
                                  <div className="text-slate-500">Submitted</div>
                                  <div className="font-medium">{request.submittedDate}</div>
                                </div>
                              </div>

                              {request.reason && (
                                <div className="mt-3">
                                  <div className="text-slate-500 text-sm">Reason</div>
                                  <div className="text-slate-700">{request.reason}</div>
                                </div>
                              )}

                              {request.rejectionReason && (
                                <div className="mt-2">
                                  <div className="text-red-500 text-sm">Rejection Reason</div>
                                  <div className="text-red-700">{request.rejectionReason}</div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateLeavePDF(request)}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download PDF</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {request.status === 'pending' && (
                                <>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          onClick={() => approveLeaveRequest(request.id)}
                                          className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Approve Request</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          onClick={() => rejectLeaveRequest(request.id)}
                                          className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                          <XCircle className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Reject Request</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </>
                              )}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteLeaveRequest(request.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete Request</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredRequests.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No leave requests found matching your filters.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Grid View
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map(request => (
                      <Card key={request.id} className="border-slate-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-lg overflow-hidden group">
                        <CardContent className="p-0">
                          {/* Header */}
                          <div className={`p-4 ${
                            request.status === 'approved' ? 'bg-green-50 border-b border-green-100' :
                            request.status === 'rejected' ? 'bg-red-50 border-b border-red-100' :
                            'bg-yellow-50 border-b border-yellow-100'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {request.employeeName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">{request.employeeName}</div>
                                  <div className="text-xs text-slate-600">{request.department}</div>
                                </div>
                              </div>
                              {getStatusBadge(request.status)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{getLeaveTypeInfo(request.leaveType).icon}</span>
                                <span className="font-medium text-slate-900">
                                  {getLeaveTypeInfo(request.leaveType).name}
                                </span>
                              </div>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {request.totalDays} days
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <div className="text-slate-500">From</div>
                                <div className="font-medium">{request.startDate}</div>
                              </div>
                              <div>
                                <div className="text-slate-500">To</div>
                                <div className="font-medium">{request.endDate}</div>
                              </div>
                            </div>

                            <div className="text-sm">
                              <div className="text-slate-500">Reason</div>
                              <div className="text-slate-700 line-clamp-2">{request.reason}</div>
                            </div>

                            {request.rejectionReason && (
                              <div className="text-sm">
                                <div className="text-red-500">Rejection Reason</div>
                                <div className="text-red-700 line-clamp-2">{request.rejectionReason}</div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-slate-500">
                                Submitted {request.submittedDate}
                              </div>
                              <div className="flex items-center gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => generateLeavePDF(request)}
                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Download PDF</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {request.status === 'pending' && (
                                  <>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => approveLeaveRequest(request.id)}
                                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Approve</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => rejectLeaveRequest(request.id)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <XCircle className="w-4 h-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Reject</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredRequests.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No leave requests found matching your filters.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Overview Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-600" />
                  Team Leave Overview
                </CardTitle>
                <CardDescription>
                  Track leave balances and usage across your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {TEAM_MEMBERS.map(employee => {
                    const stats = teamLeaveStats.find(s => s.employeeId === `EMP00${employee.id}`) || {};
                    return (
                      <Card key={employee.id} className="border-slate-200/60 hover:border-blue-300 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {employee.avatar}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{employee.name}</div>
                                <div className="text-sm text-slate-600">{employee.role} • {employee.department}</div>
                                <div className="text-xs text-slate-500">{employee.email}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-6 text-center">
                              <div>
                                <div className="text-2xl font-bold text-green-600">{stats.annualRemaining || 0}</div>
                                <div className="text-xs text-slate-600">Annual Left</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{stats.sickUsed || 0}</div>
                                <div className="text-xs text-slate-600">Sick Used</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">{stats.personalUsed || 0}</div>
                                <div className="text-xs text-slate-600">Personal Used</div>
                              </div>
                            </div>
                          </div>

                          {/* Leave Progress Bars */}
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Annual Leave</span>
                              <span className="font-medium">{stats.annualUsed || 0}/25 days</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${((stats.annualUsed || 0) / 25) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-6 h-6 text-orange-600" />
                  Leave History & Analytics
                </CardTitle>
                <CardDescription>
                  Historical data and analytics for leave management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <Card className="border-slate-200/60 hover:border-blue-300 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-slate-900">78%</div>
                          <div className="text-sm text-slate-600">Approval Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200/60 hover:border-green-300 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CalendarDays className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-slate-900">42</div>
                          <div className="text-sm text-slate-600">Avg. Days/Employee</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200/60 hover:border-purple-300 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-slate-900">15%</div>
                          <div className="text-sm text-slate-600">Sick Leave Usage</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-slate-900">Recent Activity</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateTeamReportPDF}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Report
                    </Button>
                  </div>
                  {leaveRequests
                    .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
                    .slice(0, 5)
                    .map(request => (
                      <div key={request.id} className="flex items-center justify-between p-4 border border-slate-200/60 rounded-lg hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                            request.status === 'approved' ? 'bg-green-500' :
                            request.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <div>
                            <div className="font-medium text-slate-900">{request.employeeName}</div>
                            <div className="text-sm text-slate-600">
                              {getLeaveTypeInfo(request.leaveType).name} • {request.startDate} to {request.endDate}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-slate-900 capitalize">{request.status}</div>
                          <div className="text-sm text-slate-600">{request.submittedDate}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeaveManagementSystem;