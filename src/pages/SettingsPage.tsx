import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsPanel from '../components/settings/SettingsPanel';

export default function SettingsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', marginRight: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>←</span> Back
        </button>
        <h1 style={{ color: '#fff', margin: 0, fontSize: '2rem', fontWeight: 600 }}>Settings</h1>
      </div>
      
      <SettingsPanel />
    </div>
  );
}
