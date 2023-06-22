import { getServerSession } from "@/lib/getServerSession";
import Link from "next/link";

export default async function NavBar() {
  const session = await getServerSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-w-screen flex justify-center">
      <div className="navbar rounded-box my-10 border w-9/12 bg-transparent">
        <div className="navbar-start">
          <div tabIndex={0} className="dropdown z-50">
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
                <a>Shortlist</a>
                <ul tabIndex={0} className="p-2">
                  <li>
                    <Link href={"/home/shortlist"}>View all</Link>
                  </li>
                  <li>
                    <Link href={"/home/shortlist/edit"}>Edit</Link>
                  </li>
                  <li>
                    <Link href={"/home/shortlist/raffle"}>Raffle</Link>
                  </li>
                </ul>
              </li>
              <li>
              <Link href={"/home/shortlist/raffle"}>Tierlists</Link>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost normal-case text-xl">leffaseura</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul tabIndex={0} className="menu menu-horizontal px-1 z-50">
            <li>
              <Link href={"/home"}>Home</Link>
            </li>
            <li tabIndex={0}>
              <details tabIndex={0} >
                <summary tabIndex={0}>Shortlist</summary>
                <ul tabIndex={0} className="p-2">
                  <li>
                    <Link href={"/home/shortlist"}>View all</Link>
                  </li>
                  <li>
                    <Link href={"/home/shortlist/edit"}>Edit</Link>
                  </li>
                  <li>
                    <Link href={"/home/shortlist/raffle"}>Raffle</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li tabIndex={0}>
            <details tabIndex={0}>
              <summary tabIndex={0}>Tierlists</summary>
              <ul tabIndex={0}>
                <li >
                <Link href={"/tierlists"}>All</Link>
                </li>
                <li>
                <Link href={"/home/shortlist/tierlists"}>Edit</Link>
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
                  <a className="justify-between">
                    Profile
                    <span className="badge">{session.user?.name}</span>
                  </a>
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
