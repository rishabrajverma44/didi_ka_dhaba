import React from "react";

const Pagination = ({
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageSize,
  pageCount,
  gotoPage,
  previousPage,
  nextPage,
  setPageSize,
}) => {
  return (
    <div className="pagination-container">
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${!canPreviousPage ? "disabled" : ""}`}>
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canPreviousPage) previousPage();
              }}
              tabIndex="-1"
              style={{
                boxShadow: "0px 1px  #e4e4e4",
                color: "#212529",
                textDecoration: "none",
              }}
            >
              Previous
            </a>
          </li>

          {[...Array(pageCount)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${pageIndex === index ? "active" : ""}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  gotoPage(index);
                }}
                style={{
                  boxShadow: "0px 1px  #e4e4e4",
                  backgroundColor: pageIndex === index ? "#344050" : "",
                  textDecoration: "none",
                }}
              >
                {index + 1}
                {pageIndex === index && (
                  <span className="sr-only">(current)</span>
                )}
              </a>
            </li>
          ))}

          <li className={`page-item ${!canNextPage ? "disabled" : ""}`}>
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canNextPage) nextPage();
              }}
              style={{
                boxShadow: "0px 1px  #e4e4e4",
                color: "#212529",
                textDecoration: "none",
              }}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
