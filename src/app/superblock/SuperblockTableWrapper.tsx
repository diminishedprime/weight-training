import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import SuperblockTable from "./SuperblockTable";

interface SuperblockTableWrapperProps {
  userId: string;
}

export default async function SuperblockTableWrapper({
  userId,
}: SuperblockTableWrapperProps) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.rpc("get_superblocks_for_user", {
    p_user_id: userId,
  });
  console.log({ error });
  if (error) {
    return <div>Error loading superblocks: {error.message}</div>;
  }
  return <SuperblockTable superblocks={data || []} />;
}
