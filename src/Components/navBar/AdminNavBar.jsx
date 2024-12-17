import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";

const AdminNavBar = () => {
  const [isSideMenuOpen, setMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const [isOpenDidi, setIsOpenDidi] = useState(false);
  const [isOpenFood, setIsOpenFood] = useState(false);
  const [isOpenStall, setIsOpenStall] = useState(false);
  const [isOpenAssign, setIsOpenAssign] = useState(false);

  const dropdownRefDidi = useRef(null);
  const dropdownRefFood = useRef(null);
  const dropdownRefStall = useRef(null);
  const dropdownRefAssign = useRef(null);

  const toggleDropdownDidi = () => {
    setIsOpenDidi(!isOpenDidi);
    setIsOpenFood(false);
    setIsOpenStall(false);
    setIsOpenAssign(false);
  };

  const toggleDropdownFood = () => {
    setIsOpenFood(!isOpenFood);
    setIsOpenDidi(false);
    setIsOpenStall(false);
    setIsOpenAssign(false);
  };

  const toggleDropdownStall = () => {
    setIsOpenStall(!isOpenStall);
    setIsOpenDidi(false);
    setIsOpenFood(false);
    setIsOpenAssign(false);
  };

  const toggleDropdownAssign = () => {
    setIsOpenAssign(!isOpenAssign);
    setIsOpenDidi(false);
    setIsOpenFood(false);
    setIsOpenStall(false);
  };

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (
        dropdownRefDidi.current &&
        !dropdownRefDidi.current.contains(event.relatedTarget) &&
        dropdownRefFood.current &&
        !dropdownRefFood.current.contains(event.relatedTarget) &&
        dropdownRefStall.current &&
        !dropdownRefStall.current.contains(event.relatedTarget) &&
        dropdownRefAssign.current &&
        !dropdownRefAssign.current.contains(event.relatedTarget)
      ) {
        setIsOpenDidi(false);
        setIsOpenFood(false);
        setIsOpenStall(false);
        setIsOpenAssign(false);
      }
    };

    const refs = [
      dropdownRefDidi,
      dropdownRefFood,
      dropdownRefStall,
      dropdownRefAssign,
    ];
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.addEventListener("mouseleave", handleMouseLeave);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener("mouseleave", handleMouseLeave);
        }
      });
    };
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userCredentials");
    navigate("/");
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <main className=" z-500 bg-[#F7F7F7] border-b-4 border-[#682C13] shadow-sm">
          <nav className="flex justify-between items-center border-0 relative z-500">
            <div className="flex items-center w-full justify-between">
              <section className="flex justify-between items-center w-full py-2 px-2">
                <div className="flex items-center justify-center">
                  <Link to="/admin">
                    <img src="/images/logo.png" alt="logo" width="60" />
                  </Link>
                </div>
                <h5 className="tracking-wide font-bold text-[#344050] text-md md:text-xl mt-2 text-center font-sans flex-1">
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
                "fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 left-0 z-400 transition-all transform",
                isSideMenuOpen ? "translate-y-0" : "translate-x-full"
              )}
            >
              <section className="text-black bg-white flex-col absolute right-0 top-0 h-screen py-8 gap-8 z-500 w-70">
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
                    className="block w-full py-1 px-4 text-[#682C13] text-left text-gray-700 font-bold no-underline text-xl"
                    to="/foodmaster"
                  >
                    Food Master
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/didireg"
                  >
                    Didi Registration
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/issuefood"
                  >
                    Thela Registration
                  </Link>
                  <Link
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                    to="/assign"
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
        <section className="z-500 py-1 bg-[#682C13] d-none d-md-block">
          <div className="border-b-2 border-[#682C13]">
            <div className="mx-4 flex justify-start items-center">
              <Link
                className="block py-1 px-4 text-white no-underline text-md"
                to="/admin"
              >
                Home
              </Link>
              <Link
                className="block py-1 px-4 text-white no-underline text-md"
                to="/dailylog"
              >
                Daily Log
              </Link>

              <div className="relative" ref={dropdownRefFood}>
                <button
                  className="block py-1 px-4 text-white text-left text-gray-700 no-underline text-md"
                  onMouseEnter={toggleDropdownFood}
                >
                  <span className="flex gap-2 justify-center items-center text-center">
                    <span>Food Master</span> <FiChevronDown />
                  </span>
                </button>
                {isOpenFood && (
                  <div
                    className="absolute left-0 pt-2 w-56 rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-2">
                      <Link
                        className="block w-full px-4 text-lg py-1 text-left text-sm text-gray-700 no-underline hover:bg-gray-100"
                        to="/addfood"
                      >
                        Add Food
                      </Link>
                      <Link
                        className="block w-full px-4 text-lg py-1 text-left text-sm text-gray-700 no-underline hover:bg-gray-100"
                        to="/listfood"
                      >
                        Food List
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={dropdownRefDidi}>
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
              </div>

              <div className="relative" ref={dropdownRefStall}>
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
              </div>

              <div className="relative" ref={dropdownRefAssign}>
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminNavBar;
