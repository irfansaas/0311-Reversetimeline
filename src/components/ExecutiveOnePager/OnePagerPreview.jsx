import React from 'react';
import { Building2, Users, Target, Clock, TrendingUp, Award } from 'lucide-react';
import { NTENT_COLORS } from '../../constants/ntentColors';

export default function OnePagerPreview({ calculations, ntentData }) {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    return `${Math.round(value)}%`;
  };

  // Extract key metrics from calculations
  const metrics = calculations?.summary || {};
  const totalSavings = metrics.totalThreeYearSavings || 0;
  const roi = metrics.roi || 0;
  const paybackMonths = metrics.paybackPeriod || 0;
  const annualValue = totalSavings / 3;

  // Company info from calculations
  const companyName = calculations?.inputs?.companyName || 'Company Name';
  const userCount = calculations?.inputs?.totalUsers || 0;

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={32} className="text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
            </div>
            <p className="text-lg text-gray-600 flex items-center gap-2">
              <Users size={18} />
              {userCount.toLocaleString()} Users
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Executive Summary</p>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
      </div>

      {/* NTENT Quick View */}
      {ntentData && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Opportunity Snapshot (NTENT)</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Next Step */}
            {ntentData.decisionMaker && (
              <div className="border rounded-lg p-4" style={{ borderColor: NTENT_COLORS.next.hex }}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Decision Maker</p>
                <p className="text-sm font-medium text-gray-900">{ntentData.decisionMaker}</p>
              </div>
            )}

            {/* Timing */}
            {ntentData.immovableDate && (
              <div className="border rounded-lg p-4" style={{ borderColor: NTENT_COLORS.time.hex }}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Key Deadline</p>
                <p className="text-sm font-medium text-gray-900">{ntentData.immovableDate}</p>
              </div>
            )}

            {/* Priority */}
            {ntentData.topMetric && (
              <div className="border rounded-lg p-4" style={{ borderColor: NTENT_COLORS.pri.hex }}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Top Priority</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{ntentData.topMetric.replace('-', ' ')}</p>
              </div>
            )}

            {/* 90-Day Goal */}
            {ntentData.ninetyDayGoal && (
              <div className="border rounded-lg p-4" style={{ borderColor: NTENT_COLORS.pri.hex }}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">90-Day Goal</p>
                <p className="text-sm font-medium text-gray-900">{ntentData.ninetyDayGoal}</p>
              </div>
            )}

            {/* Proof Type */}
            {ntentData.proofType && (
              <div className="border rounded-lg p-4" style={{ borderColor: NTENT_COLORS.edu.hex }}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Proof Required</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{ntentData.proofType.replace('-', ' ')}</p>
              </div>
            )}

            {/* Risk */}
            {ntentData.lastMileRisks && (
              <div className="border rounded-lg p-4" style={{ borderColor: NTENT_COLORS.risk.hex }}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Key Risk</p>
                <p className="text-sm font-medium text-gray-900">{ntentData.lastMileRisks}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Business Value KPIs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-emerald-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Business Value Summary</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">Total 3-Year Savings</p>
            <p className="text-2xl font-bold text-emerald-900">{formatCurrency(totalSavings)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 uppercase mb-1">ROI</p>
            <p className="text-2xl font-bold text-blue-900">{formatPercent(roi)}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
            <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Payback Period</p>
            <p className="text-2xl font-bold text-amber-900">{paybackMonths} mo</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <p className="text-xs font-semibold text-purple-700 uppercase mb-1">Annual Value</p>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(annualValue)}</p>
          </div>
        </div>
      </div>

      {/* Executive Summary Narrative */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-gray-700" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Executive Summary</h2>
        </div>
        
        <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
          <p>
            <strong>{companyName}</strong> is evaluating Azure Virtual Desktop (AVD) with Nerdio Manager 
            to modernize their virtual desktop infrastructure for <strong>{userCount.toLocaleString()} users</strong>.
          </p>

          {ntentData?.topMetric && (
            <p>
              The organization's top priority is <strong>{ntentData.topMetric.replace('-', ' ')}</strong>, 
              {ntentData.immovableDate && (
                <> with a key deadline of <strong>{ntentData.immovableDate}</strong></>
              )}.
            </p>
          )}

          <p>
            Our analysis shows a <strong>{formatPercent(roi)} ROI</strong> over three years, 
            with <strong>{formatCurrency(totalSavings)}</strong> in total cost savings. 
            The investment pays back in <strong>{paybackMonths} months</strong>, 
            delivering <strong>{formatCurrency(annualValue)}</strong> in annual value.
          </p>

          {ntentData?.ninetyDayGoal && (
            <p>
              <strong>First 90-Day Milestone:</strong> {ntentData.ninetyDayGoal}
            </p>
          )}

          {ntentData?.lastMileRisks && (
            <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
              <strong>Key Risk to Mitigate:</strong> {ntentData.lastMileRisks}
            </p>
          )}
        </div>
      </div>

      {/* Stakeholder Alignment */}
      {ntentData && (ntentData.financeApprover || ntentData.securityApprover || ntentData.opsApprover) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Stakeholder Alignment</h2>
          <div className="grid grid-cols-3 gap-4">
            {ntentData.financeApprover && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Finance</p>
                <p className="text-sm font-medium text-gray-900">{ntentData.financeApprover}</p>
              </div>
            )}
            {ntentData.securityApprover && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Security</p>
                <p className="text-sm font-medium text-gray-900">{ntentData.securityApprover}</p>
              </div>
            )}
            {ntentData.opsApprover && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Operations</p>
                <p className="text-sm font-medium text-gray-900">{ntentData.opsApprover}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-6 mt-8">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>Generated by Nerdio Value Engineering</p>
          <p>Confidential & Proprietary</p>
        </div>
      </div>
    </div>
  );
}
