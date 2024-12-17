import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 28.536482, lng: 77.270955 };

const StallEdite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState("");
  const [locationError, setLocationError] = useState("");

  const initialValues = {
    thela_name: "",
    selectedState: "",
    selectedDistrict: "",
    selectedCity: "",
    longitude: location.longitude || "",
    latitude: location.latitude || "",
    location: address || "",
  };

  const validationSchema = Yup.object({
    thela_name: Yup.string().required("Stall name is required"),
    selectedState: Yup.string().required("State is required"),
    selectedDistrict: Yup.string().required("District is required"),
    selectedCity: Yup.string().required("City is required"),
    location: Yup.string().required("Address is required"),
    longitude: Yup.string().required("Longitude is required"),
    latitude: Yup.string().required("Latitude is required"),
  });

  const sendData = (payload) => {
    try {
      const res = axios
        .post(
          "https://didikadhababackend.indevconsultancy.in/dhaba/thelas/",
          payload
        )
        .then((res) => {
          if (res.status) {
            toast.success("Registration Completed ");
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });

      setIsLoading(false);
    } catch (error) {
      if (error) {
        console.log(error.status);
      }
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
  };

  // State management
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [city, setCity] = useState([]);

  const getState = () => {
    axios
      .get("https://didikadhababackend.indevconsultancy.in/dhaba/states/")
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log("Error in fetching states:", err);
      });
  };

  const getDistrict = (selectedState) => {
    axios
      .get(
        `https://didikadhababackend.indevconsultancy.in/dhaba/filter-districts/${selectedState}`
      )
      .then((res) => {
        setDistrict(res.data);
      })
      .catch((err) => {
        console.log("Error in fetching districts:", err);
      });
  };

  const getCity = (selectedDistrict) => {
    axios
      .get(
        `https://didikadhababackend.indevconsultancy.in/dhaba/filter-cities/${selectedDistrict}`
      )
      .then((res) => {
        setCity(res.data);
      })
      .catch((err) => {
        console.log("Error in fetching cities:", err);
      });
  };

  useEffect(() => {
    getState();
  }, []);

  useEffect(() => {
    if (initialValues.selectedState) {
      getDistrict(initialValues.selectedState);
    }
  }, [initialValues.selectedState]);

  useEffect(() => {
    if (initialValues.selectedDistrict) {
      getCity(initialValues.selectedDistrict);
    }
  }, [initialValues.selectedDistrict]);

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
    <div className="py-2 px-12">
      {console.log(mapCenter)}
      <ToastContainer />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, validateForm, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="my-8 p-6">
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

              <div className="mb-2">
                <label
                  htmlFor="selectedState"
                  className="block text-slate-600 mb-1"
                >
                  Select state
                </label>
                <select
                  id="selectedState"
                  name="selectedState"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={values.selectedState}
                  onChange={(e) => {
                    const selectedStateValue = parseInt(e.target.value, 10);
                    setFieldValue("selectedState", selectedStateValue);
                    setFieldValue("selectedDistrict", "");
                    setFieldValue("selectedCity", "");
                    getDistrict(selectedStateValue);
                  }}
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {state.map((stateItem) => (
                    <option key={stateItem.state_id} value={stateItem.state_id}>
                      {stateItem.state_name}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  name="selectedState"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="selectedDistrict"
                  className="block text-slate-600 mb-1"
                >
                  Select District
                </label>
                <select
                  id="selectedDistrict"
                  name="selectedDistrict"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={values.selectedDistrict}
                  onChange={(e) => {
                    const selectedDistrictValue = parseInt(e.target.value, 10);
                    setFieldValue("selectedDistrict", selectedDistrictValue);
                    setFieldValue("selectedCity", "");
                    getCity(selectedDistrictValue);
                  }}
                  disabled={!values.selectedState}
                >
                  <option value="" disabled>
                    Select District
                  </option>
                  {district.map((districtItem) => (
                    <option
                      key={districtItem.dist_id}
                      value={districtItem.dist_id}
                    >
                      {districtItem.dist_name}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  name="selectedDistrict"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="selectedCity"
                  className="block text-slate-600 mb-1"
                >
                  Select City
                </label>
                <select
                  id="selectedCity"
                  name="selectedCity"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={values.selectedCity}
                  onChange={(e) => {
                    setFieldValue("selectedCity", parseInt(e.target.value, 10));
                  }}
                  disabled={!values.selectedDistrict}
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {city.map((cityItem) => (
                    <option key={cityItem.city_id} value={cityItem.city_id}>
                      {cityItem.city_name}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  name="selectedCity"
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

              <div className="my-4">
                <GoogleMap
                  center={mapCenter}
                  zoom={15}
                  mapContainerStyle={mapContainerStyle}
                >
                  {location.latitude && location.longitude && (
                    <MarkerF
                      position={{
                        lat: location.latitude,
                        lng: location.longitude,
                      }}
                    />
                  )}
                </GoogleMap>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StallEdite;
