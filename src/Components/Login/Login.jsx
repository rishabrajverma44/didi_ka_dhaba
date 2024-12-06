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

  const checkInternetConnection = async () => {
    try {
      const response = await fetch(
        "https://api.allorigins.win/raw?url=https://www.google.com",
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

  const handleSubmit = async (values, { resetForm }) => {
    const actualStatus = await checkInternetConnection();

    if (actualStatus) {
      if (
        values.email === "rishab@gmail.com" &&
        values.password === "Rishab@123"
      ) {
        toast.success("Login success");
        localStorage.setItem("jwt", "password_jwt");
        navigate("/");
      } else {
        toast.error("Wrong credentials");
        resetForm();
      }
    } else {
      Swal.fire({
        html: `<b>Check Internet connection!</b>`,
        allowOutsideClick: false,
        confirmButtonColor: "#A24C4A",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
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
              className="bg-white p-6 rounded-2xl border-2"
              onSubmit={formik.handleSubmit}
            >
              <div className="text-center">
                <a className="inline-block rounded-xl" href="" alt="">
                  <img src="/images/logo.png" alt="LOGO" width="120" />
                </a>
              </div>

              <div className="mt-1">
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
              <div className="place-items-center">
                <img src="/images/Ekta.png" alt="jbf" width="140" height="60" />
              </div>
              <div>
                <p className="text-center text-[#A24C4A] text-xl my-2">
                  Supported by
                </p>
              </div>
              <div className="flex justify-between" style={{ height: "90px" }}>
                <img src="/images/jbf.jpg" alt="jbf" width="25%" />

                <img src="/images/m3m.png" alt="m3m" width="40%" />
                <img src="/images/sidbi.png" alt="sidbi" width="25%" />
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
