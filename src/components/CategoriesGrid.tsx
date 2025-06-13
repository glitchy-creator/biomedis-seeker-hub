
import React from 'react';
import CategoryCard from '@/components/CategoryCard';

const categories = [
  { name: 'Anesthesia Equipment/ICU', icon: '🏥' },
  { name: 'Cardiology Equipment', icon: '❤️' },
  { name: 'Cosmetology equipment', icon: '💆‍♀️' },
  { name: 'Dental Equipment', icon: '🦷' },
  { name: 'Dental Lab Equipment', icon: '🔬' },
  { name: 'Emt training', icon: '🚑' },
  { name: 'Endoscopy Equipment', icon: '🔍' },
  { name: 'ENT Equipment', icon: '👂' },
  { name: 'Healthcare IT, Telemedicine', icon: '💻' },
  { name: 'Home Care Rehab', icon: '🏠' },
  { name: 'Hospital Equipment', icon: '🏥' },
  { name: 'Imaging', icon: '📷' },
  { name: 'Laboratory Equipment', icon: '🧪' },
  { name: 'Medical Consumable Supplies', icon: '📦' },
  { name: 'Medical Software and Healthcare IT', icon: '💾' },
  { name: 'Mobile Clinics', icon: '🚐' },
  { name: 'Neurology Equipment', icon: '🧠' },
  { name: 'OB GYN Equipment', icon: '👶' },
  { name: 'Ophthalmic Equipment', icon: '👁️' },
  { name: 'Pediatric equipment', icon: '🧸' },
  { name: 'Physiotherapy Equipment', icon: '🤸‍♂️' },
  { name: 'Sterilising Equipment', icon: '🧽' },
  { name: 'Surgery Equipment', icon: '⚕️' },
  { name: 'Urology equipment', icon: '🩺' },
  { name: 'Veterinary Equipment', icon: '🐕' },
  { name: 'Wellness or Fitness Devices', icon: '💪' }
];

const CategoriesGrid = () => {
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Browse Equipment Categories
          </h2>
          <p className="text-lg text-muted-foreground">
            Find the right medical equipment for your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index}
              name={category.name}
              icon={category.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;
