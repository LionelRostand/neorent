import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Info, Phone, Mail, LogIn, Menu, X, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import CopyrightModal from './CopyrightModal';
import { CookieBanner } from './CookieBanner';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCopyrightModalOpen, setIsCopyrightModalOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCopyrightClick = () => {
    setIsCopyrightModalOpen(true);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      path: '/',
      label: t('publicSite.home'),
      icon: Home
    },
    {
      path: '/properties',
      label: t('publicSite.properties'),
      icon: Building
    },
    {
      path: '/about',
      label: t('publicSite.about.title'),
      icon: Info
    },
    {
      path: '/contact',
      label: t('publicSite.contact.hero.title'),
      icon: Phone
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-lg border-b-2 border-green-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-green-600 p-2 rounded-xl shadow-md">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  NEORENT
                </span>
                <div className="text-xs text-gray-500 font-medium">Gestion immobilière</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group relative px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2
                      ${isActive 
                        ? 'bg-green-50 text-green-700 shadow-sm' 
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }
                    `}
                  >
                    <item.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-green-600' : ''}`} />
                    <span className="relative">
                      {item.label}
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600 rounded-full"></div>
                      )}
                    </span>
                  </Link>
                );
              })}
              
              {/* Language Selector with improved styling */}
              <div className="ml-4 px-2">
                <LanguageSelector />
              </div>
              
              {/* Login Button with enhanced design */}
              <Link to="/login" className="ml-4">
                <Button className="
                  flex items-center gap-2 
                  bg-gradient-to-r from-green-600 to-green-700 
                  hover:from-green-700 hover:to-green-800 
                  text-white font-semibold
                  px-6 py-3 rounded-xl
                  shadow-lg hover:shadow-xl
                  transition-all duration-300
                  transform hover:scale-105
                ">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:bg-green-50 p-3 rounded-xl transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 bg-white rounded-b-2xl shadow-xl">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                        ${isActive 
                          ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? 'text-green-600' : ''}`} />
                      {item.label}
                    </Link>
                  );
                })}
                
                <div className="px-4 py-3 border-t border-gray-100 mt-2">
                  <LanguageSelector />
                </div>
                
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4">
                  <Button className="
                    flex items-center gap-2 
                    bg-gradient-to-r from-green-600 to-green-700 
                    hover:from-green-700 hover:to-green-800 
                    text-white font-semibold
                    w-full justify-center 
                    py-3 rounded-xl
                    shadow-lg
                    transition-all duration-300
                  ">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Home className="h-6 w-6 text-green-400" />
                <span className="ml-2 text-lg font-bold">NEORENT</span>
              </Link>
              <p className="mt-4 text-gray-400 text-sm lg:text-base">
                {t('publicSite.footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('publicSite.footer.usefulLinks')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    {t('publicSite.home')}
                  </Link>
                </li>
                <li>
                  <Link to="/properties" className="text-gray-400 hover:text-white transition-colors">
                    {t('publicSite.properties')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    {t('publicSite.about.title')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    {t('publicSite.contact.hero.title')}
                  </Link>
                </li>
                <li>
                  <Link to="/legal-notice" className="text-gray-400 hover:text-white transition-colors">
                    {t('publicSite.footer.legalNotice')}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    {t('publicSite.footer.privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                    Politique de cookies
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('publicSite.footer.contact')}</h3>
              <div className="space-y-2 text-gray-400 text-sm lg:text-base">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>contact@neorent.fr</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>+33 1 23 45 67 89</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Copyright et protection intellectuelle */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="text-center text-gray-400 text-sm space-y-2">
              <p>
                <button
                  onClick={handleCopyrightClick}
                  className="hover:text-white transition-colors underline cursor-pointer"
                >
                  COPYRIGHT
                </button>
                {" "}&copy; 2025 Neotech-consulting. {t('publicSite.footer.copyright')}
              </p>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />

      <CopyrightModal 
        isOpen={isCopyrightModalOpen} 
        onClose={() => setIsCopyrightModalOpen(false)} 
      />
    </div>
  );
};

export default PublicLayout;
