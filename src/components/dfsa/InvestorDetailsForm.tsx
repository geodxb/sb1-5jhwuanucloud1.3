import React, { useState } from 'react';
import { COUNTRIES } from './types';
import type { InvestorRegistration } from './types';

interface InvestorDetails {
  passportNumber: string;
  address: string;
  countryOfResidence: string;
  investorId: string;
  briefExplanation: string;
  balance: string;
  firstDeposit: string;
  clientCategory: 'retail' | 'professional';
  fullName: string;
  email: string;
  phone: string;
}

interface InvestorDetailsFormProps {
  registrationData: Partial<InvestorRegistration>;
  onSubmit: (data: Partial<InvestorRegistration>) => void;
  onBack: () => void;
  className?: string;
}

export const InvestorDetailsForm: React.FC<InvestorDetailsFormProps> = ({
  registrationData,
  onSubmit,
  onBack,
  className = ''
}) => {
  const [numberOfInvestors, setNumberOfInvestors] = useState<number>(1);
  const [currentInvestorIndex, setCurrentInvestorIndex] = useState<number>(0);
  const [investors, setInvestors] = useState<InvestorDetails[]>([{
    passportNumber: '',
    address: '',
    countryOfResidence: '',
    investorId: '',
    briefExplanation: '',
    balance: '',
    firstDeposit: '',
    clientCategory: 'retail',
    fullName: '',
    email: '',
    phone: ''
  }]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showInvestorForm, setShowInvestorForm] = useState(false);

  const handleNumberChange = (count: number) => {
    setNumberOfInvestors(count);
    const newInvestors = Array.from({ length: count }, (_, index) => 
      investors[index] || {
        passportNumber: '',
        address: '',
        countryOfResidence: '',
        investorId: '',
        briefExplanation: '',
        balance: '',
        firstDeposit: '',
        clientCategory: 'retail',
        fullName: '',
        email: '',
        phone: ''
      }
    );
    setInvestors(newInvestors);
  };

  const handleCategoryChange = (category: 'retail' | 'professional') => {
    const updatedInvestors = [...investors];
    updatedInvestors[currentInvestorIndex] = {
      ...updatedInvestors[currentInvestorIndex],
      clientCategory: category
    };
    setInvestors(updatedInvestors);
    
    if (errors.clientCategory) {
      setErrors(prev => ({ ...prev, clientCategory: '' }));
    }
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const updatedInvestors = [...investors];
    updatedInvestors[currentInvestorIndex] = {
      ...updatedInvestors[currentInvestorIndex],
      [field]: e.target.value
    };
    setInvestors(updatedInvestors);

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateCurrentInvestor = (): boolean => {
    const currentInvestor = investors[currentInvestorIndex];
    const newErrors: {[key: string]: string} = {};

    if (!currentInvestor.clientCategory) {
      newErrors.clientCategory = 'Please select client category';
    }

    if (currentInvestor.clientCategory === 'retail') {
      if (!currentInvestor.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!currentInvestor.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentInvestor.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!currentInvestor.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (!currentInvestor.passportNumber.trim()) {
        newErrors.passportNumber = 'Passport number is required';
      }
      if (!currentInvestor.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!currentInvestor.countryOfResidence) {
        newErrors.countryOfResidence = 'Country of residence is required';
      }
      if (!currentInvestor.investorId.trim()) {
        newErrors.investorId = 'Investor ID is required';
      }
      if (!currentInvestor.briefExplanation.trim()) {
        newErrors.briefExplanation = 'Brief explanation is required';
      }
      if (!currentInvestor.balance.trim()) {
        newErrors.balance = 'Balance information is required';
      }
      if (!currentInvestor.firstDeposit.trim()) {
        newErrors.firstDeposit = 'First deposit information is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextInvestor = () => {
    if (validateCurrentInvestor()) {
      if (currentInvestorIndex < numberOfInvestors - 1) {
        setCurrentInvestorIndex(currentInvestorIndex + 1);
        setErrors({});
      } else {
        // All investors completed, proceed to next step
        onSubmit({
          ...registrationData,
          investors: investors,
          numberOfInvestors: numberOfInvestors
        });
      }
    }
  };

  const handlePreviousInvestor = () => {
    if (currentInvestorIndex > 0) {
      setCurrentInvestorIndex(currentInvestorIndex - 1);
      setErrors({});
    }
  };

  const currentInvestor = investors[currentInvestorIndex];

  if (!showInvestorForm) {
    return (
      <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Investor Registration</h1>
          <p className="text-gray-600">How many investors do you want to register?</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Number of Investors
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleNumberChange(count)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    numberOfInvestors === count
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="6"
                max="50"
                placeholder="6+"
                onChange={(e) => handleNumberChange(parseInt(e.target.value) || 1)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-4 focus:ring-gray-100 transition-all duration-200"
              />
              <span className="text-sm text-gray-600">for 6+ investors</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Registration Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Investors:</span>
                <span className="font-medium">{numberOfInvestors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost per Registration:</span>
                <span className="font-medium">$280 USD</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Cost:</span>
                <span>${(numberOfInvestors * 280).toLocaleString()} USD</span>
              </div>
            </div>
          </div>

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
              onClick={() => setShowInvestorForm(true)}
              className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Investor {currentInvestorIndex + 1} of {numberOfInvestors}
        </h1>
        <p className="text-gray-600">Enter investor details and categorization</p>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-black h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentInvestorIndex + 1) / numberOfInvestors) * 100}%` }}
          ></div>
        </div>

        {/* Client Category Selection */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Client Category
          </label>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 hover:bg-gray-50">
              <input
                type="radio"
                name={`clientCategory-${currentInvestorIndex}`}
                value="retail"
                checked={currentInvestor.clientCategory === 'retail'}
                onChange={() => handleCategoryChange('retail')}
                className="w-4 h-4"
              />
              <div>
                <span className="font-medium text-gray-900">Retail Investor</span>
                <p className="text-sm text-gray-600">Individual investor with standard protections</p>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 hover:bg-gray-50">
              <input
                type="radio"
                name={`clientCategory-${currentInvestorIndex}`}
                value="professional"
                checked={currentInvestor.clientCategory === 'professional'}
                onChange={() => handleCategoryChange('professional')}
                className="w-4 h-4"
              />
              <div>
                <span className="font-medium text-gray-900">Professional Investor</span>
                <p className="text-sm text-gray-600">Qualified investor with reduced protections</p>
              </div>
            </label>
          </div>
          
          {errors.clientCategory && (
            <p className="text-sm text-red-600">{errors.clientCategory}</p>
          )}
        </div>

        {/* Retail Investor Form */}
        {(currentInvestor.clientCategory === 'retail' || currentInvestor.clientCategory === 'professional') && (
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={currentInvestor.fullName}
                onChange={handleInputChange('fullName')}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.fullName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={currentInvestor.email}
                onChange={handleInputChange('email')}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={currentInvestor.phone}
                onChange={handleInputChange('phone')}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.phone 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Passport Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Passport Number
              </label>
              <input
                type="text"
                placeholder="Enter passport number"
                value={currentInvestor.passportNumber}
                onChange={handleInputChange('passportNumber')}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.passportNumber 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.passportNumber && (
                <p className="text-sm text-red-600">{errors.passportNumber}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                placeholder="Enter full address"
                value={currentInvestor.address}
                onChange={handleInputChange('address')}
                rows={3}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 resize-none ${
                  errors.address 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Country of Residence */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Country of Residence
              </label>
              <select
                value={currentInvestor.countryOfResidence}
                onChange={handleInputChange('countryOfResidence')}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.countryOfResidence 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              >
                <option value="">Select country...</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.countryOfResidence && (
                <p className="text-sm text-red-600">{errors.countryOfResidence}</p>
              )}
            </div>

            {/* Investor ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Investor ID (with Broker)
              </label>
              <input
                type="text"
                placeholder="Enter investor ID"
                value={currentInvestor.investorId}
                onChange={handleInputChange('investorId')}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.investorId 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.investorId && (
                <p className="text-sm text-red-600">{errors.investorId}</p>
              )}
            </div>

            {/* Balance */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Current Balance
              </label>
              <input
                type="text"
                placeholder="Enter current balance (e.g., $50,000)"
                value={currentInvestor.balance}
                onChange={handleInputChange('balance')}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.balance 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.balance && (
                <p className="text-sm text-red-600">{errors.balance}</p>
              )}
            </div>

            {/* First Deposit */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Deposit Amount
              </label>
              <input
                type="text"
                placeholder="Enter first deposit amount (e.g., $10,000)"
                value={currentInvestor.firstDeposit}
                onChange={handleInputChange('firstDeposit')}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.firstDeposit 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.firstDeposit && (
                <p className="text-sm text-red-600">{errors.firstDeposit}</p>
              )}
            </div>

            {/* Brief Explanation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Brief Explanation
              </label>
              <textarea
                placeholder="Provide a brief explanation of investment background and goals"
                value={currentInvestor.briefExplanation}
                onChange={handleInputChange('briefExplanation')}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 resize-none ${
                  errors.briefExplanation 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                }`}
              />
              {errors.briefExplanation && (
                <p className="text-sm text-red-600">{errors.briefExplanation}</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={currentInvestorIndex > 0 ? handlePreviousInvestor : onBack}
            className="flex-1 py-3 px-6 rounded-lg font-semibold text-black bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            {currentInvestorIndex > 0 ? 'Previous' : 'Back'}
          </button>
          <button
            type="button"
            onClick={handleNextInvestor}
            className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-200"
          >
            {currentInvestorIndex < numberOfInvestors - 1 ? 'Next Investor' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};