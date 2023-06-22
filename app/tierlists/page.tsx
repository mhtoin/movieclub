import Link from "next/link";
import { redirect } from "next/navigation";

async function createNew() {
    "use server"
    redirect('edit')
}

export default async function Tierlists() {
  return (
    <div className="flex flex-col items-center">
      <div>Tierlists</div>
      <div>
        <form action={createNew}>
          <button className="btn btn-primary" type="submit">
            Create new
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z" /></svg>
            </button>
        </form>
      </div>
    </div>
  );
}
