export interface Alert {
  id: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}