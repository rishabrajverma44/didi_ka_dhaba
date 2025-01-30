import React from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
const Home = () => {
  return (
    <>
      <div className="bg-gray-50 min-h-[90vh]">
        <div className="min-h-80 flex justify-center">
          <div className="flex flex-col sm:flex-row justify-between self-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/issuefood">
              <button className="tracking-wide font-semibold bg-btn-primary hover:bg-btn-hoverPrimary text-white py-2 px-4 h-12 w-60 rounded">
                Issue Food
              </button>
            </Link>
            <Link to="/receivedfood">
              <button className="tracking-wide font-semibold bg-btn-primary hover:bg-btn-hoverPrimary text-white py-2 px-4 h-12 w-60 rounded">
                Received Returned Food
              </button>
            </Link>
            <Link to="/payment">
              <button className="tracking-wide font-semibold bg-btn-primary hover:bg-btn-hoverPrimary text-white py-2 px-4 h-12 w-60 rounded">
                Payment Details
              </button>
            </Link>
            <Link to="/report">
              <button className="tracking-wide font-semibold bg-btn-primary hover:bg-btn-hoverPrimary text-white py-2 px-4 h-12 w-60 rounded">
                Report
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
