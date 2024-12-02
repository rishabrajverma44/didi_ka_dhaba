import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./Routes/Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { generateToken, getToken } from "./Notification/firebase";

function App() {
  const router = createBrowserRouter(routes);
  useEffect(() => {
    generateToken();
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
