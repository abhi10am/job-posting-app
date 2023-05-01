import CustomLink from 'components/CustomLink'
import config from 'config/config'
import { useAuth } from 'contexts/auth'
import React from 'react'
import { NavLink } from 'react-router-dom'

const NavbarLink = ({ to, children }) => {
  return (
    <li>
      <NavLink to={to} className={({ isActive }) => {
          let classes = "block py-2 px-4 rounded-lg";
          classes += isActive ? " bg-primary-700 text-white" : " text-gray-700 hover:bg-gray-200 transition-colors";
          return classes;
        }}
      >
        {children}
      </NavLink>
    </li>
  )
}

const LogoutLink = () => {
  const { logout } = useAuth();

  return (
    <li>
      <span 
        className="block py-2 px-4 cursor-pointer rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
        onClick={() => logout()}
      >
        Logout
      </span>
    </li>
  )
}

const Navbar = () => {
  const { authState } = useAuth();
  const navigations = [
    {
      label: "Job Applications",
      to: "/admin/job-applications",
      roles: [config.roles.ADMIN]
    },
    {
      label: "Jobs",
      to: "/admin/jobs",
      roles: [config.roles.ADMIN]
    },
    {
      label: "Job Categories",
      to: "/admin/job-categories",
      roles: [config.roles.ADMIN]
    },
    {
      label: "Job Types",
      to: "/admin/job-types",
      roles: [config.roles.ADMIN]
    },
    {
      label: "Jobs",
      to: "/user/jobs",
      roles: [config.roles.USER]
    },
    {
      label: "Logout",
      to: "/logout",
      roles: [config.roles.ADMIN, config.roles.USER]
    }
  ];

  return (
    <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200 h-[70px]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <CustomLink to="/login" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap">Jobs Posting App</span>
        </CustomLink>
        <div className="md:hidden">
          <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-sticky" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-normal border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-4 md:mt-0 md:border-0 md:bg-white">
            {navigations.map((item, index) => {
              if (item.roles.includes(authState.user.role)) {
                return (item.label === "Logout") 
                  ? <LogoutLink key={index} />
                  : <NavbarLink key={index} to={item.to}>{item.label}</NavbarLink>
              }
              else {
                return "";
              }
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
