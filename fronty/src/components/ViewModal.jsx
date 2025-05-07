import React, { useState, useEffect } from 'react';
import { MdCancel } from 'react-icons/md';
import { axiosPrivate } from '../api/axios'; 
import { BASE_URL } from '../api/axios';

const ViewModal = ({ isOpen, onClose, book }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!book || !isOpen) return;

  console.log('Book details:', book); // Debugging line to check the book object

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(`/books/get/${book.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setBookDetails(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchBookDetails();
}, [book, isOpen]);


  if (!isOpen || !bookDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white relative p-8 md:p-12 w-11/12 md:w-1/2 h-auto rounded shadow-lg overflow-auto">
        <button
          className="absolute top-8 right-8 text-2xl bg-red-500/20 rounded-full text-red-500"
          onClick={onClose}
        >
          <MdCancel size={24} />
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="text-center">
              <img src={`${BASE_URL}${book.bookCover}`}
              alt={book.bookName} 
              className="w-full max-w-sm h-auto mx-auto object-cover my-4 rounded-lg"
            />
            <p className="text-xl font-bold uppercase text-main-blue my-2">
              <span className="font-normal capitalize">Book: </span>
              {book.bookName} 
            </p>
          </div>
        )}

        <div className="text-blackie/90 my-4">
          <h3 className="text-main-blue font-semibold text-lg">Details</h3>
          <p>Price: {book.unitPrice}</p>
          <p>Status: {book.status}</p>
          <p>Date: {book.publishingDate}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
