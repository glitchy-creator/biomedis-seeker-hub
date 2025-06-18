
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  currency?: string;
  category: string;
  availability: 'available' | 'out-of-stock' | 'pre-order';
  description?: string;
  specifications: ProductSpecifications;
}

export interface ProductSpecifications {
  // MRI Specific Specifications
  magneticFieldStrength?: '1.5T' | '3.0T' | '7T';
  boreSize?: number; // in cm
  cryogenFree?: boolean;
  imagingCapabilities?: string[];
  patientTableWeightCapacity?: number; // in kg
  gradientStrength?: number; // mT/m
  
  // General Specifications
  weight?: number;
  dimensions?: string;
  powerRequirement?: string;
  warranty?: string;
  certifications?: string[];
}

export interface FilterOptions {
  priceRange: [number, number];
  brands: string[];
  categories: string[];
  availability: string[];
  magneticFieldStrength: string[];
  boreSizeRange: [number, number];
  cryogenFree?: boolean | null;
  imagingCapabilities: string[];
  searchQuery: string;
}
