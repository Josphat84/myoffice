// components/work-orders/work-orders-form.tsx
'use client';
import React from 'react'
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Download,
  Printer,
  Save,
  FileText,
  Plus,
  Trash2,
  Calculator,
  ArrowLeft,
  Settings,
  Workflow,
  FileCheck
} from "lucide-react";

// Types - Updated to match backend
interface JobType {
  operational: boolean;
  maintenance: boolean;
  mining: boolean;
}

interface ManpowerRow {
  id: string;
  grade: string;
  requiredNumber: string;
  requiredUnitTime: string;
  totalManHours: string;
}

interface WorkOrderFormData {
  toDepartment: string;
  toSection: string;
  dateRaised: string;
  workOrderNumber: string;
  fromDepartment: string;
  fromSection: string;
  timeRaised: string;
  accountNumber: string;
  equipmentInfo: string;
  userLabToday: string;
  jobType: JobType;
  jobRequestDetails: string;
  requestedBy: string;
  authorisingForeman: string;
  authorisingEngineer: string;
  allocatedTo: string;
  estimatedHours: string;
  responsibleForeman: string;
  jobInstructions: string;
  manpower: ManpowerRow[];
  workDoneDetails: string;
  causeOfFailure: string;
  delayDetails: string;
  artisanName: string;
  artisanSign: string;
  artisanDate: string;
  foremanName: string;
  foremanSign: string;
  foremanDate: string;
  timeWorkStarted: string;
  timeWorkFinished: string;
  totalTimeWorked: string;
  overtimeStartTime: string;
  overtimeEndTime: string;
  overtimeHours: string;
  delayFromTime: string;
  delayToTime: string;
  totalDelayHours: string;
}

const INITIAL_FORM_DATA: WorkOrderFormData = {
  toDepartment: '',
  toSection: '',
  dateRaised: new Date().toISOString().split('T')[0],
  workOrderNumber: `WO-${Date.now().toString().slice(-6)}`,
  fromDepartment: '',
  fromSection: '',
  timeRaised: new Date().toTimeString().slice(0, 5),
  accountNumber: '',
  equipmentInfo: '',
  userLabToday: '',
  jobType: {
    operational: false,
    maintenance: false,
    mining: false,
  },
  jobRequestDetails: '',
  requestedBy: '',
  authorisingForeman: '',
  authorisingEngineer: '',
  allocatedTo: '',
  estimatedHours: '',
  responsibleForeman: '',
  jobInstructions: '',
  manpower: [{ id: '1', grade: '', requiredNumber: '', requiredUnitTime: '', totalManHours: '' }],
  workDoneDetails: '',
  causeOfFailure: '',
  delayDetails: '',
  artisanName: '',
  artisanSign: '',
  artisanDate: '',
  foremanName: '',
  foremanSign: '',
  foremanDate: '',
  timeWorkStarted: '',
  timeWorkFinished: '',
  totalTimeWorked: '',
  overtimeStartTime: '',
  overtimeEndTime: '',
  overtimeHours: '',
  delayFromTime: '',
  delayToTime: '',
  totalDelayHours: '',
};

// More compact FormSection for print
const FormSection = ({ 
  title, 
  children, 
  className = "",
  compact = false
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string;
  compact?: boolean;
}) => {
  return (
    <Card className={`border border-gray-300 bg-white print:border print:border-gray-300 print:bg-white print:shadow-none ${compact ? 'print:mb-1' : 'print:mb-2'} ${className}`}>
      <CardHeader className={`${compact ? 'pb-1 print:pb-0' : 'pb-2 print:pb-0'} print:px-3 print:pt-1`}>
        <CardTitle className={`${compact ? 'text-md' : 'text-lg'} font-bold text-gray-900 print:text-sm print:text-gray-900 print:font-bold font-serif print:leading-tight`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-3 print:space-y-1 print:px-3 ${compact ? 'print:pb-0' : 'print:pb-1'}`}>
        {children}
      </CardContent>
    </Card>
  );
};

// Enhanced LinedTextarea with more prominent dotted lines
const LinedTextarea = ({ 
  value, 
  onChange, 
  className = "",
  rows = 6,
  placeholder = "",
  expanded = false
}: { 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
  expanded?: boolean;
}) => {
  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={onChange}
        className={`bg-white border-gray-300 focus:border-primary print:border print:border-gray-300 print:bg-white font-sans resize-none print:text-xs print:leading-tight ${expanded ? 'min-h-[300px] print:min-h-[180px]' : ''} ${className}`}
        rows={rows}
        placeholder={placeholder}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <div 
            key={i}
            className="border-b border-dotted border-gray-400 print:border-gray-400"
            style={{ 
              height: `${100/rows}%`,
              borderBottomWidth: i === rows - 1 ? '0px' : '1px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Function to calculate overtime hours
const calculateOvertimeHours = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '0';
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  
  // Handle overnight overtime
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}.${Math.round(minutes / 60 * 100)}`;
};

// Function to calculate delay hours
const calculateDelayHours = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '0';
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  
  // Handle overnight delays
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}.${Math.round(minutes / 60 * 100)}`;
};

// Function to calculate total time worked
const calculateTotalTimeWorked = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '0';
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  
  // Handle overnight work
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}.${Math.round(minutes / 60 * 100)}`;
};

// Transform frontend data to backend format
const transformToBackendFormat = (formData: WorkOrderFormData) => {
  return {
    work_order_number: formData.workOrderNumber,
    title: formData.jobRequestDetails.substring(0, 50) || 'Work Order',
    description: formData.jobRequestDetails,
    status: 'pending',
    priority: 'medium',
    to_department: formData.toDepartment,
    to_section: formData.toSection,
    from_department: formData.fromDepartment,
    from_section: formData.fromSection,
    date_raised: formData.dateRaised,
    time_raised: formData.timeRaised,
    account_number: formData.accountNumber,
    equipment_info: formData.equipmentInfo,
    user_lab_today: formData.userLabToday,
    job_type: formData.jobType,
    job_request_details: formData.jobRequestDetails,
    requested_by: formData.requestedBy,
    authorising_foreman: formData.authorisingForeman,
    authorising_engineer: formData.authorisingEngineer,
    allocated_to: formData.allocatedTo,
    estimated_hours: formData.estimatedHours,
    responsible_foreman: formData.responsibleForeman,
    job_instructions: formData.jobInstructions,
    manpower: formData.manpower.map(man => ({
      grade: man.grade,
      required_number: man.requiredNumber,
      required_unit_time: man.requiredUnitTime,
      total_man_hours: man.totalManHours,
    })),
    work_done_details: formData.workDoneDetails,
    cause_of_failure: formData.causeOfFailure,
    delay_details: formData.delayDetails,
    artisan_name: formData.artisanName,
    artisan_sign: formData.artisanSign,
    artisan_date: formData.artisanDate,
    foreman_name: formData.foremanName,
    foreman_sign: formData.foremanSign,
    foreman_date: formData.foremanDate,
    time_work_started: formData.timeWorkStarted,
    time_work_finished: formData.timeWorkFinished,
    total_time_worked: formData.totalTimeWorked,
    overtime_start_time: formData.overtimeStartTime,
    overtime_end_time: formData.overtimeEndTime,
    overtime_hours: formData.overtimeHours,
    delay_from_time: formData.delayFromTime,
    delay_to_time: formData.delayToTime,
    total_delay_hours: formData.totalDelayHours,
  };
};

// CORRECTED createWorkOrder function with proper endpoint
const createWorkOrder = async (workOrderData: any) => {
  try {
    console.log('📤 Sending work order to backend...', workOrderData);
    
    // CORRECTED ENDPOINT: Use the maintenance endpoint instead of direct work-orders
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_BASE}/api/maintenance/work-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workOrderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      throw new Error(`Failed to create work order: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Work order created successfully in database:', result);
    return result;
    
  } catch (error) {
    console.error('💥 Network error, saving to localStorage:', error);
    
    // Fallback to localStorage
    const existingWorkOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const newWorkOrder = {
      ...workOrderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedWorkOrders = [...existingWorkOrders, newWorkOrder];
    localStorage.setItem('workOrders', JSON.stringify(updatedWorkOrders));
    
    return {
      ...newWorkOrder,
      savedLocally: true
    };
  }
};

// Test backend connection function
const testBackendConnection = async () => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_BASE}/api/maintenance/health`);
    const result = await response.json();
    console.log('🔧 Backend connection test:', result);
    return result;
  } catch (error) {
    console.error('🔧 Backend connection failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { status: 'error', error: errorMessage };
  }
};

const HeaderSection = ({ formData, onInputChange }: { formData: WorkOrderFormData; onInputChange: (field: string, value: string) => void }) => (
  <div className="space-y-4 print:space-y-2">
    {/* Main Header Row - Improved Alignment */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 print:gap-2 print:grid-cols-4">
      {/* Column 1: TO Department */}
      <div className="space-y-3 print:space-y-1">
        <div className="space-y-1 print:space-y-0">
          <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 print:font-semibold font-serif print:leading-tight">
            TO DEPARTMENT
          </Label>
          <div className="grid grid-cols-2 gap-2 print:gap-1">
            <div className="space-y-0 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">DEPT</Label>
              <Input
                value={formData.toDepartment}
                onChange={(e) => onInputChange('toDepartment', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
              />
            </div>
            <div className="space-y-0 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">SECTION</Label>
              <Input
                value={formData.toSection}
                onChange={(e) => onInputChange('toSection', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: FROM Department */}
      <div className="space-y-3 print:space-y-1">
        <div className="space-y-1 print:space-y-0">
          <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 print:font-semibold font-serif print:leading-tight">
            FROM DEPARTMENT
          </Label>
          <div className="grid grid-cols-2 gap-2 print:gap-1">
            <div className="space-y-0 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">DEPT</Label>
              <Input
                value={formData.fromDepartment}
                onChange={(e) => onInputChange('fromDepartment', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
              />
            </div>
            <div className="space-y-0 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">SECTION</Label>
              <Input
                value={formData.fromSection}
                onChange={(e) => onInputChange('fromSection', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Dates & Times */}
      <div className="space-y-3 print:space-y-1">
        <div className="grid grid-cols-2 gap-2 print:gap-1">
          <div className="space-y-0 print:space-y-0">
            <Label className="text-sm font-medium print:text-xs print:text-gray-700 font-serif print:leading-tight">DATE RAISED</Label>
            <Input
              type="date"
              value={formData.dateRaised}
              onChange={(e) => onInputChange('dateRaised', e.target.value)}
              className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            />
          </div>
          <div className="space-y-0 print:space-y-0">
            <Label className="text-sm font-medium print:text-xs print:text-gray-700 font-serif print:leading-tight">TIME RAISED</Label>
            <Input
              type="time"
              value={formData.timeRaised}
              onChange={(e) => onInputChange('timeRaised', e.target.value)}
              className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            />
          </div>
        </div>
        <div className="space-y-0 print:space-y-0">
          <Label className="text-sm font-medium print:text-xs print:text-gray-700 font-serif print:leading-tight">WORK ORDER NO.</Label>
          <Input
            value={formData.workOrderNumber}
            onChange={(e) => onInputChange('workOrderNumber', e.target.value)}
            className="bg-white border-gray-300 focus:border-primary font-mono print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300"
          />
        </div>
      </div>

      {/* Column 4: Account & User Lab */}
      <div className="space-y-3 print:space-y-1">
        <div className="space-y-0 print:space-y-0">
          <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">ACCOUNT NUMBER</Label>
          <Input
            value={formData.accountNumber}
            onChange={(e) => onInputChange('accountNumber', e.target.value)}
            className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            placeholder=""
          />
        </div>
        <div className="space-y-0 print:space-y-0">
          <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">USER LAB TODAY</Label>
          <Input
            value={formData.userLabToday}
            onChange={(e) => onInputChange('userLabToday', e.target.value)}
            className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            placeholder=""
          />
        </div>
      </div>
    </div>

    {/* Equipment Information - Wider Textarea */}
    <div className="space-y-1 print:space-y-0">
      <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">EQUIPMENT INFORMATION</Label>
      <LinedTextarea
        value={formData.equipmentInfo}
        onChange={(e) => onInputChange('equipmentInfo', e.target.value)}
        rows={3}
        className="print:text-xs w-full"
        placeholder=""
      />
    </div>
  </div>
);

const JobRequestDetailsSection = ({ formData, onInputChange }: { 
  formData: WorkOrderFormData; 
  onInputChange: (field: string, value: string) => void;
}) => (
  <div className="space-y-3 print:space-y-1">
    <div className="space-y-1 print:space-y-0">
      <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">
        JOB REQUEST DETAILS
      </Label>
      <LinedTextarea
        value={formData.jobRequestDetails}
        onChange={(e) => onInputChange('jobRequestDetails', e.target.value)}
        rows={10}
        expanded={true}
        className="print:text-xs"
        placeholder=""
      />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 print:gap-1 print:grid-cols-3">
      <div className="space-y-0 print:space-y-0">
        <Label className="text-sm font-medium print:text-xs print:text-gray-700 font-serif print:leading-tight">REQUESTED BY</Label>
        <Input
          value={formData.requestedBy}
          onChange={(e) => onInputChange('requestedBy', e.target.value)}
          className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
          placeholder=""
        />
      </div>
      <div className="space-y-0 print:space-y-0">
        <Label className="text-sm font-medium print:text-xs print:text-gray-700 font-serif print:leading-tight">AUTHORISING FOREMAN</Label>
        <Input
          value={formData.authorisingForeman}
          onChange={(e) => onInputChange('authorisingForeman', e.target.value)}
          className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
          placeholder=""
        />
      </div>
      <div className="space-y-0 print:space-y-0">
        <Label className="text-sm font-medium print:text-xs print:text-gray-700 font-serif print:leading-tight">AUTHORISING ENGINEER</Label>
        <Input
          value={formData.authorisingEngineer}
          onChange={(e) => onInputChange('authorisingEngineer', e.target.value)}
          className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
          placeholder=""
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 print:gap-1 print:grid-cols-2">
      <div className="space-y-0 print:space-y-0">
        <Label className="text-sm font-medium print:text-xs print:text-gray-700 font-serif print:leading-tight">ALLOCATED TO</Label>
        <Input
          value={formData.allocatedTo}
          onChange={(e) => onInputChange('allocatedTo', e.target.value)}
          className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
          placeholder=""
        />
      </div>
      <div className="space-y-0 print:space-y-0">
        <Label className="text-sm font-medium print:text-xs print:text-gray-700 font-serif print:leading-tight">ESTIMATED HOURS</Label>
        <Input
          value={formData.estimatedHours}
          onChange={(e) => onInputChange('estimatedHours', e.target.value)}
          className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
          placeholder=""
        />
      </div>
    </div>
  </div>
);

const JobClassificationSection = ({ formData, onJobTypeChange, onInputChange, onCalculateOvertime, onCalculateTotalTime }: { 
  formData: WorkOrderFormData; 
  onJobTypeChange: (field: keyof JobType) => void;
  onInputChange: (field: string, value: string) => void;
  onCalculateOvertime: () => void;
  onCalculateTotalTime: () => void;
}) => (
  <div className="space-y-3 print:space-y-1">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2">
      <div className="space-y-2 print:space-y-1">
        <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">JOB TYPE CLASSIFICATION</Label>
        <div className="grid grid-cols-1 gap-1 print:gap-0">
          {[
            { key: 'operational' as const, label: 'Operational Related', code: 'OP', description: 'Daily operations, production activities' },
            { key: 'maintenance' as const, label: 'Maintenance Related', code: 'MT', description: 'Equipment repair, preventive maintenance' },
            { key: 'mining' as const, label: 'Mining Related', code: 'MN', description: 'Mining operations, pit activities' },
          ].map(({ key, label, code, description }) => (
            <div 
              key={key} 
              className={`flex items-center space-x-2 p-2 rounded border transition-all duration-300 cursor-pointer print:p-1 print:rounded print:space-x-1 print:border print:text-xs ${
                formData.jobType[key] 
                  ? 'border-primary bg-primary/5 print:bg-gray-100 print:border-gray-400' 
                  : 'border-gray-300 bg-white print:bg-white'
              }`}
              onClick={() => onJobTypeChange(key)}
            >
              <div className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-300 print:h-3 print:w-3 print:rounded ${
                formData.jobType[key] 
                  ? 'bg-primary border-primary text-primary-foreground print:bg-gray-600 print:border-gray-600' 
                  : 'border-gray-400 bg-white print:bg-white print:border-gray-400'
              }`}>
                {formData.jobType[key] && (
                  <div className="h-1.5 w-1.5 rounded-full bg-current print:h-1 print:w-1" />
                )}
              </div>
              <div className="flex-1">
                <Label className="text-sm cursor-pointer text-gray-900 print:text-xs print:font-medium font-serif print:leading-tight">{label}</Label>
                <p className="text-xs text-gray-600 print:text-[9px] print:leading-tight font-sans">{description}</p>
              </div>
              <Badge 
                variant={formData.jobType[key] ? "default" : "outline"}
                className="font-mono print:text-[9px] print:px-1 print:py-0"
              >
                {code}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 print:space-y-1">
        {/* Time Tracking Section */}
        <div className="space-y-2 print:space-y-1">
          <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">WORK TIME TRACKING</Label>
          <div className="grid grid-cols-3 gap-2 print:gap-1 print:grid-cols-3">
            <div className="space-y-1 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">TIME WORK STARTED</Label>
              <Input
                type="time"
                value={formData.timeWorkStarted}
                onChange={(e) => onInputChange('timeWorkStarted', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
              />
            </div>
            <div className="space-y-1 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">TIME WORK FINISHED</Label>
              <Input
                type="time"
                value={formData.timeWorkFinished}
                onChange={(e) => onInputChange('timeWorkFinished', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
              />
            </div>
            <div className="space-y-1 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">TOTAL TIME WORKED</Label>
              <div className="flex items-end gap-1 print:gap-0">
                <Input
                  value={formData.totalTimeWorked}
                  onChange={(e) => onInputChange('totalTimeWorked', e.target.value)}
                  className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans font-mono"
                  placeholder="0.00"
                />
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={onCalculateTotalTime}
                  className="print:hidden bg-green-600 hover:bg-green-700 print:py-0 print:px-1 print:text-[8px] print:h-4"
                >
                  <Calculator className="h-3 w-3 print:h-2 print:w-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Overtime Section */}
        <div className="space-y-2 print:space-y-1 pt-2 print:pt-1 border-t border-gray-200 print:border-gray-300">
          <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">OVERTIME TRACKING</Label>
          <div className="grid grid-cols-2 gap-2 print:gap-1 print:grid-cols-2">
            <div className="space-y-1 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">OVERTIME START</Label>
              <Input
                type="time"
                value={formData.overtimeStartTime}
                onChange={(e) => onInputChange('overtimeStartTime', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
              />
            </div>
            <div className="space-y-1 print:space-y-0">
              <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">OVERTIME END</Label>
              <Input
                type="time"
                value={formData.overtimeEndTime}
                onChange={(e) => onInputChange('overtimeEndTime', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
              />
            </div>
          </div>
          <div className="space-y-1 print:space-y-0">
            <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">TOTAL OVERTIME HOURS</Label>
            <div className="flex items-end gap-1 print:gap-0">
              <Input
                value={formData.overtimeHours}
                onChange={(e) => onInputChange('overtimeHours', e.target.value)}
                className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans font-mono"
                placeholder="0.00"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={onCalculateOvertime}
                className="print:hidden bg-blue-600 hover:bg-blue-700 print:py-0 print:px-1 print:text-[8px] print:h-4"
              >
                <Calculator className="h-3 w-3 print:h-2 print:w-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WorkAnalysisSection = ({ formData, onInputChange }: { 
  formData: WorkOrderFormData; 
  onInputChange: (field: string, value: string) => void;
}) => (
  <div className="space-y-3 print:space-y-1">
    <div className="space-y-1 print:space-y-0">
      <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">
        WORK PERFORMED
      </Label>
      <LinedTextarea
        value={formData.workDoneDetails}
        onChange={(e) => onInputChange('workDoneDetails', e.target.value)}
        rows={8}
        expanded={true}
        className="print:text-xs"
        placeholder=""
      />
    </div>
    
    <div className="space-y-1 print:space-y-0">
      <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">JOB INSTRUCTIONS & SAFETY</Label>
      <LinedTextarea
        value={formData.jobInstructions}
        onChange={(e) => onInputChange('jobInstructions', e.target.value)}
        rows={2}
        className="print:text-xs"
        placeholder=""
      />
    </div>

    <div className="space-y-1 print:space-y-0">
      <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">
        CAUSE OF FAILURE ANALYSIS
      </Label>
      <LinedTextarea
        value={formData.causeOfFailure}
        onChange={(e) => onInputChange('causeOfFailure', e.target.value)}
        rows={2}
        className="print:text-xs"
        placeholder=""
      />
    </div>
  </div>
);

const DelaysSection = ({ formData, onInputChange, onCalculateDelay }: {
  formData: WorkOrderFormData;
  onInputChange: (field: string, value: string) => void;
  onCalculateDelay: () => void;
}) => (
  <div className="space-y-3 print:space-y-1">
    <div className="space-y-1 print:space-y-0">
      <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">DELAY DETAILS</Label>
      <LinedTextarea
        value={formData.delayDetails}
        onChange={(e) => onInputChange('delayDetails', e.target.value)}
        rows={2}
        className="print:text-xs"
        placeholder=""
      />
    </div>

    {/* Delay Time Tracking Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 print:gap-1 print:grid-cols-3 pt-2 print:pt-1 border-t border-gray-200 print:border-gray-300">
      <div className="space-y-1 print:space-y-0">
        <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">DELAY FROM</Label>
        <Input
          type="time"
          value={formData.delayFromTime}
          onChange={(e) => onInputChange('delayFromTime', e.target.value)}
          className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
        />
      </div>
      <div className="space-y-1 print:space-y-0">
        <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">DELAY TO</Label>
        <Input
          type="time"
          value={formData.delayToTime}
          onChange={(e) => onInputChange('delayToTime', e.target.value)}
          className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
        />
      </div>
      <div className="space-y-1 print:space-y-0">
        <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">TOTAL DELAY HOURS</Label>
        <div className="flex items-end gap-1 print:gap-0">
          <Input
            value={formData.totalDelayHours}
            onChange={(e) => onInputChange('totalDelayHours', e.target.value)}
            className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans font-mono"
            placeholder="0.00"
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={onCalculateDelay}
            className="print:hidden bg-blue-600 hover:bg-blue-700 print:py-0 print:px-1 print:text-[8px] print:h-4"
          >
            <Calculator className="h-3 w-3 print:h-2 print:w-2" />
          </Button>
        </div>
      </div>
    </div>
    
    <div className="text-xs text-gray-600 print:text-[9px] font-sans print:leading-tight">
      <p className="font-semibold mb-0 print:mb-0">Common Delay Types:</p>
      <div className="grid grid-cols-2 gap-0 print:grid-cols-2 print:gap-0">
        <div>• Travelling to location</div>
        <div>• Collecting spares/parts</div>
        <div>• Machine not available</div>
        <div>• Collecting tools/equipment</div>
        <div>• Labour not available</div>
        <div>• Waiting for another skill</div>
        <div>• Operator not available</div>
        <div>• Waiting for transport</div>
        <div>• Safety clearance required</div>
        <div>• Power/utility isolation</div>
      </div>
    </div>
  </div>
);

const SignOffSection = ({ formData, onInputChange }: { 
  formData: WorkOrderFormData; 
  onInputChange: (field: string, value: string) => void;
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2">
    <div className="space-y-2 print:space-y-1">
      <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">ARTISAN SIGN-OFF</Label>
      <div className="space-y-1 print:space-y-0">
        <div className="grid grid-cols-1 gap-1 print:gap-0">
          <div>
            <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">NAME</Label>
            <Input
              value={formData.artisanName}
              onChange={(e) => onInputChange('artisanName', e.target.value)}
              className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            />
          </div>
          <div>
            <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">SIGNATURE</Label>
            <Input
              value={formData.artisanSign}
              onChange={(e) => onInputChange('artisanSign', e.target.value)}
              className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            />
          </div>
          <div>
            <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">DATE</Label>
            <Input
              type="date"
              value={formData.artisanDate}
              onChange={(e) => onInputChange('artisanDate', e.target.value)}
              className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            />
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-2 print:space-y-1">
      <Label className="text-sm font-semibold text-gray-900 print:text-xs print:text-gray-900 font-serif print:leading-tight">FOREMAN SIGN-OFF</Label>
      <div className="space-y-1 print:space-y-0">
        <div className="grid grid-cols-1 gap-1 print:gap-0">
          <div>
            <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">NAME</Label>
            <Input
              value={formData.foremanName}
              onChange={(e) => onInputChange('foremanName', e.target.value)}
              className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            />
          </div>
          <div>
            <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">SIGNATURE</Label>
            <Input
              value={formData.foremanSign}
              onChange={(e) => onInputChange('foremanSign', e.target.value)}
              className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            />
          </div>
          <div>
            <Label className="text-xs font-medium print:text-[9px] print:text-gray-700 font-serif print:leading-tight">DATE</Label>
            <Input
              type="date"
              value={formData.foremanDate}
              onChange={(e) => onInputChange('foremanDate', e.target.value)}
              className="bg-white border-gray-300 focus:border-primary print:text-xs print:py-0 print:h-5 print:bg-white print:border-gray-300 font-sans"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface WorkOrderFormProps {
  onBack?: () => void;
  onSave?: (data: WorkOrderFormData) => void;
}

export function WorkOrderForm({ onBack, onSave }: WorkOrderFormProps) {
  const [formData, setFormData] = useState<WorkOrderFormData>(INITIAL_FORM_DATA);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleJobTypeChange = useCallback((field: keyof JobType) => {
    setFormData(prev => ({
      ...prev,
      jobType: {
        ...prev.jobType,
        [field]: !prev.jobType[field]
      }
    }));
  }, []);

  // Test backend connection on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const result = await testBackendConnection();
      setBackendStatus(result.status === 'healthy' ? 'connected' : 'disconnected');
    };
    checkBackend();
  }, []);

  // Calculate total time worked automatically when work times change
  useEffect(() => {
    if (formData.timeWorkStarted && formData.timeWorkFinished) {
      const calculatedHours = calculateTotalTimeWorked(formData.timeWorkStarted, formData.timeWorkFinished);
      setFormData(prev => ({
        ...prev,
        totalTimeWorked: calculatedHours
      }));
    }
  }, [formData.timeWorkStarted, formData.timeWorkFinished]);

  // Calculate overtime hours automatically when overtime times change
  useEffect(() => {
    if (formData.overtimeStartTime && formData.overtimeEndTime) {
      const calculatedHours = calculateOvertimeHours(formData.overtimeStartTime, formData.overtimeEndTime);
      setFormData(prev => ({
        ...prev,
        overtimeHours: calculatedHours
      }));
    }
  }, [formData.overtimeStartTime, formData.overtimeEndTime]);

  // Calculate delay hours automatically when delay times change
  useEffect(() => {
    if (formData.delayFromTime && formData.delayToTime) {
      const calculatedHours = calculateDelayHours(formData.delayFromTime, formData.delayToTime);
      setFormData(prev => ({
        ...prev,
        totalDelayHours: calculatedHours
      }));
    }
  }, [formData.delayFromTime, formData.delayToTime]);

  const handleCalculateTotalTime = useCallback(() => {
    if (formData.timeWorkStarted && formData.timeWorkFinished) {
      const calculatedHours = calculateTotalTimeWorked(formData.timeWorkStarted, formData.timeWorkFinished);
      setFormData(prev => ({
        ...prev,
        totalTimeWorked: calculatedHours
      }));
    }
  }, [formData.timeWorkStarted, formData.timeWorkFinished]);

  const handleCalculateOvertime = useCallback(() => {
    if (formData.overtimeStartTime && formData.overtimeEndTime) {
      const calculatedHours = calculateOvertimeHours(formData.overtimeStartTime, formData.overtimeEndTime);
      setFormData(prev => ({
        ...prev,
        overtimeHours: calculatedHours
      }));
    }
  }, [formData.overtimeStartTime, formData.overtimeEndTime]);

  const handleCalculateDelay = useCallback(() => {
    if (formData.delayFromTime && formData.delayToTime) {
      const calculatedHours = calculateDelayHours(formData.delayFromTime, formData.delayToTime);
      setFormData(prev => ({
        ...prev,
        totalDelayHours: calculatedHours
      }));
    }
  }, [formData.delayFromTime, formData.delayToTime]);

  const generatePDF = useCallback(() => {
    console.log('Generating PDF with data:', formData);
    window.print();
  }, [formData]);

  const printForm = useCallback(() => {
    window.print();
  }, []);

  // CORRECTED SUBMISSION HANDLER - Uses proper endpoint
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobRequestDetails || !formData.requestedBy) {
      toast.error('Please fill in required fields: Job Request Details and Requested By');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('📝 Submitting work order...', formData);
      
      // Transform data to backend format
      const backendData = transformToBackendFormat(formData);
      console.log('📤 Transformed data for backend:', backendData);
      
      // Use the CORRECTED createWorkOrder function
      const response = await createWorkOrder(backendData);
      console.log('✅ Submission response:', response);
      
      if (response.savedLocally) {
        toast.success('Work order saved locally (backend unavailable)');
      } else {
        toast.success('Work order saved successfully to database!');
      }
      
      // Call the onSave prop to notify parent component
      if (onSave) {
        onSave(formData);
      }
      
      // Reset form after successful submission
      setFormData(INITIAL_FORM_DATA);
      
    } catch (error) {
      console.error('💥 Error saving work order:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('saved locally')) {
          toast.success('Work order saved locally for now.');
        } else if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
          toast.error('Network error: Cannot connect to server. Work order saved locally.');
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error('Unknown error occurred while saving work order');
      }
      
      // Final fallback and notify parent
      if (onSave) {
        onSave(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSave]);

  const saveDraft = useCallback(() => {
    const savedDrafts = JSON.parse(localStorage.getItem('workOrderDrafts') || '[]');
    const draft = {
      ...formData,
      id: Date.now().toString(),
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    savedDrafts.push(draft);
    localStorage.setItem('workOrderDrafts', JSON.stringify(savedDrafts));
    toast.success('Work order draft saved successfully!');
  }, [formData]);

  const resetForm = useCallback(() => {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
      setFormData(INITIAL_FORM_DATA);
      toast.info('Work order form reset successfully');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 print:p-0 font-serif">
      <div className="max-w-6xl mx-auto print:max-w-none print:mx-0">
        {/* Simplified Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 hover:bg-accent/50 transition-all duration-300 font-sans">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif">
                Create New Work Order
              </h1>
              <p className="text-gray-600 mt-1 font-sans">
                Complete maintenance work order documentation
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-green-500' : 
                  backendStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-xs text-gray-500">
                  {backendStatus === 'connected' ? 'Connected to database' : 
                   backendStatus === 'disconnected' ? 'Using local storage' : 'Checking connection...'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={generatePDF} className="gap-2 hover:bg-primary/5 transition-all duration-300 font-sans">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={printForm} className="gap-2 hover:bg-primary/5 transition-all duration-300 font-sans">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <Card className="bg-white border-gray-300 shadow-lg print:shadow-none print:border-0 print:bg-transparent">
          <CardHeader className="text-center border-b border-gray-300 pb-4 bg-blue-50 print:hidden">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <CardTitle className="text-3xl font-black tracking-tight text-gray-900 font-serif">
                  WORK ORDER
                </CardTitle>
                <CardDescription className="text-md font-semibold text-gray-700 mt-1 font-serif">
                  MAINTENANCE WORK ORDER DOCUMENTATION
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary border-primary/20 font-sans">
                Ref: {formData.workOrderNumber}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 print:p-2">
            {/* Screen Layout with Tabs */}
            <div className="screen-only">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-4 w-full bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger 
                    value="basic" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-300 text-gray-700 data-[state=active]:text-gray-900 font-medium font-sans"
                  >
                    <FileText className="h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="details" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-300 text-gray-700 data-[state=active]:text-gray-900 font-medium font-sans"
                  >
                    <Settings className="h-4 w-4" />
                    Job Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="work" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-300 text-gray-700 data-[state=active]:text-gray-900 font-medium font-sans"
                  >
                    <Workflow className="h-4 w-4" />
                    Work & Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signoff" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-300 text-gray-700 data-[state=active]:text-gray-900 font-medium font-sans"
                  >
                    <FileCheck className="h-4 w-4" />
                    Sign-off
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <TabsContent value="basic" className="space-y-6 animate-in fade-in duration-500">
                    <FormSection title="Header Information">
                      <HeaderSection formData={formData} onInputChange={handleInputChange} />
                    </FormSection>

                    <FormSection title="Job Classification & Equipment">
                      <JobClassificationSection 
                        formData={formData} 
                        onJobTypeChange={handleJobTypeChange}
                        onInputChange={handleInputChange}
                        onCalculateOvertime={handleCalculateOvertime}
                        onCalculateTotalTime={handleCalculateTotalTime}
                      />
                    </FormSection>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6 animate-in fade-in duration-500">
                    <FormSection title="Job Request Details">
                      <JobRequestDetailsSection formData={formData} onInputChange={handleInputChange} />
                    </FormSection>
                  </TabsContent>

                  <TabsContent value="work" className="space-y-6 animate-in fade-in duration-500">
                    <FormSection title="Work Details & Analysis">
                      <WorkAnalysisSection formData={formData} onInputChange={handleInputChange} />
                    </FormSection>

                    <FormSection title="Delay Tracking" compact={true}>
                      <DelaysSection 
                        formData={formData} 
                        onInputChange={handleInputChange}
                        onCalculateDelay={handleCalculateDelay}
                      />
                    </FormSection>
                  </TabsContent>

                  <TabsContent value="signoff" className="space-y-6 animate-in fade-in duration-500">
                    <FormSection title="Sign-off & Authorization" compact={true}>
                      <SignOffSection formData={formData} onInputChange={handleInputChange} />
                    </FormSection>
                  </TabsContent>

                  {/* Form Buttons - Hidden in print */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-300 print:hidden">
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={resetForm} 
                        className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 font-sans"
                        disabled={isSubmitting}
                      >
                        Reset Form
                      </Button>
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={saveDraft} 
                        className="gap-2 hover:bg-primary/5 transition-all duration-300 font-sans"
                        disabled={isSubmitting}
                      >
                        Save Draft
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      className="gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 font-sans"
                      disabled={isSubmitting}
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting ? 'Saving...' : 'Submit Work Order'}
                    </Button>
                  </div>
                </form>
              </Tabs>
            </div>

            {/* Optimized Print Layout - Exactly 2 pages */}
            <div className="print-only">
              {/* Page 1 */}
              <div className="print-page">
                {/* Print Header */}
                <div className="print-header mb-2 pb-1 border-b border-gray-900">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-sm font-bold text-gray-900 font-serif">MAINTENANCE WORK ORDER</h1>
                      <p className="text-xs text-gray-600 font-serif">WORK ORDER DOCUMENTATION</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900 font-serif">Ref: {formData.workOrderNumber}</p>
                      <p className="text-[10px] text-gray-600 font-serif">Date: {formData.dateRaised}</p>
                    </div>
                  </div>
                </div>

                {/* 1. HEADER INFORMATION - IMPROVED ALIGNMENT */}
                <FormSection title="HEADER INFORMATION" compact={true}>
                  <HeaderSection formData={formData} onInputChange={handleInputChange} />
                </FormSection>

                {/* 2. JOB REQUEST DETAILS */}
                <FormSection title="JOB REQUEST DETAILS">
                  <JobRequestDetailsSection formData={formData} onInputChange={handleInputChange} />
                </FormSection>

                {/* Page 1 Footer */}
                <div className="print-footer mt-1 pt-1 border-t border-gray-300 text-center text-[10px] text-gray-600 font-sans">
                  <p>Work Order Reference: {formData.workOrderNumber} | Page 1 of 2</p>
                </div>
              </div>

              {/* Page 2 */}
              <div className="print-page">
                {/* Page 2 Header */}
                <div className="print-header mb-2 pb-1 border-b border-gray-900">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-sm font-bold text-gray-900 font-serif">MAINTENANCE WORK ORDER</h1>
                      <p className="text-xs text-gray-600 font-serif">WORK ORDER DOCUMENTATION - CONTINUED</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900 font-serif">Ref: {formData.workOrderNumber}</p>
                      <p className="text-[10px] text-gray-600 font-serif">Page 2 of 2</p>
                    </div>
                  </div>
                </div>

                {/* 3. JOB CLASSIFICATION & EQUIPMENT */}
                <FormSection title="JOB CLASSIFICATION & EQUIPMENT" compact={true}>
                  <JobClassificationSection 
                    formData={formData} 
                    onJobTypeChange={handleJobTypeChange}
                    onInputChange={handleInputChange}
                    onCalculateOvertime={handleCalculateOvertime}
                    onCalculateTotalTime={handleCalculateTotalTime}
                  />
                </FormSection>

                {/* 4. WORK DETAILS & ANALYSIS */}
                <FormSection title="WORK DETAILS & ANALYSIS">
                  <WorkAnalysisSection formData={formData} onInputChange={handleInputChange} />
                </FormSection>

                {/* 5. DELAY TRACKING */}
                <FormSection title="DELAY TRACKING" compact={true}>
                  <DelaysSection 
                    formData={formData} 
                    onInputChange={handleInputChange}
                    onCalculateDelay={handleCalculateDelay}
                  />
                </FormSection>

                {/* 6. SIGN-OFF & AUTHORIZATION */}
                <FormSection title="SIGN-OFF & AUTHORIZATION" compact={true}>
                  <SignOffSection formData={formData} onInputChange={handleInputChange} />
                </FormSection>

                {/* Page 2 Footer */}
                <div className="print-footer mt-1 pt-1 border-t border-gray-300 text-center text-[10px] text-gray-600 font-sans">
                  <p>Work Order Reference: {formData.workOrderNumber} | Generated on: {new Date().toLocaleDateString()} | Page 2 of 2</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0.3in 0.4in;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: white !important;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.2;
            font-family: Georgia, 'Times New Roman', serif !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .screen-only {
            display: none !important;
          }
          
          .print-page {
            min-height: calc(100vh - 0.6in);
            page-break-after: always;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          .print-page:last-child {
            page-break-after: avoid;
          }
          
          .print-header {
            margin-bottom: 0.15in;
            padding-bottom: 0.05in;
          }
          
          .print-footer {
            margin-top: 0.1in;
            padding-top: 0.05in;
            text-align: center;
          }
          
          /* Remove any potential overflow */
          * {
            overflow: visible !important;
          }
          
          /* Enhanced dotted lines for writing guidance */
          .border-dotted {
            border-style: dotted !important;
            border-color: #666 !important;
          }
          
          /* Reduced textareas for better fit */
          .print-page .min-h-\\[180px\\] {
            min-height: 120px !important;
            height: 120px !important;
          }
          
          /* Compact form elements for print */
          .print-page input,
          .print-page textarea {
            border: 1px solid #000 !important;
            background: white !important;
            padding: 0.05rem 0.1rem !important;
            margin: 0 !important;
            font-size: 10px;
            line-height: 1.1;
            height: auto !important;
            font-family: Arial, sans-serif !important;
          }
          
          /* Reduced textareas for writing space */
          .print-page textarea {
            min-height: auto !important;
            height: auto !important;
          }
          
          /* Reduce spacing and font sizes */
          .print-page .space-y-1 > * + * {
            margin-top: 0.1rem !important;
          }
          
          .print-page .space-y-2 > * + * {
            margin-top: 0.2rem !important;
          }
          
          .print-page .space-y-3 > * + * {
            margin-top: 0.3rem !important;
          }
          
          .print-page .gap-1 {
            gap: 0.1rem !important;
          }
          
          .print-page .gap-2 {
            gap: 0.2rem !important;
          }
          
          .print-page .p-1 {
            padding: 0.1rem !important;
          }
          
          .print-page .p-2 {
            padding: 0.2rem !important;
          }
          
          .print-page .mb-1 {
            margin-bottom: 0.1rem !important;
          }
          
          .print-page .mb-2 {
            margin-bottom: 0.2rem !important;
          }
          
          .print-page .mt-1 {
            margin-top: 0.1rem !important;
          }
          
          .print-page .text-sm {
            font-size: 10px !important;
          }
          
          .print-page .text-xs {
            font-size: 9px !important;
          }
          
          .print-page .text-lg {
            font-size: 12px !important;
          }
          
          .print-page .text-md {
            font-size: 11px !important;
          }
          
          /* Ensure proper textarea sizing for reduced sections */
          .print-page textarea[rows="10"] {
            height: auto !important;
            min-height: 140px !important;
          }
          
          .print-page textarea[rows="8"] {
            height: auto !important;
            min-height: 110px !important;
          }
          
          .print-page textarea[rows="3"] {
            height: auto !important;
            min-height: 50px !important;
          }
          
          /* Remove shadows and backgrounds for print */
          .print-page * {
            box-shadow: none !important;
            background: white !important;
          }
          
          /* Borders for print */
          .print-page .border {
            border-width: 1px !important;
          }
          
          .print-page .border-b {
            border-bottom-width: 1px !important;
          }
          
          .print-page .border-t {
            border-top-width: 1px !important;
          }

          /* Remove placeholder text in print */
          .print-page textarea::placeholder {
            color: transparent !important;
          }
          
          .print-page input::placeholder {
            color: transparent !important;
          }

          /* Hide calculate button in print */
          .print-page button {
            display: none !important;
          }
          
          /* Elegant fonts for print */
          .print-page .font-serif {
            font-family: Georgia, 'Times New Roman', serif !important;
          }
          
          .print-page .font-sans {
            font-family: Arial, sans-serif !important;
          }
          
          .print-page .font-mono {
            font-family: 'Courier New', monospace !important;
          }
        }
        
        /* Hide print-only elements on screen */
        .print-only {
          display: none;
        }
        
        /* Screen styles */
        @media screen {
          .print-page {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}