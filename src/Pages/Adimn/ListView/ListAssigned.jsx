import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../../Components/prebuiltComponent/Pagination";
import DatePicker from "react-datepicker";

const ListAssigned = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDidi, setSelectedDidi] = useState("");
  const [selectedStall, setSelectedStall] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [didiList, setDidiList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [searchText, setSearchText] = useState("");

  const formatDate = (date) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BACKEND}/didi_thela/`
      );
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

  const handleDelete = async (Id) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_BACKEND}/didi_thela/${Id}/`
      );

      if (res.status === 200) {
        toast.success(res.message);
        fetchData();
      }
    } catch (error) {
      console.log("Error in delete:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      { Header: "S. No", accessor: "serialNumber" },
      {
        Header: "From Date",
        Cell: ({ row }) => {
          return row.original.from_date.split("-").reverse().join("-");
        },
      },
      {
        Header: "To Date",
        Cell: ({ row }) => {
          return row.original.to_date.split("-").reverse().join("-");
        },
      },
      { Header: "Didi Name", accessor: "full_name" },
      { Header: "Stall Code", accessor: "thela_code" },
      { Header: "Stall Name", accessor: "thela_name" },
      { Header: "Stall City", accessor: "city_name" },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-around">
            <button
              onClick={() =>
                navigate(`/assign_list/${row.original.didi_thela_id}`)
              }
              className="text-blue-500 hover:text-blue-700"
            >
              <FaPencilAlt />
            </button>

            <button
              onClick={() => handleDelete(row.original.didi_thela_id)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              <FaTrashAlt />
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
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: data,
      initialState: { pageIndex: 0, pageSize: 10 },
      globalFilter: searchText,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setSelectedDidi("");
    setSelectedStall("");
    fetchData();
  };

  const handleSearch = () => {
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

    if (selectedDidi) {
      filteredData = filteredData.filter(
        (item) => item.full_name.toLowerCase() === selectedDidi.toLowerCase()
      );
    }

    if (selectedStall) {
      filteredData = filteredData.filter((item) =>
        item.didi_name_and_thela_code
          .toLowerCase()
          .includes(selectedStall.toLowerCase())
      );
    }

    setData(filteredData);
    console.log(filteredData);
  };

  const getDidiName = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BACKEND}/didi/`
      );
      if (response.status === 200) {
        setDidiList(response.data);
      } else {
        setDidiList([]);
      }
    } catch (error) {
      console.log("Error in getting didi:", error);
      setDidiList([]);
    }
  };

  const getCity = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BACKEND}/cities/`
      );
      if (response.status === 200) {
        setCityList(response.data);
      } else {
        setCityList([]);
      }
    } catch (error) {
      console.log("Error in getting didi:", error);
      setDidiList([]);
    }
  };

  useEffect(() => {
    getDidiName();
    getCity();
  }, []);

  const currentPageData = rows.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  return (
    <div className="px-6 md:px-12">
      <ToastContainer />

      <div className="row pb-2 px-2 mt-2">
        <div className="col-md-2 px-1">
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date, "fromDate")}
            dateFormat="dd/MM/yyyy"
            placeholderText="Enter from date"
            className="form-control w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            wrapperClassName="w-full"
          />
        </div>

        <div className="col-md-2 px-1">
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date, "fromDate")}
            dateFormat="dd/MM/yyyy"
            placeholderText="Enter from date"
            className="form-control w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            wrapperClassName="w-full"
          />
        </div>

        <div className="col-md-3 px-1">
          <select
            className="form-control px-3 py-2"
            value={selectedDidi}
            onChange={(e) => setSelectedDidi(e.target.value)}
            style={{
              "box-shadow": "0px 1px 1px #e4e4e4",
            }}
          >
            <option value="" disabled={true}>
              Select Didi
            </option>
            {didiList.map((item, index) => (
              <option key={index} value={item.full_name}>
                {item.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 d-flex align-items-end px-1">
          <button
            type="button"
            className="btn btn-primary w-100 py-2"
            style={{ backgroundColor: "#682c13", borderColor: "#682c13" }}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="col-md-2 d-flex align-items-end px-1">
          <button
            type="reset"
            className="btn btn-dark w-100 py-2"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        <div className="col-md-1 d-flex align-items-end px-1">
          <Link
            to="/assign"
            className="d-flex align-items-center btn btn-dark hover:bg-[#53230A] px-3 py-2"
          >
            <FaPlus className="me-1" />
            <span>Add</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
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
                    className="border border-2"
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
                          className="p-2 border border-2"
                          style={{ color: "#5E6E82" }}
                        >
                          {index + 1}
                        </td>
                        {row.cells.map((cell, idx) => {
                          if (idx === 0) return null;
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="p-2 border border-2"
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
    </div>
  );
};

export default ListAssigned;
