import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 28.536482, lng: 77.270955 };

const ThelaRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState("");
  const [locationError, setLocationError] = useState("");

  const initialValues = {
    thela_name: "",
    longitude: location.longitude || "",
    latitude: location.latitude || "",
    location: address || "",
  };

  const validationSchema = Yup.object({
    thela_name: Yup.string().required("Stall name is required"),
    location: Yup.string().required("Address is required"),
    longitude: Yup.string().required("Longitude is required"),
    latitude: Yup.string().required("Latitude is required"),
  });

  const sendData = (payload) => {
    console.log(payload);
    try {
      const res = axios.post(
        "https://didikadhababackend.indevconsultancy.in/dhaba/thelas/",
        payload
      );
      setIsLoading(false);
    } catch (error) {
      console.log("error in sending", error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values, { setSubmitting, validateForm }) => {
    const errors = await validateForm(values);

    if (Object.keys(errors).length > 0) {
      console.error("Validation errors:", errors);
      setSubmitting(false);
      return;
    }

    if (!location.latitude || !location.longitude) {
      console.error("Location not available");
      setSubmitting(false);
      return;
    }
    setIsLoading(true);
    const payload = {
      ...values,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    await sendData(payload);
    setSubmitting(false);
    setIsLoading(true);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (isLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          reverseGeocode(newLocation);
        },
        (error) => {
          setLocationError("Unable to retrieve your location.");
          console.error("Error getting location", error);
        }
      );
    } else if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, [isLoaded]);

  const reverseGeocode = (location) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(
      location.latitude,
      location.longitude
    );

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const formattedAddress = results[0].formatted_address;
        setAddress(formattedAddress);
        console.log("Address:", formattedAddress);
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  const mapCenter =
    location.latitude && location.longitude
      ? { lat: location.latitude, lng: location.longitude }
      : defaultCenter;

  return (
    <div className="bg-gray-50 py-8 px-4">
      {console.log(mapCenter)}
      <h2 className="text-3xl font-semibold text-center text-slate-600">
        Registration for Stall
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ validateForm }) => (
          <Form>
            <div className="my-8 p-6 bg-white shadow-md rounded-md">
              <div className="mb-4">
                <label
                  htmlFor="thela_name"
                  className="block text-slate-600 mb-1"
                >
                  Stall Name
                </label>
                <Field
                  type="text"
                  id="thela_name"
                  name="thela_name"
                  placeholder="Enter stall name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="thela_name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-slate-600 mb-1">
                  Address
                </label>
                <Field
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter your address"
                  value={address}
                  disabled
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="longitude"
                  className="block text-slate-600 mb-1"
                >
                  Longitude
                </label>
                <Field
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={mapCenter.lng || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="longitude"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="latitude" className="block text-slate-600 mb-1">
                  Latitude
                </label>
                <Field
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={mapCenter.lat || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="latitude"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-center my-4">
              <button
                type="submit"
                className={`p-2 rounded-lg ${
                  isLoading ? "bg-gray-300" : "bg-[#A24C4A] text-white"
                }`}
                onClick={() => validateForm()}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="border rounded-lg shadow-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={20}
          center={mapCenter}
        >
          <MarkerF position={mapCenter} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default ThelaRegistration;
