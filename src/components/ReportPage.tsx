import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import DataInput from './DataInput';
import { DiseaseInputData } from '../types';
import { submitCase } from '../services/api';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface ReportPageProps {
  onBack: () => void;
}

export default function ReportPage({ onBack }: ReportPageProps) {
  const queryClient = useQueryClient();

  const handleSubmit = async (data: DiseaseInputData) => {
    try {
      await submitCase(data);
      await queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case reported successfully');
      onBack();
    } catch (error) {
      toast.error('Failed to submit case');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Report New Case
            </h2>
            <DataInput onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}