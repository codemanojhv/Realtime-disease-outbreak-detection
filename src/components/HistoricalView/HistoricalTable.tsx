import { format } from 'date-fns';
import { DiseaseCase } from '../../types';

interface HistoricalTableProps {
  cases: DiseaseCase[];
}

export default function HistoricalTable({ cases = [] }: HistoricalTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Disease
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              City
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cases
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cases?.map((case_) => (
            <tr key={case_.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(case_.timestamp), 'yyyy-MM-dd')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {case_.disease}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {case_.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {case_.cases}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}