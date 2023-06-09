import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex min-w-screen flex-row items-center justify-evenly p-3">
        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-2 lg:text-left">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            <Link href={"/home/shortlist"}>Short list</Link>
          </h2>
          <h2 className={`mb-3 text-2xl font-semibold`}>Dashboard</h2>
        </div>
    </nav>
  );
}
