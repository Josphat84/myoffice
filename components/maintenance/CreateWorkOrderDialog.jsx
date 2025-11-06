// components/maintenance/CreateWorkOrderDialog.jsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function CreateWorkOrderDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    machine_id: '',
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: '',
    scheduled_date: '',
    due_date: '',
    estimated_hours: '',
    tasks: ['']
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchMachines();
      fetchEmployees();
    }
  }, [open]);

  const fetchMachines = async () => {
    try {
      const response = await fetch('/api/equipment');
      const data = await response.json();
      setMachines(data.data || []);
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        machine_id: parseInt(formData.machine_id),
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
        tasks: formData.tasks.filter(task => task.trim() !== '')
      };

      const response = await fetch('/api/maintenance/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create work order');
      }

      toast({
        title: 'Success',
        description: 'Work order created successfully',
      });

      setFormData({
        machine_id: '',
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        scheduled_date: '',
        due_date: '',
        estimated_hours: '',
        tasks: ['']
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create work order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const updateTask = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };

  const removeTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new maintenance work order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="machine">Machine *</Label>
              <Select value={formData.machine_id} onValueChange={(value) => setFormData(prev => ({ ...prev, machine_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select machine" />
                </SelectTrigger>
                <SelectContent>
                  {machines.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id.toString()}>
                      {machine.name} - {machine.serial_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter work order title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the maintenance work needed..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assign To</Label>
              <Select value={formData.assigned_to} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name} - {employee.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_hours">Estimated Hours</Label>
              <Input
                id="estimated_hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="Estimated time"
                value={formData.estimated_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Scheduled Date</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tasks</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTask}>
                Add Task
              </Button>
            </div>
            {formData.tasks.map((task, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Task ${index + 1}`}
                  value={task}
                  onChange={(e) => updateTask(index, e.target.value)}
                />
                {formData.tasks.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTask(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Work Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}