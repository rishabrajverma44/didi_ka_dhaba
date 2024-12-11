import axios from "axios";
import React, { useEffect, useState } from "react";

const DidiTable = () => {
  const [data, setData] = useState([]);
  const getTable = () => {
    axios
      .get(
        "https://didikadhababackend.indevconsultancy.in/dhaba/didi_thela_summary/"
      )
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getTable();
  }, []);

  return (
    <div className="bg-gray-50" style={{ height: "99vh" }}>
      DidiTable
    </div>
  );
};

export default DidiTable;
