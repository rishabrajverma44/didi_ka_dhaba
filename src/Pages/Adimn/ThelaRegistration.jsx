import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../Components/prebuiltComponent/Breadcrumb";

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
  const navigate = useNavigate();
  const [route, setRoute] = useState();

  useEffect(() => {
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    if (userCredentials) {
      const { email } = userCredentials;

      if (email === "admin@gmail.com") {
        setRoute("/stall_list");
      } else {
        setRoute("/stall_list-register");
      }
    }
  }, []);

  const initialValues = {
    thela_name: "",
    state: "",
    district: "",
    city: "",
    longitude: location.longitude || "",
    latitude: location.latitude || "",
    location: address || "",
  };

  const validationSchema = Yup.object({
    thela_name: Yup.string().required("Stall name is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    city: Yup.string().required("City is required"),
    location: Yup.string().required("Address is required"),
    longitude: Yup.string().required("Longitude is required"),
    latitude: Yup.string().required("Latitude is required"),
  });

  const sendData = (payload) => {
    try {
      const res = axios
        .post(`${process.env.REACT_APP_API_BACKEND}/thelas/`, payload)
        .then((res) => {
          if (res.status) {
            toast.success("Registration Completed ");
            const userCredentials = JSON.parse(
              localStorage.getItem("userCredentials")
            );
            if (userCredentials) {
              const { email } = userCredentials;

              if (email === "admin@gmail.com") {
                setTimeout(() => {
                  navigate("/stall_list");
                }, 2000);
              } else {
                setTimeout(() => {
                  navigate("/stall_list-register");
                }, 2000);
              }
            }
          }
        })
        .catch((err) => {
          toast.error("Please change Location");
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
    const payload = {
      ...values,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    setIsLoading(true);
    await sendData(payload);
    setSubmitting(false);
  };

  // State management
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [city, setCity] = useState([]);

  const getState = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/states/`)
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log("Error in fetching states:", err);
      });
  };

  const getDistrict = (state) => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/filter-districts/${state}`)
      .then((res) => {
        setDistrict(res.data);
      })
      .catch((err) => {
        console.log("Error in fetching districts:", err);
      });
  };

  const getCity = (district) => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/filter-cities/${district}`)
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
    if (initialValues.state) {
      getDistrict(initialValues.state);
    }
  }, [initialValues.state]);

  useEffect(() => {
    if (initialValues.district) {
      getCity(initialValues.district);
    }
  }, [initialValues.district]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (isLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: 28.606328676546738,
            longitude: 77.22172796694939,
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
        location.value = formattedAddress;
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

  const breadcrumbItems = [
    { label: "Stall List", href: route },
    { label: "Stall", href: `` },
  ];

  const mapCenter =
    location.latitude && location.longitude
      ? { lat: location.latitude, lng: location.longitude }
      : defaultCenter;

  return (
    <div
      className="px-6 md:px-12 bg-slate-100 py-2"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer />

      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Stall Registration
          </b>
        </div>

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="py-2">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, validateForm, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-2">
                <div className="">
                  <label
                    htmlFor="thela_name"
                    className="block text-slate-600 mb-1 font-medium"
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

                <div className="">
                  <label
                    htmlFor="state"
                    className="block text-slate-600 mb-1 font-medium"
                  >
                    Select state
                  </label>
                  <select
                    id="state"
                    name="state"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={values.state}
                    onChange={(e) => {
                      const selectedStateValue = parseInt(e.target.value, 10);
                      setFieldValue("state", selectedStateValue);
                      setFieldValue("district", "");
                      setFieldValue("city", "");
                      getDistrict(selectedStateValue);
                    }}
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {state.map((stateItem) => (
                      <option
                        key={stateItem.state_id}
                        value={stateItem.state_id}
                      >
                        {stateItem.state_name}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="">
                  <label
                    htmlFor="district"
                    className="block text-slate-600 mb-1 font-medium"
                  >
                    Select District
                  </label>
                  <select
                    id="district"
                    name="district"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={values.district}
                    onChange={(e) => {
                      const selectedDistrictValue = parseInt(
                        e.target.value,
                        10
                      );
                      setFieldValue("district", selectedDistrictValue);
                      setFieldValue("city", "");
                      getCity(selectedDistrictValue);
                    }}
                    disabled={!values.state}
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
                    name="district"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="">
                  <label
                    htmlFor="city"
                    className="block text-slate-600 mb-1 font-medium"
                  >
                    Select City
                  </label>
                  <select
                    id="city"
                    name="city"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={values.city}
                    onChange={(e) => {
                      setFieldValue("city", parseInt(e.target.value, 10));
                    }}
                    disabled={!values.district}
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
                    name="city"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="">
                  <label
                    htmlFor="address"
                    className="block text-slate-600 mb-1 font-medium"
                  >
                    Address
                  </label>
                  <Field
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Enter your address"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="">
                  <label
                    htmlFor="longitude"
                    className="block text-slate-600 mb-1 font-medium"
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

                <div className="">
                  <label
                    htmlFor="latitude"
                    className="block text-slate-600 mb-1 font-medium"
                  >
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
              <div className="my-4">
                <GoogleMap
                  center={mapCenter}
                  zoom={12}
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

              <div className="flex justify-end my-4">
                <button
                  type="submit"
                  className={`p-2 rounded-lg btn btn-dark hover:bg-[#53230A] ${
                    isLoading ? "bg-gray-300" : "bg-[#A24C4A] text-white"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ThelaRegistration;
