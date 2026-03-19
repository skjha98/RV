'use client';
import React, { useState, useEffect } from "react";
import { RotateCw, Plus } from "lucide-react";
import BaseTable from "./BaseTable";
import { RevenueRecord } from "./types";

const INITIAL_ROW: Partial<RevenueRecord> = {
    bill_no: '',
    amount_received: 0,
    amount_paid: 0,
    amount_pending: 0,
    description: '',
    payment_mode: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_status: '',
    tracking_id: '',
    flat_id: undefined,
    vendor_id: undefined,
    event_id: undefined
};

export default function StagingTable() {
    const [data, setData] = useState<RevenueRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newRow, setNewRow] = useState<Partial<RevenueRecord>>(INITIAL_ROW);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editRow, setEditRow] = useState<Partial<RevenueRecord> | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/revenue/stage');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("Refresh failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const result = await fetch('/api/revenue/stage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRow),
            });

            if (result.ok) {
                setIsAdding(false);
                setNewRow(INITIAL_ROW);
                refresh();
            } else {
                alert("Failed to save revord.");
            }
        } catch (error) {
            console.error("Failed to save row:", error);
        }
    };

    const handleCancel = () => {
        setIsAdding(true);
        setIsAdding(false);
        setNewRow(INITIAL_ROW);
    };

    const handleEditStart = (row: RevenueRecord) => {
        setEditingId(row.id);
        setEditRow(row);
    };

    const handleEditChange = (field: keyof RevenueRecord, value: string | number | null) => {
        setEditRow(prev => (prev ? { ...prev, [field]: value } : null));
    };

    const handleUpdateSave = async () => {
        if (!editingId || !editRow) return;

        try {
            const res = await fetch(`/api/revenue/stage?id=${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRow),
            });

            if (res.ok) {
                setEditingId(null);
                setEditRow(null);
                refresh(); // Reload table to show updated data
            } else {
                alert("Failed to update record.");
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this staging record?")) return;

        try {
            const res = await fetch(`/api/revenue/stage?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                refresh(); // Reload the table
            } else {
                alert("Failed to delete record.");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleUpdateCancel = () => {
        setEditingId(null);
        setEditRow(null);
    };

    const handleFieldChange = (field: keyof RevenueRecord, value: string | number | null) => {
        setNewRow(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => { refresh(); }, []);

    return (
        <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <h2 style={{ color: "#d4a017", margin: 0 }}>STAGING</h2>
                    {!isAdding ? (
                        <button onClick={() => setIsAdding(true)} style={addBtnStyle}>
                            <Plus size={16} /> ADD
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={handleSave} disabled={loading} style={{ ...addBtnStyle, backgroundColor: '#2d5a27', boxShadow: '0 0 10px rgba(45,90,39,0.3)' }}>
                                {loading ? 'SAVING...' : 'CONFIRM SAVE'}
                            </button>
                            <button onClick={handleCancel} style={{ ...addBtnStyle, backgroundColor: '#666' }}>
                                CANCEL
                            </button>
                            <span style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
                                (Filling out new record below)
                            </span>
                        </div>
                    )}
                </div>

                <button
                    onClick={refresh}
                    disabled={loading}
                    style={iconBtnStyle}
                    title="Refresh Staging Data"
                >
                    <RotateCw
                        size={18}
                        style={{
                            transition: 'transform 0.5s',
                            transform: loading ? 'rotate(360deg)' : 'rotate(0deg)'
                        }}
                    />
                </button>
            </div>

            <BaseTable
                data={data}
                accentColor="#d4a017"
                isAdding={isAdding}
                newRow={newRow}
                onNewRowChange={handleFieldChange}
                onDelete={handleDelete}
                editingId={editingId}
                editRow={editRow}
                onEditStart={handleEditStart}
                onEditChange={handleEditChange}
                onUpdateSave={handleUpdateSave}
                onUpdateCancel={handleUpdateCancel}
            />
        </div>
    );
}


const iconBtnStyle: React.CSSProperties = {
    padding: '8px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const addBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 16px',
    backgroundColor: '#d4a017',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem'
};