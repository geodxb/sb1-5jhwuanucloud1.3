import React, { useState } from 'react';
import type { InvestorRegistration } from './types';

interface DocumentVerificationFormProps {
  registrationData: Partial<InvestorRegistration>;
  onSubmit: (data: Partial<InvestorRegistration>) => void;
  onBack: () => void;
  className?: string;
}

export const DocumentVerificationForm: React.FC<DocumentVerificationFormProps> = ({
  registrationData,
  onSubmit,
  onBack,
  className = ''
}) => {
  const [verification, setVerification] = useState({
    documentType: 'emirates_id' as 'emirates_id' | 'passport',
    documentNumber: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setVerification(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!verification.documentNumber.trim()) {
      newErrors.documentNumber = 'Document number is required';
    }

    if (verification.documentType === 'emirates_id' && verification.documentNumber) {
      // Basic Emirates ID validation (15 digits)
      if (!/^\d{15}$/.test(verification.documentNumber.replace(/\s|-/g, ''))) {
        newErrors.documentNumber = 'Emirates ID must be 15 digits';
      }
    }

    if (verification.documentType === 'passport' && verification.documentNumber) {
      // Basic passport validation (6-9 alphanumeric characters)
      if (!/^[A-Z0-9]{6,9}$/.test(verification.documentNumber.toUpperCase())) {
        newErrors.documentNumber = 'Please enter a valid passport number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...registrationData,
        verification
      });
    }
  };

  const formatDocumentNumber = (value: string, type: 'emirates_id' | 'passport'): string => {
    if (type === 'emirates_id') {
      // Format Emirates ID as XXX-XXXX-XXXXXXX-X
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      if (cleaned.length <= 14) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 14)}-${cleaned.slice(14, 15)}`;
    }
    return value.toUpperCase();
  };

  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocumentNumber(e.target.value, verification.documentType);
    setVerification(prev => ({
      ...prev,
      documentNumber: formatted
    }));

    if (errors.documentNumber) {
      setErrors(prev => ({
        ...prev,
        documentNumber: ''
      }));
    }
  };

  return (
    <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Verification</h1>
        <p className="text-gray-600">Verify your identity to proceed</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Document Type
          </label>
          <select
            value={verification.documentType}
            onChange={handleInputChange('documentType')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-4 focus:ring-gray-100 transition-all duration-200"
          >
            <option value="emirates_id">Emirates ID</option>
            <option value="passport">Passport</option>
          </select>
        </div>

        {/* Document Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {verification.documentType === 'emirates_id' ? 'Emirates ID Number' : 'Passport Number'}
          </label>
          <input
            type="text"
            placeholder={
              verification.documentType === 'emirates_id' 
                ? 'XXX-XXXX-XXXXXXX-X' 
                : 'Enter passport number'
            }
            value={verification.documentNumber}
            onChange={handleDocumentNumberChange}
            maxLength={verification.documentType === 'emirates_id' ? 18 : 9}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
              errors.documentNumber 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
            }`}
          />
          {errors.documentNumber && (
            <p className="text-sm text-red-600">{errors.documentNumber}</p>
          )}
          
          {verification.documentType === 'emirates_id' && (
            <p className="text-xs text-gray-500">
              Enter your 15-digit Emirates ID number
            </p>
          )}
          {verification.documentType === 'passport' && (
            <p className="text-xs text-gray-500">
              Enter your passport number (6-9 characters)
            </p>
          )}
        </div>

        {/* Document Information Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Document Information</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">
                {verification.documentType === 'emirates_id' ? 'Emirates ID' : 'Passport'}
              </span>
            </div>
            {verification.documentNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Number:</span>
                <span className="font-medium font-mono">{verification.documentNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Security Notice</h4>
              <p className="text-sm text-blue-800">
                Your document information is encrypted and used only for verification purposes in compliance with DFSA regulations.
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
            type="submit"
            className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-200"
          >
            Verify & Continue
          </button>
        </div>
      </form>
    </div>
  );
};