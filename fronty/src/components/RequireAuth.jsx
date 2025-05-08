import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

function RequireAuth({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();

  let decoded;
  let roles = [];

  try {
    if (auth?.accessToken) {
      decoded = jwtDecode(auth.accessToken);
      roles = [decoded?.role];
    }
  } catch (error) {
    console.error("Token decoding error:", error);
  }

  const isAuthenticated = !!auth?.accessToken;

  return isAuthenticated ? (
    roles.some((role) => allowedRoles?.includes(role)) ? (
      <Outlet />
    ) : (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
export default RequireAuth;
