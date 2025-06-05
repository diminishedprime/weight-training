import { Constants } from "@/database.types";
import Link from "next/link";
import { auth } from "@/auth";
import { liftTypeUIString } from "@/util";

export default async function Home() {
  const session = await auth();
  const liftTypes = Constants.public.Enums.lift_type_enum;

  return (
    <div className="flex flex-col gap-4 items-start p-8">
      <div className="p-4 flex flex-col gap-4">
        {liftTypes.map((type) => (
          <Link
            key={type}
            href={`/exercise/${type}`}
            className="w-auto min-w-[140px] px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 font-semibold transition text-center my-2"
            style={{ maxWidth: "220px" }}
          >
            {liftTypeUIString(type)}
          </Link>
        ))}
      </div>
    </div>
  );
}
