import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { PaymentData } from './types';

interface PaymentReceiptProps {
  paymentData: PaymentData & {
    description: string;
    reference?: string;
    transactionId: string;
    timestamp: string;
  };
  onNewPayment: () => void;
  onViewDocument?: () => void;
  className?: string;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  paymentData,
  onNewPayment,
  onViewDocument,
  className = ''
}) => {
  const receiptRef = React.useRef<HTMLDivElement>(null);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatCardNumber = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    return `**** **** **** ${cleanNumber.slice(-4)}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      // Create canvas from the receipt element
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: receiptRef.current.offsetWidth,
        height: receiptRef.current.offsetHeight,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit on page
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        Math.min(imgHeight, pageHeight)
      );

      // Download the PDF
      pdf.save(`DFSA-Receipt-${paymentData.transactionId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div 
      ref={receiptRef}
      className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 print:shadow-none print:rounded-none print:max-w-full ${className}`}
    >
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-3 text-xl">
          ✓
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Payment Successful</h1>
        <p className="text-sm text-gray-600">Your payment has been processed successfully</p>
      </div>

      {/* Receipt Details */}
      <div className="space-y-4">
        {/* Transaction ID */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
            <p className="font-mono text-base font-semibold text-black">{paymentData.transactionId}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900 border-b pb-1">Payment Summary</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Description:</span>
              <span className="text-sm font-medium text-black text-right max-w-48 break-words">
                {paymentData.description}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="font-bold text-black text-lg">
                {formatAmount(paymentData.amount || 0, paymentData.currency || 'USD')}
              </span>
            </div>
            
            {paymentData.reference && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reference:</span>
                <span className="text-sm font-medium text-black">{paymentData.reference}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment Method:</span>
              <span className="text-sm font-medium text-black">{formatCardNumber(paymentData.number)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date & Time:</span>
              <span className="text-xs font-medium text-black text-right">
                {formatDate(paymentData.timestamp)}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-800 font-medium">Status:</span>
            <span className="text-green-800 font-bold">COMPLETED</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-2 print:hidden">
        <button
          onClick={onNewPayment}
          className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-200"
        >
          Start New Request
        </button>
        
        {onViewDocument && (
          <button
            onClick={onViewDocument}
            className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-200"
          >
            View Client Categorization Document
          </button>
        )}
        
        <button
          onClick={downloadPDF}
          className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
        >
          Download PDF Receipt
        </button>
        
        <button
          onClick={() => window.print()}
          className="w-full py-2 px-4 rounded-lg font-semibold text-black bg-gray-100 hover:bg-gray-200 transition-all duration-200"
        >
          Print Receipt
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Keep this receipt for your records
        </p>
      </div>
    </div>
  );
};