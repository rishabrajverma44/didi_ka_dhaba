import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";

const IssueFood = () => {
  const [namesDidi, setDidiName] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [weight, setWeight] = useState("");
  const [userWiseData, setUserWiseData] = useState({});
  const [currentDate, setCurrentDate] = useState("");

  const dropdownRef = useRef(null);
  const filteredNames = namesDidi.filter((item) => {
    const search = String(searchTerm || "").toLowerCase();
    return item.didi_name_and_thela_code.toLowerCase().includes(search);
  });

  const handleSelectDidi = (name) => {
    setSelectedDidi(name.didi_name_and_thela_code);
    setSearchTerm(name.didi_name_and_thela_code);
    setIsDropdownOpen(false);
  };

  const restoreFoodItem = (itemName) => {
    setFoodItem((prev) => {
      const itemExists = prev.some((item) => item.food_name === itemName);
      if (!itemExists) {
        const restoredItem = {
          food_name: itemName,
          food_id: Object.keys(userWiseData[selectedDidi]?.items || {}).find(
            (key) => key === itemName
          ),
        };
        return [...prev, restoredItem];
      }
      return prev;
    });
  };

  const handleDeleteItem = (item) => {
    if (selectedDidi) {
      setUserWiseData((prevData) => {
        const updatedData = { ...prevData };
        const selectedDidiData = updatedData[selectedDidi]?.items;

        if (selectedDidiData && selectedDidiData[item]) {
          delete selectedDidiData[item];
          if (Object.keys(selectedDidiData).length === 0) {
            delete updatedData[selectedDidi];
          }
        }
        return updatedData;
      });

      restoreFoodItem(item);
      toast.success(`${item} removed.`);
    } else {
      toast.warning("Please select Didi");
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

    const foodItemToRemove = foodItem.find(
      (item) => item.food_name === selectedItem
    );
    if (foodItemToRemove) {
      setFoodItem((prev) =>
        prev.filter(
          (food) =>
            food.food_id !== foodItemToRemove.food_id &&
            food.food_name !== foodItemToRemove.food_name
        )
      );
    }
    setShowModal(false);
    setWeight("");
  };

  const checkInternetConnection = async () => {
    try {
      const response = await fetch(
        "https://api.allorigins.win/raw?url=https://www.google.com",
        {
          method: "HEAD",
          cache: "no-cache",
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const issueFood = async (payload) => {
    const actualStatus = await checkInternetConnection();
    if (actualStatus) {
      axios
        .post(
          "https://didikadhababackend.indevconsultancy.in/dhaba/issue-food/",
          payload
        )
        .then((res) => {
          if (res.status === 201) {
            toast.success(
              `Issued ${payload.food_items.length} Items to ${selectedDidi}`
            );
            setUserWiseData({});
            setSelectedDidi(null);
            setSearchTerm("");
          } else {
            toast.error("Something went wrong!");
          }
        })
        .catch((err) => {
          console.log("Error in sending issue food:", err);
        });
    } else {
      Swal.fire({
        html: `<b>Check Internet connection!</b>`,
        allowOutsideClick: false,
        confirmButtonColor: "#A24C4A",
      });
    }
  };
  const handleAddItem = (item) => {
    if (selectedDidi) {
      setSelectedItem(item.food_name);
      setShowModal(true);
    } else {
      toast.warning("Please select Didi");
    }
  };

  const finalSubmit = async () => {
    if (!selectedDidi) {
      toast.warning("Please select a Didi!");
      return;
    }

    const selectedDidiData = namesDidi.find(
      (item) => item.didi_name_and_thela_code === selectedDidi
    );

    if (!selectedDidiData) {
      toast.error("Invalid Didi selected!");
      return;
    }

    const didiThelaId = selectedDidiData.didi_thela_id;
    const items = userWiseData[selectedDidi]?.items || {};

    if (Object.keys(items).length === 0) {
      toast.warning("No items to submit!");
      return;
    }

    const foodItems = Object.entries(items)
      .map(([foodName, info]) => {
        const newFoodData = foodData.find(
          (item) => item.food_name.toLowerCase() === foodName.toLowerCase()
        );
        if (!newFoodData) {
          toast.error(`Food item "${foodName}" is not valid!`);
          return null;
        }

        if (!info?.weight || isNaN(info.weight) || info.weight <= 0) {
          toast.warning(`Invalid weight for "${foodName}".`);
          return null;
        }

        return {
          food_id: newFoodData.food_id,
          quantity: parseFloat(info.weight),
        };
      })
      .filter(Boolean);

    if (foodItems.length === 0) {
      toast.warning("No valid food items to submit!");
      return;
    }

    const payload = {
      didi_thela_id: didiThelaId,
      food_items: foodItems,
    };

    const actualStatus = await checkInternetConnection();
    if (actualStatus) {
      issueFood(payload);
    } else {
      Swal.fire({
        html: `<b>Check Internet connection!</b>`,
        allowOutsideClick: false,
        confirmButtonColor: "#A24C4A",
      });
    }
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

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const getFoodItem = async () => {
    try {
      axios
        .get("https://didikadhababackend.indevconsultancy.in/dhaba/foods/")
        .then((res) => {
          if (res.status === 200) {
            setFoodData(res.data);
          } else {
            setFoodData([]);
          }
        })
        .catch((e) => {
          console.log("Error in food item:", e);
        });
    } catch (error) {
      console.log("Error in getting food items:", error);
    }
  };

  const getDidiName = async () => {
    try {
      axios
        .get("https://didikadhababackend.indevconsultancy.in/dhaba/didi_thela/")
        .then((res) => {
          if (res.status === 200) {
            setDidiName(res.data);
          } else {
            setDidiName([]);
          }
        })
        .catch((e) => {
          console.log("Error in getting didi thela:", e);
        });
    } catch (error) {
      console.log("Error in getting didi thela:", error);
    }
  };

  useEffect(() => {
    getFoodItem();
    getDidiName();
  }, []);

  useEffect(() => {
    setFoodItem(foodData);
  }, [foodData]);

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
                    {name.didi_name_and_thela_code}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 text-center">No didi found</li>
              )}
            </ul>
          )}
        </div>
        <div className="mb-3">
          <p className="mt-2 text-lg text-[#A24C4A] font-bold">{currentDate}</p>
        </div>

        <div className="flex justify-center">
          {selectedDidi && (
            <div className="mt-3 bg-white shadow rounded-lg p-2 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                Add Items for {selectedDidi}
              </h3>
              {userWiseData[selectedDidi]?.items &&
              Object.entries(userWiseData[selectedDidi]).length > 0 ? (
                <div className="border py-2 px-1 rounded-lg">
                  {Object.entries(userWiseData[selectedDidi].items).map(
                    ([item, info]) => (
                      <div
                        key={item}
                        className="text-gray-700 flex justify-between items-center border-b-2 mb-2"
                      >
                        <span style={{ width: "230px" }}>{item}</span>
                        <span
                          style={{ width: "100px" }}
                          className="flex justify-between items-center space-x-2"
                        >
                          <span>{info.weight} kg</span>
                          <button
                            className="text-red-500 hover:text-red-700 p-0 m-0"
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
                <>
                  <div className="flex justify-center">No items selected</div>
                </>
              )}
              {Object.keys(userWiseData[selectedDidi]?.items || {}).length >
                0 && (
                <div className="flex justify-end">
                  <button
                    className="mt-2 border-[#A24C4A] text-[#A24C4A] rounded border-1 px-4 py-1 mt-4 rounded-lg"
                    onClick={finalSubmit}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-4xl px-2 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {foodItem.length > 0 &&
              foodItem.map((item) => (
                <div
                  key={item.food_id}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {item.food_name}
                  </span>
                  <button
                    className="bg-btn-primary hover:bg-btn-hoverPrimary text-white px-3 py-1 rounded-lg"
                    onClick={() => handleAddItem(item)}
                  >
                    +
                  </button>
                </div>
              ))}
          </div>
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
