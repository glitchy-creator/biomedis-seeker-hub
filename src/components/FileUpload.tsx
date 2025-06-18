
import React, { useState } from 'react';
import { Upload, FileText, Image, Loader2, AlertCircle, CheckCircle, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SpecificationAnalyzer } from '@/utils/specificationAnalyzer';
import SpecificationFilter from '@/components/SpecificationFilter';

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [specificationData, setSpecificationData] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
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
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (JPG, PNG) containing MRI technical specifications.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsAnalyzing(true);
    setSpecificationData(null);
    setAnalysisProgress('Initializing...');
    
    try {
      console.log('Starting intelligent MRI specification analysis for file:', file.name);
      
      toast({
        title: "🧠 AI Processing Started",
        description: `Extracting MRI specifications from ${file.name}`,
      });
      
      // Update progress for user feedback
      setAnalysisProgress(file.type === 'application/pdf' ? 'Extracting text from PDF...' : 'Running OCR on image...');
      
      const analysisResult = await SpecificationAnalyzer.analyzeUploadedFile(file);
      
      // Validate that we have meaningful MRI specifications
      const hasValidSpecs = analysisResult.specifications && 
        Object.keys(analysisResult.specifications).length > 0;
      
      if (!hasValidSpecs) {
        throw new Error('No MRI technical specifications found in the document');
      }

      // Calculate average confidence
      const confidenceScores = Object.values(analysisResult.confidenceScores || {});
      const avgConfidence = confidenceScores.length > 0 
        ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length 
        : 0;

      // Set valid specification data
      setSpecificationData({
        ...analysisResult,
        isValid: true,
        averageConfidence: avgConfidence
      });
      
      const specCount = Object.keys(analysisResult.specifications).length;
      const processingTime = analysisResult.extractionMetadata?.processingTime || 0;
      
      toast({
        title: "✅ AI Analysis Complete!",
        description: `Extracted ${specCount} MRI specifications in ${(processingTime/1000).toFixed(1)}s with ${(avgConfidence*100).toFixed(0)}% avg confidence`,
      });

      console.log('Intelligent analysis completed successfully:', analysisResult);
      
    } catch (error) {
      console.error('Intelligent analysis failed:', error);
      
      // Set fallback data that shows filters but indicates analysis failed
      setSpecificationData({
        productType: 'MRI specification analysis incomplete',
        category: 'MRI Equipment',
        specifications: {},
        matchedProducts: [],
        isValid: false,
        analysisError: true,
        errorMessage: error.message
      });
      
      toast({
        title: "⚠️ Specification extraction incomplete",
        description: "Could not extract clear MRI specifications. Use the advanced filters below to search our MRI database.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const handleFilterApply = (filters: any) => {
    console.log('Applied MRI filters:', filters);
    
    // Count active filters for better user feedback
    const activeFilters = Object.values(filters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value && value !== ''
    ).length;
    
    toast({
      title: "🔍 Searching MRI database",
      description: `Finding MRI equipment with ${activeFilters} filter criteria applied`,
    });
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setSpecificationData(null);
    setIsAnalyzing(false);
    setAnalysisProgress('');
  };

  const getUploadStatusIcon = () => {
    if (isAnalyzing) {
      return <Brain className="mx-auto h-8 w-8 text-primary animate-pulse" />;
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
        title: `🧠 AI Processing: ${analysisProgress}`,
        subtitle: uploadedFile?.type === 'application/pdf' 
          ? "Extracting text and analyzing MRI specifications using NLP"
          : "Running OCR and analyzing MRI specifications using pattern recognition"
      };
    }
    
    if (uploadedFile) {
      if (specificationData?.analysisError) {
        return {
          title: `⚠️ ${uploadedFile.name}`,
          subtitle: `AI analysis incomplete: ${specificationData.errorMessage || 'Use advanced MRI filters below'}`
        };
      }
      
      if (specificationData?.isValid === true) {
        const specCount = Object.keys(specificationData.specifications || {}).length;
        const confidence = specificationData.averageConfidence || 0;
        return {
          title: `✅ ${uploadedFile.name}`,
          subtitle: `Successfully extracted ${specCount} MRI specifications with ${(confidence*100).toFixed(0)}% avg confidence`
        };
      }
      
      return {
        title: uploadedFile.name,
        subtitle: "File uploaded - starting AI analysis of MRI specifications"
      };
    }
    
    return {
      title: "Upload MRI Technical Documentation (PDF, JPG, PNG)",
      subtitle: "AI will extract specifications like Tesla strength, bore size, gradient strength, cryogen-free status, and more"
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
        
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            {getUploadStatusIcon()}
          </div>
          <p className={`text-sm font-medium ${statusColor}`}>
            {statusText.title}
          </p>
          <p className={`text-xs ${subtitleColor}`}>
            {statusText.subtitle}
          </p>
          
          {/* Show processing progress */}
          {isAnalyzing && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <Zap className="h-4 w-4 text-primary animate-bounce" />
              <span className="text-xs text-primary font-medium">AI Intelligence Active</span>
            </div>
          )}
          
          {/* Show confidence scores for successful analysis */}
          {specificationData?.isValid && specificationData?.confidenceScores && (
            <div className="mt-3 text-xs text-green-600">
              <div className="flex justify-center space-x-4">
                <span>Extraction Method: {specificationData.extractionMetadata?.extractionMethod === 'pdf' ? 'PDF Text' : 'OCR'}</span>
                <span>Processing Time: {((specificationData.extractionMetadata?.processingTime || 0)/1000).toFixed(1)}s</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {uploadedFile && !isAnalyzing && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={resetUpload}
        >
          Upload Different MRI Document
        </Button>
      )}

      {/* Show filters and results */}
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
