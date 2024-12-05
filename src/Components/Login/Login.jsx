import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const actualStatus = await checkInternetConnection();
      if (!actualStatus) {
        Swal.fire({
          html: `<b>Check Internet connection !</b>`,
          allowOutsideClick: false,
          confirmButtonColor: "#A24C4A",
        });
      } else {
        if (
          values.email === "rishab@gmail.com" &&
          values.password === "Rishab@123"
        ) {
          toast.success("Login success");
          localStorage.setItem("jwt", "password");
          navigate("/");
        } else {
          toast.error("Wrong credentials");
          values.email = "";
          values.password = "";
        }
      }
    },
  });

  const checkInternetConnection = async () => {
    try {
      const response = await fetch(
        "https://api.allorigins.win/get?url=https://www.google.com/favicon.ico",
        {
          method: "HEAD",
          cache: "no-cache",
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
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
              className="bg-white p-6 rounded-2xl border-2"
              onSubmit={formik.handleSubmit}
            >
              <div className="text-center">
                <a className="inline-block rounded-xl" href="" alt="">
                  <img src="/images/logo.png" alt="LOGO" width="160" />
                </a>
              </div>

              <div className="mt-4">
                <div className="form-group mb-4">
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
                    className="form-control w-full p-2 border border-gray-300 rounded"
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

                <div className="form-group mb-4">
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
                    className="form-control w-full p-2 border border-gray-300 rounded"
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

                <div className="form-group mb-6">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-btn-primary hover:bg-btn-hover text-white"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
