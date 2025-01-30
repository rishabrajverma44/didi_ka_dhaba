import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { FiArrowUp, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

const PymentAnnalytic = () => {
  const [response, setResponse] = useState([]);
  const [collection, setCollection] = useState(0);
  const [lastIncrement, setLastIncre] = useState(0);
  const [options, setOptions] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "Total Sale",
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
      enabled: true,
    },
    credits: {
      enabled: false,
    },
  });

  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/payment-analytics/`)
      .then((res) => {
        if (res.status == 200) {
          const jsonData = res.data;
          setResponse(jsonData);
          setCollection(jsonData.total_collection);
          setLastIncre(jsonData.collection_growth);
        }
      })
      .catch((error) => {
        console.log("error in graph", error);
      });
  };
  useEffect(() => {
    getData();
  }, []);

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

      <div className="mt-4 flex items-center space-x-2 bg-orange-50 rounded-md p-3 font-semibold font-2xl w-full md:w-1/2">
        <span className="text-orange-800 flex items-center space-x-2">
          <span className="text-xl md:text-2xl">
            <FiTrendingUp />
          </span>{" "}
          <span className="text-xs md:text-base">
            This month's collection is at highest in 6 months!
          </span>
        </span>
      </div>

      <div className="mt-3 mb-3 grid grid-cols-2 md:gap-4 gap-2">
        <div className="p-1 rounded-lg border">
          <div className="bg-slate-100 rounded-t-lg text-center md:p-2 p-1">
            <span className="font-semibold text-sm sm:text-xs md:text-lg">
              Daily Average Collection
            </span>{" "}
            <span className="text-xs sm:text-sm md:text-base leading-tight">
              (01-27 Jan)
            </span>
          </div>

          <div className="text-sm sm:text-base md:text-lg">foot</div>
        </div>
        <div className="p-1 rounded-lg border">
          <div className="bg-slate-100 rounded-t-lg text-center md:p-2 p-1">
            <span className="font-semibold text-sm sm:text-base md:text-lg">
              Total Transaction Count
            </span>
            <span className="text-xs sm:text-sm md:text-base">(01-27 Jan)</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg">foot</div>
        </div>
      </div>

      <div className="p-2 bg-white p-2 bg-white">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default PymentAnnalytic;
