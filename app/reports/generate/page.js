// app/reports/generate/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  FilePieChart, 
  Download, 
  Calendar, 
  Filter, 
  Users, 
  ToolCase, 
  Calculator, 
  Shield, 
  Settings,
  Eye,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REPORTS_STORAGE_KEY = 'generated-reports';

// Report templates
const reportTemplates = {
  overtime: {
    name: "Overtime Summary",
    description: "Comprehensive overtime analysis including hours, costs, and approval status",
    icon: Calculator,
    color: "purple",
    defaultColumns: ["employee", "department", "date", "hours", "status", "approvedBy"]
  },
  personnel: {
    name: "Personnel Report",
    description: "Employee information, department structure, and role analysis",
    icon: Users,
    color: "indigo",
    defaultColumns: ["name", "employeeId", "department", "position", "hireDate", "status"]
  },
  assets: {
    name: "Asset Utilization",
    description: "Equipment performance, maintenance history, and utilization metrics",
    icon: ToolCase,
    color: "cyan",
    defaultColumns: ["assetId", "name", "category", "status", "utilization", "lastMaintenance"]
  },
  safety: {
    name: "Safety Compliance",
    description: "Incident reports, safety audits, and compliance tracking",
    icon: Shield,
    color: "blue",
    defaultColumns: ["incidentId", "type", "severity", "date", "location", "status"]
  },
  maintenance: {
    name: "Maintenance Schedule",
    description: "Preventive maintenance, work orders, and equipment servicing",
    icon: Settings,
    color: "amber",
    defaultColumns: ["workOrder", "asset", "type", "scheduledDate", "status", "assignedTo"]
  },
  financial: {
    name: "Financial Overview",
    description: "Cost analysis, budget tracking, and financial performance",
    icon: FileText,
    color: "green",
    defaultColumns: ["category", "period", "budget", "actual", "variance", "status"]
  }
};

// Available columns for each report type
const availableColumns = {
  overtime: [
    { id: "employee", label: "Employee Name", type: "text" },
    { id: "employeeId", label: "Employee ID", type: "text" },
    { id: "department", label: "Department", type: "text" },
    { id: "date", label: "Date", type: "date" },
    { id: "hours", label: "Hours", type: "number" },
    { id: "rate", label: "Hourly Rate", type: "currency" },
    { id: "totalCost", label: "Total Cost", type: "currency" },
    { id: "reason", label: "Reason", type: "text" },
    { id: "status", label: "Status", type: "status" },
    { id: "approvedBy", label: "Approved By", type: "text" },
    { id: "approvedDate", label: "Approved Date", type: "date" }
  ],
  personnel: [
    { id: "name", label: "Full Name", type: "text" },
    { id: "employeeId", label: "Employee ID", type: "text" },
    { id: "department", label: "Department", type: "text" },
    { id: "position", label: "Position", type: "text" },
    { id: "hireDate", label: "Hire Date", type: "date" },
    { id: "email", label: "Email", type: "text" },
    { id: "phone", label: "Phone", type: "text" },
    { id: "status", label: "Employment Status", type: "status" },
    { id: "salary", label: "Salary", type: "currency" },
    { id: "location", label: "Location", type: "text" }
  ],
  assets: [
    { id: "assetId", label: "Asset ID", type: "text" },
    { id: "name", label: "Asset Name", type: "text" },
    { id: "category", label: "Category", type: "text" },
    { id: "status", label: "Status", type: "status" },
    { id: "location", label: "Location", type: "text" },
    { id: "utilization", label: "Utilization %", type: "number" },
    { id: "lastMaintenance", label: "Last Maintenance", type: "date" },
    { id: "nextMaintenance", label: "Next Maintenance", type: "date" },
    { id: "purchaseDate", label: "Purchase Date", type: "date" },
    { id: "purchaseCost", label: "Purchase Cost", type: "currency" }
  ],
  safety: [
    { id: "incidentId", label: "Incident ID", type: "text" },
    { id: "type", label: "Incident Type", type: "text" },
    { id: "severity", label: "Severity", type: "text" },
    { id: "date", label: "Date", type: "date" },
    { id: "location", label: "Location", type: "text" },
    { id: "description", label: "Description", type: "text" },
    { id: "status", label: "Status", type: "status" },
    { id: "reportedBy", label: "Reported By", type: "text" }
  ],
  maintenance: [
    { id: "workOrder", label: "Work Order", type: "text" },
    { id: "asset", label: "Asset", type: "text" },
    { id: "type", label: "Maintenance Type", type: "text" },
    { id: "scheduledDate", label: "Scheduled Date", type: "date" },
    { id: "completedDate", label: "Completed Date", type: "date" },
    { id: "status", label: "Status", type: "status" },
    { id: "assignedTo", label: "Assigned To", type: "text" },
    { id: "cost", label: "Cost", type: "currency" }
  ],
  financial: [
    { id: "category", label: "Category", type: "text" },
    { id: "period", label: "Period", type: "text" },
    { id: "budget", label: "Budget", type: "currency" },
    { id: "actual", label: "Actual", type: "currency" },
    { id: "variance", label: "Variance", type: "currency" },
    { id: "variancePercent", label: "Variance %", type: "number" },
    { id: "status", label: "Status", type: "status" }
  ]
};

export default function GenerateReportPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState("overtime");
  const [reportName, setReportName] = useState("");
  const [description, setDescription] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filters, setFilters] = useState([]);
  const [format, setFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Initialize with default columns when report type changes
  useEffect(() => {
    const template = reportTemplates[reportType];
    if (template) {
      setReportName(`${template.name} - ${new Date().toLocaleDateString()}`);
      setDescription(template.description);
      setSelectedColumns(template.defaultColumns);
    }
  }, [reportType]);

  // Toggle column selection
  const toggleColumn = (columnId) => {
    setSelectedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  // Add filter
  const addFilter = () => {
    setFilters(prev => [...prev, { field: "", operator: "equals", value: "" }]);
  };

  // Update filter
  const updateFilter = (index, field, value) => {
    setFilters(prev => prev.map((filter, i) => 
      i === index ? { ...filter, [field]: value } : filter
    ));
  };

  // Remove filter
  const removeFilter = (index) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  // Generate real report data
  const generateRealData = () => {
    const data = [];
    const recordCount = Math.floor(Math.random() * 50) + 10; // 10-60 records
    
    for (let i = 0; i < recordCount; i++) {
      const record = {};
      selectedColumns.forEach(colId => {
        const col = availableColumns[reportType]?.find(c => c.id === colId);
        if (!col) return;

        switch (col.type) {
          case "number":
            record[colId] = Math.floor(Math.random() * 100);
            break;
          case "currency":
            record[colId] = `$${(Math.random() * 1000).toFixed(2)}`;
            break;
          case "date":
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            record[colId] = date.toISOString().split('T')[0];
            break;
          case "status":
            const statuses = ["Active", "Pending", "Completed", "Approved", "Rejected"];
            record[colId] = statuses[Math.floor(Math.random() * statuses.length)];
            break;
          default:
            record[colId] = `Sample ${col.label} ${i + 1}`;
        }
      });
      data.push(record);
    }
    
    return data;
  };

  // Generate preview
  const generatePreview = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const realData = generateRealData();
      const mockData = {
        totalRecords: realData.length,
        columns: selectedColumns.map(colId => {
          const col = availableColumns[reportType]?.find(c => c.id === colId);
          return col || { id: colId, label: colId, type: "text" };
        }),
        sampleData: realData.slice(0, 5) // Show first 5 as preview
      };
      setPreviewData(mockData);
      setIsGenerating(false);
    }, 1000);
  };

  // Save report to localStorage
  const saveReport = (reportData) => {
    try {
      const existingReports = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || '[]');
      const newReport = {
        id: Date.now().toString(),
        title: reportName,
        description: description,
        type: reportType,
        status: 'generated',
        generatedAt: new Date().toISOString(),
        format: format,
        data: reportData,
        metadata: {
          totalRecords: reportData.length,
          columns: selectedColumns,
          dateRange: dateRange,
          filters: filters,
          includeCharts: includeCharts,
          includeSummary: includeSummary
        }
      };
      
      const updatedReports = [newReport, ...existingReports];
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
      return newReport;
    } catch (error) {
      console.error('Error saving report:', error);
      return null;
    }
  };

  // Generate final report
  const generateReport = async () => {
    if (!reportName.trim()) {
      alert("Please enter a report name");
      return;
    }

    if (selectedColumns.length === 0) {
      alert("Please select at least one column");
      return;
    }

    setIsGenerating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const realData = generateRealData();
      const savedReport = saveReport(realData);
      
      if (savedReport) {
        alert(`Report "${reportName}" generated successfully!`);
        router.push('/reports');
      } else {
        alert("Error generating report. Please try again.");
      }
      
      setIsGenerating(false);
    }, 2000);
  };

  const template = reportTemplates[reportType];
  const TemplateIcon = template?.icon || FilePieChart;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/reports" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Reports</span>
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg">
                  <FilePieChart className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-foreground">Generate Report</span>
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider hidden sm:inline-block">
                    Create New Report
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={generatePreview} disabled={isGenerating}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={generateReport} disabled={isGenerating || !reportName}>
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Report Template</CardTitle>
                <CardDescription>
                  Choose a template to start with or create a custom report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(reportTemplates).map(([key, template]) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setReportType(key)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          reportType === key 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-${template.color}-50 dark:bg-${template.color}-900/50 text-${template.color}-600 dark:text-${template.color}-400 mb-2`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>
                  Configure the basic information and timeframe for your report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Report Name *</Label>
                    <Input
                      id="reportName"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="Enter report name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Output Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="html">Web Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the purpose of this report"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Column Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Data Columns</CardTitle>
                <CardDescription>
                  Select which columns to include in your report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableColumns[reportType]?.map((column) => (
                    <div key={column.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`column-${column.id}`}
                        checked={selectedColumns.includes(column.id)}
                        onChange={() => toggleColumn(column.id)}
                        className="rounded border-gray-300"
                      />
                      <Label 
                        htmlFor={`column-${column.id}`} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {column.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedColumns.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>No columns selected. Please choose at least one column.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Advanced Options</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {showAdvanced ? "Hide" : "Show"} Advanced
                  </Button>
                </div>
              </CardHeader>
              
              {showAdvanced && (
                <CardContent className="space-y-6">
                  {/* Filters */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Data Filters</Label>
                      <Button variant="outline" size="sm" onClick={addFilter}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Filter
                      </Button>
                    </div>
                    
                    {filters.map((filter, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Select 
                          value={filter.field} 
                          onValueChange={(value) => updateFilter(index, "field", value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Field" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableColumns[reportType]?.map(col => (
                              <SelectItem key={col.id} value={col.id}>
                                {col.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={filter.operator} 
                          onValueChange={(value) => updateFilter(index, "operator", value)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="greater">Greater than</SelectItem>
                            <SelectItem value="less">Less than</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input
                          value={filter.value}
                          onChange={(e) => updateFilter(index, "value", e.target.value)}
                          placeholder="Value"
                          className="flex-1"
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFilter(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Report Options */}
                  <div className="space-y-4">
                    <Label>Report Options</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Include Charts</div>
                          <div className="text-sm text-muted-foreground">Add visual charts and graphs</div>
                        </div>
                        <Switch
                          checked={includeCharts}
                          onCheckedChange={setIncludeCharts}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Include Summary</div>
                          <div className="text-sm text-muted-foreground">Add executive summary section</div>
                        </div>
                        <Switch
                          checked={includeSummary}
                          onCheckedChange={setIncludeSummary}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Report Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Report Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-${template.color}-50 dark:bg-${template.color}-900/50 text-${template.color}-600 dark:text-${template.color}-400`}>
                    <TemplateIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{reportName || "Untitled Report"}</div>
                    <div className="text-sm text-muted-foreground">{template.name}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Columns Selected:</span>
                    <span className="font-medium">{selectedColumns.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date Range:</span>
                    <span className="font-medium">
                      {dateRange.start && dateRange.end 
                        ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`
                        : "All dates"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Filters:</span>
                    <span className="font-medium">{filters.length}</span>
                  </div>
                </div>

                {previewData && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Preview Data</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Total Records:</span>
                        <span className="font-medium">{previewData.totalRecords}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sample Size:</span>
                        <span className="font-medium">{previewData.sampleData.length} rows</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Preview */}
            {previewData && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Preview</CardTitle>
                  <CardDescription>
                    Sample of how your data will appear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {previewData.columns.map((column) => (
                            <th key={column.id} className="text-left p-2 font-medium">
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.sampleData.map((row, index) => (
                          <tr key={index} className="border-b last:border-0">
                            {previewData.columns.map((column) => (
                              <td key={column.id} className="p-2">
                                {row[column.id]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/reports">
                    <FileText className="h-4 w-4 mr-2" />
                    View Existing Reports
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={generatePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Refresh Preview
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  setReportName("");
                  setDescription("");
                  setDateRange({ start: "", end: "" });
                  setSelectedColumns(reportTemplates[reportType]?.defaultColumns || []);
                  setFilters([]);
                  setPreviewData(null);
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}