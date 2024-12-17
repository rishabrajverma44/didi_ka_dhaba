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
    state: Yup.string().required("state is required"),
    district: Yup.string().required("district is required"),
    city: Yup.string().required("city is required"),
  });

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

  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [district, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState();
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState();

  const getState = () => {
    axios
      .get("https://didikadhababackend.indevconsultancy.in/dhaba/states/")
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log("error in state", err);
      });
  };

  const getDistrict = (selectedState) => {
    axios
      .get(
        `https://didikadhababackend.indevconsultancy.in/dhaba/filter-districts/${selectedState}`
      )
      .then((res) => {
        setDistrict(res.data);
        setSelectedDistrict("");
      })
      .catch((err) => {
        console.log("error in district", err);
      });
  };

  const getCity = (selectedDistrict) => {
    axios
      .get(
        `https://didikadhababackend.indevconsultancy.in/dhaba/filter-cities/${selectedDistrict}`
      )
      .then((res) => {
        setCity(res.data);
        setSelectedCity("");
      })
      .catch((err) => {
        console.log("error in city", err);
      });
  };

  useEffect(() => {
    getState();
  }, []);

  useEffect(() => {
    if (selectedState) {
      getDistrict(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      getCity(selectedDistrict);
    }
  }, [selectedDistrict]);

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
    <div className="py-2">
      <ToastContainer />
      <div className="bg-white  mx-2 px-2 py-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
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
                  <select
                    id="selectState"
                    className="form-control"
                    style={{ boxShadow: "0px 1px 1px #e4e4e4" }}
                    value={selectedState}
                    onChange={(e) => {
                      const selectedStateId = e.target.value;
                      setSelectedState(selectedStateId);
                    }}
                  >
                    <option value="" disabled={true}>
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
                </div>

                <div className="mb-2">
                  <select
                    id="selectDistrict"
                    className="form-control"
                    style={{ boxShadow: "0px 1px 1px #e4e4e4" }}
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedState}
                  >
                    <option value="" disabled={true}>
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
                </div>

                <div className="mb-2">
                  <select
                    id="selectCity"
                    className="form-control"
                    style={{ boxShadow: "0px 1px 1px #e4e4e4" }}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="" disabled={true}>
                      Select City
                    </option>
                    {city.map((cityItem) => (
                      <option key={cityItem.city_id} value={cityItem.city_id}>
                        {cityItem.city_name}
                      </option>
                    ))}
                  </select>
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
                    <div className="w-full h-96 bg-gray-300 flex flex-col items-center justify-between rounded-md">
                      {" "}
                      <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-500">Camera is off</p>
                      </div>
                      <button
                        onClick={handleToggleCamera}
                        className="mt-4 mb-4 py-2 px-4 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
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
              </div>
            </div>
            <div className="w-full px-4">
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
            <div className="mt-6 flex justify-end w-full">
              <button
                type="submit"
                className="py-2 px-6 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
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

export default DidiRegistration;
