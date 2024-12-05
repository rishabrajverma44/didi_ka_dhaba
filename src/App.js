import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./Routes/Routes";
import "bootstrap/dist/css/bootstrap.min.css";

import { Button, Modal } from "react-bootstrap";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const router = createBrowserRouter(routes, {
    future: {
      v7_normalizeFormMethod: true,
    },
  });
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      console.log("beforeinstallprompt event detected:", event);
      setDeferredPrompt(event);
      setShowModal(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    if (deferredPrompt) {
      console.log("DeferredPrompt state updated:", deferredPrompt);
    }
  }, [deferredPrompt]);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(choiceResult.outcome);
        setDeferredPrompt(null);
        setShowModal(false);
      });
    }
  };

  return (
    <div className="App">
      <RouterProvider router={router} />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <h3 className="text-[#A24C4A]">Didi Ka Dhaba</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around">
            <p>Would you like to install?</p>

            <div className="text-center">
              <button
                className="tracking-wide font-semibold bg-white text-[#A24C4A] py-1  px-3 rounded border-1 border-[#A24C4A]"
                onClick={handleInstall}
              >
                Install
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
