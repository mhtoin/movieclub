import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"

import 'dotenv/config'
import clientPromise from "@/lib/mongo";
export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: 'movieclub'

    }),
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            //console.log('signin callback', user, account, profile, email, credentials)
            return true
        },
        async redirect({ url, baseUrl }) {
            console.log('redirecting', url, baseUrl)
            return '/home'
        },
        async session({ session, user, token }) {
            console.log('session callback')
            console.log('session session', session)
            console.log('session user', user)
            console.log('session token', token)
            session.user.profileId = token.profileId
            session.user.userId = token.userId
            session.user.username = token.globalName
            return session
        },
        async jwt({ token, user, account, profile }) {
            console.log('jwt callback')
            console.log('jwt token', token)
            console.log('jwt user', user)
            console.log('jwt profile', profile)
            console.log('jwt account', account)
            if (account && profile && user) {
                token.profileId = profile.id
                token.globalName = profile.global_name
                token.userId= user.id
            }
            return token
          }
    },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID ?? '',
            clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
            authorization: process.env.DISCORD_AUTH
          })
    ],
    session: {
        strategy: 'jwt'
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
