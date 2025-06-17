
import React, { useState } from 'react';
import { Upload, FileText, Image, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SpecificationAnalyzer } from '@/utils/specificationAnalyzer';
import SpecificationFilter from '@/components/SpecificationFilter';

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [specificationData, setSpecificationData] = useState<any>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.type)) {
      setUploadedFile(file);
      setIsAnalyzing(true);
      setSpecificationData(null); // Clear previous data
      
      try {
        console.log('Starting specification analysis for file:', file.name);
        const analysisResult = await SpecificationAnalyzer.analyzeUploadedFile(file);
        
        // Validate that we have meaningful specifications
        const hasValidSpecs = analysisResult.specifications && 
          Object.keys(analysisResult.specifications).length > 0;
        
        const hasProductType = analysisResult.productType && 
          analysisResult.productType !== 'Unknown' &&
          analysisResult.productType !== 'Medical Equipment';

        if (!hasValidSpecs) {
          throw new Error('No technical specifications found in the document');
        }

        // Set valid specification data
        setSpecificationData({
          ...analysisResult,
          isValid: true
        });
        
        toast({
          title: "Analysis successful!",
          description: `Found ${Object.keys(analysisResult.specifications).length} specifications for ${analysisResult.productType}`,
        });

        console.log('Analysis completed successfully:', analysisResult);
        
      } catch (error) {
        console.error('Analysis failed:', error);
        
        // Set fallback data that shows filters but indicates analysis failed
        setSpecificationData({
          productType: 'Technical analysis incomplete',
          category: 'General Medical Equipment',
          specifications: {},
          matchedProducts: [],
          isValid: false,
          analysisError: true
        });
        
        toast({
          title: "Analysis incomplete",
          description: "Could not extract technical specifications. Please use the filters below to find equipment.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (JPG, PNG) containing technical specifications.",
        variant: "destructive",
      });
    }
  };

  const handleFilterApply = (filters: any) => {
    console.log('Applied filters:', filters);
    
    // Count active filters for better user feedback
    const activeFilters = Object.values(filters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value && value !== ''
    ).length;
    
    toast({
      title: "Searching equipment database",
      description: `Finding equipment with ${activeFilters} filter criteria applied`,
    });
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setSpecificationData(null);
    setIsAnalyzing(false);
  };

  const getUploadStatusIcon = () => {
    if (isAnalyzing) {
      return <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" />;
    }
    
    if (uploadedFile) {
      if (specificationData?.isValid === false) {
        return <AlertCircle className="h-8 w-8 text-yellow-600" />;
      }
      
      if (specificationData?.isValid === true) {
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      }
      
      return uploadedFile.type === 'application/pdf' ? (
        <FileText className="h-8 w-8 text-blue-600" />
      ) : (
        <Image className="h-8 w-8 text-blue-600" />
      );
    }
    
    return <Upload className="mx-auto h-8 w-8 text-muted-foreground" />;
  };

  const getUploadStatusText = () => {
    if (isAnalyzing) {
      return {
        title: "Analyzing technical specifications...",
        subtitle: "Extracting equipment details and saving to database"
      };
    }
    
    if (uploadedFile) {
      if (specificationData?.analysisError) {
        return {
          title: uploadedFile.name,
          subtitle: "Analysis incomplete - use filters below to search equipment"
        };
      }
      
      if (specificationData?.isValid === true) {
        const specCount = Object.keys(specificationData.specifications || {}).length;
        return {
          title: uploadedFile.name,
          subtitle: `Successfully extracted ${specCount} technical specifications`
        };
      }
      
      return {
        title: uploadedFile.name,
        subtitle: "File uploaded - processing specifications"
      };
    }
    
    return {
      title: "Upload technical specifications (PDF, JPG, PNG)",
      subtitle: "Include equipment datasheets, manuals, or specification documents"
    };
  };

  const statusText = getUploadStatusText();
  const statusColor = specificationData?.analysisError ? 'text-yellow-700' : 
                     specificationData?.isValid === true ? 'text-green-700' :
                     uploadedFile ? 'text-blue-700' : 'text-foreground';
  const subtitleColor = specificationData?.analysisError ? 'text-yellow-600' : 
                       specificationData?.isValid === true ? 'text-green-600' :
                       uploadedFile ? 'text-blue-600' : 'text-muted-foreground';

  return (
    <div className="w-full space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : specificationData?.analysisError
            ? 'border-yellow-300 bg-yellow-50'
            : specificationData?.isValid === true
            ? 'bg-green-50 border-green-300'
            : uploadedFile 
            ? 'bg-blue-50 border-blue-300' 
            : 'border-muted-foreground/25 hover:border-primary/50 bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
        />
        
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            {getUploadStatusIcon()}
          </div>
          <p className={`text-sm font-medium ${statusColor}`}>
            {statusText.title}
          </p>
          <p className={`text-xs ${subtitleColor}`}>
            {statusText.subtitle}
          </p>
        </div>
      </div>
      
      {uploadedFile && !isAnalyzing && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={resetUpload}
        >
          Upload Different File
        </Button>
      )}

      {/* Show filters even if analysis failed, but with different messaging */}
      {specificationData && (
        <SpecificationFilter 
          specData={specificationData}
          onFilterApply={handleFilterApply}
        />
      )}
    </div>
  );
};

export default FileUpload;
