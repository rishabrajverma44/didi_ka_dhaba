import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import Pagination from "../../../Components/prebuiltComponent/Pagination";
import { useNavigate } from "react-router-dom";

const ListStall = () => {
  const navigate = useNavigate();
  const [stallData, setStallData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchstallData = async () => {
    try {
      const response = await axios.get(
        "https://didikadhababackend.indevconsultancy.in/dhaba/thelas/"
      );
      if (response.status === 200) {
        setStallData(response.data);
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchstallData();
  }, []);

  const customGlobalFilter = (rows, ids, query) => {
    return rows.filter((row) => {
      const stallName = row.values.thela_name?.toLowerCase() || "";
      const cityName = row.values.city_name?.toLowerCase() || "";
      const searchText = query.toLowerCase();

      return stallName.includes(searchText) || cityName.includes(searchText);
    });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "S. No.",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Stall Name",
        accessor: "thela_name",
      },
      {
        Header: "Stall Code",
        accessor: "thela_code",
      },
      {
        Header: "City",
        accessor: "city_name",
      },
      {
        Header: "Addresh",
        accessor: "location",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-around">
            <button
              onClick={() => navigate(`${row.original.thela_id}`)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaPencilAlt />
            </button>
            <button
              onClick={() => handleDelete(row.original.thela_id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const handleDelete = async (stallId) => {
    try {
      const res = await axios.delete(
        `https://didikadhababackend.indevconsultancy.in/dhaba/thelas/${stallId}/`
      );
      if (res.status === 204) {
        toast.success("Stall deleted successfully!");
        setStallData((prevData) =>
          prevData.filter((stall) => stall.thela_id !== stallId)
        );
      }
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
      data: stallData,
      initialState: { pageIndex: 0, pageSize: 10 },
      globalFilter: customGlobalFilter,
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
    <div className="py-2 px-6 md:px-12">
      <ToastContainer />
      <div className="mb-4 flex items-center justify-between space-x-4">
        <div className="flex-1 w-full max-w-xs">
          <label className="block text-slate-600 mb-1 font-medium">
            Search
          </label>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search by City Name or Stall Name"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A24C4A] w-full transition duration-200"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
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
                      className="text-center p-4 text-red-500"
                    >
                      No results found.
                    </td>
                  </tr>
                ) : (
                  currentPageData.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={row.id}
                        className="hover:bg-gray-200"
                      >
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
            pageCount={Math.ceil(stallData.length / pageSize)}
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

export default ListStall;
