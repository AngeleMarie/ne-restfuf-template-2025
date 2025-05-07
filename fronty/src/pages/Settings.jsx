import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ProfileImage from "../assets/auth.png";
import { axiosPrivate, BASE_URL } from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    balance: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosPrivate.get("/users/profile", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUser(response.data.data);
        setUpdatedData({
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          phoneNumber: response.data.data.phoneNumber,
          balance: response.data.data.balance,
          email: response.data.data.email,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put(
        "/users/change-details",
        updatedData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setUser(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  const handleProfileImageChange = async (e) => {
    const formData = new FormData();
    formData.append("profileImage", e.target.files[0]);

    try {
      const response = await axiosPrivate.post(
        `/users/upload-profile-image/${user.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setUser(response.data.data);
    } catch (error) {
      console.error("Error uploading profile image", error);
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      const response = await axiosPrivate.delete(
        `/users/remove-profile-image/${user.id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setUser(response.data.data);
    } catch (error) {
      console.error("Error removing profile image", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex flex-row min-h-screen bg-white">
      <SideBar />
      <div className="flex-1 overflow-hidden">
        <TopBar />
        <section className="p-4 md:p-6 lg:p-10">
          <div className="mb-6">
            <p className="capitalize text-main-black font-medium text-lg md:text-xl">
              account information
            </p>
            <p className="text-main-black/70 text-sm md:text-base">
              Update your account information
            </p>
          </div>

          {/* Profile Image Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={`${BASE_URL}${user.profileImage}` || ProfileImage}
                alt="User Profile"
                className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-gray-300"
              />
              <button
                className="absolute bottom-2 right-2 text-center bg-main-blue hover:bg-blue-700 text-white pb-1 rounded-full h-8 w-8 shadow"
                onClick={handleRemoveProfileImage}
              >
                <EditIcon style={{ fontSize: 16 }} />
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="absolute bottom-2 right-2 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Personal Information Form */}
          <main className="max-w-5xl mx-auto bg-white rounded-lg shadow p-4 md:p-6">
            <div
              className="flex justify-end text-main-blue font-medium mb-4 cursor-pointer"
              onClick={handleEditClick}
            >
              <BorderColorOutlinedIcon className="mr-1" />
              <span>{isEditing ? "Cancel" : "Edit"}</span>
            </div>

            <p className="capitalize text-main-blue font-medium text-base md:text-lg mb-4">
              personal information
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="fname"
                    className="text-main-black font-medium mb-1 text-sm"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="fname"
                    value={updatedData.firstName}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 text-main-black/80 outline-none text-sm bg-gray-100"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="lname"
                    className="text-main-black font-medium mb-1 text-sm"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lname"
                    value={updatedData.lastName}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 text-main-black/80 outline-none text-sm bg-gray-100"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="balance"
                    className="text-main-black font-medium mb-1 text-sm"
                  >
                    Balance
                  </label>
                  <input
                    type="text"
                    name="balance"
                    id="balance"
                    value={updatedData.balance}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 text-main-black/80 outline-none text-sm bg-gray-100"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="nber"
                    className="text-main-black font-medium mb-1 text-sm"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="nber"
                    value={updatedData.phoneNumber}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 text-main-black/80 outline-none text-sm bg-gray-100"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="email"
                    className="text-main-black font-medium mb-1 text-sm"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={updatedData.email}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 text-main-black/80 outline-none text-sm bg-gray-100"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="mt-4 bg-main-blue text-white p-2 rounded-md"
                >
                  Save Changes
                </button>
              )}
            </form>
          </main>
        </section>
      </div>
    </div>
  );
}

export default Profile;
