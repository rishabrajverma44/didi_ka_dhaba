import React, { useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const ListFood = () => {
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const handleDelete = async (foodId) => {
    try {
      const res = await axios.delete(
        `https://didikadhababackend.indevconsultancy.in/dhaba/foodmaster/${foodId}/`
      );

      if (res.status === 204) {
        toast.success("Food deleted succesfully !");
      }

      setFoodData((prevData) =>
        prevData.filter((food) => food.food_id !== foodId)
      );
    } catch (error) {
      console.log("Error in delete:", error);
    }
  };

  const handleEdit = (foodId) => {
    console.log("Edit food with ID:", foodId);
  };

  const columns = React.useMemo(
    () => [
      { Header: "Food Name", accessor: "food_name" },
      { Header: "Category", accessor: "food_category_type" },
      { Header: "Unit", accessor: "unit_name" },
      { Header: "Unit Price", accessor: "per_unit_price" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            {/* <button
              onClick={() => handleEdit(row.original.food_id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaPencilAlt />
            </button> */}
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

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await axios.get(
          "https://didikadhababackend.indevconsultancy.in/dhaba/foodmaster/"
        );
        if (response.status === 200) {
          console.log(response);
          setFoodData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageCount,
    pageOptions,
    nextPage,
    previousPage,
    gotoPage,
  } = useTable(
    {
      columns,
      data: foodData,
      initialState: {
        pageIndex: 0,
        pageSize: 5,
      },
      globalFilter: searchText,
    },
    useGlobalFilter,
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
    <div className="bg-gray-50 p-4" style={{ height: "99vh" }}>
      <h1 className="text-2xl font-bold mb-4 text-slate-600">Food List</h1>
      <ToastContainer />
      <div className="mb-4">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search by Food Name or Category"
          className="px-4 w-50 py-2 border border-gray-300 rounded"
        />
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full bg-white border border-gray-200"
            >
              <thead className="bg-gray-100">
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="py-2 px-4 border-b text-slate-600"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {currentPageData.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.id}
                      className="hover:bg-gray-50"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="py-2 px-4 border-b text-slate-600"
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

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-4 py-2 bg-[#A24C4A] text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>

            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-4 py-2 bg-[#A24C4A] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListFood;
