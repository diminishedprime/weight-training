import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

export default async function Banner() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link
        href="/"
        className="text-lg font-bold hover:underline focus:outline-none"
      >
        Weight Training
      </Link>
      <div>
        {user ? (
          <div className="flex items-center">
            <img
              src={user.image || ""}
              alt={user.name || "User"}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>{user.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Sign in with Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
