import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Breadcrumb from "../../../Components/prebuiltComponent/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import { FaPencilAlt, FaPrint, FaTrashAlt } from "react-icons/fa";

const DailyLogEdit = () => {
  const [didiDetails, setDidiDetails] = useState([]);
  const [data, setData] = useState(null);

  const { id, date } = useParams();
  const fetchProduct = async () => {
    axios
      .post(`${process.env.REACT_APP_API_BACKEND}/details-by-meal-type/`, {
        didi_id: Number(id),
        date: date,
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          setDidiDetails(res.data.didi_details);
        }
      })
      .catch((error) => {
        if (error.status === 404 && error.error === "Didi not found.") {
          setData(null);
          toast.error("did not found");
        }
        console.log("error in post", error);
      });
  };
  useEffect(() => {
    fetchProduct();
  }, [id, date]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({
    upi: "",
    cash: "",
  });

  const editPayment = (payment, payment_detail_id) => {
    setCurrentPayment(payment);
    setIsModalOpen(true);
  };
  const updatePyament = (payload, id) => {
    axios
      .put(
        `${process.env.REACT_APP_API_BACKEND}/payment-details/${id}/`,
        payload
      )
      .then((res) => {
        if (res.status === 200) {
          fetchProduct();
          setIsModalOpen(false);
        }
      })
      .catch((error) => {
        console.log("error in payment update", error);
        if (error.response?.status === 400) {
          toast.error(
            error.response.data.cash?.[0] || error.response.data.upi?.[0]
          );
        }
      });
  };

  const handleSave = () => {
    const payload = {
      cash: currentPayment.cash_amount,
      upi: currentPayment.upi_amount,
    };
    updatePyament(payload, currentPayment.payment_detail_id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deletePayment = (id) => {
    Swal.fire({
      title: "Are you sure delete payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_API_BACKEND}/payment-details/${id}/`)
          .then((res) => {
            if (res.status === 204) {
              fetchProduct();
            }
          })
          .catch((error) => {
            console.log("Error in payment delete", error);
            Swal.fire("Error!", "error");
          });
      }
    });
  };

  const FoodDetails = ({ selectedRowData }) => {
    return (
      <div className="p-1 w-full bg-white mb-4 rounded-md pb-2">
        {selectedRowData ? (
          <div className="space-y-6 px-3">
            {Object.keys(selectedRowData.issued_food).length > 0 ||
            Object.keys(selectedRowData.returned_food).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border text-left text-slate-600">
                        Meal Type
                      </th>
                      <th className="py-2 px-4 border text-left text-slate-600">
                        Item Name
                      </th>
                      <th className="py-2 px-4 border text-left text-slate-600">
                        Issued Quantity
                      </th>
                      <th className="py-2 px-4 border text-left text-slate-600">
                        Returned Quantity
                      </th>
                      <th className="py-2 px-4 border text-left text-slate-600">
                        Difference
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys({
                      ...selectedRowData.issued_food,
                      ...selectedRowData.returned_food,
                    }).map((mealType) => {
                      const issuedItems =
                        selectedRowData.issued_food?.[mealType] || [];
                      const returnedItems =
                        selectedRowData.returned_food?.[mealType] || [];

                      const maxLength = Math.max(
                        issuedItems.length,
                        returnedItems.length
                      );

                      return (
                        <React.Fragment key={mealType}>
                          {Array.from({ length: maxLength }).map((_, index) => {
                            const issuedItem = issuedItems[index];
                            const returnedItem = returnedItems[index];
                            const itemName =
                              issuedItem?.food_name ||
                              returnedItem?.food_name ||
                              "";

                            const issuedQuantity = issuedItem?.quantity || 0.0;
                            const returnedQuantity =
                              returnedItem?.returned_quantity || 0.0;
                            const difference =
                              (issuedItem?.quantity || 0.0) -
                              (returnedItem?.returned_quantity || 0.0);

                            const unitName =
                              issuedItem?.unit_name ||
                              returnedItem?.unit_name ||
                              "";

                            return (
                              <tr key={`${mealType}-${index}`}>
                                {index === 0 && (
                                  <td
                                    rowSpan={maxLength}
                                    className="py-2 px-4 border capitalize text-gray-800 align-top"
                                  >
                                    {mealType.replace("-", " ")}
                                  </td>
                                )}
                                <td className="py-2 px-4 border">{itemName}</td>
                                <td className="py-2 px-4 border">
                                  {issuedQuantity.toFixed(1)} {unitName}
                                </td>
                                <td className="py-2 px-4 border">
                                  {returnedQuantity.toFixed(1)} {unitName}
                                </td>
                                <td className="py-2 px-4 border">
                                  {difference.toFixed(1)} {unitName}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No food data available.</p>
            )}

            {selectedRowData.payment_details &&
            selectedRowData.payment_details.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">
                  Payment Details
                </h3>

                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border text-left text-slate-600">
                        UPI Amount
                      </th>
                      <th className="py-2 px-4 border text-left text-slate-600">
                        Cash Amount
                      </th>
                      <th className="py-2 px-4 border text-center text-slate-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRowData.payment_details.map((payment, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border">
                          ₹ {payment.upi_amount}
                        </td>
                        <td className="py-2 px-4 border">
                          ₹ {payment.cash_amount}
                        </td>
                        <td className="py-2 px-4 border">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() =>
                                editPayment(
                                  selectedRowData.payment_details[index],
                                  selectedRowData.payment_details[index]
                                    .payment_detail_id
                                )
                              }
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaPencilAlt />
                            </button>
                            <button
                              onClick={() =>
                                deletePayment(
                                  selectedRowData.payment_details[index]
                                    .payment_detail_id
                                )
                              }
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold bg-gray-100">
                      <td className="py-2 px-4 border">
                        ₹{" "}
                        {selectedRowData.payment_details
                          .reduce(
                            (acc, payment) =>
                              acc + parseFloat(payment.upi_amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border">
                        ₹{" "}
                        {selectedRowData.payment_details
                          .reduce(
                            (acc, payment) =>
                              acc + parseFloat(payment.cash_amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border text-center">
                        Overall Total = ₹{" "}
                        {selectedRowData.payment_details
                          .reduce(
                            (acc, payment) =>
                              acc +
                              parseFloat(payment.upi_amount || 0) +
                              parseFloat(payment.cash_amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No payment details available.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </div>
    );
  };

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Didi Details",
  });

  const breadcrumbItems = [
    { label: "Daily log", href: "/dailylog" },
    { label: "Didi Details", href: `/` },
  ];
  return (
    <div className="md:px-12 px-6 py-2">
      <ToastContainer />
      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Details for {didiDetails.didi_name}
          </b>
        </div>

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="p-1" ref={printRef}>
        <div className="border border-1 rounded px-8 py-3 shadow-sm border-bottom-4">
          <div className="row mb-2">
            <div className="col-md-6">
              <span className="fw-bold" style={{ color: "#5E6E82" }}>
                Name :-
              </span>
              <span style={{ color: "#5E6E82" }}> {didiDetails.didi_name}</span>
            </div>
            <div className="col-md-6">
              <span className="fw-bold" style={{ color: "#5E6E82" }}>
                Date :-
              </span>
              <span style={{ color: "#5E6E82" }}>
                {" "}
                {date.split("-").reverse().join("-")}
              </span>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-md-6">
              <span className="fw-bold" style={{ color: "#5E6E82" }}>
                Stall Name :-
              </span>
              <span style={{ color: "#5E6E82" }}>
                {" "}
                {didiDetails.thela_code}
              </span>
            </div>
            <div className="col-md-6">
              <span className="fw-bold" style={{ color: "#5E6E82" }}>
                Total Sale :-
              </span>
              <span style={{ color: "#5E6E82" }}>
                {" "}
                {didiDetails.total_payment}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <fieldset className="border border-2 card relative">
            <div className="d-flex justify-content-end m-0 p-0 px-3">
              <button
                onClick={handlePrint}
                className="px-2 btn btn-dark text-white rounded hover:bg-[#53230A]"
              >
                <div className="flex items-center">
                  <FaPrint className="" />
                </div>
              </button>
            </div>
            <legend
              className="float-none w-auto ml-6 px-2"
              style={{ color: "#5E6E82", fontWeight: "bolder" }}
            >
              Daily Log
            </legend>
            <FoodDetails selectedRowData={data} />
          </fieldset>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Edit Payment</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI
                </label>
                <input
                  type="number"
                  min="0"
                  name="upi"
                  value={
                    currentPayment.upi_amount === 0
                      ? ""
                      : currentPayment.upi_amount
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Math.max(0, e.target.value);
                    setCurrentPayment((prev) => ({
                      ...prev,
                      upi_amount: value,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cash
                </label>
                <input
                  type="number"
                  name="cash"
                  value={
                    currentPayment.cash_amount === 0
                      ? ""
                      : currentPayment.cash_amount
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Math.max(0, e.target.value);
                    setCurrentPayment((prev) => ({
                      ...prev,
                      cash_amount: value,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-dark">
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyLogEdit;