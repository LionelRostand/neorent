
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { CookieBanner } from './CookieBanner';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-green-600 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Neo Rent</span>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Accueil
              </Link>
              <Link 
                to="/properties" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/properties') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Propriétés
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                À Propos
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/contact') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Contact
              </Link>
              <Link 
                to="/login" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Connexion
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link 
                to="/login" 
                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Connexion
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex flex-col space-y-2 py-4 border-t">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Accueil
              </Link>
              <Link 
                to="/properties" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/properties') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Propriétés
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                À Propos
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/contact') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">Neo Rent</span>
              </div>
              <p className="text-gray-400 text-sm">
                Votre partenaire de confiance pour la gestion immobilière moderne et efficace.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-400 hover:text-white text-sm">Accueil</Link>
                <Link to="/properties" className="block text-gray-400 hover:text-white text-sm">Propriétés</Link>
                <Link to="/about" className="block text-gray-400 hover:text-white text-sm">À Propos</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white text-sm">Contact</Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm">Gestion locative</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm">Maintenance</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm">Suivi financier</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm">Support 24/7</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>contact@neorent.fr</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>Paris, France</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Neo Rent. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/politique-cookies" className="text-gray-400 hover:text-white text-sm">Politique de cookies</Link>
              <Link to="/mentions-legales" className="text-gray-400 hover:text-white text-sm">Mentions légales</Link>
              <Link to="/confidentialite" className="text-gray-400 hover:text-white text-sm">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
};

export default PublicLayout;
