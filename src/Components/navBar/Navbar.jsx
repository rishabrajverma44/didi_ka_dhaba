import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";
import logo from "../../Assets/Images/chhukha_dam.png";
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
    { label: "Dashboard", link: "" },
    { label: "Reports", link: "" },
    { label: "Users", link: "" },
    { label: "Setting", link: "" },
    { label: "Notification", link: "" },
    { label: "Logout", link: "" },
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
      <main className="sticky top-0 z-50 bg-white">
        <nav className="flex justify-between px-8 items-center py-2 border-0 relative z-50">
          <div className="flex items-center w-100">
            <section className="d-flex justify-content-between w-100 gap-4">
              <div className="flex items-center gap-2">
                <FiMenu
                  onClick={() => setMenu(true)}
                  className="text-3xl cursor-pointer md:hidden"
                />

                <Link to="/" className="">
                  <img
                    src={logo}
                    alt="logo of druk green"
                    height="50"
                    className="h-12"
                  />
                </Link>
              </div>

              <h4 className="fw-bold fs-3 items-center d-flex justify-content-center font-sans">
                Hydropower Forecasting System for Chhukha Dam
              </h4>

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
                      <div class="mt-4 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div class="py-1">
                          <Link
                            to="/profile"
                            type="submit"
                            class="text-decoration-none block w-full px-4 py-2 text-left text-sm text-gray-700"
                          >
                            profile
                          </Link>
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
              "fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 z-40 transition-all transform",
              isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <section className="text-black bg-white flex-col absolute left-0 top-0 h-screen p-8 gap-8 z-50 w-56 flex">
              <IoCloseOutline
                onClick={() => setMenu(false)}
                className="mt-0 mb-8 text-3xl cursor-pointer"
              />
              {navlinks.map((d, i) => (
                <Link key={i} className="font-bold" to={d.link}>
                  {d.label}
                </Link>
              ))}
            </section>
          </div>
        </nav>

        <div className="d-flex justify-content-between border-2 shadow-md py-1 px-20">
          <div className="self-center">
            <Link to="/" className="nav-link">
              <i className="fa-solid fa-gauge mx-2 fs-6"></i>
              <span className="fs-5 fw-2">Dashboards</span>
            </Link>
          </div>

          <div className="hidden md:flex gap-4">
            <Link to="/report" className="text-decoration-none nav-link py-1">
              Reports
            </Link>
            <Link to="/users" className="text-decoration-none nav-link py-1">
              Users
            </Link>
            <Link
              to="/notification"
              className="text-decoration-none nav-link py-1"
            >
              Notification
            </Link>
            <Link to="/setting" className="text-decoration-none nav-link py-1">
              Setting
            </Link>
          </div>

          <div className="self-center">
            <div className="input-group">
              <input
                type="datetime-local"
                className="form-control dash-filter-picker"
                data-provider="flatpickr"
                data-range-date="true"
                data-date-format="d M, Y"
                data-default-date="01 Jan 2022 to 31 Jan 2022"
                ref={datetimeInputRef}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Navbar;
