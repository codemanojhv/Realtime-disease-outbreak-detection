import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DiseaseCase } from '../types';

interface MapProps {
  cases: DiseaseCase[];
}

interface AggregatedCase {
  city: string;
  lat: number;
  lng: number;
  diseases: {
    [key: string]: {
      cases: number;
      lastUpdate: string;
    };
  };
  totalCases: number;
}

const getSeverityColor = (cases: number): string => {
  if (cases > 1000) return '#ef4444';
  if (cases > 500) return '#eab308';
  return '#22c55e';
};

const getSeverityLabel = (cases: number): string => {
  if (cases > 1000) return 'High Risk';
  if (cases > 500) return 'Medium Risk';
  return 'Low Risk';
};

const aggregateCases = (cases: DiseaseCase[]): AggregatedCase[] => {
  const aggregated = cases.reduce((acc: { [key: string]: AggregatedCase }, curr) => {
    const key = `${curr.lat}-${curr.lng}`;  
    if (!acc[key]) {
      acc[key] = {
        city: curr.city,
        lat: curr.lat,
        lng: curr.lng,
        diseases: {},
        totalCases: 0
      };
    }
    
    if (!acc[key].diseases[curr.disease]) {
      acc[key].diseases[curr.disease] = {
        cases: 0,
        lastUpdate: curr.timestamp
      };
    }
    
    acc[key].diseases[curr.disease].cases += curr.cases;
    acc[key].diseases[curr.disease].lastUpdate = curr.timestamp;
    acc[key].totalCases += curr.cases;
    
    return acc;
  }, {});

  return Object.values(aggregated);
};

export default function Map({ cases }: MapProps) {
  const aggregatedCases = aggregateCases(cases);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="w-full h-[600px] rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {aggregatedCases.map((location) => (
        <CircleMarker
          key={`${location.lat}-${location.lng}`}
          center={[location.lat, location.lng]}
          radius={Math.min(25, Math.max(12, Math.log2(location.totalCases) * 2))}
          pathOptions={{
            color: getSeverityColor(location.totalCases),
            fillOpacity: 0.7,
            weight: 2
          }}
        >
          <Tooltip permanent>
            <span className="font-bold">{location.city}</span>
          </Tooltip>
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{location.city}</h3>
              <div className="space-y-3">
                {Object.entries(location.diseases).map(([disease, data]) => (
                  <div 
                    key={disease}
                    className="p-2 rounded bg-gray-50"
                  >
                    <p className="font-semibold text-gray-900">{disease}</p>
                    <p className="text-sm text-gray-600">Cases: {data.cases}</p>
                    <p className="text-xs text-gray-500">
                      Last Update: {new Date(data.lastUpdate).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <p className="font-bold">Total Cases: {location.totalCases}</p>
                  <p className="text-sm text-gray-600">
                    Status: {getSeverityLabel(location.totalCases)}
                  </p>
                </div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}