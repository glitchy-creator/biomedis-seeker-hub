
import { useState, useMemo, useEffect } from 'react';
import { Product, FilterOptions } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';

const defaultFilters: FilterOptions = {
  priceRange: [500000, 3000000],
  brands: [],
  categories: [],
  availability: [],
  magneticFieldStrength: [],
  boreSizeRange: [30, 80],
  cryogenFree: null,
  imagingCapabilities: [],
  searchQuery: ''
};

export const useProductFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  // Load filters from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters: Partial<FilterOptions> = {};

    // Parse URL parameters
    const brands = urlParams.get('brands');
    if (brands) urlFilters.brands = brands.split(',');

    const categories = urlParams.get('categories');
    if (categories) urlFilters.categories = categories.split(',');

    const availability = urlParams.get('availability');
    if (availability) urlFilters.availability = availability.split(',');

    const magneticField = urlParams.get('magneticField');
    if (magneticField) urlFilters.magneticFieldStrength = magneticField.split(',');

    const imagingCaps = urlParams.get('imagingCapabilities');
    if (imagingCaps) urlFilters.imagingCapabilities = imagingCaps.split(',');

    const search = urlParams.get('search');
    if (search) urlFilters.searchQuery = search;

    const priceMin = urlParams.get('priceMin');
    const priceMax = urlParams.get('priceMax');
    if (priceMin && priceMax) {
      urlFilters.priceRange = [parseInt(priceMin), parseInt(priceMax)];
    }

    const boreMin = urlParams.get('boreMin');
    const boreMax = urlParams.get('boreMax');
    if (boreMin && boreMax) {
      urlFilters.boreSizeRange = [parseInt(boreMin), parseInt(boreMax)];
    }

    const cryogen = urlParams.get('cryogenFree');
    if (cryogen) urlFilters.cryogenFree = cryogen === 'true';

    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const urlParams = new URLSearchParams();

    if (filters.brands.length > 0) urlParams.set('brands', filters.brands.join(','));
    if (filters.categories.length > 0) urlParams.set('categories', filters.categories.join(','));
    if (filters.availability.length > 0) urlParams.set('availability', filters.availability.join(','));
    if (filters.magneticFieldStrength.length > 0) urlParams.set('magneticField', filters.magneticFieldStrength.join(','));
    if (filters.imagingCapabilities.length > 0) urlParams.set('imagingCapabilities', filters.imagingCapabilities.join(','));
    if (filters.searchQuery) urlParams.set('search', filters.searchQuery);
    if (filters.priceRange[0] !== defaultFilters.priceRange[0] || filters.priceRange[1] !== defaultFilters.priceRange[1]) {
      urlParams.set('priceMin', filters.priceRange[0].toString());
      urlParams.set('priceMax', filters.priceRange[1].toString());
    }
    if (filters.boreSizeRange[0] !== defaultFilters.boreSizeRange[0] || filters.boreSizeRange[1] !== defaultFilters.boreSizeRange[1]) {
      urlParams.set('boreMin', filters.boreSizeRange[0].toString());
      urlParams.set('boreMax', filters.boreSizeRange[1].toString());
    }
    if (filters.cryogenFree !== null) urlParams.set('cryogenFree', filters.cryogenFree.toString());

    const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchFields = [
          product.name,
          product.brand,
          product.description || '',
          product.category,
          ...Object.values(product.specifications).filter(Boolean).map(String),
          ...(product.specifications.imagingCapabilities || [])
        ];
        
        const matchesSearch = searchFields.some(field => 
          field.toString().toLowerCase().includes(query)
        );
        
        if (!matchesSearch) return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Availability filter
      if (filters.availability.length > 0 && !filters.availability.includes(product.availability)) {
        return false;
      }

      // Magnetic field strength filter
      if (filters.magneticFieldStrength.length > 0) {
        if (!product.specifications.magneticFieldStrength || 
            !filters.magneticFieldStrength.includes(product.specifications.magneticFieldStrength)) {
          return false;
        }
      }

      // Bore size filter
      if (product.specifications.boreSize) {
        if (product.specifications.boreSize < filters.boreSizeRange[0] || 
            product.specifications.boreSize > filters.boreSizeRange[1]) {
          return false;
        }
      }

      // Cryogen-free filter
      if (filters.cryogenFree !== null) {
        if (product.specifications.cryogenFree !== filters.cryogenFree) {
          return false;
        }
      }

      // Imaging capabilities filter
      if (filters.imagingCapabilities.length > 0) {
        if (!product.specifications.imagingCapabilities || 
            !filters.imagingCapabilities.some(cap => 
              product.specifications.imagingCapabilities?.includes(cap)
            )) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'search':
        setFilters(prev => ({ ...prev, searchQuery: '' }));
        break;
      case 'brands':
        if (value) {
          setFilters(prev => ({ 
            ...prev, 
            brands: prev.brands.filter(b => b !== value) 
          }));
        }
        break;
      case 'categories':
        if (value) {
          setFilters(prev => ({ 
            ...prev, 
            categories: prev.categories.filter(c => c !== value) 
          }));
        }
        break;
      case 'availability':
        if (value) {
          setFilters(prev => ({ 
            ...prev, 
            availability: prev.availability.filter(a => a !== value) 
          }));
        }
        break;
      case 'magneticField':
        if (value) {
          setFilters(prev => ({ 
            ...prev, 
            magneticFieldStrength: prev.magneticFieldStrength.filter(s => s !== value) 
          }));
        }
        break;
      case 'imagingCapabilities':
        if (value) {
          setFilters(prev => ({ 
            ...prev, 
            imagingCapabilities: prev.imagingCapabilities.filter(c => c !== value) 
          }));
        }
        break;
      case 'cryogenFree':
        setFilters(prev => ({ ...prev, cryogenFree: null }));
        break;
      case 'priceRange':
        setFilters(prev => ({ ...prev, priceRange: defaultFilters.priceRange }));
        break;
      case 'boreSize':
        setFilters(prev => ({ ...prev, boreSizeRange: defaultFilters.boreSizeRange }));
        break;
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.availability.length > 0) count += filters.availability.length;
    if (filters.magneticFieldStrength.length > 0) count += filters.magneticFieldStrength.length;
    if (filters.imagingCapabilities.length > 0) count += filters.imagingCapabilities.length;
    if (filters.cryogenFree !== null) count++;
    if (filters.priceRange[0] !== defaultFilters.priceRange[0] || 
        filters.priceRange[1] !== defaultFilters.priceRange[1]) count++;
    if (filters.boreSizeRange[0] !== defaultFilters.boreSizeRange[0] || 
        filters.boreSizeRange[1] !== defaultFilters.boreSizeRange[1]) count++;
    return count;
  };

  return {
    filters,
    setFilters,
    filteredProducts,
    clearAllFilters,
    removeFilter,
    activeFiltersCount: getActiveFiltersCount()
  };
};
