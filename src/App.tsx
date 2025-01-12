import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Map from './components/Map';
import Analytics from './components/Analytics';
import AlertBanner from './components/AlertBanner';
import HistoricalView from './components/HistoricalView';
import { useQuery } from '@tanstack/react-query';
import { fetchCases } from './services/api';
import ReportPage from './components/ReportPage';

const queryClient = new QueryClient();

export default function App() {
  const [showHistorical, setShowHistorical] = useState(false);
  const [showReportPage, setShowReportPage] = useState(false);

  if (showReportPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <ReportPage onBack={() => setShowReportPage(false)} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Disease Surveillance Platform
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowReportPage(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Report New Case
              </button>
              <button
                onClick={() => setShowHistorical(!showHistorical)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {showHistorical ? 'Show Current Data' : 'Show Historical Data'}
              </button>
            </div>
          </div>

          <AlertBanner />
          
          {showHistorical ? (
            <HistoricalView />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MapWithData />
                <div className="mt-8">
                  <AnalyticsWithData />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

function MapWithData() {
  const { data: cases = [] } = useQuery({
    queryKey: ['cases'],
    queryFn: fetchCases,
    refetchInterval: 10000
  });

  return <Map cases={cases} />;
}

function AnalyticsWithData() {
  const { data: cases = [] } = useQuery({
    queryKey: ['cases'],
    queryFn: fetchCases
  });

  return <Analytics cases={cases} />;
}