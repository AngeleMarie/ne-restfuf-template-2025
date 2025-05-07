"use client"

import { useState } from "react"
import book from "../assets/zig.jpg"
import PaginationComponent from "./Pagination"
import BookDetailModal from "./DetailModal"

// Sample book data
const items = Array(12)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    title: "Deal with the devil",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: book,
    price: 19.99,
    fullDescription:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  }))

export default function ItemGrid() {
  const [selectedBook, setSelectedBook] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Logic to get items of the current page
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 p-8">
        {currentItems.map((item) => (
          <div key={item.id} className="flex flex-col bg-white p-4 rounded-md">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
            </div>
            <h3 className="text-main-blue font-medium mt-3 capitalize">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-3">{item.description}</p>
            <button
              onClick={() => setSelectedBook(item)}
              className="rounded-md py-3 text-sm bg-main-blue hover:bg-blue-500 text-white w-full"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <PaginationComponent
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={items.length}
        onPageChange={handlePageChange}
      />

   
    </>
  )
}
