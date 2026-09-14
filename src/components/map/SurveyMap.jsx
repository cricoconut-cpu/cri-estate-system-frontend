import { useEffect, useState } from "react";

import {
    GeoJSON,
    ImageOverlay,
    MapContainer,
    TileLayer,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const FitBounds = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!bounds) {
      return;
    }

    const leafletBounds = L.latLngBounds(
      [bounds.south, bounds.west],
      [bounds.north, bounds.east],
    );

    map.fitBounds(leafletBounds, {
      padding: [20, 20],
    });
  }, [map, bounds]);

  return null;
};

const SurveyMap = ({ imageUrl, geoJsonUrl, bounds }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const [geoJsonLoading, setGeoJsonLoading] = useState(false);

  const [geoJsonError, setGeoJsonError] = useState("");

  useEffect(() => {
    const loadGeoJson = async () => {
      if (!geoJsonUrl) {
        return;
      }

      try {
        setGeoJsonLoading(true);

        setGeoJsonError("");

        const response = await fetch(geoJsonUrl);

        if (!response.ok) {
          throw new Error("Failed to load GeoJSON.");
        }

        const data = await response.json();

        setGeoJsonData(data);
      } catch (error) {
        setGeoJsonError(error.message);
      } finally {
        setGeoJsonLoading(false);
      }
    };

    loadGeoJson();
  }, [geoJsonUrl]);

  if (!bounds) {
    return (
      <div
        className="
          rounded-xl
          border
          bg-white
          p-6
          text-slate-500
        "
      >
        Spatial bounds are not available.
      </div>
    );
  }

  const leafletBounds = [
    [bounds.south, bounds.west],

    [bounds.north, bounds.east],
  ];

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          border-b
          px-6
          py-4
        "
      >
        <h2
          className="
            text-xl
            font-semibold
            text-slate-900
          "
        >
          Estate Survey Map
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Orthomosaic and tree locations
        </p>
      </div>

      <div
        className="
          relative
          h-[600px]
          w-full
        "
      >
        <MapContainer
          bounds={leafletBounds}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          {/* Base map */}

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Orthomosaic */}

          {imageUrl && (
            <ImageOverlay
              url={imageUrl}
              bounds={leafletBounds}
              opacity={0.85}
            />
          )}

          {/* Tree GeoJSON */}

          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={() => ({
                weight: 1,

                fillOpacity: 0.7,
              })}
              onEachFeature={(feature, layer) => {
                const properties = feature.properties || {};

                const popupContent = `

                  <div>

                    <strong>
                      Tree Information
                    </strong>

                    <br />

                    ${Object.entries(properties)
                      .map(
                        ([key, value]) => `<strong>${key}:</strong> ${value}`,
                      )
                      .join("<br />")}

                  </div>

                `;

                layer.bindPopup(popupContent);
              }}
            />
          )}

          <FitBounds bounds={bounds} />
        </MapContainer>

        {geoJsonLoading && (
          <div
            className="
              absolute
              left-4
              top-4
              rounded-lg
              bg-white
              px-4
              py-2
              text-sm
              shadow
            "
          >
            Loading tree data...
          </div>
        )}

        {geoJsonError && (
          <div
            className="
              absolute
              left-4
              top-4
              rounded-lg
              bg-red-50
              px-4
              py-2
              text-sm
              text-red-600
              shadow
            "
          >
            {geoJsonError}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyMap;
