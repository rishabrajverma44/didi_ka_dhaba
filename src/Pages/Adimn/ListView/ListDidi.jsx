import React, { useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import { FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../../Components/prebuiltComponent/Pagination";

const ListDidi = () => {
  const navigate = useNavigate();
  const [didiData, setDidiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [route, setRoute] = useState();
  const [route2, setRoute2] = useState();
  const [route3, setRoute3] = useState();

  useEffect(() => {
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    if (userCredentials) {
      const { email } = userCredentials;

      if (email === "admin@gmail.com") {
        setRoute("/didilist");
        setRoute2("/didiprofile");
        setRoute3("/didireg");
      } else {
        setRoute("/didilist-register");
        setRoute2("/didiprofile-register");
        setRoute3("/didireg-register");
      }
    }
  }, []);

  const base_url = process.env.REACT_APP_API_BACKEND;

  // const handleDelete = async () => {
  //   if (deleteId === null) return;
  //   try {
  //     const res = await axios.delete(
  //       `${process.env.REACT_APP_API_BACKEND}/didi/${deleteId}/`
  //     );
  //     toast.success(res.data.message);
  //     setDidiData((prevData) =>
  //       prevData.filter((didi) => didi.didi_id !== deleteId)
  //     );
  //     setShowModal(false);
  //   } catch (error) {
  //     console.log("Error in delete:", error);
  //     toast.error("Error deleting the record");
  //   }
  // };

  const columns = React.useMemo(
    () => [
      { Header: "S. No", Cell: ({ row }) => row.index + 1 },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value, row }) =>
          value ? (
            <img
              src={base_url + value}
              alt="Didi"
              className="w-16 h-16 object-cover rounded cursor-pointer"
              onClick={() => navigate(`${route2}/${row.original.didi_id}`)}
            />
          ) : (
            <span className="text-gray-500">No image</span>
          ),
      },
      {
        Header: "Full Name",
        accessor: "full_name",
        Cell: ({ value, row }) =>
          value ? (
            <button
              onClick={() => navigate(`${route2}/${row.original.didi_id}`)}
            >
              {row.original.full_name}
            </button>
          ) : (
            <span className="text-gray-500">No name</span>
          ),
      },
      { Header: "Mobile No", accessor: "mobile_no" },
      { Header: "Scanner No", accessor: "scanner_no" },
      { Header: "Husband Name", accessor: "husband_name" },
      { Header: "Address", accessor: "address" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="text-center">
            <button
              onClick={() => {
                if (route) {
                  navigate(`${route}/${row.original.didi_id}`);
                }
              }}
              className="text-blue-500 hover:text-blue-700"
              disabled={!route}
            >
              <FaPencilAlt />
            </button>
            {/* <button
              onClick={() => {
                setDeleteId(row.original.didi_id);
                setShowModal(true);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button> */}
          </div>
        ),
      },
      {
        Header: "Payment",
        Cell: ({ row }) => (
          <button
            onClick={() => navigate(`/admin/${row.original.didi_id}`)}
            className="text-center w-full"
          >
            <i className="fas fa-eye"></i>
          </button>
        ),
      },
    ],
    [base_url, navigate, route, setDeleteId, setShowModal]
  );
  useEffect(() => {
    const fetchDidiData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BACKEND}/didi/`
        );
        const sortedData = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setDidiData(sortedData);
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
    page,
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
    <div
      className="px-6 md:px-12 bg-slate-100 py-2 pb-4"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer />
      <div className="bg-white p-2">
        <div className="mb-2">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search"
              className="w-full md:w-64 p-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
            <Link
              to={route3}
              className="d-flex align-items-center btn btn-dark hover:bg-[#53230A] px-3 py-1"
            >
              <FaPlus className="me-1 text-sm" />
              <span>Add</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600" style={{ minHeight: "100vh" }}>
            Loading...
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mb-2">
              <table
                {...getTableProps()}
                className="w-full table table-bordered table-hover"
              >
                <thead className="bg-[#682C13]">
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      key={headerGroup.id}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          className="py-2 border-b text-white"
                          style={{
                            backgroundColor: "#682C13",
                            color: "white",
                            fontWeight: "inherit",
                          }}
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <span className="ml-2 border p-1 rounded text-white">
                                  <i className="fa">&#xf150;</i>{" "}
                                </span>
                              ) : (
                                <span className="ml-2 border py-0 pl-2 m-0 rounded text-white">
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
                    <tr style={{ minHeight: "100vh" }}>
                      <td
                        colSpan={columns.length}
                        className="py-2 text-slate-600 text-center"
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
                          style={{
                            verticalAlign: "middle",
                          }}
                        >
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              className="border border-1 p-1"
                              style={{
                                color: "#5E6E82",
                                verticalAlign: "middle",
                              }}
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
          className="bg-white p-6 rounded-md shadow-md w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <h2 className="text-lg font-semibold mb-4 text-center">
            Are you sure you want to delete this item?
          </h2>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              No
            </button>
            {/* <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Yes, Delete
          </button> */}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ListDidi;
