import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { FiArrowUp, FiArrowDown, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

const PymentAnnalytic = () => {
  const [response, setResponse] = useState([]);
  const [collection, setCollection] = useState(0);
  const [lastIncrement, setLastIncre] = useState(0);

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

  const [didiOfTheMonth, setDidi] = useState("Aarti Devi");
  const didiList = [
    { name: "Divya Vats", monthlyAvgRating: "20" },
    { name: "Sapna Devi", monthlyAvgRating: "27" },
    { name: "Aarti Devi", monthlyAvgRating: "72" },
    { name: "Sabiya Khatun", monthlyAvgRating: "52" },
    { name: "Summi Jha", monthlyAvgRating: "55" },
  ];
  const getStars = (rating) => {
    const maxStars = 5;
    const ratingValue = parseInt(rating) / 20;
    const fullStars = Math.floor(ratingValue);
    const halfStar = ratingValue % 1 >= 0.5 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;

    return (
      <>
        <span style={{ color: "gold" }}>{"★".repeat(fullStars)}</span>
        <span style={{ color: "gold" }}>{halfStar ? "☆" : ""}</span>
        <span style={{ color: "gray" }}>{"☆".repeat(emptyStars)}</span>
      </>
    );
  };

  var num = 5;
  for (let i = 0; i < num; i++) {
    let print = "";
    for (let j = 0; j <= i; j++) {
      print += "*";
    }
    console.log(print);
  }
  return (
    <div
      className="px-6 md:px-12 bg-slate-100 py-2 mb-2"
      style={{ minHeight: "100vh" }}
    >
      <div className="bg-white px-2">
        <div className="text-lg font-semibold text-slate-700 flex justify-between items-center">
          <span>
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
          </span>
          <span className="ml-3">
            <span>Didi Of The Month </span>
            <span> ( January ) </span>
            <span className="font-bold">{didiOfTheMonth}</span>
          </span>
        </div>

        <div className="mt-2">
          <h1 className="text-3xl font-bold text-slate-800">
            ₹{collection.toLocaleString("en-IN")}
          </h1>
        </div>
        <div className="mt-3 flex items-center">
          <span
            className={`font-bold flex items-center bg-slate-100 rounded-md px-1 ${
              lastIncrement >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {lastIncrement >= 0 ? (
              <FiArrowUp className="mr-1" />
            ) : (
              <FiArrowDown className="mr-1" />
            )}
            {Number(lastIncrement?.toFixed(0)).toLocaleString("en-IN")}
          </span>
          <span className="ml-2 font-normal text-sm text-slate-500">
            vs last month <span>{response?.collection_growth_label}</span>
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

            <div className="text-sm sm:text-base md:text-lg md:p-2">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 pl-1">
                  ₹
                  {Number(
                    response?.daily_avg_collection?.toFixed(0)
                  ).toLocaleString("en-IN")}
                </h3>
                <div className="flex items-center">
                  <span
                    className={`font-medium flex items-center rounded-md ${
                      response.daily_avg_collection_growth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {response.daily_avg_collection_growth >= 0 ? (
                      <FiArrowUp className="mr-1" />
                    ) : (
                      <FiArrowDown className="mr-1" />
                    )}
                    ₹
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
                Total Transaction Count{" "}
              </span>
              <span className="text-xs sm:text-sm md:text-base leading-tight">
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
            <div className="text-sm sm:text-base md:text-lg md:p-2">
              <h3 className="text-2xl font-bold text-slate-800 pl-2">
                {Number(response.total_transactions?.toFixed(0)).toLocaleString(
                  "en-IN"
                )}
              </h3>
              <div className="flex items-center">
                <span
                  className={`font-medium flex items-center rounded-md px-1 ${
                    response?.transaction_growth >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {response?.transaction_growth >= 0 ? (
                    <FiArrowUp className="mr-1" />
                  ) : (
                    <FiArrowDown className="mr-1" />
                  )}
                  {Number(
                    response?.transaction_growth?.toFixed(0)
                  ).toLocaleString("en-IN")}
                </span>

                <span className="ml-2 font-normal text-[12px] md:text-sm text-slate-500">
                  vs last month
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center bg-white">
            <div>
              <h3 className="text-sm md:text-xl font-bold text-slate-800">
                Your Payment Trends
              </h3>
            </div>
          </div>

          <div className="bg-white mb-2">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>

        <div className="mb-4 pb-3 mt-2">
          <h5 className="flex justify-start items-center font-bold">
            Didi Of The Month{" "}
            <span>
              {response?.total_collection_label
                ? ` (${
                    response.total_collection_label
                      .split("(")
                      .slice(-1)[0]
                      ?.split(")")[0]
                  })`
                : ""}
            </span>{" "}
          </h5>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr style={{ backgroundColor: "#682C13", color: "white" }}>
                  <th className="border border-gray-300 px-4 py-2 font-normal text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-normal text-left">
                    Monthly Avg Rating
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-normal text-left">
                    Stars
                  </th>
                </tr>
              </thead>
              <tbody>
                {didiList.map((didi, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-1">
                      {didi.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-1">
                      {didi.monthlyAvgRating} %
                    </td>
                    <td className="border border-gray-300 px-4 py-1">
                      {getStars(didi.monthlyAvgRating)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PymentAnnalytic;
