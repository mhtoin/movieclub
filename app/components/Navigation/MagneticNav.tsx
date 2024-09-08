import Link from "next/link";

export default function MagneticNav() {
  return (
    <nav data-magnetic>
      <ul>
        <li>
          <Link href={"/dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link href={"/home/shortlist"}>Shortlist</Link>
        </li>
        <li className="ml-8">
          <Link href={"/home/shortlist"}>Search</Link>
        </li>
        <li className="ml-8">
          <Link href={"/home/shortlist"}>Watchlist</Link>
        </li>
        <li>
          <Link href={"/tierlists"}>Tierlists</Link>
        </li>
        <li className="ml-8">
          <Link href={"/home/shortlist"}>Edit</Link>
        </li>
      </ul>
    </nav>
  );
}
