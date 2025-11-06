// components/maintenance/WorkOrderDetails.jsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  User, 
  Wrench, 
  Clock, 
  CheckCircle,
  FileText,
  Building
} from 'lucide-react';

export function WorkOrderDetails({ workOrder, onOpenChange, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [jobCardData, setJobCardData] = useState({
    work_performed: '',
    labor_hours: '',
    technician_notes: '',
    supervisor_notes: '',
    parts_used: [{ name: '', quantity: '', cost: '' }]
  });
  
  const { toast } = useToast();

  if (!workOrder) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    
    const statusLabels = {
      pending: 'Pending',
      assigned: 'Assigned',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };

    return <Badge className={variants[status]}>{statusLabels[status]}</Badge>;
  };

  const handleCompleteWorkOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        ...jobCardData,
        labor_hours: parseFloat(jobCardData.labor_hours),
        parts_used: jobCardData.parts_used.filter(part => part.name.trim() !== '')
      };

      const response = await fetch(`/api/maintenance/work-orders/${workOrder.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to complete work order');
      }

      toast({
        title: 'Success',
        description: 'Work order completed successfully',
      });

      onOpenChange(false);
      onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete work order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addPart = () => {
    setJobCardData(prev => ({
      ...prev,
      parts_used: [...prev.parts_used, { name: '', quantity: '', cost: '' }]
    }));
  };

  const updatePart = (index, field, value) => {
    setJobCardData(prev => ({
      ...prev,
      parts_used: prev.parts_used.map((part, i) => 
        i === index ? { ...part, [field]: value } : part
      )
    }));
  };

  return (
    <Dialog open={!!workOrder} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Work Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{workOrder.title}</span>
                  <div className="flex gap-2">
                    {getPriorityBadge(workOrder.priority)}
                    {getStatusBadge(workOrder.status)}
                  </div>
                </CardTitle>
                <CardDescription>{workOrder.work_order_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{workOrder.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Machine: {workOrder.machine_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Assigned: {workOrder.assigned_to_name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Due: {workOrder.due_date ? formatDate(workOrder.due_date) : 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Est. Hours: {workOrder.estimated_hours || 'Not set'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Card Form */}
            {workOrder.status !== 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Complete Work Order
                  </CardTitle>
                  <CardDescription>
                    Fill in the job card details to complete this work order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="work_performed">Work Performed *</Label>
                    <Textarea
                      id="work_performed"
                      placeholder="Describe the work that was performed..."
                      value={jobCardData.work_performed}
                      onChange={(e) => setJobCardData(prev => ({ ...prev, work_performed: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="labor_hours">Actual Labor Hours *</Label>
                    <Input
                      id="labor_hours"
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="Enter actual hours worked"
                      value={jobCardData.labor_hours}
                      onChange={(e) => setJobCardData(prev => ({ ...prev, labor_hours: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Parts Used</Label>
                    {jobCardData.parts_used.map((part, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Part name"
                          value={part.name}
                          onChange={(e) => updatePart(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Qty"
                          type="number"
                          value={part.quantity}
                          onChange={(e) => updatePart(index, 'quantity', e.target.value)}
                        />
                        <Input
                          placeholder="Cost"
                          type="number"
                          step="0.01"
                          value={part.cost}
                          onChange={(e) => updatePart(index, 'cost', e.target.value)}
                        />
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addPart}>
                      Add Part
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technician_notes">Technician Notes</Label>
                    <Textarea
                      id="technician_notes"
                      placeholder="Any notes from the technician..."
                      value={jobCardData.technician_notes}
                      onChange={(e) => setJobCardData(prev => ({ ...prev, technician_notes: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <Button 
                    onClick={handleCompleteWorkOrder} 
                    disabled={loading || !jobCardData.work_performed || !jobCardData.labor_hours}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Work Order
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Reassign
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Work Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(workOrder.created_at)}
                    </p>
                  </div>
                </div>
                {workOrder.assigned_to_name && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Assigned</p>
                      <p className="text-xs text-muted-foreground">
                        To {workOrder.assigned_to_name}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}