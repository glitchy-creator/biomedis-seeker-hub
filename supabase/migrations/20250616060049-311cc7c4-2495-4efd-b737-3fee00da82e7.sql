
-- Insert manufacturers only if they don't already exist
DO $$
BEGIN
  INSERT INTO manufacturers (name, country) 
  SELECT 'Siemens Healthineers', 'Germany'
  WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Siemens Healthineers');
  
  INSERT INTO manufacturers (name, country) 
  SELECT 'Intuitive Surgical', 'United States'
  WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Intuitive Surgical');
  
  INSERT INTO manufacturers (name, country) 
  SELECT 'Elekta', 'Sweden'
  WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Elekta');
  
  INSERT INTO manufacturers (name, country) 
  SELECT 'Getinge', 'Sweden'
  WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Getinge');
  
  INSERT INTO manufacturers (name, country) 
  SELECT 'Leica Biosystems', 'Germany'
  WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Leica Biosystems');
END $$;

-- Insert equipment categories only if they don't already exist
DO $$
BEGIN
  INSERT INTO equipment_categories (name, description)
  SELECT 'Medical Imaging', 'Diagnostic imaging equipment including MRI, CT, X-ray systems'
  WHERE NOT EXISTS (SELECT 1 FROM equipment_categories WHERE name = 'Medical Imaging');
  
  INSERT INTO equipment_categories (name, description)
  SELECT 'Surgical Equipment', 'Robotic surgical systems and surgical instruments'
  WHERE NOT EXISTS (SELECT 1 FROM equipment_categories WHERE name = 'Surgical Equipment');
  
  INSERT INTO equipment_categories (name, description)
  SELECT 'Radiation Therapy', 'Linear accelerators and radiation treatment systems'
  WHERE NOT EXISTS (SELECT 1 FROM equipment_categories WHERE name = 'Radiation Therapy');
  
  INSERT INTO equipment_categories (name, description)
  SELECT 'Critical Care', 'Life support and intensive care equipment'
  WHERE NOT EXISTS (SELECT 1 FROM equipment_categories WHERE name = 'Critical Care');
  
  INSERT INTO equipment_categories (name, description)
  SELECT 'Laboratory Equipment', 'Pathology and diagnostic laboratory instruments'
  WHERE NOT EXISTS (SELECT 1 FROM equipment_categories WHERE name = 'Laboratory Equipment');
END $$;

-- Create the medical suppliers table
CREATE TABLE IF NOT EXISTS medical_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  specialization TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert the 5 pieces of equipment
INSERT INTO equipment (
  name, 
  brand, 
  model, 
  manufacturer_id, 
  category_id, 
  description, 
  specifications, 
  price_range, 
  country_of_origin,
  availability_status
) VALUES 
(
  'MRI Scanner - Magnetom Terra',
  'Siemens Healthineers',
  'Magnetom Terra 3T',
  (SELECT id FROM manufacturers WHERE name = 'Siemens Healthineers' LIMIT 1),
  (SELECT id FROM equipment_categories WHERE name = 'Medical Imaging' LIMIT 1),
  'High-resolution imaging of soft tissues, brain, spinal cord, joints, and internal organs with 3 Tesla magnetic field strength',
  '{
    "magnetic_field_strength": "3 Tesla",
    "gradient_system": "Up to 80 mT/m amplitude, 200 T/m/s slew rate",
    "cooling_system": "Liquid helium for superconducting magnet",
    "rf_channels": "Up to 64 transmit/receive channels",
    "software": "AI-assisted image reconstruction (AI-Rad Companion)",
    "weight": "10+ tons",
    "power_consumption": "200-300 kW/hour",
    "room_requirements": "Shielded MRI suite with strict RF isolation"
  }',
  '$1.5M - $3M USD',
  'Germany',
  'available'
),
(
  'Surgical Robot - da Vinci Xi HD',
  'Intuitive Surgical',
  'da Vinci Xi HD System',
  (SELECT id FROM manufacturers WHERE name = 'Intuitive Surgical' LIMIT 1),
  (SELECT id FROM equipment_categories WHERE name = 'Surgical Equipment' LIMIT 1),
  'Minimally invasive robotic-assisted surgery across multiple specialties with 4 interactive robotic arms',
  '{
    "robotic_arms": "4 interactive arms with EndoWrist instruments",
    "camera": "3D High-definition vision system",
    "control_console": "Ergonomic surgeon console with haptic feedback",
    "instrument_compatibility": "Multi-quadrant access, various surgical tools",
    "software": "Firefly Fluorescence Imaging, Task-specific setups",
    "dimensions": "Cart: 1.2m x 1m x 1.8m",
    "power_requirement": "Standard hospital power supply",
    "annual_maintenance": "$120,000 - $175,000"
  }',
  '$1.5M - $2.5M USD',
  'United States',
  'available'
),
(
  'Linear Accelerator - Versa HD',
  'Elekta',
  'Versa HD™',
  (SELECT id FROM manufacturers WHERE name = 'Elekta' LIMIT 1),
  (SELECT id FROM equipment_categories WHERE name = 'Radiation Therapy' LIMIT 1),
  'Radiation therapy for cancer treatment with highly precise radiation beam delivery capabilities',
  '{
    "energy_levels": "6 MeV – 10 MeV photon energy, electron energies up to 18 MeV",
    "beam_agility": "Fast dynamic beam shaping using Agility™ multi-leaf collimator (160 leaves)",
    "treatment_types": "IMRT, VMAT, SBRT, SRS",
    "imaging_capabilities": "Integrated cone-beam CT (CBCT) and kV/MV imaging",
    "dose_rate": "Up to 2400 MU/min",
    "accuracy": "Sub-millimeter targeting precision",
    "room_requirements": "Radiation-shielded vault"
  }',
  '$2M - $4M USD',
  'Sweden',
  'available'
),
(
  'ECMO Machine - Cardiohelp System',
  'Getinge',
  'Cardiohelp System',
  (SELECT id FROM manufacturers WHERE name = 'Getinge' LIMIT 1),
  (SELECT id FROM equipment_categories WHERE name = 'Critical Care' LIMIT 1),
  'Provides extracorporeal life support for patients with severe heart and/or lung failure',
  '{
    "type": "Mobile, portable ECMO system",
    "pump_type": "Centrifugal pump",
    "flow_range": "0.3 – 7.2 L/min",
    "drive_units": "Battery-powered, AC/DC compatible",
    "oxygenator": "Integrated membrane oxygenator (Integrated Gas Exchange Module)",
    "monitoring_parameters": "Blood flow, pressure, temperature, SpO₂",
    "portability": "Designed for transport and ICU use",
    "weight": "15 kg (with accessories)"
  }',
  '$150K - $250K USD',
  'Sweden',
  'available'
),
(
  'Digital Pathology Scanner - Aperio AT2 DX',
  'Leica Biosystems',
  'Aperio AT2 DX',
  (SELECT id FROM manufacturers WHERE name = 'Leica Biosystems' LIMIT 1),
  (SELECT id FROM equipment_categories WHERE name = 'Laboratory Equipment' LIMIT 1),
  'Whole slide digital scanning for pathology diagnosis and analysis with high-resolution capabilities',
  '{
    "scanning_resolution": "Up to 0.25 µm/pixel (40x magnification equivalent)",
    "slide_capacity": "500 slides per batch (autoload)",
    "scan_speed": "60 seconds per slide at 20x magnification",
    "image_formats": "SVS, TIFF, JPEG, NDPI",
    "connectivity": "Integration with LIS/PACS, cloud-based storage options",
    "software": "Image analysis tools, AI-driven diagnostics (tumor detection)",
    "dimensions": "1.2m x 0.9m x 1.2m"
  }',
  '$250K - $400K USD',
  'Germany',
  'available'
);

-- Insert the supplier data with conflict handling
INSERT INTO medical_suppliers (company_name, country, specialization, website) VALUES
('Siemens Healthineers AG', 'Germany', 'MRI/CT scanners, diagnostic imaging, lab diagnostics', 'siemens-healthineers.com'),
('Philips Healthcare (Royal Philips)', 'Netherlands', 'Diagnostic imaging, patient monitoring, home healthcare', 'philips.com/healthcare'),
('GE HealthCare Technologies Inc.', 'United States', 'MRI, CT, X-ray, ultrasound, nuclear medicine', 'gehealthcare.com'),
('Drägerwerk AG & Co. KGaA', 'Germany', 'Anesthesia machines, ventilators, patient monitoring, ECMO', 'draeger.com'),
('Fresenius SE & Co. KGaA', 'Germany', 'Dialysis machines, infusion pumps, ICU equipment', 'fresenius.com'),
('Medtronic plc', 'Ireland', 'Surgical robots (e.g., Mazor), cardiac devices, ICU equipment', 'medtronic.com'),
('Intuitive Surgical, Inc.', 'United States', 'da Vinci Surgical System (robotic-assisted surgery)', 'intuitivesurgical.com'),
('Elekta AB', 'Sweden', 'Linear accelerators, radiation therapy systems', 'elekta.com'),
('Getinge AB', 'Sweden', 'ECMO machines, critical care, OR solutions', 'getinge.com'),
('Leica Biosystems Nussloch GmbH', 'Germany', 'Digital pathology, histology, microtomy, scanners', 'leicabiosystems.com'),
('BD (Becton, Dickinson and Company)', 'United States', 'Infusion pumps, syringes, lab equipment', 'bd.com'),
('Stryker Corporation', 'United States', 'Orthopedic and surgical equipment, navigation systems', 'stryker.com'),
('Terumo Corporation', 'Japan', 'Cardiovascular devices, catheters, ECMO components', 'terumo.com'),
('Hill-Rom Services, Inc.', 'United States', 'Hospital beds, patient handling, surgical tables', 'hill-rom.com'),
('Maquet Getinge Group', 'Sweden', 'Surgical tables, ICU beds, operating room integration', 'maquet.com')
ON CONFLICT (company_name) DO NOTHING;
