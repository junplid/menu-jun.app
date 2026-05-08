import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Popup,
} from "react-leaflet";
import { divIcon, LatLng, LatLngExpression } from "leaflet";
import { memo, RefObject, useContext, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

import { renderToString } from "react-dom/server";
import { IoStorefront } from "react-icons/io5";
import { DataMenuContext } from "@contexts/data-menu.context";
import { point, distance } from "@turf/turf";

export function isWithinDeliveryArea(
  store: { lng: number; lat: number; max_distance_km?: number | null },
  customer: { lng: number; lat: number },
) {
  const storeLat = Number(store.lat);
  const storeLng = Number(store.lng);
  const customerLat = Number(customer.lat);
  const customerLng = Number(customer.lng);
  const values = [storeLat, storeLng, customerLat, customerLng];

  const isValid = values.every((v) => Number.isFinite(v));

  if (!isValid) {
    return {
      distanceKm: null,
      isInside: false,
    };
  }

  const from = point([storeLng, storeLat]);
  const to = point([customerLng, customerLat]);

  const km = distance(from, to, { units: "kilometers" });

  return {
    distanceKm: km,
    isInside: store.max_distance_km ? km <= store.max_distance_km : true,
  };
}

const customIcon = divIcon({
  html: `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center; 
    "
    >
      ${renderToString(<IoStorefront size={23} color="#ffffff" />)}
    </div>
  `,
  className:
    "bg-red-600 flex items-center p-0.5 h-[28px]! w-[28px]! rounded-sm", // remove estilo padrão
  iconSize: [23, 23],
  iconAnchor: [13, 23],
  popupAnchor: [0, -23],
});

function areEqual(prev: Props, next: Props) {
  return (
    prev.isEdit === next.isEdit && prev.defaultPosition === next.defaultPosition
  );
}

function AdjustMap({ position, isfly }: any) {
  const map = useMap();
  const refIsFly = useRef(false);

  useEffect(() => {
    if (!map || refIsFly.current) return;
    if (!position) return;

    const lat = Number(position.lat);
    const lng = Number(position.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    requestAnimationFrame(() => {
      refIsFly.current = true;

      const coords: LatLngExpression = [lat, lng];

      if (isfly) {
        map.flyTo(coords, 16);
      } else {
        map.setView(coords, map.getZoom());
      }
    });
  }, [position, map]);

  return null;
}

function LocationStoreMarker({
  position,
  markerRef,
}: {
  position: LatLng | null;
  markerRef: RefObject<any>;
}) {
  const { titlePage } = useContext(DataMenuContext);
  return position ? (
    <Marker
      icon={customIcon}
      ref={markerRef}
      position={position}
      draggable={true}
    >
      <Popup>
        <strong className="font-semibold leading-4">{titlePage}</strong>
      </Popup>
    </Marker>
  ) : null;
}

function MapCenterTracker({ markerRef, onSetPosition }: any) {
  const map = useMap();
  useMapEvents({
    moveend() {
      markerRef?.current?.closePopup();
      onSetPosition(map.getCenter());
    },
  });

  return null;
}

function FixMap() {
  const map = useMap();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    const container = map.getContainer();
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [map]);

  return null;
}

interface Props {
  isEdit: boolean;
  defaultPosition?: {
    lat: number;
    lng: number;
  };
  onSetPosition(position: { lat: number; lng: number }): void;
}

export const MapComponent = memo(function MapComponent(props: Props) {
  const markerRef = useRef<any>(null);
  const { info } = useContext(DataMenuContext);

  if (!info) return null;

  const lat = Number(info.lat);
  const lng = Number(info.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const isValidCoords = Number.isFinite(lat) && Number.isFinite(lng);

  return (
    <div className="relative w-full min-h-52.5! rounded-md overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-1000">
        <svg
          className="-translate-y-2.5"
          width="16"
          height="31"
          viewBox="0 0 16 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.198 11.1564C6.198 10.3007 6.89173 9.60693 7.7475 9.60693V9.60693C8.60326 9.60693 9.297 10.3007 9.297 11.1564V29.2856C9.297 30.1413 8.60326 30.8351 7.7475 30.8351V30.8351C6.89173 30.8351 6.198 30.1413 6.198 29.2856V11.1564Z"
            fill="url(#paint0_linear_11_8)"
          />
          <ellipse
            cx="7.74749"
            cy="7.74749"
            rx="7.74749"
            ry="7.74749"
            fill="url(#paint1_linear_11_8)"
          />
          <ellipse
            opacity="0.5"
            cx="4.46634"
            cy="3.72105"
            rx="2.29585"
            ry="1.31707"
            transform="rotate(-39.7961 4.46634 3.72105)"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_11_8"
              x1="7.7475"
              y1="9.60693"
              x2="7.7475"
              y2="30.8351"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#555555" />
              <stop offset="1" stop-color="#D9D9D9" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_11_8"
              x1="11.7762"
              y1="-2.26091e-07"
              x2="-4.04975e-07"
              y2="13.3257"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF0000" />
              <stop offset="1" stop-color="#990000" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {isValidCoords && (
        <>
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            style={{ height: "calc(100vh - 185px)", width: "100%" }}
            zoomControl={false}
            className="rounded-2xl!"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {isValidCoords && (
              <>
                <LocationStoreMarker
                  markerRef={markerRef}
                  position={{ lat, lng } as LatLng}
                />
              </>
            )}

            <AdjustMap
              position={props.defaultPosition}
              isfly={!props.defaultPosition}
            />
            <MapCenterTracker
              onSetPosition={props.onSetPosition}
              markerRef={markerRef}
            />
            <FixMap />
          </MapContainer>
        </>
      )}
    </div>
  );
}, areEqual);
