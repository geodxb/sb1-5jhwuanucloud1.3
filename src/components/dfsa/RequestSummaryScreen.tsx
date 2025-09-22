import React from 'react';
import { REQUEST_TYPES, BROKERS } from './types';
import type { InvestorRegistration } from './types';

interface RequestSummaryScreenProps {
  registrationData: InvestorRegistration;
  onContinue: () => void;
  onBack: () => void;
  className?: string;
}

export const RequestSummaryScreen: React.FC<RequestSummaryScreenProps> = ({
  registrationData,
  onContinue,
  onBack,
  className = ''
}) => {
  const selectedBroker = BROKERS.find(b => b.id === registrationData.brokerName);
  const selectedRequest = REQUEST_TYPES.find(r => r.id === registrationData.requestType);
  
  // Calculate number of requests and total cost
  const numberOfRequests = registrationData.numberOfInvestors || 1;
  const costPerRequest = 280; // USD
  const totalCost = numberOfRequests * costPerRequest;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Summary</h1>
        <p className="text-gray-600">Review your request details</p>
      </div>

      <div className="space-y-6">
        {/* Broker Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Broker Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Broker:</span>
              <span className="font-medium text-right">{selectedBroker?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Regulator:</span>
              <span className="font-medium">{selectedBroker?.regulator}</span>
            </div>
          </div>
        </div>

        {/* Request Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Request Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium text-right max-w-48 break-words">{selectedRequest?.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Description:</span>
              <span className="font-medium text-right max-w-48 break-words text-xs">
                {selectedRequest?.description}
              </span>
            </div>
          </div>
        </div>

        {/* Client Category (if applicable) */}
        {registrationData.investors && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Investors Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Investors:</span>
                <span className="font-medium">{registrationData.numberOfInvestors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retail Investors:</span>
                <span className="font-medium">
                  {registrationData.investors.filter(inv => inv.clientCategory === 'retail').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Professional Investors:</span>
                <span className="font-medium">
                  {registrationData.investors.filter(inv => inv.clientCategory === 'professional').length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sample Investor Information */}
        {registrationData.investors && registrationData.investors.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Sample Investor Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-xs text-gray-500 mb-2">Showing details for first investor:</p>
              <div className="flex justify-between">
                <span className="text-gray-600">Passport:</span>
                <span className="font-medium font-mono">
                  {registrationData.investors[0].passportNumber.replace(/./g, '*').slice(0, -4) + 
                   registrationData.investors[0].passportNumber.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="font-medium text-right max-w-32 break-words">
                  {registrationData.investors[0].countryOfResidence}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Investor ID:</span>
                <span className="font-medium">{registrationData.investors[0].investorId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium capitalize">{registrationData.investors[0].clientCategory}</span>
              </div>
            </div>
          </div>
        )}

        {/* Verification Information */}
        {registrationData.verification && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Verification</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Document:</span>
                <span className="font-medium">
                  {registrationData.verification.documentType === 'emirates_id' ? 'Emirates ID' : 'Passport'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number:</span>
                <span className="font-medium font-mono">
                  {registrationData.verification.documentNumber.replace(/./g, '*').slice(0, -4) + 
                   registrationData.verification.documentNumber.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="bg-black text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Cost Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Request Processing Fee:</span>
              <span>{formatCurrency(costPerRequest)}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of Requests:</span>
              <span>{numberOfRequests}</span>
            </div>
            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
              <span className="text-yellow-600 text-xs">⚠</span>
            </div>
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Important Notice</h4>
              <p className="text-sm text-yellow-800">
                By proceeding to payment, you confirm that all information provided is accurate and complete. 
                Processing fees are non-refundable once payment is completed.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 px-6 rounded-lg font-semibold text-black bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};