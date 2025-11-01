// app/page.tsx
import Link from "next/link";
import { 
  Users, 
  ToolCase, 
  Building, 
  ArrowRight, 
  BarChart3, 
  Phone, 
  Mail, 
  Shield, 
  Zap, 
  CheckCircle,
  TrendingUp,
  Cpu,
  Settings,
  FileText,
  Menu,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  LogIn,
  UserPlus,
  HardHat, 
  Clock, 
  Gauge, 
  Wrench, 
  Folder, 
  CalendarCheck, 
  Drill,      
  FileBadge,  
  Award,      
  Calendar,
  Calculator,
  FilePieChart,
  Briefcase,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define types for our data structures
type ColorType = 'indigo' | 'cyan' | 'green' | 'amber' | 'blue' | 'purple';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
}

interface ModuleItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: ColorType;
  checks: string[];
  link?: string;
  stats: string;
  buttonText: string;
}

async function getSystemStats() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://myofficebackend.onrender.com';
    
    // Fetch actual overtime data
    const overtimeResponse = await fetch(`${API_BASE}/api/overtime/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    let overtimeStats = {
      pendingOvertime: 0,
      approvedOvertime: 0,
      totalOvertimeHours: 0,
      monthlyOvertime: 0
    };

    if (overtimeResponse.ok) {
      overtimeStats = await overtimeResponse.json();
    }

    // Fetch employees count
    const employeesResponse = await fetch(`${API_BASE}/api/employees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    let employeeCount = 0;
    if (employeesResponse.ok) {
      const employees = await employeesResponse.json();
      employeeCount = employees.length;
    }

    // Fetch equipment count
    const equipmentResponse = await fetch(`${API_BASE}/api/equipment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    let equipmentCount = 0;
    if (equipmentResponse.ok) {
      const equipment = await equipmentResponse.json();
      equipmentCount = equipment.length;
    }

    // Fetch other system stats
    const systemResponse = await fetch(`${API_BASE}/api/system/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    let systemStats = {
      operationalRate: 0,
      operationalEquipment: 0,
      departments: 0,
      safetyIncidents: 0,
      openWorkOrders: 0,
      scheduledMaintenance: 0,
      monthlyReports: 0,
    };

    if (systemResponse.ok) {
      systemStats = await systemResponse.json();
    }

    return {
      ...systemStats,
      employeeCount,
      equipmentCount,
      pendingOvertime: overtimeStats.pendingOvertime,
      approvedOvertime: overtimeStats.approvedOvertime,
      totalOvertimeHours: overtimeStats.totalOvertimeHours,
      monthlyOvertime: overtimeStats.monthlyOvertime
    };

  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback data
    return {
      employeeCount: 125,
      equipmentCount: 78,
      operationalRate: 86,
      operationalEquipment: 67,
      departments: 8,
      safetyIncidents: 1,
      openWorkOrders: 15,
      scheduledMaintenance: 8,
      pendingOvertime: 5,
      approvedOvertime: 12,
      totalOvertimeHours: 245,
      monthlyOvertime: 89,
      monthlyReports: 23,
    };
  }
}

// Mobile Navigation Component
function MobileNav() {
  return (
    <div className="md:hidden">
      <details className="dropdown dropdown-end">
        <summary className="btn btn-ghost btn-circle text-foreground">
          <Menu className="h-6 w-6" />
        </summary>
        <ul className="dropdown-content menu p-4 shadow-xl bg-card border border-border rounded-lg w-52 mt-4 space-y-2 text-foreground">
          <li><Link href="/" className="hover:text-primary font-semibold">Home</Link></li>
          <li><Link href="/employees" className="hover:text-primary">Personnel</Link></li>
          <li><Link href="/equipment" className="hover:text-primary">Assets</Link></li>
          <li><Link href="/overtime" className="hover:text-primary">Overtime</Link></li>
          <li><Link href="/reports" className="hover:text-primary">Reports</Link></li>
          <li><Link href="#operational-modules" className="hover:text-primary">Modules</Link></li>
          <li className="border-t border-border my-2"></li>
          <li><Link href="/login" className="flex items-center gap-2 hover:text-primary">
            <LogIn className="h-4 w-4" />
            Login
          </Link></li>
          <li><Link href="/signup" className="flex items-center gap-2 hover:text-primary">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Link></li>
        </ul>
      </details>
    </div>
  );
}

export default async function Home() {
  const stats = await getSystemStats();

  // Stats items with actual overtime data
  const statItems: StatItem[] = [
    {
      label: "Total Personnel",
      value: stats.employeeCount,
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Total Assets",
      value: stats.equipmentCount,
      icon: ToolCase,
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      label: "Operational Rate",
      value: `${stats.operationalRate}%`,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Pending Overtime",
      value: stats.pendingOvertime,
      icon: Calculator,
      color: "text-amber-600 dark:text-amber-400",
      subtitle: `${stats.approvedOvertime} approved this month`
    },
  ];

  // Core Management Modules - Only Overtime, Personnel, and Assets
  const coreModules: ModuleItem[] = [
    { 
      icon: Users, 
      title: "Personnel", 
      description: "Comprehensive employee profiles and team management with department structure and role management.", 
      color: "indigo", 
      checks: ["Department Structure", "Role Management", "Contact Info", "Reporting"],
      link: "/employees",
      stats: `${stats.employeeCount} Active`,
      buttonText: "Manage Personnel"
    },
    { 
      icon: ToolCase, 
      title: "Assets", 
      description: "Track equipment, maintenance, and utilization analytics across all company assets.", 
      color: "cyan", 
      checks: ["Maintenance Tracking", "Utilization Analytics", "Assignment Log", "Status Monitoring"],
      link: "/equipment",
      stats: `${stats.equipmentCount} Assets`,
      buttonText: "Manage Assets"
    },
    { 
      icon: Calculator, 
      title: "Overtime", 
      description: "Track, approve, and manage employee overtime requests with automated calculations and compliance tracking.", 
      color: "purple", 
      checks: ["Request Approval", "Payroll Integration", "Compliance Tracking", "Reporting"],
      link: "/overtime",
      stats: `${stats.pendingOvertime} Pending`,
      buttonText: "Manage Overtime"
    }
  ];

  // Engineering & Operational Support Modules
  const operationalModules: ModuleItem[] = [
    // Engineering Modules
    { 
      icon: BarChart3, 
      title: "Operational Visualization", 
      description: "Rich, interactive dashboards for real-time data monitoring of production, safety, and asset health.", 
      color: "indigo", 
      checks: ["Custom Dashboards", "KPI Tracking"],
      stats: "Live Data",
      buttonText: "View Dashboards"
    }, 
    { 
      icon: Calendar, 
      title: "Scheduled Maintenance", 
      description: "Proactive scheduling and tracking of mandatory preventative maintenance tasks and asset inspections.", 
      color: "blue", 
      checks: ["PM Planner", "Task Assignment"],
      stats: `${stats.scheduledMaintenance} Scheduled`,
      buttonText: "Schedule Maintenance"
    }, 
    { 
      icon: Gauge, 
      title: "Meter Readings", 
      description: "Log and monitor utility and machine meter readings to optimize resource consumption and maintenance scheduling.", 
      color: "cyan", 
      checks: ["Usage History", "Alert Setup"],
      stats: "Daily Updates",
      buttonText: "Record Readings"
    }, 
    { 
      icon: Wrench, 
      title: "Machine Availability", 
      description: "Real-time visibility into machine status, utilization rates, and scheduled downtimes for maintenance.", 
      color: "cyan", 
      checks: ["Utilization Rate", "Downtime Schedule"],
      stats: `${stats.operationalEquipment}/${stats.equipmentCount} Available`,
      buttonText: "Check Availability"
    }, 
    { 
      icon: Drill, 
      title: "Tool Crib Inventory", 
      description: "Manage tool checkout, stock levels, calibration schedules, and replacement costs for engineering equipment.", 
      color: "amber", 
      checks: ["Stock Control", "Calibration Alerts"],
      stats: "500+ Tools",
      buttonText: "Manage Tools"
    }, 
    { 
      icon: FileBadge, 
      title: "Permit-to-Work (PTW)", 
      description: "Digital PTW system for high-risk work: review, approval, tracking, and close-out of required permits.", 
      color: "cyan", 
      checks: ["Digital Sign-off", "Conflict Check"],
      stats: "Active Permits",
      buttonText: "Manage Permits"
    },
    
    // Operational Support Modules
    { 
      icon: Shield, 
      title: "SHEQ Management", 
      description: "Track incidents, manage inspections, report non-conformities, and handle environmental compliance documents.", 
      color: "blue", 
      checks: ["Incident Reporting", "Inspection Forms"],
      stats: `${stats.safetyIncidents} Incidents`,
      buttonText: "Manage Safety"
    },
    { 
      icon: Clock, 
      title: "Duty & Standby Roster", 
      description: "Manage shift schedules, allocate standby teams, and ensure coverage for critical operational periods.", 
      color: "amber", 
      checks: ["Shift Rotation", "Contact Lists"],
      stats: "24/7 Coverage",
      buttonText: "Manage Roster"
    }, 
    { 
      icon: Award, 
      title: "Training & Certification", 
      description: "Track mandatory employee certifications, expiry dates, and required refresher courses for compliance.", 
      color: "purple", 
      checks: ["Expiry Alerts", "Compliance Reports"],
      stats: "Certification Tracking",
      buttonText: "Manage Training"
    }, 
    { 
      icon: Folder, 
      title: "Centralized Documents", 
      description: "Securely store all company policies, compliance documents, and operational manuals in one accessible location.", 
      color: "indigo", 
      checks: ["Secure Storage", "Version Control"],
      stats: `${stats.monthlyReports} Documents`,
      buttonText: "Access Documents"
    }, 
    { 
      icon: HardHat, 
      title: "PPE Management", 
      description: "Track issue dates, replacement schedules, and mandatory training for all Personal Protective Equipment.", 
      color: "purple", 
      checks: ["Issue Tracking", "Training Logs"],
      stats: "Safety Compliance",
      buttonText: "Manage PPE"
    }, 
    { 
      icon: CalendarCheck, 
      title: "Leave Tracker", 
      description: "Manage employee vacation, sick leave, and holidays with integrated approval and balance tracking.", 
      color: "green", 
      checks: ["Balance View", "Request Approval"],
      stats: "Leave Management",
      buttonText: "Track Leave"
    },
    { 
      icon: FilePieChart, 
      title: "Reports & Analytics", 
      description: "Generate comprehensive reports, export data, and analyze trends across all operational modules.", 
      color: "indigo", 
      checks: ["Custom Reports", "Data Export"],
      stats: `${stats.monthlyReports} Reports`,
      buttonText: "Generate Reports"
    },
    { 
      icon: Briefcase, 
      title: "Job Allocation", 
      description: "Assign and track tasks, monitor progress, and manage team workloads with priority-based job allocation system.", 
      color: "blue", 
      checks: ["Task Assignment", "Progress Tracking", "Priority Management"],
      stats: `${stats.openWorkOrders} Active Jobs`,
      buttonText: "Allocate Jobs"
    },
    { 
      icon: MessageSquare, 
      title: "Notice Board", 
      description: "Share important announcements, company updates, and critical information with all team members in real-time.", 
      color: "green", 
      checks: ["Announcements", "Priority Alerts", "Archive Management"],
      stats: "Real-time Updates",
      buttonText: "View Notices"
    },
  ];

  // Utility function to get the correct button style based on feature color
  const getButtonStyle = (color: ColorType) => {
    const colorMap: Record<ColorType, string> = {
      indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30",
      cyan: "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/30",
      green: "bg-green-600 hover:bg-green-700 shadow-green-500/30",
      amber: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/30",
      blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30", 
      purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/30",
    };
    return `${colorMap[color] || colorMap.indigo} text-white`; 
  }

  // Utility function for icon box background color
  const getIconBgStyle = (color: ColorType) => {
    const bgMap: Record<ColorType, string> = {
      indigo: "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
      cyan: "bg-cyan-50 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400",
      green: "bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400",
      amber: "bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
      blue: "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400", 
      purple: "bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    };
    return bgMap[color] || bgMap.indigo;
  }
  
  // Utility function for check mark color
  const getCheckColor = (color: ColorType) => {
    const checkMap: Record<ColorType, string> = {
      indigo: "text-indigo-500",
      cyan: "text-cyan-500",
      green: "text-green-500",
      amber: "text-amber-500",
      blue: "text-blue-500",
      purple: "text-purple-500",
    };
    return checkMap[color] || checkMap.indigo;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      
      {/* Header with Overtime navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-foreground">Positive Software</span>
                <span className="text-xs text-primary font-semibold uppercase tracking-wider hidden sm:inline-block">Office Management</span>
              </div>
            </div>
            
            {/* Desktop Navigation with Overtime */}
            <nav className="hidden md:flex items-center gap-7">
              <Link href="/" className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                Home
              </Link>
              <Link href="/employees" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Personnel
              </Link>
              <Link href="/equipment" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Assets
              </Link>
              <Link href="/overtime" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Overtime
              </Link>
              <Link href="/reports" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Reports
              </Link>
              <Link href="#operational-modules" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Modules
              </Link>
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button size="sm" className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-lg shadow-indigo-600/30 dark:shadow-indigo-700/50" asChild>
                <Link href="/signup">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative py-16 md:py-28 overflow-hidden text-white" 
          style={{ 
            backgroundImage: `url('image_cba59d.jpg')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] z-0"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <Badge 
                variant="outline" 
                className="mb-4 px-3 py-1 sm:px-4 sm:py-2 text-sm font-semibold bg-white/10 text-indigo-200 border-indigo-400/50 backdrop-blur-sm shadow-inner"
              >
                <Zap className="mr-2 h-4 w-4 text-cyan-300" />
                Trusted by {stats.employeeCount}+ active users
              </Badge>
              
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-snug mb-3 drop-shadow-xl text-white">
                The Integrated Platform for 
                <span className="block mt-1">
                  Modern Mine Operations
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8"> 
                Unify your team and assets effortlessly. Achieve peak productivity with our sophisticated management platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-10 sm:h-12 px-6 sm:px-8 gap-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-xl shadow-indigo-600/40" asChild>
                  <Link href="/employees">
                    <Users className="h-5 w-5" />
                    Get Started Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-10 sm:h-12 px-6 sm:px-8 gap-2 text-white border-white/50 hover:bg-white/10 hover:text-white" asChild>
                  <Link href="/overtime">
                    <Calculator className="h-5 w-5" />
                    Track Overtime
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview with Overtime */}
        <section className="py-10 md:py-12 bg-background border-b border-border"> 
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"> 
              {statItems.map((item, index) => (
                <Card 
                  key={index} 
                  className={`border border-border shadow-md transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500/50 cursor-pointer`} 
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2"> 
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider"> 
                      {item.label}
                    </CardTitle>
                    <item.icon className={`h-4 w-4 ${item.color} transition-transform group-hover:scale-110`} /> 
                  </CardHeader>
                  <CardContent className="p-4 pt-0"> 
                    <div className="text-2xl font-extrabold text-foreground"> 
                      {item.value}
                    </div>
                    {item.label === "Operational Rate" && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {stats.operationalEquipment} assets operational
                      </p>
                    )}
                    {item.label === "Pending Overtime" && item.subtitle && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {item.subtitle}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Management Modules - Only Overtime, Personnel, and Assets */}
        <section className="py-16 md:py-28 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                Core Management Modules
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Essential tools for managing your workforce, assets, and overtime operations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {coreModules.map((module, index) => (
                <Card 
                  key={index}
                  className="group relative p-1 shadow-2xl bg-gradient-to-br from-background to-card border border-border 
                             transition-all duration-500 hover:border-indigo-500/50 transform hover:-translate-y-1"
                >
                  <CardContent className="p-6 bg-card rounded-lg h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-${module.color}-600 to-${module.color}-700 shadow-xl text-white flex-shrink-0`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-foreground">{module.title}</h3>
                          <Badge className={`bg-${module.color}-500 hover:bg-${module.color}-600 text-white shadow-md text-xs`}>
                            {module.stats}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs text-foreground/80 mb-4 flex-grow">
                      {module.checks.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className={`h-3 w-3 text-${module.color}-500`} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <Button size="sm" className={`w-full gap-2 ${getButtonStyle(module.color)}`} asChild>
                      <Link href={module.link || "#"}>
                        {module.buttonText}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Engineering & Operational Support Modules */}
        <section id="operational-modules" className="py-16 md:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto"> 
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Engineering & Operational Support
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive systems for maintenance, safety, compliance, and operational excellence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {operationalModules.map((feature, index) => (
                  <Card 
                    key={index} 
                    className={`group border border-border bg-card shadow-sm transition-all duration-300 transform hover:shadow-lg hover:border-${feature.color}-500/50`}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 shadow-md ${getIconBgStyle(feature.color)}`}>
                          <feature.icon className="h-5 w-5" /> 
                        </div>
                        <h4 className="font-bold text-foreground text-lg">{feature.title}</h4>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                        {feature.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-foreground/80 mb-6">
                          {feature.checks.map((check, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircle className={`h-4 w-4 ${getCheckColor(feature.color)}`} />
                                <span>{check}</span>
                            </div>
                          ))}
                      </div>

                      <Button 
                        size="sm" 
                        className={`w-full gap-2 ${getButtonStyle(feature.color)}`} 
                        asChild
                      >
                        <Link href={feature.link || "#"}>
                          {feature.buttonText}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-background border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Card className="border border-border bg-card text-foreground shadow-2xl p-1 relative overflow-hidden">
                <CardContent className="p-8 md:p-16 relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-md text-foreground">
                    Take Control of Your Operations
                  </h2>
                  <p className="text-base sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                    Start your free 30-day trial today. No credit card required.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="h-10 sm:h-12 px-6 sm:px-8 gap-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-xl shadow-indigo-600/40" asChild>
                      <Link href="/signup">
                        <UserPlus className="h-5 w-5" />
                        Sign Up Free
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-10 sm:h-12 px-6 sm:px-8 gap-2 text-foreground border-border hover:bg-accent hover:text-primary" asChild>
                      <Link href="/reports">
                        <FilePieChart className="h-5 w-5" />
                        View Sample Reports
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Positive Software Inc</h3>
                  <p className="text-sm text-indigo-400 font-medium">Enterprise Management Solutions</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6 max-w-md">
                Dedicated to providing state-of-the-art software solutions that empower businesses 
                to achieve peak operational efficiency and organization.
              </p>
              
              <div className="flex flex-col space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-indigo-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <span>info@positivesoftware.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-indigo-400">Navigation</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/employees" className="hover:text-white transition-colors">Personnel</Link></li>
                <li><Link href="/equipment" className="hover:text-white transition-colors">Assets</Link></li>
                <li><Link href="/overtime" className="hover:text-white transition-colors">Overtime</Link></li>
                <li><Link href="/reports" className="hover:text-white transition-colors">Reports</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-indigo-400">System Status</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Pending Overtime:</span>
                  <span className="text-white font-medium">{stats.pendingOvertime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approved Overtime:</span>
                  <span className="text-white font-medium">{stats.approvedOvertime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Hours:</span>
                  <span className="text-white font-medium">{stats.totalOvertimeHours}h</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-slate-800">
                  <span className="font-semibold text-white">Overall:</span>
                  <span className="text-green-500 font-bold flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Operational
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-5 mt-6 pt-4 border-t border-slate-800">
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs sm:text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Positive Software Inc. All rights reserved.</p>
            <p className="mt-1">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link> 
              <span className="mx-2">|</span> 
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}