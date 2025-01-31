import React, { useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import Pagination from "../Components/prebuiltComponent/Pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../Components/prebuiltComponent/Breadcrumb";

const Report = () => {
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  };

  const subTwoDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 2);
    return newDate;
  };

  const [selectedFromDate, setSelectedFromDate] = useState(
    formatDate(subTwoDay(new Date()))
  );
  const [selectedToDate, setSelectedToDate] = useState(
    formatDate(addOneDay(new Date()))
  );

  const fetchFilteredData = async () => {
    if (!selectedFromDate || !selectedToDate) {
      console.log("Please select a valid date range!");
      return;
    }

    const payload = {
      from_date: selectedFromDate,
      to_date: selectedToDate,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BACKEND}/didi_thela_summary_by_date/`,
        payload
      );

      const sortedData = response.data.List.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setFilteredData(sortedData);
    } catch (error) {
      console.log("Failed to fetch data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, []);

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
      {
        Header: "Didi Name",
        accessor: "full_name",
        Cell: ({ row }) => {
          const fullName = row.original.full_name;
          return fullName
            ? fullName
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")
            : "N/A";
        },
      },
      {
        Header: "Stall Location",
        accessor: "city",
      },
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
        Header: "Plate-wise ( ₹ )",
        accessor: "plate_total_price",
        Cell: ({ row }) => {
          const amount = row.original.plate_total_price;
          return amount ? `₹ ${Math.floor(amount).toLocaleString()}` : "N/A";
        },
      },
      {
        Header: "Quantity-wise ( ₹ )",
        accessor: "food_total_price",
        Cell: ({ row }) => {
          const amount = row.original.food_total_price;
          return amount ? `₹ ${Math.floor(amount).toLocaleString()}` : "N/A";
        },
      },
      {
        Header: "Color Code",
        accessor: "color",
        Cell: ({ row }) => {
          const percentage = row.original.percentage_difference;
          let colorClass = "";
          if (percentage <= -20) {
            colorClass = "bg-[#FF0000]";
          } else if (percentage < -10) {
            colorClass = "bg-[#FFFF00]";
          } else if (percentage <= 0) {
            colorClass = "bg-[#4BB543]";
          } else {
            colorClass = "bg-[#FFA500]";
          }
          return (
            <div
              className={`p-1 border ${colorClass} font-semibold text-slate-950`}
            >
              {percentage} %
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    gotoPage,
    setPageSize,
    pageCount,
    state: { pageIndex, pageSize },
    setGlobalFilter: setTableGlobalFilter,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 },
      globalFilter,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  const breadcrumbItems = [
    { label: "Home", href: "/mobilehome" },
    { label: "Report", href: `` },
  ];

  return (
    <div
      className="px-6 md:px-12 bg-slate-100 pt-2 pb-2"
      style={{ minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Report
          </b>
        </div>

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <h1 className="text-xl font-semibold mb-2"></h1>

      <div className="mb-2">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search"
          className="w-64 p-2 py-1 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>

      <div className="pt-2 bg-white mb-2 px-2 pb-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="overflow-auto mb-2">
              <table
                {...getTableProps()}
                className="w-full table-auto border-collapse border border-gray-300"
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="p-2 cursor-pointer text-md font-medium bg-[#682C13] text-white border"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <i className="fas fa-sort-down ml-2"></i>
                              ) : (
                                <i className="fas fa-sort-up ml-2"></i>
                              )
                            ) : null}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.length > 0 ? (
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          key={row.id}
                          {...row.getRowProps()}
                          className="hover:bg-gray-100"
                        >
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              className="px-1 border text-slate-600"
                            >
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="p-4 text-center text-slate-600"
                      >
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredData.length > 0 && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Report;
