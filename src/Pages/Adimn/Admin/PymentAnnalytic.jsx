import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { FiArrowUp, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

const PymentAnnalytic = () => {
  const [response, setResponse] = useState([]);
  const [collection, setCollection] = useState(0);
  const [lastIncrement, setLastIncre] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("7D");

  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/payment-analytics/`)
      .then((res) => {
        if (res.status == 200) {
          const jsonData = res.data;
          setResponse(jsonData);
          setCollection(jsonData.total_collection);
          setLastIncre(jsonData.collection_growth);
          setPymentData(jsonData.payment_trend);
        }
      })
      .catch((error) => {
        console.log("error in graph", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const [paymentTrendData, setPymentData] = useState([]);
  useEffect(() => {
    if (paymentTrendData.length > 0) {
      setOptions({
        chart: {
          type: "column",
        },
        title: {
          text: "",
        },
        xAxis: {
          categories: paymentTrendData.map((item) => item.date),
          title: {
            text: "Date",
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "Total Amount",
          },
          gridLineWidth: 0,
          lineWidth: 1,
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color: "black",
            },
          },
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>' +
            ": <b>{point.y}</b> ({point.percentage:.0f}%)<br/>",
          shared: true,
        },
        plotOptions: {
          series: {
            stacking: "normal",
          },
        },
        series: [
          {
            name: "UPI",
            data: paymentTrendData.map((item) => item.upi),
            color: "#28a745",
          },
          {
            name: "Cash",
            data: paymentTrendData.map((item) => item.cash),
            color: "#007bff",
          },
        ],
        legend: {
          enabled: true,
        },
        credits: {
          enabled: false,
        },
      });
    }
  }, [paymentTrendData]);

  const [options, setOptions] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "Payment Trend",
    },
    xAxis: {
      categories: [],
      title: {
        text: "Date",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total Amount",
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
          color: "black",
        },
      },
    },
    tooltip: {
      pointFormat: "Total: {point.stackTotal}",
    },
    plotOptions: {
      series: {
        stacking: "normal",
      },
    },
    series: [
      {
        name: "UPI",
        data: [],
        color: "#28a745",
      },
      {
        name: "Cash",
        data: [],
        color: "#007bff",
      },
    ],
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
  });

  const [options1, setOptions1] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "Payment Trend",
    },
    xAxis: {
      categories: [],
      title: {
        text: "Date",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total Amount",
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
          color: "black",
        },
      },
    },
    tooltip: {
      pointFormat: "Total: {point.stackTotal}",
    },
    plotOptions: {
      series: {
        stacking: "normal",
      },
    },
    series: [
      {
        name: "UPI",
        data: [],
        color: "#28a745",
      },
      {
        name: "Cash",
        data: [],
        color: "#007bff",
      },
    ],
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
  });

  return (
    <div className="">
      <div className="text-lg font-semibold text-slate-700">
        {response?.total_collection_label
          ? response.total_collection_label.split(" ")[0] + " Collection"
          : "Loading..."}
        <span className="text-slate-500">
          {response?.total_collection_label
            ? ` (${
                response.total_collection_label
                  .split("(")
                  .slice(-1)[0]
                  ?.split(")")[0]
              })`
            : ""}
        </span>
      </div>

      <div className="mt-2">
        <h1 className="text-3xl font-bold text-slate-800">
          ₹ {collection.toLocaleString("en-IN")}
        </h1>
      </div>
      <div className="mt-3 flex items-center">
        <span className="font-medium text-green-600 flex items-center bg-slate-200 rounded-md px-1">
          <FiArrowUp className="mr-1" />₹{" "}
          {lastIncrement.toLocaleString("en-IN")}
        </span>
        <span className="ml-2 font-normal text-sm text-slate-500">
          vs last month (01-29 Dec)
        </span>
      </div>

      <div className="mt-2 flex items-center space-x-2 bg-orange-50 rounded-md px-2 py-3 md:px-4 md:py-4 font-semibold font-2xl w-full ">
        <span className="text-orange-800 flex items-center space-x-2">
          <span className="text-xl md:text-2xl">
            <FiTrendingUp />
          </span>
          <span className="text-xs md:text-base">
            This month's collection is at highest in 6 months !
          </span>
        </span>
      </div>

      <div className="mt-3 mb-3 grid grid-cols-2 md:gap-4 gap-2">
        <div className="p-1 rounded-lg border">
          <div className="bg-slate-100 rounded-t-lg md:p-2 p-1">
            <span className="font-semibold text-sm sm:text-xs md:text-lg">
              Daily Average Collection
            </span>{" "}
            <span className="text-xs sm:text-sm md:text-base leading-tight">
              (01-27 Jan)
            </span>
          </div>

          <div className="text-sm sm:text-base md:text-lg md:p-2">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 pl-1">
                ₹
                {response?.daily_avg_collection
                  ?.toFixed(0)
                  .toLocaleString("en-IN")}
              </h3>
              <div className="flex items-center">
                <span className="font-medium text-green-600 flex items-center rounded-md">
                  <FiArrowUp className="mr-1" />₹{" "}
                  {response.daily_avg_collection_growth
                    ? Number(
                        response.daily_avg_collection_growth.toFixed(0)
                      ).toLocaleString("en-IN")
                    : "N/A"}
                </span>
                <span className="ml-2 font-normal text-[12px] md:text-sm text-slate-500">
                  vs last month
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-1 rounded-lg border">
          <div className="bg-slate-100 rounded-t-lg  md:p-2 p-1">
            <span className="font-semibold text-sm sm:text-xs md:text-lg">
              Total Transaction Count
            </span>
            <span className="text-xs sm:text-sm md:text-base leading-tight">
              (01-27 Jan)
            </span>
          </div>
          <div className="text-sm sm:text-base md:text-lg md:p-2">
            <h3 className="text-2xl font-bold text-slate-800 pl-2">
              {response.total_transactions?.toFixed(0).toLocaleString("en-IN")}
            </h3>
            <div className="flex items-center">
              <span className="font-medium text-green-600 flex items-center rounded-md px-1">
                <FiArrowUp className="mr-1" />
                {response?.transaction_growth
                  ?.toFixed(0)
                  .toLocaleString("en-IN")}
              </span>
              <span className="ml-2 font-normal text-[12px] md:text-sm text-slate-500">
                vs last month
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between items-center bg-white">
          <div>
            <h3 className="text-sm md:text-xl font-bold text-slate-800">
              Your Payment Trends
            </h3>
            <h4 className="text-sm text-slate-600">Last 7 days</h4>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-2 py-2 md:px-4 md:py-2 text-md font-medium rounded-md ${
                selectedFilter === "7D"
                  ? "bg-slate-200 border-1 border-green-600"
                  : "text-slate-700 border border-slate-300 hover:bg-slate-100"
              }`}
              onClick={() => setSelectedFilter("7D")}
            >
              7D
            </button>
            <button
              className={`px-2 py-2 md:px-4 md:py-2 text-md font-medium rounded-md ${
                selectedFilter === "6M"
                  ? "bg-slate-200 border-1 border-green-600"
                  : "text-slate-700 border border-slate-300 hover:bg-slate-100"
              }`}
              onClick={() => setSelectedFilter("6M")}
            >
              6M
            </button>
          </div>
        </div>

        <div className="bg-white mb-2">
          {selectedFilter === "7D" ? (
            <HighchartsReact highcharts={Highcharts} options={options} />
          ) : (
            <HighchartsReact highcharts={Highcharts} options={options1} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PymentAnnalytic;
