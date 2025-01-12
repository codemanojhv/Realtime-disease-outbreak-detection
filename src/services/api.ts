import axios from 'axios';
import { DiseaseInputData, DiseaseCase } from '../types/case';
import { Alert } from '../types/alert';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
});

export const fetchCases = async (): Promise<DiseaseCase[]> => {
  const { data } = await api.get<DiseaseCase[]>('/cases');
  return data;
};

export const submitCase = async (caseData: DiseaseInputData): Promise<DiseaseCase> => {
  const { data } = await api.post<DiseaseCase>('/cases', caseData);
  return data;
};

export const fetchHistoricalCases = async (startDate: string, endDate: string): Promise<DiseaseCase[]> => {
  const { data } = await api.get<DiseaseCase[]>('/cases/historical', {
    params: { start_date: startDate, end_date: endDate }
  });
  return data;
};

export const fetchAlerts = async (): Promise<Alert[]> => {
  const { data } = await api.get<Alert[]>('/alerts');
  return data;
};