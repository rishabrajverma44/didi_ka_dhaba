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
    <div className="flex items-center justify-between">
      <button
        style={{ width: "110px" }}
        className={`px-1 py-1 rounded-md border ${
          canPreviousPage
            ? "btn btn-dark hover:bg-[#53230A] text-white px-4 rounded-md transition-colors"
            : "btn btn-dark hover:bg-[#53230A] text-white px-4 rounded-md transition-colors cursor-not-allowed"
        }`}
        onClick={previousPage}
      >
        Previous
      </button>

      <div className="px-1 py-1 rounded-md border bg-gray-100">
        Page{" "}
        <strong>
          {safePageIndex} of {safePageCount}
        </strong>
      </div>

      <button
        style={{ width: "110px" }}
        className={`px-1 py-1 rounded-md border ${
          canNextPage
            ? "btn btn-dark hover:bg-[#53230A] text-white px-4 rounded-md transition-colors"
            : "btn btn-dark hover:bg-[#53230A] text-white px-4 rounded-md transition-colors  cursor-not-allowed"
        }`}
        onClick={nextPage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
