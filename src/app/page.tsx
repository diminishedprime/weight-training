import { Database } from "@/database.types";
import { createClient } from "@supabase/supabase-js";

export default async function Home() {
  // // Example on how to use supabase client side.
  //
  // // Some things I still need to figure out:
  // // 1. Do I care about row level security?
  // // 2. How to write postgres functions to do more complex transactions?
  // // 3. How to actually source control those more complecited functions?
  //
  // const supabase = await createClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // );
  // await supabase
  //   .from("deadlifts")
  //   .insert({
  //     actually_completed: true,
  //     completion_status: "completed",
  //     reps: 5,
  //     time: new Date().toISOString().toLocaleString(),
  //     warmup: false,
  //     weight_id: await supabase
  //       .from("weights")
  //       .insert({ weight_value: 45, weight_unit: "pounds" })
  //       .select()
  //       .single()
  //       .then(({ data }) => data!.id),
  //   })
  //   .select()
  //   .then((response) => {
  //     console.log({ response, data: response.data });
  //   });
  return <div>Main content of home page.</div>;
}
