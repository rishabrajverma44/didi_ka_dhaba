import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "../../../Components/prebuiltComponent/Breadcrumb";
import { FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa";

const Plate = () => {
  const [plateItems, setPlateItems] = useState([
    { id: 1, name: "container", price: 20 },
    { id: 2, name: "dona", price: 5 },
    { id: 3, name: "plate 1", price: 30 },
    { id: 4, name: "plate 2", price: 25 },
  ]);
  const [modalData, setModalData] = useState({ id: null, name: "", price: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Food List", href: "/listfood" },
    { label: "Add Plate", href: "" },
  ];

  const openModal = (plate = { id: null, name: "", price: "" }) => {
    setModalData(plate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalData({ id: null, name: "", price: "" });
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const savePlate = () => {
    if (!modalData.name || !modalData.price) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (modalData.id) {
      // Edit existing plate
      setPlateItems((prev) =>
        prev.map((plate) =>
          plate.id === modalData.id ? { ...plate, ...modalData } : plate
        )
      );
      toast.success("Plate updated successfully.");
    } else {
      // Add new plate
      const newPlate = { ...modalData, id: Date.now() };
      setPlateItems((prev) => [...prev, newPlate]);
      toast.success("Plate added successfully.");
    }

    closeModal();
  };

  const deletePlate = (id) => {
    setPlateItems((prev) => prev.filter((plate) => plate.id !== id));
    toast.success("Plate removed successfully.");
  };

  return (
    <div className="px-6 md:px-12">
      <ToastContainer />
      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Add Plates
          </b>
        </div>

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="mx-auto">
        <div className="flex justify-end">
          <button
            onClick={() => openModal()}
            className="d-flex align-items-center btn btn-dark hover:bg-[#53230A] px-3"
          >
            <FaPlus className="me-1" />
            <span>Create Plate</span>
          </button>
        </div>

        <table className="table mt-4 border border-2">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {plateItems.length > 0 ? (
              plateItems.map((plate) => (
                <tr key={plate.id}>
                  <td>{plate.name}</td>
                  <td>₹ {plate.price}</td>
                  <td>
                    <FaPencilAlt
                      className="text-primary cursor-pointer"
                      onClick={() => openModal(plate)}
                    />
                  </td>
                  <td>
                    <FaTrashAlt
                      className="text-danger cursor-pointer"
                      onClick={() => deletePlate(plate.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No plates are created.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalData.id ? "Edit Plate" : "Add Plate"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={modalData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={modalData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={savePlate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plate;
