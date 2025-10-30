// app/meters/log/page.js
"use client";

import React, { useState } from 'react';

// Define the component for logging meter readings
export default function LogMeterReadingPage() {
  const [formData, setFormData] = useState({
    meterId: '',
    readingDate: new Date().toISOString().substring(0, 10), // Default to today's date
    readingValue: '',
    readingUnit: 'kWh', // Default unit
    previousReading: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Meter Reading Submitted:', formData);
    
    // TODO: 
    // 1. Add form validation logic here
    // 2. Send data to your API route (e.g., /api/readings/meters)
    // 3. Handle success or failure (e.g., show a success message or redirect)
    
    alert(`Reading logged for Meter ID: ${formData.meterId}`);
    // Optional: clear the form after successful submission
    // setFormData({ meterId: '', readingDate: new Date().toISOString().substring(0, 10), readingValue: '', readingUnit: 'kWh', previousReading: '', notes: '' });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Meter Readings Log ⚡</h1>
      <p>Enter consumption or output data from a specific meter.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        
        {/* Meter ID */}
        <label>
          **Meter ID:**
          <input
            type="text"
            name="meterId"
            value={formData.meterId}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g., M-ELEC-003"
          />
        </label>

        {/* Reading Date */}
        <label>
          **Date of Reading:**
          <input
            type="date"
            name="readingDate"
            value={formData.readingDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
        
        {/* Reading Value */}
        <label>
          **Current Reading Value:**
          <input
            type="number"
            name="readingValue"
            value={formData.readingValue}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g., 54321"
          />
        </label>
        
        {/* Reading Unit (Select dropdown) */}
        <label>
          **Reading Unit:**
          <select
            name="readingUnit"
            value={formData.readingUnit}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="kWh">kWh (Kilowatt-hour)</option>
            <option value="m3">m³ (Cubic Meter - Gas/Water)</option>
            <option value="Liters">Liters</option>
            <option value="Other">Other</option>
          </select>
        </label>

        {/* Previous Reading (Optional for calculation) */}
        <label>
          **Previous Reading (Optional):**
          <input
            type="number"
            name="previousReading"
            value={formData.previousReading}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g., 54000"
          />
        </label>

        {/* Notes */}
        <label>
          **Notes/Observations:**
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            style={inputStyle}
            placeholder="Condition of meter, location, observer name, etc."
          ></textarea>
        </label>

        <button 
          type="submit" 
          style={buttonStyle}
        >
          Log Meter Reading
        </button>
      </form>
    </div>
  );
}

// Basic inline styles for simplicity (consider using CSS modules in production)
const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  backgroundColor: '#0070f3',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
};