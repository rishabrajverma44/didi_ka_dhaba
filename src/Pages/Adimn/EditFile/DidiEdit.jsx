import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const DidiEdit = () => {
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
    selectedState: Yup.string().required("State is required"),
    selectedDistrict: Yup.string().required("District is required"),
    selectedCity: Yup.string().required("City is required"),
  });

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

  // Use effects to fetch state, district, and city on state and district change
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
    const payload = { ...values };
    console.log(payload);

    // You can add a backend POST request here, for example:
    // axios.post("/api/register", payload)
    //   .then(response => {
    //     // Handle success
    //   })
    //   .catch(error => {
    //     // Handle error
    //   });

    resetForm(); // Optional, to clear the form after submit
  };

  return (
    <div className="py-2">
      <ToastContainer />
      <div className="bg-white mx-2 px-2 py-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true} // Add this to reinitialize the form when data changes
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

                  {/* State Dropdown */}
                  <div className="mb-2">
                    <select
                      id="selectedState"
                      name="selectedState"
                      className="form-control"
                      value={values.selectedState}
                      onChange={(e) => {
                        setFieldValue("selectedState", e.target.value);
                        setFieldValue("selectedDistrict", "");
                        setFieldValue("selectedCity", "");
                        getDistrict(e.target.value);
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

                  {/* District Dropdown */}
                  <div className="mb-2">
                    <select
                      id="selectedDistrict"
                      name="selectedDistrict"
                      className="form-control"
                      value={values.selectedDistrict}
                      onChange={(e) => {
                        setFieldValue("selectedDistrict", e.target.value);
                        setFieldValue("selectedCity", "");
                        getCity(e.target.value);
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

                  {/* City Dropdown */}
                  <div className="mb-2">
                    <select
                      id="selectedCity"
                      name="selectedCity"
                      className="form-control"
                      value={values.selectedCity}
                      onChange={(e) =>
                        setFieldValue("selectedCity", e.target.value)
                      }
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

                  {/* Mobile Number */}
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

                  {/* Alternate Mobile Number */}
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
              </div>

              {/* Address */}
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

              {/* Submit Button */}
              <div className="mt-6 flex justify-end w-full">
                <button
                  type="submit"
                  className="py-2 px-6 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DidiEdit;
