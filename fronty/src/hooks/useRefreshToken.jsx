import React, { useState } from "react";
import { axiosInstance } from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/refresh", {}, {
        withCredentials: true,
      });

      setAuth((prev) => {
        console.log("Previous Auth State:", JSON.stringify(prev));
        console.log("New Access Token:", response.data.accessToken);
        return { ...prev, accessToken: response.data.accessToken };
      });

      setIsLoading(false);
      return response.data.accessToken;
    } catch (error) {
      setIsLoading(false);
      setError("Failed to refresh token. Please log in again.");
      console.error("Error refreshing token:", error);
      setAuth({});
      return null;
    }
  };

  return { refresh, isLoading, error };
}

export default useRefreshToken;
