import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import Modal from "react-modal";
import { FaFilePdf } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
Modal.setAppElement("#root");

const AdminHome = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "https://didikadhababackend.indevconsultancy.in/dhaba/didi_thela_summary/",
          { date: selectedDate }
        );
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setLoading(true);
  };

  const handleViewDetails = async (row) => {
    try {
      const res = await axios.post(
        "https://didikadhababackend.indevconsultancy.in/dhaba/details-by-meal-type/",
        { didi_id: row.original.didi_id, date: selectedDate }
      );
      setSelectedRowData(res.data);
      console.log(selectedRowData);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Didi Name", accessor: "full_name" },
      { Header: "Stall", accessor: "thela_code" },
      { Header: "Amount", accessor: "total_payment" },
      {
        Header: "View",
        Cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row)}
            className="tracking-wide font-semibold bg-white text-[#A24C4A] px-2 h-6 rounded border-1 border-[#A24C4A]"
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        sortBy: [
          {
            id: "total_payment",
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  const FoodDetails = ({ selectedRowData }) => {
    return (
      <div className="p-1 w-full bg-white mb-8 rounded-md pb-4">
        <h2 className="text-2xl font-bold mb-4 text-[#A24C4A] text-center">
          Food Summary
        </h2>
        {selectedRowData ? (
          <div className="space-y-6 px-3">
            {selectedRowData.issued_food &&
            Object.keys(selectedRowData.issued_food).length > 0 ? (
              Object.keys(selectedRowData.issued_food).map((mealType) => (
                <div key={mealType}>
                  <h3 className="text-xl font-semibold mb-2 text-gray-700 capitalize text-slate-600">
                    {mealType.replace("-", " ")} Issued :-
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-3">
                    {selectedRowData.issued_food[mealType].length > 0 ? (
                      selectedRowData.issued_food[mealType].map((item) => (
                        <div
                          key={item.issue_food_id}
                          className="px-3 border border-gray-200 rounded-md"
                        >
                          <p className="font-medium text-gray-800 my-1">
                            {item.food_name}
                          </p>
                          <p className="my-1">
                            <span className="text-gray-500">Quantity: </span>
                            <span className="font-medium">
                              {item.quantity} {item.unit_name}
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-4 text-gray-500">
                        No issued food data available.
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No issued food data available.</p>
            )}

            {selectedRowData.returned_food &&
            Object.keys(selectedRowData.returned_food).length > 0 ? (
              Object.keys(selectedRowData.returned_food).map((mealType) => (
                <div key={mealType}>
                  <h3 className="text-xl font-semibold mb-2 text-gray-700 capitalize text-slate-600">
                    {mealType.replace("-", " ")} (Returned)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-3">
                    {selectedRowData.returned_food[mealType].length > 0 ? (
                      selectedRowData.returned_food[mealType].map((item) => (
                        <div
                          key={item.issue_food_id}
                          className="px-3 border border-gray-200 rounded-md"
                        >
                          <p className="font-medium text-gray-800 my-1">
                            {item.food_name}
                          </p>
                          <p className="my-1">
                            <span className="text-gray-500">
                              Returned Quantity:{" "}
                            </span>
                            <span className="font-medium">
                              {item.returned_quantity} {item.unit_name}
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-4 text-gray-500">
                        No returned food data available.
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No returned food data available.</p>
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
                        <span className="text-gray-500">UPI Amount: </span>₹
                        {payment.upi_amount}
                      </p>
                      <p className="font-medium text-gray-800 my-1">
                        <span className="text-gray-500">Cash Amount: </span>₹
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

  return (
    <div className="bg-gray-50 py-2 px-4" style={{ height: "99vh" }}>
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center text-slate-600">
        Admin Home
      </h2>
      <div className="border rounded-lg bg-white text-center p-12">
        Graph section
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 mt-3">
        <input
          type="text"
          placeholder="Search by Didi Name or Stall Code"
          value={globalFilter || ""}
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            setGlobalFilter(value);
          }}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A24C4A] w-full md:w-80 transition duration-200"
        />

        <div className="md:w-60">
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2 pl-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200"
          />
        </div>

        <button className="flex items-center gap-2 text-[#A24C4A] font-semibold py-2 px-5 rounded-md border border-[#A24C4A] hover:bg-[#A24C4A] hover:text-white transition duration-200">
          <FaFilePdf size={20} />
          Download PDF
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="overflow-auto border rounded-lg">
            <table {...getTableProps()} className="w-full text-left">
              <thead className="bg-gray-100">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="p-2 border-b cursor-pointer"
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " ▼"
                              : " ▲"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-50">
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="p-2 border-b">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-4 py-2 bg-[#A24C4A] text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>

            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-4 py-2 bg-[#A24C4A] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Row Details"
            className="bg-white rounded-lg shadow-lg w-full max-w-screen-lg h-full max-h-[90vh] relative"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6"
          >
            <div className="overflow-y-auto max-h-[calc(100%-4rem)] mb-16">
              <div>
                {selectedRowData && (
                  <FoodDetails selectedRowData={selectedRowData} />
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-white p-2 shadow-lg flex justify-end space-x-4">
              <button
                onClick={() => setModalIsOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AdminHome;
