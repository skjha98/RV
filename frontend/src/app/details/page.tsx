'use client';
import React, { useState, useEffect } from "react";
import { RevenueRecord } from "./types";

export default function DetailsPage() {
    const [stagedData, setStagedData] = useState([]);
    const [productionData, setProductionData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [stageRes, prodRes] = await Promise.all([
                fetch('/api/revenue/stage'),
                fetch('/api/revenue')
            ]);
            const stageJson = await stageRes.json();
            const prodJson = await prodRes.json();

            setStagedData(stageJson);
            setProductionData(prodJson);
        } catch (err) {
            console.log("Failed to load details: ", err);
        } finally {
            setLoading(false);
        }
    }

    const renderSection = (title: string, data: RevenueRecord[], accentColor: string) => {
        const sectionTotal = data.reduce((acc, item) => acc + Number(item.received_amount || 0), 0);

        return (
        <div style={{ marginBottom: '50px' }}>
            <h2 style={{ 
                color: accentColor, 
                borderLeft: `5px solid ${accentColor}`, 
                paddingLeft: '15px',
                marginBottom: '20px' 
            }}>{title}</h2>
            
            <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            {[
                                'ID', 'Bill No', 'Received', 'Pending', 'Description', 
                                'Mode', 'Date', 'Status', 'Tracking', 'Flat ID', 'Vendor ID', 'Event ID'
                            ].map(header => (
                                <th key={header} style={thStyle}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr><td colSpan={12} style={{ ...tdStyle, textAlign: 'center', padding: '40px' }}>No records found in this section.</td></tr>
                        ) : (
                            data.map((row: RevenueRecord) => (
                                <tr key={row.id} style={trStyle}>
                                    <td style={tdStyle}>{row.id}</td>
                                    <td style={tdStyle}>{row.bill_no || '-'}</td>
                                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{row.received_amount || '0'}</td>
                                    <td style={{ ...tdStyle, color: 'red' }}>{row.pending_amount || '0'}</td>
                                    <td style={tdStyle}>{row.description || '-'}</td>
                                    <td style={tdStyle}>{row.payment_mode || '-'}</td>
                                    <td style={tdStyle}>{row.payment_date ? new Date(row.payment_date).toLocaleDateString() : 'N/A'}</td>
                                    <td style={{ 
                                        ...tdStyle, 
                                        color: row.payment_status === 'PAID' ? 'green' : 'orange',
                                        fontWeight: 'bold'
                                    }}>
                                        {row.payment_status || '-'}
                                    </td>
                                    <td style={tdStyle}>{row.tracking_id || '-'}</td>
                                    <td style={tdStyle}>{row.flat_id || '-'}</td>
                                    <td style={tdStyle}>{row.vendor_id || '-'}</td>
                                    <td style={tdStyle}>{row.occasion_id || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {data.length > 0 && (
                        <tfoot style={{ backgroundColor: '#eee', fontWeight: 'bold' }}>
                            <tr>
                                {/* ID and Bill No columns stay empty */}
                                <td style={tdStyle}>TOTAL</td>
                                <td style={tdStyle}>-</td>
                                
                                {/* The Summed Column */}
                                <td style={{ ...tdStyle, color: accentColor, fontSize: '1rem' }}>
                                    ₹ {sectionTotal.toLocaleString('en-IN')}
                                </td>
                                
                                {/* Fill the remaining 9 columns so the border stays consistent */}
                                <td colSpan={9} style={tdStyle}></td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );}

    useEffect(() => {
        loadAllData();
    }, []);

    if (loading) {
        return (<div style={{ padding: '50px', textAlign: 'center', fontSize: '1.2rem' }}>Loading Financial Records...</div>);
    }

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid black', marginBottom: '30px', paddingBottom: '10px' }}>
                <h1 style={{ margin: 0 }}>FINANCIAL RECONCILIATION</h1>
                <button onClick={loadAllData} style={refreshButtonStyle}>REFRESH DATA</button>
            </div>

            {/* Render the Stacked Layout */}
            {renderSection("Pending Staging Records", stagedData, "#d4a017")}
            {renderSection("Finalized Revenue Ledger", productionData, "#2d5a27")}
        </div>
    );
}

// Reusable Style Objects
const thStyle: React.CSSProperties = {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontSize: '0.85rem',
    color: '#666',
    textTransform: 'uppercase'
};

const tdStyle: React.CSSProperties = {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    fontSize: '0.9rem',
    color: '#333'
};

const trStyle: React.CSSProperties = {
    backgroundColor: '#fff',
};

const refreshButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
};