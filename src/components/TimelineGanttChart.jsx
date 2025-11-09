import React from 'react';

/**
 * Gantt Chart Component
 * Visualizes the 6-bucket timeline with parallel execution
 */
export default function TimelineGanttChart({ timelineResults }) {
  if (!timelineResults) return null;

  const { durations, timeline, parallelExecution, metadata } = timelineResults;

  // Calculate the visual layout
  const totalWeeks = Math.abs(timeline.markers.appTransformStart);
  const phases = timeline.phases;

  // Find min and max weeks for scaling
  const allWeeks = phases.flatMap(p => [p.startWeek, p.endWeek]);
  const minWeek = Math.min(...allWeeks);
  const maxWeek = Math.max(...allWeeks);
  const range = maxWeek - minWeek;

  // Colors for each bucket
  const colors = {
    0: 'bg-blue-500',
    1: 'bg-green-500',
    2: 'bg-purple-500',
    3: 'bg-orange-500',
    4: 'bg-pink-500',
    5: 'bg-red-500'
  };

  const textColors = {
    0: 'text-blue-700',
    1: 'text-green-700',
    2: 'text-purple-700',
    3: 'text-orange-700',
    4: 'text-pink-700',
    5: 'text-red-700'
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Project Timeline</h3>

      {/* Timeline Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold">{totalWeeks}w</div>
          <div className="text-sm text-gray-600">Total Duration</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-2xl font-bold">{metadata.weeksToGoLive.toFixed(0)}w</div>
          <div className="text-sm text-gray-600">Until Go-Live</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className={`text-2xl font-bold ${timelineResults.validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
            {timelineResults.validation.isValid ? '✓' : '⚠'}
          </div>
          <div className="text-sm text-gray-600">
            {timelineResults.validation.isValid ? 'Feasible' : 'Tight'}
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-2">Visual Timeline</div>
        
        {/* Week markers */}
        <div className="relative h-8 bg-gray-100 rounded mb-2">
          <div className="absolute inset-0 flex">
            {Array.from({ length: Math.ceil(range) + 1 }).map((_, i) => {
              const week = minWeek + i;
              if (week % 4 === 0 || week === 0) {
                const position = ((week - minWeek) / range) * 100;
                return (
                  <div
                    key={i}
                    className="absolute text-xs text-gray-500"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="h-8 flex flex-col justify-between">
                      <div className="w-px h-2 bg-gray-400 mx-auto"></div>
                      <div>{week === 0 ? 'Go-Live' : `${Math.abs(week)}w`}</div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Phase bars */}
        <div className="space-y-2">
          {phases.map((phase, index) => {
            const startPercent = ((phase.startWeek - minWeek) / range) * 100;
            const widthPercent = ((phase.endWeek - phase.startWeek) / range) * 100;

            return (
              <div key={index} className="relative">
                <div className="text-xs font-medium mb-1 text-gray-700">
                  {phase.name}
                </div>
                <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
                  <div
                    className={`absolute h-full ${colors[index]} opacity-80 flex items-center justify-center text-white text-xs font-semibold transition-all hover:opacity-100`}
                    style={{
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`
                    }}
                  >
                    {phase.duration}w
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parallel Execution Info */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 font-semibold mt-0.5">ℹ️</div>
          <div>
            <div className="font-semibold text-blue-900 mb-1">Parallel Execution</div>
            <div className="text-sm text-blue-800">
              Azure environment prep begins {parallelExecution.azureStartDelay.toFixed(1)} weeks into 
              app transformation (when {parallelExecution.appCompletionPercent}% complete)
            </div>
          </div>
        </div>
      </div>

      {/* Phase Details */}
      <div className="mt-6">
        <div className="text-sm font-medium mb-3">Phase Breakdown</div>
        <div className="grid grid-cols-2 gap-3">
          {phases.map((phase, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded ${colors[index]}`}></div>
              <div className={`font-medium ${textColors[index]}`}>
                {phase.duration}w
              </div>
              <div className="text-gray-600">{phase.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
