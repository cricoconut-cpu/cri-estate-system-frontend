import { useEffect, useMemo, useState } from "react";

import {
  CircleMarker,
  ImageOverlay,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import proj4 from "proj4";

import "leaflet/dist/leaflet.css";

/*
|--------------------------------------------------------------------------
| Tree health configuration
|--------------------------------------------------------------------------
*/

const HEALTH_CONFIG = {
  Healthy: {
    color: "#16a34a",
    label: "Healthy",
  },

  Moderate: {
    color: "#eab308",
    label: "Moderate",
  },

  "Mild Stress": {
    color: "#f97316",
    label: "Mild Stress",
  },

  "Severe Stress": {
    color: "#ef4444",
    label: "Severe Stress",
  },

  Critical: {
    color: "#991b1b",
    label: "Critical",
  },
};

/*
|--------------------------------------------------------------------------
| Initial checkbox state
|--------------------------------------------------------------------------
*/

const INITIAL_FILTERS = {
  Healthy: true,
  Moderate: true,
  "Mild Stress": true,
  "Severe Stress": true,
  Critical: true,
};

/*
|--------------------------------------------------------------------------
| Fit map to survey bounds
|--------------------------------------------------------------------------
*/

const MapBoundsController = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!bounds) {
      return;
    }

    const mapBounds = L.latLngBounds(
      [bounds.south, bounds.west],
      [bounds.north, bounds.east],
    );

    map.fitBounds(mapBounds, {
      padding: [30, 30],
    });
  }, [map, bounds]);

  return null;
};

/*
|--------------------------------------------------------------------------
| Survey Map
|--------------------------------------------------------------------------
*/

const SurveyMap = ({ imageUrl, geoJsonUrl, bounds }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const [geoJsonLoading, setGeoJsonLoading] = useState(false);

  const [geoJsonError, setGeoJsonError] = useState("");

  const [imageError, setImageError] = useState(false);

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /*
  |--------------------------------------------------------------------------
  | Map bounds
  |--------------------------------------------------------------------------
  */

  const mapBounds = useMemo(() => {
    if (!bounds) {
      return null;
    }

    return [
      [bounds.south, bounds.west],
      [bounds.north, bounds.east],
    ];
  }, [bounds]);

  /*
  |--------------------------------------------------------------------------
  | Load GeoJSON
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!geoJsonUrl) {
      setGeoJsonData(null);
      return;
    }

    const loadGeoJson = async () => {
      try {
        setGeoJsonLoading(true);
        setGeoJsonError("");

        const response = await fetch(geoJsonUrl);

        if (!response.ok) {
          throw new Error(`GeoJSON request failed: ${response.status}`);
        }

        const data = await response.json();

        setGeoJsonData(data);
      } catch (error) {
        console.error("GeoJSON loading error:", error);

        setGeoJsonError(error.message || "Failed to load GeoJSON.");
      } finally {
        setGeoJsonLoading(false);
      }
    };

    loadGeoJson();
  }, [geoJsonUrl]);

  /*
  |--------------------------------------------------------------------------
  | Convert EPSG:3857 → EPSG:4326
  |--------------------------------------------------------------------------
  */

  const treePoints = useMemo(() => {
    if (!geoJsonData?.features) {
      return [];
    }

    return geoJsonData.features
      .filter((feature) => feature.geometry?.type === "Point")
      .map((feature) => {
        const coordinates = feature.geometry.coordinates;

        if (!Array.isArray(coordinates) || coordinates.length < 2) {
          return null;
        }

        const x = Number(coordinates[0]);
        const y = Number(coordinates[1]);

        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          return null;
        }

        /*
         * GeoJSON coordinates:
         *
         * [X, Y]
         *
         * EPSG:3857
         *
         * Convert to:
         *
         * [longitude, latitude]
         *
         * EPSG:4326
         */

        const [longitude, latitude] = proj4("EPSG:3857", "EPSG:4326", [x, y]);

        return {
          ...feature,

          latitude,
          longitude,

          properties: feature.properties || {},
        };
      })
      .filter(Boolean);
  }, [geoJsonData]);

  /*
  |--------------------------------------------------------------------------
  | Visible tree points
  |--------------------------------------------------------------------------
  */

  const visibleTrees = useMemo(() => {
    return treePoints.filter((tree) => {
      const health = tree.properties?.NDVI_Class;

      return filters[health] === true;
    });
  }, [treePoints, filters]);

  /*
  |--------------------------------------------------------------------------
  | Toggle health filter
  |--------------------------------------------------------------------------
  */

  const handleFilterChange = (health) => {
    setFilters((current) => ({
      ...current,
      [health]: !current[health],
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Select / deselect all
  |--------------------------------------------------------------------------
  */

  const allSelected = Object.values(filters).every(Boolean);

  const noneSelected = Object.values(filters).every((value) => !value);

  const handleSelectAll = () => {
    const newValue = !allSelected;

    setFilters({
      Healthy: newValue,
      Moderate: newValue,
      "Mild Stress": newValue,
      "Severe Stress": newValue,
      Critical: newValue,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | No bounds
  |--------------------------------------------------------------------------
  */

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

  if (!mapBounds) {
    return null;
  }

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
      {/* =========================================================
          MAP HEADER
      ========================================================== */}

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
          Tree health distribution and orthomosaic imagery
        </p>
      </div>

      {/* =========================================================
          TREE FILTER PANEL
      ========================================================== */}

      <div
        className="
          border-b
          bg-slate-50
          px-6
          py-4
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Title */}

          <div>
            <p
              className="
                text-sm
                font-semibold
                text-slate-800
              "
            >
              Tree Health
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Showing {visibleTrees.length.toLocaleString()} of{" "}
              {treePoints.length.toLocaleString()} trees
            </p>
          </div>

          {/* Filters */}

          <div
            className="
              flex
              flex-wrap
              gap-x-5
              gap-y-3
            "
          >
            {/* All Trees */}

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-2
                text-sm
                font-medium
                text-slate-700
              "
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="
                  h-4
                  w-4
                  rounded
                  border-slate-300
                  text-green-600
                  focus:ring-green-500
                "
              />
              All Trees
            </label>

            {/* Individual health filters */}

            {Object.entries(HEALTH_CONFIG).map(([health, config]) => (
              <label
                key={health}
                className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2
                    text-sm
                    text-slate-700
                  "
              >
                <input
                  type="checkbox"
                  checked={filters[health]}
                  onChange={() => handleFilterChange(health)}
                  className="
                      h-4
                      w-4
                      rounded
                      border-slate-300
                      focus:ring-green-500
                    "
                />

                <span
                  className="
                      h-3
                      w-3
                      rounded-full
                    "
                  style={{
                    backgroundColor: config.color,
                  }}
                />

                {config.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          MAP
      ========================================================== */}

      <div
        className="
          relative
          h-[600px]
          w-full
        "
      >
        <MapContainer
          bounds={mapBounds}
          className="h-full w-full"
          scrollWheelZoom={true}
          minZoom={10}
          maxZoom={22}
        >
          {/* =====================================================
              SATELLITE BASEMAP
          ====================================================== */}

          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          {/* =====================================================
              ORTHOMOSAIC
          ====================================================== */}

          {imageUrl && !imageError && (
            <ImageOverlay
              url={imageUrl}
              bounds={mapBounds}
              opacity={0.65}
              zIndex={10}
              eventHandlers={{
                load: () => {
                  console.log("Orthomosaic loaded successfully.");
                },

                error: () => {
                  console.error("Orthomosaic failed to load:", imageUrl);

                  setImageError(true);
                },
              }}
            />
          )}

          {/* =====================================================
              TREE POINTS
          ====================================================== */}

          {visibleTrees.map((tree) => {
            const properties = tree.properties || {};

            const health = properties.NDVI_Class;

            const config = HEALTH_CONFIG[health];

            const color = config?.color || "#64748b";

            return (
              <CircleMarker
                key={properties.Id ?? `${tree.latitude}-${tree.longitude}`}
                center={[tree.latitude, tree.longitude]}
                radius={5}
                pathOptions={{
                  color: "#ffffff",
                  weight: 1,
                  fillColor: color,
                  fillOpacity: 0.95,
                }}
              >
                <Popup>
                  <div
                    className="
                      min-w-[220px]
                    "
                  >
                    <h3
                      className="
                        mb-3
                        text-base
                        font-semibold
                        text-slate-900
                      "
                    >
                      Tree #{properties.Id ?? "-"}
                    </h3>

                    <div
                      className="
                        space-y-2
                        text-sm
                      "
                    >
                      <div>
                        <span
                          className="
                            font-medium
                            text-slate-500
                          "
                        >
                          Estate:
                        </span>

                        <span className="ml-2">
                          {properties.StateName || "-"}
                        </span>
                      </div>

                      <div>
                        <span
                          className="
                            font-medium
                            text-slate-500
                          "
                        >
                          Health:
                        </span>

                        <span
                          className="
                            ml-2
                            font-semibold
                          "
                          style={{
                            color,
                          }}
                        >
                          {properties.NDVI_Class || "-"}
                        </span>
                      </div>

                      <div>
                        <span
                          className="
                            font-medium
                            text-slate-500
                          "
                        >
                          NDVI Value:
                        </span>

                        <span className="ml-2">
                          {properties.NDVI_Value ?? "-"}
                        </span>
                      </div>

                      <div>
                        <span
                          className="
                            font-medium
                            text-slate-500
                          "
                        >
                          NDVI No:
                        </span>

                        <span className="ml-2">
                          {properties.NDVI_No ?? "-"}
                        </span>
                      </div>

                      <div>
                        <span
                          className="
                            font-medium
                            text-slate-500
                          "
                        >
                          Latitude:
                        </span>

                        <span className="ml-2">{tree.latitude.toFixed(7)}</span>
                      </div>

                      <div>
                        <span
                          className="
                            font-medium
                            text-slate-500
                          "
                        >
                          Longitude:
                        </span>

                        <span className="ml-2">
                          {tree.longitude.toFixed(7)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* =====================================================
              MAP BOUNDS
          ====================================================== */}

          <MapBoundsController bounds={bounds} />
        </MapContainer>

        {/* =======================================================
            GEOJSON LOADING
        ======================================================== */}

        {geoJsonLoading && (
          <div
            className="
              absolute
              left-4
              top-4
              z-[1000]
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

        {/* =======================================================
            GEOJSON ERROR
        ======================================================== */}

        {geoJsonError && (
          <div
            className="
              absolute
              left-4
              top-4
              z-[1000]
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

        {/* =======================================================
            IMAGE ERROR
        ======================================================== */}

        {imageError && (
          <div
            className="
              absolute
              bottom-4
              left-4
              z-[1000]
              rounded-lg
              bg-red-50
              px-4
              py-2
              text-sm
              text-red-600
              shadow
            "
          >
            Orthomosaic image failed to load.
          </div>
        )}

        {/* =======================================================
            LEGEND
        ======================================================== */}

        <div
          className="
            absolute
            bottom-4
            right-4
            z-[1000]
            rounded-lg
            bg-white
            p-4
            shadow-lg
          "
        >
          <p
            className="
              mb-3
              text-sm
              font-semibold
              text-slate-800
            "
          >
            Tree Health
          </p>

          <div className="space-y-2">
            {Object.entries(HEALTH_CONFIG).map(([health, config]) => (
              <div
                key={health}
                className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-slate-700
                  "
              >
                <span
                  className="
                      h-3
                      w-3
                      rounded-full
                      border
                      border-white
                      shadow-sm
                    "
                  style={{
                    backgroundColor: config.color,
                  }}
                />

                {config.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyMap;
