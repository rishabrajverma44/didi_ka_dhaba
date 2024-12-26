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
import FoodEdit from "../Pages/Adimn/EditFile/FoodEdit";
import StallEdite from "../Pages/Adimn/EditFile/StallEdite";
import AssignEdit from "../Pages/Adimn/EditFile/AssignEdit";
import RegistarRout from "./RegistarRoute";
import DidiProfile from "../Pages/Adimn/EditFile/DidiProfile";
import Plate from "../Pages/Adimn/Plates/Plate";

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
        path: "admin/:id/:date",
        element: (
          <AdminRoute>
            <HomeEdit />
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
        path: "didireg",
        element: (
          <AdminRoute>
            <DidiRegistration />
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
        path: "didiprofile/:id",
        element: (
          <AdminRoute>
            <DidiProfile />
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
        path: "stall_list",
        element: (
          <AdminRoute>
            <ListStall />
          </AdminRoute>
        ),
      },
      {
        path: "stall_list/:id",
        element: (
          <AdminRoute>
            <StallEdite />
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
        path: "assign_list/:id",
        element: (
          <AdminRoute>
            <AssignEdit />
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
        path: "listfood",
        element: (
          <AdminRoute>
            <ListFood />
          </AdminRoute>
        ),
      },
      {
        path: "listfood/:id",
        element: (
          <AdminRoute>
            <FoodEdit />
          </AdminRoute>
        ),
      },
      {
        path: "plateDetails",
        element: (
          <AdminRoute>
            <Plate />
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
      {
        path: "didireg-register",
        element: (
          <RegistarRout>
            <DidiRegistration />
          </RegistarRout>
        ),
      },
      {
        path: "didilist-register",
        element: (
          <RegistarRout>
            <ListDidi />
          </RegistarRout>
        ),
      },
      {
        path: "didiprofile-register/:id",
        element: (
          <RegistarRout>
            <DidiProfile />
          </RegistarRout>
        ),
      },
      {
        path: "didilist-register/:id",
        element: (
          <RegistarRout>
            <DidiEdit />
          </RegistarRout>
        ),
      },
      {
        path: "thelareg-register",
        element: (
          <RegistarRout>
            <ThelaRegistration />
          </RegistarRout>
        ),
      },
      {
        path: "stall_list-register",
        element: (
          <RegistarRout>
            <ListStall />
          </RegistarRout>
        ),
      },
      {
        path: "stall_list-register/:id",
        element: (
          <RegistarRout>
            <StallEdite />
          </RegistarRout>
        ),
      },

      // Catch-All Route
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
