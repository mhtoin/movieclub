import { getCurrentSession } from "@/lib/authentication/session"

import Shortlists from "components/shortlist/Shortlists"
import { redirect } from "next/navigation"

export default async function ShortList() {
  const { user } = await getCurrentSession()

  if (!user) {
    redirect("/")
  }

  return <Shortlists />
}
