
import React, { useState } from 'react';
import { Upload, FileText, Image, Loader2, AlertCircle } from 'lucide-react';
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
      
      try {
        console.log('Starting specification analysis for file:', file.name);
        const analysisResult = await SpecificationAnalyzer.analyzeUploadedFile(file);
        
        // Check if valid specifications were found
        const hasValidSpecifications = analysisResult && 
          analysisResult.specifications && 
          Object.keys(analysisResult.specifications).length > 0 &&
          analysisResult.productType && 
          analysisResult.productType !== 'Unknown';

        if (!hasValidSpecifications) {
          // Set invalid specification data
          setSpecificationData({
            productType: 'No specifications found',
            category: 'Unknown',
            specifications: {},
            matchedProducts: [],
            isValid: false
          });
          
          toast({
            title: "No technical specifications found",
            description: "Please upload a document with clear technical specifications, model numbers, or equipment details.",
            variant: "destructive",
          });
        } else {
          setSpecificationData({
            ...analysisResult,
            isValid: true
          });
          
          toast({
            title: "File analyzed successfully",
            description: `Found specifications for ${analysisResult.productType}`,
          });
        }
      } catch (error) {
        console.error('Analysis failed:', error);
        
        // Set error state
        setSpecificationData({
          productType: 'Analysis failed',
          category: 'Error',
          specifications: {},
          matchedProducts: [],
          isValid: false
        });
        
        toast({
          title: "Analysis failed",
          description: "Could not analyze the document. Please ensure it contains readable technical specifications and try again.",
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
      title: "Filters applied",
      description: `Searching with ${activeFilters} filter criteria`,
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
        return <AlertCircle className="h-8 w-8 text-red-600" />;
      }
      
      return uploadedFile.type === 'application/pdf' ? (
        <FileText className="h-8 w-8 text-green-600" />
      ) : (
        <Image className="h-8 w-8 text-green-600" />
      );
    }
    
    return <Upload className="mx-auto h-8 w-8 text-muted-foreground" />;
  };

  const getUploadStatusText = () => {
    if (isAnalyzing) {
      return {
        title: "Analyzing specifications...",
        subtitle: "Extracting technical details from your document"
      };
    }
    
    if (uploadedFile) {
      if (specificationData?.isValid === false) {
        return {
          title: uploadedFile.name,
          subtitle: "No valid specifications found - please upload a different document"
        };
      }
      
      return {
        title: uploadedFile.name,
        subtitle: "File uploaded and analyzed successfully"
      };
    }
    
    return {
      title: "Drop technical specifications here or click to upload",
      subtitle: "PDF, JPG, PNG up to 10MB"
    };
  };

  const statusText = getUploadStatusText();
  const statusColor = specificationData?.isValid === false ? 'text-red-700' : 
                     uploadedFile ? 'text-green-700' : 'text-foreground';
  const subtitleColor = specificationData?.isValid === false ? 'text-red-600' : 
                       uploadedFile ? 'text-green-600' : 'text-muted-foreground';

  return (
    <div className="w-full space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : specificationData?.isValid === false
            ? 'border-red-300 bg-red-50'
            : uploadedFile 
            ? 'bg-green-50 border-green-300' 
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
