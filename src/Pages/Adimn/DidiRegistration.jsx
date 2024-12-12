import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

const DidiRegistration = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isBackCamera, setIsBackCamera] = useState(false);
  const webcamRef = useRef(null);

  const handleToggleCamera = () => {
    setIsCameraOpen((prev) => {
      const newCameraState = !prev;
      if (!newCameraState) {
        resetCaptureState();
      }
      return newCameraState;
    });
  };

  const handleCapture = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    if (capturedImage) {
      setImageSrc(capturedImage);
      setIsCaptured(true);
      setIsCameraOpen(false); // Turn off the camera after capturing
    }
  };

  const handleRetake = () => {
    setIsCaptured(false);
    setImageSrc(null);
    setIsCameraOpen(true); // Open camera for retake
  };

  const handleSwitchCamera = () => {
    setIsBackCamera((prev) => !prev); // Toggle between front and back camera
  };

  const resetCaptureState = () => {
    setIsCaptured(false);
    setImageSrc(null);
  };

  return (
    <div className="bg-gray-50 py-8 px-4" style={{ height: "100vh" }}>
      <div className="pb-6">
        <h2 className="text-3xl font-semibold text-center text-slate-600">
          Registration for Didi
        </h2>

        <div className="flex justify-center mt-6">
          <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="relative inline-block rounded-md w-full">
              {isCameraOpen && !isCaptured && (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-64 object-cover rounded-md"
                    videoConstraints={{
                      facingMode: isBackCamera ? "environment" : "user", // Switch between front and back camera
                    }}
                  />
                  <div className="absolute bottom-4 w-full flex justify-center space-x-6">
                    <button
                      onClick={handleCapture}
                      className="py-2 px-4 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                    >
                      <FaCamera size={30} />
                    </button>
                    <button
                      onClick={handleToggleCamera}
                      className="py-2 px-4 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                    >
                      Turn Off Camera
                    </button>
                    <button
                      onClick={handleSwitchCamera}
                      className="py-2 px-4 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                    >
                      <FiRefreshCcw size={30} />
                    </button>
                  </div>
                </>
              )}
              {!isCameraOpen && !isCaptured && (
                <div className="w-full h-64 bg-gray-300 flex flex-col items-center justify-between rounded-md">
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500">Camera is off</p>
                  </div>
                  <button
                    onClick={handleToggleCamera}
                    className="mt-4 py-2 px-4 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                  >
                    <FaCamera size={30} />
                  </button>
                </div>
              )}

              {isCaptured && imageSrc && (
                <div className="mt-6 relative">
                  <img
                    src={imageSrc}
                    alt="Captured"
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleRetake}
                      className="py-2 px-4 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DidiRegistration;
