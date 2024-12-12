import Home from "../Home";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../Components/prebuiltComponent/NotFound";
import Layout from "../Components/navBar/Layout";
import Login from "../Components/Login/Login";
import ReceivedFood from "../Pages/ReceivedFood";
import IssueFood from "../Pages/IssueFood";
import Payment from "../Pages/Payment";
import AdminHome from "../Pages/Adimn/AdminHome";
import DidiRegistration from "../Pages/Adimn/DidiRegistration";
import ThelaRegistration from "../Pages/Adimn/ThelaRegistration";
import AdminRoute from "./AdminRoute";
import DidiAssignment from "../Pages/Adimn/DidiAssignment";
import FoodMaster from "../Pages/Adimn/FoodMaster";

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
        path: "didireg",
        element: (
          <AdminRoute>
            <DidiRegistration />,
          </AdminRoute>
        ),
      },
      {
        index: true,
        path: "foodmaster",
        element: (
          <AdminRoute>
            <FoodMaster />,
          </AdminRoute>
        ),
      },
      {
        index: true,
        path: "thelareg",
        element: (
          <AdminRoute>
            <ThelaRegistration />,
          </AdminRoute>
        ),
      },
      {
        index: true,
        path: "admin",
        element: (
          <AdminRoute>
            <AdminHome />,
          </AdminRoute>
        ),
      },
      {
        index: true,
        path: "assign",
        element: (
          <AdminRoute>
            <DidiAssignment />,
          </AdminRoute>
        ),
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
