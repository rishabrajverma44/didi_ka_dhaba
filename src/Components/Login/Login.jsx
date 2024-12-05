import React from "react";
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
      <div
        id="backgroundimages"
        style={{
          backgroundImage: `url(/images/img.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="p-2 w-full md:w-3/4 lg:w-1/2">
            <form
              id="login-form"
              action="#"
              className="bg-white p-6 rounded-2xl border-2"
              method="post"
            >
              <div className="text-center">
                <a className="inline-block rounded-xl" href="" alt="">
                  <img src="/images/logo.png" alt="LOGO" width="160" />
                </a>
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
                    className="w-full py-2 rounded-lg  bg-btn-primary hover:bg-btn-hover text-white"
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
