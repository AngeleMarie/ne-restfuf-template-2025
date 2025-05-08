import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";
import ItemGrid from "../../components/ItemGrid";
import PaginationComponent from "../../components/Pagination";
import Sidebar from "./SideBar";
import Topbar from "../../components/TopBar";

export default function Store() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch books data from the API on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosPrivate.get("/books/get-all", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setItems(response.data.data); // Assuming the books are under `data` key
        setLoading(false);
      } catch (error) {
        setError("Failed to load books. Please try again later.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const sanitizeSearchTerm = (term) => {
    return term.trim().replace(/[^\w\s]/gi, "");
  };

  const filteredItems = items.filter((item) => {
    const sanitizedSearchTerm = sanitizeSearchTerm(searchTerm).toLowerCase();
    return (
      item.bookName.toLowerCase().includes(sanitizedSearchTerm) ||
      item.description.toLowerCase().includes(sanitizedSearchTerm)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="store-container">
      {/* Sidebar and Topbar */}
      <div className="flex">
        <Sidebar /> {/* Your sidebar component */}
        <div className="flex-1">
          <Topbar /> {/* Your topbar component */}
        
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books..."
              className="w-full max-w-md px-4 py-2 rounded-md border outline-none  border-gray-300 focus:border-main-blue"
            />
          </div>
          {/* Render ItemGrid with data */}
          <ItemGrid items={currentItems} loading={loading} error={error} />
          {/* Pagination Component */}
          <PaginationComponent
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredItems.length}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
