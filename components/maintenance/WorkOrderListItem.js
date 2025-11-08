// frontend/components/maintenance/WorkOrderListItem.js

'use client';
import { useState } from 'react';

export default function WorkOrderListItem({ workOrder, onUpdate, onSelect, isSelected }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusChange = (newStatus) => {
    onUpdate?.(workOrder.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdate?.(workOrder.id, { priority: newPriority });
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onSelect?.(workOrder.id, e.target.checked);
  };

  return (
    <div 
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox for selection */}
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={handleCheckboxChange}
            className="mt-1"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-base">
                {workOrder.title}
              </h4>
              <p className={`text-sm text-gray-600 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
                {workOrder.description || 'No description provided'}
              </p>
            </div>
            
            {/* Status and Priority Badges */}
            <div className="flex flex-col items-end space-y-2 ml-4">
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(workOrder.status)}`}>
                {workOrder.status.replace('-', ' ')}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(workOrder.priority)}`}>
                {workOrder.priority}
              </span>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Quick Actions */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Update Status:
                  </label>
                  <select
                    value={workOrder.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full text-sm border rounded p-2 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Change Priority:
                  </label>
                  <select
                    value={workOrder.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="w-full text-sm border rounded p-2 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex flex-wrap items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex flex-wrap gap-3">
              {workOrder.assignedTo && (
                <span className="flex items-center space-x-1">
                  <span>👤</span>
                  <span>{workOrder.assignedTo}</span>
                </span>
              )}
              
              {workOrder.dueDate && (
                <span className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>{formatDate(workOrder.dueDate)}</span>
                </span>
              )}
              
              {workOrder.id && (
                <span className="flex items-center space-x-1">
                  <span>#</span>
                  <span>{(workOrder.id || '').toString().slice(-6)}</span>
                </span>
              )}
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}