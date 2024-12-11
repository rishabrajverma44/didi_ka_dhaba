import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../Components/navBar/AdminNavBar";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (token === "password_jwt") {
      console.log(token);
    }
  }, [navigate, token]);

  return (
    <>
      <AdminNavBar />
      {children}
    </>
  );
};

export default AdminRoute;
