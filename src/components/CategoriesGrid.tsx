
import React from 'react';
import CategoryCard from '@/components/CategoryCard';

const categories = [
  { 
    name: 'Anesthesia Equipment/ICU', 
    icon: '🏥',
    subcategories: [
      'Air Compressors',
      'Anesthesia Machines',
      'Anesthesia Ventilators',
      'BIPAP Machines',
      'Blood Pressure Monitors',
      'CO₂ Monitors',
      'Compression Therapy Machines',
      'Defibrillators (ICU)',
      'Infusion Pumps',
      'Patient Monitors',
      'Pulse Oximeters',
      'Syringe Pumps',
      'Ventilators'
    ]
  },
  { 
    name: 'Cardiology Equipment', 
    icon: '❤️',
    subcategories: [
      'ECG Machines',
      'Defibrillators',
      'Holter Monitors',
      'Stress Test Systems',
      'Cardiac Catheters',
      'Echocardiography Devices',
      'Pacemakers',
      'AEDs (Automated External Defibrillators)'
    ]
  },
  { 
    name: 'Cosmetology equipment', 
    icon: '💆‍♀️',
    subcategories: ['General Cosmetology Equipment']
  },
  { 
    name: 'Dental Equipment', 
    icon: '🦷',
    subcategories: [
      'Dental Chairs',
      'Autoclaves',
      'Dental X-ray Systems',
      'CAD/CAM Mills',
      'Curing Lights',
      'Dental Lasers',
      'Intraoral Cameras'
    ]
  },
  { 
    name: 'Dental Lab Equipment', 
    icon: '🔬',
    subcategories: ['General Dental Lab Equipment']
  },
  { 
    name: 'Emt training', 
    icon: '🚑',
    subcategories: ['EMT Training Equipment']
  },
  { 
    name: 'Endoscopy Equipment', 
    icon: '🔍',
    subcategories: ['General Endoscopy Equipment']
  },
  { 
    name: 'ENT Equipment', 
    icon: '👂',
    subcategories: ['General ENT Equipment']
  },
  { 
    name: 'Healthcare IT, Telemedicine', 
    icon: '💻',
    subcategories: [
      'EMR/EHR Software',
      'Remote Patient Monitoring',
      'Telehealth Carts',
      'Medical Tablets',
      'Health Information Exchange (HIE) Systems'
    ]
  },
  { 
    name: 'Home Care Rehab', 
    icon: '🏠',
    subcategories: [
      'Hospital Beds',
      'Wheelchairs',
      'Walkers',
      'Oxygen Concentrators'
    ]
  },
  { 
    name: 'Hospital Equipment', 
    icon: '🏥',
    subcategories: ['General Hospital Equipment']
  },
  { 
    name: 'Imaging', 
    icon: '📷',
    subcategories: [
      'X-ray Machines',
      'MRI Scanners',
      'CT Scanners',
      'Ultrasound Machines',
      'C-Arms'
    ]
  },
  { 
    name: 'Laboratory Equipment', 
    icon: '🧪',
    subcategories: [
      'Centrifuges',
      'Hematology Analyzers',
      'PCR Machines',
      'Microscopes',
      'Incubators',
      'Spectrophotometers'
    ]
  },
  { 
    name: 'Medical Consumable Supplies', 
    icon: '📦',
    subcategories: ['General Medical Consumables']
  },
  { 
    name: 'Medical Software and Healthcare IT', 
    icon: '💾',
    subcategories: ['General Medical Software']
  },
  { 
    name: 'Mobile Clinics', 
    icon: '🚐',
    subcategories: ['Mobile Clinic Equipment']
  },
  { 
    name: 'Neurology Equipment', 
    icon: '🧠',
    subcategories: [
      'EEG Machines',
      'EMG Devices',
      'TMS Systems',
      'Neurostimulators',
      'Polysomnography Devices'
    ]
  },
  { 
    name: 'OB GYN Equipment', 
    icon: '👶',
    subcategories: [
      'Fetal Dopplers',
      'Ultrasound Machines',
      'Colposcopes',
      'Breast Pumps',
      'Delivery Beds'
    ]
  },
  { 
    name: 'Ophthalmic Equipment', 
    icon: '👁️',
    subcategories: [
      'Phoropters',
      'Slit Lamps',
      'Tonometers',
      'Retinal Cameras',
      'Ophthalmoscopes'
    ]
  },
  { 
    name: 'Pediatric equipment', 
    icon: '🧸',
    subcategories: ['General Pediatric Equipment']
  },
  { 
    name: 'Physiotherapy Equipment', 
    icon: '🤸‍♂️',
    subcategories: [
      'TENS Units',
      'Ultrasound Therapy Devices',
      'Exercise Bikes',
      'Traction Tables',
      'Hydrotherapy Tanks'
    ]
  },
  { 
    name: 'Sterilising Equipment', 
    icon: '🧽',
    subcategories: ['General Sterilising Equipment']
  },
  { 
    name: 'Surgery Equipment', 
    icon: '⚕️',
    subcategories: [
      'Electrosurgical Units',
      'Surgical Lasers',
      'Sterile Drapes',
      'Suturing Devices',
      'Laparoscopic Towers'
    ]
  },
  { 
    name: 'Urology equipment', 
    icon: '🩺',
    subcategories: ['General Urology Equipment']
  },
  { 
    name: 'Veterinary Equipment', 
    icon: '🐕',
    subcategories: [
      'Veterinary Anesthesia Machines',
      'Pet X-ray Systems',
      'Surgical Tools',
      'Animal Monitors'
    ]
  },
  { 
    name: 'Wellness or Fitness Devices', 
    icon: '💪',
    subcategories: ['General Wellness Equipment']
  }
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
              subcategories={category.subcategories}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;
