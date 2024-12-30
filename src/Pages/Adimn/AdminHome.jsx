import React, { useState, useMemo, useCallback } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { ToastContainer } from "react-toastify";
import Pagination from "../../Components/prebuiltComponent/Pagination";

const AdminHome = () => {
  const [cardData, setCardData] = useState([
    {
      id: 1,
      from_date: "28-12-2024",
      to_date: "02-01-2025",
      didi_name: "surya umesh",
      city: "Gurugram",
      amount_sold_inr: 946,
      remuneration: 200,
    },
    {
      id: 2,
      from_date: "27-12-2024",
      to_date: "30-12-2024",
      didi_name: "Priyanka Mishra",
      city: "Gurugram",
      amount_sold_inr: 556,
      remuneration: 200,
    },
    {
      id: 3,
      from_date: "15-12-2024",
      to_date: "20-12-2024",
      didi_name: "Anjali Sharma",
      city: "Noida",
      amount_sold_inr: 1123,
      remuneration: 250,
    },
    {
      id: 4,
      from_date: "22-12-2024",
      to_date: "27-12-2024",
      didi_name: "Ravi Kumar",
      city: "Delhi",
      amount_sold_inr: 987,
      remuneration: 220,
    },
    {
      id: 5,
      from_date: "10-12-2024",
      to_date: "14-12-2024",
      didi_name: "Nina Gupta",
      city: "Gurugram",
      amount_sold_inr: 754,
      remuneration: 180,
    },
    {
      id: 6,
      from_date: "05-12-2024",
      to_date: "09-12-2024",
      didi_name: "Vikram Singh",
      city: "Faridabad",
      amount_sold_inr: 880,
      remuneration: 210,
    },
    {
      id: 7,
      from_date: "01-12-2024",
      to_date: "05-12-2024",
      didi_name: "Seema Verma",
      city: "Gurugram",
      amount_sold_inr: 1034,
      remuneration: 240,
    },
    {
      id: 8,
      from_date: "18-11-2024",
      to_date: "22-11-2024",
      didi_name: "Amit Kapoor",
      city: "Delhi",
      amount_sold_inr: 910,
      remuneration: 230,
    },
    {
      id: 9,
      from_date: "25-11-2024",
      to_date: "28-11-2024",
      didi_name: "Ritu Yadav",
      city: "Noida",
      amount_sold_inr: 1250,
      remuneration: 270,
    },
    {
      id: 10,
      from_date: "12-11-2024",
      to_date: "17-11-2024",
      didi_name: "Karan Jain",
      city: "Gurugram",
      amount_sold_inr: 880,
      remuneration: 210,
    },
  ]);

  const [filteredData, setFilteredData] = useState(cardData);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === "selectedFromDate") {
      setSelectedFromDate(value);
    } else if (name === "selectedToDate") {
      setSelectedToDate(value);
    }
  };

  const handleReset = () => {
    setSelectedFromDate("");
    setSelectedToDate("");
    setFilteredData(cardData);
  };

  const handleSearch = () => {
    const fromDate = selectedFromDate ? new Date(selectedFromDate) : null;
    const toDate = selectedToDate ? new Date(selectedToDate) : null;

    const filtered = cardData.filter((item) => {
      const itemFromDate = new Date(
        item.from_date.split("-").reverse().join("-")
      );
      const itemToDate = new Date(item.to_date.split("-").reverse().join("-"));

      const isFromDateValid = !fromDate || itemFromDate >= fromDate;
      const isToDateValid = !toDate || itemToDate <= toDate;

      return isFromDateValid && isToDateValid;
    });

    setFilteredData(filtered);
  };

  const totalSale = filteredData.reduce(
    (acc, item) => acc + item.amount_sold_inr,
    0
  );
  const totalRemuneration = filteredData.reduce(
    (acc, item) => acc + item.remuneration,
    0
  );

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "From Date",
        accessor: "from_date",
      },
      {
        Header: "To Date",
        accessor: "to_date",
      },
      {
        Header: "Didi Name",
        accessor: "didi_name",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "Amount Sold (INR)",
        accessor: "amount_sold_inr",
      },
      {
        Header: "Remuneration",
        accessor: "remuneration",
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
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    gotoPage,
    setPageSize,
    pageCount,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="py-2 px-6 md:px-12">
      <ToastContainer />

      <div className="p-2 mb-2">
        <div className="row mb-2 px-2 d-flex justify-content-center">
          <div className="col-md-3">
            <input
              type="date"
              id="selectedFromDate"
              className="form-control w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="selectedFromDate"
              value={selectedFromDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              id="selectedToDate"
              className="form-control w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="selectedToDate"
              value={selectedToDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="col-md-1">
            <button onClick={handleSearch} className="btn btn-dark">
              Search
            </button>
          </div>
          <div className="col-md-1">
            <button type="reset" className="btn btn-dark" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="border p-2 mb-6 bg-white rounded-lg shadow-sm flex gap-24 justify-center items-center">
        <div className="flex gap-6">
          <div className="text-xl font-semibold text-gray-800">Total Sale:</div>
          <div className="text-lg text-green-500 font-bold">
            {totalSale} INR
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-xl font-semibold text-gray-800">
            Total Remuneration:
          </div>
          <div className="text-lg text-blue-500 font-bold">
            {totalRemuneration} INR
          </div>
        </div>
      </div>

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
                    className="p-2 cursor-pointer text-md font-normal"
                    style={{ backgroundColor: "#682C13", color: "white" }}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <span className="ml-2 border p-1 rounded text-white">
                            <i className="fa">&#xf150;</i>
                          </span>
                        ) : (
                          <span className="ml-2 border p-1 rounded text-white">
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
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headerGroups[0].headers.length}
                  className="text-center p-2"
                >
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="p-2 border"
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
        canNextPage={canNextPage}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default AdminHome;
