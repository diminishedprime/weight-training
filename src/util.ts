import { Database } from '@/database.types';
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

type LiftType = Database["public"]["Enums"]["lift_type_enum"];
export const liftTypeUIString = (type: LiftType): string => {
  switch (type) {
    case "deadlift":
      return "Deadlift";
    case "squat":
      return "Squat";
    case "bench_press":
      return "Bench Press";
    case "overhead_press":
      return "Overhead Press";
    case "row":
      return "Row";
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
  }
};

export const weightUnitUIString = (
  unit: Database["public"]["Enums"]["weight_unit_enum"]
): string => {
  switch (unit) {
    case "kilograms":
      return "kgs";
    case "pounds":
      return "lbs";
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = unit;
      return _exhaustiveCheck;
    }
  }
};

export const getSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export function requireId(
  session: Session | null,
  currentPath: string
): string {
  const id = session?.user?.id;
  if (!id) {
    const encoded = encodeURIComponent(currentPath);
    redirect(`/login?redirect-uri=${encoded}`);
  }
  return id;
}