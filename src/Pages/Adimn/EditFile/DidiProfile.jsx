import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Breadcrumb from "../../../Components/prebuiltComponent/Breadcrumb";

const DidiProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [city, setCity] = useState([]);
  const [route, setRoute] = useState();

  useEffect(() => {
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    if (userCredentials) {
      const { email } = userCredentials;

      if (email === "admin@gmail.com") {
        setRoute("/didilist");
      } else {
        setRoute("/didilist-register");
      }
    }
  }, []);

  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/didi/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.log("Error fetching data:", err);
        toast.error("Error fetching data. Please try again.");
      });
  };

  useEffect(() => {
    getData();
  }, [id]);

  const getState = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/states/`)
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log("Error fetching states:", err);
      });
  };

  const getDistrict = (stateId) => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/filter-districts/${stateId}`)
      .then((res) => {
        setDistrict(res.data);
      })
      .catch((err) => {
        console.log("Error fetching districts:", err);
      });
  };

  const getCity = (districtId) => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/filter-cities/${districtId}`)
      .then((res) => {
        setCity(res.data);
      })
      .catch((err) => {
        console.log("Error fetching cities:", err);
      });
  };

  useEffect(() => {
    getState();
  }, []);

  useEffect(() => {
    if (data?.state) {
      getDistrict(data.state);
    }
  }, [data?.state]);

  useEffect(() => {
    if (data?.district) {
      getCity(data.district);
    }
  }, [data?.district]);

  const breadcrumbItems = [
    { label: "Didi List", href: route },
    { label: data?.full_name || "Didi Profile", href: "" },
  ];

  return (
    <div className="py-2 px-6 md:px-12">
      <ToastContainer />

      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Profile
          </b>
        </div>

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="border border-2 rounded-md p-2">
        {data ? (
          <div className="bg-white rounded-lg md:p-6 max-w-8xl mx-auto">
            <div className="flex flex-col items-center mb-4 md:mb-6">
              {data.image && (
                <div className="flex justify-center mb-4">
                  <img
                    src={`${process.env.REACT_APP_API_BACKEND}/${data.image}`}
                    alt="Profile"
                    className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 object-cover rounded-full shadow-md border-2 border-blue-200"
                  />
                </div>
              )}

              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                {data?.full_name
                  ? `${data.full_name}'s Profile`
                  : "Didi Profile"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-1">
              <div className="p-1 md:p-1">
                <label className="block text-sm font-semibold text-gray-500">
                  Husband/Father's Name
                </label>
                <p className="text-gray-800 font-medium m-0">
                  {data.husband_name}
                </p>
              </div>
              <div className="p-1 md:p-1">
                <label className="block text-sm font-semibold text-gray-500">
                  Mobile Number
                </label>
                <p className="text-gray-800 font-medium m-0">
                  {data.mobile_no}
                </p>
              </div>
              <div className="p-1 md:p-1">
                <label className="block text-sm font-semibold text-gray-500">
                  Alternate Mobile Number
                </label>
                <p className="text-gray-800 font-medium m-0">
                  {data.alternate_mobile_no || "Not Available"}
                </p>
              </div>
              <div className="p-1 md:p-1">
                <label className="block text-sm font-semibold text-gray-500">
                  State
                </label>
                <p className="text-gray-800 font-medium m-0">
                  {state.find((item) => item.state_id === data.state)
                    ?.state_name || "N/A"}
                </p>
              </div>
              <div className="p-1 md:p-1">
                <label className="block text-sm font-semibold text-gray-500">
                  District
                </label>
                <p className="text-gray-800 font-medium m-0">
                  {district.find((item) => item.dist_id === data.district)
                    ?.dist_name || "N/A"}
                </p>
              </div>
              <div className="p-1 md:p-1">
                <label className="block text-sm font-semibold text-gray-500">
                  City
                </label>
                <p className="text-gray-800 font-medium m-0">
                  {city.find((item) => item.city_id === data.city)?.city_name ||
                    "N/A"}
                </p>
              </div>
              <div className="p-1 md:p-1">
                <label className="block text-sm font-semibold text-gray-500">
                  Address
                </label>
                <p className="text-gray-800 font-medium m-0">{data.address}</p>
              </div>
              <div className="p-1 md:p-1">
                <label className="block text-sm font-semibold text-gray-500">
                  Remarks
                </label>
                <p className="text-gray-800 font-medium m-0">
                  {data.remarks || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default DidiProfile;
