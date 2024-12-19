import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";

const RegistrationNav = () => {
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
            <div className="flex items-center w-full justify-between">
              <section className="flex justify-between items-center w-full py-2 px-2">
                <div className="flex items-center justify-center">
                  <Link to="/didireg-register">
                    <img src="/images/logo.png" alt="logo" width="60" />
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
                      <button onClick={toggleDropdown}>
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
                          alt=""
                          width="10"
                          className="img-fluid "
                          style={{ height: "50px", width: "50px" }}
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
                    to="/didireg-register"
                  >
                    Didi Registration
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/didilist-register"
                  >
                    Didi List
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/thelareg-register"
                  >
                    Stall Registration
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/stall_list-register"
                  >
                    Stall List
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
      </div>
    </>
  );
};

export default RegistrationNav;
