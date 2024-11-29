import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";
import logo from "../../Assets/Images/logo.png";
import profile from "../../Assets/Images/avatar-1.jpg";

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

  const navlinks = [
    // { label: "Dashboard", link: "" },
    // { label: "Reports", link: "" },
    // { label: "Users", link: "" },
    // { label: "Setting", link: "" },
    // { label: "Notification", link: "" },
    // { label: "Logout", link: "" },
  ];

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
      <main className="sticky top-0 z-50 bg-white border-b-4 border-yellow-200 shadow-sm">
        <nav className="flex justify-between px-8 items-center py-2 border-0 relative z-50">
          <div className="flex items-center w-100">
            <section className="d-flex justify-content-between w-100 gap-4">
              <div className="flex items-center gap-2 mt-2">
                <Link to="/" className="">
                  <img src={logo} alt="logo" width="50" className="h-12" />
                </Link>
              </div>
              <h5 className="tracking-wide fs-5 mt-2 items-center d-flex text-center font-sans">
                KITCHEN MANAGEMENT SYSTEM
              </h5>
              <FiMenu
                onClick={() => setMenu(true)}
                className="text-3xl cursor-pointer mt-3 md:hidden"
              />
              <div className="d-none d-md-block">
                <div className="flex items-cente gap-0">
                  <div
                    className="dropdown topbar-head-dropdown ms-1 header-item mx-4 mt-2"
                    id="notificationDropdown1"
                  >
                    <button
                      type="button"
                      className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                      id="page-header-notifications-dropdown"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-bell fa-lg"></i>
                      <span
                        className="position-absolute topbar-badge translate-middle badge rounded-pill bg-danger"
                        style={{
                          fontSize: "10px",
                        }}
                      >
                        3
                      </span>
                    </button>
                  </div>

                  <span className="bg-gray-100 p-2">
                    <button onClick={toggleDropdown}>
                      <img
                        className="rounded-circle header-profile-user h-9"
                        src={profile}
                        alt="Header Avatar"
                      />
                    </button>

                    {isOpen && (
                      <div class="mt-4 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div class="py-1">
                          <button
                            type="submit"
                            class="block w-full px-4 py-2 text-left text-sm text-gray-700"
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
            <section className="text-black bg-white flex-col absolute right-0 top-0 h-screen p-8 gap-8 z-50 w-56 flex">
              <IoCloseOutline
                onClick={() => setMenu(false)}
                className="mt-0 mb-8 text-3xl cursor-pointer"
              />
              <div className="mx-4">
                <button
                  type="submit"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
                {navlinks.map((d, i) => (
                  <Link key={i} className="font-bold" to={d.link}>
                    {d.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </nav>
      </main>
    </>
  );
};

export default Navbar;
