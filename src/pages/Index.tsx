
import React from 'react';
import SearchHero from '@/components/SearchHero';
import CategoriesGrid from '@/components/CategoriesGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SearchHero />
      <CategoriesGrid />
    </div>
  );
};

export default Index;
