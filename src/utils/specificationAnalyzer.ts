
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
      name: 'Advanced Water Filtration System WF-2000',
      brand: 'AquaPure',
      price: 2500,
      category: 'Filtration System',
      specs: {
        flowRate: '10 LPM',
        micronRating: '0.1 µm',
        filterLife: '6 months',
        material: 'Stainless Steel'
      }
    },
    {
      id: '2',
      name: 'Industrial Air Filter Pro-3000',
      brand: 'CleanAir Tech',
      price: 4500,
      category: 'Air Filtration',
      specs: {
        flowRate: '500 CFM',
        micronRating: '0.3 µm',
        filterLife: '12 months',
        material: 'Aluminum'
      }
    },
    {
      id: '3',
      name: 'Medical Grade HEPA Filter MH-1500',
      brand: 'MedFilter',
      price: 3200,
      category: 'Medical Filtration',
      specs: {
        efficiency: '99.97%',
        micronRating: '0.3 µm',
        airflow: '300 CFM',
        certifications: 'FDA Approved'
      }
    }
  ];

  static async analyzeUploadedFile(file: File): Promise<SpecificationData> {
    console.log('Analyzing uploaded specification file:', file.name);
    
    try {
      // For demo purposes, we'll simulate text extraction
      // In a real implementation, you'd use OCR or PDF parsing libraries
      const simulatedExtractedText = await this.simulateTextExtraction(file);
      
      return this.parseSpecifications(simulatedExtractedText);
    } catch (error) {
      console.error('Error analyzing specification file:', error);
      throw new Error('Failed to analyze specification file');
    }
  }

  private static async simulateTextExtraction(file: File): Promise<string> {
    // Simulate text extraction based on file type
    if (file.type === 'application/pdf') {
      return this.samplePDFText;
    } else if (file.type.startsWith('image/')) {
      return this.sampleImageText;
    }
    return '';
  }

  private static samplePDFText = `
    Product Name: Advanced Filtration System
    Type: Water Filtration System
    Flow Rate: 10 LPM
    Micron Rating: 0.1 µm
    Removal Efficiency: 99.9%
    Material: Stainless Steel
    Application: Medical/Industrial
    Filter Life: 6 months
    Certifications: NSF/ANSI, FDA Approved
  `;

  private static sampleImageText = `
    Filtration System Specifications
    Model: WF-2000
    Flow Rate: 5 GPM
    Pressure Range: 10-100 psi
    Temperature: 4°C - 40°C
    Filter Media: Activated Carbon
    Housing: ABS Plastic
  `;

  private static parseSpecifications(text: string): SpecificationData {
    const lines = text.split('\n').filter(line => line.trim());
    const specifications: Record<string, string> = {};
    let productType = 'Unknown';
    let category = 'General';

    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim().toLowerCase();
        const value = line.substring(colonIndex + 1).trim();
        
        specifications[key] = value;
        
        // Determine product type and category
        if (key.includes('type') || key.includes('product name')) {
          productType = value;
          if (value.toLowerCase().includes('water')) category = 'Laboratory Equipment';
          else if (value.toLowerCase().includes('air')) category = 'Hospital Equipment';
          else if (value.toLowerCase().includes('medical')) category = 'Medical Consumable Supplies';
        }
      }
    });

    // Find matching products
    const matchedProducts = this.findSimilarProducts(specifications, category);

    return {
      productType,
      category,
      specifications,
      matchedProducts
    };
  }

  private static findSimilarProducts(specs: Record<string, string>, category: string) {
    return this.productDatabase.filter(product => {
      // Simple matching logic - in real implementation, this would be more sophisticated
      const categoryMatch = product.category.toLowerCase().includes(category.toLowerCase().split(' ')[0]);
      const specMatch = Object.keys(specs).some(specKey => 
        Object.keys(product.specs).some(productSpecKey => 
          productSpecKey.toLowerCase().includes(specKey) || 
          specKey.includes(productSpecKey.toLowerCase())
        )
      );
      
      return categoryMatch || specMatch;
    });
  }

  static getFilterOptions(category: string): string[] {
    const filterOptions: Record<string, string[]> = {
      'Laboratory Equipment': [
        'Flow Rate (LPM)', 'Micron Rating', 'Material Type', 'Pressure Range', 
        'Temperature Range', 'Filter Life', 'Certifications', 'Power Requirements'
      ],
      'Hospital Equipment': [
        'Air Flow Rate (CFM)', 'HEPA Efficiency', 'Noise Level', 'Power Consumption',
        'Filter Size', 'Operating Temperature', 'Humidity Tolerance', 'Safety Standards'
      ],
      'Medical Consumable Supplies': [
        'Sterility Level', 'Material Composition', 'Size Range', 'Packaging Type',
        'Shelf Life', 'FDA Approval', 'Latex-Free', 'Disposable/Reusable'
      ],
      'Default': [
        'Price Range', 'Brand', 'Warranty Period', 'Availability',
        'Power Requirements', 'Size/Dimensions', 'Weight', 'Color Options'
      ]
    };

    return filterOptions[category] || filterOptions['Default'];
  }
}
