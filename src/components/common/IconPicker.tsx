import React from 'react';
import { FallbackIcon } from './FallbackIcon';

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
  appName?: string;
}

export function IconPicker({ value, onChange, appName = '?' }: IconPickerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Icon URL (optional)
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {value ? (
          <img src={value} alt="Icon Preview" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'contain' }} />
        ) : (
          <FallbackIcon name={appName} />
        )}
        <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/icon.png"
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-input)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                padding: '0 16px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-button)',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
