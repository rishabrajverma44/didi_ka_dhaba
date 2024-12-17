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

const AdminHome = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDidi, setSelectedDidi] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
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
  }, [selectedDate]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [selectedDate, fetchData]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setLoading(true);
  };

  const columns = useMemo(
    () => [
      { Header: "Sl.No" },
      { Header: "Date", accessor: "date" },
      { Header: "Didi Name", accessor: "full_name" },
      { Header: "Amount Sold (INR)", accessor: "total_payment" },
      { Header: "Remuneration", accessor: "Remuneration" },
      {
        Header: "Action",
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
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
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

  const handleReset = () => {
    setSelectedDate(today);
    setSelectedDidi("");
    setSelectedCity("");
  };

  return (
    <div className=" py-2 px-12">
      <ToastContainer />

      <div className="row py-4 px-2">
        <div className="col-md-3 px-1">
          <input
            type="date"
            id="selectDate"
            style={{ "box-shadow": "0px 1px 1px #e4e4e4" }}
            className="form-control"
            name="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="col-md-3 px-1">
          <select
            id="selectDidi1"
            className="form-control"
            name="didi"
            style={{ "box-shadow": "0px 1px 1px #e4e4e4" }}
            value={selectedDidi}
            onChange={(e) => setSelectedDidi(e.target.value)}
          >
            <option value="" disabled={true}>
              Select Didi
            </option>
            <option value="parul goyal">parul goyal</option>
            <option value="lipika Mohapatro">lipika Mohapatro</option>
            <option value="Rita Devi">Rita Devi</option>
          </select>
        </div>

        <div className="col-md-3 px-1">
          <select
            id="selectCity"
            className="form-control"
            name="city"
            style={{ "box-shadow": "0px 1px 1px #e4e4e4" }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="" disabled={true}>
              Select City
            </option>
            <option value="Gurugram">Gurugram</option>
            <option value="Delhi">Delhi</option>
            <option value="Noida">Noida</option>
          </select>
        </div>

        <div className="col-md-2 d-flex align-items-end px-1">
          <button
            type="button"
            className="btn btn-primary w-100"
            style={{ backgroundColor: "#682c13", borderColor: "#682c13" }}
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
        <>
          <div className="">
            <div className="overflow-auto">
              <table
                {...getTableProps()}
                className="w-full table table-bordered table-hover"
              >
                <thead className="">
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
                          className="p-2 cursor-pointer text-md font-normal text-center"
                          style={{ backgroundColor: "#682C13", color: "white" }}
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <i className="fa fa-arrow-down px-2"></i>
                              ) : (
                                <i className="fa fa-arrow-up px-2"></i>
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
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="hover:bg-gray-200">
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="p-2 border border-2"
                            style={{ color: "#5E6E82" }}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHome;
