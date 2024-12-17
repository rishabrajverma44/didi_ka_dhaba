import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../Components/prebuiltComponent/Breadcrumb";

const HomeEdit = () => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`https://api.example.com/products/${id}`);
      const data = await response.json();
      setData(data);
    };

    fetchProduct();
  }, [id]);

  const handleViewDetails = async (row) => {
    try {
      const res = await axios.post(
        "https://didikadhababackend.indevconsultancy.in/dhaba/details-by-meal-type/"
      );
      setSelectedRowData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const FoodDetails = ({ selectedRowData }) => {
    return (
      <div className="p-1 w-full bg-white mb-8 rounded-md pb-4">
        <h2 className="text-2xl font-bold mb-4 text-[#A24C4A] text-center">
          Food Summary
        </h2>
        {selectedRowData ? (
          <div className="space-y-6 px-3">
            {selectedRowData.issued_food || selectedRowData.returned_food ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left text-slate-600">
                        Meal Type
                      </th>
                      <th className="py-2 px-4 border-b text-center text-slate-600">
                        Issued
                      </th>
                      <th className="py-2 px-4 border-b text-center text-slate-600">
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
                                    {item.food_name} - {item.returned_quantity}{" "}
                                    {item.unit_name}
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-3">
                  {selectedRowData.payment_details.map((payment, index) => (
                    <div
                      key={index}
                      className="px-3 border border-gray-200 rounded-md"
                    >
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
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </div>
    );
  };

  const breadcrumbItems = [
    { label: "Home", href: "/admin" },
    { label: "Didi Details", href: `/admin/${id}` },
  ];
  return (
    <div className="px-12 py-2">
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

      <div className="border border-1 rounded px-2 py-4 shadow-sm border-bottom-4">
        {" "}
        <div className="row mb-2">
          <div className="col md-6 fw-bold" style={{ color: "#5E6E82" }}>
            Name :-
          </div>
          <div className="col md-6" style={{ color: "#5E6E82" }}>
            John Doe
          </div>
          <div className="col md-6 fw-bold" style={{ color: "#5E6E82" }}>
            {" "}
            Date :-
          </div>
          <div className="col md-6" style={{ color: "#5E6E82" }}>
            13-12-2024
          </div>
        </div>
        <div className="row">
          <div className="col md-6 fw-bold" style={{ color: "#5E6E82" }}>
            Stall Name :-
          </div>
          <div className="col md-6" style={{ color: "#5E6E82" }}>
            Fresh Farm Produce
          </div>
          <div className="col md-6 fw-bold" style={{ color: "#5E6E82" }}>
            Total Sale :-
          </div>
          <div className="col md-6" style={{ color: "#5E6E82" }}>
            2 Lakh
          </div>
        </div>
      </div>

      <div className="mt-3">
        <fieldset
          className="border border-2 card p-3 relative"
          style={{ zIndex: -1 }}
        >
          <legend
            className="float-none w-auto px-2"
            style={{ color: "#5E6E82", fontWeight: "bolder" }}
          >
            Log
          </legend>
        </fieldset>
      </div>
    </div>
  );
};

export default HomeEdit;
