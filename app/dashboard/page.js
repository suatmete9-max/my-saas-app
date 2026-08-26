'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [pageId, setPageId] = useState('');
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    const res = await fetch('/api/convert', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': 'notion_sec_HDu6BMZK_live' 
      },
      body: JSON.stringify({ pageId }),
    });
    const result = await res.json();
    setData(result);
  };

  return (
    <div style={{ padding: '20px' }}>
      <input 
        placeholder="Enter Notion Page ID" 
        value={pageId} 
        onChange={(e) => setPageId(e.target.value)} 
      />
      <button onClick={handleFetch}>Convert</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}