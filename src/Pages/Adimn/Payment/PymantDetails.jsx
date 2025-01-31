import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { FaCalendarAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../../../Components/prebuiltComponent/Pagination";
import DatePicker from "react-datepicker";

const PaymentDetails = () => {
  const { id } = useParams();
  const [reset, setReset] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);
  const base_url = process.env.REACT_APP_API_BACKEND;

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getData = (id) => {
    const formattedFromDate = fromDate ? formatDate(fromDate) : null;
    const formattedToDate = toDate ? formatDate(toDate) : null;
    const payload = {
      didi_id: id,
      start_date: formattedFromDate,
      end_date: formattedToDate,
    };
    setLoading(true);
    axios
      .post(`${base_url}/remuneration-list/`, payload)
      .then((res) => {
        if (res.status === 200) {
          const { payment_details, ...rest } = res.data;
          setPaymentDetails(rest);
          setTableDetails(payment_details);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Error fetching data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && reset) {
      getData(id);
      setReset(false);
    }
  }, [id, reset]);

  const columns = useMemo(
    () => [
      {
        Header: "S. No",
        accessor: "serialNo",
        Cell: ({ row }) => row.index + 1,
      },
      { Header: "Payment Date", accessor: "payment_date" },
      {
        Header: "Remuneration",
        accessor: "remuneration",
        Cell: ({ value }) => {
          const numericValue = parseFloat(value);
          return !isNaN(numericValue) ? `₹ ${numericValue.toFixed(0)}` : "0.00";
        },
      },
      {
        Header: "Waste (Returned)",
        columns: [
          {
            Header: "Roti",
            accessor: "return_roti",
            Cell: ({ value }) => {
              const numericValue = parseFloat(value);
              return !isNaN(numericValue)
                ? `${numericValue.toFixed(0)} Pice`
                : "0.00";
            },
          },
          {
            Header: "Rice",
            accessor: "return_rice",
            Cell: ({ value }) => {
              const numericValue = parseFloat(value);
              return !isNaN(numericValue)
                ? `${numericValue.toFixed(0)} Pice`
                : "0.00";
            },
          },
        ],
      },
      {
        Header: "Payments",
        columns: [
          {
            Header: "Cash",
            accessor: "cash",
            Cell: ({ value }) => {
              const numericValue = parseFloat(value);
              return !isNaN(numericValue)
                ? `₹ ${numericValue.toFixed(0)}`
                : "0.00";
            },
          },
          {
            Header: "UPI",
            accessor: "upi",
            Cell: ({ value }) => {
              const numericValue = parseFloat(value);
              return !isNaN(numericValue)
                ? `₹ ${numericValue.toFixed(0)}`
                : "0.00";
            },
          },
          {
            Header: "Total Payment",
            accessor: "total_payment",
            Cell: ({ value }) => {
              const numericValue = parseFloat(value);
              return !isNaN(numericValue)
                ? `₹ ${numericValue.toFixed(0)}`
                : "0.00";
            },
          },
        ],
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
      data: tableDetails,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleReset = async () => {
    setFromDate(null);
    setToDate(null);
    setReset(true);
  };

  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      toast.error("Both From Date and To Date are required.");
      return;
    }

    if (fromDate && toDate && fromDate > toDate) {
      toast.error("From date is earlier than To date");
      return;
    }

    await getData(id);
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
              onChange={(date) => setFromDate(date)}
              placeholderText="Enter from date"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput />}
              wrapperClassName="w-full"
            />
          </div>

          <div className="col-md-4 px-1">
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
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

        <div className="border border-1 rounded px-8 py-1 shadow-sm border-bottom-4 bg-white">
          <div className="row mb-2">
            <div className="col-md-2">Didi Name :</div>
            <div className="col-md-2">{paymentDetails?.didi_name}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-2">Total Remuneration :</div>
            <div className="col-md-2 d-flex justify-content-between align-items-center">
              ₹{" "}
              {Number(paymentDetails?.total_remuneration).toLocaleString(
                "en-IN"
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-2">Total Amount :</div>
            <div className="col-md-2">
              ₹ {Number(paymentDetails?.total_amount).toLocaleString("en-IN")}
            </div>
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
                          className={`p-2 cursor-pointer text-md font-normal ${
                            column.columns ? "text-center" : "text-left"
                          }`}
                          style={{
                            backgroundColor: "#682C13",
                            color: "white",
                          }}
                          colSpan={column.columns ? column.columns.length : 1}
                        >
                          {column.render("Header")}
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
              pageIndex={pageIndex}
              pageSize={pageSize}
              canNextPage={canNextPage}
              canPreviousPage={canPreviousPage}
              nextPage={nextPage}
              previousPage={previousPage}
              gotoPage={gotoPage}
              setPageSize={setPageSize}
              pageCount={Math.ceil(rows.length / pageSize)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
