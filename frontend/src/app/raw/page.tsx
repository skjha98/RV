'use client';
import Papa from 'papaparse';
import React, { useEffect, useState, useMemo, useRef } from 'react';

export default function RawPage() {
    const [activeTable, setActiveTable] = useState('flats');
    const [data, setData] = useState<any[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    // Refs for clearing inputs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const initialForm = {
        flat_number: '', owner_name: '', type: 'FLAT', owner_type: 'OWNER',
        mobile: '', email: '', name: '', date: ''
    };
    const [formData, setFormData] = useState(initialForm);

    const fetchData = async () => {
        const response = await fetch(`/api/${activeTable}`);
        const json = await response.json();
        setData(json);
    };

    const handleExportCSV = () => {
        if (processedData.length === 0) return alert("No data to export");

        const csv = Papa.unparse(processedData);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.setAttribute('download', `${activeTable}_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchData();
        setSearchTerm('');
        setSortConfig(null);
        // Clear file input when table changes
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [activeTable]);

    // 2. Filter and Sort Logic (Client-Side)
    const processedData = useMemo(() => {
        let result = [...data];

        // Global Filter
        if (searchTerm) {
            result = result.filter(item => 
                Object.values(item).some(val => 
                    String(val ?? '').toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key] ?? '';
                const bVal = b[sortConfig.key] ?? '';
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [data, searchTerm, sortConfig]);

    // 3. Handlers
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const response = await fetch(`/api/${activeTable}/bulk`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(results.data),
                    });
                    if (response.ok) {
                        const resJson = await response.json();
                        alert(`Imported ${resJson.count || 0} records!`);
                        fetchData();
                        // Clear file input after successful upload
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    } else {
                        alert("Bulk upload failed.");
                    }
                } catch (error) {
                    alert("Bulk upload failed.");
                }
            }
        });
    };

    // NEW: Clear search function
    const clearSearch = () => {
        setSearchTerm('');
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    // NEW: Clear file input function
    const clearFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editId ? `/api/${activeTable}/${editId}` : `/api/${activeTable}`;
        const method = editId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setFormData(initialForm);
            setEditId(null);
            fetchData();
        } else {
            alert("Failed to save data");
        }
    };

    const startEdit = (item: any) => {
        setEditId(item.id);
        setFormData({
            ...initialForm,
            ...item,
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteItem = async (id: number) => {
        if (!window.confirm(`Delete ID ${id}?`)) return;
        const response = await fetch(`/api/${activeTable}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchData();
        } else {
            alert("Failed to delete");
        }
    };

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Table UI Helpers
    const getTableMeta = () => {
        if (activeTable === 'flats') return {
            headers: ['ID', 'Flat #', 'Owner', 'Type', 'Occupancy', 'Mobile', 'Email'],
            keys: ['id', 'flat_number', 'owner_name', 'type', 'owner_type', 'mobile', 'email']
        };
        if (activeTable === 'vendors') return {
            headers: ['ID', 'Name', 'Mobile'],
            keys: ['id', 'name', 'mobile']
        };
        return {
            headers: ['ID', 'Event Name', 'Date (dd/mm/yyyy)'],
            keys: ['id', 'name', 'date']
        };
    };

    const meta = getTableMeta();

    return (
        <div style={{ padding: '30px', fontFamily: 'serif', color: 'black', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ borderBottom: '4px solid black', paddingBottom: '10px' }}>RAW DATABASE VIEW</h1>

            {/* Navigation & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                <div>
                    {['flats', 'vendors', 'occasions'].map(t => (
                        <button key={t} onClick={() => setActiveTable(t)} style={{
                            marginRight: '15px', background: 'none', border: 'none', cursor: 'pointer',
                            color: activeTable === t ? 'red' : 'black',
                            fontWeight: activeTable === t ? 'bold' : 'normal',
                            textDecoration: activeTable === t ? 'underline' : 'none'
                        }}>[ {t.toUpperCase()} ]</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Export Button */}
                    <button 
                        onClick={handleExportCSV}
                        style={{ 
                            border: '1px solid black', 
                            background: '#f0f0f0', 
                            padding: '5px 10px', 
                            cursor: 'pointer',
                            fontFamily: 'serif',
                            fontSize: '0.8rem'
                        }}
                    >
                        [ EXPORT FILTERED CSV ]
                    </button>
                    
                    <div style={{ border: '1px solid black', padding: '5px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', marginRight: '5px' }}>SEARCH: </span>
                        <input 
                            ref={searchInputRef}
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            placeholder="Filter current view..."
                            style={{ border: 'none', outline: 'none', fontFamily: 'serif', flex: 1 }}
                        />
                        {/* NEW: Clear search button */}
                        {searchTerm && (
                            <button 
                                onClick={clearSearch}
                                style={{ 
                                    border: 'none', 
                                    background: 'none', 
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    padding: '0 5px',
                                    color: '#666'
                                }}
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Import & Form Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ border: '1px solid black', padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>IMPORT CSV</h3>
                        {/* NEW: Clear file button */}
                        <button 
                            onClick={clearFileInput}
                            style={{ 
                                border: '1px solid black', 
                                background: '#f0f0f0', 
                                padding: '2px 8px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                            title="Clear selected file"
                        >
                            [ CLEAR ]
                        </button>
                    </div>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileUpload} 
                        key={activeTable} // This also helps reset the input when table changes
                    />
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                        Upload CSV with headers matching table columns
                    </p>
                </div>

                <div style={{ border: '1px solid black', padding: '15px' }}>
                    <h3>{editId ? 'EDIT ENTRY' : 'ADD NEW ENTRY'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {activeTable === 'flats' && (
                            <>
                                <input placeholder="Flat #" value={formData.flat_number ?? ''} onChange={e => setFormData({...formData, flat_number: e.target.value})} required />
                                <input placeholder="Owner" value={formData.owner_name ?? ''} onChange={e => setFormData({...formData, owner_name: e.target.value})} required />
                                <select value={formData.type ?? 'FLAT'} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="FLAT">FLAT</option><option value="DUPLEX">DUPLEX</option><option value="MIG">MIG</option>
                                </select>
                                <select value={formData.owner_type ?? 'OWNER'} onChange={e => setFormData({...formData, owner_type: e.target.value})}>
                                    <option value="OWNER">OWNER</option><option value="TENANT">TENANT</option>
                                </select>
                                <input placeholder="Mobile" value={formData.mobile ?? ''} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                            </>
                        )}
                        {activeTable === 'vendors' && (
                            <>
                                <input placeholder="Name" value={formData.name ?? ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <input placeholder="Mobile" value={formData.mobile ?? ''} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
                            </>
                        )}
                        {activeTable === 'occasions' && (
                            <>
                                <input placeholder="Occasion" value={formData.name ?? ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <input type="date" value={formData.date ?? ''} onChange={e => setFormData({...formData, date: e.target.value})} required />
                            </>
                        )}
                        <button type="submit" style={{ background: 'black', color: 'white', padding: '5px 15px', cursor: 'pointer' }}>
                            {editId ? '[ UPDATE ]' : '[ SAVE ]'}
                        </button>
                        {editId && <button type="button" onClick={() => {setEditId(null); setFormData(initialForm);}}>[ CANCEL ]</button>}
                    </form>
                </div>
            </div>

            {/* Data Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid black' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        {meta.headers.map((h, i) => (
                            <th key={h} onClick={() => requestSort(meta.keys[i])} style={{ 
                                border: '1px solid black', padding: '10px', textAlign: 'left', cursor: 'pointer' 
                            }}>
                                {h} {sortConfig?.key === meta.keys[i] ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '♢'}
                            </th>
                        ))}
                        <th style={{ border: '1px solid black' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {processedData.length > 0 ? (
                        processedData.map((item: any) => (
                            <tr key={item.id}>
                                {meta.keys.map(key => (
                                    <td key={key} style={{ border: '1px solid black', padding: '8px' }}>
                                        {key === 'date' && item[key] ? new Date(item[key]).toLocaleDateString() : (item[key] ?? '-')}
                                    </td>
                                ))}
                                <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                    <button onClick={() => startEdit(item)} style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer' }}>[E]</button>
                                    <button onClick={() => deleteItem(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>[X]</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={meta.keys.length + 1} style={{ textAlign: 'center', padding: '20px', border: '1px solid black' }}>
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {/* Optional: Show result count */}
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                Showing {processedData.length} of {data.length} records
                {searchTerm && ` (filtered from ${data.length})`}
            </div>
        </div>
    );
}