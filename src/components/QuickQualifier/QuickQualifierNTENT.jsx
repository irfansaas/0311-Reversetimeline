import React, { useState, useContext } from 'react';
import { Target, Users, GraduationCap, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { BusinessCaseContext } from '../../contexts/BusinessCaseContext';
import { NTENT_COLORS } from '../../constants/ntentColors';
import useCoachTriggers from '../../hooks/useCoachTriggers';
import TooltipCoach from '../ui/TooltipCoach';

export default function QuickQualifierNTENT() {
  const { ntentData, setNTENTData } = useContext(BusinessCaseContext);
  const coach = useCoachTriggers({ idleMs: 3500 });

  const [form, setForm] = useState(ntentData || {
    // N - Next Step
    nextMeetings: '',
    decisionMaker: '',
    targetDecisionDate: '',

    // T - Teams & Stakeholders
    financeApprover: '',
    securityApprover: '',
    opsApprover: '',
    hiddenBlockers: '',

    // E - Education & Enablement
    proofType: '',
    enablementNeeds: '',

    // N - Need & Priority
    topMetric: '',
    ninetyDayGoal: '',

    // T - Timing & Urgency
    immovableDate: '',
    bufferWeeks: '',
    blackoutWindow: '',

    // Risk Assessment
    lastMileRisks: '',
    pastBurns: ''
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    coach.onEdit(field);
  };

  const calculateScore = () => {
    const fields = Object.values(form);
    const filled = fields.filter(v => v && v.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleComplete = () => {
    setNTENTData(form);
    alert(`NTENT Qualifier saved! Score: ${calculateScore()}/100`);
  };

  const score = calculateScore();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Target size={32} />
          <h1 className="text-3xl font-bold">Quick Qualifier (NTENT)</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Comprehensive discovery framework to qualify opportunities and map stakeholders
        </p>
        <div className="mt-4 bg-white/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Completeness Score</span>
            <span className="text-2xl font-bold">{score}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* N - Next Step */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4" style={{ borderColor: NTENT_COLORS.next.hex }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: NTENT_COLORS.next.hex + '20' }}>
            <CheckCircle size={24} style={{ color: NTENT_COLORS.next.hex }} />
          </div>
          <h2 className="text-2xl font-bold">Next Step (Micro-Commitments)</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What two meetings need to happen next to make real progress?
            </label>
            <input
              type="text"
              value={form.nextMeetings}
              onChange={(e) => handleChange('nextMeetings', e.target.value)}
              onFocus={() => coach.onFocus('nextMeetings')}
              onBlur={coach.onBlur}
              placeholder="e.g., CFO approval + security signoff"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {coach.hint?.id === 'nextMeetings' && (
              <TooltipCoach tone="tip">
                Name specific meetings with decision makers, not just "follow up calls"
              </TooltipCoach>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Who must say 'yes' to move from pilot → rollout?
            </label>
            <input
              type="text"
              value={form.decisionMaker}
              onChange={(e) => handleChange('decisionMaker', e.target.value)}
              onFocus={() => coach.onFocus('decisionMaker')}
              onBlur={coach.onBlur}
              placeholder="e.g., VP of IT, CIO, CFO"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What decision do you want by [date], and what must we provide?
            </label>
            <input
              type="text"
              value={form.targetDecisionDate}
              onChange={(e) => handleChange('targetDecisionDate', e.target.value)}
              onFocus={() => coach.onFocus('targetDecisionDate')}
              onBlur={coach.onBlur}
              placeholder="e.g., TCO analysis by month-end for Q2 budget review"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* T - Teams & Stakeholders */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4" style={{ borderColor: NTENT_COLORS.teams.hex }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: NTENT_COLORS.teams.hex + '20' }}>
            <Users size={24} style={{ color: NTENT_COLORS.teams.hex }} />
          </div>
          <h2 className="text-2xl font-bold">Teams & Stakeholders</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Who signs off for finance? In what order?
            </label>
            <input
              type="text"
              value={form.financeApprover}
              onChange={(e) => handleChange('financeApprover', e.target.value)}
              placeholder="e.g., Finance Director → CFO"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Who signs off for security?
            </label>
            <input
              type="text"
              value={form.securityApprover}
              onChange={(e) => handleChange('securityApprover', e.target.value)}
              placeholder="e.g., CISO, Security Architect"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Who signs off for operations?
            </label>
            <input
              type="text"
              value={form.opsApprover}
              onChange={(e) => handleChange('opsApprover', e.target.value)}
              placeholder="e.g., IT Operations Manager"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Who will object quietly if we don't include them?
            </label>
            <input
              type="text"
              value={form.hiddenBlockers}
              onChange={(e) => handleChange('hiddenBlockers', e.target.value)}
              onFocus={() => coach.onFocus('hiddenBlockers')}
              onBlur={coach.onBlur}
              placeholder="e.g., Compliance team killed last project"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            {coach.hint?.id === 'hiddenBlockers' && (
              <TooltipCoach tone="tip">
                Think about teams that weren't consulted in past projects that caused delays
              </TooltipCoach>
            )}
          </div>
        </div>
      </div>

      {/* E - Education & Enablement */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4" style={{ borderColor: NTENT_COLORS.edu.hex }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: NTENT_COLORS.edu.hex + '20' }}>
            <GraduationCap size={24} style={{ color: NTENT_COLORS.edu.hex }} />
          </div>
          <h2 className="text-2xl font-bold">Education & Enablement</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What proof removes doubt? (Live test, reference call, or pilot)
            </label>
            <select
              value={form.proofType}
              onChange={(e) => handleChange('proofType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select proof type...</option>
              <option value="live-demo">10-min Live Demo</option>
              <option value="reference-call">Reference Call with Similar Customer</option>
              <option value="pilot">Small Pilot (30-day)</option>
              <option value="poc">Proof of Concept (Technical)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Which team needs the most enablement?
            </label>
            <input
              type="text"
              value={form.enablementNeeds}
              onChange={(e) => handleChange('enablementNeeds', e.target.value)}
              placeholder="e.g., Finance needs training on cost model"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* N - Need & Priority */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4" style={{ borderColor: NTENT_COLORS.pri.hex }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: NTENT_COLORS.pri.hex + '20' }}>
            <TrendingUp size={24} style={{ color: NTENT_COLORS.pri.hex }} />
          </div>
          <h2 className="text-2xl font-bold">Need & Priority</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Which one metric matters most to leadership?
            </label>
            <select
              value={form.topMetric}
              onChange={(e) => handleChange('topMetric', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Select priority metric...</option>
              <option value="savings">$ Cost Savings</option>
              <option value="risk">Risk Reduction / Compliance</option>
              <option value="speed">Time-to-Value / Speed</option>
              <option value="productivity">User Productivity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              If we could only do one thing in 90 days, what should it be?
            </label>
            <input
              type="text"
              value={form.ninetyDayGoal}
              onChange={(e) => handleChange('ninetyDayGoal', e.target.value)}
              onFocus={() => coach.onFocus('ninetyDayGoal')}
              onBlur={coach.onBlur}
              placeholder="e.g., Migrate 500 power users off Citrix"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {coach.hint?.id === 'ninetyDayGoal' && (
              <TooltipCoach tone="tip">
                One clear outcome that shows measurable value quickly
              </TooltipCoach>
            )}
          </div>
        </div>
      </div>

      {/* T - Timing & Urgency */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4" style={{ borderColor: NTENT_COLORS.time.hex }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: NTENT_COLORS.time.hex + '20' }}>
            <Clock size={24} style={{ color: NTENT_COLORS.time.hex }} />
          </div>
          <h2 className="text-2xl font-bold">Timing & Urgency</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What date is immovable? (Renewal, audit, end-of-support)
            </label>
            <input
              type="text"
              value={form.immovableDate}
              onChange={(e) => handleChange('immovableDate', e.target.value)}
              onFocus={() => coach.onFocus('immovableDate')}
              onBlur={coach.onBlur}
              placeholder="e.g., Citrix renewal Sept 30, 2025"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {coach.hint?.id === 'immovableDate' && (
              <TooltipCoach tone="tip">
                External forcing functions create urgency (contract renewals, audits, compliance deadlines)
              </TooltipCoach>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              How many weeks of buffer do you need before cutover?
            </label>
            <input
              type="text"
              value={form.bufferWeeks}
              onChange={(e) => handleChange('bufferWeeks', e.target.value)}
              placeholder="e.g., 4 weeks for testing and training"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Any blackout windows? (Fiscal close, holidays, major releases)
            </label>
            <input
              type="text"
              value={form.blackoutWindow}
              onChange={(e) => handleChange('blackoutWindow', e.target.value)}
              placeholder="e.g., Dec 15 - Jan 15 (holiday freeze)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4" style={{ borderColor: NTENT_COLORS.risk.hex }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: NTENT_COLORS.risk.hex + '20' }}>
            <AlertTriangle size={24} style={{ color: NTENT_COLORS.risk.hex }} />
          </div>
          <h2 className="text-2xl font-bold">Risk Assessment</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What could kill this in the last mile?
            </label>
            <input
              type="text"
              value={form.lastMileRisks}
              onChange={(e) => handleChange('lastMileRisks', e.target.value)}
              onFocus={() => coach.onFocus('lastMileRisks')}
              onBlur={coach.onBlur}
              placeholder="e.g., Legal review, change control, security findings"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            {coach.hint?.id === 'lastMileRisks' && (
              <TooltipCoach tone="tip">
                Name the specific risks that have killed similar projects before
              </TooltipCoach>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What's burned you on similar projects before?
            </label>
            <textarea
              value={form.pastBurns}
              onChange={(e) => handleChange('pastBurns', e.target.value)}
              placeholder="e.g., Last vendor promised 8 weeks, took 6 months"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setForm(ntentData || {})}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Reset
        </button>
        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
        >
          <CheckCircle size={20} />
          Complete Qualifier
        </button>
      </div>
    </div>
  );
}
