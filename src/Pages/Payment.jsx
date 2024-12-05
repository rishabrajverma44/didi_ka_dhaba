import axios from "axios";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";

const Payment = () => {
  const [namesDidi, setNamesDidi] = useState([]);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);
  const dropdownRefDidi = useRef(null);
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [finalData, setFinalData] = useState({});

  const webcamRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(true);

  const getDidi = async () => {
    try {
      const response = await axios.get(
        "https://didikadhababackend.indevconsultancy.in/dhaba/didi/"
      );
      setNamesDidi(response.data);
    } catch (error) {
      console.error("Error fetching didi data", error);
    }
  };

  useEffect(() => {
    getDidi();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const filteredDidiNames = namesDidi.filter((item) =>
    item.full_name.toLowerCase().includes(searchTermDidi.toLowerCase())
  );

  const videoConstraints = {
    facingMode: isUsingFrontCamera ? "user" : "environment",
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhotoPreview(imageSrc);
      setPhotoFile(imageSrc);
      setIsCameraOn(false);
    } else {
      alert("Webcam is not initialized!");
    }
  }, [webcamRef]);

  const turnOnCamera = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setIsCameraOn(true);
  };

  const toggleCamera = () => {
    setIsUsingFrontCamera((prev) => !prev);
  };

  const submitFinal = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("didi_id", selectedDidi);
    formData.append("photo", photoFile);
    const payload = {
      didi: formData.get("didi_id"),
      photo: formData.get("photo"),
    };

    console.log(payload);
    setPhotoFile(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-50" style={{ minHeight: "100vh" }}>
      <div className="container py-4">
        <h3 className="text-center mb-4">Payment Details</h3>

        <h4 className="text-xl font-semibold text-gray-800">Select Didi</h4>

        <div ref={dropdownRefDidi} className="relative">
          <input
            type="text"
            placeholder="Search Name..."
            className="cursor-pointer w-full p-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={searchTermDidi}
            onChange={(e) => {
              setSearchTermDidi(e.target.value);
              setIsDropdownOpenDidi(true);
              setSelectedDidi(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpenDidi(true);
            }}
          />
          {isDropdownOpenDidi && (
            <ul
              className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredDidiNames.length > 0 ? (
                filteredDidiNames.map((name, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setSelectedDidi(name.didi_id);
                      setSearchTermDidi(name.full_name);
                      setIsDropdownOpenDidi(false);
                    }}
                  >
                    {name.full_name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 text-center">No didi found</li>
              )}
            </ul>
          )}
        </div>

        <div className="mb-3">
          <p className="mt-2 text-lg text-[#A24C4A] font-bold">{currentDate}</p>
        </div>

        <h4 className="text-xl font-semibold text-gray-800">Received Money</h4>
        <div>
          <div className="mb-2">
            <label className="text-gray-700">Online</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-2">
            <label className="text-gray-700">Cash</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>

          <div className="mb-4">
            <label className="text-gray-700">Add Photo</label>
            {isCameraOn ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  className="rounded shadow-md"
                  videoConstraints={videoConstraints}
                />
                <div className="mt-2 flex justify-between">
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    onClick={capture}
                  >
                    Capture Photo
                  </button>
                  <button
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                    onClick={toggleCamera}
                  >
                    {isUsingFrontCamera
                      ? "Switch to Back Camera"
                      : "Switch to Front Camera"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-500 italic">Camera is off</div>
            )}
            {!isCameraOn && (
              <button
                className="bg-green-500 text-white p-2 rounded mt-2 hover:bg-green-600 transition"
                onClick={turnOnCamera}
              >
                Retake Photo
              </button>
            )}
            {photoPreview && (
              <div className="mt-2">
                <img
                  src={photoPreview}
                  alt="Captured Preview"
                  className="w-32 h-32 rounded shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className={`p-2 rounded-lg ${
              isLoading ? "bg-gray-300" : "bg-[#A24C4A] text-white"
            }`}
            onClick={submitFinal}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
