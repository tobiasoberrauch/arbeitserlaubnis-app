'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkPermitForm from '@/components/WorkPermitForm';
import FormPreview from '@/components/FormPreview';
import SuccessPage from '@/components/SuccessPage';
import { useLanguage } from '@/components/ClientLayout';

export default function WorkPermitPage() {
  const router = useRouter();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'form' | 'preview' | 'success'>('form');
  const [formData, setFormData] = useState({});

  const handleFormComplete = (data: any) => {
    setFormData(data);
    setCurrentStep('preview');
  };

  const handleConfirm = () => {
    setCurrentStep('success');
  };

  const handleEdit = () => {
    setCurrentStep('form');
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
  };

  return (
    <>
      {currentStep === 'form' && (
        <WorkPermitForm 
          onComplete={handleFormComplete}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      )}
      {currentStep === 'preview' && (
        <FormPreview 
          formData={formData}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
          selectedLanguage={selectedLanguage}
        />
      )}
      {currentStep === 'success' && (
        <SuccessPage />
      )}
    </>
  );
}