import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import Pagination from "../../../Components/prebuiltComponent/Pagination";
import { Link, useNavigate } from "react-router-dom";

const ListFood = () => {
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchFoodData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BACKEND}/foodmaster/`
      );
      if (response.status === 200) {
        setFoodData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "S. No.",
      },
      {
        Header: "Food Name",
        accessor: "food_name",
      },
      {
        Header: "Category",
        accessor: "food_category_type",
      },
      {
        Header: "Unit",
        accessor: "unit_name",
      },
      {
        Header: "Unit Price ( ₹ )",
        accessor: "per_unit_price",
        Cell: ({ row }) => {
          const price = row.original.per_unit_price;
          return price ? `₹ ${Math.floor(price).toLocaleString()}` : "N/A";
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-around">
            <button
              onClick={() => navigate(`${row.original.food_id}`)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaPencilAlt />
            </button>
            <button
              onClick={() => handleDelete(row.original.food_id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleDelete = async (foodId) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_BACKEND}/foodmaster/${foodId}/`
      );
      if (res.status === 204) {
        toast.success("Food deleted successfully!");
      }
      setFoodData((prevData) =>
        prevData.filter((food) => food.food_id !== foodId)
      );
    } catch (error) {
      console.log("Error in delete:", error);
    }
  };

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
      data: foodData,
      initialState: { pageIndex: 0, pageSize: 10 },
      globalFilter: searchText,
    },
    useGlobalFilter,
    useSortBy,
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
    <div className="px-6 md:px-12 bg-slate-100 py-2 pb-4">
      <ToastContainer />
      <div className="bg-white p-2">
        <div className="mb-2">
          <div className="flex items-center justify-between space-x-2">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search"
              className="w-64 p-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
            <span className="d-flex gap-4">
              <Link
                to="/plateDetails"
                className="d-flex align-items-center btn btn-dark hover:bg-[#53230A] px-3 py-1"
              >
                <span> Plates</span>
              </Link>
              <Link
                to="/addfood"
                className="d-flex align-items-center btn btn-dark hover:bg-[#53230A] px-3 py-1"
              >
                <FaPlus className="me-1 text-sm" />
                <span>Add</span>
              </Link>
            </span>
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
              pageCount={Math.ceil(foodData.length / pageSize)}
              gotoPage={gotoPage}
              previousPage={previousPage}
              nextPage={nextPage}
              setPageSize={setPageSize}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ListFood;
