import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Breadcrumb from "../../../Components/prebuiltComponent/Breadcrumb";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { FaPencilAlt, FaPrint, FaTrashAlt } from "react-icons/fa";

const HomeEdit = () => {
  const [didiDetails, setDidiDetails] = useState([]);
  const [data, setData] = useState(null);

  const { id, date } = useParams();

  useEffect(() => {
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

    fetchProduct();
  }, [id, date]);

  const editPyment = (payment) => {
    alert("edit");
    console.log(payment);
  };
  const deletePaymnet = () => {
    alert("delete");
  };

  const FoodDetails = ({ selectedRowData }) => {
    return (
      <div className="p-1 w-full bg-white mb-8 rounded-md pb-4">
        {selectedRowData ? (
          <>
            <div className="space-y-6 px-3">
              {Object.keys(selectedRowData.issued_food).length > 0 ||
              Object.keys(selectedRowData.returned_food).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-md">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b text-left text-slate-600">
                          Meal Type
                        </th>
                        <th className="py-2 px-4 border-b text-left text-slate-600">
                          Issued
                        </th>
                        <th className="py-2 px-4 border-b text-left text-slate-600">
                          Returned
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

                        return (
                          <tr key={mealType}>
                            <td className="py-2 px-4 border-b capitalize text-gray-800">
                              {mealType.replace("-", " ")}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {issuedItems.length > 0 ? (
                                <ul className="list-disc ml-4">
                                  {issuedItems.map((item) => (
                                    <li
                                      key={item.issue_food_id}
                                      className="text-gray-800"
                                    >
                                      {item.food_name} - {item.quantity}{" "}
                                      {item.unit_name}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-500">
                                  No issued food data available
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {returnedItems.length > 0 ? (
                                <ul className="list-disc ml-4">
                                  {returnedItems.map((item) => (
                                    <li
                                      key={item.issue_food_id}
                                      className="text-gray-800"
                                    >
                                      {item.food_name} -{" "}
                                      {item.returned_quantity} {item.unit_name}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-500">
                                  No returned food data available
                                </span>
                              )}
                            </td>
                          </tr>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRowData.payment_details.map((payment, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 border border-gray-200 rounded-md"
                      >
                        <div>
                          <div className="d-flex justify-content-end gap-4">
                            <button
                              onClick={() =>
                                editPyment(
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
                                deletePaymnet(selectedRowData.payment_details)
                              }
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                        <p className="font-medium text-gray-800 my-1">
                          <span className="text-gray-500">UPI Amount: </span>₹{" "}
                          {payment.upi_amount}
                        </p>
                        <p className="font-medium text-gray-800 my-1">
                          <span className="text-gray-500">Cash Amount: </span>₹{" "}
                          {payment.cash_amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No payment details available.</p>
              )}
            </div>
          </>
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
    { label: "Home", href: "/admin" },
    { label: "Didi Details", href: `/admin/` },
  ];
  return (
    <div className="md:px-12 px-6 py-2">
      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Details for sita devi
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
                Name : -
              </span>
              <span style={{ color: "#5E6E82" }}> {didiDetails.didi_name}</span>
            </div>
            <div className="col-md-6">
              <span className="fw-bold" style={{ color: "#5E6E82" }}>
                Date : -
              </span>
              <span style={{ color: "#5E6E82" }}> {date}</span>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-md-6">
              <span className="fw-bold" style={{ color: "#5E6E82" }}>
                Stall Name : -
              </span>
              <span style={{ color: "#5E6E82" }}>
                {" "}
                {didiDetails.thela_code}
              </span>
            </div>
            <div className="col-md-6">
              <span className="fw-bold" style={{ color: "#5E6E82" }}>
                Total Sale : -
              </span>
              <span style={{ color: "#5E6E82" }}>
                {" "}
                {didiDetails.total_payment}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <fieldset className="border border-2 card p-3 relative">
            <div className="d-flex justify-content-end m-0 p-0 px-3">
              <button
                onClick={handlePrint}
                className="mb-2 px-2 py-1 btn btn-dark text-white rounded hover:bg-[#53230A]"
              >
                <div className="flex items-center">
                  <FaPrint className="mr-2" /> <span>Print Page</span>
                </div>
              </button>
            </div>
            <legend
              className="float-none w-auto px-2"
              style={{ color: "#5E6E82", fontWeight: "bolder" }}
            >
              Log
            </legend>
            <FoodDetails selectedRowData={data} />
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default HomeEdit;
