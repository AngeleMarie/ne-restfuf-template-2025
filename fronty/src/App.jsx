import React from 'react';
import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Unauthorised from "./pages/Unauthorised";
import PersistLogin from "./components/PersistLogin";
import Store from './pages/Store';
import ResendCode from "./pages/ResendCode";
import ResetPassword from "./pages/ResetPassword";
import VerifyAccount from "./pages/VerifyAccount";
import ForgotPassword from "./pages/ForgotPassword";

const ROLES = {
  ADMIN: 'admin',
  USER: 'client',
};


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="reset" element={<ResetPassword />} />
        <Route path="forgot" element={<ForgotPassword/>}/>
        <Route path="verify" element={<VerifyAccount/>}/>
        <Route path="resend-code" element={<ResendCode/>}/>
        <Route path="unauthorized" element={<Unauthorised />} />
        <Route path="store" element={<Store />} />

        
        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.USER]} />}>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;