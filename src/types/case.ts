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