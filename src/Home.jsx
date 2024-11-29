import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div
        id="backgroundimages"
        style={{
          backgroundImage: `url(/images/BG.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "90vh",
          width: "100%",
        }}
      >
        <div className="min-h-80 flex justify-center">
          <div class="flex justify-center space-x-12 self-center">
            <Link to="/issuefood">
              <button class="tracking-wide font-semibold bg-indigo-300 text-black py-2 px-4 h-12 w-40 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                Issue Food
              </button>
            </Link>
            <Link to="/receivedfood">
              <button class="tracking-wide font-semibold bg-white text-yellow-500 py-2 px-4 h-12 w-40 rounded hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                Received Food
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
