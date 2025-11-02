#!/usr/bin/env bash

echo "Adding Timeline Section to ResultsDashboard..."
echo ""

# Backup first
cp src/components/business-case/ResultsDashboard.jsx src/components/business-case/ResultsDashboard.jsx.timeline_backup

# Find the line with "Action Buttons" comment and insert before it
TIMELINE_SECTION=$(cat <<'TIMELINE_EOF'

      {/* Implementation Timeline - DETAILED PHASES */}
      {calculations.timeline && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📅 Implementation Timeline & Phases
          </h3>
          
          {/* Timeline Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm font-semibold text-blue-600 mb-2">Sequential</div>
              <div className="text-3xl font-bold text-blue-800">
                {calculations.timeline.totals.sequentialWeeks}
              </div>
              <div className="text-xs text-blue-600 mt-1">weeks if done serially</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm font-semibold text-green-600 mb-2">Parallelized</div>
              <div className="text-3xl font-bold text-green-800">
                {calculations.timeline.totals.parallelizedWeeks}
              </div>
              <div className="text-xs text-green-600 mt-1">weeks with overlap</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-sm font-semibold text-purple-600 mb-2">Time Saved</div>
              <div className="text-3xl font-bold text-purple-800">
                {calculations.timeline.totals.creditWeeks}
              </div>
              <div className="text-xs text-purple-600 mt-1">weeks saved</div>
            </div>
            
            <div className={`rounded-lg p-4 text-center ${
              calculations.timeline.validity >= 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`text-sm font-semibold mb-2 ${
                calculations.timeline.validity >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Go-Live Buffer
              </div>
              <div className={`text-3xl font-bold ${
                calculations.timeline.validity >= 0 ? 'text-green-800' : 'text-red-800'
              }`}>
                {Math.abs(calculations.timeline.validity)}
              </div>
              <div className={`text-xs mt-1 ${
                calculations.timeline.validity >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                weeks {calculations.timeline.validity >= 0 ? 'buffer' : 'short'}
              </div>
            </div>
          </div>

          {/* Phase Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Implementation Phases
            </h4>
            {calculations.timeline.phases.items.map((phase, index) => (
              <div key={phase.key} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{phase.label}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: \`\${(phase.weeks / calculations.timeline.phases.sequentialTotal) * 100}%\` }}
                    />
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-gray-800">{phase.weeks}</div>
                  <div className="text-xs text-gray-500">weeks</div>
                </div>
              </div>
            ))}
          </div>

          {/* Complexity Drivers */}
          {calculations.timeline.audit && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Complexity Assessment
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">Timeline Pressure</div>
                  <div className={`text-sm font-bold \${
                    calculations.timeline.audit.bands.D5 === 'simple' ? 'text-green-600' :
                    calculations.timeline.audit.bands.D5 === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }\`}>
                    {calculations.timeline.audit.bands.D5.toUpperCase()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">User Scale</div>
                  <div className={`text-sm font-bold \${
                    calculations.timeline.audit.bands.D6 === 'simple' ? 'text-green-600' :
                    calculations.timeline.audit.bands.D6 === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }\`}>
                    {calculations.timeline.audit.bands.D6.toUpperCase()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">Use Cases</div>
                  <div className={`text-sm font-bold \${
                    calculations.timeline.audit.bands.D7 === 'simple' ? 'text-green-600' :
                    calculations.timeline.audit.bands.D7 === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }\`}>
                    {calculations.timeline.audit.bands.D7.toUpperCase()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">App Complexity</div>
                  <div className={`text-sm font-bold \${
                    calculations.timeline.audit.bands.D25 === 'simple' ? 'text-green-600' :
                    calculations.timeline.audit.bands.D25 === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }\`}>
                    {calculations.timeline.audit.bands.D25.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
TIMELINE_EOF
)

# Insert before "Action Buttons" section
awk -v section="$TIMELINE_SECTION" '
/Action Buttons/ { print section }
{ print }
' src/components/business-case/ResultsDashboard.jsx.timeline_backup > src/components/business-case/ResultsDashboard.jsx

echo "✓ Added Timeline Section to ResultsDashboard"
echo ""
echo "Rebuild and test:"
echo "  npm run build && npm run preview"
echo ""
echo "Backup saved: ResultsDashboard.jsx.timeline_backup"
