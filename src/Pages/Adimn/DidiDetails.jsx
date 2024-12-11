import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 28.536482, lng: 77.270955 };

const DidiDetails = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState("");
  const [locationError, setLocationError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    husbandFatherName: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyA5KJcNipnIvGqZkcdd2lFtY3elcTViNzU",
  });

  useEffect(() => {
    if (isLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("Updated location:", newLocation);
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
        setFormData((prevData) => ({ ...prevData, address: formattedAddress }));
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

  console.log("Map center:", mapCenter);

  return (
    <div className="bg-gray-50 py-2 px-4" style={{ height: "99vh" }}>
      <div className="">
        <h2 className="text-2xl font-bold text-center text-slate-600">
          Registration for Didi
        </h2>

        <div className="my-2 mt-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-slate-600 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="husbandFatherName"
                className="block text-slate-600 mb-1"
              >
                Husband/Father's Name
              </label>
              <input
                type="text"
                id="husbandFatherName"
                name="husbandFatherName"
                value={formData.husbandFatherName}
                onChange={handleChange}
                placeholder="Enter husband's or father's name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-slate-600 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address || address}
                onChange={handleChange}
                rows="4"
                placeholder="Enter your address"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>

            <div className="place-self-end my-4">
              <button
                type="submit"
                className="bg-[#A24C4A] hover:bg-btn-hoverPrimary text-white px-4 py-2 rounded-md transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="border rounded-lg shadow-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={20}
            center={mapCenter}
          >
            <Marker position={mapCenter} />
            {console.log("Marker position:", mapCenter)}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default DidiDetails;
