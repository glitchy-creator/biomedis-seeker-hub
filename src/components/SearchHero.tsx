
import React, { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FileUpload from '@/components/FileUpload';
import ProductCarousel from '@/components/ProductCarousel';

// Mock MRI product data for demonstration
const mockMRIProducts = [
  {
    id: '1',
    name: 'Siemens MAGNETOM Vida 3T MRI Scanner',
    brand: 'Siemens',
    price: 2500000,
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'GE SIGNA Premier 3T MRI',
    brand: 'GE Healthcare',
    price: 2800000,
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Philips Ingenia 1.5T MRI',
    brand: 'Philips',
    price: 1800000,
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Canon Vantage Galan 3T MRI',
    brand: 'Canon Medical',
    price: 2300000,
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Hitachi Echelon Smart Plus 1.5T',
    brand: 'Hitachi',
    price: 1600000,
    image: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Bruker BioSpec 7T Research MRI',
    brand: 'Bruker',
    price: 1200000,
    image: '/placeholder.svg'
  }
];

// Commented out for future use - general medical equipment data
/*
const mockProducts = [
  {
    id: '1',
    name: 'Digital X-Ray Machine Model XR-2000',
    brand: 'MedTech Solutions',
    price: 45000,
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Portable Ultrasound Scanner US-Pro',
    brand: 'Healthcare Innovations',
    price: 28000,
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'ECG Monitor CardioMax 12-Lead',
    brand: 'CardioTech',
    price: 15000,
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Anesthesia Machine FlowMax 3000',
    brand: 'AnestheCare',
    price: 65000,
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Patient Monitor VitalPro 360',
    brand: 'VitalSystems',
    price: 18500,
    image: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Dental Chair ComfortMax Deluxe',
    brand: 'DentalPro',
    price: 12000,
    image: '/placeholder.svg'
  }
];
*/

const SearchHero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    console.log('Searching for MRI equipment:', searchQuery);
    
    // Simulate search - filter mock MRI products based on search query
    const filteredProducts = mockMRIProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // If no exact matches, show all MRI products as suggestions
    const results = filteredProducts.length > 0 ? filteredProducts : mockMRIProducts;
    
    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What MRI are you looking for?
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find the perfect MRI scanner for your healthcare facility
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Search Section */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for MRI scanners, Tesla strength, brand..."
                  className="pl-10 h-12 text-lg bg-white shadow-md border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button 
                size="lg" 
                className="w-full h-12 text-lg"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? 'Searching MRI Equipment...' : 'Search MRI Scanners'}
              </Button>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-primary mb-2" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Upload MRI Specification
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload PDF or image of your MRI requirements
                </p>
              </div>
              <FileUpload />
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="pb-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <ProductCarousel 
              products={searchResults}
              title={`MRI Search Results for "${searchQuery}"`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHero;
