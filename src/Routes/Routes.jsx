import Home from "../Home";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../Components/prebuiltComponent/NotFound";
import Layout from "../Components/navBar/Layout";
import Login from "../Components/Login/Login";
import ReceivedFood from "../Pages/ReceivedFood";
import IssueFood from "../Pages/IssueFood";
import Payment from "../Pages/Payment";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        index: true,
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        index: true,
        path: "receivedfood",
        element: (
          <PrivateRoute>
            <ReceivedFood />
          </PrivateRoute>
        ),
      },
      {
        index: true,
        path: "issuefood",
        element: (
          <PrivateRoute>
            <IssueFood />
          </PrivateRoute>
        ),
      },
      {
        index: true,
        path: "payment",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
