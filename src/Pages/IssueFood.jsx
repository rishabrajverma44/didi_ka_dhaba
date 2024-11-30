import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FiX } from "react-icons/fi";

const IssueFood = () => {
  const [namesDidi] = useState([
    "Didi_1  (GR22)",
    "Didi_2  (NO72)",
    "Didi_3  (GR98)",
    "Didi_4  (GR25)",
    "Didi_5  (GR34)",
    "Didi_6  (GR28)",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [weight, setWeight] = useState("");
  const [userWiseData, setUserWiseData] = useState({});

  const dropdownRef = useRef(null);

  const filteredNames = namesDidi.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectDidi = (name) => {
    setSelectedDidi(name);
    setSearchTerm(name);
    setIsDropdownOpen(false);
  };

  const handleAddItem = (item) => {
    if (selectedDidi) {
      setSelectedItem(item);
      setShowModal(true);
    } else {
      toast.warning("Please select Didi");
    }
  };

  const handleDeleteItem = (item) => {
    if (selectedDidi) {
      setUserWiseData((prevData) => {
        const updatedData = { ...prevData };
        if (updatedData[selectedDidi]?.items[item]) {
          delete updatedData[selectedDidi].items[item];
          if (Object.keys(updatedData[selectedDidi].items).length === 0) {
            delete updatedData[selectedDidi];
          }
        }
        return updatedData;
      });
      toast.success(`${item} removed.`);
    }
  };

  const handleConfirm = () => {
    if (!weight) {
      toast.warning("Please fill out the weight!");
      return;
    }

    setUserWiseData((prevData) => {
      const updatedData = { ...prevData };
      if (!updatedData[selectedDidi]) {
        updatedData[selectedDidi] = { items: {} };
      }
      updatedData[selectedDidi].items[selectedItem] = { weight };
      return updatedData;
    });

    setShowModal(false);
    setWeight("");
  };

  const finalSubmit = () => {
    console.log(userWiseData);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="container py-4">
        <h3 className="text-center mb-4">Issue Food</h3>
        <h4 className="text-xl font-semibold text-gray-800">Select Didi</h4>

        <div ref={dropdownRef} className="relative">
          <input
            type="text"
            placeholder="Search Name..."
            className="cursor-pointer w-full p-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen((x) => !x)}
          />
          {isDropdownOpen && (
            <ul className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto">
              {filteredNames.length > 0 ? (
                filteredNames.map((name, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelectDidi(name)}
                  >
                    {name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 text-center">No didi found</li>
              )}
            </ul>
          )}
        </div>

        {selectedDidi && (
          <div className="mt-3 bg-white shadow rounded-lg p-2 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Submit Items for {selectedDidi}
            </h3>
            {userWiseData[selectedDidi]?.items &&
            Object.entries(userWiseData[selectedDidi]).length > 0 ? (
              <div className="border py-2 px-4 rounded-lg">
                {Object.entries(userWiseData[selectedDidi].items).map(
                  ([item, info]) => (
                    <div
                      key={item}
                      className="text-gray-700 flex justify-between items-center"
                    >
                      <span>{item}</span>
                      <span className="flex items-center space-x-2">
                        <span>{info.weight} kg</span>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <FiX size={24} />
                        </button>
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <></>
            )}
            {Object.keys(userWiseData[selectedDidi]?.items || {}).length >
              0 && (
              <div className="flex justify-end">
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-1 mt-4 rounded-lg"
                  onClick={finalSubmit}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )}

        <div className="w-full max-w-4xl px-4 mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "Chawal (चावल)",
            "Beans (बीन्स)",
            "Gehu (गेहूं)",
            "Daal (दाल)",
            "Makka (मक्का)",
            "Bajra (बाजरा)",
            "Rajma (राजमा)",
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <span className="text-lg font-medium text-gray-800">{item}</span>
              <button
                className="bg-btn-primary hover:bg-btn-hoverPrimary text-white px-3 py-1 rounded-lg"
                onClick={() => handleAddItem(item)}
              >
                +
              </button>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Add Weight for {selectedItem}
              </h3>
              <input
                type="number"
                placeholder="Enter Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 rounded-lg btn-secondary border-1 border-[#A24C4A] text-[#A24C4A]"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 rounded-lg bg-btn-primary hover:bg-btn-hoverPrimary text-white"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default IssueFood;
