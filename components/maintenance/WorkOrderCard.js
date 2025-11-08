// frontend/components/maintenance/KanbanView.js (simplified version)

'use client';
import { useState } from 'react';

export default function KanbanView({ workOrders, onWorkOrderUpdate }) {
  const [draggedOrder, setDraggedOrder] = useState(null);

  // Group work orders by status
  const groupedOrders = workOrders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = [];
    }
    acc[order.status].push(order);
    return acc;
  }, {});

  const statusColumns = [
    { id: 'pending', title: 'Pending', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' },
    { id: 'on-hold', title: 'On Hold', color: 'bg-yellow-100' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDragStart = (e, workOrder) => {
    setDraggedOrder(workOrder);
    e.dataTransfer.setData('text/plain', workOrder.id);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedOrder && draggedOrder.status !== newStatus) {
      onWorkOrderUpdate?.(draggedOrder.id, { status: newStatus });
    }
    setDraggedOrder(null);
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {statusColumns.map((column) => (
        <div
          key={column.id}
          className={`flex-1 min-w-80 ${column.color} rounded-lg p-4`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h3 className="font-semibold text-lg mb-4 text-gray-800">
            {column.title} 
            <span className="ml-2 text-sm text-gray-600">
              ({groupedOrders[column.id]?.length || 0})
            </span>
          </h3>
          
          <div className="space-y-3">
            {groupedOrders[column.id]?.map((workOrder) => (
              <div
                key={workOrder.id}
                draggable
                onDragStart={(e) => handleDragStart(e, workOrder)}
                className="cursor-move bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{workOrder.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(workOrder.priority)}`}>
                    {workOrder.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {workOrder.description || 'No description'}
                </p>
                {workOrder.assignedTo && (
                  <div className="text-xs text-gray-500 mt-2">
                    👤 {workOrder.assignedTo}
                  </div>
                )}
              </div>
            ))}
            
            {(!groupedOrders[column.id] || groupedOrders[column.id].length === 0) && (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                No work orders
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}