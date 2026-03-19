'use client';
import React, { useState, useEffect } from "react";
import { RotateCw } from "lucide-react"; // Import the icon
import BaseTable from "./BaseTable";

export default function StagingTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        const res = await fetch('/api/revenue');
        setData(await res.json());
        setLoading(false);
    };

    useEffect(() => { refresh(); }, []);

    return (
        <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ color: "#2d5a27", margin: 0 }}>LEDGER [FINALIZED]</h2>
                
                <button 
                    onClick={refresh} 
                    disabled={loading}
                    style={iconBtnStyle}
                    title="Refresh Staging Data"
                >
                    <RotateCw 
                        size={20} 
                        className={loading ? "animate-spin" : ""}
                        style={{ 
                            transition: 'transform 0.5s',
                            transform: loading ? 'rotate(360deg)' : 'rotate(0deg)' 
                        }} 
                    />
                </button>
            </div>
            
            <BaseTable data={data} accentColor="#2d5a27" />
        </div>
    );
}

const iconBtnStyle: React.CSSProperties = {
    padding: '8px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
};