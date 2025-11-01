// app/reports/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FilePieChart, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  Users,
  Wrench,
  Calculator,
  Shield,
  Building,
  Eye,
  MoreHorizontal,
  Search,
  Plus,
  FileText,
  Home,
  ArrowLeft,
  Trash2,
  RefreshCw,
  File,
  Table,
  FileText as FileWord,
  ChevronRight,
  Sparkles,
  DownloadCloud,
  BarChart,
  Grid,
  List,
  X,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REPORTS_STORAGE_KEY = 'generated-reports';

// Simple export functions with error handling
const exportToPDF = async (reportData, reportName) => {
  try {
    // Simple text-based PDF export as fallback
    const content = [
      `Report: ${reportName}`,
      `Generated on: ${new Date().toLocaleDateString()}`,
      '',
      'Summary:',
      `Total Records: ${reportData.totalRecords}`,
      `Columns: ${reportData.columns?.join(', ') || 'N/A'}`,
      '',
      'Data:',
      ...reportData.data.slice(0, 10).map((row, index) => 
        `${index + 1}. ${JSON.stringify(row)}`
      )
    ].join('\n');

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF export error:', error);
    alert('Error exporting to PDF. Please try again.');
  }
};

const exportToExcel = async (reportData, reportName) => {
  try {
    // Simple CSV export as fallback
    const headers = reportData.columns || [];
    const csvContent = [
      headers.join(','),
      ...reportData.data.map(row => 
        headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName.replace(/[^a-z0-9]/gi, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Excel export error:', error);
    alert('Error exporting to Excel. Please try again.');
  }
};

const exportToWord = async (reportData, reportName) => {
  try {
    // Simple text export as fallback
    const content = [
      reportName,
      `Generated on: ${new Date().toLocaleDateString()}`,
      '',
      'Report Summary',
      `Total Records: ${reportData.totalRecords}`,
      `Columns: ${reportData.columns?.join(', ') || 'N/A'}`,
      '',
      'Data:',
      JSON.stringify(reportData.data, null, 2)
    ].join('\n');

    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName.replace(/[^a-z0-9]/gi, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Word export error:', error);
    alert('Error exporting to Word. Please try again.');
  }
};

// Generate sample data for demonstration
const generateSampleReports = () => {
  const sampleReports = [
    {
      id: '1',
      title: 'Monthly Overtime Report',
      type: 'overtime',
      format: 'pdf',
      description: 'Comprehensive overtime analysis for current month',
      generatedAt: new Date().toISOString(),
      data: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        employee: `Employee ${i + 1}`,
        department: ['Engineering', 'Operations', 'Maintenance'][i % 3],
        hours: Math.floor(Math.random() * 20) + 5,
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      })),
      metadata: {
        totalRecords: 15,
        columns: ['id', 'employee', 'department', 'hours', 'date']
      }
    },
    {
      id: '2',
      title: 'Equipment Maintenance Schedule',
      type: 'maintenance',
      format: 'excel',
      description: 'Upcoming maintenance tasks and schedules',
      generatedAt: new Date(Date.now() - 86400000).toISOString(),
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        equipment: `Equipment ${i + 1}`,
        type: ['Vehicle', 'Tool', 'Machine'][i % 3],
        lastMaintenance: new Date(Date.now() - (i + 10) * 86400000).toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + (i + 5) * 86400000).toISOString().split('T')[0],
        status: ['Pending', 'Completed', 'Overdue'][i % 3]
      })),
      metadata: {
        totalRecords: 10,
        columns: ['id', 'equipment', 'type', 'lastMaintenance', 'nextMaintenance', 'status']
      }
    }
  ];
  
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(sampleReports));
  return sampleReports;
};

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [dateRange, setDateRange] = useState("all");

  // Load reports from localStorage on component mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    try {
      const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
      let reportsData = [];
      
      if (storedReports) {
        reportsData = JSON.parse(storedReports);
      } else {
        // Generate sample data if no reports exist
        reportsData = generateSampleReports();
      }
      
      setReports(sortReports(reportsData, sortBy));
    } catch (error) {
      console.error('Error loading reports:', error);
      // Generate sample data on error
      const sampleData = generateSampleReports();
      setReports(sortReports(sampleData, sortBy));
    }
  };

  const sortReports = (reportsList, sortType) => {
    const sorted = [...reportsList];
    switch (sortType) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.generatedAt) - new Date(b.generatedAt));
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const saveReports = (newReports) => {
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(newReports));
      setReports(sortReports(newReports, sortBy));
    } catch (error) {
      console.error('Error saving reports:', error);
    }
  };

  const deleteReport = (reportId) => {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      const updatedReports = reports.filter(report => report.id !== reportId);
      saveReports(updatedReports);
    }
  };

  const downloadReport = async (report) => {
    setIsLoading(true);
    try {
      const reportData = {
        data: report.data || [],
        columns: report.columns || report.metadata?.columns || [],
        totalRecords: report.data?.length || report.metadata?.totalRecords || 0
      };

      switch (report.format) {
        case 'pdf':
          await exportToPDF(reportData, report.title);
          break;
        case 'excel':
          await exportToExcel(reportData, report.title);
          break;
        case 'word':
          await exportToWord(reportData, report.title);
          break;
        default:
          // Fallback to JSON
          const dataStr = JSON.stringify(report.data || [], null, 2);
          const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
          
          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', `${report.title.replace(/\s+/g, '_')}.json`);
          document.body.appendChild(linkElement);
          linkElement.click();
          document.body.removeChild(linkElement);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      overtime: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200',
      personnel: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200',
      assets: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200',
      safety: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200',
      maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200',
      financial: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200'
    };
    return colors[type] || colors.overtime;
  };

  const getTypeIcon = (type) => {
    const icons = {
      overtime: Calculator,
      personnel: Users,
      assets: Wrench,
      safety: Shield,
      maintenance: Building,
      financial: BarChart
    };
    return icons[type] || FileText;
  };

  const getFormatIcon = (format) => {
    const icons = {
      pdf: File,
      excel: Table,
      word: FileWord,
      csv: FileText
    };
    return icons[format] || FileText;
  };

  // Filter reports based on search, selected types, formats, and date range
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(report.type);
    
    const matchesFormat = selectedFormats.length === 0 || selectedFormats.includes(report.format || 'json');
    
    const matchesDateRange = dateRange === "all" || isInDateRange(report.generatedAt, dateRange);
    
    return matchesSearch && matchesType && matchesFormat && matchesDateRange;
  });

  const isInDateRange = (dateString, range) => {
    const date = new Date(dateString);
    const now = new Date();
    
    switch (range) {
      case "today":
        return date.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      case "month":
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return date >= monthAgo;
      default:
        return true;
    }
  };

  const reportTypes = [
    { value: "all", label: "All Reports", count: filteredReports.length },
    { value: "overtime", label: "Overtime", count: filteredReports.filter(r => r.type === 'overtime').length },
    { value: "personnel", label: "Personnel", count: filteredReports.filter(r => r.type === 'personnel').length },
    { value: "assets", label: "Assets", count: filteredReports.filter(r => r.type === 'assets').length },
    { value: "safety", label: "Safety", count: filteredReports.filter(r => r.type === 'safety').length },
    { value: "maintenance", label: "Maintenance", count: filteredReports.filter(r => r.type === 'maintenance').length },
    { value: "financial", label: "Financial", count: filteredReports.filter(r => r.type === 'financial').length }
  ];

  const stats = {
    total: reports.length,
    thisWeek: reports.filter(r => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(r.generatedAt) > weekAgo;
    }).length,
    mostRecent: reports[0] ? new Date(reports[0].generatedAt).toLocaleDateString() : 'No reports'
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedFormats([]);
    setDateRange("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg">
                  <FilePieChart className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-foreground">Reports Center</span>
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider hidden sm:inline-block">
                    Analytics & Insights
                  </span>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
              </Link>
              <Link href="/employees" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Personnel
              </Link>
              <Link href="/equipment" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Assets
              </Link>
              <Link href="/overtime" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Overtime
              </Link>
              <Link href="/reports" className="text-sm font-semibold text-primary transition-colors">
                Reports
              </Link>
            </nav>

            <Button 
              size="sm" 
              asChild 
              className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800"
              disabled={isLoading}
            >
              <Link href="/reports/generate">
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? "Loading..." : "New Report"}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Manage, analyze, and export your operational reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-none border-0"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-none border-0"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                setReports(sortReports(reports, value));
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadReports} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          {reports.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-indigo-500 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                      <div className="text-sm text-muted-foreground">Total Reports</div>
                    </div>
                    <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-green-500 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.thisWeek}</div>
                      <div className="text-sm text-muted-foreground">This Week</div>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-blue-500 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Last Generated</div>
                      <div className="text-lg font-bold text-foreground">{stats.mostRecent}</div>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports by name, type, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border-slate-300 dark:border-slate-600"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant={showFilters ? "default" : "outline"} 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {(selectedTypes.length > 0 || selectedFormats.length > 0 || dateRange !== "all") && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {selectedTypes.length + selectedFormats.length + (dateRange !== "all" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Filter Reports</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Report Type Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Report Type</label>
                      <div className="space-y-2">
                        {['overtime', 'personnel', 'assets', 'safety', 'maintenance', 'financial'].map(type => (
                          <div key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`type-${type}`}
                              checked={selectedTypes.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTypes([...selectedTypes, type]);
                                } else {
                                  setSelectedTypes(selectedTypes.filter(t => t !== type));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`type-${type}`} className="ml-2 text-sm text-foreground capitalize">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Format Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Format</label>
                      <div className="space-y-2">
                        {['pdf', 'excel', 'word', 'csv', 'json'].map(format => (
                          <div key={format} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`format-${format}`}
                              checked={selectedFormats.includes(format)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFormats([...selectedFormats, format]);
                                } else {
                                  setSelectedFormats(selectedFormats.filter(f => f !== format));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`format-${format}`} className="ml-2 text-sm text-foreground capitalize">
                              {format}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Date Range</label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">Past Week</SelectItem>
                          <SelectItem value="month">Past Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reports Display */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                {reportTypes.map((type) => (
                  <TabsTrigger key={type.value} value={type.value} className="relative">
                    {type.label}
                    {type.count > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {type.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {filteredReports.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredReports.length} of {reports.length} reports
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
              <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 flex items-center justify-center mb-6">
                      <FilePieChart className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                      {reports.length === 0 ? 'No Reports Yet' : 'No Reports Found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {reports.length === 0 
                        ? 'Get started by creating your first operational report to track and analyze your data.'
                        : 'No reports match your search criteria. Try adjusting your filters.'
                      }
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-md">
                      <Link href="/reports/generate">
                        <Sparkles className="h-5 w-5 mr-2" />
                        Create Your First Report
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports Grid/List View */}
            {filteredReports.length > 0 && (
              <TabsContent value="all" className="space-y-4">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredReports.map((report) => (
                      <ReportCard 
                        key={report.id} 
                        report={report} 
                        onDownload={downloadReport}
                        onDelete={deleteReport}
                        getTypeColor={getTypeColor}
                        getTypeIcon={getTypeIcon}
                        getFormatIcon={getFormatIcon}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <ReportListItem 
                        key={report.id} 
                        report={report} 
                        onDownload={downloadReport}
                        onDelete={deleteReport}
                        getTypeColor={getTypeColor}
                        getTypeIcon={getTypeIcon}
                        getFormatIcon={getFormatIcon}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Filtered Tabs */}
            {reportTypes.slice(1).map((type) => (
              <TabsContent key={type.value} value={type.value} className="space-y-4">
                {filteredReports.filter(report => report.type === type.value).length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredReports
                        .filter(report => report.type === type.value)
                        .map((report) => (
                          <ReportCard 
                            key={report.id} 
                            report={report} 
                            onDownload={downloadReport}
                            onDelete={deleteReport}
                            getTypeColor={getTypeColor}
                            getTypeIcon={getTypeIcon}
                            getFormatIcon={getFormatIcon}
                            isLoading={isLoading}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReports
                        .filter(report => report.type === type.value)
                        .map((report) => (
                          <ReportListItem 
                            key={report.id} 
                            report={report} 
                            onDownload={downloadReport}
                            onDelete={deleteReport}
                            getTypeColor={getTypeColor}
                            getTypeIcon={getTypeIcon}
                            getFormatIcon={getFormatIcon}
                            isLoading={isLoading}
                          />
                        ))}
                    </div>
                  )
                ) : (
                  <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-12 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          {(() => {
                            const IconComponent = getTypeIcon(type.value);
                            return <IconComponent className="h-8 w-8 text-muted-foreground" />;
                          })()}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No {type.label} Reports</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't generated any {type.label.toLowerCase()} reports yet.
                        </p>
                        <Button asChild>
                          <Link href="/reports/generate">
                            Create {type.label} Report
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// Report Card Component (Grid View)
function ReportCard({ report, onDownload, onDelete, getTypeColor, getTypeIcon, getFormatIcon, isLoading }) {
  const [showActions, setShowActions] = useState(false);

  const formattedDate = new Date(report.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = new Date(report.generatedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const TypeIcon = getTypeIcon(report.type);
  const FormatIcon = getFormatIcon(report.format);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-indigo-500 shadow-sm border border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor(report.type)}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-indigo-600 transition-colors">
                {report.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {report.description || "No description provided"}
              </p>
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {showActions && (
              <div className="absolute right-0 top-10 bg-background border border-border rounded-lg shadow-xl z-10 w-40 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3"
                  onClick={() => onDownload(report)}
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isLoading ? 'Downloading...' : 'Download'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(report.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Metadata */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
              <span className="text-xs">at {formattedTime}</span>
            </div>
            <Badge variant="outline" className={`${getTypeColor(report.type)} border`}>
              {report.type}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FormatIcon className="h-4 w-4" />
              <span className="uppercase">{report.format || 'json'}</span>
            </div>
            <div className="text-sm font-medium">
              {report.metadata?.totalRecords || report.data?.length || 0} records
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-2" asChild>
            <Link href={`/reports/view/${report.id}`}>
              <Eye className="h-4 w-4" />
              View Details
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-md"
            onClick={() => onDownload(report)}
            disabled={isLoading}
          >
            <DownloadCloud className="h-4 w-4" />
            {isLoading ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Report List Item Component (List View)
function ReportListItem({ report, onDownload, onDelete, getTypeColor, getTypeIcon, getFormatIcon, isLoading }) {
  const [showActions, setShowActions] = useState(false);

  const formattedDate = new Date(report.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = new Date(report.generatedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const TypeIcon = getTypeIcon(report.type);
  const FormatIcon = getFormatIcon(report.format);

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-indigo-500 shadow-sm border border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className={`p-3 rounded-lg ${getTypeColor(report.type)}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {report.title}
                </h3>
                <Badge variant="outline" className={`${getTypeColor(report.type)} border`}>
                  {report.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {report.description || "No description provided"}
              </p>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate} at {formattedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FormatIcon className="h-4 w-4" />
                  <span className="uppercase">{report.format || 'json'}</span>
                </div>
                <div>
                  {report.metadata?.totalRecords || report.data?.length || 0} records
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-md"
              onClick={() => onDownload(report)}
              disabled={isLoading}
            >
              <DownloadCloud className="h-4 w-4" />
              {isLoading ? 'Exporting...' : 'Export'}
            </Button>
            
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href={`/reports/view/${report.id}`}>
                <Eye className="h-4 w-4" />
                View
              </Link>
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {showActions && (
                <div className="absolute right-0 top-10 bg-background border border-border rounded-lg shadow-xl z-10 w-40 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3"
                    onClick={() => onDownload(report)}
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Downloading...' : 'Download'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(report.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}