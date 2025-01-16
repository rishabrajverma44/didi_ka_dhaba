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
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import CryptoJS from "crypto-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Map = React.lazy(() => import("./Admin/Map"));

const AdminHome = () => {
  const [cardData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(cardData);
  const [isReset, setIsReset] = useState(false);

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
  const subOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
  };

  const [selectedFromDate, setSelectedFromDate] = useState(
    formatDate(subOneDay(new Date()))
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
    setLoading(true);
    await axios
      .post(
        `${process.env.REACT_APP_API_BACKEND}/didi_thela_summary_by_date/`,
        payload
      )
      .then((res) => {
        const sortedData = res.data.List.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setLoading(false);
        setFilteredData(sortedData);
        setTotalSale(res.data?.total_payment_sum);
        setTotalRemuneration(res.data?.remuneration);
      });
    setLoading(false);
  };

  useEffect(() => {
    PostFilterDate();
    getGraph();
  }, []);

  const [totalSale, setTotalSale] = useState(0);
  const [totalRemuneration, setTotalRemuneration] = useState(0);

  const columns = useMemo(
    () => [
      { Header: "S. No.", Cell: ({ row }) => row.index + 1 },
      {
        Header: "Payment  Date",
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
          var colorClass = "";
          if (percentage <= -20) {
            colorClass = "bg-[#FF0000]";
          } else if (percentage < -10 && percentage > -20) {
            colorClass = "bg-[#FFFF00]";
          } else if (percentage < 0 && percentage > -10) {
            colorClass = "bg-[#4BB543]";
          } else if (percentage > 0) {
            colorClass = "bg-[#FFA500]";
          }

          return (
            <div
              className={`p-1 border border ${colorClass} font-semibold text-slate-950`}
            >
              {percentage * -1} %
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
        text: "Total Amount Sold ( ₹ )",
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

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div
      className="flex items-center border border-gray-300 py-1 px-3 rounded w-full cursor-pointer"
      onClick={onClick}
      ref={ref}
    >
      <input
        type="text"
        value={value}
        readOnly
        placeholder="Enter from date"
        className="w-full focus:outline-none"
      />
      <FaCalendarAlt className="ml-2 text-gray-500" />
    </div>
  ));

  useEffect(() => {
    if (isReset) {
      const fetchData = async () => {
        await PostFilterDate();
        await getGraph();
        setIsReset(false);
      };

      fetchData();
    }
  }, [isReset]);

  const handleReset = async () => {
    const fromDate = formatDate(subOneDay(new Date()));
    const toDate = formatDate(addOneDay(new Date()));

    setSelectedFromDate(fromDate);
    setSelectedToDate(toDate);
    setIsReset(true);
  };

  const handleSearch = async () => {
    await PostFilterDate();
    await getGraph();
  };

  return (
    <div className="px-6 md:px-12 bg-slate-100 pt-2 pb-2">
      <ToastContainer />

      <div className="pt-2 bg-white mb-2 px-2 pb-2">
        <div className="row">
          <div className="col-md-1 d-flex align-items-center justify-content-start">
            <span>From Date </span>
          </div>

          <div className="col-md-3">
            <DatePicker
              selected={selectedFromDate}
              onChange={(date) => handleDateChange(date, "selectedFromDate")}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput />}
            />
          </div>
          <div className="col-md-1 d-flex align-items-center justify-content-start">
            <span>To Date </span>
          </div>
          <div className="col-md-3">
            <DatePicker
              selected={selectedToDate}
              onChange={(date) => handleDateChange(date, "selectedToDate")}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput />}
            />
          </div>

          <div className="col-md-2">
            <button
              type="reset"
              className="btn btn-primary w-100 py-1"
              style={{ backgroundColor: "#682c13", borderColor: "#682c13" }}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <span>loading....</span> : <span>Search</span>}
            </button>
          </div>

          <div className="col-md-2">
            <button
              type="reset"
              className="btn btn-dark w-full py-1"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? <span>loading....</span> : <span>Reset</span>}
            </button>
          </div>
        </div>

        <div className="row my-2">
          <div className="col-md-4">
            <div className="text-xl font-semibold text-gray-800">
              Total Sale: ₹{" "}
              <span className="text-lg font-bold text-[#A24C4A] ml-2">
                {totalSale}
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-xl font-semibold text-gray-800">
              Total Remuneration: ₹{" "}
              <span className="text-lg font-bold text-[#A24C4A] ml-2">
                {totalRemuneration}
              </span>
            </div>
          </div>
          <div className="col-md-1">
            <div
              className="p-1 border rounded-lg bg-[#FFA500] font-semibold text-slate-950 text-center "
              title="<0%"
            >
              {"< 0%"}
            </div>
          </div>
          <div className="col-md-1">
            <div
              className="p-1 border rounded-lg bg-[#4BB543] font-semibold text-slate-950 text-center "
              title=">10%"
            >
              {"0-10%"}
            </div>
          </div>
          <div className="col-md-1">
            <div
              className="p-1 border rounded-lg bg-[#FFFF00] font-semibold text-slate-950 text-center "
              title="<20%"
            >
              {"10-20%"}
            </div>
          </div>
          <div className="col-md-1">
            <div
              className="p-1 border rounded-lg bg-[#FF0000] font-semibold text-slate-950 text-center "
              title="<20%"
            >
              {">21%"}
            </div>
          </div>
        </div>

        {loading ? (
          <>loading...</>
        ) : (
          <>
            {" "}
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
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="p-2 cursor-pointer text-md font-normal border border-1"
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
                              className="border text-slate-600 border border-1 py-0 pl-2 m-0"
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
                        className="p-2 text-center text-slate-600"
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
      <div>
        <div className="p-2 bg-white p-2 bg-white">
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
