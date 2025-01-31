import React, { useState, useEffect, Suspense, startTransition } from "react";

import { ToastContainer } from "react-toastify";

const Map = React.lazy(() => import("./Admin/Map"));
const PymantAnnalytic = React.lazy(() => import("./Admin/PymentAnnalytic"));
const Table = React.lazy(() => import("./Admin/Table"));

const AdminHome = () => {
  const [paymnet, setPayment] = useState(false);
  const [table, setTable] = useState(false);
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setShowSecond(true);
      setPayment(true);
      setTable(true);
    });
  }, []);

  return (
    <div
      className="px-6 md:px-12 bg-slate-100 pt-2 pb-2"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer />

      <div className="pt-2 bg-white mb-2 px-2 pb-2">
        {showSecond && (
          <Suspense fallback={<div>Loading Pyment component...</div>}>
            <PymantAnnalytic />
          </Suspense>
        )}
        {table && (
          <Suspense fallback={<div>Loading Table component...</div>}>
            <Table />
          </Suspense>
        )}
      </div>

      {showSecond && (
        <Suspense fallback={<div>Loading map component...</div>}>
          <Map />
        </Suspense>
      )}
    </div>
  );
};

export default AdminHome;
