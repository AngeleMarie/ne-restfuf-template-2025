import React, { useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { axiosPrivate } from '../api/axios';

const CreateModal = ({ isOpen, onClose, reloadData }) => {
  const [newBook, setNewBook] = useState({
    bookName: '',
    description: '',
    quantityInStock: '',
    unitPrice: '',
    publishingDate: '',
    status: 'In Transit',
    bookCover: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewBook((prev) => ({
      ...prev,
      bookCover: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { bookName, description, quantityInStock, unitPrice, publishingDate, status, bookCover } = newBook;

    if (!bookName || !description || !quantityInStock || !unitPrice || !publishingDate || !bookCover) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('bookName', bookName);
      formData.append('description', description);
      formData.append('quantityInStock', quantityInStock);
      formData.append('unitPrice', unitPrice);
      formData.append('publishingDate', publishingDate);
      formData.append('status', status);
      formData.append('bookCover', bookCover);

      const response = await axiosPrivate.post('/books/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      console.log('Book added:', response.data);
      
      setSuccess('Book added successfully!');
      reloadData();
      onClose();
    } catch (error) {
      console.error('Error adding book:', error);
      setError(error.response?.data?.error || 'Failed to add book');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white relative rounded-lg p-8 z-10 shadow-lg w-1/2">
        <h2 className="text-xl text-main-blue text-center font-bold mb-4">Add New Book</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-main-blue">Book Name</label>
            <input
              type="text"
              name="bookName"
              value={newBook.bookName}
              onChange={handleChange}
              className="mt-1 border p-2 rounded-md w-full outline-none text-other-green"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-main-blue">Description</label>
            <textarea
              name="description"
              value={newBook.description}
              onChange={handleChange}
              className="mt-1 border p-2 rounded-md  w-full outline-none text-other-green"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-main-blue">Quantity in Stock</label>
            <input
              type="number"
              name="quantityInStock"
              value={newBook.quantityInStock}
              onChange={handleChange}
              className="mt-1 border p-2 rounded-md  w-full outline-none text-other-green"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-main-blue">Unit Price</label>
            <input
              type="number"
              step="0.01"
              name="unitPrice"
              value={newBook.unitPrice}
              onChange={handleChange}
              className="mt-1 border p-2 rounded-md  w-full outline-none text-other-green"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-main-blue">Publishing Date</label>
            <input
              type="date"
              name="publishingDate"
              value={newBook.publishingDate}
              onChange={handleChange}
              className="mt-1 border p-2 rounded-md  w-full outline-none text-other-green"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-main-blue">Status</label>
            <select
              name="status"
              value={newBook.status}
              onChange={handleChange}
              className="mt-1 border p-2 rounded-md  w-full outline-none text-other-green"
            >
              <option value="Arrived">Arrived</option>
              <option value="In Transit">In Transit</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-main-blue">Book Cover</label>
            <input
              type="file"
              accept="image/*"
              name="bookCover"
              onChange={handleFileChange}
              className="mt-1 w-full  border p-2 rounded-md  text-other-green"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="absolute top-8 right-8 text-2xl bg-red-500/20 rounded-full text-red-500"
              onClick={onClose}
            >
              <MdCancel />
            </button>

            <button
              type="submit"
              className="px-4 w-1/2 py-2 bg-blue-700 font-medium text-white rounded hover:bg-blue-600"
            >
              Save Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
