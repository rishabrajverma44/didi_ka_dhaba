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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://didikadhababackend.indevconsultancy.in/dhaba/didi_thela_summary/"
        );
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = async (row) => {
    try {
      const res = await axios.post(
        "https://didikadhababackend.indevconsultancy.in/dhaba/get_didi_details/",
        { didi_id: row.original.didi_id }
      );
      setSelectedRowData(res.data);
      console.log(res.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Didi Name", accessor: "full_name" },
      { Header: "Stall", accessor: "thela_code" },
      { Header: "Payment", accessor: "payment" },
      // { Header: "Date", accessor: "date" },
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
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  return (
    <div className="bg-gray-50 py-2 px-4" style={{ height: "99vh" }}>
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center text-slate-600">
        Assign Didi to Stall
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Didi Name or Stall Code"
          value={globalFilter || ""}
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            setGlobalFilter(value);
          }}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-[#A24C4A] w-full md:w-80"
        />
        <button className="flex items-center gap-2 tracking-wide font-semibold text-[#A24C4A] py-2 px-4 mt-4 md:mt-0 rounded border border-[#A24C4A] hover:bg-[#A24C4A] hover:text-white transition">
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
            className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          >
            <h2 className="text-2xl font-bold mb-4">Didi Details</h2>
            {selectedRowData ? (
              <div>
                <p>
                  <strong>Name:</strong> {selectedRowData.full_name}
                </p>
                <p>
                  <strong>Stall Code:</strong> {selectedRowData.thela_code}
                </p>
                <p>
                  <strong>Payment:</strong> {selectedRowData.payment}
                </p>
                <p>
                  <strong>Date:</strong> {selectedRowData.date}
                </p>
              </div>
            ) : (
              <p>No data available.</p>
            )}
            <button
              onClick={() => setModalIsOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AdminHome;
