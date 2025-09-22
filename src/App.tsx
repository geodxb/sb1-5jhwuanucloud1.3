import React, { useState } from 'react';
import { useEffect } from 'react';
import { doc, getDoc, connectFirestoreEmulator } from 'firebase/firestore';
import { db } from './lib/firebase';
import { 
  BrokerSelectionForm, 
  InvestorDetailsForm,
  DocumentVerificationForm, 
  RequestSummaryScreen,
  ClientCategorizationDocument,
  DocumentApprovalStatus
} from './components/dfsa';
import { PaymentScreen, PaymentReceipt } from './components/payment';
import { submitDocumentForReview } from './lib/documentService';
import type { InvestorRegistration } from './components/dfsa/types';
import type { PaymentData } from './components/payment/types';

type AppStep = 'broker' | 'investors' | 'verification' | 'approval' | 'summary' | 'payment' | 'receipt' | 'document';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('broker');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<Partial<InvestorRegistration>>(() => {
    const saved = localStorage.getItem('dfsa_registration_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [documentId, setDocumentId] = useState<string>(() => {
    return localStorage.getItem('dfsa_document_id') || '';
  });
  const [isDocumentApproved, setIsDocumentApproved] = useState(false);
  const [hasActiveDocument, setHasActiveDocument] = useState(false);
  const [isCheckingDocument, setIsCheckingDocument] = useState(true);
  const [completedPayment, setCompletedPayment] = useState<PaymentData & {
    transactionId: string;
    timestamp: string;
    description: string;
    reference?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  } | null>(null);

  // Check if there's an active request under review
  const checkActiveDocument = async (docId: string) => {
    console.log('🔍 Starting checkActiveDocument...');
    console.log('🔥 Firebase db instance:', db);
    
    try {
      // Check if we have a saved document ID first
      const savedDocId = localStorage.getItem('dfsa_document_id');
      console.log('💾 Saved document ID:', savedDocId);
      
      if (savedDocId) {
        console.log('📄 Attempting to fetch document from Firestore...');
        const docRef = doc(db, 'client_categorizations', savedDocId);
        console.log('📋 Document reference created:', docRef);
        
        const docSnap = await getDoc(docRef);
        console.log('📊 Document snapshot received:', docSnap);
        console.log('📊 Document exists:', docSnap.exists());
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('📋 Document data:', data);
          const status = data.status;
          console.log('🎯 Document status:', status);
          
          // Only consider it active if status is pending or approved (not payed)
          if (status === 'pending' || status === 'approved') {
            console.log(`✅ Found saved ${status} request:`, savedDocId);
            setDocumentId(savedDocId);
            setRegistrationData(data.registrationData || {});
            setHasActiveDocument(true);
            setIsDocumentApproved(status === 'approved');
            setIsCheckingDocument(false);
            return true;
          } else {
            // Document is payed or rejected, clear it
            console.log(`🧹 Saved document is ${status}, clearing...`);
            localStorage.removeItem('dfsa_document_id');
            localStorage.removeItem('dfsa_registration_data');
            setHasActiveDocument(false);
            setIsCheckingDocument(false);
          }
        } else {
          // Document doesn't exist, clear it
          console.log('❌ Saved document not found, clearing...');
          localStorage.removeItem('dfsa_document_id');
          localStorage.removeItem('dfsa_registration_data');
          setHasActiveDocument(false);
          setIsCheckingDocument(false);
        }
      }
      
      // No active document found
      console.log('🚫 No active document found');
      setHasActiveDocument(false);
      setIsCheckingDocument(false);
      return false;
    } catch (error) {
      console.error('❌ Error checking for active requests:', error);
      setHasActiveDocument(false);
      setIsCheckingDocument(false);
      return false;
    }
  };

  // Initialize current step based on saved data
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');
      setIsCheckingDocument(true);
      
      try {
        // Always check for active requests
        const isActive = await checkActiveDocument('');
        console.log('🎯 Is active document found:', isActive);
        
        if (isActive) {
          // Force user to approval step if request is under review
          console.log('📋 Setting current step to approval');
          setCurrentStep('approval');
        } else {
          // No active request, start fresh
          console.log('🆕 No active request, starting fresh');
          localStorage.removeItem('dfsa_document_id');
          localStorage.removeItem('dfsa_registration_data');
          setRegistrationData({});
          setDocumentId('');
          setCurrentStep('broker');
        }
      } catch (error) {
        console.error('❌ Error in initializeApp:', error);
        setIsCheckingDocument(false);
        setHasActiveDocument(false);
        setCurrentStep('broker');
      }
    };
    
    initializeApp();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dfsa_registration_data', JSON.stringify(registrationData));
  }, [registrationData]);

  useEffect(() => {
    localStorage.setItem('dfsa_current_step', currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (documentId) {
      localStorage.setItem('dfsa_document_id', documentId);
    }
  }, [documentId]);

  const handleBrokerSelection = (data: Partial<InvestorRegistration>) => {
    setRegistrationData(data);
    
    // Check if investor details are needed
    if (data.requestType === 'categorize_clients') {
      setCurrentStep('investors');
    } else {
      setCurrentStep('verification');
    }
  };

  const handleInvestorDetails = (data: Partial<InvestorRegistration>) => {
    setRegistrationData(data);
    setCurrentStep('verification');
  };

  const handleDocumentVerification = (data: Partial<InvestorRegistration>) => {
    setRegistrationData(data);
    handleSubmitForApproval(data as InvestorRegistration);
  };

  const handleSubmitForApproval = async (data: InvestorRegistration) => {
    // Double-check for existing pending requests before creating new one
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const q = query(
        collection(db, 'client_categorizations'),
        where('status', '==', 'pending')
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Found existing pending request
        console.log('Found existing pending request, redirecting to approval');
        const doc = querySnapshot.docs[0];
        setDocumentId(doc.id);
        setHasActiveDocument(true);
        setCurrentStep('approval');
        return;
      }
    } catch (error) {
      console.error('Error checking for existing pending requests:', error);
    }
    
    setIsLoading(true);
    try {
      console.log('Submitting new request for review');
      const docId = await submitDocumentForReview(data);
      console.log('Request submitted with ID:', docId);
      setDocumentId(docId);
      setHasActiveDocument(true);
      setCurrentStep('approval');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request for review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalChange = (approved: boolean) => {
    setIsDocumentApproved(approved);
  };

  const handleSummaryConfirmation = () => {
    if (isDocumentApproved) {
      setCurrentStep('payment');
    } else {
      alert('Request must be approved before proceeding to payment.');
    }
  };

  const handlePayment = async (data: PaymentData) => {
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update document status to "payed" in Firebase
      if (documentId) {
        const { updateDoc, doc, getDoc } = await import('firebase/firestore');
        
        // Check current status before updating
        const docRef = doc(db, 'client_categorizations', documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().status !== 'payed') {
          await updateDoc(docRef, {
            status: 'payed',
            paymentCompletedAt: new Date().toISOString()
          });
        }
      }
      
      // Generate transaction ID and timestamp
      const transactionId = `DFSA${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const timestamp = new Date().toISOString();
      
      const completedPaymentData = {
        ...data,
        transactionId,
        timestamp,
        description: 'DFSA Client Categorization Processing Fee',
        reference: `REQ-${registrationData.requestType?.toUpperCase()}-${Date.now()}`
      };
      
      console.log('Payment completed:', completedPaymentData);
      setCompletedPayment(completedPaymentData);
      setCurrentStep('receipt');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDocument = () => {
    setCurrentStep('document');
  };

  const handleBackToReceipt = () => {
    setCurrentStep('receipt');
  };

  const handleNewRequest = () => {
    // Clear localStorage when starting new request
    localStorage.removeItem('dfsa_registration_data');
    localStorage.removeItem('dfsa_current_step');
    localStorage.removeItem('dfsa_document_id');
    
    setCurrentStep('broker');
    setRegistrationData({});
    setDocumentId('');
    setIsDocumentApproved(false);
    setHasActiveDocument(false);
    setCompletedPayment(null);
    setIsLoading(false);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'investors':
        setCurrentStep('broker');
        break;
      case 'verification':
        if (registrationData.requestType === 'categorize_clients') {
          setCurrentStep('investors');
        } else {
          setCurrentStep('broker');
        }
        break;
      case 'approval':
        setCurrentStep('verification');
        break;
      case 'summary':
        setCurrentStep('approval');
        break;
      case 'payment':
        setCurrentStep('summary');
        break;
      case 'document':
        setCurrentStep('receipt');
        break;
      default:
        break;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'broker':
        return 'Broker & Request Selection';
      case 'investors':
        return 'Investor Details & Categorization';
      case 'verification':
        return 'Document Verification';
      case 'approval':
        return 'Document Approval Status';
      case 'summary':
        return 'Request Summary';
      case 'payment':
        return 'Payment Processing';
      case 'receipt':
        return 'Payment Confirmation';
      case 'document':
        return 'Client Categorization Document';
      default:
        return 'DFSA Registration';
    }
  };

  // Calculate payment amount (280 USD per request)
  const paymentAmount = (registrationData.numberOfInvestors || 1) * 280;

  // Show loading screen while checking for active documents
  if (isCheckingDocument) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Checking for active requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="mb-8">
            <img 
              src="/logo.png" 
              alt="DFSA Logo" 
              className="mx-auto h-64 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dubai Financial Services Authority
          </h1>
          <p className="text-lg text-gray-600">
            {getStepTitle()}
          </p>
          
          {/* Active Document Warning */}
          {hasActiveDocument && currentStep !== 'receipt' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ You have an active request. Complete this process before starting a new request.
              </p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['broker', 'investors', 'verification', 'approval', 'summary', 'payment', 'receipt'].map((step, index) => {
              const stepNames = ['Broker', 'Investors', 'Verify', 'Approval', 'Summary', 'Payment', 'Receipt'];
              const isActive = currentStep === step;
              const isCompleted = ['broker', 'investors', 'verification', 'approval', 'summary', 'payment', 'receipt', 'document'].indexOf(currentStep) > index;
              const shouldShow = (step !== 'investors' && step !== 'approval') || registrationData.requestType === 'categorize_clients';
              
              if (!shouldShow) return null;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isActive 
                      ? 'bg-black text-white' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${isActive ? 'font-medium' : 'text-gray-500'}`}>
                    {stepNames[index]}
                  </span>
                  {index < stepNames.length - 1 && shouldShow && (
                    <div className="w-8 h-0.5 bg-gray-300 mx-4"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {currentStep === 'broker' && !hasActiveDocument && (
          <BrokerSelectionForm onSubmit={handleBrokerSelection} />
        )}
        
        {currentStep === 'broker' && hasActiveDocument && !isCheckingDocument && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Under Review</h1>
              <p className="text-gray-600 mb-6">
                You have a request currently under review. Please wait for the review to complete.
              </p>
              <button
                onClick={() => setCurrentStep('approval')}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-200"
              >
                Check Request Status
              </button>
            </div>
          </div>
        )}

        {currentStep === 'investors' && (
          <InvestorDetailsForm
            registrationData={registrationData}
            onSubmit={handleInvestorDetails}
            onBack={handleBack}
          />
        )}

        {currentStep === 'verification' && (
          <DocumentVerificationForm
            registrationData={registrationData}
            onSubmit={handleDocumentVerification}
            onBack={handleBack}
          />
        )}

        {currentStep === 'approval' && documentId && (
          <DocumentApprovalStatus
            documentId={documentId}
            onApprovalChange={handleApprovalChange}
            onContinue={() => setCurrentStep('summary')}
          />
        )}

        {currentStep === 'summary' && registrationData && (
          <RequestSummaryScreen
            registrationData={registrationData as InvestorRegistration}
            onContinue={handleSummaryConfirmation}
            onBack={handleBack}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentScreen
            amount={paymentAmount}
            currency="USD"
            onSubmit={handlePayment}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'receipt' && completedPayment && (
          <PaymentReceipt
            paymentData={completedPayment}
            onNewPayment={() => {
              setHasActiveDocument(false);
              handleNewRequest();
            }}
            onViewDocument={handleViewDocument}
          />
        )}

        {currentStep === 'document' && registrationData && (
          <ClientCategorizationDocument
            registrationData={registrationData as InvestorRegistration}
            paymentData={completedPayment ? {
              fullName: completedPayment.fullName,
              email: completedPayment.email,
              phone: completedPayment.phone
            } : undefined}
            onDownload={() => console.log('Document downloaded')}
            onBack={handleBackToReceipt}
          />
        )}
      </div>
    </div>
  );
}

export default App;
