import { DiseaseCase } from '../types';
import { format } from 'date-fns';

interface AnalyticsProps {
  cases: DiseaseCase[];
}

export default function Analytics({ cases }: AnalyticsProps) {
  const today = new Date();
  const todayCases = cases.filter(
    (c) => format(new Date(c.timestamp), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  const weekCases = cases.filter((c) => {
    const caseDate = new Date(c.timestamp);
    const diffTime = Math.abs(today.getTime() - caseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const totalCases = cases.reduce((sum, c) => sum + c.cases, 0);
  const todayTotal = todayCases.reduce((sum, c) => sum + c.cases, 0);
  const weekTotal = weekCases.reduce((sum, c) => sum + c.cases, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Today's Cases</h3>
          <p className="text-2xl font-bold text-green-900">{todayTotal}</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">This Week</h3>
          <p className="text-2xl font-bold text-blue-900">{weekTotal}</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Total Cases</h3>
          <p className="text-2xl font-bold text-purple-900">{totalCases}</p>
        </div>
      </div>
    </div>
  );
}