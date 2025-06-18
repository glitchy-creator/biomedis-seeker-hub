
import { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Siemens MAGNETOM Vida 3T MRI Scanner',
    brand: 'Siemens',
    price: 2500000,
    currency: '$',
    image: '/placeholder.svg',
    category: 'MRI Scanners',
    availability: 'available',
    description: 'High-performance 3T MRI scanner with advanced imaging capabilities',
    specifications: {
      magneticFieldStrength: '3.0T',
      boreSize: 70,
      cryogenFree: true,
      imagingCapabilities: ['Brain Imaging', 'Cardiac Imaging', 'Whole Body', 'Diffusion Imaging'],
      patientTableWeightCapacity: 250,
      gradientStrength: 80,
      weight: 8500,
      dimensions: '3.5m x 2.5m x 2.2m',
      powerRequirement: '480V, 3-phase',
      warranty: '5 years',
      certifications: ['FDA', 'CE', 'ISO 13485']
    }
  },
  {
    id: '2',
    name: 'GE SIGNA Premier 3T MRI',
    brand: 'GE Healthcare',
    price: 2800000,
    currency: '$',
    image: '/placeholder.svg',
    category: 'MRI Scanners',
    availability: 'available',
    description: 'Premium 3T MRI with AI-powered imaging and wide bore design',
    specifications: {
      magneticFieldStrength: '3.0T',
      boreSize: 70,
      cryogenFree: false,
      imagingCapabilities: ['Neuroimaging', 'Orthopedic', 'Cardiac', 'Oncology'],
      patientTableWeightCapacity: 227,
      gradientStrength: 80,
      weight: 9200,
      dimensions: '3.6m x 2.4m x 2.3m',
      powerRequirement: '480V, 3-phase',
      warranty: '3 years',
      certifications: ['FDA', 'CE']
    }
  },
  {
    id: '3',
    name: 'Philips Ingenia 1.5T MRI',
    brand: 'Philips',
    price: 1800000,
    currency: '$',
    image: '/placeholder.svg',
    category: 'MRI Scanners',
    availability: 'available',
    description: 'Reliable 1.5T MRI scanner for general imaging applications',
    specifications: {
      magneticFieldStrength: '1.5T',
      boreSize: 70,
      cryogenFree: true,
      imagingCapabilities: ['General Imaging', 'Musculoskeletal', 'Abdominal'],
      patientTableWeightCapacity: 250,
      gradientStrength: 45,
      weight: 7800,
      dimensions: '3.2m x 2.3m x 2.1m',
      powerRequirement: '380V, 3-phase',
      warranty: '4 years',
      certifications: ['FDA', 'CE', 'ISO 13485']
    }
  },
  {
    id: '4',
    name: 'Canon Vantage Galan 3T MRI',
    brand: 'Canon Medical',
    price: 2300000,
    currency: '$',
    image: '/placeholder.svg',
    category: 'MRI Scanners',
    availability: 'pre-order',
    description: 'Advanced 3T MRI with helium-free technology',
    specifications: {
      magneticFieldStrength: '3.0T',
      boreSize: 71,
      cryogenFree: true,
      imagingCapabilities: ['Neuroimaging', 'Cardiac', 'Whole Body', 'Pediatric'],
      patientTableWeightCapacity: 200,
      gradientStrength: 100,
      weight: 8900,
      dimensions: '3.4m x 2.5m x 2.2m',
      powerRequirement: '480V, 3-phase',
      warranty: '5 years',
      certifications: ['FDA', 'CE']
    }
  },
  {
    id: '5',
    name: 'Hitachi Echelon Smart Plus 1.5T',
    brand: 'Hitachi',
    price: 1600000,
    currency: '$',
    image: '/placeholder.svg',
    category: 'MRI Scanners',
    availability: 'available',
    description: 'Compact 1.5T MRI with smart workflow features',
    specifications: {
      magneticFieldStrength: '1.5T',
      boreSize: 65,
      cryogenFree: false,
      imagingCapabilities: ['General Imaging', 'Orthopedic', 'Spine'],
      patientTableWeightCapacity: 200,
      gradientStrength: 33,
      weight: 7200,
      dimensions: '3.0m x 2.2m x 2.0m',
      powerRequirement: '380V, 3-phase',
      warranty: '3 years',
      certifications: ['FDA', 'CE']
    }
  },
  {
    id: '6',
    name: 'Bruker BioSpec 7T Research MRI',
    brand: 'Bruker',
    price: 1200000,
    currency: '$',
    image: '/placeholder.svg',
    category: 'Research Equipment',
    availability: 'available',
    description: 'Ultra-high field 7T MRI for preclinical research',
    specifications: {
      magneticFieldStrength: '7T',
      boreSize: 30,
      cryogenFree: false,
      imagingCapabilities: ['Preclinical Research', 'Small Animal', 'High Resolution'],
      patientTableWeightCapacity: 50,
      gradientStrength: 1500,
      weight: 3500,
      dimensions: '2.0m x 1.5m x 1.8m',
      powerRequirement: '380V, 3-phase',
      warranty: '2 years',
      certifications: ['CE', 'ISO 13485']
    }
  }
];

export const filterMetadata = {
  brands: ['Siemens', 'GE Healthcare', 'Philips', 'Canon Medical', 'Hitachi', 'Bruker'],
  categories: ['MRI Scanners', 'Research Equipment'],
  availabilityOptions: ['available', 'out-of-stock', 'pre-order'],
  magneticFieldStrengths: ['1.5T', '3.0T', '7T'],
  imagingCapabilities: [
    'Brain Imaging', 'Cardiac Imaging', 'Whole Body', 'Diffusion Imaging',
    'Neuroimaging', 'Orthopedic', 'Oncology', 'General Imaging',
    'Musculoskeletal', 'Abdominal', 'Pediatric', 'Spine',
    'Preclinical Research', 'Small Animal', 'High Resolution'
  ],
  priceRange: [500000, 3000000] as [number, number],
  boreSizeRange: [30, 80] as [number, number]
};
