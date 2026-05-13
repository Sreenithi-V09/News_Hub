import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { NewsCard } from './components/NewsCard';
import { SummaryModal } from './components/SummaryModal';
import { Article, Category } from './types';
import { fetchNews } from './services/newsService';
import { Inbox, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  // State
  const [currentView, setCurrentView] = useState<'home' | 'bookmarks'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticleForSummary, setSelectedArticleForSummary] = useState<Article | null>(null);
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
    const saved = localStorage.getItem('newsHub_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  // Fetch News Effect
  useEffect(() => {
    if (currentView === 'home') {
      const loadNews = async () => {
        setLoading(true);
        try {
          const data = await fetchNews(selectedCategory, searchQuery);
          setArticles(data);
        } catch (err) {
          console.error("Failed to fetch news", err);
        } finally {
          setLoading(false);
        }
      };
      loadNews();
    }
  }, [selectedCategory, searchQuery, currentView]);

  // Persist Bookmarks
  useEffect(() => {
    localStorage.setItem('newsHub_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Handlers
  const toggleBookmark = (article: Article) => {
    setBookmarks(prev => {
      const isSaved = prev.some(a => a.id === article.id);
      if (isSaved) {
        return prev.filter(a => a.id !== article.id);
      } else {
        return [...prev, article];
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('home');
    setSelectedCategory('all');
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isBookmarked = (id: string) => bookmarks.some(a => a.id === id);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation */}
        <Header
          onSearch={handleSearch}
          toggleSidebar={handleSidebarToggle}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {/* Categories (Only visible on Home) */}
        {currentView === 'home' && (
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSearchQuery(''); // Clear search when changing category
            }}
          />
        )}

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

          {/* Section Title */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentView === 'home'
                ? (searchQuery ? t('search.results', { query: searchQuery }) : t('headlines'))
                : t('bookmarks.title')}
            </h1>
            {currentView === 'home' && !loading && (
              <span className="text-sm text-gray-500">{t('search.count', { count: articles.length })}</span>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-96 shadow-sm border border-gray-100 p-4 animate-pulse flex flex-col">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="flex-grow"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Empty States */}
              {currentView === 'home' && articles.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Inbox size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('search.noResults')}</h3>
                  <p className="text-gray-500">{t('search.noResultsDesc')}</p>
                </div>
              )}

              {currentView === 'bookmarks' && bookmarks.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
                    <Inbox size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('bookmarks.emptyTitle')}</h3>
                  <p className="text-gray-500">{t('bookmarks.emptyDesc')}</p>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                  >
                    {t('bookmarks.explore')}
                  </button>
                </div>
              )}

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(currentView === 'home' ? articles : bookmarks).map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onSummaryClick={setSelectedArticleForSummary}
                    onBookmarkClick={toggleBookmark}
                    isBookmarked={isBookmarked(article.id)}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* Mobile Sidebar (Simple implementation) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 flex flex-col">
              <div className="text-xl font-bold mb-8 text-primary px-2">{t('appTitle')}</div>
              <div className="space-y-2">
                <button
                  onClick={() => { setCurrentView('home'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium ${currentView === 'home' ? 'bg-blue-50 text-primary' : 'text-gray-600'}`}
                >
                  {t('nav.feed')}
                </button>
                <button
                  onClick={() => { setCurrentView('bookmarks'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium ${currentView === 'bookmarks' ? 'bg-orange-50 text-secondary' : 'text-gray-600'}`}
                >
                  {t('nav.bookmarks')}
                </button>
              </div>

              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-2 text-gray-400 px-4 text-sm">
                  <Smartphone size={16} />
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary Modal */}
        <SummaryModal
          article={selectedArticleForSummary}
          onClose={() => setSelectedArticleForSummary(null)}
        />

      </div>
    </Router>
  );
};

export default App;