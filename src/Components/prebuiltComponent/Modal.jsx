import React from "react";

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-2">
        <h2 className="text-xl font-semibold text-center mb-4">{message}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#A24C4A] text-white py-2 px-4 rounded-md hover:bg-[#A24C4A] focus:outline-none focus:ring-2 focus:ring-[#A24C4A] focus:ring-opacity-50"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="tracking-wide font-semibold bg-white text-[#A24C4A] py-2 px-4 h-12 rounded border-1 border-[#A24C4A]"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
