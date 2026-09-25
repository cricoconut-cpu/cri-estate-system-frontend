import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getEstates } from "../../services/estate.service";
import { createSurvey } from "../../services/survey.service";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const UploadSurvey = () => {
  const navigate = useNavigate();

  const [estates, setEstates] = useState([]);
  const [estateId, setEstateId] = useState("");
  const [year, setYear] = useState("");
  const [surveyDate, setSurveyDate] = useState("");

  const [geoJsonFile, setGeoJsonFile] = useState(null);
  const [orthomosaicFile, setOrthomosaicFile] = useState(null);
  const [boundsFile, setBoundsFile] = useState(null);

  const [loadingEstates, setLoadingEstates] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load estates
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadEstates = async () => {
      try {
        setLoadingEstates(true);
        setError("");

        const response = await getEstates();

        setEstates(response?.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load estates.",
        );
      } finally {
        setLoadingEstates(false);
      }
    };

    loadEstates();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Current year
  |--------------------------------------------------------------------------
  */

  const currentYear = new Date().getFullYear();

  /*
  |--------------------------------------------------------------------------
  | Selected estate
  |--------------------------------------------------------------------------
  */

  const selectedEstate = useMemo(() => {
    return estates.find(
      (estate) => String(estate.id || estate._id) === String(estateId),
    );
  }, [estates, estateId]);

  /*
  |--------------------------------------------------------------------------
  | File validation helpers
  |--------------------------------------------------------------------------
  */

  const validateFileSize = (file) => {
    if (!file) {
      return true;
    }

    return file.size <= MAX_FILE_SIZE;
  };

  const getExtension = (file) => {
    if (!file?.name) {
      return "";
    }

    const index = file.name.lastIndexOf(".");

    if (index === -1) {
      return "";
    }

    return file.name.slice(index).toLowerCase();
  };

  /*
  |--------------------------------------------------------------------------
  | Validate form
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    if (!estateId) {
      return "Please select an estate.";
    }

    if (!year) {
      return "Please enter the survey year.";
    }

    const numericYear = Number(year);

    if (!Number.isInteger(numericYear) || numericYear < 1900) {
      return "Please enter a valid survey year.";
    }

    if (!surveyDate) {
      return "Please select the survey date.";
    }

    if (!geoJsonFile) {
      return "Please select the tree GeoJSON file.";
    }

    if (!orthomosaicFile) {
      return "Please select the orthomosaic PNG image.";
    }

    if (!boundsFile) {
      return "Please select the bounds JSON file.";
    }

    const geoJsonExtension = getExtension(geoJsonFile);

    if (geoJsonExtension !== ".geojson" && geoJsonExtension !== ".json") {
      return "Tree data must be a .geojson or .json file.";
    }

    if (getExtension(orthomosaicFile) !== ".png") {
      return "Orthomosaic must be a .png file.";
    }

    if (getExtension(boundsFile) !== ".json") {
      return "Bounds must be a .json file.";
    }

    if (!validateFileSize(geoJsonFile)) {
      return "GeoJSON file exceeds the 100 MB limit.";
    }

    if (!validateFileSize(orthomosaicFile)) {
      return "Orthomosaic file exceeds the 100 MB limit.";
    }

    if (!validateFileSize(boundsFile)) {
      return "Bounds file exceeds the 100 MB limit.";
    }

    return "";
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      /*
       * These names MUST match the backend exactly.
       */

      formData.append("estateId", estateId);
      formData.append("year", year);
      formData.append("surveyDate", surveyDate);

      formData.append("geoJson", geoJsonFile);
      formData.append("orthomosaic", orthomosaicFile);
      formData.append("bounds", boundsFile);

      const response = await createSurvey(formData);

      const survey = response?.data;

      if (!survey?._id) {
        throw new Error("Survey was uploaded, but no survey ID was returned.");
      }

      setSuccess(response?.message || "Survey uploaded successfully.");

      /*
       * Go directly to the analysis page for
       * the uploaded/replaced survey.
       */

      setTimeout(() => {
        navigate(`/surveys/${survey._id}`);
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload survey.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Upload Survey
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Upload tree GeoJSON, orthomosaic imagery and spatial bounds for an
          estate survey.
        </p>
      </div>

      {/* Replacement warning */}

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Important:</span> If a survey already
          exists for the selected estate and year, uploading these files will
          replace that survey and its existing files.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Success */}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Survey information */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Survey Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the estate and provide the survey date and year.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Estate */}

            <div className="md:col-span-2">
              <label
                htmlFor="estate"
                className="block text-sm font-medium text-slate-700"
              >
                Estate
              </label>

              <select
                id="estate"
                value={estateId}
                disabled={loadingEstates || submitting}
                onChange={(event) => setEstateId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              >
                <option value="">
                  {loadingEstates ? "Loading estates..." : "Select an estate"}
                </option>

                {estates.map((estate) => (
                  <option
                    key={estate.id || estate._id}
                    value={estate.id || estate._id}
                  >
                    {estate.name}
                    {estate.district ? ` — ${estate.district}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}

            <div>
              <label
                htmlFor="survey-year"
                className="block text-sm font-medium text-slate-700"
              >
                Survey Year
              </label>

              <input
                id="survey-year"
                type="number"
                min="1900"
                max={currentYear + 1}
                value={year}
                disabled={submitting}
                onChange={(event) => setYear(event.target.value)}
                placeholder={String(currentYear)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              />
            </div>

            {/* Survey Date */}

            <div>
              <label
                htmlFor="survey-date"
                className="block text-sm font-medium text-slate-700"
              >
                Survey Date
              </label>

              <input
                id="survey-date"
                type="date"
                value={surveyDate}
                disabled={submitting}
                onChange={(event) => setSurveyDate(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Selected estate preview */}

          {selectedEstate && (
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="font-medium text-slate-800">
                {selectedEstate.name}
              </p>

              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
                <span>District: {selectedEstate.district || "-"}</span>

                <span>Area: {selectedEstate.area || "-"}</span>

                <span>Estate ID: {selectedEstate.estateCode || "-"}</span>
              </div>
            </div>
          )}
        </section>

        {/* Files */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Survey Files
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All three files are required. Maximum size is 100 MB per file.
            </p>
          </div>

          <div className="space-y-5">
            <FileInput
              id="geo-json"
              title="Tree GeoJSON"
              description="Tree point data containing NDVI and health classification information."
              accept=".geojson,.json,application/json,application/geo+json"
              file={geoJsonFile}
              disabled={submitting}
              onChange={setGeoJsonFile}
            />

            <FileInput
              id="orthomosaic"
              title="Orthomosaic Image"
              description="PNG orthomosaic image used as the estate survey map overlay."
              accept=".png,image/png"
              file={orthomosaicFile}
              disabled={submitting}
              onChange={setOrthomosaicFile}
            />

            <FileInput
              id="bounds"
              title="Spatial Bounds"
              description="JSON file containing CRS and north, south, east and west map bounds."
              accept=".json,application/json"
              file={boundsFile}
              disabled={submitting}
              onChange={setBoundsFile}
            />
          </div>
        </section>

        {/* Expected bounds format */}

        <section className="rounded-xl border bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800">
            Required bounds JSON structure
          </p>

          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
            {`{
  "crs": "EPSG:4326",
  "bounds": {
    "north": 7.32192888,
    "south": 7.31463288,
    "east": 79.98790966,
    "west": 79.97715813
  }
}`}
          </pre>
        </section>

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={submitting}
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || loadingEstates}
            className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Uploading Survey..." : "Upload Survey"}
          </button>
        </div>
      </form>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| File Input
|--------------------------------------------------------------------------
*/

const FileInput = ({
  id,
  title,
  description,
  accept,
  file,
  disabled,
  onChange,
}) => {
  const handleChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    onChange(selectedFile);
  };

  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <label htmlFor={id} className="font-semibold text-slate-800">
            {title}
          </label>

          <p className="mt-1 text-sm text-slate-500">{description}</p>

          {file && (
            <div className="mt-3">
              <p className="text-sm font-medium text-green-700">{file.name}</p>

              <p className="mt-1 text-xs text-slate-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0">
          <input
            id={id}
            type="file"
            accept={accept}
            disabled={disabled}
            onChange={handleChange}
            className="block max-w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| File size formatter
|--------------------------------------------------------------------------
*/

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes)) {
    return "-";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default UploadSurvey;
