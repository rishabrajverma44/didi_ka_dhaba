import React from "react";

const Pagination = ({
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageSize,
  pageCount,
  previousPage,
  nextPage,
  setPageSize,
}) => {
  const safePageCount = pageCount > 0 ? pageCount : 1; // Ensure pageCount is never 0 or NaN
  const safePageIndex = pageIndex + 1; // Page index should start from 1, not 0

  return (
    <div className="flex items-center justify-between py-4">
      <button
        className={`px-4 py-2 rounded-md border ${
          canPreviousPage
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={previousPage}
        disabled={!canPreviousPage}
      >
        Previous
      </button>

      {/* Page Information */}
      <div className="px-4 py-2 rounded-md border bg-gray-100">
        Page{" "}
        <strong>
          {safePageIndex} of {safePageCount}
        </strong>
      </div>

      <button
        className={`px-4 py-2 rounded-md border ${
          canNextPage
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={nextPage}
        disabled={!canNextPage}
      >
        Next
      </button>

      {/* Page Size Selector */}
      <select
        className="form-select px-4 py-2 rounded-md border bg-white text-gray-700"
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        {[3, 5, 10, 20].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
