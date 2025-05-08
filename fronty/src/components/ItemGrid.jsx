import { BASE_URL } from "../api/axios";

export default function ItemGrid({ items, loading, error }) {
  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {/* Display books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 p-8">
        {items.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">No books found</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col bg-white p-4 rounded-md">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src={`${BASE_URL}${item.bookCover}`}
                  alt={item.bookName}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </div>
              <h3 className="text-main-blue font-medium mt-3 capitalize">{item.bookName}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">{item.description}</p>
              <button
                onClick={() => setSelectedBook(item)}
                className="rounded-md py-3 text-sm bg-main-blue hover:bg-blue-500 text-white w-full"
              >
                Buy Now
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
