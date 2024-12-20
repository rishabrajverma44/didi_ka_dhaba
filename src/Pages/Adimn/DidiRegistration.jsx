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
    state: "",
    district: "",
    city: "",
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
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    city: Yup.string().required("City is required"),
  });

  //adhar

  const [imagesAdhar, setImagesAdhar] = useState([]);
  const [isCameraOpenAdhar, setIsCameraOpenAdhar] = useState(false);
  const [isBackCameraAdhar, setIsBackCameraAdhar] = useState(true);
  const webcamRef2 = useRef(null);

  const captureImageAdhar = (event) => {
    event.preventDefault();
    if (imagesAdhar.length >= 2) {
      toast.error("You can only capture 2 images.");
      return;
    }

    if (webcamRef2.current) {
      const screenshot = webcamRef2.current.getScreenshot();
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
  const [imageSrc, setImageSrc] = useState(null);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const webcamRef1 = useRef(null);

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
    if (webcamRef1.current) {
      const capturedImage = webcamRef1.current.getScreenshot();
      if (capturedImage) {
        setImageSrc(capturedImage);
        setIsCaptured(true);
        setIsCameraOpen(false);
      } else {
        setImageSrc(null);
      }
    }
  };

  const handleRetake = () => {
    setIsCaptured(false);
    setImageSrc(null);
    setIsCameraOpen(true);
  };

  const handleSwitchCamera = () => {
    setIsBackCamera((prev) => !prev);
  };

  const resetCaptureState = () => {
    setIsCaptured(false);
    setImageSrc(null);
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

  const getDistrict = (state) => {
    axios
      .get(
        `https://didikadhababackend.indevconsultancy.in/dhaba/filter-districts/${state}`
      )
      .then((res) => {
        setDistrict(res.data);
      })
      .catch((err) => {
        console.log("Error in fetching districts:", err);
      });
  };

  const getCity = (district) => {
    axios
      .get(
        `https://didikadhababackend.indevconsultancy.in/dhaba/filter-cities/${district}`
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
    if (initialValues.state) {
      getDistrict(initialValues.state);
    }
  }, [initialValues.state]);

  useEffect(() => {
    if (initialValues.district) {
      getCity(initialValues.district);
    }
  }, [initialValues.district]);

  const handleSubmit = async (values, { resetForm }) => {
    const cleanedDocuments = imagesAdhar.map(
      (doc) => `"${doc.replace("/9j/4AAQSkZJRgABAQAAAQABAAD/", "")}"`
    );

    const payload = {
      ...values,
      image: imageSrc ? imageSrc : null,
      document: cleanedDocuments.length === 0 ? "" : cleanedDocuments,
    };

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

        const userCredentials = JSON.parse(
          localStorage.getItem("userCredentials")
        );
        if (userCredentials) {
          const { email } = userCredentials;

          if (email === "admin@gmail.com") {
            setTimeout(() => {
              navigate("/didilist");
            }, 2000);
          } else {
            setTimeout(() => {
              navigate("/didilist-register");
            }, 2000);
          }
        }
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

    // resetForm();
  };

  return (
    <div className="py-2 px-6 md:px-12">
      <ToastContainer />
      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Add New Didi
          </b>
        </div>
      </div>
      <div className="bg-white py-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                <div className="w-full">
                  <label
                    htmlFor="first_name"
                    className="block text-slate-600 mb-1 font-medium"
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

                <div className="w-full">
                  <label
                    htmlFor="last_name"
                    className="block text-slate-600 mb-1 font-medium"
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

                <div className="w-full">
                  <label
                    htmlFor="husband_name"
                    className="block text-slate-600 mb-1 font-medium"
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

                <div className="w-full">
                  <label
                    htmlFor="state"
                    className="block text-slate-600 mb-1 font-medium"
                  >
                    Select State
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

                <div className="w-full">
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

                <div className="w-full">
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
                      const selectedCityValue = parseInt(e.target.value, 10);
                      setFieldValue("city", selectedCityValue);
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
                    name="selectedCity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="mobile_no"
                    className="block text-slate-600 mb-1 font-medium"
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

                <div className="w-full">
                  <label
                    htmlFor="alternate_mobile_no"
                    className="block text-slate-600 mb-1 font-medium"
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

                <div className="w-full">
                  <label
                    htmlFor="remarks"
                    className="block text-slate-600 mb-1 font-medium"
                  >
                    Remarks
                  </label>
                  <Field
                    type="text"
                    id="remarks"
                    name="remarks"
                    placeholder="Enter any remarks here"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="remarks"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="address"
                    className="block text-slate-600 mb-1 font-medium"
                  >
                    Address
                  </label>
                  <Field
                    as="textarea"
                    id="address"
                    name="address"
                    placeholder="Enter any address here"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="row inline-block p-2">
                {isCameraOpen && !isCaptured && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef1}
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
                      <button
                        onClick={handleToggleCamera}
                        className="py-2 px-4 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        <FaCamera size={30} />
                      </button>
                    </div>
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

              <div className="row inline-block p-2">
                {isCameraOpenAdhar && (
                  <>
                    <div className="relative">
                      <Webcam
                        audio={false}
                        ref={webcamRef2}
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
                          {imagesAdhar.length == 1 ? (
                            <>add more</>
                          ) : (
                            <>
                              <FaCamera size={24} />
                            </>
                          )}
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
