
import React, { useState } from 'react';
import { Upload, FileText, Image, Loader2 } from 'lucide-react';
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
        setSpecificationData(analysisResult);
        
        toast({
          title: "File analyzed successfully",
          description: `Found specifications for ${analysisResult.productType}`,
        });
      } catch (error) {
        console.error('Analysis failed:', error);
        toast({
          title: "Analysis failed",
          description: "Could not analyze the technical specifications. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file containing technical specifications.",
        variant: "destructive",
      });
    }
  };

  const handleFilterApply = (filters: string[]) => {
    console.log('Applied filters:', filters);
    toast({
      title: "Filters applied",
      description: `Searching with ${filters.length} filter criteria`,
    });
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setSpecificationData(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="w-full space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${uploadedFile ? 'bg-green-50 border-green-300' : 'bg-white'}`}
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
        
        {isAnalyzing ? (
          <div className="space-y-2">
            <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-primary">Analyzing specifications...</p>
            <p className="text-xs text-muted-foreground">Extracting technical details from your document</p>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              {uploadedFile.type === 'application/pdf' ? (
                <FileText className="h-8 w-8 text-green-600" />
              ) : (
                <Image className="h-8 w-8 text-green-600" />
              )}
            </div>
            <p className="text-sm font-medium text-green-700">{uploadedFile.name}</p>
            <p className="text-xs text-green-600">File uploaded and analyzed successfully</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drop technical specifications here or click to upload</p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
          </div>
        )}
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
