import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Report } from '../types';
import { MADALENA_COORDS } from '../data/mockData';

interface InteractiveMapProps {
  reports?: Report[];
  selectedLat?: number;
  selectedLng?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  isPickerMode?: boolean;
  onSelectReport?: (report: Report) => void;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  reports = [],
  selectedLat = MADALENA_COORDS.lat,
  selectedLng = MADALENA_COORDS.lng,
  onLocationSelect,
  isPickerMode = false,
  onSelectReport,
  height = '360px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedLat, selectedLng],
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      markerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Handle picker mode
    if (isPickerMode) {
      if (!pickerMarkerRef.current) {
        const pickerIcon = L.divIcon({
          className: 'custom-picker-icon',
          html: `<div style="background-color: #FF8C00; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                  <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
                </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([selectedLat, selectedLng], {
          draggable: true,
          icon: pickerIcon
        }).addTo(map);

        marker.on('dragend', () => {
          const position = marker.getLatLng();
          if (onLocationSelect) {
            onLocationSelect(position.lat, position.lng);
          }
        });

        pickerMarkerRef.current = marker;
      } else {
        pickerMarkerRef.current.setLatLng([selectedLat, selectedLng]);
      }

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (pickerMarkerRef.current) {
          pickerMarkerRef.current.setLatLng([lat, lng]);
        }
        if (onLocationSelect) {
          onLocationSelect(lat, lng);
        }
      });
    }

    // Render report markers if not in picker mode
    if (!isPickerMode && markerGroupRef.current) {
      markerGroupRef.current.clearLayers();

      reports.forEach((report) => {
        const { lat, lng } = report.location;
        if (!lat || !lng) return;

        let markerColor = '#0F8A43'; // resolvida
        if (report.status === 'recebida') markerColor = '#3182CE';
        if (report.status === 'em_analise' || report.status === 'encaminhada') markerColor = '#DD6B20';
        if (report.status === 'em_atendimento') markerColor = '#FF8C00';

        const customIcon = L.divIcon({
          className: 'custom-report-icon',
          html: `<div style="background-color: ${markerColor}; color: white; border-radius: 50%; padding: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-weight: bold; font-size: 11px;">
                  📍
                </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const reportMarker = L.marker([lat, lng], { icon: customIcon });
        
        const popupContent = `
          <div style="font-family: Poppins, sans-serif; padding: 4px; max-width: 200px;">
            <div style="font-size: 11px; color: #666; font-weight: bold;">${report.protocol}</div>
            <div style="font-size: 13px; font-weight: 600; margin-top: 2px; color: #1e293b;">${report.location.neighborhood}</div>
            <p style="font-size: 12px; margin: 4px 0; color: #475569; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${report.description}</p>
            <span style="display: inline-block; font-size: 10px; padding: 2px 6px; border-radius: 4px; background: ${markerColor}; color: white; margin-top: 4px;">
              ${report.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        `;

        reportMarker.bindPopup(popupContent);
        reportMarker.on('click', () => {
          if (onSelectReport) onSelectReport(report);
        });

        reportMarker.addTo(markerGroupRef.current!);
      });
    }

    return () => {
      // Clean up map on unmount if needed
    };
  }, [reports, isPickerMode, selectedLat, selectedLng]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      {isPickerMode && (
        <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 shadow border border-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF8C00] animate-ping" />
          Clique ou arraste o pino para indicar a localização exata
        </div>
      )}
    </div>
  );
};
