import React from 'react';
import { BaseTableProps, RevenueRecord } from './types';
import { Trash2, Pencil, Check, X } from 'lucide-react';



export default function BaseTable({
    data,
    accentColor,
    isAdding,
    newRow,
    onNewRowChange,
    onDelete,
    editingId,
    editRow,
    onEditStart,
    onEditChange,
    onUpdateSave,
    onUpdateCancel
}: BaseTableProps) {

    const receivedTotal = data.reduce((acc, item) => acc + Number(item.amount_received || 0), 0);
    const paidTotal = data.reduce((acc, item) => acc + Number(item.amount_paid || 0), 0);
    const pendingTotal = data.reduce((acc, item) => acc + Number(item.amount_pending || 0), 0);

    const renderInputs = (rowObj: Partial<RevenueRecord> | undefined | null, handleChange: any) => (
        <>
            <td style={tdStyle}><input style={inputStyle} placeholder="Bill #" value={rowObj?.bill_no || ''} onChange={(e) => handleChange?.('bill_no', e.target.value || null)} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} value={rowObj?.amount_received ?? ''} onChange={e => handleChange?.('amount_received', e.target.value === '' ? null : Number(e.target.value))} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} value={rowObj?.amount_paid ?? ''} onChange={e => handleChange?.('amount_paid', e.target.value === '' ? null : Number(e.target.value))} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} value={rowObj?.amount_pending ?? ''} onChange={e => handleChange?.('amount_pending', e.target.value === '' ? null : Number(e.target.value))} /></td>
            <td style={tdStyle}><input style={inputStyle} placeholder="Description" value={rowObj?.description || ''} onChange={e => handleChange?.('description', e.target.value || null)} /></td>
            <td style={tdStyle}>
                <select style={inputStyle} value={rowObj?.payment_mode || ''} onChange={e => handleChange?.('payment_mode', e.target.value || null)}>
                    <option value="">NONE</option>
                    <option value="CASH">CASH</option>
                    <option value="UPI">UPI</option>
                    <option value="NET_BANKING">NET_BANKING</option>
                </select>
            </td>
            <td style={tdStyle}><input type="date" style={inputStyle} value={rowObj?.payment_date || ''} onChange={e => handleChange?.('payment_date', e.target.value || null)} /></td>
            <td style={tdStyle}>
                <select style={inputStyle} value={rowObj?.payment_status || ''} onChange={e => handleChange?.('payment_status', e.target.value || null)}>
                    <option value="">NONE</option>
                    <option value="RECEIVED">RECEIVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="PARTIAL">PARTIAL</option>
                </select>
            </td>
            <td style={tdStyle}><input style={inputStyle} placeholder="Tracking" value={rowObj?.tracking_id || ''} onChange={e => handleChange?.('tracking_id', e.target.value || null)} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} placeholder="Flat" value={rowObj?.flat_id ?? ''} onChange={e => handleChange?.('flat_id', e.target.value ? Number(e.target.value) : null)} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} placeholder="Vendor" value={rowObj?.vendor_id ?? ''} onChange={e => handleChange?.('vendor_id', e.target.value ? Number(e.target.value) : null)} /></td>
            <td style={tdStyle}><input type="number" style={inputStyle} placeholder="Event" value={rowObj?.event_id ?? ''} onChange={e => handleChange?.('event_id', e.target.value ? Number(e.target.value) : null)} /></td>
        </>
    );

    return (
        <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                        {['ID', 'Bill No', 'Received', 'Paid', 'Pending', 'Description', 'Mode', 'Date', 'Status', 'Tracking', 'Flat ID', 'Vendor ID', 'Event ID', 'Actions'].map(h => (
                            <th key={h} style={thStyle}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* --- ADD NEW ROW --- */}
                    {isAdding && (
                        <tr style={{ backgroundColor: '#fff9e6' }}>
                            <td style={{ ...tdStyle, fontWeight: 'bold', color: '#d4a017' }}>NEW</td>
                            {renderInputs(newRow, onNewRowChange)}
                            <td style={tdStyle}>
                                <span style={{ color: '#999', fontSize: '0.8rem' }}>Pending...</span>
                            </td>
                        </tr>
                    )}

                    {/* --- DATA ROWS --- */}
                    {data.length === 0 && !isAdding ? (
                        <tr><td colSpan={14} style={{ ...tdStyle, textAlign: 'center', padding: '20px' }}>No records found.</td></tr>
                    ) : (
                        data.map((row) => {
                            const isEditing = editingId === row.id;

                            if (isEditing) {
                                return (
                                    <tr key={row.id} style={{ backgroundColor: '#e6f4ff' }}>
                                        <td style={tdStyle}>{row.id}</td>
                                        {renderInputs(editRow, onEditChange)}
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button onClick={onUpdateSave} style={saveBtnStyle} title="Update"><Check size={14} /></button>
                                                <button onClick={onUpdateCancel} style={cancelBtnStyle} title="Cancel"><X size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }

                            return (
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

                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {onEditStart && (
                                                <button onClick={() => onEditStart(row)} style={editBtnStyle} title="Edit Record">
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={onDelete ? () => onDelete(row.id) : undefined}
                                                style={onDelete ? deleteBtnStyle : deleteBtnDisableStyle}
                                                disabled={!onDelete}
                                                title="Delete Record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
                <tfoot style={{ backgroundColor: '#eee', fontWeight: 'bold' }}>
                    <tr>
                        <td style={tdStyle}>TOTAL</td>
                        <td style={tdStyle}>-</td>
                        <td style={{ ...tdStyle, color: accentColor }}>₹ {receivedTotal.toLocaleString('en-IN')}</td>
                        <td style={{ ...tdStyle, color: accentColor }}>₹ {paidTotal.toLocaleString('en-IN')}</td>
                        <td style={{ ...tdStyle, color: accentColor }}>₹ {pendingTotal.toLocaleString('en-IN')}</td>
                        <td colSpan={9} style={tdStyle}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

// --- Styles ---
const thStyle: React.CSSProperties = { padding: '12px 15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '0.85rem', color: '#666' };
const tdStyle: React.CSSProperties = { padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' };
const saveBtnStyle = { backgroundColor: '#2d5a27', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', display: 'flex' };
const cancelBtnStyle = { backgroundColor: '#666', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', display: 'flex' };
const editBtnStyle: React.CSSProperties = { backgroundColor: 'transparent', color: '#1a73e8', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' };
const deleteBtnStyle: React.CSSProperties = { backgroundColor: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' };
const deleteBtnDisableStyle: React.CSSProperties = { ...deleteBtnStyle, color: '#ccc', cursor: 'not-allowed' };