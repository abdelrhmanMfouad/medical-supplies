import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportPDFProps {
  data: Record<string, unknown>[];
  title: string;
  columns: { key: string; label: string }[];
}

const ExportPDF: React.FC<ExportPDFProps> = ({ data, title, columns }) => {
  const exportToPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    autoTable(doc, {
      startY: 40,
      head: [columns.map(col => col.label)],
      body: data.map(row => columns.map(col => String(row[col.key] || ''))),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    // Title
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
    
    doc.save(`${title.toLowerCase().replace(/\s/g, '-')}.pdf`);
  };

  return (
    <button
      onClick={exportToPDF}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export PDF
    </button>
  );
};

export default ExportPDF;