'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Navigation, Clock, ShieldCheck, MapPin, Truck, Radio } from 'lucide-react';

declare const google: any;

interface LiveTrackingMapProps {
  workerName: string;
  workerCategory: string;
  workerPhoto: string;
  customerAddress: string;
  customerCoords?: { lat: number; lng: number };
}

// Starting point: Swaraj Round South, Thrissur
const WORKER_START_COORDS = { lat: 10.5230, lng: 76.2144 };
// Default destination: Ayyanthole, Thrissur
const DEFAULT_CUSTOMER_COORDS = { lat: 10.5305, lng: 76.2045 };

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  workerName,
  workerCategory,
  workerPhoto,
  customerAddress,
  customerCoords = DEFAULT_CUSTOMER_COORDS,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const [etaMinutes, setEtaMinutes] = useState<number>(14);
  const [etaSeconds, setEtaSeconds] = useState<number>(30);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isArrived, setIsArrived] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  const googleMapRef = useRef<any>(null);
  const workerMarkerRef = useRef<any>(null);
  const routePathRef = useRef<any[]>([]);

  // Smooth Worker Route & Marker Animation (35 Seconds total duration)
  useEffect(() => {
    const totalDurationMs = 35000; // 35s animation
    const intervalMs = 250;
    const steps = totalDurationMs / intervalMs;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = Math.min((currentStep / steps) * 100, 100);
      setProgressPercent(percent);

      // Countdown ETA
      const totalInitialSeconds = 14 * 60 + 30; // 870s
      const remainingSecs = Math.max(0, Math.floor(totalInitialSeconds * (1 - percent / 100)));
      setEtaMinutes(Math.floor(remainingSecs / 60));
      setEtaSeconds(remainingSecs % 60);

      if (percent >= 100) {
        setIsArrived(true);
        clearInterval(timer);
      }

      // Update Real Google Maps Marker position if loaded
      if (routePathRef.current.length > 0 && workerMarkerRef.current) {
        const pathIndex = Math.floor((percent / 100) * (routePathRef.current.length - 1));
        const newPos = routePathRef.current[pathIndex];
        if (newPos) {
          workerMarkerRef.current.setPosition(newPos);
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, []);

  // Google Maps JS API + DirectionsService Setup
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    if (!apiKey || apiKey.includes('YOUR_GOOGLE_MAPS_API_KEY')) {
      setLoadError(true);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['routes', 'geometry'],
    });

    (loader as any)
      .load()
      .then(() => {
        if (!mapRef.current || typeof google === 'undefined') return;

        const map = new google.maps.Map(mapRef.current, {
          center: {
            lat: (WORKER_START_COORDS.lat + customerCoords.lat) / 2,
            lng: (WORKER_START_COORDS.lng + customerCoords.lng) / 2,
          },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });
        googleMapRef.current = map;

        // Customer Destination Marker
        new google.maps.Marker({
          position: customerCoords,
          map,
          title: `Customer Home (${customerAddress})`,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });

        // Worker Moving Marker (Person/Vehicle custom icon)
        const workerMarker = new google.maps.Marker({
          position: WORKER_START_COORDS,
          map,
          title: `${workerName} (${workerCategory})`,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          },
        });
        workerMarkerRef.current = workerMarker;

        // Directions API Route Calculation
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: WORKER_START_COORDS,
            destination: customerCoords,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === 'OK' && result && result.routes[0]) {
              const route = result.routes[0];
              const overviewPath = route.overview_path;
              routePathRef.current = overviewPath;

              // Render Directions Polyline with Daily Connect Green
              new google.maps.Polyline({
                path: overviewPath,
                geodesic: true,
                strokeColor: '#1F4E45',
                strokeOpacity: 0.85,
                strokeWeight: 5,
                map,
              });

              // Fit bounds to encompass entire route
              const bounds = new google.maps.LatLngBounds();
              overviewPath.forEach((pt: any) => bounds.extend(pt));
              map.fitBounds(bounds);
            }
          }
        );
      })
      .catch((err: any) => {
        console.warn('Google Maps directions loader fallback:', err);
        setLoadError(true);
      });
  }, [customerCoords, customerAddress, workerName, workerCategory]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md overflow-hidden space-y-4">
      
      {/* Top Tracking Status Header */}
      <div className="bg-[#1F4E45] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white/10 shrink-0 border border-white/20">
            <img src={workerPhoto} alt={workerName} className="w-full h-full object-cover" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-[#E8A33D] rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E8A33D] uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#E8A33D] animate-pulse" /> Live Tracking
              </span>
              <span className="text-[11px] text-emerald-100/80">• Thrissur, Kerala</span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              {workerName} is en route to your location
            </h3>
          </div>
        </div>

        {/* ETA Counter Badge */}
        <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center shrink-0 w-full sm:w-auto">
          <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider block">Estimated Arrival</span>
          <span className="text-xl font-black text-[#E8A33D] flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-[#E8A33D]" />
            {isArrived ? (
              <span className="text-emerald-300">Arrived at Gate!</span>
            ) : (
              <span>{etaMinutes}m {etaSeconds.toString().padStart(2, '0')}s</span>
            )}
          </span>
        </div>

      </div>

      {/* Embedded Live Map Display */}
      <div className="relative h-80 bg-[#F7F7F5] border-y border-gray-200">
        
        {/* Real Google Map Canvas */}
        <div ref={mapRef} className={`w-full h-full ${loadError ? 'hidden' : 'block'}`} />

        {/* Animated Fallback Route Map View */}
        {loadError && (
          <div className="w-full h-full bg-[#EAF3F0] p-6 relative flex flex-col justify-between overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#1F4E45_2px,transparent_2px)] [background-size:20px_20px]" />

            {/* Simulated Animated Polyline */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#1F4E45] stroke-[4] fill-none">
              <path
                d="M 60 220 Q 200 120 400 160 T 700 80"
                strokeDasharray="8 4"
                className="animate-pulse"
              />
            </svg>

            {/* Worker Animated Marker */}
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 transition-all duration-300 z-10"
              style={{ left: `calc(${progressPercent}% * 0.85 + 20px)` }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-[#1F4E45] text-[#E8A33D] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-[#E8A33D]/30 whitespace-nowrap mb-1">
                  🚚 {workerName} ({workerCategory})
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1F4E45] text-white flex items-center justify-center shadow-lg border-2 border-[#E8A33D] animate-bounce">
                  <Truck className="w-4 h-4 text-[#E8A33D]" />
                </div>
              </div>
            </div>

            {/* Destination Customer Pin */}
            <div className="absolute top-12 right-12 z-10 flex flex-col items-center">
              <div className="bg-white text-[#2A2A2A] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-gray-200 mb-1">
                🏠 Customer Destination (Ayyanthole)
              </div>
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>
        )}

        {/* Live Route Progress Bar */}
        <div className="absolute bottom-3 left-4 right-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-gray-200 shadow-md flex items-center justify-between text-xs font-bold text-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#1F4E45]" />
            <span>Route: Swaraj Round South → {customerAddress.split(',')[0]}</span>
          </div>

          <div className="w-32 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#E8A33D] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Bottom Live Note */}
      <div className="px-6 pb-5 flex items-center justify-between text-xs text-[#8A8F8C]">
        <span className="flex items-center gap-1.5 font-semibold text-[#1F4E45]">
          <ShieldCheck className="w-4 h-4" /> Real-time Directions API route tracking enabled
        </span>
        <span>Speed: 28 km/h</span>
      </div>

    </div>
  );
};
