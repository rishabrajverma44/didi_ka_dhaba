import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./Routes/Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { generateToken } from "./Notification/firebase";

function App() {
  const router = createBrowserRouter(routes, {
    future: {
      v7_normalizeFormMethod: true,
    },
  });

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
