// pages/employees/page.js 
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import EmployeeForm from "../../components/EmployeeForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Loader2, 
    Plus, 
    Users, 
    Search, 
    ChevronUp, 
    ChevronDown, 
    Trash2, 
    Edit, 
    Briefcase, 
    TrendingUp, 
    Calendar, 
    GraduationCap,
    Mail,
    Phone,
    MapPin,
    UserCheck,
    Shield,
    Award,
    History,
    FileText,
    BarChart3,
    PieChart,
    Activity,
    Target,
    User,
    Building,
    Star,
    Clock,
    TrendingDown,
    Eye,
    ChevronRight,
    ChevronLeft,
    Grid3X3,
    List,
    MoreVertical
} from "lucide-react";

// ✅ Correct - using the environment variable name
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://myofficebackend.onrender.com'

// --- Utility Functions ---
const getClassBadgeColor = (employeeClass) => {
    switch (employeeClass) {
        case "Permanent": return "bg-green-100 text-green-800 border-green-300";
        case "Contract": return "bg-yellow-100 text-yellow-800 border-yellow-300";
        case "Internship": return "bg-blue-100 text-blue-800 border-blue-300";
        case "Part-Time": return "bg-purple-100 text-purple-800 border-purple-300";
        case "N/A":
        default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
};

const getClassColor = (employeeClass) => {
    switch (employeeClass) {
        case "Permanent": return "#10b981";
        case "Contract": return "#eab308";
        case "Internship": return "#3b82f6";
        case "Part-Time": return "#8b5cf6";
        case "N/A":
        default: return "#6b7280";
    }
};

const getDepartmentColor = (department, index) => {
    const colors = [
        "#ef4444", "#f97316", "#f59e0b", "#eab308", 
        "#84cc16", "#22c55e", "#10b981", "#14b8a6",
        "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
        "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"
    ];
    return colors[index % colors.length];
};

const calculateTenure = (engagementDate) => {
    if (!engagementDate) return "N/A";
    const start = new Date(engagementDate);
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

// Helper functions for click-to-call and email
const handlePhoneClick = (phoneNumber) => {
    if (phoneNumber) {
        window.open(`tel:${phoneNumber}`, '_self');
    }
};

const handleEmailClick = (email) => {
    if (email) {
        window.open(`mailto:${email}`, '_self');
    }
};

// Enhanced employee ID generator that allows custom formats
const generateEmployeeId = (customId = '') => {
    if (customId && customId.trim() !== '') {
        // Allow custom IDs like C1165, PM134, etc.
        return customId.trim().toUpperCase();
    }
    
    // Generate default ID if no custom ID provided
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EMP_${timestamp}_${randomStr}`;
};

// --- Enhanced Visualization Components ---
const DepartmentDistributionChart = ({ employees }) => {
    const departmentData = useMemo(() => {
        const deptCounts = employees.reduce((acc, emp) => {
            const dept = emp.department || "Unassigned";
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(deptCounts)
            .map(([department, count], index) => ({
                department,
                count,
                percentage: employees.length > 0 ? (count / employees.length) * 100 : 0,
                color: getDepartmentColor(department, index)
            }))
            .sort((a, b) => b.count - a.count);
    }, [employees]);

    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                    Department Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-6">
                    <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                            {departmentData.map((item, index) => {
                                const startAngle = departmentData.slice(0, index).reduce((sum, d) => sum + (d.count / employees.length) * 360, 0);
                                const angle = (item.count / employees.length) * 360;
                                
                                const largeArc = angle > 180 ? 1 : 0;
                                const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                                const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                                const x2 = 50 + 50 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                                const y2 = 50 + 50 * Math.sin(((startAngle + angle) * Math.PI) / 180);

                                return (
                                    <path
                                        key={index}
                                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                        fill={item.color}
                                        stroke="white"
                                        strokeWidth="2"
                                        className="transition-all duration-300 cursor-pointer"
                                        style={{
                                            opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
                                            transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                                            transformOrigin: 'center'
                                        }}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-700">{employees.length}</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 max-h-32 overflow-y-auto">
                        {departmentData.map((item, index) => (
                            <div
                                key={item.department}
                                className="flex items-center justify-between p-2 rounded-lg transition-all duration-200 hover:bg-white/50"
                                style={{
                                    transform: hoveredIndex === index ? 'translateX(4px)' : 'translateX(0)',
                                    backgroundColor: hoveredIndex === index ? 'rgba(255,255,255,0.8)' : 'transparent'
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                                        {item.department}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-800">{item.count}</div>
                                    <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const EmployeeClassChart = ({ employees }) => {
    const classData = useMemo(() => {
        const classCounts = employees.reduce((acc, emp) => {
            const empClass = emp.employee_class || "N/A";
            acc[empClass] = (acc[empClass] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(classCounts)
            .map(([empClass, count]) => ({
                class: empClass,
                count,
                percentage: employees.length > 0 ? (count / employees.length) * 100 : 0,
                color: getClassColor(empClass)
            }))
            .sort((a, b) => b.count - a.count);
    }, [employees]);

    const [hoveredBar, setHoveredBar] = useState(null);
    const maxCount = Math.max(...classData.map(d => d.count), 1);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Employee Class Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {classData.map((item, index) => (
                        <div key={item.class} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">{item.class}</span>
                                <span className="text-gray-600">{item.count} ({item.percentage.toFixed(1)}%)</span>
                            </div>
                            <div
                                className="h-4 bg-gray-200 rounded-full overflow-hidden"
                                onMouseEnter={() => setHoveredBar(index)}
                                onMouseLeave={() => setHoveredBar(null)}
                            >
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        backgroundColor: item.color,
                                        width: `${(item.count / maxCount) * 100}%`,
                                        transform: hoveredBar === index ? 'scale(1.02)' : 'scale(1)',
                                        boxShadow: hoveredBar === index ? `0 4px 12px ${item.color}40` : 'none'
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

const QualificationAnalysis = ({ employees }) => {
    const qualificationData = useMemo(() => {
        const allQualifications = employees.flatMap(emp => emp.qualifications || []);
        const qualCounts = allQualifications.reduce((acc, qual) => {
            acc[qual] = (acc[qual] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(qualCounts)
            .map(([qualification, count]) => ({
                qualification,
                count,
                percentage: employees.length > 0 ? (count / employees.length) * 100 : 0
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [employees]);

    const [selectedQual, setSelectedQual] = useState(null);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-amber-600" />
                    Top Qualifications
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {qualificationData.map((item, index) => (
                        <div
                            key={item.qualification}
                            className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                                selectedQual === item.qualification 
                                    ? 'bg-white border-amber-300 shadow-md' 
                                    : 'bg-white/50 border-transparent hover:bg-white hover:border-amber-200'
                            }`}
                            onClick={() => setSelectedQual(
                                selectedQual === item.qualification ? null : item.qualification
                            )}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-2">
                                    {item.qualification}
                                </span>
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                    {item.count}
                                </Badge>
                            </div>
                            {selectedQual === item.qualification && (
                                <div className="mt-2 text-xs text-gray-600">
                                    Held by {item.percentage.toFixed(1)}% of employees
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const PerformanceMetrics = ({ employees }) => {
    const metrics = useMemo(() => {
        const totalAwards = employees.reduce((sum, emp) => sum + (emp.awards_recognition?.length || 0), 0);
        const totalOffences = employees.reduce((sum, emp) => sum + (emp.offences?.length || 0), 0);
        const employeesWithAwards = employees.filter(emp => emp.awards_recognition?.length > 0).length;
        const employeesWithOffences = employees.filter(emp => emp.offences?.length > 0).length;

        return {
            totalAwards,
            totalOffences,
            awardRate: employees.length > 0 ? (employeesWithAwards / employees.length) * 100 : 0,
            offenceRate: employees.length > 0 ? (employeesWithOffences / employees.length) * 100 : 0
        };
    }, [employees]);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-purple-600" />
                    Performance Metrics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold text-green-600">{metrics.totalAwards}</div>
                        <div className="text-xs text-gray-600">Total Awards</div>
                        <div className="text-xs text-green-500 mt-1">{metrics.awardRate.toFixed(1)}% of employees</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold text-red-600">{metrics.totalOffences}</div>
                        <div className="text-xs text-gray-600">Total Offences</div>
                        <div className="text-xs text-red-500 mt-1">{metrics.offenceRate.toFixed(1)}% of employees</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// NEW: Tenure Distribution Chart
const TenureDistributionChart = ({ employees }) => {
    const tenureData = useMemo(() => {
        const tenureRanges = {
            '0-1 years': 0,
            '1-3 years': 0,
            '3-5 years': 0,
            '5-10 years': 0,
            '10+ years': 0
        };

        employees.forEach(emp => {
            if (!emp.date_of_engagement) return;
            
            const start = new Date(emp.date_of_engagement);
            const now = new Date();
            const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
            
            if (years < 1) tenureRanges['0-1 years']++;
            else if (years < 3) tenureRanges['1-3 years']++;
            else if (years < 5) tenureRanges['3-5 years']++;
            else if (years < 10) tenureRanges['5-10 years']++;
            else tenureRanges['10+ years']++;
        });

        return Object.entries(tenureRanges).map(([range, count]) => ({
            range,
            count,
            percentage: employees.length > 0 ? (count / employees.length) * 100 : 0
        }));
    }, [employees]);

    const [hoveredRange, setHoveredRange] = useState(null);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-orange-600" />
                    Tenure Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tenureData.map((item, index) => (
                        <div key={item.range} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{item.range}</span>
                                <span className="text-sm text-gray-600">
                                    {item.count} ({item.percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div
                                className="h-3 bg-gray-200 rounded-full overflow-hidden relative"
                                onMouseEnter={() => setHoveredRange(index)}
                                onMouseLeave={() => setHoveredRange(null)}
                            >
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                                    style={{
                                        width: `${item.percentage}%`,
                                        transform: hoveredRange === index ? 'scale(1.02)' : 'scale(1)',
                                        boxShadow: hoveredRange === index ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'none'
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

// NEW: Employee Growth Timeline
const EmployeeGrowthTimeline = ({ employees }) => {
    const growthData = useMemo(() => {
        const monthlyData = {};
        
        employees.forEach(emp => {
            if (!emp.date_of_engagement) return;
            
            const date = new Date(emp.date_of_engagement);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = 0;
            }
            monthlyData[monthYear]++;
        });

        // Convert to array and sort by date
        return Object.entries(monthlyData)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-12); // Last 12 months
    }, [employees]);

    const [hoveredMonth, setHoveredMonth] = useState(null);
    const maxCount = Math.max(...growthData.map(d => d.count), 1);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-cyan-50 to-blue-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-cyan-600" />
                    Employee Growth (Last 12 Months)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between h-32 space-x-1">
                    {growthData.map((item, index) => (
                        <div
                            key={item.month}
                            className="flex-1 flex flex-col items-center space-y-1"
                            onMouseEnter={() => setHoveredMonth(index)}
                            onMouseLeave={() => setHoveredMonth(null)}
                        >
                            <div
                                className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t transition-all duration-300 cursor-pointer"
                                style={{
                                    height: `${(item.count / maxCount) * 80}%`,
                                    transform: hoveredMonth === index ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: hoveredMonth === index ? '0 4px 12px rgba(6, 182, 212, 0.4)' : 'none'
                                }}
                            />
                            <div className="text-xs text-gray-600 text-center">
                                {new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            {hoveredMonth === index && (
                                <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                    {item.count} employees
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// NEW: Skills Heatmap
const SkillsHeatmap = ({ employees }) => {
    const skillsData = useMemo(() => {
        const allSkills = {};
        
        employees.forEach(emp => {
            emp.qualifications?.forEach(skill => {
                const cleanSkill = skill.trim().toLowerCase();
                if (cleanSkill) {
                    allSkills[cleanSkill] = (allSkills[cleanSkill] || 0) + 1;
                }
            });
        });

        return Object.entries(allSkills)
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);
    }, [employees]);

    const maxCount = Math.max(...skillsData.map(d => d.count), 1);

    const getIntensity = (count) => {
        const intensity = count / maxCount;
        if (intensity > 0.8) return 'bg-red-500 text-white';
        if (intensity > 0.6) return 'bg-orange-400 text-white';
        if (intensity > 0.4) return 'bg-yellow-400 text-gray-800';
        if (intensity > 0.2) return 'bg-green-400 text-white';
        return 'bg-blue-400 text-white';
    };

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-slate-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-gray-600" />
                    Skills Heatmap
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {skillsData.map((item) => (
                        <Badge
                            key={item.skill}
                            className={`text-xs font-medium transition-all duration-300 hover:scale-105 cursor-pointer ${getIntensity(item.count)}`}
                            variant="secondary"
                        >
                            {item.skill} ({item.count})
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// NEW: Performance Scorecard
const PerformanceScorecard = ({ employees }) => {
    const scoreData = useMemo(() => {
        const totalEmployees = employees.length;
        const avgQualifications = totalEmployees > 0 ? employees.reduce((sum, emp) => sum + (emp.qualifications?.length || 0), 0) / totalEmployees : 0;
        const employeesWithMultiplePositions = employees.filter(emp => (emp.other_positions?.length || 0) > 1).length;
        const highPerformers = employees.filter(emp => 
            (emp.awards_recognition?.length || 0) > 0 && 
            (emp.offences?.length || 0) === 0
        ).length;

        return {
            totalEmployees,
            avgQualifications: avgQualifications.toFixed(1),
            multiplePositions: totalEmployees > 0 ? ((employeesWithMultiplePositions / totalEmployees) * 100).toFixed(1) : "0",
            highPerformers: totalEmployees > 0 ? ((highPerformers / totalEmployees) * 100).toFixed(1) : "0"
        };
    }, [employees]);

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-violet-50 to-purple-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <TrendingDown className="h-5 w-5 mr-2 text-violet-600" />
                    Performance Scorecard
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-violet-600">{scoreData.avgQualifications}</div>
                        <div className="text-xs text-gray-600">Avg Qualifications</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{scoreData.multiplePositions}%</div>
                        <div className="text-xs text-gray-600">Multiple Positions</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{scoreData.highPerformers}%</div>
                        <div className="text-xs text-gray-600">High Performers</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-orange-600">{scoreData.totalEmployees}</div>
                        <div className="text-xs text-gray-600">Total Workforce</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Comprehensive Employee Tooltip/Summary with Expandable Details ---
const EmployeeTooltipContent = ({ employee, isVisible }) => {
    const [expanded, setExpanded] = useState(false);

    if (!isVisible) return null;

    const tenure = calculateTenure(employee.date_of_engagement);
    const qualCount = employee.qualifications?.length ?? 0;
    const employeeClass = employee.employee_class || "N/A";
    const offenceCount = employee.offences?.length ?? 0;
    const awardCount = employee.awards_recognition?.length ?? 0;
    const positionCount = employee.other_positions?.length ?? 0;
    const fullName = `${employee.first_name} ${employee.last_name}`;

    return (
        <div className="absolute z-50 top-full left-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-800 flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-blue-500" />
                    {fullName}
                </h4>
                <Badge className={getClassBadgeColor(employeeClass)}>
                    {employeeClass}
                </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-sm font-semibold text-blue-700">{qualCount}</div>
                    <div className="text-xs text-blue-600">Quals</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-sm font-semibold text-red-700">{offenceCount}</div>
                    <div className="text-xs text-red-600">Offences</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-sm font-semibold text-green-700">{awardCount}</div>
                    <div className="text-xs text-green-600">Awards</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-sm font-semibold text-purple-700">{positionCount}</div>
                    <div className="text-xs text-purple-600">Positions</div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 text-sm mb-3">
                {employee.email && (
                    <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span 
                            className="text-blue-600 cursor-pointer hover:underline"
                            onClick={() => handleEmailClick(employee.email)}
                        >
                            {employee.email}
                        </span>
                    </div>
                )}
                {employee.phone && (
                    <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span 
                            className="text-green-600 cursor-pointer hover:underline"
                            onClick={() => handlePhoneClick(employee.phone)}
                        >
                            {employee.phone}
                        </span>
                    </div>
                )}
            </div>

            {/* Expandable Details Section */}
            <div className="border-t pt-3">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex items-center justify-between text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    onClick={() => setExpanded(!expanded)}
                >
                    <span>{expanded ? 'Collapse Full Details' : 'Expand for Full Details'}</span>
                    {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>

                {expanded && (
                    <div className="mt-3 space-y-3 animate-in fade-in duration-200">
                        {/* Organizational Details */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                            <div><span className="font-medium">Department:</span> {employee.department || "N/A"}</div>
                            <div><span className="font-medium">Tenure:</span> {tenure}</div>
                            <div><span className="font-medium">Designation:</span> {employee.designation || "N/A"}</div>
                            <div><span className="font-medium">Supervisor:</span> {employee.supervisor || "N/A"}</div>
                            <div><span className="font-medium">Section:</span> {employee.section || "N/A"}</div>
                            <div><span className="font-medium">Grade:</span> {employee.grade || "N/A"}</div>
                        </div>

                        {/* Qualifications */}
                        {qualCount > 0 && (
                            <div>
                                <div className="font-medium text-sm text-gray-700 mb-1">Qualifications:</div>
                                <div className="flex flex-wrap gap-1">
                                    {employee.qualifications.map((q, index) => (
                                        <Badge key={index} variant="outline" className="text-xs bg-amber-50 text-amber-700">
                                            {q}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Awards & Recognition */}
                        {awardCount > 0 && (
                            <div>
                                <div className="font-medium text-sm text-green-700 mb-1">Awards & Recognition:</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {employee.awards_recognition.map((award, index) => (
                                        <li key={index} className="flex items-start">
                                            <Award className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                            {award}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Offences */}
                        {offenceCount > 0 && (
                            <div>
                                <div className="font-medium text-sm text-red-700 mb-1">Offences:</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {employee.offences.map((offence, index) => (
                                        <li key={index} className="flex items-start">
                                            <Shield className="h-3 w-3 text-red-500 mr-1 mt-0.5 flex-shrink-0" />
                                            {offence}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Other Positions */}
                        {positionCount > 0 && (
                            <div>
                                <div className="font-medium text-sm text-blue-700 mb-1">Other Positions:</div>
                                <div className="flex flex-wrap gap-1">
                                    {employee.other_positions.map((position, index) => (
                                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                            {position}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Information */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            {employee.id_number && (
                                <div><span className="font-medium">ID Number:</span> {employee.id_number}</div>
                            )}
                            {employee.drivers_license_class && (
                                <div><span className="font-medium">Driver's License:</span> {employee.drivers_license_class}</div>
                            )}
                            {employee.ppe_issue_date && (
                                <div><span className="font-medium">PPE Issue:</span> {employee.ppe_issue_date}</div>
                            )}
                            {employee.previous_employer && (
                                <div className="col-span-2">
                                    <span className="font-medium">Previous Employer:</span> {employee.previous_employer}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center text-xs text-gray-500 mt-2">
                <FileText className="h-3 w-3 inline mr-1" />
                Click expand for complete profile
            </div>
        </div>
    );
};

// --- Enhanced Employee Card with Tabs ---
const EmployeeCard = ({ employee, onEdit, onDelete }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const cardRef = useRef(null);

    const handleMouseEnter = () => {
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setIsTooltipVisible(false);
    };

    const tenure = calculateTenure(employee.date_of_engagement);
    const qualCount = employee.qualifications?.length ?? 0;
    const awardCount = employee.awards_recognition?.length ?? 0;
    const offenceCount = employee.offences?.length ?? 0;
    const fullName = `${employee.first_name} ${employee.last_name}`;

    return (
        <Card 
            ref={cardRef}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 relative group w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Comprehensive Summary Tooltip */}
            <EmployeeTooltipContent 
                employee={employee}
                isVisible={isTooltipVisible}
            />

            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-semibold text-indigo-700 truncate">
                            {fullName}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-gray-500 truncate">
                            {employee.designation}
                        </CardDescription>
                    </div>
                    <span className={`text-xs font-semibold py-0.5 px-2 rounded-full border ${getClassBadgeColor(employee.employee_class || "N/A")} shrink-0 ml-2`}>
                        {employee.employee_class || "N/A"}
                    </span>
                </div>
                
                {/* Quick Stats */}
                <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        ID: {employee.id}
                    </Badge>
                    {qualCount > 0 && (
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">
                            {qualCount} qual
                        </Badge>
                    )}
                    {awardCount > 0 && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            {awardCount} award
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-10 p-1 bg-gray-50">
                        <TabsTrigger value="personal" className="text-xs flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Personal
                        </TabsTrigger>
                        <TabsTrigger value="organizational" className="text-xs flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            Org
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="text-xs flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Performance
                        </TabsTrigger>
                        <TabsTrigger value="history" className="text-xs flex items-center gap-1">
                            <History className="h-3 w-3" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Tab */}
                    <TabsContent value="personal" className="p-4 space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-blue-500" />
                                <span 
                                    className={`text-gray-600 ${employee.email ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                                    onClick={() => employee.email && handleEmailClick(employee.email)}
                                >
                                    {employee.email || "No email"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-green-500" />
                                <span 
                                    className={`text-gray-600 ${employee.phone ? 'cursor-pointer hover:text-green-600 hover:underline' : ''}`}
                                    onClick={() => employee.phone && handlePhoneClick(employee.phone)}
                                >
                                    {employee.phone || "No phone"}
                                </span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                                <span className="text-gray-600 flex-1">{employee.address || "No address"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <UserCheck className="h-4 w-4 text-purple-500" />
                                <span className="text-gray-600">ID: {employee.id_number || "N/A"}</span>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Organizational Tab */}
                    <TabsContent value="organizational" className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <div className="font-medium text-gray-500">Department</div>
                                <div className="text-gray-800">{employee.department || "N/A"}</div>
                            </div>
                            <div>
                                <div className="font-medium text-gray-500">Section</div>
                                <div className="text-gray-800">{employee.section || "N/A"}</div>
                            </div>
                            <div>
                                <div className="font-medium text-gray-500">Grade</div>
                                <div className="text-gray-800">{employee.grade || "N/A"}</div>
                            </div>
                            <div>
                                <div className="font-medium text-gray-500">Supervisor</div>
                                <div className="text-gray-800">{employee.supervisor || "N/A"}</div>
                            </div>
                            <div className="col-span-2">
                                <div className="font-medium text-gray-500">Engagement</div>
                                <div className="text-gray-800">{employee.date_of_engagement} ({tenure})</div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="p-4 space-y-3">
                        <div className="space-y-3">
                            {/* Qualifications */}
                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <GraduationCap className="h-4 w-4 text-amber-500" />
                                    Qualifications ({qualCount})
                                </div>
                                {qualCount > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {employee.qualifications.slice(0, 3).map((q, index) => (
                                            <Badge key={index} variant="outline" className="text-xs bg-amber-50 text-amber-700">
                                                {q}
                                            </Badge>
                                        ))}
                                        {qualCount > 3 && (
                                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                                                +{qualCount - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">No qualifications</p>
                                )}
                            </div>

                            {/* Awards & Offences */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-green-700 mb-1">
                                        <Award className="h-4 w-4" />
                                        Awards ({awardCount})
                                    </div>
                                    {awardCount > 0 ? (
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {employee.awards_recognition.slice(0, 2).map((award, index) => (
                                                <li key={index} className="truncate">• {award}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-gray-500">No awards</p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-red-700 mb-1">
                                        <Shield className="h-4 w-4" />
                                        Offences ({offenceCount})
                                    </div>
                                    {offenceCount > 0 ? (
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {employee.offences.slice(0, 2).map((offence, index) => (
                                                <li key={index} className="truncate">• {offence}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-gray-500">No offences</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="p-4 space-y-3">
                        <div className="space-y-3">
                            {/* Other Positions */}
                            <div>
                                <div className="font-medium text-sm text-gray-700 mb-2">
                                    Other Positions ({employee.other_positions?.length || 0})
                                </div>
                                {employee.other_positions?.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {employee.other_positions.map((position, index) => (
                                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                                {position}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">No additional positions</p>
                                )}
                            </div>

                            {/* Previous Employer */}
                            <div>
                                <div className="font-medium text-sm text-gray-700 mb-1">Previous Employer</div>
                                <p className="text-sm text-gray-600">
                                    {employee.previous_employer || "No previous employer listed"}
                                </p>
                            </div>

                            {/* Safety */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-medium text-gray-500">Driver's License</div>
                                    <div className="text-gray-800">{employee.drivers_license_class || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-500">PPE Issue</div>
                                    <div className="text-gray-800">{employee.ppe_issue_date || "N/A"}</div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator />
                <div className="p-4">
                    <div className="flex justify-between gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(employee)} className="flex-grow">
                            <Edit className="mr-2 h-3 w-3" /> Amend
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(employee)} title={`Delete record for ${fullName}`}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- NEW: Gorgeous List View Component ---
const EmployeeListItem = ({ employee, onEdit, onDelete, isSelected, onSelect }) => {
    const [showActions, setShowActions] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const tenure = calculateTenure(employee.date_of_engagement);
    const qualCount = employee.qualifications?.length ?? 0;
    const awardCount = employee.awards_recognition?.length ?? 0;
    const offenceCount = employee.offences?.length ?? 0;
    const fullName = `${employee.first_name} ${employee.last_name}`;

    return (
        <div 
            className={`bg-white rounded-xl border transition-all duration-300 hover:shadow-lg group ${
                isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
            }`}
        >
            {/* Main List Item */}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    {/* Left Section - Basic Info */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                {employee.first_name?.[0]}{employee.last_name?.[0]}
                            </div>
                        </div>

                        {/* Core Information */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {fullName}
                                </h3>
                                <Badge className={getClassBadgeColor(employee.employee_class || "N/A")}>
                                    {employee.employee_class || "N/A"}
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                    <Briefcase className="h-4 w-4 text-blue-500" />
                                    <span>{employee.designation || "No designation"}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Building className="h-4 w-4 text-green-500" />
                                    <span>{employee.department || "No department"}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4 text-orange-500" />
                                    <span>{tenure}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Stats & Actions */}
                    <div className="flex items-center space-x-6">
                        {/* Quick Stats */}
                        <div className="flex items-center space-x-4">
                            {qualCount > 0 && (
                                <div className="text-center">
                                    <div className="flex items-center space-x-1 text-sm text-amber-600">
                                        <GraduationCap className="h-4 w-4" />
                                        <span className="font-semibold">{qualCount}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">Quals</div>
                                </div>
                            )}
                            {awardCount > 0 && (
                                <div className="text-center">
                                    <div className="flex items-center space-x-1 text-sm text-green-600">
                                        <Award className="h-4 w-4" />
                                        <span className="font-semibold">{awardCount}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">Awards</div>
                                </div>
                            )}
                            {offenceCount > 0 && (
                                <div className="text-center">
                                    <div className="flex items-center space-x-1 text-sm text-red-600">
                                        <Shield className="h-4 w-4" />
                                        <span className="font-semibold">{offenceCount}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">Offences</div>
                                </div>
                            )}
                        </div>

                        {/* Contact Actions */}
                        <div className="flex items-center space-x-2">
                            {employee.email && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50"
                                    onClick={() => handleEmailClick(employee.email)}
                                >
                                    <Mail className="h-4 w-4" />
                                </Button>
                            )}
                            {employee.phone && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-500 hover:bg-green-50"
                                    onClick={() => handlePhoneClick(employee.phone)}
                                >
                                    <Phone className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* More Actions */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                onClick={() => setShowActions(!showActions)}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>

                            {showActions && (
                                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 py-1">
                                    <button
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        onClick={() => {
                                            onEdit(employee);
                                            setShowActions(false);
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        onClick={() => {
                                            onDelete(employee);
                                            setShowActions(false);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Expandable Details */}
                {expanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Contact Information */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 text-sm flex items-center space-x-2">
                                    <User className="h-4 w-4 text-blue-500" />
                                    <span>Contact Info</span>
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {employee.email && (
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Mail className="h-4 w-4 text-blue-500" />
                                            <span 
                                                className="truncate cursor-pointer hover:text-blue-600 hover:underline"
                                                onClick={() => handleEmailClick(employee.email)}
                                            >
                                                {employee.email}
                                            </span>
                                        </div>
                                    )}
                                    {employee.phone && (
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Phone className="h-4 w-4 text-green-500" />
                                            <span 
                                                className="cursor-pointer hover:text-green-600 hover:underline"
                                                onClick={() => handlePhoneClick(employee.phone)}
                                            >
                                                {employee.phone}
                                            </span>
                                        </div>
                                    )}
                                    {employee.address && (
                                        <div className="flex items-start space-x-2 text-gray-600">
                                            <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                                            <span className="flex-1">{employee.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Organizational Details */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 text-sm flex items-center space-x-2">
                                    <Building className="h-4 w-4 text-green-500" />
                                    <span>Organization</span>
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div><span className="font-medium">Section:</span> {employee.section || "N/A"}</div>
                                    <div><span className="font-medium">Grade:</span> {employee.grade || "N/A"}</div>
                                    <div><span className="font-medium">Supervisor:</span> {employee.supervisor || "N/A"}</div>
                                    <div><span className="font-medium">ID Number:</span> {employee.id_number || "N/A"}</div>
                                </div>
                            </div>

                            {/* Qualifications */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 text-sm flex items-center space-x-2">
                                    <GraduationCap className="h-4 w-4 text-amber-500" />
                                    <span>Qualifications ({qualCount})</span>
                                </h4>
                                {qualCount > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {employee.qualifications.slice(0, 3).map((q, index) => (
                                            <Badge key={index} variant="outline" className="text-xs bg-amber-50 text-amber-700">
                                                {q}
                                            </Badge>
                                        ))}
                                        {qualCount > 3 && (
                                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                                                +{qualCount - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">No qualifications</p>
                                )}
                            </div>

                            {/* Performance */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 text-sm flex items-center space-x-2">
                                    <Activity className="h-4 w-4 text-purple-500" />
                                    <span>Performance</span>
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-600">Awards:</span>
                                        <Badge variant="outline" className="bg-green-50 text-green-700">
                                            {awardCount}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-red-600">Offences:</span>
                                        <Badge variant="outline" className="bg-red-50 text-red-700">
                                            {offenceCount}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Expand/Collapse Button */}
                <div className="mt-4 flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-3 w-3 mr-1" />
                                Show Full Details
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- NEW: List View Component ---
const EmployeeListView = ({ 
    employees, 
    onEdit, 
    onDelete, 
    isLoading, 
    searchTerm, 
    onSearchChange,
    filterDesignation,
    onFilterDesignationChange,
    filterClass,
    onFilterClassChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    uniqueDesignations,
    uniqueClasses,
    page,
    onPageChange,
    perPage,
    selectedEmployees,
    onSelectEmployee,
    onSelectAll
}) => {
    const totalPages = Math.ceil(employees.length / perPage);
    const paginatedEmployees = employees.slice((page - 1) * perPage, page * perPage);
    const allSelected = paginatedEmployees.length > 0 && paginatedEmployees.every(emp => selectedEmployees.includes(emp.id));

    return (
        <div className="space-y-6">
            {/* Enhanced List Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Employee Directory</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {employees.length} employees found • {selectedEmployees.length} selected
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Quick Actions */}
                        {selectedEmployees.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                    <Mail className="h-4 w-4 mr-1" />
                                    Email Selected
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete Selected
                                </Button>
                            </div>
                        )}

                        {/* View Options */}
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-gray-600 hover:text-gray-900"
                                disabled
                            >
                                <List className="h-4 w-4 mr-1" />
                                List
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-gray-400 hover:text-gray-600"
                                onClick={() => {/* Switch to grid view */}}
                            >
                                <Grid3X3 className="h-4 w-4 mr-1" />
                                Grid
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters Bar */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search employees by name..."
                                value={searchTerm}
                                onChange={onSearchChange}
                                className="pl-10 bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Designation Filter */}
                    <Select value={filterDesignation} onValueChange={onFilterDesignationChange}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <Separator />
                            {uniqueDesignations.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Class Filter */}
                    <Select value={filterClass} onValueChange={onFilterClassChange}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                            <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            <Separator />
                            {uniqueClasses.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort */}
                    <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={onSortByChange}>
                            <SelectTrigger className="bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="first_name">Name</SelectItem>
                                <SelectItem value="designation">Role</SelectItem>
                                <SelectItem value="department">Department</SelectItem>
                                <SelectItem value="date_of_engagement">Engagement Date</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={onSortOrderChange}
                            className="bg-gray-50 border-gray-200"
                        >
                            {sortOrder === 'asc' ? 
                                <ChevronUp className="h-4 w-4" /> : 
                                <ChevronDown className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                </div>
            </div>

            {/* Employee List */}
            {isLoading ? (
                <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-200">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <span className="ml-2 text-lg text-gray-600">Loading employees...</span>
                </div>
            ) : paginatedEmployees.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl border border-gray-200">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                        {searchTerm || filterDesignation !== 'all' || filterClass !== 'all' 
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "Get started by adding your first employee to the system."
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {paginatedEmployees.map(employee => (
                        <EmployeeListItem
                            key={employee.id}
                            employee={employee}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isSelected={selectedEmployees.includes(employee.id)}
                            onSelect={() => onSelectEmployee(employee.id)}
                        />
                    ))}
                </div>
            )}

            {/* Enhanced Pagination */}
            {paginatedEmployees.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 bg-white rounded-xl border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{Math.min(employees.length, (page - 1) * perPage + 1)}</span> to{" "}
                        <span className="font-semibold">{Math.min(employees.length, page * perPage)}</span> of{" "}
                        <span className="font-semibold">{employees.length}</span> employees
                    </p>
                    
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="flex items-center space-x-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        className="w-8 h-8 p-0"
                                        onClick={() => onPageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                            {totalPages > 5 && (
                                <span className="px-2 text-sm text-gray-500">...</span>
                            )}
                        </div>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="flex items-center space-x-1"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Custom Hook
const useEmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = useCallback(async (signal) => {
        setIsLoading(true);
        setError(null);
        try {
            // ✅ FIXED: Use API_BASE with the correct endpoint
            const res = await fetch(`${API_BASE}/api/employees`, { signal });
            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                const message = errorBody.detail || `HTTP error! Status: ${res.status}`;
                throw new Error(message);
            }
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Fetch Error:", err);
                setError(`Failed to fetch employee data. Error: ${err.message || 'Check server connection.'}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { 
        const abortController = new AbortController();
        fetchEmployees(abortController.signal); 
        return () => abortController.abort();
    }, [fetchEmployees]);

    const mutateEmployee = async (url, method, payload = null) => {
        setError(null);
        try {
            // ✅ FIXED: Enhanced employee ID handling
            let processedPayload = payload;
            
            // For new employees, ensure employee_id is provided
            if (method === "POST") {
                processedPayload = {
                    ...payload,
                    // Use provided employee_id or generate one
                    employee_id: payload.employee_id || generateEmployeeId()
                };
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: processedPayload ? JSON.stringify(processedPayload) : undefined,
            });
            
            if (!res.ok) {
                let message = `API Error: Status ${res.status}.`;
                try {
                    const errorJson = await res.json();
                    message = errorJson.detail || errorJson.error || message;
                } catch {
                    message = await res.text();
                }
                throw new Error(message);
            }
            
            fetchEmployees(); 
            return { success: true, message: "Operation successful." };
        } catch (err) {
            console.error("Mutation Error:", err);
            setError(err.message);
            return { success: false, message: err.message };
        }
    };

    const handleAddEmployee = (employee) => mutateEmployee(`${API_BASE}/api/employees`, "POST", employee);
    const handleUpdateEmployee = (employee) => mutateEmployee(`${API_BASE}/api/employees/${employee.id}`, "PUT", employee);
    
    const handleDeleteEmployee = async (employeeId, fullName) => {
        if (window.confirm(`Confirm deletion: Are you sure you want to permanently remove ${fullName}'s record?`)) {
            return mutateEmployee(`${API_BASE}/api/employees/${employeeId}`, "DELETE");
        }
        return { success: false, message: "Deletion cancelled." };
    };

    return { 
        employees, 
        isLoading, 
        error, 
        handleAddEmployee, 
        handleUpdateEmployee, 
        handleDeleteEmployee, 
        clearError: () => setError(null) 
    };
};

// Summary Cards Component
const SummaryCards = ({ employees }) => { 
    const classCounts = employees.reduce((acc, e) => {
        const cls = e.employee_class || "N/A";
        acc[cls] = (acc[cls] || 0) + 1;
        return acc;
    }, {});
    
    const maxClass = Object.keys(classCounts).reduce((a, b) => {
        if (employees.length === 0) return 'N/A';
        return classCounts[a] >= classCounts[b] ? a : b;
    }, 'N/A');
    
    const uniqueDesignations = [...new Set(employees.map(e => e.designation).filter(Boolean))];
    const totalDesignations = uniqueDesignations.length;

    const totalQualifications = employees.reduce((sum, emp) => sum + (emp.qualifications?.length || 0), 0);
    const employeesWithAwards = employees.filter(emp => emp.awards_recognition?.length > 0).length;
    const employeesWithOffences = employees.filter(emp => emp.offences?.length > 0).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-l-4 border-indigo-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Personnel</CardTitle>
                    <Users className="h-5 w-5 text-indigo-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{employees.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">{totalQualifications} total qualifications</p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Most Common Class</CardTitle>
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold">{maxClass}</div>
                    <p className={`text-xs mt-1 font-medium ${getClassBadgeColor(maxClass)} border rounded-full px-2 inline-block`}>
                        {classCounts[maxClass] || 0} employees
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-amber-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Role Diversity</CardTitle>
                    <Briefcase className="h-5 w-5 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{totalDesignations}</div>
                    <p className="text-xs text-muted-foreground mt-1">Unique job roles</p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Performance</CardTitle>
                    <Award className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span className="text-green-600">Awards:</span>
                            <span className="font-semibold">{employeesWithAwards}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-red-600">Offences:</span>
                            <span className="font-semibold">{employeesWithOffences}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Main Component
export default function Employees() {
    const { employees, isLoading, error, handleAddEmployee, handleUpdateEmployee, handleDeleteEmployee, clearError } = useEmployeeManagement();

    // State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDesignation, setFilterDesignation] = useState("all"); 
    const [filterClass, setFilterClass] = useState("all"); 
    const [sortBy, setSortBy] = useState("first_name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [activeViewTab, setActiveViewTab] = useState("profiles");
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'cards'
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    // Filtering and Sorting - FIXED: Added proper null handling for search
    const uniqueDesignations = useMemo(() => [...new Set(employees.map(e => e.designation).filter(Boolean))], [employees]);
    const uniqueClasses = useMemo(() => [...new Set(employees.map(e => e.employee_class || "N/A").filter(Boolean))], [employees]);

    const processedEmployees = useMemo(() => {
        let filtered = employees
            .filter(emp => {
                // FIXED: Handle null/undefined values for search
                const firstName = emp.first_name || '';
                const lastName = emp.last_name || '';
                const name = `${firstName} ${lastName}`.toLowerCase();
                
                const searchTermLower = (searchTerm || '').toLowerCase();
                const passesSearch = name.includes(searchTermLower);
                
                const empClass = emp.employee_class || "N/A";
                const passesClassFilter = filterClass === "all" || empClass === filterClass;

                const empDesig = emp.designation ?? "";
                const passesDesigFilter = filterDesignation === "all" || empDesig === filterDesignation;

                return passesSearch && passesClassFilter && passesDesigFilter;
            })
            .sort((a, b) => {
                const aVal = a[sortBy] ?? "";
                const bVal = b[sortBy] ?? "";
                
                if (sortBy === 'id') {
                    const diff = Number(a.id) - Number(b.id);
                    return sortOrder === "asc" ? diff : -diff;
                }
                
                const comparison = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
                return sortOrder === "asc" ? comparison : -comparison;
            });
            
        return filtered;
    }, [employees, searchTerm, filterDesignation, filterClass, sortBy, sortOrder]);

    const perPage = viewMode === "list" ? 8 : 6;

    useEffect(() => { 
        setPage(1);
        setSelectedEmployees([]);
    }, [searchTerm, filterDesignation, filterClass, sortBy, sortOrder, viewMode]);

    // Handlers
    const handleAdd = () => { 
        setSelectedEmployee(null); 
        setIsDialogOpen(true); 
        clearError();
    };
    const handleEdit = (emp) => { 
        setSelectedEmployee(emp); 
        setIsDialogOpen(true); 
        clearError();
    };
    const handleDialogClose = () => { 
        setSelectedEmployee(null); 
        setIsDialogOpen(false); 
    };

    const handleSubmitForm = async (data) => {
        const processedData = {
            ...data,
            employee_id: selectedEmployee ? data.employee_id : (data.employee_id || generateEmployeeId(data.employee_id))
        };

        const result = selectedEmployee 
            ? await handleUpdateEmployee(processedData) 
            : await handleAddEmployee(processedData);
            
        if (result.success) {
            handleDialogClose();
        } 
        return result.success;
    };
    
    const handleEmployeeDeletion = async (emp) => {
        const fullName = `${emp.first_name} ${emp.last_name}`;
        const result = await handleDeleteEmployee(emp.id, fullName);
        if (!result.success && result.message) {
             setError(result.message);
        }
    };

    const handleSelectEmployee = (employeeId) => {
        setSelectedEmployees(prev => 
            prev.includes(employeeId) 
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const handleSelectAll = () => {
        const currentPageEmployees = processedEmployees.slice((page - 1) * perPage, page * perPage);
        const allSelected = currentPageEmployees.every(emp => selectedEmployees.includes(emp.id));
        
        if (allSelected) {
            // Deselect all
            setSelectedEmployees(prev => 
                prev.filter(id => !currentPageEmployees.some(emp => emp.id === id))
            );
        } else {
            // Select all
            const newSelected = [...new Set([...selectedEmployees, ...currentPageEmployees.map(emp => emp.id)])];
            setSelectedEmployees(newSelected);
        }
    };

    return (
        <div className="p-8 max-w-8xl mx-auto space-y-10">
            {/* Header */}
            <header className="flex flex-wrap justify-between items-center border-b pb-4">
                <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-gray-800">
                    <Users className="h-8 w-8 text-indigo-600" />
                    Personnel Registry
                </h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Button size="lg" onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Enlist New Employee
                    </Button>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{selectedEmployee ? "Amend Employee Details" : "New Personnel Enrollment"}</DialogTitle>
                        </DialogHeader>
                        <EmployeeForm
                            initialData={selectedEmployee}
                            onSubmit={handleSubmitForm}
                            onCancel={handleDialogClose}
                        />
                    </DialogContent>
                </Dialog>
            </header>

            {/* Summary Cards */}
            <SummaryCards employees={employees} />
            <Separator />

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="flex justify-between items-start">
                    <div>
                        <AlertTitle>Operation Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </div>
                    <Button variant="ghost" onClick={clearError} className="text-sm p-1 h-auto ml-4 shrink-0">Dismiss</Button>
                </Alert>
            )}

            {/* Main Tabs */}
            <Tabs value={activeViewTab} onValueChange={setActiveViewTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100 rounded-xl">
                    <TabsTrigger value="profiles" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Users className="h-4 w-4" />
                        <span>Employee Profiles</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger value="visualizations" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <PieChart className="h-4 w-4" />
                        <span>Visualizations</span>
                    </TabsTrigger>
                </TabsList>

                {/* Employee Profiles Tab */}
                <TabsContent value="profiles" className="space-y-6">
                    {/* View Mode Toggle */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {viewMode === 'list' ? 'List View' : 'Card View'}
                            </h3>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                {processedEmployees.length} employees
                            </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                className="h-8 px-3"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4 mr-1" />
                                List
                            </Button>
                            <Button
                                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                                size="sm"
                                className="h-8 px-3"
                                onClick={() => setViewMode('cards')}
                            >
                                <Grid3X3 className="h-4 w-4 mr-1" />
                                Cards
                            </Button>
                        </div>
                    </div>

                    {/* Conditional Rendering based on View Mode */}
                    {viewMode === 'list' ? (
                        <EmployeeListView
                            employees={processedEmployees}
                            onEdit={handleEdit}
                            onDelete={handleEmployeeDeletion}
                            isLoading={isLoading}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            filterDesignation={filterDesignation}
                            onFilterDesignationChange={setFilterDesignation}
                            filterClass={filterClass}
                            onFilterClassChange={setFilterClass}
                            sortBy={sortBy}
                            onSortByChange={setSortBy}
                            sortOrder={sortOrder}
                            onSortOrderChange={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                            uniqueDesignations={uniqueDesignations}
                            uniqueClasses={uniqueClasses}
                            page={page}
                            onPageChange={setPage}
                            perPage={perPage}
                            selectedEmployees={selectedEmployees}
                            onSelectEmployee={handleSelectEmployee}
                            onSelectAll={handleSelectAll}
                        />
                    ) : (
                        /* Existing Card View */
                        <div className="space-y-6">
                            {/* Search and Filters for Card View */}
                            <div className="flex flex-wrap items-center gap-4 p-4 border rounded-xl bg-gray-50 shadow-sm">
                                <div className="flex items-center space-x-2 flex-grow min-w-[200px] sm:min-w-[250px]">
                                    <Search className="h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search by full name..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="flex-grow bg-white"
                                    />
                                </div>
                                <Select value={filterDesignation} onValueChange={setFilterDesignation}>
                                    <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Filter by Role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <Separator />
                                        {uniqueDesignations.map(d => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <Select value={filterClass} onValueChange={setFilterClass}>
                                    <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Filter by Class" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Classes</SelectItem>
                                        <Separator />
                                        {uniqueClasses.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <div className="flex gap-2">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-[120px] bg-white"><SelectValue placeholder="Sort By" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="first_name">Name</SelectItem>
                                            <SelectItem value="id">ID</SelectItem>
                                            <SelectItem value="designation">Role</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="icon" onClick={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))} title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
                                        {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Employee Cards */}
                            {isLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                    <span className="ml-2 text-lg text-gray-600">Retrieving personnel records...</span>
                                </div>
                            ) : processedEmployees.length === 0 ? (
                                <div className="text-center p-10 border rounded-xl bg-white shadow-sm">
                                    <p className="text-xl text-gray-500">No personnel records match the current criteria.</p>
                                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search query or filters.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {processedEmployees.slice((page - 1) * perPage, page * perPage).map(emp => (
                                            <EmployeeCard 
                                                key={emp.id}
                                                employee={emp}
                                                onEdit={handleEdit}
                                                onDelete={handleEmployeeDeletion}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {processedEmployees.length > 0 && (
                                        <div className="flex flex-wrap justify-between items-center mt-6 p-4 border-t pt-4">
                                            <p className="text-sm text-gray-600">
                                                Showing {Math.min(processedEmployees.length, (page - 1) * perPage + 1)} to {Math.min(processedEmployees.length, page * perPage)} of {processedEmployees.length} filtered records.
                                            </p>
                                            <div className="flex gap-2 items-center">
                                                <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                                    &larr; Previous
                                                </Button>
                                                <span className="px-3 py-1 text-sm border rounded-full font-medium bg-white shadow-sm">
                                                    Page {page} / {Math.ceil(processedEmployees.length / perPage)}
                                                </span>
                                                <Button variant="outline" onClick={() => setPage(p => Math.min(Math.ceil(processedEmployees.length / perPage), p + 1))} disabled={page === Math.ceil(processedEmployees.length / perPage)}>
                                                    Next &rarr;
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DepartmentDistributionChart employees={employees} />
                        <EmployeeClassChart employees={employees} />
                        <QualificationAnalysis employees={employees} />
                        <PerformanceMetrics employees={employees} />
                    </div>
                </TabsContent>

                {/* Enhanced Visualizations Tab */}
                <TabsContent value="visualizations" className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Original Visualizations */}
                        <DepartmentDistributionChart employees={employees} />
                        <EmployeeClassChart employees={employees} />
                        <QualificationAnalysis employees={employees} />
                        <PerformanceMetrics employees={employees} />
                        
                        {/* NEW Enhanced Visualizations */}
                        <TenureDistributionChart employees={employees} />
                        <EmployeeGrowthTimeline employees={employees} />
                        <SkillsHeatmap employees={employees} />
                        <PerformanceScorecard employees={employees} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}