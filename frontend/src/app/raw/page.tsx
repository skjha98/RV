'use client';
import { useEffect, useState } from 'react';

export default function RawPage() {
    const [activeTable, setActiveTable] = useState('flats');
    const [data, setData] = useState([]);
    
    // Form State
    const [formData, setFormData] = useState({
        flat_number: '', owner_name: '', type: 'FLAT', owner_type: 'OWNER',
        mobile: '', email: '', name: '', date: ''
    });

    const fetchData = async () => {
        const response = await fetch(`/api/${activeTable}`);
        const json = await response.json();
        setData(json);
    };

    useEffect(() => {
        fetchData();
    }, [activeTable]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`/api/${activeTable}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            // Reset form and refresh table
            setFormData({ 
                flat_number: '', owner_name: '', type: 'FLAT', owner_type: 'OWNER', 
                mobile: '', email: '', name: '', date: '' 
            });
            fetchData();
        } else {
            alert("Error saving record");
        }
    };

    const deleteItem = async (id: number) => {
        const confirmed = window.confirm(`Delete ID ${id}?`);
        if (!confirmed) return;
        await fetch(`/api/${activeTable}/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const getHeaders = () => {
        if (activeTable === 'flats') return ['ID', 'Flat #', 'Owner', 'Type', 'Occupancy', 'Mobile', 'Email'];
        if (activeTable === 'vendors') return ['ID', 'Name', 'Mobile'];
        if (activeTable === 'festivals') return ['ID', 'Event Name', 'Date'];
        return [];
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'serif' }}>
            <h1>RAW DATABASE VIEW</h1>

            {/* Navigation Tabs */}
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setActiveTable('flats')} style={{
                    color: activeTable === 'flats' ? 'red' : 'black',
                    fontWeight: activeTable === 'flats' ? 'bold' : 'normal',
                    marginRight: '10px'
                }}>[FLATS]</button>
                <button onClick={() => setActiveTable('vendors')} style={{
                    color: activeTable === 'vendors' ? 'red' : 'black',
                    fontWeight: activeTable === 'vendors' ? 'bold' : 'normal',
                    marginRight: '10px'
                }}>[VENDORS]</button>
                <button onClick={() => setActiveTable('festivals')} style={{
                    color: activeTable === 'festivals' ? 'red' : 'black',
                    fontWeight: activeTable === 'festivals' ? 'bold' : 'normal'
                }}>[FESTIVALS]</button>
            </div>

            {/* Raw Form Section */}
            <div style={{ marginBottom: '30px', border: '1px solid black', padding: '15px' }}>
                <h3>ADD NEW {activeTable.toUpperCase().slice(0, -1)}</h3>
                <form onSubmit={handleSubmit}>
                    {activeTable === 'flats' && (
                        <>
                            <input placeholder="Flat Number" value={formData.flat_number} onChange={e => setFormData({ ...formData, flat_number: e.target.value })} required />
                            <input placeholder="Owner Name" value={formData.owner_name} onChange={e => setFormData({ ...formData, owner_name: e.target.value })} required />
                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="FLAT">FLAT</option>
                                <option value="DUPLEX">DUPLEX</option>
                            </select>
                            <select value={formData.owner_type} onChange={e => setFormData({ ...formData, owner_type: e.target.value })}>
                                <option value="OWNER">OWNER</option>
                                <option value="TENANT">TENANT</option>
                            </select>
                            <input placeholder="Mobile" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                            <input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </>
                    )}

                    {activeTable === 'vendors' && (
                        <>
                            <input placeholder="Vendor Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input placeholder="Mobile" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} required />
                        </>
                    )}

                    {activeTable === 'festivals' && (
                        <>
                            <input placeholder="Festival Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                        </>
                    )}

                    <button type="submit" style={{ marginLeft: '10px' }}>[ SAVE ]</button>
                </form>
            </div>

            {/* Default HTML Table Style */}
            <table border={1} cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse', color: 'black' }}>
                <thead>
                    <tr>
                        {getHeaders().map(h => (
                            <th key={h} style={{ color: 'black', textAlign: 'left' }}>{h}</th>
                        ))}
                        <th style={{ color: 'black' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item: any) => (
                        <tr key={item.id}>
                            {activeTable === 'flats' && (
                                <>
                                    <td>{item.id}</td>
                                    <td>{item.flat_number}</td>
                                    <td>{item.owner_name}</td>
                                    <td>{item.type}</td>
                                    <td>{item.owner_type}</td>
                                    <td>{item.mobile || '-'}</td>
                                    <td>{item.email || '-'}</td>
                                </>
                            )}
                            {activeTable === 'vendors' && (
                                <>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.mobile}</td>
                                </>
                            )}
                            {activeTable === 'festivals' && (
                                <>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.date}</td>
                                </>
                            )}
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}
                                >
                                    [X]
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={10} style={{textAlign: 'center'}}>No data available</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}