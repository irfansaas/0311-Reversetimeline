import React from 'react';
import { NTENT_COLORS } from '../../constants/ntentColors';

export default function NTENTBadge({ dimension, showLabel = false, tooltip = '' }) {
  const dimensionMap = {
    next: { letter: 'N', label: 'Next Step' },
    teams: { letter: 'T', label: 'Teams' },
    edu: { letter: 'E', label: 'Education' },
    need: { letter: 'N', label: 'Need' },
    time: { letter: 'T', label: 'Timing' },
    risk: { letter: 'R', label: 'Risk' }
  };

  const dim = dimensionMap[dimension];
  if (!dim) return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white ml-2"
      style={{ backgroundColor: NTENT_COLORS[dimension]?.hex }}
      title={tooltip || `${dim.label} - NTENT Discovery`}
    >
      {dim.letter}
      {showLabel && <span className="ml-1">{dim.label}</span>}
    </span>
  );
}
