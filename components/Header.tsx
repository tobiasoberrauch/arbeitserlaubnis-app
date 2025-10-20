'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, Settings, LogOut, ChevronDown, Home, FileText, HelpCircle, Globe } from 'lucide-react';

interface HeaderProps {
  selectedLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export default function Header({ selectedLanguage = 'de', onLanguageChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  const menuItems = {
    home: {
      de: 'Startseite',
      en: 'Home',
      tr: 'Ana Sayfa',
      ar: 'الصفحة الرئيسية',
      pl: 'Strona główna',
      uk: 'Головна',
      es: 'Inicio',
      fr: 'Accueil'
    },
    forms: {
      de: 'Formulare',
      en: 'Forms',
      tr: 'Formlar',
      ar: 'النماذج',
      pl: 'Formularze',
      uk: 'Форми',
      es: 'Formularios',
      fr: 'Formulaires'
    },
    help: {
      de: 'Hilfe',
      en: 'Help',
      tr: 'Yardım',
      ar: 'مساعدة',
      pl: 'Pomoc',
      uk: 'Допомога',
      es: 'Ayuda',
      fr: 'Aide'
    },
    profile: {
      de: 'Profil',
      en: 'Profile',
      tr: 'Profil',
      ar: 'الملف الشخصي',
      pl: 'Profil',
      uk: 'Профіль',
      es: 'Perfil',
      fr: 'Profil'
    },
    settings: {
      de: 'Einstellungen',
      en: 'Settings',
      tr: 'Ayarlar',
      ar: 'الإعدادات',
      pl: 'Ustawienia',
      uk: 'Налаштування',
      es: 'Configuración',
      fr: 'Paramètres'
    },
    logout: {
      de: 'Abmelden',
      en: 'Logout',
      tr: 'Çıkış',
      ar: 'تسجيل الخروج',
      pl: 'Wyloguj',
      uk: 'Вийти',
      es: 'Cerrar sesión',
      fr: 'Déconnexion'
    }
  };

  const getMenuText = (key: keyof typeof menuItems) => {
    return menuItems[key][selectedLanguage as keyof typeof menuItems[typeof key]] || menuItems[key]['de'];
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">MIGStart</h1>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/" 
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                {getMenuText('home')}
              </Link>
              <Link 
                href="/forms/work-permit" 
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                {getMenuText('forms')}
              </Link>
              <Link 
                href="#" 
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {getMenuText('help')}
              </Link>
            </div>
          </div>

          {/* Right side: Language Selector and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{currentLanguage.flag} {currentLanguage.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        if (onLanguageChange) {
                          onLanguageChange(lang.code);
                        }
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                        lang.code === selectedLanguage ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Max Mustermann</p>
                    <p className="text-xs text-gray-500">max@example.com</p>
                  </div>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {getMenuText('profile')}
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {getMenuText('settings')}
                  </Link>
                  <button
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {getMenuText('logout')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-2" />
                {getMenuText('home')}
              </div>
            </Link>
            <Link
              href="/forms/work-permit"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                {getMenuText('forms')}
              </div>
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                {getMenuText('help')}
              </div>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}