import React from 'react';
import { RevenueRecord } from './types';

interface BaseTableProps {
    data: RevenueRecord[];
    accentColor: string;
}

export default function BaseTable({ data, accentColor }: BaseTableProps) {
    const receivedTotal = data.reduce((acc, item) => acc + Number(item.amount_received || 0), 0);
    const paidTotal = data.reduce((acc, item) => acc + Number(item.amount_paid || 0), 0);
    const pendingTotal = data.reduce((acc, item) => acc + Number(item.amount_pending || 0), 0);

    return (
        <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                        {['ID', 'Bill No', 'Received', 'Paid', 'Pending', 'Description', 'Mode', 'Date', 'Status', 'Tracking', 'Flat ID', 'Vendor ID', 'Event ID'].map(h => (
                            <th key={h} style={thStyle}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            <td style={tdStyle}>{row.id}</td>
                            <td style={tdStyle}>{row.bill_no || '-'}</td>
                            <td style={{ ...tdStyle, fontWeight: 'bold' }}>{row.amount_received || 0}</td>
                            <td style={{ ...tdStyle, fontWeight: 'bold' }}>{row.amount_paid || 0}</td>
                            <td style={{ ...tdStyle, color: 'red' }}>{row.amount_pending || 0}</td>
                            <td style={tdStyle}>{row.description || '-'}</td>
                            <td style={tdStyle}>{row.payment_mode || '-'}</td>
                            <td style={tdStyle}>{row.payment_date ? new Date(row.payment_date).toLocaleDateString() : 'N/A'}</td>
                            <td style={{ ...tdStyle, color: row.payment_status === 'PAID' ? 'green' : 'orange', fontWeight: 'bold' }}>{row.payment_status}</td>
                            <td style={tdStyle}>{row.tracking_id || '-'}</td>
                            <td style={tdStyle}>{row.flat_id || '-'}</td>
                            <td style={tdStyle}>{row.vendor_id || '-'}</td>
                            <td style={tdStyle}>{row.event_id || '-'}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot style={{ backgroundColor: '#eee', fontWeight: 'bold' }}>
                    <tr>
                        <td style={tdStyle}>TOTAL</td>
                        <td style={tdStyle}>-</td>
                        <td style={{ ...tdStyle, color: accentColor }}>₹ {receivedTotal.toLocaleString('en-IN')}</td>
                        <td style={{ ...tdStyle, color: accentColor }}>₹ {paidTotal.toLocaleString('en-IN')}</td>
                        <td style={{ ...tdStyle, color: accentColor }}>₹ {pendingTotal.toLocaleString('en-IN')}</td>
                        <td colSpan={8} style={tdStyle}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

// Add your thStyle and tdStyle objects here as well
const thStyle: React.CSSProperties = { padding: '12px 15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '0.85rem', color: '#666' };
const tdStyle: React.CSSProperties = { padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' };