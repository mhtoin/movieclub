import SearchButton from "../search/SearchButton";
import Menubar from "./Menubar";
import ProfileMenu from "./ProfileMenu";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import { cookies } from "next/headers";
export const NavBar = () => {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const accent = cookieStore.get("accent");
  return (
    <div className="min-w-screen flex items-center justify-center border-b p-2 z-50  bg-background">
      <div className="w-full lg:w-9/12 h-[70px] p-5 rounded hidden sm:flex justify-between items-center">
        {/**Right side */}
        <div className="flex items-center justify-center gap-5">
          {<Menubar />}
          <span className="font-bold">leffaseura</span>
        </div>
        <div className="flex gap-10 h-full items-center">
          <SearchButton />
          <ThemeSwitcher
            userTheme={theme?.value as "light" | "dark" | undefined}
            userAccentColor={accent?.value}
          />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};
