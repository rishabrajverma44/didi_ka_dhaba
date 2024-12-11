import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Make sure Modal is imported

const ConfirmNavigation = ({ targetUrl, hasUnsavedChanges }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // This function handles the event when the user tries to navigate
  const handlePopState = () => {
    if (hasUnsavedChanges) {
      // Show confirmation modal when user tries to navigate
      setShowModal(true);
    } else {
      navigate(targetUrl); // If no unsaved changes, just navigate
    }
  };

  const handleNavigate = () => {
    // Navigate to the target URL if user confirms
    navigate(targetUrl);
    setShowModal(false); // Close the modal after navigation
  };

  const handleCancel = () => {
    // Close the modal without navigating
    setShowModal(false);
  };

  useEffect(() => {
    // Listen for popstate event (browser back/forward)
    window.addEventListener("popstate", handlePopState);

    // Push a new state to the history when the component is mounted
    window.history.pushState(null, "");

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, targetUrl]);

  return (
    <>
      {showModal && (
        <Modal
          message="Are you sure you want to leave?"
          onConfirm={handleNavigate}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default ConfirmNavigation;
