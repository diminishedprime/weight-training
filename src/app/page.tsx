import { Database, Constants } from "@/database.types";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";

// Use the generated type for the function return
type WendlerLiftGroupDetailsRow =
  Database["public"]["Functions"]["get_wendler_lift_group_details"]["Returns"][number];

export default async function Home() {
  // Remove useState and make Home an async function again
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get the current session and user from the exported auth promise
  const session = await auth();
  let wendlerResult: WendlerLiftGroupDetailsRow[] | null = null;
  let wendlerError: unknown = null;

  if (session && session.user && session.user.id) {
    const userId = session.user.id;

    // Call create_wendler_lift_session_5s
    const { data: createData, error: createError } = await supabase.rpc(
      "create_wendler_lift_session_5s",
      {
        p_user_id: userId,
        p_training_max_lbs: 200,
        p_increase_amount_lbs: 5,
        p_lift_type: "deadlift",
      }
    );

    if (!createError && createData) {
      const liftGroupId = Array.isArray(createData)
        ? createData[0]
        : createData;
      // Call get_wendler_lift_group_details
      const { data: detailsData, error: detailsError } = await supabase.rpc(
        "get_wendler_lift_group_details",
        { p_lift_group_id: liftGroupId }
      );
      wendlerResult = detailsData;
      wendlerError = detailsError;
    } else {
      wendlerError = createError;
    }
  } else {
    wendlerError = "No active session or user.";
  }

  return (
    <div>
      Main content of home page.
      <a href="/next-test">Go to Next Test Page</a>
      <div style={{ marginTop: 24 }}>
        <strong>Wendler Result:</strong>
        {Array.isArray(wendlerResult) && wendlerResult.length > 0 ? (
          <table border={1} cellPadding={6} style={{ marginTop: 12 }}>
            <thead>
              <tr>
                {Object.keys(wendlerResult[0])
                  .filter(
                    (key) =>
                      ![
                        "lift_group_id",
                        "user_id",
                        "lift_id",
                        "training_max",
                        "training_max_unit",
                        "increase_amount",
                        "increase_amount_unit",
                        "weight_value",
                        "weight_unit",
                      ].includes(key)
                  )
                  .concat([
                    "training_max_combined",
                    "increase_amount_combined",
                    "weight_combined",
                  ])
                  .map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {wendlerResult.map((row, idx) => {
                // Combine value/unit fields for display
                const training_max_combined = `${row.training_max} ${row.training_max_unit}`;
                const increase_amount_combined = `${row.increase_amount} ${row.increase_amount_unit}`;
                const weight_combined = `${row.weight_value} ${row.weight_unit}`;
                return (
                  <tr key={idx}>
                    {Object.entries(row)
                      .filter(
                        ([key]) =>
                          ![
                            "lift_group_id",
                            "user_id",
                            "lift_id",
                            "training_max",
                            "training_max_unit",
                            "increase_amount",
                            "increase_amount_unit",
                            "weight_value",
                            "weight_unit",
                          ].includes(key)
                      )
                      .map(([_, val], i) => (
                        <td key={i}>
                          {val === null
                            ? ""
                            : typeof val === "string" && val.length > 32
                            ? val.slice(0, 32) + "..."
                            : val?.toString()}
                        </td>
                      ))}
                    <td>{training_max_combined}</td>
                    <td>{increase_amount_combined}</td>
                    <td>{weight_combined}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <pre>{JSON.stringify(wendlerResult, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
