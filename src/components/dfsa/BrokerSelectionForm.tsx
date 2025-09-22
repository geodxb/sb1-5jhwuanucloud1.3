import React, { useState } from 'react';
import { BROKERS, REQUEST_TYPES } from './types';
import type { InvestorRegistration } from './types';

interface BrokerSelectionFormProps {
  onSubmit: (data: Partial<InvestorRegistration>) => void;
  className?: string;
}

export const BrokerSelectionForm: React.FC<BrokerSelectionFormProps> = ({
  onSubmit,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    brokerName: '',
    requestType: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData(prev => ({
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

    if (!formData.brokerName) {
      newErrors.brokerName = 'Please select a broker';
    }

    if (!formData.requestType) {
      newErrors.requestType = 'Please select a request type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const selectedBroker = BROKERS.find(b => b.id === formData.brokerName);
  const selectedRequest = REQUEST_TYPES.find(r => r.id === formData.requestType);

  return (
    <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">DFSA Registration</h1>
        <p className="text-gray-600">Select your broker and request type</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Broker Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Your Broker
          </label>
          <select
            value={formData.brokerName}
            onChange={handleInputChange('brokerName')}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
              errors.brokerName 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
            }`}
          >
            <option value="">Choose a broker...</option>
            {BROKERS.map(broker => (
              <option key={broker.id} value={broker.id}>
                {broker.name} ({broker.regulator})
              </option>
            ))}
          </select>
          {errors.brokerName && (
            <p className="text-sm text-red-600">{errors.brokerName}</p>
          )}
        </div>

        {/* Request Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Request Type
          </label>
          <select
            value={formData.requestType}
            onChange={handleInputChange('requestType')}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
              errors.requestType 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
            }`}
          >
            <option value="">Choose request type...</option>
            {REQUEST_TYPES.map(request => (
              <option key={request.id} value={request.id}>
                {request.name}
              </option>
            ))}
          </select>
          {errors.requestType && (
            <p className="text-sm text-red-600">{errors.requestType}</p>
          )}
        </div>

        {/* Selected Information Display */}
        {selectedBroker && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Selected Broker</h3>
            <p className="text-sm text-gray-700">
              <strong>{selectedBroker.name}</strong> - Regulated by {selectedBroker.regulator}
            </p>
          </div>
        )}

        {selectedRequest && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Request Details</h3>
            <p className="text-sm text-gray-700">
              <strong>{selectedRequest.name}</strong>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {selectedRequest.description}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 active:transform active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </form>
    </div>
  );
};