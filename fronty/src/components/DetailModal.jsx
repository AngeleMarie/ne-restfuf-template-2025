"use client"

import { useState } from "react"


// Sample book data
const items = Array(12)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    bookName: "The Great Gatsby",
    description:
      "Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby...",
    bookCover: "/uploads/covers/book-123.jpg",
    status: true,
    quantityInStock: 5,
    unitPrice: 12.99,
    publishingDate: "2023-06-23T18:25:43.511Z",
  }))

export default function BookGrid() {
  const [selectedBook, setSelectedBook] = useState(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.bookCover || "/placeholder.svg"}
                alt={item.bookName}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
            </div>
            <h3 className="text-main-blue font-medium mt-3">{item.bookName}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-3">{item.description}</p>
            <p className="text-sm text-gray-800 font-semibold">Price: ${item.unitPrice}</p>
            <p className="text-xs text-gray-500">Stock: {item.quantityInStock}</p>
            <button
              onClick={() => setSelectedBook(item)} 
              className="mt-2 text-main-blue border border-main-blue rounded-full py-2 px-4 text-sm hover:bg-lime-50 w-fit"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
