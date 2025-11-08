// frontend/components/maintenance/AIPanel.js

'use client';
import { useState } from 'react';

export default function AIPanel({ workOrders, onAISuggestion }) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const generateAISuggestion = async () => {
    setIsLoading(true);
    try {
      // Mock AI suggestion - replace with actual AI service integration
      const mockSuggestion = `Based on ${workOrders.length} work orders, consider prioritizing maintenance tasks with high urgency and scheduling preventive maintenance for equipment with frequent issues.`;
      setSuggestion(mockSuggestion);
      onAISuggestion?.(mockSuggestion);
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-3">AI Maintenance Assistant</h3>
      
      <button
        onClick={generateAISuggestion}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Analyzing...' : 'Generate AI Suggestions'}
      </button>

      {suggestion && (
        <div className="mt-4 p-3 bg-white rounded border">
          <p className="text-sm text-gray-700">{suggestion}</p>
        </div>
      )}
    </div>
  );
}