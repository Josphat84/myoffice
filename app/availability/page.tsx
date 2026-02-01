// app/availability/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  ToolCase, 
  AlertTriangle, 
  BarChart3, 
  Calendar, 
  Download, 
  Filter, 
  Gauge, 
  LineChart, 
  Plus, 
  RefreshCw, 
  Search, 
  Settings,
  Clock,
  Activity,
  Percent,
  Calculator,
  CalendarClock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Equipment {
  id: string;
  name: string;
  category: string;
  department: string;
  operationalHours: number;
  breakdownHours: number;
  availability: number;
  status: 'operational' | 'maintenance' | 'breakdown' | 'idle';
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  uptime: number;
  downtime: number;
  mtbf: number;
  mttr: number;
}

interface AvailabilityStats {
  totalEquipment: number;
  operational: number;
  inMaintenance: number;
  inBreakdown: number;
  overallAvailability: number;
  avgUptime: number;
  avgDowntime: number;
  totalOperationalHours: number;
  totalBreakdownHours: number;
  monthAvailability: number;
  weekAvailability: number;
}

export default function AvailabilitiesPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [stats, setStats] = useState<AvailabilityStats>({
    totalEquipment: 0,
    operational: 0,
    inMaintenance: 0,
    inBreakdown: 0,
    overallAvailability: 0,
    avgUptime: 0,
    avgDowntime: 0,
    totalOperationalHours: 0,
    totalBreakdownHours: 0,
    monthAvailability: 0,
    weekAvailability: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // Mock data for fallback
  const mockEquipment: Equipment[] = [
    {
      id: "1",
      name: "CNC Machine 1",
      category: "Machinery",
      department: "Production",
      operationalHours: 450.5,
      breakdownHours: 12.3,
      availability: 97.27,
      status: "operational",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-02-15",
      uptime: 438.2,
      downtime: 12.3,
      mtbf: 120.5,
      mttr: 2.5
    },
    {
      id: "2",
      name: "Forklift A",
      category: "Vehicles",
      department: "Logistics",
      operationalHours: 320.0,
      breakdownHours: 8.5,
      availability: 97.34,
      status: "operational",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      uptime: 311.5,
      downtime: 8.5,
      mtbf: 85.3,
      mttr: 3.2
    },
    {
      id: "3",
      name: "3D Printer",
      category: "Electronics",
      department: "R&D",
      operationalHours: 280.0,
      breakdownHours: 24.0,
      availability: 91.43,
      status: "maintenance",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-03-20",
      uptime: 256.0,
      downtime: 24.0,
      mtbf: 65.7,
      mttr: 6.5
    },
    {
      id: "4",
      name: "Laser Cutter",
      category: "Machinery",
      department: "Production",
      operationalHours: 500.0,
      breakdownHours: 2.5,
      availability: 99.5,
      status: "operational",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-03-05",
      uptime: 497.5,
      downtime: 2.5,
      mtbf: 180.2,
      mttr: 1.8
    },
    {
      id: "5",
      name: "Test Equipment",
      category: "Tools",
      department: "Quality",
      operationalHours: 150.0,
      breakdownHours: 15.0,
      availability: 90.0,
      status: "breakdown",
      lastMaintenance: "2023-12-15",
      nextMaintenance: "2024-02-15",
      uptime: 135.0,
      downtime: 15.0,
      mtbf: 50.3,
      mttr: 4.2
    },
    {
      id: "6",
      name: "Conveyor Belt",
      category: "Machinery",
      department: "Production",
      operationalHours: 600.0,
      breakdownHours: 30.0,
      availability: 95.0,
      status: "operational",
      lastMaintenance: "2024-01-25",
      nextMaintenance: "2024-02-25",
      uptime: 570.0,
      downtime: 30.0,
      mtbf: 95.7,
      mttr: 3.5
    },
    {
      id: "7",
      name: "Server Rack",
      category: "Electronics",
      department: "IT",
      operationalHours: 720.0,
      breakdownHours: 8.0,
      availability: 98.89,
      status: "idle",
      lastMaintenance: "2024-01-18",
      nextMaintenance: "2024-04-18",
      uptime: 712.0,
      downtime: 8.0,
      mtbf: 200.5,
      mttr: 2.0
    },
    {
      id: "8",
      name: "Air Compressor",
      category: "Machinery",
      department: "Maintenance",
      operationalHours: 400.0,
      breakdownHours: 20.0,
      availability: 95.0,
      status: "maintenance",
      lastMaintenance: "2024-01-30",
      nextMaintenance: "2024-03-30",
      uptime: 380.0,
      downtime: 20.0,
      mtbf: 75.3,
      mttr: 5.2
    }
  ];

  const mockStats: AvailabilityStats = {
    totalEquipment: 8,
    operational: 5,
    inMaintenance: 2,
    inBreakdown: 1,
    overallAvailability: 95.43,
    avgUptime: 410.03,
    avgDowntime: 15.03,
    totalOperationalHours: 3420.5,
    totalBreakdownHours: 120.3,
    monthAvailability: 90.66,
    weekAvailability: 93.52
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching availability data...');
      
      // Try to fetch from API
      const [equipmentRes, statsRes] = await Promise.all([
        fetch('/api/availabilities', {
          headers: {
            'Accept': 'application/json',
          },
        }).catch(() => {
          console.log('Equipment API call failed, using mock data');
          return {
            ok: false,
            json: async () => mockEquipment
          } as Response;
        }),
        fetch('/api/availabilities/stats', {
          headers: {
            'Accept': 'application/json',
          },
        }).catch(() => {
          console.log('Stats API call failed, using mock data');
          return {
            ok: false,
            json: async () => mockStats
          } as Response;
        })
      ]);
      
      let equipmentData: Equipment[];
      let statsData: AvailabilityStats;
      
      // Handle equipment response
      if (equipmentRes.ok) {
        equipmentData = await equipmentRes.json();
        console.log('API Equipment data received:', equipmentData);
      } else {
        console.log('Using mock equipment data');
        equipmentData = mockEquipment;
      }
      
      // Handle stats response
      if (statsRes.ok) {
        statsData = await statsRes.json();
        console.log('API Stats data received:', statsData);
      } else {
        console.log('Using mock stats data');
        statsData = mockStats;
      }
      
      // Ensure data has proper structure
      if (!Array.isArray(equipmentData)) {
        console.error('Invalid equipment data format, using mock data');
        equipmentData = mockEquipment;
      }
      
      // Validate stats structure
      if (typeof statsData !== 'object' || statsData === null) {
        console.error('Invalid stats data format, using mock data');
        statsData = mockStats;
      }
      
      setEquipment(equipmentData);
      setStats(statsData);
      
    } catch (err) {
      console.error('Error in fetchAvailabilities:', err);
      setError('Failed to load availability data. Using mock data instead.');
      
      // Set mock data as fallback
      setEquipment(mockEquipment);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter(equip => {
    const matchesSearch = equip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equip.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equip.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || equip.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || equip.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(equipment.map(e => e.category)));

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-amber-100 text-amber-800';
      case 'breakdown': return 'bg-red-100 text-red-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 95) return 'text-green-600';
    if (availability >= 90) return 'text-amber-600';
    return 'text-red-600';
  };

  const getAvailabilityProgressColor = (availability: number) => {
    if (availability >= 95) return 'bg-green-500';
    if (availability >= 90) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading equipment availabilities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && equipment.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchAvailabilities} variant="outline" className="mb-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Your backend API endpoints:</p>
            <ul className="list-disc list-inside">
              <li>GET /api/availabilities</li>
              <li>GET /api/availabilities/stats</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Gauge className="h-8 w-8 text-indigo-600" />
            Equipment Availabilities
          </h1>
          <p className="text-gray-600 mt-2">
            Track equipment availability by subtracting breakdown hours from operational hours
            <br />
            <span className="text-sm text-indigo-600 font-medium">
              Availability = (Operational Hours - Breakdown Hours) / Operational Hours × 100
            </span>
          </p>
          {error && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-700 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Note: Showing mock data. {error}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={fetchAvailabilities}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button disabled={equipment.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" asChild>
            <Link href="/breakdowns">
              <AlertTriangle className="h-4 w-4 mr-2" />
              View Breakdowns
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overall Availability</p>
                <p className={`text-3xl font-bold ${getAvailabilityColor(stats.overallAvailability)}`}>
                  {stats.overallAvailability.toFixed(1)}%
                </p>
                <div className="mt-2">
                  <Progress value={stats.overallAvailability} className="h-2" />
                </div>
              </div>
              <div className="p-3 rounded-full bg-indigo-50">
                <Percent className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Equipment Status</p>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
                    <p className="text-xs text-gray-500">Operational</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">{stats.inMaintenance}</p>
                    <p className="text-xs text-gray-500">Maintenance</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.inBreakdown}</p>
                    <p className="text-xs text-gray-500">Breakdown</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Uptime/Downtime</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgUptime.toFixed(1)}h</p>
                <p className="text-sm text-gray-500">Avg Uptime</p>
                <p className="text-lg font-medium text-red-600">{stats.avgDowntime.toFixed(1)}h</p>
                <p className="text-sm text-gray-500">Avg Downtime</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Breakdown Impact</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBreakdownHours.toFixed(0)}h</p>
                <p className="text-sm text-gray-500">Total Downtime</p>
                <p className="text-lg font-medium text-gray-700">
                  {stats.totalOperationalHours > 0 
                    ? ((stats.totalBreakdownHours / stats.totalOperationalHours) * 100).toFixed(1)
                    : '0.0'}%
                </p>
                <p className="text-sm text-gray-500">of Operational Time</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium">Search Equipment</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={equipment.length === 0}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={equipment.length === 0}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter} disabled={equipment.length === 0}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="breakdown">Breakdown</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                {equipment.length} equipment found
                {filteredEquipment.length !== equipment.length && (
                  <span className="text-indigo-600 ml-2">
                    ({filteredEquipment.length} filtered)
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="overview">Availability Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Availability Dashboard</CardTitle>
              <CardDescription>
                Real-time availability tracking across all equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {equipment.length === 0 ? (
                <div className="text-center py-12">
                  <Gauge className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Equipment Data</h3>
                  <p className="text-gray-500 mb-6">
                    Add equipment and breakdown data to start tracking availabilities
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild>
                      <Link href="/equipment/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Equipment
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/breakdowns/new">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Breakdown
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Operational Hours</TableHead>
                        <TableHead>Breakdown Hours</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead>Downtime</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEquipment.map((equip) => (
                        <TableRow key={equip.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <ToolCase className="h-4 w-4 text-gray-500" />
                              {equip.name}
                            </div>
                          </TableCell>
                          <TableCell>{equip.category}</TableCell>
                          <TableCell>{equip.department}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(equip.status)}>
                              {equip.status.charAt(0).toUpperCase() + equip.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{equip.operationalHours.toFixed(1)}h</TableCell>
                          <TableCell className="text-red-600 font-medium">
                            {equip.breakdownHours.toFixed(1)}h
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${getAvailabilityColor(equip.availability)}`}>
                                {equip.availability.toFixed(1)}%
                              </span>
                              <Progress 
                                value={equip.availability} 
                                className={`h-2 w-24 ${getAvailabilityProgressColor(equip.availability)}`}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {equip.uptime.toFixed(1)}h
                          </TableCell>
                          <TableCell className="text-red-600 font-medium">
                            {equip.downtime.toFixed(1)}h
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/breakdowns?equipment=${equip.id}`}>
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Breakdowns
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/maintenance?equipment=${equip.id}`}>
                                  <Settings className="h-3 w-3 mr-1" />
                                  Maintenance
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Availability Analysis</CardTitle>
              <CardDescription>
                In-depth metrics including MTBF, MTTR, and maintenance schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {equipment.length === 0 ? (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No equipment data available for detailed analysis</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>MTBF (Hours)</TableHead>
                        <TableHead>MTTR (Hours)</TableHead>
                        <TableHead>Last Maintenance</TableHead>
                        <TableHead>Next Maintenance</TableHead>
                        <TableHead>Breakdown Frequency</TableHead>
                        <TableHead>Cost Impact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEquipment.map((equip) => {
                        const breakdownFrequency = equip.breakdownHours > 0 
                          ? (equip.breakdownHours / equip.operationalHours * 100).toFixed(1)
                          : '0.0';
                        const costImpact = (equip.downtime * 250).toLocaleString(); // Assuming $250/hour cost
                        
                        return (
                          <TableRow key={equip.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <ToolCase className="h-4 w-4 text-gray-500" />
                                {equip.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={equip.mtbf > 200 ? "default" : equip.mtbf > 100 ? "outline" : "destructive"}>
                                {equip.mtbf.toFixed(1)}h
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={equip.mttr < 5 ? "default" : equip.mttr < 10 ? "outline" : "destructive"}>
                                {equip.mttr.toFixed(1)}h
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                {formatDate(equip.lastMaintenance)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CalendarClock className="h-3 w-3 text-blue-500" />
                                {formatDate(equip.nextMaintenance)}
                              </div>
                            </TableCell>
                            <TableCell>{breakdownFrequency}%</TableCell>
                            <TableCell className="font-medium text-red-600">
                              ${costImpact}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          {equipment.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Trend Data Available</h3>
                  <p className="text-gray-500">
                    Add equipment and breakdown data to see availability trends over time
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Trends</CardTitle>
                  <CardDescription>Monthly availability performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
                      <p className="text-gray-500">Availability trend chart</p>
                      <p className="text-sm text-indigo-600 mt-2 font-medium">
                        Current Overall: {stats.overallAvailability.toFixed(1)}%
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Month:</span>
                          <span className="font-medium">{stats.monthAvailability.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Week:</span>
                          <span className="font-medium">{stats.weekAvailability.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Department Comparison</CardTitle>
                  <CardDescription>Availability by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(equipment.map(e => e.department))).map(dept => {
                      const deptEquipment = equipment.filter(e => e.department === dept);
                      const deptAvailability = deptEquipment.length > 0
                        ? deptEquipment.reduce((sum, e) => sum + e.availability, 0) / deptEquipment.length
                        : 0;
                      
                      return (
                        <div key={dept} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{dept}</span>
                              <span className={`text-sm font-bold ${getAvailabilityColor(deptAvailability)}`}>
                                {deptAvailability.toFixed(1)}%
                              </span>
                            </div>
                            <Progress 
                              value={deptAvailability} 
                              className={`h-2 ${getAvailabilityProgressColor(deptAvailability)}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Bottom Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
        <div className="text-sm text-gray-500">
          Showing {filteredEquipment.length} of {equipment.length} equipment
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/equipment">
              <ToolCase className="h-4 w-4 mr-2" />
              Manage Equipment
            </Link>
          </Button>
          <Button asChild>
            <Link href="/breakdowns/new">
              <Plus className="h-4 w-4 mr-2" />
              Report Breakdown
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reports/availability">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}