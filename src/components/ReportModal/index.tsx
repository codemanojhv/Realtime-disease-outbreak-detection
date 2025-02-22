import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DataInput from '../DataInput';
import { DiseaseInputData } from '../../types';
import { submitCase } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import ModalHeader from './ModalHeader';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReportModal({ isOpen, onClose, onSuccess }: ReportModalProps) {
  const queryClient = useQueryClient();

  const handleSubmit = async (data: DiseaseInputData) => {
    try {
      await submitCase(data);
      await queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case reported successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to submit case');
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <ModalHeader onClose={onClose} />
                <div>
                  <div className="mt-3 sm:mt-0">
                    <div className="mt-2">
                      <DataInput onSubmit={handleSubmit} />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}