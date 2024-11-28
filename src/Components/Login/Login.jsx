import React from "react";
import logo from "../../../src/Assets/Images/chhukha_dam.png";
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
      <div className="login-sec">
        <div className="row m-0">
          <div className="col-md-8 ps-0 vh-100">
            <div className="login-img position-relative">
              <img
                alt=""
                src="https://assets.encardio.com/uploads/category/v3GGLutyoeVdLw4qWgIkKQUPnQ1L1ozc8Nv7b8qd.jpg"
                className="w-100 vh-100"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <form
              id="login-form"
              action="#"
              className="bg-white p-2 w-md-100 w-lg-75 mx-auto"
              method="post"
            >
              <div className="text-center">
                <a
                  className="d-inline-block"
                  href="https://hydropower.icpl.tech/"
                  alt=""
                >
                  <img src={logo} alt="LOGO" width="180" />
                </a>
              </div>
              <div className="text-center">
                <h2 className="mt-3 fs-5 fw-medium text-dark">
                  Hydropower Forecasting System <br />
                  Chhukha Dam
                </h2>
              </div>
              <div className="text-center mt-4">
                <h5 className="text-dark h6">Welcome Back!</h5>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email_id" className="mb-2">
                  Email ID<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="email_id"
                  name="email_id"
                  placeholder="Enter email ID"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-3 position-relative">
                <label htmlFor="password" className="mb-2">
                  Password<span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control w-75"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    aria-label="Enter Password"
                  />
                  <span className="input-group-text" id="eyetoggle">
                    <i className="fa fa-refresh" aria-hidden="true"></i>
                  </span>
                </div>
                <div className="text-end mt-2">
                  <a
                    href="#"
                    className="text-dark fw-medium text-decoration-none"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div
                className="d-flex align-items-center mb-3 gap-3"
                id="captcha_img"
              >
                <img
                  src="https://taprisel.indevconsultancy.in/captcha/flat?FT7s3o74"
                  alt="captcha"
                  id="captcha"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  id="refresh-captcha"
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i>
                </button>
                <input
                  type="text"
                  name="captcha"
                  id="captcha-input"
                  className="form-control"
                  required
                  placeholder="Enter the Captcha"
                />
              </div>

              <div className="form-group mb-3">
                <button
                  type="submit"
                  name="submit"
                  className="btn btn-primary w-100"
                  onClick={handleSubmit}
                >
                  Sign in
                </button>
              </div>
              <p className="mb-3 text-center">
                Don't have an account?{" "}
                <a
                  className="fw-semibold text-primary text-decoration-underline"
                  href="#"
                >
                  Signup
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
