import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { FiRefreshCcw, FiX } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DidiRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    first_name: "",
    last_name: "",
    husband_name: "",
    mobile_no: "",
    alternate_mobile_no: "",
    selectedState: "",
    selectedDistrict: "",
    selectedCity: "",
    address: "",
    remarks: "",
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
    selectedState: Yup.string().required("State is required"),
    selectedDistrict: Yup.string().required("District is required"),
    selectedCity: Yup.string().required("City is required"),
  });

  //adhar

  const [imagesAdhar, setImagesAdhar] = useState([]);
  const [isCameraOpenAdhar, setIsCameraOpenAdhar] = useState(false);
  const [isBackCameraAdhar, setIsBackCameraAdhar] = useState(true);

  const captureImageAdhar = () => {
    if (imagesAdhar.length >= 2) {
      toast.error("You can only capture 2 images.");
      return;
    }

    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImagesAdhar((prevImages) => [...prevImages, screenshot]);
      }
    }
  };

  const removeImageAdhar = (index) => {
    setImagesAdhar((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const toggleCameraAdhar = () => {
    setIsCameraOpenAdhar(!isCameraOpenAdhar);
  };

  const toggleCameraMode = () => {
    setIsBackCameraAdhar(!isBackCameraAdhar);
  };

  //cammera
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
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

  const handleSubmit = async (values, { resetForm }) => {
    const payload = { ...values, image: imageSrc, document: imagesAdhar };

    console.log(payload);

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

    resetForm();
  };

  return (
    <div className="py-2">
      <ToastContainer />
      <div className="bg-white mx-2 px-2 py-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="w-full md:w-1/2 px-4">
                  <div className="mb-2">
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

                  <div className="mb-2">
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
                        const selectedDistrictValue = parseInt(
                          e.target.value,
                          10
                        );
                        setFieldValue(
                          "selectedDistrict",
                          selectedDistrictValue
                        );
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

                  <div className="mb-2">
                    <label
                      htmlFor="remarks"
                      className="block text-slate-600 mb-1"
                    >
                      Remarks
                    </label>
                    <Field
                      type="text"
                      id="remarks"
                      name="remarks"
                      placeholder="Enter your Remarks"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-4">
                  <div className="mb-2">
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
                        <option
                          key={stateItem.state_id}
                          value={stateItem.state_id}
                        >
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
                        const selectedCityValue = parseInt(e.target.value, 10);
                        setFieldValue("selectedCity", selectedCityValue);
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

                  <div className="mb-2">
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

                  <div className="mb-2">
                    <label
                      htmlFor="address"
                      className="block text-slate-600 mb-1"
                    >
                      Address
                    </label>
                    <Field
                      as="textarea"
                      id="address"
                      name="address"
                      rows="2"
                      placeholder="Enter your address"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="row inline-block p-2">
                {isCameraOpenAdhar && (
                  <>
                    <div className="relative">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-96 object-cover rounded-md shadow-md"
                        videoConstraints={{
                          facingMode: isBackCameraAdhar
                            ? "environment"
                            : "user",
                        }}
                      />
                      <div className="absolute bottom-4 right-4 flex space-x-4">
                        <button
                          onClick={captureImageAdhar}
                          className="py-2 px-3 rounded-full shadow-md bg-[#0B1727] text-white hover:bg-[#53230A] transition-all"
                        >
                          <FaCamera size={24} />
                        </button>
                        <button
                          onClick={toggleCameraMode}
                          className="py-2 px-3 rounded-full shadow-md bg-[#0B1727] text-white hover:bg-[#53230A] transition-all"
                        >
                          <FiRefreshCcw size={24} />
                        </button>
                        <button
                          onClick={toggleCameraAdhar}
                          className="py-2 px-3 rounded-full shadow-md bg-red-500 text-white hover:bg-red-600 transition-all"
                        >
                          <FiX size={24} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {!isCameraOpenAdhar && (
                  <div className="h-96 bg-gray-300 flex flex-col items-center justify-center rounded-md">
                    <h2 className="text-gray-500 mb-4">Capture Identity</h2>
                    <p className="text-gray-500 mb-4">Camera is off</p>
                    <button
                      onClick={toggleCameraAdhar}
                      className="py-2 px-4 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A] transition-all"
                    >
                      <FaCamera size={30} />
                    </button>
                  </div>
                )}

                <div className="mt-1">
                  {imagesAdhar.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {imagesAdhar.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Captured ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md shadow-md"
                          />
                          <button
                            onClick={() => removeImageAdhar(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <FiX size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="row inline-block p-2">
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
                        className="py-1 px-1 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        <FaCamera size={30} />
                      </button>
                      <button
                        onClick={handleToggleCamera}
                        className="py-1 px-1 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        <FiX size={30} />
                      </button>
                      <button
                        onClick={handleSwitchCamera}
                        className="py-1 px-1 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        <FiRefreshCcw size={30} />
                      </button>
                    </div>
                  </>
                )}
                {!isCameraOpen && !isCaptured && (
                  <div className="h-96 bg-gray-300 flex flex-col items-center justify-between rounded-md">
                    <div className="flex-grow flex items-center flex-col justify-center">
                      <h2 className="text-gray-500 mb-4">Capture Face</h2>
                      <p className="text-gray-500">Camera is off</p>
                    </div>
                    <button
                      onClick={handleToggleCamera}
                      className="py-2 px-4 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
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
                        className="py-2 px-4 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                )}
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

export default DidiRegistration;
