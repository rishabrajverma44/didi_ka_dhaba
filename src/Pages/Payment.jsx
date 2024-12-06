import axios from "axios";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { FiX, FiRefreshCcw } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";

const Payment = () => {
  const [namesDidi, setNamesDidi] = useState([]);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);
  const dropdownRefDidi = useRef(null);
  const [currentDate, setCurrentDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [online, setOnline] = useState("");
  const [cash, setCash] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = useMemo(
    () => ({
      facingMode: isUsingFrontCamera ? "user" : "environment",
    }),
    [isUsingFrontCamera]
  );

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (photos.length < 5) {
        setPhotos((prev) => [...prev, imageSrc]);
        toast.success("Photo added successfully!");
      } else {
        toast.error("You can only add up to 5 photos.");
      }
      setIsCameraOn(false);
    }
  };

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  const toggleCameraType = () => {
    setIsUsingFrontCamera((prevState) => !prevState);
  };

  const handleRemoveImage = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    toast.info("Photo removed.");
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
    if (!selectedDidi) {
      toast.warning("Please select Didi");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("didi_id", selectedDidi);
    photos.forEach((photo, index) => {
      formData.append(`photo${index + 1}`, photo);
    });

    const payload = {
      didi: formData.get("didi_id"),
      Online: online,
      Cash: cash,
      photos: Array.from({ length: photos.length }).map((_, i) =>
        formData.get(`photo${i + 1}`)
      ),
    };

    console.log(payload);
    toast.success("Submitted successfully!");
    setPhotos([]);
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
            <label className="text-gray-700">Online Recived Money</label>
            <input
              type="number"
              placeholder="Enter Online Payment"
              onChange={(e) => setOnline(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="text-gray-700">Cash Recived Money</label>
            <input
              type="number"
              placeholder="Enter Cash Payment"
              onChange={(e) => setCash(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-700">Add Photos</label>
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

            <div className="grid grid-cols-3 gap-4 mt-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Captured ${index + 1}`}
                    className="w-24 h-24 rounded shadow-lg"
                  />
                  <span className="absolute top-0 right-0 p-1">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FiX size={24} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between place-self-center">
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
      <ToastContainer />
    </div>
  );
};

export default Payment;
