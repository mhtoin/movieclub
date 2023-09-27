
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function WebNavbar() {
  //const session = await getServerSession();
  const session = await getServerSession(authOptions);
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
                <Link href={"/home/shortlist"}>
                  <label tabIndex={0}>Shortlist</label>
                </Link>
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
                    <Link href={`/tierlists/${session?.user.userId}`}>
                      Edit
                    </Link>
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
                    <Link href={`/tierlists/${session?.user.userId}`}>Edit</Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        {
          <div className="navbar-end">
            {isAuthenticated ? (
              <div tabIndex={0} className="dropdown dropdown-end z-50">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={session?.user?.image} alt="P" />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href={"/profile"} className="justify-between">
                      Profile
                      <span className="badge">{session?.user?.name}</span>
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
            ) : (
              <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="16" height="16" viewBox="0 0 16 16"%3E%3Cpath fill="currentColor" fill-rule="evenodd" d="M8 14.5a6.47 6.47 0 0 0 3.25-.87V11.5A2.25 2.25 0 0 0 9 9.25H7a2.25 2.25 0 0 0-2.25 2.25v2.13A6.47 6.47 0 0 0 8 14.5Zm4.75-3v.937a6.5 6.5 0 1 0-9.5 0V11.5a3.752 3.752 0 0 1 2.486-3.532a3 3 0 1 1 4.528 0A3.752 3.752 0 0 1 12.75 11.5ZM8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16ZM9.5 6a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Z" clip-rule="evenodd"%2F%3E%3C%2Fsvg%3E'
                  }
                  alt="P"
                />
              </div>
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}
