import React from 'react';

export const iconBtnStyle: React.CSSProperties = {
    padding: '8px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export const addBtnStyle: React.CSSProperties = {
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

export const thStyle: React.CSSProperties = { padding: '12px 15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '0.85rem', color: '#666' };
export const tdStyle: React.CSSProperties = { padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' };
export const inputStyle: React.CSSProperties = { width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' };
export const saveBtnStyle = { backgroundColor: '#2d5a27', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', display: 'flex' };
export const cancelBtnStyle = { backgroundColor: '#666', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', display: 'flex' };
export const editBtnStyle: React.CSSProperties = { backgroundColor: 'transparent', color: '#1a73e8', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' };
export const deleteBtnStyle: React.CSSProperties = { backgroundColor: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' };
export const deleteBtnDisableStyle: React.CSSProperties = { ...deleteBtnStyle, color: '#ccc', cursor: 'not-allowed' };

export const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

export const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
};