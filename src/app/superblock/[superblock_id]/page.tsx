import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import { Typography, Box } from "@mui/material";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExerciseBlockList from "./ExerciseBlockList";

interface SuperblockPageProps {
  params: Promise<{ superblock_id: string }>;
}

function groupBlocks(
  rows: Database["public"]["Functions"]["get_exercise_blocks_for_superblock"]["Returns"]
): Array<import("./ExerciseBlockList").GroupedBlock> {
  const blocks: Record<string, any> = {};
  for (const row of rows) {
    if (!blocks[row.block_id]) {
      blocks[row.block_id] = {
        block_id: row.block_id,
        block_order: row.block_order,
        name: row.name,
        notes: row.notes,
        created_at: row.created_at,
        updated_at: row.updated_at,
        exercises: [],
      };
    }
    if (row.exercise_id) {
      blocks[row.block_id].exercises.push(row);
    }
  }
  return Object.values(blocks).sort((a, b) => a.block_order - b.block_order);
}

export default async function SuperblockPage({ params }: SuperblockPageProps) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { superblock_id } = await params;
  // Fetch superblock metadata
  const { data: superblock, error: sbError } = await supabase
    .from("exercise_superblock")
    .select("name, notes")
    .eq("id", superblock_id)
    .single();

  // Fetch exercise blocks for this superblock
  const { data: blocks, error } = await supabase.rpc(
    "get_exercise_blocks_for_superblock",
    {
      p_superblock_id: superblock_id,
    }
  );

  const groupedBlocks = blocks ? groupBlocks(blocks) : [];

  console.log({ blocks, error });

  if (sbError || !superblock) {
    return <Typography>Superblock not found.</Typography>;
  }
  return (
    <>
      <Breadcrumbs
        pathname={`/superblock/${superblock_id}`}
        labels={{ [superblock_id]: `(${superblock_id.slice(0, 8)})` }}
      />
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
        <Typography variant="h4" mb={2}>
          {superblock.name}
        </Typography>
        <Typography variant="body1" mb={2}>
          {superblock.notes}
        </Typography>
      </Box>
      <ExerciseBlockList blocks={groupedBlocks} />
    </>
  );
}
