export interface DiseaseCase {
  id: string;
  disease: string;
  city: string;
  cases: number;
  timestamp: string;
  lat: number;
  lng: number;
}

export interface DiseaseInputData {
  disease: string;
  city: string;
  cases: string | number;
  timestamp: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

export const COMMON_DISEASES = [
  { id: 'covid19', name: 'COVID-19', description: 'Viral respiratory illness' },
  { id: 'dengue', name: 'Dengue', description: 'Mosquito-borne viral infection' },
  { id: 'malaria', name: 'Malaria', description: 'Parasitic infection spread by mosquitoes' },
  { id: 'tuberculosis', name: 'Tuberculosis', description: 'Bacterial infection affecting lungs' },
  { id: 'cholera', name: 'Cholera', description: 'Bacterial infection causing severe diarrhea' },
  { id: 'influenza', name: 'Influenza', description: 'Seasonal flu virus' },
  { id: 'typhoid', name: 'Typhoid', description: 'Bacterial infection from contaminated food/water' },
  { id: 'zika', name: 'Zika Virus', description: 'Mosquito-borne viral disease' }
];