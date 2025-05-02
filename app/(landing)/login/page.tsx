import { Button } from 'components/ui/Button'
import Link from 'next/link'

import { SiDiscord } from 'react-icons/si'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex h-96 w-96 flex-col items-center rounded-md border p-4">
        <h1 className="text-4xl font-bold">Login</h1>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Button variant="outline" className="flex gap-2" size="lg" asChild>
            <Link href="/login/discord">
              <SiDiscord />
              Login with Discord
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
