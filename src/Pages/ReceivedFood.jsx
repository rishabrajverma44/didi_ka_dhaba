import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera } from "react-icons/fa";

const ReceivedFood = () => {
  const [namesDidi] = useState([
    "Didi_1",
    "Didi_2",
    "Didi_3",
    "Didi_4",
    "Didi_5",
    "Didi_6",
  ]);
  const [currentDate, setCurrentDate] = useState("");
  const [namesThela] = useState([
    "GR034",
    "ND89",
    "GR84",
    "GR76",
    "ND52",
    "GR94",
  ]);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);
  const [searchTermThela, setSearchTermThela] = useState("");
  const [selectedThela, setSelectedThela] = useState(null);
  const [isDropdownOpenThela, setIsDropdownOpenThela] = useState(false);
  const dropdownRefDidi = useRef(null);
  const dropdownRefThela = useRef(null);

  const filteredDidiNames = namesDidi.filter((name) =>
    name.toLowerCase().includes(searchTermDidi.toLowerCase())
  );
  const filteredThelaNames = namesThela.filter((name) =>
    name.toLowerCase().includes(searchTermThela.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefDidi.current &&
        !dropdownRefDidi.current.contains(event.target)
      ) {
        setIsDropdownOpenDidi(false);
      }
      if (
        dropdownRefThela.current &&
        !dropdownRefThela.current.contains(event.target)
      ) {
        setIsDropdownOpenThela(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const [foodData, setFoodData] = useState([
    { item: "Rice", assigned: 5 },
    { item: "Dal", assigned: 10 },
    { item: "Paneer Matter", assigned: 10 },
    { item: "Roti", assigned: 10 },
  ]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleReceivedChange = (index, value) => {
    const updatedFoodData = [...foodData];
    updatedFoodData[index].received = value;
    setFoodData(updatedFoodData);
  };

  const handleImageUpload = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && selectedIndex !== null) {
      const updatedFoodData = [...foodData];
      updatedFoodData[selectedIndex].image = file.name;
      setFoodData(updatedFoodData);
    }
    setShowModal(false);
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", foodData);
  };

  return (
    <div className="bg-gray-50">
      <div className="container py-4">
        <h3 className="text-center mb-4">Received Return Food</h3>

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
            }}
            onClick={() => setIsDropdownOpenDidi(true)}
          />
          {isDropdownOpenDidi && (
            <ul className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto">
              {filteredDidiNames.length > 0 ? (
                filteredDidiNames.map((name, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setSelectedDidi(name);
                      setSearchTermDidi(name);
                      setIsDropdownOpenDidi(false);
                    }}
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

        <h4 className="text-xl font-semibold text-gray-800 mt-2">
          Select Thela
        </h4>

        <div ref={dropdownRefThela} className="relative">
          <input
            type="text"
            placeholder="Search Name..."
            className="cursor-pointer w-full p-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={searchTermThela}
            onChange={(e) => {
              setSearchTermThela(e.target.value);
              setIsDropdownOpenThela(true);
            }}
            onClick={() => setIsDropdownOpenThela(true)}
          />
          {isDropdownOpenThela && (
            <ul className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto">
              {filteredThelaNames.length > 0 ? (
                filteredThelaNames.map((name, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setSelectedThela(name);
                      setSearchTermThela(name);
                      setIsDropdownOpenThela(false);
                    }}
                  >
                    {name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 text-center">
                  No thela found
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="mb-3 text-center">
          <p className="mt-2 text-lg text-[#A24C4A] font-bold">{currentDate}</p>
        </div>

        <div className="">
          <div className="table-responsive mt-2">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Assigned Food (kg)</th>
                  <th>Received Food (kg)</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {foodData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item}</td>
                    <td>{item.assigned} kg</td>
                    <td>
                      <input
                        type="number"
                        value={item.received}
                        onChange={(e) =>
                          handleReceivedChange(index, e.target.value)
                        }
                        className="form-control"
                        placeholder="Enter received food in Kg"
                      />
                    </td>
                    <td className="text-center">
                      <label className="btn btn-link text-primary p-0">
                        <FaCamera color="#A24C4A" size={20} />
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </label>
                      {item.image && <span className="ms-2">{item.image}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="mt-2 border-[#A24C4A] text-[#A24C4A] rounded border-1 px-4 py-1 mt-4 rounded-lg cursor-pointer"
            onClick={handleSubmit}
            disabled={foodData.some((item) => !item.received)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceivedFood;
