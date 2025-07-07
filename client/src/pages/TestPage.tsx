import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Page</h1>
      <p>If you can see this, React is working correctly!</p>
      <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', borderRadius: '4px' }}>
        <h3>Environment Variables:</h3>
        <pre>{JSON.stringify({
          NODE_ENV: import.meta.env.NODE_ENV,
          VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TestPage;
