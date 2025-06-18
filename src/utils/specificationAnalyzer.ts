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
  confidenceScores: Record<string, number>;
  extractionMetadata: {
    textLength: number;
    processingTime: number;
    extractionMethod: 'pdf' | 'ocr';
    specificationCount: number;
  };
}

interface MRISpecification {
  key: string;
  value: string | number | boolean;
  confidence: number;
  patterns: RegExp[];
  keywords: string[];
}

export class SpecificationAnalyzer {
  
  // Enhanced MRI product database with more realistic specifications
  private static productDatabase = [
    {
      id: '1',
      name: 'Siemens MAGNETOM Vida 3T MRI Scanner',
      brand: 'Siemens Healthineers',
      price: 2500000,
      category: 'MRI Scanners',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        magneticFieldStrength: '3.0T',
        boreSize: '70 cm',
        gradientStrength: '45 mT/m',
        slewRate: '200 T/m/s',
        cryogenFree: false,
        patientTableWeightCapacity: '250 kg',
        powerRequirement: '45 kVA',
        imagingCapabilities: ['Neuro', 'Cardiac', 'Musculoskeletal']
      }
    },
    {
      id: '2',
      name: 'GE SIGNA Premier 3T MRI',
      brand: 'GE Healthcare',
      price: 2800000,
      category: 'MRI Scanners',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        magneticFieldStrength: '3.0T',
        boreSize: '70 cm',
        gradientStrength: '50 mT/m',
        slewRate: '200 T/m/s',
        cryogenFree: false,
        patientTableWeightCapacity: '250 kg',
        powerRequirement: '50 kVA',
        imagingCapabilities: ['Neuro', 'Whole Body', 'Cardiac']
      }
    },
    {
      id: '3',
      name: 'Philips Ingenia 1.5T MRI',
      brand: 'Philips',
      price: 1800000,
      category: 'MRI Scanners',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        magneticFieldStrength: '1.5T',
        boreSize: '70 cm',
        gradientStrength: '33 mT/m',
        slewRate: '100 T/m/s',
        cryogenFree: false,
        patientTableWeightCapacity: '250 kg',
        powerRequirement: '35 kVA',
        imagingCapabilities: ['General Purpose', 'Neuro', 'MSK']
      }
    },
    {
      id: '4',
      name: 'Canon Vantage Galan 3T MRI',
      brand: 'Canon Medical',
      price: 2300000,
      category: 'MRI Scanners',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        magneticFieldStrength: '3.0T',
        boreSize: '71 cm',
        gradientStrength: '100 mT/m',
        slewRate: '200 T/m/s',
        cryogenFree: true,
        patientTableWeightCapacity: '250 kg',
        powerRequirement: '40 kVA',
        imagingCapabilities: ['Neuro', 'Cardiac', 'Whole Body']
      }
    },
    {
      id: '5',
      name: 'Hitachi Echelon Smart Plus 1.5T',
      brand: 'Hitachi',
      price: 1600000,
      category: 'MRI Scanners',
      image: '/placeholder.svg',
      currency: '$',
      specs: {
        magneticFieldStrength: '1.5T',
        boreSize: '71 cm',
        gradientStrength: '30 mT/m',
        slewRate: '120 T/m/s',
        cryogenFree: true,
        patientTableWeightCapacity: '250 kg',
        powerRequirement: '28 kVA',
        imagingCapabilities: ['General Purpose', 'Neuro']
      }
    }
  ];

  // Enhanced MRI specification patterns for intelligent extraction
  private static mriSpecificationPatterns: Record<string, MRISpecification> = {
    magneticFieldStrength: {
      key: 'magneticFieldStrength',
      value: '',
      confidence: 0,
      patterns: [
        /(\d+\.?\d*)\s*T(?:esla)?(?:\s|$)/gi,
        /(?:magnetic\s+field|field\s+strength|magnet\s+strength)[\s\w]*?(\d+\.?\d*)\s*T/gi,
        /(\d+\.?\d*)\s*Tesla/gi
      ],
      keywords: ['tesla', 'field strength', 'magnetic field', 'magnet strength', '1.5T', '3.0T', '7T']
    },
    boreSize: {
      key: 'boreSize',
      value: '',
      confidence: 0,
      patterns: [
        /(?:bore|patient\s+opening|aperture)[\s\w]*?(\d+)\s*cm/gi,
        /(\d+)\s*cm\s+bore/gi,
        /bore\s+size[\s:]*(\d+)\s*cm/gi
      ],
      keywords: ['bore', 'bore size', 'patient opening', 'aperture', 'cm']
    },
    gradientStrength: {
      key: 'gradientStrength',
      value: '',
      confidence: 0,
      patterns: [
        /(?:gradient|gradient\s+strength)[\s\w]*?(\d+)\s*mT\/m/gi,
        /(\d+)\s*mT\/m/gi,
        /gradient[\s:]*(\d+)\s*mT\/m/gi
      ],
      keywords: ['gradient', 'gradient strength', 'mT/m']
    },
    slewRate: {
      key: 'slewRate',
      value: '',
      confidence: 0,
      patterns: [
        /(?:slew\s+rate)[\s\w]*?(\d+)\s*T\/m\/s/gi,
        /(\d+)\s*T\/m\/s/gi,
        /slew[\s:]*(\d+)\s*T\/m\/s/gi
      ],
      keywords: ['slew rate', 'T/m/s']
    },
    cryogenFree: {
      key: 'cryogenFree',
      value: false,
      confidence: 0,
      patterns: [
        /cryogen[\s-]*free/gi,
        /zero\s+boil[\s-]*off/gi,
        /ZBO/gi,
        /helium[\s-]*free/gi
      ],
      keywords: ['cryogen-free', 'cryogen free', 'zero boil-off', 'ZBO', 'helium-free']
    },
    patientTableWeightCapacity: {
      key: 'patientTableWeightCapacity',
      value: '',
      confidence: 0,
      patterns: [
        /(?:patient\s+weight|table\s+capacity|weight\s+capacity)[\s\w]*?(\d+)\s*kg/gi,
        /(\d+)\s*kg\s+(?:patient|table|capacity)/gi,
        /maximum\s+patient\s+weight[\s:]*(\d+)\s*kg/gi
      ],
      keywords: ['patient weight', 'table capacity', 'weight capacity', 'kg', 'maximum weight']
    },
    powerRequirement: {
      key: 'powerRequirement',
      value: '',
      confidence: 0,
      patterns: [
        /(?:power\s+requirement|power\s+consumption)[\s\w]*?(\d+)\s*kVA/gi,
        /(\d+)\s*kVA/gi,
        /power[\s:]*(\d+)\s*kVA/gi,
        /(\d+)\s*kW/gi
      ],
      keywords: ['power', 'power requirement', 'power consumption', 'kVA', 'kW']
    },
    imagingCapabilities: {
      key: 'imagingCapabilities',
      value: '',
      confidence: 0,
      patterns: [
        /(?:neuro|neurological|brain)/gi,
        /(?:cardiac|heart|cardiovascular)/gi,
        /(?:musculoskeletal|MSK|orthopedic)/gi,
        /(?:whole\s+body|body)/gi,
        /(?:pediatric|children)/gi,
        /(?:functional|fMRI)/gi
      ],
      keywords: ['neuro', 'cardiac', 'musculoskeletal', 'MSK', 'whole body', 'pediatric', 'functional', 'fMRI']
    }
  };

  static async analyzeUploadedFile(file: File): Promise<SpecificationData> {
    const startTime = Date.now();
    console.log('Starting intelligent MRI specification analysis for:', file.name);
    
    try {
      // Save the uploaded document to database
      await this.saveUploadedDocument(file);
      
      // Extract text from the file using appropriate method
      const extractionResult = await this.extractTextFromFile(file);
      console.log('Text extraction completed. Length:', extractionResult.text.length);
      
      if (!extractionResult.text || extractionResult.text.trim().length < 10) {
        throw new Error('No readable text found in the document');
      }
      
      // Parse MRI specifications using enhanced NLP
      const result = this.parseIntelligentMRISpecifications(extractionResult.text);
      
      // Add extraction metadata
      result.extractionMetadata = {
        textLength: extractionResult.text.length,
        processingTime: Date.now() - startTime,
        extractionMethod: extractionResult.method,
        specificationCount: Object.keys(result.specifications).length
      };
      
      // Update the database with extracted specifications
      await this.updateDocumentSpecifications(file.name, result.specifications, result.confidenceScores);
      
      console.log('Intelligent analysis completed successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in intelligent specification analysis:', error);
      throw new Error('Failed to analyze MRI specifications: ' + error.message);
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

  private static async updateDocumentSpecifications(
    filename: string, 
    specifications: Record<string, string>,
    confidenceScores: Record<string, number>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('uploaded_documents')
        .update({
          extracted_specifications: {
            ...specifications,
            _confidence_scores: confidenceScores
          },
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

  private static async extractTextFromFile(file: File): Promise<{text: string, method: 'pdf' | 'ocr'}> {
    if (file.type === 'application/pdf') {
      const text = await this.extractTextFromPDF(file);
      return { text, method: 'pdf' };
    } else if (file.type.startsWith('image/')) {
      const text = await this.extractTextFromImage(file);
      return { text, method: 'ocr' };
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
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) { // Limit to first 10 pages for performance
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
      }
      
      console.log('Extracted PDF text length:', fullText.length);
      
      if (fullText.trim().length < 50) {
        console.warn('PDF text extraction yielded minimal content, might be image-based PDF');
        throw new Error('PDF appears to contain mostly images - consider using higher quality OCR');
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      throw new Error('Failed to extract text from PDF: ' + error.message);
    }
  }

  private static async extractTextFromImage(file: File): Promise<string> {
    console.log('Extracting text from image using Tesseract.js OCR:', file.name);
    
    try {
      // Create Tesseract worker with enhanced settings for technical documents
      const worker = await createWorker('eng', 1, {
        logger: m => console.log('OCR Progress:', m)
      });
      
      // Configure for better technical text recognition
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,()-/:= \n\t',
        tessedit_pageseg_mode: 1, // Use number instead of string
        preserve_interword_spaces: '1'
      });
      
      // Process the image
      const { data: { text, confidence } } = await worker.recognize(file);
      
      console.log('OCR Confidence:', confidence);
      console.log('OCR extracted text length:', text.length);
      console.log('OCR text preview:', text.substring(0, 500));
      
      // Clean up worker
      await worker.terminate();
      
      if (text.trim().length < 20) {
        throw new Error('OCR could not extract sufficient text from image - image may be too blurry or low quality');
      }
      
      if (confidence < 30) {
        console.warn('Low OCR confidence detected:', confidence);
      }
      
      return text;
    } catch (error) {
      console.error('Image OCR extraction failed:', error);
      throw new Error('Failed to extract text from image: ' + error.message);
    }
  }

  private static parseIntelligentMRISpecifications(text: string): SpecificationData {
    const specifications: Record<string, string> = {};
    const confidenceScores: Record<string, number> = {};
    let productType = 'MRI Scanner';
    const category = 'MRI Equipment';

    console.log('Starting intelligent MRI specification parsing...');

    // Clean and prepare text for analysis
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const lines = cleanText.split(/[.\n\r]+/).filter(line => line.trim().length > 3);

    // Process each MRI specification pattern
    Object.values(this.mriSpecificationPatterns).forEach(specPattern => {
      const results = this.extractSpecificationWithConfidence(cleanText, specPattern);
      
      if (results.value !== null && results.confidence > 0.3) { // Only include specs with reasonable confidence
        specifications[specPattern.key] = String(results.value);
        confidenceScores[specPattern.key] = results.confidence;
        
        console.log(`Found ${specPattern.key}: ${results.value} (confidence: ${results.confidence.toFixed(2)})`);
      }
    });

    // Enhanced product type detection
    if (text.toLowerCase().includes('mri') || text.toLowerCase().includes('magnetic resonance')) {
      productType = 'MRI Scanner';
      
      // More specific MRI type detection
      if (text.toLowerCase().includes('research')) {
        productType = 'Research MRI Scanner';
      } else if (text.toLowerCase().includes('clinical')) {
        productType = 'Clinical MRI Scanner';
      } else if (text.toLowerCase().includes('portable') || text.toLowerCase().includes('mobile')) {
        productType = 'Mobile MRI Scanner';
      }
    }

    console.log('Parsed MRI specifications:', Object.keys(specifications).length, 'items');
    console.log('Average confidence:', Object.values(confidenceScores).reduce((a, b) => a + b, 0) / Object.values(confidenceScores).length);

    // Ensure we have meaningful specifications
    if (Object.keys(specifications).length === 0) {
      throw new Error('No MRI specifications found in the document - please ensure the document contains technical MRI specifications');
    }

    // Find matching products based on specifications
    const matchedProducts = this.findSimilarMRIProducts(specifications);

    // Add required extractionMetadata with default values
    return {
      productType,
      category,
      specifications,
      matchedProducts,
      confidenceScores,
      extractionMetadata: {
        textLength: text.length,
        processingTime: 0, // Will be set by caller
        extractionMethod: 'pdf', // Will be set by caller
        specificationCount: Object.keys(specifications).length
      }
    };
  }

  private static extractSpecificationWithConfidence(text: string, specPattern: MRISpecification): {value: any, confidence: number} {
    let bestMatch: any = null;
    let highestConfidence = 0;

    // Handle boolean specifications (like cryogen-free)
    if (specPattern.key === 'cryogenFree') {
      const keywordMatches = specPattern.keywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      if (keywordMatches > 0) {
        return { value: true, confidence: Math.min(keywordMatches * 0.4, 0.95) };
      }
      return { value: false, confidence: 0.1 };
    }

    // Handle array specifications (like imaging capabilities)
    if (specPattern.key === 'imagingCapabilities') {
      const capabilities: string[] = [];
      const capabilityMap = {
        'neuro': ['neuro', 'neurological', 'brain', 'head'],
        'cardiac': ['cardiac', 'heart', 'cardiovascular'],
        'musculoskeletal': ['musculoskeletal', 'msk', 'orthopedic', 'bone', 'joint'],
        'whole body': ['whole body', 'body', 'torso'],
        'pediatric': ['pediatric', 'children', 'child'],
        'functional': ['functional', 'fmri', 'bold']
      };

      Object.entries(capabilityMap).forEach(([capability, keywords]) => {
        const matches = keywords.filter(keyword => 
          text.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        
        if (matches > 0) {
          capabilities.push(capability);
          highestConfidence = Math.max(highestConfidence, matches * 0.3);
        }
      });

      if (capabilities.length > 0) {
        return { value: capabilities.join(', '), confidence: Math.min(highestConfidence, 0.9) };
      }
      return { value: null, confidence: 0 };
    }

    // Handle numeric and string specifications
    specPattern.patterns.forEach(pattern => {
      const matches = Array.from(text.matchAll(pattern));
      
      matches.forEach(match => {
        if (match[1]) {
          const value = match[1].trim();
          
          // Calculate confidence based on context and pattern specificity
          let confidence = 0.6; // Base confidence for pattern match
          
          // Boost confidence if surrounded by relevant keywords
          const contextWindow = text.substring(
            Math.max(0, match.index! - 50), 
            Math.min(text.length, match.index! + match[0].length + 50)
          ).toLowerCase();
          
          const keywordMatches = specPattern.keywords.filter(keyword => 
            contextWindow.includes(keyword.toLowerCase())
          ).length;
          
          confidence += keywordMatches * 0.15;
          confidence = Math.min(confidence, 0.95); // Cap at 95%
          
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestMatch = value;
          }
        }
      });
    });

    return { value: bestMatch, confidence: highestConfidence };
  }

  private static findSimilarMRIProducts(specs: Record<string, string>) {
    const matches = this.productDatabase.filter(product => {
      let matchScore = 0;
      
      // Match by magnetic field strength
      if (specs.magneticFieldStrength && product.specs.magneticFieldStrength) {
        if (product.specs.magneticFieldStrength.includes(specs.magneticFieldStrength)) {
          matchScore += 3;
        }
      }
      
      // Match by bore size (within 5cm tolerance)
      if (specs.boreSize && product.specs.boreSize) {
        const specBore = parseInt(specs.boreSize);
        const productBore = parseInt(product.specs.boreSize);
        if (!isNaN(specBore) && !isNaN(productBore) && Math.abs(specBore - productBore) <= 5) {
          matchScore += 2;
        }
      }
      
      // Match by cryogen-free status
      if (specs.cryogenFree !== undefined && product.specs.cryogenFree !== undefined) {
        if ((specs.cryogenFree === 'true') === product.specs.cryogenFree) {
          matchScore += 2;
        }
      }
      
      // Match by imaging capabilities
      if (specs.imagingCapabilities && product.specs.imagingCapabilities) {
        const specCapabilities = specs.imagingCapabilities.toLowerCase();
        const productCapabilities = product.specs.imagingCapabilities.map(cap => cap.toLowerCase());
        
        productCapabilities.forEach(cap => {
          if (specCapabilities.includes(cap)) {
            matchScore += 1;
          }
        });
      }
      
      return matchScore >= 2; // Return products with reasonable match
    });

    // Sort by match quality and return top 3
    return matches.length > 0 ? matches.slice(0, 3) : this.productDatabase.slice(0, 3);
  }

  static getFilterOptions(category: string): string[] {
    const filterOptions: Record<string, string[]> = {
      'MRI Equipment': [
        'Magnetic Field Strength (Tesla)', 'Bore Size (cm)', 'Cryogen-Free Technology', 
        'Gradient Strength (mT/m)', 'Slew Rate (T/m/s)', 'Patient Weight Capacity (kg)',
        'Power Requirements (kVA)', 'Imaging Capabilities', 'RF Channels', 'Helium Consumption'
      ],
      'Default': [
        'Price Range', 'Brand', 'Warranty Period', 'Availability',
        'Power Requirements', 'Size/Dimensions', 'Weight', 'Certifications'
      ]
    };

    return filterOptions[category] || filterOptions['Default'];
  }
}
