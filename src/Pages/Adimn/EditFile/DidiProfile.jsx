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

  const getData = () => {
    axios
      .get(`https://didikadhababackend.indevconsultancy.in/dhaba/didi/${id}`)
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
      .get("https://didikadhababackend.indevconsultancy.in/dhaba/states/")
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log("Error fetching states:", err);
      });
  };

  const getDistrict = (stateId) => {
    axios
      .get(
        `https://didikadhababackend.indevconsultancy.in/dhaba/filter-districts/${stateId}`
      )
      .then((res) => {
        setDistrict(res.data);
      })
      .catch((err) => {
        console.log("Error fetching districts:", err);
      });
  };

  const getCity = (districtId) => {
    axios
      .get(
        `https://didikadhababackend.indevconsultancy.in/dhaba/filter-cities/${districtId}`
      )
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
    { label: "Didi List", href: "/didilist" },
    { label: data?.full_name || "Didi Profile", href: "" },
  ];

  return (
    <div className="py-4 px-6 md:px-12">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">
          {data?.full_name ? `${data.full_name}'s Profile` : "Didi Profile"}
        </h1>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.image && (
              <div className="md:col-span-2 flex justify-center mb-4">
                <img
                  src={`https://didikadhababackend.indevconsultancy.in/dhaba/${data.image}`}
                  alt="Profile"
                  className="w-48 h-48 object-cover rounded-full shadow-lg border-2 border-gray-300"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Husband/Father's Name
              </label>
              <p className="text-gray-800">{data.husband_name}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Mobile Number
              </label>
              <p className="text-gray-800">{data.mobile_no}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Alternate Mobile Number
              </label>
              <p className="text-gray-800">
                {data.alternate_mobile_no || "Not Available"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                State
              </label>
              <p className="text-gray-800">
                {state.find((item) => item.state_id === data.state)
                  ?.state_name || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                District
              </label>
              <p className="text-gray-800">
                {district.find((item) => item.dist_id === data.district)
                  ?.dist_name || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                City
              </label>
              <p className="text-gray-800">
                {city.find((item) => item.city_id === data.city)?.city_name ||
                  "N/A"}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-600 font-medium mb-1">
                Address
              </label>
              <p className="text-gray-800">{data.address}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-600 font-medium mb-1">
                Remarks
              </label>
              <p className="text-gray-800">{data.remarks || "N/A"}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default DidiProfile;
