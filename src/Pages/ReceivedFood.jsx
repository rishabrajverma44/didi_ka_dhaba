import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

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
  const [validationErrors, setValidationErrors] = useState({});
  const dropdownRefDidi = useRef(null);
  const dropdownRefThela = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const [foodData, setFoodData] = useState([]);

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
    const actualStatus = await checkInternetConnection();
    if (actualStatus) {
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
    } else {
      Swal.fire({
        html: `<b>Check Internet connection!</b>`,
        allowOutsideClick: false,
        confirmButtonColor: "#A24C4A",
      });
    }
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
  }, [searchTermDidi]);

  const handleRemoveImage = (index) => {
    const updatedFoodData = [...foodData];
    updatedFoodData[index].image = null;
    setFoodData(updatedFoodData);
  };

  const getAssignedFoods = async (selectedDidi, date) => {
    const payload = {
      didi_id: selectedDidi,
      issue_date: date,
    };
    try {
      const res = await axios.post(
        "https://didikadhababackend.indevconsultancy.in/dhaba/filter-issue-food/",
        payload
      );
      if (res.status === 200) {
        setFoodData(res.data);
      }
    } catch (e) {
      if (e.status === 404) {
        toast.warn(`Food not assigned to ${searchTermDidi} on ${currentDate}`);
      }
      console.log("Error in food:", e);
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
    const date = getDate();
    if (selectedDidi != null && getDate) {
      setFoodData([]);
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
        toast.success(`Food Received by ${searchTermDidi}`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setSearchTermDidi("");
        setSearchTermThela("");
        setSelectedDidi(null);
        setSelectedThela(null);
        setFoodData([]);
        setIsLoading(false);
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
    foodData.forEach((foodItem, index) => {
      if (!foodItem.received_quantity) {
        errors[`receivedQuantity${index}`] = "required";
        isValid = false;
      } else {
        delete errors[`receivedQuantity${index}`];
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleReceivedChange = (index, value) => {
    const updatedFoodData = [...foodData];
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      toast.error("Invalid quantity.");
      updatedFoodData[index].received_quantity = "";
    } else if (numericValue <= updatedFoodData[index].quantity) {
      updatedFoodData[index].received_quantity = numericValue;
    } else {
      toast.error("Quantity cannot be greater than Assigned Food.");
      updatedFoodData[index].received_quantity = "";
    }
    setFoodData(updatedFoodData);
  };

  const convertBlobToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Base64 Image:", reader.result);
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(image);
    });
  };

  const handleFileChange = async (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const updatedFoodData = [...foodData];
      try {
        const base64Image = await convertBlobToBase64(file);
        updatedFoodData[index].image = base64Image;
        setFoodData(updatedFoodData);
      } catch (error) {
        console.error("Error converting image to Base64:", error);
      }
    }
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
      food_data: foodData.map(
        ({ food_id, issue_food_id, quantity, received_quantity, image }) => ({
          food_id,
          issue_food_id,
          quantity,
          received_quantity,
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
            <ul className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-80 w-full overflow-y-auto">
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

        <div className="mb-3">
          <p className="mt-2 text-lg text-[#A24C4A] font-bold">{currentDate}</p>
        </div>

        {foodData.length > 0 ? (
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
                      <td>{item.food_id}</td>
                      <td>{item.quantity} kg</td>
                      <td>
                        <input
                          type="text"
                          value={foodData[index].received_quantity}
                          onChange={(e) =>
                            handleReceivedChange(index, e.target.value)
                          }
                          className={`form-control ${
                            validationErrors[`receivedQuantity${index}`]
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {validationErrors[`receivedQuantity${index}`] && (
                          <div className="invalid-feedback">
                            {validationErrors[`receivedQuantity${index}`]}
                          </div>
                        )}
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
                                style={{
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                }}
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
