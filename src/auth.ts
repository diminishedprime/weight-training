import { SupabaseAdapter } from "@auth/supabase-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      // TODO - Remove this once it's no longer needed.
      //
      // This is only temporarily needed during development where we are
      // constantly re-seeding the database. Once we have actually run all our
      // migrations, and have real database state to go off of, we should be
      // able to remove this.
      //
      // This is all because I'm currently importing existing exercise data and
      // it needs a dangeling account so it's not orphaned.
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
});
