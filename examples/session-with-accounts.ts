// Example usage of the updated session validation with provider account ID

import {
  getCurrentSession,
  getProviderAccountId,
} from "@/lib/authentication/session"

export async function exampleUsage() {
  // Get the current session with user and accounts
  const { session, user } = await getCurrentSession()

  if (!session || !user) {
    return { error: "Not authenticated" }
  }

  // Now the user object includes accounts array
  console.log("User accounts:", user.accounts)

  // Get provider account ID for a specific provider (e.g., 'discord', 'google', etc.)
  const discordAccountId = getProviderAccountId(user, "discord")
  const googleAccountId = getProviderAccountId(user, "google")

  return {
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    discordAccountId,
    googleAccountId,
    allAccounts: user.accounts.map((account) => ({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    })),
  }
}
