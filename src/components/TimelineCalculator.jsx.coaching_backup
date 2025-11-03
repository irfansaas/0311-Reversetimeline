import React, { useState, useEffect } from 'react';
import { Calendar, Users, Cloud, AlertTriangle, CheckCircle, Info, Download, Save, RefreshCw, Server, Shield, Package, Settings, Activity } from 'lucide-react';
import { calculatePhaseOverlaps, getTimelineComparison } from '../utils/timeline/phaseOverlap';  // ← ADD THIS LINE
import TestDataButton from './TestDataButton';

const NerdioTimelineCalculator = () => {
  const [formData, setFormData] = useState({
    goLiveDate: '',
    startDate: '',
    users: '1',
    useCases: '1',
    onPremToCloud: '1',
    citrixCloud: '1',
    citrixHybrid: '1',
    citrixOnPrem: '1',
    cloud: '2',
    landingZone: '2',
    os: '1',
    changeControl: '1',
    security: '1',
    apps: '1',
    modernization: '1',
    backend: '1',
    peripherals: '1',
    cloudTesting: '1',
    lastMod: '1'
  });

  const [results, setResults] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);

  useEffect(() => {
    const today = new Date();
    const goLive = new Date(today);
    goLive.setDate(goLive.getDate() + 90);
    
    setFormData(prev => ({
      ...prev,
      startDate: today.toISOString().split('T')[0],
      goLiveDate: goLive.toISOString().split('T')[0]
    }));

    const saved = localStorage.getItem('nerdioScenarios');
    if (saved) setSavedScenarios(JSON.parse(saved));
  }, []);

  const tooltips = {
    users: "User scale impacts testing scope, migration waves, and infrastructure sizing",
    useCases: "Each use case requires different host pools, images, and configurations. Weight: 4 (HIGHEST)",
    cloud: "Azure is native platform for AVD. GCP/AWS requires additional migration effort",
    changeControl: "Change control process directly impacts deployment velocity across all phases",
    apps: "More applications mean more testing, packaging, and validation effort",
    modernization: "Application modernization has 10x WEIGHT when required - the single biggest timeline factor!",
    onPremToCloud: "Net-new cloud migration adds infrastructure and migration complexity",
    citrix: "Citrix/VMware environments require migration planning and parallel testing",
    landingZone: "Existing Azure landing zone reduces setup time significantly",
    os: "Legacy operating systems require upgrade/compatibility testing",
    security: "Security review processes gate deployments and add approval cycles",
    backend: "Backend system connections affect network design and latency requirements",
    peripherals: "Peripheral device requirements need special drivers and testing",
    cloudTesting: "Prior cloud testing reduces unknowns and accelerates deployment",
    lastMod: "Recent modernization means less technical debt and faster migration"
  };

  // Complete scoring weights matrix
  const weights = {
    users: [2, 2, 3],
    useCases: [4, 4, 4],
    onPremToCloud: [1, 2, 3],
    citrixCloud: [1, 2, 3],
    citrixHybrid: [1, 2, 3],
    citrixOnPrem: [1, 2, 3],
    cloud: [1, 2, 3],
    landingZone: [1, 2, 3],
    os: [1, 2, 3],
    changeControl: [1, 2, 3],
    security: [1, 2, 3],
    apps: [2, 2, 3],
    modernization: [2, 2, 10], // THE BIG ONE
    backend: [0, 1, 3],
    peripherals: [0, 2, 3],
    cloudTesting: [1, 2, 3],
    lastMod: [1, 2, 3]
  };

  const calculateTimeline = () => {
    const goLiveDate = new Date(formData.goLiveDate);
    const startDate = new Date(formData.startDate);
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksAvailable = Math.round((goLiveDate - startDate) / msPerWeek);

    let totalScore = 0;
    const breakdown = [];

    const factors = [
      { id: 'users', name: 'User Scale', icon: Users, category: 'Project Scope' },
      { id: 'useCases', name: 'Use Cases', icon: Activity, category: 'Project Scope' },
      { id: 'onPremToCloud', name: 'On-Prem to Cloud Migration', icon: Cloud, category: 'Tech Stack' },
      { id: 'citrixCloud', name: 'Citrix/VMware Cloud', icon: Cloud, category: 'Tech Stack' },
      { id: 'citrixHybrid', name: 'Citrix/VMware Hybrid', icon: Cloud, category: 'Tech Stack' },
      { id: 'citrixOnPrem', name: 'Citrix/VMware On-Prem', icon: Server, category: 'Tech Stack' },
      { id: 'cloud', name: 'Cloud Platform', icon: Cloud, category: 'Tech Stack' },
      { id: 'landingZone', name: 'Landing Zone', icon: Settings, category: 'Tech Stack' },
      { id: 'os', name: 'Operating Systems', icon: Server, category: 'Tech Stack' },
      { id: 'changeControl', name: 'Change Control', icon: AlertTriangle, category: 'Governance' },
      { id: 'security', name: 'Security Review', icon: Shield, category: 'Security' },
      { id: 'apps', name: 'Application Count', icon: Package, category: 'Applications' },
      { id: 'modernization', name: 'App Modernization', icon: AlertTriangle, category: 'Applications' },
      { id: 'backend', name: 'Backend Connections', icon: Server, category: 'Applications' },
      { id: 'peripherals', name: 'Peripheral Requirements', icon: Settings, category: 'Applications' },
      { id: 'cloudTesting', name: 'Cloud Testing Status', icon: CheckCircle, category: 'Applications' },
      { id: 'lastMod', name: 'Last Modernization', icon: Calendar, category: 'Applications' }
    ];

    factors.forEach(factor => {
      const value = parseInt(formData[factor.id]);
      const weight = weights[factor.id][value - 1];
      const score = value * weight;
      totalScore += score;
      breakdown.push({ 
        name: factor.name, 
        value, 
        weight, 
        score,
        icon: factor.icon,
        category: factor.category
      });
    });

    let weeksRequired;
    if (totalScore <= 25) {
      weeksRequired = 12 + Math.round(totalScore / 3);
    } else if (totalScore <= 50) {
      weeksRequired = 20 + Math.round((totalScore - 25) / 2);
    } else if (totalScore <= 75) {
      weeksRequired = 33 + Math.round((totalScore - 50) / 2.5);
    } else {
      weeksRequired = 43 + Math.round((totalScore - 75) / 3);
    }

    const delta = weeksAvailable - weeksRequired;
    
    // Define phases
// Define phases (sequential/waterfall approach)
const sequentialPhases = [
  { name: 'Prepare & Transform Applications', weeks: Math.min(9, Math.ceil(weeksRequired * 0.3)) },
  { name: 'Prepare Azure Environment', weeks: 3 },
  { name: 'Deploy Nerdio', weeks: 3 },
  { name: 'Design, Build & Configure AVD', weeks: 8 },
  { name: 'Pilot Group Testing', weeks: 4 },
  { name: 'User & Use Case Migration', weeks: 3 }
];

// Calculate phase overlaps (parallel/agile approach)
const overlapResult = calculatePhaseOverlaps(sequentialPhases);

// Adjusted weeks required with overlaps
const weeksRequiredWithOverlap = overlapResult.totalWeeksWithOverlap;
const deltaWithOverlap = weeksAvailable - weeksRequiredWithOverlap;

// Timeline comparison
const timelineComparison = getTimelineComparison(
  weeksRequired,
  weeksRequiredWithOverlap
);

setResults({
  weeksAvailable,
  weeksRequired: weeksRequiredWithOverlap, // Use overlap-adjusted weeks
  weeksRequiredSequential: weeksRequired,   // Keep original for comparison
  delta: deltaWithOverlap,                  // Use overlap-adjusted delta
  deltaSequential: delta,                   // Keep original delta
  totalScore,
  breakdown: breakdown.sort((a, b) => b.score - a.score),
  recommendations: generateRecommendations(deltaWithOverlap, breakdown, formData, totalScore),
  phases: overlapResult.adjustedPhases,     // Use overlap-adjusted phases
  phasesSequential: sequentialPhases,       // Keep original for comparison
  overlapAnalysis: overlapResult,           // Full overlap data
  timelineComparison                        // Comparison metrics
});
  };

  const generateRecommendations = (delta, breakdown, data, totalScore) => {
    const recs = [];
    
    if (delta < 0) {
      recs.push({
        type: 'critical',
        text: `Timeline is ${Math.abs(delta).toFixed(1)} weeks short. This project cannot proceed as scoped.`,
        priority: 1
      });

      if (data.modernization === '3') {
        const impact = 30;
        recs.push({
          type: 'action',
          text: `Remove app modernization from Phase 1 (saves ~${impact} complexity points = 9+ weeks)`,
          impact: 'high',
          priority: 2
        });
      }

      if (data.changeControl === '3') {
        recs.push({
          type: 'action',
          text: 'Streamline change control to weekly approvals (saves 4-6 weeks)',
          impact: 'high',
          priority: 3
        });
      }

      if (data.apps === '3') {
        recs.push({
          type: 'action',
          text: 'Reduce application scope for Phase 1 (saves 3-5 weeks)',
          impact: 'medium',
          priority: 4
        });
      }

      recs.push({
        type: 'action',
        text: `Extend go-live date by ${Math.abs(delta + 4).toFixed(1)} weeks to include buffer`,
        impact: 'high',
        priority: 5
      });

      if (data.landingZone === '3') {
        recs.push({
          type: 'action',
          text: 'Pre-build Azure landing zone before project start (saves 2-3 weeks)',
          impact: 'medium',
          priority: 6
        });
      }

    } else if (delta < 4) {
      recs.push({
        type: 'warning',
        text: `Timeline is tight with only ${delta} weeks buffer. High risk of delays.`,
        priority: 1
      });
      recs.push({
        type: 'action',
        text: 'Assign dedicated project delivery team to maintain pace',
        impact: 'medium',
        priority: 2
      });
    } else {
      recs.push({
        type: 'success',
        text: `Timeline is feasible with ${delta} weeks of buffer.`,
        priority: 1
      });
      recs.push({
        type: 'action',
        text: 'Maintain buffer for unexpected complexities during implementation',
        impact: 'low',
        priority: 2
      });
    }

    // Complexity-based recommendations
    if (totalScore > 80) {
      recs.push({
        type: 'warning',
        text: `High complexity score (${totalScore} points). Consider phased approach.`,
        priority: 7
      });
    }

    return recs.sort((a, b) => a.priority - b.priority);
  };

  const saveScenario = () => {
    const scenario = {
      id: Date.now(),
      name: `Scenario ${savedScenarios.length + 1}`,
      date: new Date().toLocaleDateString(),
      formData: { ...formData },
      results: { ...results }
    };
    
    const updated = [...savedScenarios, scenario];
    setSavedScenarios(updated);
    localStorage.setItem('nerdioScenarios', JSON.stringify(updated));
  };

  const loadScenario = (scenario) => {
    setFormData(scenario.formData);
    setResults(scenario.results);
  };

  const clearForm = () => {
    setResults(null);
    const today = new Date();
    const goLive = new Date(today);
    goLive.setDate(goLive.getDate() + 90);
    
    setFormData({
      goLiveDate: goLive.toISOString().split('T')[0],
      startDate: today.toISOString().split('T')[0],
      users: '1',
      useCases: '1',
      onPremToCloud: '1',
      citrixCloud: '1',
      citrixHybrid: '1',
      citrixOnPrem: '1',
      cloud: '2',
      landingZone: '2',
      os: '1',
      changeControl: '1',
      security: '1',
      apps: '1',
      modernization: '1',
      backend: '1',
      peripherals: '1',
      cloudTesting: '1',
      lastMod: '1'
    });
  };

  const Tooltip = ({ content, id }) => (
    <div className="relative inline-block ml-2">
      <Info 
        size={16} 
        className="text-blue-500 cursor-help"
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
      />
      {showTooltip === id && (
        <div className="absolute left-0 top-6 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50">
          {content}
        </div>
      )}
    </div>
  );

  const getValidityColor = (delta) => {
    if (delta >= 0) return 'bg-green-100 border-green-500 text-green-900';
    if (delta >= -4) return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    return 'bg-red-100 border-red-500 text-red-900';
  };

  const getValidityIcon = (delta) => {
    if (delta >= 0) return <CheckCircle className="inline mr-2" />;
    return <AlertTriangle className="inline mr-2" />;
  };

  const renderGanttTimeline = () => {
  if (!results) return null;

  const { weeksAvailable, weeksRequired, phases, overlapAnalysis } = results;
  
  // Calculate percentages for visualization
  const maxWeeks = Math.max(weeksAvailable, weeksRequired);
  const phasesWithPercent = phases.map(phase => ({
    ...phase,
    startPercent: (phase.startWeek / maxWeeks) * 100,
    widthPercent: (phase.weeks / maxWeeks) * 100
  }));

  // Phase colors
  const phaseColors = [
    'bg-nerdio-primary-500',
    'bg-indigo-500', 
    'bg-nerdio-secondary-500',
    'bg-pink-500',
    'bg-rose-500',
    'bg-orange-500'
  ];

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-nerdio-dark mb-2">Project Timeline (Parallel Execution)</h3>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{weeksRequired} weeks total duration</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              results.delta >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span>{results.delta >= 0 ? 'On track' : `${Math.abs(results.delta).toFixed(1)} weeks over`}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">⚡ {overlapAnalysis.totalTimeSaved}w saved</span>
            <span className="text-xs text-gray-500">(vs sequential)</span>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-12 gap-4 mb-4 px-6 text-sm font-semibold text-gray-500">
        <div className="col-span-3">Phase</div>
        <div className="col-span-6">Timeline</div>
        <div className="col-span-2 text-center">Duration</div>
        <div className="col-span-1 text-center">Status</div>
      </div>

      {/* Phase Rows */}
      <div className="space-y-3">
        {phasesWithPercent.map((phase, idx) => {
          const isOverflow = phase.endWeek > weeksAvailable;
          
          return (
            <div 
              key={idx}
              className="grid grid-cols-12 gap-4 items-center bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              {/* Phase Name & Duration */}
              <div className="col-span-3">
                <div className="font-semibold text-nerdio-dark text-sm">{phase.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {phase.weeks} weeks
                  {phase.overlapsWithPrevious && (
                    <span className="ml-2 text-green-600 font-semibold">
                      ⚡ -{phase.overlapWeeks.toFixed(1)}w overlap
                    </span>
                  )}
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="col-span-6 relative h-8 bg-gray-200 rounded-full overflow-visible">
                {/* Timeline scale markers */}
                <div className="absolute inset-0 flex items-center">
                  {[0, 25, 50, 75, 100].map(mark => (
                    <div 
                      key={mark}
                      className="absolute h-full w-px bg-gray-300"
                      style={{ left: `${mark}%` }}
                    ></div>
                  ))}
                </div>
                
                {/* Phase bar */}
                <div 
                  className={`absolute h-full ${isOverflow ? 'bg-red-500' : phaseColors[idx]} rounded-full transition-all ${
                    phase.overlapsWithPrevious ? 'opacity-90' : ''
                  }`}
                  style={{
                    left: `${phase.startPercent}%`,
                    width: `${phase.widthPercent}%`
                  }}
                  title={phase.overlapDescription || phase.name}
                >
                  {/* Overlap indicator */}
                  {phase.overlapsWithPrevious && (
                    <div className="absolute -left-1 top-0 h-full w-2 bg-green-400 rounded-l-full">
                      <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs text-green-600">⚡</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div className="col-span-2 text-center">
                <span className="text-lg font-semibold text-nerdio-dark">
                  W{Math.round(phase.startWeek)}-{Math.round(phase.endWeek)}
                </span>
              </div>

              {/* Status Icon */}
              <div className="col-span-1 flex justify-center">
                {isOverflow ? (
                  <AlertTriangle className="text-red-500" size={20} />
                ) : phase.overlapsWithPrevious ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Info className="text-gray-400" size={20} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlap Details */}
      {overlapAnalysis.totalTimeSaved > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <CheckCircle size={16} />
            Phase Overlap Benefits
          </h4>
          <div className="text-sm text-gray-700 space-y-1">
            {overlapAnalysis.adjustedPhases
              .filter(p => p.overlapsWithPrevious)
              .map((phase, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">⚡</span>
                  <span>{phase.overlapDescription}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Timeline scale */}
      <div className="mt-6 px-6">
        <div className="relative h-8 flex items-center justify-between text-xs text-gray-500">
          <span>Start</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>Go-Live (Week {Math.round(weeksRequired)})</span>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-nerdio-primary-50 via-white to-nerdio-primary-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-nerdio-dark flex items-center gap-3">
            <Calendar className="text-nerdio-primary-500" size={32} />
            Nerdio Go-Live Timeline Calculator
          </h1>
          <p className="text-gray-600 mt-2">
            Reverse timeline calculator: Working backwards from your go-live date to determine project feasibility
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Dates Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-nerdio-dark mb-4 flex items-center gap-2">
                <Calendar className="text-nerdio-primary-500" />
                Timeline Constraints
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Go-Live Target Date (Compelling Event)
                  </label>
                  <input
                    type="date"
                    value={formData.goLiveDate}
                    onChange={(e) => setFormData({...formData, goLiveDate: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Project Scope */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-nerdio-dark mb-4 flex items-center gap-2">
                <Users className="text-nerdio-primary-500" />
                Project Scope
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Users
                    <Tooltip id="users" content={tooltips.users} />
                  </label>
                  <select
                    value={formData.users}
                    onChange={(e) => setFormData({...formData, users: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">Less than 1,000</option>
                    <option value="2">1,000 - 5,000</option>
                    <option value="3">More than 5,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Use Cases
                    <Tooltip id="useCases" content={tooltips.useCases} />
                  </label>
                  <select
                    value={formData.useCases}
                    onChange={(e) => setFormData({...formData, useCases: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">3-5 use cases</option>
                    <option value="2">5-10 use cases</option>
                    <option value="3">10+ use cases</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Current Technology Stack */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-nerdio-dark mb-4 flex items-center gap-2">
                <Server className="text-nerdio-primary-500" />
                Current Technology Stack
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    On-Prem to Cloud Migration
                    <Tooltip id="onPremToCloud" content={tooltips.onPremToCloud} />
                  </label>
                  <select
                    value={formData.onPremToCloud}
                    onChange={(e) => setFormData({...formData, onPremToCloud: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">No</option>
                    <option value="2">Partial</option>
                    <option value="3">Yes - Full Migration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Citrix/VMware Cloud
                    <Tooltip id="citrix" content={tooltips.citrix} />
                  </label>
                  <select
                    value={formData.citrixCloud}
                    onChange={(e) => setFormData({...formData, citrixCloud: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">No</option>
                    <option value="2">Partial</option>
                    <option value="3">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Citrix/VMware Hybrid
                  </label>
                  <select
                    value={formData.citrixHybrid}
                    onChange={(e) => setFormData({...formData, citrixHybrid: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">No</option>
                    <option value="2">Partial</option>
                    <option value="3">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Citrix/VMware On-Prem
                  </label>
                  <select
                    value={formData.citrixOnPrem}
                    onChange={(e) => setFormData({...formData, citrixOnPrem: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">No</option>
                    <option value="2">Partial</option>
                    <option value="3">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cloud Platform
                    <Tooltip id="cloud" content={tooltips.cloud} />
                  </label>
                  <select
                    value={formData.cloud}
                    onChange={(e) => setFormData({...formData, cloud: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="2">Azure (Score: 2)</option>
                    <option value="2">No strategy defined (Score: 2)</option>
                    <option value="3">GCP/AWS (Score: 3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Azure Landing Zone
                    <Tooltip id="landingZone" content={tooltips.landingZone} />
                  </label>
                  <select
                    value={formData.landingZone}
                    onChange={(e) => setFormData({...formData, landingZone: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="2">Yes - Exists (Score: 2)</option>
                    <option value="2">Partial - New Needed (Score: 2)</option>
                    <option value="3">No - New to Azure (Score: 3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Operating Systems
                    <Tooltip id="os" content={tooltips.os} />
                  </label>
                  <select
                    value={formData.os}
                    onChange={(e) => setFormData({...formData, os: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">Windows 11 / Server 2019+</option>
                    <option value="2">Windows 10 / Server 2016</option>
                    <option value="3">Windows 7/8 / Server 2012</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Governance & Security */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-nerdio-dark mb-4 flex items-center gap-2">
                <Shield className="text-nerdio-primary-500" />
                Governance & Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Change Control Process
                    <Tooltip id="changeControl" content={tooltips.changeControl} />
                  </label>
                  <select
                    value={formData.changeControl}
                    onChange={(e) => setFormData({...formData, changeControl: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">Less than 1 week</option>
                    <option value="2">1-2 weeks</option>
                    <option value="3">Monthly process</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Security Review Process
                    <Tooltip id="security" content={tooltips.security} />
                  </label>
                  <select
                    value={formData.security}
                    onChange={(e) => setFormData({...formData, security: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">Accept defaults</option>
                    <option value="2">Short review process</option>
                    <option value="3">Challenging/Lengthy review</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-nerdio-dark mb-4 flex items-center gap-2">
                <Package className="text-nerdio-primary-500" />
                Application Discovery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Applications
                    <Tooltip id="apps" content={tooltips.apps} />
                  </label>
                  <select
                    value={formData.apps}
                    onChange={(e) => setFormData({...formData, apps: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">Less than 100</option>
                    <option value="2">100-300</option>
                    <option value="3">More than 300</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    App Modernization Required?
                    <Tooltip id="modernization" content={tooltips.modernization} />
                  </label>
                  <select
                    value={formData.modernization}
                    onChange={(e) => setFormData({...formData, modernization: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">No - Already modern</option>
                    <option value="2">Some repackaging needed</option>
                    <option value="3">Yes - Full modernization (Weight: 10!)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Backend System Connections
                    <Tooltip id="backend" content={tooltips.backend} />
                  </label>
                  <select
                    value={formData.backend}
                    onChange={(e) => setFormData({...formData, backend: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">No</option>
                    <option value="2">Few / Low priority</option>
                    <option value="3">Core LOB / Latency sensitive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Peripheral Device Requirements
                    <Tooltip id="peripherals" content={tooltips.peripherals} />
                  </label>
                  <select
                    value={formData.peripherals}
                    onChange={(e) => setFormData({...formData, peripherals: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">No</option>
                    <option value="2">Yes - RemoteFX capable</option>
                    <option value="3">RemoteFX + 3rd party drivers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cloud Testing Status
                    <Tooltip id="cloudTesting" content={tooltips.cloudTesting} />
                  </label>
                  <select
                    value={formData.cloudTesting}
                    onChange={(e) => setFormData({...formData, cloudTesting: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">Yes - Works well</option>
                    <option value="2">Yes - Some challenges</option>
                    <option value="3">Not tested</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Application Modernization
                    <Tooltip id="lastMod" content={tooltips.lastMod} />
                  </label>
                  <select
                    value={formData.lastMod}
                    onChange={(e) => setFormData({...formData, lastMod: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1">Recently (modern)</option>
                    <option value="2">1-2 years ago</option>
                    <option value="3">2+ years ago</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculateTimeline}
                className="flex-1 bg-nerdio-primary-500 hover:bg-nerdio-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Build Timeline
              </button>
              <button
                onClick={clearForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw size={20} />
                Clear Form
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-nerdio-dark mb-4">How It Works</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <p className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  18 complexity factors scored (1-3)
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  Weighted scoring (0-10 range)
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                  App modernization has 10x weight
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  Converts score to weeks
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  Works backwards from go-live
                </p>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm font-semibold text-yellow-800">Critical Insight</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Application modernization (weight: 10) can add 30+ points alone - often the difference between feasible and impossible!
                </p>
              </div>
            </div>

            {savedScenarios.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-nerdio-dark mb-3">Saved Scenarios</h3>
                <div className="space-y-2">
                  {savedScenarios.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => loadScenario(scenario)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                    >
                      <div className="font-semibold">{scenario.name}</div>
                      <div className="text-gray-600 text-xs">{scenario.date}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-nerdio-dark">Timeline Analysis Results</h2>
                <button
                  onClick={saveScenario}
                  className="flex items-center gap-2 bg-nerdio-primary-500 hover:bg-nerdio-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Save size={18} />
                  Save Scenario
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-nerdio-primary-50 border-2 border-nerdio-primary-200 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-nerdio-dark">{results.weeksRequired}</div>
                  <div className="text-blue-700 mt-2">Weeks Required</div>
                </div>
                <div className="bg-nerdio-secondary-50 border-2 border-nerdio-secondary-200 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-nerdio-dark">{results.weeksAvailable}</div>
                  <div className="text-purple-700 mt-2">Weeks Available</div>
                </div>
                <div className={`border-2 rounded-lg p-6 text-center ${
                  results.delta >= 0 ? 'bg-green-50 border-green-200' :
                  results.delta >= -4 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className={`text-4xl font-bold ${
                    results.delta >= 0 ? 'text-green-900' :
                    results.delta >= -4 ? 'text-yellow-900' :
                    'text-red-900'
                  }`}>
                    {results.delta > 0 ? '+' : ''}{results.delta.toFixed(1)}
                  </div>
                  <div className={`mt-2 ${
                    results.delta >= 0 ? 'text-green-700' :
                    results.delta >= -4 ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    Delta (Gap)
                  </div>
                </div>
              </div>

              {/* Validity Message */}
              <div className={`border-2 rounded-lg p-6 mb-6 ${getValidityColor(results.delta)}`}>
                <div className="text-xl font-bold flex items-center">
                  {getValidityIcon(results.delta)}
                  {results.delta >= 0 ? 'PROJECT TIMELINE IS FEASIBLE' :
                   results.delta >= -4 ? 'TIMELINE IS TIGHT - HIGH RISK' :
                   'TIMELINE IS NOT FEASIBLE'}
                </div>
                <p className="mt-2">
                  {results.delta >= 0 ? `You have ${results.delta.toFixed(1)} weeks of buffer for unexpected issues` :
                   results.delta >= -4 ? `Only ${Math.abs(results.delta).toFixed(1)} weeks short - requires immediate action` :
                   `${Math.abs(results.delta).toFixed(1)} weeks short - project cannot proceed as scoped`}
                </p>
              </div>

              {/* Gantt Timeline */}
              {renderGanttTimeline()}

              {/* Recommendations */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-nerdio-dark mb-3">Strategic Recommendations</h3>
                <div className="space-y-2">
                  {results.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.type === 'critical' ? 'bg-red-50 border-red-500' :
                        rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        rec.type === 'success' ? 'bg-green-50 border-green-500' :
                        'bg-nerdio-primary-50 border-blue-500'
                      }`}
                    >
                      <p className="text-sm font-medium">{rec.text}</p>
                      {rec.impact && (
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded font-semibold ${
                          rec.impact === 'high' ? 'bg-red-200 text-red-800' :
                          rec.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {rec.impact.toUpperCase()} IMPACT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Complexity Breakdown by Category */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-nerdio-dark mb-4">Complexity Score Breakdown</h3>
                
                {/* Group by category */}
                {['Project Scope', 'Tech Stack', 'Governance', 'Security', 'Applications'].map(category => {
                  const categoryItems = results.breakdown.filter(item => item.category === category);
                  if (categoryItems.length === 0) return null;
                  
                  const categoryTotal = categoryItems.reduce((sum, item) => sum + item.score, 0);
                  
                  return (
                    <div key={category} className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-sm text-gray-600">{categoryTotal} points</span>
                      </h4>
                      <div className="space-y-2">
                        {categoryItems.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="flex items-center gap-2 text-gray-700">
                                <Icon size={16} className="text-nerdio-primary-500" />
                                <span className="text-sm">{item.name}</span>
                              </span>
                              <span className="text-nerdio-dark font-semibold text-sm">
                                {item.score} pts <span className="text-gray-500">({item.value} × {item.weight})</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border-t-2 border-indigo-500 mt-4">
                  <span className="font-bold text-indigo-900">TOTAL COMPLEXITY SCORE</span>
                  <span className="font-bold text-indigo-900 text-xl">{results.totalScore} points</span>
                </div>

                  <div className="mt-4 text-sm text-gray-600 italic">
                  * Based on historical data from AVD migration projects
                  <br />
                  * Calculations assume a dedicated project delivery team
                </div>
              </div>
            </div>
          </div>   
        )}
      </div>
      
      {/* Test Data Buttons */}
      <TestDataButton onInject={(data) => setFormData(data)} />
    </div>
  );
};

export default NerdioTimelineCalculator;   
// Cache bust - Sat 01 Nov 2025 10:02:01 AM EDT
