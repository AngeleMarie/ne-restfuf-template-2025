import React from 'react';
import Pagination from 'react-js-pagination';

function PaginationComponent({ currentPage, itemsPerPage, totalItems, onPageChange }) {
    return (
        <div className='flex justify-center my-4'>
            <Pagination
                activePage={currentPage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={totalItems}
                pageRangeDisplayed={3}
                onChange={onPageChange}
                innerClass="flex space-x-2"
                itemClass="px-3 py-1 text-main-black hover:text-white border rounded-md cursor-pointer  hover:bg-blue-500 border border-gray-300"
                activeClass=" text-white bg-main-blue "
            />
        </div>
    );
}

export default PaginationComponent;
