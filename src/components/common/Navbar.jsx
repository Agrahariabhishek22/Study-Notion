import React, { useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/MargdarshakLogo.jpg";
import NavbarLinks from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import { BsChevronDown } from "react-icons/bs"
import { AiOutlineMenu } from "react-icons/ai"
import { RiArrowDropDownLine } from "react-icons/ri";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";


const Navbar = () => {
  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  const [loading, setLoading] = useState(false)

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  // use selector data access karne ka tarika
  const { totalItems } = useSelector((state) => state.cart);

  const [subLinks, setSubLinks] = useState([]);

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      // console.log("Printing sublinks results: ", result);
      setSubLinks(result.data.allCategory);
    } catch (error) {
      console.log("Could not fetch the category list");
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  return (
    <div className="h-14 border-b-[1px] border-b-richblack-700 py-[8px]">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* image added */}
        <Link to="/">
        <img src={logo} className="h-[35px] max-h-full ml-2" loading="lazy" />
        </Link>
        {/* adding navlinks */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, idx) => {
              return (
                <li key={idx}>
                  {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : (subLinks && subLinks.length) ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-300"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ): (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* login signup dashboard */}

        <div className="flex gap-x-4 items-center">
          {user && user?.accountType != "Instructor" && (
            <Link to={"/dashboard/cart"} className="relative">
              <FaCartShopping />
              {
              totalItems > 0 &&
               <span>{totalItems}</span>
               }
            </Link>
          )}
          {token === null && (
            <Link to={"/login"}>
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded">
                Login
              </button>
            </Link>
          )}
          {token === null && (
            <Link to={"/signup"}>
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded">
                Signup
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
