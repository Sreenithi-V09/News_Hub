import React from 'react';
import { Article } from '../types';
import { Bookmark, Share2, Sparkles, Clock, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NewsCardProps {
  article: Article;
  onSummaryClick: (article: Article) => void;
  onBookmarkClick: (article: Article) => void;
  isBookmarked: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onSummaryClick, onBookmarkClick, isBookmarked }) => {
  const { t } = useTranslation();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard (simple/subtle) or just alert
      navigator.clipboard.writeText(article.url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.urlToImage || 'https://picsum.photos/800/600'}
          alt={article.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
            {article.source.name}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center text-gray-500 text-xs mb-2 space-x-2">
          <Clock size={14} />
          <span>{formatDate(article.publishedAt)}</span>
          {article.category && (
            <>
              <span>•</span>
              <span className="text-primary font-medium capitalize">{article.category}</span>
            </>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {article.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onSummaryClick(article)}
            className="flex items-center space-x-1 text-primary hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <Sparkles size={16} />
            <span>{t('aiSummary.button')}</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onBookmarkClick(article)}
              className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-secondary bg-orange-50' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};