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
    <div class="d-flex justify-content-between my-4 my-md-0">
      <button
        className={`px-1 py-1 rounded-md border w-20 ${
          canPreviousPage
            ? "btn btn-dark hover:bg-[#53230A] text-white rounded-md transition-colors"
            : "btn btn-dark hover:bg-[#53230A] text-white rounded-md transition-colors cursor-not-allowed"
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
        className={`px-1 py-1 rounded-md border w-20 ${
          canNextPage
            ? "btn btn-dark hover:bg-[#53230A] text-white rounded-md transition-colors"
            : "btn btn-dark hover:bg-[#53230A] text-white rounded-md transition-colors  cursor-not-allowed"
        }`}
        onClick={nextPage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
