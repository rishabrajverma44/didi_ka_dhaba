import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";

const Navbar = () => {
  const [isSideMenuOpen, setMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const datetimeInputRef = useRef(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const formattedDatetime = `${year}-${month}-${day}T${hours}:${minutes}`;
    if (datetimeInputRef.current) {
      datetimeInputRef.current.value = formattedDatetime;
    }
  }, []);

  return (
    <>
      <main className="sticky top-0 z-50 bg-white border-b-4 border-[#A24C4A] shadow-sm">
        <nav className="flex justify-between px-8 items-center py-1 border-0 relative z-50">
          <div className="flex items-center w-full justify-between">
            <section className="flex justify-between items-center w-full">
              <div className="flex items-center justify-center">
                <Link to="/">
                  <img src="/images/logo.png" alt="logo" width="70" />
                </Link>
              </div>
              <h5 className="tracking-wide text-2xl md:text-4xl mt-2 text-center font-sans flex-1">
                Didi Ka Dhaba
              </h5>

              <FiMenu
                onClick={() => setMenu(true)}
                className="text-3xl cursor-pointer mt-3 md:hidden"
              />
              <div className="d-none d-md-block">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 p-2">
                    <button onClick={toggleDropdown}>
                      <img
                        className="rounded-circle header-profile-user h-9"
                        src="/images/avatar-1.jpg"
                        alt="Header Avatar"
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-4 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <button
                            type="submit"
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                            onClick={handleLogout}
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <div
            className={clsx(
              "fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 left-0 z-40 transition-all transform",
              isSideMenuOpen ? "translate-y-0" : "translate-x-full"
            )}
          >
            <section className="text-black bg-white flex-col absolute right-0 top-0 h-screen py-8 gap-8 z-50 w-70">
              <IoCloseOutline
                onClick={() => setMenu(false)}
                className="mt-0 mx-3 mb-12 text-3xl cursor-pointer text-6xl"
              />
              <div className="mx-1">
                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/receivedfood"
                >
                  Issue Food
                </Link>
                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/issuefood"
                >
                  Received Returned Food
                </Link>
                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/payment"
                >
                  Payment Details
                </Link>
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold text-xl"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            </section>
          </div>
        </nav>
      </main>
    </>
  );
};

export default Navbar;
