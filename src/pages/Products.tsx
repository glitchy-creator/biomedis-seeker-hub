
import React from 'react';
import ProductFilter from '@/components/ProductFilter';
import ActiveFilters from '@/components/ActiveFilters';
import ProductCarousel from '@/components/ProductCarousel';
import { useProductFilters } from '@/hooks/useProductFilters';

const Products = () => {
  const {
    filters,
    setFilters,
    filteredProducts,
    clearAllFilters,
    removeFilter,
    activeFiltersCount
  } = useProductFilters();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <ProductFilter
          filters={filters}
          onFiltersChange={setFilters}
          onClearAll={clearAllFilters}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Active Filters */}
          <ActiveFilters
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearAll={clearAllFilters}
          />

          {/* Products Section */}
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Medical Equipment
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
                {activeFiltersCount > 0 && ` with ${activeFiltersCount} active filters`}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <ProductCarousel
                products={filteredProducts}
                title="Available Equipment"
              />
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">🔍</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search criteria to find what you're looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
