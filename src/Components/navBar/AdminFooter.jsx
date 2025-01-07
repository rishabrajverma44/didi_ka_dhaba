import React from "react";

const AdminFooter = () => {
  return (
    <div className="footer">
      <div className="min-h-[50px] flex flex-col">
        <footer className="w-full bg-[#682C13] text-white text-center py-2 fixed bottom-0 left-0">
          <div className="flex justify-between items-center px-3 text-sm">
            <div> © 2024 Didi Ka Dhaba. All Rights Reserved.</div>
            <div>Privacy Policy | Terms of Use</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminFooter;
