'use client';
import React from 'react';
// 1. IMPORT the type from your hook file
import { TableRow } from './useTableData';

interface RawEntryFormProps {
    activeTable: string;
    editId: number | null;
    // 2. Use the imported type
    formData: Partial<TableRow>;
    // 3. FIX "Unexpected any": Define exactly what the function expects
    setFormData: (data: Partial<TableRow>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function RawEntryForm({
    activeTable,
    editId,
    formData,
    setFormData,
    onSubmit,
    onCancel
}: RawEntryFormProps) {

    // 4. FIX handleChange types
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ border: '1px solid black', padding: '15px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{editId ? `EDIT ENTRY (ID: ${editId})` : 'ADD NEW ENTRY'}</h3>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {activeTable === 'flats' && (
                    <>
                        <input name="flat_number" placeholder="Flat #" value={(formData.flat_number as string) ?? ''} onChange={handleChange} required />
                        <input name="owner_name" placeholder="Owner" value={(formData.owner_name as string) ?? ''} onChange={handleChange} required />
                        <select name="type" value={(formData.type as string) ?? 'FLAT'} onChange={handleChange}>
                            <option value="FLAT">FLAT</option><option value="DUPLEX">DUPLEX</option><option value="MIG">MIG</option>
                        </select>
                        <select name="owner_type" value={(formData.owner_type as string) ?? 'OWNER'} onChange={handleChange}>
                            <option value="OWNER">OWNER</option><option value="TENANT">TENANT</option>
                        </select>
                        <input name="mobile" placeholder="Mobile" value={(formData.mobile as string) ?? ''} onChange={handleChange} />
                    </>
                )}

                {activeTable === 'vendors' && (
                    <>
                        <input name="name" placeholder="Name" value={(formData.name as string) ?? ''} onChange={handleChange} required />
                        <input name="mobile" placeholder="Mobile" value={(formData.mobile as string) ?? ''} onChange={handleChange} required />
                    </>
                )}

                {activeTable === 'occasions' && (
                    <>
                        <input
                            name="name"
                            placeholder="Occasion"
                            value={(formData.name as string) ?? ''}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="date"
                            type="date"
                            value={formData.date ? String(formData.date).split('T')[0] : ''}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

                <div style={{ width: '100%', marginTop: '5px' }}>
                    <button type="submit" style={{ background: 'black', color: 'white', padding: '5px 15px', cursor: 'pointer', marginRight: '10px', border: 'none' }}>
                        {editId ? '[ UPDATE ]' : '[ SAVE ]'}
                    </button>
                    {editId && (
                        <button type="button" onClick={onCancel} style={{ cursor: 'pointer', padding: '5px 15px', background: 'none', border: '1px solid black' }}>
                            [ CANCEL ]
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}