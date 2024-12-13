import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const DidiAssignment = () => {
  const [loading, setLoading] = useState(true);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [searchTermStall, setSearchTermStall] = useState("");
  const [isDropdownOpenStall, setIsDropdownOpenStall] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const didiOptions = [
    { didi_id: 1, didi_name_and_thela_code: "Didi A - 001" },
    { didi_id: 2, didi_name_and_thela_code: "Didi B - 002" },
    { didi_id: 3, didi_name_and_thela_code: "Didi C - 003" },
  ];

  const stallOptions = [
    { stall_id: 1, stall_name_and_code: "Stall 1 - S001" },
    { stall_id: 2, stall_name_and_code: "Stall 2 - S002" },
    { stall_id: 3, stall_name_and_code: "Stall 3 - S003" },
  ];

  const filteredDidiNames = didiOptions.filter((didi) =>
    didi.didi_name_and_thela_code
      .toLowerCase()
      .includes(searchTermDidi.toLowerCase())
  );

  const filteredStallNames = stallOptions.filter((stall) =>
    stall.stall_name_and_code
      .toLowerCase()
      .includes(searchTermStall.toLowerCase())
  );

  const dropdownRefDidi = useRef(null);
  const dropdownRefStall = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefDidi.current &&
        !dropdownRefDidi.current.contains(event.target)
      ) {
        setIsDropdownOpenDidi(false);
      }
      if (
        dropdownRefStall.current &&
        !dropdownRefStall.current.contains(event.target)
      ) {
        setIsDropdownOpenStall(false);
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
    if (!selectedStall) {
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

    console.log("Validation Errors:", errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
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

    if (!selectedStall) {
      toast.error("Please select a Stall name!");
      return;
    }

    toast.success(
      `Successfully assigned ${searchTermDidi} to ${searchTermStall}`
    );

    console.log("Form Data Submitted:", {
      didi: selectedDidi,
      stall: selectedStall,
      dateFrom: selectedDateFrom,
      dateTo: selectedDateTo,
    });
  };

  return (
    <div className="bg-gray-50 py-2 px-4" style={{ height: "99vh" }}>
      <ToastContainer />
      <div>
        <div className="mx-auto my-8 p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-600">
            <div className="">
              <span className="mx-2">Assign Didi to Stall</span>
            </div>
          </h2>

          <h2 className="text-xl font-bold flex flex-row   mb-6 text-slate-600">
            <span className="mx-4 w-50 text-center">
              <span>From </span>
              <input
                type="date"
                id="dateFrom"
                value={selectedDateFrom}
                onChange={(e) => setSelectedDateFrom(e.target.value)}
                className="mx-2 p-2 pl-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200"
              />
              {formErrors.dateFrom && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.dateFrom}
                </div>
              )}
            </span>
            <span className="mx-4 w-50  text-center">
              <span>To </span>
              <input
                type="date"
                id="dateTo"
                value={selectedDateTo}
                onChange={(e) => setSelectedDateTo(e.target.value)}
                className="mx-2 p-2 pl-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200"
              />
              {formErrors.dateTo && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.dateTo}
                </div>
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
                            setSearchTermDidi(name.didi_name_and_thela_code);
                            setIsDropdownOpenDidi(false);
                          }}
                        >
                          {name.didi_name_and_thela_code}
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

              <div ref={dropdownRefStall} className="relative w-1/2">
                <label className="block text-slate-600 mb-1 font-medium">
                  Select Stall Name
                </label>
                <input
                  type="text"
                  placeholder="Search Stall Name..."
                  className="cursor-pointer w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  value={searchTermStall}
                  onChange={(e) => {
                    setSearchTermStall(e.target.value);
                    setIsDropdownOpenStall(true);
                    setSelectedStall(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpenStall(true);
                  }}
                />
                {isDropdownOpenStall && (
                  <ul className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto">
                    {filteredStallNames.length > 0 ? (
                      filteredStallNames.map((stall, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            setSelectedStall(stall.stall_id);
                            setSearchTermStall(stall.stall_name_and_code);
                            setIsDropdownOpenStall(false);
                          }}
                        >
                          {stall.stall_name_and_code}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500 text-center">
                        No Stall found
                      </li>
                    )}
                  </ul>
                )}
                {formErrors.stall && (
                  <div className="text-red-500 text-sm mt-1">
                    {formErrors.stall}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-[#A24C4A] text-white px-4 py-2 rounded-md hover:bg-[#53230A] transition-colors"
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

export default DidiAssignment;
