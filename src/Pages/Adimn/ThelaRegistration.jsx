import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ThelaRegistration = () => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const navigate = useNavigate();

  // Handle input change to mark the form as dirty
  const handleInputChange = () => {
    setIsFormDirty(true);
  };

  // Block navigation with confirmation
  const handleRouteChange = (to) => {
    if (isFormDirty) {
      // Show confirmation dialog if form is dirty
      const confirmation = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );
      if (confirmation) {
        navigate(to); // Proceed with navigation if confirmed
      }
    } else {
      navigate(to); // Proceed without confirmation if form is not dirty
    }
  };

  // Optional: Block the user from leaving the page using the 'beforeunload' event
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty) {
        const confirmationMessage =
          "You have unsaved changes. Are you sure you want to leave this page?";
        e.returnValue = confirmationMessage; // For most browsers
        return confirmationMessage; // For some browsers (e.g. older versions of Chrome)
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);

  return (
    <div className="bg-gray-50" style={{ height: "99vh" }}>
      <h2>Thela Registration</h2>
    </div>
  );
};

export default ThelaRegistration;
