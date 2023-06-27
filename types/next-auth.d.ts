import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      userId: string
      profileId: string
      sessionId: string
      accountId: number
    } & DefaultSession["user"]
  }

  interface User {
    sessionId: string
    accountId: number
  }

  interface Profile {
    id: string
    global_name: string
  } 
}