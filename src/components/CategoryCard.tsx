
import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoryCardProps {
  name: string;
  icon: string;
  subcategories: string[];
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, subcategories }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto bg-popover border border-border shadow-md">
        {subcategories.map((subcategory, index) => (
          <DropdownMenuItem 
            key={index}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={() => console.log(`Selected: ${subcategory}`)}
          >
            {subcategory}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryCard;
