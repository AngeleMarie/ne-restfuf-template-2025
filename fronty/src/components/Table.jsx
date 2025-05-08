import React, { useState, useEffect, useCallback } from "react";
import { axiosPrivate, BASE_URL } from "../api/axios";
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
import ConfirmDeleteModal from "./ConfirmDelete";

const ITEMS_PER_PAGE = 5;

const sanitizeInput = (input) => input.trim().replace(/[^\w\s]/gi, "");

const Table = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modal, setModal] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [bookToDelete, setBookToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get("/books/get-all", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setBooks(res.data?.data || []);
    } catch (err) {
      setError("Failed to fetch books.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  const filteredBooks = books.filter((book) =>
    book.bookName.toLowerCase().includes(sanitizeInput(searchTerm).toLowerCase())
  );

  const currentItems = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBooks);
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
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("Failed to delete book.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <button
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-2 md:mb-0"
          onClick={() => setModal({ ...modal, create: true })}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Book
        </button>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search books..."
            className="border p-2 text-sm rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            className="flex items-center text-gray-700 text-sm"
            onClick={downloadExcel}
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
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
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="py-2 px-4">Book</th>
                <th className="py-2 px-4">Publishing Date</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Unit Price</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length ? (
                currentItems.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center">
                      <img
                        src={`${BASE_URL}${book.bookCover}`}
                        alt={book.bookName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="font-medium">{book.bookName}</span>
                    </td>
                    <td className="py-3 px-4">{book.publishingDate}</td>
                    <td className="py-3 px-4">{book.quantityInStock}</td>
                    <td className="py-3 px-4">{book.unitPrice}</td>
                    <td className="py-3 px-4">{book.status}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        title="View"
                        onClick={() => {
                          setSelectedBook(book);
                          setModal({ ...modal, view: true });
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => {
                          setSelectedBook(book);
                          setModal({ ...modal, edit: true });
                        }}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => {
                          setBookToDelete(book);
                          setModal({ ...modal, delete: true });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
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
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredBooks.length}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={modal.create}
        onClose={() => setModal({ ...modal, create: false })}
        refreshData={fetchBooks}
      />
      <ViewModal
        isOpen={modal.view && !!selectedBook}
        onClose={() => setModal({ ...modal, view: false })}
        book={selectedBook}
      />
      <EditModal
        isOpen={modal.edit}
        onClose={() => setModal({ ...modal, edit: false })}
        book={selectedBook}
        onUpdate={(updatedBook) => {
          setBooks((prev) =>
            prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
          );
          setModal({ ...modal, edit: false });
        }}
      />
      <ConfirmDeleteModal
        isOpen={modal.delete}
        onClose={() => setModal({ ...modal, delete: false })}
        onConfirm={async () => {
          if (bookToDelete) {
            await handleDelete(bookToDelete.id);
            setBookToDelete(null);
            setModal({ ...modal, delete: false });
          }
        }}
      />
    </div>
  );
};

export default Table;
