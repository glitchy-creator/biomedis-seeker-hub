
import React from 'react';
import { Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FileUpload from '@/components/FileUpload';

const SearchHero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What are you looking for?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find the best medical equipment and healthcare solutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Search Section */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for medical equipment..."
                className="pl-10 h-12 text-lg bg-white shadow-md border-0"
              />
            </div>
            <Button size="lg" className="w-full h-12 text-lg">
              Search Equipment
            </Button>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-primary mb-2" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload Technical Specification
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload PDF or image of your requirements
              </p>
            </div>
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
