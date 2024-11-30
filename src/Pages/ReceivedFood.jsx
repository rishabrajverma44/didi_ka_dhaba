import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera } from "react-icons/fa";

const ReceivedFood = () => {
  const [foodData, setFoodData] = useState([
    { item: "Rice", assigned: 5, received: "", image: null },
    { item: "Dal", assigned: 10, received: "", image: null },
    { item: "Paneer Matter", assigned: 10, received: "", image: null },
    { item: "Roti", assigned: 10, received: "", image: null },
  ]);
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

  const totalReceived = foodData.reduce(
    (total, item) => total + (parseFloat(item.received) || 0),
    0
  );

  const handleSubmit = () => {
    console.log("Submitted Data:", foodData);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Received Return Food</h2>

      <div className="mb-3">
        <label htmlFor="didiSelect" className="form-label">
          Select Didi:
        </label>
        <select
          id="didiSelect"
          className="form-select w-100"
          style={{ maxWidth: "100%" }}
        >
          <option value="">Select</option>
          <option value="didi1">Didi 1</option>
          <option value="didi2">Didi 2</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="thelaSelect" className="form-label">
          Select Thela:
        </label>
        <select
          id="thelaSelect"
          className="form-select w-100"
          style={{ maxWidth: "100%" }}
        >
          <option value="">Select</option>
          <option value="thela1">Thela 1</option>
          <option value="thela2">Thela 2</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="datePicker" className="form-label">
          Select Date:
        </label>
        <input type="date" id="datePicker" className="form-control" />
      </div>

      <div className="table-responsive">
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
                    type="text"
                    value={item.received}
                    onChange={(e) =>
                      handleReceivedChange(index, e.target.value)
                    }
                    className="form-control"
                    placeholder="Enter received food"
                  />
                </td>
                <td className="text-center">
                  <label className="btn btn-link text-primary p-0">
                    <FaCamera size={20} />
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
            <tr className="table-light">
              <td colSpan="3" className="text-end fw-bold">
                Total Received Food:
              </td>
              <td className="fw-bold">{totalReceived} kg</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={foodData.some((item) => item.received === "")}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReceivedFood;
