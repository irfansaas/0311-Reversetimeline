/**
 * Timeline Export Helper for PDF Generation
 * Adds timeline section to business case PDFs
 */

/**
 * Generate timeline section data for PDF
 * @param {Object} timelineResults - Results from calculateRichardTimeline
 * @returns {Object} Timeline data formatted for PDF
 */
export function generateTimelinePDFData(timelineResults) {
  if (!timelineResults) return null;
  
  const { phases, totals, validity, overlap } = timelineResults;
  
  return {
    summary: {
      totalWeeks: totals.parallelizedWeeks,
      weeksAvailable: timelineResults.weeksToGoLive || 0,
      isFeasible: validity >= 0,
      buffer: validity,
      recommendation: validity >= 0 
        ? `✅ Feasible: ${validity} weeks of buffer` 
        : `⚠️ Tight: ${Math.abs(validity)} weeks short`
    },
    phases: phases.items.map(p => ({
      name: p.label,
      weeks: p.weeks,
      description: p.label
    })),
    parallelExecution: {
      enabled: true,
      description: `Phases can run in parallel, saving ${overlap.overlappedCredit} weeks`
    }
  };
}

/**
 * Add timeline section to PDF
 * @param {jsPDF} doc - jsPDF instance
 * @param {Object} timelineData - Timeline data from generateTimelinePDFData
 * @param {number} startY - Y position to start drawing
 * @returns {number} Final Y position after drawing
 */
export function addTimelineToPDF(doc, timelineData, startY) {
  if (!timelineData) return startY;

  let yPos = startY;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Section Header
  doc.setFillColor(33, 150, 243); // Blue
  doc.rect(margin, yPos, pageWidth - 2 * margin, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Implementation Timeline', margin + 5, yPos + 8);
  yPos += 20;

  // Timeline Summary Box
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  
  // Feasibility status
  const statusColor = timelineData.summary.isFeasible ? [76, 175, 80] : [244, 67, 54]; // Green or Red
  doc.setFillColor(...statusColor);
  doc.rect(margin, yPos, 60, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text(
    timelineData.summary.isFeasible ? '✓ FEASIBLE' : '⚠ TIGHT', 
    margin + 5, 
    yPos + 7
  );

  // Summary stats
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  doc.text(`Go-Live Target: ${timelineData.goLiveDate}`, margin + 70, yPos + 7);
  yPos += 15;

  doc.setFontSize(10);
  doc.text(`Total Duration: ${timelineData.summary.totalWeeks} weeks`, margin, yPos);
  doc.text(`Weeks Available: ${timelineData.summary.weeksAvailable}`, margin + 70, yPos);
  doc.text(`Buffer: ${timelineData.summary.buffer} weeks (${timelineData.summary.variancePercent}%)`, margin + 140, yPos);
  yPos += 10;

  // Recommendation
  doc.setFont(undefined, 'italic');
  doc.setFontSize(9);
  const recommendationLines = doc.splitTextToSize(timelineData.summary.recommendation, pageWidth - 2 * margin);
  doc.text(recommendationLines, margin, yPos);
  yPos += recommendationLines.length * 5 + 10;

  // Phase Table
  doc.autoTable({
    startY: yPos,
    head: [['Phase', 'Duration', 'Description']],
    body: timelineData.phases.map(phase => [
      phase.name,
      `${phase.weeks} weeks`,
      phase.description
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: 'bold' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 'auto' }
    },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Parallel Execution Note
  if (timelineData.parallelExecution.enabled) {
    doc.setFillColor(227, 242, 253); // Light blue
    doc.rect(margin, yPos, pageWidth - 2 * margin, 15, 'F');
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('💡 Parallel Execution:', margin + 5, yPos + 6);
    doc.setFont(undefined, 'normal');
    const parallelText = doc.splitTextToSize(
      timelineData.parallelExecution.description, 
      pageWidth - 2 * margin - 10
    );
    doc.text(parallelText, margin + 5, yPos + 11);
    yPos += 20;
  }

  return yPos;
}

/**
 * Add timeline visual (simplified Gantt chart) to PDF
 * @param {jsPDF} doc - jsPDF instance
 * @param {Object} timelineData - Timeline data
 * @param {number} startY - Y position to start
 * @returns {number} Final Y position
 */
export function addTimelineVisualToPDF(doc, timelineData, startY) {
  if (!timelineData) return startY;

  let yPos = startY;
  const margin = 20;
  const chartWidth = doc.internal.pageSize.width - 2 * margin;
  const totalWeeks = timelineData.summary.totalWeeks;
  const barHeight = 8;
  const spacing = 12;

  // Title
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Visual Timeline', margin, yPos);
  yPos += 8;

  // Colors for each phase
  const colors = [
    [33, 150, 243],   // Blue
    [76, 175, 80],    // Green
    [156, 39, 176],   // Purple
    [255, 152, 0],    // Orange
    [233, 30, 99],    // Pink
    [244, 67, 54]     // Red
  ];

  // Draw each phase bar
  timelineData.phases.forEach((phase, index) => {
    const barWidth = (phase.weeks / totalWeeks) * chartWidth * 0.8;
    
    // Phase name
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(phase.name, margin, yPos + barHeight - 2);
    
    // Bar background
    doc.setFillColor(240, 240, 240);
    doc.rect(margin + 50, yPos, chartWidth - 50, barHeight, 'F');
    
    // Colored bar
    doc.setFillColor(...colors[index]);
    doc.rect(margin + 50, yPos, barWidth, barHeight, 'F');
    
    // Duration text on bar
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text(`${phase.weeks}w`, margin + 52, yPos + barHeight - 2);
    
    doc.setTextColor(0, 0, 0);
    yPos += spacing;
  });

  return yPos + 5;
}

export default {
  generateTimelinePDFData,
  addTimelineToPDF,
  addTimelineVisualToPDF
};
