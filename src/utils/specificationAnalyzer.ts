
import { supabase } from '@/integrations/supabase/client';

interface SpecificationData {
  productType: string;
  category: string;
  specifications: Record<string, string>;
  matchedProducts: any[];
}

export class SpecificationAnalyzer {
  
  // Sample product database for recommendations
  private static productDatabase = [
    {
      id: '1',
      name: 'MRI Scanner - Magnetom Terra',
      brand: 'Siemens Healthineers',
      price: 2500000,
      category: 'Medical Imaging',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        magneticFieldStrength: '3 Tesla',
        gradientSystem: 'Up to 80 mT/m amplitude',
        weight: '10+ tons',
        powerConsumption: '200-300 kW/hour'
      }
    },
    {
      id: '2',
      name: 'Surgical Robot - da Vinci Xi HD',
      brand: 'Intuitive Surgical',
      price: 2000000,
      category: 'Surgical Equipment',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        roboticArms: '4 interactive arms',
        camera: '3D High-definition vision',
        controlConsole: 'Ergonomic surgeon console',
        dimensions: '1.2m x 1m x 1.8m'
      }
    },
    {
      id: '3',
      name: 'Linear Accelerator - Versa HD',
      brand: 'Elekta',
      price: 3000000,
      category: 'Radiation Therapy',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        energyLevels: '6 MeV – 10 MeV photon energy',
        beamAgility: 'Fast dynamic beam shaping',
        treatmentTypes: 'IMRT, VMAT, SBRT, SRS',
        accuracy: 'Sub-millimeter targeting precision'
      }
    },
    {
      id: '4',
      name: 'ECMO Machine - Cardiohelp System',
      brand: 'Getinge',
      price: 200000,
      category: 'Critical Care',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        flowRange: '0.3 – 7.2 L/min',
        pumpType: 'Centrifugal pump',
        portability: 'Mobile, portable',
        weight: '15 kg'
      }
    },
    {
      id: '5',
      name: 'Digital Pathology Scanner - Aperio AT2 DX',
      brand: 'Leica Biosystems',
      price: 325000,
      category: 'Laboratory Equipment',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        scanningResolution: '0.25 µm/pixel',
        slideCapacity: '500 slides per batch',
        scanSpeed: '60 seconds per slide',
        imageFormats: 'SVS, TIFF, JPEG, NDPI'
      }
    }
  ];

  static async analyzeUploadedFile(file: File): Promise<SpecificationData> {
    console.log('Analyzing uploaded specification file:', file.name);
    
    try {
      // Save the uploaded document to database
      await this.saveUploadedDocument(file);
      
      // Extract text from the file
      const extractedText = await this.extractTextFromFile(file);
      console.log('Extracted text:', extractedText);
      
      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('No readable text found in the document');
      }
      
      // Parse specifications from extracted text
      const result = this.parseSpecifications(extractedText);
      
      // Update the database with extracted specifications
      await this.updateDocumentSpecifications(file.name, result.specifications);
      
      return result;
    } catch (error) {
      console.error('Error analyzing specification file:', error);
      throw new Error('Failed to analyze specification file: ' + error.message);
    }
  }

  private static async saveUploadedDocument(file: File): Promise<void> {
    try {
      const { error } = await supabase
        .from('uploaded_documents')
        .insert({
          filename: file.name,
          file_path: `/uploads/${file.name}`,
          file_type: file.type,
          file_size: file.size,
          processing_status: 'processing',
          uploaded_by: 'anonymous'
        });
      
      if (error) {
        console.error('Error saving document to database:', error);
      }
    } catch (error) {
      console.error('Database save error:', error);
    }
  }

  private static async updateDocumentSpecifications(filename: string, specifications: Record<string, string>): Promise<void> {
    try {
      const { error } = await supabase
        .from('uploaded_documents')
        .update({
          extracted_specifications: specifications,
          processing_status: 'completed'
        })
        .eq('filename', filename);
      
      if (error) {
        console.error('Error updating document specifications:', error);
      }
    } catch (error) {
      console.error('Database update error:', error);
    }
  }

  private static async extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (file.type.startsWith('image/')) {
      return this.extractTextFromImage(file);
    }
    throw new Error('Unsupported file type');
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    // For demo purposes, we'll simulate PDF text extraction
    // In production, you'd use a library like pdf-parse or PDF.js
    console.log('Extracting text from PDF:', file.name);
    
    // Simulate realistic PDF content based on file name patterns
    if (file.name.toLowerCase().includes('mri') || file.name.toLowerCase().includes('scanner')) {
      return `
        Medical Equipment Specification
        Product: MRI Scanner System
        Type: Magnetic Resonance Imaging
        Field Strength: 3.0 Tesla
        Gradient Performance: 80 mT/m
        Slew Rate: 200 T/m/s
        RF Channels: 64 transmit/receive
        Power Requirements: 300 kW
        Cooling: Liquid Helium
        Room Requirements: RF shielded suite
        Manufacturer: Medical Imaging Corp
        Model: Advanced MRI-3000
        Certification: FDA Approved, CE Mark
        Applications: Neurological, Cardiac, Musculoskeletal imaging
      `;
    } else if (file.name.toLowerCase().includes('robot') || file.name.toLowerCase().includes('surgical')) {
      return `
        Surgical Robot Specifications
        Product: Robotic Surgical System
        Type: Minimally Invasive Surgery Robot
        Robotic Arms: 4 articulated arms
        Vision System: 3D HD stereoscopic
        Instruments: EndoWrist technology
        Control Console: Ergonomic surgeon interface
        Docking: Multi-quadrant patient access
        Software: AI-assisted guidance
        Power: Standard hospital AC
        Footprint: 2m x 1.5m operating space
        Certifications: FDA 510(k), CE Mark
      `;
    } else {
      return `
        Medical Equipment Specification Document
        Product Type: Healthcare Equipment
        Technical Specifications Available
        Power Requirements: Standard medical grade
        Compliance: Medical device standards
        Installation: Professional required
        Training: User certification needed
        Maintenance: Annual service contract
        Warranty: 2 year manufacturer warranty
      `;
    }
  }

  private static async extractTextFromImage(file: File): Promise<string> {
    // For demo purposes, we'll simulate OCR text extraction
    // In production, you'd use OCR libraries like Tesseract.js
    console.log('Extracting text from image:', file.name);
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Simulate OCR extraction based on image characteristics
        if (file.name.toLowerCase().includes('spec') || file.name.toLowerCase().includes('datasheet')) {
          resolve(`
            Equipment Datasheet
            Model: HD-Medical-2024
            Power: 110-240V AC
            Frequency: 50/60 Hz
            Operating Temperature: 15-35°C
            Humidity: 30-75% RH
            Dimensions: 120cm x 80cm x 160cm
            Weight: 450 kg
            Certification: ISO 13485, FDA
            Connectivity: Ethernet, Wi-Fi
            Display: 15" touchscreen
            Memory: 32GB storage
          `);
        } else {
          resolve(`
            Medical Equipment Image
            Technical specifications visible
            Professional medical device
            Hospital grade equipment
            Requires technical evaluation
            Contact manufacturer for details
          `);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  private static parseSpecifications(text: string): SpecificationData {
    const lines = text.split('\n').filter(line => line.trim());
    const specifications: Record<string, string> = {};
    let productType = 'Medical Equipment';
    let category = 'Healthcare Equipment';

    // Enhanced parsing logic
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const value = line.substring(colonIndex + 1).trim();
        
        if (value && value.length > 0) {
          specifications[key] = value;
        }
        
        // Determine product type and category from keywords
        const lowerValue = value.toLowerCase();
        const lowerKey = key.toLowerCase();
        
        if (lowerKey.includes('type') || lowerKey.includes('product')) {
          productType = value;
        }
        
        // Category detection
        if (lowerValue.includes('mri') || lowerValue.includes('scanner') || lowerValue.includes('imaging')) {
          category = 'Medical Imaging';
          productType = 'MRI/CT Scanner';
        } else if (lowerValue.includes('robot') || lowerValue.includes('surgical')) {
          category = 'Surgical Equipment';
          productType = 'Surgical Robot';
        } else if (lowerValue.includes('linear') || lowerValue.includes('radiation') || lowerValue.includes('accelerator')) {
          category = 'Radiation Therapy';
          productType = 'Linear Accelerator';
        } else if (lowerValue.includes('ecmo') || lowerValue.includes('life support') || lowerValue.includes('critical')) {
          category = 'Critical Care';
          productType = 'ECMO Machine';
        } else if (lowerValue.includes('pathology') || lowerValue.includes('scanner') || lowerValue.includes('laboratory')) {
          category = 'Laboratory Equipment';
          productType = 'Digital Pathology Equipment';
        }
      }
    });

    // Ensure we have meaningful specifications
    if (Object.keys(specifications).length === 0) {
      throw new Error('No technical specifications found in the document');
    }

    // Find matching products
    const matchedProducts = this.findSimilarProducts(specifications, category, productType);

    return {
      productType,
      category,
      specifications,
      matchedProducts
    };
  }

  private static findSimilarProducts(specs: Record<string, string>, category: string, productType: string) {
    const matches = this.productDatabase.filter(product => {
      // Match by category
      const categoryMatch = product.category.toLowerCase().includes(category.toLowerCase().split(' ')[0]);
      
      // Match by product type
      const typeMatch = product.name.toLowerCase().includes(productType.toLowerCase().split(' ')[0]) ||
                       productType.toLowerCase().includes(product.name.toLowerCase().split(' ')[0]);
      
      // Match by specifications
      const specMatch = Object.keys(specs).some(specKey => 
        Object.keys(product.specs).some(productSpecKey => 
          productSpecKey.toLowerCase().includes(specKey) || 
          specKey.includes(productSpecKey.toLowerCase())
        )
      );
      
      return categoryMatch || typeMatch || specMatch;
    });

    return matches.length > 0 ? matches : this.productDatabase.slice(0, 3); // Return top 3 if no matches
  }

  static getFilterOptions(category: string): string[] {
    const filterOptions: Record<string, string[]> = {
      'Medical Imaging': [
        'Magnetic Field Strength', 'Resolution', 'Imaging Modalities', 'Patient Positioning',
        'Contrast Support', 'Power Requirements', 'Room Shielding', 'Software Features'
      ],
      'Surgical Equipment': [
        'Degrees of Freedom', 'Vision System', 'Instrument Compatibility', 'Control Interface',
        'Setup Time', 'Footprint', 'Power Consumption', 'Training Requirements'
      ],
      'Radiation Therapy': [
        'Energy Levels', 'Beam Accuracy', 'Treatment Modalities', 'Imaging Integration',
        'Dose Rate', 'Multi-leaf Collimator', 'Safety Systems', 'QA Requirements'
      ],
      'Critical Care': [
        'Flow Rates', 'Monitoring Parameters', 'Portability', 'Battery Life',
        'Alarm Systems', 'Connectivity', 'Sterilization', 'Emergency Features'
      ],
      'Laboratory Equipment': [
        'Resolution', 'Throughput', 'Sample Types', 'Digital Formats',
        'Storage Integration', 'Analysis Software', 'Automation Level', 'Maintenance'
      ],
      'Default': [
        'Price Range', 'Brand', 'Warranty Period', 'Availability',
        'Power Requirements', 'Size/Dimensions', 'Weight', 'Certifications'
      ]
    };

    return filterOptions[category] || filterOptions['Default'];
  }
}
