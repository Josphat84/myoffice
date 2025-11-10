//app/compressors/page.js
//Compressor Readings Management System


'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  Settings,
  Filter,
  Search,
  BarChart3,
  Moon,
  Sun,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Gauge,
  HardDrive,
  Power,
  Activity,
  FileText,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';

// Initial compressors data
const INITIAL_COMPRESSORS = [
  { id: 1, name: 'Compressor #1', model: 'Atlas Copco GA37', capacity: '37 kW', status: 'running', location: 'Main Plant', color: 'bg-blue-500' },
  { id: 2, name: 'Compressor #2', model: 'Ingersoll Rand SSR EP75', capacity: '75 kW', status: 'standby', location: 'Main Plant', color: 'bg-purple-500' },
  { id: 3, name: 'Compressor #3', model: 'Kaeser SIGMA 45', capacity: '45 kW', status: 'maintenance', location: 'Auxiliary', color: 'bg-green-500' },
  { id: 4, name: 'Compressor #4', model: 'Sullair 900HD', capacity: '90 kW', status: 'running', location: 'Production', color: 'bg-pink-500' },
  { id: 5, name: 'Compressor #5', model: 'Atlas Copco GA15', capacity: '15 kW', status: 'standby', location: 'Workshop', color: 'bg-orange-500' },
  { id: 6, name: 'Compressor #6', model: 'Ingersoll Rand 30HP', capacity: '22 kW', status: 'running', location: 'Main Plant', color: 'bg-red-500' },
  { id: 7, name: 'Compressor #7', model: 'Kaeser CSD 75', capacity: '75 kW', status: 'standby', location: 'Production', color: 'bg-yellow-500' },
  { id: 8, name: 'Compressor #8', model: 'Sullair 185', capacity: '18.5 kW', status: 'running', location: 'Auxiliary', color: 'bg-indigo-500' },
  { id: 9, name: 'Compressor #9', model: 'Atlas Copco ZT55', capacity: '55 kW', status: 'maintenance', location: 'Main Plant', color: 'bg-teal-500' },
  { id: 10, name: 'Compressor #10', model: 'Ingersoll Rand 125', capacity: '125 kW', status: 'running', location: 'Production', color: 'bg-cyan-500' }
];

// Status types
const STATUS_TYPES = {
  RUNNING: 'running',
  STANDBY: 'standby',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline'
};

const STATUS_CONFIG = {
  [STATUS_TYPES.RUNNING]: { label: 'Running', color: 'bg-green-100 text-green-800', icon: Activity },
  [STATUS_TYPES.STANDBY]: { label: 'Standby', color: 'bg-blue-100 text-blue-800', icon: Power },
  [STATUS_TYPES.MAINTENANCE]: { label: 'Maintenance', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  [STATUS_TYPES.OFFLINE]: { label: 'Offline', color: 'bg-red-100 text-red-800', icon: XCircle }
};

// Location options
const LOCATIONS = ['Main Plant', 'Production', 'Auxiliary', 'Workshop', 'Storage'];

const CompressorReadingsSystem = () => {
  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [compressors, setCompressors] = useState([]);
  const [readings, setReadings] = useState({});
  const [activeTab, setActiveTab] = useState('daily-view');
  const [settings, setSettings] = useState({
    darkMode: false,
    showInactive: true,
    autoCalculate: true
  });
  const [filters, setFilters] = useState({
    location: 'all',
    status: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize component with localStorage data
  useEffect(() => {
    setIsClient(true);
    loadAllData();
  }, []);

  // Load all data from localStorage
  const loadAllData = () => {
    try {
      setIsLoading(true);
      
      // Load compressors
      const savedCompressors = localStorage.getItem('compressors-data');
      if (savedCompressors) {
        setCompressors(JSON.parse(savedCompressors));
      } else {
        setCompressors(INITIAL_COMPRESSORS);
        localStorage.setItem('compressors-data', JSON.stringify(INITIAL_COMPRESSORS));
      }

      // Load readings
      const savedReadings = localStorage.getItem('compressor-readings');
      setReadings(savedReadings ? JSON.parse(savedReadings) : {});

      // Load settings
      const savedSettings = localStorage.getItem('compressor-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // Generate sample readings if none exist
      if (!savedReadings) {
        generateSampleReadings();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Initialize with default data
      setCompressors(INITIAL_COMPRESSORS);
      setReadings({});
      generateSampleReadings();
    } finally {
      setIsLoading(false);
    }
  };

  // Generate sample readings for demonstration
  const generateSampleReadings = () => {
    const sampleReadings = {};
    const today = new Date();
    
    // Generate data for last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      sampleReadings[dateStr] = {};
      
      INITIAL_COMPRESSORS.forEach(compressor => {
        const runningHours = Math.floor(Math.random() * 12) + 4;
        const loadedHours = Math.floor(Math.random() * runningHours * 0.8) + (runningHours * 0.2);
        const efficiency = (loadedHours / runningHours * 100).toFixed(1);
        
        sampleReadings[dateStr][compressor.id] = {
          runningHours: runningHours,
          loadedHours: loadedHours,
          efficiency: parseFloat(efficiency),
          pressure: (Math.random() * 20 + 80).toFixed(1),
          temperature: (Math.random() * 10 + 60).toFixed(1),
          notes: i === 0 ? 'Normal operation' : 'Historical data'
        };
      });
    }
    
    setReadings(sampleReadings);
    localStorage.setItem('compressor-readings', JSON.stringify(sampleReadings));
  };

  // Save data to localStorage
  const saveData = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
      toast.error('Failed to save changes');
    }
  }, []);

  // Save compressors
  const saveCompressors = useCallback((newCompressors) => {
    setCompressors(newCompressors);
    saveData('compressors-data', newCompressors);
  }, [saveData]);

  // Save readings
  const saveReadings = useCallback((newReadings) => {
    setReadings(newReadings);
    saveData('compressor-readings', newReadings);
  }, [saveData]);

  // Save settings
  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    saveData('compressor-settings', newSettings);
  }, [saveData]);

  // Get current date string
  const getCurrentDateStr = useCallback(() => {
    return currentDate.toISOString().split('T')[0];
  }, [currentDate]);

  // Navigate dates
  const previousDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const nextDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  // Get reading for a compressor on current date
  const getReading = useCallback((compressorId) => {
    const dateStr = getCurrentDateStr();
    const dayReadings = readings[dateStr] || {};
    const reading = dayReadings[compressorId];
    
    if (!reading) {
      return {
        runningHours: 0,
        loadedHours: 0,
        efficiency: 0,
        pressure: '0.0',
        temperature: '0.0',
        notes: ''
      };
    }
    
    return reading;
  }, [readings, getCurrentDateStr]);

  // Update reading for a compressor
  const updateReading = useCallback((compressorId, field, value) => {
    const dateStr = getCurrentDateStr();
    setReadings(prev => {
      const newReadings = {
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          [compressorId]: {
            ...prev[dateStr]?.[compressorId],
            [field]: field === 'runningHours' || field === 'loadedHours' || field === 'efficiency' 
              ? parseFloat(value) || 0 
              : value
          }
        }
      };
      
      // Auto-calculate efficiency if both running and loaded hours are provided
      const reading = newReadings[dateStr]?.[compressorId];
      if (settings.autoCalculate && reading && reading.runningHours > 0 && reading.loadedHours > 0) {
        reading.efficiency = parseFloat(((reading.loadedHours / reading.runningHours) * 100).toFixed(1));
      }
      
      saveReadings(newReadings);
      return newReadings;
    });
  }, [getCurrentDateStr, settings.autoCalculate, saveReadings]);

  // Calculate efficiency
  const calculateEfficiency = useCallback((runningHours, loadedHours) => {
    if (!runningHours || runningHours === 0) return 0;
    return parseFloat(((loadedHours / runningHours) * 100).toFixed(1));
  }, []);

  // Get compressor status based on efficiency
  const getEfficiencyStatus = (efficiency) => {
    if (efficiency >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (efficiency >= 60) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (efficiency >= 40) return { label: 'Fair', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Calculate daily totals
  const calculateDailyTotals = useCallback(() => {
    let totalRunningHours = 0;
    let totalLoadedHours = 0;
    let totalEfficiency = 0;
    let activeCompressors = 0;

    compressors.forEach(compressor => {
      const reading = getReading(compressor.id);
      if (reading.runningHours > 0) {
        totalRunningHours += reading.runningHours;
        totalLoadedHours += reading.loadedHours;
        totalEfficiency += reading.efficiency;
        activeCompressors++;
      }
    });

    const avgEfficiency = activeCompressors > 0 ? totalEfficiency / activeCompressors : 0;

    return {
      totalRunningHours: parseFloat(totalRunningHours.toFixed(1)),
      totalLoadedHours: parseFloat(totalLoadedHours.toFixed(1)),
      avgEfficiency: parseFloat(avgEfficiency.toFixed(1)),
      activeCompressors
    };
  }, [compressors, getReading]);

  // Calculate compressor statistics
  const calculateCompressorStats = useCallback((compressorId) => {
    const compressorReadings = [];
    const today = new Date();
    
    // Get last 7 days of readings
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const reading = readings[dateStr]?.[compressorId];
      
      if (reading) {
        compressorReadings.push(reading);
      }
    }
    
    if (compressorReadings.length === 0) {
      return { avgRunning: 0, avgLoaded: 0, avgEfficiency: 0, totalRunning: 0, totalLoaded: 0 };
    }
    
    const totals = compressorReadings.reduce((acc, reading) => ({
      running: acc.running + reading.runningHours,
      loaded: acc.loaded + reading.loadedHours,
      efficiency: acc.efficiency + reading.efficiency
    }), { running: 0, loaded: 0, efficiency: 0 });
    
    return {
      avgRunning: parseFloat((totals.running / compressorReadings.length).toFixed(1)),
      avgLoaded: parseFloat((totals.loaded / compressorReadings.length).toFixed(1)),
      avgEfficiency: parseFloat((totals.efficiency / compressorReadings.length).toFixed(1)),
      totalRunning: parseFloat(totals.running.toFixed(1)),
      totalLoaded: parseFloat(totals.loaded.toFixed(1))
    };
  }, [readings]);

  // Add new compressor
  const addCompressor = useCallback((compressorData) => {
    const newCompressor = {
      id: Date.now(),
      ...compressorData,
      color: ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500', 'bg-orange-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'][
        Math.floor(Math.random() * 10)
      ]
    };
    
    const newCompressors = [...compressors, newCompressor];
    saveCompressors(newCompressors);
    toast.success(`Compressor ${compressorData.name} added successfully`);
  }, [compressors, saveCompressors]);

  // Update compressor status
  const updateCompressorStatus = useCallback((compressorId, status) => {
    const newCompressors = compressors.map(compressor => 
      compressor.id === compressorId ? { ...compressor, status } : compressor
    );
    saveCompressors(newCompressors);
    toast.success(`Compressor status updated`);
  }, [compressors, saveCompressors]);

  // Delete compressor
  const deleteCompressor = useCallback((compressorId) => {
    const compressor = compressors.find(comp => comp.id === compressorId);
    if (!compressor) return;

    const newCompressors = compressors.filter(comp => comp.id !== compressorId);
    saveCompressors(newCompressors);
    
    // Also remove their readings
    setReadings(prev => {
      const newReadings = { ...prev };
      Object.keys(newReadings).forEach(date => {
        if (newReadings[date][compressorId]) {
          delete newReadings[date][compressorId];
        }
      });
      saveReadings(newReadings);
      return newReadings;
    });
    
    toast.success(`Compressor ${compressor.name} deleted successfully`);
  }, [compressors, saveCompressors, saveReadings]);

  // Generate CSV report
  const generateCSVReport = () => {
    const dateStr = getCurrentDateStr();
    const headers = ['Compressor', 'Model', 'Location', 'Status', 'Running Hours', 'Loaded Hours', 'Efficiency %', 'Pressure (psi)', 'Temperature (°C)', 'Notes'];
    
    const data = compressors.map(compressor => {
      const reading = getReading(compressor.id);
      const statusConfig = STATUS_CONFIG[compressor.status];
      
      return [
        compressor.name,
        compressor.model,
        compressor.location,
        statusConfig.label,
        reading.runningHours,
        reading.loadedHours,
        reading.efficiency,
        reading.pressure,
        reading.temperature,
        reading.notes || 'N/A'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `compressor-readings-${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV report generated successfully');
  };

  // Generate PDF report
  const generatePDFReport = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const dateStr = getCurrentDateStr();
      const dailyTotals = calculateDailyTotals();
      
      // Header
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('COMPRESSOR READINGS REPORT', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Date: ${currentDate.toLocaleDateString()}`, 105, 22, { align: 'center' });
      
      // Summary
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      let yPos = 40;
      
      doc.text('DAILY SUMMARY', 20, yPos);
      doc.text(`Total Running Hours: ${dailyTotals.totalRunningHours}h`, 20, yPos + 8);
      doc.text(`Total Loaded Hours: ${dailyTotals.totalLoadedHours}h`, 20, yPos + 16);
      doc.text(`Average Efficiency: ${dailyTotals.avgEfficiency}%`, 20, yPos + 24);
      doc.text(`Active Compressors: ${dailyTotals.activeCompressors}`, 20, yPos + 32);
      
      yPos += 45;
      
      // Compressor details
      doc.setFontSize(12);
      doc.text('COMPRESSOR READINGS', 20, yPos);
      yPos += 10;
      
      compressors.forEach((compressor, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        const reading = getReading(compressor.id);
        const statusConfig = STATUS_CONFIG[compressor.status];
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(`${compressor.name} - ${compressor.location}`, 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(`Model: ${compressor.model} | Status: ${statusConfig.label}`, 20, yPos + 7);
        doc.text(`Running: ${reading.runningHours}h | Loaded: ${reading.loadedHours}h | Efficiency: ${reading.efficiency}%`, 20, yPos + 14);
        doc.text(`Pressure: ${reading.pressure} psi | Temperature: ${reading.temperature}°C`, 20, yPos + 21);
        
        if (reading.notes) {
          doc.text(`Notes: ${reading.notes}`, 20, yPos + 28);
          yPos += 35;
        } else {
          yPos += 30;
        }
      });

      doc.save(`compressor-readings-${dateStr}.pdf`);
      toast.success('PDF report generated successfully');
    }).catch(error => {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF report');
    });
  };

  // Quick entry for common scenarios
  const quickEntry = useCallback((compressorId, scenario) => {
    const scenarios = {
      'full-shift': { running: 8, loaded: 6.5 },
      'half-shift': { running: 4, loaded: 3.2 },
      'maintenance': { running: 2, loaded: 0.5 },
      'standby': { running: 0, loaded: 0 }
    };
    
    const scenarioData = scenarios[scenario];
    if (scenarioData) {
      updateReading(compressorId, 'runningHours', scenarioData.running);
      updateReading(compressorId, 'loadedHours', scenarioData.loaded);
      updateReading(compressorId, 'pressure', '100.0');
      updateReading(compressorId, 'temperature', '65.0');
      updateReading(compressorId, 'notes', `${scenario.replace('-', ' ')} operation`);
    }
  }, [updateReading]);

  // Status Badge Component
  const StatusBadge = React.memo(({ status }) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;
    
    const IconComponent = config.icon;
    
    return (
      <Badge variant="secondary" className={`text-xs ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  });

  StatusBadge.displayName = 'StatusBadge';

  // Efficiency Badge Component
  const EfficiencyBadge = React.memo(({ efficiency }) => {
    const status = getEfficiencyStatus(efficiency);
    
    return (
      <Badge variant="secondary" className={`text-xs ${status.bg} ${status.color}`}>
        {efficiency}% - {status.label}
      </Badge>
    );
  });

  EfficiencyBadge.displayName = 'EfficiencyBadge';

  // Reading Input Component
  const ReadingInput = React.memo(({ 
    value, 
    onChange, 
    placeholder, 
    disabled,
    type = 'text',
    className = '',
    unit = ''
  }) => {
    return (
      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-8 text-xs pr-8 ${className} ${
            settings.darkMode ? 'bg-slate-700 border-slate-600' : ''
          }`}
        />
        {unit && (
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
            {unit}
          </span>
        )}
      </div>
    );
  });

  ReadingInput.displayName = 'ReadingInput';

  // Compressor Card Component
  const CompressorCard = React.memo(({ compressor, reading, stats }) => {
    const efficiencyStatus = getEfficiencyStatus(reading.efficiency);
    
    return (
      <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${compressor.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{compressor.name}</CardTitle>
                <CardDescription className={settings.darkMode ? 'text-slate-400' : ''}>
                  {compressor.model} • {compressor.location}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={compressor.status} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className={settings.darkMode ? 'bg-slate-800' : ''}>
                  <DialogHeader>
                    <DialogTitle>Compressor Settings</DialogTitle>
                    <DialogDescription>
                      Manage {compressor.name} settings and status
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Status</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => {
                          const IconComponent = config.icon;
                          return (
                            <Button
                              key={statusKey}
                              variant={compressor.status === statusKey ? "default" : "outline"}
                              onClick={() => updateCompressorStatus(compressor.id, statusKey)}
                              className="justify-start"
                            >
                              <IconComponent className="w-4 h-4 mr-2" />
                              {config.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-start"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${compressor.name}? This will also remove all reading data.`)) {
                          deleteCompressor(compressor.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Compressor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Readings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Running Hours</Label>
              <ReadingInput
                value={reading.runningHours}
                onChange={(value) => updateReading(compressor.id, 'runningHours', value)}
                placeholder="0.0"
                type="number"
                step="0.1"
                unit="h"
              />
            </div>
            <div>
              <Label className="text-xs">Loaded Hours</Label>
              <ReadingInput
                value={reading.loadedHours}
                onChange={(value) => updateReading(compressor.id, 'loadedHours', value)}
                placeholder="0.0"
                type="number"
                step="0.1"
                unit="h"
              />
            </div>
            <div>
              <Label className="text-xs">Pressure</Label>
              <ReadingInput
                value={reading.pressure}
                onChange={(value) => updateReading(compressor.id, 'pressure', value)}
                placeholder="0.0"
                type="number"
                step="0.1"
                unit="psi"
              />
            </div>
            <div>
              <Label className="text-xs">Temperature</Label>
              <ReadingInput
                value={reading.temperature}
                onChange={(value) => updateReading(compressor.id, 'temperature', value)}
                placeholder="0.0"
                type="number"
                step="0.1"
                unit="°C"
              />
            </div>
          </div>

          {/* Efficiency Display */}
          <div className={`p-3 rounded-lg border ${efficiencyStatus.bg} ${efficiencyStatus.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Efficiency</div>
                <div className="text-2xl font-bold">{reading.efficiency}%</div>
              </div>
              <TrendingUp className="w-8 h-8 opacity-50" />
            </div>
            <Progress value={reading.efficiency} className="mt-2 h-2" />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => quickEntry(compressor.id, 'full-shift')}
              className="flex-1 text-xs"
            >
              Full Shift
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => quickEntry(compressor.id, 'half-shift')}
              className="flex-1 text-xs"
            >
              Half Shift
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => quickEntry(compressor.id, 'maintenance')}
              className="flex-1 text-xs"
            >
              Maintenance
            </Button>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs">Notes</Label>
            <Input
              value={reading.notes}
              onChange={(e) => updateReading(compressor.id, 'notes', e.target.value)}
              placeholder="Add notes..."
              className={`h-8 text-xs ${settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}`}
            />
          </div>

          {/* Statistics */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 mb-2">7-Day Average</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm font-semibold">{stats.avgRunning}h</div>
                <div className="text-xs text-slate-500">Running</div>
              </div>
              <div>
                <div className="text-sm font-semibold">{stats.avgLoaded}h</div>
                <div className="text-xs text-slate-500">Loaded</div>
              </div>
              <div>
                <div className="text-sm font-semibold">{stats.avgEfficiency}%</div>
                <div className="text-xs text-slate-500">Eff.</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  });

  CompressorCard.displayName = 'CompressorCard';

  // Add Compressor Form Component
  const AddCompressorForm = ({ onAdd, onCancel }) => {
    const [formData, setFormData] = useState({
      name: '',
      model: '',
      capacity: '',
      location: '',
      status: STATUS_TYPES.STANDBY
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.model || !formData.capacity || !formData.location) {
        toast.error('Please fill in all fields');
        return;
      }
      
      onAdd(formData);
      setFormData({
        name: '',
        model: '',
        capacity: '',
        location: '',
        status: STATUS_TYPES.STANDBY
      });
    };

    return (
      <DialogContent className={settings.darkMode ? 'bg-slate-800' : ''}>
        <DialogHeader>
          <DialogTitle>Add New Compressor</DialogTitle>
          <DialogDescription>
            Enter the compressor details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Compressor Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Compressor #11"
              className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Atlas Copco GA45"
              className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              placeholder="45 kW"
              className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select 
              value={formData.location} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
                  <SelectItem key={statusKey} value={statusKey}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add Compressor
            </Button>
          </div>
        </form>
      </DialogContent>
    );
  };

  // Filtered compressors based on search and filters
  const filteredCompressors = useMemo(() => {
    return compressors.filter(compressor => {
      if (filters.location !== 'all' && compressor.location !== filters.location) return false;
      if (filters.status !== 'all' && compressor.status !== filters.status) return false;
      if (filters.search && !compressor.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (!settings.showInactive && compressor.status === STATUS_TYPES.OFFLINE) return false;
      return true;
    });
  }, [compressors, filters, settings.showInactive]);

  const dailyTotals = calculateDailyTotals();
  const currentDateStr = getCurrentDateStr();

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading Compressor Readings System...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-colors ${
      settings.darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Gauge className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Compressor Readings
                </h1>
                <p className="text-slate-600 mt-2">Daily compressor performance tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newSettings = { ...settings, darkMode: !settings.darkMode };
                        setSettings(newSettings);
                        saveSettings(newSettings);
                      }}
                    >
                      {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {settings.darkMode ? 'Light mode' : 'Dark mode'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-6">
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{dailyTotals.totalRunningHours}h</div>
                <div className="text-xs text-slate-500">Total Running</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-green-600">{dailyTotals.totalLoadedHours}h</div>
                <div className="text-xs text-slate-500">Total Loaded</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-purple-600">{dailyTotals.avgEfficiency}%</div>
                <div className="text-xs text-slate-500">Avg Efficiency</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-orange-600">{dailyTotals.activeCompressors}</div>
                <div className="text-xs text-slate-500">Active Units</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-indigo-600">{compressors.length}</div>
                <div className="text-xs text-slate-500">Total Units</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full grid-cols-3 p-1 rounded-lg ${
            settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'
          }`}>
            <TabsTrigger value="daily-view" className="rounded-md">
              <Calendar className="w-4 h-4 mr-2" />
              Daily View
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-md">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="management" className="rounded-md">
              <Settings className="w-4 h-4 mr-2" />
              Management
            </TabsTrigger>
          </TabsList>

          {/* Daily View Tab */}
          <TabsContent value="daily-view">
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={previousDay}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <CardTitle>{currentDate.toLocaleDateString()}</CardTitle>
                    <Button variant="outline" size="sm" onClick={nextDay}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Badge variant="secondary" className={settings.darkMode ? 'bg-slate-700' : ''}>
                      {currentDateStr}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search compressors..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className={`w-48 ${settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}`}
                      />
                    </div>
                    <Select 
                      value={filters.location} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger className={`w-32 ${settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}`}>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {LOCATIONS.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className={`w-32 ${settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
                          <SelectItem key={statusKey} value={statusKey}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Compressor
                        </Button>
                      </DialogTrigger>
                      <AddCompressorForm 
                        onAdd={addCompressor}
                        onCancel={() => {}} 
                      />
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={settings.darkMode ? 'bg-slate-800' : ''}>
                        <DialogHeader>
                          <DialogTitle>Export Options</DialogTitle>
                          <DialogDescription>
                            Choose your preferred export format for {currentDateStr}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Button onClick={generateCSVReport} className="w-full justify-start" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Export to CSV
                          </Button>
                          <Button onClick={generatePDFReport} className="w-full justify-start" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export to PDF
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCompressors.map(compressor => (
                    <CompressorCard
                      key={compressor.id}
                      compressor={compressor}
                      reading={getReading(compressor.id)}
                      stats={calculateCompressorStats(compressor.id)}
                    />
                  ))}
                </div>
                
                {filteredCompressors.length === 0 && (
                  <div className="text-center py-12">
                    <Gauge className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No compressors found</h3>
                    <p className="text-slate-500 mb-4">Try adjusting your filters or add a new compressor.</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Compressor
                        </Button>
                      </DialogTrigger>
                      <AddCompressorForm 
                        onAdd={addCompressor}
                        onCancel={() => {}} 
                      />
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Stats */}
              <div className="lg:col-span-2 space-y-6">
                <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Last 7 days compressor performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Efficiency Distribution */}
                      <div>
                        <h4 className="font-semibold mb-4">Efficiency Distribution</h4>
                        <div className="space-y-3">
                          {compressors.map(compressor => {
                            const stats = calculateCompressorStats(compressor.id);
                            const efficiencyStatus = getEfficiencyStatus(stats.avgEfficiency);
                            
                            return (
                              <div key={compressor.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 ${compressor.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                                    {compressor.name.split('#')[1]}
                                  </div>
                                  <div>
                                    <div className="font-medium">{compressor.name}</div>
                                    <div className="text-xs text-slate-500">{compressor.location}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`font-semibold ${efficiencyStatus.color}`}>
                                    {stats.avgEfficiency}%
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {stats.avgRunning}h / {stats.avgLoaded}h
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Status Overview */}
                      <div>
                        <h4 className="font-semibold mb-4">Status Overview</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => {
                            const count = compressors.filter(comp => comp.status === statusKey).length;
                            const percentage = (count / compressors.length) * 100;
                            const IconComponent = config.icon;
                            
                            return (
                              <div key={statusKey} className={`p-4 rounded-lg border ${config.color} ${settings.darkMode ? 'border-slate-700' : ''}`}>
                                <div className="flex items-center gap-3">
                                  <IconComponent className="w-8 h-8" />
                                  <div>
                                    <div className="text-2xl font-bold">{count}</div>
                                    <div className="text-sm">{config.label}</div>
                                  </div>
                                </div>
                                <Progress value={percentage} className="mt-2 h-2" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights & Actions */}
              <div className="space-y-6">
                <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                  <CardHeader>
                    <CardTitle>Quick Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-200">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-600">Optimal Performance</div>
                        <div className="text-sm text-slate-600">{compressors.filter(c => getEfficiencyStatus(calculateCompressorStats(c.id).avgEfficiency).label === 'Excellent').length} compressors at peak efficiency</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-200">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-semibold text-orange-600">Maintenance Needed</div>
                        <div className="text-sm text-slate-600">{compressors.filter(c => c.status === STATUS_TYPES.MAINTENANCE).length} compressors require attention</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-200">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-600">Weekly Summary</div>
                        <div className="text-sm text-slate-600">Average efficiency: {dailyTotals.avgEfficiency}% across all units</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                  <CardHeader>
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button onClick={generateCSVReport} className="w-full justify-start" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Export Current CSV
                      </Button>
                      <Button onClick={generatePDFReport} className="w-full justify-start" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Current PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-inactive" className="font-semibold">Show Inactive</Label>
                        <div className="text-sm text-slate-500">Display offline compressors</div>
                      </div>
                      <Switch
                        id="show-inactive"
                        checked={settings.showInactive}
                        onCheckedChange={(checked) => {
                          const newSettings = { ...settings, showInactive: checked };
                          setSettings(newSettings);
                          saveSettings(newSettings);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-calculate" className="font-semibold">Auto Calculate</Label>
                        <div className="text-sm text-slate-500">Automatically calculate efficiency</div>
                      </div>
                      <Switch
                        id="auto-calculate"
                        checked={settings.autoCalculate}
                        onCheckedChange={(checked) => {
                          const newSettings = { ...settings, autoCalculate: checked };
                          setSettings(newSettings);
                          saveSettings(newSettings);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                <CardHeader>
                  <CardTitle>Compressor Management</CardTitle>
                  <CardDescription>Manage your compressor fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Compressor
                        </Button>
                      </DialogTrigger>
                      <AddCompressorForm 
                        onAdd={addCompressor}
                        onCancel={() => {}} 
                      />
                    </Dialog>

                    <div className="space-y-3">
                      {compressors.map(compressor => {
                        const stats = calculateCompressorStats(compressor.id);
                        const statusConfig = STATUS_CONFIG[compressor.status];
                        const IconComponent = statusConfig.icon;
                        
                        return (
                          <div key={compressor.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                            settings.darkMode ? 'border-slate-700' : ''
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${compressor.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                                <Gauge className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium">{compressor.name}</div>
                                <div className="text-sm text-slate-500">
                                  {compressor.model} • {compressor.location}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <IconComponent className="w-3 h-3" />
                                  <span className="text-xs">{statusConfig.label}</span>
                                  <span className="text-xs text-slate-500">
                                    • Eff: {stats.avgEfficiency}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${compressor.name}?`)) {
                                  deleteCompressor(compressor.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Backup and system utilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        const allData = {
                          compressors,
                          readings,
                          settings,
                          exportDate: new Date().toISOString()
                        };
                        const dataStr = JSON.stringify(allData, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `compressor-backup-${new Date().toISOString().split('T')[0]}.json`;
                        link.click();
                        toast.success('Backup downloaded successfully');
                      }}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data Backup
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        generateSampleReadings();
                        toast.success('Sample data generated successfully');
                      }}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate Sample Data
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                          localStorage.clear();
                          setCompressors(INITIAL_COMPRESSORS);
                          setReadings({});
                          setSettings({
                            darkMode: false,
                            showInactive: true,
                            autoCalculate: true
                          });
                          generateSampleReadings();
                          toast.success('All data cleared successfully');
                        }
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                  
                  <div className="text-xs text-slate-500 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <p><strong>Total Compressors:</strong> {compressors.length}</p>
                    <p><strong>Total Reading Days:</strong> {Object.keys(readings).length}</p>
                    <p><strong>Data Storage:</strong> Local browser storage</p>
                    <p className="mt-2">Export backups regularly to prevent data loss.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompressorReadingsSystem;