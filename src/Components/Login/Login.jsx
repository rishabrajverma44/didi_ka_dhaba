import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { CaptchaBox, validateCaptcha, reloadCaptcha } from "react-captcha-lite";

const Login = () => {
  const navigate = useNavigate();
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    const refreshButton = document.getElementById("captcha_lite_reload_btn");
    if (refreshButton) {
      refreshButton.style.display = "none";
    }

    const captchaContainerImg = document.getElementById("captcha_lite_canvas");
    if (captchaContainerImg) {
      captchaContainerImg.style.color = "";
      captchaContainerImg.style.width = "200px";
      captchaContainerImg.style.height = "30px";
      captchaContainerImg.style.marginTop = "15px";
      captchaContainerImg.style.marginBottom = "5px";
      captchaContainerImg.style.objectFit = "cover";
      captchaContainerImg.style.border = "0px";
      captchaContainerImg.style.background = "none";
    }
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    const isCaptchaValid = validateCaptcha(captchaInput);

    if (!isCaptchaValid) {
      toast.error("CAPTCHA is incorrect. Please try again.");
      return;
    }

    if (
      values.email === "rishab@gmail.com" &&
      values.password === "Rishab@123"
    ) {
      localStorage.setItem(
        "userCredentials",
        JSON.stringify({ email: values.email, password: values.password })
      );
      navigate("/mobilehome");
    } else if (
      values.email === "admin@gmail.com" &&
      values.password === "Rishab@123"
    ) {
      localStorage.setItem(
        "userCredentials",
        JSON.stringify({ email: values.email, password: values.password })
      );
      navigate("/admin");
    } else if (
      values.email === "registar@gmail.com" &&
      values.password === "Rishab@123"
    ) {
      localStorage.setItem(
        "userCredentials",
        JSON.stringify({ email: values.email, password: values.password })
      );
      navigate("/didireg-register");
    } else {
      toast.error("Wrong credentials !");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "rishab@gmail.com",
      password: "Rishab@123",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

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
          style={{ height: "100vh", padding: "2px" }}
        >
          <div className="px-2 w-full md:w-3/4 lg:w-1/2">
            <form
              id="login-form"
              className="bg-white px-6 rounded-2xl border-2"
              onSubmit={formik.handleSubmit}
            >
              <div className="text-center">
                <a className="inline-block rounded-xl" href="" alt="">
                  <img src="/images/logo.png" alt="LOGO" width="120" />
                </a>
              </div>

              <div className="mt-0">
                <div className="form-group mb-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-dark"
                  >
                    Email ID<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email ID"
                    className="form-control w-full p-2 border border-gray-300 shadow-sm focus:outline-none"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className="text-danger text-sm">
                      {formik.errors.email}
                    </span>
                  )}
                </div>

                <div className="form-group mb-2">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm text-dark"
                  >
                    Password<span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    className="form-control w-full p-2 border border-gray-300 shadow-sm focus:outline-none"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <span className="text-danger text-sm">
                      {formik.errors.password}
                    </span>
                  )}
                </div>

                <div className="captcha-container mb-4">
                  <div className="captcha-box bg-light md:flex-row items-center gap-4 md:gap-8">
                    <CaptchaBox />
                    <div className="flex items-center justify-content-center gap-4">
                      <button
                        type="button"
                        className="btn btn-secondary text-sm py-1"
                        onClick={reloadCaptcha}
                      >
                        Refresh
                      </button>
                      <input
                        type="text"
                        placeholder="Enter CAPTCHA"
                        className="form-control w-50 border border-gray-300 shadow-sm focus:outline-none"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group mb-1">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-btn-primary hover:bg-btn-hover text-white"
                  >
                    Sign in
                  </button>
                </div>
              </div>
              <div className="place-items-center">
                <img src="/images/Ekta.png" alt="jbf" width="110" />
              </div>
              <div>
                <p className="text-center text-[#A24C4A] text-xl my-2">
                  Supported by
                </p>
              </div>
              <div className="flex justify-between">
                <img
                  src="/images/jbf.jpg"
                  alt="jbf"
                  style={{
                    width: "15%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
                <img
                  src="/images/m3m.png"
                  alt="m3m"
                  style={{
                    width: "30%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
                <img
                  src="/images/sidbi.png"
                  alt="sidbi"
                  style={{
                    width: "30%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            </form>
          </div>
          <div className="fixed bottom-0 right-1 z-50 text-sm sm:text-base py-2 px-4">
            <p className="flex items-center space-x-1">
              <span>Powered by</span>
              <a
                href="https://indevconsultancy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 font-semibold underline hover:no-underline hover:text-red-800 transition duration-300"
              >
                IndevConsultancy
              </a>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
