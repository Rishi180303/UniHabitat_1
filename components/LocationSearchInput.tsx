import React, { useRef, useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useLoadScript, Libraries } from '@react-google-maps/api';

interface LocationSearchInputProps {
  value: string;
  onSelect: (address: string, latLng: { lat: number; lng: number }) => void;
  apiKey: string;
}

const libraries: Libraries = ['places'];

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ value, onSelect, apiKey }) => {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries });
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteService = useRef<any>(null);
  const geocoder = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Remove geolocation state and logic

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
      geocoder.current = new (window as any).google.maps.Geocoder();
    }
  }, [isLoaded]);

  const fetchSuggestions = (input: string) => {
    if (!autocompleteService.current || !input) {
      setSuggestions([]);
      return;
    }
    autocompleteService.current.getPlacePredictions({ input }, (predictions: any[]) => {
      setSuggestions(predictions || []);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setShowDropdown(true);
    fetchSuggestions(val);
    onSelect(val, { lat: 0, lng: 0 });
  };

  const handleSelect = (suggestion: any) => {
    setInputValue(suggestion.description);
    setShowDropdown(false);
    setSuggestions([]);
    // Geocode to get lat/lng
    if (geocoder.current) {
      geocoder.current.geocode({ placeId: suggestion.place_id }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          onSelect(suggestion.description, { lat: location.lat(), lng: location.lng() });
        } else {
          onSelect(suggestion.description, { lat: 0, lng: 0 });
        }
      });
    } else {
      onSelect(suggestion.description, { lat: 0, lng: 0 });
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100); // Delay to allow click
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      handleSelect(suggestions[activeIndex]);
    }
  };

  // Remove handleUseCurrentLocation and related state

  if (!isLoaded) {
    return <input type="text" value={inputValue} disabled placeholder="Loading..." className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200" />;
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => { setShowDropdown(true); fetchSuggestions(inputValue); }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search for an address..."
        className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200"
        autoComplete="off"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#F5E6D6] max-h-72 overflow-y-auto">
          {suggestions.map((suggestion, idx) => (
            <li
              key={suggestion.place_id}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-[#2C3E50] ${
                idx === activeIndex ? 'bg-[#F5E6D6] text-[#2C3E50] font-semibold' : 'hover:bg-[#FDF6ED]'
              }`}
              onMouseDown={() => handleSelect(suggestion)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <MapPin className="w-5 h-5 text-[#BFAE9B]" />
              <span className="truncate">{suggestion.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearchInput; 