import React, { useState, useMemo, useEffect } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../Components/prebuiltComponent/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsDrilldown from "highcharts/modules/drilldown";

const AdminHome = () => {
  const [cardData, setCardData] = useState([]);
  const navigate = useNavigate();
  const today = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const [filteredData, setFilteredData] = useState(cardData);
  const [selectedFromDate, setSelectedFromDate] = useState(today);
  const [selectedToDate, setSelectedToDate] = useState("");
  const [stalls, setStalls] = useState([]);

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === "selectedFromDate") {
      setSelectedFromDate(value);
    } else if (name === "selectedToDate") {
      setSelectedToDate(value);
    }
  };

  const PostFilterDate = async () => {
    if (!selectedFromDate && !selectedToDate) {
      toast.error("select date !");
      return;
    }
    const payload = {
      from_date: selectedFromDate,
      to_date: selectedToDate,
    };
    await axios
      .post(
        `${process.env.REACT_APP_API_BACKEND}/didi_thela_summary_by_date/`,
        payload
      )
      .then((res) => {
        setFilteredData(res.data.List);
        setTotalSale(res.data?.total_payment_sum);
        setTotalRemuneration(res.data?.remuneration);
      });
    await axios
      .post(`${process.env.REACT_APP_API_BACKEND}/theladetailsViewss/`, payload)
      .then((res) => {
        setStalls(res.data.thela_data);
      });
  };

  const handleReset = async () => {
    setSelectedFromDate(today);
    setSelectedToDate("");
    await PostFilterDate();
  };

  useEffect(() => {
    PostFilterDate();
  }, [selectedFromDate, selectedToDate]);

  const [totalSale, setTotalSale] = useState(0);
  const [totalRemuneration, setTotalRemuneration] = useState(0);

  const columns = useMemo(
    () => [
      { Header: "S. No.", Cell: ({ row }) => row.index + 1 },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Didi Name",
        accessor: "full_name",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "Amount Sold (INR)",
        accessor: "total_payment",
      },
      {
        Header: "Remuneration",
        accessor: "remuneration",
      },
      {
        Header: "Color Code",
        accessor: "color",
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <button
            onClick={() =>
              navigate(`/admin/${row.original.didi_id}/${row.original.date}`)
            }
            className="text-center w-full"
          >
            <i className="fas fa-eye"></i>
          </button>
        ),
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
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  //graph section
  const [options, setOptions] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "Basic Column Chart with Drilldown",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Total values",
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },
      },
    },
    tooltip: {
      headerFormat: "<span style='font-size:11px'>{series.name}</span><br>",
      pointFormat:
        "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y}</b><br/>",
    },
    series: [
      {
        name: "Categories",
        colorByPoint: true,
        data: [
          {
            name: "Category 1",
            y: 24,
            drilldown: "category1",
          },
          {
            name: "Category 2",
            y: 18,
            drilldown: "category2",
          },
          {
            name: "Category 3",
            y: 15,
            drilldown: "category3",
          },
        ],
      },
    ],
    drilldown: {
      series: [
        {
          id: "category1",
          data: [
            ["Subcategory 1.1", 5],
            ["Subcategory 1.2", 7],
            ["Subcategory 1.3", 12],
          ],
        },
        {
          id: "category2",
          data: [
            ["Subcategory 2.1", 3],
            ["Subcategory 2.2", 6],
            ["Subcategory 2.3", 9],
          ],
        },
        {
          id: "category3",
          data: [
            ["Subcategory 3.1", 4],
            ["Subcategory 3.2", 6],
            ["Subcategory 3.3", 5],
          ],
        },
      ],
    },
  });

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
                    className="p-2 cursor-pointer text-md font-normal border border-2"
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
                        className="p-2 border text-slate-600 border border-2"
                        style={{ color: "#5E6E82" }}
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

      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default AdminHome;
