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
import AddFood from "../Pages/Adimn/AddFood";
import DidiEdit from "../Pages/Adimn/EditFile/DidiEdit";
import HomeEdit from "../Pages/Adimn/EditFile/HomeEdit";
import DailyLog from "../Pages/Adimn/DailyLog";
import ListAssigned from "../Pages/Adimn/ListView/ListAssigned";
import ListFood from "../Pages/Adimn/ListView/ListFood";
import ListDidi from "../Pages/Adimn/ListView/ListDidi";
import ListStall from "../Pages/Adimn/ListView/ListStall";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },

      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "dailylog",
        element: (
          <AdminRoute>
            <DailyLog />
          </AdminRoute>
        ),
      },
      {
        path: "admin/:id/:date",
        element: (
          <AdminRoute>
            <HomeEdit />
          </AdminRoute>
        ),
      },

      {
        path: "didireg",
        element: (
          <AdminRoute>
            <DidiRegistration />
          </AdminRoute>
        ),
      },
      {
        path: "thelareg",
        element: (
          <AdminRoute>
            <ThelaRegistration />
          </AdminRoute>
        ),
      },
      {
        path: "assign",
        element: (
          <AdminRoute>
            <DidiAssignment />
          </AdminRoute>
        ),
      },
      {
        path: "assign_list",
        element: (
          <AdminRoute>
            <ListAssigned />
          </AdminRoute>
        ),
      },
      {
        path: "listfood",
        element: (
          <AdminRoute>
            <ListFood />
          </AdminRoute>
        ),
      },
      {
        path: "addfood",
        element: (
          <AdminRoute>
            <AddFood />
          </AdminRoute>
        ),
      },
      {
        path: "didilist",
        element: (
          <AdminRoute>
            <ListDidi />
          </AdminRoute>
        ),
      },
      {
        path: "didilist/:id",
        element: (
          <AdminRoute>
            <DidiEdit />
          </AdminRoute>
        ),
      },
      {
        path: "stall_list",
        element: (
          <AdminRoute>
            <ListStall />
          </AdminRoute>
        ),
      },

      {
        path: "mobilehome",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "receivedfood",
        element: (
          <PrivateRoute>
            <ReceivedFood />
          </PrivateRoute>
        ),
      },
      {
        path: "issuefood",
        element: (
          <PrivateRoute>
            <IssueFood />
          </PrivateRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },

      // Catch-All Route
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
