import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const mealCategories = [{ Breakfast: 1 }, { Lunch: 2 }, { Dinner: 3 }];
const unitTypes = [{ kg: 1 }, { liter: 2 }, { pieces: 3 }];

const AddFood = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
  const [isDropdownOpenUnit, setIsDropdownOpenUnit] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const dropdownRefCategory = useRef(null);
  const dropdownRefUnit = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRefCategory.current &&
        !dropdownRefCategory.current.contains(e.target)
      ) {
        setIsDropdownOpenCategory(false);
      }
      if (
        dropdownRefUnit.current &&
        !dropdownRefUnit.current.contains(e.target)
      ) {
        setIsDropdownOpenUnit(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!foodName) {
      errors.foodName = "Food name is required.";
    }
    if (!selectedCategory) {
      errors.category = "Meal category is required.";
    }
    if (!foodPrice || foodPrice <= 0) {
      errors.foodPrice = "Food price is required and must be greater than 0.";
    }
    if (!selectedUnit) {
      errors.unit = "Unit type is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendData = async (payload) => {
    try {
      const res = axios
        .post(
          "https://didikadhababackend.indevconsultancy.in/dhaba/foodmaster/",
          payload
        )
        .then((res) => {
          if (res.status === 201) {
            console.log(res);
            setSelectedCategory("");
            setSelectedUnit("");
            setFoodName("");
            setFoodPrice("");
            navigate("/listfood");
            toast.success("Food added Successfully !");
          }
        });
    } catch (error) {
      console.log("error, in sending", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedCategoryId = mealCategories.find(
        (category) => Object.keys(category)[0] === selectedCategory
      )?.[selectedCategory];

      const selectedUnitId = unitTypes.find(
        (unit) => Object.keys(unit)[0] === selectedUnit
      )?.[selectedUnit];

      const payload = {
        food_name: foodName,
        food_category: selectedCategoryId,
        per_unit_price: Number(foodPrice),
        unit_id: selectedUnitId,
      };
      await sendData(payload);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-gray-100">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center text-slate-600">
        Food Master
      </h2>
      <div className="mx-auto my-8 p-6 bg-white shadow-md rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-slate-600 mb-1 font-medium">
                Food Name
              </label>
              <input
                type="text"
                placeholder="Enter Food Name..."
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
              {formErrors.foodName && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.foodName}
                </div>
              )}
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-slate-600 mb-1 font-medium">
                Select Meal Category
              </label>
              <input
                type="text"
                placeholder="Select Meal Category..."
                className="cursor-pointer w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={selectedCategory}
                readOnly
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpenCategory(true);
                }}
              />
              {isDropdownOpenCategory && (
                <ul
                  ref={dropdownRefCategory}
                  className="absolute z-10 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto"
                >
                  {mealCategories.map((category, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(Object.keys(category)[0]);
                        setIsDropdownOpenCategory(false);
                      }}
                    >
                      {Object.keys(category)[0]}
                    </li>
                  ))}
                </ul>
              )}
              {formErrors.category && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.category}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-slate-600 mb-1 font-medium">
                Food Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter Food Price..."
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={foodPrice}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0) {
                    setFoodPrice(value);
                  } else {
                    setFoodPrice(0);
                  }
                }}
              />
              {formErrors.foodPrice && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.foodPrice}
                </div>
              )}
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-slate-600 mb-1 font-medium">
                Select Unit Type
              </label>
              <input
                type="text"
                placeholder="Select Unit Type..."
                className="cursor-pointer w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={selectedUnit}
                readOnly
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpenUnit(true);
                }}
              />
              {isDropdownOpenUnit && (
                <ul
                  ref={dropdownRefUnit}
                  className="absolute z-10 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto"
                >
                  {unitTypes.map((unit, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedUnit(Object.keys(unit)[0]);
                        setIsDropdownOpenUnit(false);
                      }}
                    >
                      {Object.keys(unit)[0]}
                    </li>
                  ))}
                </ul>
              )}
              {formErrors.unit && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.unit}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end my-4">
            <button
              type="submit"
              className={`p-2 rounded-lg hover:bg-[#53230A] ${
                isLoading ? "bg-gray-300" : "bg-[#A24C4A] text-white"
              }`}
              onClick={() => validateForm()}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFood;