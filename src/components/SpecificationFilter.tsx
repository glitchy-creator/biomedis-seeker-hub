
import React, { useState } from 'react';
import { Filter, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProductCarousel from '@/components/ProductCarousel';
import { Textarea } from '@/components/ui/textarea';

interface SpecificationFilterProps {
  specData: {
    productType: string;
    category: string;
    specifications: Record<string, string>;
    matchedProducts: any[];
    isValid?: boolean;
  };
  onFilterApply: (filters: any) => void;
}

const SpecificationFilter: React.FC<SpecificationFilterProps> = ({ 
  specData, 
  onFilterApply 
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    country: '',
    equipmentType: [],
    userType: '',
    certifications: [],
    priceRange: '',
    supportServices: [],
    customRequirements: ''
  });
  const [showRecommendations, setShowRecommendations] = useState(false);

  const countryOptions = [
    'Germany',
    'United States', 
    'Netherlands',
    'Sweden',
    'Ireland',
    'Japan',
    'Others (specify)'
  ];

  const equipmentTypes = [
    'MRI/CT Scanners',
    'Surgical Robots',
    'Linear Accelerators (Radiation Therapy)',
    'ECMO Machines',
    'Digital Pathology Equipment',
    'Patient Monitoring Systems',
    'Dialysis Machines',
    'Infusion Pumps',
    'Hospital Beds & ICU Furniture',
    'Anesthesia & Ventilation Devices'
  ];

  const userTypes = [
    'Hospitals',
    'Clinics',
    'Research Institutions',
    'Government Facilities',
    'Home Healthcare Providers'
  ];

  const certificationOptions = [
    'ISO 13485 (Medical Device Quality Management)',
    'FDA Approved (U.S.)',
    'CE Mark (EU)',
    'WHO GMP',
    'Others'
  ];

  const priceRanges = [
    '$0 – $100,000',
    '$100,000 – $500,000',
    '$500,000 – $1 million',
    '$1 million+'
  ];

  const supportServices = [
    'Installation',
    'Training',
    'Maintenance Contracts',
    'Warranty',
    'Remote Support',
    'Spare Parts Availability'
  ];

  const handleFilterChange = (filterType: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleArrayFilterChange = (filterType: string, item: string, checked: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], item]
        : prev[filterType].filter(i => i !== item)
    }));
  };

  const handleApplyFilters = () => {
    onFilterApply(selectedFilters);
    setShowRecommendations(true);
  };

  const hasMatches = specData.matchedProducts.length > 0;
  const isValidSpecification = specData.isValid !== false;

  // Show error message if specification is invalid
  if (!isValidSpecification) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Invalid Technical Specification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-700 font-medium mb-2">
              ⚠ No valid technical specifications found in the uploaded document.
            </p>
            <p className="text-red-600 text-sm">
              Please upload a document that contains:
            </p>
            <ul className="text-red-600 text-sm mt-2 list-disc list-inside space-y-1">
              <li>Equipment specifications (technical parameters, dimensions, power requirements)</li>
              <li>Model numbers or product names</li>
              <li>Performance criteria or requirements</li>
              <li>Compliance standards or certifications needed</li>
            </ul>
            <p className="text-red-600 text-sm mt-3">
              Try uploading a clearer image or a PDF with detailed technical information.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

      {/* Enhanced Filter Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filter Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Country/Region Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Country / Region</Label>
            <Select value={selectedFilters.country} onValueChange={(value) => handleFilterChange('country', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country or region" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Equipment Type / Specialization</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {equipmentTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedFilters.equipmentType.includes(type)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange('equipmentType', type, checked as boolean)
                    }
                  />
                  <label htmlFor={type} className="text-xs leading-tight">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* User Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Target Market / User Type</Label>
            <Select value={selectedFilters.userType} onValueChange={(value) => handleFilterChange('userType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select target market" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Certifications Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Required Certifications</Label>
            <div className="grid grid-cols-1 gap-2">
              {certificationOptions.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={cert}
                    checked={selectedFilters.certifications.includes(cert)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange('certifications', cert, checked as boolean)
                    }
                  />
                  <label htmlFor={cert} className="text-xs">
                    {cert}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Price Range</Label>
            <Select value={selectedFilters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Support Services Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Support Services Offered</Label>
            <div className="grid grid-cols-2 gap-2">
              {supportServices.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={selectedFilters.supportServices.includes(service)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange('supportServices', service, checked as boolean)
                    }
                  />
                  <label htmlFor={service} className="text-xs">
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Requirements Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Additional Requirements
            </Label>
            <Textarea
              placeholder="Describe any other specific requirements, features, or criteria you need for the equipment..."
              value={selectedFilters.customRequirements}
              onChange={(e) => handleFilterChange('customRequirements', e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              e.g., specific dimensions, power requirements, compatibility with existing systems, etc.
            </p>
          </div>

          <Button 
            onClick={handleApplyFilters}
            className="w-full"
            size="lg"
          >
            Apply Filters & Find Equipment
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
