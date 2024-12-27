import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "../../../Components/prebuiltComponent/Breadcrumb";
import { FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const Plate = () => {
  const [plateItems, setPlateItems] = useState([]);
  const [modalData, setModalData] = useState({
    plate_id: null,
    plate_type: "",
    price: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPlates = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/plates/`)
      .then((res) => {
        setPlateItems(res.data);
      })
      .catch((error) => {
        console.log("err in get plate", error);
      });
  };
  const addPlate = (payload) => {
    axios
      .post(`${process.env.REACT_APP_API_BACKEND}/plates/`, payload)
      .then((res) => {
        if (res.status === 201) {
          getPlates();
          toast.success("Plate added successfully.");
        }
      })
      .catch((error) => {
        console.log("err in post plate", error);
        toast.error(error?.response?.data?.price[0]);
      });
  };
  const deletePlate = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_BACKEND}/plates/${id}`)
      .then((res) => {
        if (res.status === 204) {
          getPlates();
          toast.error("Plate deleted successfully.");
        }
      })
      .catch((error) => {
        console.log("err in delete plate", error);
      });
  };
  const editePlate = (payload, id) => {
    axios
      .put(`${process.env.REACT_APP_API_BACKEND}/plates/${id}/`, payload)
      .then((res) => {
        if (res.status === 200) {
          getPlates();
          toast.success("Plate Updated successfully.");
        }
      })
      .catch((error) => {
        console.log("err in put plate", error);
        toast.error(error?.response?.data?.price[0]);
      });
  };

  const openModal = (plate = { plate_id: null, plate_type: "", price: "" }) => {
    setModalData(plate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalData({ plate_id: null, plate_type: "", price: "" });
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const savePlate = () => {
    if (!modalData.plate_type || !modalData.price) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (modalData.plate_id) {
      const payload = {
        plate_type: modalData.plate_type,
        price: modalData.price,
      };
      editePlate(payload, modalData.plate_id);
    } else {
      const payload = {
        plate_type: modalData.plate_type,
        price: modalData.price,
      };
      addPlate(payload);
    }
    closeModal();
  };

  const breadcrumbItems = [
    { label: "Food List", href: "/listfood" },
    { label: "Add Plate", href: "" },
  ];

  useEffect(() => {
    getPlates();
  }, []);

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
          {/* <button
            onClick={() => openModal()}
            className="d-flex align-items-center btn btn-dark hover:bg-[#53230A] px-3"
          >
            <FaPlus className="me-1" />
            <span>Create Plate</span>
          </button> */}
        </div>

        <table className="table mt-4 border border-2 border-gray-300">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="border-r border-gray-300 p-2">Name</th>
              <th className="border-r border-gray-300 p-2">Price</th>
              {/* <th className="border-r border-gray-300 p-2 text-center w-25">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody>
            {plateItems.length > 0 ? (
              plateItems.map((plate) => (
                <tr key={plate.plate_id} className="border-b border-gray-300">
                  <td className="border-r border-gray-300 p-2">
                    {plate.plate_type}
                  </td>
                  <td className="border-r border-gray-300 p-2">
                    ₹ {plate.price}
                  </td>
                  {/* <td className="p-2 text-center">
                    <div className="flex justify-center items-center space-x-12">
                      <FaPencilAlt
                        className="text-primary cursor-pointer"
                        onClick={() => openModal(plate)}
                      />
                      <FaTrashAlt
                        className="text-danger cursor-pointer"
                        onClick={() => deletePlate(plate.plate_id)}
                      />
                    </div>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center p-4 border border-gray-300"
                >
                  No plates are created.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalData.plate_id
                    ? "Edit Plate Details"
                    : "Add Plate Details"}
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="plate_type"
                    value={modalData.plate_type}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
