
import React from 'react';
import CategoryCard from '@/components/CategoryCard';

const categories = [
  { 
    name: 'Anesthesia Equipment/ICU', 
    icon: '🏥',
    subcategories: [
      'General anesthesia machines',
      'Portable anesthesia machines',
      'Vital signs monitors (heart rate, blood pressure, oxygen saturation)',
      'Electrocardiogram (ECG) monitors',
      'Pulse oximeters',
      'Mechanical ventilators',
      'High-frequency oscillatory ventilators',
      'IV infusion pumps',
      'Syringe pumps',
      'Automated external defibrillators (AEDs)',
      'Manual defibrillators',
      'Blood Gas Analyzers',
      'Cooling blankets',
      'Warming blankets',
      'Endotracheal Tubes',
      'Suction Machines',
      'Air Compressors',
      'Anesthesia Ventilators',
      'BIPAP Machines',
      'Blood Pressure Monitors',
      'CO₂ Monitors',
      'Compression Therapy Machines',
      'Patient Monitors'
    ]
  },
  { 
    name: 'Cardiology Equipment', 
    icon: '❤️',
    subcategories: [
      'Ablation Catheters',
      'Blood Pressure Systems',
      'Capillaroscopes',
      'Cardiac Mapping Systems',
      'Cardiac Output Monitor',
      'Cardiac Stimulators',
      'Diagnostic Catheters',
      'ECG Electrodes',
      'ECG Machines',
      'Embolic Protection Devices',
      'Extracorporeal Circulation Systems',
      'Holter Monitors',
      'Event Recorders',
      'Treadmills with ECG monitoring',
      'Stress echo systems',
      'Transthoracic echocardiography (TTE)',
      'Transesophageal echocardiography (TEE)',
      'Implantable cardioverter-defibrillators (ICDs)',
      'Pacemaker programmers',
      'Defibrillators',
      'Stress Test Systems',
      'Cardiac Catheters',
      'Echocardiography Devices',
      'Pacemakers'
    ]
  },
  { 
    name: 'Cosmetology equipment', 
    icon: '💆‍♀️',
    subcategories: [
      'Microdermabrasion Machines',
      'Laser Hair Removal Machines',
      'IPL (Intense Pulsed Light) Machines',
      'Facial Steaming Machines',
      'Digital skin scanners',
      'Microneedling Devices',
      'LED Light Therapy Machines',
      'Vacuum Massage Machines',
      'Waxing Stations',
      'Facial massage tools',
      'Manicure/pedicure stations'
    ]
  },
  { 
    name: 'Dental Equipment', 
    icon: '🦷',
    subcategories: [
      'Dental Chairs',
      'Digital radiography systems',
      'High-speed handpieces',
      'Low-speed handpieces',
      'Ultrasonic scalers',
      'Air abrasion tools',
      'Intraoral Cameras',
      'CBCT scanners',
      'Intraoral scanners',
      'Light Curing Units',
      'Dental X-ray Film Processors',
      'Dental Sterilizers',
      'Autoclaves',
      'Dental X-ray Systems',
      'CAD/CAM Mills',
      'Curing Lights',
      'Dental Lasers'
    ]
  },
  { 
    name: 'Dental Lab Equipment', 
    icon: '🔬',
    subcategories: [
      'Dental Milling Machines',
      'Ceramic Pressing Machines',
      'Dental Wax Carvers',
      'Dental Furnaces',
      'Dental Lathes',
      'Dental Polishing Machines',
      'Dental Impression Trays',
      'Dental Wax Warmers',
      'Dental Casting Machines',
      'Dental Saws and Grinders'
    ]
  },
  { 
    name: 'Emt training', 
    icon: '🚑',
    subcategories: [
      'CPR training mannequins',
      'Advanced life support (ALS) simulators',
      'Bleeding control kits',
      'Splinting equipment',
      'Oxygen tanks',
      'Nebulizers',
      'AED trainers',
      'Blood pressure cuffs',
      'Stethoscopes',
      'Endotracheal tubes',
      'Bag-valve masks (BVM)',
      'IV needles',
      'IV bags',
      'Splints and Bandages'
    ]
  },
  { 
    name: 'Endoscopy Equipment', 
    icon: '🔍',
    subcategories: [
      'Colonoscopy Machines',
      'Gastroscopy Machines',
      'Arthroscopy Machines',
      'Bronchoscopy Machines',
      'Endoscopic Cameras',
      'Video Processing Units',
      'Biopsy Forceps',
      'Endoscopic Suction Devices',
      'Endoscopic Irrigation Systems',
      'Endoscopic Lighting Systems'
    ]
  },
  { 
    name: 'ENT Equipment', 
    icon: '👂',
    subcategories: [
      'Otoscopes',
      'Flexible nasopharyngoscopes',
      'Rigid nasopharyngoscopes',
      'Direct laryngoscopes',
      'Indirect laryngoscopes',
      'Nasal endoscopes',
      'Sinus drills',
      'Audiometers',
      'Otoscopy machines',
      'Electrocautery units',
      'Harmonic scalpels',
      'Speech therapy tools',
      'Voice analysis software'
    ]
  },
  { 
    name: 'Healthcare IT, Telemedicine', 
    icon: '💻',
    subcategories: [
      'Electronic Health Records (EHR) Systems',
      'Video conferencing systems',
      'Remote patient monitoring devices',
      'Patient Portals',
      'Healthcare Analytics Software',
      'Medical Databases',
      'Cybersecurity Solutions',
      'Wi-Fi routers',
      'Servers',
      'Mobile Health Apps',
      'Wearable health trackers',
      'Glucose monitors',
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
      'Wheelchairs',
      'Walkers',
      'Crutches',
      'Parallel bars',
      'Balance boards',
      'Resistance bands',
      'Therapeutic exercise balls',
      'Patient lifts',
      'Transfer boards',
      'Incentive spirometers',
      'Pressure Relief Mats',
      'Blood pressure monitors',
      'Glucose meters',
      'Hospital Beds',
      'Oxygen Concentrators'
    ]
  },
  { 
    name: 'Hospital Equipment', 
    icon: '🏥',
    subcategories: [
      'Vital signs monitors',
      'Adjustable hospital beds',
      'ICU beds',
      'Stretchers',
      'Oxygen Tanks',
      'Surgical Lights',
      'Autoclaves',
      'UV sterilizers',
      'Emergency Crash Carts',
      'Gurneys',
      'Ambulatory stretchers'
    ]
  },
  { 
    name: 'Imaging', 
    icon: '📷',
    subcategories: [
      'Digital radiography systems',
      'Diagnostic ultrasound',
      'Doppler ultrasound',
      'MRI Machines',
      'CT Scanners',
      'PET Scanners',
      'Mammography Machines',
      'Fluoroscopy Machines',
      'Bone Density Scanners',
      'Digital Imaging Workstations',
      'X-ray Machines',
      'MRI Scanners',
      'Ultrasound Machines',
      'C-Arms'
    ]
  },
  { 
    name: 'Laboratory Equipment', 
    icon: '🧪',
    subcategories: [
      'Compound microscopes',
      'Stereo microscopes',
      'Benchtop centrifuges',
      'High-speed centrifuges',
      'Bacterial incubators',
      'CO2 incubators',
      'Hematology analyzers',
      'Chemistry analyzers',
      'Coagulation analyzers',
      'Manual pipettes',
      'Electronic pipettes',
      'Ultra-low temperature freezers',
      'Refrigerators',
      'Centrifuges',
      'PCR Machines',
      'Microscopes',
      'Incubators',
      'Spectrophotometers'
    ]
  },
  { 
    name: 'Medical Consumable Supplies', 
    icon: '📦',
    subcategories: [
      'Syringes and Needles',
      'Latex gloves',
      'Nitrile gloves',
      'Adhesive bandages',
      'Sterile dressings',
      'Medical tape',
      'Micropore tape',
      'Gauze',
      'Urinary catheters',
      'Nasogastric tubes',
      'Sutures and Staples',
      'Surgical masks',
      'N95 masks',
      'Alcohol Swabs',
      'Sharps Containers'
    ]
  },
  { 
    name: 'Medical Software and Healthcare IT', 
    icon: '💾',
    subcategories: [
      'Electronic Health Records (EHR) Systems',
      'Practice Management Software',
      'Revenue Cycle Management (RCM) Software',
      'Patient Scheduling Software',
      'Telehealth Platforms',
      'Clinical Decision Support Systems (CDSS)',
      'Data Analytics Software',
      'HIPAA compliance tools',
      'Data encryption solutions'
    ]
  },
  { 
    name: 'Mobile Clinics', 
    icon: '🚐',
    subcategories: [
      'Portable vital signs monitors',
      'Portable ultrasound machines',
      'Portable centrifuges',
      'Portable blood glucose testers',
      'First Aid Kits',
      'Medication Dispensers',
      'Solar-powered generators',
      'Battery packs',
      'Satellite phones',
      'Two-way radios'
    ]
  },
  { 
    name: 'Neurology Equipment', 
    icon: '🧠',
    subcategories: [
      'Electroencephalography systems',
      'Neurological Exam Tables',
      'Balance platforms',
      'Posturography systems',
      'Transcranial magnetic stimulation (TMS)',
      'Vagus nerve stimulators',
      'Functional electrical stimulation (FES) devices',
      'Neuromuscular reeducation tools',
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
      'Obstetric ultrasound machines',
      'Delivery Beds',
      'External fetal monitors',
      'Internal fetal monitors',
      'Specula',
      'Colposcopes',
      'Forceps and Vacuum Extractors',
      'Chemical sterilizers',
      'Breast pumps',
      'Perineal care tools',
      'Fetal Dopplers',
      'Ultrasound Machines'
    ]
  },
  { 
    name: 'Ophthalmic Equipment', 
    icon: '👁️',
    subcategories: [
      'Slit-Lamp Microscopes',
      'Applanation tonometers',
      'Non-contact tonometers',
      'Phoropters',
      'Retinal Cameras',
      'Optical Coherence Tomography (OCT) Machines',
      'Refractometers',
      'Keratometers',
      'LASIK lasers',
      'Photocoagulation lasers',
      'Contact Lens Fitting Tools',
      'Eye Drops Dispensers',
      'Slit Lamps',
      'Tonometers',
      'Ophthalmoscopes'
    ]
  },
  { 
    name: 'Pediatric equipment', 
    icon: '🧸',
    subcategories: [
      'Pediatric Beds',
      'Pediatric Vital Signs Monitors',
      'Pediatric Ventilators',
      'Pediatric Ultrasound Machines',
      'Baby scales',
      'Toddler scales',
      'Pediatric Infusion Pumps',
      'Nasal cannulas',
      'Oxygen hoods',
      'Pediatric Surgical Instruments',
      'Child-friendly toys',
      'Educational materials'
    ]
  },
  { 
    name: 'Physiotherapy Equipment', 
    icon: '🤸‍♂️',
    subcategories: [
      'Treadmills',
      'Ellipticals',
      'Stationary bikes',
      'Deep tissue massage tables',
      'Trigger point massage guns',
      'TENS units',
      'EMS units',
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
