import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/prebuiltComponent/Pagination";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

const DailyLog = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDidi, setSelectedDidi] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [didiList, setDidiList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BACKEND}/didi_thela_summary/`
      );
      const sortedData = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [selectedDate, fetchData]);

  const formatDate = (date) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date, name) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setLoading(true);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const isCityMatch = selectedCity ? item.city === selectedCity : true;
      const isDidiMatch = selectedDidi ? item.full_name === selectedDidi : true;
      const isDateMatch = selectedDate ? item.date === selectedDate : true;
      return isCityMatch && isDidiMatch && isDateMatch;
    });
  }, [data, selectedCity, selectedDidi, selectedDate]);

  const columns = useMemo(
    () => [
      { Header: "S. No.", Cell: ({ row }) => row.index + 1 },
      {
        Header: "Payment Date",
        accessor: "date",
        Cell: ({ row }) => {
          const date = row.original.date;
          return date ? date.split("-").reverse().join("-") : "N/A";
        },
      },
      { Header: "Didi Name", accessor: "full_name" },
      { Header: "City", accessor: "city" },
      {
        Header: "Amount Sold ( ₹ )",
        accessor: "total_payment",
        Cell: ({ row }) => {
          const amount = row.original.total_payment;
          return amount ? `₹ ${amount.toLocaleString()}` : "N/A";
        },
      },
      {
        Header: "Remuneration ( ₹ )",
        accessor: "remuneration",
        Cell: ({ row }) => {
          const amount = row.original.remuneration;
          return amount ? `₹ ${amount.toLocaleString()}` : "N/A";
        },
      },
      {
        Header: "View",
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
    [navigate]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  const handleReset = () => {
    setSelectedDidi("");
    setSelectedCity("");
    setSelectedDate("");
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
    <div className="px-6 md:px-12 bg-slate-100 py-2 pb-4">
      <ToastContainer />
      <div className="bg-white p-2">
        <div className="row mb-2 px-2">
          <div className="col-md-3 px-1">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => handleDateChange(date, "selectedFromDate")}
              placeholderText="Enter from date"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput />}
              wrapperClassName="w-full"
            />
          </div>

          <div className="col-md-4 px-1">
            <div className="relative">
              <select
                id="selectDidi1"
                className="form-control pl-3 pr-8 py-1"
                name="didi"
                style={{
                  boxShadow: "0px 0px 1px #e4e4e4",
                }}
                value={selectedDidi}
                onChange={(e) => setSelectedDidi(e.target.value)}
              >
                <option value="" disabled>
                  Select Didi Name
                </option>
                {didiList.map((item, index) => (
                  <option key={index} value={item.full_name}>
                    {item.full_name}
                  </option>
                ))}
              </select>

              <div className="absolute right-3 top-2">
                <i className="fas fa-chevron-down text-gray-500"></i>
              </div>
            </div>
          </div>

          <div className="col-md-4 px-1">
            <div className="relative">
              <select
                id="selectCity"
                className="form-control pl-3 pr-8 w-full py-1"
                name="city"
                style={{ boxShadow: "0px 0px 1px #e4e4e4" }}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="" disabled>
                  Select City
                </option>
                {cityList.map((item, index) => (
                  <option key={index} value={item.city_name}>
                    {item.city_name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2">
                <i className="fas fa-chevron-down text-gray-500"></i>
              </div>
            </div>
          </div>

          <div className="col-md-1 d-flex align-items-end px-1">
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
          <div className="overflow-auto">
            <table
              {...getTableProps()}
              className="w-full table table-bordered table-hover"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="p-2 cursor-pointer text-md font-normal border border-1"
                        style={{ backgroundColor: "#682C13", color: "white" }}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <span className="ml-2 border p-2 rounded text-white">
                                <i className="fa">&#xf150;</i>
                              </span>
                            ) : (
                              <span className="ml-2 border p-2 rounded text-white">
                                <i className="fa">&#xf0d8;</i>
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
                {page.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headerGroups[0].headers.length}
                      className="text-center p-2"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="border text-slate-600 border border-1 py-1 pl-2 m-0"
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
        )}

        <Pagination
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={Math.ceil(filteredData.length / pageSize)}
          gotoPage={gotoPage}
          previousPage={previousPage}
          nextPage={nextPage}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
};

export default DailyLog;
