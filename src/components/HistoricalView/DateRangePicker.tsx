import { Dispatch, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
}

export default function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date || new Date())}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date || new Date())}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}