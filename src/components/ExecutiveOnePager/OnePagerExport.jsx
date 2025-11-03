import React from 'react';
import { Download } from 'lucide-react';

export default function OnePagerExport({ calculations, ntentData }) {
  const handleExport = () => {
    // Use browser's print dialog for PDF export
    // This is a simple, reliable method that works everywhere
    window.print();
  };

  const handleDownloadHTML = () => {
    // Alternative: Download as HTML for email/sharing
    const companyName = calculations?.inputs?.companyName || 'Company';
    const sanitizedName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Get the preview content
    const previewElement = document.querySelector('.one-pager-preview');
    if (!previewElement) {
      alert('Preview not found. Please try again.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} - Executive One-Pager</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  ${previewElement.innerHTML}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizedName}_executive_summary_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
      >
        <Download size={18} />
        Export PDF
      </button>
      
      <button
        onClick={handleDownloadHTML}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-semibold"
      >
        <Download size={18} />
        Download HTML
      </button>
    </div>
  );
}
