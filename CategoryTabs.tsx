import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface CategoryTabsProps {
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar bg-white border-b border-gray-100 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 py-3">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 
              ${selectedCategory === 'all' 
                ? 'bg-primary text-white shadow-md shadow-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All News
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200
                ${selectedCategory === cat 
                  ? 'bg-primary text-white shadow-md shadow-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};