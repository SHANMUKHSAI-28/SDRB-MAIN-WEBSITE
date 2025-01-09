"use client";

import { useState, Fragment, useContext, useEffect } from "react";
import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import CommonModal from "../CommonModal";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import CartModal from "../CartModal";
import { ShoppingCart, User, LogOut, Settings, Menu } from "lucide-react";

function NavItems({ isModalView = false, isAdminView, router }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <div
      className={`items-center justify-center w-full md:flex md:w-auto ${
        isModalView ? "" : "hidden md:flex"
      }`}
      id="nav-items"
    >
      <ul className={`flex flex-col md:flex-row md:space-x-1 ${
        isModalView ? "space-y-2 md:space-y-0" : ""
      }`}>
        {isAdminView
          ? adminNavOptions.map((item) => (
              <li key={item.id}>
                <button
                  className="nav-item"
                  onClick={() => router.push(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))
          : navOptions.map((item) => (
              <li key={item.id}>
                <button
                  className="nav-item"
                  onClick={() => {
                    if (item.submenu) {
                      setActiveDropdown(activeDropdown === item.id ? null : item.id);
                    } else {
                      item.path.startsWith("/")
                        ? router.push(item.path)
                        : (window.location.href = item.path);
                    }
                  }}
                >
                  {item.label}
                </button>
                {item.submenu && (
                  <div className={`dropdown-menu ${activeDropdown === item.id ? 'show' : ''}`}>
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        className="dropdown-item"
                        onClick={() => router.push(subItem.path)}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
      </ul>
    </div>
  );
}

export default function Navbar() {
  const {
    showNavModal,
    setShowNavModal,
    user,
    isAuthUser,
    setIsAuthUser,
    setUser,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    showCartModal,
    setShowCartModal,
  } = useContext(GlobalContext);

  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathName !== "/admin-view/add-product" && currentUpdatedProduct !== null)
      setCurrentUpdatedProduct(null);
  }, [pathName]);

  function handleLogout() {
    setIsAuthUser(false);
    setUser(null);
    Cookies.remove("token");
    localStorage.clear();
    router.push("/");
  }

  const isAdminView = pathName.includes("admin-view");

  return (
    <>
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                SDRB
              </span>
              <span className="text-sm font-medium text-gray-600 ml-1">
                Technologies
              </span>
            </div>

            <NavItems router={router} isAdminView={isAdminView} />

            <div className="flex items-center space-x-2">
              {!isAdminView && isAuthUser && (
                <Fragment>
                  <button
                    className="nav-button"
                    onClick={() => router.push("/account")}
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Account</span>
                  </button>
                  <button
                    className="nav-button"
                    onClick={() => setShowCartModal(true)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Cart</span>
                  </button>
                </Fragment>
              )}

              {user?.role === "admin" && (
                <button
                  className="nav-button"
                  onClick={() => router.push(isAdminView ? "/" : "/admin-view")}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">
                    {isAdminView ? "Client View" : "Admin View"}
                  </span>
                </button>
              )}

              {isAuthUser ? (
                <button onClick={handleLogout} className="nav-button">
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="nav-button"
                >
                  <User className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              <button
                className="md:hidden nav-button"
                onClick={() => setShowNavModal(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CommonModal
        showModalTitle={false}
        mainContent={
          <NavItems router={router} isModalView={true} isAdminView={isAdminView} />
        }
        show={showNavModal}
        setShow={setShowNavModal}
      />
      {showCartModal && <CartModal />}
    </>
  );
}