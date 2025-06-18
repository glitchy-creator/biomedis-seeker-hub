
import React from 'react';
import { Link } from 'react-router-dom';
import SearchHero from '@/components/SearchHero';
// import CategoriesGrid from '@/components/CategoriesGrid'; // Commented for future use - general medical categories
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SearchHero />
      
      {/* Commented out for future use - general medical equipment categories */}
      {/* <CategoriesGrid /> */}
      
      {/* MRI Filter Navigation Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Find Your Perfect MRI Scanner
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Use our advanced filters to find MRI equipment that matches your exact specifications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Browse All MRI */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Browse All MRI Scanners
            </h3>
            <p className="text-muted-foreground mb-6">
              View our complete catalog of MRI equipment from leading manufacturers
            </p>
            <Link to="/products">
              <Button size="lg" className="w-full">
                View All MRI Equipment
              </Button>
            </Link>
          </div>

          {/* Use Filters */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Filter className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Use Filters to Find MRI
            </h3>
            <p className="text-muted-foreground mb-6">
              Filter by Tesla strength, bore size, imaging capabilities, and more
            </p>
            <Link to="/products">
              <Button size="lg" variant="outline" className="w-full">
                Use MRI Filters
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Filter Options */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Popular MRI Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link to="/products?magneticField=1.5T" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-600">
                  1.5T MRI Scanners
                </h4>
                <p className="text-sm text-muted-foreground">
                  Reliable and cost-effective imaging
                </p>
              </div>
            </Link>

            <Link to="/products?magneticField=3.0T" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-green-600">
                  3.0T MRI Scanners
                </h4>
                <p className="text-sm text-muted-foreground">
                  High-resolution advanced imaging
                </p>
              </div>
            </Link>

            <Link to="/products?cryogenFree=true" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-purple-600">
                  Cryogen-Free MRI
                </h4>
                <p className="text-sm text-muted-foreground">
                  Low maintenance, eco-friendly
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
