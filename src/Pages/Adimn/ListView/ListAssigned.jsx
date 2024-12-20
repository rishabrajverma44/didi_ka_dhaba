import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://didikadhababackend.indevconsultancy.in/dhaba/didi_thela/"
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (Id) => {
    try {
      const res = await axios.delete(
        `https://didikadhababackend.indevconsultancy.in/dhaba/didi_thela/${Id}/`
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
      { Header: "From Date", accessor: "from_date" },
      { Header: "To Date", accessor: "to_date" },
      { Header: "Didi Name", accessor: "full_name" },
      { Header: "Stall Code", accessor: "thela_code" },
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

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      {
        columns,
        data,
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
    let filteredData = data;

    if (fromDate) {
      filteredData = filteredData.filter((item) => item.from_date >= fromDate);
    }
    if (toDate) {
      filteredData = filteredData.filter((item) => item.to_date <= toDate);
    }

    if (selectedDidi) {
      filteredData = filteredData.filter(
        (item) => item.full_name === selectedDidi
      );
    }

    if (selectedStall) {
      filteredData = filteredData.filter(
        (item) => item.thela_code === selectedStall
      );
    }

    setData(filteredData);
  };

  const getDidiName = async () => {
    try {
      const response = await axios.get(
        "https://didikadhababackend.indevconsultancy.in/dhaba/didi/"
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
        "https://didikadhababackend.indevconsultancy.in/dhaba/cities/"
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
    <div className="px-6 md:px-12">
      <ToastContainer />

      <div className="row px-2 mt-2" style={{ color: "#5E6E82" }}>
        <div className="col-md-2 ">From Date</div>
        <div className="col-md-2 ">To Date</div>
        <div className="col-md-3">Select Didi</div>
        <div className="col-md-3">Select City</div>
        <div className="col-md-1 d-flex align-items-end"></div>
        <div className="col-md-1 d-flex align-items-end"></div>
      </div>

      <div className="row pb-2 px-2">
        <div className="col-md-2 px-1">
          <input
            type="date"
            style={{ "box-shadow": "0px 1px 1px #e4e4e4" }}
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="col-md-2 px-1">
          <input
            type="date"
            style={{ "box-shadow": "0px 1px 1px #e4e4e4" }}
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="col-md-3 px-1">
          <select
            className="form-control"
            value={selectedDidi}
            onChange={(e) => setSelectedDidi(e.target.value)}
            style={{ "box-shadow": "0px 1px 1px #e4e4e4" }}
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

        <div className="col-md-3 px-1">
          <select
            className="form-control"
            value={selectedStall}
            onChange={(e) => setSelectedStall(e.target.value)}
            style={{ "box-shadow": "0px 1px 1px #e4e4e4" }}
          >
            <option value="">Select City</option>
            {cityList.map((item, index) => (
              <option key={index} value={item.city_name}>
                {item.city_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-1 d-flex align-items-end px-1">
          <button
            type="button"
            className="btn btn-primary w-100"
            style={{ backgroundColor: "#682c13", borderColor: "#682c13" }}
            onClick={handleSearch}
          >
            Search
          </button>
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
          <table {...getTableProps()} className="w-full table table-bordered ">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="border border-2"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
              {page.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center p-4 text-red-500"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-200">
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
      )}
    </div>
  );
};

export default ListAssigned;
