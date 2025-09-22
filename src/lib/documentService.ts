import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { InvestorRegistration } from '../components/dfsa/types';

export interface ClientCategorizationDocument {
  id?: string;
  registrationData: InvestorRegistration;
  licenseNumber: string;
  cbslNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  updatedAt: any;
  reviewedBy?: string;
  reviewNotes?: string;
}

export const submitDocumentForReview = async (
  registrationData: InvestorRegistration
): Promise<string> => {
  try {
    // Generate random license numbers
    const licenseNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
    const cbslNumber = Math.floor(10000000 + Math.random() * 90000000).toString();

    const documentData: Omit<ClientCategorizationDocument, 'id'> = {
      registrationData,
      licenseNumber,
      cbslNumber,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'client_categorizations'), documentData);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting document for review:', error);
    throw new Error('Failed to submit document for review');
  }
};

export const getDocumentStatus = async (documentId: string): Promise<ClientCategorizationDocument | null> => {
  try {
    const docRef = doc(db, 'client_categorizations', documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ClientCategorizationDocument;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting document status:', error);
    throw new Error('Failed to get document status');
  }
};

export const updateDocumentStatus = async (
  documentId: string,
  status: 'approved' | 'rejected',
  reviewNotes?: string,
  reviewedBy?: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'client_categorizations', documentId);
    await updateDoc(docRef, {
      status,
      reviewNotes,
      reviewedBy,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating document status:', error);
    throw new Error('Failed to update document status');
  }
};