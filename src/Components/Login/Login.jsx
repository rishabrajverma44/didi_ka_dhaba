import React from "react";
import logo from "../../../src/Assets/Images/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("jwt", "password");
    navigate("/");
  };
  return (
    <>
      <div>
        <div
          className="bg-gray-100 d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="p-4 w-full md:w-3/4 lg:w-1/2 rounded-lg shadow-lg">
            <form
              id="login-form"
              action="#"
              className="bg-white p-6 rounded-lg"
              method="post"
            >
              <div className="text-center">
                <a className="inline-block" href="" alt="">
                  <img src={logo} alt="LOGO" width="160" />
                </a>
              </div>
              <div className="text-center">
                <h2 className="mt-2 text-lg font-medium text-dark">
                  Didi Ka Kitchen
                </h2>
              </div>

              <div className="mt-4">
                <div className="form-group mb-4">
                  <label
                    htmlFor="email_id"
                    className="mb-2 block text-sm text-dark"
                  >
                    Email ID<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email_id"
                    name="email_id"
                    placeholder="Enter email ID"
                    className="form-control w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="form-group mb-4 position-relative">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm text-dark"
                  >
                    Password<span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control w-full p-2 border border-gray-300 rounded"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    aria-label="Enter Password"
                    required
                  />
                </div>

                <div className="form-group mb-6">
                  <button
                    type="submit"
                    name="submit"
                    className="btn btn-primary w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleSubmit}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
