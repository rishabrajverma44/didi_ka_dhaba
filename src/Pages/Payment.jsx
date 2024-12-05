import axios from "axios";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { FiX, FiRefreshCcw } from "react-icons/fi";

const Payment = () => {
  const [namesDidi, setNamesDidi] = useState([]);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);
  const dropdownRefDidi = useRef(null);
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [finalData, setFinalData] = useState({});
  const [isCameraOn, setIsCameraOn] = useState(false); // Track camera state
  const [photoPreview, setPhotoPreview] = useState(null); // Store photo preview
  const [photoFile, setPhotoFile] = useState(null); // Store photo file
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(true); // Track which camera is being used
  const webcamRef = useRef(null);

  // Set video constraints based on which camera (front/back) is being used
  const videoConstraints = useMemo(
    () => ({
      facingMode: isUsingFrontCamera ? "user" : "environment", // Toggle between front and back cameras
    }),
    [isUsingFrontCamera]
  );

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhotoPreview(imageSrc);
      setPhotoFile(imageSrc);
      setIsCameraOn(false);
    }
  };

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  const toggleCameraType = () => {
    setIsUsingFrontCamera((prevState) => !prevState);
  };

  const handleRemoveImage = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
  };

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
            <input type="number" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-2">
            <label className="text-gray-700">Cash</label>
            <input type="number" className="w-full p-2 border rounded" />
          </div>

          <div className="mb-4">
            <label className="text-gray-700">Add Photo</label>
            <div className="border border-gray-300 px-4 py-2 text-center">
              {isCameraOn ? (
                <div className="relative">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    className="rounded shadow-md"
                    videoConstraints={videoConstraints}
                    style={{ minWidth: "200px" }}
                  />
                  <div className="absolute bottom-3 flex space-x-8 z-10 w-full items-center justify-center">
                    <button onClick={handleCapture}>
                      <FaCamera color="#A24C4A" size={30} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={toggleCamera}
                    >
                      <FiX size={30} />
                    </button>
                    <button onClick={toggleCameraType}>
                      <FiRefreshCcw color="#A24C4A" size={30} />
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={toggleCamera}>
                  <FaCamera color="#A24C4A" size={20} />
                </button>
              )}
            </div>

            <div className="border border-gray-300 px-4 py-2 text-center">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Captured"
                    className="w-32 h-32 rounded shadow-lg"
                  />
                  <span className="absolute top-0 right-0 p-1">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={handleRemoveImage}
                    >
                      <FiX size={24} />
                    </button>
                  </span>
                </div>
              ) : (
                <span className="text-gray-500 italic">No photo captured</span>
              )}
            </div>
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
