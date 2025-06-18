
import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FilterOptions } from '@/types/product';
import { filterMetadata } from '@/data/mockProducts';

interface ProductFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearAll: () => void;
  activeFiltersCount: number;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
  activeFiltersCount
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, availability]
      : filters.availability.filter(a => a !== availability);
    onFiltersChange({ ...filters, availability: newAvailability });
  };

  const handleMagneticFieldChange = (strength: string, checked: boolean) => {
    const newStrengths = checked
      ? [...filters.magneticFieldStrength, strength]
      : filters.magneticFieldStrength.filter(s => s !== strength);
    onFiltersChange({ ...filters, magneticFieldStrength: newStrengths });
  };

  const handleImagingCapabilityChange = (capability: string, checked: boolean) => {
    const newCapabilities = checked
      ? [...filters.imagingCapabilities, capability]
      : filters.imagingCapabilities.filter(c => c !== capability);
    onFiltersChange({ ...filters, imagingCapabilities: newCapabilities });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleBoreSizeRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, boreSizeRange: [value[0], value[1]] });
  };

  const handleCryogenFreeChange = (value: boolean | null) => {
    onFiltersChange({ ...filters, cryogenFree: value });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '−' : '+'}
        </Button>
      </div>

      {/* Clear All Button */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="w-full mb-4"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {isExpanded && (
        <div className="space-y-6">
          {/* Search "Do you have this?" */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Do you have this?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products, specs, features..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Price Range
            </label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={filterMetadata.priceRange[1]}
                min={filterMetadata.priceRange[0]}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${(filters.priceRange[0] / 1000000).toFixed(1)}M</span>
                <span>${(filters.priceRange[1] / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brand Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <div className="space-y-2">
              {filterMetadata.brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <div className="space-y-2">
              {filterMetadata.categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Availability Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Availability</label>
            <div className="space-y-2">
              {filterMetadata.availabilityOptions.map((availability) => (
                <div key={availability} className="flex items-center space-x-2">
                  <Checkbox
                    id={`availability-${availability}`}
                    checked={filters.availability.includes(availability)}
                    onCheckedChange={(checked) =>
                      handleAvailabilityChange(availability, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`availability-${availability}`}
                    className="text-sm text-gray-700 cursor-pointer capitalize"
                  >
                    {availability.replace('-', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* MRI Specific Filters */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h4 className="text-sm font-semibold text-blue-900">MRI Specifications</h4>

            {/* Magnetic Field Strength */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Magnetic Field Strength
              </label>
              <div className="space-y-2">
                {filterMetadata.magneticFieldStrengths.map((strength) => (
                  <div key={strength} className="flex items-center space-x-2">
                    <Checkbox
                      id={`strength-${strength}`}
                      checked={filters.magneticFieldStrength.includes(strength)}
                      onCheckedChange={(checked) =>
                        handleMagneticFieldChange(strength, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`strength-${strength}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {strength}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bore Size Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Bore Size (cm)
              </label>
              <div className="px-2">
                <Slider
                  value={filters.boreSizeRange}
                  onValueChange={handleBoreSizeRangeChange}
                  max={filterMetadata.boreSizeRange[1]}
                  min={filterMetadata.boreSizeRange[0]}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{filters.boreSizeRange[0]}cm</span>
                  <span>{filters.boreSizeRange[1]}cm</span>
                </div>
              </div>
            </div>

            {/* Cryogen-Free */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Cryogen-Free Technology
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cryogen-yes"
                    checked={filters.cryogenFree === true}
                    onCheckedChange={(checked) =>
                      handleCryogenFreeChange(checked ? true : null)
                    }
                  />
                  <label htmlFor="cryogen-yes" className="text-sm text-gray-700 cursor-pointer">
                    Yes
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cryogen-no"
                    checked={filters.cryogenFree === false}
                    onCheckedChange={(checked) =>
                      handleCryogenFreeChange(checked ? false : null)
                    }
                  />
                  <label htmlFor="cryogen-no" className="text-sm text-gray-700 cursor-pointer">
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Imaging Capabilities */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Imaging Capabilities
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterMetadata.imagingCapabilities.map((capability) => (
                  <div key={capability} className="flex items-center space-x-2">
                    <Checkbox
                      id={`capability-${capability}`}
                      checked={filters.imagingCapabilities.includes(capability)}
                      onCheckedChange={(checked) =>
                        handleImagingCapabilityChange(capability, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`capability-${capability}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {capability}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
