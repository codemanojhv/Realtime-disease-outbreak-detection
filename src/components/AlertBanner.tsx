import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '../services/api';
import { Alert } from '../types/alert';

export default function AlertBanner() {
  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    refetchInterval: 30000,
    queryFn: fetchAlerts
  });

  if (!alerts?.length) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Active Alerts</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {alerts.map((alert: Alert) => (
                <li key={alert.id}>{alert.message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}