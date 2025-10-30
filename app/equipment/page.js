// app/equipment/page.js
'use client';

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
    Cpu
} from "lucide-react";

const API_BASE_URL = "/api/equipment";

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

// Helper functions for click-to-call
const handlePhoneClick = (phoneNumber) => {
    if (phoneNumber) {
        window.open(`tel:${phoneNumber}`, '_self');
    }
};

// --- Visualization Components ---
const EquipmentMetrics = ({ equipment }) => {
    const metrics = useMemo(() => {
        const operational = equipment.filter(item => item.status?.toLowerCase() === 'operational').length;
        const underMaintenance = equipment.filter(item => item.status?.toLowerCase() === 'maintenance').length;
        const outOfService = equipment.filter(item => item.status?.toLowerCase() === 'out_of_service').length;
        
        const avgAge = equipment.reduce((sum, item) => {
            if (!item.commission_date) return sum;
            const commissionDate = new Date(item.commission_date);
            const now = new Date();
            const age = (now - commissionDate) / (1000 * 60 * 60 * 24 * 365.25);
            return sum + age;
        }, 0) / equipment.length;

        return {
            operational,
            underMaintenance,
            outOfService,
            operationalRate: (operational / equipment.length) * 100,
            avgAge: avgAge.toFixed(1)
        };
    }, [equipment]);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-purple-600" />
                    Equipment Metrics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold text-green-600">{metrics.operational}</div>
                        <div className="text-xs text-gray-600">Operational</div>
                        <div className="text-xs text-green-500 mt-1">{metrics.operationalRate.toFixed(1)}% availability</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <Wrench className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold text-yellow-600">{metrics.underMaintenance}</div>
                        <div className="text-xs text-gray-600">Maintenance</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold text-red-600">{metrics.outOfService}</div>
                        <div className="text-xs text-gray-600">Out of Service</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold text-blue-600">{metrics.avgAge}</div>
                        <div className="text-xs text-gray-600">Avg Age (years)</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const EquipmentCategoryChart = ({ equipment }) => {
    const categoryData = useMemo(() => {
        const categoryCounts = equipment.reduce((acc, item) => {
            const category = item.category || "Uncategorized";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(categoryCounts)
            .map(([category, count], index) => ({
                category,
                count,
                percentage: (count / equipment.length) * 100,
                color: getCategoryColor(category, index)
            }))
            .sort((a, b) => b.count - a.count);
    }, [equipment]);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                    Equipment by Category
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {categoryData.map((item, index) => (
                        <div key={item.category} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-800">{item.count}</div>
                                <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const StatusDistributionChart = ({ equipment }) => {
    const statusData = useMemo(() => {
        const statusCounts = equipment.reduce((acc, item) => {
            const status = item.status || "Unknown";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(statusCounts)
            .map(([status, count]) => ({
                status,
                count,
                percentage: (count / equipment.length) * 100,
                color: getStatusBadgeColor(status).split(' ')[0]
            }))
            .sort((a, b) => b.count - a.count);
    }, [equipment]);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Status Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {statusData.map((item, index) => (
                        <div key={item.status} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">{item.status}</span>
                                <span className="text-gray-600">{item.count} ({item.percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ease-out ${item.color}`}
                                    style={{
                                        width: `${item.percentage}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// --- Comprehensive Equipment Tooltip/Summary ---
const EquipmentTooltipContent = ({ equipment, isVisible, onMouseEnter, onMouseLeave }) => {
    const age = calculateAge(equipment.commission_date);
    const maintenanceStatus = getMaintenanceStatus(equipment.last_maintenance, equipment.maintenance_interval);

    if (!isVisible) return null;

    return (
        <div 
            className="absolute z-50 top-0 left-[102%] w-[480px] p-5 bg-white border border-indigo-300 rounded-xl shadow-2xl pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 origin-left max-h-[80vh] overflow-y-auto"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-lg text-indigo-700 flex items-center">
                    <ToolCase className="h-5 w-5 mr-2 text-indigo-500" />
                    Equipment Profile: {equipment.equipment_id}
                </h4>
                <Badge variant="secondary" className={`${getStatusBadgeColor(equipment.status)} font-bold`}>
                    {equipment.status || "Unknown"}
                </Badge>
            </div>
            <Separator className="mb-4" />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-sm font-semibold text-blue-700">{age}</div>
                    <div className="text-xs text-blue-600">Age</div>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded-lg">
                    <div className="text-sm font-semibold text-amber-700">{equipment.maintenance_interval || "N/A"} months</div>
                    <div className="text-xs text-amber-600">Maintenance Interval</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <div className="text-sm font-semibold text-purple-700">
                        <Badge variant="secondary" className={getMaintenanceStatusColor(maintenanceStatus)}>
                            {maintenanceStatus}
                        </Badge>
                    </div>
                    <div className="text-xs text-purple-600">Maintenance Status</div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-indigo-500" />
                    Basic Information
                </h5>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
                    <div><span className="font-medium">Name:</span> {equipment.name || "N/A"}</div>
                    <div><span className="font-medium">Model:</span> {equipment.model || "N/A"}</div>
                    <div><span className="font-medium">Serial No:</span> {equipment.serial_number || "N/A"}</div>
                    <div><span className="font-medium">Category:</span> {equipment.category || "N/A"}</div>
                    <div className="col-span-2"><span className="font-medium">Description:</span> {equipment.description || "N/A"}</div>
                </div>
            </div>

            {/* Commission & Location */}
            <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <Building className="h-4 w-4 mr-1 text-blue-500" />
                    Commission & Location
                </h5>
                <div className="space-y-1 text-sm text-gray-800">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="font-medium">Commissioned:</span> 
                        <span className="truncate">{equipment.commission_date || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="font-medium">Location:</span> 
                        <span className="truncate">{equipment.location || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="font-medium">Department:</span> 
                        <span className="truncate">{equipment.department || "N/A"}</span>
                    </div>
                </div>
            </div>

            {/* Supplier Information */}
            <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <Truck className="h-4 w-4 mr-1 text-green-500" />
                    Supplier Information
                </h5>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
                    <div><span className="font-medium">Supplier:</span> {equipment.supplier || "N/A"}</div>
                    <div><span className="font-medium">Contact:</span> {equipment.supplier_contact || "N/A"}</div>
                    <div className="col-span-2">
                        <span className="font-medium">Phone:</span> 
                        <span 
                            className={`ml-1 ${equipment.supplier_phone ? 'text-green-600 cursor-pointer hover:underline' : 'text-gray-500'}`}
                            onClick={() => equipment.supplier_phone && handlePhoneClick(equipment.supplier_phone)}
                        >
                            {equipment.supplier_phone || "N/A"}
                        </span>
                    </div>
                    <div className="col-span-2"><span className="font-medium">Warranty:</span> {equipment.warranty_info || "N/A"}</div>
                </div>
            </div>

            {/* Technical Specifications */}
            {equipment.specifications && (
                <div className="mb-4">
                    <h5 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                        <Cpu className="h-4 w-4 mr-1 text-amber-500" />
                        Technical Specifications
                    </h5>
                    <div className="text-sm text-gray-800">
                        {equipment.specifications}
                    </div>
                </div>
            )}

            {/* Maintenance History */}
            <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <Wrench className="h-4 w-4 mr-1 text-purple-500" />
                    Maintenance History
                </h5>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
                    <div><span className="font-medium">Last Maintenance:</span> {equipment.last_maintenance || "N/A"}</div>
                    <div><span className="font-medium">Next Due:</span> {equipment.next_maintenance || "N/A"}</div>
                    <div className="col-span-2">
                        <span className="font-medium">Maintenance Notes:</span> {equipment.maintenance_notes || "N/A"}
                    </div>
                </div>
            </div>

            {/* Cost & Value */}
            <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-1 text-red-500" />
                    Cost & Value
                </h5>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
                    <div><span className="font-medium">Purchase Cost:</span> {equipment.purchase_cost ? `$${equipment.purchase_cost}` : "N/A"}</div>
                    <div><span className="font-medium">Current Value:</span> {equipment.current_value ? `$${equipment.current_value}` : "N/A"}</div>
                    <div className="col-span-2"><span className="font-medium">Depreciation Rate:</span> {equipment.depreciation_rate ? `${equipment.depreciation_rate}%` : "N/A"}</div>
                </div>
            </div>

            <div className="text-center mt-4 p-2 bg-indigo-50 rounded-lg">
                <p className="text-xs text-indigo-600 font-medium">
                    <FileText className="h-3 w-3 inline mr-1" />
                    All equipment data displayed above
                </p>
            </div>
        </div>
    );
};

// --- Enhanced Equipment Card with Tabs ---
const EquipmentCard = ({ equipment, onEdit, onDelete }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const cardRef = useRef(null);

    const handleMouseEnter = () => {
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = (e) => {
        setIsTooltipVisible(false);
    };

    const handleTooltipMouseEnter = () => {
        setIsTooltipVisible(true);
    };

    const handleTooltipMouseLeave = () => {
        setIsTooltipVisible(false);
    };

    const age = calculateAge(equipment.commission_date);
    const maintenanceStatus = getMaintenanceStatus(equipment.last_maintenance, equipment.maintenance_interval);

    return (
        <Card 
            ref={cardRef}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 relative group w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Comprehensive Summary Tooltip */}
            <EquipmentTooltipContent 
                equipment={equipment}
                isVisible={isTooltipVisible}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
            />

            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-semibold text-indigo-700 truncate">
                            {equipment.name}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-gray-500 truncate">
                            {equipment.model} • {equipment.category}
                        </CardDescription>
                    </div>
                    <span className={`text-xs font-semibold py-0.5 px-2 rounded-full border ${getStatusBadgeColor(equipment.status)} shrink-0 ml-2`}>
                        {equipment.status || "Unknown"}
                    </span>
                </div>
                
                {/* Quick Stats */}
                <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        ID: {equipment.equipment_id}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">
                        {age}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getMaintenanceStatusColor(maintenanceStatus)}`}>
                        {maintenanceStatus}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-10 p-1 bg-gray-50">
                        <TabsTrigger value="overview" className="text-xs flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="technical" className="text-xs flex items-center gap-1">
                            <Cpu className="h-3 w-3" />
                            Technical
                        </TabsTrigger>
                        <TabsTrigger value="maintenance" className="text-xs flex items-center gap-1">
                            <Wrench className="h-3 w-3" />
                            Maintenance
                        </TabsTrigger>
                        <TabsTrigger value="supplier" className="text-xs flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Supplier
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-1">
                                <Briefcase className="h-3 w-3 text-blue-500" />
                                <span className="font-medium">Dept:</span>
                                <span className="truncate">{equipment.department || "N/A"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-green-500" />
                                <span className="font-medium">Location:</span>
                                <span className="truncate">{equipment.location || "N/A"}</span>
                            </div>
                            <div className="col-span-2 flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-purple-500" />
                                <span className="font-medium">Commissioned:</span>
                                <span>{equipment.commission_date || "N/A"}</span>
                            </div>
                        </div>
                        
                        {equipment.description && (
                            <div className="text-sm">
                                <div className="font-medium text-gray-700 mb-1">Description:</div>
                                <div className="text-gray-600 line-clamp-2">{equipment.description}</div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Technical Tab */}
                    <TabsContent value="technical" className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-medium">Serial No:</span>
                                <div className="text-gray-600 truncate">{equipment.serial_number || "N/A"}</div>
                            </div>
                            <div>
                                <span className="font-medium">Category:</span>
                                <div className="text-gray-600">{equipment.category || "N/A"}</div>
                            </div>
                            {equipment.specifications && (
                                <div className="col-span-2">
                                    <span className="font-medium">Specifications:</span>
                                    <div className="text-gray-600 text-xs line-clamp-2">{equipment.specifications}</div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Maintenance Tab */}
                    <TabsContent value="maintenance" className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-medium">Interval:</span>
                                <div className="text-gray-600">{equipment.maintenance_interval ? `${equipment.maintenance_interval} months` : "N/A"}</div>
                            </div>
                            <div>
                                <span className="font-medium">Last Service:</span>
                                <div className="text-gray-600">{equipment.last_maintenance || "N/A"}</div>
                            </div>
                            <div className="col-span-2">
                                <span className="font-medium">Next Due:</span>
                                <div className="text-gray-600">{equipment.next_maintenance || "N/A"}</div>
                            </div>
                            {equipment.maintenance_notes && (
                                <div className="col-span-2">
                                    <span className="font-medium">Notes:</span>
                                    <div className="text-gray-600 text-xs line-clamp-2">{equipment.maintenance_notes}</div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Supplier Tab */}
                    <TabsContent value="supplier" className="p-4 space-y-3">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div>
                                <span className="font-medium">Supplier:</span>
                                <div className="text-gray-600">{equipment.supplier || "N/A"}</div>
                            </div>
                            <div>
                                <span className="font-medium">Contact:</span>
                                <div className="text-gray-600">{equipment.supplier_contact || "N/A"}</div>
                            </div>
                            <div>
                                <span className="font-medium">Phone:</span>
                                <div 
                                    className={`${equipment.supplier_phone ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-600'}`}
                                    onClick={() => equipment.supplier_phone && handlePhoneClick(equipment.supplier_phone)}
                                >
                                    {equipment.supplier_phone || "N/A"}
                                </div>
                            </div>
                            <div>
                                <span className="font-medium">Warranty:</span>
                                <div className="text-gray-600 text-xs">{equipment.warranty_info || "N/A"}</div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(equipment)}
                        className="flex items-center space-x-1"
                    >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(equipment.id)}
                        className="flex items-center space-x-1"
                    >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
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
    const [deleteConfirm, setDeleteConfirm] = useState(null);

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

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.name?.toLowerCase().includes(term) ||
                item.equipment_id?.toLowerCase().includes(term) ||
                item.model?.toLowerCase().includes(term) ||
                item.category?.toLowerCase().includes(term) ||
                item.location?.toLowerCase().includes(term) ||
                item.department?.toLowerCase().includes(term)
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(item => item.status === statusFilter);
        }

        // Apply category filter
        if (categoryFilter !== "all") {
            result = result.filter(item => item.category === categoryFilter);
        }

        setFilteredEquipment(result);
    }, [equipment, searchTerm, statusFilter, categoryFilter]);

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

    // Fixed handleFormSubmit function with proper ID handling
    const handleFormSubmit = async (formData) => {
        try {
            const isEditing = !!editingEquipment;
            const url = isEditing ? `${API_BASE_URL}/${editingEquipment.id}` : API_BASE_URL;
            const method = isEditing ? "PUT" : "POST";

            console.log("Submitting to:", url, "with method:", method);
            console.log("Form data:", formData);

            // For PUT requests, include the ID in the request body
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
                    
                    // Handle array of validation errors (like the one shown in the console)
                    if (Array.isArray(errorData)) {
                        const errorMessages = errorData.map(error => 
                            `${error.loc.join('.')}: ${error.msg}`
                        );
                        errorMessage = errorMessages.join(', ');
                    } 
                    // Handle string error
                    else if (typeof errorData === 'string') {
                        errorMessage = errorData;
                    } 
                    // Handle object with detail property
                    else if (errorData.detail) {
                        errorMessage = typeof errorData.detail === 'string' 
                            ? errorData.detail 
                            : JSON.stringify(errorData.detail);
                    } 
                    // Handle object with message property
                    else if (errorData.message) {
                        errorMessage = typeof errorData.message === 'string'
                            ? errorData.message
                            : JSON.stringify(errorData.message);
                    } 
                    // Fallback for any other object
                    else {
                        errorMessage = JSON.stringify(errorData);
                    }
                } catch (parseError) {
                    // If JSON parsing fails, use the status text
                    errorMessage = response.statusText || `HTTP ${response.status}`;
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log("Save successful:", result);

            setIsFormOpen(false);
            setEditingEquipment(null);
            fetchEquipment();
        } catch (err) {
            console.error("Save error:", err);
            // Ensure the error message is a string
            const errorMessage = typeof err.message === 'string' 
                ? err.message 
                : 'An unexpected error occurred while saving equipment';
            setError(errorMessage);
        }
    };

    const getUniqueCategories = () => {
        const categories = equipment.map(item => item.category).filter(Boolean);
        return [...new Set(categories)];
    };

    const getStatusCounts = () => {
        return equipment.reduce((acc, item) => {
            const status = item.status || "Unknown";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700">Loading Equipment Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Equipment Management</h1>
                    <p className="text-lg text-gray-600">Manage and monitor all organizational equipment assets</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <EquipmentMetrics equipment={equipment} />
                    <EquipmentCategoryChart equipment={equipment} />
                    <StatusDistributionChart equipment={equipment} />
                </div>

                {/* Controls Section */}
                <Card className="mb-6 shadow-lg border-0">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search equipment..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex gap-2 flex-wrap">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[140px] bg-white">
                                            <SelectValue placeholder="Status" />
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

                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-[140px] bg-white">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {getUniqueCategories().map(category => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Equipment
                            </Button>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                            {Object.entries(getStatusCounts()).map(([status, count]) => (
                                <div key={status} className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusBadgeColor(status).split(' ')[0]}`} />
                                    <span className="text-sm font-medium text-gray-700">{status}:</span>
                                    <span className="text-sm text-gray-600">{count}</span>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Total:</span>
                                <span className="text-sm text-gray-600">{equipment.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEquipment.map((equip) => (
                        <EquipmentCard
                            key={equip.id}
                            equipment={equip}
                            onEdit={handleEdit}
                            onDelete={setDeleteConfirm}
                        />
                    ))}
                </div>

                {filteredEquipment.length === 0 && (
                    <Card className="text-center py-12">
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
                )}

                {/* Equipment Form Dialog */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <DialogContent>
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
            </div>
        </div>
    );
};

export default EquipmentManagement;