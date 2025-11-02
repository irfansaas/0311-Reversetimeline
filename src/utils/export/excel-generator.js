import * as XLSX from 'xlsx';
import { formatCurrency, formatPercentage } from '../business-case/cost-calculator';

/**
 * Generate comprehensive Excel workbook from business case calculations
 */

function createTimelineSheet(calculations) {
  const { timeline } = calculations;
  
  if (!timeline || !timeline.phases) {
    return XLSX.utils.aoa_to_sheet([["Timeline data not available"]]);
  }

  const data = [
    ['IMPLEMENTATION TIMELINE'],
    [''],
    ['TIMELINE SUMMARY'],
    ['Sequential Duration:', timeline.totals.sequentialWeeks + ' weeks'],
    ['Parallelized Duration:', timeline.totals.parallelizedWeeks + ' weeks'],
    ['Time Saved:', timeline.totals.creditWeeks + ' weeks'],
    ['Go-Live Buffer:', Math.abs(timeline.validity) + ' weeks ' + (timeline.validity >= 0 ? 'buffer' : 'short')],
    [''],
    ['IMPLEMENTATION PHASES'],
    ['Phase', 'Description', 'Duration (Weeks)', 'Percentage'],
    ...timeline.phases.items.map(phase => [
      phase.key,
      phase.label,
      phase.weeks,
      ((phase.weeks / timeline.phases.sequentialTotal) * 100).toFixed(1) + '%'
    ]),
    [''],
    ['TOTAL', '', timeline.phases.sequentialTotal, '100%'],
    [''],
    ['COMPLEXITY ASSESSMENT'],
    ['Driver', 'Complexity'],
    ['Timeline Pressure (D5)', timeline.audit.bands.D5.toUpperCase()],
    ['User Scale (D6)', timeline.audit.bands.D6.toUpperCase()],
    ['Use Cases (D7)', timeline.audit.bands.D7.toUpperCase()],
    ['Cloud Platform (D14)', timeline.audit.bands.D14.toUpperCase()],
    ['Landing Zone (D15)', timeline.audit.bands.D15.toUpperCase()],
    ['OS Version (D16)', timeline.audit.bands.D16.toUpperCase()],
    ['Change Control (D19)', timeline.audit.bands.D19.toUpperCase()],
    ['Security Review (D22)', timeline.audit.bands.D22.toUpperCase()],
    ['App Count (D25)', timeline.audit.bands.D25.toUpperCase()],
    ['App Deployment (D26)', timeline.audit.bands.D26.toUpperCase()],
    ['Backend Sensitivity (D27)', timeline.audit.bands.D27.toUpperCase()],
    ['Peripherals (D28)', timeline.audit.bands.D28.toUpperCase()],
    ['LOB Testing (D29)', timeline.audit.bands.D29.toUpperCase()],
    ['Modernization Age (D30)', timeline.audit.bands.D30.toUpperCase()],
    [''],
    ['Parallelization Factor:', (timeline.audit.parallelizationPct * 100).toFixed(0) + '%']
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 20 }, { wch: 15 }];
  
  return ws;
}


export function generateBusinessCaseExcel(calculations) {
  const { customerProfile, currentState, futureState, tcoAnalysis, roiAnalysis, implementationCost } = calculations;
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: Executive Summary
  const summarySheet = createExecutiveSummarySheet(calculations);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');
  
  // Sheet 2: Current State Costs
  const currentStateSheet = createCurrentStateSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, currentStateSheet, 'Current State');
  
  // Sheet 3: Future State Costs
  const futureStateSheet = createFutureStateSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, futureStateSheet, 'Future State');
  
  // Sheet 4: 3-Year Analysis
  const threeYearSheet = createThreeYearAnalysisSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, threeYearSheet, '3-Year Analysis');
  
  // Sheet 5: ROI Calculations
  const roiSheet = createROISheet(calculations);
  XLSX.utils.book_append_sheet(workbook, roiSheet, 'ROI Metrics');
  
  // Add Timeline sheet
  const timelineSheet = createTimelineSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, timelineSheet, 'Implementation Timeline');
  
  // Sheet 6: Value Breakdown
  const valueSheet = createValueBreakdownSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, valueSheet, 'Value Breakdown');
  
  return workbook;
}

/**
 * Sheet 1: Executive Summary
 */
function createExecutiveSummarySheet(calculations) {
  const { customerProfile, tcoAnalysis, roiAnalysis, implementationCost } = calculations;
  
  const data = [
    ['BUSINESS CASE EXECUTIVE SUMMARY'],
    [''],
    ['Customer:', customerProfile.companyName],
    ['Date:', new Date().toLocaleDateString()],
    ['Total Users:', customerProfile.totalUsers],
    [''],
    ['KEY METRICS'],
    ['3-Year Total Savings:', tcoAnalysis.savings.total, formatCurrency(tcoAnalysis.savings.total)],
    ['Annual Savings:', tcoAnalysis.savings.annual, formatCurrency(tcoAnalysis.savings.annual)],
    ['Cost Reduction %:', tcoAnalysis.savings.percentage, formatPercentage(tcoAnalysis.savings.percentage)],
    [''],
    ['ROI METRICS'],
    ['Payback Period (months):', (roiAnalysis.investment.paybackPeriod.months || 0).toFixed(1)],
    ['Year 1 ROI:', (roiAnalysis.roi.year1 || 0).toFixed(1) + '%'],
    ['Year 2 ROI:', (roiAnalysis.roi.year2 || 0).toFixed(1) + '%'],
    ['Year 3 ROI:', (roiAnalysis.roi.year3 || 0).toFixed(1) + '%'],
    ['Net Present Value:', roiAnalysis.netPresentValue, formatCurrency(roiAnalysis.netPresentValue)],
    [''],
    ['INVESTMENT'],
    ['Implementation Cost:', implementationCost.totalCost, formatCurrency(implementationCost.totalCost)],
    ['Duration (weeks):', implementationCost.durationWeeks],
    [''],
    ['ANNUAL VALUE'],
    ['Infrastructure Savings:', roiAnalysis.annualValue.infrastructureSavings, formatCurrency(roiAnalysis.annualValue.infrastructureSavings)],
    ['Operational Savings:', roiAnalysis.annualValue.operationalSavings, formatCurrency(roiAnalysis.annualValue.operationalSavings)],
    ['Productivity Gains:', roiAnalysis.annualValue.productivityGains, formatCurrency(roiAnalysis.annualValue.productivityGains)],
    ['Security Value:', roiAnalysis.annualValue.securityValue, formatCurrency(roiAnalysis.annualValue.securityValue)],
    ['TOTAL ANNUAL VALUE:', roiAnalysis.annualValue.totalAnnual, formatCurrency(roiAnalysis.annualValue.totalAnnual)]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }];
  return ws;
}

/**
 * Sheet 2: Current State Costs
 */
function createCurrentStateSheet(calculations) {
  const { currentState, customerProfile } = calculations;

  if (!currentState || !currentState.costs) {
    return XLSX.utils.aoa_to_sheet([["Current State data not available"]]);
  }
  
  const data = [
    ['CURRENT STATE COST ANALYSIS'],
    [''],
    ['Platform:', currentState.platform.toUpperCase()],
    ['Users:', customerProfile.totalUsers],
    [''],
    ['COST BREAKDOWN'],
    ['Category', 'Annual Cost', 'Monthly Cost', 'Per User/Month'],
    ['Infrastructure', currentState.costs.annual * 0.4, currentState.costs.annual * 0.4 / 12, currentState.costs.perUserMonthly * 0.4],
    ['Software Licenses', currentState.costs.annual * 0.35, currentState.costs.annual * 0.35 / 12, currentState.costs.perUserMonthly * 0.35],
    ['Operations', currentState.costs.annual * 0.25, currentState.costs.annual * 0.25 / 12, currentState.costs.perUserMonthly * 0.25],
    [''],
    ['TOTAL', currentState.costs.annual, currentState.costs.annual / 12, currentState.costs.perUserMonthly]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  return ws;
}

/**
 * Sheet 3: Future State Costs
 */
function createFutureStateSheet(calculations) {
  const { futureState, customerProfile } = calculations;
  
  if (!futureState || !futureState.infrastructure) {
    return XLSX.utils.aoa_to_sheet([["Future State data not available"]]);
  }

  const data = [
    ['FUTURE STATE COST ANALYSIS'],
    [''],
    ['Azure Virtual Desktop + Nerdio Manager for Enterprise'],
    ['Users:', customerProfile.totalUsers],
    [''],
    ['MONTHLY COSTS'],
    ['Category', 'Monthly Cost', 'Annual Cost', 'Per User/Month'],
    ['Azure VMs (' + futureState.infrastructure.vms.sku + ')', 
      futureState.infrastructure.vms.monthlyCost, 
      futureState.infrastructure.vms.annualCost, 
      futureState.infrastructure.vms.monthlyCost / customerProfile.totalUsers
    ],
    ['Azure Storage (' + futureState.infrastructure.storage.type + ')', 
      futureState.infrastructure.storage.monthlyCost, 
      futureState.infrastructure.storage.annualCost, 
      futureState.infrastructure.storage.monthlyCost / customerProfile.totalUsers
    ],
    ['Nerdio Manager', 
      futureState.software.nerdioManager.monthlyCost, 
      futureState.software.nerdioManager.annualCost, 
      futureState.software.nerdioManager.pricePerUser
    ],
    [''],
    ['SUBTOTAL', 
      futureState.totals.monthlyGross, 
      futureState.totals.annualGross, 
      futureState.totals.perUserMonthly
    ],
    [''],
    ['NERDIO OPTIMIZATIONS'],
    ['Auto-Scaling (' + futureState.infrastructure.autoScaling.savingsPercent + '% savings)', 
      -futureState.infrastructure.autoScaling.monthlySavings, 
      -futureState.infrastructure.autoScaling.annualSavings, 
      -futureState.infrastructure.autoScaling.monthlySavings / customerProfile.totalUsers
    ],
    [''],
    ['TOTAL (Net)', 
      futureState.totals.monthlyNet, 
      futureState.totals.annualNet, 
      futureState.totals.perUserMonthly
    ],
    [''],
    ['INFRASTRUCTURE DETAILS'],
    ['VM Count:', futureState.infrastructure.vms.count],
    ['VM SKU:', futureState.infrastructure.vms.sku],
    ['Storage Total:', futureState.infrastructure.storage.totalGB + ' GB'],
    ['Storage Type:', futureState.infrastructure.storage.type]
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  
  return ws;
}

/**
 * Sheet 4: 3-Year Analysis
 */
function createThreeYearAnalysisSheet(calculations) {
  const { tcoAnalysis, currentState, futureState } = calculations;
  
  const data = [
    ['3-YEAR TOTAL COST OF OWNERSHIP ANALYSIS'],
    [''],
    ['ANNUAL COSTS'],
    ['Year', 'Current State', 'Future State', 'Annual Savings'],
    ['Year 1', currentState.costs.annual, futureState.totals.annualNet, tcoAnalysis.savings.annual],
    ['Year 2', currentState.costs.annual, futureState.totals.annualNet, tcoAnalysis.savings.annual],
    ['Year 3', currentState.costs.annual, futureState.totals.annualNet, tcoAnalysis.savings.annual],
    [''],
    ['TOTAL', tcoAnalysis.currentState.totalCost, tcoAnalysis.futureState.totalCost, tcoAnalysis.savings.total]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  return ws;
}

/**
 * Sheet 5: ROI Metrics
 */
function createROISheet(calculations) {
  const { roiAnalysis, implementationCost } = calculations;
  
  const data = [
    ['ROI & INVESTMENT ANALYSIS'],
    [''],
    ['Implementation Cost:', implementationCost.totalCost],
    ['Payback Period:', (roiAnalysis.investment.paybackPeriod.months || 0).toFixed(1) + ' months'],
    [''],
    ['ROI BY YEAR'],
    ['Year 1:', (roiAnalysis.roi.year1 || 0).toFixed(1) + '%'],
    ['Year 2:', (roiAnalysis.roi.year2 || 0).toFixed(1) + '%'],
    ['Year 3:', (roiAnalysis.roi.year3 || 0).toFixed(1) + '%'],
    [''],
    ['Net Present Value:', roiAnalysis.netPresentValue]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 25 }];
  return ws;
}

/**
 * Sheet 6: Value Breakdown
 */
function createValueBreakdownSheet(calculations) {
  const { roiAnalysis } = calculations;
  
  const data = [
    ['ANNUAL VALUE BREAKDOWN'],
    [''],
    ['Category', 'Annual Value'],
    ['Infrastructure Savings', roiAnalysis.annualValue.infrastructureSavings],
    ['Operational Savings', roiAnalysis.annualValue.operationalSavings],
    ['Productivity Gains', roiAnalysis.annualValue.productivityGains],
    ['Security Value', roiAnalysis.annualValue.securityValue],
    [''],
    ['TOTAL', roiAnalysis.annualValue.totalAnnual]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 20 }];
  return ws;
}

/**
 * Main export function
 */
export function exportBusinessCaseToExcel(calculations, filename) {
  const workbook = generateBusinessCaseExcel(calculations);
  const defaultFilename = filename || `${calculations.customerProfile.companyName.replace(/\s+/g, '_')}_Business_Case_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, defaultFilename);
}
