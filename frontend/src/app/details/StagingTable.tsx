'use client';
import React, { useState, useEffect } from "react";
import { RotateCw, Plus, X } from "lucide-react";
import BaseTable from "./BaseTable";
import { RevenueRecord } from "./types";

const INITIAL_ROW: Partial<RevenueRecord> = {
    bill_no: '',
    amount_received: 0,
    amount_paid: 0,
    amount_pending: 0,
    description: '',
    payment_mode: 'CASH',
    payment_date: new Date().toISOString().split('T')[0],
    payment_status: 'PENDING',
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
            }
        } catch (error) {
            console.error("Failed to save row:", error);
        }
    };

    const handleCancel = () => {
        setIsAdding(true); // You could also set this to false to close the row
        setIsAdding(false);
        setNewRow(INITIAL_ROW);
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleSave} style={{...addBtnStyle, backgroundColor: '#2d5a27'}}>CONFIRM SAVE</button>
                            <button onClick={handleCancel} style={{...addBtnStyle, backgroundColor: '#666'}}>CANCEL</button>
                        </div>
                    )}
                </div>

                {/* Restored Refresh Icon Button */}
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
                onSave={handleSave} 
                onCancel={handleCancel}
            />
        </div>
    );
}

// Fixed constant names to match JSX usage
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