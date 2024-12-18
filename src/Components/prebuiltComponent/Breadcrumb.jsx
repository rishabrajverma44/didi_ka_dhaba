import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb flex space-x-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${
              index === items.length - 1
                ? "text-gray-700 font-bold"
                : "text-gray-600"
            }`}
            aria-current={index === items.length - 1 ? "page" : undefined}
          >
            {index === items.length - 1 ? (
              item.label
            ) : (
              <Link
                to={item.href}
                className="no-underline text-gray-700 font-bold"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
