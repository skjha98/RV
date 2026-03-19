'use client';
import React, { useState, useEffect } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { modalOverlayStyle, modalContentStyle, inputStyle, thStyle, tdStyle } from './tableStyles';
import { LookupModalProps } from './types';


export default function LookupModal({ type, onSelect, onClose }: LookupModalProps) {
    const [items, setItems] = useState<any[]>([]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [activeFilterField, setActiveFilterField] = useState<string | null>(null);

    // Define columns based on the type
    const columnMap: Record<string, string[]> = {
        flat_id: ['id', 'flat_number', 'owner_name', 'occupancy'],
        vendor_id: ['id', 'name', 'mobile'],
        event_id: ['id', 'name', 'date']
    };

    const columns = columnMap[type] || ['id', 'name'];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const endpoint = type === 'flat_id' ? '/api/flats' : type === 'vendor_id' ? '/api/vendors' : '/api/events';
                const res = await fetch(endpoint);
                const data = await res.json();
                setItems(data);
            } catch (err) { console.error("Fetch failed", err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [type]);

    // Multi-column filtering logic
    const filteredItems = items.filter(item => {
        return columns.every(col => {
            const val = String(item[col] || "").toLowerCase();
            const filterVal = (filters[col] || "").toLowerCase();
            return val.includes(filterVal);
        });
    });

    const handleFilterChange = (col: string, val: string) => {
        setFilters(prev => ({ ...prev, [col]: val }));
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={{ ...modalContentStyle, width: '800px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>Search {type.split('_')[0].toUpperCase()}</h3>
                    <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
                </div>

                <div style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f4f4f4', position: 'sticky', top: 0 }}>
                            <tr>
                                {columns.map(col => (
                                    <th key={col} style={{ ...thStyle, padding: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>{col.replace('_', ' ')}</span>
                                            <input 
                                                style={{ ...inputStyle, fontSize: '0.75rem', fontWeight: 'normal' }}
                                                placeholder={`Filter...`}
                                                value={filters[col] || ''}
                                                onChange={e => handleFilterChange(col, e.target.value)}
                                                onClick={e => e.stopPropagation()}
                                            />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={columns.length} style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                            ) : filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <tr 
                                        key={item.id} 
                                        onClick={() => onSelect(item.id)} 
                                        style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f7ff'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {columns.map(col => (
                                            <td key={col} style={tdStyle}>{item[col] ?? '-'}</td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={columns.length} style={{ padding: '20px', textAlign: 'center' }}>No records match filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                    Tip: Use the boxes in the header to filter specific columns. Click a row to select.
                </p>
            </div>
        </div>
    );
}