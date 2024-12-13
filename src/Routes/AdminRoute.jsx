import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../Components/navBar/AdminNavBar";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));

    if (
      userCredentials?.email === "admin@gmail.com" &&
      userCredentials?.password === "Rishab@123"
    ) {
      setIsAdmin(true);
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!isAdmin) {
    navigate("/");
    return null; // Prevent rendering children until admin authentication is verified
  }

  return (
    <>
      <AdminNavBar />
      {children}
    </>
  );
};

export default AdminRoute;
