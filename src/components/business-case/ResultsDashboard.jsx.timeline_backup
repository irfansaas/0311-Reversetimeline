import React, { useState } from 'react';
import { exportBusinessCaseToExcel } from '../../utils/export/excel-generator';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  Award,
  Leaf,
  Download, FileSpreadsheet,
  Save,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/business-case/cost-calculator';
import { generateBusinessCasePDF } from '../../utils/export/pdf-generator';

export default function ResultsDashboard({ calculations, onSave, onStartNew, onBack }) {
  const [scenarioName, setScenarioName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      console.log('Starting PDF generation...');
      
      const doc = generateBusinessCasePDF(calculations);
      
      const filename = `${customerProfile.companyName.replace(/[^a-z0-9]/gi, '_')}_Business_Case_${new Date().toISOString().split('T')[0]}.pdf`;
      
      console.log('Saving PDF:', filename);
      doc.save(filename);
      
      console.log('PDF generated successfully!');
      setIsExporting(false);
    } catch (error) {
      console.error('Error generating PDF:', error);

      alert('Error generating PDF: ' + error.message);
      setIsExporting(false);
    }
  };

      console.log("Full calculations:", JSON.stringify(calculations, null, 2));
  const handleExportExcel = () => {
      console.log("Calculations object:", calculations);      console.log("ROI Analysis:", calculations.roiAnalysis);
    try {
      exportBusinessCaseToExcel(calculations);
      alert("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Error generating Excel: " + error.message);
    }
  };

  const {
    customerProfile,
    currentState,
    futureState,
    tcoAnalysis,
    roiAnalysis,
    implementationCost
  } = calculations;

  const handleSave = () => {
    if (scenarioName.trim()) {
      onSave(scenarioName);
      setShowSaveDialog(false);
      setScenarioName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              🎉 Business Case Complete!
            </h2>
            <p className="text-gray-600">
              {customerProfile.companyName} - {customerProfile.totalUsers.toLocaleString()} Users
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Save Scenario
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isExporting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <Download size={20} />
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet size={20} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scenario Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g., Q1 2025 Migration Plan"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="text-green-600" size={28} />
          Executive Summary
        </h3>
        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {roiAnalysis.summary}
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payback Period */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-green-600" size={24} />
            <span className="text-xs font-semibold text-gray-500 uppercase">Payback</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {roiAnalysis.investment.paybackPeriod.months.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">months</div>
        </div>

        {/* Year 1 ROI */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <span className="text-xs font-semibold text-gray-500 uppercase">Year 1 ROI</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {roiAnalysis.roi.year1.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">return on investment</div>
        </div>

        {/* Total Annual Value */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-purple-600" size={24} />
            <span className="text-xs font-semibold text-gray-500 uppercase">Annual Value</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {formatCurrency(roiAnalysis.annualValue.totalAnnual).replace('$', '$').slice(0, -3)}k
          </div>
          <div className="text-sm text-gray-600">per year</div>
        </div>

        {/* 3-Year Savings */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <Award className="text-orange-600" size={24} />
            <span className="text-xs font-semibold text-gray-500 uppercase">3-Year Savings</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {formatCurrency(tcoAnalysis.savings.total).replace('$', '$').slice(0, -3)}k
          </div>
          <div className="text-sm text-gray-600">{formatPercentage(tcoAnalysis.savings.percentage)} reduction</div>
        </div>
      </div>

      {/* TCO Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="text-purple-600" size={24} />
          Total Cost of Ownership ({tcoAnalysis.timeHorizon.years} Years)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Current State */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-3">Current State - {currentState.platform.toUpperCase()}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Annual Cost:</span>
                <span className="font-semibold">{formatCurrency(currentState.costs.annual)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Per User/Month:</span>
                <span className="font-semibold">{formatCurrency(currentState.costs.perUserMonthly)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-red-300">
                <span className="font-bold text-gray-800">{tcoAnalysis.timeHorizon.years}-Year Total:</span>
                <span className="font-bold text-red-600">{formatCurrency(tcoAnalysis.currentState.totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Future State */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-3">Future State - Azure + Nerdio</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Annual Cost:</span>
                <span className="font-semibold">{formatCurrency(futureState.totals.annualNet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Per User/Month:</span>
                <span className="font-semibold">{formatCurrency(futureState.totals.perUserMonthly)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-300">
                <span className="font-bold text-gray-800">{tcoAnalysis.timeHorizon.years}-Year Total:</span>
                <span className="font-bold text-green-600">{formatCurrency(tcoAnalysis.futureState.totalCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Summary */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-400 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Total Savings Over {tcoAnalysis.timeHorizon.years} Years</div>
              <div className="text-4xl font-bold text-green-700">{formatCurrency(tcoAnalysis.savings.total)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-600 mb-1">Cost Reduction</div>
              <div className="text-4xl font-bold text-green-700">{formatPercentage(tcoAnalysis.savings.percentage)}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-300">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle size={20} />
              <span className="font-semibold">{tcoAnalysis.recommendation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Value Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={24} />
          Annual Value Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="text-sm font-semibold text-gray-600 mb-2">Infrastructure Savings</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(roiAnalysis.annualValue.infrastructureSavings)}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="text-sm font-semibold text-gray-600 mb-2">Operational Savings</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(roiAnalysis.annualValue.operationalSavings)}
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <div className="text-sm font-semibold text-gray-600 mb-2">Productivity Gains</div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(roiAnalysis.annualValue.productivityGains)}
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
            <div className="text-sm font-semibold text-gray-600 mb-2">Security & Compliance</div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(roiAnalysis.annualValue.securityValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Operational Efficiency Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ⚙️ Operational Efficiency Gains
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-600 mb-2">Admin Time Savings</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(roiAnalysis.detailedBreakdown.operational.adminTimeSavings)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {roiAnalysis.detailedBreakdown.operational.breakdown.adminHoursPerYear} hours/year
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-600 mb-2">Auto-Scaling Management</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(roiAnalysis.detailedBreakdown.operational.autoScalingSavings)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Automated VM scheduling</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-600 mb-2">Image Management</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(roiAnalysis.detailedBreakdown.operational.imageManagementSavings)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Automated golden images</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-600 mb-2">Support Ticket Reduction</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(roiAnalysis.detailedBreakdown.operational.supportTicketSavings)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {roiAnalysis.detailedBreakdown.operational.breakdown.supportTicketsReduced} tickets/year reduced
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Leaf className="text-green-600" size={24} />
          Environmental Impact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-2">CO₂ Reduction</div>
            <div className="text-3xl font-bold text-green-600">
              {roiAnalysis.detailedBreakdown.environmental.co2ReductionTons.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">tons/year</div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-2">Equivalent Trees</div>
            <div className="text-3xl font-bold text-green-600">
              {Math.round(roiAnalysis.detailedBreakdown.environmental.co2ReductionTons * 16)}
            </div>
            <div className="text-xs text-gray-500">trees planted</div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-2">VMs Optimized</div>
            <div className="text-3xl font-bold text-green-600">
              {roiAnalysis.detailedBreakdown.environmental.vmsOptimized}
            </div>
            <div className="text-xs text-gray-500">auto-scaled</div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-2">Carbon Credit Value</div>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(roiAnalysis.detailedBreakdown.environmental.carbonCreditValue).replace('$', '$').slice(0, -3)}k
            </div>
            <div className="text-xs text-gray-500">annual</div>
          </div>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🚀 Implementation Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-2">Investment Required</div>
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(implementationCost.totalCost)}</div>
            <div className="text-xs text-gray-500 mt-1">One-time implementation</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-600 mb-2">Timeline</div>
            <div className="text-2xl font-bold text-gray-800">{implementationCost.durationWeeks} weeks</div>
            <div className="text-xs text-gray-500 mt-1">Estimated project duration</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-600 mb-2">Net Present Value</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(roiAnalysis.netPresentValue)}</div>
            <div className="text-xs text-gray-500 mt-1">3-year NPV</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded p-3 text-center">
            <div className="text-xs text-gray-600 mb-1">PM Hours</div>
            <div className="text-lg font-bold">{implementationCost.projectManagementHours}</div>
          </div>
          <div className="bg-gray-50 rounded p-3 text-center">
            <div className="text-xs text-gray-600 mb-1">Architect Hours</div>
            <div className="text-lg font-bold">{implementationCost.architectHours}</div>
          </div>
          <div className="bg-gray-50 rounded p-3 text-center">
            <div className="text-xs text-gray-600 mb-1">Engineer Hours</div>
            <div className="text-lg font-bold">{implementationCost.engineerHours}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <button
          onClick={onStartNew}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-lg"
        >
          Create New Analysis
        </button>
      </div>
    </div>
  );
}
