
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Info, Phone, Mail, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Home className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Neo Rent</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('publicSite.home')}
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('publicSite.about.title')}
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('publicSite.contact.hero.title')}
              </Link>
              <LanguageSelector />
              <Link to="/login">
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <LogIn className="h-4 w-4" />
                  {t('publicSite.login')}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-700"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('publicSite.home')}
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('publicSite.about.title')}
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('publicSite.contact.hero.title')}
                </Link>
                <div className="px-3 py-2">
                  <LanguageSelector />
                </div>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full justify-center mt-2">
                    <LogIn className="h-4 w-4" />
                    {t('publicSite.login')}
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
                <span className="ml-2 text-lg font-bold">Neo Rent</span>
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
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    {t('publicSite.about.title')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    {t('publicSite.contact.hero.title')}
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
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Neotech-consulting. {t('publicSite.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
