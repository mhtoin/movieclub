import Link from "next/link";
import { Button } from "../components/ui/Button";
import { SiDiscord } from "react-icons/si";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col border rounded-md p-4 w-96 h-96 items-center ">
        <h1 className="text-4xl font-bold">Login</h1>
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <Button variant="outline" className="flex gap-2" size="lg" asChild>
            <Link href="/login/discord">
              <SiDiscord />
              Login with Discord
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
