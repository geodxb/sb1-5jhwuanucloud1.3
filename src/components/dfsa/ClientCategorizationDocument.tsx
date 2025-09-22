import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { InvestorRegistration } from './types';

interface ClientCategorizationDocumentProps {
  registrationData: InvestorRegistration;
  paymentData?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  licenseNumber?: string;
  cbslNumber?: string;
  onDownload?: () => void;
  onBack?: () => void;
  className?: string;
}

export const ClientCategorizationDocument: React.FC<ClientCategorizationDocumentProps> = ({
  registrationData,
  paymentData,
  licenseNumber,
  cbslNumber,
  onDownload,
  onBack,
  className = ''
}) => {
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const documentRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const numberOfDocuments = registrationData.numberOfInvestors || 1;
  
  // Current date for generation
  const currentDate = new Date();
  const establishmentDate = currentDate.toLocaleDateString('en-GB');
  const expiryDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate()).toLocaleDateString('en-GB');
  const modifyDate = currentDate.toLocaleDateString('en-GB');

  const generateLicenseNumbers = (index: number) => {
    const baseNumber = 1000000 + index;
    return {
      localLicenseNo: licenseNumber || (baseNumber + Math.floor(Math.random() * 1000000)).toString(),
      cbslNo: cbslNumber || (10000000 + baseNumber + Math.floor(Math.random() * 10000000)).toString()
    };
  };
  
  const downloadPDF = async (documentIndex: number) => {
    const documentRef = documentRefs.current[documentIndex];
    if (!documentRef) return;

    try {
      const canvas = await html2canvas(documentRef, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: documentRef.offsetWidth,
        height: documentRef.offsetHeight,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        Math.min(imgHeight, pageHeight)
      );

      const { localLicenseNo } = generateLicenseNumbers(documentIndex);
      pdf.save(`Client-Categorization-${documentIndex + 1}-${localLicenseNo}.pdf`);
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const renderDocument = (documentIndex: number) => {
    const investor = registrationData.investors?.[documentIndex] || registrationData.investors?.[0];
    const { localLicenseNo, cbslNo } = generateLicenseNumbers(documentIndex);

    return (
      <div 
        key={documentIndex}
        ref={(el) => documentRefs.current[documentIndex] = el}
        className="bg-white p-8 border border-gray-300 mb-8"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
            <h1 className="text-lg font-bold text-amber-700 mb-1">UNITED ARAB EMIRATES</h1>
            <h2 className="text-lg font-bold text-amber-700">MINISTRY OF ECONOMY</h2>
          </div>
          
          {/* DFSA Logo */}
          <div className="flex-shrink-0 mx-8">
            <img 
              src="/logo.png" 
              alt="DFSA Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          
          <div className="text-right" dir="rtl">
            <h1 className="text-lg font-bold text-amber-700 mb-1">الإمارات العربية المتحدة</h1>
            <h2 className="text-lg font-bold text-amber-700">وزارة الاقتصاد</h2>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold">
            Client CAT DFSA <span className="mr-4">تفاصيل الرخصة الاقتصادية</span>
          </h3>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t-2 border-black mb-6" />

        {/* Document Table */}
        <div className="border border-black">
          {/* Row 1 */}
          <div className="flex border-b border-black">
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">رقم السجل الاقتصادي / <span className="font-normal">CBLS No</span></div>
            </div>
            <div className="w-1/4 border-r border-black p-3 text-center font-bold">
              {cbslNo}
            </div>
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">رقم الرخصة المحلي / <span className="font-normal">L Local No</span></div>
            </div>
            <div className="w-1/4 p-3 text-center font-bold">
              {localLicenseNo}
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">الاسم الاقتصادي-عربي / <span className="font-normal">Name Arabic</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              {investor?.passportNumber ? 'مستثمر مهني' : 'مستثمر تجزئة'}
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">الاسم الاقتصادي-إنجليزي / <span className="font-normal">Name English</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              {investor?.clientCategory === 'professional' ? 'Professional Investor' : 'Retail Investor'}
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">الشكل القانوني / <span className="font-normal">Legal Type</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              شركة ذات مسؤولية محدودة
            </div>
          </div>

          {/* Row 5 */}
          <div className="flex border-b border-black">
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">فرع / <span className="font-normal">Is Branch</span></div>
            </div>
            <div className="w-1/4 border-r border-black p-3 text-center">
              Y
            </div>
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">رقم المنشأة الأم / <span className="font-normal">Parent BL No</span></div>
            </div>
            <div className="w-1/4 p-3 text-center">
              -
            </div>
          </div>

          {/* Row 6 */}
          <div className="flex border-b border-black">
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">تاريخ التأسيس / <span className="font-normal">Est. Date</span></div>
            </div>
            <div className="w-1/4 border-r border-black p-3 text-center">
              {establishmentDate}
            </div>
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">تاريخ الانتهاء / <span className="font-normal">Expiry Date</span></div>
            </div>
            <div className="w-1/4 p-3 text-center">
              {expiryDate}
            </div>
          </div>

          {/* Row 7 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">حالة / <span className="font-normal">Status</span></div>
            </div>
            <div className="w-1/2 p-3 text-center font-bold text-green-600">
              Active / فعال
            </div>
          </div>

          {/* Row 8 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">تاريخ التعديل / <span className="font-normal">Modify Date</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              {modifyDate}
            </div>
          </div>

          {/* Row 9 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">اسم النشاط-عربي / <span className="font-normal">BA Desc. Arabic</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              الإدارة التسويقية :
            </div>
          </div>

          {/* Row 10 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">اسم النشاط-إنجليزي / <span className="font-normal">BA Desc. English</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              : Professional TRA
            </div>
          </div>

          {/* Row 11 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">مكان الإصدار-إدارة / <span className="font-normal">Economic Department</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              دائرة الاقتصاد والسياحة دبي
            </div>
          </div>

          {/* Row 12 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">تسجيل فرع / <span className="font-normal">Registration ED Branch</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              دائرة التنمية الاقتصادية في دبي
            </div>
          </div>

          {/* Row 13 - Phone Number */}
          <div className="flex border-b border-black">
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">رقم الهاتف المحمول / <span className="font-normal">Mobile No</span></div>
            </div>
            <div className="w-1/4 border-r border-black p-3 text-center">
              {investor?.phone || paymentData?.phone || '-'}
            </div>
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">رقم الهاتف / <span className="font-normal">Phone No</span></div>
            </div>
            <div className="w-1/4 p-3 text-center">
              {investor?.phone || paymentData?.phone || '-'}
            </div>
          </div>

          {/* Row 14 */}
          <div className="flex border-b border-black">
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">رقم صندوق البريد / <span className="font-normal">P.O. Box</span></div>
            </div>
            <div className="w-1/4 border-r border-black p-3 text-center">
              -
            </div>
            <div className="w-1/4 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">فاكس / <span className="font-normal">Fax No</span></div>
            </div>
            <div className="w-1/4 p-3 text-center">
              -
            </div>
          </div>

          {/* Row 15 */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">الموقع الإلكتروني / <span className="font-normal">Web Site URL</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              -
            </div>
          </div>

          {/* Row 16 - Email */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">البريد الإلكتروني / <span className="font-normal">eMail</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              {investor?.email || paymentData?.email || 'investor@example.com'}
            </div>
          </div>

          {/* Row 17 - Full Name */}
          <div className="flex border-b border-black">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">الاسم الكامل / <span className="font-normal">Full Name</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              {investor?.fullName || paymentData?.fullName || 'Full Name'}
            </div>
          </div>

          {/* Row 18 - Address */}
          <div className="flex">
            <div className="w-1/2 border-r border-black p-3 bg-gray-50">
              <div className="text-right font-semibold">العنوان الكامل / <span className="font-normal">Full Address</span></div>
            </div>
            <div className="w-1/2 p-3 text-center">
              {investor?.address || 'Dubai, United Arab Emirates'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>This document is generated automatically by the DFSA Client Categorization System</p>
          <p className="mt-2">Generated on: {currentDate.toLocaleString()}</p>
          <p className="mt-1">Document {documentIndex + 1} of {numberOfDocuments}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto bg-white ${className}`}>
      {/* Back Button */}
      {onBack && (
        <div className="mb-6 print:hidden">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 py-2 px-4 rounded-lg font-medium text-black bg-white border border-black hover:bg-gray-50 transition-all duration-200"
          >
            <span>←</span>
            <span>Back to Payment Receipt</span>
          </button>
        </div>
      )}
      
      {/* Document List */}
      <div className="mb-8 print:hidden">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Client Categorization Documents ({numberOfDocuments})
        </h2>
        
        <div className="grid gap-4">
          {Array.from({ length: numberOfDocuments }, (_, index) => {
            const { localLicenseNo } = generateLicenseNumbers(index);
            return (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Document {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      License No: {localLicenseNo}
                    </p>
                    <p className="text-sm text-gray-600">
                      Investor: {registrationData.investors?.[index]?.clientCategory || 'Retail'} Client
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedDocument(selectedDocument === index ? null : index)}
                      className="flex items-center space-x-2 py-2 px-4 rounded-lg font-medium text-black bg-white border border-black hover:bg-gray-50 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{selectedDocument === index ? 'Hide' : 'View'}</span>
                    </button>
                    
                    <button
                      onClick={() => downloadPDF(index)}
                      className="flex items-center space-x-2 py-2 px-4 rounded-lg font-medium text-black bg-white border border-black hover:bg-gray-50 transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Preview */}
      {selectedDocument !== null && (
        <div className="print:block">
          {renderDocument(selectedDocument)}
        </div>
      )}
    </div>
  );
};