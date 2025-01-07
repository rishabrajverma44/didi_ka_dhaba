import React, {
  useState,
  useMemo,
  useEffect,
  Suspense,
  startTransition,
} from "react";
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

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CryptoJS from "crypto-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Map = React.lazy(() => import("./Admin/Map"));

const AdminHome = () => {
  const [cardData] = useState([]);
  const navigate = useNavigate();

  const [filteredData, setFilteredData] = useState(cardData);

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

  const [selectedFromDate, setSelectedFromDate] = useState(
    formatDate(new Date())
  );
  const [selectedToDate, setSelectedToDate] = useState(
    formatDate(addOneDay(new Date()))
  );

  const handleDateChange = (date, name) => {
    const formattedDate = formatDate(date);

    if (name === "selectedFromDate") {
      if (
        selectedToDate &&
        new Date(formattedDate) > new Date(selectedToDate)
      ) {
        toast.error("From Date cannot be later than To Date.");
      } else {
        setSelectedFromDate(formattedDate);
      }
    } else if (name === "selectedToDate") {
      if (
        selectedFromDate &&
        new Date(selectedFromDate) > new Date(formattedDate)
      ) {
        toast.error("To Date cannot be earlier than From Date.");
      } else {
        setSelectedToDate(formattedDate);
      }
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
        const sortedData = res.data.List.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setFilteredData(sortedData);
        setTotalSale(res.data?.total_payment_sum);
        setTotalRemuneration(res.data?.remuneration);
      });
  };

  const handleReset = async () => {
    setSelectedFromDate(formatDate(new Date()));
    setSelectedToDate(formatDate(addOneDay(new Date())));
    await PostFilterDate();
  };

  useEffect(() => {
    PostFilterDate();
    getGraph();
  }, [selectedFromDate, selectedToDate]);

  const [totalSale, setTotalSale] = useState(0);
  const [totalRemuneration, setTotalRemuneration] = useState(0);

  const columns = useMemo(
    () => [
      { Header: "S. No.", Cell: ({ row }) => row.index + 1 },
      {
        Header: "Pyment Date",
        accessor: "date",
        Cell: ({ row }) => {
          const date = row.original.date;
          return date ? date.split("-").reverse().join("-") : "N/A";
        },
      },
      {
        Header: "Didi Name",
        accessor: "full_name",
      },
      {
        Header: "Stall Location",
        accessor: "city",
      },
      {
        Header: "Amount Sold ( ₹ )",
        accessor: "total_payment",
      },
      {
        Header: "Remuneration ( ₹ )",
        accessor: "remuneration",
      },
      {
        Header: " Plate-wise ( ₹ )",
        accessor: "plate_total_price",
      },
      {
        Header: "Quantity-wise ( ₹ )",
        accessor: "food_total_price",
      },
      {
        Header: "Color Code",
        accessor: "color",
        Cell: ({ row }) => {
          const percentage = row.original.percentage_difference;
          var colorClass = "";
          if (percentage <= 0) {
            colorClass = "bg-[#FFA500]";
          } else if (percentage > 0 && percentage < 10) {
            colorClass = "bg-[#4BB543]";
          } else if (percentage >= 10 && percentage < 20) {
            colorClass = "bg-[#FFFF00]";
          } else if (percentage >= 20) {
            colorClass = "bg-[#FF0000]";
          }

          return (
            <div
              className={`p-1 border border ${colorClass} font-semibold text-slate-950`}
            >
              {percentage} %
            </div>
          );
        },
      },
      {
        Header: "View",
        Cell: ({ row }) => (
          <>
            <button
              onClick={() =>
                navigate(`/admin/${row.original.didi_id}/${row.original.date}`)
              }
              className="text-center w-full"
            >
              <i className="fas fa-eye"></i>
            </button>
          </>
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
  const getGraph = async () => {
    const payload = {
      from_date: selectedFromDate,
      to_date: selectedToDate,
    };
    axios
      .post(`${process.env.REACT_APP_API_BACKEND}/api_didi_payments/`, payload)
      .then((res) => {
        if (res.status == 200) {
          const jsonData = res.data;
          const outerColorPalette = ["#F39E60", "#7C444F", "#E16A54"];
          const drilldownColorPalette = "#F39E60";

          const graphSeries = jsonData.series.map((item, index) => ({
            name: item.name,
            colorByPoint: true,
            data: item.data.map((dataPoint, dataIndex) => ({
              name: dataPoint.name,
              y: dataPoint.y,
              drilldown: dataPoint.drilldown,

              color: outerColorPalette[dataIndex % outerColorPalette.length],
            })),
          }));

          const graphDrillDown = jsonData.drilldown.map((item) => ({
            id: item.id,
            data: item.data.map((drillData, drillIndex) => ({
              name: drillData[0],
              y: drillData[1],
              color: drilldownColorPalette,
            })),
          }));

          setOptions((prevOptions) => ({
            ...prevOptions,
            series: graphSeries,
            drilldown: {
              series: graphDrillDown,
            },
          }));
        }
      })
      .catch((error) => {
        console.log("error in graph", error);
      });
  };

  const [options, setOptions] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "Total Sale Details Based on City",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Total 	Amount Sold (INR)",
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
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
    series: [],
    drilldown: {
      series: [],
    },
  });

  //map;
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setShowSecond(true);
    });
  }, []);

  return (
    <div className="py-2 px-6 md:px-12">
      <ToastContainer />

      <div className="border p-2 bg-white rounded-lg shadow-sm mb-2">
        <div className="row">
          <div className="col-md-4">
            <DatePicker
              selected={selectedFromDate}
              onChange={(date) => handleDateChange(date, "selectedFromDate")}
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter from date"
              className="form-control w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              wrapperClassName="w-full"
            />
          </div>
          <div className="col-md-4">
            <DatePicker
              selected={selectedToDate}
              onChange={(date) => handleDateChange(date, "selectedToDate")}
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter to date"
              className="form-control w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              wrapperClassName="w-full"
            />
          </div>

          <div className="col-md-4">
            <button
              type="reset"
              className="btn btn-dark w-full py-2"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center my-3">
          <div className="text-xl font-semibold text-gray-800">
            Total Sale: ₹{" "}
            <span className="text-lg font-bold text-[#A24C4A]">
              {totalSale}
            </span>
          </div>

          <div className="text-xl font-semibold text-gray-800">
            Total Remuneration: ₹{" "}
            <span className="text-lg font-bold text-[#A24C4A]">
              {totalRemuneration}
            </span>
          </div>

          <div
            className="p-1 border rounded-lg bg-[#FFA500] font-semibold text-slate-950 text-center w-[80px] sm:w-[100px]"
            title="<0%"
          >
            {"< 0%"}
          </div>
          <div
            className="p-1 border rounded-lg bg-[#4BB543] font-semibold text-slate-950 text-center w-[80px] sm:w-[100px]"
            title=">10%"
          >
            {"0-10%"}
          </div>
          <div
            className="p-1 border rounded-lg bg-[#FFFF00] font-semibold text-slate-950 text-center w-[80px] sm:w-[100px]"
            title="<20%"
          >
            {"10-20%"}
          </div>
          <div
            className="p-1 border rounded-lg bg-[#FF0000] font-semibold text-slate-950 text-center w-[80px] sm:w-[100px]"
            title="<20%"
          >
            {">21%"}
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
      </div>
      <div>
        <div className="border p-2 bg-white rounded-lg shadow-sm p-2 bg-white">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>

      {showSecond && (
        <Suspense fallback={<div>Loading second component...</div>}>
          <Map />
        </Suspense>
      )}
    </div>
  );
};

export default AdminHome;
