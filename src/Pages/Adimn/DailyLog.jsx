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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
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
        Header: "Pyment Date",
        accessor: "date",
        Cell: ({ row }) => {
          const date = row.original.date;
          return date ? date.split("-").reverse().join("-") : "N/A";
        },
      },
      { Header: "Didi Name", accessor: "full_name" },
      { Header: "City", accessor: "city" },
      { Header: "Amount Sold (INR)", accessor: "total_payment" },
      { Header: "Remuneration", accessor: "remuneration" },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <button
            onClick={() =>
              navigate(`/admin/${row.original.didi_id}/${row.original.date}`)
            }
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
  return (
    <div className="py-2 px-6 md:px-12">
      <ToastContainer />

      <div className="row mb-2 px-2 mt-2">
        <div className="col-md-3 px-1">
          <input
            type="date"
            id="selectDate"
            className="form-control w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="col-md-4 px-1">
          <div className="relative">
            <select
              id="selectDidi1"
              className="form-control pl-3 pr-8 py-2 w-full"
              name="didi"
              style={{ boxShadow: "0px 1px 1px #e4e4e4" }}
              value={selectedDidi}
              onChange={(e) => setSelectedDidi(e.target.value)}
            >
              <option value="" disabled>
                Select Didi
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
              className="form-control pl-3 pr-8 py-2 w-full"
              name="city"
              style={{ boxShadow: "0px 1px 1px #e4e4e4" }}
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
            className="btn btn-dark w-100"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
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
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="p-2 cursor-pointer text-md font-normal border border-2"
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
                          className="p-2 border border border-2"
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

      {/* Pagination Component */}
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
  );
};

export default DailyLog;
