import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Breadcrumb from "../../../Components/prebuiltComponent/Breadcrumb";

const AssignEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [selectedStallCode, setSelectedStallCode] = useState(null);
  const [searchTermStall, setSearchTermStall] = useState("thela name");
  const [didiOptions, setDidiOptions] = useState([]);
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);

  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/didi_thela/${id}`)
      .then((res) => {
        if (res.status === 200) {
          const fetchedData = res.data;
          setData(fetchedData);
          setSelectedDateFrom(fetchedData.from_date);
          setSelectedDateTo(fetchedData.to_date);
          setSelectedDidi(fetchedData.didi_id);
          setSearchTermStall(fetchedData.thela_code);
          setSelectedStallCode(fetchedData.thela_id);
          const selectedDidiData = didiOptions.find(
            (didi) => didi.didi_id === fetchedData.didi_id
          );
          if (selectedDidiData) {
            setSearchTermDidi(selectedDidiData.full_name);
          }
        }
      })
      .catch((err) => {
        console.log("getting error", err);
        toast.error("Error fetching data. Please try again.");
      });
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (didiOptions.length > 0) {
      getData();
    }
  }, [didiOptions]);

  const getDidiName = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BACKEND}/didi/`
      );
      if (response.status === 200) {
        setDidiOptions(response.data);
      } else {
        setDidiOptions([]);
      }
    } catch (error) {
      console.log("Error in getting didi:", error);
      setDidiOptions([]);
    }
  };

  useEffect(() => {
    getDidiName();
  }, []);

  const filteredDidiNames = didiOptions.filter((didi) =>
    didi.full_name
      ? didi.full_name.toLowerCase().includes(searchTermDidi.toLowerCase())
      : false
  );

  const dropdownRefDidi = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefDidi.current &&
        !dropdownRefDidi.current.contains(event.target)
      ) {
        setIsDropdownOpenDidi(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const validateForm = () => {
    let errors = {};
    const currentDate = new Date().toISOString().split("T")[0];

    if (!selectedDidi) {
      errors.didi = "Please select a Didi name!";
    }
    if (!selectedStallCode) {
      errors.stall = "Please select a Stall name!";
    }
    if (!selectedDateFrom) {
      errors.dateFrom = "Please select a From date!";
    } else if (selectedDateFrom < currentDate) {
      errors.dateFrom = "From date cannot be in the past!";
    }
    if (!selectedDateTo) {
      errors.dateTo = "Please select a To date!";
    } else if (selectedDateTo < currentDate) {
      errors.dateTo = "To date cannot be in the past!";
    } else if (new Date(selectedDateFrom) > new Date(selectedDateTo)) {
      errors.dateTo = "To date should be greater than From date!";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendData = async (payload) => {
    try {
      axios
        .put(`${process.env.REACT_APP_API_BACKEND}/didi_thela/${id}/`, payload)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            toast.success(res.data.message);
            setTimeout(() => {
              navigate("/assign_list");
            }, 1000);
          }
        })
        .catch((err) => {
          if (err.status === 400) {
            toast.error("This Didi and Stall allready Assigned");
          }
          console.log("ree", err);
        });
    } catch (error) {
      console.log("error in assingment", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form...");

    if (!validateForm()) {
      console.log("Form validation failed.");
      return;
    }

    console.log("Form validated successfully");

    if (!selectedDidi) {
      toast.error("Please select a Didi name!");
      return;
    }

    const payload = {
      didi_id: selectedDidi,
      thela_id: selectedStallCode,
      from_date: selectedDateFrom,
      to_date: selectedDateTo,
    };
    await sendData(payload);
  };

  const breadcrumbItems = [
    { label: "Assign List", href: "/assign_list" },
    { label: "Assign", href: `` },
  ];

  return (
    <div
      className="px-6 md:px-12 bg-slate-100 py-2"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer />
      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Edite Assign
          </b>
        </div>

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div>
        <div className="mx-auto p-6">
          <h2 className="text-xl flex flex-row mb-6 text-slate-600">
            <span className="mx-4 w-50 text-center">
              <span>From </span>
              <input
                type="date"
                id="dateFrom"
                value={selectedDateFrom}
                onChange={(e) => setSelectedDateFrom(e.target.value)}
                className="mx-2 p-1 pl-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200"
              />
              {formErrors.dateFrom && (
                <div className="text-red-500 text-sm">
                  {formErrors.dateFrom}
                </div>
              )}
            </span>
            <span className="mx-4 w-50  text-center">
              <span>To </span>
              <input
                type="date"
                id="dateTo"
                value={selectedDateTo || ""}
                onChange={(e) => setSelectedDateTo(e.target.value)}
                className="mx-2 p-1 pl-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200"
              />
              {formErrors.dateTo && (
                <div className="text-red-500 text-sm">{formErrors.dateTo}</div>
              )}
            </span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="flex my-6 space-x-6">
              <div ref={dropdownRefDidi} className="relative w-1/2">
                <label className="block text-slate-600 mb-1 font-medium">
                  Select Didi Name
                </label>
                <input
                  type="text"
                  placeholder="Search Didi Name..."
                  className="cursor-pointer w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
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
                  <ul className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto">
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
                      <li className="p-2 text-gray-500 text-center">
                        No Didi found
                      </li>
                    )}
                  </ul>
                )}
                {formErrors.didi && (
                  <div className="text-red-500 text-sm mt-1">
                    {formErrors.didi}
                  </div>
                )}
              </div>

              <div className="w-1/2">
                <label className="block text-slate-600 mb-1 font-medium">
                  Assigned Stall Code
                </label>
                <input
                  type="text"
                  disabled={true}
                  placeholder="Search Stall Name..."
                  className="bg-white cursor-pointer w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  value={searchTermStall}
                />
              </div>
            </div>

            <div className="flex justify-end items-center pt-12">
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-dark hover:bg-[#53230A] text-white px-4 py-2 rounded-md transition-colors"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignEdit;
