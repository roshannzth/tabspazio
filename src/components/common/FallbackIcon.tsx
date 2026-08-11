import React from 'react';
import { getInitials, getColorFromString } from '../../services/favicon';

interface FallbackIconProps {
  name: string;
  background?: string;
  size?: number;
}

export function FallbackIcon({ name, background, size = 48 }: FallbackIconProps) {
  const bgColor = background || getColorFromString(name);
  const initials = getInitials(name).substring(0, 2);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.2)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      }}
    >
      {initials}
    </div>
  );
}
