


const PRODUCT_DATA = {


  1: { name: "CBC Test", price: 280, details: "15 Parameters · Blood Test" },
  2: { name: "CRP Test", price: 480, details: "70 Parameters · Blood Test" },
  3: { name: "HbA1c Test", price: 455, details: "1 Parameter · Blood Test" },
  4: { name: "Vitamin B12", price: 1890, details: "2 Parameters · Blood Test" },
  5: { name: "Lipid Profile Test", price: 420, details: "8 Parameters · Blood Test" },
  
  301: { name: "Thyroid Profile", price: 560, details: "5 Parameters . Blood Test" },
  302: { name: "LFT", price: 840, details: "Blood Test · 12 Parameters" },
  303: { name: "KFT", price: 700, details: "Blood Test · 8 Parameters" },
  304: { name: "Blood Sugar (Fasting/PP)", price: 350, details: "Blood Test · 2 Parameters" },
  305: { name: "Vitamin D Test", price: 490, details: "Blood Test · 1 Parameter" },
  306: { name: "Iron Studies", price: 420, details: "Blood Test · 4 Parameters" },
  307: { name: "Hormone Profile", price: 630, details: "Blood Test · 6 Parameters" },
  308: { name: "Urine Routine & Microscopy", price: 350, details: "Urine Test · 8 Parameters" },
  309: { name: "electrolytes", price: 490, details: "Blood Test · 6 Parameters" },
  310: { name: "Calcium Test", price: 420, details: "Blood Test · 2 Parameters" },
  311: { name: "Prostate Specific Antigen (PSA)", price: 560, details: "Blood Test · 1 Parameter" },
  312: { name: "Iron & Ferritin Test", price: 490, details: "Blood Test · 4 Parameters" },
  313: { name: "Blood Culture", price: 700, details: "Blood Test · 1 Parameter" },
  314: { name: "Coagulation Profile", price: 630, details: "Blood Test · 4 Parameters" },
  315: { name: "Thyroid Antibodies Test", price: 595, details: "Blood Test · 3 Parameters" },
  316: { name: "Uric Acid Test", price: 280, details: "Blood Test · 1 Parameter" },
  317: { name: "Homocysteine Test", price: 840, details: "Blood Test · 1 Parameter" },
  318: { name: "Triglycerides Test", price: 420, details: "Blood Test · 1 Parameter" },
  319: { name: "Cholesterol – HDL/LDL", price: 420, details: "Blood Test · 2 Parameters" },
  320: { name: "Folate Test", price: 350, details: "Blood Test · 1 Parameter" },
  321: { name: "Cortisol Test", price: 490, details: "Blood Test · 1 Parameter" },
  322: { name: "Insulin Test", price: 560, details: "Blood Test · 1 Parameter" },
  323: { name: "Magnesium Test", price: 350, details: "Blood Test · 1 Parameter" },
  324: { name: "Amylase & Lipase Test", price: 490, details: "Blood Test · 2 Parameters" },
  325: { name: "Vitamin K Test", price: 420, details: "Blood Test · 1 Parameter" },
  326: { name: "Dengue Test (NS1, IgG, IgM)", price: 900, details: "Blood Test · Dengue Detection" },
  327: { name: "Malaria Test", price: 350, details: "Blood Test · Malaria Parasite Detection" },
  328: { name: "Typhoid Test", price: 400, details: "Blood Test · Typhoid Screening" },
  329: { name: "Chikungunya Test", price: 750, details: "Blood Test · Viral Infection Detection" },
  330: { name: "Widal Test", price: 250, details: "Blood Test · Typhoid Antibody Test" },
  331: { name: "HIV Test", price: 500, details: "Blood Test · HIV Screening" },
  332: { name: "Hepatitis B Test", price: 600, details: "Blood Test · HBsAg Detection" },
  333: { name: "Hepatitis C Test", price: 650, details: "Blood Test · HCV Antibody Test" },
  

  // Health Packages (Summary)
  6: { name: "Basic Health Checkup", price: 1299, details: "Routine health screening package" },
  7: { name: "Master Health Checkup", price: 2499, details: "Comprehensive full body package" },
  8: { name: "Heart Health Checkup", price: 2199, details: "Cardiac risk assessment tests" },
  9: { name: "Well Women Checkup", price: 2299, details: "Women’s complete health profile" },
  10: { name: "Diabetic Profile", price: 1199, details: "Blood sugar & diabetes monitoring" },


/* ===============================
   SCANS & IMAGING
================================ */

// Parent Scans
11: { name: "X-Ray Scan", price: 560, details: "Digital X-Ray · Imaging Test" },
12: { name: "MRI Scan", price: 4200, details: "Magnetic Resonance Imaging" },
13: { name: "CT Scan", price: 3500, details: "Computed Tomography Scan" },
14: { name: "Ultrasound (USG)", price: 1400, details: "Ultrasound Imaging Scan" },
15: { name: "PET Scan", price: 14000, details: "Positron Emission Tomography" },

/* ===============================
   X-RAY TYPES (5 Major)
================================ */

507: { name: "X-Ray Chest", price: 800, details: "Chest radiography" },
508: { name: "X-Ray Spine", price: 1000, details: "Spinal radiography" },
511: { name: "X-Ray Hand", price: 700, details: "Hand bone imaging" },
512: { name: "X-Ray Leg", price: 900, details: "Lower limb radiography" },
513: { name: "X-Ray Skull", price: 850, details: "Skull & facial bone imaging" },

/* ===============================
   MRI TYPES (5 Major)
================================ */

501: { name: "MRI Brain", price: 5000, details: "Detailed brain imaging" },
502: { name: "MRI Spine", price: 5500, details: "Complete spinal imaging" },
514: { name: "MRI Knee", price: 4800, details: "Knee joint imaging" },
515: { name: "MRI Abdomen", price: 6000, details: "Abdominal organ imaging" },
516: { name: "MRI With Contrast", price: 7500, details: "Contrast-enhanced MRI study" },

/* ===============================
   CT SCAN TYPES (5 Major)
================================ */

503: { name: "CT Brain", price: 3500, details: "Computed Tomography - Brain" },
504: { name: "CT Spine", price: 4000, details: "Detailed spinal CT imaging" },
517: { name: "CT Chest", price: 4200, details: "Thoracic CT imaging" },
518: { name: "CT Abdomen", price: 4500, details: "Abdominal CT scan" },
519: { name: "CT Angiography", price: 8000, details: "Vascular CT imaging" },

/* ===============================
   ULTRASOUND TYPES (5 Major)
================================ */

505: { name: "Ultrasound Abdomen", price: 2000, details: "Abdominal imaging" },
506: { name: "Ultrasound Pelvis", price: 1800, details: "Pelvic organ evaluation" },
510: { name: "Doppler Ultrasound", price: 2200, details: "Blood flow & vascular imaging" },
520: { name: "Ultrasound Pregnancy", price: 1600, details: "Obstetric ultrasound scan" },
521: { name: "Ultrasound Thyroid", price: 1500, details: "Thyroid gland imaging" },

  // Health Packages (Details Pages)
  101: {
    name: "Basic Health Checkup",
    price: 1299,
    details: "60+ Parameters · Health Package"
  },

  102: {
    name: "Master Health Checkup",
    price: 2499,
    details: "85+ Parameters · Health Package"
  },

  103: {
    name: "Heart Health Checkup",
    price: 1799,
    details: "Cardiac Risk Assessment"
  },

  104: {
    name: "Well Women Checkup",
    price: 1999,
    details: "Women’s Complete Health Profile"
  },

  105: {
    name: "Diabetic Profile",
    price: 899,
    details: "Diabetes Monitoring Package"
  },

  106: {
    name: "Executive Health Checkup",
    price: 2999,
    details: "Premium Corporate Package"
  },

  107: {
    name: "Senior Citizen Health Checkup",
    price: 2599,
    details: "Age-specific Preventive Package"
  },

  108: {
    name: "Thyroid Health Checkup",
    price: 799,
    details: "Thyroid Function Tests"
  },

  109: {
    name: "Vitamin & Mineral Checkup",
    price: 1499,
    details: "Nutritional Deficiency Panel"
  },

  110: {
    name: "Pre-employment Health Checkup",
    price: 999,
    details: "Mandatory Job Screening"
  },


  // Organ Diagnostics
  201: { name: "Heart Diagnostics", price: 1999, details: "ECG · Echo · Lipid Profile · Troponin" },
  202: { name: "Kidney Diagnostics", price: 1499, details: "KFT · Creatinine · Urea · Urine Routine" },
  203: { name: "Liver Diagnostics", price: 1399, details: "LFT · SGOT · SGPT · Bilirubin" },
  204: { name: "Bone Health Diagnostics", price: 1299, details: "Vitamin D · Calcium · X-Ray" },
  205: { name: "Vitamin Diagnostics", price: 999, details: "Vitamin B12 · Vitamin D · Folate" },
  206: { name: "Hormone Diagnostics", price: 1899, details: "TSH · T3 · T4 · Cortisol · Prolactin" },
  207: { name: "Gut Diagnostics", price: 1599, details: "Stool Test · H. Pylori · CRP" },
  208: { name: "Blood Diagnostics", price: 1299, details: "CBC · ESR · CRP · Hemoglobin" },
  209: { name: "Reproductive Diagnostics", price: 1999, details: "FSH · LH · Prolactin · Estrogen/Testosterone" },
  210: { name: "Thyroid Diagnostics", price: 899, details: "T3 · T4 · TSH" }
};

window.PRODUCT_DATA = PRODUCT_DATA;


