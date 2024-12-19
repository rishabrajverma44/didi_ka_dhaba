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
  const safePageCount = pageCount > 0 ? pageCount : 1;
  const safePageIndex = pageIndex + 1;

  return (
    <div className="flex items-center justify-between py-4">
      <button
        className={`px-4 py-2 rounded-md border ${
          canPreviousPage
            ? "btn btn-dark hover:bg-[#53230A] text-white px-4 py-2 rounded-md transition-colors"
            : "btn btn-dark hover:bg-[#53230A] text-white px-4 py-2 rounded-md transition-colors cursor-not-allowed"
        }`}
        onClick={previousPage}
        disabled={!canPreviousPage}
      >
        Previous
      </button>

      <div className="px-4 py-2 rounded-md border bg-gray-100">
        Page{" "}
        <strong>
          {safePageIndex} of {safePageCount}
        </strong>
      </div>

      <button
        className={`px-4 py-2 rounded-md border ${
          canNextPage
            ? "btn btn-dark hover:bg-[#53230A] text-white px-4 py-2 rounded-md transition-colors"
            : "btn btn-dark hover:bg-[#53230A] text-white px-4 py-2 rounded-md transition-colors  cursor-not-allowed"
        }`}
        onClick={nextPage}
        disabled={!canNextPage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
