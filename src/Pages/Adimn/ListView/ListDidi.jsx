import React, { useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../Components/prebuiltComponent/Pagination";

const ListDidi = () => {
  const navigate = useNavigate();
  const [didiData, setDidiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const base_url = "https://didikadhababackend.indevconsultancy.in/dhaba";

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      const res = await axios.delete(
        `https://didikadhababackend.indevconsultancy.in/dhaba/didi/${deleteId}/`
      );
      console.log(res.data.message);
      toast.success(res.data.message);
      setDidiData((prevData) =>
        prevData.filter((didi) => didi.didi_id !== deleteId)
      );
      setShowModal(false);
    } catch (error) {
      console.log("Error in delete:", error);
      toast.error("Error deleting the record");
    }
  };

  const columns = React.useMemo(
    () => [
      { Header: "S. No", Cell: ({ row }) => row.index + 1 },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) =>
          value ? (
            <img
              src={base_url + value}
              alt="Didi"
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <span className="text-gray-500">No image</span>
          ),
      },
      { Header: "Full Name", accessor: "full_name" },
      { Header: "Mobile No", accessor: "mobile_no" },
      { Header: "Alternate Mobile No", accessor: "alternate_mobile_no" },
      { Header: "Husband Name", accessor: "husband_name" },

      { Header: "Address", accessor: "address" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-6">
            <button
              onClick={() => navigate(`/didilist/${row.original.didi_id}`)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaPencilAlt />
            </button>
            <button
              onClick={() => {
                setDeleteId(row.original.didi_id);
                setShowModal(true);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const fetchDidiData = async () => {
      try {
        const response = await axios.get(
          "https://didikadhababackend.indevconsultancy.in/dhaba/didi/"
        );
        setDidiData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDidiData();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: didiData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
      globalFilter: searchText,
    },
    useGlobalFilter,
    usePagination
  );

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setGlobalFilter(e.target.value);
  };

  const currentPageData = rows.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  return (
    <div className="py-2 px-6 md:px-12">
      <ToastContainer />
      <div className="mb-4">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search by Full Name or Mobile No"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A24C4A] w-full md:w-80 transition duration-200"
        />
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-3">
            <table
              {...getTableProps()}
              className="w-full table table-bordered table-hover"
            >
              <thead className="bg-[#682C13] text-normal">
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="py-2 border-b text-white"
                        style={{ backgroundColor: "#682C13", color: "white" }}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <span className="ml-2 border p-1 rounded text-white">
                                <i className="fa">&#xf150;</i>{" "}
                              </span>
                            ) : (
                              <span className="ml-2 border p-1 rounded text-white">
                                <i className="fa">&#xf0d8;</i>{" "}
                              </span>
                            )
                          ) : (
                            ""
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {currentPageData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-2 text-slate-600"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentPageData.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={row.id}
                        className="hover:bg-gray-50"
                      >
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="py-2 border-b"
                            style={{ color: "#5E6E82" }}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={Math.ceil(didiData.length / pageSize)}
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            setPageSize={setPageSize}
          />
        </>
      )}

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Delete Confirmation"
        className="bg-white p-6 rounded-md shadow-md w-1/3"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to delete this Didi?
        </h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Yes, Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ListDidi;
