import React, { useEffect, useMemo, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera } from "react-icons/fa";
import { FiX, FiRefreshCcw } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Webcam from "react-webcam";

const ReceivedFood = () => {
  const [namesDidi, setDidiName] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const dropdownRefDidi = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [finalData, setFinalData] = useState([]);

  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(true);

  const webcamRefs = useRef([]);

  const toggleCameraFacingMode = () => {
    setIsUsingFrontCamera((prev) => !prev);
  };

  const toggleCamera = (index) => {
    // setIsCameraOn((prev) =>
    //   prev.map((state, idx) => (idx === index ? !state : state))
    // );
  };

  const handleCapture = (index) => {
    if (webcamRefs.current[index]) {
      const imageSrc = webcamRefs.current[index].getScreenshot();

      toggleCamera(index);
    }
  };

  const handleRemoveImage = (index) => {};

  const filteredDidiNames = namesDidi.filter((item) => {
    const search = String(searchTermDidi || "").toLowerCase();
    return item.full_name.toLowerCase().includes(search);
  });

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

  const getDidi = async () => {
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

  useEffect(() => {
    getDidi();
  }, []);

  const getAssignedFoods = async (selectedDidi, date) => {
    const payload = {
      didi_id: selectedDidi,
      issue_date: date,
    };

    const meals = ["Break-fast", "Lunch", "Dinner"];

    try {
      for (const meal of meals) {
        const res = await axios.post(
          "https://didikadhababackend.indevconsultancy.in/dhaba/filter-issue-food/",
          { ...payload, meal }
        );

        if (res.status === 200 && res.data.length > 0) {
          const mealData = res.data.map((item) => ({
            ...item,
            received_quantity: "",
          }));

          if (meal === "Break-fast") {
            setBreakfast(mealData);
          }
          if (meal === "Lunch") {
            setLunch(mealData);
          }
          if (meal === "Dinner") {
            setDinner(mealData);
          }
        }
      }

      toast.info(
        `Successfully fetched all meals for ${selectedDidi} on ${date}`
      );
    } catch (e) {
      setBreakfast([]);
      setDinner([]);
      setLunch([]);
      console.error("Error fetching assigned foods:", e);
      toast.error("An error occurred while fetching assigned foods.");
    }
  };

  const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (selectedDidi != null && getDate) {
      getAssignedFoods(selectedDidi, "2024-12-07");
    }
  }, [selectedDidi]);

  const sendRecivedFood = async (payload) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://didikadhababackend.indevconsultancy.in/dhaba/received-return-food-list/",
        payload
      );
      if (res.status === 201) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success(`Food Received by ${searchTermDidi}`);
        setIsLoading(false);
        setSearchTermDidi("");
      }
    } catch (e) {
      console.log("Error in sending received food:", e);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };
  const handleReceivedChange = (mealType, itemIndex, value) => {
    const parsedValue = value === "" ? 0 : parseFloat(value);
    let errorMessage = "";

    const currentItem =
      mealType === "Breakfast"
        ? breakfast[itemIndex]
        : mealType === "Lunch"
        ? lunch[itemIndex]
        : dinner[itemIndex];

    if (isNaN(parsedValue)) {
      errorMessage = "Not valid";
    } else if (parsedValue < 0) {
      errorMessage = "Received quantity cannot be negative";
    } else if (parsedValue > currentItem.quantity) {
      errorMessage = `Received quantity cannot exceed ${currentItem.quantity}`;
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [`receivedQuantity${mealType}-${itemIndex}`]: errorMessage,
    }));

    if (!errorMessage) {
      if (mealType === "Breakfast") {
        setBreakfast((prevBreakfast) =>
          prevBreakfast.map((item, index) =>
            index === itemIndex
              ? { ...item, received_quantity: parsedValue }
              : item
          )
        );
      } else if (mealType === "Lunch") {
        setLunch((prevLunch) =>
          prevLunch.map((item, index) =>
            index === itemIndex
              ? { ...item, received_quantity: parsedValue }
              : item
          )
        );
      } else if (mealType === "Dinner") {
        setDinner((prevDinner) =>
          prevDinner.map((item, index) =>
            index === itemIndex
              ? { ...item, received_quantity: parsedValue }
              : item
          )
        );
      }
    }
  };

  useEffect(() => {
    const updatedData = [
      ...breakfast.map((item) => ({
        received_quantity: item.received_quantity,
        food_id: item.food_id,
        meal_type: "Breakfast",
      })),
      ...lunch.map((item) => ({
        received_quantity: item.received_quantity,
        food_id: item.food_id,
        meal_type: "Lunch",
      })),
      ...dinner.map((item) => ({
        received_quantity: item.received_quantity,
        food_id: item.food_id,
        meal_type: "Dinner",
      })),
    ];

    setFinalData(updatedData);
  }, [breakfast, lunch, dinner]);

  const validateFields = () => {
    let isValid = true;
    const errors = {};

    breakfast.forEach((item, index) => {
      if (isNaN(item.received_quantity) || item.received_quantity < 0) {
        isValid = false;
        errors[`receivedQuantityBreakfast-${index}`] =
          "Received quantity must be a positive number.";
      }
      if (item.received_quantity === "") {
        isValid = false;
        errors[`receivedQuantityBreakfast-${index}`] = "Required.";
      }
    });

    lunch.forEach((item, index) => {
      if (isNaN(item.received_quantity) || item.received_quantity < 0) {
        isValid = false;
        errors[`receivedQuantityLunch-${index}`] =
          "Received quantity must be a positive number.";
      }
      if (item.received_quantity === "") {
        isValid = false;
        errors[`receivedQuantityLunch-${index}`] = "Required.";
      }
    });

    dinner.forEach((item, index) => {
      if (isNaN(item.received_quantity) || item.received_quantity < 0) {
        isValid = false;
        errors[`receivedQuantityDinner-${index}`] =
          "Received quantity must be a positive number.";
      }
      if (item.received_quantity === "") {
        isValid = false;
        errors[`receivedQuantityDinner-${index}`] = "Required.";
      }
    });

    setValidationErrors(errors);

    return isValid;
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
  const checkConnectionStatus = async () => {
    const actualStatus = await checkInternetConnection();
    setStatus(actualStatus);
  };
  useEffect(() => {
    checkConnectionStatus();
  }, []);
  useEffect(() => {
    if (status === false) {
      Swal.fire({
        html: `<b>Check Internet connection!</b>`,
        allowOutsideClick: false,
        confirmButtonColor: "#A24C4A",
      });
    }
  }, [status]);

  const handleSubmit = async () => {
    if (!validateFields()) {
      toast.error("Validate all fields");
      return;
    }
    console.log(finalData);
    // const selectedDidiData = namesDidi.find(
    //   (item) => item.didi_id === selectedDidi
    // );
    // if (!selectedDidi || !selectedDidiData) {
    //   toast.error("Please select a valid Didi from the dropdown!");
    //   return;
    // }

    // const did_id = selectedDidiData.didi_id;
    // const payload = {
    //   didi_id: did_id,
    //   food_data: foodData.map(
    //     ({ food_id, issue_food_id, quantity, received_quantity, image }) => ({
    //       food_id,
    //       issue_food_id,
    //       quantity,
    //       received_quantity,
    //       image: image || null,
    //     })
    //   ),
    // };

    // const actualStatus = await checkInternetConnection();
    // if (actualStatus) {
    //   setIsLoading(true);
    //   try {
    //     await sendRecivedFood(payload);
    //   } catch (error) {
    //     toast.error("Failed to submit food data!");
    //     console.error("Error sending food data:", error);
    //   }
    // } else {
    //   Swal.fire({
    //     html: `<b>Check Internet connection!</b>`,
    //     allowOutsideClick: false,
    //     confirmButtonColor: "#A24C4A",
    //   });
    // }
    // console.log(payload);
  };

  return (
    <div className="bg-gray-50" style={{ minHeight: "100vh" }}>
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
              className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-80 w-full overflow-y-auto"
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

        <div className="mb-3">
          <p className="mt-2 text-lg text-[#A24C4A] font-bold">{currentDate}</p>
        </div>

        {breakfast.length > 0 || lunch.length > 0 || dinner.length > 0 ? (
          <div>
            {breakfast.length > 0 && (
              <div key="Break-fast" className="mb-8">
                <h2 className="text-2xl text-[#A24C4A] font-bold my-4 text-center">
                  Breakfast
                </h2>
                <div className="table-responsive mt-2">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">Item</th>
                        <th
                          className="text-center"
                          style={{ minWidth: "100px" }}
                        >
                          Assigned Food (kg)
                        </th>
                        <th
                          className="text-center"
                          style={{ minWidth: "150px" }}
                        >
                          Received Food (kg)
                        </th>
                        <th className="text-center">Image</th>
                        <th
                          className="text-center"
                          style={{ minWidth: "200px" }}
                        >
                          Uploaded Image
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakfast.map((item, itemIndex) => {
                        const uniqueIndex = `Break-fast-${itemIndex}`;

                        return (
                          <tr key={uniqueIndex}>
                            <td>{item.food_id}</td>
                            <td>{item.quantity} kg</td>
                            <td>
                              <input
                                type="number"
                                value={
                                  item.received_quantity === 0
                                    ? "0"
                                    : item.received_quantity || ""
                                }
                                onChange={(e) =>
                                  handleReceivedChange(
                                    "Breakfast",
                                    itemIndex,
                                    e.target.value
                                  )
                                }
                                className={`form-control ${
                                  validationErrors[
                                    `receivedQuantityBreakfast-${itemIndex}`
                                  ]
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {validationErrors[
                                `receivedQuantityBreakfast-${itemIndex}`
                              ] && (
                                <div className="invalid-feedback">
                                  {
                                    validationErrors[
                                      `receivedQuantityBreakfast-${itemIndex}`
                                    ]
                                  }
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {/* Webcam or Camera Handling */}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {item.image ? (
                                <div className="relative">
                                  <img
                                    src={item.image}
                                    alt="Captured"
                                    className="w-32 h-32 rounded shadow-lg"
                                  />
                                  <button
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    onClick={() =>
                                      handleRemoveImage(uniqueIndex)
                                    }
                                  >
                                    <FiX size={24} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-500 italic">
                                  No photo captured
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lunch */}
            {lunch.length > 0 && (
              <div key="Lunch" className="mb-8">
                <h2 className="text-2xl text-[#A24C4A] font-bold my-4 text-center">
                  Lunch
                </h2>
                <div className="table-responsive mt-2">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">Item</th>
                        <th
                          className="text-center"
                          style={{ minWidth: "100px" }}
                        >
                          Assigned Food (kg)
                        </th>
                        <th
                          className="text-center"
                          style={{ minWidth: "150px" }}
                        >
                          Received Food (kg)
                        </th>
                        <th className="text-center">Image</th>
                        <th
                          className="text-center"
                          style={{ minWidth: "200px" }}
                        >
                          Uploaded Image
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lunch.map((item, itemIndex) => {
                        const uniqueIndex = `Lunch-${itemIndex}`;

                        return (
                          <tr key={uniqueIndex}>
                            <td>{item.food_id}</td>
                            <td>{item.quantity} kg</td>
                            <td>
                              <input
                                type="number"
                                value={
                                  item.received_quantity === 0
                                    ? "0"
                                    : item.received_quantity || ""
                                }
                                onChange={(e) =>
                                  handleReceivedChange(
                                    "Lunch",
                                    itemIndex,
                                    e.target.value
                                  )
                                }
                                className={`form-control ${
                                  validationErrors[
                                    `receivedQuantityLunch-${itemIndex}`
                                  ]
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {validationErrors[
                                `receivedQuantityLunch-${itemIndex}`
                              ] && (
                                <div className="invalid-feedback">
                                  {
                                    validationErrors[
                                      `receivedQuantityLunch-${itemIndex}`
                                    ]
                                  }
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {/* Webcam or Camera Handling */}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {item.image ? (
                                <div className="relative">
                                  <img
                                    src={item.image}
                                    alt="Captured"
                                    className="w-32 h-32 rounded shadow-lg"
                                  />
                                  <button
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    onClick={() =>
                                      handleRemoveImage(uniqueIndex)
                                    }
                                  >
                                    <FiX size={24} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-500 italic">
                                  No photo captured
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Dinner */}
            {dinner.length > 0 && (
              <div key="Dinner" className="mb-8">
                <h2 className="text-2xl text-[#A24C4A] font-bold my-4 text-center">
                  Dinner
                </h2>
                <div className="table-responsive mt-2">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">Item</th>
                        <th
                          className="text-center"
                          style={{ minWidth: "100px" }}
                        >
                          Assigned Food (kg)
                        </th>
                        <th
                          className="text-center"
                          style={{ minWidth: "150px" }}
                        >
                          Received Food (kg)
                        </th>
                        <th className="text-center">Image</th>
                        <th
                          className="text-center"
                          style={{ minWidth: "200px" }}
                        >
                          Uploaded Image
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dinner.map((item, itemIndex) => {
                        const uniqueIndex = `Dinner-${itemIndex}`;

                        return (
                          <tr key={uniqueIndex}>
                            <td>{item.food_id}</td>
                            <td>{item.quantity} kg</td>
                            <td>
                              <input
                                type="number"
                                value={
                                  item.received_quantity === 0
                                    ? "0"
                                    : item.received_quantity || ""
                                }
                                onChange={(e) =>
                                  handleReceivedChange(
                                    "Dinner",
                                    itemIndex,
                                    e.target.value
                                  )
                                }
                                className={`form-control ${
                                  validationErrors[
                                    `receivedQuantityDinner-${itemIndex}`
                                  ]
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              {validationErrors[
                                `receivedQuantityDinner-${itemIndex}`
                              ] && (
                                <div className="invalid-feedback">
                                  {
                                    validationErrors[
                                      `receivedQuantityDinner-${itemIndex}`
                                    ]
                                  }
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {/* Webcam or Camera Handling */}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {item.image ? (
                                <div className="relative">
                                  <img
                                    src={item.image}
                                    alt="Captured"
                                    className="w-32 h-32 rounded shadow-lg"
                                  />
                                  <button
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    onClick={() =>
                                      handleRemoveImage(uniqueIndex)
                                    }
                                  >
                                    <FiX size={24} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-500 italic">
                                  No photo captured
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                className={`mt-2 border-[#A24C4A] text-[#A24C4A] rounded border-1 px-4 py-1 mt-4 rounded-lg cursor-pointer ${
                  isLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center mt-4">
            Please select any Didi to get food details
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReceivedFood;
