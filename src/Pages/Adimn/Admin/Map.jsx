import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import svgStall from "../../../Assets/Images/stall.png";
import axios from "axios";

const Map = () => {
  const [stalls, setStalls] = useState([]);
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_API_BACKEND}/theladetailsViewss/`)
      .then((res) => {
        setStalls(res.data.thela_data);
      });
  }, []);
  const navigate = useNavigate();

  //map details
  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  const center = { lat: 28.556482, lng: 77.270955 };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [selectedPlace, setSelectedPlace] = useState(null);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
  };
  return (
    <div>
      <div className="mt-4">
        <div className="border p-2 mb-6 bg-white rounded-lg shadow-sm">
          <div className="flex gap-24 justify-center items-center">
            <div className="flex gap-6 py-2">
              <div className="text-xl font-semibold text-gray-800">
                Total Active Stalls:
              </div>
              <div className="text-lg text-green-500 font-bold">
                {stalls.length}
              </div>
            </div>
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={11}
          >
            {stalls.map((place) => (
              <MarkerF
                key={place.thela_id}
                position={place.position}
                onClick={() => handleMarkerClick(place)}
                icon={{
                  url: svgStall,
                  scaledSize: new window.google.maps.Size(40, 40),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(20, 40),
                }}
              />
            ))}
            {selectedPlace && (
              <InfoWindowF
                position={selectedPlace.position}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div className="w-40 h-auto p-2 bg-white rounded-md shadow-md border border-gray-300">
                  <img
                    src={`${process.env.REACT_APP_API_BACKEND}/${selectedPlace.didi_image}`}
                    alt="Profile"
                    onClick={() =>
                      navigate(`/didiprofile/${selectedPlace.didi_id}`)
                    }
                    className="w-20 h-20 object-cover rounded-full shadow-md border-4 border-blue-300 mx-auto"
                  />
                  <div className="text-center mt-3">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {selectedPlace.didi_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedPlace.thela_name}
                    </p>
                  </div>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default Map;
