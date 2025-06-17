
import { supabase } from '@/integrations/supabase/client';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
      
      // Extract text from the file using appropriate method
      const extractedText = await this.extractTextFromFile(file);
      console.log('Extracted text length:', extractedText.length);
      console.log('Extracted text preview:', extractedText.substring(0, 500));
      
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
    console.log('Extracting text from PDF using PDF.js:', file.name);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      console.log('PDF loaded, pages:', pdf.numPages);
      
      let fullText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
      }
      
      console.log('Extracted PDF text length:', fullText.length);
      
      if (fullText.trim().length < 50) {
        console.warn('PDF text extraction yielded minimal content, might be image-based PDF');
        throw new Error('PDF appears to contain mostly images - consider using OCR');
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      throw new Error('Failed to extract text from PDF: ' + error.message);
    }
  }

  private static async extractTextFromImage(file: File): Promise<string> {
    console.log('Extracting text from image using Tesseract.js:', file.name);
    
    try {
      // Create Tesseract worker
      const worker = await createWorker('eng');
      
      // Process the image
      const { data: { text } } = await worker.recognize(file);
      
      // Clean up worker
      await worker.terminate();
      
      console.log('OCR extracted text length:', text.length);
      console.log('OCR text preview:', text.substring(0, 300));
      
      if (text.trim().length < 20) {
        throw new Error('OCR could not extract sufficient text from image');
      }
      
      return text;
    } catch (error) {
      console.error('Image OCR extraction failed:', error);
      throw new Error('Failed to extract text from image: ' + error.message);
    }
  }

  private static parseSpecifications(text: string): SpecificationData {
    const lines = text.split('\n').filter(line => line.trim());
    const specifications: Record<string, string> = {};
    let productType = 'Medical Equipment';
    let category = 'Healthcare Equipment';

    console.log('Parsing specifications from', lines.length, 'lines of text');

    // Enhanced parsing logic with more patterns
    lines.forEach(line => {
      // Look for key-value pairs with various separators
      const patterns = [
        /^([^:]+):\s*(.+)$/,           // Colon separator
        /^([^=]+)=\s*(.+)$/,          // Equals separator
        /^([^\t]+)\t+(.+)$/,          // Tab separator
        /^([^-]+)-\s*(.+)$/,          // Dash separator
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const key = match[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          const value = match[2].trim();
          
          if (key && value && value.length > 0 && key.length > 1) {
            specifications[key] = value;
            
            // Determine product type and category from keywords
            const lowerValue = value.toLowerCase();
            const lowerKey = key.toLowerCase();
            
            if (lowerKey.includes('type') || lowerKey.includes('product') || lowerKey.includes('model')) {
              productType = value;
            }
            
            // Enhanced category detection
            if (lowerValue.includes('mri') || lowerValue.includes('magnetic resonance') || 
                lowerValue.includes('ct scan') || lowerValue.includes('imaging')) {
              category = 'Medical Imaging';
              productType = 'MRI/CT Scanner';
            } else if (lowerValue.includes('robot') || lowerValue.includes('surgical') || 
                       lowerValue.includes('minimally invasive')) {
              category = 'Surgical Equipment';
              productType = 'Surgical Robot';
            } else if (lowerValue.includes('linear') || lowerValue.includes('radiation') || 
                       lowerValue.includes('accelerator') || lowerValue.includes('therapy')) {
              category = 'Radiation Therapy';
              productType = 'Linear Accelerator';
            } else if (lowerValue.includes('ecmo') || lowerValue.includes('life support') || 
                       lowerValue.includes('critical care')) {
              category = 'Critical Care';
              productType = 'ECMO Machine';
            } else if (lowerValue.includes('pathology') || lowerValue.includes('scanner') || 
                       lowerValue.includes('laboratory') || lowerValue.includes('microscopy')) {
              category = 'Laboratory Equipment';
              productType = 'Digital Pathology Equipment';
            }
          }
          break;
        }
      }
    });

    console.log('Parsed specifications:', Object.keys(specifications).length, 'items');
    console.log('Product type:', productType, 'Category:', category);

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

    return matches.length > 0 ? matches : this.productDatabase.slice(0, 3);
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
