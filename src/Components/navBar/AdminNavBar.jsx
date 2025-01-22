import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";

const AdminNavBar = () => {
  const [isSideMenuOpen, setMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userCredentials");
    navigate("/");
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <main className="sticky top-0 z-50 bg-white border-b-4 border-[#A24C4A] shadow-sm">
          <nav className="flex justify-between items-center border-0 relative z-50">
            <div className="flex items-center w-full justify-between px-9">
              <section className="flex justify-between items-center w-full py-1 px-2">
                <div className="flex">
                  <Link to="/admin">
                    <img src="/images/logo.png" alt="logo" width="70" />
                  </Link>
                </div>

                <h5 className="tracking-wide font-bold text-[#344050] text-md md:text-2xl mt-2 text-center font-sans flex-1">
                  DIDI KA DHABA
                </h5>

                <FiMenu
                  onClick={() => setMenu(true)}
                  className="text-3xl cursor-pointer mt-3 md:hidden"
                />
                <div className="d-none d-md-block">
                  <div className="flex items-center gap-2">
                    <span className="">
                      <button
                        onClick={toggleDropdown}
                        className="flex justify-between items-center"
                      >
                        <img
                          src="/images/avatar-1.jpg"
                          alt=""
                          width="10"
                          className="img-fluid "
                          style={{ height: "60px", width: "60px" }}
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
                    to="/admin"
                    onClick={() => setMenu(false)}
                  >
                    Home
                  </Link>
                  <Link
                    className="block w-full py-1 px-4 text-[#682C13] text-left text-gray-700 font-bold no-underline text-xl"
                    to="/listfood"
                    onClick={() => setMenu(false)}
                  >
                    Food List
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/didireg"
                    onClick={() => setMenu(false)}
                  >
                    Didi Registration
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/didilist"
                  >
                    Didi List
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/thelareg"
                    onClick={() => setMenu(false)}
                  >
                    Stall Registration
                  </Link>

                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/stall_list"
                    onClick={() => setMenu(false)}
                  >
                    Stall List
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/assign"
                    onClick={() => setMenu(false)}
                  >
                    Didi assing
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
        <section className="z-50 py-1 bg-[#682C13] d-none d-md-block">
          <div className="border-b-2 border-[#682C13]">
            <div className="mx-4 flex justify-start items-center">
              <Link
                className="block py-1 px-4 text-white no-underline text-md"
                to="/admin"
                onClick={() => setMenu(false)}
              >
                Home
              </Link>
              <Link
                className="block py-1 px-4 text-white no-underline text-md"
                to="/dailylog"
                onClick={() => setMenu(false)}
              >
                Payment Details
              </Link>
              <Link
                className="block py-1 px-4 text-white no-underline text-md"
                to="/listfood"
                onClick={() => setMenu(false)}
              >
                Food List
              </Link>

              <Link
                className="block py-1 px-4 text-white no-underline text-md"
                to="/didilist"
                onClick={() => setMenu(false)}
              >
                Didi List
              </Link>
              <Link
                className="block py-1 px-4 text-white no-underline text-md"
                to="/stall_list"
                onClick={() => setMenu(false)}
              >
                Stall List
              </Link>

              <Link
                className="block py-1 px-4 text-white no-underline text-md"
                to="/assign_list"
                onClick={() => setMenu(false)}
              >
                Assigned List
              </Link>

              {/* <div className="relative" ref={dropdownRefDidi}>
                <button
                  className="block py-1 px-4 text-white text-left no-underline text-md"
                  onMouseEnter={toggleDropdownDidi}
                >
                  <span className="flex gap-2 justify-center items-center text-center">
                    <span>Didi</span> <FiChevronDown />
                  </span>
                </button>
                {isOpenDidi && (
                  <div
                    className="absolute left-0 pt-2 w-56 rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <Link
                        className="block w-full px-4 text-lg py-1 text-left text-sm text-gray-700 no-underline hover:bg-gray-100"
                        to="/didireg"
                      >
                        Didi Registration
                      </Link>
                      <Link
                        className="block w-full px-4 text-lg py-1 text-left text-sm text-gray-700 no-underline hover:bg-gray-100"
                        to="/didilist"
                      >
                        Didi List
                      </Link>
                    </div>
                  </div>
                )}
              </div> */}

              {/* <div className="relative" ref={dropdownRefStall}>
                <button
                  className="block py-1 px-4 text-white text-left text-gray-700 no-underline text-md"
                  onMouseEnter={toggleDropdownStall}
                >
                  <span className="flex gap-2 justify-center items-center text-center">
                    <span>Stall</span> <FiChevronDown />
                  </span>
                </button>
                {isOpenStall && (
                  <div
                    className="absolute left-0 pt-2 w-56 rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <Link
                        className="block w-full px-4 text-lg py-1 text-left text-sm text-gray-700 no-underline hover:bg-gray-100"
                        to="/thelareg"
                      >
                        Stall Registration
                      </Link>
                      <Link
                        className="block w-full px-4 text-lg py-1 text-left text-sm text-gray-700 no-underline hover:bg-gray-100"
                        to="/stall_list"
                      >
                        Stall List
                      </Link>
                    </div>
                  </div>
                )}
              </div> */}

              {/* <div className="relative" ref={dropdownRefAssign}>
                <button
                  className="block py-1 px-4 text-white text-left text-gray-700 no-underline text-md"
                  onMouseEnter={toggleDropdownAssign}
                >
                  <span className="flex gap-2 justify-center items-center text-center">
                    <span>Assignment</span> <FiChevronDown />
                  </span>
                </button>
                {isOpenAssign && (
                  <div
                    className="absolute left-0 pt-2 w-56 rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <Link
                        className="block w-full px-4 text-lg py-1 text-left text-sm text-gray-700 no-underline hover:bg-gray-100"
                        to="/assign"
                      >
                        Assign Stall
                      </Link>
                      <Link
                        className="block w-full px-4 text-lg py-1 text-left text-sm text-gray-700 no-underline hover:bg-gray-100"
                        to="/assign_list"
                      >
                        Assign List
                      </Link>
                    </div>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminNavBar;
