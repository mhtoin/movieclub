import Search from "@/app/components/search/Search";
import SearchModal from "@/app/components/search/SearchModal";

export default function Page() {
  console.log("intercepted");
  return (
    <SearchModal>
      <Search />
    </SearchModal>
  );
}
