
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  currency?: string;
}

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title }) => {
  return (
    <div className="py-8">
      <h3 className="text-2xl font-bold text-foreground mb-6">{title}</h3>
      <Carousel className="w-full max-w-7xl mx-auto">
        <CarouselContent className="-ml-1">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm line-clamp-2 text-card-foreground">
                        {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Brand: {product.brand}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {product.currency || '$'}{product.price.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
