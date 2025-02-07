import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ConfirmNavigation from "../Components/prebuiltComponent/ConfirmNavigation";

const IssueFood = () => {
  const navigate = useNavigate();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [namesDidi, setDidiName] = useState([]);
  const [currentFoodData, setCurrentFoodData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [value, setValue] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [mealType, setMealType] = useState("");
  const [breakfast, setBreakFast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [plateValues, setPlateValues] = useState({});
  const [quantities, setQuantities] = useState({});
  const [errors, setErrors] = useState({});

  const handleMealChange = (e) => {
    setMealType(e.target.value);
  };

  const dropdownRef = useRef(null);
  const filteredNames = namesDidi.filter((item) => {
    const search = String(searchTerm || "").toLowerCase();
    return item.didi_name_and_thela_code.toLowerCase().includes(search);
  });

  const getFoodItem = async () => {
    try {
      axios
        .get(
          `${process.env.REACT_APP_API_BACKEND}/foodmaster/category/${mealType}`
        )
        .then((res) => {
          if (res.status === 200) {
            setCurrentFoodData(res.data.data);
          } else {
            setCurrentFoodData([]);
          }
        })
        .catch((e) => {
          console.log("Error in food item:", e);
        });
    } catch (error) {
      console.log("Error in getting food items:", error);
    }
  };

  useEffect(() => {
    getFoodItem();
  }, [mealType]);

  const handleSelectDidi = (name) => {
    setSelectedDidi(name.didi_thela_id);
    setSearchTerm(name.didi_name_and_thela_code);
    setIsDropdownOpen(false);
    setHasUnsavedChanges(true);
  };

  const handleRemoveItem = (item, meal) => {
    if (meal === "1") {
      setBreakFast((prev) =>
        prev.filter((food) => food.food_id !== item.food_id)
      );
    }
    if (meal === "2") {
      setLunch((prev) => prev.filter((food) => food.food_id !== item.food_id));
    }
    if (meal === "3") {
      setDinner((prev) => prev.filter((food) => food.food_id !== item.food_id));
    }
  };

  const handleConfirm = (item) => {
    if (!value) {
      toast.warning("Please fill out the value!");
      return;
    }

    const newItem = {
      food_id: item.food_id,
      food_name: item.food_name,
      unit_name: item.unit_name,
      quantity: value,
    };

    const updateMealList = (mealListSetter) => {
      mealListSetter((prev) => {
        const existingIndex = prev.findIndex(
          (food) => food.food_id === newItem.food_id
        );
        if (existingIndex !== -1) {
          const updatedList = [...prev];
          updatedList[existingIndex] = newItem;
          return updatedList;
        }
        return [...prev, newItem];
      });
    };

    if (mealType === "1") {
      updateMealList(setBreakFast);
    }

    if (mealType === "2") {
      updateMealList(setLunch);
    }

    if (mealType === "3") {
      updateMealList(setDinner);
    }

    setValue("");
    setShowModal(false);
  };

  const handleAddItem = (item) => {
    if (selectedDidi) {
      setSelectedItem(item);
      setShowModal(true);
    } else {
      toast.warning("Please select Didi");
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

  const getPlates = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/plates/`)
      .then((res) => {
        setPlateValues(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleInputChange = (plate_id, value) => {
    if (/^[0-9]*$/.test(value)) {
      setQuantities((prev) => ({
        ...prev,
        [plate_id]: value ? parseInt(value, 10) : "",
      }));
      setErrors((prev) => ({
        ...prev,
        [plate_id]: "",
      }));
    }
  };
  const validateQuantities = () => {
    const newErrors = {};
    plateValues.forEach(({ plate_id }) => {
      const quantity = quantities[plate_id];
      if (quantity === "" || quantity === undefined) {
        newErrors[plate_id] = "Required";
      } else if (quantity < 0) {
        newErrors[plate_id] = "Quantity must be 0 or greater";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDidiName = async () => {
    try {
      axios
        .get(`${process.env.REACT_APP_API_BACKEND}/didi_thela/`)
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
    getDidiName();
    getPlates();
  }, []);

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

  const MealSection = ({ title, items, handleRemoveItem, mealType }) => (
    <>
      {items && items.length > 0 ? (
        <>
          <h5 className="text-center mt-2 text-lg text-[#A24C4A] font-bold">
            {title}:
          </h5>
          {items.map((item, index) => (
            <div
              key={index}
              className="border py-1 px-1 rounded-lg flex justify-between items-center my-2"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-medium">{item.food_name}</span>
                <span className="text-sm text-gray-600">
                  {item.quantity} - {item.unit_name}
                </span>
              </div>
              <button
                onClick={() => handleRemoveItem(item, mealType)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX size={24} />
              </button>
            </div>
          ))}
        </>
      ) : null}
    </>
  );

  const postFoodItem = async (payload) => {
    setIsLoading(true);
    const actualStatus = await checkInternetConnection();
    if (true) {
      setIsLoading(true);
      axios
        .post(`${process.env.REACT_APP_API_BACKEND}/issue-food/`, payload)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            setSelectedDidi(null);
            setMealType("");
            setSearchTerm("");
            setCurrentFoodData([]);
            setDinner([]);
            setBreakFast([]);
            setLunch([]);
            setTimeout(() => {
              navigate("/mobilehome");
            }, 1000);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log("error in sending", err);
        });
    } else {
      Swal.fire({
        html: `<b>Check Internet connection!</b>`,
        allowOutsideClick: false,
        confirmButtonColor: "#A24C4A",
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!selectedDidi) {
      toast.error("Please select didi");
      return;
    }
    if (!mealType) {
      toast.error("Please select category");
      return;
    }
    if (breakfast.length === 0 && lunch.length === 0 && dinner.length === 0) {
      toast.error("Please select any Food");
      return;
    }

    if (!validateQuantities()) {
      toast.error("Please fill Plate Quantity");
      return;
    }
    const formattedQuantities = plateValues.map(({ plate_id }) => ({
      plate_id: plate_id,
      quantity: quantities[plate_id] || 0,
    }));

    const payload = {
      didi_thela_id: selectedDidi,
      meals: [
        {
          meal_type: "Breakfast",
          food_items: breakfast.map(
            ({ food_name, unit_name, ...rest }) => rest
          ),
        },
        {
          meal_type: "Lunch",
          food_items: lunch.map(({ food_name, unit_name, ...rest }) => rest),
        },
        {
          meal_type: "Dinner",
          food_items: dinner.map(({ food_name, unit_name, ...rest }) => rest),
        },
      ],
      plates: formattedQuantities,
    };
    await postFoodItem(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <ConfirmNavigation
        targetUrl="/mobilehome"
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <div className="container py-4">
        <div>
          <h3 className="text-center mb-4">Issue Food</h3>
          <h4 className="text-xl font-semibold text-gray-800">
            Select Didi (stall code)
          </h4>

          <div className="relative">
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
                  <li className="p-2 text-gray-500 text-center">
                    No didi found
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="mb-3">
            <p className="mt-2 text-lg text-[#A24C4A] font-bold">
              {currentDate}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800">
            Select Category
          </h4>
          <div className="relative">
            <select
              id="meal"
              name="meal"
              value={mealType}
              onChange={handleMealChange}
              className="cursor-pointer w-full p-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white text-gray-900 appearance-none"
            >
              <option
                value=""
                className="cursor-pointer w-full p-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                disabled
              >
                Select Meal
              </option>
              <option value="1">Breakfast</option>
              <option value="2">Lunch</option>
              <option value="3">Dinner</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-20"></div>
          </div>
        </div>

        <div className="flex justify-center">
          {selectedDidi && (
            <div className="mt-3 bg-white shadow-md rounded-lg p-2 w-full max-w-xl">
              <h3 className="text-xl flex items-center justify-between font-semibold text-gray-800 mb-1">
                <span>Add Items for {searchTerm}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    setDinner([]);
                    setBreakFast([]);
                    setLunch([]);
                  }}
                >
                  {(dinner.length > 0 ||
                    lunch.length > 0 ||
                    breakfast.length > 0) && <FiX size={30} />}
                </button>
              </h3>

              <div>
                {" "}
                <div>
                  <MealSection
                    title="Breakfast Items"
                    items={breakfast}
                    handleRemoveItem={handleRemoveItem}
                    mealType="1"
                  />
                  <MealSection
                    title="Lunch Items"
                    items={lunch}
                    handleRemoveItem={handleRemoveItem}
                    mealType="2"
                  />
                  <MealSection
                    title="Dinner Items"
                    items={dinner}
                    handleRemoveItem={handleRemoveItem}
                    mealType="3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {(breakfast || lunch || dinner) &&
            (breakfast.length > 0 || lunch.length > 0 || dinner.length > 0) && (
              <h5 className="mt-3 text-center mt-2 text-xl text-[#A24C4A] font-bold">
                Enter Plates
              </h5>
            )}
        </div>
        <div className="flex justify-center">
          {(breakfast || lunch || dinner) &&
          (breakfast.length > 0 || lunch.length > 0 || dinner.length > 0) ? (
            <div className="overflow-x-auto w-full p-2">
              <div className="flex w-full justify-center gap-4 min-w-max">
                {plateValues.map(({ plate_id, plate_type }) => (
                  <div
                    key={plate_id}
                    className="flex flex-col items-center shrink-0"
                  >
                    <div className="font-bold text-center">{plate_type}</div>
                    <input
                      type="number"
                      value={quantities[plate_id] ?? ""}
                      placeholder="Quantity"
                      onChange={(e) =>
                        handleInputChange(plate_id, e.target.value)
                      }
                      className={`px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        errors[plate_id] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[plate_id] && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors[plate_id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full max-w-4xl px-2 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentFoodData.length > 0 &&
              currentFoodData.map((item) => (
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

        {selectedDidi && (
          <div className="flex justify-between my-4">
            <button
              className={`p-2 rounded-lg ${
                isLoading ? "bg-gray-300" : "bg-[#A24C4A] text-white"
              } ml-auto`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Enter value for {selectedItem.food_name} in{" "}
                {selectedItem.unit_name}
              </h3>
              <input
                type="number"
                placeholder={`Type here`}
                value={value}
                min="1"
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === "" || Number(newValue) > 0) {
                    setValue(newValue);
                  }
                }}
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
                  onClick={() => handleConfirm(selectedItem)}
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
