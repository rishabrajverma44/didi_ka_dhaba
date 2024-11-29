import React, { useEffect, useRef, useState } from "react";

const IssueFood = () => {
  const [namesDidi] = useState([
    "Didi_1",
    "Didi_2",
    "Didi_3",
    "Didi_4",
    "Didi_5",
    "Didi_6",
  ]);
  const [cartNumber] = useState(["GN12", "NO22", "NO54", "NO33", "GN43"]);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [selectedNameDidi, setSelectedNameDidi] = useState(null);
  const [searchTermCart, setSearchTermCart] = useState("");
  const [isOpenDidi, setIsOpenDidi] = useState(false);
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [selectedNameCart, setSelectedNameCart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [weight, setWeight] = useState("");
  const [userWiseData, setUserWiseData] = useState({});
  const [submittedData, setSubmittedData] = useState({});

  const filteredNamesDidi = namesDidi.filter((name) =>
    name.toLowerCase().includes(searchTermDidi.toLowerCase())
  );
  const filteredNamesCart = cartNumber.filter((name) =>
    name.toLowerCase().includes(searchTermCart.toLowerCase())
  );

  const handleSelectDidi = (name) => {
    setSelectedNameDidi(name);
    setSearchTermDidi(name);
    setIsOpenDidi(false);
  };

  const handleSelectCart = (cart) => {
    setSelectedNameCart(cart);
    setSearchTermCart(cart);
    setIsOpenCart(false);
  };

  const items = ["Rice", "Beans", "Wheat", "Daal", "Corn"];

  const handleAddClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (weight) {
      setUserWiseData((prevData) => {
        const updatedData = { ...prevData };
        if (!updatedData[selectedNameDidi]) {
          updatedData[selectedNameDidi] = {
            cart: selectedNameCart,
            items: {},
          };
        }

        updatedData[selectedNameDidi].items[selectedItem] = { weight };

        return updatedData;
      });

      setSubmittedData((prevData) => {
        return {
          ...prevData,
          userWiseData: { ...userWiseData, ...prevData.userWiseData },
        };
      });

      setShowModal(false);
      setWeight("");
    } else {
      alert("Please fill out both fields!");
    }
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenCart(false);
        setIsOpenDidi(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const finalSubmit = () => {
    console.log(userWiseData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Select Didi Ka Dhaba
      </h3>
      <div className="relative flex space-x-4" ref={dropdownRef}>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search Name..."
            className="w-full p-2 border-b border-gray-200 focus:outline-none focus:ring focus:ring-blue-200 rounded-lg"
            value={searchTermDidi}
            onChange={(e) => {
              setSearchTermDidi(e.target.value);
              setIsOpenDidi(true);
            }}
          />

          {isOpenDidi && (
            <ul className="max-h-40 overflow-y-auto bg-white border border-gray-300 shadow-lg rounded-lg z-20 absolute w-full mt-2">
              {filteredNamesDidi.length > 0 ? (
                filteredNamesDidi.map((name, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                    onClick={() => handleSelectDidi(name)}
                  >
                    {name}
                  </li>
                ))
              ) : (
                <li className="p-3 text-gray-500 text-center">No didi found</li>
              )}
            </ul>
          )}
        </div>

        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search Cart..."
            className="w-full p-2 border-b border-gray-200 focus:outline-none focus:ring focus:ring-blue-200 rounded-lg"
            value={searchTermCart}
            onChange={(e) => {
              setSearchTermCart(e.target.value);
              setIsOpenCart(true);
            }}
          />

          {isOpenCart && (
            <ul className="max-h-40 overflow-y-auto bg-white border border-gray-300 shadow-lg rounded-lg z-20 absolute w-full mt-2">
              {filteredNamesCart.length > 0 ? (
                filteredNamesCart.map((cart, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                    onClick={() => handleSelectCart(cart)}
                  >
                    {cart}
                  </li>
                ))
              ) : (
                <li className="p-3 text-gray-500 text-center">No cart found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {selectedNameDidi && (
        <>
          <div className="w-full max-w-3xl px-4 mt-24">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {item}
                  </span>
                  <button
                    className="fs-5 text-sm font-medium text-white bg-blue-500 px-2 mt-1 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleAddClick(item)}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Add Weight for {selectedItem}
                </h3>

                <div className="space-y-4">
                  <div className="flex">
                    <input
                      type="number"
                      placeholder="Enter Weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="px-3 py-2">KG</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-white shadow rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Submitted Items for {selectedNameDidi}
            </h3>
          </div>
        </>
      )}
      <div>
        {Object.entries(userWiseData).map(([didi, data]) => (
          <div key={didi}>
            <h3>{didi}</h3>
            <div>Cart: {data.cart}</div>
            <div>
              {Object.entries(data.items).map(([item, info]) => (
                <div key={item}>
                  {item} - {info.weight} kg
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueFood;
