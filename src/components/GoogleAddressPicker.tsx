'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from 'lucide-react';

declare const google: any;

interface GoogleAddressPickerProps {
  value: string;
  coordinates?: { lat: number; lng: number };
  onChange: (address: string, coordinates: { lat: number; lng: number }) => void;
}

// Default Thrissur, Kerala center (Ayyanthole)
const DEFAULT_THRISSUR_CENTER = { lat: 10.5305, lng: 76.2045 };

export const GoogleAddressPicker: React.FC<GoogleAddressPickerProps> = ({
  value,
  coordinates = DEFAULT_THRISSUR_CENTER,
  onChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<string>(value);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(coordinates);

  const googleMapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  useEffect(() => {
    setCurrentAddress(value);
  }, [value]);

  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng) {
      setCurrentCoords(coordinates);
    }
  }, [coordinates]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    // If placeholder or empty API key, trigger fallback mode
    if (!apiKey || apiKey.includes('YOUR_GOOGLE_MAPS_API_KEY')) {
      setLoadError(true);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    (loader as any)
      .load()
      .then(() => {
        setMapLoaded(true);

        if (!mapRef.current || typeof google === 'undefined') return;

        // Initialize Google Map centered at Thrissur
        const map = new google.maps.Map(mapRef.current, {
          center: currentCoords,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });
        googleMapInstanceRef.current = map;

        // Draggable Pin Marker
        const marker = new google.maps.Marker({
          position: currentCoords,
          map,
          draggable: true,
          title: 'Drag pin to fine-tune address',
        });
        markerInstanceRef.current = marker;

        // Handle Pin Drag End
        marker.addListener('dragend', () => {
          const newPos = marker.getPosition();
          if (newPos) {
            const newCoords = { lat: newPos.lat(), lng: newPos.lng() };
            setCurrentCoords(newCoords);

            // Reverse Geocode
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: newCoords }, (results: any, status: any) => {
              if (status === 'OK' && results && results[0]) {
                const formattedAddress = results[0].formatted_address;
                setCurrentAddress(formattedAddress);
                onChange(formattedAddress, newCoords);
              } else {
                onChange(currentAddress, newCoords);
              }
            });
          }
        });

        // Initialize Google Places Autocomplete (Biased to Thrissur, Kerala)
        if (inputRef.current) {
          const bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(10.4500, 76.1500), // SW Thrissur
            new google.maps.LatLng(10.6000, 76.3000)  // NE Thrissur
          );

          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            bounds,
            componentRestrictions: { country: 'in' },
            fields: ['formatted_address', 'geometry', 'name'],
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
              const newCoords = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };

              const newAddr = place.formatted_address || place.name || currentAddress;

              setCurrentCoords(newCoords);
              setCurrentAddress(newAddr);
              onChange(newAddr, newCoords);

              if (googleMapInstanceRef.current && markerInstanceRef.current) {
                googleMapInstanceRef.current.setCenter(newCoords);
                googleMapInstanceRef.current.setZoom(16);
                markerInstanceRef.current.setPosition(newCoords);
              }
            }
          });
        }
      })
      .catch((err: any) => {
        console.warn('Google Maps API load fallback:', err);
        setLoadError(true);
      });
  }, []);

  const handleManualLocationClick = (locName: string, lat: number, lng: number) => {
    const fullAddr = `${locName}, Thrissur, Kerala`;
    const coords = { lat, lng };
    setCurrentAddress(fullAddr);
    setCurrentCoords(coords);
    onChange(fullAddr, coords);

    if (googleMapInstanceRef.current && markerInstanceRef.current) {
      googleMapInstanceRef.current.setCenter(coords);
      markerInstanceRef.current.setPosition(coords);
    }
  };

  return (
    <div className="space-y-4">
      {/* Places Autocomplete Input */}
      <div>
        <label className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
          <span>Search Address in Thrissur, Kerala</span>
          <span className="text-[10px] text-[#1F4E45] lowercase font-semibold">Google Places Enabled</span>
        </label>
        
        <div className="relative">
          <MapPin className="w-4 h-4 text-[#1F4E45] absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 z-10" />
          <input
            ref={inputRef}
            type="text"
            value={currentAddress}
            onChange={(e) => {
              setCurrentAddress(e.target.value);
              onChange(e.target.value, currentCoords);
            }}
            placeholder="Search e.g. Ayyanthole, Round South, Punkunnam, Thrissur..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7F7F5] border border-gray-200 text-xs sm:text-sm font-semibold text-[#2A2A2A] focus:outline-none focus:border-[#1F4E45]"
          />
        </div>
      </div>

      {/* Thrissur Quick Location Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
        <span className="text-[#8A8F8C]">Thrissur Quick Pins:</span>
        <button
          type="button"
          onClick={() => handleManualLocationClick('Ayyanthole', 10.5305, 76.2045)}
          className="px-2.5 py-1 rounded-md bg-[#EAF3F0] text-[#1F4E45] hover:bg-[#1F4E45] hover:text-white transition-colors"
        >
          📍 Ayyanthole
        </button>
        <button
          type="button"
          onClick={() => handleManualLocationClick('Round South', 10.5230, 76.2144)}
          className="px-2.5 py-1 rounded-md bg-[#EAF3F0] text-[#1F4E45] hover:bg-[#1F4E45] hover:text-white transition-colors"
        >
          📍 Round South
        </button>
        <button
          type="button"
          onClick={() => handleManualLocationClick('Punkunnam', 10.5350, 76.2010)}
          className="px-2.5 py-1 rounded-md bg-[#EAF3F0] text-[#1F4E45] hover:bg-[#1F4E45] hover:text-white transition-colors"
        >
          📍 Punkunnam
        </button>
        <button
          type="button"
          onClick={() => handleManualLocationClick('Ollur', 10.4780, 76.2410)}
          className="px-2.5 py-1 rounded-md bg-[#EAF3F0] text-[#1F4E45] hover:bg-[#1F4E45] hover:text-white transition-colors"
        >
          📍 Ollur
        </button>
      </div>

      {/* Google Map / Interactive Pin Map Display */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-[#F7F7F5] h-60">
        
        {/* Real Google Map Canvas */}
        <div ref={mapRef} className={`w-full h-full ${loadError ? 'hidden' : 'block'}`} />

        {/* Fallback Map UI if API Key is not set */}
        {loadError && (
          <div className="w-full h-full bg-[#EAF3F0] p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#1F4E45_2px,transparent_2px)] [background-size:16px_16px]" />
            <div className="w-12 h-12 rounded-full bg-[#1F4E45] text-[#E8A33D] flex items-center justify-center shadow-md z-10">
              <MapPin className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="z-10 space-y-1">
              <h4 className="text-sm font-extrabold text-[#2A2A2A]">Interactive Pinpoint Map (Thrissur, Kerala)</h4>
              <p className="text-xs text-[#8A8F8C] max-w-sm">
                Coordinates: <span className="font-mono text-[#1F4E45] font-bold">{currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E</span>
              </p>
              <p className="text-[11px] text-[#10B981] font-semibold">
                ✓ Pin Dropped at {currentAddress.split(',')[0]}
              </p>
            </div>
          </div>
        )}

        {/* Draggable Badge Hint */}
        <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-[#1F4E45] shadow-xs border border-gray-200">
          🎯 Drag pin to fine-tune exact door location
        </div>
      </div>
    </div>
  );
};
