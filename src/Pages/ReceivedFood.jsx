import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ReceivedFood = () => {
  const [namesDidi, setDidiName] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [namesThela, setThelaName] = useState([]);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);
  const [searchTermThela, setSearchTermThela] = useState("");
  const [selectedThela, setSelectedThela] = useState(null);
  const [isDropdownOpenThela, setIsDropdownOpenThela] = useState(false);
  const dropdownRefDidi = useRef(null);
  const dropdownRefThela = useRef(null);
  const [finalData, setFinalData] = useState({});

  const filteredDidiNames = namesDidi.filter((item) => {
    const search = String(searchTermDidi || "").toLowerCase();
    return item.full_name.toLowerCase().includes(search);
  });

  const filteredThelaNames = namesThela.filter((item) => {
    const search = String(searchTermThela || "").toLowerCase();
    return item.thela_code.toLowerCase().includes(search);
  });
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
    { item: "Rice", assigned: 5, image: null },
    { item: "Dal", assigned: 10, image: null },
    { item: "Paneer Matter", assigned: 10, image: null },
    { item: "Roti", assigned: 10, image: null },
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

  const getDidi = () => {
    axios
      .get("https://didikadhababackend.indevconsultancy.in/dhaba/didi/")
      .then((res) => {
        if (res.status === 200) {
          const data = [...res.data];
          setDidiName([...data]);
        }
      })
      .catch((e) => {
        console.log("error in get didi", e);
      });
  };

  const getThela = () => {
    axios
      .get("https://didikadhababackend.indevconsultancy.in/dhaba/thelas/")
      .then((res) => {
        if (res.status === 200) {
          const data = [...res.data];
          setThelaName([...data]);
        }
      })
      .catch((e) => {
        console.log("error in geting Thela", e);
      });
  };
  useEffect(() => {
    getDidi();
    getThela();
  }, []);

  const handleReceivedChange = (index, value) => {
    const updatedFoodData = [...foodData];
    updatedFoodData[index].received = value;
    setFoodData(updatedFoodData);
  };

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const updatedFoodData = [...foodData];
      updatedFoodData[index].image = URL.createObjectURL(file);
      setFoodData(updatedFoodData);
    }
  };
  const handleRemoveImage = (index) => {
    const updatedFoodData = [...foodData];
    updatedFoodData[index].image = null;
    setFoodData(updatedFoodData);
  };

  const handleSubmit = async () => {
    const selectedDidiData = namesDidi.find(
      (item) => item.didi_id === selectedDidi
    );
    if (!selectedDidi || !selectedDidiData) {
      toast.error("Please select a valid Didi from the dropdown!");
      return;
    }

    const selectedThelaData = namesThela.find(
      (item) => item.thela_id === selectedThela
    );
    if (!selectedThela || !selectedThelaData) {
      toast.error("Please select a valid Thela from the dropdown!");
      return;
    }

    const did_id = selectedDidiData.didi_id;
    const thela_id = selectedThela;

    const payload = {
      didi_id: did_id,
      thela_id: thela_id,
      food_data: foodData.map(({ item, assigned, received, image }) => ({
        item,
        assigned,
        received,
        image,
      })),
    };
    toast.success("Data submitted successfully!");
    console.log(payload);
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
              setSelectedDidi(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpenDidi(true);
            }}
          />
          {isDropdownOpenDidi && (
            <ul
              className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
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
              setSelectedThela(null);
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
                      setSelectedThela(name.thela_id);
                      setSearchTermThela(name.thela_code);
                      setIsDropdownOpenThela(false);
                    }}
                  >
                    {name.thela_code}
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
                  <th className="text-center">Item</th>
                  <th className="text-center" style={{ minWidth: "100px" }}>
                    Assigned Food (kg)
                  </th>
                  <th className="text-center" style={{ minWidth: "150px" }}>
                    Received Food (kg)
                  </th>
                  <th className="text-center">Image</th>
                  <th className="text-center">Uploaded Image</th>
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
                        placeholder="food in Kg"
                      />
                    </td>
                    <td className="text-center">
                      <label className="btn btn-link text-primary p-0">
                        <FaCamera color="#A24C4A" size={20} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, index)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </td>
                    <td className="text-center">
                      {item.image && (
                        <>
                          <div className="relative">
                            <img
                              src={item.image}
                              alt="Uploaded"
                              className="img-fluid"
                              style={{ maxHeight: "100px", objectFit: "cover" }}
                            />
                            <span className="absolute top-0 right-0 p-1">
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <FiX size={24} />
                              </button>
                            </span>
                          </div>
                        </>
                      )}
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
            disabled={foodData.some((item) => item.received === "")}
          >
            Submit
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReceivedFood;
