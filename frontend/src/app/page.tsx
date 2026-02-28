'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [activeTable, setActiveTable] = useState('flats');
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // Track editing state
  
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

  useEffect(() => {
    fetchData();
    closeForm();
  }, [activeTable]);

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    // Map existing data to form, handling date formatting for HTML input
    setFormData({
      ...initialForm,
      ...item,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/${activeTable}/${editingId}` : `/api/${activeTable}`;

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    closeForm();
    fetchData();
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    await fetch(`/api/${activeTable}/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const inputClass = "w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white text-slate-700";
  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Community Hub</h1>
            <p className="text-slate-500 mt-1">Manage residents, vendors, and events seamlessly.</p>
          </div>
          
          <button
            onClick={() => showForm ? closeForm() : setShowForm(true)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 ${
              showForm 
                ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {showForm ? '✕ Cancel' : '＋ Add New Entry'}
          </button>
        </header>

        <nav className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-2xl mb-8 w-full md:w-fit">
          {['flats', 'vendors', 'occasions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTable(tab)}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTable === tab 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {showForm && (
          <div className="mb-10 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {editingId ? `Update ${activeTable.slice(0, -1)} #${editingId}` : `Create ${activeTable.slice(0, -1)}`}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTable === 'flats' && (
                <>
                  <div><label className={labelClass}>Flat No.</label><input className={inputClass} placeholder="e.g. A-101" value={formData.flat_number ?? ''} onChange={e => setFormData({ ...formData, flat_number: e.target.value })} required /></div>
                  <div><label className={labelClass}>Owner Name</label><input className={inputClass} placeholder="John Doe" value={formData.owner_name ?? ''} onChange={e => setFormData({ ...formData, owner_name: e.target.value })} required /></div>
                  <div><label className={labelClass}>Category</label>
                    <select className={inputClass} value={formData.type ?? ''} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                      <option value="FLAT">Standard Flat</option>
                      <option value="DUPLEX">Duplex Unit</option>
                    </select>
                  </div>
                  <div><label className={labelClass}>Occupancy</label>
                    <select className={inputClass} value={formData.owner_type ?? ''} onChange={e => setFormData({ ...formData, owner_type: e.target.value })}>
                      <option value="OWNER">Owner Occupied</option>
                      <option value="TENANT">Tenant Rented</option>
                    </select>
                  </div>
                  <div><label className={labelClass}>Mobile</label><input className={inputClass} placeholder="10-digit number" value={formData.mobile ?? ''} onChange={e => setFormData({ ...formData, mobile: e.target.value })} /></div>
                  <div><label className={labelClass}>Email Address</label><input type="email" className={inputClass} placeholder="name@home.com" value={formData.email ?? ''} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                </>
              )}

              {activeTable === 'vendors' && (
                <>
                  <div className="col-span-1"><label className={labelClass}>Vendor Name</label><input className={inputClass} placeholder="Service Name" value={formData.name ?? ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                  <div className="col-span-1"><label className={labelClass}>Contact Number</label><input className={inputClass} placeholder="Mobile" value={formData.mobile ?? ''} onChange={e => setFormData({ ...formData, mobile: e.target.value })} required /></div>
                </>
              )}

              {activeTable === 'occasions' && (
                <>
                  <div className="col-span-1"><label className={labelClass}>Occasion Name</label><input className={inputClass} placeholder="Occasion" value={formData.name ?? ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                  <div className="col-span-1"><label className={labelClass}>Event Date</label><input type="date" className={inputClass} value={formData.date ?? ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required /></div>
                </>
              )}

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]">
                  {editingId ? 'Save Changes' : 'Confirm & Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ref</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Details</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.length > 0 ? data.map((item: any) => (
                <tr key={item.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-md font-mono text-xs font-bold ring-1 ring-slate-200">
                      #{item.id}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {activeTable === 'flats' && (
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase">
                          {item.flat_number?.[0] || 'F'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg leading-tight">{item.flat_number} <span className="text-slate-400 font-normal mx-2">|</span> {item.owner_name}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-700 uppercase tracking-tighter">{item.type}</span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-tighter">{item.owner_type}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTable === 'vendors' && (
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{item.name}</p>
                        <p className="text-slate-400 text-sm font-medium">📞 {item.mobile}</p>
                      </div>
                    )}
                    {activeTable === 'occasions' && (
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{item.name}</p>
                        <p className="text-indigo-500 text-sm font-bold flex items-center gap-1">
                          🗓️ {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)} 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4 text-2xl">📁</div>
                      <p className="text-slate-400 font-medium">No records found in {activeTable}.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}