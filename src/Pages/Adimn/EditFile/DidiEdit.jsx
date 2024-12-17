import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { FiRefreshCcw, FiX } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const base_url = "https://didikadhababackend.indevconsultancy.in/dhaba";

const DidiEdit = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    first_name: "",
    last_name: "",
    husband_name: "",
    mobile_no: "",
    alternate_mobile_no: "",
    address: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    husband_name: Yup.string().required("Husband/Father's name is required"),
    mobile_no: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    alternate_mobile_no: Yup.string().matches(
      /^[0-9]{10}$/,
      "Alternate mobile number must be 10 digits"
    ),
    address: Yup.string().required("Address is required"),
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(true);
  const [imageSrc, setImageSrc] = useState("");
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
      setIsCameraOpen(false);
    }
  };

  const handleRetake = () => {
    setIsCaptured(false);
    setImageSrc("");
    setIsCameraOpen(true);
  };

  const handleSwitchCamera = () => {
    setIsBackCamera((prev) => !prev);
  };

  const resetCaptureState = () => {
    setIsCaptured(false);
    setImageSrc("");
  };

  const handleSubmit = async (values, { resetForm }) => {
    const payload = { ...values, image: imageSrc };

    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://didikadhababackend.indevconsultancy.in/dhaba/didi/",
        payload
      );

      if (res.status === 201) {
        toast.success("Registration successfully done");
        resetForm();
        handleRetake();
        handleToggleCamera();
        navigate("/didilist");
      }
    } catch (error) {
      if (error.response?.data?.mobile_no) {
        toast.error(error.response.data.mobile_no[0]);
        handleRetake();
        handleToggleCamera();
      }
      console.log("Error in sending data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-2 px-24">
      <ToastContainer />
      <div className="pb-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-600">
          Registration for Didi
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="flex flex-col my-8 p-6 bg-white shadow-md rounded-md md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 px-4">
                <div className="mb-4">
                  <label
                    htmlFor="first_name"
                    className="block text-slate-600 mb-1"
                  >
                    First Name
                  </label>
                  <Field
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="Enter your first name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="last_name"
                    className="block text-slate-600 mb-1"
                  >
                    Last Name
                  </label>
                  <Field
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="Enter your last name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="husband_name"
                    className="block text-slate-600 mb-1"
                  >
                    Husband/Father's Name
                  </label>
                  <Field
                    type="text"
                    id="husband_name"
                    name="husband_name"
                    placeholder="Enter husband's or father's name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="husband_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="mobile_no"
                    className="block text-slate-600 mb-1"
                  >
                    Mobile Number
                  </label>
                  <Field
                    type="number"
                    id="mobile_no"
                    name="mobile_no"
                    placeholder="Enter your mobile number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="mobile_no"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="alternate_mobile_no"
                    className="block text-slate-600 mb-1"
                  >
                    Alternate Mobile Number
                  </label>
                  <Field
                    type="number"
                    id="alternate_mobile_no"
                    name="alternate_mobile_no"
                    placeholder="Enter your alternate mobile number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="alternate_mobile_no"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 px-4 flex justify-center items-center flex-col">
                <div className="inline-block w-full">
                  {isCameraOpen && !isCaptured && (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-96 object-cover rounded-md"
                        videoConstraints={{
                          facingMode: isBackCamera ? "environment" : "user",
                        }}
                      />
                      <div className="bottom-4 mt-2 w-full flex justify-center space-x-6">
                        <button
                          onClick={handleCapture}
                          className="py-1 px-1 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                        >
                          <FaCamera size={30} />
                        </button>
                        <button
                          onClick={handleToggleCamera}
                          className="py-1 px-1 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                        >
                          <FiX size={30} />
                        </button>
                        <button
                          onClick={handleSwitchCamera}
                          className="py-1 px-1 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                        >
                          <FiRefreshCcw size={30} />
                        </button>
                      </div>
                    </>
                  )}
                  {!isCameraOpen && !isCaptured && (
                    <div className="w-full h-96 bg-gray-300 flex flex-col items-center justify-between rounded-md">
                      {" "}
                      <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-500">Camera is off</p>
                      </div>
                      <button
                        onClick={handleToggleCamera}
                        className="mt-4 mb-4 py-2 px-4 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
                      >
                        <FaCamera size={30} />
                      </button>
                    </div>
                  )}

                  {isCaptured && imageSrc && (
                    <div className="mt-6">
                      <img
                        src={imageSrc}
                        alt="Captured"
                        className="w-full h-96 object-cover rounded-md"
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
            <div className="w-full mt-6">
              <label htmlFor="address" className="block text-slate-600 mb-1">
                Address
              </label>
              <Field
                as="textarea"
                id="address"
                name="address"
                rows="3"
                placeholder="Enter your address"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mt-6 flex justify-center w-full">
              <button
                type="submit"
                className="py-2 px-6 rounded-lg shadow-md text-white bg-[#A24C4A] hover:bg-[#53230A]"
              >
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default DidiEdit;
