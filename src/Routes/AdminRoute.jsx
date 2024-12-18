import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../Components/navBar/AdminNavBar";
import AdminFooter from "../Components/navBar/AdminFooter";

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
    return null;
  }

  return (
    <>
      <AdminNavBar />
      {children}
      <AdminFooter />
    </>
  );
};

export default AdminRoute;
