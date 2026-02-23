'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [activeTable, setActiveTable] = useState('flats'); // users, projects, or tasks
  const [data, setData] = useState([]);

  // This function fetches data whenever the activeTable changes
  const fetchData = async () => {
    const response = await fetch(`/api/${activeTable}`);
    const json = await response.json();
    setData(json);
  };

  const addItem = async () => {
    const name = prompt(`Enter value for ${activeTable}:`); // Simple way to get input for now
    if (!name) return;

    // Prepare the data package based on which table is active
    let body = {};
    if (activeTable === 'flats'){ 
      const flat_number = prompt(`Enter flat name`)
      const owner_name = prompt(`Enter owner name`)
      const type = prompt(`Enter flat type(FLAT / DUPLEX)`)
      const owner_type = prompt('Enter owner type (OWNER / TENANT)')
      const mobile = prompt(`Enter mobile no`)
      const email = prompt(`Enter E-mail`)
      body = {flat_number, owner_name, type, owner_type, mobile, email}
    }
    if (activeTable === 'vendors') {
      const name = prompt("Enter name")
      const mobile = prompt("Enter mobile")
      body = {name, mobile};
    }
    if (activeTable === 'festivals'){
      const name = prompt("Enter name")
      const date = prompt("Enter date");
      body = { name, date}
    };

    await fetch(`/api/${activeTable}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    fetchData(); // Refresh the list so you see the new item!
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    await fetch(`/api/${activeTable}/${id}`, {
      method: 'DELETE',
    });

    fetchData(); // Refresh the list
  };

  useEffect(() => {
    fetchData();
  }, [activeTable]);

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-6">Database Manager</h1>
      <button 
      onClick={addItem}
      className="mb-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
    >
      + Add New to {activeTable}
    </button>
      
      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-8">
        {['flats', 'vendors', 'festivals'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTable(tab)}
            className={`px-4 py-2 rounded ${activeTable === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Data Table Display */}
      <div className="border rounded shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Data</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 font-mono text-sm">{item.id}</td>
                  <td className="p-3">{JSON.stringify(item)}</td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}