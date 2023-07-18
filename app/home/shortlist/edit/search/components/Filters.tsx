import { useQuery } from "@tanstack/react-query";
import FilterCheckbox from "./FilterCheckbox";

async function getFilters() {
  let res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.moviedbtoken}`,
      },
    }
  );

  let responseBody = await res.json();

  return responseBody;
}

export default function Filters() {
  const { data, status } = useQuery({
    queryKey: ["genres"],
    queryFn: getFilters,
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div className=" flex items-center z-60">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content z-100">
        {/* Page content here */}
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          Open drawer
        </label>
      </div>
      <div className="drawer-side z-60">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content z-60">
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
