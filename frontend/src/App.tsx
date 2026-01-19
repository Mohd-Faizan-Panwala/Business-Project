import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Master from "./MasterLayout/Master";
import { AdminRoutes } from "./Route";
import NotFound from "./Components/NotFound";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import HomePage from "./Pages/Home";
import MyBusinesses from "./Pages/MyBusinesses";
import ProfilePage from "./Pages/ProfilePage";
import VerifyOtp from "./Pages/User/VerifyOtp";
import UserLogin from "./Pages/User/Login";
import UserAddBusiness from "./Pages/User/UserAddBusiness";
import CategoryBusinesses from "./Pages/Category/CategoryBusinesses";
import AdminProfile from "./Pages/Admin/AdminProfile"
// Helper component for protected routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT FIX */}
        <Route path="/" element={<HomePage />} />

        {/* ADMIN AUTH */}
        <Route path="/admin/login" element={<Login setToken={() => { }} />} />
        <Route path="/admin/profile" element={<AdminProfile/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* USER AUTH */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/verify-otp" element={<VerifyOtp />} />

        {/* USER PAGES */}
        <Route path="/user/home" element={<HomePage />} />
        <Route path="/user/my-businesses" element={<MyBusinesses />} />
        <Route path="/user/profile" element={<ProfilePage />} />
        <Route path="/user/add-business" element={<UserAddBusiness />} />
        <Route path="/category/:id" element={<CategoryBusinesses />} />

        {/* ADMIN ROUTES */}
        {AdminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <RequireAuth>
                <Master>
                  <route.component />
                </Master>
              </RequireAuth>
            }
          />
        ))}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
