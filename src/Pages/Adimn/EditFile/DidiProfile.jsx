import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Breadcrumb from "../../../Components/prebuiltComponent/Breadcrumb";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

const DidiProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [city, setCity] = useState([]);
  const [route, setRoute] = useState();
  const [identity, setIdentity] = useState([]);

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
          if (res.data.document && Array.isArray(res.data.document)) {
            const documents = res.data.document.map((doc) => {
              const lastSegment = doc.substring(doc.lastIndexOf("/") + 1);
              return `${process.env.REACT_APP_API_BACKEND}/media/documents/${lastSegment}`;
            });
            setIdentity(documents);
          }
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

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Didi Details",
  });

  const breadcrumbItems = [
    { label: "Didi List", href: route },
    { label: data?.full_name || "Didi Profile", href: "" },
  ];

  return (
    <div className="py-2 px-6 md:px-12" ref={printRef}>
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

      <div className="border border-2 rounded-md px-2">
        {data ? (
          <div className="bg-white rounded-lg md:p-6 max-w-8xl mx-auto">
            <div className="d-flex justify-content-end m-0 p-0 px-3">
              <button
                onClick={handlePrint}
                className="px-2 btn btn-dark text-white rounded hover:bg-[#53230A]"
              >
                <div className="flex items-center">
                  <FaPrint className="mr-2" />
                </div>
              </button>
            </div>
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
            <div className="item-center p-1 my-4 w-full md:p-1 p-3">
              {identity.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {identity.map((imagepath, index) => (
                    <span
                      key={index}
                      className="block bg-white p-2 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
                    >
                      <img
                        src={imagepath}
                        style={{ height: "400px" }}
                        alt="Captured identity"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No identity images</p>
              )}
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
