import React, { useState, useEffect, useCallback } from "react";
import { axiosPrivate } from "../api/axios";

import {
  ArrowDownTrayIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import PaginationComponent from "./Pagination";
import EditModal from "./EditModal";
import CreateModal from "./CreateModal";
import ViewModal from "./ViewModal";
import { BASE_URL } from "../api/axios";
import ConfirmDeleteModal from "./ConfirmDelete";

const Table = () => {
  const [data, setData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFreeTrialOnly, setShowFreeTrialOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const itemsPerPage = 5;

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosPrivate.get("/books/get-all", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setData(response.data?.data || []); // Update state with fetched data
    } catch (err) {
      setError("Failed to fetch books.");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle page changes for pagination
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  // Filter books based on search term and free trial status
  const filteredData = data.filter((book) => {
    const matchesSearch = book.bookName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFreeTrial = !showFreeTrialOnly || book.status === "Free Trial";
    return matchesSearch && matchesFreeTrial;
  });

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Download the filtered data as an Excel file
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Books Report");
    XLSX.writeFile(workbook, "books_report.xlsx");
  };

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`/books/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setData(data.filter((b) => b.id !== id));
    } catch (err) {
      alert("Failed to delete book.");
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Top controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Book
          </button>
        </div>

        {/* Search and Free Trial filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search term change
            }}
            className="border p-2 text-sm rounded w-full focus:outline-none focus:ring-2 focus:ring-main-blue"
          />
          <button
            onClick={downloadExcel}
            className="text-sm text-gray-700 flex gap-x-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading books...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
            <thead className="border-b">
              <tr className="text-left py-2 px-4 bg-gray-100 text-gray-500">
                <th className="py-2 px-4">Book</th>
                <th className="py-2 px-4">Publishing Date</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Unit Price</th>

                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center">
                      <img
                        src={`${BASE_URL}${item.bookCover}`}
                        alt={item.bookName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="font-medium">{item.bookName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.publishingDate}</td>
                    <td className="py-3 px-4">{item.quantityInStock}</td>
                    <td className="py-3 px-4">{item.unitPrice}</td>
                    <td className="py-3 px-4">{item.status}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        title="View"
                        onClick={() => {
                          setSelectedBook(item);
                          setDetailsModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => {
                          setSelectedBook(item);
                          setEditModalOpen(true);
                        }}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => {
                          setBookToDelete(item);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <PaginationComponent
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        refreshData={fetchBooks}
      />
      <ViewModal
        isOpen={isDetailsModalOpen && selectedBook !== null}
        onClose={() => setDetailsModalOpen(false)}
        book={selectedBook}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        book={selectedBook}
        onUpdate={(updatedBook) => {
          setData(data.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
          setEditModalOpen(false);
        }}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          if (bookToDelete) {
            await handleDelete(bookToDelete.id);
            setDeleteModalOpen(false);
            setBookToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default Table;
