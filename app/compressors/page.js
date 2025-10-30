// app/compressors/page.js

import Link from 'next/link';

// Dummy data to simulate fetching a list of compressors
const compressorList = [
  { id: 'C-001', model: 'Atlas-150', lastReading: '2025-10-28', status: 'Online' },
  { id: 'C-002', model: 'Sullair-200', lastReading: '2025-10-25', status: 'Maintenance Due' },
  { id: 'C-003', model: 'Ingersoll-100', lastReading: '2025-10-28', status: 'Idle' },
];

export default function CompressorsManagementPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Compressor Management Dashboard 🛠️</h1>
      <p>Overview of all active compressor units and their last recorded status.</p>

      {/* Action Button: Navigate to the Log Form */}
      <Link 
        href="/compressors/log" 
        style={linkButtonStyle}
      >
        ➕ Log New Reading
      </Link>

      <h2 style={{ marginTop: '30px' }}>Current Compressor Status</h2>
      
      {/* List/Table of Compressors */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>ID</th>
            <th style={headerCellStyle}>Model</th>
            <th style={headerCellStyle}>Last Reading Date</th>
            <th style={headerCellStyle}>Status</th>
            <th style={headerCellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {compressorList.map((comp) => (
            <tr key={comp.id}>
              <td style={dataCellStyle}>{comp.id}</td>
              <td style={dataCellStyle}>{comp.model}</td>
              <td style={dataCellStyle}>{comp.lastReading}</td>
              <td style={{ ...dataCellStyle, fontWeight: 'bold', color: comp.status.includes('Maintenance') ? '#d9534f' : '#5cb85c' }}>
                {comp.status}
              </td>
              <td style={dataCellStyle}>
                <Link href={`/compressors/${comp.id}/history`} style={actionLinkStyle}>
                  View History
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* TODO: Implement the /compressors/[id]/history route later */}
      <p style={{ marginTop: '20px', fontStyle: 'italic', fontSize: '14px' }}>
        Note: The "View History" link requires a new dynamic route: **app/compressors/[id]/history/page.js**
      </p>

    </div>
  );
}

// Basic inline styles for simplicity
const linkButtonStyle = {
  display: 'inline-block',
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 15px',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px',
};

const headerCellStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const dataCellStyle = {
  border: '1px solid #ddd',
  padding: '12px',
};

const actionLinkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: '600',
};