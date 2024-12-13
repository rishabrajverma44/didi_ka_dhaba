import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera } from "react-icons/fa";
import { FiX, FiRefreshCcw } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import ConfirmNavigation from "../Components/prebuiltComponent/ConfirmNavigation";

const ReceivedFood = () => {
  const navigate = useNavigate();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [showWebcamBreakfastIndex, setShowWebcamBreakfastIndex] =
    useState(null);
  const [showWebcamLunchIndex, setShowWebcamLunchIndex] = useState(null);
  const [showWebcamDinnerIndex, setShowWebcamDinnerIndex] = useState(null);
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  });
  const captureImage = (mealType, index) => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setCapturedImages((prev) => ({
        ...prev,
        [mealType]: {
          ...prev[mealType],
          [index]: screenshot,
        },
      }));
      if (mealType === "Breakfast") {
        setShowWebcamBreakfastIndex(null);
      } else if (mealType === "Lunch") {
        setShowWebcamLunchIndex(null);
      } else if (mealType === "Dinner") {
        setShowWebcamDinnerIndex(null);
      }
    }
  };

  const openWebcam = (mealType, index) => {
    setCapturedImages((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [index]: null,
      },
    }));

    if (mealType === "Breakfast") {
      setShowWebcamBreakfastIndex(index);
    } else if (mealType === "Lunch") {
      setShowWebcamLunchIndex(index);
    } else if (mealType === "Dinner") {
      setShowWebcamDinnerIndex(index);
    }
  };

  const handleRemoveImage = (mealType, index) => {
    const updatedImages = { ...capturedImages };
    updatedImages[mealType][index] = null;
    setCapturedImages(updatedImages);
  };

  const toggleCamera = () => {
    setIsFrontCamera((prevState) => !prevState);
  };

  const videoConstraints = {
    facingMode: isFrontCamera ? "user" : "environment",
  };

  const handleReceivedChange = (mealType, itemIndex, value, image = null) => {
    const parsedValue = value === "" ? 0 : parseFloat(value);
    let errorMessage = "";
    setHasUnsavedChanges(true);
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
    } else if (parsedValue > currentItem.total_quantity) {
      errorMessage = `Received quantity cannot exceed ${currentItem.total_quantity}`;
    }

    if (!errorMessage) {
      const updatedItem = { ...currentItem, received_quantity: parsedValue };

      if (image) {
        setCapturedImages((prevImages) => ({
          ...prevImages,
          [mealType]: {
            ...prevImages[mealType],
            [itemIndex]: image,
          },
        }));
      }

      if (mealType === "Breakfast") {
        setBreakfast((prevBreakfast) =>
          prevBreakfast.map((item, index) =>
            index === itemIndex ? updatedItem : item
          )
        );
      } else if (mealType === "Lunch") {
        setLunch((prevLunch) =>
          prevLunch.map((item, index) =>
            index === itemIndex ? updatedItem : item
          )
        );
      } else if (mealType === "Dinner") {
        setDinner((prevDinner) =>
          prevDinner.map((item, index) =>
            index === itemIndex ? updatedItem : item
          )
        );
      }
    }
  };

  useEffect(() => {
    const updatedData = [
      ...breakfast.map((item, index) => ({
        received_quantity: item.received_quantity + "",
        issue_food_id: item.issue_food_id,
        total_quantity: item.total_quantity + "",
        meal_type: "Breakfast",
        image: capturedImages.Breakfast[index] || null,
      })),
      ...lunch.map((item, index) => ({
        received_quantity: item.received_quantity + "",
        issue_food_id: item.issue_food_id + "",
        total_quantity: item.total_quantity + "",
        meal_type: "Lunch",
        image: capturedImages.Lunch[index] || null,
      })),
      ...dinner.map((item, index) => ({
        received_quantity: item.received_quantity + "",
        issue_food_id: item.issue_food_id + "",
        total_quantity: item.total_quantity + "",
        meal_type: "Dinner",
        image: capturedImages.Dinner[index] || null,
      })),
    ];

    setFinalData(updatedData);
  }, [breakfast, lunch, dinner, capturedImages]);

  const filteredDidiNames = namesDidi.filter((item) => {
    const search = String(searchTermDidi || "").toLowerCase();
    return item.didi_name_and_thela_code.toLowerCase().includes(search);
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
  const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
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
      .get("https://didikadhababackend.indevconsultancy.in/dhaba/didi_thela/")
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
  let count = 0;

  const getMeal = async (mealType, selectedDidi, date, setMeal) => {
    try {
      const payload = {
        didi_id: selectedDidi,
        issue_date: date,
        meal_type: mealType,
      };

      const res = await axios.post(
        "https://didikadhababackend.indevconsultancy.in/dhaba/filter-issue-food/",
        payload
      );

      if (res.status === 200 && res.data.length > 0) {
        const mealData = res.data.map((item) => ({
          ...item,
          received_quantity: "",
        }));
        setMeal(mealData);
        return true;
      } else {
        setMeal([]);
        count++;
        return true;
      }
    } catch (e) {
      setMeal([]);

      count++;
      return true;
    }
  };

  const getAssignedFoods = async (selectedDidi, date) => {
    count = 0;

    await getMeal("Break-fast", selectedDidi, date, setBreakfast);
    await getMeal("Lunch", selectedDidi, date, setLunch);
    await getMeal("Dinner", selectedDidi, date, setDinner);

    if (count === 3) {
      toast.error(`Items returned for ${searchTermDidi}`);
    } else {
      toast.success(`Food received ! ${searchTermDidi}`);
    }
  };

  useEffect(() => {
    const date = getDate();
    if (selectedDidi != null && date) {
      getAssignedFoods(selectedDidi, date);
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
        setBreakfast([]);
        setDinner([]);
        setLunch([]);
        setCapturedImages({
          Breakfast: [],
          Lunch: [],
          Dinner: [],
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (e) {
      console.log("Error in sending received food:", e);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!validateFields()) {
      toast.error("Validate all fields");
      return;
    }
    if (!selectedDidi) {
      toast.error("Please select a valid Didi from the dropdown!");
      return;
    }
    console.log(selectedDidi);
    const did_id = selectedDidi;
    const payload = {
      didi_id: did_id,
      food_data: finalData.map(
        ({
          issue_food_id,
          total_quantity,
          received_quantity,
          meal_type,
          image,
        }) => ({
          issue_food_id,
          total_quantity,
          received_quantity,
          meal_type,
          image: image || null,
        })
      ),
    };

    const actualStatus = await checkInternetConnection();
    if (actualStatus) {
      setIsLoading(true);
      try {
        await sendRecivedFood(payload);
      } catch (error) {
        toast.error("Failed to submit food data!");
        console.error("Error sending food data:", error);
      }
    } else {
      Swal.fire({
        html: `<b>Check Internet connection!</b>`,
        allowOutsideClick: false,
        confirmButtonColor: "#A24C4A",
      });
    }
  };

  return (
    <div className="bg-gray-50" style={{ minHeight: "100vh" }}>
      <div className="container py-4">
        <h3 className="text-center mb-4">Received Return Food</h3>
        <ConfirmNavigation
          targetUrl="/"
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <h4 className="text-xl font-semibold text-gray-800">
          Select Didi (stall code)
        </h4>

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
                      setSearchTermDidi(name.didi_name_and_thela_code);
                      setIsDropdownOpenDidi(false);
                      setHasUnsavedChanges(true);
                    }}
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

        <>
          {breakfast.length > 0 || lunch.length > 0 || dinner.length > 0 ? (
            <div>
              {/* Breakfast */}
              {breakfast.length > 0 && (
                <div key="Break-fast" className="mb-8">
                  <h2 className="text-2xl text-[#A24C4A] font-bold my-4 text-center">
                    Breakfast
                  </h2>
                  <div className="table-responsive mt-2">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th
                            className="text-center"
                            style={{ minWidth: "130px" }}
                          >
                            Item
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Assigned Food
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "150px" }}
                          >
                            Received Food
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "200px" }}
                          >
                            Image
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakfast.map((item, itemIndex) => {
                          const uniqueIndex = `Break-fast-${itemIndex}`;

                          return (
                            <tr key={uniqueIndex}>
                              <td className="text-center font-bold">
                                {item.food_name}
                              </td>
                              <td className="text-center">
                                <span className="font-bold">
                                  {" "}
                                  {item.total_quantity}
                                </span>{" "}
                                {item.unit_name}
                              </td>
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
                              <td className="border p-2 text-center">
                                {capturedImages.Breakfast[itemIndex] ? (
                                  <div className="relative inline-block">
                                    <img
                                      src={capturedImages.Breakfast[itemIndex]}
                                      alt="Captured"
                                      className="w-48 h-48 rounded shadow-lg"
                                    />
                                    <button
                                      className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                      onClick={() =>
                                        handleRemoveImage(
                                          "Breakfast",
                                          itemIndex
                                        )
                                      }
                                    >
                                      <FiX size={24} />
                                    </button>
                                  </div>
                                ) : showWebcamBreakfastIndex === itemIndex ? (
                                  <div className="relative inline-block rounded shadow-lg">
                                    <Webcam
                                      audio={false}
                                      ref={webcamRef}
                                      screenshotFormat="image/jpeg"
                                      className="w-48 h-48 rounded shadow-md"
                                      videoConstraints={videoConstraints}
                                    />
                                    <div className="absolute bottom-3 flex space-x-8 z-10 w-full items-center justify-center">
                                      <button
                                        onClick={() =>
                                          captureImage("Breakfast", itemIndex)
                                        }
                                      >
                                        <FaCamera color="#A24C4A" size={24} />
                                      </button>
                                      <button onClick={toggleCamera}>
                                        <FiRefreshCcw
                                          color="#A24C4A"
                                          size={24}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      openWebcam("Breakfast", itemIndex)
                                    }
                                  >
                                    <FaCamera color="#A24C4A" size={24} />
                                  </button>
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
                          <th
                            className="text-center"
                            style={{ minWidth: "130px" }}
                          >
                            Item
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Assigned Food
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "150px" }}
                          >
                            Received Food
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "200px" }}
                          >
                            Image
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {lunch.map((item, itemIndex) => {
                          const uniqueIndex = `Lunch-${itemIndex}`;

                          return (
                            <tr key={uniqueIndex}>
                              <td className="text-center font-bold">
                                {item.food_name}
                              </td>
                              <td className="text-center">
                                <span className="font-bold">
                                  {" "}
                                  {item.total_quantity}
                                </span>{" "}
                                {item.unit_name}
                              </td>
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
                              <td className="border p-2 text-center">
                                {capturedImages.Lunch[itemIndex] ? (
                                  <div className="relative inline-block">
                                    <img
                                      src={capturedImages.Lunch[itemIndex]}
                                      alt="Captured"
                                      className="rounded shadow-lg"
                                    />
                                    <button
                                      className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                      onClick={() =>
                                        handleRemoveImage("Lunch", itemIndex)
                                      }
                                    >
                                      <FiX size={24} />
                                    </button>
                                  </div>
                                ) : showWebcamLunchIndex === itemIndex ? (
                                  <div className="relative inline-block rounded shadow-lg">
                                    <Webcam
                                      audio={false}
                                      ref={webcamRef}
                                      screenshotFormat="image/jpeg"
                                      className="rounded shadow-md"
                                      videoConstraints={videoConstraints}
                                    />
                                    <div className="absolute bottom-3 flex space-x-8 z-10 w-full items-center justify-center">
                                      <button
                                        onClick={() =>
                                          captureImage("Lunch", itemIndex)
                                        }
                                      >
                                        <FaCamera color="#A24C4A" size={24} />
                                      </button>
                                      <button onClick={toggleCamera}>
                                        <FiRefreshCcw
                                          color="#A24C4A"
                                          size={24}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      openWebcam("Lunch", itemIndex)
                                    }
                                  >
                                    <FaCamera color="#A24C4A" size={24} />
                                  </button>
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
                          <th
                            className="text-center"
                            style={{ minWidth: "130px" }}
                          >
                            Item
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Assigned Food
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "150px" }}
                          >
                            Received Food
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "200px" }}
                          >
                            Image
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dinner.map((item, itemIndex) => {
                          const uniqueIndex = `Dinner-${itemIndex}`;

                          return (
                            <tr key={uniqueIndex}>
                              <td className="text-center font-bold">
                                {item.food_name}
                              </td>
                              <td className="text-center">
                                <span className="font-bold">
                                  {" "}
                                  {item.total_quantity}
                                </span>{" "}
                                {item.unit_name}
                              </td>
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
                              <td className="border p-2 text-center">
                                {capturedImages.Dinner[itemIndex] ? (
                                  <div className="relative inline-block">
                                    <img
                                      src={capturedImages.Dinner[itemIndex]}
                                      alt="Captured"
                                      className="rounded shadow-lg"
                                    />
                                    <button
                                      className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                      onClick={() =>
                                        handleRemoveImage("Dinner", itemIndex)
                                      }
                                    >
                                      <FiX size={24} />
                                    </button>
                                  </div>
                                ) : showWebcamDinnerIndex === itemIndex ? (
                                  <div className="relative rounded shadow-lg">
                                    <Webcam
                                      audio={false}
                                      ref={webcamRef}
                                      screenshotFormat="image/jpeg"
                                      className="rounded shadow-md"
                                      videoConstraints={videoConstraints}
                                    />
                                    <div className="absolute bottom-3 flex space-x-8 z-10 w-full items-center justify-center">
                                      <button
                                        onClick={() =>
                                          captureImage("Dinner", itemIndex)
                                        }
                                      >
                                        <FaCamera color="#A24C4A" size={24} />
                                      </button>
                                      <button onClick={toggleCamera}>
                                        <FiRefreshCcw
                                          color="#A24C4A"
                                          size={24}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      openWebcam("Dinner", itemIndex)
                                    }
                                  >
                                    <FaCamera color="#A24C4A" size={24} />
                                  </button>
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
            </div>
          ) : (
            <div>No data available for meals</div>
          )}
        </>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReceivedFood;
