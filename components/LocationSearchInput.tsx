import React, { useRef } from 'react';
import { GoogleMap, useLoadScript, StandaloneSearchBox, Libraries } from '@react-google-maps/api';

interface LocationSearchInputProps {
  value: string;
  onSelect: (address: string, latLng: { lat: number; lng: number }) => void;
  apiKey: string;
}

const libraries: Libraries = ['places'];

const containerStyle = {
  width: '0',
  height: '0',
};

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ value, onSelect, apiKey }) => {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries });
  const searchBoxRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const address = place.formatted_address || place.name;
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      if (address && lat && lng) {
        onSelect(address, { lat, lng });
      }
    }
  };

  if (!isLoaded) {
    return <input type="text" value={value} disabled placeholder="Loading..." className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200" />;
  }

  return (
    <>
      {/* Hidden map for SearchBox context (required by Google API) */}
      <div style={{ display: 'none' }}>
        <GoogleMap mapContainerStyle={containerStyle} center={{ lat: 0, lng: 0 }} zoom={1} />
      </div>
      <StandaloneSearchBox
        onLoad={ref => (searchBoxRef.current = ref)}
        onPlacesChanged={handlePlacesChanged}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onSelect(e.target.value, { lat: 0, lng: 0 })}
          placeholder="Search for an address..."
          className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200"
        />
      </StandaloneSearchBox>
    </>
  );
};

export default LocationSearchInput; 