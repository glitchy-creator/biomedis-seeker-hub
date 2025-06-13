
import React, { useState } from 'react';
import { Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import ProductCarousel from '@/components/ProductCarousel';

interface SpecificationFilterProps {
  specData: {
    productType: string;
    category: string;
    specifications: Record<string, string>;
    matchedProducts: any[];
  };
  onFilterApply: (filters: string[]) => void;
}

const SpecificationFilter: React.FC<SpecificationFilterProps> = ({ 
  specData, 
  onFilterApply 
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const filterOptions = [
    'Flow Rate (LPM)', 'Micron Rating', 'Material Type', 'Pressure Range',
    'Temperature Range', 'Filter Life', 'Certifications', 'Power Requirements',
    'Price Range', 'Brand', 'Warranty Period', 'Size/Dimensions'
  ];

  const handleFilterChange = (filter: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters([...selectedFilters, filter]);
    } else {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    }
  };

  const handleApplyFilters = () => {
    onFilterApply(selectedFilters);
    setShowRecommendations(true);
  };

  const hasMatches = specData.matchedProducts.length > 0;

  return (
    <div className="space-y-6">
      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasMatches ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            Specification Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Product Type</p>
              <Badge variant="secondary">{specData.productType}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline">{specData.category}</Badge>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Extracted Specifications</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(specData.specifications).map(([key, value]) => (
                <div key={key} className="text-xs bg-gray-50 p-2 rounded">
                  <span className="font-medium capitalize">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>

          {hasMatches ? (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                ✓ Found {specData.matchedProducts.length} matching products based on your specifications
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                ⚠ No exact matches found. Use the filters below to find similar products.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select the specifications you want to filter by to find similar products:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filterOptions.map((filter) => (
              <div key={filter} className="flex items-center space-x-2">
                <Checkbox
                  id={filter}
                  checked={selectedFilters.includes(filter)}
                  onCheckedChange={(checked) => 
                    handleFilterChange(filter, checked as boolean)
                  }
                />
                <label
                  htmlFor={filter}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {filter}
                </label>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleApplyFilters}
            disabled={selectedFilters.length === 0}
            className="w-full"
          >
            Apply Filters & Find Similar Products
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {(hasMatches || showRecommendations) && (
        <div>
          <ProductCarousel 
            products={specData.matchedProducts}
            title={hasMatches ? "Recommended Products Based on Your Specifications" : "Similar Products You Might Like"}
          />
        </div>
      )}
    </div>
  );
};

export default SpecificationFilter;
