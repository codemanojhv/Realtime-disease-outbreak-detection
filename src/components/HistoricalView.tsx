import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchHistoricalCases } from '../services/api';
import { format } from 'date-fns';
import DateRangePicker from './HistoricalView/DateRangePicker';
import HistoricalTable from './HistoricalView/HistoricalTable';

export default function HistoricalView() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { data: historicalCases } = useQuery({
    queryKey: ['historical', startDate, endDate],
    queryFn: () => fetchHistoricalCases(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    )
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-bold mb-4">Historical Data</h2>
      
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <HistoricalTable cases={historicalCases || []} />
    </div>
  );
}