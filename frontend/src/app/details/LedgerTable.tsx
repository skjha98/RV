'use client';
import React, { useState, useEffect } from "react";
import { RotateCw } from "lucide-react"; // Import the icon
import BaseTable from "./BaseTable";
import { iconBtnStyle } from "./tableStyles";

export default function StagingTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/revenue');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("Refresh failed", err);
        } finally {
            setLoading(false);
        }
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
                        size={18}
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
