import React from 'react';
import { NTENT_COLORS } from '../../constants/ntentColors';
import { Target, HelpCircle } from 'lucide-react';

export default function NTENTLegend({ compact = false }) {
  const dimensions = [
    { key: 'next', letter: 'N', label: 'Next Step', description: 'Commitments & meetings' },
    { key: 'teams', letter: 'T', label: 'Teams', description: 'Stakeholders & approvers' },
    { key: 'edu', letter: 'E', label: 'Education', description: 'Proof & enablement' },
    { key: 'need', letter: 'N', label: 'Need', description: 'Priority metrics' },
    { key: 'time', letter: 'T', label: 'Timing', description: 'Deadlines & urgency' },
    { key: 'risk', letter: 'R', label: 'Risk', description: 'Blockers & concerns' }
  ];

  if (compact) {
    // Compact version - just badges in a row
    return (
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Target size={18} className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">NTENT Discovery:</span>
          {dimensions.map(dim => (
            <span
              key={dim.key}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-bold text-white"
              style={{ backgroundColor: NTENT_COLORS[dim.key]?.hex }}
              title={dim.description}
            >
              {dim.letter} {dim.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Full version - with descriptions
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <Target size={24} className="text-blue-600 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">NTENT Discovery Framework</h3>
          <p className="text-sm text-gray-600">Fields marked with NTENT badges help you gather critical discovery information</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {dimensions.map(dim => (
          <div key={dim.key} className="flex items-start gap-2">
            <span
              className="inline-block px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: NTENT_COLORS[dim.key]?.hex }}
            >
              {dim.letter}
            </span>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-900">{dim.label}</div>
              <div className="text-xs text-gray-600">{dim.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-blue-200 flex items-center gap-2 text-xs text-gray-600">
        <HelpCircle size={14} />
        <span>Hover over badges for discovery questions that help qualify opportunities</span>
      </div>
    </div>
  );
}
