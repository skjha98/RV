'use client';
import Papa from 'papaparse';
import React, { useState, useRef } from 'react';
import { useTableData, TableRow } from './useTableData';
import RawEntryForm from './RawEntryForm';

interface TableMeta {
    headers: string[];
    keys: string[];
}

export default function RawPage() {
    const [activeTable, setActiveTable] = useState('flats');
    const [editId, setEditId] = useState<number | null>(null);
    
    // HELPER: Maps the UI state to your specific Express routes
    const getBaseUrl = (table: string) => {
        if (table === 'revenue') return '/api/revenue';
        if (table === 'revenue_stage') return '/api/revenue/stage';
        return `/api/${table}`;
    };

    const { 
        processedData, 
        searchTerm, 
        setSearchTerm, 
        sortConfig, 
        setSortConfig, 
        fetchData 
    } = useTableData(activeTable);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const initialForm = { 
        flat_number: '', owner_name: '', type: 'MIG', occupancy: 'OWNER', 
        mobile: '', email: '', name: '', date: '',
        bill_no: '', received_amount: 0, pending_amount: 0, payment_mode: 'UPI'
    };
    
    const [formData, setFormData] = useState<Partial<TableRow>>(initialForm);

    const handleExportCSV = () => {
        if (processedData.length === 0) return alert("No data to export");
        const csv = Papa.unparse(processedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${activeTable}_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    const deleteItem = async (id: number) => {
        if (!window.confirm(`STRICT ACTION: Delete Record ID ${id}?`)) return;
        const response = await fetch(`${getBaseUrl(activeTable)}/${id}`, { method: 'DELETE' });
        if (response.ok) fetchData();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const response = await fetch(`${getBaseUrl(activeTable)}/bulk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(results.data),
                });
                if (response.ok) {
                    alert("IMPORT SUCCESSFUL");
                    fetchData();
                    if (fileInputRef.current) fileInputRef.current.value = '';
                } else {
                    alert("IMPORT FAILED");
                }
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const base = getBaseUrl(activeTable);
        const url = editId ? `${base}/${editId}` : base;
        const response = await fetch(url, {
            method: editId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            setFormData(initialForm);
            setEditId(null);
            fetchData();
        }
    };

    const getMeta = (): TableMeta => {
        const config: Record<string, TableMeta> = {
            flats: { 
                headers: ['ID', 'Flat #', 'Owner', 'Type', 'Occupancy', 'Mobile'], 
                keys: ['id', 'flat_number', 'owner_name', 'type', 'occupancy', 'mobile'] 
            },
            vendors: { 
                headers: ['ID', 'Name', 'Mobile'], 
                keys: ['id', 'name', 'mobile'] 
            },
            occasions: { 
                headers: ['ID', 'Event', 'Date'], 
                keys: ['id', 'name', 'date'] 
            },
            revenue: {
                headers: ['Date', 'Entity', 'Bill #', 'Received', 'Pending', 'Status'],
                keys: ['payment_date', 'entity_name', 'bill_no', 'received_amount', 'pending_amount', 'payment_status']
            },
            revenue_stage: {
                headers: ['Date', 'Entity', 'Bill #', 'Received', 'Pending', 'Status'],
                keys: ['payment_date', 'entity_name', 'bill_no', 'received_amount', 'pending_amount', 'payment_status']
            }
        };
        return config[activeTable] || config.flats;
    };

    const meta = getMeta();

    return (
        <div style={{ padding: '30px', fontFamily: 'serif', color: 'black', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ borderBottom: '4px solid black', paddingBottom: '10px' }}>RAW DATABASE VIEW</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                <div>
                    {['flats', 'vendors', 'occasions', 'revenue_stage', 'revenue'].map(t => (
                        <button key={t} onClick={() => { setActiveTable(t); setEditId(null); }} style={{ 
                            marginRight: '15px', background: 'none', border: 'none', cursor: 'pointer', 
                            color: activeTable === t ? 'red' : 'black', 
                            fontWeight: activeTable === t ? 'bold' : 'normal', 
                            textDecoration: activeTable === t ? 'underline' : 'none' 
                        }}>[ {t.replace('_', ' ').toUpperCase()} ]</button>
                    ))}
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={handleExportCSV} style={{ border: '1px solid black', background: '#f0f0f0', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        [ EXPORT CSV ]
                    </button>
                    <div style={{ border: '1px solid black', padding: '5px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', marginRight: '5px' }}>SEARCH: </span>
                        <input 
                            ref={searchInputRef}
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            placeholder="..."
                            style={{ border: 'none', outline: 'none', fontFamily: 'serif', width: '150px' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ border: '1px solid black', padding: '15px' }}>
                    <h3 style={{ margin: 0, marginBottom: '10px' }}>IMPORT CSV ({activeTable.toUpperCase()})</h3>
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} />
                </div>

                <RawEntryForm 
                    activeTable={activeTable}
                    editId={editId}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={() => { setEditId(null); setFormData(initialForm); }}
                />
            </div>

            {/* PROMOTION BANNER FOR STAGING */}
            {activeTable === 'revenue_stage' && processedData.length > 0 && (
                <div style={{ background: '#fff3cd', border: '2px solid #ffeeba', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>STAGING MODE:</strong> {processedData.length} records pending review.</span>
                    <button 
                        onClick={async () => {
                            if(confirm("Promote all records to Revenue?")) {
                                const res = await fetch('/api/revenue/promote', { method: 'POST' });
                                if(res.ok) { alert("Promoted!"); fetchData(); }
                            }
                        }}
                        style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>
                        [ FINALIZE & PROMOTE ]
                    </button>
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid black' }}>
                <thead style={{ background: '#eee' }}>
                    <tr>
                        {meta.headers.map((h, i) => (
                            <th key={h} 
                                onClick={() => setSortConfig({ 
                                    key: meta.keys[i], 
                                    direction: sortConfig?.key === meta.keys[i] && sortConfig.direction === 'asc' ? 'desc' : 'asc' 
                                })} 
                                style={{ border: '1px solid black', padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                                {h.toUpperCase()}
                            </th>
                        ))}
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {processedData.map((item: any) => {
                        // Logic to show related name (Flat #, Vendor Name, or Occasion Name)
                        const entityName = item.flat?.flat_number || item.vendor?.name || item.occasion?.name || 'N/A';
                        
                        return (
                            <tr key={item.id}>
                                {meta.keys.map((k) => (
                                    <td key={k} style={{ border: '1px solid black', padding: '8px' }}>
                                        {k === 'entity_name' ? <strong>{entityName}</strong> :
                                         k.includes('date') ? (item[k] ? new Date(item[k]).toLocaleDateString() : '-') :
                                         String(item[k] ?? '-')}
                                    </td>
                                ))}
                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                    <button onClick={() => { setEditId(item.id); setFormData(item); window.scrollTo(0,0); }} style={{ color: 'blue', cursor: 'pointer', background: 'none', border: 'none', marginRight: '10px' }}>[E]</button>
                                    <button onClick={() => deleteItem(item.id)} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}>[X]</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}