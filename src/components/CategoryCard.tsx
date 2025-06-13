
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon }) => {
  return (
    <div className="group relative bg-card hover:bg-accent/50 border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl" role="img" aria-label={name}>
            {icon}
          </span>
          <div>
            <h3 className="text-sm font-medium text-card-foreground group-hover:text-accent-foreground line-clamp-2">
              {name}
            </h3>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
};

export default CategoryCard;
