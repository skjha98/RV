import React from 'react';
import { RevenueRecord } from './types';

// 1. Updated Interface to include all the "Action" props from the parent
interface BaseTableProps {
    data: RevenueRecord[];
    accentColor: string;
    isAdding?: boolean;
    newRow?: Partial<RevenueRecord>;
    onNewRowChange?: (field: keyof RevenueRecord, value: any) => void;
    onSave?: () => void;
    onCancel?: () => void;
}

// 2. Destructure the new props here
export default function BaseTable({ 
    data, 
    accentColor, 
    isAdding, 
    newRow, 
    onNewRowChange, 
    onSave, 
    onCancel 
}: BaseTableProps) {
    
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
                    {/* The "Inline Form" Row */}
                    {isAdding && (
        <tr style={{ backgroundColor: '#fff9e6' }}>
            {/* 1. Changed "NEW" to be a simple label since buttons are at the top */}
            <td style={{ ...tdStyle, fontWeight: 'bold', color: '#d4a017' }}>NEW</td>
            
            <td style={tdStyle}>
                <input
                    style={inputStyle}
                    placeholder="Bill #"
                    value={newRow?.bill_no || ''}
                    onChange={(e) => onNewRowChange?.('bill_no', e.target.value)}
                />
            </td>
            
            {/* Numerical Inputs */}
            <td style={tdStyle}><input type="number" style={inputStyle} value={newRow?.amount_received ?? 0} onChange={e => onNewRowChange?.('amount_received', Number(e.target.value))} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} value={newRow?.amount_paid ?? 0} onChange={e => onNewRowChange?.('amount_paid', Number(e.target.value))} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} value={newRow?.amount_pending ?? 0} onChange={e => onNewRowChange?.('amount_pending', Number(e.target.value))} /></td>
            
            <td style={tdStyle}><input style={inputStyle} placeholder="Description" value={newRow?.description || ''} onChange={e => onNewRowChange?.('description', e.target.value)} /></td>
            
            <td style={tdStyle}>
                <select style={inputStyle} value={newRow?.payment_mode || 'CASH'} onChange={e => onNewRowChange?.('payment_mode', e.target.value)}>
                    <option value="CASH">CASH</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">BANK</option>
                </select>
            </td>
            
            <td style={tdStyle}><input type="date" style={inputStyle} value={newRow?.payment_date || ''} onChange={e => onNewRowChange?.('payment_date', e.target.value)} /></td>
            
            <td style={tdStyle}>
                <select style={inputStyle} value={newRow?.payment_status || 'PENDING'} onChange={e => onNewRowChange?.('payment_status', e.target.value)}>
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="PARTIAL">PARTIAL</option>
                </select>
            </td>
            
            <td style={tdStyle}><input style={inputStyle} placeholder="Tracking ID" value={newRow?.tracking_id || ''} onChange={e => onNewRowChange?.('tracking_id', e.target.value)} /></td>
            
            {/* Optional Int Fields */}
            <td style={tdStyle}><input type="number" style={inputStyle} placeholder="Flat" value={newRow?.flat_id ?? ''} onChange={e => onNewRowChange?.('flat_id', e.target.value ? Number(e.target.value) : null)} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} placeholder="Vendor" value={newRow?.vendor_id ?? ''} onChange={e => onNewRowChange?.('vendor_id', e.target.value ? Number(e.target.value) : null)} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} placeholder="Event" value={newRow?.event_id ?? ''} onChange={e => onNewRowChange?.('event_id', e.target.value ? Number(e.target.value) : null)} /></td>
        </tr>
    )}

                    {/* The Data Rows */}
                    {data.length === 0 && !isAdding ? (
                        <tr><td colSpan={13} style={{...tdStyle, textAlign: 'center', padding: '20px'}}>No records found.</td></tr>
                    ) : (
                        data.map((row) => (
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
                        ))
                    )}
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

// Styles
const thStyle: React.CSSProperties = { padding: '12px 15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '0.85rem', color: '#666' };
const tdStyle: React.CSSProperties = { padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { 
    width: '100%', 
    padding: '4px', 
    border: '1px solid #ccc', 
    borderRadius: '4px', 
    fontSize: '0.85rem',
    boxSizing: 'border-box' // Essential for table alignment
};
const saveBtnStyle = { backgroundColor: '#2d5a27', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { backgroundColor: '#666', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };