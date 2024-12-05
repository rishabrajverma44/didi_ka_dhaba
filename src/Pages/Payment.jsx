import React, { useEffect, useRef, useState } from "react";

const Payment = () => {
  const [namesDidi, setDidiName] = useState([
    { full_name: "ram", didi_id: 9 },
    { full_name: "kiran", didi_id: 39 },
    { full_name: "hema", didi_id: 2 },
    { full_name: "ramvati", didi_id: 29 },
  ]);
  const [searchTermDidi, setSearchTermDidi] = useState("");
  const [selectedDidi, setSelectedDidi] = useState(null);
  const [isDropdownOpenDidi, setIsDropdownOpenDidi] = useState(false);
  const dropdownRefDidi = useRef(null);
  const [currentDate, setCurrentDate] = useState("");

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
  return (
    <div className="bg-gray-50" style={{ minHeight: "100vh" }}>
      <div className="container py-4">
        <h3 className="text-center mb-4">Payment Details</h3>

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
        <div className="mb-3">
          <p className="mt-2 text-lg text-[#A24C4A] font-bold">{currentDate}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Payment;
