import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface DocumentApprovalStatusProps {
  documentId: string;
  onApprovalChange: (approved: boolean) => void;
  onContinue?: () => void;
  className?: string;
}

export const DocumentApprovalStatus: React.FC<DocumentApprovalStatusProps> = ({
  documentId,
  onApprovalChange,
  onContinue,
  className = ''
}) => {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const docRef = doc(db, 'client_categorizations', documentId);
    
    const unsubscribe = onSnapshot(docRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const newStatus = data.status || 'pending';
          setStatus(newStatus);
          onApprovalChange(newStatus === 'approved');
          setError(null);
        } else {
          setError('Document not found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to document:', error);
        setError('Failed to load document status');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [documentId, onApprovalChange]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return {
          text: 'Pending Review',
          textArabic: 'قيد المراجعة',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
      case 'approved':
        return {
          text: 'Approved',
          textArabic: 'موافق عليه',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'rejected':
        return {
          text: 'Rejected',
          textArabic: 'مرفوض',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      default:
        return {
          text: 'Unknown',
          textArabic: 'غير معروف',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  if (loading) {
    return (
      <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Document Status</h1>
          <p className="text-gray-600">Please wait while we check your document status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="py-2 px-4 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Status</h1>
        <p className="text-gray-600">Client Categorization Document Review</p>
      </div>

      <div className="space-y-6">
        {/* Status Display */}
        <div className={`p-4 rounded-lg border-2 ${statusDisplay.borderColor} ${statusDisplay.bgColor}`}>
          <div className="text-center">
            <h3 className={`text-xl font-bold ${statusDisplay.color} mb-1`}>
              {statusDisplay.text}
            </h3>
            <p className={`text-lg ${statusDisplay.color}`} dir="rtl">
              {statusDisplay.textArabic}
            </p>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Request Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Request ID:</span>
              <span className="font-mono text-xs">{documentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Status:</span>
              <span className={`font-medium ${statusDisplay.color}`}>{statusDisplay.text}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Status-specific Messages */}
        {status === 'pending' && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-1">Under Review</h4>
                <p className="text-sm text-yellow-800">
                  Your client categorization request is currently being reviewed by our team. 
                  You will be notified once the review is complete.
                </p>
                <p className="text-sm text-yellow-800 mt-2" dir="rtl">
                  طلب تصنيف العميل الخاص بك قيد المراجعة حاليًا من قبل فريقنا. سيتم إشعارك بمجرد اكتمال المراجعة.
                </p>
          </div>
        )}

        {status === 'approved' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-1">Request Approved</h4>
                <p className="text-sm text-green-800">
                  Your client categorization request has been approved. You can now proceed to payment.
                </p>
                <p className="text-sm text-green-800 mt-2" dir="rtl">
                  تم الموافقة على طلب تصنيف العميل الخاص بك. يمكنك الآن المتابعة إلى الدفع.
                </p>
          </div>
        )}

        {status === 'rejected' && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-1">Request Rejected</h4>
                <p className="text-sm text-red-800">
                  Your client categorization request has been rejected. Please review and resubmit with correct information.
                </p>
                <p className="text-sm text-red-800 mt-2" dir="rtl">
                  تم رفض طلب تصنيف العميل الخاص بك. يرجى المراجعة وإعادة التقديم بالمعلومات الصحيحة.
                </p>
          </div>
        )}

        {/* Continue Button for Approved Requests */}
        {status === 'approved' && onContinue && (
          <button
            onClick={onContinue}
            className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Continue to Payment
          </button>
        )}

        {/* Auto-refresh Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Status updates automatically • الحالة تتحدث تلقائياً
          </p>
        </div>
      </div>
    </div>
  );
};