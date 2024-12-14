import React, { useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const ListDidi = () => {
  const [didiData, setDidiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const base_url = "https://didikadhababackend.indevconsultancy.in/dhaba";

  const handleDelete = async (didiId) => {
    try {
      const res = await axios.delete(
        `https://didikadhababackend.indevconsultancy.in/dhaba/didi/${didiId}/`
      );
      console.log(res.data.message);
      toast.success(res.data.message);

      // Update the didiData state by removing the deleted didi
      setDidiData((prevData) =>
        prevData.filter((didi) => didi.didi_id !== didiId)
      );
    } catch (error) {
      console.log("Error in delete:", error);
    }
  };

  const handleEdit = (didiId) => {
    console.log("Edit didi with ID:", didiId);
  };

  // Columns definition
  const columns = React.useMemo(
    () => [
      { Header: "Full Name", accessor: "full_name" },
      { Header: "Mobile No", accessor: "mobile_no" },
      { Header: "Alternate Mobile No", accessor: "alternate_mobile_no" },
      { Header: "Husband Name", accessor: "husband_name" },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) =>
          value ? (
            <img
              src={base_url + value}
              alt="Didi"
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <span className="text-gray-500">No image</span>
          ),
      },
      { Header: "Address", accessor: "address" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            {/* <button
              onClick={() => handleEdit(row.original.didi_id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaPencilAlt />
            </button> */}
            <button
              onClick={() => handleDelete(row.original.didi_id)}
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
    const fetchDidiData = async () => {
      try {
        const response = await axios.get(
          "https://didikadhababackend.indevconsultancy.in/dhaba/didi/"
        );
        setDidiData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDidiData();
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
      data: didiData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
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
    <div className="bg-gray-50 py-2 px-24" style={{ height: "99vh" }}>
      <h1 className="text-2xl font-bold mb-4 text-slate-600">Didi Table</h1>
      <ToastContainer />
      <div className="mb-4">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search by Full Name or Mobile No"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A24C4A] w-full md:w-80 transition duration-200"
        />
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <>
          <div className="border rounded-lg bg-white text-center p-2">
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
                          className={`py-2 px-4 border-b text-slate-600 ${
                            column.id === "image" ? "w-32" : ""
                          }`}
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
          </div>
        </>
      )}
    </div>
  );
};

export default ListDidi;
