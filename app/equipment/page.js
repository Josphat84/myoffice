// app/equipment/page.js
'use client';

import { PageShell } from '@/components/PageShell';
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import EquipmentForm from "@/components/EquipmentForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Loader2, 
    Plus, 
    Search, 
    Trash2, 
    Edit, 
    Briefcase, 
    Calendar, 
    Wrench,
    Phone,
    MapPin,
    FileText,
    BarChart3,
    PieChart,
    Activity,
    Target,
    Building,
    Clock,
    Eye,
    Truck,
    ToolCase,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Cpu,
    LayoutGrid,
    List,
    ChevronUp,
    ChevronDown,
    Minimize2,
    Maximize2,
    Server,
    Package,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    FilterX,
    Info,
    HelpCircle,
    Download,
    RefreshCw,
    Grid3x3,
    Settings
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Animation styles defined in globals.css



// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://myofficebackend.onrender.com';
const API_BASE_URL = `${API_BASE}/api/equipment`;

// Pagination configuration
const ITEMS_PER_PAGE = 12;

// --- Utility Functions ---
const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
        case "operational": return "bg-green-100 text-green-800 border-green-300";
        case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-300";
        case "out_of_service": return "bg-red-100 text-red-800 border-red-300";
        case "retired": return "bg-gray-100 text-gray-800 border-gray-300";
        case "reserved": return "bg-blue-100 text-blue-800 border-blue-300";
        default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
};

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case "operational": return CheckCircle;
        case "maintenance": return Wrench;
        case "out_of_service": return XCircle;
        case "reserved": return Package;
        default: return Server;
    }
};

const getCategoryColor = (category, index) => {
    const colors = [
        "#ef4444", "#f97316", "#f59e0b", "#eab308", 
        "#84cc16", "#22c55e", "#10b981", "#14b8a6",
        "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
        "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"
    ];
    return colors[index % colors.length];
};

const calculateAge = (commissionDate) => {
    if (!commissionDate) return "N/A";
    const start = new Date(commissionDate);
    const now = new Date();
    
    if (isNaN(start)) return "Invalid Date";

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years === 0 && months === 0) return "Less than 1 month";
    
    const yearText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
    const monthText = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';

    return [yearText, monthText].filter(Boolean).join(' ');
};

const getMaintenanceStatus = (lastMaintenance, maintenanceInterval) => {
    if (!lastMaintenance || !maintenanceInterval) return "Unknown";
    
    const lastDate = new Date(lastMaintenance);
    const nextDue = new Date(lastDate);
    nextDue.setMonth(nextDue.getMonth() + maintenanceInterval);
    const now = new Date();
    
    const daysUntilDue = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return "Overdue";
    if (daysUntilDue <= 7) return "Due Soon";
    if (daysUntilDue <= 30) return "Upcoming";
    return "On Track";
};

const getMaintenanceStatusColor = (status) => {
    switch (status) {
        case "Overdue": return "bg-red-100 text-red-800";
        case "Due Soon": return "bg-orange-100 text-orange-800";
        case "Upcoming": return "bg-yellow-100 text-yellow-800";
        case "On Track": return "bg-green-100 text-green-800";
        default: return "bg-gray-100 text-gray-800";
    }
};

const handlePhoneClick = (phoneNumber) => {
    if (phoneNumber) {
        window.open(`tel:${phoneNumber}`, '_self');
    }
};

// --- Compact Metrics Card ---
const CompactMetricsCard = ({ title, value, icon: Icon, color, subtitle, onClick, tooltip }) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        yellow: "from-yellow-500 to-yellow-600",
        red: "from-red-500 to-red-600",
        purple: "from-purple-500 to-purple-600",
        indigo: "from-indigo-500 to-indigo-600",
        emerald: "from-emerald-500 to-emerald-600",
        amber: "from-amber-500 to-amber-600"
    };

    const gradient = colorClasses[color] || colorClasses.blue;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card 
                        className={`transition-all hover:shadow-lg hover:scale-105 bg-white ${onClick ? 'cursor-pointer' : ''}`}
                        onClick={onClick}
                    >
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{title}</p>
                                        <p className="text-lg font-bold">{value}</p>
                                        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip || `Click to filter by ${title.toLowerCase()}`}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

// --- Metrics Row ---
const MetricsRow = ({ equipment, onStatusClick }) => {
    const metrics = useMemo(() => {
        const operational = equipment.filter(item => item.status?.toLowerCase() === 'operational').length;
        const underMaintenance = equipment.filter(item => item.status?.toLowerCase() === 'maintenance').length;
        const outOfService = equipment.filter(item => item.status?.toLowerCase() === 'out_of_service').length;
        const reserved = equipment.filter(item => item.status?.toLowerCase() === 'reserved').length;
        const retired = equipment.filter(item => item.status?.toLowerCase() === 'retired').length;
        
        const avgAge = equipment.reduce((sum, item) => {
            if (!item.commission_date) return sum;
            const commissionDate = new Date(item.commission_date);
            const now = new Date();
            const age = (now - commissionDate) / (1000 * 60 * 60 * 24 * 365.25);
            return sum + age;
        }, 0) / equipment.length;

        const totalValue = equipment.reduce((sum, item) => sum + (item.current_value || 0), 0);
        const totalCost = equipment.reduce((sum, item) => sum + (item.purchase_cost || 0), 0);

        return {
            total: equipment.length,
            operational,
            underMaintenance,
            outOfService,
            reserved,
            retired,
            operationalRate: equipment.length ? ((operational / equipment.length) * 100).toFixed(0) : 0,
            avgAge: avgAge.toFixed(1),
            totalValue: totalValue.toLocaleString(),
            totalCost: totalCost.toLocaleString()
        };
    }, [equipment]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 animate-slide-up delay-100">
            <CompactMetricsCard 
                title="Total Assets" 
                value={metrics.total} 
                icon={Server} 
                color="blue"
                tooltip="Total number of equipment assets in the system"
            />
            <CompactMetricsCard 
                title="Operational" 
                value={metrics.operational} 
                icon={CheckCircle} 
                color="green"
                subtitle={`${metrics.operationalRate}%`}
                onClick={() => onStatusClick('operational')}
                tooltip="Click to filter operational equipment"
            />
            <CompactMetricsCard 
                title="Maintenance" 
                value={metrics.underMaintenance} 
                icon={Wrench} 
                color="yellow"
                onClick={() => onStatusClick('maintenance')}
                tooltip="Click to filter equipment under maintenance"
            />
            <CompactMetricsCard 
                title="Out of Service" 
                value={metrics.outOfService} 
                icon={XCircle} 
                color="red"
                onClick={() => onStatusClick('out_of_service')}
                tooltip="Click to filter out of service equipment"
            />
            <CompactMetricsCard 
                title="Reserved" 
                value={metrics.reserved} 
                icon={Package} 
                color="purple"
                onClick={() => onStatusClick('reserved')}
                tooltip="Click to filter reserved equipment"
            />
            <CompactMetricsCard 
                title="Retired" 
                value={metrics.retired} 
                icon={Target} 
                color="amber"
                onClick={() => onStatusClick('retired')}
                tooltip="Click to filter retired equipment"
            />
            <CompactMetricsCard 
                title="Avg Age" 
                value={`${metrics.avgAge}y`} 
                icon={Clock} 
                color="indigo"
                tooltip="Average age of all equipment"
            />
            <CompactMetricsCard 
                title="Total Value" 
                value={`$${metrics.totalValue}`} 
                icon={BarChart3} 
                color="emerald"
                tooltip="Total current value of all equipment"
            />
        </div>
    );
};

// --- Expanded Equipment Details ---
const ExpandedEquipmentDetails = ({ equipment }) => {
    const age = calculateAge(equipment.commission_date);
    const maintenanceStatus = getMaintenanceStatus(equipment.last_maintenance, equipment.maintenance_interval);

    return (
        <div className="animate-expand">
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-lg">
                {/* Basic Information */}
                <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-indigo-500" />
                        Basic Information
                    </h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Equipment ID:</span> {equipment.equipment_id}</p>
                        <p><span className="font-medium">Serial Number:</span> {equipment.serial_number || "N/A"}</p>
                        <p><span className="font-medium">Model:</span> {equipment.model || "N/A"}</p>
                        <p><span className="font-medium">Category:</span> {equipment.category || "N/A"}</p>
                    </div>
                </div>

                {/* Location & Department */}
                <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-green-500" />
                        Location & Department
                    </h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Location:</span> {equipment.location || "N/A"}</p>
                        <p><span className="font-medium">Department:</span> {equipment.department || "N/A"}</p>
                        <p><span className="font-medium">Commission Date:</span> {equipment.commission_date || "N/A"}</p>
                        <p><span className="font-medium">Age:</span> {age}</p>
                    </div>
                </div>

                {/* Supplier Information */}
                <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5 text-blue-500" />
                        Supplier Information
                    </h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Supplier:</span> {equipment.supplier || "N/A"}</p>
                        <p><span className="font-medium">Contact:</span> {equipment.supplier_contact || "N/A"}</p>
                        <p><span className="font-medium">Phone:</span> 
                            <span 
                                className={`ml-1 ${equipment.supplier_phone ? 'text-blue-600 cursor-pointer hover:underline' : ''}`}
                                onClick={() => equipment.supplier_phone && handlePhoneClick(equipment.supplier_phone)}
                            >
                                {equipment.supplier_phone || "N/A"}
                            </span>
                        </p>
                        <p><span className="font-medium">Warranty:</span> {equipment.warranty_info || "N/A"}</p>
                    </div>
                </div>

                {/* Maintenance Information */}
                <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                        <Wrench className="h-3.5 w-3.5 text-amber-500" />
                        Maintenance Information
                    </h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Interval:</span> {equipment.maintenance_interval ? `${equipment.maintenance_interval} months` : "N/A"}</p>
                        <p><span className="font-medium">Last Maintenance:</span> {equipment.last_maintenance || "N/A"}</p>
                        <p><span className="font-medium">Next Due:</span> {equipment.next_maintenance || "N/A"}</p>
                        <p><span className="font-medium">Status:</span> 
                            <Badge className={`ml-1 ${getMaintenanceStatusColor(maintenanceStatus)}`}>
                                {maintenanceStatus}
                            </Badge>
                        </p>
                    </div>
                </div>

                {/* Cost Information */}
                {(equipment.purchase_cost || equipment.current_value) && (
                    <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                            <Target className="h-3.5 w-3.5 text-red-500" />
                            Cost Information
                        </h4>
                        <div className="space-y-1 text-sm">
                            {equipment.purchase_cost && <p><span className="font-medium">Purchase Cost:</span> ${equipment.purchase_cost}</p>}
                            {equipment.current_value && <p><span className="font-medium">Current Value:</span> ${equipment.current_value}</p>}
                            {equipment.depreciation_rate && <p><span className="font-medium">Depreciation Rate:</span> {equipment.depreciation_rate}%</p>}
                        </div>
                    </div>
                )}

                {/* Description & Specifications */}
                {(equipment.description || equipment.specifications) && (
                    <div className="md:col-span-2">
                        {equipment.description && (
                            <div className="mb-2">
                                <h4 className="font-semibold text-sm text-gray-700 mb-1">Description</h4>
                                <p className="text-sm text-gray-600">{equipment.description}</p>
                            </div>
                        )}
                        {equipment.specifications && (
                            <div>
                                <h4 className="font-semibold text-sm text-gray-700 mb-1">Specifications</h4>
                                <p className="text-sm text-gray-600">{equipment.specifications}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Maintenance Notes */}
                {equipment.maintenance_notes && (
                    <div className="md:col-span-2">
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Maintenance Notes</h4>
                        <p className="text-sm text-gray-600">{equipment.maintenance_notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Equipment Card (Grid View with Expand) ---
const EquipmentCard = ({ equipment, onEdit, onDelete, isExpanded, onToggleExpand }) => {
    const age = calculateAge(equipment.commission_date);
    const maintenanceStatus = getMaintenanceStatus(equipment.last_maintenance, equipment.maintenance_interval);
    const StatusIcon = getStatusIcon(equipment.status);

    return (
        <Card className="bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`p-1.5 rounded-lg ${getStatusBadgeColor(equipment.status).split(' ')[0]} shrink-0`}>
                            <StatusIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{equipment.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{equipment.equipment_id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onToggleExpand}
                                        className="h-7 w-7 p-0"
                                    >
                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isExpanded ? "Collapse details" : "Expand to view full details"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate">{equipment.category || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{age}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate">{equipment.location || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusBadgeColor(equipment.status)}`}>
                            {equipment.status || "Unknown"}
                        </span>
                    </div>
                </div>

                {isExpanded && <ExpandedEquipmentDetails equipment={equipment} />}

                <div className="flex justify-end gap-2 mt-3 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(equipment)}
                                    className="h-7 text-xs"
                                >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit equipment details</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(equipment.id)}
                                    className="h-7 text-xs"
                                >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete this equipment</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Equipment List Row with Expand ---
const EquipmentListRow = ({ equipment, onEdit, onDelete, isExpanded, onToggleExpand }) => {
    const age = calculateAge(equipment.commission_date);
    const maintenanceStatus = getMaintenanceStatus(equipment.last_maintenance, equipment.maintenance_interval);
    const StatusIcon = getStatusIcon(equipment.status);

    return (
        <>
            <TableRow className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${getStatusBadgeColor(equipment.status).split(' ')[0]}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800">{equipment.name}</div>
                            <div className="text-xs text-gray-500">{equipment.equipment_id}</div>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="text-xs">
                        {equipment.category || "N/A"}
                    </Badge>
                </TableCell>
                <TableCell>{equipment.model || "N/A"}</TableCell>
                <TableCell>
                    <span className={`text-xs font-semibold py-0.5 px-2 rounded-full border ${getStatusBadgeColor(equipment.status)}`}>
                        {equipment.status || "Unknown"}
                    </span>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className={`text-xs ${getMaintenanceStatusColor(maintenanceStatus)}`}>
                        {maintenanceStatus}
                    </Badge>
                </TableCell>
                <TableCell className="text-sm">{age}</TableCell>
                <TableCell className="text-sm">{equipment.location || "N/A"}</TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onToggleExpand}
                                        className="h-7 w-7 p-0"
                                    >
                                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isExpanded ? "Collapse details" : "Expand details"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(equipment)}
                                        className="h-7 w-7 p-0"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit equipment</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(equipment.id)}
                                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete equipment</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow className="bg-gray-50/30">
                    <TableCell colSpan={8} className="p-0">
                        <ExpandedEquipmentDetails equipment={equipment} />
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

// --- Pagination Component ---
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} equipment
            </div>
            
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>First page</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Previous page</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {startPage > 1 && (
                    <>
                        <Button variant="outline" size="sm" onClick={() => onPageChange(1)} className="h-8 min-w-[2rem]">
                            1
                        </Button>
                        {startPage > 2 && <span className="text-gray-500">...</span>}
                    </>
                )}

                {pageNumbers.map(num => (
                    <Button
                        key={num}
                        variant={currentPage === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(num)}
                        className="h-8 min-w-[2rem]"
                    >
                        {num}
                    </Button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
                        <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} className="h-8 min-w-[2rem]">
                            {totalPages}
                        </Button>
                    </>
                )}

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Next page</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Last page</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Select value={itemsPerPage.toString()} onValueChange={(val) => onItemsPerPageChange(parseInt(val))}>
                    <SelectTrigger className="w-[100px] h-8 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="12">12 per page</SelectItem>
                        <SelectItem value="24">24 per page</SelectItem>
                        <SelectItem value="48">48 per page</SelectItem>
                        <SelectItem value="96">96 per page</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

// --- Main Equipment Management Component ---
const EquipmentManagement = () => {
    const [equipment, setEquipment] = useState([]);
    const [filteredEquipment, setFilteredEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [showMetrics, setShowMetrics] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [showFilters, setShowFilters] = useState(true);

    // Get unique values for filters
    const uniqueLocations = useMemo(() => {
        const locations = equipment.map(item => item.location).filter(Boolean);
        return [...new Set(locations)];
    }, [equipment]);

    const uniqueDepartments = useMemo(() => {
        const departments = equipment.map(item => item.department).filter(Boolean);
        return [...new Set(departments)];
    }, [equipment]);

    const uniqueCategories = useMemo(() => {
        const categories = equipment.map(item => item.category).filter(Boolean);
        return [...new Set(categories)];
    }, [equipment]);

    // Fetch equipment data
    const fetchEquipment = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error("Failed to fetch equipment");
            const data = await response.json();
            setEquipment(data);
            setFilteredEquipment(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEquipment();
    }, [fetchEquipment]);

    // Filter equipment
    useEffect(() => {
        let result = equipment;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.name?.toLowerCase().includes(term) ||
                item.equipment_id?.toLowerCase().includes(term) ||
                item.model?.toLowerCase().includes(term) ||
                item.category?.toLowerCase().includes(term) ||
                item.location?.toLowerCase().includes(term) ||
                item.department?.toLowerCase().includes(term) ||
                item.serial_number?.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(item => item.status === statusFilter);
        }

        if (categoryFilter !== "all") {
            result = result.filter(item => item.category === categoryFilter);
        }

        if (locationFilter !== "all") {
            result = result.filter(item => item.location === locationFilter);
        }

        if (departmentFilter !== "all") {
            result = result.filter(item => item.department === departmentFilter);
        }

        setFilteredEquipment(result);
        setCurrentPage(1);
    }, [equipment, searchTerm, statusFilter, categoryFilter, locationFilter, departmentFilter]);

    const handleCreate = () => {
        setEditingEquipment(null);
        setIsFormOpen(true);
    };

    const handleEdit = (equip) => {
        setEditingEquipment(equip);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete equipment");
            fetchEquipment();
            setDeleteConfirm(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatusClick = (status) => {
        setStatusFilter(status);
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setCategoryFilter("all");
        setLocationFilter("all");
        setDepartmentFilter("all");
    };

    const handleFormSubmit = async (formData) => {
        try {
            const isEditing = !!editingEquipment;
            const url = isEditing ? `${API_BASE_URL}/${editingEquipment.id}` : API_BASE_URL;
            const method = isEditing ? "PUT" : "POST";

            const requestBody = isEditing 
                ? { id: editingEquipment.id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                let errorMessage = "Failed to save equipment";
                
                try {
                    const errorData = await response.json();
                    
                    if (Array.isArray(errorData)) {
                        const errorMessages = errorData.map(error => 
                            `${error.loc?.join('.')}: ${error.msg}`
                        );
                        errorMessage = errorMessages.join(', ');
                    } else if (typeof errorData === 'string') {
                        errorMessage = errorData;
                    } else if (errorData.detail) {
                        errorMessage = typeof errorData.detail === 'string' 
                            ? errorData.detail 
                            : JSON.stringify(errorData.detail);
                    } else if (errorData.message) {
                        errorMessage = typeof errorData.message === 'string'
                            ? errorData.message
                            : JSON.stringify(errorData.message);
                    } else {
                        errorMessage = JSON.stringify(errorData);
                    }
                } catch (parseError) {
                    errorMessage = response.statusText || `HTTP ${response.status}`;
                }
                
                throw new Error(errorMessage);
            }

            setIsFormOpen(false);
            setEditingEquipment(null);
            fetchEquipment();
        } catch (err) {
            const errorMessage = typeof err.message === 'string' 
                ? err.message 
                : 'An unexpected error occurred while saving equipment';
            setError(errorMessage);
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
    const paginatedEquipment = filteredEquipment.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const hasActiveFilters = statusFilter !== "all" || categoryFilter !== "all" || locationFilter !== "all" || departmentFilter !== "all" || searchTerm !== "";

    if (loading) {
        return (
            <PageShell>
                <main className="container mx-auto px-4 py-6 space-y-6">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="h-10 w-10 animate-spin text-[#2A4D69] mx-auto mb-4" />
                            <p className="text-[#6B7B8E]">Loading equipment data…</p>
                        </div>
                    </div>
                </main>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Ozech Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <nav className="flex items-center gap-1.5 text-xs text-[#6B7B8E] mb-2">
                            <span>Home</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-[#2A4D69] font-medium">Assets</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-[#2A4D69] font-heading tracking-tight">Equipment Management</h1>
                        <p className="text-[#6B7B8E] mt-1">
                            Track all equipment assets — status, location, maintenance history, and performance metrics.
                        </p>
                    </div>
                    <Button onClick={handleCreate} className="gap-2 bg-[#2A4D69] hover:bg-[#1e3a52] text-white shadow-md self-start">
                        <Plus className="h-5 w-5" /> Add Equipment
                    </Button>
                </div>

                        {error && (
                            <Alert variant="destructive" className="bg-white">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Metrics Row with Toggle */}
                        <div className="space-y-2">
                            <div className="flex justify-end">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowMetrics(!showMetrics)}
                                                className="text-white hover:text-white hover:bg-white/20"
                                            >
                                                {showMetrics ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                                                {showMetrics ? "Hide Metrics" : "Show Metrics"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{showMetrics ? "Collapse metrics panel" : "Expand metrics panel"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            {showMetrics && (
                                <MetricsRow equipment={equipment} onStatusClick={handleStatusClick} />
                            )}
                        </div>

                        {/* Controls Bar */}
                        <div className="flex flex-col gap-4 animate-slide-up delay-150">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                                    <div className="relative flex-1 sm:w-64">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search by name, ID, model..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-white"
                                        />
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowFilters(!showFilters)}
                                                    className="bg-white"
                                                >
                                                    <Filter className="h-4 w-4 mr-1" />
                                                    Filters
                                                    {hasActiveFilters && <Badge className="ml-1 bg-blue-500 text-white">!</Badge>}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Toggle advanced filters</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {hasActiveFilters && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={clearAllFilters}
                                                        className="bg-white"
                                                    >
                                                        <FilterX className="h-4 w-4 mr-1" />
                                                        Clear
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Clear all filters</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                                
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <div className="flex rounded-md border bg-white">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                                        size="sm"
                                                        className="rounded-r-none"
                                                        onClick={() => setViewMode('grid')}
                                                    >
                                                        <LayoutGrid className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Grid view - Compact cards with expandable details</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                                        size="sm"
                                                        className="rounded-l-none"
                                                        onClick={() => setViewMode('list')}
                                                    >
                                                        <List className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>List view - Table format with expandable rows</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button onClick={handleCreate} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                                    <Plus className="h-4 w-4" />
                                                    Add Equipment
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Add new equipment to the system</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Advanced Filters Panel */}
                            {showFilters && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white rounded-lg border animate-slide-down">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="bg-white/80">
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="operational">Operational</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                                <SelectItem value="out_of_service">Out of Service</SelectItem>
                                                <SelectItem value="reserved">Reserved</SelectItem>
                                                <SelectItem value="retired">Retired</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger className="bg-white/80">
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {uniqueCategories.map(category => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
                                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                                            <SelectTrigger className="bg-white/80">
                                                <SelectValue placeholder="All Locations" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Locations</SelectItem>
                                                {uniqueLocations.map(location => (
                                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Department</label>
                                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                            <SelectTrigger className="bg-white/80">
                                                <SelectValue placeholder="All Departments" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Departments</SelectItem>
                                                {uniqueDepartments.map(department => (
                                                    <SelectItem key={department} value={department}>{department}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Results Count */}
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-white/80">
                                Found <span className="font-semibold">{filteredEquipment.length}</span> equipment items
                                {hasActiveFilters && <span className="ml-1">(filtered)</span>}
                            </p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" onClick={fetchEquipment} className="text-white hover:text-white hover:bg-white/20">
                                            <RefreshCw className="h-4 w-4 mr-1" />
                                            Refresh
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Refresh equipment data</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        {/* Equipment Display */}
                        {filteredEquipment.length === 0 ? (
                            <Card className="text-center py-12 bg-white">
                                <CardContent>
                                    <ToolCase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No equipment found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {equipment.length === 0 
                                            ? "Get started by adding your first equipment asset."
                                            : "Try adjusting your search or filters to find what you're looking for."}
                                    </p>
                                    {equipment.length === 0 && (
                                        <Button onClick={handleCreate}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Equipment
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : viewMode === 'list' ? (
                            /* List View with Expandable Rows */
                            <Card className="bg-white overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Equipment</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Model</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Maintenance</TableHead>
                                                <TableHead>Age</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedEquipment.map((equip) => (
                                                <EquipmentListRow
                                                    key={equip.id}
                                                    equipment={equip}
                                                    onEdit={handleEdit}
                                                    onDelete={setDeleteConfirm}
                                                    isExpanded={expandedItems.has(equip.id)}
                                                    onToggleExpand={() => toggleExpand(equip.id)}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        ) : (
                            /* Grid View with Expandable Cards */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {paginatedEquipment.map((equip) => (
                                    <EquipmentCard
                                        key={equip.id}
                                        equipment={equip}
                                        onEdit={handleEdit}
                                        onDelete={setDeleteConfirm}
                                        isExpanded={expandedItems.has(equip.id)}
                                        onToggleExpand={() => toggleExpand(equip.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredEquipment.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredEquipment.length}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        )}

                        {/* Equipment Form Dialog */}
                        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-white/30">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingEquipment 
                                            ? "Update the equipment details below." 
                                            : "Add a new equipment asset to the system."}
                                    </DialogDescription>
                                </DialogHeader>
                                <EquipmentForm
                                    equipment={editingEquipment}
                                    onSubmit={handleFormSubmit}
                                    onCancel={() => {
                                        setIsFormOpen(false);
                                        setEditingEquipment(null);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                            <DialogContent className="bg-white/95 backdrop-blur-sm">
                                <DialogHeader>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this equipment? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                                        Delete
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </main>
        </PageShell>
    );
};

export default EquipmentManagement;