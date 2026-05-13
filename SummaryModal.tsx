import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { generateArticleSummary } from '../services/geminiService';
import { X, Sparkles, AlertCircle, Share2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SummaryModalProps {
  article: Article | null;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ article, onClose }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (article) {
      // Reset state
      setSummary('');
      setError(null);
      setLoading(true);

      const fetchSummary = async () => {
        // Check if we already have a summary cached in the article object (simulated)
        if (article.summary) {
          setSummary(article.summary);
          setLoading(false);
          return;
        }

        const generated = await generateArticleSummary(article.content || article.description);
        setSummary(generated);
        setLoading(false);
      };

      fetchSummary();
    }
  }, [article]);

  const handleShare = async () => {
    if (!article) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: summary || article.description,
          url: article.url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(article.url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-primary">
            <Sparkles size={24} className="animate-pulse" />
            <h2 className="text-xl font-bold">{t('aiSummary.title')}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <h3 className="font-bold text-gray-900 text-lg mb-2">{article.title}</h3>

          {loading ? (
            <div className="space-y-4 py-8">
              <div className="flex items-center space-x-3 text-gray-500 animate-pulse">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                <span className="text-sm font-medium">{t('aiSummary.generating')}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-4/6"></div>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-lg">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed text-base">
              {summary}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-2xl">
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">
              <Globe size={16} />
              <span>{t('aiSummary.translate')}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
            >
              <Share2 size={16} />
              <span>{t('aiSummary.share')}</span>
            </button>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:text-blue-700 hover:underline"
          >
            {t('aiSummary.readFull')}
          </a>
        </div>
      </div>
    </div>
  );
};