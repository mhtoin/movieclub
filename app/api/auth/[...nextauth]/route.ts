import "dotenv/config";
import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import { findOrCreateShortList } from "@/lib/shortlist";
import { updateUserImage } from "@/lib/user";
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      let currentImage = user?.image;
      let profileImg = profile?.image_url;

      if (currentImage && profileImg && currentImage !== profileImg) {
        await updateUserImage(user.id, profileImg);
        user.image = profileImg;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return "/home";
    },
    async session({ session, user, token }) {
      //console.log('session', session, user, token)
      session.user.profileId = token.profileId;
      session.user.userId = token.userId;
      session.user.username = token.globalName;
      session.user.shortlistId = token.userShortlistId;
      session.user.accountId = token.accountId;
      session.user.sessionId = token.sessionId;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (account && profile && user) {
        /**
         * Check on sign-in whether user has a shortlist
         * If not, create one
         * Regardless, attach shortlist id to token
         */
        const shortlist = await findOrCreateShortList(user.id);
        token.profileId = profile.id;
        token.globalName = profile.global_name;
        token.userId = user.id;
        token.sessionId = user.sessionId;
        token.accountId = user.accountId;
        token.userShortlistId = shortlist?.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: process.env.DISCORD_AUTH,
      // for now, need to disable checks for state cookie because production errors out
      checks: ["none"],
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
