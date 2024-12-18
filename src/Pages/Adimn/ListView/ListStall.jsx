import React, { useEffect, useRef, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const mealCategories = [{ "Break-fast": 1 }, { Lunch: 2 }, { Dinner: 3 }];

const ListStall = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownOpenCategory, setIsDropdownOpenCategory] = useState(false);
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
      { Header: "Stall Name", accessor: "food_name" },
      { Header: "Stall ID", accessor: "food_category_type" },
      { Header: "Address", accessor: "unit_name" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-around">
            <button
              onClick={() => handleEdit(row.original.food_id)}
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

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await axios.get(
          "https://didikadhababackend.indevconsultancy.in/dhaba/foodmaster/"
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

  const dropdownRefCategory = useRef(null);
  useEffect(() => {
    console.log(selectedCategory);
    setGlobalFilter(selectedCategory);
  }, [selectedCategory]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRefCategory.current &&
        !dropdownRefCategory.current.contains(e.target)
      ) {
        setIsDropdownOpenCategory(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-50 py-2 px-24" style={{ height: "99vh" }}>
      <h1 className="text-2xl font-bold mb-4 text-slate-600">Stall List</h1>
      <ToastContainer />
    </div>
  );
};

export default ListStall;
