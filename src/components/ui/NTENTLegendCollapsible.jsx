import React, { useState } from 'react';
import { NTENT_COLORS } from '../../constants/ntentColors';
import { Target, ChevronDown, ChevronRight } from 'lucide-react';

export default function NTENTLegendCollapsible() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dimensions = [
    { key: 'next', letter: 'N', label: 'Next Step', description: 'Commitments & meetings', example: 'When can we schedule the next call?' },
    { key: 'teams', letter: 'T', label: 'Teams', description: 'Stakeholders & approvers', example: 'Who needs to approve this?' },
    { key: 'edu', letter: 'E', label: 'Education', description: 'Proof & enablement', example: 'What proof points do they need?' },
    { key: 'need', letter: 'N', label: 'Need', description: 'Priority metrics', example: 'Why is this urgent for them?' },
    { key: 'time', letter: 'T', label: 'Timing', description: 'Deadlines & urgency', example: 'What date is immovable?' },
    { key: 'risk', letter: 'R', label: 'Risk', description: 'Blockers & concerns', example: 'What could kill this deal?' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg mb-6 overflow-hidden">
      {/* Compact Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-blue-100 transition-colors"
        type="button"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Target size={16} className="text-blue-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-700">NTENT Discovery:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {dimensions.map(dim => (
              <span
                key={dim.key}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold text-white"
                style={{ backgroundColor: NTENT_COLORS[dim.key]?.hex }}
                title={dim.description}
              >
                {dim.letter}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
          <span>{isExpanded ? 'Hide' : 'Show'} guide</span>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-blue-200 p-4 bg-white">
          <p className="text-sm text-gray-600 mb-4">
            Use these badges to guide your discovery. Each field marked with a badge helps you qualify the opportunity better.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map(dim => (
              <div key={dim.key} className="flex items-start gap-2">
                <span
                  className="inline-block px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: NTENT_COLORS[dim.key]?.hex }}
                >
                  {dim.letter}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{dim.label}</div>
                  <div className="text-xs text-gray-600 mb-1">{dim.description}</div>
                  <div className="text-xs italic text-blue-600">"{dim.example}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
