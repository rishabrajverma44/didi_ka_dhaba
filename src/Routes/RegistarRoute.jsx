import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationNav from "../Components/navBar/RegistrationNav";

const RegistarRout = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));

    if (
      userCredentials?.email === "registar@gmail.com" &&
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
      <RegistrationNav />
      {children}
    </>
  );
};

export default RegistarRout;
