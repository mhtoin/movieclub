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
            <label tabIndex={0} className="btn btn-ghost">
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
                <label tabIndex={0}>Shortlist</label>
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
                  <li>
                    <Link href={"/home/shortlist/raffle"}>Raffle</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href={"/tierlists"}>Tierlists</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center flex">
          <a className="btn btn-ghost normal-case text-xl">leffaseura</a>
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
