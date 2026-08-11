import React from 'react';

export function Launcher({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 0',
      boxSizing: 'border-box',
    }}>
      {children}
    </div>
  );
}
