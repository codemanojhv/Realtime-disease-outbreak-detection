import { useState, useEffect, useCallback } from 'react';
import { DiseaseInputData, COMMON_DISEASES } from '../types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface DataInputProps {
  onSubmit: (data: DiseaseInputData) => void;
}

interface City {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

const INDIAN_CITIES = [
  { city: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { city: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090 },
  { city: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { city: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 }
];

export default function DataInput({ onSubmit }: DataInputProps) {
  const [formData, setFormData] = useState<DiseaseInputData>({
    disease: '',
    city: '',
    cases: '',
    timestamp: new Date().toISOString().split('T')[0]
  });

  const [cityQuery, setCityQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [resetCommand, setResetCommand] = useState('');

  // Filter cities based on input
  const filterCities = useCallback((query: string) => {
    if (!query) return INDIAN_CITIES;
    const lowercaseQuery = query.toLowerCase();
    return INDIAN_CITIES.filter(city => 
      city.city.toLowerCase().includes(lowercaseQuery) ||
      city.state.toLowerCase().includes(lowercaseQuery)
    );
  }, []);

  // Update suggestions when input changes
  useEffect(() => {
    const filteredCities = filterCities(cityQuery);
    setSuggestions(filteredCities);
  }, [cityQuery, filterCities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      cases: Number(formData.cases)
    });
    setFormData({
      disease: '',
      city: '',
      cases: '',
      timestamp: new Date().toISOString().split('T')[0]
    });
    setCityQuery('');
    setShowSuggestions(false);
  };

  const handleReset = async () => {
    if (resetCommand === 'deletedata') {
      try {
        await axios.post('http://localhost:8000/api/reset', { command: resetCommand });
        alert('Database reset successful');
        setResetCommand('');
      } catch (error) {
        alert('Failed to reset database');
      }
    }
  };

  const handleCitySelect = (city: City) => {
    setFormData(prev => ({ ...prev, city: city.city }));
    setCityQuery(city.city);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Common Disease Outbreaks</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {COMMON_DISEASES.map((disease) => (
            <button
              key={disease.id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, disease: disease.name }))}
              className={`p-2 text-sm rounded-md text-left hover:bg-indigo-50 transition-colors
                ${formData.disease === disease.name ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'bg-gray-50'}`}
            >
              <div className="font-medium">{disease.name}</div>
              <div className="text-xs text-gray-500">{disease.description}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="disease" className="block text-sm font-medium text-gray-700">
            Disease
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="disease"
              value={formData.disease}
              onChange={(e) => setFormData(prev => ({ ...prev, disease: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              list="diseases"
            />
            <datalist id="diseases">
              {COMMON_DISEASES.map(disease => (
                <option key={disease.id} value={disease.name} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <div className="relative">
            <input
              type="text"
              id="city"
              value={cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              placeholder="Start typing to see Indian cities..."
              autoComplete="off"
              aria-expanded={showSuggestions}
              aria-controls="city-list"
              aria-haspopup="listbox"
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <ul
                id="city-list"
                role="listbox"
                className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
              >
                {suggestions.map((city) => (
                  <li
                    key={`${city.city}-${city.state}`}
                    role="option"
                    aria-selected={cityQuery === city.city}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCitySelect(city)}
                  >
                    <div className="px-4 py-2">
                      <div className="font-medium text-gray-900">{city.city}</div>
                      <div className="text-sm text-gray-500">{city.state}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="cases" className="block text-sm font-medium text-gray-700">
            Number of Cases
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="cases"
              value={formData.cases}
              onChange={(e) => setFormData(prev => ({ ...prev, cases: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="0"
            />
            {Number(formData.cases) > 1000 && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
          {Number(formData.cases) > 1000 && (
            <p className="mt-1 text-sm text-red-600">
              High number of cases - this will trigger a high severity alert
            </p>
          )}
        </div>

        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="timestamp"
            value={formData.timestamp}
            onChange={(e) => setFormData(prev => ({ ...prev, timestamp: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Report
        </button>
      </form>

      <div className="mt-8 pt-6 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Database Management</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={resetCommand}
            onChange={(e) => setResetCommand(e.target.value)}
            placeholder="Type 'deletedata' to reset"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          <button
            onClick={handleReset}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            disabled={resetCommand !== 'deletedata'}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}