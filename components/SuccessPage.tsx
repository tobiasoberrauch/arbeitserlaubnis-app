'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Download, Home } from 'lucide-react';
import { useLanguage } from '@/components/ClientLayout';

export default function SuccessPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();

  const texts = {
    title: {
      de: 'Erfolgreich abgeschlossen!',
      en: 'Successfully completed!',
      tr: 'Başarıyla tamamlandı!',
      ar: 'اكتمل بنجاح!',
      pl: 'Pomyślnie zakończono!',
      uk: 'Успішно завершено!',
      es: '¡Completado con éxito!',
      fr: 'Terminé avec succès!'
    },
    description: {
      de: 'Ihr Antrag wurde erfolgreich erstellt und kann heruntergeladen werden.',
      en: 'Your application has been successfully created and can be downloaded.',
      tr: 'Başvurunuz başarıyla oluşturuldu ve indirilebilir.',
      ar: 'تم إنشاء طلبك بنجاح ويمكن تنزيله.',
      pl: 'Twój wniosek został pomyślnie utworzony i można go pobrać.',
      uk: 'Вашу заявку успішно створено і можна завантажити.',
      es: 'Su solicitud ha sido creada exitosamente y puede ser descargada.',
      fr: 'Votre demande a été créée avec succès et peut être téléchargée.'
    },
    backToHome: {
      de: 'Zur Startseite',
      en: 'Back to Home',
      tr: 'Ana Sayfaya Dön',
      ar: 'العودة إلى الصفحة الرئيسية',
      pl: 'Powrót do strony głównej',
      uk: 'Повернутися на головну',
      es: 'Volver al inicio',
      fr: 'Retour à l\'accueil'
    }
  };

  const getText = (key: keyof typeof texts) => {
    return texts[key][selectedLanguage as keyof typeof texts[typeof key]] || texts[key]['de'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getText('title')}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {getText('description')}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              {getText('backToHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}