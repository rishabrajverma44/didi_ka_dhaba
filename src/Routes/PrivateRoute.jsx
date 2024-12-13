import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/navBar/Navbar";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));

    if (
      userCredentials?.email === "rishab@gmail.com" &&
      userCredentials?.password === "Rishab@123"
    ) {
      setIsAuthenticated(true);
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default PrivateRoute;
