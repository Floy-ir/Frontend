"use client"

import "leaflet/dist/leaflet.css"
import "@/styles/leaflet-custom.css"

import L from "leaflet"
import { useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"

import type { Location, TripPlan } from "@/app/types/trip"

// Fix for default marker icons in react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

type TripMapProps = {
  tripPlan: TripPlan
}

function MapBounds({ locations }: { locations: Location[] }) {
  const map = useMap()

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [locations, map])

  return null
}

export function TripMap({ tripPlan }: TripMapProps) {
  // Extract all locations from the trip plan
  const locations: Location[] = []

  tripPlan.days.forEach((day) => {
    day.activities.forEach((activity) => {
      if (activity.type === "destination" && activity.location) {
        locations.push({ ...activity.location, name: activity.name })
      } else if (activity.type === "accommodation" && activity.location) {
        locations.push({ ...activity.location, name: activity.name })
      } else if (activity.type === "attraction" && activity.location) {
        locations.push({ ...activity.location, name: activity.name })
      }
    })
  })

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-200">
      <MapContainer
        center={[tripPlan.mainLocation.lat, tripPlan.mainLocation.lng]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location, index) => (
          <Marker key={index} position={[location.lat, location.lng]}>
            <Popup>
              <div className="font-anjoman-max text-sm" dir="rtl">
                {location.name}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBounds locations={locations} />
      </MapContainer>

      {/* Modify Route Button Overlay */}
      <button
        className="text-Gray-N800 focus:ring-Primary-P500main absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-lg bg-white px-4 py-2 font-anjoman-max text-sm font-medium shadow-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
        aria-label="تغییر مسیر"
      >
        تغییر مسیر
      </button>
    </div>
  )
}
