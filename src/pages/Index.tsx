
import React from 'react';
import { Link } from 'react-router-dom';
import SearchHero from '@/components/SearchHero';
import CategoriesGrid from '@/components/CategoriesGrid';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SearchHero />
      <CategoriesGrid />
      
      {/* Quick Access to Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Explore Our Medical Equipment
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse our comprehensive catalog with advanced filtering options
          </p>
          <Link to="/products">
            <Button size="lg" className="px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
