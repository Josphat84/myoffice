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
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getSystemStats() {
  try {
    // NOTE: Replace with actual backend logic
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://myofficebackend.onrender.com';
    
    // Fallback/Mock data if real fetch is skipped or fails (for the purpose of this example)
    return {
      employeeCount: 12, 
      equipmentCount: 7, 
      operationalRate: 86,
      operationalEquipment: 67,
      departments: 8,
      safetyIncidents: 1, 
      openWorkOrders: 15, 
      scheduledMaintenance: 8, 
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
    };
  }
}

// Mobile Navigation Component (Simplified for server component context)
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

  // 1. STATS: Colors unchanged (no red here)
  const statItems = [
    {
      label: "Total Personnel",
      value: stats.employeeCount,
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400", // PRIMARY
    },
    {
      label: "Total Assets",
      value: stats.equipmentCount,
      icon: ToolCase,
      color: "text-cyan-600 dark:text-cyan-400", // SECONDARY
    },
    {
      label: "Operational Rate",
      value: `${stats.operationalRate}%`,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400", // STATUS/ACCENT
    },
    {
      label: "Open Work Orders",
      value: stats.openWorkOrders,
      icon: Wrench,
      color: "text-amber-600 dark:text-amber-400", // WARNING/MAINTENANCE
    },
  ];

  // 2. OPERATIONAL MODULES: RED REMOVED. SHEQ and PTW are now 'blue' and 'cyan'
  const additionalFeatures = [
    // New Modules (Prioritized for Clerk)
    { icon: BarChart3, title: "Operational Visualization", description: "Rich, interactive dashboards for real-time data monitoring of production, safety, and asset health.", color: "indigo", checks: ["Custom Dashboards", "KPI Tracking"] }, 
    { icon: Calendar, title: "Scheduled Maintenance", description: "Proactive scheduling and tracking of mandatory preventative maintenance tasks and asset inspections.", color: "blue", checks: ["PM Planner", "Task Assignment"] }, 
    { icon: Shield, title: "SHEQ Management", description: "Track incidents, manage inspections, report non-conformities, and handle environmental compliance documents.", color: "blue", checks: ["Incident Reporting", "Inspection Forms"] }, // COLOR CHANGED: RED -> BLUE
    { icon: Clock, title: "Duty & Standby Roster", description: "Manage shift schedules, allocate standby teams, and ensure coverage for critical operational periods.", color: "amber", checks: ["Shift Rotation", "Contact Lists"] }, 

    // Existing Modules
    { icon: Gauge, title: "Meter Readings", description: "Log and monitor utility and machine meter readings to optimize resource consumption and maintenance scheduling.", color: "cyan", checks: ["Usage History", "Alert Setup"] }, 
    { icon: Wrench, title: "Machine Availability", description: "Real-time visibility into machine status, utilization rates, and scheduled downtimes for maintenance.", color: "cyan", checks: ["Utilization Rate", "Downtime Schedule"] }, 
    { icon: Drill, title: "Tool Crib Inventory", description: "Manage tool checkout, stock levels, calibration schedules, and replacement costs for engineering equipment.", color: "amber", checks: ["Stock Control", "Calibration Alerts"] }, 
    { icon: FileBadge, title: "Permit-to-Work (PTW)", description: "Digital PTW system for high-risk work: review, approval, tracking, and close-out of required permits.", color: "cyan", checks: ["Digital Sign-off", "Conflict Check"] }, // COLOR CHANGED: RED -> CYAN
    { icon: Award, title: "Training & Certification", description: "Track mandatory employee certifications, expiry dates, and required refresher courses for compliance.", color: "purple", checks: ["Expiry Alerts", "Compliance Reports"] }, 
    { icon: Folder, title: "Centralized Documents", description: "Securely store all company policies, compliance documents, and operational manuals in one accessible location.", color: "indigo", checks: ["Secure Storage", "Version Control"] }, 
    { icon: HardHat, title: "PPE Management", description: "Track issue dates, replacement schedules, and mandatory training for all Personal Protective Equipment.", color: "purple", checks: ["Issue Tracking", "Training Logs"] }, 
    { icon: CalendarCheck, title: "Leave Tracker", description: "Manage employee vacation, sick leave, and holidays with integrated approval and balance tracking.", color: "green", checks: ["Balance View", "Request Approval"] }, 
  ];

  // Utility function to get the correct button style based on feature color
  const getButtonStyle = (color: string) => {
      const colorMap: { [key: string]: string } = {
          indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30",
          cyan: "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/30",
          green: "bg-green-600 hover:bg-green-700 shadow-green-500/30",
          amber: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/30",
          // Red is now mapped to a safer blue for consistency
          blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30", 
          purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/30",
      };
      return `${colorMap[color] || colorMap.indigo} text-white`; 
  }

  // Utility function for icon box background color
  const getIconBgStyle = (color: string) => {
    const bgMap: { [key: string]: string } = {
        indigo: "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
        cyan: "bg-cyan-50 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400",
        green: "bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400",
        amber: "bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        // Red is now mapped to a safer blue for consistency
        blue: "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400", 
        purple: "bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    };
    return bgMap[color] || bgMap.indigo;
  }
  
  // Utility function for check mark color
  const getCheckColor = (color: string) => {
    const checkMap: { [key: string]: string } = {
        indigo: "text-indigo-500",
        cyan: "text-cyan-500",
        green: "text-green-500",
        amber: "text-amber-500",
        // Red is now mapped to a safer blue for consistency
        blue: "text-blue-500",
        purple: "text-purple-500",
    };
    return checkMap[color] || checkMap.indigo;
  }


  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      
      {/* Header (No Change) */}
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
            
            {/* Desktop Navigation */}
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
        {/* Hero Section - REFINED TEXT AND SIZE */}
        <section 
          className="relative py-16 md:py-28 overflow-hidden text-white" 
          style={{ 
            backgroundImage: `url('image_cba59d.jpg')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Darker, professional gradient overlay */}
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
                  <Link href="/equipment">
                    <ToolCase className="h-5 w-5" />
                    View Key Features
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview (No Change) */}
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
                     {item.label === "Open Work Orders" && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {stats.scheduledMaintenance} scheduled maintenance tasks
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Management Modules (Asterisks Removed) */}
        <section className="py-16 md:py-28 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                Core Management Modules
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                The essential tools for running a productive and organized site operation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Employee Management Card - Indigo Primary */}
              <Card 
                className="group relative p-1 shadow-2xl bg-gradient-to-br from-background to-card border border-border 
                           transition-all duration-500 hover:border-indigo-500/50 transform hover:-translate-y-1"
              >
                <CardContent className="p-6 md:p-10 bg-card rounded-lg h-full flex flex-col">
                  <div className="flex items-start gap-4 sm:gap-6 mb-6">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 shadow-xl text-white flex-shrink-0">
                      <Users className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground">Personnel Management</h3>
                        <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-md text-xs sm:text-sm">
                          {stats.employeeCount} Active
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Comprehensive profiles, department structures, and contact management for efficient team oversight.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-foreground/80 mb-6 sm:mb-8 flex-grow">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500" />
                      <span>{stats.departments} Departments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500" />
                      <span>Role & Permissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500" />
                      <span>Profile History</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500" />
                      <span>Reporting Structure</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30" asChild>
                    <Link href="/employees">
                      Access Personnel Directory
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Equipment Management Card - Teal/Cyan Secondary */}
              <Card 
                className="group relative p-1 shadow-2xl bg-gradient-to-br from-background to-card border border-border
                           transition-all duration-500 hover:border-cyan-500/50 transform hover:-translate-y-1"
              >
                <CardContent className="p-6 md:p-10 bg-card rounded-lg h-full flex flex-col">
                  <div className="flex items-start gap-4 sm:gap-6 mb-6">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-700 shadow-xl text-white flex-shrink-0">
                      <ToolCase className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground">Asset Management</h3>
                        <Badge className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-md text-xs sm:text-sm">
                          {stats.equipmentCount} Assets
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Detailed tracking, maintenance logs, and usage analytics to maximize equipment lifespan and efficiency.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-foreground/80 mb-6 sm:mb-8 flex-grow">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-500" />
                      <span>{stats.operationalEquipment} Operational</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-500" />
                      <span>Maintenance Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-500" />
                      <span>Utilization Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-500" />
                      <span>Assignment Log</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="lg" className="w-full gap-2 border-cyan-500 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20" asChild>
                    <Link href="/equipment">
                      View Asset Tracking
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Operational Support Modules - RED REMOVED, ALL BUTTONS VISIBLE */}
        <section id="operational-modules" className="py-16 md:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto"> 
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Engineering & Operational Support
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                  Critical systems for maintenance, safety, compliance, and real-time data visibility.
                </p>
              </div>

              {/* Grid adjusts for mobile: 1 column, then 2, then 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalFeatures.map((feature, index) => (
                  <Card 
                    key={index} 
                    // Using feature.color in the border/hover to give it that primary/secondary hint
                    className={`group border border-border bg-card shadow-sm transition-all duration-300 transform hover:shadow-lg hover:border-${feature.color}-500/50`}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        {/* Icon: Small, distinct icon box - Uses Utility function */}
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 shadow-md ${getIconBgStyle(feature.color)}`}>
                          <feature.icon className="h-5 w-5" /> 
                        </div>
                        
                        {/* Title: uses foreground text */}
                        <h4 className="font-bold text-foreground text-lg">{feature.title}</h4>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                        {feature.description}
                      </p>
                      
                      {/* Quick Actions / Checklist - Uses Utility function for check color */}
                      <div className="space-y-2 text-sm text-foreground/80 mb-6">
                          {feature.checks.map((check, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {/* Checkmark uses the feature color for consistency */}
                                <CheckCircle className={`h-4 w-4 ${getCheckColor(feature.color)}`} />
                                <span>{check}</span>
                            </div>
                          ))}
                      </div>

                      {/* Button - Full width and color-coded. Uses getButtonStyle for guaranteed contrast. */}
                      <Button 
                        size="sm" 
                        className={`w-full gap-2 ${getButtonStyle(feature.color)}`} 
                        asChild
                      >
                        <Link href="#">
                          Launch Module
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

        {/* CTA Section (Asterisks Removed) */}
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
                      <Link href="/login">
                        <LogIn className="h-5 w-5" />
                        Login to Demo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (No Change) */}
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
              
              {/* Contact Info */}
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
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-indigo-400">System Status</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Open Work Orders:</span>
                  <span className="text-white font-medium">{stats.openWorkOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Operational Rate:</span>
                  <span className="text-white font-medium">{stats.operationalRate}%</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-slate-800">
                  <span className="font-semibold text-white">Overall:</span>
                  <span className="text-green-500 font-bold flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Operational
                  </span>
                </div>
              </div>
               {/* Social Links */}
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