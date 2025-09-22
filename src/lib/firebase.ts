import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDb2i4UdzhB6ChT30ljwRXSIjBM8LMT318",
  authDomain: "blackbull-4b009.firebaseapp.com",
  projectId: "blackbull-4b009",
  storageBucket: "blackbull-4b009.firebasestorage.app",
  messagingSenderId: "600574134239",
  appId: "1:600574134239:web:377484c5db15edf320a66a",
  measurementId: "G-PS64KEQB6T"
};

console.log('🔥 Firebase Config:', {
  apiKey: '✅ Set',
  authDomain: '✅ Set',
  projectId: '✅ Set',
  storageBucket: '✅ Set',
  messagingSenderId: '✅ Set',
  appId: '✅ Set',
  measurementId: '✅ Set'
});

console.log('🌍 Environment:', {
  isDev: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  prod: import.meta.env.PROD
});

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log('🔥 Firebase initialized successfully');
console.log('📊 Firestore instance:', db);
