import React, { useState } from 'react';
import { Menu, Search, X, Newspaper, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onSearch: (query: string) => void;
  toggleSidebar: () => void;
  currentView: 'home' | 'bookmarks';
  setCurrentView: (view: 'home' | 'bookmarks') => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, toggleSidebar, currentView, setCurrentView }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t, i18n } = useTranslation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left: Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="bg-primary text-white p-1.5 rounded-lg mr-2">
              <Newspaper size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              News<span className="text-primary">Hub</span>
            </span>
          </div>

          {/* Middle: Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => setCurrentView('home')}
              className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t('nav.feed')}
            </button>
            <button
              onClick={() => setCurrentView('bookmarks')}
              className={`text-sm font-medium transition-colors ${currentView === 'bookmarks' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t('nav.bookmarks')}
            </button>
          </nav>

          {/* Right: Search & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-full transition-colors hidden sm:block"
              title="Switch Language"
            >
              <span className="font-bold text-xs flex items-center gap-1">
                <Globe size={16} />
                {i18n.language === 'en' ? 'HI' : 'EN'}
              </span>
            </button>

            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 animate-in fade-in slide-in-from-right-10 duration-200">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="bg-transparent border-none focus:ring-0 text-sm w-32 sm:w-64 outline-none text-gray-800 placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 text-gray-500 hover:text-red-500">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-full transition-colors"
                title="Search"
              >
                <Search size={20} />
              </button>
            )}

            <button
              className="md:hidden p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-full"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};