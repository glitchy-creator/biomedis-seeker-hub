
import React, { useState } from 'react';
import { Filter, CheckCircle, AlertCircle, Plus, FileSearch, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProductCarousel from '@/components/ProductCarousel';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface SpecificationFilterProps {
  specData: {
    productType: string;
    category: string;
    specifications: Record<string, string>;
    matchedProducts: any[];
    isValid?: boolean;
    analysisError?: boolean;
    confidenceScores?: Record<string, number>;
    averageConfidence?: number;
    extractionMetadata?: {
      textLength: number;
      processingTime: number;
      extractionMethod: 'pdf' | 'ocr';
      specificationCount: number;
    };
  };
  onFilterApply: (filters: any) => void;
}

const SpecificationFilter: React.FC<SpecificationFilterProps> = ({ 
  specData, 
  onFilterApply 
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    magneticFieldStrength: [],
    boreSize: '',
    cryogenFree: '',
    gradientStrength: '',
    imagingCapabilities: [],
    priceRange: '',
    brand: [],
    powerRequirement: '',
    customRequirements: ''
  });
  const [showRecommendations, setShowRecommendations] = useState(false);

  // MRI-specific filter options
  const magneticFieldOptions = ['1.5T', '3.0T', '7T', '9.4T'];
  const boreSizeOptions = ['60 cm', '70 cm', '80 cm', '90 cm+'];
  const cryogenOptions = ['Yes (Cryogen-Free)', 'No (Helium-Cooled)', 'Either'];
  const gradientStrengthOptions = ['20-30 mT/m', '30-50 mT/m', '50-100 mT/m', '100+ mT/m'];
  const imagingCapabilityOptions = [
    'Neurological Imaging',
    'Cardiac Imaging', 
    'Musculoskeletal (MSK)',
    'Whole Body Imaging',
    'Pediatric Imaging',
    'Functional MRI (fMRI)',
    'Spectroscopy',
    'Angiography'
  ];
  const brandOptions = ['Siemens', 'GE Healthcare', 'Philips', 'Canon Medical', 'Hitachi'];
  const priceRanges = [
    'Under $1M',
    '$1M - $2M',
    '$2M - $3M', 
    '$3M+'
  ];
  const powerRequirementOptions = ['Under 30 kVA', '30-50 kVA', '50-70 kVA', '70+ kVA'];

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
  const hasValidSpecs = Object.keys(specData.specifications).length > 0;
  const isAnalysisError = specData.analysisError || false;

  // Helper function to get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-blue-600 bg-blue-50';
    if (confidence >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Helper function to format specification names
  const formatSpecName = (key: string) => {
    const nameMap: Record<string, string> = {
      magneticFieldStrength: 'Magnetic Field Strength',
      boreSize: 'Bore Size',
      gradientStrength: 'Gradient Strength',
      slewRate: 'Slew Rate',
      cryogenFree: 'Cryogen-Free Technology',
      patientTableWeightCapacity: 'Patient Weight Capacity',
      powerRequirement: 'Power Requirement',
      imagingCapabilities: 'Imaging Capabilities'
    };
    return nameMap[key] || key.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Analysis Results with Intelligence Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasValidSpecs && !isAnalysisError ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : isAnalysisError ? (
              <FileSearch className="h-5 w-5 text-yellow-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            🧠 AI MRI Specification Analysis
            {hasValidSpecs && !isAnalysisError && (
              <Badge variant="secondary" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Detected Equipment Type</p>
              <Badge variant={hasValidSpecs && !isAnalysisError ? "secondary" : "outline"}>
                {specData.productType}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline">{specData.category}</Badge>
            </div>
          </div>

          {/* Show extraction metadata */}
          {specData.extractionMetadata && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="font-medium">Extraction</p>
                <p className="text-blue-600">{specData.extractionMetadata.extractionMethod.toUpperCase()}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="font-medium">Text Length</p>
                <p className="text-green-600">{specData.extractionMetadata.textLength} chars</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="font-medium">Processing</p>
                <p className="text-purple-600">{(specData.extractionMetadata.processingTime/1000).toFixed(1)}s</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="font-medium">Specs Found</p>
                <p className="text-orange-600">{specData.extractionMetadata.specificationCount}</p>
              </div>
            </div>
          )}
          
          {hasValidSpecs && !isAnalysisError ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">🎯 Extracted MRI Specifications</p>
                {specData.averageConfidence && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Avg Confidence:</span>
                    <Progress value={specData.averageConfidence * 100} className="w-16 h-2" />
                    <span className="text-xs font-medium">{(specData.averageConfidence * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(specData.specifications).map(([key, value]) => {
                  const confidence = specData.confidenceScores?.[key] || 0;
                  return (
                    <div key={key} className={`p-3 rounded-lg border ${getConfidenceColor(confidence)}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{formatSpecName(key)}:</span>
                          <span className="ml-2 font-semibold">{value}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span className="text-xs font-medium">{(confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium mb-2">
                ⚠ MRI specifications not fully extracted from document
              </p>
              <p className="text-yellow-600 text-xs mb-2">
                The document may contain:
              </p>
              <ul className="text-yellow-600 text-xs list-disc list-inside space-y-1">
                <li>Unclear or low-quality technical images</li>
                <li>Non-standard MRI specification format</li>
                <li>Missing critical MRI technical details</li>
                <li>Unsupported document structure for MRI specs</li>
              </ul>
              <p className="text-yellow-600 text-xs mt-2 font-medium">
                💡 Use the advanced MRI filters below to search our database
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced MRI-Specific Filter Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            🔍 Find MRI Equipment in Our Database
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Use these MRI-specific filters to search our comprehensive database
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Magnetic Field Strength Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">🧲 Magnetic Field Strength (Tesla)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {magneticFieldOptions.map((tesla) => (
                <div key={tesla} className="flex items-center space-x-2">
                  <Checkbox
                    id={tesla}
                    checked={selectedFilters.magneticFieldStrength.includes(tesla)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange('magneticFieldStrength', tesla, checked as boolean)
                    }
                  />
                  <label htmlFor={tesla} className="text-sm">
                    {tesla}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Bore Size Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">🕳️ Bore Size</Label>
            <Select value={selectedFilters.boreSize} onValueChange={(value) => handleFilterChange('boreSize', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bore size range" />
              </SelectTrigger>
              <SelectContent>
                {boreSizeOptions.map((size) => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cryogen-Free Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">❄️ Cryogen-Free Technology</Label>
            <Select value={selectedFilters.cryogenFree} onValueChange={(value) => handleFilterChange('cryogenFree', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cryogen requirement" />
              </SelectTrigger>
              <SelectContent>
                {cryogenOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gradient Strength Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">⚡ Gradient Strength</Label>
            <Select value={selectedFilters.gradientStrength} onValueChange={(value) => handleFilterChange('gradientStrength', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gradient strength range" />
              </SelectTrigger>
              <SelectContent>
                {gradientStrengthOptions.map((strength) => (
                  <SelectItem key={strength} value={strength}>{strength}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Imaging Capabilities Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">🖼️ Imaging Capabilities</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {imagingCapabilityOptions.map((capability) => (
                <div key={capability} className="flex items-center space-x-2">
                  <Checkbox
                    id={capability}
                    checked={selectedFilters.imagingCapabilities.includes(capability)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange('imagingCapabilities', capability, checked as boolean)
                    }
                  />
                  <label htmlFor={capability} className="text-xs">
                    {capability}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">🏢 Manufacturer/Brand</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {brandOptions.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={selectedFilters.brand.includes(brand)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange('brand', brand, checked as boolean)
                    }
                  />
                  <label htmlFor={brand} className="text-sm">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">💰 Price Range</Label>
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

          {/* Power Requirements Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">⚡ Power Requirements</Label>
            <Select value={selectedFilters.powerRequirement} onValueChange={(value) => handleFilterChange('powerRequirement', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select power requirement range" />
              </SelectTrigger>
              <SelectContent>
                {powerRequirementOptions.map((power) => (
                  <SelectItem key={power} value={power}>{power}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Requirements Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Additional MRI Requirements
            </Label>
            <Textarea
              placeholder="Describe any other specific MRI requirements like RF channels, coil compatibility, software features, installation requirements, etc..."
              value={selectedFilters.customRequirements}
              onChange={(e) => handleFilterChange('customRequirements', e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              e.g., specific RF coil requirements, software compatibility, room shielding specifications, patient positioning features, etc.
            </p>
          </div>

          <Button 
            onClick={handleApplyFilters}
            className="w-full"
            size="lg"
          >
            🔍 Search MRI Database
          </Button>
        </CardContent>
      </Card>

      {/* AI-Matched Recommendations */}
      {(hasMatches || showRecommendations) && (
        <div>
          <ProductCarousel 
            products={specData.matchedProducts}
            title={hasMatches ? "🎯 AI-Recommended MRI Equipment Based on Your Document" : "🔥 Popular MRI Equipment"}
          />
        </div>
      )}
    </div>
  );
};

export default SpecificationFilter;
