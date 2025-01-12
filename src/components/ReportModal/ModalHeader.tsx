import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalHeaderProps {
  onClose: () => void;
}

export default function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <>
      <div className="absolute right-0 top-0 pr-4 pt-4">
        <button
          type="button"
          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 mb-4">
        Report New Case
      </Dialog.Title>
    </>
  );
}