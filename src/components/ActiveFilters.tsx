
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterOptions } from '@/types/product';

interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll
}) => {
  const getActiveFilters = () => {
    const activeFilters: Array<{ type: string; label: string; value?: string }> = [];

    if (filters.searchQuery) {
      activeFilters.push({ type: 'search', label: `Search: "${filters.searchQuery}"` });
    }

    filters.brands.forEach(brand => {
      activeFilters.push({ type: 'brands', label: brand, value: brand });
    });

    filters.categories.forEach(category => {
      activeFilters.push({ type: 'categories', label: category, value: category });
    });

    filters.availability.forEach(availability => {
      activeFilters.push({ 
        type: 'availability', 
        label: availability.replace('-', ' '), 
        value: availability 
      });
    });

    filters.magneticFieldStrength.forEach(strength => {
      activeFilters.push({ type: 'magneticField', label: strength, value: strength });
    });

    if (filters.cryogenFree !== null && filters.cryogenFree !== undefined) {
      activeFilters.push({ 
        type: 'cryogenFree', 
        label: `Cryogen-Free: ${filters.cryogenFree ? 'Yes' : 'No'}` 
      });
    }

    filters.imagingCapabilities.forEach(capability => {
      activeFilters.push({ type: 'imagingCapabilities', label: capability, value: capability });
    });

    // Price range (only show if not default)
    const defaultPriceRange = [500000, 3000000];
    if (filters.priceRange[0] !== defaultPriceRange[0] || filters.priceRange[1] !== defaultPriceRange[1]) {
      activeFilters.push({ 
        type: 'priceRange', 
        label: `$${(filters.priceRange[0] / 1000000).toFixed(1)}M - $${(filters.priceRange[1] / 1000000).toFixed(1)}M` 
      });
    }

    // Bore size range (only show if not default)
    const defaultBoreRange = [30, 80];
    if (filters.boreSizeRange[0] !== defaultBoreRange[0] || filters.boreSizeRange[1] !== defaultBoreRange[1]) {
      activeFilters.push({ 
        type: 'boreSize', 
        label: `Bore: ${filters.boreSizeRange[0]}cm - ${filters.boreSizeRange[1]}cm` 
      });
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Active Filters:</span>
        
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.type}-${filter.value || filter.label}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 py-1 px-2"
          >
            <span className="text-xs">{filter.label}</span>
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="ml-2 text-xs"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default ActiveFilters;
