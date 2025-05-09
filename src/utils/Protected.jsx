import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/" }) => {
  const token = localStorage.getItem("token");
//   const staticToken = "vsjdfghfgjfthfg565rtvffrfsfndlmn";

//   if (token !== staticToken) {
//     return <Navigate to={redirectPath} replace />;
//   }

  return <Outlet />;
};

export default ProtectedRoute;
