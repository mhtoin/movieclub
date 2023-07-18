import TierAdd from "@/app/tierlists/[id]/components/TierAdd";

export default function TierlistFormModal({
  tierlist,
  movie,
}: {
  tierlist: Tierlist;
  movie: MovieOfTheWeek;
}) {
  return (
    <div>
      <button className="btn" onClick={() => {
        if (document) {
          (document.getElementById('tierlistmodal') as HTMLFormElement).showModal()
        }
      }}>
        Add to tierlist
      </button>
      <dialog id="tierlistmodal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>

          <TierAdd tierlist={tierlist} movies={[movie]} />

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
