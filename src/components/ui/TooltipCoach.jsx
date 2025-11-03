import React from 'react';
import { NTENT_COLORS } from '../../constants/ntentColors';

export default function TooltipCoach({ 
  children, 
  tone = 'info', 
  ntentDimension = null,
  className = '' 
}) {
  // Standard tones (existing)
  const standardTones = {
    info:   'bg-blue-50 border-blue-200 text-blue-800',
    tip:    'bg-amber-50 border-amber-200 text-amber-800',
    error:  'bg-red-50 border-red-200 text-red-800',
    ok:     'bg-green-50 border-green-200 text-green-800'
  };

  // NTENT-specific tones (new)
  const ntentTones = {
    next:  'bg-blue-50 border-blue-300 text-blue-900',
    teams: 'bg-cyan-50 border-cyan-300 text-cyan-900',
    edu:   'bg-green-50 border-green-300 text-green-900',
    need:  'bg-amber-50 border-amber-300 text-amber-900',
    time:  'bg-red-50 border-red-300 text-red-900',
    risk:  'bg-gray-50 border-gray-300 text-gray-900'
  };

  const toneClass = ntentTones[tone] || standardTones[tone] || standardTones.info;
  
  // NTENT badge (optional visual indicator)
  const ntentBadge = ntentDimension && (
    <span 
      className="inline-block px-2 py-0.5 text-xs font-bold rounded mr-2"
      style={{ 
        backgroundColor: NTENT_COLORS[tone]?.hex || '#6B7280',
        color: 'white'
      }}
    >
      {ntentDimension}
    </span>
  );
  
  return (
    <div className={`mt-2 text-sm border rounded-md px-3 py-2 ${toneClass} ${className}`}>
      {ntentBadge}
      {children}
    </div>
  );
}