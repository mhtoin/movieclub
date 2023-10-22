"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function WebNavbar() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-w-screen hidden justify-center sm:flex">
      <div className="navbar rounded-box my-10 border w-9/12 bg-transparent">
        <div className="navbar-start">
          {/** dropdown for smaller screens */}
          <div className="dropdown z-50">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={"/home"}>Home</Link>
              </li>
              <li>
                <Link href={"/dashboard"}>Dashboard</Link>
              </li>
              <li>
                <Link href={"/home/shortlist"}><label tabIndex={0}>Shortlist</label></Link>
                <ul tabIndex={0} className="p-2">
                  <li>
                    <Link href={"/home/shortlist"}>View all</Link>
                  </li>
                  <li>
                    <label tabIndex={0}>
                      {" "}
                      <Link href={"/home/shortlist/edit"}>Edit</Link>
                    </label>
                    <ul tabIndex={0} className="p-2">
                      <li>
                        <Link href={"/home/shortlist/edit/search"}>Search</Link>
                      </li>
                      <li>
                        <Link href={"/home/shortlist/edit/watchlist"}>
                          Watchlist
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <Link href={"/tierlists"}>Tierlists</Link>
                <ul tabIndex={0} className="p-2">
                <li>
                    <Link href={`/tierlists/${session?.user.userId}`}>Edit</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost normal-case text-xl">leffaseura</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-lg menu-horizontal px-1">
            <li>
              <Link href={"/home"}>Home</Link>
            </li>
            <li>
              <Link href={"/dashboard"}>Dashboard</Link>
            </li>
            <li tabIndex={0} className="z-50">
              <details>
                <summary>Shortlist</summary>
                <ul className="p-2">
                  <li>
                  <Link href={"/home/shortlist"}>All</Link>
                  </li>
                  <li>
                  <Link href={"/home/shortlist/edit"}>Edit</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li tabIndex={0}>
              <details>
                <summary>Tierlist</summary>
                <ul className="p-2">
                  <li>
                  <Link href={"/tierlists"}>All</Link>
                  </li>
                  <li>
                  <Link href={"/tierlists/edit"}>Edit</Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        {isAuthenticated && (
          <div className="navbar-end">
            <div tabIndex={0} className="dropdown dropdown-end z-50">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={session.user?.image} />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href={"/profile"} className="justify-between">
                    Profile
                    <span className="badge">{session.user?.name}</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <Link href="/api/auth/signout">Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
