import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaCalendarAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../Components/prebuiltComponent/Pagination";
import DatePicker from "react-datepicker";
import { Modal, Button } from "react-bootstrap";

const DailyLog = () => {
  const navigate = useNavigate();
  const [route2, setRoute2] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleShow = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    if (userCredentials) {
      const { email } = userCredentials;

      if (email === "admin@gmail.com") {
        setRoute2("/didiprofile");
      } else {
        setRoute2("/didiprofile-register");
      }
    }
  }, []);
  const base_url = process.env.REACT_APP_API_BACKEND;

  const formatDate = (date) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/didi/`);
      const sortedData = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      { Header: "S. No", Cell: ({ row }) => row.index + 1 },
      // {
      //   Header: "From Date",
      //   accessor: "from",
      // },
      // {
      //   Header: "To Date",
      //   accessor: "date1",
      // },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value, row }) =>
          value ? (
            <div className="d-flex justify-content-center">
              <img
                src={base_url + value}
                alt="Didi"
                className="w-16 h-16 object-cover rounded cursor-pointer"
                onClick={() => navigate(`${route2}/${row.original.didi_id}`)}
              />
            </div>
          ) : (
            <span className="text-gray-500">No image</span>
          ),
      },
      { Header: "Didi Name", accessor: "full_name" },
      {
        Header: "Total Remuneration",
        accessor: "rr",
      },
      {
        Header: "Total Sale",
        accessor: "sale",
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-around">
            <button
              onClick={() => handleShow(row.original.didi_thela_id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <i className="fas fa-eye"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleReset = () => {
    setFromDate("");
    setToDate("");

    fetchData();
  };

  const handleSearch = () => {
    console.log(fromDate);
    console.log(toDate);
    if (fromDate > toDate) {
      toast.error("From date is earlier than To date");
      return;
    }

    let filteredData = [...data];
    console.log(filteredData);

    const formattedFromDate = fromDate ? formatDate(fromDate) : null;
    const formattedToDate = toDate ? formatDate(toDate) : null;

    if (formattedFromDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.from_date) >= new Date(formattedFromDate)
      );
    }
    if (formattedToDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.to_date) <= new Date(formattedToDate)
      );
    }

    setData(filteredData);
    console.log(filteredData);
  };

  const currentPageData = rows.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const CustomInput = React.forwardRef(
    ({ value, onClick, placeholder }, ref) => (
      <div
        className="flex items-center border border-gray-300 py-1 px-3 rounded w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={onClick}
        ref={ref}
      >
        <input
          type="text"
          value={value}
          readOnly
          placeholder={placeholder}
          className="w-full focus:outline-none"
        />
        <FaCalendarAlt className="ml-2 text-gray-500" />
      </div>
    )
  );

  return (
    <div
      className="px-6 md:px-12 bg-slate-100 py-2 pb-4"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer />
      <div className="bg-white p-2">
        <div className="row pb-2">
          <div className="col-md-4 w-full">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date, "fromDate")}
              placeholderText="Enter from date"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput />}
              wrapperClassName="w-full"
            />
          </div>

          <div className="col-md-4 px-1">
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date, "toDate")}
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter to date"
              customInput={<CustomInput />}
              wrapperClassName="w-full"
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-primary w-100 py-1"
              style={{ backgroundColor: "#682c13", borderColor: "#682c13" }}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              type="reset"
              className="btn btn-dark w-100 py-1"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600" style={{ minHeight: "100vh" }}>
            Loading...
          </p>
        ) : (
          <>
            <div className="overflow-auto">
              <table
                {...getTableProps()}
                className="w-full table table-bordered table-hover"
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      className="border border-1"
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="p-2 cursor-pointer text-md font-normal"
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
                        className="text-center text-red-500"
                      >
                        No results found.
                      </td>
                    </tr>
                  ) : (
                    currentPageData.map((row, index) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          key={row.id}
                          className="hover:bg-gray-200"
                        >
                          <td
                            className="border text-slate-600 border border-1 py-1 pl-2 m-0"
                            style={{ color: "#5E6E82" }}
                          >
                            {index + 1}
                          </td>
                          {row.cells.map((cell, idx) => {
                            if (idx === 0) return null;
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="border text-slate-600 border border-1 py-1 pl-2 m-0"
                                style={{ color: "#5E6E82" }}
                              >
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
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
              pageCount={Math.ceil(data.length / pageSize)}
              gotoPage={gotoPage}
              previousPage={previousPage}
              nextPage={nextPage}
              setPageSize={setPageSize}
            />
          </>
        )}

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Details for the item with ID: {selectedId}</p>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default DailyLog;
